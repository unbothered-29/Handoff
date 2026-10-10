import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Project, 
  Handoff, 
  ActivityItem, 
  AppView, 
  HandoffBriefing,
  Task,
  TaskStatus 
} from '../types';
import { mockUsers, mockProjects, mockHandoffs, mockActivities } from '../data/mockData';

interface ToastState {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProjectTab: 'overview' | 'history' | 'tasks' | 'files';
  setSelectedProjectTab: (tab: 'overview' | 'history' | 'tasks' | 'files') => void;
  handoffs: Handoff[];
  selectedHandoffId: string | null;
  setSelectedHandoffId: (id: string | null) => void;
  activities: ActivityItem[];
  
  // Modals & Flows
  isCreateHandoffOpen: boolean;
  setIsCreateHandoffOpen: (open: boolean) => void;
  createHandoffPreselectedProjectId: string | null;
  setCreateHandoffPreselectedProjectId: (id: string | null) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;

  // Actions
  navigateToProject: (projectId: string, tab?: 'overview' | 'history' | 'tasks' | 'files') => void;
  navigateToHandoff: (handoffId: string) => void;
  openCreateHandoff: (projectId?: string) => void;
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'handoffCount' | 'versions'> & { initialVersion: string }) => void;
  createHandoff: (payload: {
    projectId: string;
    recipientId: string;
    pinnedVersionId: string;
    note: string;
    briefing: HandoffBriefing;
  }) => string;
  acceptHandoff: (handoffId: string, acceptanceNote?: string) => void;
  addClarification: (handoffId: string, question: string) => void;
  
  // Feedback
  toast: ToastState | null;
  showToast: (type: ToastState['type'], title: string, message: string) => void;
  hideToast: () => void;

  // Task & Project Work Items
  updateTaskStatus: (projectId: string, taskId: string, newStatus: TaskStatus) => void;
  addTaskToProject: (projectId: string, task: Omit<Task, 'id'>) => void;

  // Theme (Dark / Light)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (emailOrUser: string | User, password?: string, rememberMe?: boolean) => boolean;
  logout: () => void;
  signup: (name: string, email: string, role?: string, department?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('continuity_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('continuity_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Available users list state
  const [availableUsers, setAvailableUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('continuity_custom_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        return [...parsed, ...mockUsers.filter(mu => !parsed.some(p => p.id === mu.id || p.email === mu.email))];
      }
    } catch {
      // Fallback
    }
    return mockUsers;
  });

  // Authentication session state: defaults to false so Login Page shows first
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const sessionAuth = sessionStorage.getItem('continuity_is_authenticated');
      if (sessionAuth === 'true') return true;
      const localAuth = localStorage.getItem('continuity_is_authenticated');
      if (localAuth === 'true') return true;
    } catch {
      // Fallback
    }
    return false;
  });

  // Safe local storage load or initial user
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const savedId = localStorage.getItem('continuity_user_id');
      if (savedId) {
        const matched = mockUsers.find(u => u.id === savedId);
        if (matched) return matched;
      }
    } catch {
      // Fallback
    }
    return mockUsers[0]; // Jessica Chauhan by default
  });

  const [currentView, setCurrentView] = useState<AppView>('overview');
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('continuity_projects');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return mockProjects;
  });

  const [handoffs, setHandoffs] = useState<Handoff[]>(() => {
    try {
      const saved = localStorage.getItem('continuity_handoffs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return mockHandoffs;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('continuity_activities');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return mockActivities;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-1');
  const [selectedProjectTab, setSelectedProjectTab] = useState<'overview' | 'history' | 'tasks' | 'files'>('overview');
  const [selectedHandoffId, setSelectedHandoffId] = useState<string | null>('HO-2026-089');

  const [isCreateHandoffOpen, setIsCreateHandoffOpen] = useState(false);
  const [createHandoffPreselectedProjectId, setCreateHandoffPreselectedProjectId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync to safe local storage
  useEffect(() => {
    try {
      localStorage.setItem('continuity_projects', JSON.stringify(projects));
      localStorage.setItem('continuity_handoffs', JSON.stringify(handoffs));
      localStorage.setItem('continuity_activities', JSON.stringify(activities));
    } catch {
      // Ignore in strict privacy sandboxes
    }
  }, [projects, handoffs, activities]);

  const showToast = (type: ToastState['type'], title: string, message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      title,
      message,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem('continuity_user_id', user.id);
    } catch {
      // ignore
    }
    showToast('info', 'Switched Persona', `Now interacting as ${user.name} (${user.role})`);
  };

  const login = (emailOrUser: string | User, _password?: string, rememberMe: boolean = false): boolean => {
    let userToLogin: User | undefined;
    if (typeof emailOrUser === 'string') {
      const trimmed = emailOrUser.trim().toLowerCase();
      userToLogin = availableUsers.find(
        u => u.email.toLowerCase() === trimmed || u.name.toLowerCase() === trimmed
      );
      if (!userToLogin) {
        const generatedName =
          trimmed.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
          'Engineer';
        userToLogin = {
          id: `usr-${Date.now()}`,
          name: generatedName,
          email: emailOrUser.trim(),
          role: 'Engineering Lead',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          initials: generatedName.slice(0, 2).toUpperCase(),
          department: 'Engineering Team',
        };
        setAvailableUsers(prev => [userToLogin!, ...prev]);
      }
    } else {
      userToLogin = emailOrUser;
    }

    setCurrentUserState(userToLogin);
    setIsAuthenticated(true);

    try {
      if (rememberMe) {
        localStorage.setItem('continuity_is_authenticated', 'true');
        localStorage.setItem('continuity_user_id', userToLogin.id);
      } else {
        sessionStorage.setItem('continuity_is_authenticated', 'true');
        localStorage.removeItem('continuity_is_authenticated');
      }
    } catch {
      // ignore
    }

    showToast('success', 'Authenticated', `Welcome back, ${userToLogin.name}!`);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('continuity_is_authenticated');
      localStorage.removeItem('continuity_user_id');
      sessionStorage.removeItem('continuity_is_authenticated');
    } catch {
      // ignore
    }
    showToast('info', 'Signed Out', 'You have been signed out of Continuity.');
  };

  const signup = (name: string, email: string, role?: string, department?: string): boolean => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EN';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: (role as any) || 'Engineering Lead',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials,
      department: department || 'Engineering Team',
    };

    setAvailableUsers(prev => [newUser, ...prev]);
    setCurrentUserState(newUser);
    setIsAuthenticated(true);

    try {
      localStorage.setItem('continuity_is_authenticated', 'true');
      localStorage.setItem('continuity_user_id', newUser.id);
      const customUsers = JSON.parse(localStorage.getItem('continuity_custom_users') || '[]');
      customUsers.unshift(newUser);
      localStorage.setItem('continuity_custom_users', JSON.stringify(customUsers));
    } catch {
      // ignore
    }

    showToast('success', 'Account Created', `Welcome to Continuity, ${name}!`);
    return true;
  };

  const navigateToProject = (projectId: string, tab: 'overview' | 'history' | 'tasks' | 'files' = 'overview') => {
    setSelectedProjectId(projectId);
    setSelectedProjectTab(tab);
    setCurrentView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHandoff = (handoffId: string) => {
    setSelectedHandoffId(handoffId);
    setCurrentView('handoff-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCreateHandoff = (projectId?: string) => {
    setCreateHandoffPreselectedProjectId(projectId || selectedProjectId || 'proj-1');
    setIsCreateHandoffOpen(true);
  };

  const createProject = (newProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'handoffCount' | 'versions'> & { initialVersion: string }) => {
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();
    
    const initialVer = {
      id: newProjectData.initialVersion || 'v1.0.0',
      hash: Math.random().toString(16).substring(2, 9),
      timestamp: nowIso,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      commitMessage: 'Initial project baseline import and continuity workspace setup',
      changedFilesCount: 8,
      changedFiles: [
        { path: 'package.json', status: 'added' as const, insertions: 45, deletions: 0 },
        { path: 'src/index.ts', status: 'added' as const, insertions: 120, deletions: 0 },
        { path: 'README.md', status: 'added' as const, insertions: 32, deletions: 0 },
      ],
    };

    const newProject: Project = {
      ...newProjectData,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      handoffCount: 0,
      versions: [initialVer],
      currentVersionId: initialVer.id,
    };

    setProjects(prev => [newProject, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: nowIso,
      actorId: currentUser.id,
      actorName: currentUser.name,
      type: 'version_committed',
      projectId: newId,
      projectName: newProject.name,
      description: `Created project workspace and initialized version ${initialVer.id}.`,
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast('success', 'Project Created', `Workspace for "${newProject.name}" successfully created.`);
    navigateToProject(newId, 'overview');
  };

  const createHandoff = ({
    projectId,
    recipientId,
    pinnedVersionId,
    note,
    briefing,
  }: {
    projectId: string;
    recipientId: string;
    pinnedVersionId: string;
    note: string;
    briefing: HandoffBriefing;
  }): string => {
    const targetProject = projects.find(p => p.id === projectId);
    const projectName = targetProject ? targetProject.name : 'Project';
    const recipient = mockUsers.find(u => u.id === recipientId);
    const targetVersion = targetProject?.versions.find(v => v.id === pinnedVersionId);
    const versionHash = targetVersion?.hash || 'a1b2c3d';
    
    const handoffId = `HO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const newHandoff: Handoff = {
      id: handoffId,
      projectId,
      projectName,
      senderId: currentUser.id,
      recipientId,
      pinnedVersionId,
      pinnedVersionHash: versionHash,
      status: 'Pending',
      note,
      createdAt: nowIso,
      targetCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      briefing,
      auditTrail: [
        {
          timestamp: nowIso,
          actorId: currentUser.id,
          action: 'Handoff Initiated',
          detail: `${currentUser.name} initiated handoff to ${recipient?.name || 'team member'} pinned to version ${pinnedVersionId} (${versionHash}).`,
        },
      ],
    };

    setHandoffs(prev => [newHandoff, ...prev]);

    // Update project handoff count and status
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'Transitioning',
          handoffCount: p.handoffCount + 1,
          updatedAt: nowIso,
        };
      }
      return p;
    }));

    // Record activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: nowIso,
      actorId: currentUser.id,
      actorName: currentUser.name,
      type: 'handoff_initiated',
      projectId,
      projectName,
      description: `Initiated handoff ${handoffId} to ${recipient?.name || 'team member'} pinned to ${pinnedVersionId}.`,
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast('success', 'Handoff Sent', `Structured briefing dispatched to ${recipient?.name || 'recipient'}.`);
    return handoffId;
  };

  const acceptHandoff = (handoffId: string, acceptanceNote?: string) => {
    const nowIso = new Date().toISOString();
    
    setHandoffs(prev => prev.map(ho => {
      if (ho.id === handoffId) {
        return {
          ...ho,
          status: 'Accepted',
          acceptedAt: nowIso,
          auditTrail: [
            ...ho.auditTrail,
            {
              timestamp: nowIso,
              actorId: currentUser.id,
              action: 'Responsibility Accepted',
              detail: `${currentUser.name} accepted operational responsibility for ${ho.projectName} at version ${ho.pinnedVersionId} (${ho.pinnedVersionHash}). ${acceptanceNote ? `Note: "${acceptanceNote}"` : ''}`,
            },
          ],
        };
      }
      return ho;
    }));

    const targetHandoff = handoffs.find(h => h.id === handoffId);
    if (targetHandoff) {
      // Reassign project owner to recipient
      setProjects(prev => prev.map(p => {
        if (p.id === targetHandoff.projectId) {
          return {
            ...p,
            ownerId: targetHandoff.recipientId,
            status: 'Active',
            updatedAt: nowIso,
          };
        }
        return p;
      }));

      // Log activity
      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: nowIso,
        actorId: currentUser.id,
        actorName: currentUser.name,
        type: 'handoff_accepted',
        projectId: targetHandoff.projectId,
        projectName: targetHandoff.projectName,
        description: `Accepted project responsibility for ${targetHandoff.projectName} (pinned to ${targetHandoff.pinnedVersionId}).`,
      };
      setActivities(prev => [newActivity, ...prev]);
    }

    showToast('success', 'Responsibility Accepted', `You are now the primary operational owner for this project.`);
  };

  const addClarification = (handoffId: string, question: string) => {
    const nowIso = new Date().toISOString();
    setHandoffs(prev => prev.map(ho => {
      if (ho.id === handoffId) {
        const clarifications = ho.clarifications || [];
        return {
          ...ho,
          clarifications: [
            ...clarifications,
            {
              id: `clar-${Date.now()}`,
              authorId: currentUser.id,
              timestamp: nowIso,
              question,
              response: 'Sarah Lin: "Great question! We checked with Jordan and the secops secret ticket is SEC-4912. You can proceed with sandbox testing using the mock seed."',
            },
          ],
          auditTrail: [
            ...ho.auditTrail,
            {
              timestamp: nowIso,
              actorId: currentUser.id,
              action: 'Clarification Requested',
              detail: `${currentUser.name} requested clarification: "${question.slice(0, 60)}..."`,
            },
          ],
        };
      }
      return ho;
    }));
    showToast('info', 'Clarification Posted', 'Question added to the handoff inquiry thread.');
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    showToast('success', 'Task Updated', `Task marked as ${newStatus}.`);
  };

  const addTaskToProject = (projectId: string, taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: [newTask, ...p.tasks],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    showToast('success', 'Task Created', `Added "${taskData.title}" to project.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        isAuthenticated,
        login,
        logout,
        signup,
        currentView,
        setCurrentView,
        projects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProjectTab,
        setSelectedProjectTab,
        handoffs,
        selectedHandoffId,
        setSelectedHandoffId,
        activities,
        isCreateHandoffOpen,
        setIsCreateHandoffOpen,
        createHandoffPreselectedProjectId,
        setCreateHandoffPreselectedProjectId,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        navigateToProject,
        navigateToHandoff,
        openCreateHandoff,
        createProject,
        createHandoff,
        acceptHandoff,
        addClarification,
        updateTaskStatus,
        addTaskToProject,
        toast,
        showToast,
        hideToast,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
