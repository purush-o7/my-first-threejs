"use client";

import { Sparkles } from "@react-three/drei";

export function Fireflies() {
  return (
    <Sparkles
      count={40}
      size={3}
      speed={0.3}
      opacity={0.7}
      color="#ffdd44"
      scale={[10, 5, 10]}
      noise={[0.5, 0.3, 0.5]}
      position={[0, 1, 0]}
    />
  );
}
