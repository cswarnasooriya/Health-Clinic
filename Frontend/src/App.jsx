import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components Import
import Navbar from './components/Navbar';
import Patients from './pages/Patients';
// Pages Import
import Home from './pages/Home';
import Consultation from './pages/Consultation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-800 selection:bg-blue-200">
        
        
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/patients" element={<Patients />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;