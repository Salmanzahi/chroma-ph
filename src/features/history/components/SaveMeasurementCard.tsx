"use client";

import { useState } from "react";
import Link from "next/link";
import type { PhAnalysisResult } from "@/src/features/ph-analysis/types";
import { getPhInterpretation } from "@/src/features/results/utils/ph-interpretation";
import { savePhMeasurement, rgbToHex } from "../services/history-service";
import { ROUTES } from "@/src/lib/constants";
import { SaveIcon, CheckIcon, HistoryIcon } from "@/src/components/icons";

interface SaveMeasurementCardProps {
  result: PhAnalysisResult;
  onSaved?: (docId: string) => void;
  className?: string;
}

export function SaveMeasurementCard({
  result,
  onSaved,
  className = "",
}: SaveMeasurementCardProps) {
  const { estimatedPh, sampledRgb, sampledHsl } = result;
  const initialCategory =
    getPhInterpretation(estimatedPh)?.label ||
    (estimatedPh < 7 ? "Asam lemah" : estimatedPh > 7 ? "Basa lemah" : "Netral");
  const hexColor = rgbToHex(sampledRgb.r, sampledRgb.g, sampledRgb.b);

  const [bahanUji, setBahanUji] = useState("");
  const [kategoriKualitatif, setKategoriKualitatif] = useState<string>(initialCategory);
  const [volumeSolven, setVolumeSolven] = useState<string>("");
  const [volumeSolut, setVolumeSolut] = useState<string>("");
  const [satuanSolut, setSatuanSolut] = useState<"gr" | "mL">("mL");
  const [catatan, setCatatan] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bahanUji.trim()) {
      setErrorMsg("Nama bahan uji wajib diisi untuk identifikasi sampel.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const docId = await savePhMeasurement({
        bahanUji: bahanUji.trim(),
        ph: Number(estimatedPh.toFixed(1)),
        rgb: {
          r: Math.round(sampledRgb.r),
          g: Math.round(sampledRgb.g),
          b: Math.round(sampledRgb.b),
        },
        hsl: {
          h: Math.round(sampledHsl.h),
          s: Math.round(sampledHsl.s * 100),
          l: Math.round(sampledHsl.l * 100),
        },
        warna: hexColor,
        kategoriKualitatif: kategoriKualitatif.trim(),
        volumeSolven: volumeSolven !== "" ? parseFloat(volumeSolven) : null,
        volumeSolut: volumeSolut !== "" ? parseFloat(volumeSolut) : null,
        satuanSolut,
        catatan: catatan.trim(),
      });

      setSaveSuccess(true);
      onSaved?.(docId);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Gagal menyimpan ke Firestore. Silakan coba kembali.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] p-6 sm:p-8 ${className}`}
      style={{ boxShadow: "0 4px 20px -2px oklch(0 0 0 / 0.05)" }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-surface-border)] pb-4">
        <div>
          <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
            Penyimpanan Database
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[var(--ink)] mt-1">
            Simpan Hasil Deteksi ke Firestore
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Tersimpan langsung di koleksi <code>phdetector/</code> untuk riwayat &amp; visualisasi grafik.
          </p>
        </div>

        {saveSuccess ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-semantic-green-bg)] text-[var(--color-semantic-green)] border border-[var(--color-semantic-green)]/30 text-xs font-bold uppercase tracking-wider">
            <CheckIcon size={16} /> Tersimpan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] text-xs font-mono">
            Koleksi: phdetector/
          </span>
        )}
      </div>

      {saveSuccess ? (
        <div className="space-y-4">
          <div className="p-4 bg-[var(--color-semantic-green-bg)] border border-[var(--color-semantic-green)]/30 text-[var(--ink)]">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-[var(--color-semantic-green)]">
              <CheckIcon size={18} /> Berhasil Menyimpan ke Database!
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Data sampel <strong>{bahanUji}</strong> dengan pH <strong>{estimatedPh.toFixed(1)}</strong> telah berhasil disimpan di Firestore.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={ROUTES.history}
              className="scanner-primary inline-flex items-center gap-2 no-underline"
            >
              <HistoryIcon size={18} /> Buka Halaman Riwayat &amp; Grafik
            </Link>
            <button
              type="button"
              onClick={() => {
                setSaveSuccess(false);
                setBahanUji("");
              }}
              className="scanner-secondary"
            >
              Simpan Ulang Sampel Baru
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-[var(--color-semantic-red-bg)] text-[var(--color-semantic-red)] text-sm border border-[var(--color-semantic-red)]/30">
              {errorMsg}
            </div>
          )}

          {/* Section: Data Otomatis dari Hasil Deteksi */}
          <div className="p-4 bg-[var(--color-surface-off-white)] border border-[var(--color-surface-border)]">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Data Otomatis dari Hasil Deteksi Kamera
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
              {/* pH */}
              <div className="space-y-1">
                <span className="text-xs text-[var(--color-text-muted)] block">Nilai pH</span>
                <span className="text-2xl font-bold font-serif text-[var(--aubergine)]">
                  {estimatedPh.toFixed(1)}
                </span>
              </div>

              {/* Warna swatch */}
              <div className="space-y-1">
                <span className="text-xs text-[var(--color-text-muted)] block">Warna Deteksi</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 border border-black/20 shrink-0"
                    style={{ backgroundColor: hexColor }}
                    aria-label={`Warna ${hexColor}`}
                  />
                  <span className="font-mono text-xs text-[var(--ink)] uppercase">
                    {hexColor}
                  </span>
                </div>
              </div>

              {/* RGB */}
              <div className="space-y-1">
                <span className="text-xs text-[var(--color-text-muted)] block">Nilai RGB</span>
                <span className="font-mono text-xs text-[var(--ink)] block">
                  R: {Math.round(sampledRgb.r)}, G: {Math.round(sampledRgb.g)}, B: {Math.round(sampledRgb.b)}
                </span>
              </div>

              {/* HSL */}
              <div className="space-y-1">
                <span className="text-xs text-[var(--color-text-muted)] block">Nilai HSL</span>
                <span className="font-mono text-xs text-[var(--ink)] block">
                  {Math.round(sampledHsl.h)}°, {Math.round(sampledHsl.s * 100)}%, {Math.round(sampledHsl.l * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nama Bahan Uji */}
            <div>
              <label htmlFor="save-bahan-uji" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Bahan Uji (Nama Sampel) <span className="text-[var(--color-semantic-red)]">*</span>
              </label>
              <input
                id="save-bahan-uji"
                type="text"
                required
                value={bahanUji}
                onChange={(e) => setBahanUji(e.target.value)}
                placeholder="Contoh: Air Lemon, Air Sabun, Bioplastik A"
                className="w-full px-3 py-2.5 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              />
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">
                Digunakan sebagai sumbu-X pada grafik diskrit bahan uji vs kadar pH.
              </span>
            </div>

            {/* Kategori Kualitatif */}
            <div>
              <label htmlFor="save-kategori" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Kategori Kualitatif
              </label>
              <select
                id="save-kategori"
                value={kategoriKualitatif}
                onChange={(e) => setKategoriKualitatif(e.target.value)}
                className="w-full px-3 py-2.5 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              >
                <option value="Asam kuat">Asam kuat (pH 1 - 3)</option>
                <option value="Asam lemah">Asam lemah (pH 3 - 7)</option>
                <option value="Netral">Netral (pH 7)</option>
                <option value="Basa lemah">Basa lemah (pH 7 - 12)</option>
                <option value="Basa kuat">Basa kuat (pH 12 - 14)</option>
              </select>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">
                Otomatis disesuaikan dari interpretasi pH hasil deteksi.
              </span>
            </div>

            {/* Volume Solven (Pelarut) */}
            <div>
              <label htmlFor="save-solven" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Volume Solven / Pelarut (mL) <span className="text-[var(--color-text-muted)] font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <input
                  id="save-solven"
                  type="number"
                  step="any"
                  min="0"
                  value={volumeSolven}
                  onChange={(e) => setVolumeSolven(e.target.value)}
                  placeholder="Contoh: 100"
                  className="w-full px-3 py-2.5 pr-12 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[var(--color-text-muted)] font-mono pointer-events-none">
                  mL
                </span>
              </div>
            </div>

            {/* Volume Solut (Bahan Terlarut) */}
            <div>
              <label htmlFor="save-solut" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                Volume / Massa Solut <span className="text-[var(--color-text-muted)] font-normal">(Opsional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="save-solut"
                  type="number"
                  step="any"
                  min="0"
                  value={volumeSolut}
                  onChange={(e) => setVolumeSolut(e.target.value)}
                  placeholder="Contoh: 10"
                  className="flex-1 px-3 py-2.5 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                />
                <select
                  value={satuanSolut}
                  onChange={(e) => setSatuanSolut(e.target.value as "gr" | "mL")}
                  aria-label="Satuan solut"
                  className="w-24 px-2 py-2.5 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--aubergine)]"
                >
                  <option value="mL">mL</option>
                  <option value="gr">gr</option>
                </select>
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">
                Bisa dalam gram (gr) atau mililiter (mL).
              </span>
            </div>
          </div>

          {/* Catatan Tambahan (Opsional) */}
          <div>
            <label htmlFor="save-catatan" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
              Catatan Pengujian <span className="text-[var(--color-text-muted)] font-normal">(Opsional)</span>
            </label>
            <input
              id="save-catatan"
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan sampel, konsentrasi, perlakuan khusus, dll."
              className="w-full px-3 py-2.5 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="scanner-primary"
              style={{ minHeight: 48 }}
            >
              <SaveIcon size={18} />
              {isSaving ? "Menyimpan ke Firestore…" : "Simpan Pengukuran ke Firestore"}
            </button>
            <Link
              href={ROUTES.history}
              className="scanner-secondary no-underline inline-flex items-center gap-2"
              style={{ minHeight: 48 }}
            >
              <HistoryIcon size={16} /> Lihat Riwayat
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
