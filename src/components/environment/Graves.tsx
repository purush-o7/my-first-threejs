"use client";

import { useMemo } from "react";
import { Grave } from "./Grave";
import { isMobile } from "@/lib/device";
import {
  GRAVE_COUNT,
  GRAVE_MIN_DISTANCE,
  GRAVE_MAX_ATTEMPTS,
  SKELETON_TINTS,
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
  skelTint: string;
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
    const skelTint =
      SKELETON_TINTS[
        Math.floor(seededRandom(seed * 97 + idx * 59) * SKELETON_TINTS.length)
      ];

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
      skelTint,
    });
  }

  return result;
}

export function Graves() {
  const graves = useMemo(generateGraves, []);

  return (
    <group>
      {graves.map((g, i) => (
        <Grave
          key={i}
          position={g.pos}
          rotation={g.rot}
          tiltX={g.tiltX}
          tiltZ={g.tiltZ}
          hasSkeleton={g.hasSkeleton}
          skelRotX={g.skelRotX}
          skelRotY={g.skelRotY}
          skelPosY={g.skelPosY}
          skelScale={g.skelScale}
          skelTint={g.skelTint}
        />
      ))}
    </group>
  );
}
