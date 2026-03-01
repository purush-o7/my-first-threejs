"use client";

import { useMemo, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { TextureLoader } from "three";
import type { PointLight } from "three";
import { SkeletonModel, useSkeletonDebug } from "../Skeleton";
import { useControls } from "leva";
import { isMobile } from "@/lib/device";
import {
  GRAVE_COUNT,
  GRAVE_MIN_DISTANCE,
  GRAVE_MAX_ATTEMPTS,
} from "@/lib/constants";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface GraveData {
  pos: [number, number, number];
  rot: number;
  tiltX: number;
  tiltZ: number;
  hasSkeleton: boolean;
  skelRotX: number;
  skelRotY: number;
  skelPosY: number;
  skelScale: number;
}

function generateGraves(): GraveData[] {
  const placed: { x: number; z: number }[] = [];

  function isTooClose(x: number, z: number) {
    return placed.some((p) => {
      const dx = p.x - x;
      const dz = p.z - z;
      return Math.sqrt(dx * dx + dz * dz) < GRAVE_MIN_DISTANCE;
    });
  }

  function isInFrontOfHouse(x: number, z: number) {
    return x > -2 && x < 2 && z > 0 && z < 3.5;
  }

  function isInsideHouse(x: number, z: number) {
    return x > -1.8 && x < 1.8 && z > -1.8 && z < 1.8;
  }

  const result: GraveData[] = [];
  let attempts = 0;
  let seed = 0;
  const skeletonThreshold = isMobile ? 0.85 : 0.5;

  while (result.length < GRAVE_COUNT && attempts < GRAVE_MAX_ATTEMPTS) {
    seed++;
    attempts++;
    const angle = seededRandom(seed * 13) * Math.PI * 2;
    const radius = 2.5 + seededRandom(seed * 7) * 3.5;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    if (isInFrontOfHouse(x, z) || isInsideHouse(x, z) || isTooClose(x, z)) {
      continue;
    }

    const rot = (seededRandom(seed * 31) - 0.5) * Math.PI * 2;
    const tiltX = (seededRandom(seed * 41) - 0.5) * 0.3;
    const tiltZ = (seededRandom(seed * 53) - 0.5) * 0.3;
    const hasSkeleton = seededRandom(seed * 67) > skeletonThreshold;
    const idx = result.length;
    const skelRotX = 0.2 + (seededRandom(seed * 71 + idx * 17) - 0.5) * 0.3;
    const skelRotY = (seededRandom(seed * 89 + idx * 23) - 0.5) * Math.PI * 2;
    const skelPosY = -0.91 + (seededRandom(seed * 79 + idx * 37) - 0.5) * 0.1;
    const skelScale = 0.75 + (seededRandom(seed * 83 + idx * 43) - 0.5) * 0.2;

    placed.push({ x, z });
    result.push({
      pos: [x, 0, z],
      rot,
      tiltX,
      tiltZ,
      hasSkeleton,
      skelRotX,
      skelRotY,
      skelPosY,
      skelScale,
    });
  }

  return result;
}

export function Graves() {
  const graves = useMemo(generateGraves, []);
  const skeletonDebug = useSkeletonDebug();

  const [diffMap, norMap, armMap] = useLoader(TextureLoader, [
    "/textures/grave/diff.jpg",
    "/textures/grave/nor.jpg",
    "/textures/grave/arm.jpg",
  ]);

  return (
    <group>
      {/* All 30 headstones — 1 draw call */}
      <Instances limit={GRAVE_COUNT} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial
          map={diffMap}
          normalMap={norMap}
          aoMap={armMap}
          roughnessMap={armMap}
          metalnessMap={armMap}
          aoMapIntensity={1}
        />
        {graves.map((g, i) => (
          <Instance
            key={i}
            position={[g.pos[0], g.pos[1] + 0.3, g.pos[2]]}
            rotation={[g.tiltX, g.rot, g.tiltZ]}
          />
        ))}
      </Instances>

      {/* All 30 dirt patches — 1 draw call */}
      <Instances limit={GRAVE_COUNT} receiveShadow>
        <planeGeometry args={[0.4, 0.6]} />
        <meshStandardMaterial color="#2a1a0a" />
        {graves.map((g, i) => (
          <Instance
            key={i}
            position={[g.pos[0], g.pos[1] + 0.05, g.pos[2] + 0.2]}
            rotation={[g.tiltX - Math.PI / 2, g.rot, g.tiltZ]}
          />
        ))}
      </Instances>

      {/* Skeletons — shared single yellow tint material */}
      {graves
        .filter((g) => g.hasSkeleton)
        .map((g, i) => (
          <group key={i} position={g.pos} rotation={[g.tiltX, g.rot, g.tiltZ]}>
            <SkeletonModel
              rotX={g.skelRotX}
              rotY={g.skelRotY}
              posY={g.skelPosY}
              scale={g.skelScale}
              debug={skeletonDebug}
            />
          </group>
        ))}

      {/* Pulsing grave glow — every 5th grave */}
      {graves
        .filter((_, i) => i % 5 === 0)
        .map((g, i) => (
          <GraveGlow key={i} position={g.pos} offset={i * 2.5} />
        ))}
    </group>
  );
}

function GraveGlow({ position, offset }: { position: [number, number, number]; offset: number }) {
  const lightRef = useRef<PointLight>(null);

  const { glowColor, maxIntensity, pulseSpeed } = useControls("Grave Glow", {
    glowColor: "#44ff88",
    maxIntensity: { value: 3, min: 0, max: 10, step: 0.5 },
    pulseSpeed: { value: 0.8, min: 0.1, max: 3, step: 0.1 },
  }, { collapsed: true });

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime * pulseSpeed + offset;
      // Sharp pulse: mostly off, brief glow
      const raw = Math.sin(t) * 0.5 + 0.5;
      const pulse = Math.pow(raw, 4); // sharpen the peak
      lightRef.current.intensity = pulse * maxIntensity;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[position[0], 0.1, position[2]]}
      color={glowColor}
      intensity={0}
      distance={3}
      decay={2}
    />
  );
}
