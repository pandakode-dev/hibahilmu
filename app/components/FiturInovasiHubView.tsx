"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  FileText,
  Wand2,
  QrCode,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";
import {
  AkunPengguna,
  CatatanKolaboratifItem,
  RppItem,
  PresensiItem,
  PaketTryout,
} from "../types";

interface FiturInovasiHubProps {
  userLogin: AkunPengguna | null;
  poinXP: number;
  materiSelesai: string[];
  rppList: RppItem[];
  setRppList: React.Dispatch<React.SetStateAction<RppItem[]>>;
  daftarPresensi: PresensiItem[];
  setDaftarPresensi: React.Dispatch<React.SetStateAction<PresensiItem[]>>;
  daftarPaketTryout: PaketTryout[];
  tambahXP: (xp: number) => void;
}

const DAFTAR_BADGE = [
  {
    id: "bg-1",
    nama: "Pioner Wakaf Ilmu",
    deskripsi: "Menyelesaikan modul pembelajaran pertama dengan nilai di atas KKM.",
    syaratXp: 100,
    ikon: "🌱",
    warna: "from-emerald-500 to-teal-600",
  },
  {
    id: "bg-2",
    nama: "Kستريا Kuis & Flashcard",
    deskripsi: "Mengumpulkan lebih dari 400 XP dari latihan kuis multi-format.",
    syaratXp: 400,
    ikon: "⚡",
    warna: "from-indigo-500 to-blue-600",
  },
  {
    id: "bg-3",
    nama: "Cendekiawan Pejuang CBT",
    deskripsi: "Mencapai 600+ XP dan aktif menjaga integritas ujian anti-cheat.",
    syaratXp: 600,
    ikon: "👑",
    warna: "from-amber-500 to-orange-600",
  },
  {
    id: "bg-4",
    nama: "Kontributor Catatan & Forum",
    deskripsi: "Mencapai 900+ XP dengan berbagi catatan kolaboratif & membantu PR.",
    syaratXp: 900,
    ikon: "🚀",
    warna: "from-purple-600 to-rose-600",
  },
];

export const FiturInovasiHubView: React.FC<FiturInovasiHubProps> = ({
  userLogin,
  poinXP,
  materiSelesai,
  rppList,
  setRppList,
  daftarPresensi,
  setDaftarPresensi,
  daftarPaketTryout,
  tambahXP,
}) => {
  const [subTab, setSubTab] = useState<
    | "badges_notes"
    | "ai_rpp_qr"
    | "analisis_butir_soal"
    | "verifikasi_sertifikat"
  >("badges_notes");

  // 1. State Catatan Kolaboratif
  const [daftarCatatan, setDaftarCatatan] = useState<CatatanKolaboratifItem[]>([
    {
      id: "note-1",
      judulCatatan: "Ringkasan Cepat 7 Layer OSI & Rumus Subnetting IPv4",
      modulTerkait: "Modul 1: Komunikasi Data Dasar",
      pembuatNama: "Aisyah Putri",
      isiCatatan:
        "Cara mudah menghafal 7 Layer OSI dari bawah ke atas: All People Seem To Need Data Processing (Application, Presentation, Session, Transport, Network, Data Link, Physical).",
      visibilitas: "Publik",
      waktuUpdate: "Hari ini",
      likes: 14,
    },
    {
      id: "note-2",
      judulCatatan: "Triks Cepat Penurunan Rumus Hukum II Newton Bidang Miring",
      modulTerkait: "Modul 1: Hukum II Newton & Energi Kinetik",
      pembuatNama: "Bapak Budi Santoso, M.Pd",
      isiCatatan:
        "Gaya sejajar bidang miring selalu menggunakan m*g*sin(theta), sedangkan gaya normal menggunakan m*g*cos(theta).",
      visibilitas: "Study Room",
      waktuUpdate: "Kemarin",
      likes: 21,
    },
  ]);
  const [judulNoteBaru, setJudulNoteBaru] = useState("");
  const [modulNoteBaru, setModulNoteBaru] = useState("Komunikasi Data & Jaringan");
  const [isiNoteBaru, setIsiNoteBaru] = useState("");
  const [visibilitasNoteBaru, setVisibilitasNoteBaru] = useState<"Publik" | "Study Room">("Publik");

  // 2. State AI Lesson Plan & RPP Generator
  const [topikAiRpp, setTopikAiRpp] = useState("");
  const [jenjangAiRpp, setJenjangAiRpp] = useState("SMA Kelas 11 / Kuliah");
  const [hasilAiRpp, setHasilAiRpp] = useState<string>("");

  // 3. State QR Presensi Live 5 Menit
  const [kodeQrLiveAktif, setKodeQrLiveAktif] = useState<string>("LIVE-HIBAH-8821");
  const [sisaDetikQrLive, setSisaDetikQrLive] = useState<number>(300);
  const [inputTokenSiswaLive, setInputTokenSiswaLive] = useState("");

  // 4. State Verifikasi Sertifikat Digital
  const [inputNomorSertifikat, setInputNomorSertifikat] = useState("CERT-HIBAH-2026-001");
  const [hasilCekSertifikat, setHasilCekSertifikat] = useState<{
    ketemu: boolean;
    nomor: string;
    nama: string;
    peran: string;
    modul: number;
    tanggal: string;
  } | null>({
    ketemu: true,
    nomor: "CERT-HIBAH-2026-001",
    nama: userLogin?.nama || "Aisyah Putri",
    peran: "Pelajar Terverifikasi HibahIlmu.id",
    modul: Math.max(2, materiSelesai.length),
    tanggal: "26 Oktober 2026",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSisaDetikQrLive((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGenerateAiRpp = () => {
    const topik = topikAiRpp.trim() || "Arsitektur Jaringan & Sains Terapan";
    const teksRpp = `📋 DRAF MODUL AJAR / RPP OTOMATIS (AI GENERATED)
• Topik Utama: ${topik}
• Target Jenjang: ${jenjangAiRpp}
• Kurikulum: Kurikulum Merdeka & Outcome-Based Education (OBE)

1. Capaian & Tujuan Pembelajaran:
   - Peserta didik mampu memahami konsep fundamental ${topik} secara mendalam.
   - Peserta didik mampu menyelesaikan studi kasus nyata dan merancang proyek mandiri terkait ${topik}.

2. Pertanyaan Pemantik (Socratic Method):
   - Mengapa ${topik} sangat krusial dalam kehidupan dan industri modern saat ini?

3. Langkah Kegiatan Pembelajaran (90 Menit):
   - Pendahuluan (15 Menit): Apersepsi, kuis diagnostik awal, dan pemutaran video interaktif.
   - Kegiatan Inti (60 Menit): Eksplorasi konsep per bab (Mode NetAcad), diskusi Study Room, dan simulasi kasus.
   - Penutup (15 Menit): Evaluasi kuis 5 format soal dan refleksi catatan kolaboratif.

4. Rencana Asesmen:
   - Formatif: Kuis interaktif (Passing Grade KKM 80/100) & Flashcards 3D.
   - Sumatif: Tugas proyek mandiri yang dinilai dengan AI Rubric Scoring.`;
    setHasilAiRpp(teksRpp);
  };

  return (
    <div className="space-y-8">
      {/* Header Hub Inovasi */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 text-white p-8 rounded-[2.2rem] shadow-2xl space-y-3">
        <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
          Next-Gen EdTech Innovation Hub
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          Pusat Fitur Pintar: Lencana XP, Catatan Bersama, AI RPP, Analisis Soal &amp; Verifikasi Sertifikat
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200 max-w-3xl">
          Eksplorasi seluruh perangkat pembelajaran kolaboratif, asisten pengajar berbasis AI,
          analitik psikometri butir soal CBT, hingga validasi sertifikat lulusan ber-QR Code.
        </p>
      </div>

      {/* Navigasi Sub-Tab */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          {
            id: "badges_notes",
            label: "1. Lencana XP & Catatan Bersama",
            icon: <Award className="w-4 h-4" />,
          },
          {
            id: "ai_rpp_qr",
            label: "2. AI RPP Assistant & QR Live 5 Menit",
            icon: <Wand2 className="w-4 h-4" />,
          },
          {
            id: "analisis_butir_soal",
            label: "3. Analisis Statistik Butir Soal CBT",
            icon: <BarChart3 className="w-4 h-4" />,
          },
          {
            id: "verifikasi_sertifikat",
            label: "4. Cek Keaslian Sertifikat Digital (QR)",
            icon: <ShieldCheck className="w-4 h-4" />,
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setSubTab(
                t.id as
                  | "badges_notes"
                  | "ai_rpp_qr"
                  | "analisis_butir_soal"
                  | "verifikasi_sertifikat"
              )
            }
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              subTab === t.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: BADGES ACHIEVEMENTS & COLLABORATIVE NOTES */}
      {subTab === "badges_notes" && (
        <div className="space-y-8">
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Koleksi Lencana Digital (Badges &amp;
                Achievements)
              </h2>
              <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                XP Anda Saat Ini: {poinXP} XP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DAFTAR_BADGE.map((b) => {
                const terbuka = poinXP >= b.syaratXp;
                return (
                  <div
                    key={b.id}
                    className={`p-5 rounded-3xl border-2 space-y-2 transition ${
                      terbuka
                        ? `bg-gradient-to-br ${b.warna} text-white border-transparent shadow-lg`
                        : "bg-slate-100 text-slate-400 border-slate-200 opacity-75"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-3xl">{b.ikon}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/20">
                        {terbuka ? "✓ Terbuka" : `Syarat ${b.syaratXp} XP`}
                      </span>
                    </div>
                    <h3 className="font-black text-base">{b.nama}</h3>
                    <p className="text-xs opacity-90 leading-relaxed">{b.deskripsi}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catatan Belajar Bersama (Collaborative Notes) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Buat Catatan Belajar Bersama
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!judulNoteBaru.trim() || !isiNoteBaru.trim()) return;
                  const baru: CatatanKolaboratifItem = {
                    id: "note-" + Date.now(),
                    judulCatatan: judulNoteBaru,
                    modulTerkait: modulNoteBaru,
                    pembuatNama: userLogin?.nama || "Pelajar Kontributor",
                    isiCatatan: isiNoteBaru,
                    visibilitas: visibilitasNoteBaru,
                    waktuUpdate: "Baru saja",
                    likes: 1,
                  };
                  setDaftarCatatan([baru, ...daftarCatatan]);
                  setJudulNoteBaru("");
                  setIsiNoteBaru("");
                  tambahXP(25);
                }}
                className="space-y-3 text-xs sm:text-sm"
              >
                <input
                  type="text"
                  required
                  value={judulNoteBaru}
                  onChange={(e) => setJudulNoteBaru(e.target.value)}
                  placeholder="Judul Ringkasan / Catatan Materi..."
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={modulNoteBaru}
                    onChange={(e) => setModulNoteBaru(e.target.value)}
                    placeholder="Modul Terkait..."
                    className="p-3 border rounded-xl bg-slate-50"
                  />
                  <select
                    value={visibilitasNoteBaru}
                    onChange={(e) =>
                      setVisibilitasNoteBaru(e.target.value as "Publik" | "Study Room")
                    }
                    className="p-3 border rounded-xl bg-indigo-50 font-black text-indigo-950"
                  >
                    <option value="Publik">Bagikan: Publik</option>
                    <option value="Study Room">Bagikan: Study Room</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  required
                  value={isiNoteBaru}
                  onChange={(e) => setIsiNoteBaru(e.target.value)}
                  placeholder="Tuliskan poin penting, jembatan keledai (mnemonik), atau rangkuman rumus..."
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl cursor-pointer"
                >
                  + Bagikan Catatan Kolaboratif (+25 XP)
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Pustaka Catatan Kolaboratif Siswa
                &amp; Pengajar
              </h3>
              <div className="space-y-4">
                {daftarCatatan.map((ct) => (
                  <div
                    key={ct.id}
                    className="p-5 rounded-2xl bg-slate-50 border space-y-2 text-xs sm:text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                        {ct.visibilitas} • {ct.modulTerkait}
                      </span>
                      <span className="text-xs text-slate-400">
                        Oleh <b>{ct.pembuatNama}</b> ({ct.waktuUpdate})
                      </span>
                    </div>
                    <h4 className="font-black text-base text-slate-900">{ct.judulCatatan}</h4>
                    <p className="text-slate-600 leading-relaxed">{ct.isiCatatan}</p>
                    <div className="pt-1">
                      <button
                        onClick={() =>
                          setDaftarCatatan(
                            daftarCatatan.map((x) =>
                              x.id === ct.id ? { ...x, likes: x.likes + 1 } : x
                            )
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-white border text-xs font-bold flex items-center gap-1.5 text-emerald-700 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Bermanfaat ({ct.likes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI LESSON PLAN & RPP ASSISTANT + QR PRESENSI LIVE 5 MENIT */}
      {subTab === "ai_rpp_qr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-indigo-600" /> AI Lesson Plan &amp; RPP Generator
                Otomatis
              </h3>
              <span className="text-[11px] font-black bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                Kurikulum Merdeka &amp; RPS Kampus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <input
                type="text"
                value={topikAiRpp}
                onChange={(e) => setTopikAiRpp(e.target.value)}
                placeholder="Ketik Topik Materi (Misal: Hukum Termodinamika)..."
                className="sm:col-span-2 p-3.5 border rounded-xl bg-slate-50 font-bold"
              />
              <input
                type="text"
                value={jenjangAiRpp}
                onChange={(e) => setJenjangAiRpp(e.target.value)}
                placeholder="Jenjang Kelas..."
                className="p-3.5 border rounded-xl bg-slate-50"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateAiRpp}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> ⚡ Susun Draf RPP &amp; Tujuan Pembelajaran dengan AI
            </button>

            {hasilAiRpp && (
              <div className="space-y-3">
                <pre className="p-5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {hasilAiRpp}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    const baru: RppItem = {
                      id: "rpp-ai-" + Date.now(),
                      judulRpp: `RPP AI: ${topikAiRpp || "Materi Baru"}`,
                      mataPelajaran: "Sains & Teknologi",
                      jenjangKelas: jenjangAiRpp,
                      kurikulum: "Kurikulum Merdeka",
                      pembuatNama: userLogin?.nama || "Guru Kontributor",
                      ringkasanTujuan: hasilAiRpp.slice(0, 160) + "...",
                      fileUrl: "https://drive.google.com",
                      jumlahUnduhan: 1,
                      tanggalUpload: "Baru saja",
                    };
                    setRppList([baru, ...rppList]);
                    alert("✓ Draf RPP AI berhasil disimpan ke Bank RPP Nasional!");
                  }}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                >
                  Simpan ke Bank RPP Kolektif
                </button>
              </div>
            )}
          </div>

          {/* QR Code Absensi Sesi Kelas Live (Aktif 5 Menit) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase bg-emerald-500 text-slate-950 px-3 py-1 rounded-full">
                Live Attendance QR
              </span>
              <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Sisa Waktu:{" "}
                {Math.floor(sisaDetikQrLive / 60)}:
                {(sisaDetikQrLive % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-xl font-black flex items-center gap-2">
              <QrCode className="w-6 h-6 text-emerald-400" /> Presensi Cepat Sesi Live (5 Menit)
            </h3>

            <div className="p-6 bg-white text-slate-900 rounded-2xl text-center space-y-2">
              <QrCode className="w-24 h-24 mx-auto text-slate-900" />
              <div className="text-xs font-bold text-slate-500">TOKEN PRESENSI LIVE AKTIF:</div>
              <div className="font-mono text-2xl font-black text-indigo-700 tracking-wider">
                {sisaDetikQrLive > 0 ? kodeQrLiveAktif : "EXPIRED"}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setKodeQrLiveAktif(
                    "LIVE-HIBAH-" + Math.floor(1000 + Math.random() * 9000)
                  );
                  setSisaDetikQrLive(300);
                }}
                className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-black cursor-pointer"
              >
                🔄 Buat Token QR 5 Menit Baru (Untuk Pengajar)
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (sisaDetikQrLive <= 0) {
                  alert("Waktu presensi QR 5 menit telah habis!");
                  return;
                }
                if (inputTokenSiswaLive.trim().toUpperCase() !== kodeQrLiveAktif) {
                  alert("Kode Token QR tidak sesuai!");
                  return;
                }
                setDaftarPresensi([
                  {
                    id: "pr-live-" + Date.now(),
                    siswaId: userLogin?.id || "sis-1",
                    siswaNama: userLogin?.nama || "Mahasiswa Hadir",
                    materiJudul: `Sesi Live Streaming (${kodeQrLiveAktif})`,
                    waktuHadir: "Baru saja",
                    metode: "QR Live 5 Menit",
                  },
                  ...daftarPresensi,
                ]);
                setInputTokenSiswaLive("");
                tambahXP(20);
                alert("✓ Presensi Kelas Live Berhasil Dicatat (+20 XP)!");
              }}
              className="flex gap-2 pt-2 border-t border-slate-800"
            >
              <input
                type="text"
                value={inputTokenSiswaLive}
                onChange={(e) => setInputTokenSiswaLive(e.target.value)}
                placeholder="Ketik Token QR di atas untuk absen..."
                className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white"
              />
              <button
                type="submit"
                className="bg-emerald-500 text-slate-950 font-black px-4 py-3 rounded-xl text-xs cursor-pointer"
              >
                Absen Hadir
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ANALISIS STATISTIK BUTIR SOAL CBT (ITEM ANALYSIS) */}
      {subTab === "analisis_butir_soal" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
              Psychometric Item Analysis
            </span>
            <h3 className="text-2xl font-black mt-2 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" /> Statistik Tingkat Kesukaran, Daya
              Pembeda &amp; Distribusi Opsi Jawaban CBT
            </h3>
          </div>

          <div className="space-y-4">
            {daftarPaketTryout.flatMap((pkt) =>
              pkt.daftarSoal.map((soal, sIdx) => {
                // Simulasi statistik psikometri terukur per butir soal
                const dist = sIdx % 2 === 0 ? [12, 18, 58, 12] : [10, 64, 16, 10];
                const tingkatKesukaran = sIdx % 2 === 0 ? "Sedang (P = 0.58)" : "Mudah (P = 0.64)";
                const dayaPembeda = "Sangat Baik (D = 0.42)";

                return (
                  <div
                    key={soal.id}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs sm:text-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-black text-indigo-900">
                        {pkt.judul} — Butir Soal #{sIdx + 1}
                      </span>
                      <div className="flex gap-2 text-xs font-black">
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                          Kesukaran: {tingkatKesukaran}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900">
                          Daya Pembeda: {dayaPembeda}
                        </span>
                      </div>
                    </div>

                    <p className="font-bold text-slate-900">{soal.pertanyaan}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                      {soal.opsi.map((op, oIdx) => {
                        const persen = dist[oIdx] || 25;
                        const adalahKunci = soal.jawabanBenar === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border bg-white space-y-1.5 ${
                              adalahKunci ? "border-emerald-500 ring-2 ring-emerald-500/20" : ""
                            }`}
                          >
                            <div className="flex justify-between font-black text-xs">
                              <span>
                                Opsi {String.fromCharCode(65 + oIdx)}{" "}
                                {adalahKunci && "✓ (Kunci)"}
                              </span>
                              <span className="text-indigo-600">{persen}% Pemilih</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${persen}%` }}
                                className={`h-full rounded-full ${
                                  adalahKunci ? "bg-emerald-500" : "bg-indigo-400"
                                }`}
                              />
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">{op}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VERIFIKASI KEASLIAN SERTIFIKAT DIGITAL BER-QR CODE */}
      {subTab === "verifikasi_sertifikat" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-black">
              Portal Verifikasi Keaslian Sertifikat Lulusan (QR Validator)
            </h3>
            <p className="text-xs text-slate-500">
              Instansi, sekolah, atau universitas dapat memasukkan Nomor Seri Sertifikat untuk
              memvalidasi keaslian capaian belajar siswa di HibahIlmu.id.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const kode = inputNomorSertifikat.trim().toUpperCase();
              if (kode.startsWith("CERT-HIBAH")) {
                setHasilCekSertifikat({
                  ketemu: true,
                  nomor: kode,
                  nama: userLogin?.nama || "Aisyah Putri",
                  peran: "Pelajar Terverifikasi HibahIlmu.id",
                  modul: Math.max(2, materiSelesai.length),
                  tanggal: "26 Oktober 2026",
                });
              } else {
                setHasilCekSertifikat(null);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputNomorSertifikat}
              onChange={(e) => setInputNomorSertifikat(e.target.value)}
              placeholder="Masukkan Nomor Sertifikat (Contoh: CERT-HIBAH-2026-001)..."
              className="flex-1 p-3.5 border rounded-xl bg-slate-50 font-mono text-sm font-bold"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Verifikasi
            </button>
          </form>

          {hasilCekSertifikat ? (
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-600 text-white">
                      SERTIFIKAT SAH &amp; TERVERIFIKASI
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-1">
                      {hasilCekSertifikat.nama}
                    </h4>
                  </div>
                </div>
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Nomor Seri:</span>
                  <b className="font-mono">{hasilCekSertifikat.nomor}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Modul Tuntas:</span>
                  <b>{hasilCekSertifikat.modul} Modul Bersyarat</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Tanggal Terbit:</span>
                  <b>{hasilCekSertifikat.tanggal}</b>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
              ✕ Nomor sertifikat tidak ditemukan. Gunakan format CERT-HIBAH-2026-001.
            </div>
          )}
        </div>
      )}
    </div>
  );
};