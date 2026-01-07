
import React, { useState } from 'react';
import { AppState, UserProfile } from '../types';
import { TrendingUp, CheckCircle2, Clock, Edit2 } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  updateUser: (user: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, updateUser }) => {
  const [isEditingUni, setIsEditingUni] = useState(false);
  const [tempUni, setTempUni] = useState(state.user?.university || '');

  const getSubjectStats = (logs: any[]) => {
    const p = logs.filter(l => l.status === 'P').length;
    const a = logs.filter(l => l.status === 'A').length;
    const total = p + a;
    return { attended: p, total, percentage: total > 0 ? (p / total) * 100 : 0 };
  };

  const overallAttended = state.subjects.reduce((acc, s) => acc + getSubjectStats(s.logs).attended, 0);
  const overallTotal = state.subjects.reduce((acc, s) => acc + getSubjectStats(s.logs).total, 0);
  const overallPercentage = overallTotal > 0 ? (overallAttended / overallTotal) * 100 : 0;

  const totalTopics = state.subjects.reduce((acc, s) => acc + s.syllabus.length, 0);
  const completedTopics = state.subjects.reduce((acc, s) => acc + s.syllabus.filter(t => t.isCompleted).length, 0);
  const syllabusPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const lowAttendanceSubjects = state.subjects.filter(s => {
    const stats = getSubjectStats(s.logs);
    return stats.total > 0 && stats.percentage < state.targetPercentage;
  });

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = DAYS[new Date().getDay()];
  const todayRoutine = state.routine
    .filter(r => r.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const saveUniversity = () => {
    if (state.user) {
      updateUser({ ...state.user, university: tempUni });
      setIsEditingUni(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-28 animate-slide">
      <header className="flex justify-between items-start pt-4 px-1">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-none">
            {state.user?.name || 'Hello, Scholar'}
          </h1>
          <div className="flex items-center gap-1.5 group">
            {isEditingUni ? (
              <div className="flex gap-2 items-center">
                <input 
                  autoFocus
                  className="text-sm bg-white border border-gray-200 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-blue-500"
                  value={tempUni}
                  onChange={(e) => setTempUni(e.target.value)}
                  onBlur={saveUniversity}
                  onKeyDown={(e) => e.key === 'Enter' && saveUniversity()}
                />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-400">
                  {state.user?.university || 'University Student'}
                </p>
                <button onClick={() => setIsEditingUni(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 size={10} className="text-gray-300" />
                </button>
              </>
            )}
          </div>
        </div>
        {state.user?.picture && (
          <img src={state.user.picture} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md" alt="profile" />
        )}
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="ios-card p-4 flex flex-col gap-2 bg-white/80 backdrop-blur-md">
          <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
          <span className="text-2xl font-black text-gray-900">{overallPercentage.toFixed(1)}%</span>
        </div>
        <div className="ios-card p-4 flex flex-col gap-2 bg-white/80 backdrop-blur-md">
          <div className="bg-green-50 text-green-600 w-10 h-10 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syllabus</span>
          <span className="text-2xl font-black text-gray-900">{syllabusPercentage.toFixed(0)}%</span>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold px-1 tracking-tight">Today's Schedule</h2>
        <div className="ios-card overflow-hidden">
          {todayRoutine.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {todayRoutine.map((entry) => {
                const sub = state.subjects.find(s => s.id === entry.subjectId);
                return (
                  <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: sub?.color || '#eee' }} />
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{sub?.name || 'Unknown'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{entry.startTime} - {entry.endTime}</p>
                      </div>
                    </div>
                    {entry.room && <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-black uppercase border border-gray-100">{entry.room}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center">
              <Clock className="mx-auto text-gray-200 mb-2" size={32} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">Enjoy your day off!</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold px-1 tracking-tight">Attention Needed</h2>
        {lowAttendanceSubjects.length > 0 ? (
          lowAttendanceSubjects.map(s => {
            const stats = getSubjectStats(s.logs);
            return (
              <div key={s.id} className="ios-card p-4 flex items-center justify-between border-l-4 border-red-500">
                <div>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{stats.percentage.toFixed(0)}% • Target {state.targetPercentage}%</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="ios-card p-6 text-center border border-green-50">
            <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
            <p className="text-gray-600 font-bold uppercase tracking-tighter text-sm">You are excelling!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
