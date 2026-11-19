"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { callHref, profile } from "@/lib/content";
import { MarkSvg } from "@/lib/brand";
import {
  BOSS,
  core,
  FIGHTS,
  footprint,
  LAYOUT,
  medalSpots,
  scriptFor,
  stageFor,
  stages,
  TOTAL_MEDALS,
  type Speaker,
  type Spot,
} from "@/lib/game-data";
import { ChatFull } from "@/components/chat-full";
import type { CombatEvent } from "./combat";
import type { TownGame } from "./engine";
import { Dialogue } from "./dialogue";
import "./town.css";

const STORE = "am:town:medals:v1";
const BEST = "am:town:best:v1";
const FIGHT_STORE = "am:town:fights:v1";
const DESKTOP = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

// ── Desktop gate ─────────────────────────────────────────────────────────────

function useMedia(q: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(q);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => null,
  );
}

let webglCache: boolean | undefined;
function hasWebGL() {
  if (webglCache !== undefined) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noSubscribe = () => () => {};

/** Local hour, refreshed each minute, so the page follows the visitor's day. */
function useLocalHour() {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setH(d.getHours() + d.getMinutes() / 60);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return h;
}

const isNight = (h: number | null) => h !== null && (h < 6.5 || h >= 18.5);

export function Town() {
  const desktop = useMedia(DESKTOP);
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => null);

  if (desktop === null || webgl === null) return <div className="town-boot" aria-hidden />;
  if (!desktop || !webgl) return <DesktopOnly reason={desktop ? "webgl" : "small"} />;
  return <TownGameView />;
}

// ── Mobile / no-WebGL notice ─────────────────────────────────────────────────

function DesktopOnly({ reason }: { reason: "small" | "webgl" }) {
  const hour = useLocalHour();
  const external = callHref().startsWith("http");
  return (
    <main className="town-mobile" data-night={isNight(hour) ? "" : undefined}>
      <div className="town-mobile-sky" aria-hidden>
        <span className="town-mobile-orb" />
      </div>
      <div className="town-mobile-card">
        <div className="town-brand">
          <MarkSvg size={44} id="am-mobile" />
          <p className="town-label">{profile.role}</p>
        </div>
        <h1>The town is built for a big screen.</h1>
        <p className="town-mobile-lead">
          {reason === "small"
            ? "It's a small 3D town built for a keyboard and a big screen. Open this page on a laptop or desktop to play it."
            : "It's a small 3D town, and this browser can't draw 3D graphics. Try a recent Chrome, Edge, Safari or Firefox on a laptop or desktop."}
        </p>
        <p className="town-mobile-sub">{profile.availability}.</p>
        <div className="town-mobile-actions">
          <a className="town-btn town-btn-primary" href={callHref()} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            Book a 20-min call
          </a>
          <Link className="town-btn" href="/">
            Back to the main site
          </Link>
        </div>
        <ul className="town-mobile-links">
          <li><a href={`mailto:${profile.email}`}>Email</a></li>
          <li><a href={profile.instagramLifts} target="_blank" rel="noopener noreferrer">@akshaay.lifts</a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={profile.resume} target="_blank" rel="noopener noreferrer">Résumé</a></li>
        </ul>
      </div>
    </main>
  );
}

// ── The game ─────────────────────────────────────────────────────────────────

function loadMedals(): string[] {
  try {
    const raw = localStorage.getItem(STORE);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    const valid = new Set(medalSpots.map((s) => s.id));
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === "string" && valid.has(x)) : [];
  } catch {
    return [];
  }
}
function saveMedals(ids: string[]) {
  try {
    localStorage.setItem(STORE, JSON.stringify(ids));
  } catch {
    /* private mode: progress just won't persist */
  }
}
function loadFights(): { fights: number[]; boss: boolean } {
  try {
    const raw = JSON.parse(localStorage.getItem(FIGHT_STORE) ?? "null") as { fights?: unknown; boss?: unknown } | null;
    const fights = Array.isArray(raw?.fights) ? raw.fights.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < FIGHTS.length) : [];
    return { fights, boss: raw?.boss === true };
  } catch {
    return { fights: [], boss: false };
  }
}
function saveFights(fights: number[], boss: boolean) {
  try {
    localStorage.setItem(FIGHT_STORE, JSON.stringify({ fights, boss }));
  } catch {
    /* ignore */
  }
}
function loadBest(): number | null {
  try {
    const v = Number(localStorage.getItem(BEST));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}
function saveBest(ms: number) {
  try {
    localStorage.setItem(BEST, String(ms));
  } catch {
    /* ignore */
  }
}

const spotById = new Map<string, Spot>([...medalSpots, core].map((s) => [s.id, s]));

// Radar: world units → px, and the door point in front of each building
const RADAR_S = 2.1;
const doorOf = (s: Spot) => {
  const { x, z, w } = footprint(s);
  return { x: s.kind === "experience" ? x + w / 2 + 2.5 : x - w / 2 - 2.5, z };
};
const deg = (r: number) => (r * 180) / Math.PI;

function fmtTime(h: number) {
  const d = new Date();
  d.setHours(Math.floor(h), Math.round((h % 1) * 60));
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtRun(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const KNOCKOUTS = [
  "Rebooted. Keep your distance and shoot. Q sends me in too.",
  "Rebooted. Medals make you stronger: grab a few doors first if this one's tough.",
  "Rebooted. Watch for the flash before they dash, and jump the purple shots.",
];

function TownGameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<SVGGElement>(null);
  const meRef = useRef<SVGGElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<TownGame | null>(null);
  const firstSync = useRef(true);
  const knockouts = useRef(0);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const [collected, setCollected] = useState<string[]>([]);
  const [near, setNear] = useState<string | null>(null);
  const [talk, setTalk] = useState<Spot | null>(null);
  const [won, setWon] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [say, setSay] = useState<string | null>(null);
  const [clock, setClock] = useState<{ label: string; hours: number } | null>(null);
  const [fightsDone, setFightsDone] = useState<number[]>([]);
  const [bossDown, setBossDown] = useState(false);
  const [hp, setHp] = useState<{ hp: number; max: number }>({ hp: 5, max: 5 });
  const [fight, setFight] = useState<{ name: string; left: number } | null>(null);
  const [boss, setBoss] = useState<{ hp: number; max: number; awake: boolean } | null>(null);
  const [down, setDown] = useState(false);
  const [ammo, setAmmo] = useState({ ammo: 24, mag: 24, reloading: false });
  const [vehicle, setVehicle] = useState<"none" | "near" | "driving">("none");
  const [banner, setBanner] = useState<{ title: string; sub: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const [runStart, setRunStart] = useState<number | null>(null);
  const [runEnd, setRunEnd] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  const count = collected.length;
  const stage = stageFor(count);
  const allDone = count >= TOTAL_MEDALS;
  const coreOpen = allDone && bossDown;
  const night = clock ? isNight(clock.hours) : false;

  useEffect(() => {
    setCollected(loadMedals());
    setBest(loadBest());
    const f = loadFights();
    setFightsDone(f.fights);
    setBossDown(f.boss);
  }, []);

  const showBanner = useCallback((title: string, sub: string) => {
    setBanner({ title, sub });
    window.setTimeout(() => setBanner((b) => (b?.title === title && b.sub === sub ? null : b)), 3200);
  }, []);

  useEffect(() => {
    const on = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", on);
    return () => document.removeEventListener("pointerlockchange", on);
  }, []);

  const sayFor = useCallback((text: string, ms = 6500) => {
    setSay(text);
    window.setTimeout(() => setSay((cur) => (cur === text ? null : cur)), ms);
  }, []);

  // Boot the engine (three.js is loaded only on desktop)
  useEffect(() => {
    let game: TownGame | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { TownGame } = await import("./engine");
        if (cancelled || !canvasRef.current) return;
        game = new TownGame(
          canvasRef.current,
          {
            onNear: setNear,
            onInteract: (id) => window.dispatchEvent(new CustomEvent("town:interact", { detail: id })),
            onTick: (x, z, yaw, camYaw, kmh) => {
              radarRef.current?.setAttribute(
                "transform",
                `rotate(${deg(camYaw).toFixed(1)}) scale(${RADAR_S}) translate(${(-x).toFixed(2)} ${(-z).toFixed(2)})`,
              );
              meRef.current?.setAttribute("transform", `rotate(${(180 - deg(yaw) + deg(camYaw)).toFixed(0)})`);
              if (speedRef.current) speedRef.current.textContent = String(Math.round(kmh));
            },
            onVehicle: setVehicle,
            onClock: (label, hours) => setClock({ label, hours }),
            onHp: (hp, max) => setHp({ hp, max }),
            onCombat: (e) => window.dispatchEvent(new CustomEvent("town:combat", { detail: e })),
            onDown: () => window.dispatchEvent(new CustomEvent("town:down")),
            onAmmo: (ammo, mag, reloading) => setAmmo({ ammo, mag, reloading }),
            onHitMarker: () => {
              const el = hitRef.current;
              if (!el) return;
              el.classList.remove("is-hit");
              void el.offsetWidth;
              el.classList.add("is-hit");
            },
          },
          bubbleRef.current,
        );
        await game.init();
        if (cancelled) return;
        gameRef.current = game;
        if (process.env.NODE_ENV !== "production") (window as unknown as { __town?: TownGame }).__town = game;
        setReady(true);
      } catch (e) {
        console.error(e);
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      game?.dispose();
      gameRef.current = null;
    };
  }, []);

  // Sync medals into the world
  useEffect(() => {
    if (!ready) return;
    gameRef.current?.setCollected(collected, !firstSync.current);
    firstSync.current = false;
  }, [collected, ready]);

  // Sync fight progress into the world
  useEffect(() => {
    if (!ready) return;
    gameRef.current?.setProgress(fightsDone, bossDown);
  }, [fightsDone, bossDown, ready]);

  // Pause the world whenever a screen is over it
  useEffect(() => {
    gameRef.current?.setPaused(!started || won);
  }, [started, won, ready]);

  // Run timer
  useEffect(() => {
    if (runStart === null || runEnd !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [runStart, runEnd]);

  const finishRun = useCallback(() => {
    const end = Date.now();
    setRunEnd(end);
    if (runStart !== null) {
      const ms = end - runStart;
      if (best === null || ms < best) {
        setBest(ms);
        saveBest(ms);
      }
    }
  }, [runStart, best]);

  // Fight feedback
  useEffect(() => {
    const on = (ev: Event) => {
      const e = (ev as CustomEvent<CombatEvent>).detail;
      switch (e.type) {
        case "fight":
          setFight({ name: e.name, left: e.left });
          sayFor(e.intro, 7000);
          break;
        case "left":
          setFight((f) => (f ? { ...f, left: e.left } : f));
          break;
        case "cleared":
          setFight(null);
          setFightsDone((d) => {
            const next = d.includes(e.idx) ? d : [...d, e.idx];
            saveFights(next, bossDown);
            return next;
          });
          sayFor(e.idx === 0 ? "Wall's down! Fights heal you, and so do medals." : "Wall's down. Onward!", 4500);
          showBanner("Street cleared", FIGHTS[e.idx].name);
          break;
        case "retreat":
          setFight(null);
          sayFor("They went back behind the wall. Come back when you're ready.", 4500);
          break;
        case "boss":
          setBoss((prev) => {
            if (e.awake && !prev?.awake)
              sayFor("That's the Black Box! Jump its shockwaves and shots. Its armour drops right after it slams: that's when to shoot.", 8000);
            return { hp: e.hp, max: e.max, awake: e.awake };
          });
          break;
        case "bossDown":
          setBoss(null);
          setBossDown(true);
          setFightsDone((d) => {
            saveFights(d, true);
            return d;
          });
          finishRun();
          showBanner("Boss defeated", BOSS.name);
          sayFor("We opened the Black Box! The AI Core is open. Walk up to the door and press E.", 9000);
          break;
        case "bossWall":
          sayFor(`The Black Box only fights an AI Master. Collect all ${TOTAL_MEDALS} medals first. We have ${count}.`, 5000);
          break;
      }
    };
    const onDown = () => {
      setDown(true);
      setFight(null);
      window.setTimeout(() => setDown(false), 1500);
      sayFor(KNOCKOUTS[knockouts.current % KNOCKOUTS.length], 6500);
      knockouts.current += 1;
    };
    window.addEventListener("town:combat", on);
    window.addEventListener("town:down", onDown);
    return () => {
      window.removeEventListener("town:combat", on);
      window.removeEventListener("town:down", onDown);
    };
  }, [sayFor, bossDown, count, finishRun, showBanner]);

  // Interact (E at a door) → conversation
  useEffect(() => {
    const on = (e: Event) => {
      const s = spotById.get((e as CustomEvent<string>).detail);
      if (!s) return;
      if (s.kind === "core" && !allDone) {
        sayFor(`Not yet. The Core needs all ${TOTAL_MEDALS} medals, and we have ${count}. Keep exploring!`);
        return;
      }
      if (s.kind === "core" && !bossDown) {
        sayFor("The Black Box is guarding the door. Beat it first!");
        return;
      }
      setSay(null);
      setTalk(s);
      gameRef.current?.converse(s.id);
    };
    window.addEventListener("town:interact", on);
    return () => window.removeEventListener("town:interact", on);
  }, [allDone, bossDown, count, sayFor]);

  const endTalk = useCallback(() => {
    setTalk(null);
    gameRef.current?.converse(null);
  }, []);

  const collect = useCallback(
    (s: Spot) => {
      endTalk();
      if (collected.includes(s.id)) return;
      const next = [...collected, s.id];
      const before = stageFor(collected.length);
      const after = stageFor(next.length);
      setCollected(next);
      saveMedals(next);
      sayFor(`I learned: ${s.learned}`, 8000);
      showBanner("Medal earned", s.name);
      if (after.name !== before.name) {
        setToast(after.name);
        window.setTimeout(() => setToast(null), 3200);
      }
      if (next.length === TOTAL_MEDALS) {
        window.setTimeout(
          () =>
            sayFor(
              bossDown
                ? "That's every medal. I know Akshay now. The AI Core is open, follow the light!"
                : "That's every medal, and you're an AI Master. One thing left: the Black Box guarding the Core. Let's go!",
              9000,
            ),
          3400,
        );
      }
    },
    [collected, endTalk, sayFor, bossDown, showBanner],
  );

  const reset = () => {
    setCollected([]);
    saveMedals([]);
    firstSync.current = true;
    setWon(false);
    setFightsDone([]);
    setBossDown(false);
    setFight(null);
    setBoss(null);
    saveFights([], false);
    knockouts.current = 0;
    setRunStart(Date.now());
    setRunEnd(null);
    gameRef.current?.respawn();
  };

  const start = useCallback(() => {
    setStarted(true);
    setRunStart(Date.now());
    setNow(Date.now());
  }, []);

  // Keyboard for overlays
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!started && ready && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        start();
        return;
      }
      if (e.key === "Escape" && won) setWon(false);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [started, ready, won, start]);

  const onSpeaker = useCallback((who: Speaker | null) => gameRef.current?.setSpeaker(who), []);

  // The companion's idle line: what to do next.
  const nextSpot = medalSpots.find((s) => !collected.includes(s.id));
  const idle = !started
    ? null
    : boss?.awake
      ? "Jump the rings and shots. Its armour drops after it slams: unload on it then!"
      : fight
        ? `${fight.name}: ${fight.left} left. Shoot them! Q sends me in too.`
      : coreOpen
        ? "I know Akshay now. Meet me at the AI Core, at the end of the street."
        : allDone
          ? "Every medal! The Black Box guards the Core at the end of the street. Let's beat it."
          : count === 0 && fightsDone.length === 0
            ? "Hi, I'm Akshay's AI. Bugs ahead! Click to use the mouse, then hold left-click to shoot (right-click to aim). F borrows a car."
            : `${TOTAL_MEDALS - count} medals to go. Next door: ${nextSpot?.name}.`;

  const nearSpot = near ? spotById.get(near) : undefined;
  const nearLine = nearSpot
    ? nearSpot.kind === "core"
      ? coreOpen
        ? "The Core is open. Press E to go in."
        : allDone
          ? "The Black Box is guarding it."
          : `The AI Core opens at ${TOTAL_MEDALS} medals. We have ${count}.`
      : collected.includes(nearSpot.id)
        ? `${nearSpot.name}. Press E to say hi again.`
        : `${nearSpot.name}. Press E to talk.`
    : null;
  const bubbleText = say ?? nearLine ?? idle;

  const external = callHref().startsWith("http");
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const pips = useMemo(() => medalSpots.map((s) => ({ id: s.id, kind: s.kind, name: s.name })), []);
  const hireLinks = useMemo(
    () => [
      { label: "Book a 20-min call", href: callHref() },
      { label: "Email", href: `mailto:${profile.email}` },
      { label: "LinkedIn", href: profile.linkedin },
    ],
    [],
  );
  const runMs = runStart === null ? 0 : Math.max(0, (runEnd ?? (now || runStart)) - runStart);

  if (failed) return <DesktopOnly reason="webgl" />;

  return (
    <div className="town" data-night={night ? "" : undefined}>
      <canvas ref={canvasRef} className="town-canvas" aria-label="A 3D town: walk with WASD or the arrow keys" />

      {/* Companion speech bubble, positioned by the engine above the orb */}
      <div ref={bubbleRef} className="town-bubble-anchor" aria-live="polite">
        {started && bubbleText && !talk && !won && <div className="town-bubble">{bubbleText}</div>}
      </div>

      {/* HUD: identity + progress */}
      <header className="town-hud town-hud-left" data-dim={talk ? "" : undefined}>
        <div className="town-brand">
          <Link href="/" aria-label="Back to the main site" title="Back to the main site">
            <MarkSvg size={40} id="am-hud" />
          </Link>
          <p className="town-label">{profile.role}</p>
        </div>
        <div className="town-progress">
          <div className="town-progress-row">
            <span className="town-stage">{stage.name}</span>
            <span className="town-count">
              {count}/{TOTAL_MEDALS} medals
            </span>
          </div>
          <ol className="town-pips" aria-label={`${count} of ${TOTAL_MEDALS} medals collected`}>
            {pips.map((p) => (
              <li key={p.id} data-on={collected.includes(p.id) ? "" : undefined} data-kind={p.kind} title={p.name} />
            ))}
          </ol>
          <ol className="town-ladder" aria-label="Evolution stages">
            {stages.map((s) => (
              <li key={s.name} data-on={count >= s.min ? "" : undefined}>
                {s.name}
              </li>
            ))}
          </ol>
          {started && (
            <div className="town-hp" aria-label={`Health ${hp.hp} of ${hp.max}`}>
              <span className="town-label">HP</span>
              <ol>
                {Array.from({ length: hp.max }, (_, i) => (
                  <li key={i} data-on={i < hp.hp ? "" : undefined} />
                ))}
              </ol>
            </div>
          )}
          {started && (
            <p className="town-stats">
              <span>⏱ {fmtRun(runMs)}</span>
              <span>
                Fights {fightsDone.length}/{FIGHTS.length}
                {bossDown ? " · Box ✓" : ""}
              </span>
              {best !== null && <span>Best {fmtRun(best)}</span>}
            </p>
          )}
        </div>
      </header>

      <nav className="town-hud town-hud-right" aria-label="Quick links" data-dim={talk ? "" : undefined}>
        {clock && (
          <p className="town-clock" title="The town follows your local time">
            <span className="town-sun" aria-hidden />
            {clock.label} · {fmtTime(clock.hours)}
          </p>
        )}
        <div className="town-links">
          <a className="town-btn town-btn-primary" href={callHref()} {...ext}>
            Book a call
          </a>
          <Link className="town-btn" href="/chat" target="_blank">
            Ask AI
          </Link>
          <a className="town-btn" href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </div>
      </nav>

      {/* Radar: turns with the camera, up is where you're looking */}
      {!talk && (
        <div className="town-radar" aria-hidden>
          <svg viewBox="-80 -80 160 160">
            <defs>
              <clipPath id="town-radar-clip">
                <circle r="74" />
              </clipPath>
            </defs>
            <circle r="78" className="town-radar-bg" />
            <g clipPath="url(#town-radar-clip)">
              <g ref={radarRef}>
                <rect x={-5} y={-128} width={10} height={188} className="town-radar-road" />
                {medalSpots.map((sp) => {
                  const { x, z, w, d } = footprint(sp);
                  return (
                    <rect
                      key={sp.id}
                      x={x - w / 2}
                      y={z - d / 2}
                      width={w}
                      height={d}
                      rx={0.8}
                      style={{ fill: sp.color }}
                      className={collected.includes(sp.id) ? "town-radar-b is-done" : "town-radar-b"}
                    />
                  );
                })}
                {FIGHTS.map((f, i) =>
                  fightsDone.includes(i) ? null : (
                    <line key={f.z} x1={-27} x2={27} y1={f.z} y2={f.z} className="town-radar-wall" vectorEffect="non-scaling-stroke" />
                  ),
                )}
                {!bossDown && <circle cx={BOSS.arena.x} cy={BOSS.arena.z} r={BOSS.arena.r} className="town-radar-arena" vectorEffect="non-scaling-stroke" />}
                <circle cx={LAYOUT.core.x} cy={LAYOUT.core.z} r={LAYOUT.core.r} className={coreOpen ? "town-radar-core is-open" : "town-radar-core"} />
                {medalSpots
                  .filter((sp) => !collected.includes(sp.id))
                  .map((sp) => {
                    const d = doorOf(sp);
                    return <circle key={sp.id} cx={d.x} cy={d.z} r={1.6} className="town-radar-blip" />;
                  })}
              </g>
            </g>
            <g ref={meRef}>
              <path d="M0 -8 L6 6 L0 2.5 L-6 6 Z" className="town-radar-me" />
            </g>
          </svg>
          {vehicle === "driving" && (
            <p className="town-speed">
              <span ref={speedRef}>0</span> km/h
            </p>
          )}
        </div>
      )}

      {/* Controls + interact prompt */}
      {started && !talk && (
        <p className="town-keys" aria-hidden>
          {vehicle === "driving" ? (
            <>
              <kbd>W</kbd>
              <kbd>S</kbd> drive · <kbd>A</kbd>
              <kbd>D</kbd> steer · <kbd>Space</kbd> handbrake · <kbd>Shift</kbd> boost · <kbd>F</kbd> get out
            </>
          ) : (
            <>
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd> move · <kbd>Shift</kbd> run · <kbd>Space</kbd> jump · left-click / <kbd>J</kbd> shoot · right-click aim · <kbd>R</kbd>{" "}
              reload · <kbd>Q</kbd> AI blast · <kbd>E</kbd> talk · <kbd>F</kbd> car
            </>
          )}
          {" · "}
          {locked ? "mouse to look · Esc frees it" : "click to look around with the mouse"}
        </p>
      )}
      {started && !nearSpot && vehicle === "near" && !talk && !won && (
        <p className="town-prompt">
          <kbd>F</kbd> Get in and drive
        </p>
      )}
      {started && nearSpot && !talk && !won && (
        <p className="town-prompt">
          <kbd>E</kbd> {nearSpot.kind === "core" ? (coreOpen ? "Enter the AI Core" : allDone ? "Guarded" : "Locked") : `Talk to ${nearSpot.host.split(" · ")[0]}`}
        </p>
      )}

      {toast && (
        <div className="town-toast" role="status">
          <span className="town-label">You evolved</span>
          <strong>{toast}</strong>
          <span className="town-label">Hits harder · more HP · faster</span>
        </div>
      )}

      {started && !talk && !won && vehicle !== "driving" && (
        <div className="town-crosshair" ref={hitRef} data-locked={locked ? "" : undefined} aria-hidden>
          <span />
        </div>
      )}
      {started && !talk && vehicle !== "driving" && (
        <p className="town-ammo" aria-label={`Ammo ${ammo.ammo} of ${ammo.mag}`}>
          {ammo.reloading ? (
            <span className="town-label">Reloading…</span>
          ) : (
            <>
              <strong>{ammo.ammo}</strong> / {ammo.mag}
            </>
          )}
        </p>
      )}
      {banner && (
        <div className="town-banner" role="status">
          <strong>{banner.title}</strong>
          <span>{banner.sub}</span>
        </div>
      )}

      {/* Fight banner / boss bar */}
      {started && !talk && boss?.awake && (
        <div className="town-bossbar" role="status">
          <p>
            <span className="town-label">Boss</span>
            <strong>{BOSS.name}</strong>
          </p>
          <div className="town-bossbar-track">
            <span style={{ width: `${(boss.hp / boss.max) * 100}%` }} />
          </div>
        </div>
      )}
      {started && !talk && fight && !boss?.awake && (
        <p className="town-fight" role="status">
          <span className="town-label">Fight</span> {fight.name} · {fight.left} left
        </p>
      )}
      {down && (
        <div className="town-down" role="status">
          <strong>Rebooting…</strong>
        </div>
      )}

      {/* Conversation */}
      {talk && (
        <Dialogue
          key={talk.id}
          script={scriptFor(talk, collected.includes(talk.id), count)}
          accent={talk.accent}
          hireLinks={hireLinks}
          onSpeaker={onSpeaker}
          onMedal={() => collect(talk)}
          onLeave={endTalk}
          onChat={() => {
            endTalk();
            setWon(true);
          }}
        />
      )}

      {/* Title screen */}
      {!started && (
        <div className="town-overlay">
          <div className="town-card town-title" role="dialog" aria-modal="true" aria-labelledby="town-title-h">
            <div className="town-brand">
              <MarkSvg size={52} id="am-title" />
              <p className="town-label">{profile.role}</p>
            </div>
            <h1 id="town-title-h">Welcome to my town.</h1>
            <p>
              The <b>buildings</b> are places I&apos;ve worked, oldest first. The <b>shops</b> are my skills. Knock on each door and
              have a chat with me, from whichever year I was there, to earn a medal.
            </p>
            <p>
              <b>Bugs</b> block the street behind glitch walls: <b>shoot your way through</b>. It&apos;s an open town too:{" "}
              <b>borrow any parked car</b> and drive. Every medal makes you stronger, changes your look, and
              teaches the little AI that walks with you something new about me. Collect all {TOTAL_MEDALS}, then beat{" "}
              <b>{BOSS.name}</b> to open the <b>AI Core</b>.
            </p>
            <div className="town-title-keys">
              <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk</span>
              <span>click / <kbd>J</kbd> shoot · right-click aim</span>
              <span><kbd>Q</kbd> AI blast</span>
              <span><kbd>F</kbd> get in a car</span>
              <span><kbd>Space</kbd> jump</span>
              <span><kbd>E</kbd> talk</span>
              <span><kbd>Shift</kbd> run</span>
            </div>
            <button className="town-btn town-btn-primary town-btn-lg" onClick={start} disabled={!ready} autoFocus>
              {!ready ? "Building the town…" : count > 0 ? `Continue · ${count}/${TOTAL_MEDALS} medals` : "Start walking"}
            </button>
            <p className="town-skip">
              In a hurry? <Link href="/chat">Ask my AI</Link> or{" "}
              <a href={callHref()} {...ext}>
                book a 20-min call
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* The win: inside the AI Core */}
      {won && (
        <div className="town-overlay">
          <div className="town-card town-win" role="dialog" aria-modal="true" aria-labelledby="town-win-h">
            <button className="town-close" onClick={() => setWon(false)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="town-win-side">
              <p className="town-label">
                All {TOTAL_MEDALS} medals · {BOSS.name} beaten · {stage.name}
                {runEnd !== null && runStart !== null ? ` · ${fmtRun(runEnd - runStart)}` : ""}
              </p>
              <h2 id="town-win-h">You know me now.</h2>
              <p>
                Seven years of building: an AI startup founded and sold, enterprise AI in production, and a lot of open source. If
                you&apos;re building something with AI, I build it end to end, and I&apos;m open for freelance projects.
              </p>
              <div className="town-win-actions">
                <a className="town-btn town-btn-primary town-btn-lg" href={callHref()} {...ext}>
                  Book a 20-min call
                </a>
                <a className="town-btn" href={`mailto:${profile.email}`}>
                  Email me
                </a>
                <a className="town-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a className="town-btn" href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
              <p className="town-skip">
                <button onClick={() => setWon(false)}>Keep exploring</button> ·{" "}
                <button onClick={reset}>Play again from the start</button>
              </p>
            </div>
            <div className="town-win-chat">
              <ChatFull embedded />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
