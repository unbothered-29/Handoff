import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  Plus, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    handoffs, 
    setCurrentView, 
    navigateToProject, 
    openCreateHandoff 
  } = useApp();

  const pendingAwaitingMe = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  );
  const pendingHandoffsCount = handoffs.filter(h => h.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of engineering workspaces and active handoffs.
          </p>
        </div>

        <button
          onClick={() => openCreateHandoff()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New handoff</span>
        </button>
      </div>

      {/* Clean Minimalist Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setCurrentView('projects')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Projects</span>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {projects.length}
          </div>
        </button>

        <button
          onClick={() => setCurrentView('handoffs')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Handoffs</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {pendingHandoffsCount}
            </span>
            {pendingAwaitingMe.length > 0 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ({pendingAwaitingMe.length} for you)
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setCurrentView('projects')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active</span>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {projects.filter(p => p.status === 'Active' || p.status === 'Stable').length}
          </div>
        </button>

        <button
          onClick={() => setCurrentView('activity-audit')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recorded Releases</span>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {projects.reduce((acc, p) => acc + p.versions.length, 0)}
          </div>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Workspaces
          </h2>
          <button
            onClick={() => setCurrentView('projects')}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {projects.map((project) => {
            const statusVariant = 
              project.status === 'Active' ? 'success' :
              project.status === 'Transitioning' ? 'warning' :
              project.status === 'Review Needed' ? 'error' : 'neutral';

            return (
              <div
                key={project.id}
                onClick={() => navigateToProject(project.id, 'overview')}
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {project.name}
                    </span>
                    <StatusBadge variant={statusVariant as any}>
                      {project.status}
                    </StatusBadge>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      {project.currentVersionId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                    {project.team}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateHandoff(project.id);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Handoff
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
