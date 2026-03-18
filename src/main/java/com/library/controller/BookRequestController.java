package com.library.controller;

import com.library.model.BookRequest;
import com.library.service.BookRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/book-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookRequestController {

    private final BookRequestService bookRequestService;

    @PostMapping("/request")
    public ResponseEntity<?> requestBook(@RequestBody Map<String, Object> request) {
        try {
            UUID bookId = UUID.fromString(request.get("bookId").toString());

            BookRequest created;
            if (request.containsKey("userId") && request.get("userId") != null) {
                UUID userId = UUID.fromString(request.get("userId").toString());
                created = bookRequestService.requestBook(bookId, userId);
            } else if (request.containsKey("memberId") && request.get("memberId") != null) {
                Long memberId = Long.valueOf(request.get("memberId").toString());
                created = bookRequestService.requestBookByMemberId(bookId, memberId);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BookRequest>> getPendingRequests() {
        return ResponseEntity.ok(bookRequestService.getPendingRequests());
    }

    @GetMapping("/member/{memberOrUserId}")
    public ResponseEntity<?> getMemberRequests(@PathVariable String memberOrUserId) {
        try {
            if (memberOrUserId.contains("-")) {
                UUID userId = UUID.fromString(memberOrUserId);
                return ResponseEntity.ok(bookRequestService.getRequestsByUser(userId));
            }

            Long memberId = Long.valueOf(memberOrUserId);
            return ResponseEntity.ok(bookRequestService.getRequestsByMemberId(memberId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable UUID requestId) {
        try {
            return ResponseEntity.ok(bookRequestService.approveRequest(requestId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable UUID requestId, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String reason = payload == null ? null : payload.get("reason");
            return ResponseEntity.ok(bookRequestService.rejectRequest(requestId, reason));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
