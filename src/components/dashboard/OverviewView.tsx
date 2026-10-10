import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  ArrowRightLeft, 
  Users, 
  Briefcase, 
  Megaphone, 
  Calendar, 
  Building2,
  CheckCircle,
  Filter,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types';

export const OverviewView: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    handoffs, 
    setCurrentView, 
    navigateToProject, 
    openCreateHandoff,
    updateTaskStatus,
    addTaskToProject,
    availableUsers 
  } = useApp();

  // Employee status state
  const [workStatus, setWorkStatus] = useState<'working' | 'meeting' | 'focus' | 'away'>('working');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Task filter tab
  const [taskFilter, setTaskFilter] = useState<'my-tasks' | 'high-priority' | 'in-progress' | 'completed'>('my-tasks');

  // New task modal
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || 'proj-1');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('High');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-18');

  // Pending handoffs assigned to current employee
  const pendingAwaitingMe = handoffs.filter(
    h => h.recipientId === currentUser.id && h.status === 'Pending'
  );
  const pendingHandoffs = handoffs.filter(h => h.status === 'Pending');

  // Collect all tasks across all projects
  const allProjectTasks = projects.flatMap(p => 
    p.tasks.map(t => ({
      ...t,
      projectId: p.id,
      projectName: p.name,
      projectTeam: p.team
    }))
  );

  // Filter tasks
  const filteredTasks = allProjectTasks.filter(task => {
    if (taskFilter === 'my-tasks') {
      // Tasks assigned to current user, or unassigned / blocker if not matching exact name
      return task.assignee?.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) || 
             task.assignee?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
             task.status === 'In Progress' ||
             task.isBlocker;
    }
    if (taskFilter === 'high-priority') {
      return task.priority === 'Critical' || task.priority === 'High' || task.isBlocker;
    }
    if (taskFilter === 'in-progress') {
      return task.status === 'In Progress' || task.status === 'Blocked';
    }
    if (taskFilter === 'completed') {
      return task.status === 'Completed';
    }
    return true;
  });

  const myTasksCount = allProjectTasks.filter(
    t => t.status !== 'Completed' && (
      t.assignee?.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) ||
      t.assignee?.toLowerCase().includes(currentUser.name.toLowerCase())
    )
  ).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTaskToProject(newTaskProjectId, {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || 'Assigned employee work item',
      priority: newTaskPriority,
      status: 'In Progress',
      assignee: currentUser.name,
      dueDate: newTaskDueDate,
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsNewTaskOpen(false);
  };

  const handleToggleTask = (projectId: string, taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    updateTaskStatus(projectId, taskId, nextStatus);
  };

  // Status badge config
  const statusLabels = {
    working: { label: 'Active & Working', color: 'bg-emerald-500' },
    meeting: { label: 'In a Meeting', color: 'bg-amber-500' },
    focus: { label: 'Focus Mode', color: 'bg-indigo-500' },
    away: { label: 'Away from Desk', color: 'bg-slate-400' },
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Employee Greeting & Company Workplace Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${statusLabels[workStatus].color}`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                  Company Workplace
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {todayFormatted}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
                Good morning, {currentUser.name}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {currentUser.role}
                </span>
                <span>·</span>
                <span>{currentUser.department}</span>
                <span>·</span>
                {/* Employee Status Dropdown */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full ${statusLabels[workStatus].color}`} />
                    <span>{statusLabels[workStatus].label}</span>
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-30">
                      {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setWorkStatus(key);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                            workStatus === key ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${statusLabels[key].color}`} />
                          <span>{statusLabels[key].label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Work Actions */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => openCreateHandoff()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Project Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Company Workplace Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div 
          onClick={() => setTaskFilter('my-tasks')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>My Active Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {myTasksCount || 4}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Work items awaiting your action
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('projects')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Company Projects</span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {projects.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Active departmental workspaces
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('handoffs')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pending Approvals</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums flex items-baseline gap-2">
            <span>{pendingHandoffs.length}</span>
            {pendingAwaitingMe.length > 0 && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                ({pendingAwaitingMe.length} for you)
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Handoff & review requests
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('team')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Team Online</span>
            <Users className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {availableUsers.length} / {availableUsers.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>All engineers active</span>
          </div>
        </div>
      </div>

      {/* Main Employee Workplace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Actionable Tasks & Active Company Workspaces */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Employee Task List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  My Work & Priorities
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tasks and work deliverables assigned across company projects
                </p>
              </div>

              {/* Task Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto text-xs">
                <button
                  onClick={() => setTaskFilter('my-tasks')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'my-tasks'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  My Work
                </button>
                <button
                  onClick={() => setTaskFilter('high-priority')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'high-priority'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Urgent & Blockers
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    taskFilter === 'completed'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Task Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {filteredTasks.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  No tasks found in this view. Enjoy your focused workday!
                </div>
              ) : (
                filteredTasks.slice(0, 6).map((task) => {
                  const isDone = task.status === 'Completed';
                  const priorityColor = 
                    task.priority === 'Critical' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50' :
                    task.priority === 'High' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50' :
                    task.priority === 'Medium' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50' :
                    'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';

                  return (
                    <div 
                      key={task.id}
                      className="py-3.5 flex items-start gap-3 group transition-colors"
                    >
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => handleToggleTask(task.projectId, task.id, task.status)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                        title={isDone ? "Mark as in-progress" : "Mark as completed"}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 group-hover:border-slate-500" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {task.title}
                          </span>

                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                            {task.priority}
                          </span>

                          {task.isBlocker && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Blocker
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className={`text-xs mt-1 line-clamp-1 ${isDone ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-2 flex-wrap">
                          <button
                            onClick={() => navigateToProject(task.projectId, 'tasks')}
                            className="hover:text-slate-700 dark:hover:text-slate-200 font-medium text-slate-600 dark:text-slate-400 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{task.projectName}</span>
                          </button>

                          {task.dueDate && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Due {task.dueDate}</span>
                            </span>
                          )}

                          {task.assignee && (
                            <span>Assigned to {task.assignee}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Company Projects (Active Workspaces) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Company Projects & Workspaces
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Core products and microservices actively maintained by our team
                </p>
              </div>

              <button
                onClick={() => setCurrentView('projects')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({projects.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {projects.slice(0, 4).map((project) => {
                const totalTasks = project.tasks.length || 1;
                const doneTasks = project.tasks.filter(t => t.status === 'Completed').length;
                const progressPct = Math.round((doneTasks / totalTasks) * 100);

                const statusVariant = 
                  project.status === 'Active' ? 'success' :
                  project.status === 'Transitioning' ? 'warning' :
                  project.status === 'Review Needed' ? 'error' : 'neutral';

                return (
                  <div
                    key={project.id}
                    onClick={() => navigateToProject(project.id, 'overview')}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {project.name}
                        </span>
                        <StatusBadge variant={statusVariant as any}>
                          {project.status}
                        </StatusBadge>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Work Progress</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                        <span>Team: {project.team}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-0.5">
                          Open <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Approvals, Announcements & Coworkers */}
        <div className="space-y-6">
          {/* Pending Approval Card (Only if assigned to employee) */}
          {pendingAwaitingMe.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Action Required</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Project Handoff Assigned to You
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                You have {pendingAwaitingMe.length} pending transfer package{pendingAwaitingMe.length > 1 ? 's' : ''} awaiting your verification and acceptance.
              </p>
              <button
                onClick={() => setCurrentView('handoffs')}
                className="mt-3.5 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Review in Handoffs Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Company Announcements Bulletin */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Company Bulletin
                </h3>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                All-Staff
              </span>
            </div>

            <div className="space-y-3.5 mt-3.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Engineering All-Hands</span>
                  <span>Friday · 2:00 PM</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  Quarterly technical roadmap review & employee handoff protocol demo in Conf Room 4A and Zoom.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Deployment Notice</span>
                  <span>Yesterday</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  Billing Metering Service v2.4.0 successfully rolled out with zero downtime.
                </p>
              </div>
            </div>
          </div>

          {/* Department Teammates Online */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Department Teammates
                </h3>
              </div>
              <button 
                onClick={() => setCurrentView('team')}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Directory →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1">
              {availableUsers.map((user) => (
                <div key={user.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user.name} {user.id === currentUser.id && '(You)'}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Employee Work Item
              </h3>
              <button 
                onClick={() => setIsNewTaskOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement webhook retry backoff"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Company Project
                </label>
                <select
                  value={newTaskProjectId}
                  onChange={(e) => setNewTaskProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.team})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Deliverable Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add implementation notes, runbook links, or acceptance criteria..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl cursor-pointer shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
