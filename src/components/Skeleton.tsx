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

type GLTFResult = GLTF & {
  nodes: {
    Object_6: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    Skeleton_Normal: THREE.MeshBasicMaterial;
  };
};

interface SkeletonProps {
  posY?: number;
  rotX?: number;
  rotY?: number;
  scale?: number;
  tint?: string;
}

export function SkeletonModel({ posY = -0.91, rotX = 0.2, rotY = 0, scale = 0.75, tint = "#d4c9a8" }: SkeletonProps) {
  const { scene } = useGLTF("/models/skeleton/scene.gltf");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;

  const tintedMaterial = React.useMemo(() => {
    const originalMap = (materials.Skeleton_Normal as any).map;
    const mat = new THREE.MeshStandardMaterial({
      map: originalMap,
      color: new THREE.Color(tint),
      roughness: 0.9,
      metalness: 0.1,
    });
    return mat;
  }, [materials, tint]);

  const debug = useControls("Skeleton Debug", {
    posY: { value: posY, min: -3, max: 3, step: 0.05 },
    posZ: { value: -0.05, min: -2, max: 2, step: 0.05 },
    rotX: { value: rotX, min: -Math.PI, max: Math.PI, step: 0.05 },
    rotY: { value: rotY, min: -Math.PI, max: Math.PI, step: 0.05 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.05 },
    scale: { value: scale, min: 0.05, max: 2, step: 0.05 },
  }, { collapsed: true });

  return (
    <group
      dispose={null}
      position={[0, debug.posY, debug.posZ]}
      rotation={[debug.rotX, debug.rotY, debug.rotZ]}
      scale={debug.scale}
    >
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        geometry={nodes.Object_6.geometry}
        material={tintedMaterial}
        skeleton={nodes.Object_6.skeleton}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("/models/skeleton/scene.gltf");
