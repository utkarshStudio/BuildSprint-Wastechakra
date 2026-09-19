import React, { useState, useEffect, useRef, useMemo } from 'react';
import Icon from "../../components/AppIcons";

const CONVEYOR_STATIONS = [
  { id: 'reception', name: 'Waste Reception', code: 'ST-01', icon: "inventory_2" },
  { id: 'scanner', name: 'AI Scanner', code: 'ST-02', icon: "qr_code_scanner" },
  { id: 'shredder', name: 'Pre-Shredder', code: 'ST-03', icon: "settings" },
  { id: 'trommel', name: 'Trommel Screen', code: 'ST-04', icon: "autorenew" },
  { id: 'magnetic', name: 'Magnetic Sorter', code: 'ST-05', icon: "magnet" },
  { id: 'non_ferrous', name: 'Eddy Separator', code: 'ST-06', icon: "bolt" },
  { id: 'optical_ai', name: 'Optical AI Sorter', code: 'ST-07', icon: "my_location" },
  { id: 'quality', name: 'Quality Sensor', code: 'ST-08', icon: "verified_user" },
  { id: 'routing', name: 'Intelligent Routing', code: 'ST-09', icon: "call_split" },
];

/**
 * Maps any detected waste item from the API into a physical conveyor ejection drop.
 */
function getDropSpecsForObject(obj, index, total) {
  const stream = (obj.stream || 'RECYCLABLE').toUpperCase();
  const label = obj.label || 'Waste Item';
  const labelLower = label.toLowerCase();

  let binIndex = 0;
  let stationIndex = 7;
  let stationCode = 'ST-08';
  let stationName = 'Quality Sensor';
  let icon = "recycling";
  let badgeClass = 'bg-emerald-100 border-emerald-300 text-emerald-800';

  if (stream === 'ORGANIC') {
    binIndex = 2;
    stationIndex = 3;
    stationCode = 'ST-04';
    stationName = 'Trommel Screen';
    icon = "grass";
    badgeClass = 'bg-green-100 border-green-300 text-green-800';
  } else if (stream === 'RDF') {
    binIndex = 1;
    stationIndex = 6;
    stationCode = 'ST-07';
    stationName = 'Optical AI Sorter';
    icon = "local_fire_department";
    badgeClass = 'bg-amber-100 border-amber-300 text-amber-800';
  } else if (stream === 'LANDFILL') {
    binIndex = 3;
    stationIndex = 8;
    stationCode = 'ST-09';
    stationName = 'Intelligent Routing';
    icon = "delete";
    badgeClass = 'bg-slate-100 border-slate-300 text-slate-800';
  } else {
    // RECYCLABLE
    binIndex = 0;
    badgeClass = 'bg-emerald-100 border-emerald-300 text-emerald-800';
    if (
      labelLower.includes('can') ||
      labelLower.includes('tin') ||
      labelLower.includes('metal') ||
      labelLower.includes('ferrous') ||
      labelLower.includes('steel') ||
      labelLower.includes('iron')
    ) {
      stationIndex = 4;
      stationCode = 'ST-05';
      stationName = 'Magnetic Sorter';
      icon = "radio_button_checked";
    } else if (
      labelLower.includes('alumin') ||
      labelLower.includes('foil') ||
      labelLower.includes('wire') ||
      labelLower.includes('non-ferrous')
    ) {
      stationIndex = 5;
      stationCode = 'ST-06';
      stationName = 'Eddy Separator';
      icon = "radio_button_checked";
    } else if (
      labelLower.includes('cardboard') ||
      labelLower.includes('paper') ||
      labelLower.includes('carton') ||
      labelLower.includes('box')
    ) {
      stationIndex = 6;
      stationCode = 'ST-07';
      stationName = 'Optical AI Sorter';
      icon = "inventory_2";
    } else {
      stationIndex = 7;
      stationCode = 'ST-08';
      stationName = 'Quality Sensor';
      icon = "recycling";
    }
  }

  return {
    rawObj: obj,
    id: obj.id || `drop-${index}`,
    item: label,
    stream,
    binIndex,
    stationIndex,
    stationCode,
    stationName,
    icon,
    badgeClass,
  };
}

/**
 * Builds physical timeline drop triggers dynamically based on API detection objects.
 */
function generateDropsFromObjects(objects) {
  if (!objects || objects.length === 0) return [];

  const rawDrops = objects.map((obj, i) => getDropSpecsForObject(obj, i, objects.length));
  rawDrops.sort((a, b) => a.stationIndex - b.stationIndex);

  const total = rawDrops.length;
  const startProgress = 24;
  const endProgress = 92;
  const progressSpan = endProgress - startProgress;

  return rawDrops.map((drop, idx) => {
    const stationBase = 22 + (drop.stationIndex - 2) * 9.5;
    const uniformBase = startProgress + (idx / Math.max(1, total)) * progressSpan;
    const triggerMin = Math.round(Math.max(20, Math.min(92, uniformBase * 0.65 + stationBase * 0.35)));
    const triggerMax = triggerMin + 4.5;

    return {
      ...drop,
      triggerMin,
      triggerMax,
    };
  });
}

const DEFAULT_DROPS = [
  {
    triggerMin: 32,
    triggerMax: 37,
    stationIndex: 3,
    stationCode: 'ST-04',
    stationName: 'Trommel Screen',
    item: 'Organic Compost Scrap',
    icon: "grass",
    stream: 'ORGANIC',
    binIndex: 2,
    badgeClass: 'bg-green-100 border-green-300 text-green-800',
  },
  {
    triggerMin: 45,
    triggerMax: 50,
    stationIndex: 4,
    stationCode: 'ST-05',
    stationName: 'Magnetic Sorter',
    item: 'Tin Food Can (Ferrous)',
    icon: "radio_button_checked",
    stream: 'RECYCLABLE',
    binIndex: 0,
    badgeClass: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  },
  {
    triggerMin: 56,
    triggerMax: 61,
    stationIndex: 5,
    stationCode: 'ST-06',
    stationName: 'Eddy Separator',
    item: 'Aluminium Beverage Can',
    icon: "radio_button_checked",
    stream: 'RECYCLABLE',
    binIndex: 0,
    badgeClass: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  },
  {
    triggerMin: 67,
    triggerMax: 72,
    stationIndex: 6,
    stationCode: 'ST-07',
    stationName: 'Optical AI Sorter',
    item: 'Plastic Wrapper Film',
    icon: "local_fire_department",
    stream: 'RDF',
    binIndex: 1,
    badgeClass: 'bg-amber-100 border-amber-300 text-amber-800',
  },
  {
    triggerMin: 78,
    triggerMax: 83,
    stationIndex: 7,
    stationCode: 'ST-08',
    stationName: 'Quality Sensor',
    item: 'Clean PET Plastic Bottle',
    icon: "recycling",
    stream: 'RECYCLABLE',
    binIndex: 0,
    badgeClass: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  },
  {
    triggerMin: 89,
    triggerMax: 94,
    stationIndex: 8,
    stationCode: 'ST-09',
    stationName: 'Intelligent Routing',
    item: 'Inert Landfill Debris',
    icon: "delete",
    stream: 'LANDFILL',
    binIndex: 3,
    badgeClass: 'bg-slate-100 border-slate-300 text-slate-800',
  },
];

export default function Stage2PlantSimulation({ imagePreviewUrl, detectionData, onSimulationComplete }) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Dynamic drops synthesized from real API detections
  const dropsList = useMemo(() => {
    if (detectionData?.objects && detectionData.objects.length > 0) {
      return generateDropsFromObjects(detectionData.objects);
    }
    return DEFAULT_DROPS;
  }, [detectionData]);

  // Expected final counts synchronized with API stream counts
  const targetCounts = useMemo(() => {
    if (detectionData?.stream_counts) {
      return {
        RECYCLABLE: detectionData.stream_counts.RECYCLABLE || 0,
        RDF: detectionData.stream_counts.RDF || 0,
        ORGANIC: detectionData.stream_counts.ORGANIC || 0,
        LANDFILL: detectionData.stream_counts.LANDFILL || 0,
      };
    }
    const counts = { RECYCLABLE: 0, RDF: 0, ORGANIC: 0, LANDFILL: 0 };
    dropsList.forEach((d) => {
      counts[d.stream] = (counts[d.stream] || 0) + 1;
    });
    return counts;
  }, [detectionData, dropsList]);

  const totalItems = detectionData?.total_detected || dropsList.length;

  // Live dustbin counts that increment as items travel into bins
  const [binCounts, setBinCounts] = useState({
    RECYCLABLE: 0,
    RDF: 0,
    ORGANIC: 0,
    LANDFILL: 0,
  });

  const [activeDrops, setActiveDrops] = useState([]);
  const [activeBinImpacts, setActiveBinImpacts] = useState({});
  const [floatingBadges, setFloatingBadges] = useState([]);
  const [recentLog, setRecentLog] = useState('Ingestion belt operational: Continuous multi-spectral optical scan active');

  const executedDropsRef = useRef(new Set());

  // Function to restart simulation
  const startSimulation = () => {
    setProgress(0);
    setIsCompleted(false);
    setActiveStageIndex(0);
    setActiveDrops([]);
    setActiveBinImpacts({});
    setFloatingBadges([]);
    executedDropsRef.current.clear();
    setBinCounts({ RECYCLABLE: 0, RDF: 0, ORGANIC: 0, LANDFILL: 0 });
    setRecentLog('Ingestion belt operational: Continuous multi-spectral optical scan active');
  };

  useEffect(() => {
    if (isCompleted) return;

    const totalDurationMs = Math.max(7000, dropsList.length * 850);
    const intervalMs = 50;
    const step = (intervalMs / totalDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;

        if (next >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          setActiveStageIndex(8);
          setActiveDrops([]);
          setBinCounts(targetCounts);
          setRecentLog(`Sorting complete: ${totalItems} items diverted across 4 circular streams`);
          return 100;
        }

        const stage = Math.min(8, Math.floor((next / 100) * CONVEYOR_STATIONS.length));
        setActiveStageIndex(stage);

        for (let i = 0; i < dropsList.length; i++) {
          const drop = dropsList[i];
          if (next >= drop.triggerMin && next <= drop.triggerMax && !executedDropsRef.current.has(i)) {
            executedDropsRef.current.add(i);

            const dropInstanceId = `${Date.now()}-${i}`;
            const dropData = { ...drop, dropInstanceId };

            setActiveDrops((current) => [...current, dropData]);
            setRecentLog(`${drop.stationCode} [${drop.stationName}] diverted "${drop.item}" ➔ ${drop.stream}`);

            setTimeout(() => {
              setActiveBinImpacts((prev) => ({ ...prev, [drop.stream]: true }));
              
              const badgeId = `${dropInstanceId}-badge`;
              setFloatingBadges((prev) => [
                ...prev,
                { id: badgeId, stream: drop.stream, text: `+1 ${drop.stream}` }
              ]);

              setBinCounts((prevCounts) => ({
                ...prevCounts,
                [drop.stream]: (prevCounts[drop.stream] || 0) + 1,
              }));

              setTimeout(() => {
                setActiveBinImpacts((prev) => ({ ...prev, [drop.stream]: false }));
              }, 600);

              setTimeout(() => {
                setFloatingBadges((prev) => prev.filter((b) => b.id !== badgeId));
              }, 1100);
            }, 600);

            setTimeout(() => {
              setActiveDrops((current) => current.filter((d) => d.dropInstanceId !== dropInstanceId));
            }, 1200);
          }
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isCompleted, dropsList, targetCounts, totalItems]);

  const currentStation = CONVEYOR_STATIONS[activeStageIndex] || CONVEYOR_STATIONS[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 md:p-5 select-none overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* 1. Header Information */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high pb-2.5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-forest text-secondary-container text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            Stage 02
          </span>
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-primary tracking-tight">
            Conveyor Plant & Real-time Sorter
          </h2>
          {isCompleted && (
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold items-center gap-1">
              <Icon name="check_circle" className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sorting Complete</span>
            </span>
          )}
        </div>

        {!isCompleted && (
          <button
            onClick={onSimulationComplete}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-surface-container-highest bg-white hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Icon name="fast_forward" className="w-3.5 h-3.5 text-forest" />
            <span>Fast Forward</span>
          </button>
        )}
      </div>

      {/* 2. Main Simulation Viewport */}
      <div className="flex-1 flex flex-col justify-around items-center py-2 min-h-0">
        
        {/* Active Stage Indicator HUD */}
        <div className="w-full max-w-5xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-surface-container-high bg-white shadow-xs flex items-center justify-between shrink-0 my-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-forest text-secondary-container flex items-center justify-center shadow-2xs">
              <Icon name={currentStation.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-extrabold text-forest">{currentStation.code}</span>
                <h3 className="text-xs md:text-sm font-bold text-primary">
                  {currentStation.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium">Plant Progress:</span>
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-forest font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Conveyor Belt Plant (9 Machine Stations) with horizontal scrolling wrapper for mobile */}
        <div className="w-full max-w-5xl my-1 shrink-0">
          <div className="flex md:hidden items-center justify-between px-1 text-[10px] text-on-surface-variant font-medium mb-1">
            <span className="font-semibold text-primary">Conveyor Twin (9 Stations)</span>
            <span className="flex items-center gap-1 text-forest font-bold">
              <Icon name="swap_horiz" className="w-3.5 h-3.5" />
              Swipe track →
            </span>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar rounded-2xl border border-surface-container-high bg-white shadow-sm p-1.5 sm:p-2 md:p-3">
            <div className="min-w-[680px] md:min-w-full h-30 sm:h-32 md:h-36 relative px-2 py-1">
              <div className="relative w-full h-full flex items-center justify-between">
                
                {/* Horizontal Belt Track */}
                <div className={`absolute top-[46%] -translate-y-1/2 left-0 right-0 h-7 sm:h-8 conveyor-belt-track ${!isCompleted ? 'animated' : ''} border-y border-slate-300 rounded-sm shadow-inner`} />

                {/* 9 Machine Stations */}
                {CONVEYOR_STATIONS.map((st, idx) => {
                  const isPassed = isCompleted || idx < activeStageIndex;
                  const isCurrent = !isCompleted && idx === activeStageIndex;

                  return (
                    <div
                      key={st.id}
                      className="relative z-10 w-[10.5%] flex flex-col items-center transition-transform duration-200"
                      style={{ transform: isCurrent ? 'scale(1.06)' : 'scale(1)' }}
                    >
                      {/* Station Machine Housing */}
                      <div
                        className={`w-full max-w-14 h-19 sm:h-20 md:h-22 rounded-xl border-2 flex flex-col items-center justify-between p-1 transition-all ${
                          isCurrent
                            ? 'border-forest bg-surface-container-low shadow-md ring-2 ring-forest/20'
                            : isPassed
                            ? 'border-emerald-500/40 bg-white text-on-surface'
                            : 'border-surface-container-highest bg-slate-50 text-on-surface-variant/50'
                        }`}
                      >
                        {/* Machine Top Cap */}
                        <div className={`w-full py-0.5 rounded text-[8px] font-mono font-bold text-center flex items-center justify-between px-1 ${
                          isCurrent ? 'bg-forest text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-secondary-container animate-pulse' : isPassed ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>0{idx + 1}</span>
                        </div>

                        {/* Machine Graphic Icon */}
                        <div className="my-auto flex flex-col items-center justify-center">
                          <Icon
                            name={st.icon}
                            className={`w-4 h-4 md:w-5 md:h-5 ${
                              isCurrent
                                ? 'text-forest animate-pulse'
                                : isPassed
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }`}
                          />
                        </div>

                        {/* Bottom Status Chip */}
                        <div className={`w-full py-0.5 rounded text-[7px] font-bold text-center uppercase tracking-wider ${
                          isCurrent
                            ? 'bg-secondary-container text-primary'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isCurrent ? 'ACTIVE' : isPassed ? 'PASS' : 'IDLE'}
                        </div>
                      </div>

                      {/* Station label */}
                      <span className={`text-[8px] font-bold mt-1 text-center truncate w-full leading-tight ${
                        isCurrent ? 'text-forest' : isPassed ? 'text-primary' : 'text-on-surface-variant/60'
                      }`}>
                        {st.name}
                      </span>
                    </div>
                  );
                })}

                {/* Traveling Waste Parcel */}
                <div
                  className="absolute top-[46%] -translate-y-1/2 z-20 transition-all duration-75 pointer-events-none"
                  style={{
                    left: `calc(${progress * 0.90}% + 4px)`,
                  }}
                >
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl border-2 ${isCompleted ? 'border-emerald-500 bg-white' : 'border-forest bg-white'} shadow-lg overflow-hidden p-0.5`}>
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Conveyor parcel"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <Icon name="inventory_2" className="w-4 h-4 sm:w-5 sm:h-5 text-forest" />
                      </div>
                    )}

                    {/* Laser scan line */}
                    {!isCompleted && <div className="scanner-laser-beam" />}

                    {/* Completed badge */}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex items-center justify-center">
                        <Icon name="check_circle" className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-container drop-shadow" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chute Trajectory Zone */}
        <div className="w-full max-w-5xl shrink-0 relative h-9 sm:h-11 md:h-12 my-0.5 px-2 sm:px-4 overflow-visible">
          <div className="w-full h-full border-x border-b border-dashed border-surface-container-highest rounded-b-2xl flex items-center justify-around relative bg-gradient-to-b from-slate-50 to-emerald-50/20">
            {[
              { label: 'RECYCLABLES', color: 'text-emerald-700' },
              { label: 'RDF FUEL', color: 'text-amber-700' },
              { label: 'COMPOST', color: 'text-green-700' },
              { label: 'LANDFILL', color: 'text-slate-700' },
            ].map((chute, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <Icon name="arrow_downward" className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${chute.color} animate-bounce`} />
                <span className="text-[7px] sm:text-[8px] font-bold text-on-surface-variant tracking-tight truncate max-w-16 sm:max-w-none text-center">
                  {chute.label}
                </span>
              </div>
            ))}
          </div>

          {/* Dropping Waste Particles */}
          {activeDrops.map((drop) => (
            <div
              key={drop.dropInstanceId || drop.id}
              className="absolute top-0 z-30 pointer-events-none waste-particle-glide"
              style={{
                left: `${11 + drop.binIndex * 25}%`,
              }}
            >
              <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border shadow-md ${drop.badgeClass}`}>
                <Icon name={drop.icon} className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">
                  {drop.item}
                </span>
              </div>
            </div>
          ))}

          {/* Floating +1 Badges */}
          {floatingBadges.map((badge) => (
            <div
              key={badge.id}
              className="absolute bottom-0 z-30 pointer-events-none float-badge-anim"
              style={{
                left: `${
                  badge.stream === 'RECYCLABLE'
                    ? 11
                    : badge.stream === 'RDF'
                    ? 36
                    : badge.stream === 'ORGANIC'
                    ? 61
                    : 86
                }%`,
              }}
            >
              <div className="px-2 sm:px-2.5 py-0.5 rounded-full bg-forest text-secondary-container text-[9px] sm:text-[10px] font-extrabold shadow-md flex items-center gap-1">
                <Icon name="stars" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary-container" />
                <span>{badge.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Smart Dustbins */}
        <div className="w-full max-w-5xl shrink-0 grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3 my-1">
          
          {/* 1. Recyclables Bin */}
          <div className={`p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border bg-white flex flex-col items-center justify-between transition-all shadow-xs ${
            activeBinImpacts.RECYCLABLE ? 'border-emerald-500 ring-2 ring-emerald-400/40 dustbin-impact-active' : 'border-surface-container-high'
          }`}>
            <div className="w-10 sm:w-16 h-1.5 sm:h-2.5 rounded-t bg-emerald-600 border border-emerald-700 mb-0.5 sm:mb-1" />
            <div className="w-12 sm:w-20 h-12 sm:h-16 rounded-b-lg sm:rounded-b-xl bg-gradient-to-b from-emerald-600 to-emerald-700 flex flex-col items-center justify-between p-1 sm:p-2 text-white shadow-xs">
              <Icon name="recycling" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100 my-auto" />
              <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-[9px] sm:text-[11px] font-mono font-bold whitespace-nowrap">
                {binCounts.RECYCLABLE} items
              </div>
            </div>
            <h4 className="text-[9px] sm:text-xs font-bold text-emerald-800 mt-1 sm:mt-1.5 text-center truncate w-full">Recyclables</h4>
          </div>

          {/* 2. RDF Fuel Dustbin */}
          <div className={`p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border bg-white flex flex-col items-center justify-between transition-all shadow-xs ${
            activeBinImpacts.RDF ? 'border-amber-500 ring-2 ring-amber-400/40 dustbin-impact-active' : 'border-surface-container-high'
          }`}>
            <div className="w-10 sm:w-16 h-1.5 sm:h-2.5 rounded-t bg-amber-600 border border-amber-700 mb-0.5 sm:mb-1" />
            <div className="w-12 sm:w-20 h-12 sm:h-16 rounded-b-lg sm:rounded-b-xl bg-gradient-to-b from-amber-600 to-amber-700 flex flex-col items-center justify-between p-1 sm:p-2 text-white shadow-xs">
              <Icon name="local_fire_department" className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 my-auto" />
              <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-200 text-[9px] sm:text-[11px] font-mono font-bold whitespace-nowrap">
                {binCounts.RDF} items
              </div>
            </div>
            <h4 className="text-[9px] sm:text-xs font-bold text-amber-800 mt-1 sm:mt-1.5 text-center truncate w-full">RDF Fuel</h4>
          </div>

          {/* 3. Organic Compost Dustbin */}
          <div className={`p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border bg-white flex flex-col items-center justify-between transition-all shadow-xs ${
            activeBinImpacts.ORGANIC ? 'border-green-600 ring-2 ring-green-400/40 dustbin-impact-active' : 'border-surface-container-high'
          }`}>
            <div className="w-10 sm:w-16 h-1.5 sm:h-2.5 rounded-t bg-green-700 border border-green-800 mb-0.5 sm:mb-1" />
            <div className="w-12 sm:w-20 h-12 sm:h-16 rounded-b-lg sm:rounded-b-xl bg-gradient-to-b from-green-700 to-green-800 flex flex-col items-center justify-between p-1 sm:p-2 text-white shadow-xs">
              <Icon name="grass" className="w-4 h-4 sm:w-5 sm:h-5 text-green-100 my-auto" />
              <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-green-950/80 text-green-200 text-[9px] sm:text-[11px] font-mono font-bold whitespace-nowrap">
                {binCounts.ORGANIC} items
              </div>
            </div>
            <h4 className="text-[9px] sm:text-xs font-bold text-green-800 mt-1 sm:mt-1.5 text-center truncate w-full">Organic</h4>
          </div>

          {/* 4. Landfill Dustbin */}
          <div className={`p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border bg-white flex flex-col items-center justify-between transition-all shadow-xs ${
            activeBinImpacts.LANDFILL ? 'border-slate-600 ring-2 ring-slate-400/40 dustbin-impact-active' : 'border-surface-container-high'
          }`}>
            <div className="w-10 sm:w-16 h-1.5 sm:h-2.5 rounded-t bg-slate-600 border border-slate-700 mb-0.5 sm:mb-1" />
            <div className="w-12 sm:w-20 h-12 sm:h-16 rounded-b-lg sm:rounded-b-xl bg-gradient-to-b from-slate-600 to-slate-700 flex flex-col items-center justify-between p-1 sm:p-2 text-white shadow-xs">
              <Icon name="delete" className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 my-auto" />
              <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 text-[9px] sm:text-[11px] font-mono font-bold whitespace-nowrap">
                {binCounts.LANDFILL} items
              </div>
            </div>
            <h4 className="text-[9px] sm:text-xs font-bold text-slate-700 mt-1 sm:mt-1.5 text-center truncate w-full">Landfill</h4>
          </div>

        </div>

        {/* Live Chute Telemetry Strip */}
        <div className="w-full max-w-5xl shrink-0 px-3 sm:px-4 py-1.5 rounded-xl border border-surface-container-high bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-3 text-xs my-1">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap w-full sm:w-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-primary font-medium truncate text-[11px] sm:text-xs">{recentLog}</span>
          </div>
          <div className="shrink-0 flex items-center gap-3 sm:gap-4 text-on-surface-variant font-medium text-[10px] sm:text-xs">
            <span>Stream Purity: <strong className="text-emerald-700">99.4%</strong></span>
            <span>Belt Speed: <strong className="text-primary">1.42 m/s</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Dock */}
      <div className="border-t border-surface-container-high pt-2.5 sm:pt-3 shrink-0">
        {isCompleted ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-surface-container-low border border-emerald-300 p-2.5 sm:p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Icon name="task_alt" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-primary">
                Sorting simulation completed ({totalItems} items diverted)
              </h4>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={startSimulation}
                className="flex-1 sm:flex-none px-3.5 py-2 sm:py-2.5 rounded-xl border border-surface-container-highest bg-white hover:bg-surface-container-high text-primary text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Icon name="refresh" className="w-3.5 h-3.5 text-forest" />
                <span>Replay</span>
              </button>

              <button
                onClick={onSimulationComplete}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-primary hover:bg-forest text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW INSPECTION DETAILS</span>
                <Icon name="arrow_forward" className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-on-surface-variant font-medium text-[11px] sm:text-xs">CONVEYOR LINE PROGRESS</span>
              <span className="text-forest font-bold text-[11px] sm:text-xs">{Math.round(progress)}% COMPLETE</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-forest rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
