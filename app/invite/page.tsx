"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function safeNext(value: string | null) {
  return value?.startsWith("/dashboard") ? value : "/dashboard";
}

function InviteContent() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError || !userData.user) {
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      const { data: redemption, error: redemptionError } = await supabase
        .from("luma_invite_redemptions")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (!redemptionError && redemption) {
        router.replace(next);
        return;
      }

      setLoading(false);
    }

    void checkAccess();

    return () => {
      mounted = false;
    };
  }, [next, router, supabase]);

  async function redeemInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) return;

    setSubmitting(true);
    setError(null);

    try {
      const { data, error: redeemError } = await supabase.rpc("redeem_luma_invite", {
        invite_code: normalizedCode,
      });

      if (redeemError) {
        setError("The invite code could not be verified. Please try again.");
        return;
      }

      if (data !== true) {
        setError("Invalid or inactive invite code.");
        return;
      }

      router.replace(next);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-400">Checking invite access…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
        <div className="mb-5 inline-flex rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Invite required
        </div>

        <h1 className="text-2xl font-semibold text-white">Enter your invite code</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your account is signed in. To access the Luma Store Developer Dashboard, enter a valid invite code provided by the dashboard owner.
        </p>

        <form onSubmit={redeemInvite} className="mt-6 space-y-4">
          <div>
            <label htmlFor="invite-code" className="mb-2 block text-sm font-medium text-slate-300">
              Invite code
            </label>
            <input
              id="invite-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              required
              placeholder="Enter invite code"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Checking…" : "Continue"}
          </button>
        </form>

        <button
          type="button"
          onClick={signOut}
          className="mt-3 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Sign out and use another account
        </button>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center text-slate-400">Loading…</div>}>
      <InviteContent />
    </Suspense>
  );
}
