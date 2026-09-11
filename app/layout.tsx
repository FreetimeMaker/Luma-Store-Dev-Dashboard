import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

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
        <header className="border-b border-slate-800 bg-slate-900/95 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/" className="font-semibold text-white">Luma Store Dev Dashboard</a>
            <a href="/login" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Sign in</a>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </body>
    </html>
  );
}

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <div className="mx-auto max-w-6xl min-w-0 space-y-3 px-0 sm:px-1">
        <div className="flex sm:justify-end">
          <Link href="/status" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-indigo-700/50 bg-indigo-950/30 px-4 py-2.5 text-center text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-900/40 sm:w-auto">View submission status & timeline</Link>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-4 sm:px-5">
          <h2 className="font-semibold text-amber-200">Manual review and publishing</h2>
          <p className="mt-1 text-sm leading-relaxed text-amber-100/80">Every Luma Store submission is reviewed manually. Source code, licensing, app details and publishing requirements are checked before approval.</p>
        </div>
      </div>
      {children}
    </div>
  );
}

