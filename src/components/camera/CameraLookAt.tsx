"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRef, useMemo } from "react";
import { CAMERA_LOOK_TARGET, INTRO_DURATION_S } from "@/lib/constants";

export function CameraLookAt({
  started,
  onComplete,
}: {
  started: boolean;
  onComplete: () => void;
}) {
  const { camera } = useThree();
  const target = useMemo(
    () => new Vector3(...CAMERA_LOOK_TARGET),
    [],
  );
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    // Before click: hold camera behind the house, high up
    if (!started) {
      camera.position.set(0, 6, -10);
      camera.lookAt(target);
      return;
    }

    // After click: drone shot - sweep from behind the house around to the front door
    elapsed.current += delta;
    const t = Math.min(elapsed.current / INTRO_DURATION_S, 1);
    const eased = 1 - Math.pow(1 - t, 3);

    // Arc from behind (-Z) around to front-right (+Z)
    const angle = Math.PI * (1 - eased) + 0.4 * eased;
    const radius = 10 - eased * 4;
    const height = 6 - eased * 3;

    camera.position.set(
      Math.sin(angle) * radius,
      height,
      Math.cos(angle) * radius,
    );
    camera.lookAt(target);

    if (t >= 1) {
      onComplete();
    }
  });

  return null;
}
