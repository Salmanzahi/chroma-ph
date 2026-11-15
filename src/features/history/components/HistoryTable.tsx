"use client";

import { useState, useMemo } from "react";
import type { PhRecord } from "../types";
import { TrashIcon, SearchIcon, FlaskIcon, EditIcon } from "@/src/components/icons";
import { EditMeasurementModal } from "./EditMeasurementModal";

interface HistoryTableProps {
  records: PhRecord[];
  onDeleteRecord: (id: string) => Promise<void>;
  onUpdateRecord?: (id: string, updates: Partial<PhRecord>) => Promise<void>;
}

export function HistoryTable({ records, onDeleteRecord, onUpdateRecord }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<PhRecord | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.kategoriKualitatif) set.add(r.kategoriKualitatif);
    });
    return Array.from(set);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.bahanUji.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.catatan && r.catatan.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        categoryFilter === "all" ||
        r.kategoriKualitatif.toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [records, searchTerm, categoryFilter]);

  const handleDelete = async (id: string, bahanUji: string) => {
    if (confirm(`Hapus data pengukuran untuk "${bahanUji}" dari database Firestore?`)) {
      setDeletingId(id);
      try {
        await onDeleteRecord(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama bahan uji atau catatan…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
          />
          <span className="absolute left-3 top-2.5 text-[var(--color-text-muted)] pointer-events-none">
            <SearchIcon size={16} />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">
            Kategori:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] font-medium"
            aria-label="Filter kategori kualitatif"
          >
            <option value="all">Semua Kategori ({records.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-[var(--color-surface-border)] bg-[var(--color-surface-white)]">
        <table className="w-full text-left text-xs text-[var(--ink)] border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--ink)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5">Bahan Uji</th>
              <th className="py-3 px-3">Kadar pH</th>
              <th className="py-3 px-3">Kategori</th>
              <th className="py-3 px-3">Warna &amp; Hex</th>
              <th className="py-3 px-3">Nilai RGB</th>
              <th className="py-3 px-3">Nilai HSL</th>
              <th className="py-3 px-3">Solven (Pelarut)</th>
              <th className="py-3 px-3">Solut (Terlarut)</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-surface-border)]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[var(--color-text-muted)]">
                  Tidak ada data yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--color-surface-off-white)] transition-colors"
                >
                  {/* Bahan Uji */}
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-sm text-[var(--ink)] font-sans">
                      {item.bahanUji}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
                      {formatDate(item.createdAt)}
                    </div>
                    {item.catatan && (
                      <div className="text-[11px] text-[var(--color-text-secondary)] italic mt-0.5">
                        {item.catatan}
                      </div>
                    )}
                  </td>

                  {/* pH */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-base font-serif text-[var(--aubergine)]">
                      {item.ph.toFixed(1)}
                    </span>
                  </td>

                  {/* Kategori */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold border ${
                        item.kategoriKualitatif.toLowerCase().includes("asam")
                          ? "bg-[var(--color-semantic-red-bg)] text-[var(--color-semantic-red)] border-[var(--color-semantic-red)]/20"
                          : item.kategoriKualitatif.toLowerCase().includes("basa")
                          ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border-[var(--color-accent-200)]"
                          : "bg-[var(--color-semantic-green-bg)] text-[var(--color-semantic-green)] border-[var(--color-semantic-green)]/20"
                      }`}
                    >
                      {item.kategoriKualitatif}
                    </span>
                  </td>

                  {/* Warna */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 border border-black/20 shrink-0 inline-block"
                        style={{ backgroundColor: item.warna }}
                        aria-label={`Warna ${item.warna}`}
                      />
                      <span className="font-mono text-[11px] uppercase">
                        {item.warna}
                      </span>
                    </div>
                  </td>

                  {/* RGB */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <span>
                      {item.rgb.r}, {item.rgb.g}, {item.rgb.b}
                    </span>
                  </td>

                  {/* HSL */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <span>
                      {item.hsl.h}°, {item.hsl.s}%, {item.hsl.l}%
                    </span>
                  </td>

                  {/* Solven */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    {item.volumeSolven !== null && item.volumeSolven !== undefined ? (
                      <span>{item.volumeSolven} mL</span>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>

                  {/* Solut */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    {item.volumeSolut !== null && item.volumeSolut !== undefined ? (
                      <span>
                        {item.volumeSolut} {item.satuanSolut || "mL"}
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">-</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {item.id && (
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingRecord(item)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--aubergine)] hover:bg-[var(--color-surface-muted)] transition-colors"
                          title={`Edit komponen bahan uji "${item.bahanUji}"`}
                          aria-label={`Edit ${item.bahanUji}`}
                        >
                          <EditIcon size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id!, item.bahanUji)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-semantic-red)] hover:bg-[var(--color-surface-muted)] transition-colors"
                          title="Hapus data dari Firestore"
                          aria-label={`Hapus ${item.bahanUji}`}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right text-[11px] font-mono text-[var(--color-text-muted)]">
        Menampilkan {filteredRecords.length} dari total {records.length} pengukuran
      </div>

      {/* Modal Edit Komponen Bahan Uji */}
      {editingRecord && (
        <EditMeasurementModal
          isOpen={Boolean(editingRecord)}
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={async (updatedRecord) => {
            if (onUpdateRecord && editingRecord.id) {
              await onUpdateRecord(editingRecord.id, updatedRecord);
            }
          }}
        />
      )}
    </div>
  );
}
