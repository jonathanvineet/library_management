package com.library.service;

import com.library.model.Book;
import com.library.model.Member;
import com.library.model.Transaction;
import com.library.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookService bookService;
    private final MemberService memberService;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllOrderByCreatedAtDesc();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsByMember(Long memberId) {
        return transactionRepository.findByMemberId(memberId);
    }

    public List<Transaction> getTransactionsByBook(Long bookId) {
        return transactionRepository.findByBookId(bookId);
    }

    public List<Transaction> getOverdueTransactions() {
        List<Transaction> overdueTransactions = transactionRepository.findOverdueTransactions(LocalDate.now());
        // Update status to OVERDUE
        overdueTransactions.forEach(transaction -> {
            if (transaction.getStatus() == Transaction.TransactionStatus.BORROWED) {
                transaction.setStatus(Transaction.TransactionStatus.OVERDUE);
                transaction.setFineAmount(transaction.calculateFine());
            }
        });
        return overdueTransactions;
    }

    public List<Transaction> getActiveTransactions() {
        return transactionRepository.findByStatus(Transaction.TransactionStatus.BORROWED);
    }

    public Transaction borrowBook(Long bookId, Long memberId, Integer loanDays) {
        // Validate book
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for borrowing");
        }

        // Validate member
        Member member = memberService.getMemberById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw new RuntimeException("Member is not active");
        }

        // Check if member has reached borrowing limit
        long activeBorrowings = transactionRepository.countActiveBorrowingsByMember(memberId);
        if (activeBorrowings >= member.getMaxBooksAllowed()) {
            throw new RuntimeException("Member has reached maximum borrowing limit");
        }

        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setBook(book);
        transaction.setMember(member);
        transaction.setBorrowDate(LocalDate.now());
        transaction.setDueDate(LocalDate.now().plusDays(loanDays != null ? loanDays : 14));
        transaction.setStatus(Transaction.TransactionStatus.BORROWED);

        // Decrement available copies
        bookService.decrementAvailableCopies(bookId);

        return transactionRepository.save(transaction);
    }

    public Transaction returnBook(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        if (transaction.getStatus() == Transaction.TransactionStatus.RETURNED) {
            throw new RuntimeException("Book has already been returned");
        }

        // Set return date and status
        transaction.setReturnDate(LocalDate.now());
        transaction.setStatus(Transaction.TransactionStatus.RETURNED);

        // Calculate fine if overdue
        if (transaction.isOverdue()) {
            transaction.setFineAmount(transaction.calculateFine());
        }

        // Increment available copies
        bookService.incrementAvailableCopies(transaction.getBook().getId());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }
}
