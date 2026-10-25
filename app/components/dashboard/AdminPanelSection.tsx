"use client";

import React, { useState } from "react";
import {
  Download,
  Sparkles,
  Upload,
  UserPlus,
  LogOut,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  AkunPengguna,
  JenjangItem,
  PengajuanBeasiswaItem,
  LogAktivitas,
} from "../../types";
import { TEMPLATE_CSV_AKUN } from "../../mockData";
import { ProfilCVSection } from "./ProfilCVSection";

interface AdminPanelProps {
  userLogin: AkunPengguna;
  setUserLogin: (u: AkunPengguna | null) => void;
  daftarAkun: AkunPengguna[];
  setDaftarAkun: (list: AkunPengguna[]) => void;
  daftarJenjang: JenjangItem[];
  setDaftarJenjang: React.Dispatch<React.SetStateAction<JenjangItem[]>>;
  daftarBeasiswa: PengajuanBeasiswaItem[];
  setDaftarBeasiswa: (list: PengajuanBeasiswaItem[]) => void;
  logAktivitas: LogAktivitas[];
  onBukaModeGuru: () => void;
  onDownloadRekapCsv: () => void;
}

export const AdminPanelSection: React.FC<AdminPanelProps> = ({
  userLogin,
  setUserLogin,
  daftarAkun,
  setDaftarAkun,
  daftarJenjang,
  setDaftarJenjang,
  daftarBeasiswa,
  setDaftarBeasiswa,
  logAktivitas,
  onBukaModeGuru,
  onDownloadRekapCsv,
}) => {
  const [adminTabAktif, setAdminTabAktif] = useState<
    "akun" | "beasiswa" | "kategori" | "cv" | "log"
  >("akun");

  const [akunDieditAdmin, setAkunDieditAdmin] = useState<AkunPengguna | null>(null);
  const [bukaModalTambahAkun, setBukaModalTambahAkun] = useState(false);
  const [bukaModalImportCsvAkun, setBukaModalImportCsvAkun] = useState(false);
  const [teksCsvAkun, setTeksCsvAkun] = useState(TEMPLATE_CSV_AKUN);

  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru">("siswa");

  const [jenjangIndukKategoriBaru, setJenjangIndukKategoriBaru] = useState("sma");
  const [namaSubJenjangBaru, setNamaSubJenjangBaru] = useState("");

  const semuaSubJenjangFlat = daftarJenjang.flatMap((j) =>
    j.subJenjang.map((sj) => ({ ...sj, namaInduk: j.nama }))
  );

  return (
    <div className="space-y-8">
      <div className="bg-[#0B1120] text-white p-8 sm:p-10 rounded-[2rem] space-y-6 shadow-2xl">
        <div>
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
            SUPER ADMIN
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3">{userLogin.nama}</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDownloadRekapCsv}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh Rekap Excel (.CSV)
          </button>
          <button
            onClick={onBukaModeGuru}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Buka Studio Mode Guru
          </button>
          <button
            onClick={() => setBukaModalImportCsvAkun(!bukaModalImportCsvAkun)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Import CSV Akun
          </button>
          <button
            onClick={() => setBukaModalTambahAkun(!bukaModalTambahAkun)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> + Tambah Akun
          </button>
          <button
            onClick={() => setUserLogin(null)}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "akun", label: `Data Akun (${daftarAkun.length})` },
          { id: "beasiswa", label: `Verifikasi Beasiswa (${daftarBeasiswa.length})` },
          { id: "kategori", label: "Kategori & Prodi" },
          { id: "cv", label: "Profil & CV Saya" },
          { id: "log", label: "Log Audit" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setAdminTabAktif(t.id as "akun" | "beasiswa" | "kategori" | "cv" | "log")
            }
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black cursor-pointer ${
              adminTabAktif === t.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {bukaModalImportCsvAkun && (
        <div className="bg-white text-slate-800 p-6 rounded-3xl border-2 border-indigo-500 space-y-4 text-sm">
          <h3 className="font-black text-lg">Import Massal Akun Guru &amp; Siswa via CSV</h3>
          <textarea
            rows={4}
            value={teksCsvAkun}
            onChange={(e) => setTeksCsvAkun(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-slate-50 border rounded-xl"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                const baris = teksCsvAkun.trim().split("\n").slice(1);
                const akunBaruList: AkunPengguna[] = baris
                  .map((b, i) => {
                    const k = b.split(";");
                    return {
                      id: "csv-u-" + Date.now() + "-" + i,
                      nama: k[0] || "Pengguna Baru",
                      email: k[1] || `user${i}@hibahilmu.id`,
                      password: k[2] || "123",
                      role: (k[3] as "siswa" | "guru" | "admin") || "siswa",
                      status: "approved" as const,
                      infoTambahan: k[4] || "Terdaftar via CSV",
                      waktuDaftar: "Hari ini",
                      aksesMengajar: ["sma-11-ipa"],
                      minatSubJenjang: ["sma-11-ipa"],
                    };
                  })
                  .filter((x) => x.email);
                setDaftarAkun([...akunBaruList, ...daftarAkun]);
                setBukaModalImportCsvAkun(false);
              }}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-xs"
            >
              Import Sekarang
            </button>
            <button
              onClick={() => setBukaModalImportCsvAkun(false)}
              className="border px-4 py-2.5 rounded-xl font-bold text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {bukaModalTambahAkun && (
        <div className="bg-white text-slate-800 p-6 rounded-3xl border-2 border-emerald-500 space-y-4 text-sm">
          <h3 className="font-black text-lg">Tambah Akun Pengguna Baru</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!namaReg || !emailReg) return;
              const baru: AkunPengguna = {
                id: "adm-u-" + Date.now(),
                nama: namaReg,
                email: emailReg,
                password: "123",
                role: roleReg,
                status: "approved",
                infoTambahan: roleReg === "guru" ? "Pengajar Terverifikasi" : "Pelajar Aktif",
                waktuDaftar: "Hari ini",
                aksesMengajar: ["sma-11-ipa"],
                minatSubJenjang: ["sma-11-ipa"],
              };
              setDaftarAkun([baru, ...daftarAkun]);
              setNamaReg("");
              setEmailReg("");
              setBukaModalTambahAkun(false);
            }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3"
          >
            <input
              type="text"
              required
              value={namaReg}
              onChange={(e) => setNamaReg(e.target.value)}
              placeholder="Nama Lengkap..."
              className="p-3 border rounded-xl"
            />
            <input
              type="email"
              required
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              placeholder="Email..."
              className="p-3 border rounded-xl"
            />
            <select
              value={roleReg}
              onChange={(e) => setRoleReg(e.target.value as "siswa" | "guru")}
              className="p-3 border rounded-xl font-bold"
            >
              <option value="siswa">Role: Siswa</option>
              <option value="guru">Role: Guru</option>
            </select>
            <button
              type="submit"
              className="bg-emerald-600 text-white font-black rounded-xl px-4 py-3"
            >
              Simpan Akun
            </button>
          </form>
        </div>
      )}

      {akunDieditAdmin && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-600 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600">
                Manajemen Hak Akses &amp; Kategori Kelas Pengguna
              </span>
              <h3 className="text-xl font-black">Edit Akun: {akunDieditAdmin.nama}</h3>
            </div>
            <button
              onClick={() => setAkunDieditAdmin(null)}
              className="text-xs font-black text-rose-600"
            >
              ✕ Tutup Editor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <input
              type="text"
              value={akunDieditAdmin.nama}
              onChange={(e) =>
                setAkunDieditAdmin({ ...akunDieditAdmin, nama: e.target.value })
              }
              className="w-full p-3 border rounded-xl font-bold"
            />
            <input
              type="email"
              value={akunDieditAdmin.email}
              onChange={(e) =>
                setAkunDieditAdmin({ ...akunDieditAdmin, email: e.target.value })
              }
              className="w-full p-3 border rounded-xl"
            />
            <select
              value={akunDieditAdmin.role}
              onChange={(e) =>
                setAkunDieditAdmin({
                  ...akunDieditAdmin,
                  role: e.target.value as "admin" | "guru" | "siswa",
                })
              }
              className="w-full p-3 border rounded-xl font-black bg-indigo-50"
            >
              <option value="siswa">SISWA</option>
              <option value="guru">GURU / PENGAJAR</option>
              <option value="admin">SUPER ADMIN</option>
            </select>
            <select
              value={akunDieditAdmin.status}
              onChange={(e) =>
                setAkunDieditAdmin({
                  ...akunDieditAdmin,
                  status: e.target.value as "approved" | "pending" | "rejected",
                })
              }
              className="w-full p-3 border rounded-xl font-black bg-emerald-50"
            >
              <option value="approved">APPROVED (Aktif)</option>
              <option value="pending">PENDING</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-slate-700">
              {akunDieditAdmin.role === "siswa"
                ? "Tentukan Kategori Kelas / Prodi yang Diikuti Siswa Ini:"
                : "Tentukan Hak Akses Kelas / Prodi Tempat Guru Ini Mengajar:"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-4 bg-slate-50 rounded-2xl border max-h-60 overflow-y-auto">
              {semuaSubJenjangFlat.map((sj) => {
                const listSaatIni =
                  akunDieditAdmin.role === "siswa"
                    ? akunDieditAdmin.minatSubJenjang || []
                    : akunDieditAdmin.aksesMengajar || [];
                const dicentang = listSaatIni.includes(sj.id);

                return (
                  <label
                    key={sj.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                      dicentang
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={dicentang}
                      onChange={() => {
                        const baru = dicentang
                          ? listSaatIni.filter((id) => id !== sj.id)
                          : [...listSaatIni, sj.id];
                        if (akunDieditAdmin.role === "siswa") {
                          setAkunDieditAdmin({ ...akunDieditAdmin, minatSubJenjang: baru });
                        } else {
                          setAkunDieditAdmin({ ...akunDieditAdmin, aksesMengajar: baru });
                        }
                      }}
                    />
                    <span>
                      {sj.namaInduk} — {sj.nama}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setDaftarAkun(
                  daftarAkun.map((a) => (a.id === akunDieditAdmin.id ? akunDieditAdmin : a))
                );
                if (userLogin.id === akunDieditAdmin.id) setUserLogin(akunDieditAdmin);
                setAkunDieditAdmin(null);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs"
            >
              Simpan Perubahan User
            </button>
          </div>
        </div>
      )}

      {adminTabAktif === "cv" && (
        <ProfilCVSection
          userLogin={userLogin}
          setUserLogin={(u) => setUserLogin(u)}
          daftarAkun={daftarAkun}
          setDaftarAkun={setDaftarAkun}
        />
      )}

      {adminTabAktif === "akun" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border border-slate-200 space-y-4">
          {daftarAkun.map((akun) => {
            const kategoriUser =
              akun.role === "siswa" ? akun.minatSubJenjang || [] : akun.aksesMengajar || [];
            return (
              <div
                key={akun.id}
                className="p-5 rounded-2xl border border-slate-300 bg-white flex flex-wrap justify-between items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="font-black text-base flex flex-wrap items-center gap-2">
                    <span>{akun.nama}</span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {akun.role}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {akun.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{akun.email}</div>
                  {kategoriUser.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {kategoriUser.map((kid) => {
                        const namaKls =
                          semuaSubJenjangFlat.find((s) => s.id === kid)?.nama || kid;
                        return (
                          <span
                            key={kid}
                            className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border"
                          >
                            Kelas: {namaKls}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAkunDieditAdmin(akun)}
                    className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {akun.role !== "admin" && (
                    <button
                      onClick={() => setDaftarAkun(daftarAkun.filter((a) => a.id !== akun.id))}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {adminTabAktif === "kategori" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <h3 className="text-xl font-black">Manajemen Kategori Tingkat Kelas &amp; Prodi</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!namaSubJenjangBaru.trim()) return;
              const idBaru = jenjangIndukKategoriBaru + "-" + Date.now().toString().slice(-4);
              setDaftarJenjang((prev) =>
                prev.map((j) =>
                  j.id === jenjangIndukKategoriBaru
                    ? {
                        ...j,
                        subJenjang: [...j.subJenjang, { id: idBaru, nama: namaSubJenjangBaru }],
                      }
                    : j
                )
              );
              setNamaSubJenjangBaru("");
            }}
            className="flex flex-wrap gap-3 text-sm"
          >
            <select
              value={jenjangIndukKategoriBaru}
              onChange={(e) => setJenjangIndukKategoriBaru(e.target.value)}
              className="p-3.5 border rounded-xl font-bold bg-slate-50"
            >
              {daftarJenjang.map((j) => (
                <option key={j.id} value={j.id}>
                  Jenjang: {j.nama}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              value={namaSubJenjangBaru}
              onChange={(e) => setNamaSubJenjangBaru(e.target.value)}
              placeholder="Nama Tingkat Kelas / Prodi Baru..."
              className="flex-1 p-3.5 border rounded-xl"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black"
            >
              + Tambah Kategori Kelas
            </button>
          </form>
        </div>
      )}

      {adminTabAktif === "beasiswa" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
          {daftarBeasiswa.map((b) => (
            <div
              key={b.id}
              className="p-4 border rounded-2xl bg-slate-50 flex justify-between items-center"
            >
              <div>
                <div className="font-black">
                  {b.pemohonNama} — {b.jenisBeasiswa} ({b.status})
                </div>
                <p className="text-xs text-slate-600">{b.alasanPengajuan}</p>
              </div>
              <button
                onClick={() =>
                  setDaftarBeasiswa(
                    daftarBeasiswa.map((x) => (x.id === b.id ? { ...x, status: "Disetujui" } : x))
                  )
                }
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Setujui
              </button>
            </div>
          ))}
        </div>
      )}

      {adminTabAktif === "log" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-2">
          {logAktivitas.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 border rounded-xl text-xs">
              <b>{log.namaPelaku}:</b> {log.aksi} ({log.waktu})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};