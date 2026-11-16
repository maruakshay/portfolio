import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { core, experiences, skills, stageFor, stages, TOTAL_MEDALS, type Speaker } from "@/lib/game-data";
import { Combat, type CombatEvent } from "./combat";
import { Vehicles, type Car } from "./vehicles";
import { animateCharacter, applyStage, attachGun, buildCharacter, type Character } from "./character";
import { BOUNDS, buildSky, buildTown, CORE_POS, CORE_R, daylightAt, readFonts, SPAWN, type Placed, type Sky, type Town } from "./world";

export interface EngineCallbacks {
  /** The spot id the player is standing at (or null). */
  onNear: (id: string | null) => void;
  /** E / Enter pressed at a spot. */
  onInteract: (id: string) => void;
  /** Every frame: player position and facing, for the minimap. */
  onTick: (x: number, z: number, yaw: number, camYaw: number, kmh: number) => void;
  /** On foot near a car, driving, or neither. */
  onVehicle: (state: "none" | "near" | "driving") => void;
  /** Local time changed bucket (for the HUD clock). */
  onClock: (label: string, hours: number) => void;
  /** Player hit points changed. */
  onHp: (hp: number, max: number) => void;
  /** Fights: walls, foes, the boss. */
  onCombat: (e: CombatEvent) => void;
  /** Knocked out (respawning). */
  onDown: () => void;
  /** Ammo left in the magazine (or reloading). */
  onAmmo: (ammo: number, mag: number, reloading: boolean) => void;
  /** A bullet hit something. */
  onHitMarker: () => void;
}

const NEAR = 2.6;
const PLAYER_R = 0.38;
const GRAVITY = 32;
const MAG = 24;
const FIRE_GAP = 0.12; // seconds between shots
const RELOAD_T = 1.1;
const RANGE = 38;
const BLAST_CD = 2.2;

type Effect = (dt: number) => boolean;
interface Host {
  c: Character;
  pl: Placed;
  yaw: number;
  wave: number;
  talk: number;
}

export class TownGame {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private hemi: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;
  private moonLight: THREE.DirectionalLight;
  private town!: Town;
  private sky!: Sky;
  private player!: Character;
  private hosts: Host[] = [];
  private orb = new THREE.Group();
  private orbCore!: THREE.Mesh;
  private orbLight!: THREE.PointLight;
  private keys = new Set<string>();
  private paused = true;
  private yaw = Math.PI; // facing -z
  private vel = new THREE.Vector3();
  private phase = 0;
  private stride = 0;
  private near: string | null = null;
  private zoom = 1;
  private effects: Effect[] = [];
  private raf = 0;
  private clock = new THREE.Clock();
  private lastClockCheck = -1;
  private disposed = false;
  private medalCount = 0;
  private collected = new Set<string>();
  private speed = 6.4;
  private jumpApex = 1.15;
  // Jump with real gravity and a short input buffer
  private vy = 0;
  private grounded = true;
  private jumpBuf = 0;
  // The gun
  private gun!: { gun: THREE.Group; muzzle: THREE.Object3D };
  private flash!: THREE.PointLight;
  private ammo = MAG;
  private fireCd = 0;
  private reloadT = 0;
  private trigger = false;
  private tap = false;
  private aiming = false;
  private aimBlend = 0;
  private faceAimT = 0;
  // Open world: cars, mouse-look camera, mission markers
  private vehicles!: Vehicles;
  private driving: Car | null = null;
  private vehState: "none" | "near" | "driving" = "none";
  private camYaw = 0;
  private camPitch = 0;
  private mouseIdle = 9;
  private markers: { m: THREE.Group; id: string }[] = [];
  private stun = 0;
  // Combat
  private combat!: Combat;
  private hp = 5;
  private maxHp = 5;
  private power = 1;
  private iframes = 0;
  private blastCd = 0;
  private hitStop = 0;
  private shakeAmt = 0;
  private downT = 0;
  private bubble: HTMLElement | null;
  private reduced: boolean;
  // Conversation
  private talkWith: string | null = null;
  private speaking: Speaker | null = null;
  private stand = new THREE.Vector3();
  private sunDir = new THREE.Vector3(0, 1, 0);
  private moonDir = new THREE.Vector3(0, 1, 0);

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: EngineCallbacks,
    bubble: HTMLElement | null,
  ) {
    this.bubble = bubble;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 900);
    this.scene.fog = new THREE.Fog("#cfe6f7", 70, 280);

    this.hemi = new THREE.HemisphereLight("#cfe6f7", "#4a5d3a", 0.8);
    this.sunLight = new THREE.DirectionalLight("#fff4e0", 2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    const sc = this.sunLight.shadow.camera;
    sc.left = -40;
    sc.right = 40;
    sc.top = 40;
    sc.bottom = -40;
    sc.near = 1;
    sc.far = 240;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.03;
    this.moonLight = new THREE.DirectionalLight("#9fb4ff", 0.4);
    this.scene.add(this.hemi, this.sunLight, this.sunLight.target, this.moonLight, this.moonLight.target);
  }

  async init() {
    // Canvas signs use the page fonts, so wait for them (but never block forever).
    await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]);
    if (this.disposed) return;
    const fonts = readFonts();

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.sky = buildSky();
    this.scene.add(this.sky.dome, this.sky.stars, this.sky.sun, this.sky.moon, this.sky.clouds);

    this.town = buildTown(experiences, skills, core, fonts, env);
    this.scene.add(this.town.group);

    // Hosts: Akshay as he was at each job; shopkeeper Akshay in an apron.
    for (const pl of this.town.placed) {
      const c = buildCharacter();
      applyStage(c, stages[pl.spot.era], pl.spot.kind === "skill" ? { apron: pl.spot.accent, host: true } : { host: true });
      c.root.position.copy(pl.hostPos);
      c.root.rotation.y = pl.hostYaw;
      this.scene.add(c.root);
      this.hosts.push({ c, pl, yaw: pl.hostYaw, wave: 0, talk: 0 });
    }

    this.player = buildCharacter();
    this.player.root.position.copy(SPAWN);
    this.player.root.rotation.y = this.yaw;
    this.scene.add(this.player.root);
    applyStage(this.player, stageFor(0));
    this.gun = attachGun(this.player);
    this.flash = new THREE.PointLight("#ffb35c", 0, 6, 2);
    this.gun.muzzle.add(this.flash);

    this.combat = new Combat(
      {
        scene: this.scene,
        player: this.player.root.position,
        blocked: (x, z, r) => this.blockedStatic(x, z, r) || !!this.vehicles?.hitsCar(x, z, r),
        hurt: (dmg, from) => this.hurt(dmg, from),
        burst: (at, color, n) => this.burst(at, color, n),
        shake: (a) => (this.shakeAmt = Math.max(this.shakeAmt, a)),
        emit: (e) => this.onCombat(e),
      },
      fonts,
    );

    this.vehicles = new Vehicles(env, {
      blocked: (x, z, r) => this.blockedStatic(x, z, r),
      walls: () => this.combat.solidWalls(),
      hosts: () => this.hosts.map((h) => h.c.root.position),
    });
    this.scene.add(this.vehicles.group);

    // Mission markers: a glowing column at every door you haven't visited
    const markerMat = new THREE.ShaderMaterial({
      uniforms: { t: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform float t; varying vec2 vUv; void main(){ float a = (1.0 - vUv.y) * (0.55 + 0.15 * sin(t * 3.0 + vUv.y * 8.0)); gl_FragColor = vec4(1.0, 0.82, 0.25, a); }",
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const colGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.6, 32, 1, true);
    const ringGeo = new THREE.RingGeometry(0.75, 0.95, 40);
    const ringMat = new THREE.MeshBasicMaterial({ color: "#ffd23f", transparent: true, opacity: 0.8, side: THREE.DoubleSide, toneMapped: false });
    for (const pl of this.town.placed) {
      const m = new THREE.Group();
      const col = new THREE.Mesh(colGeo, markerMat);
      col.position.y = 0.8;
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      m.add(col, ring);
      m.position.set(pl.door.x, 0, pl.door.z);
      this.scene.add(m);
      this.markers.push({ m, id: pl.spot.id });
    }


    // The AI companion: small, dim and curious at first; it grows with every medal.
    this.orbCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 16),
      new THREE.MeshStandardMaterial({ color: "#bdf3ff", emissive: "#38bdf8", emissiveIntensity: 1.4, roughness: 0.2 }),
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.02, 8, 32),
      new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#7dd3fc", emissiveIntensity: 1.2 }),
    );
    ring.rotation.x = Math.PI / 2.4;
    this.orbLight = new THREE.PointLight("#7dd3fc", 1.5, 5, 2);
    this.orb.add(this.orbCore, ring, this.orbLight);
    this.orb.position.copy(SPAWN).add(new THREE.Vector3(0.8, 2.2, 0));
    this.scene.add(this.orb);

    this.camera.position.set(SPAWN.x, 6.6, SPAWN.z + 8.2);
    this.camTarget.set(SPAWN.x, 1.3, SPAWN.z - 3);
    this.resize();
    this.updateDaylight(true);
    window.addEventListener("resize", this.resize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.canvas.addEventListener("mousedown", this.onMouse);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("contextmenu", this.onContext);
    document.addEventListener("mousemove", this.onMouseMove);
    this.clock.start();
    this.loop();
  }

  // ── Public API ──

  setPaused(p: boolean) {
    this.paused = p;
    if (p && document.pointerLockElement === this.canvas) document.exitPointerLock();
    if (p) this.keys.clear();
  }

  /** Start (id) or end (null) a conversation: walk into place, cut to a two-shot. */
  converse(id: string | null) {
    // Keep the floating medal out of the two-shot while you talk
    for (const pl of this.town.placed) pl.medal.visible = !this.collected.has(pl.spot.id) && pl.spot.id !== id;
    this.talkWith = id;
    this.speaking = null;
    if (id && document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.keys.clear();
    if (!id) return;
    if (id === core.id) {
      this.stand.copy(this.town.core.door);
      return;
    }
    const h = this.hosts.find((x) => x.pl.spot.id === id);
    if (!h) return;
    const face = Math.sin(h.pl.hostYaw); // +1 faces +x, -1 faces -x
    this.stand.set(h.pl.hostPos.x + face * 1.45, 0, h.pl.hostPos.z - 0.2);
  }

  setSpeaker(who: Speaker | null) {
    this.speaking = who;
  }

  /** Sync collected medals. `celebrate` plays the pickup / evolve effects. */
  setCollected(ids: Iterable<string>, celebrate: boolean) {
    if (!this.town) return;
    const next = new Set(ids);
    const prevStage = stageFor(this.medalCount);
    for (const p of this.town.placed) {
      const had = this.collected.has(p.spot.id);
      const has = next.has(p.spot.id);
      p.medal.visible = !has;
      if (has && !had && celebrate) this.burst(p.medal.position.clone(), "#f5c542", 70);
    }
    this.collected = next;
    this.medalCount = next.size;
    const stage = stageFor(this.medalCount);
    applyStage(this.player, stage);
    this.speed = stage.speed;
    this.jumpApex = stage.jump;
    this.power = stage.power;
    this.maxHp = stage.hp;
    // A medal is a full heal
    if (celebrate || this.hp > this.maxHp || !this.synced) this.hp = this.maxHp;
    this.synced = true;
    this.cb.onHp(this.hp, this.maxHp);
    if (celebrate && stage.name !== prevStage.name) this.evolveFx();
    this.updateOrb();
    this.combat.setState(this.fightsDone, this.combat.bossDown, this.medalCount >= TOTAL_MEDALS);
    this.refreshCore(celebrate);
  }

  private fightsDone: number[] = [];
  private synced = false;

  /** Restore which fights are won and whether the Black Box is down. */
  setProgress(fights: number[], bossDown: boolean) {
    if (!this.town) return;
    this.fightsDone = [...fights];
    this.combat.setState(fights, bossDown, this.medalCount >= TOTAL_MEDALS);
    this.refreshCore(false);
  }

  private refreshCore(celebrate: boolean) {
    const open = this.medalCount >= TOTAL_MEDALS && this.combat.bossDown;
    const wasOpen = this.town.core.beam.visible;
    this.town.core.beam.visible = open;
    this.town.core.gate.visible = !open;
    this.town.core.setSign(this.medalCount, TOTAL_MEDALS, !this.combat.bossDown);
    if (open && !wasOpen && celebrate) this.burst(CORE_POS.clone().setY(24), "#ffb347", 160);
  }

  private onCombat(e: CombatEvent) {
    if (e.type === "cleared") {
      if (!this.fightsDone.includes(e.idx)) this.fightsDone.push(e.idx);
      this.hp = this.maxHp;
      this.cb.onHp(this.hp, this.maxHp);
    }
    if (e.type === "bossDown") {
      this.hp = this.maxHp;
      this.cb.onHp(this.hp, this.maxHp);
      this.refreshCore(true);
    }
    this.cb.onCombat(e);
  }

  /** Take a hit. Returns false while invulnerable. */
  private hurt(dmg: number, from: THREE.Vector3) {
    if (this.iframes > 0 || this.downT > 0 || this.talkWith || this.paused) return false;
    const p = this.player.root.position;
    this.hp = Math.max(0, this.hp - dmg);
    this.iframes = 1.0;
    const away = this.tmp2.set(p.x - from.x, 0, p.z - from.z);
    if (away.lengthSq() < 0.001) away.set(0, 0, 1);
    away.normalize();
    this.vel.copy(away).multiplyScalar(8);
    this.stun = 0.28;
    this.shakeAmt = Math.max(this.shakeAmt, 0.3);
    this.hitStop = 0.06;
    this.burst(p.clone().setY(1.1), "#ff4d6d", 24);
    this.cb.onHp(this.hp, this.maxHp);
    if (this.hp <= 0) {
      if (this.driving) this.exitCar();
      this.downT = 1.4;
      this.cb.onDown();
    }
    return true;
  }

  respawn() {
    this.player.root.position.copy(SPAWN);
    this.yaw = Math.PI;
    this.vel.set(0, 0, 0);
    this.vy = 0;
    if (this.driving) this.exitCar();
    this.camYaw = 0;
    this.combat.reset();
    this.ammo = MAG;
    this.reloadT = 0;
    this.cb.onAmmo(this.ammo, MAG, false);
    this.hp = this.maxHp;
    this.cb.onHp(this.hp, this.maxHp);
  }

  /** Dev/testing helper. */
  teleport(x: number, z: number) {
    this.player.root.position.set(x, 0, z);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("mousedown", this.onMouse);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("contextmenu", this.onContext);
    document.removeEventListener("mousemove", this.onMouseMove);
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
      for (const x of mats) {
        for (const v of Object.values(x)) if (v instanceof THREE.Texture) v.dispose();
        x.dispose();
      }
    });
    this.renderer.dispose();
  }

  // ── Input ──

  private onKeyDown = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (this.paused || this.talkWith) return;
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
    if (k === "f" && !e.repeat) {
      e.preventDefault();
      if (this.driving) this.exitCar();
      else this.enterCar();
      return;
    }
    if (this.driving) {
      this.keys.add(k);
      return;
    }
    if ((k === "e" || k === "enter") && this.near) {
      e.preventDefault();
      this.cb.onInteract(this.near);
      return;
    }
    if (k === " " && !e.repeat) this.jumpBuf = 0.14;
    if (k === "j") {
      this.trigger = true;
      if (!e.repeat) this.tap = true;
    }
    if (k === "r" && !e.repeat) this.reload();
    if ((k === "q" || k === "k") && !e.repeat) this.fireBlast();
    this.keys.add(k);
  };
  private onMouse = (e: MouseEvent) => {
    if (this.paused || this.talkWith) return;
    // First click grabs the mouse for looking around (Esc lets go)
    if (document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock?.();
      return;
    }
    if (this.driving) return;
    if (e.button === 0) {
      this.trigger = true;
      this.tap = true;
    }
    else if (e.button === 2) this.aiming = true;
  };
  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.trigger = false;
    else if (e.button === 2) this.aiming = false;
  };
  private onContext = (e: Event) => e.preventDefault();
  private onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== this.canvas) return;
    this.camYaw -= e.movementX * 0.0026;
    this.camPitch = THREE.MathUtils.clamp(this.camPitch + e.movementY * 0.0018, -0.35, 0.7);
    this.mouseIdle = 0;
  };

  private enterCar() {
    if (this.downT > 0 || this.talkWith || this.combat.bossFight) return;
    const c = this.vehicles.nearestFree(this.player.root.position);
    if (!c) return;
    this.driving = c;
    c.speed = 0;
    this.trigger = this.aiming = false;
    this.player.root.visible = false;
    this.burst(c.group.position.clone().setY(1.2), "#ffd23f", 14);
  }

  private exitCar() {
    const c = this.driving;
    if (!c) return;
    this.driving = null;
    c.speed = 0;
    const p = this.player.root.position;
    // Step out on the driver's side, or whichever side is free
    const rx = -Math.cos(c.yaw);
    const rz = Math.sin(c.yaw);
    for (const side of [-1, 1, 0]) {
      const x = c.group.position.x + (side === 0 ? Math.sin(c.yaw) * 3 : rx * side * 1.7);
      const z = c.group.position.z + (side === 0 ? Math.cos(c.yaw) * 3 : rz * side * 1.7);
      p.set(x, 0, z);
      if (!this.blocked(x, z)) break;
    }
    this.yaw = c.yaw;
    this.vy = 0;
    this.grounded = true;
    this.vel.set(0, 0, 0);
  }

  private reload() {
    if (this.reloadT > 0 || this.ammo === MAG) return;
    this.reloadT = RELOAD_T;
    this.cb.onAmmo(this.ammo, MAG, true);
  }

  /** Which way the gun points: the camera's forward when you're using the mouse, else the nearest bug. */
  private aimYaw() {
    const p = this.player.root.position;
    const locked = document.pointerLockElement === this.canvas;
    let yaw = locked ? this.camYaw + Math.PI : this.yaw;
    if (!locked) {
      const tgt = this.combat.nearest(p, 20);
      if (tgt) yaw = Math.atan2(tgt.x - p.x, tgt.z - p.z);
    }
    const assist = this.combat.aimAssist(p, yaw, locked ? 0.1 : 0.35, RANGE);
    return assist ?? yaw;
  }

  private fire() {
    this.tap = false;
    const p = this.player.root.position;
    const yaw = this.aimYaw();
    this.yaw = yaw;
    this.faceAimT = 0.7;
    this.ammo--;
    this.fireCd = FIRE_GAP;
    const dir = this.tmp2.set(Math.sin(yaw), 0, Math.cos(yaw));
    const from = this.gun.muzzle.getWorldPosition(new THREE.Vector3());
    // Snap the muzzle to the aim line so tracers look right even mid-animation
    const o = new THREE.Vector3(p.x, from.y, p.z).addScaledVector(dir, 0.55);
    const range = this.rayToWalls(o, dir, RANGE);
    // Cars and people on the street catch bullets too
    const veh = this.vehicles.raycast(o, dir, range);
    const res = this.combat.shoot(o, dir, veh ? veh.dist : range, 0.55 * this.power);
    let y = res.hit ? res.y : o.y;
    if (!res.hit && veh?.car) {
      y = 0.9;
      const at = o.clone().addScaledVector(dir, veh.dist).setY(y);
      if (this.vehicles.hitCar(veh.car, 1)) this.explode(veh.car.group.position.clone().setY(1));
      else this.burst(at, "#ffe9a8", 6);
      this.cb.onHitMarker();
    } else if (!res.hit && veh?.ped) {
      y = 1.2;
      this.vehicles.hitPed(veh.ped, p);
      this.burst(o.clone().addScaledVector(dir, veh.dist).setY(y), "#ffffff", 8);
      this.cb.onHitMarker();
    }
    const end = o.clone().addScaledVector(dir, res.dist).setY(y);
    this.tracer(o, end);
    this.flash.intensity = 6;
    this.vehicles.panic(p);
    if (res.hit) this.cb.onHitMarker();
    else if (!veh && range < RANGE) this.burst(end, "#ffd27a", 5);
    this.shakeAmt = Math.max(this.shakeAmt, 0.035);
    this.cb.onAmmo(this.ammo, MAG, false);
    if (this.ammo <= 0) this.reload();
  }

  /** Distance along a flat ray to the first building, car or lamp. */
  private rayToWalls(o: THREE.Vector3, d: THREE.Vector3, max: number) {
    let best = max;
    for (const b of this.town.colliders) {
      let t0 = 0;
      let t1 = best;
      for (const [oo, dd, lo, hi] of [
        [o.x, d.x, b.minX, b.maxX],
        [o.z, d.z, b.minZ, b.maxZ],
      ]) {
        if (Math.abs(dd) < 1e-6) {
          if (oo < lo || oo > hi) t0 = Infinity;
          continue;
        }
        let a = (lo - oo) / dd;
        let c = (hi - oo) / dd;
        if (a > c) [a, c] = [c, a];
        t0 = Math.max(t0, a);
        t1 = Math.min(t1, c);
      }
      if (t0 <= t1 && t0 < best) best = t0;
    }
    return best;
  }

  /** A car goes up: fireball, big shake, and it hurts if you're standing next to it. */
  private explode(at: THREE.Vector3) {
    this.burst(at, "#ff7a1a", 40);
    this.burst(at.clone().setY(2), "#ffd23f", 30);
    this.burst(at.clone().setY(1.5), "#3a3a3a", 24);
    this.shakeAmt = Math.max(this.shakeAmt, 0.6);
    const boom = new THREE.PointLight("#ff8a3d", 30, 18, 2);
    boom.position.copy(at).setY(2);
    this.scene.add(boom);
    let t = 0;
    this.effects.push((dt) => {
      t += dt;
      boom.intensity = 30 * Math.max(0, 1 - t / 0.5);
      if (t > 0.5) {
        this.scene.remove(boom);
        return false;
      }
      return true;
    });
    const p = this.player.root.position;
    if (!this.driving && Math.hypot(p.x - at.x, p.z - at.z) < 4) this.hurt(2, at);
    this.vehicles.panic(at, 24);
  }

  private tracer(a: THREE.Vector3, b: THREE.Vector3) {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    const mat = new THREE.LineBasicMaterial({ color: "#ffd27a", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    let t = 0;
    this.effects.push((dt) => {
      t += dt;
      mat.opacity = Math.max(0, 1 - t / 0.08);
      if (t > 0.08) {
        this.scene.remove(line);
        geo.dispose();
        mat.dispose();
        return false;
      }
      return true;
    });
  }

  private fireBlast() {
    if (this.blastCd > 0 || this.downT > 0 || this.talkWith) return;
    this.blastCd = BLAST_CD;
    this.combat.blast(this.orb.position.clone(), this.yaw, 1 + this.power * 1.5);
    this.burst(this.orb.position.clone(), "#7dd3fc", 16);
  }
  private onKeyUp = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    this.keys.delete(k);
    if (k === "j") this.trigger = false;
  };
  private onBlur = () => {
    this.keys.clear();
    this.trigger = this.aiming = false;
  };
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.zoom = THREE.MathUtils.clamp(this.zoom + e.deltaY * 0.001, 0.6, 1.7);
  };

  private resize = () => {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  // ── Day / night from the visitor's local clock ──

  private updateDaylight(force = false) {
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    const bucket = Math.floor(hours * 12); // every 5 minutes
    if (!force && bucket === this.lastClockCheck) return;
    this.lastClockCheck = bucket;
    const d = daylightAt(hours);
    const night = 1 - d.day;

    this.sky.uniforms.top.value.copy(d.top);
    this.sky.uniforms.horizon.value.copy(d.horizon);
    (this.scene.fog as THREE.Fog).color.copy(d.horizon);
    (this.sky.stars.material as THREE.PointsMaterial).opacity = Math.max(0, night - 0.25) * 1.2;

    this.hemi.color.copy(d.top).lerp(new THREE.Color("#ffffff"), 0.45);
    this.hemi.groundColor.set("#5a5a48").lerp(new THREE.Color("#0b1020"), night * 0.7);
    this.hemi.intensity = 0.3 + d.day * 0.7;
    this.sunLight.intensity = d.day * 2.6;
    this.sunLight.color.set("#ffb07a").lerp(new THREE.Color("#fff4e0"), 1 - d.twilight);
    this.moonLight.intensity = night * 0.6;
    this.renderer.toneMappingExposure = 0.8 + d.day * 0.25;

    this.sunDir.copy(d.sunDir);
    this.moonDir.copy(d.sunDir).negate().setY(Math.abs(d.sunDir.y) * 0.8 + 0.25).normalize();
    this.sky.sun.visible = d.sunDir.y > -0.05;
    this.sky.moon.visible = night > 0.3;

    this.town.setLight(night, d.day);
    this.vehicles?.setLight(night);
    const cloud = this.sky.clouds.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
    (cloud?.material as THREE.MeshStandardMaterial | undefined)?.color.set("#ffffff").lerp(new THREE.Color("#4a5070"), night * 0.75);
    this.cb.onClock(d.label, hours);
  }

  // ── Effects ──

  private burst(at: THREE.Vector3, color: string, n: number) {
    if (this.reduced) return;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const vel: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      pos.set([at.x, at.y, at.z], i * 3);
      vel.push(new THREE.Vector3((Math.random() - 0.5) * 7, Math.random() * 6 + 2, (Math.random() - 0.5) * 7));
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size: 0.16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    let life = 1.6;
    this.effects.push((dt) => {
      life -= dt;
      const a = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < n; i++) {
        vel[i].y -= 10 * dt;
        a.setXYZ(i, a.getX(i) + vel[i].x * dt, Math.max(0.05, a.getY(i) + vel[i].y * dt), a.getZ(i) + vel[i].z * dt);
      }
      a.needsUpdate = true;
      mat.opacity = Math.max(0, life / 1.6);
      if (life <= 0) {
        this.scene.remove(pts);
        geo.dispose();
        mat.dispose();
        return false;
      }
      return true;
    });
  }

  private evolveFx() {
    if (this.grounded) {
      this.vy = 7;
      this.grounded = false;
    }
    if (this.reduced) return;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.05, 8, 48),
      new THREE.MeshBasicMaterial({ color: "#ffb347", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
    let t = 0;
    this.effects.push((dt) => {
      t += dt;
      ring.position.copy(this.player.root.position).setY(0.15 + t * 1.1);
      ring.scale.setScalar(1 + t * 4);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t / 1.1);
      if (t > 1.1) {
        this.scene.remove(ring);
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
    this.burst(this.player.root.position.clone().setY(1), "#ff8a3d", 90);
  }

  private updateOrb() {
    const k = this.medalCount / TOTAL_MEDALS;
    this.orbCore.scale.setScalar(1 + k * 0.9);
    const mat = this.orbCore.material as THREE.MeshStandardMaterial;
    const col = new THREE.Color("#38bdf8").lerp(new THREE.Color("#ff8a3d"), k);
    mat.emissive.copy(col);
    mat.emissiveIntensity = 1.2 + k * 1.6;
    this.orbLight.color.copy(col);
    this.orbLight.intensity = 1.5 + k * 5;
  }

  // ── Loop ──

  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private camTarget = new THREE.Vector3();
  private camPos = new THREE.Vector3();

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    let dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      dt *= 0.1;
    }
    const t = this.clock.elapsedTime;
    this.updateDaylight();
    this.step(dt, t);
    this.renderer.render(this.scene, this.camera);
  };

  private step(dt: number, t: number) {
    const p = this.player.root.position;
    const talking = !!this.talkWith;

    // ── Driving ──
    let sp = 0;
    if (this.driving) {
      const c = this.driving;
      const live = !this.paused && !talking && this.downT <= 0;
      const k = (a: string, b: string) => (live && (this.keys.has(a) || this.keys.has(b)) ? 1 : 0);
      const crash = this.vehicles.drive(
        c,
        {
          throttle: k("w", "arrowup") - k("s", "arrowdown"),
          steer: k("a", "arrowleft") - k("d", "arrowright"),
          brake: live && this.keys.has(" "),
          boost: live && this.keys.has("shift"),
        },
        dt,
        (x, z) => this.combat.outsideArena(x, z, 1.1),
      );
      if (crash > 4) {
        this.shakeAmt = Math.max(this.shakeAmt, Math.min(0.6, crash / 35));
        if (crash > 9) this.burst(c.group.position.clone().add(this.tmp.set(Math.sin(c.yaw) * 2.2, 0.7, Math.cos(c.yaw) * 2.2)), "#ffd27a", 20);
      }
      if (this.combat.ram(c.group.position, c.speed, this.power * 2)) {
        c.speed = -c.speed * 0.4;
        this.shakeAmt = Math.max(this.shakeAmt, 0.4);
      }
      p.set(c.group.position.x, 0, c.group.position.z);
      this.yaw = c.yaw;
      this.vel.set(0, 0, 0);
    } else {
    // Never get stuck inside a car that moved into you
    if (this.vehicles.pushOut(p, PLAYER_R)) this.vel.multiplyScalar(0.5);
    // ── Movement ──
    let ix = 0;
    let iz = 0;
    if (!this.paused && !talking && this.stun <= 0 && this.downT <= 0) {
      if (this.keys.has("w") || this.keys.has("arrowup")) iz -= 1;
      if (this.keys.has("s") || this.keys.has("arrowdown")) iz += 1;
      if (this.keys.has("a") || this.keys.has("arrowleft")) ix -= 1;
      if (this.keys.has("d") || this.keys.has("arrowright")) ix += 1;
    }
    const run = (this.keys.has("shift") && !this.aiming ? 1.55 : 1) * (this.aiming ? 0.55 : 1);
    const target = this.tmp.set(0, 0, 0);
    const len = Math.hypot(ix, iz);
    if (len > 0) {
      // Camera-relative: W walks away from the camera
      const cx = Math.cos(this.camYaw);
      const sx = Math.sin(this.camYaw);
      const wx = ix * cx + iz * sx;
      const wz = -ix * sx + iz * cx;
      target.set((wx / len) * this.speed * run, 0, (wz / len) * this.speed * run);
    }
    if (talking) {
      // Walk into the conversation spot
      const dx = this.stand.x - p.x;
      const dz = this.stand.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.08) target.set((dx / dist) * Math.min(3.2, dist * 4), 0, (dz / dist) * Math.min(3.2, dist * 4));
    }
    this.vel.lerp(target, 1 - Math.exp(-dt * 12));
    sp = Math.hypot(this.vel.x, this.vel.z);

    let wantYaw = this.yaw;
    if (sp > 0.3) wantYaw = Math.atan2(this.vel.x, this.vel.z);
    // Aiming or just fired: keep facing the target and strafe
    if (!talking && (this.aiming || this.faceAimT > 0)) wantYaw = this.aiming && document.pointerLockElement === this.canvas ? this.camYaw + Math.PI : this.yaw;
    if (talking && sp < 0.6) {
      const focus = this.talkFocus();
      wantYaw = Math.atan2(focus.x - p.x, focus.z - p.z);
    }
    let dy = wantYaw - this.yaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    this.yaw += dy * (1 - Math.exp(-dt * 12));

    const nx = THREE.MathUtils.clamp(p.x + this.vel.x * dt, BOUNDS.minX, BOUNDS.maxX);
    if (talking || (!this.blocked(nx, p.z) && !this.combat.outsideArena(nx, p.z, PLAYER_R))) p.x = nx;
    else this.vel.x = 0;
    const nz = THREE.MathUtils.clamp(p.z + this.vel.z * dt, BOUNDS.minZ, BOUNDS.maxZ);
    if (
      talking ||
      (!this.blocked(p.x, nz) &&
        !this.combat.blocks(p.x, p.z, nz, PLAYER_R) &&
        !this.combat.outsideArena(p.x, nz, PLAYER_R))
    )
      p.z = nz;
    else this.vel.z = 0;

    // ── Jump ──
    if (this.jumpBuf > 0) this.jumpBuf -= dt;
    const canJump = !this.paused && !talking && this.stun <= 0 && this.downT <= 0;
    if (this.jumpBuf > 0 && canJump && this.grounded) {
      this.vy = Math.sqrt(2 * GRAVITY * this.jumpApex);
      this.grounded = false;
      this.jumpBuf = 0;
    }
    if (!this.grounded) {
      this.vy -= GRAVITY * dt;
      p.y += this.vy * dt;
      if (p.y <= 0) {
        p.y = 0;
        this.vy = 0;
        this.grounded = true;
      }
    }
    }

    // ── Fighting ──
    const live = !this.paused && !talking && this.downT <= 0;
    // ── Shooting ──
    if (this.fireCd > 0) this.fireCd -= dt;
    if (this.faceAimT > 0) this.faceAimT -= dt;
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        this.ammo = MAG;
        this.cb.onAmmo(this.ammo, MAG, false);
      }
    }
    if (live && !this.driving && (this.trigger || this.tap) && this.fireCd <= 0 && this.ammo > 0 && this.reloadT <= 0 && this.stun <= 0) this.fire();
    if (this.fireCd <= 0 || this.reloadT > 0) this.tap = false;
    this.flash.intensity *= Math.exp(-dt * 30);
    this.aimBlend = THREE.MathUtils.lerp(this.aimBlend, !talking && (this.aiming || this.faceAimT > 0 || this.trigger) ? 1 : 0, 1 - Math.exp(-dt * 14));
    if (this.blastCd > 0) this.blastCd -= dt;
    if (this.iframes > 0) this.iframes -= dt;
    this.player.root.visible = !this.driving && (this.iframes <= 0 || this.downT > 0 || Math.floor(this.iframes * 14) % 2 === 0);
    this.vehicles.update(dt, t, p, this.driving);
    this.combat.update(dt, t, live);

    // Knocked out: fall, then reboot at the last safe spot
    if (this.downT > 0) {
      this.downT -= dt;
      if (this.downT <= 0) {
        const safe = this.combat.safeSpot();
        this.combat.reset();
        p.set(safe.x, 0, safe.z);
        this.vy = 0;
        this.grounded = true;
        this.yaw = Math.PI;
        this.vel.set(0, 0, 0);
        this.hp = this.maxHp;
        this.iframes = 1.5;
        this.cb.onHp(this.hp, this.maxHp);
        this.burst(p.clone().setY(1), "#7dd3fc", 60);
      }
    }
    if (this.stun > 0) this.stun -= dt;

    this.player.root.rotation.y = this.yaw;
    this.stride = THREE.MathUtils.lerp(this.stride, Math.min(1, sp / 6.5), 1 - Math.exp(-dt * 10));
    this.phase += sp * dt * 1.55;
    animateCharacter(this.player, {
      phase: this.phase,
      stride: this.stride,
      t,
      air: !this.grounded,
      talk: this.speaking === "you" ? 1 : 0,
      stumble: this.downT > 0 ? 1 : this.stun > 0 ? Math.min(1, this.stun / 0.3) : 0,
      aim: this.reloadT > 0 ? this.aimBlend * 0.4 : this.aimBlend,
      recoil: this.fireCd / FIRE_GAP,
    });
    if (this.downT > 0) {
      // Topple over
      this.player.body.rotation.x = THREE.MathUtils.lerp(this.player.body.rotation.x, -1.45, 1 - Math.exp(-dt * 8));
      this.player.body.position.y = -0.55 * Math.min(1, -this.player.body.rotation.x / 1.45);
    } else this.player.body.rotation.x = 0;

    // ── Hosts: look at you, wave you over, talk with their hands ──
    for (const h of this.hosts) {
      const hp = h.c.root.position;
      const d = Math.hypot(p.x - hp.x, p.z - hp.z);
      if (d > 30) continue;
      const isTalking = this.talkWith === h.pl.spot.id;
      const look = isTalking || d < 9 ? Math.atan2(p.x - hp.x, p.z - hp.z) : h.pl.hostYaw;
      let dd = look - h.yaw;
      dd = Math.atan2(Math.sin(dd), Math.cos(dd));
      h.yaw += dd * (1 - Math.exp(-dt * 4));
      h.c.root.rotation.y = h.yaw;
      const wantWave = !isTalking && d > 3 && d < 9 && !this.collected.has(h.pl.spot.id) ? 1 : 0;
      h.wave = THREE.MathUtils.lerp(h.wave, wantWave, 1 - Math.exp(-dt * 5));
      h.talk = THREE.MathUtils.lerp(h.talk, isTalking && this.speaking === "host" ? 1 : 0, 1 - Math.exp(-dt * 6));
      animateCharacter(h.c, { phase: 0, stride: 0, t: t + hp.z, wave: h.wave, talk: h.talk });
    }

    // Medals spin and bob
    for (const pl of this.town.placed) {
      if (pl.medal.visible) {
        pl.medal.rotation.y = t * 1.6 + pl.door.z;
        pl.medal.position.y = 2.75 + Math.sin(t * 2 + pl.door.z) * 0.12;
      }
    }
    this.town.update(dt, t);
    if (this.town.core.gate.visible) {
      (this.town.core.gate.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.1 + Math.sin(t * 3) * 0.4;
    }
    this.sky.clouds.position.x = Math.sin(t * 0.01) * 40;

    // ── Near a door? ──
    let near: string | null = null;
    if (!talking && !this.combat.fighting && !this.driving) {
      let best = NEAR;
      for (const pl of this.town.placed) {
        const d = Math.hypot(p.x - pl.door.x, p.z - pl.door.z);
        if (d < best) {
          best = d;
          near = pl.spot.id;
        }
      }
      if (Math.hypot(p.x - this.town.core.door.x, p.z - this.town.core.door.z) < NEAR + 0.8) near = core.id;
    }
    if (near !== this.near) {
      this.near = near;
      this.cb.onNear(near);
    }
    const veh = this.driving ? "driving" : !talking && !near && this.vehicles.nearestFree(p) ? "near" : "none";
    if (veh !== this.vehState) {
      this.vehState = veh;
      this.cb.onVehicle(veh);
    }
    // Mission markers
    for (const mk of this.markers) {
      mk.m.visible = !this.collected.has(mk.id) && this.talkWith !== mk.id;
      ((mk.m.children[0] as THREE.Mesh).material as THREE.ShaderMaterial).uniforms.t.value = t;
      mk.m.children[1].scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    }

    // ── Companion orb ──
    const coreTalk = this.talkWith === core.id;
    let orbWant: THREE.Vector3;
    if (coreTalk) {
      orbWant = this.tmp.copy(this.town.core.door).add(this.tmp2.set(0, 2.1 + Math.sin(t * 2) * 0.1, -1.8));
    } else if (talking) {
      // Out of the two-shot: hover above and behind the player, away from the camera
      const away = this.tmp2.set(p.x - this.camera.position.x, 0, p.z - this.camera.position.z).normalize().multiplyScalar(1.4);
      orbWant = this.tmp.copy(p).add(away).setY(2.9);
    } else {
      const side = this.tmp2.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).multiplyScalar(-0.85);
      orbWant = this.tmp.copy(p).add(side).setY(p.y + 2.25 * this.player.root.scale.y + Math.sin(t * 2.2) * 0.1);
    }
    this.orb.position.lerp(orbWant, 1 - Math.exp(-dt * 4));
    this.orb.children[1].rotation.z = t * 1.5;
    const pulse = coreTalk && this.speaking === "ai" ? 1 + Math.sin(t * 12) * 0.12 : 1;
    this.orb.scale.setScalar((coreTalk ? 1.5 : talking ? 0.55 : 1) * pulse);

    // ── Camera ──
    if (coreTalk) {
      // Wide shot: you, the AI and the Core behind it
      const d = this.town.core.door;
      this.camPos.set(d.x + 2.2, 2.6, d.z + 6.2);
      this.camera.position.lerp(this.camPos, 1 - Math.exp(-dt * 3));
      this.camTarget.lerp(this.tmp.set(d.x, 2.2, d.z - 1.8), 1 - Math.exp(-dt * 4));
    } else if (talking) {
      const f = this.talkFocus();
      const mid = this.tmp.copy(p).add(f).multiplyScalar(0.5);
      const dir = this.tmp2.set(f.x - p.x, 0, f.z - p.z).normalize();
      // Side-on two-shot, from the south and slightly toward the street
      let perp = new THREE.Vector3(-dir.z, 0, dir.x);
      if (perp.z < 0) perp = perp.negate();
      this.camPos.copy(mid).addScaledVector(perp, 3.6).add(new THREE.Vector3(-Math.sign(mid.x || 1) * 0.9, 1.85, 0.6));
      this.camera.position.lerp(this.camPos, 1 - Math.exp(-dt * 3));
      this.camTarget.lerp(mid.setY(coreTalk ? 1.9 : 1.45), 1 - Math.exp(-dt * 4));
    } else {
      const bf = this.combat.bossFight;
      this.mouseIdle += dt;
      const car = this.driving;
      if (car && this.mouseIdle > 1.2 && Math.abs(car.speed) > 2) {
        // Chase cam swings back behind the car
        let d = car.yaw + Math.PI - this.camYaw;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        this.camYaw += d * (1 - Math.exp(-dt * 2.5));
      }
      const z = this.zoom * (bf ? 1.3 : car ? 1.15 : 1);
      const sx = Math.sin(this.camYaw);
      const cz = Math.cos(this.camYaw);
      const shoulder = !car && this.aiming && document.pointerLockElement === this.canvas;
      if (shoulder) {
        // Over the right shoulder, looking down the gun
        const rx = cz;
        const rz = -sx;
        this.camPos.set(p.x + sx * 3.6 + rx * 0.95, 2.3 + this.camPitch * 1.5, p.z + cz * 3.6 + rz * 0.95);
        this.camera.position.lerp(this.camPos, 1 - Math.exp(-dt * 12));
        this.camTarget.lerp(this.tmp.set(p.x - sx * 12 + rx * 0.95, 1.4 - this.camPitch * 3, p.z - cz * 12 + rz * 0.95), 1 - Math.exp(-dt * 14));
      } else {
        const dist = (bf ? 6.6 : 8.4) * z;
        const h = ((bf ? 8.6 : car ? 3.6 : 5.4) * z + 1.3) * (1 + this.camPitch);
        this.camPos.set(p.x + sx * dist, h, p.z + cz * dist);
        this.camera.position.lerp(this.camPos, 1 - Math.exp(-dt * (car ? 8 : 5)));
        this.camTarget.lerp(this.tmp.set(p.x - sx * 3.2, car ? 1.1 : 1.3, p.z - cz * 3.2), 1 - Math.exp(-dt * (car ? 10 : 6)));
      }
    }
    if (this.shakeAmt > 0.001 && !this.reduced) {
      const a = this.shakeAmt;
      this.camera.position.add(this.tmp.set((Math.random() - 0.5) * a, (Math.random() - 0.5) * a, (Math.random() - 0.5) * a));
    }
    this.shakeAmt *= Math.exp(-dt * 9);
    this.camera.lookAt(this.camTarget);

    // Lights and sky bodies track the player so shadows stay crisp
    this.sunLight.position.copy(p).addScaledVector(this.sunDir, 100);
    this.sunLight.target.position.copy(p);
    this.moonLight.position.copy(p).addScaledVector(this.moonDir, 100);
    this.moonLight.target.position.copy(p);
    this.sky.dome.position.copy(this.camera.position);
    this.sky.stars.position.copy(this.camera.position);
    this.sky.sun.position.copy(this.camera.position).addScaledVector(this.sunDir, 360);
    this.sky.moon.position.copy(this.camera.position).addScaledVector(this.moonDir, 360);

    this.effects = this.effects.filter((fx) => fx(dt));

    // Speech bubble anchored to the orb
    if (this.bubble) {
      const v = this.tmp.copy(this.orb.position).setY(this.orb.position.y + 0.4).project(this.camera);
      const x = (v.x * 0.5 + 0.5) * this.canvas.clientWidth;
      const y = (-v.y * 0.5 + 0.5) * this.canvas.clientHeight;
      this.bubble.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }

    this.cb.onTick(p.x, p.z, this.yaw, this.camYaw, this.driving ? Math.abs(this.driving.speed) * 3.6 : 0);
  }

  /** Who the player is talking to (host position, or the AI orb at the Core). */
  private talkFocus() {
    if (this.talkWith === core.id) return this.town.core.door.clone().add(new THREE.Vector3(0, 0, -1.8));
    const h = this.hosts.find((x) => x.pl.spot.id === this.talkWith);
    return h ? h.c.root.position : this.player.root.position;
  }

  private blockedStatic(x: number, z: number, r: number) {
    for (const b of this.town.colliders) {
      if (x > b.minX - r && x < b.maxX + r && z > b.minZ - r && z < b.maxZ + r) return true;
    }
    return Math.hypot(x - CORE_POS.x, z - CORE_POS.z) < CORE_R + r;
  }

  private blocked(x: number, z: number) {
    if (this.vehicles?.hitsCar(x, z, PLAYER_R)) return true;
    for (const b of this.town.colliders) {
      if (x > b.minX - PLAYER_R && x < b.maxX + PLAYER_R && z > b.minZ - PLAYER_R && z < b.maxZ + PLAYER_R) return true;
    }
    for (const h of this.hosts) {
      const hp = h.c.root.position;
      if (Math.hypot(x - hp.x, z - hp.z) < PLAYER_R + 0.3) return true;
    }
    return Math.hypot(x - CORE_POS.x, z - CORE_POS.z) < CORE_R + PLAYER_R;
  }
}
