"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Filter,
  HelpCircle,
  LayoutGrid,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { PresetTutorialProject } from "./tutorialProjectsData";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";
import { TIPE_MCU_LIST } from "./codeTranspilerAndValidator";
import {
  ambilPanduanLengkapProyek,
  InfoPanduanEksekusiProyek,
} from "./codeDrivenCircuitEngine";

type FilterKategori20Proyek =
  | "Semua Kategori (20)"
  | "1. Dasar & Sensor Lokal"
  | "2. Smart Home & Keamanan IoT"
  | "3. Pertanian, Tambak & Medis"
  | "4. Multi-MCU, Energi & Master AIoT";

const DAFTAR_TAB_KATEGORI: FilterKategori20Proyek[] = [
  "Semua Kategori (20)",
  "1. Dasar & Sensor Lokal",
  "2. Smart Home & Keamanan IoT",
  "3. Pertanian, Tambak & Medis",
  "4. Multi-MCU, Energi & Master AIoT",
];

export const TutorialProjectsCatalogModal: React.FC<{
  daftarProyek: PresetTutorialProject[];
  projectAktif: PresetTutorialProject;
  namaFileAktif: string;
  nodesSaatIni: NodeKomponenKanvas[];
  onPilihProyek: (proj: PresetTutorialProject) => void;
  onSimulasiCepatSensor: (aktifkanPemicu: boolean) => void;
}> = ({
  daftarProyek,
  projectAktif,
  namaFileAktif,
  onPilihProyek,
  onSimulasiCepatSensor,
}) => {
  const [bukaModalKatalog, setBukaModalKatalog] = useState<boolean>(false);
  const [bukaPanduanCaraKerja, setBukaPanduanCaraKerja] =
    useState<boolean>(true);
  const [kategoriFilter, setKategoriFilter] = useState<FilterKategori20Proyek>(
    "Semua Kategori (20)"
  );

  const infoPanduanAktif: InfoPanduanEksekusiProyek =
    ambilPanduanLengkapProyek(projectAktif);

  const proyekTersaring = daftarProyek.filter((p) => {
    if (kategoriFilter === "Semua Kategori (20)") return true;
    return ambilPanduanLengkapProyek(p).kategoriLabel === kategoriFilter;
  });

  const indeksProyekAktif =
    daftarProyek.findIndex((p) => p.id === projectAktif.id) + 1 || 1;

  return (
    <div className="bg-gradient-to-r from-indigo-950/95 via-slate-950 to-emerald-950/95 p-4 rounded-3xl border-2 border-indigo-500/40 space-y-3 shadow-xl text-xs">
      {/* ================================================================= */}
      {/* BARIS UTAMA RINGKAS: DROPDOWN KATEGORI + DROPDOWN 20 PROYEK + POPUP */}
      {/* Menghemat 80% ruang vertikal halaman!                             */}
      {/* ================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> PROYEK #{indeksProyekAktif} /{" "}
            {daftarProyek.length}
          </span>
          <div>
            <div className="font-black text-white text-xs sm:text-sm">
              {projectAktif.judul}
            </div>
            <div className="text-[10.5px] text-emerald-300 font-mono">
              Kategori: {infoPanduanAktif.kategoriLabel} • File: {namaFileAktif}
            </div>
          </div>
        </div>

        {/* Kontrol Dropdown Cepat & Tombol Buka Popup 20 Proyek */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Dropdown Filter Kategori */}
          <select
            value={kategoriFilter}
            onChange={(e) => {
              const katBaru = e.target.value as FilterKategori20Proyek;
              setKategoriFilter(katBaru);
              const daftarCocok = daftarProyek.filter(
                (p) =>
                  katBaru === "Semua Kategori (20)" ||
                  ambilPanduanLengkapProyek(p).kategoriLabel === katBaru
              );
              if (
                daftarCocok.length > 0 &&
                !daftarCocok.some((x) => x.id === projectAktif.id)
              ) {
                onPilihProyek(daftarCocok[0]);
              }
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs cursor-pointer focus:outline-none focus:border-amber-400"
          >
            {DAFTAR_TAB_KATEGORI.map((kat) => (
              <option key={kat} value={kat} className="bg-slate-950 text-white">
                📁 {kat}
              </option>
            ))}
          </select>

          {/* 2. Dropdown Pilih Langsung Proyek */}
          <select
            value={projectAktif.id}
            onChange={(e) => {
              const target = daftarProyek.find((p) => p.id === e.target.value);
              if (target) onPilihProyek(target);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border-2 border-emerald-500/60 text-white font-extrabold text-xs max-w-[260px] sm:max-w-[340px] truncate cursor-pointer focus:outline-none focus:border-emerald-400"
          >
            {proyekTersaring.map((proj) => {
              const noUrut =
                daftarProyek.findIndex((x) => x.id === proj.id) + 1;
              return (
                <option
                  key={proj.id}
                  value={proj.id}
                  className="bg-slate-950 text-white"
                >
                  #{noUrut}. {proj.judul}
                </option>
              );
            })}
          </select>

          {/* 3. Tombol Buka Popup Katalog Visual 20 Proyek */}
          <button
            type="button"
            onClick={() => setBukaModalKatalog(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg border border-indigo-400/50"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> 📚 Katalog Popup 20 Proyek
          </button>

          {/* 4. Tombol Tampilkan/Sembunyikan Panduan Cara Kerja */}
          <button
            type="button"
            onClick={() => setBukaPanduanCaraKerja(!bukaPanduanCaraKerja)}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer border ${
              bukaPanduanCaraKerja
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-slate-900 border-slate-700 text-slate-300"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {bukaPanduanCaraKerja ? "Tutup Cara Kerja ▲" : "Cara Kerja & Uji ▼"}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PANEL PANDUAN CARA KERJA & TOMBOL UJI CEPAT 1-KLIK (NYALA / MATI) */}
      {/* ================================================================= */}
      {bukaPanduanCaraKerja && (
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="space-y-0.5">
              <div className="font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Bagaimana Proyek #{indeksProyekAktif} Ini Bekerja &amp; Cara Mengujinya:
              </div>
              <p className="text-slate-300 text-[11.5px] leading-relaxed">
                {infoPanduanAktif.caraKerjaSingkat}
              </p>
            </div>

            {/* TOMBOL TRIGGER UJI CEPAT: LANGSUNG MENGUBAH NILAI SENSOR AGAR AKTUATOR MENYALA / MATI! */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSimulasiCepatSensor(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" /> ⚡ Simulasikan Kondisi Aktif (Uji Aktuator NYALA)
              </button>
              <button
                type="button"
                onClick={() => onSimulasiCepatSensor(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 🔄 Reset Kondisi Aman (Aktuator MATI)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-black text-sky-400 uppercase">
                1. Komponen Input / Sensor:
              </div>
              <div className="font-bold text-white mt-0.5">
                {infoPanduanAktif.inputYangDiubah}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-black text-amber-400 uppercase">
                2. Syarat Koding Agar Aktif:
              </div>
              <div className="font-mono font-bold text-amber-200 mt-0.5">
                {infoPanduanAktif.kondisiPemicuAktif}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-black text-emerald-400 uppercase">
                3. Reaksi Aktuator di Kanvas:
              </div>
              <div className="font-bold text-emerald-300 mt-0.5">
                {infoPanduanAktif.responAktuator}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* POPUP MODAL KATALOG 20 PROYEK BERKELOMPOK KATEGORI                */}
      {/* Hanya muncul saat tombol "📚 Katalog Popup 20 Proyek" diklik!     */}
      {/* ================================================================= */}
      {bukaModalKatalog && (
        <div
          onClick={() => setBukaModalKatalog(false)}
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border-2 border-indigo-400 rounded-3xl max-w-5xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header Modal Popup */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  📚 KATALOG LENGKAP 20 TUTORIAL &amp; PROYEK SIAP PAKAI
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  Pilih Proyek Berdasarkan Kategori (Otomatis Memuat Rangkaian, Koding &amp; Panduan Cara Kerja)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBukaModalKatalog(false)}
                className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Baris Filter Kategori di dalam Popup */}
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              {DAFTAR_TAB_KATEGORI.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategoriFilter(kat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition border ${
                    kategoriFilter === kat
                      ? "bg-amber-400 text-slate-950 border-white font-black"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Daftar Kartu Proyek di dalam Popup */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {proyekTersaring.map((proj) => {
                const dipilih = projectAktif.id === proj.id;
                const noUrut =
                  daftarProyek.findIndex((x) => x.id === proj.id) + 1;
                const jmlMcu = proj.nodes.filter((n) =>
                  TIPE_MCU_LIST.includes(n.tipe)
                ).length;
                const info = ambilPanduanLengkapProyek(proj);

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onPilihProyek(proj);
                      setBukaModalKatalog(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                      dipilih
                        ? "bg-indigo-950/80 border-amber-400 shadow-lg"
                        : "bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-emerald-400"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9.5px]">
                          PROYEK #{noUrut}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[9.5px]">
                          {jmlMcu} Tab MCU
                        </span>
                      </div>
                      <div className="font-extrabold text-white text-xs leading-snug">
                        {proj.judul}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {info.caraKerjaSingkat}
                      </p>
                      <div className="text-[10px] font-mono text-sky-300 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                        🎯 Syarat Aktif: {info.kondisiPemicuAktif}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 text-[10.5px]">
                      <span className="text-emerald-400 font-black flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {dipilih
                          ? "✓ Sedang Aktif di Kanvas"
                          : "Pilih & Muat Proyek Ini"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};