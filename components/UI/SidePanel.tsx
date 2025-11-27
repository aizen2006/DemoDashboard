import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />
          
          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-surface border-l border-border-default shadow-2xl z-50 overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-default bg-surface/90 sticky top-0 backdrop-blur-md z-10">
              <h2 className="text-xl font-semibold text-text-primary">{title || 'Details'}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-hover rounded-full text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
