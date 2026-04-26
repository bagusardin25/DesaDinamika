'use client';
import React from 'react';

interface Props {
  onNavigate: (view: string) => void;
}

export default function DashboardView({ onNavigate }: Props) {
  return (
    <section id="view-dashboard" className="view active">
      <div className="dashboard-header">
          <div>
              <h2>💼 Meja Kerja Kades</h2>
              <p className="text-muted">Selamat datang, Pak Budi. Berikut ringkasan simulasi kebijakan desa Anda.</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('view-setup')}>
              <i className="fa-solid fa-plus"></i> Buat Simulasi Baru
          </button>
      </div>

      <div className="metrics-grid">
          <div className="metric-card glass">
              <div className="metric-icon"><i className="fa-solid fa-layer-group text-primary"></i></div>
              <div className="metric-info">
                  <h3>12</h3>
                  <p>📝 Simulasi Bulan Ini</p>
              </div>
          </div>
          <div className="metric-card glass">
              <div className="metric-icon"><i className="fa-solid fa-check-double text-secondary"></i></div>
              <div className="metric-info">
                  <h3>85%</h3>
                  <p>✅ Kebijakan Berhasil</p>
              </div>
          </div>
          <div className="metric-card glass">
              <div className="metric-icon"><i className="fa-solid fa-face-smile text-accent"></i></div>
              <div className="metric-info">
                  <h3>7.8/10</h3>
                  <p>😊 Kepuasan Warga</p>
              </div>
          </div>
      </div>

      <div className="table-container glass mt-4">
          <div className="table-header">
              <h3>Riwayat Simulasi Terakhir</h3>
              <div className="search-box">
                  <i className="fa-solid fa-search"></i>
                  <input type="text" placeholder="Cari simulasi..." />
              </div>
          </div>
          <table className="data-table">
              <thead>
                  <tr>
                      <th>Nama Simulasi</th>
                      <th>Tanggal</th>
                      <th>Anggaran</th>
                      <th>Status Risiko</th>
                      <th>Aksi</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Pemotongan BLT 2025</td>
                      <td>24 Apr 2026</td>
                      <td>Rp 150.000.000</td>
                      <td><span className="badge-status danger">Rawan Konflik</span></td>
                      <td><button className="btn btn-sm btn-outline" onClick={() => onNavigate('view-report')}>Lihat Laporan</button></td>
                  </tr>
                  <tr>
                      <td>Pembangunan Irigasi Timur</td>
                      <td>20 Apr 2026</td>
                      <td>Rp 450.000.000</td>
                      <td><span className="badge-status success">Aman</span></td>
                      <td><button className="btn btn-sm btn-outline" onClick={() => onNavigate('view-report')}>Lihat Laporan</button></td>
                  </tr>
                  <tr>
                      <td>Pajak BUMDes Baru</td>
                      <td>15 Apr 2026</td>
                      <td>Rp 0</td>
                      <td><span className="badge-status warning">Perlu Revisi</span></td>
                      <td><button className="btn btn-sm btn-outline" onClick={() => onNavigate('view-report')}>Lihat Laporan</button></td>
                  </tr>
              </tbody>
          </table>
      </div>
    </section>
  );
}
