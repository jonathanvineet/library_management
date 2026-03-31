package com.library.dto;

import com.library.model.Transaction;
import com.library.model.Book;
import com.library.model.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TransactionResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Long memberId;
    private String memberName;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;
    private BigDecimal fineAmount;
    private BigDecimal finePaid; // Amount of fine that was paid
    private String notes;
    
    public TransactionResponse(Transaction transaction, Book book, User user) {
        this.id = transaction.getId();
        this.bookId = transaction.getBookId();
        this.bookTitle = book != null ? book.getTitle() : "Unknown";
        this.memberId = transaction.getMemberId();
        this.memberName = user != null ? user.getName() : "Unknown";
        this.borrowDate = transaction.getBorrowDate();
        this.dueDate = transaction.getDueDate();
        this.returnDate = transaction.getReturnDate();
        this.status = transaction.getStatus();
        this.fineAmount = transaction.getFineAmount();
        this.notes = transaction.getNotes();
        
        // Extract paid fine amount from notes
        this.finePaid = extractFinePaidFromNotes(transaction.getNotes());
    }
    
    private BigDecimal extractFinePaidFromNotes(String notes) {
        if (notes == null || notes.isEmpty()) {
            return null;
        }
        
        // Pattern to match "Fine of ₹X.XX paid on"
        Pattern pattern = Pattern.compile("Fine of ₹([0-9]+\\.?[0-9]*) paid on");
        Matcher matcher = pattern.matcher(notes);
        
        if (matcher.find()) {
            try {
                return new BigDecimal(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        
        return null;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    
    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public BigDecimal getFineAmount() { return fineAmount; }
    public void setFineAmount(BigDecimal fineAmount) { this.fineAmount = fineAmount; }
    
    public BigDecimal getFinePaid() { return finePaid; }
    public void setFinePaid(BigDecimal finePaid) { this.finePaid = finePaid; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
