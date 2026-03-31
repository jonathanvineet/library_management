package com.library.dto;

import com.library.model.BookRequest;
import com.library.model.Book;
import com.library.model.User;
import java.time.LocalDateTime;

public class BookRequestResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private Long memberId;
    private String memberName;
    private String memberEmail;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime responseDate;
    
    public BookRequestResponse(BookRequest request, Book book, User user) {
        this.id = request.getId();
        this.bookId = request.getBookId();
        this.bookTitle = book != null ? book.getTitle() : "Unknown";
        this.bookAuthor = book != null ? book.getAuthor() : "Unknown";
        this.memberId = request.getUserId();
        this.memberName = user != null ? user.getName() : "Unknown";
        this.memberEmail = user != null ? user.getEmail() : "Unknown";
        this.status = request.getStatus();
        this.requestDate = request.getRequestDate();
        this.responseDate = request.getResponseDate();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getBookId() { return bookId; }
    public String getBookTitle() { return bookTitle; }
    public String getBookAuthor() { return bookAuthor; }
    public Long getMemberId() { return memberId; }
    public String getMemberName() { return memberName; }
    public String getMemberEmail() { return memberEmail; }
    public String getStatus() { return status; }
    public LocalDateTime getRequestDate() { return requestDate; }
    public LocalDateTime getResponseDate() { return responseDate; }
}
