import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcons';
import WasteInspectionOverlay from '../waste_inspection_overlay/WasteInspectionOverlay';

/**
 * WasteChakraSimulation
 * Full-screen responsive 3-stage AI Waste Ingestion, Conveyor Simulation, and Routing Matrix
 * with simple, point-wise quick guide for any first-time visitor.
 */
export default function WasteChakraSimulation() {
  const navigate = useNavigate();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const guideSteps = [
    {
      num: '01',
      title: 'Ingestion & AI Optical Scan',
      icon: 'photo_camera',
      desc: 'Upload any street or household waste photo, or click "Load Real Sample". The local optical classifier instantly isolates objects and identifies polymers, food, or metals.',
    },
    {
      num: '02',
      title: '9-Station Conveyor Simulation',
      icon: 'precision_manufacturing',
      desc: 'Follow the waste package on the 3D twin conveyor as mechanical trommels sieve dirt, overhead electromagnets pull ferrous cans, and air-jets sort plastics.',
    },
    {
      num: '03',
      title: 'Live 4-Way Routing Matrix',
      icon: 'alt_route',
      desc: 'Inspect exact bounding boxes, confidence ratings, and stream destinations: Recyclables to mills, RDF to cement kilns, Organics to compost, and minimal Landfill.',
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-surface text-on-surface p-1 sm:p-3 md:p-6 flex flex-col antialiased">
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative h-full">
        {/* Quick Explanatory Banner (Point-Wise & Dismissible) */}
        {isBannerVisible && (
          <div className="mb-3 px-4 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <Icon name="smart_toy" className="text-[20px]" />
              </div>
              <div className="text-xs md:text-sm">
                <span className="font-bold text-primary">Interactive Plant Digital Twin: </span>
                <span className="text-on-surface-variant">
                  Simulating how WasteChakra's decentralized MRF automatically detects, sieves, and sorts city waste in 3 simple stages.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-bold text-xs hover:bg-secondary-container transition-colors cursor-pointer flex items-center gap-1"
              >
                <Icon name="help_outline" className="text-[16px]" />
                <span>How It Works (Guide)</span>
              </button>
              <button
                onClick={() => setIsBannerVisible(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Dismiss banner"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>
          </div>
        )}

        {/* 3-Stage Simulation Overlay Component */}
        <div className="flex-1 w-full h-full relative">
          <WasteInspectionOverlay 
            isOpen={true} 
            onClose={() => navigate('/')} 
          />
        </div>
      </div>

      {/* Point-Wise Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/80 p-6 md:p-8 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-container transition-colors cursor-pointer"
            >
              <Icon name="close" className="text-[18px]" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-primary font-label-sm text-xs font-bold uppercase mb-3">
              <Icon name="verified" className="text-forest text-[16px]" />
              <span>Simulation Walkthrough</span>
            </div>

            <h3 className="font-headline-sm text-xl md:text-2xl text-primary font-bold mb-2">
              How to Experience This Simulation
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant mb-6 leading-relaxed">
              This simulator models our physical decentralized sorting facilities. You can see real-time computer vision in action right on your own device.
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {guideSteps.map((step) => (
                <div key={step.num} className="p-4 rounded-xl bg-surface border border-surface-container-high/70 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-title-sm text-sm text-primary font-bold mb-1 flex items-center gap-2">
                      <span>{step.title}</span>
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary-container text-primary font-bold text-xs md:text-sm hover:bg-secondary-fixed-dim transition-colors cursor-pointer shadow-xs"
              >
                Got It, Start Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
