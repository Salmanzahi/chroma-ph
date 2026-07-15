/** Type definitions for the scanner feature. */

import type { CameraStatus } from "@/src/types/common";

export interface CameraState {
  status: CameraStatus;
  stream: MediaStream | null;
  errorMessage: string | null;
}

export interface UseCameraReturn {
  status: CameraStatus;
  stream: MediaStream | null;
  errorMessage: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

export interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  handleFile: (file: File) => void;
  clearFile: () => void;
  replaceFile: (file: File) => void;
}

export interface CaptureState {
  status: "live" | "captured" | "processing" | "error";
  capturedDataUrl: string | null;
  imageData: ImageData | null;
  error: string | null;
}
