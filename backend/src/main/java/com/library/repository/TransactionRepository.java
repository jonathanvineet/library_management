package com.library.repository;

import com.library.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByMemberId(Long memberId);
    List<Transaction> findByStatus(String status);
    List<Transaction> findByBookId(Long bookId);
}
