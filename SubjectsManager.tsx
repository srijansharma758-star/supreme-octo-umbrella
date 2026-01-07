
import React, { useState } from 'react';
import { Subject, SyllabusItem } from '../types';
import { Plus, Trash2, Paperclip, ChevronRight, X } from 'lucide-react';

interface SubjectsManagerProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  updateSubject: (updated: Subject) => void;
}

const SubjectsManager: React.FC<SubjectsManagerProps> = ({ subjects, setSubjects, updateSubject }) => {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState('');

  const addSubject = () => {
    if (!newSubName.trim()) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubName,
      logs: [],
      syllabus: [],
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setShowAddSubject(false);
  };

  const deleteSubject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this subject and all its logs?')) {
      setSubjects(subjects.filter(s => s.id !== id));
      if (activeSubjectId === id) setActiveSubjectId(null);
    }
  };

  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  const toggleSyllabusItem = (itemId: string) => {
    if (!activeSubject) return;
    const newSyllabus = activeSubject.syllabus.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    updateSubject({ ...activeSubject, syllabus: newSyllabus });
  };

  const addSyllabusItem = () => {
    if (!activeSubject || !newTopic.trim()) return;
    const item: SyllabusItem = {
      id: Date.now().toString(),
      title: newTopic,
      isCompleted: false
    };
    updateSubject({ ...activeSubject, syllabus: [...activeSubject.syllabus, item] });
    setNewTopic('');
  };

  const deleteSyllabusItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSubject) return;
    updateSubject({
      ...activeSubject,
      syllabus: activeSubject.syllabus.filter(i => i.id !== itemId)
    });
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <button 
          onClick={() => setShowAddSubject(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      {showAddSubject && (
        <div className="ios-card p-4 space-y-4 border-2 border-blue-100 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">New Subject</h2>
            <button onClick={() => setShowAddSubject(false)}><X size={20} className="text-gray-400" /></button>
          </div>
          <input
            autoFocus
            type="text"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            placeholder="Subject Name (e.g. Physics)"
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={addSubject}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Create Subject
          </button>
        </div>
      )}

      <div className="space-y-3">
        {subjects.map(s => (
          <div key={s.id} className="space-y-2">
            <div 
              onClick={() => setActiveSubjectId(activeSubjectId === s.id ? null : s.id)}
              className={`ios-card p-4 flex items-center justify-between cursor-pointer transition-all ${activeSubjectId === s.id ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-10 rounded-full" style={{ backgroundColor: s.color }} />
                <div>
                  <h3 className="font-bold">{s.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    {s.syllabus.length} Topics • {s.logs.length} Classes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => deleteSubject(s.id, e)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <ChevronRight className={`text-gray-300 transition-transform duration-300 ${activeSubjectId === s.id ? 'rotate-90' : ''}`} size={20} />
              </div>
            </div>

            {activeSubjectId === s.id && (
              <div className="ml-4 p-5 ios-card space-y-5 animate-in fade-in slide-in-from-left duration-300">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Syllabus Breakdown</h4>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add new topic sentence..."
                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-400"
                  />
                  <button onClick={addSyllabusItem} className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  {s.syllabus.map(item => (
                    <div 
                      key={item.id}
                      className="flex items-start gap-1 group"
                    >
                      <button 
                        onClick={() => toggleSyllabusItem(item.id)}
                        className={`flex items-start gap-3 flex-1 py-3 px-2 rounded-xl transition-all ${item.isCompleted ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}
                      >
                        <Paperclip 
                          className={`shrink-0 mt-0.5 transition-colors ${item.isCompleted ? 'text-blue-500' : 'text-gray-300'}`} 
                          size={16} 
                          strokeWidth={2.5}
                        />
                        <span className={`text-sm leading-relaxed text-left flex-1 break-words ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                          {item.title}
                        </span>
                      </button>
                      <button 
                        onClick={(e) => deleteSyllabusItem(item.id, e)}
                        className="p-3 text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {s.syllabus.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-xs text-gray-400 italic">No syllabus topics yet. Tap above to add one.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsManager;
