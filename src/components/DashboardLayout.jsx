import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Shield, LayoutDashboard, FileCheck, Send, AlertOctagon, Terminal, LogOut, RotateCcw } from 'lucide-react';

export default function DashboardLayout({ currentTab, setTab, children, onLogout }) {
  const { breachState, currentSession, triggerSimulationAction } = useData();
  const [showInspector, setShowInspector] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'consent', name: 'Consent Collection', icon: FileCheck },
    { id: 'reports', name: 'Report Delivery', icon: Send },
    { id: 'breach', name: 'Breach Notification', icon: AlertOctagon },
  ];

  const handleSystemReset = () => {
    if (window.confirm("Are you sure you want to restore the demonstration data back to its initial default values?")) {
      triggerSimulationAction('CLEAR_ALL');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex font-sans overflow-x-hidden">
      
      {/* SIDEBAR NAVIGATION FRAMEWORK CONTAINER */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-950 shadow-xl">
        <div className="p-5 flex items-center space-x-3 bg-slate-950">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-sm tracking-tight text-white truncate max-w-[160px]">
              {currentSession ? currentSession.name : "Facility Node"}
            </h1>
            <span className="text-[10px] font-bold tracking-wider uppercase text-teal-400">
              {currentSession ? currentSession.tier : "DPDP Compliance"}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 bg-slate-900/40">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-700/20' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM UTILITY ACTIONS FOOTER BLOCK */}
        <div className="bg-slate-950 border-t border-slate-900 divide-y divide-slate-900/60">
          
          {/* Environment Reset Bar */}
          {/* <div className="p-2.5 flex justify-center">
            <button
              onClick={handleSystemReset}
              className="w-full flex items-center justify-center space-x-1.5 py-2 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-lg text-slate-400 hover:text-white text-[11px] font-bold transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-500" />
              <span>Reset Demo Database</span>
            </button>
          </div> */}

          {/* Session Metadata Info & Exit Node */}
          <div className="p-3 flex items-center justify-between">
            <div className="text-[9px] font-mono font-semibold text-slate-500 truncate max-w-30">
              {currentSession ? currentSession.location : "Node: Active"}
            </div>
            <button 
              onClick={() => {
                handleSystemReset();
                onLogout()
              }}
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 rounded-lg text-slate-400 hover:text-rose-400 text-[10px] font-bold transition"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS HEADER AND CORE VIEWPORTS AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight capitalize">{currentTab} Hub</h2>
            {breachState.active && (
              <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] text-rose-600 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>DPDP 72H Window Active</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition"
          >
            <Terminal className="w-3.5 h-3.5 text-teal-600" />
            <span>{showInspector ? "Hide Monitor" : "Open Monitor"}</span>
          </button>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-full">
          {children}
        </div>

        {/* Live Trail Streams Panel Drawer */}
        {showInspector && (
          <div className="absolute right-0 top-16 bottom-0 w-80 bg-slate-900 text-slate-200 p-5 font-sans text-xs overflow-y-auto shadow-2xl z-30 border-l border-slate-950">
            <h3 className="text-teal-400 font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2 mb-3 flex items-center space-x-1.5">
              <Terminal className="w-4 h-4" />
              <span>Ledger Monitor</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
              Session payload credentials trace.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              <p className="text-emerald-400">// Handshake Authorized</p>
              <p>Issuer: {currentSession ? currentSession.name : "Unknown"}</p>
              <p>Tier_Class: {currentSession ? currentSession.tier : "Default"}</p>
              <p>Node_Status: SECURE_CONNECTED</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
