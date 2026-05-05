import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { LoaderFive } from "./ui/loader";
import { markdownComponents } from "@/lib/utility";
import { useRouter, useSearchParams } from "next/navigation";

interface Message {
  role: "User" | "Assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "Assistant",
  content:
    "Hey, I'm Akshay's AI. Ask me anything about his background, projects, skills, or why you should work with him.",
};

export default function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialPromptSent, setInitialPromptSent] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!initialPromptSent) {
      const prompt = searchParams.get("prompt");
      if (prompt) {
        setInput(prompt);
        setInitialPromptSent(true);
        setTimeout(() => {
          handleSubmitWithMessage(prompt);
        }, 100);
      }
    }
  }, [searchParams, initialPromptSent]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  async function handleSubmitWithMessage(messageText: string) {
    if (messageText.trim() === "" || isLoading) return;

    const userMessage = { role: "User" as const, content: messageText };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { role: "Assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: last.content + text }];
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    handleSubmitWithMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#f8fafc] relative">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-[#e2e8f0] bg-white shrink-0"
      >
        <div>
          <h1
            className="font-bold text-[#0f172a]"
            style={{ fontSize: "1.0625rem", letterSpacing: "-0.02em" }}
          >
            Akshay Maru
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">AI Assistant</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors"
          aria-label="Back to home"
        >
          <X className="w-4 h-4 text-[#94a3b8]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-36 pt-6 px-5 md:px-8">
        <div className="max-w-2xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`flex w-full ${
                  message.role === "User" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 text-sm leading-relaxed ${
                    message.role === "User"
                      ? "bg-[#2563eb] text-white rounded-2xl rounded-br-[4px] [&_p]:text-white [&_li]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white"
                      : "bg-white text-[#0f172a] border border-[#e2e8f0] rounded-2xl rounded-bl-[4px]"
                  }`}
                  style={{
                    boxShadow:
                      message.role === "User"
                        ? "0 1px 3px rgba(37,99,235,0.20)"
                        : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {message.content ? (
                    <ReactMarkdown
                      components={{
                        ...markdownComponents(),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={
                              message.role === "User"
                                ? "underline hover:opacity-80"
                                : "text-[#2563eb] hover:text-[#1d4ed8] underline"
                            }
                          >
                            {children}
                          </a>
                        ),
                        code: ({ children }) => (
                          <code
                            className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                              message.role === "User"
                                ? "bg-blue-700/40"
                                : "bg-[#f1f5f9] text-[#0f172a]"
                            }`}
                          >
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <LoaderFive text="Thinking..." />
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "User" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full justify-start"
              >
                <div
                  className="bg-white px-4 py-3 rounded-2xl rounded-bl-[4px] border border-[#e2e8f0]"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <LoaderFive text="Thinking..." />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/95 to-transparent pt-6 pb-5 px-5 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div
            className="relative bg-white border border-[#e2e8f0] rounded-2xl transition-shadow duration-200 hover:border-[#cbd5e1]"
            style={{
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
            }}
          >
            <Textarea
              value={input || ""}
              placeholder="Ask about Akshay, his projects, or anything else..."
              rows={1}
              maxLength={500}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              className="bg-transparent rounded-2xl border-0 shadow-none focus:ring-0 focus:border-0 resize-none text-[#0f172a] placeholder:text-[#94a3b8] pr-14"
            />
            <Button
              variant="default"
              size="icon"
              disabled={input?.trim() === "" || isLoading}
              onClick={handleSubmit}
              className="absolute bottom-1 right-2.5 rounded-full h-9 w-9 transition-all duration-200"
              aria-label="Send message"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-center mt-2.5 text-xs text-[#94a3b8]">
            Powered by AI, built by Akshay
          </p>
        </div>
      </div>
    </div>
  );
}
