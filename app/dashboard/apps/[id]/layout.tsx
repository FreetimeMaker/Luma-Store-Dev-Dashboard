import Link from "next/link";
import type { ReactNode } from "react";

export default async function AppLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="glass-page space-y-5">
      <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-2">
        <Link href={`/dashboard/apps/${id}`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">App details</Link>
        <Link href={`/dashboard/apps/${id}/metadata`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">App metadata</Link>
      </nav>
      {children}
    </div>
  );
}
