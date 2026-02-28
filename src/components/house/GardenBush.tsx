"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const BUSH_RADIUS = 0.35;
const BUSH_SEGMENTS = 16;

export function GardenBush({ position }: { position: [number, number, number] }) {
  const [diffMap, norMap, roughMap] = useLoader(TextureLoader, [
    "/textures/bush/diff.jpg",
    "/textures/bush/nor.jpg",
    "/textures/bush/rough.jpg",
  ]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[BUSH_RADIUS, BUSH_SEGMENTS, BUSH_SEGMENTS]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        roughnessMap={roughMap}
      />
    </mesh>
  );
}
