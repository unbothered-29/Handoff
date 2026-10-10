import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Bell, 
  User, 
  RotateCcw, 
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    showToast, 
    theme, 
    toggleTheme,
    logout
  } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [strictVersionCheck, setStrictVersionCheck] = useState(true);
  const [requireSignOffNote, setRequireSignOffNote] = useState(false);
  const [secretScrubbing, setSecretScrubbing] = useState(true);

  const handleSavePreferences = () => {
    showToast('success', 'Preferences Updated', 'Configuration saved to local browser workspace state.');
  };

  const handleResetDemo = () => {
    try {
      localStorage.removeItem('continuity_projects');
      localStorage.removeItem('continuity_handoffs');
      localStorage.removeItem('continuity_activities');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Settings & Governance
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure project transfer protocols, notification thresholds, theme appearance, and security policies.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize your interface viewing preference.</p>
        </div>

        {/* Theme mode toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Theme Mode</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Active mode is <strong className="capitalize text-slate-800 dark:text-slate-200">{theme}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Active Engineer Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium">{currentUser.role} · {currentUser.department}</p>
              <p className="text-slate-400 dark:text-slate-500 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
          To switch personas to another team member (e.g. Jessica Chauhan ↔ Sarah Lin ↔ Marcus Vance), use the top-bar <strong>Perspective switcher</strong> or sign out to return to the login screen.
        </div>
      </div>

      {/* Continuity Protocol Policies */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Knowledge Continuity Governance Rules</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Rule 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Enforce Immutable Version Pinning</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Prevent handoff creation against untagged dirty work trees; require short commit hash.
              </p>
            </div>
            <input
              type="checkbox"
              checked={strictVersionCheck}
              onChange={(e) => setStrictVersionCheck(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Rule 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Automated Secret & Credential Sanitizer</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Always scrub .env files, private keys, and API tokens from compiled briefings and AI indexing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={secretScrubbing}
              onChange={(e) => setSecretScrubbing(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Rule 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Require Digital Sign-Off Note on Acceptance</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Mandate that the inheriting engineer leaves a verification note before claiming ownership.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireSignOffNote}
              onChange={(e) => setRequireSignOffNote(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Notification Dispatch Channels</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Email Alerts on Incoming Handoffs</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Notify recipient immediately when assigned a project package.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Slack Incident & Transfer Webhooks</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Post completed acceptance events to the #eng-transitions channel.</p>
            </div>
            <input
              type="checkbox"
              checked={slackAlerts}
              onChange={(e) => setSlackAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          Save Governance Preferences
        </button>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Reset Prototype Seed Data</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clear browser changes and restore default mock projects, handoffs, and activity history.
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo State</span>
        </button>
      </div>
    </div>
  );
};
