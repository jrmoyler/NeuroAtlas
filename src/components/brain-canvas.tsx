"use client";

import { Float, Line, OrbitControls, PerspectiveCamera, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, Group, Mesh, Vector3 } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { ExplorerMode, Region, RegionId, Species } from "@/lib/types";
import { useNeuroStore } from "@/store/use-neuro-store";

type BrainCanvasProps = {
  activeMode: ExplorerMode;
  activeSpecies: Species;
  comparisonSpecies: Species;
  selectedRegion: Region;
};

type RegionAnchor = {
  id: RegionId;
  label: string;
  position: [number, number, number];
  scale: [number, number, number];
};

const regionAnchors: RegionAnchor[] = [
  {
    id: "frontal",
    label: "Frontal",
    position: [-0.2, 0.58, 0.82],
    scale: [1.15, 0.72, 0.92],
  },
  {
    id: "temporal",
    label: "Temporal",
    position: [-0.86, -0.08, 0.1],
    scale: [0.72, 0.46, 0.86],
  },
  {
    id: "optic",
    label: "Optic",
    position: [0.2, 0.1, -0.82],
    scale: [0.88, 0.52, 0.48],
  },
  {
    id: "cerebellum",
    label: "Cerebellum",
    position: [0.36, -0.62, -0.56],
    scale: [0.72, 0.38, 0.52],
  },
  {
    id: "brainstem",
    label: "Brainstem",
    position: [0.1, -0.95, 0.08],
    scale: [0.32, 0.78, 0.32],
  },
  {
    id: "olfactory",
    label: "Olfactory",
    position: [-0.2, -0.2, 1.08],
    scale: [0.58, 0.22, 0.34],
  },
];

const foldPaths = [
  [
    [-1.06, 0.54, 0.56],
    [-0.55, 0.7, 0.82],
    [0.02, 0.54, 0.98],
    [0.64, 0.66, 0.72],
    [1.02, 0.48, 0.36],
  ],
  [
    [-1.02, 0.22, 0.76],
    [-0.46, 0.28, 1.03],
    [0.12, 0.18, 1.08],
    [0.72, 0.28, 0.86],
    [1.06, 0.08, 0.52],
  ],
  [
    [-0.82, -0.16, 0.72],
    [-0.36, -0.1, 1.08],
    [0.28, -0.18, 1.02],
    [0.82, -0.08, 0.7],
  ],
  [
    [-0.72, 0.72, -0.22],
    [-0.22, 0.86, -0.44],
    [0.34, 0.76, -0.4],
    [0.82, 0.58, -0.18],
  ],
  [
    [-0.96, -0.36, -0.12],
    [-0.44, -0.5, -0.26],
    [0.08, -0.42, -0.3],
    [0.56, -0.5, -0.18],
  ],
] satisfies Array<Array<[number, number, number]>>;

const pathwayColors = {
  motor: "#34d5cf",
  sensory: "#f5b95d",
  memory: "#a890ff",
  autonomic: "#79d38a",
};

export function BrainCanvas({
  activeMode,
  activeSpecies,
  comparisonSpecies,
  selectedRegion,
}: BrainCanvasProps) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.85]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <PerspectiveCamera makeDefault fov={38} position={[0, 1.1, 6.4]} />
      <color args={["#eef6f9"]} attach="background" />
      <fog args={["#eef6f9", 7.5, 12]} attach="fog" />
      <ambientLight intensity={1.25} />
      <directionalLight castShadow intensity={2.4} position={[3, 4, 4]} />
      <pointLight color={activeSpecies.accent} intensity={14} position={[-3, 2, 2]} />
      <pointLight color={activeSpecies.secondaryAccent} intensity={9} position={[3, -1, -2]} />

      <Sparkles
        color={activeSpecies.accent}
        count={72}
        opacity={0.38}
        scale={[7, 4.2, 4]}
        size={2.6}
        speed={0.24}
      />

      <Float floatIntensity={0.32} rotationIntensity={0.18} speed={1.1}>
        <BrainModel
          activeMode={activeMode}
          comparisonSpecies={comparisonSpecies}
          selectedRegion={selectedRegion}
          species={activeSpecies}
        />
      </Float>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.45}
        enableDamping
        maxDistance={9}
        minDistance={3.6}
        panSpeed={0.65}
      />
    </Canvas>
  );
}

function BrainModel({
  activeMode,
  species,
  comparisonSpecies,
  selectedRegion,
}: {
  activeMode: ExplorerMode;
  species: Species;
  comparisonSpecies: Species;
  selectedRegion: Region;
}) {
  const groupRef = useRef<Group>(null);
  const selectedRegionId = useNeuroStore((state) => state.selectedRegionId);
  const labelsVisible = useNeuroStore((state) => state.labelsVisible);
  const explodedView = useNeuroStore((state) => state.explodedView);
  const layerPeel = useNeuroStore((state) => state.layerPeel);
  const setSelectedRegion = useNeuroStore((state) => state.setSelectedRegion);
  const modeIntensity = getModeIntensity(activeMode);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.14;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.08) * 0.05;
  });

  return (
    <group ref={groupRef} scale={2.05 * species.scale}>
      <HolographicGrid accent={species.accent} />
      <group position={[0, 0.08, 0]}>
        {regionAnchors.map((anchor) => {
          const region =
            species.regions.find((candidate) => candidate.id === anchor.id) ??
            species.regions[0];
          const selected = region.id === selectedRegionId;
          const regionColor = selected ? selectedRegion.color : region.color;
          const anchorPosition = computeExplodedPosition(
            anchor.position,
            explodedView,
            layerPeel,
          );

          return (
            <group key={anchor.id} position={anchorPosition}>
              <mesh
                castShadow
                onClick={(event) => handleRegionEvent(event, region.id, setSelectedRegion)}
                onPointerOver={(event) =>
                  handleRegionEvent(event, region.id, setSelectedRegion)
                }
                scale={anchor.scale}
              >
                <sphereGeometry args={[0.78, 56, 56]} />
                <meshPhysicalMaterial
                  clearcoat={0.45}
                  color={regionColor}
                  emissive={regionColor}
                  emissiveIntensity={selected ? 0.34 + modeIntensity : 0.08}
                  metalness={0.04}
                  opacity={selected ? 0.82 : 0.58}
                  roughness={0.38}
                  thickness={0.72}
                  transparent
                  transmission={0.22}
                />
              </mesh>
              <RegionGlow color={regionColor} selected={selected} />
              {labelsVisible ? (
                <AnatomyLabel
                  color={regionColor}
                  label={anchor.label}
                  position={[anchor.scale[0] * 0.68, anchor.scale[1] * 0.72, 0.2]}
                />
              ) : null}
            </group>
          );
        })}
      </group>

      <CorpusCallosum color={species.secondaryAccent} />
      <CorticalFolds accent={species.accent} />
      <NeuralPathways activeMode={activeMode} accent={species.accent} />
      {activeMode === "compare" ? (
        <ComparisonGhost species={comparisonSpecies} />
      ) : null}
      {activeMode === "timeline" ? <EvolutionTimelineRings /> : null}
    </group>
  );
}

function handleRegionEvent(
  event: ThreeEvent<MouseEvent>,
  regionId: RegionId,
  setSelectedRegion: (regionId: RegionId) => void,
) {
  event.stopPropagation();
  setSelectedRegion(regionId);
}

function computeExplodedPosition(
  position: [number, number, number],
  explodedView: boolean,
  layerPeel: number,
): [number, number, number] {
  const vector = new Vector3(...position);
  const peel = 1 + layerPeel / 210;
  const explosion = explodedView ? 1.38 : 1;
  vector.multiplyScalar(peel * explosion);
  return [vector.x, vector.y, vector.z];
}

function RegionGlow({ color, selected }: { color: string; selected: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const pulse = selected ? 1 + Math.sin(clock.getElapsedTime() * 2.3) * 0.08 : 1;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef} scale={selected ? 1.22 : 1.04}>
      <sphereGeometry args={[0.86, 32, 32]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={color}
        depthWrite={false}
        opacity={selected ? 0.16 : 0.045}
        transparent
      />
    </mesh>
  );
}

function AnatomyLabel({
  color,
  label,
  position,
}: {
  color: string;
  label: string;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <Line color={color} lineWidth={1.4} points={[[0, 0, 0], [0.42, 0.2, 0.12]]} transparent />
      <Text
        anchorX="left"
        anchorY="middle"
        color="#10202a"
        fontSize={0.095}
        outlineColor="#ffffff"
        outlineWidth={0.008}
        position={[0.46, 0.22, 0.14]}
      >
        {label}
      </Text>
    </group>
  );
}

function CorpusCallosum({ color }: { color: string }) {
  return (
    <mesh position={[0, 0.02, 0.24]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[1.2, 0.5, 0.24]}>
      <torusGeometry args={[0.74, 0.045, 18, 80, Math.PI * 1.08]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.18}
        opacity={0.52}
        roughness={0.32}
        transparent
      />
    </mesh>
  );
}

function CorticalFolds({ accent }: { accent: string }) {
  return (
    <group>
      {foldPaths.map((path, index) => (
        <Line
          key={path.map((point) => point.join(",")).join("-")}
          color={index % 2 === 0 ? accent : "#ffffff"}
          dashed={index % 2 === 1}
          lineWidth={index % 2 === 0 ? 1.7 : 1}
          opacity={index % 2 === 0 ? 0.58 : 0.42}
          points={path}
          transparent
        />
      ))}
    </group>
  );
}

function NeuralPathways({
  activeMode,
  accent,
}: {
  activeMode: ExplorerMode;
  accent: string;
}) {
  const pulseRef = useRef<Group>(null);
  const intensity = getModeIntensity(activeMode);

  useFrame(({ clock }) => {
    if (!pulseRef.current) {
      return;
    }

    pulseRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.4) * 0.08;
  });

  const paths = useMemo(
    () => [
      {
        color: activeMode === "activity" ? pathwayColors.motor : accent,
        points: [
          [-0.86, -0.1, 0.66],
          [-0.42, 0.18, 0.92],
          [0.12, 0.32, 0.86],
          [0.74, -0.26, 0.34],
        ] satisfies Array<[number, number, number]>,
      },
      {
        color: activeMode === "activity" ? pathwayColors.sensory : "#f5b95d",
        points: [
          [0.18, -0.9, 0.08],
          [0.36, -0.52, -0.34],
          [0.18, 0.06, -0.76],
          [-0.2, 0.56, -0.42],
        ] satisfies Array<[number, number, number]>,
      },
      {
        color: activeMode === "activity" ? pathwayColors.memory : "#a890ff",
        points: [
          [-0.2, -0.16, 1.06],
          [0.14, 0.2, 0.96],
          [0.48, 0.1, 0.32],
          [0.22, -0.52, -0.54],
        ] satisfies Array<[number, number, number]>,
      },
    ],
    [accent, activeMode],
  );

  return (
    <group ref={pulseRef}>
      {paths.map((path) => (
        <Line
          key={path.color}
          color={path.color}
          lineWidth={activeMode === "activity" ? 3.2 : 1.8}
          opacity={0.42 + intensity}
          points={path.points}
          transparent
        />
      ))}
      {activeMode === "activity" ? (
        <group>
          {paths.flatMap((path) =>
            path.points.map((point, index) => (
              <SignalPulse
                key={`${path.color}-${point.join("-")}-${index}`}
                color={path.color}
                index={index}
                position={point}
              />
            )),
          )}
        </group>
      ) : null}
    </group>
  );
}

function SignalPulse({
  color,
  index,
  position,
}: {
  color: string;
  index: number;
  position: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const pulse = 0.75 + Math.sin(clock.getElapsedTime() * 3.2 + index) * 0.25;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.055, 18, 18]} />
      <meshBasicMaterial color={color} transparent opacity={0.78} />
    </mesh>
  );
}

function HolographicGrid({ accent }: { accent: string }) {
  const ringColor = new Color(accent).lerp(new Color("#ffffff"), 0.35).getStyle();

  return (
    <group position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {[0.85, 1.35, 1.85, 2.35].map((radius) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.004, 8, 128]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ringColor}
            opacity={0.2}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function ComparisonGhost({ species }: { species: Species }) {
  return (
    <group position={[1.2, 0.12, -0.36]} scale={0.62 * species.scale}>
      <mesh>
        <sphereGeometry args={[1.12, 38, 38]} />
        <meshBasicMaterial
          color={species.accent}
          opacity={0.12}
          transparent
          wireframe
        />
      </mesh>
      <Text
        anchorX="center"
        color="#314252"
        fontSize={0.12}
        position={[0, -1.25, 0]}
      >
        {species.name} overlay
      </Text>
    </group>
  );
}

function EvolutionTimelineRings() {
  return (
    <group position={[0, 0.05, 0]}>
      {[
        { label: "Aquatic", radius: 1.2, color: "#5ab7ff" },
        { label: "Reptile", radius: 1.55, color: "#79d38a" },
        { label: "Mammal", radius: 1.9, color: "#f5b95d" },
        { label: "Primate", radius: 2.25, color: "#a890ff" },
      ].map((ring, index) => (
        <group key={ring.label} rotation={[Math.PI / 2.35, 0, index * 0.2]}>
          <mesh>
            <torusGeometry args={[ring.radius, 0.006, 8, 160]} />
            <meshBasicMaterial color={ring.color} opacity={0.32} transparent />
          </mesh>
          <Text
            anchorX="center"
            color="#10202a"
            fontSize={0.085}
            position={[ring.radius, 0, 0]}
          >
            {ring.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

function getModeIntensity(activeMode: ExplorerMode) {
  switch (activeMode) {
    case "explore":
      return 0.04;
    case "compare":
      return 0.1;
    case "timeline":
      return 0.08;
    case "activity":
      return 0.24;
    case "quiz":
      return 0.06;
    case "ar":
      return 0.14;
    default: {
      const exhaustiveMode: never = activeMode;
      return exhaustiveMode;
    }
  }
}
