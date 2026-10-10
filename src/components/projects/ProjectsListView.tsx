import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { CreateProjectModal } from './CreateProjectModal';
import { 
  Search, 
  Plus, 
  ArrowRightLeft, 
  GitBranch, 
  Layers, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { ProjectStatus } from '../../types';

export const ProjectsListView: React.FC = () => {
  const { 
    projects, 
    navigateToProject, 
    openCreateHandoff, 
    availableUsers,
    isCreateProjectOpen,
    setIsCreateProjectOpen
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.team.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A435A] dark:text-white">
            Project Workspaces
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered services, components, and platforms under active continuity tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 dark:bg-[#102d3e]/80 border border-[#D3EBF9] dark:border-[#214e67] rounded-2xl p-3 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#4987A4] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter projects by title, description, or squad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F0F7FC] dark:bg-[#122e3d] border border-[#D3EBF9] dark:border-[#214e67] rounded-xl text-xs text-[#1A435A] dark:text-slate-100 placeholder:text-[#4987A4]/70 focus:outline-none focus:ring-1 focus:ring-[#4987A4] focus:bg-white dark:focus:bg-[#102d3e] transition-all"
          />
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Active', 'Transitioning', 'Review Needed', 'Stable'] as const).map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#1A435A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#1A435A] dark:hover:text-white hover:bg-[#F0F7FC] dark:hover:bg-[#18394b]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects List Container */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No project workspaces found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            {search || statusFilter !== 'All'
              ? 'Try adjusting your search keywords or status filter.'
              : 'Create your first project workspace to start tracking versions and handoffs.'}
          </p>
          {(search || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => {
            const owner = availableUsers.find(u => u.id === project.ownerId);
            const statusVariant = 
              project.status === 'Active' ? 'success' :
              project.status === 'Transitioning' ? 'warning' :
              project.status === 'Review Needed' ? 'error' : 'neutral';

            const blockersCount = project.tasks.filter(t => t.isBlocker).length;

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
              >
                {/* Left Info */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 
                      onClick={() => navigateToProject(project.id, 'overview')}
                      className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {project.name}
                    </h2>
                    <StatusBadge variant={statusVariant as any}>
                      {project.status}
                    </StatusBadge>
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {project.currentVersionId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-3xl leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 dark:text-slate-500">Owner:</span>
                      {owner ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={owner.avatar}
                            alt={owner.name}
                            className="w-4 h-4 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{owner.name}</span>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800 dark:text-slate-200">Unassigned</span>
                      )}
                    </div>
                    <span>·</span>
                    <span>Squad: <strong className="text-slate-700 dark:text-slate-300 font-medium">{project.team}</strong></span>
                    <span>·</span>
                    <span><strong className="text-slate-700 dark:text-slate-300 font-medium tabular-nums">{project.versions.length}</strong> versions</span>
                    <span>·</span>
                    {blockersCount > 0 ? (
                      <span className="text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {blockersCount} active blocker
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Zero blockers
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center border-t lg:border-t-0 dark:border-slate-800 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => openCreateHandoff(project.id)}
                    className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    title="Initiate transfer of this project"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Handoff</span>
                  </button>

                  <button
                    onClick={() => navigateToProject(project.id, 'overview')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </div>
  );
};
