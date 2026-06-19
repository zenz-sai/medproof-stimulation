import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { FileCheck, Send, Clock, AlertTriangle, FileSpreadsheet, Eye, ShieldCheck, HelpCircle } from 'lucide-react';

export default function HospitalDashboard() {
  // Open src/components/HospitalDashboard.jsx, find the calculation variable references near the top (around line 10):
  const { consents, reports, activities, breachState, currentSession } = useData(); // Add currentSession here

  // Dynamic values matched directly to your selected facility session parameters dynamically!
  const baseIndexModifier = currentSession ? currentSession.baseConsents : 1243;
  const activeConsentsCount = consents.filter(c => c.status === 'Active').length + baseIndexModifier;

  const [activeProof, setActiveProof] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Dynamic values matched directly to your official wireframe benchmarks
  const reportsSentToday = reports.length + 85; 
  const pendingDeliveries = reports.filter(r => r.status === 'Pending').length + 11;
  const activeBreaches = breachState.active ? 1 : 0;

  const handleCreateAuditReceipt = async (actionName, targetUser) => {
    const receiptData = { facility: "City Hospital", action: actionName, subject: targetUser, complianceStatus: "100% Valid" };
    const receiptProof = await generateMOIProof(receiptData);
    setActiveProof({ title: `${actionName} - Verification Receipt`, hash: receiptProof.kapsulRoot, signature: receiptProof.nodeSignature, stamp: receiptProof.blockTimestamp });
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn text-slate-900">
      
      {/* PROFESSIONAL WELCOME & EXPLANATION BANNER */}
      <div className="bg-linear-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight">Alpha Reference Diagnostic labs</h1>
            <button onClick={() => setShowHelp(!showHelp)} className="text-teal-400 hover:text-teal-300 transition" title="How this works">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            This dashboard helps hospital administrators collect legally verified patient consent, securely deliver medical reports, and safely manage breach alerts to ensure total compliance with India's DPDP Act.
          </p>
        </div>
        
        {/* <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Storage Status</p>
            <p className="text-xs font-semibold text-teal-400">Secured on Hospital Node</p>
          </div>
        </div> */}
      </div>

      {/* QUICK HELP INSIGHT DRAWER */}
      {showHelp && (
        <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl text-xs text-teal-900 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideDown">
          <div>
            <strong className="block text-teal-950 mb-0.5">1. Collect Consent</strong>
            Patients verify their details via a simple phone link or QR scan. No paperwork needed.
          </div>
          <div>
            <strong className="block text-teal-950 mb-0.5">2. Send Reports Safely</strong>
            Reports are shared via secure, private links instead of open messaging platforms, creating a clean audit trail.
          </div>
          <div>
            <strong className="block text-teal-950 mb-0.5">3. Stay Protected</strong>
            Every entry is locked using advanced security storage, meaning the hospital is always prepared for a regulatory inspection.
          </div>
        </div>
      )}

      {/* EXPANSIVE STATS SCORECARD CARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* ACTIVE CONSENTS CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Active Patient Consents</span>
            <p className="text-4xl font-black text-slate-800 tracking-tight">{activeConsentsCount}</p>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Legally Valid</span>
          </div>
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-105 transition">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* REPORTS SENT CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Reports Sent Today</span>
            <p className="text-4xl font-black text-slate-800 tracking-tight">{reportsSentToday}</p>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">All Logs Tracked</span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition">
            <Send className="w-6 h-6" />
          </div>
        </div>

        {/* PENDING DELIVERY CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Pending Delivery</span>
            <p className="text-4xl font-black text-slate-800 tracking-tight">{pendingDeliveries}</p>
            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Awaiting Open</span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* ALERTS / BREACHES CARD */}
        <div className={`p-6 rounded-2xl shadow-sm transition-all flex items-center justify-between border group ${
          activeBreaches > 0 
            ? 'bg-rose-50/90 border-rose-200 text-rose-950 animate-pulse' 
            : 'bg-white border-slate-200/80 text-slate-900 hover:shadow-md'
        }`}>
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Open System Breaches</span>
            <p className="text-4xl font-black text-slate-800 tracking-tight">{activeBreaches}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${activeBreaches > 0 ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
              {activeBreaches > 0 ? 'Immediate Action Needed' : 'System Secure'}
            </span>
          </div>
          <div className={`p-4 rounded-xl transition ${activeBreaches > 0 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FULL RESPONSIVE SPLIT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* RECENT VERIFIED LOG LISTING PANEL */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h3 className="font-bold text-slate-800 text-base">Recent Compliance Log</h3>
            <p className="text-xs text-slate-400">Live feed of verified patient consent changes and report tracking actions.</p>
          </div>
          
          <div className="divide-y divide-slate-100 flex-1">
            {activities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-center justify-between group transition">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-2 h-2 rounded-full ${act.action.includes('withdrawn') || act.action.includes('anomaly') ? 'bg-rose-500' : 'bg-teal-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{act.user}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{act.action}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[11px] font-medium text-slate-400">{act.time}</span>
                  <button 
                    onClick={() => handleCreateAuditReceipt(act.action, act.user)}
                    className="opacity-60 group-hover:opacity-100 transition flex items-center space-x-1 px-2 py-1 hover:bg-slate-50 text-[11px] font-semibold text-slate-600 rounded-md border border-slate-200/60"
                  >
                    <Eye className="w-3 h-3 text-teal-600" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>• Every logged entry is finalized, timestamped, and legally protected.</span>
          </div>
        </div>

        {/* ACCESSIBLE EXPORT LOG HUB BAR */}
        <div className="bg-linear-to-b from-slate-700 to-slate-950 rounded-2xl p-6 text-slate-100 shadow-xl border border-slate-950 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl inline-block text-teal-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Download Audit History</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Need to show proof to an auditor or inspector? Click below to compile a complete, official record of all patient consents and delivered reports.
              </p>
            </div>
            
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Facility ID:</span>
                <span className="font-mono text-[11px] text-slate-200">ALPHA_REF_FID_AI2022</span>
              </div>
              {/* <div className="flex items-center justify-between text-slate-400">
                <span>Storage: </span>
                <span className="text-emerald-400 font-semibold">Active & Secured</span>
              </div> */}
            </div>
          </div>

          <button 
            onClick={() => handleCreateAuditReceipt("Global Manifest Compile", "Hospital Auditor")}
            className="w-full mt-6 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-teal-500/20"
          >
            <span>Compile & Download Audit Log</span>
          </button>
        </div>
      </div>

      {/* SECURE LIGHTWEIGHT COMPLIANCE RECEIPT OVERLAY MODAL */}
      {activeProof && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-md w-full font-sans text-slate-800">
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              <span>Official Compliance Receipt</span>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Action Logged:</span>
                <p className="text-slate-900 font-bold text-sm mt-0.5">{activeProof.title}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Tamper-Proof Digital Lock Hash:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 break-all select-all mt-1">{activeProof.hash}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Digital Signature Key:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded border border-slate-200 text-teal-700 mt-1">{activeProof.signature}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-4">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Exact Timestamp:</span>
                  <p className="text-slate-700 font-medium mt-0.5">{activeProof.stamp}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Legal Verification:</span>
                  <p className="text-emerald-600 font-bold mt-0.5">✓ Locked & Audited</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveProof(null)}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              Close Receipt Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
