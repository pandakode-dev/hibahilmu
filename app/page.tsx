"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  School,
  Compass,
  PlayCircle,
  ArrowLeft,
  Trophy,
  Search,
  Flame,
  PlusCircle,
  CheckCircle,
  User,
  Timer,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import confetti from "canvas-confetti";

// MEMANGGIL FILE-FILE YANG SUDAH DIPISAH AGAR RAPI & MUDAH DITAMBAH NANTI
import {
  DATA_JENJANG_AWAL,
  JenjangItem,
  KelasItem,
} from "@/data/kurikulum";
import RuangKelas from "@/components/RuangKelas";
import FiturTryout from "@/components/FiturTryout";
import KomunitasDanDonasi from "@/components/KomunitasDanDonasi";

export default function AplikasiHibahIlmu() {
  // Navigasi Menu Utama: "beranda" | "tryout" | "forum" | "transparansi" | "sumbang"
  const [menuAktif, setMenuAktif] = useState<string>("beranda");

  // State Kurikulum & Kelas (Diambil dari file data/kurikulum.ts)
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(DATA_JENJANG_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("Semua");

  // Sistem Autentikasi Profil Siswa & Simpan Progres Otomatis
  const [namaSiswa, setNamaSiswa] = useState<string>("");
  const [jenjangSiswa, setJenjangSiswa] = useState<string>("SMA / SMK");
  const [bukaModalProfil, setBukaModalProfil] = useState<boolean>(false);
  const [inputNamaProfil, setInputNamaProfil] = useState<string>("");

  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);

  // Form Sumbang Materi Relawan
  const [targetJenjangId, setTargetJenjangId] = useState<string>("sd");
  const [judulBaru, setJudulBaru] = useState<string>("");
  const [kategoriBaru, setKategoriBaru] = useState<string>("");
  const [levelBaru, setLevelBaru] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [urlVideoBaru, setUrlVideoBaru] = useState<string>("");
  const [rangkumanBaru, setRangkumanBaru] = useState<string>("");
  const [rumusBaru, setRumusBaru] = useState<string>("");
  const [berhasilKirim, setBerhasilKirim] = useState<boolean>(false);

  // Muat Progres Siswa dari Penyimpanan Browser
  useEffect(() => {
    const savedNama = localStorage.getItem("hibah_nama");
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");

    if (savedNama) setNamaSiswa(savedNama);
    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
  }, []);

  const lemparkanKonfeti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const tambahXP = (tambahan: number) => {
    setPoinXP((prev) => {
      const totalBaru = prev + tambahan;
      localStorage.setItem("hibah_xp", totalBaru.toString());
      return totalBaru;
    });
    lemparkanKonfeti();
  };

  const toggleSelesaiMateri = (kelasId: string) => {
    setMateriSelesai((prev) => {
      const sudahAda = prev.includes(kelasId);
      let daftarBaru: string[];
      if (sudahAda) {
        daftarBaru = prev.filter((id) => id !== kelasId);
      } else {
        daftarBaru = [...prev, kelasId];
        tambahXP(30);
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  const simpanProfilSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNamaProfil.trim()) return;
    setNamaSiswa(inputNamaProfil);
    localStorage.setItem("hibah_nama", inputNamaProfil);
    setBukaModalProfil(false);
    lemparkanKonfeti();
  };

  const keluarProfil = () => {
    setNamaSiswa("");
    localStorage.removeItem("hibah_nama");
    setBukaModalProfil(false);
  };

  const renderIkonJenjang = (nama: string) => {
    switch (nama) {
      case "sparkles":
        return <Sparkles className="w-7 h-7 text-white" />;
      case "book":
        return <BookOpen className="w-7 h-7 text-white" />;
      case "compass":
        return <Compass className="w-7 h-7 text-white" />;
      case "school":
        return <School className="w-7 h-7 text-white" />;
      default:
        return <GraduationCap className="w-7 h-7 text-white" />;
    }
  };

  const handleSubmitMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulBaru || !urlVideoBaru) return;

    let finalEmbedUrl = urlVideoBaru;
    if (urlVideoBaru.includes("watch?v=")) {
      finalEmbedUrl = urlVideoBaru.replace("watch?v=", "embed/");
    } else if (urlVideoBaru.includes("youtu.be/")) {
      finalEmbedUrl = urlVideoBaru.replace("youtu.be/", "www.youtube.com/embed/");
    }

    const modulBaru: KelasItem = {
      id: "materi-" + Date.now(),
      judul: judulBaru,
      kategori: kategoriBaru || "Umum",
      level: levelBaru,
      durasi: "10 Menit",
      videoUrl: finalEmbedUrl,
      rangkuman: rangkumanBaru || "Materi sumbangan amal jariyah dari relawan.",
      rumusMatematika: rumusBaru || undefined,
      kuis: {
        tanya: `Apakah kamu sudah memahami inti materi "${judulBaru}" ini?`,
        opsi: ["Sudah Paham Sekali!", "Perlu Mengulang Video", "Ingin Mencatat", "Tanya di Forum"],
        jawabanBenar: 0,
        pembahasan: "Alhamdulillah! Teruslah semangat menuntut ilmu.",
      },
    };

    setDaftarJenjang((prev) =>
      prev.map((j) => (j.id === targetJenjangId ? { ...j, kelas: [modulBaru, ...j.kelas] } : j))
    );

    tambahXP(100);
    setBerhasilKirim(true);
    setTimeout(() => {
      setBerhasilKirim(false);
      setMenuAktif("beranda");
      setJudulBaru("");
      setKategoriBaru("");
      setUrlVideoBaru("");
      setRangkumanBaru("");
      setRumusBaru("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Cahaya Aurora Latar Belakang */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      {/* HEADER NAVIGASI LENGKAP */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
          {/* Logo Brand */}
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              🐼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  HibahIlmu
                </span>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Pengabdian Masyarakat • Panda Kode
              </p>
            </div>
          </div>

          {/* Menu Tengah (Navigasi 5 Fitur Utama) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {[
              { id: "beranda", label: "Ruang Kelas", ikon: <BookOpen className="w-4 h-4" /> },
              { id: "tryout", label: "Tryout Ujian", ikon: <Timer className="w-4 h-4" /> },
              { id: "forum", label: "Tanya PR", ikon: <MessageSquare className="w-4 h-4" /> },
              { id: "transparansi", label: "Transparansi Amal", ikon: <ShieldCheck className="w-4 h-4" /> },
              { id: "sumbang", label: "Sumbang Materi", ikon: <PlusCircle className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  menuAktif === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.ikon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Indikator XP, Checklist & Tombol Profil Siswa */}
          <div className="flex items-center gap-2.5">
            <div
              title="Jumlah Materi Selesai"
              className="hidden md:flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{materiSelesai.length} Selesai</span>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{poinXP} XP</span>
            </div>

            <button
              onClick={() => {
                setInputNamaProfil(namaSiswa);
                setBukaModalProfil(true);
              }}
              className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-2 rounded-full shadow-xs hover:opacity-95 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>{namaSiswa ? namaSiswa.split(" ")[0] : "Masuk Siswa"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL POP-UP PROFIL & LOGIN SISWA */}
      <AnimatePresence>
        {bukaModalProfil && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                Profil Pelajar HibahIlmu
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Progres XP, materi yang dicentang selesai, dan buku catatanmu otomatis tersimpan di perangkat ini.
              </p>

              <form onSubmit={simpanProfilSiswa} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nama Lengkapmu
                  </label>
                  <input
                    type="text"
                    required
                    value={inputNamaProfil}
                    onChange={(e) => setInputNamaProfil(e.target.value)}
                    placeholder="Masukkan namamu..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Jenjang Pendidikan Saat Ini
                  </label>
                  <select
                    value={jenjangSiswa}
                    onChange={(e) => setJenjangSiswa(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option>TK & PAUD</option>
                    <option>SD / MI</option>
                    <option>SMP / MTs</option>
                    <option>SMA / SMK</option>
                    <option>Mahasiswa / Umum</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-around text-center">
                  <div>
                    <div className="text-xs text-slate-500">Total Poin</div>
                    <div className="font-black text-lg text-amber-600">{poinXP} XP</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Modul Selesai</div>
                    <div className="font-black text-lg text-emerald-600">
                      {materiSelesai.length} Materi
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-emerald-700 transition"
                  >
                    Simpan Profil
                  </button>
                  {namaSiswa && (
                    <button
                      type="button"
                      onClick={keluarProfil}
                      className="px-4 py-3 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm hover:bg-rose-100 transition flex items-center gap-1"
                    >
                      <LogOut className="w-4 h-4" /> Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBukaModalProfil(false)}
                    className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ISI HALAMAN UTAMA BERDASARKAN TAB MENU */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {menuAktif === "tryout" && <FiturTryout tambahXP={tambahXP} />}

        {(menuAktif === "forum" || menuAktif === "transparansi") && (
          <KomunitasDanDonasi
            modeTampilan={menuAktif as "forum" | "transparansi"}
            namaUser={namaSiswa}
            poinUser={poinXP}
            tambahXP={tambahXP}
          />
        )}

        {/* FORM SUMBANG MATERI RELAWAN */}
        {menuAktif === "sumbang" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Sumbang Materi & Rumus Pelajaran
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              Jadilah bagian dari pengabdian masyarakat bersama Panda Kode. Setiap materi yang kamu tambahkan akan memberi hadiah <strong>+100 XP</strong>!
            </p>

            {berhasilKirim ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-900">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Materi Berhasil Dipublikasikan!</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmitMateri} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Pilih Jenjang
                    </label>
                    <select
                      value={targetJenjangId}
                      onChange={(e) => setTargetJenjangId(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    >
                      {daftarJenjang.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Level Kesulitan Materi
                    </label>
                    <select
                      value={levelBaru}
                      onChange={(e) =>
                        setLevelBaru(e.target.value as "Pemula" | "Menengah" | "Mahir")
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    >
                      <option value="Pemula">Pemula (Dasar)</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Mahir">Mahir / Olimpiade</option>
                    </select>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={judulBaru}
                  onChange={(e) => setJudulBaru(e.target.value)}
                  placeholder="Judul Materi (contoh: Hukum Newton & Gaya Gesek)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  required
                  value={kategoriBaru}
                  onChange={(e) => setKategoriBaru(e.target.value)}
                  placeholder="Mata Pelajaran (contoh: Fisika SMA)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  required
                  value={urlVideoBaru}
                  onChange={(e) => setUrlVideoBaru(e.target.value)}
                  placeholder="Link Video YouTube (contoh: https://www.youtube.com/watch?v=...)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <textarea
                  rows={3}
                  value={rangkumanBaru}
                  onChange={(e) => setRangkumanBaru(e.target.value)}
                  placeholder="Rangkuman penjelasan materi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  value={rumusBaru}
                  onChange={(e) => setRumusBaru(e.target.value)}
                  placeholder="Rumus penting jika ada (contoh: F = m × a)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-md"
                >
                  🚀 Publikasikan ke HibahIlmu (+100 XP)
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* MENU RUANG KELAS UTAMA */}
        {menuAktif === "beranda" && (
          <>
            {/* 1. TAMPILAN BERANDA PILIH JENJANG */}
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12 pt-2">
                  <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-2xs px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 mb-5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>
                      {namaSiswa
                        ? `Selamat datang kembali, ${namaSiswa}! Ayo lanjutkan belajarmu.`
                        : "Pendidikan Berkualitas untuk Seluruh Anak Bangsa"}
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-[1.15] tracking-tight">
                    Satu Platform Sejuta Ilmu,{" "}
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                      100% Gratis Selamanya.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                    Dilengkapi <strong>Video Animasi</strong>, <strong>Papan Rumus & Koding</strong>, <strong>Catatan Pribadi</strong>, <strong>Tryout Ujian</strong>, hingga <strong>Diskusi PR</strong> dari TK sampai Kuliah.
                  </p>

                  <div className="max-w-xl mx-auto relative mb-8">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kataKunci}
                      onChange={(e) => setKataKunci(e.target.value)}
                      placeholder="Cari jenjang atau pelajaran (contoh: SD, SMA, Kuliah, Sains)..."
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Grid Kartu 5 Jenjang */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarJenjang
                    .filter(
                      (j) =>
                        j.nama.toLowerCase().includes(kataKunci.toLowerCase()) ||
                        j.deskripsi.toLowerCase().includes(kataKunci.toLowerCase())
                    )
                    .map((jenjang, idx) => (
                      <motion.div
                        key={jenjang.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        whileHover={{ y: -6 }}
                        onClick={() => setJenjangAktif(jenjang)}
                        className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
                      >
                        <div
                          className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`}
                        />
                        <div>
                          <div className="flex items-center justify-between mb-5 mt-2">
                            <div
                              className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md`}
                            >
                              {renderIkonJenjang(jenjang.ikonNama)}
                            </div>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}
                            >
                              {jenjang.kelas.length} Modul
                            </span>
                          </div>
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {jenjang.tagline}
                          </div>
                          <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                            {jenjang.nama}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            {jenjang.deskripsi}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className={`text-sm font-bold ${jenjang.teksWarna}`}>
                            Buka Ruang Kelas
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${jenjang.gradien} text-white group-hover:translate-x-1 transition`}
                          >
                            →
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* 2. TAMPILAN DAFTAR MODUL & FILTER LEVEL KESULITAN */}
            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <button
                    onClick={() => {
                      setJenjangAktif(null);
                      setFilterLevel("Semua");
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" /> Semua Jenjang Pendidikan
                  </button>

                  {/* FITUR FILTER LEVEL KESULITAN MATERI */}
                  <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200">
                    {["Semua", "Pemula", "Menengah", "Mahir"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilterLevel(lvl)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          filterLevel === lvl
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-3xl p-8 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
                >
                  <div>
                    <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {jenjangAktif.tagline}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-2">
                      Ruang Kelas {jenjangAktif.nama}
                    </h1>
                    <p className="text-white/90 max-w-2xl text-sm sm:text-base">
                      {jenjangAktif.deskripsi}
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[140px]">
                    <Trophy className="w-8 h-8 mx-auto mb-1 text-amber-300" />
                    <div className="text-xs text-white/80">Kuis & Catatan</div>
                    <div className="font-black text-xl">+80 XP</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas
                    .filter((k) => filterLevel === "Semua" || k.level === filterLevel)
                    .map((item) => {
                      const selesai = materiSelesai.includes(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -4 }}
                          onClick={() => setKelasAktif(item)}
                          className={`bg-white rounded-3xl p-6 border-2 shadow-xs hover:shadow-lg cursor-pointer transition flex flex-col justify-between ${
                            selesai ? "border-emerald-400" : "border-slate-200/90"
                          }`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full ${jenjangAktif.badge}`}
                                >
                                  {item.kategori}
                                </span>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                  ⚡ {item.level}
                                </span>
                              </div>
                              {selesai ? (
                                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                  ⏱️ {item.durasi}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {item.judul}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-5">
                              {item.rangkuman}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                              <PlayCircle className="w-5 h-5" /> Buka Video, Rumus & Kuis
                            </span>
                            <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                              +50 XP
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* 3. TAMPILAN RUANG BELAJAR DETAIL (DARI FILE components/RuangKelas.tsx) */}
            {kelasAktif && jenjangAktif && (
              <RuangKelas
                jenjang={jenjangAktif}
                kelas={kelasAktif}
                kembaliKeDaftar={() => setKelasAktif(null)}
                sudahSelesai={materiSelesai.includes(kelasAktif.id)}
                toggleSelesaiMateri={toggleSelesaiMateri}
                tambahXP={tambahXP}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-8 text-center text-xs sm:text-sm text-slate-500 mt-16">
        <p className="font-semibold text-slate-700">
          Dibangun dengan cinta oleh 🐼 <strong>Panda Kode</strong> • HibahIlmu.id
        </p>
        <p className="mt-1">
          Platform Amal Jariyah Pendidikan Indonesia • Gratis Selamanya.
        </p>
      </footer>
    </div>
  );
}