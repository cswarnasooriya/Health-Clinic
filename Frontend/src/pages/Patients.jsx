import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, UserPlus, ArrowUpRight } from 'lucide-react';

function Patients() {
  const [searchTerm, setSearchTerm] = useState('');

  // දැනට පෙනුම බලාගන්න Sample Data ටිකක්
  const patientsList = [
    { id: "P-8421", name: "Kumara Perera", age: 31, gender: "Male", lastVisit: "2026-03-17", status: "Stable" },
    { id: "P-3210", name: "Nimali Silva", age: 24, gender: "Female", lastVisit: "2026-03-18", status: "Critical" },
    { id: "P-7742", name: "Sunil Shantha", age: 52, gender: "Male", lastVisit: "2026-03-15", status: "Stable" },
    { id: "P-1029", name: "Anula Devi", age: 45, gender: "Female", lastVisit: "2026-03-12", status: "Recovered" },
  ];

  return (
    // MAIN CONTAINER: Animated Gradient Background
    <div className="min-h-screen animate-gradient-xy bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 font-sans text-slate-800 selection:bg-blue-200">
      
      {/* Blurred Blobs for Visual Depth */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
        <div className="absolute top-2/3 -right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
      </div>

      <main className="max-w-[95rem] mx-auto p-4 lg:p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Registry</h1>
            <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Total 452 Registered Patients
            </p>
          </div>
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl px-6 font-black tracking-wide shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-95">
            <UserPlus className="w-5 h-5 mr-2" /> Add New Patient
          </button>
        </div>

        {/* Search & Filter Bar (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 mb-8 flex flex-col md:flex-row gap-4 items-center transition-all hover:bg-white/80 hover:shadow-md">
          <div className="relative flex-1 w-full group/search">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, ID or phone number..." 
              className="w-full bg-white/50 hover:bg-white border border-white/60 hover:border-blue-300 rounded-xl py-3 pl-12 pr-4 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="btn bg-white/50 hover:bg-white border-white/60 text-slate-600 shadow-sm flex-1 md:flex-none font-bold transition-all">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="btn bg-white/50 hover:bg-white border-white/60 text-slate-600 shadow-sm flex-1 md:flex-none font-bold transition-all">
              Export List
            </button>
          </div>
        </div>

        {/* Patients Table (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 border-b border-white/50">
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Patient ID</th>
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Basic Info</th>
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Gender & Age</th>
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Last Visit</th>
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Health Status</th>
                  <th className="py-5 px-8 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {patientsList.map((patient, idx) => (
                  <tr key={idx} className="hover:bg-white/80 transition-colors duration-300 group cursor-pointer border-b border-white/30 last:border-none">
                    <td className="py-6 px-8">
                      <span className="font-mono font-black text-blue-700 bg-blue-100/50 px-3 py-1.5 rounded-lg border border-blue-200/50 backdrop-blur-sm shadow-sm group-hover:bg-blue-100 transition-colors">
                        {patient.id}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center font-black text-slate-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 group-hover:scale-110">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{patient.name}</p>
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5 tracking-wide">
                             New Patient • Verified
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <p className="font-black text-slate-800">{patient.gender}</p>
                      <p className="text-sm font-bold text-slate-500">{patient.age} Years Old</p>
                    </td>
                    <td className="py-6 px-8">
                      <p className="font-black text-slate-800 italic">{new Date(patient.lastVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-sm ${
                        patient.status === 'Critical' ? 'bg-red-100/50 text-red-700 border-red-200' :
                        patient.status === 'Stable' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' : 
                        'bg-blue-100/50 text-blue-700 border-blue-200'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-sm btn-ghost hover:bg-blue-100 hover:text-blue-700 text-slate-400 btn-square rounded-lg transition-all group-hover:scale-110">
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                        <button className="btn btn-sm btn-ghost hover:bg-slate-200 hover:text-slate-700 text-slate-400 btn-square rounded-lg transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="bg-white/40 backdrop-blur-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/50">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Showing 1 to 4 of 452 patients</p>
             <div className="flex gap-2">
                <button className="btn btn-sm bg-white/60 border-white/60 text-slate-500 hover:bg-white disabled:opacity-50 transition-all shadow-sm" disabled>Previous</button>
                <button className="btn btn-sm bg-blue-600 border-none text-white hover:bg-blue-700 shadow-md px-6 transition-all hover:-translate-y-0.5">Next</button>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Patients;