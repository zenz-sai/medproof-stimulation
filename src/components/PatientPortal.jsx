import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Shield, Smartphone, Lock, CheckCircle2, XCircle, FileText, ArrowLeft, LogOut, HelpCircle, MessageSquare } from 'lucide-react';

export default function PatientPortal() {
  const { consents, setConsents, reports, setActivities } = useData();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authStep, setAuthStep] = useState(1);
  const [senderName, setSenderName] = useState('Your Healthcare Provider');
  const [detectedToken, setDetectedToken] = useState('');

  // Read incoming SMS parameters automatically
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access');
    const sourceHospital = urlParams.get('from');
    
    if (token) {
      setPhoneNumber('+91 98765 43210'); // Pre-fill sample phone line
      setDetectedToken(token);
    }
    if (sourceHospital) {
      setSenderName(decodeURIComponent(sourceHospital));
    }
  }, []);

  const targetPatientName = "Priya Sharma"; 
  const patientRecords = consents.filter(c => c.name === targetPatientName);
  const patientReports = reports.filter(r => r.name === targetPatientName);

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber) return alert("Please enter your mobile number.");
    setAuthStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode) return alert("Please enter the 4-digit code.");
    setIsLoggedIn(true);

    if (detectedToken) {
      setActivities(prev => [{
        id: Date.now(),
        user: targetPatientName,
        action: `Patient opened secure file repository using link sent by ${senderName}`,
        time: 'Just now'
      }, ...prev]);
    }
  };

  const handlePatientTogglePermission = (id, currentStatus, approvalName) => {
    const updatedStatus = currentStatus === 'Active' ? 'Withdrawn' : 'Active';
    setConsents(prev => prev.map(item => item.id === id ? { ...item, status: updatedStatus } : item));
    setActivities(prev => [{
      id: Date.now(),
      user: targetPatientName,
      action: `[Patient Action] Changed settings for "${approvalName}" to [${updatedStatus}]`,
      time: 'Just now'
    }, ...prev]);
  };

  // --- MOBILE-FIRST LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex flex-col justify-between p-4 font-sans text-slate-100">
        
        {/* Top Space Filler to center content nicely on tall screens */}
        <div className="hidden sm:block"></div>

        {/* Core Auth Card Container */}
        <div className="w-full max-w-sm mx-auto bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6 my-auto">
          
          {/* Incoming Source Notification Context Box */}
          <div className="bg-teal-950/40 border border-teal-500/20 p-4 rounded-xl flex items-start space-x-3 text-left">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-teal-400 block">Secure Link Context</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Opened via private message from: <strong className="text-white font-bold block text-sm mt-0.5">{senderName}</strong>
              </p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto text-teal-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-base font-black text-white tracking-tight pt-1">Patient Identity Gate</h2>
            <p className="text-[11px] text-slate-400">Verify your mobile line to view your records under the DPDP Act.</p>
          </div>

          {authStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 block pl-0.5">Mobile Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" required placeholder="e.g., 98765 43210" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 text-sm rounded-xl text-white font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg transition uppercase tracking-wide">
                Get Verification Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-xs font-bold text-slate-400 block">4-Digit Security Code</label>
                  <button type="button" onClick={() => setAuthStep(1)} className="text-[11px] text-teal-400 font-bold flex items-center space-x-0.5">
                    <ArrowLeft className="w-3 h-3" /> <span>Change Number</span>
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" required maxLength="4" placeholder="Type any 4 numbers" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 text-sm rounded-xl tracking-widest text-center font-black text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition uppercase tracking-wide">
                Unlock My Records
              </button>
            </form>
          )}
        </div>

        {/* Sticky Fixed Bottom Regulatory Privacy Seal Info */}
        <div className="w-full text-center text-[10px] text-slate-600 font-bold tracking-wider uppercase py-2 shrink-0">
          ✓ Verified End-To-End Patient Custody
        </div>
      </div>
    );
  }

  // --- LOGGED IN SECURE DASHBOARD VIEW (FULLY MOBILE OPTIMIZED) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-900 w-full overflow-x-hidden flex flex-col">
      <header className="bg-slate-900 text-white px-4 py-3.5 shadow-md sticky top-0 z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-xs font-black tracking-tight text-white m-0">Health Vault</h2>
            <p className="text-[10px] text-teal-400 font-bold mt-0.5">{targetPatientName}</p>
          </div>
        </div>
        <button onClick={() => { setIsLoggedIn(false); setAuthStep(1); setOtpCode(''); }} className="p-2 text-slate-400 hover:text-white transition">
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-md mx-auto w-full px-4 mt-4 space-y-5 flex-1">
        <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-xl text-xs text-teal-950 leading-relaxed flex items-start space-x-2.5 shadow-sm text-left">
          <HelpCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
          <p>Welcome, <strong>Priya</strong>. You can change your permission settings at any time, or click below to securely view files sent by {senderName}.</p>
        </div>

        <div className="space-y-2 text-left">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Privacy Authorizations</h3>
          {patientRecords.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 ${item.status === 'Active' ? 'border-slate-200' : 'border-amber-200 bg-amber-50/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Digital Lab Report Delivery</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Allows {senderName} to securely route records to your mobile line.</p>
                </div>
                <span className="shrink-0">{item.status === 'Active' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-amber-600" />}</span>
              </div>
              <button onClick={() => handlePatientTogglePermission(item.id, item.status, "Digital Lab Report Delivery")} className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${item.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-teal-600 text-white'}`}>
                {item.status === 'Active' ? "Stop Sharing My Reports (Opt-Out)" : "Allow Report Sharing"}
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-left">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Secure Medical Records</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {patientReports.map((report) => (
              <div key={report.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/40 transition">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{report.test}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Uploaded: {report.sent}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Opening secure viewing pipeline...`)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition shadow-sm">
                  Open File
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] font-medium text-slate-400 max-w-xs mx-auto pt-2">
          Protected by India's DPDP Act 2023. You own your health data and can withdraw your consent at any time.
        </p>
      </div>
    </div>
  );
}
