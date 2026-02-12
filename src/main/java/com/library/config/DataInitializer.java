package com.library.config;

import com.library.model.User;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if users already exist
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");

            // Create default Librarian
            User librarian = new User();
            librarian.setUsername("librarian");
            librarian.setPassword(passwordEncoder.encode("librarian123"));
            librarian.setFullName("Default Librarian");
            librarian.setEmail("librarian@library.com");
            librarian.setRole(User.UserRole.LIBRARIAN);
            librarian.setEnabled(true);
            userRepository.save(librarian);
            log.info("Created default librarian - Username: librarian, Password: librarian123");

            // Create default Member
            User member = new User();
            member.setUsername("member");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setFullName("Default Member");
            member.setEmail("member@library.com");
            member.setRole(User.UserRole.MEMBER);
            member.setEnabled(true);
            userRepository.save(member);
            log.info("Created default member - Username: member, Password: member123");

            log.info("Default users initialized successfully!");
        } else {
            log.info("Users already exist in database, skipping initialization");
        }
    }
}
