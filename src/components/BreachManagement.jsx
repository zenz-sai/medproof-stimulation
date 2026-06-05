import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { AlertTriangle, Clock, Users, FileSpreadsheet, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BreachManagement() {
  const { breachState, setActivities, consents } = useData();
  const [activeStep, setActiveStep] = useState(1);
  const [incidentType, setIncidentType] = useState('Physical Document Loss');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [countdownText, setCountdownText] = useState('72:00:00');
  const [showDpbModal, setShowDpbModal] = useState(false);
  const [dpbReceipt, setDpbReceipt] = useState(null);

  // Calculate total active patients to notify in a simulation match
  const affectedCount = consents.filter(c => c.status === 'Active').length + 42; 

  // Simulate a live counting clock ticking downwards if the incident flag is active
  useEffect(() => {
    let interval = null;
    if (breachState.active) {
      interval = setInterval(() => {
        // Mock a steadily declining 72-hour tracker window matrix (71 hours, 54 mins, etc.)
        const hours = 71;
        const mins = Math.max(0, 54 - Math.floor((Date.now() % 60000) / 1000));
        const secs = 60 - (Math.floor(Date.now() / 1000) % 60);
        setCountdownText(`${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      setCountdownText('72:00:00');
      setActiveStep(1);
    }
    return () => clearInterval(interval);
  }, [breachState.active]);

  // Step 2 Action: Send standardized legally valid bulk SMS/Email packets
  const handleBulkNotifyPatients = () => {
    setActiveStep(3);
    setActivities(prev => [{
      id: Date.now(),
      user: "System Gate",
      action: `Emergency: Dispatched ${affectedCount} DPDP compliance safety notices automatically via SMS channel`,
      time: 'Just now'
    }, ...prev]);
  };

  // Step 3 Action: Build final regulatory inspector filing artifact with digital lock hashes
  const handleCompileDpbReport = async () => {
    const reportMetadata = {
      facilityNode: "CITY-HOSP-FDU",
      incidentCategory: incidentType,
      narrativeSummary: incidentDetails || "Standard localized physical document movement anomaly",
      remediationNoticeCount: affectedCount,
      complianceTimeline: "Verified within the 72-hour mandate window"
    };

    const cryptoProof = await generateMOIProof(reportMetadata);
    setDpbReceipt({
      lockHash: cryptoProof.kapsulRoot,
      nodeSignature: cryptoProof.nodeSignature,
      timestamp: cryptoProof.blockTimestamp
    });
    setShowDpbModal(true);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-900">
      
      {/* SECTION HUB HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Breach Notification Engine</h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated checklist to manage data security events smoothly and meet legal compliance timelines under the DPDP Act.
        </p>
      </div>

      {/* CONDITIONAL LAYOUT VIEW: SYSTEM IS COMPLETELY CLEAN STATE */}
      {!breachState.active ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">All Systems Clear</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              No active security incidents have been reported. The hospital is fully compliant, and all patient consent and report delivery records are locked safely.
            </p>
          </div>
          <div className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-3 rounded-md inline-block">
            Last automated system sweep completed: Just Now
          </div>
        </div>
      ) : (
        
        /* ACTIVE CRISIS MANAGEMENT WORKFLOW INTERFACE LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2-COLUMN FLOW PROGRESS MODULES */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PROTOCOL STEP SECTIONS BAR TRACKER */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center text-xs text-slate-400 font-bold">
              <span className={`px-3 py-1 rounded-md ${activeStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}>1. Incident Logged</span>
              <span className="text-slate-300">➔</span>
              <span className={`px-3 py-1 rounded-md ${activeStep === 2 ? 'bg-slate-900 text-white' : activeStep > 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50'}`}>2. Patient Alerts</span>
              <span className="text-slate-300">➔</span>
              <span className={`px-3 py-1 rounded-md ${activeStep === 3 ? 'bg-slate-900 text-white' : 'bg-slate-50'}`}>3. Board Report</span>
            </div>

            {/* STEP 1 BLOCK: DETAILS ENTRY REVIEW */}
            {activeStep === 1 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Step 1: Incident Log Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Review the type of incident being logged into your safety history ledger.</p>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Incident Category Type</label>
                    <select 
                      value={incidentType} onChange={e => setIncidentType(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                    >
                      <option value="Physical Document Loss">Loss of Physical Patient Folder or Registration Binder</option>
                      <option value="Staff Device Anomaly">Misplaced Mobile Device Containing Laboratory Contact Lists</option>
                      <option value="Unauthorized Access Attempt">External IT Network Query Anomaly Detected & Blocked</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Brief Descriptive Notes (For Internal Legal Defense Files)</label>
                    <textarea 
                      placeholder="Describe what happened clearly (e.g., Staff smartphone used for delivery logistics lost in outpatient lounge)..."
                      value={incidentDetails} onChange={e => setIncidentDetails(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none h-24 text-xs resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button" onClick={() => setActiveStep(2)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Proceed to Patient Safety Notification Step
                </button>
              </div>
            )}

            {/* STEP 2 BLOCK: RUNNING BULK PACIFICATION OUTREACH DISPATCH */}
            {activeStep === 2 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Step 2: Dispatch Emergency Patient Alerts</h3>
                    <p className="text-xs text-slate-400 mt-0.5">The DPDP Act requires the hospital to alert all affected individuals without delay.</p>
                  </div>
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {affectedCount} Contacts Flagged
                  </span>
                </div>

                {/* Plain-text template lookup wrapper box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Standard Legally Approved SMS Template</span>
                  <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                    "Notice from City Hospital: A security issue has been logged regarding localized contact datasets. Your private medical reports remain fully locked down and secure. We are taking all necessary protective steps in line with DPDP Act standards."
                  </p>
                </div>

                <button
                  type="button" onClick={handleBulkNotifyPatients}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <span>Transmit Digital Alerts to All Affected Patients</span>
                </button>
              </div>
            )}

            {/* STEP 3 BLOCK: ARTIFACT FILE EXPORT WRAPPER */}
            {activeStep === 3 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Patient Safety Alerts Dispatched</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    All safety notices have been sent, and the timestamped proof for each contact has been secured on your server node.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button" onClick={handleCompileDpbReport}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                    <span>Compile & Download Data Protection Board Report</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT CRITICAL COUNTDOWN TIMEPIECE SCORECARD TRACKER */}
          <div className="bg-rose-950/90 border border-rose-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 animate-spin" />
                <span>DPDP Compliance Deadline Clock</span>
              </div>
              <h3 className="text-5xl font-black text-white font-mono tracking-tight pt-2">{countdownText}</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed pt-1">
                The law requires full documentation and patient notification within <strong>72 hours</strong> of discovering an incident. MedProof locks down your timeline automatically to prove compliance.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-rose-900/60 text-xs text-rose-100 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-rose-300">Incident Logged At:</span>
                <span className="font-mono font-semibold">{breachState.timestamp || "14:32:01"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-rose-300">Current Status:</span>
                <span className="text-emerald-400 font-bold">✓ Workflow Documented</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* REGULATORY COMPLIANCE OFFICIAL DATA PRESENTATION BOX REPORT OVERLAY */}
      {showDpbModal && dpbReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-lg w-full font-sans text-slate-800">
            
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Official Data Protection Board Filing Report</span>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <p className="text-slate-500 text-[11px]">
                This encrypted filing includes complete timeline logs and notification receipts, ready to be submitted to the Data Protection Board (DPB) during an inspection.
              </p>
              
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700">
                <p><span className="text-slate-400 font-sans font-bold">Fiduciary Source ID:</span> CITY-HOSP-FDU</p>
                <p><span className="text-slate-400 font-sans font-bold">Logged Event Class:</span> {incidentType}</p>
                <p><span className="text-slate-400 font-sans font-bold">Safety Notices Sent:</span> {affectedCount} Verified SMS Packets</p>
                <p><span className="text-slate-400 font-sans font-bold">Timeline Status:</span> 100% Compliant (Filed within 1 Hour)</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Tamper-Proof Audit Lock Hash:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 break-all select-all mt-1">{dpbReceipt.lockHash}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-4">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Filing Handshake Time:</span>
                  <p className="text-slate-700 font-semibold mt-0.5">{dpbReceipt.timestamp}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Legal Verification Status:</span>
                  <p className="text-emerald-600 font-bold mt-0.5">✓ Protected & Safe</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { setShowDpbModal(false); setActiveStep(1); }}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              Close Filing Document Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
