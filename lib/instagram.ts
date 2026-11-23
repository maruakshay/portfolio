// Instagram numbers and content for /brands. Update numbers here only.
// Real values only: leave a stat as "" and it is hidden on the page.

export const instagram = {
  handle: "@akshaay.lifts",
  url: "https://www.instagram.com/akshaay.lifts/",
  displayLine: "Adaptive Fitness · Cerebral Palsy",
  stats: {
    /** Insights → views, last 30 days. */
    monthlyViews: "40K+",
    /** Insights → accounts reached, last 30 days. */
    accountsReached: "",
    posts: "51",
  },
  /** Pinned themes. `reel` = shortcode from the reel link: instagram.com/reel/<shortcode>/ */
  recent: [
    {
      tag: "Stammering",
      title: "“My job is not fun anymore”",
      line: "What stammering feels like at work, said out loud.",
      reel: "DeYttDpJMeS",
    },
    {
      tag: "Gym motivation",
      title: "“Don’t go to the gym today”",
      line: "That little voice everyone hears, and how I train past it.",
      reel: "DfWRpkyo6IF",
    },
    {
      tag: "Unilateral CP",
      title: "They said my body wasn’t “proper”",
      line: "Living and lifting with unilateral cerebral palsy.",
      reel: "DgAsDkTKFam",
    },
  ],
};

const statLabels: Record<keyof typeof instagram.stats, string> = {
  monthlyViews: "views in the last 30 days",
  accountsReached: "accounts reached in the last 30 days",
  posts: "posts on Instagram",
};

/** Stats with a value, in display order. Empty ones are left out. */
export const instagramStats = (
  Object.keys(statLabels) as (keyof typeof statLabels)[]
)
  .filter((k) => instagram.stats[k].trim() !== "")
  .map((k) => ({ value: instagram.stats[k], label: statLabels[k] }));

export const reelUrl = (code: string) =>
  `https://www.instagram.com/reel/${code}/`;
export const reelEmbed = (code: string) =>
  `https://www.instagram.com/reel/${code}/embed`;
