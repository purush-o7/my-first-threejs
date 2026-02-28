"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats, Sky } from "@react-three/drei";
import { useControls, button } from "leva";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { HalfFloatType, UnsignedByteType } from "three";
import { useState, useRef } from "react";
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

const SUN_POSITION: [number, number, number] = [0, -0.15, -1];

function RendererInfo() {
  const { gl } = useThree();
  const frameCount = useRef(0);

  const [, set] = useControls("Renderer Info", () => ({
    drawCalls: { value: "0", editable: false },
    triangles: { value: "0", editable: false },
    textures: { value: "0", editable: false },
    geometries: { value: "0", editable: false },
    programs: { value: "0", editable: false },
    logToConsole: button(() => {
      const info = gl.info;
      console.log("=== Three.js Renderer Info ===");
      console.log("Draw calls:", info.render.calls);
      console.log("Triangles:", info.render.triangles);
      console.log("Points:", info.render.points);
      console.log("Lines:", info.render.lines);
      console.log("Textures:", info.memory.textures);
      console.log("Geometries:", info.memory.geometries);
      console.log("Programs:", info.programs?.length ?? "N/A");
      console.log("==============================");
    }),
  }), { collapsed: true });

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 30 === 0) {
      const info = gl.info;
      set({
        drawCalls: String(info.render.calls),
        triangles: String(info.render.triangles),
        textures: String(info.memory.textures),
        geometries: String(info.memory.geometries),
        programs: String(info.programs?.length ?? "N/A"),
      });
    }
  });

  return null;
}

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
      <RendererInfo />

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

      <Sky
        sunPosition={SUN_POSITION}
        turbidity={10}
        rayleigh={0.1}
        mieCoefficient={0.1}
        mieDirectionalG={0.95}
      />

      <HauntedHouse />
      <Fireflies />

      <EffectComposer
        multisampling={isMobile ? 0 : 8}
        frameBufferType={isMobile ? UnsignedByteType : HalfFloatType}
      >
        <Bloom
          intensity={isMobile ? 0.3 : BLOOM_INTENSITY}
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
