package com.library.service;

import com.library.model.Book;
import com.library.model.BookRequest;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.BookRequestRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookRequestService {

    private final BookRequestRepository bookRequestRepository;
    private final BookService bookService;
    private final MemberService memberService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public BookRequest requestBook(Long bookId, UUID userId) {
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Member member = resolveMemberForUser(user);

        if (user.getRole() != User.UserRole.MEMBER) {
            throw new RuntimeException("Only members can request books");
        }

        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw new RuntimeException("Member is not active");
        }

        long activeBorrowings = transactionService.countActiveBorrowingsByMember(member.getId());
        if (activeBorrowings >= 3) {
            throw new RuntimeException("You already reached the book limit (3 books)");
        }

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is currently not available");
        }

        if (bookRequestRepository.existsPendingForUserAndBook(userId, bookId)) {
            throw new RuntimeException("You already have a pending request for this book");
        }

        BookRequest request = new BookRequest();
        request.setBook(book);
        request.setUser(user);
        request.setStatus(BookRequest.RequestStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());
        return enrichRequest(bookRequestRepository.save(request));
    }

    public BookRequest requestBookByMemberId(Long bookId, Long memberId) {
        Member member = memberService.getMemberById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        User user = userRepository.findByEmail(member.getEmail())
                .orElseThrow(() -> new RuntimeException("Linked user not found for member"));
        return requestBook(bookId, user.getId());
    }

    public List<BookRequest> getPendingRequests() {
        return enrichRequests(bookRequestRepository.findByStatusOrderByRequestedAtDesc(BookRequest.RequestStatus.PENDING));
    }

    public List<BookRequest> getRequestsByUser(UUID userId) {
        return enrichRequests(bookRequestRepository.findByUserIdOrderByRequestedAtDesc(userId));
    }

    public List<BookRequest> getRequestsByMemberId(Long memberId) {
        Member member = memberService.getMemberById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        User user = userRepository.findByEmail(member.getEmail())
                .orElseThrow(() -> new RuntimeException("Linked user not found for member"));
        return getRequestsByUser(user.getId());
    }

    public BookRequest approveRequest(Long requestId) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != BookRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        Member member = resolveMemberForUser(request.getUser());

        long activeBorrowings = transactionService.countActiveBorrowingsByMember(member.getId());
        if (activeBorrowings >= 3) {
            request.setStatus(BookRequest.RequestStatus.REJECTED);
            request.setDecisionMessage("You already reached the book limit (3 books)");
            request.setProcessedAt(LocalDateTime.now());
            return enrichRequest(bookRequestRepository.save(request));
        }

        transactionService.borrowBook(request.getBook().getId(), member.getId(), 14);
        request.setStatus(BookRequest.RequestStatus.APPROVED);
        request.setDecisionMessage("Approved by librarian");
        request.setProcessedAt(LocalDateTime.now());
        return enrichRequest(bookRequestRepository.save(request));
    }

    public BookRequest rejectRequest(Long requestId, String reason) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != BookRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        request.setStatus(BookRequest.RequestStatus.REJECTED);
        request.setDecisionMessage((reason == null || reason.isBlank())
                ? "Request rejected by librarian"
                : reason);
        request.setProcessedAt(LocalDateTime.now());

        return enrichRequest(bookRequestRepository.save(request));
    }

    private Member resolveMemberForUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("User email is missing");
        }
        return memberService.getMemberByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Member profile not found for this user"));
    }

    private List<BookRequest> enrichRequests(List<BookRequest> requests) {
        requests.forEach(this::enrichRequest);
        return requests;
    }

    private BookRequest enrichRequest(BookRequest request) {
        try {
            request.setMember(resolveMemberForUser(request.getUser()));
        } catch (RuntimeException ignored) {
            request.setMember(null);
        }

        if (request.getDecisionMessage() == null || request.getDecisionMessage().isBlank()) {
            if (request.getStatus() == BookRequest.RequestStatus.APPROVED) {
                request.setDecisionMessage("Approved by librarian");
            } else if (request.getStatus() == BookRequest.RequestStatus.REJECTED) {
                request.setDecisionMessage("Request rejected by librarian");
            }
        }

        return request;
    }
}
