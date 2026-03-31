package com.library.service;

import com.library.model.BookRequest;
import com.library.model.Book;
import com.library.model.User;
import com.library.model.Transaction;
import com.library.repository.BookRequestRepository;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.repository.TransactionRepository;
import com.library.dto.BookRequestDTO;
import com.library.dto.BookRequestResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookRequestService {
    
    @Autowired
    private BookRequestRepository bookRequestRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public BookRequestResponse createRequest(Long userId, BookRequestDTO dto) {
        System.out.println("BookRequestService.createRequest - userId: " + userId + ", bookId: " + dto.getBookId());
        
        // Check if user already has a pending or approved request for this book
        List<BookRequest> existingRequests = bookRequestRepository.findByUserId(userId).stream()
            .filter(req -> req.getBookId().equals(dto.getBookId()) && 
                          ("PENDING".equals(req.getStatus()) || "APPROVED".equals(req.getStatus())))
            .collect(Collectors.toList());
        
        if (!existingRequests.isEmpty()) {
            throw new RuntimeException("You already have a request for this book. Please wait for it to be processed.");
        }
        
        // Check if user has reached the 3-request limit (pending + approved)
        long activeRequestCount = bookRequestRepository.findByUserId(userId).stream()
            .filter(req -> "PENDING".equals(req.getStatus()) || "APPROVED".equals(req.getStatus()))
            .count();
        
        if (activeRequestCount >= 3) {
            throw new RuntimeException("You have reached the maximum limit of 3 book requests. Please wait for your current requests to be processed or return a book.");
        }
        
        Book book = bookRepository.findById(dto.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found with ID: " + dto.getBookId()));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        System.out.println("Found book: " + book.getTitle() + ", Found user: " + user.getName());
        
        BookRequest request = new BookRequest();
        request.setBookId(dto.getBookId());
        request.setUserId(userId);
        request.setStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());
        
        BookRequest saved = bookRequestRepository.save(request);
        System.out.println("Saved book request with ID: " + saved.getId());
        
        return new BookRequestResponse(saved, book, user);
    }
    
    public List<BookRequestResponse> getAllRequests() {
        return bookRequestRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public List<BookRequestResponse> getPendingRequests() {
        return bookRequestRepository.findByStatus("PENDING").stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public List<BookRequestResponse> getRequestsByUser(Long userId) {
        return bookRequestRepository.findByUserId(userId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public BookRequestResponse approveRequest(Long requestId, Integer daysToReturn) {
        try {
            BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
            
            // Reduce available copies of the book first
            Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
            
            if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
                throw new RuntimeException("No copies available for this book");
            }
            
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
            
            // Use book's default return period if not specified
            // Convert BigDecimal to long for plusDays (supports fractional days for testing)
            long returnPeriodDays;
            if (daysToReturn != null && daysToReturn > 0) {
                returnPeriodDays = daysToReturn;
            } else if (book.getReturnPeriodDays() != null && book.getReturnPeriodDays().compareTo(java.math.BigDecimal.ZERO) > 0) {
                returnPeriodDays = book.getReturnPeriodDays().longValue();
            } else {
                returnPeriodDays = 14;
            }
            
            // For fractional days (testing), calculate due date with time precision
            LocalDate dueDate;
            if (book.getReturnPeriodDays() != null && book.getReturnPeriodDays().scale() > 0) {
                // Fractional days - convert to minutes and add to current time
                double totalMinutes = book.getReturnPeriodDays().doubleValue() * 1440; // 1 day = 1440 minutes
                java.time.LocalDateTime dueDateTimeStart = LocalDate.now().atStartOfDay();
                java.time.LocalDateTime dueDateTime = dueDateTimeStart.plusMinutes((long) totalMinutes);
                dueDate = dueDateTime.toLocalDate();
            } else {
                // Whole days
                dueDate = LocalDate.now().plusDays(returnPeriodDays);
            }
            
            // Create a transaction for the approved request
            Transaction transaction = new Transaction();
            transaction.setBookId(request.getBookId());
            transaction.setMemberId(request.getUserId());
            transaction.setBorrowDate(LocalDate.now());
            transaction.setDueDate(dueDate);
            transaction.setStatus("BORROWED");
            // Let database handle created_at with default value
            // Don't set nullable fields - let Hibernate handle them
            
            System.out.println("Creating transaction: bookId=" + transaction.getBookId() + 
                             ", memberId=" + transaction.getMemberId() + 
                             ", borrowDate=" + transaction.getBorrowDate() + 
                             ", dueDate=" + transaction.getDueDate() + 
                             ", returnPeriod=" + book.getReturnPeriodDays() + " days" +
                             ", status=" + transaction.getStatus());
            
            transactionRepository.save(transaction);
            
            // Update the book request status
            request.setStatus("APPROVED");
            request.setResponseDate(LocalDateTime.now());
            BookRequest updated = bookRequestRepository.save(request);
            
            return toResponse(updated);
        } catch (Exception e) {
            // Log the error and rethrow
            System.err.println("Error in approveRequest: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to approve request: " + e.getMessage(), e);
        }
    }
    
    public BookRequestResponse rejectRequest(Long requestId) {
        BookRequest request = bookRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus("REJECTED");
        request.setResponseDate(LocalDateTime.now());
        
        BookRequest updated = bookRequestRepository.save(request);
        return toResponse(updated);
    }
    
    private BookRequestResponse toResponse(BookRequest request) {
        Book book = bookRepository.findById(request.getBookId()).orElse(null);
        User user = userRepository.findById(request.getUserId()).orElse(null);
        return new BookRequestResponse(request, book, user);
    }
}
