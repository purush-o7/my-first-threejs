"use client";

import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { TextureLoader, RepeatWrapping } from "three";

const GROUND_SIZE = 12;
const GROUND_TEXTURE_REPEAT = 3;
const GROUND_POSITION: [number, number, number] = [0, 0, 0];
const GROUND_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

export function Ground() {
  const { displacementScale, segments } = useControls(
    "Ground",
    {
      displacementScale: { value: 0.3, min: 0, max: 1, step: 0.05 },
      segments: { value: 16, min: 8, max: 128, step: 8 },
    },
    { collapsed: true },
  );

  const [diffMap, norMap, roughMap, dispMap] = useLoader(TextureLoader, [
    "/textures/ground/diff.jpg",
    "/textures/ground/nor.jpg",
    "/textures/ground/rough.jpg",
    "/textures/ground/diff.jpg",
  ]);

  [diffMap, norMap, roughMap].forEach((t) => {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(GROUND_TEXTURE_REPEAT, GROUND_TEXTURE_REPEAT);
  });

  return (
    <mesh rotation={GROUND_ROTATION} position={GROUND_POSITION} receiveShadow>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE, segments, segments]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        roughnessMap={roughMap}
        displacementMap={dispMap}
        displacementScale={displacementScale}
      />
    </mesh>
  );
}
