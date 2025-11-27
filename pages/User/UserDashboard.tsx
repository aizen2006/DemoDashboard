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
    <div className="relative group">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-lynq-900/50 border border-lynq-700 text-slate-300 text-xs rounded-md pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-lynq-accent outline-none cursor-pointer hover:bg-lynq-800/50 transition-all"
      >
        {['Global', 'North', 'South', 'East', 'West'].map((region) => (
          <option key={region} value={region} className="bg-lynq-900 text-slate-300">
            {region}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
        <ChevronDown size={12} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Welcome back, Alice</p>
        </div>
        
        <div className="flex items-center gap-3">
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
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 pb-8">
        
        {/* Key Metrics - Top Row */}
        <MetricCard 
          title="Objective Score" 
          value={`${metrics.objectiveScore}%`} 
          icon={<Target size={18} />} 
          info="How correct learners were on quiz items we can verify."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="STR Score" 
          value={metrics.strScore} 
          icon={<Activity size={18} />} 
          info="Single strength score linking skill to completion."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="Engagement" 
          value={`${metrics.engagementRate}%`} 
          icon={<Users size={18} />} 
          info="How much of the module each learner actually touched."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        <MetricCard 
          title="Completion" 
          value={`${metrics.completionRate}%`} 
          icon={<BookOpen size={18} />} 
          info="Who truly finished the module."
          colSpan="col-span-1 md:col-span-1 lg:col-span-3"
        />
        
        {/* AI Section & Secondary Stats */}
        <InsightsPanel data={metrics} />

        <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-row lg:flex-col gap-3 md:gap-4 h-full">
           <MetricCard 
            title="Avg Rating" 
            value={metrics.avgRating} 
            icon={<Star size={18} />} 
            info="Satisfaction with the learning."
            className="flex-1"
            colSpan="w-1/2 lg:w-full"
          />
          
          <MetricCard 
            title="AVG Time Saved" 
            value={metrics.avgTimeSaved} 
            icon={<Clock size={18} />} 
            info="Average time saved per learner by applying these skills."
            className="flex-1"
            colSpan="w-1/2 lg:w-full"
          />
        </div>

        {/* CSR Hotspots */}
        {activeHotspot ? (
            <div
              className="col-span-2 md:col-span-2 lg:col-span-6 bg-lynq-800/60 border border-lynq-700 rounded-2xl p-4 md:p-6 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">CSR Hotspots </span>
                <RegionSelector selected={hotspotRegion} onSelect={setHotspotRegion} />
              </div>
              <div>
                <p className="text-white text-lg md:text-xl font-semibold">{activeHotspot.title}</p>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{activeHotspot.description}</p>
              </div>
              <div className="space-y-4">
                {activeHotspot.items.map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-slate-200 text-xs md:text-sm font-medium truncate">{item.label}</p>
                      <div className="h-1.5 md:h-2 bg-lynq-900 rounded-full mt-2">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-slate-200 to-white"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs md:text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
        ) : (
           <div className="col-span-2 md:col-span-2 lg:col-span-6 bg-lynq-800/60 border border-lynq-700 rounded-2xl p-4 md:p-6 flex flex-col gap-4 min-h-[200px] overflow-hidden">
               <div className="flex items-center justify-between">
                 <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">CSR Hotspots</span>
                 <RegionSelector selected={hotspotRegion} onSelect={setHotspotRegion} />
               </div>
               <div className="flex-1 flex items-center justify-center">
                   <p className="text-slate-500 text-sm">No hotspot data for {hotspotRegion} region</p>
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
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
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
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
        
        {/* Regional Chart */}
        <MetricCard 
          title="Regional STR " 
          value="" 
          colSpan="col-span-2 md:col-span-4 lg:col-span-6" 
          icon={<MapPin size={18} />} 
          info="Expected premium value a trained learner can generate."
        >
          <div className="h-40 md:h-48 mt-2 md:mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.regionalStr} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="region" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
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