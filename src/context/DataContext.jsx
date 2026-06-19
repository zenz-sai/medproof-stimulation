import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  // --- DEFAULT SEEDED DATA ---
  const initialConsents = [
    { id: 190249029, name: 'Priya Sharma', phone: '+91 98765 43210', purpose: 'Treatment + Reports', date: 'Today, 10:32 AM', status: 'Active', proofHash: '0x3a1b4c...iome' },
    { id: 393904000400, name: 'Rahul Verma', phone: '+91 87654 32109', purpose: 'Treatment Only', date: 'Today, 09:15 AM', status: 'Active', proofHash: '0x9e2f5d...iome' },
    { id: 249249029029, name: 'Anita Patel', phone: '+91 76543 21098', purpose: 'Treatment + Marketing', date: 'Yesterday', status: 'Active', proofHash: '0x7c8b1a...iome' },
    { id: 58332023, name: 'Vikram Singh', phone: '+91 65432 10987', purpose: 'Treatment + Reports', date: 'Jan 22, 2026', status: 'Withdrawn', proofHash: '0x4f5e6d...iome' }
  ];

  const initialReports = [
    { id: 190249029, name: 'Priya Sharma', test: 'Blood Test', sent: '10:32 AM', delivered: 'Locked in Wallet', viewed: '10:45 AM', status: 'Viewed', blockchainHash: '0x9e2f5d7c8b1a4f5e6d...', signature: '0x3a1b4c9e2f5d7c8b1a...' },
    { id: 58332023, name: 'Rahul Verma', test: 'X-Ray Report', sent: '09:15 AM', delivered: 'Locked in Wallet', viewed: '09:30 AM', status: 'Viewed', blockchainHash: '0x7c8b1a9e2f5d7c8b1a...', signature: '0x4f5e6d7c8b1a4f5e6d...' }
  ];

  const initialActivity = [
    { id: 1, user: 'System Hub', action: 'Decentralized IOMe Node Gateway Active', time: '2 min ago' },
    { id: 2, user: 'IOMe Gateway', action: 'Token handshake verified: State anchored on ledger', time: '5 min ago' }
  ];

  const [consents, setConsents] = useState(() => JSON.parse(localStorage.getItem('mp_consents')) || initialConsents);
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('mp_reports')) || initialReports);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem('mp_activities')) || initialActivity);
  const [breachState, setBreachState] = useState(() => JSON.parse(localStorage.getItem('mp_breach')) || { active: false, timestamp: null, elapsed: 0 });
  const [currentSession, setCurrentSession] = useState(() => JSON.parse(localStorage.getItem('mp_active_session')) || null);
  
  // NEW: Realtime state bucket keeping incoming wallet authorizations in sync across open tabs
  const [activeWalletRequests, setActiveWalletRequests] = useState(() => JSON.parse(localStorage.getItem('mp_wallet_requests')) || []);

  // --- CROSS-TAB REALTIME SYNCHRONIZER ENGINE ---
  useEffect(() => {
    const handleCrossTabUpdates = (event) => {
      if (!event.newValue) return;
      try {
        if (event.key === 'mp_consents') setConsents(JSON.parse(event.newValue));
        if (event.key === 'mp_reports') setReports(JSON.parse(event.newValue));
        if (event.key === 'mp_activities') setActivities(JSON.parse(event.newValue));
        if (event.key === 'mp_breach') setBreachState(JSON.parse(event.newValue));
        if (event.key === 'mp_active_session') setCurrentSession(JSON.parse(event.newValue));
        if (event.key === 'mp_wallet_requests') setActiveWalletRequests(JSON.parse(event.newValue));
      } catch (err) {
        console.error("Cross-tab synchronization parse exception: ", err);
      }
    };

    window.addEventListener('storage', handleCrossTabUpdates);
    return () => window.removeEventListener('storage', handleCrossTabUpdates);
  }, []);

  useEffect(() => { localStorage.setItem('mp_consents', JSON.stringify(consents)); }, [consents]);
  useEffect(() => { localStorage.setItem('mp_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('mp_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('mp_breach', JSON.stringify(breachState)); }, [breachState]);
  useEffect(() => { localStorage.setItem('mp_active_session', JSON.stringify(currentSession)); }, [currentSession]);
  useEffect(() => { localStorage.setItem('mp_wallet_requests', JSON.stringify(activeWalletRequests)); }, [activeWalletRequests]);

  const triggerSimulationAction = async (type) => {
    if (type === 'BREACH_TRIGGER') {
      const emergencyState = { active: true, timestamp: new Date().toLocaleTimeString(), elapsed: 0 };
      setBreachState(emergencyState);
      const acts = [{ id: Date.now(), user: 'System Sec', action: 'Data anomaly detected: 72H countdown initialized', time: 'Just now' }, ...activities];
      setActivities(acts);
      
      localStorage.setItem('mp_breach', JSON.stringify(emergencyState));
      localStorage.setItem('mp_activities', JSON.stringify(acts));
    } 
    
    else if (type === 'CLEAR_ALL') {
      localStorage.clear();
      setConsents(initialConsents);
      setReports(initialReports);
      setActivities(initialActivity);
      setBreachState({ active: false, timestamp: null, elapsed: 0 });
      setActiveWalletRequests([]);
      setCurrentSession(null);
    }
  };

  return (
    <DataContext.Provider value={{ 
      consents, setConsents, 
      reports, setReports, 
      activities, setActivities, 
      breachState, setBreachState,
      currentSession, setCurrentSession, 
      activeWalletRequests, setActiveWalletRequests,
      triggerSimulationAction 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
