"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  KeyRound,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Sparkles,
} from "lucide-react";

export default function HalamanRahasiaRegistrasiAdmin() {
  const [secretPin, setSecretPin] = useState<string>("");
  const [unlocked, setUnlocked] = useState<boolean>(false);

  const [namaAdmin, setNamaAdmin] = useState<string>("Muhammad Saputra");
  const [emailAdmin, setEmailAdmin] = useState<string>("saputra.admin@hibahilmu.id");
  const [passwordAdmin, setPasswordAdmin] = useState<string>("SaputraAdmin2026!");
  const [instansiAdmin, setInstansiAdmin] = useState<string>(
    "Founder & Super Admin HibahIlmu.id"
  );

  const [lihatPassword, setLihatPassword] = useState<boolean>(true);
  const [daftarAkunServer, setDaftarAkunServer] = useState<any[]>([]);
  const [pesanStatus, setPesanStatus] = useState<string>("");
  const [pesanError, setPesanError] = useState<string>("");
  const [sedangProses, setSedangProses] = useState<boolean>(false);

  // Kunci sesi Admin langsung ke semua kemungkinan key localStorage yang dipakai aplikasi utama
  const suntikkanSesiAdminKeBrowser = (akun: any) => {
    try {
      const kemungkinanKeys = [
        "hibahilmu_user_session",
        "hibahilmu_logged_user",
        "hibahilmu_active_user",
        "userLogin",
        "hibahilmu_user",
      ];
      kemungkinanKeys.forEach((k) => {
        localStorage.setItem(k, JSON.stringify(akun));
      });

      // Tambahkan juga ke daftar akun lokal di browser jika aplikasi membacanya dari localStorage
      const rawUsers = localStorage.getItem("hibahilmu_users_db");
      const listLama = rawUsers ? JSON.parse(rawUsers) : [];
      const listBaru = [
        akun,
        ...(Array.isArray(listLama)
          ? listLama.filter((x: any) => x.email !== akun.email)
          : []),
      ];
      localStorage.setItem("hibahilmu_users_db", JSON.stringify(listBaru));
    } catch {}
  };

  const bukaBrankasDenganPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setSedangProses(true);
    try {
      const res = await fetch("/api/secret-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretPin,
          action: "list_admins",
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setUnlocked(true);
        setDaftarAkunServer(json.accounts || []);
        setPesanStatus(json.message);
      } else {
        setPesanError(json.message || "PIN Master Rahasia tidak valid!");
      }
    } catch {
      setPesanError("Gagal menghubungi server.");
    }
    setSedangProses(false);
  };

  const daftarkanAtauResetAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    setPesanStatus("");
    setSedangProses(true);

    try {
      const res = await fetch("/api/secret-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretPin,
          action: "create_or_update_admin",
          nama: namaAdmin,
          email: emailAdmin,
          password: passwordAdmin,
          instansi: instansiAdmin,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setPesanStatus(json.message);
        setDaftarAkunServer(json.accounts || []);
        if (json.adminAccount) {
          suntikkanSesiAdminKeBrowser(json.adminAccount);
        }
      } else {
        setPesanError(json.message || "Gagal mendaftarkan admin.");
      }
    } catch {
      setPesanError("Terjadi gangguan koneksi ke server.");
    }
    setSedangProses(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-400/60 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6">
        {/* Header Rahasia */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                🔒 PRIVATE VAULT • HANYA MUHAMMAD SAPUTRA
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Gerbang Rahasia Registrasi &amp; Pemulihan Super Admin
              </h1>
              <p className="text-xs text-slate-400">
                Halaman ini tersembunyi dari publik (`noindex`) dan dikunci dengan PIN Master Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Langkah 1: Kunci PIN Master */}
        {!unlocked ? (
          <form onSubmit={bukaBrankasDenganPin} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> Masukkan PIN Master Rahasia Anda:
              </label>
              <input
                type="password"
                placeholder="Masukkan NIM Anda (2556102007)..."
                value={secretPin}
                onChange={(e) => setSecretPin(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-amber-400 focus:outline-none font-mono text-base font-black text-white"
              />
              <p className="text-[11px] text-slate-400">
                *Petunjuk untuk Anda sendiri: Gunakan nomor induk mahasiswa Anda atau kode rahasia pribadi.
              </p>
            </div>

            {pesanError && (
              <div className="p-3.5 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs font-bold">
                ❌ {pesanError}
              </div>
            )}

            <button
              type="submit"
              disabled={sedangProses}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Lock className="w-4 h-4" />{" "}
              {sedangProses ? "Memverifikasi PIN..." : "Buka Brankas Super Admin"}
            </button>
          </form>
        ) : (
          /* Langkah 2: Form Pembuatan / Reset Admin & Tabel Kredensial */
          <div className="space-y-6">
            {pesanStatus && (
              <div className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex flex-wrap justify-between items-center gap-3">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  {pesanStatus}
                </span>
                <a
                  href="/"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1"
                >
                  Masuk ke Dashboard Utama <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <form
              onSubmit={daftarkanAtauResetAdmin}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Buat Akun Super Admin Baru / Ubah Password Admin
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Nama Lengkap Super Admin:
                  </label>
                  <input
                    type="text"
                    value={namaAdmin}
                    onChange={(e) => setNamaAdmin(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Jabatan / Instansi:
                  </label>
                  <input
                    type="text"
                    value={instansiAdmin}
                    onChange={(e) => setInstansiAdmin(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-emerald-400">
                    Email Login Admin (Bisa Email Pribadi Anda):
                  </label>
                  <input
                    type="email"
                    value={emailAdmin}
                    onChange={(e) => setEmailAdmin(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border-2 border-emerald-500/60 font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-300">
                    Password Baru Admin:
                  </label>
                  <div className="relative">
                    <input
                      type={lihatPassword ? "text" : "password"}
                      value={passwordAdmin}
                      onChange={(e) => setPasswordAdmin(e.target.value)}
                      className="w-full p-3 pr-10 rounded-xl bg-slate-900 border-2 border-amber-500/60 font-mono font-bold text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setLihatPassword(!lihatPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {lihatPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sedangProses}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />{" "}
                  {sedangProses
                    ? "Menyimpan ke Server & Cloud..."
                    : "Daftarkan & Aktifkan Akun Super Admin Ini Sekarang"}
                </button>
              </div>
            </form>

            {/* Daftar Semua Akun & Password yang Ada di Server Saat Ini */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-sky-400">
                📂 Daftar Kredensial Akun di Database Server Saat Ini ({daftarAkunServer.length} Akun):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {daftarAkunServer.map((acc, i) => (
                  <div
                    key={acc.id || i}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-black text-white flex items-center gap-1.5">
                        <span>{acc.nama}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                            acc.role === "admin"
                              ? "bg-amber-400 text-slate-950"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {acc.role}
                        </span>
                      </div>
                      <div className="font-mono text-emerald-400">
                        Email: {acc.email}
                      </div>
                      <div className="font-mono text-amber-300">
                        Password: {acc.password || "123"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Email: ${acc.email} | Password: ${acc.password || "123"}`
                        );
                        setPesanStatus(`Kredensial ${acc.email} disalin!`);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                      title="Salin Email & Password"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}