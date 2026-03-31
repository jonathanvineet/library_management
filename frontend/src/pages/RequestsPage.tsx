import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { requestsService } from '@/api/requestsService';
import { getStoredRole, getStoredUser } from '@/hooks/useAuth';
import type { BookRequest } from '@/types';
import { toast } from 'sonner';
import { Inbox } from 'lucide-react';

const rejectSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500),
});

const RequestsPage = () => {
  const role = getStoredRole();
  const user = getStoredUser();
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectRequest, setRejectRequest] = useState<BookRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register: registerReject, handleSubmit: handleSubmitReject, reset: resetReject, formState: { errors: rejectErrors } } = useForm<{ reason: string }>({
    resolver: zodResolver(rejectSchema),
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      if (role === 'LIBRARIAN') {
        const data = await requestsService.getPending();
        console.log('Fetched pending requests:', data);
        setRequests(Array.isArray(data) ? data : []);
      } else if (user) {
        const data = await requestsService.getByMember(user.userId);
        console.log('Fetched member requests:', data);
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [role, user?.userId]);

  const handleApprove = async (request: BookRequest) => {
    setSubmitting(true);
    try {
      await requestsService.approve(request.id);
      toast.success('Request approved successfully');
      await fetchRequests();
    } catch (err: any) {
      console.error('Error approving request:', err);
      toast.error(err.message || 'Failed to approve request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (data: { reason: string }) => {
    if (!rejectRequest) return;
    setSubmitting(true);
    try {
      await requestsService.reject(rejectRequest.id, data.reason);
      toast.success('Request rejected');
      setRejectRequest(null);
      resetReject();
      await fetchRequests();
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      toast.error(err.message || 'Failed to reject request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AppLayout><LoadingSkeleton variant="table" /></AppLayout>;
  if (error) return <AppLayout><ErrorState message={error} onRetry={fetchRequests} /></AppLayout>;

  console.log('Rendering requests:', requests.length, requests);

  return (
    <AppLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-display text-foreground">
            {role === 'LIBRARIAN' ? 'Pending Requests' : 'My Requests'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'LIBRARIAN' ? 'Review and manage checkout requests.' : 'Track your book request statuses.'}
          </p>
        </header>

        {requests.length === 0 ? (
          <EmptyState
            title={role === 'LIBRARIAN' ? 'No pending requests' : 'No requests yet'}
            description={role === 'LIBRARIAN' ? 'All requests have been processed.' : 'Request a book from the catalog to get started.'}
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          />
        ) : (
          <div className="space-y-3">
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="surface-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{req.bookTitle}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {role === 'LIBRARIAN' ? `by ${req.memberName}` : ''} · {new Date(req.requestDate).toLocaleDateString()}
                  </p>
                  {req.rejectReason && (
                    <p className="text-xs text-destructive mt-1">Reason: {req.rejectReason}</p>
                  )}
                </div>

                {role === 'LIBRARIAN' && req.status === 'PENDING' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req)}
                      disabled={submitting}
                      className="gap-1.5"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setRejectRequest(req); resetReject(); }}
                      disabled={submitting}
                      className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <AnimatedModal
        open={!!rejectRequest}
        onOpenChange={(open) => !open && setRejectRequest(null)}
        title="Reject Request"
        description={`Provide a reason for rejecting "${rejectRequest?.bookTitle}".`}
      >
        <form onSubmit={handleSubmitReject(handleReject)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter rejection reason..."
              {...registerReject('reason')}
              className={rejectErrors.reason ? 'border-destructive' : ''}
            />
            {rejectErrors.reason && <p className="text-xs text-destructive">{rejectErrors.reason.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setRejectRequest(null)}>Cancel</Button>
            <Button type="submit" disabled={submitting} variant="destructive">
              {submitting ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </form>
      </AnimatedModal>
    </AppLayout>
  );
};

export default RequestsPage;
