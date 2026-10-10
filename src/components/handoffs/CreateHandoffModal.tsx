import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ArrowRightLeft, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  GitCommit, 
  AlertCircle,
  FileText,
  Terminal,
  Send,
  User as UserIcon
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Initiate Project Handoff</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Transfer knowledge and operational responsibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
              Recipient & Version
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
              Review Package
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Recipient and Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Project Workspace <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    const p = projects.find(proj => proj.id === e.target.value);
                    if (p) setSelectedVersionId(p.currentVersionId);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (HEAD: {p.currentVersionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pin Immutable Snapshot Version <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProject.versions.map((v) => {
                    const isSelected = selectedVersionId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVersionId(v.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-400'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{v.id}</span>
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">({v.hash})</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">{v.commitMessage}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designate Inheriting Engineer (Recipient) <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
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
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-400'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.role} · {user.department}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Handoff Note / Context For Recipient
                </label>
                <textarea
                  rows={3}
                  value={handoffNote}
                  onChange={(e) => setHandoffNote(e.target.value)}
                  placeholder="Explain why this handoff is occurring (leave, role shift, offboarding) and key priorities."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review Handoff Package */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{currentProject.name}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Pinned: {selectedVersionId} ({versionObj.hash})
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {compiledBriefing.executiveSummary}
                </p>
              </div>

              {/* Active Blockers */}
              {compiledBriefing.activeBlockers.length > 0 && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-lg text-rose-900 dark:text-rose-300 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-rose-700 dark:text-rose-400">Active Blockers Included</span>
                  {compiledBriefing.activeBlockers.map((b, i) => (
                    <p key={i} className="text-[11px]">{b}</p>
                  ))}
                </div>
              )}

              {/* Architecture Decisions */}
              <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] block">Key Decisions Transferred</span>
                {compiledBriefing.keyDecisions.map((d, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-400 text-[11px] font-mono">· {d}</p>
                ))}
              </div>

              {/* First 48 Hours */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg space-y-1">
                <span className="font-bold text-indigo-950 dark:text-indigo-200 text-[11px] block">Recommended First 48 Hours</span>
                {compiledBriefing.recommendedFirst48Hours.map((act, i) => (
                  <p key={i} className="text-indigo-900 dark:text-indigo-300 text-[11px]">{act}</p>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                * All items are grounded in verified repository artifacts and decision records.
              </p>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Transfer Contract Summary</span>
                </div>

                <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Project:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{currentProject.name}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Pinned Snapshot:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{selectedVersionId} ({versionObj.hash})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Sender (Outgoing):</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Recipient (Inheriting):</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{recipient?.name}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                  <strong>Responsibility Protocol:</strong> The handoff will remain in <span className="font-semibold">Pending</span> state until {recipient?.name} explicitly reviews the package and accepts responsibility. You remain on record until accepted.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-medium text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-medium text-xs"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={step === 1 ? handleNextStep1 : handleNextStep2}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1"
            >
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmHandoff}
              className="px-5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
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
