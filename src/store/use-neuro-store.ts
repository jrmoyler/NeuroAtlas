"use client";

import { create } from "zustand";
import type { ExplorerMode, RegionId, SpeciesId } from "@/lib/types";

type NeuroState = {
  activeSpeciesId: SpeciesId;
  comparisonSpeciesId: SpeciesId;
  activeMode: ExplorerMode;
  selectedRegionId: RegionId;
  labelsVisible: boolean;
  explodedView: boolean;
  layerPeel: number;
  setActiveSpecies: (speciesId: SpeciesId) => void;
  setComparisonSpecies: (speciesId: SpeciesId) => void;
  setActiveMode: (mode: ExplorerMode) => void;
  setSelectedRegion: (regionId: RegionId) => void;
  toggleLabels: () => void;
  toggleExplodedView: () => void;
  setLayerPeel: (value: number) => void;
};

export const useNeuroStore = create<NeuroState>((set) => ({
  activeSpeciesId: "human",
  comparisonSpeciesId: "cat",
  activeMode: "explore",
  selectedRegionId: "frontal",
  labelsVisible: true,
  explodedView: false,
  layerPeel: 34,
  setActiveSpecies: (speciesId) => set({ activeSpeciesId: speciesId }),
  setComparisonSpecies: (speciesId) => set({ comparisonSpeciesId: speciesId }),
  setActiveMode: (mode) => set({ activeMode: mode }),
  setSelectedRegion: (regionId) => set({ selectedRegionId: regionId }),
  toggleLabels: () => set((state) => ({ labelsVisible: !state.labelsVisible })),
  toggleExplodedView: () =>
    set((state) => ({ explodedView: !state.explodedView })),
  setLayerPeel: (value) => set({ layerPeel: value }),
}));
