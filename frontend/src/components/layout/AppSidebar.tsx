import { useState } from 'react';
import { BookOpen, LayoutDashboard, Users, ArrowRightLeft, Inbox, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarLink } from './SidebarLink';
import { getStoredRole } from '@/hooks/useAuth';

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const role = getStoredRole();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    ...(role === 'LIBRARIAN' ? [{ to: '/members', icon: Users, label: 'Members' }] : []),
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    ...(role === 'LIBRARIAN' ? [{ to: '/requests', icon: Inbox, label: 'Requests' }] : []),
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      <div className={`flex items-center gap-3 p-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-lg tracking-display text-foreground">LMS</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};
