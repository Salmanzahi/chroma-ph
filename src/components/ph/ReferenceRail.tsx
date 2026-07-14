"use client";

import { useState } from "react";
import { TEMPORARY_REF_TABLE } from "@/src/features/ph-analysis/data/ref-table";

export function ReferenceRail() {
  const references = [...TEMPORARY_REF_TABLE].sort((a, b) => a.ph - b.ph);
  const [activePh, setActivePh] = useState(7);
  const active = references.find((item) => item.ph === activePh) ?? references[6];

  return (
    <div className="reference-instrument" aria-label="Pratinjau interaktif referensi pH sementara">
      <div className="reference-readout" aria-live="polite">
        <div>
          <span className="reference-readout__label">Referensi yang dipilih</span>
          <strong className="reference-readout__value">
            <span>pH</span>
            <span>{active.ph}</span>
          </strong>
        </div>
        <div className="reference-readout__meta">
          <span>{active.label}</span>
          <span>Hue {active.hue}°</span>
        </div>
      </div>
      <div className="reference-rail">
        {references.map((item) => (
          <button
            key={item.ph}
            type="button"
            className="reference-stop"
            data-active={item.ph === active.ph}
            style={{ "--reference-color": item.hexColor } as React.CSSProperties}
            onPointerEnter={() => setActivePh(item.ph)}
            onFocus={() => setActivePh(item.ph)}
            onClick={() => setActivePh(item.ph)}
            aria-label={`Pilih referensi pH ${item.ph}, ${item.label}`}
            aria-pressed={item.ph === active.ph}
          >
            <span className="reference-stop__swatch" aria-hidden="true" />
            <span className="reference-stop__label">{item.ph}</span>
          </button>
        ))}
      </div>
      <p className="reference-note">Interaksi ini menampilkan tabel yang dikonfigurasi, bukan hasil validasi laboratorium.</p>
    </div>
  );
}
