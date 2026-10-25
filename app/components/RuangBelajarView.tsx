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
  RotateCcw,
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
  Maximize2,
  ClipboardCheck,
  Send,
  Bug,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import {
  JenjangItem,
  KelasItem,
  AkunPengguna,
  PesanChatMateri,
  TugasItem,
  PengumpulanTugas,
  KonfigurasiWeb,
} from "../types";
import { bersihkanTagHtml, KONFIGURASI_WEB_AWAL } from "../mockData";
import { CourseraNetAcadModal } from "./CourseraNetAcadModal";

export interface RuangBelajarProps {
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
  skorKuisPerModul: { [modulId: string]: number };
  simpanSkorModul: (modulId: string, skor: number, lulusKkm: boolean) => void;
  daftarTugas: TugasItem[];
  daftarPengumpulan: PengumpulanTugas[];
  onKumpulTugasModul: (tugasId: string, jawabanTeks: string) => void;
  tambahXP: (xp: number) => void;
  chatPerMateri: { [materiId: string]: PesanChatMateri[] };
  onKirimChatMateri: (pesan: string) => void;
  onKirimUlasanMateri: (bintang: number, komentar: string) => void;
  onBukaAuthAtauDashboard: (rolePilih?: "siswa" | "guru") => void;
  konfigurasiWeb?: KonfigurasiWeb;
  onBukaMenuLain?: (menu: string) => void;
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
  skorKuisPerModul,
  simpanSkorModul,
  daftarTugas,
  daftarPengumpulan,
  onKumpulTugasModul,
  tambahXP,
  chatPerMateri,
  onKirimChatMateri,
  onKirimUlasanMateri,
  onBukaAuthAtauDashboard,
  konfigurasiWeb = KONFIGURASI_WEB_AWAL,
  onBukaMenuLain,
}) => {
  const [rotasi3D, setRotasi3D] = useState({ x: 8, y: -12 });
  const [kartu3DAktif, setKartu3DAktif] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const [kataKunci, setKataKunci] = useState("");
  const [modeVisualSkillTree, setModeVisualSkillTree] = useState(false);

  const [modulPopupAktif, setModulPopupAktif] = useState<KelasItem | null>(null);

  const [sedangBicaraTts, setSedangBicaraTts] = useState(false);

  const [indeksFlashcard, setIndeksFlashcard] = useState(0);
  const [balikKartu, setBalikKartu] = useState(false);
  const [penguasaanFlashcard, setPenguasaanFlashcard] = useState<{
    [id: string]: "ulangi" | "cukup" | "mahir";
  }>({});

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

  const [inputJawabanTugasModul, setInputJawabanTugasModul] = useState<{
    [tugasId: string]: string;
  }>({});

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

  const semuaKelasFlat = daftarJenjang.flatMap((j) =>
    j.kelas.map((k) => ({ ...k, namaJenjang: j.nama }))
  );

  const cekStatusPrasyaratModul = (modul: KelasItem) => {
    if (!modul.prasyaratKelasId) {
      return {
        terkunci: false,
        alasan: "",
        modulPrasyarat: null,
        syaratNilai: 0,
        skorUserSaatIni: 0,
      };
    }
    const modulPrasyarat = semuaKelasFlat.find((m) => m.id === modul.prasyaratKelasId) || null;
    const syaratNilai = modul.syaratSkorMinimal || modulPrasyarat?.syaratSkorMinimal || 75;
    const skorUserSaatIni = skorKuisPerModul[modul.prasyaratKelasId] || 0;
    const sudahSelesai = materiSelesai.includes(modul.prasyaratKelasId);

    const lulusSyarat = sudahSelesai && skorUserSaatIni >= syaratNilai;
    return {
      terkunci: !lulusSyarat,
      modulPrasyarat,
      syaratNilai,
      skorUserSaatIni,
      alasan: `Wajib lulus "${
        modulPrasyarat?.judul || "Modul Sebelumnya"
      }" dengan skor kuis minimal ${syaratNilai}/100 (Skor Anda saat ini: ${skorUserSaatIni}/100).`,
    };
  };

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -15;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15;
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

  const handleResetUlangiKuisHalaman = (modul: KelasItem) => {
    const ids = modul.daftarKuis.map((k) => k.id);
    const baruStatus = { ...statusKuisTerjawab };
    const baruPesan = { ...pesanEvaluasiKuis };
    ids.forEach((id) => {
      delete baruStatus[id];
      delete baruPesan[id];
    });
    setStatusKuisTerjawab(baruStatus);
    setPesanEvaluasiKuis(baruPesan);
    setJawabanPilihanTunggal({});
    setJawabanPilihanJamak({});
    setJawabanIsianTeks({});
    setJawabanCocok({});
  };

  if (kelasAktif && userLogin) {
    const flashcards = kelasAktif.flashcards || [];
    const kartuSaatIni = flashcards[indeksFlashcard];
    const kkmModulIni = kelasAktif.syaratSkorMinimal || 75;
    const skorTerbaikModulIni = skorKuisPerModul[kelasAktif.id] || 0;

    const tugasModulTerkait: TugasItem[] = [
      ...(kelasAktif.daftarTugasModul || []),
      ...daftarTugas.filter(
        (t) =>
          (t.modulId === kelasAktif.id || t.subJenjangId === kelasAktif.subJenjangId) &&
          !(kelasAktif.daftarTugasModul || []).some((m) => m.id === t.id)
      ),
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {modulPopupAktif && (
          <CourseraNetAcadModal
            modul={modulPopupAktif}
            userLogin={userLogin}
            skorTertinggiSebelumnya={skorKuisPerModul[modulPopupAktif.id] || 0}
            daftarTugasGlobal={daftarTugas}
            daftarPengumpulan={daftarPengumpulan}
            onKumpulTugasModul={onKumpulTugasModul}
            onTutup={() => setModulPopupAktif(null)}
            onSimpanSkorModul={simpanSkorModul}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setKelasAktif(null)}
            className="inline-flex items-center gap-2 text-base font-extrabold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Modul
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setModulPopupAktif(kelasAktif)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" /> Buka Pop-up Per Bab (Mode Coursera / NetAcad)
            </button>

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
                  <Volume2 className="w-4 h-4" /> Dengarkan Materi
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

        <div className="p-4 rounded-2xl bg-indigo-950 text-white flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs sm:text-sm">
            <b>Target Kelulusan Modul (Passing Grade): Minimal {kkmModulIni}/100</b> • Skor Terbaik
            Anda Saat Ini:{" "}
            <span
              className={`font-black px-2 py-0.5 rounded ${
                skorTerbaikModulIni >= kkmModulIni
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-amber-400 text-slate-950"
              }`}
            >
              {skorTerbaikModulIni}/100
            </span>
          </div>
          <button
            onClick={() => handleResetUlangiKuisHalaman(kelasAktif)}
            className="bg-white/15 hover:bg-white/25 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulangi Semua Kuis Modul Ini
          </button>
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
              className="prose prose-slate max-w-none leading-relaxed text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
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

        {/* KUIS EVALUASI */}
        <div className="bg-white text-slate-800 rounded-3xl p-8 border border-slate-200/90 space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Evaluasi Pemahaman Materi (
              {kelasAktif.daftarKuis.length} Soal Multi-Format)
            </h3>
            <button
              onClick={() => setModulPopupAktif(kelasAktif)}
              className="text-xs font-black text-indigo-600 underline cursor-pointer"
            >
              Kerjakan dalam Mode Ujian Pop-up Coursera/NetAcad →
            </button>
          </div>

          <div className="space-y-6">
            {kelasAktif.daftarKuis.map((kuis, idx) => {
              const sudahBenar = statusKuisTerjawab[kuis.id];
              const infoEval = pesanEvaluasiKuis[kuis.id];

              const daftarPasanganValid =
                kuis.pasangan && kuis.pasangan.length > 0
                  ? kuis.pasangan
                  : [
                      { kiri: "Pernyataan 1", kanan: "Pasangan A" },
                      { kiri: "Pernyataan 2", kanan: "Pasangan B" },
                    ];

              const opsiKananTeracak = [...daftarPasanganValid]
                .map((p) => p.kanan)
                .sort((a, b) => a.localeCompare(b));

              const hitungSkorOtomatisSetelahJawab = (statusBaru: { [id: string]: boolean }) => {
                const total = kelasAktif.daftarKuis.length || 1;
                const benar = kelasAktif.daftarKuis.filter((k) => statusBaru[k.id]).length;
                const nilai = Math.round((benar / total) * 100);
                simpanSkorModul(kelasAktif.id, nilai, nilai >= kkmModulIni);
              };

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
                                const stBaru = { ...statusKuisTerjawab, [kuis.id]: true };
                                setStatusKuisTerjawab(stBaru);
                                hitungSkorOtomatisSetelahJawab(stBaru);
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
                                    teks: "✕ Jawaban belum tepat. Silakan pilih opsi lainnya!",
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

                  {kuis.tipe === "pilihan_jamak" && (
                    <div className="space-y-2.5">
                      {kuis.opsi.map((teksOpsi, opsiIdx) => {
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
                            const stBaru = { ...statusKuisTerjawab, [kuis.id]: true };
                            setStatusKuisTerjawab(stBaru);
                            hitungSkorOtomatisSetelahJawab(stBaru);
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
                                teks: "✕ Kombinasi jawaban belum tepat.",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Verifikasi Pilihan Jamak
                      </button>
                    </div>
                  )}

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
                            const stBaru = { ...statusKuisTerjawab, [kuis.id]: true };
                            setStatusKuisTerjawab(stBaru);
                            hitungSkorOtomatisSetelahJawab(stBaru);
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
                                teks: "✕ Jawaban isian belum sesuai.",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs cursor-pointer"
                      >
                        Cek Jawaban Isian
                      </button>
                    </div>
                  )}

                  {kuis.tipe === "mencocokkan" && (
                    <div className="space-y-3">
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
                            const stBaru = { ...statusKuisTerjawab, [kuis.id]: true };
                            setStatusKuisTerjawab(stBaru);
                            hitungSkorOtomatisSetelahJawab(stBaru);
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
                                teks: "✕ Masih ada pasangan yang belum cocok.",
                              },
                            });
                          }
                        }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Periksa Semua Pasangan
                      </button>
                    </div>
                  )}

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

        {tugasModulTerkait.length > 0 && (
          <div className="bg-white text-slate-800 rounded-3xl p-8 border-2 border-emerald-200 space-y-5 shadow-xs">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h3 className="font-black text-lg flex items-center gap-2 text-emerald-950">
                <ClipboardCheck className="w-6 h-6 text-emerald-600" /> Tugas Kelas &amp; Proyek
                Mandiri Modul Ini ({tugasModulTerkait.length} Tugas)
              </h3>
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Dinilai dengan AI Rubric Scoring
              </span>
            </div>

            <div className="space-y-4">
              {tugasModulTerkait.map((tgs) => {
                const kirimanSaya = daftarPengumpulan.find(
                  (p) => p.tugasId === tgs.id && p.siswaId === userLogin.id
                );
                return (
                  <div
                    key={tgs.id}
                    className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 text-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h4 className="font-black text-base text-slate-900">{tgs.judul}</h4>
                      <span className="text-xs font-bold text-slate-500">
                        Tenggat: {tgs.deadline}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{tgs.instruksi}</p>

                    {kirimanSaya ? (
                      <div className="p-4 bg-white border border-emerald-300 rounded-xl space-y-1 text-xs">
                        <div className="font-black text-emerald-800">
                          ✓ Tugas Telah Dikumpulkan ({kirimanSaya.waktuKumpul})
                        </div>
                        <p className="text-slate-600">{kirimanSaya.jawabanTeksAtauLink}</p>
                        <div className="font-black text-indigo-900 pt-1">
                          Nilai:{" "}
                          {kirimanSaya.nilai !== undefined
                            ? `${kirimanSaya.nilai}/100 — ${kirimanSaya.feedbackGuru || "Dinilai"}`
                            : "Menunggu Verifikasi Nilai Guru"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <input
                          type="text"
                          value={inputJawabanTugasModul[tgs.id] || ""}
                          onChange={(e) =>
                            setInputJawabanTugasModul({
                              ...inputJawabanTugasModul,
                              [tgs.id]: e.target.value,
                            })
                          }
                          placeholder="Ketik uraian jawaban tugas atau link Google Drive / GitHub proyek Anda..."
                          className="flex-1 p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const isi = (inputJawabanTugasModul[tgs.id] || "").trim();
                            if (!isi) return;
                            onKumpulTugasModul(tgs.id, isi);
                            setInputJawabanTugasModul({ ...inputJawabanTugasModul, [tgs.id]: "" });
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Send className="w-4 h-4" /> Kirim Tugas (+40 XP)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

  return (
    <div className="space-y-14">
      {modulPopupAktif && userLogin && (
        <CourseraNetAcadModal
          modul={modulPopupAktif}
          userLogin={userLogin}
          skorTertinggiSebelumnya={skorKuisPerModul[modulPopupAktif.id] || 0}
          daftarTugasGlobal={daftarTugas}
          daftarPengumpulan={daftarPengumpulan}
          onKumpulTugasModul={onKumpulTugasModul}
          onTutup={() => setModulPopupAktif(null)}
          onSimpanSkorModul={simpanSkorModul}
        />
      )}

      {!jenjangAktif && (
        <>
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
                Dilengkapi <b>Rantai Modul Bersyarat (Passing Grade)</b> ala{" "}
                <b>Coursera &amp; Cisco NetAcad</b>, <b>AI Tutor Socratic</b>,{" "}
                <b>AI Quiz Generator</b>, hingga <b>CBT Fullscreen Anti-Cheat</b> untuk TK, SD, SMP,
                SMA, Kuliah, TPA &amp; TOEFL.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("katalog-jenjang");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-4 rounded-2xl text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer transition"
                >
                  <Sparkles className="w-4 h-4" /> Jelajahi Ruang Kelas
                </button>

                <button
                  onClick={() => onBukaAuthAtauDashboard("guru")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-4 rounded-2xl text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition"
                >
                  <HeartHandshake className="w-4 h-4" /> Ikut Menyumbang Ilmu
                </button>

                {onBukaMenuLain && (
                  <>
                    <button
                      onClick={() => onBukaMenuLain("donasi")}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-md"
                    >
                      💝 Wakaf &amp; Donasi (DANA/Bank)
                    </button>
                    <button
                      onClick={() => onBukaMenuLain("lapor_bug")}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black px-5 py-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
                    >
                      <Bug className="w-4 h-4 text-amber-400" /> Lapor Bug / Masukan
                    </button>
                  </>
                )}
              </div>
            </div>

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
                    &ldquo;{konfigurasiWeb.kutipanKartu3D}&rdquo;
                  </p>
                </div>

                <div
                  style={{ transform: "translateZ(35px)" }}
                  className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-black shadow-lg"
                >
                  <span>★ Gerakkan Kursor di Kartu 3D</span>
                  <span className="bg-slate-950 text-white px-2.5 py-1 rounded-lg text-[10px]">
                    3D Interaktif Aktif
                  </span>
                </div>
              </div>
            </div>
          </section>

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
                    "Ubah rangkuman materi menjadi 5 format soal otomatis dan koreksi tugas modul siswa dengan AI Rubric Assistant.",
                },
                {
                  id: "3d-2",
                  ikon: <Layers className="w-7 h-7 text-white" />,
                  gradien: "from-emerald-600 to-teal-700",
                  badge: "COURSERA / NETACAD",
                  judul: "Pop-up Bab & Tugas Bersyarat",
                  deskripsi:
                    "Baca bab secara berurutan, kumpulkan tugas proyek di dalam modul, dan ulangi kuis hingga lulus KKM.",
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

          <section className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-8 sm:p-10 border border-emerald-200/80 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-black px-3.5 py-1 rounded-full uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Komitmen Wakaf Pendidikan
                  Abadi &amp; Kata-Kata Mutiara
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {konfigurasiWeb.headlineGratis}
                </h2>
              </div>
              <button
                onClick={() => setModeVisualSkillTree(!modeVisualSkillTree)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-3.5 rounded-2xl text-xs flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <GitBranch className="w-4 h-4" />
                {modeVisualSkillTree
                  ? "Tutup Peta Rantai Modul"
                  : "Buka Peta Rantai Modul Bersyarat (Skill Tree)"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {konfigurasiWeb.daftarKataMutiara.map((km, idx) => {
                const gayaKotak =
                  idx % 3 === 0
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                    : idx % 3 === 1
                    ? "bg-indigo-50/70 border-indigo-200 text-indigo-800"
                    : "bg-amber-50/70 border-amber-200 text-amber-900";
                return (
                  <div
                    key={km.id}
                    className={`p-5 rounded-2xl border space-y-2 ${gayaKotak}`}
                  >
                    <Quote className="w-6 h-6 opacity-80" />
                    <p className="text-sm font-bold italic text-slate-800">
                      &ldquo;{km.kutipan}&rdquo;
                    </p>
                    <div className="text-xs font-black pt-1">— {km.tokohAtauSumber}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {modeVisualSkillTree && !jenjangAktif && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-200 shadow-xl space-y-6">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
              Prerequisite Chaining &amp; Passing Grade
            </span>
            <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-indigo-600" /> Peta Rantai Modul Bersyarat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {semuaKelasFlat.map((modul, i) => {
              const infoPrasyarat = cekStatusPrasyaratModul(modul);
              const skorSaya = skorKuisPerModul[modul.id] || 0;
              const kkmModul = modul.syaratSkorMinimal || 75;
              const sudahLulusKkm = materiSelesai.includes(modul.id) && skorSaya >= kkmModul;

              return (
                <div
                  key={modul.id}
                  className={`p-6 rounded-3xl border-2 relative flex flex-col justify-between transition ${
                    sudahLulusKkm
                      ? "bg-emerald-50/70 border-emerald-500"
                      : infoPrasyarat.terkunci
                      ? "bg-slate-100 border-slate-300 opacity-85"
                      : "bg-white border-indigo-200 hover:border-indigo-500"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-black uppercase">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white">
                        Modul #{i + 1} • {modul.level}
                      </span>
                      {sudahLulusKkm ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Lulus ({skorSaya}/100)
                        </span>
                      ) : infoPrasyarat.terkunci ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Terkunci Syarat
                        </span>
                      ) : (
                        <span className="text-indigo-600">Terbuka (KKM: {kkmModul})</span>
                      )}
                    </div>

                    <h3 className="font-black text-lg text-slate-900">{modul.judul}</h3>
                    <p className="text-xs text-slate-500">
                      {modul.namaJenjang} • Syarat Kelulusan: <b>Min. Skor {kkmModul}/100</b>
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t space-y-2">
                    {infoPrasyarat.terkunci ? (
                      <div className="text-xs font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                        🔒 {infoPrasyarat.alasan}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!userLogin) {
                            onBukaAuthAtauDashboard("siswa");
                          } else {
                            setModulPopupAktif(modul);
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
                      >
                        {userLogin
                          ? "🖥️ Buka Pop-up Per Bab (Coursera/NetAcad)"
                          : "Login untuk Belajar"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                    <span className="text-emerald-600">Buka Kelas →</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jenjangAktif.kelas
              .filter((k) => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif)
              .map((item) => {
                const infoPrasyarat = cekStatusPrasyaratModul(item);
                const kkm = item.syaratSkorMinimal || 75;
                const skorUser = skorKuisPerModul[item.id] || 0;

                return (
                  <div
                    key={item.id}
                    className={`bg-white text-slate-800 rounded-3xl p-7 border-2 shadow-xs flex flex-col justify-between ${
                      infoPrasyarat.terkunci ? "border-slate-200 opacity-90" : "border-slate-200/90"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-xs font-extrabold px-3 py-1 rounded-md bg-slate-100">
                          Level: {item.level} • Syarat Lulus: {kkm}/100
                        </span>
                        {skorUser > 0 && (
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              skorUser >= kkm
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            Skor Anda: {skorUser}/100 {skorUser >= kkm ? "✓ Lulus" : "(Belum KKM)"}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black">{item.judul}</h3>
                      <div className="text-xs text-slate-500">
                        Oleh: <b>{item.pembuatNama}</b> • {item.daftarBab?.length || 2} Bab Interaktif
                      </div>

                      {infoPrasyarat.modulPrasyarat && (
                        <div
                          className={`p-3 rounded-xl text-xs font-bold border ${
                            infoPrasyarat.terkunci
                              ? "bg-rose-50 border-rose-200 text-rose-800"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                          }`}
                        >
                          {infoPrasyarat.terkunci ? (
                            <>🔒 {infoPrasyarat.alasan}</>
                          ) : (
                            <>
                              ✓ Syarat Terpenuhi: Lulus &ldquo;{infoPrasyarat.modulPrasyarat.judul}
                              &rdquo; ({infoPrasyarat.skorUserSaatIni}/100)
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t flex flex-wrap justify-between items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        {item.daftarKuis.length} Kuis • {(item.daftarTugasModul || []).length} Tugas
                      </span>

                      {infoPrasyarat.terkunci ? (
                        <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Selesaikan Prasyarat &amp; Nilai{" "}
                          {infoPrasyarat.syaratNilai}
                        </span>
                      ) : userLogin ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setModulPopupAktif(item)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Maximize2 className="w-3.5 h-3.5" /> Pop-up Per Bab
                          </button>
                          <button
                            onClick={() => setKelasAktif(item)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" /> Halaman Penuh
                          </button>
                        </div>
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