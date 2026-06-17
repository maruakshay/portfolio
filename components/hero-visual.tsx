"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// How I think, as a graph you can play with. Five first-principle nodes on
// springy edges: drag and fling them, the network reacts to your cursor,
// amber signals pulse through, and clicking a node opens its principle.
type P = { k: string; n: string; q: string; a: string; x: number; y: number };

const NODES: P[] = [
  { k: "WHY", n: "01", q: "Why build it", a: "Most AI demos die in production. I build the ones that survive contact with real users.", x: 0.16, y: 0.26 },
  { k: "WHAT", n: "02", q: "What to build", a: "The whole AI product, the streaming interface and the model behind it. Nothing thrown over a wall.", x: 0.5, y: 0.18 },
  { k: "WHO", n: "03", q: "Who it is for", a: "The person actually using it, not the demo audience. Human over impressive.", x: 0.84, y: 0.32 },
  { k: "HOW", n: "04", q: "How I work", a: "Show, don't tell. Specific decisions, real tradeoffs, code you can read on GitHub.", x: 0.3, y: 0.76 },
  { k: "WHEN", n: "05", q: "When to stop", a: "Knowing when to stop is the signal. Subtract before adding.", x: 0.74, y: 0.78 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [0, 2],
];

const C = { node: "#5c574f", edge: "#3a3631", amber: "#e7a23a", paper: "#efe9df", faint: "#a39d92", surface: "#2a2723" };

type Pt = { x: number; y: number; vx: number; vy: number; hx: number; hy: number };
type Sig = { a: number; b: number; t: number; sp: number };

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [active, setActiveState] = useState(0);
  const activeRef = useRef(0);
  const setActive = (i: number) => { activeRef.current = i; setActiveState(i); };
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    let pts: Pt[] = [];
    let rest: number[] = [];
    let sigs: Sig[] = [];
    let raf = 0;
    let acc = 0;
    let last = performance.now();

    const pointer = { x: -999, y: -999, inside: false };
    let drag = -1;
    let downAt = { x: 0, y: 0 };
    let moved = 0;
    let hover = -1;

    function layout() {
      const r = wrap!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`; canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const px = 70, py = 46;
      const mk = (n: P): Pt => ({
        hx: px + n.x * (w - px * 2), hy: py + n.y * (h - py * 2),
        x: px + n.x * (w - px * 2), y: py + n.y * (h - py * 2), vx: 0, vy: 0,
      });
      if (!pts.length) pts = NODES.map(mk);
      else pts.forEach((p, i) => { const m = mk(NODES[i]); p.hx = m.hx; p.hy = m.hy; });
      rest = EDGES.map(([a, b]) => Math.hypot(pts[a].hx - pts[b].hx, pts[a].hy - pts[b].hy));
    }

    function nearest(x: number, y: number) {
      let bi = -1, bd = Infinity;
      pts.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; bi = i; } });
      return { i: bi, d: Math.sqrt(bd) };
    }

    function step(dt: number) {
      // spring to home
      for (const p of pts) { p.vx += (p.hx - p.x) * 0.018; p.vy += (p.hy - p.y) * 0.018; }
      // edge springs
      EDGES.forEach(([a, b], i) => {
        const A = pts[a], B = pts[b];
        let dx = B.x - A.x, dy = B.y - A.y;
        const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
        const f = (d - rest[i]) * 0.02;
        A.vx += dx * f; A.vy += dy * f; B.vx -= dx * f; B.vy -= dy * f;
      });
      // node repulsion
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const A = pts[i], B = pts[j];
          let dx = A.x - B.x, dy = A.y - B.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 130) { dx /= d; dy /= d; const f = (130 - d) * 0.02; A.vx += dx * f; A.vy += dy * f; B.vx -= dx * f; B.vy -= dy * f; }
        }
      // integrate
      pts.forEach((p, i) => {
        if (i === drag) { p.vx = 0; p.vy = 0; return; }
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
        p.x = Math.max(20, Math.min(w - 20, p.x));
        p.y = Math.max(20, Math.min(h - 20, p.y));
      });
      // signals
      acc += dt;
      if (acc > 0.6) { acc = 0; const e = EDGES[(Math.random() * EDGES.length) | 0]; sigs.push({ a: Math.random() < 0.5 ? e[0] : e[1], b: Math.random() < 0.5 ? e[1] : e[0], t: 0, sp: 0.8 + Math.random() * 0.7 }); }
      sigs.forEach((s) => (s.t += dt * s.sp));
      sigs = sigs.filter((s) => s.t < 1);
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const act = activeRef.current;
      // edges
      EDGES.forEach(([a, b]) => {
        const on = act === a || act === b || hover === a || hover === b;
        ctx!.beginPath();
        ctx!.moveTo(pts[a].x, pts[a].y); ctx!.lineTo(pts[b].x, pts[b].y);
        ctx!.strokeStyle = on ? C.amber : C.edge;
        ctx!.globalAlpha = on ? 0.5 : 1; ctx!.lineWidth = 1; ctx!.stroke(); ctx!.globalAlpha = 1;
      });
      // signals
      ctx!.shadowColor = C.amber; ctx!.shadowBlur = 10;
      for (const s of sigs) {
        const A = pts[s.a], B = pts[s.b];
        const x = A.x + (B.x - A.x) * s.t, y = A.y + (B.y - A.y) * s.t;
        ctx!.beginPath(); ctx!.arc(x, y, 3, 0, 7); ctx!.fillStyle = C.amber; ctx!.fill();
      }
      ctx!.shadowBlur = 0;
      // nodes
      pts.forEach((p, i) => {
        const on = act === i; const hv = hover === i;
        ctx!.fillStyle = on ? C.amber : C.surface;
        ctx!.strokeStyle = C.amber; ctx!.lineWidth = 1;
        const s = on || hv ? 7 : 6;
        ctx!.beginPath(); ctx!.rect(p.x - s, p.y - s, s * 2, s * 2); ctx!.fill(); ctx!.stroke();
        ctx!.textBaseline = "middle";
        const right = p.x < w * 0.62;
        ctx!.textAlign = right ? "left" : "right";
        const lx = right ? p.x + 14 : p.x - 14;
        ctx!.fillStyle = C.faint;
        ctx!.font = "500 10px ui-monospace, monospace";
        ctx!.fillText(NODES[i].n, lx, p.y - 6);
        ctx!.fillStyle = on ? C.amber : C.paper;
        ctx!.font = "600 14px ui-monospace, monospace";
        ctx!.fillText(NODES[i].k, lx, p.y + 7);
        ctx!.textAlign = "left";
      });
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      step(dt); draw();
      raf = requestAnimationFrame(loop);
    }

    function rel(e: PointerEvent) { const r = canvas!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function onMove(e: PointerEvent) {
      const m = rel(e); pointer.x = m.x; pointer.y = m.y; pointer.inside = true;
      if (drag >= 0) { moved += Math.hypot(m.x - downAt.x, m.y - downAt.y); pts[drag].x = m.x; pts[drag].y = m.y; downAt = m; }
      else {
        const { i, d } = nearest(m.x, m.y);
        const nh = d < 80 ? i : -1;
        if (nh !== hover) { hover = nh; if (nh >= 0) setActive(nh); }
        canvas!.style.cursor = nh >= 0 ? "grab" : "default";
      }
    }
    function onDown(e: PointerEvent) {
      const m = rel(e); const { i, d } = nearest(m.x, m.y);
      if (i >= 0 && d < 80) { drag = i; downAt = m; moved = 0; setActive(i); canvas!.style.cursor = "grabbing"; canvas!.setPointerCapture(e.pointerId); }
    }
    function onUp(e: PointerEvent) {
      if (drag >= 0) {
        if (moved < 6) setActive(drag);
        else { pts[drag].vx = 0; pts[drag].vy = 0; }
        canvas!.style.cursor = "grab";
      }
      drag = -1;
      try { canvas!.releasePointerCapture(e.pointerId); } catch {}
    }
    function onLeave() { pointer.inside = false; hover = -1; }

    layout();
    if (reduce) { draw(); const ro = new ResizeObserver(() => { layout(); draw(); }); ro.observe(wrap);
      canvas.addEventListener("pointerdown", (e) => { const m = rel(e); const { i, d } = nearest(m.x, m.y); if (i >= 0 && d < 80) setActive(i); });
      return () => ro.disconnect();
    }
    raf = requestAnimationFrame(loop);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div>
      <div ref={wrapRef} className="h-72 w-full md:h-85">
        <canvas ref={canvasRef} className="block" style={{ touchAction: "pan-y" }} />
      </div>
      <div aria-live="polite" className="border-t border-rule px-5 py-5 md:px-6">
        <p className="label text-amber">
          {NODES[active].n} / {NODES[active].k}
          <span className="text-paper-faint"> — {NODES[active].q}</span>
        </p>
        <p className="prose-mono mt-2 text-[0.9375rem] leading-[1.6] text-paper">
          {NODES[active].a}
        </p>
      </div>
    </div>
  );
}
