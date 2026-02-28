"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Stars } from "@react-three/drei";
import { useControls } from "leva";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { HalfFloatType } from "three";
import { useState } from "react";
import { isMobile } from "@/lib/device";
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_INITIAL_POSITION,
  CAMERA_LOOK_TARGET,
  SCENE_BG_COLOR,
  ORBIT_MIN_POLAR,
  ORBIT_MAX_POLAR,
  ORBIT_MIN_DISTANCE,
  ORBIT_MAX_DISTANCE,
  BLOOM_INTENSITY,
  BLOOM_THRESHOLD,
  BLOOM_SMOOTHING,
} from "@/lib/constants";
import { Lights } from "./environment/Lights";
import { Fireflies } from "./environment/Fireflies";
import { HauntedHouse } from "./HauntedHouse";
import { CameraLookAt } from "./camera/CameraLookAt";
import { ReadySignal } from "./camera/ReadySignal";

const STAR_COUNT = isMobile ? 1000 : 3000;

export default function Scene({
  started = false,
  onReady,
  onIntroComplete,
}: {
  started?: boolean;
  onReady?: () => void;
  onIntroComplete?: () => void;
}) {
  const [introComplete, setIntroComplete] = useState(false);
  const { showStats } = useControls("Debug", { showStats: false }, { collapsed: true });

  return (
    <Canvas
      shadows={isMobile ? false : "percentage"}
      camera={{
        position: CAMERA_INITIAL_POSITION,
        fov: CAMERA_FOV,
        near: CAMERA_NEAR,
        far: CAMERA_FAR,
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        powerPreference: "high-performance",
        antialias: !isMobile,
        alpha: false,
        stencil: false,
      }}
      fallback={
        <div className="flex h-screen items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      {showStats && <Stats />}

      {!introComplete && (
        <CameraLookAt
          started={started}
          onComplete={() => {
            setIntroComplete(true);
            onIntroComplete?.();
          }}
        />
      )}

      <color attach="background" args={[SCENE_BG_COLOR]} />
      <Lights />

      <Stars
        radius={50}
        depth={50}
        count={STAR_COUNT}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <HauntedHouse />
      <Fireflies />

      <EffectComposer
        multisampling={isMobile ? 0 : 8}
        frameBufferType={HalfFloatType}
      >
        <Bloom
          intensity={BLOOM_INTENSITY}
          luminanceThreshold={BLOOM_THRESHOLD}
          luminanceSmoothing={BLOOM_SMOOTHING}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        enabled={introComplete}
        enablePan={false}
        minPolarAngle={ORBIT_MIN_POLAR}
        maxPolarAngle={ORBIT_MAX_POLAR}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
        target={CAMERA_LOOK_TARGET}
      />

      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
