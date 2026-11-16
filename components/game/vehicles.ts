import * as THREE from "three";
import { rayCylinder } from "./ray";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BOSS, stages } from "@/lib/game-data";
import { animateCharacter, applyStage, buildCharacter, type Character } from "./character";

// ── Open-world life ──────────────────────────────────────────────────────────
// Cars you can get into and drive, traffic that cruises the two lanes and turns
// around at the glitch walls, and people walking the pavements. Nobody gets
// hurt: traffic brakes for you and pedestrians hop out of the way.

export interface WorldQuery {
  /** Buildings, lamps, crates, the Core… for a circle at (x, z). */
  blocked: (x: number, z: number, r: number) => boolean;
  /** Solid glitch-wall z positions right now. */
  walls: () => number[];
  /** Host (shopkeeper) positions, which cars treat as soft obstacles. */
  hosts: () => THREE.Vector3[];
}

export interface Car {
  group: THREE.Group;
  body: THREE.Group;
  wheels: { steer: THREE.Group; spin: THREE.Group; front: boolean }[];
  yaw: number;
  speed: number;
  steer: number;
  traffic: boolean;
  /** Traffic: lane x and direction (-1 = north / -z). */
  lane: number;
  dir: number;
  turn: { t: number; x0: number; x1: number; z0: number; yaw0: number } | null;
  wait: number;
  paint: THREE.MeshStandardMaterial;
  color: string;
  hp: number;
  /** Seconds left as a burnt-out wreck (0 = fine). */
  wreck: number;
  /** Shown once it's badly damaged. */
  smoke: THREE.Points;
  home: { x: number; z: number; yaw: number; lane: number; dir: number };
}

const CAR_HP = 10;
const WRECK_T = 14;

interface Ped {
  c: Character;
  lane: number;
  dir: number;
  speed: number;
  phase: number;
  idle: number;
  dodge: number;
  dodgeDir: number;
  /** Knocked flat (seconds left), then running scared (seconds left). */
  down: number;
  flee: number;
  fleeDir: number;
}

const LANE = 1.9;
const CAR_R = 1.0;
const CAR_PTS = [-1.35, 0, 1.35]; // collision circles along the car
const Z_MIN = BOSS.gateZ + 5;
const Z_MAX = 49;
const PED_X = 6.8;

const paints = ["#b8282e", "#1d4e89", "#e8e6e1", "#2d2f33", "#5b7f5a", "#c7a03c", "#7a8590", "#e07a1f", "#3b2f6b", "#0f766e", "#f2f2f2"];

export function buildCar(color: string, env: THREE.Texture, lights: THREE.MeshStandardMaterial) {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const paint = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.28, envMap: env, envMapIntensity: 0.9 });
  const glass = new THREE.MeshStandardMaterial({ color: "#1c252e", roughness: 0.05, metalness: 0.7, envMap: env });
  const b = new THREE.Mesh(sharedCar.body, paint);
  b.position.y = 0.62;
  const c = new THREE.Mesh(sharedCar.cabin, glass);
  c.position.set(0, 1.15, -0.2);
  body.add(b, c);
  for (const s of [-0.6, 0.6]) {
    const hl = new THREE.Mesh(sharedCar.lamp, lights);
    hl.position.set(s, 0.72, 2.16);
    const tl = new THREE.Mesh(sharedCar.lamp, sharedCar.tail);
    tl.position.set(s, 0.72, -2.16);
    body.add(hl, tl);
  }
  const wheels: Car["wheels"] = [];
  for (const [wx, wz] of [[-0.88, 1.35], [0.88, 1.35], [-0.88, -1.35], [0.88, -1.35]]) {
    const steer = new THREE.Group();
    steer.position.set(wx, 0.36, wz);
    const spin = new THREE.Group();
    steer.add(spin);
    const wh = new THREE.Mesh(sharedCar.wheel, sharedCar.tire);
    wh.rotation.z = Math.PI / 2;
    const rm = new THREE.Mesh(sharedCar.rim, sharedCar.rimMat);
    rm.rotation.z = Math.PI / 2;
    rm.position.x = wx > 0 ? 0.01 : -0.01;
    spin.add(wh, rm);
    group.add(steer);
    wheels.push({ steer, spin, front: wz > 0 });
  }
  group.traverse((o) => ((o as THREE.Mesh).castShadow = true));
  return { group, body, wheels, paint };
}

const sharedCar = {
  body: new RoundedBoxGeometry(1.85, 0.62, 4.3, 4, 0.22),
  cabin: new RoundedBoxGeometry(1.62, 0.6, 2.3, 4, 0.2),
  wheel: new THREE.CylinderGeometry(0.36, 0.36, 0.26, 18),
  rim: new THREE.CylinderGeometry(0.2, 0.2, 0.27, 12),
  lamp: new THREE.BoxGeometry(0.4, 0.14, 0.05),
  tire: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.9 }),
  rimMat: new THREE.MeshStandardMaterial({ color: "#bfc3c7", metalness: 0.9, roughness: 0.25 }),
  tail: new THREE.MeshStandardMaterial({ color: "#9b1111", emissive: "#ff1a1a", emissiveIntensity: 0.25 }),
};

export class Vehicles {
  group = new THREE.Group();
  cars: Car[] = [];
  private peds: Ped[] = [];
  private lights = new THREE.MeshStandardMaterial({ color: "#fffbe8", emissive: "#fff3c4", emissiveIntensity: 0 });
  private tmp = new THREE.Vector3();

  constructor(
    env: THREE.Texture,
    private q: WorldQuery,
  ) {
    // Parked cars along the kerb: get in with F
    const parked: [number, number, number][] = [
      [-4.1, 30, 0], [-4.1, -5, 0], [-4.1, -48, 0], [-4.1, -76, 0],
      [4.1, 13.5, Math.PI], [4.1, -30, Math.PI], [4.1, -60, Math.PI],
    ];
    parked.forEach(([x, z, yaw], i) => this.addCar(paints[i % paints.length], env, x, z, yaw, false, 0, 0));
    // Traffic, one per stretch of street
    const traffic: [number, number][] = [[36, -1], [0, 1], [-52, -1], [12, -1]];
    traffic.forEach(([z, dir], i) => {
      const lane = dir < 0 ? LANE : -LANE;
      this.addCar(paints[(i + 7) % paints.length], env, lane, z, dir < 0 ? Math.PI : 0, true, lane, dir);
    });
    // People out for a walk
    for (let i = 0; i < 12; i++) {
      const c = buildCharacter();
      const st = stages[i % 6];
      applyStage(c, st, { host: true });
      c.mats.top.color.set(paints[(i * 3) % paints.length]);
      const side = i % 2 ? 1 : -1;
      const lane = side * (PED_X + ((i * 37) % 10) / 10);
      const z = Z_MAX - 4 - ((i * 53) % 130);
      c.root.position.set(lane, 0, z);
      this.group.add(c.root);
      this.peds.push({
        c, lane, dir: i % 3 ? -1 : 1, speed: 1.1 + ((i * 7) % 5) / 10, phase: i, idle: 0, dodge: 0, dodgeDir: side, down: 0, flee: 0, fleeDir: 1,
      });
    }
  }

  private addCar(color: string, env: THREE.Texture, x: number, z: number, yaw: number, traffic: boolean, lane: number, dir: number) {
    const m = buildCar(color, env, this.lights);
    m.group.position.set(x, 0, z);
    m.group.rotation.y = yaw;
    this.group.add(m.group);
    // Grey smoke puffs that rise off the bonnet once it's hurt
    const n = 18;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pos.set([(Math.random() - 0.5) * 0.8, 1 + Math.random() * 2, 1.2 + (Math.random() - 0.5) * 0.6], i * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const smoke = new THREE.Points(geo, new THREE.PointsMaterial({ color: "#555", size: 0.55, transparent: true, opacity: 0.55, depthWrite: false }));
    smoke.visible = false;
    m.group.add(smoke);
    this.cars.push({
      ...m, yaw, speed: 0, steer: 0, traffic, lane, dir, turn: null, wait: 0,
      color, hp: CAR_HP, wreck: 0, smoke, home: { x, z, yaw, lane, dir },
    });
  }

  /** First car or pedestrian along a 3D ray from `o` (unit `d`) within `max`. */
  raycast(o: THREE.Vector3, d: THREE.Vector3, max: number, skip?: Car | null) {
    let best = max;
    let car: Car | null = null;
    let ped: Ped | null = null;
    for (const c of this.cars) {
      if (c === skip) continue;
      const fx = Math.sin(c.yaw);
      const fz = Math.cos(c.yaw);
      // Bonnet and boot are low; the cabin in the middle is taller
      for (const a of CAR_PTS) {
        const t = rayCylinder(o, d, c.group.position.x + fx * a, c.group.position.z + fz * a, 0.92, 0, a === 0 ? 1.48 : 0.95, best);
        if (t >= 0 && t < best) {
          best = t;
          car = c;
          ped = null;
        }
      }
    }
    for (const p of this.peds) {
      if (p.down > 0) continue;
      const q = p.c.root.position;
      const t = rayCylinder(o, d, q.x, q.z, 0.36, q.y, q.y + 1.82, best);
      if (t >= 0 && t < best) {
        best = t;
        ped = p;
        car = null;
      }
    }
    return car || ped ? { dist: best, car, ped } : null;
  }

  /** Positions of people and cars you could aim at (wrecks and downed people excluded). */
  targets() {
    const out: { x: number; y: number; z: number; car: boolean }[] = [];
    for (const p of this.peds) if (p.down <= 0) out.push({ x: p.c.root.position.x, y: 1.15, z: p.c.root.position.z, car: false });
    for (const c of this.cars) if (c.wreck <= 0) out.push({ x: c.group.position.x, y: 0.8, z: c.group.position.z, car: true });
    return out;
  }

  /** A bullet hit a car. Returns true if that shot blew it up. */
  hitCar(c: Car, dmg: number) {
    if (c.wreck > 0) return false;
    c.hp -= dmg;
    if (c.hp <= CAR_HP * 0.45) c.smoke.visible = true;
    if (c.hp > 0) return false;
    c.wreck = WRECK_T;
    c.speed = 0;
    c.turn = null;
    c.paint.color.set("#26221f");
    c.paint.metalness = 0.1;
    c.paint.roughness = 0.95;
    c.smoke.visible = true;
    (c.smoke.material as THREE.PointsMaterial).color.set("#2a2a2a");
    return true;
  }

  /** A bullet hit a pedestrian: they go down, then get up and run off. */
  hitPed(p: Ped, from: THREE.Vector3) {
    p.down = 2.4;
    p.dodge = 0;
    p.idle = 0;
    p.fleeDir = Math.sign(p.c.root.position.z - from.z) || 1;
    p.flee = 0;
    p.c.root.rotation.y = Math.atan2(from.x - p.c.root.position.x, from.z - p.c.root.position.z);
  }

  /** Gunfire nearby: everyone close by runs away from it. */
  panic(at: THREE.Vector3, r = 16) {
    for (const p of this.peds) {
      if (p.down > 0) continue;
      const pos = p.c.root.position;
      if (Math.hypot(pos.x - at.x, pos.z - at.z) > r) continue;
      p.flee = Math.max(p.flee, 6);
      p.idle = 0;
      p.fleeDir = Math.sign(pos.z - at.z) || 1;
    }
  }

  private repair(c: Car) {
    c.wreck = 0;
    c.hp = CAR_HP;
    c.paint.color.set(c.color);
    c.paint.metalness = 0.55;
    c.paint.roughness = 0.28;
    c.smoke.visible = false;
    (c.smoke.material as THREE.PointsMaterial).color.set("#555");
    c.body.rotation.set(0, 0, 0);
    c.group.position.y = 0;
    // A fresh one turns up where it first was (if that spot is free)
    const h = c.home;
    if (this.overlap(c, h.x, h.z, h.yaw) <= 0) {
      c.group.position.set(h.x, 0, h.z);
      c.yaw = h.yaw;
      c.lane = h.lane;
      c.dir = h.dir;
      c.group.rotation.y = h.yaw;
    }
  }

  setLight(night: number) {
    this.lights.emissiveIntensity = night * 2.2;
  }

  /** Is the circle (x, z, r) touching any car (except `skip`)? */
  hitsCar(x: number, z: number, r: number, skip?: Car) {
    for (const c of this.cars) {
      if (c === skip) continue;
      const fx = Math.sin(c.yaw);
      const fz = Math.cos(c.yaw);
      for (const o of CAR_PTS) {
        if (Math.hypot(x - (c.group.position.x + fx * o), z - (c.group.position.z + fz * o)) < r + CAR_R * 0.95) return c;
      }
    }
    return null;
  }

  /** If a circle overlaps a car, push it out (so a car can never trap you). */
  pushOut(pos: THREE.Vector3, r: number, skip?: Car | null) {
    let moved = false;
    for (const c of this.cars) {
      if (c === skip) continue;
      const fx = Math.sin(c.yaw);
      const fz = Math.cos(c.yaw);
      for (const o of CAR_PTS) {
        const cx = c.group.position.x + fx * o;
        const cz = c.group.position.z + fz * o;
        const dx = pos.x - cx;
        const dz = pos.z - cz;
        const d = Math.hypot(dx, dz);
        const min = r + CAR_R * 0.95 + 0.02;
        if (d < min) {
          const nx = d > 1e-4 ? dx / d : -fz;
          const nz = d > 1e-4 ? dz / d : fx;
          pos.x += nx * (min - d);
          pos.z += nz * (min - d);
          moved = true;
        }
      }
    }
    return moved;
  }

  /** A parked car close enough to get into. */
  nearestFree(p: THREE.Vector3, maxD = 3.2) {
    let best: Car | null = null;
    let bd = maxD;
    for (const c of this.cars) {
      if (c.traffic || c.wreck > 0) continue;
      const d = c.group.position.distanceTo(this.tmp.set(p.x, 0, p.z));
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    return best;
  }

  /**
   * How deeply car `c`, if it stood at (x, z, yaw), would sink into the other
   * cars (sum of circle overlaps; 0 = touching nothing).
   */
  private overlap(c: Car, x: number, z: number, yaw: number) {
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const min = 1.75; // a car is 1.85 wide, so side by side in lanes never counts
    let sum = 0;
    for (const o of this.cars) {
      if (o === c) continue;
      if (Math.abs(o.group.position.x - x) > 5 || Math.abs(o.group.position.z - z) > 5) continue;
      const ox = Math.sin(o.yaw);
      const oz = Math.cos(o.yaw);
      for (const a of CAR_PTS) {
        const ax = x + fx * a;
        const az = z + fz * a;
        for (const b of CAR_PTS) {
          const d = Math.hypot(ax - (o.group.position.x + ox * b), az - (o.group.position.z + oz * b));
          if (d < min) sum += min - d;
        }
      }
    }
    return sum;
  }

  /** True if moving `c` to this pose would push it further into another car. */
  private intoCar(c: Car, x: number, z: number, yaw: number) {
    const next = this.overlap(c, x, z, yaw);
    return next > 1e-4 && next > this.overlap(c, c.group.position.x, c.group.position.z, c.yaw) - 1e-4;
  }

  private carBlocked(c: Car, x: number, z: number, yaw: number) {
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    for (const o of CAR_PTS) {
      const px = x + fx * o;
      const pz = z + fz * o;
      if (this.q.blocked(px, pz, CAR_R)) return true;
      for (const wz of this.q.walls()) if (Math.abs(pz - wz) < CAR_R + 0.2 && Math.abs(px) < 27) return true;
    }
    return this.intoCar(c, x, z, yaw);
  }

  /** Drive a car from player input. Returns the impact speed if it crashed. */
  drive(c: Car, input: { throttle: number; steer: number; brake: boolean; boost: boolean }, dt: number, extraBlock: (x: number, z: number) => boolean) {
    const max = input.boost ? 30 : 22;
    if (input.throttle > 0) c.speed += (c.speed < 0 ? 24 : 13 * (input.boost ? 1.4 : 1)) * dt;
    else if (input.throttle < 0) c.speed -= (c.speed > 0 ? 24 : 9) * dt;
    else c.speed -= Math.sign(c.speed) * Math.min(Math.abs(c.speed), 5 * dt);
    if (input.brake) c.speed -= Math.sign(c.speed) * Math.min(Math.abs(c.speed), 16 * dt);
    c.speed = THREE.MathUtils.clamp(c.speed, -9, max);
    if (!input.boost && c.speed > 22) c.speed -= 10 * dt;

    c.steer = THREE.MathUtils.lerp(c.steer, input.steer, 1 - Math.exp(-dt * 8));
    const grip = THREE.MathUtils.clamp(Math.abs(c.speed) / 5, 0, 1) / (1 + Math.abs(c.speed) / 45);
    const yawRate = c.steer * 2.0 * grip * Math.sign(c.speed) * (input.brake ? 1.6 : 1);
    const nyaw = c.yaw + yawRate * dt;

    // Move in small steps so walls can't be skipped at speed
    const dist = c.speed * dt;
    const steps = Math.max(1, Math.ceil(Math.abs(dist) / 0.35));
    let crash = 0;
    let yaw = c.yaw;
    for (let i = 0; i < steps; i++) {
      const y2 = yaw + (nyaw - c.yaw) / steps;
      const nx = c.group.position.x + Math.sin(y2) * (dist / steps);
      const nz = c.group.position.z + Math.cos(y2) * (dist / steps);
      if (this.carBlocked(c, nx, nz, y2) || extraBlock(nx, nz)) {
        crash = Math.abs(c.speed);
        c.speed = -c.speed * 0.3;
        break;
      }
      c.group.position.x = THREE.MathUtils.clamp(nx, -26, 26);
      c.group.position.z = THREE.MathUtils.clamp(nz, -127, 59);
      yaw = y2;
    }
    c.yaw = yaw;
    this.pose(c, dt, c.steer, yawRate);
    return crash;
  }

  private pose(c: Car, dt: number, steer: number, yawRate: number) {
    c.group.rotation.y = c.yaw;
    for (const w of c.wheels) {
      w.spin.rotation.x += (c.speed * dt) / 0.36;
      if (w.front) w.steer.rotation.y = steer * 0.45;
    }
    // A little body roll in corners and dip under braking
    c.body.rotation.z = THREE.MathUtils.lerp(c.body.rotation.z, -yawRate * Math.abs(c.speed) * 0.004, 1 - Math.exp(-dt * 6));
  }

  update(dt: number, t: number, player: THREE.Vector3, driving: Car | null) {
    const walls = this.q.walls();
    // ── Damage: smoke drifts up, wrecks sit and smoulder, then get towed/replaced ──
    for (const c of this.cars) {
      if (c.smoke.visible) {
        const a = c.smoke.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < a.count; i++) {
          let y = a.getY(i) + dt * (c.wreck > 0 ? 1.6 : 0.9);
          if (y > 3.6) y = 1;
          a.setY(i, y);
        }
        a.needsUpdate = true;
      }
      if (c.wreck > 0) {
        c.wreck -= dt;
        c.speed = 0;
        c.body.rotation.z = THREE.MathUtils.lerp(c.body.rotation.z, 0.08, 1 - Math.exp(-dt * 4));
        if (c.wreck <= 0 && c !== driving && Math.hypot(player.x - c.group.position.x, player.z - c.group.position.z) > 14) this.repair(c);
        else if (c.wreck <= 0) c.wreck = 1; // wait until you're not looking right at it
      }
    }
    // ── Traffic ──
    for (const c of this.cars) {
      if (!c.traffic || c.wreck > 0) continue;
      const pd = Math.hypot(player.x - c.group.position.x, player.z - c.group.position.z);
      if (c.turn) {
        // U-turn across both lanes (waits if you're in the way)
        if (pd < 4.2) {
          this.pose(c, dt, 0, 0);
          continue;
        }
        const u = Math.min(1, c.turn.t + dt / 2.2);
        const nx = c.turn.x0 + (c.turn.x1 - c.turn.x0) * (1 - Math.cos(Math.PI * u)) * 0.5;
        const nz = c.turn.z0 + c.dir * Math.sin(Math.PI * u) * 2.2;
        const ny = c.turn.yaw0 + Math.PI * u;
        // Something in the way of the turn: wait for it to pass
        if (this.intoCar(c, nx, nz, ny)) {
          c.speed = 0;
          c.wait += dt;
          // Wedged for a while: finish the turn in one go if the far lane is free
          const fy = c.turn.yaw0 + Math.PI;
          if (c.wait > 3 && this.overlap(c, c.turn.x1, c.turn.z0, fy) <= 0) {
            c.group.position.set(c.turn.x1, 0, c.turn.z0);
            c.lane = c.turn.x1;
            c.turn = null;
            c.dir = -c.dir;
            c.yaw = c.dir < 0 ? Math.PI : 0;
            c.wait = 0;
          }
          this.pose(c, dt, 0.8, 0);
          continue;
        }
        c.wait = 0;
        c.turn.t = u;
        c.group.position.set(nx, 0, nz);
        c.yaw = ny;
        c.speed = 4;
        if (u >= 1) {
          c.lane = c.turn.x1;
          c.turn = null;
          c.dir = -c.dir;
          c.yaw = c.dir < 0 ? Math.PI : 0;
        }
        this.pose(c, dt, 0.8, 1);
        continue;
      }
      const z = c.group.position.z;
      const ahead = (zz: number) => (zz - z) * c.dir; // >0 when in front
      // Turn around at walls and at the ends of the street
      const wallAhead = walls.some((wz) => ahead(wz) > 0 && ahead(wz) < 6.5);
      const endAhead = (c.dir < 0 && z < Z_MIN + 3) || (c.dir > 0 && z > Z_MAX - 3);
      // Stuck behind something (a wreck, a car you left in the road) for a while: turn back
      if (wallAhead || endAhead || c.wait > 3) {
        c.wait = 0;
        // Only swing across once the other lane is clear nearby
        const clear = !this.cars.some(
          (o) => o !== c && Math.abs(o.group.position.x + c.lane) < 1.2 && Math.abs(o.group.position.z - z) < 7,
        );
        if (clear) c.turn = { t: 0, x0: c.group.position.x, x1: -c.lane, z0: z, yaw0: c.yaw };
        else c.speed = 0;
        this.pose(c, dt, 0, 0);
        continue;
      }
      // Brake for anything in the lane ahead
      let want = 8;
      const inLane = (x: number) => Math.abs(x - c.group.position.x) < 1.7;
      const check = (x: number, zz: number, gap: number) => {
        const a = ahead(zz);
        if (inLane(x) && a > 0 && a < gap) want = Math.min(want, Math.max(0, (a - 3.2) * 2));
      };
      check(player.x, player.z, 9);
      if (pd < 3.4) want = 0; // you're right next to it: stop
      for (const o of this.cars) if (o !== c) check(o.group.position.x, o.group.position.z, 9);
      c.speed = THREE.MathUtils.lerp(c.speed, want, 1 - Math.exp(-dt * (want < c.speed ? 6 : 1.5)));
      const nz = z + c.dir * c.speed * dt;
      const nx = THREE.MathUtils.lerp(c.group.position.x, c.lane, 1 - Math.exp(-dt * 2));
      // Hard stop rather than drive into another car
      if (this.intoCar(c, nx, nz, c.yaw)) c.speed = 0;
      else c.group.position.set(nx, 0, nz);
      // Count time spent stopped for anything except you
      if (c.speed < 0.3 && pd > 9) c.wait += dt;
      else c.wait = 0;
      this.pose(c, dt, 0, 0);
    }

    // Safety net: nudge any traffic that still overlaps another car apart
    for (const c of this.cars) {
      if (!c.traffic || c === driving || c.turn || c.wreck > 0) continue;
      for (const o of this.cars) {
        if (o === c) continue;
        const dx = c.group.position.x - o.group.position.x;
        const dz = c.group.position.z - o.group.position.z;
        if (Math.abs(dx) > 5 || Math.abs(dz) > 5 || this.overlap(c, c.group.position.x, c.group.position.z, c.yaw) <= 0) continue;
        const d = Math.hypot(dx, dz) || 1;
        // Mostly along the street so it stays in its lane
        c.group.position.z += (dz / d) * 2 * dt + (Math.abs(dz) < 0.01 ? c.dir * 2 * dt : 0);
      }
    }

    // ── Pedestrians ──
    const carNear = driving && Math.abs(driving.speed) > 3 ? driving : null;
    for (const p of this.peds) {
      const pos = p.c.root.position;
      let moving = true;
      if (p.down > 0) {
        // Knocked flat, then back up
        p.down -= dt;
        const k = p.down > 0.6 ? 1 : Math.max(0, p.down / 0.6);
        p.c.root.rotation.x = THREE.MathUtils.lerp(p.c.root.rotation.x, -1.45 * k, 1 - Math.exp(-dt * 10));
        animateCharacter(p.c, { phase: p.phase, stride: 0, t, stumble: k });
        if (p.down <= 0) {
          p.c.root.rotation.x = 0;
          p.flee = 6;
        }
        continue;
      }
      if (p.flee > 0) {
        // Running scared, hands up, away from where the trouble was
        p.flee -= dt;
        p.dir = p.fleeDir;
        const nz = pos.z + p.dir * 4.2 * dt;
        const hitWall = walls.some((wz) => Math.abs(nz - wz) < 0.8);
        if (hitWall || nz < Z_MIN || nz > Z_MAX || this.q.blocked(pos.x, nz, 0.35) || this.hitsCar(pos.x, nz, 0.35)) p.fleeDir = -p.fleeDir;
        else pos.z = nz;
        pos.x = THREE.MathUtils.lerp(pos.x, p.lane, 1 - Math.exp(-dt * 2));
        p.phase += 4.2 * dt * 1.2;
        p.c.root.rotation.y = p.dir < 0 ? Math.PI : 0;
        animateCharacter(p.c, { phase: p.phase, stride: 1, t, wave: 1 });
        continue;
      }
      if (p.dodge > 0) {
        // Jump out of the way of a fast car
        p.dodge -= dt;
        pos.x += p.dodgeDir * 4.5 * dt;
        p.c.root.rotation.y = Math.atan2(p.dodgeDir, 0);
        animateCharacter(p.c, { phase: p.phase, stride: 1, t, air: p.dodge > 0.25 });
        pos.y = Math.max(0, Math.sin((1 - p.dodge / 0.6) * Math.PI) * 0.5);
        continue;
      }
      pos.y = 0;
      if (carNear) {
        const cp = carNear.group.position;
        const d = Math.hypot(cp.x - pos.x, cp.z - pos.z);
        if (d < 5.5) {
          p.dodge = 0.6;
          p.dodgeDir = Math.sign(pos.x - cp.x) || Math.sign(pos.x) || 1;
          continue;
        }
      }
      // Drift back to the pavement
      pos.x = THREE.MathUtils.lerp(pos.x, p.lane, 1 - Math.exp(-dt * 0.8));
      if (p.idle > 0) {
        p.idle -= dt;
        moving = false;
      } else if (Math.random() < dt * 0.04) p.idle = 2 + Math.random() * 3;
      const dPlayer = Math.hypot(player.x - pos.x, player.z - pos.z);
      if (dPlayer < 1.1 && !driving) moving = false;
      if (moving) {
        const nz = pos.z + p.dir * p.speed * dt;
        const hitWall = walls.some((wz) => Math.abs(nz - wz) < 0.8);
        if (hitWall || nz < Z_MIN || nz > Z_MAX || this.q.blocked(pos.x, nz, 0.35) || this.hitsCar(pos.x, nz, 0.35)) p.dir = -p.dir;
        else pos.z = nz;
        p.phase += p.speed * dt * 1.55;
      }
      const face = moving ? (p.dir < 0 ? Math.PI : 0) : Math.atan2(player.x - pos.x, player.z - pos.z);
      let dy = face - p.c.root.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      p.c.root.rotation.y += dy * Math.min(1, dt * (moving ? 6 : 2));
      animateCharacter(p.c, { phase: p.phase, stride: moving ? 0.45 : 0, t: t + p.lane, wave: !moving && dPlayer < 4 ? 0.6 : 0 });
    }
  }
}
