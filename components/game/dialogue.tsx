"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Choice, Line, Script, Speaker, SpotLink } from "@/lib/game-data";

const CPS = 55; // typewriter speed, characters per second

export interface DialogueProps {
  script: Script;
  accent: string;
  hireLinks: SpotLink[];
  onSpeaker: (who: Speaker | null) => void;
  onMedal: () => void;
  onLeave: () => void;
  onChat: () => void;
}

/**
 * RPG-style conversation: typed lines, then numbered choices. Space / Enter
 * advances, 1–4 or ↑↓ + Enter picks, Esc walks away.
 */
export function Dialogue({ script, accent, hireLinks, onSpeaker, onMedal, onLeave, onChat }: DialogueProps) {
  const [queue, setQueue] = useState<Line[]>(script.intro);
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [asked, setAsked] = useState<string[]>([]);
  const [links, setLinks] = useState<SpotLink[]>([]);
  const [then, setThen] = useState<Choice["then"]>();
  const [sel, setSel] = useState(0);
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const line = queue[idx] as Line | undefined;
  const shownChars = line ? (reduced ? line.text.length : chars) : 0;
  const typing = !!line && shownChars < line.text.length;
  const atChoices = !line;

  const choices = useMemo(
    () => script.choices.filter((c) => !asked.includes(c.id) || c.then === "medal" || c.then === "leave"),
    [script.choices, asked],
  );

  // Typewriter
  useEffect(() => {
    if (!line || reduced) return;
    const id = window.setInterval(() => setChars((c) => Math.min(line.text.length, c + 2)), 2000 / CPS);
    return () => clearInterval(id);
  }, [line, reduced]);

  // Tell the 3D scene who is talking (for gestures)
  useEffect(() => {
    onSpeaker(line && typing ? line.who : null);
  }, [line, typing, onSpeaker]);

  const finishReply = useCallback(() => {
    const t = then;
    setThen(undefined);
    if (t === "medal") onMedal();
    else if (t === "leave") onLeave();
    else if (t === "chat") onChat();
    else if (t === "hire") setLinks(hireLinks);
  }, [then, onMedal, onLeave, onChat, hireLinks]);

  const advance = useCallback(() => {
    if (!line) return;
    if (typing) return setChars(line.text.length);
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setChars(0);
    } else {
      setIdx(queue.length);
      finishReply();
    }
  }, [line, typing, idx, queue.length, finishReply]);

  const choose = useCallback(
    (c: Choice) => {
      setAsked((a) => [...a, c.id]);
      setLinks(c.links ?? []);
      setThen(c.then);
      setQueue([{ who: "you", text: c.label }, ...c.reply]);
      setIdx(0);
      setChars(0);
      setSel(0);
    },
    [],
  );

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "Escape") return onLeave();
      if (!atChoices) {
        if (k === " " || k === "Enter" || k === "e" || k === "E") {
          e.preventDefault();
          advance();
        }
        return;
      }
      const n = Number(k);
      if (n >= 1 && n <= choices.length) {
        e.preventDefault();
        return choose(choices[n - 1]);
      }
      if (k === "ArrowDown" || k === "s" || k === "S") {
        e.preventDefault();
        setSel((s) => (s + 1) % choices.length);
      } else if (k === "ArrowUp" || k === "w" || k === "W") {
        e.preventDefault();
        setSel((s) => (s - 1 + choices.length) % choices.length);
      } else if (k === "Enter" || k === " ") {
        e.preventDefault();
        choose(choices[Math.min(sel, choices.length - 1)]);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [atChoices, advance, choices, choose, sel, onLeave]);

  // The last thing said stays on screen while you choose
  const shown = line ?? queue[queue.length - 1];
  const who = shown?.who ?? "host";
  const name = who === "you" ? "You" : script.speaker;

  return (
    <div className="town-dialogue" role="dialog" aria-label={`Talking with ${script.speaker}`} style={{ ["--spot" as string]: accent }}>
      <div className="town-dialogue-box" data-who={who} onClick={advance}>
        <span className="town-nameplate">{name}</span>
        <p className="town-dialogue-text" aria-live="polite">
          {line ? line.text.slice(0, shownChars) : shown?.text}
          {typing && <span className="town-caret" aria-hidden />}
        </p>
        {!atChoices && !typing && (
          <span className="town-next" aria-hidden>
            <kbd>Space</kbd>
          </span>
        )}
        {atChoices && links.length > 0 && (
          <p className="town-dialogue-links">
            {links.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.href} href={l.href} target="_blank" onClick={(e) => e.stopPropagation()}>
                  {l.label} <ArrowUpRight size={14} />
                </Link>
              ) : (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  {l.label} <ArrowUpRight size={14} />
                </a>
              ),
            )}
          </p>
        )}
      </div>
      {atChoices && (
        <ol className="town-choices">
          {choices.map((c, i) => (
            <li key={c.id}>
              <button data-sel={i === sel ? "" : undefined} onMouseEnter={() => setSel(i)} onClick={() => choose(c)}>
                <kbd>{i + 1}</kbd>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      )}
      <p className="town-dialogue-hint" aria-hidden>
        <kbd>Esc</kbd> walk away
      </p>
    </div>
  );
}
