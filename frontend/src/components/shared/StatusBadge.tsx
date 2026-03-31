import { clsx } from 'clsx';

const statusStyles = {
  PENDING: 'bg-warning/15 text-warning',
  APPROVED: 'bg-success/15 text-success',
  REJECTED: 'bg-destructive/15 text-destructive',
  ACTIVE: 'bg-info/15 text-info',
  RETURNED: 'bg-muted text-muted-foreground',
  OVERDUE: 'bg-destructive/15 text-destructive',
  BORROWED: 'bg-info/15 text-info',
  RETURN_PENDING: 'bg-warning/15 text-warning',
  AVAILABLE: 'bg-success/15 text-success',
  OUT_OF_STOCK: 'bg-destructive/15 text-destructive',
};

export const StatusBadge = ({ status }: { status?: keyof typeof statusStyles | null }) => {
  if (!status) {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center bg-muted text-muted-foreground">
        N/A
      </span>
    );
  }
  
  return (
    <span className={clsx(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center",
      statusStyles[status] || 'bg-muted text-muted-foreground'
    )}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
