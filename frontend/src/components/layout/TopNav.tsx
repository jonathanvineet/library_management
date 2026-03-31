import { LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen, LayoutDashboard, Users, ArrowRightLeft, Inbox } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { getStoredRole } from '@/hooks/useAuth';

export const TopNav = () => {
  const { user, logout } = useAuth();
  const role = getStoredRole();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    ...(role === 'LIBRARIAN' ? [{ to: '/members', icon: Users, label: 'Members' }] : []),
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    ...(role === 'LIBRARIAN' ? [{ to: '/requests', icon: Inbox, label: 'Requests' }] : []),
  ];

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-display text-foreground">LMS</span>
            </div>
            <nav className="p-3 space-y-1">
              {links.map((link) => (
                <SidebarLink key={link.to} {...link} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-foreground">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.fullName || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" disabled>
              <span className="text-xs">Role:</span>
              {role && <StatusBadge status={role === 'LIBRARIAN' ? 'ACTIVE' : 'APPROVED'} />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
