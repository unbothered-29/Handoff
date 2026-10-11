import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  X
} from 'lucide-react';
import { User, Role } from '../../types';

export const TeamView: React.FC = () => {
  const { 
    availableUsers, 
    currentUser, 
    setCurrentUser, 
    projects, 
    handoffs,
    navigateToProject,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Backend Engineer');
  const [inviteDepartment, setInviteDepartment] = useState('Core Engineering');

  const filteredUsers = availableUsers.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    showToast(
      'info', 
      'Member Simulated in Local State', 
      `Invitation prepared for ${inviteName} (${inviteEmail}). Note: Email dispatch is mocked in this prototype.`
    );
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
            Engineering Team
          </h1>
          <p className="text-xs text-[#A0A09D] mt-1">
            Engineers and system owners participating in continuity protocols and shift handoffs.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium shadow-md shadow-[#FF672E]/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite colleague</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50"
        />
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((member) => {
          const isCurrentUser = member.id === currentUser.id;
          const memberProjects = projects.filter(p => p.ownerId === member.id);
          const memberHandoffs = handoffs.filter(
            h => h.senderId === member.id || h.recipientId === member.id
          );

          return (
            <div
              key={member.id}
              className={`bg-[#0D0F10] border rounded-2xl p-5 transition-all flex flex-col justify-between ${
                isCurrentUser 
                  ? 'border-[#FF672E]/40 ring-1 ring-[#FF672E]/20' 
                  : 'border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              <div className="space-y-4">
                {/* Member Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h2 className="text-xs font-semibold text-[#F5F5F2] truncate">{member.name}</h2>
                      <p className="text-[11px] text-[#A0A09D] truncate">{member.role}</p>
                      <p className="text-[10px] text-[#A0A09D]/70 truncate font-mono">{member.department}</p>
                    </div>
                  </div>

                  {isCurrentUser && (
                    <span className="text-[10px] font-medium text-[#FF672E] bg-[#FF672E]/10 border border-[#FF672E]/30 px-2 py-0.5 rounded-full font-mono">
                      You
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs">
                  {/* Owned Projects */}
                  <div>
                    <span className="text-[11px] text-[#A0A09D]/70 block mb-1 font-mono">
                      Owned Systems ({memberProjects.length}):
                    </span>
                    {memberProjects.length === 0 ? (
                      <span className="text-[#A0A09D]/50 text-[11px] italic">No active projects assigned</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {memberProjects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => navigateToProject(p.id)}
                            className="px-2 py-0.5 bg-[#050606] hover:bg-white/[0.06] text-[#F5F5F2] border border-white/[0.08] rounded text-[11px] font-mono transition-colors truncate max-w-[200px]"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Handoff Participation */}
                  <div>
                    <span className="text-[11px] text-[#A0A09D]/70 block mb-1 font-mono">
                      Handoffs ({memberHandoffs.length}):
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[#A0A09D] font-mono">
                      <span>{memberHandoffs.filter(h => h.senderId === member.id).length} outgoing</span>
                      <span>&middot;</span>
                      <span>{memberHandoffs.filter(h => h.recipientId === member.id).length} incoming</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perspective Switch Button */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#A0A09D]/60 truncate font-mono">{member.email}</span>
                <button
                  onClick={() => setCurrentUser(member)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                    isCurrentUser
                      ? 'bg-white/[0.06] text-[#A0A09D]/50 cursor-default'
                      : 'bg-white/[0.06] hover:bg-[#FF672E] text-[#F5F5F2] hover:text-white cursor-pointer'
                  }`}
                  disabled={isCurrentUser}
                >
                  {isCurrentUser ? 'Active' : 'Switch'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0D0F10] rounded-2xl border border-white/[0.1] shadow-2xl max-w-md w-full overflow-hidden flex flex-col text-[#F5F5F2]">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#FF672E]" />
                <h3 className="text-sm font-semibold text-[#F5F5F2]">Invite Engineering Colleague</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-md text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50"
                />
              </div>

              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@enterprise.internal"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F5F5F2] mb-1.5">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50"
                  >
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Senior Staff Engineer">Senior Staff Engineer</option>
                    <option value="Engineering Lead">Engineering Lead</option>
                    <option value="DevOps / SRE">DevOps / SRE</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#F5F5F2] mb-1.5">Department</label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#050606] border border-white/[0.06] rounded-xl text-[11px] text-[#A0A09D] font-mono">
                Notice: Invitations are processed locally in demo sandbox memory.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white font-medium shadow-md shadow-[#FF672E]/20 cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
