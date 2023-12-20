"use client";

import { OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";

const SPHERE_COUNT = 3200;
const SPHERE_SIZE = 0.025;
const MIN_RADIUS = 2;
const MAX_RADIUS = 3;
const THICKNESS = 1;

const START_COLOR = [249, 206, 52];
const END_COLOR = [98, 40, 215];
const ROTATE_SPEED = 0.1;

const OUTER_FACTOR = 4;
const LINE_FACTOR = 2;

const getColor = (x: number) => {
  let ratio = (x + MAX_RADIUS) / (MAX_RADIUS * 2);
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  return `rgb(${START_COLOR.map((_, i) =>
    Math.round(START_COLOR[i] + (END_COLOR[i] - START_COLOR[i]) * ratio),
  ).join(", ")})`;
};

const outerSpheres = Array(SPHERE_COUNT / OUTER_FACTOR)
  .fill(null)
  .map((_, i) => {
    const radius = Math.random() * MAX_RADIUS * OUTER_FACTOR;
    const angle = Math.random() * 2 * Math.PI;
    const depth = (Math.random() - 0.5) * 2 * MAX_RADIUS * OUTER_FACTOR;

    return {
      index: `a${i}`,
      pos: [radius * Math.cos(angle), radius * Math.sin(angle), depth] as const,
      color: getColor(radius * Math.cos(angle)),
    };
  });

const lineSpheres = Array(SPHERE_COUNT / LINE_FACTOR)
  .fill(null)
  .map((_, i) => {
    const width = (Math.random() - 0.5) * (MAX_RADIUS - MIN_RADIUS);
    const height = (Math.random() - 0.5) * Math.PI * MAX_RADIUS;
    const depth = (Math.random() - 0.5) * THICKNESS;

    return {
      index: `b${i}`,
      pos: [width, height, depth] as const,
      color: getColor(width),
    };
  });

const spheres = Array(SPHERE_COUNT)
  .fill(null)
  .map((_, i) => {
    const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    const angle = Math.random() * 2 * Math.PI;
    const depth = (Math.random() - 0.5) * THICKNESS;

    return {
      index: `c${i}`,
      pos: [radius * Math.cos(angle), radius * Math.sin(angle), depth] as const,
      color: getColor(radius * Math.cos(angle)),
    };
  });

const Spheres = () => {
  const ref = useRef<Group<Object3DEventMap>>(null);
  useFrame(({ clock }) => {
    if (ref.current?.rotation) {
      ref.current.rotation.x =
        0.5 * Math.sin(clock.getElapsedTime() * ROTATE_SPEED);
      ref.current.rotation.y =
        0.5 * Math.cos(clock.getElapsedTime() * ROTATE_SPEED);
      ref.current.rotation.z = 0.25;
    }
  });

  return (
    <group ref={ref}>
      {outerSpheres
        .concat(lineSpheres)
        .concat(spheres)
        .map(({ index, pos, color }) => (
          <Sphere key={index} position={pos} args={[SPHERE_SIZE, 16, 16]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.5}
            />
          </Sphere>
        ))}
    </group>
  );
};

const Home = () => (
  <main className="relative h-screen">
    <Canvas camera={{ position: [0, 0, 6] }}>
      <OrbitControls minDistance={2} maxDistance={10} />
      <directionalLight />
      <Spheres />
    </Canvas>
    <h1 className="pointer-events-none absolute left-8 top-8 select-none font-mono text-2xl font-bold text-white">
      c1pher.dev
    </h1>
  </main>
);

export default Home;
