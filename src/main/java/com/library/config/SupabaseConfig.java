package com.library.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.HttpHeaders;

/**
 * Supabase Configuration
 * Provides configuration for Supabase REST API access
 * Note: Your JPA repositories will automatically use the PostgreSQL connection
 * configured in application-prod.properties
 */
@Configuration
public class SupabaseConfig {

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.anon.key:}")
    private String supabaseAnonKey;

    /**
     * RestTemplate configured for Supabase REST API calls
     * Use this bean when you need to make direct Supabase API calls
     * For standard database operations, use JPA repositories instead
     */
    @Bean(name = "supabaseRestTemplate")
    public RestTemplate supabaseRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Add interceptor to include Supabase auth headers
        restTemplate.getInterceptors().add((ClientHttpRequestInterceptor) (request, body, execution) -> {
            HttpHeaders headers = request.getHeaders();
            headers.set("apikey", supabaseAnonKey);
            headers.set("Authorization", "Bearer " + supabaseAnonKey);
            headers.set("Content-Type", "application/json");
            return execution.execute(request, body);
        });

        return restTemplate;
    }

    public String getSupabaseUrl() {
        return supabaseUrl;
    }

    public String getSupabaseAnonKey() {
        return supabaseAnonKey;
    }
}
