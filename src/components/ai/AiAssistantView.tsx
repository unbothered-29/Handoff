import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, SourceReference } from '../../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileCode, 
  GitCommit, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    navigateToProject,
    currentUser 
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState<string>(selectedProjectId || 'proj-1');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      projectId: activeProjectId,
      text: `Hello ${currentUser.name.split(' ')[0]}! I am Continuity's Project Assistant. I answer questions strictly grounded in confirmed project documentation, architecture decision records (ADRs), version snapshots, and handoff briefings.`,
    },
  ]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const suggestedQuestions = [
    {
      label: 'How do I run and test this project?',
      query: 'How do I run and test this project locally?',
    },
    {
      label: 'What is still unfinished and blocking?',
      query: 'What is currently unfinished and blocking deployment?',
    },
    {
      label: 'Why PostgreSQL over DynamoDB?',
      query: 'Why was PostgreSQL chosen over DynamoDB?',
    },
    {
      label: 'Which files handle webhook processing?',
      query: 'Which files implement Stripe webhook processing and idempotency?',
    },
    {
      label: 'What are my recommended first 48 hours?',
      query: 'What should the inheriting engineer work on in the first 48 hours?',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      timestamp: 'Just now',
      text: query,
      projectId: activeProjectId,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Formulate realistic grounded demo response
    setTimeout(() => {
      let replyText = '';
      let references: SourceReference[] = [];
      let insufficientEvidence = false;

      const qLower = query.toLowerCase();

      if (qLower.includes('run') || qLower.includes('test') || qLower.includes('start') || qLower.includes('setup')) {
        replyText = `To run ${activeProject.name} locally:\n\n1. Ensure Docker daemon is active (starts Postgres 16 and Redis 7.2).\n2. Run \`npm install\` to sync package dependencies.\n3. Configure local environment variables following .env.example (secrets are omitted from briefings).\n4. Run \`npm run db:migrate\` for Drizzle ORM migrations.\n5. Run \`npm run dev\` to launch the server on port 4000.\n6. Run \`npm test\` to execute the 247 Jest integration suites.`;
        references = [
          { type: 'file', id: 'docs/runbooks/billing_recovery.md', label: 'docs/runbooks/billing_recovery.md', projectId: activeProject.id, targetTab: 'files' },
          { type: 'version', id: activeProject.currentVersionId, label: `Tag ${activeProject.currentVersionId}`, projectId: activeProject.id, targetTab: 'history' },
        ];
      } else if (qLower.includes('unfinished') || qLower.includes('block') || qLower.includes('pending') || qLower.includes('todo')) {
        const blockers = activeProject.tasks.filter(t => t.isBlocker || t.status === 'Blocked');
        replyText = `Currently, there is 1 critical blocker and 2 in-progress tasks:\n\n• **CRITICAL BLOCKER**: Ticket SEC-4912 is pending with SecOps to renew staging Stripe webhook signing secrets. Contact Jordan Lee in #secops if delayed.\n• **In Progress**: Reconciliation cron for mismatched invoice totals (assigned to Sarah Lin, due Oct 18).\n• **Pending**: Prometheus metrics for BullMQ queue lag and worker pool saturation.`;
        references = [
          { type: 'task', id: 'task-101', label: 'Task SEC-4912 (Stripe Idempotency)', projectId: activeProject.id, targetTab: 'tasks' },
        ];
      } else if (qLower.includes('postgres') || qLower.includes('dynamodb') || qLower.includes('decision') || qLower.includes('adr')) {
        replyText = `According to **ADR-014** recorded on 2026-02-14:\n\nPostgreSQL was selected over DynamoDB because multi-line usage billing reconciliation requires strict ACID transactional rollbacks and complex SQL window functions. While DynamoDB offers high horizontal write scale, PostgreSQL with monthly table partitioning eliminates distributed ledger consistency anomalies. Ephemeral 1-minute writes are buffered in Redis prior to flushing.`;
        references = [
          { type: 'decision', id: 'ADR-014', label: 'ADR-014: PostgreSQL vs DynamoDB', projectId: activeProject.id, targetTab: 'overview' },
          { type: 'file', id: 'src/db/schema/invoices.ts', label: 'src/db/schema/invoices.ts', projectId: activeProject.id, targetTab: 'files' },
        ];
      } else if (qLower.includes('webhook') || qLower.includes('idempot') || qLower.includes('stripe') || qLower.includes('file')) {
        replyText = `Stripe webhook processing and idempotency are implemented across two core files:\n\n1. \`src/services/stripeWebhookHandler.ts\`: Ingests Stripe payment, invoice, and subscription webhooks with cryptographic signature verification.\n2. \`src/middleware/idempotencyLease.ts\`: Acquires an atomic Redis SETNX lease lock (60-second TTL) using \`stripe_event_id\` to guarantee zero duplicate credit issuance during network retry spikes.`;
        references = [
          { type: 'file', id: 'src/services/stripeWebhookHandler.ts', label: 'src/services/stripeWebhookHandler.ts', projectId: activeProject.id, targetTab: 'files' },
          { type: 'file', id: 'src/middleware/idempotencyLease.ts', label: 'src/middleware/idempotencyLease.ts', projectId: activeProject.id, targetTab: 'files' },
          { type: 'version', id: 'v2.4.0-rc3', label: 'Commit c8f912a', projectId: activeProject.id, targetTab: 'history' },
        ];
      } else if (qLower.includes('48 hours') || qLower.includes('first') || qLower.includes('next steps') || qLower.includes('prioritize')) {
        replyText = `Recommended priority actions for the inheriting engineer in the first 48 hours:\n\n1. Pull git snapshot tag \`${activeProject.currentVersionId}\` locally and verify the test suite passes.\n2. Ping Jordan Lee in #secops to expedite Ticket SEC-4912 for the staging sandbox webhook secret.\n3. Inspect \`src/services/stripeWebhookHandler.ts\` lines 45–88 to understand the Redis lease lock logic.\n4. Schedule a 20-minute transition sync with Alex Chen (SRE) regarding the Prometheus metrics rollout.`;
        references = [
          { type: 'version', id: activeProject.currentVersionId, label: `Pinned Snapshot ${activeProject.currentVersionId}`, projectId: activeProject.id, targetTab: 'history' },
        ];
      } else {
        replyText = `The available project evidence in the current repository workspace is insufficient to confidently answer this question.\n\nContinuity strictly enforces grounding in verified repository files, commit history, and recorded Architecture Decision Records (ADRs) to prevent hallucinated handoff knowledge. Please inspect the workspace files or ask a question regarding architecture, setup, blockers, or decisions.`;
        insufficientEvidence = true;
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: replyText,
        projectId: activeProjectId,
        references,
        insufficientEvidence,
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleReferenceClick = (ref: SourceReference) => {
    navigateToProject(ref.projectId, ref.targetTab || 'overview');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Project Assistant</h1>
              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Grounded Knowledge Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Answers strictly backed by verified code, ADRs, runbooks, and commit history.
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Context:</span>
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grounding Transparency Notice */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Anti-Hallucination Guarantee:</strong> Responses cite exact source files or decision tags. If evidence is lacking, the assistant declines rather than inventing facts.
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:inline">Demo RAG Sandbox</span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isUser ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {isUser ? (
                  <span className="text-xs font-bold">{currentUser.initials}</span>
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-2xl">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : msg.insufficientEvidence
                    ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 rounded-tl-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Grounded Source References Chips */}
                {!isUser && msg.references && msg.references.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Grounded Source References:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.references.map((ref, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReferenceClick(ref)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 rounded-md text-[11px] font-mono transition-colors shadow-2xs"
                          title="Open referenced artifact in workspace"
                        >
                          {ref.type === 'file' && <FileCode className="w-3 h-3 text-slate-500 dark:text-slate-400" />}
                          {ref.type === 'version' && <GitCommit className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                          {ref.type === 'decision' && <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                          <span>{ref.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500 ml-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Questions Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">Suggested inquiries for {activeProject.name}:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq.query)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium whitespace-nowrap shadow-2xs transition-colors shrink-0"
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask anything about ${activeProject.name} (setup, decisions, blockers, files)...`}
          className="flex-1 px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
};
