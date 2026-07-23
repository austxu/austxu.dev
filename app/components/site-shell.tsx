"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteShell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.dataset.menuOpen = menuOpen ? "true" : "false";
    return () => { delete document.body.dataset.menuOpen; };
  }, [menuOpen]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header${dark ? " site-header-dark" : ""}`}>
        <Link className="site-mark" href="/" aria-label="Austin Xu home"><span className="site-mark-dot" /> austxu.dev</Link>
        <nav id="primary-navigation" className={menuOpen ? "site-nav site-nav-open" : "site-nav"} aria-label="Primary navigation">
          <Link href="/#work" onClick={() => setMenuOpen(false)}>work</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>notes</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
        </nav>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "close" : "menu"}</button>
      </header>
      <div id="main-content">{children}</div>
    </>
  );
}
