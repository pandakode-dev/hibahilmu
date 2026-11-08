"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
  CloudUpload,
  FolderOpen,
  Trash2,
  RotateCcw,
  AlertCircle,
  Baby,
  Compass,
  GraduationCap,
  Briefcase,
  Medal,
  FileText,
  Award,
  Download,
  Upload,
  Search,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { AkunPengguna } from "../../types";
import {
  SOAL_SESI_1_170,
  SOAL_SESI_2_114_SCM,
} from "./talentMappingDatabase";
import {
  hitungHasilTalentMappingAkurat,
  buatPresetJawabanMuhammadSaputra,
  HasilLengkapTalentMapping,
} from "./talentMappingEngine";
import { Scm114FullVisualMap } from "./Scm114FullVisualMap";
import { MultiJenjangTalentSuite } from "./MultiJenjangTalentSuite";
import { MultiJenjangCertificateAndReport } from "./CertificateAndReportComponents";

interface Props {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

const STORAGE_HASIL_KEY = "hibahilmu_talent_mapping_master_v6";

export const TalentMappingAssessmentView: React.FC<Props> = ({
  userLogin,
  tambahXP,
}) => {
  const isAdminAtauHR =
    userLogin?.role === "admin" ||
    userLogin?.role === "guru" ||
    (userLogin?.email || "").toLowerCase().includes("admin") ||
    (userLogin?.email || "").toLowerCase().includes("saputra");

  const [jenjangTesAktif, setJenjangTesAktif] = useState<
    "anak_tk_sd" | "smp" | "sma" | "dewasa_284"
  >("dewasa_284");

  const [tahapAktif, setTahapAktif] = useState<
    "intro" | "sesi1" | "sesi2" | "hasil"
  >("intro");

  const [modePrintDewasa, setModePrintDewasa] = useState<
    "semua" | "sertifikat_saja" | "laporan_saja"
  >("semua");

  const eksekusiPrintDewasaTerpisah = (
    pilihan: "sertifikat_saja" | "laporan_saja"
  ) => {
    setModePrintDewasa(pilihan);
    setTimeout(() => {
      window.print();
      setTimeout(() => setModePrintDewasa("semua"), 500);
    }, 180);
  };

  const instansiDariUser =
    (userLogin as { instansi?: string } | null)?.instansi ||
    "HibahIlmu Indonesia";

  const [namaPeserta, setNamaPeserta] = useState<string>(
    userLogin?.nama || ""
  );
  const [emailPeserta, setEmailPeserta] = useState<string>(
    userLogin?.email || ""
  );
  const [instansiPeserta, setInstansiPeserta] =
    useState<string>(instansiDariUser);
  const [jabatanPeserta, setJabatanPeserta] = useState<string>(
    "Pelajar / Mahasiswa / Profesional"
  );

  const [jawabanSesi1, setJawabanSesi1] = useState<Record<number, number>>({});
  const [jawabanSesi2, setJawabanSesi2] = useState<Record<number, number>>({});

  const [indeksSesi1, setIndeksSesi1] = useState<number>(0);
  const [indeksSesi2, setIndeksSesi2] = useState<number>(0);
  const [autoNextAktif, setAutoNextAktif] = useState<boolean>(true);

  const [hasilSaatIni, setHasilSaatIni] = useState<any | null>(null);
  const [riwayatDatabasePusat, setRiwayatDatabasePusat] = useState<any[]>([]);
  const [bukaPanelDatabasePusat, setBukaPanelDatabasePusat] =
    useState<boolean>(false);
  const [kataKunciCariAdmin, setKataKunciCariAdmin] = useState<string>("");
  const [filterJenjangAdmin, setFilterJenjangAdmin] = useState<string>("semua");
  const [statusSimpan, setStatusSimpan] = useState<string>("");
  const [pesanPeringatanKosong, setPesanPeringatanKosong] =
    useState<string>("");

  useEffect(() => {
    if (userLogin) {
      setNamaPeserta(userLogin.nama);
      setEmailPeserta(userLogin.email);
      const inst = (userLogin as { instansi?: string }).instansi;
      if (inst) setInstansiPeserta(inst);
    }
  }, [userLogin]);

  // Tarik seluruh data dari Database Pusat Cloud & gabungkan dengan cadangan lokal browser
  const muatSemuaDataDariDatabasePusat = async () => {
    let lokalList: any[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_HASIL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) lokalList = parsed;
      }
    } catch {}

    try {
      const res = await fetch(
        `/api/talent-mapping?email=${encodeURIComponent(userLogin?.email || emailPeserta || "")}&role=${encodeURIComponent(userLogin?.role || "siswa")}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (json.ok && Array.isArray(json.results)) {
        const mapGabung = new Map<string, any>();
        [...json.results, ...lokalList].forEach((item) => {
          if (item && item.idHasil && !mapGabung.has(item.idHasil)) {
            mapGabung.set(item.idHasil, item);
          }
        });
        const emailAktif = (userLogin?.email || emailPeserta || "").trim().toLowerCase(); const finalArr = Array.from(mapGabung.values()).filter((r: any) => isAdminAtauHR || (r?.emailPeserta || "").trim().toLowerCase() === emailAktif);
        setRiwayatDatabasePusat(finalArr);
        localStorage.setItem(STORAGE_HASIL_KEY, JSON.stringify(finalArr));
        return;
      }
    } catch {}

    if (lokalList.length > 0) {
      setRiwayatDatabasePusat(lokalList);
    }
  };

  useEffect(() => {
    muatSemuaDataDariDatabasePusat();
  }, [userLogin]);

  const jumlahTerjawabSesi1 = Object.keys(jawabanSesi1).length;
  const jumlahTerjawabSesi2 = Object.keys(jawabanSesi2).length;
  const jumlahSangatKuatSesi2 = Object.values(jawabanSesi2).filter(
    (v) => v === 7
  ).length;

  const kosongkanSemuaJawaban = () => {
    setJawabanSesi1({});
    setJawabanSesi2({});
    setIndeksSesi1(0);
    setIndeksSesi2(0);
    setPesanPeringatanKosong("");
  };

  const pilihJawabanSoalSesi1 = (nomorSoal: number, nilai: number) => {
    setJawabanSesi1((prev) => ({
      ...prev,
      [nomorSoal]: nilai,
    }));

    if (autoNextAktif) {
      setTimeout(() => {
        setIndeksSesi1((prevIdx) => (prevIdx < 169 ? prevIdx + 1 : prevIdx));
      }, 160);
    }
  };

  const pilihJawabanSoalSesi2 = (nomorSoal: number, nilai: number) => {
    setJawabanSesi2((prev) => ({
      ...prev,
      [nomorSoal]: nilai,
    }));

    if (autoNextAktif) {
      setTimeout(() => {
        setIndeksSesi2((prevIdx) => (prevIdx < 113 ? prevIdx + 1 : prevIdx));
      }, 160);
    }
  };

  const simpanHasilKeDatabasePusat = async (hasilTarget: any) => {
    setStatusSimpan("Menyimpan ke Database Pusat Cloud...");
    const paket = {
      ...hasilTarget,
      tipeJenjang: hasilTarget.tipeJenjang || "dewasa_284",
      timestampMs: Date.now(),
    };

    const baru = [
      paket,
      ...riwayatDatabasePusat.filter((r) => r.idHasil !== paket.idHasil),
    ];
    setRiwayatDatabasePusat(baru);

    try {
      localStorage.setItem(STORAGE_HASIL_KEY, JSON.stringify(baru));
    } catch {}

    try {
      const res = await fetch("/api/talent-mapping", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          result: paket,
        }),
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.results)) {
        setRiwayatDatabasePusat(json.results);
        localStorage.setItem(STORAGE_HASIL_KEY, JSON.stringify(json.results));
      }
      setStatusSimpan("Tersimpan Permanen di Database Pusat Cloud ✓");
    } catch {
      setStatusSimpan("Tersimpan di Lokal Browser ✓");
    }
  };

  const prosesHitungDanBukaHasil = () => {
    if (jumlahTerjawabSesi1 === 0 && jumlahTerjawabSesi2 === 0) {
      setPesanPeringatanKosong(
        "Pilihan soal masih kosong (0 dijawab). Silakan kerjakan soal terlebih dahulu, atau klik tombol 'Simulasi Cepat (Demo)' jika hanya ingin melihat contoh hasil."
      );
      return;
    }
    setPesanPeringatanKosong("");

    const hasil = hitungHasilTalentMappingAkurat({
      pemilikUserId: userLogin?.id || emailPeserta || "guest",
      namaPeserta: namaPeserta.trim() || userLogin?.nama || "Peserta Asesmen",
      emailPeserta:
        emailPeserta.trim() || userLogin?.email || "peserta@hibahilmu.id",
      instansiPeserta,
      jabatanAtauKelas: jabatanPeserta,
      jawabanSesi1,
      jawabanSesi2,
    });
    setHasilSaatIni({ ...hasil, tipeJenjang: "dewasa_284" });
    setTahapAktif("hasil");
    tambahXP(100);
    simpanHasilKeDatabasePusat({ ...hasil, tipeJenjang: "dewasa_284" });
  };

  // Fungsi Export Backup JSON & CSV untuk Admin agar Data Abadi
  const unduhBackupMasterJson = () => {
    const blob = new Blob([JSON.stringify(riwayatDatabasePusat, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_Database_Pusat_TalentMapping_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unduhRekapCsvExcel = () => {
    const header =
      "ID Hasil,Tanggal,Nama Peserta,Email Akun,Instansi,Jenjang,Bakat #1,Bakat #2,Bakat #3,Personal Branding Utama\n";
    const baris = riwayatDatabasePusat
      .map((r) => {
        const b1 = r.bakatUtama1_7?.[0]?.nama || "-";
        const b2 = r.bakatUtama1_7?.[1]?.nama || "-";
        const b3 = r.bakatUtama1_7?.[2]?.nama || "-";
        const pb = r.top5PersonalBranding?.[0]?.nama || "-";
        return `"${r.idHasil}","${r.tanggalTes}","${r.namaPeserta}","${
          r.emailPeserta
        }","${r.instansiPeserta}","${r.tipeJenjang || "dewasa_284"}","${b1}","${b2}","${b3}","${pb}"`;
      })
      .join("\n");
    const blob = new Blob([header + baris], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rekap_Excel_TalentMapping_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const soal1Aktif = SOAL_SESI_1_170[indeksSesi1];
  const soal2Aktif = SOAL_SESI_2_114_SCM[indeksSesi2];

  const daftarTampilAdmin = riwayatDatabasePusat.filter((item) => {
    const cocokJenjang =
      filterJenjangAdmin === "semua" ||
      (item.tipeJenjang || "dewasa_284") === filterJenjangAdmin;
    const kw = kataKunciCariAdmin.trim().toLowerCase();
    const cocokKata =
      !kw ||
      (item.namaPeserta || "").toLowerCase().includes(kw) ||
      (item.emailPeserta || "").toLowerCase().includes(kw) ||
      (item.instansiPeserta || "").toLowerCase().includes(kw) ||
      (item.nomorDokumenRahasia || "").toLowerCase().includes(kw);
    return cocokJenjang && cocokKata;
  });

  return (
    <div className="space-y-8 print:space-y-0">
      <style jsx global>{`
        @media print {
          @page {
            size: ${modePrintDewasa === "sertifikat_saja"
              ? "A4 landscape"
              : "A4 portrait"};
            margin: 8mm 8mm 8mm 8mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            margin-top: 0 !important;
          }
          header,
          footer,
          nav,
          .print\\:hidden {
            display: none !important;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* =================================================================== */}
      {/* HEADER UTAMA + TOMBOL COMMAND CENTER DATABASE PUSAT ADMIN           */}
      {/* =================================================================== */}
      <div className="print:hidden bg-slate-900 text-white p-5 rounded-3xl border-2 border-amber-400/60 shadow-2xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-600 text-white">
                Pilih Kategori Usia / Jenjang Pendidikan Peserta Tes
              </span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Psychometric Z-Score &amp; Multi-Cloud Verified
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 mt-1">
              Pusat Asesmen Talent Mapping® &amp; Database Permanen HibahIlmu
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                muatSemuaDataDariDatabasePusat();
                setBukaPanelDatabasePusat(!bukaPanelDatabasePusat);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg border border-emerald-300/40"
            >
              <FolderOpen className="w-4 h-4" />{" "}
              {isAdminAtauHR
                ? `Database Pusat Admin (${riwayatDatabasePusat.length} Peserta)`
                : `Arsip Hasil Tes Saya (${riwayatDatabasePusat.length})`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: "anak_tk_sd",
              ikon: <Baby className="w-5 h-5 text-pink-400" />,
              judul: "1. Anak Usia 3–8 Tahun (TK–SD)",
              metode: "8 Kanvas Mewarnai, 24 Kartu & 24 Observasi",
              output: "Sertifikat Lukisan Landscape, Rekomendasi Les & Motorik",
            },
            {
              id: "smp",
              ikon: <Compass className="w-5 h-5 text-sky-400" />,
              judul: "2. Siswa SD Atas & SMP (9–15 Thn)",
              metode: "36 Soal Eksplorasi Gaya Belajar VAK & 8 Bakat",
              output: "Sertifikat Landscape, Gaya Belajar VAK & Ekskul",
            },
            {
              id: "sma",
              ikon: <GraduationCap className="w-5 h-5 text-purple-400" />,
              judul: "3. Remaja SMA / SMK (15–18 Thn)",
              metode: "48 Soal Kepribadian Karier RIASEC Holland",
              output: "Sertifikat Landscape, Mapel Pilihan & Jurusan Kuliah",
            },
            {
              id: "dewasa_284",
              ikon: <Briefcase className="w-5 h-5 text-amber-400" />,
              judul: "4. Mahasiswa & Umum (284 Soal)",
              metode: "170 Soal Sesi 1 (34 Bakat) + 114 Soal Sesi 2 (PSS)",
              output: "Sertifikat Landscape, 34 Bakat, 114 SCM & 30 Branding",
            },
          ].map((j) => {
            const aktif = jenjangTesAktif === j.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => setJenjangTesAktif(j.id as any)}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  aktif
                    ? "bg-gradient-to-br from-rose-600/40 to-amber-500/30 border-amber-400 text-white shadow-lg scale-[1.01]"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    {j.ikon}
                    {aktif && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                        AKTIF
                      </span>
                    )}
                  </div>
                  <div className="font-black text-xs sm:text-sm text-white">
                    {j.judul}
                  </div>
                  <div className="text-[11px] text-amber-200 font-semibold">
                    Metode: {j.metode}
                  </div>
                </div>
                <div className="text-[10px] text-emerald-300 border-t border-slate-800 pt-1.5">
                  Hasil: {j.output}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* PANEL DATABASE PUSAT ADMIN & HRBP (LIHAT SEMUA SERTIFIKAT & LAPORAN)*/}
      {/* =================================================================== */}
      {bukaPanelDatabasePusat && (
        <div className="print:hidden bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-400 shadow-2xl space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                ☁️ MASTER CLOUD DATABASE PUSAT HIBAHILMU (ANTI-HILANG)
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Command Center Admin &amp; HRBP — Daftar Seluruh Peserta Tes ({daftarTampilAdmin.length} / {riwayatDatabasePusat.length} Data)
              </h3>
              <p className="text-xs text-slate-300">
                Klik tombol <strong>&ldquo;Buka Sertifikat &amp; Laporan&rdquo;</strong> pada peserta mana saja untuk melihat atau mencetak ulang Sertifikat Landscape maupun Laporan Lengkapnya.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={unduhRekapCsvExcel}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel (CSV)
              </button>
              <button
                type="button"
                onClick={unduhBackupMasterJson}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Backup Master JSON
              </button>
              <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Restore JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      try {
                        const parsed = JSON.parse(String(ev.target?.result));
                        if (Array.isArray(parsed)) {
                          const res = await fetch("/api/talent-mapping", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "import_backup",
                              records: parsed,
                            }),
                          });
                          const json = await res.json();
                          if (json.ok && Array.isArray(json.results)) {
                            setRiwayatDatabasePusat(json.results);
                            localStorage.setItem(
                              STORAGE_HASIL_KEY,
                              JSON.stringify(json.results)
                            );
                          }
                        }
                      } catch {}
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => setBukaPanelDatabasePusat(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>
          </div>

          {/* Filter Pencarian Nama/Email/Instansi & Filter Jenjang */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Cari nama peserta, email akun, sekolah/instansi, atau nomor sertifikat..."
                value={kataKunciCariAdmin}
                onChange={(e) => setKataKunciCariAdmin(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white"
              />
            </div>
            <div className="sm:col-span-5 flex flex-wrap gap-1.5">
              {[
                { id: "semua", l: "Semua Jenjang" },
                { id: "anak_tk_sd", l: "👶 Anak" },
                { id: "smp", l: "🧭 SMP" },
                { id: "sma", l: "🎓 SMA" },
                { id: "dewasa_284", l: "💼 Dewasa" },
              ].map((fj) => (
                <button
                  key={fj.id}
                  type="button"
                  onClick={() => setFilterJenjangAdmin(fj.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    filterJenjangAdmin === fj.id
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-950 text-slate-300 border border-slate-800"
                  }`}
                >
                  {fj.l}
                </button>
              ))}
            </div>
          </div>

          {daftarTampilAdmin.length === 0 ? (
            <div className="text-xs text-slate-400 p-6 text-center bg-slate-950 rounded-2xl">
              Belum ada data peserta yang cocok dengan filter pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {daftarTampilAdmin.map((item) => {
                const jenjangItem = item.tipeJenjang || "dewasa_284";
                return (
                  <div
                    key={item.idHasil}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-black text-sm text-emerald-400">
                          {item.namaPeserta}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-900/80 text-amber-300 font-black text-[9.5px] uppercase">
                          {jenjangItem}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-semibold">
                        {item.emailPeserta} • {item.instansiPeserta}
                      </div>
                      <div className="text-[11px] text-amber-200">
                        🏅 Bakat #1: {item.bakatUtama1_7?.[0]?.nama || "-"} |{" "}
                        {item.top5PersonalBranding?.[0]?.nama || "-"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.tanggalTes} • {item.nomorDokumenRahasia}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setHasilSaatIni(item);
                          setJenjangTesAktif("dewasa_284");
                          setTahapAktif("hasil");
                          setBukaPanelDatabasePusat(false);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Buka Sertifikat &amp; Laporan
                      </button>

                      {isAdminAtauHR && (
                        <button
                          type="button"
                          onClick={async () => {
                            const sisa = riwayatDatabasePusat.filter(
                              (x) => x.idHasil !== item.idHasil
                            );
                            setRiwayatDatabasePusat(sisa);
                            localStorage.setItem(
                              STORAGE_HASIL_KEY,
                              JSON.stringify(sisa)
                            );
                            await fetch("/api/talent-mapping", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "delete",
                                idHasil: item.idHasil,
                              }),
                            });
                          }}
                          className="p-2 rounded-xl bg-rose-950 text-rose-300 hover:bg-rose-800 cursor-pointer"
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
        </div>
      )}

      {/* JIKA PENGGUNA MEMILIH JENJANG ANAK, SMP, ATAU SMA */}
      {jenjangTesAktif !== "dewasa_284" ? (
        <MultiJenjangTalentSuite
          modeJenjang={jenjangTesAktif}
          namaPeserta={namaPeserta}
          setNamaPeserta={setNamaPeserta}
          instansiPeserta={instansiPeserta}
          setInstansiPeserta={setInstansiPeserta}
          emailPeserta={emailPeserta}
          onSimpanKeDatabasePusat={(paketBaru) => {
            setRiwayatDatabasePusat((prev) => [
              paketBaru,
              ...prev.filter((r) => r.idHasil !== paketBaru.idHasil),
            ]);
          }}
        />
      ) : (
        <>
          {/* NAVIGASI 4 TAHAP ASESMEN 284 SOAL */}
          <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "intro",
                label: "1. Data Peserta & Mulai",
                sub: "Pilihan Awal 100% Kosong",
              },
              {
                id: "sesi1",
                label: `2. Sesi 1 (${jumlahTerjawabSesi1}/170)`,
                sub: "34 Bakat (Skala 1–6)",
              },
              {
                id: "sesi2",
                label: `3. Sesi 2 (${jumlahTerjawabSesi2}/114)`,
                sub: "114 Aktivitas (Skala 1–7)",
              },
              {
                id: "hasil",
                label: "4. Sertifikat & Laporan PDF",
                sub: "2 Pilihan Print Terpisah",
              },
            ].map((t) => {
              const aktif = tahapAktif === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    if (t.id === "hasil") {
                      if (hasilSaatIni) setTahapAktif("hasil");
                      else prosesHitungDanBukaHasil();
                    } else {
                      setTahapAktif(
                        t.id as "intro" | "sesi1" | "sesi2" | "hasil"
                      );
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                    aktif
                      ? "bg-rose-600 text-white border-amber-300 shadow-lg"
                      : "bg-white text-slate-800 border-slate-200 hover:border-rose-400"
                  }`}
                >
                  <div className="font-black text-xs sm:text-sm">{t.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      aktif ? "text-amber-200" : "text-slate-500"
                    }`}
                  >
                    {t.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {pesanPeringatanKosong && (
            <div className="print:hidden p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-bold flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{pesanPeringatanKosong}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPesanPeringatanKosong("");
                    setTahapAktif("sesi1");
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black cursor-pointer"
                >
                  Kerjakan Sesi 1 Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const preset = buatPresetJawabanMuhammadSaputra();
                    setJawabanSesi1(preset.jawabanSesi1);
                    setJawabanSesi2(preset.jawabanSesi2);
                    setPesanPeringatanKosong("");
                    const hasilDemo = hitungHasilTalentMappingAkurat({
                      pemilikUserId: userLogin?.id || emailPeserta || "guest",
                      namaPeserta:
                        namaPeserta.trim() ||
                        userLogin?.nama ||
                        "Muhammad Saputra",
                      emailPeserta:
                        emailPeserta.trim() ||
                        userLogin?.email ||
                        "saputra@hibahilmu.id",
                      instansiPeserta,
                      jabatanAtauKelas: jabatanPeserta,
                      jawabanSesi1: preset.jawabanSesi1,
                      jawabanSesi2: preset.jawabanSesi2,
                    });
                    const paketDemo = { ...hasilDemo, tipeJenjang: "dewasa_284" };
                    setHasilSaatIni(paketDemo);
                    setTahapAktif("hasil");
                    simpanHasilKeDatabasePusat(paketDemo);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black cursor-pointer"
                >
                  Lihat Contoh Simulasi Cepat
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 1: IDENTITAS PESERTA & PENJELASAN AKURASI METODOLOGI */}
          {tahapAktif === "intro" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/hibahilmu.jpg"
                      alt="Logo Panda HibahIlmu"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        Status Soal: {jumlahTerjawabSesi1}/170 (Sesi 1) &amp;{" "}
                        {jumlahTerjawabSesi2}/114 (Sesi 2)
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-0.5">
                        Identitas Peserta Tes Talent Mapping (284 Soal)
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const preset = buatPresetJawabanMuhammadSaputra();
                      setJawabanSesi1(preset.jawabanSesi1);
                      setJawabanSesi2(preset.jawabanSesi2);
                      const hasilDemo = hitungHasilTalentMappingAkurat({
                        pemilikUserId: userLogin?.id || emailPeserta || "guest",
                        namaPeserta:
                          namaPeserta.trim() ||
                          userLogin?.nama ||
                          "Muhammad Saputra",
                        emailPeserta:
                          emailPeserta.trim() ||
                          userLogin?.email ||
                          "saputra@hibahilmu.id",
                        instansiPeserta,
                        jabatanAtauKelas: jabatanPeserta,
                        jawabanSesi1: preset.jawabanSesi1,
                        jawabanSesi2: preset.jawabanSesi2,
                      });
                      const paketDemo = { ...hasilDemo, tipeJenjang: "dewasa_284" };
                      setHasilSaatIni(paketDemo);
                      setTahapAktif("hasil");
                      simpanHasilKeDatabasePusat(paketDemo);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Simulasi Cepat (Demo)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <label className="font-black text-slate-700">
                      Nama Lengkap Peserta (Tercetak di Sertifikat &amp; Laporan):
                    </label>
                    <input
                      type="text"
                      placeholder="Ketik nama lengkapmu..."
                      value={namaPeserta}
                      onChange={(e) => setNamaPeserta(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-black text-slate-700">
                      Email Akun (Tersimpan Permanen ke Database Pusat):
                    </label>
                    <input
                      type="email"
                      placeholder="Ketik email akunmu..."
                      value={emailPeserta}
                      onChange={(e) => setEmailPeserta(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-black text-slate-700">
                      Sekolah / Kampus / Kelas / Instansi:
                    </label>
                    <input
                      type="text"
                      value={instansiPeserta}
                      onChange={(e) => setInstansiPeserta(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-black text-slate-700">
                      Status / Jenjang Saat Ini:
                    </label>
                    <input
                      type="text"
                      value={jabatanPeserta}
                      onChange={(e) => setJabatanPeserta(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIndeksSesi1(0);
                      setTahapAktif("sesi1");
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    Mulai Kerjakan Sesi 1 dari Kosong (Soal #1){" "}
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIndeksSesi2(0);
                      setTahapAktif("sesi2");
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                  >
                    Buka Sesi 2 (114 Aktivitas)
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-800 space-y-4">
                <div className="text-xs font-black uppercase text-amber-400">
                  🔬 Pertanggungjawaban Ilmiah &amp; Keamanan Database Pusat
                </div>
                <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <li className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-400 block mb-0.5">
                      1. Metodologi Psikometri Teruji (Z-Score &amp; Modulo-34):
                    </strong>
                    Menghitung kekuatan relatif 34 Bakat Alami (PSP), 114 Aktivitas Kerja (PSS), dan indeks konsistensi internal jawaban peserta secara matematis.
                  </li>
                  <li className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <strong className="text-amber-300 block mb-0.5">
                      2. Database Pusat Permanen (Multi-Cloud Mirror):
                    </strong>
                    Setiap peserta yang selesai tes otomatis disimpan ke Server Pusat + 2 Cloud KVDB Mirror + fitur Export JSON/CSV Admin agar tidak pernah hilang.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAHAP 2: KUESIONER SESI 1 */}
          {tahapAktif === "sesi1" && soal1Aktif && (
            <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-indigo-100 text-indigo-900">
                    SESI 1 • KENALI 34 BAKAT ALAMIMU ({jumlahTerjawabSesi1} / 170 Terjawab)
                  </span>
                  <h2 className="text-lg sm:text-xl font-black mt-1">
                    Pernyataan #{soal1Aktif.no} dari 170 Soal
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 font-black text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoNextAktif}
                      onChange={(e) => setAutoNextAktif(e.target.checked)}
                    />
                    <span>Otomatis Pindah Soal Saat Dijawab</span>
                  </label>
                  <button
                    type="button"
                    onClick={kosongkanSemuaJawaban}
                    className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Kosongkan Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setTahapAktif("sesi2")}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black cursor-pointer"
                  >
                    Lanjut ke Sesi 2 (114 Soal) ➔
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-inner">
                <div className="flex justify-between items-center text-xs font-mono text-amber-400">
                  <span>Pernyataan Nomor {soal1Aktif.no} / 170</span>
                  <span>
                    {jawabanSesi1[soal1Aktif.no] !== undefined
                      ? `✓ Sudah Dijawab (Pilihan: ${jawabanSesi1[soal1Aktif.no]})`
                      : "○ Belum Dijawab — Klik Salah Satu Angka di Bawah"}
                  </span>
                </div>
                <p className="text-lg sm:text-2xl font-black leading-relaxed">
                  &ldquo;{soal1Aktif.pernyataan}&rdquo;
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-2">
                  {[
                    { val: 1, label: "Sangat Tidak Setuju" },
                    { val: 2, label: "Tidak Setuju" },
                    { val: 3, label: "Agak Tidak Setuju" },
                    { val: 4, label: "Agak Setuju" },
                    { val: 5, label: "Setuju" },
                    { val: 6, label: "Sangat Setuju" },
                  ].map((opsi) => {
                    const dipilih = jawabanSesi1[soal1Aktif.no] === opsi.val;
                    return (
                      <button
                        key={opsi.val}
                        type="button"
                        onClick={() =>
                          pilihJawabanSoalSesi1(soal1Aktif.no, opsi.val)
                        }
                        className={`p-3.5 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          dipilih
                            ? "bg-emerald-500 text-slate-950 border-white scale-105 shadow-lg"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400"
                        }`}
                      >
                        <span className="text-lg">{opsi.val}</span>
                        <span className="text-[10px] text-center leading-tight">
                          {opsi.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  disabled={indeksSesi1 === 0}
                  onClick={() => setIndeksSesi1((i) => Math.max(0, i - 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
                </button>
                <span className="text-xs font-bold text-slate-600">
                  Terisi: {jumlahTerjawabSesi1} / 170 Soal
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (indeksSesi1 < 169) setIndeksSesi1((i) => i + 1);
                    else setTahapAktif("sesi2");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  {indeksSesi1 < 169
                    ? "Soal Selanjutnya"
                    : "Selesai Sesi 1 -> Masuk Sesi 2"}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 rounded-2xl bg-slate-50 border">
                {SOAL_SESI_1_170.map((s, idx) => {
                  const sudahIsi = jawabanSesi1[s.no] !== undefined;
                  const sedangAktif = idx === indeksSesi1;
                  return (
                    <button
                      key={s.no}
                      type="button"
                      onClick={() => setIndeksSesi1(idx)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black cursor-pointer border transition ${
                        sedangAktif
                          ? "bg-rose-600 text-white border-rose-700 scale-110"
                          : sudahIsi
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      {s.no}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAHAP 3: KUESIONER SESI 2 */}
          {tahapAktif === "sesi2" && soal2Aktif && (
            <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                    SESI 2 • 114 AKTIVITAS YANG KAMU SUKAI ({jumlahTerjawabSesi2} / 114 Terjawab)
                  </span>
                  <h2 className="text-lg sm:text-xl font-black mt-1">
                    Aktivitas #{soal2Aktif.no} dari 114 — [{soal2Aktif.kodeAktivitas}]
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoNextAktif}
                      onChange={(e) => setAutoNextAktif(e.target.checked)}
                    />
                    <span>Otomatis Pindah Soal</span>
                  </label>
                  <div
                    className={`px-4 py-2 rounded-2xl border-2 text-xs font-black ${
                      jumlahSangatKuatSesi2 > 22
                        ? "bg-rose-100 border-rose-500 text-rose-900"
                        : "bg-emerald-50 border-emerald-400 text-emerald-900"
                    }`}
                  >
                    Sangat Kuat (7): {jumlahSangatKuatSesi2} / Maks. 22
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-inner">
                <div className="flex justify-between items-center text-xs font-mono text-amber-400">
                  <span>
                    Aktivitas #{soal2Aktif.no} / 114 • {soal2Aktif.kodeAktivitas}
                  </span>
                  <span>
                    {jawabanSesi2[soal2Aktif.no] !== undefined
                      ? `✓ Sudah Dijawab (Skor ${jawabanSesi2[soal2Aktif.no]})`
                      : "○ Belum Dijawab — Klik Salah Satu Pilihan"}
                  </span>
                </div>

                <p className="text-lg sm:text-2xl font-black leading-relaxed">
                  &ldquo;{soal2Aktif.pernyataan}&rdquo;
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-2">
                  {[
                    { val: 7, label: "Sangat Kuat" },
                    { val: 6, label: "Kuat" },
                    { val: 5, label: "Agak Kuat" },
                    { val: 4, label: "Netral" },
                    { val: 3, label: "Agak Lemah" },
                    { val: 2, label: "Lemah" },
                    { val: 1, label: "Sangat Lemah" },
                  ].map((opsi) => {
                    const dipilih = jawabanSesi2[soal2Aktif.no] === opsi.val;
                    return (
                      <button
                        key={opsi.val}
                        type="button"
                        onClick={() =>
                          pilihJawabanSoalSesi2(soal2Aktif.no, opsi.val)
                        }
                        className={`p-3 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          dipilih
                            ? "bg-amber-400 text-slate-950 border-white scale-105 shadow-lg"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-400"
                        }`}
                      >
                        <span className="text-base">{opsi.val}</span>
                        <span className="text-[10px] text-center leading-tight">
                          {opsi.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3">
                <button
                  type="button"
                  disabled={indeksSesi2 === 0}
                  onClick={() => setIndeksSesi2((i) => Math.max(0, i - 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={prosesHitungDanBukaHasil}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Selesai &amp; Simpan ke Database Pusat
                </button>

                <button
                  type="button"
                  disabled={indeksSesi2 === 113}
                  onClick={() => setIndeksSesi2((i) => Math.min(113, i + 1))}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAHAP 4: TAMPILKAN SERTIFIKAT & LAPORAN (BAIK DARI JENJANG ANAK/SMP/SMA MAUPUN DEWASA) */}
          {tahapAktif === "hasil" && hasilSaatIni && (
            <>
              {hasilSaatIni.daftarUrutMultiJenjang ? (
                <MultiJenjangCertificateAndReport
                  modeJenjang={hasilSaatIni.tipeJenjang || "anak_tk_sd"}
                  namaPeserta={hasilSaatIni.namaPeserta}
                  instansiPeserta={hasilSaatIni.instansiPeserta}
                  emailPeserta={hasilSaatIni.emailPeserta}
                  judulLaporan={
                    hasilSaatIni.judulLaporanMultiJenjang ||
                    "Laporan Komprehensif Pemetaan Bakat"
                  }
                  subjudulJenjang={
                    hasilSaatIni.subjudulJenjangMultiJenjang ||
                    hasilSaatIni.instansiPeserta
                  }
                  daftarUrut={hasilSaatIni.daftarUrutMultiJenjang}
                  galeriKaryaKanvas={hasilSaatIni.galeriKaryaKanvas || {}}
                  statusCloud={statusSimpan}
                  onSimpanCloud={() => simpanHasilKeDatabasePusat(hasilSaatIni)}
                />
              ) : (
                <div className="space-y-6 print:space-y-0">
                  <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {statusSimpan || "Tersimpan di Database Pusat Cloud"} • Pilih Jenis Print:
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => simpanHasilKeDatabasePusat(hasilSaatIni)}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CloudUpload className="w-4 h-4" /> Sinkronkan ke Database Pusat
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eksekusiPrintDewasaTerpisah("sertifikat_saja")
                        }
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <Medal className="w-4 h-4" /> 1. Print Sertifikat Saja (A4 Landscape)
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eksekusiPrintDewasaTerpisah("laporan_saja")
                        }
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <FileText className="w-4 h-4" /> 2. Print Laporan Hasil Saja (PDF)
                      </button>
                    </div>
                  </div>

                  {/* SERTIFIKAT EMAS DEWASA (A4 LANDSCAPE) */}
                  <div
                    className={
                      modePrintDewasa === "laporan_saja"
                        ? "hidden print:hidden"
                        : "p-1.5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-2xl print:shadow-none break-inside-avoid print:max-h-[192mm] print:overflow-hidden"
                    }
                  >
                    <div className="bg-gradient-to-b from-[#fffdf5] via-white to-[#fefce8] text-slate-900 p-6 sm:p-8 print:p-5 rounded-[22px] border-4 border-double border-amber-600/80 space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-3 border-b-2 border-amber-300 pb-3">
                        <div className="flex items-center gap-3.5">
                          <img
                            src="/hibahilmu.jpg"
                            alt="Logo Panda HibahIlmu"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                            }}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
                          />
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                              OFFICIAL TALENT CERTIFICATE • PANDA HIBAHILMU INDONESIA
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                              SERTIFIKAT KOMPETENSI &amp; PEMETAAN BAKAT (TALENTS MAPPING®)
                            </h3>
                            <div className="text-xs font-bold text-emerald-700">
                              No. Dokumen: {hasilSaatIni.nomorDokumenRahasia}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1">
                            <Award className="w-4 h-4" /> TERVERIFIKASI
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 mt-1">
                            Diterbitkan: {hasilSaatIni.tanggalTes}
                          </span>
                        </div>
                      </div>

                      <div className="text-center space-y-1.5 py-1">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Diberikan secara resmi kepada:
                        </div>
                        <div className="text-2xl sm:text-4xl font-black text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-8">
                          {hasilSaatIni.namaPeserta}
                        </div>
                        <div className="pt-1">
                          <span className="inline-block px-5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow">
                            🌟 Personal Branding Utama:{" "}
                            {hasilSaatIni.top5PersonalBranding?.[0]?.nama} &amp;{" "}
                            {hasilSaatIni.top5PersonalBranding?.[1]?.nama}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 print:grid-cols-7">
                        {(hasilSaatIni.bakatUtama1_7 || []).map((b: any) => (
                          <div
                            key={b.id}
                            className="p-2 rounded-xl bg-white border-2 border-amber-400 text-center space-y-0.5"
                          >
                            <div className="text-[10px] font-black text-rose-600">
                              #{b.peringkat} • {b.domain}
                            </div>
                            <div className="font-black text-xs text-slate-900">
                              {b.nama}
                            </div>
                            <div className="text-[9px] font-bold text-slate-500 leading-tight">
                              {b.julukanRemaja}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-amber-300 flex justify-between items-end gap-4 text-xs">
                        <div>
                          <div className="font-black text-slate-800">
                            Instansi / Kelas: {hasilSaatIni.instansiPeserta}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Akun Terdaftar: {hasilSaatIni.emailPeserta}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-sm text-emerald-800">
                            Panda HibahIlmu Talent &amp; People Development Center
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            hibahilmu.my.id • Database Pusat Terverifikasi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LAPORAN LENGKAP 9 BAGIAN (A4 PORTRAIT) */}
                  <div
                    className={
                      modePrintDewasa === "sertifikat_saja"
                        ? "hidden print:hidden"
                        : "bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0 print:space-y-5"
                    }
                  >
                    <div className="border-b-4 border-emerald-700 pb-5 flex flex-wrap justify-between items-center gap-4 break-inside-avoid">
                      <div className="flex items-center gap-4">
                        <img
                          src="/hibahilmu.jpg"
                          alt="Logo Panda HibahIlmu"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                          }}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                        />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            PANDA HIBAHILMU.ID • PUSAT PEMETAAN BAKAT &amp; KARIER MASA DEPAN
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            Laporan Hasil Pemetaan Bakat &amp; Kekuatan Diri
                          </h2>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5 bg-rose-50 border-2 border-rose-600 px-4 py-2 rounded-2xl">
                        <div className="text-[10px] font-black uppercase tracking-widest text-rose-700 flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> DOKUMEN BERSIFAT RAHASIA (CONFIDENTIAL)
                        </div>
                        <div className="text-sm font-black text-slate-900">
                          Nama: {hasilSaatIni.namaPeserta}
                        </div>
                        <div className="text-[11px] font-bold text-slate-600">
                          {hasilSaatIni.emailPeserta} • {hasilSaatIni.instansiPeserta}
                        </div>
                      </div>
                    </div>

                    {hasilSaatIni.urutan34Bakat && (
                      <Scm114FullVisualMap hasil={hasilSaatIni} />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TalentMappingAssessmentView;