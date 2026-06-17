"use client";

import { useReducedMotion } from "framer-motion";

// A detailed read of the actual work: a production inference pipeline.
// prompt -> streaming UI -> guardrails -> agent -> RAG -> model, then tokens
// stream back. Real component names, an amber signal running the full loop.

const STAGES = [
  { l1: "INPUT", l2: "user prompt" },
  { l1: "INTERFACE", l2: "React · streaming" },
  { l1: "GUARDRAILS", l2: "injection defense" },
  { l1: "AGENT", l2: "LangGraph · tools" },
  { l1: "RETRIEVAL", l2: "hybrid RAG" },
  { l1: "MODEL", l2: "Bedrock · local" },
];

const X0 = 20;
const STEP = 166;
const BW = 130;
const BY = 64;
const BH = 96;
const MID = BY + BH / 2; // 112
const cx = (i: number) => X0 + i * STEP + BW / 2;

// dot route: forward midline, then the visible return arc, back into INTERFACE
const DOT_PATH = `M${cx(0)},${MID} L${cx(5)},${MID} L${cx(5)},${BY + BH} C1010,${BY + BH} 1010,250 ${cx(5)},250 L${cx(1)},250 C190,250 190,${BY + BH} ${cx(1)},${BY + BH} L${cx(1)},${MID}`;
const ARC_PATH = `M${cx(5)},${BY + BH} C1010,${BY + BH} 1010,250 ${cx(5)},250 L${cx(1)},250 C190,250 190,${BY + BH} ${cx(1)},${BY + BH}`;

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1000 300"
      className="h-auto w-full"
      role="img"
      aria-label="Akshay's production inference pipeline: a user prompt enters a React streaming interface, passes prompt-injection guardrails, a LangGraph agent, hybrid RAG retrieval, and the model (Bedrock or local), then tokens stream back to the interface. He builds AI products end to end."
    >
      {/* forward rail (behind boxes) */}
      <line x1={cx(0)} y1={MID} x2={cx(5)} y2={MID} stroke="var(--color-rule)" />

      {/* return arc */}
      <path d={ARC_PATH} fill="none" stroke="var(--color-rule)" strokeDasharray="3 4" />
      <text
        x={(cx(1) + cx(5)) / 2}
        y={268}
        textAnchor="middle"
        fill="var(--color-paper-faint)"
        style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.08em" }}
      >
        STREAM TOKENS BACK
      </text>

      {/* tokens streaming back along the arc */}
      {!reduce &&
        [720, 540, 360].map((x, i) => (
          <rect key={x} x={x} y={246} width={8} height={8} fill="var(--color-amber)">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.6s"
              begin={`${i * 0.45}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}

      {/* stage nodes */}
      {STAGES.map((s, i) => {
        const x = X0 + i * STEP;
        const isModel = i === 5;
        return (
          <g key={s.l1}>
            <rect
              x={x}
              y={BY}
              width={BW}
              height={BH}
              fill="var(--color-surface)"
              stroke={isModel ? "var(--color-amber)" : "var(--color-rule)"}
            />
            <rect x={x + 12} y={BY + 16} width={6} height={6} fill="var(--color-amber)" />
            {isModel && !reduce && (
              <rect x={x + 12} y={BY + 16} width={6} height={6} fill="var(--color-amber)">
                <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" repeatCount="indefinite" />
              </rect>
            )}
            <text
              x={x + 12}
              y={BY + 50}
              fill="var(--color-paper)"
              style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.04em" }}
            >
              {s.l1}
            </text>
            <text
              x={x + 12}
              y={BY + 70}
              fill="var(--color-paper-faint)"
              style={{ font: "400 10.5px var(--font-mono)" }}
            >
              {s.l2}
            </text>
            <text
              x={x + BW - 12}
              y={BY + 22}
              textAnchor="end"
              fill="var(--color-paper-faint)"
              style={{ font: "500 10px var(--font-mono)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}

      {/* amber signal running the full request/response loop */}
      <circle r={5} fill="var(--color-amber)" cx={reduce ? cx(3) : 0} cy={reduce ? MID : 0}>
        {!reduce && (
          <animateMotion path={DOT_PATH} dur="5.2s" repeatCount="indefinite" rotate="0" />
        )}
      </circle>
    </svg>
  );
}
