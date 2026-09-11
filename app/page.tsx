import Link from "next/link";

const features = [
  {
    title: "Fastlane-first publishing",
    description: "Import title, descriptions, changelog and phone screenshots directly from your Android project's Fastlane metadata.",
  },
  {
    title: "F-Droid aligned metadata",
    description: "Choose from the current F-Droid category set and submit open-source Android apps with clear licensing information.",
  },
  {
    title: "Review timeline",
    description: "Follow Pending, In Review, Approved and Rejected states together with reviewer messages and update history.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl pb-20 pt-8 sm:pt-14">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-14 shadow-2xl shadow-black/20 sm:px-10 sm:py-20 lg:px-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_30%)]" />
        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Luma Store for developers
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Publish your open-source Android app to Luma Store.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Submit apps with Fastlane metadata, keep releases consistent, and follow the complete review process from one dedicated developer dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login?next=/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500">
              Sign in to submit an app
            </Link>
            <Link href="/login?next=/dashboard/status" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/50 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
              View submission status
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">A signed-in developer account is required before the submission dashboard can be opened.</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-4 h-1.5 w-10 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500" />
            <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Open source only</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">A review flow built around transparent apps.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Every submission is manually reviewed. The source repository, license, metadata and publishing requirements are checked before an app is approved.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submission flow</p>
          <ol className="mt-4 space-y-3 text-sm text-slate-300">
            <li>1. Sign in with your developer account</li>
            <li>2. Prepare Fastlane metadata</li>
            <li>3. Submit from the protected dashboard</li>
            <li>4. Complete developer verification</li>
            <li>5. Follow the review timeline</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
