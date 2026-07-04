import React from 'react';
import { Sparkles, TrendingUp, CheckSquare, Coins, ArrowRight } from 'lucide-react';
import { HistoryRecord, ForecastRecommendation, VendorProfile } from '../types';

interface HomeScreenProps {
  onTabChange: (tab: string) => void;
  historyRecords: HistoryRecord[];
  recommendation: ForecastRecommendation;
  profile: VendorProfile;
}

export default function HomeScreen({ 
  onTabChange, 
  historyRecords, 
  recommendation,
  profile
}: HomeScreenProps) {
  
  // Dynamic greeting based on Malaysian standard times
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Tengah Hari";
    return "Selamat Petang";
  };

  // Derive today's leftovers and RM savings based on last logged records
  const latestRecord = historyRecords[0] || { prepared: 50, sold: 45, leftovers: 5 };
  const yesterdayLeftovers = latestRecord.leftovers;
  
  // Dynamic new supporting line if there is genuinely new information (e.g., weather-based change)
  const getDynamicInsights = () => {
    const diff = recommendation.portions - latestRecord.prepared;
    if (diff < 0) {
      return `${Math.abs(diff)} fewer portions recommended than yesterday's actual prep.`;
    } else if (diff > 0) {
      return `${diff} more portions recommended due to Friday weekend rush.`;
    }
    return `Consistent portion demand expected for tomorrow.`;
  };

  // Total savings RM = (prepared - leftovers - etc). Let's calculate based on cumulative leftovers avoided
  // Let's assume each portion avoided from wasting saves RM 5.00
  const totalLeftovers = historyRecords.reduce((sum, r) => sum + r.leftovers, 0);
  const avgAccuracy = historyRecords.length > 0 
    ? Math.round(historyRecords.reduce((sum, r) => sum + r.accuracy, 0) / historyRecords.length)
    : 92;

  // Let's calculate the savings for the latest record or general food waste prevention
  const estimatedSavingsRM = totalLeftovers * 5; 

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="home-screen-root">
      
      {/* 1. GREETING HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-zinc-800 tracking-tight flex items-center gap-2">
          <span>👋</span>
          <span>{getGreeting()}, {profile.stallName.split("'")[0]}!</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Kak Siti's Nasi Lemak • Sabah, Malaysia
        </p>
      </div>

      {/* 3 CARDS MAX */}

      {/* CARD 1: HERO FORECAST CARD */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 relative overflow-hidden flex flex-col justify-between"
        id="hero-forecast-card"
      >
        <div className="flex justify-between items-start">
          <span className="text-xs font-extrabold text-primary-purple uppercase tracking-wider">
            AI Demand Forecast
          </span>
          <span className="bg-primary-purple/10 text-primary-purple text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary-purple/10">
            <Sparkles className="w-3.5 h-3.5 fill-primary-purple/10" />
            {recommendation.confidence}% confidence
          </span>
        </div>

        {/* Large numeric-display style (36-44px bold) */}
        <div className="mt-4">
          <h2 className="text-4xl font-extrabold text-primary-purple leading-tight tracking-tight">
            Prepare {recommendation.portions} portions tomorrow
          </h2>
          {/* Single supporting line ONLY if it adds NEW information */}
          <p className="text-sm font-semibold text-zinc-500 mt-2 leading-relaxed">
            {getDynamicInsights()}
          </p>
        </div>
      </div>

      {/* CARD 2: TODAY'S LEFTOVER / SAVINGS SUMMARY CARD */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40"
        id="savings-summary-card"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-green/10 text-secondary-green flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-zinc-800 text-lg leading-snug">
              RM {estimatedSavingsRM} Food Waste Saved
            </h3>
            {/* Supporting subtext has new information */}
            <p className="text-xs font-semibold text-zinc-500 leading-relaxed">
              Based on {yesterdayLeftovers} leftovers recorded yesterday, with an average of {avgAccuracy}% forecast accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* CARD 3: QUICK ACTIONS CARD */}
      <div 
        className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 space-y-4"
        id="quick-actions-card"
      >
        <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider pl-1">
          Quick Access
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Log Today's Sales */}
          <button
            onClick={() => onTabChange('log')}
            className="bg-primary-purple hover:bg-primary-purple/95 text-white p-4 rounded-2xl text-left transition-all active:scale-95 flex flex-col justify-between h-28 shadow-sm cursor-pointer"
            id="quick-action-log"
          >
            <CheckSquare className="w-6 h-6" />
            <div>
              <span className="font-bold text-sm block">Log Today</span>
              <span className="text-[10px] text-white/80 font-medium">Add sales & prep</span>
            </div>
          </button>

          {/* Action 2: View Forecast */}
          <button
            onClick={() => onTabChange('forecast')}
            className="bg-secondary-green hover:bg-secondary-green/95 text-white p-4 rounded-2xl text-left transition-all active:scale-95 flex flex-col justify-between h-28 shadow-sm cursor-pointer"
            id="quick-action-forecast"
          >
            <TrendingUp className="w-6 h-6" />
            <div>
              <span className="font-bold text-sm block">View Forecast</span>
              <span className="text-[10px] text-white/80 font-medium">Explore trends</span>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
