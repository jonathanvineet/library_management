# Quick Start: Using Supabase with Your Library Management System

## ✅ What Was Set Up

1. **PostgreSQL Driver** - Added to pom.xml for Supabase connection
2. **Environment Configuration** - Created .env file with your Supabase credentials
3. **Spring Profiles** - Set up dev (H2) and prod (Supabase) profiles
4. **Supabase Config** - Created configuration class for REST API access
5. **Example Service** - Provided SupabaseIntegrationService with examples
6. **Documentation** - Created comprehensive integration guide

## 🚀 Getting Started

### Step 1: Update Your Database Password

Edit `.env` and add your actual Supabase database password:

```env
SUPABASE_DB_PASSWORD=your-actual-database-password
```

**Where to find it:** Supabase Dashboard → Project Settings → Database → Database password

### Step 2: Choose Your Profile

**For Local Development (H2):**
```.env
SPRING_PROFILES_ACTIVE=dev
```

**For Production (Supabase):**
```.env
SPRING_PROFILES_ACTIVE=prod
```

### Step 3: Install Dependencies & Run

```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

## 📚 How to Use in Your Code

### Option 1: Standard JPA (Recommended for CRUD)

Your existing code works automatically! No changes needed:

```java
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll(); // ← This uses Supabase automatically
    }
}
```

### Option 2: Supabase REST API (For Special Features)

Use `SupabaseIntegrationService` for Supabase-specific features:

```java
@Service
public class NotificationService {
    @Autowired
    private SupabaseIntegrationService supabaseService;

    public void sendNotification(Long userId, String message) {
        supabaseService.createNotification(userId, message, "INFO");
    }
}
```

## 🔍 Verify It's Working

### Test 1: Check Application Startup
Look for this in logs:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

### Test 2: Test Supabase Connection
```bash
curl --request GET \
  --url 'https://hnpgjwbhndackrowriqau.supabase.co/rest/v1/books' \
  --header 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucGdqd2JobmRhY2tvd3JpcWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2Njk5NjMsImV4cCI6MjA4OTI0NTk2M30.gxQZ0DY-pwVPSZZwK4TDRNhxs65Q3RQt7bou3fxljNw'
```

## 📁 Files Created/Modified

- `pom.xml` - Added PostgreSQL driver and dotenv dependency
- `.env` - Your Supabase credentials (don't commit this!)
- `application.properties` - Base configuration
- `application-dev.properties` - H2 database settings
- `application-prod.properties` - Supabase settings
- `SupabaseConfig.java` - Configuration class
- `SupabaseIntegrationService.java` - Example service
- `SUPABASE_INTEGRATION.md` - Detailed documentation

## 🎯 Next Steps

1. **Update .env** with your database password
2. **Test locally** with `SPRING_PROFILES_ACTIVE=dev`
3. **Test with Supabase** by switching to `SPRING_PROFILES_ACTIVE=prod`
4. **Create additional models** for your Supabase tables:
   - BookCopy
   - BookLend
   - BookRequest
   - Fine
   - Notification
   - Payment
   - Return

## 🆘 Need Help?

- **Connection issues?** Check `SUPABASE_INTEGRATION.md` for troubleshooting
- **Want to use REST API?** See examples in `SupabaseIntegrationService.java`
- **Questions about JPA?** Your existing repositories work automatically!

## 🔐 Security Reminder

- Never commit `.env` file (already in .gitignore ✓)
- Use Row Level Security (RLS) in Supabase dashboard
- Keep your anon key secure (it's already configured)

---

**You're all set!** Your Spring Boot app can now use Supabase as the database. 🎉
