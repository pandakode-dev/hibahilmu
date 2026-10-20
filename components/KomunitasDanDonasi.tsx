"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Heart,
  ShieldCheck,
  Trophy,
  UserCheck,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import {
  DISKUSI_PR_AWAL,
  DATA_TRANSPARANSI_DONASI,
  DiskusiPR,
} from "../data/kurikulum";

interface KomunitasProps {
  modeTampilan: "forum" | "transparansi";
  namaUser: string;
  poinUser: number;
  tambahXP: (jumlah: number) => void;
}

export default function KomunitasDanDonasi({
  modeTampilan,
  namaUser,
  poinUser,
  tambahXP,
}: KomunitasProps) {
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>(DISKUSI_PR_AWAL);
  const [pertanyaanBaru, setPertanyaanBaru] = useState("");
  const [jenjangTanya, setJenjangTanya] = useState("SMP");
  const [mapelTanya, setMapelTanya] = useState("Matematika");
  const [inputBalasan, setInputBalasan] = useState<{ [key: string]: string }>({});

  const kirimPertanyaanPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaanBaru.trim()) return;

    const itemBaru: DiskusiPR = {
      id: "pr-" + Date.now(),
      penanya: namaUser || "Pelajar Semangat",
      jenjang: jenjangTanya,
      mapel: mapelTanya,
      pertanyaan: pertanyaanBaru,
      waktu: "Baru saja",
      jawaban: [],
    };

    setDaftarDiskusi([itemBaru, ...daftarDiskusi]);
    setPertanyaanBaru("");
    tambahXP(20);
  };

  const kirimJawabanBantuan = (idDiskusi: string) => {
    const isi = inputBalasan[idDiskusi];
    if (!isi || !isi.trim()) return;

    setDaftarDiskusi((prev) =>
      prev.map((d) => {
        if (d.id === idDiskusi) {
          return {
            ...d,
            jawaban: [
              ...d.jawaban,
              {
                penjawab: (namaUser || "Sahabat Belajar") + " (Relawan Pelajar)",
                isi,
                apakahRelawan: true,
              },
            ],
          };
        }
        return d;
      })
    );

    setInputBalasan((prev) => ({ ...prev, [idDiskusi]: "" }));
    tambahXP(35); // Pahala membantu menjawab PR teman
  };

  // JIKA MEMBUKA HALAMAN FORUM TANYA JAWAB PR & LEADERBOARD
  if (modeTampilan === "forum") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri (2 Bagian): Tanya PR & Diskusi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
            <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Gotong Royong Pendidikan
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-3 mb-2">
              Forum Tanya PR & Diskusi Pelajar
            </h1>
            <p className="text-emerald-50 text-sm">
              Kesulitan mengerjakan PR sekolah atau tugas kuliah? Tanyakan di sini! Teman-teman dan relawan pengajar akan membantumu secara gratis.
            </p>
          </div>

          {/* Form Buat Pertanyaan */}
          <form
            onSubmit={kirimPertanyaanPR}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" /> Ajukan Pertanyaan / Soal PR
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={jenjangTanya}
                onChange={(e) => setJenjangTanya(e.target.value)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              >
                <option value="SD">Tingkat SD</option>
                <option value="SMP">Tingkat SMP</option>
                <option value="SMA">Tingkat SMA/SMK</option>
                <option value="Kuliah">Tingkat Kuliah / IT</option>
              </select>
              <input
                type="text"
                value={mapelTanya}
                onChange={(e) => setMapelTanya(e.target.value)}
                placeholder="Mata Pelajaran (misal: Fisika)"
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
            </div>
            <textarea
              rows={3}
              required
              value={pertanyaanBaru}
              onChange={(e) => setPertanyaanBaru(e.target.value)}
              placeholder="Tuliskan soal PR atau bagian materi yang belum kamu pahami..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 transition shadow-sm"
            >
              <Send className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
            </button>
          </form>

          {/* Daftar Pertanyaan Komunitas */}
          <div className="space-y-4">
            {daftarDiskusi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {item.jenjang} • {item.mapel}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {item.penanya}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{item.waktu}</span>
                </div>

                <p className="text-slate-800 font-medium text-sm sm:text-base mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {item.pertanyaan}
                </p>

                {/* Daftar Jawaban */}
                <div className="space-y-3 pl-4 border-l-2 border-emerald-200 mb-4">
                  {item.jawaban.map((jwb, i) => (
                    <div key={i} className="bg-emerald-50/60 p-3.5 rounded-2xl text-xs sm:text-sm">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                        <UserCheck className="w-4 h-4" /> {jwb.penjawab}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{jwb.isi}</p>
                    </div>
                  ))}
                </div>

                {/* Kotak Bantu Jawab */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputBalasan[item.id] || ""}
                    onChange={(e) =>
                      setInputBalasan((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder="Bantu jawab pertanyaan temanmu ini (+35 XP)..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                  <button
                    onClick={() => kirimJawabanBantuan(item.id)}
                    className="bg-slate-900 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shrink-0"
                  >
                    Bantu Jawab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Papan Peringkat Amal & Pelajar Rajin (Leaderboard) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm uppercase tracking-wider mb-4">
              <Trophy className="w-5 h-5" /> Papan Bintang Pelajar (XP)
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Semakin rajin kamu menyelesaikan materi, tryout, dan membantu menjawab PR teman, semakin tinggi bintang belajarmu!
            </p>

            <div className="space-y-3">
              {[
                { nama: namaUser || "Kamu (Pelajar Hebat)", xp: poinUser, isUser: true },
                { nama: "Aisyah Putri (SMA)", xp: 640, isUser: false },
                { nama: "Bintang Pratama (SMP)", xp: 520, isUser: false },
                { nama: "Kak Dimas (Kuliah IT)", xp: 490, isUser: false },
                { nama: "Nadia Ceria (SD)", xp: 310, isUser: false },
              ]
                .sort((a, b) => b.xp - a.xp)
                .map((siswa, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      siswa.isUser
                        ? "bg-amber-50 border-amber-300 font-bold"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-800">
                        {siswa.nama}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                      {siswa.xp} XP
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // JIKA MEMBUKA HALAMAN TRANSPARANSI DANA UMAT & DONASI
  const persentaseDana = Math.min(
    100,
    Math.round(
      (DATA_TRANSPARANSI_DONASI.totalTerkumpul /
        DATA_TRANSPARANSI_DONASI.targetTahunan) *
        100
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-8 text-white shadow-xl text-center">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full mb-3">
          <ShieldCheck className="w-4 h-4" /> Laporan Terbuka 100% Amanah
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">
          Transparansi Amal & Donasi Umat
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
          HibahIlmu tidak memungut biaya sepeser pun dari pelajar. Seluruh donasi sukarela dari orang-orang baik digunakan murni untuk membeli domain resmi <strong>hibahilmu.id</strong> dan pengembangan modul belajar gratis.
        </p>

        {/* Progress Bar Tabungan Domain & Operasional */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-xl mx-auto border border-white/15 text-left">
          <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
            <span className="text-emerald-300">
              Terkumpul: Rp {DATA_TRANSPARANSI_DONASI.totalTerkumpul.toLocaleString("id-ID")}
            </span>
            <span className="text-slate-300">
              Target Operasional 1 Tahun: Rp {DATA_TRANSPARANSI_DONASI.targetTahunan.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${persentaseDana}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alokasi Penggunaan Dana */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg mb-4">
            📌 Rincian Penggunaan Dana
          </h3>
          <div className="space-y-3">
            {DATA_TRANSPARANSI_DONASI.alokasiPenggunaan.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
              >
                <div className="font-bold text-sm text-slate-900">
                  {item.keperluan}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="font-extrabold text-emerald-700">{item.biaya}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doa & Riwayat Donatur */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg mb-4">
            🤲 Doa & Dukungan Orang Baik
          </h3>
          <div className="space-y-3">
            {DATA_TRANSPARANSI_DONASI.riwayatDonatur.map((donatur, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">
                    {donatur.nama}
                  </span>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                    Rp {donatur.nominal.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">"{donatur.pesan}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}