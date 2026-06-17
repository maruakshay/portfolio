"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
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
    "I'm Akshay's AI, grounded in his actual background. Ask about the JupiterOne work, the miii ecosystem, or whether he'd fit your team.",
};

const PROMPTS = [
  "What is the miii ecosystem?",
  "Tell me about the AI security work.",
  "Why hire Akshay?",
];

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
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
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask the AI about Akshay"}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 border border-rule bg-surface px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:border-amber md:bottom-6 md:right-6"
      >
        <span className={`mark ${open ? "" : "mark-blink"}`} aria-hidden />
        {open ? "Close" : "Ask the AI"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Ask Akshay's AI"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-20 right-5 z-50 flex h-[min(560px,70vh)] w-[min(384px,calc(100vw-2.5rem))] flex-col border border-rule bg-surface md:bottom-24 md:right-6"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-rule px-4 py-3">
              <span className="label flex items-center gap-2 text-paper-muted">
                <span className="mark" aria-hidden />
                AKSHAY.AI
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="-mr-2 inline-flex size-9 items-center justify-center text-paper-faint transition-colors hover:text-paper"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages — tight terminal log */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[0.8125rem] leading-[1.6]">
              {messages.map((m, i) =>
                m.role === "User" ? (
                  <p key={i} className="text-paper">
                    <span className="select-none text-amber" aria-hidden>
                      {"> "}
                    </span>
                    {m.content}
                  </p>
                ) : m.content ? (
                  <div
                    key={i}
                    className="prose-mono text-paper-muted [&_li]:mb-1 [&_p]:mb-2 [&_ul]:mb-2 [&_*:last-child]:mb-0"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span key={i} className="text-paper-faint">
                    <span className="mark mark-blink mr-1.5 align-middle" />
                    thinking
                  </span>
                ),
              )}

              {streaming &&
                messages[messages.length - 1]?.role === "User" && (
                  <span className="text-paper-faint">
                    <span className="mark mark-blink mr-1.5 align-middle" />
                    thinking
                  </span>
                )}

              {status === "error" && (
                <p className="border border-alert/40 px-3 py-2 text-[oklch(0.72_0.15_28)]">
                  Something broke on my end. Try again, or just email me.
                </p>
              )}

              {messages.length === 1 && status === "idle" && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="border border-rule px-3 py-2 text-left text-paper-muted transition-colors hover:border-amber hover:text-paper"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-rule p-3">
              <div className="flex items-end gap-1.5 border border-rule bg-ground transition-colors focus-within:border-amber">
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  maxLength={500}
                  aria-label="Ask Akshay's AI about his work"
                  placeholder="Ask about Akshay's work…"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.8125rem] text-paper placeholder:text-paper-faint focus:outline-none"
                  style={{ caretColor: "var(--color-amber)" }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || streaming}
                  aria-label="Send"
                  className="m-1.5 inline-flex size-8 shrink-0 items-center justify-center bg-amber text-ground transition-colors hover:bg-amber-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
