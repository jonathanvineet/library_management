package com.library.repository;

import com.library.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, UUID> {

    List<BookRequest> findByStatusOrderByRequestedAtDesc(BookRequest.RequestStatus status);

    List<BookRequest> findByUserIdOrderByRequestedAtDesc(UUID userId);

    @Query("SELECT COUNT(r) > 0 FROM BookRequest r WHERE r.user.id = :userId AND r.book.id = :bookId AND r.status = 'PENDING'")
    boolean existsPendingForUserAndBook(@Param("userId") UUID userId, @Param("bookId") UUID bookId);
}
