// app/(protected)/seo/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";

type SeoPage = {
  id: string;
  orgId: string;
  url: string;
  title: string | null;
  targetKeyword: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latestMetrics: {
    id: string;
    date: string;
    google_rank: number | null;
    sessions: number | null;
    conversions: number | null;
  } | null;
};

type SeoTask = {
  id: string;
  orgId: string;
  seoPageId: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  page?: {
    id: string;
    url: string;
    title: string | null;
  } | null;
};

export default function SeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [tasks, setTasks] = useState<SeoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingPage, setCreatingPage] = useState(false);

  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [pagesRes, tasksRes] = await Promise.all([
        fetch("http://localhost:4000/api/seo/pages", {
          credentials: "include",
        }),
        fetch("http://localhost:4000/api/seo/tasks", {
          credentials: "include",
        }),
      ]);

      const pagesJson = await pagesRes.json();
      const tasksJson = await tasksRes.json();

      setPages(pagesJson.pages || []);
      setTasks(tasksJson.tasks || []);
    } catch (err) {
      console.error("Feil ved lasting av SEO-data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreatePage(e: FormEvent) {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setCreatingPage(true);
    try {
      const res = await fetch("http://localhost:4000/api/seo/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url: newUrl.trim(),
          title: newTitle.trim() || null,
          targetKeyword: newKeyword.trim() || null,
        }),
      });

      if (!res.ok) {
        console.error("Feil ved opprettelse av SEO-side:", await res.text());
        return;
      }

      const json = await res.json();
      if (json.page) {
        setPages((prev) => [json.page, ...prev]);
        setNewUrl("");
        setNewTitle("");
        setNewKeyword("");
      }
    } catch (err) {
      console.error("Feil ved opprettelse av SEO-side:", err);
    } finally {
      setCreatingPage(false);
    }
  }

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">SEO & Synlighet</h1>
          <p className="text-sm text-muted-foreground">
            Oversikt over viktige landingssider, rangeringer og oppgaver.
          </p>
        </div>
      </header>

      {/* Ny side-form */}
      <section className="bg-card border rounded-xl p-4 space-y-3">
        <h2 className="text-lg font-medium">Legg til ny SEO-side</h2>
        <form
          onSubmit={handleCreatePage}
          className="grid gap-3 md:grid-cols-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">URL</label>
            <input
              type="url"
              className="w-full border rounded-md px-3 py-2 bg-background"
              placeholder="https://lyxbil.no/keramisk-coating"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tittel (valgfritt)</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 bg-background"
              placeholder="Keramisk coating Oslo"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Mål-nøkkelord (valgfritt)
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 bg-background"
              placeholder="keramisk coating oslo"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={creatingPage}
              className="px-4 py-2 rounded-md border bg-primary text-primary-foreground text-sm"
            >
              {creatingPage ? "Lagrer..." : "Legg til side"}
            </button>
          </div>
        </form>
      </section>

      {/* Innhold */}
      {loading ? (
        <p>Laster SEO-data…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sider */}
          <section className="bg-card border rounded-xl p-4 space-y-3">
            <h2 className="text-lg font-medium">Viktige sider</h2>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {pages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ingen sider registrert enda.
                </p>
              )}
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="border rounded-lg px-3 py-2 text-sm space-y-1"
                >
                  <div className="flex justify-between gap-2">
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium truncate"
                    >
                      {page.title || page.url}
                    </a>
                    {page.latestMetrics && (
                      <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                        Rank:{" "}
                        {page.latestMetrics.google_rank ?? "ukjent"}
                      </span>
                    )}
                  </div>
                  {page.targetKeyword && (
                    <p className="text-xs text-muted-foreground">
                      Nøkkelord: {page.targetKeyword}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

            {/* Oppgaver */}
          <section className="bg-card border rounded-xl p-4 space-y-3">
            <h2 className="text-lg font-medium">SEO-oppgaver</h2>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ingen SEO-oppgaver registrert enda.
                </p>
              )}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg px-3 py-2 text-sm space-y-1"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                      {task.status}
                    </span>
                  </div>
                  {task.page && (
                    <p className="text-xs text-muted-foreground">
                      Side: {task.page.title || task.page.url}
                    </p>
                  )}
                  {task.description && (
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
