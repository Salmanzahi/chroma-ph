"use client";

/** Reads result data after mount to avoid server/client hydration mismatches. */

import { useState, useCallback, useEffect } from "react";
import {
  getStoredResult,
  getStoredPreview,
  clearStoredResult,
} from "@/src/lib/browser-storage";
import type { ResultPageState } from "@/src/features/results/types";

const INITIAL_STATE: ResultPageState = {
  status: "loading",
  result: null,
  previewUrl: null,
  error: null,
};

export function useResultData(): ResultPageState & { clearResult: () => void } {
  const [state, setState] = useState<ResultPageState>(INITIAL_STATE);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const result = getStoredResult();
        const previewUrl = getStoredPreview();

        if (result) {
          setState({ status: "ready", result, previewUrl, error: null });
        } else {
          setState({
            status: "empty",
            result: null,
            previewUrl: null,
            error: null,
          });
        }
      } catch {
        setState({
          status: "error",
          result: null,
          previewUrl: null,
          error: "Gagal membaca data hasil. Silakan lakukan pemindaian ulang.",
        });
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const clearResult = useCallback(() => {
    clearStoredResult();
    setState({
      status: "empty",
      result: null,
      previewUrl: null,
      error: null,
    });
  }, []);

  return { ...state, clearResult };
}
