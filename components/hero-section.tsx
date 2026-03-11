"use client";
import { motion } from "framer-motion";
import { NoiseBackground } from "./ui/noise-background";
import { useRouter } from "next/navigation";
import { Highlighter } from "./ui/highlighter";

const techStack = ["LangGraph", "RAG", "Claude", "ChromaDB"];

export const HeroSection = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative h-svh flex flex-col gap-6 items-center justify-center px-4"
    >
      <div className="text-center max-w-2xl space-y-2">
        <p className="text-black/50 md:text-3xl text-xl font-medium tracking-tight">
          Know everything about
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-black/70">
          <Highlighter
            action="underline"
            color="#ffd1dc"
            strokeWidth={4}
            animationDuration={1000}
            iterations={5}
            padding={2}
            multiline={true}
          >
            Akshay Maru
          </Highlighter>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex items-center gap-2 text-sm text-black/45"
      >
        <span className="tracking-wide">Powered by</span>
        <div className="flex items-center gap-1.5">
          {techStack.map((tech, index) => (
            <span key={tech} className="flex items-center gap-1.5">
              <span className="font-medium text-black/60">{tech}</span>
              {index < techStack.length - 1 && (
                <span className="text-black/30">·</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <NoiseBackground
        containerClassName="w-fit p-2 rounded-full mx-auto mt-4"
        gradientColors={[
          "rgb(255, 100, 150)",
          "rgb(100, 150, 255)",
          "rgb(255, 200, 100)",
        ]}
      >
        <button
          onClick={() => router.push("/chat")}
          className="group h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2.5 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-200 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
        >
          <span className="flex items-center gap-2 font-medium">
            Try the AI Assistant
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </NoiseBackground>
    </motion.div>
  );
};
