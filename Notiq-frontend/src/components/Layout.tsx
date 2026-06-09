import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SidebarProvider } from '../contexts/SidebarContext';
import { useEffect } from 'react';

// Wrapper to handle scroll restoration and simple page transitions
function PageWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    const main = document.getElementById('main-content');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-fade-in w-full h-full">
      <Outlet />
    </div>
  );
}

export function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/30 antialiased">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Header />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            <div className="mx-auto max-w-7xl">
              <PageWrapper />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
