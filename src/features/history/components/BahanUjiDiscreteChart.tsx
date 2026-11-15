"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import type { PhRecord } from "../types";

interface BahanUjiDiscreteChartProps {
  records: PhRecord[];
}

export function BahanUjiDiscreteChart({ records }: BahanUjiDiscreteChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sortBy, setSortBy] = useState<"as-is" | "ph-asc" | "ph-desc" | "name">("ph-asc");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const list = records.map((item) => ({
      bahanUji: item.bahanUji,
      ph: item.ph,
      kategori: item.kategoriKualitatif,
      warna: item.warna,
      rgb: item.rgb,
      solven: item.volumeSolven,
      solut: item.volumeSolut,
      satuanSolut: item.satuanSolut,
    }));

    if (sortBy === "ph-asc") {
      list.sort((a, b) => a.ph - b.ph);
    } else if (sortBy === "ph-desc") {
      list.sort((a, b) => b.ph - a.ph);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.bahanUji.localeCompare(b.bahanUji));
    }

    return list;
  }, [records, sortBy]);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-sm font-mono">
        Memuat grafik diskrit bahan uji…
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-muted)] border border-[var(--color-surface-border)]">
        Belum ada data sampel bahan uji untuk ditampilkan.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-surface-border)] pb-3">
        <div>
          <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
            Perbandingan Diskrit
          </span>
          <h3 className="text-lg font-serif font-semibold text-[var(--ink)]">
            Grafik Diskrit: Bahan Uji vs Kadar pH
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Sumbu-X: Bahan Uji (Kategori Diskrit) | Sumbu-Y: Kadar pH (0–14) | Warna batang mengikuti warna terdeteksi
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--color-text-muted)]">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)] text-[var(--ink)] font-medium"
            aria-label="Urutkan data grafik diskrit"
          >
            <option value="ph-asc">pH Rendah ke Tinggi</option>
            <option value="ph-desc">pH Tinggi ke Rendah</option>
            <option value="name">Nama Bahan Uji (A-Z)</option>
            <option value="as-is">Waktu Input (Terbaru)</option>
          </select>
        </div>
      </div>

      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 25, left: -10, bottom: 65 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.765 0.02 75 / 0.5)" />
            <XAxis
              dataKey="bahanUji"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 11, fill: "oklch(0.205 0.024 305)", fontWeight: 500 }}
              label={{
                value: "Bahan Uji (Sampel Diskrit)",
                position: "insideBottom",
                offset: -45,
                fontSize: 12,
                fill: "oklch(0.205 0.024 305)",
                fontWeight: 600,
              }}
            />
            <YAxis
              domain={[0, 14]}
              ticks={[0, 2, 4, 6, 7, 8, 10, 12, 14]}
              tick={{ fontSize: 11, fill: "oklch(0.37 0.026 305)" }}
              label={{
                value: "Kadar pH",
                angle: -90,
                position: "insideLeft",
                offset: 20,
                fontSize: 11,
                fill: "oklch(0.205 0.024 305)",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[var(--color-surface-white)] border border-[var(--ink)] p-3 shadow-lg text-xs font-mono space-y-1">
                      <div className="font-bold font-sans text-sm text-[var(--ink)] flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 border border-black/30 inline-block"
                          style={{ backgroundColor: data.warna }}
                        />
                        {data.bahanUji}
                      </div>
                      <div className="text-[var(--aubergine)] font-bold text-sm">
                        Kadar pH: {data.ph} ({data.kategori})
                      </div>
                      <div className="text-[var(--color-text-secondary)]">
                        Warna: {data.warna} (R:{data.rgb.r} G:{data.rgb.g} B:{data.rgb.b})
                      </div>
                      {data.solven !== null && data.solven !== undefined && (
                        <div className="text-[var(--color-text-muted)]">
                          Solven: {data.solven} mL
                        </div>
                      )}
                      {data.solut !== null && data.solut !== undefined && (
                        <div className="text-[var(--color-text-muted)]">
                          Solut: {data.solut} {data.satuanSolut || "mL"}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />

            {/* Reference Line Netral */}
            <ReferenceLine
              y={7}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: "Netral (pH 7.0)",
                position: "right",
                fill: "#059669",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Bar dataKey="ph" name="Kadar pH" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.bahanUji}-${index}`}
                  fill={entry.warna}
                  stroke="#1c1917"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
