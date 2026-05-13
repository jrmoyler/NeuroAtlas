export type SpeciesId = "human" | "primate" | "bird" | "snake" | "fish" | "cat";

export type ExplorerMode =
  | "explore"
  | "compare"
  | "timeline"
  | "activity"
  | "quiz"
  | "ar";

export type RegionId =
  | "frontal"
  | "temporal"
  | "optic"
  | "cerebellum"
  | "brainstem"
  | "olfactory";

export type Region = {
  id: RegionId;
  name: string;
  summary: string;
  energyUsage: number;
  dominance: number;
  evolution: string;
  color: string;
};

export type Mission = {
  title: string;
  description: string;
  reward: string;
  progress: number;
};

export type Species = {
  id: SpeciesId;
  name: string;
  tagline: string;
  accent: string;
  secondaryAccent: string;
  brainWeight: string;
  neuronCount: string;
  complexity: number;
  intelligenceRank: string;
  sensoryStrengths: string[];
  lifespanRelation: string;
  memoryEstimate: string;
  adaptations: string[];
  brainBodyRatio: string;
  specialization: string;
  evolutionBadge: string;
  neuralDensity: number;
  scale: number;
  silhouette: string;
  regions: Region[];
  missions: Mission[];
};
