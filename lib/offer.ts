// ─────────────────────────────────────────────────────────────────────────
// EDIT ME: services, availability and testimonials.
// Anything in [BRACKETS] is a placeholder that still needs a real value.
// ─────────────────────────────────────────────────────────────────────────

/** Small line under the hero CTAs, with a green dot. */
export const availability = "Taking 2 new projects a month.";

export interface Plan {
  name: string;
  /** Short meta line: timeline. */
  meta: string;
  includes: string[];
  /** Optional "You get" deliverable line. */
  deliverable?: string;
  cta: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Production Trust Audit",
    meta: "~1 week · Fixed price",
    includes: [
      "Web app security review: auth, permissions, data exposure, secrets, rate limits",
      "AI security review against the OWASP LLM Top 10 (prompt injection, data leakage, unsafe output)",
      "AI cost analysis: caching, model choice, prompt size, wasted calls",
      "Reliability & trust: hallucination guardrails, error handling, monitoring",
    ],
    deliverable:
      "A scored report with your Trust Score, the top 10 fixes ranked by risk, and estimated monthly savings.",
    cta: "Book the audit",
  },
  {
    name: "Hardening Sprint",
    meta: "2–4 weeks",
    includes: [
      "I fix the issues found in the audit, highest risk first",
      "AI guardrails, output validation and fallbacks",
      "Caching and model routing to cut AI cost",
      "Logging and monitoring so failures never go silent",
      "Ready for enterprise security questionnaires",
    ],
    cta: "Start with a call",
    featured: true,
  },
  {
    name: "Production Partner (monthly)",
    meta: "Ongoing, monthly",
    includes: [
      "Monitoring of security, cost and AI quality",
      "Monthly cost and risk report",
      "Help with customer security questionnaires",
      "Priority fixes and updates",
    ],
    cta: "Talk about a retainer",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Replace the placeholders with real quotes. Entries still holding a
 * [PLACEHOLDER] (or empty) are skipped, and the whole section hides when
 * none are left.
 */
export const testimonials: Testimonial[] = [
  { quote: "[TESTIMONIAL QUOTE]", name: "[NAME]", role: "[ROLE, COMPANY]" },
  { quote: "[TESTIMONIAL QUOTE]", name: "[NAME]", role: "[ROLE, COMPANY]" },
  { quote: "[TESTIMONIAL QUOTE]", name: "[NAME]", role: "[ROLE, COMPANY]" },
];

const isFilled = (s: string) => s.trim() !== "" && !/^\[.*\]$/.test(s.trim());

export const realTestimonials = testimonials.filter((t) => isFilled(t.quote) && isFilled(t.name));

/**
 * "Get the AI App Production Checklist" card, shown next to the security
 * playbook on the home page. Hidden until `endpoint` is set.
 *
 * TODO [CHECKLIST]: write the checklist itself (it can be distilled from the
 * mii-ai-security playbook), then set up delivery.
 * TODO [FORM ENDPOINT]: paste a Formspree / ConvertKit / Resend URL. The form
 * POSTs JSON `{ email, source }` to it.
 */
export const leadMagnet = {
  endpoint: "",
  blurb: "[NUMBER] checks across security, AI cost and customer trust. The same list I use in my audits.",
};
