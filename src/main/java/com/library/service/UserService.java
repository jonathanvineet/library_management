package com.library.service;

import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private static final String LIBRARIAN_EMAIL = "yuvan.r2005@gmail.com";
    private static final String LIBRARIAN_PASSWORD = "admin@12345";

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .disabled(!user.getEnabled())
                .build();
    }

    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean isConfiguredLibrarianCredential(String login, String password) {
        return login != null
                && password != null
                && LIBRARIAN_EMAIL.equalsIgnoreCase(login)
                && LIBRARIAN_PASSWORD.equals(password);
    }

    @Transactional
    public void ensureConfiguredLibrarianAccount() {
        Optional<User> existing = userRepository.findByEmail(LIBRARIAN_EMAIL);
        if (existing.isPresent()) {
            User user = existing.get();
            user.setRole(User.UserRole.LIBRARIAN);
            user.setEnabled(true);
            user.setUsername(LIBRARIAN_EMAIL);
            user.setFullName(user.getFullName() == null || user.getFullName().isBlank() ? "Librarian" : user.getFullName());
            user.setPassword(passwordEncoder.encode(LIBRARIAN_PASSWORD));
            userRepository.save(user);
            return;
        }

        User librarian = new User();
        librarian.setUsername(LIBRARIAN_EMAIL);
        librarian.setEmail(LIBRARIAN_EMAIL);
        librarian.setFullName("Librarian");
        librarian.setRole(User.UserRole.LIBRARIAN);
        librarian.setEnabled(true);
        librarian.setPassword(passwordEncoder.encode(LIBRARIAN_PASSWORD));
        userRepository.save(librarian);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String rawPassword = user.getPassword();
        boolean usesLibrarianEmail = user.getEmail() != null
            && user.getEmail().equalsIgnoreCase(LIBRARIAN_EMAIL);
        boolean isLibrarianRegistration = user.getEmail() != null
                && user.getEmail().equalsIgnoreCase(LIBRARIAN_EMAIL)
                && LIBRARIAN_PASSWORD.equals(rawPassword);

        if (usesLibrarianEmail && !isLibrarianRegistration) {
            throw new RuntimeException("Invalid librarian credentials");
        }

        if (isLibrarianRegistration) {
            if (userRepository.countByRole(User.UserRole.LIBRARIAN) > 0) {
                throw new RuntimeException("Librarian account already exists");
            }
            user.setRole(User.UserRole.LIBRARIAN);
        } else {
            user.setRole(User.UserRole.MEMBER);
        }

        user.setEnabled(true);
        
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(rawPassword));
        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == User.UserRole.MEMBER && savedUser.getEmail() != null
                && !memberRepository.existsByEmail(savedUser.getEmail())) {
            Member member = new Member();
            member.setName(savedUser.getFullName());
            member.setEmail(savedUser.getEmail());
            member.setPhone("9999999999");
            member.setStatus(Member.MemberStatus.ACTIVE);
            member.setMaxBooksAllowed(3);
            memberRepository.save(member);
        }

        return savedUser;
    }

    @Transactional
    public User updateUser(UUID id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!user.getUsername().equals(userDetails.getUsername()) &&
                userRepository.existsByUsername(userDetails.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userDetails.getEmail() != null && !user.getEmail().equals(userDetails.getEmail()) &&
                userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setEnabled(userDetails.getEnabled());

        // Only update password if a new one is provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
