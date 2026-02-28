"use client";

import { useLoader } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { TextureLoader } from "three";
import { BUSH_POSITIONS } from "@/lib/constants";

const BUSH_RADIUS = 0.35;
const BUSH_SEGMENTS = 16;

export function GardenBushes() {
  const [diffMap, norMap, roughMap] = useLoader(TextureLoader, [
    "/textures/bush/diff.jpg",
    "/textures/bush/nor.jpg",
    "/textures/bush/rough.jpg",
  ]);

  return (
    <Instances limit={BUSH_POSITIONS.length} castShadow receiveShadow>
      <sphereGeometry args={[BUSH_RADIUS, BUSH_SEGMENTS, BUSH_SEGMENTS]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        roughnessMap={roughMap}
      />
      {BUSH_POSITIONS.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
}
