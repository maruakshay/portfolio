"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: a faint dot grid plus a cloud of particles that drift in
 * from scatter and settle into a layered neural-network pattern. Pulses travel
 * along the edges; the cursor gently pushes particles and lights the grid.
 * Plain 2D canvas, no dependencies. Pauses off-screen and in hidden tabs;
 * reduced motion draws the settled network once.
 */

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // target, in 0..1 network space
  ty: number;
  r: number;
  a: number;
  delay: number;
  node: boolean;
}

interface Edge {
  a: number; // node index
  b: number;
}

const LAYERS = [3, 5, 7, 7, 5, 3];
const INK = "242, 236, 226";

function rand(seed: number) {
  // Small deterministic PRNG so layouts are stable between renders.
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = rand(7);

    let w = 0;
    let h = 0;
    let dpr = 1;
    // Network box in CSS pixels
    let bx = 0;
    let by = 0;
    let bw = 0;
    let bh = 0;
    let gridAlpha = 1;

    // Build network: nodes per layer, and dots sampled along edges.
    const nodes: { tx: number; ty: number }[] = [];
    LAYERS.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const tx = li / (LAYERS.length - 1);
        const ty = count === 1 ? 0.5 : 0.5 + (i - (count - 1) / 2) * (1 / 7.2);
        nodes.push({ tx, ty: ty + (rnd() - 0.5) * 0.02 });
      }
    });
    const edges: Edge[] = [];
    let offset = 0;
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const next = offset + LAYERS[li];
      for (let i = 0; i < LAYERS[li]; i++) {
        for (let j = 0; j < LAYERS[li + 1]; j++) {
          // Keep it sparse: connect to nearby nodes in the next layer.
          const ri = i / Math.max(1, LAYERS[li] - 1);
          const rj = j / Math.max(1, LAYERS[li + 1] - 1);
          if (Math.abs(ri - rj) < 0.42) edges.push({ a: offset + i, b: next + j });
        }
      }
      offset = next;
    }

    const parts: P[] = [];
    const isSmall = window.innerWidth < 768;
    const perEdge = isSmall ? 3 : 6;
    nodes.forEach((n) => {
      parts.push({
        x: 0, y: 0, vx: 0, vy: 0,
        tx: n.tx, ty: n.ty, r: 2.4, a: 0.95, delay: rnd() * 0.5, node: true,
      });
    });
    edges.forEach((e) => {
      const A = nodes[e.a];
      const B = nodes[e.b];
      for (let k = 1; k <= perEdge; k++) {
        const t = k / (perEdge + 1) + (rnd() - 0.5) * 0.06;
        parts.push({
          x: 0, y: 0, vx: 0, vy: 0,
          tx: A.tx + (B.tx - A.tx) * t + (rnd() - 0.5) * 0.008,
          ty: A.ty + (B.ty - A.ty) * t + (rnd() - 0.5) * 0.012,
          r: 0.9 + rnd() * 0.6, a: 0.28 + rnd() * 0.3, delay: 0.2 + rnd() * 1.1, node: false,
        });
      }
    });
    // Ambient dust that never joins the network
    const dustCount = isSmall ? 40 : 90;
    const dust = Array.from({ length: dustCount }, () => ({
      x: rnd(), y: rnd(), s: 0.4 + rnd() * 0.9, ph: rnd() * Math.PI * 2,
    }));

    // Pulses: travel node→node along an edge
    const pulses: { e: number; t: number; v: number }[] = [];

    const mouse = { x: -9999, y: -9999, on: false };

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w >= 1024) {
        bw = Math.min(w * 0.46, 680);
        bh = Math.min(h * 0.62, 560);
        bx = w - bw - Math.max(48, w * 0.06);
        by = (h - bh) / 2;
        gridAlpha = 1;
      } else {
        // Small screens: a low band under the CTAs, kept faint.
        bw = w * 0.9;
        bh = Math.min(h * 0.18, 150);
        bx = w * 0.05;
        by = h - bh - 72;
        gridAlpha = 0.55;
      }
    }

    function scatter() {
      for (const p of parts) {
        p.x = bx + bw / 2 + (rnd() - 0.5) * w * 0.9;
        p.y = by + bh / 2 + (rnd() - 0.5) * h * 0.9;
        p.vx = 0;
        p.vy = 0;
      }
    }

    function settle() {
      for (const p of parts) {
        p.x = bx + p.tx * bw;
        p.y = by + p.ty * bh;
      }
    }

    layout();
    if (reduce) settle();
    else scatter();

    const start = performance.now();
    let raf = 0;
    let running = false;
    let last = start;

    function draw(now: number) {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, w, h);

      // 1. Dot grid, brighter near the cursor
      const gap = 28;
      for (let gx = gap / 2; gx < w; gx += gap) {
        for (let gy = gap / 2; gy < h; gy += gap) {
          let a = 0.07;
          if (mouse.on) {
            const d = Math.hypot(gx - mouse.x, gy - mouse.y);
            if (d < 180) a += (1 - d / 180) * 0.35;
          }
          ctx!.fillStyle = `rgba(${INK}, ${a * gridAlpha})`;
          ctx!.fillRect(gx - 0.6, gy - 0.6, 1.2, 1.2);
        }
      }

      // 2. Dust
      for (const d of dust) {
        const x = d.x * w + Math.sin(t * 0.15 + d.ph) * 12;
        const y = d.y * h + Math.cos(t * 0.12 + d.ph) * 10;
        ctx!.fillStyle = `rgba(${INK}, ${0.12 * d.s})`;
        ctx!.fillRect(x, y, d.s * 1.4, d.s * 1.4);
      }

      // 3. Network edges, fading in once particles have settled
      const form = reduce ? 1 : Math.min(1, Math.max(0, (t - 1.2) / 1.6));
      if (form > 0) {
        ctx!.lineWidth = 0.6;
        ctx!.strokeStyle = `rgba(${INK}, ${0.07 * form})`;
        ctx!.beginPath();
        for (const e of edges) {
          const A = parts[e.a];
          const B = parts[e.b];
          ctx!.moveTo(A.x, A.y);
          ctx!.lineTo(B.x, B.y);
        }
        ctx!.stroke();
      }

      // 4. Particles: spring to target, pushed by cursor
      for (const p of parts) {
        const tx = bx + p.tx * bw + (reduce ? 0 : Math.sin(t * 0.6 + p.ty * 12) * 1.5);
        const ty = by + p.ty * bh + (reduce ? 0 : Math.cos(t * 0.5 + p.tx * 9) * 1.5);
        if (!reduce) {
          const live = t > p.delay;
          const k = live ? 9 : 0.4;
          p.vx += (tx - p.x) * k * dt;
          p.vy += (ty - p.y) * k * dt;
          if (mouse.on) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 120 * 120 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / 120) * 900 * dt;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
          }
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx * dt * 6;
          p.y += p.vy * dt * 6;
        }
        let a = p.a;
        if (mouse.on) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < 160) a = Math.min(1, a + (1 - d / 160) * 0.5);
        }
        ctx!.fillStyle = `rgba(${INK}, ${a * (gridAlpha < 1 ? 0.7 : 1)})`;
        if (p.node) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.strokeStyle = `rgba(${INK}, ${0.18 * form})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
          ctx!.stroke();
        } else {
          ctx!.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
        }
      }

      // 5. Signal pulses moving forward through the layers
      if (!reduce && form >= 1) {
        if (pulses.length < 10 && Math.random() < 0.06) {
          pulses.push({ e: Math.floor(Math.random() * edges.length), t: 0, v: 0.6 + Math.random() * 0.6 });
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const pu = pulses[i];
          pu.t += pu.v * dt;
          const e = edges[pu.e];
          const A = parts[e.a];
          const B = parts[e.b];
          if (pu.t >= 1) {
            // Continue into the next layer when possible
            const nextEdges = edges.map((x, idx) => (x.a === e.b ? idx : -1)).filter((x) => x >= 0);
            if (nextEdges.length) {
              pu.e = nextEdges[Math.floor(Math.random() * nextEdges.length)];
              pu.t = 0;
            } else pulses.splice(i, 1);
            continue;
          }
          const x = A.x + (B.x - A.x) * pu.t;
          const y = A.y + (B.y - A.y) * pu.t;
          const g = ctx!.createRadialGradient(x, y, 0, x, y, 7);
          g.addColorStop(0, `rgba(${INK}, 0.9)`);
          g.addColorStop(1, `rgba(${INK}, 0)`);
          ctx!.fillStyle = g;
          ctx!.fillRect(x - 7, y - 7, 14, 14);
        }
      }
    }

    function loop(now: number) {
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    if (reduce) draw(performance.now());
    else play();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) play();
      else pause();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        layout();
        if (reduce) {
          settle();
          draw(performance.now());
        }
      }, 120);
    };
    window.addEventListener("resize", onResize);

    const parent = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
      if (reduce) draw(performance.now());
    };
    const onLeave = () => {
      mouse.on = false;
      mouse.x = mouse.y = -9999;
      if (reduce) draw(performance.now());
    };
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
