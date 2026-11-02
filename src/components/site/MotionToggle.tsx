"use client";

import { useSyncExternalStore } from "react";

import { isPaused, setPaused, subscribePaused } from "@/lib/motion/pause";

/**
 * The footer's "Pause animations" button (see lib/motion/pause.ts). Its label says what it will
 * do: "Pause animations" while things move, "Play animations" once they're paused.
 */
export function MotionToggle({ pause, play }: { pause: string; play: string }) {
  const paused = useSyncExternalStore(subscribePaused, isPaused, () => false);
  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      className="cursor-pointer border-0 bg-transparent p-0 text-left text-inherit underline-offset-4 hover:underline"
    >
      {paused ? play : pause}
    </button>
  );
}
