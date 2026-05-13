"use client";

import { motion } from "framer-motion";
import { futureSpecies } from "@/lib/neuro-data";
import type { ExplorerMode, Region, Species } from "@/lib/types";
import { useNeuroStore } from "@/store/use-neuro-store";

type InfoDashboardProps = {
  activeMode: ExplorerMode;
  species: Species;
  comparisonSpecies: Species;
  selectedRegion: Region;
};

export function InfoDashboard({
  activeMode,
  species,
  comparisonSpecies,
  selectedRegion,
}: InfoDashboardProps) {
  return (
    <aside className="glass-panel soft-scrollbar min-h-[680px] overflow-y-auto rounded-[2rem] p-4">
      <BrainOverview species={species} />
      <RegionAnalysis species={species} selectedRegion={selectedRegion} />
      <LearningMissions species={species} />
      <ModeSpecificPanel
        activeMode={activeMode}
        species={species}
        comparisonSpecies={comparisonSpecies}
      />
      <AdminCmsPanel />
      <NeuroGuidePanel species={species} selectedRegion={selectedRegion} />
    </aside>
  );
}

function BrainOverview({ species }: { species: Species }) {
  return (
    <section className="hologram-panel rounded-[1.75rem] p-4">
      <SectionHeading eyebrow="Brain overview" title={species.name} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Weight" value={species.brainWeight} />
        <Metric label="Neurons" value={species.neuronCount} />
        <Metric label="B:B ratio" value={species.brainBodyRatio} />
        <Metric label="Density" value={`${species.neuralDensity}%`} />
      </div>

      <div className="mt-4 rounded-3xl bg-white/60 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          Intelligence ranking
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-slate-950">
          {species.intelligenceRank}
        </p>
      </div>

      <DashboardList title="Sensory strengths" items={species.sensoryStrengths} />
      <DashboardList title="Survival adaptations" items={species.adaptations} />

      <div className="mt-4 grid gap-3">
        <TextTile label="Lifespan relation" value={species.lifespanRelation} />
        <TextTile label="Memory estimate" value={species.memoryEstimate} />
        <TextTile label="Processing specialization" value={species.specialization} />
      </div>
    </section>
  );
}

function RegionAnalysis({
  species,
  selectedRegion,
}: {
  species: Species;
  selectedRegion: Region;
}) {
  const setSelectedRegion = useNeuroStore((state) => state.setSelectedRegion);

  return (
    <section className="mt-4 rounded-[1.75rem] border border-white/70 bg-white/45 p-4">
      <SectionHeading eyebrow="Region analysis" title="Interactive systems" />
      <div className="mt-4 space-y-3">
        {species.regions.map((region) => {
          const isSelected = region.id === selectedRegion.id;

          return (
            <motion.button
              key={region.id}
              animate={{
                backgroundColor: isSelected ? `${region.color}1f` : "rgba(255,255,255,0.58)",
              }}
              className="w-full rounded-3xl border border-white/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5"
              onClick={() => setSelectedRegion(region.id)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]"
                  style={{ backgroundColor: region.color, color: region.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-sm font-semibold text-slate-950">
                      {region.name}
                    </h3>
                    <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {region.dominance} dom
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {region.summary}
                  </p>
                  {isSelected ? (
                    <div className="mt-3 rounded-2xl border border-white/70 bg-white/55 p-3">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Detailed view
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {region.detail.pathway}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {region.detail.microstructures.map((microstructure) => (
                          <span
                            key={microstructure}
                            className="rounded-full bg-white/75 px-2 py-1 text-[0.62rem] font-semibold text-slate-500"
                          >
                            {microstructure}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ProgressPill label="Energy" value={region.energyUsage} />
                    <ProgressPill label="Dominance" value={region.dominance} />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function LearningMissions({ species }: { species: Species }) {
  return (
    <section className="mt-4 rounded-[1.75rem] border border-white/70 bg-white/45 p-4">
      <SectionHeading eyebrow="Missions" title="Guided learning tasks" />
      <div className="mt-4 space-y-3">
        {species.missions.map((mission) => (
          <div
            key={mission.title}
            className="rounded-3xl border border-white/70 bg-white/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-950">
                  {mission.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {mission.description}
                </p>
              </div>
              <span className="rounded-full bg-amber-400/15 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-amber-700">
                XP
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
              <motion.div
                animate={{ width: `${mission.progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
              />
            </div>
            <p className="mt-2 text-[0.68rem] font-semibold text-slate-500">
              {mission.reward}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModeSpecificPanel({
  activeMode,
  species,
  comparisonSpecies,
}: {
  activeMode: ExplorerMode;
  species: Species;
  comparisonSpecies: Species;
}) {
  switch (activeMode) {
    case "explore":
      return <ExplorePanel species={species} />;
    case "compare":
      return (
        <ComparePanel species={species} comparisonSpecies={comparisonSpecies} />
      );
    case "timeline":
      return <TimelinePanel />;
    case "activity":
      return <ActivityPanel />;
    case "quiz":
      return <QuizPanel />;
    case "ar":
      return <ArPanel />;
    default: {
      const exhaustiveMode: never = activeMode;
      return exhaustiveMode;
    }
  }
}

function ExplorePanel({ species }: { species: Species }) {
  return (
    <ModePanel
      items={[
        "Rotate, zoom, and pan the central model.",
        "Peel layers to expose internal structures with exploded guide rails.",
        "Activate detail lens to magnify selected microstructures.",
        "Use cross-section and isolate modes for focused anatomical study.",
        `Current specimen calibrated at ${species.scale.toFixed(2)} relative atlas scale.`,
      ]}
      title="Explore controls"
    />
  );
}

function ComparePanel({
  species,
  comparisonSpecies,
}: {
  species: Species;
  comparisonSpecies: Species;
}) {
  const delta = species.complexity - comparisonSpecies.complexity;

  return (
    <section className="mt-4 rounded-[1.75rem] border border-cyan-200/60 bg-cyan-50/45 p-4">
      <SectionHeading eyebrow="Compare mode" title="Function dominance map" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label={species.name} value={`${species.complexity}`} />
        <Metric label={comparisonSpecies.name} value={`${comparisonSpecies.complexity}`} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">
        Complexity delta:{" "}
        <span className="font-bold text-slate-950">
          {delta > 0 ? "+" : ""}
          {delta}
        </span>
        . Overlay uses brain size scaling, neural density, and color-coded
        specialization differences.
      </p>
    </section>
  );
}

function TimelinePanel() {
  return (
    <ModePanel
      items={[
        "Primitive aquatic orientation",
        "Reptilian survival structures",
        "Mammalian sensory expansion",
        "Advanced primate association cortex",
      ]}
      title="Evolution timeline"
    />
  );
}

function ActivityPanel() {
  return (
    <ModePanel
      items={[
        "Motor pathways pulse teal.",
        "Sensory chains pulse amber.",
        "Memory loops pulse violet.",
        "Emotional/autonomic systems pulse green.",
      ]}
      title="Neural activity"
    />
  );
}

function QuizPanel() {
  return (
    <ModePanel
      items={[
        "Beginner: label matching",
        "Student: region function recall",
        "Medical: pathway tracing",
        "Research: comparative neuroanatomy",
      ]}
      title="Quiz curriculum"
    />
  );
}

function ArPanel() {
  return (
    <ModePanel
      items={[
        "Project the brain into room space.",
        "Walk around layer-separated structures.",
        "Use gesture-first anatomy expansion.",
      ]}
      title="AR readiness"
    />
  );
}

function NeuroGuidePanel({
  species,
  selectedRegion,
}: {
  species: Species;
  selectedRegion: Region;
}) {
  return (
    <section className="mt-4 rounded-[1.75rem] border border-violet-200/70 bg-violet-50/45 p-4">
      <SectionHeading eyebrow="AI assistant" title="NeuroGuide" />
      <div className="mt-4 rounded-3xl bg-white/65 p-4 text-sm leading-6 text-slate-600">
        <p>
          Ask: "Why is the {selectedRegion.name.toLowerCase()} important in{" "}
          {species.name.toLowerCase()} cognition?"
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Planned capabilities include conversational explanations, biology Q&A,
          suggested comparisons, and generated learning paths.
        </p>
      </div>
    </section>
  );
}

function AdminCmsPanel() {
  return (
    <section className="mt-4 rounded-[1.75rem] border border-amber-200/70 bg-amber-50/45 p-4">
      <SectionHeading eyebrow="Admin CMS" title="Content operations" />
      <div className="mt-4 grid gap-3">
        {[
          "Upload anatomical assets",
          "Update brain facts",
          "Manage quizzes",
          "Publish guided modules",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-3xl border border-white/70 bg-white/60 px-4 py-3"
          >
            <span className="text-xs font-semibold text-slate-700">{item}</span>
            <span className="rounded-full bg-slate-950 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white">
              Ready
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        Expansion queue
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {futureSpecies.map((entry) => (
          <span
            key={entry}
            className="rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            {entry}
          </span>
        ))}
      </div>
    </section>
  );
}

function ModePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-4 rounded-[1.75rem] border border-white/70 bg-white/45 p-4">
      <SectionHeading eyebrow="Active module" title={title} />
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-cyan-700">
        {eyebrow}
      </p>
      <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-slate-950">
        {title}
      </h2>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function DashboardList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function TextTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/55 p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{value}</p>
    </div>
  );
}

function ProgressPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/60 px-3 py-2">
      <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
        <motion.div
          animate={{ width: `${value}%` }}
          className="h-full rounded-full bg-slate-900"
        />
      </div>
    </div>
  );
}
