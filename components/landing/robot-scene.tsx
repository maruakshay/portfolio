"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// A boxy white-ceramic robot, built entirely in code, fixed behind the page.
// Scroll drives the camera through three states (intro → services → content);
// the pointer adds a little parallax and head-tracking on top.

type Pose = { x: number; z: number; y: number; ly: number; by: number; hy: number; hp: number; hr: number };

// x shifts the frame so the robot sits a little right of centre in the intro.
const INTRO: Pose = { x: -0.25, z: 11.6, y: 1.1, ly: 0.55, by: -0.42, hy: -0.6, hp: 0.16, hr: 0.22 };
const CLOSE: Pose = { x: 0, z: 6.9, y: 1.95, ly: 1.72, by: -0.2, hy: -0.06, hp: 0.04, hr: 0 };

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function roundedRectPath(w: number, h: number, r: number) {
  const s = roundedRectShape(w, h, r);
  const p = new THREE.Path();
  p.curves = s.curves;
  return p;
}

/** Map a geometry's UVs to its own x/y bounds so a texture spans it once. */
function remapUVs(geo: THREE.BufferGeometry) {
  geo.computeBoundingBox();
  const b = geo.boundingBox!;
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const w = b.max.x - b.min.x || 1;
  const h = b.max.y - b.min.y || 1;
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - b.min.x) / w;
    uv[i * 2 + 1] = (pos.getY(i) - b.min.y) / h;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

function frame(outer: [number, number, number], inner: [number, number, number], depth: number, bevel: number) {
  const shape = roundedRectShape(...outer);
  shape.holes.push(roundedRectPath(...inner));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 14,
  });
  remapUVs(geo);
  return geo;
}

function ringTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  const stops = ["#ff3d8b", "#ff5a5f", "#ff8a3d", "#ffb347", "#ff8a3d", "#ff5a5f", "#ff3d8b"];
  const g =
    "createConicGradient" in ctx
      ? ctx.createConicGradient(-Math.PI / 2, 256, 256)
      : (ctx as CanvasRenderingContext2D).createLinearGradient(0, 0, 512, 512);
  stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1), col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Deterministic PRNG so the "circuit" bars land in the same place every load. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function RobotScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      canvas.style.display = "none"; // No WebGL: the page still reads fine without the robot.
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment(renderer);
    const envTex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    // ── Lights ──────────────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight(0xfff6ee, 0xd9d2c8, 0.7));

    const key = new THREE.DirectionalLight(0xfff3e6, 1.7);
    key.position.set(-3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.bias = -0.0005;
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 4, bottom: -4, near: 0.5, far: 20 });
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xfff0e6, 1.2);
    rim.position.set(4, 2, -4);
    scene.add(rim);

    const fill = new THREE.PointLight(0xff9a6a, 2.2, 6);
    fill.position.set(-3.2, 1.2, 0.6);
    scene.add(fill);

    // ── Materials ───────────────────────────────────────────────────────
    const ENV = 0.9;
    const shell = new THREE.MeshPhysicalMaterial({
      color: 0xeeebe6, roughness: 0.38, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: ENV,
    });
    const shellLight = new THREE.MeshPhysicalMaterial({
      color: 0xf8f6f2, roughness: 0.34, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: ENV,
    });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 0.55, metalness: 0.3, envMapIntensity: ENV });
    const deep = new THREE.MeshStandardMaterial({ color: 0x0f0f12, roughness: 0.5, metalness: 0.2, envMapIntensity: ENV });
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x2a2928, roughness: 0.9, envMapIntensity: ENV });
    const ringTex = ringTexture();
    const ring = new THREE.MeshPhysicalMaterial({
      map: ringTex, emissive: 0xffffff, emissiveMap: ringTex, emissiveIntensity: 0.22,
      roughness: 0.5, clearcoat: 0.35, envMapIntensity: ENV,
    });

    // Face screen: a 512px canvas drawn every time the face changes.
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = faceCanvas.height = 512;
    const fctx = faceCanvas.getContext("2d")!;
    const faceTex = new THREE.CanvasTexture(faceCanvas);
    faceTex.colorSpace = THREE.SRGBColorSpace;
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x060607, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06,
      emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 1.6, envMapIntensity: ENV,
    });

    const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };
    const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 4, r);
    const ball = (r: number) => new THREE.SphereGeometry(r, 28, 20);

    // ── Robot ───────────────────────────────────────────────────────────
    const robot = new THREE.Group();
    scene.add(robot);

    // Head: pivots at y .78, head centre a further .78 above the pivot.
    const headPivot = new THREE.Group();
    headPivot.position.y = 0.78;
    robot.add(headPivot);
    const head = new THREE.Group();
    head.position.y = 0.78;
    headPivot.add(head);

    head.add(mesh(rbox(1.5, 1.42, 1.3, 0.2), shell));
    head.add(mesh(rbox(1.28, 1.14, 0.9, 0.12), dark, 0, 0, -0.5));

    const rand = rng(7);
    const barGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 26; i++) {
      const bar = mesh(barGeo, deep);
      const long = 0.06 + rand() * 0.22;
      const horizontal = rand() > 0.5;
      if (i < 16) {
        // back face
        bar.scale.set(horizontal ? long : 0.03, horizontal ? 0.03 : long, 0.02);
        bar.position.set((rand() - 0.5) * 1.0, (rand() - 0.5) * 0.9, -0.96);
      } else {
        // top, behind the skull
        bar.scale.set(horizontal ? long : 0.03, 0.02, horizontal ? 0.03 : Math.min(long, 0.2));
        bar.position.set((rand() - 0.5) * 1.0, 0.58, -0.76 - rand() * 0.14);
      }
      head.add(bar);
    }

    const ringMesh = mesh(frame([1.5, 1.44, 0.3], [1.08, 1.02, 0.2], 0.1, 0.03), ring, 0, 0, 0.6);
    head.add(ringMesh);
    head.add(mesh(frame([1.1, 1.04, 0.21], [0.94, 0.88, 0.16], 0.05, 0.01), shellLight, 0, 0, 0.62));

    const screenGeo = new THREE.ShapeGeometry(roundedRectShape(0.9, 0.84, 0.14), 16);
    remapUVs(screenGeo);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.66;
    head.add(screen);

    for (const side of [-1, 1]) {
      const ear = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 32), shell, side * 0.79, 0, 0);
      ear.rotation.z = Math.PI / 2;
      head.add(ear);
      const cap = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.07, 32), dark, side * 0.88, 0, 0);
      cap.rotation.z = Math.PI / 2;
      head.add(cap);
    }
    // A cable loops down from the right ear to the back of the head.
    const cable = mesh(new THREE.TorusGeometry(0.32, 0.035, 10, 32, Math.PI), dark, 0.9, 0, -0.32);
    cable.rotation.set(0, Math.PI / 2, Math.PI);
    head.add(cable);

    // Neck + torso
    robot.add(mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.26, 24), dark, 0, 0.8, 0));
    robot.add(mesh(rbox(1.22, 1.12, 0.92, 0.24), shell, 0, 0.18, 0));
    robot.add(mesh(rbox(1.04, 0.14, 0.78, 0.06), shellLight, 0, 0.72, 0));

    const ledGeo = ball(0.045);
    [0xff8a3d, 0xff5a5f, 0xff3d8b].forEach((c, i) => {
      const led = new THREE.Mesh(
        ledGeo,
        new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2.2, roughness: 0.3 }),
      );
      led.position.set(-0.16 + i * 0.16, 0.46, 0.465);
      robot.add(led);
    });
    for (const side of [-1, 1]) {
      robot.add(mesh(new THREE.BoxGeometry(0.08, 0.34, 0.04), dark, side * 0.3, 0.02, 0.455));
      const lip = mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 18, Math.PI), dark, side * 0.3, 0.21, 0.462);
      robot.add(lip);
    }
    robot.add(mesh(rbox(0.82, 0.24, 0.62, 0.08), dark, 0, -0.5, 0));

    // Arms
    const arms: { shoulder: THREE.Group; fore: THREE.Group; side: number }[] = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.74, 0.55, 0);
      shoulder.rotation.z = side * 0.16;
      robot.add(shoulder);
      shoulder.add(mesh(ball(0.17), dark));
      shoulder.add(mesh(rbox(0.3, 0.5, 0.32, 0.1), shell, 0, -0.34, 0));
      shoulder.add(mesh(ball(0.12), dark, 0, -0.64, 0));
      const fore = new THREE.Group();
      fore.position.y = -0.64;
      fore.rotation.x = -0.35;
      shoulder.add(fore);
      fore.add(mesh(rbox(0.3, 0.42, 0.32, 0.1), shellLight, 0, -0.3, 0));
      fore.add(mesh(rbox(0.09, 0.18, 0.1, 0.035), shellLight, -side * 0.17, -0.24, 0.08));
      arms.push({ shoulder, fore, side });
    }

    // Legs
    for (const side of [-1, 1]) {
      const x = side * 0.3;
      robot.add(mesh(ball(0.14), dark, x, -0.6, 0));
      robot.add(mesh(rbox(0.36, 0.5, 0.4, 0.08), shell, x, -0.88, 0));
      robot.add(mesh(ball(0.1), dark, x, -1.17, 0));
      robot.add(mesh(rbox(0.42, 0.2, 0.56, 0.07), shellLight, x, -1.32, 0.06));
    }

    // Pedestal: top face at y -1.42, where the feet stand.
    const pedestal = mesh(new THREE.BoxGeometry(1.7, 1.6, 1.7), pedestalMat, 0, -2.22, 0);
    pedestal.castShadow = false;
    scene.add(pedestal);

    // ── Face ────────────────────────────────────────────────────────────
    type Mode = "eyes" | "play";
    let mode: Mode = "eyes";
    let faceAlpha = 1;
    let blink = 1; // vertical eye scale
    let nextBlink = 2.5 + Math.random() * 3;
    let blinkStart = -1;
    let faceDirty = true;

    function drawFace() {
      fctx.globalAlpha = 1;
      fctx.shadowBlur = 0;
      fctx.fillStyle = "#000";
      fctx.fillRect(0, 0, 512, 512);
      fctx.globalAlpha = faceAlpha;
      fctx.fillStyle = "#fff";
      fctx.shadowColor = "#fff";
      fctx.shadowBlur = 18;
      if (mode === "eyes") {
        for (const [x, y] of [
          [196, 262],
          [316, 252],
        ]) {
          fctx.beginPath();
          fctx.ellipse(x, y, 30, Math.max(38 * blink, 2), 0, 0, Math.PI * 2);
          fctx.fill();
        }
      } else {
        // A rounded play mark: this robot now talks about content.
        fctx.lineJoin = "round";
        fctx.lineWidth = 36;
        fctx.strokeStyle = "#fff";
        fctx.beginPath();
        fctx.moveTo(214, 176);
        fctx.lineTo(214, 336);
        fctx.lineTo(344, 256);
        fctx.closePath();
        fctx.fill();
        fctx.stroke();
      }
      faceTex.needsUpdate = true;
    }

    // ── Input + layout ──────────────────────────────────────────────────
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let narrow = false;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      narrow = w < 900;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let ps = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 2);
    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight;
      // Once the solid sections fully cover the stage, stop drawing.
      if (window.scrollY > vh * 3 || document.hidden) return;

      const t = clock.getElapsedTime();
      const p = Math.min(Math.max(window.scrollY / vh, 0), 2);
      ps += (p - ps) * 0.08;
      pointer.sx += (pointer.x - pointer.sx) * 0.06;
      pointer.sy += (pointer.y - pointer.sy) * 0.06;

      const k = easeInOutCubic(Math.min(ps, 1)); // states 2 and 3 share a pose
      const pose = {} as Pose;
      (Object.keys(INTRO) as (keyof Pose)[]).forEach((key) => (pose[key] = lerp(INTRO[key], CLOSE[key], k)));

      const mx = reduced ? 0 : pointer.sx;
      const my = reduced ? 0 : pointer.sy;
      const fx = narrow ? 0 : pose.x;
      camera.position.set(fx + mx * 0.25, pose.y - my * 0.1, pose.z * (narrow ? 1.25 : 1));
      camera.lookAt(fx, pose.ly, 0);

      const idle = reduced ? 0 : 1;
      robot.position.y = Math.sin(1.4 * t) * 0.02 * idle;
      robot.rotation.y = pose.by + mx * 0.12;
      headPivot.rotation.set(
        pose.hp + my * 0.18 + Math.sin(0.9 * t) * 0.02 * idle,
        pose.hy + mx * 0.45,
        pose.hr + Math.sin(0.7 * t) * 0.02 * idle,
        "YXZ",
      );
      for (const a of arms) {
        const swing = Math.sin(1.4 * t + a.side) * idle;
        a.shoulder.rotation.x = swing * 0.05;
        a.fore.rotation.x = -0.35 + swing * 0.06;
      }

      // Face mode follows scroll; the new face fades in.
      const want: Mode = ps > 1.55 ? "play" : "eyes";
      if (want !== mode) {
        mode = want;
        faceAlpha = 0;
      }
      if (faceAlpha < 1) {
        faceAlpha = Math.min(1, faceAlpha + 0.05);
        faceDirty = true;
      }

      // Blink: squash to 10% and back over .18s, every 2.5–5.5s.
      if (blinkStart < 0 && t > nextBlink) blinkStart = t;
      if (blinkStart >= 0) {
        const u = (t - blinkStart) / 0.18;
        if (u >= 1) {
          blink = 1;
          blinkStart = -1;
          nextBlink = t + 2.5 + Math.random() * 3;
        } else {
          blink = 1 - 0.9 * Math.sin(Math.PI * u);
        }
        faceDirty = true;
      }
      if (faceDirty) {
        drawFace();
        faceDirty = false;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      ringTex.dispose();
      faceTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      room.dispose?.();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="ln-stage" aria-hidden />;
}
