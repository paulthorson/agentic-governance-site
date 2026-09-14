'use client';

import {useEffect, useRef} from 'react';
import * as THREE from 'three';
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

const NODES: NodeDef[] = [
  {id: 'research', label: 'Research', position: [-1.6, 0.9, 0.2], kind: 'loop', chapter: 'research'},
  {id: 'brief', label: 'Brief', position: [0.2, 1.35, -0.15], kind: 'loop', chapter: 'brief'},
  {id: 'stills', label: 'Stills', position: [1.7, 0.55, 0.35], kind: 'loop', chapter: 'stills'},
  {id: 'challenge', label: 'Challenge', position: [1.35, -0.75, -0.25], kind: 'loop', chapter: 'challenge'},
  {id: 'ship', label: 'Ship', position: [-0.15, -1.25, 0.2], kind: 'loop', chapter: 'ship'},
  {id: 'recap', label: 'Recap', position: [-1.55, -0.45, -0.3], kind: 'loop', chapter: 'recap'},
  {id: 'next', label: 'Next', position: [-2.35, 0.2, 0.55], kind: 'context', chapter: 'next'},
  {id: 'design', label: 'Design', position: [2.3, 0.1, -0.7], kind: 'context'},
  {id: 'product', label: 'Product', position: [0.9, 2.0, 0.6], kind: 'context'},
  {id: 'lead', label: 'Lead', position: [-0.8, 2.05, -0.55], kind: 'context'},
  {id: 'build', label: 'Build', position: [2.1, -1.3, 0.45], kind: 'context'},
  {id: 'p01', label: 'P-01', position: [-2.6, 1.4, -0.8], kind: 'code'},
  {id: 'p02', label: 'P-02', position: [-2.8, -1.1, 0.3], kind: 'code'},
  {id: 'p03', label: 'P-03', position: [0.4, -2.1, -0.7], kind: 'code'},
  {id: 'p04', label: 'P-04', position: [2.7, 1.5, 0.2], kind: 'code'},
  {id: 'p05', label: 'P-05', position: [2.55, -0.4, 0.9], kind: 'code'},
  {id: 'p06', label: 'P-06', position: [-0.5, 0.2, -1.4], kind: 'code'},
  {id: 'p07', label: 'P-07', position: [1.0, -0.2, 1.35], kind: 'code'},
];

const CONTEXT_EDGES: Array<[string, string]> = [
  ['research', 'lead'],
  ['research', 'p01'],
  ['brief', 'product'],
  ['brief', 'design'],
  ['stills', 'design'],
  ['stills', 'p04'],
  ['challenge', 'build'],
  ['challenge', 'p05'],
  ['ship', 'build'],
  ['ship', 'p03'],
  ['recap', 'next'],
  ['recap', 'p02'],
  ['next', 'p01'],
  ['design', 'p07'],
  ['product', 'p06'],
  ['lead', 'p06'],
  ['build', 'p07'],
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
  ctx.fillStyle = emphasis ? 'rgba(242,241,236,0.92)' : 'rgba(138,154,142,0.45)';
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

  stateRef.current = {mode, activeChapter, shipTwitch};

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const width = host.clientWidth || 640;
    const height = host.clientHeight || 640;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(VOID, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0.35, 0.2, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(VOID, 0);
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Atmosphere rain codes (≤10% gray)
    const rain = new THREE.Group();
    const rainMat = new THREE.MeshBasicMaterial({
      color: 0x6a736c,
      transparent: true,
      opacity: 0.08,
    });
    for (let i = 0; i < 36; i += 1) {
      const geo = new THREE.PlaneGeometry(0.08, 0.02);
      const mesh = new THREE.Mesh(geo, rainMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 3,
      );
      rain.add(mesh);
    }
    scene.add(rain);

    const nodeMap = new Map<string, THREE.Vector3>();
    const nodeMeshes = new Map<string, THREE.Mesh>();
    const labelSprites = new Map<string, THREE.Sprite>();

    for (const node of NODES) {
      const pos = new THREE.Vector3(...node.position);
      nodeMap.set(node.id, pos);

      const isLoop = node.kind === 'loop';
      const geo = new THREE.SphereGeometry(isLoop ? 0.055 : 0.032, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: isLoop ? SAGE : SAGE_DIM,
        transparent: true,
        opacity: isLoop ? 0.95 : 0.35,
        wireframe: false,
      });
      // Hollow ring look: slightly larger translucent shell
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(isLoop ? 0.05 : 0.028, isLoop ? 0.07 : 0.04, 24),
        new THREE.MeshBasicMaterial({
          color: isLoop ? 0xd8ddd6 : SAGE_DIM,
          transparent: true,
          opacity: isLoop ? 0.85 : 0.28,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(pos);
      root.add(ring);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(0.35);
      root.add(mesh);
      nodeMeshes.set(node.id, mesh);

      const spriteMat = new THREE.SpriteMaterial({
        map: makeLabelTexture(node.label, isLoop),
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos).add(new THREE.Vector3(0, isLoop ? 0.18 : 0.12, 0));
      sprite.scale.set(isLoop ? 1.1 : 0.75, isLoop ? 0.28 : 0.2, 1);
      root.add(sprite);
      labelSprites.set(node.id, sprite);
    }

    const loopEdges: Array<[string, string]> = [];
    for (let i = 0; i < LOOP_ORDER.length; i += 1) {
      const a = LOOP_ORDER[i];
      const b = LOOP_ORDER[(i + 1) % LOOP_ORDER.length];
      loopEdges.push([a, b]);
    }

    const contextLines: THREE.Line[] = [];
    for (const [a, b] of CONTEXT_EDGES) {
      const pa = nodeMap.get(a);
      const pb = nodeMap.get(b);
      if (!pa || !pb) continue;
      const geo = new THREE.BufferGeometry().setFromPoints([pa, pb]);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: SAGE_DIM,
          transparent: true,
          opacity: 0.22,
        }),
      );
      root.add(line);
      contextLines.push(line);
    }

    // Active path: outer sage stroke + inner white wash (inside stroke only)
    const washLines: THREE.Line[] = [];
    const pathStrokes: THREE.Mesh[] = [];
    for (const [a, b] of loopEdges) {
      const pa = nodeMap.get(a);
      const pb = nodeMap.get(b);
      if (!pa || !pb) continue;

      const curve = new THREE.LineCurve3(pa, pb);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 12, 0.018, 8, false),
        new THREE.MeshBasicMaterial({
          color: SAGE,
          transparent: true,
          opacity: 0.55,
        }),
      );
      root.add(tube);
      pathStrokes.push(tube);

      const wash = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([pa, pb]),
        new THREE.LineBasicMaterial({
          color: WASH,
          transparent: true,
          opacity: 0.55,
        }),
      );
      root.add(wash);
      washLines.push(wash);
    }

    const shipMesh = nodeMeshes.get('ship');

    let frame = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      if (!host) return;
      const w = host.clientWidth || 640;
      const h = host.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const {mode: m, activeChapter: chapter, shipTwitch: twitch} =
        stateRef.current;

      // Continuous slight drift (alive instrument)
      root.rotation.y = Math.sin(t * 0.12) * 0.18 + 0.35;
      root.rotation.x = Math.sin(t * 0.09) * 0.08 + 0.12;
      root.position.y = Math.sin(t * 0.15) * 0.06;
      root.position.x = Math.cos(t * 0.11) * 0.05;

      const inspect = m === 'inspect';
      const hover = m === 'hover' || inspect;
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        inspect ? 4.4 : hover ? 5.4 : 6.2,
        0.04,
      );
      if (chapter && hover) {
        const focus = nodeMap.get(chapter);
        if (focus) {
          camera.lookAt(
            focus.x * 0.35,
            focus.y * 0.35,
            focus.z * 0.35,
          );
        }
      } else {
        camera.lookAt(0, 0, 0);
      }

      // Neighborhood emphasis: lift active chapter edges
      for (let i = 0; i < LOOP_ORDER.length; i += 1) {
        const id = LOOP_ORDER[i];
        const stroke = pathStrokes[i];
        const wash = washLines[i];
        const isNeighbor =
          !chapter ||
          id === chapter ||
          LOOP_ORDER[(i + LOOP_ORDER.length - 1) % LOOP_ORDER.length] ===
            chapter ||
          LOOP_ORDER[(i + 1) % LOOP_ORDER.length] === chapter;
        const strokeMat = stroke.material as THREE.MeshBasicMaterial;
        const washMat = wash.material as THREE.LineBasicMaterial;
        if (hover && chapter) {
          strokeMat.opacity = isNeighbor ? 0.75 : 0.18;
          washMat.opacity = isNeighbor ? 0.7 : 0.12;
        } else {
          strokeMat.opacity = 0.55;
          washMat.opacity = 0.5 + Math.sin(t * 0.8 + i) * 0.05;
        }
      }

      for (const line of contextLines) {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = hover ? 0.35 : 0.2;
      }

      // Ship mark twitch on measured ship toast — no beads
      if (shipMesh && twitch) {
        const pulse = 1 + Math.sin(t * 10) * 0.12;
        shipMesh.scale.setScalar(0.35 * pulse);
      } else if (shipMesh) {
        shipMesh.scale.setScalar(0.35);
      }

      rain.rotation.y = t * 0.02;
      frame += 1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else {
            mat.dispose();
          }
        }
        if (obj instanceof THREE.Sprite) {
          const map = obj.material.map;
          map?.dispose();
          obj.material.dispose();
        }
      });
      void frame;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'var(--ag-instrument-min-h)',
        position: 'relative',
      }}
    />
  );
}
