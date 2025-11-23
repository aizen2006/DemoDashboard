
import { Module, User, TweakRequest, DashboardStats, UserResponse } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', role: 'Client', email: 'alice@company.com', assignedModules: ['m1', 'm2'], department: 'Marketing', lastActive: '2023-10-27' },
  { id: 'u2', name: 'Bob Smith', role: 'Client', email: 'bob@enterprise.org', assignedModules: ['m2'], department: 'Sales', lastActive: '2023-10-26' },
  { id: 'u3', name: 'Charlie Dev', role: 'Admin', email: 'admin@lynq.com', assignedModules: [], department: 'IT', lastActive: '2023-10-27' },
  { id: 'u4', name: 'Diana Prince', role: 'Client', email: 'diana@themyscira.com', assignedModules: ['m1', 'm4'], department: 'Operations', lastActive: '2023-10-25' },
  { id: 'u5', name: 'Evan Wright', role: 'Client', email: 'evan@startup.io', assignedModules: ['m1'], department: 'Engineering', lastActive: '2023-10-24' },
  { id: 'u6', name: 'Fiona Gallagher', role: 'Client', email: 'fiona@chi.net', assignedModules: ['m3', 'm4'], department: 'Sales', lastActive: '2023-10-20' },
  { id: 'u7', name: 'Greg House', role: 'Client', email: 'house@ppth.org', assignedModules: ['m2'], department: 'Medical', lastActive: '2023-10-22' },
  { id: 'u8', name: 'Hannah Montana', role: 'Client', email: 'hannah@disney.com', assignedModules: ['m1', 'm2', 'm4'], department: 'Media', lastActive: '2023-10-27' },
];

export const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Cybersecurity Essentials 101',
    description: 'Basic security protocols for enterprise employees.',
    assignedTo: ['u1', 'u4', 'u5', 'u8'],
    status: 'Active',
    thumbnail: 'https://picsum.photos/400/250',
    createdAt: '2023-09-15',
    author: 'Security Team',
    completedAt: '2023-10-01',
    metrics: {
      objectiveScore: 88,
      strScore: 92,
      engagementRate: 78,
      completionRate: 95,
      avgRating: 4.8,
      regionalStr: [
        { region: 'North', value: 85 },
        { region: 'South', value: 92 },
        { region: 'East', value: 78 },
        { region: 'West', value: 88 },
      ],
      csrOverall: 8.5,
      codOverall: 9.1,
    }
  },
  {
    id: 'm2',
    title: 'Leadership & Empathy',
    description: 'Developing soft skills for upcoming managers.',
    assignedTo: ['u1', 'u2', 'u7', 'u8'],
    status: 'Active',
    thumbnail: 'https://picsum.photos/400/251',
    createdAt: '2023-10-05',
    author: 'HR Dept',
    metrics: {
      objectiveScore: 75,
      strScore: 82,
      engagementRate: 65,
      completionRate: 70,
      avgRating: 4.2,
      regionalStr: [
        { region: 'North', value: 70 },
        { region: 'South', value: 80 },
        { region: 'East', value: 65 },
        { region: 'West', value: 75 },
      ],
      csrOverall: 7.2,
      codOverall: 8.0,
    }
  },
  {
    id: 'm3',
    title: 'Data Privacy Compliance',
    description: 'GDPR and CCPA regulations overview.',
    assignedTo: ['u6'],
    status: 'Draft',
    thumbnail: 'https://picsum.photos/400/252',
    createdAt: '2023-10-20',
    author: 'Legal Team',
    metrics: {
      objectiveScore: 0,
      strScore: 0,
      engagementRate: 0,
      completionRate: 0,
      avgRating: 0,
      regionalStr: [],
      csrOverall: 0,
      codOverall: 0,
    }
  },
  {
    id: 'm4',
    title: 'Advanced Sales Tactics',
    description: 'Closing strategies for high-value clients.',
    assignedTo: ['u2', 'u4', 'u6', 'u8'],
    status: 'Active',
    thumbnail: 'https://picsum.photos/400/253',
    createdAt: '2023-08-10',
    author: 'Sales Lead',
    completedAt: '2023-09-01',
    metrics: {
      objectiveScore: 92,
      strScore: 88,
      engagementRate: 90,
      completionRate: 85,
      avgRating: 4.9,
      regionalStr: [
        { region: 'North', value: 90 },
        { region: 'South', value: 85 },
        { region: 'East', value: 88 },
        { region: 'West', value: 89 },
      ],
      csrOverall: 9.0,
      codOverall: 8.8,
    }
  }
];

export const MOCK_REQUESTS: TweakRequest[] = [
  { id: 'r1', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', requestedBy: 'u1', type: 'Content', description: 'Update section 3 on Phishing to include SMS examples.', status: 'Pending', createdAt: '2023-10-26' },
  { id: 'r2', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', requestedBy: 'u1', type: 'Design', description: 'Logo is pixelated on slide 4.', status: 'Resolved', createdAt: '2023-10-20' },
  { id: 'r3', moduleId: 'm2', moduleTitle: 'Leadership & Empathy', requestedBy: 'u2', type: 'Bug', description: 'Quiz does not submit on mobile.', status: 'In Progress', createdAt: '2023-10-27' },
];

export const MOCK_RESPONSES: UserResponse[] = [
  // Module 1: Cybersecurity
  { id: 'res1', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', activityTitle: 'Phishing Awareness Quiz', type: 'Quiz', userId: 'u1', userName: 'Alice Johnson', score: 95, status: 'Passed', submittedAt: '2023-10-01' },
  { id: 'res2', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', activityTitle: 'Security Culture Poll', type: 'Poll', userId: 'u1', userName: 'Alice Johnson', status: 'Completed', submittedAt: '2023-10-02' },
  { id: 'res3', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', activityTitle: 'Final Certification Exam', type: 'Assessment', userId: 'u1', userName: 'Alice Johnson', score: 88, status: 'Passed', submittedAt: '2023-10-05' },

  // Module 2: Leadership
  { id: 'res4', moduleId: 'm2', moduleTitle: 'Leadership & Empathy', activityTitle: 'Emotional Intelligence Check', type: 'Quiz', userId: 'u1', userName: 'Alice Johnson', score: 78, status: 'Passed', submittedAt: '2023-10-15' },
  { id: 'res5', moduleId: 'm2', moduleTitle: 'Leadership & Empathy', activityTitle: 'Management Style Survey', type: 'Survey', userId: 'u1', userName: 'Alice Johnson', status: 'Completed', submittedAt: '2023-10-16' },

  // Module 4: Sales
  { id: 'res6', moduleId: 'm4', moduleTitle: 'Advanced Sales Tactics', activityTitle: 'Negotiation Simulation', type: 'Assessment', userId: 'u1', userName: 'Alice Johnson', score: 45, status: 'Failed', submittedAt: '2023-09-20' },
  
  // Other Users (for admin context or future use)
  { id: 'res7', moduleId: 'm1', moduleTitle: 'Cybersecurity Essentials 101', activityTitle: 'Phishing Awareness Quiz', type: 'Quiz', userId: 'u4', userName: 'Diana Prince', score: 100, status: 'Passed', submittedAt: '2023-10-05' },
  { id: 'res8', moduleId: 'm2', moduleTitle: 'Leadership & Empathy', activityTitle: 'Emotional Intelligence Check', type: 'Quiz', userId: 'u7', userName: 'Greg House', score: 88, status: 'Passed', submittedAt: '2023-10-12' },
  { id: 'res9', moduleId: 'm4', moduleTitle: 'Advanced Sales Tactics', activityTitle: 'Closing Techniques Quiz', type: 'Quiz', userId: 'u2', userName: 'Bob Smith', score: 92, status: 'Passed', submittedAt: '2023-09-25' },
];

export const ADMIN_STATS: DashboardStats = {
  totalModules: 12,
  totalUsers: 45,
  pendingRequests: 5,
  issuesResolved: [
    { month: 'Jan', raised: 12, resolved: 10 },
    { month: 'Feb', raised: 19, resolved: 15 },
    { month: 'Mar', raised: 8, resolved: 8 },
    { month: 'Apr', raised: 15, resolved: 14 },
    { month: 'May', raised: 22, resolved: 20 },
  ],
  uploadHistory: [
    { date: '2023-10-27', moduleName: 'Sales 101', user: 'Admin' },
    { date: '2023-10-25', moduleName: 'HR Policies', user: 'Admin' },
    { date: '2023-10-20', moduleName: 'Q4 Goals', user: 'Admin' },
  ]
};
