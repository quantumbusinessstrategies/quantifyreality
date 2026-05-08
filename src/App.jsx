import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const codeFragments = [
  'void::signal',
  'qbit.fold()',
  '0xREALITY',
  'bio://pulse',
  'sum(memory)',
  'dream.seed',
  'self.impose',
  'light->data',
  'neuron[]',
  'if(alive)',
  'entropy:low',
  'recursion++',
  'quantize()',
  'origin:null',
  'signal.birth',
  'psi.observe',
  '0101:MORPH',
  'lambda_soma',
  'if(fear){rise}',
  'dna.hash',
  'rna.compile',
  'godform.err',
  'cell.boot',
  'limbic.root',
  'neural_key',
  'axiom:false',
  'maya.loop',
  'logos.exe',
];

const titlePixelFragments = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: (index * 11.7) % 96,
  y: 8 + ((index * 19) % 78),
  width: 2 + (index % 5) * 1.5,
  delay: index * -0.047,
  color: ['#79ffdf', '#62f8ff', '#ff72cc', '#ffd06f', '#b69cff'][index % 5],
}));

function createTitleBlockFragments() {
  return Array.from({ length: 22 }, (_, index) => ({
    id: `${index}-${Math.random()}`,
    x: Math.random() * 98,
    y: 4 + Math.random() * 86,
    width: 2 + Math.random() * 17,
    height: 5 + Math.random() * 24,
    delay: Math.random() * -1.35,
    stretchX: 0.6 + Math.random() * 2.6,
    stretchY: 0.45 + Math.random() * 1.8,
  }));
}

function useRandomDropout(minGap = 5000, maxGap = 14000) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let gapTimer;
    let showTimer;
    let alive = true;

    const schedule = () => {
      const nextGap = minGap + Math.random() * (maxGap - minGap);
      gapTimer = setTimeout(() => {
        if (!alive) return;
        setHidden(true);
        const outage = 1000 + Math.random() * 2000;
        showTimer = setTimeout(() => {
          if (!alive) return;
          setHidden(false);
          schedule();
        }, outage);
      }, nextGap);
    };

    schedule();

    return () => {
      alive = false;
      clearTimeout(gapTimer);
      clearTimeout(showTimer);
    };
  }, [minGap, maxGap]);

  return hidden;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function InfoSea() {
  const mesh = useRef();
  const glow = useRef();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uBreath: { value: 0 },
          uFailure: { value: 0 },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uBreath;
          uniform float uFailure;
          varying float vElevation;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
              value += amplitude * noise(p);
              p *= 2.04;
              amplitude *= 0.5;
            }
            return value;
          }

          void main() {
            vUv = uv;
            vec3 p = position;
            float waveA = sin(p.x * 0.72 + uTime * 0.34) * 0.55;
            float waveB = cos(p.y * 0.52 - uTime * 0.28) * 0.45;
            float organic = fbm(p.xy * 0.35 + vec2(uTime * 0.035, -uTime * 0.022));
            float cellular = sin((p.x + p.y) * 1.8 + uTime * 0.65) * 0.12;
            float machineTear = step(0.78, sin(p.y * 13.0 + uTime * 9.0)) * sin(uTime * 22.0 + p.x * 4.0);
            p.z += waveA + waveB + organic * 2.15 + cellular + uBreath * 0.35;
            p.z += machineTear * uFailure * 0.7;
            p.x += step(0.9, sin(p.y * 18.0 + uTime * 13.0)) * uFailure * 0.42;
            p.x += sin(p.y * 0.17 + uTime * 0.14) * 0.22;
            p.y += cos(p.x * 0.13 - uTime * 0.1) * 0.16;
            vElevation = p.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uFailure;
          varying float vElevation;
          varying vec2 vUv;

          void main() {
            vec3 cyan = vec3(0.16, 0.98, 1.0);
            vec3 pink = vec3(1.0, 0.26, 0.72);
            vec3 violet = vec3(0.57, 0.34, 1.0);
            vec3 ember = vec3(1.0, 0.55, 0.18);
            float strata = sin(vUv.x * 22.0 + vUv.y * 15.0 + uTime * 0.7) * 0.5 + 0.5;
            float tear = step(0.93, sin(vUv.y * 95.0 + uTime * 18.0)) * uFailure;
            float pulse = sin(uTime * 0.8 + vElevation * 1.4) * 0.5 + 0.5;
            vec3 color = mix(cyan, pink, smoothstep(-1.0, 2.3, vElevation));
            color = mix(color, violet, strata * 0.45);
            color = mix(color, ember, pow(pulse, 5.0) * 0.65);
            color = mix(color, vec3(1.0, 1.0, 1.0), tear * 0.68);
            float alpha = 0.18 + smoothstep(-0.9, 2.8, vElevation) * 0.42;
            alpha *= 0.72 + strata * 0.26 + tear * 0.7;
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    material.uniforms.uBreath.value = Math.sin(time * 0.42);
    material.uniforms.uFailure.value = Math.pow(Math.max(0, Math.sin(time * 1.7) * Math.sin(time * 5.1)), 3.0);
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(time * 0.07) * 0.045;
      mesh.current.position.z = Math.sin(time * 0.22) * 0.22;
    }
    if (glow.current) {
      glow.current.rotation.z = time * 0.035;
      glow.current.scale.setScalar(1 + Math.sin(time * 0.36) * 0.035);
    }
  });

  return (
    <group rotation={[-1.18, 0, 0]} position={[0, -2.1, -2.35]}>
      <mesh ref={mesh} material={material}>
        <planeGeometry args={[24, 18, 150, 108]} />
      </mesh>
      <mesh ref={glow} position={[0, 0, -0.42]}>
        <torusGeometry args={[5.3, 0.018, 8, 240]} />
        <meshBasicMaterial color="#50f7ff" transparent opacity={0.34} />
      </mesh>
      <mesh position={[0, 0.1, -0.72]}>
        <torusGeometry args={[7.4, 0.012, 8, 260]} />
        <meshBasicMaterial color="#ff52b7" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function DataNodes() {
  const group = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: 58 }, (_, index) => ({
      id: index,
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.52) * 9,
        (Math.random() - 0.5) * 7,
      ],
      scale: 0.025 + Math.random() * 0.075,
      stretch: [0.7 + Math.random() * 1.6, 0.55 + Math.random() * 1.8, 0.7 + Math.random() * 1.6],
      color: ['#5cf7ff', '#ff6ccf', '#9b7cff', '#ff9e42'][index % 4],
      shape: index % 5,
      seed: Math.random() * 99,
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.08) * 0.18;
      group.current.rotation.x = Math.cos(time * 0.06) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {particles.map((particle) => (
        <Float key={particle.id} speed={0.4} rotationIntensity={0.55} floatIntensity={1.2}>
          <mesh position={particle.position} scale={particle.stretch.map((value) => value * particle.scale)}>
            {particle.shape === 0 && <icosahedronGeometry args={[1, 1]} />}
            {particle.shape === 1 && <octahedronGeometry args={[1.1, 0]} />}
            {particle.shape === 2 && <tetrahedronGeometry args={[1.25, 0]} />}
            {particle.shape === 3 && <boxGeometry args={[1.3, 1.3, 1.3, 1, 1, 1]} />}
            {particle.shape === 4 && <torusGeometry args={[0.82, 0.08, 5, 12]} />}
            <meshBasicMaterial color={particle.color} transparent opacity={0.78} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ConsciousnessCore() {
  const core = useRef();
  const shell = useRef();
  const veins = useRef();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normal;
            vec3 p = position;
            float pulse = sin(uTime * 1.2 + p.y * 5.0) * 0.045;
            float twitch = sin(uTime * 7.0 + p.x * 12.0) * sin(uTime * 2.2 + p.z * 9.0) * 0.018;
            p += normal * (pulse + twitch);
            vPosition = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
            float tissue = sin(vPosition.x * 11.0 + uTime * 1.1) * sin(vPosition.y * 9.0 - uTime * 0.8);
            float synapse = smoothstep(0.48, 0.95, tissue);
            vec3 cold = vec3(0.18, 0.95, 1.0);
            vec3 blood = vec3(1.0, 0.18, 0.58);
            vec3 violet = vec3(0.65, 0.38, 1.0);
            vec3 color = mix(cold, blood, synapse);
            color = mix(color, violet, rim);
            float alpha = 0.13 + rim * 0.38 + synapse * 0.2;
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  );

  const veinSystem = useMemo(() => {
    const group = new THREE.Group();
    const colors = ['#63f8ff', '#ff5ebd', '#a882ff', '#ff9f4c'];
    for (let i = 0; i < 26; i += 1) {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 1.65 + (i % 5) * 0.09;
      const points = [];
      for (let j = 0; j < 44; j += 1) {
        const t = j / 43;
        const curl = angle + t * 1.8 + Math.sin(t * 7 + i) * 0.16;
        points.push(
          new THREE.Vector3(
            Math.cos(curl) * radius * (1 - t * 0.52),
            (t - 0.5) * 4.6 + Math.sin(t * 12 + i) * 0.24,
            Math.sin(curl) * radius * (1 - t * 0.42),
          ),
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
        }),
      );
      group.add(line);
    }
    return group;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    if (core.current) {
      core.current.rotation.y = Math.sin(time * 0.19) * 0.34;
      core.current.rotation.z = Math.sin(time * 0.13) * 0.13;
      core.current.scale.setScalar(1 + Math.sin(time * 0.54) * 0.055);
    }
    if (shell.current) {
      shell.current.rotation.y = -time * 0.18;
      shell.current.rotation.x = Math.sin(time * 0.2) * 0.18;
    }
    if (veins.current) {
      veins.current.rotation.y = time * 0.1;
      veins.current.rotation.z = Math.sin(time * 0.16) * 0.1;
    }
  });

  return (
    <group position={[0, 0.15, -1.15]}>
      <primitive object={veinSystem} ref={veins} />
      <mesh ref={core} material={material}>
        <sphereGeometry args={[1.38, 64, 64]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.88, 0.018, 8, 180]} />
        <meshBasicMaterial color="#ff64c8" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
        <torusGeometry args={[2.34, 0.012, 8, 220]} />
        <meshBasicMaterial color="#68f8ff" transparent opacity={0.26} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.38, 0.2, Math.PI / 2]}>
        <torusGeometry args={[2.72, 0.009, 8, 220]} />
        <meshBasicMaterial color="#ffa24a" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={shell} scale={[1.72, 1.72, 1.72]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#d8fbff" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function BioHelix() {
  const group = useRef();
  const helix = useMemo(() => {
    const makeStrand = (offset) => {
      const points = [];
      for (let i = 0; i < 180; i += 1) {
        const t = i / 179;
        const angle = t * Math.PI * 9 + offset;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * 0.92,
            (t - 0.5) * 6.3,
            Math.sin(angle) * 0.92,
          ),
        );
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    };

    const rungs = [];
    for (let i = 0; i < 44; i += 1) {
      const t = i / 43;
      const angle = t * Math.PI * 9;
      rungs.push(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(angle) * 0.92, (t - 0.5) * 6.3, Math.sin(angle) * 0.92),
          new THREE.Vector3(Math.cos(angle + Math.PI) * 0.92, (t - 0.5) * 6.3, Math.sin(angle + Math.PI) * 0.92),
        ]),
      );
    }

    return { left: makeStrand(0), right: makeStrand(Math.PI), rungs };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.24;
      group.current.rotation.x = Math.sin(time * 0.17) * 0.26;
      group.current.position.y = Math.sin(time * 0.35) * 0.18;
    }
  });

  return (
    <group ref={group} position={[-3.8, 0.1, -1.9]} rotation={[0.25, 0, -0.28]} scale={[1, 1, 1]}>
      <line geometry={helix.left}>
        <lineBasicMaterial color="#5ff8ff" transparent opacity={0.46} />
      </line>
      <line geometry={helix.right}>
        <lineBasicMaterial color="#ff5ec8" transparent opacity={0.42} />
      </line>
      {helix.rungs.map((geometry, index) => (
        <line key={index} geometry={geometry}>
          <lineBasicMaterial color={index % 2 ? '#ffc069' : '#b18cff'} transparent opacity={0.22} />
        </line>
      ))}
    </group>
  );
}

function SacredEngine() {
  const sigil = useRef();
  const system = useMemo(() => {
    const group = new THREE.Group();
    const materialA = new THREE.LineBasicMaterial({
      color: '#72faff',
      transparent: true,
      opacity: 0.19,
      blending: THREE.AdditiveBlending,
    });
    const materialB = new THREE.LineBasicMaterial({
      color: '#ff67c9',
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    for (let ring = 0; ring < 7; ring += 1) {
      const radius = 1.2 + ring * 0.52;
      const points = [];
      const sides = ring % 2 ? 6 : 3;
      for (let i = 0; i <= sides; i += 1) {
        const angle = (i / sides) * Math.PI * 2 + ring * 0.18;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ring % 2 ? materialA : materialB));
    }

    for (let i = 0; i < 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2;
      group.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0),
            new THREE.Vector3(Math.cos(angle) * 4.65, Math.sin(angle) * 4.65, 0),
          ]),
          i % 2 ? materialA : materialB,
        ),
      );
    }
    return group;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (sigil.current) {
      sigil.current.rotation.z = time * 0.055;
      sigil.current.rotation.x = Math.sin(time * 0.12) * 0.2;
      sigil.current.scale.setScalar(1 + Math.sin(time * 0.31) * 0.04);
    }
  });

  return <primitive object={system} ref={sigil} position={[2.1, 0.4, -2.9]} rotation={[0.18, -0.52, 0]} />;
}

function GlitchPlanes() {
  const group = useRef();
  const planes = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        id: index,
        position: [
          (Math.random() - 0.5) * 13.5,
          (Math.random() - 0.45) * 6.3,
          -3.8 + Math.random() * 3.4,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: [0.2 + Math.random() * 1.1, 0.008 + Math.random() * 0.045, 1],
        color: ['#61f7ff', '#ff4ebd', '#a477ff', '#ff9c45'][index % 4],
        opacity: 0.08 + Math.random() * 0.16,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) {
      group.current.children.forEach((child, index) => {
        child.position.x += Math.sin(time * 1.7 + index) * 0.002;
        child.rotation.z += Math.sin(time * 2.1 + index) * 0.002;
        child.visible = Math.sin(time * 4.2 + index * 2.7) > -0.82;
        child.scale.x = planes[index].scale[0] * (1 + Math.max(0, Math.sin(time * 8 + index)) * 1.4);
      });
    }
  });

  return (
    <group ref={group}>
      {planes.map((plane) => (
        <mesh key={plane.id} position={plane.position} rotation={plane.rotation} scale={plane.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={plane.color} transparent opacity={plane.opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <Canvas dpr={[1, 1.35]} gl={{ antialias: true, alpha: true }} className="cosmos-canvas">
      <PerspectiveCamera makeDefault position={[0, 0.25, 8.4]} fov={53} />
      <color attach="background" args={['#020105']} />
      <fog attach="fog" args={['#04010a', 7, 19]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[-4, 3, 4]} color="#55eaff" intensity={16} distance={16} />
      <pointLight position={[5, -2, 2]} color="#ff58be" intensity={13} distance={14} />
      <pointLight position={[0, 4, -3]} color="#ff9d4c" intensity={7} distance={12} />
      <Sparkles count={145} speed={0.2} size={1.95} scale={[17, 9, 10]} color="#b8fbff" opacity={0.36} />
      <InfoSea />
      <ConsciousnessCore />
      <BioHelix />
      <SacredEngine />
      <GlitchPlanes />
      <DataNodes />
    </Canvas>
  );
}

function GlitchTitle() {
  const [blocks, setBlocks] = useState(() => createTitleBlockFragments());
  const [failure, setFailure] = useState({
    x: 0,
    y: 0,
    skew: 0,
    depth: 0,
    slice: 'inset(0 0 0 0)',
    phaseX: 0,
    phaseY: 34,
  });

  useEffect(() => {
    let phaseTimer;
    let blockTimer;

    const schedulePhase = () => {
      phaseTimer = setTimeout(() => {
        const hardJump = Math.random() > 0.38;
        const quadrant = Math.floor(Math.random() * 4);
        const xTargets = [-30, -18, 16, 30];
        const yTargets = [13, 22, 34, 47];
        setFailure((current) => ({
          ...current,
          phaseX: hardJump ? xTargets[quadrant] + (Math.random() - 0.5) * 9 : -13 + Math.random() * 26,
          phaseY: hardJump ? yTargets[quadrant] + (Math.random() - 0.5) * 7 : 18 + Math.random() * 30,
          depth: hardJump ? 14 + Math.random() * 32 : Math.random() * 12,
        }));
        schedulePhase();
      }, 520 + Math.random() * 2300);
    };

    const scheduleBlocks = () => {
      blockTimer = setTimeout(() => {
        setBlocks(createTitleBlockFragments());
        scheduleBlocks();
      }, 700 + Math.random() * 2200);
    };

    const timers = [
      setInterval(() => {
        const violent = Math.random() > 0.56;
        setFailure((current) => ({
          ...current,
          x: violent ? (Math.random() - 0.5) * 22 : (Math.random() - 0.5) * 5,
          y: violent ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 3,
          skew: violent ? (Math.random() - 0.5) * 12 : (Math.random() - 0.5) * 2,
          depth: violent ? Math.random() * 24 : Math.random() * 7,
          slice: violent
            ? `inset(${Math.random() * 24}% 0 ${Math.random() * 24}% 0)`
            : 'inset(0 0 0 0)',
        }));
      }, 180),
      setInterval(() => {
        setFailure((current) => ({
          ...current,
          x: 0,
          y: 0,
          skew: 0,
          depth: current.depth * 0.25,
          slice: 'inset(0 0 0 0)',
        }));
      }, 760),
    ];

    schedulePhase();
    scheduleBlocks();

    return () => {
      timers.forEach((timer) => clearInterval(timer));
      clearTimeout(phaseTimer);
      clearTimeout(blockTimer);
    };
  }, []);

  return (
    <motion.div
      className="title-system"
      style={{
        '--tx': `${failure.x}px`,
        '--ty': `${failure.y}px`,
        '--tskew': `${failure.skew}deg`,
        '--tdepth': `${failure.depth}px`,
        '--tslice': failure.slice,
        '--phase-x': `${failure.phaseX}vw`,
        '--phase-y': `${failure.phaseY}%`,
      }}
      initial={{ opacity: 0, y: 34, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, filter: ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(0px)'] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <h1 className="hero-title" data-text="QUANTIFYREALITY">
        <span className="title-etch" aria-hidden="true" />
        <span className="title-pixel-cloud" aria-hidden="true">
          {titlePixelFragments.map((fragment) => (
            <i
              key={fragment.id}
              style={{
                '--px': `${fragment.x}%`,
                '--py': `${fragment.y}%`,
                '--pw': `${fragment.width}%`,
                '--pd': `${fragment.delay}s`,
                '--pc': fragment.color,
              }}
            />
          ))}
        </span>
        <span className="title-block-cloud" aria-hidden="true">
          {blocks.map((fragment) => (
            <i
              key={fragment.id}
              style={{
                '--bx': `${fragment.x}%`,
                '--by': `${fragment.y}%`,
                '--bw': `${fragment.width}%`,
                '--bh': `${fragment.height}%`,
                '--bd': `${fragment.delay}s`,
                '--bsx': fragment.stretchX,
                '--bsy': fragment.stretchY,
              }}
            />
          ))}
        </span>
        QUANTIFYREALITY
      </h1>
      <span className="title-ghost title-ghost-a">QUANTIFYREALITY</span>
      <span className="title-ghost title-ghost-b">QUANTIFYREALITY</span>
      <span className="title-depth title-depth-a">QUANTIFYREALITY</span>
      <span className="title-depth title-depth-b">QUANTIFYREALITY</span>
    </motion.div>
  );
}

function Terminal() {
  const [value, setValue] = useState('');
  const hidden = useRandomDropout(7000, 18000);

  return (
    <div className={`terminal-shell ${hidden ? 'is-offline' : ''}`} aria-label="DOS-style terminal input">
      <div className="terminal-lines" aria-hidden="true">
        <span>QR-DOS [v0.00.INF]</span>
        <span>C:\REALITY\SEED&gt; consciousness /wake /cold-light</span>
      </div>
      <label className="prompt-line">
        <span>C:\QUANTIFY&gt;</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck="false"
          aria-label="Reality command"
          autoComplete="off"
        />
      </label>
    </div>
  );
}

function ExecuteButton() {
  const hidden = useRandomDropout(6000, 16000);

  return (
    <motion.button
      className={`execute-button ${hidden ? 'is-offline' : ''}`}
      type="button"
      whileHover={{
        scale: 1.025,
        textShadow: '3px 0 #5cf7ff, -3px 0 #ff49bd',
      }}
      whileTap={{ scale: 0.985 }}
      animate={{
        x: [0, 0, -1, 1, 0, 0, 2, -2, 0],
        clipPath: [
          'inset(0 0 0 0)',
          'inset(0 0 0 0)',
          'inset(8% 0 14% 0)',
          'inset(0 0 0 0)',
          'inset(18% 0 8% 0)',
          'inset(0 0 0 0)',
        ],
      }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'steps(1)' }}
    >
      SELFIMPOSEQUANTIFY.EXE
    </motion.button>
  );
}

function CodeRain() {
  return (
    <div className="code-rain" aria-hidden="true">
      {codeFragments.map((fragment, index) => (
        <span
          key={fragment}
          style={{
            '--x': `${(index * 7.7) % 96}%`,
            '--delay': `${index * -1.13}s`,
            '--duration': `${16 + (index % 8) * 1.9}s`,
          }}
        >
          {fragment}
        </span>
      ))}
    </div>
  );
}

function GlyphVeil() {
  const glyphs = [
    '01001001',
    'while(alive)',
    'soma.parse',
    'ADENINE',
    'CYTOSINE',
    'RNA::LOOP',
    'fractal womb',
    'if self != self',
    'limbic kernel',
    'axiom breach',
    'MORPHOGEN',
    'lambda flesh',
    'recursion bone',
    'machine hymn',
    'protein key',
    'blood clock',
    'null prayer',
    'body.exe',
  ];

  return (
    <div className="glyph-veil" aria-hidden="true">
      {glyphs.map((glyph, index) => (
        <span
          key={glyph}
          style={{
            '--gx': `${(index * 13.8) % 94}%`,
            '--gy': `${8 + ((index * 19) % 78)}%`,
            '--gdelay': `${index * -0.37}s`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}

function MoleculeLattice() {
  const nodes = Array.from({ length: 14 }, (_, index) => ({
    id: index,
    x: (index * 23) % 97,
    y: 7 + ((index * 31) % 86),
    s: 4 + (index % 5) * 2,
  }));
  const bonds = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    x: (index * 29) % 96,
    y: 9 + ((index * 17) % 82),
    w: 38 + (index % 6) * 21,
    r: -70 + (index * 37) % 140,
  }));

  return (
    <div className="molecule-lattice" aria-hidden="true">
      {bonds.map((bond) => (
        <i
          key={bond.id}
          style={{
            '--mx': `${bond.x}%`,
            '--my': `${bond.y}%`,
            '--mw': `${bond.w}px`,
            '--mr': `${bond.r}deg`,
          }}
        />
      ))}
      {nodes.map((node) => (
        <span
          key={node.id}
          style={{
            '--mx': `${node.x}%`,
            '--my': `${node.y}%`,
            '--ms': `${node.s}px`,
          }}
        />
      ))}
    </div>
  );
}

function FailureInterference() {
  const [bursts, setBursts] = useState(() =>
    Array.from({ length: 12 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: 5 + Math.random() * 38,
      h: 1 + Math.random() * 10,
      hue: index % 4,
      rot: (Math.random() - 0.5) * 24,
      live: Math.random() > 0.5,
    })),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setBursts((items) =>
        items.map((item) => ({
          ...item,
          x: item.live ? item.x + (Math.random() - 0.5) * 6 : Math.random() * 100,
          y: item.live ? item.y + (Math.random() - 0.5) * 4 : Math.random() * 100,
          w: 4 + Math.random() * 46,
          h: 1 + Math.random() * 13,
          rot: (Math.random() - 0.5) * 28,
          live: Math.random() > 0.34,
        })),
      );
    }, 260);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="failure-interference" aria-hidden="true">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className={`failure-burst failure-burst-${burst.hue}`}
          style={{
            '--fx': `${burst.x}%`,
            '--fy': `${burst.y}%`,
            '--fw': `${burst.w}vw`,
            '--fh': `${burst.h}px`,
            '--fr': `${burst.rot}deg`,
            '--fo': burst.live ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

function OrganicMisfire() {
  const cells = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        x: (index * 17.3) % 96,
        y: 10 + ((index * 23) % 80),
        size: 38 + (index % 6) * 20,
        delay: index * -0.41,
      })),
    [],
  );

  return (
    <div className="organic-misfire" aria-hidden="true">
      {cells.map((cell) => (
        <span
          key={cell.id}
          style={{
            '--ox': `${cell.x}%`,
            '--oy': `${cell.y}%`,
            '--os': `${cell.size}px`,
            '--odelay': `${cell.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloralSignalBloom() {
  const blooms = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        id: index,
        x: (index * 21.7) % 98,
        y: 8 + ((index * 29) % 84),
        size: 44 + (index % 7) * 18,
        delay: index * -0.33,
        rotate: (index * 47) % 360,
      })),
    [],
  );

  return (
    <div className="floral-signal-bloom" aria-hidden="true">
      {blooms.map((bloom) => (
        <span
          key={bloom.id}
          style={{
            '--bx': `${bloom.x}%`,
            '--by': `${bloom.y}%`,
            '--bs': `${bloom.size}px`,
            '--bd': `${bloom.delay}s`,
            '--br': `${bloom.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function HemisphereConflict() {
  return (
    <div className="hemisphere-conflict" aria-hidden="true">
      <div className="hemisphere-organic" />
      <div className="hemisphere-cyber" />
    </div>
  );
}

function RealityFractures() {
  const [fractures, setFractures] = useState(() => createFractures());

  useEffect(() => {
    let timer;
    let alive = true;

    const schedule = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setFractures(createFractures());
        schedule();
      }, randomBetween(850, 3100));
    };

    schedule();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="reality-fractures" aria-hidden="true">
      {fractures.blackouts.map((piece) => (
        <span
          key={piece.id}
          className="blackout-chunk"
          style={{
            '--fx': `${piece.x}%`,
            '--fy': `${piece.y}%`,
            '--fw': `${piece.w}vw`,
            '--fh': `${piece.h}vh`,
            '--fr': `${piece.r}deg`,
            '--fd': `${piece.delay}s`,
          }}
        />
      ))}
      {fractures.flowers.map((flower) => (
        <span
          key={flower.id}
          className="floral-glitch"
          style={{
            '--fx': `${flower.x}%`,
            '--fy': `${flower.y}%`,
            '--fs': `${flower.s}px`,
            '--fr': `${flower.r}deg`,
            '--fd': `${flower.delay}s`,
          }}
        />
      ))}
      {fractures.circuits.map((circuit) => (
        <span
          key={circuit.id}
          className="circuit-tear"
          style={{
            '--fx': `${circuit.x}%`,
            '--fy': `${circuit.y}%`,
            '--fw': `${circuit.w}vw`,
            '--fh': `${circuit.h}px`,
            '--fr': `${circuit.r}deg`,
            '--fd': `${circuit.delay}s`,
          }}
        />
      ))}
      {fractures.wires.map((wire) => (
        <span
          key={wire.id}
          className="wireframe-shard"
          style={{
            '--fx': `${wire.x}%`,
            '--fy': `${wire.y}%`,
            '--fs': `${wire.s}px`,
            '--fr': `${wire.r}deg`,
            '--fd': `${wire.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function CornerBlackouts() {
  const [blocks, setBlocks] = useState(() => createCornerBlackouts());

  useEffect(() => {
    let timer;
    let alive = true;

    const schedule = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setBlocks(createCornerBlackouts());
        schedule();
      }, randomBetween(420, 1900));
    };

    schedule();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="corner-blackouts" aria-hidden="true">
      {blocks.map((block) => (
        <span
          key={block.id}
          className={`corner-blackout corner-blackout-${block.variant}`}
          style={{
            '--cx': `${block.x}%`,
            '--cy': `${block.y}%`,
            '--cw': `${block.w}vw`,
            '--ch': `${block.h}vh`,
            '--cd': `${block.delay}s`,
            '--ct': `${block.duration}s`,
            '--crx': `${block.rattleX}px`,
            '--cry': `${block.rattleY}px`,
          }}
        />
      ))}
    </div>
  );
}

function SystemResetEvent() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('dead');
  const [lines, setLines] = useState([]);
  const bootLines = useMemo(
    () => [
      'QR BIOS 00.77b  COPYRIGHT (C) 1983-2026 VOID SYSTEMS',
      'POST: CPU CLOCK UNSTABLE 13.777 MHz',
      'POST: MEMORY TEST 000640K OK / 0xBLOOD BAD',
      'A:\\>LOADHIGH HIMEM.SYS /WETWARE /NO_SAFE_MODE',
      'A:\\>CHKDSK REALITY /F /ENTANGLE /VOID',
      'AUTOEXEC.BAT: SET OBSERVER=FALSE',
      'CONFIG.SYS: DEVICE=DNA_CACHE.SYS /FRACTAL',
      'INT 13h: BIOLOGIC DRIVE NOT READY - RETRYING',
      'SEGMENT FAULT AT SYNAPSE:0x77AF',
      'IRQ 7: PRAYER BUS COLLISION',
      'C:\\VOID> quantum.foam.bind(observer=false)',
      'C:\\VOID> entangle(left_brain, right_circuit)',
      'C:\\VOID> render.soma --unstable --half-life=13ms',
      'C:\\VOID> psi.compile(memory, blood, static)',
      'C:\\VOID> errno: GODFORM_RECURSION_LEAK',
      'C:\\VOID> quantize_fear(--dismal --nonlocal)',
      'C:\\VOID> prompt.inject(hyperion_dead_code)',
      'C:\\VOID> SELFIMPOSEQUANTIFY.EXE /RESUME /NO_WITNESS',
      'C:\\VOID> reality.signal.acquire()',
      'C:\\VOID> OPENING...',
    ],
    [],
  );

  useEffect(() => {
    const timers = [];
    let lineTimer;
    let alive = true;
    const addTimer = (callback, delay) => {
      const timer = setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    const trigger = () => {
      if (!alive) return;
      const darkHold = randomBetween(3000, 10000);
      const typeHold = randomBetween(1800, 3200);
      setActive(true);
      setPhase('dead');
      setLines([]);

      addTimer(() => {
        if (!alive) return;
        setPhase('typing');
        let index = 0;
        lineTimer = setInterval(() => {
          setLines((current) => [...current.slice(-18), bootLines[index % bootLines.length]]);
          index += 1;
        }, 36);
      }, darkHold);

      addTimer(() => {
        if (!alive) return;
        setPhase('restore');
        clearInterval(lineTimer);
      }, darkHold + typeHold);

      addTimer(() => {
        if (!alive) return;
        setActive(false);
        setPhase('dead');
        setLines([]);
        schedule();
      }, darkHold + typeHold + 900);
    };

    const schedule = () => {
      addTimer(trigger, randomBetween(120000, 1200000));
    };

    schedule();

    return () => {
      alive = false;
      timers.forEach((timer) => clearTimeout(timer));
      clearInterval(lineTimer);
    };
  }, [bootLines]);

  return (
    <div className={`system-reset ${active ? 'is-active' : ''} is-${phase}`} aria-hidden="true">
      <div className="dead-cursor" />
      <div className="reset-code">
        {lines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    </div>
  );
}

function createFractures() {
  return {
    blackouts: Array.from({ length: 8 }, (_, index) => ({
      id: `blackout-${index}-${Math.random()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: index < 2 ? 34 + Math.random() * 42 : 5 + Math.random() * 24,
      h: index < 2 ? 18 + Math.random() * 42 : 4 + Math.random() * 26,
      r: (Math.random() - 0.5) * 28,
      delay: Math.random() * -1.3,
    })),
    flowers: Array.from({ length: 7 }, (_, index) => ({
      id: `flower-${index}-${Math.random()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 34 + Math.random() * 118,
      r: Math.random() * 360,
      delay: Math.random() * -2.1,
    })),
    circuits: Array.from({ length: 10 }, (_, index) => ({
      id: `circuit-${index}-${Math.random()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: 8 + Math.random() * 36,
      h: 8 + Math.random() * 34,
      r: (Math.random() - 0.5) * 48,
      delay: Math.random() * -1.6,
    })),
    wires: Array.from({ length: 8 }, (_, index) => ({
      id: `wire-${index}-${Math.random()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 42 + Math.random() * 160,
      r: Math.random() * 360,
      delay: Math.random() * -1.8,
    })),
  };
}

function createCornerBlackouts() {
  const anchors = [
    { x: 0, y: 0, sx: 1, sy: 1 },
    { x: 100, y: 0, sx: -1, sy: 1 },
    { x: 0, y: 100, sx: 1, sy: -1 },
    { x: 100, y: 100, sx: -1, sy: -1 },
  ];

  return Array.from({ length: 9 }, (_, index) => {
    const anchor = anchors[index % anchors.length];
    const edgeStrip = index > 4 && Math.random() > 0.46;
    return {
      id: `corner-${index}-${Math.random()}`,
      x: anchor.x + anchor.sx * (Math.random() * (edgeStrip ? 20 : 14)),
      y: anchor.y + anchor.sy * (Math.random() * (edgeStrip ? 14 : 20)),
      w: edgeStrip ? 18 + Math.random() * 34 : 8 + Math.random() * 24,
      h: edgeStrip ? 3 + Math.random() * 11 : 7 + Math.random() * 24,
      delay: Math.random() * -1.1,
      duration: 0.52 + Math.random() * 1.2,
      rattleX: (Math.random() - 0.5) * 28,
      rattleY: (Math.random() - 0.5) * 20,
      variant: index % 4,
    };
  });
}

export function App() {
  return (
    <main className="reality-root">
      <Scene />
      <HemisphereConflict />
      <CodeRain />
      <GlyphVeil />
      <MoleculeLattice />
      <OrganicMisfire />
      <FloralSignalBloom />
      <FailureInterference />
      <RealityFractures />
      <CornerBlackouts />
      <SystemResetEvent />
      <div className="bio-sigil" aria-hidden="true" />
      <div className="glitch-storm" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <section className="hero-layer" aria-label="QUANTIFYREALITY">
        <GlitchTitle />
        <div className="lower-interface">
          <Terminal />
          <ExecuteButton />
        </div>
      </section>
    </main>
  );
}
