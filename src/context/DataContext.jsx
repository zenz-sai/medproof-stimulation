import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  // --- DEFAULT SEEDED DATA ---
  const initialConsents = [
    { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', purpose: 'Treatment + Reports', date: 'Today, 10:32 AM', status: 'Active', proofHash: '0x3a1b4c...iome' },
    { id: 2, name: 'Rahul Verma', phone: '+91 87654 32109', purpose: 'Treatment Only', date: 'Today, 09:15 AM', status: 'Active', proofHash: '0x9e2f5d...iome' },
    { id: 3, name: 'Anita Patel', phone: '+91 76543 21098', purpose: 'Treatment + Marketing', date: 'Yesterday', status: 'Active', proofHash: '0x7c8b1a...iome' },
    { id: 4, name: 'Vikram Singh', phone: '+91 65432 10987', purpose: 'Treatment + Reports', date: 'Jan 22, 2026', status: 'Withdrawn', proofHash: '0x4f5e6d...iome' }
  ];

  const initialReports = [
    { id: 1, name: 'Priya Sharma', test: 'Blood Test', sent: '10:32 AM', delivered: '10:32 AM', viewed: '10:45 AM', status: 'Viewed' },
    { id: 2, name: 'Rahul Verma', test: 'X-Ray Report', sent: '09:15 AM', delivered: '09:15 AM', viewed: '09:30 AM', status: 'Viewed' },
    { id: 3, name: 'Anita Patel', test: 'MRI Scan', sent: '08:45 AM', delivered: '08:45 AM', viewed: null, status: 'Delivered' },
    { id: 4, name: 'Vikram Singh', test: 'Blood Test', sent: '08:00 AM', delivered: 'Pending', viewed: null, status: 'Pending' }
  ];

  const initialActivity = [
    { id: 1, user: 'Priya Sharma', action: 'Consent collected', time: '2 min ago' },
    { id: 2, user: 'Rahul Verma', action: 'Lab report delivered', time: '5 min ago' }
  ];

  const [consents, setConsents] = useState(() => JSON.parse(localStorage.getItem('mp_consents')) || initialConsents);
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('mp_reports')) || initialReports);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem('mp_activities')) || initialActivity);
  const [breachState, setBreachState] = useState(() => JSON.parse(localStorage.getItem('mp_breach')) || { active: false, timestamp: null, elapsed: 0 });
  const [currentSession, setCurrentSession] = useState(() => JSON.parse(localStorage.getItem('mp_active_session')) || null);

  // --- CROSS-TAB REALTIME SYNCHRONIZER ENGINE ---
  useEffect(() => {
    const handleCrossTabUpdates = (event) => {
      if (event.key === 'mp_consents' && event.newValue) {
        setConsents(JSON.parse(event.newValue));
      }
      if (event.key === 'mp_reports' && event.newValue) {
        setReports(JSON.parse(event.newValue));
      }
      if (event.key === 'mp_activities' && event.newValue) {
        setActivities(JSON.parse(event.newValue));
      }
      if (event.key === 'mp_breach' && event.newValue) {
        setBreachState(JSON.parse(event.newValue));
      }
      if (event.key === 'mp_active_session') {
        setCurrentSession(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    // Listen to changes coming from other browser tabs
    window.addEventListener('storage', handleCrossTabUpdates);
    return () => window.removeEventListener('storage', handleCrossTabUpdates);
  }, []);

  useEffect(() => { localStorage.setItem('mp_consents', JSON.stringify(consents)); }, [consents]);
  useEffect(() => { localStorage.setItem('mp_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('mp_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('mp_breach', JSON.stringify(breachState)); }, [breachState]);
  useEffect(() => { localStorage.setItem('mp_active_session', JSON.stringify(currentSession)); }, [currentSession]);

  const triggerSimulationAction = async (type) => {
    if (type === 'WITHDRAW_PRIYA') {
      const updated = consents.map(c => c.name === 'Priya Sharma' ? { ...c, status: 'Withdrawn' } : c);
      setConsents(updated);
      const acts = [{ id: Date.now(), user: 'Priya Sharma', action: 'Consent withdrawn via patient portal', time: 'Just now' }, ...activities];
      setActivities(acts);
      // Explicitly trigger a local dispatch so current window reacts immediately if triggered locally
      localStorage.setItem('mp_consents', JSON.stringify(updated));
      localStorage.setItem('mp_activities', JSON.stringify(acts));
    } else if (type === 'SIMULATE_BATCH_LAB') {
      const newReport = { 
        id: Date.now(), 
        name: 'Priya Sharma', 
        test: 'Routine CBC Test', 
        sent: 'Just now', 
        delivered: 'Just now', 
        viewed: null, 
        status: 'Delivered',
        simulatedLink: `${window.location.origin}/user?access=token_${Math.floor(Math.random() * 900000 + 100000)}&from=${currentSession ? encodeURIComponent(currentSession.name) : 'Provider'}`
      };
      setReports(prev => [newReport, ...prev]);
      setActivities(prev => [{ id: Date.now(), user: 'Priya Sharma', action: 'Bulk verified & auto-routed', time: 'Just now' }, ...prev]);
    } else if (type === 'BREACH_TRIGGER') {
      setBreachState({ active: true, timestamp: new Date().toLocaleTimeString(), elapsed: 0 });
      setActivities(prev => [{ id: Date.now(), user: 'System Sec', action: 'Data anomaly detected: 72H countdown initialized', time: 'Just now' }, ...prev]);
    } else if (type === 'CLEAR_ALL') {
      localStorage.clear();
      setConsents(initialConsents);
      setReports(initialReports);
      setActivities(initialActivity);
      setBreachState({ active: false, timestamp: null, elapsed: 0 });
    }
  };

  return (
    <DataContext.Provider value={{ consents, setConsents, reports, setReports, activities, setActivities, breachState, currentSession, setCurrentSession, triggerSimulationAction }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
