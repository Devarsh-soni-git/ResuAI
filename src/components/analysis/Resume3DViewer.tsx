import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { Section } from "./types";

interface ResumeSectionPanelProps {
  section: Section;
  position: [number, number, number];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function ResumeSectionPanel({ section, position, index, isSelected, onSelect }: ResumeSectionPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  useFrame(() => {
    if (meshRef.current) {
      const targetRotationY = isSelected ? Math.PI * 0.05 : 0;
      const targetScale = hovered ? 1.05 : isSelected ? 1.1 : 1;

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onSelect}
        >
          <RoundedBox args={[2.0, 1.3, 0.15]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color={isSelected ? "#1e3a5f" : hovered ? "#2d4a6f" : "#1a2744"}
              metalness={0.1}
              roughness={0.8}
              transparent
              opacity={0.95}
            />
          </RoundedBox>
        </mesh>

        {/* Category Label */}
        <Text
          position={[0, 0.32, 0.1]}
          fontSize={0.15}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {section.category}
        </Text>

        {/* Score */}
        <Text
          position={[0, -0.08, 0.1]}
          fontSize={0.38}
          color={getScoreColor(section.score)}
          anchorX="center"
          anchorY="middle"
        >
          {section.score}
        </Text>

        <Text
          position={[0, -0.38, 0.1]}
          fontSize={0.1}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          / 100
        </Text>

        {/* Glow effect for high scores */}
        {section.score >= 80 && (
          <pointLight
            position={[0, 0, 0.5]}
            color="#22c55e"
            intensity={0.3}
            distance={2}
          />
        )}
      </group>
    </Float>
  );
}

interface Resume3DViewerProps {
  sections: Section[];
  onSectionSelect: (index: number) => void;
  selectedIndex: number | null;
}

function Scene({ sections, onSectionSelect, selectedIndex }: Resume3DViewerProps) {
  // Dynamically compute positions based on number of sections
  const getPositions = (count: number): [number, number, number][] => {
    if (count <= 3) {
      // Single row centered
      const spacing = 2.4;
      const startX = -((count - 1) * spacing) / 2;
      return Array.from({ length: count }, (_, i) => [startX + i * spacing, 0, 0]);
    }
    if (count === 4) {
      return [
        [-3.6, 0.8, 0],
        [-1.2, 0.8, 0],
        [1.2, 0.8, 0],
        [3.6, 0.8, 0],
      ];
    }
    // 5 sections: 3 on top, 2 on bottom
    return [
      [-2.4, 0.9, 0],
      [0, 0.9, 0],
      [2.4, 0.9, 0],
      [-1.2, -0.9, 0],
      [1.2, -0.9, 0],
    ];
  };

  const positions = getPositions(Math.min(sections.length, 5));

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#14b8a6" />

      {sections.slice(0, 5).map((section, index) => (
        <ResumeSectionPanel
          key={section.category}
          section={section}
          position={positions[index] || [0, 0, 0]}
          index={index}
          isSelected={selectedIndex === index}
          onSelect={() => onSectionSelect(index)}
        />
      ))}

      <Environment preset="city" />
    </>
  );
}

export function Resume3DViewer({ sections, onSectionSelect, selectedIndex }: Resume3DViewerProps) {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 shadow-elevated relative">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }} // ✅ pulled back camera to show all cards
          dpr={[1, 2]}
        >
          <Scene
            sections={sections}
            onSectionSelect={onSectionSelect}
            selectedIndex={selectedIndex}
          />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-slate-400">Click a card to explore details</p>
      </div>
    </div>
  );
}
