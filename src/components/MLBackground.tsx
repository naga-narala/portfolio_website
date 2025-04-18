import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a circular point texture
const createCircleTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  if (context) {
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export function MLBackground() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Create point texture once
  const pointTexture = useMemo(() => createCircleTexture(), []);

  // Generate neural network nodes in a structured layout
  const { nodes, indices } = useMemo(() => {
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
        
        // Add randomness for natural look
        const jitterX = (Math.random() - 0.5) * 0.3;
        const jitterY = (Math.random() - 0.5) * 0.3;
        const jitterZ = (Math.random() - 0.5) * 0.3;
        
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
      indices: new Uint16Array(connections)
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    
    // Animate nodes
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
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

      {/* Neural Network Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.positions.length / 3}
            array={nodes.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.colors.length / 3}
            array={nodes.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={nodes.sizes.length}
            array={nodes.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

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
