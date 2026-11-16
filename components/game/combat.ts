import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BOSS, FIGHT_SPAN, FIGHTS, FOES, type FoeKind } from "@/lib/game-data";
import { BOUNDS, type Fonts } from "./world";

// ── Fights ───────────────────────────────────────────────────────────────────
// Glitch walls across the street, the bugs behind them, and the Black Box that
// guards the AI Core. The engine owns the player (HP, strikes, movement); this
// owns everything that fights back.

export type CombatEvent =
  | { type: "fight"; idx: number; name: string; intro: string; left: number }
  | { type: "left"; left: number }
  | { type: "cleared"; idx: number }
  | { type: "retreat" }
  | { type: "boss"; hp: number; max: number; phase: number; awake: boolean }
  | { type: "bossDown" }
  | { type: "bossWall" };

export interface CombatHost {
  scene: THREE.Scene;
  /** Live player position (y is jump height). */
  player: THREE.Vector3;
  /** Static colliders (buildings, cars…). */
  blocked: (x: number, z: number, r: number) => boolean;
  /** Damage the player. Returns false while they are invulnerable. */
  hurt: (dmg: number, from: THREE.Vector3) => boolean;
  burst: (at: THREE.Vector3, color: string, n: number) => void;
  shake: (amount: number) => void;
  emit: (e: CombatEvent) => void;
}

const WALL_H = 3.4;
/** Height of each foe's top, so you can jump clear of them. */
const HEAD: Record<FoeKind, number> = { bug: 0.72, creep: 1.12, flaky: 1.75, conflict: 1.05, halluc: 1.95, inject: 1.1 };
const TRIGGER = 5.5; // how close (south of a wall) before the fight starts
const RETREAT = 24; // walk this far away and the fight resets

// ── Glitch wall shader ──

function glitchMat(c1: string, c2: string, rep: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      t: { value: 0 },
      a: { value: 1 },
      c1: { value: new THREE.Color(c1) },
      c2: { value: new THREE.Color(c2) },
      rep: { value: rep },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float t; uniform float a; uniform vec3 c1; uniform vec3 c2; uniform float rep;
      varying vec2 vUv;
      float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec2 uv = vec2(vUv.x * rep, vUv.y);
        // Laser fence: posts, three beams, a faint field, and the odd glitch
        float post = smoothstep(0.035, 0.0, abs(fract(uv.x) - 0.5));
        float beams = 0.0;
        for (int i = 0; i < 3; i++) {
          float y = 0.18 + float(i) * 0.3 + sin(t * 2.0 + float(i)) * 0.01;
          beams += smoothstep(0.022, 0.0, abs(vUv.y - y));
        }
        float field = 0.06 + 0.04 * sin(vUv.y * 90.0 - t * 6.0);
        vec2 cell = floor(vec2(uv.x * 6.0, vUv.y * 12.0 + floor(t * 7.0)));
        float glitch = step(0.975, h(cell)) * 0.5;
        float floorLine = smoothstep(0.05, 0.0, vUv.y);
        float fade = smoothstep(1.0, 0.85, vUv.y);
        vec3 col = mix(c1, c2, vUv.y + glitch);
        float alpha = (field + beams * 0.9 + post * 0.7 + glitch + floorLine) * fade;
        gl_FragColor = vec4(col * (1.0 + beams + floorLine), a * alpha);
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

function textSprite(fonts: Fonts, text: string, color: string, w = 512, h = 96, size = 44) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.font = `600 ${size}px ${fonts.mono}`;
  const tw = Math.min(w - 8, ctx.measureText(text).width + 48);
  ctx.fillStyle = "rgba(14,14,20,0.82)";
  ctx.beginPath();
  ctx.roundRect((w - tw) / 2, 8, tw, h - 16, (h - 16) / 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true, fog: false }));
  s.scale.set(w / h, 1, 1);
  return s;
}

// ── Foes ──

interface Foe {
  kind: FoeKind;
  root: THREE.Group;
  model: THREE.Group;
  mats: THREE.MeshStandardMaterial[];
  base: number[];
  parts: THREE.Object3D[];
  label: THREE.Sprite;
  bar: THREE.Sprite;
  barBg: THREE.Sprite;
  hp: number;
  max: number;
  r: number;
  t: number;
  mode: string;
  modeT: number;
  cd: number;
  dir: THREE.Vector3;
  kb: THREE.Vector3;
  flash: number;
  spawn: number;
  dead: boolean;
  side: number;
}

interface Orb {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  dmg: number;
}

interface Shot {
  mesh: THREE.Mesh;
  target: Foe | "boss" | null;
  vel: THREE.Vector3;
  life: number;
  dmg: number;
}

interface Wave {
  mesh: THREE.Mesh;
  r: number;
  hit: boolean;
  dmg: number;
}

interface Wall {
  mesh: THREE.Mesh;
  label: THREE.Sprite;
  z: number;
  solid: boolean;
  fade: number; // 1 = fully there; dissolves to 0
}

const sharedGeo = {
  sphere: new THREE.SphereGeometry(1, 20, 14),
  ico: new THREE.IcosahedronGeometry(1, 2),
  octa: new THREE.OctahedronGeometry(1, 0),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  cone: new THREE.ConeGeometry(1, 1, 16),
  box: new RoundedBoxGeometry(1, 1, 1, 3, 0.12),
  orb: new THREE.SphereGeometry(0.2, 14, 10),
  ring: new THREE.RingGeometry(0.85, 1, 64),
};

function foeMats(kind: FoeKind) {
  const f = FOES[kind];
  const body = new THREE.MeshStandardMaterial({ color: f.color, emissive: f.glow, emissiveIntensity: 0.25, roughness: 0.4, metalness: 0.15 });
  const glow = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: f.glow, emissiveIntensity: 2.2, roughness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: "#121218", roughness: 0.6 });
  return { body, glow, dark };
}

function part(geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, sx: number, sy = sx, sz = sx) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  return m;
}

function buildFoe(kind: FoeKind, fonts: Fonts, labels: Map<FoeKind, THREE.SpriteMaterial>): Foe {
  const root = new THREE.Group();
  const model = new THREE.Group();
  root.add(model);
  const { body, glow, dark } = foeMats(kind);
  const parts: THREE.Object3D[] = [];
  let r = 0.5;
  let top = 1.2;

  if (kind === "bug") {
    model.add(part(sharedGeo.sphere, body, 0, 0.38, -0.05, 0.42, 0.28, 0.52));
    model.add(part(sharedGeo.sphere, dark, 0, 0.4, 0.42, 0.24));
    for (const s of [-1, 1]) {
      model.add(part(sharedGeo.sphere, glow, s * 0.1, 0.46, 0.6, 0.06));
      const ant = part(sharedGeo.cyl, dark, s * 0.08, 0.66, 0.55, 0.015, 0.32, 0.015);
      ant.rotation.set(0.6, 0, -s * 0.4);
      model.add(ant);
      for (let k = 0; k < 3; k++) {
        const pivot = new THREE.Group();
        pivot.position.set(s * 0.3, 0.32, -0.25 + k * 0.25);
        const leg = part(sharedGeo.cyl, dark, s * 0.2, -0.12, 0, 0.025, 0.42, 0.025);
        leg.rotation.z = s * 1.0;
        pivot.add(leg);
        model.add(pivot);
        parts.push(pivot);
      }
    }
    // Glowing stripe on the shell
    model.add(part(sharedGeo.box, glow, 0, 0.64, -0.05, 0.06, 0.04, 0.8));
    r = 0.5;
    top = 1.0;
  } else if (kind === "creep") {
    const blob = part(sharedGeo.ico, body, 0, 0.55, 0, 0.75, 0.6, 0.75);
    model.add(blob);
    parts.push(blob);
    for (const s of [-1, 1]) {
      model.add(part(sharedGeo.sphere, new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }), s * 0.22, 0.85, 0.58, 0.14));
      model.add(part(sharedGeo.sphere, dark, s * 0.22, 0.85, 0.7, 0.07));
    }
    model.add(part(sharedGeo.box, dark, 0, 0.55, 0.68, 0.36, 0.06, 0.06));
    r = 0.75;
    top = 1.5;
  } else if (kind === "flaky") {
    const gem = part(sharedGeo.octa, body, 0, 1.2, 0, 0.45, 0.6, 0.45);
    model.add(gem);
    parts.push(gem);
    model.add(part(sharedGeo.sphere, glow, 0, 1.2, 0, 0.16));
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 8, 40), glow);
    halo.position.y = 1.2;
    halo.rotation.x = Math.PI / 2.5;
    model.add(halo);
    parts.push(halo);
    r = 0.5;
    top = 2.1;
  } else if (kind === "conflict") {
    const red = new THREE.MeshStandardMaterial({ color: "#b3261e", emissive: "#ff5a5f", emissiveIntensity: 0.5, roughness: 0.35 });
    const green = new THREE.MeshStandardMaterial({ color: "#1e7a3a", emissive: "#4ade80", emissiveIntensity: 0.5, roughness: 0.35 });
    const spin = new THREE.Group();
    spin.position.y = 0.7;
    spin.add(part(sharedGeo.box, red, -0.34, 0, 0, 0.6));
    spin.add(part(sharedGeo.box, green, 0.34, 0, 0, 0.6));
    spin.add(part(sharedGeo.box, glow, 0, 0, 0, 0.08, 0.7, 0.7));
    model.add(spin);
    parts.push(spin);
    body.color.set("#3a3a3a");
    r = 0.7;
    top = 1.5;
  } else if (kind === "halluc") {
    body.transparent = true;
    body.opacity = 0.72;
    model.add(part(sharedGeo.sphere, body, 0, 1.55, 0, 0.38));
    const robe = part(sharedGeo.cone, body, 0, 0.95, 0, 0.45, 1.1, 0.45);
    robe.rotation.x = Math.PI;
    model.add(robe);
    parts.push(robe);
    for (const s of [-1, 1]) model.add(part(sharedGeo.sphere, glow, s * 0.13, 1.6, 0.32, 0.07, 0.1, 0.05));
    r = 0.5;
    top = 2.2;
  } else {
    // inject: a needle that points where it's going
    const needle = part(sharedGeo.cone, body, 0, 0.8, 0.15, 0.26, 1.1, 0.26);
    needle.rotation.x = Math.PI / 2;
    model.add(needle);
    model.add(part(sharedGeo.sphere, glow, 0, 0.8, -0.35, 0.2));
    for (const s of [-1, 1]) {
      const fin = part(sharedGeo.box, dark, s * 0.25, 0.8, -0.4, 0.4, 0.05, 0.3);
      fin.rotation.z = s * 0.3;
      model.add(fin);
    }
    r = 0.45;
    top = 1.5;
  }

  let lm = labels.get(kind);
  if (!lm) {
    lm = textSprite(fonts, FOES[kind].name, FOES[kind].glow).material;
    labels.set(kind, lm);
  }
  const label = new THREE.Sprite(lm);
  label.scale.set(1.6, 0.3, 1);
  label.position.y = top + 0.45;
  const barBg = new THREE.Sprite(new THREE.SpriteMaterial({ color: "#14141a", depthWrite: false, fog: false }));
  barBg.center.set(0, 0.5);
  barBg.scale.set(0.9, 0.07, 1);
  barBg.position.set(-0.45, top + 0.22, 0);
  const bar = new THREE.Sprite(new THREE.SpriteMaterial({ color: FOES[kind].glow, depthWrite: false, fog: false }));
  bar.center.set(0, 0.5);
  bar.scale.set(0.9, 0.07, 1);
  bar.position.set(-0.45, top + 0.22, 0.01);
  root.add(label, barBg, bar);

  const mats: THREE.MeshStandardMaterial[] = [];
  model.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m && !mats.includes(m)) mats.push(m);
  });
  const hp = FOES[kind].hp;
  return {
    kind,
    root,
    model,
    mats,
    base: mats.map((m) => m.emissiveIntensity),
    parts,
    label,
    bar,
    barBg,
    hp,
    max: hp,
    r,
    t: Math.random() * 3,
    mode: "move",
    modeT: 1 + Math.random(),
    cd: 1.5 + Math.random(),
    dir: new THREE.Vector3(),
    kb: new THREE.Vector3(),
    flash: 0,
    spawn: 0.7,
    dead: false,
    side: Math.random() < 0.5 ? -1 : 1,
  };
}

// ── The Black Box ──

class BlackBox {
  root = new THREE.Group();
  body: THREE.Mesh;
  bodyMat: THREE.MeshStandardMaterial;
  eye = new THREE.Group();
  iris: THREE.MeshStandardMaterial;
  sats: THREE.Mesh[] = [];
  shadow: THREE.Mesh;
  hp = BOSS.hp;
  max = BOSS.hp;
  mode: "dormant" | "wake" | "drift" | "rise" | "hang" | "drop" | "stunned" | "volleyTell" | "chargeTell" | "charge" | "dying" | "dead" = "dormant";
  modeT = 0;
  y = 1.7;
  flash = 0;
  phase = 1;
  summoned = 0;
  pos: THREE.Vector3;
  dir = new THREE.Vector3();
  next = 0;

  constructor(scene: THREE.Scene) {
    this.pos = new THREE.Vector3(BOSS.arena.x, 0, BOSS.arena.z - 3);
    this.bodyMat = new THREE.MeshStandardMaterial({ color: "#0c0c12", metalness: 0.65, roughness: 0.28, emissive: "#ff3d8b", emissiveIntensity: 0.04 });
    this.body = new THREE.Mesh(new RoundedBoxGeometry(3, 3, 3, 4, 0.22), this.bodyMat);
    this.body.castShadow = true;
    const seams = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.04, 3.04, 3.04)),
      new THREE.LineBasicMaterial({ color: "#ff3d8b", toneMapped: false }),
    );
    // Glowing grooves across each face
    const grooveMat = new THREE.MeshStandardMaterial({ color: "#000000", emissive: "#ff3d8b", emissiveIntensity: 1.6, toneMapped: false });
    for (const [x, y, z, sx, sy, sz] of [
      [0, 0.55, 1.51, 2.4, 0.04, 0.02],
      [0, -0.75, 1.51, 2.4, 0.04, 0.02],
      [1.51, 0, 0, 0.02, 0.04, 2.4],
      [-1.51, 0, 0, 0.02, 0.04, 2.4],
      [0, 1.51, 0, 2.4, 0.02, 0.04],
    ] as const) {
      const g = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), grooveMat);
      g.position.set(x, y, z);
      g.scale.set(sx, sy, sz);
      this.body.add(g);
    }
    this.body.add(seams);
    // The eye
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 18), new THREE.MeshStandardMaterial({ color: "#f4f1ea", roughness: 0.25 }));
    white.scale.z = 0.35;
    this.iris = new THREE.MeshStandardMaterial({ color: "#ffb347", emissive: "#ff8a3d", emissiveIntensity: 1.8, toneMapped: false });
    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.34, 28), this.iris);
    iris.position.z = 0.22;
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20), new THREE.MeshBasicMaterial({ color: "#050505" }));
    pupil.position.z = 0.225;
    this.eye.add(white, iris, pupil);
    this.eye.position.set(0, -0.1, 1.5);
    this.body.add(this.eye);
    this.root.add(this.body);
    // Orbiting satellites
    const satGeo = new RoundedBoxGeometry(0.5, 0.5, 0.5, 2, 0.08);
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(satGeo, this.bodyMat);
      s.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.52, 0.52, 0.52)), seams.material));
      s.castShadow = true;
      this.sats.push(s);
      this.root.add(s);
    }
    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.8, 40),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.35, depthWrite: false }),
    );
    this.shadow.rotation.x = -Math.PI / 2;
    scene.add(this.root, this.shadow);
    this.place();
  }

  place() {
    this.root.position.set(this.pos.x, this.y, this.pos.z);
    this.shadow.position.set(this.pos.x, 0.04, this.pos.z);
    const k = THREE.MathUtils.clamp(1 - (this.y - 1.7) / 7, 0.35, 1);
    this.shadow.scale.setScalar(this.mode === "hang" || this.mode === "rise" ? 1.1 : k);
    (this.shadow.material as THREE.MeshBasicMaterial).opacity = this.mode === "hang" ? 0.6 : 0.35 * k;
  }

  get alive() {
    return this.mode !== "dying" && this.mode !== "dead";
  }
  get vulnerable() {
    return this.alive && this.mode !== "dormant" && this.mode !== "wake" && this.y < 3.8;
  }
}

// ── Combat ──

export class Combat {
  private foes: Foe[] = [];
  private orbs: Orb[] = [];
  private shots: Shot[] = [];
  private waves: Wave[] = [];
  private walls: Wall[] = [];
  private bossWall: Wall;
  private ring: THREE.Mesh;
  private ringMat: THREE.ShaderMaterial;
  private boss: BlackBox;
  private labels = new Map<FoeKind, THREE.SpriteMaterial>();
  private cleared = new Set<number>();
  private medalsDone = false;
  /** -1: none, 0..n: a street fight, "boss" */
  private active: number | "boss" = -1;
  private lastLeft = -1;
  private wallPing = 0;
  private orbMat = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#a78bfa", emissiveIntensity: 3, toneMapped: false });
  private bossOrbMat = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ff3d8b", emissiveIntensity: 3, toneMapped: false });
  private shotMat = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#7dd3fc", emissiveIntensity: 3.5, toneMapped: false });
  private waveMat = new THREE.MeshBasicMaterial({ color: "#ff3d8b", transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  bossDown = false;

  constructor(
    private host: CombatHost,
    private fonts: Fonts,
  ) {
    const scene = host.scene;
    FIGHTS.forEach((f, i) => {
      const mat = glitchMat("#ff2e63", "#b517ff", (FIGHT_SPAN * 2) / 3);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(FIGHT_SPAN * 2, WALL_H), mat);
      mesh.position.set(0, WALL_H / 2, f.z);
      mesh.renderOrder = 2;
      const label = textSprite(fonts, `⚠ ${f.name.toUpperCase()}`, "#ff8fa3", 768, 96, 46);
      label.scale.set(6.4, 0.8, 1);
      label.position.set(0, WALL_H + 0.9, f.z);
      scene.add(mesh, label);
      this.walls.push({ mesh, label, z: f.z, solid: !this.cleared.has(i), fade: 1 });
    });
    {
      const mat = glitchMat("#ff3d8b", "#ffb347", (FIGHT_SPAN * 2) / 3);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(FIGHT_SPAN * 2, WALL_H + 1), mat);
      mesh.position.set(0, (WALL_H + 1) / 2, BOSS.gateZ);
      mesh.renderOrder = 2;
      const label = textSprite(fonts, "⚠ THE BLACK BOX · AI MASTERS ONLY", "#ffb347", 1024, 96, 44);
      label.scale.set(9.6, 0.9, 1);
      label.position.set(0, WALL_H + 2, BOSS.gateZ);
      scene.add(mesh, label);
      this.bossWall = { mesh, label, z: BOSS.gateZ, solid: true, fade: 1 };
    }
    this.ringMat = glitchMat("#ff3d8b", "#b517ff", (BOSS.arena.r * Math.PI * 2) / 3);
    this.ring = new THREE.Mesh(new THREE.CylinderGeometry(BOSS.arena.r, BOSS.arena.r, WALL_H, 72, 1, true), this.ringMat);
    this.ring.position.set(BOSS.arena.x, WALL_H / 2, BOSS.arena.z);
    this.ring.visible = false;
    this.ring.renderOrder = 2;
    scene.add(this.ring);
    this.boss = new BlackBox(scene);
  }

  // ── State ──

  /** Restore saved progress. */
  setState(cleared: Iterable<number>, bossDown: boolean, medalsDone: boolean) {
    this.cleared = new Set(cleared);
    this.bossDown = bossDown;
    this.medalsDone = medalsDone;
    this.walls.forEach((w, i) => {
      const open = this.cleared.has(i);
      w.solid = !open;
      if (open) w.fade = Math.min(w.fade, 0);
      else w.fade = 1;
    });
    this.bossWall.solid = !medalsDone && !bossDown;
    if (this.bossWall.solid) this.bossWall.fade = 1;
    if (bossDown) {
      this.boss.mode = "dead";
      this.boss.root.visible = false;
      this.boss.shadow.visible = false;
    } else if (this.boss.mode === "dead") {
      this.boss.mode = "dormant";
      this.boss.hp = this.boss.max;
      this.boss.root.visible = true;
      this.boss.shadow.visible = true;
      this.boss.y = 1.7;
      this.boss.pos.set(BOSS.arena.x, 0, BOSS.arena.z - 3);
    }
  }

  get fighting() {
    return this.active !== -1;
  }
  get bossFight() {
    return this.active === "boss";
  }
  /** Where to put the player back after a knockout. */
  safeSpot(): THREE.Vector3 {
    if (this.active === "boss") return new THREE.Vector3(0, 0, BOSS.gateZ + 6);
    if (typeof this.active === "number" && this.active >= 0) return new THREE.Vector3(0, 0, FIGHTS[this.active].z + 10);
    return new THREE.Vector3(0, 0, this.host.player.z);
  }

  /** Does moving from (x, fromZ) to (x, toZ) / (toX, …) run into a wall or the arena ring? */
  blocks(x: number, fromZ: number, toZ: number, r: number) {
    const check = (wz: number) => {
      if (Math.abs(x) > FIGHT_SPAN) return false;
      const a = fromZ - wz;
      const b = toZ - wz;
      if (Math.sign(a) !== Math.sign(b) && a !== 0) return true;
      return Math.abs(b) < r + 0.15 && Math.abs(b) <= Math.abs(a);
    };
    for (const w of this.walls) if (w.solid && check(w.z)) return true;
    if (this.bossWall.solid && check(this.bossWall.z)) {
      if (this.wallPing <= 0) {
        this.wallPing = 4;
        this.host.emit({ type: "bossWall" });
      }
      return true;
    }
    return false;
  }
  /** z of every wall that is up right now (traffic and people turn around at them). */
  solidWalls(): number[] {
    const out = this.walls.filter((w) => w.solid).map((w) => w.z);
    if (this.bossWall.solid) out.push(this.bossWall.z);
    return out;
  }

  /** Driving into foes. Returns true if the car hit the Box (and should bounce). */
  ram(at: THREE.Vector3, speed: number, dmg: number) {
    const s = Math.abs(speed);
    if (s < 5) return false;
    for (const f of this.foes) {
      if (f.dead || f.spawn > 0 || f.flash > 0) continue;
      if (Math.hypot(f.root.position.x - at.x, f.root.position.z - at.z) < f.r + 1.6) this.damageFoe(f, dmg + s * 0.15, at);
    }
    const b = this.boss;
    if (this.active === "boss" && b.vulnerable && b.flash <= 0 && Math.hypot(b.pos.x - at.x, b.pos.z - at.z) < 2.9) {
      this.damageBoss(dmg, at);
      return true;
    }
    return false;
  }

  /** Keep the player inside the arena during the boss fight. */
  outsideArena(x: number, z: number, r: number) {
    if (this.active !== "boss") return false;
    return Math.hypot(x - BOSS.arena.x, z - BOSS.arena.z) > BOSS.arena.r - r - 0.2;
  }

  /** Called when the player is knocked out: everything resets but the Box keeps its damage. */
  reset() {
    for (const f of this.foes) this.removeFoe(f);
    this.foes = [];
    this.clearProjectiles();
    if (this.active === "boss" && this.boss.alive) {
      this.boss.mode = "dormant";
      this.boss.y = 1.7;
      this.boss.pos.set(BOSS.arena.x, 0, BOSS.arena.z - 3);
      this.boss.eye.scale.y = 0.1;
      this.boss.place();
      this.host.emit({ type: "boss", hp: this.boss.hp, max: this.boss.max, phase: this.boss.phase, awake: false });
    }
    this.ring.visible = false;
    this.active = -1;
  }

  // ── Player attacks ──

  /** Nearest thing to hit, for aim assist. */
  nearest(p: THREE.Vector3, maxD: number): THREE.Vector3 | null {
    let best: THREE.Vector3 | null = null;
    let bd = maxD;
    for (const f of this.foes) {
      if (f.dead || f.spawn > 0) continue;
      const d = Math.hypot(f.root.position.x - p.x, f.root.position.z - p.z) - f.r;
      if (d < bd) {
        bd = d;
        best = f.root.position;
      }
    }
    if (this.active === "boss" && this.boss.vulnerable) {
      const d = Math.hypot(this.boss.pos.x - p.x, this.boss.pos.z - p.z) - 1.7;
      if (d < bd) best = this.boss.pos;
    }
    return best;
  }

  /** A melee strike. arc is the half-angle in radians (π = all around). Returns hits. */
  strike(p: THREE.Vector3, yaw: number, reach: number, arc: number, dmg: number) {
    let hits = 0;
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const inArc = (x: number, z: number, r: number) => {
      const dx = x - p.x;
      const dz = z - p.z;
      const d = Math.hypot(dx, dz);
      if (d - r > reach) return false;
      if (arc >= Math.PI || d < r + 0.2) return true;
      return Math.acos(THREE.MathUtils.clamp((dx * fx + dz * fz) / (d || 1), -1, 1)) < arc;
    };
    for (const f of this.foes) {
      if (f.dead || f.spawn > 0 || (f.kind === "flaky" && f.mode === "blink")) continue;
      if (!inArc(f.root.position.x, f.root.position.z, f.r)) continue;
      this.damageFoe(f, dmg, p);
      hits++;
    }
    if (this.active === "boss" && this.boss.vulnerable && inArc(this.boss.pos.x, this.boss.pos.z, 1.75)) {
      this.damageBoss(dmg, p);
      hits++;
    }
    return hits;
  }

  /**
   * A bullet: a flat ray from `o` along `dir` (unit, xz) up to `range`.
   * Hits the first foe or the Box in its path. Returns how far it went and
   * the height to draw the tracer to.
   */
  shoot(o: THREE.Vector3, dir: THREE.Vector3, range: number, dmg: number) {
    let best = range;
    let target: Foe | "boss" | null = null;
    const test = (cx: number, cz: number, r: number) => {
      const wx = cx - o.x;
      const wz = cz - o.z;
      const t = wx * dir.x + wz * dir.z;
      if (t < 0) return -1;
      const perp2 = wx * wx + wz * wz - t * t;
      if (perp2 > r * r) return -1;
      return Math.max(0, t - Math.sqrt(r * r - perp2));
    };
    for (const f of this.foes) {
      if (f.dead || f.spawn > 0 || (f.kind === "flaky" && f.mode === "blink")) continue;
      const t = test(f.root.position.x, f.root.position.z, f.r + 0.25);
      if (t >= 0 && t < best) {
        best = t;
        target = f;
      }
    }
    const b = this.boss;
    if (this.active === "boss" && b.alive && b.mode !== "dormant" && b.y < 4.5) {
      const t = test(b.pos.x, b.pos.z, 1.9);
      if (t >= 0 && t < best) {
        best = t;
        target = "boss";
      }
    }
    let y = o.y;
    if (target === "boss") {
      y = b.y;
      if (b.vulnerable) this.damageBoss(dmg, o, true);
      else this.host.burst(o.clone().addScaledVector(dir, best).setY(b.y), "#9a9aa8", 4);
    } else if (target) {
      y = 0.4 + HEAD[target.kind] * 0.5 + target.model.position.y;
      this.damageFoe(target, dmg, o, 0.3);
    }
    return { dist: best, hit: target !== null, y };
  }

  /** Nudge an aim direction onto a foe inside a small cone. */
  aimAssist(o: THREE.Vector3, yaw: number, cone: number, range: number) {
    let bestA = cone;
    let out: number | null = null;
    const consider = (x: number, z: number) => {
      const d = Math.hypot(x - o.x, z - o.z);
      if (d > range) return;
      const a = Math.atan2(x - o.x, z - o.z);
      let da = a - yaw;
      da = Math.abs(Math.atan2(Math.sin(da), Math.cos(da)));
      if (da < bestA) {
        bestA = da;
        out = a;
      }
    };
    for (const f of this.foes) if (!f.dead && f.spawn <= 0) consider(f.root.position.x, f.root.position.z);
    if (this.active === "boss" && this.boss.vulnerable) consider(this.boss.pos.x, this.boss.pos.z);
    return out;
  }

  /** The companion fires itself at the nearest target. */
  blast(from: THREE.Vector3, yaw: number, dmg: number) {
    let target: Foe | "boss" | null = null;
    let bd = 16;
    for (const f of this.foes) {
      if (f.dead || f.spawn > 0) continue;
      const d = f.root.position.distanceTo(from);
      if (d < bd) {
        bd = d;
        target = f;
      }
    }
    if (this.active === "boss" && this.boss.vulnerable && this.boss.pos.distanceTo(from) < bd + 2) target = "boss";
    const mesh = new THREE.Mesh(sharedGeo.orb, this.shotMat);
    mesh.scale.setScalar(1.4);
    mesh.position.copy(from);
    this.host.scene.add(mesh);
    this.shots.push({ mesh, target, vel: new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(14), life: 1.6, dmg });
  }

  private damageFoe(f: Foe, dmg: number, from: THREE.Vector3, kb = 1) {
    f.hp -= dmg;
    f.flash = 0.14;
    const away = new THREE.Vector3(f.root.position.x - from.x, 0, f.root.position.z - from.z).normalize();
    f.kb.copy(away).multiplyScalar((f.kind === "creep" ? 3 : 7) * kb);
    this.host.burst(f.root.position.clone().setY(0.9), FOES[f.kind].glow, kb < 1 ? 6 : 14);
    if (f.hp <= 0) {
      f.dead = true;
      this.host.burst(f.root.position.clone().setY(0.8), FOES[f.kind].glow, 50);
      this.host.shake(0.18);
      this.removeFoe(f);
    }
  }

  private damageBoss(dmg: number, from: THREE.Vector3, quiet = false) {
    const b = this.boss;
    // Armoured most of the time; wide open while dazed after a slam or a crash
    const mult = b.mode === "stunned" ? 1.5 : 0.4;
    b.hp = Math.max(0, b.hp - dmg * mult);
    b.flash = 0.08;
    if (!quiet) {
      this.host.burst(b.pos.clone().setY(b.y), mult > 1 ? "#ffb347" : "#9a9aa8", mult > 1 ? 30 : 10);
      this.host.shake(mult > 1 ? 0.22 : 0.06);
    }
    void from;
    this.emitBoss();
    if (b.hp <= 0) {
      b.mode = "dying";
      b.modeT = 2.4;
      for (const f of this.foes) {
        f.dead = true;
        this.removeFoe(f);
      }
      this.clearProjectiles();
    }
  }

  private emitBoss() {
    const b = this.boss;
    this.host.emit({ type: "boss", hp: b.hp, max: b.max, phase: b.phase, awake: b.mode !== "dormant" });
  }

  private removeFoe(f: Foe) {
    this.host.scene.remove(f.root);
    f.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.material && !(o instanceof THREE.Sprite)) {
        const mat = m.material as THREE.Material;
        if (mat !== this.orbMat) mat.dispose();
      }
    });
    (f.bar.material as THREE.Material).dispose();
    (f.barBg.material as THREE.Material).dispose();
  }

  // ── Spawning ──

  private spawnFoe(kind: FoeKind, x: number, z: number) {
    const f = buildFoe(kind, this.fonts, this.labels);
    f.root.position.set(x, 0, z);
    f.root.scale.setScalar(0.01);
    this.host.scene.add(f.root);
    this.host.burst(new THREE.Vector3(x, 0.8, z), FOES[kind].glow, 30);
    this.foes.push(f);
    return f;
  }

  private startFight(idx: number) {
    const f = FIGHTS[idx];
    this.active = idx;
    const n = f.foes.length;
    f.foes.forEach((k, i) => {
      const x = (i - (n - 1) / 2) * 3 + (Math.random() - 0.5);
      // They glitch through the wall onto your side, and can't go back
      this.spawnFoe(k, x, f.z + 1.2 + Math.random() * 1.2);
    });
    this.host.shake(0.15);
    this.lastLeft = n;
    this.host.emit({ type: "fight", idx, name: f.name, intro: f.intro, left: n });
  }

  private startBoss() {
    this.active = "boss";
    this.ring.visible = true;
    this.ringMat.uniforms.a.value = 0;
    const b = this.boss;
    if (b.mode === "dormant") {
      b.mode = "wake";
      b.modeT = 1.6;
    }
    this.emitBoss();
  }

  // ── Update ──

  update(dt: number, t: number, live: boolean) {
    const p = this.host.player;
    this.wallPing -= dt;

    // Walls shimmer, and dissolve once beaten
    for (const w of [...this.walls, this.bossWall]) {
      const m = w.mesh.material as THREE.ShaderMaterial;
      m.uniforms.t.value = t;
      if (!w.solid && w.fade > 0) w.fade = Math.max(0, w.fade - dt * 0.8);
      m.uniforms.a.value = w.fade;
      w.mesh.visible = w.fade > 0.001;
      w.label.visible = w.fade > 0.5;
      w.mesh.scale.y = 0.2 + 0.8 * w.fade;
      w.mesh.position.y = (w.mesh.geometry as THREE.PlaneGeometry).parameters.height * w.mesh.scale.y * 0.5;
    }
    this.ringMat.uniforms.t.value = t;
    if (this.ring.visible) {
      const want = this.active === "boss" ? 1 : 0;
      this.ringMat.uniforms.a.value += (want - this.ringMat.uniforms.a.value) * Math.min(1, dt * 3);
      if (want === 0 && this.ringMat.uniforms.a.value < 0.02) this.ring.visible = false;
    }
    this.animateBoss(dt, t, live);
    if (!live) return;

    // Start / abandon a street fight
    if (this.active === -1) {
      FIGHTS.forEach((f, i) => {
        if (this.active !== -1 || this.cleared.has(i)) return;
        if (Math.abs(p.x) < FIGHT_SPAN && p.z > f.z && p.z - f.z < TRIGGER) this.startFight(i);
      });
      if (
        this.active === -1 &&
        !this.bossDown &&
        this.medalsDone &&
        p.z < BOSS.gateZ - 1 &&
        Math.hypot(p.x - BOSS.arena.x, p.z - BOSS.arena.z) < BOSS.arena.r - 1.2
      )
        this.startBoss();
    } else if (typeof this.active === "number") {
      const f = FIGHTS[this.active];
      if (p.z - f.z > RETREAT) {
        for (const x of this.foes) this.removeFoe(x);
        this.foes = [];
        this.active = -1;
        this.clearProjectiles();
        this.host.emit({ type: "retreat" });
      }
    }

    this.updateFoes(dt, p);
    this.updateProjectiles(dt, p);

    // Street fight won?
    if (typeof this.active === "number" && this.active >= 0) {
      const left = this.foes.filter((f) => !f.dead).length;
      if (left !== this.lastLeft) {
        this.lastLeft = left;
        if (left > 0) this.host.emit({ type: "left", left });
      }
      if (left === 0) {
        const idx = this.active;
        this.cleared.add(idx);
        this.walls[idx].solid = false;
        this.foes = [];
        this.active = -1;
        this.clearProjectiles();
        this.host.burst(new THREE.Vector3(p.x, 1.5, FIGHTS[idx].z), "#ff8fa3", 90);
        this.host.emit({ type: "cleared", idx });
      }
    }
  }

  private updateFoes(dt: number, p: THREE.Vector3) {
    const tmp = new THREE.Vector3();
    for (const f of this.foes) {
      if (f.dead) continue;
      f.t += dt;
      const pos = f.root.position;
      const dx = p.x - pos.x;
      const dz = p.z - pos.z;
      const d = Math.hypot(dx, dz) || 0.001;
      const ux = dx / d;
      const uz = dz / d;
      let vx = 0;
      let vz = 0;
      let face = Math.atan2(dx, dz);
      let solid = true;

      // Materialise
      if (f.spawn > 0) {
        f.spawn -= dt;
        const k = 1 - Math.max(0, f.spawn) / 0.7;
        f.root.scale.setScalar(Math.max(0.01, k));
        f.root.rotation.y = face;
        continue;
      }

      switch (f.kind) {
        case "bug": {
          const sp = 2.9 + Math.sin(f.t * 3) * 0.4;
          vx = ux * sp + -uz * Math.sin(f.t * 4) * 0.9 * f.side;
          vz = uz * sp + ux * Math.sin(f.t * 4) * 0.9 * f.side;
          f.parts.forEach((leg, i) => (leg.rotation.x = Math.sin(f.t * 22 + i * 1.7) * 0.5));
          f.model.position.y = Math.abs(Math.sin(f.t * 11)) * 0.05;
          break;
        }
        case "creep": {
          const grow = 1 + Math.min(1, f.t / 16) * 0.9;
          f.model.scale.setScalar(grow);
          f.r = 0.75 * grow;
          vx = ux * 1.5;
          vz = uz * 1.5;
          const blob = f.parts[0];
          blob.scale.set(0.75 + Math.sin(f.t * 4) * 0.05, 0.6 - Math.sin(f.t * 4) * 0.05, 0.75);
          break;
        }
        case "flaky": {
          f.modeT -= dt;
          f.parts[0].rotation.y += dt * 3;
          f.parts[1].rotation.z += dt * 2;
          if (f.mode === "blink") {
            solid = false;
            f.model.scale.setScalar(Math.max(0.01, Math.abs(f.modeT - 0.15) / 0.15));
            if (f.modeT < 0.15 && f.dir.lengthSq() > 0) {
              pos.copy(f.dir);
              f.dir.set(0, 0, 0);
            }
            if (f.modeT <= 0) {
              f.mode = "move";
              f.modeT = 1.5 + Math.random() * 0.6;
              f.model.scale.setScalar(1);
            }
          } else {
            vx = ux * 1.4;
            vz = uz * 1.4;
            f.model.position.y = Math.sin(f.t * 3) * 0.12;
            if (f.modeT <= 0) {
              f.mode = "blink";
              f.modeT = 0.3;
              const a = Math.random() * Math.PI * 2;
              const rr = 2.4 + Math.random() * 2;
              f.dir.set(THREE.MathUtils.clamp(p.x + Math.cos(a) * rr, -9, 9), 0, p.z + Math.sin(a) * rr);
              this.confine(f.dir, f.r);
              this.host.burst(pos.clone().setY(1.2), FOES.flaky.glow, 12);
            }
          }
          break;
        }
        case "conflict": {
          f.modeT -= dt;
          f.parts[0].rotation.y += dt * (f.mode === "tell" ? 18 : f.mode === "charge" ? 10 : 3);
          if (f.mode === "move") {
            vx = ux * 2.4;
            vz = uz * 2.4;
            if (f.modeT <= 0 && d < 8) {
              f.mode = "tell";
              f.modeT = 0.65;
              f.dir.set(ux, 0, uz);
            }
          } else if (f.mode === "tell") {
            face = Math.atan2(f.dir.x, f.dir.z);
            f.model.position.x = Math.sin(f.t * 60) * 0.05;
            if (f.modeT <= 0) {
              f.mode = "charge";
              f.modeT = 0.5;
            }
          } else if (f.mode === "charge") {
            face = Math.atan2(f.dir.x, f.dir.z);
            vx = f.dir.x * 11;
            vz = f.dir.z * 11;
            if (f.modeT <= 0) {
              f.mode = "rest";
              f.modeT = 0.8;
            }
          } else if (f.modeT <= 0) {
            f.mode = "move";
            f.modeT = 1.6 + Math.random();
          }
          break;
        }
        case "halluc": {
          const want = d < 5 ? -1.8 : d > 8 ? 1.8 : 0;
          vx = ux * want + -uz * 1.2 * f.side;
          vz = uz * want + ux * 1.2 * f.side;
          f.model.position.y = Math.sin(f.t * 2) * 0.15;
          f.parts[0].rotation.y += dt;
          f.cd -= dt;
          if (f.cd <= 0 && d < 14) {
            f.cd = 2.3;
            this.fireOrb(pos.clone().setY(1.0), new THREE.Vector3(ux, 0, uz).multiplyScalar(6.5), this.orbMat, 1);
          }
          if (Math.random() < dt * 0.4) f.side *= -1;
          break;
        }
        case "inject": {
          f.modeT -= dt;
          if (f.mode === "move") {
            const want = d > 6 ? 2.6 : d < 4 ? -1.5 : 0;
            vx = ux * want + -uz * 3 * f.side;
            vz = uz * want + ux * 3 * f.side;
            if (f.modeT <= 0) {
              f.mode = "tell";
              f.modeT = 0.6;
              f.dir.set(ux, 0, uz);
            }
          } else if (f.mode === "tell") {
            f.dir.set(ux, 0, uz);
            face = Math.atan2(ux, uz);
            for (const m of f.mats) m.emissiveIntensity = 1 + Math.sin(f.t * 40) * 1.2;
            if (f.modeT <= 0) {
              f.mode = "dash";
              f.modeT = 0.38;
            }
          } else if (f.mode === "dash") {
            face = Math.atan2(f.dir.x, f.dir.z);
            vx = f.dir.x * 15;
            vz = f.dir.z * 15;
            if (f.modeT <= 0) {
              f.mode = "move";
              f.modeT = 1.3 + Math.random() * 0.8;
              f.side = Math.random() < 0.5 ? -1 : 1;
            }
          }
          break;
        }
      }

      // Knockback, separation, move with collisions
      f.kb.multiplyScalar(Math.exp(-dt * 7));
      vx += f.kb.x;
      vz += f.kb.z;
      for (const o of this.foes) {
        if (o === f || o.dead) continue;
        tmp.subVectors(pos, o.root.position).setY(0);
        const sd = tmp.length();
        const min = f.r + o.r;
        if (sd < min && sd > 0.001) {
          vx += (tmp.x / sd) * (min - sd) * 6;
          vz += (tmp.z / sd) * (min - sd) * 6;
        }
      }
      const nx = THREE.MathUtils.clamp(pos.x + vx * dt, BOUNDS.minX + 1, BOUNDS.maxX - 1);
      const nz = THREE.MathUtils.clamp(pos.z + vz * dt, BOUNDS.minZ + 1, BOUNDS.maxZ - 1);
      if (!this.host.blocked(nx, pos.z, f.r)) pos.x = nx;
      if (!this.host.blocked(pos.x, nz, f.r)) pos.z = nz;
      this.confine(pos, f.r);
      let dy = face - f.root.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      f.root.rotation.y += dy * Math.min(1, dt * 10);

      // Hit flash + HP bar
      f.flash -= dt;
      if (f.kind !== "inject" || f.mode !== "tell") {
        f.mats.forEach((m, i) => (m.emissiveIntensity = f.flash > 0 ? 3 : f.base[i]));
      }
      const k = Math.max(0, f.hp / f.max);
      f.bar.scale.x = 0.9 * k;
      f.bar.visible = f.barBg.visible = k < 1;
      f.root.scale.setScalar(f.flash > 0 ? 1.12 : 1);

      const top = HEAD[f.kind] * (f.kind === "creep" ? f.model.scale.y : 1) + f.model.position.y;
      // Touch damage
      if (solid && d < f.r + 0.4 && p.y < top - 0.35) {
        const dmg = f.kind === "conflict" && f.mode === "charge" ? 2 : 1;
        if (this.host.hurt(dmg, pos)) f.kb.set(-ux, 0, -uz).multiplyScalar(4);
      }
    }
  }

  /** Keep foes where you can reach them: in front of the wall, or inside the arena. */
  private confine(pos: THREE.Vector3, r: number) {
    if (this.active === "boss") {
      const ox = pos.x - BOSS.arena.x;
      const oz = pos.z - BOSS.arena.z;
      const od = Math.hypot(ox, oz);
      const lim = BOSS.arena.r - r - 0.3;
      if (od > lim) {
        pos.x = BOSS.arena.x + (ox / od) * lim;
        pos.z = BOSS.arena.z + (oz / od) * lim;
      }
    } else if (typeof this.active === "number" && this.active >= 0) {
      pos.z = Math.max(pos.z, FIGHTS[this.active].z + r + 0.3);
    }
  }

  private clearProjectiles() {
    for (const o of this.orbs) this.host.scene.remove(o.mesh);
    this.orbs = [];
    for (const w of this.waves) {
      this.host.scene.remove(w.mesh);
      (w.mesh.material as THREE.Material).dispose();
    }
    this.waves = [];
  }

  private fireOrb(at: THREE.Vector3, vel: THREE.Vector3, mat: THREE.Material, dmg: number) {
    const mesh = new THREE.Mesh(sharedGeo.orb, mat);
    mesh.position.copy(at);
    this.host.scene.add(mesh);
    this.orbs.push({ mesh, vel, life: 3.2, dmg });
  }

  private updateProjectiles(dt: number, p: THREE.Vector3) {
    // Enemy orbs: jump over them
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const o = this.orbs[i];
      o.life -= dt;
      o.mesh.position.addScaledVector(o.vel, dt);
      o.mesh.scale.setScalar(1 + Math.sin(o.life * 30) * 0.15);
      const hit = Math.hypot(o.mesh.position.x - p.x, o.mesh.position.z - p.z) < 0.5 && p.y < 0.6;
      if (hit) this.host.hurt(o.dmg, o.mesh.position);
      if (hit || o.life <= 0 || this.host.blocked(o.mesh.position.x, o.mesh.position.z, 0.1)) {
        this.host.scene.remove(o.mesh);
        this.orbs.splice(i, 1);
      }
    }
    // The companion's shots home in
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.life -= dt;
      let tgt: THREE.Vector3 | null = null;
      if (s.target === "boss") tgt = this.boss.alive ? this.boss.pos.clone().setY(this.boss.y) : null;
      else if (s.target && !s.target.dead) tgt = s.target.root.position.clone().setY(0.8);
      if (tgt) {
        const want = tgt.clone().sub(s.mesh.position).normalize().multiplyScalar(16);
        s.vel.lerp(want, Math.min(1, dt * 8));
      }
      s.mesh.position.addScaledVector(s.vel, dt);
      let done = s.life <= 0;
      if (tgt && s.mesh.position.distanceTo(tgt) < (s.target === "boss" ? 1.8 : 0.7)) {
        if (s.target === "boss") {
          if (this.boss.vulnerable) this.damageBoss(s.dmg, s.mesh.position);
        } else if (s.target) this.damageFoe(s.target, s.dmg, s.mesh.position);
        done = true;
      }
      if (done) {
        this.host.burst(s.mesh.position.clone(), "#7dd3fc", 18);
        this.host.scene.remove(s.mesh);
        this.shots.splice(i, 1);
      }
    }
    // Shockwaves: jump them
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.r += dt * 8.5;
      w.mesh.scale.setScalar(w.r);
      (w.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 * (1 - w.r / (BOSS.arena.r + 1)));
      const d = Math.hypot(p.x - w.mesh.position.x, p.z - w.mesh.position.z);
      if (!w.hit && Math.abs(d - w.r) < 0.45 && p.y < 0.35) {
        w.hit = this.host.hurt(w.dmg, w.mesh.position);
      }
      if (w.r > BOSS.arena.r + 1) {
        this.host.scene.remove(w.mesh);
        (w.mesh.material as THREE.Material).dispose();
        this.waves.splice(i, 1);
      }
    }
  }

  // ── The boss brain ──

  private animateBoss(dt: number, t: number, live: boolean) {
    const b = this.boss;
    if (b.mode === "dead") return;
    const p = this.host.player;

    // Satellites orbit; tighter and faster when angry
    const fast = b.phase === 3 ? 2.2 : b.phase === 2 ? 1.6 : 1;
    b.sats.forEach((s, i) => {
      const a = t * fast + (i * Math.PI) / 2;
      const rr = b.mode === "stunned" ? 0 : 2.7;
      s.position.set(Math.cos(a) * rr, b.mode === "stunned" ? -b.y + 0.3 : Math.sin(t * 2 + i) * 0.4, Math.sin(a) * rr);
      s.rotation.set(t + i, t * 1.3, 0);
    });
    b.flash -= dt;
    b.bodyMat.emissiveIntensity = b.flash > 0 ? 0.9 : b.mode === "stunned" ? 0.02 : b.mode === "volleyTell" || b.mode === "chargeTell" ? 0.25 + Math.sin(t * 30) * 0.2 : 0.04;
    b.iris.emissiveIntensity = b.mode === "stunned" ? 0.2 : 1.8;

    if (b.mode === "dormant") {
      b.eye.scale.y = 0.08;
      b.y = 1.7 + Math.sin(t) * 0.05;
      b.root.rotation.y = 0;
      b.place();
      return;
    }

    // Face the player
    const dx = p.x - b.pos.x;
    const dz = p.z - b.pos.z;
    const d = Math.hypot(dx, dz) || 0.001;
    let dy = Math.atan2(dx, dz) - b.root.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    if (b.mode !== "charge" && b.mode !== "stunned") b.root.rotation.y += dy * Math.min(1, dt * 4);
    b.eye.scale.y = THREE.MathUtils.lerp(b.eye.scale.y, b.mode === "stunned" ? 0.25 : 1, Math.min(1, dt * 6));
    // Pupil tracks the player a little
    b.eye.rotation.x = THREE.MathUtils.clamp(-(p.y + 1 - b.y) * 0.1, -0.3, 0.3);

    if (!live && b.mode !== "dying") {
      b.place();
      return;
    }

    b.modeT -= dt;
    const phase = b.hp > b.max * 0.66 ? 1 : b.hp > b.max * 0.33 ? 2 : 3;
    if (phase !== b.phase && b.alive) {
      b.phase = phase;
      // New phase: call in help
      const kinds: FoeKind[] = phase === 2 ? ["bug", "bug", "bug"] : ["inject", "inject"];
      kinds.forEach((k, i) => {
        const a = (i / kinds.length) * Math.PI * 2;
        this.spawnFoe(k, BOSS.arena.x + Math.cos(a) * 5, BOSS.arena.z + Math.sin(a) * 5);
      });
      this.host.shake(0.3);
      this.emitBoss();
    }
    const speed = b.phase === 3 ? 1.35 : b.phase === 2 ? 1.15 : 1;

    switch (b.mode) {
      case "wake": {
        b.y = THREE.MathUtils.lerp(b.y, 2.7, Math.min(1, dt * 2));
        if (b.modeT <= 0) {
          this.host.shake(0.35);
          this.host.burst(b.pos.clone().setY(2.7), "#ff3d8b", 120);
          b.mode = "drift";
          b.modeT = 1.2;
          this.emitBoss();
        }
        break;
      }
      case "drift": {
        b.y = THREE.MathUtils.lerp(b.y, 2.7 + Math.sin(t * 2) * 0.15, Math.min(1, dt * 3));
        const want = d > 6 ? 2.2 * speed : d < 4 ? -1.5 : 0;
        b.pos.x += (dx / d) * want * dt + (-dz / d) * Math.sin(t * 0.7) * 1.2 * dt;
        b.pos.z += (dz / d) * want * dt + (dx / d) * Math.sin(t * 0.7) * 1.2 * dt;
        if (b.modeT <= 0) {
          const pick = [1, 2, 3][b.next % 3];
          b.next += 1 + (Math.random() < 0.3 ? 1 : 0);
          if (pick === 1) {
            b.mode = "rise";
            b.modeT = 0.75 / speed;
          } else if (pick === 2) {
            b.mode = "volleyTell";
            b.modeT = 0.7 / speed;
          } else {
            b.mode = "chargeTell";
            b.modeT = 0.75 / speed;
          }
        }
        break;
      }
      case "rise": {
        b.y = THREE.MathUtils.lerp(b.y, 7.5, Math.min(1, dt * 5));
        b.pos.x += (p.x - b.pos.x) * Math.min(1, dt * 3);
        b.pos.z += (p.z - b.pos.z) * Math.min(1, dt * 3);
        if (b.modeT <= 0) {
          b.mode = "hang";
          b.modeT = 0.45 / speed;
        }
        break;
      }
      case "hang": {
        b.pos.x += (p.x - b.pos.x) * Math.min(1, dt * 2);
        b.pos.z += (p.z - b.pos.z) * Math.min(1, dt * 2);
        if (b.modeT <= 0) {
          b.mode = "drop";
          b.modeT = 1;
        }
        break;
      }
      case "drop": {
        b.y -= dt * 34;
        if (b.y <= 1.55) {
          b.y = 1.55;
          this.host.shake(0.55);
          this.host.burst(b.pos.clone().setY(0.4), "#ff3d8b", 80);
          if (Math.hypot(p.x - b.pos.x, p.z - b.pos.z) < 2.3) this.host.hurt(2, b.pos);
          const mesh = new THREE.Mesh(sharedGeo.ring, this.waveMat.clone());
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(b.pos.x, 0.12, b.pos.z);
          this.host.scene.add(mesh);
          this.waves.push({ mesh, r: 1.6, hit: false, dmg: b.phase === 3 ? 2 : 1 });
          b.mode = "stunned";
          b.modeT = 1.7;
        }
        break;
      }
      case "stunned": {
        // Dazed: it sinks low and its armour is down
        b.y = THREE.MathUtils.lerp(b.y, 0.95, Math.min(1, dt * 5));
        if (b.modeT <= 0) {
          b.mode = "drift";
          b.modeT = (1.8 + Math.random()) / speed;
        }
        break;
      }
      case "volleyTell": {
        if (b.modeT <= 0) {
          const rings = b.phase === 3 ? 2 : 1;
          const n = b.phase === 1 ? 10 : 12;
          for (let r = 0; r < rings; r++) {
            for (let i = 0; i < n; i++) {
              const a = (i / n) * Math.PI * 2 + r * (Math.PI / n) + t;
              const v = new THREE.Vector3(Math.sin(a), 0, Math.cos(a)).multiplyScalar(6 - r * 1.6);
              this.fireOrb(b.pos.clone().setY(0.95), v, this.bossOrbMat, 1);
            }
          }
          this.host.shake(0.15);
          b.mode = "drift";
          b.modeT = (1.6 + Math.random() * 0.8) / speed;
        }
        break;
      }
      case "chargeTell": {
        b.y = THREE.MathUtils.lerp(b.y, 1.9, Math.min(1, dt * 6));
        b.dir.set(dx / d, 0, dz / d);
        b.root.position.x = b.pos.x + Math.sin(t * 70) * 0.06;
        if (b.modeT <= 0) {
          b.mode = "charge";
          b.modeT = 0.75;
        }
        break;
      }
      case "charge": {
        b.pos.addScaledVector(b.dir, dt * 13 * speed);
        if (d < 2.1 && p.y < 1.4) this.host.hurt(b.phase === 3 ? 2 : 1, b.pos);
        const off = Math.hypot(b.pos.x - BOSS.arena.x, b.pos.z - BOSS.arena.z);
        if (b.modeT <= 0 || off > BOSS.arena.r - 1.8) {
          if (off > BOSS.arena.r - 1.8) {
            this.host.shake(0.3);
            b.mode = "stunned";
            b.modeT = 1.2;
          } else {
            b.mode = "drift";
            b.modeT = 1.4 / speed;
          }
        }
        break;
      }
      case "dying": {
        b.root.rotation.y += dt * 8;
        b.root.rotation.x += dt * 3;
        b.y += dt * 0.6;
        const k = Math.max(0, b.modeT / 2.4);
        b.root.scale.setScalar(0.2 + 0.8 * k);
        if (Math.random() < dt * 12) {
          this.host.burst(b.pos.clone().setY(b.y).add(new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)), Math.random() < 0.5 ? "#ff3d8b" : "#ffb347", 30);
          this.host.shake(0.2);
        }
        if (b.modeT <= 0) {
          b.mode = "dead";
          b.root.visible = false;
          b.shadow.visible = false;
          this.host.burst(b.pos.clone().setY(3), "#ffb347", 220);
          this.host.shake(0.7);
          this.bossDown = true;
          this.active = -1;
          this.host.emit({ type: "bossDown" });
        }
        b.place();
        return;
      }
    }

    // Keep the Box inside the arena
    const ox = b.pos.x - BOSS.arena.x;
    const oz = b.pos.z - BOSS.arena.z;
    const od = Math.hypot(ox, oz);
    const lim = BOSS.arena.r - 1.8;
    if (od > lim) {
      b.pos.x = BOSS.arena.x + (ox / od) * lim;
      b.pos.z = BOSS.arena.z + (oz / od) * lim;
    }
    // Touch damage when it's low
    if (b.alive && b.mode !== "wake" && b.y < 3.2 && d < 2.0 && p.y < 1.2) this.host.hurt(1, b.pos);
    b.place();
    if (b.mode === "chargeTell") b.root.position.x = b.pos.x + Math.sin(t * 70) * 0.06;
  }
}
