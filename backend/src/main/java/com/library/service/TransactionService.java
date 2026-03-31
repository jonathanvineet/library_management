package com.library.service;

import com.library.model.Transaction;
import com.library.model.Book;
import com.library.model.User;
import com.library.model.BookRequest;
import com.library.repository.TransactionRepository;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.repository.BookRequestRepository;
import com.library.dto.TransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRequestRepository bookRequestRepository;
    
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
            .map(this::calculateFineAndUpdateStatus)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public List<TransactionResponse> getTransactionsByMember(Long memberId) {
        return transactionRepository.findByMemberId(memberId).stream()
            .map(this::calculateFineAndUpdateStatus)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public List<TransactionResponse> getTransactionsByStatus(String status) {
        return transactionRepository.findByStatus(status).stream()
            .map(this::calculateFineAndUpdateStatus)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public TransactionResponse returnBook(Long transactionId) {
        try {
            System.out.println("Processing return request for transaction ID: " + transactionId);
            
            Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));
            
            System.out.println("Found transaction: bookId=" + transaction.getBookId() + 
                             ", memberId=" + transaction.getMemberId() + 
                             ", status=" + transaction.getStatus());
            
            if ("RETURNED".equals(transaction.getStatus())) {
                throw new RuntimeException("Book has already been returned");
            }
            
            if ("RETURN_PENDING".equals(transaction.getStatus())) {
                throw new RuntimeException("Return request is already pending approval");
            }
            
            // Mark as return pending (waiting for admin approval)
            transaction.setStatus("RETURN_PENDING");
            Transaction updated = transactionRepository.save(transaction);
            
            System.out.println("Return request created successfully for transaction: " + transactionId);
            
            return toResponse(updated);
        } catch (Exception e) {
            System.err.println("Error in returnBook: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process return request: " + e.getMessage(), e);
        }
    }
    
    public TransactionResponse approveReturn(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!"RETURN_PENDING".equals(transaction.getStatus())) {
            throw new RuntimeException("No pending return request for this transaction");
        }
        
        // Calculate final fine if overdue
        calculateFineAndUpdateStatus(transaction);
        
        // Mark as returned
        transaction.setReturnDate(LocalDate.now());
        transaction.setStatus("RETURNED");
        
        // Increase available copies
        Book book = bookRepository.findById(transaction.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        
        // Update book_request status to COMPLETED so user can request again
        List<BookRequest> approvedRequests = bookRequestRepository.findByUserId(transaction.getMemberId()).stream()
            .filter(req -> req.getBookId().equals(transaction.getBookId()) && "APPROVED".equals(req.getStatus()))
            .collect(Collectors.toList());
        
        for (BookRequest request : approvedRequests) {
            request.setStatus("COMPLETED");
            bookRequestRepository.save(request);
            System.out.println("Marked book request " + request.getId() + " as COMPLETED");
        }
        
        Transaction updated = transactionRepository.save(transaction);
        System.out.println("Return approved: " + book.getTitle() + ", Available copies now: " + book.getAvailableCopies());
        
        return toResponse(updated);
    }
    
    public TransactionResponse payFine(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (transaction.getFineAmount() == null || transaction.getFineAmount().compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("No fine to pay for this transaction");
        }
        
        // Mark fine as paid by setting it to 0
        BigDecimal paidAmount = transaction.getFineAmount();
        transaction.setFineAmount(BigDecimal.ZERO);
        
        // Add note about payment
        String paymentNote = "Fine of ₹" + paidAmount + " paid on " + LocalDate.now();
        if (transaction.getNotes() != null && !transaction.getNotes().isEmpty()) {
            transaction.setNotes(transaction.getNotes() + "; " + paymentNote);
        } else {
            transaction.setNotes(paymentNote);
        }
        
        Transaction updated = transactionRepository.save(transaction);
        System.out.println("Fine paid: ₹" + paidAmount + " for transaction " + transactionId);
        
        return toResponse(updated);
    }
    
    private Transaction calculateFineAndUpdateStatus(Transaction transaction) {
        // Only calculate fine for borrowed books (not returned)
        if ("BORROWED".equals(transaction.getStatus()) && transaction.getReturnDate() == null) {
            // Get the book to check if it has fractional return period (for testing)
            Book book = bookRepository.findById(transaction.getBookId()).orElse(null);
            boolean isFractionalDayTesting = book != null && book.getReturnPeriodDays() != null && 
                                            book.getReturnPeriodDays().scale() > 0 && 
                                            book.getReturnPeriodDays().compareTo(new BigDecimal("1")) < 0;
            
            if (isFractionalDayTesting) {
                // For fractional days (testing mode), calculate based on minutes from borrow time
                // Assume borrow happened at start of borrow_date
                java.time.LocalDateTime borrowDateTime = transaction.getBorrowDate().atStartOfDay();
                java.time.LocalDateTime nowDateTime = java.time.LocalDateTime.now();
                long minutesElapsed = ChronoUnit.MINUTES.between(borrowDateTime, nowDateTime);
                
                // Calculate how many minutes the book was allowed
                double allowedMinutes = book.getReturnPeriodDays().doubleValue() * 1440; // 1 day = 1440 minutes
                long minutesOverdue = minutesElapsed - (long) allowedMinutes;
                
                if (minutesOverdue > 0) {
                    // Calculate fine: ₹2 per day, proportional for minutes
                    // 1 day = 1440 minutes, so ₹2/1440 per minute = ₹0.00139 per minute
                    BigDecimal finePerMinute = new BigDecimal("0.00139");
                    BigDecimal totalFine = finePerMinute.multiply(new BigDecimal(minutesOverdue));
                    
                    // Only update if fine amount or status has changed
                    boolean needsUpdate = false;
                    if (transaction.getFineAmount() == null || transaction.getFineAmount().compareTo(totalFine) != 0) {
                        transaction.setFineAmount(totalFine);
                        needsUpdate = true;
                    }
                    if (!"OVERDUE".equals(transaction.getStatus())) {
                        transaction.setStatus("OVERDUE");
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        transactionRepository.save(transaction);
                        System.out.println("Transaction " + transaction.getId() + " is overdue by " + minutesOverdue + " minutes (fractional day testing). Fine: ₹" + totalFine);
                    }
                }
            } else {
                // Normal day-based calculation
                LocalDate today = LocalDate.now();
                LocalDate dueDate = transaction.getDueDate();
                
                if (today.isAfter(dueDate)) {
                    // Book is overdue - calculate fine based on days
                    long daysOverdue = ChronoUnit.DAYS.between(dueDate, today);
                    
                    if (daysOverdue > 0) {
                        BigDecimal finePerDay = new BigDecimal("2.00");
                        BigDecimal totalFine = finePerDay.multiply(new BigDecimal(daysOverdue));
                        
                        // Only update if fine amount or status has changed
                        boolean needsUpdate = false;
                        if (transaction.getFineAmount() == null || transaction.getFineAmount().compareTo(totalFine) != 0) {
                            transaction.setFineAmount(totalFine);
                            needsUpdate = true;
                        }
                        if (!"OVERDUE".equals(transaction.getStatus())) {
                            transaction.setStatus("OVERDUE");
                            needsUpdate = true;
                        }
                        
                        if (needsUpdate) {
                            transactionRepository.save(transaction);
                            System.out.println("Transaction " + transaction.getId() + " is overdue by " + daysOverdue + " days. Fine: ₹" + totalFine);
                        }
                    }
                }
            }
        }
        return transaction;
    }
    
    private TransactionResponse toResponse(Transaction transaction) {
        Book book = bookRepository.findById(transaction.getBookId()).orElse(null);
        User user = userRepository.findById(transaction.getMemberId()).orElse(null);
        return new TransactionResponse(transaction, book, user);
    }
}
