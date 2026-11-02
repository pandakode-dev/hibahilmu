"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  GraduationCap,
  KeyRound,
  Mail,
  AlertCircle,
} from "lucide-react";
import { AkunPengguna } from "../types";
import { GoogleSsoButtonWeb } from "./GoogleSsoButtonWeb";

export interface AuthGateSecureProps {
  daftarAkun: AkunPengguna[];
  setDaftarAkun: React.Dispatch<React.SetStateAction<AkunPengguna[]>>;
  onLoginBerhasil: (akun: AkunPengguna) => void;
  modeRoleAwal?: "siswa" | "guru";
}

export function AuthGateSecureView({
  daftarAkun,
  setDaftarAkun,
  onLoginBerhasil,
  modeRoleAwal = "siswa",
}: AuthGateSecureProps) {
  const [modeTab, setModeTab] = useState<"login" | "register">("login");
  const [rolePilihan, setRolePilihan] = useState<"siswa" | "guru">(modeRoleAwal);

  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [namaInput, setNamaInput] = useState<string>("");
  const [instansiInput, setInstansiInput] = useState<string>("");

  const [sedangLoading, setSedangLoading] = useState<boolean>(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError(null);
    setSedangLoading(true);

    try {
      const res = await fetch("/api/mobile/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: modeTab === "register" ? "register" : "login",
          email: emailInput.trim(),
          password: passwordInput,
          nama: namaInput.trim(),
          role: rolePilihan,
          instansi: instansiInput.trim() || "HibahIlmu Web",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (modeTab === "login") {
          const akunLokal = daftarAkun.find(
            (a) =>
              a.email.toLowerCase() === emailInput.trim().toLowerCase() &&
              a.password === passwordInput
          );
          if (akunLokal) {
            onLoginBerhasil(akunLokal);
            return;
          }
        }
        setPesanError(json.message || "Email atau password salah!");
      } else if (json.user) {
        const akunMasuk: AkunPengguna = {
          id: json.user.id,
          nama: json.user.nama,
          email: json.user.email,
          password: passwordInput,
          role: json.user.role,
          status: json.user.status || "approved",
          infoTambahan: json.user.instansi || "HibahIlmu Indonesia",
          waktuDaftar: "Terverifikasi Server",
          xp: json.user.xp || 500,
        };
        if (Array.isArray(json.accounts)) {
          setDaftarAkun(json.accounts);
        }
        onLoginBerhasil(akunMasuk);
      }
    } catch {
      setPesanError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setSedangLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-4">
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-relaxed">
            100% Gratis dan Terenkripsi: Wajib masuk dengan akun milik sendiri
            (Google SSO atau Password) agar progres materi, sertifikat, dan
            proyek IoT Anda aman.
          </p>
        </div>

        <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setModeTab("login");
              setPesanError(null);
            }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              modeTab === "login"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setModeTab("register");
              setPesanError(null);
            }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              modeTab === "register"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Registrasi Akun Gratis
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Pilih Peran Akun Anda (Siswa / Guru):
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRolePilihan("siswa")}
              className={`p-3.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                rolePilihan === "siswa"
                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Siswa / Mahasiswa</span>
            </button>
            <button
              type="button"
              onClick={() => setRolePilihan("guru")}
              className={`p-3.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                rolePilihan === "guru"
                  ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Guru / Dosen</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-center">
          <div className="text-xs font-black text-slate-700 dark:text-slate-200">
            2. Masuk / Daftar Instan 1-Klik dengan Google sebagai{" "}
            <span className="underline text-emerald-600 dark:text-emerald-400">
              {rolePilihan === "guru" ? "GURU / DOSEN" : "SISWA / PELAJAR"}
            </span>
            :
          </div>
          <GoogleSsoButtonWeb
            rolePilihan={rolePilihan}
            instansiPilihan={instansiInput || "HibahIlmu Web Google SSO"}
            onBerhasilLoginGoogle={(akunGoogle) => {
              onLoginBerhasil(akunGoogle);
            }}
          />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[11px] font-extrabold text-slate-400 uppercase">
            Atau Gunakan Email dan Password
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmitManual} className="space-y-4">
          {modeTab === "register" && (
            <>
              <input
                type="text"
                required
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                placeholder="Nama Lengkap Anda..."
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold focus:outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                value={instansiInput}
                onChange={(e) => setInstansiInput(e.target.value)}
                placeholder="Asal Sekolah / Kampus / Instansi..."
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold focus:outline-none focus:border-emerald-600"
              />
            </>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email Terdaftar..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold focus:outline-none focus:border-emerald-600"
            />
          </div>

          {pesanError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pesanError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={sedangLoading}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition cursor-pointer"
          >
            {sedangLoading
              ? "Memverifikasi Kredensial..."
              : modeTab === "register"
              ? `Daftar Akun ${rolePilihan.toUpperCase()} Sekarang`
              : "Masuk Sekarang"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase">
          <Lock className="w-3.5 h-3.5" /> Sistem Keamanan Terproteksi
        </div>

        <h3 className="text-xl font-black leading-snug">
          Privasi Akun dan Sinkronisasi Lintas Platform (Web + Android)
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          Demi menjaga keamanan data pengguna, daftar akun tidak ditampilkan
          kepada publik. Setiap pengguna wajib masuk menggunakan{" "}
          <strong>Google SSO</strong> atau <strong>Password</strong>{" "}
          masing-masing.
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
            <div className="text-xs font-black text-emerald-400">
              Fitur Mode Siswa / Mahasiswa
            </div>
            <p className="text-[11px] text-slate-300">
              Akses penuh Kelas Berjenjang, Simulator IoT dan Blynk Cloud,
              Tryout CBT, Beasiswa Wakaf, dan Forum Diskusi PR.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
            <div className="text-xs font-black text-indigo-400">
              Fitur Studio Guru / Dosen
            </div>
            <p className="text-[11px] text-slate-300">
              Terbitkan Modul Materi dan Bab baru, buat Paket Ujian CBT, kelola
              Tugas dan RPP, jadwalkan Live Webinar, dan pantau siswa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
            <div className="text-xs font-black text-amber-400">
              Sinkronisasi Otomatis ke Aplikasi Android
            </div>
            <p className="text-[11px] text-slate-300">
              Akun Google yang Anda daftarkan di Website ini langsung dapat
              digunakan login pada Aplikasi Android Native HibahIlmu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}