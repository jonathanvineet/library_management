# Agent Guide: Vercel-Maven Hybrid Architecture

This project has been refactored from a monolithic Spring Boot application into a **Vercel-Maven Hybrid** application. This allows the backend (Java/Maven) and frontend (Static HTML/JS) to be hosted together on Vercel's serverless infrastructure.

## 🏗️ Architecture Overview

1.  **Frontend (`public/`):** All static assets (HTML, CSS, JS) from `src/main/resources/static` have been moved to the root `public/` directory. Vercel serves these natively via its Edge Network.
2.  **API Bridge (`api/index.java`):** A single "Monolithic Bridge" acts as an entry point for all `/api/*` requests. It uses the `aws-serverless-java-container-springboot3` library to wrap the entire Spring Boot application into a single Serverless Function.
3.  **Maven Build (`pom.xml`):** The project uses the `@vercel-community/maven` runtime. Vercel runs `mvn clean install` on every deployment.
4.  **Database:** The application is locked to the **PostgreSQL (Supabase)** database. Local H2 will not work on Vercel due to the ephemeral filesystem.

---

## 🛠️ How to Make Changes

### 1. Adding/Modifying Backend Logic
You should continue to write your code in `src/main/java/com/library/...` as per standard Spring Boot practices.
- The `api/index.java` bridge automatically picks up any new `@RestController` or `@Service` you add to the project.
- **Do not** modify `api/index.java` unless you are changing the fundamental way the application boots or the routing structure.

### 2. Modifying the Frontend
- All frontend changes must be made in the root `public/` directory.
- **Note:** Changes made to `src/main/resources/static` will **NOT** be reflected on Vercel.

### 3. Environment Variables
When deploying to Vercel, ensure the following environment variables are set in the Vercel Dashboard:
- `SPRING_DATASOURCE_URL` (Supabase JDBC URL)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_PROFILES_ACTIVE=prod`

### 4. Local Development
To run the project locally for testing:
- **Option A (Traditional):** 
  Move the `public/` content back to `src/main/resources/static` (or use a symbolic link) and run `mvn spring-boot:run`.
- **Option B (Vercel CLI):** 
  If you have the Vercel CLI installed, run `vercel dev`. This most accurately simulates the production environment.

---

## ⚠️ Important Constraints for Agents

1.  **Statelessness:** Never use the local filesystem to store data (e.g., file uploads or H2 databases). Always use Supabase or external S3-compatible storage.
2.  **Cold Starts:** Initial requests after inactivity may take 1-4 seconds while the JVM boots. Keep the startup logic in `LibraryManagementApplication` lean.
3.  **Dependencies:** When adding new Maven dependencies, ensure they are compatible with **Java 17**, as Vercel's current stable Java runtime is optimized for this version.
4.  **Routing:** All UI routes in `vercel.json` are mapped to `public`. If you add new static pages, they will be picked up automatically.

---

## 📁 File Map

- `vercel.json`: The core configuration for Vercel.
- `api/index.java`: The Java Serverless entry point.
- `public/`: The frontend source of truth.
- `src/main/java/`: The backend business logic (Spring Boot).
- `pom.xml`: Build configuration.
