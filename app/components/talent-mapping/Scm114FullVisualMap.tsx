"use client";

import React from "react";
import {
  HasilLengkapTalentMapping,
  ScmActivityEvaluation,
} from "./talentMappingEngine";
import { DAFTAR_30_PERSONAL_BRANDING } from "./talentMappingDatabase";

function kelasWarnaPetak(
  warna: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam"
): string {
  switch (warna) {
    case "Merah":
      return "bg-rose-600 text-white border-rose-800";
    case "Kuning":
      return "bg-amber-400 text-slate-950 border-amber-600";
    case "Putih":
      return "bg-white text-slate-900 border-slate-400";
    case "Abu":
      return "bg-slate-400 text-white border-slate-600";
    case "Hitam":
      return "bg-slate-900 text-white border-slate-950";
  }
}

export const Scm114FullVisualMap: React.FC<{
  hasil: HasilLengkapTalentMapping;
}> = ({ hasil }) => {
  const top5Ids = new Set(hasil.top5PersonalBranding.map((r) => r.id));
  const ml = hasil.analyticsML;

  const klasterMeta: {
    kode: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
    nama: string;
    warnaBadge: string;
    warnaBorder: string;
    ikon: string;
  }[] = [
    {
      kode: "N",
      nama: "Networking (Jejaring & Edukasi)",
      warnaBadge: "bg-sky-600 text-white",
      warnaBorder: "border-sky-500",
      ikon: "🤝",
    },
    {
      kode: "H",
      nama: "Headman (Kepemimpinan & Negosiasi)",
      warnaBadge: "bg-blue-800 text-white",
      warnaBorder: "border-blue-700",
      ikon: "👑",
    },
    {
      kode: "S",
      nama: "Serving (Pelayanan & Empati)",
      warnaBadge: "bg-indigo-700 text-white",
      warnaBorder: "border-indigo-600",
      ikon: "🤲",
    },
    {
      kode: "Gi",
      nama: "Generating Idea (Inovasi, Kreasi & Strategi)",
      warnaBadge: "bg-purple-700 text-white",
      warnaBorder: "border-purple-600",
      ikon: "💡",
    },
    {
      kode: "Te",
      nama: "Technical (Teknis, Operasional & Produksi)",
      warnaBadge: "bg-rose-700 text-white",
      warnaBorder: "border-rose-600",
      ikon: "⚙️",
    },
    {
      kode: "E",
      nama: "Elementary (Tata Kelola, Bahasa & Administrasi)",
      warnaBadge: "bg-orange-600 text-white",
      warnaBorder: "border-orange-500",
      ikon: "📝",
    },
    {
      kode: "R",
      nama: "Reasoning (Riset, Diagnosa & Penalaran)",
      warnaBadge: "bg-amber-500 text-slate-950",
      warnaBorder: "border-amber-500",
      ikon: "🔍",
    },
    {
      kode: "T",
      nama: "Thinking (Analisis, Keuangan & Evaluasi)",
      warnaBadge: "bg-emerald-600 text-white",
      warnaBorder: "border-emerald-500",
      ikon: "📊",
    },
  ];

  // Geometri SVG Radar Chart 8 Sumbu (N, H, S, Gi, Te, E, R, T)
  const radarData = ml?.radar8Klaster || [];
  const cx = 140;
  const cy = 140;
  const maxR = 92;

  const hitungTitikPolygon = (key: "rataPSP" | "rataPSS") => {
    if (radarData.length === 0) return "";
    return radarData
      .map((item, idx) => {
        const angle = (Math.PI * 2 * idx) / radarData.length - Math.PI / 2;
        const r = (Math.max(15, item[key]) / 100) * maxR;
        const x = (cx + r * Math.cos(angle)).toFixed(1);
        const y = (cy + r * Math.sin(angle)).toFixed(1);
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* =================================================================== */}
      {/* 1. DASHBOARD AI / MACHINE LEARNING: PERSONA, RADAR CHART & VALIDITAS */}
      {/* =================================================================== */}
      {ml && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-amber-400/50 shadow-xl space-y-6 print:bg-slate-50 print:text-slate-900 print:border-slate-300 break-inside-avoid">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-700 print:border-slate-300 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                🧠 Psychometric Machine Learning Analytics (Z-Score Normalized)
              </span>
              <h3 className="text-xl font-black text-white print:text-slate-900 mt-1">
                {ml.archetypePersona.judul}
              </h3>
              <p className="text-xs text-amber-300 print:text-indigo-800 font-bold">
                {ml.archetypePersona.subjudul}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-950 print:bg-white border border-emerald-500/50 text-right">
                <div className="text-[9px] font-black uppercase text-slate-400 print:text-slate-500">
                  Skor Validitas &amp; Konsistensi
                </div>
                <div className="text-sm font-black text-emerald-400 print:text-emerald-700">
                  {ml.skorValiditasKonsistensi}% ({ml.labelValiditas})
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-slate-950 print:bg-white border border-sky-500/50 text-right">
                <div className="text-[9px] font-black uppercase text-slate-400 print:text-slate-500">
                  Ketajaman Profil
                </div>
                <div className="text-sm font-black text-sky-400 print:text-sky-700">
                  {ml.indeksDiferensiasi}% Distinct
                </div>
              </div>
            </div>
          </div>

          {/* Grid Radar Chart SVG 8 Klaster + Gaya Belajar & Partner Ideal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center print:grid-cols-12">
            {/* Radar / Spider Chart 8 Klaster SCM */}
            <div className="lg:col-span-5 print:col-span-5 bg-slate-950/90 print:bg-white p-4 rounded-3xl border border-slate-800 print:border-slate-300 flex flex-col items-center">
              <div className="text-[11px] font-black uppercase text-amber-300 print:text-slate-800 mb-1">
                🕸️ Spider Radar 8 Klaster (PSP vs PSS)
              </div>
              <svg viewBox="0 0 280 280" className="w-60 h-60 overflow-visible">
                {/* Jaring Lingkaran Konsentris */}
                {[0.25, 0.5, 0.75, 1].map((step, sIdx) => (
                  <circle
                    key={sIdx}
                    cx={cx}
                    cy={cy}
                    r={maxR * step}
                    fill="none"
                    stroke="#334155"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                ))}

                {/* Garis Sumbu 8 Arah & Label Klaster */}
                {radarData.map((item, idx) => {
                  const angle =
                    (Math.PI * 2 * idx) / radarData.length - Math.PI / 2;
                  const x2 = cx + maxR * Math.cos(angle);
                  const y2 = cy + maxR * Math.sin(angle);
                  const lx = cx + (maxR + 24) * Math.cos(angle);
                  const ly = cy + (maxR + 20) * Math.sin(angle);
                  return (
                    <g key={item.kode}>
                      <line
                        x1={cx}
                        y1={cy}
                        x2={x2}
                        y2={y2}
                        stroke="#475569"
                        strokeWidth="1"
                      />
                      <text
                        x={lx}
                        y={ly}
                        fill="#38bdf8"
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {item.kode} ({item.skorGabungan}%)
                      </text>
                    </g>
                  );
                })}

                {/* Kurva Poligon PSS (Minat Sesi 2 - Kuning Emas) */}
                <polygon
                  points={hitungTitikPolygon("rataPSS")}
                  fill="rgba(250, 204, 21, 0.22)"
                  stroke="#facc15"
                  strokeWidth="2"
                />

                {/* Kurva Poligon PSP (Potensi Bakat Sesi 1 - Merah Rose) */}
                <polygon
                  points={hitungTitikPolygon("rataPSP")}
                  fill="rgba(244, 63, 94, 0.32)"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
              </svg>

              <div className="flex items-center gap-4 text-[10px] font-black mt-1">
                <span className="flex items-center gap-1 text-rose-400 print:text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Bakat Alami (PSP)
                </span>
                <span className="flex items-center gap-1 text-amber-300 print:text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Minat Aktivitas (PSS)
                </span>
              </div>
            </div>

            {/* Detail Persona, Gaya Belajar & Partner Kolaborasi */}
            <div className="lg:col-span-7 print:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300">
                <div className="font-black text-amber-400 print:text-amber-800 uppercase text-[10px]">
                  ✨ Moto &amp; Jati Diri Produktif:
                </div>
                <p className="text-sm font-black italic text-white print:text-slate-900 mt-0.5">
                  {ml.archetypePersona.motoHidup}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                <div className="font-black text-emerald-400 print:text-emerald-800 uppercase text-[10px]">
                  📚 Cara Belajar &amp; Berkarya Paling Ampuh Buatmu:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-200 print:text-slate-700">
                  {ml.archetypePersona.gayaBelajarEfektif.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300 space-y-1">
                <div className="font-black text-sky-400 print:text-sky-800 uppercase text-[10px]">
                  🤝 Partner Kolaborasi Tim Paling Cocok (Saling Melengkapi):
                </div>
                <p className="text-slate-200 print:text-slate-700 leading-relaxed">
                  {ml.archetypePersona.partnerKolaborasiIdeal}
                </p>
              </div>
            </div>
          </div>

          {/* Matriks 3 Kuadran Keselarasan Bakat vs Minat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-rose-950/50 print:bg-rose-50 border border-rose-500/40 space-y-1.5 break-inside-avoid">
              <div className="font-black text-xs text-rose-300 print:text-rose-900">
                🌟 Sweet Spot (Bakat Kuat + Sangat Disukai)
              </div>
              <p className="text-[10px] text-slate-300 print:text-slate-600">
                Aktivitas emas di mana bakat alamimu didukung penuh oleh minatmu:
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {ml.kuadranAktivitas.sweetSpots.map((a) => (
                  <span
                    key={a.no}
                    className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-black"
                  >
                    {a.kodeAktivitas}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/40 print:bg-amber-50 border border-amber-500/40 space-y-1.5 break-inside-avoid">
              <div className="font-black text-xs text-amber-300 print:text-amber-900">
                💎 Hidden Gem / Bakat Terpendam (Bakat Kuat + Minat Belum Tinggi)
              </div>
              <p className="text-[10px] text-slate-300 print:text-slate-600">
                Kamu sebenarnya sangat berbakat di sini, cobalah lebih percaya diri:
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {ml.kuadranAktivitas.hiddenGems.length > 0 ? (
                  ml.kuadranAktivitas.hiddenGems.map((a) => (
                    <span
                      key={a.no}
                      className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black"
                    >
                      {a.kodeAktivitas}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-emerald-300 print:text-emerald-700 font-bold">
                    ✓ Semua bakat kuatmu sudah selaras dengan minatmu!
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-950/40 print:bg-sky-50 border border-sky-500/40 space-y-1.5 break-inside-avoid">
              <div className="font-black text-xs text-sky-300 print:text-sky-900">
                🚀 Aspirational Hobby (Minat Tinggi + Butuh Latihan Ekstra)
              </div>
              <p className="text-[10px] text-slate-300 print:text-slate-600">
                Kamu menyukai aktivitas ini; perbanyak latihan Skill agar makin mahir:
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {ml.kuadranAktivitas.aspirational.length > 0 ? (
                  ml.kuadranAktivitas.aspirational.map((a) => (
                    <span
                      key={a.no}
                      className="px-2 py-0.5 rounded-lg bg-sky-500 text-white text-[10px] font-black"
                    >
                      {a.kodeAktivitas}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-sky-300 print:text-sky-700 font-bold">
                    ✓ Minatmu fokus penuh pada area kekuatan utamamu!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. REKOMENDASI JURUSAN SEKOLAH/KULIAH & PROFESI MASA DEPAN          */}
      {/* =================================================================== */}
      {ml && (
        <div className="p-5 rounded-3xl bg-white border-2 border-emerald-500/40 space-y-4 break-inside-avoid">
          <div className="border-b pb-2 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Peta Masa Depan • Jurusan Pendidikan &amp; Profesi Terbaik
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Rekomendasi Jurusan Studi &amp; Karier Masa Depan — {hasil.namaPeserta}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 print:grid-cols-3">
            {ml.rekomendasiJurusanDanKarier.slice(0, 3).map((rek, idx) => (
              <div
                key={rek.bidang}
                className={`p-4 rounded-2xl border-2 space-y-2.5 break-inside-avoid ${
                  idx === 0
                    ? "bg-emerald-50/70 border-emerald-500"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="font-black text-xs sm:text-sm text-slate-900">
                    {rek.ikon} #{idx + 1}. {rek.bidang}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black shrink-0">
                    {rek.skorMatch}% Match
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {rek.alasanKecocokan}
                </p>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-indigo-800">
                    🎓 Jurusan Studi yang Cocok:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rek.jurusanSekolahKuliah.map((jur) => (
                      <span
                        key={jur}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-300 text-[10px] font-bold text-slate-800"
                      >
                        {jur}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-rose-800">
                    💼 Profesi &amp; Karier Masa Depan:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rek.profesiMasaDepan.map((prof) => (
                      <span
                        key={prof}
                        className="px-2 py-0.5 rounded-md bg-rose-100/80 border border-rose-200 text-[10px] font-bold text-rose-950"
                      >
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. 4 PILAR KEUNGGULAN KARIER & BELAJAR (T-A-S-K)                    */}
      {/* =================================================================== */}
      <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 break-inside-avoid">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Panduan Pengembangan Diri Panda HibahIlmu
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              4 Kunci Sukses Belajar &amp; Berkarier (Rumus T-A-S-K)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-black">
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white">
              ● Merah: Sangat Kuat (1–7)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              ● Kuning: Kuat (8–14)
            </span>
            <span className="px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-400">
              ○ Putih: Sedang (15–21)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-400 text-white">
              ● Abu: Rendah (22–27)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-white">
              ● Hitam: Perlu Kolaborasi (28–34)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              huruf: "T",
              judul: "Talents (Bakat Alami)",
              warna: "bg-rose-600",
              ket: "Sifat, cara berpikir, dan kebiasaan positif yang sudah ada secara alami di dalam dirimu.",
            },
            {
              huruf: "A",
              judul: "Attitude (Sikap & Semangat)",
              warna: "bg-amber-500",
              ket: "Sikap antusias, sopan santun, pantang menyerah, dan rasa suka terhadap bidang yang kamu tekuni.",
            },
            {
              huruf: "S",
              judul: "Skill (Keterampilan Praktik)",
              warna: "bg-emerald-600",
              ket: "Kemampuan praktik yang terus kamu latih berulang-ulang sampai tangan dan pikiranmu terampil.",
            },
            {
              huruf: "K",
              judul: "Knowledge (Ilmu & Wawasan)",
              warna: "bg-indigo-600",
              ket: "Pengetahuan, teori pelajaran, informasi, dan wawasan yang kamu pelajari dari buku, guru, atau internet.",
            },
          ].map((el) => (
            <div
              key={el.huruf}
              className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs break-inside-avoid"
            >
              <div
                className={`w-9 h-9 rounded-xl ${el.warna} text-white font-black text-base flex items-center justify-center shrink-0`}
              >
                {el.huruf}
              </div>
              <div>
                <div className="font-black text-xs text-slate-900">
                  {el.judul}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                  {el.ket}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. MATRIKS LENGKAP 30 STRENGTH TYPOLOGY (PERSONAL BRANDING PERAN)   */}
      {/* =================================================================== */}
      <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 space-y-4 break-inside-avoid">
        <div className="border-b pb-2">
          <h3 className="text-base sm:text-lg font-black uppercase text-slate-900">
            Peta 30 Peran Unggulan (Personal Branding) — {hasil.namaPeserta}
          </h3>
          <p className="text-xs text-slate-600">
            Dari 30 jenis peran di bawah ini, lencana berwarna{" "}
            <strong className="text-rose-600">★ Merah Menyala</strong> adalah{" "}
            <strong>5 Peran Paling Cocok</strong> untuk dikembangkan oleh{" "}
            <strong>{hasil.namaPeserta}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "HEADMAN",
            "NETWORKING",
            "SERVICING",
            "GENERATING IDEA",
            "THINKING",
            "ELEMENTARY",
            "TECHNICAL",
          ].map((kat) => {
            const listPeran = DAFTAR_30_PERSONAL_BRANDING.filter(
              (r) => r.kategori === kat
            );
            return (
              <div
                key={kat}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 break-inside-avoid"
              >
                <div className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300">
                  Kelompok: {kat}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {listPeran.map((r) => {
                    const isTop5 = top5Ids.has(r.id);
                    return (
                      <span
                        key={r.id}
                        title={r.julukan}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${
                          isTop5
                            ? "bg-rose-600 text-white border-amber-300 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {isTop5 ? `★ ${r.nama}` : r.nama}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. PETA LENGKAP POTENSI KEKUATAN 114 AKTIVITAS (STRENGTH CLUSTER MAP) */}
      {/* =================================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/40 space-y-5 print:bg-white print:text-slate-900 print:border-slate-300 print:break-before-page">
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 print:border-slate-300 pb-3 break-inside-avoid">
          <div className="space-y-1 max-w-3xl">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
              Peta Lengkap 114 Aktivitas • 8 Wilayah Kekuatan (SCM)
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white print:text-slate-900">
              Peta Lengkap Potensi (P) &amp; Minat Aktivitas (S) — {hasil.namaPeserta}
            </h3>
            <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed">
              Setiap aktivitas memiliki 2 kotak warna:{" "}
              <strong>Kotak [P] = Potensi Bakat Alami (dari Sesi 1)</strong> dan{" "}
              <strong>Kotak [S] = Minat &amp; Kesukaanmu (dari Sesi 2)</strong>.
              Fokuslah pada aktivitas yang memiliki kotak <strong>Merah</strong> atau{" "}
              <strong>Kuning</strong>!
            </p>
          </div>
        </div>

        {/* RINGKASAN 8 WILAYAH KLASTER SCM */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 break-inside-avoid">
          {klasterMeta.map((km) => {
            const itemKlaster = hasil.petaLengkap114SCM.filter(
              (a) => a.klaster === km.kode
            );
            const jmlMerahKuning = itemKlaster.filter(
              (a) => a.warnaPSP === "Merah" || a.warnaPSP === "Kuning"
            ).length;
            return (
              <div
                key={km.kode}
                className={`p-2.5 rounded-2xl bg-slate-950 print:bg-slate-50 border-2 ${km.warnaBorder} flex flex-col items-center text-center gap-1 break-inside-avoid`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${km.warnaBadge} font-black text-xs flex items-center justify-center`}
                >
                  {km.kode}
                </div>
                <div className="font-black text-[10px] text-white print:text-slate-900 leading-tight">
                  {km.nama.split(" (")[0]}
                </div>
                <div className="text-[9px] text-emerald-400 print:text-emerald-700 font-bold">
                  {jmlMerahKuning}/{itemKlaster.length} Kuat
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL LENGKAP 114 AKTIVITAS PER KLASTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-2">
          {klasterMeta.map((km) => {
            const listAkt = hasil.petaLengkap114SCM.filter(
              (a) => a.klaster === km.kode
            );
            return (
              <div
                key={km.kode}
                className={`rounded-2xl bg-slate-950 print:bg-white border ${km.warnaBorder} overflow-hidden flex flex-col break-inside-avoid`}
              >
                <div
                  className={`${km.warnaBadge} px-3 py-1.5 text-[11px] font-black flex justify-between items-center`}
                >
                  <span>
                    {km.ikon} [{km.kode}] {km.nama.split(" (")[0]}
                  </span>
                  <span className="text-[9px] opacity-90">P | S</span>
                </div>

                <div className="p-2 space-y-1 flex-1">
                  {listAkt.map((akt: ScmActivityEvaluation) => (
                    <div
                      key={akt.no}
                      className="px-2 py-1 rounded-lg bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-200 flex justify-between items-center gap-1.5 text-[10px]"
                    >
                      <div className="truncate">
                        <span className="font-mono text-[8.5px] text-slate-400 print:text-slate-500 mr-1">
                          #{akt.no}
                        </span>
                        <span className="font-bold text-slate-100 print:text-slate-900">
                          {akt.kodeAktivitas}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          title={`Potensi Bakat (PSP): ${akt.warnaPSP}`}
                          className={`w-5 h-4 rounded text-[8.5px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                            akt.warnaPSP
                          )}`}
                        >
                          P
                        </span>
                        <span
                          title={`Minat Aktivitas (PSS): ${akt.warnaPSS}`}
                          className={`w-5 h-4 rounded text-[8.5px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                            akt.warnaPSS
                          )}`}
                        >
                          S
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};