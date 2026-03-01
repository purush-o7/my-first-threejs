"use client";

import { useControls } from "leva";

export function useGhostLightDebug() {
  return useControls("Ghost Lights", {
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
    radius: { value: 1, min: 0.2, max: 3, step: 0.1 },
    height: { value: 1, min: 0.5, max: 3, step: 0.1 },
    bobAmount: { value: 0.5, min: 0, max: 2, step: 0.1 },
    intensity: { value: 4, min: 0, max: 15, step: 0.5 },
    distance: { value: 7, min: 1, max: 15, step: 0.5 },
  }, { collapsed: true });
}

export function useFabricGhostDebug() {
  return useControls("Fabric Ghosts", {
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
    radius: { value: 1, min: 0.2, max: 3, step: 0.1 },
    height: { value: 1, min: 0.5, max: 3, step: 0.1 },
    wobbleX: { value: 0.8, min: 0, max: 3, step: 0.1 },
    wobbleZ: { value: 0.8, min: 0, max: 3, step: 0.1 },
    bobAmount: { value: 0.2, min: 0, max: 1, step: 0.05 },
    sway: { value: 0.12, min: 0, max: 0.5, step: 0.02 },
    lightIntensity: { value: 6, min: 0, max: 15, step: 0.5 },
    lightDistance: { value: 7, min: 1, max: 15, step: 0.5 },
    opacity: { value: 0.35, min: 0, max: 1, step: 0.05 },
    emissiveIntensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
  }, { collapsed: true });
}
