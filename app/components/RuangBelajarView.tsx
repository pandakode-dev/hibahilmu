"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowLeft,
  Trophy,
  Search,
  Star,
  Volume2,
  VolumeX,
  RotateCw,
  Brain,
  Lock,
  GitBranch,
  Compass,
  MessageSquare,
  HeartHandshake,
  Bot,
  Quote,
  ShieldCheck,
  FileText,
  Layers,
  Cpu,
  Globe,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import {
  JenjangItem,
  KelasItem,
  AkunPengguna,
  PesanChatMateri,
} from "../types";
import { bersihkanTagHtml } from "../mockData";

interface RuangBelajarProps {
  daftarJenjang: JenjangItem[];
  jenjangAktif: JenjangItem | null;
  setJenjangAktif: (j: JenjangItem | null) => void;
  subJenjangAktif: string;
  setSubJenjangAktif: (id: string) => void;
  kelasAktif: KelasItem | null;
  setKelasAktif: (k: KelasItem | null) => void;
  userLogin: AkunPengguna | null;
  hanyaMateriDiikuti: boolean;
  setHanyaMateriDiikuti: (val: boolean) => void;
  materiSelesai: string[];
  toggleSelesaiMateri: (id: string) => void;
  tambahXP: (xp: number) => void;
  chatPerMateri: { [materiId: string]: PesanChatMateri[] };
  onKirimChatMateri: (pesan: string) => void;
  onKirimUlasanMateri: (bintang: number, komentar: string) => void;
  onBukaAuthAtauDashboard: (rolePilih?: "siswa" | "guru") => void;
}

export function renderIkonJenjang(nama: string) {
  switch (nama) {
    case "Baby":
      return <Sparkles className="w-6 h-6" />;
    case "Shapes":
      return <BookOpen className="w-6 h-6" />;
    case "Compass":
      return <Compass className="w-6 h-6" />;
    case "BookOpen":
      return <BookOpen className="w-6 h-6" />;
    default:
      return <GraduationCap className="w-6 h-6" />;
  }
}

export const RuangBelajarView: React.FC<RuangBelajarProps> = ({
  daftarJenjang,
  jenjangAktif,
  setJenjangAktif,
  subJenjangAktif,
  setSubJenjangAktif,
  kelasAktif,
  setKelasAktif,
  userLogin,
  hanyaMateriDiikuti,
  setHanyaMateriDiikuti,
  materiSelesai,
  toggleSelesaiMateri,
  tambahXP,
  chatPerMateri,
  onKirimChatMateri,
  onKirimUlasanMateri,
  onBukaAuthAtauDashboard,
}) => {
  // State Efek 3D Utama di Hero
  const [rotasi3D, setRotasi3D] = useState({ x: 8, y: -12 });
  // State Efek 3D Kartu Showcase & Jenjang
  const [kartu3DAktif, setKartu3DAktif] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const [kataKunci, setKataKunci] = useState("");
  const [modeVisualSkillTree, setModeVisualSkillTree] = useState(false);

  // State Audiobook (Text-to-Speech)
  const [sedangBicaraTts, setSedangBicaraTts] = useState(false);

  // State Flashcards Spaced Repetition
  const [indeksFlashcard, setIndeksFlashcard] = useState(0);
  const [balikKartu, setBalikKartu] = useState(false);
  const [penguasaanFlashcard, setPenguasaanFlashcard] = useState<{
    [id: string]: "ulangi" | "cukup" | "mahir";
  }>({});

  // State 5 Tipe Kuis Interaktif
  const [jawabanPilihanTunggal, setJawabanPilihanTunggal] = useState<{ [id: string]: number }>({});
  const [jawabanPilihanJamak, setJawabanPilihanJamak] = useState<{ [id: string]: number[] }>({});
  const [jawabanIsianTeks, setJawabanIsianTeks] = useState<{ [id: string]: string }>({});
  const [jawabanCocok, setJawabanCocok] = useState<{
    [kuisId: string]: { [idxKiri: number]: string };
  }>({});
  const [statusKuisTerjawab, setStatusKuisTerjawab] = useState<{ [id: string]: boolean }>({});
  const [pesanEvaluasiKuis, setPesanEvaluasiKuis] = useState<{
    [id: string]: { tipe: "sukses" | "gagal"; teks: string };
  }>({});
  const [petunjukSocratic, setPetunjukSocratic] = useState<{ [id: string]: string }>({});

  // State Ulasan & Chat
  const [bintangUlasanBaru, setBintangUlasanBaru] = useState(5);
  const [komentarUlasanBaru, setKomentarUlasanBaru] = useState("");
  const [inputChatMateri, setInputChatMateri] = useState("");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [kelasAktif]);

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    setRotasi3D({ x: rotateX, y: rotateY });
  };

  const handleMouseMoveKartu3D = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setKartu3DAktif({ id, x: rotateX, y: rotateY });
  };

  const handleToggleAudiobook = (htmlMateri: string, judul: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda belum mendukung fitur Text-to-Speech.");
      return;
    }
    if (sedangBicaraTts) {
      window.speechSynthesis.cancel();
      setSedangBicaraTts(false);
    } else {
      window.speechSynthesis.cancel();
      const teksBersih = `${judul}. ${bersihkanTagHtml(htmlMateri)}`;
      const utterance = new SpeechSynthesisUtterance(teksBersih);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.onend = () => setSedangBicaraTts(false);
      window.speechSynthesis.speak(utterance);
      setSedangBicaraTts(true);
    }
  };

  // ============================================================================
  // 1. TAMPILAN RUANG KELAS DETAIL (VIDEO, AUDIOBOOK, 3D FLASHCARDS, 5 TIPE KUIS)
  // ============================================================================
  if (kelasAktif && userLogin) {
    const flashcards = kelasAktif.flashcards || [];
    const kartuSaatIni = flashcards[indeksFlashcard];

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setKelasAktif(null)}
            className="inline-flex items-center gap-2 text-base font-extrabold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Modul
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleToggleAudiobook(kelasAktif.rangkuman, kelasAktif.judul)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                sedangBicaraTts
                  ? "bg-amber-500 text-slate-950 animate-pulse shadow-md"
                  : "bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              {sedangBicaraTts ? (
                <>
                  <VolumeX className="w-4 h-4" /> Hentikan Audiobook
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Dengarkan Materi (Audiobook)
                </>
              )}
            </button>

            <button
              onClick={() => toggleSelesaiMateri(kelasAktif.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                materiSelesai.includes(kelasAktif.id)
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white border-2 border-slate-300 text-slate-800 hover:border-emerald-500"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {materiSelesai.includes(kelasAktif.id)
                ? "Selesai Dipelajari ✓"
                : "Tandai Selesai (+30 XP)"}
            </button>
          </div>
        </div>

        <div className="bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg">
          <div className="aspect-video bg-slate-950">
            <iframe
              src={kelasAktif.videoUrl}
              title={kelasAktif.judul}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-md bg-emerald-100 text-emerald-800">
                  Level: {kelasAktif.level} • Durasi: {kelasAktif.durasi}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-3">{kelasAktif.judul}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Kontributor Wakaf Ilmu: <b>{kelasAktif.pembuatNama}</b> ({kelasAktif.pembuatEmail})
                </p>
              </div>
              {kelasAktif.lampiranUrl && (
                <a
                  href={kelasAktif.lampiranUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Unduh Lampiran PDF/PPT
                </a>
              )}
            </div>

            <div
              className="prose prose-slate max-w-none leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: kelasAktif.rangkuman }}
            />

            {kelasAktif.rumusMatematika && (
              <div className="p-6 bg-indigo-950 text-white rounded-2xl overflow-x-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                  Rumus Matematika / Sains (LaTeX):
                </div>
                <BlockMath math={kelasAktif.rumusMatematika} />
              </div>
            )}
          </div>
        </div>

        {/* 3D FLIP FLASHCARDS SPACED REPETITION */}
        {flashcards.length > 0 && kartuSaatIni && (
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                  3D Spaced Repetition Flashcards
                </span>
                <h3 className="text-xl font-black mt-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" /> Kartu Hafalan 3D Interaktif (Kartu{" "}
                  {indeksFlashcard + 1} dari {flashcards.length})
                </h3>
              </div>
              <div className="text-xs text-slate-300">
                Klik kartu untuk efek putar 3D pertanyaan &amp; jawaban
              </div>
            </div>

            <div
              onClick={() => setBalikKartu(!balikKartu)}
              style={{
                transform: balikKartu
                  ? "perspective(1000px) rotateX(360deg) scale(1.01)"
                  : "perspective(1000px) rotateX(0deg) scale(1)",
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="min-h-[190px] rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/25 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl"
            >
              <span className="text-xs uppercase font-black tracking-widest text-amber-300 mb-2">
                {balikKartu ? "✨ JAWABAN / DEFINISI:" : "❓ PERTANYAAN / KONSEP:"}
              </span>
              <p className="text-xl sm:text-2xl font-black">
                {balikKartu ? kartuSaatIni.belakang : kartuSaatIni.depan}
              </p>
              <span className="text-xs text-slate-300 mt-4 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Ketuk untuk membalik kartu 3D
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Tingkat Penguasaan:</span>
                {(["ulangi", "cukup", "mahir"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setPenguasaanFlashcard({
                        ...penguasaanFlashcard,
                        [kartuSaatIni.id]: lvl,
                      });
                      if (lvl === "mahir") tambahXP(10);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer ${
                      penguasaanFlashcard[kartuSaatIni.id] === lvl
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {lvl === "ulangi"
                      ? "Sulit / Ulangi"
                      : lvl === "cukup"
                      ? "Cukup Hafal"
                      : "Sudah Mahir (+10 XP)"}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBalikKartu(false);
                    setIndeksFlashcard((prev) =>
                      prev > 0 ? prev - 1 : flashcards.length - 1
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() => {
                    setBalikKartu(false);
                    setIndeksFlashcard((prev) =>
                      prev < flashcards.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black"
                >
                  Kartu Berikutnya →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KUIS EVALUASI (5 FORMAT SOAL ANTI-ERROR + FEEDBACK LANGSUNG) */}
        <div className="bg-white text-slate-800 rounded-3xl p-8 border border-slate-200/90 space-y-6">
          <h3 className="font-black text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Evaluasi Pemahaman Materi (
            {kelasAktif.daftarKuis.length} Soal Multi-Format)
          </h3>

          <div className="space-y-6">
            {kelasAktif.daftarKuis.map((kuis, idx) => {
              const sudahBenar = statusKuisTerjawab[kuis.id];
              const infoEval = pesanEvaluasiKuis[kuis.id];

              // Pastikan soal mencocokkan selalu memiliki pasangan default jika kosong
              const daftarPasanganValid =
                kuis.pasangan && kuis.pasangan.length > 0
                  ? kuis.pasangan
                  : [
                      { kiri: "Pernyataan 1", kanan: "Pasangan A" },
                      { kiri: "Pernyataan 2", kanan: "Pasangan B" },
                    ];

              // Urutkan opsi kanan secara alfabetis agar tidak selalu sejajar lurus dengan kiri
              const opsiKananTeracak = [...daftarPasanganValid]
                .map((p) => p.kanan)
                .sort((a, b) => a.localeCompare(b));

              return (
                <div
                  key={kuis.id}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-md bg-indigo-100 text-indigo-900">
                      Soal #{idx + 1} • {kuis.tipe.replace("_", " ").toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPetunjukSocratic({
                            ...petunjukSocratic,
                            [kuis.id]: `💡 Petunjuk AI Socratic: Perhatikan kembali konsep inti pada kalimat "${(
                              kuis.pembahasan || "rangkuman materi di atas"
                            ).slice(0, 50)}..." sebelum menentukan jawaban.`,
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" /> Petunjuk AI Socratic
                      </button>
                      <span className="text-xs font-black text-amber-700">+{kuis.poin} XP</span>
                    </div>
                  </div>

                  <p className="font-bold text-lg text-slate-900">{kuis.tanya}</p>

                  {petunjukSocratic[kuis.id] && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950">
                      {petunjukSocratic[kuis.id]}
                    </div>
                  )}

                  {/* 1 & 3: PILIHAN GANDA & BENAR/SALAH */}
                  {(kuis.tipe === "pilihan_ganda" || kuis.tipe === "benar_salah") && (
                    <div className="space-y-2.5">
                      {(kuis.tipe === "benar_salah"
                        ? ["Benar", "Salah"]
                        : kuis.opsi.length > 0
                        ? kuis.opsi
                        : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"]
                      ).map((teksOpsi, opsiIdx) => {
                        const dipilih = jawabanPilihanTunggal[kuis.id] === opsiIdx;
                        const apakahKunci = opsiIdx === (kuis.jawabanBenar ?? 0);
                        return (
                          <button
                            key={opsiIdx}
                            onClick={() => {
                              setJawabanPilihanTunggal({
                                ...jawabanPilihanTunggal,
                                [kuis.id]: opsiIdx,
                              });
                              if (apakahKunci) {
                                if (!statusKuisTerjawab[kuis.id]) tambahXP(kuis.poin || 50);
                                setStatusKuisTerjawab({ ...statusKuisTerjawab, [kuis.id]: true });
                                setPesanEvaluasiKuis({
                                  ...pesanEvaluasiKuis,
                                  [kuis.id]: {
                                    tipe: "sukses",
                                    teks: `✓ Jawaban Tepat! ${kuis.pembahasan}`,
                                  },
                                });
                              } else {
                                setPesanEvaluasiKuis({
                                  ...pesanEvaluasiKuis,
                                  [kuis.id]: {
                                    tipe: "gagal",
                                    teks: "✕ Jawaban belum tepat. Silakan pilih opsi lainnya atau klik Petunjuk AI Socratic!",
                                  },
                                });
                              }
                            }}
                            className={`w-full text-left p-4 rounded-xl border-2 font-semibold text-base transition cursor-pointer flex justify-between items-center ${
                              dipilih
                                ? apakahKunci
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                                  : "border-rose-500 bg-rose-50 text-rose-950"
                                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                            }`}
                          >
                            <span>
                              {kuis.tipe === "pilihan_ganda" && (
                                <b className="mr-2">{String.fromCharCode(65 + opsiIdx)}.</b>
                              )}
                              {teksOpsi}
                            </span>
                            {dipilih && (
                              <span className="text-xs font-black">
                                {apakahKunci ? "✓ BENAR" : "✕ SALAH"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 2: PILIHAN JAMAK (MULTI-SELECT CHECKBOX) */}
                  {kuis.tipe === "pilihan_jamak" && (
                    <div className="space-y-2.5">
                      <p className="text-xs text-slate-500 font-bold">
                        * Centang semua jawaban yang benar, lalu klik tombol Verifikasi Pilihan
                        Jamak:
                      </p>
                      {(kuis.opsi.length > 0
                        ? kuis.opsi
                        : ["Pernyataan 1", "Pernyataan 2", "Pernyataan 3", "Pernyataan 4"]
                      ).map((teksOpsi, opsiIdx) => {
                        const terpilih = (jawabanPilihanJamak[kuis.id] || []).includes(opsiIdx);
                        return (
                          <label
                            key={opsiIdx}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border-2 font-semibold cursor-pointer ${
                              terpilih
                                ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={terpilih}
                              onChange={() => {
                                const listLama = jawabanPilihanJamak[kuis.id] || [];
                                const baru = terpilih
                                  ? listLama.filter((i) => i !== opsiIdx)
                                  : [...listLama, opsiIdx];
                                setJawabanPilihanJamak({
                                  ...jawabanPilihanJamak,
                                  [kuis.id]: baru,
                                });
                              }}
                              className="w-4 h-4 accent-indigo-600"
                            />
                            <span>{teksOpsi}</span>
                          </label>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          const kunciArray =
                            kuis.jawabanJamak && kuis.jawabanJamak.length > 0
                              ? kuis.jawabanJamak
                              : [0, 1];
                          const kunci = [...kunciArray].sort().join(",");
                          const userJwb = [...(jawabanPilihanJamak[kuis.id] || [])]
                            .sort()
                            .join(",");
                          if (userJwb === kunci) {
                            if (!statusKuisTerjawab[kuis.id]) tambahXP(kuis.poin || 50);
                            setStatusKuisTerjawab({ ...statusKuisTerjawab, [kuis.id]: true });
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "sukses",
                                teks: `✓ Kombinasi Pilihan Jamak Benar! ${kuis.pembahasan}`,
                              },
                            });
                          } else {
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "gagal",
                                teks: "✕ Kombinasi jawaban yang Anda centang belum tepat. Coba periksa kembali!",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Verifikasi Pilihan Jamak
                      </button>
                    </div>
                  )}

                  {/* 4: ISIAN SINGKAT (SMART FUZZY AUTO-GRADER) */}
                  {kuis.tipe === "isian_singkat" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={jawabanIsianTeks[kuis.id] || ""}
                        onChange={(e) =>
                          setJawabanIsianTeks({ ...jawabanIsianTeks, [kuis.id]: e.target.value })
                        }
                        placeholder="Ketik jawaban singkat Anda di sini..."
                        className="flex-1 p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = (jawabanIsianTeks[kuis.id] || "").trim().toLowerCase();
                          const kunci = (kuis.jawabanTeks || "").trim().toLowerCase();
                          if (
                            input &&
                            (!kunci ||
                              input === kunci ||
                              kunci.includes(input) ||
                              input.includes(kunci))
                          ) {
                            if (!statusKuisTerjawab[kuis.id]) tambahXP(kuis.poin || 50);
                            setStatusKuisTerjawab({ ...statusKuisTerjawab, [kuis.id]: true });
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "sukses",
                                teks: `✓ Jawaban Tepat (Kunci: ${kuis.jawabanTeks || input})! ${
                                  kuis.pembahasan
                                }`,
                              },
                            });
                          } else {
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "gagal",
                                teks: "✕ Jawaban isian belum sesuai dengan kata kunci konsep materi.",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs cursor-pointer"
                      >
                        Cek Jawaban Isian
                      </button>
                    </div>
                  )}

                  {/* 5: MENCOCOKKAN PASANGAN (MATCHING PAIRS BEBAS ERROR) */}
                  {kuis.tipe === "mencocokkan" && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold">
                        * Pasangkan setiap pernyataan di sebelah kiri dengan pasangan yang tepat di
                        sebelah kanan:
                      </p>
                      {daftarPasanganValid.map((pas, pIdx) => {
                        const pilihanUserSaatIni = jawabanCocok[kuis.id]?.[pIdx] || "";
                        const sudahSesuai = pilihanUserSaatIni === pas.kanan;
                        return (
                          <div
                            key={pIdx}
                            className={`grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 rounded-xl border-2 ${
                              sudahBenar && sudahSesuai
                                ? "bg-emerald-50 border-emerald-400"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <div className="sm:col-span-5 font-bold text-sm text-slate-900">
                              {pIdx + 1}. {pas.kiri}
                            </div>
                            <div className="sm:col-span-1 text-center font-black text-indigo-600 hidden sm:block">
                              ↔
                            </div>
                            <div className="sm:col-span-6">
                              <select
                                value={pilihanUserSaatIni}
                                onChange={(e) =>
                                  setJawabanCocok({
                                    ...jawabanCocok,
                                    [kuis.id]: {
                                      ...(jawabanCocok[kuis.id] || {}),
                                      [pIdx]: e.target.value,
                                    },
                                  })
                                }
                                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-800"
                              >
                                <option value="">-- Pilih Pasangan Jawaban --</option>
                                {opsiKananTeracak.map((teksKanan, oIdx) => (
                                  <option key={oIdx} value={teksKanan}>
                                    {teksKanan}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          const semuaCocok = daftarPasanganValid.every(
                            (pas, pIdx) =>
                              (jawabanCocok[kuis.id]?.[pIdx] || "").trim() === pas.kanan.trim()
                          );
                          if (semuaCocok) {
                            if (!statusKuisTerjawab[kuis.id]) tambahXP(kuis.poin || 50);
                            setStatusKuisTerjawab({ ...statusKuisTerjawab, [kuis.id]: true });
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "sukses",
                                teks: `✓ Semua Pasangan Tepat 100%! ${kuis.pembahasan}`,
                              },
                            });
                          } else {
                            setPesanEvaluasiKuis({
                              ...pesanEvaluasiKuis,
                              [kuis.id]: {
                                tipe: "gagal",
                                teks: "✕ Masih ada pasangan yang belum cocok atau belum dipilih. Silakan periksa kembali!",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Periksa Semua Pasangan
                      </button>
                    </div>
                  )}

                  {/* KOTAK FEEDBACK HASIL PENGERJAAN SOAL */}
                  {infoEval && (
                    <div
                      className={`p-4 rounded-xl border text-sm font-bold ${
                        infoEval.tipe === "sukses"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                          : "bg-rose-50 border-rose-300 text-rose-900"
                      }`}
                    >
                      {infoEval.teks}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DISKUSI & ULASAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white text-slate-800 rounded-3xl p-6 border space-y-4">
            <h3 className="font-black text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Diskusi Kelas Materi Ini
            </h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {(chatPerMateri[kelasAktif.id] || []).map((ch) => (
                <div key={ch.id} className="p-3 rounded-2xl bg-slate-50 border text-xs">
                  <div className="font-black text-slate-900">
                    {ch.pengirimNama} ({ch.pengirimRole}) •{" "}
                    <span className="text-slate-400">{ch.waktu}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{ch.pesan}</p>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inputChatMateri.trim()) return;
                onKirimChatMateri(inputChatMateri);
                setInputChatMateri("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputChatMateri}
                onChange={(e) => setInputChatMateri(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                Kirim
              </button>
            </form>
          </div>

          <div className="bg-white text-slate-800 rounded-3xl p-6 border space-y-4">
            <h3 className="font-black text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Beri Rating &amp; Ulasan Modul
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!komentarUlasanBaru.trim()) return;
                onKirimUlasanMateri(bintangUlasanBaru, komentarUlasanBaru);
                setKomentarUlasanBaru("");
              }}
              className="space-y-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">Pilih Bintang:</span>
                {[1, 2, 3, 4, 5].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBintangUlasanBaru(b)}
                    className={`px-2.5 py-1 rounded-lg font-black ${
                      bintangUlasanBaru >= b
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    ★ {b}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={komentarUlasanBaru}
                onChange={(e) => setKomentarUlasanBaru(e.target.value)}
                placeholder="Tulis kesan belajar modul ini..."
                className="w-full p-3 bg-slate-50 border rounded-xl"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold"
              >
                Kirim Ulasan (+15 XP)
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // 2. TAMPILAN LANDING PAGE UTAMA (DIPERBANYAK EFEK 3D INTERAKTIF)
  // ============================================================================
  const semuaKelasFlat = daftarJenjang.flatMap((j) =>
    j.kelas.map((k) => ({ ...k, namaJenjang: j.nama }))
  );

  return (
    <div className="space-y-14">
      {!jenjangAktif && (
        <>
          {/* HERO SECTION 2 KOLOM DENGAN PORTAL KARTU 3D BERLAPIS (MULTI-LAYER 3D) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-extrabold text-emerald-800 shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI-Powered Open Source LMS • 100% Gratis &amp; Terverifikasi</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Belajar Tanpa Batas, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                  Mari Hibahkan Ilmu Untuk Bangsa.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Dilengkapi <b>AI Tutor Socratic</b>, <b>Smart Fuzzy Auto-Grader</b>,{" "}
                <b>AI Quiz Generator</b>, <b>Peer Study Rooms</b>, <b>Portal Beasiswa</b>, hingga{" "}
                <b>CBT Fullscreen Anti-Cheat</b> untuk TK, SD, SMP, SMA, Kuliah, TPA &amp; TOEFL.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("katalog-jenjang");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-7 py-4 rounded-2xl text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer transition"
                >
                  <Sparkles className="w-4 h-4" /> Jelajahi Ruang Kelas
                </button>

                <button
                  onClick={() => onBukaAuthAtauDashboard("guru")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-7 py-4 rounded-2xl text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition"
                >
                  <HeartHandshake className="w-4 h-4" /> Ikut Menyumbang Ilmu (Jadi Pengajar)
                </button>
              </div>
            </div>

            {/* Kolom Kanan: Kartu 3D Interaktif Multi-Layer */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div
                onMouseMove={handleMouseMove3D}
                onMouseLeave={() => setRotasi3D({ x: 8, y: -12 })}
                style={{
                  transform: `perspective(1100px) rotateX(${rotasi3D.x}deg) rotateY(${rotasi3D.y}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.15s ease-out",
                }}
                className="w-full max-w-md rounded-[2.2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-7 shadow-[0_30px_70px_-15px_rgba(16,185,129,0.45)] border-4 border-slate-700/80 space-y-5 cursor-grab select-none relative"
              >
                {/* Floating Badge 3D Layer Atas */}
                <div
                  style={{ transform: "translateZ(40px)" }}
                  className="flex items-center gap-3.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="/hibahilmu.jpg"
                      alt="HibahIlmu"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                      }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      3D AI EDTECH PORTAL
                    </span>
                    <h3 className="text-xl font-black mt-1">HibahIlmu.id</h3>
                    <p className="text-xs text-slate-300">Gerakan Berbagi Ilmu Pengetahuan</p>
                  </div>
                </div>

                {/* Kotak Kutipan Mutiara 3D Layer Tengah */}
                <div
                  style={{ transform: "translateZ(55px)" }}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-2.5 backdrop-blur-md shadow-xl"
                >
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" /> AI Socratic &amp; Auto-Grader
                    </span>
                    <span className="text-amber-300 font-black">100% Wakaf Gratis</span>
                  </div>
                  <p className="text-sm font-extrabold italic leading-relaxed text-white">
                    &ldquo;Sebaik-baik manusia adalah yang paling bermanfaat bagi sesama melalui
                    ilmu yang dibagikan.&rdquo;
                  </p>
                </div>

                {/* Bar Bawah 3D Layer */}
                <div
                  style={{ transform: "translateZ(35px)" }}
                  className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-black shadow-lg"
                >
                  <span className="flex items-center gap-1.5">
                    ★ Gerakkan Kursor di Kartu 3D
                  </span>
                  <span className="bg-slate-950 text-white px-2.5 py-1 rounded-lg text-[10px]">
                    3D Interaktif Aktif
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SEKSI BARU: 3 KARTU SHOWCASE TEKNOLOGI 3D INTERAKTIF */}
          <section className="space-y-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                INTERACTIVE 3D LEARNING EXPERIENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Sentuh &amp; Gerakkan Kursor pada Kartu Fitur 3D Kami
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                {
                  id: "3d-1",
                  ikon: <Cpu className="w-7 h-7 text-white" />,
                  gradien: "from-indigo-600 to-violet-700",
                  badge: "AI ENGINE",
                  judul: "AI Quiz Generator & Rubric",
                  deskripsi:
                    "Ubah rangkuman materi menjadi 5 format soal otomatis dan koreksi esai siswa dengan AI Rubric Assistant.",
                },
                {
                  id: "3d-2",
                  ikon: <Layers className="w-7 h-7 text-white" />,
                  gradien: "from-emerald-600 to-teal-700",
                  badge: "5 TIPE KUIS",
                  judul: "Multi-Format Interactive Quiz",
                  deskripsi:
                    "Mendukung Pilihan Ganda, Pilihan Jamak, Benar/Salah, Isian Singkat Fuzzy, dan Mencocokkan Pasangan.",
                },
                {
                  id: "3d-3",
                  ikon: <Globe className="w-7 h-7 text-white" />,
                  gradien: "from-amber-500 to-orange-600",
                  badge: "100% GRATIS",
                  judul: "Wakaf Ilmu Terbuka Nasional",
                  deskripsi:
                    "Tanpa biaya langganan selamanya. Setiap pendidik bisa menghibahkan modul, RPP, dan soal tryout CBT.",
                },
              ].map((item) => {
                const sedangAktif = kartu3DAktif?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onMouseMove={(e) => handleMouseMoveKartu3D(item.id, e)}
                    onMouseLeave={() => setKartu3DAktif(null)}
                    style={{
                      transform: sedangAktif
                        ? `perspective(900px) rotateX(${kartu3DAktif.x}deg) rotateY(${kartu3DAktif.y}deg) translateZ(10px)`
                        : "perspective(900px) rotateX(0deg) rotateY(0deg)",
                      transition: "transform 0.15s ease-out",
                    }}
                    className={`rounded-3xl bg-gradient-to-br ${item.gradien} text-white p-7 shadow-xl border border-white/15 space-y-4 cursor-pointer select-none`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                        {item.ikon}
                      </div>
                      <span className="text-[10px] font-black uppercase bg-black/25 px-3 py-1 rounded-full">
                        {item.badge} • 3D CARD
                      </span>
                    </div>
                    <h3 className="text-xl font-black">{item.judul}</h3>
                    <p className="text-xs text-white/90 leading-relaxed">{item.deskripsi}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BANNER PANGGILAN KOLABORASI PENGAJAR & PRAKTISI */}
          <section className="rounded-[2.2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
                <HeartHandshake className="w-3.5 h-3.5" /> Panggilan Kolaborasi Pengajar &amp; Praktisi
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                Punya Catatan Kuliah, Modul Mengajar, atau Bank Soal? Mari Hibahkan Ilmu Anda!
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Gunakan <b>AI Quiz Generator</b> kami untuk mengubah rangkuman materi Anda menjadi
                kuis interaktif secara instan. Nama, gelar, dan CV Anda tercatat resmi di setiap
                modul.
              </p>
            </div>
            <button
              onClick={() => onBukaAuthAtauDashboard("guru")}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-7 py-4 rounded-2xl text-sm shadow-xl shrink-0 cursor-pointer transition"
            >
              Mulai Menyumbang Materi Sekarang →
            </button>
          </section>

          {/* SEKSI MANIFESTO 100% GRATIS & KATA-KATA MUTIARA PENDIDIKAN */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-8 sm:p-10 border border-emerald-200/80 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-black px-3.5 py-1 rounded-full uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Komitmen Wakaf Pendidikan
                  Abadi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  100% Gratis Tanpa Biaya Langganan, Dari Rakyat Untuk Bangsa
                </h2>
              </div>
              <button
                onClick={() => setModeVisualSkillTree(!modeVisualSkillTree)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-indigo-600" />
                {modeVisualSkillTree
                  ? "Tutup Peta Skill Tree"
                  : "Buka Peta Pohon Keterampilan (Skill Tree)"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <Quote className="w-6 h-6 text-emerald-600" />
                <p className="text-sm font-bold italic text-slate-800">
                  &ldquo;Harta akan berkurang apabila dibelanjakan, sedangkan ilmu akan terus
                  bertambah apabila dibagikan dan diajarkan.&rdquo;
                </p>
                <div className="text-xs font-black text-emerald-800 pt-1">
                  — Filosofi Wakaf Ilmu HibahIlmu.id
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <Quote className="w-6 h-6 text-indigo-600" />
                <p className="text-sm font-bold italic text-slate-800">
                  &ldquo;Pendidikan adalah senjata paling mematikan di dunia, karena dengan
                  pendidikan Anda dapat mengubah dunia tanpa sekat biaya.&rdquo;
                </p>
                <div className="text-xs font-black text-indigo-800 pt-1">
                  — Akses Terbuka 100% Gratis Selamanya
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <Quote className="w-6 h-6 text-amber-600" />
                <p className="text-sm font-bold italic text-slate-800">
                  &ldquo;Setiap modul, rangkuman, dan soal yang disumbangkan oleh guru relawan adalah
                  amal jariyah yang mengalir bagi generasi masa depan.&rdquo;
                </p>
                <div className="text-xs font-black text-amber-900 pt-1">
                  — Kolaborasi Pendidik &amp; Praktisi Indonesia
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SKILL TREE (PETA JALUR BELAJAR VISUAL) */}
      {modeVisualSkillTree && !jenjangAktif && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-200 shadow-xl space-y-6">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
              Interactive Learning Roadmap
            </span>
            <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-indigo-600" /> Peta Pohon Keterampilan (Skill Tree)
            </h2>
            <p className="text-sm text-slate-500">
              Selesaikan modul dasar (Hijau) untuk membuka kunci modul tingkat lanjut yang memiliki
              prasyarat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {semuaKelasFlat.map((modul, i) => {
              const sudahLulus = materiSelesai.includes(modul.id);
              const terkunciPrasyarat =
                modul.prasyaratKelasId && !materiSelesai.includes(modul.prasyaratKelasId);

              return (
                <div
                  key={modul.id}
                  className={`p-6 rounded-3xl border-2 relative flex flex-col justify-between transition ${
                    sudahLulus
                      ? "bg-emerald-50/70 border-emerald-500"
                      : terkunciPrasyarat
                      ? "bg-slate-100 border-slate-300 opacity-75"
                      : "bg-white border-indigo-200 hover:border-indigo-500"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-black uppercase mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white">
                        Node #{i + 1} • {modul.level}
                      </span>
                      {sudahLulus ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Tuntas
                        </span>
                      ) : terkunciPrasyarat ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Terkunci
                        </span>
                      ) : (
                        <span className="text-indigo-600">Terbuka</span>
                      )}
                    </div>
                    <h3 className="font-black text-lg text-slate-900">{modul.judul}</h3>
                    <p className="text-xs text-slate-500 mt-1">{modul.namaJenjang}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t">
                    {terkunciPrasyarat ? (
                      <div className="text-xs font-bold text-rose-700">
                        🔒 Wajib selesaikan modul prasyarat terlebih dahulu.
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!userLogin) {
                            onBukaAuthAtauDashboard("siswa");
                          } else {
                            setKelasAktif(modul);
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
                      >
                        {userLogin ? "Pelajari Node Ini →" : "Login untuk Belajar"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KATALOG JENJANG PENDIDIKAN DENGAN EFEK HOVER 3D TILT */}
      {!jenjangAktif ? (
        <section id="katalog-jenjang" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                KURIKULUM TERBUKA NASIONAL (3D INTERACTIVE CARDS)
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mt-1">
                Pilih Jenjang Pendidikan &amp; Ruang Kelas
              </h2>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
                placeholder="Cari topik pelajaran..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daftarJenjang.map((jenjang) => {
              const sedang3D = kartu3DAktif?.id === jenjang.id;
              return (
                <div
                  key={jenjang.id}
                  onMouseMove={(e) => handleMouseMoveKartu3D(jenjang.id, e)}
                  onMouseLeave={() => setKartu3DAktif(null)}
                  onClick={() => {
                    setJenjangAktif(jenjang);
                    setSubJenjangAktif("semua");
                  }}
                  style={{
                    transform: sedang3D
                      ? `perspective(900px) rotateX(${kartu3DAktif.x}deg) rotateY(${kartu3DAktif.y}deg) translateY(-4px)`
                      : "perspective(900px) rotateX(0deg) rotateY(0deg)",
                    transition: "transform 0.15s ease-out",
                  }}
                  className="group bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-2.5 w-full bg-gradient-to-r ${jenjang.gradien}`} />
                    <div className="p-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${jenjang.gradien} text-white flex items-center justify-center shadow-md`}
                        >
                          {renderIkonJenjang(jenjang.ikonNama)}
                        </div>
                        <span
                          className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${jenjang.badge}`}
                        >
                          {jenjang.subJenjang.length} TINGKAT KELAS
                        </span>
                      </div>
                      <h3 className="text-xl font-black group-hover:text-emerald-600 transition">
                        {jenjang.nama}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{jenjang.deskripsi}</p>
                    </div>
                  </div>
                  <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-600">
                    <span>{jenjang.kelas.length} Modul Terverifikasi</span>
                    <span className="text-emerald-600">Buka Kelas 3D →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="space-y-8">
          <button
            onClick={() => setJenjangAktif(null)}
            className="inline-flex items-center gap-2 text-base font-extrabold text-emerald-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Semua Jenjang
          </button>

          <div
            className={`rounded-3xl bg-gradient-to-r ${jenjangAktif.gradien} text-white p-8 shadow-lg`}
          >
            <span className="text-xs font-extrabold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
              {jenjangAktif.tagline}
            </span>
            <h1 className="text-3xl font-black mt-3">{jenjangAktif.nama}</h1>
            <p className="text-white/90 text-base mt-1">{jenjangAktif.deskripsi}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubJenjangAktif("semua")}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  subJenjangAktif === "semua"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 border"
                }`}
              >
                Semua Tingkat ({jenjangAktif.kelas.length})
              </button>
              {jenjangAktif.subJenjang.map((sj) => (
                <button
                  key={sj.id}
                  onClick={() => setSubJenjangAktif(sj.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    subJenjangAktif === sj.id
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-700 border"
                  }`}
                >
                  {sj.nama}
                </button>
              ))}
            </div>

            {userLogin && (
              <label className="flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-xl border cursor-pointer">
                <input
                  type="checkbox"
                  checked={hanyaMateriDiikuti}
                  onChange={(e) => setHanyaMateriDiikuti(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>Tampilkan Hanya Kelas Minat/Akses Saya</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jenjangAktif.kelas
              .filter((k) => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif)
              .filter((k) => {
                if (!hanyaMateriDiikuti || !userLogin) return true;
                const daftarAkses =
                  userLogin.role === "siswa"
                    ? userLogin.minatSubJenjang || []
                    : userLogin.aksesMengajar || [];
                return daftarAkses.includes("ALL") || daftarAkses.includes(k.subJenjangId);
              })
              .map((item) => {
                const terkunci =
                  item.prasyaratKelasId && !materiSelesai.includes(item.prasyaratKelasId);
                return (
                  <div
                    key={item.id}
                    className="bg-white text-slate-800 rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold px-3 py-1 rounded-md bg-slate-100">
                          Level: {item.level} • {item.durasi}
                        </span>
                        {materiSelesai.includes(item.id) && (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            ✓ Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black">{item.judul}</h3>
                      <div className="text-xs text-slate-500">
                        Oleh: <b>{item.pembuatNama}</b>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">
                        {item.flashcards?.length || 0} Flashcards • {item.daftarKuis.length} Kuis
                      </span>
                      {terkunci ? (
                        <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Selesaikan Prasyarat
                        </span>
                      ) : userLogin ? (
                        <button
                          onClick={() => setKelasAktif(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Mulai Belajar
                        </button>
                      ) : (
                        <button
                          onClick={() => onBukaAuthAtauDashboard("siswa")}
                          className="bg-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                        >
                          🔒 Login untuk Membuka
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};