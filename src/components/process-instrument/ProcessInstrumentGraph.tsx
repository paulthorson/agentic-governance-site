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
  label: string;
  position: [number, number, number];
  kind: 'loop' | 'context' | 'code';
  chapter?: ProcessChapterId;
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
 * Spatial clusters with real z-depth — denser measured KG beside chapters.
 * No bead/sphere/ring marks at joints (DESIGN_AGENCY_BAR / #43 / rejected 9b1bba2).
 */
const NODES: NodeDef[] = [
  {id: 'research', label: 'Research', position: [-1.55, 0.95, 0.55], kind: 'loop', chapter: 'research'},
  {id: 'brief', label: 'Brief', position: [0.15, 1.45, -0.45], kind: 'loop', chapter: 'brief'},
  {id: 'stills', label: 'Stills', position: [1.75, 0.65, 0.7], kind: 'loop', chapter: 'stills'},
  {id: 'challenge', label: 'Challenge', position: [1.45, -0.7, -0.55], kind: 'loop', chapter: 'challenge'},
  {id: 'ship', label: 'Ship', position: [-0.1, -1.35, 0.5], kind: 'loop', chapter: 'ship'},
  {id: 'recap', label: 'Recap', position: [-1.6, -0.4, -0.65], kind: 'loop', chapter: 'recap'},
  {id: 'next', label: 'Next', position: [-2.45, 0.25, 0.95], kind: 'context', chapter: 'next'},
  {id: 'design', label: 'Design', position: [2.45, 0.15, -1.05], kind: 'context'},
  {id: 'product', label: 'Product', position: [0.85, 2.15, 0.9], kind: 'context'},
  {id: 'lead', label: 'Lead', position: [-0.85, 2.2, -0.85], kind: 'context'},
  {id: 'build', label: 'Build', position: [2.25, -1.35, 0.75], kind: 'context'},
  {id: 'p01', label: 'P-01', position: [-2.75, 1.55, -1.15], kind: 'code'},
  {id: 'p02', label: 'P-02', position: [-2.95, -1.15, 0.55], kind: 'code'},
  {id: 'p03', label: 'P-03', position: [0.35, -2.25, -1.05], kind: 'code'},
  {id: 'p04', label: 'P-04', position: [2.9, 1.65, 0.35], kind: 'code'},
  {id: 'p05', label: 'P-05', position: [2.7, -0.35, 1.25], kind: 'code'},
  {id: 'p06', label: 'P-06', position: [-0.55, 0.15, -1.85], kind: 'code'},
  {id: 'p07', label: 'P-07', position: [1.05, -0.15, 1.75], kind: 'code'},
  {id: 'p08', label: 'P-08', position: [-1.9, 1.85, 1.35], kind: 'code'},
  {id: 'p09', label: 'P-09', position: [1.55, 1.9, -1.45], kind: 'code'},
  {id: 'p10', label: 'P-10', position: [-2.1, -1.7, -0.9], kind: 'code'},
];

const CONTEXT_EDGES: Array<[string, string]> = [
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
];

const SAGE = 0x8a9a8e;
const SAGE_DIM = 0x4a554e;
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
    : 'rgba(138,154,142,0.42)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

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
      scene.fog = new THREE.FogExp2(VOID, 0.034);

      // Oblique perspective so land reads true-3D (not a flat polygon kit).
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(2.55, 2.05, 4.85);
      camera.lookAt(0.05, 0.05, 0);
      resizeCamera = (w, h) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      // Construct renderer directly — no throwaway probe context (iOS slot leak).
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

      // Soft volume on tubes — sells depth without glow-as-craft spectacle.
      scene.add(new THREE.AmbientLight(0xb8c0ba, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 0.7);
      key.position.set(4.2, 5.5, 3.2);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8a9a8e, 0.25);
      fill.position.set(-3.5, -1.5, 2.5);
      scene.add(fill);

      const root = new THREE.Group();
      scene.add(root);

      // Atmosphere rain codes (≤10% gray) — density without spectacle.
      const rain = new THREE.Group();
      const rainMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x6a736c,
          transparent: true,
          opacity: 0.09,
        }),
      );
      for (let i = 0; i < 64; i += 1) {
        const mesh = new THREE.Mesh(
          trackGeo(new THREE.PlaneGeometry(0.1, 0.018)),
          rainMat,
        );
        mesh.position.set(
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 7,
          -1.5 - Math.random() * 4,
        );
        mesh.rotation.z = (Math.random() - 0.5) * 0.4;
        rain.add(mesh);
      }
      scene.add(rain);

      const nodeMap = new Map<string, THREE.Vector3>();
      const labelSprites = new Map<string, THREE.Sprite>();

      for (const node of NODES) {
        const pos = new THREE.Vector3(...node.position);
        nodeMap.set(node.id, pos);

        const isLoop = node.kind === 'loop';
        // Labels only at joints — no Sphere/Ring beads.
        const labelMap = trackTex(makeLabelTexture(node.label, isLoop));
        const sprite = new THREE.Sprite(
          trackMat(
            new THREE.SpriteMaterial({
              map: labelMap,
              transparent: true,
              depthTest: false,
              opacity: isLoop ? 1 : node.kind === 'context' ? 0.72 : 0.5,
            }),
          ),
        );
        sprite.position
          .copy(pos)
          .add(new THREE.Vector3(0, isLoop ? 0.16 : 0.1, 0.02));
        sprite.scale.set(isLoop ? 1.05 : 0.72, isLoop ? 0.26 : 0.18, 1);
        root.add(sprite);
        labelSprites.set(node.id, sprite);
      }

      const contextLines: THREE.Line[] = [];
      for (const [a, b] of CONTEXT_EDGES) {
        const pa = nodeMap.get(a);
        const pb = nodeMap.get(b);
        if (!pa || !pb) continue;
        const mid = pa.clone().lerp(pb, 0.5);
        mid.z += (pa.z + pb.z) * 0.08 + ((a.length + b.length) % 7) * 0.02 - 0.06;
        const curve = new THREE.CatmullRomCurve3([pa, mid, pb]);
        const pts = curve.getPoints(10);
        const line = new THREE.Line(
          trackGeo(new THREE.BufferGeometry().setFromPoints(pts)),
          trackMat(
            new THREE.LineBasicMaterial({
              color: SAGE_DIM,
              transparent: true,
              opacity: 0.28,
            }),
          ),
        );
        root.add(line);
        contextLines.push(line);
      }

      // ONE closed loop tube — open segment ends at joints read as beads (FAIL).
      const loopPts: THREE.Vector3[] = [];
      for (const id of LOOP_ORDER) {
        const p = nodeMap.get(id);
        if (p) loopPts.push(p.clone());
      }
      const closedLoop = new THREE.CatmullRomCurve3(loopPts, true, 'catmullrom', 0.35);
      const strokeMat = trackMat(
        new THREE.MeshLambertMaterial({
          color: SAGE,
          transparent: true,
          opacity: 0.72,
          depthWrite: false,
        }),
      );
      const washMat = trackMat(
        new THREE.MeshLambertMaterial({
          color: WASH,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        }),
      );
      const pathStroke = new THREE.Mesh(
        trackGeo(new THREE.TubeGeometry(closedLoop, 160, 0.038, 12, true)),
        strokeMat,
      );
      root.add(pathStroke);
      const washTube = new THREE.Mesh(
        trackGeo(new THREE.TubeGeometry(closedLoop, 160, 0.016, 10, true)),
        washMat,
      );
      root.add(washTube);

      // Neighbor accents: mid-span only (no open ends at joints).
      const neighborMats: THREE.MeshLambertMaterial[] = [];
      for (let i = 0; i < LOOP_ORDER.length; i += 1) {
        const a = nodeMap.get(LOOP_ORDER[i]);
        const b = nodeMap.get(LOOP_ORDER[(i + 1) % LOOP_ORDER.length]);
        if (!a || !b) continue;
        const p0 = a.clone().lerp(b, 0.18);
        const p1 = a.clone().lerp(b, 0.5);
        p1.z += 0.18;
        const p2 = a.clone().lerp(b, 0.82);
        const seg = new THREE.CatmullRomCurve3([p0, p1, p2]);
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
            trackGeo(new THREE.TubeGeometry(seg, 16, 0.02, 8, false)),
            mat,
          ),
        );
        neighborMats.push(mat);
      }

      const clock = new THREE.Clock();
      const landCam = new THREE.Vector3(2.55, 2.05, 4.85);
      const hoverCam = new THREE.Vector3(1.85, 1.45, 4.15);
      const inspectCam = new THREE.Vector3(1.15, 0.95, 3.35);
      const camTarget = landCam.clone();
      window.addEventListener('resize', onResize);

      const animate = () => {
        // Guard BEFORE scheduling next frame — Strict Mode dispose race.
        if (!alive || !renderer) return;
        raf = requestAnimationFrame(animate);
        try {
          const t = clock.getElapsedTime();
          const {mode: m, activeChapter: chapter, shipTwitch: twitch} =
            stateRef.current;

          // Continuous slight drift — living instrument, not a static diagram.
          root.rotation.y = Math.sin(t * 0.11) * 0.18 + 0.48;
          root.rotation.x = Math.sin(t * 0.08) * 0.12 + 0.22;
          root.rotation.z = Math.cos(t * 0.07) * 0.05;
          root.position.y = Math.sin(t * 0.14) * 0.08;
          root.position.x = Math.cos(t * 0.1) * 0.07;

          const inspect = m === 'inspect';
          const hover = m === 'hover' || inspect;
          camTarget.copy(inspect ? inspectCam : hover ? hoverCam : landCam);
          camera.position.lerp(camTarget, 0.045);

          if (chapter && hover) {
            const focus = nodeMap.get(chapter);
            if (focus) {
              camera.lookAt(focus.x * 0.4, focus.y * 0.4, focus.z * 0.35);
            }
          } else {
            camera.lookAt(0.05, 0.05, 0);
          }

          if (hover && chapter) {
            strokeMat.opacity = 0.28;
            washMat.opacity = 0.14;
            for (let i = 0; i < LOOP_ORDER.length; i += 1) {
              const id = LOOP_ORDER[i];
              const isNeighbor =
                id === chapter ||
                LOOP_ORDER[(i + LOOP_ORDER.length - 1) % LOOP_ORDER.length] ===
                  chapter ||
                LOOP_ORDER[(i + 1) % LOOP_ORDER.length] === chapter;
              neighborMats[i].opacity = isNeighbor ? 0.7 : 0;
            }
          } else {
            strokeMat.opacity = 0.7;
            washMat.opacity = 0.48 + Math.sin(t * 0.85) * 0.08;
            for (const mat of neighborMats) {
              mat.opacity = 0;
            }
          }

          for (const line of contextLines) {
            const mat = line.material as THREE.LineBasicMaterial;
            mat.opacity = hover ? 0.38 : 0.24;
          }

          const shipLabel = labelSprites.get('ship');
          if (shipLabel) {
            const labelMat = shipLabel.material as THREE.SpriteMaterial;
            labelMat.opacity = twitch
              ? 0.7 + Math.sin(t * 10) * 0.3
              : 1;
            const base = 1.05;
            shipLabel.scale.set(
              twitch ? base * (1 + Math.sin(t * 10) * 0.06) : base,
              twitch ? 0.26 * (1 + Math.sin(t * 10) * 0.06) : 0.26,
              1,
            );
          }

          rain.rotation.y = t * 0.018;
          rain.rotation.x = Math.sin(t * 0.05) * 0.03;

          // Re-check after work — cleanup may have run mid-frame.
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
        // Soft dispose on remount — avoid forceContextLoss poisoning iOS slots.
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

  // Host stays free of React children so reconciliation never removes the
  // imperatively mounted <canvas>. Soft-fail is designed empty + retry.
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
