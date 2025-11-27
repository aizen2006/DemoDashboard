import React from 'react';
import { motion } from 'motion/react';
import { Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  info?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  colSpan?: string;
  className?: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  showDecoration?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  info,
  trend,
  colSpan = "col-span-1",
  className = "",
  children,
  headerAction,
  showDecoration = true
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-surface border border-border-default rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${colSpan} ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
                <h3 className="text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-widest truncate">{title}</h3>
                {info && (
                    <div className="group relative z-50 shrink-0">
                    <div tabIndex={0} role="button" className="cursor-help focus:outline-none p-1 -m-1">
                        <Info size={12} className="text-text-muted hover:text-text-secondary transition-colors" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-lynq-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible group-active:opacity-100 group-active:visible transition-all pointer-events-none z-50">
                        {info}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-lynq-900" />
                    </div>
                    </div>
                )}
            </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {headerAction}
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              trend.direction === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
              trend.direction === 'down' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
              'bg-surface-hover text-text-secondary'
            }`}>
              {trend.direction === 'up' && <ArrowUpRight size={10} strokeWidth={3} />}
              {trend.direction === 'down' && <ArrowDownRight size={10} strokeWidth={3} />}
              {trend.direction === 'neutral' && <Minus size={10} strokeWidth={3} />}
              {trend.value}%
            </div>
          )}
        </div>
      </div>
      
      {children ? (
        children
      ) : (
        <div className="relative">
          <div className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight">{value}</div>
          {subtitle && <div className="text-text-muted text-xs md:text-sm mt-1 font-medium leading-relaxed">{subtitle}</div>}
          
          {showDecoration && (
             <div className="h-1 w-24 bg-brand/30 rounded-full mt-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-linear-to-r from-brand to-brand-glow rounded-full w-full opacity-80" />
             </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
