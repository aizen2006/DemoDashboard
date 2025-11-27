import React from 'react';
import { ADMIN_STATS } from '../../constants';
import { MetricCard } from '../../components/UI/MetricCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layers, Users, AlertCircle, UploadCloud } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Admin Overview</h1>
        <p className="text-text-muted">System status and activity monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Modules" value={ADMIN_STATS.totalModules} icon={<Layers size={20} />} />
        <MetricCard title="Active Users" value={ADMIN_STATS.totalUsers} icon={<Users size={20} />} />
        <MetricCard title="Pending Requests" value={ADMIN_STATS.pendingRequests} icon={<AlertCircle size={20} />} className="border-yellow-500/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface backdrop-blur border border-border-default rounded-2xl p-6">
          <h3 className="text-text-primary font-semibold mb-6">Issues Raised vs Resolved</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.issuesResolved}>
                <defs>
                  <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    borderColor: 'var(--border-default)', 
                    color: 'var(--text-primary)',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="raised" stroke="#ef4444" fillOpacity={1} fill="url(#colorRaised)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface backdrop-blur border border-border-default rounded-2xl p-6">
            <h3 className="text-text-primary font-semibold mb-6 flex items-center gap-2">
                <UploadCloud size={18} className="text-brand" /> Upload History
            </h3>
            <div className="space-y-4">
                {ADMIN_STATS.uploadHistory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border-subtle last:border-0">
                        <div>
                            <p className="text-text-primary text-sm font-medium">{item.moduleName}</p>
                            <p className="text-text-muted text-xs">by {item.user}</p>
                        </div>
                        <span className="text-text-muted text-xs font-mono">{item.date}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 rounded-lg border border-dashed border-border-default text-text-muted hover:border-brand hover:text-brand transition-colors text-sm">
                View Full Log
            </button>
        </div>
      </div>
    </div>
  );
};
