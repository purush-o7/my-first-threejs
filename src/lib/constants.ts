// Timing
export const LOADER_FADE_MS = 800;
export const HINT_FADE_DELAY_MS = 3000;

// Camera
export const CAMERA_INITIAL_POSITION: [number, number, number] = [0, 6, -10];
export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.5;
export const CAMERA_FAR = 100;
export const CAMERA_LOOK_TARGET: [number, number, number] = [0, 1.5, 0];
export const INTRO_DURATION_S = 5;

// OrbitControls
export const ORBIT_MIN_POLAR = Math.PI / 3;
export const ORBIT_MAX_POLAR = Math.PI / 2.2;
export const ORBIT_MIN_DISTANCE = 5;
export const ORBIT_MAX_DISTANCE = 12;

// Scene
export const SCENE_BG_COLOR = "#0a0a1a";

// Post-processing
export const BLOOM_INTENSITY = 0.5;
export const BLOOM_THRESHOLD = 0.8;
export const BLOOM_SMOOTHING = 0.9;

// Graves
export const GRAVE_COUNT = 30;
export const GRAVE_MIN_DISTANCE = 0.8;
export const GRAVE_MAX_ATTEMPTS = 500;
export const SKELETON_TINTS = [
  "#d4c9a8", "#8a9a6b", "#a0a0a0", "#8b7355",
  "#c8bfa9", "#6b7a5a", "#b5a68a", "#9e9e8e",
];

// Ghost configs - simple point light ghosts (cheap)
export const GHOST_CONFIGS = [
  { color: "#8800ff", speed: 0.5, radius: 4, height: 1.5 },
  { color: "#00ffaa", speed: 0.3, radius: 5, height: 2 },
  { color: "#ff00aa", speed: 0.4, radius: 3.5, height: 1 },
];

// Fabric ghosts - cloth-animated with per-frame vertex normals
export const FABRIC_GHOST_CONFIGS = [
  { radius: 3.5, speed: 0.35, height: 1.2, orbitOffset: 0, glowColor: "#00ffcc" },
  { radius: 4.5, speed: 0.25, height: 1.5, orbitOffset: Math.PI * 0.66, glowColor: "#aa44ff" },
  { radius: 3, speed: 0.45, height: 1, orbitOffset: Math.PI * 1.33, glowColor: "#ff4466" },
];

// Bush positions
export const BUSH_POSITIONS: [number, number, number][] = [
  [-0.8, 0.15, 1.5],
  [0.8, 0.15, 1.5],
  [-0.5, 0.15, 2],
  [0.5, 0.15, 2],
];
