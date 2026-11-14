/** Type definitions for the scanner feature. */

import type { CameraStatus } from "@/src/types/common";

export type CameraSupportStatus =
  | "checking"
  | "supported"
  | "unsupported"
  | "denied";

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
  supportStatus: CameraSupportStatus;
  checkSupport: () => Promise<CameraSupportStatus>;
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
