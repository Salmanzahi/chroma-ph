"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, CameraIcon, CloseIcon, MenuIcon } from "@/src/components/icons";
import { cn } from "@/src/lib/cn";
import { ROUTES } from "@/src/lib/constants";
import { SHARED } from "@/src/data/placeholder-content";

const links = [
  { href: ROUTES.phScale, label: SHARED.navPhScale, index: "01" },
  { href: ROUTES.history, label: SHARED.navHistory, index: "02" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  return (
    <header className="site-header">
      <div className="page-shell site-header__shell">
        <Link href={ROUTES.home} className="site-brand" aria-label="Deteksi PH Kubis Ungu">
          <span>ChromaPH</span>
        </Link>
        <nav className="header-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-link", pathname === link.href && "is-active")}
            >
              <span>{link.index}</span>
              {link.label}
            </Link>
          ))}
          <Link
            href={ROUTES.scan}
            className={cn(
              "nav-scan",
              (pathname === "/" || pathname === "/scan") && "is-active"
            )}
          >
            <CameraIcon size={15} /> Pindai
          </Link>
        </nav>
        <button type="button" className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Tutup menu" : "Buka menu"}>
          <span>{open ? "Tutup" : "Menu"}</span>
          <span className="menu-toggle__icons" aria-hidden="true"><MenuIcon size={18} className={!open ? "is-visible" : ""} /><CloseIcon size={18} className={open ? "is-visible" : ""} /></span>
        </button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigasi mobile">
        <div className="page-shell">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={close} className={cn("mobile-nav-link", pathname === link.href && "is-active")}>
              <span>{link.index}</span>
              <span>{link.label}</span>
              <ArrowRightIcon size={15} className="mobile-nav-arrow" />
            </Link>
          ))}
          <Link
            href={ROUTES.scan}
            onClick={close}
            className={cn(
              "mobile-nav-link",
              (pathname === "/" || pathname === "/scan") && "is-active"
            )}
            style={{ fontWeight: 700 }}
          >
            <span>03</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <CameraIcon size={16} />{SHARED.navScan}
            </span>
            <ArrowRightIcon size={15} className="mobile-nav-arrow" />
          </Link>
        </div>
      </nav>}
    </header>
  );
}
