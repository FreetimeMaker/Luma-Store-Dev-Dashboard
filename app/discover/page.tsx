"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type StoreApp = {
  id: string;
  name: string | null;
  description: string | null;
  developer_name: string | null;
  developer_id: string | null;
  category_id: string | null;
  icon_url: string | null;
  version: string | null;
  created_at: string | null;
  updated_at: string | null;
  luma_submission_id: string | null;
  package_name: string | null;
  version_code: number | string | null;
  subcategory: string | null;
  license_type: string | null;
  short_description: string | null;
  screenshots: JsonValue;
  changelog: string | null;
  repo_url: string | null;
  ant_features: JsonValue;
  author_name: string | null;
  author_email: string | null;
  author_website: string | null;
  website_url: string | null;
  source_code_url: string | null;
  issue_tracker_url: string | null;
  translation_url: string | null;
  changelog_url: string | null;
  donate_url: string | null;
  liberapay: string | null;
  opencollective: string | null;
  bitcoin: string | null;
  litecoin: string | null;
  closed_source: boolean;
  categories: string[];
  localized_metadata: JsonValue;
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

function formatDate(value: string | null) {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function stringArray(value: JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function hasJsonValue(value: JsonValue) {
  if (value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function LinkChip({ href, label }: { href: string | null; label: string }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white"
    >
      {label} ↗
    </a>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string | number | null | undefined; mono?: boolean }) {
  if (value === null || value === undefined || String(value).trim() === "") return null;

  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/45 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={`mt-1 break-words text-sm text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{String(value)}</dd>
    </div>
  );
}

export default function DiscoverPage() {
  const supabase = useMemo(() => createClient(), []);
  const [apps, setApps] = useState<StoreApp[]>([]);
  const [search, setSearch] = useState("");
  const [license, setLicense] = useState("all");
  const [category, setCategory] = useState("all");
  const [sourceType, setSourceType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApps() {
      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from("store_apps")
        .select("*")
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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          apps.flatMap((app) => [
            ...(Array.isArray(app.categories) ? app.categories : []),
            ...(app.subcategory ? [app.subcategory] : []),
          ]),
        ),
      )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [apps],
  );

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesLicense = license === "all" || app.license_type === license;
      const appCategories = Array.isArray(app.categories) ? app.categories : [];
      const matchesCategory = category === "all" || appCategories.includes(category) || app.subcategory === category;
      const matchesSource =
        sourceType === "all" ||
        (sourceType === "open" && !app.closed_source) ||
        (sourceType === "closed" && app.closed_source);

      if (!matchesLicense || !matchesCategory || !matchesSource) return false;
      if (!query) return true;

      return JSON.stringify(app).toLowerCase().includes(query);
    });
  }, [apps, category, license, search, sourceType]);

  const featuredApps = filteredApps.slice(0, 3);
  const openSourceCount = apps.filter((app) => !app.closed_source).length;
  const closedSourceCount = apps.filter((app) => app.closed_source).length;

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
            Browse the complete published app metadata, screenshots, links, licensing information, changelogs and developer details.
          </p>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search apps</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search any app field..."
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by license</span>
            <select
              value={license}
              onChange={(event) => setLicense(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All licenses</option>
              {licenses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by source type</span>
            <select
              value={sourceType}
              onChange={(event) => setSourceType(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All source types</option>
              <option value="open">Open source</option>
              <option value="closed">Closed source</option>
            </select>
          </label>
        </div>
      </section>

      {!loading && !error && apps.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Published</p>
            <p className="mt-2 text-2xl font-bold text-white">{apps.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Visible now</p>
            <p className="mt-2 text-2xl font-bold text-white">{filteredApps.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Open source</p>
            <p className="mt-2 text-2xl font-bold text-white">{openSourceCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Closed source</p>
            <p className="mt-2 text-2xl font-bold text-white">{closedSourceCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Categories</p>
            <p className="mt-2 text-2xl font-bold text-white">{categories.length}</p>
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-200">✦</div>
          <h2 className="mt-4 text-lg font-semibold text-white">No apps found</h2>
          <p className="mt-2 text-sm text-slate-400">Try a different search term or filter.</p>
        </section>
      ) : (
        <>
          {featuredApps.length > 0 && (
            <section>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">Recently updated</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Featured apps</h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {featuredApps.map((app) => {
                  const name = app.name?.trim() || app.package_name || "Untitled app";
                  return (
                    <article key={`featured-${app.id}`} className="group rounded-2xl border border-indigo-400/15 bg-gradient-to-b from-indigo-500/10 to-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/30">
                      <div className="flex items-start gap-4">
                        {app.icon_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.icon_url} alt={`${name} icon`} className="h-14 w-14 shrink-0 rounded-2xl border border-indigo-400/20 bg-slate-950 object-cover" />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/15 text-sm font-bold text-indigo-100">
                            {appInitials(name) || "A"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-semibold text-white">{name}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${app.closed_source ? "bg-amber-500/10 text-amber-200" : "bg-emerald-500/10 text-emerald-200"}`}>
                              {app.closed_source ? "Closed source" : "Open source"}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">{app.developer_name || app.author_name || app.package_name || "Unknown developer"}</p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 min-h-15 text-sm leading-5 text-slate-300">
                        {app.short_description || app.description || "No description is available for this app yet."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {app.version && <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-slate-300">v{app.version}{app.version_code !== null ? ` (${app.version_code})` : ""}</span>}
                        {app.license_type && <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-indigo-200">{app.license_type}</span>}
                        {(Array.isArray(app.categories) ? app.categories : []).slice(0, 2).map((item) => (
                          <span key={item} className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-slate-400">{item}</span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                        <span className="text-xs text-slate-500">Updated {formatDate(app.updated_at)}</span>
                        <LinkChip href={app.source_code_url || app.repo_url} label="Source" />
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
              <h2 className="mt-1 text-2xl font-bold text-white">All app details</h2>
            </div>

            <div className="space-y-5">
              {filteredApps.map((app) => {
                const name = app.name?.trim() || app.package_name || "Untitled app";
                const screenshots = stringArray(app.screenshots);
                const antiFeatures = stringArray(app.ant_features);
                const appCategories = Array.isArray(app.categories) ? app.categories : [];

                return (
                  <article key={app.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-slate-700">
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        {app.icon_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.icon_url} alt={`${name} icon`} className="h-20 w-20 shrink-0 rounded-2xl border border-slate-700 bg-slate-950 object-cover" />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-lg font-bold text-indigo-200">
                            {appInitials(name) || "A"}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-white sm:text-2xl">{name}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${app.closed_source ? "border border-amber-400/20 bg-amber-500/10 text-amber-200" : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200"}`}>
                              {app.closed_source ? "Closed source" : "Open source"}
                            </span>
                          </div>
                          <p className="mt-1 break-all font-mono text-xs text-slate-500">{app.package_name || "Package unavailable"}</p>
                          {(app.developer_name || app.author_name) && (
                            <p className="mt-2 text-sm text-slate-400">By {app.developer_name || app.author_name}</p>
                          )}
                          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
                            {app.short_description || app.description || "No description is available for this app yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {appCategories.map((item) => (
                          <span key={item} className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">{item}</span>
                        ))}
                        {app.subcategory && <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{app.subcategory}</span>}
                        {app.license_type && <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">{app.license_type}</span>}
                      </div>

                      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Field label="Version" value={app.version} />
                        <Field label="Version code" value={app.version_code} />
                        <Field label="Created" value={formatDate(app.created_at)} />
                        <Field label="Updated" value={formatDate(app.updated_at)} />
                        <Field label="Developer" value={app.developer_name} />
                        <Field label="Author" value={app.author_name} />
                        <Field label="Author email" value={app.author_email} />
                        <Field label="License" value={app.license_type} />
                      </dl>

                      {app.description && app.description !== app.short_description && (
                        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/35 p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full description</h4>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{app.description}</p>
                        </div>
                      )}

                      {screenshots.length > 0 && (
                        <div className="mt-5">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Screenshots</h4>
                          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                            {screenshots.map((screenshot, index) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={`${screenshot}-${index}`} src={screenshot} alt={`${name} screenshot ${index + 1}`} loading="lazy" className="h-72 w-auto shrink-0 rounded-xl border border-slate-800 bg-slate-950 object-cover" />
                            ))}
                          </div>
                        </div>
                      )}

                      {app.changelog && (
                        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/35 p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Changelog</h4>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{app.changelog}</p>
                        </div>
                      )}

                      <div className="mt-5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project & support links</h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <LinkChip href={app.website_url} label="Website" />
                          <LinkChip href={app.author_website} label="Author website" />
                          <LinkChip href={app.source_code_url} label="Source code" />
                          <LinkChip href={app.repo_url} label="Repository" />
                          <LinkChip href={app.issue_tracker_url} label="Issue tracker" />
                          <LinkChip href={app.translation_url} label="Translations" />
                          <LinkChip href={app.changelog_url} label="Changelog" />
                          <LinkChip href={app.donate_url} label="Donate" />
                          <LinkChip href={app.liberapay} label="Liberapay" />
                          <LinkChip href={app.opencollective} label="OpenCollective" />
                          {app.author_email && (
                            <a href={`mailto:${app.author_email}`} className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white">Email author</a>
                          )}
                        </div>
                      </div>

                      {(app.bitcoin || app.litecoin) && (
                        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                          <Field label="Bitcoin" value={app.bitcoin} mono />
                          <Field label="Litecoin" value={app.litecoin} mono />
                        </dl>
                      )}

                      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/35 p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Anti-features</h4>
                        {antiFeatures.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {antiFeatures.map((item) => (
                              <span key={item} className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">{item}</span>
                            ))}
                          </div>
                        ) : hasJsonValue(app.ant_features) ? (
                          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-300">{JSON.stringify(app.ant_features, null, 2)}</pre>
                        ) : (
                          <p className="mt-2 text-sm text-slate-500">None listed.</p>
                        )}
                      </div>

                      {hasJsonValue(app.localized_metadata) && (
                        <details className="mt-5 rounded-xl border border-slate-800 bg-slate-950/35 p-4">
                          <summary className="cursor-pointer text-sm font-semibold text-slate-200">Localized metadata</summary>
                          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950/70 p-3 text-xs text-slate-300">{JSON.stringify(app.localized_metadata, null, 2)}</pre>
                        </details>
                      )}

                      <details className="mt-5 rounded-xl border border-slate-800 bg-slate-950/35 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Technical & publishing metadata</summary>
                        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <Field label="App ID" value={app.id} mono />
                          <Field label="Developer ID" value={app.developer_id} mono />
                          <Field label="Category ID" value={app.category_id} mono />
                          <Field label="Submission ID" value={app.luma_submission_id} mono />
                          <Field label="Package name" value={app.package_name} mono />
                          <Field label="Source type" value={app.closed_source ? "Closed source" : "Open source"} />
                          <Field label="Icon URL" value={app.icon_url} mono />
                        </dl>
                      </details>
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
