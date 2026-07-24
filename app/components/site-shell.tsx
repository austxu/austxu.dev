"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home", section: "home" },
  { href: "/blog", label: "Blog", section: "blog" },
  { href: "/projects", label: "Projects", section: "projects" },
  { href: "/about", label: "About", section: "about" },
] as const;

export function SiteShell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const pathname = usePathname();
  const activeSection = pathname === "/"
    ? "home"
    : pathname.startsWith("/blog")
      ? "blog"
      : pathname.startsWith("/projects") || pathname.startsWith("/work") || pathname.startsWith("/coup") || pathname.startsWith("/heston")
        ? "projects"
        : pathname.startsWith("/about")
          ? "about"
          : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header${dark ? " site-header-dark" : ""}`}>
        <Link className="site-mark" href="/" aria-label="Austin Xu home">
          <span className="site-mark-dot" />
          Austin Xu
        </Link>
        <nav id="primary-navigation" className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = activeSection === item.section;
            return (
              <Link
                href={item.href}
                key={item.section}
                className={active ? "site-nav-link site-nav-link-active" : "site-nav-link"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div id="main-content">{children}</div>
    </>
  );
}
