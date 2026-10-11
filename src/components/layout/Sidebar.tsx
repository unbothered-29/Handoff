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
  ChevronLeft, 
  ChevronRight,
  Plus,
  Sun,
  Moon,
  LogOut,
  History,
  GitCommit
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
    logout,
    setIsPersonaSwitcherOpen
  } = useApp();

  // Pending handoffs for badge
  const pendingReceivedCount = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  ).length;

  const primaryNavItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Layers className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'handoffs',
      label: 'Handoffs',
      icon: <ArrowRightLeft className="w-4 h-4 shrink-0" />,
      badge: pendingReceivedCount > 0 ? pendingReceivedCount : undefined,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4 shrink-0" />,
    },
  ];

  const secondaryNavItems: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    {
      id: 'activity-audit',
      label: 'Activity Audit',
      icon: <History className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
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
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#050606] text-[#A0A09D] border-r border-white/[0.08] transition-all duration-200 flex flex-col ${
          collapsed ? 'w-16' : 'w-60'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-[#FF672E] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-tight shadow-xs shadow-[#FF672E]/30">
              <GitCommit className="w-3.5 h-3.5" />
            </div>
            {!collapsed && (
              <span className="text-xs font-semibold tracking-wider text-[#F5F5F2] uppercase font-mono">
                CONTINUITY
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-md text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-3">
          <button
            onClick={() => openCreateHandoff()}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium cursor-pointer shadow-md shadow-[#FF672E]/20 transition-all ${
              collapsed ? 'px-0' : ''
            }`}
            title="Start a handoff"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Start a handoff</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto no-scrollbar">
          {primaryNavItems.map((item) => {
            const isActive = currentView === item.id || 
              (item.id === 'projects' && currentView === 'project-detail') ||
              (item.id === 'handoffs' && currentView === 'handoff-detail');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer relative ${
                  isActive
                    ? 'bg-white/[0.08] text-[#F5F5F2] font-medium border-l-2 border-[#FF672E]'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center px-0 border-l-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-[#FF672E]/15 text-[#FF672E] rounded border border-[#FF672E]/30 font-mono">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF672E]" />
                )}
              </button>
            );
          })}

          {/* Secondary Section Divider */}
          <div className="pt-4 pb-1">
            <div className="border-t border-white/[0.08] my-1" />
            {!collapsed && (
              <p className="px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase text-[#A0A09D]/60 font-mono">
                Workspace
              </p>
            )}
          </div>

          {secondaryNavItems.map((item) => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] text-[#F5F5F2] font-medium border-l-2 border-[#FF672E]'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center px-0 border-l-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme & Profile Bottom Area */}
        <div className="p-2.5 border-t border-white/[0.08] space-y-1">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04] transition-colors cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
            {!collapsed && <span className="capitalize">{theme} mode</span>}
          </button>

          <div className={`flex items-center gap-1.5 pt-1 px-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <button
              onClick={() => setIsPersonaSwitcherOpen(true)}
              className={`flex items-center gap-2 min-w-0 text-left p-1 -m-1 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                collapsed ? 'justify-center' : 'flex-1'
              }`}
              title="Click to switch employee perspective"
            >
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#050606]" />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F5F5F2] truncate group-hover:text-[#FF672E] transition-colors">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#A0A09D] truncate">
                    Switch &middot; {currentUser.role.split(' ')[0]}
                  </p>
                </div>
              )}
            </button>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#A0A09D] hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer shrink-0"
                title="Sign out"
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
