import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Shield, Smartphone, Lock, CheckCircle2, XCircle, FileText, ArrowLeft, LogOut, HelpCircle } from 'lucide-react';

export default function PatientPortal() {
  const { consents, setConsents, reports, setActivities } = useData();
  
  // Simulation Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authStep, setAuthStep] = useState(1); // 1 = Phone Number, 2 = Enter OTP Code

  // Sample static patient selection profile for client-side matching
  const targetPatientName = "Priya Sharma"; 
  const patientRecords = consents.filter(c => c.name === targetPatientName);
  const patientReports = reports.filter(r => r.name === targetPatientName);

  // 1. Simulate sending an access code to the phone
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber) return alert("Please type your mobile number first.");
    setAuthStep(2);
  };

  // 2. Confirm the access code and unlock the portal view
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode) return alert("Please type the 4-digit code sent to your phone.");
    setIsLoggedIn(true);
  };

  // 3. Action: The patient taps a button to immediately change their permissions
  const handlePatientTogglePermission = (id, currentStatus, approvalName) => {
    const updatedStatus = currentStatus === 'Active' ? 'Withdrawn' : 'Active';
    
    setConsents(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: updatedStatus };
      }
      return item;
    }));

    // Post a notice instantly to the hospital's central activity log
    setActivities(prev => [{
      id: Date.now(),
      user: targetPatientName,
      action: `[Patient Action] Changed settings for "${approvalName}" to [${updatedStatus}] via private link`,
      time: 'Just now'
    }, ...prev]);
  };

  // --- LOGIN INTERFACE SCREEN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full space-y-6">
          
          {/* Top Branding Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto text-teal-600 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">City Hospital Patient Vault</h1>
              <p className="text-xs text-slate-400">View medical records and manage your privacy rights safely.</p>
            </div>
          </div>

          {/* Form Step 1: Requesting code via phone number */}
          {authStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Enter Mobile Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" required placeholder="e.g., 98765 43210" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 text-sm rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow transition"
              >
                Send One-Time Access Code
              </button>
            </form>
          ) : (
            /* Form Step 2: Typing in the fake code tracker */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 block">Enter 4-Digit Code</label>
                  <button type="button" onClick={() => setAuthStep(1)} className="text-[11px] text-teal-600 font-bold flex items-center space-x-0.5">
                    <ArrowLeft className="w-3 h-3" /> <span>Change Number</span>
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" required maxLength="4" placeholder="Type any 4 numbers (e.g., 1234)" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 text-sm rounded-xl tracking-widest text-center font-bold focus:outline-teal-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-center pt-1">Demo mode: Type any 4 digits to log in instantly.</span>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow transition"
              >
                Unlock My Vault
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1">
            <span>✓ Secure DPDP Compliant Channel</span>
          </div>

        </div>
      </div>
    );
  }

  // --- LOGGED IN SECURE DASHBOARD VIEW (FULLY MOBILE OPTIMIZED) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-900">
      
      {/* Mobile-Friendly Header Strip */}
      <header className="bg-slate-900 text-white px-4 py-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white m-0">My Health Vault</h2>
            <p className="text-[10px] text-teal-400 font-semibold mt-0.5">Patient: {targetPatientName}</p>
          </div>
        </div>

        <button 
          onClick={() => { setIsLoggedIn(false); setAuthStep(1); setOtpCode(''); }}
          className="p-2 text-slate-400 hover:text-white transition" title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Main Container Body */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        
        {/* HELP TIP FOR THE PATIENT */}
        <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-xl text-xs text-teal-950 leading-relaxed flex items-start space-x-2.5 shadow-sm">
          <HelpCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
          <p>
            Welcome, <strong>Priya</strong>. Here you can turn your permission settings on or off at any time, or click to securely read medical files uploaded by City Hospital.
          </p>
        </div>

        {/* SECTION 1: PRIVACY CONTROLS BOOK */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Your Permission Settings</h3>
          
          {patientRecords.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border bg-white shadow-sm transition flex flex-col justify-between gap-3 ${
                item.status === 'Active' ? 'border-slate-200' : 'border-amber-200 bg-amber-50/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Digital Lab Report Delivery</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Allow City Hospital to automatically send diagnostic files and prescriptions directly to your mobile via SMS or secure web folders.
                  </p>
                </div>
                
                {/* Large Status indicator icon badges */}
                <span className="shrink-0">
                  {item.status === 'Active' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600" />
                  )}
                </span>
              </div>

              {/* ACTION TOGGLE ACTION BUTTON ELEMENT */}
              <button
                onClick={() => handlePatientTogglePermission(item.id, item.status, "Digital Lab Report Delivery")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-sm border ${
                  item.status === 'Active'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                    : 'bg-teal-600 hover:bg-teal-500 text-white border-transparent'
                }`}
              >
                {item.status === 'Active' ? "Stop Sharing My Reports (Opt-Out)" : "Allow Hospital to Share Reports"}
              </button>
            </div>
          ))}
        </div>

        {/* SECTION 2: MEDICAL FILE REPOSITORY CABINET */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Your Secure Medical Files</h3>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {patientReports.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 font-medium">No medical files have been shared with you yet.</p>
            ) : (
              patientReports.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{report.test}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Received: {report.sent}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Opening File Window: Render Secure Viewing Stream for [${report.test}]`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg border border-transparent shadow-sm transition"
                  >
                    Open File
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footnote seal signature confirmation */}
        <p className="text-center text-[10px] font-medium text-slate-400 leading-normal max-w-xs mx-auto px-4">
          Protected by India's DPDP Act 2023. You own your health data and can withdraw your consent at any time.
        </p>

      </div>
    </div>
  );
}
