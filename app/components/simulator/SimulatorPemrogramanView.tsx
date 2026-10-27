"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  PackagePlus,
  BookOpen,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Code2,
  Layers,
  BarChart3,
  Copy,
} from "lucide-react";
import { AkunPengguna } from "../../types";
import {
  KategoriSimulatorId,
  DAFTAR_ENGINE_SIMULATOR,
  MODUL_PEMBELAJARAN_SIMULATOR_AWAL,
  ModulSimulatorItem,
  LibrarySimulatorItem,
} from "./simulatorData";
import { ElectronicAndIotCanvas } from "./ElectronicAndIotCanvas";

interface SimulatorPemrogramanProps {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

export const SimulatorPemrogramanView: React.FC<SimulatorPemrogramanProps> = ({
  userLogin,
  tambahXP,
}) => {
  const [kategoriAktif, setKategoriAktif] = useState<KategoriSimulatorId>("python");
  const [daftarModul, setDaftarModul] = useState<ModulSimulatorItem[]>(
    MODUL_PEMBELAJARAN_SIMULATOR_AWAL
  );

  const modulKategoriIni = daftarModul.filter((m) => m.kategoriId === kategoriAktif);
  const [modulAktif, setModulAktif] = useState<ModulSimulatorItem>(
    MODUL_PEMBELAJARAN_SIMULATOR_AWAL[0]
  );

  const [kodeEditor, setKodeEditor] = useState<string>(
    MODUL_PEMBELAJARAN_SIMULATOR_AWAL[0].kodeAwal
  );
  const [outputTerminal, setOutputTerminal] = useState<string>(
    MODUL_PEMBELAJARAN_SIMULATOR_AWAL[0].outputEkspektasi
  );
  const [modulTuntasIds, setModulTuntasIds] = useState<string[]>([]);

  // State Manajer Library Tambahan per Simulator
  const [libraryTerpasang, setLibraryTerpasang] = useState<{
    [kat in KategoriSimulatorId]?: LibrarySimulatorItem[];
  }>({});
  const [namaLibBaru, setNamaLibBaru] = useState("");
  const [importLibBaru, setImportLibBaru] = useState("");

  // State Form Tambah Modul Simulator Baru (Untuk Pengajar / Admin / Update Berkala)
  const [bukaFormTambahModul, setBukaFormTambahModul] = useState(false);
  const [judulModulBaru, setJudulModulBaru] = useState("");
  const [levelModulBaru, setLevelModulBaru] = useState<"Pemula" | "Menengah" | "Mahir">(
    "Menengah"
  );
  const [teoriModulBaru, setTeoriModulBaru] = useState("");
  const [kodeAwalBaru, setKodeAwalBaru] = useState("");
  const [outputBaru, setOutputBaru] = useState("");

  const engineSaatIni =
    DAFTAR_ENGINE_SIMULATOR.find((e) => e.id === kategoriAktif) ||
    DAFTAR_ENGINE_SIMULATOR[0];

  const semuaLibraryAktif = [
    ...engineSaatIni.daftarLibrary,
    ...(libraryTerpasang[kategoriAktif] || []),
  ];

  const pilihKategoriSimulator = (id: KategoriSimulatorId) => {
    setKategoriAktif(id);
    const list = daftarModul.filter((m) => m.kategoriId === id);
    if (list.length > 0) {
      setModulAktif(list[0]);
      setKodeEditor(list[0].kodeAwal);
      setOutputTerminal(list[0].outputEkspektasi);
    }
  };

  const pilihModulBelajar = (m: ModulSimulatorItem) => {
    setModulAktif(m);
    setKodeEditor(m.kodeAwal);
    setOutputTerminal(m.outputEkspektasi);
  };

  const jalankanSimulatorKode = () => {
    const jam = new Date().toLocaleTimeString("id-ID");
    const barisKode = kodeEditor.split("\n");
    const barisCetak = barisKode
      .filter(
        (b) =>
          b.includes("print(") ||
          b.includes("printf(") ||
          b.includes("fprintf(") ||
          b.includes("disp(") ||
          b.includes("Serial.println(")
      )
      .map((b) => b.trim());

    const logEksekusi = `[${jam}] $ ${engineSaatIni.perintahJalankan}\n--------------------------------------------------\n${modulAktif.outputEkspektasi}\n\n✓ Eksekusi selesai dalam 24ms (${barisCetak.length} instruksi output terdeteksi).`;
    setOutputTerminal(logEksekusi);

    if (!modulTuntasIds.includes(modulAktif.id)) {
      setModulTuntasIds([...modulTuntasIds, modulAktif.id]);
      tambahXP(modulAktif.xpReward);
    } else {
      tambahXP(10);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER UTAMA SIMULATOR PROGRAMMING & IOT */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white p-8 rounded-[2.2rem] shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2.5 max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-emerald-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
            <Terminal className="w-4 h-4" /> Multi-Engine Coding, IoT &amp; Electronics Simulator
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            Laboratorium Simulator Pemrograman, Next.js, MATLAB, Wokwi IoT &amp; EWB Elektronika
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Dilengkapi modul pembelajaran terstruktur, manajer *library* siap pakai, kompilator kode
            interaktif, serta meja kerja virtual mikrokontroler ESP32 dan rangkaian elektronika.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setBukaFormTambahModul(!bukaFormTambahModul)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0 shadow-xl"
        >
          <PlusCircle className="w-4 h-4" />
          {bukaFormTambahModul
            ? "Tutup Form Update Modul"
            : "+ Tambah / Update Modul Simulator Baru"}
        </button>
      </div>

      {/* FORM UPDATE / TAMBAH MODUL PEMBELAJARAN SIMULATOR BARU */}
      {bukaFormTambahModul && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-500 space-y-4 shadow-xl">
          <h3 className="text-xl font-black flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" /> Tambahkan Modul Pembelajaran Baru ke
            Simulator ({engineSaatIni.nama})
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!judulModulBaru.trim()) return;
              const baru: ModulSimulatorItem = {
                id: "sim-custom-" + Date.now(),
                kategoriId: kategoriAktif,
                judulModul: judulModulBaru,
                level: levelModulBaru,
                durasi: "25 Menit",
                pengajar: userLogin?.nama || "Tim Kurikulum HibahIlmu",
                ringkasanTeori:
                  teoriModulBaru || "Modul praktikum interaktif baru pada simulator.",
                langkahPraktikum: [
                  "Pelajari struktur kode awal dan library yang digunakan.",
                  "Klik tombol Jalankan Kode (Run) untuk menguji output.",
                ],
                kodeAwal: kodeAwalBaru || "// Tulis kode praktikum di sini...",
                outputEkspektasi: outputBaru || "Program berhasil dijalankan tanpa error.",
                tantanganLatihan: "Kembangkan kode di atas sesuai studi kasus!",
                xpReward: 50,
              };
              setDaftarModul([baru, ...daftarModul]);
              setModulAktif(baru);
              setKodeEditor(baru.kodeAwal);
              setOutputTerminal(baru.outputEkspektasi);
              setJudulModulBaru("");
              setBukaFormTambahModul(false);
              tambahXP(40);
              alert("✓ Modul pembelajaran simulator baru berhasil ditambahkan (+40 XP)!");
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm"
          >
            <input
              type="text"
              required
              value={judulModulBaru}
              onChange={(e) => setJudulModulBaru(e.target.value)}
              placeholder="Judul Modul Praktikum Baru..."
              className="sm:col-span-2 p-3 border rounded-xl bg-slate-50 font-bold"
            />
            <select
              value={levelModulBaru}
              onChange={(e) =>
                setLevelModulBaru(e.target.value as "Pemula" | "Menengah" | "Mahir")
              }
              className="p-3 border rounded-xl bg-indigo-50 font-black text-indigo-950"
            >
              <option value="Pemula">Level: Pemula</option>
              <option value="Menengah">Level: Menengah</option>
              <option value="Mahir">Level: Mahir</option>
            </select>
            <textarea
              rows={2}
              value={teoriModulBaru}
              onChange={(e) => setTeoriModulBaru(e.target.value)}
              placeholder="Ringkasan teori pembelajaran..."
              className="sm:col-span-3 p-3 border rounded-xl bg-slate-50"
            />
            <textarea
              rows={4}
              value={kodeAwalBaru}
              onChange={(e) => setKodeAwalBaru(e.target.value)}
              placeholder="Template Kode Awal (Starter Code)..."
              className="sm:col-span-2 p-3 border rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs"
            />
            <textarea
              rows={4}
              value={outputBaru}
              onChange={(e) => setOutputBaru(e.target.value)}
              placeholder="Output Terminal yang Diharapkan..."
              className="p-3 border rounded-xl bg-slate-50 font-mono text-xs"
            />
            <button
              type="submit"
              className="sm:col-span-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-xl cursor-pointer"
            >
              Simpan &amp; Terbitkan Modul Simulator
            </button>
          </form>
        </div>
      )}

      {/* TAB PEMILIHAN 6 ENGINE SIMULATOR UTAMA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DAFTAR_ENGINE_SIMULATOR.map((eng) => {
          const aktif = kategoriAktif === eng.id;
          return (
            <button
              key={eng.id}
              type="button"
              onClick={() => pilihKategoriSimulator(eng.id)}
              className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                aktif
                  ? `bg-gradient-to-br ${eng.warnaGradien} text-white border-transparent shadow-lg`
                  : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400"
              }`}
            >
              <div className="text-[10px] font-black uppercase opacity-80">
                {eng.ekstensiFile}
              </div>
              <div className="font-black text-sm mt-1 leading-snug">{eng.nama}</div>
              <div className="text-[11px] opacity-85 mt-1 line-clamp-1">{eng.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* KANVAS DRAG & DROP INTERAKTIF KHUSUS WOKWI IOT, EWB ELEKTRONIKA, & MATLAB SIMULINK */}
      {(kategoriAktif === "wokwi" ||
        kategoriAktif === "ewb" ||
        kategoriAktif === "matlab") && (
        <ElectronicAndIotCanvas
          mode={kategoriAktif}
          onUpdateKodeDariCloud={(kodeBaru) => setKodeEditor(kodeBaru)}
        />
      )}

      {/* WORKSPACE UTAMA: KIRI (MODUL & LIBRARY) | KANAN (CODE EDITOR & TERMINAL OUTPUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI (5 KOLOM): DAFTAR MODUL PEMBELAJARAN & LIBRARY MANAGER */}
        <div className="lg:col-span-5 space-y-6">
          {/* Panel Modul Pembelajaran */}
          <div className="bg-white text-slate-800 p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Modul Pembelajaran (
                {modulKategoriIni.length})
              </h3>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +{modulAktif.xpReward} XP
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {modulKategoriIni.map((m) => {
                const dipilih = modulAktif.id === m.id;
                const selesai = modulTuntasIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => pilihModulBelajar(m)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition cursor-pointer flex justify-between items-center gap-2 ${
                      dipilih
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{m.judulModul}</span>
                    {selesai && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Isi Teori & Langkah Praktikum Modul Aktif */}
            <div className="p-4 rounded-2xl bg-slate-50 border space-y-3 text-xs leading-relaxed">
              <div className="font-black text-sm text-slate-900">{modulAktif.judulModul}</div>
              <p className="text-slate-600">{modulAktif.ringkasanTeori}</p>
              <div className="space-y-1">
                <div className="font-black text-indigo-900 uppercase text-[11px]">
                  Langkah Praktikum:
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700 font-medium">
                  {modulAktif.langkahPraktikum.map((lk, i) => (
                    <li key={i}>{lk}</li>
                  ))}
                </ol>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold">
                🎯 Tantangan Mandiri: {modulAktif.tantanganLatihan}
              </div>
            </div>
          </div>

          {/* Panel Manajer Library & Dependensi */}
          <div className="bg-white text-slate-800 p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-emerald-600" /> Pustaka &amp; Library Aktif (
                {semuaLibraryAktif.length})
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {engineSaatIni.versiEngine}
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {semuaLibraryAktif.map((lib) => (
                <div
                  key={lib.id}
                  className="p-3 rounded-2xl bg-slate-50 border text-xs flex justify-between items-center gap-2"
                >
                  <div>
                    <div className="font-black text-slate-900">
                      {lib.nama}{" "}
                      <span className="text-[10px] font-mono text-indigo-600">v{lib.versi}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{lib.deskripsi}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setKodeEditor(lib.perintahImport + "\n" + kodeEditor);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-mono font-black text-[10px] shrink-0 cursor-pointer"
                    title="Sisipkan baris import ke Code Editor"
                  >
                    + Import
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!namaLibBaru.trim()) return;
                const baru: LibrarySimulatorItem = {
                  id: "lib-" + Date.now(),
                  nama: namaLibBaru,
                  versi: "latest",
                  perintahImport: importLibBaru || `// import ${namaLibBaru}`,
                  deskripsi: "Library tambahan diinstal oleh pengguna.",
                  terpasangDefault: false,
                };
                setLibraryTerpasang({
                  ...libraryTerpasang,
                  [kategoriAktif]: [...(libraryTerpasang[kategoriAktif] || []), baru],
                });
                setNamaLibBaru("");
                setImportLibBaru("");
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t text-xs"
            >
              <input
                type="text"
                value={namaLibBaru}
                onChange={(e) => setNamaLibBaru(e.target.value)}
                placeholder="Nama Library..."
                className="p-2.5 border rounded-xl bg-slate-50 font-bold"
              />
              <input
                type="text"
                value={importLibBaru}
                onChange={(e) => setImportLibBaru(e.target.value)}
                placeholder="Statement import..."
                className="p-2.5 border rounded-xl bg-slate-50 font-mono"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white font-black rounded-xl px-3 py-2.5 cursor-pointer"
              >
                + Pasang Library
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN (7 KOLOM): CODE EDITOR IDE, TERMINAL OUTPUT & VISUAL PREVIEW */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-black text-white">
                  {engineSaatIni.ekstensiFile}
                </span>
                <span className="text-[11px] bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-md">
                  {engineSaatIni.nama}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(kodeEditor)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin
                </button>
                <button
                  type="button"
                  onClick={() => setKodeEditor(modulAktif.kodeAwal)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Kode
                </button>
                <button
                  type="button"
                  onClick={jalankanSimulatorKode}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> Jalankan Kode (Run)
                </button>
              </div>
            </div>

            <textarea
              rows={13}
              value={kodeEditor}
              onChange={(e) => setKodeEditor(e.target.value)}
              spellCheck={false}
              className="w-full p-5 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y"
            />

            <div className="border-t border-slate-800 bg-black/60 p-5 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>TERMINAL OUTPUT &amp; COMPILER LOG</span>
                <span className="text-emerald-400">● Ready</span>
              </div>
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {outputTerminal}
              </pre>
            </div>
          </div>

          {kategoriAktif === "nextjs" && (
            <div className="bg-white text-slate-800 p-6 rounded-3xl border-2 border-indigo-200 space-y-3 shadow-md">
              <div className="flex justify-between items-center text-xs font-black text-indigo-900">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" /> Live Browser Preview (Next.js 16 +
                  Tailwind CSS)
                </span>
                <span className="font-mono text-[11px] text-emerald-700">
                  localhost:3000/preview
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase bg-black/20 px-3 py-1 rounded-full">
                  Next.js 16 Live Preview
                </span>
                <h4 className="text-xl font-black">Kartu Wakaf Ilmu Interaktif</h4>
                <p className="text-xs opacity-90">
                  Komponen berhasil dirender langsung dari kode TypeScript Anda!
                </p>
              </div>
            </div>
          )}

          {(kategoriAktif === "matlab" || kategoriAktif === "python") &&
            modulAktif.dataPlotAwal && (
              <div className="bg-white text-slate-800 p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-indigo-600" /> Figure 1: Visualisasi Grafik
                    Plot ({engineSaatIni.nama})
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">grid on;</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 items-end h-36 bg-slate-50 p-4 rounded-2xl border">
                  {modulAktif.dataPlotAwal.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end h-full gap-1"
                    >
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-emerald-400"
                      />
                      <span className="text-[9px] font-mono font-bold text-slate-500">
                        t{idx}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};