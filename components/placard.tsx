"use client";

import { useEffect, useState } from "react";
import { miii, profile } from "@/lib/content";

// A gallery wall label that doubles as a live status object: who, what now,
// and the local time where the work happens.
function useIndiaTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const ROWS: { k: string; v: string }[] = [
  { k: "role", v: "Senior Full-Stack AI Engineer · Commotion" },
  { k: "building", v: `miii ${miii.version} · ${miii.stars}★ · ${miii.releases} releases` },
  { k: "leads", v: "auth & access control, app performance, SaaS security" },
  { k: "open_to", v: "US · UK · Canada · remote or relocation" },
];

export function Placard() {
  const time = useIndiaTime();

  return (
    <aside className="frame relative bg-canvas-deep/70 p-6 md:p-7" aria-label="Current status">
      <div className="flex items-center justify-between">
        <span className="label flex items-center gap-2 text-sanguine">
          <span className="mark mark-blink" aria-hidden />
          now
        </span>
        <span className="label tabular-nums" suppressHydrationWarning>
          {time ? `${time} IST` : "IST"}
        </span>
      </div>

      <p className="mt-6 font-display text-[2rem] leading-none text-ink">
        {profile.name}
      </p>
      <p className="mt-1.5 font-display text-lg italic text-ink-faint">
        Based in India · AI product engineer, 7+ years
      </p>

      <dl className="mt-6 border-t border-rule">
        {ROWS.map((r) => (
          <div key={r.k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-rule py-2.5">
            <dt className="label pt-0.5 normal-case tracking-normal text-lapis">{r.k}</dt>
            <dd className="text-[0.9375rem] leading-snug text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-sm italic text-ink-faint">
        Medium: TypeScript, Python, and models on canvas.
      </p>
    </aside>
  );
}
