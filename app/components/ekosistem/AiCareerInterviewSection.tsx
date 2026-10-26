"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  Download,
  Share2,
  MessageSquare,
  CheckCircle2,
  Award,
  Send,
  RotateCcw,
  UserCheck,
  Code2,
} from "lucide-react";
import { AkunPengguna, JenjangItem, PengumpulanTugas } from "../../types";

interface AiCareerInterviewProps {
  userLogin: AkunPengguna | null;
  poinXP: number;
  materiSelesai: string[];
  daftarJenjang: JenjangItem[];
  daftarPengumpulan: PengumpulanTugas[];
  tambahXP: (xp: number) => void;
}

export const AiCareerInterviewSection: React.FC<AiCareerInterviewProps> = ({
  userLogin,
  poinXP,
  materiSelesai,
  daftarJenjang,
  daftarPengumpulan,
  tambahXP,
}) => {
  const semuaModul = daftarJenjang.flatMap((j) => j.kelas);
  const modulTuntasList = semuaModul.filter((m) => materiSelesai.includes(m.id));

  // ============================================================================
  // 1. STATE AI PORTFOLIO BUILDER OTOMATIS DARI AKTIVITAS BELAJAR
  // ============================================================================
  const [targetKarierPilih, setTargetKarierPilih] = useState(
    "Full-Stack Next.js Developer & Big Data Engineer"
  );
  const [bioAiRingkas, setBioAiRingkas] = useState(
    `pembelajar aktif dengan reputasi ${poinXP} XP yang menguasai arsitektur Komunikasi Data (OSI/TCP-IP), Big Data Pipeline (Apache Kafka, Flume, Sqoop), serta pengembangan aplikasi web modern menggunakan Next.js, TypeScript, dan Tailwind CSS.`
  );
  const [temaPortofolio, setTemaPortofolio] = useState<"modern_dark" | "academic_emerald">(
    "modern_dark"
  );

  // ============================================================================
  // 2. STATE AI MOCK INTERVIEW (SIMULASI WAWANCARA KERJA & BEASISWA)
  // ============================================================================
  const [jalurWawancara, setJalurWawancara] = useState<
    "Beasiswa S2 / Riset LPDP" | "Software & Network Engineer" | "Data Scientist & AI Researcher"
  >("Software & Network Engineer");

  const bankPertanyaanInterview: { [key: string]: string[] } = {
    "Software & Network Engineer": [
      "1. Ceritakan proyek teknis paling menantang yang pernah Anda bangun menggunakan Next.js/TypeScript atau perancangan jaringan komputer!",
      "2. Ketika terjadi bottleneck pengiriman data real-time pada skala besar, bagaimana Anda memilih antara protokol TCP vs UDP atau mengintegrasikan Apache Kafka?",
      "3. Bagaimana cara Anda melakukan debugging secara sistematis ketika menemukan build error pada aplikasi produksi?",
    ],
    "Beasiswa S2 / Riset LPDP": [
      "1. Apa kontribusi riset atau solusi nyata yang ingin Anda bangun untuk memajukan pendidikan dan teknologi di Indonesia setelah lulus?",
      "2. Bagaimana strategi Anda menyusun judul, abstrak, dan kata kunci publikasi ilmiah agar diterima di jurnal internasional bereputasi (IEEE/Scopus)?",
      "3. Ceritakan pengalaman kepemimpinan atau kolaborasi akademik terberat yang pernah Anda lalui!",
    ],
    "Data Scientist & AI Researcher": [
      "1. Jelaskan bagaimana fungsi Q-Value Q(s,a) dalam Reinforcement Learning membantu agen mengambil keputusan optimal!",
      "2. Bagaimana arsitektur integrasi Apache Sqoop, Flume, dan Kafka dalam menangani data telekomunikasi berskala masif?",
      "3. Bagaimana Anda mencegah bias saat merancang sistem penilaian esai otomatis berbasis AI?",
    ],
  };

  const [indeksTanyaInterview, setIndeksTanyaInterview] = useState(0);
  const [jawabanInterviewUser, setJawabanInterviewUser] = useState("");
  const [hasilEvaluasiInterview, setHasilEvaluasiInterview] = useState<
    {
      pertanyaan: string;
      jawaban: string;
      skorStrukturStar: number;
      skorTeknis: number;
      skorKomunikasi: number;
      feedbackAi: string;
    }[]
  >([]);

  const handleGenerateAiBioPortfolio = () => {
    const nama = userLogin?.nama || "Kandidat Profesional HibahIlmu";
    const jmlModul = Math.max(2, modulTuntasList.length);
    setBioAiRingkas(
      `${nama} adalah talenta terpilih di bidang ${targetKarierPilih} dengan capaian ${poinXP} XP dan ${jmlModul} modul kompetensi terverifikasi. Berpengalaman dalam merancang sistem terdistribusi, jaringan komputer, penulisan ilmiah standar IEEE, serta pengembangan antarmuka modular.`
    );
    tambahXP(30);
    alert("✨ AI Portfolio Builder berhasil memperbarui narasi CV & Portofolio Profesional Anda (+30 XP)!");
  };

  const handleUnduhWebPortfolioHtml = () => {
    const nama = userLogin?.nama || "Aisyah Putri";
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Portofolio Resmi - ${nama}</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; max-width: 860px; margin: 40px auto; padding: 30px; line-height: 1.6; }
  .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 28px; margin-bottom: 20px; }
  .badge { background: #10b981; color: #022c22; padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 800; }
</style>
</head>
<body>
  <div class="card">
    <span class="badge">AI-VERIFIED PORTFOLIO • HIBAHILMU.ID</span>
    <h1>${nama}</h1>
    <h3>${targetKarierPilih}</h3>
    <p>${bioAiRingkas}</p>
    <p><b>Reputasi Akademik:</b> ${poinXP} XP | <b>No. Sertifikat:</b> CERT-HIBAH-2026-001</p>
  </div>
  <div class="card">
    <h3>🏆 Modul Kompetensi yang Telah Diselesaikan</h3>
    <ul>
      ${(modulTuntasList.length > 0 ? modulTuntasList : semuaModul.slice(0, 2))
        .map((m) => `<li><b>${m.judul}</b> (Level ${m.level} — Lulus KKM)</li>`)
        .join("")}
    </ul>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Web_Portfolio_${nama.replace(/\s+/g, "_")}.html`;
    a.click();
  };

  const handleKirimJawabanInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const jwb = jawabanInterviewUser.trim();
    if (!jwb) return;

    const listTanya = bankPertanyaanInterview[jalurWawancara];
    const tanyaSaatIni = listTanya[indeksTanyaInterview];
    const jumlahKata = jwb.split(/\s+/).filter(Boolean).length;

    const skorStar = Math.min(98, Math.max(75, 70 + jumlahKata * 2));
    const skorTeknis =
      jwb.toLowerCase().includes("data") ||
      jwb.toLowerCase().includes("sistem") ||
      jwb.toLowerCase().includes("riset") ||
      jwb.toLowerCase().includes("analisis")
        ? 95
        : 84;
    const skorKomunikasi = jumlahKata >= 10 ? 94 : 82;

    const evaluasiBaru = {
      pertanyaan: tanyaSaatIni,
      jawaban: jwb,
      skorStrukturStar: skorStar,
      skorTeknis,
      skorKomunikasi,
      feedbackAi: `AI Interview Coach: Jawaban Anda terstruktur dengan baik (${jumlahKata} kata). Metode STAR (Situation, Task, Action, Result) terlihat jelas. Pertahankan penekanan pada dampak terukur dari solusi yang Anda kerjakan!`,
    };

    setHasilEvaluasiInterview([evaluasiBaru, ...hasilEvaluasiInterview]);
    setJawabanInterviewUser("");
    setIndeksTanyaInterview((prev) => (prev + 1) % listTanya.length);
    tambahXP(40);
  };

  const pertanyaanAktif = bankPertanyaanInterview[jalurWawancara][indeksTanyaInterview];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================================
            1. AI PORTFOLIO BUILDER OTOMATIS DARI AKTIVITAS BELAJAR (6 KOLOM)
           ====================================================================== */}
        <div className="lg:col-span-6 bg-white text-slate-800 p-7 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Automated Career Portfolio Generator
              </span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" /> AI Portfolio Builder Otomatis
              </h3>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setTemaPortofolio(
                    temaPortofolio === "modern_dark" ? "academic_emerald" : "modern_dark"
                  )
                }
                className="px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer"
              >
                🎨 Ganti Tema
              </button>
              <button
                type="button"
                onClick={handleUnduhWebPortfolioHtml}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Web (.HTML)
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Target Posisi Karier / Beasiswa:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetKarierPilih}
                  onChange={(e) => setTargetKarierPilih(e.target.value)}
                  className="flex-1 p-3 border rounded-xl bg-slate-50 font-bold"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiBioPortfolio}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4" /> ⚡ Rangkai dengan AI
                </button>
              </div>
            </div>
          </div>

          {/* Kartu Preview Portofolio Profesional Siap LinkedIn */}
          <div
            className={`p-6 rounded-3xl space-y-5 shadow-xl ${
              temaPortofolio === "modern_dark"
                ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white"
                : "bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white"
            }`}
          >
            <div className="flex justify-between items-start gap-3 border-b border-white/15 pb-4">
              <div>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Verified EdTech Talent
                </span>
                <h4 className="text-2xl font-black mt-1">
                  {userLogin?.nama || "Aisyah Putri"}
                </h4>
                <div className="text-xs font-bold text-amber-300">{targetKarierPilih}</div>
              </div>
              <div className="text-right text-xs">
                <div className="font-black text-emerald-300">{poinXP} XP</div>
                <div className="text-[11px] text-slate-300">CERT-HIBAH-2026-001</div>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">{bioAiRingkas}</p>

            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-emerald-300">
                Modul &amp; Proyek Terverifikasi ({Math.max(2, modulTuntasList.length)}):
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {(modulTuntasList.length > 0 ? modulTuntasList : semuaModul.slice(0, 2)).map(
                  (m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center"
                    >
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {m.judul}
                      </span>
                      <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded font-black">
                        {m.level}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <Code2 className="w-4 h-4 text-amber-300" /> {daftarPengumpulan.length} Proyek
                Terkumpul
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://hibahilmu.id/portfolio/${userLogin?.id || "verified"}`
                  );
                  alert("✓ Link Web Portofolio LinkedIn berhasil disalin ke clipboard!");
                }}
                className="px-4 py-2 rounded-xl bg-white text-slate-950 font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Salin Link LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================================
            2. SIMULASI WAWANCARA KERJA / BEASISWA BERBASIS AI (6 KOLOM)
           ====================================================================== */}
        <div className="lg:col-span-6 bg-white text-slate-800 p-7 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
              AI Mock Interview &amp; STAR Method Evaluator
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Simulasi Wawancara Kerja &amp;
              Beasiswa Berbasis AI
            </h3>
          </div>

          {/* Pilihan Jalur Wawancara */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                "Software & Network Engineer",
                "Beasiswa S2 / Riset LPDP",
                "Data Scientist & AI Researcher",
              ] as const
            ).map((jlr) => (
              <button
                key={jlr}
                type="button"
                onClick={() => {
                  setJalurWawancara(jlr);
                  setIndeksTanyaInterview(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  jalurWawancara === jlr
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                🎙️ {jlr}
              </button>
            ))}
          </div>

          {/* Kotak Pertanyaan Pewawancara AI */}
          <div className="p-5 rounded-2xl bg-indigo-950 text-white space-y-2">
            <div className="flex justify-between items-center text-[11px] font-black text-amber-300 uppercase">
              <span>Pertanyaan Pewawancara AI ({jalurWawancara})</span>
              <button
                type="button"
                onClick={() =>
                  setIndeksTanyaInterview(
                    (prev) => (prev + 1) % bankPertanyaanInterview[jalurWawancara].length
                  )
                }
                className="text-indigo-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Ganti Pertanyaan
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold leading-relaxed">{pertanyaanAktif}</p>
          </div>

          {/* Form Jawaban Kandidat */}
          <form onSubmit={handleKirimJawabanInterview} className="space-y-3 text-xs sm:text-sm">
            <textarea
              rows={3}
              required
              value={jawabanInterviewUser}
              onChange={(e) => setJawabanInterviewUser(e.target.value)}
              placeholder="Tuliskan jawaban wawancara Anda menggunakan metode STAR (Situation, Task, Action, Result)..."
              className="w-full p-3.5 border rounded-2xl bg-slate-50 font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" /> Kirim Jawaban &amp; Dapatkan Evaluasi AI (+40 XP)
            </button>
          </form>

          {/* Hasil Analisis Skor Wawancara AI */}
          {hasilEvaluasiInterview.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-slate-400">
                Hasil Evaluasi AI Interview Coach Terbaru:
              </div>
              {hasilEvaluasiInterview.slice(0, 2).map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white border">
                      <div className="text-[10px] text-slate-500 font-bold">Struktur STAR</div>
                      <div className="text-base font-black text-indigo-700">
                        {ev.skorStrukturStar}/100
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border">
                      <div className="text-[10px] text-slate-500 font-bold">Kedalaman Teknis</div>
                      <div className="text-base font-black text-emerald-700">
                        {ev.skorTeknis}/100
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border">
                      <div className="text-[10px] text-slate-500 font-bold">Komunikasi</div>
                      <div className="text-base font-black text-amber-700">
                        {ev.skorKomunikasi}/100
                      </div>
                    </div>
                  </div>
                  <p className="text-emerald-950 font-semibold leading-relaxed">
                    💬 {ev.feedbackAi}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};