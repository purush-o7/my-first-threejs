"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function ReadySignal({ onReady }: { onReady?: () => void }) {
  const called = useRef(false);

  useFrame(() => {
    if (!called.current && onReady) {
      called.current = true;
      onReady();
    }
  });

  return null;
}
