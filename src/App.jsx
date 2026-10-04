import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import './index.css';

// ==========================================
// DATA CONFIGURATION
// ==========================================
const EVENTS_DATA = [
  {
    id: '1',
    title: 'Neural Hack 2026',
    category: 'ai',
    badge: 'AI & ML',
    description: '36-hour hackathon building autonomous multi-agent systems and real-time computer vision models.',
    prizes: '$15,000',
    teamSize: '2-4 Members',
    date: 'Oct 24-25',
  },
  {
    id: '2',
    title: 'CTF: Operation Zero',
    category: 'cyber',
    badge: 'Cybersecurity',
    description: 'Jeopardy-style Capture The Flag challenge focusing on binary exploitation, reverse engineering, and cryptography.',
    prizes: '$10,000',
    teamSize: '1-3 Members',
    date: 'Oct 25',
  },
  {
    id: '3',
    title: 'Quantum Ledger',
    category: 'web3',
    badge: 'Web3 & Quantum',
    description: 'Design next-generation decentralized infrastructure resilient to post-quantum cryptographic threats.',
    prizes: '$12,000',
    teamSize: '2-4 Members',
    date: 'Oct 24',
  },
  {
    id: '4',
    title: 'Algorithmic Arena',
    category: 'ai',
    badge: 'Competitive Coding',
    description: 'High-speed speed-coding clash featuring dynamic programming, graph algorithms, and optimization math.',
    prizes: '$8,000',
    teamSize: 'Solo',
    date: 'Oct 26',
  },
];

const SCHEDULE_DATA = {
  day1: [
    { time: '09:00 AM', title: 'Opening Keynote: The Post-Silicon Horizon', location: 'Main Stage', speaker: 'Dr. Elena Rostova' },
    { time: '11:30 AM', title: 'Neural Hack 2026 Briefing & Kickoff', location: 'Lab 04 / Remote' },
    { time: '03:00 PM', title: 'Panel: Quantum Resistance in Web3', location: 'Hall B' },
  ],
  day2: [
    { time: '10:00 AM', title: 'CTF: Operation Zero Begins', location: 'Cyber Arena' },
    { time: '02:00 PM', title: 'Workshop: Scalable Multi-Agent Systems', location: 'Seminar Room A' },
    { time: '08:00 PM', title: 'Midnight Cyber Synth Concert', location: 'Open Amphitheatre' },
  ],
  day3: [
    { time: '10:00 AM', title: 'Hackathon Final Demos & Judging', location: 'Exhibition Center' },
    { time: '02:00 PM', title: 'Algorithmic Arena Finals', location: 'Main Auditorium' },
    { time: '05:00 PM', title: 'Grand Award & Closing Ceremony', location: 'Main Stage' },
  ]
};

const SPEAKERS_DATA = [
  { id: '1', name: 'Dr. Elena Rostova', role: 'Chief AI Architect', company: 'Neuralis Systems', topic: 'Post-Silicon Computing' },
  { id: '2', name: 'Marcus Vance', role: 'Head of Offensive Cyber', company: 'Aegis Security', topic: 'Zero-Day Vulnerability Landscapes' },
  { id: '3', name: 'Aria Chen', role: 'Lead Quantum Researcher', company: 'Q-State Labs', topic: 'Post-Quantum Cryptography Architecture' },
];

const SPONSORS_DATA = [
  { id: '1', name: 'NVIDIA', tier: 'Title Partner' },
  { id: '2', name: 'OpenAI', tier: 'Platinum Sponsor' },
  { id: '3', name: 'GitHub', tier: 'Platinum Sponsor' },
  { id: '4', name: 'Cloudflare', tier: 'Gold Sponsor' },
];

// ==========================================
// 3D VISUAL COMPONENTS
// ==========================================

// 1. Hero Animated Cyber Core
function CyberCore() {
  const outerRingRef = useRef();
  const innerMeshRef = useRef();
  const coreRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.3;
      outerRingRef.current.rotation.x = Math.sin(t * 0.2) * 0.4;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y = -t * 0.5;
      innerMeshRef.current.rotation.x = t * 0.3;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
    }
  });

  return (
    <group>
      {/* Outer Rotating Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.2, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Middle Gyro Ring */}
      <mesh ref={innerMeshRef}>
        <torusGeometry args={[2.3, 0.08, 16, 80]} />
        <meshStandardMaterial color="#ff007f" wireframe roughness={0.2} />
      </mesh>

      {/* Pulsing Core Icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#7000ff" wireframe roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

// 2. Starfield & Particle Cloud
function ParticleMatrix({ count = 400 }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00f0ff" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

// 3. Interactive Warp Wireframe Grid (Track Section Background)
function InteractiveGrid() {
  const gridRef = useRef();
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.getElapsedTime() * 0.8) % 1;
    }
  });

  return (
    <group position={[0, -2, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
      <gridHelper ref={gridRef} args={[40, 40, '#00f0ff', '#1b2234']} />
    </group>
  );
}

// 4. Interactive Orbital Ring (Architecture Playground)
function OrbitalDataRing() {
  const ringRef = useRef();
  const sphereGroupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.4;
      ringRef.current.rotation.x = Math.cos(t * 0.3) * 0.2;
    }
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.y = -t * 0.6;
    }
  });

  return (
    <group>
      <mesh ref={ringRef}>
        <torusKnotGeometry args={[1.5, 0.3, 128, 32]} />
        <meshStandardMaterial color="#00f0ff" wireframe roughness={0.1} />
      </mesh>
      
      <group ref={sphereGroupRef}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ff007f" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 5. 3D Digital Twin Map/Globe for Venue/Location
function DigitalTwinVenue() {
  const globeRef = useRef();
  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 24, 24]} />
      <meshStandardMaterial color="#7000ff" wireframe emissive="#00f0ff" emissiveIntensity={0.2} />
    </mesh>
  );
}

// ==========================================
// CANVASES & WRAPPERS
// ==========================================
function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#00f0ff" />
        <pointLight position={[-10, -10, -5]} intensity={1.5} color="#ff007f" />
        <CyberCore />
        <ParticleMatrix />
      </Canvas>
    </div>
  );
}

// ==========================================
// REUSABLE UI COMPONENTS & UTILS
// ==========================================
function Button({ children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const base = "px-6 py-3 rounded-md font-mono font-semibold transition-all duration-300 transform active:scale-95 text-sm";
  const variants = {
    primary: "bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:-translate-y-0.5 border border-cyber-cyan/50",
    secondary: "bg-cyber-card border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function SectionTitle({ index, title }) {
  return (
    <div className="mb-12">
      <h2 className="font-mono text-3xl md:text-4xl font-bold text-cyber-cyan tracking-wider flex items-center gap-3">
        <span className="text-cyber-pink font-extrabold">{index} //</span>
        <span className="glow-text-cyan">{title}</span>
      </h2>
      <div className="w-32 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-transparent mt-2" />
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 12, mins: 44, secs: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 font-mono justify-center my-6">
      {[
        { label: 'DAYS', val: timeLeft.days },
        { label: 'HOURS', val: timeLeft.hours },
        { label: 'MINS', val: timeLeft.mins },
        { label: 'SECS', val: timeLeft.secs },
      ].map((item, idx) => (
        <div key={idx} className="bg-cyber-card/80 border border-cyber-border rounded-lg px-4 py-2 text-center min-w-[70px] backdrop-blur-md">
          <div className="text-xl md:text-2xl font-bold text-cyber-cyan glow-text-cyan">
            {String(item.val).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-cyber-muted mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <div 
        className="fixed w-2 h-2 bg-cyber-cyan rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
      <div 
        className="fixed w-9 h-9 border border-cyber-pink/60 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-cyber-border z-[1001]">
      <div className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-purple transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeDay, setActiveDay] = useState('day1');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = filter === 'all' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(e => e.category === filter);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-cyber-bg flex flex-col items-center justify-center z-[10000]">
        <div className="w-20 h-20 border-2 border-cyber-cyan border-t-cyber-pink rounded-full animate-spin mb-4" />
        <p className="font-mono text-cyber-cyan tracking-widest animate-pulse font-bold text-sm">// INITIALIZING HIGH-POLY ENGINE...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-cyber-bg text-cyber-text min-h-screen bg-cyber-grid">
      <CustomCursor />
      <ScrollProgress />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border z-[1000]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-mono font-bold text-xl tracking-widest text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-cyber-pink rounded-full animate-ping" />
            TECHFEST<span className="text-cyber-cyan glow-text-cyan">//2026</span>
          </div>
          <nav className="hidden md:flex gap-8 font-mono text-xs tracking-wider text-cyber-muted">
            <a href="#about" className="hover:text-cyber-cyan transition-colors">ABOUT</a>
            <a href="#events" className="hover:text-cyber-cyan transition-colors">TRACKS</a>
            <a href="#experience" className="hover:text-cyber-cyan transition-colors">3D LAB</a>
            <a href="#schedule" className="hover:text-cyber-cyan transition-colors">SCHEDULE</a>
            <a href="#speakers" className="hover:text-cyber-cyan transition-colors">SPEAKERS</a>
            <a href="#venue" className="hover:text-cyber-cyan transition-colors">VENUE</a>
          </nav>
          <a href="#register">
            <Button variant="primary" className="text-xs px-5 py-2">REGISTER</Button>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <HeroScene />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-cyber-card border border-cyber-cyan/40 rounded-full font-mono text-cyber-cyan text-xs tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            // ANNUAL GLOBAL TECHNICAL SYMPOSIUM
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-cyber-text to-cyber-cyan bg-clip-text text-transparent">
            BEYOND THE CODE
          </h1>
          
          <p className="text-cyber-muted text-base md:text-lg max-w-2xl mx-auto mb-4 font-sans leading-relaxed">
            Architecting the Next Technological Epoch • October 24-26, 2026
          </p>

          <CountdownTimer />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="#events"><Button variant="primary">EXPLORE TRACKS</Button></a>
            <a href="#experience"><Button variant="secondary">ENTER 3D LAB</Button></a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="01" title="ABOUT THE SYMPOSIUM" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-xl hover:border-cyber-cyan/60 transition-all duration-300 hover:-translate-y-1">
            <div className="text-cyber-pink font-mono text-3xl font-bold mb-2">3 DAYS</div>
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">Immersive Innovation</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">High-impact hackathons, algorithmic arenas, and keynotes led by global engineering pioneers.</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-xl hover:border-cyber-cyan/60 transition-all duration-300 hover:-translate-y-1">
            <div className="text-cyber-cyan font-mono text-3xl font-bold mb-2">$50,000+</div>
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">Global Prize Pool</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">Compete across multiple tracks from deep learning agents to post-quantum cryptographic ledgers.</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-xl hover:border-cyber-cyan/60 transition-all duration-300 hover:-translate-y-1">
            <div className="text-cyber-purple font-mono text-3xl font-bold mb-2">2,000+</div>
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">Tech Pioneers</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">Network with developers, researchers, founders, and technical visionaries from around the globe.</p>
          </div>
        </div>
      </section>

      {/* TRACKS & COMPETITIONS SECTION WITH 3D GRID */}
      <section id="events" className="relative py-24 px-6 bg-cyber-card/40 border-y border-cyber-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <Canvas camera={{ position: [0, 2, 5] }}>
            <InteractiveGrid />
          </Canvas>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionTitle index="02" title="TRACKS & COMPETITIONS" />
          
          <div className="flex gap-4 mb-10 overflow-x-auto pb-2 font-mono text-xs">
            {['all', 'ai', 'cyber', 'web3'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-md border uppercase transition-all duration-200 ${filter === cat ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold' : 'border-cyber-border text-cyber-muted hover:border-cyber-cyan/40'}`}
              >
                {cat === 'all' ? 'All Tracks' : cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-cyber-card/90 border border-cyber-border rounded-xl p-6 hover:border-cyber-cyan transition-all duration-300 hover:-translate-y-1.5 group backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-[11px] font-mono rounded-md mb-4">
                    {event.badge}
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-cyan transition-colors">{event.title}</h3>
                  <p className="text-cyber-muted text-sm mb-6 leading-relaxed">{event.description}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-cyber-text/80 mb-4 border-t border-cyber-border/60 pt-4">
                    <span>Prize: <strong className="text-cyber-cyan">{event.prizes}</strong></span>
                    <span>{event.date}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="w-full py-2.5 border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs rounded-md hover:bg-cyber-cyan/10 transition-colors"
                  >
                    View Track Rules
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D EXPERIMENTAL LAB */}
      <section id="experience" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="03" title="3D ARCHITECTURE LAB" />
        <div className="grid md:grid-cols-2 gap-8 items-center bg-cyber-card border border-cyber-border rounded-2xl p-8">
          <div>
            <div className="inline-block px-3 py-1 bg-cyber-purple/20 border border-cyber-purple text-cyber-purple text-xs font-mono rounded mb-4">
              INTERACTIVE RENDER
            </div>
            <h3 className="text-3xl font-bold mb-4">Quantum Orbital Node</h3>
            <p className="text-cyber-muted text-sm leading-relaxed mb-6">
              Observe top-level cryptographic data routes mapped into spatial geometry. Rotate and interact with quantum-resistant key networks in real time.
            </p>
            <div className="font-mono text-xs text-cyber-cyan space-y-2">
              <p>• Rendering Engine: React Three Fiber / WebGL</p>
              <p>• Dynamic Lighting: Point Lights + Wireframe Shading</p>
            </div>
          </div>
          <div className="h-96 bg-cyber-bg border border-cyber-border rounded-xl overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <Canvas camera={{ position: [0, 0, 6] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00f0ff" />
              <pointLight position={[-5, -5, -5]} intensity={1} color="#ff007f" />
              <OrbitalDataRing />
            </Canvas>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="py-24 px-6 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <SectionTitle index="04" title="TIMELINE & AGENDA" />
          <div className="flex gap-4 mb-8 font-mono text-xs">
            {[
              { id: 'day1', label: 'Day 01 (Oct 24)' },
              { id: 'day2', label: 'Day 02 (Oct 25)' },
              { id: 'day3', label: 'Day 03 (Oct 26)' },
            ].map(day => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`px-6 py-3 rounded-md border transition-all ${activeDay === day.id ? 'bg-cyber-purple border-cyber-purple text-white shadow-[0_0_15px_rgba(112,0,255,0.4)]' : 'bg-cyber-card border-cyber-border text-cyber-muted'}`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {SCHEDULE_DATA[activeDay].map((item, idx) => (
              <div key={idx} className="bg-cyber-card border-l-4 border-cyber-cyan border-y border-r border-cyber-border p-6 rounded-r-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyber-cyan transition-colors">
                <div className="font-mono text-cyber-cyan font-bold text-sm min-w-[110px] glow-text-cyan">{item.time}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-cyber-muted text-xs font-mono mt-1">{item.location} {item.speaker && `• ${item.speaker}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEYNOTE SPEAKERS */}
      <section id="speakers" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="05" title="KEYNOTE SPEAKERS" />
        <div className="grid md:grid-cols-3 gap-8">
          {SPEAKERS_DATA.map(speaker => (
            <div key={speaker.id} className="bg-cyber-card border border-cyber-border rounded-xl p-8 text-center hover:border-cyber-purple transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyber-cyan via-cyber-purple to-cyber-pink mx-auto mb-6 flex items-center justify-center font-mono font-bold text-2xl text-white shadow-[0_0_20px_rgba(112,0,255,0.4)]">
                {speaker.name.charAt(0)}
              </div>
              <h3 className="font-bold text-xl">{speaker.name}</h3>
              <p className="text-cyber-cyan text-xs font-mono mt-1">{speaker.role}</p>
              <p className="text-cyber-muted text-xs mt-1">{speaker.company}</p>
              <div className="mt-6 pt-4 border-t border-cyber-border/60 text-xs text-cyber-text/80 font-mono">
                Topic: "{speaker.topic}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE 3D METAVERSE LOCATION */}
      <section id="venue" className="py-24 px-6 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <SectionTitle index="06" title="LOCATION & METAVERSE" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-80 bg-cyber-bg border border-cyber-border rounded-xl overflow-hidden relative">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} color="#00f0ff" />
                <DigitalTwinVenue />
              </Canvas>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Cyber Arena & Virtual Metaverse</h3>
              <p className="text-cyber-muted text-sm leading-relaxed mb-4">
                Join physically at the Tech Campus Expo Center or connect via our low-latency WebXR metaverse node.
              </p>
              <div className="font-mono text-xs text-cyber-cyan space-y-2">
                <p>📍 Physical Venue: Innovation Hub, Zone 01</p>
                <p>🌐 Metaverse Portal: node-2026.techfest.io</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL PARTNERS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="07" title="GLOBAL PARTNERS" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SPONSORS_DATA.map(sponsor => (
            <div key={sponsor.id} className="bg-cyber-card border border-cyber-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-cyber-cyan transition-colors">
              <h4 className="font-mono font-bold text-2xl text-cyber-text tracking-wider mb-2">{sponsor.name}</h4>
              <span className="text-xs font-mono text-cyber-cyan">{sponsor.tier}</span>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" className="py-24 px-6 max-w-2xl mx-auto">
        <SectionTitle index="08" title="REGISTER PASS" />
        {submitted ? (
          <div className="bg-cyber-card border border-cyber-cyan p-8 rounded-xl text-center font-mono">
            <h3 className="text-2xl text-cyber-cyan mb-2">APPLICATION SUBMITTED</h3>
            <p className="text-cyber-muted text-sm">Check your inbox for your digital access pass QR code.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-cyber-card border border-cyber-border p-8 rounded-xl space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">FULL NAME</label>
              <input required type="text" placeholder="John Doe" className="w-full bg-cyber-bg border border-cyber-border rounded-md p-3 text-sm focus:border-cyber-cyan outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">EMAIL ADDRESS</label>
              <input required type="email" placeholder="john@example.com" className="w-full bg-cyber-bg border border-cyber-border rounded-md p-3 text-sm focus:border-cyber-cyan outline-none transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">PRIMARY TRACK</label>
              <select className="w-full bg-cyber-bg border border-cyber-border rounded-md p-3 text-sm focus:border-cyber-cyan outline-none transition-colors">
                <option value="ai">AI & Machine Learning</option>
                <option value="cyber">Cybersecurity</option>
                <option value="web3">Web3 & Quantum</option>
              </select>
            </div>
            <Button variant="primary" type="submit" className="w-full mt-4">Confirm Registration</Button>
          </form>
        )}
      </section>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[5000] flex items-center justify-center p-4">
          <div className="bg-cyber-card border border-cyber-cyan max-w-lg w-full rounded-xl p-8 relative shadow-[0_0_40px_rgba(0,240,255,0.3)]">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-cyber-muted hover:text-white font-mono text-xl">&times;</button>
            <span className="inline-block px-3 py-1 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-xs font-mono rounded mb-3">{selectedEvent.badge}</span>
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.title}</h3>
            <p className="text-cyber-muted text-sm mb-6 leading-relaxed">{selectedEvent.description}</p>
            <div className="space-y-3 font-mono text-sm border-t border-b border-cyber-border py-4 mb-6">
              <div className="flex justify-between">
                <span className="text-cyber-muted">Team Structure:</span>
                <span>{selectedEvent.teamSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyber-muted">Prize Pool:</span>
                <span className="text-cyber-cyan font-bold">{selectedEvent.prizes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyber-muted">Schedule Date:</span>
                <span>{selectedEvent.date}</span>
              </div>
            </div>
            <a href="#register" onClick={() => setSelectedEvent(null)}>
              <Button variant="primary" className="w-full text-center">Register For Track</Button>
            </a>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-cyber-border py-8 text-center text-cyber-muted text-xs font-mono">
        <p>&copy; 2026 TECHFEST // BEYOND THE CODE. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Mount application directly to DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
