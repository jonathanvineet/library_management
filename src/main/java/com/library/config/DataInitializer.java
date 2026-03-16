package com.library.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
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

        // Check if members already exist
        if (memberRepository.count() == 0) {
            log.info("Initializing default members...");

            // Create default Member record
            Member defaultMember = new Member();
            defaultMember.setName("Default Member");
            defaultMember.setEmail("member@library.com");
            defaultMember.setPhone("1234567890");
            defaultMember.setAddress("Default Address");
            defaultMember.setMembershipDate(java.time.LocalDate.now());
            defaultMember.setStatus(Member.MemberStatus.ACTIVE);
            defaultMember.setMaxBooksAllowed(5);
            memberRepository.save(defaultMember);
            log.info("Created default member record");

            log.info("Default members initialized successfully!");
        } else {
            log.info("Members already exist in database, skipping initialization");
        }
    }
}
