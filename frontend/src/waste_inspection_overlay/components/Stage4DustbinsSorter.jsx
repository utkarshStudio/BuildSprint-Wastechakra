import React, { useState, useEffect } from 'react';
import { Recycle, Flame, Sprout, Trash2, CheckCircle2, ArrowLeft, RotateCcw, X, Sparkles } from 'lucide-react';

export default function Stage4DustbinsSorter({ detectionData, onReupload, onBackToMatrix, onClose }) {
  const [animatedItems, setAnimatedItems] = useState([]);
  const [binCounts, setBinCounts] = useState({
    RECYCLABLE: 0,
    RDF: 0,
    ORGANIC: 0,
    LANDFILL: 0,
  });
  const [activeDroppingBin, setActiveDroppingBin] = useState(null);

  const objects = detectionData?.objects || [];
  const summaryPoints = detectionData?.summary_points || [
    "Primary Stream: High-value Recyclable Rigid Metals & Clean Polymers (8 items identified).",
    "Separated 8 recyclable unit(s) into Green Recyclables Dustbin for mechanical re-granulation.",
    "Routed 1 high-calorific wrapper/film unit(s) to Orange RDF Dustbin for industrial energy recovery.",
    "Safely isolated 2 low-confidence/inert object(s) into Grey Landfill Dustbin to protect downstream processing.",
    "Overall Circular Economy Diversion Rate: 81.8% diverted away from dumping grounds."
  ];

  // Animate items dropping into dustbins one after another
  useEffect(() => {
    let index = 0;
    const currentCounts = { RECYCLABLE: 0, RDF: 0, ORGANIC: 0, LANDFILL: 0 };

    const interval = setInterval(() => {
      if (index < objects.length) {
        const item = objects[index];
        const stream = item.stream;

        setActiveDroppingBin(stream);
        currentCounts[stream] = (currentCounts[stream] || 0) + 1;
        setBinCounts({ ...currentCounts });

        setAnimatedItems((prev) => [
          ...prev,
          { id: item.id, label: item.label, stream: item.stream, timestamp: Date.now() }
        ]);

        setTimeout(() => {
          setActiveDroppingBin(null);
        }, 300);

        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [objects]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 md:p-5 text-slate-800 overflow-hidden select-none">
      {/* Top Header (Light Mode) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold">
            STAGE 04
          </span>
          <h2 className="text-base md:text-lg font-bold font-sora text-slate-900">
            CATEGORIZED DUSTBIN SORTING & ACTIONABLE SUMMARY
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Matrix</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Finish & Close</span>
          </button>
        </div>
      </div>

      {/* Main Dustbins Grid (Light Mode) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-2 shrink-0">
        
        {/* 1. RECYCLABLES DUSTBIN */}
        <div
          className={`dustbin-card-light p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between shadow-sm ${
            activeDroppingBin === 'RECYCLABLE'
              ? 'border-emerald-600 bg-emerald-50/90 lid-active shadow-md'
              : 'border-slate-200 bg-white'
          }`}
        >
          {/* Bin Lid */}
          <div className="dustbin-lid-light w-22 h-4.5 rounded-t-lg bg-emerald-600 border border-emerald-500 flex items-center justify-center shadow-xs">
            <div className="w-6 h-1 rounded-full bg-emerald-200" />
          </div>

          {/* Bin Body */}
          <div className="relative w-26 h-28 md:h-32 rounded-b-xl bg-gradient-to-b from-emerald-600 to-emerald-800 border-x-2 border-b-2 border-emerald-700 flex flex-col items-center justify-between p-2 my-1 shadow-sm overflow-hidden text-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Recycle className="w-9 h-9 text-emerald-200 opacity-95 mb-0.5" />
              <span className="text-[9px] font-mono font-bold text-emerald-100 tracking-wider uppercase">
                RECYCLABLES
              </span>
            </div>

            <div className="relative z-10 mt-auto px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-base font-bold">
              {binCounts.RECYCLABLE}
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-[11px] font-mono font-bold text-emerald-800 uppercase">
              Recyclables Bin
            </h4>
            <p className="text-[9px] text-slate-500 font-mono">
              Plastics, cans, bottles
            </p>
          </div>
        </div>

        {/* 2. RDF ENERGY DUSTBIN */}
        <div
          className={`dustbin-card-light p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between shadow-sm ${
            activeDroppingBin === 'RDF'
              ? 'border-orange-500 bg-orange-50/90 lid-active shadow-md'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="dustbin-lid-light w-22 h-4.5 rounded-t-lg bg-orange-600 border border-orange-500 flex items-center justify-center shadow-xs">
            <div className="w-6 h-1 rounded-full bg-orange-200" />
          </div>

          <div className="relative w-26 h-28 md:h-32 rounded-b-xl bg-gradient-to-b from-orange-600 to-orange-800 border-x-2 border-b-2 border-orange-700 flex flex-col items-center justify-between p-2 my-1 shadow-sm overflow-hidden text-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Flame className="w-9 h-9 text-orange-200 opacity-95 mb-0.5" />
              <span className="text-[9px] font-mono font-bold text-orange-100 tracking-wider uppercase">
                RDF / FUEL
              </span>
            </div>

            <div className="relative z-10 mt-auto px-2 py-0.5 rounded-md bg-orange-950/80 border border-orange-500 text-orange-300 font-mono text-base font-bold">
              {binCounts.RDF}
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-[11px] font-mono font-bold text-orange-800 uppercase">
              RDF Dustbin
            </h4>
            <p className="text-[9px] text-slate-500 font-mono">
              Wrappers, snack bags
            </p>
          </div>
        </div>

        {/* 3. ORGANIC / COMPOST DUSTBIN */}
        <div
          className={`dustbin-card-light p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between shadow-sm ${
            activeDroppingBin === 'ORGANIC'
              ? 'border-green-600 bg-green-50/90 lid-active shadow-md'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="dustbin-lid-light w-22 h-4.5 rounded-t-lg bg-green-700 border border-green-600 flex items-center justify-center shadow-xs">
            <div className="w-6 h-1 rounded-full bg-green-200" />
          </div>

          <div className="relative w-26 h-28 md:h-32 rounded-b-xl bg-gradient-to-b from-green-700 to-green-900 border-x-2 border-b-2 border-green-800 flex flex-col items-center justify-between p-2 my-1 shadow-sm overflow-hidden text-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Sprout className="w-9 h-9 text-green-200 opacity-95 mb-0.5" />
              <span className="text-[9px] font-mono font-bold text-green-100 tracking-wider uppercase">
                COMPOST
              </span>
            </div>

            <div className="relative z-10 mt-auto px-2 py-0.5 rounded-md bg-green-950/80 border border-green-500 text-green-300 font-mono text-base font-bold">
              {binCounts.ORGANIC}
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-[11px] font-mono font-bold text-green-800 uppercase">
              Organic Dustbin
            </h4>
            <p className="text-[9px] text-slate-500 font-mono">
              Food scraps, peels
            </p>
          </div>
        </div>

        {/* 4. LANDFILL / SAFE INERT DUSTBIN */}
        <div
          className={`dustbin-card-light p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between shadow-sm ${
            activeDroppingBin === 'LANDFILL'
              ? 'border-slate-600 bg-slate-100 lid-active shadow-md'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="dustbin-lid-light w-22 h-4.5 rounded-t-lg bg-slate-700 border border-slate-600 flex items-center justify-center shadow-xs">
            <div className="w-6 h-1 rounded-full bg-slate-400" />
          </div>

          <div className="relative w-26 h-28 md:h-32 rounded-b-xl bg-gradient-to-b from-slate-700 to-slate-800 border-x-2 border-b-2 border-slate-600 flex flex-col items-center justify-between p-2 my-1 shadow-sm overflow-hidden text-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Trash2 className="w-9 h-9 text-slate-300 opacity-95 mb-0.5" />
              <span className="text-[9px] font-mono font-bold text-slate-200 tracking-wider uppercase">
                LANDFILL
              </span>
            </div>

            <div className="relative z-10 mt-auto px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-500 text-slate-300 font-mono text-base font-bold">
              {binCounts.LANDFILL}
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-[11px] font-mono font-bold text-slate-800 uppercase">
              Landfill Dustbin
            </h4>
            <p className="text-[9px] text-slate-500 font-mono">
              Inerts, contaminated
            </p>
          </div>
        </div>

      </div>

      {/* POINT-BY-POINT SUMMARY SECTION (Light Mode) */}
      <div className="flex-1 p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs my-1 min-h-0 overflow-y-auto">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-2 shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">
            Optical Analysis & Segregation Rationale (Point-by-Point)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
          {summaryPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 flex items-start gap-2"
            >
              <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                {idx + 1}
              </div>
              <p className="text-slate-700 leading-snug">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions (Light Mode) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-2 shrink-0">
        <button
          onClick={onReupload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Upload Another Image</span>
        </button>

        <button
          onClick={onClose}
          className="btn-glowing-process px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Return To Main WasteChakra Canvas</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
