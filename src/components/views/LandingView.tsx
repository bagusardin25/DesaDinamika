'use client';
import React from 'react';

interface Props {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: Props) {
  return (
    <section id="view-landing" className="view active">
      <div className="hero-section">
          <div className="hero-content">
              <div className="badge">🏆 Inovasi GEMASTIK 2025</div>
              <h1>Uji Coba Kebijakan Desa Anda Sebelum Diterapkan dengan <span className="gradient-text">AI Cerdas</span></h1>
              <p>Tidak perlu jadi ahli teknologi. Cukup masukkan rencana anggaran desa, dan sistem kami akan mensimulasikan bagaimana reaksi warga — sebelum kebijakan Anda dijalankan di dunia nyata.</p>
              <div className="hero-actions">
                  <button className="btn btn-primary btn-lg" onClick={() => onNavigate('view-dashboard')}>
                      <i className="fa-solid fa-rocket"></i> Mulai Sekarang — Gratis!
                  </button>
                  <button className="btn btn-outline btn-lg">
                      <i className="fa-regular fa-circle-play"></i> Tonton Demo
                  </button>
              </div>
              <div className="stats-row mt-4">
                  <div className="stat-item">
                      <h3 className="text-primary">Rp 2.4M</h3>
                      <p>Potensi Anggaran Terselamatkan</p>
                  </div>
                  <div className="stat-item">
                      <h3 className="text-secondary">98%</h3>
                      <p>Akurasi Prediksi Risiko</p>
                  </div>
                  <div className="stat-item">
                      <h3 className="text-accent">150+</h3>
                      <p>Desa Terbantu</p>
                  </div>
              </div>
          </div>
          <div className="hero-visual">
              <div className="mockup-container glass">
                  <div className="mockup-header">
                      <div className="dots"><span></span><span></span><span></span></div>
                      <div className="title">Balai Desa Virtual - Live</div>
                  </div>
                  <div className="mockup-body">
                      <div className="mockup-chart skeleton"></div>
                      <div className="mockup-bars">
                          <div className="bar skeleton w-70"></div>
                          <div className="bar skeleton w-90"></div>
                          <div className="bar skeleton w-50"></div>
                      </div>
                      <div className="agent-floating agent-1"><img src="https://i.pravatar.cc/150?img=33" alt="Agent" /></div>
                      <div className="agent-floating agent-2"><img src="https://i.pravatar.cc/150?img=47" alt="Agent" /></div>
                  </div>
              </div>
          </div>
      </div>

      <div className="features-section">
          <h2 className="text-center mb-4">Kemampuan Inti <span className="text-primary">Sistem</span></h2>
          <div className="feature-cards">
              <div className="feature-card glass">
                  <div className="icon-wrapper"><i className="fa-solid fa-users-gear text-primary"></i></div>
                  <h3>👥 Warga Virtual AI</h3>
                  <p>Sistem otomatis menciptakan warga desa virtual yang mewakili petani, pedagang, pemuda, dan kelompok lainnya — tanpa perlu survei manual.</p>
              </div>
              <div className="feature-card glass">
                  <div className="icon-wrapper"><i className="fa-solid fa-bolt text-accent"></i></div>
                  <h3>⚡ Uji Coba Tanpa Risiko</h3>
                  <p>Masukkan skenario krisis seperti kenaikan harga atau banjir, dan lihat langsung bagaimana warga akan bereaksi terhadap kebijakan Anda.</p>
              </div>
              <div className="feature-card glass">
                  <div className="icon-wrapper"><i className="fa-solid fa-chart-pie text-secondary"></i></div>
                  <h3>📊 Laporan Siap Pakai</h3>
                  <p>Dapatkan laporan PDF lengkap berisi prediksi risiko dan rekomendasi perbaikan yang bisa langsung dibawa ke forum musyawarah desa.</p>
              </div>
          </div>
      </div>
    </section>
  );
}
