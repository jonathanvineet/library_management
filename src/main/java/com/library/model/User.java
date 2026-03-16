package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Username is required")
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Email(message = "Invalid email format")
    @Column(unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    @Convert(converter = UserRoleConverter.class)
    private UserRole role;

    @Column(nullable = false)
    private Boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void syncNameFields() {
        if ((name == null || name.isBlank()) && fullName != null && !fullName.isBlank()) {
            name = fullName;
        }
        if ((fullName == null || fullName.isBlank()) && name != null && !name.isBlank()) {
            fullName = name;
        }
    }

    public enum UserRole {
        LIBRARIAN,
        MEMBER
    }

    @Converter(autoApply = false)
    public static class UserRoleConverter implements AttributeConverter<UserRole, String> {
        @Override
        public String convertToDatabaseColumn(UserRole attribute) {
            return attribute == null ? null : attribute.name().toLowerCase();
        }

        @Override
        public UserRole convertToEntityAttribute(String dbData) {
            return dbData == null ? null : UserRole.valueOf(dbData.toUpperCase());
        }
    }
}
