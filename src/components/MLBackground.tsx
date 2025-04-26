import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Matrix4, Vector3, LineBasicMaterial, MeshStandardMaterial, BufferAttribute } from 'three';

interface MLBackgroundProps {
  scale?: number | [number, number, number];
}

export function MLBackground({ scale = 1.0 }: MLBackgroundProps) {
  const spheresRef = useRef<InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sphereMaterialRef = useRef<MeshStandardMaterial>(null);
  const lineMaterialRef = useRef<LineBasicMaterial>(null);
  const linePositionAttributeRef = useRef<BufferAttribute | null>(null);

  // Create the neural network structure
  const networkData = useMemo(() => {
    // Define the structure of our neural network
    const columns = 3; // Three vertical lines of neurons
    const nodesPerColumn = 10; // 10 neurons per column for cleaner look
    const nodeCount = columns * nodesPerColumn;

    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);
    const rotations = new Float32Array(nodeCount * 4); // Quaternions for rotation (x,y,z,w)
    const connections: number[] = [];

    const columnSpacing = 4.0; // Horizontal spacing between columns
    const verticalSpread = 14.0; // Vertical spread of the neurons

    let nodeIndex = 0;

    // Create three vertical lines of neurons
    for (let col = 0; col < columns; col++) {
      const colX = (col - 1) * columnSpacing; // Position columns at -4, 0, 4

      for (let i = 0; i < nodesPerColumn; i++) {
        // Calculate vertical position - evenly spaced from top to bottom
        const verticalPosition = (i / (nodesPerColumn - 1)) * verticalSpread - (verticalSpread / 2);

        // Position neurons in straight vertical lines with minimal jitter for natural look
        const jitterX = (Math.random() - 0.5) * 0.05; // Very minimal horizontal jitter
        const jitterY = (Math.random() - 0.5) * 0.05; // Very minimal vertical jitter
        const jitterZ = (Math.random() - 0.5) * 0.05; // Very minimal depth jitter

        positions[nodeIndex * 3] = colX + jitterX;
        positions[nodeIndex * 3 + 1] = verticalPosition + jitterY;
        positions[nodeIndex * 3 + 2] = -2 + jitterZ;

        // Brighter, more saturated colors for better visibility
        if ((col + i) % 2 === 0) {
          // Bright purple nodes (#8A5CF7)
          colors[nodeIndex * 3] = 0.54;     // R
          colors[nodeIndex * 3 + 1] = 0.36; // G
          colors[nodeIndex * 3 + 2] = 0.97; // B
        } else {
          // Bright green nodes (#44FF8B)
          colors[nodeIndex * 3] = 0.27;     // R
          colors[nodeIndex * 3 + 1] = 1.0;  // G - increased to max
          colors[nodeIndex * 3 + 2] = 0.54; // B
        }

        // Increased sphere size for better visibility
        sizes[nodeIndex] = 0.45; // Slightly larger
        
        // Random initial rotation for each sphere
        const quaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          )
        );
        rotations[nodeIndex * 4] = quaternion.x;
        rotations[nodeIndex * 4 + 1] = quaternion.y;
        rotations[nodeIndex * 4 + 2] = quaternion.z;
        rotations[nodeIndex * 4 + 3] = quaternion.w;

        nodeIndex++;
      }
    }

    // Create connections between adjacent columns for a neural network look
    for (let col = 0; col < columns - 1; col++) {
      const currentColStart = col * nodesPerColumn;
      const nextColStart = (col + 1) * nodesPerColumn;

      // Each neuron connects to multiple neurons in the next column
      for (let i = 0; i < nodesPerColumn; i++) {
        const sourceNodeIdx = currentColStart + i;

        // Connect each neuron to neurons in the next column
        for (let j = 0; j < nodesPerColumn; j++) {
          // Create more connections for denser network
          if (j % 2 === 0 || i % 2 === 0) {
            const targetNodeIdx = nextColStart + j;
            connections.push(sourceNodeIdx, targetNodeIdx);
          }
        }
      }
    }

    return {
      positions,
      colors,
      sizes,
      rotations,
      indices: new Uint16Array(connections),
      count: nodeCount
    };
  }, []);

  const dummy = useMemo(() => new Matrix4(), []);
  
  // Create base positions for animation
  const basePositions = useMemo(() => {
    const positions: Vector3[] = [];
    for (let i = 0; i < networkData.count; i++) {
      positions.push(new Vector3(
        networkData.positions[i * 3], 
        networkData.positions[i * 3 + 1], 
        networkData.positions[i * 3 + 2]
      ));
    }
    return positions;
  }, [networkData]);
  
  // Store rotation quaternions
  const baseRotations = useMemo(() => {
    const rotations: THREE.Quaternion[] = [];
    for (let i = 0; i < networkData.count; i++) {
      rotations.push(new THREE.Quaternion(
        networkData.rotations[i * 4],
        networkData.rotations[i * 4 + 1],
        networkData.rotations[i * 4 + 2],
        networkData.rotations[i * 4 + 3]
      ));
    }
    return rotations;
  }, [networkData]);

  // Initialize the instancedMesh on component mount
  useEffect(() => {
    if (spheresRef.current) {
      for (let i = 0; i < networkData.count; i++) {
        const x = networkData.positions[i * 3];
        const y = networkData.positions[i * 3 + 1];
        const z = networkData.positions[i * 3 + 2];
        const size = networkData.sizes[i];

        spheresRef.current.setColorAt(
          i,
          new THREE.Color(
            networkData.colors[i * 3],
            networkData.colors[i * 3 + 1],
            networkData.colors[i * 3 + 2]
          )
        );

        dummy.makeTranslation(x, y, z);
        
        // Scale uniformly to ensure perfect spheres
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
  }, [networkData, dummy, basePositions]);

  // Animation frame update
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const slowTime = t * 0.15;
    const pulseTime = t * 0.8;

    if (groupRef.current) {
      // Removed horizontal rotation that was causing drift
      // Only allow very subtle vertical movement
      groupRef.current.position.y = Math.sin(slowTime * 0.06) * 0.25;
    }

    if (spheresRef.current && sphereMaterialRef.current && linePositionAttributeRef.current) {
      const pulseFactor = 0.02; // Reduced pulse factor for more consistent sphere size
      const baseScale = 1.0;
      // Reduced movement for straighter lines
      const moveAmount = 0.03;
      const linePositions = linePositionAttributeRef.current.array as Float32Array;

      for (let i = 0; i < networkData.count; i++) {
        // Very subtle pulse effect on spheres
        const pulse = Math.sin(pulseTime + i * 0.5) * pulseFactor + baseScale;
        const size = networkData.sizes[i] * pulse;

        // Very minimal movement to maintain straight lines, removed X movement to prevent drift
        const offsetY = Math.cos(t * 0.2 + i * 0.6) * moveAmount;

        const currentPosition = basePositions[i].clone();
        // Remove X offset to prevent horizontal drift
        currentPosition.y += offsetY;

        // Create rotation quaternion for this frame
        const rotSpeed = 0.2 + (i % 5) * 0.05; // Different rotation speeds
        const rotQuat = baseRotations[i].clone();
        const tempQuat = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), // Rotation around Y axis
          t * rotSpeed
        );
        rotQuat.premultiply(tempQuat);

        // Reset the matrix to identity before applying transformations
        dummy.identity();
        
        // Apply rotation to the matrix
        dummy.makeRotationFromQuaternion(rotQuat);
        
        // Then apply position
        dummy.setPosition(currentPosition.x, currentPosition.y, currentPosition.z);
        
        // Then apply uniform scale to ensure perfect spheres
        const uniformScale = size;
        dummy.scale(new THREE.Vector3(uniformScale, uniformScale, uniformScale));
        
        spheresRef.current.setMatrixAt(i, dummy);

        linePositions[i * 3] = currentPosition.x;
        linePositions[i * 3 + 1] = currentPosition.y;
        linePositions[i * 3 + 2] = currentPosition.z;
      }
      spheresRef.current.instanceMatrix.needsUpdate = true;
      linePositionAttributeRef.current.needsUpdate = true;

      // Increase emissive intensity for better visibility
      sphereMaterialRef.current.emissiveIntensity = 0.5 + Math.sin(pulseTime * 0.7) * 0.2;
    }

    if (linesRef.current && lineMaterialRef.current) {
      // Keep lines consistently visible with high opacity
      lineMaterialRef.current.opacity = 1; /* Full opacity */
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#8C6BC8" />

      <instancedMesh
        ref={spheresRef}
        args={[undefined, undefined, networkData.count]}
      >
        <sphereGeometry args={[0.24, 32, 32]} /> {/* Higher segment count for perfectly smooth spheres */}
        <meshStandardMaterial
          ref={sphereMaterialRef}
          metalness={0.4}
          roughness={0.2}
          emissive="#8C6BC8"
        />
      </instancedMesh>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={networkData.positions.length / 3}
            array={networkData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={networkData.indices.length}
            array={networkData.indices}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#1A7F53" /* Using a much darker green color instead of #44B78B */
          transparent
          opacity={1} /* Full opacity */
          linewidth={6} /* Much thicker lines (note: this is ignored in WebGL but kept for clarity) */
          toneMapped={false}
          fog={false}
        />
      </lineSegments>
    </group>
  );
}
