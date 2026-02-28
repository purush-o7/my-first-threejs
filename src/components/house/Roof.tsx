"use client";

import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { TextureLoader, RepeatWrapping } from "three";

const ROOF_POSITION: [number, number, number] = [0, 2.75, 0];
const ROOF_ROTATION: [number, number, number] = [0, Math.PI / 4, 0];
const ROOF_RADIUS = 2.5;
const ROOF_HEIGHT = 1.5;
const TEXTURE_REPEAT: [number, number] = [4, 2];

export function Roof() {
  const { radialSegments, heightSegments, displacementScale } = useControls(
    "Roof",
    {
      radialSegments: { value: 32, min: 4, max: 64, step: 4 },
      heightSegments: { value: 4, min: 1, max: 32, step: 1 },
      displacementScale: { value: 0, min: 0, max: 0.5, step: 0.01 },
    },
    { collapsed: true },
  );

  const [diffMap, norMap, armMap] = useLoader(TextureLoader, [
    "/textures/roof/diff.jpg",
    "/textures/roof/nor.jpg",
    "/textures/roof/arm.jpg",
  ]);

  [diffMap, norMap, armMap].forEach((t) => {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(...TEXTURE_REPEAT);
  });

  return (
    <mesh position={ROOF_POSITION} rotation={ROOF_ROTATION} castShadow receiveShadow>
      <coneGeometry args={[ROOF_RADIUS, ROOF_HEIGHT, radialSegments, heightSegments]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        aoMap={armMap}
        roughnessMap={armMap}
        metalnessMap={armMap}
        displacementMap={diffMap}
        displacementScale={displacementScale}
        aoMapIntensity={1}
      />
    </mesh>
  );
}
