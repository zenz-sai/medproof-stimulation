import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import DashboardLayout from './components/DashboardLayout';
import HospitalDashboard from './components/HospitalDashboard';
import ConsentCollection from './components/ConsentCollection';
import ReportDelivery from './components/ReportDelivery';
import BreachManagement from './components/BreachManagement';
import PatientPortal from './components/PatientPortal';
import { Shield, Search, Lock, Loader2, ShieldAlert, Clock } from 'lucide-react';

function AppContent() {
  const { currentSession, setCurrentSession } = useData();
  const [currentTab, setTab] = useState('dashboard');
  
  // Login component interface states
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPatientRoute, setIsPatientRoute] = useState(false);

  // Parse address bar route parameters immediately on launch
  useEffect(() => {
    if (window.location.pathname === '/user' || window.location.search.includes('access=')) {
      setIsPatientRoute(true);
    }
  }, []);

  const facilitiesList = [
    { id: 'city', name: 'City Community Hospital', location: 'Coimbatore, South India', tier: 'Small Hospital', baseConsents: 1243 },
    { id: 'alpha', name: 'Alpha Reference Diagnostic Labs', location: 'Tier-2 Main Hub', tier: 'Diagnostic Lab', baseConsents: 4890 },
    { id: 'apollo-smb', name: 'MedTrust Nursing Home & Clinic', location: 'Trichy Region', tier: 'Clinic', baseConsents: 312 }
  ];

  const filteredFacilities = facilitiesList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedFacility || !password) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      const sessionPayload = {
        role: selectedFacility.id === 'city' ? 'hospital' : 'lab',
        name: selectedFacility.name,
        tier: selectedFacility.tier,
        location: selectedFacility.location,
        baseConsents: selectedFacility.baseConsents
      };
      setCurrentSession(sessionPayload);
      setIsAuthenticating(false);
    }, 2000);
  };

  const handleLogout = () => {
    setCurrentSession(null);
    setSelectedFacility(null);
    setPassword('');
    setSearchQuery('');
  };

  // --- RENDERING ROUTE: ISOLATED PATIENT TAB VIEW ---
  if (isPatientRoute) {
    return <PatientPortal />;
  }

  // --- RENDERING ROUTE: SYSTEM PORTAL LANDING ENTRY SCREEN ---
  if (!currentSession) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100 overflow-x-hidden">
        <div className="w-full md:w-[45%] bg-slate-900 flex flex-col justify-between p-8 border-r border-slate-800/60 shadow-2xl min-h-screen">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase block">Secure Gateway</span>
              <h2 className="text-sm font-bold text-white m-0">MedProof Decentralized Access</h2>
            </div>
          </div>

          <div className="max-w-sm w-full mx-auto space-y-6 py-12">
            <div className="space-y-1.5 text-left">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Facility Sign In</h1>
              <p className="text-xs text-slate-400 leading-relaxed">Select your medical facility node to open your dashboard.</p>
            </div>

            <div className="space-y-4">
              <div className="text-left relative space-y-1">
                <label className="text-xs font-bold text-slate-400">Search Facility or Laboratory Hub</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    disabled={isAuthenticating}
                    placeholder="Type name (e.g., City, Alpha...)"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {isDropdownOpen && searchQuery !== '' && (
                  <div className="absolute z-50 w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                    {filteredFacilities.map(f => (
                      <button
                        key={f.id} type="button" onClick={() => { setSelectedFacility(f); setSearchQuery(f.name); setIsDropdownOpen(false); }}
                        className="w-full text-left p-3 hover:bg-slate-900 transition flex flex-col"
                      >
                        <span className="text-xs font-bold text-white">{f.name}</span>
                        <span className="text-[10px] text-slate-500">{f.tier} • {f.location}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedFacility && (
                <form onSubmit={handleLogin} className="space-y-4 text-left animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Enter Node Authorization Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password" required disabled={isAuthenticating} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black tracking-widest text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isAuthenticating}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg transition uppercase tracking-wide flex items-center justify-center space-x-2"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Node Keys...</span>
                      </>
                    ) : (
                      <span>Unlock System Ledger Dashboard</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider text-center">
            ✓ Connected to MOI Node Trust Infrastructure
          </div>
        </div>

        {/* RIGHT PANEL: INFO ACCREDITATION BRAND WALL */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />
          
          <div className="grid grid-cols-2 gap-6 relative z-10 text-left">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm space-y-1">
              <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider block">The DPDP Mandate 2023</span>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Every single healthcare facility is now legally classified as a <strong>'Data Fiduciary'</strong>, facing fines up to <strong className="text-white font-bold">₹250 Crore</strong> for data mishandling errors.
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm space-y-1">
              <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider block">Compliance Countdown</span>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                India's formal privacy enforcement implementation window ends exactly in <strong className="text-white font-bold">May 2027</strong>. No legal exemptions or extensions are available.
              </p>
            </div>
          </div>

          <div className="max-w-xl text-left space-y-4 relative z-10 my-auto py-12">
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              The Simple, Tamper-Proof Solution for India's 150,000+ SMB Healthcare Facilities.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              MedProof bridges the technical execution gap for small hospitals and diagnostics labs. By managing <strong>Consent Management</strong>, <strong>Report Delivery</strong>, and <strong>Breach Notifications</strong> inside decentralized, hospital-controlled node frameworks, we deliver total legal protection with everyday simplicity.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 relative z-10 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Total Target Addressable Market</span>
              <strong className="text-xl font-black text-white block mt-0.5">272,000+</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Serviceable SMB Segment</span>
              <strong className="text-xl font-black text-teal-400 block mt-0.5">72,000+</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Financial Projections Target</span>
              <strong className="text-xl font-black text-white block mt-0.5">₹54 Crore ARR</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout currentTab={currentTab} setTab={setTab} onLogout={handleLogout}>
      {currentTab === 'dashboard' && <HospitalDashboard />}
      {currentTab === 'consent' && <ConsentCollection />}
      {currentTab === 'reports' && <ReportDelivery />}
      {currentTab === 'breach' && <BreachManagement />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
