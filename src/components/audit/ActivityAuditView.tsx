import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  ArrowRightLeft, 
  GitCommit, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
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
        return <ArrowRightLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'handoff_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'version_committed':
        return <GitCommit className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActivityBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'handoff_initiated':
        return { label: 'Handoff Initiated', bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'handoff_accepted':
        return { label: 'Handoff Accepted', bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'version_committed':
        return { label: 'Version Snapshot', bg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'task_completed':
        return { label: 'Task Resolved', bg: 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' };
      default:
        return { label: 'Activity', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Activity Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified audit trail of engineering handoffs, commit snapshots, and workspace ownership transitions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Immutable Ledger</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by engineer name, project, or description..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white cursor-pointer"
          >
            <option value="all">All Event Types</option>
            <option value="handoffs">Handoffs Only</option>
            <option value="commits">Version Snapshots</option>
            <option value="tasks">Task Completions</option>
          </select>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white cursor-pointer max-w-[160px] truncate"
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            No activity audit logs matching your search criteria.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const badge = getActivityBadge(act.type);
            const isHandoff = act.type.includes('handoff');

            return (
              <div
                key={act.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {act.actorName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {act.timestamp.replace('T', ' ').replace('Z', ' UTC')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <button
                        onClick={() => act.projectId && navigateToProject(act.projectId)}
                        className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
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
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors border border-transparent dark:border-slate-700 cursor-pointer"
                    >
                      View Handoff
                    </button>
                  )}
                  {act.projectId && (
                    <button
                      onClick={() => navigateToProject(act.projectId)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
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
