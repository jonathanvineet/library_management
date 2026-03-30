# Library Management System

A modern, full-stack library management system built with Spring Boot featuring **role-based authentication**, **persistent local storage**, and a beautiful glassmorphic UI. Perfect for managing library operations with separate interfaces for librarians and members.

<!-- Azure integration available - see AZURE_SETUP.md for deployment instructions -->

## ✨ What's New

- ✅ **Role-Based Authentication** - Separate access for Librarians and Members
- ✅ **User Registration** - New users can register via a public registration page
- ✅ **Persistent Database** - All data saved locally and survives restarts
- ✅ **Dynamic UI** - Interface adapts based on user role
- ✅ **Secure API** - HTTP Basic Auth with role-based endpoint protection

## 🎯 How Everything Works

### Complete System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Login   │  │ Register │  │  Logout  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │             │              │                         │
└───────┼─────────────┼──────────────┼─────────────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Security Layer                       │
│  • HTTP Basic Authentication                                 │
│  • Password Encoding (BCrypt)                                │
│  • Role-Based Access Control                                 │
│  • Session Management                                        │
└───────┬─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (HTML/CSS/JS)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Books   │  │ Members  │  │Transactions│ │Dashboard │   │
│  │          │  │(Librarian│  │            │  │          │   │
│  │View/Edit │  │  Only)   │  │Borrow/Return│ │ Stats   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        └─────────────┴──────────────┴─────────────┘
                      │
         ┌────────────▼────────────┐
         │   REST API Controllers   │
         │  • AuthController        │
         │  • BookController        │
         │  • MemberController      │
         │  • TransactionController │
         │  • UserController        │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Service Layer         │
         │  • BookService          │
         │  • MemberService        │
         │  • TransactionService   │
         │  • UserService          │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Repository Layer      │
         │  • BookRepository       │
         │  • MemberRepository     │
         │  • TransactionRepository│
         │  • UserRepository       │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  H2 File-Based Database │
         │  📁 ./data/librarydb    │
         │  Books, Members, Trans, │
         │  Users (Persistent)     │
         └─────────────────────────┘
```

### Authentication & Authorization Flow:

1. **User Registration/Login**:
   - New users register at `/register.html` (public access)
   - Existing users login at `/login.html` with username/password
   - Credentials stored with BCrypt password hashing
   - Two roles: `LIBRARIAN` (full access) or `MEMBER` (read-only)

2. **Session Management**:
   - Credentials stored in browser sessionStorage
   - HTTP Basic Auth header sent with every API request
   - Auto-redirect to login on 401/403 errors
   - Logout clears session and redirects to login

3. **Role-Based UI**:
   - **Librarian View**: Can add/edit/delete books, manage members, process transactions
   - **Member View**: Can only browse books and view transactions (no modifications)
   - UI elements show/hide dynamically based on user role

4. **API Security**:
   - All endpoints require authentication (except login/register)
   - Role-based endpoint protection via `@PreAuthorize`
   - Books: Members can read, Librarians can modify
   - Members/Users: Librarian-only access
   - Transactions: Both can view, only Librarians can create/modify

### Database Persistence:

- **File-Based H2 Database** stored in `./data/librarydb.mv.db`
- **Schema**: Automatically created/updated on startup (`ddl-auto=update`)
- **Data Retention**: All books, members, transactions, and users persist across restarts
- **Initialization**: Default users created only on first run
- **Backup**: Simply copy the `data/` folder

## 🚀 Features

### Authentication & Security
- ✅ **User Registration** - Public registration page for new users
- ✅ **Secure Login** - BCrypt password hashing
- ✅ **Role-Based Access** - LIBRARIAN (full access) vs MEMBER (read-only)
- ✅ **Session Management** - Auto-redirect on session expiration
- ✅ **HTTP Basic Auth** - Secure API authentication

### Core Features
- 📚 **Book Management** - Add, edit, search, and manage book inventory with ISBN tracking
- 👥 **Member Management** - Register members with status tracking and borrowing limits
- 🔄 **Transaction System** - Borrow and return books with automatic due date tracking
- 💰 **Fine Calculation** - Automatic overdue fine calculation ($1/day)
- 📊 **Dashboard** - Real-time statistics and recent activity overview
- 🔍 **Search Functionality** - Search books by title, author, or ISBN
- 💾 **Persistent Storage** - All data saved locally and survives restarts

### UI & Design
- 🎨 **Modern Glassmorphic UI** - Beautiful frosted glass design
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Theme** - Eye-friendly dark color scheme
- ⚡ **Real-time Updates** - Dynamic UI updates without page refresh
- 🎭 **Role-Based UI** - Interface adapts based on user permissions

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.2** - Main application framework
- **Spring Security 6.2.1** - Authentication and authorization
- **Spring Data JPA** - Database operations and ORM
- **Hibernate 6.4.1** - JPA implementation
- **H2 Database 2.2.224** - File-based database for persistent storage
- **Maven 3.9+** - Dependency management and build tool
- **Lombok 1.18.30** - Reduces boilerplate code
- **Jakarta Validation** - Input validation and bean validation

### Frontend
- **HTML5/CSS3** - Modern semantic markup and styling
- **Vanilla JavaScript** - API calls and DOM manipulation
- **Responsive Design** - Mobile-first approach
- **Glassmorphic UI** - Modern frosted glass effect design

### Security
- **BCrypt Password Encoding** - Secure password hashing
- **HTTP Basic Authentication** - API security
- **Role-Based Access Control (RBAC)** - Fine-grained permissions
- **Session Management** - Secure session handling

### Database
- **H2 File-Based Storage** - Located at `./data/librarydb.mv.db`
- **Persistent Data** - Survives application restarts
- **Auto Schema Management** - Hibernate DDL auto-update
- **H2 Console** - Built-in database viewer at `/h2-console`

<!-- ### Cloud & DevOps
- **Azure SQL Database** - Production database
- **Azure App Service** - Application hosting
- **GitHub Actions** - CI/CD pipeline (optional) -->

## 📋 Prerequisites

### Required Software

#### For Mac:
```bash
# Check if you have these installed:
java -version    # Should be Java 21 or higher
mvn -version     # Should be Maven 3.9 or higher
git --version    # Any recent version
```

**If not installed:**
- **Java 21 (JDK)** - Install via Homebrew: `brew install openjdk@21`
- **Maven 3.9+** - Install via Homebrew: `brew install maven`
- **Git** - Install via Homebrew: `brew install git`

#### For Windows:
```cmd
# Check if you have these installed:
java -version    REM Should be Java 21 or higher
mvn -version     REM Should be Maven 3.9 or higher
git --version    REM Any recent version
```

**If not installed:**
- **Java 21 (JDK)** - Download from [Adoptium](https://adoptium.net/temurin/releases/?version=21)
- **Maven 3.9+** - Download from [Apache Maven](https://maven.apache.org/download.cgi)
- **Git** - Download from [git-scm.com](https://git-scm.com/)

#### Optional:
- **IDE** - IntelliJ IDEA, VS Code, or Eclipse (for development)
- **Postman** - For API testing (optional)

### System Requirements
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB for application and dependencies
- **OS**: macOS 10.14+, Windows 10+, or Linux

## 🏃 Quick Start Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/jonathanvineet/library_management.git
cd library_management
```

### 2️⃣ Set Up Supabase Database

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your credentials:
   - Project URL: `https://your-project-ref.supabase.co`
   - Database credentials from Project Settings > Database

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the template
cp .env.example .env

# Edit .env with your Supabase credentials
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
SUPABASE_DB_PORT=6543
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USERNAME=postgres.your-project-ref
SUPABASE_DB_PASSWORD=your-database-password
SPRING_PROFILES_ACTIVE=prod
```

### 4️⃣ Verify Java & Maven
```bash
java -version    # Should be Java 21 or higher
mvn -version     # Should be Maven 3.9 or higher
```

### 5️⃣ Build the Application
```bash
mvn clean install -DskipTests
```

### 6️⃣ Run the Application
```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@21 mvn spring-boot:run
```

You should see:
```
Started LibraryManagementApplication in X.XXX seconds
```

### 7️⃣ Access the Application
Open your browser and go to: **http://localhost:8080**

You'll be redirected to the login page automatically.

### 8️⃣ Login with Default Credentials

**Librarian Account (Full Access):**
- Username: `librarian`
- Password: `librarian123`

**Member Account (Read-Only):**
- Username: `member`
- Password: `member123`

### 9️⃣ Start Using!
- **Add Books**: Go to Books page and click "Add New Book"
- **Register Members**: Go to Members page (librarian only)
- **Borrow Books**: Go to Transactions page
- **View Dashboard**: See statistics and recent activity

---

## 📝 Detailed Setup Instructions

### For Mac (macOS)

#### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install Java 21
```bash
# Install OpenJDK 21
brew install openjdk@21

# Add to PATH and set JAVA_HOME
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21"' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc

# Verify installation
java -version
# Should show: openjdk version "21.x.x"
```

#### Step 3: Install Maven
```bash
brew install maven

# Verify installation
mvn -version
# Should show: Apache Maven 3.9.x
```

#### Step 4: Clone and Run
```bash
# Clone the repository
git clone https://github.com/jonathanvineet/library_management.git
cd library_management

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The application will start on: **http://localhost:8080**

---

### For Windows

#### Step 1: Install Java 21

1. **Download JDK 21**:
   - Visit [Adoptium OpenJDK 21](https://adoptium.net/temurin/releases/?version=21)
   - Download the `.msi` installer for Windows
   - Run the installer and follow the wizard

2. **Set JAVA_HOME Environment Variable**:
   - Press `Win + X` → Select **System**
   - Click **Advanced system settings** → **Environment Variables**
   - Under **System Variables**, click **New**:
     - Variable name: `JAVA_HOME`
     - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x` (your actual path)
   - Edit the **Path** variable:
     - Click **New** → Add: `%JAVA_HOME%\bin`
   - Click **OK** on all dialogs

3. **Verify Installation**:
   ```cmd
   java -version
   ```
   Should show: `openjdk version "21.x.x"`

#### Step 2: Install Maven

1. **Download Maven**:
   - Visit [Apache Maven Download](https://maven.apache.org/download.cgi)
   - Download the `apache-maven-x.x.x-bin.zip`
   - Extract to `C:\Program Files\Apache\maven`

2. **Set Maven Environment Variables**:
   - Open **Environment Variables** (same as above)
   - Under **System Variables**, click **New**:
     - Variable name: `MAVEN_HOME`
     - Variable value: `C:\Program Files\Apache\maven`
   - Edit the **Path** variable:
     - Click **New** → Add: `%MAVEN_HOME%\bin`

3. **Verify Installation**:
   ```cmd
   mvn -version
   ```
   Should show: `Apache Maven 3.9.x`

#### Step 3: Install Git (if not installed)
- Download from [git-scm.com](https://git-scm.com/)
- Run installer with default settings

#### Step 4: Clone and Run
```cmd
# Clone the repository
git clone https://github.com/jonathanvineet/library_management.git
cd library_management

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The application will start on: **http://localhost:8080**

---

## ⚙️ Configuration Details

### Database Configuration - SUPABASE ONLY

The application now uses **Supabase PostgreSQL Database** exclusively. No local H2 database is used.

**Configuration File**: [`application-prod.properties`](src/main/resources/application-prod.properties)

```properties
# Supabase PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}?sslmode=require
spring.datasource.username=${SUPABASE_DB_USERNAME}
spring.datasource.password=${SUPABASE_DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Environment Variables Required

Create a `.env` file in the project root with your Supabase credentials:

```properties
# Supabase REST API
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Supabase PostgreSQL Database
SUPABASE_DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
SUPABASE_DB_PORT=6543
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USERNAME=postgres.your-project-ref
SUPABASE_DB_PASSWORD=your-database-password-here

# Spring Configuration
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
```

### What This Configuration Does:

✅ **Cloud Database**: All data stored in Supabase PostgreSQL  
✅ **No Local Files**: No local database files or data folder required  
✅ **Automatic Schema Updates**: Hibernate creates/updates tables on startup  
✅ **Default Users Created**: On first run, default librarian and member accounts are created  
✅ **SSL Secured**: Database connection uses SSL encryption  
✅ **Connection Pooling**: HikariCP manages database connections efficiently

### Getting Started with Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and API keys

2. **Get Database Credentials**:
   - Go to Project Settings > Database
   - Note the Connection Pooling credentials
   - Or use Direct connection settings

3. **Set Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Spring Boot will automatically load from `.env` via `spring-dotenv`

4. **Run the Application**:
   ```bash
   JAVA_HOME=/opt/homebrew/opt/openjdk@21 mvn spring-boot:run
   ```

The application will:
- Connect to your Supabase PostgreSQL database
- Create necessary tables automatically
- Initialize default users (librarian/member)
- Be ready to use at http://localhost:8080

---

## 🌐 Accessing the Application

Once the application is running, open your web browser and navigate to:

| URL | Description | Authentication |
|-----|-------------|----------------|
| http://localhost:8080 | Main application (redirects to login) | Required |
| http://localhost:8080/login.html | Login page | Public |
| http://localhost:8080/register.html | User registration | Public |
| http://localhost:8080/index.html | Dashboard | Required |
| http://localhost:8080/books.html | Books management | Required |
| http://localhost:8080/members.html | Members management | Librarian only |
| http://localhost:8080/transactions.html | Transactions | Required |
| http://localhost:8080/h2-console | Database console | Public (Dev only) |

---

### 🔐 Default Login Credentials

The system comes with two pre-configured users (created automatically on first run):

#### 👨‍💼 Librarian Account (Full Access)
- **Username**: `librarian`
- **Password**: `librarian123`
- **Capabilities**: 
  - ✅ Manage books (create, update, delete)
  - ✅ Manage members (register, update, delete)
  - ✅ Manage all transactions (borrow, return)
  - ✅ View all statistics and reports
  - ✅ Access all pages and features

#### 👤 Member Account (Read-Only)
- **Username**: `member`
- **Password**: `member123`
- **Capabilities**:
  - ✅ View books catalog
  - ✅ Search for books
  - ✅ View own transaction history
  - ❌ Cannot add/edit/delete books
  - ❌ Cannot access member management
  - ❌ Cannot create transactions

### 🔑 User Registration

New users can register themselves:
1. Go to http://localhost:8080/register.html
2. Fill in the registration form:
   - Full Name
   - Username (must be unique)
   - Email address
   - Password (min 6 characters)
   - Confirm Password
   - Select Role (LIBRARIAN or MEMBER)
3. Click "Register"
4. After successful registration, you'll be redirected to login page
5. Login with your new credentials

---

### 👥 User Roles & Permissions Summary

| Feature | Librarian | Member |
|---------|-----------|--------|
| View Books | ✅ | ✅ |
| Add/Edit/Delete Books | ✅ | ❌ |
| View Members | ✅ | ❌ |
| Add/Edit/Delete Members | ✅ | ❌ |
| View All Transactions | ✅ | ✅ |
| Create Transactions (Borrow/Return) | ✅ | ❌ |
| Manage Users | ✅ | ❌ |
| Register New Users | ✅ | ✅ (via public page) |

---

## 📱 Using the Application

### 🚀 First Time Setup
1. **Start the application**: `mvn spring-boot:run`
2. **Open browser**: http://localhost:8080
3. **You'll be redirected to login page** automatically
4. **Login** with one of the default credentials:
   - Librarian: `librarian` / `librarian123`
   - Member: `member` / `member123`
5. **After login**: You'll see the dashboard with statistics

---

### 📊 1. Dashboard (Home Page)
**URL**: http://localhost:8080/index.html

**Features**:
- 📈 View real-time statistics:
  - Total Books in library
  - Available Books for borrowing
  - Active Members registered
  - Active Loans (books currently borrowed)
- 🎯 Quick Actions (role-dependent):
  - **Librarians**: Add Book, Register Member, Borrow Book
  - **Members**: Browse Books, View Transactions
- 🔄 Recent Activity feed
- 📝 Easy navigation to all modules

---

### 📚 2. Books Management
**URL**: http://localhost:8080/books.html  
**Access**: All authenticated users (Librarians can edit, Members can only view)

#### For Librarians:
1. **Add New Book**:
   - Click "Add New Book" button
   - Fill in the form:
     - **ISBN**: Unique book identifier (e.g., 978-0-123456-78-9)
     - **Title**: Book name
     - **Author**: Author name
     - **Publisher**: Publishing company
     - **Publication Year**: Year of publication (e.g., 2024)
     - **Category**: Genre (Fiction, Non-Fiction, Science, etc.)
     - **Description**: Brief summary
     - **Total Copies**: Number of copies in library
   - Click "Add Book"

2. **Edit Existing Book**:
   - Find the book in the list
   - Click "Edit" button
   - Modify any field
   - Click "Update Book"

3. **Delete Book**:
   - Find the book in the list
   - Click "Delete" button
   - Confirm deletion

4. **Search Books**:
   - Use search bar to find books by title, author, or ISBN
   - Results update in real-time

#### For Members:
- **View-Only Mode**: Can browse and search books
- **No Edit/Delete buttons**: Interface automatically hides modification options
- Shows "View Only" label at the top

---

### 👥 3. Members Management
**URL**: http://localhost:8080/members.html  
**Access**: Librarian only (Members are automatically redirected)

#### Operations:
1. **Register New Member**:
   - Click "Register New Member"
   - Fill in the form:
     - **Name**: Full name
     - **Email**: Email address (must be unique)
     - **Phone**: Contact number
     - **Address**: Residential address
     - **Max Books Allowed**: Borrowing limit (default: 5)
   - Status is set to ACTIVE automatically
   - Click "Register Member"

2. **Edit Member**:
   - Find member in the list
   - Click "Edit" button
   - Update information
   - Click "Update Member"

3. **Delete Member**:
   - Find member in the list
   - Click "Delete" button
   - Confirm deletion
   - **Note**: Cannot delete members with active loans

4. **Search Members**:
   - Use search bar to find members by name
   - Results update in real-time

---

### 🔄 4. Transactions (Borrow/Return Books)
**URL**: http://localhost:8080/transactions.html  
**Access**: All authenticated users (Librarians can borrow/return, Members can only view)

#### For Librarians:

**To Borrow a Book**:
1. Click "New Transaction" button
2. **Select Member**: Choose from dropdown (shows active members only)
3. **Select Book**: Choose from dropdown (shows available books only)
4. **Set Due Date**: Pick a return date (default: 14 days from today)
5. Click "Borrow Book"
6. **Validations**:
   - Member must not have reached max borrowing limit
   - Book must have available copies
   - Member must not have overdue books

**To Return a Book**:
1. Find the active transaction in the list
2. Click "Return" button next to the transaction
3. **Automatic Fine Calculation**:
   - If returned on time: No fine
   - If overdue: ₹10 per day
4. Book becomes available again
5. Member's borrowed count decreases

#### For Members:
- **View-Only Mode**: Can see all transactions
- **No Borrow/Return buttons**: Interface automatically hides action buttons
- Can search and filter transactions

#### Filter Options:
- **All Transactions**: Shows everything
- **Active Loans**: Currently borrowed books
- **Overdue**: Books past due date
- **Returned**: Completed transactions

## 🔌 API Endpoints

### Authentication API
```bash
POST   /api/auth/login              # Login (returns user info)
GET    /api/auth/current-user       # Get current logged-in user
POST   /api/auth/logout             # Logout
```

**Login Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u librarian:librarian123 \
  -d '{"username": "librarian", "password": "librarian123"}'
```

### Users API (Librarian Only)
```bash
GET    /api/users                   # Get all users
GET    /api/users/{username}        # Get user by username
POST   /api/users                   # Create new user
PUT    /api/users/{id}              # Update user
DELETE /api/users/{id}              # Delete user
```

### Books API
```bash
GET    /api/books                    # Get all books (Auth required)
GET    /api/books/{id}               # Get book by ID (Auth required)
GET    /api/books/search?keyword={}  # Search books (Auth required)
POST   /api/books                    # Create book (Librarian only)
PUT    /api/books/{id}               # Update book (Librarian only)
DELETE /api/books/{id}               # Delete book (Librarian only)
```

### Members API (Librarian Only)
```bash
GET    /api/members                  # Get all members
GET    /api/members/{id}             # Get member by ID
GET    /api/members/search?name={}   # Search members
POST   /api/members                  # Register member
PUT    /api/members/{id}             # Update member
DELETE /api/members/{id}             # Delete member
```

### Transactions API
```bash
GET    /api/transactions             # Get all transactions (Auth required)
GET    /api/transactions/active      # Get active loans (Auth required)
GET    /api/transactions/overdue     # Get overdue transactions (Auth required)
POST   /api/transactions/borrow      # Borrow a book (Librarian only)
POST   /api/transactions/return/{id} # Return a book (Librarian only)
```

### Example API Calls (using curl with authentication)

**Note**: All API calls (except login) require authentication using HTTP Basic Auth.

#### Create a Book (Librarian only)
```bash
curl -X POST http://localhost:8080/api/books \
  -u librarian:librarian123 \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-123456-78-9",
    "title": "Java Programming",
    "author": "John Doe",
    "publisher": "Tech Books",
    "publicationYear": 2024,
    "category": "Programming",
    "totalCopies": 5,
    "availableCopies": 5,
    "description": "A comprehensive guide to Java"
  }'
```

#### Register a Member (Librarian only)
```bash
curl -X POST http://localhost:8080/api/members \
  -u librarian:librarian123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "maxBooksAllowed": 5
  }'
```

#### Get All Books (Any authenticated user)
```bash
curl -X GET http://localhost:8080/api/books \
  -u member:member123
```

## 🏗️ Project Structure

```
library_management/
├── src/
│   ├── main/
│   │   ├── java/com/library/
│   │   │   ├── config/              # Configuration Classes
│   │   │   │   ├── SecurityConfig.java    # Spring Security config
│   │   │   │   └── DataInitializer.java   # Default users setup
│   │   │   │
│   │   │   ├── controller/          # REST API Controllers
│   │   │   │   ├── AuthController.java      # Login/logout
│   │   │   │   ├── UserController.java      # User management
│   │   │   │   ├── BookController.java
│   │   │   │   ├── MemberController.java
│   │   │   │   └── TransactionController.java
│   │   │   │
│   │   │   ├── model/               # JPA Entities (Database Tables)
│   │   │   │   ├── User.java        # Users table (Auth)
│   │   │   │   ├── Book.java        # Books table
│   │   │   │   ├── Member.java      # Members table
│   │   │   │   └── Transaction.java # Transactions table
│   │   │   │
│   │   │   ├── repository/          # Data Access Layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── BookRepository.java
│   │   │   │   ├── MemberRepository.java
│   │   │   │   └── TransactionRepository.java
│   │   │   │
│   │   │   ├── service/             # Business Logic
│   │   │   │   ├── UserService.java         # Auth & user management
│   │   │   │   ├── BookService.java
│   │   │   │   ├── MemberService.java
│   │   │   │   └── TransactionService.java
│   │   │   │
│   │   │   └── LibraryManagementApplication.java  # Main class
│   │   │
│   │   └── resources/
│   │       ├── application.properties              # App config (H2 DB)
│   │       ├── application-azure.properties        # Azure config
│   │       └── static/                            # Frontend files
│   │           ├── index.html                     # Dashboard
│   │           ├── books.html                     # Books page
│   │           ├── login.html                     # Login page
│   │           ├── books.html                     # Books page
│   │           ├── members.html                   # Members page
│   │           ├── transactions.html              # Transactions page
│   │           ├── css/
│   │           │   └── styles.css                 # Global styles
│   │           └── js/
│   │               └── app.js                     # Frontend logic
│   │
│   └── test/                                      # Unit tests (optional)
│
├── pom.xml                                        # Maven dependencies
├── README.md                                      # This file
├── AZURE_SETUP.md                                # Azure deployment guide
└── .gitignore                                    # Git ignore rules
```

### Key Components Explained:

1. **SecurityConfig**: Configures authentication, role-based access control
2. **DataInitializer**: Creates default librarian and member users on startup
3. **AuthController**: Handles login/logout operations
4. **UserController**: Manages user accounts (librarian only)
5. **User Model**: Stores user credentials and roles (LIBRARIAN/MEMBER)
6. **UserService**: Implements Spring Security's UserDetailsService for authentication

## 🔧 Configuration

### Local Development (H2 File-Based Database)
The application uses **persistent H2 file-based database** which stores all data locally. Your data will be preserved across application restarts.

Configuration in `application.properties`:

```properties
# H2 File-Based Database (Persistent Storage)
spring.datasource.url=jdbc:h2:file:./data/librarydb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration - 'update' keeps data across restarts
spring.jpa.hibernate.ddl-auto=update
```

**Database Location**: `./data/librarydb.mv.db` (in project root)

**Features**:
- ✅ All books, members, transactions, and users persist across restarts
- ✅ No data loss when stopping/starting the application
- ✅ Database files stored locally in the `data/` folder
- ✅ Easy backup (just copy the `data/` folder)

**Note**: With `ddl-auto=update`, the schema is updated automatically but data is never deleted. The database file will be created automatically on first run.

<!-- ### Production (Azure SQL Database)
For Azure deployment, use `application-azure.properties`:

```properties
# Azure SQL Database
spring.datasource.url=jdbc:sqlserver://${AZURE_SQL_SERVER};database=${AZURE_SQL_DATABASE}
spring.datasource.username=${AZURE_SQL_USERNAME}
spring.datasource.password=${AZURE_SQL_PASSWORD}

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update  # Updates schema without data loss
``` -->

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot connect to Supabase database"
**Solution:**
- Verify your `.env` file has correct credentials
- Check that your Supabase project is active
- Ensure your IP is not blocked by firewall rules
- Test connection string in database client like DBeaver

#### 2. "JAVA_HOME is not set"
**Mac:**
```bash
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21"' >> ~/.zshrc
source ~/.zshrc
```

**Windows:**
- Set System Environment Variable `JAVA_HOME` to your JDK path
- Example: `C:\Program Files\Eclipse Adoptium\jdk-21.0.10`

#### 3. "mvn: command not found"
**Mac:**
```bash
brew install maven
```

**Windows:**
- Download Maven from apache.org
- Add `MAVEN_HOME\bin` to System PATH

#### 4. Port 8080 already in use
Change the port in `.env`:
```properties
SERVER_PORT=8081
```

#### 5. Tables not created on startup
**Solution:**
- Check that Hibernate `ddl-auto=update` is set in application-prod.properties
- Verify database connection is working
- Check logs for SQL errors
- Manually create tables using Supabase SQL Editor if needed

## 🎨 Design Features

- **Glassmorphic UI**: Modern frosted glass effect with backdrop blur
- **Gradient Accents**: Beautiful purple/blue gradients throughout
- **Smooth Animations**: Hover effects and smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark color scheme
- **Modern Typography**: Clean, readable fonts

<!-- ## ☁️ Azure Deployment

For production deployment to Azure, see [AZURE_SETUP.md](AZURE_SETUP.md) for detailed instructions.

### Quick Deploy Steps:
1. Create Azure SQL Database
2. Create Azure App Service (Java 21)
3. Configure environment variables in App Service
4. Deploy using Maven or GitHub Actions

```bash
# Build for production
mvn clean package -DskipTests

# Deploy to Azure (requires Azure CLI)
az webapp deploy --resource-group <resource-group> \
                 --name <app-name> \
                 --src-path target/library-management-1.0.0.jar
``` -->

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Configuration**: API security for cross-origin requests
- **Input Validation**: Jakarta Validation annotations on all models
- **SQL Injection Protection**: JPA/Hibernate prevents SQL injection
- **Parameterized Queries**: All queries use parameters, not string concatenation

## 🧪 Testing

Run tests (when implemented):
```bash
mvn test
```

## 📝 Development Tips

### Hot Reload (Spring Boot DevTools)
The application automatically restarts when you change Java files. DevTools is included in `pom.xml`.

### Debugging
Run in debug mode:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

Then attach your IDE debugger to port 5005.

### Database Inspection
Use H2 Console to view/modify data during development:
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:librarydb`
- Username: `sa`
- Password: (empty)

## 📊 Understanding the Data Model

### Book Entity
- Tracks book inventory
- Manages available vs. total copies
- Supports full-text search

### Member Entity
- Stores member information
- Tracks membership status
- Enforces borrowing limits

### Transaction Entity
- Records book loans
- Calculates overdue fines automatically
- Maintains transaction history

### Relationships
```
Book (1) ←→ (Many) Transaction (Many) ←→ (1) Member
```
- One Book can have many Transactions
- One Member can have many Transactions
- Each Transaction links one Book to one Member

## 🚀 Future Enhancements

- [x] User authentication and role-based access control
- [ ] Email notifications for due dates and overdue books
- [ ] Advanced reporting and analytics dashboard
- [ ] Book reservation/hold system
- [ ] Mobile app (React Native/Flutter)
- [ ] Barcode scanning support
- [ ] Integration with external book APIs (Google Books, etc.)
- [ ] Multi-library support
- [ ] Late fee payment integration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
<!-- - Review the [AZURE_SETUP.md](AZURE_SETUP.md) for deployment help -->

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Lombok project for reducing boilerplate
- Bootstrap community for design inspiration

---

**Made with ❤️ using Spring Boot and modern web technologies**
