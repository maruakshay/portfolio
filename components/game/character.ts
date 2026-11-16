import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Stage } from "@/lib/game-data";

// A jointed person, about 1.8 units tall, built from capsules and spheres.
// Hips → knees → feet and shoulders → elbows → hands all pivot, so the walk
// bends at the knees and the arms swing from the shoulder. Clothes are layers:
// a stage swaps colours, sleeves, the jacket shell and accessories, and widens
// the shoulders as the walker gets "stronger".

const SKIN = "#a8714f";
const HAIR = "#17110d";

// Shared geometry (every person in town reuses it)
const G = {
  thigh: new THREE.CapsuleGeometry(0.078, 0.3, 6, 12),
  shin: new THREE.CapsuleGeometry(0.062, 0.32, 6, 12),
  upper: new THREE.CapsuleGeometry(0.056, 0.22, 6, 12),
  fore: new THREE.CapsuleGeometry(0.047, 0.2, 6, 12),
  hand: new THREE.SphereGeometry(0.052, 12, 10),
  torso: new THREE.CapsuleGeometry(0.17, 0.26, 8, 18),
  pelvis: new THREE.CapsuleGeometry(0.15, 0.06, 6, 16),
  neck: new THREE.CylinderGeometry(0.052, 0.06, 0.12, 12),
  head: new THREE.SphereGeometry(0.112, 24, 18),
  hairCap: new THREE.SphereGeometry(0.12, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
  ear: new THREE.SphereGeometry(0.024, 8, 8),
  nose: new THREE.ConeGeometry(0.018, 0.05, 8),
  eye: new THREE.SphereGeometry(0.014, 8, 8),
  brow: new THREE.BoxGeometry(0.045, 0.009, 0.01),
  shoe: new THREE.CapsuleGeometry(0.055, 0.15, 4, 10),
};

export interface Character {
  root: THREE.Group;
  body: THREE.Group;
  spine: THREE.Group;
  head: THREE.Group;
  hipL: THREE.Group;
  hipR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  shL: THREE.Group;
  shR: THREE.Group;
  elL: THREE.Group;
  elR: THREE.Group;
  torso: THREE.Mesh;
  cape: THREE.Mesh;
  halo: THREE.Mesh;
  aura: THREE.PointLight;
  mats: Record<"skin" | "top" | "under" | "fore" | "pants" | "shoes" | "hair" | "cape" | "apron", THREE.MeshStandardMaterial>;
  parts: Record<"hood" | "jacket" | "lapels" | "collar" | "headphones" | "backpack" | "glasses" | "watch" | "apron" | "sleeveEnd", THREE.Object3D>;
}

const mat = (color: string, roughness = 0.75, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra });

function mesh(geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(geo, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  return o;
}

function pivot(x: number, y: number, z = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  return g;
}

export function buildCharacter(): Character {
  const mats = {
    skin: mat(SKIN, 0.55),
    top: mat("#c9c6bf", 0.85),
    under: mat("#c9c6bf", 0.85),
    fore: mat(SKIN, 0.55),
    pants: mat("#3f5a7a", 0.9),
    shoes: mat("#ecebe7", 0.5),
    hair: mat(HAIR, 0.95),
    cape: mat("#ff5a5f", 0.6, { side: THREE.DoubleSide }),
    apron: mat("#1f6feb", 0.9),
  };

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // Legs: hip (y .93) → knee → foot
  const hips = pivot(0, 0.93);
  body.add(hips);
  const pelvis = mesh(G.pelvis, mats.pants, 0, 0.02, 0);
  pelvis.scale.set(1.05, 1, 0.75);
  hips.add(pelvis);
  const leg = (side: number) => {
    const hip = pivot(side * 0.095, 0);
    hip.add(mesh(G.thigh, mats.pants, 0, -0.2, 0));
    const knee = pivot(0, -0.43);
    knee.add(mesh(G.shin, mats.pants, 0, -0.2, 0));
    const shoe = mesh(G.shoe, mats.shoes, 0, -0.44, 0.045);
    shoe.rotation.x = Math.PI / 2;
    shoe.scale.set(1.1, 1, 0.85);
    knee.add(shoe);
    hip.add(knee);
    hips.add(hip);
    return { hip, knee };
  };
  const L = leg(-1);
  const R = leg(1);

  // Upper body
  const spine = pivot(0, 0.93);
  body.add(spine);
  const torso = mesh(G.torso, mats.under, 0, 0.3, 0);
  torso.scale.set(1.18, 1, 0.68);
  spine.add(torso);

  // Jacket / blazer shell over the torso, open at the front
  const jacket = new THREE.Group();
  const shell = mesh(new THREE.CapsuleGeometry(0.178, 0.26, 8, 18), mats.top, 0, 0.3, -0.008);
  shell.scale.set(1.2, 1.02, 0.7);
  jacket.add(shell);
  spine.add(jacket);
  // The open front: a strip of the under-layer sits proud of the shell
  const placket = mesh(new THREE.BoxGeometry(0.1, 0.4, 0.02), mats.under, 0, 0.32, 0.118);
  jacket.add(placket);
  const lapels = new THREE.Group();
  for (const s of [-1, 1]) {
    const lap = mesh(new THREE.BoxGeometry(0.05, 0.2, 0.012), mats.top, s * 0.06, 0.44, 0.124);
    lap.rotation.z = s * 0.35;
    lapels.add(lap);
  }
  const tie = mesh(new THREE.BoxGeometry(0.035, 0.24, 0.012), mat("#c0265e", 0.5), 0, 0.36, 0.13);
  lapels.add(tie);
  jacket.add(lapels);

  // Collar for shirts
  const collar = new THREE.Group();
  for (const s of [-1, 1]) {
    const c = mesh(new THREE.BoxGeometry(0.07, 0.035, 0.05), mats.under, s * 0.04, 0.6, 0.06);
    c.rotation.z = s * -0.4;
    collar.add(c);
  }
  spine.add(collar);

  // Hoodie: hood bunched behind the neck, front pocket, drawstrings
  const hood = new THREE.Group();
  const hoodRoll = mesh(new THREE.TorusGeometry(0.1, 0.045, 8, 18, Math.PI * 1.3), mats.top, 0, 0.6, -0.04);
  hoodRoll.rotation.x = Math.PI / 2;
  hoodRoll.rotation.z = -Math.PI * 0.15 + Math.PI;
  hood.add(hoodRoll);
  hood.add(mesh(new THREE.BoxGeometry(0.22, 0.09, 0.02), mats.top, 0, 0.14, 0.118));
  const stringMat = mat("#f4f1ea", 0.6);
  for (const s of [-1, 1]) hood.add(mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 4), stringMat, s * 0.035, 0.5, 0.118));
  spine.add(hood);

  const apron = mesh(new THREE.BoxGeometry(0.34, 0.62, 0.02), mats.apron, 0, 0.12, 0.125);
  spine.add(apron);

  // Arms: shoulder → elbow → hand
  const arm = (side: number) => {
    const sh = pivot(side * 0.235, 0.53);
    const up = mesh(G.upper, mats.top, 0, -0.15, 0);
    sh.add(up);
    const el = pivot(0, -0.31);
    el.add(mesh(G.fore, mats.fore, 0, -0.14, 0));
    const hand = mesh(G.hand, mats.skin, 0, -0.29, 0.01);
    hand.scale.set(0.85, 1.15, 0.65);
    el.add(hand);
    sh.add(el);
    spine.add(sh);
    return { sh, el };
  };
  const AL = arm(-1);
  const AR = arm(1);
  const sleeveEnd = mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 14), mats.top, 0, -0.03, 0);
  sleeveEnd.rotation.x = Math.PI / 2;
  AR.el.add(sleeveEnd);
  const watch = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14), mat("#1c1c1c", 0.3, { metalness: 0.6 }), 0, -0.22, 0);
  AL.el.add(watch);

  // Neck + head
  spine.add(mesh(G.neck, mats.skin, 0, 0.64, 0));
  const head = pivot(0, 0.79);
  spine.add(head);
  const skull = mesh(G.head, mats.skin);
  skull.scale.set(0.92, 1.1, 1);
  head.add(skull);
  const hair = mesh(G.hairCap, mats.hair, 0, 0.0, -0.012);
  hair.scale.set(0.96, 1.12, 1.05);
  hair.rotation.x = -0.62;
  head.add(hair);
  // Fringe: a low, wide cap swept over the forehead
  const fringe = mesh(G.hairCap, mats.hair, 0, 0.035, 0.012);
  fringe.scale.set(0.97, 0.75, 1.0);
  fringe.rotation.x = 0.35;
  head.add(fringe);
  for (const s of [-1, 1]) {
    const ear = mesh(G.ear, mats.skin, s * 0.103, -0.005, -0.005);
    ear.scale.set(0.5, 1, 0.8);
    head.add(ear);
    head.add(mesh(G.eye, mat("#1a120d", 0.3), s * 0.038, 0.015, 0.098));
    const b = mesh(G.brow, mats.hair, s * 0.04, 0.045, 0.104);
    b.rotation.z = s * -0.08;
    head.add(b);
  }
  const nose = mesh(G.nose, mats.skin, 0, -0.01, 0.112);
  nose.rotation.x = Math.PI / 2.2;
  head.add(nose);
  head.add(mesh(new THREE.BoxGeometry(0.04, 0.008, 0.01), mat("#6b3a2a", 0.6), 0, -0.055, 0.104));

  const glasses = new THREE.Group();
  const gm = mat("#111", 0.3, { metalness: 0.5 });
  for (const s of [-1, 1]) {
    const lens = mesh(new THREE.TorusGeometry(0.026, 0.005, 6, 18), gm, s * 0.04, 0.015, 0.112);
    glasses.add(lens);
  }
  glasses.add(mesh(new THREE.BoxGeometry(0.03, 0.005, 0.005), gm, 0, 0.02, 0.114));
  head.add(glasses);

  const headphones = new THREE.Group();
  const band = mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 24, Math.PI), mat("#1c1c1c", 0.4), 0, -0.08, 0.02);
  band.rotation.x = -Math.PI / 2;
  band.rotation.z = Math.PI;
  headphones.add(band);
  for (const s of [-1, 1]) {
    const cup = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 14), mat("#ff5a5f", 0.4), s * 0.12, -0.08, 0.04);
    cup.rotation.z = Math.PI / 2;
    headphones.add(cup);
  }
  spine.add(headphones);
  headphones.position.y = 0.69;

  const backpack = new THREE.Group();
  const bpMat = mat("#d9622b", 0.8);
  backpack.add(mesh(new RoundedBoxGeometry(0.3, 0.38, 0.14, 3, 0.05), bpMat, 0, 0.32, -0.19));
  for (const s of [-1, 1]) backpack.add(mesh(new THREE.BoxGeometry(0.035, 0.42, 0.02), mat("#2b2b2b"), s * 0.11, 0.33, 0.115));
  spine.add(backpack);

  // Tapered cape: narrow at the shoulders, flaring toward the hem, slightly curved
  const capeGeo = new THREE.PlaneGeometry(0.5, 0.95, 4, 8);
  capeGeo.translate(0, -0.475, 0);
  const cp = capeGeo.attributes.position;
  for (let i = 0; i < cp.count; i++) {
    const down = -cp.getY(i) / 0.95; // 0 at the shoulders → 1 at the hem
    const x = cp.getX(i) * (0.7 + down * 0.45);
    cp.setXYZ(i, x, cp.getY(i), -Math.pow(x * 2, 2) * 0.06);
  }
  capeGeo.computeVertexNormals();
  const cape = mesh(capeGeo, mats.cape, 0, 0.58, -0.13);
  spine.add(cape);

  const halo = mesh(
    new THREE.TorusGeometry(0.13, 0.018, 10, 32),
    new THREE.MeshStandardMaterial({ color: "#ffd166", emissive: "#ffb347", emissiveIntensity: 2.2 }),
    0,
    0.2,
    0,
  );
  halo.rotation.x = Math.PI / 2;
  head.add(halo);

  const aura = new THREE.PointLight("#ffcc66", 0, 6, 2);
  aura.position.y = 1.2;
  body.add(aura);

  return {
    root,
    body,
    spine,
    head,
    hipL: L.hip,
    hipR: R.hip,
    kneeL: L.knee,
    kneeR: R.knee,
    shL: AL.sh,
    shR: AR.sh,
    elL: AL.el,
    elR: AR.el,
    torso,
    cape,
    halo,
    aura,
    mats,
    parts: { hood, jacket, lapels, collar, headphones, backpack, glasses, watch, apron, sleeveEnd },
  };
}

export function applyStage(c: Character, s: Stage, opts: { apron?: string; host?: boolean } = {}) {
  const longSleeves = s.top !== "tee";
  const layered = s.top === "jacket" || s.top === "blazer";
  c.mats.top.color.set(s.topColor);
  c.mats.under.color.set(layered ? s.under : s.topColor);
  c.mats.fore.color.set(longSleeves ? s.topColor : SKIN);
  c.mats.pants.color.set(s.pants);
  c.mats.shoes.color.set(s.shoes);
  c.mats.top.roughness = s.top === "blazer" ? 0.6 : 0.85;
  c.mats.top.emissive.set(s.glow ? "#8a5a00" : "#000000");
  c.mats.top.emissiveIntensity = s.glow ? 0.45 : 0;

  c.parts.hood.visible = s.top === "hoodie";
  c.parts.jacket.visible = layered;
  c.parts.lapels.visible = s.top === "blazer";
  c.parts.collar.visible = s.top === "shirt" || s.top === "blazer";
  c.parts.sleeveEnd.visible = longSleeves;
  c.parts.headphones.visible = !!s.headphones;
  c.parts.backpack.visible = !!s.backpack && !opts.apron;
  c.parts.glasses.visible = !!s.glasses;
  c.parts.watch.visible = !!s.watch;
  c.parts.apron.visible = !!opts.apron;
  if (opts.apron) c.mats.apron.color.set(opts.apron);
  c.cape.visible = !!s.cape && !opts.apron && !opts.host;
  if (s.cape) c.mats.cape.color.set(s.cape);
  c.halo.visible = !!s.halo && !opts.host;
  c.aura.intensity = s.glow ? 4 : 0;

  // "Stronger": broader chest and shoulders, thicker arms, a touch taller.
  c.torso.scale.set(1.18 * s.build, 1, 0.68 * (0.9 + s.build * 0.1));
  (c.parts.jacket.children[0] as THREE.Mesh).scale.set(1.2 * s.build, 1.02, 0.7 * (0.9 + s.build * 0.1));
  c.shL.position.x = -0.235 * s.build;
  c.shR.position.x = 0.235 * s.build;
  for (const sh of [c.shL, c.shR]) sh.children[0].scale.set(s.build, 1, s.build);
  c.root.scale.setScalar(s.height);
}

export interface Pose {
  phase: number;
  /** 0 idle → 1 full stride */
  stride: number;
  t: number;
  /** In the air (jumping) */
  air?: boolean;
  /** Talking gesture amount 0..1 */
  talk?: number;
  /** Waving amount 0..1 */
  wave?: number;
  /** Stumble 0..1 */
  stumble?: number;
  /** Strike: 0 right jab, 1 left jab, 2 two-handed slam; k runs 0 → 1 */
  attack?: { side: 0 | 1 | 2; k: number };
  /** Gun raised 0..1, with recoil kick 0..1 */
  aim?: number;
  recoil?: number;
  /** Up/down angle of the aim in radians (+ = up). */
  aimPitch?: number;
}

/**
 * A chunky sci-fi blaster in the right hand. In the hand's frame the barrel
 * points along -y (forward once the arm is raised) and +z is up.
 */
export function attachGun(c: Character) {
  const gun = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: "#23262d", metalness: 0.6, roughness: 0.35 });
  const trim = new THREE.MeshStandardMaterial({ color: "#3a3f48", metalness: 0.7, roughness: 0.3 });
  const glow = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ff8a3d", emissiveIntensity: 2.4, toneMapped: false });
  const box = (m: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
    b.position.set(x, y, z);
    b.castShadow = true;
    gun.add(b);
    return b;
  };
  box(body, 0, -0.38, 0.065, 0.06, 0.3, 0.09); // slide
  box(trim, 0, -0.3, -0.02, 0.05, 0.07, 0.13); // grip
  box(glow, 0.032, -0.4, 0.075, 0.006, 0.2, 0.025); // energy strip
  box(glow, -0.032, -0.4, 0.075, 0.006, 0.2, 0.025);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.12, 12), trim);
  barrel.position.set(0, -0.58, 0.075);
  gun.add(barrel);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 12), glow);
  tip.position.set(0, -0.645, 0.075);
  gun.add(tip);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, -0.68, 0.075);
  gun.add(muzzle);
  c.elR.add(gun);
  return { gun, muzzle };
}

export function animateCharacter(c: Character, p: Pose) {
  const a = p.stride;
  const sL = Math.sin(p.phase);
  const sR = Math.sin(p.phase + Math.PI);
  if (p.air) {
    // Tuck: knees up, arms forward
    c.hipL.rotation.x = -0.9;
    c.hipR.rotation.x = -0.3;
    c.kneeL.rotation.x = 1.3;
    c.kneeR.rotation.x = 0.9;
    c.shL.rotation.x = -0.9;
    c.shR.rotation.x = 0.5;
  } else {
    c.hipL.rotation.x = sL * 0.55 * a;
    c.hipR.rotation.x = sR * 0.55 * a;
    c.kneeL.rotation.x = a * (0.08 + 0.95 * Math.max(0, -Math.cos(p.phase)));
    c.kneeR.rotation.x = a * (0.08 + 0.95 * Math.max(0, -Math.cos(p.phase + Math.PI)));
    c.shL.rotation.x = -sL * 0.5 * a;
    c.shR.rotation.x = -sR * 0.5 * a;
  }
  c.elL.rotation.x = -(0.15 + 0.4 * a);
  c.elR.rotation.x = -(0.15 + 0.4 * a);
  c.shL.rotation.z = -0.07;
  c.shR.rotation.z = 0.07;

  // Breathing + bob + a little counter-twist
  const breathe = Math.sin(p.t * 1.8) * 0.006 * (1 - a);
  c.body.position.y = Math.abs(Math.cos(p.phase)) * 0.045 * a + breathe;
  c.spine.rotation.y = Math.sin(p.phase) * 0.12 * a;
  c.spine.rotation.x = 0.05 * a;
  c.head.rotation.x = 0;

  if (p.talk) {
    const k = p.talk;
    c.shR.rotation.x = THREE.MathUtils.lerp(c.shR.rotation.x, -0.5 + Math.sin(p.t * 5) * 0.18, k);
    c.elR.rotation.x = THREE.MathUtils.lerp(c.elR.rotation.x, -1.2 + Math.sin(p.t * 7) * 0.2, k);
    c.shR.rotation.z = THREE.MathUtils.lerp(0.07, 0.3, k);
    c.head.rotation.x = Math.sin(p.t * 3.3) * 0.05 * k;
  }
  if (p.wave) {
    const k = p.wave;
    c.shR.rotation.z = THREE.MathUtils.lerp(c.shR.rotation.z, 2.7, k);
    c.shR.rotation.x = THREE.MathUtils.lerp(c.shR.rotation.x, 0, k);
    c.elR.rotation.x = 0;
    c.elR.rotation.z = Math.sin(p.t * 9) * 0.45 * k;
  } else c.elR.rotation.z = 0;
  if (p.stumble) {
    c.spine.rotation.x = -0.35 * p.stumble;
    c.shL.rotation.z = -0.07 - 1.1 * p.stumble;
    c.shR.rotation.z = 0.07 + 1.1 * p.stumble;
  }

  if (p.attack) {
    const { side, k } = p.attack;
    // Wind up (0 → 0.35), strike (0.35 → 0.55), recover (→ 1)
    const out = k < 0.35 ? -k / 0.35 * 0.4 : k < 0.55 ? (k - 0.35) / 0.2 : 1 - (k - 0.55) / 0.45;
    const f = Math.max(0, out);
    const back = Math.max(0, -out);
    if (side === 2) {
      for (const [sh, el] of [[c.shL, c.elL], [c.shR, c.elR]] as const) {
        sh.rotation.x = k < 0.35 ? -0.8 - 2 * (k / 0.35) : -2.8 + 2.2 * Math.min(1, (k - 0.35) / 0.2) + 0.5 * Math.max(0, (k - 0.55) / 0.45);
        el.rotation.x = -0.3;
      }
      c.spine.rotation.x = k < 0.35 ? -0.15 : 0.35 * f;
    } else {
      const [sh, el, off] = side === 0 ? [c.shR, c.elR, c.shL] : [c.shL, c.elL, c.shR];
      sh.rotation.x = 0.5 * back - 1.55 * f;
      sh.rotation.z = (side === 0 ? 1 : -1) * 0.1;
      el.rotation.x = -1.9 * back - 0.1 * f - 0.6 * (1 - f) * (1 - back);
      off.rotation.x = -0.7;
      c.spine.rotation.y = (side === 0 ? 1 : -1) * (0.45 * f - 0.25 * back);
    }
  }

  if (p.aim) {
    // Two-handed aim: right arm straight out, left hand under the grip
    const k = p.aim;
    const kick = (p.recoil ?? 0) * 0.18;
    const up = THREE.MathUtils.clamp(p.aimPitch ?? 0, -0.9, 0.9);
    c.shR.rotation.x = THREE.MathUtils.lerp(c.shR.rotation.x, -1.5 - up + kick, k);
    c.shR.rotation.z = THREE.MathUtils.lerp(c.shR.rotation.z, 0.12, k);
    c.elR.rotation.x = THREE.MathUtils.lerp(c.elR.rotation.x, -0.05 - kick, k);
    c.shL.rotation.x = THREE.MathUtils.lerp(c.shL.rotation.x, -1.25 - up + kick, k);
    c.shL.rotation.z = THREE.MathUtils.lerp(c.shL.rotation.z, -0.32, k);
    c.elL.rotation.x = THREE.MathUtils.lerp(c.elL.rotation.x, -0.55, k);
    c.spine.rotation.y = THREE.MathUtils.lerp(c.spine.rotation.y, 0.18, k);
    c.head.rotation.y = -0.15 * k;
    c.head.rotation.x = -up * 0.5 * k;
  } else c.head.rotation.y = 0;

  c.cape.rotation.x = 0.1 + a * 0.55 + Math.sin(p.t * 6) * 0.05 * a + (p.air ? 0.6 : 0);
  if (c.halo.visible) {
    c.halo.position.y = 0.2 + Math.sin(p.t * 2.5) * 0.02;
    c.halo.rotation.z = p.t;
  }
}
