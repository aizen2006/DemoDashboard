import React, { useState } from 'react';
import { MOCK_MODULES } from '../../constants';
import { MetricCard } from '../../components/UI/MetricCard';
import { InsightsPanel } from '../../components/AI/InsightsPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Target, Users, BookOpen, Star, Award, MapPin, Clock, ChevronDown } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [hotspotRegion, setHotspotRegion] = useState<string>('Global');
  const [objectionRegion, setObjectionRegion] = useState<string>('Global');
  
  const currentModule = selectedModuleId === 'all' 
    ? MOCK_MODULES[0] // Default to first for aggregated view simulation
    : MOCK_MODULES.find(m => m.id === selectedModuleId) || MOCK_MODULES[0];

  const metrics = currentModule.metrics;

  // Filtered Data
  const activeHotspot = metrics.csrHotspots?.find(h => h.region === hotspotRegion);
  const currentObjections = metrics.clientObjections?.find(o => o.region === objectionRegion)?.items || 
                            metrics.clientObjections?.find(o => o.region === 'Global')?.items || [];

  const RegionSelector = ({ selected, onSelect }: { selected: string, onSelect: (r: string) => void }) => (
    <div className="relative group min-w-[80px]">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none w-full bg-surface-hover border border-border-default text-text-secondary text-[10px] md:text-xs rounded-md pl-2 pr-6 py-1 md:py-1.5 focus:ring-1 focus:ring-brand outline-none cursor-pointer hover:bg-border-default transition-all"
      >
        {['Global', 'North', 'South', 'East', 'West'].map((region) => (
          <option key={region} value={region} className="bg-surface text-text-primary">
            {region}
          </option>
        ))}
      </select>
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-text-secondary transition-colors">
        <ChevronDown size={10} className="md:w-3 md:h-3" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-text-muted">Welcome back, Alice</p>
        </div>
        
        <div className="flex items-center gap-3">
            <select 
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="bg-surface border border-border-default text-text-primary rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand outline-none"
            >
              <option value="all" className="bg-surface text-text-primary">All Modules</option>
              {MOCK_MODULES.map(m => (
                <option key={m.id} value={m.id} className="bg-surface text-text-primary">{m.title}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 pb-8">
        
        {/* Key Metrics - Top Row */}
        <MetricCard 
          title="Objective Score" 
          value={`${metrics.objectiveScore}%`} 
          trend={{ value: 12, direction: 'up' }}
          info="How correct learners were on quiz items we can verify."
          subtitle="% learners mid-way..."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="STR Score" 
          value={metrics.strScore} 
          trend={{ value: 5, direction: 'up' }}
          info="Single strength score linking skill to completion."
          subtitle="Average star rati..."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="Engagement" 
          value={`${metrics.engagementRate}%`} 
          trend={{ value: 3, direction: 'down' }}
          info="How much of the module each learner actually touched."
          subtitle="% learners who exite..."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="Completion" 
          value={`${metrics.completionRate}%`} 
          trend={{ value: 8, direction: 'up' }}
          info="Who truly finished the module."
          subtitle="Active learners..."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        
        {/* AI Section & Secondary Stats */}
        <InsightsPanel data={metrics} />

        <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-row lg:flex-col gap-3 md:gap-4 h-full">
           <MetricCard 
            title="Avg Rating" 
            value={metrics.avgRating} 
            trend={{ value: 2, direction: 'neutral' }}
            info="Satisfaction with the learning."
            subtitle="Average star rati..."
            className="flex-1"
            colSpan="w-1/2 lg:w-full"
          />
          
          <MetricCard 
            title="Time Saved" 
            value={metrics.avgTimeSaved} 
            trend={{ value: 12, direction: 'up' }}
            info="Average time saved per learner by applying these skills."
            subtitle="Avg minutes..."
            className="flex-1"
            colSpan="w-1/2 lg:w-full"
          />
        </div>

        {/* CSR Hotspots */}
        {activeHotspot ? (
            <div
              className="col-span-2 md:col-span-2 lg:col-span-6 bg-surface border border-border-default rounded-2xl p-4 md:p-6 flex flex-col gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm uppercase tracking-widest text-text-muted font-medium">CSR Hotspots</span>
                <RegionSelector selected={hotspotRegion} onSelect={setHotspotRegion} />
              </div>
              <div>
                <p className="text-text-primary text-lg md:text-2xl font-bold">{activeHotspot.title}</p>
                <p className="text-text-muted text-xs md:text-sm mt-1 line-clamp-2">{activeHotspot.description}</p>
              </div>
              <div className="space-y-4 mt-2">
                {activeHotspot.items.map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-text-secondary text-xs md:text-sm font-medium truncate">{item.label}</p>
                      <div className="h-1.5 md:h-2 bg-border-subtle rounded-full mt-2">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-brand to-brand-glow"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-text-muted text-xs md:text-sm font-semibold w-8 text-right">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
        ) : (
           <div className="col-span-2 md:col-span-2 lg:col-span-6 bg-surface border border-border-default rounded-2xl p-4 md:p-6 flex flex-col gap-4 min-h-[200px]">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs md:text-sm uppercase tracking-widest text-text-muted font-medium">CSR Hotspots</span>
                 <RegionSelector selected={hotspotRegion} onSelect={setHotspotRegion} />
               </div>
               <div className="flex-1 flex items-center justify-center">
                   <p className="text-text-muted text-sm">No hotspot data for {hotspotRegion} region</p>
               </div>
           </div>
        )}

        <MetricCard 
          title="Top Client Objections" 
          value="" 
          colSpan="col-span-2 md:col-span-2 lg:col-span-6" 
          icon={<Award size={18} />} 
          info="Ranking of most frequent client objections encountered."
          headerAction={<RegionSelector selected={objectionRegion} onSelect={setObjectionRegion} />}
        >
           <div className="h-40 md:h-48 mt-2 md:mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentObjections} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="label" 
                  width={100} 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--border-default)', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)', fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>

        <MetricCard 
          title="Confusion Areas" 
          value="" 
          colSpan="col-span-2 md:col-span-2 lg:col-span-6" 
          icon={<Award size={18} />} 
          info="Topics where learners struggle the most."
        >
           <div className="h-40 md:h-48 mt-2 md:mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.confusionAreas} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="label" 
                  width={100} 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--border-default)', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)', fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
        
        {/* Regional Chart */}
        <MetricCard 
          title="Regional STR" 
          value="" 
          colSpan="col-span-2 md:col-span-4 lg:col-span-6" 
          trend={{ value: 4, direction: 'up' }}
          info="Expected premium value a trained learner can generate."
          showDecoration={false}
          headerAction={
             <div className="flex flex-col items-end">
                
             </div>
          }
        >
          <div className="h-40 md:h-48 mt-2 md:mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.regionalStr} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="region" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{fill: 'var(--border-default)', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)', fontSize: '12px', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
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