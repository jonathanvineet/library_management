import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, UserX } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { membersService } from '@/api/membersService';
import type { Member } from '@/types';
import { toast } from 'sonner';

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [statusToggle, setStatusToggle] = useState<{ member: Member; activate: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await membersService.getAll();
      setMembers(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = useMemo(() => {
    if (!search) return members;
    const q = search.toLowerCase();
    return members.filter(m =>
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q)
    );
  }, [members, search]);

  const handleStatusChange = async () => {
    if (!statusToggle) return;
    setSubmitting(true);
    try {
      await membersService.updateStatus(statusToggle.member.id, statusToggle.activate);
      toast.success(`Member ${statusToggle.activate ? 'activated' : 'deactivated'}`);
      setStatusToggle(null);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Member>[] = [
    { header: 'Name', cell: (row) => <span className="font-medium text-foreground">{row.fullName}</span> },
    { header: 'Username', cell: (row) => <span className="font-mono text-xs text-muted-foreground">@{row.username}</span> },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Joined', accessorKey: 'joinDate' },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${row.active ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
          {row.active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); setStatusToggle({ member: row, activate: !row.active }); }}
            aria-label={row.active ? 'Deactivate' : 'Activate'}
            className={row.active ? 'text-destructive hover:text-destructive' : 'text-success hover:text-success'}
          >
            {row.active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <AppLayout><LoadingSkeleton variant="table" /></AppLayout>;
  if (error) return <AppLayout><ErrorState message={error} onRetry={fetchMembers} /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-display text-foreground">Members</h1>
          <p className="text-muted-foreground">Manage library members.</p>
        </header>

        <SearchInput placeholder="Search by name, email, or username..." value={search} onChange={setSearch} />

        <DataTable
          data={filtered}
          columns={columns}
          onRowClick={(row) => setSelectedMember(row)}
          emptyTitle="No members found"
        />
      </div>

      {/* Member Details Drawer */}
      <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Member Details</SheetTitle>
          </SheetHeader>
          {selectedMember && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">{selectedMember.fullName.charAt(0)}</span>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-foreground">{selectedMember.fullName}</h3>
                <p className="text-sm text-muted-foreground font-mono">@{selectedMember.username}</p>
              </div>
              <div className="space-y-3 surface-card p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">{selectedMember.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-foreground">{selectedMember.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedMember.active ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                    {selectedMember.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>

      {/* Status Toggle Confirmation */}
      <ConfirmDialog
        open={!!statusToggle}
        onOpenChange={(open) => !open && setStatusToggle(null)}
        title={statusToggle?.activate ? 'Activate Member' : 'Deactivate Member'}
        description={`Are you sure you want to ${statusToggle?.activate ? 'activate' : 'deactivate'} ${statusToggle?.member.fullName}?`}
        confirmLabel={statusToggle?.activate ? 'Activate' : 'Deactivate'}
        variant={statusToggle?.activate ? 'default' : 'destructive'}
        onConfirm={handleStatusChange}
        loading={submitting}
      />
    </AppLayout>
  );
};

export default MembersPage;
