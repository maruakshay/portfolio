"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { deepDives, miii, profile } from "@/lib/content";

type Item = { group: string; label: string; hint?: string; run: () => void };

export const OPEN_PALETTE = "open-command-palette";

// ⌘K / Ctrl+K anywhere. Sections, deep-dives, links, and quick actions.
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSel(0);
    restoreRef.current?.focus();
  }, []);

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => router.push(`/${hash}`);
    const ext = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
    return [
      { group: "Go to", label: "Selected work", hint: "01", run: go("#work") },
      { group: "Go to", label: "miii, in the studio now", hint: "02", run: go("#miii") },
      { group: "Go to", label: "Career", hint: "03", run: go("#career") },
      { group: "Go to", label: "Method", hint: "04", run: go("#method") },
      { group: "Go to", label: "Contact", hint: "05", run: go("#contact") },
      { group: "Go to", label: "Ask AI about Akshay", hint: "/chat", run: () => router.push("/chat") },
      ...deepDives.map((d) => ({
        group: "Deep-dives",
        label: d.name,
        hint: d.tagline,
        run: () => router.push(`/work/${d.slug}`),
      })),
      {
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: () => void navigator.clipboard?.writeText(profile.email).catch(() => {}),
      },
      {
        group: "Actions",
        label: "Copy miii install command",
        hint: miii.install,
        run: () => void navigator.clipboard?.writeText(miii.install).catch(() => {}),
      },
      { group: "Links", label: "Résumé (PDF)", run: ext(profile.resume) },
      { group: "Links", label: "GitHub", run: ext(profile.github) },
      { group: "Links", label: "LinkedIn", run: ext(profile.linkedin) },
      { group: "Links", label: "miii.in", run: ext(miii.site) },
    ];
  }, [router]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(t));
  }, [items, q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) restoreRef.current = document.activeElement as HTMLElement;
          return !o;
        });
        setQ("");
        setSel(0);
      }
    }
    function onOpen() {
      restoreRef.current = document.activeElement as HTMLElement;
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  if (!open) return null;

  function run(i: Item) {
    close();
    i.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[sel]) {
      e.preventDefault();
      run(results[sel]);
    }
  }

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="frame w-full max-w-xl bg-canvas shadow-[8px_8px_0_var(--color-gilt)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search className="size-4 shrink-0 text-ink-faint" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            placeholder="Jump to a section, a project, or an action…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[sel] ? `palette-${sel}` : undefined}
            className="h-14 flex-1 bg-transparent text-lg text-ink placeholder:italic placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="label border border-rule px-1.5 py-0.5">esc</kbd>
        </div>

        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center italic text-ink-faint">Nothing matches “{q}”.</li>
          )}
          {results.map((i, idx) => {
            const header = i.group !== lastGroup ? i.group : null;
            lastGroup = i.group;
            const on = idx === sel;
            return (
              <li key={`${i.group}-${i.label}`} role="presentation">
                {header && <p className="label px-4 pb-1 pt-3">{header}</p>}
                <div
                  id={`palette-${idx}`}
                  role="option"
                  aria-selected={on}
                  onMouseMove={() => setSel(idx)}
                  onClick={() => run(i)}
                  className={`mx-2 flex cursor-pointer items-center gap-3 px-3 py-2 ${
                    on ? "bg-canvas-deep text-sanguine" : "text-ink"
                  }`}
                >
                  <span className="text-[1.0625rem]">{i.label}</span>
                  {i.hint && (
                    <span className="label ml-auto max-w-[50%] truncate normal-case tracking-normal">{i.hint}</span>
                  )}
                  {on && <CornerDownLeft className="size-3.5 shrink-0" aria-hidden />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Header trigger for the palette; mirrors the ⌘K shortcut for pointer users. */
export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
      className="label inline-flex items-center gap-2 border border-rule px-2.5 py-1.5 transition-colors hover:border-ink-faint hover:text-ink"
      aria-label="Open command palette"
    >
      <Search className="size-3.5" strokeWidth={1.5} aria-hidden />
      <kbd className="hidden font-mono sm:inline">⌘K</kbd>
    </button>
  );
}
