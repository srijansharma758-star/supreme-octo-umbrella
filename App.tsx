
import React, { useState, useEffect } from 'react';
import { AppState, Subject, Holiday, TabType, RoutineEntry, UserProfile } from './types';
import { loadData, saveData, clearData } from './services/storage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AttendanceTracker from './components/AttendanceTracker';
import SubjectsManager from './components/SubjectsManager';
import HolidayManager from './components/HolidayManager';
import RoutineManager from './components/RoutineManager';
import Login from './components/Login';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadData());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    saveData(state);
  }, [state]);

  const handleLogin = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => {
    if (confirm('Sign out? Your data is saved locally.')) {
      setState(prev => ({ ...prev, user: null }));
    }
  };

  const updateUser = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const updateSubject = (updatedSubject: Subject) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s)
    }));
  };

  const setSubjects = (subjects: Subject[]) => {
    setState(prev => ({ ...prev, subjects }));
  };

  const setHolidays = (holidays: Holiday[]) => {
    setState(prev => ({ ...prev, holidays }));
  };

  const setRoutine = (routine: RoutineEntry[]) => {
    setState(prev => ({ ...prev, routine }));
  };

  if (!state.user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} updateUser={updateUser} />;
      case 'routine':
        return <RoutineManager subjects={state.subjects} routine={state.routine} setRoutine={setRoutine} />;
      case 'attendance':
        return (
          <AttendanceTracker 
            subjects={state.subjects} 
            updateSubject={updateSubject} 
            target={state.targetPercentage} 
          />
        );
      case 'subjects':
        return (
          <div className="space-y-4">
            <SubjectsManager subjects={state.subjects} setSubjects={setSubjects} updateSubject={updateSubject} />
            <div className="px-4 pb-28">
               <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-2xl bg-white text-red-500 font-bold text-sm border border-red-50 flex items-center justify-center gap-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        );
      case 'holidays':
        return <HolidayManager holidays={state.holidays} setHolidays={setHolidays} />;
      default:
        return <Dashboard state={state} updateUser={updateUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto relative shadow-2xl border-x border-gray-100">
      <main className="min-h-screen overflow-y-auto hide-scrollbar">
        {renderTab()}
      </main>
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
