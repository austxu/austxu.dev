import type { Metadata } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/roboto-mono/latin-400.css";
import "@fontsource/roboto-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://austxu.dev"),
  title: {
    default: "Austin Xu — models, machines, markets",
    template: "%s — Austin Xu",
  },
  description: "Austin Xu is a researcher at StarAI, UCLA, building faster inference paths, bluffing agents, and tools for uncertain systems.",
  alternates: { canonical: "https://austxu.dev" },
  openGraph: {
    type: "website",
    url: "https://austxu.dev",
    siteName: "Austin Xu",
    title: "Austin Xu — models, machines, markets",
    description: "A focused four-panel research portfolio about faster inference, bluffing agents, and uncertain systems.",
    images: [{ url: "https://austxu.dev/og.png", width: 1200, height: 630, alt: "Austin Xu — models, machines, markets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Austin Xu — models, machines, markets",
    description: "Research across inference, deception, and volatility.",
    images: ["https://austxu.dev/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
