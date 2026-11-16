import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  History,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Upload,
} from 'lucide-react';
import { ChartCanvas } from '../components/ChartCanvas';
import { api } from '../lib/api';
import type { AnalysisRecord, AppRoute, GenderOption, UserProfile } from '../types/hairlume';

export interface PendingScanPayload {
  imageDataUrl: string;
  genderAtScan: GenderOption;
  ageAtScan: number;
  scalpNotes: string;
}

interface UploadCapturePageProps {
  user: UserProfile;
  onStartAnalyze: (payload: PendingScanPayload) => void;
}

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('Please select a JPEG, PNG, or WEBP image file.'));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('File is larger than 12 MB. Please select a smaller photograph.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or corrupted image file.'));
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width < 80 || height < 80) {
          reject(new Error('Image resolution is too small. Please use a clearer photograph.'));
          return;
        }
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize image canvas.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function UploadCapturePage({ user, onStartAnalyze }: UploadCapturePageProps) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [genderAtScan, setGenderAtScan] = useState<GenderOption>(user.gender);
  const [ageAtScan, setAgeAtScan] = useState<number>(user.age);
  const [scalpNotes, setScalpNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPreviewUrl(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera capture is not supported in this browser. Please upload a photo.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Camera permission denied. Please allow camera access or upload an image file.'
      );
      setCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setError('Camera feed is still initializing. Wait a moment and try again.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewUrl(dataUrl);
    stopCamera();
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPreviewUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process selected image.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleModeSwitch = (nextMode: 'upload' | 'camera') => {
    setMode(nextMode);
    setError(null);
    if (nextMode === 'upload') {
      stopCamera();
    } else {
      void startCamera();
    }
  };

  const handleAnalyzeSubmit = () => {
    if (!previewUrl) {
      setError('Please upload or capture a clear hair or scalp photograph first.');
      return;
    }
    if (!Number.isFinite(ageAtScan) || ageAtScan < 13 || ageAtScan > 100) {
      setError('Please enter a valid age between 13 and 100.');
      return;
    }
    stopCamera();
    onStartAnalyze({
      imageDataUrl: previewUrl,
      genderAtScan,
      ageAtScan,
      scalpNotes,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#B76E79]">Step 01 · Hair &amp; Scalp Capture</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
            Upload or Capture Hair Photograph
          </h1>
        </div>

        <div className="inline-flex p-1 rounded-lg bg-[#F3EEF8] self-start">
          <button
            type="button"
            onClick={() => handleModeSwitch('upload')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-white text-[#2D123E] shadow-sm' : 'text-[#5E4B6E]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('camera')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'camera' ? 'bg-white text-[#2D123E] shadow-sm' : 'text-[#5E4B6E]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#F9EBF0] border border-[#B76E79]/30 text-sm text-[#8C2D42] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Image Upload / Camera Viewport */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-5">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1F122B] border border-[#3F1957]/15">
                <img
                  src={previewUrl}
                  alt="Captured hair preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#4A3859]">
                  Ready for AI image validation and assessment
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    if (mode === 'camera') void startCamera();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#3F1957]/20 text-xs font-semibold text-[#2D123E] hover:bg-[#F3EEF8] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace Photo
                </button>
              </div>
            </div>
          ) : mode === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#3F1957]/25 bg-[#FAF8FC] hover:bg-[#F3EEF8]/60 transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#F3EEF8] flex items-center justify-center text-[#3F1957]">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#2D123E]">
                  Drag and drop a hair or scalp photograph here
                </p>
                <p className="text-xs text-[#5E4B6E]">
                  Or click to browse files · JPEG, PNG, or WEBP up to 12 MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1F122B] border border-[#3F1957]/15 flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-[#E6DDF0] space-y-3">
                    <p className="text-sm">Camera preview paused</p>
                    <button
                      type="button"
                      onClick={() => void startCamera()}
                      className="px-4 py-2 rounded-lg bg-[#B76E79] text-white text-xs font-semibold cursor-pointer"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}
              </div>
              {cameraActive && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5E4B6E]">
                    Center crown, part line, or hairline in bright even light
                  </span>
                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3F1957] text-white text-xs font-semibold hover:bg-[#2D123E] cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Snapshot
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-[#3F1957]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5E4B6E]">
            <div>
              <p className="font-semibold text-[#2D123E]">01. Even Lighting</p>
              <p className="mt-0.5">Stand near natural daylight and avoid harsh overhead flash glare.</p>
            </div>
            <div>
              <p className="font-semibold text-[#2D123E]">02. Clear Part or Crown</p>
              <p className="mt-0.5">Hold camera 20–30 cm away focused sharply on scalp &amp; strands.</p>
            </div>
            <div>
              <p className="font-semibold text-[#2D123E]">03. Dry, Unstyled Hair</p>
              <p className="mt-0.5">Avoid heavy gels or fibers so density cues remain accurate.</p>
            </div>
          </div>
        </div>

        {/* Right: Context & Submit */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-5">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
              Scan Context
            </h2>
            <p className="text-xs text-[#5E4B6E]">
              Confirm gender and age context so AI visual assessment matches your profile.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              Gender Selection
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#F3EEF8]">
              {(['Female', 'Male', 'Other'] as GenderOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setGenderAtScan(opt)}
                  className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    genderAtScan === opt
                      ? 'bg-[#3F1957] text-white'
                      : 'text-[#4A3859] hover:text-[#2D123E]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              Age (Years)
            </label>
            <input
              type="number"
              min={13}
              max={100}
              value={ageAtScan}
              onChange={(e) => setAgeAtScan(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm font-mono tabular-nums focus:outline-2 focus:outline-[#3F1957]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              Visible Concerns or Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={scalpNotes}
              onChange={(e) => setScalpNotes(e.target.value)}
              placeholder="e.g., Increased shedding after washing, dry ends, or flaky parting..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
            />
          </div>

          <button
            type="button"
            onClick={handleAnalyzeSubmit}
            disabled={!previewUrl}
            className="w-full py-3 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] disabled:opacity-45 transition-colors cursor-pointer"
          >
            Analyze Hair &amp; Scalp Image
          </button>

          <p className="text-xs text-[#5E4B6E] leading-relaxed">
            Images are validated for hair and scalp presence prior to classification. Non-hair
            photographs are automatically rejected.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AnalyzingPageProps {
  payload: PendingScanPayload | null;
  onComplete: (analysis: AnalysisRecord) => void;
  onBackToUpload: () => void;
}

export function AnalyzingPage({ payload, onComplete, onBackToUpload }: AnalyzingPageProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const executedRef = useRef(false);

  const stages = [
    'Validating photograph resolution and hair/scalp visibility',
    'Inspecting parting width, crown density, and hairline pattern',
    'Checking scalp surface clarity, oil sheen, and visible flaking',
    'Generating non-diagnostic report and personalized product matches',
  ];

  useEffect(() => {
    if (!payload) return;
    if (executedRef.current) return;
    executedRef.current = true;

    const timer1 = setTimeout(() => setStageIndex(1), 900);
    const timer2 = setTimeout(() => setStageIndex(2), 1900);
    const timer3 = setTimeout(() => setStageIndex(3), 2900);

    api
      .analyzeHairImage(payload)
      .then((res) => {
        onComplete(res.analysis);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to complete hair analysis.');
      });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [payload, onComplete]);

  if (!payload) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-[#3F1957]/12 text-center space-y-4">
        <p className="text-sm text-[#5E4B6E]">No image queued for analysis.</p>
        <button
          type="button"
          onClick={onBackToUpload}
          className="px-5 py-2.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold cursor-pointer"
        >
          Go to Upload Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-white border border-[#3F1957]/12 space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-36 h-36 rounded-xl overflow-hidden bg-[#1F122B] border border-[#3F1957]/15 shrink-0">
          <img
            src={payload.imageDataUrl}
            alt="Image under analysis"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-xs font-medium text-[#B76E79]">Step 02 · AI Vision Processing</p>
          <h1 className="font-editorial text-3xl font-semibold text-[#2D123E]">
            {error ? 'Image Verification Notice' : 'Analyzing Hair & Scalp Image'}
          </h1>
          <p className="text-sm text-[#5E4B6E]">
            Context: {payload.genderAtScan} · Age {payload.ageAtScan}
          </p>
        </div>
      </div>

      {error ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F9EBF0] border border-[#B76E79]/35 text-sm text-[#8C2D42] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Unable to Complete Analysis</p>
              <p>{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToUpload}
            className="px-6 py-2.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] cursor-pointer"
          >
            Upload or Capture a Different Photo
          </button>
        </div>
      ) : (
        <div className="space-y-3 border-t border-[#3F1957]/10 pt-6">
          {stages.map((label, idx) => {
            const done = idx < stageIndex;
            const current = idx === stageIndex;
            return (
              <div key={label} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3F1957] shrink-0" />
                ) : current ? (
                  <Loader2 className="w-4 h-4 text-[#B76E79] animate-spin shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-[#3F1957]/25 shrink-0" />
                )}
                <span className={current || done ? 'text-[#2D123E] font-medium' : 'text-[#5E4B6E]/70'}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ResultsPageProps {
  analysis: AnalysisRecord | null;
  onNavigate: (route: AppRoute) => void;
}

export function ResultsPage({ analysis, onNavigate }: ResultsPageProps) {
  const chartConfig = useMemo(() => {
    if (!analysis) return null;
    const m = analysis.densityMetrics;
    return {
      type: 'bar' as const,
      data: {
        labels: [
          'Crown Density',
          'Parting Coverage',
          'Scalp Clarity',
          'Strand Integrity',
          'Hydration Balance',
        ],
        datasets: [
          {
            label: 'Visual Assessment Index (0–100)',
            data: [
              m.crownDensity,
              m.partingCoverage,
              m.scalpClarity,
              m.strandIntegrity,
              m.hydrationBalance,
            ],
            backgroundColor: ['#3F1957', '#552873', '#B76E79', '#7C4D99', '#C98690'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    };
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="p-10 rounded-2xl bg-white border border-[#3F1957]/12 text-center space-y-4">
        <h1 className="font-editorial text-3xl font-semibold text-[#2D123E]">
          No Hair Analysis Selected
        </h1>
        <p className="text-sm text-[#5E4B6E] max-w-md mx-auto">
          Upload or capture a photograph of your hair and scalp to view AI detection results and
          personalized care recommendations.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('upload')}
          className="px-6 py-2.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold cursor-pointer"
        >
          Start First Analysis
        </button>
      </div>
    );
  }

  const metricsList = [
    { label: 'Crown Density', value: analysis.densityMetrics.crownDensity },
    { label: 'Parting Coverage', value: analysis.densityMetrics.partingCoverage },
    { label: 'Scalp Clarity', value: analysis.densityMetrics.scalpClarity },
    { label: 'Strand Integrity', value: analysis.densityMetrics.strandIntegrity },
    { label: 'Hydration Balance', value: analysis.densityMetrics.hydrationBalance },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs text-[#5E4B6E]">
            Scan #{analysis.id} <span aria-hidden="true">·</span>{' '}
            {new Date(analysis.createdAt).toLocaleDateString()} <span aria-hidden="true">·</span>{' '}
            {analysis.genderAtScan}, Age {analysis.ageAtScan}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
            {analysis.primaryCategory}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3F1957] text-white text-xs font-semibold hover:bg-[#2D123E] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Recommended Products
          </button>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#3F1957]/20 text-[#2D123E] text-xs font-semibold hover:bg-[#F3EEF8] cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            Analysis History
          </button>
        </div>
      </div>

      {/* Dermatologist Advisory Banner when flagged */}
      {analysis.dermatologistFlag && (
        <div className="p-5 rounded-xl bg-[#F9EBF0] border border-[#B76E79]/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#8C2D42] shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-[#6F1D31]">
              Dermatologist Consultation Recommended
            </p>
            <p className="text-[#5E2836]">
              Visible signs of notable thinning or scalp concern were observed. Cosmetic hair care
              supports strand quality, while a board-certified dermatologist can perform trichoscopy
              and discuss clinically proven medical treatments.
            </p>
          </div>
        </div>
      )}

      {/* Top Grid: Photo + Summary + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#3F1957]/12 overflow-hidden">
          <div className="aspect-[4/3] bg-[#1F122B]">
            <img
              src={analysis.imageData}
              alt="Analyzed hair and scalp photograph"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 border-t border-[#3F1957]/10">
            <div>
              <p className="text-xs text-[#5E4B6E]">Visual Confidence</p>
              <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums mt-0.5">
                {analysis.confidenceScore}%
              </p>
              <p className="text-xs text-[#5E4B6E]">{analysis.confidenceLabel}</p>
            </div>
            <div>
              <p className="text-xs text-[#5E4B6E]">Appearance Index</p>
              <p className="font-mono text-2xl font-medium text-[#2D123E] tabular-nums mt-0.5">
                {analysis.hairHealthScore}/100
              </p>
              <p className="text-xs text-[#5E4B6E]">Cosmetic baseline</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-6">
          <div className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
              AI Visual Assessment Summary
            </h2>
            <p className="text-sm text-[#4A3859] leading-relaxed">{analysis.aiSummary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#3F1957]/10">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#2D123E]">Secondary Observations</p>
              <ul className="space-y-1.5 text-sm text-[#4A3859]">
                {analysis.secondaryObservations.length > 0 ? (
                  analysis.secondaryObservations.map((obs) => (
                    <li key={obs} className="pb-1 border-b border-[#3F1957]/8">
                      {obs}
                    </li>
                  ))
                ) : (
                  <li className="text-[#5E4B6E]">No secondary concerns noted.</li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#2D123E]">Visible Scalp Cues</p>
              <ul className="space-y-1.5 text-sm text-[#4A3859]">
                {analysis.scalpConcerns.length > 0 ? (
                  analysis.scalpConcerns.map((concern) => (
                    <li key={concern} className="pb-1 border-b border-[#3F1957]/8">
                      {concern}
                    </li>
                  ))
                ) : (
                  <li className="text-[#5E4B6E]">Scalp surface looks relatively clear.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F3EEF8] text-xs text-[#4A3859] leading-relaxed">
            <strong className="text-[#2D123E]">Analysis Limitations:</strong>{' '}
            {analysis.limitationsNote} An image alone cannot diagnose medical hair or scalp
            disorders.
          </div>
        </div>
      </div>

      {/* Density & Scalp Breakdown Chart + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
            Hair &amp; Scalp Sub-Metrics
          </h2>
          {chartConfig && (
            <ChartCanvas
              config={chartConfig}
              heightClass="h-64"
              ariaLabel="Hair density and scalp sub-metrics bar chart"
            />
          )}
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
            Measured Visual Indicators
          </h2>
          <div className="space-y-3.5">
            {metricsList.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#2D123E]">{m.label}</span>
                  <span className="font-mono text-[#3F1957] tabular-nums">{m.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F3EEF8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#3F1957]"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#3F1957]/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F1957] hover:underline cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              New Hair Scan
            </button>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B76E79] hover:underline cursor-pointer"
            >
              View Product Matches
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
