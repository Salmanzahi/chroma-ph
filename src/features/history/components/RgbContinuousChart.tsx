"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PhRecord } from "../types";

interface RgbContinuousChartProps {
  records: PhRecord[];
}

type ViewMode = "combined" | "r" | "g" | "b" | "all-grid";

export function RgbContinuousChart({ records }: RgbContinuousChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("combined");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sort data by pH ascending for continuous graph representation
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => a.ph - b.ph)
      .map((item) => ({
        ph: item.ph,
        label: `${item.bahanUji} (${item.ph.toFixed(1)})`,
        bahanUji: item.bahanUji,
        r: item.rgb.r,
        g: item.rgb.g,
        b: item.rgb.b,
        warna: item.warna,
        kategori: item.kategoriKualitatif,
      }));
  }, [records]);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-sm font-mono">
        Memuat grafik RGB…
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-muted)] border border-[var(--color-surface-border)]">
        Belum ada data sampel untuk membentuk grafik RGB. Lakukan deteksi atau muat data sampel.
      </div>
    );
  }

  const renderSingleChart = (
    channel: "rgb" | "r" | "g" | "b",
    height = 340,
    title?: string
  ) => {
    return (
      <div className="w-full">
        {title && (
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-2 font-bold">
            {title}
          </h4>
        )}
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 25, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.765 0.02 75 / 0.5)" />
              <XAxis
                dataKey="ph"
                type="number"
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
                tickCount={8}
                tick={{ fontSize: 11, fill: "oklch(0.37 0.026 305)" }}
                label={{
                  value: "Nilai pH (Sumbu-X)",
                  position: "insideBottom",
                  offset: -15,
                  fontSize: 12,
                  fill: "oklch(0.205 0.024 305)",
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[0, 255]}
                tick={{ fontSize: 11, fill: "oklch(0.37 0.026 305)" }}
                label={{
                  value: "Intensitas Kanal (0-255)",
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
                        <div className="text-[var(--aubergine)] font-bold">
                          pH: {data.ph} ({data.kategori})
                        </div>
                        {(channel === "rgb" || channel === "r") && (
                          <div className="text-red-600 font-semibold">
                            Red (R): {data.r}
                          </div>
                        )}
                        {(channel === "rgb" || channel === "g") && (
                          <div className="text-emerald-600 font-semibold">
                            Green (G): {data.g}
                          </div>
                        )}
                        {(channel === "rgb" || channel === "b") && (
                          <div className="text-blue-600 font-semibold">
                            Blue (B): {data.b}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />

              {(channel === "rgb" || channel === "r") && (
                <Line
                  type="monotone"
                  dataKey="r"
                  name="Red (R)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#b91c1c", strokeWidth: 1.5, fill: "#ef4444" }}
                  activeDot={{ r: 7 }}
                />
              )}

              {(channel === "rgb" || channel === "g") && (
                <Line
                  type="monotone"
                  dataKey="g"
                  name="Green (G)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#047857", strokeWidth: 1.5, fill: "#10b981" }}
                  activeDot={{ r: 7 }}
                />
              )}

              {(channel === "rgb" || channel === "b") && (
                <Line
                  type="monotone"
                  dataKey="b"
                  name="Blue (B)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#1d4ed8", strokeWidth: 1.5, fill: "#3b82f6" }}
                  activeDot={{ r: 7 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Control Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-surface-border)] pb-3">
        <div>
          <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
            Analisis Spektrum Warna
          </span>
          <h3 className="text-lg font-serif font-semibold text-[var(--ink)]">
            Grafik Kontinu Nilai RGB vs Kadar pH
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Sumbu-X: Nilai pH bahan uji terurut kontinu | Sumbu-Y: Nilai intensitas kanal RGB (0–255)
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-[var(--color-surface-muted)] p-1 border border-[var(--color-surface-border)]">
          <button
            type="button"
            onClick={() => setViewMode("combined")}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "combined"
                ? "bg-[var(--ink)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
            }`}
          >
            Gabungan RGB
          </button>
          <button
            type="button"
            onClick={() => setViewMode("r")}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "r"
                ? "bg-red-600 text-white shadow-sm"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            Kanal Merah (R)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("g")}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "g"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            Kanal Hijau (G)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("b")}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "b"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-blue-700 hover:bg-blue-50"
            }`}
          >
            Kanal Biru (B)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all-grid")}
            className={`px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === "all-grid"
                ? "bg-[var(--aubergine)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--ink)]"
            }`}
          >
            Grid 4 Grafik
          </button>
        </div>
      </div>

      {/* Render View Modes */}
      {viewMode === "combined" && renderSingleChart("rgb", 360)}
      {viewMode === "r" && renderSingleChart("r", 360, "Grafik Kontinu: Nilai pH vs Red (R)")}
      {viewMode === "g" && renderSingleChart("g", 360, "Grafik Kontinu: Nilai pH vs Green (G)")}
      {viewMode === "b" && renderSingleChart("b", 360, "Grafik Kontinu: Nilai pH vs Blue (B)")}

      {viewMode === "all-grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
            {renderSingleChart("rgb", 280, "1. Grafik Gabungan (X: pH vs Y: RGB)")}
          </div>
          <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
            {renderSingleChart("r", 280, "2. Grafik Kanal Merah (X: pH vs Y: R)")}
          </div>
          <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
            {renderSingleChart("g", 280, "3. Grafik Kanal Hijau (X: pH vs Y: G)")}
          </div>
          <div className="p-4 bg-[var(--color-surface-white)] border border-[var(--color-surface-border)]">
            {renderSingleChart("b", 280, "4. Grafik Kanal Biru (X: pH vs Y: B)")}
          </div>
        </div>
      )}
    </div>
  );
}
