import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components Import
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // අලුත් Footer එක

// Pages Import
import Home from './pages/Home';
import Consultation from './pages/Consultation';
import Patients from './pages/Patients';

function App() {
  return (
    <BrowserRouter>
      {/* flex සහ flex-col පාවිච්චි කළේ Footer එක යටටම තල්ලු කරන්නයි. 
        Background animation එක මුළු App එකටම මෙතනින් දෙනවා. 
      */}
      <div className="min-h-screen flex flex-col animate-gradient-xy bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 font-sans text-slate-800 selection:bg-blue-200">
        
        <Navbar />

        {/* flex-grow එකෙන් කරන්නේ මැද තියෙන Content එකට පුළුවන් තරම් ඉඩ දීලා 
          Footer එක පහළටම තල්ලු කරන එකයි. 
        */}
        <div className="flex-grow relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="*" element={<div className="p-10 text-center text-2xl font-bold text-slate-400 uppercase tracking-widest">Page in Development</div>} />
          </Routes>
        </div>

        {/* හැම Page එකේම යටින් Footer එක පෙන්වයි */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;