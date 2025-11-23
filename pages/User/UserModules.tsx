
import React, { useState, useMemo } from 'react';
import { MOCK_MODULES, MOCK_REQUESTS } from '../../constants';
import { SidePanel } from '../../components/UI/SidePanel';
import { Module } from '../../types';
import { Play, FileText, MessageSquare, Clock, ArrowRight, Filter, SortDesc, SortAsc, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

type SortOption = 'title' | 'engagement' | 'completion' | 'recent';

export const UserModules: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tweaks' | 'responses'>('overview');
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const moduleRequests = MOCK_REQUESTS.filter(r => r.moduleId === selectedModule?.id);

  // Filter and Sort Logic
  const filteredModules = useMemo(() => {
    let result = [...MOCK_MODULES];

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter(m => m.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let compareA: any, compareB: any;

      switch (sortBy) {
        case 'title':
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case 'engagement':
          compareA = a.metrics.engagementRate;
          compareB = b.metrics.engagementRate;
          break;
        case 'completion':
          compareA = a.metrics.completionRate;
          compareB = b.metrics.completionRate;
          break;
        case 'recent':
        default:
          // Prefer completedAt, fallback to createdAt
          compareA = new Date(a.completedAt || a.createdAt).getTime();
          compareB = new Date(b.completedAt || b.createdAt).getTime();
          break;
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [statusFilter, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Learning Modules</h1>
        
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-lynq-800/50 p-2 rounded-xl border border-lynq-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-2 border-r border-lynq-700/50">
            <Filter size={16} className="text-slate-400" />
            <div className="relative">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-transparent text-sm text-slate-300 outline-none cursor-pointer hover:text-white pr-6"
                >
                  <option value="All" className="bg-lynq-800 text-white">All Status</option>
                  <option value="Active" className="bg-lynq-800 text-white">Active</option>
                  <option value="Draft" className="bg-lynq-800 text-white">Draft</option>
                  <option value="Archived" className="bg-lynq-800 text-white">Archived</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sort By</span>
            <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-transparent text-sm text-slate-300 outline-none cursor-pointer hover:text-white pr-6"
                >
                  <option value="recent" className="bg-lynq-800 text-white">Recently Updated</option>
                  <option value="title" className="bg-lynq-800 text-white">Title</option>
                  <option value="engagement" className="bg-lynq-800 text-white">Engagement Rate</option>
                  <option value="completion" className="bg-lynq-800 text-white">Completion Rate</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
            </div>
            <button 
              onClick={toggleSortOrder}
              className="p-1 hover:bg-lynq-700 rounded text-slate-400 hover:text-white transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <motion.div
              key={module.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedModule(module)}
              className="group bg-lynq-800 border border-lynq-700 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-900/20 transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-lynq-900/90 to-transparent flex items-end p-6">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${module.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {module.status}
                  </span>
                  {module.completedAt && (
                     <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400 flex items-center gap-1">
                       <CheckCircleIcon size={10} /> Completed
                     </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{module.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-lynq-700/50 pt-4">
                  <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1" title="Engagement"><ArrowUpRight size={14}/> {module.metrics.engagementRate}%</span>
                      <span className="flex items-center gap-1" title="Completion"><Clock size={14}/> {module.metrics.completionRate}%</span>
                  </div>
                  <ArrowRight size={18} className="text-lynq-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
           <div className="col-span-full text-center py-20 text-slate-500">
             <p>No modules found matching your filters.</p>
           </div>
        )}
      </div>

      {/* Asana-style Side Panel */}
      <SidePanel 
        isOpen={!!selectedModule} 
        onClose={() => setSelectedModule(null)}
        title={selectedModule?.title}
      >
        {selectedModule && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-lynq-700 mb-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-lynq-accent text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                 onClick={() => setActiveTab('tweaks')}
                className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'tweaks' ? 'border-lynq-accent text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Tweak Requests
              </button>
               <button 
                 onClick={() => setActiveTab('responses')}
                className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'responses' ? 'border-lynq-accent text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Responses
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                 <div className="bg-lynq-900 p-6 rounded-xl border border-lynq-700">
                    <h4 className="text-white font-semibold mb-4">Module Details</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedModule.description}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-400 mb-6">
                       <div>
                         <span className="block text-slate-500 text-xs uppercase">Created</span>
                         {selectedModule.createdAt}
                       </div>
                       <div>
                         <span className="block text-slate-500 text-xs uppercase">Author</span>
                         {selectedModule.author}
                       </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 bg-lynq-accent hover:bg-lynq-accentHover text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                           <Play size={16} /> Start Module
                        </button>
                        <button className="flex-1 bg-lynq-700 hover:bg-lynq-600 text-white py-2 rounded-lg font-medium">
                            View Analytics
                        </button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'tweaks' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-lynq-900 p-6 rounded-xl border border-lynq-700">
                    <h4 className="text-white font-semibold mb-4">Submit a Tweak Request</h4>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Request Type</label>
                            <div className="relative">
                                <select className="appearance-none w-full bg-lynq-800 border border-lynq-700 text-white rounded p-2 text-sm focus:border-lynq-accent outline-none pr-10">
                                    <option className="bg-lynq-800 text-white">Content Update</option>
                                    <option className="bg-lynq-800 text-white">Design Change</option>
                                    <option className="bg-lynq-800 text-white">Bug Report</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea className="w-full bg-lynq-800 border border-lynq-700 text-white rounded p-2 text-sm h-24 focus:border-lynq-accent outline-none" placeholder="Describe the change needed..."></textarea>
                        </div>
                        <button type="button" className="w-full bg-lynq-accent text-white py-2 rounded font-medium">Submit Request</button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h4 className="text-white font-semibold">History</h4>
                    {moduleRequests.length === 0 ? (
                        <p className="text-slate-500 text-sm">No active requests for this module.</p>
                    ) : (
                        moduleRequests.map(req => (
                            <div key={req.id} className="bg-lynq-900 p-4 rounded-lg border border-lynq-700 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${req.status === 'Resolved' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        <span className="text-white font-medium text-sm">{req.type}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{req.description}</p>
                                </div>
                                <span className="text-xs text-slate-600">{req.createdAt}</span>
                            </div>
                        ))
                    )}
                </div>
              </div>
            )}

             {activeTab === 'responses' && (
                 <div className="bg-lynq-900 p-6 rounded-xl border border-lynq-700 text-center py-12">
                     <MessageSquare size={48} className="mx-auto text-lynq-700 mb-4" />
                     <p className="text-slate-400">Response data viewer coming soon.</p>
                 </div>
             )}
          </div>
        )}
      </SidePanel>
    </div>
  );
};

const CheckCircleIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
