import React, { useState } from 'react';
import { MOCK_MODULES } from '../../constants';
import { MetricCard } from '../../components/UI/MetricCard';
import { InsightsPanel } from '../../components/AI/InsightsPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Target, Users, BookOpen, Star, Award, MapPin } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  
  const currentModule = selectedModuleId === 'all' 
    ? MOCK_MODULES[0] // Default to first for aggregated view simulation
    : MOCK_MODULES.find(m => m.id === selectedModuleId) || MOCK_MODULES[0];

  const metrics = currentModule.metrics;

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Welcome back, Alice</p>
        </div>
        
        <select 
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
          className="bg-lynq-800 border border-lynq-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-lynq-accent outline-none"
        >
          <option value="all" className="bg-lynq-800 text-white">All Modules</option>
          {MOCK_MODULES.map(m => (
            <option key={m.id} value={m.id} className="bg-lynq-800 text-white">{m.title}</option>
          ))}
        </select>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Key Metrics */}
        <MetricCard title="Objective Score" value={`${metrics.objectiveScore}%`} icon={<Target size={20} />} />
        <MetricCard title="STR Score" value={metrics.strScore} icon={<Activity size={20} />} />
        <MetricCard title="Engagement" value={`${metrics.engagementRate}%`} icon={<Users size={20} />} />
        <MetricCard title="Completion" value={`${metrics.completionRate}%`} icon={<BookOpen size={20} />} />
        
        {/* AI Section (Spans full width) */}
        <InsightsPanel data={metrics} />

        {/* Secondary Metrics */}
        <MetricCard title="Avg Rating" value={metrics.avgRating} icon={<Star size={20} />} />
        <MetricCard title="CSR Overall" value={metrics.csrOverall} icon={<Award size={20} />} />
        <MetricCard title="COD Overall" value={metrics.codOverall} icon={<Award size={20} />} />
        
        {/* Regional Chart */}
        <MetricCard title="Regional STR %" value="" colSpan="col-span-1 md:col-span-2 lg:col-span-2" icon={<MapPin size={20} />}>
          <div className="h-48 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.regionalStr}>
                <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {metrics.regionalStr.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>

      </div>
    </div>
  );
};