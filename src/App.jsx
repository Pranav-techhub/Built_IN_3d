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
// THREE.JS 3D SCENE COMPONENTS
// ==========================================
function TechSphere() {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.8}>
      <icosahedronGeometry args={[2, 2]} />
      <meshBasicMaterial color="#00f0ff" wireframe />
    </mesh>
  );
}

function FloatingParticles({ count = 250 }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
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
      <pointsMaterial size={0.05} color="#7000ff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function NeuralNetworkMesh() {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1.8, 0.4, 100, 16]} />
        <meshStandardMaterial color="#7000ff" wireframe />
      </mesh>
    </group>
  );
}

function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#7000ff" />
        <TechSphere />
        <FloatingParticles />
        <gridHelper args={[30, 30, '#00f0ff', '#1e2638']} position={[0, -3, 0]} />
      </Canvas>
    </div>
  );
}

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================
function Button({ children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const base = "px-6 py-3 rounded-md font-mono font-semibold transition-all duration-300 transform active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:-translate-y-0.5",
    secondary: "bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10",
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
      <h2 className="font-mono text-3xl md:text-4xl font-bold text-cyber-cyan tracking-wider">
        <span className="text-cyber-purple mr-3">{index} //</span>{title}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-2" />
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
        className="fixed w-2 h-2 bg-cyber-cyan rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
      <div 
        className="fixed w-8 h-8 border border-cyber-cyan rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
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
      <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-150" style={{ width: `${progress}%` }} />
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
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = filter === 'all' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(e => e.category === filter);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-cyber-bg flex flex-col items-center justify-center z-[10000]">
        <div className="w-16 h-16 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-cyber-cyan tracking-widest animate-pulse">// INITIALIZING SYSTEM...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-cyber-bg text-cyber-text min-h-screen">
      <CustomCursor />
      <ScrollProgress />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-cyber-bg/80 backdrop-blur-md border-b border-cyber-border z-[1000]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-mono font-bold text-xl tracking-widest text-white">
            TECHFEST<span className="text-cyber-cyan">//2026</span>
          </div>
          <nav className="hidden md:flex gap-8 font-mono text-sm text-cyber-muted">
            <a href="#about" className="hover:text-cyber-cyan transition-colors">About</a>
            <a href="#events" className="hover:text-cyber-cyan transition-colors">Events</a>
            <a href="#experience" className="hover:text-cyber-cyan transition-colors">Experience</a>
            <a href="#schedule" className="hover:text-cyber-cyan transition-colors">Schedule</a>
            <a href="#speakers" className="hover:text-cyber-cyan transition-colors">Speakers</a>
          </nav>
          <a href="#register">
            <Button variant="primary" className="text-sm px-4 py-2">Register</Button>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <HeroScene />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-cyber-cyan text-sm tracking-widest mb-4">// ANNUAL TECHNICAL SYMPOSIUM</p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-cyber-text to-cyber-muted bg-clip-text text-transparent">
            BEYOND THE CODE
          </h1>
          <p className="text-cyber-muted text-base md:text-lg max-w-2xl mx-auto mb-8 font-sans">
            Architecting the Next Technological Epoch • October 24-26, 2026
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#events"><Button variant="primary">Explore Tracks</Button></a>
            <a href="#schedule"><Button variant="secondary">View Schedule</Button></a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="01" title="ABOUT THE SYMPOSIUM" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-lg">
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">3 Days of Innovation</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">High-impact hackathons, algorithmic arenas, and keynotes led by global engineering pioneers.</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-lg">
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">$50,000+ Prize Pool</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">Compete across multiple domains, from deep learning agents to post-quantum cryptographic ledgers.</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border p-8 rounded-lg">
            <h3 className="font-mono font-bold text-cyber-cyan text-xl mb-3">2,000+ Pioneers</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">Network with developers, researchers, founders, and technical visionaries from around the globe.</p>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="py-24 px-6 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <SectionTitle index="02" title="TRACKS & COMPETITIONS" />
          
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 font-mono text-xs">
            {['all', 'ai', 'cyber', 'web3'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded border uppercase transition-colors ${filter === cat ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10' : 'border-cyber-border text-cyber-muted'}`}
              >
                {cat === 'all' ? 'All Tracks' : cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all duration-300 hover:-translate-y-1 group">
                <span className="inline-block px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono rounded mb-4">
                  {event.badge}
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-cyan transition-colors">{event.title}</h3>
                <p className="text-cyber-muted text-sm mb-6">{event.description}</p>
                <div className="flex items-center justify-between font-mono text-xs text-cyber-text/80 mb-4">
                  <span>Prize Pool: <strong className="text-cyber-cyan">{event.prizes}</strong></span>
                  <span>{event.date}</span>
                </div>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="w-full py-2 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs rounded hover:bg-cyber-cyan/10 transition-colors"
                >
                  View Details & Rules
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE EXPERIENCE SECTION */}
      <section id="experience" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="03" title="INTERACTIVE NETWORK" />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Neural Architecture Visualization</h3>
            <p className="text-cyber-muted text-sm leading-relaxed mb-6">
              Step into our real-time 3D interactive playground built with React Three Fiber. Observe complex topological nodes rendered dynamically.
            </p>
          </div>
          <div className="h-80 bg-cyber-card border border-cyber-border rounded-lg overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <NeuralNetworkMesh />
            </Canvas>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section id="schedule" className="py-24 px-6 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <SectionTitle index="04" title="EVENT TIMELINE" />
          <div className="flex gap-4 mb-8 font-mono text-sm">
            {[
              { id: 'day1', label: 'Day 01 (Oct 24)' },
              { id: 'day2', label: 'Day 02 (Oct 25)' },
              { id: 'day3', label: 'Day 03 (Oct 26)' },
            ].map(day => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`px-6 py-3 rounded border transition-colors ${activeDay === day.id ? 'bg-cyber-purple border-cyber-purple text-white' : 'bg-cyber-card border-cyber-border text-cyber-muted'}`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {SCHEDULE_DATA[activeDay].map((item, idx) => (
              <div key={idx} className="bg-cyber-card border-l-4 border-cyber-cyan border-y border-r border-cyber-border p-5 rounded-r-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="font-mono text-cyber-cyan font-bold text-sm min-w-[100px]">{item.time}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-cyber-muted text-xs font-mono mt-1">{item.location} {item.speaker && `• ${item.speaker}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKERS SECTION */}
      <section id="speakers" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle index="05" title="KEYNOTE SPEAKERS" />
        <div className="grid md:grid-cols-3 gap-6">
          {SPEAKERS_DATA.map(speaker => (
            <div key={speaker.id} className="bg-cyber-card border border-cyber-border rounded-lg p-6 text-center hover:border-cyber-purple transition-colors">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-purple mx-auto mb-4 flex items-center justify-center font-mono font-bold text-2xl text-white">
                {speaker.name.charAt(0)}
              </div>
              <h3 className="font-bold text-lg">{speaker.name}</h3>
              <p className="text-cyber-cyan text-xs font-mono mt-1">{speaker.role}</p>
              <p className="text-cyber-muted text-xs mt-1">{speaker.company}</p>
              <div className="mt-4 pt-4 border-t border-cyber-border text-xs text-cyber-text/80 font-mono">
                Topic: "{speaker.topic}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPONSORS SECTION */}
      <section className="py-24 px-6 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-7xl mx-auto">
          <SectionTitle index="06" title="GLOBAL PARTNERS" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SPONSORS_DATA.map(sponsor => (
              <div key={sponsor.id} className="bg-cyber-card border border-cyber-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-cyber-cyan transition-colors">
                <h4 className="font-mono font-bold text-xl text-cyber-text tracking-widest mb-1">{sponsor.name}</h4>
                <span className="text-xs font-mono text-cyber-cyan">{sponsor.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER SECTION */}
      <section id="register" className="py-24 px-6 max-w-2xl mx-auto">
        <SectionTitle index="07" title="REGISTER NOW" />
        {submitted ? (
          <div className="bg-cyber-card border border-cyber-cyan p-8 rounded-lg text-center font-mono">
            <h3 className="text-2xl text-cyber-cyan mb-2">APPLICATION RECEIVED</h3>
            <p className="text-cyber-muted text-sm">Check your inbox for verification and access pass.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-cyber-card border border-cyber-border p-8 rounded-lg space-y-4">
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">FULL NAME</label>
              <input required type="text" placeholder="John Doe" className="w-full bg-cyber-bg border border-cyber-border rounded p-3 text-sm focus:border-cyber-cyan outline-none" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">EMAIL ADDRESS</label>
              <input required type="email" placeholder="john@example.com" className="w-full bg-cyber-bg border border-cyber-border rounded p-3 text-sm focus:border-cyber-cyan outline-none" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1">PRIMARY TRACK</label>
              <select className="w-full bg-cyber-bg border border-cyber-border rounded p-3 text-sm focus:border-cyber-cyan outline-none">
                <option value="ai">AI & Machine Learning</option>
                <option value="cyber">Cybersecurity</option>
                <option value="web3">Web3 & Quantum</option>
              </select>
            </div>
            <Button variant="primary" type="submit" className="w-full mt-4">Submit Application</Button>
          </form>
        )}
      </section>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
          <div className="bg-cyber-card border border-cyber-cyan max-w-lg w-full rounded-lg p-6 relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-cyber-muted hover:text-white font-mono text-xl">&times;</button>
            <span className="inline-block px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono rounded mb-2">{selectedEvent.badge}</span>
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.title}</h3>
            <p className="text-cyber-muted text-sm mb-6">{selectedEvent.description}</p>
            <div className="space-y-2 font-mono text-sm border-t border-b border-cyber-border py-4 mb-6">
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
              <Button variant="primary" className="w-full text-center">Register For This Event</Button>
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
