import type { Metadata, Viewport } from "next";
import { Nav } from "@v2/components/nav/Nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://globalgateway.vercel.app"
  ),
  title: {
    default: "Global Gateway — International Business Platform",
    template: "%s | Global Gateway",
  },
  description:
    "Integrated logistics, commercial real estate, and legal compliance services for global business operations.",
  keywords: [
    "global logistics",
    "commercial real estate",
    "legal compliance",
    "international business",
    "freight forwarding",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Global Gateway",
    description:
      "Integrated logistics, commercial real estate, and legal compliance services.",
    siteName: "Global Gateway",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Gateway",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Single Nav mount — no page renders its own header */}
        <Nav />
        <main id="main-content">{children}</main>
        <footer role="contentinfo" style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "var(--space-8) var(--space-6)",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "var(--text-sm)",
        }}>
          © {new Date().getFullYear()} Global Gateway. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
