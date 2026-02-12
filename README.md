# Library Management System

A modern, full-stack library management system built with Spring Boot and Azure integration.

## 🚀 Features

- **Book Management**: Add, edit, search, and manage book inventory
- **Member Management**: Register and manage library members
- **Transaction System**: Borrow and return books with automatic fine calculation
- **Modern UI**: Glassmorphic design with smooth animations
- **Azure Integration**: Ready for deployment on Azure with SQL Database
- **REST API**: Complete RESTful API for all operations

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.2** (Latest stable version)
- **Spring Data JPA** for database operations
- **Azure SQL Database** for data persistence
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

### Frontend
- **HTML5/CSS3** with modern glassmorphic design
- **Vanilla JavaScript** for dynamic interactions
- **Responsive Design** for all screen sizes

### Cloud
- **Azure SQL Database** for production database
- **Azure App Service** for application hosting
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Azure account (for deployment)
- Git

## 🏃 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library_management
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your Azure SQL Database credentials:
```env
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=library_management_db
AZURE_SQL_USERNAME=your-username
AZURE_SQL_PASSWORD=your-password
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 📱 Usage

### Dashboard
- View statistics (total books, available books, active members, active loans)
- Quick actions for common tasks
- Recent transactions overview
- Overdue books alerts

### Books Management
- Add new books with ISBN, title, author, category, etc.
- Search books by title, author, or ISBN
- Edit book details
- Track available copies

### Members Management
- Register new members
- Search members by name
- Update member status (Active/Inactive/Suspended)
- Set borrowing limits per member

### Transactions
- Borrow books with customizable loan periods
- Return books with automatic fine calculation
- Filter transactions (All, Active, Overdue, Returned)
- Track overdue books and fines

## 🔌 API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?keyword={keyword}` - Search books
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `GET /api/members/search?name={name}` - Search members
- `POST /api/members` - Register new member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/active` - Get active loans
- `GET /api/transactions/overdue` - Get overdue transactions
- `POST /api/transactions/borrow` - Borrow a book
- `POST /api/transactions/return/{id}` - Return a book

## ☁️ Azure Deployment

See [AZURE_SETUP.md](AZURE_SETUP.md) for detailed deployment instructions.

### Quick Deploy Steps:
1. Create Azure SQL Database
2. Create Azure App Service (Java 17)
3. Configure environment variables in App Service
4. Deploy using GitHub Actions or Azure CLI

## 🏗️ Project Structure

```
library_management/
├── src/
│   ├── main/
│   │   ├── java/com/library/
│   │   │   ├── controller/      # REST API controllers
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── LibraryManagementApplication.java
│   │   └── resources/
│   │       ├── static/          # Frontend files
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── *.html
│   │       ├── application.properties
│   │       └── application-azure.properties
├── .env.example                 # Environment template
├── .gitignore
├── pom.xml                      # Maven configuration
├── AZURE_SETUP.md              # Azure deployment guide
└── README.md
```

## 🎨 Design Features

- **Glassmorphic UI**: Modern frosted glass effect
- **Gradient Accents**: Beautiful purple/blue gradients
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark color scheme

## 🔒 Security Notes

- Environment variables for sensitive data
- CORS configuration for API security
- Input validation on all forms
- SQL injection protection via JPA

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for due dates
- [ ] Advanced reporting and analytics
- [ ] Book reservation system
- [ ] Mobile app integration
- [ ] Barcode scanning support
