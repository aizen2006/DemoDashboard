import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  info?: string;
  trend?: 'up' | 'down' | 'neutral';
  colSpan?: string;
  className?: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  info,
  colSpan = "col-span-1",
  className = "",
  children,
  headerAction
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-lynq-800/50 backdrop-blur-md border border-lynq-700 rounded-2xl p-4 md:p-6 flex flex-col justify-between transition-colors hover:bg-lynq-800/70 overflow-hidden ${colSpan} ${className}`}
    >
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider truncate">{title}</h3>
          {info && (
            <div className="group relative z-50"> {/* Increased z-index */}
              <div tabIndex={0} role="button" className="cursor-help focus:outline-none p-1 -m-1">
                  <Info size={14} className="text-slate-500 hover:text-slate-300 transition-colors" />
              </div>
              {/* Added group-focus-within and group-active for mobile tap support */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-lynq-900 border border-lynq-700 text-xs text-slate-200 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible group-active:opacity-100 group-active:visible transition-all pointer-events-none z-50">
                {info}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-lynq-700" />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {headerAction}
          {icon && <div className="text-lynq-accent bg-lynq-accent/10 p-1.5 md:p-2 rounded-lg">{icon}</div>}
        </div>
      </div>
      
      {children ? (
        children
      ) : (
        <div>
          <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-slate-500 text-xs md:text-sm mt-1">{subtitle}</div>}
        </div>
      )}
    </motion.div>
  );
};