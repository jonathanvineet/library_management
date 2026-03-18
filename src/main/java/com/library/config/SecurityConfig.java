package com.library.config;

import com.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                    .requestMatchers("/", "/login", "/*.html", "/index.html", "/admin-dashboard.html", "/student-dashboard.html", "/css/**", "/js/**", "/favicon.ico").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()

                        // Users endpoints - Only Librarians can manage users (except registration)
                        .requestMatchers("/api/users/**").hasRole("LIBRARIAN")

                        // Books endpoints - Members can read, only Librarians can modify
                        .requestMatchers(HttpMethod.GET, "/api/books/**").hasAnyRole("LIBRARIAN", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("LIBRARIAN")

                        // Members endpoints - Members can fetch profile by email; librarians manage all
                        .requestMatchers(HttpMethod.GET, "/api/members/email/**").hasAnyRole("LIBRARIAN", "MEMBER")
                        .requestMatchers("/api/members/**").hasRole("LIBRARIAN")

                        // Transactions endpoints - Members can view their own, Librarians can manage all
                        .requestMatchers(HttpMethod.GET, "/api/transactions/**").hasAnyRole("LIBRARIAN", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/transactions/**").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.PUT, "/api/transactions/**").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.DELETE, "/api/transactions/**").hasRole("LIBRARIAN")

                        // Book request workflow
                        .requestMatchers(HttpMethod.POST, "/api/book-requests/request").hasRole("MEMBER")
                        .requestMatchers(HttpMethod.GET, "/api/book-requests/member/**").hasAnyRole("LIBRARIAN", "MEMBER")
                        .requestMatchers("/api/book-requests/pending").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.POST, "/api/book-requests/*/approve").hasRole("LIBRARIAN")
                        .requestMatchers(HttpMethod.POST, "/api/book-requests/*/reject").hasRole("LIBRARIAN")

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {})
                .authenticationProvider(authenticationProvider());

        // For H2 console
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
