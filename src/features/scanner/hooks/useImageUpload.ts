"use client";

/** Image upload hook with validation and object-URL cleanup. */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  MAX_UPLOAD_SIZE_BYTES,
  ACCEPTED_IMAGE_TYPES,
} from "@/src/lib/constants";
import type { UseImageUploadReturn } from "@/src/features/scanner/types";

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUrlRef = useRef<string | null>(null);

  const revokeCurrentUrl = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  const handleFile = useCallback(
    (newFile: File) => {
      setError(null);

      if (!ACCEPTED_IMAGE_TYPES.some((type) => type === newFile.type)) {
        setError(
          "Format file tidak didukung. Gunakan file JPEG, PNG, atau WebP."
        );
        return;
      }

      if (newFile.size <= 0) {
        setError("File gambar kosong atau rusak. Pilih file lain.");
        return;
      }

      if (newFile.size > MAX_UPLOAD_SIZE_BYTES) {
        const maxMB = MAX_UPLOAD_SIZE_BYTES / (1024 * 1024);
        setError(`Ukuran file terlalu besar. Maksimum ${maxMB} MB.`);
        return;
      }

      setIsLoading(true);
      revokeCurrentUrl();

      const url = URL.createObjectURL(newFile);
      currentUrlRef.current = url;
      setFile(newFile);
      setPreviewUrl(url);
      setIsLoading(false);
    },
    [revokeCurrentUrl]
  );

  const clearFile = useCallback(() => {
    revokeCurrentUrl();
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsLoading(false);
  }, [revokeCurrentUrl]);

  const replaceFile = useCallback(
    (newFile: File) => {
      clearFile();
      handleFile(newFile);
    },
    [clearFile, handleFile]
  );

  useEffect(() => {
    return () => revokeCurrentUrl();
  }, [revokeCurrentUrl]);

  return {
    file,
    previewUrl,
    error,
    isLoading,
    handleFile,
    clearFile,
    replaceFile,
  };
}
