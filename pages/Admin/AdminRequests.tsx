
import React, { useState } from 'react';
import { MOCK_REQUESTS } from '../../constants';
import { SidePanel } from '../../components/UI/SidePanel';
import { TweakRequest } from '../../types';
import { Filter, CheckCircle, Clock, AlertTriangle, ChevronDown, Save } from 'lucide-react';

export const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<TweakRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<TweakRequest | null>(null);
  const [filter, setFilter] = useState('All');
  const [commentInput, setCommentInput] = useState('');

  const handleStatusUpdate = (newStatus: 'Pending' | 'In Progress' | 'Resolved') => {
    if (!selectedRequest) return;

    const updatedRequest = { ...selectedRequest, status: newStatus };
    
    // Update local state list
    setRequests(prev => prev.map(req => req.id === selectedRequest.id ? updatedRequest : req));
    
    // Update currently selected item
    setSelectedRequest(updatedRequest);
  };

  const handleSaveComment = () => {
    if (!selectedRequest) return;

    const updatedRequest = { ...selectedRequest, adminComments: commentInput };

    setRequests(prev => prev.map(req => req.id === selectedRequest.id ? updatedRequest : req));
    setSelectedRequest(updatedRequest);
    // Ideally, you would also show a success toast here
  };

  // Initialize comment input when opening a request
  React.useEffect(() => {
    if (selectedRequest) {
        setCommentInput(selectedRequest.adminComments || '');
    }
  }, [selectedRequest]);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
        case 'Resolved': return <CheckCircle size={14} />;
        case 'In Progress': return <Clock size={14} />;
        default: return <AlertTriangle size={14} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Tweak Requests</h1>
        <div className="flex gap-2 bg-lynq-800 p-1 rounded-lg border border-lynq-700">
            {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-lynq-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.filter(r => filter === 'All' || r.status === filter).map(req => (
            <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                className="bg-lynq-800 border border-lynq-700 hover:border-lynq-500 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                    </div>
                    <div>
                        <h4 className="text-white font-medium group-hover:text-lynq-accent transition-colors">{req.moduleTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs bg-lynq-700 text-slate-300 px-1.5 py-0.5 rounded">{req.type}</span>
                             <span className="text-xs text-slate-500">Requested by User {req.requestedBy}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(req.status)}`}>{req.status}</span>
                    <span className="text-xs text-slate-600">{req.createdAt}</span>
                </div>
            </div>
        ))}
      </div>

      <SidePanel 
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
      >
        {selectedRequest && (
            <div className="space-y-8">
                <div className="bg-lynq-900 border border-lynq-700 rounded-lg p-5">
                     <div className="flex justify-between mb-4 border-b border-lynq-800 pb-3">
                         <span className="text-sm text-slate-400">Current Status</span>
                         <span className={`text-sm font-medium px-2 py-0.5 rounded ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span>
                     </div>
                     <h3 className="text-lg text-white font-semibold mb-2">Description</h3>
                     <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.description}</p>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-3">Update Status</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {(['Pending', 'In Progress', 'Resolved'] as const).map((status) => (
                             <button 
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                className={`py-2 rounded-lg text-sm border transition-all ${
                                    selectedRequest.status === status 
                                    ? 'bg-lynq-accent text-white border-lynq-accent' 
                                    : 'bg-lynq-900 border-lynq-700 text-slate-400 hover:border-slate-500 hover:text-white'
                                }`}
                             >
                                {status}
                             </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <h4 className="text-white font-medium mb-3">Admin Comments</h4>
                    <div className="relative">
                        <textarea 
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="w-full bg-lynq-900 border border-lynq-700 rounded-lg p-3 text-white focus:border-lynq-accent outline-none h-32 resize-none placeholder-slate-600" 
                            placeholder="Add internal notes or response to user..."
                        ></textarea>
                    </div>
                    <button 
                        onClick={handleSaveComment}
                        className="mt-3 bg-lynq-accent hover:bg-lynq-accentHover text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 ml-auto shadow-lg shadow-blue-500/20"
                    >
                        <Save size={16} /> Save Comment
                    </button>
                </div>
            </div>
        )}
      </SidePanel>
    </div>
  );
};
