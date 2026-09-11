"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function safeNext(value: string | null) {
  return value?.startsWith("/dashboard") ? value : "/dashboard";
}

function LoginContent() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(next);
    });
  }, [next, router, supabase]);

  async function redirectTo(provider: "github" | "gitlab") {
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const origin = configuredSiteUrl || window.location.origin;
    const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });

    if (error) console.error("Login error:", error.message);
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 inline-flex rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Developer access
        </div>
        <h1 className="text-2xl font-semibold text-white">Sign in to Luma Store</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          You must be signed in before you can open the submission dashboard, submit an app, or view your review timeline.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => redirectTo("github")} className="rounded-xl border border-slate-700 px-4 py-3 text-left font-medium text-slate-200 transition hover:bg-slate-800">
            Sign in with GitHub
          </button>
          <button onClick={() => redirectTo("gitlab")} className="rounded-xl border border-slate-700 px-4 py-3 text-left font-medium text-slate-200 transition hover:bg-slate-800">
            Sign in with GitLab
          </button>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center text-slate-400">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
