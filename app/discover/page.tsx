"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type StoreApp = {
  id: string | number;
  name: string | null;
  short_description: string | null;
  description: string | null;
  version: string | null;
  package_name: string | null;
  license_type: string | null;
  repo_url: string | null;
  updated_at: string | null;
};

function appInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatUpdatedAt(value: string | null) {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function DiscoverPage() {
  const supabase = useMemo(() => createClient(), []);
  const [apps, setApps] = useState<StoreApp[]>([]);
  const [search, setSearch] = useState("");
  const [license, setLicense] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApps() {
      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from("store_apps")
        .select("id,name,short_description,description,version,package_name,license_type,repo_url,updated_at")
        .order("updated_at", { ascending: false });

      if (cancelled) return;

      if (loadError) {
        setError(loadError.message);
        setApps([]);
      } else {
        setApps((data ?? []) as StoreApp[]);
      }

      setLoading(false);
    }

    void loadApps();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const licenses = useMemo(
    () =>
      Array.from(
        new Set(
          apps
            .map((app) => app.license_type?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [apps],
  );

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesLicense = license === "all" || app.license_type === license;
      if (!matchesLicense) return false;
      if (!query) return true;

      return [app.name, app.short_description, app.description, app.package_name, app.license_type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [apps, license, search]);

  const featuredApps = filteredApps.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-violet-500/10 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            Luma Store Discover
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Discover apps published on Luma Store
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Browse published apps, inspect their source repositories, compare licenses and find projects worth exploring.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search apps</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search apps, package names or licenses..."
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by license</span>
            <select
              value={license}
              onChange={(event) => setLicense(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20 sm:min-w-48"
            >
              <option value="all">All licenses</option>
              {licenses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {!loading && !error && apps.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Published apps</p>
            <p className="mt-2 text-2xl font-bold text-white">{apps.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Visible now</p>
            <p className="mt-2 text-2xl font-bold text-white">{filteredApps.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Licenses</p>
            <p className="mt-2 text-2xl font-bold text-white">{licenses.length}</p>
          </div>
        </section>
      )}

      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60" />
          ))}
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-rose-500/25 bg-rose-950/20 p-6">
          <h2 className="font-semibold text-rose-200">Could not load published apps</h2>
          <p className="mt-2 text-sm text-rose-100/70">{error}</p>
        </section>
      ) : filteredApps.length === 0 ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-200">
            ✦
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No apps found</h2>
          <p className="mt-2 text-sm text-slate-400">Try a different search term or license filter.</p>
        </section>
      ) : (
        <>
          {featuredApps.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">Recently updated</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Featured apps</h2>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {featuredApps.map((app) => {
                  const name = app.name?.trim() || app.package_name || "Untitled app";
                  return (
                    <article
                      key={`featured-${app.id}`}
                      className="group rounded-2xl border border-indigo-400/15 bg-gradient-to-b from-indigo-500/10 to-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/15 text-sm font-bold text-indigo-100">
                          {appInitials(name) || "A"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-white">{name}</h3>
                          <p className="mt-1 truncate text-xs text-slate-500">{app.package_name || "Package unavailable"}</p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 min-h-15 text-sm leading-5 text-slate-300">
                        {app.short_description || app.description || "No description is available for this app yet."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2 text-xs">
                        {app.version && (
                          <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-slate-300">v{app.version}</span>
                        )}
                        {app.license_type && (
                          <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-indigo-200">{app.license_type}</span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                        <span className="text-xs text-slate-500">Updated {formatUpdatedAt(app.updated_at)}</span>
                        {app.repo_url && (
                          <a
                            href={app.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/20 hover:text-white"
                          >
                            Source ↗
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Catalog</p>
              <h2 className="mt-1 text-2xl font-bold text-white">All apps</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => {
                const name = app.name?.trim() || app.package_name || "Untitled app";
                return (
                  <article
                    key={app.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700 hover:bg-slate-900/90"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-xs font-bold text-indigo-200">
                        {appInitials(name) || "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-white">{name}</h3>
                        <p className="mt-1 truncate text-xs text-slate-500">{app.package_name || "Package unavailable"}</p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 min-h-15 text-sm leading-5 text-slate-400">
                      {app.short_description || app.description || "No description is available for this app yet."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {app.version && <span className="text-xs text-slate-500">v{app.version}</span>}
                      {app.version && app.license_type && <span className="text-slate-700">·</span>}
                      {app.license_type && <span className="text-xs text-indigo-300">{app.license_type}</span>}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
                      <span className="text-xs text-slate-600">{formatUpdatedAt(app.updated_at)}</span>
                      {app.repo_url ? (
                        <a
                          href={app.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                        >
                          View source ↗
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">No source link</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
