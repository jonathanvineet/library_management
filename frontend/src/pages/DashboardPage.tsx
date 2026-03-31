import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, ArrowRightLeft, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { getStoredRole, getStoredUser } from '@/hooks/useAuth';
import { booksService } from '@/api/booksService';
import { membersService } from '@/api/membersService';
import { transactionsService } from '@/api/transactionsService';
import { requestsService } from '@/api/requestsService';
import type { Book, Transaction, BookRequest } from '@/types';

// Helper function to calculate days until due date
const getDaysUntilDue = (dueDate: string): { days: number; text: string; isOverdue: boolean } => {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, isOverdue: true };
  } else if (diffDays === 0) {
    return { days: 0, text: 'Due today', isOverdue: false };
  } else if (diffDays === 1) {
    return { days: 1, text: 'Due tomorrow', isOverdue: false };
  } else if (diffDays <= 7) {
    return { days: diffDays, text: `Return in ${diffDays} days`, isOverdue: false };
  } else if (diffDays <= 14) {
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    if (remainingDays === 0) {
      return { days: diffDays, text: `Return in ${weeks} week${weeks !== 1 ? 's' : ''}`, isOverdue: false };
    } else {
      return { days: diffDays, text: `Return in ${weeks}w ${remainingDays}d`, isOverdue: false };
    }
  } else {
    const weeks = Math.round(diffDays / 7);
    return { days: diffDays, text: `Return in ${weeks} weeks`, isOverdue: false };
  }
};

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  index: number;
}

const StatsCard = ({ label, value, icon, trend, index }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
    className="surface-card p-5 hover-lift"
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold tracking-display text-foreground text-tabular">{value}</p>
    {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
  </motion.div>
);

const DashboardPage = () => {
  const role = getStoredRole();
  const user = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books (this endpoint exists)
        const booksData = await booksService.getAll();
        setBooks(Array.isArray(booksData) ? booksData : []);

        // Try to fetch transactions, but handle 404 gracefully
        try {
          const txData = await transactionsService.getAll();
          setTransactions(Array.isArray(txData) ? txData : []);
        } catch (txError: any) {
          // Transactions endpoint doesn't exist yet, use empty array
          console.log('Transactions endpoint not available yet');
          setTransactions([]);
        }

        if (role === 'LIBRARIAN') {
          try {
            const membersData = await membersService.getAll();
            const membersArr = Array.isArray(membersData) ? membersData : [];
            setMemberCount(membersArr.length);
          } catch {
            setMemberCount(0);
          }
          
          try {
            const reqData = await requestsService.getPending();
            setRequests(Array.isArray(reqData) ? reqData : []);
          } catch {
            setRequests([]);
          }
        } else if (user) {
          try {
            const reqData = await requestsService.getByMember(user.userId);
            setRequests(Array.isArray(reqData) ? reqData : []);
          } catch {
            setRequests([]);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, user]);

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div><h1 className="text-3xl font-bold tracking-display text-foreground">Dashboard</h1></div>
          <LoadingSkeleton variant="stats" />
          <LoadingSkeleton variant="table" />
        </div>
      </AppLayout>
    );
  }

  const activeBorrows = transactions.filter(t => t.status === 'ACTIVE').length;
  const overdue = transactions.filter(t => t.status === 'OVERDUE').length;
  const availableBooks = books.filter(b => b.status === 'AVAILABLE').length;

  const librarianStats = [
    { label: 'Total Books', value: books.length, icon: <BookOpen className="h-4 w-4 text-primary" />, trend: `${availableBooks} available` },
    { label: 'Members', value: memberCount, icon: <Users className="h-4 w-4 text-primary" /> },
    { label: 'Pending Requests', value: requests.length, icon: <Clock className="h-4 w-4 text-primary" />, trend: 'Awaiting review' },
    { label: 'Active Borrows', value: activeBorrows, icon: <ArrowRightLeft className="h-4 w-4 text-primary" />, trend: overdue > 0 ? `${overdue} overdue` : 'All on time' },
  ];

  const memberRequests = requests;
  const memberStats = [
    { label: 'Available Books', value: availableBooks, icon: <BookOpen className="h-4 w-4 text-primary" /> },
    { label: 'My Pending', value: memberRequests.filter(r => r.status === 'PENDING').length, icon: <Clock className="h-4 w-4 text-primary" /> },
    { label: 'Approved', value: memberRequests.filter(r => r.status === 'APPROVED').length, icon: <CheckCircle className="h-4 w-4 text-primary" /> },
    { label: 'Rejected', value: memberRequests.filter(r => r.status === 'REJECTED').length, icon: <XCircle className="h-4 w-4 text-primary" /> },
  ];

  const stats = role === 'LIBRARIAN' ? librarianStats : memberStats;
  const recentTx = transactions.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-display text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName || 'User'}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Member: Approved Requests */}
        {role === 'MEMBER' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved Requests
            </h2>
            {memberRequests.filter(r => r.status === 'APPROVED').length === 0 ? (
              <div className="surface-card p-8 text-center text-muted-foreground text-sm">
                No approved requests yet
              </div>
            ) : (
              <div className="surface-card divide-y divide-border">
                {memberRequests.filter(r => r.status === 'APPROVED').map((req, i) => {
                  // Find matching transaction to get due date
                  const transaction = transactions.find(tx => 
                    tx.bookTitle === req.bookTitle && 
                    (tx.status === 'ACTIVE' || tx.status === 'BORROWED' || tx.status === 'OVERDUE')
                  );
                  const dueInfo = transaction?.dueDate ? getDaysUntilDue(transaction.dueDate) : null;
                  
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{req.bookTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.bookAuthor} · Approved on {new Date(req.responseDate || req.requestDate).toLocaleDateString()}
                        </p>
                        {dueInfo && (
                          <div className={`flex items-center gap-1.5 mt-1 ${dueInfo.isOverdue ? 'text-destructive' : dueInfo.days <= 3 ? 'text-warning' : 'text-info'}`}>
                            {dueInfo.isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            <span className="text-xs font-medium">{dueInfo.text}</span>
                            {transaction?.fine && (
                              <span className="text-xs font-semibold ml-1">· Fine: ₹{transaction.fine}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success/15 text-success">
                        APPROVED
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Librarian: Recent Activity */}
        {role === 'LIBRARIAN' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Activity
            </h2>
            {recentTx.length === 0 ? (
              <div className="surface-card p-8 text-center text-muted-foreground text-sm">
                No recent transactions
              </div>
            ) : (
              <div className="surface-card divide-y divide-border">
                {recentTx.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.bookTitle}</p>
                      <p className="text-xs text-muted-foreground">{tx.memberName} · {tx.borrowDate}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      tx.status === 'ACTIVE' ? 'bg-info/15 text-info' :
                      tx.status === 'OVERDUE' ? 'bg-destructive/15 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {tx.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
