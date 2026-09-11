import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Luma Store Developer Dashboard",
    template: "%s | Luma Store Dev Dashboard",
  },
  description: "Submit and manage open-source Android apps for the Luma Store.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900/95 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <Link href="/" className="font-semibold text-white">Luma Store Dev</Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Home</Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Dashboard</Link>
              <Link href="/login" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800">Sign in</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        <footer className="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">© 2026 Freetime Maker · Luma Store Developer Dashboard</footer>
      </body>
    </html>
  );
}
