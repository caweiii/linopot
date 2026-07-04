import React from 'react';
import { History, Award, CheckCircle, Flame } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryScreenProps {
  historyRecords: HistoryRecord[];
  setHistoryRecords: React.Dispatch<React.SetStateAction<HistoryRecord[]>>;
  currentAiRec: number;
  onTabChange: (tab: string) => void;
}

export default function HistoryScreen({ 
  historyRecords, 
  setHistoryRecords,
  currentAiRec,
  onTabChange
}: HistoryScreenProps) {
  
  // Quick stats calculations
  const totalPrepared = historyRecords.reduce((sum, r) => sum + r.prepared, 0);
  const totalLeftovers = historyRecords.reduce((sum, r) => sum + r.leftovers, 0);
  const avgAccuracy = historyRecords.length > 0 
    ? Math.round(historyRecords.reduce((sum, r) => sum + r.accuracy, 0) / historyRecords.length)
    : 0;

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="history-screen-root">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#191C1E] tracking-tight">
          History Logs
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Detailed logs showing continuous AI model improvement.
        </p>
      </div>

      {/* Summary KPI Cards (Max 2 cards or inline stats for speed) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Avg Accuracy */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-zinc-100/50 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-purple/10 text-primary-purple flex items-center justify-center">
              <Award className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avg Accuracy</span>
          </div>
          <span className="text-3xl font-extrabold text-primary-purple leading-none block">
            {avgAccuracy}%
          </span>
        </div>

        {/* Card 2: Saved food portions */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-zinc-100/50 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary-green/10 text-secondary-green flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Saved</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-secondary-green leading-none">
              {totalLeftovers}
            </span>
            <span className="text-xs font-bold text-secondary-green">
              portions
            </span>
          </div>
        </div>
      </div>

      {/* Simple Reverse-Chronological List */}
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 overflow-hidden">
        {/* Table Header */}
        <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 grid grid-cols-5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">
          <span className="text-left">Date</span>
          <span>Prep</span>
          <span>Sold</span>
          <span>Waste</span>
          <span className="text-right">Accuracy</span>
        </div>

        {/* Records list */}
        <div className="divide-y divide-zinc-100" id="history-records-list">
          {historyRecords.map((record) => {
            // Stylize accuracy percentage colors
            const isHighAccuracy = record.accuracy >= 90;
            const isLowAccuracy = record.accuracy < 80;
            
            let accuracyColorClass = "text-primary-purple"; // normal/high
            if (isHighAccuracy) accuracyColorClass = "text-secondary-green font-black";
            if (isLowAccuracy) accuracyColorClass = "text-error-red font-bold";

            return (
              <div 
                key={record.id} 
                className="px-4 py-4 grid grid-cols-5 text-sm items-center text-center font-semibold text-zinc-700 hover:bg-zinc-50/40 transition-colors"
              >
                {/* Date */}
                <span className="text-left font-bold text-zinc-800 text-xs">
                  {record.date}
                </span>

                {/* Prepared portions */}
                <span className="text-zinc-600 font-bold">
                  {record.prepared}
                </span>

                {/* Sold portions */}
                <span className="text-zinc-800 font-extrabold">
                  {record.sold}
                </span>

                {/* Leftovers */}
                <span className={`font-bold ${record.leftovers > 10 ? 'text-error-red' : 'text-zinc-500'}`}>
                  {record.leftovers}
                </span>

                {/* Accuracy */}
                <span className={`text-right ${accuracyColorClass}`}>
                  {record.accuracy}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt to Log Today's data if user hasn't already */}
      <div className="text-center pt-2">
        <button
          onClick={() => onTabChange('log')}
          className="text-xs font-bold text-primary-purple bg-primary-purple/10 px-4 py-2.5 rounded-full hover:bg-primary-purple/15 transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Need to log today's sales?</span>
          <span className="underline">Click here</span>
        </button>
      </div>

    </div>
  );
}
