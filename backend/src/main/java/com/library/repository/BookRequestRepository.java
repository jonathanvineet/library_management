package com.library.repository;

import com.library.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findByUserId(Long userId);
    List<BookRequest> findByStatus(String status);
    List<BookRequest> findByBookId(Long bookId);
}
