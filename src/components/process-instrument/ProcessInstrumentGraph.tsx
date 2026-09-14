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
  // Loop chapters — labeled, nearer/larger on average
  {id: 'research', label: 'Research', position: [-1.45, 0.85, 0.85], kind: 'loop', chapter: 'research', radius: 0.048},
  {id: 'brief', label: 'Brief', position: [0.2, 1.35, -0.55], kind: 'loop', chapter: 'brief', radius: 0.046},
  {id: 'stills', label: 'Stills', position: [1.65, 0.55, 0.95], kind: 'loop', chapter: 'stills', radius: 0.05},
  {id: 'challenge', label: 'Challenge', position: [1.35, -0.75, -0.7], kind: 'loop', chapter: 'challenge', radius: 0.045},
  {id: 'ship', label: 'Ship', position: [-0.15, -1.3, 0.75], kind: 'loop', chapter: 'ship', radius: 0.052},
  {id: 'recap', label: 'Recap', position: [-1.55, -0.35, -0.8], kind: 'loop', chapter: 'recap', radius: 0.044},
  // Context roles — spatial clusters off the loop
  {id: 'next', label: 'Next', position: [-2.4, 0.3, 1.15], kind: 'context', chapter: 'next', radius: 0.032},
  {id: 'design', label: 'Design', position: [2.35, 0.2, -1.2], kind: 'context', radius: 0.034},
  {id: 'product', label: 'Product', position: [0.75, 2.05, 1.05], kind: 'context', radius: 0.033},
  {id: 'lead', label: 'Lead', position: [-0.9, 2.1, -1.0], kind: 'context', radius: 0.033},
  {id: 'build', label: 'Build', position: [2.15, -1.4, 0.9], kind: 'context', radius: 0.034},
  // Measured codes
  {id: 'p01', label: 'P-01', position: [-2.7, 1.5, -1.35], kind: 'code', radius: 0.022},
  {id: 'p02', label: 'P-02', position: [-2.85, -1.2, 0.7], kind: 'code', radius: 0.022},
  {id: 'p03', label: 'P-03', position: [0.4, -2.2, -1.25], kind: 'code', radius: 0.021},
  {id: 'p04', label: 'P-04', position: [2.85, 1.55, 0.45], kind: 'code', radius: 0.022},
  {id: 'p05', label: 'P-05', position: [2.65, -0.4, 1.45], kind: 'code', radius: 0.021},
  {id: 'p06', label: 'P-06', position: [-0.5, 0.1, -2.05], kind: 'code', radius: 0.02},
  {id: 'p07', label: 'P-07', position: [1.0, -0.2, 1.95], kind: 'code', radius: 0.021},
  {id: 'p08', label: 'P-08', position: [-1.95, 1.8, 1.5], kind: 'code', radius: 0.02},
  {id: 'p09', label: 'P-09', position: [1.5, 1.85, -1.6], kind: 'code', radius: 0.02},
  {id: 'p10', label: 'P-10', position: [-2.05, -1.75, -1.05], kind: 'code', radius: 0.02},
  // Dense dust / cluster fillers — unlabeled, strong z-spread
  {id: 'd01', position: [-1.1, 1.4, 1.6], kind: 'dust', radius: 0.012},
  {id: 'd02', position: [-0.3, 1.7, -1.4], kind: 'dust', radius: 0.011},
  {id: 'd03', position: [1.1, 1.2, 1.7], kind: 'dust', radius: 0.013},
  {id: 'd04', position: [2.0, 0.9, -0.3], kind: 'dust', radius: 0.012},
  {id: 'd05', position: [1.9, -0.9, 1.5], kind: 'dust', radius: 0.011},
  {id: 'd06', position: [0.7, -1.6, 1.3], kind: 'dust', radius: 0.012},
  {id: 'd07', position: [-0.8, -1.7, -1.5], kind: 'dust', radius: 0.011},
  {id: 'd08', position: [-2.2, -0.8, 1.4], kind: 'dust', radius: 0.012},
  {id: 'd09', position: [-2.0, 1.0, -0.2], kind: 'dust', radius: 0.011},
  {id: 'd10', position: [0.2, 0.4, 2.1], kind: 'dust', radius: 0.01},
  {id: 'd11', position: [0.1, -0.5, -2.2], kind: 'dust', radius: 0.01},
  {id: 'd12', position: [1.3, -1.9, 0.2], kind: 'dust', radius: 0.011},
  {id: 'd13', position: [-1.3, 0.5, 1.9], kind: 'dust', radius: 0.01},
  {id: 'd14', position: [2.4, -0.1, 0.2], kind: 'dust', radius: 0.012},
  {id: 'd15', position: [-0.4, 2.3, 0.3], kind: 'dust', radius: 0.011},
  {id: 'd16', position: [0.9, 0.6, -1.8], kind: 'dust', radius: 0.01},
  {id: 'd17', position: [-1.7, -1.1, 0.2], kind: 'dust', radius: 0.011},
  {id: 'd18', position: [1.6, 1.0, 0.5], kind: 'dust', radius: 0.012},
  {id: 'd19', position: [-0.6, -0.2, 1.4], kind: 'dust', radius: 0.01},
  {id: 'd20', position: [0.5, 1.0, -0.9], kind: 'dust', radius: 0.011},
  {id: 'd21', position: [2.1, 1.2, 1.1], kind: 'dust', radius: 0.01},
  {id: 'd22', position: [-2.5, 0.6, -0.6], kind: 'dust', radius: 0.011},
  {id: 'd23', position: [1.2, -0.6, -1.5], kind: 'dust', radius: 0.01},
  {id: 'd24', position: [-1.0, 1.9, 0.6], kind: 'dust', radius: 0.011},
  {id: 'd25', position: [0.0, -2.0, 0.9], kind: 'dust', radius: 0.01},
  {id: 'd26', position: [2.6, -1.0, -0.5], kind: 'dust', radius: 0.011},
  {id: 'd27', position: [-1.8, 0.0, -1.6], kind: 'dust', radius: 0.01},
  {id: 'd28', position: [0.8, 1.6, -0.2], kind: 'dust', radius: 0.011},
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

  stateRef.current = {mode, activeChapter, shipTwitch};

  const retryPaint = useCallback(() => {
    setPaintState('pending');
    setMountKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /** False after unmount or fatal paint error — stops rAF before disposed render. */
    let alive = true;
    let raf = 0;
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
      tearDownGl(true);
      setPaintState('fallback');
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      failSoft(new Error('webglcontextlost'));
    };

    const onResize = () => {
      if (!alive || !renderer || !host) return;
      const w = Math.max(host.clientWidth || 640, 1);
      const h = Math.max(host.clientHeight || 640, 1);
      resizeCamera(w, h);
      renderer.setSize(w, h, false);
    };

    let resizeCamera = (_w: number, _h: number) => {
      /* assigned after camera exists */
    };

    try {
      const width = Math.max(host.clientWidth || 640, 1);
      const height = Math.max(host.clientHeight || 640, 1);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(VOID, 0.032);

      // Strong oblique projection — land must read Z, not a flat polygon kit.
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(3.15, 2.45, 4.55);
      camera.lookAt(0.1, 0.05, 0);
      resizeCamera = (w, h) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      renderer.setClearColor(VOID, 0);

      canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      host.appendChild(canvas);
      canvas.addEventListener('webglcontextlost', onContextLost, false);

      scene.add(new THREE.AmbientLight(0xb8c0ba, 0.5));
      const key = new THREE.DirectionalLight(0xffffff, 0.75);
      key.position.set(4.5, 5.8, 2.8);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8a9a8e, 0.28);
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
      for (let i = 0; i < 72; i += 1) {
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
      const sharedSphere = trackGeo(new THREE.SphereGeometry(1, 12, 12));

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
            ? 0.95
            : node.kind === 'context'
              ? 0.7
              : node.kind === 'code'
                ? 0.45
                : 0.28;

        // FILLED depth points — never hollow RingGeometry beads.
        const mat = trackMat(
          new THREE.MeshLambertMaterial({
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
          const labelMap = trackTex(
            makeLabelTexture(node.label, isLoop),
          );
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
      const spokePositions: number[] = [];
      for (const [a, b] of CONTEXT_EDGES) {
        const pa = nodeMap.get(a);
        const pb = nodeMap.get(b);
        if (!pa || !pb) continue;
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
          opacity: 0.32,
        }),
      );
      const spokes = new THREE.LineSegments(spokeGeo, spokeMat);
      root.add(spokes);

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
        new THREE.MeshLambertMaterial({
          color: WASH,
          transparent: true,
          opacity: 0.58,
          depthWrite: false,
        }),
      );
      root.add(
        new THREE.Mesh(
          trackGeo(new THREE.TubeGeometry(closedLoop, 180, 0.042, 14, true)),
          strokeMat,
        ),
      );
      root.add(
        new THREE.Mesh(
          trackGeo(new THREE.TubeGeometry(closedLoop, 180, 0.018, 10, true)),
          washMat,
        ),
      );

      // Neighbor accents: mid-span only (no ends at joints).
      const neighborMats: THREE.MeshLambertMaterial[] = [];
      for (let i = 0; i < LOOP_ORDER.length; i += 1) {
        const a = nodeMap.get(LOOP_ORDER[i]);
        const b = nodeMap.get(LOOP_ORDER[(i + 1) % LOOP_ORDER.length]);
        if (!a || !b) continue;
        const p0 = a.clone().lerp(b, 0.2);
        const p1 = a.clone().lerp(b, 0.5);
        p1.z += 0.2;
        const p2 = a.clone().lerp(b, 0.8);
        const mat = trackMat(
          new THREE.MeshLambertMaterial({
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
                18,
                0.022,
                8,
                false,
              ),
            ),
            mat,
          ),
        );
        neighborMats.push(mat);
      }

      const clock = new THREE.Clock();
      const landCam = new THREE.Vector3(3.15, 2.45, 4.55);
      const hoverCam = new THREE.Vector3(2.2, 1.65, 3.85);
      const inspectCam = new THREE.Vector3(1.35, 1.05, 3.05);
      const camTarget = landCam.clone();
      const worldPos = new THREE.Vector3();
      const refDist = 5.2;
      window.addEventListener('resize', onResize);

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

          // Perspective projection: nearer nodes larger — SoT depth cue.
          for (const dn of depthNodes) {
            dn.mesh.getWorldPosition(worldPos);
            const dist = Math.max(camera.position.distanceTo(worldPos), 0.8);
            const persp = THREE.MathUtils.clamp(refDist / dist, 0.45, 1.85);
            dn.mesh.scale.setScalar(dn.baseRadius * persp);
          }

          if (hover && chapter) {
            strokeMat.opacity = 0.32;
            washMat.opacity = 0.16;
            spokeMat.opacity = 0.4;
            for (let i = 0; i < LOOP_ORDER.length; i += 1) {
              const id = LOOP_ORDER[i];
              const isNeighbor =
                id === chapter ||
                LOOP_ORDER[(i + LOOP_ORDER.length - 1) % LOOP_ORDER.length] ===
                  chapter ||
                LOOP_ORDER[(i + 1) % LOOP_ORDER.length] === chapter;
              neighborMats[i].opacity = isNeighbor ? 0.72 : 0;
            }
            for (const dn of depthNodes) {
              const mat = dn.mesh.material as THREE.MeshLambertMaterial;
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
                  ? 0.95
                  : dn.kind === 'dust'
                    ? 0.22
                    : 0.75
                : dn.kind === 'dust'
                  ? 0.08
                  : 0.2;
            }
          } else {
            strokeMat.opacity = 0.76;
            washMat.opacity = 0.5 + Math.sin(t * 0.85) * 0.08;
            spokeMat.opacity = 0.3;
            for (const mat of neighborMats) {
              mat.opacity = 0;
            }
            for (const dn of depthNodes) {
              const mat = dn.mesh.material as THREE.MeshLambertMaterial;
              mat.opacity =
                dn.kind === 'loop'
                  ? 0.95
                  : dn.kind === 'context'
                    ? 0.7
                    : dn.kind === 'code'
                      ? 0.45
                      : 0.28;
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
            const pulse = 1 + Math.sin(t * 10) * 0.18;
            shipNode.mesh.getWorldPosition(worldPos);
            const dist = Math.max(camera.position.distanceTo(worldPos), 0.8);
            const persp = THREE.MathUtils.clamp(refDist / dist, 0.45, 1.85);
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

      setPaintState('live');
      animate();

      return () => {
        alive = false;
        window.removeEventListener('resize', onResize);
        tearDownGl(false);
      };
    } catch (err) {
      window.removeEventListener('resize', onResize);
      failSoft(err);
      return () => {
        alive = false;
        window.removeEventListener('resize', onResize);
        tearDownGl(false);
      };
    }
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
          visibility: paintState === 'live' ? 'visible' : 'hidden',
        }}
      />
      {paintState !== 'live' ? (
        <InstrumentFallback
          reason={paintState === 'fallback' ? 'unavailable' : 'loading'}
          onRetry={paintState === 'fallback' ? retryPaint : undefined}
        />
      ) : null}
    </div>
  );
}
