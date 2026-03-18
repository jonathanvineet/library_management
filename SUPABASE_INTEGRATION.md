# Supabase Integration Guide

## Overview

This application now supports Supabase as the production database. You can use either:
1. **JPA/Hibernate** (recommended) - Standard Spring Data JPA repositories
2. **Supabase REST API** - Direct API calls for special use cases

## Setup Instructions

### 1. Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `hnpgjwbhndackowriqau`
3. Navigate to **Project Settings > API**
    - Copy the **Project URL**: `https://hnpgjwbhndackowriqau.supabase.co`
   - Copy the **anon public key** (you already have this)
4. Navigate to **Project Settings > Database > Connection Pooling**
   - Copy your database password
   - Note the connection details

### 2. Configure Environment Variables

Edit your `.env` file with your actual database password:

```env
# The URL and anon key are already set correctly
SUPABASE_URL=https://hnpgjwbhndackowriqau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Update this with your actual database password
SUPABASE_DB_PASSWORD=your-actual-database-password
```

### 3. Switch Between Development and Production

**For Local Development (H2 Database):**
```env
SPRING_PROFILES_ACTIVE=dev
```

**For Production (Supabase):**
```env
SPRING_PROFILES_ACTIVE=prod
```

## Usage Examples

### Approach 1: Using JPA Repositories (Recommended)

This is the standard Spring Data JPA approach. Your existing repositories will work automatically:

```java
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        // This automatically uses Supabase in production
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
}
```

**No changes needed!** Your existing service layer will work with Supabase.

### Approach 2: Using Supabase REST API (For Special Cases)

For features like realtime subscriptions, storage, or edge functions:

```java
@Service
public class SupabaseService {
    @Autowired
    @Qualifier("supabaseRestTemplate")
    private RestTemplate supabaseRestTemplate;

    @Autowired
    private SupabaseConfig supabaseConfig;

    public List<Book> getBooksViaRestAPI() {
        String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/books";
        ResponseEntity<Book[]> response = supabaseRestTemplate.getForEntity(
            url,
            Book[].class
        );
        return Arrays.asList(response.getBody());
    }

    public Book createBookViaRestAPI(Book book) {
        String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/books";
        return supabaseRestTemplate.postForObject(url, book, Book.class);
    }
}
```

## Database Schema Sync

Your Supabase database has these tables:
- `users`
- `books`
- `book_copies`
- `book_lend`
- `book_requests`
- `fines`
- `notifications`
- `payments`
- `returns`

### Option 1: Let JPA Create Tables (Development)
Set in `application-prod.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```

### Option 2: Validate Existing Schema (Production)
Set in `application-prod.properties`:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

## Testing the Integration

### 1. Test with curl:
```bash
curl --request GET \
    --url 'https://hnpgjwbhndackowriqau.supabase.co/rest/v1/books' \
  --header 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 2. Test Spring Boot Application:
```bash
# Make sure .env has SPRING_PROFILES_ACTIVE=prod
mvn spring-boot:run
```

### 3. Verify Database Connection:
Check application logs for:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

## Common Issues

### Issue: "password authentication failed"
**Solution:** Update `SUPABASE_DB_PASSWORD` in `.env` with your actual database password from Supabase Dashboard.

### Issue: Connection timeout
**Solution:** Check that your IP is allowed in Supabase Dashboard under Database > Connection Pooling.

### Issue: SSL connection error
**Solution:** Add `?sslmode=require` to your connection string if needed.

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use RLS (Row Level Security)** in Supabase for additional security
3. **Rotate keys regularly** - Generate new anon keys periodically
4. **Use service role key** only for admin operations, never expose it to frontend
5. **Validate input** - Always validate and sanitize user input before database operations

## Next Steps

1. Update your entity models to match Supabase schema
2. Create additional models for: `BookCopy`, `BookLend`, `BookRequest`, `Fine`, `Notification`, `Payment`, `Return`
3. Set up Row Level Security policies in Supabase
4. Configure authentication with Supabase Auth if needed
5. Set up realtime subscriptions for live updates

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [Your Supabase Dashboard](https://app.supabase.com/project/hnpgjwbhndackowriqau)

## Important Note About MCP

The MCP server config gives Copilot tools access to your Supabase project metadata; it does not configure this Spring Boot app database automatically. This app still needs `SPRING_PROFILES_ACTIVE=prod` plus valid `SUPABASE_DB_URL` (or host/port/user/password values) in environment variables.
