"use client";

import { Float, Line, OrbitControls, PerspectiveCamera, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, Group, Mesh, Vector3 } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { ExplorerMode, Region, RegionId, Species } from "@/lib/types";
import { getModelProfile } from "@/lib/model-profiles";
import type { ModelAnchor, ModelLayer, ModelProfile } from "@/lib/model-profiles";
import { useNeuroStore } from "@/store/use-neuro-store";

type BrainCanvasProps = {
  activeMode: ExplorerMode;
  activeSpecies: Species;
  comparisonSpecies: Species;
  selectedRegion: Region;
};

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
  const detailView = useNeuroStore((state) => state.detailView);
  const crossSection = useNeuroStore((state) => state.crossSection);
  const isolationMode = useNeuroStore((state) => state.isolationMode);
  const layerPeel = useNeuroStore((state) => state.layerPeel);
  const setSelectedRegion = useNeuroStore((state) => state.setSelectedRegion);
  const modeIntensity = getModeIntensity(activeMode);
  const profile = getModelProfile(species.id);
  const selectedAnchor =
    profile.anchors.find((anchor) => anchor.id === selectedRegionId) ??
    profile.anchors[0];

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = profile.cranialTilt[1] + Math.sin(elapsed * 0.12) * 0.14;
    groupRef.current.rotation.x = profile.cranialTilt[0] + Math.sin(elapsed * 0.08) * 0.05;
    groupRef.current.rotation.z = profile.cranialTilt[2];
  });

  return (
    <group
      ref={groupRef}
      rotation={profile.cranialTilt}
      scale={[
        2.05 * species.scale * profile.globalScale[0],
        2.05 * species.scale * profile.globalScale[1],
        2.05 * species.scale * profile.globalScale[2],
      ]}
    >
      <HolographicGrid accent={species.accent} />
      <SpeciesSurfaceCage
        accent={species.accent}
        detailView={detailView}
        explodedView={explodedView}
        profile={profile}
      />
      <AnatomicalLayers
        crossSection={crossSection}
        explodedView={explodedView}
        layerPeel={layerPeel}
        layers={profile.layers}
      />
      <group position={[0, 0.08, 0]}>
        {profile.anchors.map((anchor) => {
          const region =
            species.regions.find((candidate) => candidate.id === anchor.id) ??
            species.regions[0];
          const selected = region.id === selectedRegionId;
          const regionColor = selected ? selectedRegion.color : region.color;
          const anchorPosition = computeExplodedPosition(
            anchor.position,
            explodedView,
            detailView,
            layerPeel,
            selected,
          );
          const dimmed = isolationMode && !selected;

          return (
            <group key={anchor.id} position={anchorPosition}>
              <PremiumRegionMesh
                activeMode={activeMode}
                anchor={anchor}
                dimmed={dimmed}
                modeIntensity={modeIntensity}
                onSelect={setSelectedRegion}
                profile={profile}
                region={region}
                regionColor={regionColor}
                selected={selected}
              />
              <RegionGlow color={regionColor} dimmed={dimmed} selected={selected} />
              {explodedView || detailView ? (
                <ExplodedGuide
                  color={regionColor}
                  from={[
                    anchor.position[0] - anchorPosition[0],
                    anchor.position[1] - anchorPosition[1],
                    anchor.position[2] - anchorPosition[2],
                  ]}
                  selected={selected}
                  to={[0, 0, 0]}
                />
              ) : null}
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
      <CorticalFolds accent={species.accent} density={profile.corticalFoldDensity} />
      <NeuralPathways activeMode={activeMode} accent={species.accent} />
      {crossSection ? (
        <CrossSectionPlane color={selectedRegion.color} selectedAnchor={selectedAnchor} />
      ) : null}
      {detailView ? (
        <DetailedStudyLens
          anchor={selectedAnchor}
          profile={profile}
          region={selectedRegion}
          species={species}
        />
      ) : null}
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
  detailView: boolean,
  layerPeel: number,
  selected: boolean,
): [number, number, number] {
  const vector = new Vector3(...position);
  if (!explodedView && !detailView) {
    return [vector.x, vector.y, vector.z];
  }

  const direction = vector.clone().normalize();
  const explodedOffset = explodedView ? layerPeel / 116 : layerPeel / 340;
  const detailOffset = detailView && selected ? 0.16 : 0;
  vector.add(direction.multiplyScalar(explodedOffset + detailOffset));
  return [vector.x, vector.y, vector.z];
}

function PremiumRegionMesh({
  activeMode,
  anchor,
  dimmed,
  modeIntensity,
  onSelect,
  profile,
  region,
  regionColor,
  selected,
}: {
  activeMode: ExplorerMode;
  anchor: ModelAnchor;
  dimmed: boolean;
  modeIntensity: number;
  onSelect: (regionId: RegionId) => void;
  profile: ModelProfile;
  region: Region;
  regionColor: string;
  selected: boolean;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const pulse = selected ? Math.sin(clock.getElapsedTime() * 2.1) * 0.025 : 0;
    meshRef.current.scale.set(
      anchor.scale[0] + pulse,
      anchor.scale[1] + pulse,
      anchor.scale[2] + pulse,
    );
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      onClick={(event) => handleRegionEvent(event, region.id, onSelect)}
      onPointerOver={(event) => handleRegionEvent(event, region.id, onSelect)}
      rotation={anchor.rotation}
      scale={anchor.scale}
    >
      <SurfaceGeometry anchor={anchor} profile={profile} />
      <meshPhysicalMaterial
        clearcoat={0.56}
        color={regionColor}
        emissive={regionColor}
        emissiveIntensity={selected ? 0.38 + modeIntensity : 0.07}
        metalness={activeMode === "ar" ? 0.14 : 0.04}
        opacity={dimmed ? 0.16 : selected ? 0.86 : 0.58}
        roughness={0.34}
        thickness={0.84}
        transparent
        transmission={dimmed ? 0.48 : 0.22}
      />
    </mesh>
  );
}

function SurfaceGeometry({
  anchor,
  profile,
}: {
  anchor: ModelAnchor;
  profile: ModelProfile;
}) {
  if (profile.surface === "serpentine" && anchor.id === "olfactory") {
    return <torusGeometry args={[0.58, 0.12, 18, 72, Math.PI * 1.38]} />;
  }

  if (profile.surface === "avian" && anchor.id === "optic") {
    return <sphereGeometry args={[0.82, 64, 40, 0, Math.PI * 2, 0.2, Math.PI * 0.82]} />;
  }

  if (profile.surface === "aquatic" && anchor.id === "brainstem") {
    return <cylinderGeometry args={[0.28, 0.2, 1.1, 32, 4]} />;
  }

  return <sphereGeometry args={[0.78, 64, 64]} />;
}

function RegionGlow({
  color,
  dimmed,
  selected,
}: {
  color: string;
  dimmed: boolean;
  selected: boolean;
}) {
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
        opacity={dimmed ? 0.01 : selected ? 0.18 : 0.045}
        transparent
      />
    </mesh>
  );
}

function ExplodedGuide({
  color,
  from,
  selected,
  to,
}: {
  color: string;
  from: [number, number, number];
  selected: boolean;
  to: [number, number, number];
}) {
  return (
    <Line
      color={color}
      dashed={!selected}
      lineWidth={selected ? 1.6 : 0.7}
      opacity={selected ? 0.42 : 0.18}
      points={[from, to]}
      transparent
    />
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

function SpeciesSurfaceCage({
  accent,
  detailView,
  explodedView,
  profile,
}: {
  accent: string;
  detailView: boolean;
  explodedView: boolean;
  profile: ModelProfile;
}) {
  const cageRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!cageRef.current) {
      return;
    }

    cageRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.18) * 0.08;
  });

  return (
    <mesh ref={cageRef} scale={[1.34, 1.08, 1.18]}>
      <SurfaceShellGeometry profile={profile} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={accent}
        opacity={explodedView || detailView ? 0.13 : 0.07}
        transparent
        wireframe
      />
    </mesh>
  );
}

function SurfaceShellGeometry({ profile }: { profile: ModelProfile }) {
  if (profile.surface === "avian") {
    return <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0.18, Math.PI * 0.86]} />;
  }

  if (profile.surface === "serpentine" || profile.surface === "aquatic") {
    return <sphereGeometry args={[1, 44, 28]} />;
  }

  return <sphereGeometry args={[1, 56, 36]} />;
}

function AnatomicalLayers({
  crossSection,
  explodedView,
  layerPeel,
  layers,
}: {
  crossSection: boolean;
  explodedView: boolean;
  layerPeel: number;
  layers: ModelLayer[];
}) {
  return (
    <group>
      {layers.map((layer, index) => {
        const separation = explodedView ? (index + 1) * layerPeel * 0.0048 : 0;
        const radius = layer.radius + separation;
        const opacity = crossSection ? layer.opacity * 1.3 : layer.opacity;

        return (
          <group key={layer.id} position={[0, separation * 0.16, -separation * 0.12]}>
            <mesh scale={[radius, radius * 0.78, radius * 0.92]}>
              <sphereGeometry args={[1, 48, 32]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={layer.color}
                opacity={opacity}
                transparent
                wireframe={index !== 0}
              />
            </mesh>
            {explodedView ? (
              <Text
                anchorX="center"
                color="#425466"
                fontSize={0.065}
                position={[radius + 0.18, 0.2 + index * 0.1, 0]}
              >
                {layer.label}
              </Text>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function CrossSectionPlane({
  color,
  selectedAnchor,
}: {
  color: string;
  selectedAnchor: ModelAnchor;
}) {
  const planeRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!planeRef.current) {
      return;
    }

    planeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.35) * 0.1;
  });

  return (
    <group position={selectedAnchor.position}>
      <mesh ref={planeRef} rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={[1.22, 1.22, 1]}>
        <circleGeometry args={[0.72, 72]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          opacity={0.22}
          transparent
        />
      </mesh>
      <Line
        color="#ffffff"
        lineWidth={1}
        opacity={0.42}
        points={[
          [-0.54, 0, 0],
          [0.54, 0, 0],
        ]}
        transparent
      />
    </group>
  );
}

function DetailedStudyLens({
  anchor,
  profile,
  region,
  species,
}: {
  anchor: ModelAnchor;
  profile: ModelProfile;
  region: Region;
  species: Species;
}) {
  const lensRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!lensRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    lensRef.current.rotation.y = Math.sin(elapsed * 0.2) * 0.12;
    lensRef.current.position.y = 0.48 + Math.sin(elapsed * 0.9) * 0.025;
  });

  return (
    <group ref={lensRef} position={[1.58, 0.48, 1.16]} scale={profile.detailMagnification}>
      <mesh>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshPhysicalMaterial
          clearcoat={0.9}
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.3}
          opacity={0.34}
          roughness={0.18}
          transparent
          transmission={0.42}
        />
      </mesh>
      <mesh scale={[1.26, 0.52, 1.26]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.006, 8, 96]} />
        <meshBasicMaterial color={region.color} opacity={0.42} transparent />
      </mesh>
      <DetailMicrostructures color={region.color} labels={region.detail.microstructures} />
      <Line
        color={region.color}
        lineWidth={1.2}
        opacity={0.34}
        points={[
          [0, 0, 0],
          [
            anchor.position[0] - 1.58,
            anchor.position[1] - 0.48,
            anchor.position[2] - 1.16,
          ],
        ]}
        transparent
      />
      <Text
        anchorX="center"
        color="#10202a"
        fontSize={0.07}
        maxWidth={1.2}
        outlineColor="#ffffff"
        outlineWidth={0.008}
        position={[0, -0.58, 0]}
      >
        {species.name} detailed {region.name}
      </Text>
    </group>
  );
}

function DetailMicrostructures({
  color,
  labels,
}: {
  color: string;
  labels: string[];
}) {
  return (
    <group>
      {labels.map((label, index) => {
        const angle = (index / labels.length) * Math.PI * 2;
        const x = Math.cos(angle) * 0.34;
        const z = Math.sin(angle) * 0.28;
        const y = index % 2 === 0 ? 0.08 : -0.08;

        return (
          <group key={label} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color={color} opacity={0.86} transparent />
            </mesh>
            <Line
              color={color}
              lineWidth={0.8}
              opacity={0.32}
              points={[
                [0, 0, 0],
                [x * -0.6, y * -0.4, z * -0.6],
              ]}
              transparent
            />
          </group>
        );
      })}
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

function CorticalFolds({ accent, density }: { accent: string; density: number }) {
  return (
    <group>
      {foldPaths.map((path, index) => (
        <Line
          key={path.map((point) => point.join(",")).join("-")}
          color={index % 2 === 0 ? accent : "#ffffff"}
          dashed={index % 2 === 1}
          lineWidth={(index % 2 === 0 ? 1.7 : 1) * density}
          opacity={(index % 2 === 0 ? 0.58 : 0.42) * density}
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
