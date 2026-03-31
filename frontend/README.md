# Library Hub - React Frontend

Modern React frontend for the Library Management System built with Vite, TypeScript, and Shadcn UI.

## Features

- 🎨 Modern UI with Shadcn UI components
- 🔐 Role-based authentication (Librarian/Member)
- 📚 Book management and catalog browsing
- 👥 Member management (Librarian only)
- 📋 Book request workflow
- 📊 Transaction tracking
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Prerequisites

- Node.js 18+ or Bun
- Backend API running on http://localhost:8080

## Setup

1. Install dependencies:
```bash
npm install
# or
bun install
```

2. Configure environment:
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your backend URL
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start development server:
```bash
npm run dev
# or
bun dev
```

The app will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
library-hub/
├── src/
│   ├── api/              # API service layer
│   │   ├── client.ts     # Axios client with interceptors
│   │   ├── authService.ts
│   │   ├── booksService.ts
│   │   ├── membersService.ts
│   │   ├── transactionsService.ts
│   │   └── requestsService.ts
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   ├── shared/       # Shared components
│   │   └── ui/           # Shadcn UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── index.html            # HTML template
```

## API Integration

The frontend communicates with the Spring Boot backend via REST API:

### Authentication
- Login/logout with HTTP Basic Auth
- Credentials stored in sessionStorage
- Automatic token injection via Axios interceptors
- Auto-redirect on 401/403 errors

### API Services
All API calls are organized in service files:
- `authService.ts` - Authentication
- `booksService.ts` - Book operations
- `membersService.ts` - Member management
- `transactionsService.ts` - Transaction tracking
- `requestsService.ts` - Book request workflow

### Example API Call
```typescript
import { booksService } from '@/api/booksService';

// Get all books
const books = await booksService.getAll();

// Create a book
const newBook = await booksService.create({
  title: 'Book Title',
  author: 'Author Name',
  isbn: '1234567890',
  category: 'Fiction',
  totalCopies: 5
});
```

## User Roles

### Librarian
- Full access to all features
- Manage books, members, transactions
- Approve/reject book requests
- View analytics dashboard

### Member
- Browse book catalog
- Request books
- View own transactions
- Track request status

## Default Credentials

### Librarian
- Username: `admin`
- Password: `admin123`

### Member
- Username: `student`
- Password: `student123`

## Building for Production

```bash
npm run build
```

Build output will be in `dist/` directory. Deploy this folder to your hosting service.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (required)

## Troubleshooting

### CORS Issues
Ensure the backend has CORS configured to allow requests from your frontend URL.

### API Connection Failed
1. Check if backend is running on http://localhost:8080
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check browser console for errors

### Authentication Issues
1. Clear sessionStorage: `sessionStorage.clear()`
2. Try logging in again
3. Check backend logs for authentication errors

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test your changes before committing

## License

MIT
