import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  ArrowRightLeft,
  ArrowRight
} from 'lucide-react';

type HandoffTab = 'all' | 'received' | 'sent' | 'pending' | 'accepted';

export const HandoffsInboxView: React.FC = () => {
  const { 
    handoffs, 
    currentUser, 
    availableUsers, 
    navigateToHandoff, 
    openCreateHandoff 
  } = useApp();

  const [activeTab, setActiveTab] = useState<HandoffTab>('all');
  const [search, setSearch] = useState('');

  const filteredHandoffs = handoffs.filter((ho) => {
    // Tab filter
    if (activeTab === 'received' && ho.recipientId !== currentUser.id) return false;
    if (activeTab === 'sent' && ho.senderId !== currentUser.id) return false;
    if (activeTab === 'pending' && ho.status !== 'Pending') return false;
    if (activeTab === 'accepted' && ho.status !== 'Accepted') return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = ho.id.toLowerCase().includes(q);
      const matchProj = ho.projectName.toLowerCase().includes(q);
      const matchNote = ho.note.toLowerCase().includes(q);
      const sender = availableUsers.find(u => u.id === ho.senderId);
      const recipient = availableUsers.find(u => u.id === ho.recipientId);
      const matchSender = sender?.name.toLowerCase().includes(q);
      const matchRecipient = recipient?.name.toLowerCase().includes(q);
      return matchId || matchProj || matchNote || matchSender || matchRecipient;
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
            Handoff Packages
          </h1>
          <p className="text-xs text-[#A0A09D] mt-1">
            Operational responsibility transfer briefings across projects and engineering shifts.
          </p>
        </div>

        <button
          onClick={() => openCreateHandoff()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium shadow-md shadow-[#FF672E]/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New handoff</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search handoffs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50"
          />
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'received', label: 'Received' },
            { id: 'sent', label: 'Sent' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as HandoffTab)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.1] text-[#F5F5F2] border border-white/[0.15]'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Handoff Rows Container */}
      {filteredHandoffs.length === 0 ? (
        <div className="border border-white/[0.08] rounded-xl p-12 text-center bg-[#0D0F10]">
          <ArrowRightLeft className="w-6 h-6 text-[#A0A09D] mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-[#F5F5F2]">No handoffs found</h3>
          <p className="text-xs text-[#A0A09D] mt-1">
            Try adjusting your search query or tab filter.
          </p>
        </div>
      ) : (
        <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
          {filteredHandoffs.map((ho) => {
            const sender = availableUsers.find(u => u.id === ho.senderId);
            const recipient = availableUsers.find(u => u.id === ho.recipientId);
            const isAwaitingMe = ho.recipientId === currentUser.id && ho.status === 'Pending';

            const statusVariant = 
              ho.status === 'Accepted' ? 'success' :
              ho.status === 'Pending' ? 'warning' :
              ho.status === 'Completed' ? 'neutral' : 'error';

            return (
              <div
                key={ho.id}
                onClick={() => navigateToHandoff(ho.id)}
                className={`p-5 hover:bg-white/[0.03] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isAwaitingMe ? 'bg-[#FF672E]/[0.03]' : ''
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-medium text-[#F5F5F2] group-hover:text-[#FF672E] transition-colors">
                      {ho.projectName}
                    </span>
                    <StatusBadge variant={statusVariant as any}>
                      {ho.status}
                    </StatusBadge>
                    <span className="text-[11px] font-mono text-[#A0A09D] bg-white/[0.06] px-2 py-0.5 rounded">
                      {ho.pinnedVersionId}
                    </span>
                    {isAwaitingMe && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FF672E]/10 text-[#FF672E] border border-[#FF672E]/30">
                        Needs your review
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#A0A09D] line-clamp-1">
                    {ho.note || 'Structured transfer package with runbooks, blockers, and architectural context.'}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#A0A09D]/70 flex-wrap pt-0.5 font-mono">
                    <span>From {sender?.name}</span>
                    <span>&rarr;</span>
                    <span>To {recipient?.name}</span>
                    <span>&middot;</span>
                    <span>{ho.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-[#FF672E] font-medium inline-flex items-center gap-1 group-hover:underline">
                    <span>View package</span>
                    <ChevronRight className="w-4 h-4 text-[#FF672E]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
