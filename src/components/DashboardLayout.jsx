import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Shield, LayoutDashboard, FileCheck, Send, AlertOctagon, Terminal, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardLayout({ currentTab, setTab, children }) {
  const { breachState, triggerSimulationAction } = useData();
  const [showInspector, setShowInspector] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'consent', name: 'Consent Collection', icon: FileCheck },
    { id: 'reports', name: 'Report Delivery', icon: Send },
    { id: 'breach', name: 'Breach Notification', icon: AlertOctagon },
  ];

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex font-sans overflow-x-hidden">
      
      {/* SIDEBAR NAVIGATION FRAMEWORK */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-950 shadow-xl">
        <div className="p-5 flex items-center space-x-3 bg-slate-950">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl">
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight text-white">MedProof</h1>
            <span className="text-[10px] font-bold tracking-wider uppercase text-teal-400">DPDP Compliance</span>
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

        <div className="p-4 bg-slate-950 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 border-t border-slate-900">
          Facility Node Active
        </div>
      </aside>

      {/* EXPANSIVE MAIN WINDOW VIEW CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight capitalize">{currentTab} Operations Hub</h2>
            {breachState.active && (
              <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] text-rose-600 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>DPDP 72H Alert Window Active</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition"
          >
            <Terminal className="w-3.5 h-3.5 text-teal-600" />
            <span>{showInspector ? "Hide Security Monitor" : "Open Security Monitor"}</span>
          </button>
        </header>

        {/* VIEW BODY CORE CONTAINER */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-full">
          {children}
        </div>

        {/* ACCESSIBLE INTERACTIVE DEMO CONTROLLER */}
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 p-4 rounded-xl shadow-2xl w-72 font-sans">
          <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1.5 text-teal-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Quick Controls</span>
            </div>
            <button 
              onClick={() => triggerSimulationAction('CLEAR_ALL')} 
              title="Reset data back to original default layout values"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
            Use these quick test triggers to simulate real-world workflow actions and see how the dashboard updates immediately.
          </p>

          <div className="space-y-1.5 text-xs">
            <button 
              onClick={() => triggerSimulationAction('WITHDRAW_PRIYA')}
              className="w-full text-left px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg transition flex items-center justify-between"
            >
              <span>Patient withdraws consent</span>
              <span className="text-[9px] px-1 bg-amber-100 text-amber-800 rounded font-bold">Portal Link</span>
            </button>
            <button 
              onClick={() => triggerSimulationAction('SIMULATE_BATCH_LAB')}
              className="w-full text-left px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg transition flex items-center justify-between"
            >
              <span>Receive bulk lab reports</span>
              <span className="text-[9px] px-1 bg-teal-100 text-teal-800 rounded font-bold">Lab System</span>
            </button>
            <button 
              onClick={() => triggerSimulationAction('BREACH_TRIGGER')}
              className="w-full text-left px-2.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-semibold rounded-lg transition flex items-center justify-between"
            >
              <span>Trigger sample system threat</span>
              <span className="text-[9px] px-1 bg-rose-600 text-white rounded font-bold">Alert</span>
            </button>
          </div>
        </div>

        {/* CLEAN BACKEND AUDIT TRAILS EXPLANATION PANEL */}
        {showInspector && (
          <div className="absolute right-0 top-16 bottom-0 w-80 bg-slate-900 text-slate-200 p-5 font-sans text-xs overflow-y-auto shadow-2xl z-30 border-l border-slate-950">
            <h3 className="text-teal-400 font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2 mb-3 flex items-center space-x-1.5">
              <Terminal className="w-4 h-4" />
              <span>Live System Security Stream</span>
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
              This panel shows the underlying data confirmations that the hospital system creates automatically behind the scenes to lock your audit history.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              <p className="text-emerald-400">// Local Security Status</p>
              <p>Node_Status: ONLINE</p>
              <p>Active_Breach_Alerts: {breachState.active ? "YES" : "NO"}</p>
              <p className="text-slate-500 mt-2">// Internal Security Buffer</p>
              <p>Consent_Logs: 4 active</p>
              <p>Delivery_Receipts: 4 locked</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
