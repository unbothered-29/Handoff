import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, SourceReference } from '../../types';
import { 
  Bot, 
  Send, 
  FileCode, 
  GitCommit, 
  BookOpen, 
  ExternalLink
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
      text: `Hello ${currentUser.name.split(' ')[0]}. I can answer queries grounded in architecture decision records (ADRs), version snapshots, runbooks, and active handoffs for your team.`,
    },
  ]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const suggestedQuestions = [
    {
      label: 'How to run and test locally?',
      query: 'How do I run and test this project locally?',
    },
    {
      label: 'Current blockers?',
      query: 'What is currently unfinished and blocking deployment?',
    },
    {
      label: 'Why PostgreSQL over DynamoDB?',
      query: 'Why was PostgreSQL chosen over DynamoDB?',
    },
    {
      label: 'Webhook implementation files?',
      query: 'Which files implement Stripe webhook processing and idempotency?',
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

    // Grounded response simulation
    setTimeout(() => {
      let replyText = '';
      let references: SourceReference[] = [];

      const qLower = query.toLowerCase();

      if (qLower.includes('run') || qLower.includes('test') || qLower.includes('start') || qLower.includes('setup')) {
        replyText = `To run ${activeProject.name} locally:\n\n1. Ensure Docker is running (Postgres 16 + Redis 7.2).\n2. Run \`npm install\`\n3. Configure .env following .env.example\n4. Run \`npm run db:migrate\` for Drizzle ORM migrations\n5. Run \`npm run dev\` for HTTP server on port 4000\n6. Run \`npm test\` for integration test suite`;
        references = [
          { type: 'file', id: 'docs/runbooks/billing_recovery.md', label: 'docs/runbooks/billing_recovery.md', projectId: activeProject.id, targetTab: 'files' },
          { type: 'version', id: activeProject.currentVersionId, label: `Tag ${activeProject.currentVersionId}`, projectId: activeProject.id, targetTab: 'history' },
        ];
      } else if (qLower.includes('unfinished') || qLower.includes('block') || qLower.includes('pending') || qLower.includes('todo')) {
        replyText = `Active status for ${activeProject.name}:\n\n• Blocker: Ticket SEC-4912 pending with SecOps for Stripe webhook secret renewal.\n• In Progress: Reconciliation cron for mismatched invoice totals (assigned to Sarah Lin).\n• Pending: Prometheus metrics for BullMQ queue lag.`;
        references = [
          { type: 'task', id: 'task-101', label: 'Task SEC-4912', projectId: activeProject.id, targetTab: 'tasks' },
        ];
      } else if (qLower.includes('postgres') || qLower.includes('dynamodb') || qLower.includes('decision') || qLower.includes('adr')) {
        replyText = `ADR-014 (Recorded 2026-02-14):\n\nPostgreSQL was selected over DynamoDB because multi-line usage billing requires strict ACID transactional rollbacks and SQL window functions. Monthly partitioning eliminates consistency anomalies. Ephemeral 1-minute writes are buffered in Redis before batch flush.`;
        references = [
          { type: 'decision', id: 'ADR-014', label: 'ADR-014 (Database Decision)', projectId: activeProject.id, targetTab: 'overview' },
        ];
      } else {
        replyText = `Based on project documentation for ${activeProject.name}, the current release is ${activeProject.currentVersionId}. Architectural components include BullMQ workers, PostgreSQL partitioned storage, and Stripe webhook idempotency leases.`;
        references = [
          { type: 'version', id: activeProject.currentVersionId, label: `Version ${activeProject.currentVersionId}`, projectId: activeProject.id, targetTab: 'history' },
        ];
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: replyText,
        projectId: activeProjectId,
        references,
      };

      setMessages(prev => [...prev, botMsg]);
    }, 250);
  };

  const handleReferenceClick = (ref: SourceReference) => {
    navigateToProject(ref.projectId, ref.targetTab || 'overview');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-9.5rem)] flex flex-col space-y-4 animate-in fade-in duration-150 text-[#F5F5F2]">
      {/* Header & Context Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F2]">
            Continuity Assistant
          </h1>
          <p className="text-xs text-[#A0A09D] mt-0.5">
            Grounded responses backed by project documentation, ADRs, and commit history.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className="text-[#A0A09D]">Context:</span>
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="px-3 py-1 bg-[#0D0F10] border border-white/[0.08] rounded-lg text-xs font-medium text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 border border-white/[0.08] rounded-2xl bg-[#0D0F10] p-5 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                isUser ? 'bg-[#FF672E] text-white ring-1 ring-white/10' : 'bg-white/[0.06] text-[#A0A09D] border border-white/[0.08]'
              }`}>
                {isUser ? currentUser.initials : <Bot className="w-4 h-4 text-[#FF672E]" />}
              </div>

              <div className="space-y-2 max-w-xl text-xs">
                <div className={`p-4 rounded-2xl leading-relaxed ${
                  isUser
                    ? 'bg-[#FF672E] text-white shadow-md shadow-[#FF672E]/10'
                    : 'bg-[#050606] border border-white/[0.08] text-[#F5F5F2]'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {!isUser && msg.references && msg.references.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.references.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleReferenceClick(ref)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#050606] hover:bg-white/[0.06] text-[#A0A09D] hover:text-[#F5F5F2] border border-white/[0.08] rounded-md text-[11px] font-mono transition-colors cursor-pointer"
                        title="Open in project workspace"
                      >
                        {ref.type === 'file' && <FileCode className="w-3 h-3 text-[#A0A09D]" />}
                        {ref.type === 'version' && <GitCommit className="w-3 h-3 text-[#FF672E]" />}
                        {ref.type === 'decision' && <BookOpen className="w-3 h-3 text-amber-400" />}
                        <span>{ref.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[#A0A09D]/60 ml-0.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Inquiries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-[#A0A09D]/70 shrink-0 font-mono">Prompts:</span>
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq.query)}
            className="px-3 py-1 rounded-full bg-[#0D0F10] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#FF672E]/40 text-[#A0A09D] hover:text-[#F5F5F2] whitespace-nowrap transition-colors cursor-pointer text-xs"
          >
            {sq.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${activeProject.name} runbooks, ADRs, blockers, or version history...`}
          className="w-full pl-4 pr-12 py-3 bg-[#0D0F10] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/60 focus:outline-hidden focus:border-[#FF672E]/50 focus:ring-1 focus:ring-[#FF672E]/50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF672E] hover:bg-[#e6531e] disabled:opacity-30 disabled:hover:bg-[#FF672E] text-white rounded-lg transition-colors cursor-pointer"
          title="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
