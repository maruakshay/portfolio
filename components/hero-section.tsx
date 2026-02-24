"use client";
import { motion } from "framer-motion";
import { NoiseBackground } from "./ui/noise-background";
import { useRouter } from "next/navigation";
import { Highlighter } from "./ui/highlighter";

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
      className="relative h-svh flex flex-col gap-4 items-center justify-center px-4"
    >
      <div className="text-4xl inline md:text-6xl font-bold text-black/65 text-center max-w-2xl">
        <p className="text-black/40 md:text-4xl text-2xl">
          Know everything about{" "}
        </p>
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
      </div>

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
          className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-2 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
        >
          Get started with Akshay's Assistant &rarr;
        </button>
      </NoiseBackground>

      <div className="flex flex-col items-center gap-3 mt-4">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs font-medium text-black/30 uppercase tracking-[0.2em]"
        >
          Try asking about
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
          {[
            "Experience",
            "Life",
            "Tech Stack",
            "Hobbies",
            "And much more",
          ].map((suggestion, i) => (
            <motion.span
              key={suggestion}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(0,0,0,0.05)",
                borderColor: "rgba(0,0,0,0.15)"
              }}
              className="px-4 py-1.5 rounded-full border border-black/5 bg-black/5 text-[11px] font-semibold text-black/50 cursor-default transition-all duration-300 hover:text-black/70"
            >
              {suggestion}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
