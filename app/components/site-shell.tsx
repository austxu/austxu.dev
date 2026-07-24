"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home", section: "home" },
  { href: "/about", label: "About", section: "about" },
  { href: "/projects", label: "Projects", section: "projects" },
  { href: "/blog", label: "Blog", section: "blog" },
] as const;

function useActiveSection() {
  const pathname = usePathname();

  return pathname === "/"
    ? "home"
    : pathname.startsWith("/blog")
      ? "blog"
      : pathname.startsWith("/projects") ||
          pathname.startsWith("/work") ||
          pathname.startsWith("/coup") ||
          pathname.startsWith("/heston")
        ? "projects"
        : pathname.startsWith("/about")
          ? "about"
          : undefined;
}

export function PrimaryDock() {
  const activeSection = useActiveSection();

  return (
    <footer className="bottom-dock">
      <nav
        className="bottom-dock-nav"
        aria-label="Primary navigation"
        data-bottom-dock
      >
        {navigation.map((item) => {
          const active = activeSection === item.section;
          return (
            <Link
              href={item.href}
              key={item.section}
              className={active ? "bottom-dock-link bottom-dock-link-active" : "bottom-dock-link"}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

export function SiteShell({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "site-root site-root-dark" : "site-root"}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-content" id="main-content">{children}</div>
      <PrimaryDock />
    </div>
  );
}
