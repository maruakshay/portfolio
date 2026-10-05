"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "User" | "Assistant";
  content: string;
}

type Status = "idle" | "streaming" | "error";

const INITIAL: Message = {
  role: "Assistant",
  content:
    "I'm Akshay's AI, grounded in his actual background. Ask about Commotion, the JupiterOne work, miii, the AI security framework, how he leads teams, or whether he'd fit yours.",
};

const PROMPTS = [
  "What is miii, the Claude Code alternative?",
  "Walk me through the JupiterOne work.",
  "How does Akshay lead engineering teams?",
  "Why should I hire Akshay?",
];

export function ChatFull() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();

  const streaming = status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [messages, reduce]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const next = [...messages, { role: "User" as const, content: trimmed }];
      setMessages(next);
      setInput("");
      setStatus("streaming");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        if (!res.ok || !res.body) throw new Error("bad response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        setMessages((p) => [...p, { role: "Assistant", content: "" }]);

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((p) => {
            const last = p[p.length - 1];
            return [...p.slice(0, -1), { ...last, content: last.content + chunk }];
          });
        }
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [messages, streaming],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-58px)] flex-col">
      {/* Log */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-5 py-10 text-[1.0625rem] leading-[1.65] md:px-8">
          <div className="text-center">
            <p className="label text-sanguine">{"// "}ask_akshay.ai</p>
            <p className="mt-1 font-display text-lg italic text-ink-faint">
              A conversation with the portfolio
            </p>
          </div>
          {messages.map((m, i) =>
            m.role === "User" ? (
              <p key={i} className="border-l border-sanguine pl-4 text-ink">
                <span className="label mb-1 block text-sanguine">You</span>
                {m.content}
              </p>
            ) : m.content ? (
              <div
                key={i}
                className="prose-folio text-ink-muted [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_*:last-child]:mb-0"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            ) : (
              <span key={i} className="label normal-case tracking-normal">
                <span className="mark mark-blink mr-2.5 align-middle" />
                thinking
              </span>
            ),
          )}

          {streaming && messages[messages.length - 1]?.role === "User" && (
            <span className="label normal-case tracking-normal">
              <span className="mark mark-blink mr-2.5 align-middle" />
              thinking
            </span>
          )}

          {status === "error" && (
            <p className="border border-sanguine/50 bg-sanguine/5 px-3 py-2 text-sanguine-deep">
              Something broke on my end. Try again, or just email me.
            </p>
          )}

          {messages.length === 1 && status === "idle" && (
            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="border border-rule bg-canvas/60 px-3 py-2.5 text-left text-ink-muted transition-colors hover:border-sanguine hover:text-sanguine"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-rule bg-canvas-deep/50">
        <div className="mx-auto max-w-2xl px-5 py-4 md:px-8">
          <div className="flex items-end gap-1.5 border border-rule bg-canvas transition-colors focus-within:border-sanguine">
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              maxLength={500}
              aria-label="Ask Akshay's AI about his work"
              placeholder="Ask about Akshay's work…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="min-h-11 flex-1 resize-none bg-transparent px-3.5 py-3 text-[1.0625rem] text-ink placeholder:italic placeholder:text-ink-faint focus:outline-none"
              style={{ caretColor: "var(--color-sanguine)" }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              aria-label="Send"
              className="m-1.5 inline-flex size-9 shrink-0 items-center justify-center bg-sanguine text-canvas transition-colors hover:bg-sanguine-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
          <p className="label mt-2.5 text-ink-faint">
            grounded in Akshay&apos;s résumé · no fabrication
          </p>
        </div>
      </div>
    </div>
  );
}
