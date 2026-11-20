"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { leadMagnet } from "@/lib/offer";
import { Reveal } from "./motion";

type Status = "idle" | "sending" | "done" | "error";

/** Email capture for the checklist. Rendered only when lib/offer.ts has an endpoint. */
export function ChecklistCard() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch(leadMagnet.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "ai-app-production-checklist" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Reveal
      as="li"
      delay={0.06}
      className="flex flex-col justify-between rounded-xl border border-volt/50 bg-canvas-shade p-6 sm:p-7"
    >
      <div>
        <p className="label">Free download</p>
        <h3 className="mt-4 text-[1.6rem] leading-tight tracking-[-0.03em]">
          Get the <em>AI App Production Checklist</em>
        </h3>
        <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-snug text-ink-muted">{leadMagnet.blurb}</p>
      </div>

      {status === "done" ? (
        <p role="status" className="mt-8 flex items-center gap-2.5 text-ink">
          <span className="live-dot live-dot-ok" aria-hidden />
          Thanks! It&apos;s on its way to your inbox.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          <label htmlFor="checklist-email" className="sr-only">
            Email address
          </label>
          <input
            id="checklist-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="min-h-[48px] rounded-full border border-rule bg-canvas px-5 text-[0.975rem] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
          />
          <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send me the checklist"}
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
          {status === "error" && (
            <p role="alert" className="text-[0.9rem] text-hot">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}
    </Reveal>
  );
}
