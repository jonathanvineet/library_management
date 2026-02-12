package com.library.controller;

import com.library.model.Transaction;
import com.library.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Transaction>> getTransactionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(transactionService.getTransactionsByMember(memberId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Transaction>> getTransactionsByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(transactionService.getTransactionsByBook(bookId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Transaction>> getOverdueTransactions() {
        return ResponseEntity.ok(transactionService.getOverdueTransactions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Transaction>> getActiveTransactions() {
        return ResponseEntity.ok(transactionService.getActiveTransactions());
    }

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestBody Map<String, Object> request) {
        try {
            Long bookId = Long.valueOf(request.get("bookId").toString());
            Long memberId = Long.valueOf(request.get("memberId").toString());
            Integer loanDays = request.containsKey("loanDays") 
                ? Integer.valueOf(request.get("loanDays").toString()) 
                : 14;

            Transaction transaction = transactionService.borrowBook(bookId, memberId, loanDays);
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/return/{transactionId}")
    public ResponseEntity<?> returnBook(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.returnBook(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
