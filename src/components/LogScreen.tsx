import React, { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { HistoryRecord } from '../types';

interface LogScreenProps {
  historyRecords: HistoryRecord[];
  setHistoryRecords: React.Dispatch<React.SetStateAction<HistoryRecord[]>>;
  currentAiRec: number;
  onTabChange: (tab: string) => void;
}

export default function LogScreen({
  historyRecords,
  setHistoryRecords,
  currentAiRec,
  onTabChange
}: LogScreenProps) {
  // Stepper state: default based on standard business
  const [prepared, setPrepared] = useState<number>(50);
  const [sold, setSold] = useState<number>(45);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Live calculations
  const leftovers = Math.max(0, prepared - sold);
  const wastePercent = prepared > 0 ? Math.round((leftovers / prepared) * 100) : 0;

  // Handle saving the logged record
  const handleSave = () => {
    // Generate date string for Malaysian locale (e.g., Sat, 4 Jul)
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString('en-MY', options);

    // Calculate accuracy %: deviation from AI Recommendation
    const deviation = Math.abs(sold - currentAiRec);
    const accuracyPercent = Math.max(
      0,
      Math.min(100, Math.round(100 - (deviation / currentAiRec) * 100))
    );

    const newRecord: HistoryRecord = {
      id: `record_${Date.now()}`,
      date: todayStr,
      prepared,
      sold,
      leftovers,
      aiRec: currentAiRec,
      accuracy: accuracyPercent,
    };

    setHistoryRecords((prev) => [newRecord, ...prev]);
    setSaveSuccess(true);

    // Automatically dismiss the success message after 2 seconds
    setTimeout(() => {
      setSaveSuccess(false);
      // Auto navigate to History tab to see the updated record
      onTabChange('history');
    }, 2000);
  };

  const handlePrepChange = (amount: number) => {
    setPrepared((prev) => {
      const newVal = Math.max(0, prev + amount);
      if (sold > newVal) {
        setSold(newVal);
      }
      return newVal;
    });
  };

  const handleSoldChange = (amount: number) => {
    setSold((prev) => Math.max(0, Math.min(prepared, prev + amount)));
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="log-screen-root">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#191C1E] tracking-tight">
          Daily Log
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Record today's numbers to update your AI model.
        </p>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div 
          className="bg-secondary-green text-white p-4 rounded-2xl flex items-center gap-3 shadow-[0_4px_16px_rgba(41,90,49,0.2)] animate-fade-in"
          id="log-success-banner"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[3px]" />
          </div>
          <div>
            <p className="text-sm font-bold">Saved — forecast updated</p>
          </div>
        </div>
      )}

      {/* Steppers Form Container */}
      <div className="space-y-6">
        
        {/* Stepper 1: Portions Prepared */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-zinc-100/50 space-y-4">
          <div className="flex items-center gap-2 text-zinc-600">
            <svg className="w-5 h-5 text-primary-purple" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500">Portions Prepared</h3>
          </div>

          <div className="flex items-center justify-between px-2">
            {/* Minus Button (56x56px touch target) */}
            <button
              onClick={() => handlePrepChange(-1)}
              className="w-14 h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              aria-label="Decrease portions prepared"
            >
              <Minus className="w-6 h-6 stroke-[3px]" />
            </button>

            {/* Display Quantity (36-44px bold) */}
            <div className="text-center min-w-[120px]">
              <span className="text-4xl font-extrabold text-primary-purple leading-none block">
                {prepared}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block mt-1">
                Portions
              </span>
            </div>

            {/* Plus Button (56x56px touch target) */}
            <button
              onClick={() => handlePrepChange(1)}
              className="w-14 h-14 rounded-full bg-primary-purple hover:bg-primary-purple/90 text-white flex items-center justify-center active:scale-90 transition-all shadow-md cursor-pointer"
              aria-label="Increase portions prepared"
            >
              <Plus className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* Stepper 2: Portions Sold */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-zinc-100/50 space-y-4">
          <div className="flex items-center gap-2 text-zinc-600">
            <svg className="w-5 h-5 text-primary-purple" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.266A2.266 2.266 0 003 5.266v4.3c0 .602.24 1.18.665 1.605l8.158 8.158a2.266 2.266 0 003.205 0l4.3-4.3a2.266 2.266 0 000-3.205l-8.158-8.158A2.266 2.266 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01" />
            </svg>
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500">Portions Sold</h3>
          </div>

          <div className="flex items-center justify-between px-2">
            {/* Minus Button (56x56px touch target) */}
            <button
              onClick={() => handleSoldChange(-1)}
              className="w-14 h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              aria-label="Decrease portions sold"
            >
              <Minus className="w-6 h-6 stroke-[3px]" />
            </button>

            {/* Display Quantity (36-44px bold) */}
            <div className="text-center min-w-[120px]">
              <span className="text-4xl font-extrabold text-primary-purple leading-none block">
                {sold}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block mt-1">
                Portions
              </span>
            </div>

            {/* Plus Button (56x56px touch target) */}
            <button
              onClick={() => handleSoldChange(1)}
              className="w-14 h-14 rounded-full bg-primary-purple hover:bg-primary-purple/90 text-white flex items-center justify-center active:scale-90 transition-all shadow-md cursor-pointer"
              aria-label="Increase portions sold"
            >
              <Plus className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>
        </div>

        {/* Real-time calculated Waste & Leftover Card */}
        <div className="bg-secondary-green/10 text-secondary-green rounded-2xl p-5 border border-secondary-green/20 flex items-center justify-between shadow-[0_4px_16px_rgba(41,90,49,0.04)]">
          <div className="space-y-1">
            {/* Headline is understandable without subtext */}
            <h4 className="font-extrabold text-lg text-secondary-green leading-snug">
              {leftovers} Leftover Portions
            </h4>
            <p className="text-xs font-semibold text-secondary-green/80">
              This equals {wastePercent}% food waste today.
            </p>
          </div>
          
          {/* Minimal design element representing efficiency */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-inner border border-secondary-green/15 shrink-0">
            <span className="text-sm font-extrabold text-secondary-green">
              {100 - wastePercent}%
            </span>
          </div>
        </div>

        {/* Save button, fully pill-shaped */}
        <button
          onClick={handleSave}
          disabled={saveSuccess}
          className="w-full py-4 bg-secondary-green hover:bg-secondary-green/95 text-white font-bold rounded-full shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50"
          id="save-daily-log-btn"
        >
          <Check className="w-5 h-5 stroke-[3px]" />
          <span>Save Today's Record</span>
        </button>

      </div>
    </div>
  );
}
