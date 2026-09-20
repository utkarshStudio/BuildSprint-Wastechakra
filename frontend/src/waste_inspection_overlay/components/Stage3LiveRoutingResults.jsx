import React, { useState } from 'react';
import Icon from "../../components/AppIcons";
import SoftwareArchitecturePipelineView from "./SoftwareArchitecturePipelineView";

export default function Stage3LiveRoutingResults({
  detectionData,
  imagePreviewUrl,
  onBackToSimulation,
  onReupload,
  onReturnToStart,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('routing'); // 'routing' | 'architecture'
  const [hoveredObjectId, setHoveredObjectId] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);

  const handleImgLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }
  };

  const objects = detectionData?.objects || [];
  const streamCounts = detectionData?.stream_counts || {
    RECYCLABLE: 4,
    RDF: 1,
    ORGANIC: 0,
    LANDFILL: 1,
  };

  const summaryPoints = detectionData?.summary_points || [
    "Primary Stream: High-value Recyclable Materials separated for mechanical reprocessing.",
    "Diverted high-calorific flexible packaging into RDF fuel stream for waste-to-energy.",
    "Safely isolated non-recoverable inert residue away from processing line.",
  ];

  const getStreamColorClass = (stream) => {
    switch (stream) {
      case 'RECYCLABLE':
        return {
          box: 'bbox-recyclable',
          tag: 'bg-emerald-600 text-white',
          badge: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
        };
      case 'RDF':
        return {
          box: 'bbox-rdf',
          tag: 'bg-amber-600 text-white',
          badge: 'bg-amber-50 text-amber-800 border border-amber-300',
        };
      case 'ORGANIC':
        return {
          box: 'bbox-organic',
          tag: 'bg-green-600 text-white',
          badge: 'bg-green-50 text-green-800 border border-green-300',
        };
      default:
        return {
          box: 'bbox-landfill',
          tag: 'bg-slate-700 text-white',
          badge: 'bg-slate-100 text-slate-800 border border-slate-300',
        };
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 md:p-5 select-none overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* 1. Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-forest text-secondary-container text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            Stage 03
          </span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-primary tracking-tight">
            Optical Ingestion & Live Routing Matrix
          </h2>
        </div>

        {/* View Switcher: Matrix vs Architecture */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container-high">
          <button
            onClick={() => setActiveTab('routing')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'routing'
                ? 'bg-white text-forest shadow-2xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon name="alt_route" className="w-3.5 h-3.5 text-forest" />
            <span>Live Streams & Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-forest text-secondary-container shadow-2xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon name="memory" className="w-3.5 h-3.5" />
            <span>Architecture Pipeline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onReupload}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border border-surface-container-highest bg-white hover:bg-surface-container-low text-primary text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Icon name="refresh" className="w-3.5 h-3.5 text-forest" />
            <span>Upload Another</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-forest hover:bg-primary text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Icon name="check" className="w-3.5 h-3.5 text-secondary-container" />
              <span>Finish</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'architecture' ? (
        <SoftwareArchitecturePipelineView
          detectionData={detectionData}
          onClose={() => setActiveTab('routing')}
        />
      ) : (
        <>
          {/* Quick-Trace Architecture Pill */}
          <div className="my-1.5 px-3 py-1.5 rounded-xl bg-[#f3fcf2] border border-forest/20 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-primary uppercase text-[11px] tracking-wide">
                Modular 3-Stage Pipeline:
              </span>
              <span className="text-on-surface-variant text-[11px] sm:text-xs">
                <strong>01 Detect</strong> ({objects.length} YOLO-TACO objects) &rarr; <strong>02 Evaluate</strong> (mAP@50: {Math.round((detectionData?.confidence || 0.91) * 100)}%, F1: {Math.round((detectionData?.architecture_pipeline?.stage_2_evaluation?.metrics?.f1_score || 0.925) * 100)}%) &rarr; <strong>Decision</strong>: <span className="font-bold text-emerald-800">{detectionData?.architecture_pipeline?.decision || 'DEPLOY (DIRECT)'}</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('architecture')}
              className="inline-flex items-center gap-1 text-forest font-bold hover:underline cursor-pointer text-xs"
            >
              <span>Inspect Software Architecture</span>
              <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Main Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start flex-1 min-h-0 py-2">
        
        {/* Left Column: 01 Ingestion (Bounding Boxes + Key Takeaways) */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-surface-container-high bg-white p-3 sm:p-3.5 shadow-sm">
          
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-2.5 shrink-0">
            <h3 className="text-xs font-bold text-primary flex items-center gap-1.5 tracking-wide">
              <span className="text-forest font-extrabold">01 •</span> INGESTION OPTICAL BUFFER
            </h3>
            <span className="text-[11px] sm:text-xs font-bold text-forest bg-surface-container-low px-2 sm:px-2.5 py-0.5 rounded-full border border-surface-container-highest">
              {objects.length} Objects Localized
            </span>
          </div>

          {/* Image & Dynamic Bounding Boxes with Exact Pixel Alignment */}
          <div className="relative w-full min-h-[190px] sm:min-h-[220px] max-h-[36vh] sm:max-h-[44vh] rounded-xl overflow-hidden bg-slate-950 border border-surface-container-high flex items-center justify-center p-1 select-none">
            {imagePreviewUrl ? (
              <div
                className="relative max-w-full max-h-full flex items-center justify-center"
                style={aspectRatio ? { aspectRatio } : { width: '100%', height: '100%' }}
              >
                <img
                  src={imagePreviewUrl}
                  alt="Localized waste items"
                  onLoad={handleImgLoad}
                  className="w-full h-full object-fill rounded-lg pointer-events-none"
                />

                {/* Bounding Boxes */}
                {objects.map((obj) => {
                  const styleColors = getStreamColorClass(obj.stream);
                  const isHovered = hoveredObjectId === obj.id;
                  const box = obj.box || { xmin: 25, ymin: 25, width: 20, height: 20 };

                  return (
                    <div
                      key={obj.id}
                      onMouseEnter={() => setHoveredObjectId(obj.id)}
                      onMouseLeave={() => setHoveredObjectId(null)}
                      className={`absolute rounded-md transition-all duration-150 cursor-pointer pointer-events-auto ${styleColors.box} ${
                        isHovered ? 'ring-2 ring-white z-30 scale-[1.02]' : 'z-10'
                      }`}
                      style={{
                        left: `${box.xmin}%`,
                        top: `${box.ymin}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                    >
                      <div
                        className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded-t text-[9px] font-bold whitespace-nowrap shadow-md pointer-events-none ${styleColors.tag}`}
                      >
                        {obj.label} • {obj.stream}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-xs">No image to display</p>
            )}
          </div>

          {/* Key Sorting Takeaways */}
          <div className="mt-3 p-3 rounded-xl border border-surface-container-high bg-surface-container-low shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-forest mb-1.5">
              <Icon name="stars" className="w-3.5 h-3.5 text-forest" />
              <span>KEY CIRCULAR SORTING TAKEAWAYS</span>
            </div>
            <div className="space-y-1 text-xs text-on-surface-variant">
              {summaryPoints.slice(0, 3).map((pt, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-forest font-bold">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 02 Live Routing (KPI Cards & Table) */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-surface-container-high bg-white p-3 sm:p-3.5 shadow-sm">
          
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-2.5 shrink-0">
            <h3 className="text-xs font-bold text-primary flex items-center gap-1.5 tracking-wide">
              <span className="text-forest font-extrabold">02 •</span> LIVE ROUTING STREAMS
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold text-forest uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-surface-container-low border border-surface-container-highest">
              {detectionData?.model_version || 'HYBRID AI: YOLO + GEMINI VISION'}
            </span>
          </div>

          {/* 4 Stream Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 sm:mb-3 shrink-0">
            
            {/* Recyclables */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-tight">
                <Icon name="recycling" className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recyclable</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono mt-0.5">
                {streamCounts.RECYCLABLE || 0}
              </span>
            </div>

            {/* RDF Fuel */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-tight">
                <Icon name="local_fire_department" className="w-3.5 h-3.5 text-amber-600" />
                <span>RDF Fuel</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-800 font-mono mt-0.5">
                {streamCounts.RDF || 0}
              </span>
            </div>

            {/* Organic */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-green-200 bg-green-50/60 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-green-800 uppercase tracking-tight">
                <Icon name="grass" className="w-3.5 h-3.5 text-green-600" />
                <span>Organic</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-green-800 font-mono mt-0.5">
                {streamCounts.ORGANIC || 0}
              </span>
            </div>

            {/* Landfill */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                <Icon name="delete" className="w-3.5 h-3.5 text-slate-500" />
                <span>Landfill</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-800 font-mono mt-0.5">
                {streamCounts.LANDFILL || 0}
              </span>
            </div>

          </div>

          {/* Results Table with Horizontal Scroll Support */}
          <div className="w-full overflow-x-auto overflow-y-auto border border-surface-container-high rounded-xl bg-white custom-scrollbar max-h-[38vh] sm:max-h-[46vh]">
            <table className="min-w-[460px] sm:min-w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-surface-container-low border-b border-surface-container-high text-on-surface-variant font-bold z-10">
                <tr>
                  <th className="py-2.5 px-3">Object</th>
                  <th className="py-2.5 px-2">Confidence</th>
                  <th className="py-2.5 px-2">Stream</th>
                  <th className="py-2.5 px-3">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-primary">
                {objects.map((item) => {
                  const isHovered = hoveredObjectId === item.id;
                  const streamColor = getStreamColorClass(item.stream);

                  return (
                    <tr
                      key={item.id}
                      onMouseEnter={() => setHoveredObjectId(item.id)}
                      onMouseLeave={() => setHoveredObjectId(null)}
                      className={`transition-colors cursor-pointer ${
                        isHovered ? 'bg-surface-container-low font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 font-semibold text-primary whitespace-nowrap">
                        {item.label}
                      </td>
                      <td className="py-2 px-2 text-on-surface-variant font-mono whitespace-nowrap">
                        {item.confidence_pct || Math.round((item.confidence || 0.8) * 100)}%
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${streamColor.badge}`}>
                          {item.stream}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-on-surface-variant text-[11px] leading-snug">
                        {item.rationale}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>
      </>
      )}

      {/* 3. Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-surface-container-high pt-2.5 mt-1 text-xs shrink-0 gap-2 sm:gap-3">
        <button
          onClick={onBackToSimulation}
          className="inline-flex items-center gap-1.5 text-forest font-bold hover:underline cursor-pointer"
        >
          <Icon name="arrow_back" className="w-4 h-4" />
          <span>Replay Conveyor Plant</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-semibold text-xs transition-colors cursor-pointer"
              title="Exit simulation"
            >
              <Icon name="logout" className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          )}

          <button
            onClick={onReturnToStart || onClose}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-primary hover:bg-forest text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Return To Ingestion</span>
            <Icon name="restart_alt" className="w-4 h-4 text-secondary-container" />
          </button>
        </div>
      </div>

    </div>
  );
}
