"use client";

import { motion } from "framer-motion";
import type { ExplorerMode, Region, Species } from "@/lib/types";
import { useNeuroStore } from "@/store/use-neuro-store";

type InsightStripProps = {
  activeMode: ExplorerMode;
  activeSpecies: Species;
  comparisonSpecies: Species;
  selectedRegion: Region;
};

export function InsightStrip({
  activeMode,
  activeSpecies,
  comparisonSpecies,
  selectedRegion,
}: InsightStripProps) {
  const labelsVisible = useNeuroStore((state) => state.labelsVisible);
  const explodedView = useNeuroStore((state) => state.explodedView);
  const detailView = useNeuroStore((state) => state.detailView);
  const crossSection = useNeuroStore((state) => state.crossSection);
  const isolationMode = useNeuroStore((state) => state.isolationMode);
  const layerPeel = useNeuroStore((state) => state.layerPeel);
  const toggleLabels = useNeuroStore((state) => state.toggleLabels);
  const toggleExplodedView = useNeuroStore((state) => state.toggleExplodedView);
  const toggleDetailView = useNeuroStore((state) => state.toggleDetailView);
  const toggleCrossSection = useNeuroStore((state) => state.toggleCrossSection);
  const toggleIsolationMode = useNeuroStore((state) => state.toggleIsolationMode);
  const setLayerPeel = useNeuroStore((state) => state.setLayerPeel);

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 grid gap-3 lg:grid-cols-[1fr_auto]">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto rounded-[1.75rem] border border-white/70 bg-white/70 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl"
        initial={{ opacity: 0, y: 18 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-cyan-700">
              Live anatomical focus
            </p>
            <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-slate-950">
              {selectedRegion.name}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {selectedRegion.summary}
            </p>
            <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-slate-500">
              Detail lens: {selectedRegion.detail.studyPrompt}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <MiniTelemetry label="Mode" value={activeMode} />
            <MiniTelemetry label="Species" value={activeSpecies.name} />
            <MiniTelemetry label="Compare" value={comparisonSpecies.name} />
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-auto rounded-[1.75rem] border border-white/70 bg-white/70 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <ControlButton active={labelsVisible} label="Labels" onClick={toggleLabels} />
          <ControlButton
            active={detailView}
            label="Detail lens"
            onClick={toggleDetailView}
          />
          <ControlButton
            active={explodedView}
            label="Exploded"
            onClick={toggleExplodedView}
          />
          <ControlButton
            active={crossSection}
            label="Cross-section"
            onClick={toggleCrossSection}
          />
          <ControlButton
            active={isolationMode}
            label="Isolate"
            onClick={toggleIsolationMode}
          />
          <label className="min-w-44 rounded-2xl bg-white/65 px-3 py-2 text-xs font-semibold text-slate-600">
            Explode depth {layerPeel}%
            <input
              className="mt-2 block w-full accent-cyan-500"
              max="100"
              min="0"
              onChange={(event) => setLayerPeel(Number(event.target.value))}
              type="range"
              value={layerPeel}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition ${
        active ? "bg-slate-950 text-white" : "bg-white/65 text-slate-600"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function MiniTelemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/65 px-3 py-2">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 max-w-24 truncate font-semibold capitalize text-slate-800">
        {value}
      </p>
    </div>
  );
}
