
import React, { useState } from 'react';
import { Subject, RoutineEntry } from '../types';
import { Plus, Trash2, Clock, MapPin, X, ChevronRight } from 'lucide-react';

interface RoutineManagerProps {
  subjects: Subject[];
  routine: RoutineEntry[];
  setRoutine: (routine: RoutineEntry[]) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RoutineManager: React.FC<RoutineManagerProps> = ({ subjects, routine, setRoutine }) => {
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [showAdd, setShowAdd] = useState(false);
  
  // Form State
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');

  const addEntry = () => {
    if (!selectedSubId) return;
    const newEntry: RoutineEntry = {
      id: Date.now().toString(),
      subjectId: selectedSubId,
      day: activeDay,
      startTime,
      endTime,
      room: room.trim() || undefined
    };
    const updated = [...routine, newEntry].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setRoutine(updated);
    setShowAdd(false);
    setRoom('');
  };

  const deleteEntry = (id: string) => {
    setRoutine(routine.filter(r => r.id !== id));
  };

  const dayRoutine = routine.filter(r => r.day === activeDay);

  return (
    <div className="p-4 space-y-6 pb-28">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Routine</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
              activeDay === day 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-500'
            }`}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="ios-card p-5 space-y-4 border-2 border-blue-100 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Add Class to {activeDay}</h2>
            <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Subject</label>
              <select 
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 mt-1"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Start</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">End</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Room / Link</label>
              <input 
                type="text" 
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Hall 4B"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 mt-1"
              />
            </div>

            <button 
              onClick={addEntry}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all mt-2"
            >
              Save Schedule
            </button>
          </div>
        </div>
      )}

      <div className="relative space-y-4 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
        {dayRoutine.length > 0 ? (
          dayRoutine.map(entry => {
            const subject = subjects.find(s => s.id === entry.subjectId);
            return (
              <div key={entry.id} className="flex gap-4 items-start relative group">
                <div className="z-10 bg-white p-1 rounded-full border-2 border-blue-500 mt-1 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <div className="flex-1 ios-card p-4 flex justify-between items-center transition-transform active:scale-[0.98]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-500 tracking-tight">
                        {entry.startTime} — {entry.endTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: subject?.color || '#000' }}>
                      {subject?.name || 'Deleted Subject'}
                    </h3>
                    {entry.room && (
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400 font-medium">{entry.room}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Clock size={32} className="text-gray-200" />
            </div>
            <p className="text-sm text-gray-400 font-medium">No classes scheduled for {activeDay}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineManager;
