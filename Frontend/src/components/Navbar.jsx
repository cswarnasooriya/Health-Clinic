import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, LayoutDashboard, FileText, Users, Settings } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Consultation', path: '/consultation', icon: FileText },
    { name: 'Patients', path: '/patients', icon: Users },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 lg:px-12 py-3 border-b border-slate-200 no-print flex justify-between items-center transition-all duration-300">
      
      {/* Logo Area */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-blue-500/50 transition-all duration-300">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-3xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors underline decoration-blue-100 decoration-4">MEDIX <span className="text-blue-600 italic">PRO</span></span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Clinical Intelligence</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100 scale-105' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Profile / Settings */}
      <div className="flex items-center gap-3">
        <button className="btn btn-circle btn-ghost text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Settings className="w-5 h-5 animate-spin-slow" />
        </button>
        <div className="avatar placeholder cursor-pointer group">
          <div className="bg-slate-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-100">
            <span className="font-bold text-sm">DR</span>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;