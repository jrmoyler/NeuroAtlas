"use client";

import { motion } from "framer-motion";
import type { Species } from "@/lib/types";
import { useNeuroStore } from "@/store/use-neuro-store";

type SpeciesSidebarProps = {
  species: Species[];
  activeSpecies: Species;
};

export function SpeciesSidebar({ species, activeSpecies }: SpeciesSidebarProps) {
  const setActiveSpecies = useNeuroStore((state) => state.setActiveSpecies);
  const setComparisonSpecies = useNeuroStore((state) => state.setComparisonSpecies);

  return (
    <aside className="glass-panel flex min-h-[680px] flex-col rounded-[2rem] p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
          Species navigation
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Comparative atlas
        </h2>
      </div>

      <div className="soft-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
        {species.map((entry) => {
          const isActive = entry.id === activeSpecies.id;

          return (
            <motion.button
              key={entry.id}
              animate={{
                borderColor: isActive ? entry.accent : "rgba(255,255,255,0.72)",
                scale: isActive ? 1.015 : 1,
              }}
              className="group relative w-full overflow-hidden rounded-3xl border bg-white/55 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white/75"
              onClick={() => {
                setActiveSpecies(entry.id);
                if (!isActive) {
                  setComparisonSpecies(activeSpecies.id);
                }
              }}
              type="button"
            >
              <div
                className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${entry.accent}28, transparent 42%)`,
                }}
              />
              {isActive ? (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  layoutId="species-active-ring"
                  style={{ boxShadow: `inset 0 0 0 1px ${entry.accent}` }}
                />
              ) : null}

              <div className="relative flex gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/80 text-lg font-bold text-slate-900 shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${entry.accent}55, ${entry.secondaryAccent}30), rgba(255,255,255,0.75)`,
                  }}
                >
                  {entry.silhouette}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-slate-950">
                      {entry.name}
                    </h3>
                    {isActive ? (
                      <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-cyan-700">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                    {entry.tagline}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[0.68rem]">
                    <Stat label="Complexity" value={`${entry.complexity}/100`} />
                    <Stat label="Neurons" value={entry.neuronCount} />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200/80">
                      <motion.div
                        animate={{ width: `${entry.complexity}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: entry.accent }}
                      />
                    </div>
                    <span className="rounded-full bg-white/70 px-2 py-1 text-[0.62rem] font-semibold text-slate-600">
                      {entry.evolutionBadge}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 rounded-3xl border border-cyan-200/50 bg-cyan-50/50 p-4">
        <p className="font-display text-sm font-semibold text-slate-950">
          Scalable species system
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Prepared for dolphins, dogs, elephants, octopus, whales, insects,
          speculative dinosaurs, and AI neural network comparison.
        </p>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/65 px-3 py-2">
      <p className="font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
