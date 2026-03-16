package com.library.service;

import com.library.config.SupabaseConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Example service demonstrating Supabase REST API integration
 * Use this for Supabase-specific features like:
 * - Realtime subscriptions
 * - Storage operations
 * - Edge functions
 * - Complex queries not easily handled by JPA
 *
 * For standard CRUD operations, use JPA repositories instead.
 */
@Service
@Slf4j
public class SupabaseIntegrationService {

    @Autowired
    @Qualifier("supabaseRestTemplate")
    private RestTemplate supabaseRestTemplate;

    @Autowired
    private SupabaseConfig supabaseConfig;

    /**
     * Example: Fetch data from Supabase using REST API
     * Use this pattern when you need Supabase-specific features
     */
    public <T> ResponseEntity<T[]> fetchFromTable(String tableName, Class<T[]> responseType) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + tableName;
            log.info("Fetching data from Supabase table: {}", tableName);
            return supabaseRestTemplate.getForEntity(url, responseType);
        } catch (Exception e) {
            log.error("Error fetching from Supabase: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch from Supabase: " + e.getMessage());
        }
    }

    /**
     * Example: Insert data into Supabase using REST API
     */
    public <T> T insertIntoTable(String tableName, T data, Class<T> responseType) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + tableName;
            log.info("Inserting data into Supabase table: {}", tableName);
            return supabaseRestTemplate.postForObject(url, data, responseType);
        } catch (Exception e) {
            log.error("Error inserting into Supabase: {}", e.getMessage());
            throw new RuntimeException("Failed to insert into Supabase: " + e.getMessage());
        }
    }

    /**
     * Example: Update data in Supabase using REST API with filters
     */
    public <T> void updateInTable(String tableName, Map<String, Object> updates, String filter) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + tableName + "?" + filter;
            log.info("Updating data in Supabase table: {} with filter: {}", tableName, filter);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(updates);
            supabaseRestTemplate.exchange(url, HttpMethod.PATCH, request, Void.class);
        } catch (Exception e) {
            log.error("Error updating Supabase: {}", e.getMessage());
            throw new RuntimeException("Failed to update Supabase: " + e.getMessage());
        }
    }

    /**
     * Example: Delete data from Supabase using REST API with filters
     */
    public void deleteFromTable(String tableName, String filter) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + tableName + "?" + filter;
            log.info("Deleting data from Supabase table: {} with filter: {}", tableName, filter);
            supabaseRestTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error deleting from Supabase: {}", e.getMessage());
            throw new RuntimeException("Failed to delete from Supabase: " + e.getMessage());
        }
    }

    /**
     * Example: Create a notification using Supabase
     * This demonstrates working with your notifications table
     */
    public void createNotification(Long userId, String message, String type) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("user_id", userId);
            notification.put("message", message);
            notification.put("type", type);
            notification.put("is_read", false);

            insertIntoTable("notifications", notification, Map.class);
            log.info("Notification created for user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to create notification: {}", e.getMessage());
        }
    }

    /**
     * Example: Execute a Supabase RPC (stored procedure/function)
     * Useful for complex database operations
     */
    public <T> T executeRPC(String functionName, Map<String, Object> params, Class<T> responseType) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/rpc/" + functionName;
            log.info("Executing Supabase RPC: {}", functionName);
            return supabaseRestTemplate.postForObject(url, params, responseType);
        } catch (Exception e) {
            log.error("Error executing RPC: {}", e.getMessage());
            throw new RuntimeException("Failed to execute RPC: " + e.getMessage());
        }
    }

    /**
     * Health check for Supabase connection
     */
    public boolean isSupabaseConnected() {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/";
            ResponseEntity<String> response = supabaseRestTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Supabase connection check failed: {}", e.getMessage());
            return false;
        }
    }
}
