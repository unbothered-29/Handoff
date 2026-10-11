import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { 
  GitCommit, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sun, 
  Moon, 
  Check, 
  UserPlus, 
  Users
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    login, 
    signup, 
    availableUsers, 
    theme, 
    toggleTheme, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedUser, setSelectedUser] = useState<User>(availableUsers[0]);
  const [email, setEmail] = useState(availableUsers[0]?.email || 'chauhanjessicaa27@gmail.com');
  const [password, setPassword] = useState('demo-enterprise-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<string>('Engineering Lead');
  const [signupDepartment, setSignupDepartment] = useState('Core Architecture');
  const [signupPassword, setSignupPassword] = useState('');

  const handleSelectEmployee = (user: User) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('demo-enterprise-2026');
    setError(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const matched = availableUsers.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      const success = login(matched || email, password, rememberMe);
      setIsLoading(false);
      if (!success) {
        setError('Unable to authenticate. Please check your credentials.');
      }
    }, 300);
  };

  const handleQuickLoginAs = (user: User) => {
    setError(null);
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('demo-enterprise-2026');
    setIsLoading(true);
    setTimeout(() => {
      login(user, 'demo-enterprise-2026', rememberMe);
      setIsLoading(false);
    }, 200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !signupEmail.trim()) {
      setError('Please provide both your name and work email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signup(fullName.trim(), signupEmail.trim(), signupRole, signupDepartment);
      setIsLoading(false);
    }, 350);
  };

  const handleForgotPassword = () => {
    showToast(
      'info',
      'Password Reset Sent',
      `A secure reset link has been dispatched to ${email || 'your email'}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#050606] text-[#F5F5F2] flex flex-col justify-between transition-colors duration-200">
      {/* Top Bar / Brand Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.08] bg-[#050606]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#FF672E] text-white flex items-center justify-center font-bold shadow-sm shadow-[#FF672E]/30">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold tracking-wider text-xs uppercase text-[#F5F5F2] font-mono">
              CONTINUITY
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] text-[#A0A09D] border-l border-white/[0.1] pl-2 font-mono">
              Engineering Handoff Protocol
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#A0A09D] hover:text-[#F5F5F2] hover:bg-white/[0.06] transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#0D0F10] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F2]">
                {mode === 'signin' ? 'Sign in to Continuity' : 'Create an employee account'}
              </h1>
              <p className="text-xs text-[#A0A09D] mt-1.5">
                {mode === 'signin'
                  ? 'Select an employee profile or sign in with corporate credentials.'
                  : 'Join your team workspace and maintain verified project continuity.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#050606] border border-white/[0.08] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white/[0.1] text-[#F5F5F2] shadow-xs'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2]'
                }`}
              >
                Sign In &amp; Employee Directory
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white/[0.1] text-[#F5F5F2] shadow-xs'
                    : 'text-[#A0A09D] hover:text-[#F5F5F2]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Sign In Mode */}
            {mode === 'signin' ? (
              <div className="space-y-5">
                {/* 1. Fast Employee Persona Selection */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#F5F5F2] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF672E]" />
                      <span>Select Employee to Sign In</span>
                    </label>
                    <span className="text-[11px] text-[#A0A09D] font-mono">
                      {availableUsers.length} teammates
                    </span>
                  </div>

                  {/* Dropdown selector */}
                  <select
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const user = availableUsers.find(u => u.id === e.target.value);
                      if (user) handleSelectEmployee(user);
                    }}
                    className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50 transition-all cursor-pointer"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role} ({u.department})
                      </option>
                    ))}
                  </select>

                  {/* Visual Employee Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto no-scrollbar">
                    {availableUsers.map((u) => {
                      const isChosen = selectedUser?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleSelectEmployee(u)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                            isChosen
                              ? 'border-[#FF672E]/50 bg-[#FF672E]/10 ring-1 ring-[#FF672E]'
                              : 'border-white/[0.08] hover:border-white/[0.15] bg-[#050606] hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                              referrerPolicy="no-referrer"
                            />
                            {isChosen && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF672E] text-white rounded-full flex items-center justify-center ring-1 ring-[#0D0F10]">
                                <Check className="w-2 h-2" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#F5F5F2] truncate">
                              {u.name.split(' ')[0]}
                            </p>
                            <p className="text-[10px] text-[#A0A09D] truncate font-mono">
                              {u.role.split(' ')[0]}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* One-click Fast Log In Button for the selected employee */}
                  {selectedUser && (
                    <button
                      type="button"
                      onClick={() => handleQuickLoginAs(selectedUser)}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium rounded-full transition-all shadow-md shadow-[#FF672E]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign in as {selectedUser.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-mono">
                    <span className="bg-[#0D0F10] px-3 text-[#A0A09D]/70">
                      Or authenticate credentials
                    </span>
                  </div>
                </div>

                {/* Manual Email / Password Form */}
                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F2] mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          const matched = availableUsers.find(
                            u => u.email.toLowerCase() === e.target.value.toLowerCase()
                          );
                          if (matched) setSelectedUser(matched);
                        }}
                        placeholder="engineer@company.internal"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#F5F5F2]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full pl-9 pr-10 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A09D] hover:text-[#F5F5F2] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A0A09D] select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-white/20 text-[#FF672E] focus:ring-[#FF672E]"
                      />
                      <span>Remember this session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-white/[0.08] hover:bg-white/[0.15] text-[#F5F5F2] text-xs font-semibold rounded-full transition-all border border-white/[0.08] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Authenticate credentials</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F5F2] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jessica Chauhan"
                    required
                    className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F2] mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="chauhanjessicaa27@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F2] mb-1.5">
                      Role
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] focus:outline-hidden focus:border-[#FF672E]/50 transition-all cursor-pointer"
                    >
                      <option value="Engineering Lead">Engineering Lead</option>
                      <option value="Senior Staff Engineer">Senior Staff Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="DevOps / SRE">DevOps / SRE</option>
                      <option value="Product Manager">Product Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F5F2] mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={signupDepartment}
                      onChange={(e) => setSignupDepartment(e.target.value)}
                      placeholder="Core Platform"
                      className="w-full px-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F5F2] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A0A09D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#050606] border border-white/[0.08] rounded-xl text-xs text-[#F5F5F2] placeholder-[#A0A09D]/50 focus:outline-hidden focus:border-[#FF672E]/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#FF672E] hover:bg-[#e6531e] text-white text-xs font-medium rounded-full transition-all shadow-md shadow-[#FF672E]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Workspace Account</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center text-[11px] text-[#A0A09D]/60 font-mono border-t border-white/[0.06]">
        CONTINUITY &middot; VERIFIED ENGINEERING HANDOFF &amp; KNOWLEDGE PLATFORM
      </footer>
    </div>
  );
};
