"use client";

/**
 * Scanner page — camera capture and image upload.
 *
 * Flow: camera start → live preview → capture → review → confirm → analyze → result
 * Also supports: image upload → review → confirm → analyze → result
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/src/features/scanner/hooks/useCamera";
import { useImageUpload } from "@/src/features/scanner/hooks/useImageUpload";
import {
  drawVideoFrameToCanvas,
  drawImageToCanvas,
  getSampledImageData,
  canvasToDataUrl,
  canvasToPreviewDataUrl,
} from "@/src/features/scanner/utils/canvas-utils";
import { getSamplingRegion } from "@/src/features/ph-analysis/utils/sample-center-region";
import { analyzePh } from "@/src/features/ph-analysis/utils/analyze-ph";
import {
  storeResult,
  storePreview,
  clearStoredResult,
} from "@/src/lib/browser-storage";
import { ROUTES } from "@/src/lib/constants";
import { SCANNER } from "@/src/data/placeholder-content";
import { CameraIcon, UploadIcon, CheckIcon, RefreshIcon } from "@/src/components/icons";
import { CameraPermissionState } from "@/src/components/feedback/CameraPermissionState";
import { UnsupportedState } from "@/src/components/feedback/UnsupportedState";
import { LoadingState } from "@/src/components/feedback/LoadingState";
import { Alert } from "@/src/components/ui/Alert";
import { SaveMeasurementModal } from "@/src/features/history/components/SaveMeasurementModal";
import type { PhAnalysisResult } from "@/src/features/ph-analysis/types";

type PageMode = "camera" | "upload";

export default function ScanPage() {
  const router = useRouter();
  const camera = useCamera();
  const upload = useImageUpload();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<PageMode>("camera");
  const [captureState, setCaptureState] = useState<"live" | "captured" | "processing">("live");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedResult, setAnalyzedResult] = useState<PhAnalysisResult | null>(null);
  const cameraSupport = camera.supportStatus;

  // ── Attach stream to video element ────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (camera.stream && camera.status === "active") {
      video.srcObject = camera.stream;
      video.play().catch(() => {
        // Autoplay may fail; handled by user gesture.
      });
    } else {
      video.srcObject = null;
    }
  }, [camera.stream, camera.status]);

  // ── Camera start ──────────────────────────────────────────
  const handleStartCamera = useCallback(async () => {
    setError(null);
    setCaptureState("live");
    setCapturedDataUrl(null);
    setAnalyzedResult(null);
    upload.clearFile();
    clearStoredResult();
    await camera.start();
  }, [camera, upload]);

  // ── Capture ───────────────────────────────────────────────
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) {
      setError("Elemen kamera tidak tersedia. Muat ulang halaman.");
      return;
    }
    if (!canvas) {
      setError("Elemen kanvas tidak tersedia. Muat ulang halaman.");
      return;
    }

    // Guard against capturing before the video has decoded its first frame.
    if (video.readyState < 2 || video.videoWidth === 0) {
      setError("Kamera belum siap. Tunggu beberapa saat lalu coba lagi.");
      return;
    }

    const ctx = drawVideoFrameToCanvas(video, canvas);
    if (!ctx) {
      setError("Gagal menangkap gambar. Coba lagi.");
      return;
    }

    const dataUrl = canvasToDataUrl(canvas, 0.92);
    setCapturedDataUrl(dataUrl);
    setCaptureState("captured");
    // The live stream is no longer needed during review.
    camera.stop();
  }, [camera]);

  // ── Upload ────────────────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      clearStoredResult();
      camera.stop();
      setMode("upload");
      upload.handleFile(file);
      // Allow choosing the same file again after retake or validation failure.
      e.currentTarget.value = "";
    },
    [camera, upload]
  );

  // When uploaded image loads, draw it to canvas and show review.
  useEffect(() => {
    if (!upload.previewUrl) return;

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        setError("Elemen kanvas tidak tersedia. Muat ulang halaman.");
        return;
      }

      const ctx = drawImageToCanvas(img, canvas);
      if (!ctx) {
        setError("Gagal memproses gambar. Coba file lain.");
        return;
      }

      const dataUrl = canvasToDataUrl(canvas, 0.9);
      setCapturedDataUrl(dataUrl);
      setCaptureState("captured");
    };
    img.onerror = () => {
      if (!cancelled) {
        setError("Gagal membaca file gambar. Coba file JPEG, PNG, atau WebP lain.");
      }
    };
    img.src = upload.previewUrl;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
      img.src = "";
    };
  }, [upload.previewUrl]);

  // ── Retake ────────────────────────────────────────────────
  const handleRetake = useCallback(() => {
    setCapturedDataUrl(null);
    setAnalyzedResult(null);
    setCaptureState("live");
    setError(null);
    upload.clearFile();
    // Re-open camera if in camera mode.
    if (mode === "camera" && camera.status === "stopped") {
      void camera.start();
    }
  }, [camera, mode, upload]);

  // ── Confirm & Analyze ──────────────────────────────────────
  const handleConfirm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Elemen kanvas tidak tersedia. Muat ulang halaman.");
      return;
    }

    setCaptureState("processing");
    setError(null);

    try {
      // Get the sampling region from the canvas.
      const region = getSamplingRegion(canvas.width, canvas.height);
      if (!region) {
        setError("Gambar tidak valid. Coba lagi.");
        setCaptureState("captured");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Gagal membaca data gambar.");
        setCaptureState("captured");
        return;
      }

      const sampledData = getSampledImageData(ctx, region.sx, region.sy, region.size);
      if (!sampledData) {
        setError("Gagal mengambil sampel warna. Coba lagi.");
        setCaptureState("captured");
        return;
      }

      const result = analyzePh(sampledData);
      if (!result) {
        setError("Gagal menganalisis warna. Pastikan gambar terlihat jelas dan coba lagi.");
        setCaptureState("captured");
        return;
      }

      // Store result for /result page. Navigation is aborted if browser
      // storage is unavailable, otherwise the result page would be empty.
      if (!storeResult(result)) {
        setError(
          "Hasil tidak dapat disimpan di browser. Periksa pengaturan penyimpanan atau mode privat, lalu coba lagi."
        );
        setCaptureState("captured");
        return;
      }

      const previewDataUrl = canvasToPreviewDataUrl(canvas);
      if (previewDataUrl) {
        storePreview(previewDataUrl);
      }

      camera.stop();
      setCaptureState("captured");
      setAnalyzedResult(result);
    } catch {
      setError("Terjadi kesalahan saat menganalisis. Coba lagi.");
      setCaptureState("captured");
    }
  }, [camera]);

  // ── Switch to upload mode ─────────────────────────────────
  const handleSwitchToUpload = useCallback(() => {
    camera.stop();
    setMode("upload");
    setCaptureState("live");
    setCapturedDataUrl(null);
    setError(null);
  }, [camera]);

  // ── Switch to camera mode ─────────────────────────────────
  const handleSwitchToCamera = useCallback(() => {
    upload.clearFile();
    setMode("camera");
    setCaptureState("live");
    setCapturedDataUrl(null);
    setError(null);
    void camera.checkSupport();
  }, [camera, upload]);

  // ── Trigger file input ─────────────────────────────────────
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ── Derive viewfinder content ─────────────────────────────
  const showLiveVideo =
    mode === "camera" &&
    camera.status === "active" &&
    captureState === "live";

  const showCapturedImage = captureState === "captured" && capturedDataUrl;
  const showProcessing = captureState === "processing";

  return (
    <div className="scanner-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="scanner-heading">

        <h1>
          {SCANNER.pageTitle}
        </h1>
        <p>
          {SCANNER.instructions}
        </p>
      </div>

      {/* ── Viewfinder ──────────────────────────────────────── */}
      <div className="viewfinder-shell">
        <div className="viewfinder-status" aria-hidden="true">
          <span>{mode === "camera" ? "Kamera" : "Unggah foto"}</span>
          <span>{showLiveVideo ? "Siap mengambil gambar" : showCapturedImage ? "Tinjau area sampel" : showProcessing ? "Menganalisis" : "Menunggu"}</span>
        </div>
        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover ${showLiveVideo ? "" : "hidden"}`}
        />

        {/* Captured image preview */}
        {showCapturedImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capturedDataUrl}
            alt="Hasil tangkapan"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Processing overlay */}
        {showProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-text-primary/85">
            <LoadingState message={SCANNER.processingLabel} inverted />
          </div>
        )}

        {/* Placeholder: idle/requesting/stopped */}
        {captureState === "live" && !showLiveVideo && !showProcessing && (
          <div className="viewfinder-placeholder">
            <p>
              {mode === "camera"
                ? cameraSupport === "checking"
                  ? "Memeriksa dukungan kamera…"
                  : cameraSupport === "denied" || camera.status === "permission-denied"
                    ? "Akses kamera ditolak. Izinkan akses di pengaturan browser atau gunakan unggah foto."
                    : cameraSupport === "unsupported" || camera.status === "not-supported"
                      ? "Browser tidak mendukung akses kamera. Gunakan browser modern atau unggah foto."
                      : camera.status === "requesting"
                        ? "Meminta izin kamera…"
                        : "Klik tombol kamera di bawah untuk memulai."
                : "Pilih file gambar untuk diunggah."}
            </p>
          </div>
        )}

        {/* Reticle corner brackets */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-white/80 rounded-tl-md" />
          <span className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-white/80 rounded-tr-md" />
          <span className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-white/80 rounded-bl-md" />
          <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-white/80 rounded-br-md" />
        </div>

        {/* Always-visible preview mirrors the circular 24% analysis sample. */}
        {!showProcessing && (
          <div className="sample-guide" aria-hidden="true">
            <div className={`sample-guide__circle ${showCapturedImage ? "is-review" : ""}`}>
              <p className="sample-guide__label">
                {showCapturedImage ? "Area warna dianalisis" : "Area tinjau sampel"}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {showProcessing
          ? "Gambar sedang dianalisis."
          : showCapturedImage
            ? "Foto siap ditinjau. Konfirmasi untuk memulai analisis."
            : showLiveVideo
              ? "Kamera aktif dan siap mengambil foto."
              : "Kamera belum aktif."}
      </p>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* Upload validation error */}
      {upload.error && (
        <div className="mb-4">
          <Alert variant="error">{upload.error}</Alert>
        </div>
      )}

      {/* ── Camera error states ──────────────────────────────── */}
      {mode === "camera" &&
        (cameraSupport === "unsupported" || camera.status === "not-supported") &&
        captureState !== "processing" && (
          <UnsupportedState onUploadClick={handleSwitchToUpload} />
        )}

      {mode === "camera" &&
        cameraSupport !== "unsupported" &&
        camera.status !== "not-supported" &&
        (cameraSupport === "denied" ||
          camera.status === "permission-denied" ||
          camera.status === "device-not-found" ||
          camera.status === "error") &&
        captureState !== "processing" && (
          <CameraPermissionState
            status={
              camera.status === "permission-denied" || cameraSupport === "denied"
                ? "permission-denied"
                : camera.status
            }
            description={camera.errorMessage ?? undefined}
            onUploadClick={handleSwitchToUpload}
            onRetry={handleStartCamera}
          />
        )}

      {/* ── Controls ─────────────────────────────────────────── */}
      {captureState === "live" &&
        mode === "camera" &&
        cameraSupport === "supported" &&
        (camera.status === "idle" ||
          camera.status === "requesting" ||
          camera.status === "active" ||
          camera.status === "stopped") && (
          <div className="flex flex-col items-center gap-4">
            {camera.status === "active" ? (
              /* Capture button */
              <button
                type="button"
                onClick={handleCapture}
                className="camera-shutter"
                aria-label="Ambil foto"
                style={{ minWidth: 66, minHeight: 66 }}
              >
                <span className="block h-full w-full rounded-full bg-accent-500" />
              </button>
            ) : (
              /* Start camera button */
              <button
                type="button"
                onClick={handleStartCamera}
                disabled={camera.status === "requesting"}
                className="scanner-primary"
                style={{ minHeight: 44 }}
              >
                <CameraIcon size={20} />
                {camera.status === "requesting" ? "Meminta Izin…" : "Aktifkan Kamera"}
              </button>
            )}

            {/* Switch to upload */}
            <button
              type="button"
              onClick={handleSwitchToUpload}
              className="scanner-tertiary"
              style={{ minHeight: 44 }}
            >
              atau unggah foto dari galeri
            </button>
          </div>
        )}

      {/* Checking state: provide escape hatch so user is never trapped */}
      {captureState === "live" && mode === "camera" && cameraSupport === "checking" && (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleSwitchToUpload}
            className="scanner-tertiary"
            style={{ minHeight: 44 }}
          >
            atau unggah foto dari galeri
          </button>
        </div>
      )}

      {/* ── Confirm / Retake ─────────────────────────────────── */}
      {captureState === "captured" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleRetake}
              className="scanner-secondary"
              style={{ minHeight: 44 }}
            >
              <RefreshIcon size={18} />
              Ambil Ulang
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="scanner-primary"
              style={{ minHeight: 44 }}
            >
              <CheckIcon size={18} />
              Gunakan Foto Ini
            </button>
          </div>

          {/* Also allow upload as alternative during review */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="scanner-tertiary"
            style={{ minHeight: 44 }}
          >
            atau unggah foto lain
          </button>
        </div>
      )}

      {/* ── Upload mode controls ─────────────────────────────── */}
      {captureState === "live" && mode === "upload" && (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleUploadClick}
            className="scanner-primary"
            style={{ minHeight: 44 }}
          >
            <UploadIcon size={20} />
            Pilih Foto dari Galeri
          </button>
          <button
            type="button"
            onClick={handleSwitchToCamera}
            className="scanner-tertiary"
            style={{ minHeight: 44 }}
          >
            atau gunakan kamera
          </button>
        </div>
      )}

      {/* ── Hidden inputs ─────────────────────────────────────── */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── Technical disclaimer ──────────────────────────────── */}
      <p className="scanner-disclaimer">
        {SCANNER.technicalDisclaimer}
      </p>

      {/* ── Save to Firestore Modal ─────────────────────────────── */}
      {analyzedResult && (
        <SaveMeasurementModal
          isOpen={!!analyzedResult}
          result={analyzedResult}
          onClose={() => setAnalyzedResult(null)}
        />
      )}
    </div>
  );
}
