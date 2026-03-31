package com.library.dto;

import java.math.BigDecimal;

public class BookRequest {
    private String title;
    private String author;
    private String isbn;
    private String category; // Frontend sends 'category'
    private Integer totalCopies;
    private Integer availableCopies; // Admin can set this manually
    private BigDecimal returnPeriodDays;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }
    
    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }
    
    public BigDecimal getReturnPeriodDays() { return returnPeriodDays; }
    public void setReturnPeriodDays(BigDecimal returnPeriodDays) { this.returnPeriodDays = returnPeriodDays; }
}
