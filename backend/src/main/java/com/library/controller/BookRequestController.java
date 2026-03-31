package com.library.controller;

import com.library.dto.BookRequestDTO;
import com.library.dto.BookRequestResponse;
import com.library.service.BookRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/book-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class BookRequestController {
    
    @Autowired
    private BookRequestService bookRequestService;
    
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(
        @RequestBody BookRequestDTO dto,
        @RequestHeader(value = "X-User-Id", required = false) String userIdHeader
    ) {
        try {
            System.out.println("Received book request - BookId: " + dto.getBookId() + ", User-Id Header: " + userIdHeader);
            
            // For now, get userId from header or session
            // In production, this should come from JWT token
            Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 1L;
            
            System.out.println("Processing request for userId: " + userId);
            
            BookRequestResponse response = bookRequestService.createRequest(userId, dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating book request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<BookRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(bookRequestService.getAllRequests());
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<BookRequestResponse>> getPendingRequests() {
        return ResponseEntity.ok(bookRequestService.getPendingRequests());
    }
    
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<BookRequestResponse>> getRequestsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookRequestService.getRequestsByUser(userId));
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookRequestResponse> approveRequest(
        @PathVariable Long id,
        @RequestBody(required = false) Map<String, Integer> body
    ) {
        Integer daysToReturn = (body != null && body.containsKey("daysToReturn")) ? body.get("daysToReturn") : null;
        return ResponseEntity.ok(bookRequestService.approveRequest(id, daysToReturn));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookRequestResponse> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(bookRequestService.rejectRequest(id));
    }
}
