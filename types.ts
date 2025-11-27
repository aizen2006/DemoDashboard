
export interface Module {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // User IDs
  status: 'Active' | 'Draft' | 'Archived';
  thumbnail: string;
  createdAt: string;
  author: string;
  completedAt?: string; // ISO Date string if completed by the current user
  metrics: ModuleMetrics;
}

export interface ModuleMetrics {
  objectiveScore: number;
  strScore: number;
  engagementRate: number;
  completionRate: number;
  avgRating: number;
  regionalStr: { region: string; value: number }[];
  avgTimeSaved: string;
  clientObjections: { 
    region: string; 
    items: { label: string; value: number }[]; 
  }[];
  confusionAreas: { label: string; value: number }[];
  csrHotspots?: {
    region: string;
    title: string;
    description: string;
    items: { label: string; value: number }[];
  }[];
  csrOverall: number;
  codOverall: number;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Client';
  email: string;
  assignedModules: string[]; // Module IDs
  lastActive?: string;
  department?: string;
}

export interface TweakRequest {
  id: string;
  moduleId: string;
  moduleTitle: string;
  requestedBy: string; // User ID
  type: 'Content' | 'Design' | 'Bug' | 'Feature';
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  adminComments?: string;
}

export interface UserResponse {
  id: string;
  moduleId: string;
  moduleTitle: string;
  activityTitle: string; // Name of the specific quiz, poll, etc.
  type: 'Quiz' | 'Poll' | 'Assessment' | 'Survey';
  userId: string;
  userName: string;
  score?: number; // Optional for Polls/Surveys
  status: 'Passed' | 'Failed' | 'Completed';
  submittedAt: string;
}

export interface DashboardStats {
  totalModules: number;
  totalUsers: number;
  pendingRequests: number;
  issuesResolved: { month: string; raised: number; resolved: number }[];
  uploadHistory: { date: string; moduleName: string; user: string }[];
}
