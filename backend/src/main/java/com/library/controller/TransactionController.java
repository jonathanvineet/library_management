package com.library.controller;

import com.library.dto.TransactionResponse;
import com.library.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(transactionService.getTransactionsByMember(memberId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(transactionService.getTransactionsByStatus(status));
    }
    
    @PutMapping("/{id}/return")
    public ResponseEntity<TransactionResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.returnBook(id));
    }
    
    @PutMapping("/{id}/approve-return")
    public ResponseEntity<TransactionResponse> approveReturn(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.approveReturn(id));
    }
    
    @PutMapping("/{id}/pay-fine")
    public ResponseEntity<TransactionResponse> payFine(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.payFine(id));
    }
}
