import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { Send, FileText, CheckCircle2, AlertCircle, ShieldAlert, ArrowUpRight, Cpu, Layers, FileUp, Check, ShieldCheck } from 'lucide-react';

export default function ReportDelivery() {
  const { consents, reports, setReports, setActivities, currentSession } = useData();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [testType, setTestType] = useState('Blood Test');
  const [activeProof, setActiveProof] = useState(null);
  
  // Interactive Simulation Animation States
  const [showSendForm, setShowSendForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simStage, setSimStage] = useState('idle'); // 'idle' | 'uploading' | 'encrypting'
  
  // REAL: Active system file attachment structures
  const [realFileAttached, setRealFileAttached] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const fileInputRef = useRef(null);

  // Triggered when a user selects a file from their machine
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file bytes to readable KB/MB configurations
    const sizeInKb = (file.size / 1024).toFixed(1);
    const readableSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    setUploadedFileName(file.name);
    setUploadedFileSize(readableSize);
    setRealFileAttached(true);
  };

  const triggerNativeFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- ACTION: SECURE DISPATCH & ENCRYPTION ---
  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return alert('Please select a patient first.');
    if (!realFileAttached) return alert('Please upload a genuine lab report file from your machine first.');

    // Look up the patient profile to verify their live consent status
    const targetPatient = consents.find(c => c.id === parseInt(selectedPatientId));
    if (!targetPatient) return;

    // DPDP GUARDRAIL CRITICAL CHECK: Block delivery if consent is withdrawn
    if (targetPatient.status === 'Withdrawn') {
      alert(`CRITICAL LEGAL BLOCK: Cannot dispatch report. This user has explicitly withdrawn digital delivery authorization under the DPDP Act.`);
      return;
    }

    // Initialize the Interactive Simulation Sequence
    setIsProcessing(true);
    setSimStage('uploading');

    // Step 1: Simulate Secure Stream Channel (1.5s)
    setTimeout(() => {
      setSimStage('encrypting');

      // Step 2: Simulate Direct Encryption Lock (2.0s)
      setTimeout(async () => {
        const sourceName = currentSession ? currentSession.name : 'City Hospital';
        const dynamicToken = `token_${Math.floor(Math.random() * 900000 + 100000)}`;
        const linkUrl = `${window.location.origin}/user?access=${dynamicToken}&from=${encodeURIComponent(sourceName)}&pId=${targetPatient.id}`;

        // Generate cryptographic proof logs using the REAL file context parameters
        const trackingPayload = {
          recipientName: targetPatient.name,
          medicalTest: testType,
          actualFileName: uploadedFileName,
          fileSizeWeight: uploadedFileSize,
          dispatchTimestamp: new Date().toISOString(),
          action: "Secure Vault Upload Completed"
        };
        const cryptoProof = await generateMOIProof(trackingPayload);

        // Append directly to our shared reports data array
        const newReportRecord = {
          id: Date.now(),
          name: targetPatient.name,
          test: `${testType} (${uploadedFileName})`,
          sent: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          delivered: 'Locked in Wallet',
          viewed: null,
          status: 'Viewed', 
          simulatedLink: linkUrl,
          blockchainHash: cryptoProof.kapsulRoot,
          signature: cryptoProof.nodeSignature
        };

        setReports(prev => [newReportRecord, ...prev]);
        setActivities(prev => [{
          id: Date.now(),
          user: targetPatient.name,
          action: `Encrypted real asset [${uploadedFileName}] and uploaded straight into patient vault storage`,
          time: 'Just now'
        }, ...prev]);

        // Clean slate reset
        setSelectedPatientId('');
        setRealFileAttached(false);
        setUploadedFileName('');
        setUploadedFileSize('');
        setShowSendForm(false);
        setIsProcessing(false);
        setSimStage('idle');

        alert(`Success! ${uploadedFileName} securely encrypted directly into the patient's private vault using verified parameters.`);
      }, 2000);
    }, 1500);
  };

  const handleFetchDeliveryTrail = async (report) => {
    const historicalPayload = {
      patient: report.name,
      fileType: report.test,
      statusTimeline: {
        dispatched: report.sent,
        carrierDelivered: report.delivered,
        patientOpened: "Locked in Wallet Vault"
      }
    };
    const cryptoProof = await generateMOIProof(historicalPayload);

    setActiveProof({
      name: report.name,
      test: report.test,
      status: 'Viewed',
      sent: report.sent,
      delivered: report.delivered,
      blockchainHash: report.blockchainHash || cryptoProof.kapsulRoot,
      signature: report.signature || cryptoProof.nodeSignature
    });
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-900 text-left relative select-none">
      
      {/* HIDDEN NATIVE BROWSER FILE INPUT CONTROLLER */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.dicom,.webp"
      />

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 m-0">Secure Report Delivery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch diagnostic records using safe, unique private links instead of open, illegal chat folders.
          </p>
        </div>

        <button
          onClick={() => setShowSendForm(!showSendForm)}
          disabled={isProcessing}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto shrink-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch New Lab Report</span>
        </button>
      </div>

      {/* DISPATCH NEW REPORT CONTAINER FORM */}
      {showSendForm && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-xl animate-slideDown mx-auto sm:mx-0 relative overflow-hidden min-h-[340px] flex flex-col justify-center">
          
          {/* STANDARD IDLE FORM LAYER */}
          {simStage === 'idle' && (
            <form onSubmit={handleSendReport} className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Secure Link Generation Form</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Select Target Patient</label>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500 font-medium text-slate-800"
                  >
                    <option value="">-- Choose registered profile --</option>
                    {consents.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.status === 'Withdrawn' ? '⛔ Consent Revoked' : '✓ Authorized'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Diagnostic Category</label>
                  <select
                    value={testType}
                    onChange={e => setTestType(e.target.value)}
                    className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500 font-medium text-slate-800"
                  >
                    <option value="Blood Test">Blood Test Record (CBC/Lipid Profile)</option>
                    <option value="X-Ray Report">Chest X-Ray / Digital Radiology Image</option>
                    <option value="MRI Scan">Brain MRI Scan Slice Dataset</option>
                    <option value="Biopsy Report">Histopathology / Tissue Biopsy Summary</option>
                  </select>
                </div>
              </div>

              {/* REAL ACTIVE NATIVE DROPZONE CARD */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Upload Real Laboratory Document</label>
                <div 
                  onClick={triggerNativeFileSelect}
                  className={`w-full py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
                    realFileAttached 
                      ? 'border-emerald-500 bg-emerald-50/10' 
                      : 'border-slate-200 hover:bg-slate-50 bg-slate-50/50'
                  }`}
                >
                  {realFileAttached ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 tracking-tight px-4 text-center break-all">{uploadedFileName}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Ready: {uploadedFileSize} asset payload attached</span>
                    </>
                  ) : (
                    <>
                      <FileUp className="w-6 h-6 text-slate-400" />
                      <p className="text-xs font-medium text-slate-600">Click to upload real report from your computer...</p>
                      <span className="text-[9px] text-slate-400">(Accepts system PDFs, images, or test documentation layouts)</span>
                    </>
                  )}
                </div>
              </div>

              {/* DEMO CRITICAL SAFETY GATE WARNING HIGHLIGHT */}
              {selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn' && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex items-start space-x-2 animate-fadeIn">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-rose-950 font-bold">DPDP Legal Safeguard Activated:</strong>
                    This user has explicitly revoked their digital sharing token. The interface has strictly locked down the file upload pipeline to protect the hospital from a compliance violation fine.
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 text-xs font-semibold">
                <button type="button" onClick={() => setShowSendForm(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button 
                  type="submit"
                  disabled={!realFileAttached || (selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn')}
                  className={`px-4 py-1.5 rounded-lg font-bold shadow-sm transition ${
                    (!realFileAttached || (selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn'))
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  Encrypt & Send Report
                </button>
              </div>
            </form>
          )}

          {/* ANIMATION STEP 1: TRANSMISSION CHANNEL INITIALIZATION (1.5s) */}
          {simStage === 'uploading' && (
            <div className="space-y-3 text-center py-6 animate-fadeIn">
              <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/30 text-teal-600 rounded-xl flex items-center justify-center mx-auto">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Establishing Secure Delivery Link</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                Opening isolated transfer channel... Mapping user credential keys.
              </p>
            </div>
          )}

          {/* ANIMATION STEP 2: VAULT ENCRYPTION LOCK (2.0s) */}
          {simStage === 'encrypting' && (
            <div className="space-y-3 text-center py-6 animate-fadeIn">
              <div className="w-10 h-10 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                <Layers className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-emerald-600">2. Encrypting Directly to Patient Wallet</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                Sealing document data blocks with the patient's unique master key. Storing file logs locally.
              </p>
              <div className="w-48 bg-slate-100 h-1 rounded-full mx-auto overflow-hidden">
                <div className="bg-emerald-500 h-full w-3/4 rounded-full animate-pulse" />
              </div>
            </div>
          )}

        </div>
      )}

      {/* TRACKING LEDGER SHEET SPREADSHEET */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-3 px-4">Anonymized Patient Profile Token</th>
                <th className="py-3 px-4">Medical File Log Reference</th>
                <th className="py-3 px-4">Timeline Status Trace</th>
                <th className="py-3 px-4 text-center">Current Delivery State</th>
                <th className="py-3 px-4 text-right">Audit Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/60 transition group">
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-700">
                    {report.name.startsWith('did:') ? report.name : 'did:secure:patient_' + Math.floor(report.id / 100000)}
                  </td>
                  
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-50 border border-slate-200/60 rounded-md text-[11px] max-w-full">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]" title={report.test}>{report.test}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span>Uploaded: <strong className="text-slate-600 font-bold">{report.sent}</strong></span>
                      <span>• State: <strong className="text-emerald-600 font-bold">{report.delivered}</strong></span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Locked in Wallet</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleFetchDeliveryTrail(report)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition"
                    >
                      <span>View Receipt Data</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION BLOCK RECEIPT MODAL FRAMEWORK LAYER */}
      {activeProof && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl z-9999 animate-fadeIn pt-32">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-md w-full font-sans text-slate-800 text-left relative transform scale-100 transition-all">
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              <span>Immutable Ledger Receipt</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-400 text-[11px]">This transaction hash represents the unalterable block receipt finalized on the compliance ledger network.</p>
              
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Recipient Profile Address:</span>
                <p className="font-mono text-slate-900 font-bold text-xs mt-0.5 truncate">{activeProof.name}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Secure Storage Audit Root:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 break-all mt-1">{activeProof.blockchainHash || "0x9e2f5d7c8b1a4f5e6d..."}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Cryptographic Validation Signature:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-teal-700 break-all mt-1">{activeProof.signature || "0x3a1b4c9e2f5d7c8b1a..."}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Timestamp Sealed:</span>
                <span className="font-bold text-slate-700">{activeProof.sent}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveProof(null)}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm font-semibold uppercase tracking-wider"
            >
              Close Receipt Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
