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
 * Dense 3D projected force graph — SoT stills-39 / AG #39 @ 3e8de677.
 * Depth-sized FILLED points (not hollow spectacle beads / RingGeometry).
 * Active path = sage stroke + white wash INSIDE only.
 */
const NODES: NodeDef[] = [
  // Loop chapters — tiny depth ticks only (path wash is the signal; no joint beads).
  {id: 'research', label: 'Research', position: [-1.45, 0.85, 0.85], kind: 'loop', chapter: 'research', radius: 0.011},
  {id: 'brief', label: 'Brief', position: [0.2, 1.35, -0.55], kind: 'loop', chapter: 'brief', radius: 0.01},
  {id: 'stills', label: 'Stills', position: [1.65, 0.55, 0.95], kind: 'loop', chapter: 'stills', radius: 0.011},
  {id: 'challenge', label: 'Challenge', position: [1.35, -0.75, -0.7], kind: 'loop', chapter: 'challenge', radius: 0.01},
  {id: 'ship', label: 'Ship', position: [-0.15, -1.3, 0.75], kind: 'loop', chapter: 'ship', radius: 0.011},
  {id: 'recap', label: 'Recap', position: [-1.55, -0.35, -0.8], kind: 'loop', chapter: 'recap', radius: 0.01},
  // Context roles — spatial clusters off the loop (never lit glowing spheres)
  {id: 'next', label: 'Next', position: [-2.4, 0.3, 1.15], kind: 'context', chapter: 'next', radius: 0.012},
  {id: 'design', label: 'Design', position: [2.35, 0.2, -1.2], kind: 'context', radius: 0.012},
  {id: 'product', label: 'Product', position: [0.75, 2.05, 1.05], kind: 'context', radius: 0.012},
  {id: 'lead', label: 'Lead', position: [-0.9, 2.1, -1.0], kind: 'context', radius: 0.012},
  {id: 'build', label: 'Build', position: [2.15, -1.4, 0.9], kind: 'context', radius: 0.012},
  // Measured codes
  {id: 'p01', label: 'P-01', position: [-2.7, 1.5, -1.35], kind: 'code', radius: 0.008},
  {id: 'p02', label: 'P-02', position: [-2.85, -1.2, 0.7], kind: 'code', radius: 0.008},
  {id: 'p03', label: 'P-03', position: [0.4, -2.2, -1.25], kind: 'code', radius: 0.008},
  {id: 'p04', label: 'P-04', position: [2.85, 1.55, 0.45], kind: 'code', radius: 0.008},
  {id: 'p05', label: 'P-05', position: [2.65, -0.4, 1.45], kind: 'code', radius: 0.008},
  {id: 'p06', label: 'P-06', position: [-0.5, 0.1, -2.05], kind: 'code', radius: 0.007},
  {id: 'p07', label: 'P-07', position: [1.0, -0.2, 1.95], kind: 'code', radius: 0.008},
  {id: 'p08', label: 'P-08', position: [-1.95, 1.8, 1.5], kind: 'code', radius: 0.007},
  {id: 'p09', label: 'P-09', position: [1.5, 1.85, -1.6], kind: 'code', radius: 0.007},
  {id: 'p10', label: 'P-10', position: [-2.05, -1.75, -1.05], kind: 'code', radius: 0.007},
  // Dense dust / cluster fillers — unlabeled, strong z-spread
  {id: 'd01', position: [-1.1, 1.4, 1.6], kind: 'dust', radius: 0.005},
  {id: 'd02', position: [-0.3, 1.7, -1.4], kind: 'dust', radius: 0.005},
  {id: 'd03', position: [1.1, 1.2, 1.7], kind: 'dust', radius: 0.005},
  {id: 'd04', position: [2.0, 0.9, -0.3], kind: 'dust', radius: 0.005},
  {id: 'd05', position: [1.9, -0.9, 1.5], kind: 'dust', radius: 0.005},
  {id: 'd06', position: [0.7, -1.6, 1.3], kind: 'dust', radius: 0.005},
  {id: 'd07', position: [-0.8, -1.7, -1.5], kind: 'dust', radius: 0.005},
  {id: 'd08', position: [-2.2, -0.8, 1.4], kind: 'dust', radius: 0.005},
  {id: 'd09', position: [-2.0, 1.0, -0.2], kind: 'dust', radius: 0.005},
  {id: 'd10', position: [0.2, 0.4, 2.1], kind: 'dust', radius: 0.004},
  {id: 'd11', position: [0.1, -0.5, -2.2], kind: 'dust', radius: 0.004},
  {id: 'd12', position: [1.3, -1.9, 0.2], kind: 'dust', radius: 0.005},
  {id: 'd13', position: [-1.3, 0.5, 1.9], kind: 'dust', radius: 0.004},
  {id: 'd14', position: [2.4, -0.1, 0.2], kind: 'dust', radius: 0.005},
  {id: 'd15', position: [-0.4, 2.3, 0.3], kind: 'dust', radius: 0.005},
  {id: 'd16', position: [0.9, 0.6, -1.8], kind: 'dust', radius: 0.004},
  {id: 'd17', position: [-1.7, -1.1, 0.2], kind: 'dust', radius: 0.005},
  {id: 'd18', position: [1.6, 1.0, 0.5], kind: 'dust', radius: 0.005},
  {id: 'd19', position: [-0.6, -0.2, 1.4], kind: 'dust', radius: 0.004},
  {id: 'd20', position: [0.5, 1.0, -0.9], kind: 'dust', radius: 0.005},
  {id: 'd21', position: [2.1, 1.2, 1.1], kind: 'dust', radius: 0.004},
  {id: 'd22', position: [-2.5, 0.6, -0.6], kind: 'dust', radius: 0.005},
  {id: 'd23', position: [1.2, -0.6, -1.5], kind: 'dust', radius: 0.004},
  {id: 'd24', position: [-1.0, 1.9, 0.6], kind: 'dust', radius: 0.005},
  {id: 'd25', position: [0.0, -2.0, 0.9], kind: 'dust', radius: 0.004},
  {id: 'd26', position: [2.6, -1.0, -0.5], kind: 'dust', radius: 0.005},
  {id: 'd27', position: [-1.8, 0.0, -1.6], kind: 'dust', radius: 0.004},
  {id: 'd28', position: [0.8, 1.6, -0.2], kind: 'dust', radius: 0.005},
];

const CONTEXT_EDGES: Array<[string, string]> = [
  // Loop ↔ context spokes
  ['research', 'lead'],
  ['research', 'p01'],
  ['research', 'p08'],
  ['research', 'd01'],
  ['research', 'd09'],
  ['brief', 'product'],
  ['brief', 'design'],
  ['brief', 'p09'],
  ['brief', 'd02'],
  ['brief', 'd15'],
  ['stills', 'design'],
  ['stills', 'p04'],
  ['stills', 'p07'],
  ['stills', 'd03'],
  ['stills', 'd18'],
  ['challenge', 'build'],
  ['challenge', 'p05'],
  ['challenge', 'p03'],
  ['challenge', 'd05'],
  ['challenge', 'd23'],
  ['ship', 'build'],
  ['ship', 'p03'],
  ['ship', 'p10'],
  ['ship', 'd06'],
  ['ship', 'd25'],
  ['recap', 'next'],
  ['recap', 'p02'],
  ['recap', 'p06'],
  ['recap', 'd07'],
  ['recap', 'd17'],
  // Cluster webs
  ['next', 'p01'],
  ['next', 'p08'],
  ['next', 'd08'],
  ['next', 'd13'],
  ['design', 'p07'],
  ['design', 'p05'],
  ['design', 'd04'],
  ['design', 'd14'],
  ['product', 'p06'],
  ['product', 'p04'],
  ['product', 'd03'],
  ['product', 'd28'],
  ['lead', 'p06'],
  ['lead', 'p09'],
  ['lead', 'd02'],
  ['lead', 'd24'],
  ['build', 'p07'],
  ['build', 'p10'],
  ['build', 'd05'],
  ['build', 'd26'],
  // Dust lattice — density without a skinny ring
  ['d01', 'd13'],
  ['d01', 'd24'],
  ['d02', 'd15'],
  ['d02', 'd20'],
  ['d03', 'd10'],
  ['d03', 'd18'],
  ['d04', 'd14'],
  ['d04', 'd21'],
  ['d05', 'd14'],
  ['d06', 'd12'],
  ['d06', 'd19'],
  ['d07', 'd11'],
  ['d07', 'd27'],
  ['d08', 'd17'],
  ['d09', 'd22'],
  ['d10', 'd19'],
  ['d11', 'd16'],
  ['d12', 'd25'],
  ['d16', 'd20'],
  ['d18', 'd21'],
  ['d22', 'd27'],
  ['d23', 'd26'],
  ['p01', 'd22'],
  ['p04', 'd21'],
  ['p06', 'd11'],
  ['p07', 'd10'],
];

const SAGE = 0x8a9a8e;
const SAGE_DIM = 0x4a554e;
const SAGE_DUST = 0x3a433d;
const WASH = 0xffffff;
const VOID = 0x030303;

function makeLabelTexture(text: string, emphasis: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = emphasis
    ? '500 28px Geist, ui-sans-serif, system-ui, sans-serif'
    : '400 22px Geist, ui-sans-serif, system-ui, sans-serif';
  ctx.fillStyle = emphasis
    ? 'rgba(242,241,236,0.92)'
    : 'rgba(138,154,142,0.4)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type DepthNode = {
  mesh: THREE.Mesh;
  baseRadius: number;
  kind: NodeDef['kind'];
  id: string;
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
    // Keep trying forever (backoff, then steady 4s) — unavailable as steady face = FAIL.
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
      }
      if (renderer) {
        if (forceLoss) {
          try {
            renderer.forceContextLoss();
          } catch {
            // already lost
          }
        }
        renderer.dispose();
        if (canvas && canvas.parentNode === host) {
          host.removeChild(canvas);
        }
        renderer = null;
        canvas = null;
      }
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
      tearDownGl(true);
      // Transient empty only — auto-retry effect remounts true-3D.
      setPaintState('fallback');
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      failSoft(new Error('webglcontextlost'));
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
          // Last resort: CSS min-height stage (~28rem) so we still paint 3D.
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
        const dprCap = portrait ? 1.25 : 1.5;
        const tubeSegs = portrait ? 96 : 160;
        const tubeRadial = portrait ? 8 : 12;
        const rainCount = portrait ? 40 : 72;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(VOID, 0.032);

        // Strong oblique projection — land must read Z, not a flat polygon kit.
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

        // Canvas-first: some mobile WebGL stacks fail if context is created off-DOM.
        canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        host.appendChild(canvas);
        canvas.addEventListener('webglcontextlost', onContextLost, false);

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !portrait,
          alpha: true,
          powerPreference: portrait ? 'low-power' : 'default',
          failIfMajorPerformanceCaveat: false,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
        renderer.setSize(width, height, false);
        renderer.setClearColor(VOID, 0);

        // Soft volume light for path tubes only — nodes stay unlit Basic (no glow beads).
        scene.add(new THREE.AmbientLight(0xb8c0ba, 0.55));
        const key = new THREE.DirectionalLight(0xffffff, 0.55);
        key.position.set(4.5, 5.8, 2.8);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x8a9a8e, 0.22);
        fill.position.set(-3.8, -1.2, 2.2);
        scene.add(fill);

        const root = new THREE.Group();
        scene.add(root);

        // Atmosphere rain codes (≤10% gray).
        const rain = new THREE.Group();
        const rainMat = trackMat(
          new THREE.MeshBasicMaterial({
            color: 0x6a736c,
            transparent: true,
            opacity: 0.08,
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
        const labelSprites = new Map<string, THREE.Sprite>();
        const depthNodes: DepthNode[] = [];
        // Low-seg spheres — ticks only; Cos FAIL on glowing tube beads.
        const sharedSphere = trackGeo(new THREE.SphereGeometry(1, 8, 8));

        for (const node of NODES) {
          const pos = new THREE.Vector3(...node.position);
          nodeMap.set(node.id, pos);

          const isLoop = node.kind === 'loop';
          const color =
            node.kind === 'loop'
              ? SAGE
              : node.kind === 'context'
                ? 0x6e7a72
                : node.kind === 'code'
                  ? SAGE_DIM
                  : SAGE_DUST;
          const opacity =
            node.kind === 'loop'
              ? 0.85
              : node.kind === 'context'
                ? 0.55
                : node.kind === 'code'
                  ? 0.4
                  : 0.22;

          // Unlit filled ticks — MeshBasicMaterial so lights never make joint beads.
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity,
              depthWrite: node.kind !== 'dust',
            }),
          );
          const mesh = new THREE.Mesh(sharedSphere, mat);
          mesh.position.copy(pos);
          mesh.scale.setScalar(node.radius);
          root.add(mesh);
          depthNodes.push({
            mesh,
            baseRadius: node.radius,
            kind: node.kind,
            id: node.id,
          });

          if (node.label) {
            const labelMap = trackTex(makeLabelTexture(node.label, isLoop));
            const sprite = new THREE.Sprite(
              trackMat(
                new THREE.SpriteMaterial({
                  map: labelMap,
                  transparent: true,
                  depthTest: false,
                  opacity: isLoop ? 1 : node.kind === 'context' ? 0.7 : 0.45,
                }),
              ),
            );
            sprite.position
              .copy(pos)
              .add(new THREE.Vector3(0, isLoop ? 0.17 : 0.11, 0.04));
            sprite.scale.set(
              isLoop ? 1.05 : 0.7,
              isLoop ? 0.26 : 0.18,
              1,
            );
            root.add(sprite);
            labelSprites.set(node.id, sprite);
          }
        }

        // Dense spoke cloud (Line segments — force-graph lattice).
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
            color: SAGE_DIM,
            transparent: true,
            opacity: 0.28,
          }),
        );
        root.add(new THREE.LineSegments(spokeGeo, spokeMat));

        /**
         * Faint white wash pulses traveling ALONG strokes (inside the line) —
         * DESIGN_AGENCY_BAR: luminance in-path only, no bead objects / glow-as-craft.
         * Y-up open cylinder; placePulse scales Y as travel length (do NOT rotateX).
         */
        type StrokePulse = {
          mesh: THREE.Mesh;
          mat: THREE.MeshBasicMaterial;
          phase: number;
          speed: number;
          kind: 'spoke' | 'loop';
          segIndex: number;
        };
        const pulseGeo = trackGeo(
          new THREE.CylinderGeometry(1, 1, 1, 6, 1, true),
        );
        const strokePulses: StrokePulse[] = [];
        const pulseCount = Math.min(spokeSegs.length, 28);
        for (let i = 0; i < pulseCount; i += 1) {
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: true,
            }),
          );
          const mesh = new THREE.Mesh(pulseGeo, mat);
          root.add(mesh);
          strokePulses.push({
            mesh,
            mat,
            phase: (i * 0.113) % 1,
            speed: 0.22 + (i % 7) * 0.035,
            kind: 'spoke',
            segIndex: i % spokeSegs.length,
          });
        }
        // Traveling wash dashes on the active loop path (inside the stroke).
        for (let i = 0; i < 7; i += 1) {
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: true,
            }),
          );
          const mesh = new THREE.Mesh(pulseGeo, mat);
          root.add(mesh);
          strokePulses.push({
            mesh,
            mat,
            phase: i / 7,
            speed: 0.16 + i * 0.012,
            kind: 'loop',
            segIndex: i,
          });
        }
        const pulseFrom = new THREE.Vector3();
        const pulseTo = new THREE.Vector3();
        const pulseMid = new THREE.Vector3();
        const pulseDir = new THREE.Vector3();
        const yAxis = new THREE.Vector3(0, 1, 0);

        // Active process path: ONE closed tube + white wash INSIDE (no open-end beads).
        const loopPts: THREE.Vector3[] = [];
        for (const id of LOOP_ORDER) {
          const p = nodeMap.get(id);
          if (p) loopPts.push(p.clone());
        }
        const closedLoop = new THREE.CatmullRomCurve3(
          loopPts,
          true,
          'catmullrom',
          0.45,
        );
        const strokeMat = trackMat(
          new THREE.MeshLambertMaterial({
            color: SAGE,
            transparent: true,
            opacity: 0.78,
            depthWrite: false,
          }),
        );
        const washMat = trackMat(
          new THREE.MeshBasicMaterial({
            color: WASH,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
          }),
        );
        root.add(
          new THREE.Mesh(
            trackGeo(
              new THREE.TubeGeometry(
                closedLoop,
                tubeSegs,
                0.038,
                tubeRadial,
                true,
              ),
            ),
            strokeMat,
          ),
        );
        root.add(
          new THREE.Mesh(
            trackGeo(
              new THREE.TubeGeometry(
                closedLoop,
                tubeSegs,
                0.015,
                Math.max(6, tubeRadial - 2),
                true,
              ),
            ),
            washMat,
          ),
        );

        // Neighbor accents: mid-span only (no ends at joints).
        const neighborMats: THREE.MeshBasicMaterial[] = [];
        for (let i = 0; i < LOOP_ORDER.length; i += 1) {
          const a = nodeMap.get(LOOP_ORDER[i]);
          const b = nodeMap.get(LOOP_ORDER[(i + 1) % LOOP_ORDER.length]);
          if (!a || !b) continue;
          const p0 = a.clone().lerp(b, 0.22);
          const p1 = a.clone().lerp(b, 0.5);
          p1.z += 0.18;
          const p2 = a.clone().lerp(b, 0.78);
          const mat = trackMat(
            new THREE.MeshBasicMaterial({
              color: WASH,
              transparent: true,
              opacity: 0,
              depthWrite: false,
            }),
          );
          root.add(
            new THREE.Mesh(
              trackGeo(
                new THREE.TubeGeometry(
                  new THREE.CatmullRomCurve3([p0, p1, p2]),
                  14,
                  0.016,
                  6,
                  false,
                ),
              ),
              mat,
            ),
          );
          neighborMats.push(mat);
        }

        const clock = new THREE.Clock();
        const camTarget = landCam.clone();
        const worldPos = new THREE.Vector3();
        const refDist = portrait ? 6.9 : 5.2;
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
          half = 0.12,
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
          // Y = length along stroke; X/Z = thin wash radius (not a bead).
          pulse.mesh.scale.set(radius, len, radius);
          const travel = Math.sin(u * Math.PI);
          pulse.mat.opacity = peakOpacity * (0.4 + 0.6 * travel);
        };

        const animate = () => {
          if (!alive || !renderer) return;
          raf = requestAnimationFrame(animate);
          try {
            const t = clock.getElapsedTime();
            const {mode: m, activeChapter: chapter, shipTwitch: twitch} =
              stateRef.current;

            // Continuous slight drift — living instrument.
            root.rotation.y = Math.sin(t * 0.1) * 0.2 + 0.55;
            root.rotation.x = Math.sin(t * 0.075) * 0.14 + 0.28;
            root.rotation.z = Math.cos(t * 0.065) * 0.055;
            root.position.y = Math.sin(t * 0.13) * 0.09;
            root.position.x = Math.cos(t * 0.095) * 0.08;

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

            // Perspective projection: nearer nodes larger — SoT depth cue (tight clamp).
            for (const dn of depthNodes) {
              dn.mesh.getWorldPosition(worldPos);
              const dist = Math.max(camera.position.distanceTo(worldPos), 0.8);
              const persp = THREE.MathUtils.clamp(refDist / dist, 0.55, 1.35);
              dn.mesh.scale.setScalar(dn.baseRadius * persp);
            }

            // Faint white wash pulses traveling along spokes + loop (inside strokes).
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
                  hover ? 0.009 : 0.0075,
                  hover ? 0.55 : 0.78,
                  0.14,
                );
              } else {
                const half = 0.045;
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
                // Short dash along path — wash traveling inside the stroke.
                const dashLen = Math.max(
                  pulseFrom.distanceTo(pulseTo),
                  0.12,
                );
                pulse.mesh.scale.set(0.012, dashLen, 0.012);
                pulse.mat.opacity =
                  (hover ? 0.5 : 0.82) *
                  (0.55 + 0.45 * Math.sin(u * Math.PI * 2));
              }
            }

            if (hover && chapter) {
              strokeMat.opacity = 0.32;
              washMat.opacity = 0.2;
              spokeMat.opacity = 0.4;
              for (let i = 0; i < LOOP_ORDER.length; i += 1) {
                const id = LOOP_ORDER[i];
                const isNeighbor =
                  id === chapter ||
                  LOOP_ORDER[(i + LOOP_ORDER.length - 1) % LOOP_ORDER.length] ===
                    chapter ||
                  LOOP_ORDER[(i + 1) % LOOP_ORDER.length] === chapter;
                neighborMats[i].opacity = isNeighbor ? 0.65 : 0;
              }
              for (const dn of depthNodes) {
                const mat = dn.mesh.material as THREE.MeshBasicMaterial;
                const near =
                  dn.id === chapter ||
                  dn.kind === 'dust' ||
                  CONTEXT_EDGES.some(
                    ([a, b]) =>
                      (a === chapter && b === dn.id) ||
                      (b === chapter && a === dn.id),
                  );
                mat.opacity = near
                  ? dn.kind === 'loop'
                    ? 0.9
                    : dn.kind === 'dust'
                      ? 0.2
                      : 0.65
                  : dn.kind === 'dust'
                    ? 0.06
                    : 0.18;
              }
            } else {
              strokeMat.opacity = 0.76;
              washMat.opacity = 0.52 + Math.sin(t * 0.85) * 0.1;
              spokeMat.opacity = 0.3;
              for (const mat of neighborMats) {
                mat.opacity = 0;
              }
              for (const dn of depthNodes) {
                const mat = dn.mesh.material as THREE.MeshBasicMaterial;
                mat.opacity =
                  dn.kind === 'loop'
                    ? 0.85
                    : dn.kind === 'context'
                      ? 0.55
                      : dn.kind === 'code'
                        ? 0.4
                        : 0.22;
              }
            }

            const shipLabel = labelSprites.get('ship');
            if (shipLabel) {
              const labelMat = shipLabel.material as THREE.SpriteMaterial;
              labelMat.opacity = twitch
                ? 0.7 + Math.sin(t * 10) * 0.3
                : 1;
              const base = 1.05;
              const pulse = twitch ? 1 + Math.sin(t * 10) * 0.06 : 1;
              shipLabel.scale.set(base * pulse, 0.26 * pulse, 1);
            }
            const shipNode = depthNodes.find((d) => d.id === 'ship');
            if (shipNode && twitch) {
              const pulse = 1 + Math.sin(t * 10) * 0.12;
              shipNode.mesh.getWorldPosition(worldPos);
              const dist = Math.max(camera.position.distanceTo(worldPos), 0.8);
              const persp = THREE.MathUtils.clamp(refDist / dist, 0.55, 1.35);
              shipNode.mesh.scale.setScalar(shipNode.baseRadius * persp * pulse);
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

        // Confirm a frame actually paints before claiming live.
        renderer.render(scene, camera);
        setPaintState('live');
        retryCountRef.current = 0;
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
