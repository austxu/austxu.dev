import type { Metadata } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/roboto-mono/latin-400.css";
import "@fontsource/roboto-mono/latin-500.css";
import "@fontsource/roboto-mono/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://austxu.dev"),
  applicationName: "Austin's Portfolio",
  title: {
    default: "Austin's Portfolio",
    template: "%s — Austin's Portfolio",
  },
  description: "Austin Xu is a researcher at StarAI, UCLA, building faster inference paths, bluffing agents, and tools for uncertain systems.",
  alternates: { canonical: "https://austxu.dev" },
  openGraph: {
    type: "website",
    url: "https://austxu.dev",
    siteName: "Austin's Portfolio",
    title: "Austin's Portfolio",
    description: "A compact four-widget technical portfolio spanning code, research systems, and public projects.",
    images: [{ url: "https://austxu.dev/og.png", width: 1200, height: 630, alt: "Austin's Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Austin's Portfolio",
    description: "Code, research systems, and public projects from Austin Xu.",
    images: ["https://austxu.dev/og.png"],
  },
  icons: {
    icon: [{ url: "/bear-cameo-reencoded.png", type: "image/png", sizes: "460x460" }],
    shortcut: "/bear-cameo-reencoded.png",
    apple: [{ url: "/bear-cameo-reencoded.png", type: "image/png", sizes: "460x460" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
