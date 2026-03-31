# Library API - Spring Boot Backend

Simple Spring Boot REST API for Library Management System with Supabase PostgreSQL.

## Prerequisites

- Java 21
- Maven 3.6+
- Supabase PostgreSQL database

## Configuration

Database connection is configured in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=tkt@vav@vj@u1
```

## Running the Application

```bash
mvn spring-boot:run
```

The API will start on http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book
- `GET /api/books/search?title=...` - Search books by title
- `GET /api/books/search?author=...` - Search books by author

## Database Schema

### Users Table
- id (bigint, primary key)
- name (varchar)
- email (varchar, unique)
- password_hash (varchar)
- role (varchar)
- created_at (timestamp)

### Books Table
- id (bigint, primary key)
- title (varchar)
- author (varchar)
- isbn (varchar, unique)
- genre (varchar)
- total_copies (integer)
- available_copies (integer)
- created_at (timestamp)
