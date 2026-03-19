import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, CalendarCheck, FileText, ArrowRight, TrendingUp, Clock, Zap } from 'lucide-react';

function Home() {

  const stats = [
    { title: "Today's Patients", value: "24", icon: Users, color: "text-blue-600", glow: "hover:shadow-blue-500/20" },
    { title: "Pending Reports", value: "07", icon: Activity, color: "text-amber-600", glow: "hover:shadow-amber-500/20" },
    { title: "Weekly Revenue", value: "34 800", icon: TrendingUp, color: "text-emerald-600", glow: "hover:shadow-emerald-500/20", suffix: "LKR" }
  ];

  return (
    
    <div className="min-h-screen animate-gradient-xy bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50">
      
      
      <div className="fixed inset-0 z-0 overflow-hidden no-print">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
        <div className="absolute top-2/3 -right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
      </div>

      
      <main className="max-w-[95rem] mx-auto p-4 lg:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Welcome Banner - Updated to fit the new theme */}
        <div className="bg-slate-950 rounded-3xl p-8 lg:p-12 mb-8 shadow-2xl relative overflow-hidden group border border-slate-800">
          {/* Animated Blob inside banner */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-1000 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              <p className="text-blue-300 font-black uppercase tracking-[0.2em] text-xs">Live Status: Operations Normal</p>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">Good Day, <span className="text-blue-400">Dr. Sandaruwan</span></h1>
            <p className="text-slate-300 font-medium text-lg lg:text-xl max-w-2xl leading-relaxed">
              Your clinic is running smoothly today. You have <span className="font-bold text-white">5 upcoming appointments</span>. Ensure to review the pending lab reports from yesterday.
            </p>
          </div>
        </div>

        {/* Stats Row - Updated to Glassmorphism & Colored Glows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              // Glassmorphism effect: bg-white/70 + backdrop-blur-md + border-white/50
              <div key={idx} className={`bg-white/70 backdrop-blur-md rounded-2xl p-7 border border-white/50 shadow-sm transition-all duration-300 cursor-default group hover:bg-white hover:-translate-y-2 hover:shadow-2xl ${stat.glow}`}>
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-4 rounded-xl ${stat.color} bg-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white/50 px-2 py-1 rounded border border-white/80">Live</span>
                </div>
                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{stat.value}</span>
                  {stat.suffix && <span className="text-slate-400 font-bold text-lg">{stat.suffix}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions - Glassmorphism */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Key Medical Workflows
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Start Consultation Card - High Priority (Links to /consultation) */}
              <Link to="/consultation" className="bg-white/70 backdrop-blur-md border-2 border-blue-100 hover:border-blue-600 rounded-3xl p-8 shadow-sm hover:shadow-blue-500/20 hover:bg-white transition-all duration-300 group flex flex-col items-start text-left focus:outline-none focus:ring-4 focus:ring-blue-200">
                <div className="bg-blue-600 text-white p-5 rounded-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <FileText className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">New Consultation</h3>
                <p className="text-slate-600 font-medium text-base leading-relaxed mb-8">
                  Launch the AI-assisted clinical workspace to capture patient symptoms, prescribe medications, and order lab tests directly via voice or text.
                </p>
                <div className="mt-auto flex items-center gap-2 text-blue-600 font-black text-base uppercase tracking-wider group-hover:gap-4 transition-all">
                  Open Desk <ArrowRight className="w-5 h-5" />
                </div>
              </Link>

              {/* View Patients Card */}
              <Link to="/patients" className="bg-white/70 backdrop-blur-md border border-white hover:border-slate-400 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 group flex flex-col items-start text-left focus:outline-none focus:ring-4 focus:ring-slate-200">
                <div className="bg-slate-100 text-slate-700 p-5 rounded-2xl mb-5 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                  <Users className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Patient Records</h3>
                <p className="text-slate-600 font-medium text-base leading-relaxed mb-8">
                  Browse your complete patient database, access past medical history, view timeline of visits, and retrieve structured clinical reports.
                </p>
                <div className="mt-auto flex items-center gap-2 text-slate-600 font-black text-base uppercase tracking-wider group-hover:gap-4 transition-all">
                  Search Database <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Schedule / Sidebar - Glassmorphism */}
          <div className="prevent-break">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
              <CalendarCheck className="w-5 h-5 text-blue-600" /> Today's Schedule
            </h2>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white p-3 shadow-inner hover:bg-white hover:shadow-xl transition-all duration-500">
              
              {/* Dummy Schedule Items */}
              {[
                { time: "09:00 AM", name: "Kamal Perera", type: "Follow-up", status: "Completed" },
                { time: "10:30 AM", name: "Nimali Silva", type: "General Checkup", status: "Waiting" },
                { time: "11:15 AM", name: "Sunil Shantha", type: "Lab Review", status: "Upcoming" },
                { time: "02:00 PM", name: "Anula Devi", type: "Follow-up", status: "Upcoming" },
              ].map((apt, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 hover:bg-white rounded-2xl transition-all cursor-pointer border-b border-white/50 last:border-0 group/item">
                  <div className="text-center w-16">
                    <p className="text-sm font-bold text-slate-500 uppercase group-hover/item:text-blue-700 transition-colors">{apt.time.split(' ')[0]}</p>
                    <p className="text-xs font-black text-slate-400">{apt.time.split(' ')[1]}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200 print:bg-slate-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-slate-900 group-hover/item:text-blue-800">{apt.name}</p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {apt.type}
                    </p>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${
                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    apt.status === 'Waiting' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {apt.status}
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-3 py-4 text-sm font-black text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors uppercase tracking-widest border border-transparent hover:border-blue-100">
                View Full Calendar
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Home;