'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {InstrumentFallback} from '@/components/process-instrument/InstrumentFallback';
import type {ProcessChapterId} from '@/lib/process-chapters';

export type InstrumentMode = 'land' | 'hover' | 'inspect' | 'twitch';

export type ProcessInstrumentGraphProps = {
  mode: InstrumentMode;
  activeChapter: ProcessChapterId | null;
  shipTwitch?: boolean;
  className?: string;
};

type NodeDef = {
  id: string;
  label?: string;
  position: [number, number, number];
  kind: 'loop' | 'context' | 'code' | 'dust';
  chapter?: ProcessChapterId;
  /** World-space point radius before perspective scale. */
  radius: number;
};

/** Loop path order for active wash (measured process ring). */
const LOOP_ORDER: ProcessChapterId[] = [
  'research',
  'brief',
  'stills',
  'challenge',
  'ship',
  'recap',
];

/**
 * Living Process Instrument mesh — SoT stills-39 / AG #39 @ 3e8de677 floor
 * + Paul LOCK 2026-09-14: VERY LARGE dense field, almost-translucent spokes,
 * staggered faint hazy data pulses, quiet particle universe behind nodes.
 * FAIL: thick glow tube · missing node field · label ghosts · spectacle beads.
 */
const HUB_NODES: NodeDef[] = [
  // Loop hubs — quiet hollow SoT rings (not filled glow beads).
  {id: 'research', label: 'Research', position: [-1.45, 0.85, 0.85], kind: 'loop', chapter: 'research', radius: 0.038},
  {id: 'brief', label: 'Brief', position: [0.2, 1.35, -0.55], kind: 'loop', chapter: 'brief', radius: 0.034},
  {id: 'stills', label: 'Stills', position: [1.65, 0.55, 0.95], kind: 'loop', chapter: 'stills', radius: 0.038},
  {id: 'challenge', label: 'Challenge', position: [1.35, -0.75, -0.7], kind: 'loop', chapter: 'challenge', radius: 0.034},
  {id: 'ship', label: 'Ship', position: [-0.15, -1.3, 0.75], kind: 'loop', chapter: 'ship', radius: 0.04},
  {id: 'recap', label: 'Recap', position: [-1.55, -0.35, -0.8], kind: 'loop', chapter: 'recap', radius: 0.034},
  // Context hubs
  {id: 'next', label: 'Next', position: [-2.4, 0.3, 1.15], kind: 'context', chapter: 'next', radius: 0.032},
  {id: 'design', label: 'Design', position: [2.35, 0.2, -1.2], kind: 'context', radius: 0.034},
  {id: 'product', label: 'Product', position: [0.75, 2.05, 1.05], kind: 'context', radius: 0.033},
  {id: 'lead', label: 'Lead', position: [-0.9, 2.1, -1.0], kind: 'context', radius: 0.033},
  {id: 'build', label: 'Build', position: [2.15, -1.4, 0.9], kind: 'context', radius: 0.034},
  // Measured codes
  {id: 'p01', label: 'P-01', position: [-2.7, 1.5, -1.35], kind: 'code', radius: 0.02},
  {id: 'p02', label: 'P-02', position: [-2.85, -1.2, 0.7], kind: 'code', radius: 0.02},
  {id: 'p03', label: 'P-03', position: [0.4, -2.2, -1.25], kind: 'code', radius: 0.019},
  {id: 'p04', label: 'P-04', position: [2.85, 1.55, 0.45], kind: 'code', radius: 0.02},
  {id: 'p05', label: 'P-05', position: [2.65, -0.4, 1.45], kind: 'code', radius: 0.019},
  {id: 'p06', label: 'P-06', position: [-0.5, 0.1, -2.05], kind: 'code', radius: 0.018},
  {id: 'p07', label: 'P-07', position: [1.0, -0.2, 1.95], kind: 'code', radius: 0.019},
  {id: 'p08', label: 'P-08', position: [-1.95, 1.8, 1.5], kind: 'code', radius: 0.018},
  {id: 'p09', label: 'P-09', position: [1.5, 1.85, -1.6], kind: 'code', radius: 0.018},
  {id: 'p10', label: 'P-10', position: [-2.05, -1.75, -1.05], kind: 'code', radius: 0.018},
];

/** Seeded dust lattice — expands the living mesh beyond hub counts. */
function buildDustField(count: number): NodeDef[] {
  const out: NodeDef[] = [];
  for (let i = 0; i < count; i += 1) {
    // Deterministic pseudo-scatter (no Math.random — stable across remounts).
    const s = ((i * 7919 + 104729) % 10007) / 10007;
    const t = ((i * 104729 + 7919) % 9973) / 9973;
    const u = ((i * 49999 + 3571) % 9967) / 9967;
    const x = (s - 0.5) * 7.2;
    const y = (t - 0.5) * 5.4;
    const z = (u - 0.5) * 5.8;
    out.push({
      id: `d${String(i).padStart(2, '0')}`,
      position: [x, y, z],
      kind: 'dust',
      radius: 0.007 + (i % 5) * 0.0012,
    });
  }
  return out;
}

const DUST_NODES = buildDustField(210);
const NODES: NodeDef[] = [...HUB_NODES, ...DUST_NODES];

const HUB_EDGES: Array<[string, string]> = [
  // Hub ↔ role/code spokes only — do NOT duplicate the process loop path.
  ['research', 'lead'],
  ['research', 'p01'],
  ['research', 'p08'],
  ['brief', 'product'],
  ['brief', 'design'],
  ['brief', 'p09'],
  ['stills', 'design'],
  ['stills', 'p04'],
  ['stills', 'p07'],
  ['challenge', 'build'],
  ['challenge', 'p05'],
  ['challenge', 'p03'],
  ['ship', 'build'],
  ['ship', 'p03'],
  ['ship', 'p10'],
  ['recap', 'next'],
  ['recap', 'p02'],
  ['recap', 'p06'],
  ['next', 'p01'],
  ['next', 'p08'],
  ['design', 'p07'],
  ['design', 'p05'],
  ['product', 'p06'],
  ['product', 'p04'],
  ['lead', 'p06'],
  ['lead', 'p09'],
  ['build', 'p07'],
  ['build', 'p10'],
  // Cross-hub lattice (almost translucent)
  ['lead', 'product'],
  ['product', 'design'],
  ['design', 'build'],
  ['build', 'next'],
  ['next', 'lead'],
];

/**
 * Nearest-neighbor spoke lattice across the full living mesh.
 * Returns hub edges + dense dust/code connections (universe-of-stars density).
 */
function buildSpokePairs(
  nodes: NodeDef[],
  maxPerDust: number,
): Array<[string, string]> {
  const pairs: Array<[string, string]> = [...HUB_EDGES];
  const seen = new Set(pairs.map(([a, b]) => (a < b ? `${a}|${b}` : `${b}|${a}`)));
  const add = (a: string, b: string) => {
    if (a === b) return;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push([a, b]);
  };

  const hubs = nodes.filter((n) => n.kind !== 'dust');
  const dust = nodes.filter((n) => n.kind === 'dust');

  for (const d of dust) {
    const ranked = hubs
      .map((h) => {
        const dx = d.position[0] - h.position[0];
        const dy = d.position[1] - h.position[1];
        const dz = d.position[2] - h.position[2];
        return {id: h.id, dist: dx * dx + dy * dy + dz * dz};
      })
      .sort((a, b) => a.dist - b.dist);
    for (let i = 0; i < Math.min(2, ranked.length); i += 1) {
      add(d.id, ranked[i].id);
    }
  }

  for (let i = 0; i < dust.length; i += 1) {
    const a = dust[i];
    const ranked = dust
      .map((b, j) => {
        if (j === i) return null;
        const dx = a.position[0] - b.position[0];
        const dy = a.position[1] - b.position[1];
        const dz = a.position[2] - b.position[2];
        return {id: b.id, dist: dx * dx + dy * dy + dz * dz};
      })
      .filter((x): x is {id: string; dist: number} => x !== null)
      .sort((x, y) => x.dist - y.dist);
    for (let k = 0; k < Math.min(maxPerDust, ranked.length); k += 1) {
      if (ranked[k].dist < 4.5) add(a.id, ranked[k].id);
    }
  }

  return pairs;
}

const CONTEXT_EDGES = buildSpokePairs(NODES, 6);

const SAGE_DIM = 0x4a554e;
const WASH = 0xffffff;
const VOID = 0x030303;

type DepthNode = {
  mesh: THREE.Object3D;
  baseRadius: number;
  kind: NodeDef['kind'];
  id: string;
  mat: THREE.MeshBasicMaterial;
};

export function ProcessInstrumentGraph({
  mode,
  activeChapter,
  shipTwitch = false,
  className,
}: ProcessInstrumentGraphProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    mode,
    activeChapter,
    shipTwitch,
  });
  const [paintState, setPaintState] = useState<'pending' | 'live' | 'fallback'>(
    'pending',
  );
  const [mountKey, setMountKey] = useState(0);
  const retryCountRef = useRef(0);

  stateRef.current = {mode, activeChapter, shipTwitch};

  const retryPaint = useCallback(() => {
    setPaintState('pending');
    setMountKey((k) => k + 1);
  }, []);

  // Paul LOCK: 3D must persist — auto-remount until live; never settle on empty/flat hero.
  useEffect(() => {
    if (paintState !== 'fallback') return;
    const attempt = retryCountRef.current;
    const delay =
      attempt < 10 ? Math.min(350 + attempt * 450, 2800) : 4000;
    const id = window.setTimeout(() => {
      retryCountRef.current = attempt + 1;
      retryPaint();
    }, delay);
    return () => window.clearTimeout(id);
  }, [paintState, mountKey, retryPaint]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /** False after unmount or fatal paint error — stops rAF before disposed render. */
    let alive = true;
    let raf = 0;
    let resizeObserver: ResizeObserver | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let labelLayer: HTMLDivElement | null = null;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      textures.push(t);
      return t;
    };

    const tearDownGl = (forceLoss: boolean) => {
      cancelAnimationFrame(raf);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
      }
      if (renderer) {
        // Avoid forceContextLoss on soft remounts — Chrome mobile GPU "Aw Snap" / error 9.
        if (forceLoss) {
          try {
            renderer.forceContextLoss();
          } catch {
            // already lost
          }
        }
        try {
          renderer.dispose();
        } catch {
          // ignore
        }
        if (canvas && canvas.parentNode === host) {
          host.removeChild(canvas);
        }
        renderer = null;
        canvas = null;
      }
      // Purge EVERY label layer — remount ghosts from stacked HTML overlays.
      host
        .querySelectorAll('[data-instrument-labels]')
        .forEach((node) => node.parentNode?.removeChild(node));
      labelLayer = null;
      // Also strip orphan canvases left by a partial paint.
      host.querySelectorAll('canvas').forEach((node) => {
        if (node.parentNode === host) host.removeChild(node);
      });
      for (const t of textures) {
        try {
          t.dispose();
        } catch {
          // ignore
        }
      }
      textures.length = 0;
      for (const m of materials) {
        try {
          m.dispose();
        } catch {
          // ignore
        }
      }
      materials.length = 0;
      for (const g of geometries) {
        try {
          g.dispose();
        } catch {
          // ignore
        }
      }
      geometries.length = 0;
    };

    const failSoft = (err?: unknown) => {
      if (process.env.NODE_ENV !== 'production' && err) {
        console.warn('[ProcessInstrument] WebGL paint failed', err);
      }
      alive = false;
      window.removeEventListener('resize', onResize);
      try {
        // Next remount uses lite GPU profile — Cos-box @390 Aw Snap / error 9.
        window.sessionStorage.setItem('ag-instrument-lite', '1');
      } catch {
        // ignore
      }
      // Soft remount path — never forceContextLoss (Chrome mobile renderer stick).
      tearDownGl(false);
      // Transient empty only — auto-retry effect remounts true-3D.
      setPaintState('fallback');
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      failSoft(new Error('webglcontextlost'));
    };

    const onContextRestored = () => {
      // Prefer remount over resume — restored contexts are flaky on mobile Chrome.
      if (!alive) return;
      try {
        window.sessionStorage.setItem('ag-instrument-lite', '1');
      } catch {
        // ignore
      }
      failSoft(new Error('webglcontextrestored'));
    };

    let resizeCamera = (_w: number, _h: number) => {
      /* assigned after camera exists */
    };

    const onResize = () => {
      if (!alive || !renderer || !host) return;
      const rect = host.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width) || host.clientWidth || 1, 1);
      const h = Math.max(Math.floor(rect.height) || host.clientHeight || 1, 1);
      if (w < 2 || h < 2) return;
      resizeCamera(w, h);
      renderer.setSize(w, h, false);
    };

    /** Wait until the stage has real layout — 0×0 hosts soft-fail on mobile. */
    const waitForHostSize = (): Promise<{width: number; height: number}> =>
      new Promise((resolve) => {
        const read = () => {
          const rect = host.getBoundingClientRect();
          const width = Math.max(
            Math.floor(rect.width) || host.clientWidth || 0,
            0,
          );
          const height = Math.max(
            Math.floor(rect.height) || host.clientHeight || 0,
            0,
          );
          return {width, height};
        };
        const ready = read();
        if (ready.width >= 8 && ready.height >= 8) {
          resolve(ready);
          return;
        }
        let frames = 0;
        const ro = new ResizeObserver(() => {
          const next = read();
          if (next.width >= 8 && next.height >= 8) {
            ro.disconnect();
            resolve(next);
          }
        });
        ro.observe(host);
        if (host.parentElement) ro.observe(host.parentElement);
        const tick = () => {
          if (!alive) {
            ro.disconnect();
            return;
          }
          const next = read();
          if (next.width >= 8 && next.height >= 8) {
            ro.disconnect();
            resolve(next);
            return;
          }
          frames += 1;
          if (frames < 180) {
            requestAnimationFrame(tick);
            return;
          }
          ro.disconnect();
          resolve({
            width: Math.max(next.width, host.parentElement?.clientWidth || 360, 360),
            height: Math.max(next.height, 448),
          });
        };
        requestAnimationFrame(tick);
      });

    const paint = async () => {
      try {
        const sized = await waitForHostSize();
        if (!alive) return;

        const width = sized.width;
        const height = sized.height;
        const portrait =
          height >= width * 0.95 ||
          (typeof window !== 'undefined' && window.innerWidth <= 900);
        let preferLite = false;
        try {
          preferLite = window.sessionStorage.getItem('ag-instrument-lite') === '1';
        } catch {
          preferLite = false;
        }
        // Cos-box @390 blank/Aw Snap — lite GPU profile sticks 3D without error 9.
        const narrowMobile =
          typeof window !== 'undefined' && window.innerWidth <= 430;
        const useLite = Boolean(portrait && (preferLite || narrowMobile));
        const dprCap = useLite ? 1 : portrait ? 1.25 : 2;
        const rainCount = useLite ? 0 : portrait ? 8 : 22;
        // Dense universe — lite keeps readable Points, fewer heavy rings.
        const starCount = useLite ? 2400 : portrait ? 4200 : 7200;
        const fieldPointCount = useLite ? 560 : portrait ? 900 : 1400;

        // Scrub any leftover canvas/label DOM before paint (StrictMode / remount ghosts).
        host
          .querySelectorAll('[data-instrument-labels], canvas')
          .forEach((node) => node.parentNode?.removeChild(node));

        const scene = new THREE.Scene();
        // Soft fog keeps depth readable without swallowing the particle field.
        scene.fog = new THREE.FogExp2(VOID, useLite ? 0.014 : 0.01);

        const camera = new THREE.PerspectiveCamera(
          portrait ? 40 : 36,
          width / height,
          0.1,
          100,
        );
        const landCam = portrait
          ? new THREE.Vector3(1.35, 1.2, 6.85)
          : new THREE.Vector3(3.15, 2.45, 4.55);
        const hoverCam = portrait
          ? new THREE.Vector3(1.05, 0.95, 5.45)
          : new THREE.Vector3(2.2, 1.65, 3.85);
        const inspectCam = portrait
          ? new THREE.Vector3(0.8, 0.7, 4.35)
          : new THREE.Vector3(1.35, 1.05, 3.05);
        camera.position.copy(landCam);
        camera.lookAt(0.1, 0.05, 0);
        resizeCamera = (w, h) => {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        host.appendChild(canvas);
        canvas.addEventListener('webglcontextlost', onContextLost, false);
        canvas.addEventListener('webglcontextrestored', onContextRestored, false);

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !portrait,
          alpha: true,
          // default > low-power on mobile — low-power blanked Cos-box @390.
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
        renderer.setSize(width, height, false);
        renderer.setClearColor(VOID, 0);
        // Prevent motion trail smear that reads as ghost labels.
        renderer.autoClear = true;

        scene.add(new THREE.AmbientLight(0xb8c0ba, 0.3));

        const root = new THREE.Group();
        scene.add(root);

        // Quiet particle universe behind the mesh — atmosphere/depth only
        // (DESIGN_AGENCY_BAR: NOT beads / confetti / glow-as-craft).
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i += 1) {
          const s = ((i * 1103515245 + 12345) >>> 0) / 0xffffffff;
          const t = ((i * 214013 + 2531011) >>> 0) / 0xffffffff;
          const u = ((i * 1664525 + 1013904223) >>> 0) / 0xffffffff;
          starPositions[i * 3] = (s - 0.5) * 18;
          starPositions[i * 3 + 1] = (t - 0.5) * 14;
          starPositions[i * 3 + 2] = (u - 0.5) * 16 - 2.8;
        }
        const starGeo = trackGeo(new THREE.BufferGeometry());
        starGeo.setAttribute(
          'position',
          new THREE.BufferAttribute(starPositions, 3),
        );
        // Apple-clean atmosphere — quiet readable depth, not confetti.
        const starMat = trackMat(
          new THREE.PointsMaterial({
            color: 0xc8d2ca,
            size: portrait ? 0.024 : 0.03,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
            fog: true,
          }),
        );
        const stars = new THREE.Points(starGeo, starMat);
        stars.position.z = -0.85;
        root.add(stars);

        // Mid-field dust layer — fills the void between far stars and hubs.
        const fieldPositions = new Float32Array(fieldPointCount * 3);
        for (let i = 0; i < fieldPointCount; i += 1) {
          const s = ((i * 2654435761 + 97) >>> 0) / 0xffffffff;
          const t = ((i * 1597334677 + 13) >>> 0) / 0xffffffff;
          const u = ((i * 2246822519 + 41) >>> 0) / 0xffffffff;
          fieldPositions[i * 3] = (s - 0.5) * 9.2;
          fieldPositions[i * 3 + 1] = (t - 0.5) * 7.0;
          fieldPositions[i * 3 + 2] = (u - 0.5) * 7.4;
        }
        const fieldGeo = trackGeo(new THREE.BufferGeometry());
        fieldGeo.setAttribute(
          'position',
          new THREE.BufferAttribute(fieldPositions, 3),
        );
        const fieldMat = trackMat(
          new THREE.PointsMaterial({
            color: 0xa0aca2,
            size: portrait ? 0.017 : 0.02,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
          }),
        );
        root.add(new THREE.Points(fieldGeo, fieldMat));

        // Atmosphere rain codes (≤10% gray).
        const rain = new THREE.Group();
        const rainMat = trackMat(
          new THREE.MeshBasicMaterial({
            color: 0x6a736c,
            transparent: true,
            opacity: 0.07,
          }),
        );
        for (let i = 0; i < rainCount; i += 1) {
          const mesh = new THREE.Mesh(
            trackGeo(new THREE.PlaneGeometry(0.09, 0.016)),
            rainMat,
          );
          const seed = (i * 17) % 97;
          mesh.position.set(
            ((seed % 11) - 5) * 0.85,
            (((seed * 3) % 13) - 6) * 0.55,
            -1.2 - (seed % 9) * 0.45,
          );
          mesh.rotation.z = ((seed % 7) - 3) * 0.08;
          rain.add(mesh);
        }
        scene.add(rain);

        const nodeMap = new Map<string, THREE.Vector3>();
        const depthNodes: DepthNode[] = [];
        type HtmlLabel = {
          id: string;
          el: HTMLDivElement;
          local: THREE.Vector3;
          emphasis: boolean;
        };
        const htmlLabels: HtmlLabel[] = [];
        labelLayer = document.createElement('div');
        labelLayer.setAttribute('data-instrument-labels', 'html');
        labelLayer.style.cssText =
          'position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2;';
        host.appendChild(labelLayer);

        // Quiet hollow SoT rings — primary + subordinate (NOT filled beads / bare ribbon).
        // Shared low-segment rings — lighter on mobile GPU.
        const sharedRing = trackGeo(
          new THREE.RingGeometry(0.72, 1, portrait ? 24 : 32),
        );
        const subordinateRing = trackGeo(
          new THREE.RingGeometry(0.7, 1, portrait ? 16 : 24),
        );

        const seenLabels = new Set<string>();
        for (const node of NODES) {
          const pos = new THREE.Vector3(...node.position);
          nodeMap.set(node.id, pos);

          const isLoop = node.kind === 'loop';
          const isDust = node.kind === 'dust';
          const color =
            node.kind === 'loop'
              ? 0xe8eae4
              : node.kind === 'context'
                ? 0x9aa89e
                : node.kind === 'code'
                  ? 0x6e7a72
                  : 0x4a554e;
          const opacity =
            node.kind === 'loop'
              ? 0.94
              : node.kind === 'context'
                ? 0.55
                : node.kind === 'code'
                  ? 0.42
                  : 0.28;
          const radius =
            node.kind === 'loop'
              ? node.radius
              : node.kind === 'context'
                ? node.radius * 0.85
                : node.kind === 'code'
                  ? node.radius * 0.75
                  : node.radius * 0.9;

          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity,
              depthWrite: !isDust,
              side: THREE.DoubleSide,
            }),
          );
          const ring = new THREE.Mesh(
            isLoop ? sharedRing : subordinateRing,
            mat,
          );
          ring.scale.setScalar(radius);
          ring.position.copy(pos);
          root.add(ring);
          depthNodes.push({
            mesh: ring,
            baseRadius: radius,
            kind: node.kind,
            id: node.id,
            mat,
          });

          if (node.label && labelLayer && !seenLabels.has(node.id)) {
            seenLabels.add(node.id);
            // Single HTML label per hub — left/top only (no stacked transforms = no ghosts).
            const el = document.createElement('div');
            el.setAttribute('data-instrument-label-id', node.id);
            el.textContent = node.label;
            const emphasis = isLoop;
            el.style.cssText = [
              'position:absolute',
              'left:0',
              'top:0',
              'transform:translate(-50%,-120%)',
              'white-space:nowrap',
              'pointer-events:none',
              'contain:layout style paint',
              'isolation:isolate',
              '-webkit-font-smoothing:antialiased',
              'text-rendering:geometricPrecision',
              `font:${
                emphasis
                  ? portrait
                    ? '500 11px'
                    : '500 12px'
                  : '400 10px'
              } Geist, ui-sans-serif, system-ui, sans-serif`,
              // Binary ink — no translucent text that trails as ghost doubles.
              `color:${emphasis ? 'rgba(242,241,236,1)' : 'rgba(138,154,142,0.55)'}`,
              'letter-spacing:0.01em',
              'text-shadow:none',
              'filter:none',
              'opacity:0',
              'visibility:hidden',
              'will-change:auto',
              'backface-visibility:hidden',
            ].join(';');
            labelLayer.appendChild(el);
            // Keep Stills fully inside safe area (never clip to "St").
            const nudge: Record<string, [number, number, number]> = {
              research: [-0.12, 0.14, 0.04],
              brief: [0.05, 0.16, 0],
              stills: portrait ? [-0.48, 0.18, 0.08] : [-0.1, 0.14, 0.02],
              challenge: portrait ? [-0.04, -0.02, 0] : [0.08, -0.02, 0],
              ship: [0, -0.14, 0.02],
              recap: [-0.14, 0.02, 0],
              next: [-0.1, 0.08, 0],
              design: portrait ? [-0.22, 0.06, 0] : [0.08, 0.06, 0],
              product: [0.05, 0.1, 0],
              lead: [-0.05, 0.1, 0],
              build: portrait ? [-0.12, -0.06, 0] : [0.08, -0.06, 0],
            };
            const [nx, ny, nz] = nudge[node.id] ?? [0, isLoop ? 0.12 : 0.08, 0];
            htmlLabels.push({
              id: node.id,
              el,
              local: pos.clone().add(new THREE.Vector3(nx, ny, nz)),
              emphasis,
            });
          }
        }

        // Extra dense subordinate hollow rings (SoT universe density — quiet, not beads).
        // Portrait/lite: fewer rings, denser Points carry the star field (GPU stick @390).
        const extraRingCount = useLite ? 60 : portrait ? 140 : 520;
        for (let i = 0; i < extraRingCount; i += 1) {
          const s = ((i * 2654435761 + 97) >>> 0) / 0xffffffff;
          const t = ((i * 1597334677 + 13) >>> 0) / 0xffffffff;
          const u = ((i * 2246822519 + 41) >>> 0) / 0xffffffff;
          const pos = new THREE.Vector3(
            (s - 0.5) * 7.6,
            (t - 0.5) * 5.8,
            (u - 0.5) * 6.0,
          );
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: 0x4a554e,
              transparent: true,
              opacity: 0.18 + (i % 5) * 0.02,
              depthWrite: false,
              side: THREE.DoubleSide,
            }),
          );
          const ring = new THREE.Mesh(subordinateRing, mat);
          const r = 0.012 + (i % 7) * 0.002;
          ring.scale.setScalar(r);
          ring.position.copy(pos);
          root.add(ring);
          depthNodes.push({
            mesh: ring,
            baseRadius: r,
            kind: 'dust',
            id: `x${i}`,
            mat,
          });
        }

        // Almost-translucent spoke cloud (hub↔hub + dense dust lattice).
        const spokeSegs: Array<{a: THREE.Vector3; b: THREE.Vector3}> = [];
        const spokePositions: number[] = [];
        for (const [a, b] of CONTEXT_EDGES) {
          const pa = nodeMap.get(a);
          const pb = nodeMap.get(b);
          if (!pa || !pb) continue;
          spokeSegs.push({a: pa, b: pb});
          spokePositions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
        }
        const spokeGeo = trackGeo(new THREE.BufferGeometry());
        spokeGeo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(spokePositions, 3),
        );
        const spokeMat = trackMat(
          new THREE.LineBasicMaterial({
            color: 0x5e6a62,
            transparent: true,
            opacity: 0.16,
          }),
        );
        root.add(new THREE.LineSegments(spokeGeo, spokeMat));

        /**
         * VERY FAINT + HAZY data pulses — staggered intervals across MANY spokes.
         * Motion-readable for Cos craft-gate (land stills alone insufficient).
         */
        type StrokePulse = {
          mesh: THREE.Mesh;
          mat: THREE.MeshBasicMaterial;
          phase: number;
          speed: number;
          kind: 'spoke' | 'loop';
          segIndex: number;
          haze: number;
        };
        const pulseGeo = trackGeo(
          new THREE.CylinderGeometry(1, 1, 1, 6, 1, true),
        );
        const strokePulses: StrokePulse[] = [];
        // Many riders at clearly different intervals — wait-frame readable.
        const pulseCount = Math.min(
          spokeSegs.length,
          useLite ? 28 : portrait ? 48 : 96,
        );
        for (let i = 0; i < pulseCount; i += 1) {
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: true,
              blending: THREE.AdditiveBlending,
            }),
          );
          const mesh = new THREE.Mesh(pulseGeo, mat);
          root.add(mesh);
          strokePulses.push({
            mesh,
            mat,
            phase: (i * 0.137 + (i % 13) * 0.053 + (i % 7) * 0.029) % 1,
            speed: 0.034 + (i % 17) * 0.008 + (i % 5) * 0.012 + (i % 3) * 0.005,
            kind: 'spoke',
            segIndex: i % spokeSegs.length,
            haze: 0.45 + (i % 7) * 0.07,
          });
        }
        for (let i = 0; i < Math.min(spokeSegs.length, useLite ? 12 : portrait ? 24 : 36); i += 1) {
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: true,
              blending: THREE.AdditiveBlending,
            }),
          );
          const mesh = new THREE.Mesh(pulseGeo, mat);
          root.add(mesh);
          strokePulses.push({
            mesh,
            mat,
            phase: (0.5 + i * 0.211 + (i % 5) * 0.07) % 1,
            speed: 0.062 + (i % 9) * 0.014 + (i % 4) * 0.009,
            kind: 'spoke',
            segIndex: (i * 3 + 1) % spokeSegs.length,
            haze: 0.38 + (i % 4) * 0.06,
          });
        }
        for (let i = 0; i < (useLite ? 6 : 10); i += 1) {
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: true,
              blending: THREE.AdditiveBlending,
            }),
          );
          const mesh = new THREE.Mesh(pulseGeo, mat);
          root.add(mesh);
          strokePulses.push({
            mesh,
            mat,
            phase: i / (useLite ? 6 : 10) + 0.02,
            speed: 0.048 + i * 0.012 + (i % 2) * 0.018,
            kind: 'loop',
            segIndex: i,
            haze: 0.7 + (i % 3) * 0.1,
          });
        }
        const pulseFrom = new THREE.Vector3();
        const pulseTo = new THREE.Vector3();
        const pulseMid = new THREE.Vector3();
        const pulseDir = new THREE.Vector3();
        const yAxis = new THREE.Vector3(0, 1, 0);

        // Process loop = razor-thin polygonal LineSegments (SoT wire — kill fat tube).
        const loopPts: THREE.Vector3[] = [];
        const loopLinePos: number[] = [];
        for (const id of LOOP_ORDER) {
          const p = nodeMap.get(id);
          if (p) loopPts.push(p.clone());
        }
        for (let i = 0; i < loopPts.length; i += 1) {
          const a = loopPts[i];
          const b = loopPts[(i + 1) % loopPts.length];
          loopLinePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        const closedLoop = new THREE.CatmullRomCurve3(
          loopPts,
          true,
          'catmullrom',
          0.05,
        );
        const loopLineGeo = trackGeo(new THREE.BufferGeometry());
        loopLineGeo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(loopLinePos, 3),
        );
        // Almost-translucent hub-to-hub — never opaque bright bands.
        const strokeMat = trackMat(
          new THREE.LineBasicMaterial({
            color: 0x7a867e,
            transparent: true,
            opacity: 0.14,
          }),
        );
        root.add(new THREE.LineSegments(loopLineGeo, strokeMat));

        // Neighbor accents: thin line luminance only (no fat tube segments).
        const neighborMats: THREE.LineBasicMaterial[] = [];
        for (let i = 0; i < LOOP_ORDER.length; i += 1) {
          const a = nodeMap.get(LOOP_ORDER[i]);
          const b = nodeMap.get(LOOP_ORDER[(i + 1) % LOOP_ORDER.length]);
          if (!a || !b) continue;
          const geo = trackGeo(new THREE.BufferGeometry());
          geo.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
              [a.x, a.y, a.z, b.x, b.y, b.z],
              3,
            ),
          );
          const mat = trackMat(
            new THREE.LineBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
            }),
          );
          root.add(new THREE.LineSegments(geo, mat));
          neighborMats.push(mat);
        }

        const clock = new THREE.Clock();
        const camTarget = landCam.clone();
        const worldPos = new THREE.Vector3();
        const refDist = portrait ? 6.9 : 5.2;
        let frameN = 0;
        window.addEventListener('resize', onResize);
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => onResize());
          resizeObserver.observe(host);
        }

        const placePulse = (
          pulse: StrokePulse,
          from: THREE.Vector3,
          to: THREE.Vector3,
          u: number,
          radius: number,
          peakOpacity: number,
          half = 0.14,
        ) => {
          const u0 = Math.max(0, u - half);
          const u1 = Math.min(1, u + half);
          pulseFrom.lerpVectors(from, to, u0);
          pulseTo.lerpVectors(from, to, u1);
          pulseMid.lerpVectors(pulseFrom, pulseTo, 0.5);
          pulseDir.subVectors(pulseTo, pulseFrom);
          const len = Math.max(pulseDir.length(), 0.001);
          pulseDir.normalize();
          pulse.mesh.position.copy(pulseMid);
          if (Math.abs(pulseDir.y) > 0.999) {
            pulse.mesh.quaternion.identity();
            if (pulseDir.y < 0) {
              pulse.mesh.rotateX(Math.PI);
            }
          } else {
            pulse.mesh.quaternion.setFromUnitVectors(yAxis, pulseDir);
          }
          pulse.mesh.scale.set(radius, len, radius);
          // Soft hazy envelope — faint peak, soft falloff (still motion-readable).
          const travel = Math.sin(u * Math.PI);
          const breath = 0.55 + 0.45 * Math.sin(u * Math.PI * 2 + pulse.phase * 6);
          pulse.mat.opacity =
            peakOpacity * pulse.haze * travel * breath * 0.85;
        };

        const animate = () => {
          if (!alive || !renderer) return;
          raf = requestAnimationFrame(animate);
          try {
            frameN += 1;
            const t = clock.getElapsedTime();
            const {mode: m, activeChapter: chapter, shipTwitch: twitch} =
              stateRef.current;

            // Land: near-static pose — kills compositor smear ghosts Cos saw on live.
            // Hover/inspect: mild living drift only.
            if (m === 'land') {
              root.rotation.y = 0.55 + Math.sin(t * 0.035) * 0.02;
              root.rotation.x = 0.28 + Math.sin(t * 0.028) * 0.012;
              root.rotation.z = Math.cos(t * 0.022) * 0.008;
              root.position.y = Math.sin(t * 0.04) * 0.012;
              root.position.x = Math.cos(t * 0.032) * 0.01;
            } else {
              root.rotation.y = Math.sin(t * 0.08) * 0.14 + 0.55;
              root.rotation.x = Math.sin(t * 0.06) * 0.1 + 0.28;
              root.rotation.z = Math.cos(t * 0.05) * 0.04;
              root.position.y = Math.sin(t * 0.11) * 0.06;
              root.position.x = Math.cos(t * 0.08) * 0.05;
            }
            stars.rotation.y = t * 0.008;
            stars.rotation.x = Math.sin(t * 0.025) * 0.012;
            // Keep particle universe clearly readable (quiet breath, not dim washout).
            starMat.opacity = 0.5 + Math.sin(t * 0.25) * 0.05;

            const inspect = m === 'inspect';
            const hover = m === 'hover' || inspect;
            camTarget.copy(inspect ? inspectCam : hover ? hoverCam : landCam);
            camera.position.lerp(camTarget, 0.045);

            if (chapter && hover) {
              const focus = nodeMap.get(chapter);
              if (focus) {
                camera.lookAt(focus.x * 0.45, focus.y * 0.45, focus.z * 0.4);
              }
            } else {
              camera.lookAt(0.1, 0.05, 0);
            }

            for (const dn of depthNodes) {
              // Lite: skip dust billboards every frame (GPU stick).
              if (useLite && dn.kind === 'dust' && (frameN & 1) === 0) continue;
              dn.mesh.getWorldPosition(worldPos);
              const dist = Math.max(camera.position.distanceTo(worldPos), 0.8);
              const persp = THREE.MathUtils.clamp(refDist / dist, 0.55, 1.35);
              dn.mesh.scale.setScalar(dn.baseRadius * persp);
              // Billboard all hollow rings toward camera (quiet SoT hubs).
              dn.mesh.quaternion.copy(camera.quaternion);
            }

            for (const pulse of strokePulses) {
              const u = (t * pulse.speed + pulse.phase) % 1;
              if (pulse.kind === 'spoke') {
                const seg = spokeSegs[pulse.segIndex];
                if (!seg) {
                  pulse.mat.opacity = 0;
                  continue;
                }
                placePulse(
                  pulse,
                  seg.a,
                  seg.b,
                  u,
                  hover ? 0.01 : 0.0085,
                  // Wait-frame readable hazy wash across many spokes.
                  hover ? 0.32 : 0.48,
                  0.28,
                );
              } else {
                const half = 0.035;
                const u0 = (u - half + 1) % 1;
                const u1 = (u + half) % 1;
                closedLoop.getPointAt(u0, pulseFrom);
                closedLoop.getPointAt(u1, pulseTo);
                closedLoop.getPointAt(u, pulseMid);
                closedLoop.getTangentAt(u, pulseDir).normalize();
                pulse.mesh.position.copy(pulseMid);
                if (Math.abs(pulseDir.y) > 0.999) {
                  pulse.mesh.quaternion.identity();
                  if (pulseDir.y < 0) pulse.mesh.rotateX(Math.PI);
                } else {
                  pulse.mesh.quaternion.setFromUnitVectors(yAxis, pulseDir);
                }
                const dashLen = Math.max(
                  pulseFrom.distanceTo(pulseTo),
                  0.08,
                );
                // Wait-frame readable soft wash — still not a fat band.
                pulse.mesh.scale.set(0.01, dashLen, 0.01);
                const breath =
                  0.4 + 0.6 * Math.sin(u * Math.PI * 2 + pulse.phase * 4);
                pulse.mat.opacity =
                  (hover ? 0.28 : 0.48) * pulse.haze * breath;
              }
            }

            if (hover && chapter) {
              strokeMat.opacity = 0.12;
              spokeMat.opacity = 0.2;
              for (let i = 0; i < LOOP_ORDER.length; i += 1) {
                const id = LOOP_ORDER[i];
                const isNeighbor =
                  id === chapter ||
                  LOOP_ORDER[(i + LOOP_ORDER.length - 1) % LOOP_ORDER.length] ===
                    chapter ||
                  LOOP_ORDER[(i + 1) % LOOP_ORDER.length] === chapter;
                neighborMats[i].opacity = isNeighbor ? 0.2 : 0;
              }
              for (const dn of depthNodes) {
                const near =
                  dn.id === chapter ||
                  CONTEXT_EDGES.some(
                    ([a, b]) =>
                      (a === chapter && b === dn.id) ||
                      (b === chapter && a === dn.id),
                  );
                dn.mat.opacity = near
                  ? dn.kind === 'loop'
                    ? 0.95
                    : dn.kind === 'dust'
                      ? 0.22
                      : 0.6
                  : dn.kind === 'dust'
                    ? 0.08
                    : 0.14;
              }
            } else {
              // Almost translucent hub-to-hub (not opaque bright bands).
              strokeMat.opacity = 0.14;
              spokeMat.opacity = 0.16;
              for (const mat of neighborMats) {
                mat.opacity = 0;
              }
              for (const dn of depthNodes) {
                dn.mat.opacity =
                  dn.kind === 'loop'
                    ? 0.94
                    : dn.kind === 'context'
                      ? 0.55
                      : dn.kind === 'code'
                        ? 0.42
                        : 0.22;
              }
            }

            // Project HTML labels — throttled integer left/top + binary visibility
            // (Cos live FAIL: Brief/Challenge/Recap ghost doubles / motion smear).
            root.updateMatrixWorld(true);
            const viewW = renderer.domElement.clientWidth;
            const viewH = renderer.domElement.clientHeight;
            const labelTick = (Math.floor(t * 60) & 1) === 0; // ~30Hz label pose
            if (labelTick || m !== 'land') {
              for (const label of htmlLabels) {
                worldPos.copy(label.local);
                root.localToWorld(worldPos);
                worldPos.project(camera);
                const visible =
                  worldPos.z < 1 &&
                  worldPos.x > -1.05 &&
                  worldPos.x < 1.05 &&
                  worldPos.y > -1.05 &&
                  worldPos.y < 1.05;
                if (!visible) {
                  label.el.style.visibility = 'hidden';
                  label.el.style.opacity = '0';
                  continue;
                }
                const x = (worldPos.x * 0.5 + 0.5) * viewW;
                const y = (-worldPos.y * 0.5 + 0.5) * viewH;
                // Hard XY clamp — keep full "Stills" / "Research" inside safe area.
                const halfW =
                  label.id === 'stills' || label.id === 'research'
                    ? portrait
                      ? 42
                      : 36
                    : label.emphasis
                      ? 30
                      : 22;
                const padY = label.emphasis ? 22 : 14;
                const cx = Math.round(
                  Math.min(Math.max(x, halfW), viewW - halfW),
                );
                const cy = Math.round(
                  Math.min(Math.max(y, padY), viewH - padY),
                );
                const prevX = Number(label.el.dataset.x || -9999);
                const prevY = Number(label.el.dataset.y || -9999);
                if (Math.abs(prevX - cx) >= 1 || Math.abs(prevY - cy) >= 1) {
                  label.el.dataset.x = String(cx);
                  label.el.dataset.y = String(cy);
                  label.el.style.left = `${cx}px`;
                  label.el.style.top = `${cy}px`;
                }
                label.el.style.transform = 'translate(-50%,-120%)';
                // Binary show — never fractional opacity trails.
                label.el.style.visibility = 'visible';
                label.el.style.opacity =
                  twitch && label.id === 'ship' ? '1' : label.emphasis ? '1' : '0.55';
              }
            }

            rain.rotation.y = t * 0.016;
            rain.rotation.x = Math.sin(t * 0.05) * 0.03;

            if (!alive || !renderer) return;
            renderer.render(scene, camera);
          } catch (err) {
            failSoft(err);
          }
        };

        if (!alive) {
          tearDownGl(false);
          return;
        }

        renderer.render(scene, camera);
        setPaintState('live');
        retryCountRef.current = 0;
        if (!useLite) {
          try {
            window.sessionStorage.removeItem('ag-instrument-lite');
          } catch {
            // ignore
          }
        }
        animate();
      } catch (err) {
        failSoft(err);
      }
    };

    void paint();

    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      tearDownGl(false);
    };
  }, [mountKey]);

  return (
    <div
      className={className}
      aria-hidden
      data-instrument-paint={paintState}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'var(--ag-instrument-min-h)',
        position: 'relative',
      }}
    >
      <div
        ref={hostRef}
        style={{
          position: 'absolute',
          inset: 0,
          // Keep laid out + measurable while pending (visibility:hidden collapses
          // some mobile WebGL size reads into the soft-fail empty path).
          opacity: paintState === 'live' ? 1 : 0,
          pointerEvents: paintState === 'live' ? 'auto' : 'none',
        }}
      />
      {paintState !== 'live' ? (
        <InstrumentFallback
          reason={paintState === 'fallback' ? 'unavailable' : 'loading'}
        />
      ) : null}
    </div>
  );
}
