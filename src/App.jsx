import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import DashboardLayout from './components/DashboardLayout';
import HospitalDashboard from './components/HospitalDashboard';
import ConsentCollection from './components/ConsentCollection';
import ReportDelivery from './components/ReportDelivery';
import BreachManagement from './components/BreachManagement';
import PatientPortal from './components/PatientPortal';
import { Shield, Search, Lock, ShieldAlert, Loader2, Landmark, CheckCircle, Clock } from 'lucide-react';

function AppContent() {
  const { currentSession, setCurrentSession } = useData();
  const [currentTab, setTab] = useState('dashboard');
  
  // Login flow states
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Available healthcare facilities database (Patient removed completely)
  const facilitiesList = [
    { id: 'city', name: 'City Community Hospital', location: 'Coimbatore, South India', tier: 'Small Hospital', baseConsents: 1243 },
    { id: 'alpha', name: 'Alpha Reference Diagnostic Labs', location: 'Tier-2 Main Hub', tier: 'Diagnostic Lab', baseConsents: 4890 },
    { id: 'apollo-smb', name: 'MedTrust Nursing Home & Clinic', location: 'Trichy Region', tier: 'Clinic', baseConsents: 312 },
    { id: 'care-labs', name: 'CareFirst Scan & Imaging Center', location: 'Salem Station', tier: 'Diagnostic Lab', baseConsents: 1675 }
  ];

  // Path detector for isolated patient window tabs
  useEffect(() => {
    if (window.location.pathname === '/user') {
      setCurrentSession({ role: 'patient', name: 'Priya Sharma' });
    }
  }, [setCurrentSession]);

  const filteredFacilities = facilitiesList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setSearchQuery(facility.name);
    setIsDropdownOpen(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!selectedFacility || !password) return;

    setIsAuthenticating(true);

    // Precise 2-Second Verification Lock delay
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

  if (currentSession?.role === 'patient' || window.location.pathname === '/user') {
    return <PatientPortal />;
  }

  // --- SPLIT LANDING & LOGIN COMPONENT RENDERER ---
  if (!currentSession) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100 overflow-x-hidden">
        
        {/* LEFT PANEL: AUTHENTICATION TERMINAL */}
        <div className="w-full md:w-[45%] bg-slate-100 flex flex-col justify-between p-8 border-r border-slate-800/60 shadow-2xl relative min-h-screen">
          
          {/* Top Identity Seal */}
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" />
            {/* <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase block">Secure Gateway</span>
              <h2 className="text-sm font-bold text-white m-0">MedProof Decentralized Access</h2>
            </div> */}
          </div>

          {/* Central Security Gated Entry Form */}
          <div className="max-w-sm w-full mx-auto space-y-6 py-12">
            <div className="space-y-1.5">
              <h1 className="text-xl font-extrabold text-slate-700 tracking-tight text-left">Facility Sign In</h1>
              <p className="text-xs text-slate-400 leading-relaxed text-left">
                Select your medical facility down below to open your localized, tamper-proof DPDP ledger module.
              </p>
            </div>

            <div className="space-y-4 relative">
              
              {/* Search Dropdown Module Selection */}
              <div className="space-y-1 text-left relative">
                <label className="text-xs font-bold text-slate-400">Search Facility or Laboratory Hub</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    disabled={isAuthenticating}
                    placeholder="Type name (e.g., City, Alpha, Care...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (selectedFacility) setSelectedFacility(null);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {/* Search Dropdown Panel View */}
                {isDropdownOpen && searchQuery !== '' && (
                  <div className="absolute z-50 w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl divide-y divide-slate-900/60 max-h-48 overflow-y-auto">
                    {filteredFacilities.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500 font-medium">No certified node profiles match.</div>
                    ) : (
                      filteredFacilities.map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => handleFacilitySelect(f)}
                          className="w-full text-left p-3 hover:bg-slate-900/80 transition flex flex-col gap-0.5"
                        >
                          <span className="text-xs font-bold text-white">{f.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{f.tier} • {f.location}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Password submission form (Triggered instantly on selecting a profile) */}
              {selectedFacility && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-400">Enter Node Authorization Password</label>
                      <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">{selectedFacility.tier}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        disabled={isAuthenticating}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black tracking-widest text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    {/* <span className="text-[10px] text-slate-500 block pt-0.5">Demo simulation parameter: Type any passcode string to execute.</span> */}
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg transition tracking-wide uppercase flex items-center justify-center space-x-2 border border-teal-500/10"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Authenticating access...</span>
                      </>
                    ) : (
                      <span>Unlock Dashboard</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Security Seal */}
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider text-center">
            ✓ Powered by MOI 
          </div>
        </div>

        {/* RIGHT PANEL: PREMIUM MEDPROOF SHOWCASE PLATFORM HUB */}
        <div className="hidden md:flex flex-1 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex-col justify-between p-12 relative overflow-hidden">
          
          {/* Grid Background Aesthetic Tints */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
          
          {/* Top Fact Panel Box Row */}
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm space-y-1 text-left">
              <div className="flex items-center space-x-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">The DPDP Mandate 2023</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Every single healthcare facility is now legally classified as a <strong>'Data Fiduciary'</strong>, facing fines up to <strong className="text-white font-bold">₹250 Crore</strong> for data mishandling errors.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm space-y-1 text-left">
              <div className="flex items-center space-x-2 text-teal-400">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Compliance Countdown</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                India's formal privacy enforcement implementation window ends exactly in <strong className="text-white font-bold">May 2027</strong>. No legal exemptions or extensions are available.
              </p>
            </div>
          </div>

          {/* Center Brand Description Pitch Layout */}
          <div className="max-w-xl text-left space-y-4 relative z-10 my-auto py-12">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span>Market Product Vision</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              The Simple, Tamper-Proof Solution for India's 150,000+ SMB Healthcare Facilities.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              MedProof bridges the technical execution gap for small hospitals and diagnostics labs. By managing <strong>Consent Management</strong>, <strong>Report Delivery</strong>, and <strong>Breach Notifications</strong> inside decentralized, hospital-controlled node frameworks, we deliver total legal protection with everyday simplicity.
            </p>
            
            <blockquote className="border-l-2 border-teal-500 pl-4 text-xs italic text-teal-400 font-medium pt-0.5">
              "If you know how to operate standard WhatsApp workflows, you already possess full operational proficiency to manage MedProof."
            </blockquote>
          </div>

          {/* Bottom Hard Market Facts Metric Sheet */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 relative z-10 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Total Target Addressable Market</span>
              <strong className="text-xl font-black text-white block mt-0.5">272,000+</strong>
              <span className="text-[10px] text-slate-400 font-medium">Indian Facilities</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Serviceable SMB Segment</span>
              <strong className="text-xl font-black text-teal-400 block mt-0.5">72,000+</strong>
              <span className="text-[10px] text-slate-400 font-medium">Small Hospitals & Labs</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Financial Projections Target</span>
              <strong className="text-xl font-black text-white block mt-0.5">₹54 Crore ARR</strong>
              <span className="text-[10px] text-slate-400 font-medium">By Year 3 (&lt;3% Share)</span>
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
