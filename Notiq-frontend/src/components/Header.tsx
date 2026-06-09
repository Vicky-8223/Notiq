import { useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { Menu, Search, Github, RefreshCw } from 'lucide-react';

interface Props {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: Props) {
  const { setMobileOpen } = useSidebar();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/notifications/')) return 'Notification Details';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/examples')) return 'Interactive Examples';
    if (path.startsWith('/architecture')) return 'System Architecture';
    if (path.startsWith('/api-docs')) return 'API Documentation';
    if (path.startsWith('/about')) return 'About Notiq';
    return 'Observability';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-md p-1.5 text-muted hover:bg-surface-light lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <h1 className="text-sm font-semibold tracking-tight text-foreground lg:text-base">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-light hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        )}

        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted sm:flex w-64 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <Search className="h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search (Ctrl+K)" 
            className="w-full bg-transparent outline-none placeholder:text-muted/70 text-foreground"
          />
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-light hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
