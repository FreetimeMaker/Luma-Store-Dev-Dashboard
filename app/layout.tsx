import type { Metadata } from "next";
import "./globals.css";
import AuthNav from "./components/AuthNav";

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
        <header className="w-full border-b border-slate-800 bg-slate-900 px-4 py-3 sm:px-6">
          <AuthNav />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        <footer className="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
          © 2026 Freetime Maker · Luma Store Developer Dashboard
        </footer>
      </body>
    </html>
  );
}
