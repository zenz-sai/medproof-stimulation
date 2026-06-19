import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { QrCode, HatGlasses, ShieldCheck, CheckCircle2, MessageSquare, Terminal, Eye, HelpCircle, SendHorizontal, Smartphone, RefreshCw, Layers } from 'lucide-react';

export default function ConsentCollection() {
  const { currentSession, consents, setConsents, setActivities } = useData();
  
  // Presentation States
  const [activeQrPayload, setActiveQrPayload] = useState(null);
  const [isProcessingContract, setIsProcessingContract] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // NEW: Multi-Phase Simulation State Tracker ('idle' | 'generating' | 'deployed' | 'scanning' | 'syncing')
  const [simPhase, setSimPhase] = useState('idle');
  const [activeTargetModules, setActiveTargetModules] = useState('');
  const [activeTargetScope, setActiveTargetScope] = useState('');
  
  // AX CHAT HISTORY STATE
  const [chatLog, setChatLog] = useState([
    { role: 'agent', message: 'Hello! Welcome to the MedProof.' },
    { role: 'agent', message: 'I can assist you in generating a DPDP compliance QR contract. Please select one of my pre-defined service templates below, or describe the customized treatment authorization required in the chat.' }
  ]);

  // Pre-populated Agentic Prompts Matrix
  const predefinedAgenticPrompts = [
    { id: 'p1', label: 'Blood Test Authorization', prompt: 'Create CBC and Lipid Profile authorization. Set scope to Read/Write and expiry to 7 days.' },
    { id: 'p2', label: 'MRI/CT Scan Consent', prompt: 'Generate authorization for Brain MRI Scan Slices. Set scope to Read Only mode. Set standard 30-day expiry.' },
    { id: 'tpl_diabates', label: 'HbA1c/Diabetes Screening', 
      prompt: 'Create authorization for Glucose levels screening. Access should expire in 48 hours.'},
    { id: 'p3', label: 'General Vitals Check', prompt: 'Setup permission for basic Vitals Log and Prescription Sheet. Access should expire in 72 hours.' }
  ];

  // ACTION 1: AX Prompt Injection Logic
  const handleSelectPromptOption = (promptText) => {
    setNaturalLanguageInput(promptText);
    console.log("Injected Prompt context: ", promptText);
  };

  // ACTION 2: Execute AI Transaction Compile & QR Generation pipeline
  const handleSubmitAgenticRequest = async (e) => {
    e.preventDefault();
    if (!naturalLanguageInput.trim()) return;

    const userMessage = naturalLanguageInput.trim();
    setChatLog(prev => [...prev, { role: 'user', message: userMessage }, { role: 'agent', message: 'Understood. Parsing the intent...' }]);
    
    setNaturalLanguageInput(''); // Reset input box
    setIsProcessingContract(true);
    setActiveQrPayload(null);
    setSimPhase('generating');

    // Parse variables locally to display in the upcoming tracking milestones
    const text = userMessage.toLowerCase();
    let permissions = 'Read Only';
    let validity = 3;
    let modules = 'Vitals + Diagnosis';

    if (text.includes('read/write') || text.includes('full access') || text.includes('reports')) permissions = 'Read/Write';
    if (text.includes('7 days') || text.includes('week')) validity = 7;
    if (text.includes('30 days') || text.includes('month')) validity = 30;
    if (text.includes('48 hours') || text.includes('48h')) validity = 2;
    if (text.includes('cbc') || text.includes('lipid')) modules = 'CBC + Lipid Summary';
    if (text.includes('mri') || text.includes('ct')) modules = 'Radiology Scans';
    if (text.includes('glucose') || text.includes('diabetes')) modules = 'Glucose Screening';

    setActiveTargetModules(modules);
    setActiveTargetScope(permissions);

    setTimeout(async () => {
      const contractPayload = {
        issuingFacility: currentSession ? currentSession.name : "City Community Hospital",
        identityGateway: "IOMe Decentralized ID Gateway",
        storageProtocol: "kapsul",
        permissionsScope: permissions,
        validityWindowSeconds: validity * 86400,
        authorizedFields: modules,
        nonceToken: `req_${Math.floor(Math.random() * 100000 + 900000)}`
      };

      const cryptoFingerprint = await generateMOIProof(contractPayload);
      
      const finalContractState = {
        ...contractPayload,
        smartContractAddress: cryptoFingerprint.nodeSignature,
        storageRootHash: cryptoFingerprint.kapsulRoot,
        qrStringData: `moi://consent_request?token=${cryptoFingerprint.kapsulRoot}&fac=${encodeURIComponent(contractPayload.issuingFacility)}`
      };

      localStorage.setItem('mp_pending_qr_contract', JSON.stringify(finalContractState));
      setActiveQrPayload(finalContractState);
      setIsProcessingContract(false);
      setSimPhase('deployed');

      setChatLog(prev => [...prev, { role: 'agent', message: `QR code initialized. Instruct the patient to scan it now. Permission locked: ${modules} (${permissions}) valid for ${validity} days.` }]);
    }, 1200);
  };

  // NEW SLICK ACTION: Triggers the multi-phase animation flow sequence for the pitch
  const runLiveHandshakeSimulation = () => {
    if (!activeQrPayload) return;
    
    // Phase 1: Trigger Patient Scan Screen (1.5 Seconds)
    setSimPhase('scanning');
    
    setTimeout(() => {
      // Phase 2: Trigger IOMe Decentralized Blockchain Consent Sharing (2.0 Seconds)
      setSimPhase('syncing');
      
      setTimeout(() => {
        // Final Execution: Commit to table ledger, notify backoffice dashboard log history, and reset loops
        const randomizedPatientNodeId = `${Math.floor(Math.random() * 9000 + 1000)}`;
        
        const newLedgerRow = {
          id: Date.now(),
          name: randomizedPatientNodeId, 
          purpose: `${activeTargetModules} (${activeTargetScope})`,
          date: 'Just now',
          status: 'Active'
        };

        setConsents(prev => [newLedgerRow, ...prev]);
        
        setActivities(prev => [{
          id: Date.now(),
          user: "IOMe Gateway",
          action: `Cryptographic consent signed and broadcasted to MOI Smart Contract for ${activeTargetModules}`,
          time: 'Just now'
        }, ...prev]);

        // Clean slate reset back to the default AX home page triggers layout
        setActiveQrPayload(null);
        setSimPhase('idle');
        setChatLog([
          { role: 'agent', message: 'Hello! Welcome to the MedProof.' },
          { role: 'agent', message: 'Prior transaction verified successfully. Ready to build your next DPDP compliance QR contract block.' }
        ]);

        setChatLog(prev => [...prev, { role: 'agent', message: `'${newLedgerRow.name.startsWith('did:iome:') ? newLedgerRow.name : 'did:iome:id_' + Math.floor(newLedgerRow.id / 100000)}': Wallet Signature Handshake Verified! Transaction anchored on ledger successfully.` }]);
      }, 2000); // Phase 2: 2000ms duration
    }, 1500); // Phase 1: 1500ms duration
  };

  const handleOpenReceiptModal = async (patient) => {
    const historicalPayload = {
      recordScope: patient.purpose,
      legalAnchoring: "MOI Smart Contract Verified",
      storageTarget: "Kapsul Private Vault Protocol Room"
    };
    const cryptoProof = await generateMOIProof(historicalPayload);

    setActiveReceipt({
      name: patient.name,
      purpose: patient.purpose,
      date: patient.date,
      status: patient.status,
      blockHash: cryptoProof.kapsulRoot,
      nodeKey: cryptoProof.nodeSignature
    });
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-900 text-left relative select-none">
      
      {/* HEADER PAGE TITLE BLOCK */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 m-0">DPDP Consent Collection</h1>
        <p className="text-xs text-slate-500 mt-1">
          Chat with the MedProof AI Agent to dynamically compile verifiable data access request contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* AX LAYER BLOCK A: THE INTERACTIVE CONVERSATIONAL INTERFACE (AGENT WINDOW) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-100 mb-4">
              <HatGlasses className="w-4 h-4 animate-pulse" />
              <span>MedProof Automated Setup Assistant</span>
            </div>
            
            {/* Conversations history viewport */}
            <div className="flex-1 overflow-y-auto space-y-4 px-1 text-xs">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl ${chat.role === 'user' ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
                    <p className="leading-relaxed font-medium">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* PRE-POPULATED PROMPT OPTION CHIPS GRID SEGMENT */}
            {simPhase === 'idle' && (
              <div className="space-y-2 pt-4 border-t border-slate-100 mt-4">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Pre-defined Agentic prompts:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                  {predefinedAgenticPrompts.map(prompt => (
                    <button 
                      key={prompt.id} type="button" onClick={() => handleSelectPromptOption(prompt.prompt)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 text-[11px] font-semibold border border-slate-200/80 hover:border-teal-300 rounded-lg transition text-left truncate"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT INPUT FORM: AX Transaction Finalizer */}
            <form onSubmit={handleSubmitAgenticRequest} className="relative pt-4 mt-4 border-t border-slate-100 shrink-0">
              <input
                type="text"
                value={naturalLanguageInput}
                onChange={e => setNaturalLanguageInput(e.target.value)}
                placeholder="Speak naturally or describe treatment details (e.g., Extend authorized access until Friday)..."
                disabled={isProcessingContract || simPhase !== 'idle'}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-500 transition shadow-inner disabled:opacity-50"
              />
              <button 
                type="submit" disabled={isProcessingContract || !naturalLanguageInput.trim() || simPhase !== 'idle'}
                className="absolute right-2.5 top-1/2 -translate-y-[4px] p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 rounded-xl transition text-white disabled:text-slate-400 shadow-lg"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* VIEWPORT PANEL B: RE-ENGINEERED TO EMBED HIGH-FIDELITY WALLET HANDSHAKE SIMULATION TIMELINES */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[480px] text-center relative overflow-hidden">
          
          {simPhase === 'generating' && (
            <div className="space-y-3 animate-pulse text-left">
              <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/60 mx-auto">
                <QrCode className="w-16 h-16 text-slate-300 animate-spin" />
              </div>
              <p className="text-xs font-semibold text-slate-500 font-mono tracking-wider pt-2 text-center">Deploying Smart Contract State Parameter Nodes...</p>
            </div>
          )}

          {simPhase === 'idle' && (
            <div className="space-y-2 max-w-xs p-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">Awaiting Agent Finalization</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                Configure treatment package requirements on the left, then click submit to draw the live transaction QR contract.
              </p>
            </div>
          )}

          {simPhase === 'deployed' && activeQrPayload && (
            <div className="w-full space-y-4 animate-scaleUp">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 w-48 h-48 mx-auto flex flex-col items-center justify-center relative shadow-lg">
                <div className="w-full h-full border-4 border-dashed border-teal-500/40 rounded flex items-center justify-center relative p-2">
                  <QrCode className="w-36 h-36 text-white" />
                  <div className="absolute p-1 bg-slate-950 rounded border border-teal-500 text-teal-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Active Patient Approval Link (30s)</span>
                </span>
                <p className="text-[11px] font-bold text-slate-800 pt-1">Awaiting for patient approval...</p>
                
                {/* INVESTOR PRESENTER TRIGGER BUTTON */}
                <button
                  type="button"
                  onClick={runLiveHandshakeSimulation}
                  className="opacity-0 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl tracking-wide uppercase shadow transition"
                >
                  Simulate Patient UPI Scan ⚡
                </button>
              </div>
            </div>
          )}

          {/* SLICK STAGE 1: PATIENT SCANNING TIMELINE ANIMATION VIEWPORT (1.5s) */}
          {simPhase === 'scanning' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="w-24 h-24 bg-teal-500/10 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto relative">
                <Smartphone className="w-10 h-10 text-teal-600 relative z-10" />
                <span className="absolute inset-0 rounded-full border border-teal-500 animate-ping opacity-60" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">1. Scan Detected! </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Scan successful. Accessing required matrices...
                </p>
              </div>
            </div>
          )}

          {/* SLAGE STAGE 2: IOMe RE-ROUTING COMPILATION PROGRESS BAR (2.0s) */}
          {simPhase === 'syncing' && (
            <div className="space-y-4 animate-fadeIn w-full px-2">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto text-emerald-400">
                <Layers className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">2. Synchronizing Token Consent</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Signing access boundaries via IOMe ID and distributing files rules data array on MOI Smart Contract block layer.
                </p>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ANONYMIZED LEDGER TRANSACTION TRACK SHEET LEDGER CONTAINER SHEET */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Compliance History Records Ledger</h3>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Profile ID</th>
                  <th className="py-3 px-4">Authorized Permission Scope</th>
                  <th className="py-3 px-4">Date Documented</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Audit Trail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consents.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-700">
                      {patient.name.startsWith('did:iome:') ? patient.name : 'did:iome:id_' + Math.floor(patient.id / 100000)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{patient.purpose}</td>
                    <td className="py-3.5 px-4 text-slate-400">{patient.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        patient.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span>{patient.status === 'Active' ? "Approved & Verified" : "Withdrawn"}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReceiptModal(patient)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CRYPTOGRAPHIC VERIFICATION RECEIPT MODAL DRAWER OVERLAY */}
      {activeReceipt && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-md w-full font-sans text-slate-800 text-left relative transform scale-100 transition-all">
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              <span>Official Patient Consent Receipt</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Identity Ledger Mapping:</span>
                <p className="text-emerald-600 font-bold">● {activeReceipt.status === 'Active' ? 'Authorized Node' : 'Privileges Withdrawn'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Authorized Permissions Scope:</span>
                <p className="text-slate-800 font-medium mt-0.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">{activeReceipt.purpose}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Tamper-Proof Kapsul Root Hash:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 break-all select-all mt-1">{activeReceipt.blockHash}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Smart Contract Identity Proof (IOMe Gateway):</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-teal-700 break-all mt-1">{activeReceipt.nodeKey}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verification Time Anchor:</span>
                <span className="font-medium text-slate-700">{activeReceipt.date}</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveReceipt(null)}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm font-bold uppercase tracking-wider"
            >
              Close Receipt Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
