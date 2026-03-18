import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, 
  FileText, 
  User, 
  Pill, 
  FlaskConical, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  Download,
  Stethoscope,
  Mic, // අලුතින් Mic icon එක ගත්තා
  MicOff // Mic Off icon එක ගත්තා
} from 'lucide-react';

// Speech Recognition setup (Browser compatibility සඳහා)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = 'en-US'; // භාෂාව ඉංග්‍රීසි
}

function Consultation() {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Voice Recording State
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition Logic
  useEffect(() => {
    if (!mic) return;

    mic.onstart = () => {
      console.log('Mic is on');
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      // කතා කරන දේ Text Box එකට දානවා
      setRawInput(transcript);
    };

    mic.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    mic.onend = () => {
      setIsListening(false);
    };

  }, []);

  // Button එක එබුවම Mic එක On/Off වෙන function එක
  const toggleListen = () => {
    if (!mic) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      mic.stop();
      setIsListening(false);
    } else {
      mic.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Submit කරද්දී Mic එක on වෙලා තියෙනවා නම් ඒක off කරනවා
    if (isListening) {
      mic.stop();
      setIsListening(false);
    }

    try {
      const payload = {
        patient_name: patientName,
        patient_age: parseInt(patientAge),
        patient_gender: patientGender,
        raw_input: rawInput,
      };

      const response = await axios.post('http://localhost:3000/api/process-note', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Connection to Medical Server failed. Please check if Backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPatientName('');
    setPatientAge('');
    setRawInput('');
    setResult(null);
    setError(null);
    if (isListening && mic) {
      mic.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen animate-gradient-xy bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 font-sans text-slate-800 selection:bg-blue-200">
      
      <style>
        {`
          @media print {
            @page { size: A4 portrait; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; zoom: 0.85; }
            .print-area { width: 100%; height: 100%; page-break-inside: avoid; }
            .no-print { display: none !important; }
            table, tr, td, .prevent-break { page-break-inside: avoid; }
          }
        `}
      </style>

      <div className="fixed inset-0 z-0 overflow-hidden no-print pointer-events-none">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
        <div className="absolute top-2/3 -right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-[128px] opacity-60"></div>
      </div>

      <div className="relative z-10 bg-white/40 backdrop-blur-md shadow-sm sticky top-0 px-6 lg:px-12 py-3 border-b border-white/50 no-print flex justify-between items-center transition-all duration-300">
        <h1 className="font-black text-xl tracking-tight text-slate-800">Workspace</h1>
        <div className="flex items-center gap-4">
          <button onClick={resetForm} className="btn bg-white hover:bg-blue-50 border border-white/50 text-blue-700 hover:scale-105 font-bold text-base px-6 transition-all duration-300 shadow-sm">
            <Plus className="w-5 h-5 mr-1" /> New Session
          </button>
          <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all duration-500 shadow-sm border border-white/50 ${patientName ? 'bg-emerald-100/80 text-emerald-700 shadow-emerald-200' : 'bg-white/60 text-slate-600'}`}>
            <Activity className={`w-5 h-5 ${patientName ? 'animate-pulse' : ''}`} />
            <span className="text-sm tracking-wider uppercase">{patientName ? 'SESSION ACTIVE' : 'READY'}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[95rem] mx-auto p-4 lg:p-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT CONSOLE */}
          <div className="xl:col-span-5 no-print">
            <div className="bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl rounded-3xl border-t-8 border-blue-600 overflow-hidden transition-all duration-500 group border-x border-b border-white/50">
              <div className="p-8">
                
                <div className="flex justify-between items-center mb-8 border-b border-slate-200/50 pb-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                    Patient Intake
                  </h2>
                  <div className="bg-blue-100/50 text-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border border-blue-200/50 shadow-inner">
                     <ShieldCheck className="w-4 h-4 text-blue-500"/> AI Engine Active
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="w-full relative group/input">
                    <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2 group-focus-within/input:text-blue-600 transition-colors">Full Name</label>
                    <div className="relative">
                      <User className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                      <input type="text" placeholder="Patient's full name" className="w-full bg-white/50 hover:bg-white border border-white hover:border-blue-300 rounded-xl py-4 pl-12 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all duration-300 shadow-sm backdrop-blur-sm" 
                             value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/2 group/input">
                      <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2 group-focus-within/input:text-blue-600 transition-colors">Age</label>
                      <input type="number" placeholder="Years" className="w-full bg-white/50 hover:bg-white border border-white hover:border-blue-300 rounded-xl py-4 px-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 text-center transition-all duration-300 shadow-sm backdrop-blur-sm" 
                             value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required />
                    </div>
                    <div className="w-full sm:w-1/2 group/input">
                      <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2 group-focus-within/input:text-blue-600 transition-colors">Gender</label>
                      <select className="w-full bg-white/50 hover:bg-white border border-white hover:border-blue-300 rounded-xl py-4 px-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all duration-300 shadow-sm cursor-pointer backdrop-blur-sm" 
                              value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Clinical Notes & Voice Section */}
                  <div className="w-full pt-4 group/input">
                    <label className="flex justify-between items-end mb-2 group-focus-within/input:text-blue-600 transition-colors">
                      <span className="font-bold text-sm uppercase tracking-widest text-slate-500">Clinical Notes</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-100/50 px-2 py-1 rounded border border-blue-200/50">Voice / Text</span>
                    </label>
                    
                    <div className="relative">
                      <textarea className="w-full bg-white/50 hover:bg-white border border-white hover:border-blue-300 rounded-xl py-4 px-5 pr-16 text-lg font-medium text-slate-800 leading-relaxed focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all duration-300 h-56 resize-none shadow-sm backdrop-blur-sm" 
                                placeholder="Type symptoms or click the mic to speak (e.g., Panadol 500mg - 250 LKR)..."
                                value={rawInput} onChange={(e) => setRawInput(e.target.value)} required></textarea>
                      
                      {/* Premium Floating Voice Button */}
                      <button 
                        type="button" 
                        onClick={toggleListen}
                        className={`absolute right-4 bottom-4 p-4 rounded-full shadow-lg transition-all duration-300 border-2 flex items-center justify-center
                          ${isListening 
                            ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/50 scale-110' 
                            : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50 hover:scale-105 hover:border-blue-300'}`}
                        title={isListening ? "Stop Listening" : "Start Voice Typing"}
                      >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        
                        {/* Ping effect when listening */}
                        {isListening && (
                          <span className="absolute w-full h-full rounded-full bg-red-400 opacity-50 animate-ping"></span>
                        )}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-100/50 p-3 rounded-lg border border-blue-200/50 transition-all duration-300 hover:shadow-md">
                      <Activity className="w-5 h-5" />
                      AI will automatically extract prescriptions & generate the final bill.
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 rounded-xl shadow-lg hover:shadow-blue-500/40 transition-all duration-300 flex justify-center items-center gap-3 tracking-widest uppercase ${loading ? 'opacity-80 cursor-not-allowed scale-95' : 'hover:-translate-y-1 active:scale-95'}`} 
                    disabled={loading}
                  >
                    {loading ? (
                       <><span className="animate-spin text-2xl">⏳</span> PROCESSING DATA...</>
                    ) : 'Generate Smart Bill & Rx'}
                  </button>
                </form>

                {error && (
                  <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                      <h3 className="font-bold text-base">System Error</h3>
                      <div className="text-sm font-medium mt-1">{error}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SMART MEDICAL REPORT & BILL */}
          <div className="xl:col-span-7 print:col-span-12">
            {result ? (
              <div className="bg-white shadow-2xl hover:shadow-blue-900/10 rounded-3xl overflow-hidden print-area border border-slate-200 transition-all duration-500 animate-in slide-in-from-bottom-8">
                
                {/* Header */}
                <div className="bg-slate-50 border-b-2 border-slate-200 p-8 flex justify-between items-center print:p-4 print:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Official Health Record</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">MEDICAL INVOICE</h2>
                  </div>
                  <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 no-print uppercase tracking-wider">
                    <Download className="w-5 h-5 animate-bounce" /> SAVE PDF
                  </button>
                </div>

                <div className="p-8 sm:p-12 print:p-6 print:pt-4">
                  
                  {/* Demographics */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 hover:bg-white border border-slate-200 p-6 rounded-2xl mb-10 gap-6 transition-colors duration-300 shadow-sm print:mb-6 print:p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Patient Name</p>
                      <p className="text-3xl font-black text-slate-800 uppercase">{result.patient?.name}</p>
                      <p className="text-sm font-bold text-slate-500 mt-1">Ref: #{result.id?.split('-')[0]}</p>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Age / Gender</p>
                        <p className="text-xl font-black text-slate-800">{result.patient?.age} <span className="text-base text-slate-500">Yrs</span> / {result.patient?.gender}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Date</p>
                        <p className="text-xl font-black text-slate-800">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="mb-10 prevent-break print:mb-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                      <FileText className="w-5 h-5 text-blue-600" /> Clinical Diagnosis
                    </h4>
                    <div className="bg-blue-50/50 hover:bg-blue-50 p-6 rounded-xl border border-blue-100 text-xl font-medium text-slate-700 leading-relaxed italic transition-colors duration-300 print:text-lg print:p-4">
                      "{result.parsed_observations || "General consultation performed."}"
                    </div>
                  </div>

                  {/* Meds & Labs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 print:gap-6 print:mb-6">
                    
                    {/* Prescriptions */}
                    <div className="prevent-break">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <Pill className="w-5 h-5 text-emerald-600" /> Prescriptions
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="py-3 px-4 font-bold text-sm text-slate-600">Drug & Dosage</th>
                              <th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Cost (LKR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.prescriptions && result.prescriptions.length > 0 ? (
                              result.prescriptions.map((p, idx) => (
                                <tr key={p.id || idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                  <td className="py-4 px-4 print:py-2">
                                    <p className="font-bold text-lg text-slate-800 print:text-base">{p.drug_name}</p>
                                    <p className="text-sm font-medium text-slate-500 mt-1">{p.dosage}</p>
                                  </td>
                                  <td className="py-4 px-4 text-right font-mono font-bold text-lg text-slate-800 print:text-base print:py-2">{Number(p.cost).toFixed(2)}</td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="2" className="py-6 text-center text-slate-400 font-medium">No prescriptions.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Labs */}
                    <div className="prevent-break">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <FlaskConical className="w-5 h-5 text-purple-600" /> Investigations
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="py-3 px-4 font-bold text-sm text-slate-600">Test Name</th>
                              <th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Cost (LKR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.lab_tests && result.lab_tests.length > 0 ? (
                              result.lab_tests.map((t, idx) => (
                                <tr key={t.id || idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                  <td className="py-4 px-4 font-bold text-lg text-slate-800 print:text-base print:py-2">{t.test_name}</td>
                                  <td className="py-4 px-4 text-right font-mono font-bold text-lg text-slate-800 print:text-base print:py-2">{Number(t.cost).toFixed(2)}</td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="2" className="py-6 text-center text-slate-400 font-medium">No investigations ordered.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* PROFESSIONAL INVOICE TOTAL */}
                  <div className="prevent-break bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col items-end print:border-slate-800 print:p-6 transition-colors duration-300">
                    <div className="w-full md:w-3/4 space-y-4">
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600 print:text-sm print:text-slate-800">
                        <span>Doctor Consultation Fee</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.other_charges || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600 print:text-sm print:text-slate-800">
                        <span>Pharmacy (Drugs)</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.total_drugs_cost || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600 pb-6 border-b-2 border-slate-300 print:text-sm print:text-slate-800 print:pb-4">
                        <span>Investigations (Labs)</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.total_tests_cost || 0).toFixed(2)}</span>
                      </div>
                      
                      {/* Grand Total */}
                      <div className="flex justify-between items-end pt-4">
                        <div>
                          <p className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em] mb-1 print:text-slate-800">Final Payable Amount</p>
                          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm print:border print:border-emerald-800 print:bg-transparent">
                            <ShieldCheck className="w-4 h-4" /> SECURED & PAID
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums print:text-4xl">
                            <span className="text-3xl text-slate-400 mr-2 print:text-xl">LKR</span>
                            {Number(result.bill?.final_amount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-12 text-slate-400 font-bold text-xs uppercase tracking-[0.3em] border-t-2 border-slate-100 pt-6 print:mt-6 print:pt-4">
                    System Generated Record • Medix Pro v2.0
                  </div>
                </div>
              </div>
            ) : (
              /* Waiting State UI - Glassmorphism Updated */
              <div className="h-full min-h-[600px] border-4 border-dashed border-white/50 bg-white/30 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12 text-center no-print transition-all duration-300 hover:border-blue-300 hover:bg-white/50 group shadow-lg">
                <div className="p-6 bg-white/80 rounded-full mb-6 text-blue-600 shadow-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-white">
                  <Stethoscope className="w-16 h-16" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Awaiting Consultation</h3>
                <p className="max-w-md text-slate-600 font-bold text-lg leading-relaxed">
                  Enter the patient's demographic data and clinical observations on the left panel to generate the billing invoice.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Consultation;