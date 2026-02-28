"use client";

import { Walls } from "./house/Walls";
import { Roof } from "./house/Roof";
import { Door } from "./house/Door";
import { DoorLight } from "./house/DoorLight";
import { GardenBushes } from "./house/GardenBush";
import { Ghost } from "./ghosts/Ghost";
import { FabricGhost } from "./ghosts/FabricGhost";
import { Graves } from "./environment/Graves";
import { Ground } from "./environment/Ground";
import {
  GHOST_CONFIGS,
  FABRIC_GHOST_CONFIGS,
} from "@/lib/constants";

export function HauntedHouse() {
  return (
    <group>
      <Walls />
      <Roof />
      <Door />
      <DoorLight />
      <GardenBushes />
      {GHOST_CONFIGS.map((cfg, i) => (
        <Ghost key={i} {...cfg} />
      ))}
      {FABRIC_GHOST_CONFIGS.map((cfg, i) => (
        <FabricGhost key={i} {...cfg} />
      ))}
      <Graves />
      <Ground />
    </group>
  );
}
