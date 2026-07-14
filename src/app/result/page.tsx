"use client";

/**
 * Result page — displays estimated pH, eligibility, color details, and disclaimers.
 * Retrieves data from sessionStorage. Shows empty state if no result is available.
 */

import Link from "next/link";
import { useResultData } from "@/src/features/results/hooks/useResultData";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { Alert } from "@/src/components/ui/Alert";
import { LoadingState } from "@/src/components/feedback/LoadingState";
import { EmptyState } from "@/src/components/feedback/EmptyState";
import { ErrorState } from "@/src/components/feedback/ErrorState";
import { ArrowLeftIcon, RefreshIcon, CameraIcon } from "@/src/components/icons";
import { ROUTES } from "@/src/lib/constants";
import { RESULT } from "@/src/data/placeholder-content";
import { TEMPORARY_REF_TABLE } from "@/src/features/ph-analysis/data/ref-table";
import {
  getPhInterpretation,
  PH_INTERPRETATION_BANDS,
} from "@/src/features/results/utils/ph-interpretation";
import type { PhCategory } from "@/src/types/common";

/** Map pH to a position on the gradient strip (percentage). */
function phToPosition(ph: number): number {
  const clamped = Math.min(Math.max(ph, 1), 14);
  return ((clamped - 1) / (14 - 1)) * 100;
}

/** Category badge styling. */
const CATEGORY_STYLES: Record<
  PhCategory,
  { label: string; className: string }
> = {
  acid: {
    label: "Asam",
    className: "bg-semantic-red-bg text-semantic-red border-semantic-red/20",
  },
  neutral: {
    label: "Netral",
    className: "bg-semantic-green-bg text-semantic-green border-semantic-green/20",
  },
  base: {
    label: "Basa",
    className: "bg-accent-50 text-accent-700 border-accent-200",
  },
};

export default function ResultPage() {
  const { status, result, previewUrl, error, clearResult } = useResultData();

  // ── Empty state ───────────────────────────────────────────
  if (status === "empty") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <EmptyState
          title={RESULT.noResultTitle}
          description={RESULT.noResultDesc}
          action={
            <Link
              href={ROUTES.scan}
              className="scanner-primary no-underline"
              style={{ minHeight: 44 }}
            >
              <CameraIcon size={18} />
              {RESULT.goToScan}
            </Link>
          }
        />
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <LoadingState message="Memuat hasil…" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (status === "error" || !result) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <ErrorState
          description={error ?? "Gagal memuat hasil analisis."}
          action={
            <Link
              href={ROUTES.scan}
              className="scanner-primary no-underline"
              style={{ minHeight: 44 }}
            >
              <RefreshIcon size={18} />
              {RESULT.goToScan}
            </Link>
          }
        />
      </div>
    );
  }

  const { estimatedPh, category, eligibilityStatus, sampledRgb, sampledHsl } =
    result;
  const position = phToPosition(estimatedPh);
  const catStyle = CATEGORY_STYLES[category];
  const interpretation = getPhInterpretation(estimatedPh);

  return (
    <div className="result-page">
      {/* ── Back link ────────────────────────────────────────── */}
      <Link
        href={ROUTES.scan}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary no-underline hover:text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-accent-500"
        style={{ minHeight: 44 }}
      >
        <ArrowLeftIcon size={16} />
        {RESULT.scanAnother}
      </Link>

      <p className="editorial-kicker">Pembacaan warna lokal</p>
      <h1 className="result-title">
        {RESULT.pageTitle}
      </h1>

      {/* ── pH Value ──────────────────────────────────────────── */}
      <div className="result-measure">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Estimasi pH
          </span>
          <div className="flex items-baseline gap-1">
            <span className="display-number result-ph-value">
              {estimatedPh.toFixed(1)}
            </span>
            <span className="text-base font-semibold text-text-secondary">
              pH
            </span>
          </div>
        </div>

        {/* pH gradient strip with marker */}
        <div className="relative mt-5">
          <div
            className="h-2.5"
            style={{
              background: `linear-gradient(90deg, ${TEMPORARY_REF_TABLE.map(
                (r, i) =>
                  `${r.hexColor ?? "#888"} ${Math.round(
                    (i / (TEMPORARY_REF_TABLE.length - 1)) * 100
                  )}%`
              ).join(", ")})`,
            }}
          />
          {/* Marker */}
          <div
            className="result-marker"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          />
          <div className="mt-2 flex justify-between text-xs text-text-muted">
            <span>pH 1</span>
            <span>pH 7</span>
            <span>pH 14</span>
          </div>
        </div>
      </div>

      {/* ── Status badges ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Category */}
        <span
          className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold ${catStyle.className}`}
        >
          {catStyle.label}
        </span>

        {/* Eligibility */}
        <StatusBadge status={eligibilityStatus} />
      </div>

      {interpretation && (
        <section className="result-interpretation" aria-labelledby="interpretation-title">
          <div className="result-interpretation__summary">
            <div>
              <p className="result-interpretation__eyebrow">Interpretasi rentang</p>
              <h2 id="interpretation-title">{interpretation.label}</h2>
            </div>
            <p className="result-interpretation__range">{interpretation.rangeLabel}</p>
            <p className="result-interpretation__description">{interpretation.description}</p>
          </div>

          <div className="ph-zone-scale" aria-label="Lima zona interpretasi pH">
            {PH_INTERPRETATION_BANDS.map((band) => {
              const isActive = band.label === interpretation.label;
              return (
                <div
                  key={band.label}
                  className="ph-zone-scale__item"
                  data-active={isActive}
                  data-tone={band.tone}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span>{band.rangeLabel}</span>
                  <strong>{band.label}</strong>
                  {isActive && <small>Hasil Anda</small>}
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* ── Detected color swatch ─────────────────────────────── */}
      <div className="result-detail">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Warna Terdeteksi
        </h2>
        <div className="flex items-center gap-4">
          {/* Color swatch */}
          <div
            className="result-swatch"
            style={{
              backgroundColor: `rgb(${sampledRgb.r}, ${sampledRgb.g}, ${sampledRgb.b})`,
            }}
            role="img"
            aria-label={`Warna terdeteksi: R${sampledRgb.r} G${sampledRgb.g} B${sampledRgb.b}`}
          />
          <div className="text-sm space-y-1 text-text-secondary">
            <p>
              RGB: {sampledRgb.r}, {sampledRgb.g}, {sampledRgb.b}
            </p>
            <p>
              HSL: {Math.round(sampledHsl.h)}°,{" "}
              {(sampledHsl.s * 100).toFixed(0)}%,{" "}
              {(sampledHsl.l * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* ── Preview thumbnail ──────────────────────────────────── */}
      {previewUrl && (
        <div className="result-detail">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">
            Gambar yang Dianalisis
          </h2>
          <div className="result-image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Pratinjau gambar yang dianalisis"
              loading="lazy"
              decoding="async"
              className="result-image"
            />
          </div>
        </div>
      )}

      {/* ── Disclaimers ────────────────────────────────────────── */}
      <div className="space-y-3">
        <Alert variant="warning">
          <p className="font-semibold">{RESULT.researchDisclaimer}</p>
        </Alert>

        <Alert variant="info">
          <p>{RESULT.calibrationNotice}</p>
        </Alert>

        <p className="text-xs leading-relaxed text-text-muted">
          {RESULT.cameraLimitation}
        </p>
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={ROUTES.scan}
          onClick={clearResult}
          className="scanner-primary no-underline"
          style={{ minHeight: 44 }}
        >
          <RefreshIcon size={18} />
          {RESULT.scanAnother}
        </Link>
        <Link
          href={ROUTES.home}
          className="scanner-secondary no-underline"
          style={{ minHeight: 44 }}
        >
          <ArrowLeftIcon size={18} />
          {RESULT.backToHome}
        </Link>
      </div>

      {/* Hidden live region for screen readers */}
      <div className="sr-only" aria-live="polite" role="status">
        Hasil analisis: pH {estimatedPh.toFixed(1)}. Kategori:{" "}
        {catStyle.label}. Indikasi kelayakan berdasarkan parameter penelitian:{" "}
        {eligibilityStatus === "eligible"
          ? "Dalam rentang"
          : eligibilityStatus === "outside-range"
            ? "Di luar rentang"
            : "Tidak diketahui"}
        .
      </div>
    </div>
  );
}
