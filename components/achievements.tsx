"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { Trophy, X, Lock, Phone } from "lucide-react";
import { burst } from "@/lib/confetti";
import { callHref, profile } from "@/lib/content";

// A light achievement layer across the whole site. Every unlock is a small
// reward; the full set ends in one place: a call. Stored per browser only.

export type AchievementId =
  | "arrived"
  | "explorer"
  | "deep-dive"
  | "thinker"
  | "exterminator"
  | "red-team"
  | "power-user"
  | "curious"
  | "secret"
  | "contact";

export const ACHIEVEMENTS: { id: AchievementId; title: string; hint: string; xp: number }[] = [
  { id: "arrived", title: "First impression", hint: "Land on the site.", xp: 5 },
  { id: "explorer", title: "Full tour", hint: "Scroll through every section.", xp: 10 },
  { id: "thinker", title: "Same wavelength", hint: "Finish “Make the call” in the arcade.", xp: 15 },
  { id: "exterminator", title: "Exterminator", hint: "Squash 15+ bugs in Bug Rush.", xp: 15 },
  { id: "red-team", title: "Red teamer", hint: "Finish “Spot the injection”.", xp: 15 },
  { id: "deep-dive", title: "Deep diver", hint: "Open a project deep-dive.", xp: 10 },
  { id: "curious", title: "Interrogator", hint: "Ask the AI a question.", xp: 10 },
  { id: "power-user", title: "Power user", hint: "Open the command palette (⌘K).", xp: 5 },
  { id: "secret", title: "Easter egg", hint: "↑ ↑ ↓ ↓ ← → ← → B A, or tap the logo 5×.", xp: 5 },
  { id: "contact", title: "Let’s talk", hint: "Reach out. The best one.", xp: 10 },
];

const TOTAL_XP = ACHIEVEMENTS.reduce((n, a) => n + a.xp, 0);
const KEY = "am:achievements:v1";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

interface Ctx {
  unlocked: Set<AchievementId>;
  unlock: (id: AchievementId) => void;
  xp: number;
  total: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const AchievementsContext = createContext<Ctx | null>(null);

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements must be used inside <AchievementsProvider>");
  return ctx;
}

function read(): AchievementId[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(() => new Set());
  const [open, setOpen] = useState(false);
  const ref = useRef<Set<AchievementId> | null>(null);

  useEffect(() => {
    ref.current = new Set(read());
    setUnlocked(ref.current);
  }, []);

  const unlock = useCallback((id: AchievementId) => {
    const prev = ref.current;
    // Not hydrated yet, or already earned: nothing to celebrate.
    if (!prev || prev.has(id)) return;
    const next = new Set(prev).add(id);
    ref.current = next;
    setUnlocked(next);
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      /* storage blocked: progress lasts for this visit only */
    }

    const a = ACHIEVEMENTS.find((x) => x.id === id)!;
    burst(undefined, id === "arrived" ? 40 : 90);
    toast.custom(
      () => (
        <div className="flex w-[340px] items-center gap-3 rounded-sm border border-volt/40 bg-canvas-deep px-4 py-3 shadow-[0_12px_40px_-12px_oklch(0.92_0.21_125/0.45)]">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-volt text-canvas [animation:pop_420ms_var(--ease-spring)]">
            <Trophy className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-volt">
              Achievement · +{a.xp} XP
            </p>
            <p className="truncate font-display text-base font-semibold text-ink">{a.title}</p>
          </div>
          <span className="ml-auto font-mono text-xs text-ink-faint">
            {next.size}/{ACHIEVEMENTS.length}
          </span>
        </div>
      ),
      { duration: 3200 },
    );
    if (next.size === ACHIEVEMENTS.length) setTimeout(() => setOpen(true), 900);
  }, []);

  // Wait until stored progress is loaded, so a returning visitor isn't
  // re-congratulated on arrival.
  useEffect(() => {
    const id = setTimeout(() => unlock("arrived"), 1400);
    return () => clearTimeout(id);
  }, [unlock]);

  useEffect(() => {
    let i = 0;
    function onKey(e: KeyboardEvent) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        unlock("secret");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock]);

  const xp = useMemo(
    () => ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).reduce((n, a) => n + a.xp, 0),
    [unlocked],
  );

  const value = useMemo(
    () => ({ unlocked, unlock, xp, total: TOTAL_XP, open, setOpen }),
    [unlocked, unlock, xp, open],
  );

  return (
    <AchievementsContext.Provider value={value}>
      {children}
      <AchievementsPanel />
    </AchievementsContext.Provider>
  );
}

/** Unlocks an achievement on mount. Lets server pages award one. */
export function Unlock({ id }: { id: AchievementId }) {
  const { unlock } = useAchievements();
  useEffect(() => unlock(id), [id, unlock]);
  return null;
}

/** Header meter: XP bar plus a count. Opens the panel. */
export function XpMeter() {
  const { xp, total, unlocked, setOpen } = useAchievements();
  const pct = Math.round((xp / total) * 100);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex items-center gap-2.5 rounded-full border border-rule px-3 py-1.5 transition-colors hover:border-volt"
      aria-label={`Achievements: ${unlocked.size} of ${ACHIEVEMENTS.length} unlocked, ${pct}% explored`}
    >
      <Trophy className="size-3.5 text-volt" aria-hidden />
      <span className="relative hidden h-1.5 w-16 overflow-hidden rounded-full bg-canvas-shade sm:block">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-volt transition-[width] duration-700 ease-[var(--ease-spring)]"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="font-mono text-xs tabular-nums text-ink" suppressHydrationWarning>
        {pct}%
      </span>
    </button>
  );
}

function AchievementsPanel() {
  const { unlocked, xp, total, open, setOpen, unlock } = useAchievements();
  const done = unlocked.size === ACHIEVEMENTS.length;
  const pct = Math.round((xp / total) * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-canvas/70 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Achievements"
        className="flex h-full w-full max-w-md flex-col border-l border-rule bg-canvas-deep [animation:slide-in_260ms_var(--ease-out-quart)]"
      >
        <div className="flex items-center justify-between border-b border-rule px-6 py-4">
          <p className="label text-volt">Achievements</p>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-rule px-6 py-6">
          <p className="font-display text-5xl font-bold tabular-nums text-ink">
            {pct}
            <span className="text-2xl text-ink-faint">% explored</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas-shade">
            <div className="h-full rounded-full bg-volt transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 font-mono text-xs text-ink-faint">
            {xp} / {total} XP · {unlocked.size} of {ACHIEVEMENTS.length} unlocked
          </p>
        </div>

        {done && (
          <div className="border-b border-rule bg-volt/10 px-6 py-6">
            <p className="font-display text-2xl font-bold text-ink">
              100%. You&apos;ve seen <em className="text-volt">everything</em>.
            </p>
            <p className="mt-2 text-ink-muted">
              You now know more about how Akshay works than most interview loops find out. The
              next step is twenty minutes on a call.
            </p>
            <a
              href={callHref("I hit 100% on your portfolio. Let's talk.")}
              target={profile.booking ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => unlock("contact")}
              className="btn-primary mt-4"
            >
              <Phone className="size-4" aria-hidden /> Book the call
            </a>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {ACHIEVEMENTS.map((a) => {
            const on = unlocked.has(a.id);
            return (
              <li key={a.id} className="flex items-center gap-3 rounded-sm px-3 py-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border ${
                    on ? "border-volt bg-volt text-canvas" : "border-rule text-ink-faint"
                  }`}
                >
                  {on ? <Trophy className="size-4" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`font-display font-semibold ${on ? "text-ink" : "text-ink-muted"}`}>{a.title}</p>
                  <p className="text-sm text-ink-faint">{a.hint}</p>
                </div>
                <span className={`font-mono text-xs ${on ? "text-volt" : "text-ink-faint"}`}>+{a.xp}</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
