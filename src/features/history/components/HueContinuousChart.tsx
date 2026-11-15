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
  Area,
} from "recharts";
import type { PhRecord } from "../types";

interface HueContinuousChartProps {
  records: PhRecord[];
}

export function HueContinuousChart({ records }: HueContinuousChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sort data by pH ascending for continuous curve
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => a.ph - b.ph)
      .map((item) => ({
        ph: item.ph,
        hue: item.hsl.h,
        sat: item.hsl.s,
        light: item.hsl.l,
        bahanUji: item.bahanUji,
        warna: item.warna,
        kategori: item.kategoriKualitatif,
      }));
  }, [records]);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] text-sm font-mono">
        Memuat grafik korelasi Hue…
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)] bg-[var(--color-surface-muted)] border border-[var(--color-surface-border)]">
        Belum ada data sampel untuk membentuk grafik korelasi Hue.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border-b border-[var(--color-surface-border)] pb-3">
        <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
          Korelasi Ruang Warna HSL
        </span>
        <h3 className="text-lg font-serif font-semibold text-[var(--ink)]">
          Grafik Korelasi Kontinu: Nilai pH vs Nilai Hue (Derajat)
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Sumbu-X: Nilai pH bahan uji | Sumbu-Y: Sudut Hue (0°–360°) menunjukkan pergeseran spektrum antosianin
        </p>
      </div>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 25, left: -10, bottom: 25 }}
          >
            <defs>
              <linearGradient id="hueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, 360]}
              ticks={[0, 60, 120, 180, 240, 300, 360]}
              tick={{ fontSize: 11, fill: "oklch(0.37 0.026 305)" }}
              label={{
                value: "Nilai Hue (° Derajat)",
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
                      <div className="text-purple-700 font-semibold">
                        Hue: {data.hue}°
                      </div>
                      <div className="text-[var(--color-text-muted)] text-[11px]">
                        Saturasi: {data.sat}% | Luminansi: {data.light}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />

            <Line
              type="monotone"
              dataKey="hue"
              name="Hue (°)"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={({ cx, cy, payload }) => (
                <circle
                  key={`dot-${payload.bahanUji}-${payload.ph}`}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={payload.warna}
                  stroke="#581c87"
                  strokeWidth={2}
                />
              )}
              activeDot={{ r: 8, strokeWidth: 2, stroke: "#3b0764" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
