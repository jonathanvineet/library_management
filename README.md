# Library Management System

A modern, full-stack library management system built with Spring Boot and Azure integration. This application provides a complete solution for managing library books, members, and transactions with a beautiful glassmorphic UI.

## 🎯 How Everything Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (HTML/CSS/JS)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Books   │  │ Members  │  │Transactions│ │Dashboard │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        └─────────────┴──────────────┴─────────────┘
                      │
         ┌────────────▼────────────┐
         │   REST API Controllers   │
         │  (Spring Boot MVC)      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Service Layer         │
         │  (Business Logic)       │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Repository Layer      │
         │  (Spring Data JPA)      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Database (H2/Azure)   │
         │  Books, Members, Trans  │
         └─────────────────────────┘
```

### How It Works:

1. **Frontend Layer**: 
   - Single-page HTML interfaces for Books, Members, Transactions, and Dashboard
   - JavaScript makes REST API calls to the backend
   - Real-time updates without page refreshes

2. **Controller Layer** (`controller/`):
   - Receives HTTP requests from frontend
   - Validates input data
   - Calls appropriate service methods
   - Returns JSON responses

3. **Service Layer** (`service/`):
   - Contains business logic (fine calculations, availability checks)
   - Manages transactions (borrow/return books)
   - Enforces business rules (max books per member, overdue fines)

4. **Repository Layer** (`repository/`):
   - Spring Data JPA interfaces
   - Provides database operations (CRUD + custom queries)
   - Automatically generates SQL queries

5. **Model Layer** (`model/`):
   - JPA entities (Book, Member, Transaction)
   - Lombok annotations for getters/setters
   - Database table mappings

6. **Database**:
   - **Development**: H2 in-memory database (resets on restart)
   - **Production**: Azure SQL Database (persistent)

### Key Features Explained:

- **Book Management**: Tracks ISBN, title, author, copies (total & available)
- **Member Management**: Handles member registration, status, borrowing limits
- **Transactions**: Records book borrows/returns, calculates fines ($1/day overdue)
- **Automatic Fine Calculation**: Compares due date with current date
- **Inventory Tracking**: Updates available copies on borrow/return

## 🚀 Features

- **Book Management**: Add, edit, search, and manage book inventory
- **Member Management**: Register and manage library members
- **Transaction System**: Borrow and return books with automatic fine calculation
- **Modern UI**: Glassmorphic design with smooth animations
- **Azure Integration**: Ready for deployment on Azure with SQL Database
- **REST API**: Complete RESTful API for all operations
- **H2 Console**: Built-in database viewer for development

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.2** - Main application framework
- **Spring Data JPA** - Database operations and ORM
- **Hibernate** - JPA implementation
- **H2 Database** - In-memory database for local development
- **Azure SQL Database** - Production database
- **Maven** - Dependency management and build tool
- **Lombok** - Reduces boilerplate code (getters/setters/constructors)
- **Jakarta Validation** - Input validation

### Frontend
- **HTML5/CSS3** with modern glassmorphic design
- **Vanilla JavaScript** for API calls and DOM manipulation
- **Responsive Design** for all screen sizes

### Cloud & DevOps
- **Azure SQL Database** - Production database
- **Azure App Service** - Application hosting
- **GitHub Actions** - CI/CD pipeline (optional)

## 📋 Prerequisites

### Required Software

#### For Mac:
- **Java 21** (LTS) - Installed via Homebrew
- **Maven 3.9+** - Build tool
- **Git** - Version control
- **Terminal** - Command line interface

#### For Windows:
- **Java 21 (JDK)** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)
- **Maven 3.9+** - Download from [Apache Maven](https://maven.apache.org/download.cgi)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Command Prompt or PowerShell** - Command line interface

#### Optional:
- **Azure account** - For production deployment
- **IDE** - IntelliJ IDEA, VS Code, or Eclipse

## 🏃 Installation & Setup

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

#### Step 4: Clone the Repository
```bash
git clone <your-repository-url>
cd library_management
```

#### Step 5: Build the Project
```bash
mvn clean install
```

#### Step 6: Run the Application
```bash
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
   - Open **System Properties** → **Advanced** → **Environment Variables**
   - Under **System Variables**, click **New**:
     - Variable name: `JAVA_HOME`
     - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x` (your actual path)
   - Edit the **Path** variable:
     - Add: `%JAVA_HOME%\bin`
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
   - Open **System Properties** → **Advanced** → **Environment Variables**
   - Under **System Variables**, click **New**:
     - Variable name: `MAVEN_HOME`
     - Variable value: `C:\Program Files\Apache\maven`
   - Edit the **Path** variable:
     - Add: `%MAVEN_HOME%\bin`

3. **Verify Installation**:
   ```cmd
   mvn -version
   ```
   Should show: `Apache Maven 3.9.x`

#### Step 3: Install Git (if not installed)
- Download from [git-scm.com](https://git-scm.com/)
- Run installer with default settings

#### Step 4: Clone the Repository
```cmd
git clone <your-repository-url>
cd library_management
```

#### Step 5: Build the Project
```cmd
mvn clean install
```

#### Step 6: Run the Application
```cmd
mvn spring-boot:run
```

The application will start on: **http://localhost:8080**

---

## 🌐 Accessing the Application

Once the application is running, open your web browser and navigate to:

- **Main Application**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:librarydb`
  - Username: `sa`
  - Password: (leave empty)

### Available Pages:
- **Dashboard**: http://localhost:8080/index.html
- **Books Management**: http://localhost:8080/books.html
- **Members Management**: http://localhost:8080/members.html
- **Transactions**: http://localhost:8080/transactions.html

## 📱 Using the Application

### 1. Dashboard
- View real-time statistics
- See total books, available books, active members, and active loans
- Quick access to all modules

### 2. Books Management
1. Click "Add New Book" to add a book
2. Fill in: ISBN, Title, Author, Publisher, Year, Category, Description
3. Set Total Copies (Available Copies is set automatically)
4. Search books using the search bar
5. Edit or delete existing books

### 3. Members Management
1. Click "Register New Member" to add a member
2. Fill in: Name, Email, Phone, Address
3. Set Max Books Allowed (default: 5)
4. Member status is ACTIVE by default
5. Search members by name

### 4. Transactions (Borrow/Return)
1. **To Borrow**:
   - Click "New Transaction"
   - Select Member (from dropdown)
   - Select Book (from dropdown)
   - Set Due Date
   - Click "Borrow Book"

2. **To Return**:
   - Find the transaction in the list
   - Click "Return" button
   - Fine is calculated automatically if overdue

3. **Filter Transactions**:
   - All Transactions
   - Active Loans
   - Overdue
   - Returned

## 🔌 API Endpoints

### Books API
```bash
GET    /api/books                    # Get all books
GET    /api/books/{id}               # Get book by ID
GET    /api/books/search?keyword={}  # Search books
POST   /api/books                    # Create book
PUT    /api/books/{id}               # Update book
DELETE /api/books/{id}               # Delete book
POST   /api/books                    # Create book
PUT    /api/books/{id}               # Update book
DELETE /api/books/{id}               # Delete book
```

### Members API
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
GET    /api/transactions             # Get all transactions
GET    /api/transactions/active      # Get active loans
GET    /api/transactions/overdue     # Get overdue transactions
POST   /api/transactions/borrow      # Borrow a book
POST   /api/transactions/return/{id} # Return a book
```

### Example API Calls (using curl)

#### Create a Book
```bash
curl -X POST http://localhost:8080/api/books \
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

#### Register a Member
```bash
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "maxBooksAllowed": 5
  }'
```

## 🏗️ Project Structure

```
library_management/
├── src/
│   ├── main/
│   │   ├── java/com/library/
│   │   │   ├── controller/           # REST API Controllers
│   │   │   │   ├── BookController.java
│   │   │   │   ├── MemberController.java
│   │   │   │   └── TransactionController.java
│   │   │   │
│   │   │   ├── model/               # JPA Entities (Database Tables)
│   │   │   │   ├── Book.java       # Books table
│   │   │   │   ├── Member.java     # Members table
│   │   │   │   └── Transaction.java # Transactions table
│   │   │   │
│   │   │   ├── repository/          # Data Access Layer
│   │   │   │   ├── BookRepository.java
│   │   │   │   ├── MemberRepository.java
│   │   │   │   └── TransactionRepository.java
│   │   │   │
│   │   │   ├── service/             # Business Logic
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

## 🔧 Configuration

### Local Development (H2 Database)
The application uses H2 in-memory database by default. Configuration in `application.properties`:

```properties
# H2 Database
spring.datasource.url=jdbc:h2:mem:librarydb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop  # Recreates DB on restart
```

### Production (Azure SQL Database)
For Azure deployment, use `application-azure.properties`:

```properties
# Azure SQL Database
spring.datasource.url=jdbc:sqlserver://${AZURE_SQL_SERVER};database=${AZURE_SQL_DATABASE}
spring.datasource.username=${AZURE_SQL_USERNAME}
spring.datasource.password=${AZURE_SQL_PASSWORD}

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update  # Updates schema without data loss
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "JAVA_HOME is not set"
**Mac:**
```bash
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21"' >> ~/.zshrc
source ~/.zshrc
```

**Windows:**
- Set System Environment Variable `JAVA_HOME` to your JDK path
- Example: `C:\Program Files\Eclipse Adoptium\jdk-21.0.10`

#### 2. "mvn: command not found"
**Mac:**
```bash
brew install maven
```

**Windows:**
- Download Maven from apache.org
- Add `MAVEN_HOME\bin` to System PATH

#### 3. Port 8080 already in use
Change the port in `application.properties`:
```properties
server.port=8081
```

#### 4. H2 Console not loading
Ensure these properties are set:
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

#### 5. Lombok not working in IDE
- Install Lombok plugin for your IDE
- Enable annotation processing in IDE settings

## 🎨 Design Features

- **Glassmorphic UI**: Modern frosted glass effect with backdrop blur
- **Gradient Accents**: Beautiful purple/blue gradients throughout
- **Smooth Animations**: Hover effects and smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark color scheme
- **Modern Typography**: Clean, readable fonts

## ☁️ Azure Deployment

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
```

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

- [ ] User authentication and role-based access control
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
- Review the [AZURE_SETUP.md](AZURE_SETUP.md) for deployment help

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Lombok project for reducing boilerplate
- Bootstrap community for design inspiration

---

**Made with ❤️ using Spring Boot and modern web technologies**
