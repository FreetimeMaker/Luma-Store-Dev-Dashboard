"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  return (
    <nav className="mx-auto flex max-w-4xl items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link href="/" className="truncate text-base font-semibold text-slate-100 sm:text-lg">
          Luma Store Developer Dashboard
        </Link>
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:flex">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          Developer Portal
        </div>
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm text-slate-400">Checking login...</span>
          </div>
        ) : user ? (
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-indigo-400"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={`${name} profile`}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-300"
                >
                  {String(name)
                    .split(" ")
                    .map((part: string) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <span className="max-w-40 truncate text-sm text-slate-200">{name}</span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-700"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
