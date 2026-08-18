"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Billboard } from "@react-three/drei";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";

// Seeded PRNG to satisfy React Compiler purity rules
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 1. Steam particle system rising from the cup mouth center
interface SteamProps {
  position: THREE.Vector3;
}

function Steam({ position }: SteamProps) {
  const particleCount = 22;
  const particles = useMemo(() => {
    const arr = [];
    let seed = 1;
    for (let i = 0; i < particleCount; i++) {
      const r1 = pseudoRandom(seed++);
      const r2 = pseudoRandom(seed++);
      const r3 = pseudoRandom(seed++);
      const r4 = pseudoRandom(seed++);
      const r5 = pseudoRandom(seed++);
      const r6 = pseudoRandom(seed++);
      const r7 = pseudoRandom(seed++);
      arr.push({
        x: (r1 - 0.5) * 0.1,
        y: r2 * 0.8,
        z: (r3 - 0.5) * 0.1,
        speed: 0.18 + r4 * 0.18,
        scale: 0.03 + r5 * 0.04,
        offset: r6 * 100,
        life: r7,
      });
    }
    return arr;
  }, []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  const steamTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(245, 240, 235, 0.35)");
      gradient.addColorStop(0.3, "rgba(240, 235, 230, 0.22)");
      gradient.addColorStop(0.6, "rgba(235, 225, 215, 0.08)");
      gradient.addColorStop(1, "rgba(235, 225, 215, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    particles.forEach((p, idx) => {
      const mesh = meshRefs.current[idx];
      if (!mesh) return;

      p.life += delta * p.speed;
      if (p.life > 1) {
        p.life = 0;
        p.x = (Math.random() - 0.5) * 0.1;
        p.y = 0.0;
        p.z = (Math.random() - 0.5) * 0.1;
      }

      const currentY = p.life * 0.8;
      const waveX = Math.sin(state.clock.elapsedTime * 1.6 + p.offset) * 0.07 * p.life;
      const waveZ = Math.cos(state.clock.elapsedTime * 1.2 + p.offset) * 0.07 * p.life;

      mesh.position.set(p.x + waveX, currentY, p.z + waveZ);

      const scaleFactor = Math.sin(p.life * Math.PI) * p.scale * 2.2;
      mesh.scale.setScalar(scaleFactor);

      if (mesh.material && "opacity" in mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p.life * Math.PI) * 0.12;
      }
    });
  });

  return (
    <group position={position}>
      {particles.map((p, i) => (
        <Billboard key={i}>
          <mesh ref={(el) => { if (el) meshRefs.current[i] = el; }}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              {...(steamTexture ? { map: steamTexture } : {})}
              transparent
              opacity={0.0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}

// 2. Realistic floating coffee beans that react directly to scroll speed & position
interface CoffeeBeansProps {
  isMobile: boolean;
}

function CoffeeBeans({ isMobile }: CoffeeBeansProps) {
  const beansRef = useRef<THREE.Group>(null);
  const prevScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  const beanData = useMemo(() => [
    { pos: [-2.4, 0.9, -1.2], speed: 1.1, rotSpeed: [0.5, 0.3, 0.2] },
    { pos: [-1.9, -0.7, 1.4], speed: 1.4, rotSpeed: [0.2, 0.6, 0.4] },
    { pos: [-1.3, 1.6, 0.9], speed: 0.9, rotSpeed: [0.4, 0.2, 0.5] },
    { pos: [1.8, -0.9, 1.1], speed: 1.5, rotSpeed: [0.3, 0.4, 0.6] },
    { pos: [2.2, 0.7, -1.0], speed: 1.0, rotSpeed: [0.6, 0.3, 0.1] },
    { pos: [1.2, 1.7, -1.4], speed: 1.3, rotSpeed: [0.1, 0.5, 0.3] },
    { pos: [-2.6, -1.1, -0.6], speed: 1.2, rotSpeed: [0.3, 0.2, 0.6] },
    { pos: [2.6, 1.3, 0.6], speed: 0.85, rotSpeed: [0.4, 0.5, 0.2] },
    { pos: [-0.9, -1.8, 1.1], speed: 1.6, rotSpeed: [0.5, 0.4, 0.3] },
    { pos: [0.9, 1.9, 0.9], speed: 1.1, rotSpeed: [0.2, 0.3, 0.5] },
  ], []);

  const beanGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 24, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      x *= 0.65; 
      y *= 0.42; 
      z *= 1.1;  

      if (y > -0.05) {
        const distToCenter = Math.abs(x);
        const crease = Math.exp(-Math.pow(distToCenter * 4.5, 2)) * 0.17;
        y -= crease;
        x += Math.sign(x) * crease * 0.08;
      }

      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const beanMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#5c3d2e"),
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.0,
      clearcoatRoughness: 0.1,
    });
  }, []);

  useFrame((state) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const deltaScroll = currentScrollY - prevScrollY.current;
    prevScrollY.current = currentScrollY;

    // Smooth scroll velocity impulse
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, deltaScroll, 0.12);

    if (beansRef.current) {
      // 1. Swirling system rotation driven by scroll position & scroll speed
      beansRef.current.rotation.y += scrollVelocity.current * 0.0025 + 0.005;
      beansRef.current.rotation.x = currentScrollY * 0.0008;
      beansRef.current.rotation.z = Math.sin(currentScrollY * 0.001) * 0.25;

      // 2. Individual bean floating & radial explosion on scroll
      beansRef.current.children.forEach((child, i) => {
        const data = beanData[i];
        if (data && child) {
          const scrollFactor = currentScrollY * 0.0025;
          const radiusExpand = 1 + Math.sin(scrollFactor + i * 0.7) * 0.35;

          child.position.x = data.pos[0] * radiusExpand + Math.sin(scrollFactor + i) * 0.3;
          child.position.y = data.pos[1] + Math.sin(state.clock.elapsedTime * data.speed + scrollFactor * 2) * 0.25 + scrollVelocity.current * 0.004;
          child.position.z = data.pos[2] * radiusExpand + Math.cos(scrollFactor + i) * 0.3;

          // Tumble rotation speed increases with scroll velocity
          const tumbleSpeed = 0.06 + Math.abs(scrollVelocity.current) * 0.006;
          child.rotation.x += tumbleSpeed * data.rotSpeed[0];
          child.rotation.y += tumbleSpeed * data.rotSpeed[1];
          child.rotation.z += tumbleSpeed * data.rotSpeed[2];
        }
      });
    }
  });

  return (
    <group ref={beansRef} scale={isMobile ? [0.65, 0.65, 0.65] : [1, 1, 1]}>
      {beanData.map((data, i) => (
        <mesh 
          key={i} 
          position={data.pos as [number, number, number]}
          scale={[0.22, 0.22, 0.22]}
          castShadow
          geometry={beanGeometry}
          material={beanMaterial}
        />
      ))}
    </group>
  );
}

// 3. Main Coffee Cup Model
interface ModelProps {
  mousePositionRef: React.RefObject<{ x: number; y: number }>;
  roast: "light" | "medium" | "dark";
  isMobile: boolean;
}

function Model({ mousePositionRef, roast, isMobile }: ModelProps) {
  const obj = useLoader(OBJLoader, "/zy8yyd4q3lkw-Coffee/koffie.obj");
  const modelRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  const scaleFactor = isMobile ? 0.003 : 0.005;

  const { coffeeModel, liquidCenter } = useMemo(() => {
    const cloned = obj.clone();
    
    let liquidColor = "#2a180e"; 
    let cupColor = "#faf6f0"; 
    let saucerColor = "#18120e"; 
    let cupRoughness = 0.05;
    let cupMetalness = 0.05;
    let cupClearcoat = 1.0;

    if (roast === "light") {
      liquidColor = "#4f2d18"; 
      cupColor = "#fbf5ed"; 
      saucerColor = "#d7c0ae"; 
    } else if (roast === "dark") {
      liquidColor = "#0b0503"; 
      cupColor = "#1e1b1a"; 
      saucerColor = "#121110"; 
      cupRoughness = 0.35; 
      cupMetalness = 0.12;
      cupClearcoat = 0.15; 
    }

    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const name = child.name.toLowerCase();
        
        if (name.includes("disc")) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(liquidColor),
            roughness: 0.1,
            metalness: 0.0,
            clearcoat: 0.4,
            clearcoatRoughness: 0.1,
            envMapIntensity: 0.15,
          });
        } else if (name.includes("loft_2")) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#d4af37"),
            roughness: 0.08,
            metalness: 0.95,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            envMapIntensity: 1.6,
          });
        } else if (name.includes("loft_1")) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(saucerColor),
            roughness: 0.35,
            metalness: 0.05,
            clearcoat: roast === "dark" ? 0.05 : 0.25,
            clearcoatRoughness: 0.25,
            envMapIntensity: 0.9,
          });
        } else {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(cupColor),
            roughness: cupRoughness,
            metalness: cupMetalness,
            clearcoat: cupClearcoat,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.3,
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    cloned.children.forEach((child) => {
      child.position.sub(center);
    });

    const liquidPos = new THREE.Vector3(0, 0.22, 0.06);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.toLowerCase().includes("disc")) {
        child.geometry.computeBoundingBox();
        if (child.geometry.boundingBox) {
          child.geometry.boundingBox.getCenter(liquidPos);
          liquidPos.add(child.position);
          liquidPos.multiplyScalar(scaleFactor);
          liquidPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 12);
        }
      }
    });

    return { coffeeModel: cloned, liquidCenter: liquidPos };
  }, [obj, roast, scaleFactor]);

  useFrame((state) => {
    const mouseX = mousePositionRef.current?.x ?? 0;
    const mouseY = mousePositionRef.current?.y ?? 0;
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    if (modelRef.current) {
      const targetRotationY = mouseX * 0.35;
      const targetRotationX = mouseY * 0.25;
      
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotationY + state.clock.elapsedTime * 0.08 + currentScrollY * 0.001,
        0.05
      );
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        targetRotationX,
        0.05
      );
      
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.07 - currentScrollY * 0.0003;
    }

    if (spotLightRef.current) {
      spotLightRef.current.position.x = mouseX * 2 + 5;
      spotLightRef.current.position.z = mouseY + 4;
    }
  });

  return (
    <>
      <spotLight 
        ref={spotLightRef}
        position={[5, 8, 4]} 
        intensity={2.5} 
        angle={Math.PI / 6}
        penumbra={0.9}
        color="#fff4e0" 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <group ref={modelRef}>
        <primitive object={coffeeModel} scale={[scaleFactor, scaleFactor, scaleFactor]} rotation={[-Math.PI / 12, 0, 0]} />
        <Steam position={liquidCenter} />
      </group>
    </>
  );
}

// 4. Main Scene Container
interface CoffeeSceneProps {
  roast?: "light" | "medium" | "dark";
}

export default function CoffeeScene({ roast = "medium" }: CoffeeSceneProps) {
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleWindowPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePositionRef.current = { x, y };
    };
    window.addEventListener("pointermove", handleWindowPointer, { passive: true });
    return () => window.removeEventListener("pointermove", handleWindowPointer);
  }, []);

  return (
    <div 
      className="w-full h-full pointer-events-none" 
      role="img"
      aria-label="Interactive 3D coffee cup featuring rising steam and customizable roast profiles"
    >
      <Canvas 
        shadows 
        camera={{ position: [0, 1.6, 4.6], fov: isMobile ? 50 : 42 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight 
          position={[-5, 4, -3]} 
          intensity={0.4} 
          color="#fbfbf9" 
        />
        <pointLight 
          position={[0, -2, 0]} 
          intensity={1.5} 
          color="#b67a4c" 
        />

        <Suspense fallback={null}>
          <Model mousePositionRef={mousePositionRef} roast={roast} isMobile={isMobile} />
          <CoffeeBeans isMobile={isMobile} />
          <Environment preset="sunset" />
        </Suspense>

        <OrbitControls 
          enableZoom={false}
          enableRotate={false}
          enablePan={false} 
        />
        
        <ContactShadows 
          position={[0, -1.0, 0]} 
          opacity={0.55} 
          scale={7} 
          blur={2.5} 
          far={3.5} 
        />
      </Canvas>
    </div>
  );
}