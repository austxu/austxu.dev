"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about", label: "About", key: "about" },
  { href: "/projects", label: "Projects", key: "projects" },
  { href: "/blog", label: "Blog", key: "blog" },
] as const;

export function SiteShell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.dataset.menuOpen = menuOpen ? "true" : "false";
    return () => { delete document.body.dataset.menuOpen; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && event.target !== menuButtonRef.current) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const isActive = (key: (typeof navigation)[number]["key"]) => {
    if (key === "home") return pathname === "/";
    if (key === "projects") return pathname === "/projects" || pathname.startsWith("/work/");
    if (key === "blog") return pathname.startsWith("/blog");
    return pathname.startsWith("/about");
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header${dark ? " site-header-dark" : ""}`}>
        <Link className="site-mark" href="/" aria-label="Austin's Portfolio home">
          <span className="site-mark-dot" />
          <span>Austin&apos;s Portfolio</span>
        </Link>
        <nav
          ref={menuRef}
          id="primary-navigation"
          className={menuOpen ? "site-nav site-nav-open" : "site-nav"}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.key) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-button-label">{menuOpen ? "Close" : "Menu"}</span>
          <span className="menu-button-icon" aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
        </button>
      </header>
      <div id="main-content">{children}</div>
    </>
  );
}
