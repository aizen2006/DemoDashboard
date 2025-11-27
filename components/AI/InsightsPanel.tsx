import { useState, type FC } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from "motion/react";
import { generateInsights } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface InsightsPanelProps {
  data: any;
}

export const InsightsPanel: FC<InsightsPanelProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const jsonStr = JSON.stringify(data);
    const result = await generateInsights(jsonStr);
    setInsights(result);
    setLoading(false);
  };

  return (
    <motion.div 
      className="bg-surface border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 md:p-6 relative overflow-hidden group col-span-2 md:col-span-4 lg:col-span-8 min-h-[250px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated glow background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      {/* Gradient overlay for light mode */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/80 to-blue-50/80 dark:from-transparent dark:to-transparent pointer-events-none" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
             <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
          </div>
          <div>
             <h3 className="text-indigo-800 dark:text-indigo-100 font-semibold text-base md:text-lg">AI Strategic Insights</h3>
             <p className="text-indigo-500 dark:text-indigo-300/60 text-xs">Powered by Gemini 2.5</p>
          </div>
        </div>
        {!insights && !loading && (
          <button 
            onClick={handleGenerate}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Sparkles size={14} />
            <span className="hidden md:inline">Generate Analysis</span>
            <span className="md:hidden">Analyze</span>
          </button>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-300">
            <Loader2 className="animate-spin mb-3" size={32} />
            <span className="text-sm animate-pulse">Analyzing learning patterns & engagement metrics...</span>
          </div>
        ) : insights ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="w-full text-slate-700 dark:text-slate-300 prose prose-sm max-w-none prose-headings:text-indigo-700 dark:prose-headings:text-indigo-200 prose-strong:text-slate-900 dark:prose-strong:text-white dark:prose-invert"
          >
            <ReactMarkdown>{insights}</ReactMarkdown>
            <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleGenerate}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4"
                >
                  Regenerate Analysis
                </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-center text-sm w-full max-w-md mx-auto">
            <p>Click generate to receive a deep-dive analysis of your module performance, including engagement trends and completion bottlenecks.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
