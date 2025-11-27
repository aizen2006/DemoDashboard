import { useState, type FC } from 'react';
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { 
  generateAgentInsights, 
  formatInsightsForDisplay, 
  type InsightOutput,
  type InsightTrend 
} from '../../services/agentService';

interface InsightsPanelProps {
  data: any;
}

// Trend indicator component
const TrendIndicator: FC<{ trend: InsightTrend }> = ({ trend }) => {
  const getIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp size={14} className="text-emerald-500" />;
      case 'down':
        return <TrendingDown size={14} className="text-rose-500" />;
      case 'stable':
        return <Minus size={14} className="text-slate-500" />;
    }
  };

  const getBgColor = () => {
    switch (trend.direction) {
      case 'up':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'down':
        return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
      case 'stable':
        return 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getBgColor()}`}>
      {getIcon()}
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{trend.metric}</span>
    </div>
  );
};

// Confidence meter component
const ConfidenceMeter: FC<{ confidence: number }> = ({ confidence }) => {
  const getColor = () => {
    if (confidence >= 80) return 'bg-emerald-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">{confidence}%</span>
    </div>
  );
};

export const InsightsPanel: FC<InsightsPanelProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateAgentInsights(data);
      setInsights(result);
      
      // Only show error if there's an API/connection issue (confidence 0 with issues)
      if (result.confidence === 0 && result.dataQuality.issues && result.dataQuality.issues.length > 0) {
        // Check if it's a configuration error vs a temporary error
        const isConfigError = result.dataQuality.issues.some(
          issue => issue.includes('API key') || issue.includes('configured')
        );
        if (isConfigError) {
          setError('API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
        }
        // For other errors, we still show the insights (which contain error messages)
      }
    } catch (err) {
      console.error('Generate insights error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const displayInfo = insights ? formatInsightsForDisplay(insights) : null;

  return (
    <motion.div 
      className="bg-surface border border-border-default dark:border-indigo-500/30 rounded-2xl p-4 md:p-6 relative overflow-hidden group col-span-2 md:col-span-4 lg:col-span-8 min-h-[250px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated glow background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      {/* Gradient overlay for light mode - softened for better contrast */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/40 to-blue-50/40 dark:from-transparent dark:to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
             <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
          </div>
          <div>
             <h3 className="text-text-primary dark:text-indigo-100 font-semibold text-base md:text-lg">AI Strategic Insights</h3>
             <p className="text-text-secondary dark:text-indigo-300/60 text-xs">Powered by OpenAI Agents</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {insights && displayInfo && (
            <ConfidenceMeter confidence={insights.confidence} />
          )}
          
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
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-300"
            >
              <Loader2 className="animate-spin mb-3" size={32} />
              <span className="text-sm animate-pulse">AI agents analyzing your data...</span>
              <span className="text-xs text-indigo-400 dark:text-indigo-500 mt-1">Running multi-agent pipeline</span>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <AlertCircle className="text-rose-500 mb-3" size={32} />
              <p className="text-rose-600 dark:text-rose-400 text-sm mb-4">{error}</p>
              <button 
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : insights ? (
            <motion.div 
              key="insights"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-1 flex flex-col"
            >
              {/* Trends Row */}
              {insights.trends.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {insights.trends.map((trend, index) => (
                    <TrendIndicator key={index} trend={trend} />
                  ))}
                </div>
              )}
              
              {/* Insights List */}
              <div className="flex-1 space-y-3">
                {insights.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 p-1 bg-indigo-100 dark:bg-indigo-500/20 rounded-full shrink-0">
                      <CheckCircle size={12} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-sm text-text-secondary dark:text-slate-300 leading-relaxed">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 pt-4 border-t border-indigo-200/50 dark:border-indigo-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Recommended Action
                  </span>
                </div>
                <p className="text-sm font-medium text-text-primary dark:text-indigo-300">
                  {insights.callToAction}
                </p>
              </motion.div>
              
              {/* Data Quality Warning */}
              {insights.dataQuality.issues && insights.dataQuality.issues.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    <AlertCircle size={12} className="inline mr-1" />
                    Data quality issues: {insights.dataQuality.issues.join(', ')}
                  </p>
                </div>
              )}
              
              {/* Regenerate Button */}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleGenerate}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4 flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  Regenerate Analysis
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-center text-sm w-full max-w-md mx-auto"
            >
              <p>Click generate to receive a deep-dive analysis of your module performance using our multi-agent AI system.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
