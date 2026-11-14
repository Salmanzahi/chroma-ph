/** Camera permission denied or unavailable state. */

import { CameraIcon, UploadIcon } from "@/src/components/icons";
import type { CameraStatus } from "@/src/types/common";

const STATUS_CONTENT: Record<
  Exclude<CameraStatus, "idle" | "requesting" | "active" | "captured" | "stopped">,
  { title: string; description: string }
> = {
  "permission-denied": {
    title: "Akses Kamera Ditolak",
    description:
      "Izinkan akses kamera di pengaturan browser, lalu coba lagi atau gunakan unggah foto.",
  },
  "not-supported": {
    title: "Browser Tidak Mendukung Kamera",
    description:
      "Gunakan browser modern seperti Chrome, Firefox, Safari, atau Edge.",
  },
  "device-not-found": {
    title: "Kamera Tidak Ditemukan",
    description:
      "Pastikan kamera tersambung dan tidak sedang digunakan oleh aplikasi lain.",
  },
  error: {
    title: "Kamera Tidak Tersedia",
    description:
      "Terjadi kesalahan saat mengakses kamera. Coba lagi atau gunakan unggah foto.",
  },
};

export function CameraPermissionState({
  status,
  description,
  onUploadClick,
  onRetry,
}: {
  status: CameraStatus;
  description?: string;
  onUploadClick?: () => void;
  onRetry?: () => void;
}) {
  const content = STATUS_CONTENT[status as keyof typeof STATUS_CONTENT];
  if (!content) return null;

  return (
    <div className="feedback-state feedback-state--warning" role="alert">
      <span className="feedback-state__index">CAM / izin</span>
      <CameraIcon size={36} className="feedback-state__icon" />
      <div>
        <h2>{content.title}</h2>
        <p>
          {description ?? content.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="scanner-primary"
            style={{ minHeight: 44, minWidth: 44 }}
          >
            Coba Lagi
          </button>
        )}
        {onUploadClick && (
          <button
            type="button"
            onClick={onUploadClick}
            className="scanner-secondary"
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <UploadIcon size={18} />
            Unggah Foto
          </button>
        )}
      </div>
    </div>
  );
}
