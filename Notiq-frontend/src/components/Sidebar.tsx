import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Bell, 
  FileCode, 
  Network, 
  Book, 
  Info,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Examples', path: '/examples', icon: FileCode },
  { name: 'Architecture', path: '/architecture', icon: Network },
  { name: 'API Docs', path: '/api-docs', icon: Book },
  { name: 'About', path: '/about', icon: Info },
];

export function Sidebar() {
  const location = useLocation();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300 ease-in-out lg:static",
          collapsed ? "w-[80px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden px-2" onClick={() => setMobileOpen(false)}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-white shadow-[0_0_20px_rgba(79,140,255,0.3)]">
              N
            </div>
            <span className={cn("text-xl font-bold tracking-tight text-foreground transition-opacity duration-300", collapsed && "opacity-0 lg:hidden")}>
              Notiq
            </span>
          </Link>
          <button 
            className="rounded-md p-1.5 text-muted hover:bg-surface-light lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="group relative flex items-center"
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                
                <div className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-[0_0_15px_rgba(79,140,255,0.05)]" 
                    : "text-muted hover:bg-surface-light hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}>
                  <Icon 
                    className={cn(
                      "shrink-0 transition-colors duration-200",
                      collapsed ? "h-6 w-6" : "h-5 w-5 mr-3",
                      isActive ? "text-primary" : "text-muted group-hover:text-foreground"
                    )} 
                  />
                  <span className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    collapsed ? "w-0 opacity-0 lg:hidden" : "w-auto opacity-100"
                  )}>
                    {item.name}
                  </span>
                </div>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-4 hidden rounded-md bg-surface-light px-2 py-1.5 text-xs font-medium text-foreground shadow-lg group-hover:block z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Toggle */}
        <div className="border-t border-border p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center rounded-lg p-2 text-muted hover:bg-surface-light hover:text-foreground transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          
          <div className={cn(
            "mt-4 flex items-center justify-center gap-2",
            collapsed ? "lg:hidden" : ""
          )}>
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted">Backend Connected</span>
          </div>
        </div>
      </div>
    </>
  );
}
