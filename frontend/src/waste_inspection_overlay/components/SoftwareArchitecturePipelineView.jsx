import React from 'react';
import Icon from "../../components/AppIcons";

/**
 * Visual implementation of the exact Canva Software Architecture diagram:
 * A modular pipeline to detect, evaluate and refine waste classification for reliable decision-making.
 *
 * STAGE 1 -> OBJECT DETECTION MODEL (Trained from Scratch on TACO Dataset)
 * STAGE 2 -> EVALUATION OF RESULTS (Performance & Reliability Check)
 *            [Decision Diamond: Results Good? Yes -> Deploy (Skip Stage 3) | No -> Refine in Stage 3]
 * STAGE 3 -> REFINEMENT OF RESULTS (Improve & Optimize)
 */
export default function SoftwareArchitecturePipelineView({
  architectureData,
  rawCount = 0,
  finalCount = 0,
  onSwitchToLiveRouting,
}) {
  const stage1 = architectureData?.stage_1_detection || {};
  const stage2 = architectureData?.stage_2_evaluation || {};
  const stage3 = architectureData?.stage_3_refinement || {};
  const decision = architectureData?.decision_diamond || {};

  const isGood = decision?.decision === 'DEPLOY_DIRECT' || stage2?.decision === 'DEPLOY_DIRECT';

  return (
    <div className="w-full flex flex-col gap-4 p-3 sm:p-5 bg-white rounded-2xl border border-surface-container-high shadow-xs select-none">
      
      {/* Title Header: Exact slide styling */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-container-high pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-amber-600 inline-block" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
              SOFTWARE <span className="text-emerald-800">ARCHITECTURE</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            A modular pipeline to <span className="text-emerald-700 font-bold">detect</span>,{' '}
            <span className="text-emerald-700 font-bold">evaluate</span> and{' '}
            <span className="text-emerald-700 font-bold">refine</span> waste classification for reliable decision-making.
          </p>
        </div>

        {onSwitchToLiveRouting && (
          <button
            onClick={onSwitchToLiveRouting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest hover:bg-primary text-secondary-container text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Icon name="visibility" className="w-3.5 h-3.5" />
            <span>View Live Conveyor Streams</span>
          </button>
        )}
      </div>

      {/* Main 3-Stage Diagram Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative">
        
        {/* ================= STAGE 1 ================= */}
        <div className="lg:col-span-4 rounded-2xl border-2 border-emerald-800/80 bg-white flex flex-col overflow-hidden shadow-xs">
          {/* Header Banner */}
          <div className="bg-emerald-900 text-white p-3 sm:p-3.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-emerald-900 font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                OBJECT DETECTION MODEL
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">
                (Trained from Scratch on TACO Dataset)
              </div>
            </div>
          </div>

          {/* Diagram Body */}
          <div className="p-3.5 flex-1 flex flex-col justify-between gap-3 bg-emerald-50/20">
            
            {/* TACO -> YOLO -> Detected Visual */}
            <div className="rounded-xl border border-surface-container-high bg-white p-3 flex items-center justify-between gap-2 shadow-2xs">
              
              {/* TACO Dataset Column */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center p-1 relative border border-slate-700 shadow-inner">
                  <span className="text-[9px] font-mono font-bold text-amber-400">TACO</span>
                  <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400/80" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400/80" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-800 mt-1">TACO Dataset</span>
                <span className="text-[9px] text-slate-500 leading-tight">(Trash Annotations in Context)</span>
              </div>

              {/* Arrow */}
              <span className="text-emerald-700 font-bold text-base">➔</span>

              {/* YOLO Model */}
              <div className="flex flex-col items-center text-center">
                <div className="px-2.5 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs font-mono shadow-2xs">
                  YOLO
                </div>
                <span className="text-[9px] text-slate-500 font-medium mt-1">(Trained from scratch)</span>
              </div>

              {/* Arrow */}
              <span className="text-emerald-700 font-bold text-base">➔</span>

              {/* Object Detection & Classification Box */}
              <div className="flex flex-col items-center text-center">
                <div className="p-1.5 rounded-xl border border-slate-300 bg-slate-900 text-white flex flex-col gap-1 shadow-xs min-w-[70px]">
                  <div className="border border-blue-400 bg-blue-500/20 px-1 py-0.5 rounded text-[8px] font-bold text-blue-200">
                    bottle
                  </div>
                  <div className="border border-amber-400 bg-amber-500/20 px-1 py-0.5 rounded text-[8px] font-bold text-amber-200">
                    cardboard
                  </div>
                  <div className="border border-yellow-300 bg-yellow-400/20 px-1 py-0.5 rounded text-[8px] font-bold text-yellow-100">
                    banana
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-700 mt-1">Classification</span>
              </div>

            </div>

            {/* Runtime Status Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
              <span className="font-semibold text-slate-600">Active Detected Items:</span>
              <span className="font-mono font-extrabold text-emerald-900 text-sm">
                {stage1.raw_detected_count ?? rawCount} Objects
              </span>
            </div>

            {/* Bottom Capsule Text */}
            <div className="rounded-xl bg-emerald-100/70 p-2.5 text-center text-xs font-bold text-emerald-950 border border-emerald-200/80">
              Detects and classifies waste objects in real-time from images.
            </div>

          </div>
        </div>


        {/* ================= STAGE 2 + DECISION DIAMOND ================= */}
        <div className="lg:col-span-4 rounded-2xl border-2 border-emerald-800/80 bg-white flex flex-col overflow-hidden shadow-xs relative">
          {/* Header Banner */}
          <div className="bg-emerald-900 text-white p-3 sm:p-3.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-emerald-900 font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                EVALUATION OF RESULTS
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">
                (Performance & Reliability Check)
              </div>
            </div>
          </div>

          {/* Diagram Body */}
          <div className="p-3.5 flex-1 flex flex-col justify-between gap-3 bg-emerald-50/20">
            
            {/* 4 Feature Items */}
            <div className="space-y-2.5">
              
              {/* Quantitative Metrics */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="analytics" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Quantitative Metrics</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    mAP, Precision, Recall, F1-score
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {stage2.ground_truth_status === 'AVAILABLE' ? 'mAP@50 Evaluated' : 'Runtime: N/A — ground truth unavailable'}
                  </div>
                </div>
              </div>

              {/* Qualitative Analysis */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="fact_check" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Qualitative Analysis</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Visual inspection of predictions & boxes
                  </div>
                </div>
              </div>

              {/* Error Analysis */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="pie_chart" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Error Analysis</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Misclassifications, confusion cases, duplicates ({stage2.duplicate_overlap_count ?? 0})
                  </div>
                </div>
              </div>

              {/* Decision */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="balance" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Decision</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    If performance meets target → deploy directly
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Else → refine in Stage 3
                  </div>
                </div>
              </div>

            </div>

            {/* Decision Diamond Interactive Graphic */}
            <div className="p-3 rounded-xl border-2 border-dashed border-emerald-600 bg-white flex items-center justify-between gap-2 shadow-2xs">
              
              {/* Diamond Node */}
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rotate-45 flex items-center justify-center border-2 transition-all shadow-md ${
                  isGood ? 'bg-emerald-600 border-emerald-800 text-white' : 'bg-amber-500 border-amber-700 text-white'
                }`}>
                  <span className="-rotate-45 text-[9px] font-black leading-tight text-center">
                    Results<br />Good?
                  </span>
                </div>
              </div>

              {/* Branch Decision readout */}
              <div className="flex-1 flex flex-col gap-1 text-[11px] pl-2 border-l border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.2 rounded font-extrabold text-[10px] ${
                    isGood ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'text-slate-400'
                  }`}>
                    Yes ➔
                  </span>
                  <span className={isGood ? 'font-bold text-emerald-800' : 'text-slate-400'}>
                    Deploy (Skip Stage 3)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.2 rounded font-extrabold text-[10px] ${
                    !isGood ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'text-slate-400'
                  }`}>
                    No ➔
                  </span>
                  <span className={!isGood ? 'font-bold text-amber-800' : 'text-slate-400'}>
                    Refine in Stage 3
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Capsule Text */}
            <div className="rounded-xl bg-emerald-100/70 p-2.5 text-center text-xs font-bold text-emerald-950 border border-emerald-200/80">
              Ensures model predictions are accurate, reliable and ready for real-world use.
            </div>

          </div>
        </div>


        {/* ================= STAGE 3 ================= */}
        <div className="lg:col-span-4 rounded-2xl border-2 border-emerald-800/80 bg-white flex flex-col overflow-hidden shadow-xs">
          {/* Header Banner */}
          <div className="bg-emerald-900 text-white p-3 sm:p-3.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-emerald-900 font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                REFINEMENT OF RESULTS
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">
                (Improve & Optimize)
              </div>
            </div>
          </div>

          {/* Diagram Body */}
          <div className="p-3.5 flex-1 flex flex-col justify-between gap-3 bg-emerald-50/20">
            
            {/* 4 Feature Items */}
            <div className="space-y-2.5">
              
              {/* Data Enhancement */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="database" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Data Enhancement</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Add more data / hard examples (data augmentation)
                  </div>
                </div>
              </div>

              {/* Model Improvement */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="settings" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Model Improvement</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Hyperparameter tuning, architecture tweaks
                  </div>
                </div>
              </div>

              {/* Post-processing */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="adjust" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Post-processing</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Confidence thresholding, NMS, rule-based filtering
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-bold">
                    IoU: {stage3.nms_iou_threshold ?? 0.40} • Conf: {stage3.min_confidence ?? 0.72}
                  </div>
                </div>
              </div>

              {/* Iterate & Validate */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-surface-container-high shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Icon name="autorenew" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Iterate & Validate</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Retrain ➔ Re-evaluate ➔ Deploy
                  </div>
                </div>
              </div>

            </div>

            {/* Runtime Output Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
              <span className="font-semibold text-slate-600">Refined Objects Dispatched:</span>
              <span className="font-mono font-extrabold text-emerald-900 text-sm">
                {stage3.final_count ?? finalCount} Objects
              </span>
            </div>

            {/* Bottom Capsule Text */}
            <div className="rounded-xl bg-emerald-100/70 p-2.5 text-center text-xs font-bold text-emerald-950 border border-emerald-200/80">
              Improves model performance for higher accuracy and robustness.
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Footer Scope Banner: Exact slide design */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-surface-container-high text-xs">
        
        {/* Left Badge: Round 1 Scope */}
        <div className="md:col-span-6 flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950 text-white">
          <div className="p-2 rounded-lg bg-emerald-800 text-secondary-container shrink-0">
            <Icon name="track_changes" className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm tracking-wide uppercase text-secondary-container">
              ROUND 1 SCOPE (Completed)
            </div>
            <ul className="text-[11px] text-emerald-100/90 list-disc list-inside mt-0.5 space-y-0.5">
              <li>Trained YOLO object detection model from scratch on TACO dataset.</li>
              <li>Implemented Stage 1 (Object Detection Model).</li>
            </ul>
          </div>
        </div>

        {/* Right Badge: Round 2 Progress */}
        <div className="md:col-span-6 flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-slate-800">
          <span className="text-emerald-800 font-black text-xl shrink-0">≫</span>
          <div className="text-xs font-semibold leading-relaxed">
            In <span className="text-emerald-900 font-bold">Round 2</span>, we deployed{' '}
            <span className="text-emerald-800 font-bold">Stage 2 (Evaluation)</span> and{' '}
            <span className="text-emerald-800 font-bold">Stage 3 (Refinement)</span> with real-time IoU NMS and Decision Diamond routing.
          </div>
        </div>

      </div>

    </div>
  );
}
