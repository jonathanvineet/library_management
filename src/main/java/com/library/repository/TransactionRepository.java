package com.library.repository;

import com.library.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByMemberId(Long memberId);

    List<Transaction> findByBookId(Long bookId);

    List<Transaction> findByStatus(Transaction.TransactionStatus status);

    @Query("SELECT t FROM Transaction t WHERE t.status = 'BORROWED' AND t.dueDate < :currentDate")
    List<Transaction> findOverdueTransactions(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT t FROM Transaction t WHERE t.member.id = :memberId AND t.status = 'BORROWED'")
    List<Transaction> findActiveBorrowingsByMember(@Param("memberId") Long memberId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.member.id = :memberId AND t.status = 'BORROWED'")
    long countActiveBorrowingsByMember(@Param("memberId") Long memberId);

    @Query("SELECT t FROM Transaction t WHERE t.book.id = :bookId AND t.status = 'BORROWED'")
    List<Transaction> findActiveBorrowingsByBook(@Param("bookId") Long bookId);

    @Query("SELECT t FROM Transaction t ORDER BY t.createdAt DESC")
    List<Transaction> findAllOrderByCreatedAtDesc();
}
