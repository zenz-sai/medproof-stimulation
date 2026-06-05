import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { Send, FileText, CheckCircle2, AlertCircle, Eye, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function ReportDelivery() {
  const { consents, reports, setReports, setActivities, currentSession } = useData();
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [testType, setTestType] = useState('Blood Test');
  const [activeProof, setActiveProof] = useState(null);

  // Form states for adding a new report
  const [showSendForm, setShowSendForm] = useState(false);

  // 1. Handle sending out a new secure report link
  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return alert('Please select a patient first.');

    // Look up the patient profile to verify their current consent status
    const targetPatient = consents.find(c => c.id === parseInt(selectedPatientId));
    if (!targetPatient) return;

    // DPDP GUARDRAIL CRITICAL CHECK: Block delivery if consent is withdrawn
    if (targetPatient.status === 'Withdrawn') {
      alert(`CRITICAL LEGAL BLOCK: Cannot dispatch report. ${targetPatient.name} has explicitly withdrawn digital delivery authorization under the DPDP Act.`);
      return;
    }

    const sourceName = currentSession ? currentSession.name : 'City Hospital';
    const dynamicToken = `token_${Math.floor(Math.random() * 900000 + 100000)}`;
    const linkUrl = `${window.location.origin}/user?access=${dynamicToken}&from=${encodeURIComponent(sourceName)}`;

    // Generate cryptographic proof of sending
    const trackingPayload = {
      recipientName: targetPatient.name,
      medicalTest: testType,
      dispatchTimestamp: new Date().toISOString(),
      action: "Secure Link Dispatched"
    };
    const cryptoProof = await generateMOIProof(trackingPayload);

    // Append to our shared data array
    const newReportRecord = {
      id: Date.now(),
      name: targetPatient.name,
      test: testType,
      sent: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      delivered: 'Just now',
      viewed: null,
      status: 'Delivered',
      simulatedLink: linkUrl
    };

    setReports(prev => [newReportRecord, ...prev]);
    setActivities(prev => [{
      id: Date.now(),
      user: targetPatient.name,
      action: `Secure [${testType}] link generated and transmitted via encrypted gateway`,
      time: 'Just now'
    }, ...prev]);

    // Reset fields
    setSelectedPatientId('');
    setShowSendForm(false);
  };

  // 2. Look up the deep network delivery trail for an individual item
  const handleFetchDeliveryTrail = async (report) => {
    const historicalPayload = {
      patient: report.name,
      fileType: report.test,
      statusTimeline: {
        dispatched: report.sent,
        carrierDelivered: report.delivered,
        patientOpened: report.viewed || "Awaiting Patient OTP Login"
      }
    };
    const cryptoProof = await generateMOIProof(historicalPayload);

    const fallbackLink = `${window.location.origin}/user?access=token_104278&from=${encodeURIComponent(currentSession ? currentSession.name : 'City Hospital')}`;

    setActiveProof({
      name: report.name,
      test: report.test,
      status: report.status,
      sent: report.sent,
      delivered: report.delivered,
      viewed: report.viewed || 'Not opened yet',
      simulatedLink: report.simulatedLink || fallbackLink,
      blockHash: cryptoProof.kapsulRoot,
      signature: cryptoProof.nodeSignature,
      timestamp: cryptoProof.blockTimestamp
    });
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-900 relative">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Secure Report Delivery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch diagnostic records using safe, unique private links instead of open, illegal chat folders.
          </p>
        </div>

        <button
          onClick={() => setShowSendForm(!showSendForm)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch New Lab Report</span>
        </button>
      </div>

      {/* DISPATCH NEW REPORT CONTAINER FORM */}
      {showSendForm && (
        <form onSubmit={handleSendReport} className="bg-white p-5 rounded-xl border border-slate-200 shadow-md max-w-xl space-y-4 animate-slideDown text-left mx-auto sm:mx-0">
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
                className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500 font-medium"
              >
                <option value="">-- Choose registered profile --</option>
                {consents.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status === 'Withdrawn' ? '⛔ Consent Withdrawn' : '✓ Authorized'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Diagnostic Category</label>
              <select
                value={testType}
                onChange={e => setTestType(e.target.value)}
                className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500 font-medium"
              >
                <option value="Blood Test">Blood Test Record (CBC/Lipid Profile)</option>
                <option value="X-Ray Report">Chest X-Ray / Digital Radiology Image</option>
                <option value="MRI Scan">Brain MRI Scan Slice Dataset</option>
                <option value="Biopsy Report">Histopathology / Tissue Biopsy Summary</option>
              </select>
            </div>
          </div>

          {selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn' && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-rose-950 font-bold">DPDP Legal Safeguard Warning:</strong>
                This user has revoked their permission link. The application has strictly locked down the file pipeline to protect the hospital from a compliance fine.
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2 text-xs">
            <button type="button" onClick={() => setShowSendForm(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button 
              type="submit"
              disabled={selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn'}
              className={`px-4 py-1.5 rounded-lg font-bold shadow-sm transition ${
                selectedPatientId && consents.find(c => c.id === parseInt(selectedPatientId))?.status === 'Withdrawn'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              Send Secure Link
            </button>
          </div>
        </form>
      )}

      {/* TRACKING WORKFLOW SHEET SPREADSHEET CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Medical File</th>
                <th className="py-3 px-4">Dispatched Link Status Timeline</th>
                <th className="py-3 px-4 text-center">Current Delivery State</th>
                <th className="py-3 px-4 text-right">Chain of Custody</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/60 transition group">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {report.name}
                  </td>
                  
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-md text-[11px] font-medium">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>{report.test}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span>Sent: <strong className="text-slate-700 font-semibold">{report.sent}</strong></span>
                      <span>• Delivered: <strong className="text-slate-700 font-semibold">{report.delivered}</strong></span>
                      {report.viewed && <span>• Opened: <strong className="text-teal-600 font-bold">{report.viewed}</strong></span>}
                    </div>
                    {/* <div 
                      className="text-slate-400 select-all font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 inline-block max-w-xs truncate cursor-pointer hover:bg-slate-100 transition" 
                      title="Click to select text or copy via custody report drawer"
                    >
                      {report.simulatedLink || `${window.location.origin}/user?access=token_104278&from=${encodeURIComponent(currentSession ? currentSession.name : 'City Hospital')}`}
                    </div> */}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      report.status === 'Viewed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : report.status === 'Delivered'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {report.status === 'Viewed' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Viewed by Patient</span>
                        </>
                      ) : report.status === 'Delivered' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>Delivered to Mobile</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Pending Network Route</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleFetchDeliveryTrail(report)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition"
                    >
                      <span>Verify Custody Trail</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRYPTOGRAPHIC CUSTODY TRAIL MODAL POPUP (FIXED STACK LAYER PROTECTION) */}
      {activeProof && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl z-9999 animate-fadeIn pt-48">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-md w-full font-sans text-slate-800 text-left relative transform scale-100 transition-all">
            
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-teal-500" />
              <span>Verifiable Chain of Custody Report</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Recipient Patient:</span>
                  <strong className="text-slate-900 font-bold">{activeProof.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Diagnostic Document:</span>
                  <span className="text-slate-700 font-semibold">{activeProof.test}</span>
                </div>
              </div>

              {/* Verified steps sequence mapping */}
              <div className="space-y-2 border-l-2 border-teal-500 pl-3.5 ml-1 relative text-left">
                <div className="relative">
                  <span className="absolute -left-[19px] top-0.5 w-2 h-2 rounded-full bg-teal-500" />
                  <p className="font-bold text-slate-800">1. Private Document Dispatched</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Gateway Link transmitted at {activeProof.sent}</p>
                </div>
                <div className="relative pt-2">
                  <span className="absolute -left-[19px] top-2.5 w-2 h-2 rounded-full bg-teal-500" />
                  <p className="font-bold text-slate-800">2. SMS Network Delivery Handshake</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Carrier routing complete confirmation at {activeProof.delivered}</p>
                </div>
                <div className="relative pt-2">
                  <span className={`absolute -left-[19px] top-2.5 w-2 h-2 rounded-full ${activeProof.status === 'Viewed' ? 'bg-teal-500' : 'bg-slate-300'}`} />
                  <p className="font-bold text-slate-800">3. Secure Patient OTP Login Verification</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Patient decrypted & opened file link at: {activeProof.viewed}</p>
                </div>
              </div>

              <div className="text-left">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Secure SMS Transmission Link:</span>
                <div className="font-mono bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600 break-all select-all mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] max-w-[240px]">
                    {activeProof.simulatedLink}
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeProof.simulatedLink);
                      alert("Link copied directly to your clipboard!");
                    }}
                    className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-800 tracking-wide uppercase shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="text-left">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Immutable Timeline Attestation Key:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 break-all select-all mt-1">{activeProof.blockHash}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span>Node Security Integrity:</span>
                <span className="text-emerald-600 font-bold">✓ 100% Legally Compliant</span>
              </div>
            </div>

            <button
              onClick={() => setActiveProof(null)}
              className="mt-6 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm font-semibold"
            >
              Close Receipt Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
