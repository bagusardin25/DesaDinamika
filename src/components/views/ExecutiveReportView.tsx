'use client';
import React from 'react';

interface Props {
  onNavigate: (view: string) => void;
}

export default function ExecutiveReportView({ onNavigate }: Props) {
  return (
    <section id="view-report" className="view active">
      <div className="report-container glass">
        <div className="report-header">
          <div className="report-title-area">
            <h2>Laporan Mitigasi Risiko Kebijakan</h2>
            <h3 className="text-muted">Pemangkasan Anggaran Jalan untuk BUMDes</h3>
          </div>
          <div className="report-actions">
            <button className="btn btn-outline"><i className="fa-solid fa-print"></i> Cetak</button>
            <button className="btn btn-primary"><i className="fa-solid fa-file-pdf"></i> Export PDF</button>
          </div>
        </div>

        <div className="ai-conclusion warning-box mt-4">
          <div className="icon"><i className="fa-solid fa-triangle-exclamation"></i></div>
          <div className="content">
            <h4>Kesimpulan AI: Perlu Revisi Taktis</h4>
            <p>Kebijakan ini menguntungkan kelompok Petani (75% mendukung), namun memicu penolakan keras dan risiko konflik tinggi (82%) dari kelompok Buruh dan Pemuda karena akses jalan sangat vital bagi mobilitas mereka. Implementasi dalam kondisi saat ini tidak disarankan tanpa penyesuaian.</p>
          </div>
        </div>

        <div className="report-grid mt-4">
          <div className="chart-section glass">
            <h4><i className="fa-solid fa-chart-area"></i> Tren Sentimen Warga</h4>
            <div className="dummy-chart">
              <div className="chart-bars">
                <div className="c-bar h-60"></div>
                <div className="c-bar h-65"></div>
                <div className="c-bar h-50"></div>
                <div className="c-bar h-40"></div>
                <div className="c-bar h-30 bg-danger"></div>
                <div className="c-bar h-20 bg-danger"></div>
                <div className="c-bar h-25 bg-danger"></div>
              </div>
              <div className="chart-labels">
                <span>Menit 1</span>
                <span>Inject Hoax</span>
                <span>Menit 5</span>
              </div>
            </div>
          </div>
          
          <div className="recommendations-section glass">
            <h4><i className="fa-solid fa-lightbulb text-accent"></i> Rekomendasi Actionable</h4>
            <ul className="rec-list">
              <li><strong>Kompensasi Tertarget:</strong> Sisihkan 5% dari modal BUMDes untuk program padat karya perbaikan jalan ringan bagi pemuda setempat.</li>
              <li><strong>Komunikasi Publik:</strong> Fokuskan sosialisasi pada manfaat ekonomi jangka panjang dari BUMDes untuk menyerap tenaga kerja lokal.</li>
              <li><strong>Mitigasi Hoax:</strong> Aktifkan aparatur desa tingkat RT/RW untuk mengklarifikasi bahwa perbaikan jalan tidak dihentikan total, melainkan ditunda sebagian.</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button className="btn btn-outline" onClick={() => onNavigate('view-dashboard')}>Kembali ke Dashboard</button>
        </div>
      </div>
    </section>
  );
}
