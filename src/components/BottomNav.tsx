import React from 'react';
import { Home, TrendingUp, CheckSquare, History, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'log', label: 'Log', icon: CheckSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pb-5 pt-3 z-30 rounded-t-2xl">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 cursor-pointer select-none group"
              id={`nav-item-${tab.id}`}
            >
              {/* Pill container for the active icon, Material Design 3 style */}
              <div
                className={`flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-purple/10 text-primary-purple scale-105'
                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              </div>
              
              {/* Text label */}
              <span
                className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${
                  isActive ? 'text-primary-purple font-extrabold' : 'text-zinc-400 group-hover:text-zinc-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

