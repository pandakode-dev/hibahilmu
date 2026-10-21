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
  CheckCircle2,
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
  daftarAkun,
  setDaftarAkun,
  logAktivitas,
  catatLog,
  daftarJenjang,
  tambahMateriDariGuru,
  poinXP,
  materiSelesai,
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

  // FUNGSI LOGIN CEPAT (100% BEBAS ERROR)
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") {
      setPesanError(
        "Akun kamu masih menunggu persetujuan (Approval) dari Admin Panda Kode."
      );
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
      `Berhasil masuk (Login) ke Dashboard ${akun.role.toUpperCase()}`,
      "akun"
    );
  };

  // FUNGSI LOGIN MANUAL
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");

    const akunDitemukan = daftarAkun.find(
      (a) =>
        a.email.toLowerCase() === emailLogin.toLowerCase() &&
        a.password === passwordLogin
    );

    if (!akunDitemukan) {
      setPesanError("Email atau Password tidak ditemukan. Silakan periksa kembali.");
      return;
    }

    if (akunDitemukan.status === "pending") {
      setPesanError(
        "⏳ Akun kamu sudah terdaftar, namun sedang menunggu persetujuan (Approval) dari Admin."
      );
      return;
    }

    if (akunDitemukan.status === "rejected") {
      setPesanError("❌ Maaf, pengajuan akun kamu tidak disetujui oleh Admin.");
      return;
    }

    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(
      akunDitemukan.nama,
      akunDitemukan.role,
      `Login ke dalam sistem sebagai ${akunDitemukan.role.toUpperCase()}`,
      "akun"
    );
  };

  // FUNGSI PENDAFTARAN SISWA / GURU BARU (STATUS AWAL: PENDING)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");

    const sudahAda = daftarAkun.some(
      (a) => a.email.toLowerCase() === emailReg.toLowerCase()
    );
    if (sudahAda) {
      setPesanError("Email ini sudah terdaftar. Silakan gunakan email lain.");
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
        infoReg || (roleReg === "guru" ? "Relawan Pengajar Umum" : "Siswa Semangat"),
      waktuDaftar: `Hari ini, ${waktuSekarang}`,
    };

    const daftarTerbaru = [akunBaru, ...daftarAkun];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      namaReg,
      roleReg,
      `Mendaftar akun baru sebagai ${roleReg.toUpperCase()} (Menunggu Approval Admin)`,
      "akun"
    );

    setPesanSukses(
      "✅ Pendaftaran berhasil dikirim! Akunmu kini berstatus MENUNGGU PERSETUJUAN ADMIN. (Coba login sebagai Admin di sebelah kanan untuk menyetujui akun ini!)."
    );
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  // FUNGSI ADMIN: SETUJUI ATAU TOLAK PENDAFTARAN
  const ubahStatusAkun = (idTarget: string, statusBaru: "approved" | "rejected") => {
    const target = daftarAkun.find((a) => a.id === idTarget);
    if (!target) return;

    const daftarTerbaru = daftarAkun.map((akun) =>
      akun.id === idTarget ? { ...akun, status: statusBaru } : akun
    );
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      userLogin?.nama || "Admin Panda Kode",
      "admin",
      `${
        statusBaru === "approved" ? "Menyetujui (Approve)" : "Menolak (Reject)"
      } pendaftaran ${target.role.toUpperCase()} atas nama ${target.nama}`,
      "akun"
    );
  };

  // FUNGSI ADMIN: HAPUS AKUN
  const hapusAkun = (idTarget: string) => {
    const target = daftarAkun.find((a) => a.id === idTarget);
    if (!target || target.role === "admin") return;

    const daftarTerbaru = daftarAkun.filter((a) => a.id !== idTarget);
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));

    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Menghapus akun ${target.nama} (${target.role})`,
      "akun"
    );
  };

  // FUNGSI GURU: TAMBAH MATERI & KUIS LENGKAP DARI DASHBOARD GURU
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
        tanya:
          pertanyaanKuis ||
          `Apa kesimpulan utama dari materi ${judulMateri} yang diajarkan oleh ${userLogin.nama}?`,
        opsi: [
          opsiA || "Konsep dasar sangat jelas dan mudah dipahami",
          opsiB || "Perlu latihan soal tambahan",
          opsiC || "Bagian dari kurikulum lanjutan",
          opsiD || "Semua jawaban perlu ditinjau",
        ],
        jawabanBenar: kunciKuis,
        pembahasan: `Materi ini disusun langsung oleh Guru Relawan ${userLogin.nama} untuk membantu pemahaman siswa secara gratis.`,
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
  // TAMPILAN 1: JIKA PENGGUNA BELUM LOGIN (HALAMAN MASUK & PENDAFTARAN)
  // ============================================================================
  if (!userLogin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Kolom Kiri: Form Login / Pendaftaran */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => {
                setModeAuth("login");
                setPesanError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                modeAuth === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <KeyRound className="w-4 h-4" /> Masuk ke Dashboard
            </button>
            <button
              onClick={() => {
                setModeAuth("register");
                setPesanError("");
                setPesanSukses("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                modeAuth === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus className="w-4 h-4" /> Daftar Siswa / Guru Baru
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
                <h2 className="text-2xl font-black text-slate-900">
                  Selamat Datang di Portal HibahIlmu
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Masuk sesuai peranmu (Admin, Guru Relawan, atau Siswa) untuk membuka dashboard khusus.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder="Contoh: admin@hibahilmu.id"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <input
                  type="password"
                  required
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold py-3.5 rounded-xl shadow-md hover:opacity-95 transition text-sm"
              >
                🔐 Masuk Sekarang
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Pendaftaran Siswa & Guru Relawan
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Demi keamanan & kualitas komunitas, setiap pendaftaran akan diverifikasi (Approval) oleh Admin terlebih dahulu.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleReg("siswa")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    roleReg === "siswa"
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-sm text-slate-900">
                    🎓 Daftar Sebagai Siswa
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Akses rapor belajar, kuis, catatan & tanya PR gratis.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleReg("guru")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    roleReg === "guru"
                      ? "border-indigo-600 bg-indigo-50/70"
                      : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-sm text-slate-900">
                    👨‍🏫 Daftar Sebagai Guru
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Bikin modul kelas, rumus, video & amal jariyah.
                  </div>
                </button>
              </div>

              <input
                type="text"
                required
                value={namaReg}
                onChange={(e) => setNamaReg(e.target.value)}
                placeholder="Nama Lengkap (beserta gelar jika Guru)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <input
                type="email"
                required
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="Alamat Email Aktif..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <input
                type="password"
                required
                value={passwordReg}
                onChange={(e) => setPasswordReg(e.target.value)}
                placeholder="Buat Password..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <input
                type="text"
                required
                value={infoReg}
                onChange={(e) => setInfoReg(e.target.value)}
                placeholder={
                  roleReg === "guru"
                    ? "Bidang Keahlian / Mata Pelajaran (contoh: Guru Matematika SMA)"
                    : "Asal Sekolah / Jenjang Kelas (contoh: Kelas 10 SMA Negeri 1)"
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md transition text-sm"
              >
                📨 Ajukan Pendaftaran ke Admin
              </button>
            </form>
          )}
        </div>

        {/* Kolom Kanan: Kotak Demo Login Instan 1-Klik */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              ⚡ Mode Pengujian Cepat
            </span>
            <h3 className="text-xl font-black mt-3 mb-2">
              Coba Masuk 3 Peran Berbeda (1-Klik)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Untuk memudahkan kamu menguji perbedaan tampilan antara <strong>Dashboard Admin</strong>, <strong>Dashboard Guru</strong>, dan <strong>Dashboard Siswa</strong> tanpa perlu mengetik email, klik salah satu tombol di bawah ini:
            </p>

            <div className="space-y-3">
              {daftarAkun
                .filter((a) => a.status === "approved")
                .map((akun) => (
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
                      <div className="text-xs text-slate-300 mt-0.5">
                        {akun.email} • Pass: {akun.password}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      Masuk →
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-300">
            💡 <strong>Tips Tes Approval:</strong> Coba daftar akun baru di sebelah kiri, lalu klik masuk sebagai <strong>Admin Panda Kode</strong> untuk menyetujui (Approve) akun tersebut!
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // TAMPILAN 2: DASHBOARD KHUSUS ADMIN (APPROVAL & LOG AKTIVITAS)
  // ============================================================================
  if (userLogin.role === "admin") {
    const antreanPending = daftarAkun.filter((a) => a.status === "pending");
    const totalGuru = daftarAkun.filter(
      (a) => a.role === "guru" && a.status === "approved"
    ).length;
    const totalSiswa = daftarAkun.filter(
      (a) => a.role === "siswa" && a.status === "approved"
    ).length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              👑 Panel Super Admin • Panda Kode
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">
              Pusat Kendali & Audit HibahIlmu
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Kelola persetujuan pendaftaran Guru & Siswa serta pantau seluruh aktivitas belajar secara real-time.
            </p>
          </div>
          <button
            onClick={() => {
              catatLog(userLogin.nama, "admin", "Keluar (Logout) dari Panel Admin", "akun");
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition shadow-md"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Menunggu Approval
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {antreanPending.length} Akun
            </div>
            <div className="text-xs text-slate-500 mt-1">Butuh verifikasi kamu</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Guru Relawan Aktif
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {totalGuru} Guru
            </div>
            <div className="text-xs text-slate-500 mt-1">Terverifikasi mengajar</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Siswa Terdaftar
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {totalSiswa} Siswa
            </div>
            <div className="text-xs text-slate-500 mt-1">Aktif menuntut ilmu</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Total Aktivitas Tercatat
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {logAktivitas.length} Log
            </div>
            <div className="text-xs text-slate-500 mt-1">Rekam jejak guru & murid</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" /> Antrean Persetujuan Akun Baru ({antreanPending.length})
                </h2>
              </div>

              {antreanPending.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-500">
                  🎉 Semua pendaftaran sudah diverifikasi! Tidak ada antrean yang menunggu.
                </div>
              ) : (
                <div className="space-y-3">
                  {antreanPending.map((calon) => (
                    <div
                      key={calon.id}
                      className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {calon.nama}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              calon.role === "guru"
                                ? "bg-indigo-600 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            Calon {calon.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {calon.email} • <strong>{calon.infoTambahan}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Waktu daftar: {calon.waktuDaftar}
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => ubahStatusAkun(calon.id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-xs transition"
                        >
                          <UserCheck className="w-4 h-4" /> Setujui
                        </button>
                        <button
                          onClick={() => ubahStatusAkun(calon.id, "rejected")}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                        >
                          <UserX className="w-4 h-4" /> Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">
                📋 Daftar Seluruh Akun Guru & Siswa
              </h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {daftarAkun.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {item.nama}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {item.role}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.email} • {item.infoTambahan}
                      </div>
                    </div>

                    {item.role !== "admin" && (
                      <div className="flex items-center gap-1.5">
                        {item.status !== "approved" && (
                          <button
                            onClick={() => ubahStatusAkun(item.id, "approved")}
                            className="text-[11px] bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-lg"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => hapusAkun(item.id)}
                          title="Hapus Akun"
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" /> Log Aktivitas Guru & Murid
                  </h2>
                  <p className="text-xs text-slate-500">
                    Memantau setiap kegiatan belajar, kuis, dan unggahan materi secara langsung
                  </p>
                </div>

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {["semua", "guru", "siswa", "admin"].map((peran) => (
                    <button
                      key={peran}
                      onClick={() => setFilterLog(peran)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${
                        filterLog === peran
                          ? "bg-slate-900 text-white"
                          : "text-slate-600"
                      }`}
                    >
                      {peran}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
                {logAktivitas
                  .filter(
                    (l) => filterLog === "semua" || l.rolePelaku === filterLog
                  )
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              log.rolePelaku === "guru"
                                ? "bg-indigo-100 text-indigo-800"
                                : log.rolePelaku === "siswa"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {log.rolePelaku}
                          </span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {log.namaPelaku}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                          {log.aksi}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {log.waktu}
                      </span>
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
  // TAMPILAN 3: DASHBOARD KHUSUS GURU RELAWAN
  // ============================================================================
  if (userLogin.role === "guru") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
              👨‍🏫 Dashboard Guru Relawan • {userLogin.infoTambahan}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">
              Selamat Mengajar, {userLogin.nama}!
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm">
              Setiap modul video, rumus, dan kuis yang Anda susun di sini akan langsung tampil di Ruang Kelas siswa dan tercatat di Log Aktivitas.
            </p>
          </div>
          <button
            onClick={() => {
              catatLog(userLogin.nama, "guru", "Keluar (Logout) dari Dashboard Guru", "akun");
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" /> Studio Pembuatan Materi & Kuis Baru
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Lengkapi formulir pengajaran di bawah ini untuk menerbitkan modul baru ke jenjang pendidikan terkait.
            </p>

            {notifGuru && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-sm">
                🎉 Alhamdulillah! Materi dan Kuis berhasil diterbitkan ke Ruang Kelas Siswa!
              </div>
            )}

            <form onSubmit={handleGuruBuatMateri} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Target Jenjang Kelas
                  </label>
                  <select
                    value={jenjangPilih}
                    onChange={(e) => setJenjangPilih(e.target.value)}
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
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={levelMateri}
                    onChange={(e) =>
                      setLevelMateri(e.target.value as "Pemula" | "Menengah" | "Mahir")
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="Pemula">Pemula (Dasar)</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir / Olimpiade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={judulMateri}
                  onChange={(e) => setJudulMateri(e.target.value)}
                  placeholder="Judul Bab / Materi Pelajaran..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  required
                  value={mapelMateri}
                  onChange={(e) => setMapelMateri(e.target.value)}
                  placeholder="Nama Mata Pelajaran (misal: Biologi)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <input
                type="text"
                required
                value={videoMateri}
                onChange={(e) => setVideoMateri(e.target.value)}
                placeholder="Link Video YouTube Penjelasan (https://www.youtube.com/watch?v=...)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <textarea
                rows={3}
                required
                value={rangkumanMateri}
                onChange={(e) => setRangkumanMateri(e.target.value)}
                placeholder="Tuliskan rangkuman penjelasan materi untuk dibaca siswa..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />

              <input
                type="text"
                value={rumusMateri}
                onChange={(e) => setRumusMateri(e.target.value)}
                placeholder="Papan Rumus Penting (Opsional, contoh: v = s / t)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
                <div className="text-xs font-extrabold uppercase text-indigo-800">
                  📝 Buat Latihan Kuis untuk Materi Ini
                </div>
                <input
                  type="text"
                  required
                  value={pertanyaanKuis}
                  onChange={(e) => setPertanyaanKuis(e.target.value)}
                  placeholder="Tuliskan pertanyaan kuis untuk menguji siswa..."
                  className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm font-semibold"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={opsiA}
                    onChange={(e) => setOpsiA(e.target.value)}
                    placeholder="Pilihan A"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="text"
                    required
                    value={opsiB}
                    onChange={(e) => setOpsiB(e.target.value)}
                    placeholder="Pilihan B"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="text"
                    required
                    value={opsiC}
                    onChange={(e) => setOpsiC(e.target.value)}
                    placeholder="Pilihan C"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="text"
                    required
                    value={opsiD}
                    onChange={(e) => setOpsiD(e.target.value)}
                    placeholder="Pilihan D"
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-900 mb-1">
                    Pilih Kunci Jawaban yang Benar:
                  </label>
                  <select
                    value={kunciKuis}
                    onChange={(e) => setKunciKuis(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold"
                  >
                    <option value={0}>Pilihan A Benar</option>
                    <option value={1}>Pilihan B Benar</option>
                    <option value={2}>Pilihan C Benar</option>
                    <option value={3}>Pilihan D Benar</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:opacity-95 transition text-sm"
              >
                🚀 Terbitkan Materi & Kuis ke Ruang Kelas Siswa
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Statistik Modul Kurikulum Saat Ini
              </h3>
              <div className="space-y-2.5">
                {daftarJenjang.map((j) => (
                  <div
                    key={j.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-slate-800">{j.nama}</span>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${j.badge}`}>
                      {j.kelas.length} Modul Aktif
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-3">
                🕒 Log Aktivitas Terbaru Siswa & Guru
              </h3>
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {logAktivitas.slice(0, 8).map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-slate-50 border text-xs">
                    <span className="font-bold text-indigo-700">{l.namaPelaku}: </span>
                    <span className="text-slate-700">{l.aksi}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{l.waktu}</div>
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
  // TAMPILAN 4: DASHBOARD KHUSUS SISWA
  // ============================================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">
            🎓 Dashboard Rapor Siswa • {userLogin.infoTambahan}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-1">
            Semangat Belajar, {userLogin.nama}!
          </h1>
          <p className="text-emerald-50 text-xs sm:text-sm">
            Pantau pencapaian XP, daftar modul yang telah kamu selesaikan, dan lencana prestasimu di sini.
          </p>
        </div>
        <button
          onClick={() => {
            catatLog(userLogin.nama, "siswa", "Keluar (Logout) dari Dashboard Siswa", "akun");
            setUserLogin(null);
            localStorage.removeItem("hibah_user_aktif");
          }}
          className="bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" /> Keluar Akun
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-100 text-amber-600">
            <Flame className="w-8 h-8 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">
              Total Poin Keaktifan
            </div>
            <div className="text-3xl font-black text-slate-900">{poinXP} XP</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">
              Modul Selesai Dipelajari
            </div>
            <div className="text-3xl font-black text-slate-900">
              {materiSelesai.length} Materi
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-100 text-purple-600">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">
              Pangkat Pelajar Saat Ini
            </div>
            <div className="text-xl font-black text-purple-700">
              {poinXP >= 300
                ? "🌟 Cendekiawan Muda"
                : poinXP >= 200
                ? "🚀 Penjelajah Ilmu"
                : "🌱 Tunas Pembelajar"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> Riwayat Aktivitas Belajarmu
        </h3>
        <div className="space-y-3">
          {logAktivitas
            .filter((l) => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa")
            .slice(0, 8)
            .map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  ✅ {log.aksi}
                </span>
                <span className="text-xs font-mono text-slate-400">{log.waktu}</span>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}