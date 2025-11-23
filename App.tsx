import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Background } from './components/UI/Background';
import { UserDashboard } from './pages/User/UserDashboard';
import { UserModules } from './pages/User/UserModules';
import { UserResponses } from './pages/User/UserResponses';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminModules } from './pages/Admin/AdminModules';
import { AdminRequests } from './pages/Admin/AdminRequests';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { LayoutDashboard, BookOpen, MessageSquare, Users, Settings, LogOut, Layers, Inbox, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const SidebarLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = to === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(to);
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-lynq-accent text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-lynq-800 hover:text-white'}`}
    >
      <div className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </Link>
  );
};

const AppLayout: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Role State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xs shadow-lg shadow-blue-500/20">L</div>
              LYNQ
          </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {isAdmin ? (
          <>
              <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">Admin Workspace</div>
              <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Overview" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/modules" icon={<Layers size={20} />} label="Module Manager" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/users" icon={<Users size={20} />} label="Users" onClick={closeMobileMenu} />
              <SidebarLink to="/admin/requests" icon={<Inbox size={20} />} label="Tweak Requests" onClick={closeMobileMenu} />
          </>
        ) : (
          <>
              <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">My Learning</div>
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={closeMobileMenu} />
              <SidebarLink to="/modules" icon={<BookOpen size={20} />} label="My Modules" onClick={closeMobileMenu} />
              <SidebarLink to="/responses" icon={<MessageSquare size={20} />} label="My Responses" onClick={closeMobileMenu} />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-lynq-700/50 space-y-2">
          <button 
              onClick={() => {
                setIsAdmin(!isAdmin);
                closeMobileMenu();
              }} 
              className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-700 rounded"
          >
              Simulate Role Switch: <span className={isAdmin ? 'text-pink-400' : 'text-blue-400'}>{isAdmin ? 'Admin' : 'User'}</span>
          </button>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-lynq-800 hover:text-white cursor-pointer transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                  {isAdmin ? 'AD' : 'AH'}
              </div>
              <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{isAdmin ? 'Admin User' : 'Abhik Halder'}</p>
                  <p className="text-xs text-slate-500 truncate">{isAdmin ? 'admin@lynq.com' : 'client@company.com'}</p>
              </div>
              <LogOut size={16} />
          </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen text-slate-200 flex flex-col md:flex-row font-sans">
      <Background />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-lynq-900/80 backdrop-blur sticky top-0 z-50 border-b border-lynq-700">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-xs text-white font-bold shadow-lg">L</div>
             <span className="font-bold text-lg text-white">LYNQ</span>
          </div>
          <button onClick={toggleMobileMenu} className="text-slate-300 hover:text-white p-2">
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden bg-lynq-900 flex flex-col h-full"
          >
             <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 fixed h-full z-30 hidden md:flex flex-col border-r border-lynq-700/50 bg-lynq-900/60 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 relative z-10 overflow-x-hidden">
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
    <Router>
      <AppLayout />
    </Router>
  );
}