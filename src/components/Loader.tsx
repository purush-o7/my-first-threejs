"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function Ring({ color, radius, speed }: {
  color: string;
  radius: number;
  speed: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.x = t * speed[0];
      meshRef.current.rotation.y = t * speed[1];
      meshRef.current.rotation.z = t * speed[2];
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function Loader() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center grain">
      <div className="w-28 h-28 animate-ringPulse">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <Ring color="#00ffcc" radius={0.8} speed={[1.2, 0.8, 0]} />
          <Ring color="#aa44ff" radius={1.0} speed={[-0.6, 0, 1.4]} />
          <Ring color="#ff4466" radius={0.6} speed={[0, 1.5, -0.7]} />
        </Canvas>
      </div>
      <p
        className="text-xs tracking-[0.3em] uppercase mt-4"
        style={{ color: "var(--bone-yellow)", fontFamily: "var(--font-display)" }}
      >
        Summoning...
      </p>
    </div>
  );
}
