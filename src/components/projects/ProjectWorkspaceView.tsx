import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  ArrowRightLeft, 
  GitCommit, 
  Layers, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Terminal, 
  FileCode, 
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Plus
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
  const pendingTasks = project.tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending');
  const completedTasks = project.tasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back breadcrumb navigation */}
      <button
        onClick={() => setCurrentView('projects')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects List</span>
      </button>

      {/* Project Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {project.name}
              </h1>
              <StatusBadge variant={statusVariant as any} size="md">
                {project.status}
              </StatusBadge>
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                HEAD: {project.currentVersionId}
              </span>
              {activeHandoff && (
                <span className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  Handoff Active (Pinned to {activeHandoff.pinnedVersionId})
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {project.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500">Owner:</span>
                {owner && (
                  <div className="flex items-center gap-1.5">
                    <img
                      src={owner.avatar}
                      alt={owner.name}
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{owner.name}</span>
                    <span className="text-slate-400 dark:text-slate-500">({owner.role})</span>
                  </div>
                )}
              </div>
              <span>·</span>
              <span>Squad: <strong className="text-slate-700 dark:text-slate-300 font-medium">{project.team}</strong></span>
              <span>·</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-xs">{project.repositoryUrl}</span>
            </div>
          </div>

          {/* Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openCreateHandoff(project.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Start Handoff</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Architecture', count: undefined },
            { id: 'history', label: 'Version History', count: project.versions.length },
            { id: 'tasks', label: 'Tasks & Blockers', count: blockers.length > 0 ? blockers.length : undefined },
            { id: 'files', label: 'Files & Runbooks', count: project.files.length },
          ].map((tab) => {
            const isActive = selectedProjectTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedProjectTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    tab.id === 'tasks' && blockers.length > 0
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>System Architecture & Runtime Overview</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-700">
              {project.architectureSummary}
            </p>
          </div>

          {/* Quickstart Guide */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Quickstart & Local Setup Runbook</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Verified by outgoing lead</span>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              {project.quickstartGuide}
            </pre>
          </div>

          {/* Architecture Decision Records (ADRs) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Architecture Decision Records (ADRs)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Crucial &ldquo;why&rdquo; technical rationale so inheriting engineers understand past trade-offs</p>
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{project.decisions.length} recorded</span>
            </div>

            {project.decisions.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">No architecture decision records logged for this project yet.</p>
            ) : (
              <div className="space-y-3">
                {project.decisions.map((adr) => (
                  <div key={adr.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {adr.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{adr.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">Decided: {adr.date}</span>
                    </div>

                    <div className="text-xs space-y-1 pt-1">
                      <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Context:</strong> {adr.context}</p>
                      <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Decision:</strong> {adr.decision}</p>
                      <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Consequences:</strong> {adr.consequences}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risks & Mitigations */}
          {project.risks.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Known Operational Risks & Safeguards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.risks.map((risk) => (
                  <div key={risk.id} className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200">{risk.title}</span>
                      <StatusBadge variant={risk.severity === 'High' ? 'error' : 'warning'}>
                        {risk.severity} Severity
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                      <strong className="text-amber-950 dark:text-amber-200">Mitigation:</strong> {risk.mitigation}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Contact: {risk.owner}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Version History */}
      {selectedProjectTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex items-start gap-3">
            <GitCommit className="w-5 h-5 text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-0.5">
              <p className="font-bold">Immutable Version Snapshots</p>
              <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                Handoffs bind to an exact snapshot version hash. If someone commits code after a handoff is initiated, 
                Continuity displays a drift warning so recipients never inherit ambiguous states.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
            {project.versions.map((ver, idx) => {
              const isHead = idx === 0;
              const isPinnedToHandoff = activeHandoff && activeHandoff.pinnedVersionId === ver.id;
              const isDiffOpen = activeDiffVersionId === ver.id;

              return (
                <div key={ver.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {ver.id}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        ({ver.hash})
                      </span>
                      {isHead && (
                        <StatusBadge variant="indigo">Current HEAD</StatusBadge>
                      )}
                      {isPinnedToHandoff && (
                        <StatusBadge variant="warning">Pinned in HO-2026-089</StatusBadge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={ver.author.avatar}
                          alt={ver.author.name}
                          className="w-4 h-4 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{ver.author.name}</span>
                      </div>
                      <span>·</span>
                      <span className="tabular-nums">{ver.timestamp.split('T')[0]}</span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700">
                    {ver.commitMessage}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      {ver.changedFilesCount} changed files
                    </span>
                    <button
                      onClick={() => setActiveDiffVersionId(isDiffOpen ? null : ver.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      {isDiffOpen ? 'Hide changed files' : 'View changed files'}
                    </button>
                  </div>

                  {isDiffOpen && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      {ver.changedFiles.map((file, fIdx) => (
                        <div key={fIdx} className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-slate-700 dark:text-slate-300 truncate">{file.path}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 tabular-nums">+{file.insertions} / -{file.deletions}</span>
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

      {/* Tab 3: Tasks & Blockers */}
      {selectedProjectTab === 'tasks' && (
        <div className="space-y-6">
          {/* Active Blockers Callout */}
          {blockers.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <span>Critical Blockers Requiring Immediate Escalation</span>
              </div>
              <div className="space-y-2">
                {blockers.map((b) => (
                  <div key={b.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{b.title}</span>
                      <StatusBadge variant="error">Critical Blocker</StatusBadge>
                    </div>
                    <p className="text-rose-800 dark:text-rose-300 font-medium">
                      <strong>Reason:</strong> {b.blockerReason || 'External dependency unfulfilled.'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Assigned to: {b.assignee || 'Unassigned'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Groupings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Outstanding Deliverables & Backlog</h3>
            
            <div className="space-y-2.5">
              {project.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{task.title}</span>
                      <StatusBadge variant={
                        task.status === 'Completed' ? 'success' :
                        task.status === 'Blocked' ? 'error' :
                        task.status === 'In Progress' ? 'indigo' : 'neutral'
                      }>
                        {task.status}
                      </StatusBadge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Priority: {task.priority}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                    {task.assignee && <span>Assignee: <strong className="text-slate-700 dark:text-slate-300">{task.assignee}</strong></span>}
                    {task.dueDate && <span>Due: {task.dueDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Files & Docs */}
      {selectedProjectTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Critical Project Files & Documentation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Essential source files and operations documents transferred with this project</p>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{project.files.length} registered assets</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {project.files.map((file) => (
                <div key={file.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileCode className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1">{file.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    <span className="capitalize bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700">{file.type}</span>
                    <span className="tabular-nums">{file.size}</span>
                    <span>Mod: {file.lastModified}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Secret Hygiene Enforced:</strong> All `.env`, certificate private keys, and credential stores are masked and omitted from public briefings.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
