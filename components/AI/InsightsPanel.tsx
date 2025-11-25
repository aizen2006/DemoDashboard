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
      className="bg-linear-to-br from-lynq-800 to-lynq-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group col-span-1 md:col-span-2 lg:col-span-8 min-h-[250px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated glow background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
             <Sparkles className="text-indigo-400" size={20} />
          </div>
          <div>
             <h3 className="text-indigo-100 font-semibold text-lg">AI Strategic Insights</h3>
             <p className="text-indigo-300/60 text-xs">Powered by Gemini 2.5</p>
          </div>
        </div>
        {!insights && !loading && (
          <button 
            onClick={handleGenerate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Sparkles size={16} />
            Generate Analysis
          </button>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center text-indigo-300">
            <Loader2 className="animate-spin mb-3" size={32} />
            <span className="text-sm animate-pulse">Analyzing learning patterns & engagement metrics...</span>
          </div>
        ) : insights ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="w-full text-slate-300 prose prose-invert prose-sm max-w-none prose-headings:text-indigo-200 prose-strong:text-white"
          >
            <ReactMarkdown>{insights}</ReactMarkdown>
            <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleGenerate}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4"
                >
                  Regenerate Analysis
                </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-slate-500 text-center text-sm w-full max-w-md mx-auto">
            <p>Click generate to receive a deep-dive analysis of your module performance, including engagement trends and completion bottlenecks.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};