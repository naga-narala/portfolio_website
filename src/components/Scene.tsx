import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Scene() {
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (boxRef.current) {
      boxRef.current.rotation.x = time * 0.2;
      boxRef.current.rotation.y = time * 0.4;
      boxRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ff4444" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8B0000" />
      
      <Box ref={boxRef} args={[3, 1, 1]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#8B0000"
          roughness={0.3}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </Box>
    </>
  );
}