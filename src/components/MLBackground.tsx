import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh, Matrix4 } from 'three';

export function MLBackground() {
  const spheresRef = useRef<InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate neural network nodes in a structured layout
  const { nodes, indices, count } = useMemo(() => {
    const nodeCount = 50; // Total nodes
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);
    const connections: number[] = [];
    
    // Create neural network layers
    const layers = [10, 16, 10, 8]; // Nodes per layer
    const layerDistance = 3.0; // Distance between layers
    let nodeIndex = 0;
    
    // Create nodes for each layer
    for (let layer = 0; layer < layers.length; layer++) {
      const nodeCountInLayer = layers[layer];
      const layerX = (layer - 1.5) * layerDistance; // Center the network
      
      // Create nodes in current layer
      for (let i = 0; i < nodeCountInLayer; i++) {
        // Position nodes in a grid pattern
        const ySpacing = 4.0 / Math.max(nodeCountInLayer - 1, 1);
        const y = i * ySpacing - 2.0; // Center vertically
        
        // Add randomness for natural look - reduced jitter to ensure better alignment
        const jitterX = (Math.random() - 0.5) * 0.1;
        const jitterY = (Math.random() - 0.5) * 0.1;
        const jitterZ = (Math.random() - 0.5) * 0.1;
        
        // Set position
        positions[nodeIndex * 3] = layerX + jitterX;
        positions[nodeIndex * 3 + 1] = y + jitterY;
        positions[nodeIndex * 3 + 2] = -5 + jitterZ; // Push back in Z
        
        // Set color - Red with variations
        colors[nodeIndex * 3] = 0.6 + Math.random() * 0.3; // Red
        colors[nodeIndex * 3 + 1] = 0.0 + Math.random() * 0.1; // Almost no green
        colors[nodeIndex * 3 + 2] = 0.0 + Math.random() * 0.1; // Almost no blue
        
        // Vary node sizes
        sizes[nodeIndex] = 0.1 + Math.random() * 0.1;
        
        nodeIndex++;
      }
      
      // Connect to next layer
      if (layer < layers.length - 1) {
        const startIdx = nodeIndex - layers[layer];
        const endIdx = nodeIndex;
        const nextLayerStart = endIdx;
        const nextLayerEnd = nextLayerStart + layers[layer + 1];
        
        // Create connections between current and next layer
        for (let i = startIdx; i < endIdx; i++) {
          // Each node connects to 2-3 nodes in the next layer
          const connectionCount = 2 + Math.floor(Math.random() * 2);
          
          for (let c = 0; c < connectionCount; c++) {
            // Pick a random node in the next layer
            const targetIdx = nextLayerStart + Math.floor(Math.random() * layers[layer + 1]);
            
            // Add the connection indices
            connections.push(i, targetIdx);
          }
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

  // Set up instance matrices on first render
  const dummy = useMemo(() => new Matrix4(), []);

  // Set up sphere instances
  React.useLayoutEffect(() => {
    if (spheresRef.current) {
      // Create a matrix for each sphere position
      for (let i = 0; i < count; i++) {
        const x = nodes.positions[i * 3];
        const y = nodes.positions[i * 3 + 1];
        const z = nodes.positions[i * 3 + 2];
        const size = nodes.sizes[i];
        
        // Create color for this instance
        spheresRef.current.setColorAt(
          i, 
          new THREE.Color(
            nodes.colors[i * 3], 
            nodes.colors[i * 3 + 1], 
            nodes.colors[i * 3 + 2]
          )
        );
        
        // Position and scale the sphere
        dummy.makeTranslation(x, y, z);
        dummy.scale(new THREE.Vector3(size, size, size));
        spheresRef.current.setMatrixAt(i, dummy);
      }
      
      spheresRef.current.instanceMatrix.needsUpdate = true;
      if (spheresRef.current.instanceColor) 
        spheresRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, dummy, nodes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    
    // Animate nodes
    if (spheresRef.current) {
      spheresRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    
    // Animate connections
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />

      {/* Neural Network Nodes as 3D Spheres */}
      <instancedMesh 
        ref={spheresRef} 
        args={[undefined, undefined, count]}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          metalness={0.2} 
          roughness={0.3}
          emissive="#8B0000"
          emissiveIntensity={0.2}
        />
      </instancedMesh>

      {/* Neural Network Connections */}
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
        <lineBasicMaterial color="#8B0000" opacity={0.4} transparent />
      </lineSegments>
    </>
  );
}
