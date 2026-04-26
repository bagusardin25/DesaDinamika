'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Types ---
interface Agent {
  name: string;
  role: string;
  img: string;
  status: 'happy' | 'angry' | 'neutral';
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  type: 'normal' | 'system' | 'danger';
  img: string;
  time: string;
}

interface GaugeData {
  label: string;
  value: number;
  state: 'success' | 'warning' | 'danger';
}

interface Props {
  onEndSimulation: () => void;
}

// --- Helpers ---
function getGaugeState(name: string, value: number): 'success' | 'warning' | 'danger' {
  if (name === 'Risiko Konflik') {
    if (value >= 60) return 'danger';
    if (value >= 30) return 'warning';
    return 'success';
  }
  // Satisfaction metrics
  if (value <= 40) return 'danger';
  if (value <= 70) return 'warning';
  return 'success';
}

function getGaugeColor(state: 'success' | 'warning' | 'danger') {
  if (state === 'danger') return 'var(--danger)';
  if (state === 'warning') return 'var(--warning)';
  return 'var(--primary)';
}

const INITIAL_AGENTS: Agent[] = [
  { name: 'Pak Budi', role: 'Petani', img: '33', status: 'happy' },
  { name: 'Bu Siti', role: 'Pedagang', img: '47', status: 'happy' },
  { name: 'Rudi', role: 'Pemuda', img: '12', status: 'happy' },
  { name: 'Pak Karto', role: 'Buruh', img: '59', status: 'neutral' },
  { name: 'Bu Ningsih', role: 'UMKM', img: '22', status: 'happy' },
];

// --- Component ---
export default function LiveSimulationView({ onEndSimulation }: Props) {
  const [simTime, setSimTime] = useState(0);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [gauges, setGauges] = useState<GaugeData[]>([
    { label: 'Kepuasan Petani', value: 75, state: 'success' },
    { label: 'Risiko Konflik', value: 15, state: 'success' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const addMessage = useCallback((sender: string, text: string, type: ChatMessage['type'] = 'normal', img = 'default') => {
    msgIdRef.current++;
    setMessages(prev => [...prev, {
      id: msgIdRef.current,
      sender, text, type, img,
      time: '' // will be filled by render based on simTime
    }]);
  }, []);

  const updateGauge = useCallback((label: string, value: number) => {
    setGauges(prev => prev.map(g => g.label === label ? { ...g, value, state: getGaugeState(label, value) } : g));
  }, []);

  const updateAgentStatus = useCallback((name: string, status: Agent['status']) => {
    setAgents(prev => prev.map(a => a.name === name ? { ...a, status } : a));
  }, []);

  // Initial system message
  useEffect(() => {
    addMessage('Sistem', 'Simulasi Musyawarah dimulai. 500 warga virtual telah hadir di Balai Desa.', 'system');
  }, [addMessage]);

  // Simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSimTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scripted events
  useEffect(() => {
    if (simTime === 2) setIsTyping(true);
    if (simTime === 4) {
      setIsTyping(false);
      addMessage('Pak Budi (Petani)', 'Saya setuju kalau sisa anggarannya buat BUMDes pupuk, petani butuh subsidi mas.', 'normal', '33');
      updateGauge('Kepuasan Petani', 85);
    }
    if (simTime === 8) setIsTyping(true);
    if (simTime === 10) {
      setIsTyping(false);
      addMessage('Rudi (Pemuda)', 'Loh Pak Kades, kalau jalan gang mawar nggak diperbaiki, gimana kami mau lewat kerja shift malam? Jalannya hancur!', 'danger', '12');
      updateAgentStatus('Rudi', 'angry');
      updateGauge('Risiko Konflik', 40);
    }
    if (simTime === 15) {
      addMessage('Bu Siti (Pedagang)', 'Betul kata Rudi, kasihan yang jualan keliling gerobaknya nyangkut terus di lubang.', 'danger', '47');
      updateAgentStatus('Bu Siti', 'angry');
      updateGauge('Risiko Konflik', 55);
    }
    if (simTime === 60) onEndSimulation();
  }, [simTime, addMessage, updateGauge, updateAgentStatus, onEndSimulation]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const injectCrisis = useCallback((type: string) => {
    addMessage('Sistem', `INTERVENSI: Situasi krisis (${type}) disuntikkan.`, 'system');
    
    if (type === 'hoax') {
      setTimeout(() => {
        addMessage('Pak Karto (Buruh)', 'Ada info di grup WA, katanya uang jalan mau dikorupsi buat beli mobil dinas BUMDes! Betul itu?', 'danger', '59');
        updateAgentStatus('Pak Karto', 'angry');
        updateGauge('Risiko Konflik', 82);
        updateGauge('Kepuasan Petani', 75);
      }, 2000);
    } else if (type === 'subsidi') {
      setTimeout(() => {
        addMessage('Sistem', 'Kades mengumumkan janji subsidi tambahan tunai.', 'system');
        updateGauge('Risiko Konflik', 30);
        updateGauge('Kepuasan Petani', 95);
      }, 1500);
    } else if (type === 'protes') {
      setTimeout(() => {
        addMessage('Rudi (Pemuda)', 'KAMI AKAN DEMO BESOK DI BALAI DESA JIKA JALAN TIDAK DIASPAL!', 'danger', '12');
        updateGauge('Risiko Konflik', 90);
      }, 1000);
    }
  }, [addMessage, updateGauge, updateAgentStatus]);

  return (
    <section id="view-simulation" className="view active">
      {/* Header */}
      <div className="simulation-header glass mb-3">
        <div className="sim-title">
          <span className="live-dot"></span> LIVE: Pemangkasan Anggaran Jalan
        </div>
        <div className="sim-timer" id="sim-timer">{formatTime(simTime)}</div>
        <button className="btn btn-sm btn-danger" onClick={onEndSimulation}>Akhiri Simulasi</button>
      </div>

      <div className="simulation-grid">
        {/* Left: Agent Panel */}
        <div className="agent-panel glass">
          <div className="panel-header">
            <h3><i className="fa-solid fa-users"></i> Daftar Warga Virtual</h3>
            <span className="badge">500 Hadir</span>
          </div>
          <div className="agent-list" id="agent-list">
            {agents.map(agent => (
              <div className={`agent-item ${agent.status}`} key={agent.name}>
                <img src={`https://i.pravatar.cc/150?img=${agent.img}`} alt={agent.name} />
                <div className="info">
                  <h4>{agent.name}</h4>
                  <p>{agent.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Chat */}
        <div className="chat-panel glass">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem', padding: '0.8rem 1rem' }}>
            <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white' }}>
              <i className="fa-solid fa-users"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.2 }}>Grup Balai Desa Virtual</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online - 500 Anggota</span>
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.2rem' }}>
              <i className="fa-solid fa-video"></i>
              <i className="fa-solid fa-phone"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
          </div>

          <div className="chat-messages" id="chat-messages">
            {messages.map(msg => (
              <div className="message" key={msg.id} style={msg.type === 'system' ? { maxWidth: '100%' } : undefined}>
                {msg.type === 'system' ? (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', borderRadius: 12, color: '#E2E8F0', fontSize: '0.75rem', textAlign: 'center' }}>
                      <i className="fa-solid fa-circle-info text-warning"></i> {msg.text}
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      src={msg.img === 'default' ? 'https://i.pravatar.cc/150?img=11' : `https://i.pravatar.cc/150?img=${msg.img}`} 
                      alt={msg.sender} 
                      style={{ width: 36, height: 36, borderRadius: '50%', alignSelf: 'flex-start' }} 
                    />
                    <div className="message-bubble" style={{ background: '#1E293B', padding: '0.5rem 0.8rem', borderRadius: '0 12px 12px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', minWidth: 150, position: 'relative' }}>
                      <h5 className={msg.type === 'danger' ? 'danger' : ''} style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: msg.type === 'danger' ? 'var(--danger)' : 'var(--primary)' }}>{msg.sender}</h5>
                      <p style={{ margin: 0, fontSize: '0.95rem', paddingBottom: '0.8rem' }}>{msg.text}</p>
                      <div style={{ position: 'absolute', bottom: '0.3rem', right: '0.6rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {formatTime(simTime)} <i className="fa-solid fa-check-double text-success" style={{ marginLeft: 2 }}></i>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator" id="typing-indicator">
                <span></span><span></span><span></span> Warga sedang merespons...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right: Metrics & God Mode */}
        <div className="metrics-panel">
          <div className="glass metrics-top mb-3">
            <h3><i className="fa-solid fa-chart-line"></i> Sentimen Real-time</h3>
            <div className="gauge-container">
              {gauges.map(gauge => (
                <div className="gauge" key={gauge.label}>
                  <div 
                    className={`circular-progress ${gauge.state === 'danger' ? 'danger' : gauge.state === 'warning' ? 'warning' : ''}`}
                    style={{ background: `conic-gradient(${getGaugeColor(gauge.state)} ${(gauge.value / 100) * 360}deg, rgba(255,255,255,0.1) 0deg)` }}
                  >
                    <span className={`progress-value ${gauge.state === 'danger' ? 'text-danger' : gauge.state === 'warning' ? 'text-warning' : 'text-success'}`}>
                      {gauge.value}%
                    </span>
                  </div>
                  <span>{gauge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass god-mode-panel">
            <h3><i className="fa-solid fa-bolt"></i> ⚡ Masukkan Situasi Mendadak</h3>
            <p className="text-xs text-muted mb-3">Pilih salah satu skenario untuk melihat bagaimana warga desa akan bereaksi.</p>
            
            <div className="intervention-btns">
              <button className="btn btn-sm btn-outline btn-block text-left mb-2" onClick={() => injectCrisis('hoax')}>
                <i className="fa-brands fa-whatsapp text-success"></i> 📢 Sebarkan Hoax di Grup WA
              </button>
              <button className="btn btn-sm btn-outline btn-block text-left mb-2" onClick={() => injectCrisis('protes')}>
                <i className="fa-solid fa-bullhorn text-danger"></i> ✊ Pemuda Mengancam Demo
              </button>
              <button className="btn btn-sm btn-outline btn-block text-left" onClick={() => injectCrisis('subsidi')}>
                <i className="fa-solid fa-hand-holding-dollar text-primary"></i> 💰 Kades Janjikan Subsidi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
