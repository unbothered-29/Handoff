import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Layers, AlertCircle } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, currentUser } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('Core Engineering');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [initialVersion, setInitialVersion] = useState('v1.0.0');
  const [architectureSummary, setArchitectureSummary] = useState('');
  const [quickstartGuide, setQuickstartGuide] = useState('1. npm install\n2. npm run dev\n3. npm test');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    createProject({
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      repositoryUrl: repositoryUrl.trim() || `git@github.internal:engineering/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git`,
      status: 'Active',
      ownerId: currentUser.id,
      team: team.trim(),
      currentVersionId: initialVersion.trim() || 'v1.0.0',
      initialVersion: initialVersion.trim() || 'v1.0.0',
      architectureSummary: architectureSummary.trim() || 'Modular microservice service architecture with standard CI/CD deployment.',
      quickstartGuide: quickstartGuide.trim(),
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'Establish automated integration smoke tests',
          description: 'Configure CI runner pipeline for end-to-end pull request testing.',
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        },
      ],
      decisions: [
        {
          id: 'ADR-001',
          title: 'Standardize on TypeScript and Node.js LTS',
          date: new Date().toISOString().split('T')[0],
          status: 'Accepted',
          context: 'Initial project language and runtime baseline selection.',
          decision: 'Standardize on TypeScript 5+ for static type safety and shared company libraries.',
          consequences: 'Enables seamless code-sharing across services.',
          author: currentUser.name,
        },
      ],
      risks: [],
      files: [
        {
          id: `f-${Date.now()}-1`,
          name: 'README.md',
          path: 'README.md',
          type: 'doc',
          size: '3.4 KB',
          lastModified: new Date().toISOString().split('T')[0],
          description: 'System orientation and quickstart instructions.',
        },
        {
          id: `f-${Date.now()}-2`,
          name: 'package.json',
          path: 'package.json',
          type: 'config',
          size: '1.8 KB',
          lastModified: new Date().toISOString().split('T')[0],
          description: 'Package dependencies and npm task scripts.',
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#102d3e] rounded-2xl border border-[#D3EBF9] dark:border-[#214e67] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D3EBF9]/70 dark:border-[#214e67] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D3EBF9]/70 dark:bg-white/10 text-[#1A435A] dark:text-[#D3EBF9] flex items-center justify-center border border-[#D3EBF9] dark:border-[#4987A4]/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1A435A] dark:text-white">Register New Project Workspace</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Track versions, technical decisions, and handoffs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-[#F0F7FC] dark:hover:bg-[#18394b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Payments Reconciliation Worker"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="What does this system do and why is it critical?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Team / Squad</label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Version Tag</label>
              <input
                type="text"
                value={initialVersion}
                onChange={(e) => setInitialVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Repository URL (optional)</label>
            <input
              type="text"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="git@github.internal:org/repo.git"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Architecture Summary (optional)</label>
            <textarea
              rows={2}
              value={architectureSummary}
              onChange={(e) => setArchitectureSummary(e.target.value)}
              placeholder="Core tech stack, primary dependencies, database engines, etc."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#D3EBF9]/70 dark:border-[#214e67] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Initialize Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
