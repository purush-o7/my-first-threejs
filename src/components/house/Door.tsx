"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const DOOR_POSITION: [number, number, number] = [0, 0.85, 1.55];
const DOOR_WIDTH = 1;
const DOOR_HEIGHT = 1.7;
const DOOR_SEGMENTS = 32;

export function Door() {
  const [diffMap, norMap, aoMap, roughMap, metalMap, dispMap, alphaMap] =
    useLoader(TextureLoader, [
      "/textures/door/diff.jpg",
      "/textures/door/nor.jpg",
      "/textures/door/ao.jpg",
      "/textures/door/rough.jpg",
      "/textures/door/metal.jpg",
      "/textures/door/disp.png",
      "/textures/door/alpha.jpg",
    ]);

  return (
    <mesh position={DOOR_POSITION} castShadow>
      <planeGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_SEGMENTS, DOOR_SEGMENTS]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        aoMap={aoMap}
        aoMapIntensity={1}
        roughnessMap={roughMap}
        metalnessMap={metalMap}
        displacementMap={dispMap}
        displacementScale={0.15}
        roughness={1}
        alphaMap={alphaMap}
        transparent
      />
    </mesh>
  );
}
