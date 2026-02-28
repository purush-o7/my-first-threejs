# The Haunted House

My first Three.js project — an interactive 3D haunted house scene built with Next.js and React Three Fiber.

## Features

- Textured haunted house with PBR materials (walls, roof, door with diffuse, normal, AO, roughness, displacement maps)
- 30 procedurally placed gravestones with rock textures and collision avoidance
- Skeleton models (GLTF) draped over graves with randomized position, rotation, scale, and bone tints
- 3 ghost lights orbiting the house
- 3 fabric ghosts with real-time vertex-animated cloth deformation
- Firefly particles with bloom post-processing
- Cinematic drone-shot camera intro
- 3D ring loader that waits for the scene to actually render
- Click-to-start overlay
- Leva debug panel for real-time tweaking of lighting, ground, roof, and skeleton properties
- Stars night sky
- Next.js Proxy to redirect unknown routes

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (R3F)
- [Drei](https://github.com/pmndrs/drei) (OrbitControls, Stars, Sparkles, useGLTF)
- [Three.js](https://threejs.org)
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) (Bloom)
- [Leva](https://github.com/pmndrs/leva) (Debug controls)
- [gltfjsx](https://github.com/pmndrs/gltfjsx) (GLTF to JSX component generation)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## R3F Development Notes

Two config changes for smooth Three.js development in Next.js:

### `reactStrictMode: false`

React Strict Mode double-mounts components in dev. For R3F, this kills the WebGL context twice on every render. Disabling it prevents this. No effect in production.

### `next dev --webpack`

Next.js 16 uses Turbopack by default, but Turbopack's HMR can trigger full page reloads that destroy the WebGL canvas. Webpack's HMR keeps the Canvas alive during hot reloads.

## What I Learned

- Three.js fundamentals: scenes, cameras, renderers, geometries, materials, lights
- PBR texture workflow: diffuse, normal, AO, roughness, metalness, displacement maps
- Loading and cloning GLTF models with SkeletonUtils
- Real-time vertex animation for cloth simulation
- Post-processing effects (bloom)
- Procedural placement with collision detection
- WebGL context management in Next.js
- Seeded randomization for deterministic scene generation

## License

MIT
