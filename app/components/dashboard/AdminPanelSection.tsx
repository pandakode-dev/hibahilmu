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
  Settings,
  Bug,
  Quote,
  Wallet,
  Phone,
  CheckCircle2,
} from "lucide-react";
import {
  AkunPengguna,
  JenjangItem,
  PengajuanBeasiswaItem,
  LogAktivitas,
  KonfigurasiWeb,
  LaporanBugItem,
  RekeningDonasiItem,
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
  konfigurasiWeb: KonfigurasiWeb;
  setKonfigurasiWeb: React.Dispatch<React.SetStateAction<KonfigurasiWeb>>;
  daftarLaporanBug: LaporanBugItem[];
  setDaftarLaporanBug: React.Dispatch<React.SetStateAction<LaporanBugItem[]>>;
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
  konfigurasiWeb,
  setKonfigurasiWeb,
  daftarLaporanBug,
  setDaftarLaporanBug,
  onBukaModeGuru,
  onDownloadRekapCsv,
}) => {
  const [adminTabAktif, setAdminTabAktif] = useState<
    "akun" | "pengaturan_web" | "laporan_bug" | "beasiswa" | "kategori" | "cv" | "log"
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

  // State Form Tambah Kata Mutiara Baru oleh Admin
  const [kutipanBaru, setKutipanBaru] = useState("");
  const [tokohSumberBaru, setTokohSumberBaru] = useState("");

  // State Form Tambah Rekening Bank / DANA / E-Wallet oleh Admin
  const [namaBankBaru, setNamaBankBaru] = useState("");
  const [kategoriRekBaru, setKategoriRekBaru] =
    useState<RekeningDonasiItem["kategori"]>("E-Wallet");
  const [nomorRekBaru, setNomorRekBaru] = useState("");
  const [atasNamaBaru, setAtasNamaBaru] = useState("Yayasan HibahIlmu Indonesia");
  const [logoUrlBaru, setLogoUrlBaru] = useState("");

  // State Balasan Admin untuk Laporan Bug
  const [inputBalasanBug, setInputBalasanBug] = useState<{ [id: string]: string }>({});

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

      {/* Tab Navigasi Super Admin Lengkap */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "akun", label: `Data Akun (${daftarAkun.length})` },
          { id: "pengaturan_web", label: "⚙️ Kata Mutiara, Rekening/DANA & Kontak" },
          { id: "laporan_bug", label: `🐞 Laporan Bug & Masukan (${daftarLaporanBug.length})` },
          { id: "beasiswa", label: `Verifikasi Beasiswa (${daftarBeasiswa.length})` },
          { id: "kategori", label: "Kategori & Prodi" },
          { id: "cv", label: "Profil & CV Saya" },
          { id: "log", label: "Log Audit" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setAdminTabAktif(
                t.id as
                  | "akun"
                  | "pengaturan_web"
                  | "laporan_bug"
                  | "beasiswa"
                  | "kategori"
                  | "cv"
                  | "log"
              )
            }
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap cursor-pointer ${
              adminTabAktif === t.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB BARU 1: PENGATURAN KATA MUTIARA LANDING PAGE, REKENING BANK/DANA & KONTAK */}
      {adminTabAktif === "pengaturan_web" && (
        <div className="space-y-8">
          {/* A. Pengaturan Kata Mutiara Kartu 3D & Landing Page */}
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Quote className="w-6 h-6 text-emerald-600" /> Pengaturan Kata-Kata Mutiara &amp;
              Headline Gratis di Landing Page
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Kutipan Utama di Dalam Kartu 3D Hero:
                </label>
                <textarea
                  rows={2}
                  value={konfigurasiWeb.kutipanKartu3D}
                  onChange={(e) =>
                    setKonfigurasiWeb({ ...konfigurasiWeb, kutipanKartu3D: e.target.value })
                  }
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Judul Manifesto Wakaf 100% Gratis:
                </label>
                <textarea
                  rows={2}
                  value={konfigurasiWeb.headlineGratis}
                  onChange={(e) =>
                    setKonfigurasiWeb({ ...konfigurasiWeb, headlineGratis: e.target.value })
                  }
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
            </div>

            {/* Tambah Kata Mutiara Baru */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!kutipanBaru.trim()) return;
                setKonfigurasiWeb({
                  ...konfigurasiWeb,
                  daftarKataMutiara: [
                    ...konfigurasiWeb.daftarKataMutiara,
                    {
                      id: "km-" + Date.now(),
                      kutipan: kutipanBaru,
                      tokohAtauSumber: tokohSumberBaru || "Filosofi HibahIlmu.id",
                    },
                  ],
                });
                setKutipanBaru("");
                setTokohSumberBaru("");
              }}
              className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3 text-sm"
            >
              <div className="font-black text-emerald-950">
                + Tambah Kartu Kata Mutiara Baru ke Landing Page
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={kutipanBaru}
                  onChange={(e) => setKutipanBaru(e.target.value)}
                  placeholder="Isi kalimat kata mutiara pendidikan..."
                  className="sm:col-span-2 p-3 border rounded-xl bg-white font-semibold"
                />
                <input
                  type="text"
                  value={tokohSumberBaru}
                  onChange={(e) => setTokohSumberBaru(e.target.value)}
                  placeholder="Tokoh / Sumber Kutipan..."
                  className="p-3 border rounded-xl bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
              >
                + Tambahkan Kata Mutiara
              </button>
            </form>

            {/* Daftar Kata Mutiara Saat Ini (Bisa Diedit / Dihapus) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {konfigurasiWeb.daftarKataMutiara.map((km) => (
                <div
                  key={km.id}
                  className="p-4 rounded-2xl bg-slate-50 border flex flex-col justify-between space-y-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="italic font-bold text-slate-800">&ldquo;{km.kutipan}&rdquo;</p>
                    <div className="font-black text-indigo-700">— {km.tokohAtauSumber}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setKonfigurasiWeb({
                        ...konfigurasiWeb,
                        daftarKataMutiara: konfigurasiWeb.daftarKataMutiara.filter(
                          (x) => x.id !== km.id
                        ),
                      })
                    }
                    className="text-rose-600 font-black self-end hover:underline cursor-pointer"
                  >
                    Hapus Kutipan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* B. Pengaturan Nomor Rekening Bank, DANA, E-Wallet & Logo */}
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Wallet className="w-6 h-6 text-indigo-600" /> Pengaturan Nomor Rekening Bank, DANA /
              E-Wallet &amp; Logo Donasi
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!namaBankBaru.trim() || !nomorRekBaru.trim()) return;
                const rekBaru: RekeningDonasiItem = {
                  id: "rek-" + Date.now(),
                  namaBankAtauEwallet: namaBankBaru,
                  kategori: kategoriRekBaru,
                  nomorRekening: nomorRekBaru,
                  atasNama: atasNamaBaru || "Yayasan HibahIlmu Indonesia",
                  logoUrl: logoUrlBaru,
                  warnaTema: "from-indigo-600 to-emerald-600",
                };
                setKonfigurasiWeb({
                  ...konfigurasiWeb,
                  daftarRekeningDonasi: [...konfigurasiWeb.daftarRekeningDonasi, rekBaru],
                });
                setNamaBankBaru("");
                setNomorRekBaru("");
                setLogoUrlBaru("");
              }}
              className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3 text-xs sm:text-sm"
            >
              <div className="font-black text-indigo-950">
                + Tambah Rekening Bank atau Dompet Digital (DANA, GoPay, OVO, BSI, BCA, BRI, dll.)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={namaBankBaru}
                  onChange={(e) => setNamaBankBaru(e.target.value)}
                  placeholder="Nama Bank / E-Wallet (Misal: DANA / Bank BRI)..."
                  className="p-3 border rounded-xl bg-white font-bold"
                />
                <select
                  value={kategoriRekBaru}
                  onChange={(e) =>
                    setKategoriRekBaru(e.target.value as RekeningDonasiItem["kategori"])
                  }
                  className="p-3 border rounded-xl bg-white font-bold"
                >
                  <option value="E-Wallet">Kategori: E-Wallet (DANA/GoPay/OVO)</option>
                  <option value="Bank Transfer">Kategori: Bank Transfer</option>
                  <option value="QRIS">Kategori: QRIS</option>
                </select>
                <input
                  type="text"
                  required
                  value={nomorRekBaru}
                  onChange={(e) => setNomorRekBaru(e.target.value)}
                  placeholder="Nomor Rekening / Nomor HP DANA..."
                  className="p-3 border rounded-xl bg-white font-mono font-black"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={atasNamaBaru}
                  onChange={(e) => setAtasNamaBaru(e.target.value)}
                  placeholder="Atas Nama Rekening..."
                  className="p-3 border rounded-xl bg-white"
                />
                <input
                  type="url"
                  value={logoUrlBaru}
                  onChange={(e) => setLogoUrlBaru(e.target.value)}
                  placeholder="URL Gambar Logo Bank/DANA (Opsional, https://...)"
                  className="sm:col-span-2 p-3 border rounded-xl bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
              >
                + Simpan Rekening / E-Wallet Donasi
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {konfigurasiWeb.daftarRekeningDonasi.map((rek) => (
                <div
                  key={rek.id}
                  className="p-4 rounded-2xl border bg-slate-50 flex justify-between items-center gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-black text-sm text-slate-900">
                      {rek.namaBankAtauEwallet}{" "}
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        {rek.kategori}
                      </span>
                    </div>
                    <div className="font-mono font-black text-indigo-700 text-sm">
                      {rek.nomorRekening}
                    </div>
                    <div className="text-slate-500">a.n. {rek.atasNama}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setKonfigurasiWeb({
                        ...konfigurasiWeb,
                        daftarRekeningDonasi: konfigurasiWeb.daftarRekeningDonasi.filter(
                          (r) => r.id !== rek.id
                        ),
                      })
                    }
                    className="p-2 rounded-xl bg-rose-100 text-rose-700 font-bold cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* C. Pengaturan Nomor Kontak WhatsApp, Email & Alamat Resmi */}
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" /> Pengaturan Nomor Kontak WhatsApp, Email
              &amp; Sekretariat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Nomor Kontak WhatsApp / Telepon:
                </label>
                <input
                  type="text"
                  value={konfigurasiWeb.nomorKontakWa}
                  onChange={(e) =>
                    setKonfigurasiWeb({ ...konfigurasiWeb, nomorKontakWa: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Email Layanan Resmi:
                </label>
                <input
                  type="text"
                  value={konfigurasiWeb.emailKontakResmi}
                  onChange={(e) =>
                    setKonfigurasiWeb({ ...konfigurasiWeb, emailKontakResmi: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Alamat Sekretariat:
                </label>
                <input
                  type="text"
                  value={konfigurasiWeb.alamatSekretariat}
                  onChange={(e) =>
                    setKonfigurasiWeb({ ...konfigurasiWeb, alamatSekretariat: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Semua perubahan kata mutiara, rekening donasi,
              dan kontak otomatis tersimpan dan tampil di seluruh halaman web.
            </div>
          </div>
        </div>
      )}

      {/* TAB BARU 2: KOTAK MASUK LAPORAN BUG & MASUKAN PENGGUNA */}
      {adminTabAktif === "laporan_bug" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <div>
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase">
              Bug &amp; Feedback Center
            </span>
            <h3 className="text-2xl font-black mt-2 flex items-center gap-2">
              <Bug className="w-6 h-6 text-rose-600" /> Daftar Laporan Bug, Koreksi Soal &amp;
              Masukan Pengguna
            </h3>
          </div>

          <div className="space-y-4">
            {daftarLaporanBug.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-3 text-sm"
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-900">
                      {item.kategoriLaporan}
                    </span>
                    <span className="ml-2 text-xs font-bold text-slate-500">
                      Halaman: <b>{item.halamanTerkait}</b> • Waktu: {item.waktuLapor}
                    </span>
                  </div>
                  <select
                    value={item.status}
                    onChange={(e) => {
                      const statusBaru = e.target.value as LaporanBugItem["status"];
                      setDaftarLaporanBug((prev) =>
                        prev.map((b) => (b.id === item.id ? { ...b, status: statusBaru } : b))
                      );
                    }}
                    className="p-2 border rounded-xl bg-white text-xs font-black"
                  >
                    <option value="Baru Masuk">Status: Baru Masuk</option>
                    <option value="Sedang Ditinjau Admin">Status: Sedang Ditinjau Admin</option>
                    <option value="Selesai Diperbaiki">Status: Selesai Diperbaiki ✓</option>
                  </select>
                </div>

                <div className="font-bold text-slate-900">
                  Pelapor: {item.pelaporNama} ({item.pelaporRole}) — Kontak:{" "}
                  <span className="text-indigo-600">{item.pelaporKontak}</span>
                </div>

                <p className="p-4 bg-white rounded-xl border text-slate-700">
                  {item.deskripsiDetail}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={inputBalasanBug[item.id] ?? item.balasanAdmin ?? ""}
                    onChange={(e) =>
                      setInputBalasanBug({ ...inputBalasanBug, [item.id]: e.target.value })
                    }
                    placeholder="Tulis ucapan terima kasih atau tanggapan tindak lanjut Admin..."
                    className="flex-1 p-2.5 bg-white border rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const balasan =
                        inputBalasanBug[item.id] ||
                        "Terima kasih atas laporan dan masukannya! Tim Admin telah menindaklanjuti.";
                      setDaftarLaporanBug((prev) =>
                        prev.map((b) =>
                          b.id === item.id
                            ? { ...b, status: "Selesai Diperbaiki", balasanAdmin: balasan }
                            : b
                        )
                      );
                      alert("✓ Balasan terima kasih Admin berhasil disimpan!");
                    }}
                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                  >
                    Kirim Balasan &amp; Tandai Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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