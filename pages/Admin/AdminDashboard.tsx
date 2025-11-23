import React from 'react';
import { ADMIN_STATS } from '../../constants';
import { MetricCard } from '../../components/UI/MetricCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layers, Users, AlertCircle, UploadCloud } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Overview</h1>
        <p className="text-slate-400">System status and activity monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Modules" value={ADMIN_STATS.totalModules} icon={<Layers size={20} />} />
        <MetricCard title="Active Users" value={ADMIN_STATS.totalUsers} icon={<Users size={20} />} />
        <MetricCard title="Pending Requests" value={ADMIN_STATS.pendingRequests} icon={<AlertCircle size={20} />} className="border-yellow-500/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-lynq-800/50 backdrop-blur border border-lynq-700 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-6">Issues Raised vs Resolved</h3>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="raised" stroke="#ef4444" fillOpacity={1} fill="url(#colorRaised)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-lynq-800/50 backdrop-blur border border-lynq-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <UploadCloud size={18} className="text-lynq-accent" /> Upload History
            </h3>
            <div className="space-y-4">
                {ADMIN_STATS.uploadHistory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-lynq-700/50 last:border-0">
                        <div>
                            <p className="text-slate-200 text-sm font-medium">{item.moduleName}</p>
                            <p className="text-slate-500 text-xs">by {item.user}</p>
                        </div>
                        <span className="text-slate-500 text-xs font-mono">{item.date}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 rounded-lg border border-dashed border-lynq-600 text-lynq-400 hover:border-lynq-accent hover:text-lynq-accent transition-colors text-sm">
                View Full Log
            </button>
        </div>
      </div>
    </div>
  );
};