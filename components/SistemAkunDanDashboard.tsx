"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
  Activity,
  GraduationCap,
  BookOpen,
  PlusCircle,
  Clock,
  LogOut,
  KeyRound,
  UserPlus,
  Award,
  Flame,
  Sparkles,
  Trash2,
} from "lucide-react";
import { JenjangItem, KelasItem } from "@/data/kurikulum";

export interface AkunPengguna {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: "admin" | "guru" | "siswa";
  status: "pending" | "approved" | "rejected";
  infoTambahan: string;
  waktuDaftar: string;
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  namaPelaku: string;
  rolePelaku: "admin" | "guru" | "siswa";
  aksi: string;
  kategori: "belajar" | "materi" | "akun" | "komunitas";
}

interface SistemDashboardProps {
  userLogin: AkunPengguna | null;
  setUserLogin: (user: AkunPengguna | null) => void;
  daftarAkun: AkunPengguna[];
  setDaftarAkun: React.Dispatch<React.SetStateAction<AkunPengguna[]>>;
  logAktivitas: LogAktivitas[];
  catatLog: (
    nama: string,
    role: "admin" | "guru" | "siswa",
    aksi: string,
    kategori: "belajar" | "materi" | "akun" | "komunitas"
  ) => void;
  daftarJenjang: JenjangItem[];
  tambahMateriDariGuru: (
    jenjangId: string,
    modulBaru: KelasItem,
    namaGuru: string
  ) => void;
  poinXP: number;
  materiSelesai: string[];
}

export default function SistemAkunDanDashboard({
  userLogin,
  setUserLogin,
  daftarAkun = [],
  setDaftarAkun,
  logAktivitas = [],
  catatLog,
  daftarJenjang = [],
  tambahMateriDariGuru,
  poinXP = 0,
  materiSelesai = [],
}: SistemDashboardProps) {
  const [modeAuth, setModeAuth] = useState<"login" | "register">("login");

  // State Form Login
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  // State Form Register (Pendaftaran Siswa & Guru)
  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru">("siswa");
  const [infoReg, setInfoReg] = useState("");

  // State Filter di Dashboard Admin
  const [filterLog, setFilterLog] = useState<string>("semua");

  // State Form Tambah Materi Khusus di Dashboard Guru
  const [jenjangPilih, setJenjangPilih] = useState("sd");
  const [judulMateri, setJudulMateri] = useState("");
  const [mapelMateri, setMapelMateri] = useState("");
  const [levelMateri, setLevelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [videoMateri, setVideoMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [rumusMateri, setRumusMateri] = useState("");
  const [pertanyaanKuis, setPertanyaanKuis] = useState("");
  const [opsiA, setOpsiA] = useState("");
  const [opsiB, setOpsiB] = useState("");
  const [opsiC, setOpsiC] = useState("");
  const [opsiD, setOpsiD] = useState("");
  const [kunciKuis, setKunciKuis] = useState<number>(0);
  const [notifGuru, setNotifGuru] = useState(false);

  // FUNGSI LOGIN CEPAT
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") {
      setPesanError("Akun kamu masih menunggu persetujuan (Approval) dari Admin.");
      return;
    }
    if (akun.status === "rejected") {
      setPesanError("Maaf, pendaftaran akun ini ditolak oleh Admin.");
      return;
    }
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(
      akun.nama,
      akun.role,
      `Berhasil masuk ke Dashboard ${akun.role.toUpperCase()}`,
      "akun"
    );
  };

  // FUNGSI LOGIN MANUAL
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");

    const safeAkunList = daftarAkun || [];
    const akunDitemukan = safeAkunList.find(
      (a) =>
        a.email.toLowerCase() === emailLogin.toLowerCase() &&
        a.password === passwordLogin
    );

    if (!akunDitemukan) {
      setPesanError("Email atau Password tidak ditemukan.");
      return;
    }

    if (akunDitemukan.status === "pending") {
      setPesanError("⏳ Akun kamu sedang menunggu persetujuan Admin.");
      return;
    }

    if (akunDitemukan.status === "rejected") {
      setPesanError("❌ Maaf, pengajuan akun kamu ditolak.");
      return;
    }

    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(
      akunDitemukan.nama,
      akunDitemukan.role,
      `Login ke sistem sebagai ${akunDitemukan.role.toUpperCase()}`,
      "akun"
    );
  };

  // FUNGSI PENDAFTARAN SISWA / GURU BARU
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");

    const safeAkunList = daftarAkun || [];
    const sudahAda = safeAkunList.some(
      (a) => a.email.toLowerCase() === emailReg.toLowerCase()
    );
    if (sudahAda) {
      setPesanError("Email ini sudah terdaftar.");
      return;
    }

    const waktuSekarang = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg,
      email: emailReg,
      password: passwordReg,
      role: roleReg,
      status: "pending",
      infoTambahan:
        infoReg || (roleReg === "guru" ? "Relawan Pengajar" : "Siswa"),
      waktuDaftar: `Hari ini, ${waktuSekarang}`,
    };

    const daftarTerbaru = [akunBaru, ...safeAkunList];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      namaReg,
      roleReg,
      `Mendaftar akun baru sebagai ${roleReg.toUpperCase()} (Menunggu Approval)`,
      "akun"
    );

    setPesanSukses(
      "✅ Pendaftaran berhasil dikirim! Menunggu persetujuan Admin."
    );
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  // FUNGSI ADMIN: APPROVAL / REJECT
  const ubahStatusAkun = (idTarget: string, statusBaru: "approved" | "rejected") => {
    const safeAkunList = daftarAkun || [];
    const target = safeAkunList.find((a) => a.id === idTarget);
    if (!target) return;

    const daftarTerbaru = safeAkunList.map((akun) =>
      akun.id === idTarget ? { ...akun, status: statusBaru } : akun
    );
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `${statusBaru === "approved" ? "Menyetujui" : "Menolak"} pendaftaran ${target.role.toUpperCase()} atas nama ${target.nama}`,
      "akun"
    );
  };

  // FUNGSI ADMIN: HAPUS AKUN
  const hapusAkun = (idTarget: string) => {
    const safeAkunList = daftarAkun || [];
    const target = safeAkunList.find((a) => a.id === idTarget);
    if (!target || target.role === "admin") return;

    const daftarTerbaru = safeAkunList.filter((a) => a.id !== idTarget);
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Menghapus akun ${target.nama} (${target.role})`,
      "akun"
    );
  };

  // FUNGSI GURU: TAMBAH MATERI
  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin) return;

    let finalEmbed = videoMateri;
    if (videoMateri.includes("watch?v=")) {
      finalEmbed = videoMateri.replace("watch?v=", "embed/");
    } else if (videoMateri.includes("youtu.be/")) {
      finalEmbed = videoMateri.replace("youtu.be/", "www.youtube.com/embed/");
    }

    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(),
      judul: `${judulMateri} (Oleh: ${userLogin.nama})`,
      kategori: mapelMateri || userLogin.infoTambahan,
      level: levelMateri,
      durasi: "12 Menit",
      videoUrl: finalEmbed,
      rangkuman: rangkumanMateri,
      rumusMatematika: rumusMateri || undefined,
      kuis: {
        tanya: pertanyaanKuis || `Kesimpulan materi ${judulMateri}?`,
        opsi: [opsiA || "Paham", opsiB || "Kurang", opsiC || "Lanjut", opsiD || "Review"],
        jawabanBenar: kunciKuis,
        pembahasan: `Disusun oleh Guru ${userLogin.nama}.`,
      },
    };

    tambahMateriDariGuru(jenjangPilih, modulBaru, userLogin.nama);
    setNotifGuru(true);
    setJudulMateri("");
    setMapelMateri("");
    setVideoMateri("");
    setRangkumanMateri("");
    setRumusMateri("");
    setPertanyaanKuis("");
    setOpsiA("");
    setOpsiB("");
    setOpsiC("");
    setOpsiD("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  // ============================================================================
  // TAMPILAN 1: BELUM LOGIN
  // ============================================================================
  if (!userLogin) {
    const safeApprovedList = (daftarAkun || []).filter((a) => a.status === "approved");

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => {
                setModeAuth("login");
                setPesanError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                modeAuth === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              <KeyRound className="w-4 h-4" /> Masuk
            </button>
            <button
              onClick={() => {
                setModeAuth("register");
                setPesanError("");
                setPesanSukses("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                modeAuth === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              <UserPlus className="w-4 h-4" /> Daftar Baru
            </button>
          </div>

          {pesanError && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold">
              {pesanError}
            </div>
          )}

          {pesanSukses && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold">
              {pesanSukses}
            </div>
          )}

          {modeAuth === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Masuk ke Portal</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Masukkan email dan sandi akunmu.</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder="admin@hibahilmu.id"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="••••••"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl shadow-md text-sm"
              >
                🔐 Masuk Sekarang
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Pendaftaran Akun</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Akun memerlukan persetujuan Admin.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleReg("siswa")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    roleReg === "siswa" ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-sm text-slate-900">🎓 Siswa</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleReg("guru")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    roleReg === "guru" ? "border-indigo-600 bg-indigo-50/70" : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-sm text-slate-900">👨‍🏫 Guru</div>
                </button>
              </div>
              <input
                type="text"
                required
                value={namaReg}
                onChange={(e) => setNamaReg(e.target.value)}
                placeholder="Nama Lengkap..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
              <input
                type="email"
                required
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="Email Aktif..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
              <input
                type="password"
                required
                value={passwordReg}
                onChange={(e) => setPasswordReg(e.target.value)}
                placeholder="Password..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
              <input
                type="text"
                required
                value={infoReg}
                onChange={(e) => setInfoReg(e.target.value)}
                placeholder={roleReg === "guru" ? "Mata Pelajaran..." : "Asal Sekolah..."}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-extrabold py-3.5 rounded-xl shadow-md text-sm"
              >
                📨 Ajukan Pendaftaran
              </button>
            </form>
          )}
        </div>

        {/* Kolom Kanan: Demo Login 1-Klik */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              ⚡ Mode Demo 1-Klik
            </span>
            <h3 className="text-xl font-black mt-3 mb-2">Coba Masuk Cepat</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Klik salah satu akun di bawah untuk langsung mencoba dashboard Admin, Guru, atau Siswa:
            </p>

            <div className="space-y-3">
              {safeApprovedList.map((akun) => (
                <button
                  key={akun.id}
                  onClick={() => loginCepat(akun)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{akun.nama}</span>
                      <span className="text-[10px] uppercase bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-md">
                        {akun.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">{akun.email}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-300">Masuk →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // TAMPILAN 2: DASHBOARD ADMIN
  // ============================================================================
  if (userLogin.role === "admin") {
    const safeAkunList = daftarAkun || [];
    const safeLogList = logAktivitas || [];
    const antreanPending = safeAkunList.filter((a) => a.status === "pending");
    const totalGuru = safeAkunList.filter((a) => a.role === "guru" && a.status === "approved").length;
    const totalSiswa = safeAkunList.filter((a) => a.role === "siswa" && a.status === "approved").length;

    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              👑 Panel Super Admin
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">Pusat Kendali HibahIlmu</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Persetujuan akun & pemantauan log aktivitas rekam jejak.</p>
          </div>
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-rose-600 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border shadow-2xs">
            <div className="text-xs font-bold text-amber-600 uppercase">Menunggu Approval</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{antreanPending.length} Akun</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border shadow-2xs">
            <div className="text-xs font-bold text-indigo-600 uppercase">Guru Aktif</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{totalGuru} Guru</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border shadow-2xs">
            <div className="text-xs font-bold text-emerald-600 uppercase">Siswa Terdaftar</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{totalSiswa} Siswa</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border shadow-2xs">
            <div className="text-xs font-bold text-rose-600 uppercase">Total Log</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{safeLogList.length} Log</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Antrean Approval ({antreanPending.length})
              </h2>
              {antreanPending.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                  🎉 Tidak ada antrean pending.
                </div>
              ) : (
                <div className="space-y-3">
                  {antreanPending.map((calon) => (
                    <div key={calon.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex justify-between items-center gap-2">
                      <div>
                        <div className="font-extrabold text-sm">{calon.nama} ({calon.role})</div>
                        <div className="text-xs text-slate-600">{calon.email} • {calon.infoTambahan}</div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => ubahStatusAkun(calon.id, "approved")} className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl">
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button onClick={() => ubahStatusAkun(calon.id, "rejected")} className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl">
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">📋 Daftar Seluruh Akun</h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {safeAkunList.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold">{item.nama}</span> ({item.role}) - <span className="uppercase text-emerald-700 font-bold">{item.status}</span>
                    </div>
                    {item.role !== "admin" && (
                      <button onClick={() => hapusAkun(item.id)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" /> Log Aktivitas Real-Time
              </h2>
              <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-1">
                {safeLogList
                  .filter((l) => filterLog === "semua" || l.rolePelaku === filterLog)
                  .map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border flex justify-between items-start gap-2 text-xs">
                      <div>
                        <span className="font-bold uppercase text-indigo-700">[{log.rolePelaku}]</span> <span className="font-bold">{log.namaPelaku}:</span> {log.aksi}
                      </div>
                      <span className="font-mono text-slate-400 shrink-0">{log.waktu}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // TAMPILAN 3: DASHBOARD GURU
  // ============================================================================
  if (userLogin.role === "guru") {
    const safeLogList = logAktivitas || [];
    const safeJenjangList = daftarJenjang || [];

    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">👨‍🏫 Dashboard Guru</span>
            <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">Selamat Mengajar, {userLogin.nama}!</h1>
            <p className="text-indigo-100 text-xs sm:text-sm">Terbitkan modul dan kuis untuk para siswa.</p>
          </div>
          <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/15 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" /> Studio Buat Materi & Kuis
            </h2>
            {notifGuru && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs">
                🎉 Materi berhasil diterbitkan!
              </div>
            )}
            <form onSubmit={handleGuruBuatMateri} className="space-y-3">
              <select value={jenjangPilih} onChange={(e) => setJenjangPilih(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-semibold">
                {safeJenjangList.map((j) => (
                  <option key={j.id} value={j.id}>{j.nama}</option>
                ))}
              </select>
              <input type="text" required value={judulMateri} onChange={(e) => setJudulMateri(e.target.value)} placeholder="Judul Materi..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-semibold" />
              <input type="text" required value={mapelMateri} onChange={(e) => setMapelMateri(e.target.value)} placeholder="Mata Pelajaran..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-semibold" />
              <input type="text" required value={videoMateri} onChange={(e) => setVideoMateri(e.target.value)} placeholder="Link Video YouTube..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-semibold" />
              <textarea rows={2} required value={rangkumanMateri} onChange={(e) => setRangkumanMateri(e.target.value)} placeholder="Rangkuman..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-semibold" />
              
              <div className="p-3 bg-indigo-50/50 border rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-900">📝 Soal Kuis Singkat</div>
                <input type="text" required value={pertanyaanKuis} onChange={(e) => setPertanyaanKuis(e.target.value)} placeholder="Pertanyaan kuis..." className="w-full p-2.5 bg-white border rounded-xl text-xs font-semibold" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required value={opsiA} onChange={(e) => setOpsiA(e.target.value)} placeholder="Opsi A" className="p-2 bg-white border rounded-lg text-xs" />
                  <input type="text" required value={opsiB} onChange={(e) => setOpsiB(e.target.value)} placeholder="Opsi B" className="p-2 bg-white border rounded-lg text-xs" />
                  <input type="text" required value={opsiC} onChange={(e) => setOpsiC(e.target.value)} placeholder="Opsi C" className="p-2 bg-white border rounded-lg text-xs" />
                  <input type="text" required value={opsiD} onChange={(e) => setOpsiD(e.target.value)} placeholder="Opsi D" className="p-2 bg-white border rounded-lg text-xs" />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-extrabold py-3.5 rounded-xl shadow-md text-sm">
                🚀 Terbitkan Materi
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border shadow-2xs">
              <h3 className="font-extrabold text-base mb-3">🕒 Log Aktivitas</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {safeLogList.slice(0, 6).map((l) => (
                  <div key={l.id} className="p-2.5 rounded-xl bg-slate-50 border text-xs">
                    <span className="font-bold text-indigo-700">{l.namaPelaku}:</span> {l.aksi}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // TAMPILAN 4: DASHBOARD SISWA
  // ============================================================================
  const safeLogList = logAktivitas || [];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">🎓 Dashboard Siswa</span>
          <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">Semangat Belajar, {userLogin.nama}!</h1>
          <p className="text-emerald-50 text-xs sm:text-sm">Pantau pencapaian XP dan modul selesai di sini.</p>
        </div>
        <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/15 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-100 text-amber-600"><Flame className="w-8 h-8 fill-amber-500" /></div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Total XP</div>
            <div className="text-3xl font-black text-slate-900">{poinXP} XP</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600"><Award className="w-8 h-8" /></div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Modul Selesai</div>
            <div className="text-3xl font-black text-slate-900">{materiSelesai.length} Materi</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-100 text-purple-600"><Sparkles className="w-8 h-8" /></div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Pangkat</div>
            <div className="text-lg font-black text-purple-700">
              {poinXP >= 300 ? "🌟 Cendekiawan" : "🌱 Pembelajar"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xs">
        <h3 className="text-lg font-black text-slate-900 mb-4"> Riwayat Aktivitasmu</h3>
        <div className="space-y-3">
          {safeLogList
            .filter((l) => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa")
            .slice(0, 8)
            .map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">✅ {log.aksi}</span>
                <span className="font-mono text-slate-400">{log.waktu}</span>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}