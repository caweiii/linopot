import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import ForecastScreen from './components/ForecastScreen';
import LogScreen from './components/LogScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';

import { 
  initialRecommendation, 
  initialHistoryRecords, 
  initialProfile 
} from './data';
import { ForecastRecommendation, HistoryRecord, VendorProfile } from './types';

export default function App() {
  // Navigation active tab: 'home' | 'forecast' | 'history' | 'profile' | 'log'
  const [activeTab, setActiveTab] = useState<string>('forecast'); // Default to Forecast matching first screenshot


  // Main Persistent States
  const [recommendation, setRecommendation] = useState<ForecastRecommendation>(() => {
    const saved = localStorage.getItem('linopot_recommendation');
    return saved ? JSON.parse(saved) : initialRecommendation;
  });

  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
    const saved = localStorage.getItem('linopot_history');
    return saved ? JSON.parse(saved) : initialHistoryRecords;
  });

  const [profile, setProfile] = useState<VendorProfile>(() => {
    const saved = localStorage.getItem('linopot_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('linopot_recommendation', JSON.stringify(recommendation));
  }, [recommendation]);

  useEffect(() => {
    localStorage.setItem('linopot_history', JSON.stringify(historyRecords));
  }, [historyRecords]);

  useEffect(() => {
    localStorage.setItem('linopot_profile', JSON.stringify(profile));
  }, [profile]);

  // Adjust portion callback from Forecast screen
  const handleSaveAdjustment = (newPortions: number) => {
    setRecommendation(prev => ({ ...prev, portions: newPortions }));
  };

  // Switch tabs smoothly
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-100 font-sans antialiased text-[#191C1E] flex justify-center py-0 md:py-8 px-0 md:px-4">
      
      {/* Centered Device Wrapper for perfect visual simulation inside iframe/desktops */}
      <div 
        className="w-full max-w-md bg-brand-bg md:rounded-[40px] md:shadow-[0_4px_32px_rgba(0,0,0,0.08)] md:border-8 md:border-zinc-200 overflow-hidden relative flex flex-col h-screen md:h-[850px] max-h-screen md:max-h-[900px]"
        id="app-device-frame"
      >
        {/* Header bar */}
        <Header onNavigate={handleTabChange} />

        {/* Dynamic Screen Content Area */}
        <main className="flex-1 px-4 pt-6 pb-28 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen 
              onTabChange={handleTabChange}
              historyRecords={historyRecords}
              recommendation={recommendation}
              profile={profile}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastScreen 
              recommendation={recommendation}
              setRecommendation={setRecommendation}
              onSaveAdjustment={handleSaveAdjustment}
            />
          )}

          {activeTab === 'log' && (
            <LogScreen 
              historyRecords={historyRecords}
              setHistoryRecords={setHistoryRecords}
              currentAiRec={recommendation.originalRecommendation}
              onTabChange={handleTabChange}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen 
              historyRecords={historyRecords}
              setHistoryRecords={setHistoryRecords}
              currentAiRec={recommendation.originalRecommendation}
              onTabChange={handleTabChange}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen 
              profile={profile}
              setProfile={setProfile}
              onLogout={() => {
                localStorage.removeItem('linopot_recommendation');
                localStorage.removeItem('linopot_history');
                localStorage.removeItem('linopot_profile');
                window.location.reload();
              }}
            />
          )}
        </main>

        {/* Fixed Bottom Tab Navigation */}
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>
    </div>
  );
}
