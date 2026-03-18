package com.library.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        ensureSchemaCompatibility();

        ensureDefaultUser("librarian", "librarian123", "Default Librarian", "librarian@library.com", User.UserRole.LIBRARIAN);
        ensureDefaultUser("member", "member123", "Default Member", "member@library.com", User.UserRole.MEMBER);
        ensureDefaultUser("dev", "dev123", "Developer User", "dev@library.local", User.UserRole.MEMBER);
        ensureDefaultMemberProfile("Default Member", "member@library.com");
        ensureDefaultMemberProfile("Developer User", "dev@library.local");

        log.info("Default users and member profiles initialized/verified");
    }

    private void ensureDefaultUser(String username, String rawPassword, String fullName, String email, User.UserRole role) {
        User user = userRepository.findByUsername(username).orElseGet(User::new);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setName(fullName);
        user.setEmail(email);
        user.setRole(role);
        user.setEnabled(true);
        userRepository.save(user);
        log.info("Ensured default user - Username: {}, Password: {}", username, rawPassword);
    }

    private void ensureDefaultMemberProfile(String name, String email) {
        Member member = memberRepository.findByEmail(email).orElseGet(Member::new);
        member.setName(name);
        member.setEmail(email);
        member.setPhone(member.getPhone() == null || member.getPhone().isBlank() ? "1234567890" : member.getPhone());
        member.setAddress(member.getAddress() == null || member.getAddress().isBlank() ? "Default Address" : member.getAddress());
        member.setMembershipDate(member.getMembershipDate() == null ? java.time.LocalDate.now() : member.getMembershipDate());
        member.setStatus(member.getStatus() == null ? Member.MemberStatus.ACTIVE : member.getStatus());
        member.setMaxBooksAllowed(member.getMaxBooksAllowed() == null ? 5 : member.getMaxBooksAllowed());
        memberRepository.save(member);
        log.info("Ensured default member profile for {}", email);
    }

    private void ensureSchemaCompatibility() {
        try {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100)");
            jdbcTemplate.execute("UPDATE users SET name = full_name WHERE name IS NULL OR TRIM(name) = ''");
            log.info("Schema compatibility check complete for users.name column");
        } catch (Exception e) {
            log.warn("Schema compatibility check skipped/failed: {}", e.getMessage());
        }
    }
}
