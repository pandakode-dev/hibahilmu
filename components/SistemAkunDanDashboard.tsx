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

const AKUN_DEFAULT: AkunPengguna[] = [
  {
    id: "adm-1",
    nama: "Admin Panda Kode",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "approved",
    infoTambahan: "Founder & Super Admin HibahIlmu",
    waktuDaftar: "Permanen",
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
];

const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "06:30 WIB",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mengunggah modul materi baru pada jenjang SMA",
    kategori: "materi",
  },
  {
    id: "log-2",
    waktu: "Kemarin",
    namaPelaku: "Aisyah Putri",
    rolePelaku: "siswa",
    aksi: "Menyelesaikan modul kuis interaktif (+50 XP)",
    kategori: "belajar",
  },
];

export default function AplikasiHibahIlmu() {
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(DATA_JENJANG_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("Semua");

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);

  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);

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
      const safePrev = prev || [];
      const terbaru = [logBaru, ...safePrev];
      localStorage.setItem("hibah_log_aktivitas", JSON.stringify(terbaru));
      return terbaru;
    });
  };

  const lemparkanKonfeti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const tambahXP = (tambahan: number) => {
    setPoinXP((prev) => {
      const totalBaru = (prev || 0) + tambahan;
      localStorage.setItem("hibah_xp", totalBaru.toString());
      return totalBaru;
    });
    lemparkanKonfeti();
  };

  const toggleSelesaiMateri = (kelasId: string) => {
    setMateriSelesai((prev) => {
      const safePrev = prev || [];
      const sudahAda = safePrev.includes(kelasId);
      let daftarBaru: string[];
      if (sudahAda) {
        daftarBaru = safePrev.filter((id) => id !== kelasId);
      } else {
        daftarBaru = [...safePrev, kelasId];
        tambahXP(30);
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
      (prev || []).map((j) =>
        j.id === jenjangId ? { ...j, kelas: [modulBaru, ...j.kelas] } : j
      )
    );
    catatLog(
      namaGuru,
      "guru",
      `Menerbitkan modul materi baru: "${modulBaru.judul}"`,
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

  const safeAkunList = daftarAkun || [];
  const jumlahPending = safeAkunList.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              🐼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-800">
                  HibahIlmu
                </span>
                <span className="text-[10px] uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Pengabdian Masyarakat</p>
            </div>
          </div>

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
                  menuAktif === tab.id ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.ikon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

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
                  : "bg-emerald-600 text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{userLogin ? `Dashboard ${userLogin.role.toUpperCase()}` : "Daftar / Masuk"}</span>
              {jumlahPending > 0 && (
                <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {jumlahPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {menuAktif === "dashboard" && (
          <SistemAkunDanDashboard
            userLogin={userLogin}
            setUserLogin={setUserLogin}
            daftarAkun={safeAkunList}
            setDaftarAkun={setDaftarAkun}
            logAktivitas={logAktivitas}
            catatLog={catatLog}
            daftarJenjang={daftarJenjang}
            tambahMateriDariGuru={tambahMateriDariGuru}
            poinXP={poinXP}
            materiSelesai={materiSelesai}
          />
        )}

        {menuAktif === "tryout" && <FiturTryout tambahXP={tambahXP} />}

        {(menuAktif === "forum" || menuAktif === "transparansi") && (
          <KomunitasDanDonasi
            modeTampilan={menuAktif as "forum" | "transparansi"}
            namaUser={userLogin?.nama || "Pelajar Pengunjung"}
            poinUser={poinXP}
            tambahXP={tambahXP}
          />
        )}

        {menuAktif === "beranda" && (
          <>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12 pt-2">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="text-emerald-600">100% Gratis Selamanya.</span>
                  </h1>
                  <p className="text-slate-600 mb-8">Pilih jenjang pendidikanmu dan mulai belajar interaktif sekarang!</p>
                  <div className="max-w-xl mx-auto relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kataKunci}
                      onChange={(e) => setKataKunci(e.target.value)}
                      placeholder="Cari pelajaran..."
                      className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl shadow-md text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarJenjang
                    .filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase()))
                    .map((jenjang, idx) => (
                      <motion.div
                        key={jenjang.id}
                        whileHover={{ y: -6 }}
                        onClick={() => setJenjangAktif(jenjang)}
                        className="cursor-pointer bg-white rounded-3xl p-6 border shadow-xs hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`} />
                        <div>
                          <div className="flex justify-between mb-5 mt-2">
                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md`}>
                              {renderIkonJenjang(jenjang.ikonNama)}
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}>
                              {jenjang.kelas.length} Modul
                            </span>
                          </div>
                          <h3 className="text-2xl font-extrabold mb-2">{jenjang.nama}</h3>
                          <p className="text-slate-600 text-sm">{jenjang.deskripsi}</p>
                        </div>
                        <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span>Buka Kelas</span>
                          <span>→</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <button
                  onClick={() => setJenjangAktif(null)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border mb-6 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>
                <div className={`rounded-3xl p-8 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8`}>
                  <h1 className="text-3xl font-black mb-2">{jenjangAktif.nama}</h1>
                  <p className="text-white/90 text-sm">{jenjangAktif.deskripsi}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas.map((item) => {
                    const selesai = materiSelesai.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setKelasAktif(item)}
                        className={`bg-white rounded-3xl p-6 border-2 shadow-xs hover:shadow-lg cursor-pointer transition flex flex-col justify-between ${
                          selesai ? "border-emerald-400" : "border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">⚡ {item.level}</span>
                            {selesai && <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">✔ Selesai</span>}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{item.judul}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">{item.rangkuman}</p>
                        </div>
                        <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span className="flex items-center gap-1.5"><PlayCircle className="w-5 h-5" /> Mulai Belajar</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">+50 XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

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

      <footer className="border-t bg-white/70 py-6 text-center text-xs text-slate-500 mt-16">
        Dibangun dengan cinta oleh 🐼 <strong>Panda Kode</strong> • HibahIlmu.id
      </footer>
    </div>
  );
}