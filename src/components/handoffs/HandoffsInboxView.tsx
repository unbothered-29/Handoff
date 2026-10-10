import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  ArrowRightLeft, 
  Search, 
  Plus, 
  ArrowRight
} from 'lucide-react';

type HandoffTab = 'all' | 'received' | 'sent' | 'pending' | 'accepted' | 'completed';

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
    if (activeTab === 'completed' && ho.status !== 'Completed') return false;

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Handoff Management & Inbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track and verify accountability transfers across projects and engineers.
          </p>
        </div>

        <button
          onClick={() => openCreateHandoff()}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Handoff</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tab filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Transfers' },
              { id: 'received', label: 'Received' },
              { id: 'sent', label: 'Sent by You' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as HandoffTab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Handoff Cards List */}
      {filteredHandoffs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No handoffs match this criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No active project transitions found in this view. Try changing your filters or initialize a new handoff.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearch('');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
                className={`bg-white dark:bg-slate-900 border rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isAwaitingMe 
                    ? 'border-amber-300/90 dark:border-amber-600/70 ring-1 ring-amber-300/40 dark:ring-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20' 
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {ho.id}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                      {ho.projectName}
                    </h2>
                    <StatusBadge variant={statusVariant as any}>
                      {ho.status}
                    </StatusBadge>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Pinned: {ho.pinnedVersionId} ({ho.pinnedVersionHash})
                    </span>
                    {isAwaitingMe && (
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        Action Required
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {ho.note}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 dark:text-slate-500">From:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{sender?.name || 'Unknown'}</strong>
                    </div>
                    <span>→</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 dark:text-slate-500">To:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{recipient?.name || 'Unknown'}</strong>
                    </div>
                    <span>·</span>
                    <span>Created: {ho.createdAt.split('T')[0]}</span>
                    <span>·</span>
                    <span>Target: {ho.targetCompletionDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToHandoff(ho.id);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 ${
                      isAwaitingMe
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{isAwaitingMe ? 'Review & Accept' : 'Inspect Package'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
