"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { Leva } from "leva";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LOADER_FADE_MS, HINT_FADE_DELAY_MS } from "@/lib/constants";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

type AppPhase = "loading" | "loaded" | "ready" | "entering" | "playing";

function LetterReveal({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <span className="letter-reveal">
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ animationDelay: `${baseDelay + i * 0.06}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("loading");

  const onSceneReady = useCallback(() => {
    setPhase("loaded");
    setTimeout(() => setPhase("ready"), LOADER_FADE_MS);
  }, []);

  const onStart = useCallback(() => {
    setPhase("entering");
  }, []);

  const onIntroComplete = useCallback(() => {
    setTimeout(() => setPhase("playing"), HINT_FADE_DELAY_MS);
  }, []);

  const showLoader = phase === "loading" || phase === "loaded";
  const loaderFading = phase === "loaded";
  const showClickOverlay = phase === "ready";
  const showHint = phase === "entering" || phase === "playing";
  const hintFading = phase === "playing";
  const started = phase === "entering" || phase === "playing";

  return (
    <main className="relative h-screen w-screen bg-[#0a0a0a]">
      {/* Loader */}
      {showLoader && (
        <div
          className={`absolute inset-0 z-20 bg-[#0a0a0a] transition-opacity duration-700 ${
            loaderFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <Loader />
        </div>
      )}

      {/* Click to start overlay */}
      {showClickOverlay && (
        <div
          className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center fog-bg grain vignette animate-fadeIn"
          onClick={onStart}
        >
          <div className="relative z-10 flex flex-col items-center">
            {/* Title with letter reveal and flicker */}
            <h1
              className="text-6xl md:text-7xl font-extralight tracking-wide text-white mb-3 animate-flicker"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <LetterReveal text="The Haunted House" />
            </h1>

            {/* Decorative line */}
            <div
              className="w-24 h-px mb-5 animate-slowFadeIn"
              style={{ background: "linear-gradient(90deg, transparent, var(--door-orange), transparent)" }}
            />

            {/* Credit */}
            <p
              className="text-sm mb-8 animate-slowFadeIn"
              style={{ color: "var(--bone-yellow)", fontFamily: "var(--font-display)" }}
            >
              Built by{" "}
              <a
                href="https://github.com/purush-o7/my-first-threejs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-500 underline underline-offset-4 decoration-[0.5px]"
                style={{ color: "var(--ghost-cyan)" }}
                onClick={(e) => e.stopPropagation()}
              >
                purush-o7
              </a>
            </p>

            {/* CTA */}
            <p
              className="text-xs uppercase animate-breathe"
              style={{ color: "var(--bone-yellow)", fontFamily: "var(--font-display)" }}
            >
              Click anywhere to enter
            </p>
          </div>
        </div>
      )}

      {/* Hint during drone shot */}
      {showHint && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
            hintFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1
            className="text-5xl md:text-6xl font-extralight tracking-wide text-white mb-3 animate-slideUp"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Enjoy the scene
          </h1>
          <div
            className="w-16 h-px mb-4 animate-slideUp"
            style={{
              background: "linear-gradient(90deg, transparent, var(--ghost-cyan), transparent)",
              animationDelay: "0.3s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          />
          <p
            className="text-sm animate-slideUp"
            style={{
              color: "var(--bone-yellow)",
              fontFamily: "var(--font-display)",
              animationDelay: "0.5s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Have fun with the debug panel on the right
          </p>
        </div>
      )}

      <Leva collapsed />
      <ErrorBoundary>
        <Scene
          started={started}
          onReady={onSceneReady}
          onIntroComplete={onIntroComplete}
        />
      </ErrorBoundary>
    </main>
  );
}
