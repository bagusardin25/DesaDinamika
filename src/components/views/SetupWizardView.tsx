'use client';
import React, { useState, useCallback } from 'react';

interface SliderItem {
  id: string;
  label: string;
  value: number;
}

interface Props {
  onNavigate: (view: string) => void;
  onStartSimulation: () => void;
}

export default function SetupWizardView({ onNavigate, onStartSimulation }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLaunchReady, setIsLaunchReady] = useState(false);
  const [customAgentName, setCustomAgentName] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  const [sliders, setSliders] = useState<SliderItem[]>([
    { id: 'petani', label: 'Petani', value: 40 },
    { id: 'buruh', label: 'Buruh/Pekerja', value: 30 },
    { id: 'umkm', label: 'UMKM/Pedagang', value: 20 },
    { id: 'pemuda', label: 'Pemuda/Pelajar', value: 10 },
  ]);

  const handleSliderChange = useCallback((id: string, newValue: number) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
  }, []);

  const addCustomAgent = useCallback(() => {
    const name = customAgentName.trim();
    if (!name) return;
    const idSafe = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setSliders(prev => [...prev, { id: idSafe, label: name, value: 10 }]);
    setCustomAgentName('');
  }, [customAgentName]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    if (step === 3) {
      setIsLaunchReady(false);
      setTimeout(() => setIsLaunchReady(true), 1500);
    }
  }, []);

  const formatCurrency = (val: string) => {
    const digits = val.replace(/[^0-9]/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <section id="view-setup" className="view active">
      <div className="setup-container">
        <div className="stepper glass">
          {[1, 2, 3].map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <div className="step-line"></div>}
              <div className={`step ${currentStep >= step ? 'active' : ''}`} data-step={step}>
                <div className="step-circle">{step}</div>
                <span>{['Demografi', 'Kebijakan', 'Review'][i]}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-content glass">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="wizard-step active" id="step-1">
              <h3>👨‍🌾 Siapa Warga Desa Anda?</h3>
              <p className="text-muted mb-4">Geser slider di bawah untuk menentukan komposisi penduduk desa. Tidak perlu tepat — cukup perkiraan saja.</p>
              
              <div className="upload-area mb-4">
                <i className="fa-solid fa-cloud-arrow-up text-primary" style={{ fontSize: '2rem' }}></i>
                <h4>Unggah Profil Desa (Opsional)</h4>
                <p>Upload PDF/Excel untuk auto-fill data</p>
                <button className="btn btn-outline btn-sm mt-2">Pilih File</button>
              </div>

              <div className="sliders-grid" id="demography-sliders">
                {sliders.map(slider => (
                  <div className="slider-group" key={slider.id}>
                    <label>{slider.label} (<span>{slider.value}</span>%)</label>
                    <input 
                      type="range" min="0" max="100" 
                      value={slider.value} 
                      onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))} 
                    />
                  </div>
                ))}
              </div>

              <div className="add-agent-section mt-3 mb-4 p-3" style={{ background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', padding: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>+ Tambah Kategori Warga Lainnya</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" className="form-control" 
                    placeholder="Cth: Tokoh Agama, Bidan Desa..." 
                    style={{ padding: '0.5rem 0.8rem' }}
                    value={customAgentName}
                    onChange={(e) => setCustomAgentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomAgent()}
                  />
                  <button className="btn btn-outline" onClick={addCustomAgent}>Tambah</button>
                </div>
              </div>

              <div className="wizard-actions">
                <button className="btn btn-outline" onClick={() => onNavigate('view-dashboard')}>Batal</button>
                <button className="btn btn-primary" onClick={() => goToStep(2)}>Lanjut ke Kebijakan <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="wizard-step active" id="step-2">
              <h3>📝 Kebijakan Apa yang Ingin Diuji?</h3>
              <p className="text-muted mb-4">Tulis rencana kebijakan atau anggaran yang ingin disimulasikan. Bisa juga langsung unggah file RAB.</p>
              
              <div className="form-group mb-3">
                <label>Nama Simulasi / Kebijakan</label>
                <input type="text" className="form-control" placeholder="Contoh: Pemangkasan Anggaran Jalan untuk BUMDes" />
              </div>
              
              <div className="form-group mb-3">
                <label>Total Anggaran (Rp)</label>
                <input 
                  type="text" className="form-control" 
                  placeholder="Contoh: 150.000.000"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(formatCurrency(e.target.value))}
                />
              </div>
              
              <div className="upload-area mb-4" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <i className="fa-solid fa-file-excel text-success" style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}></i>
                <i className="fa-solid fa-file-pdf text-danger" style={{ fontSize: '1.5rem' }}></i>
                <h4 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>Atau Unggah Draf RAB (.xlsx / .pdf)</h4>
                <p className="text-xs text-muted">Sistem akan mengekstrak detail kegiatan dan anggaran otomatis</p>
                <button className="btn btn-outline btn-sm mt-2">Pilih File RAB</button>
              </div>
              
              <div className="form-group mb-4">
                <label>Deskripsi Detail Kebijakan</label>
                <textarea className="form-control" rows={5} placeholder="Jelaskan secara rinci... (misal: Memangkas anggaran perbaikan jalan sebesar 30% untuk dialihkan ke BUMDes guna modal usaha pupuk subsidi)"></textarea>
              </div>

              <div className="wizard-actions">
                <button className="btn btn-outline" onClick={() => goToStep(1)}><i className="fa-solid fa-arrow-left"></i> Kembali</button>
                <button className="btn btn-primary" onClick={() => goToStep(3)}>Lanjut ke Review <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="wizard-step active" id="step-3">
              <h3>🚀 Semua Siap!</h3>
              <div className="launch-summary text-center my-4">
                <div className="spinner mb-3"><i className="fa-solid fa-circle-notch fa-spin text-primary" style={{ fontSize: '3rem' }}></i></div>
                <h4>Sistem Siap Mengundang <span className="text-primary">500 Warga Virtual</span></h4>
                <p className="text-muted">AI telah memetakan demografi dan memuat parameter kebijakan. Balai Desa Virtual sudah siap dibuka.</p>
              </div>
              
              <div className="wizard-actions justify-center mt-4">
                <button className="btn btn-outline mr-2" onClick={() => goToStep(2)}>Edit Kembali</button>
                <button 
                  className="btn btn-primary btn-lg launch-btn" 
                  disabled={!isLaunchReady}
                  onClick={onStartSimulation}
                >
                  {isLaunchReady 
                    ? <><i className="fa-solid fa-play"></i> Mulai Simulasi Balai Desa</>
                    : <><i className="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan Agen...</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
