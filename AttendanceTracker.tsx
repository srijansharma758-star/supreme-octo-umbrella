
import React, { useState } from 'react';
import { Subject, AttendanceStatus, AttendanceRecord } from '../types';
import { Plus, Trash2, Calendar, History, X } from 'lucide-react';

interface AttendanceTrackerProps {
  subjects: Subject[];
  updateSubject: (updated: Subject) => void;
  target: number;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ subjects, updateSubject, target }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logStatus, setLogStatus] = useState<AttendanceStatus>('P');
  const [showHistory, setShowHistory] = useState(false);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const addLog = () => {
    if (!selectedSubject) return;
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: logDate,
      status: logStatus
    };
    const updatedLogs = [...selectedSubject.logs, newRecord].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    updateSubject({ ...selectedSubject, logs: updatedLogs });
  };

  const removeLog = (logId: string) => {
    if (!selectedSubject) return;
    updateSubject({
      ...selectedSubject,
      logs: selectedSubject.logs.filter(l => l.id !== logId)
    });
  };

  const getStats = (logs: AttendanceRecord[]) => {
    const p = logs.filter(l => l.status === 'P').length;
    const a = logs.filter(l => l.status === 'A').length;
    const h = logs.filter(l => l.status === 'H').length;
    const total = p + a;
    const percentage = total > 0 ? (p / total) * 100 : 0;
    return { p, a, h, total, percentage };
  };

  const stats = selectedSubject ? getStats(selectedSubject.logs) : { p: 0, a: 0, h: 0, total: 0, percentage: 0 };

  return (
    <div className="p-4 space-y-6 pb-28">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
        >
          <History size={24} />
        </button>
      </header>

      {/* Subject Picker */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectId(s.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
              selectedSubjectId === s.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-500'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {selectedSubject && !showHistory && (
        <div className="space-y-4">
          <div className="ios-card p-6 text-center space-y-2">
            <div className={`text-5xl font-black ${stats.percentage < target ? 'text-red-500' : 'text-green-500'}`}>
              {stats.percentage.toFixed(0)}%
            </div>
            <p className="text-gray-500 font-medium">Current Attendance</p>
            <div className="flex justify-center gap-4 pt-2">
              <div className="text-center">
                <div className="text-sm font-bold text-green-600">{stats.p}</div>
                <div className="text-[10px] text-gray-400 uppercase">Present</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-red-600">{stats.a}</div>
                <div className="text-[10px] text-gray-400 uppercase">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-orange-600">{stats.h}</div>
                <div className="text-[10px] text-gray-400 uppercase">Holiday</div>
              </div>
            </div>
          </div>

          <div className="ios-card p-6 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> 
              Log Attendance
            </h2>
            
            <div className="space-y-3">
              <input 
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-blue-500"
              />

              {/* iOS Style Segmented Control */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['P', 'A', 'H'] as AttendanceStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setLogStatus(status)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      logStatus === status 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-400'
                    }`}
                  >
                    {status === 'P' ? 'Present' : status === 'A' ? 'Absent' : 'Holiday'}
                  </button>
                ))}
              </div>

              <button 
                onClick={addLog}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
              >
                <Plus size={20} /> Record Class
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSubject && showHistory && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <h2 className="px-2 text-sm font-bold text-gray-400 uppercase">Recent History</h2>
          {selectedSubject.logs.length > 0 ? (
            selectedSubject.logs.map(log => (
              <div key={log.id} className="ios-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    log.status === 'P' ? 'bg-green-100 text-green-600' :
                    log.status === 'A' ? 'bg-red-100 text-red-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {log.status}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      {log.status === 'P' ? 'Class Attended' : log.status === 'A' ? 'Class Missed' : 'Official Holiday'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeLog(log.id)}
                  className="text-gray-300 hover:text-red-500 p-2"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10 italic">No logs found for this subject.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
