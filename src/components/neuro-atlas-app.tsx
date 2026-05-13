"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BrainCanvas } from "@/components/brain-canvas";
import { BottomModeNav } from "@/components/bottom-mode-nav";
import { CommandHeader } from "@/components/command-header";
import { InsightStrip } from "@/components/insight-strip";
import { InfoDashboard } from "@/components/info-dashboard";
import { SpeciesSidebar } from "@/components/species-sidebar";
import { species, speciesById } from "@/lib/neuro-data";
import { useNeuroStore } from "@/store/use-neuro-store";

export function NeuroAtlasApp() {
  const activeSpeciesId = useNeuroStore((state) => state.activeSpeciesId);
  const comparisonSpeciesId = useNeuroStore((state) => state.comparisonSpeciesId);
  const activeMode = useNeuroStore((state) => state.activeMode);
  const selectedRegionId = useNeuroStore((state) => state.selectedRegionId);

  const activeSpecies = speciesById.get(activeSpeciesId) ?? species[0];
  const comparisonSpecies = speciesById.get(comparisonSpeciesId) ?? species[5];
  const selectedRegion =
    activeSpecies.regions.find((region) => region.id === selectedRegionId) ??
    activeSpecies.regions[0];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <AmbientField />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4">
        <CommandHeader
          activeMode={activeMode}
          activeSpecies={activeSpecies}
          selectedRegion={selectedRegion}
        />

        <section className="grid flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_390px]">
          <SpeciesSidebar species={species} activeSpecies={activeSpecies} />

          <div className="relative min-h-[680px] overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/35 shadow-[0_30px_100px_rgba(25,74,94,0.14)] backdrop-blur-3xl">
            <div className="orbital-ring pointer-events-none" />
            <div className="absolute inset-0 scanline opacity-45" />
            <BrainCanvas
              activeMode={activeMode}
              activeSpecies={activeSpecies}
              comparisonSpecies={comparisonSpecies}
              selectedRegion={selectedRegion}
            />
            <InsightStrip
              activeMode={activeMode}
              activeSpecies={activeSpecies}
              comparisonSpecies={comparisonSpecies}
              selectedRegion={selectedRegion}
            />
          </div>

          <InfoDashboard
            activeMode={activeMode}
            species={activeSpecies}
            comparisonSpecies={comparisonSpecies}
            selectedRegion={selectedRegion}
          />
        </section>

        <BottomModeNav />
      </div>

      <AnimatePresence>
        {activeMode === "ar" ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-2xl rounded-3xl border border-cyan-200/80 bg-white/80 p-5 text-sm text-slate-700 shadow-2xl shadow-cyan-900/10 backdrop-blur-2xl"
            exit={{ opacity: 0, y: 16 }}
            initial={{ opacity: 0, y: 16 }}
          >
            <span className="font-display text-base font-semibold text-slate-950">
              AR projection briefing
            </span>
            <p className="mt-2">
              Room-scale projection mode is staged for tablet deployment:
              expand structures, walk around the brain, and gesture through
              labeled anatomical layers.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function AmbientField() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 26, -18, 0], y: [0, -22, 18, 0] }}
        className="absolute left-[8%] top-[14%] h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl"
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ x: [0, -32, 20, 0], y: [0, 24, -16, 0] }}
        className="absolute right-[8%] top-[10%] h-80 w-80 rounded-full bg-violet-200/40 blur-3xl"
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ opacity: [0.28, 0.62, 0.32] }}
        className="absolute bottom-[-8rem] left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-amber-100/45 blur-3xl"
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
