"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Trophy, CheckCircle2, XCircle, RotateCcw, Play, Award } from "lucide-react";
import { BANK_SOAL_TRYOUT } from "../data/kurikulum";

interface FiturTryoutProps {
  tambahXP: (jumlah: number) => void;
}

export default function FiturTryout({ tambahXP }: FiturTryoutProps) {
  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(180); // 3 Menit (180 detik)
  const [jawabanUser, setJawabanUser] = useState<{ [key: number]: number }>({});
  const [skorAkhir, setSkorAkhir] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) {
      interval = setInterval(() => {
        setSisaWaktu((prev) => prev - 1);
      }, 1000);
    } else if (sisaWaktu === 0 && sedangUjian) {
      selesaikanTryout();
    }
    return () => clearInterval(interval);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  const mulaiTryout = () => {
    setJawabanUser({});
    setSisaWaktu(180);
    setUjianSelesai(false);
    setSedangUjian(true);
  };

  const selesaikanTryout = () => {
    let benar = 0;
    BANK_SOAL_TRYOUT.forEach((soal, index) => {
      if (jawabanUser[index] === soal.jawabanBenar) {
        benar++;
      }
    });
    const nilai = Math.round((benar / BANK_SOAL_TRYOUT.length) * 100);
    setSkorAkhir(nilai);
    setUjianSelesai(true);
    setSedangUjian(false);
    if (benar > 0) {
      tambahXP(benar * 40);
    }
  };

  const formatMenitDetik = (detik: number) => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header Banner Tryout */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Simulasi CBT & UTBK Gratis
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-2">
            Bank Soal & Tryout Berwaktu
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">
            Uji kesiapan mental dan pemahamanmu menghadapi ujian sekolah maupun seleksi kampus dengan sistem hitung mundur otomatis.
          </p>
        </div>

        {sedangUjian && (
          <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
            <div className="text-xs text-amber-300 font-bold uppercase flex items-center justify-center gap-1 mb-1">
              <Timer className="w-4 h-4 animate-spin" /> Sisa Waktu
            </div>
            <div className="font-mono text-3xl font-black text-white">
              {formatMenitDetik(sisaWaktu)}
            </div>
          </div>
        )}
      </div>

      {/* Layar Sebelum Mulai */}
      {!sedangUjian && !ujianSelesai && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Siap Mengerjakan Tantangan Tryout?
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Terdapat <strong>{BANK_SOAL_TRYOUT.length} soal pilihan lintas jenjang</strong> dengan waktu pengerjaan <strong>3 menit</strong>. Setiap jawaban benar akan memberimu tambahan <strong>+40 XP</strong>!
          </p>
          <button
            onClick={mulaiTryout}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <Play className="w-5 h-5 fill-white" /> Mulai Timer & Kerjakan Soal
          </button>
        </div>
      )}

      {/* Layar Saat Mengerjakan Soal */}
      {sedangUjian && (
        <div className="space-y-6">
          {BANK_SOAL_TRYOUT.map((soal, idx) => (
            <div
              key={soal.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  Soal #{idx + 1} • Tingkat {soal.jenjang}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">
                {soal.pertanyaan}
              </h3>
              {soal.rumus && (
                <div className="bg-slate-900 text-amber-300 font-mono text-xs sm:text-sm p-3.5 rounded-xl mb-4">
                  💡 Petunjuk Rumus: {soal.rumus}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {soal.opsi.map((pilihan, opsiIdx) => {
                  const terpilih = jawabanUser[idx] === opsiIdx;
                  return (
                    <button
                      key={opsiIdx}
                      onClick={() =>
                        setJawabanUser((prev) => ({ ...prev, [idx]: opsiIdx }))
                      }
                      className={`p-3.5 rounded-2xl border-2 text-left font-semibold text-sm transition ${
                        terpilih
                          ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                          : "border-slate-200 hover:border-indigo-300 text-slate-700"
                      }`}
                    >
                      {pilihan}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={selesaikanTryout}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition text-lg"
          >
            ✅ Kumpulkan Jawaban & Lihat Nilai
          </button>
        </div>
      )}

      {/* Layar Hasil & Pembahasan Lengkap */}
      {ujianSelesai && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-200 text-center shadow-md">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hasil Evaluasi Tryout Kamu
            </div>
            <div className="text-5xl font-black text-slate-900 my-2">
              Skor: {skorAkhir} / 100
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Pelajari pembahasan lengkap di bawah ini agar pemahamanmu semakin matang!
            </p>
            <button
              onClick={mulaiTryout}
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Simulasi Tryout
            </button>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            Kunci Jawaban & Pembahasan Lengkap:
          </h3>

          {BANK_SOAL_TRYOUT.map((soal, idx) => {
            const jawabanSiswa = jawabanUser[idx];
            const apakahBenar = jawabanSiswa === soal.jawabanBenar;
            return (
              <div
                key={soal.id}
                className={`rounded-3xl p-6 border-2 bg-white ${
                  apakahBenar ? "border-emerald-200" : "border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    Soal #{idx + 1} ({soal.jenjang})
                  </span>
                  {apakahBenar ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> Benar (+40 XP)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" /> Belum Tepat
                    </span>
                  )}
                </div>
                <p className="font-bold text-slate-900 mb-3">{soal.pertanyaan}</p>
                <div className="text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-bold text-emerald-700 mb-1">
                    ✔ Kunci Jawaban: {soal.opsi[soal.jawabanBenar]}
                  </div>
                  <p className="text-slate-600">{soal.pembahasan}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}