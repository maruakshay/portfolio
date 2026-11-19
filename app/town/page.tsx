import type { Metadata } from "next";
import { Town } from "@/components/game/town";
import { callHref, career, profile } from "@/lib/content";
import { skills } from "@/lib/game-data";

export const metadata: Metadata = {
  title: "The 3D town",
  alternates: { canonical: "/town" },
  description:
    "Walk through Akshay Maru's career as a small 3D town: buildings are past roles, shops are skills, and the AI Core at the end hosts his AI.",
};

export default function TownPage() {
  return (
    <>
      {/* Plain-text version of the town, for screen readers and search engines. */}
      <div className="sr-only">
        <h2>
          {profile.name}: {profile.role}
        </h2>
        <p>
          {profile.statementLead} {profile.statementRest}
        </p>
        <p>{profile.availability}.</p>
        <h2>Experience</h2>
        <ul>
          {career.map((c) => (
            <li key={c.org}>
              {c.org}, {c.title} ({c.years}). {c.points.join(" ")} {c.lead}
            </li>
          ))}
        </ul>
        <h2>Skills</h2>
        <ul>
          {skills.map((s) => (
            <li key={s.id}>
              {s.name}: {s.points.join(" ")}
            </li>
          ))}
        </ul>
        <p>
          <a href={callHref()}>Book a 20-minute intro call</a> · <a href="/chat">Ask my AI about me</a> ·{" "}
          <a href={`mailto:${profile.email}`}>Email</a>
        </p>
      </div>
      <Town />
    </>
  );
}
