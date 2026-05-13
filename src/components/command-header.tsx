"use client";

import { motion } from "framer-motion";
import type { ExplorerMode, Region, Species } from "@/lib/types";

type CommandHeaderProps = {
  activeMode: ExplorerMode;
  activeSpecies: Species;
  selectedRegion: Region;
};

const modeLabels: Record<ExplorerMode, string> = {
  explore: "Atlas exploration",
  compare: "Comparative cognition",
  timeline: "Evolutionary timeline",
  activity: "Neural activity simulation",
  quiz: "Learning assessment",
  ar: "Immersive projection",
};

export function CommandHeader({
  activeMode,
  activeSpecies,
  selectedRegion,
}: CommandHeaderProps) {
  return (
    <header className="glass-panel flex flex-col gap-4 rounded-[2rem] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          className="relative grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/70 bg-white/70 shadow-inner"
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/60" />
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(45,212,191,0.8)]" />
        </motion.div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-700">
            NeuroAtlas mission interface
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
            Biological intelligence observatory
          </h1>
        </div>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-3 lg:w-[560px]">
        <Telemetry label="Active specimen" value={activeSpecies.name} />
        <Telemetry label="Mode" value={modeLabels[activeMode]} />
        <Telemetry label="Focus region" value={selectedRegion.name} />
      </div>
    </header>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-sm">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate font-display text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
