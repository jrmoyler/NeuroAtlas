import type { ModelSurface, RegionId, SpeciesId } from "@/lib/types";

export type ModelLayer = {
  id: string;
  label: string;
  color: string;
  opacity: number;
  radius: number;
};

export type ModelAnchor = {
  id: RegionId;
  label: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
};

export type ModelProfile = {
  speciesId: SpeciesId;
  surface: ModelSurface;
  cranialTilt: [number, number, number];
  globalScale: [number, number, number];
  corticalFoldDensity: number;
  detailMagnification: number;
  anchors: ModelAnchor[];
  layers: ModelLayer[];
};

const sharedLayers: ModelLayer[] = [
  {
    id: "cortical-surface",
    label: "Cortical surface",
    color: "#ffffff",
    opacity: 0.18,
    radius: 1.28,
  },
  {
    id: "limbic-band",
    label: "Limbic relay band",
    color: "#a890ff",
    opacity: 0.16,
    radius: 0.95,
  },
  {
    id: "survival-core",
    label: "Survival core",
    color: "#79d38a",
    opacity: 0.22,
    radius: 0.58,
  },
];

export const modelProfiles: Record<SpeciesId, ModelProfile> = {
  human: {
    speciesId: "human",
    surface: "ellipsoid",
    cranialTilt: [0.02, -0.12, 0],
    globalScale: [1.08, 1, 1.04],
    corticalFoldDensity: 1,
    detailMagnification: 1.18,
    layers: sharedLayers,
    anchors: [
      {
        id: "frontal",
        label: "Frontal",
        position: [-0.18, 0.58, 0.86],
        scale: [1.2, 0.74, 0.94],
      },
      {
        id: "temporal",
        label: "Temporal",
        position: [-0.92, -0.08, 0.08],
        scale: [0.76, 0.48, 0.88],
      },
      {
        id: "optic",
        label: "Occipital / optic",
        position: [0.18, 0.08, -0.86],
        scale: [0.92, 0.54, 0.5],
      },
      {
        id: "cerebellum",
        label: "Cerebellum",
        position: [0.38, -0.64, -0.58],
        scale: [0.74, 0.4, 0.54],
      },
      {
        id: "brainstem",
        label: "Brainstem",
        position: [0.08, -0.98, 0.08],
        scale: [0.32, 0.82, 0.32],
      },
      {
        id: "olfactory",
        label: "Olfactory",
        position: [-0.2, -0.2, 1.12],
        scale: [0.56, 0.22, 0.34],
      },
    ],
  },
  primate: {
    speciesId: "primate",
    surface: "ellipsoid",
    cranialTilt: [-0.04, -0.2, 0.02],
    globalScale: [1, 0.92, 1.02],
    corticalFoldDensity: 0.86,
    detailMagnification: 1.12,
    layers: sharedLayers,
    anchors: [
      {
        id: "frontal",
        label: "Frontal",
        position: [-0.2, 0.48, 0.78],
        scale: [1.02, 0.64, 0.82],
      },
      {
        id: "temporal",
        label: "Temporal",
        position: [-0.82, -0.1, 0.06],
        scale: [0.68, 0.44, 0.78],
      },
      {
        id: "optic",
        label: "Optic",
        position: [0.18, 0.06, -0.76],
        scale: [0.82, 0.5, 0.48],
      },
      {
        id: "cerebellum",
        label: "Cerebellum",
        position: [0.34, -0.6, -0.48],
        scale: [0.66, 0.38, 0.48],
      },
      {
        id: "brainstem",
        label: "Brainstem",
        position: [0.08, -0.9, 0.08],
        scale: [0.3, 0.74, 0.3],
      },
      {
        id: "olfactory",
        label: "Olfactory",
        position: [-0.16, -0.18, 1],
        scale: [0.52, 0.2, 0.32],
      },
    ],
  },
  bird: {
    speciesId: "bird",
    surface: "avian",
    cranialTilt: [0.04, -0.28, 0.08],
    globalScale: [0.86, 0.82, 1.18],
    corticalFoldDensity: 0.62,
    detailMagnification: 1.34,
    layers: [
      ...sharedLayers,
      {
        id: "flight-loop",
        label: "Flight stabilization loop",
        color: "#f5b95d",
        opacity: 0.2,
        radius: 1.08,
      },
    ],
    anchors: [
      {
        id: "frontal",
        label: "Pallial command",
        position: [-0.12, 0.44, 0.64],
        scale: [0.72, 0.48, 0.6],
      },
      {
        id: "temporal",
        label: "Song / memory",
        position: [-0.62, -0.02, 0.02],
        scale: [0.52, 0.34, 0.58],
      },
      {
        id: "optic",
        label: "Optic tectum",
        position: [0.18, 0.08, -0.72],
        scale: [0.84, 0.52, 0.54],
      },
      {
        id: "cerebellum",
        label: "Flight cerebellum",
        position: [0.36, -0.54, -0.5],
        scale: [0.72, 0.42, 0.56],
      },
      {
        id: "brainstem",
        label: "Brainstem",
        position: [0.08, -0.82, 0.02],
        scale: [0.26, 0.64, 0.26],
      },
      {
        id: "olfactory",
        label: "Olfactory bulb",
        position: [-0.14, -0.14, 0.86],
        scale: [0.34, 0.16, 0.24],
      },
    ],
  },
  snake: {
    speciesId: "snake",
    surface: "serpentine",
    cranialTilt: [0.02, -0.16, 0],
    globalScale: [0.62, 0.52, 1.48],
    corticalFoldDensity: 0.38,
    detailMagnification: 1.42,
    layers: [
      sharedLayers[1],
      sharedLayers[2],
      {
        id: "chemosensory-shell",
        label: "Chemosensory shell",
        color: "#ff8fb5",
        opacity: 0.24,
        radius: 1,
      },
    ],
    anchors: [
      {
        id: "frontal",
        label: "Forebrain",
        position: [-0.12, 0.24, 0.54],
        scale: [0.46, 0.3, 0.56],
      },
      {
        id: "temporal",
        label: "Memory tract",
        position: [-0.48, -0.02, 0.08],
        scale: [0.38, 0.24, 0.48],
      },
      {
        id: "optic",
        label: "Optic relay",
        position: [0.14, 0.06, -0.48],
        scale: [0.42, 0.28, 0.36],
      },
      {
        id: "cerebellum",
        label: "Motor balance",
        position: [0.24, -0.38, -0.38],
        scale: [0.34, 0.22, 0.34],
      },
      {
        id: "brainstem",
        label: "Reflex stem",
        position: [0.04, -0.62, 0],
        scale: [0.22, 0.62, 0.22],
      },
      {
        id: "olfactory",
        label: "Olfactory fork",
        position: [-0.1, -0.06, 0.98],
        scale: [0.7, 0.16, 0.26],
      },
    ],
  },
  fish: {
    speciesId: "fish",
    surface: "aquatic",
    cranialTilt: [-0.02, -0.08, 0],
    globalScale: [0.72, 0.54, 1.32],
    corticalFoldDensity: 0.32,
    detailMagnification: 1.48,
    layers: [
      sharedLayers[2],
      {
        id: "optic-waterline",
        label: "Aquatic optic field",
        color: "#5ab7ff",
        opacity: 0.22,
        radius: 1.04,
      },
      {
        id: "lateral-line-relay",
        label: "Lateral line relay",
        color: "#32d7d2",
        opacity: 0.2,
        radius: 0.78,
      },
    ],
    anchors: [
      {
        id: "frontal",
        label: "Forebrain",
        position: [-0.08, 0.24, 0.5],
        scale: [0.42, 0.28, 0.5],
      },
      {
        id: "temporal",
        label: "Memory relay",
        position: [-0.44, -0.02, 0.04],
        scale: [0.34, 0.22, 0.4],
      },
      {
        id: "optic",
        label: "Optic lobes",
        position: [0.16, 0.08, -0.44],
        scale: [0.58, 0.36, 0.42],
      },
      {
        id: "cerebellum",
        label: "Swim control",
        position: [0.26, -0.34, -0.34],
        scale: [0.4, 0.24, 0.36],
      },
      {
        id: "brainstem",
        label: "Escape stem",
        position: [0.04, -0.58, 0],
        scale: [0.2, 0.56, 0.2],
      },
      {
        id: "olfactory",
        label: "Olfactory bulbs",
        position: [-0.1, -0.08, 0.86],
        scale: [0.46, 0.16, 0.26],
      },
    ],
  },
  cat: {
    speciesId: "cat",
    surface: "compact",
    cranialTilt: [0.04, -0.18, -0.02],
    globalScale: [0.92, 0.78, 1.02],
    corticalFoldDensity: 0.7,
    detailMagnification: 1.25,
    layers: [
      ...sharedLayers,
      {
        id: "predator-optic-loop",
        label: "Predator optic loop",
        color: "#ff8fb5",
        opacity: 0.19,
        radius: 1.1,
      },
    ],
    anchors: [
      {
        id: "frontal",
        label: "Frontal",
        position: [-0.16, 0.42, 0.72],
        scale: [0.78, 0.48, 0.7],
      },
      {
        id: "temporal",
        label: "Temporal",
        position: [-0.72, -0.08, 0.06],
        scale: [0.58, 0.36, 0.68],
      },
      {
        id: "optic",
        label: "Predator optic",
        position: [0.18, 0.08, -0.72],
        scale: [0.86, 0.48, 0.52],
      },
      {
        id: "cerebellum",
        label: "Landing control",
        position: [0.34, -0.54, -0.48],
        scale: [0.68, 0.38, 0.5],
      },
      {
        id: "brainstem",
        label: "Brainstem",
        position: [0.06, -0.82, 0.04],
        scale: [0.28, 0.66, 0.28],
      },
      {
        id: "olfactory",
        label: "Olfactory",
        position: [-0.18, -0.16, 0.96],
        scale: [0.54, 0.2, 0.32],
      },
    ],
  },
};

export function getModelProfile(speciesId: SpeciesId) {
  return modelProfiles[speciesId];
}
