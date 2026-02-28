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

interface SkeletonProps {
  posY?: number;
  rotX?: number;
  rotY?: number;
  scale?: number;
}

export function SkeletonModel({ posY = -0.91, rotX = 0.2, rotY = 0, scale = 0.75 }: SkeletonProps) {
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

  return (
    <group
      dispose={null}
      position={[0, posY, -0.05]}
      rotation={[rotX, rotY, 0]}
      scale={scale}
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
