"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useMemo } from "react";

function WallPanel({
  position,
  rotation,
  width,
  height,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}) {
  const [diffMap, norMap, roughMap] = useLoader(TextureLoader, [
    "/textures/wall/diff.jpg",
    "/textures/wall/nor.jpg",
    "/textures/wall/rough.jpg",
  ]);

  const textures = useMemo(() => {
    return [diffMap, norMap, roughMap].map((t) => {
      const c = t.clone();
      c.wrapS = RepeatWrapping;
      c.wrapT = RepeatWrapping;
      c.repeat.set(width, height);
      c.needsUpdate = true;
      return c;
    });
  }, [diffMap, norMap, roughMap, width, height]);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={textures[0]}
        normalMap={textures[1]}
        roughnessMap={textures[2]}
        aoMap={textures[2]}
        aoMapIntensity={0.8}
      />
    </mesh>
  );
}

const WALL_SIZE = 3;
const WALL_HEIGHT = 2;
const WALL_OFFSET = 1.5;
const WALL_Y = 1;

export function Walls() {
  return (
    <group>
      <WallPanel position={[0, WALL_Y, WALL_OFFSET]} rotation={[0, 0, 0]} width={WALL_SIZE} height={WALL_HEIGHT} />
      <WallPanel position={[0, WALL_Y, -WALL_OFFSET]} rotation={[0, Math.PI, 0]} width={WALL_SIZE} height={WALL_HEIGHT} />
      <WallPanel position={[-WALL_OFFSET, WALL_Y, 0]} rotation={[0, -Math.PI / 2, 0]} width={WALL_SIZE} height={WALL_HEIGHT} />
      <WallPanel position={[WALL_OFFSET, WALL_Y, 0]} rotation={[0, Math.PI / 2, 0]} width={WALL_SIZE} height={WALL_HEIGHT} />
    </group>
  );
}
