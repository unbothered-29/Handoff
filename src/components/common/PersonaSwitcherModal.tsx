import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Check, 
  X, 
  LogOut
} from 'lucide-react';

interface PersonaSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaSwitcherModal: React.FC<PersonaSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    availableUsers, 
    projects, 
    handoffs,
    logout 
  } = useApp();

  const [search, setSearch] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter(u => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleSelectUser = (user: typeof currentUser) => {
    setCurrentUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 text-[#F5F5F2]">
      <div 
        className="bg-[#0D0F10] w-full max-w-lg rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="persona-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF672E]/15 text-[#FF672E] border border-[#FF672E]/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="persona-modal-title" className="text-sm font-semibold text-[#F5F5F2]">
                Switch Employee Perspective
              </h2>
              <p className="text-xs text-[#A0A09D]">
                Test handoffs, assignments, and permissions as another team member.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 pt-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-white/[0.06]">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#A0A09D]">
              No employee matches &ldquo;{search}&rdquo;
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = user.id === currentUser.id;
              const pendingHandoffs = handoffs.filter(
                h => h.recipientId === user.id && h.status === 'Pending'
              ).length;
              const userProjects = projects.filter(p => p.ownerId === user.id).length;

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`py-3 px-3 -mx-3 flex items-center justify-between gap-3 hover:bg-white/[0.04] rounded-xl cursor-pointer transition-colors group ${
                    isSelected ? 'bg-[#FF672E]/[0.05]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF672E] text-white rounded-full flex items-center justify-center ring-2 ring-[#0D0F10]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F5F5F2] truncate">
                          {user.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#FF672E]/15 text-[#FF672E] border border-[#FF672E]/30 font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A0A09D] truncate">
                        {user.role} &middot; {user.department}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#A0A09D]/60 pt-0.5 font-mono">
                        <span>{userProjects} projects</span>
                        {pendingHandoffs > 0 && (
                          <>
                            <span>&middot;</span>
                            <span className="text-[#FF672E] font-medium">
                              {pendingHandoffs} handoff{pendingHandoffs > 1 ? 's' : ''} in queue
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user);
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF672E] text-white shadow-xs'
                        : 'bg-white/[0.06] text-[#A0A09D] group-hover:bg-[#FF672E] group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Switch'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#050606] flex items-center justify-between">
          <span className="text-xs text-[#A0A09D] font-mono">
            {availableUsers.length} employees registered
          </span>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out to login screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
