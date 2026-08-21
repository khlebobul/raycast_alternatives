"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import appsData from "@/data/apps.json";
import extensionsData from "@/data/extensions.json";
import { Badge } from "@/components/ascii/badge";
import { Card } from "@/components/ascii/card";
import { Dialog } from "@/components/ascii/dialog";
import { Input } from "@/components/ascii/input";

type Category = "productivity" | "developer" | "media" | "utilities" | "communication";
type App = { id: string; name: string; url: string; iconUrl: string; category: Category; description: string };
type Extension = { id: string; name: string; description: string; url: string; replaces: string[] };

const apps = appsData as App[];
const extensions = extensionsData as Extension[];
const replacementCount = extensions.reduce((total, extension) => total + extension.replaces.length, 0);
const categories: Array<["all" | Category, string]> = [
  ["all", "all"], ["productivity", "productivity"], ["developer", "developer"],
  ["media", "media"], ["utilities", "utilities"], ["communication", "communication"],
];
const REPO_URL = "https://github.com/khlebobul/raycast_alternatives";
const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
const GLAZE_ALTERNATIVES_URL = "https://khlebobul.github.io/glaze_alternatives/";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selected, setSelected] = useState<App | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const replacementsFor = (appId: string) => extensions.filter((extension) => extension.replaces.includes(appId));
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return apps.filter((app) => {
      const replacementNames = replacementsFor(app.id).map(({ name }) => name).join(" ");
      return (category === "all" || app.category === category) && `${app.name} ${app.description} ${replacementNames}`.toLowerCase().includes(needle);
    });
  }, [category, query]);

  return (
    <main className="shell">
      <header className="topbar">
        <a href="#top" className="font-bold">~/raycast-alternatives</a>
        <nav><a href="#directory">[apps]</a><a href="#submit">[submit]</a><a href={GLAZE_ALTERNATIVES_URL} target="_blank" rel="noreferrer">[Glaze Alternatives ↗]</a></nav>
      </header>

      <section id="top" className="hero">
        <p className="prompt">$ raycast install --everything</p>
        <h1>One place.<br />Many tools<span className="cursor">_</span></h1>
        <p className="lede">Replace standalone and paid apps with community extensions that live inside <a className="raycast-link" href="https://www.raycast.com/" target="_blank" rel="noreferrer">Raycast ↗</a>. Install what you need. Remove it in seconds. Keep one command bar.</p>
        <div className="counters" aria-label="Catalog totals">
          <div><strong>{apps.length}</strong><span>products covered</span></div>
          <div><strong>{replacementCount}</strong><span>extension options</span></div>
          <div><strong>{extensions.length}</strong><span>unique extensions</span></div>
        </div>
      </section>

      <div className="catalog-layout">
      <section id="directory" className="directory">
        <div className="section-title"><span>01 / directory</span><span>{visible.length} of {apps.length} products</span></div>
        <div className="search-tools">
          <label className="search-label" htmlFor="search">$ find --replacement</label>
          <Input ref={searchRef} id="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => { setQuery(""); searchRef.current?.focus(); }} placeholder="type app or extension name..." icon=">" autoComplete="off" />

          <div className="filters" aria-label="Filter by category">
            {categories.map(([value, label]) => (
              <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>
                {category === value ? `[${label}]` : label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {visible.map((app, index) => {
            const count = replacementsFor(app.id).length;
            return (
              <Card key={app.id}>
                <button type="button" className="app-row" onClick={() => setSelected(app)}>
                  <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="app-icon"><span>{app.name.charAt(0).toUpperCase()}</span><img src={app.iconUrl} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>
                  <span className="app-copy"><strong>{app.name}</strong><small>{app.description}</small></span>
                  <span className="app-meta"><Badge>{app.category}</Badge><small>{count} alt{count === 1 ? "" : "s"} →</small></span>
                </button>
              </Card>
            );
          })}
        </div>
        {!visible.length && <p className="empty">[error] no matching applications</p>}
      </section>
      <aside className="submit-window" id="submit">
        <div className="submit-title"><span>community/write</span><span>● online</span></div>
        <div className="submit-body">
          <p className="prompt">$ contribute --catalog</p>
          <h2>Missing a tool?</h2>
          <p>Add a real product, extension, correction, or better icon. The directory stays current through community pull requests.</p>
          <a href={CONTRIBUTING_URL} target="_blank" rel="noreferrer">[ open contribution guide ↗ ]</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">[ open repository ↗ ]</a>
        </div>
      </aside>
      </div>

      <footer><span>END OF DIRECTORY</span><span>also: <a href={GLAZE_ALTERNATIVES_URL}>[Glaze Alternatives ↗]</a></span><span>built by <a href="https://khlebobul.github.io/">Gleb Shalimov</a></span></footer>

      {selected && (
        <Dialog title={`~/apps/${selected.id}`} onClose={() => setSelected(null)}>
          <div className="detail-head">
            <span className="detail-icon"><span>{selected.name.charAt(0).toUpperCase()}</span><img src={selected.iconUrl} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>
            <div><h3>{selected.name}</h3><p>{selected.description}</p><a href={selected.url} target="_blank" rel="noreferrer">visit website ↗</a></div>
          </div>
          <p className="tree-label">$ ls ./replacements</p>
          <div className="extension-tree">
            {replacementsFor(selected.id).map((extension, index, list) => (
              <article key={extension.id}>
                <span aria-hidden="true">{index === list.length - 1 ? "└──" : "├──"}</span>
                <span className="extension-icon">{extension.name.charAt(0).toUpperCase()}</span>
                <div><strong>{extension.name}</strong><p>{extension.description}</p></div>
                <a href={extension.url} target="_blank" rel="noreferrer">[open ↗]</a>
              </article>
            ))}
          </div>
        </Dialog>
      )}
    </main>
  );
}
