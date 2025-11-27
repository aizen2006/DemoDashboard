
import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_MODULES } from '../../constants';
import { SidePanel } from '../../components/UI/SidePanel';
import { User } from '../../types';
import { Search, MoreHorizontal, Mail, Shield, Briefcase, Calendar, Trash2, Plus, ChevronDown } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [assignMode, setAssignMode] = useState(false);
  const [moduleToAssign, setModuleToAssign] = useState<string>('');

  // Derived state for the currently selected user
  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modules that are NOT assigned to the current user
  const availableModules = useMemo(() => {
    if (!selectedUser) return [];
    return MOCK_MODULES.filter(m => !selectedUser.assignedModules.includes(m.id));
  }, [selectedUser]);

  const getAssignedModuleDetails = (userId: string) => {
     const user = users.find(u => u.id === userId);
     if(!user) return [];
     return user.assignedModules.map(mid => MOCK_MODULES.find(m => m.id === mid)).filter(Boolean);
  };

  const handleUnassign = (moduleId: string) => {
      if (!selectedUserId) return;
      
      setUsers(prev => prev.map(user => {
          if (user.id === selectedUserId) {
              return {
                  ...user,
                  assignedModules: user.assignedModules.filter(id => id !== moduleId)
              };
          }
          return user;
      }));
  };

  const handleAssign = () => {
      if (!selectedUserId || !moduleToAssign) return;

      setUsers(prev => prev.map(user => {
          if (user.id === selectedUserId) {
              return {
                  ...user,
                  assignedModules: [...user.assignedModules, moduleToAssign]
              };
          }
          return user;
      }));
      setAssignMode(false);
      setModuleToAssign('');
  };

  const openUserDetail = (id: string) => {
      setSelectedUserId(id);
      setAssignMode(false);
      setModuleToAssign('');
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">User Management</h1>
          <p className="text-text-muted">Manage access and module assignments.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface border border-border-default rounded-lg text-text-primary outline-none focus:border-brand w-full md:w-64 placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div 
            key={user.id}
            onClick={() => openUserDetail(user.id)}
            className="bg-surface border border-border-default hover:border-brand/50 rounded-xl p-6 cursor-pointer group transition-all hover:shadow-lg hover:shadow-brand/5"
          >
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'Admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                      {user.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-text-primary font-medium group-hover:text-brand transition-colors">{user.name}</h3>
                      <p className="text-text-muted text-xs flex items-center gap-1"><Mail size={10}/> {user.email}</p>
                   </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs border ${user.role === 'Admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                  {user.role}
                </span>
             </div>
             
             <div className="space-y-2 text-sm text-text-muted border-t border-border-subtle pt-4">
                <div className="flex justify-between">
                   <span className="flex items-center gap-2"><Briefcase size={14} /> Department</span>
                   <span className="text-text-primary">{user.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                   <span className="flex items-center gap-2"><Calendar size={14} /> Last Active</span>
                   <span className="text-text-primary">{user.lastActive || 'Never'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span>Assigned Modules</span>
                   <span className="bg-surface-hover px-2 py-0.5 rounded-full text-xs text-text-primary">{user.assignedModules.length}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <SidePanel 
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        title="User Details"
      >
         {selectedUser && (
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand/50 to-brand rounded-full flex items-center justify-center text-2xl font-bold text-white">
                     {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-text-primary">{selectedUser.name}</h2>
                     <div className="flex items-center gap-2 text-text-muted text-sm mt-1">
                        <Shield size={14} /> {selectedUser.role}
                        <span className="text-border-default">•</span>
                        <Briefcase size={14} /> {selectedUser.department || 'No Dept'}
                     </div>
                  </div>
               </div>

               <div className="bg-surface-hover dark:bg-lynq-900 border border-border-default rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                       <h3 className="text-text-primary font-semibold">Assigned Modules</h3>
                       <span className="text-xs text-text-muted">{selectedUser.assignedModules.length} active</span>
                  </div>
                  
                  <div className="space-y-2">
                     {getAssignedModuleDetails(selectedUser.id).length > 0 ? (
                        getAssignedModuleDetails(selectedUser.id).map((module) => (
                           <div key={module?.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border-subtle group hover:border-border-default transition-colors">
                              <span className="text-text-secondary text-sm font-medium">{module?.title}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUnassign(module!.id); }}
                                className="text-text-muted hover:text-red-500 p-1 rounded transition-colors"
                                title="Unassign"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        ))
                     ) : (
                        <p className="text-text-muted text-sm italic py-2">No modules currently assigned.</p>
                     )}
                  </div>

                  {assignMode ? (
                      <div className="mt-4 p-4 bg-surface border border-border-default rounded-lg animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs text-text-muted mb-2">Select Module to Assign</label>
                          <div className="relative mb-3">
                              <select 
                                value={moduleToAssign}
                                onChange={(e) => setModuleToAssign(e.target.value)}
                                className="appearance-none w-full bg-surface-hover dark:bg-lynq-900 border border-border-default text-text-primary rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-brand cursor-pointer"
                              >
                                  <option value="" className="bg-surface text-text-primary">-- Select a module --</option>
                                  {availableModules.map(m => (
                                      <option key={m.id} value={m.id} className="bg-surface text-text-primary">{m.title}</option>
                                  ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
                          </div>
                          <div className="flex gap-2">
                              <button 
                                onClick={() => setAssignMode(false)}
                                className="flex-1 py-2 text-xs text-text-muted hover:text-text-primary"
                              >
                                  Cancel
                              </button>
                              <button 
                                onClick={handleAssign}
                                disabled={!moduleToAssign}
                                className="flex-1 bg-brand disabled:opacity-50 hover:bg-brand-hover text-white py-2 rounded-lg text-xs font-bold transition-colors"
                              >
                                  Confirm Assignment
                              </button>
                          </div>
                      </div>
                  ) : (
                    <button 
                        onClick={() => setAssignMode(true)}
                        className="mt-4 w-full py-2.5 border border-dashed border-border-default text-text-muted hover:border-brand hover:text-brand hover:bg-brand/5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Assign New Module
                    </button>
                  )}
               </div>

               <div className="bg-surface-hover dark:bg-lynq-900 border border-border-default rounded-xl p-6">
                  <h3 className="text-text-primary font-semibold mb-4">Account Settings</h3>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs text-text-muted uppercase mb-1">Email Address</label>
                         <input type="text" value={selectedUser.email} readOnly className="w-full bg-surface border border-border-default rounded p-2 text-text-muted text-sm outline-none" />
                      </div>
                      <div className="flex gap-4 pt-2">
                         <button className="flex-1 bg-surface hover:bg-border-default text-text-primary py-2 rounded text-sm transition-colors">Reset Password</button>
                         <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 py-2 rounded text-sm transition-colors">Deactivate User</button>
                      </div>
                   </div>
               </div>
            </div>
         )}
      </SidePanel>
    </div>
  );
};
