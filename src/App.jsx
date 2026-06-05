import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import DashboardLayout from './components/DashboardLayout';
import HospitalDashboard from './components/HospitalDashboard';
import ConsentCollection from './components/ConsentCollection';
import ReportDelivery from './components/ReportDelivery';
import BreachManagement from './components/BreachManagement';
import PatientPortal from './components/PatientPortal'; // <-- Add this new import statement

export default function App() {
  // Master URL layout route selector state ('hospital' vs 'patient')
  const [appRole, setAppRole] = useState('hospital');
  const [currentTab, setTab] = useState('dashboard');

  return (
    <DataProvider>
      <div className="w-screen min-h-screen flex flex-col">
        
        {/* QUICK SIMULATION DEMO ROUTE SELECTOR BAR STRIP */}
        <div className="w-full bg-slate-950 text-white px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-sans shrink-0 z-50">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="text-slate-400 font-medium">MedProof App Switcher:</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setAppRole('hospital')}
              className={`px-3 py-1 rounded-md font-bold transition ${appRole === 'hospital' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              🏥 View Hospital Dashboard (/dashboard)
            </button>
            <button 
              onClick={() => setAppRole('patient')}
              className={`px-3 py-1 rounded-md font-bold transition ${appRole === 'patient' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              📱 View Mobile Patient Portal (/user)
            </button>
          </div>
        </div>

        {/* COMPONENT CONDITIONAL RENDERING CONTAINER WINDOW */}
        {appRole === 'patient' ? (
          /* RENDER MOBILE PATIENT CABIN VIEW PORTAL */
          <PatientPortal />
        ) : (
          /* RENDER ADMIN SHIELD SIDEBAR SHELL CONTEXT */
          <DashboardLayout currentTab={currentTab} setTab={setTab}>
            {currentTab === 'dashboard' && <HospitalDashboard />}
            {currentTab === 'consent' && <ConsentCollection />}
            {currentTab === 'reports' && <ReportDelivery />}
            {currentTab === 'breach' && <BreachManagement />}
          </DashboardLayout>
        )}

      </div>
    </DataProvider>
  );
}
