export type Role = 'Engineering Lead' | 'Senior Staff Engineer' | 'Backend Engineer' | 'Frontend Engineer' | 'DevOps / SRE' | 'Product Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  initials: string;
  department: string;
}

export type ProjectStatus = 'Active' | 'Transitioning' | 'Review Needed' | 'Stable';

export interface ProjectVersion {
  id: string; // e.g. "v2.4.0-rc3"
  hash: string; // short commit hash e.g. "c8f912a"
  timestamp: string; // ISO date or readable
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  commitMessage: string;
  parentVersionId?: string;
  changedFilesCount: number;
  changedFiles: Array<{
    path: string;
    status: 'added' | 'modified' | 'deleted';
    insertions: number;
    deletions: number;
  }>;
  isStale?: boolean;
}

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Completed' | 'In Progress' | 'Blocked' | 'Pending';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string;
  isBlocker?: boolean;
  blockerReason?: string;
}

export interface DecisionRecord {
  id: string;
  title: string;
  date: string;
  status: 'Accepted' | 'Superseded' | 'Proposed';
  context: string;
  decision: string;
  consequences: string;
  author: string;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
  owner: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  type: 'code' | 'config' | 'doc' | 'schema' | 'spec';
  size: string;
  lastModified: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  repositoryUrl: string;
  status: ProjectStatus;
  ownerId: string;
  team: string;
  currentVersionId: string; // latest version
  versions: ProjectVersion[];
  tasks: Task[];
  decisions: DecisionRecord[];
  risks: RiskItem[];
  files: ProjectFile[];
  quickstartGuide: string;
  architectureSummary: string;
  createdAt: string;
  updatedAt: string;
  handoffCount: number;
}

export type HandoffStatus = 'Pending' | 'Accepted' | 'Declined' | 'Completed';

export interface HandoffBriefing {
  executiveSummary: string;
  confirmedProgress: string[];
  completedDeliverables: string[];
  pendingTasks: string[];
  activeBlockers: string[];
  keyDecisions: string[];
  knownRisks: string[];
  criticalFiles: string[];
  runbookCommands: string[];
  recommendedFirst48Hours: string[];
  isAiSuggested?: boolean;
}

export interface Handoff {
  id: string;
  projectId: string;
  projectName: string;
  senderId: string;
  recipientId: string;
  pinnedVersionId: string;
  pinnedVersionHash: string;
  status: HandoffStatus;
  note: string;
  createdAt: string;
  acceptedAt?: string;
  targetCompletionDate: string;
  briefing: HandoffBriefing;
  clarifications?: Array<{
    id: string;
    authorId: string;
    timestamp: string;
    question: string;
    response?: string;
  }>;
  auditTrail: Array<{
    timestamp: string;
    actorId: string;
    action: string;
    detail: string;
  }>;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  type: 'handoff_initiated' | 'handoff_accepted' | 'version_committed' | 'blocker_resolved' | 'task_completed';
  projectId: string;
  projectName: string;
  description: string;
}

export interface SourceReference {
  type: 'file' | 'version' | 'decision' | 'task';
  id: string;
  label: string;
  projectId: string;
  targetTab?: 'overview' | 'history' | 'tasks' | 'files';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  projectId?: string;
  references?: SourceReference[];
  insufficientEvidence?: boolean;
}

export type AppView = 
  | 'overview' 
  | 'projects' 
  | 'project-detail' 
  | 'handoffs' 
  | 'handoff-detail' 
  | 'ai-assistant' 
  | 'team' 
  | 'settings'
  | 'activity-audit';

export type ThemeMode = 'light' | 'dark' | 'system';

