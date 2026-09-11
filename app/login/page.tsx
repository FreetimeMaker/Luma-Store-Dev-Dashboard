"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  async function redirectTo(provider: "github" | "gitlab") {
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) console.error("Login error:", error.message);
  }
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Luma Store Developer Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to submit and manage your Luma Store apps.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => redirectTo("github")} className="rounded-xl border border-slate-700 px-4 py-3 text-left font-medium text-slate-200 hover:bg-slate-800">Sign in with GitHub</button>
          <button onClick={() => redirectTo("gitlab")} className="rounded-xl border border-slate-700 px-4 py-3 text-left font-medium text-slate-200 hover:bg-slate-800">Sign in with GitLab</button>
        </div>
      </div>
    </main>
  );
}
