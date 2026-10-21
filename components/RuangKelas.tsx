"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Terminal,
  Calculator,
  FileEdit,
  Save,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { JenjangItem, KelasItem } from "../data/kurikulum";

interface RuangKelasProps {
  jenjang: JenjangItem;
  kelas: KelasItem;
  kembaliKeDaftar: () => void;
  sudahSelesai: boolean;
  toggleSelesaiMateri: (kelasId: string) => void;
  tambahXP: (jumlah: number) => void;
}

export default function RuangKelas({
  jenjang,
  kelas,
  kembaliKeDaftar,
  sudahSelesai,
  toggleSelesaiMateri,
  tambahXP,
}: RuangKelasProps) {
  const [jawabanTerpilih, setJawabanTerpilih] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState<boolean>(false);

  // Muat catatan pribadi siswa dari penyimpanan browser berdasarkan ID kelas
  useEffect(() => {
    const catatanTersimpan = localStorage.getItem(`catatan_${kelas.id}`);
    if (catatanTersimpan) {
      setCatatanSiswa(catatanTersimpan);
    } else {
      setCatatanSiswa("");
    }
    setJawabanTerpilih(null);
    setStatusKuis(null);
  }, [kelas.id]);

  const simpanCatatan = () => {
    localStorage.setItem(`catatan_${kelas.id}`, catatanSiswa);
    setStatusSimpanCatatan(true);
    setTimeout(() => setStatusSimpanCatatan(false), 2500);
  };

  const cekJawaban = (idx: number) => {
    setJawabanTerpilih(idx);
    if (idx === kelas.kuis.jawabanBenar) {
      if (statusKuis !== "benar") {
        tambahXP(50);
      }
      setStatusKuis("benar");
    } else {
      setStatusKuis("salah");
    }
  };

  const warnaLevel = {
    Pemula: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Menengah: "bg-amber-100 text-amber-800 border-amber-300",
    Mahir: "bg-purple-100 text-purple-800 border-purple-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Baris Navigasi Atas & Tombol Checklist Selesai */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={kembaliKeDaftar}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Modul {jenjang.nama}
        </button>

        {/* FITUR CHECKLIST LACAK PROGRES BELAJAR */}
        <button
          onClick={() => toggleSelesaiMateri(kelas.id)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${
            sudahSelesai
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-white border-2 border-slate-300 text-slate-700 hover:border-emerald-500"
          }`}
        >
          {sudahSelesai ? (
            <>
              <CheckSquare className="w-5 h-5" /> Materi Sudah Selesai Dipelajari (+30 XP)
            </>
          ) : (
            <>
              <Square className="w-5 h-5" /> Tandai Selesai Dipelajari
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: Video, Rumus Matematika, Kode & Catatan Pribadi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            {/* Pemutar Video */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-5 shadow-inner">
              <iframe
                src={kelas.videoUrl}
                title={kelas.judul}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            {/* Badge Kategori & Level Kesulitan */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}>
                {kelas.kategori}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  warnaLevel[kelas.level]
                }`}
              >
                ⚡ Level: {kelas.level}
              </span>
              <span className="text-xs text-slate-400 font-semibold ml-auto">
                ⏱️ Durasi: {kelas.durasi}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {kelas.judul}
            </h1>

            {/* Rangkuman Materi */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-5">
              <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Rangkuman Inti Materi:
              </h4>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {kelas.rangkuman}
              </p>
            </div>

            {/* FITUR 3A: KOTAK RUMUS MATEMATIKA & SAINS (Jika Ada) */}
            {kelas.rumusMatematika && (
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 mb-5 border border-indigo-500/30 shadow-md">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calculator className="w-4 h-4" /> Papan Rumus Matematika & Sains
                </div>
                <pre className="font-mono text-sm sm:text-base text-amber-300 whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                  {kelas.rumusMatematika}
                </pre>
              </div>
            )}

            {/* FITUR 3B: BLOK KODE PEMROGRAMAN PANDA KODE (Jika Ada) */}
            {kelas.contohKode && (
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 mb-5 border border-slate-700 shadow-md">
                <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Laboratorium Koding Panda Kode
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md">
                    JavaScript / React
                  </span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto bg-black/40 p-4 rounded-xl border border-slate-800 leading-relaxed">
                  <code>{kelas.contohKode}</code>
                </pre>
              </div>
            )}
          </div>

          {/* FITUR CATATAN PRIBADI SISWA (STUDY NOTES OTOMATIS TERSIMPAN) */}
          <div className="bg-amber-50/70 rounded-3xl p-6 border-2 border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                <FileEdit className="w-5 h-5 text-amber-600" /> Buku Catatan Pribadimu
              </h3>
              <span className="text-xs text-amber-700 font-semibold">
                Tersimpan di Perangkatmu
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Catat poin penting atau rumus dari video di atas agar kamu mudah mengingatnya saat menjelang ujian sekolah.
            </p>
            <textarea
              rows={4}
              value={catatanSiswa}
              onChange={(e) => setCatatanSiswa(e.target.value)}
              placeholder="Ketik catatan belajarmu untuk materi ini di sini..."
              className="w-full p-4 bg-white border border-amber-300 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={simpanCatatan}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-xs"
              >
                <Save className="w-4 h-4" /> Simpan Catatan
              </button>
              {statusSimpanCatatan && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                  ✅ Catatan berhasil disimpan!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: KUIS INTERAKTIF */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <Award className="w-4 h-4" /> Kuis Pemahaman
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                Hadiah +50 XP
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-5 leading-snug">
              {kelas.kuis.tanya}
            </h3>

            <div className="space-y-3 mb-6">
              {kelas.kuis.opsi.map((teksOpsi, idx) => {
                const dipilih = jawabanTerpilih === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => cekJawaban(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 font-semibold text-sm transition flex items-center justify-between ${
                      dipilih
                        ? statusKuis === "benar"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "border-rose-500 bg-rose-50 text-rose-900"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700"
                    }`}
                  >
                    <span>{teksOpsi}</span>
                    {dipilih && statusKuis === "benar" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {dipilih && statusKuis === "salah" && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {statusKuis === "benar" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm"
              >
                <div className="font-extrabold mb-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Jawabanmu Benar! (+50 XP)
                </div>
                <p>{kelas.kuis.pembahasan}</p>
              </motion.div>
            )}

            {statusKuis === "salah" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm"
              >
                <div className="font-extrabold mb-1">Belum Tepat, Ayo Coba Lagi! 💪</div>
                <p>Perhatikan kembali rangkuman atau papan rumus di sebelah kiri ya.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}