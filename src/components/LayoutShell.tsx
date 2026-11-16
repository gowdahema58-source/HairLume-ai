import { useState, type ReactNode } from 'react';
import {
  BookOpen,
  Camera,
  FileText,
  History,
  Home,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  X,
} from 'lucide-react';
import { BRAND_LOGO_PATH } from '../data/catalog';
import type { AppRoute, UserProfile } from '../types/hairlume';

interface PublicLayoutProps {
  route: AppRoute;
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  children: ReactNode;
}

export function PublicLayout({ route, onNavigate, children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FC] text-[#1F122B]">
      {/* Auth-Gated 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF8FC]/95 backdrop-blur-sm border-b border-[#3F1957]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => onNavigate('intro')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            <img
              src={BRAND_LOGO_PATH}
              alt="HAIRLUME AI emblem"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-md object-cover border border-[#B76E79]/30"
            />
            <span className="font-editorial text-xl font-semibold tracking-tight text-[#2D123E]">
              HAIRLUME AI
            </span>
          </button>

          <nav aria-label="Authentication navigation" className="flex items-center gap-6 text-sm font-medium text-[#4A3859]">
            <button
              type="button"
              onClick={() => onNavigate('intro')}
              className="whitespace-nowrap shrink-0 pb-0.5 transition-colors hover:text-[#3F1957] cursor-pointer"
            >
              Intro
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
                route === 'login'
                  ? 'text-[#3F1957] font-semibold border-b border-[#B76E79]'
                  : 'hover:text-[#3F1957]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
                route === 'register'
                  ? 'text-[#3F1957] font-semibold border-b border-[#B76E79]'
                  : 'hover:text-[#3F1957]'
              }`}
            >
              Register
            </button>
          </nav>

          <button
            type="button"
            onClick={() => onNavigate(route === 'register' ? 'login' : 'register')}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#3F1957] text-white text-xs font-semibold hover:bg-[#2D123E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {route === 'register' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#3F1957]/10 bg-[#F3EEF8]/60 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-editorial text-lg font-semibold text-[#2D123E]">HAIRLUME AI</p>
            <p className="text-xs text-[#5E4B6E] mt-1">
              Discover · Detect · Revive — Sign in or register to access hair analysis and care tools.
            </p>
          </div>
          <p className="text-xs text-[#5E4B6E]">Members-Only Hair Health Workspace</p>
        </div>
      </footer>
    </div>
  );
}

interface WorkspaceLayoutProps {
  route: AppRoute;
  user: UserProfile;
  breadcrumbTitle: string;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function WorkspaceLayout({
  route,
  user,
  breadcrumbTitle,
  onNavigate,
  onLogout,
  children,
}: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links: Array<{ route: AppRoute; label: string; icon: ReactNode; adminOnly?: boolean }> = [
    { route: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { route: 'upload', label: 'Hair Image Upload', icon: <Camera className="w-4 h-4" /> },
    { route: 'results', label: 'Detection Results', icon: <FileText className="w-4 h-4" /> },
    { route: 'products', label: 'Recommendations', icon: <ShoppingBag className="w-4 h-4" /> },
    { route: 'history', label: 'Analysis History', icon: <History className="w-4 h-4" /> },
    { route: 'education', label: 'Education Hub', icon: <BookOpen className="w-4 h-4" /> },
    { route: 'profile', label: 'Profile Settings', icon: <UserIcon className="w-4 h-4" /> },
    {
      route: 'admin',
      label: 'Admin Dashboard',
      icon: <ShieldCheck className="w-4 h-4" />,
      adminOnly: true,
    },
  ];

  const visibleLinks = links.filter((l) => !l.adminOnly || user.role === 'admin');

  const navigateAndClose = (target: AppRoute) => {
    setSidebarOpen(false);
    onNavigate(target);
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8FC] text-[#1F122B]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#2D123E] text-white border-r border-white/10">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <img
              src={BRAND_LOGO_PATH}
              alt="HAIRLUME AI"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-md object-cover border border-[#C98690]/40"
            />
            <span className="font-editorial text-lg font-semibold tracking-wide text-white">
              HAIRLUME AI
            </span>
          </button>
        </div>

        <nav aria-label="Workspace navigation" className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {visibleLinks.map((item) => {
            const active = route === item.route || (route === 'analyze' && item.route === 'upload');
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateAndClose(item.route)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#3F1957] text-white border border-[#C98690]/40'
                    : 'text-[#E6DDF0]/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="text-xs text-[#E6DDF0]/80">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="truncate">
              {user.gender} · Age {user.age}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('intro')}
              className="flex-1 px-3 py-1.5 rounded-md border border-white/15 text-xs font-medium text-[#E6DDF0] hover:bg-white/10 cursor-pointer"
            >
              Intro Screen
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 text-xs font-medium text-[#F9EBF0] hover:bg-white/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-black/45" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 max-w-[80vw] bg-[#2D123E] text-white flex flex-col h-full z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
              <span className="font-editorial text-lg font-semibold">HAIRLUME AI</span>
              <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {visibleLinks.map((item) => {
                const active = route === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => navigateAndClose(item.route)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      active ? 'bg-[#3F1957] text-white' : 'text-[#E6DDF0]/85 hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Workspace Main Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-[#3F1957]/10 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 rounded-lg border border-[#3F1957]/15 text-[#2D123E]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-[#5E4B6E] truncate">
              <span>Workspace</span>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="font-semibold text-[#2D123E]">{breadcrumbTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3F1957] text-white text-xs font-semibold hover:bg-[#2D123E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            New Hair Analysis
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
