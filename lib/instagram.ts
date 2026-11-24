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
  /** Pinned reels. `hook` = on-screen hook [before, highlighted, after]. `reel` = shortcode from instagram.com/reel/<shortcode>/ */
  recent: [
    {
      tag: "Stammering",
      hook: ["My job is ", "not fun", " anymore"],
      caption: "Um, you know, since…",
      line: "What stammering feels like at work, said out loud.",
      reel: "DfWRpkyo6IF",
    },
    {
      tag: "Gym motivation",
      hook: ["This page was ", "never", " about the gym"],
      line: "What the training is really about for me.",
      reel: "DgAsDkTKFam",
    },
    {
      tag: "Unilateral CP",
      hook: ["They said my body wasn’t ", "“proper.”", ""],
      line: "Living and lifting with unilateral cerebral palsy.",
      reel: "DeYttDpJMeS",
    },
  ] as {
    tag: string;
    hook: [string, string, string];
    caption?: string;
    line: string;
    reel: string;
  }[],
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
