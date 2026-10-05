"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { profile } from "@/lib/content";

// A letter you compose in place: pick a reason, add context, and it opens in
// your own mail client, pre-addressed. No backend, nothing stored.
const REASONS = ["A full-time role", "A contract", "miii / open source", "Just saying hello"];

export function Letter() {
  const [reason, setReason] = useState(REASONS[0]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");

  const href = useMemo(() => {
    const subject = `${reason}${company ? ` · ${company}` : ""}`;
    const body = [
      "Hi Akshay,",
      "",
      note || "I came across your portfolio and would like to talk.",
      "",
      name ? `— ${name}${company ? `, ${company}` : ""}` : "",
    ].join("\n");
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [reason, name, company, note]);

  const field =
    "w-full border-0 border-b border-rule bg-transparent px-0 py-2 text-[1.0625rem] text-ink placeholder:italic placeholder:text-ink-faint focus:border-sanguine focus:outline-none focus:ring-0";

  return (
    <div className="frame bg-canvas p-6 md:p-8">
      <p className="label text-sanguine">
        <span className="text-ink-faint">{"// "}</span>compose
      </p>

      <fieldset className="mt-5">
        <legend className="font-display text-xl italic text-ink">I&apos;m writing about…</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <label
              key={r}
              className={`cursor-pointer border px-3 py-1.5 font-mono text-xs transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sanguine ${
                reason === r
                  ? "border-sanguine bg-sanguine text-canvas"
                  : "border-rule text-ink-muted hover:border-ink-faint"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="sr-only"
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" className={field} />
        </label>
        <label className="block">
          <span className="label">Company</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Analytical Engines Ltd" className={field} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="label">A line of context</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={600}
          placeholder="We're building… and need someone who can own the AI end to end."
          className={`${field} resize-none`}
        />
      </label>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <a
          href={href}
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
        >
          <Send className="size-3.5" aria-hidden /> Open in my email
        </a>
        <span className="label normal-case tracking-normal">Opens your mail app · nothing is stored</span>
      </div>
    </div>
  );
}
