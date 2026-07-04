import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, HelpCircle, 
  Check, Plus, Minus, X, ChevronDown, ChevronUp, Sun, Calendar, AlertCircle
} from 'lucide-react';
import { ForecastRecommendation } from '../types';
import { weeklyTrendData } from '../data';

interface ForecastScreenProps {
  recommendation: ForecastRecommendation;
  setRecommendation: React.Dispatch<React.SetStateAction<ForecastRecommendation>>;
  onSaveAdjustment: (newPortions: number) => void;
}

export default function ForecastScreen({ 
  recommendation, 
  setRecommendation,
  onSaveAdjustment
}: ForecastScreenProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [tempPortions, setTempPortions] = useState(recommendation.portions);
  const [isAccepted, setIsAccepted] = useState(recommendation.isAccepted);
  
  // Collapse/Expand state for factors
  const [showFactors, setShowFactors] = useState(false);

  const handleAdjustClick = () => {
    setTempPortions(recommendation.portions);
    setIsAdjusting(true);
  };

  const handleConfirmAdjustment = () => {
    const deviation = Math.abs(tempPortions - recommendation.originalRecommendation);
    let newConfidence = 92;
    if (deviation === 0) {
      newConfidence = 92;
    } else if (deviation <= 2) {
      newConfidence = 88;
    } else if (deviation <= 5) {
      newConfidence = 78;
    } else if (deviation <= 10) {
      newConfidence = 64;
    } else {
      newConfidence = 50;
    }

    let comparisonText = '4 fewer portions than yesterday.';
    const diffFromYesterday = tempPortions - 50; // default yesterday was 50
    if (diffFromYesterday < 0) {
      comparisonText = `${Math.abs(diffFromYesterday)} fewer portions than yesterday.`;
    } else if (diffFromYesterday > 0) {
      comparisonText = `${diffFromYesterday} more portions than yesterday.`;
    } else {
      comparisonText = `Same portions as yesterday.`;
    }

    setRecommendation(prev => ({
      ...prev,
      portions: tempPortions,
      confidence: newConfidence,
      comparisonText,
      isAccepted: false,
    }));

    setIsAccepted(false);
    onSaveAdjustment(tempPortions);
    setIsAdjusting(false);
  };

  const handleAcceptClick = () => {
    setIsAccepted(true);
    setRecommendation(prev => ({ ...prev, isAccepted: true }));
  };

  // SVG Line Chart coordinates calculation for 7 data points
  // We have trend values from data: M:35, T:42, W:38, T:48, F:portions, S:20, S:15
  const chartPoints = [
    { label: 'Mon', value: 35 },
    { label: 'Tue', value: 42 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 48 },
    { label: 'Fri', value: recommendation.portions },
    { label: 'Sat', value: 20 },
    { label: 'Sun', value: 15 },
  ];

  // SVG dimensions
  const width = 320;
  const height = 100;
  const paddingX = 20;
  const paddingY = 15;

  // Find min and max for scaling
  const maxVal = 60;
  const minVal = 10;

  const pointsString = chartPoints.map((p, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (chartPoints.length - 1);
    const y = height - paddingY - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="forecast-screen-root">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#191C1E] tracking-tight">
          AI Forecast
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Smart planning based on historic sales in Sabah.
        </p>
      </div>

      {/* Hero Recommendation Card */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 relative overflow-hidden flex flex-col justify-between"
        id="forecast-hero-card"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold text-primary-purple uppercase tracking-wider">
            Optimal Prep Recommendation
          </span>
          <span className="bg-primary-purple/10 text-primary-purple text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary-purple/10">
            {recommendation.confidence}% Confidence
          </span>
        </div>

        {/* Portions Bold Headline (36-44px bold) */}
        <div className="mt-4 space-y-1">
          <h2 className="text-4xl font-extrabold text-primary-purple leading-tight tracking-tight">
            Prepare {recommendation.portions} portions
          </h2>
          <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-semibold mt-1">
            {recommendation.portions < 50 ? (
              <TrendingDown className="w-4 h-4 text-rose-500 stroke-[2.5px]" />
            ) : (
              <TrendingUp className="w-4 h-4 text-secondary-green stroke-[2.5px]" />
            )}
            <span>{recommendation.comparisonText}</span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary-purple h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(recommendation.portions / 60) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-zinc-400">
            <span>Expected Demand: Normal</span>
            <span className="text-secondary-green">Optimal Efficiency</span>
          </div>
        </div>
      </div>

      {/* Why This Prediction collapsible panel (COLLAPSED BY DEFAULT) */}
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 overflow-hidden">
        <button
          onClick={() => setShowFactors(!showFactors)}
          className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
          id="why-prediction-header"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-primary-purple stroke-[2.5px]" />
            <h3 className="font-extrabold text-[#191C1E] text-base">
              Why this prediction?
            </h3>
          </div>
          {showFactors ? (
            <ChevronUp className="w-5 h-5 text-zinc-400 stroke-[2.5px]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-400 stroke-[2.5px]" />
          )}
        </button>

        {showFactors && (
          <div className="px-5 pb-5 pt-1 space-y-3 divide-y divide-zinc-100 animate-fade-in">
            {/* Factor 1: Weather (Sabah local info) */}
            <div className="pt-3 first:pt-0 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-zinc-800">Clear Sunny Skies</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Sunny day in Sabah means higher foot traffic at stall.</p>
              </div>
            </div>

            {/* Factor 2: Day of Week pattern */}
            <div className="pt-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-purple/10 text-primary-purple flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-zinc-800">Friday Demand Pattern</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Fridays usually see a 12% rise in lunch preps.</p>
              </div>
            </div>

            {/* Factor 3: Nearby Tamu event (Malaysian Sabah calendar) */}
            <div className="pt-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-green/10 text-secondary-green flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-zinc-800">Gaya Street Market</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Local traditional weekend market pulls larger crowds nearby.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simple Weekly Trend Line Chart (No more than 3 data callouts) */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-zinc-100/40 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-wider">
            Weekly Trend Line
          </h4>
          <span className="text-[10px] bg-secondary-green/10 text-secondary-green font-extrabold px-2 py-0.5 rounded-full">
            Waste Reduction Active
          </span>
        </div>

        {/* SVG Line Chart Container */}
        <div className="relative pt-4 pb-2" id="trend-line-chart">
          <svg className="w-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            {/* Draw grid helper lines */}
            <line x1={0} y1={height - paddingY} x2={width} y2={height - paddingY} stroke="#E4E7EC" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={0} y1={paddingY} x2={width} y2={paddingY} stroke="#E4E7EC" strokeWidth="1" strokeDasharray="3 3" />

            {/* Render the Line */}
            <polyline
              fill="none"
              stroke="#3C236D"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* Render the nodes/points */}
            {chartPoints.map((p, index) => {
              const x = paddingX + (index * (width - 2 * paddingX)) / (chartPoints.length - 1);
              const y = height - paddingY - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
              const isFriday = index === 4;

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={isFriday ? 5 : 3}
                  className={isFriday ? 'fill-primary-purple stroke-white stroke-2' : 'fill-zinc-400'}
                />
              );
            })}
          </svg>

          {/* Day Labels */}
          <div className="flex justify-between px-2 mt-2">
            {chartPoints.map((p, idx) => (
              <span 
                key={idx} 
                className={`text-[10px] font-bold ${idx === 4 ? 'text-primary-purple font-black' : 'text-zinc-400'}`}
              >
                {p.label}
              </span>
            ))}
          </div>

          {/* 3 DATA CALLOUTS ONLY (Strict requirement: max 3 data callouts) */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100">
            <div className="text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Lowest prep</span>
              <span className="text-base font-extrabold text-zinc-700">15 portions</span>
            </div>
            <div className="text-center border-x border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Average prep</span>
              <span className="text-base font-extrabold text-primary-purple">38 portions</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Peak Friday</span>
              <span className="text-base font-extrabold text-secondary-green">{recommendation.portions} portions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Main Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAcceptClick}
          className={`w-full py-4 px-6 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer select-none ${
            isAccepted 
              ? 'bg-secondary-green text-white' 
              : 'bg-primary-purple hover:bg-primary-purple/95 text-white'
          }`}
          id="accept-rec-button"
        >
          <span>{isAccepted ? 'Recommendation Accepted' : 'Accept Recommendation'}</span>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-4 h-4 stroke-[3px] text-white" />
          </span>
        </button>

        <button
          onClick={handleAdjustClick}
          className="w-full py-4 px-6 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold rounded-full transition-all active:scale-98 shadow-sm cursor-pointer select-none text-center"
          id="adjust-manually-button"
        >
          Adjust Manually
        </button>
      </div>

      {/* Zero-typing Manual Adjustment Bottom Sheet */}
      {isAdjusting && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in p-0">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsAdjusting(false)} 
          />
          
          <div className="bg-white border-t border-zinc-100 rounded-t-[32px] w-full max-w-md p-6 space-y-6 z-10 shadow-2xl relative transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h3 className="font-extrabold text-xl text-[#191C1E]">Adjust Portions</h3>
              <button 
                onClick={() => setIsAdjusting(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper block */}
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Adjust Prep Size</span>
              
              <div className="flex items-center gap-6">
                {/* Decrement (56x56px min touch target) */}
                <button
                  onClick={() => setTempPortions(prev => Math.max(1, prev - 1))}
                  className="w-14 h-14 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold active:scale-90 transition-all shadow-sm"
                  aria-label="Decrease portions"
                >
                  <Minus className="w-6 h-6 stroke-[3px]" />
                </button>

                {/* Display (36-44px bold) */}
                <div className="text-center min-w-32">
                  <span className="text-5xl font-extrabold text-primary-purple tracking-tight block">
                    {tempPortions}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase mt-1 block">
                    Portions
                  </span>
                </div>

                {/* Increment (56x56px min touch target) */}
                <button
                  onClick={() => setTempPortions(prev => Math.min(200, prev + 1))}
                  className="w-14 h-14 rounded-full bg-primary-purple hover:bg-primary-purple/90 text-white flex items-center justify-center font-bold active:scale-90 transition-all shadow-md"
                  aria-label="Increase portions"
                >
                  <Plus className="w-6 h-6 stroke-[3px]" />
                </button>
              </div>

              {/* Slider for quick dragging */}
              <div className="w-full px-6 pt-4">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={tempPortions} 
                  onChange={(e) => setTempPortions(parseInt(e.target.value))}
                  className="w-full accent-primary-purple h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold mt-2">
                  <span>10 Portions</span>
                  <span>50 (Yesterday)</span>
                  <span>100 Portions</span>
                </div>
              </div>
            </div>

            {/* AI confidence projection based on deviation */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center justify-between text-sm text-zinc-600">
              <span className="font-bold">Projected Confidence:</span>
              <span className={`font-extrabold px-3 py-1 rounded-full text-xs ${
                tempPortions === recommendation.originalRecommendation
                  ? 'bg-secondary-green/10 text-secondary-green'
                  : 'bg-amber-500/10 text-amber-600'
              }`}>
                {tempPortions === recommendation.originalRecommendation ? '92% (AI Optimal)' : `${Math.max(50, 92 - Math.abs(tempPortions - recommendation.originalRecommendation) * 3)}%`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsAdjusting(false)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-full text-center transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdjustment}
                className="flex-1 py-3 bg-primary-purple hover:bg-primary-purple/95 text-white font-bold rounded-full text-center transition-all shadow-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
