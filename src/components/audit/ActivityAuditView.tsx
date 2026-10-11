import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  ArrowRightLeft, 
  GitCommit, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ActivityItem } from '../../types';

export const ActivityAuditView: React.FC = () => {
  const { activities, projects, navigateToProject, navigateToHandoff } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const filteredActivities = activities.filter((act) => {
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'handoffs' && !act.type.includes('handoff')) return false;
      if (filterType === 'commits' && act.type !== 'version_committed') return false;
      if (filterType === 'tasks' && act.type !== 'task_completed') return false;
    }

    // Project filter
    if (selectedProjectId !== 'all' && act.projectId !== selectedProjectId) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        act.actorName.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.projectName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'handoff_initiated':
        return <ArrowRightLeft className="w-4 h-4 text-[#FF672E]" />;
      case 'handoff_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'version_committed':
        return <GitCommit className="w-4 h-4 text-[#06b6d4]" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-violet-400" />;
      default:
        return <History className="w-4 h-4 text-[#A0A09D]" />;
    }
  };

  const getActivityBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'handoff_initiated':
        return { label: 'Handoff Initiated', bg: 'bg-[#FF672E]/10 text-[#FF672E] border-[#FF672E]/30' };
      case 'handoff_accepted':
        return { label: 'Handoff Accepted', bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' };
      case 'version_committed':
        return { label: 'Version Snapshot', bg: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40' };
      case 'task_completed':
        return { label: 'Task Resolved', bg: 'bg-violet-950/40 text-violet-300 border-violet-800/40' };
      default:
        return { label: 'Activity', bg: 'bg-white/[0.04] text-[#A0A09D] border-white/[0.08]' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
            Activity Audit
          </h1>
          <p className="text-xs text-[#A0A09D] mt-1">
            Verified audit trail of engineering handoffs, commit snapshots, and workspace ownership transitions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D0F10] border border-white/[0.08] text-[#A0A09D]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immutable Ledger</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50 cursor-pointer"
          >
            <option value="all">All Events</option>
            <option value="handoffs">Handoffs</option>
            <option value="commits">Version Snapshots</option>
            <option value="tasks">Task Completions</option>
          </select>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50 cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-[#A0A09D] text-xs">
            No activity audit logs matching your search criteria.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const badge = getActivityBadge(act.type);
            const isHandoff = act.type.includes('handoff');

            return (
              <div
                key={act.id}
                className="p-5 hover:bg-white/[0.03] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#050606] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-semibold text-[#F5F5F2]">
                        {act.actorName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium font-mono ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-[#A0A09D]/60 font-mono">
                        {act.timestamp.replace('T', ' ').replace('Z', ' UTC')}
                      </span>
                    </div>

                    <p className="text-xs text-[#A0A09D] leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <button
                        onClick={() => act.projectId && navigateToProject(act.projectId)}
                        className="inline-flex items-center gap-1 font-medium text-[#FF672E] hover:underline cursor-pointer"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{act.projectName}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isHandoff && (
                    <button
                      onClick={() => navigateToHandoff('HO-2026-089')}
                      className="px-3 py-1 bg-white/[0.06] hover:bg-[#FF672E] hover:text-white text-[#F5F5F2] text-xs font-medium rounded-full transition-colors cursor-pointer"
                    >
                      View Handoff
                    </button>
                  )}
                  {act.projectId && (
                    <button
                      onClick={() => navigateToProject(act.projectId)}
                      className="p-1.5 text-[#A0A09D] hover:text-[#F5F5F2] rounded-md cursor-pointer"
                      title="Open project workspace"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
