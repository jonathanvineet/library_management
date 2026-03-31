package com.library.dto;

import com.library.model.Book;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String genre;
    private Integer totalCopies;
    private Integer availableCopies;
    private BigDecimal returnPeriodDays;
    private String status;
    private String category; // Alias for genre
    private LocalDateTime createdAt;
    
    public BookResponse(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.isbn = book.getIsbn();
        this.genre = book.getGenre();
        this.category = book.getGenre(); // Frontend uses 'category'
        this.totalCopies = book.getTotalCopies();
        this.availableCopies = book.getAvailableCopies();
        this.returnPeriodDays = book.getReturnPeriodDays();
        this.status = (book.getAvailableCopies() != null && book.getAvailableCopies() > 0) 
            ? "AVAILABLE" 
            : "OUT_OF_STOCK";
        this.createdAt = book.getCreatedAt();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public String getGenre() { return genre; }
    public String getCategory() { return category; }
    public Integer getTotalCopies() { return totalCopies; }
    public Integer getAvailableCopies() { return availableCopies; }
    public BigDecimal getReturnPeriodDays() { return returnPeriodDays; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
