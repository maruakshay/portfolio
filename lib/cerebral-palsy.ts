// Content for /cerebral-palsy: a plain-language explainer.
// Keep claims general and well-established (CDC, NHS, Cerebral Palsy Alliance,
// Verschuren et al. 2016 exercise recommendations). No personal medical claims.

export const cpHero = {
  label: "Understanding cerebral palsy",
  title: ["Cerebral palsy,", "explained simply."],
  sub: "I live with unilateral cerebral palsy. Most people have heard the name but don't know what it actually is. This page covers what happens, how it happens, why the body reacts the way it does, and how exercise helps you take back control.",
};

export const cpFacts = [
  { value: "17M+", label: "people live with cerebral palsy worldwide" },
  { value: "2–3", label: "in every 1,000 babies are born with or develop CP" },
  { value: "#1", label: "most common physical disability in childhood" },
];

/** The signal path, used for the "what happens" diagram. */
export const cpSignal = [
  { t: "Brain", d: "Plans the movement and sends the command." },
  { t: "Spinal cord", d: "Carries the command down to the right muscles." },
  { t: "Muscles", d: "Receive the command and move the body." },
];

export const cpWhat = {
  label: "What it is",
  title: ["A brain thing,", "not a muscle thing."],
  intro:
    "Cerebral palsy is a group of conditions that affect movement, muscle tone and posture. It comes from damage to, or different development of, the parts of the brain that control movement, before, during or soon after birth.",
  points: [
    {
      t: "The muscles are fine. The messages aren't.",
      d: "The muscles themselves are healthy. The brain's instructions reach them scrambled, too strong, too weak or badly timed. That is why movement looks stiff, shaky or uncoordinated.",
    },
    {
      t: "It doesn't get worse",
      d: "The injury in the brain is permanent but it does not spread or progress. What can change over time is the body: tight muscles, stiff joints, pain and fatigue, especially without movement.",
    },
    {
      t: "Every case is different",
      d: "Some people walk, run and lift with a small limp or a weaker hand. Others use a wheelchair and need support every day. Same name, very different lives.",
    },
  ],
};

export const cpCauses = {
  label: "How it happens",
  title: ["Before, during", "or just after birth."],
  intro:
    "CP happens when the developing brain is injured or forms differently. Often there isn't one clear cause. It is not contagious, and in most cases it is not inherited.",
  stages: [
    {
      when: "Before birth",
      share: "Most cases",
      items: [
        "Infections during pregnancy",
        "Stroke or bleeding in the baby's brain",
        "Problems with blood or oxygen supply through the placenta",
        "Differences in how the brain develops",
      ],
    },
    {
      when: "During birth",
      share: "A smaller share",
      items: [
        "Lack of oxygen during a difficult delivery",
        "Very premature birth",
        "Very low birth weight",
      ],
    },
    {
      when: "After birth",
      share: "First months to ~2 years",
      items: [
        "Brain infections like meningitis",
        "Head injury",
        "Severe, untreated jaundice",
        "Stroke in infancy",
      ],
    },
  ],
};

export const cpWhy = {
  label: "Why the body reacts this way",
  title: ["Why muscles get", "tight and stubborn."],
  intro:
    "Normally the brain sends a constant 'calm down' signal to the spinal cord, keeping reflexes in check. When that part of the brain is injured, the brake is weaker. Muscles overreact to being stretched and stay switched on when they should relax. That is spasticity.",
  types: [
    {
      t: "Spastic",
      share: "~70–80%",
      d: "Stiff, tight muscles that resist stretching. Movements can feel jerky or effortful. The most common type.",
    },
    {
      t: "Dyskinetic",
      share: "Less common",
      d: "Uncontrolled, involuntary movements. Muscle tone swings between too tight and too loose.",
    },
    {
      t: "Ataxic",
      share: "Least common",
      d: "Problems with balance and coordination. Precise movements, like writing, can be shaky.",
    },
    {
      t: "Mixed",
      share: "Some people",
      d: "A combination of the types above.",
    },
  ],
  where: [
    {
      t: "Unilateral",
      d: "One side of the body, arm and leg. Also called hemiplegia. This is what I have.",
    },
    {
      t: "Bilateral",
      d: "Both sides. It can affect mostly the legs (diplegia) or all four limbs (quadriplegia).",
    },
  ],
};

export const cpMyths = [
  {
    myth: "CP gets worse over time.",
    fact: "The brain injury doesn't progress. Bodies can stiffen with age and inactivity, which is exactly why movement matters.",
  },
  {
    myth: "People with CP have an intellectual disability.",
    fact: "CP is about movement. Many people with CP have no intellectual disability at all.",
  },
  {
    myth: "Strength training makes spasticity worse.",
    fact: "Research shows well-planned strength training builds strength without increasing spasticity.",
  },
  {
    myth: "You can catch it, or it's always genetic.",
    fact: "It isn't contagious, and in most cases it isn't inherited.",
  },
  {
    myth: "It can be cured.",
    fact: "There is no cure. But therapy, exercise and the right support can improve how the body moves and feels.",
  },
];

export const cpExercise = {
  label: "Exercise",
  title: ["You can't cure it.", "You can train it."],
  intro:
    "The brain can rewire. Practice builds new pathways around the injured areas (neuroplasticity). Exercise won't remove CP, but it can improve strength, flexibility, balance and stamina, and make daily life easier.",
  why: [
    {
      t: "Strength",
      d: "CP muscles are often weak as well as tight. Stronger muscles make walking, standing and lifting things easier.",
    },
    {
      t: "Flexibility",
      d: "Regular stretching and full-range movement fight the slow tightening of muscles and joints.",
    },
    {
      t: "Rewiring",
      d: "Repeating a movement teaches the brain a better route for it. Use it, or lose it.",
    },
    {
      t: "Stamina",
      d: "Moving with CP takes more energy. Better fitness means less fatigue through the day.",
    },
  ],
};

export type CpMove = { name: string; how: string };
export type CpGroup = { t: string; goal: string; moves: CpMove[] };

export const cpMoves: CpGroup[] = [
  {
    t: "Strength",
    goal: "Build the weaker side up, not around it.",
    moves: [
      {
        name: "Single-arm dumbbell row",
        how: "Train the weaker side first. Light weight, slow and controlled, full range.",
      },
      {
        name: "Sit-to-stand",
        how: "Stand up from a chair without using your hands. Push evenly through both feet.",
      },
      {
        name: "Step-ups",
        how: "Step onto a low box leading with the weaker leg. Hold a rail if you need to.",
      },
      {
        name: "Glute bridge",
        how: "Lie on your back, knees bent, lift your hips. Squeeze at the top for two seconds.",
      },
    ],
  },
  {
    t: "Stretch & mobility",
    goal: "Long, gentle holds. Never bounce.",
    moves: [
      {
        name: "Calf stretch against a wall",
        how: "Back heel down, knee straight. Hold 30–60 seconds. Tight calves are very common in CP.",
      },
      {
        name: "Hip flexor stretch",
        how: "Half-kneeling, tuck your hips under and shift forward gently. Hold 30–60 seconds.",
      },
      {
        name: "Wrist and finger extension",
        how: "Place the palm flat on a table, fingers straight, and lean gently over it.",
      },
    ],
  },
  {
    t: "Balance",
    goal: "Always next to something you can grab.",
    moves: [
      {
        name: "Single-leg stand",
        how: "Stand on one leg near a wall or counter. Build up to 30 seconds per side.",
      },
      {
        name: "Heel-to-toe walk",
        how: "Walk in a straight line, heel touching toe. Slow beats fast here.",
      },
    ],
  },
  {
    t: "Hand & arm",
    goal: "Make the weaker hand do real work.",
    moves: [
      {
        name: "Use-it practice",
        how: "Do daily tasks with the weaker hand: opening jars, carrying bags, brushing teeth. Therapists call this constraint-induced or bimanual training.",
      },
      {
        name: "Grip work",
        how: "Squeeze a stress ball or therapy putty. Hold 3–5 seconds, then fully open the hand.",
      },
    ],
  },
  {
    t: "Cardio",
    goal: "Build an engine that lasts the day.",
    moves: [
      {
        name: "Cycling or swimming",
        how: "Low impact and easy on the joints. A stationary bike is a safe place to start.",
      },
      {
        name: "Brisk walking",
        how: "Start with 10 minutes and build up. Consistency matters more than speed.",
      },
    ],
  },
];

/** Based on Verschuren et al. (2016), exercise recommendations for people with CP. */
export const cpWeek = [
  { value: "2–4×", label: "strength sessions a week, for at least 12–16 weeks to see change" },
  { value: "3×", label: "cardio sessions a week, 20+ minutes each" },
  { value: "60 min", label: "of moving around every day, and less time sitting still" },
];

export const cpSafety = [
  "Talk to a doctor or physiotherapist before starting. They can tailor this to your type of CP.",
  "Warm up for 5–10 minutes. Spastic muscles need longer to loosen up.",
  "Start light and slow. Control matters more than weight.",
  "Stop if you feel sharp pain, numbness or dizziness. Normal effort is fine, pain isn't.",
  "Rest is part of training. Fatigue hits harder with CP, so plan recovery days.",
];

export const cpDisclaimer =
  "I'm not a doctor. This page combines what I've learned living with CP and what published research says. It is for awareness, not medical advice.";
