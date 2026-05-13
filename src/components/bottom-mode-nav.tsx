"use client";

import { motion } from "framer-motion";
import { explorerModes } from "@/lib/neuro-data";
import { useNeuroStore } from "@/store/use-neuro-store";

export function BottomModeNav() {
  const activeMode = useNeuroStore((state) => state.activeMode);
  const setActiveMode = useNeuroStore((state) => state.setActiveMode);

  return (
    <nav className="glass-panel mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 rounded-[2rem] p-2">
      {explorerModes.map((mode) => {
        const isActive = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            className="relative rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            onClick={() => setActiveMode(mode.id)}
            title={mode.description}
            type="button"
          >
            {isActive ? (
              <motion.span
                className="absolute inset-0 rounded-2xl bg-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                layoutId="mode-pill"
              />
            ) : null}
            <span className={`relative ${isActive ? "text-white" : ""}`}>
              {mode.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
