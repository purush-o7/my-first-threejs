"use client";

/*
Author: HotstrikeStudio (https://sketchfab.com/HotstrikeStudio)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/free-stylized-dark-fantasy-skeleton-v1-13b75487badc4c54a6e1644376fe6900
*/

import * as THREE from "three";
import React from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useControls } from "leva";

// Single shared material for all skeletons
let sharedMaterial: THREE.MeshStandardMaterial | null = null;

type GLTFResult = GLTF & {
  nodes: {
    Object_6: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    Skeleton_Normal: THREE.MeshBasicMaterial;
  };
};

// Single debug panel shared by all skeletons
export function useSkeletonDebug() {
  return useControls("Skeleton", {
    posY: { value: -0.91, min: -3, max: 3, step: 0.05 },
    posZ: { value: -0.05, min: -2, max: 2, step: 0.05 },
    rotX: { value: 0.2, min: -Math.PI, max: Math.PI, step: 0.05 },
    scale: { value: 0.75, min: 0.05, max: 2, step: 0.05 },
    color: "#d4c9a8",
    roughness: { value: 0.9, min: 0, max: 1, step: 0.05 },
    metalness: { value: 0.1, min: 0, max: 1, step: 0.05 },
  }, { collapsed: true });
}

interface SkeletonProps {
  posY?: number;
  rotX?: number;
  rotY?: number;
  scale?: number;
  debug?: ReturnType<typeof useSkeletonDebug>;
}

export function SkeletonModel({ posY = -0.91, rotX = 0.2, rotY = 0, scale = 0.75, debug }: SkeletonProps) {
  const { scene } = useGLTF("/models/skeleton/scene.gltf");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;

  const material = React.useMemo(() => {
    if (sharedMaterial) return sharedMaterial;

    const originalMap = (materials.Skeleton_Normal as any).map;
    sharedMaterial = new THREE.MeshStandardMaterial({
      map: originalMap,
      color: new THREE.Color("#d4c9a8"),
      roughness: 0.9,
      metalness: 0.1,
    });
    return sharedMaterial;
  }, [materials]);

  // Apply debug overrides to shared material
  React.useEffect(() => {
    if (debug && sharedMaterial) {
      sharedMaterial.color.set(debug.color);
      sharedMaterial.roughness = debug.roughness;
      sharedMaterial.metalness = debug.metalness;
    }
  }, [debug?.color, debug?.roughness, debug?.metalness]);

  const finalPosY = debug ? debug.posY : posY;
  const finalPosZ = debug ? debug.posZ : -0.05;
  const finalRotX = debug ? debug.rotX : rotX;
  const finalScale = debug ? debug.scale : scale;

  return (
    <group
      dispose={null}
      position={[0, finalPosY, finalPosZ]}
      rotation={[finalRotX, rotY, 0]}
      scale={finalScale}
    >
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        geometry={nodes.Object_6.geometry}
        material={material}
        skeleton={nodes.Object_6.skeleton}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("/models/skeleton/scene.gltf");
