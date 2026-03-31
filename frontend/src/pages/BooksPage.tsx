import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Send, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { booksService } from '@/api/booksService';
import { requestsService } from '@/api/requestsService';
import { transactionsService } from '@/api/transactionsService';
import { getStoredRole, getStoredUser } from '@/hooks/useAuth';
import type { Book, BookFormData, Transaction } from '@/types';
import { toast } from 'sonner';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(200),
  isbn: z.string().min(1, 'ISBN is required').max(20),
  category: z.string().min(1, 'Category is required').max(100),
  totalCopies: z.coerce.number().min(1, 'At least 1 copy'),
  availableCopies: z.coerce.number().min(0, 'Cannot be negative').optional(),
  returnPeriodDays: z.coerce.number().min(0.0001, 'At least 0.0001 day').max(90, 'Max 90 days').optional(),
}).refine((data) => {
  // Ensure availableCopies doesn't exceed totalCopies
  if (data.availableCopies !== undefined && data.availableCopies > data.totalCopies) {
    return false;
  }
  return true;
}, {
  message: 'Available copies cannot exceed total copies',
  path: ['availableCopies'],
});

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

const BooksPage = () => {
  const role = getStoredRole();
  const user = getStoredUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [returningTxId, setReturningTxId] = useState<string | null>(null);
  const [payingFineId, setPayingFineId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await booksService.getAll();
      setBooks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    if (role === 'MEMBER' && user) {
      try {
        const data = await requestsService.getByMember(user.userId);
        setMyRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      }
    }
  };

  const fetchMyTransactions = async () => {
    if (role === 'MEMBER' && user) {
      try {
        const data = await transactionsService.getByMember(user.userId);
        setMyTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }
    }
  };

  useEffect(() => { 
    fetchBooks();
    fetchMyRequests();
    fetchMyTransactions();
  }, []);

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchesSearch = !search || 
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, search, statusFilter]);

  const openCreate = () => { setEditBook(null); reset({ title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1, returnPeriodDays: 14 }); setModalOpen(true); };
  const openEdit = (book: Book) => { setEditBook(book); reset({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, totalCopies: book.totalCopies, availableCopies: book.availableCopies, returnPeriodDays: book.returnPeriodDays || 14 }); setModalOpen(true); };

  const onSubmitForm = async (data: BookFormData) => {
    setSubmitting(true);
    try {
      if (editBook) {
        await booksService.update(editBook.id, data);
        toast.success('Book updated');
      } else {
        await booksService.create(data);
        toast.success('Book created');
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBook) return;
    setSubmitting(true);
    try {
      await booksService.delete(deleteBook.id);
      toast.success('Book deleted');
      setDeleteBook(null);
      fetchBooks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequest = async (bookId: string) => {
    if (!user) return;
    
    // Check if user already has a request for this book
    const existingRequest = myRequests.find(req => 
      req.bookId === bookId && (req.status === 'PENDING' || req.status === 'APPROVED')
    );
    
    if (existingRequest) {
      toast.error('You already have a request for this book. Please wait for it to be processed.');
      return;
    }
    
    // Check if user has 3 or more active requests (pending + approved)
    const activeRequestCount = myRequests.filter(req => 
      req.status === 'PENDING' || req.status === 'APPROVED'
    ).length;
    
    if (activeRequestCount >= 3) {
      toast.error('You have reached the maximum limit of 3 book requests. Please wait for your current requests to be processed.');
      return;
    }
    
    setRequestingId(bookId);
    try {
      await requestsService.create({ bookId });
      toast.success('Checkout requested!');
      fetchMyRequests(); // Refresh requests after creating one
      fetchMyTransactions(); // Refresh transactions too
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRequestingId(null);
    }
  };

  const handleReturnBook = async (transactionId: string) => {
    setReturningTxId(transactionId);
    try {
      await transactionsService.returnBook(transactionId);
      toast.success('Return request submitted! Waiting for admin approval.');
      fetchMyTransactions();
      fetchMyRequests();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit return request');
    } finally {
      setReturningTxId(null);
    }
  };

  const handlePayFine = async (transactionId: string) => {
    setPayingFineId(transactionId);
    try {
      await transactionsService.payFine(transactionId);
      toast.success('Fine paid successfully!');
      fetchMyTransactions();
      fetchMyRequests();
    } catch (err: any) {
      toast.error(err.message || 'Failed to pay fine');
    } finally {
      setPayingFineId(null);
    }
  };

  const librarianColumns: Column<Book>[] = [
    { header: 'Title', accessorKey: 'title', cell: (row) => <span className="font-medium text-foreground">{row.title}</span> },
    { header: 'Author', accessorKey: 'author' },
    { header: 'ISBN', cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.isbn}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Copies', cell: (row) => <span className="text-tabular">{row.availableCopies}/{row.totalCopies}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(row); }} aria-label="Edit"><Edit className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteBook(row); }} aria-label="Delete" className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ];

  if (loading) return <AppLayout><LoadingSkeleton variant={role === 'LIBRARIAN' ? 'table' : 'cards'} /></AppLayout>;
  if (error) return <AppLayout><ErrorState message={error} onRetry={fetchBooks} /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-display text-foreground">Library Catalog</h1>
            <p className="text-muted-foreground">
              {role === 'LIBRARIAN' ? 'Manage the book collection.' : 'Browse and request books.'}
            </p>
          </div>
          {role === 'LIBRARIAN' && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Book
            </Button>
          )}
        </header>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <SearchInput placeholder="Search by title, author, or ISBN..." value={search} onChange={setSearch} />
          <FilterBar
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'Available', value: 'AVAILABLE' },
              { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
            ]}
          />
        </div>

        {/* Book Limit Warning for Members */}
        {role === 'MEMBER' && (() => {
          const activeRequestCount = myRequests.filter(req => 
            req.status === 'PENDING' || req.status === 'APPROVED'
          ).length;
          
          if (activeRequestCount >= 3) {
            return (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card p-4 border-l-4 border-destructive bg-destructive/5"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Request Limit Reached</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You currently have {activeRequestCount} active requests. Please wait for them to be processed before requesting more books.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          } else if (activeRequestCount === 2) {
            return (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card p-4 border-l-4 border-warning bg-warning/5"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-warning">Almost at Limit</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You have {activeRequestCount} out of 3 requests. You can request 1 more book.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          }
          return null;
        })()}

        {/* Active Requests Section for Members */}
        {role === 'MEMBER' && (() => {
          // Filter to show only active requests (PENDING or APPROVED, not COMPLETED/REJECTED/RETURNED)
          const activeRequests = myRequests.filter(req => 
            req.status === 'PENDING' || req.status === 'APPROVED'
          );
          
          return activeRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-card p-5"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Active Requests ({activeRequests.length})
              </h2>
              <div className="space-y-2">
                {activeRequests.map((req) => {
                  // Find matching transaction for approved requests
                  const transaction = req.status === 'APPROVED' 
                    ? myTransactions.find(tx => tx.bookTitle === req.bookTitle && (tx.status === 'BORROWED' || tx.status === 'OVERDUE' || tx.status === 'RETURN_PENDING'))
                    : null;
                
                const dueInfo = transaction?.dueDate ? getDaysUntilDue(transaction.dueDate) : null;
                const isReturnPending = transaction?.status === 'RETURN_PENDING';
                
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{req.bookTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        by {req.bookAuthor} · Requested {new Date(req.requestDate).toLocaleDateString()}
                      </p>
                      {isReturnPending && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-warning">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">Return pending admin approval</span>
                        </div>
                      )}
                      {dueInfo && !isReturnPending && (
                        <div className={`flex items-center gap-1.5 mt-1.5 ${dueInfo.isOverdue ? 'text-destructive' : dueInfo.days <= 3 ? 'text-warning' : 'text-info'}`}>
                          {dueInfo.isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          <span className="text-xs font-medium">{dueInfo.text}</span>
                          {transaction?.fineAmount && transaction.fineAmount > 0 && (
                            <span className="text-xs font-semibold ml-1 text-destructive">· Fine: ₹{transaction.fineAmount.toFixed(2)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={req.status} />
                      {transaction && req.status === 'APPROVED' && !isReturnPending && (
                        <>
                          {transaction.fineAmount && transaction.fineAmount > 0 && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handlePayFine(transaction.id)}
                              disabled={payingFineId === transaction.id}
                              className="gap-1.5 bg-success hover:bg-success/90"
                            >
                              {payingFineId === transaction.id ? 'Processing...' : `Pay ₹${transaction.fineAmount.toFixed(2)}`}
                            </Button>
                          )}
                          {(!transaction.fineAmount || transaction.fineAmount === 0) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReturnBook(transaction.id)}
                              disabled={returningTxId === transaction.id}
                              className="gap-1.5"
                            >
                              <RotateCcw className="h-3 w-3" />
                              {returningTxId === transaction.id ? 'Submitting...' : 'Return'}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
        })()}

        {role === 'LIBRARIAN' ? (
          <DataTable data={filtered} columns={librarianColumns} emptyTitle="No books found" emptyDescription="Add a book to get started." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full">
                <div className="surface-card p-12 text-center text-muted-foreground">No books found</div>
              </div>
            ) : (
              filtered.map((book, i) => {
                const activeRequestCount = myRequests.filter(req => 
                  req.status === 'PENDING' || req.status === 'APPROVED'
                ).length;
                const isAtLimit = activeRequestCount >= 3;
                
                // Check if user already has a request for this book
                const hasExistingRequest = myRequests.some(req => 
                  req.bookId === book.id && (req.status === 'PENDING' || req.status === 'APPROVED')
                );
                
                // Find transaction for this book to show due date
                const bookTransaction = myTransactions.find(tx => 
                  tx.bookTitle === book.title && 
                  (tx.status === 'BORROWED' || tx.status === 'OVERDUE' || tx.status === 'ACTIVE')
                );
                
                const dueInfo = bookTransaction?.dueDate ? getDaysUntilDue(bookTransaction.dueDate) : null;
                
                return (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="surface-card p-5 hover-lift flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <StatusBadge status={book.status} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{book.author}</p>
                    <p className="text-xs font-mono text-muted-foreground mb-1">{book.isbn}</p>
                    {book.returnPeriodDays && (
                      <p className="text-xs text-info font-medium mb-2">
                        Return: {book.returnPeriodDays} {book.returnPeriodDays === 1 ? 'day' : 'days'}
                      </p>
                    )}
                    
                    {/* Due Date Display */}
                    {dueInfo && (
                      <div className={`mb-3 p-2 rounded-md flex items-center gap-2 ${
                        dueInfo.isOverdue ? 'bg-destructive/10 border border-destructive/20' : 
                        dueInfo.days <= 3 ? 'bg-warning/10 border border-warning/20' : 
                        'bg-info/10 border border-info/20'
                      }`}>
                        {dueInfo.isOverdue ? <AlertCircle className="h-3.5 w-3.5 text-destructive" /> : <Clock className="h-3.5 w-3.5 text-info" />}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${
                            dueInfo.isOverdue ? 'text-destructive' : 
                            dueInfo.days <= 3 ? 'text-warning' : 
                            'text-info'
                          }`}>
                            {dueInfo.text}
                          </p>
                          {bookTransaction?.fine && (
                            <p className="text-xs text-destructive font-medium mt-0.5">
                              Fine: ₹{bookTransaction.fine}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-muted-foreground text-tabular">{book.availableCopies}/{book.totalCopies} available</span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={book.status === 'OUT_OF_STOCK' || requestingId === book.id || isAtLimit || hasExistingRequest}
                        onClick={() => handleRequest(book.id)}
                        className="gap-1.5"
                        title={
                          hasExistingRequest ? 'You already requested this book' :
                          isAtLimit ? 'You have reached the 3-request limit' : ''
                        }
                      >
                        <Send className="h-3 w-3" />
                        {hasExistingRequest ? 'Requested' : requestingId === book.id ? 'Requesting...' : 'Request'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Book Form Modal */}
      <AnimatedModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editBook ? 'Edit Book' : 'Add Book'}
        description={editBook ? 'Update book details.' : 'Add a new book to the catalog.'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...register('author')} className={errors.author ? 'border-destructive' : ''} />
              {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" {...register('isbn')} className={`font-mono ${errors.isbn ? 'border-destructive' : ''}`} />
              {errors.isbn && <p className="text-xs text-destructive">{errors.isbn.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register('category')} className={errors.category ? 'border-destructive' : ''} />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input id="totalCopies" type="number" {...register('totalCopies')} className={errors.totalCopies ? 'border-destructive' : ''} />
              {errors.totalCopies && <p className="text-xs text-destructive">{errors.totalCopies.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableCopies">Available Copies</Label>
              <Input id="availableCopies" type="number" {...register('availableCopies')} className={errors.availableCopies ? 'border-destructive' : ''} />
              {errors.availableCopies && <p className="text-xs text-destructive">{errors.availableCopies.message}</p>}
              <p className="text-xs text-muted-foreground">Number of copies currently available for borrowing</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnPeriodDays">Return Period (Days)</Label>
              <Input 
                id="returnPeriodDays" 
                type="number" 
                step="any"
                placeholder="14" 
                {...register('returnPeriodDays')} 
                className={errors.returnPeriodDays ? 'border-destructive' : ''} 
              />
              {errors.returnPeriodDays && <p className="text-xs text-destructive">{errors.returnPeriodDays.message}</p>}
              <p className="text-xs text-muted-foreground">Default period for members to return this book (0.0001-90 days, use 0.0006944 for 1-minute testing)</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editBook ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </AnimatedModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteBook}
        onOpenChange={(open) => !open && setDeleteBook(null)}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteBook?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={submitting}
      />
    </AppLayout>
  );
};

export default BooksPage;
