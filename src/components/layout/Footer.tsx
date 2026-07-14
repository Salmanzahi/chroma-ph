import Link from "next/link";
import { PLACEHOLDER } from "@/src/data/placeholder-content";
import { ROUTES } from "@/src/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__grid">
        <p className="site-footer__index">Bioplastic / research interface</p>
        <div><strong>{PLACEHOLDER.projectName}</strong><p>Kalibrasi warna masih sementara. Identitas tim dan institusi menunggu data klien.</p></div>
        <nav aria-label="Navigasi footer"><Link href={ROUTES.scan}>Pindai</Link><Link href={ROUTES.phScale}>Skala pH</Link><Link href={ROUTES.about}>Tentang</Link></nav>
      </div>
    </footer>
  );
}
