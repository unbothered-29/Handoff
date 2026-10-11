import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ArrowRightLeft, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle,
  Send
} from 'lucide-react';
import { HandoffBriefing } from '../../types';

interface CreateHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateHandoffModal: React.FC<CreateHandoffModalProps> = ({ isOpen, onClose }) => {
  const { 
    projects, 
    availableUsers, 
    currentUser, 
    createHandoff, 
    createHandoffPreselectedProjectId,
    navigateToHandoff
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('usr-2'); // Marcus Vance default
  const [selectedVersionId, setSelectedVersionId] = useState<string>('v2.4.0-rc3');
  const [handoffNote, setHandoffNote] = useState<string>(
    'Transferring primary system ownership before planned leave. Please review active blockers and the Stripe idempotency lease logic.'
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (createHandoffPreselectedProjectId) {
      setSelectedProjectId(createHandoffPreselectedProjectId);
      const proj = projects.find(p => p.id === createHandoffPreselectedProjectId);
      if (proj && proj.currentVersionId) {
        setSelectedVersionId(proj.currentVersionId);
      }
    }
  }, [createHandoffPreselectedProjectId, projects]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const recipient = availableUsers.find(u => u.id === selectedRecipientId);
  const versionObj = currentProject.versions.find(v => v.id === selectedVersionId) || currentProject.versions[0];

  // Auto-compile structured handoff package based on project state
  const compiledBriefing: HandoffBriefing = {
    executiveSummary: `${currentProject.name} is currently in ${currentProject.status} status. Immediate goal is maintaining service stability and resolving open items.`,
    confirmedProgress: [
      `Latest snapshot ${versionObj.id} (${versionObj.hash}) committed by ${versionObj.author.name}`,
      `${currentProject.versions.length} immutable version milestones recorded`,
      `Validated against system quickstart guide`,
    ],
    completedDeliverables: currentProject.tasks.filter(t => t.status === 'Completed').map(t => t.title),
    pendingTasks: currentProject.tasks.filter(t => t.status !== 'Completed').map(t => `${t.title} (${t.priority} priority)`),
    activeBlockers: currentProject.tasks.filter(t => t.isBlocker).map(t => `${t.title}: ${t.blockerReason || 'Requires unblocking'}`),
    keyDecisions: currentProject.decisions.map(d => `${d.id}: ${d.title}`),
    knownRisks: currentProject.risks.map(r => `${r.title} — Mitigation: ${r.mitigation}`),
    criticalFiles: currentProject.files.map(f => `${f.path} (${f.description})`),
    runbookCommands: currentProject.quickstartGuide.split('\n').filter(Boolean),
    recommendedFirst48Hours: [
      `1. Pull git snapshot tag ${versionObj.id} (${versionObj.hash}) locally.`,
      `2. Verify local build and test pass using the runbook commands.`,
      `3. Review all ${currentProject.decisions.length} recorded architecture decisions to understand previous tradeoffs.`,
      `4. Check in on any active blockers with the squads listed in the briefing.`,
    ],
    isAiSuggested: false,
  };

  const handleNextStep1 = () => {
    if (!selectedRecipientId) {
      setError('Please select a recipient');
      return;
    }
    if (selectedRecipientId === currentUser.id) {
      setError('You cannot hand off a project to yourself');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleConfirmHandoff = () => {
    const newHandoffId = createHandoff({
      projectId: selectedProjectId,
      recipientId: selectedRecipientId,
      pinnedVersionId: selectedVersionId,
      note: handoffNote.trim(),
      briefing: compiledBriefing,
    });

    onClose();
    // Reset form
    setStep(1);
    navigateToHandoff(newHandoffId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 text-[#F5F5F2]">
      <div className="bg-[#0D0F10] rounded-2xl border border-white/[0.1] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF672E]/15 text-[#FF672E] border border-[#FF672E]/30 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#F5F5F2]">Initiate Project Handoff</h2>
              <p className="text-[11px] text-[#A0A09D]">Transfer operational context and code responsibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-[#050606] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 1 ? 'bg-[#FF672E] text-white' : 'bg-white/[0.06] text-[#A0A09D]'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'font-bold text-[#F5F5F2]' : 'text-[#A0A09D]'}>
              Recipient &amp; Version
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 2 ? 'bg-[#FF672E] text-white' : 'bg-white/[0.06] text-[#A0A09D]'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'font-bold text-[#F5F5F2]' : 'text-[#A0A09D]'}>
              Review Package
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 3 ? 'bg-[#FF672E] text-white' : 'bg-white/[0.06] text-[#A0A09D]'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'font-bold text-[#F5F5F2]' : 'text-[#A0A09D]'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Recipient and Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">
                  Select Project Workspace <span className="text-[#FF672E]">*</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    const p = projects.find(proj => proj.id === e.target.value);
                    if (p) setSelectedVersionId(p.currentVersionId);
                  }}
                  className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] font-medium focus:outline-hidden focus:border-[#FF672E]/50"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (HEAD: {p.currentVersionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">
                  Pin Immutable Snapshot Version <span className="text-[#FF672E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProject.versions.map((v) => {
                    const isSelected = selectedVersionId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVersionId(v.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#FF672E]/10 border-[#FF672E]/50 ring-1 ring-[#FF672E]'
                            : 'bg-[#050606] border-white/[0.08] hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#F5F5F2]">{v.id}</span>
                          <span className="font-mono text-[10px] text-[#A0A09D]">({v.hash})</span>
                        </div>
                        <p className="text-[11px] text-[#A0A09D] line-clamp-1 mt-1 font-mono">{v.commitMessage}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">
                  Designate Inheriting Engineer (Recipient) <span className="text-[#FF672E]">*</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {availableUsers
                    .filter(u => u.id !== currentUser.id)
                    .map((user) => {
                      const isSelected = selectedRecipientId === user.id;
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedRecipientId(user.id);
                            if (error) setError('');
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FF672E]/10 border-[#FF672E]/50 ring-1 ring-[#FF672E]'
                              : 'bg-[#050606] border-white/[0.08] hover:border-white/[0.15]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-medium text-[#F5F5F2]">{user.name}</p>
                              <p className="text-[11px] text-[#A0A09D]">{user.role} &middot; {user.department}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#FF672E]" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#F5F5F2] mb-1.5">
                  Handoff Note / Context For Recipient
                </label>
                <textarea
                  rows={3}
                  value={handoffNote}
                  onChange={(e) => setHandoffNote(e.target.value)}
                  placeholder="Explain why this handoff is occurring and key priorities."
                  className="w-full p-3 bg-[#050606] border border-white/[0.08] rounded-xl text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 resize-none text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review Handoff Package */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#050606] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F5F5F2]">{currentProject.name}</span>
                  <span className="font-mono text-[#FF672E] bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
                    Pinned: {selectedVersionId} ({versionObj.hash})
                  </span>
                </div>
                <p className="text-[#A0A09D] leading-relaxed text-[11px]">
                  {compiledBriefing.executiveSummary}
                </p>
              </div>

              {/* Active Blockers */}
              {compiledBriefing.activeBlockers.length > 0 && (
                <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-rose-400 font-mono">Active Blockers Included</span>
                  {compiledBriefing.activeBlockers.map((b, i) => (
                    <p key={i} className="text-[11px]">{b}</p>
                  ))}
                </div>
              )}

              {/* Architecture Decisions */}
              <div className="p-3.5 bg-[#050606] border border-white/[0.08] rounded-xl space-y-1.5">
                <span className="font-semibold text-[#F5F5F2] text-[11px] block font-mono">Key Decisions Transferred</span>
                {compiledBriefing.keyDecisions.map((d, i) => (
                  <p key={i} className="text-[#A0A09D] text-[11px] font-mono">&middot; {d}</p>
                ))}
              </div>

              {/* First 48 Hours */}
              <div className="p-3.5 bg-[#050606] border border-white/[0.08] rounded-xl space-y-1.5">
                <span className="font-semibold text-[#FF672E] text-[11px] block font-mono">Recommended First 48 Hours</span>
                {compiledBriefing.recommendedFirst48Hours.map((act, i) => (
                  <p key={i} className="text-[#A0A09D] text-[11px]">{act}</p>
                ))}
              </div>

              <p className="text-[11px] text-[#A0A09D]/60 italic font-mono">
                * All items are grounded in verified repository artifacts and decision records.
              </p>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-5 bg-[#050606] border border-white/[0.08] rounded-xl space-y-3 font-mono">
                <div className="flex items-center gap-2 text-[#FF672E] font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Transfer Contract Summary</span>
                </div>

                <div className="space-y-2 text-[#A0A09D] text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-[#A0A09D]/60">Project:</span>
                    <strong className="text-[#F5F5F2] font-sans">{currentProject.name}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-[#A0A09D]/60">Pinned Snapshot:</span>
                    <span className="text-[#F5F5F2]">{selectedVersionId} ({versionObj.hash})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-[#A0A09D]/60">Sender (Outgoing):</span>
                    <span className="text-[#F5F5F2] font-sans">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-[#A0A09D]/60">Recipient (Inheriting):</span>
                    <span className="text-[#F5F5F2] font-sans">{recipient?.name}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FF672E]/10 border border-[#FF672E]/30 rounded-lg text-[#FF672E] text-[11px] leading-relaxed font-sans">
                  <strong>Responsibility Protocol:</strong> The handoff will remain in <span className="font-semibold">Pending</span> state until {recipient?.name} explicitly reviews the package and accepts responsibility. You remain on record until accepted.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between bg-[#050606]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-full border border-white/[0.08] text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04] font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-white/[0.08] text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.04] font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={step === 1 ? handleNextStep1 : handleNextStep2}
              className="px-5 py-2 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white font-medium text-xs shadow-md shadow-[#FF672E]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmHandoff}
              className="px-6 py-2.5 rounded-full bg-[#FF672E] hover:bg-[#e6531e] text-white font-medium text-xs shadow-md shadow-[#FF672E]/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Handoff Package</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
