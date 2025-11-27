import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { UserDashboard } from './pages/User/UserDashboard';
import { UserModules } from './pages/User/UserModules';
import { UserResponses } from './pages/User/UserResponses';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminModules } from './pages/Admin/AdminModules';
import { AdminRequests } from './pages/Admin/AdminRequests';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { LayoutDashboard, BookOpen, MessageSquare, Users, LogOut, Layers, Inbox, Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const SidebarLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = to === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(to);
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-brand text-text-inverted shadow-lg shadow-brand/30' : 'text-text-muted hover:bg-surface-hover hover:text-text-primary'}`}
    >
      <div className={isActive ? 'text-text-inverted' : 'text-text-muted group-hover:text-text-primary'}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-text-inverted animate-pulse" />}
    </Link>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-surface-hover hover:bg-border-default transition-colors text-text-secondary hover:text-text-primary relative overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

const AppLayout: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter text-text-primary flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-tr from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xs text-white shadow-lg shadow-blue-500/20">L</div>
              LYNQ
          </h1>
          <ThemeToggle />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {isAdmin ? (
          <>
              <div className="px-4 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wider mt-2">Admin Workspace</div>
              <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Overview" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/modules" icon={<Layers size={20} />} label="Module Manager" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/users" icon={<Users size={20} />} label="Users" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/requests" icon={<Inbox size={20} />} label="Tweak Requests" onClick={closeMobileMenu} />
          </>
        ) : (
          <>
              <div className="px-4 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wider mt-2">My Learning</div>
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={closeMobileMenu} />
              <SidebarLink to="/modules" icon={<BookOpen size={20} />} label="My Modules" onClick={closeMobileMenu} />
              <SidebarLink to="/responses" icon={<MessageSquare size={20} />} label="My Responses" onClick={closeMobileMenu} />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border-default space-y-2">
          <button 
              onClick={() => {
                setIsAdmin(!isAdmin);
                closeMobileMenu();
              }} 
              className="w-full text-left px-4 py-2 text-xs text-text-muted hover:text-text-primary transition-colors border border-transparent hover:border-border-default rounded"
          >
              Simulate Role Switch: <span className={isAdmin ? 'text-pink-500' : 'text-brand'}>{isAdmin ? 'Admin' : 'User'}</span>
          </button>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-surface-hover hover:text-text-primary cursor-pointer transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${isAdmin ? 'bg-linear-to-br from-purple-500 to-pink-500' : 'bg-linear-to-br from-blue-500 to-cyan-500'}`}>
                  {isAdmin ? 'AD' : 'AJ'}
              </div>
              <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-text-primary truncate">{isAdmin ? 'Admin User' : 'Alice Johnson'}</p>
                  <p className="text-xs text-text-muted truncate">{isAdmin ? 'admin@lynq.com' : 'alice@company.com'}</p>
              </div>
              <LogOut size={16} />
          </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col md:flex-row font-sans transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface/80 backdrop-blur sticky top-0 z-50 border-b border-border-default">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-linear-to-tr from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xs text-white font-bold shadow-lg">L</div>
             <span className="font-bold text-lg text-text-primary">LYNQ</span>
          </div>
          <div className="flex items-center gap-2">
              <ThemeToggle />
              <button onClick={toggleMobileMenu} className="text-text-secondary hover:text-text-primary p-2">
                 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden bg-surface flex flex-col h-full"
          >
             <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 fixed h-full z-30 hidden md:flex flex-col border-r border-border-default bg-surface/60 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-12 relative z-10 overflow-x-hidden">
        <Routes>
           {/* User Routes - Guarded against Admin */}
           <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <UserDashboard />} />
           <Route path="/modules" element={isAdmin ? <Navigate to="/admin" /> : <UserModules />} />
           <Route path="/responses" element={isAdmin ? <Navigate to="/admin" /> : <UserResponses />} />
           
           {/* Admin Routes - Guarded against User */}
           <Route path="/admin" element={!isAdmin ? <Navigate to="/" /> : <AdminDashboard />} />
           <Route path="/admin/modules" element={!isAdmin ? <Navigate to="/" /> : <AdminModules />} />
           <Route path="/admin/users" element={!isAdmin ? <Navigate to="/" /> : <AdminUsers />} />
           <Route path="/admin/requests" element={!isAdmin ? <Navigate to="/" /> : <AdminRequests />} />
           
           {/* Catch all */}
           <Route path="*" element={<Navigate to={isAdmin ? "/admin" : "/"} />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}
