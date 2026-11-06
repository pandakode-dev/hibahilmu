"use client";

import React from "react";
import {
  HasilLengkapTalentMapping,
  ScmActivityEvaluation,
} from "./talentMappingEngine";
import { DAFTAR_30_PERSONAL_BRANDING } from "./talentMappingDatabase";

function kelasWarnaPetak(
  warna: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam"
): string {
  switch (warna) {
    case "Merah":
      return "bg-rose-600 text-white border-rose-800";
    case "Kuning":
      return "bg-amber-400 text-slate-950 border-amber-600";
    case "Putih":
      return "bg-white text-slate-900 border-slate-400";
    case "Abu":
      return "bg-slate-400 text-white border-slate-600";
    case "Hitam":
      return "bg-slate-900 text-white border-slate-950";
  }
}

export const Scm114FullVisualMap: React.FC<{
  hasil: HasilLengkapTalentMapping;
}> = ({ hasil }) => {
  const top5Ids = new Set(hasil.top5PersonalBranding.map((r) => r.id));

  // Kelompokkan 114 Aktivitas berdasarkan 8 Klaster SCM (N, H, S, Gi, Te, E, R, T)
  const klasterMeta: {
    kode: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
    nama: string;
    warnaBadge: string;
    warnaBorder: string;
    ikon: string;
  }[] = [
    {
      kode: "N",
      nama: "Networking (Jejaring & Edukasi)",
      warnaBadge: "bg-sky-600 text-white",
      warnaBorder: "border-sky-500",
      ikon: "🤝",
    },
    {
      kode: "H",
      nama: "Headman (Kepemimpinan & Negosiasi)",
      warnaBadge: "bg-blue-800 text-white",
      warnaBorder: "border-blue-700",
      ikon: "👑",
    },
    {
      kode: "S",
      nama: "Serving (Pelayanan & Empati)",
      warnaBadge: "bg-indigo-700 text-white",
      warnaBorder: "border-indigo-600",
      ikon: "🤲",
    },
    {
      kode: "Gi",
      nama: "Generating Idea (Inovasi, Kreasi & Strategi)",
      warnaBadge: "bg-purple-700 text-white",
      warnaBorder: "border-purple-600",
      ikon: "💡",
    },
    {
      kode: "Te",
      nama: "Technical (Teknis, Operasional & Produksi)",
      warnaBadge: "bg-rose-700 text-white",
      warnaBorder: "border-rose-600",
      ikon: "⚙️",
    },
    {
      kode: "E",
      nama: "Elementary (Tata Kelola, Bahasa & Administrasi)",
      warnaBadge: "bg-orange-600 text-white",
      warnaBorder: "border-orange-500",
      ikon: "📝",
    },
    {
      kode: "R",
      nama: "Reasoning (Riset, Diagnosa & Penalaran)",
      warnaBadge: "bg-amber-500 text-slate-950",
      warnaBorder: "border-amber-500",
      ikon: "🔍",
    },
    {
      kode: "T",
      nama: "Thinking (Analisis, Keuangan & Evaluasi)",
      warnaBadge: "bg-emerald-600 text-white",
      warnaBorder: "border-emerald-500",
      ikon: "📊",
    },
  ];

  // Bagi 114 aktivitas menjadi 4 sisi bingkai persegi SCM (Atas: 29, Kanan: 28, Bawah: 29, Kiri: 28)
  const sisiAtas = hasil.petaLengkap114SCM.filter((x) =>
    ["H", "S"].includes(x.klaster)
  );
  const sisiKanan = hasil.petaLengkap114SCM.filter((x) =>
    ["Gi"].includes(x.klaster)
  );
  const sisiBawah = hasil.petaLengkap114SCM.filter((x) =>
    ["E", "Te"].includes(x.klaster)
  );
  const sisiKiri = hasil.petaLengkap114SCM.filter((x) =>
    ["N", "T", "R"].includes(x.klaster)
  );

  return (
    <div className="space-y-10">
      {/* =================================================================== */}
      {/* 1. DIAGRAM CABANG 4 DOMAIN BAKAT & FRAMEWORK T-A-S-K GALLUP         */}
      {/* =================================================================== */}
      <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Visual Mind-Map 4 Domain &amp; Strength-Based Framework
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Peta Cabang 34 Bakat &amp; 4 Elemen Kinerja Unggul (T-A-S-K)
            </h3>
          </div>

          {/* Legenda 5 Warna Kekuatan */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white">
              ● Merah: Sangat Kuat (1–7)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              ● Kuning: Kuat (8–14)
            </span>
            <span className="px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-400">
              ○ Putih: Netral (15–21)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-400 text-white">
              ● Abu: Rendah (22–27)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-white">
              ● Hitam: Lemah (28–34)
            </span>
          </div>
        </div>

        {/* 4 Elemen T-A-S-K sesuai Halaman 4 PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              huruf: "T",
              judul: "Talents (Bakat Alami)",
              warna: "bg-rose-600",
              ket: "Pola pikir, perasaan, dan perilaku yang telah terbentuk alami, konsisten, dan dapat digunakan untuk produktivitas.",
            },
            {
              huruf: "A",
              judul: "Attitude (Sikap Kerja)",
              warna: "bg-amber-500",
              ket: "Ekspresi atau respons suka atau tidak suka terhadap sesuatu (orang, benda, tempat, aktivitas, dan sebagainya).",
            },
            {
              huruf: "S",
              judul: "Skill (Keterampilan)",
              warna: "bg-emerald-600",
              ket: "Kemampuan teknis maupun praktis untuk melakukan sesuatu atau serangkaian cara bertindak dengan benar.",
            },
            {
              huruf: "K",
              judul: "Knowledge (Pengetahuan)",
              warna: "bg-indigo-600",
              ket: "Serangkaian informasi tentang sesuatu: deskripsi, data, teori, konsep, prosedur, dan prinsip terkait bidang karier.",
            },
          ].map((el) => (
            <div
              key={el.huruf}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs"
            >
              <div
                className={`w-10 h-10 rounded-2xl ${el.warna} text-white font-black text-lg flex items-center justify-center shrink-0 shadow`}
              >
                {el.huruf}
              </div>
              <div>
                <div className="font-black text-xs text-slate-900">
                  {el.judul}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                  {el.ket}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MATRIKS LENGKAP 30 STRENGTH TYPOLOGY (PERSONAL BRANDING PERAN)   */}
      {/* =================================================================== */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 space-y-4">
        <div className="border-b pb-2 flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900">
              Peta 30 Strength Typology (Personal Branding &amp; Kesimpulan Peran)
            </h3>
            <p className="text-xs text-slate-600">
              114 Aktivitas SCM dikelompokkan menjadi 30 Strength Typology. Kotak
              berwarna <strong>Merah Menyala</strong> menunjukkan 5 Peran Personal
              Branding Paling Potensial bagi <strong>{hasil.namaPeserta}</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "HEADMAN",
            "NETWORKING",
            "SERVICING",
            "GENERATING IDEA",
            "THINKING",
            "ELEMENTARY",
            "TECHNICAL",
          ].map((kat) => {
            const listPeran = DAFTAR_30_PERSONAL_BRANDING.filter(
              (r) => r.kategori === kat
            );
            return (
              <div
                key={kat}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300">
                  Cluster Role: {kat}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {listPeran.map((r) => {
                    const isTop5 = top5Ids.has(r.id);
                    return (
                      <span
                        key={r.id}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition ${
                          isTop5
                            ? "bg-rose-600 text-white border-amber-300 shadow-md scale-105"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {isTop5 ? `★ ${r.nama}` : r.nama}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. PETA LENGKAP POTENSI KEKUATAN 114 AKTIVITAS (STRENGTH CLUSTER MAP) */}
      {/* =================================================================== */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/40 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1 max-w-3xl">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
              Halaman Peta Lengkap • 114 Strength Cluster Map (SCM)
            </span>
            <h3 className="text-xl font-black text-white">
              Peta Lengkap Potensi Kekuatan (PSP vs PSS) — {hasil.namaPeserta}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap aktivitas memiliki 2 kotak indikator:{" "}
              <strong className="text-amber-300">
                Kotak Dalam [PSP / Personal Strength Potential]
              </strong>{" "}
              (dihitung dari komposisi 34 bakat Sesi 1) dan{" "}
              <strong className="text-sky-300">
                Kotak Luar [PSS / Personal Strength Statement]
              </strong>{" "}
              (dihitung dari pernyataan minat Sesi 2). Urutan warna dari terkuat ke
              terlemah: <strong>Merah ➔ Kuning ➔ Putih ➔ Abu-abu ➔ Hitam</strong>.
            </p>
          </div>

          {/* Inti Lingkaran 8 Wilayah Klaster SCM (N, H, S, Gi, Te, E, R, T) */}
          <div className="flex flex-wrap gap-1.5">
            {klasterMeta.map((km) => (
              <span
                key={km.kode}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${km.warnaBadge}`}
              >
                {km.ikon} {km.kode}: {km.nama.split(" (")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* VISUALISASI BINGKAI PERSEGI MELINGKAR SCM (SEPERTI HALAMAN 9 PDF) */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-4">
          <div className="text-center text-xs font-black text-amber-300 uppercase tracking-wider">
            Diagram Cincin 8 Wilayah Strength Cluster Map (N • H • S • Gi • Te • E • R • T)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {klasterMeta.map((km) => {
              const itemKlaster = hasil.petaLengkap114SCM.filter(
                (a) => a.klaster === km.kode
              );
              const jmlMerahKuning = itemKlaster.filter(
                (a) => a.warnaPSP === "Merah" || a.warnaPSP === "Kuning"
              ).length;
              return (
                <div
                  key={km.kode}
                  className={`p-3 rounded-2xl bg-slate-900 border-2 ${km.warnaBorder} flex flex-col items-center text-center gap-1`}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${km.warnaBadge} font-black text-sm flex items-center justify-center shadow-lg`}
                  >
                    {km.kode}
                  </div>
                  <div className="font-black text-[11px] text-white leading-tight mt-1">
                    {km.nama.split(" (")[0]}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {jmlMerahKuning}/{itemKlaster.length} Potensi Kuat
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAIL LENGKAP 114 AKTIVITAS PER KLASTER DENGAN KOTAK GANDA [PSP | PSS] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {klasterMeta.map((km) => {
            const listAkt = hasil.petaLengkap114SCM.filter(
              (a) => a.klaster === km.kode
            );
            return (
              <div
                key={km.kode}
                className={`rounded-2xl bg-slate-950 border ${km.warnaBorder} overflow-hidden flex flex-col`}
              >
                <div
                  className={`${km.warnaBadge} px-3.5 py-2 text-xs font-black flex justify-between items-center`}
                >
                  <span>
                    {km.ikon} [{km.kode}] {km.nama.split(" (")[0]}
                  </span>
                  <span className="text-[10px] opacity-90">
                    PSP | PSS
                  </span>
                </div>

                <div className="p-2.5 space-y-1.5 flex-1">
                  {listAkt.map((akt: ScmActivityEvaluation) => (
                    <div
                      key={akt.no}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-2 text-[11px]"
                    >
                      <div className="truncate">
                        <span className="font-mono text-[9px] text-slate-400 mr-1">
                          #{akt.no}
                        </span>
                        <span className="font-bold text-slate-100">
                          {akt.kodeAktivitas}
                        </span>
                      </div>

                      {/* Petak Ganda: [PSP (Dalam)] & [PSS (Luar)] */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          title={`PSP (Potensi Bakat): ${akt.skorPSP} (${akt.warnaPSP})`}
                          className={`w-6 h-5 rounded text-[9px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                            akt.warnaPSP
                          )}`}
                        >
                          P
                        </span>
                        <span
                          title={`PSS (Minat Sesi 2): ${akt.skorPSS} (${akt.warnaPSS})`}
                          className={`w-6 h-5 rounded text-[9px] font-black border flex items-center justify-center ${kelasWarnaPetak(
                            akt.warnaPSS
                          )}`}
                        >
                          S
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};