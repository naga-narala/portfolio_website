import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Matrix4, Vector3, Color, LineBasicMaterial, MeshStandardMaterial, BufferAttribute } from 'three';

// Add scale prop
interface MLBackgroundProps {
  scale?: number | [number, number, number];
}

export function MLBackground({ scale = 1.0 }: MLBackgroundProps) { // Destructure scale prop with default
  const spheresRef = useRef<InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sphereMaterialRef = useRef<MeshStandardMaterial>(null);
  const lineMaterialRef = useRef<LineBasicMaterial>(null);
  const linePositionAttributeRef = useRef<BufferAttribute | null>(null);

  const { nodes, indices, count } = useMemo(() => {
    const columns = 3;
    const nodesPerColumn = 20;
    const nodeCount = columns * nodesPerColumn;

    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);
    const connections: number[] = [];

    const columnSpacing = 4.0;
    const verticalSpread = 14.0;

    let nodeIndex = 0;

    for (let col = 0; col < columns; col++) {
      const colX = (col - 1) * columnSpacing;

      for (let i = 0; i < nodesPerColumn; i++) {
        const verticalPosition = (i / (nodesPerColumn - 1)) * verticalSpread - (verticalSpread / 2);

        const jitterX = (Math.random() - 0.5) * 0.5;
        const jitterY = (Math.random() - 0.5) * 0.3;
        const jitterZ = (Math.random() - 0.5) * 0.8;

        positions[nodeIndex * 3] = colX + jitterX;
        positions[nodeIndex * 3 + 1] = verticalPosition + jitterY;
        positions[nodeIndex * 3 + 2] = -2 + jitterZ;

        colors[nodeIndex * 3] = 0.6 + Math.random() * 0.3;
        colors[nodeIndex * 3 + 1] = 0.0 + Math.random() * 0.1;
        colors[nodeIndex * 3 + 2] = 0.0 + Math.random() * 0.1;

        sizes[nodeIndex] = 0.25 + Math.random() * 0.08;

        nodeIndex++;
      }
    }

    for (let col = 0; col < columns - 1; col++) {
      const currentColStart = col * nodesPerColumn;
      const nextColStart = (col + 1) * nodesPerColumn;

      for (let i = 0; i < nodesPerColumn; i++) {
        const sourceNodeIdx = currentColStart + i;

        const connectionCount = 3 + Math.floor(Math.random() * 2);

        for (let c = 0; c < connectionCount; c++) {
          const offset = Math.floor(Math.random() * 5) - 2;
          let targetNodePos = i + offset;

          targetNodePos = Math.max(0, Math.min(nodesPerColumn - 1, targetNodePos));

          const targetNodeIdx = nextColStart + targetNodePos;
          connections.push(sourceNodeIdx, targetNodeIdx);
        }
      }
    }

    return {
      nodes: {
        positions,
        colors,
        sizes
      },
      indices: new Uint16Array(connections),
      count: nodeCount
    };
  }, []);

  const dummy = useMemo(() => new Matrix4(), []);
  const basePositions = useMemo(() => {
    const positions: Vector3[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(new Vector3(nodes.positions[i * 3], nodes.positions[i * 3 + 1], nodes.positions[i * 3 + 2]));
    }
    return positions;
  }, [count, nodes.positions]);
  const baseSizes = useMemo(() => nodes.sizes, [nodes.sizes]);

  useEffect(() => {
    if (spheresRef.current) {
      for (let i = 0; i < count; i++) {
        const x = nodes.positions[i * 3];
        const y = nodes.positions[i * 3 + 1];
        const z = nodes.positions[i * 3 + 2];
        const size = nodes.sizes[i];

        spheresRef.current.setColorAt(
          i,
          new THREE.Color(
            nodes.colors[i * 3],
            nodes.colors[i * 3 + 1],
            nodes.colors[i * 3 + 2]
          )
        );

        dummy.makeTranslation(x, y, z);
        dummy.scale(new THREE.Vector3(size, size, size));
        spheresRef.current.setMatrixAt(i, dummy);
      }

      spheresRef.current.instanceMatrix.needsUpdate = true;
      if (spheresRef.current.instanceColor)
        spheresRef.current.instanceColor.needsUpdate = true;
    }

    if (linesRef.current) {
      const geometry = linesRef.current.geometry as THREE.BufferGeometry;
      if (geometry && geometry.attributes.position) {
        linePositionAttributeRef.current = geometry.attributes.position as BufferAttribute;
      }
    }
  }, [count, dummy, nodes, basePositions, baseSizes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const slowTime = t * 0.15;
    const pulseTime = t * 0.8;
    const moveTime = t * 0.5;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(slowTime * 0.08) * 0.12;
      groupRef.current.position.y = Math.sin(slowTime * 0.06) * 0.25;
    }

    if (spheresRef.current && sphereMaterialRef.current && linePositionAttributeRef.current) {
      const pulseFactor = 0.05;
      const baseScale = 1.0;
      const moveAmount = 0.1;
      const linePositions = linePositionAttributeRef.current.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const pulse = Math.sin(pulseTime + i * 0.5) * pulseFactor + baseScale;
        const size = baseSizes[i] * pulse;

        const offsetX = Math.sin(moveTime + i * 0.8) * moveAmount;
        const offsetY = Math.cos(moveTime + i * 0.6) * moveAmount;

        const currentPosition = basePositions[i].clone();
        currentPosition.x += offsetX;
        currentPosition.y += offsetY;

        dummy.makeScale(size, size, size);
        dummy.setPosition(currentPosition);
        spheresRef.current.setMatrixAt(i, dummy);

        linePositions[i * 3] = currentPosition.x;
        linePositions[i * 3 + 1] = currentPosition.y;
        linePositions[i * 3 + 2] = currentPosition.z;
      }
      spheresRef.current.instanceMatrix.needsUpdate = true;
      linePositionAttributeRef.current.needsUpdate = true;

      sphereMaterialRef.current.emissiveIntensity = 0.3 + Math.sin(pulseTime * 0.7) * 0.2;
    }

    if (linesRef.current && lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.5 + Math.sin(pulseTime * 0.5) * 0.2;
    }
  });

  return (
    // Apply the scale prop to the group
    <group ref={groupRef} scale={scale}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />

      <instancedMesh
        ref={spheresRef}
        args={[undefined, undefined, count]}
      >
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial
          ref={sphereMaterialRef}
          metalness={0.3}
          roughness={0.2}
          emissive="#8B0000"
        />
      </instancedMesh>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.positions.length / 3}
            array={nodes.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={indices.length}
            array={indices}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#cc5555"
          transparent
          toneMapped={false}
          fog={false}
        />
      </lineSegments>
    </group>
  );
}
