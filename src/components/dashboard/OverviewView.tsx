import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { IridescentWave } from '../common/IridescentWave';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  Users,
  Sparkles
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    handoffs, 
    activities,
    setCurrentView, 
    navigateToProject, 
    navigateToHandoff,
    openCreateHandoff,
    availableUsers,
    setIsPersonaSwitcherOpen 
  } = useApp();

  const detailsRef = useRef<HTMLDivElement>(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pending handoffs requiring current user's review (or any pending team handoff)
  const pendingForMe = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  );
  const otherPending = handoffs.filter(
    h => h.status === 'Pending' && h.recipientId !== currentUser.id
  );
  const allPending = [...pendingForMe, ...otherPending];

  // Projects to display (top 5)
  const displayProjects = projects.slice(0, 5);

  // Recent activity (latest 4)
  const recentActivities = activities.slice(0, 4);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-[#F5F5F2]">
      {/* 
        ============================================================
        CINEMATIC HERO SECTION
        Near-black canvas, oversized typography, iridescent glass wave,
        and vivid warm orange (#FF672E) CTA.
        ============================================================
      */}
      <section className="relative min-h-[calc(100vh-9rem)] flex flex-col justify-between py-10 sm:py-16 lg:py-20 overflow-hidden">
        {/* Abstract Iridescent Holographic Glass Wave in Lower Right */}
        <div className="absolute right-0 bottom-0 w-full sm:w-3/4 md:w-2/3 lg:w-3/5 h-3/4 lg:h-5/6 pointer-events-none z-0">
          <IridescentWave />
        </div>

        {/* Content Container (Above Wave) */}
        <div className="relative z-10 max-w-3xl space-y-8 my-auto">
          {/* Subtle Employee & Workspace Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs text-[#A0A09D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF672E] animate-pulse" />
            <span className="font-medium text-[#F5F5F2]">{currentUser.name}</span>
            <span className="text-white/20">&middot;</span>
            <span>{currentUser.role}</span>
            <button
              onClick={() => setIsPersonaSwitcherOpen(true)}
              className="ml-1 text-[11px] text-[#FF672E] hover:text-[#ff814d] hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <Users className="w-3 h-3" />
              <span>Switch</span>
            </button>
          </div>

          {/* Oversized Cinematic Typography (64–88px on desktop) */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold tracking-[-0.04em] text-[#F5F5F2] leading-[0.92] uppercase select-none">
              Project<br />
              Continuity.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#A0A09D] font-normal leading-relaxed max-w-xl pt-3">
              Every project has a story. Make sure the next person can continue it.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-5 pt-3">
            {/* Primary vivid warm orange action button */}
            <button
              onClick={() => openCreateHandoff()}
              className="px-8 py-3.5 bg-[#FF672E] hover:bg-[#e6531e] text-white font-medium text-sm sm:text-base rounded-full shadow-xl shadow-[#FF672E]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>Start a handoff</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary text link */}
            <button
              onClick={scrollToDetails}
              className="text-[#A0A09D] hover:text-[#F5F5F2] text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 group py-2"
            >
              <span>Explore projects</span>
              <ChevronDown className="w-4 h-4 text-[#A0A09D] group-hover:text-[#F5F5F2] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Hero Bottom Cue */}
        <div className="relative z-10 pt-10 flex items-center justify-between text-xs text-[#A0A09D]">
          <button
            onClick={scrollToDetails}
            className="group inline-flex items-center gap-2 text-xs text-[#A0A09D] hover:text-[#F5F5F2] transition-colors cursor-pointer"
          >
            <span>Scroll to view attention items &amp; projects</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
          </button>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#A0A09D]/60 tracking-wider uppercase font-mono">
            <span>{projects.length} Active Workspaces</span>
            <span>&middot;</span>
            <span>{allPending.length} Handoffs in Queue</span>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        BELOW THE HERO:
        Minimal, restrained, spacious workspace overview.
        ============================================================
      */}
      <div ref={detailsRef} id="workspace-details" className="pt-16 pb-24 space-y-16">
        {/* Needs Your Attention Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-semibold tracking-wider uppercase text-[#A0A09D]">
                Needs your attention
              </h2>
              {pendingForMe.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FF672E] ring-4 ring-[#FF672E]/20" />
              )}
            </div>
            {allPending.length > 0 && (
              <button
                onClick={() => setCurrentView('handoffs')}
                className="text-xs text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer transition-colors"
              >
                View all pending ({allPending.length})
              </button>
            )}
          </div>

          {allPending.length === 0 ? (
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0D0F10] text-xs text-[#A0A09D] flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All caught up. No pending handoffs currently require your action.</span>
            </div>
          ) : (
            <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
              {allPending.map((ho) => {
                const isDirectlyAssignedToMe = ho.recipientId === currentUser.id;
                const sender = availableUsers.find(u => u.id === ho.senderId);

                return (
                  <div
                    key={ho.id}
                    onClick={() => navigateToHandoff(ho.id)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] cursor-pointer transition-colors group ${
                      isDirectlyAssignedToMe ? 'bg-[#FF672E]/[0.03]' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-medium text-[#F5F5F2] group-hover:text-[#FF672E] transition-colors">
                          {ho.projectName}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#A0A09D]">
                          {ho.pinnedVersionId}
                        </span>
                        {isDirectlyAssignedToMe ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FF672E]/10 text-[#FF672E] border border-[#FF672E]/30">
                            Assigned to you
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#A0A09D]">
                            To {availableUsers.find(u => u.id === ho.recipientId)?.name}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#A0A09D] line-clamp-1">
                        {ho.note ? `“${ho.note}”` : `Prepared by ${sender?.name || 'team member'}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-medium text-[#FF672E] group-hover:text-[#ff814d] inline-flex items-center gap-1">
                        <span>Review handoff</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Your Projects Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#A0A09D]">
              Active Projects
            </h2>
            <button
              onClick={() => setCurrentView('projects')}
              className="text-xs text-[#A0A09D] hover:text-[#F5F5F2] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all projects</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-[#A0A09D]/60 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="col-span-5">Project</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Version</div>
              <div className="col-span-2 text-right">Updated</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/[0.06]">
              {displayProjects.map((project) => {
                const statusVariant = 
                  project.status === 'Active' ? 'success' :
                  project.status === 'Transitioning' ? 'warning' :
                  project.status === 'Review Needed' ? 'error' : 'neutral';

                return (
                  <div
                    key={project.id}
                    onClick={() => navigateToProject(project.id, 'overview')}
                    className="p-4 sm:px-5 sm:py-4 sm:grid sm:grid-cols-12 gap-4 items-center hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <div className="sm:col-span-5 min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F2] group-hover:text-[#FF672E] transition-colors truncate">
                        {project.name}
                      </p>
                      <p className="text-[11px] text-[#A0A09D] truncate mt-0.5 sm:hidden">
                        {project.team}
                      </p>
                    </div>

                    <div className="sm:col-span-3 mt-2 sm:mt-0">
                      <StatusBadge variant={statusVariant as any}>
                        {project.status}
                      </StatusBadge>
                    </div>

                    <div className="sm:col-span-2 text-xs font-mono text-[#A0A09D] mt-2 sm:mt-0">
                      {project.currentVersionId}
                    </div>

                    <div className="sm:col-span-2 text-xs text-[#A0A09D] sm:text-right mt-1 sm:mt-0 font-mono">
                      {formatDate(project.updatedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#A0A09D]">
              Recent Activity
            </h2>
            <button
              onClick={() => setCurrentView('activity-audit')}
              className="text-xs text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer transition-colors"
            >
              Full audit trail
            </button>
          </div>

          <div className="border border-white/[0.08] rounded-xl bg-[#0D0F10] divide-y divide-white/[0.06] overflow-hidden">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                onClick={() => {
                  if (act.projectId) {
                    navigateToProject(act.projectId, 'overview');
                  } else {
                    setCurrentView('activity-audit');
                  }
                }}
                className="p-3.5 sm:px-5 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  <span className="font-medium text-[#F5F5F2] shrink-0">
                    {act.actorName}
                  </span>
                  <span className="text-[#A0A09D] truncate">
                    {act.description}
                  </span>
                </div>
                <span className="text-[11px] text-[#A0A09D]/70 shrink-0 font-mono">
                  {formatDate(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
