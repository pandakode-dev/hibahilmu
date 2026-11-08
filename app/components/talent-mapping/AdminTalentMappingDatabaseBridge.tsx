"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Medal,
  FileText,
  Download,
  Upload,
  Trash2,
  Search,
  RefreshCw,
  Users,
  Eye,
  X,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { MultiJenjangCertificateAndReport } from "./CertificateAndReportComponents";
import { Scm114FullVisualMap } from "./Scm114FullVisualMap";

export const AdminTalentMappingDatabaseBridge: React.FC<{
  userAktif?: any;
  onSyncDaftarAkunServer?: (daftarAkunLengkap: any[]) => void;
}> = ({ userAktif, onSyncDaftarAkunServer }) => {
  const [daftarHasilTes, setDaftarHasilTes] = useState<any[]>([]);
  const [daftarAkunCloud, setDaftarAkunCloud] = useState<any[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState<boolean>(false);
  const [kataKunci, setKataKunci] = useState<string>("");
  const [filterJenjang, setFilterJenjang] = useState<string>("semua");
  const [itemTerpilihModal, setItemTerpilihModal] = useState<any | null>(null);
  const [modePrintModal, setModePrintModal] = useState<
    "semua" | "sertifikat_saja" | "laporan_saja"
  >("semua");

  const tarikSemuaDataPusat = async () => {
    setSedangMemuat(true);
    try {
      // 1. Jika ada user yang sedang login (misal lewat Google SSO), pastikan tercatat di /api/auth
      if (userAktif && userAktif.email) {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync_user",
            id: userAktif.id,
            nama: userAktif.nama || userAktif.name,
            email: userAktif.email,
            role: userAktif.role || "siswa",
            instansi: userAktif.instansi || "Google SSO / Web",
          }),
        });
      }

      // 2. Tarik seluruh akun terdaftar (termasuk Google SSO) dari /api/auth
      const resAuth = await fetch(`/api/auth?t=${Date.now()}`, {
        cache: "no-store",
      });
      const jsonAuth = await resAuth.json();
      if (jsonAuth.ok && Array.isArray(jsonAuth.users)) {
        setDaftarAkunCloud(jsonAuth.users);
        if (onSyncDaftarAkunServer) {
          onSyncDaftarAkunServer(jsonAuth.users);
        }
      }

      // 3. Tarik seluruh hasil tes Talent Mapping dari /api/talent-mapping
      const resTm = await fetch(
        `/api/talent-mapping?mode=all&role=admin&t=${Date.now()}`,
        { cache: "no-store" }
      );
      const jsonTm = await resTm.json();
      let gabunganTm: any[] = [];
      if (jsonTm.ok && Array.isArray(jsonTm.results)) {
        gabunganTm = jsonTm.results;
      }

      // Gabungkan juga dengan cadangan localStorage di browser ini bila ada yang belum terkirim
      try {
        const rawLokal =
          localStorage.getItem("hibahilmu_talent_mapping_master_v6") ||
          localStorage.getItem("hibahilmu_talent_mapping_results_v5");
        if (rawLokal) {
          const parsedLokal = JSON.parse(rawLokal);
          if (Array.isArray(parsedLokal)) {
            const mapUnik = new Map<string, any>();
            [...gabunganTm, ...parsedLokal].forEach((it) => {
              if (it && it.idHasil && !mapUnik.has(it.idHasil)) {
                mapUnik.set(it.idHasil, it);
              }
            });
            gabunganTm = Array.from(mapUnik.values());
          }
        }
      } catch {}

      setDaftarHasilTes(gabunganTm);
    } catch {}
    setSedangMemuat(false);
  };

  useEffect(() => {
    tarikSemuaDataPusat();
  }, [userAktif?.email]);

  const hasilTerfilter = daftarHasilTes.filter((r) => {
    const cocokJenjang =
      filterJenjang === "semua" ||
      (r.tipeJenjang || "dewasa_284") === filterJenjang;
    const kw = kataKunci.trim().toLowerCase();
    const cocokKata =
      !kw ||
      (r.namaPeserta || "").toLowerCase().includes(kw) ||
      (r.emailPeserta || "").toLowerCase().includes(kw) ||
      (r.instansiPeserta || "").toLowerCase().includes(kw);
    return cocokJenjang && cocokKata;
  });

  const unduhCsvHasilTalent = () => {
    const header =
      "ID Hasil,Tanggal Tes,Nama Peserta,Email Akun,Instansi,Kategori Jenjang,Kekuatan #1,Kekuatan #2,Kekuatan #3,Personal Branding\n";
    const rows = daftarHasilTes
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
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rekap_Hasil_TalentMapping_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-6 space-y-6">
      {/* PANEL UTAMA DI DASHBOARD SUPER ADMIN */}
      <div className="print:hidden bg-slate-900 text-white p-6 rounded-3xl border-2 border-amber-400 shadow-2xl space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                🔥 MENU PUSAT HASIL TALENT MAPPING &amp; AKUN SSO GOOGLE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                {daftarAkunCloud.length} Akun Terdaftar • {daftarHasilTes.length} Hasil Tes Tersimpan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 mt-1.5">
              Database Pusat Sertifikat &amp; Laporan Talent Mapping (Semua Peserta)
            </h2>
            <p className="text-xs text-slate-300">
              Semua peserta yang login dengan Google SSO maupun manual beserta hasil tes Anak (TK/SD), SMP, SMA, dan Dewasa otomatis terekam di sini.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={tarikSemuaDataPusat}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${sedangMemuat ? "animate-spin" : ""}`}
              />
              Segarkan Data Cloud
            </button>
            <button
              type="button"
              onClick={unduhCsvHasilTalent}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh Excel Hasil Tes (.CSV)
            </button>
          </div>
        </div>

        {/* BARIS DAFTAR AKUN GOOGLE SSO & PENGGUNA TERBARU DI DATABASE CLOUD */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Daftar Akun di Database Cloud (Termasuk Login Google SSO — {daftarAkunCloud.length} Akun):
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {daftarAkunCloud.map((u, idx) => (
              <div
                key={u.id || idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs flex items-center gap-2"
              >
                <span className="font-black text-white">{u.nama}</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  ({u.email})
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FILTER PENCARIAN HASIL TES TALENT MAPPING */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama peserta tes, email, atau sekolah/instansi..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white"
            />
          </div>
          <div className="md:col-span-5 flex flex-wrap gap-1.5">
            {[
              { id: "semua", l: "Semua" },
              { id: "anak_tk_sd", l: "👶 Anak" },
              { id: "smp", l: "🧭 SMP" },
              { id: "sma", l: "🎓 SMA" },
              { id: "dewasa_284", l: "💼 Dewasa" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterJenjang(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  filterJenjang === f.id
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-950 text-slate-300 border border-slate-800"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* DAFTAR KARTU HASIL TES PESERTA */}
        {hasilTerfilter.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <div className="text-sm font-black text-amber-300">
              Belum Ada Hasil Tes di Filter Ini
            </div>
            <p className="text-xs text-slate-400">
              Silakan lakukan tes pada menu <strong>🔥 Tes Talent Mapping</strong>, maka sertifikat dan laporan lengkap peserta akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
            {hasilTerfilter.map((item) => (
              <div
                key={item.idHasil}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-black text-sm text-emerald-400">
                      {item.namaPeserta}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-600/30 border border-rose-500 text-rose-200 font-black text-[9.5px] uppercase">
                      {item.tipeJenjang || "dewasa_284"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {item.emailPeserta} • {item.instansiPeserta}
                  </div>
                  <div className="text-[11px] text-amber-300 font-bold">
                    🏅 Bakat #1: {item.bakatUtama1_7?.[0]?.nama || "-"} (
                    {item.top5PersonalBranding?.[0]?.nama || "-"})
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {item.tanggalTes} • {item.nomorDokumenRahasia}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setItemTerpilihModal(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat Sertifikat &amp; Laporan
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const sisa = daftarHasilTes.filter(
                        (x) => x.idHasil !== item.idHasil
                      );
                      setDaftarHasilTes(sisa);
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PRATINJAU & CETAK SERTIFIKAT / LAPORAN PESERTA YANG DIPILIH ADMIN */}
      {itemTerpilihModal && (
        <div className="bg-slate-900/95 p-4 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl space-y-6">
          <div className="print:hidden flex flex-wrap justify-between items-center gap-3 border-b border-slate-700 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                MODE PRATINJAU &amp; CETAK DOKUMEN PESERTA (SUPER ADMIN)
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Dokumen Milik: {itemTerpilihModal.namaPeserta} (
                {itemTerpilihModal.emailPeserta})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setItemTerpilihModal(null)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Tutup Pratinjau
            </button>
          </div>

          {itemTerpilihModal.daftarUrutMultiJenjang ? (
            <MultiJenjangCertificateAndReport
              modeJenjang={itemTerpilihModal.tipeJenjang || "anak_tk_sd"}
              namaPeserta={itemTerpilihModal.namaPeserta}
              instansiPeserta={itemTerpilihModal.instansiPeserta}
              emailPeserta={itemTerpilihModal.emailPeserta}
              judulLaporan={
                itemTerpilihModal.judulLaporanMultiJenjang ||
                "Laporan Komprehensif Pemetaan Bakat"
              }
              subjudulJenjang={
                itemTerpilihModal.subjudulJenjangMultiJenjang ||
                itemTerpilihModal.instansiPeserta
              }
              daftarUrut={itemTerpilihModal.daftarUrutMultiJenjang}
              galeriKaryaKanvas={itemTerpilihModal.galeriKaryaKanvas || {}}
              statusCloud="Tersimpan di Database Pusat Cloud ✓"
              onSimpanCloud={() => {}}
            />
          ) : (
            <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl space-y-6">
              <div className="print:hidden flex flex-wrap gap-2 pb-4 border-b">
                <button
                  type="button"
                  onClick={() => {
                    setModePrintModal("sertifikat_saja");
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => setModePrintModal("semua"), 500);
                    }, 180);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Medal className="w-4 h-4" /> 1. Print Sertifikat (A4 Landscape)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModePrintModal("laporan_saja");
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => setModePrintModal("semua"), 500);
                    }, 180);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> 2. Print Laporan Lengkap (A4 Portrait)
                </button>
              </div>

              {modePrintModal !== "laporan_saja" && (
                <div className="p-6 rounded-3xl border-4 border-double border-amber-500 bg-amber-50/40 space-y-4">
                  <div className="flex justify-between items-center border-b border-amber-300 pb-3">
                    <div>
                      <div className="text-[10px] font-black uppercase text-amber-800">
                        OFFICIAL TALENT CERTIFICATE • PANDA HIBAHILMU
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        SERTIFIKAT KOMPETENSI &amp; PEMETAAN BAKAT
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                      TERVERIFIKASI
                    </span>
                  </div>
                  <div className="text-center py-2">
                    <div className="text-xs text-slate-500 font-bold">
                      Diberikan kepada:
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                      {itemTerpilihModal.namaPeserta}
                    </div>
                    <div className="text-xs font-bold text-rose-700 mt-1">
                      Personal Branding Utama:{" "}
                      {itemTerpilihModal.top5PersonalBranding?.[0]?.nama} (
                      {itemTerpilihModal.top5PersonalBranding?.[0]?.julukan})
                    </div>
                  </div>
                </div>
              )}

              {modePrintModal !== "sertifikat_saja" &&
                itemTerpilihModal.urutan34Bakat && (
                  <Scm114FullVisualMap hasil={itemTerpilihModal} />
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};