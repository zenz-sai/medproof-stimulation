import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { generateMOIProof } from '../utils/cryptoEngine';
import { Search, UserPlus, CheckCircle, XCircle, ShieldCheck, Eye, HelpCircle } from 'lucide-react';

export default function ConsentCollection() {
  const { consents, setConsents, setActivities } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);

  // Form states for adding a quick new patient consent form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPurpose, setNewPurpose] = useState('Treatment + Reports');

  // 1. Search filter logic
  const filteredConsents = consents.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // 2. Action: Revoke/Withdraw Consent instantly
  const handleToggleStatus = (patientId, currentStatus, patientName) => {
    const updatedStatus = currentStatus === 'Active' ? 'Withdrawn' : 'Active';
    
    setConsents(prev => prev.map(item => {
      if (item.id === patientId) {
        return { ...item, status: updatedStatus };
      }
      return item;
    }));

    // Add a simple history message to our dashboard feed
    setActivities(prev => [{
      id: Date.now(),
      user: patientName,
      action: `Consent settings manually updated to [${updatedStatus}] by front desk`,
      time: 'Just now'
    }, ...prev]);
  };

  // 3. Action: Generate cryptographic audit proof on demand
  const handleViewProof = async (patient) => {
    const proofPayload = {
      patientName: patient.name,
      contact: patient.phone,
      authorizedPermissions: patient.purpose,
      currentLegalStatus: patient.status
    };
    
    const cryptoResult = await generateMOIProof(proofPayload);
    
    setActiveReceipt({
      name: patient.name,
      purpose: patient.purpose,
      status: patient.status,
      digitalLock: cryptoResult.kapsulRoot,
      signatureKey: cryptoResult.nodeSignature,
      timestamp: cryptoResult.blockTimestamp
    });
  };

  // 4. Action: Save a new incoming consent entry
  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('Please enter a name and phone number.');

    const initialPayload = { name: newName, phone: newPhone, purpose: newPurpose, status: 'Active' };
    const cryptoResult = await generateMOIProof(initialPayload);

    const newEntry = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      purpose: newPurpose,
      date: 'Just now',
      status: 'Active',
      proofHash: cryptoResult.nodeSignature
    };

    setConsents(prev => [newEntry, ...prev]);
    setActivities(prev => [{
      id: Date.now(),
      user: newName,
      action: 'Completed digital consent sign-up form',
      time: 'Just now'
    }, ...prev]);

    // Reset Form fields
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Patient Consent Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update, and print official digital permission records for your patients.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient Authorization</span>
        </button>
      </div>

      {/* PLAIN LANGUAGE EXPLANATION */}
      {showExplanation && (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-950 shadow-sm flex items-start justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-teal-400 font-bold uppercase tracking-wider text-[10px] block">Receptionist Guide</span>
            <p className="text-slate-300 leading-relaxed">
              Under India's DPDP law, a hospital cannot send medical files or marketing messages without explicit permission. If an inspector requests an audit trail, use the <strong>"View Digital Receipt"</strong> button below to show immediate, encrypted proof of consent.
            </p>
          </div>
          <button onClick={() => setShowExplanation(false)} className="text-slate-500 hover:text-slate-300 font-bold transition">✕</button>
        </div>
      )}

      {/* QUICK ADD NEW FORM VIEW OVERLAY CONTAINER */}
      {showAddForm && (
        <form onSubmit={handleCreateConsent} className="bg-white p-5 rounded-xl border border-slate-200 shadow-md max-w-xl space-y-4 animate-slideDown">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Register Patient Authorization Form</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Patient Full Name</label>
              <input 
                type="text" placeholder="e.g., Amit Kumar" value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Mobile Phone Number</label>
              <input 
                type="text" placeholder="e.g., +91 99999 88888" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">What fields are they approving?</label>
            <select 
              value={newPurpose} onChange={e => setNewPurpose(e.target.value)}
              className="w-full border border-slate-200 p-2 text-xs rounded-lg bg-slate-50 focus:outline-teal-500"
            >
              <option value="Treatment + Reports">Medical Treatment & Digital Report Delivery only</option>
              <option value="Treatment Only">Strictly Medical Treatment logs only</option>
              <option value="Treatment + Reports + Marketing">Treatment, Digital Reports, & Promotional SMS updates</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2 text-xs">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500 shadow-sm">Save & Lock Authorization</button>
          </div>
        </form>
      )}

      {/* FILTER SEARCH TOOLBAR */}
      <div className="w-full max-w-md relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search by patient name or mobile phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs shadow-sm focus:outline-none focus:border-slate-400 text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* DATA PATIENT LISTING LEDGER SHEET */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-3 px-4">Patient Profile Details</th>
                <th className="py-3 px-4">Approved Permissions</th>
                <th className="py-3 px-4">Date Documented</th>
                <th className="py-3 px-4 text-center">Current Legal Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredConsents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No patient records found matching your search term.</td>
                </tr>
              ) : (
                filteredConsents.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 transition group">
                    
                    {/* Patient Name & Mobile Details */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{patient.name}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{patient.phone}</p>
                    </td>
                    
                    {/* Approved Permissions Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {patient.purpose}
                    </td>
                    
                    {/* Logged Date */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {patient.date}
                    </td>
                    
                    {/* Explicit Compliance Color Badge Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        patient.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {patient.status === 'Active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Approved & Safe</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-amber-600" />
                            <span>Withdrawn / Locked</span>
                          </>
                        )}
                      </span>
                    </td>
                    
                    {/* Functional Quick Actions Hub Grid */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(patient.id, patient.status, patient.name)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                            patient.status === 'Active'
                              ? 'bg-white hover:bg-amber-50 text-amber-700 border-slate-200 hover:border-amber-200'
                              : 'bg-teal-600 hover:bg-teal-500 text-white border-transparent shadow-sm'
                          }`}
                        >
                          {patient.status === 'Active' ? "Revoke Consent" : "Re-Approve Link"}
                        </button>
                        
                        <button
                          onClick={() => handleViewProof(patient)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3 text-teal-600" />
                          <span>View Digital Receipt</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AUDIT WINDOW OVERLAY */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl max-w-md w-full font-sans text-slate-800">
            <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm mb-4 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              <span>Official Patient Consent Receipt</span>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name:</span>
                  <p className="text-slate-900 font-bold">{activeReceipt.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Current Legal Status:</span>
                  <p className={`font-bold ${activeReceipt.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ● {activeReceipt.status === 'Active' ? "Authorized" : "Withdrawn"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Approved Access Limits:</span>
                <p className="text-slate-800 font-medium mt-0.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">{activeReceipt.purpose}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Tamper-Proof Audit Hash:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 break-all select-all mt-1">{activeReceipt.digitalLock}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Decentralized Facility Node Key:</span>
                <p className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-teal-700 mt-1">{activeReceipt.signatureKey}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Document Timestamp:</span>
                <span className="font-medium text-slate-700">{activeReceipt.timestamp}</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveReceipt(null)}
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
