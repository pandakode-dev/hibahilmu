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
import { JenjangItem, KelasItem, AkunPengguna, LogAktivitas } from "@/data/kurikulum";

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

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru">("siswa");
  const [infoReg, setInfoReg] = useState("");

  const [filterLog, setFilterLog] = useState<string>("semua");

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

  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") {
      setPesanError("Akun kamu masih menunggu persetujuan Admin.");
      return;
    }
    if (akun.status === "rejected") {
      setPesanError("Maaf, pendaftaran ditolak.");
      return;
    }
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Berhasil masuk ke Dashboard ${akun.role.toUpperCase()}`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const safeAkunList = daftarAkun || [];
    const akunDitemukan = safeAkunList.find(
      (a) => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin
    );

    if (!akunDitemukan) {
      setPesanError("Email atau Password salah.");
      return;
    }
    if (akunDitemukan.status === "pending") {
      setPesanError("⏳ Akun menunggu persetujuan Admin.");
      return;
    }
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Login ke sistem`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const safeAkunList = daftarAkun || [];
    const sudahAda = safeAkunList.some((a) => a.email.toLowerCase() === emailReg.toLowerCase());
    if (sudahAda) {
      setPesanError("Email sudah terdaftar.");
      return;
    }

    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg,
      email: emailReg,
      password: passwordReg,
      role: roleReg,
      status: "pending",
      infoTambahan: infoReg || (roleReg === "guru" ? "Relawan" : "Siswa"),
      waktuDaftar: "Baru saja",
    };

    const daftarTerbaru = [akunBaru, ...safeAkunList];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg, `Mendaftar akun baru (Menunggu Approval)`, "akun");
    setPesanSukses("✅ Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  const ubahStatusAkun = (idTarget: string, statusBaru: "approved" | "rejected") => {
    const safeAkunList = daftarAkun || [];
    const target = safeAkunList.find((a) => a.id === idTarget);
    if (!target) return;

    const daftarTerbaru = safeAkunList.map((akun) =>
      akun.id === idTarget ? { ...akun, status: statusBaru } : akun
    );
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(userLogin?.nama || "Admin", "admin", `${statusBaru === "approved" ? "Menyetujui" : "Menolak"} pendaftaran ${target.nama}`, "akun");
  };

  const hapusAkun = (idTarget: string) => {
    const safeAkunList = daftarAkun || [];
    const daftarTerbaru = safeAkunList.filter((a) => a.id !== idTarget);
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(userLogin?.nama || "Admin", "admin", `Menghapus akun ID ${idTarget}`, "akun");
  };

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin) return;

    let finalEmbed = videoMateri;
    if (videoMateri.includes("watch?v=")) finalEmbed = videoMateri.replace("watch?v=", "embed/");

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
    setTimeout(() => setNotifGuru(false), 3000);
  };

  if (!userLogin) {
    const safeApprovedList = (daftarAkun || []).filter((a) => a.status === "approved");
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border shadow-lg">
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button onClick={() => { setModeAuth("login"); setPesanError(""); }} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${modeAuth === "login" ? "bg-white shadow-xs" : "text-slate-500"}`}>Masuk</button>
            <button onClick={() => { setModeAuth("register"); setPesanError(""); }} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${modeAuth === "register" ? "bg-white shadow-xs" : "text-slate-500"}`}>Daftar</button>
          </div>
          {pesanError && <div className="mb-4 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs">{pesanError}</div>}
          {pesanSukses && <div className="mb-4 p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs">{pesanSukses}</div>}

          {modeAuth === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" required value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} placeholder="Email..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="password" required value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} placeholder="Password..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm">Masuk</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setRoleReg("siswa")} className={`p-3 border rounded-xl font-bold text-xs ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-600" : ""}`}>Siswa</button>
                <button type="button" onClick={() => setRoleReg("guru")} className={`p-3 border rounded-xl font-bold text-xs ${roleReg === "guru" ? "bg-indigo-50 border-indigo-600" : ""}`}>Guru</button>
              </div>
              <input type="text" required value={namaReg} onChange={(e) => setNamaReg(e.target.value)} placeholder="Nama Lengkap..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="email" required value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder="Email..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="password" required value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} placeholder="Password..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="text" required value={infoReg} onChange={(e) => setInfoReg(e.target.value)} placeholder={roleReg === "guru" ? "Mata Pelajaran..." : "Sekolah..."} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm">Daftar Akun</button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-md">Demo 1-Klik</span>
            <h3 className="text-lg font-black mt-2 mb-4">Masuk Cepat:</h3>
            <div className="space-y-2">
              {safeApprovedList.map((akun) => (
                <button key={akun.id} onClick={() => loginCepat(akun)} className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex justify-between items-center text-xs">
                  <span>{akun.nama} ({akun.role})</span>
                  <span className="text-amber-300 font-bold">Masuk →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (userLogin.role === "admin") {
    const safeAkunList = daftarAkun || [];
    const safeLogList = logAktivitas || [];
    const antreanPending = safeAkunList.filter((a) => a.status === "pending");

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Panel Super Admin</h1>
            <p className="text-xs text-slate-300">Persetujuan akun dan pemantauan aktivitas.</p>
          </div>
          <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Keluar</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="text-base font-black mb-3">Antrean Approval ({antreanPending.length})</h2>
            {antreanPending.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 text-xs text-slate-500 rounded-xl">Tidak ada antrean.</div>
            ) : (
              <div className="space-y-2">
                {antreanPending.map((c) => (
                  <div key={c.id} className="p-3 bg-amber-50 border rounded-xl flex justify-between items-center text-xs">
                    <div><b>{c.nama}</b> ({c.role}) - {c.infoTambahan}</div>
                    <div className="flex gap-1">
                      <button onClick={() => ubahStatusAkun(c.id, "approved")} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">Setujui</button>
                      <button onClick={() => ubahStatusAkun(c.id, "rejected")} className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-bold">Tolak</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="text-base font-black mb-3">Log Aktivitas Real-Time</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto text-xs">
              {safeLogList.map((l) => (
                <div key={l.id} className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                  <span><b>[{l.rolePelaku}] {l.namaPelaku}:</b> {l.aksi}</span>
                  <span className="font-mono text-slate-400">{l.waktu}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (userLogin.role === "guru") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-indigo-900 text-white p-6 rounded-3xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Dashboard Guru: {userLogin.nama}</h1>
            <p className="text-xs text-indigo-200">Terbitkan materi dan kuis baru.</p>
          </div>
          <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">Keluar</button>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-2xl">
          <h2 className="text-lg font-black mb-4">Studio Guru</h2>
          {notifGuru && <div className="mb-4 p-3 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl">Materi berhasil diterbitkan!</div>}
          <form onSubmit={handleGuruBuatMateri} className="space-y-3 text-xs">
            <select value={jenjangPilih} onChange={(e) => setJenjangPilih(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-semibold">
              {(daftarJenjang || []).map((j) => <option key={j.id} value={j.id}>{j.nama}</option>)}
            </select>
            <input type="text" required value={judulMateri} onChange={(e) => setJudulMateri(e.target.value)} placeholder="Judul Materi..." className="w-full p-3 bg-slate-50 border rounded-xl" />
            <input type="text" required value={mapelMateri} onChange={(e) => setMapelMateri(e.target.value)} placeholder="Mata Pelajaran..." className="w-full p-3 bg-slate-50 border rounded-xl" />
            <input type="text" required value={videoMateri} onChange={(e) => setVideoMateri(e.target.value)} placeholder="Link YouTube..." className="w-full p-3 bg-slate-50 border rounded-xl" />
            <textarea rows={2} required value={rangkumanMateri} onChange={(e) => setRangkumanMateri(e.target.value)} placeholder="Rangkuman..." className="w-full p-3 bg-slate-50 border rounded-xl" />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm">Terbitkan Materi</button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-emerald-700 text-white p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">Dashboard Siswa: {userLogin.nama}</h1>
          <p className="text-xs text-emerald-100">Total XP: {poinXP} XP • Selesai: {materiSelesai.length} modul</p>
        </div>
        <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">Keluar</button>
      </div>

      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <h2 className="text-base font-black mb-3">Riwayat Aktivitasmu</h2>
        <div className="space-y-2 text-xs">
          {(logAktivitas || [])
            .filter((l) => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa")
            .map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between">
                <span>✅ {log.aksi}</span>
                <span className="font-mono text-slate-400">{log.waktu}</span>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}