"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { SkeletonModel } from "../Skeleton";

const HEADSTONE_SIZE: [number, number, number] = [0.4, 0.6, 0.1];
const DIRT_PATCH_SIZE: [number, number] = [0.4, 0.6];

export function Grave({
  position,
  rotation,
  tiltX,
  tiltZ,
  hasSkeleton,
  skelRotX,
  skelRotY,
  skelPosY,
  skelScale,
  skelTint,
}: {
  position: [number, number, number];
  rotation: number;
  tiltX: number;
  tiltZ: number;
  hasSkeleton?: boolean;
  skelRotX?: number;
  skelRotY?: number;
  skelPosY?: number;
  skelScale?: number;
  skelTint?: string;
}) {
  const [diffMap, norMap, armMap] = useLoader(TextureLoader, [
    "/textures/grave/diff.jpg",
    "/textures/grave/nor.jpg",
    "/textures/grave/arm.jpg",
  ]);

  return (
    <group position={position} rotation={[tiltX, rotation, tiltZ]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={HEADSTONE_SIZE} />
        <meshStandardMaterial
          map={diffMap}
          normalMap={norMap}
          aoMap={armMap}
          roughnessMap={armMap}
          metalnessMap={armMap}
          aoMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, 0.05, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={DIRT_PATCH_SIZE} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      {hasSkeleton && (
        <SkeletonModel
          rotX={skelRotX}
          rotY={skelRotY}
          posY={skelPosY}
          scale={skelScale}
          tint={skelTint}
        />
      )}
    </group>
  );
}
