# Agent Guide: Full-Stack Monorepo (Next.js + Maven + Capacitor)

This project is a premium **Full-Stack Monorepo**. It integrates a Java/Maven backend with a modern Next.js frontend and native-type mobile support for Android and iOS.

## 🏗️ Architecture Overview

1.  **Backend (Root):** A standard Spring Boot 3 application (Java/Maven). It acts as the **source of truth for business logic** and provides a REST API to the frontend.
2.  **Frontend (`/next`):** A modern React UI built with **Next.js 14**, TypeScript, and Tailwind CSS. It is optimized for Vercel and Capacitor.
3.  **Mobile (Capacitor):** Wraps the Next.js static export (`/next/out`) to provide native Android and iOS applications.
4.  **Database:** Powered by **Supabase (PostgreSQL)** for production-grade persistence.

---

## 🛠️ Maintenance & Development

### 1. Backend Logic
Continue to build your API in `src/main/java/com/library/...`. 
- **Deployment:** The backend should be hosted on a platform like **Railway.app** or **Render.com**.
- **Run Locally:** `mvn spring-boot:run`.

### 2. Frontend Logic (Next.js)
The primary UI lives in the `/next` directory.
- **Run Locally:** `cd next && npm run dev`.
- **Styling:** Uses Tailwind CSS with custom tokens in `next/src/app/globals.css`.
- **Build for Web:** `cd next && npm run build`.

### 3. Mobile Dispatch (Capacitor)
Syncing the Next.js UI to native platforms:
1.  **Static Export:** `cd next && npm run build` (Generates `/next/out`).
2.  **Capacitor Sync:** `npx cap sync android` or `npx cap sync ios`.
3.  **Open Native IDE:** `npx cap open android` (Android Studio) or `npx cap open ios` (Xcode).

---

## ⚠️ Important Constraints for Agents

- **Static Export Only:** Capacitor requires Next.js to be in `output: 'export'` mode. Avoid Next.js server features like `getServerSideProps` or native `Image` optimization that requires a Node.js server.
- **API URLs:** Use environment variables to toggle between `localhost:8080` and the production Railway URL in `next/src/app/page.tsx` or a centralized API utility.
- **Universal Styling:** Ensure all UI changes follow the **Deep Navy Glassmorph** design system to maintain platform consistency across Web, Android, and iOS.
- **Statelessness:** The mobile app is entirely client-side. All persistence must go through the REST API to Supabase.

---

## 📁 File Map

- `/next`: Frontend source (Vercel source root).
- `/src/main/java`: Backend source (API source).
- `/android`: Native Android project.
- `/ios`: Native iOS project.
- `capacitor.config.ts`: Cross-platform configuration.
- `pom.xml`: Backend build configuration.
- `package.json`: Root monorepo orchestration scripts.
