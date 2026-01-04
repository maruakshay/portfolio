'use client'
import { motion } from "framer-motion";
import { NoiseBackground } from "./ui/noise-background";
import { useRouter } from "next/navigation";
import { Highlighter } from "./ui/highlighter";

export const HeroSection = () => {
    const router = useRouter()
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
          <Highlighter  action="underline" color="#ffd1dc" strokeWidth={4} animationDuration={1000} iterations={5} padding={2} multiline={true}>
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
        <button onClick={() => router.push("/chat")} className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-2 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
          Get started with Akshay's Assistant &rarr;
        </button>
       
      </NoiseBackground>
       
      </motion.div>
    )
}