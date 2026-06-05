import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { AlertTriangle, Clock, FileSpreadsheet, ShieldCheck, CheckCircle2, ShieldAlert, Radio } from 'lucide-react';

export default function BreachManagement() {
  // Pull trigger Simulation Action directly to handle native initialization inside this view
  const { breachState, triggerSimulationAction, setActivities, consents } = useData();
  const [activeStep, setActiveStep] = useState(1);
  const [incidentType, setIncidentType] = useState('Physical Document Loss');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [countdownText, setCountdownText] = useState('72:00:00');
  const [showDpbModal, setShowDpbModal] = useState(false);
  const [dpbReceipt, setDpbReceipt] = useState(null);

  const affectedCount = consents.filter(c => c.status === 'Active').length + 42; 

  // Sync downward clock increments based on global breach state criteria
  useEffect(() => {
    let interval = null;
    if (breachState.active) {
      interval = setInterval(() => {
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

  const handleBulkNotifyPatients = () => {
    setActiveStep(3);
    setActivities(prev => [{
      id: Date.now(),
      user: "System Gate",
      action: `Emergency: Dispatched ${affectedCount} DPDP compliance safety notices automatically via SMS channel`,
      time: 'Just now'
    }, ...prev]);
  };

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
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">All Security Systems Operational</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                No active security incidents or data leakage vectors have been logged. The facility is fully compliant with all patient data access protections.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-3 rounded-md inline-block">
              Last automated security shield sweep: Just Now
            </div>
          </div>

          {/* EMBEDDED DEMO SIMULATOR CONTROLLER: Clean testing panel for your presentation */}
          <div className="bg-slate-900 border border-slate-950 p-5 rounded-2xl text-slate-200 text-left space-y-3.5 shadow-xl">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Diagnostic Threat Simulator Panel</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To demonstrate how MedProof protects a hospital during an emergency, click the button below to simulate an incoming threat alert (such as a misplaced work file or lost work phone).
            </p>
            <button
              type="button"
              onClick={() => triggerSimulationAction('BREACH_TRIGGER')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition uppercase tracking-wide border border-rose-500/10"
            >
              Simulate Network Threat Event
            </button>
          </div>
        </div>
      ) : (
        
        /* ACTIVE CRISIS WORKFLOW WORKSPACE LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* PROGRESS PROTOCOLS COLUMN LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center text-xs text-slate-400 font-bold">
              <span className={`px-3 py-1 rounded-md ${activeStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}>1. Incident Logged</span>
              <span className="text-slate-300">➔</span>
              <span className={`px-3 py-1 rounded-md ${activeStep === 2 ? 'bg-slate-900 text-white' : activeStep > 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50'}`}>2. Patient Alerts</span>
              <span className="text-slate-300">➔</span>
              <span className={`px-3 py-1 rounded-md ${activeStep === 3 ? 'bg-slate-900 text-white' : 'bg-slate-50'}`}>3. Board Report</span>
            </div>

            {/* STEP 1 DETAILS VERIFICATION CARD */}
            {activeStep === 1 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Step 1: Incident Log Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Review the type of incident being logged into your safety history ledger.</p>
                </div>
                
                <div className="space-y-3 text-xs text-left">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">Incident Category Type</label>
                    <select 
                      value={incidentType} onChange={e => setIncidentType(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium focus:outline-none focus:border-slate-400"
                    >
                      <option value="Physical Document Loss">Loss of Physical Patient Folder or Registration Binder</option>
                      <option value="Staff Device Anomaly">Misplaced Mobile Device Containing Laboratory Contact Lists</option>
                      <option value="Unauthorized Access Attempt">External IT Network Query Anomaly Detected & Blocked</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">Brief Descriptive Notes</label>
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

            {/* STEP 2 TRANSMISSION TRANSMITTER TRIGGER CARD */}
            {activeStep === 2 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start text-left">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Step 2: Dispatch Emergency Patient Alerts</h3>
                    <p className="text-xs text-slate-400 mt-0.5">The DPDP Act requires the hospital to alert all affected individuals without delay.</p>
                  </div>
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                    {affectedCount} Contacts Flagged
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Standard Legally Approved SMS Template</span>
                  <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                    "Notice from Provider: A security issue has been logged regarding localized datasets. Your private medical files remain fully locked down and secure. We are taking all necessary protective steps in line with DPDP Act standards."
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

            {/* STEP 3 ARTIFACT ASSEMBLY DOWNLOAD PANEL */}
            {activeStep === 3 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Patient Safety Alerts Dispatched</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    All compliance safety notices have been sent successfully. Verifiable hashes for each message are locked onto your decentralized storage node.
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

          {/* RIGHT 72-HOUR COUNTDOWN PANEL KEY CARD COLUMN */}
          <div className="bg-rose-950/90 border border-rose-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between space-y-6 text-left">
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
                <span className="text-rose-300">Incident Detected:</span>
                <span className="font-mono font-semibold">{breachState.timestamp || "14:32:01"}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-rose-300">Current Status:</span>
                <span className="text-emerald-400 font-bold">✓ Workflow Active</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* REGULATORY COMPLIANCE OFFICIAL DATA PRESENTATION BOX REPORT OVERLAY (MODAL WITH EXPLICIT HIGH Z-INDEX LAYER) */}
      {showDpbModal && dpbReceipt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-lg w-full font-sans text-slate-800 text-left">
            
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
              onClick={() => { setShowDpbModal(false); triggerSimulationAction('CLEAR_ALL'); }}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              Resolve Incident & Reset System
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
