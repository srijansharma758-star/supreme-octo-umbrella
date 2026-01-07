
import React from 'react';
import { TabType } from '../types';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  Palmtree,
  Clock
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'routine', label: 'Routine', icon: Clock },
    { id: 'attendance', label: 'Logs', icon: CalendarCheck },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'holidays', label: 'Holidays', icon: Palmtree },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-blur border-t border-gray-200 px-4 pb-8 pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
