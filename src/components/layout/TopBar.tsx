import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  ArrowRightLeft,
  LogOut,
  Sparkles
} from 'lucide-react';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  collapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu, collapsed }) => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    setCurrentUser, 
    availableUsers, 
    handoffs,
    navigateToHandoff,
    projects,
    selectedProjectId,
    logout,
    setIsPersonaSwitcherOpen
  } = useApp();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Pending reviews for current user
  const pendingForMe = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  );

  // Search results
  const filteredProjects = searchQuery.trim() 
    ? projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredHandoffs = searchQuery.trim()
    ? handoffs.filter(h => h.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || h.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'overview':
        return [{ label: 'Overview', path: 'overview' }];
      case 'projects':
        return [{ label: 'Projects', path: 'projects' }];
      case 'project-detail': {
        const proj = projects.find(p => p.id === selectedProjectId);
        return [
          { label: 'Projects', path: 'projects' },
          { label: proj ? proj.name : 'Workspace', path: 'project-detail' },
        ];
      }
      case 'handoffs':
        return [{ label: 'Handoffs', path: 'handoffs' }];
      case 'handoff-detail':
        return [
          { label: 'Handoffs', path: 'handoffs' },
          { label: 'Package Review', path: 'handoff-detail' },
        ];
      case 'ai-assistant':
        return [{ label: 'AI Assistant', path: 'ai-assistant' }];
      case 'team':
        return [{ label: 'Team', path: 'team' }];
      case 'activity-audit':
        return [{ label: 'Activity Audit', path: 'activity-audit' }];
      case 'settings':
        return [{ label: 'Settings', path: 'settings' }];
      default:
        return [{ label: 'Overview', path: 'overview' }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={`sticky top-0 z-30 h-14 bg-[#050606]/95 backdrop-blur-md border-b border-white/[0.08] transition-all duration-200 ${
      collapsed ? 'lg:pl-16' : 'lg:pl-60'
    }`}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile menu & Minimal Brand/Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 -ml-1 rounded-md text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] lg:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <nav className="flex items-center gap-2 text-xs text-[#A0A09D] overflow-hidden" aria-label="Breadcrumb">
            <span className="font-semibold tracking-wider text-xs uppercase text-[#F5F5F2] hidden sm:inline font-mono">
              CONTINUITY
            </span>
            <ChevronRight className="w-3 h-3 text-white/20 shrink-0 hidden sm:inline" />
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />}
                  <button
                    onClick={() => setCurrentView(crumb.path as any)}
                    className={`truncate transition-colors ${
                      isLast
                        ? 'font-medium text-[#F5F5F2] cursor-default'
                        : 'hover:text-[#F5F5F2] cursor-pointer'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, User Persona */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-8 pr-3 py-1 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50 transition-all"
              />
            </div>

            {/* Quick search popup */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0D0F10] border border-white/[0.1] rounded-xl shadow-2xl p-2 z-50 text-xs">
                {filteredProjects.length === 0 && filteredHandoffs.length === 0 ? (
                  <p className="p-2 text-[#A0A09D] text-center">No results for &ldquo;{searchQuery}&rdquo;</p>
                ) : (
                  <>
                    {filteredProjects.length > 0 && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold text-[#A0A09D]/70 uppercase tracking-wider px-2">Projects</span>
                        {filteredProjects.slice(0, 3).map(p => (
                          <button
                            key={p.id}
                            onMouseDown={() => {
                              setCurrentView('project-detail');
                            }}
                            className="w-full text-left px-2 py-1.5 hover:bg-white/[0.04] rounded-lg text-[#F5F5F2] font-medium truncate block cursor-pointer"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredHandoffs.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-[#A0A09D]/70 uppercase tracking-wider px-2">Handoffs</span>
                        {filteredHandoffs.slice(0, 3).map(h => (
                          <button
                            key={h.id}
                            onMouseDown={() => navigateToHandoff(h.id)}
                            className="w-full text-left px-2 py-1.5 hover:bg-white/[0.04] rounded-lg text-[#F5F5F2] font-medium truncate block cursor-pointer"
                          >
                            {h.id} — {h.projectName}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 rounded-lg text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingForMe.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF672E]" />
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationsOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#0D0F10] border border-white/[0.1] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                    <span className="text-xs font-semibold text-[#F5F5F2]">Attention Items</span>
                    <span className="text-[11px] text-[#A0A09D] font-mono">{pendingForMe.length} pending</span>
                  </div>
                  {pendingForMe.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#A0A09D]">
                      No pending handoffs awaiting your sign-off.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {pendingForMe.map((h) => (
                        <div
                          key={h.id}
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigateToHandoff(h.id);
                          }}
                          className="p-2.5 rounded-lg bg-[#FF672E]/[0.05] border border-[#FF672E]/20 hover:bg-[#FF672E]/[0.1] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-[#FF672E] shrink-0" />
                            <span className="text-xs font-medium text-[#F5F5F2] truncate">
                              {h.projectName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A0A09D] line-clamp-1">
                            Awaiting sign-off &middot; Pinned: {h.pinnedVersionId}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Persona & Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-[#0D0F10] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] rounded-full text-xs font-medium text-[#F5F5F2] transition-colors cursor-pointer"
              title="Switch user perspective"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-xs text-[#F5F5F2] truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[#A0A09D]" />
            </button>

            {isPersonaOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsPersonaOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#0D0F10] border border-white/[0.1] rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 border-b border-white/[0.08] mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-[#A0A09D]/80 uppercase tracking-wider">
                      Switch Perspective
                    </p>
                    <button
                      onClick={() => {
                        setIsPersonaOpen(false);
                        setIsPersonaSwitcherOpen(true);
                      }}
                      className="text-[10px] text-[#FF672E] hover:underline cursor-pointer"
                    >
                      Directory
                    </button>
                  </div>
                  <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
                    {availableUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUser(user);
                            setIsPersonaOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-white/[0.08] text-[#F5F5F2] font-medium'
                              : 'hover:bg-white/[0.04] text-[#A0A09D] hover:text-[#F5F5F2]'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate text-[#F5F5F2]">{user.name}</p>
                            <p className="text-[10px] text-[#A0A09D] truncate">{user.role}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/[0.08] space-y-1">
                    <button
                      onClick={() => {
                        setIsPersonaOpen(false);
                        setIsPersonaSwitcherOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-lg text-xs text-[#FF672E] hover:bg-[#FF672E]/10 transition-colors cursor-pointer font-medium"
                    >
                      <span>Switch employee directory...</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPersonaOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
