package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "book_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    @NotNull
    private Book book;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Column(name = "status", nullable = false)
    @Convert(converter = RequestStatusConverter.class)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "request_date", updatable = false)
    private LocalDateTime requestedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Transient
    private Member member;

    @Transient
    private String decisionMessage;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Converter(autoApply = false)
    public static class RequestStatusConverter implements AttributeConverter<RequestStatus, String> {
        @Override
        public String convertToDatabaseColumn(RequestStatus attribute) {
            return attribute == null ? null : attribute.name().toLowerCase();
        }

        @Override
        public RequestStatus convertToEntityAttribute(String dbData) {
            return dbData == null ? null : RequestStatus.valueOf(dbData.toUpperCase());
        }
    }
}
