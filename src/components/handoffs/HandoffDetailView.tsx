import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { ClarificationModal } from './ClarificationModal';
import { 
  ArrowLeft, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  GitCommit, 
  Download, 
  Check, 
  ExternalLink,
  MessageSquare,
  FileCode
} from 'lucide-react';

export const HandoffDetailView: React.FC = () => {
  const { 
    handoffs, 
    selectedHandoffId, 
    setCurrentView, 
    currentUser, 
    availableUsers, 
    projects, 
    acceptHandoff, 
    navigateToProject,
    showToast
  } = useApp();

  const [isClarificationOpen, setIsClarificationOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptanceNote, setAcceptanceNote] = useState('Reviewed architecture decisions, blockers, and runbook. Accepting primary operational ownership.');
  const [isExporting, setIsExporting] = useState(false);

  const handoff = handoffs.find(h => h.id === selectedHandoffId) || handoffs[0];
  const project = projects.find(p => p.id === handoff.projectId);
  const sender = availableUsers.find(u => u.id === handoff.senderId);
  const recipient = availableUsers.find(u => u.id === handoff.recipientId);

  const isCurrentUserRecipient = currentUser.id === handoff.recipientId;
  const isCurrentUserSender = currentUser.id === handoff.senderId;
  const isPending = handoff.status === 'Pending';
  const isAccepted = handoff.status === 'Accepted';

  const statusVariant = 
    handoff.status === 'Accepted' ? 'success' :
    handoff.status === 'Pending' ? 'warning' :
    handoff.status === 'Completed' ? 'neutral' : 'error';

  const handleExportManifest = () => {
    setIsExporting(true);
    try {
      const manifestData = {
        handoffId: handoff.id,
        project: {
          id: handoff.projectId,
          name: handoff.projectName,
          pinnedVersionId: handoff.pinnedVersionId,
          pinnedVersionHash: handoff.pinnedVersionHash,
        },
        participants: {
          sender: sender?.name,
          recipient: recipient?.name,
        },
        status: handoff.status,
        transferredBriefing: handoff.briefing,
        auditTrail: handoff.auditTrail,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifestData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${handoff.id}-manifest.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('success', 'Exported', `Downloaded package manifest for ${handoff.id}`);
    } catch {
      showToast('error', 'Export Failed', 'Unable to export file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAcceptSubmit = () => {
    acceptHandoff(handoff.id, acceptanceNote);
    setIsAcceptModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Back button and actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('handoffs')}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A0A09D] hover:text-[#F5F5F2] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to handoffs</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportManifest}
            disabled={isExporting}
            className="px-3 py-1.5 bg-[#0D0F10] hover:bg-white/[0.06] text-[#A0A09D] hover:text-[#F5F5F2] border border-white/[0.08] text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download JSON manifest"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          {project && (
            <button
              onClick={() => navigateToProject(project.id, 'overview')}
              className="px-3 py-1.5 bg-[#0D0F10] hover:bg-white/[0.06] text-[#A0A09D] hover:text-[#F5F5F2] border border-white/[0.08] text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Project workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Handoff Header Card */}
      <div className="bg-[#0D0F10] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="space-y-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-[#A0A09D] bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded">
                {handoff.id}
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
                {handoff.projectName}
              </h1>
              <StatusBadge variant={statusVariant as any}>
                {handoff.status}
              </StatusBadge>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A0A09D]">
              <GitCommit className="w-3.5 h-3.5 text-[#FF672E] shrink-0" />
              <span>Pinned version: <strong className="text-[#F5F5F2]">{handoff.pinnedVersionId}</strong> ({handoff.pinnedVersionHash})</span>
            </div>

            {/* Note from Sender */}
            {handoff.note && (
              <p className="text-xs text-[#A0A09D] italic pt-1 border-t border-white/[0.06]">
                &ldquo;{handoff.note}&rdquo;
              </p>
            )}

            {/* Participants */}
            <div className="flex items-center gap-4 text-xs text-[#A0A09D] pt-1 flex-wrap font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[#A0A09D]/60">From:</span>
                {sender && (
                  <span className="font-medium text-[#F5F5F2]">{sender.name} ({sender.role})</span>
                )}
              </div>
              <span>&rarr;</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#A0A09D]/60">To:</span>
                {recipient && (
                  <span className="font-medium text-[#F5F5F2]">{recipient.name} ({recipient.role})</span>
                )}
              </div>
            </div>
          </div>

          {/* Obvious Primary Action for Pending Received Handoff */}
          <div className="shrink-0 self-start sm:self-center">
            {isPending && isCurrentUserRecipient && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsClarificationOpen(true)}
                  className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-[#F5F5F2] rounded-full text-xs font-medium transition-colors cursor-pointer border border-white/[0.08]"
                >
                  Clarification
                </button>
                <button
                  onClick={() => setIsAcceptModalOpen(true)}
                  className="px-5 py-2.5 bg-[#FF672E] hover:bg-[#e6531e] text-white rounded-full text-xs font-medium shadow-md shadow-[#FF672E]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept responsibility</span>
                </button>
              </div>
            )}

            {isPending && isCurrentUserSender && (
              <span className="text-xs text-[#FF672E] bg-[#FF672E]/10 border border-[#FF672E]/30 px-3 py-1.5 rounded-full inline-block font-medium">
                Awaiting sign-off by {recipient?.name}
              </span>
            )}

            {isAccepted && (
              <span className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accepted on {handoff.acceptedAt?.split('T')[0] || 'recently'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Briefing Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Summary & Completed Deliverables */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              Summary &amp; Transferred Progress
            </h2>
            <p className="text-xs text-[#F5F5F2] leading-relaxed">
              {handoff.briefing.executiveSummary}
            </p>

            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-xs font-medium text-[#F5F5F2]">Completed items:</span>
              <ul className="space-y-1.5 text-xs text-[#A0A09D]">
                {handoff.briefing.confirmedProgress.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Blockers & Incidents */}
          {handoff.briefing.activeBlockers.length > 0 && (
            <div className="bg-[#0D0F10] border border-rose-900/40 rounded-xl p-5 sm:p-6 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Blockers &amp; Risks</span>
              </h2>
              <div className="space-y-2">
                {handoff.briefing.activeBlockers.map((b, idx) => (
                  <p key={idx} className="text-xs text-rose-300 font-medium bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                    {b}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Key Decisions (ADRs) */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              Key Decisions (ADRs)
            </h2>
            <div className="space-y-2">
              {handoff.briefing.keyDecisions.map((dec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#050606] border border-white/[0.06] text-xs text-[#F5F5F2] font-mono">
                  {dec}
                </div>
              ))}
            </div>
          </div>

          {/* Key Files & Runbook */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              Runbook &amp; Key Files
            </h2>
            
            <pre className="p-3.5 bg-[#050606] text-[#F5F5F2] rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-white/[0.06]">
              {handoff.briefing.runbookCommands.join('\n')}
            </pre>

            <div className="space-y-1.5 text-xs font-mono text-[#A0A09D] pt-1">
              {handoff.briefing.criticalFiles.map((file, idx) => (
                <div key={idx} className="p-2 bg-[#050606] rounded-lg border border-white/[0.06]">
                  {file}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (1 col): Next steps, clarifications & audit */}
        <div className="space-y-5">
          {/* Next Steps: First 48 Hours */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#FF672E]" />
              <span>Next Steps (First 48h)</span>
            </h3>
            <div className="space-y-2 text-xs text-[#F5F5F2]">
              {handoff.briefing.recommendedFirst48Hours.map((action, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#050606] border border-white/[0.06]">
                  {action}
                </div>
              ))}
            </div>
          </div>

          {/* Clarification Thread */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 flex items-center gap-1.5 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-[#A0A09D]" />
                <span>Clarifications</span>
              </h3>
              <button
                onClick={() => setIsClarificationOpen(true)}
                className="text-xs text-[#FF672E] hover:underline cursor-pointer font-medium"
              >
                + Ask inquiry
              </button>
            </div>

            {!handoff.clarifications || handoff.clarifications.length === 0 ? (
              <p className="text-xs text-[#A0A09D] py-1">
                No inquiries logged yet.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {handoff.clarifications.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-[#050606] border border-white/[0.06] space-y-1">
                    <p className="font-medium text-[#F5F5F2]">Q: {c.question}</p>
                    {c.response && (
                      <p className="text-[#A0A09D] text-[11px] pt-0.5">
                        {c.response}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit History */}
          <div className="bg-[#0D0F10] border border-white/[0.08] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A0A09D]/80 font-mono">
              Audit Trail
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {handoff.auditTrail.map((entry, idx) => (
                <div key={idx} className="pb-2 border-b border-white/[0.06] last:border-b-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#F5F5F2]">{entry.action}</span>
                    <span className="text-[10px] text-[#A0A09D]/70 tabular-nums">
                      {entry.timestamp.split('T')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A0A09D]">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clarification Modal */}
      <ClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        handoffId={handoff.id}
      />

      {/* Responsibility Acceptance Modal */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0D0F10] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-[#F5F5F2]">
              Accept Project Operational Responsibility
            </h3>
            <p className="text-xs text-[#A0A09D] leading-relaxed">
              By confirming, you formally accept primary ownership for <strong>{handoff.projectName}</strong> at pinned version <strong>{handoff.pinnedVersionId}</strong>.
            </p>

            <textarea
              rows={3}
              value={acceptanceNote}
              onChange={(e) => setAcceptanceNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/[0.08] bg-[#050606] text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50"
              placeholder="Add optional confirmation note..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-4 py-2 text-xs text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcceptSubmit}
                className="px-5 py-2 text-xs font-medium text-white bg-[#FF672E] hover:bg-[#e6531e] rounded-full shadow-md shadow-[#FF672E]/20 cursor-pointer"
              >
                Confirm &amp; accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
