import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { transactionsService } from '@/api/transactionsService';
import { getStoredRole, getStoredUser } from '@/hooks/useAuth';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const TransactionsPage = () => {
  const role = getStoredRole();
  const user = getStoredUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [returnTx, setReturnTx] = useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Members see only their transactions, admins see all
      const data = role === 'MEMBER' && user 
        ? await transactionsService.getByMember(user.userId)
        : await transactionsService.getAll();
      setTransactions(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = !search ||
        t.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        t.memberName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const handleReturn = async () => {
    if (!returnTx) return;
    setSubmitting(true);
    try {
      await transactionsService.approveReturn(returnTx.id);
      toast.success('Return approved successfully');
      setReturnTx(null);
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Transaction>[] = [
    { header: 'Book', cell: (row) => <span className="font-medium text-foreground">{row.bookTitle}</span> },
    { header: 'Member', accessorKey: 'memberName' },
    { header: 'Borrow Date', cell: (row) => <span className="text-tabular text-sm">{row.borrowDate}</span> },
    { header: 'Due Date', cell: (row) => <span className="text-tabular text-sm">{row.dueDate}</span> },
    { header: 'Return Date', cell: (row) => <span className="text-tabular text-sm">{row.returnDate || '—'}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Fine', cell: (row) => {
      // Show current fine if exists, otherwise show paid fine if exists
      const displayFine = row.fineAmount || row.finePaid || row.fine;
      const isPaid = row.finePaid && row.finePaid > 0 && (!row.fineAmount || row.fineAmount === 0);
      
      return (
        <span className={`text-tabular text-sm ${displayFine ? (isPaid ? 'text-success font-medium' : 'text-destructive font-medium') : 'text-muted-foreground'}`}>
          {displayFine ? `₹${displayFine.toFixed(2)}${isPaid ? ' (Paid)' : ''}` : '—'}
        </span>
      );
    }},
    ...(role === 'LIBRARIAN' ? [{
      header: 'Action',
      cell: (row: Transaction) => (
        row.status === 'ACTIVE' || row.status === 'OVERDUE' || row.status === 'BORROWED' || row.status === 'RETURN_PENDING' ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); setReturnTx(row); }} 
            className="gap-1.5"
          >
            <RotateCcw className="h-3 w-3" /> 
            {row.status === 'RETURN_PENDING' ? 'Approve Return' : 'Return'}
          </Button>
        ) : null
      ),
    } as Column<Transaction>] : []),
  ];

  // Member timeline view
  const memberView = (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <div className="surface-card p-12 text-center text-muted-foreground">No transactions found</div>
      ) : (
        filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                tx.status === 'ACTIVE' ? 'bg-info' : tx.status === 'OVERDUE' ? 'bg-destructive' : 'bg-muted-foreground'
              }`} />
              <div>
                <p className="font-medium text-sm text-foreground">{tx.bookTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.borrowDate} → {tx.returnDate || tx.dueDate}
                  {tx.fine ? ` · Fine: $${tx.fine}` : ''}
                </p>
              </div>
            </div>
            <StatusBadge status={tx.status} />
          </motion.div>
        ))
      )}
    </div>
  );

  if (loading) return <AppLayout><LoadingSkeleton variant="table" /></AppLayout>;
  if (error) return <AppLayout><ErrorState message={error} onRetry={fetchTransactions} /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-display text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            {role === 'LIBRARIAN' ? 'Manage book borrows and returns.' : 'Your borrowing history.'}
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <SearchInput placeholder="Search by book or member..." value={search} onChange={setSearch} />
          <FilterBar
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Returned', value: 'RETURNED' },
              { label: 'Overdue', value: 'OVERDUE' },
            ]}
          />
        </div>

        {role === 'LIBRARIAN' ? (
          <DataTable data={filtered} columns={columns} emptyTitle="No transactions found" />
        ) : memberView}
      </div>

      <ConfirmDialog
        open={!!returnTx}
        onOpenChange={(open) => !open && setReturnTx(null)}
        title={returnTx?.status === 'RETURN_PENDING' ? 'Approve Return' : 'Return Book'}
        description={
          returnTx?.status === 'RETURN_PENDING' 
            ? `Approve return request for "${returnTx?.bookTitle}"? This will increase book availability.`
            : `Mark "${returnTx?.bookTitle}" as returned?`
        }
        confirmLabel={returnTx?.status === 'RETURN_PENDING' ? 'Approve Return' : 'Confirm Return'}
        onConfirm={handleReturn}
        loading={submitting}
      />
    </AppLayout>
  );
};

export default TransactionsPage;
