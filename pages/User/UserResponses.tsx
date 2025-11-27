
import React, { useState, useMemo } from 'react';
import { MOCK_RESPONSES } from '../../constants';
import { Download, CheckCircle, XCircle, Clock, Filter, ChevronDown, FileQuestion, BarChart2, ClipboardCheck } from 'lucide-react';

export const UserResponses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  // Simulate current user as 'u1' (Alice)
  const myResponses = useMemo(() => MOCK_RESPONSES.filter(r => r.userId === 'u1'), []);

  // Get unique modules involved in responses for the filter dropdown
  const uniqueModules = useMemo(() => 
    Array.from(new Set(myResponses.map(r => r.moduleTitle))).sort()
  , [myResponses]);

  const filteredResponses = myResponses.filter(r => {
    const matchesSearch = r.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = moduleFilter === 'All' || r.moduleTitle === moduleFilter;
    return matchesSearch && matchesFilter;
  });

  const downloadCSV = () => {
    const headers = ["Activity", "Type", "Module", "Score", "Status", "Date"];
    const rows = filteredResponses.map(r => [
      `"${r.activityTitle}"`, 
      r.type,
      `"${r.moduleTitle}"`,
      r.score ? `${r.score}%` : 'N/A',
      r.status,
      r.submittedAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_activity_responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Passed': return <CheckCircle size={16} className="text-green-500 dark:text-green-400" />;
      case 'Failed': return <XCircle size={16} className="text-red-500 dark:text-red-400" />;
      case 'Completed': return <CheckCircle size={16} className="text-blue-500 dark:text-blue-400" />;
      default: return <Clock size={16} className="text-yellow-500 dark:text-yellow-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'Quiz': return <FileQuestion size={16} className="text-purple-500 dark:text-purple-400" />;
          case 'Poll': return <BarChart2 size={16} className="text-orange-500 dark:text-orange-400" />;
          case 'Survey': return <BarChart2 size={16} className="text-pink-500 dark:text-pink-400" />;
          case 'Assessment': return <ClipboardCheck size={16} className="text-blue-500 dark:text-blue-400" />;
          default: return <FileQuestion size={16} />;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">My Responses</h1>
          <p className="text-text-muted">Track your quizzes, polls, and assessment results.</p>
        </div>
        <div className="flex flex-wrap gap-3">
           {/* Module Filter */}
           <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-border-default">
              <Filter size={14} className="text-text-muted"/>
              <div className="relative">
                  <select 
                      value={moduleFilter} 
                      onChange={e => setModuleFilter(e.target.value)}
                      className="appearance-none bg-transparent text-sm text-text-secondary outline-none border-none cursor-pointer pr-6 max-w-[200px] truncate"
                  >
                      <option value="All" className="bg-surface text-text-primary">All Modules</option>
                      {uniqueModules.map(title => (
                        <option key={title} value={title} className="bg-surface text-text-primary">{title}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={12} />
              </div>
           </div>

           <input 
              type="text" 
              placeholder="Search activities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface border border-border-default rounded-lg px-4 py-2 text-text-primary outline-none focus:border-brand text-sm placeholder:text-text-muted"
           />
           <button 
             onClick={downloadCSV}
             className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm"
           >
             <Download size={16} /> CSV
           </button>
        </div>
      </div>

      <div className="bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-surface-hover dark:bg-lynq-900/50 border-b border-border-default">
            <tr>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Activity Name</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Type</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Module</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Date</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Score</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 text-text-muted font-medium text-xs uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filteredResponses.length > 0 ? (
              filteredResponses.map((res) => (
                <tr key={res.id} className="hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-text-primary font-medium">{res.activityTitle}</td>
                  <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                          {getTypeIcon(res.type)}
                          {res.type}
                      </div>
                  </td>
                  <td className="p-4 text-text-muted text-sm truncate max-w-[150px]" title={res.moduleTitle}>{res.moduleTitle}</td>
                  <td className="p-4 text-text-muted text-sm">{res.submittedAt}</td>
                  <td className="p-4">
                    {res.score !== undefined ? (
                        <span className={`font-bold ${res.score >= 80 ? 'text-green-600 dark:text-green-400' : res.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {res.score}%
                        </span>
                    ) : (
                        <span className="text-text-muted text-xs">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        {getStatusIcon(res.status)}
                        <span className="text-text-secondary text-sm">{res.status}</span>
                     </div>
                  </td>
                  <td className="p-4 text-right">
                     <button className="text-brand hover:text-brand-hover text-sm underline decoration-brand/50">
                       View Details
                     </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted">
                  No responses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
