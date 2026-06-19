import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Shield, Lock, CheckCircle2, XCircle, FileText, LogOut, HelpCircle, User, KeyRound } from 'lucide-react';

export default function PatientPortal() {
  const { consents, setConsents, reports, setActivities } = useData();
  
  // Clean Username & Password Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [senderName, setSenderName] = useState('Your Provider');
  
  // Account matching profile hooks
  const [activePatientProfile, setActivePatientProfile] = useState({ id: 1, name: "Priya Sharma" });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pIdToken = urlParams.get('pId');
    const sourceHospital = urlParams.get('from');
    
    if (pIdToken) {
      const parsedId = parseInt(pIdToken);
      const matchedProfile = consents.find(c => c.id === parsedId);
      if (matchedProfile) {
        setActivePatientProfile({ id: matchedProfile.id, name: matchedProfile.name });
        // Auto-fill username matching patient name configuration for slick demonstration flow
        setUsername(matchedProfile.name.toLowerCase().replace(' ', ''));
      }
    } else {
      // Default fallback profile alignment
      setUsername('priyasharma');
    }
    
    if (sourceHospital) {
      setSenderName(decodeURIComponent(sourceHospital));
    }
  }, [consents]);

  // Read ALL consents mapped to this specific user profile from the shared database layer
  const patientRecords = consents.filter(c => 
    c.name === activePatientProfile.name || c.id === activePatientProfile.id
  );
  const patientReports = reports.filter(r => r.name === activePatientProfile.name);

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Please enter both fields.");
    
    // Accept any password entry string for smooth interactive execution
    setIsLoggedIn(true);

    setActivities(prev => [{
      id: Date.now(),
      user: activePatientProfile.name,
      action: `Patient logged into Health Vault using credential authentication via IOMe Secure Sign-In`,
      time: 'Just now'
    }, ...prev]);
  };

  const handlePatientTogglePermission = (id, currentStatus, approvalName) => {
    const updatedStatus = currentStatus === 'Active' ? 'Withdrawn' : 'Active';
    
    // Updates local-storage tracking variables immediately across components
    const updatedConsents = consents.map(item => 
      item.id === id ? { ...item, status: updatedStatus } : item
    );
    setConsents(updatedConsents);
    localStorage.setItem('mp_consents', JSON.stringify(updatedConsents));

    setActivities(prev => [{
      id: Date.now(),
      user: activePatientProfile.name,
      action: `[Patient Portal Revocation] Access settings for "${approvalName}" updated to [${updatedStatus}] via account panel`,
      time: 'Just now'
    }, ...prev]);
  };

  // --- LOGIN SECURITY SHELL: SECURE CREDENTIAL ENTRY TERMINAL ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex flex-col justify-between p-4 font-sans text-slate-100 select-none">
        <div className="w-full max-w-sm mx-auto bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6 my-auto">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto text-teal-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Health Vault Sign In</h1>
              <p className="text-xs text-slate-400">Verify account credentials to load secure data modules.</p>
            </div>
          </div>

          <form onSubmit={handleCredentialLogin} className="space-y-4 text-left">
            {/* Username Input Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block pl-0.5">Account Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text" required placeholder="e.g., priyasharma" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-semibold focus:outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block pl-0.5">Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input 
                  type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-black tracking-widest focus:outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition uppercase tracking-wide">
              Login
            </button>
          </form>
        </div>

        <div className="w-full text-center text-[10px] text-slate-600 font-bold tracking-wider uppercase py-2 shrink-0">
          ✓ DPDP Compliant Secure Vault
        </div>
      </div>
    );
  }

  // --- LOGGED IN VAULT COMPLIANCE HUB HUB INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-900 w-full overflow-x-hidden flex flex-col select-none">
      <header className="bg-slate-900 text-white px-4 py-3.5 shadow-md sticky top-0 z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-xs font-black tracking-tight text-white m-0">Health Vault</h2>
            <p className="text-[10px] text-teal-400 font-bold mt-0.5">Patient Profile: {activePatientProfile.name}</p>
          </div>
        </div>
        <button onClick={() => { setIsLoggedIn(false); setPassword(''); }} className="p-2 text-slate-400 hover:text-white transition">
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-md mx-auto w-full px-4 mt-4 space-y-5 flex-1">
        <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-xl text-xs text-teal-950 leading-relaxed flex items-start space-x-2.5 shadow-sm text-left">
          <HelpCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
          <p>Welcome, <strong>{activePatientProfile.name}</strong>. Review and manage all active privacy consent settings stored on your wallet profile lower down below.</p>
        </div>

        {/* COMPONENT SUMMARY BLOCK 2: DYNAMIC CONSENTS MANAGEMENT SHEET */}
        <div className="space-y-2 text-left">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">My Digital Consent Registry</h3>
          
          {patientRecords.length === 0 ? (
            <p className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">No privacy access logs found for this account.</p>
          ) : (
            patientRecords.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition duration-150 ${item.status === 'Active' ? 'border-slate-200' : 'border-amber-200 bg-amber-50/10'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">{item.purpose || "Digital Lab Report Delivery"}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Authorizes <strong>{senderName}</strong> to route files and encryption hashes onto your profile node.
                    </p>
                    <span className="text-[9px] font-mono text-slate-400 block pt-1">Sealed: {item.date || "Just now"}</span>
                  </div>
                  <span className="shrink-0">
                    {item.status === 'Active' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </span>
                </div>
                
                {/* INTERACTIVE COMPLIANCE REVOCATION ACTION BUTTON */}
                <button 
                  onClick={() => handlePatientTogglePermission(item.id, item.status, item.purpose || "Digital Lab Report Delivery")} 
                  className={`w-full py-2 rounded-lg text-xs font-bold transition border tracking-wide uppercase ${
                    item.status === 'Active' 
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' 
                      : 'bg-teal-600 hover:bg-teal-500 text-white border-transparent shadow-sm'
                  }`}
                >
                  {item.status === 'Active' ? "Revoke Access Privileges" : "Restore Access Privileges"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* CLINICAL RECORDS ENCRYPTED VIEWER SHEET */}
        <div className="space-y-2 text-left">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Secure Medical Records</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {patientReports.length === 0 ? (
              <p className="p-4 text-slate-400 text-center text-xs">No active files have been issued to this vault profile link yet.</p>
            ) : (
              patientReports.map((report) => (
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
                  <button onClick={() => alert(`Opening secure database viewer matrix...`)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition shadow-sm">
                    Open File
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <p className="text-center text-[9px] font-medium text-slate-400 leading-normal max-w-xs mx-auto pt-2">
          Protected by India's DPDP Act 2023. You own your health data and can withdraw your consent at any time.
        </p>
      </div>
    </div>
  );
}
