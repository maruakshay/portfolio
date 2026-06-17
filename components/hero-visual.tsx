"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

// How I think, as a signal network. Five first-principle nodes; an amber
// signal tours them in reasoning order. Hover/click a node to read the
// principle. Not decoration: the content is the point.
type Node = { k: string; n: string; q: string; a: string; x: number; y: number };

const NODES: Node[] = [
  {
    k: "WHY",
    n: "01",
    q: "Why build it",
    a: "Most AI demos die in production. I build the ones that survive contact with real users.",
    x: 130,
    y: 84,
  },
  {
    k: "WHAT",
    n: "02",
    q: "What to build",
    a: "The whole AI product, the streaming interface and the model behind it. Nothing thrown over a wall.",
    x: 446,
    y: 66,
  },
  {
    k: "WHO",
    n: "03",
    q: "Who it is for",
    a: "The person actually using it, not the demo audience. Human over impressive.",
    x: 766,
    y: 110,
  },
  {
    k: "HOW",
    n: "04",
    q: "How I work",
    a: "Show, don't tell. Specific decisions, real tradeoffs, code you can read on GitHub.",
    x: 250,
    y: 256,
  },
  {
    k: "WHEN",
    n: "05",
    q: "When to stop",
    a: "Knowing when to stop is the signal. Subtract before adding.",
    x: 668,
    y: 270,
  },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 4],
];

const TOUR = "M130,84 L446,66 L766,110 L668,270 L250,256 Z";

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Desktop: interactive constellation */}
      <div className="hidden md:block">
        <svg viewBox="0 0 900 340" className="h-auto w-full">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="var(--color-rule)"
              strokeDasharray={active === a || active === b ? "0" : "3 5"}
            />
          ))}

          {/* touring signal */}
          {!reduce && (
            <circle r={5} fill="var(--color-amber)">
              <animateMotion path={TOUR} dur="11s" repeatCount="indefinite" />
            </circle>
          )}

          {NODES.map((node, i) => {
            const on = active === i;
            return (
              <g
                key={node.k}
                role="button"
                tabIndex={0}
                aria-label={`${node.k}: ${node.a}`}
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActive(i);
                }}
                className="cursor-pointer focus:outline-none"
              >
                <rect x={node.x - 16} y={node.y - 16} width={120} height={32} fill="transparent" />
                <rect
                  x={node.x - 6}
                  y={node.y - 6}
                  width={12}
                  height={12}
                  fill={on ? "var(--color-amber)" : "var(--color-surface)"}
                  stroke="var(--color-amber)"
                />
                <text
                  x={node.x + 16}
                  y={node.y - 4}
                  fill="var(--color-paper-faint)"
                  style={{ font: "500 10px var(--font-mono)", letterSpacing: "0.08em" }}
                >
                  {node.n}
                </text>
                <text
                  x={node.x + 16}
                  y={node.y + 10}
                  fill={on ? "var(--color-amber)" : "var(--color-paper)"}
                  style={{ font: "500 15px var(--font-mono)", letterSpacing: "0.04em" }}
                >
                  {node.k}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          aria-live="polite"
          className="border-t border-rule px-6 py-5"
        >
          <p className="label text-amber">
            {NODES[active].n} / {NODES[active].k}
            <span className="text-paper-faint"> — {NODES[active].q}</span>
          </p>
          <p className="prose-mono mt-2 text-[0.9375rem] leading-[1.6] text-paper">
            {NODES[active].a}
          </p>
        </div>
      </div>

      {/* Mobile: stacked principles, all visible */}
      <ol className="md:hidden">
        {NODES.map((node) => (
          <li key={node.k} className="border-t border-rule px-5 py-4 first:border-t-0">
            <p className="label text-amber">
              {node.n} / {node.k}
              <span className="text-paper-faint"> — {node.q}</span>
            </p>
            <p className="prose-mono mt-1.5 text-[0.875rem] leading-[1.6] text-paper-muted">
              {node.a}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
