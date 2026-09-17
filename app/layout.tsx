import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AuthNav from "./components/AuthNav";

export const metadata: Metadata = {
  title: {
    default: "Luma Store",
    template: "%s | Luma Store",
  },
  description: "Discover Android apps and manage app submissions with Luma Store.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-50 w-full border-b border-indigo-500/10 bg-slate-950/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <AuthNav />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        <footer className="border-t border-slate-800/80 px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
            <p>© 2026 Freetime Maker · Luma Store</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Footer navigation">
              <Link href="/" className="transition hover:text-slate-300">Home</Link>
              <Link href="/discover" className="transition hover:text-slate-300">Discover</Link>
              <Link href="/login?next=/dashboard" className="transition hover:text-slate-300">Developers</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
