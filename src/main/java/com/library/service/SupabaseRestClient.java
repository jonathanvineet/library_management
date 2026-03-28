package com.library.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import java.util.List;
import java.util.Map;

/**
 * Supabase REST API Client
 * 
 * Provides methods to interact with Supabase tables via REST API
 * Only requires SUPABASE_URL and SUPABASE_ANON_KEY - no database credentials needed!
 */
@Service
public class SupabaseRestClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.anon.key}")
    private String anonKey;
    
    public SupabaseRestClient() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Get all records from a table
     */
    public List<Map<String, Object>> getAllRecords(String tableName) {
        String url = supabaseUrl + "/rest/v1/" + tableName;
        HttpEntity<?> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return response.getBody();
    }
    
    /**
     * Get a single record by ID
     */
    public Map<String, Object> getRecordById(String tableName, String id) {
        String url = supabaseUrl + "/rest/v1/" + tableName + "?id=eq." + id;
        HttpEntity<?> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        List<Map<String, Object>> results = response.getBody();
        return (results != null && !results.isEmpty()) ? results.get(0) : null;
    }
    
    /**
     * Insert a new record
     */
    public Map<String, Object> insertRecord(String tableName, Map<String, Object> data) {
        String url = supabaseUrl + "/rest/v1/" + tableName;
        HttpEntity<?> entity = new HttpEntity<>(data, getHeaders());
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        return response.getBody();
    }
    
    /**
     * Update a record
     */
    public void updateRecord(String tableName, String id, Map<String, Object> data) {
        String url = supabaseUrl + "/rest/v1/" + tableName + "?id=eq." + id;
        HttpEntity<?> entity = new HttpEntity<>(data, getHeaders());
        restTemplate.exchange(
            url,
            HttpMethod.PATCH,
            entity,
            Void.class
        );
    }
    
    /**
     * Delete a record
     */
    public void deleteRecord(String tableName, String id) {
        String url = supabaseUrl + "/rest/v1/" + tableName + "?id=eq." + id;
        HttpEntity<?> entity = new HttpEntity<>(getHeaders());
        restTemplate.exchange(
            url,
            HttpMethod.DELETE,
            entity,
            Void.class
        );
    }
    
    /**
     * Query records with filters
     */
    public List<Map<String, Object>> queryRecords(String tableName, String filter) {
        String url = supabaseUrl + "/rest/v1/" + tableName + "?" + filter;
        HttpEntity<?> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return response.getBody();
    }
    
    /**
     * Create HTTP headers with authentication
     */
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", anonKey);
        headers.set("Authorization", "Bearer " + anonKey);
        headers.set("Content-Type", "application/json");
        headers.set("Prefer", "return=representation");
        return headers;
    }
}
