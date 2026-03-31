package com.library.config;

import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${admin.email:admin@gmail.com}")
    private String adminEmail;
    
    @Value("${admin.password:admin123}")
    private String adminPassword;
    
    @Value("${admin.name:Admin}")
    private String adminName;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin account if it doesn't exist
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole("LIBRARIAN");
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("✓ Default admin account created:");
            System.out.println("  Email: " + adminEmail);
            System.out.println("  Password: " + adminPassword);
            System.out.println("  Role: LIBRARIAN");
        } else {
            System.out.println("✓ Admin account already exists: " + adminEmail);
        }
    }
}
