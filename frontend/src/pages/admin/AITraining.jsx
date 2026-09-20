import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Card, Button, Modal, Skeleton, ErrorState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const CATEGORY_COLORS = {
  PLASTIC: 'bg-blue-100 text-blue-800 border-blue-200',
  ORGANIC: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PAPER: 'bg-amber-100 text-amber-800 border-amber-200',
  METAL: 'bg-slate-200 text-slate-800 border-slate-300',
  TEXTILE: 'bg-purple-100 text-purple-800 border-purple-200',
  E_WASTE: 'bg-rose-100 text-rose-800 border-rose-200',
  RDF_COMBUSTIBLE: 'bg-orange-100 text-orange-800 border-orange-200',
  MIXED: 'bg-neutral-100 text-neutral-800 border-neutral-200',
};

const CATEGORY_TARGETS = {
  PLASTIC: 40,
  ORGANIC: 35,
  PAPER: 30,
  METAL: 25,
  TEXTILE: 20,
  E_WASTE: 20,
  RDF_COMBUSTIBLE: 25,
};

const SOURCE_LABELS = {
  CITIZEN_REPORT: { label: 'Citizen Report', icon: 'report', color: 'text-emerald-700 bg-emerald-50' },
  COLLECTOR_PROOF: { label: 'Collector Proof', icon: 'local_shipping', color: 'text-blue-700 bg-blue-50' },
  INSPECTION_SCAN: { label: 'Optical Scanner', icon: 'qr_code_scanner', color: 'text-purple-700 bg-purple-50' },
  COMMUNITY_UPLOAD: { label: 'Community Upload', icon: 'photo_camera', color: 'text-amber-700 bg-amber-50' },
  ADMIN_IMPORT: { label: 'Admin Import', icon: 'dataset', color: 'text-slate-700 bg-slate-50' },
};

export default function AITraining() {
  const [summary, setSummary] = useState(null);
  const [samples, setSamples] = useState([]);
  const [models, setModels] = useState([]);
  const [latestJob, setLatestJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [terminalFilter, setTerminalFilter] = useState('ALL');

  // Retrain modal
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const [retrainEpochs, setRetrainEpochs] = useState(15);
  const [retrainBatchSize, setRetrainBatchSize] = useState(16);
  const [triggeringTrain, setTriggeringTrain] = useState(false);

  // Direct Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('PLASTIC');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  // Sample Inspector Modal
  const [inspectedSample, setInspectedSample] = useState(null);
  const [showAugmentationsModal, setShowAugmentationsModal] = useState(false);

  // Batch action state
  const [batchApproving, setBatchApproving] = useState(false);

  // Terminal scroll state
  const terminalRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [dash, samplesRes, modelsRes] = await Promise.all([
        api.getAITrainingDashboard().catch(() => null),
        api.getAITrainingSamples().catch(() => ({ results: [] })),
        api.getModelVersions().catch(() => ({ results: [] })),
      ]);

      if (dash) {
        setSummary(dash);
        setLatestJob(dash.latest_job);
      }
      setSamples(samplesRes?.results || (Array.isArray(samplesRes) ? samplesRes : []));
      setModels(modelsRes?.results || (Array.isArray(modelsRes) ? modelsRes : []));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load AI training data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Poll active training job
  useEffect(() => {
    if (!latestJob || !['RUNNING', 'VALIDATING', 'QUEUED'].includes(latestJob.status)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const jobStatus = await api.getAITrainingJobStatus(latestJob.job_id);
        setLatestJob(jobStatus);

        if (autoScroll && terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }

        if (jobStatus.status === 'COMPLETED' || jobStatus.status === 'FAILED') {
          fetchDashboardData();
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [latestJob?.status, latestJob?.job_id, autoScroll]);

  const handleTriggerRetrain = async () => {
    setTriggeringTrain(true);
    try {
      const newJob = await api.triggerAITraining({
        epochs: retrainEpochs,
        batch_size: retrainBatchSize,
        learning_rate: 0.001,
      });
      setLatestJob(newJob);
      setIsRetrainModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Could not start retraining job');
    } finally {
      setTriggeringTrain(false);
    }
  };

  const handleUpdateSample = async (sampleId, action, newCat = null) => {
    try {
      await api.updateAITrainingSample(sampleId, {
        action,
        category: newCat,
      });
      // Optimistic update
      setSamples((prev) =>
        prev.map((s) => {
          if (s.id !== sampleId) return s;
          if (action === 'APPROVE') return { ...s, status: 'VERIFIED', verified_category: s.predicted_category };
          if (action === 'REJECT') return { ...s, status: 'REJECTED' };
          if (action === 'RELABEL' && newCat) return { ...s, status: 'VERIFIED', verified_category: newCat };
          return s;
        })
      );
      if (inspectedSample && inspectedSample.id === sampleId) {
        setInspectedSample(null);
      }
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update sample');
    }
  };

  const handleBatchApprove = async () => {
    setBatchApproving(true);
    try {
      await api.batchApproveAITrainingSamples();
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to batch approve pending samples');
    } finally {
      setBatchApproving(false);
    }
  };

  const handleDirectUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', uploadFile);
      fd.append('category', uploadCategory);
      fd.append('notes', uploadNotes);
      await api.uploadAITrainingSample(fd);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadNotes('');
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to upload training sample');
    } finally {
      setUploading(false);
    }
  };

  const handleActivateModel = async (modelId) => {
    try {
      await api.activateModelVersion(modelId);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to activate model');
    }
  };

  const filteredSamples = samples.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL') {
      const cat = s.verified_category || s.predicted_category;
      if (cat !== categoryFilter) return false;
    }
    return true;
  });

  const isTrainingActive = latestJob && ['RUNNING', 'VALIDATING', 'QUEUED'].includes(latestJob.status);

  // Terminal log filtering
  const terminalLogs = (latestJob?.logs || []).filter((log) => {
    if (terminalFilter === 'EPOCH') return log.includes('[EPOCH]');
    if (terminalFilter === 'AUGMENT') return log.includes('[AUGMENT]') || log.includes('[DATASET]');
    if (terminalFilter === 'DEPLOY') return log.includes('[SUCCESS]') || log.includes('[DEPLOY]');
    return true;
  });

  // Calculate training curve coordinates for interactive SVG chart
  const history = latestJob?.metrics_history || [];
  const chartWidth = 520;
  const chartHeight = 150;
  const padding = 24;

  const getChartPoints = (key, minVal, maxVal) => {
    if (history.length < 2) return '';
    return history
      .map((pt, i) => {
        const x = padding + (i / (history.length - 1)) * (chartWidth - padding * 2);
        const val = pt[key] ?? 0;
        const norm = (val - minVal) / Math.max(0.0001, maxVal - minVal);
        const y = chartHeight - padding - norm * (chartHeight - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const lossPoints = getChartPoints('train_loss', 0.1, 0.85);
  const mapPoints = getChartPoints('mAP_50', 0.75, 0.98);

  const pendingCount = summary?.metrics?.pending_samples ?? samples.filter(s => s.status === 'PENDING_REVIEW').length;
  const verifiedCount = summary?.metrics?.verified_samples ?? samples.filter(s => s.status === 'VERIFIED').length;
  const trainedCount = summary?.metrics?.trained_samples ?? samples.filter(s => s.status === 'TRAINED').length;

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto w-full">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00180b] text-[#abf854] shadow-xs">
              <Icon name="psychology" className="text-2xl" />
            </div>
            <div>
              <h1 className="font-headline-md text-2xl md:text-3xl text-primary font-extrabold tracking-tight">
                Vision AI Continuous Learning Studio
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                Active-learning pipeline continuously training WasteChakra vision models with crowdsourced citizen & collector imagery.
              </p>
            </div>
          </div>
        </div>

        {/* Consolidated Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isTrainingActive
                ? 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse'
                : 'bg-secondary-container/60 text-primary border-primary/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isTrainingActive ? 'bg-amber-600 animate-ping' : 'bg-[#00180b]'}`} />
            {isTrainingActive ? `TRAINING EPOCH ${latestJob?.current_epoch}/${latestJob?.total_epochs}` : 'PIPELINE READY'}
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAugmentationsModal(true)}
            className="flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            <Icon name="auto_awesome" className="text-xs" />
            <span>Augmentations</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            <Icon name="photo_camera" className="text-xs" />
            <span>Add Sample</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRetrainModalOpen(true)}
            disabled={isTrainingActive}
            className="flex items-center gap-1.5 bg-[#abf854] text-[#00180b] hover:bg-[#9ee240] font-extrabold shadow-xs text-xs py-1.5 px-4"
          >
            <Icon name="smart_toy" className="text-xs" />
            <span>{isTrainingActive ? 'Training...' : 'Start Retraining'}</span>
          </Button>
        </div>
      </div>

      {error && <ErrorState title="Unable to connect to AI engine" message={error} onRetry={fetchDashboardData} />}

      {/* 2. Unified 4-Stage Executive Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stage 1 */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container-high shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Stage 01 • Ingest Pool</span>
            <Icon name="photo_library" className="text-emerald-700 text-lg" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary font-mono tracking-tight">
              {summary?.metrics?.total_samples ?? samples.length}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Crowdsourced user photos from citizen reports & collector pickups.
            </p>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container-high shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">Stage 02 • Curation Pool</span>
            <Icon name="task_alt" className="text-blue-700 text-lg" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary font-mono tracking-tight flex items-baseline gap-2">
              <span>{verifiedCount}</span>
              <span className="text-xs font-bold text-amber-700 font-sans">({pendingCount} Pending)</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              High-confidence images verified for the next training iteration.
            </p>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container-high shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">Stage 03 • Synthesis</span>
            <Icon name="auto_awesome" className="text-amber-700 text-lg" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary font-mono tracking-tight">
              8x <span className="text-xs font-bold text-on-surface-variant font-sans">Expansion</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              RandomMosaic, ColorJitter & Affine geometric permutations.
            </p>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container-high shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">Stage 04 • Edge Model</span>
            <Icon name="speed" className="text-purple-700 text-lg" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {(summary?.active_model?.mAP_50 ? summary.active_model.mAP_50 * 100 : 93.6).toFixed(1)}%
            </div>
            <p className="text-xs text-on-surface-variant mt-1 truncate">
              {summary?.active_model?.version_tag || 'v2.4.0-edge-yolo'} in production.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Master Operations Deck: Training Session & Terminal */}
      {latestJob && (
        <Card className="p-0 border border-surface-container-high overflow-hidden shadow-xs bg-surface">
          {/* Deck Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-[#00180b] text-white gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-[#abf854]">
                <Icon name="psychology" className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-wide">
                    Active Run: {latestJob.job_id}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      latestJob.status === 'COMPLETED'
                        ? 'bg-[#abf854] text-[#00180b]'
                        : latestJob.status === 'RUNNING'
                        ? 'bg-amber-400 text-black animate-pulse'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {latestJob.status}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  Epoch {latestJob.current_epoch} of {latestJob.total_epochs} • {latestJob.samples_count || samples.length} community samples
                </p>
              </div>
            </div>

            {/* Metric counters */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-white/60 text-[11px] block">Train Loss</span>
                <span className="font-mono font-bold text-[#abf854]">
                  {latestJob.current_loss ? latestJob.current_loss.toFixed(4) : '0.1420'}
                </span>
              </div>
              <div>
                <span className="text-white/60 text-[11px] block">Val mAP@50</span>
                <span className="font-mono font-bold text-white">
                  {latestJob.val_mAP ? `${(latestJob.val_mAP * 100).toFixed(1)}%` : '91.8%'}
                </span>
              </div>
              <div>
                <span className="text-white/60 text-[11px] block">Progress</span>
                <span className="font-mono font-bold text-white">{latestJob.progress_percent.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/20 h-1.5">
            <div
              className="bg-linear-to-r from-emerald-500 via-[#abf854] to-emerald-400 h-1.5 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(2, latestJob.progress_percent))}%` }}
            />
          </div>

          {/* Dual Column Deck Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-surface-container">
            {/* Left Column: Interactive Convergence Chart */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div>
                    <h4 className="font-bold text-primary text-sm">Loss Descent & Accuracy Ascent</h4>
                    <p className="text-xs text-on-surface-variant">Epoch-by-epoch loss reduction vs validation mAP progression</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                      <span className="w-3 h-0.5 bg-rose-500 rounded" /> Loss
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="w-3 h-0.5 bg-emerald-500 rounded" /> mAP@50
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full bg-surface-container/40 rounded-xl p-3 border border-surface-container relative flex items-center justify-center">
                  {history.length > 1 ? (
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                      {/* Grid lines */}
                      <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#00000012" strokeDasharray="3 3" />
                      <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#00000012" strokeDasharray="3 3" />
                      <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#00000018" />

                      {/* Loss line */}
                      {lossPoints && (
                        <polyline
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={lossPoints}
                        />
                      )}

                      {/* mAP line */}
                      {mapPoints && (
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={mapPoints}
                        />
                      )}

                      {/* Epoch dots */}
                      {history.map((pt, i) => {
                        const x = padding + (i / (history.length - 1)) * (chartWidth - padding * 2);
                        const y = chartHeight - padding - ((pt.mAP_50 - 0.75) / 0.23) * (chartHeight - padding * 2);
                        return (
                          <g key={i} className="cursor-pointer group">
                            <circle cx={x} cy={y} r="3.5" fill="#10b981" className="group-hover:r-5 transition-all" />
                            <title>{`Epoch ${pt.epoch}: Loss ${pt.train_loss.toFixed(3)} | mAP ${(pt.mAP_50 * 100).toFixed(1)}%`}</title>
                          </g>
                        );
                      })}
                    </svg>
                  ) : (
                    <div className="text-center text-xs text-on-surface-variant font-mono">
                      <span>Waiting for initial epoch loss calculations...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant font-mono">
                <span>Optimizer: AdamW (lr=0.001)</span>
                <span>Batch: {latestJob.batch_size || 16} images</span>
                <span>Backbone: Darknet CSP-53</span>
              </div>
            </div>

            {/* Right Column: AI Worker Console */}
            <div className="lg:col-span-5 bg-[#001108] text-emerald-400 font-mono text-xs flex flex-col justify-between">
              <div>
                {/* Console Top Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#00180b] text-white/70 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="ml-1 font-bold text-white tracking-wide">Live Worker Log</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoScroll(!autoScroll)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                        autoScroll ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'text-white/40 border-white/10'
                      }`}
                    >
                      Auto: {autoScroll ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText((latestJob.logs || []).join('\n'));
                        alert('Worker logs copied to clipboard!');
                      }}
                      title="Copy full logs"
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
                    >
                      <Icon name="description" className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-black/30 text-[10px]">
                  {['ALL', 'EPOCH', 'AUGMENT', 'DEPLOY'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTerminalFilter(f)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        terminalFilter === f ? 'bg-[#abf854] text-[#00180b] font-bold' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Log Stream */}
                <div
                  ref={terminalRef}
                  className="max-h-52 overflow-y-auto p-3.5 flex flex-col gap-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/20 leading-relaxed text-[11px]"
                >
                  {terminalLogs.length > 0 ? (
                    terminalLogs.map((logLine, idx) => (
                      <div key={idx} className="break-all">
                        <span className="text-white/30 select-none mr-2">›</span>
                        <span
                          className={
                            logLine.includes('[SUCCESS]') || logLine.includes('[DEPLOY]')
                              ? 'text-[#abf854] font-bold'
                              : logLine.includes('[EPOCH]')
                              ? 'text-emerald-200'
                              : logLine.includes('[INIT]') || logLine.includes('[DATASET]')
                              ? 'text-cyan-300'
                              : logLine.includes('[AUGMENT]')
                              ? 'text-amber-300'
                              : 'text-emerald-400'
                          }
                        >
                          {logLine}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-white/40 italic">No output logged for this filter.</span>
                  )}
                </div>
              </div>

              <div className="px-4 py-2 border-t border-white/10 bg-black/40 text-[10px] text-white/50 flex items-center justify-between">
                <span>Status: {latestJob.status}</span>
                <span>{latestJob.logs?.length || 0} event entries</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Target Dataset Balance & Quotas */}
      <Card className="p-6 border border-surface-container-high shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-surface-container gap-3">
          <div>
            <h3 className="font-headline-sm text-base md:text-lg text-primary font-extrabold">
              Dataset Balance & Fine-Tuning Readiness
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Balanced class distribution avoids sorting bias on conveyor optical detectors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              {pendingCount} Pending Curation
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={batchApproving || pendingCount === 0}
              onClick={handleBatchApprove}
              className="text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Icon name="check" className="text-xs" />
              <span>{batchApproving ? 'Approving...' : 'Batch Approve All Pending'}</span>
            </Button>
          </div>
        </div>

        {/* 7 Category Progress Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(CATEGORY_TARGETS).map(([catKey, target]) => {
            const currentCount = summary?.category_distribution?.[catKey] ?? 0;
            const pct = Math.min(100, Math.round((currentCount / target) * 100));
            const isReady = pct >= 80;

            return (
              <div key={catKey} className="p-3 rounded-xl bg-surface-container/40 border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary truncate">{catKey}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'}`}>
                    {currentCount}/{target}
                  </span>
                </div>

                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isReady ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.max(8, pct)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>{pct}% ready</span>
                  <span className={isReady ? 'text-emerald-700 font-bold' : ''}>{isReady ? 'Optimal' : 'Needs data'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Crowdsourced Dataset Gallery & Annotation Studio */}
      <div className="flex flex-col gap-4">
        {/* Gallery Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-headline-sm text-lg md:text-xl text-primary font-extrabold">
              Crowdsourced Dataset & Annotation Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-bold text-xs">
              {samples.length} Samples
            </span>
          </div>

          {/* Unified Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-surface-container rounded-xl p-1 border border-surface-container-high text-xs font-medium">
              {[
                { id: 'ALL', label: `All (${samples.length})` },
                { id: 'PENDING_REVIEW', label: `Pending (${pendingCount})` },
                { id: 'VERIFIED', label: `Verified (${verifiedCount})` },
                { id: 'TRAINED', label: `Trained (${trainedCount})` },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === st.id
                      ? 'bg-primary text-white font-bold shadow-2xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-surface border border-surface-container-high rounded-xl px-3 py-2 text-primary font-medium focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="PLASTIC">Plastic</option>
              <option value="ORGANIC">Organic</option>
              <option value="PAPER">Paper</option>
              <option value="METAL">Metal</option>
              <option value="TEXTILE">Textile</option>
              <option value="E_WASTE">E-Waste</option>
              <option value="RDF_COMBUSTIBLE">RDF Fuel</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid (Balanced 4-Column Layout) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredSamples.length === 0 ? (
          <Card className="p-10 text-center text-on-surface-variant">
            <Icon name="photo_library" className="text-4xl mx-auto mb-2 opacity-40" />
            <p className="font-bold">No training samples found matching current filter.</p>
            <p className="text-xs mt-1">Switch to All Samples or upload an image directly.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSamples.map((sample) => {
              const srcMeta = SOURCE_LABELS[sample.source] || SOURCE_LABELS.CITIZEN_REPORT;
              const cat = sample.verified_category || sample.predicted_category || 'MIXED';
              const catColor = CATEGORY_COLORS[cat] || CATEGORY_COLORS.MIXED;

              return (
                <Card
                  key={sample.id}
                  className="p-0 overflow-hidden border border-surface-container flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer hover:-translate-y-0.5 duration-200"
                  onClick={() => setInspectedSample(sample)}
                >
                  {/* Photo with badges */}
                  <div className="relative aspect-4/3 w-full bg-neutral-900 overflow-hidden">
                    <img
                      src={sample.image_url_display || sample.image_url || '/sample_waste.jpg'}
                      alt={cat}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Source badge overlay */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md shadow-xs">
                      <Icon name={srcMeta.icon} className="text-xs" />
                      <span>{srcMeta.label}</span>
                    </div>

                    {/* Status badge overlay */}
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sample.status === 'VERIFIED'
                            ? 'bg-emerald-500 text-white'
                            : sample.status === 'TRAINED'
                            ? 'bg-blue-600 text-white'
                            : sample.status === 'REJECTED'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-400 text-amber-950 font-bold'
                        }`}
                      >
                        {sample.status === 'PENDING_REVIEW' ? 'Pending' : sample.status}
                      </span>
                    </div>

                    {/* Hover Inspect CTA */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-white text-primary font-bold text-xs flex items-center gap-1.5 shadow-md">
                        <Icon name="visibility" className="text-xs" /> Inspect Bounds
                      </span>
                    </div>

                    {/* Confidence score */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono">
                      Conf: {(sample.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 flex flex-col gap-2.5 flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${catColor}`}>
                          {cat}
                        </span>
                        {sample.eco_credits_awarded > 0 && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <Icon name="redeem" className="text-xs" />
                            +{sample.eco_credits_awarded} pts
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
                        {sample.notes || `Contributed via ${srcMeta.label}`}
                      </p>
                    </div>

                    {/* Contributor Metadata */}
                    <div className="pt-2.5 border-t border-surface-container text-[11px] text-on-surface-variant flex items-center justify-between">
                      <span className="truncate max-w-28 font-medium text-primary">
                        {sample.contributor_name}
                      </span>
                      <span className="font-mono text-on-surface-variant">
                        {sample.source_reference_id || 'ID: ' + sample.id.slice(0, 6)}
                      </span>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center gap-1.5 pt-2" onClick={(e) => e.stopPropagation()}>
                      {sample.status !== 'VERIFIED' && sample.status !== 'TRAINED' ? (
                        <button
                          onClick={() => handleUpdateSample(sample.id, 'APPROVE')}
                          title="Verify for Training"
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Icon name="check" className="text-xs" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-200">
                          <Icon name="task_alt" className="text-xs" /> Verified
                        </span>
                      )}

                      <select
                        value={cat}
                        onChange={(e) => handleUpdateSample(sample.id, 'RELABEL', e.target.value)}
                        className="py-1 px-1.5 rounded-lg border border-surface-container-high text-[11px] font-medium bg-surface text-primary"
                        title="Relabel Category"
                      >
                        <option value="PLASTIC">Plastic</option>
                        <option value="ORGANIC">Organic</option>
                        <option value="PAPER">Paper</option>
                        <option value="METAL">Metal</option>
                        <option value="TEXTILE">Textile</option>
                        <option value="E_WASTE">E-Waste</option>
                        <option value="RDF_COMBUSTIBLE">RDF</option>
                      </select>

                      {sample.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdateSample(sample.id, 'REJECT')}
                          title="Reject blurry / invalid photo"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs transition-colors"
                        >
                          <Icon name="close" className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Production Model Registry */}
      <Card className="p-6 border border-surface-container-high shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
          <div>
            <h3 className="font-headline-sm text-base md:text-lg text-primary font-extrabold">
              Model Checkpoints & Production Registry
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Active vision model weights serving automated waste sorting and real-time plant inspections.
            </p>
          </div>
          <Icon name="psychology" className="text-2xl text-primary/30" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-container text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="pb-3">Version Tag</th>
                <th className="pb-3">Architecture</th>
                <th className="pb-3 text-center">mAP@50</th>
                <th className="pb-3 text-center">F1-Score</th>
                <th className="pb-3 text-center">Trained Samples</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {models.map((mod) => (
                <tr key={mod.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 font-mono font-bold text-primary">{mod.version_tag}</td>
                  <td className="py-3 text-xs text-on-surface-variant">{mod.architecture}</td>
                  <td className="py-3 text-center font-mono font-bold text-emerald-700">
                    {(mod.mAP_50 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-center font-mono font-medium text-on-surface-variant">
                    {mod.f1_score.toFixed(3)}
                  </td>
                  <td className="py-3 text-center font-medium">{mod.total_samples_trained}</td>
                  <td className="py-3 text-center">
                    {mod.is_active ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#abf854] text-[#00180b]">
                        Active Production
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs text-on-surface-variant bg-surface-container">
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {!mod.is_active && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleActivateModel(mod.id)}
                        className="text-xs py-1 px-2.5 font-bold"
                      >
                        Deploy to Edge
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 7. Sample Inspector Modal (Click Card to View Bounding Boxes) */}
      {inspectedSample && (
        <Modal
          isOpen={!!inspectedSample}
          onClose={() => setInspectedSample(null)}
          title={`Inspect Training Sample: ${inspectedSample.source_reference_id || inspectedSample.id.slice(0, 8)}`}
        >
          <div className="flex flex-col gap-5">
            {/* Visual Box Viewer */}
            <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <img
                src={inspectedSample.image_url_display || inspectedSample.image_url || '/sample_waste.jpg'}
                alt="Inspected Sample"
                className="w-full h-full object-contain"
              />

              {/* Draw bounding boxes */}
              {(inspectedSample.bounding_boxes || []).map((box, bIdx) => {
                const [ymin, xmin, ymax, xmax] = box.box_2d || [0.2, 0.2, 0.8, 0.8];
                const top = `${ymin * 100}%`;
                const left = `${xmin * 100}%`;
                const width = `${(xmax - xmin) * 100}%`;
                const height = `${(ymax - ymin) * 100}%`;

                return (
                  <div
                    key={bIdx}
                    className="absolute border-2 border-[#abf854] bg-[#abf854]/15 rounded pointer-events-none transition-all"
                    style={{ top, left, width, height }}
                  >
                    <span className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-[#00180b] text-[#abf854] text-[10px] font-bold font-mono tracking-wider shadow-xs whitespace-nowrap">
                      {box.label} ({(box.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-on-surface-variant block">Category</span>
                <strong className="text-primary text-sm font-bold">
                  {inspectedSample.verified_category || inspectedSample.predicted_category}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-on-surface-variant block">Quality Score</span>
                <strong className="text-emerald-700 text-sm font-bold">
                  {((inspectedSample.quality_score || 0.92) * 100).toFixed(0)}% Clear
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-on-surface-variant block">Confidence</span>
                <strong className="text-primary text-sm font-mono font-bold">
                  {((inspectedSample.confidence || 0.88) * 100).toFixed(1)}%
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-surface-container">
                <span className="text-on-surface-variant block">Contributor</span>
                <strong className="text-primary text-sm truncate block font-bold">
                  {inspectedSample.contributor_name}
                </strong>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant italic">
              Notes: {inspectedSample.notes || 'No extra notes provided for this sample.'}
            </p>

            {/* Admin actions inside modal */}
            <div className="flex items-center justify-between pt-4 border-t border-surface-container">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateSample(inspectedSample.id, 'APPROVE')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Verify for Training
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateSample(inspectedSample.id, 'REJECT')}
                  className="text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                >
                  Flag / Reject
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setInspectedSample(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 8. Synthetic Augmentations Preview Modal */}
      {showAugmentationsModal && (
        <Modal
          isOpen={showAugmentationsModal}
          onClose={() => setShowAugmentationsModal(false)}
          title="Synthetic Data Augmentation Pipeline Preview"
        >
          <div className="flex flex-col gap-4 text-xs text-on-surface-variant">
            <p>
              To ensure robust generalization from community-submitted garbage photographs, the training engine expands every batch by 8x with stochastic augmentations:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high text-center">
                <div className="aspect-square bg-neutral-800 rounded-lg mb-2 flex items-center justify-center text-emerald-400 font-bold">
                  Raw Original
                </div>
                <strong className="text-primary block">1. Clean Ingest</strong>
                <span className="text-[10px]">Unperturbed user photo</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high text-center">
                <div className="aspect-square bg-neutral-800 rounded-lg mb-2 flex items-center justify-center text-amber-400 font-bold">
                  RandomMosaic
                </div>
                <strong className="text-primary block">2. 4-Way Mosaic</strong>
                <span className="text-[10px]">Stitches 4 random samples</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high text-center">
                <div className="aspect-square bg-neutral-800 rounded-lg mb-2 flex items-center justify-center text-cyan-400 font-bold">
                  ColorJitter
                </div>
                <strong className="text-primary block">3. Photometric</strong>
                <span className="text-[10px]">±25% brightness shifts</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high text-center">
                <div className="aspect-square bg-neutral-800 rounded-lg mb-2 flex items-center justify-center text-purple-400 font-bold">
                  Affine & Shear
                </div>
                <strong className="text-primary block">4. Geometry</strong>
                <span className="text-[10px]">±12° rotation & flip</span>
              </div>
            </div>

            <p className="text-[11px] p-3 rounded-xl bg-secondary-container/40 text-primary border border-secondary-container">
              💡 <strong>Augmentation Impact:</strong> Community uploads are multiplied into <strong>hundreds of augmented variants</strong>, virtually eliminating false positives on high-speed conveyor belts.
            </p>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setShowAugmentationsModal(false)}>
                Understood
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 9. Retrain Trigger Modal */}
      {isRetrainModalOpen && (
        <Modal
          isOpen={isRetrainModalOpen}
          onClose={() => setIsRetrainModalOpen(false)}
          title="Trigger Vision AI Retraining Pipeline"
        >
          <div className="flex flex-col gap-5">
            <p className="text-sm text-on-surface-variant">
              This triggers the asynchronous continuous learning pipeline. Verified crowdsourced images will be combined with synthetic augmentations to fine-tune the YOLOv8 classification & segmentation heads.
            </p>

            <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary block">Ready for Training</span>
                <span className="text-xl font-mono font-bold text-emerald-700">
                  {summary?.metrics?.ready_for_training ?? samples.length} Community Samples
                </span>
              </div>
              <Icon name="task_alt" className="text-2xl text-emerald-600" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-primary">Training Epochs: {retrainEpochs}</label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={retrainEpochs}
                onChange={(e) => setRetrainEpochs(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>5 (Fast demo ~8s)</span>
                <span>15 (Recommended ~20s)</span>
                <span>30 (Full convergence ~40s)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-primary">Batch Size</label>
              <div className="grid grid-cols-3 gap-3">
                {[8, 16, 32].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setRetrainBatchSize(b)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      retrainBatchSize === b
                        ? 'bg-[#00180b] text-[#abf854] border-[#00180b]'
                        : 'border-surface-container-high text-primary hover:bg-surface-container'
                    }`}
                  >
                    Batch {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
              <Button variant="ghost" onClick={() => setIsRetrainModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleTriggerRetrain}
                disabled={triggeringTrain}
                className="bg-[#abf854] text-[#00180b] font-bold hover:bg-[#9ee240]"
              >
                {triggeringTrain ? 'Launching Pipeline...' : 'Start Training Run'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 10. Direct Image Upload Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Contribute Training Image"
        >
          <form onSubmit={handleDirectUpload} className="flex flex-col gap-4">
            <p className="text-xs text-on-surface-variant">
              Upload a waste sample photo directly to the training pool with ground-truth category tagging.
            </p>

            <div>
              <label className="text-xs font-bold text-primary block mb-1">Waste Image File</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="text-xs w-full file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-surface-container file:text-primary file:font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-primary block mb-1">Target Waste Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-container-high bg-surface text-primary"
              >
                <option value="PLASTIC">Plastic</option>
                <option value="ORGANIC">Organic</option>
                <option value="PAPER">Paper</option>
                <option value="METAL">Metal</option>
                <option value="TEXTILE">Textile</option>
                <option value="E_WASTE">E-Waste</option>
                <option value="RDF_COMBUSTIBLE">RDF Fuel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-primary block mb-1">Dataset Notes</label>
              <textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                placeholder="E.g. Discarded high-density polyethylene shampoo bottle..."
                className="w-full text-xs p-2.5 rounded-lg border border-surface-container-high bg-surface text-primary h-20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
              <Button variant="ghost" type="button" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={uploading || !uploadFile}>
                {uploading ? 'Uploading...' : 'Add to Training Set'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
