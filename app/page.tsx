"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
   <AuroraBackground className="space-y-20 h-full">
      <HeroSection /> 
    </AuroraBackground> 
  );
}
