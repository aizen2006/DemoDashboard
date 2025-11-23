
import React, { useState, useMemo } from 'react';
import { MOCK_MODULES } from '../../constants';
import { SidePanel } from '../../components/UI/SidePanel';
import { Plus, Upload, MoreHorizontal, Filter, Calendar, User, ChevronDown } from 'lucide-react';

type SortOption = 'created' | 'title' | 'status';

export const AdminModules: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  
  // Filters
  const [authorFilter, setAuthorFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('created');

  // Derived Data
  const authors = useMemo(() => Array.from(new Set(MOCK_MODULES.map(m => m.author))), []);
  const selectedModule = MOCK_MODULES.find(m => m.id === editingModule);

  // Filter Logic
  const filteredModules = useMemo(() => {
      let result = [...MOCK_MODULES];
      if (authorFilter !== 'All') {
          result = result.filter(m => m.author === authorFilter);
      }

      result.sort((a, b) => {
          if (sortBy === 'created') {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else if (sortBy === 'title') {
              return a.title.localeCompare(b.title);
          } else {
              return a.status.localeCompare(b.status);
          }
      });
      return result;
  }, [authorFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
             <h1 className="text-3xl font-bold text-white tracking-tight">Module Management</h1>
             <p className="text-slate-400 text-sm">Manage content, assigns users, and track module status.</p>
        </div>
       
        <div className="flex flex-wrap gap-3">
             {/* Admin Filters */}
             <div className="flex items-center gap-2 bg-lynq-800 px-3 py-2 rounded-lg border border-lynq-700">
                <User size={14} className="text-slate-400"/>
                <div className="relative">
                    <select 
                        value={authorFilter} 
                        onChange={e => setAuthorFilter(e.target.value)}
                        className="appearance-none bg-transparent text-sm text-slate-300 outline-none border-none cursor-pointer pr-5"
                    >
                        <option value="All" className="bg-lynq-800 text-white">All Authors</option>
                        {authors.map(a => <option key={a} value={a} className="bg-lynq-800 text-white">{a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                </div>
             </div>

             <div className="flex items-center gap-2 bg-lynq-800 px-3 py-2 rounded-lg border border-lynq-700">
                <Calendar size={14} className="text-slate-400"/>
                <div className="relative">
                    <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value as SortOption)}
                        className="appearance-none bg-transparent text-sm text-slate-300 outline-none border-none cursor-pointer pr-5"
                    >
                        <option value="created" className="bg-lynq-800 text-white">Newest First</option>
                        <option value="title" className="bg-lynq-800 text-white">Alphabetical</option>
                        <option value="status" className="bg-lynq-800 text-white">Status</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                </div>
             </div>

            <button 
                onClick={() => setIsCreating(true)}
                className="bg-lynq-accent hover:bg-lynq-accentHover text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all text-sm font-medium"
            >
                <Plus size={16} /> Add Module
            </button>
        </div>
      </div>

      <div className="bg-lynq-800 border border-lynq-700 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-lynq-900/50 border-b border-lynq-700">
                <tr>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Module Name</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Created</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Author</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Assigned</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Completion</th>
                    <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-lynq-700">
                {filteredModules.map(module => (
                    <tr key={module.id} className="hover:bg-lynq-700/30 transition-colors group">
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <img src={module.thumbnail} className="w-10 h-10 rounded object-cover ring-1 ring-lynq-700" alt="" />
                                <div>
                                    <div className="text-white font-medium text-sm">{module.title}</div>
                                    <div className="text-slate-500 text-xs truncate max-w-[150px]">{module.description}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs border font-medium ${module.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                {module.status}
                            </span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">{module.createdAt}</td>
                        <td className="p-4 text-slate-400 text-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">
                                    {module.author.charAt(0)}
                                </div>
                                {module.author}
                            </div>
                        </td>
                        <td className="p-4 text-slate-300 text-sm">{module.assignedTo.length} Users</td>
                        <td className="p-4">
                            <div className="w-full bg-lynq-900 rounded-full h-1.5 w-24">
                                <div className="bg-lynq-accent h-1.5 rounded-full" style={{ width: `${module.metrics.completionRate}%`}}></div>
                            </div>
                            <span className="text-xs text-slate-500 mt-1 block">{module.metrics.completionRate}%</span>
                        </td>
                        <td className="p-4 text-right">
                            <button onClick={() => setEditingModule(module.id)} className="p-2 text-slate-500 hover:text-white hover:bg-lynq-700 rounded transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Create / Edit Panel */}
      <SidePanel 
        isOpen={isCreating || !!editingModule} 
        onClose={() => { setIsCreating(false); setEditingModule(null); }}
        title={isCreating ? "Add New Module" : "Edit Module"}
      >
        {/* Using key ensures the form re-mounts and resets fields when switching between modules or creating new */}
        <form key={selectedModule?.id || 'new-module'} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-300 mb-1">Module Title</label>
                    <input 
                        type="text" 
                        defaultValue={selectedModule?.title} 
                        className="w-full bg-lynq-900 border border-lynq-700 rounded-lg p-3 text-white focus:border-lynq-accent outline-none transition-all" 
                        placeholder="e.g. Sales Psychology 101" 
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-300 mb-1">Description</label>
                    <textarea 
                        defaultValue={selectedModule?.description} 
                        className="w-full bg-lynq-900 border border-lynq-700 rounded-lg p-3 text-white focus:border-lynq-accent outline-none h-32 transition-all" 
                        placeholder="Describe the learning objectives..."
                    ></textarea>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Status</label>
                        <div className="relative">
                            <select defaultValue={selectedModule?.status || 'Draft'} className="appearance-none w-full bg-lynq-900 border border-lynq-700 rounded-lg p-3 text-white text-sm focus:border-lynq-accent outline-none pr-10">
                                <option value="Draft" className="bg-lynq-800 text-white">Draft</option>
                                <option value="Active" className="bg-lynq-800 text-white">Active</option>
                                <option value="Archived" className="bg-lynq-800 text-white">Archived</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm text-slate-300 mb-1">Author</label>
                        <input 
                            type="text" 
                            defaultValue={selectedModule?.author} 
                            className="w-full bg-lynq-900 border border-lynq-700 rounded-lg p-3 text-white text-sm focus:border-lynq-accent outline-none" 
                            placeholder="e.g. HR Dept"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="border border-dashed border-lynq-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-lynq-700/30 transition-colors cursor-pointer group">
                        <Upload size={24} className="text-slate-400 group-hover:text-white mb-2" />
                        <span className="text-xs text-slate-400">Upload SCORM/Video</span>
                        <input type="file" className="hidden" />
                     </div>
                      <div className="border border-dashed border-lynq-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-lynq-700/30 transition-colors cursor-pointer group">
                        <Upload size={24} className="text-slate-400 group-hover:text-white mb-2" />
                        <span className="text-xs text-slate-400">Upload Data CSV</span>
                        <input type="file" className="hidden" />
                     </div>
                </div>
            </div>

            <div className="pt-6 border-t border-lynq-700 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsCreating(false); setEditingModule(null); }} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="button" className="px-6 py-2 bg-lynq-accent hover:bg-lynq-accentHover text-white rounded-lg font-medium shadow-lg shadow-blue-500/20">
                    {isCreating ? 'Create Module' : 'Save Changes'}
                </button>
            </div>
        </form>
      </SidePanel>
    </div>
  );
};
