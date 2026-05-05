"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const suggestedPrompts = [
  "What has Akshay built?",
  "Why hire Akshay as Engineering Manager?",
  "Show technical depth",
  "What makes Akshay different?",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const HeroSection = () => {
  const router = useRouter();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col px-5 md:px-8 lg:px-12"
    >
      {/* Site header */}
      <motion.header
        variants={item}
        className="pt-8 md:pt-10 w-full max-w-5xl mx-auto flex items-center justify-between"
      >
        <span
          className="text-sm font-bold text-[#0f172a]"
          style={{ letterSpacing: "-0.015em" }}
        >
          Akshay Maru
        </span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff6ff] border border-[#e2e8f0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
          <span className="text-xs font-medium text-[#1e40af] whitespace-nowrap">
            Available for opportunities
          </span>
        </div>
      </motion.header>

      {/* Main content — left-aligned within constrained column */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto pb-12 pt-16 md:pt-20">

        {/* Headline */}
        <motion.div variants={item}>
          <h1
            className="font-bold text-[#0f172a]"
            style={{
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            Founder turned
            <span className="block text-[#2563eb]">AI Product Builder</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 md:mt-7 text-base md:text-lg text-[#475569] leading-relaxed"
          style={{ maxWidth: "46ch" }}
        >
          Building secure, production-grade AI that doesn't break in the real world. Founded & exited an AI SaaS (40K users, 25 countries). Specialized in LLM security, RAG hardening & fine-tuning.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mt-9 md:mt-11">
          <button
            onClick={() => router.push("/chat")}
            className="group inline-flex items-center gap-2 px-7 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-px"
            style={{
              boxShadow:
                "0 1px 3px rgba(37,99,235,0.18), 0 1px 2px rgba(37,99,235,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 20px -4px rgba(37,99,235,0.40), 0 2px 6px rgba(37,99,235,0.20)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 1px 3px rgba(37,99,235,0.18), 0 1px 2px rgba(37,99,235,0.12)";
            }}
          >
            Talk to My AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

        {/* Suggested prompts */}
        <motion.div variants={item} className="mt-14 md:mt-16">
          <p className="text-xs font-medium text-[#94a3b8] mb-3 uppercase tracking-wide"
             style={{ letterSpacing: "0.06em" }}>
            Try asking
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
                }
                className="px-4 py-3 text-left text-sm rounded-xl bg-white border border-[#e2e8f0] hover:border-[#93c5fd] hover:bg-[#eff6ff] text-[#475569] hover:text-[#1d4ed8] transition-all duration-200"
                style={{
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
