"use client";

import React, { useState } from "react";
import {
  Award,
  Medal,
  FileText,
  CloudUpload,
  Lock,
  CheckSquare,
  Target,
  Lightbulb,
  ShieldAlert,
  Image as ImageIcon,
} from "lucide-react";
import { DimensiScoreItem } from "./multiJenjangQuestionsData";
import { DAFTAR_8_MISI_KANVAS, MisiKanvasId } from "./kidsCanvasIllustrations";

interface ReportProps {
  modeJenjang: "anak_tk_sd" | "smp" | "sma";
  namaPeserta: string;
  instansiPeserta: string;
  emailPeserta: string;
  judulLaporan: string;
  subjudulJenjang: string;
  daftarUrut: DimensiScoreItem[];
  galeriKaryaKanvas?: Partial<Record<MisiKanvasId, string>>;
  infoTambahanAtas?: React.ReactNode;
  statusCloud: string;
  onSimpanCloud: () => void;
}

export const MultiJenjangCertificateAndReport: React.FC<ReportProps> = ({
  modeJenjang,
  namaPeserta,
  instansiPeserta,
  emailPeserta,
  judulLaporan,
  subjudulJenjang,
  daftarUrut,
  galeriKaryaKanvas = {},
  infoTambahanAtas,
  statusCloud,
  onSimpanCloud,
}) => {
  const [modeCetak, setModeCetak] = useState<
    "semua" | "sertifikat_landscape" | "laporan_portrait"
  >("semua");

  const cetakTerpisah = (
    target: "sertifikat_landscape" | "laporan_portrait"
  ) => {
    setModeCetak(target);
    setTimeout(() => {
      window.print();
      setTimeout(() => setModeCetak("semua"), 500);
    }, 200);
  };

  const top3 = daftarUrut.slice(0, 3);
  const kekuatanPendukung = daftarUrut.slice(
    3,
    Math.max(4, daftarUrut.length - 2)
  );
  const areaLemah = daftarUrut.slice(-2);
  const karyaList = Object.entries(galeriKaryaKanvas);
  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Render Spider Radar Chart SVG
  const renderSpiderRadarSvg = (items: DimensiScoreItem[]) => {
    const cx = 145;
    const cy = 145;
    const maxR = 94;
    const n = items.length;
    if (n === 0) return null;

    const points = items
      .map((item, idx) => {
        const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
        const r = (Math.max(18, item.persen) / 100) * maxR;
        const x = (cx + r * Math.cos(angle)).toFixed(1);
        const y = (cy + r * Math.sin(angle)).toFixed(1);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg viewBox="0 0 290 290" className="w-64 h-64 overflow-visible mx-auto">
        {[0.25, 0.5, 0.75, 1].map((st, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={maxR * st}
            fill="none"
            stroke="#cbd5e1"
            strokeDasharray="3 2"
            strokeWidth="1"
          />
        ))}
        {items.map((item, idx) => {
          const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
          const x2 = cx + maxR * Math.cos(angle);
          const y2 = cy + maxR * Math.sin(angle);
          const lx = cx + (maxR + 26) * Math.cos(angle);
          const ly = cy + (maxR + 22) * Math.sin(angle);
          return (
            <g key={item.id}>
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                fill="#0f172a"
                fontSize="8.5"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {item.ikon} {item.nama.split(" ")[0]} ({item.persen}%)
              </text>
            </g>
          );
        })}
        <polygon
          points={points}
          fill="rgba(225, 29, 72, 0.25)"
          stroke="#e11d48"
          strokeWidth="2.5"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 print:space-y-0">
      {/* INJEKSI CSS DINAMIS: SERTIFIKAT OTOMATIS A4 LANDSCAPE, LAPORAN OTOMATIS A4 PORTRAIT */}
      {modeCetak === "sertifikat_landscape" ? (
        <style jsx global>{`
          @media print {
            @page {
              size: A4 landscape !important;
              margin: 6mm 8mm 6mm 8mm !important;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: #ffffff !important;
            }
          }
        `}</style>
      ) : (
        <style jsx global>{`
          @media print {
            @page {
              size: A4 portrait !important;
              margin: 8mm 8mm 10mm 8mm !important;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: #ffffff !important;
            }
          }
        `}</style>
      )}

      {/* TOOLBAR 2 PILIHAN PRINT TERPISAH */}
      <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs font-bold text-emerald-400">
          ✓{" "}
          {statusCloud ||
            "Pilih Cetak Sertifikat (A4 Landscape) atau Cetak Laporan Hasil (A4 Portrait):"}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSimpanCloud}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" /> Simpan ke Akun Cloud
          </button>

          <button
            type="button"
            onClick={() => cetakTerpisah("sertifikat_landscape")}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Medal className="w-4 h-4" /> 1. Print Sertifikat Saja (A4 Landscape)
          </button>

          <button
            type="button"
            onClick={() => cetakTerpisah("laporan_portrait")}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <FileText className="w-4 h-4" /> 2. Print Laporan Hasil Saja (A4 Portrait)
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BLOK 1: SERTIFIKAT PENGHARGAAN EMAS (FORMAT A4 LANDSCAPE MELEBAR)   */}
      {/* =================================================================== */}
      <div
        className={
          modeCetak === "laporan_portrait"
            ? "hidden print:hidden"
            : "p-1.5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-2xl print:shadow-none break-inside-avoid print:w-full print:max-h-[192mm] print:overflow-hidden"
        }
      >
        <div className="bg-gradient-to-b from-[#fffdf5] via-white to-[#fefce8] text-slate-900 p-6 sm:p-8 print:px-8 print:py-5 rounded-[22px] border-4 border-double border-amber-600/80 space-y-3.5 print:space-y-2.5 relative">
          {/* Header Sertifikat Landscape */}
          <div className="flex justify-between items-center gap-4 border-b-2 border-amber-300 pb-2.5">
            <div className="flex items-center gap-3.5">
              <img
                src="/hibahilmu.jpg"
                alt="Logo Panda HibahIlmu"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                }}
                className="w-14 h-14 print:w-12 print:h-12 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
              />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                  OFFICIAL TALENT CERTIFICATE • PANDA HIBAHILMU INDONESIA
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  SERTIFIKAT PENGHARGAAN BAKAT &amp; POTENSI EMAS
                </h3>
                <div className="text-[11px] font-bold text-emerald-700">
                  {subjudulJenjang.split(" •")[0]}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs">
                <Award className="w-4 h-4" /> TERVERIFIKASI RESMI
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                Diterbitkan: {tanggalCetak}
              </span>
            </div>
          </div>

          {/* Nama & Gelar */}
          <div className="text-center space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Diberikan dengan bangga kepada:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-4">
              {namaPeserta || "Ananda / Siswa Berbakat"}
            </div>
            <div className="pt-1">
              <span className="inline-block px-4 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow-xs">
                🌟 Gelar Bakat Utama: &ldquo;{top3[0]?.julukan || "Bintang Masa Depan"}&rdquo;
              </span>
            </div>
          </div>

          {/* Grid Landscape: 3 Medali Bakat + Galeri Lukisan Anak */}
          <div
            className={`grid gap-3 items-stretch ${
              modeJenjang === "anak_tk_sd" && karyaList.length > 0
                ? "grid-cols-1 lg:grid-cols-12 print:grid-cols-12"
                : "grid-cols-1"
            }`}
          >
            <div
              className={
                modeJenjang === "anak_tk_sd" && karyaList.length > 0
                  ? "lg:col-span-7 print:col-span-7 grid grid-cols-3 gap-2.5"
                  : "grid grid-cols-3 gap-3"
              }
            >
              {top3.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 print:p-2.5 rounded-2xl bg-white border-2 border-amber-400 shadow-xs flex flex-col justify-between gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{item.ikon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-400 text-amber-950 font-black text-[9px]">
                      🏅 #{idx + 1} ({item.persen}%)
                    </span>
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 leading-tight">
                      {item.nama}
                    </div>
                    <div className="text-[10px] font-bold text-rose-700">
                      {item.julukan}
                    </div>
                  </div>
                  <div className="text-[9.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 leading-tight">
                    Rekomendasi: {item.rekomendasiLesAtauEkskul[0]}
                  </div>
                </div>
              ))}
            </div>

            {modeJenjang === "anak_tk_sd" && karyaList.length > 0 && (
              <div className="lg:col-span-5 print:col-span-5 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-300 flex flex-col justify-between">
                <div className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1 mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-600" /> Portofolio Karya Lukisan Tangan ({karyaList.length} Karya):
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {karyaList.slice(0, 4).map(([idMisi, dataUrl]) => {
                    const infoMisi = DAFTAR_8_MISI_KANVAS.find(
                      (m) => m.id === idMisi
                    );
                    return (
                      <div
                        key={idMisi}
                        className="bg-white p-1 rounded-xl border border-amber-300 text-center"
                      >
                        <img
                          src={dataUrl}
                          alt={infoMisi?.judul || idMisi}
                          className="w-full h-14 print:h-12 object-contain rounded bg-white"
                        />
                        <div className="text-[8px] font-black text-slate-700 truncate mt-0.5">
                          {infoMisi?.judul || idMisi}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Tanda Tangan Sertifikat Landscape */}
          <div className="pt-2 border-t border-amber-300 flex justify-between items-end gap-4 text-xs">
            <div>
              <div className="font-black text-xs text-slate-800">
                Unit Kerja / Sekolah: {instansiPeserta}
              </div>
              <div className="text-[9.5px] text-slate-500">
                Sertifikat Resmi Pengembangan Potensi &amp; Karakter • Akun: {emailPeserta}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9.5px] font-bold text-slate-500">
                Disahkan secara digital oleh:
              </div>
              <div className="font-black text-xs sm:text-sm text-emerald-800">
                Panda HibahIlmu Talent &amp; People Development Center
              </div>
              <div className="text-[9.5px] font-mono text-slate-500">
                hibahilmu.my.id • Wakaf &amp; Hibah Ilmu Gratis Indonesia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BLOK 2: LAPORAN ANALISIS LENGKAP (FORMAT A4 PORTRAIT)               */}
      {/* =================================================================== */}
      <div
        className={
          modeCetak === "sertifikat_landscape"
            ? "hidden print:hidden"
            : "bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0"
        }
      >
        <div className="border-b-4 border-emerald-700 pb-5 flex flex-wrap justify-between items-center gap-4 break-inside-avoid">
          <div className="flex items-center gap-4">
            <img
              src="/hibahilmu.jpg"
              alt="Logo Panda HibahIlmu"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
              }}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
            />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                PANDA HIBAHILMU.ID • PEOPLE &amp; TALENT DEVELOPMENT CENTER
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {judulLaporan}
              </h2>
              <div className="text-xs font-bold text-slate-600">
                {subjudulJenjang}
              </div>
            </div>
          </div>

          <div className="text-right bg-rose-50 border-2 border-rose-600 px-4 py-2 rounded-2xl">
            <div className="text-[10px] font-black uppercase text-rose-700 flex items-center justify-end gap-1">
              <Lock className="w-3 h-3" /> DOKUMEN BERSIFAT RAHASIA (CONFIDENTIAL)
            </div>
            <div className="text-sm font-black text-slate-900">
              Peserta: {namaPeserta || "Ananda / Siswa"}
            </div>
            <div className="text-[11px] font-bold text-slate-600">
              {instansiPeserta} • {emailPeserta}
            </div>
          </div>
        </div>

        {infoTambahanAtas}

        {/* Spider Radar & Bar Peringkat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50 p-5 rounded-3xl border break-inside-avoid print:grid-cols-12">
          <div className="lg:col-span-5 print:col-span-5 flex flex-col items-center">
            <div className="text-xs font-black uppercase text-slate-800 mb-2">
              🕸️ Peta Radar Profil Kekuatan ({namaPeserta || "Peserta"})
            </div>
            {renderSpiderRadarSvg(daftarUrut)}
          </div>

          <div className="lg:col-span-7 print:col-span-7 space-y-2.5">
            <div className="text-xs font-black uppercase text-indigo-900">
              📊 Urutan Peringkat Kekuatan dari Tertinggi hingga Terendah:
            </div>
            {daftarUrut.map((d) => (
              <div key={d.id} className="space-y-1">
                <div className="flex justify-between text-xs font-black">
                  <span>
                    #{d.peringkat}. {d.ikon} {d.nama} —{" "}
                    <span className="text-indigo-700">{d.julukan}</span>
                  </span>
                  <span>{d.persen}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{
                      width: `${d.persen}%`,
                      backgroundColor: d.warna,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Kekuatan Utama + Action Plan */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black uppercase text-rose-700 border-b-2 border-rose-600 pb-1.5">
            🌟 1. Kekuatan Utama Paling Menonjol &amp; Langkah Konkret (Harus Ngapain Saja)
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {top3.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-rose-50/60 border-2 border-rose-200 space-y-3 break-inside-avoid"
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="font-black text-base text-rose-950">
                    {item.ikon} Peringkat #{item.peringkat}: {item.nama} (
                    {item.julukan})
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black">
                    Skor Kekuatan: {item.persen}% (Dominan Utama)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.deskripsiKekuatan}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 print:grid-cols-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                    <div className="text-[11px] font-black uppercase text-emerald-800 flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" /> Harus Ngapain Saja?
                      (Action Plan):
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                      {item.harusNgapainSaja.map((langkah, i) => (
                        <li key={i}>{langkah}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                    <div className="text-[11px] font-black uppercase text-indigo-800 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> Perlu Dileskan / Ikut
                      Kegiatan Apa?:
                    </div>
                    <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-1">
                      {item.rekomendasiLesAtauEkskul.map((les, i) => (
                        <li key={i}>{les}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                    <div className="text-[11px] font-black uppercase text-amber-800 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Arah Jurusan &amp;
                      Karier Masa Depan:
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                      {item.potensiMasaDepan.map((kar, i) => (
                        <li key={i}>{kar}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kekuatan Pendukung */}
        <div className="space-y-3 break-inside-avoid">
          <h3 className="text-base font-black uppercase text-amber-700 border-b-2 border-amber-500 pb-1.5">
            ⚡ 2. Kekuatan Pendukung (Supporting Potentials)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3">
            {kekuatanPendukung.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-1.5 break-inside-avoid"
              >
                <div className="font-black text-xs sm:text-sm text-amber-950">
                  #{item.peringkat}. {item.ikon} {item.nama} ({item.persen}%)
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  {item.deskripsiKekuatan}
                </p>
                <div className="text-[11px] font-bold text-indigo-900 pt-1">
                  Kegiatan Pendukung: {item.rekomendasiLesAtauEkskul[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analisis Kelemahan & Solusi */}
        <div className="space-y-4 break-inside-avoid">
          <div className="border-b-2 border-slate-800 pb-1.5">
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> 3. Analisis Area
              Lemah (Urutan Terbawah) &amp; Strategi Agar Tidak Menghambat Prestasi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {areaLemah.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-100 border-2 border-slate-300 space-y-2.5 break-inside-avoid"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm text-slate-900">
                    #{item.peringkat}. {item.ikon} {item.nama} ({item.persen}%)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-black">
                    Area Perlu Siasat &amp; Pendampingan
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950">
                  <strong>⚠️ Risiko Jika Dibiarkan:</strong> {item.dampakJikaLemah}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950">
                  <strong>
                    💡 Solusi &amp; Cara Mengatasi Agar Tidak Menghambat:
                  </strong>{" "}
                  {item.solusiAgarTidakMenghambat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};