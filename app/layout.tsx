import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://austxu.dev"),
  title: {
    default: "Austin's Portfolio",
    template: "%s | Austin's Portfolio",
  },
  description: "Austin Xu's portfolio across models, machines, markets, and the systems that make research observable.",
  openGraph: {
    type: "website",
    url: "https://austxu.dev",
    siteName: "Austin's Portfolio",
    title: "Austin's Portfolio",
    description: "A cinematic forest portfolio about faster inference, bluffing agents, and uncertain systems.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Austin's Portfolio" }],
  },
  twitter: { card: "summary_large_image", title: "Austin's Portfolio", description: "Research across inference, deception, and volatility.", images: ["/og.png"] },
  icons: {
    icon: [{ url: "/bear-cameo.png", type: "image/png", sizes: "460x460" }],
    shortcut: "/bear-cameo.png",
    apple: "/bear-cameo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
