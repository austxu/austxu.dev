import type { Metadata } from "next";
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
    description: "A cinematic research portfolio about faster inference, bluffing agents, and uncertain systems.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Austin Xu — models, machines, markets" }],
  },
  twitter: { card: "summary_large_image", title: "Austin Xu — models, machines, markets", description: "Research across inference, deception, and volatility.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
