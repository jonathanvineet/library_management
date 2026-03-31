package com.library.controller;

import com.library.model.Book;
import com.library.dto.BookResponse;
import com.library.dto.BookRequest;
import com.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        List<BookResponse> response = books.stream()
            .map(BookResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(new BookResponse(book));
    }
    
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setGenre(request.getCategory()); // Map category to genre
        book.setTotalCopies(request.getTotalCopies());
        // Use provided availableCopies, or default to totalCopies if not provided
        book.setAvailableCopies(request.getAvailableCopies() != null ? request.getAvailableCopies() : request.getTotalCopies());
        book.setReturnPeriodDays(request.getReturnPeriodDays());
        book.setCreatedAt(LocalDateTime.now());
        
        System.out.println("Creating book: " + book.getTitle() + 
                         ", totalCopies=" + book.getTotalCopies() + 
                         ", availableCopies=" + book.getAvailableCopies());
        
        Book created = bookService.createBook(book);
        
        System.out.println("Book created with ID: " + created.getId() + 
                         ", availableCopies=" + created.getAvailableCopies());
        
        return ResponseEntity.ok(new BookResponse(created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id, @RequestBody BookRequest request) {
        Book book = bookService.getBookById(id);
        
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setGenre(request.getCategory()); // Map category to genre
        book.setTotalCopies(request.getTotalCopies());
        book.setReturnPeriodDays(request.getReturnPeriodDays());
        
        // Allow admin to update availableCopies if provided
        if (request.getAvailableCopies() != null) {
            book.setAvailableCopies(request.getAvailableCopies());
        }
        
        Book updated = bookService.updateBook(id, book);
        return ResponseEntity.ok(new BookResponse(updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchBooks(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String author
    ) {
        List<Book> books;
        if (title != null) {
            books = bookService.searchByTitle(title);
        } else if (author != null) {
            books = bookService.searchByAuthor(author);
        } else {
            books = bookService.getAllBooks();
        }
        List<BookResponse> response = books.stream()
            .map(BookResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
