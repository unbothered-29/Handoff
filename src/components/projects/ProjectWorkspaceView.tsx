import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  ArrowRightLeft, 
  GitCommit, 
  Layers, 
  Terminal, 
  FileCode, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export const ProjectWorkspaceView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    selectedProjectTab, 
    setSelectedProjectTab, 
    setCurrentView, 
    openCreateHandoff, 
    availableUsers,
    handoffs
  } = useApp();

  const [activeDiffVersionId, setActiveDiffVersionId] = useState<string | null>(null);

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];
  const owner = availableUsers.find(u => u.id === project.ownerId);

  // Check if any active handoff is pinned to this project
  const activeHandoff = handoffs.find(h => h.projectId === project.id && h.status === 'Pending');

  const statusVariant = 
    project.status === 'Active' ? 'success' :
    project.status === 'Transitioning' ? 'warning' :
    project.status === 'Review Needed' ? 'error' : 'neutral';

  const blockers = project.tasks.filter(t => t.isBlocker || t.status === 'Blocked');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Back breadcrumb navigation */}
      <button
        onClick={() => setCurrentView('projects')}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#A0A09D] hover:text-[#F5F5F2] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to projects</span>
      </button>

      {/* Project Header Card */}
      <div className="bg-[#0D0F10] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
                {project.name}
              </h1>
              <StatusBadge variant={statusVariant as any}>
                {project.status}
              </StatusBadge>
              <span className="text-[11px] font-mono text-[#A0A09D] bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded">
                {project.currentVersionId}
              </span>
              {activeHandoff && (
                <span className="text-[11px] font-medium text-[#FF672E] bg-[#FF672E]/10 border border-[#FF672E]/30 px-2 py-0.5 rounded inline-flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-[#FF672E]" />
                  Handoff pending ({activeHandoff.pinnedVersionId})
                </span>
              )}
            </div>

            <p className="text-xs text-[#A0A09D] leading-relaxed max-w-3xl">
              {project.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#A0A09D]/80 flex-wrap pt-1 font-mono">
              {owner && (
                <div className="flex items-center gap-1.5">
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <span>Owner: <strong className="font-medium text-[#F5F5F2]">{owner.name}</strong></span>
                </div>
              )}
              <span>&middot;</span>
              <span>Team: {project.team}</span>
              <span>&middot;</span>
              <span className="truncate max-w-xs">{project.repositoryUrl}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 self-start sm:self-center">
            <button
              onClick={() => openCreateHandoff(project.id)}
              className="px-5 py-2.5 bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium rounded-full shadow-md shadow-[#FF672E]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Start a handoff</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'history', label: 'History', count: project.versions.length },
            { id: 'tasks', label: 'Tasks', count: blockers.length > 0 ? blockers.length : undefined },
            { id: 'files', label: 'Files', count: project.files.length },
          ].map((tab) => {
            const isActive = selectedProjectTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedProjectTab(tab.id as any)}
                className={`py-2 px-3 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-[#FF672E] text-[#F5F5F2] font-semibold'
                    : 'border-transparent text-[#A0A09D] hover:text-[#F5F5F2]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    tab.id === 'tasks' && blockers.length > 0
                      ? 'bg-rose-950/60 text-rose-300 font-bold border border-rose-800/40'
                      : 'bg-white/[0.06] text-[#A0A09D]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {selectedProjectTab === 'overview' && (
        <div className="space-y-6">
          {/* Architecture Summary */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              System Architecture &amp; Context
            </h3>
            <p className="text-xs text-[#F5F5F2] leading-relaxed font-mono bg-[#050606] p-4 rounded-lg border border-white/[0.06]">
              {project.architectureSummary}
            </p>
          </div>

          {/* Quickstart Setup */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              Setup &amp; Runbook
            </h3>
            <pre className="p-4 bg-[#050606] text-[#F5F5F2] rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-white/[0.06]">
              {project.quickstartGuide}
            </pre>
          </div>

          {/* Architecture Decision Records (ADRs) */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
                Architecture Decision Records
              </h3>
              <span className="text-[11px] text-[#A0A09D] font-mono">{project.decisions.length} recorded</span>
            </div>

            {project.decisions.length === 0 ? (
              <p className="text-xs text-[#A0A09D] py-2">No decision records logged.</p>
            ) : (
              <div className="space-y-3">
                {project.decisions.map((adr) => (
                  <div key={adr.id} className="p-3.5 rounded-lg border border-white/[0.06] bg-[#050606] space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-[#FF672E]">
                          {adr.id}
                        </span>
                        <span className="font-medium text-[#F5F5F2]">{adr.title}</span>
                      </div>
                      <span className="text-[11px] text-[#A0A09D] font-mono">{adr.date}</span>
                    </div>

                    <div className="text-xs space-y-1 pt-1 text-[#A0A09D]">
                      <p><strong className="text-[#F5F5F2] font-medium">Context:</strong> {adr.context}</p>
                      <p><strong className="text-[#F5F5F2] font-medium">Decision:</strong> {adr.decision}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Version History */}
      {selectedProjectTab === 'history' && (
        <div className="space-y-4">
          <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
            {project.versions.map((ver, idx) => {
              const isHead = idx === 0;
              const isPinnedToHandoff = activeHandoff && activeHandoff.pinnedVersionId === ver.id;
              const isDiffOpen = activeDiffVersionId === ver.id;

              return (
                <div key={ver.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-[#F5F5F2]">
                        {ver.id}
                      </span>
                      <span className="text-xs font-mono text-[#A0A09D]">
                        ({ver.hash})
                      </span>
                      {isHead && (
                        <StatusBadge variant="orange">HEAD</StatusBadge>
                      )}
                      {isPinnedToHandoff && (
                        <StatusBadge variant="warning">Pinned in handoff</StatusBadge>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-[#A0A09D] font-mono">
                      <span>{ver.author.name}</span>
                      <span>&middot;</span>
                      <span>{ver.timestamp.split('T')[0]}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#F5F5F2] font-mono bg-[#050606] p-3 rounded-lg border border-white/[0.06]">
                    {ver.commitMessage}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-[11px] text-[#A0A09D] font-mono">
                      {ver.changedFilesCount} changed files
                    </span>
                    <button
                      onClick={() => setActiveDiffVersionId(isDiffOpen ? null : ver.id)}
                      className="text-xs text-[#FF672E] hover:underline cursor-pointer font-medium"
                    >
                      {isDiffOpen ? 'Hide files' : 'View files'}
                    </button>
                  </div>

                  {isDiffOpen && (
                    <div className="mt-3 p-3 bg-[#050606] rounded-lg border border-white/[0.06] space-y-1.5 text-xs font-mono text-[11px]">
                      {ver.changedFiles.map((file, fIdx) => (
                        <div key={fIdx} className="flex items-center justify-between">
                          <span className="text-[#A0A09D] truncate">{file.path}</span>
                          <span className="text-emerald-400">+{file.insertions} / -{file.deletions}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Tasks */}
      {selectedProjectTab === 'tasks' && (
        <div className="space-y-4">
          {blockers.length > 0 && (
            <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 text-xs space-y-1.5">
              <span className="font-semibold text-rose-300">
                Critical Blockers ({blockers.length})
              </span>
              {blockers.map((b) => (
                <div key={b.id} className="text-rose-300/90 flex items-start gap-2">
                  <span className="font-medium">• {b.title}:</span>
                  <span>{b.blockerReason || 'External dependency unfulfilled.'}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
            {project.tasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/[0.03] transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-medium text-[#F5F5F2]">{task.title}</span>
                    <StatusBadge variant={
                      task.status === 'Completed' ? 'success' :
                      task.status === 'Blocked' ? 'error' :
                      task.status === 'In Progress' ? 'orange' : 'neutral'
                    }>
                      {task.status}
                    </StatusBadge>
                    <span className="text-[11px] text-[#A0A09D] font-mono">Priority: {task.priority}</span>
                  </div>
                  <p className="text-[#A0A09D] line-clamp-1">{task.description}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#A0A09D] shrink-0 font-mono">
                  {task.assignee && <span>Assignee: {task.assignee}</span>}
                  {task.dueDate && <span>Due: {task.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Files */}
      {selectedProjectTab === 'files' && (
        <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden text-xs">
          {project.files.map((file) => (
            <div key={file.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03]">
              <div className="flex items-start gap-3 min-w-0">
                <FileCode className="w-4 h-4 text-[#A0A09D] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-mono font-medium text-[#F5F5F2] truncate">{file.name}</p>
                  <p className="text-[#A0A09D] text-[11px] line-clamp-1">{file.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[#A0A09D] shrink-0 font-mono">
                <span className="capitalize bg-white/[0.06] px-2 py-0.5 rounded text-[#F5F5F2]">{file.type}</span>
                <span className="tabular-nums">{file.size}</span>
                <span>Modified {file.lastModified}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
