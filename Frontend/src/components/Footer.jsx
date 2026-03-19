import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, ShieldCheck, Activity } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-white/50 shadow-sm mt-auto no-print transition-all duration-300">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          
          {/* Brand Info */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="bg-blue-600 text-white p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-black text-3xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                MEDIX <span className="text-blue-600 italic">PRO</span>
              </span>
            </Link>
            <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm lg:max-w-md">
              Next-generation clinical intelligence system designed for modern healthcare professionals. Streamlining patient care with AI-powered workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-5 lg:mb-6">System Links</h4>
            <ul className="space-y-4 text-base font-bold text-slate-500">
              <li><Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-3 w-fit"><span className="w-2 h-2 rounded-full bg-blue-200"></span> Dashboard</Link></li>
              <li><Link to="/consultation" className="hover:text-blue-600 transition-colors flex items-center gap-3 w-fit"><span className="w-2 h-2 rounded-full bg-blue-200"></span> Workspace</Link></li>
              <li><Link to="/patients" className="hover:text-blue-600 transition-colors flex items-center gap-3 w-fit"><span className="w-2 h-2 rounded-full bg-blue-200"></span> Patient Registry</Link></li>
            </ul>
          </div>

          {/* Contact & Status */}
          <div>
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-5 lg:mb-6">Support & Status</h4>
            <ul className="space-y-4 text-base font-bold text-slate-500 mb-8">
              <li className="flex items-center gap-3 hover:text-slate-800 transition-colors cursor-pointer w-fit">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" /> 
                <span className="break-all">+94 76 72 97 190</span>
              </li>
              <li className="flex items-center gap-3 hover:text-slate-800 transition-colors cursor-pointer w-fit">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" /> 
                <span className="break-all">warnasooriyacs2000@gmail.com</span>
              </li>
            </ul>
            
            {/* Live System Status Pulse */}
            <div className="inline-flex items-center gap-3 bg-emerald-50/80 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest shadow-sm">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Support Online
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            © {new Date().getFullYear()} ABC Health Clinical Systems. All rights reserved by Sandaruwan Warnasooriya.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest shrink-0 mt-2 md:mt-0">
            <ShieldCheck className="w-5 h-5 text-blue-500" /> 
            Secured Medical Data
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;