# Library Management System

A modern, full-stack library management system with React frontend, Spring Boot backend, and Supabase PostgreSQL database.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│  (Vite + TypeScript + Shadcn UI + TailwindCSS)              │
│  Port: 5173                                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (Axios + Basic Auth)
┌────────────────────▼────────────────────────────────────────┐
│              Spring Boot Backend                             │
│  (Java 21 + Spring Security + JPA)                          │
│  Port: 8080                                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ JDBC/PostgreSQL
                     │ (HikariCP Connection Pool)
┌────────────────────▼────────────────────────────────────────┐
│              Supabase PostgreSQL                             │
│  (Cloud Database + Authentication)                           │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Authentication & Security
- 🔐 Role-based authentication (Librarian/Member)
- 🔑 HTTP Basic Auth with BCrypt password hashing
- 🛡️ Spring Security with role-based access control
- 📝 User registration and management

### Core Features
- 📚 Book Management - Add, edit, search, and manage inventory
- 👥 Member Management - Register and manage library members
- 🔄 Transaction System - Borrow and return books with due dates
- 📋 Book Request Workflow - Members request, librarians approve
- 💰 Fine Calculation - Automatic overdue fine tracking
- 📊 Dashboard - Real-time statistics and analytics

### UI & Design
- 🎨 Modern UI with Shadcn components
- 📱 Fully responsive design
- 🌙 Dark mode support
- ⚡ Real-time updates with TanStack Query
- 🎭 Role-based UI adaptation

## 🛠️ Technology Stack

### Frontend (library-hub/)
- React 18 + TypeScript
- Vite - Build tool
- Shadcn UI - Component library
- TailwindCSS - Styling
- TanStack Query - Data fetching
- React Router - Navigation
- Axios - HTTP client
- Framer Motion - Animations

### Backend (root/)
- Spring Boot 3.2.2
- Spring Security 6.2.1
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- Maven

### Database
- Supabase PostgreSQL (Cloud)
- Connection pooling with HikariCP
- Automatic schema management

## 📋 Prerequisites

- **Java 21** or higher
- **Maven 3.9+**
- **Node.js 18+** or Bun
- **Supabase Account** (free tier works)

### Installation

#### Mac
```bash
brew install openjdk@21 maven node
```

#### Windows
- Java 21: [Adoptium](https://adoptium.net/temurin/releases/?version=21)
- Maven: [Apache Maven](https://maven.apache.org/download.cgi)
- Node.js: [nodejs.org](https://nodejs.org/)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/jonathanvineet/library_management.git
cd library_management
```

### 2. Setup Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get credentials from Project Settings:
   - Project URL
   - Anon Key
   - Database credentials (Settings > Database)

### 3. Configure Backend

Create `.env` in project root:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```properties
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=jdbc:postgresql://aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require
SUPABASE_DB_USERNAME=postgres.your-project-ref
SUPABASE_DB_PASSWORD=your-database-password
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### 4. Configure Frontend

Create `library-hub/.env`:
```bash
cd library-hub
cp .env.example .env
```

Content:
```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5. Start Backend
```bash
# From project root
mvn clean install
mvn spring-boot:run
```

Backend runs on: http://localhost:8080

### 6. Start Frontend
```bash
# From library-hub directory
cd library-hub
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 7. Access Application

Open browser: http://localhost:5173

## 🔑 Default Credentials

### Librarian (Full Access)
- Username: `admin`
- Password: `admin123`

### Member (Limited Access)
- Username: `student`
- Password: `student123`

## 📱 Using the Application

### Dashboard
- View real-time statistics
- Quick access to all features
- Recent activity feed

### Books Management
- **Librarians**: Add, edit, delete books
- **Members**: Browse and search catalog
- Search by title, author, ISBN
- Track available copies

### Members Management (Librarian Only)
- Register new members
- Update member information
- View member activity
- Manage member status

### Transactions
- **Librarians**: Process borrow/return
- **Members**: View transaction history
- Automatic due date tracking
- Fine calculation for overdue books

### Book Requests
- **Members**: Request books
- **Librarians**: Approve/reject requests
- Track request status
- Automatic notifications

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/current-user       # Get current user
POST   /api/users/register          # Register new user
```

### Books
```
GET    /api/books                   # Get all books
GET    /api/books/{id}              # Get book by ID
POST   /api/books                   # Create book (Librarian)
PUT    /api/books/{id}              # Update book (Librarian)
DELETE /api/books/{id}              # Delete book (Librarian)
```

### Members
```
GET    /api/members                 # Get all members (Librarian)
GET    /api/members/email/{email}   # Get member by email
PATCH  /api/members/{id}/status     # Update member status (Librarian)
```

### Transactions
```
GET    /api/transactions            # Get all transactions
POST   /api/transactions            # Create transaction (Librarian)
PUT    /api/transactions/{id}       # Update transaction (Librarian)
```

### Book Requests
```
POST   /api/book-requests/request   # Request book (Member)
GET    /api/book-requests/member/{id} # Get member requests
GET    /api/book-requests/pending   # Get pending requests (Librarian)
POST   /api/book-requests/{id}/approve # Approve request (Librarian)
POST   /api/book-requests/{id}/reject  # Reject request (Librarian)
```

## 📁 Project Structure

```
library_management/
├── library-hub/                    # React Frontend
│   ├── src/
│   │   ├── api/                   # API services
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Page components
│   │   ├── types/                 # TypeScript types
│   │   └── App.tsx                # Main app
│   ├── package.json
│   └── .env                       # Frontend config
│
├── src/main/java/com/library/     # Spring Boot Backend
│   ├── config/                    # Configuration
│   ├── controller/                # REST controllers
│   ├── model/                     # JPA entities
│   ├── repository/                # Data access
│   └── service/                   # Business logic
│
├── src/main/resources/
│   ├── application.properties     # App config
│   ├── application-prod.properties # Production config
│   └── application-dev.properties  # Development config
│
├── pom.xml                        # Maven dependencies
├── .env                           # Backend config
├── INTEGRATION_GUIDE.md           # Detailed setup guide
└── README.md                      # This file
```

## 🚀 Development

### Easy Start (Windows)
```powershell
# Run both backend and frontend
.\start-dev.ps1
```

### Manual Start

**Backend:**
```bash
mvn spring-boot:run
```

**Frontend:**
```bash
cd library-hub
npm run dev
```

## 📦 Production Build

### Frontend
```bash
cd library-hub
npm run build
```
Output: `library-hub/dist/`

### Backend
```bash
mvn clean package
java -jar target/library-management-1.0.0.jar
```

## 🔧 Configuration

### Backend Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_DB_URL` - PostgreSQL connection string
- `SUPABASE_DB_USERNAME` - Database username
- `SUPABASE_DB_PASSWORD` - Database password
- `SERVER_PORT` - Backend port (default: 8080)
- `SPRING_PROFILES_ACTIVE` - Active profile (prod/dev)

### Frontend Environment Variables
- `VITE_API_BASE_URL` - Backend API URL

## 🐛 Troubleshooting

### Backend won't start
- Check Java version: `java -version` (should be 21+)
- Verify Supabase credentials in `.env`
- Check if port 8080 is available

### Frontend won't start
- Check Node version: `node -v` (should be 18+)
- Run `npm install` in library-hub folder
- Verify `.env` has correct API URL

### CORS errors
- Ensure backend is running on port 8080
- Check `VITE_API_BASE_URL` in frontend `.env`
- Backend CORS is configured for all origins

### Authentication issues
- Clear browser sessionStorage
- Check credentials (admin/admin123 or student/student123)
- Verify backend logs for errors

## 📚 Documentation

- [Integration Guide](INTEGRATION_GUIDE.md) - Detailed setup instructions
- [Frontend README](library-hub/README.md) - React app documentation
- [API Documentation](#-api-endpoints) - REST API reference

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- Jonathan Vineet - Initial work

## 🙏 Acknowledgments

- Spring Boot team
- React team
- Shadcn UI
- Supabase team
