"use client";

/**
 * Camera lifecycle hook.
 *
 * Manages getUserMedia lifecycle: start, stop, cleanup, error recovery, and
 * protection against late permission responses after navigation/unmount.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { CAMERA_CONSTRAINTS } from "@/src/lib/constants";
import type { CameraStatus } from "@/src/types/common";

export interface UseCameraReturn {
  status: CameraStatus;
  stream: MediaStream | null;
  errorMessage: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

function stopTracks(mediaStream: MediaStream | null): void {
  mediaStream?.getTracks().forEach((track) => track.stop());
}

export function useCamera(): UseCameraReturn {
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

  const start = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      if (mountedRef.current) {
        setStatus("not-supported");
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
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        CAMERA_CONSTRAINTS
      );

      // The component may have unmounted, the page may have been hidden, or a
      // newer request may have started while the permission dialog was open.
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        stopTracks(mediaStream);
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStatus("active");

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
            setStatus("error");
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

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      stopTracks(streamRef.current);
      streamRef.current = null;
    };
  }, []);

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

  return { status, stream, errorMessage, start, stop };
}
