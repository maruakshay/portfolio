// Media kit copy for /brands. Numbers live in lib/instagram.ts.
import { profile } from "./content";

export const brandsHero = {
  label: "For brands",
  title: ["A real story,", "an audience that trusts it."],
  sub: "I live with cerebral palsy and a stammer, and I train anyway. I share that honestly on Instagram, so people don't just watch, they relate. A brand that shows up here shows up inside a story people believe.",
};

export const whyMe = [
  {
    t: "Trust, not just reach",
    d: "People follow for the honesty. A recommendation from me lands as advice from someone they know, not an ad.",
  },
  {
    t: "A niche few creators own",
    d: "Disability, stammering and fitness in one voice. Your brand reaches people big fitness pages miss.",
  },
  {
    t: "Inclusion people can see",
    d: "Partnering here shows your product works for every body, not just the ones in typical ads.",
  },
  {
    t: "I make it myself",
    d: "Idea, script, shoot and edit. One person, fast turnaround, and the content sounds like me, not a brief.",
  },
];

export const brandFits = [
  "Fitness & gym gear",
  "Supplements & nutrition",
  "Activewear & footwear",
  "Health & wellness apps",
  "Accessibility & adaptive products",
  "Physiotherapy & recovery",
  "Speech & confidence",
  "Tech & productivity",
];

export const offers = [
  { t: "Dedicated Reel", d: "A Reel built around your product, in my voice, woven into my training or story." },
  { t: "Story mentions", d: "Quick, direct story sets with a link. Good for launches and offers." },
  { t: "Honest review", d: "I use the product for real and share what works for a body like mine." },
  { t: "Long-term partner", d: "Ongoing content over months. The most trust, because the audience sees me actually use it." },
];

export function brandHref() {
  const subject = "Brand collaboration with @akshaay.lifts";
  const body = [
    "Hi Akshay,",
    "",
    "I'm reaching out from [brand]. We'd like to work with you on:",
    "",
    "Timeline / budget:",
    "",
  ].join("\n");
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
