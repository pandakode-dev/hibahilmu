"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  CheckCircle2,
  Timer,
  MessageSquare,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import confetti from "canvas-confetti";

import {
  DATA_JENJANG_AWAL,
  JenjangItem,
  KelasItem,
} from "@/data/kurikulum";
import RuangKelas from "@/components/RuangKelas";
import FiturTryout from "@/components/FiturTryout";
import KomunitasDanDonasi from "@/components/KomunitasDanDonasi";
import SistemAkunDanDashboard, {
  AkunPengguna,
  LogAktivitas,
} from "@/components/SistemAkunDanDashboard";

// DATA AKUN AWAL (TERMASUK AKUN PENDING UNTUK DITES APPROVAL OLEH ADMIN)
const AKUN_DEFAULT: AkunPengguna[] = [
  {
    id: "adm-1",
    nama: "Admin Panda Kode",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "approved",
    infoTambahan: "Founder & Super Admin HibahIlmu",
    waktuDaftar: " Permanen",
  },
  {
    id: "gru-1",
    nama: "Bapak Budi Santoso, M.Pd",
    email: "guru@hibahilmu.id",
    password: "123",
    role: "guru",
    status: "approved",
    infoTambahan: "Guru Matematika & Fisika SMA",
    waktuDaftar: "Kemarin, 09:00",
  },
  {
    id: "sis-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswi Kelas 11 SMA",
    waktuDaftar: "Kemarin, 14:20",
  },
  {
    id: "pend-1",
    nama: "Ibu Siti Aminah, S.Pd",
    email: "siti.guru@gmail.com",
    password: "123",
    role: "guru",
    status: "pending",
    infoTambahan: "Guru Bahasa Inggris & Sains SD/SMP",
    waktuDaftar: "Hari ini, 06:30",
  },
  {
    id: "pend-2",
    nama: "Rizky Ramadhan",
    email: "rizky.pelajar@gmail.com",
    password: "123",
    role: "siswa",
    status: "pending",
    infoTambahan: "Siswa Kelas 8 SMP Negeri 2",
    waktuDaftar: "Hari ini, 06:45",
  },
];

// DATA LOG AKTIVITAS AWAL UNTUK DIPANTAU ADMIN
const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "06:50 WIB",
    namaPelaku: "Rizky Ramadhan",
    rolePelaku: "siswa",
    aksi: "Mendaftar akun Siswa baru (Menunggu Approval Admin)",
    kategori: "akun",
  },
  {
    id: "log-2",
    waktu: "06:30 WIB",
    namaPelaku: "Ibu Siti Aminah, S.Pd",
    rolePelaku: "guru",
    aksi: "Mendaftar sebagai Guru Relawan baru (Menunggu Approval Admin)",
    kategori: "akun",
  },
  {
    id: "log-3",
    waktu: "Kemarin",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mengunggah modul materi 'Fisika Mekanika & Hukum Newton' pada jenjang SMA",
    kategori: "materi",
  },
  {
    id: "log-4",
    waktu: "Kemarin",
    namaPelaku: "Aisyah Putri",
    rolePelaku: "siswa",
    aksi: "Menyelesaikan kuis 'Rahasia Perkalian Cepat' dengan nilai 100 (+50 XP)",
    kategori: "belajar",
  },
];

export default function AplikasiHibahIlmu() {
  // Navigasi Utama: "beranda" | "tryout" | "forum" | "transparansi" | "dashboard"
  const [menuAktif, setMenuAktif] = useState<string>("beranda");

  // State Kurikulum & Ruang Kelas
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(DATA_JENJANG_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("Semua");

  // State Multi-Role (Akun, Login & Log Aktivitas Admin)
  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);

  // State Poin XP & Materi Selesai
  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);

  // Muat Data Tersimpan dari Browser
  useEffect(() => {
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    const savedAkunList = localStorage.getItem("hibah_daftar_akun");
    const savedUserAktif = localStorage.getItem("hibah_user_aktif");
    const savedLogs = localStorage.getItem("hibah_log_aktivitas");

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
  }, []);

  // Fungsi Mencatat Log Aktivitas Guru & Murid secara Otomatis
  const catatLog = (
    namaPelaku: string,
    rolePelaku: "admin" | "guru" | "siswa",
    aksi: string,
    kategori: "belajar" | "materi" | "akun" | "komunitas"
  ) => {
    const jam = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const logBaru: LogAktivitas = {
      id: "log-" + Date.now(),
      waktu: `${jam} WIB`,
      namaPelaku,
      rolePelaku,
      aksi,
      kategori,
    };
    setLogAktivitas((prev) => {
      const terbaru = [logBaru, ...prev];
      localStorage.setItem("hibah_log_aktivitas", JSON.stringify(terbaru));
      return terbaru;
    });
  };

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

    if (userLogin) {
      catatLog(
        userLogin.nama,
        userLogin.role,
        `Memperoleh tambahan +${tambahan} XP dari aktivitas pembelajaran / kuis`,
        "belajar"
      );
    }
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
        catatLog(
          userLogin?.nama || "Siswa Pengunjung",
          userLogin?.role || "siswa",
          `Menandai selesai modul pelajaran (ID: ${kelasId})`,
          "belajar"
        );
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  const tambahMateriDariGuru = (
    jenjangId: string,
    modulBaru: KelasItem,
    namaGuru: string
  ) => {
    setDaftarJenjang((prev) =>
      prev.map((j) =>
        j.id === jenjangId ? { ...j, kelas: [modulBaru, ...j.kelas] } : j
      )
    );
    catatLog(
      namaGuru,
      "guru",
      `Menerbitkan modul materi baru: "${modulBaru.judul}" pada jenjang ${jenjangId.toUpperCase()}`,
      "materi"
    );
    lemparkanKonfeti();
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

  // Hitung jumlah pendaftar yang masih pending untuk badge notifikasi Admin
  const jumlahPending = daftarAkun.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Cahaya Aurora Latar Belakang */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      {/* HEADER NAVIGASI UTAMA */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-2xs">
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

          {/* Menu Tengah */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {[
              { id: "beranda", label: "Ruang Kelas", ikon: <BookOpen className="w-4 h-4" /> },
              { id: "tryout", label: "Tryout Ujian", ikon: <Timer className="w-4 h-4" /> },
              { id: "forum", label: "Tanya PR", ikon: <MessageSquare className="w-4 h-4" /> },
              { id: "transparansi", label: "Donasi Umat", ikon: <ShieldCheck className="w-4 h-4" /> },
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

          {/* Indikator XP & Tombol Portal Dashboard (Admin / Guru / Siswa) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{poinXP} XP</span>
            </div>

            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className={`relative flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-full shadow-sm transition ${
                userLogin
                  ? userLogin.role === "admin"
                    ? "bg-slate-900 text-amber-300"
                    : userLogin.role === "guru"
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>
                {userLogin
                  ? `Dashboard ${userLogin.role.toUpperCase()}`
                  : "Daftar / Masuk"}
              </span>

              {/* Titik Merah Notifikasi jika ada akun menunggu Approval Admin */}
              {jumlahPending > 0 && (
                <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {jumlahPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ISI UTAMA HALAMAN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* MENU DASHBOARD MULTI-ROLE (ADMIN / GURU / SISWA / LOGIN) */}
        {menuAktif === "dashboard" && (
          <SistemAkunDanDashboard
            userLogin={userLogin}
            setUserLogin={setUserLogin}
            daftarAkun={daftarAkun}
            setDaftarAkun={setDaftarAkun}
            logAktivitas={logAktivitas}
            catatLog={catatLog}
            daftarJenjang={daftarJenjang}
            tambahMateriDariGuru={tambahMateriDariGuru}
            poinXP={poinXP}
            materiSelesai={materiSelesai}
          />
        )}

        {/* MENU TRYOUT */}
        {menuAktif === "tryout" && <FiturTryout tambahXP={tambahXP} />}

        {/* MENU FORUM PR & TRANSPARANSI DONASI */}
        {(menuAktif === "forum" || menuAktif === "transparansi") && (
          <KomunitasDanDonasi
            modeTampilan={menuAktif as "forum" | "transparansi"}
            namaUser={userLogin?.nama || "Pelajar Pengunjung"}
            poinUser={poinXP}
            tambahXP={tambahXP}
          />
        )}

        {/* MENU RUANG KELAS UTAMA */}
        {menuAktif === "beranda" && (
          <>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12 pt-2">
                  <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-2xs px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 mb-5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>
                      {userLogin
                        ? `Halo ${userLogin.nama} (${userLogin.role.toUpperCase()})! Selamat datang di HibahIlmu.`
                        : "Pendidikan Gratis untuk Seluruh Anak Bangsa"}
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-[1.15] tracking-tight">
                    Satu Platform Sejuta Ilmu,{" "}
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                      100% Gratis Selamanya.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                    Dilengkapi portal <strong>Siswa, Guru Relawan, dan Admin</strong>. Pilih jenjang pendidikan di bawah untuk mulai belajar!
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
                        onClick={() => {
                          setJenjangAktif(jenjang);
                          if (userLogin) {
                            catatLog(
                              userLogin.nama,
                              userLogin.role,
                              `Membuka ruang kelas jenjang ${jenjang.nama}`,
                              "belajar"
                            );
                          }
                        }}
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

            {/* Daftar Modul di Dalam Jenjang */}
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
                          onClick={() => {
                            setKelasAktif(item);
                            catatLog(
                              userLogin?.nama || "Siswa Pengunjung",
                              userLogin?.role || "siswa",
                              `Memulai belajar modul "${item.judul}" (${jenjangAktif.nama})`,
                              "belajar"
                            );
                          }}
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

            {/* Ruang Belajar Detail */}
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