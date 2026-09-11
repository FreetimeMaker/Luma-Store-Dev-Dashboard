"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      router.push("/login?error=" + encodeURIComponent(errorDescription || error));
      return;
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }: { error: AuthError | null }) => {
        if (error) {
          router.push("/login?error=" + encodeURIComponent("Authentication failed."));
        } else {
          router.push("/dashboard/developer");
        }
      });
    } else {
      router.push("/login?error=" + encodeURIComponent("No authorization code received."));
    }
  }, [router, searchParams, supabase]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center text-slate-300">
      Authentication is being processed...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center text-slate-300">
          Loading...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
