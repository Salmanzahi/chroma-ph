"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  getPhMeasurements,
  deletePhMeasurement,
  updatePhMeasurement,
  seedSampleData,
} from "@/src/features/history/services/history-service";
import type { PhRecord } from "@/src/features/history/types";
import { RgbContinuousChart } from "@/src/features/history/components/RgbContinuousChart";
import { HueContinuousChart } from "@/src/features/history/components/HueContinuousChart";
import { BahanUjiDiscreteChart } from "@/src/features/history/components/BahanUjiDiscreteChart";
import { HistoryTable } from "@/src/features/history/components/HistoryTable";
import { LoadingState } from "@/src/components/feedback/LoadingState";
import {
  CameraIcon,
  RefreshIcon,
  DatabaseIcon,
  FlaskIcon,
  LineChartIcon,
  BarChartIcon,
} from "@/src/components/icons";
import { ROUTES } from "@/src/lib/constants";

export default function RiwayatPage() {
  const [records, setRecords] = useState<PhRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<"all" | "rgb" | "hue" | "discrete">("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPhMeasurements();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (id: string) => {
    await deletePhMeasurement(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setStatusMessage("Data berhasil dihapus dari Firestore.");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdate = async (id: string, updates: Partial<PhRecord>) => {
    try {
      await updatePhMeasurement(id, updates);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? ({ ...r, ...updates } as PhRecord) : r))
      );
      setStatusMessage(`Komponen bahan uji "${updates.bahanUji || "sampel"}" berhasil diperbarui.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage("Gagal memperbarui data bahan uji.");
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleSeed = async () => {
    if (confirm("Muat atau sinkronkan 8 data sampel acuan terbaru dari penelitian (note.txt) ke Firestore?")) {
      setIsSeeding(true);
      try {
        await seedSampleData();
        await fetchRecords();
        setStatusMessage("8 data sampel acuan terbaru (note.txt) berhasil disinkronkan ke Firestore!");
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err) {
        console.error(err);
        setStatusMessage("Gagal memuat data sampel acuan.");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    if (records.length === 0) {
      return { total: 0, avgPh: 0, minPh: 0, maxPh: 0 };
    }
    const phs = records.map((r) => r.ph);
    const sum = phs.reduce((acc, curr) => acc + curr, 0);
    return {
      total: records.length,
      avgPh: (sum / records.length).toFixed(1),
      minPh: Math.min(...phs).toFixed(1),
      maxPh: Math.max(...phs).toFixed(1),
    };
  }, [records]);

  return (
    <div className="page-shell py-8 sm:py-12 space-y-10">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="border-b-2 border-[var(--ink)] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
                Database Riwayat &amp; Analisis
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] border border-[var(--color-surface-border)]">
                <DatabaseIcon size={12} /> : phdetector/
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--ink)] font-normal leading-tight">
              Riwayat Pengukuran pH
            </h1>
            <p className="prose-copy text-sm sm:text-base text-[var(--color-text-secondary)] mt-2">
            Riwayat pengukuran pH  indikator  antosinin.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.scan}
              className="scanner-primary no-underline inline-flex items-center gap-2 text-xs"
              style={{ minHeight: 44 }}
            >
              <CameraIcon size={16} /> Pindai Baru
            </Link>

            <button
              type="button"
              onClick={fetchRecords}
              disabled={loading}
              className="scanner-secondary inline-flex items-center gap-1.5 text-xs"
              style={{ minHeight: 44 }}
            >
              <RefreshIcon size={16} /> Segarkan
            </button>

            {records.length === 0 && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={isSeeding}
                className="scanner-secondary inline-flex items-center gap-1.5 text-xs text-[var(--aubergine)] border-[var(--aubergine)]"
                style={{ minHeight: 44 }}
              >
                <FlaskIcon size={16} /> {isSeeding ? "Memuat…" : "Muat Data Acuan (note.txt)"}
              </button>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-[var(--color-semantic-green-bg)] text-[var(--color-semantic-green)] border border-[var(--color-semantic-green)]/30 text-xs font-medium">
            {statusMessage}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingState message="Memuat data riwayat…" />
        </div>
      ) : records.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 text-center border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--aubergine)]">
            <DatabaseIcon size={32} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-serif text-[var(--ink)]">
              Belum Ada Data Pengukuran
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Data hasil deteksi pH di halaman pemindai akan tersimpan di koleksi Firestore <code>phdetector/</code> dan ditampilkan di sini.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={ROUTES.scan} className="scanner-primary no-underline inline-flex items-center gap-2">
              <CameraIcon size={18} /> Pindai Sampel Sekarang
            </Link>
            <button
              type="button"
              onClick={handleSeed}
              disabled={isSeeding}
              className="scanner-secondary inline-flex items-center gap-2"
            >
              <FlaskIcon size={18} /> {isSeeding ? "Memuat…" : "Muat Data Acuan (note.txt)"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Summary Stats Cards ───────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
              <span className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider block">
                Total Sampel Teruji
              </span>
              <div className="mt-2 text-3xl font-serif font-bold text-[var(--ink)]">
                {stats.total}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                Tersimpan di Firestore
              </span>
            </div>

            <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
              <span className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider block">
                Rata-rata Kadar pH
              </span>
              <div className="mt-2 text-3xl font-serif font-bold text-[var(--aubergine)]">
                {stats.avgPh}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                Skala 1 – 14
              </span>
            </div>

            <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
              <span className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider block">
                pH Terendah (Paling Asam)
              </span>
              <div className="mt-2 text-3xl font-serif font-bold text-[var(--color-semantic-red)]">
                {stats.minPh}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                Zona Asam
              </span>
            </div>

            <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
              <span className="text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider block">
                pH Tertinggi (Paling Basa)
              </span>
              <div className="mt-2 text-3xl font-serif font-bold text-[var(--color-accent-700)]">
                {stats.maxPh}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                Zona Basa
              </span>
            </div>
          </div>

          {/* ── Section: Visualisasi Grafik ───────────────────────── */}
          <section className="space-y-6 pt-4 border-t border-[var(--color-surface-border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
                  Visualisasi Eksperimen
                </span>
                <h2 className="text-2xl font-serif text-[var(--ink)] mt-0.5">
                  Grafik Spektrum Warna &amp; Korelasi pH
                </h2>
              </div>

              {/* Chart section selector */}
              <div className="flex flex-wrap gap-1 bg-[var(--color-surface-muted)] p-1 border border-[var(--color-surface-border)] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveChartTab("all")}
                  className={`px-3 py-1 font-semibold transition-all ${
                    activeChartTab === "all"
                      ? "bg-[var(--ink)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
                  }`}
                >
                  Semua Grafik
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("rgb")}
                  className={`px-3 py-1 font-semibold transition-all ${
                    activeChartTab === "rgb"
                      ? "bg-[var(--ink)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
                  }`}
                >
                  1. Kontinu RGB
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("hue")}
                  className={`px-3 py-1 font-semibold transition-all ${
                    activeChartTab === "hue"
                      ? "bg-[var(--ink)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
                  }`}
                >
                  2. Korelasi Hue
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("discrete")}
                  className={`px-3 py-1 font-semibold transition-all ${
                    activeChartTab === "discrete"
                      ? "bg-[var(--ink)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
                  }`}
                >
                  3. Diskrit Bahan Uji
                </button>
              </div>
            </div>

            {/* Chart 1: RGB Continuous */}
            {(activeChartTab === "all" || activeChartTab === "rgb") && (
              <div className="p-6 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)] shadow-sm">
                <RgbContinuousChart records={records} />
              </div>
            )}

            {/* Chart 2: Hue Continuous Correlation */}
            {(activeChartTab === "all" || activeChartTab === "hue") && (
              <div className="p-6 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)] shadow-sm">
                <HueContinuousChart records={records} />
              </div>
            )}

            {/* Chart 3: Bahan Uji Discrete Bar Chart */}
            {(activeChartTab === "all" || activeChartTab === "discrete") && (
              <div className="p-6 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)] shadow-sm">
                <BahanUjiDiscreteChart records={records} />
              </div>
            )}
          </section>

          {/* ── Section: Tabel Riwayat Pengukuran ──────────────────── */}
          <section className="space-y-4 pt-6 border-t-2 border-[var(--ink)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
                  Data Mentah Pengukuran
                </span>
                <h2 className="text-2xl font-serif text-[var(--ink)] mt-0.5">
                  Tabel Riwayat Pengukuran
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Seluruh data nilai RGB, HSL, pH, warna, kategori kualitatif, volume solven, dan solut dari koleksi <code>phdetector/</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSeed}
                disabled={isSeeding}
                className="scanner-secondary text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
                style={{ minHeight: 38 }}
              >
                <FlaskIcon size={14} /> {isSeeding ? "Memuat…" : "Sinkronkan Data Acuan (note.txt)"}
              </button>
            </div>

            <HistoryTable
              records={records}
              onDeleteRecord={handleDelete}
              onUpdateRecord={handleUpdate}
            />
          </section>
        </>
      )}
    </div>
  );
}
