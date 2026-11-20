import type { ReactNode } from "react";
import { Reveal } from "./motion";

/** Label + big heading on the left, a short supporting line on the right. */
export function SectionHead({
  id,
  label,
  title,
  aside,
}: {
  id: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
      <div>
        <p className="label">{label}</p>
        <h2 id={id} className="mt-4 max-w-[20ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-[36ch] shrink-0 text-ink-muted">{aside}</p>}
    </Reveal>
  );
}
