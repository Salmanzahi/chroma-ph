/** Fallback state for browsers that do not support required camera APIs. */

import { UploadIcon, WarningIcon } from "@/src/components/icons";

export function UnsupportedState({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  return (
    <div className="feedback-state feedback-state--warning" role="alert">
      <span className="feedback-state__index">CAM / dukungan</span>
      <WarningIcon size={36} className="feedback-state__icon" />
      <div>
        <h2>
          Browser Tidak Mendukung Kamera
        </h2>
        <p>
          Gunakan unggah foto, atau buka halaman ini di Chrome, Firefox,
          Safari, atau Edge versi terbaru.
        </p>
      </div>
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
  );
}
