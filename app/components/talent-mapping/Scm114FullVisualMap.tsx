"use client";

import React, { useState } from "react";
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

// ============================================================================
// KAMUS BAHASA INDONESIA SEHARI-HARI (RAMAH IBU RUMAH TANGGA & ORANG AWAM)
// ============================================================================
const KAMUS_KELOMPOK_PERAN_AWAM: Record<
  string,
  { judulIndo: string; penjelasanAwam: string }
> = {
  HEADMAN: {
    judulIndo: "Memimpin, Mengatur & Mengajak Orang (Headman)",
    penjelasanAwam:
      "Bakat mengatur acara keluarga/warga, mendamaikan orang, memimpin kegiatan, atau berdagang.",
  },
  NETWORKING: {
    judulIndo: "Bergaul, Mengajar & Menyemangati (Networking)",
    penjelasanAwam:
      "Bakat mudah akrab dengan tetangga/teman, sabar mengajari anak, dan pintar ngobrol.",
  },
  SERVICING: {
    judulIndo: "Melayani, Merawat & Menolong Sesama (Servicing)",
    penjelasanAwam:
      "Bakat merawat keluarga, mengurus rumah dengan penuh kasih sayang, dan tulus menolong orang.",
  },
  "GENERATING IDEA": {
    judulIndo: "Mencari Ide Kreatif & Cara Baru (Generating Idea)",
    penjelasanAwam:
      "Bakat punya banyak akal kreatif untuk memasak, menghias rumah, membuat kerajinan, atau usaha.",
  },
  THINKING: {
    judulIndo: "Menghitung Uang, Merencanakan & Meneliti (Thinking)",
    penjelasanAwam:
      "Bakat mengatur uang belanja/tabungan dengan hemat, berpikir matang, dan memperbaiki masalah.",
  },
  ELEMENTARY: {
    judulIndo: "Mencatat Rapi, Menulis & Bercerita (Elementary)",
    penjelasanAwam:
      "Bakat merapikan catatan, mengurus surat/dokumen, dan menyampaikan pesan dengan jelas.",
  },
  TECHNICAL: {
    judulIndo: "Keterampilan Tangan, Memeriksa Mutu & Menjaga Barang (Technical)",
    penjelasanAwam:
      "Bakat cekatan bekerja dengan tangan, teliti memeriksa kerapian, dan menjaga barang tetap awet.",
  },
};

const CONTOH_KEHIDUPAN_PERAN_AWAM: Record<string, string> = {
  arranger:
    "Pintar membagi tugas di rumah/arisan/kepanitiaan dan menata perabot atau jadwal harian supaya semuanya beres.",
  commander:
    "Berani mengambil keputusan saat keadaan darurat dan tegas mengarahkan anak atau anggota kelompok.",
  mediator:
    "Sangat bijak mendamaikan anggota keluarga, anak, atau tetangga yang sedang salah paham agar rukun kembali.",
  selector:
    "Punya firasat tajam memilih orang yang tepat untuk diajak kerja sama atau diberi tugas tertentu.",
  seller:
    "Pintar menawarkan barang dagangan/masakan/jasa dengan ramah sehingga orang senang membeli.",
  ambasador:
    "Murah senyum, pandai membawa diri, dan mudah mewakili keluarga atau kelompok di acara masyarakat.",
  communicator:
    "Kalau menjelaskan sesuatu sangat enak didengar, jelas, dan membuat suasana ngobrol jadi hidup.",
  educator:
    "Sabar sekali saat mengajari anak belajar di rumah atau membimbing orang lain sampai benar-benar bisa.",
  motivator:
    "Kehadirannya selalu membawa semangat, menghibur yang sedang sedih, dan membuat orang lain kembali optimis.",
  caretaker:
    "Penuh kasih sayang dan telaten dalam merawat anak, lansia, orang sakit, maupun menjaga kenyamanan keluarga.",
  server:
    "Senang hati melayani kebutuhan keluarga/tamu dan sigap turun tangan membantu tanpa pamrih.",
  creator:
    "Sering menemukan ide-ide baru untuk resep masakan, hiasan rumah, kerajinan, atau peluang usaha rumahan.",
  designer:
    "Punya selera keindahan yang bagus dalam memadukan warna pakaian, menata ruangan, atau menghias produk.",
  marketer:
    "Tahu apa yang disukai orang banyak dan pintar mempromosikan kelebihan suatu barang atau kegiatan.",
  strategist:
    "Cepat menemukan jalan keluar paling praktis ketika menghadapi kesulitan biaya atau masalah harian.",
  synthesizer:
    "Bisa menggabungkan berbagai saran yang berbeda menjadi satu kesimpulan yang adil dan masuk akal.",
  visionary:
    "Suka memikirkan rencana masa depan keluarga dan pendidikan anak jauh-jauh hari.",
  analyst:
    "Tidak mudah percaya kabar burung; selalu memeriksa kebenaran dan menghitung untung-rugi dengan cermat.",
  evaluator:
    "Teliti menilai apakah suatu cara kerja, belanjaan, atau rencana sudah bagus atau masih perlu diperbaiki.",
  explorer:
    "Senang mencari tahu informasi baru, tips kesehatan/keluarga, atau mencoba resep dan ilmu baru.",
  restorer:
    "Jago mencari letak kerusakan barang atau akar masalah di rumah lalu memperbaikinya sampai normal kembali.",
  treasurer:
    "Sangat pintar mengatur uang belanja bulanan, mencatat pengeluaran, dan disiplin menabung untuk masa depan.",
  administrator:
    "Rapi menyimpan surat-surat penting (KK, ijazah, buku tabungan) dan tertib mengurus jadwal harian.",
  interpreter:
    "Mudah memahami maksud ucapan orang lain dan menjelaskannya kembali dengan bahasa yang sederhana.",
  journalist:
    "Senang mencatat kejadian penting, menulis cerita/pengalaman, dan membagikan informasi bermanfaat.",
  distributor:
    "Cekatan membagi-bagikan barang, makanan, atau tugas secara adil, cepat, dan tepat sasaran.",
  operator:
    "Terampil menggunakan peralatan rumah tangga, mesin jahit, alat masak, atau perangkat kerja secara rutin.",
  producer:
    "Tidak suka menganggur; paling senang kalau setiap hari ada hasil kerja nyata yang selesai dikerjakan.",
  quality_controller:
    "Sangat teliti memeriksa kebersihan rumah, kerapian pakaian, atau kualitas masakan/barang agar sempurna.",
  safekeeper:
    "Sangat amanah menjaga titipan uang/barang, mengunci rumah, dan memastikan keselamatan keluarga terjaga.",
};

export const Scm114FullVisualMap: React.FC<{
  hasil: HasilLengkapTalentMapping;
}> = ({ hasil }) => {
  const [tampilkanKamus114, setTampilkanKamus114] = useState<boolean>(true);
  const top5Ids = new Set(hasil.top5PersonalBranding.map((r) => r.id));
  const ml = hasil.analyticsML;

  const klasterMeta: {
    kode: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
    nama: string;
    artiAwam: string;
    warnaBadge: string;
    warnaBorder: string;
    ikon: string;
  }[] = [
    {
      kode: "N",
      nama: "Networking (Bergaul & Mengajar)",
      artiAwam: "Pintar ngobrol, mencari teman, dan sabar mengajari orang lain.",
      warnaBadge: "bg-sky-600 text-white",
      warnaBorder: "border-sky-500",
      ikon: "🤝",
    },
    {
      kode: "H",
      nama: "Headman (Memimpin & Mengatur)",
      artiAwam: "Berani mengatur acara, memimpin keluarga/warga, dan berdagang.",
      warnaBadge: "bg-blue-800 text-white",
      warnaBorder: "border-blue-700",
      ikon: "👑",
    },
    {
      kode: "S",
      nama: "Serving (Melayani & Merawat)",
      artiAwam: "Telaten merawat anak/keluarga, merapikan rumah, dan suka menolong.",
      warnaBadge: "bg-indigo-700 text-white",
      warnaBorder: "border-indigo-600",
      ikon: "🤲",
    },
    {
      kode: "Gi",
      nama: "Generating Idea (Kreatif & Banyak Akal)",
      artiAwam: "Punya banyak ide masakan, hiasan rumah, kerajinan, atau usaha baru.",
      warnaBadge: "bg-purple-700 text-white",
      warnaBorder: "border-purple-600",
      ikon: "💡",
    },
    {
      kode: "Te",
      nama: "Technical (Terampil Tangan & Menjaga Mutu)",
      artiAwam: "Cekatan bekerja fisik, teliti memeriksa barang, dan menjaga keamanan.",
      warnaBadge: "bg-rose-700 text-white",
      warnaBorder: "border-rose-600",
      ikon: "⚙️",
    },
    {
      kode: "E",
      nama: "Elementary (Mencatat Rapi & Administrasi)",
      artiAwam: "Tertib menyimpan surat penting, mengetik/menulis rapi, dan taat aturan.",
      warnaBadge: "bg-orange-600 text-white",
      warnaBorder: "border-orange-500",
      ikon: "📝",
    },
    {
      kode: "R",
      nama: "Reasoning (Mencari Solusi & Memperbaiki)",
      artiAwam: "Pintar mencari penyebab masalah atau kerusakan lalu memperbaikinya.",
      warnaBadge: "bg-amber-500 text-slate-950",
      warnaBorder: "border-amber-500",
      ikon: "🔍",
    },
    {
      kode: "T",
      nama: "Thinking (Mengatur Uang & Berhitung)",
      artiAwam: "Hemat mengatur uang belanja, pandai menabung, dan berpikir matang.",
      warnaBadge: "bg-emerald-600 text-white",
      warnaBorder: "border-emerald-500",
      ikon: "📊",
    },
  ];

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
      {/* 1. DASHBOARD AI / MACHINE LEARNING + PENJELASAN AWAM 3 KUADRAN      */}
      {/* =================================================================== */}
      {ml && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-amber-400/50 shadow-xl space-y-6 print:bg-slate-50 print:text-slate-900 print:border-slate-300 break-inside-avoid">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-700 print:border-slate-300 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                🧠 Ringkasan Kepribadian &amp; Kekuatan Alami (Mudah Dipahami)
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
                  Tingkat Kejujuran &amp; Konsistensi Jawaban
                </div>
                <div className="text-sm font-black text-emerald-400 print:text-emerald-700">
                  {ml.skorValiditasKonsistensi}% ({ml.labelValiditas})
                </div>
              </div>
            </div>
          </div>

          {/* Grid Radar Chart SVG 8 Klaster + Gaya Belajar & Partner Ideal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center print:grid-cols-12">
            <div className="lg:col-span-5 print:col-span-5 bg-slate-950/90 print:bg-white p-4 rounded-3xl border border-slate-800 print:border-slate-300 flex flex-col items-center">
              <div className="text-[11px] font-black uppercase text-amber-300 print:text-slate-800 mb-1 text-center">
                🕸️ Peta Jaring Bakat Alami vs Kesukaan
              </div>
              <svg viewBox="0 0 280 280" className="w-60 h-60 overflow-visible">
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

                <polygon
                  points={hitungTitikPolygon("rataPSS")}
                  fill="rgba(250, 204, 21, 0.22)"
                  stroke="#facc15"
                  strokeWidth="2"
                />

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
                  Bakat Bawaan (PSP)
                </span>
                <span className="flex items-center gap-1 text-amber-300 print:text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Kegiatan Disukai (PSS)
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 print:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300">
                <div className="font-black text-amber-400 print:text-amber-800 uppercase text-[10px]">
                  ✨ Semboyan &amp; Kekuatan Dirimu:
                </div>
                <p className="text-sm font-black italic text-white print:text-slate-900 mt-0.5">
                  {ml.archetypePersona.motoHidup}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                <div className="font-black text-emerald-400 print:text-emerald-800 uppercase text-[10px]">
                  📚 Cara Belajar &amp; Bekerja Sehari-hari Paling Cocok Buatmu:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-200 print:text-slate-700">
                  {ml.archetypePersona.gayaBelajarEfektif.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 print:bg-white border border-slate-800 print:border-slate-300 space-y-1">
                <div className="font-black text-sky-400 print:text-sky-800 uppercase text-[10px]">
                  🤝 Pasangan / Rekan Kerja Paling Cocok (Agar Saling Melengkapi):
                </div>
                <p className="text-slate-200 print:text-slate-700 leading-relaxed">
                  {ml.archetypePersona.partnerKolaborasiIdeal}
                </p>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* MATRIKS 3 KUADRAN DENGAN ARTI BAHASA INDONESIA SEHARI-HARI!      */}
          {/* =============================================================== */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-black uppercase text-amber-300 print:text-slate-900">
              📖 Penjelasan Detail Kegiatanmu (Sudah Diterjemahkan ke Bahasa Sehari-hari):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              {/* KUADRAN 1: SWEET SPOT */}
              <div className="p-4 rounded-2xl bg-rose-950/60 print:bg-rose-50 border-2 border-rose-500/60 space-y-2.5 break-inside-avoid">
                <div>
                  <div className="font-black text-xs sm:text-sm text-rose-300 print:text-rose-900">
                    🌟 1. Bakat Utama &amp; Sangat Disukai (Sweet Spot)
                  </div>
                  <p className="text-[11px] text-slate-200 print:text-slate-700 mt-0.5 leading-snug">
                    <strong>Artinya:</strong> Ini adalah kegiatan emasmu! Kamu punya bakat alami yang hebat di sini DAN kamu juga senang melakukannya sehari-hari:
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {ml.kuadranAktivitas.sweetSpots.map((a) => (
                    <div
                      key={a.no}
                      className="p-2.5 rounded-xl bg-slate-950/85 print:bg-white border border-rose-500/40 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">
                          {a.kodeAktivitas}
                        </span>
                        <span className="text-[9.5px] font-bold text-rose-300 print:text-rose-700">
                          Sangat Cocok ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-white print:text-slate-800 font-semibold leading-snug pt-0.5">
                        <strong>Artinya:</strong> {a.deskripsiSingkat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KUADRAN 2: HIDDEN GEM */}
              <div className="p-4 rounded-2xl bg-amber-950/50 print:bg-amber-50 border-2 border-amber-400/60 space-y-2.5 break-inside-avoid">
                <div>
                  <div className="font-black text-xs sm:text-sm text-amber-300 print:text-amber-900">
                    💎 2. Bakat Terpendam (Hidden Gem)
                  </div>
                  <p className="text-[11px] text-slate-200 print:text-slate-700 mt-0.5 leading-snug">
                    <strong>Artinya:</strong> Sebenarnya kamu punya bakat alami yang bagus di kegiatan ini, tapi mungkin selama ini kamu belum menyadarinya atau belum percaya diri mencobanya:
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {ml.kuadranAktivitas.hiddenGems.length > 0 ? (
                    ml.kuadranAktivitas.hiddenGems.map((a) => (
                      <div
                        key={a.no}
                        className="p-2.5 rounded-xl bg-slate-950/85 print:bg-white border border-amber-400/50 space-y-0.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                            {a.kodeAktivitas}
                          </span>
                          <span className="text-[9.5px] font-bold text-amber-300 print:text-amber-800">
                            Coba Latih!
                          </span>
                        </div>
                        <p className="text-[11px] text-white print:text-slate-800 font-semibold leading-snug pt-0.5">
                          <strong>Artinya:</strong> {a.deskripsiSingkat}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950/70 print:bg-white text-[11px] text-emerald-300 print:text-emerald-800 font-bold">
                      ✓ Hebat! Semua bakat alami terkuatmu sudah kamu sadari dan kamu sukai.
                    </div>
                  )}
                </div>
              </div>

              {/* KUADRAN 3: ASPIRATIONAL HOBBY */}
              <div className="p-4 rounded-2xl bg-sky-950/50 print:bg-sky-50 border-2 border-sky-400/60 space-y-2.5 break-inside-avoid">
                <div>
                  <div className="font-black text-xs sm:text-sm text-sky-300 print:text-sky-900">
                    🚀 3. Hobi yang Disukai (Butuh Latihan Rutin)
                  </div>
                  <p className="text-[11px] text-slate-200 print:text-slate-700 mt-0.5 leading-snug">
                    <strong>Artinya:</strong> Kamu sangat menyukai kegiatan ini, namun karena bukan bakat bawaan utama, kamu perlu sedikit lebih rajin belajar/berlatih agar hasilnya bagus:
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {ml.kuadranAktivitas.aspirational.length > 0 ? (
                    ml.kuadranAktivitas.aspirational.map((a) => (
                      <div
                        key={a.no}
                        className="p-2.5 rounded-xl bg-slate-950/85 print:bg-white border border-sky-400/50 space-y-0.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-[10px] font-black">
                            {a.kodeAktivitas}
                          </span>
                          <span className="text-[9.5px] font-bold text-sky-300 print:text-sky-800">
                            Perlu Latihan
                          </span>
                        </div>
                        <p className="text-[11px] text-white print:text-slate-800 font-semibold leading-snug pt-0.5">
                          <strong>Artinya:</strong> {a.deskripsiSingkat}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950/70 print:bg-white text-[11px] text-sky-300 print:text-sky-800 font-bold">
                      ✓ Minat harianmu sudah fokus penuh pada bakat utamamu!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. REKOMENDASI BIDANG USAHA, KEGIATAN, STUDI & KARIER               */}
      {/* =================================================================== */}
      {ml && (
        <div className="p-5 rounded-3xl bg-white border-2 border-emerald-500/40 space-y-4 break-inside-avoid">
          <div className="border-b pb-2 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Peta Arah Kegiatan, Usaha Rumahan/UMKM, Studi &amp; Profesi
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Bidang Kegiatan, Usaha &amp; Pekerjaan Paling Cocok untuk{" "}
                {hasil.namaPeserta}
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
                    {rek.skorMatch}% Cocok
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {rek.alasanKecocokan}
                </p>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-indigo-800">
                    🎓 Bidang Ilmu / Pelatihan yang Cocok:
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
                    💼 Peran Kerja / Usaha / Kegiatan:
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
      {/* 3. 4 KUNCI SUKSES SEHARI-HARI (RUMUS T-A-S-K BAHASA AWAM)           */}
      {/* =================================================================== */}
      <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 break-inside-avoid">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Panduan Praktis untuk Semua Kalangan (Pelajar, Ibu Rumah Tangga &amp; Umum)
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              4 Kunci Agar Bakatmu Bermanfaat di Rumah, Usaha &amp; Pekerjaan
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
              ● Abu: Kurang Dominan (22–27)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-white">
              ● Hitam: Minta Bantuan Orang Lain (28–34)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              huruf: "T",
              judul: "Bakat Bawaan (Talents)",
              warna: "bg-rose-600",
              ket: "Sifat asli dari lahir yang membuatmu cepat bisa dan senang saat melakukan suatu kegiatan (misal: telaten merawat anak, pintar memasak, atau rapi menata rumah).",
            },
            {
              huruf: "A",
              judul: "Sikap Hati yang Baik (Attitude)",
              warna: "bg-amber-500",
              ket: "Sifat jujur, sabar, ramah kepada keluarga/tetangga, dan tidak mudah mengeluh saat menghadapi tugas sehari-hari.",
            },
            {
              huruf: "S",
              judul: "Kebiasaan & Latihan Tangan (Skill)",
              warna: "bg-emerald-600",
              ket: "Kemampuan praktik karena sering dicoba berulang-ulang, seperti terampil memasak, menjahit, berjualan, atau memakai alat.",
            },
            {
              huruf: "K",
              judul: "Ilmu & Pengalaman (Knowledge)",
              warna: "bg-indigo-600",
              ket: "Wawasan yang kamu dapat dari pengalaman hidup, bertanya pada orang yang lebih tahu, membaca, atau menonton tutorial bermanfaat.",
            },
          ].map((el) => (
            <div
              key={el.huruf}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs break-inside-avoid"
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
      {/* 4. PETA 30 PERAN UNGGULAN + TERJEMAHAN & CONTOH KEHIDUPAN AWAM!     */}
      {/* =================================================================== */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-5 break-inside-avoid">
        <div className="border-b pb-3 space-y-1">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-100 text-rose-900">
            Sudah Diterjemahkan ke Bahasa Indonesia Sehari-hari
          </span>
          <h3 className="text-base sm:text-lg font-black uppercase text-slate-900">
            Peta 30 Peran Unggulan (Personal Branding) — {hasil.namaPeserta}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap kotak di bawah menampilkan <strong>Nama Peran Bahasa Inggris</strong> sekaligus <strong>Arti Bahasa Indonesianya</strong>. Kotak yang berwarna{" "}
            <strong className="text-rose-600">★ Merah Menyala</strong> adalah{" "}
            <strong>5 Peran Terbaik yang Paling Cocok</strong> untuk dijalankan oleh{" "}
            <strong>{hasil.namaPeserta}</strong> di keluarga, masyarakat, maupun pekerjaan:
          </p>
        </div>

        {/* PENJELASAN KHUSUS 5 PERAN MERAH MENYALA (DENGAN CONTOH IBU RUMAH TANGGA & AWAM) */}
        <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-300 space-y-3">
          <div className="font-black text-xs sm:text-sm text-rose-950 uppercase">
            🌟 Penjelasan Lengkap 5 Peran Terbaik (★ Merah Menyala) Milik {hasil.namaPeserta}:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3">
            {hasil.top5PersonalBranding.map((peran, idx) => (
              <div
                key={peran.id}
                className="p-3.5 rounded-2xl bg-white border-2 border-rose-500 shadow-xs space-y-1.5 break-inside-avoid"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs">
                    ★ #{idx + 1}. {peran.nama}
                  </span>
                  <span className="text-[10px] font-black text-emerald-700">
                    {peran.skorKecocokan}% Cocok
                  </span>
                </div>
                <div className="font-black text-xs text-slate-900">
                  Arti Bahasa Indonesia: &ldquo;{peran.julukan}&rdquo;
                </div>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {peran.deskripsi}
                </p>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10.5px] text-amber-950 leading-snug">
                  <strong>💡 Contoh di Rumah / Sehari-hari:</strong>{" "}
                  {CONTOH_KEHIDUPAN_PERAN_AWAM[peran.id] || peran.deskripsi}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MATRIKS 7 KELOMPOK (30 PERAN LENGKAP DENGAN TERJEMAHAN BAHASA INDONESIA DI TIAP LENCANA!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 print:grid-cols-2">
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
            const infoKelompok = KAMUS_KELOMPOK_PERAN_AWAM[kat];
            return (
              <div
                key={kat}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 break-inside-avoid"
              >
                <div className="p-2.5 rounded-xl bg-slate-900 text-white space-y-0.5">
                  <div className="text-[11px] font-black text-amber-300 uppercase">
                    {infoKelompok?.judulIndo || kat}
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {infoKelompok?.penjelasanAwam}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {listPeran.map((r) => {
                    const isTop5 = top5Ids.has(r.id);
                    return (
                      <div
                        key={r.id}
                        className={`p-2 rounded-xl border text-left transition ${
                          isTop5
                            ? "bg-rose-600 text-white border-amber-300 shadow-sm"
                            : "bg-white text-slate-800 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-1">
                          <span className="font-black text-[11px]">
                            {isTop5 ? `★ ${r.nama}` : r.nama}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              isTop5 ? "text-amber-200" : "text-indigo-700"
                            }`}
                          >
                            = {r.julukan}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] leading-tight mt-0.5 ${
                            isTop5 ? "text-rose-100" : "text-slate-500"
                          }`}
                        >
                          {CONTOH_KEHIDUPAN_PERAN_AWAM[r.id] || r.deskripsi}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. PETA LENGKAP 114 AKTIVITAS SCM + TERJEMAHAN BAHASA INDONESIA     */}
      {/* =================================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/40 space-y-5 print:bg-white print:text-slate-900 print:border-slate-300 print:break-before-page">
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 print:border-slate-300 pb-3 break-inside-avoid">
          <div className="space-y-1 max-w-3xl">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
              Peta Lengkap 114 Kegiatan Sehari-hari • Dilengkapi Arti Bahasa Indonesia
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white print:text-slate-900">
              Peta Potensi Bakat [P] &amp; Minat Kesukaan [S] — {hasil.namaPeserta}
            </h3>
            <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed">
              <strong>Cara Membaca yang Mudah:</strong> Setiap kegiatan memiliki 2 kotak huruf di kanannya:{" "}
              <strong>Kotak [P] = Potensi Bakat Alami dari Lahir</strong> dan{" "}
              <strong>Kotak [S] = Rasa Suka / Minatmu Saat Ini</strong>. Jika kotaknya berwarna{" "}
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                Merah
              </span>{" "}
              atau{" "}
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                Kuning
              </span>
              , berarti kamu sangat cocok melakukan kegiatan tersebut!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTampilkanKamus114(!tampilkanKamus114)}
            className="print:hidden px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
          >
            {tampilkanKamus114
              ? "Sembunyikan Arti Indonesia"
              : "Tampilkan Arti Indonesia"}
          </button>
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
                  {km.nama}
                </div>
                <div className="text-[9px] text-slate-400 print:text-slate-600 leading-tight">
                  {km.artiAwam}
                </div>
                <div className="text-[9.5px] text-emerald-400 print:text-emerald-700 font-black pt-0.5">
                  {jmlMerahKuning}/{itemKlaster.length} Kegiatan Kuat
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL LENGKAP 114 AKTIVITAS PER KLASTER BESERTA ARTI BAHASA INDONESIANYA */}
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
                  className={`${km.warnaBadge} px-3 py-2 text-[11px] font-black flex justify-between items-center`}
                >
                  <span>
                    {km.ikon} [{km.kode}] {km.nama}
                  </span>
                  <span className="text-[9px] opacity-90">Bakat | Minat</span>
                </div>

                <div className="p-2 space-y-1.5 flex-1">
                  {listAkt.map((akt: ScmActivityEvaluation) => (
                    <div
                      key={akt.no}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-200 flex flex-col gap-0.5"
                    >
                      <div className="flex justify-between items-center gap-1.5 text-[10.5px]">
                        <div className="truncate">
                          <span className="font-mono text-[9px] text-amber-400 print:text-slate-500 mr-1">
                            #{akt.no}
                          </span>
                          <span className="font-black text-white print:text-slate-900">
                            {akt.kodeAktivitas}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            title={`Potensi Bakat Alami (PSP): ${akt.warnaPSP}`}
                            className={`w-5 h-4 rounded text-[8.5px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                              akt.warnaPSP
                            )}`}
                          >
                            P
                          </span>
                          <span
                            title={`Minat Kesukaan (PSS): ${akt.warnaPSS}`}
                            className={`w-5 h-4 rounded text-[8.5px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                              akt.warnaPSS
                            )}`}
                          >
                            S
                          </span>
                        </div>
                      </div>

                      {tampilkanKamus114 && (
                        <div className="text-[9.5px] text-slate-300 print:text-slate-600 leading-tight pl-3 border-l-2 border-slate-700 print:border-slate-300">
                          Arti: {akt.deskripsiSingkat}
                        </div>
                      )}
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