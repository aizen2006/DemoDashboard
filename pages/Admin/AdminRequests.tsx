
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
        case 'Resolved': return 'text-green-600 dark:text-green-400 bg-green-400/10 border-green-400/20';
        case 'In Progress': return 'text-blue-600 dark:text-blue-400 bg-blue-400/10 border-blue-400/20';
        default: return 'text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
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
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Tweak Requests</h1>
        <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border-default">
            {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-surface-hover text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
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
                className="bg-surface border border-border-default hover:border-brand/50 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                    </div>
                    <div>
                        <h4 className="text-text-primary font-medium group-hover:text-brand transition-colors">{req.moduleTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs bg-surface-hover text-text-secondary px-1.5 py-0.5 rounded">{req.type}</span>
                             <span className="text-xs text-text-muted">Requested by User {req.requestedBy}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(req.status)}`}>{req.status}</span>
                    <span className="text-xs text-text-muted">{req.createdAt}</span>
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
                <div className="bg-surface-hover dark:bg-lynq-900 border border-border-default rounded-lg p-5">
                     <div className="flex justify-between mb-4 border-b border-border-subtle pb-3">
                         <span className="text-sm text-text-muted">Current Status</span>
                         <span className={`text-sm font-medium px-2 py-0.5 rounded ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span>
                     </div>
                     <h3 className="text-lg text-text-primary font-semibold mb-2">Description</h3>
                     <p className="text-text-secondary text-sm leading-relaxed">{selectedRequest.description}</p>
                </div>

                <div>
                    <h4 className="text-text-primary font-medium mb-3">Update Status</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {(['Pending', 'In Progress', 'Resolved'] as const).map((status) => (
                             <button 
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                className={`py-2 rounded-lg text-sm border transition-all ${
                                    selectedRequest.status === status 
                                    ? 'bg-brand text-white border-brand' 
                                    : 'bg-surface-hover dark:bg-lynq-900 border-border-default text-text-muted hover:border-text-muted hover:text-text-primary'
                                }`}
                             >
                                {status}
                             </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <h4 className="text-text-primary font-medium mb-3">Admin Comments</h4>
                    <div className="relative">
                        <textarea 
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="w-full bg-surface-hover dark:bg-lynq-900 border border-border-default rounded-lg p-3 text-text-primary focus:border-brand outline-none h-32 resize-none placeholder-text-muted" 
                            placeholder="Add internal notes or response to user..."
                        ></textarea>
                    </div>
                    <button 
                        onClick={handleSaveComment}
                        className="mt-3 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 ml-auto shadow-lg shadow-brand/20"
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
