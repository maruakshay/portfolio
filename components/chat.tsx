import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { LoaderFive } from "./ui/loader";
import { markdownComponents } from "@/lib/utility";

interface Message {
  role: "User" | "Assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "Assistant",
      content:
        "Hello! I am Akshay Maru's Personal Assistant. I can answer questions about Akshay's life, academics, family, projects, experience, and hobbies. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  async function handleSubmit() {
    if (input.trim() === "" || isLoading) return;

    const userMessage = { role: "User" as const, content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          const lastMessage = prev[prev.length - 1];
          const otherMessages = prev.slice(0, prev.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }
  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex-1 overflow-y-auto pb-32 pt-4 px-4 md:px-0">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${message.role === "User" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-md border text-[14px] border-white/20 ${
                    message.role === "User"
                      ? "bg-white/50 text-black/80  rounded-br-sm"
                      : "bg-white/30 text-black/65 font-medium rounded-bl-sm"
                  }`}
                >
                  {message.content ? (
                    <ReactMarkdown components={markdownComponents()}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <LoaderFive text="Generating chat response..." />
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "User" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full justify-start"
              >
                <LoaderFive text="Generating chat response..." />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 backdrop-blur-md bg-white/30 py-4">
        <div className="max-w-3xl md:mx-auto mx-3  bg-white relative">
          <Textarea
            value={input || ""}
            placeholder="Ask anything about Akshay Maru"
            rows={1}
            maxLength={500}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
          />
          <Button
            variant="default"
            disabled={input?.trim() === "" || isLoading}
            size="icon"
            onClick={handleSubmit}
            className="absolute bottom-3 right-3 rounded-xl transition-all duration-300"
            aria-label="Submit"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-center mt-2 text-xs text-muted-foreground">
          Built By Akshay Maru
        </p>
      </div>
    </div>
  );
}
