"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldAlert,
  Printer,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
  CloudUpload,
  FolderOpen,
  Trash2,
  RotateCcw,
  AlertCircle,
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

interface Props {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

const STORAGE_HASIL_KEY = "hibahilmu_talent_mapping_results_v3";

export const TalentMappingAssessmentView: React.FC<Props> = ({
  userLogin,
  tambahXP,
}) => {
  const [tahapAktif, setTahapAktif] = useState<
    "intro" | "sesi1" | "sesi2" | "hasil"
  >("intro");

  const emailAkunAktif = (userLogin?.email || "guest@hibahilmu.id")
    .trim()
    .toLowerCase();
  const draftJawabanKey = `hibahilmu_tm_draft_answers_${emailAkunAktif}`;

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

  // ==========================================================================
  // 1. PILIHAN AWAL 100% KOSONG ({}) SAAT PERTAMA KALI MENGERJAKAN!
  // ==========================================================================
  const [jawabanSesi1, setJawabanSesi1] = useState<Record<number, number>>({});
  const [jawabanSesi2, setJawabanSesi2] = useState<Record<number, number>>({});
  const [sudahMuatDraft, setSudahMuatDraft] = useState<boolean>(false);

  const [indeksSesi1, setIndeksSesi1] = useState<number>(0);
  const [indeksSesi2, setIndeksSesi2] = useState<number>(0);
  const [autoNextAktif, setAutoNextAktif] = useState<boolean>(true);

  const [hasilSaatIni, setHasilSaatIni] =
    useState<HasilLengkapTalentMapping | null>(null);
  const [riwayatTersimpan, setRiwayatTersimpan] = useState<
    HasilLengkapTalentMapping[]
  >([]);
  const [bukaRiwayatCloud, setBukaRiwayatCloud] = useState<boolean>(false);
  const [statusSimpan, setStatusSimpan] = useState<string>("");
  const [pesanPeringatanKosong, setPesanPeringatanKosong] =
    useState<string>("");

  // Sinkronkan identitas dengan akun yang sedang login & pulihkan draft pengerjaan milik akun tersebut
  useEffect(() => {
    if (userLogin) {
      setNamaPeserta(userLogin.nama);
      setEmailPeserta(userLogin.email);
      const inst = (userLogin as { instansi?: string }).instansi;
      if (inst) setInstansiPeserta(inst);
    }
    try {
      const rawDraft = localStorage.getItem(draftJawabanKey);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed.s1 && typeof parsed.s1 === "object") setJawabanSesi1(parsed.s1);
        if (parsed.s2 && typeof parsed.s2 === "object") setJawabanSesi2(parsed.s2);
      } else {
        setJawabanSesi1({});
        setJawabanSesi2({});
      }
    } catch {}
    setSudahMuatDraft(true);
  }, [userLogin, draftJawabanKey]);

  // Simpan draf jawaban sementara per akun setiap kali peserta mengklik pilihan
  useEffect(() => {
    if (!sudahMuatDraft) return;
    try {
      localStorage.setItem(
        draftJawabanKey,
        JSON.stringify({ s1: jawabanSesi1, s2: jawabanSesi2 })
      );
    } catch {}
  }, [jawabanSesi1, jawabanSesi2, sudahMuatDraft, draftJawabanKey]);

  // ==========================================================================
  // 2. SINKRONISASI RIWAYAT HASIL TES DI AKUN DATABASE LINTAS PC / INTERNET
  // ==========================================================================
  const muatRiwayatDariCloudDanLokal = async () => {
    let lokalList: HasilLengkapTalentMapping[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_HASIL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) lokalList = parsed;
      }
    } catch {}

    try {
      const qEmail = encodeURIComponent(
        userLogin?.email || emailPeserta || ""
      );
      const qRole = encodeURIComponent(userLogin?.role || "siswa");
      const res = await fetch(
        `/api/talent-mapping?email=${qEmail}&role=${qRole}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (json.ok && Array.isArray(json.results) && json.results.length > 0) {
        // Filter agar akun siswa/pengguna langsung melihat hasil tes miliknya sendiri
        const milikAkunIni = json.results.filter(
          (r: HasilLengkapTalentMapping) =>
            !userLogin ||
            userLogin.role === "admin" ||
            (r.emailPeserta || "").toLowerCase() ===
              userLogin.email.toLowerCase() ||
            r.pemilikUserId === userLogin.id
        );
        const daftarFinal =
          milikAkunIni.length > 0 ? milikAkunIni : json.results;
        setRiwayatTersimpan(daftarFinal);
        localStorage.setItem(STORAGE_HASIL_KEY, JSON.stringify(daftarFinal));
        return;
      }
    } catch {}

    if (lokalList.length > 0) {
      setRiwayatTersimpan(lokalList);
    }
  };

  useEffect(() => {
    muatRiwayatDariCloudDanLokal();
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
    try {
      localStorage.removeItem(draftJawabanKey);
    } catch {}
  };

  const simpanHasilKeCloudServer = async (
    hasilTarget: HasilLengkapTalentMapping
  ) => {
    setStatusSimpan("Menyimpan ke Akun Database Cloud...");
    const baru = [
      hasilTarget,
      ...riwayatTersimpan.filter((r) => r.idHasil !== hasilTarget.idHasil),
    ].slice(0, 50);
    setRiwayatTersimpan(baru);

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
          result: hasilTarget,
        }),
      });
      const json = await res.json();
      if (json.ok && Array.isArray(json.results)) {
        const milikUser = json.results.filter(
          (r: HasilLengkapTalentMapping) =>
            !userLogin ||
            userLogin.role === "admin" ||
            (r.emailPeserta || "").toLowerCase() ===
              userLogin.email.toLowerCase() ||
            r.pemilikUserId === userLogin.id
        );
        setRiwayatTersimpan(milikUser.length > 0 ? milikUser : json.results);
      }
      setStatusSimpan("Tersimpan Permanen di Akun Cloud Database ✓");
    } catch {
      setStatusSimpan("Tersimpan di Lokal Browser ✓");
    }
  };

  const prosesHitungDanBukaHasil = () => {
    if (jumlahTerjawabSesi1 === 0 && jumlahTerjawabSesi2 === 0) {
      setPesanPeringatanKosong(
        "Kamu belum mengisi jawaban soal Sesi 1 maupun Sesi 2. Silakan kerjakan soal terlebih dahulu, atau klik tombol 'Isi Contoh Simulasi Cepat' jika hanya ingin mencoba melihat contoh laporan."
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
    setHasilSaatIni(hasil);
    setTahapAktif("hasil");
    tambahXP(100);
    simpanHasilKeCloudServer(hasil);
  };

  const soal1Aktif = SOAL_SESI_1_170[indeksSesi1];
  const soal2Aktif = SOAL_SESI_2_114_SCM[indeksSesi2];

  return (
    <div className="space-y-8">
      {/* ATURAN CSS KHUSUS PRINT / SAVE PDF AGAR TIDAK ADA KOTAK YANG TERPOTONG */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 12mm 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: #ffffff !important;
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

      {/* BANNER UTAMA HRBP, TALENT MANAGEMENT & OD SPECIALIST CENTER */}
      <div className="print:hidden bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/60 shadow-2xl flex flex-wrap justify-between items-center gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
              🔥 TES PEMETAAN BAKAT &amp; KARIER
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
              Bahasa Ramah Pelajar, Remaja &amp; Umum
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-amber-300 text-[11px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dokumen Bersifat Rahasia (Confidential)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            Panda HibahIlmu Talent Mapping &amp; Peta Kekuatan Diri
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Kenali <strong>34 Bakat Alami</strong> (Sesi 1: 170 Soal),{" "}
            <strong>114 Aktivitas Unggulan</strong> (Sesi 2: 114 Soal), dan{" "}
            <strong>5 Peran Personal Branding</strong> terbaikmu. Hasil otomatis
            tersimpan di akunmu walaupun pindah PC atau jaringan internet!
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              muatRiwayatDariCloudDanLokal();
              setBukaRiwayatCloud(!bukaRiwayatCloud);
            }}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <FolderOpen className="w-4 h-4" /> Hasil Tersimpan di Akun Saya (
            {riwayatTersimpan.length})
          </button>

          <button
            type="button"
            onClick={() => {
              const preset = buatPresetJawabanMuhammadSaputra();
              setJawabanSesi1(preset.jawabanSesi1);
              setJawabanSesi2(preset.jawabanSesi2);
              const hasilDemo = hitungHasilTalentMappingAkurat({
                pemilikUserId: userLogin?.id || emailPeserta || "guest",
                namaPeserta: namaPeserta.trim() || userLogin?.nama || "Muhammad Saputra",
                emailPeserta: emailPeserta.trim() || userLogin?.email || "saputra@hibahilmu.id",
                instansiPeserta,
                jabatanAtauKelas: jabatanPeserta,
                jawabanSesi1: preset.jawabanSesi1,
                jawabanSesi2: preset.jawabanSesi2,
              });
              setHasilSaatIni(hasilDemo);
              setTahapAktif("hasil");
              simpanHasilKeCloudServer(hasilDemo);
            }}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-400/50 text-amber-300 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Isi Contoh Simulasi Cepat (Demo)
          </button>
        </div>
      </div>

      {/* PANEL ARSIP HASIL TES MILIK AKUN DI SERVER CLOUD */}
      {bukaRiwayatCloud && (
        <div className="print:hidden bg-slate-900 text-white p-5 rounded-3xl border-2 border-emerald-500/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-emerald-300">
              📂 Riwayat Hasil Tes Talent Mapping di Akun ({userLogin?.email || "Tamu"}) — Tersinkronisasi Cloud
            </span>
            <button
              type="button"
              onClick={() => setBukaRiwayatCloud(false)}
              className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Tutup ✕
            </button>
          </div>
          {riwayatTersimpan.length === 0 ? (
            <div className="text-xs text-slate-400">
              Belum ada hasil tes yang disimpan di akun ini. Silakan kerjakan Sesi 1 &amp; Sesi 2 lalu klik Selesai.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {riwayatTersimpan.map((item) => (
                <div
                  key={item.idHasil}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 flex justify-between items-center gap-2"
                >
                  <div
                    onClick={() => {
                      setHasilSaatIni(item);
                      setTahapAktif("hasil");
                      setBukaRiwayatCloud(false);
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="font-black text-xs text-emerald-400">
                      {item.namaPeserta}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Bakat #1: {item.bakatUtama1_7?.[0]?.nama} • Peran:{" "}
                      {item.top5PersonalBranding?.[0]?.nama}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      {item.tanggalTes} • {item.emailPeserta}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const sisa = riwayatTersimpan.filter(
                        (x) => x.idHasil !== item.idHasil
                      );
                      setRiwayatTersimpan(sisa);
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
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NAVIGASI 4 TAHAP ASESMEN */}
      <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            id: "intro",
            label: "1. Data Akun & Petunjuk",
            sub: "Mulai / Reset Jawaban",
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
            label: "4. Laporan & Simpan PDF",
            sub: "Hasil Lengkap & Cetak",
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
        <div className="print:hidden p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-bold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{pesanPeringatanKosong}</span>
          </div>
          <button
            type="button"
            onClick={() => setTahapAktif("sesi1")}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black shrink-0 cursor-pointer"
          >
            Kerjakan Sesi 1 Sekarang
          </button>
        </div>
      )}

      {/* TAHAP 1: IDENTITAS PESERTA, PRIVASI RAHASIA, & PETUNJUK RESMI */}
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
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    Terhubung ke Akun: {userLogin?.nama || "Peserta"}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    Identitas Peserta Tes Talent Mapping
                  </h2>
                </div>
              </div>

              {(jumlahTerjawabSesi1 > 0 || jumlahTerjawabSesi2 > 0) && (
                <button
                  type="button"
                  onClick={kosongkanSemuaJawaban}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Kosongkan Semua Jawaban
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-black text-slate-700">
                  Nama Lengkap Peserta (Tercetak di Laporan):
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
                  Email Akun (Untuk Simpan ke Cloud Database):
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

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs space-y-1.5">
              <div className="font-black flex items-center gap-1.5 text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> JAMINAN PRIVASI &amp; KERAHASIAAN DOKUMEN
              </div>
              <p className="leading-relaxed">
                Seluruh jawaban dan laporan hasil tes ini bersifat{" "}
                <strong>RAHASIA PRIBADI (CONFIDENTIAL)</strong> dan tersimpan aman
                di akunmu. Penjelasan hasil disusun dengan bahasa yang ramah,
                membangun, dan mudah dipahami oleh pelajar remaja maupun dewasa.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTahapAktif("sesi1")}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                Mulai Kerjakan Sesi 1 (170 Soal){" "}
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setTahapAktif("sesi2")}
                className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                Buka Sesi 2 (114 Aktivitas)
              </button>

              {(jumlahTerjawabSesi1 > 0 || jumlahTerjawabSesi2 > 0) && (
                <button
                  type="button"
                  onClick={prosesHitungDanBukaHasil}
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Hitung &amp; Lihat Hasil Saya
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-800 space-y-4">
            <div className="text-xs font-black uppercase text-amber-400">
              📋 Cara Mengerjakan Tes (Sangat Mudah!)
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">
                  1. Sesi 1 — 170 Soal Kebiasaan &amp; Sifat Alami:
                </strong>
                Pilih angka <strong>1 (Sangat Tidak Setuju)</strong> sampai{" "}
                <strong>6 (Sangat Setuju)</strong>. Jawablah dengan jujur sesuai
                dirimu sehari-hari. Tidak ada jawaban benar atau salah!
              </li>
              <li className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-300 block mb-0.5">
                  2. Sesi 2 — 114 Aktivitas yang Kamu Sukai (30–40 Menit):
                </strong>
                Pilih salah satu dari 7 pilihan: <em>Sangat Kuat (7)</em> sampai{" "}
                <em>Sangat Lemah (1)</em>. Begitu diklik, soal otomatis lanjut ke
                nomor berikutnya.
              </li>
              <li className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200">
                <strong className="text-amber-300 block mb-0.5">
                  ⚠️ TIPS PENTING SESI 2:
                </strong>
                Usahakan memilih jawaban{" "}
                <strong>
                  &ldquo;SANGAT KUAT (7)&rdquo; MAKSIMAL 22 SOAL SAJA
                </strong>{" "}
                supaya bakat dan aktivitas terkuatmu terlihat paling menonjol!
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAHAP 2: KUESIONER SESI 1 (170 SOAL — PILIHAN AWAL KOSONG) */}
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
              <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNextAktif}
                  onChange={(e) => setAutoNextAktif(e.target.checked)}
                />
                <span>Otomatis Pindah Soal Berikutnya</span>
              </label>
              <button
                type="button"
                onClick={kosongkanSemuaJawaban}
                className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold cursor-pointer"
              >
                Reset Kosongkan
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
                {jawabanSesi1[soal1Aktif.no]
                  ? `✓ Sudah Dijawab (Skor ${jawabanSesi1[soal1Aktif.no]})`
                  : "○ Belum Dijawab (Silakan Pilih)"}
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
                    onClick={() => {
                      setJawabanSesi1((prev) => ({
                        ...prev,
                        [soal1Aktif.no]: opsi.val,
                      }));
                      if (autoNextAktif && indeksSesi1 < 169) {
                        setIndeksSesi1((i) => i + 1);
                      }
                    }}
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
              Progres Sesi 1: {jumlahTerjawabSesi1} / 170 Soal Terisi
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
              const isi = jawabanSesi1[s.no];
              const sedangAktif = idx === indeksSesi1;
              return (
                <button
                  key={s.no}
                  type="button"
                  onClick={() => setIndeksSesi1(idx)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black cursor-pointer border transition ${
                    sedangAktif
                      ? "bg-rose-600 text-white border-rose-700 scale-110"
                      : isi
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

      {/* TAHAP 3: KUESIONER SESI 2 (114 AKTIVITAS PSS — PILIHAN AWAL KOSONG) */}
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

            <div
              className={`px-4 py-2 rounded-2xl border-2 text-xs font-black flex items-center gap-2 ${
                jumlahSangatKuatSesi2 > 22
                  ? "bg-rose-100 border-rose-500 text-rose-900"
                  : "bg-emerald-50 border-emerald-400 text-emerald-900"
              }`}
            >
              <span>
                Pilihan &ldquo;Sangat Kuat (7)&rdquo;: {jumlahSangatKuatSesi2} / Maks. 22 Soal
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-inner">
            <div className="flex justify-between items-center text-xs font-mono text-amber-400">
              <span>
                Aktivitas #{soal2Aktif.no} / 114 • {soal2Aktif.kodeAktivitas}
              </span>
              <span>
                {jawabanSesi2[soal2Aktif.no]
                  ? `✓ Sudah Dijawab (Skor ${jawabanSesi2[soal2Aktif.no]})`
                  : "○ Belum Dijawab (Silakan Pilih)"}
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
                    onClick={() => {
                      setJawabanSesi2((prev) => ({
                        ...prev,
                        [soal2Aktif.no]: opsi.val,
                      }));
                      if (autoNextAktif && indeksSesi2 < 113) {
                        setIndeksSesi2((i) => i + 1);
                      }
                    }}
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
              <CheckCircle2 className="w-4 h-4" /> Selesai &amp; Simpan Hasil ke Akun Saya
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

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 rounded-2xl bg-slate-50 border">
            {SOAL_SESI_2_114_SCM.map((s, idx) => {
              const isi = jawabanSesi2[s.no];
              const sedangAktif = idx === indeksSesi2;
              return (
                <button
                  key={s.no}
                  type="button"
                  onClick={() => setIndeksSesi2(idx)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black cursor-pointer border transition ${
                    sedangAktif
                      ? "bg-rose-600 text-white border-rose-700 scale-110"
                      : isi === 7
                      ? "bg-amber-400 text-slate-950 border-amber-600"
                      : isi
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

      {/* TAHAP 4: LAPORAN EKSEKUTIF RAPI ANTI-TERPOTONG SAAT PRINT PDF */}
      {tahapAktif === "hasil" && hasilSaatIni && (
        <div className="space-y-6">
          <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {statusSimpan || "Tersimpan di Akun Cloud"} • Akun:{" "}
                {hasilSaatIni.emailPeserta}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => simpanHasilKeCloudServer(hasilSaatIni)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" /> Sinkronkan ke Akun Cloud
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> Cetak / Simpan PDF Rapi (A4)
              </button>
            </div>
          </div>

          {/* KERTAS LAPORAN RESMI (SUDAH DIOPTIMASI AGAR TIDAK TERPOTONG SAAT SAVE PDF) */}
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0 print:space-y-5">
            {/* KOP SURAT EKSEKUTIF & CAP DOKUMEN RAHASIA */}
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
                  <div className="text-xs font-bold text-slate-600 mt-0.5">
                    Panduan Mengenali Potensi Alami untuk Pelajar, Remaja, Mahasiswa &amp; Umum
                  </div>
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
                  Akun: {hasilSaatIni.emailPeserta} • {hasilSaatIni.instansiPeserta}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {hasilSaatIni.tanggalTes} • No: {hasilSaatIni.nomorDokumenRahasia}
                </div>
              </div>
            </div>

            {/* BAGIAN 1: URUTAN LENGKAP 34 BAKAT & PETA 4 DOMAIN */}
            <div className="space-y-3 break-inside-avoid">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-1.5">
                <h3 className="text-base sm:text-lg font-black uppercase text-slate-900">
                  1. Peta Urutan 34 Bakat &amp; Gaya Produktivitas —{" "}
                  {hasilSaatIni.namaPeserta}
                </h3>
                <span className="text-xs font-black text-indigo-700">
                  Kekuatan Utama: {hasilSaatIni.duaDomainDominan[0]} &amp;{" "}
                  {hasilSaatIni.duaDomainDominan[1]}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border">
                {hasilSaatIni.profilProduktivitasNarasi}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-4">
                {(
                  ["Thinking", "Striving", "Relating", "Influencing"] as const
                ).map((dom) => {
                  const listDom = hasilSaatIni.urutan34Bakat.filter(
                    (b) => b.domain === dom
                  );
                  const warnaHeader =
                    dom === "Thinking"
                      ? "bg-emerald-700"
                      : dom === "Striving"
                      ? "bg-amber-600"
                      : dom === "Relating"
                      ? "bg-rose-700"
                      : "bg-purple-800";
                  return (
                    <div
                      key={dom}
                      className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 break-inside-avoid"
                    >
                      <div
                        className={`${warnaHeader} text-white px-3 py-1.5 font-black text-xs flex justify-between items-center`}
                      >
                        <span>{dom}</span>
                        <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full">
                          Top 14: {hasilSaatIni.distribusiDomainTop14[dom]}
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        {listDom.map((b) => (
                          <div
                            key={b.id}
                            className="flex justify-between items-center text-[11px] px-2 py-1 rounded-lg bg-white border"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                style={{ backgroundColor: b.warnaHex }}
                                className={`w-2.5 h-2.5 rounded-full shrink-0 border ${
                                  b.peringkat <= 14 || b.peringkat >= 22
                                    ? "border-transparent"
                                    : "border-slate-400"
                                }`}
                              />
                              <span className="font-bold text-slate-800 truncate">
                                {b.nama}
                              </span>
                            </div>
                            <span className="font-mono font-black text-[10px] text-slate-600 shrink-0">
                              #{b.peringkat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BAGIAN 2: DESKRIPSI 7 BAKAT UTAMA (1-7) & 7 BAKAT PENDUKUNG (8-14) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:grid-cols-2">
              <div className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-black uppercase text-rose-700 border-b-2 border-rose-600 pb-1">
                  2. 7 Bakat Utama Paling Menonjol (Urutan 1–7)
                </h3>
                {hasilSaatIni.bakatUtama1_7.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1 break-inside-avoid"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-black text-xs sm:text-sm text-rose-900">
                        #{b.peringkat}. {b.nama} —{" "}
                        <span className="text-rose-700">{b.julukanRemaja}</span>
                      </span>
                      <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white shrink-0">
                        {b.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {b.deskripsiKuat}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-black uppercase text-amber-700 border-b-2 border-amber-500 pb-1">
                  3. 7 Bakat Pendukung (Urutan 8–14)
                </h3>
                {hasilSaatIni.bakatPendukung8_14.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 break-inside-avoid"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-black text-xs sm:text-sm text-amber-950">
                        #{b.peringkat}. {b.nama} —{" "}
                        <span className="text-amber-800">{b.julukanRemaja}</span>
                      </span>
                      <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 shrink-0">
                        {b.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {b.deskripsiKuat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BAGIAN 3: DESKRIPSI BAKAT URUTAN 28-34 & TIPS MENGATASINYA */}
            <div className="space-y-2.5 break-inside-avoid">
              <h3 className="text-sm sm:text-base font-black uppercase text-slate-900 border-b-2 border-slate-800 pb-1">
                4. Bakat Urutan Bawah (28–34) &amp; Cara Cerdas Menyiasatinya
              </h3>
              <p className="text-xs text-slate-600">
                Setiap orang punya sisi yang kurang dominan. Kamu tidak perlu
                minder! Gunakan tips sederhana di bawah ini atau berkolaborasilah
                dengan teman yang kuat di bidang tersebut:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 print:grid-cols-2">
                {hasilSaatIni.bakatLemah28_34.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-slate-100 border border-slate-300 space-y-1 break-inside-avoid"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs text-slate-900">
                        #{b.peringkat}. {b.nama} ({b.julukanRemaja})
                      </span>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                        Tips Kolaborasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {b.saranLemah}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BAGIAN 4: 14 AKTIVITAS UNGGULAN & 5 PERSONAL BRANDING */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 print:grid-cols-12 break-inside-avoid">
              <div className="lg:col-span-7 print:col-span-7 space-y-2.5">
                <h3 className="text-sm sm:text-base font-black uppercase text-indigo-900 border-b-2 border-indigo-600 pb-1">
                  5. 14 Aktivitas yang Paling Cocok &amp; Menyenangkan Buatmu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print:grid-cols-2">
                  {hasilSaatIni.prioritas14Aktivitas.map((akt, idx) => (
                    <div
                      key={akt.no}
                      className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200 flex gap-2 items-start break-inside-avoid"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-700 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-black text-xs text-indigo-950">
                          {akt.kodeAktivitas}{" "}
                          <span className="text-[10px] font-mono text-emerald-700">
                            ({akt.klaster})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {akt.deskripsiSingkat}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 print:col-span-5 space-y-2.5">
                <h3 className="text-sm sm:text-base font-black uppercase text-emerald-900 border-b-2 border-emerald-600 pb-1">
                  6. 5 Peran Personal Branding Terbaikmu
                </h3>
                {hasilSaatIni.top5PersonalBranding.map((role, idx) => (
                  <div
                    key={role.id}
                    className="p-3 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-1 break-inside-avoid"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs sm:text-sm text-emerald-950">
                        #{idx + 1}. {role.nama} ({role.julukan})
                      </span>
                      <span className="text-[9.5px] font-black px-2 py-0.5 rounded bg-emerald-700 text-white shrink-0">
                        {role.skorKecocokan}% Cocok
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {role.deskripsi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BAGIAN 5: VISUALISASI PETA LENGKAP 114 SCM & 30 PERAN */}
            <Scm114FullVisualMap hasil={hasilSaatIni} />

            {/* BAGIAN 6: REKOMENDASI PENGEMBANGAN KARIER & MASA DEPAN */}
            <div className="p-5 rounded-3xl bg-slate-900 print:bg-slate-100 text-white print:text-slate-900 border print:border-slate-300 space-y-3 break-inside-avoid">
              <div className="text-xs font-black uppercase text-amber-400 print:text-indigo-800">
                7. Kesimpulan Rekomendasi Pengembangan Diri &amp; Karier Masa Depan
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 print:bg-white border border-slate-800 print:border-slate-300 space-y-1">
                  <div className="font-black text-emerald-400 print:text-emerald-800">
                    🎯 Peran &amp; Bidang yang Cocok:
                  </div>
                  <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                    {hasilSaatIni.rekomendasiHRBP.talentAcquisitionFit}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 print:bg-white border border-slate-800 print:border-slate-300 space-y-1">
                  <div className="font-black text-amber-400 print:text-amber-800">
                    📈 Langkah Belajar Selanjutnya:
                  </div>
                  <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                    {hasilSaatIni.rekomendasiHRBP.peopleDevelopmentPlan}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 print:bg-white border border-slate-800 print:border-slate-300 space-y-1">
                  <div className="font-black text-sky-400 print:text-sky-800">
                    🏢 Lingkungan yang Mendukungmu:
                  </div>
                  <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                    {hasilSaatIni.rekomendasiHRBP.organizationalPlacement}
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER KERAHASIAAN CETAK */}
            <div className="border-t pt-3 flex flex-wrap justify-between items-center text-[10px] font-bold text-slate-500 break-inside-avoid">
              <span>
                © {new Date().getFullYear()} Panda HibahIlmu.id — Laporan Resmi Milik Akun:{" "}
                {hasilSaatIni.namaPeserta} ({hasilSaatIni.emailPeserta})
              </span>
              <span className="text-rose-700 font-black uppercase">
                DOKUMEN RAHASIA PRIBADI (CONFIDENTIAL)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentMappingAssessmentView;