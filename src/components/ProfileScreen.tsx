import React, { useState } from 'react';
import { 
  Check, Store, Users, Languages, Calendar, CloudUpload, Bell, 
  Sun, Shield, Info, LogOut, ChevronRight, CheckCircle2
} from 'lucide-react';
import { VendorProfile } from '../types';

interface ProfileScreenProps {
  profile: VendorProfile;
  setProfile: React.Dispatch<React.SetStateAction<VendorProfile>>;
  onLogout?: () => void;
}

export default function ProfileScreen({ profile, setProfile, onLogout }: ProfileScreenProps) {
  const [isEditingStall, setIsEditingStall] = useState(false);
  const [editedStallName, setEditedStallName] = useState(profile.stallName);
  const [isEditingCustomers, setIsEditingCustomers] = useState(false);
  const [editedCustomers, setEditedCustomers] = useState(profile.avgCustomers);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Full Profile Editor State
  const [isEditingFullProfile, setIsEditingFullProfile] = useState(false);
  const [formStallName, setFormStallName] = useState(profile.stallName);
  const [formCategory, setFormCategory] = useState(profile.category);
  const [formAvgCustomers, setFormAvgCustomers] = useState(profile.avgCustomers);
  const [formOperatingDays, setFormOperatingDays] = useState(profile.operatingDays);
  const [formLanguage, setFormLanguage] = useState(profile.language);

  // Cycle Category
  const handleCategoryCycle = () => {
    const categories = ['Nasi Lemak', 'Mee Goreng', 'Roti Canai', 'Nasi Campur', 'Satay', 'Linopot'];
    const currentIdx = categories.indexOf(profile.category);
    const nextCategory = categories[(currentIdx + 1) % categories.length] || categories[0];
    setProfile(prev => ({ ...prev, category: nextCategory }));
    showToast(`Stall Category set to ${nextCategory}`);
  };

  // Cycle languages
  const handleLanguageChange = () => {
    const langs = ['Bahasa Malaysia', 'English', 'Mandarin'];
    const currentIdx = langs.indexOf(profile.language);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    setProfile(prev => ({ ...prev, language: nextLang }));
    showToast(`Language set to ${nextLang}`);
  };

  // Cycle operating days (using standard Sabah days)
  const handleOperatingDaysChange = () => {
    const schedules = ['Isnin - Sabtu', 'Isnin - Jumaat', 'Setiap Hari', 'Selasa - Ahad'];
    const currentIdx = schedules.indexOf(profile.operatingDays);
    const nextSchedule = schedules[(currentIdx + 1) % schedules.length];
    setProfile(prev => ({ ...prev, operatingDays: nextSchedule }));
    showToast(`Operating days set to ${nextSchedule}`);
  };

  // Toggle helpers
  const handleToggleNotifications = () => {
    setProfile(prev => {
      const nextVal = !prev.notificationsEnabled;
      showToast(nextVal ? "Notifications Enabled" : "Notifications Disabled");
      return { ...prev, notificationsEnabled: nextVal };
    });
  };

  const handleToggleWeather = () => {
    setProfile(prev => {
      const nextVal = !prev.weatherUpdatesEnabled;
      showToast(nextVal ? "Weather Updates Enabled" : "Weather Updates Disabled");
      return { ...prev, weatherUpdatesEnabled: nextVal };
    });
  };

  const handleToggleOfflineSync = () => {
    setProfile(prev => {
      const nextVal = !prev.offlineSync;
      showToast(nextVal ? "Offline Cloud Sync Activated" : "Offline Cloud Sync Deactivated");
      return { ...prev, offlineSync: nextVal };
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const saveStallName = () => {
    if (editedStallName.trim()) {
      setProfile(prev => ({ ...prev, stallName: editedStallName.trim() }));
      setIsEditingStall(false);
      showToast("Stall name updated!");
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="profile-screen-root">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary-purple text-white px-5 py-3 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-fade-in"
          id="profile-toast"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header & Identity */}
      <div className="flex flex-col items-center text-center space-y-3 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-white flex items-center justify-center p-1.5 overflow-hidden">
            <Store className="w-12 h-12 text-primary-purple" />
          </div>
          <span className="absolute bottom-1 right-1 bg-secondary-green text-white w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
            ✓
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-zinc-800 leading-tight tracking-tight">
            {profile.stallName}
          </h1>
          <p className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase mt-1">
            Vendor ID: #LP-8821
          </p>
        </div>

        <button
          onClick={() => {
            setFormStallName(profile.stallName);
            setFormCategory(profile.category);
            setFormAvgCustomers(profile.avgCustomers);
            setFormOperatingDays(profile.operatingDays);
            setFormLanguage(profile.language);
            setIsEditingFullProfile(true);
          }}
          className="bg-primary-purple/10 hover:bg-primary-purple/15 text-primary-purple text-xs font-bold px-4 py-2 rounded-full border border-primary-purple/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          id="edit-profile-btn"
        >
          <span>✏️ Edit Profile Details</span>
        </button>
      </div>

      {/* Stall Name Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Stall Name</span>
          <button 
            onClick={() => {
              if (isEditingStall) saveStallName();
              else setIsEditingStall(true);
            }}
            className="text-xs font-bold text-primary-purple hover:underline"
          >
            {isEditingStall ? "Save" : "Rename"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          {isEditingStall ? (
            <input 
              type="text"
              value={editedStallName}
              onChange={(e) => setEditedStallName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveStallName()}
              className="flex-1 px-3 py-2 border-2 border-primary-purple/35 rounded-xl font-bold text-zinc-800 text-base focus:outline-none focus:border-primary-purple bg-zinc-50"
              autoFocus
            />
          ) : (
            <span className="font-extrabold text-zinc-800 text-lg">
              {profile.stallName}
            </span>
          )}
          <Store className="w-5 h-5 text-zinc-400 shrink-0" />
        </div>
      </div>

      {/* Category and Average Customers info */}
      <div className="grid grid-cols-2 gap-4">
        {/* Category Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 flex flex-col justify-between h-24">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</span>
            <button 
              onClick={handleCategoryCycle}
              className="text-[10px] font-bold text-primary-purple hover:underline cursor-pointer"
            >
              Cycle
            </button>
          </div>
          <span className="font-black text-primary-purple text-lg leading-none">
            {profile.category}
          </span>
        </div>

        {/* Avg Customers Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 flex flex-col justify-between h-24">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avg Customers</span>
            <button 
              onClick={() => {
                if (isEditingCustomers) {
                  setProfile(prev => ({ ...prev, avgCustomers: editedCustomers }));
                  setIsEditingCustomers(false);
                  showToast("Average daily customers updated!");
                } else {
                  setEditedCustomers(profile.avgCustomers);
                  setIsEditingCustomers(true);
                }
              }}
              className="text-[10px] font-bold text-primary-purple hover:underline cursor-pointer"
            >
              {isEditingCustomers ? "Save" : "Edit"}
            </button>
          </div>
          {isEditingCustomers ? (
            <input 
              type="number"
              value={editedCustomers}
              onChange={(e) => setEditedCustomers(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-2 py-0.5 text-sm font-bold border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-primary-purple bg-zinc-50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setProfile(prev => ({ ...prev, avgCustomers: editedCustomers }));
                  setIsEditingCustomers(false);
                  showToast("Average daily customers updated!");
                }
              }}
            />
          ) : (
            <span className="font-black text-zinc-700 text-lg leading-none">
              {profile.avgCustomers} / day
            </span>
          )}
        </div>
      </div>

      {/* Operational Preferences Card Column */}
      <div className="space-y-3">
        <h3 className="font-black text-zinc-400 text-xs uppercase tracking-wider pl-1">
          Operational Settings
        </h3>

        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 overflow-hidden divide-y divide-zinc-100">
          
          {/* Operating Days row */}
          <div className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                <Calendar className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Operating Days</h4>
                <p className="text-sm font-extrabold text-zinc-700">{profile.operatingDays}</p>
              </div>
            </div>
            <button 
              onClick={handleOperatingDaysChange}
              className="text-xs font-bold text-primary-purple bg-primary-purple/10 hover:bg-primary-purple/15 px-3 py-1.5 rounded-full"
            >
              Change
            </button>
          </div>

          {/* Language row */}
          <div className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                <Languages className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Language</h4>
                <p className="text-sm font-extrabold text-zinc-700">{profile.language}</p>
              </div>
            </div>
            <button 
              onClick={handleLanguageChange}
              className="text-xs font-bold text-primary-purple bg-primary-purple/10 hover:bg-primary-purple/15 px-3 py-1.5 rounded-full"
            >
              Toggle
            </button>
          </div>

          {/* Offline Sync Status Indicator */}
          <div className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-green/10 text-secondary-green flex items-center justify-center">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-secondary-green text-[10px] uppercase tracking-wider">Offline Cloud Sync</h4>
                <p className="text-xs font-bold text-zinc-500">
                  {profile.offlineSync ? "Status: Fully Synced (Active)" : "Status: Paused"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleToggleOfflineSync}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                profile.offlineSync ? 'bg-secondary-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-400'
              }`}
              aria-label="Toggle offline cloud sync"
            >
              <Check className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>

      {/* App Reminders list */}
      <div className="space-y-3">
        <h3 className="font-black text-zinc-400 text-xs uppercase tracking-wider pl-1">
          App Preferences
        </h3>

        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 overflow-hidden divide-y divide-zinc-100">
          
          {/* Notification Reminders toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                <Bell className="w-5 h-5 text-zinc-600" />
              </div>
              <span className="text-sm font-bold text-zinc-700">Daily Forecast Alerts</span>
            </div>
            {/* Switch Toggle */}
            <button
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${
                profile.notificationsEnabled ? 'bg-primary-purple' : 'bg-zinc-200'
              }`}
              aria-label="Toggle notification reminders"
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-sm absolute transition-transform ${
                profile.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Weather Updates toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                <Sun className="w-5 h-5 text-zinc-600" />
              </div>
              <span className="text-sm font-bold text-zinc-700">Weather Forecast Integration</span>
            </div>
            {/* Switch Toggle */}
            <button
              onClick={handleToggleWeather}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${
                profile.weatherUpdatesEnabled ? 'bg-primary-purple' : 'bg-zinc-200'
              }`}
              aria-label="Toggle weather updates"
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-sm absolute transition-transform ${
                profile.weatherUpdatesEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* App Info row */}
          <div className="p-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                <Info className="w-5 h-5 text-zinc-600" />
              </div>
              <span className="font-bold text-zinc-700">About Linopot</span>
            </div>
            <span className="text-xs font-extrabold text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">v2.4.0 (Sabah Edition)</span>
          </div>
        </div>
      </div>

      {/* Log Out button */}
      <button
        onClick={() => {
          if (confirm("Are you sure you want to exit to the landing screen?")) {
            showToast("Returning to landing...");
            setTimeout(() => {
              if (onLogout) onLogout();
            }, 800);
          }
        }}
        className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 font-bold rounded-full flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer select-none border border-zinc-200"
        id="logout-button"
      >
        <LogOut className="w-5 h-5 shrink-0 stroke-[2.5px]" />
        <span>Exit Account</span>
      </button>

      {/* Edit Profile Full Sheet Modal */}
      {isEditingFullProfile && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-12" id="edit-profile-modal-overlay">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsEditingFullProfile(false)} 
          />
          
          <div className="bg-white border border-zinc-100 rounded-3xl w-full max-w-sm p-6 space-y-5 z-10 shadow-2xl relative max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-8 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-extrabold text-lg text-[#191C1E]">Edit Vendor Profile</h3>
              <button 
                onClick={() => setIsEditingFullProfile(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              
              {/* Stall Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Stall Name</label>
                <input 
                  type="text"
                  value={formStallName}
                  onChange={(e) => setFormStallName(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-800 text-sm focus:outline-none focus:border-primary-purple bg-zinc-50"
                  placeholder="Enter stall name"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Stall Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Nasi Lemak', 'Mee Goreng', 'Roti Canai', 'Nasi Campur', 'Satay', 'Linopot'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formCategory === cat 
                          ? 'bg-primary-purple text-white shadow-sm' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avg Daily Customers */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Avg Customers / Day</label>
                <input 
                  type="number"
                  value={formAvgCustomers}
                  onChange={(e) => setFormAvgCustomers(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-800 text-sm focus:outline-none focus:border-primary-purple bg-zinc-50"
                  min="1"
                />
              </div>

              {/* Operating Days */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Operating Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Isnin - Sabtu', 'Isnin - Jumaat', 'Setiap Hari', 'Selasa - Ahad'].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFormOperatingDays(days)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formOperatingDays === days 
                          ? 'bg-primary-purple text-white shadow-sm' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Preferred Language</label>
                <div className="flex flex-wrap gap-2">
                  {['Bahasa Malaysia', 'English', 'Mandarin'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setFormLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formLanguage === lang 
                          ? 'bg-primary-purple text-white shadow-sm' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditingFullProfile(false)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl text-center transition-all cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (formStallName.trim()) {
                    setProfile({
                      ...profile,
                      stallName: formStallName.trim(),
                      category: formCategory,
                      avgCustomers: formAvgCustomers,
                      operatingDays: formOperatingDays,
                      language: formLanguage,
                    });
                    setIsEditingFullProfile(false);
                    showToast("Profile successfully updated!");
                  } else {
                    showToast("Stall name cannot be empty");
                  }
                }}
                className="flex-1 py-3 bg-primary-purple hover:bg-primary-purple/95 text-white font-bold rounded-xl text-center transition-all shadow-md cursor-pointer text-sm"
                id="save-full-profile-button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
