import React from 'react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colSpan?: string;
  className?: string;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  colSpan = "col-span-1",
  className = "",
  children
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className={`bg-lynq-800/50 backdrop-blur-md border border-lynq-700 rounded-2xl p-6 flex flex-col justify-between ${colSpan} ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-lynq-accent bg-lynq-accent/10 p-2 rounded-lg">{icon}</div>}
      </div>
      
      {children ? (
        children
      ) : (
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-slate-500 text-sm mt-1">{subtitle}</div>}
        </div>
      )}
    </motion.div>
  );
};