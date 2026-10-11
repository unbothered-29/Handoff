import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { CreateProjectModal } from './CreateProjectModal';
import { 
  Search, 
  Plus, 
  Layers, 
  ChevronRight,
  ArrowRight
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
            Workspaces &amp; Services
          </h1>
          <p className="text-xs text-[#A0A09D] mt-1">
            Projects and system repositories under active continuity protocol.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium cursor-pointer shadow-md shadow-[#FF672E]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Active', 'Transitioning', 'Review Needed', 'Stable'] as const).map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.1] text-[#F5F5F2] border border-white/[0.15]'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
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
        <div className="border border-white/[0.08] rounded-xl p-12 text-center bg-[#0D0F10]">
          <Layers className="w-6 h-6 text-[#A0A09D] mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-[#F5F5F2]">No projects found</h3>
          <p className="text-xs text-[#A0A09D] mt-1">
            Try adjusting your search keywords or status filter.
          </p>
        </div>
      ) : (
        <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
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
                onClick={() => navigateToProject(project.id, 'overview')}
                className="p-5 hover:bg-white/[0.03] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-sm font-medium text-[#F5F5F2] group-hover:text-[#FF672E] transition-colors">
                      {project.name}
                    </h2>
                    <StatusBadge variant={statusVariant as any}>
                      {project.status}
                    </StatusBadge>
                    <span className="text-[11px] font-mono text-[#A0A09D] bg-white/[0.06] px-2 py-0.5 rounded">
                      {project.currentVersionId}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A09D] line-clamp-1 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#A0A09D]/70 flex-wrap pt-0.5 font-mono">
                    {owner && <span>Owner: {owner.name}</span>}
                    <span>&middot;</span>
                    <span>Team: {project.team}</span>
                    <span>&middot;</span>
                    <span>{project.versions.length} versions</span>
                    {blockersCount > 0 && (
                      <>
                        <span>&middot;</span>
                        <span className="text-rose-400 font-medium">
                          {blockersCount} blocker
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateHandoff(project.id);
                    }}
                    className="px-3 py-1 text-xs text-[#A0A09D] hover:text-[#FF672E] hover:border-[#FF672E]/40 rounded-full border border-white/[0.08] transition-colors cursor-pointer"
                  >
                    Handoff
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#A0A09D] group-hover:text-[#F5F5F2] transition-colors" />
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
