import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BOSS, FIGHTS, LAYOUT, type Spot } from "@/lib/game-data";
import { BRAND, LOGO } from "@/lib/brand";

// ── Layout ───────────────────────────────────────────────────────────────────
// The street runs along z. You spawn at the south end (+z) and walk north (-z)
// through Akshay's career, oldest first, to the AI Core.

export const SPAWN = new THREE.Vector3(0, 0, 53);
export const BOUNDS = { minX: -27, maxX: 27, minZ: -128, maxZ: 60 };
export const CORE_POS = new THREE.Vector3(LAYOUT.core.x, 0, LAYOUT.core.z);
export const CORE_R = LAYOUT.core.r;

const { x: EXP_X, w: EXP_W, d: EXP_D, z: EXP_Z } = LAYOUT.exp;
const { x: SHOP_X, w: SHOP_W, d: SHOP_D, z: SHOP_Z } = LAYOUT.shop;

const GROUND_H = 4.6;
const FLOOR_H = 3.2;

export interface Box2 {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Placed {
  spot: Spot;
  /** Where the player stands to talk. */
  door: THREE.Vector3;
  /** Where the host stands, and the direction they face (street). */
  hostPos: THREE.Vector3;
  hostYaw: number;
  medal: THREE.Object3D;
  box: Box2;
}

export interface Fonts {
  display: string;
  mono: string;
}

export function readFonts(): Fonts {
  const cs = getComputedStyle(document.body);
  const display = cs.getPropertyValue("--font-display").trim();
  const mono = cs.getPropertyValue("--font-mono").trim();
  return {
    display: display && !display.includes("var(") ? display : "system-ui, sans-serif",
    mono: mono && !mono.includes("var(") ? mono : "ui-monospace, monospace",
  };
}

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function repeat(t: THREE.Texture, x: number, y: number) {
  const c = t.clone();
  c.repeat.set(x, y);
  c.needsUpdate = true;
  return c;
}

// ── Procedural textures ──────────────────────────────────────────────────────

function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, alpha: number, r: () => number) {
  for (let i = 0; i < n; i++) {
    const v = Math.floor(r() * 255);
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha * r()})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
}

/** Running-bond brick, near-white so the material colour tints it. */
function brickTexture() {
  const r = rng(11);
  return canvasTex(512, 512, (ctx) => {
    ctx.fillStyle = "#cfcac2";
    ctx.fillRect(0, 0, 512, 512);
    const bw = 64;
    const bh = 24;
    for (let row = 0; row < 512 / bh; row++) {
      const off = row % 2 ? bw / 2 : 0;
      for (let x = -bw; x < 512 + bw; x += bw) {
        const v = 0.78 + r() * 0.22;
        const c = Math.floor(255 * v);
        ctx.fillStyle = `rgb(${c},${Math.floor(c * 0.97)},${Math.floor(c * 0.94)})`;
        ctx.fillRect(x + off + 2, row * bh + 2, bw - 4, bh - 4);
      }
    }
    speckle(ctx, 512, 512, 5000, 0.18, r);
  });
}

function plasterTexture() {
  const r = rng(23);
  return canvasTex(512, 512, (ctx) => {
    ctx.fillStyle = "#f0ede8";
    ctx.fillRect(0, 0, 512, 512);
    speckle(ctx, 512, 512, 9000, 0.12, r);
    ctx.fillStyle = "rgba(0,0,0,.05)";
    for (let y = 0; y < 512; y += 128) ctx.fillRect(0, y, 512, 2);
  });
}

function asphaltTexture() {
  const r = rng(31);
  return canvasTex(512, 512, (ctx) => {
    ctx.fillStyle = "#43464c";
    ctx.fillRect(0, 0, 512, 512);
    speckle(ctx, 512, 512, 22000, 0.35, r);
    ctx.strokeStyle = "rgba(20,20,22,.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      let x = r() * 512;
      let y = r() * 512;
      ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) {
        x += (r() - 0.5) * 60;
        y += r() * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });
}

function pavingTexture() {
  const r = rng(41);
  return canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = "#bdb6aa";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 64)
      for (let x = 0; x < 256; x += 64) {
        const v = 200 + Math.floor(r() * 30);
        ctx.fillStyle = `rgb(${v},${v - 6},${v - 14})`;
        ctx.fillRect(x + 2, y + 2, 60, 60);
      }
    speckle(ctx, 256, 256, 2500, 0.2, r);
  });
}

function grassTexture() {
  const r = rng(51);
  return canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = "#6f9a57";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 9000; i++) {
      const g = 110 + Math.floor(r() * 70);
      ctx.fillStyle = `rgba(${g - 50},${g},${g - 70},.5)`;
      ctx.fillRect(r() * 256, r() * 256, 1, 2 + r() * 3);
    }
  });
}

/** Curtain wall: mullion grid over a sky-tinted gradient, plus a night glow map. */
function curtainWall(cols: number, rows: number, seed: number) {
  const r = rng(seed);
  const W = cols * 48;
  const H = rows * 64;
  const map = canvasTex(W, H, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, W * 0.6, H);
    g.addColorStop(0, "#9cb8cc");
    g.addColorStop(0.5, "#5f7f97");
    g.addColorStop(1, "#7f9db3");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.08)";
    for (let i = 0; i < cols; i += 3) ctx.fillRect(i * 48, 0, 20, H);
    ctx.fillStyle = "#2a3138";
    for (let x = 0; x <= cols; x++) ctx.fillRect(x * 48 - 2, 0, 4, H);
    for (let y = 0; y <= rows; y++) ctx.fillRect(0, y * 64 - 4, W, 8);
  });
  map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
  const glow = canvasTex(W, H, (ctx) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        if (r() < 0.45) continue;
        ctx.fillStyle = r() < 0.2 ? "#cfe3ff" : "#ffcf8a";
        ctx.fillRect(x * 48 + 3, y * 64 + 5, 42, 54);
      }
  });
  glow.wrapS = glow.wrapT = THREE.ClampToEdgeWrapping;
  return { map, glow };
}

function signTexture(fonts: Fonts, title: string, sub: string, bg: string, fg: string) {
  return canvasTex(1024, 256, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let size = 104;
    ctx.font = `500 ${size}px ${fonts.display}`;
    while (ctx.measureText(title).width > 940 && size > 40) {
      size -= 4;
      ctx.font = `500 ${size}px ${fonts.display}`;
    }
    ctx.fillText(title, 512, sub ? 110 : 128);
    if (sub) {
      ctx.font = `500 32px ${fonts.mono}`;
      ctx.globalAlpha = 0.75;
      ctx.fillText(sub.toUpperCase().split("").join(" "), 512, 205);
    }
  });
}

/** The AM mark on a dark panel, for the welcome arch. */
function logoTexture(fonts: Fonts) {
  return canvasTex(1024, 256, (ctx) => {
    ctx.fillStyle = BRAND.ink;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.save();
    ctx.translate(96, 32);
    ctx.scale(6, 6);
    const g = ctx.createLinearGradient(4, 4, 28, 28);
    g.addColorStop(0, BRAND.amber);
    g.addColorStop(0.5, BRAND.orange);
    g.addColorStop(1, BRAND.pink);
    ctx.strokeStyle = g;
    ctx.lineWidth = LOGO.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(new Path2D(LOGO.stroke));
    ctx.stroke(new Path2D(LOGO.bar));
    ctx.fillStyle = BRAND.pink;
    ctx.beginPath();
    ctx.arc(LOGO.dot.cx, LOGO.dot.cy, LOGO.dot.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#f4f1ea";
    ctx.textBaseline = "middle";
    ctx.font = `500 86px ${fonts.display}`;
    ctx.fillText("Welcome to town", 330, 112);
    ctx.font = `500 30px ${fonts.mono}`;
    ctx.fillStyle = BRAND.amber;
    ctx.fillText("W A L K  ·  T A L K  ·  J U M P", 334, 186);
  });
}

function stripes(a: string, b: string) {
  return canvasTex(256, 64, (ctx) => {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? a : b;
      ctx.fillRect(i * 32, 0, 32, 64);
    }
  });
}

function radialTex(inner: string) {
  return canvasTex(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, inner);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });
}

export function makeMedal() {
  const g = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: "#f5c542", metalness: 0.9, roughness: 0.22, emissive: "#7a5200", emissiveIntensity: 0.55 });
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 32), gold);
  disk.rotation.x = Math.PI / 2;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 32), gold);
  const star = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.1, 5),
    new THREE.MeshStandardMaterial({ color: "#fff3c4", metalness: 0.5, roughness: 0.3, emissive: "#b8860b", emissiveIntensity: 0.5 }),
  );
  star.rotation.x = Math.PI / 2;
  const ribbonMat = new THREE.MeshStandardMaterial({ color: "#ff3d8b", roughness: 0.6 });
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.025), ribbonMat);
  r1.position.set(-0.1, 0.52, 0);
  r1.rotation.z = -0.3;
  const r2 = r1.clone();
  r2.position.x = 0.1;
  r2.rotation.z = 0.3;
  g.add(disk, rim, star, r1, r2);
  g.traverse((o) => ((o as THREE.Mesh).castShadow = true));
  return g;
}

// ── Instancing helper ────────────────────────────────────────────────────────

class Batch {
  mats: THREE.Matrix4[] = [];
  colors: THREE.Color[] = [];
  private o = new THREE.Object3D();
  add(x: number, y: number, z: number, ry = 0, sx = 1, sy = 1, sz = 1, rx = 0, color?: THREE.Color) {
    this.o.position.set(x, y, z);
    this.o.rotation.set(rx, ry, 0);
    this.o.scale.set(sx, sy, sz);
    this.o.updateMatrix();
    this.mats.push(this.o.matrix.clone());
    if (color) this.colors.push(color);
  }
  build(geo: THREE.BufferGeometry, mat: THREE.Material, shadow = false) {
    const m = new THREE.InstancedMesh(geo, mat, Math.max(1, this.mats.length));
    this.mats.forEach((x, i) => m.setMatrixAt(i, x));
    this.colors.forEach((c, i) => m.setColorAt(i, c));
    m.count = this.mats.length;
    m.castShadow = shadow;
    m.receiveShadow = true;
    m.instanceMatrix.needsUpdate = true;
    return m;
  }
}

// ── The town ────────────────────────────────────────────────────────────────

export interface Town {
  group: THREE.Group;
  placed: Placed[];
  core: { door: THREE.Vector3; beam: THREE.Mesh; gate: THREE.Mesh; ring: THREE.Mesh; setSign: (have: number, total: number, guarded: boolean) => void };
  colliders: Box2[];
  /** night 0..1, day 0..1 */
  setLight: (night: number, day: number) => void;
  update: (dt: number, t: number) => void;
}

type Face = { nx: number; nz: number; len: number; half: number; rot: number };

export function buildTown(experiences: Spot[], skills: Spot[], core: Spot, fonts: Fonts, env: THREE.Texture): Town {
  const group = new THREE.Group();
  const placed: Placed[] = [];
  const colliders: Box2[] = [];
  const r = rng(7);

  // Materials that react to day/night
  const reflective: THREE.MeshStandardMaterial[] = [];
  const nightGlow: { m: THREE.MeshStandardMaterial; k: number }[] = [];
  const glowing = (m: THREE.MeshStandardMaterial, k: number) => (nightGlow.push({ m, k }), m);
  const shiny = (m: THREE.MeshStandardMaterial) => {
    m.envMap = env;
    reflective.push(m);
    return m;
  };

  // Window kit, instanced across every building
  const frames = new Batch();
  const sills = new Batch();
  const mullions = new Batch();
  const panesDark = new Batch();
  const panesLit = new Batch();
  const slabs = new Batch();
  const acUnits = new Batch();

  const brick = brickTexture();
  const plaster = plasterTexture();
  const paneDarkMat = shiny(new THREE.MeshStandardMaterial({ color: "#2c3b49", roughness: 0.08, metalness: 0.55 }));
  const paneLitMat = glowing(shiny(new THREE.MeshStandardMaterial({ color: "#2c3b49", roughness: 0.08, metalness: 0.55, emissive: "#ffc477", emissiveIntensity: 0 })), 1.4);
  const frameMat = new THREE.MeshStandardMaterial({ color: "#f1ede6", roughness: 0.6 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: "#b9b1a3", roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: "#4a4a4c", roughness: 1 });

  // ── Ground ──
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ map: repeat(grassTexture(), 80, 80), roughness: 1 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.z = -30;
  grass.receiveShadow = true;
  group.add(grass);

  const flat = (w: number, d: number, m: THREE.Material, x: number, z: number, y = 0.01) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, y, z);
    p.receiveShadow = true;
    group.add(p);
    return p;
  };
  const streetLen = 176;
  const streetMid = -14;
  flat(10, streetLen, new THREE.MeshStandardMaterial({ map: repeat(asphaltTexture(), 2, 34), roughness: 0.95 }), 0, streetMid, 0.02);
  const paveMat = new THREE.MeshStandardMaterial({ map: repeat(pavingTexture(), 2.5, 88), roughness: 0.9 });
  flat(5.2, streetLen, paveMat, -7.6, streetMid, 0.03);
  flat(5.2, streetLen, paveMat, 7.6, streetMid, 0.03);
  const curbGeo = new THREE.BoxGeometry(0.28, 0.14, streetLen);
  for (const x of [-5.08, 5.08]) {
    const c = new THREE.Mesh(curbGeo, stoneMat);
    c.position.set(x, 0.07, streetMid);
    c.receiveShadow = true;
    group.add(c);
  }
  // Markings
  const paint = new THREE.MeshStandardMaterial({ color: "#efece4", roughness: 0.7 });
  const dash = new Batch();
  for (let z = 60; z > -100; z -= 6) dash.add(0, 0.035, z, 0, 1, 1, 1, -Math.PI / 2);
  group.add(dash.build(new THREE.PlaneGeometry(0.16, 2.8), paint));
  for (const x of [-4.55, 4.55]) flat(0.12, streetLen, paint, x, streetMid, 0.036);
  const zebra = new Batch();
  for (const zc of [50.5, -95])
    for (let x = -4; x <= 4; x += 1) zebra.add(x, 0.037, zc, 0, 1, 1, 1, -Math.PI / 2);
  group.add(zebra.build(new THREE.PlaneGeometry(0.5, 3.4), paint));

  // ── Buildings ──
  const facesOf = (w: number, d: number): Face[] => [
    { nx: 1, nz: 0, len: d, half: w / 2, rot: Math.PI / 2 },
    { nx: -1, nz: 0, len: d, half: w / 2, rot: -Math.PI / 2 },
    { nx: 0, nz: 1, len: w, half: d / 2, rot: 0 },
    { nx: 0, nz: -1, len: w, half: d / 2, rot: Math.PI },
  ];
  const at = (f: Face, cx: number, cz: number, u: number, off: number) => {
    const tx = Math.cos(f.rot);
    const tz = -Math.sin(f.rot);
    return [cx + f.nx * (f.half + off) + tx * u, cz + f.nz * (f.half + off) + tz * u] as const;
  };

  const addBuilding = (s: Spot, side: -1 | 1, cx: number, cz: number, w: number, d: number, i: number) => {
    const floors = s.floors;
    const h = GROUND_H + (floors - 1) * FLOOR_H;
    const faces = facesOf(w, d);
    const street = side === -1 ? faces[0] : faces[1];
    const back = side === -1 ? faces[1] : faces[0];
    const accentMat = new THREE.MeshStandardMaterial({ color: s.accent, roughness: 0.55 });

    // Walls
    let wallMat: THREE.MeshStandardMaterial;
    if (s.style === "glass") {
      const { map, glow } = curtainWall(Math.round(d / 1.6), floors, 300 + i);
      wallMat = glowing(
        shiny(new THREE.MeshStandardMaterial({ map, emissiveMap: glow, emissive: "#ffffff", emissiveIntensity: 0, roughness: 0.12, metalness: 0.6 })),
        1.25,
      );
    } else {
      const base = s.style === "brick" ? brick : plaster;
      wallMat = new THREE.MeshStandardMaterial({
        map: repeat(base, d / (s.style === "brick" ? 3.2 : 6), h / (s.style === "brick" ? 3.2 : 6)),
        color: s.color,
        roughness: 0.92,
      });
    }
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [wallMat, wallMat, roofMat, roofMat, wallMat, wallMat]);
    body.position.set(cx, h / 2, cz);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Trim: plinth, string course above the shopfront, cornice + parapet
    const trim = (y: number, hh: number, grow: number, m: THREE.Material) => {
      const t = new THREE.Mesh(new THREE.BoxGeometry(w + grow, hh, d + grow), m);
      t.position.set(cx, y, cz);
      t.castShadow = true;
      t.receiveShadow = true;
      group.add(t);
    };
    if (s.style === "glass") {
      for (let f = 1; f <= floors; f++) slabs.add(cx, GROUND_H + (f - 1) * FLOOR_H, cz, 0, w + 0.3, 1, d + 0.3);
      trim(h + 0.5, 1, 0.1, new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.5 }));
    } else {
      trim(0.3, 0.6, 0.24, stoneMat);
      trim(GROUND_H, 0.3, 0.3, accentMat);
      trim(h + 0.2, 0.4, 0.55, s.style === "brick" ? stoneMat : accentMat);
      // Parapet walls around the roof
      for (const f of faces) {
        const along = f.nx !== 0;
        const p = new THREE.Mesh(new THREE.BoxGeometry(along ? 0.25 : w + 0.4, 0.7, along ? d + 0.4 : 0.25), wallMat);
        p.position.set(cx + f.nx * (w / 2 + 0.05), h + 0.75, cz + f.nz * (d / 2 + 0.05));
        p.castShadow = true;
        group.add(p);
      }
    }

    // Windows on upper floors (street + both sides), framed with sills
    if (s.style !== "glass") {
      for (const f of faces) {
        if (f === back) continue;
        const n = Math.max(1, Math.floor((f.len - 1.6) / 2.2));
        for (let fl = 0; fl < floors; fl++) {
          if (fl === 0 && f === street) continue;
          const y = (fl === 0 ? 0 : GROUND_H + (fl - 1) * FLOOR_H) + 1.75;
          for (let k = 0; k < n; k++) {
            const u = (k - (n - 1) / 2) * 2.2;
            const [fx, fz] = at(f, cx, cz, u, 0.03);
            frames.add(fx, y, fz, f.rot);
            const [px, pz] = at(f, cx, cz, u, 0.075);
            (r() > 0.32 ? panesLit : panesDark).add(px, y, pz, f.rot);
            const [mx, mz] = at(f, cx, cz, u, 0.09);
            mullions.add(mx, y, mz, f.rot);
            const [sx, sz] = at(f, cx, cz, u, 0.11);
            sills.add(sx, y - 0.9, sz, f.rot);
          }
        }
      }
    }

    // Shopfront on the street face: big glass, framed door, sign band
    const sf = street;
    const sfW = sf.len - 1.4;
    const shopGlass = glowing(
      shiny(new THREE.MeshStandardMaterial({ color: "#566a78", roughness: 0.05, metalness: 0.45, emissive: "#ffd39a", emissiveIntensity: 0 })),
      0.9,
    );
    const glassPanel = new THREE.Mesh(new THREE.PlaneGeometry(sfW, 2.7), shopGlass);
    const [gx, gz] = at(sf, cx, cz, 0, 0.04);
    glassPanel.position.set(gx, 1.95, gz);
    glassPanel.rotation.y = sf.rot;
    group.add(glassPanel);
    const post = new THREE.BoxGeometry(0.18, 2.9, 0.18);
    const transom = new THREE.BoxGeometry(sfW + 0.2, 0.16, 0.18);
    const fm = s.style === "glass" ? new THREE.MeshStandardMaterial({ color: "#2a2f35", roughness: 0.4, metalness: 0.6 }) : accentMat;
    for (const u of [-sfW / 2, -1.1, 1.1, sfW / 2, -sfW / 4 - 0.55, sfW / 4 + 0.55]) {
      const [px, pz] = at(sf, cx, cz, u, 0.09);
      const p = new THREE.Mesh(post, fm);
      p.position.set(px, 1.95, pz);
      p.rotation.y = sf.rot;
      p.castShadow = true;
      group.add(p);
    }
    for (const y of [0.6, 3.3]) {
      const [px, pz] = at(sf, cx, cz, 0, 0.09);
      const t = new THREE.Mesh(transom, fm);
      t.position.set(px, y, pz);
      t.rotation.y = sf.rot;
      group.add(t);
    }
    // Door: darker leaf with a handle
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.55, 0.06), new THREE.MeshStandardMaterial({ color: "#1b2026", roughness: 0.2, metalness: 0.4 }));
    const [dx, dz] = at(sf, cx, cz, 0, 0.07);
    door.position.set(dx, 1.88, dz);
    door.rotation.y = sf.rot;
    group.add(door);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: "#c9c9c9", metalness: 0.9, roughness: 0.2 }));
    const [hx, hz] = at(sf, cx, cz, 0.25, 0.13);
    handle.position.set(hx, 1.6, hz);
    handle.rotation.y = sf.rot;
    group.add(handle);

    // Sign band
    const signW = Math.min(sfW - 0.4, 4);
    const signH = signW / 4;
    const band = new THREE.Mesh(new THREE.BoxGeometry(signW + 0.35, signH + 0.25, 0.16), accentMat);
    const [bx, bz] = at(sf, cx, cz, 0, 0.12);
    band.position.set(bx, 3.35 + (signH + 0.25) / 2, bz);
    band.rotation.y = sf.rot;
    band.castShadow = true;
    group.add(band);
    const signMat = glowing(
      new THREE.MeshStandardMaterial({
        map: signTexture(fonts, s.name, s.kind === "skill" ? "skill shop" : s.sign, "#f6f3ec", s.accent),
        roughness: 0.5,
        emissive: "#ffffff",
        emissiveIntensity: 0,
      }),
      0.45,
    );
    signMat.emissiveMap = signMat.map;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(signW, signH), signMat);
    const [snx, snz] = at(sf, cx, cz, 0, 0.21);
    sign.position.set(snx, band.position.y, snz);
    sign.rotation.y = sf.rot;
    group.add(sign);

    if (s.kind === "skill") {
      const aw = new THREE.Mesh(
        new THREE.BoxGeometry(sfW, 0.06, 1.6),
        new THREE.MeshStandardMaterial({ map: repeat(stripes(s.accent, "#f4f1ea"), sfW / 2, 1), roughness: 0.8 }),
      );
      const [ax, az] = at(sf, cx, cz, 0, 0.8);
      aw.position.set(ax, 3.1, az);
      aw.rotation.y = sf.rot;
      aw.rotation.x = 0.32;
      aw.castShadow = true;
      group.add(aw);
    }

    // Rooftop kit
    const roofY = s.style === "glass" ? h + 1 : h;
    const nAc = 1 + Math.floor(r() * 3);
    for (let k = 0; k < nAc; k++) acUnits.add(cx + (r() - 0.5) * (w - 3), roofY + 0.5, cz + (r() - 0.5) * (d - 3), r() * 0.3);
    if (s.style === "brick" && floors >= 3) {
      const tank = new THREE.Group();
      const wood = new THREE.MeshStandardMaterial({ color: "#7a5a3c", roughness: 0.9 });
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.05, 1.8, 16), wood);
      barrel.position.y = 2.2;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.7, 16), roofMat);
      cap.position.y = 3.45;
      tank.add(barrel, cap);
      for (const [lx, lz] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.3, 0.12), roofMat);
        leg.position.set(lx, 0.65, lz);
        tank.add(leg);
      }
      tank.position.set(cx - side * (w / 4), roofY, cz + d / 5);
      tank.traverse((o) => ((o as THREE.Mesh).castShadow = true));
      group.add(tank);
    }
    if (s.style === "glass") {
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 6, 6), new THREE.MeshStandardMaterial({ color: "#888", metalness: 0.8, roughness: 0.3 }));
      ant.position.set(cx, roofY + 3, cz);
      group.add(ant);
      const blink = glowing(new THREE.MeshStandardMaterial({ color: "#ff3030", emissive: "#ff2020", emissiveIntensity: 0 }), 3);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), blink);
      b.position.set(cx, roofY + 6.05, cz);
      group.add(b);
    }

    // Host + medal + talk spot
    const face = -side; // street direction along x
    const doorPos = new THREE.Vector3(cx - side * (w / 2) + face * 2.5, 0, cz);
    const hostPos = new THREE.Vector3(cx - side * (w / 2) + face * 1.0, 0, cz + 1.7);
    const medal = makeMedal();
    medal.position.set(doorPos.x, 2.75, cz);
    group.add(medal);

    const box = { minX: cx - w / 2 - 0.35, maxX: cx + w / 2 + 0.35, minZ: cz - d / 2 - 0.35, maxZ: cz + d / 2 + 0.35 };
    colliders.push(box);
    placed.push({ spot: s, door: doorPos, hostPos, hostYaw: face > 0 ? Math.PI / 2 : -Math.PI / 2, medal, box });
  };

  experiences.forEach((s, i) => addBuilding(s, -1, EXP_X, EXP_Z[i], EXP_W, EXP_D, i));
  skills.forEach((s, i) => addBuilding(s, 1, SHOP_X, SHOP_Z[i], SHOP_W, SHOP_D, 20 + i));

  group.add(frames.build(new THREE.BoxGeometry(1.2, 1.75, 0.08), frameMat));
  group.add(panesDark.build(new THREE.PlaneGeometry(1.02, 1.55), paneDarkMat));
  group.add(panesLit.build(new THREE.PlaneGeometry(1.02, 1.55), paneLitMat));
  group.add(mullions.build(new THREE.BoxGeometry(0.06, 1.55, 0.03), frameMat));
  group.add(sills.build(new THREE.BoxGeometry(1.4, 0.1, 0.24), stoneMat, true));
  group.add(slabs.build(new THREE.BoxGeometry(1, 0.28, 1), new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.5 }), true));
  const acMat = new THREE.MeshStandardMaterial({ color: "#c8c9c7", roughness: 0.5, metalness: 0.3 });
  group.add(acUnits.build(new RoundedBoxGeometry(1.4, 1, 1.1, 2, 0.08), acMat, true));

  // ── Welcome arch ──
  const archMat = new THREE.MeshStandardMaterial({ color: "#22262c", roughness: 0.4, metalness: 0.5 });
  const ARCH_Z = 42;
  for (const x of [-9.6, 9.6]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 11.4, 0.5), archMat);
    p.position.set(x, 5.7, ARCH_Z);
    p.castShadow = true;
    group.add(p);
    colliders.push({ minX: x - 0.3, maxX: x + 0.3, minZ: ARCH_Z - 0.3, maxZ: ARCH_Z + 0.3 });
  }
  const logoMat = glowing(new THREE.MeshStandardMaterial({ map: logoTexture(fonts), roughness: 0.5, emissive: "#ffffff", emissiveIntensity: 0 }), 0.6);
  logoMat.emissiveMap = logoMat.map;
  const arch = new THREE.Mesh(new THREE.BoxGeometry(14, 3.5, 0.3), [archMat, archMat, archMat, archMat, logoMat, logoMat]);
  arch.position.set(0, 11, ARCH_Z);
  arch.castShadow = true;
  group.add(arch);

  // ── The AI Core ──
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(18, 64), new THREE.MeshStandardMaterial({ map: repeat(pavingTexture(), 9, 9), roughness: 0.9 }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(CORE_POS.x, 0.028, CORE_POS.z);
  plaza.receiveShadow = true;
  group.add(plaza);

  const white = new THREE.MeshStandardMaterial({ color: core.color, roughness: 0.35, metalness: 0.05 });
  const coreGlass = glowing(shiny(new THREE.MeshStandardMaterial({ color: "#7d97ab", roughness: 0.08, metalness: 0.7, emissive: "#ffb070", emissiveIntensity: 0 })), 0.5);
  const tiers: [number, number, number, THREE.Material][] = [
    [7, 4, 2, white],
    [5.2, 12, 10, coreGlass],
    [3.6, 7, 19.5, white],
  ];
  for (const [rad, hh, y, m] of tiers) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.94, rad, hh, 48), m);
    t.position.set(CORE_POS.x, y, CORE_POS.z);
    t.castShadow = true;
    t.receiveShadow = true;
    group.add(t);
  }
  for (let k = 0; k < 4; k++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.05 - k * 0.05, 0.12, 8, 48), white);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(CORE_POS.x, 6 + k * 3, CORE_POS.z);
    group.add(ring);
  }
  const ringMat = glowing(new THREE.MeshStandardMaterial({ color: "#ff5a5f", emissive: "#ff3d8b", emissiveIntensity: 0.6, roughness: 0.3 }), 1);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.25, 12, 48), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(CORE_POS.x, 16.4, CORE_POS.z);
  group.add(ring);
  const orbTop = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 32, 16),
    new THREE.MeshStandardMaterial({ color: "#ffb347", emissive: "#ff8a3d", emissiveIntensity: 1.2, roughness: 0.2 }),
  );
  orbTop.position.set(CORE_POS.x, 24.6, CORE_POS.z);
  group.add(orbTop);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 220, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: "#ffb347", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  beam.position.set(CORE_POS.x, 130, CORE_POS.z);
  beam.visible = false;
  group.add(beam);

  const coreDoorZ = CORE_POS.z + 7;
  const coreDoor = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3.4, 0.3),
    new THREE.MeshStandardMaterial({ color: "#141414", emissive: "#ff5a5f", emissiveIntensity: 0.3 }),
  );
  coreDoor.position.set(CORE_POS.x, 1.7, coreDoorZ - 0.35);
  group.add(coreDoor);

  const gate = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.16, 10, 40, Math.PI),
    new THREE.MeshStandardMaterial({ color: "#ff3d8b", emissive: "#ff3d8b", emissiveIntensity: 1.4, transparent: true, opacity: 0.9 }),
  );
  gate.position.set(CORE_POS.x, 0, coreDoorZ + 0.8);
  group.add(gate);

  const coreSignCanvas = document.createElement("canvas");
  coreSignCanvas.width = 1024;
  coreSignCanvas.height = 256;
  const coreSignTex = new THREE.CanvasTexture(coreSignCanvas);
  coreSignTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 2),
    new THREE.MeshStandardMaterial({ map: coreSignTex, emissive: "#ffffff", emissiveMap: coreSignTex, emissiveIntensity: 0.35 }),
  );
  sign.position.set(CORE_POS.x, 6.4, CORE_POS.z + 5.4);
  group.add(sign);
  const setSign = (have: number, total: number, guarded: boolean) => {
    const ctx = coreSignCanvas.getContext("2d")!;
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, 1024, 256);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f4f1ea";
    ctx.font = `500 92px ${fonts.display}`;
    ctx.fillText("The AI Core", 512, 100);
    ctx.font = `500 34px ${fonts.mono}`;
    const open = have >= total && !guarded;
    ctx.fillStyle = open ? "#ffb347" : "#ff8fa3";
    const msg = open
      ? "O P E N  ·  C O M E  I N"
      : have >= total
        ? "G U A R D E D  ·  B E A T  T H E  B L A C K  B O X"
        : `L O C K E D  ·  ${have} / ${total}  M E D A L S`;
    ctx.fillText(msg, 512, 196);
    coreSignTex.needsUpdate = true;
  };
  setSign(0, experiences.length + skills.length, true);

  // ── Street lights: curbside poles with an arm over the road ──
  const poleMat = new THREE.MeshStandardMaterial({ color: "#2b2f36", roughness: 0.45, metalness: 0.6 });
  const lampMat = glowing(new THREE.MeshStandardMaterial({ color: "#fff6dc", emissive: "#ffcf7a", emissiveIntensity: 0 }), 3.2);
  const poolMat = new THREE.MeshBasicMaterial({
    map: radialTex("rgba(255,200,120,1)"),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const poles = new Batch();
  const arms = new Batch();
  const heads = new Batch();
  const bulbs = new Batch();
  const pools = new Batch();
  for (let z = 50; z > -100; z -= 14) {
    for (const s of [-1, 1]) {
      const zz = z + (s > 0 ? 7 : 0);
      if ([...FIGHTS.map((f) => f.z), BOSS.gateZ].some((fz) => Math.abs(fz - zz) < 1.2)) continue;
      const x = s * 5.55;
      poles.add(x, 2.9, zz);
      arms.add(x - s * 0.7, 5.75, zz, 0, 1, 1, 1);
      heads.add(x - s * 1.35, 5.68, zz);
      bulbs.add(x - s * 1.35, 5.56, zz);
      pools.add(x - s * 1.6, 0.05, zz, 0, 1, 1, 1, -Math.PI / 2);
    }
  }
  group.add(poles.build(new THREE.CylinderGeometry(0.08, 0.12, 5.8, 10), poleMat, true));
  group.add(arms.build(new THREE.BoxGeometry(1.5, 0.08, 0.08), poleMat, true));
  group.add(heads.build(new RoundedBoxGeometry(0.7, 0.16, 0.36, 2, 0.05), poleMat, true));
  group.add(bulbs.build(new THREE.BoxGeometry(0.55, 0.04, 0.26), lampMat));
  const poolMesh = pools.build(new THREE.PlaneGeometry(9, 9), poolMat);
  poolMesh.receiveShadow = false;
  group.add(poolMesh);

  // ── Trees: instanced trunks and leaf clumps ──
  const trunks = new Batch();
  const leaves = new Batch();
  const leafCols = ["#4c7f3f", "#5a8f45", "#3f7038", "#6a9c4f", "#557a36"].map((c) => new THREE.Color(c));
  const tree = (x: number, z: number, s: number) => {
    trunks.add(x, 1.1 * s, z, r() * 6, s, s, s);
    const n = 4 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + r();
      const rad = k === 0 ? 0 : 0.7 * s;
      const sz = (0.9 + r() * 0.5) * s;
      leaves.add(x + Math.cos(a) * rad, (2.6 + r() * 0.9) * s + (k === 0 ? 0.6 * s : 0), z + Math.sin(a) * rad, r() * 6, sz, sz * 0.9, sz, 0, leafCols[Math.floor(r() * leafCols.length)].clone().offsetHSL(0, 0, (r() - 0.5) * 0.06));
    }
  };
  for (let z = 64; z > -140; z -= 4.5) {
    tree(-30 - r() * 6, z + r() * 2, 1 + r() * 0.6);
    tree(30 + r() * 6, z + r() * 2, 1 + r() * 0.6);
  }
  for (let x = -28; x <= 28; x += 4.5) {
    tree(x + r(), -132 - r() * 4, 1.1 + r() * 0.5);
    tree(x + r(), 64 + r() * 3, 1 + r() * 0.5);
  }
  for (const z of [33, 19, 5, -9, -23, -37, -51]) tree(21 + r() * 2, z, 0.9);
  for (const z of [23, 1, -21, -43, -65]) tree(-25 + r() * 2, z, 1);
  group.add(trunks.build(new THREE.CylinderGeometry(0.12, 0.2, 2.2, 7), new THREE.MeshStandardMaterial({ color: "#5d4330", roughness: 1 }), true));
  group.add(leaves.build(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true }), true));

  // Day / night
  const setLight = (night: number, day: number) => {
    for (const { m, k } of nightGlow) m.emissiveIntensity = night * k;
    ringMat.emissiveIntensity = 0.6 + night * 0.8;
    for (const m of reflective) m.envMapIntensity = 0.15 + day * 0.85;
    poolMat.opacity = night * 0.5;
  };

  const update = (_dt: number, t: number) => {
    ring.rotation.z = t * 0.4;
  };

  return {
    group,
    placed,
    core: { door: new THREE.Vector3(CORE_POS.x, 0, coreDoorZ + 2.4), beam, gate, ring, setSign },
    colliders,
    setLight,
    update,
  };
}

// ── Sky & day/night ─────────────────────────────────────────────────────────

export interface Sky {
  dome: THREE.Mesh;
  uniforms: { top: { value: THREE.Color }; horizon: { value: THREE.Color } };
  stars: THREE.Points;
  sun: THREE.Mesh;
  moon: THREE.Mesh;
  clouds: THREE.Group;
}

export function buildSky(): Sky {
  const uniforms = { top: { value: new THREE.Color("#4b9be8") }, horizon: { value: new THREE.Color("#cfe6f7") } };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms,
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 horizon; varying vec3 vP;
        void main(){ float h = clamp(vP.y, 0.0, 1.0); gl_FragColor = vec4(mix(horizon, top, pow(h, 0.55)), 1.0);
        #include <colorspace_fragment>
        }`,
    }),
  );
  dome.renderOrder = -1;

  const starGeo = new THREE.BufferGeometry();
  const N = 900;
  const pos = new Float32Array(N * 3);
  const r = rng(42);
  for (let i = 0; i < N; i++) {
    const th = r() * Math.PI * 2;
    const ph = Math.acos(0.05 + r() * 0.95);
    pos[i * 3] = 380 * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = 380 * Math.cos(ph);
    pos[i * 3 + 2] = 380 * Math.sin(ph) * Math.sin(th);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: "#ffffff", size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }),
  );

  const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 12), new THREE.MeshBasicMaterial({ color: "#fff1c9", fog: false }));
  const moon = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 12), new THREE.MeshBasicMaterial({ color: "#e8ecff", fog: false }));

  const clouds = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, transparent: true, opacity: 0.92 });
  const blob = new THREE.IcosahedronGeometry(1, 1);
  for (let i = 0; i < 14; i++) {
    const c = new THREE.Group();
    const n = 3 + Math.floor(r() * 3);
    for (let j = 0; j < n; j++) {
      const m = new THREE.Mesh(blob, cloudMat);
      m.position.set(j * 2.2 - n, r() * 0.8, r() * 1.5);
      m.scale.setScalar(1.6 + r() * 1.4);
      c.add(m);
    }
    c.position.set(-120 + r() * 240, 40 + r() * 18, -150 + r() * 220);
    clouds.add(c);
  }

  return { dome, uniforms, stars, sun, moon, clouds };
}

const C = (h: string) => new THREE.Color(h);
const NIGHT_TOP = C("#060a1c");
const NIGHT_HOR = C("#1a2346");
const DAY_TOP = C("#3f8fe0");
const DAY_HOR = C("#cfe6f7");
const DUSK_TOP = C("#3d3f86");
const DUSK_HOR = C("#ff9a62");

export interface Daylight {
  /** 0 night → 1 full day */
  day: number;
  /** 0 → 1 near sunrise/sunset */
  twilight: number;
  sunDir: THREE.Vector3;
  top: THREE.Color;
  horizon: THREE.Color;
  label: "Night" | "Dawn" | "Morning" | "Afternoon" | "Dusk" | "Evening";
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Daylight for a local clock time (hours, 0–24). Sun rises at 6, sets at 18. */
export function daylightAt(hours: number): Daylight {
  const th = ((hours - 6) / 24) * Math.PI * 2;
  const elev = Math.sin(th);
  const sunDir = new THREE.Vector3(Math.cos(th), elev, 0.45).normalize();
  const day = smooth(-0.1, 0.28, elev);
  const twilight = Math.max(0, 1 - Math.abs(elev) / 0.32);
  const top = NIGHT_TOP.clone().lerp(DAY_TOP, day).lerp(DUSK_TOP, twilight * 0.5);
  const horizon = NIGHT_HOR.clone().lerp(DAY_HOR, day).lerp(DUSK_HOR, twilight * 0.75);
  const label =
    hours < 5 ? "Night" : hours < 7 ? "Dawn" : hours < 12 ? "Morning" : hours < 17 ? "Afternoon" : hours < 19 ? "Dusk" : hours < 22 ? "Evening" : "Night";
  return { day, twilight, sunDir, top, horizon, label };
}
