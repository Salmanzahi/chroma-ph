"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/src/lib/constants";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="page-shell not-found">
      <div />
      <div>
        <p className="editorial-kicker">Terjadi kesalahan</p>
        <h1>Gangguan teknis.</h1>
        <p>
          Halaman tidak dapat dimuat karena kesalahan tak terduga. Hal ini
          biasanya bersifat sementara.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button type="button" className="button-primary" onClick={reset}>
            Coba lagi
          </button>
          <Link href={ROUTES.scan} className="text-link">
            Kembali ke Menu Pindai
          </Link>
        </div>
      </div>
    </div>
  );
}
