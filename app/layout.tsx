import type { Metadata } from "next";
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
