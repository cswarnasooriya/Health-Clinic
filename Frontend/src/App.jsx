import { useState } from 'react';
import axios from 'axios';

function App() {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
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
        raw_input: rawInput,
        // Backend eke api aluth patient kenek hadana logic eka meken trigger wenawa
        patient_id: "new" 
      };

      const response = await axios.post('http://localhost:3000/api/process-note', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Backend connection failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white">
      {/* Top Navigation / Branding */}
      <header className="navbar bg-white border-b px-4 lg:px-12 py-3 shadow-sm no-print sticky top-0 z-50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">MEDIX <span className="text-primary">CORE</span></h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-none">AI Smart Clinic v2.0</p>
            </div>
          </div>
        </div>
        <div className="flex-none gap-4">
           <span className="badge badge-success badge-outline gap-2 font-bold p-3">● Online</span>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-10 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: DOCTOR INPUT PANEL */}
          <section className="lg:col-span-5 no-print">
            <div className="card bg-white shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
              <div className="bg-slate-800 p-6">
                 <h2 className="text-white text-xl font-bold flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                   </svg>
                   Consultation Desk
                 </h2>
                 <p className="text-slate-400 text-xs mt-1 font-medium">Capture patient data and clinic notes instantly.</p>
              </div>

              <div className="card-body p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Quick Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label uppercase text-[10px] font-black text-slate-500 tracking-wider">Patient Name</label>
                      <input type="text" placeholder="Ex: Sandaruwan" className="input input-bordered focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                    </div>
                    <div className="form-control">
                      <label className="label uppercase text-[10px] font-black text-slate-500 tracking-wider">Age</label>
                      <input type="number" placeholder="24" className="input input-bordered focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required />
                    </div>
                  </div>

                  {/* Smart Notes Section */}
                  <div className="form-control">
                    <label className="label flex justify-between">
                      <span className="uppercase text-[10px] font-black text-slate-500 tracking-wider">Clinical Notes & Billing Data</span>
                      <span className="badge badge-primary badge-sm font-bold animate-pulse">AI Parsing Active</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-56 text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 border-2" 
                      placeholder="Symptoms: Fever for 2 days. Rx: Paracetamol 500mg (Cost: 250). Lab: CBC Test (Cost: 1500)..."
                      value={rawInput} onChange={(e) => setRawInput(e.target.value)} required></textarea>
                    <label className="label">
                      <span className="label-text-alt text-slate-400 italic">Tip: Type drugs & tests with their costs in brackets.</span>
                    </label>
                  </div>

                  <button className={`btn btn-primary w-full h-16 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all ${loading ? 'loading' : ''}`} disabled={loading}>
                    {loading ? 'AI IS THINKING...' : 'GENERATE CLINIC REPORT'}
                  </button>
                </form>

                {error && (
                  <div className="alert alert-error bg-rose-50 border-none text-rose-600 font-bold shadow-sm">
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: PROFESSIONAL REPORT & BILLING */}
          <section className="lg:col-span-7">
            {result ? (
              <div className="card bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500 print-area">
                
                {/* Printable Header */}
                <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">MEDICAL INVOICE</h2>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">Digital Health Certificate</p>
                  </div>
                  <button onClick={() => window.print()} className="btn btn-primary btn-sm no-print font-bold">🖨️ PRINT REPORT</button>
                </div>

                <div className="card-body p-10">
                  {/* Patient Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                    <div>
                       <span className="text-xs font-black text-slate-400 uppercase">Patient Information</span>
                       <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{result.patient?.name}</h3>
                       <div className="flex gap-2 mt-2">
                         <span className="badge badge-lg bg-slate-100 border-none text-slate-700 font-bold">{result.patient?.age} Years Old</span>
                         <span className="badge badge-lg badge-outline border-slate-200 text-slate-500 font-medium italic">Ref: #{result.id?.slice(0,8)}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Issued On</p>
                       <p className="text-lg font-bold text-slate-700">{new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="py-8">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">● Clinical Findings & Diagnosis</h4>
                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                      <p className="text-slate-700 leading-relaxed text-lg italic underline decoration-blue-200 underline-offset-8">
                        "{result.parsed_observations}"
                      </p>
                    </div>
                  </div>

                  {/* Prescriptions and Labs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Rx Prescriptions</h4>
                      {result.prescriptions?.map(p => (
                        <div key={p.id} className="group flex justify-between items-center bg-slate-50 hover:bg-white p-3 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                          <div>
                            <p className="font-bold text-slate-800">{p.drug_name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{p.dosage}</p>
                          </div>
                          <span className="font-bold text-slate-700">LKR {p.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Lab Investigations</h4>
                      {result.lab_tests?.map(t => (
                        <div key={t.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-transparent">
                          <p className="font-bold text-slate-800">{t.test_name}</p>
                          <span className="font-bold text-slate-700">LKR {t.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Billing Section */}
                  <div className="mt-12 bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    {/* Design Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                      <div className="flex justify-between items-center opacity-60 font-medium">
                        <span>Professional Consultation Fee</span>
                        <span className="font-mono">LKR {result.bill?.other_charges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center opacity-60 font-medium">
                        <span>Pharmacy & Laboratory Subtotal</span>
                        <span className="font-mono">LKR {(result.bill?.total_drugs_cost + result.bill?.total_tests_cost).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2"></div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-primary text-xs font-black uppercase tracking-widest">Grand Total Amount</p>
                          <h5 className="text-5xl font-black tracking-tighter">LKR {result.bill?.final_amount.toFixed(2)}</h5>
                        </div>
                        <div className="text-right">
                           <div className="badge badge-primary font-black p-4">PAID IN FULL</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-slate-400 mt-8 uppercase font-bold tracking-widest">*** System Generated Medical Report ***</p>

                </div>
              </div>
            ) : (
              /* Placeholder when no data */
              <div className="h-full min-h-[500px] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 no-print">
                 <div className="bg-slate-100 p-8 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                 </div>
                 <p className="text-xl font-black uppercase tracking-tighter">Awaiting Consultation Data</p>
                 <p className="text-sm font-medium italic">Fill the form and click process to generate bill.</p>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;