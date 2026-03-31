export type UserRole = 'LIBRARIAN' | 'MEMBER';

export interface User {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  returnPeriodDays?: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies?: number;
  returnPeriodDays?: number;
}

export interface Member {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  active: boolean;
  joinDate: string;
}

export interface BookRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  responseDate?: string;
  dueDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectReason?: string;
}

export interface Transaction {
  id: string;
  bookTitle: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'BORROWED' | 'RETURN_PENDING';
  fine?: number;
  fineAmount?: number;
  finePaid?: number; // Amount of fine that was paid
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  pendingRequests: number;
  activeBorrows: number;
  availableBooks?: number;
  myPendingRequests?: number;
  myApprovedRequests?: number;
  myRejectedRequests?: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}
