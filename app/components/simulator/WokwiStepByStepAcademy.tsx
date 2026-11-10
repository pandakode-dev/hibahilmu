"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Sparkles,
  Cpu,
  Code2,
  AlertCircle,
  RotateCcw,
  Award,
  Lightbulb,
} from "lucide-react";
import {
  KURIKULUM_8_LEVEL_IOT,
  LessonStepIoT,
} from "./wokwiCurriculumData";

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const materiAktif: LessonStepIoT = KURIKULUM_8_LEVEL_IOT[indeksLevel];

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    KURIKULUM_8_LEVEL_IOT[0].kodeTemplateAwal
  );
  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "kurang_tepat" | "lulus"
  >("belum");
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// Ketik program sesuai petunjuk di kiri, lalu klik 'Periksa & Jalankan Program'..."
  );

  const pindahKeLevel = (idxBaru: number) => {
    const target = KURIKULUM_8_LEVEL_IOT[idxBaru];
    if (!target) return;
    setIndeksLevel(idxBaru);
    setKodeKetikanUser(target.kodeTemplateAwal);
    setStatusVerifikasi("belum");
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Siap mengerjakan ${target.badgeLevel}: ${target.judulMateri}`
    );
  };

  const periksaDanJalankanKetikan = () => {
    const kataKurang = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeKetikanUser.includes(kw)
    );

    if (kataKurang.length > 0) {
      setStatusVerifikasi("kurang_tepat");
      setPesanFeedback(
        `Masih ada perintah penting yang belum diketik: ${kataKurang
          .map((k) => `"${k}"`)
          .join(", ")}. Cek kembali petunjuk langkah di sebelah kiri atau klik tombol 'Isi Contoh Kode Benar' jika butuh bantuan!`
      );
      setOutputSerialSimulasi(
        `[COMPILER ERROR] Baris program belum lengkap.\nPastikan Anda sudah mengetik: ${kataKurang.join(
          ", "
        )}`
      );
      return;
    }

    setStatusVerifikasi("lulus");
    setPesanFeedback(
      `Luar Biasa! Kode program Level ${materiAktif.level} yang kamu ketik 100% BENAR dan berhasil dikompilasi (+${materiAktif.xpReward} XP)!`
    );
    setOutputSerialSimulasi(materiAktif.simulasiOutputJikaBenar);

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  const isiOtomatisKodeBenar = () => {
    setKodeKetikanUser(materiAktif.kodeTargetBenar);
    setStatusVerifikasi("belum");
    setPesanFeedback(
      "Kode lengkap telah dimasukkan ke editor. Pelajari setiap barisnya, lalu klik tombol 'Periksa & Jalankan Program'!"
    );
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-6">
      {/* HEADER KURIKULUM BERTAHAP */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
            🎓 AKADEMI BELAJAR IOT BERTAHAP (MULAI DARI DASAR ➔ MAHIR 10-NODE)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            Ikuti Instruksi Komponen, Ketik Programnya, &amp; Lanjut ke Materi Berikutnya!
          </h2>
          <p className="text-xs text-slate-300">
            Progres Belajar Kamu:{" "}
            <strong className="text-amber-300">
              {levelSelesaiSet.size} dari {KURIKULUM_8_LEVEL_IOT.length} Materi Selesai
            </strong>
          </p>
        </div>

        {/* Deretan Nomor Level 1 s.d. 8 */}
        <div className="flex flex-wrap gap-1.5">
          {KURIKULUM_8_LEVEL_IOT.map((item, idx) => {
            const sedangDibuka = idx === indeksLevel;
            const sudahLulus = levelSelesaiSet.has(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => pindahKeLevel(idx)}
                className={`px-3 py-2 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-1 border ${
                  sedangDibuka
                    ? "bg-amber-400 text-slate-950 border-white scale-105 shadow-lg"
                    : sudahLulus
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                }`}
              >
                {sudahLulus && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Lv.{item.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ISI MATERI LEVEL AKTIF (KIRI: PANDUAN KOMPONEN & INSTRUKSI KETIK, KANAN: EDITOR LATIHAN KETIK) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: KOMPONEN APA YANG DIMASUKKAN & APA YANG HARUS DIKETIK */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                {materiAktif.badgeLevel}
              </span>
              <span className="text-xs font-black text-emerald-400">
                Hadiah: +{materiAktif.xpReward} XP
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              {materiAktif.judulMateri}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              <strong className="text-amber-300">🎯 Tujuan Materi Ini:</strong>{" "}
              {materiAktif.tujuanBelajar}
            </p>

            {/* Langkah 1: Masukkan Komponen Apa Saja & Ke Pin Mana */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Langkah 1 — Masukkan Komponen &amp; Sambungkan Pin:
              </div>
              <div className="space-y-2">
                {materiAktif.komponenDimasukkan.map((komp, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-sky-500/30 text-xs space-y-0.5"
                  >
                    <div className="font-black text-white">
                      🔌 {komp.namaKomponen}
                    </div>
                    <div className="text-amber-300 font-mono text-[11px]">
                      Pasang ke: {komp.pasangKePin}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Fungsi: {komp.fungsiSingkat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Langkah 2: Penjelasan Dasar & Apa yang Harus Diketik */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Langkah 2 — Ikuti &amp; Ketik Baris Program Ini di Kanan:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {materiAktif.penjelasanTeoriSingkat}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-white bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i} className="leading-relaxed font-medium">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>

            {/* Kamus Arti Setiap Baris Kode */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Arti Setiap Perintah Kode C++ (Agar Kamu Paham):
              </div>
              <div className="space-y-1.5">
                {materiAktif.penjelasanBarisKode.map((baris, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <code className="text-emerald-400 font-bold font-mono block">
                      {baris.potonganKode}
                    </code>
                    <span className="text-slate-300 text-[11px]">
                      ➔ {baris.artiPenjelasan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: AREA LATIHAN KETIK KODE + TOMBOL PERIKSA & LANJUT KE PROGRAM BERIKUTNYA */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
              <span className="font-mono text-xs font-black text-amber-300">
                ✍️ Editor Latihan Ketik — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isiOtomatisKodeBenar}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Isi Contoh Kode Benar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setKodeKetikanUser(materiAktif.kodeTemplateAwal)
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <textarea
              rows={13}
              value={kodeKetikanUser}
              onChange={(e) => setKodeKetikanUser(e.target.value)}
              spellCheck={false}
              className="w-full p-4 bg-black text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none"
            />

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={periksaDanJalankanKetikan}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa &amp; Jalankan Program Saya
              </button>

              {indeksLevel < KURIKULUM_8_LEVEL_IOT.length - 1 ? (
                <button
                  type="button"
                  onClick={() => pindahKeLevel(indeksLevel + 1)}
                  className={`py-3 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                    statusVerifikasi === "lulus"
                      ? "bg-amber-400 text-slate-950 shadow-xl animate-bounce"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  <span>2. Lanjut ke Materi Berikutnya (Lv.{materiAktif.level + 1})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onBukaSimulator10Node) onBukaSimulator10Node();
                  }}
                  className="py-3 px-5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xl"
                >
                  <Award className="w-4 h-4" /> Buka Simulator 10-Node Multi-Hop ➔
                </button>
              )}
            </div>
          </div>

          {/* Kotak Feedback Hasil Pemeriksaan Kode */}
          {statusVerifikasi !== "belum" && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs font-bold flex items-start gap-2.5 ${
                statusVerifikasi === "lulus"
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-200"
                  : "bg-rose-950/90 border-rose-500 text-rose-200"
              }`}
            >
              {statusVerifikasi === "lulus" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div>{pesanFeedback}</div>
                {statusVerifikasi === "lulus" && (
                  <div className="text-amber-300">
                    💡 <strong>Tantangan Eksperimen:</strong>{" "}
                    {materiAktif.tantanganModifikasi}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layar Output Serial Monitor Hasil Simulasi */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-black text-amber-400 font-mono">
              📟 Output Simulasi Serial Monitor (115200 baud):
            </div>
            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputSerialSimulasi}
            </pre>
          </div>

          {/* Navigasi Bawah Sebelumnya / Selanjutnya */}
          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              disabled={indeksLevel === 0}
              onClick={() => pindahKeLevel(indeksLevel - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Materi Sebelumnya
            </button>
            <span className="text-xs font-bold text-slate-400">
              Materi {indeksLevel + 1} / {KURIKULUM_8_LEVEL_IOT.length}
            </span>
            <button
              type="button"
              disabled={indeksLevel === KURIKULUM_8_LEVEL_IOT.length - 1}
              onClick={() => pindahKeLevel(indeksLevel + 1)}
              className="px-4 py-2 rounded-xl bg-emerald-600 disabled:opacity-40 text-white text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              Materi Berikutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};