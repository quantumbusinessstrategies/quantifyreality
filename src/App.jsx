import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const binaryBursts = [
  '100 101 01101 10 00 110101',
  '0110 0001 111 01 10101',
  '10 00 110101 001 1110',
  '101 101 000 111001 01',
  '0 1 0 11 0101 111000',
];

const chemicalLexicon = [
  { name: 'DOPAMINE', formula: 'C8H11NO2', signal: 'reward//wanting', color: '#62f8ff' },
  { name: 'SEROTONIN', formula: 'C10H12N2O', signal: 'mood//regulate', color: '#ff72cc' },
  { name: 'OXYTOCIN', formula: 'C43H66N12O12S2', signal: 'bond//survive', color: '#ffb061' },
  { name: 'DMT', formula: 'C12H16N2', signal: 'vision//rupture', color: '#b69cff' },
  { name: 'CARBON', formula: 'C', signal: 'body//clock', color: '#8aff9b' },
];

const moleculeBlueprints = [
  { name: 'DOPAMINE', formula: 'C8H11NO2', x: 14, y: 18, scale: 1.15, delay: -0.2 },
  { name: 'SEROTONIN', formula: 'C10H12N2O', x: 35, y: 34, scale: 0.94, delay: -1.3 },
  { name: 'OXYTOCIN', formula: 'C43H66N12O12S2', x: 18, y: 64, scale: 1.02, delay: -2.2 },
  { name: 'DMT', formula: 'C12H16N2', x: 40, y: 76, scale: 0.86, delay: -3.1 },
  { name: 'CARBON-LEAP', formula: 'C / psi', x: 8, y: 42, scale: 0.78, delay: -4.4 },
  { name: 'RNA-FOLD', formula: 'AUGC', x: 32, y: 9, scale: 0.74, delay: -5.1 },
];

const circuitBlueprints = [
  { name: 'MICROCHIP_0xA7', x: 68, y: 18, scale: 0.78, delay: -0.7 },
  { name: 'BUS_LOGIC_13', x: 86, y: 34, scale: 0.68, delay: -1.6 },
  { name: 'WIRING_DIAGRAM', x: 63, y: 62, scale: 0.84, delay: -2.8 },
  { name: 'RENDER_CORE', x: 82, y: 74, scale: 0.62, delay: -3.7 },
  { name: 'CLOCK_GATE', x: 72, y: 48, scale: 0.58, delay: -4.6 },
  { name: 'MEMORY_LATTICE', x: 93, y: 11, scale: 0.5, delay: -5.4 },
];

const satelliteLinks = [
  { label: 'qubit.locker', href: 'https://qubit.locker' },
  { label: 'quantumpepes.xyz', href: 'https://quantumpepes.xyz' },
  { label: 'riskforgeai.com', href: 'https://riskforgeai.com' },
  { label: 'quantumaibusiness.com', href: 'https://quantumaibusiness.com' },
  { label: 'quantumbusinessstrategies.com', href: 'https://quantumbusinessstrategies.com' },
  { label: 'quantumreality.tech', href: 'https://quantumreality.tech' },
];

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

function pick(items, index) {
  return items[index % items.length];
}

function stripReferenceText(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function binaryFromText(value) {
  const source = value || 'SELF';
  return source
    .slice(0, 10)
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).slice(-5).padStart(5, '0'))
    .join(' ');
}

async function fetchKnowledgeReferences(prompt) {
  const query = prompt.trim().replace(/\s+/g, ' ').slice(0, 90);
  if (!query) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2400);

  try {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srlimit=3&srsearch=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return [];
    const data = await response.json();
    return (data?.query?.search || []).map((item) => ({
      title: stripReferenceText(item.title).toUpperCase(),
      snippet: stripReferenceText(item.snippet).slice(0, 124),
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function buildKnowledgeLines(prompt, references = []) {
  const subject = prompt.trim() || 'UNNAMED OBSERVER';
  const tokens = subject.toUpperCase().split(/\s+/).slice(0, 7);
  const seed = Array.from(subject).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const lines = [
    `C:\\SELF> SelFqUanTiFy.. /SUBJECT="${subject.toUpperCase().slice(0, 58)}"`,
    `BIN.STUTTER ${binaryFromText(subject)} :: ${pick(binaryBursts, seed)}`,
    `WEB_REF.SCAN(${tokens.join('_') || 'SELF'}) => CACHE: BLEEDING / CERTAINTY: ${((seed % 41) + 33).toString().padStart(2, '0')}.0%`,
  ];

  references.forEach((reference, index) => {
    const molecule = pick(chemicalLexicon, seed + index);
    lines.push(
      `REF[${index}] ${reference.title || 'NO_TITLE'} :: ${reference.snippet || 'NO STABLE ABSTRACT'} // ${molecule.name}.${molecule.formula}`,
    );
  });

  if (!references.length) {
    lines.push('WEB_REF.TIMEOUT :: OUTSIDE KNOWLEDGE WOULD NOT HOLD SHAPE');
    lines.push('LOCAL_CACHE.RECURSION :: THE WORD BITES ITS OWN DEFINITION');
  }

  for (let index = 0; index < 22; index += 1) {
    const molecule = pick(chemicalLexicon, seed + index);
    const token = pick(tokens.length ? tokens : ['SELF', 'VOID', 'SIGNAL'], index);
    const binary = pick(binaryBursts, seed + index);
    lines.push(
      `0x${(seed + index * 137).toString(16).toUpperCase().padStart(4, '0')} :: ${token}.${molecule.name}(${molecule.formula}) -> ${molecule.signal} | ${binary}`,
    );
    if (index % 4 === 2) {
      lines.push(
        `if (${token.toLowerCase()} !== body) { synthesize(${molecule.name.toLowerCase()}, "fear", "light"); } else { decay=false; }`,
      );
    }
  }

  lines.push('C:\\SELF> REALITY_REENTRY /NO_WITNESS /NO_PROMISE /KEEP_BREATHING');
  return lines;
}

async function createPromptKnowledge(prompt) {
  const references = await fetchKnowledgeReferences(prompt);
  return buildKnowledgeLines(prompt, references);
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
        <planeGeometry args={[24, 18, 84, 60]} />
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
    return Array.from({ length: 26 }, (_, index) => ({
      id: index,
      position: [
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.52) * 7.4,
        (Math.random() - 0.5) * 5.6,
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
            <meshBasicMaterial color={particle.color} wireframe transparent opacity={0.5} />
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
    for (let i = 0; i < 20; i += 1) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 1.65 + (i % 5) * 0.09;
      const points = [];
      for (let j = 0; j < 36; j += 1) {
        const t = j / 35;
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
        <sphereGeometry args={[1.38, 48, 48]} />
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
      for (let i = 0; i < 132; i += 1) {
        const t = i / 131;
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
    for (let i = 0; i < 32; i += 1) {
      const t = i / 31;
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

function CyberOrganicWireframes() {
  const organicRef = useRef();
  const cyberRef = useRef();
  const systems = useMemo(() => {
    const makeMaterial = (color, opacity) =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });

    const organic = new THREE.Group();
    const cyber = new THREE.Group();
    const organicMaterials = [
      makeMaterial('#67f8ff', 0.32),
      makeMaterial('#ff62c9', 0.28),
      makeMaterial('#ffb061', 0.23),
      makeMaterial('#9dff8b', 0.24),
    ];
    const cyberMaterials = [
      makeMaterial('#5cf7ff', 0.28),
      makeMaterial('#b88cff', 0.2),
      makeMaterial('#e8ffff', 0.16),
    ];

    const addLine = (group, points, material) => {
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
    };

    const addHex = (group, center, radius, material, phase = 0) => {
      const points = [];
      for (let i = 0; i <= 6; i += 1) {
        const angle = phase + (i / 6) * Math.PI * 2;
        points.push(new THREE.Vector3(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius, center.z));
      }
      addLine(group, points, material);
    };

    for (let i = 0; i < 7; i += 1) {
      const x = -4.9 + (i % 3) * 1.55;
      const y = -2.2 + Math.floor(i / 3) * 2.05;
      const z = -2.7 + (i % 2) * 0.45;
      const mat = organicMaterials[i % organicMaterials.length];
      addHex(organic, new THREE.Vector3(x, y, z), 0.5 + (i % 2) * 0.08, mat, i * 0.18);
      addHex(organic, new THREE.Vector3(x + 0.72, y + 0.12, z), 0.42, organicMaterials[(i + 1) % organicMaterials.length], Math.PI / 6);
      addLine(
        organic,
        [
          new THREE.Vector3(x + 0.5, y - 0.42, z),
          new THREE.Vector3(x + 1.05, y - 0.95, z + 0.18),
          new THREE.Vector3(x + 1.62, y - 0.72, z + 0.08),
        ],
        mat,
      );
      addLine(
        organic,
        [
          new THREE.Vector3(x - 0.4, y + 0.44, z),
          new THREE.Vector3(x - 0.9, y + 0.92, z + 0.16),
        ],
        organicMaterials[(i + 2) % organicMaterials.length],
      );
    }

    for (let i = 0; i < 28; i += 1) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 1.9 + Math.sin(i) * 0.42;
      addLine(
        organic,
        [
          new THREE.Vector3(-3.55 + Math.cos(angle) * radius, Math.sin(angle) * 1.5, -2.2 + Math.sin(angle) * 0.18),
          new THREE.Vector3(-3.55 + Math.cos(angle + 0.34) * (radius + 0.28), Math.sin(angle + 0.2) * 1.7, -2.2),
        ],
        organicMaterials[i % organicMaterials.length],
      );
    }

    for (let chip = 0; chip < 8; chip += 1) {
      const x = 2.0 + (chip % 4) * 0.92;
      const y = -2.25 + Math.floor(chip / 4) * 2.1;
      const z = -2.8 + (chip % 2) * 0.38;
      const mat = cyberMaterials[chip % cyberMaterials.length];
      const w = 0.42 + (chip % 2) * 0.12;
      const h = 0.3 + (chip % 3) * 0.05;
      addLine(
        cyber,
        [
          new THREE.Vector3(x - w, y - h, z),
          new THREE.Vector3(x + w, y - h, z),
          new THREE.Vector3(x + w, y + h, z),
          new THREE.Vector3(x - w, y + h, z),
          new THREE.Vector3(x - w, y - h, z),
        ],
        mat,
      );
      for (let pin = 0; pin < 8; pin += 1) {
        const px = x - w + (pin / 7) * w * 2;
        addLine(cyber, [new THREE.Vector3(px, y + h, z), new THREE.Vector3(px, y + h + 0.26, z)], mat);
        addLine(cyber, [new THREE.Vector3(px, y - h, z), new THREE.Vector3(px, y - h - 0.26, z)], mat);
      }
      addLine(
        cyber,
        [
          new THREE.Vector3(x + w, y, z),
          new THREE.Vector3(x + w + 0.36, y + 0.22, z),
          new THREE.Vector3(x + w + 0.78, y + 0.22, z + 0.12),
        ],
        cyberMaterials[(chip + 1) % cyberMaterials.length],
      );
    }

    for (let i = 0; i < 26; i += 1) {
      const x = 1.4 + Math.random() * 5.9;
      const y = -3 + Math.random() * 6.1;
      const elbow = Math.random() > 0.5 ? 0.42 : -0.42;
      addLine(
        cyber,
        [
          new THREE.Vector3(x, y, -3.2 + Math.random() * 1.4),
          new THREE.Vector3(x + elbow, y, -3.2 + Math.random() * 1.4),
          new THREE.Vector3(x + elbow, y + (Math.random() - 0.5) * 1.6, -3.2 + Math.random() * 1.4),
        ],
        cyberMaterials[i % cyberMaterials.length],
      );
    }

    return { organic, cyber };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (organicRef.current) {
      organicRef.current.rotation.y = Math.sin(time * 0.16) * 0.22;
      organicRef.current.rotation.z = Math.sin(time * 0.11) * 0.12;
      organicRef.current.children.forEach((child, index) => {
        child.visible = Math.sin(time * 4.7 + index * 1.9) > -0.92;
        child.material.opacity = (0.12 + Math.max(0, Math.sin(time * 0.9 + index)) * 0.28) * (index % 4 === 0 ? 1.35 : 1);
      });
    }
    if (cyberRef.current) {
      cyberRef.current.rotation.y = Math.sin(time * 0.19) * -0.2;
      cyberRef.current.rotation.x = Math.cos(time * 0.12) * 0.08;
      cyberRef.current.children.forEach((child, index) => {
        child.visible = Math.sin(time * 7.5 + index * 2.2) > -0.78;
        child.position.x += Math.sin(time * 8 + index) * 0.0018;
        child.material.opacity = 0.09 + Math.max(0, Math.sin(time * 1.6 + index)) * 0.3;
      });
    }
  });

  return (
    <group>
      <primitive object={systems.organic} ref={organicRef} position={[0.05, 0.12, 0]} rotation={[0.14, 0.18, -0.08]} />
      <primitive object={systems.cyber} ref={cyberRef} position={[-0.08, 0.02, 0]} rotation={[0.08, -0.18, 0.05]} />
    </group>
  );
}

function GlitchPlanes() {
  const group = useRef();
  const planes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
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
    <Canvas
      dpr={[0.85, 1.15]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
      className="cosmos-canvas"
    >
      <PerspectiveCamera makeDefault position={[0, 0.25, 8.4]} fov={53} />
      <color attach="background" args={['#020105']} />
      <fog attach="fog" args={['#04010a', 7, 19]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[-4, 3, 4]} color="#55eaff" intensity={16} distance={16} />
      <pointLight position={[5, -2, 2]} color="#ff58be" intensity={13} distance={14} />
      <pointLight position={[0, 4, -3]} color="#ff9d4c" intensity={7} distance={12} />
      <Sparkles count={42} speed={0.14} size={0.95} scale={[14, 7.6, 8]} color="#b8fbff" opacity={0.22} />
      <InfoSea />
      <ConsciousnessCore />
      <BioHelix />
      <CyberOrganicWireframes />
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

function Terminal({ value, onChange }) {
  const hidden = useRandomDropout(7000, 18000);

  return (
    <div className={`terminal-shell ${hidden ? 'is-offline' : ''}`} aria-label="DOS-style terminal input">
      <div className="terminal-lines" aria-hidden="true">
        <span>QR-DOS [v0.00.INF]</span>
        <span>C:\REALITY\SEED&gt; consciousness /wake /cold-light</span>
      </div>
      <label className="prompt-line">
        <span>C:\QUANTIFY&gt;</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck="false"
          aria-label="Reality command"
          autoComplete="off"
          rows={2}
        />
      </label>
    </div>
  );
}

function ExecuteButton({ onExecute }) {
  const hidden = useRandomDropout(6000, 16000);
  const binaryLeft = useMemo(() => pick(binaryBursts, Math.floor(Math.random() * binaryBursts.length)), []);
  const binaryRight = useMemo(() => pick(binaryBursts, Math.floor(Math.random() * binaryBursts.length) + 2), []);
  const noise = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        x: 4 + Math.random() * 92,
        y: 8 + Math.random() * 82,
        value: pick(binaryBursts, index + Math.floor(Math.random() * 9)),
        delay: Math.random() * -2.4,
      })),
    [],
  );

  return (
    <motion.button
      className={`execute-button ${hidden ? 'is-offline' : ''}`}
      type="button"
      onClick={onExecute}
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
      <span className="button-noise" aria-hidden="true">
        {noise.map((bit) => (
          <i
            key={bit.id}
            style={{
              '--nx': `${bit.x}%`,
              '--ny': `${bit.y}%`,
              '--nd': `${bit.delay}s`,
            }}
          >
            {bit.value}
          </i>
        ))}
      </span>
      <span className="button-binary">{binaryLeft}</span>
      <span className="button-command">SelFqUanTiFy..</span>
      <span className="button-binary">{binaryRight}</span>
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
  const chemistry = useMemo(
    () =>
      moleculeBlueprints.map((molecule, index) => ({
        ...molecule,
        id: `${molecule.name}-${index}`,
        hue: ['#67f8ff', '#ff62c9', '#ffb061', '#9dff8b', '#b69cff'][index % 5],
        binary: pick(binaryBursts, index),
      })),
    [],
  );
  const circuits = useMemo(
    () =>
      circuitBlueprints.map((circuit, index) => ({
        ...circuit,
        id: `${circuit.name}-${index}`,
        hue: ['#67f8ff', '#b69cff', '#dffcff', '#66ffb1'][index % 4],
        binary: pick(binaryBursts, index + 2),
      })),
    [],
  );

  return (
    <div className="wireframe-composite" aria-hidden="true">
      {chemistry.map((molecule) => (
        <span
          key={molecule.id}
          className="chem-wireframe"
          style={{
            '--wx': `${molecule.x}%`,
            '--wy': `${molecule.y}%`,
            '--ws': molecule.scale,
            '--wd': `${molecule.delay}s`,
            '--wire': molecule.hue,
          }}
        >
          <svg viewBox="0 0 180 130" role="img">
            <polygon className="wire-ring" points="52,36 84,20 116,36 116,72 84,90 52,72" />
            <polygon className="wire-ring ghost" points="92,40 118,28 146,44 144,72 118,86 92,72" />
            <line x1="52" y1="36" x2="30" y2="22" />
            <line x1="116" y1="72" x2="148" y2="98" />
            <line x1="84" y1="90" x2="84" y2="116" />
            <line x1="30" y1="22" x2="18" y2="35" />
            <line x1="148" y1="98" x2="166" y2="86" />
            <circle cx="30" cy="22" r="5" />
            <circle cx="84" cy="116" r="5" />
            <circle cx="166" cy="86" r="4" />
            <circle className="electron" cx="84" cy="58" r="3" />
            <text x="12" y="18">OH</text>
            <text x="75" y="126">NH</text>
          </svg>
          <em>{molecule.name}</em>
          <b>{molecule.formula} / {molecule.binary}</b>
        </span>
      ))}
      {circuits.map((circuit) => (
        <span
          key={circuit.id}
          className="circuit-wireframe"
          style={{
            '--wx': `${circuit.x}%`,
            '--wy': `${circuit.y}%`,
            '--ws': circuit.scale,
            '--wd': `${circuit.delay}s`,
            '--wire': circuit.hue,
          }}
        >
          <svg viewBox="0 0 190 130" role="img">
            <g className="hex-board">
              <path d="M18 31l9-5 9 5v10l-9 5-9-5zM39 19l9-5 9 5v10l-9 5-9-5zM60 31l9-5 9 5v10l-9 5-9-5zM128 21l9-5 9 5v10l-9 5-9-5zM151 34l9-5 9 5v10l-9 5-9-5zM137 84l9-5 9 5v10l-9 5-9-5zM160 96l9-5 9 5v10l-9 5-9-5zM22 88l9-5 9 5v10l-9 5-9-5zM44 100l9-5 9 5v10l-9 5-9-5z" />
              <path className="parallel-traces" d="M16 55H50M16 59H50M16 63H50M16 67H50M136 53H178M136 57H178M136 61H178M136 65H178M60 100H130M60 104H130M60 108H130M60 112H130" />
              <path className="parallel-traces ghost" d="M28 11H78M28 15H78M112 12H168M112 16H168M30 118H86M30 122H86M102 118H174M102 122H174" />
            </g>
            <rect x="70" y="42" width="50" height="36" rx="2" />
            <rect className="chip-core" x="84" y="52" width="22" height="16" rx="1.5" />
            <path d="M70 48H20V22M70 53H34V35M70 59H28V70M70 65H44V80M120 47H170V18M120 53H160V38M120 59H176V72M120 66H162V93M120 72H166V110M70 72H18V104" />
            <path d="M76 42V12M81 42V8M86 42V6M91 42V10M96 42V7M101 42V14M106 42V9M112 42V15M76 78V120M82 78V116M88 78V114M94 78V118M100 78V124M106 78V116M112 78V121" />
            <path className="micro-traces" d="M80 47H110M80 50H110M80 73H110M80 76H110M64 37H128M64 82H128" />
            <path className="circuit-pulse" d="M20 22H70M120 47H170M120 72H166" />
            <circle cx="20" cy="22" r="4" />
            <circle cx="170" cy="18" r="4" />
            <circle cx="166" cy="110" r="4" />
            <circle cx="18" cy="104" r="4" />
            <text x="58" y="27">0x</text>
          </svg>
          <em>{circuit.name}</em>
          <b>{circuit.binary}</b>
        </span>
      ))}
    </div>
  );
}

function FailureInterference() {
  const [bursts, setBursts] = useState(() =>
    Array.from({ length: 10 }, (_, index) => ({
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
    }, 340);

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
      Array.from({ length: 8 }, (_, index) => ({
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
      Array.from({ length: 7 }, (_, index) => ({
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
      }, randomBetween(1200, 3800));
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
      }, randomBetween(680, 2300));
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

function SystemResetEvent({ manualEvent }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('dead');
  const [lines, setLines] = useState([]);
  const timers = useRef([]);
  const lineTimer = useRef();
  const runSerial = useRef(0);
  const scheduleRandom = useRef();
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

  const clearRuntime = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    clearInterval(lineTimer.current);
    lineTimer.current = null;
  }, []);

  const runReset = useCallback(
    ({ prompt = '', manual = false } = {}) => {
      runSerial.current += 1;
      const runId = runSerial.current;
      clearRuntime();

      const darkHold = manual ? randomBetween(3000, 10000) : randomBetween(3000, 10000);
      const typeHold = manual ? randomBetween(5600, 8400) : randomBetween(1800, 3200);
      const typingInterval = manual ? 58 : 36;
      const knowledgePromise = manual ? createPromptKnowledge(prompt) : Promise.resolve(bootLines);

      const addTimer = (callback, delay) => {
        const timer = setTimeout(callback, delay);
        timers.current.push(timer);
        return timer;
      };

      setActive(true);
      setPhase('dead');
      setLines([]);

      addTimer(async () => {
        if (runSerial.current !== runId) return;
        const outputLines = await knowledgePromise;
        if (runSerial.current !== runId) return;
        setPhase('typing');
        let index = 0;
        lineTimer.current = setInterval(() => {
          setLines((current) => [...current.slice(-20), outputLines[index % outputLines.length]]);
          index += 1;
        }, typingInterval);
      }, darkHold);

      addTimer(() => {
        if (runSerial.current !== runId) return;
        setPhase('restore');
        clearInterval(lineTimer.current);
      }, darkHold + typeHold);

      addTimer(() => {
        if (runSerial.current !== runId) return;
        setActive(false);
        setPhase('dead');
        setLines([]);
        scheduleRandom.current?.();
      }, darkHold + typeHold + 900);
    },
    [bootLines, clearRuntime],
  );

  useEffect(() => {
    let alive = true;
    scheduleRandom.current = () => {
      if (!alive) return;
      const timer = setTimeout(() => {
        if (alive) runReset({ manual: false });
      }, randomBetween(120000, 1200000));
      timers.current.push(timer);
    };

    scheduleRandom.current();

    return () => {
      alive = false;
      clearRuntime();
      scheduleRandom.current = null;
    };
  }, [clearRuntime, runReset]);

  useEffect(() => {
    if (!manualEvent) return;
    runReset({ manual: true, prompt: manualEvent.prompt });
  }, [manualEvent, runReset]);

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
    blackouts: Array.from({ length: 7 }, (_, index) => ({
      id: `blackout-${index}-${Math.random()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: index < 2 ? 34 + Math.random() * 42 : 5 + Math.random() * 24,
      h: index < 2 ? 18 + Math.random() * 42 : 4 + Math.random() * 26,
      r: (Math.random() - 0.5) * 28,
      delay: Math.random() * -1.3,
    })),
    flowers: Array.from({ length: 5 }, (_, index) => ({
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
    wires: Array.from({ length: 6 }, (_, index) => ({
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

  return Array.from({ length: 7 }, (_, index) => {
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

function PointerField() {
  const [point, setPoint] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState([]);
  const frame = useRef();
  const lastPoint = useRef(point);

  useEffect(() => {
    const updatePoint = (event) => {
      lastPoint.current = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      };
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          setPoint(lastPoint.current);
          frame.current = null;
        });
      }
    };

    const clickPoint = (event) => {
      const ripple = {
        id: Date.now() + Math.random(),
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      };
      setRipples((current) => [...current.slice(-3), ripple]);
      setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id));
      }, 950);
    };

    window.addEventListener('pointermove', updatePoint, { passive: true });
    window.addEventListener('pointerdown', clickPoint, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updatePoint);
      window.removeEventListener('pointerdown', clickPoint);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      className="pointer-field"
      aria-hidden="true"
      style={{
        '--px': `${point.x}%`,
        '--py': `${point.y}%`,
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            '--rx': `${ripple.x}%`,
            '--ry': `${ripple.y}%`,
          }}
        />
      ))}
    </div>
  );
}

function HiddenFractalPortal({ onOpen }) {
  const facets = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        id: index,
        x1: 50 + Math.cos((index / 48) * Math.PI * 2) * (9 + (index % 4) * 8),
        y1: 50 + Math.sin((index / 48) * Math.PI * 2) * (8 + (index % 5) * 7),
        x2: 50 + Math.cos(((index + 13) / 48) * Math.PI * 2) * (16 + (index % 6) * 5),
        y2: 50 + Math.sin(((index + 13) / 48) * Math.PI * 2) * (15 + (index % 3) * 8),
        delay: index * -0.09,
      })),
    [],
  );
  const triangles = useMemo(() => {
    const items = [];
    const addTriangle = (x, y, size, depth) => {
      if (depth === 0) {
        const height = size * 0.86;
        items.push({
          points: `${x},${y - height / 2} ${x - size / 2},${y + height / 2} ${x + size / 2},${y + height / 2}`,
        });
        return;
      }
      addTriangle(x, y - size * 0.19, size / 2, depth - 1);
      addTriangle(x - size * 0.25, y + size * 0.24, size / 2, depth - 1);
      addTriangle(x + size * 0.25, y + size * 0.24, size / 2, depth - 1);
    };

    addTriangle(50, 50, 54, 2);
    return items;
  }, []);

  return (
    <button
      className="hidden-fractal-portal"
      type="button"
      aria-label="Open quantum links"
      onClick={onOpen}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polygon className="portal-button-ring" points="50,0 88,14 100,50 88,86 50,100 12,86 0,50 12,14" />
        <polygon className="portal-core" points="50,5 84,25 84,75 50,95 16,75 16,25" />
        <polygon className="portal-octa-a" points="50,5 84,50 50,95 16,50" />
        <polygon className="portal-octa-b" points="16,25 84,25 84,75 16,75" />
        <polygon className="portal-inner" points="50,24 68,38 62,66 38,66 32,38" />
        <path className="portal-fractal" d="M50 5L50 95M16 25L84 75M84 25L16 75M16 50H84M32 38L68 38M38 66L62 66M50 24L38 66M50 24L62 66" />
        <g className="portal-sierpinski">
          {triangles.map((triangle, index) => (
            <polygon key={index} points={triangle.points} />
          ))}
        </g>
        {facets.map((facet) => (
          <line
            key={facet.id}
            className="portal-facet"
            x1={facet.x1}
            y1={facet.y1}
            x2={facet.x2}
            y2={facet.y2}
            style={{ '--fd': `${facet.delay}s` }}
          />
        ))}
      </svg>
    </button>
  );
}

function LinksArchive({ open, onClose }) {
  const [phase, setPhase] = useState('closed');
  const [typedCount, setTypedCount] = useState(0);
  const bootLines = useMemo(
    () => [
      'C:\\QR> OPEN SATELLITE INDEX',
      'DECOMPRESSING LINK_SIGILS FROM NULL CACHE',
      '101 001 1110 00 110101 :: ROUTE TABLE BLEEDING',
      'PORTAL_STATE: COLLAPSED / CLICKABLE / UNTRUSTED_LIGHT',
      'RENDERING OUTBOUND STRUCTURES...',
    ],
    [],
  );

  useEffect(() => {
    if (!open) {
      setPhase('closed');
      setTypedCount(0);
      return undefined;
    }

    const timers = [
      setTimeout(() => setPhase('cursor'), 0),
      setTimeout(() => setPhase('typing'), 1300),
    ];

    let lineTimer;
    timers.push(
      setTimeout(() => {
        let index = 0;
        lineTimer = setInterval(() => {
          index += 1;
          setTypedCount(Math.min(index, satelliteLinks.length));
          if (index >= satelliteLinks.length) {
            clearInterval(lineTimer);
            setPhase('open');
          }
        }, 260);
      }, 1600),
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearInterval(lineTimer);
    };
  }, [open]);

  const visibleLinks = phase === 'open' ? satelliteLinks : satelliteLinks.slice(0, typedCount);

  return (
    <section className={`links-archive ${open ? 'is-open' : ''} is-${phase}`} aria-hidden={!open}>
      <div className="links-cursor" aria-hidden="true" />
      <div className="links-codefall" aria-hidden="true">
        {bootLines.map((line, index) => (
          <span key={line} style={{ '--ld': `${index * 0.12}s` }}>{line}</span>
        ))}
      </div>
      <div className="links-constellation">
        {visibleLinks.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            style={{
              '--li': index,
              '--ld': `${0.18 + index * 0.08}s`,
            }}
          >
            <code>C:\SATELLITE\{String(index).padStart(2, '0')}&gt; open_route(</code>
            <span>{link.label}</span>
            <code>) :: {pick(binaryBursts, index)}</code>
          </a>
        ))}
      </div>
      <button className="requantify-button" type="button" onClick={onClose}>
        REQUANTIFY
      </button>
    </section>
  );
}

export function App() {
  const [terminalValue, setTerminalValue] = useState('');
  const [manualEvent, setManualEvent] = useState(null);
  const [linksOpen, setLinksOpen] = useState(false);

  const handleExecute = useCallback(() => {
    setManualEvent({
      id: Date.now() + Math.random(),
      prompt: terminalValue,
    });
  }, [terminalValue]);

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
      <SystemResetEvent manualEvent={manualEvent} />
      <PointerField />
      <HiddenFractalPortal onOpen={() => setLinksOpen(true)} />
      <LinksArchive open={linksOpen} onClose={() => setLinksOpen(false)} />
      <div className="bio-sigil" aria-hidden="true" />
      <div className="glitch-storm" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <section className="hero-layer" aria-label="QUANTIFYREALITY">
        <GlitchTitle />
        <div className="lower-interface">
          <Terminal value={terminalValue} onChange={setTerminalValue} />
          <ExecuteButton onExecute={handleExecute} />
        </div>
      </section>
    </main>
  );
}
