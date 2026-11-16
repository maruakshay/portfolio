import type * as THREE from "three";

/**
 * Distance along a 3D ray (origin `o`, unit direction `d`) to the first point
 * inside an upright cylinder at (cx, cz) with radius r spanning y0..y1.
 * Returns -1 on a miss. An origin already inside counts as a hit at 0.
 */
export function rayCylinder(o: THREE.Vector3, d: THREE.Vector3, cx: number, cz: number, r: number, y0: number, y1: number, max: number) {
  const ox = o.x - cx;
  const oz = o.z - cz;
  const a = d.x * d.x + d.z * d.z;
  const c = ox * ox + oz * oz - r * r;
  let tIn: number;
  let tOut: number;
  if (a < 1e-8) {
    // Shooting straight up or down
    if (c > 0) return -1;
    tIn = 0;
    tOut = max;
  } else {
    const b = 2 * (ox * d.x + oz * d.z);
    const disc = b * b - 4 * a * c;
    if (disc < 0) return -1;
    const s = Math.sqrt(disc);
    tIn = (-b - s) / (2 * a);
    tOut = (-b + s) / (2 * a);
  }
  if (tOut < 0) return -1;
  tIn = Math.max(0, tIn);
  tOut = Math.min(tOut, max);
  if (tIn > tOut) return -1;
  // Clip to the cylinder's height
  if (Math.abs(d.y) < 1e-8) return o.y >= y0 && o.y <= y1 ? tIn : -1;
  let s0 = (y0 - o.y) / d.y;
  let s1 = (y1 - o.y) / d.y;
  if (s0 > s1) [s0, s1] = [s1, s0];
  const lo = Math.max(tIn, s0);
  const hi = Math.min(tOut, s1);
  return lo <= hi ? lo : -1;
}
