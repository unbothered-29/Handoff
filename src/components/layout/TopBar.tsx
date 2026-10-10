import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  ChevronRight,
  ArrowRightLeft,
  Sun,
  Moon,
  LogOut
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
    theme,
    toggleTheme,
    logout
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
        return [{ label: 'Dashboard', path: 'overview' }];
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
          { label: 'Package Review & Transfer', path: 'handoff-detail' },
        ];
      case 'ai-assistant':
        return [{ label: 'AI Project Assistant', path: 'ai-assistant' }];
      case 'team':
        return [{ label: 'Team Directory', path: 'team' }];
      case 'activity-audit':
        return [{ label: 'Activity Audit', path: 'activity-audit' }];
      case 'settings':
        return [{ label: 'Workspace Settings', path: 'settings' }];
      default:
        return [{ label: 'Continuity', path: 'overview' }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={`sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#0c1f2b]/95 backdrop-blur-md border-b border-[#D3EBF9]/80 dark:border-[#1c4357] transition-all duration-300 ${
      collapsed ? 'lg:pl-20' : 'lg:pl-64'
    }`}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-[#F0F7FC] dark:hover:bg-[#16374a] lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-hidden" aria-label="Breadcrumb">
            <span className="font-bold text-[#1A435A] dark:text-[#D3EBF9] hidden sm:inline">Continuity</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#4987A4] shrink-0 hidden sm:inline" />
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}
                  <button
                    onClick={() => setCurrentView(crumb.path as any)}
                    className={`truncate transition-colors ${
                      isLast
                        ? 'font-semibold text-[#1A435A] dark:text-slate-100 cursor-default'
                        : 'hover:text-[#1A435A] dark:hover:text-[#D3EBF9] cursor-pointer'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Search, Theme Toggle, Notifications, Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative hidden md:block w-52 lg:w-64">
            <div className="relative">
              <Search className="w-4 h-4 text-[#4987A4] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, handoffs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F0F7FC] dark:bg-[#122e3d] border border-[#D3EBF9] dark:border-[#214e67] rounded-xl text-xs text-[#1A435A] dark:text-slate-100 placeholder:text-[#4987A4]/70 focus:outline-none focus:ring-1 focus:ring-[#4987A4] focus:bg-white dark:focus:bg-[#102d3e] transition-all"
              />
            </div>

            {/* Quick search popup */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 text-xs">
                {filteredProjects.length === 0 && filteredHandoffs.length === 0 ? (
                  <p className="p-2 text-slate-500 dark:text-slate-400 text-center">No results for &ldquo;{searchQuery}&rdquo;</p>
                ) : (
                  <>
                    {filteredProjects.length > 0 && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">Projects</span>
                        {filteredProjects.slice(0, 3).map(p => (
                          <button
                            key={p.id}
                            onMouseDown={() => {
                              setCurrentView('project-detail');
                            }}
                            className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-800 dark:text-slate-200 font-medium truncate block"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredHandoffs.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">Handoffs</span>
                        {filteredHandoffs.slice(0, 3).map(h => (
                          <button
                            key={h.id}
                            onMouseDown={() => navigateToHandoff(h.id)}
                            className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-800 dark:text-slate-200 font-medium truncate block"
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

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingForMe.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{pendingForMe.length} pending action</span>
                </div>
                {pendingForMe.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    No pending handoffs awaiting your review.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingForMe.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigateToHandoff(h.id);
                        }}
                        className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 hover:bg-amber-100/60 dark:hover:bg-amber-950/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {h.projectName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                          Handoff waiting for your acceptance (Pinned: {h.pinnedVersionId})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Persona & Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              title="Current user profile and perspective switcher"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Interactive Role Switcher
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Switch personas to test outgoing handoffs or incoming acceptance:
                  </p>
                </div>
                <div className="space-y-1">
                  {availableUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    const isSender = user.id === 'usr-1';
                    const isRecipient = user.id === 'usr-2';
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">{user.name}</span>
                            {isSender && (
                              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded font-normal">
                                Sender (Sarah)
                              </span>
                            )}
                            {isRecipient && (
                              <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-1.5 py-0.2 rounded font-normal">
                                Recipient (Marcus)
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sign Out Button in Persona Dropdown */}
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsPersonaOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Continuity</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign Out Icon Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Sign out of Continuity"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
