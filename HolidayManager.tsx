
import React, { useState } from 'react';
import { Holiday } from '../types';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface HolidayManagerProps {
  holidays: Holiday[];
  setHolidays: (holidays: Holiday[]) => void;
}

const HolidayManager: React.FC<HolidayManagerProps> = ({ holidays, setHolidays }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const addHoliday = () => {
    if (!name || !date) return;
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name,
      date
    };
    const updated = [...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setHolidays(updated);
    setName('');
    setDate('');
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
        <p className="text-gray-500">Plan your absences smarter</p>
      </header>

      <div className="ios-card p-4 space-y-4">
        <h2 className="font-semibold text-lg">Add Holiday</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name (e.g. Winter Break)"
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={addHoliday}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add to Calendar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {holidays.length > 0 ? (
          holidays.map(h => (
            <div key={h.id} className="ios-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 text-orange-500 p-2 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-sm text-gray-500">{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <button 
                onClick={() => removeHoliday(h.id)}
                className="text-gray-300 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">No holidays added yet.</p>
        )}
      </div>
    </div>
  );
};

export default HolidayManager;
