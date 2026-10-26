"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { callHref } from "@/lib/content";
import { useAchievements } from "./achievements";

const SECTIONS = ["approach", "work", "arcade", "miii", "career", "contact"];

/**
 * Tracks the visit through the home page: awards "Full tour" once every
 * section has been on screen, and floats a call button once the hero's own
 * CTA has scrolled away (hidden again at the contact section, which has its own).
 */
export function Journey() {
  const { unlock } = useAchievements();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const seen = new Set<string>();
    let contactVisible = false;
    const update = () => setShowCta(window.scrollY > window.innerHeight * 0.9 && !contactVisible);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          if (e.target.id === "contact") contactVisible = e.isIntersecting;
        }
        update();
        if (SECTIONS.every((s) => seen.has(s))) unlock("explorer");
      },
      { threshold: 0.15 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [unlock]);

  return (
    <a
      href={callHref()}
      target={callHref().startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={() => unlock("contact")}
      aria-hidden={!showCta}
      tabIndex={showCta ? 0 : -1}
      className={`btn-primary fixed bottom-5 left-5 z-30 shadow-[0_12px_40px_-10px_oklch(0.92_0.21_125/0.6)] transition-all duration-300 ${
        showCta ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Phone className="size-4" aria-hidden /> Book a 20-min call
    </a>
  );
}
