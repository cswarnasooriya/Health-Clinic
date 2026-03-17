import { useState } from 'react';
import axios from 'axios';
import { 
  Activity, 
  Stethoscope, 
  FileText, 
  User, 
  Calendar, 
  Pill, 
  FlaskConical, 
  Printer, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  Download // අලුතින් එකතු කළා
} from 'lucide-react';

function App() {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
  };

  return (
    // Forced Light Background & Text Colors for a clean look
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-800 selection:bg-blue-200">
      
      {/* A4 Print Optimization Styles */}
      <style>
        {`
          @media print {
            @page { size: A4; margin: 15mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
            .print-area { width: 100%; height: 100%; }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* Top Navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-50 px-6 lg:px-12 py-3 border-b border-slate-200 no-print flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-3xl tracking-tight text-slate-900 leading-none">MEDIX <span className="text-blue-600 italic">PRO</span></span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Clinical Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={resetForm} className="btn bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold text-base px-6">
            <Plus className="w-5 h-5 mr-1" /> New Session
          </button>
          <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${patientName ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            <Activity className={`w-5 h-5 ${patientName ? 'animate-pulse' : ''}`} />
            <span className="text-sm tracking-wider uppercase">{patientName ? 'SESSION ACTIVE' : 'READY'}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[95rem] mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT CONSOLE */}
          <div className="xl:col-span-5 no-print">
            <div className="bg-white shadow-xl rounded-2xl border-t-8 border-blue-600 overflow-hidden">
              <div className="p-8">
                
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-blue-600" />
                    Patient Intake
                  </h2>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border border-blue-200">
                     <ShieldCheck className="w-4 h-4"/> AI Engine Active
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="w-full">
                    <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Patient's full name" className="w-full bg-slate-50 border border-slate-300 rounded-xl py-4 pl-12 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" 
                             value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/2">
                      <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2">Age</label>
                      <input type="number" placeholder="Years" className="w-full bg-slate-50 border border-slate-300 rounded-xl py-4 px-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-center transition-all" 
                             value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block font-bold text-sm uppercase tracking-widest text-slate-500 mb-2">Gender</label>
                      <select className="w-full bg-slate-50 border border-slate-300 rounded-xl py-4 px-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" 
                              value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full pt-4">
                    <label className="flex justify-between items-end mb-2">
                      <span className="font-bold text-sm uppercase tracking-widest text-slate-500">Clinical Notes (Voice/Text)</span>
                    </label>
                    <textarea className="w-full bg-slate-50 border border-slate-300 rounded-xl py-4 px-5 text-lg font-medium text-slate-800 leading-relaxed focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all h-56 resize-none" 
                              placeholder="Type symptoms, diagnoses, prescribed medications with costs (e.g., Panadol 500mg - 250 LKR), and lab tests..."
                              value={rawInput} onChange={(e) => setRawInput(e.target.value)} required></textarea>
                    <div className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <Activity className="w-5 h-5" />
                      AI will automatically extract prescriptions & generate the final bill.
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-3 tracking-widest uppercase ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-1'}`} 
                    disabled={loading}
                  >
                    {loading ? (
                       <><span className="animate-spin text-2xl">⏳</span> PROCESSING DATA...</>
                    ) : 'Generate Smart Bill & Rx'}
                  </button>
                </form>

                {error && (
                  <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
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
              <div className="bg-white shadow-2xl rounded-2xl overflow-hidden print-area border border-slate-200">
                
                {/* Clean Professional Header */}
                <div className="bg-slate-50 border-b-2 border-slate-200 p-8 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Official Health Record</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">MEDICAL INVOICE</h2>
                  </div>
                  <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-colors no-print">
                    <Download className="w-5 h-5" /> DOWNLOAD PDF
                  </button>
                </div>

                <div className="p-8 sm:p-12">
                  
                  {/* Demographics - Clean Look */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-10 gap-6">
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
                  <div className="mb-10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                      <FileText className="w-5 h-5 text-blue-600" /> Clinical Diagnosis
                    </h4>
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-xl font-medium text-slate-700 leading-relaxed italic">
                      "{result.parsed_observations || "General consultation performed."}"
                    </div>
                  </div>

                  {/* Meds & Labs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                    
                    {/* Prescriptions */}
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <Pill className="w-5 h-5 text-emerald-600" /> Prescriptions
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
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
                                <tr key={p.id || idx} className="border-b border-slate-100 last:border-0">
                                  <td className="py-4 px-4">
                                    <p className="font-bold text-lg text-slate-800">{p.drug_name}</p>
                                    <p className="text-sm font-medium text-slate-500 mt-1">{p.dosage}</p>
                                  </td>
                                  <td className="py-4 px-4 text-right font-mono font-bold text-lg text-slate-800">{Number(p.cost).toFixed(2)}</td>
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
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                        <FlaskConical className="w-5 h-5 text-purple-600" /> Investigations
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
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
                                <tr key={t.id || idx} className="border-b border-slate-100 last:border-0">
                                  <td className="py-4 px-4 font-bold text-lg text-slate-800">{t.test_name}</td>
                                  <td className="py-4 px-4 text-right font-mono font-bold text-lg text-slate-800">{Number(t.cost).toFixed(2)}</td>
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

                  {/* PROFESSIONAL INVOICE TOTAL (Standard Hospital Look) */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col items-end print:border-slate-300">
                    <div className="w-full md:w-2/3 space-y-4">
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600">
                        <span>Doctor Consultation Fee</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.other_charges || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600">
                        <span>Pharmacy (Drugs)</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.total_drugs_cost || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-600 pb-6 border-b-2 border-slate-300">
                        <span>Investigations (Labs)</span>
                        <span className="font-mono text-slate-900">LKR {Number(result.bill?.total_tests_cost || 0).toFixed(2)}</span>
                      </div>
                      
                      {/* Grand Total */}
                      <div className="flex justify-between items-end pt-4">
                        <div>
                          <p className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em] mb-1">Final Payable Amount</p>
                          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-lg font-bold text-sm">
                            <ShieldCheck className="w-4 h-4" /> SECURED & PAID
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                            <span className="text-3xl text-slate-400 mr-2">LKR</span>
                            {Number(result.bill?.final_amount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-12 text-slate-400 font-bold text-xs uppercase tracking-[0.3em] border-t-2 border-slate-100 pt-6">
                    System Generated Record • Medix Pro v2.0
                  </div>
                </div>
              </div>
            ) : (
              /* Waiting State UI */
              <div className="h-full min-h-[600px] border-4 border-dashed border-slate-300 bg-white rounded-2xl flex flex-col items-center justify-center p-12 text-center no-print">
                <div className="p-6 bg-blue-50 rounded-full mb-6 text-blue-600 shadow-inner">
                  <Stethoscope className="w-16 h-16" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Awaiting Consultation</h3>
                <p className="max-w-md text-slate-500 font-bold text-lg leading-relaxed">
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

export default App;