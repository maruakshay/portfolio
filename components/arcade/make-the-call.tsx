"use client";

import { useState } from "react";
import { Check, X, ArrowRight, Flame } from "lucide-react";
import { useAchievements } from "../achievements";
import { GameResult } from "./shared";

// Real decisions from real projects. The visitor makes the call, then sees
// what Akshay chose, why, and what happened.
type Round = {
  where: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  result: string;
};

const ROUNDS: Round[] = [
  {
    where: "miii-cli · coding agent",
    prompt: "Your coding agent can run shell commands on a user's machine. How do you handle consent?",
    options: [
      "Ask before every single command",
      "Auto-approve; users can always undo",
      "Gate every edit and command, but let approvals persist as rules",
    ],
    answer: 2,
    why: "An agent that can run bash needs a real consent model, not a yes-to-everything prompt. Persistent rules keep it safe without nagging people into clicking “yes” blindly.",
    result: "Shipped in miii-cli, alongside path confinement and checkpoints you can rewind.",
  },
  {
    where: "Remote Leaps · AI resume SaaS",
    prompt: "The AI resume writer sometimes invents jobs candidates never had. What do you do?",
    options: [
      "Switch to a bigger model",
      "Constrain generation to the candidate's real facts, then score every output with a fine-tuned model",
      "Add “do not make things up” to the prompt",
    ],
    answer: 1,
    why: "Bigger models still hallucinate, and prompts are wishes, not guarantees. Constrained decoding removes the option to invent; a scoring model catches what slips through.",
    result: "A zero-hallucination engine. Interview conversion up 35%. 40K+ users, then an acquisition.",
  },
  {
    where: "JupiterOne · Juno, enterprise AI assistant",
    prompt: "Enterprise users say the AI assistant feels slow, even though the answers are good.",
    options: [
      "Stream tokens over SSE and render live tables as the data arrives",
      "Move to bigger, faster instances",
      "Design a better loading spinner",
    ],
    answer: 0,
    why: "Perceived speed is about time to first useful thing on screen. Streaming turns a 10-second wait into instant progress.",
    result: "Juno shipped on AWS Bedrock with SSE streaming and cut support resolution time 35%.",
  },
  {
    where: "JupiterOne · LLMOps",
    prompt: "Prompts keep growing as conversations get longer, and so does the bill.",
    options: [
      "Drop the oldest messages",
      "Accept the cost; quality matters more",
      "Cache aggressively and summarise history hierarchically, token-aware",
    ],
    answer: 2,
    why: "Truncation silently loses context the model needs. Hierarchical summaries keep the meaning and drop the tokens.",
    result: "Prompt load down roughly 45%, with an eval pipeline (RAGAS + Braintrust) watching quality.",
  },
  {
    where: "miii-cli · model choice",
    prompt: "Which model should your coding agent run on?",
    options: [
      "Whatever tops the public leaderboard",
      "Grade the candidates on real agent tasks, in your own setup, first",
      "The cheapest one that answers",
    ],
    answer: 1,
    why: "Benchmarks measure benchmarks. The only score that matters is whether the model finishes your agent's tasks.",
    result: "That became `miii doctor`: pick a model by evidence, not marketing.",
  },
  {
    where: "mii-ai-security · team practice",
    prompt: "Your team keeps shipping LLM features with security as an afterthought.",
    options: [
      "Write a security policy document",
      "Add a security review before each launch",
      "Turn security into skills: framework-native controls mapped to OWASP, with tests and red-team fixtures",
    ],
    answer: 2,
    why: "Policies get skimmed; launch gates get skipped under pressure. Controls that live in the framework you use, with tests, actually get applied.",
    result: "Open-sourced as mii-ai-security: 58 skills across 12 domains.",
  },
];

export function MakeTheCall() {
  const { unlock } = useAchievements();
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const r = ROUNDS[round];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === r.answer) {
      setHits((h) => h + 1);
      setStreak((s) => s + 1);
    } else setStreak(0);
  }

  function next() {
    if (round === ROUNDS.length - 1) {
      setDone(true);
      unlock("thinker");
      return;
    }
    setRound((n) => n + 1);
    setPicked(null);
  }

  function replay() {
    setRound(0);
    setPicked(null);
    setHits(0);
    setStreak(0);
    setDone(false);
  }

  if (done) {
    const verdict =
      hits >= 5 ? "You two would ship fast together." : hits >= 3 ? "Solid instincts. He'd sharpen the rest." : "That's exactly why you'd want him in the room.";
    return (
      <GameResult
        kicker={`Make the call · ${hits}/${ROUNDS.length}`}
        title={
          <>
            You think <em className="text-volt">{Math.round((hits / ROUNDS.length) * 100)}%</em> like Akshay.
          </>
        }
        context={`I played "Make the call" on your portfolio and matched ${hits}/${ROUNDS.length}. I'd like to hear how you'd approach our problems.`}
        onReplay={replay}
      >
        {verdict} Every scenario was a real call on a real product, and every outcome above actually shipped.
        Bring him one of yours.
      </GameResult>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1.5" aria-label={`Round ${round + 1} of ${ROUNDS.length}`}>
          {ROUNDS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i < round ? "bg-volt" : i === round ? "bg-ink" : "bg-canvas-shade"
              }`}
            />
          ))}
        </div>
        {streak >= 2 && (
          <span key={streak} className="inline-flex items-center gap-1 font-mono text-xs text-hot [animation:pop_360ms_var(--ease-spring)]">
            <Flame className="size-3.5" aria-hidden /> {streak} streak
          </span>
        )}
      </div>

      <p className="label mt-8 text-flare">{r.where}</p>
      <h3 className="mt-3 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-ink">{r.prompt}</h3>
      <p className="mt-2 text-sm text-ink-faint">What would you ship?</p>

      <ul className="mt-6 grid gap-3">
        {r.options.map((o, i) => {
          const isAnswer = i === r.answer;
          const isPicked = i === picked;
          const state =
            picked === null
              ? "border-rule hover:border-volt hover:bg-volt/5"
              : isAnswer
                ? "border-volt bg-volt/10"
                : isPicked
                  ? "border-hot/60 bg-hot/10 [animation:shake_300ms]"
                  : "border-rule opacity-50";
          return (
            <li key={o}>
              <button
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`flex w-full items-center gap-4 rounded-sm border px-4 py-4 text-left text-ink transition-colors ${state}`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-current font-mono text-xs text-ink-faint">
                  {picked !== null && isAnswer ? (
                    <Check className="size-4 text-volt" aria-label="Akshay's call" />
                  ) : picked !== null && isPicked ? (
                    <X className="size-4 text-hot" aria-label="Your pick" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {o}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="mt-6 rounded-sm border border-rule bg-canvas p-5 [animation:pop_360ms_var(--ease-spring)]" aria-live="polite">
          <p className={`label ${picked === r.answer ? "text-volt" : "text-hot"}`}>
            {picked === r.answer ? "Same call Akshay made" : "Akshay went the other way"}
          </p>
          <p className="mt-2 text-ink">{r.why}</p>
          <p className="mt-3 border-l-2 border-volt pl-3 text-sm text-ink-muted">{r.result}</p>
          <button onClick={next} className="btn-primary mt-5">
            {round === ROUNDS.length - 1 ? "See your score" : "Next call"} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
