"use client";

/**
 * Camera lifecycle hook and support check.
 *
 * Manages getUserMedia lifecycle: support verification, start, stop, cleanup,
 * error recovery, permissions checking, timeouts, and protection against
 * late permission responses after navigation/unmount.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { CAMERA_CONSTRAINTS } from "@/src/lib/constants";
import type { CameraStatus } from "@/src/types/common";
import type {
  CameraSupportStatus,
  UseCameraReturn,
} from "@/src/features/scanner/types";

export type { CameraSupportStatus, UseCameraReturn };

export interface CameraSupportResult {
  status: CameraSupportStatus;
  errorMessage?: string;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  permissionState?: "granted" | "denied" | "prompt" | "unknown";
}

const DEFAULT_SUPPORT_TIMEOUT_MS = 2500;
const DEFAULT_PERMISSION_TIMEOUT_MS = 1500;

/**
 * Safely checks if the browser environment supports navigator.mediaDevices and getUserMedia.
 * Handles insecure contexts (HTTP), undefined navigator, SSR, and sandboxed iframes.
 */
export function isMediaDevicesSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  try {
    return !!(
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    );
  } catch {
    return false;
  }
}

/**
 * Executes a promise with a timeout fallback.
 * Guarantees resolution within timeoutMs and prevents unhandled promise rejections.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T
): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallbackValue);
      }
    }, timeoutMs);

    promise
      .then((val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(fallbackValue);
        }
      });
  });
}

/**
 * Checks camera permission state using the Permissions API if available.
 * Handles browsers where 'camera' is not recognized (Firefox/Safari),
 * environments where permissions API is not supported, or promises that hang.
 */
export async function checkCameraPermission(
  timeoutMs = DEFAULT_PERMISSION_TIMEOUT_MS
): Promise<"granted" | "denied" | "prompt" | "unknown"> {
  if (
    typeof navigator === "undefined" ||
    !navigator.permissions ||
    typeof navigator.permissions.query !== "function"
  ) {
    return "unknown";
  }

  const queryPromise = (async (): Promise<
    "granted" | "denied" | "prompt" | "unknown"
  > => {
    try {
      const status = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      return status.state;
    } catch {
      // In Firefox or Safari, querying 'camera' throws TypeError: 'camera' is not a valid PermissionName.
      return "unknown";
    }
  })();

  return withTimeout(queryPromise, timeoutMs, "unknown");
}

/**
 * Comprehensive camera support check.
 * Checks secure context, mediaDevices support, and permissions.
 * Guaranteed to resolve and never hang indefinitely or throw unhandled rejections.
 */
export async function checkCameraSupport(
  timeoutMs = DEFAULT_SUPPORT_TIMEOUT_MS
): Promise<CameraSupportResult> {
  const isSecure =
    typeof window !== "undefined" ? window.isSecureContext !== false : true;
  const hasMedia = isMediaDevicesSupported();

  const fallbackResult: CameraSupportResult = {
    status: isSecure && hasMedia ? "supported" : "unsupported",
    isSecureContext: isSecure,
    hasMediaDevices: hasMedia,
    permissionState: "unknown",
    errorMessage:
      !isSecure
        ? "Akses kamera membutuhkan konteks aman (HTTPS). Buka halaman ini menggunakan HTTPS atau localhost."
        : !hasMedia
          ? "Browser Anda tidak mendukung akses kamera. Gunakan browser modern atau unggah foto dari galeri."
          : undefined,
  };

  const checkExecution = async (): Promise<CameraSupportResult> => {
    // 1. SSR check
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        status: "checking",
        isSecureContext: false,
        hasMediaDevices: false,
        permissionState: "unknown",
      };
    }

    // 2. Insecure context check (HTTP instead of HTTPS/localhost)
    if (!isSecure) {
      return {
        status: "unsupported",
        isSecureContext: false,
        hasMediaDevices: hasMedia,
        permissionState: "unknown",
        errorMessage:
          "Akses kamera membutuhkan konteks aman (HTTPS). Buka halaman ini menggunakan HTTPS atau localhost.",
      };
    }

    // 3. MediaDevices and getUserMedia check
    if (!hasMedia) {
      return {
        status: "unsupported",
        isSecureContext: isSecure,
        hasMediaDevices: false,
        permissionState: "unknown",
        errorMessage:
          "Browser Anda tidak mendukung akses kamera. Gunakan browser modern atau unggah foto dari galeri.",
      };
    }

    // 4. Permission query check (guarded by timeout)
    const permState = await checkCameraPermission(
      Math.min(timeoutMs, DEFAULT_PERMISSION_TIMEOUT_MS)
    );

    if (permState === "denied") {
      return {
        status: "denied",
        isSecureContext: isSecure,
        hasMediaDevices: true,
        permissionState: "denied",
        errorMessage:
          "Akses kamera ditolak. Izinkan akses kamera di pengaturan browser, lalu coba lagi atau gunakan unggah foto.",
      };
    }

    return {
      status: "supported",
      isSecureContext: isSecure,
      hasMediaDevices: true,
      permissionState: permState,
    };
  };

  return withTimeout(checkExecution(), timeoutMs, fallbackResult);
}

function stopTracks(mediaStream: MediaStream | null): void {
  mediaStream?.getTracks().forEach((track) => track.stop());
}

export function useCamera(): UseCameraReturn {
  const [supportStatus, setSupportStatus] =
    useState<CameraSupportStatus>("checking");
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  const stop = useCallback(() => {
    // Invalidates an in-flight getUserMedia request. If it resolves later, the
    // newly returned stream will be stopped immediately instead of leaking.
    requestIdRef.current += 1;
    stopTracks(streamRef.current);
    streamRef.current = null;

    if (mountedRef.current) {
      setStream(null);
      setStatus("stopped");
    }
  }, []);

  const checkSupport = useCallback(async (): Promise<CameraSupportStatus> => {
    try {
      const result = await checkCameraSupport(DEFAULT_SUPPORT_TIMEOUT_MS);
      if (!mountedRef.current) return result.status;

      setSupportStatus(result.status);
      if (result.status === "unsupported") {
        setStatus("not-supported");
        if (result.errorMessage) setErrorMessage(result.errorMessage);
      } else if (result.status === "denied") {
        setStatus("permission-denied");
        if (result.errorMessage) setErrorMessage(result.errorMessage);
      } else if (result.status === "supported") {
        setStatus((prev) =>
          prev === "not-supported" || prev === "permission-denied"
            ? "idle"
            : prev
        );
        setErrorMessage((prev) =>
          prev?.includes("tidak mendukung") || prev?.includes("ditolak")
            ? null
            : prev
        );
      }
      return result.status;
    } catch {
      if (!mountedRef.current) return "unsupported";
      const fallbackSupported = isMediaDevicesSupported();
      const nextStatus: CameraSupportStatus = fallbackSupported
        ? "supported"
        : "unsupported";
      setSupportStatus(nextStatus);
      if (!fallbackSupported) {
        setStatus("not-supported");
        setErrorMessage(
          "Browser Anda tidak mendukung akses kamera. Gunakan browser modern atau unggah foto dari galeri."
        );
      }
      return nextStatus;
    }
  }, []);

  const start = useCallback(async () => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      if (mountedRef.current) {
        setStatus("not-supported");
        setSupportStatus("unsupported");
        setErrorMessage(
          "Akses kamera membutuhkan konteks aman (HTTPS). Buka halaman ini menggunakan HTTPS atau localhost."
        );
      }
      return;
    }

    if (!isMediaDevicesSupported()) {
      if (mountedRef.current) {
        setStatus("not-supported");
        setSupportStatus("unsupported");
        setErrorMessage(
          "Browser Anda tidak mendukung akses kamera. Gunakan browser modern atau unggah foto dari galeri."
        );
      }
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    // Replace an existing stream without briefly publishing a stale state.
    stopTracks(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setStatus("requesting");
    setErrorMessage(null);

    try {
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(
          CAMERA_CONSTRAINTS
        );
      } catch (firstErr: unknown) {
        // Fallback for OverconstrainedError: try basic video constraint
        if (
          firstErr instanceof DOMException &&
          firstErr.name === "OverconstrainedError"
        ) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } else {
          throw firstErr;
        }
      }

      // The component may have unmounted, the page may have been hidden, or a
      // newer request may have started while the permission dialog was open.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        stopTracks(mediaStream);
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStatus("active");
      setSupportStatus("supported");

      mediaStream.getVideoTracks().forEach((track) => {
        track.addEventListener(
          "ended",
          () => {
            if (
              mountedRef.current &&
              streamRef.current === mediaStream &&
              requestId === requestIdRef.current
            ) {
              streamRef.current = null;
              setStream(null);
              setStatus("stopped");
            }
          },
          { once: true }
        );
      });
    } catch (err: unknown) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      streamRef.current = null;
      setStream(null);

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
          case "PermissionDeniedError":
            setStatus("permission-denied");
            setSupportStatus("denied");
            setErrorMessage(
              "Akses kamera ditolak. Izinkan akses kamera di pengaturan browser, lalu coba lagi."
            );
            return;
          case "NotFoundError":
          case "DevicesNotFoundError":
            setStatus("device-not-found");
            setErrorMessage(
              "Kamera tidak ditemukan. Pastikan kamera tersambung, atau gunakan unggah foto."
            );
            return;
          case "NotReadableError":
          case "TrackStartError":
            setStatus("error");
            setErrorMessage(
              "Kamera tidak dapat digunakan. Kamera mungkin sedang dipakai aplikasi lain."
            );
            return;
          case "OverconstrainedError":
            setStatus("error");
            setErrorMessage(
              "Kamera tersedia, tetapi tidak mendukung pengaturan yang diminta."
            );
            return;
          case "SecurityError":
            setStatus("not-supported");
            setSupportStatus("unsupported");
            setErrorMessage(
              "Akses kamera diblokir oleh konteks yang tidak aman. Gunakan HTTPS atau localhost."
            );
            return;
          default:
            break;
        }
      }

      setStatus("error");
      setErrorMessage(
        "Kamera tidak tersedia. Coba lagi atau gunakan unggah foto dari galeri."
      );
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void checkSupport();

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      stopTracks(streamRef.current);
      streamRef.current = null;
    };
  }, [checkSupport]);

  useEffect(() => {
    const handlePageHide = () => stop();
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [stop]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") stop();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [stop]);

  return {
    status,
    stream,
    errorMessage,
    start,
    stop,
    supportStatus,
    checkSupport,
  };
}