import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { 
  LayoutDashboard, 
  Layers, 
  ArrowRightLeft, 
  Bot, 
  Users, 
  Settings, 
  GitBranch, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Plus,
  Sun,
  Moon,
  ArrowUpRight,
  LogOut,
  History
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { 
    currentView, 
    setCurrentView, 
    handoffs, 
    currentUser, 
    openCreateHandoff,
    theme,
    toggleTheme,
    logout
  } = useApp();

  // Calculate pending handoffs awaiting current user's review
  const pendingReceivedCount = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  ).length;

  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Layers className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'handoffs',
      label: 'Handoffs',
      icon: <ArrowRightLeft className="w-5 h-5 shrink-0" />,
      badge: pendingReceivedCount > 0 ? pendingReceivedCount : undefined,
    },
    {
      id: 'activity-audit',
      label: 'Activity Audit',
      icon: <History className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0f2430] text-slate-200 border-r border-[#1c4357] transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1c4357]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4987A4] to-[#1A435A] flex items-center justify-center shrink-0 shadow-sm border border-[#D3EBF9]/30">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-base font-bold text-white tracking-tight block">
                  Continuity
                </span>
                <span className="text-[11px] text-[#D3EBF9]/70 block font-normal truncate">
                  Company Workplace
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#18394b] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          {collapsed ? (
            <button
              onClick={() => openCreateHandoff()}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer shadow-xs"
              title="Start new project handoff"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => openCreateHandoff()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Handoff</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id || 
              (item.id === 'projects' && currentView === 'project-detail') ||
              (item.id === 'handoffs' && currentView === 'handoff-detail');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1A435A] text-white border border-[#4987A4]/50 shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#18394b]/60'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-[#4987A4]/30 text-[#D3EBF9] rounded-md border border-[#4987A4]/50">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4987A4]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Quick Toggle */}
        <div className={`px-3 py-2 border-t border-[#1c4357] flex items-center ${collapsed ? 'justify-center' : 'justify-start'} text-xs bg-[#0b1d28]`}>
          {!collapsed ? (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-[#18394b] transition-colors w-full"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#D3EBF9]" />
              )}
              <span className="text-[11px] capitalize">{theme} mode</span>
            </button>
          ) : (
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#18394b] transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-[#D3EBF9]" />
              )}
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-[#1c4357] bg-[#0c1f2b]">
          <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'justify-center' : ''}`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#4987A4]/50 shrink-0"
                referrerPolicy="no-referrer"
              />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.role}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#18394b] transition-colors shrink-0 cursor-pointer"
                title="Sign out of Continuity"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
