"use client";

import React, { useState, useRef } from "react";
import {
  Save,
  CopyPlus,
  Download,
  Upload,
  FolderOpen,
  FileCode2,
  CheckCircle2,
  X,
  CloudUpload,
} from "lucide-react";
import {
  NodeKomponenKanvas,
  KabelKoneksiItem,
  ProjectTersimpanAkun,
} from "./ElectronicAndIotCanvas";
import { ExtendedWidgetBlynkItem } from "./IotCloudBlynkPanel";
import { ZonaRuanganFisik } from "./PhysicalRoomsLayer";

interface FileManagerProps {
  mode: "wokwi" | "ewb" | "matlab";
  idProjectSaatIni: string;
  namaFileSaatIni: string;
  setNamaFileSaatIni: (nama: string) => void;
  namaPemilikAktif: string;
  jumlahProjectTersimpan: number;
  statusAutoSave: string;
  nodesSaatIni: NodeKomponenKanvas[];
  kabelSaatIni: KabelKoneksiItem[];
  kodePerMcuMap: { [mcuId: string]: string };
  kodeMicroPythonMap: { [mcuId: string]: string };
  widgetsBlynkSaatIni: ExtendedWidgetBlynkItem[];
  daftarRuanganFisik: ZonaRuanganFisik[];
  onSaveLangsung: (namaFile: string, isSaveAs: boolean) => void;
  onImportProjectLengkap: (dataImport: ProjectTersimpanAkun) => void;
  onBukaDrawerRepositori: () => void;
}

export const ProjectFileManagerToolbar: React.FC<FileManagerProps> = ({
  mode,
  idProjectSaatIni,
  namaFileSaatIni,
  setNamaFileSaatIni,
  namaPemilikAktif,
  jumlahProjectTersimpan,
  statusAutoSave,
  nodesSaatIni,
  kabelSaatIni,
  kodePerMcuMap,
  kodeMicroPythonMap,
  widgetsBlynkSaatIni,
  daftarRuanganFisik,
  onSaveLangsung,
  onImportProjectLengkap,
  onBukaDrawerRepositori,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State Modal Dialog Save / Save As
  const [bukaModalSave, setBukaModalSave] = useState<false | "save" | "save_as">(
    false
  );
  const [inputNamaModal, setInputNamaModal] = useState(namaFileSaatIni);

  const bukaDialogSave = (tipe: "save" | "save_as") => {
    setInputNamaModal(
      tipe === "save_as" ? `${namaFileSaatIni} (Salinan)` : namaFileSaatIni
    );
    setBukaModalSave(tipe);
  };

  // Fungsi Export Seluruh Simulator + Koding + Blynk ke File JSON (.hibah.json)
  const handleExportSimulatorJson = () => {
    const slugNama = (namaFileSaatIni || "project_hibahilmu")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");

    const paketExport: ProjectTersimpanAkun = {
      idProject: idProjectSaatIni || "prj-" + Date.now(),
      namaProject: namaFileSaatIni || "Project Simulator HibahIlmu",
      pemilikId: "exported_file",
      pemilikNama: namaPemilikAktif,
      waktuSimpan: new Date().toLocaleString("id-ID"),
      mode,
      nodes: nodesSaatIni,
      kabel: kabelSaatIni,
      kodePerMcu: kodePerMcuMap,
      kodeMicroPythonPerMcu: kodeMicroPythonMap,
      blynkWidgets: widgetsBlynkSaatIni,
      ruanganFisik: daftarRuanganFisik,
    };

    const jsonString = JSON.stringify(paketExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugNama}.hibah.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fungsi Export Semua Kode Program (C++ .ino & MicroPython .py)
  const handleExportKodeProgram = () => {
    const slugNama = (namaFileSaatIni || "sketch_iot")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");

    const gabunganKode = Object.entries(kodePerMcuMap)
      .map(
        ([mcuId, kodeCpp]) =>
          `// ============================================================================\n// BOARD ID: ${mcuId} (C++ ARDUINO)\n// ============================================================================\n${kodeCpp}\n\n/* --- VERSI MICROPYTHON (${mcuId}) ---\n${
            kodeMicroPythonMap[mcuId] || ""
          }\n*/`
      )
      .join("\n\n");

    const blob = new Blob([gabunganKode || "// Belum ada kode MCU"], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugNama}_firmware.ino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fungsi Import File .json / .hibah.json dari Komputer Pengguna
  const handleFileChangeImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const teks = event.target?.result as string;
        const parsed = JSON.parse(teks) as ProjectTersimpanAkun;

        if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
          alert(
            "⚠️ Format file JSON tidak valid! Pastikan Anda memilih file .hibah.json hasil Export dari Simulator HibahIlmu."
          );
          return;
        }

        onImportProjectLengkap(parsed);
      } catch {
        alert("⚠️ Gagal membaca file JSON! Pastikan file tidak rusak.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      {/* BAR MENU FILE: NAMA FILE AKTIF, SAVE, SAVE AS, EXPORT JSON, EXPORT KODE, & IMPORT JSON */}
      <div className="bg-slate-950 p-3.5 rounded-3xl border border-emerald-500/40 flex flex-wrap justify-between items-center gap-3 text-xs shadow-lg">
        {/* Input Cepat Nama File Project yang Sedang Dikerjakan */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-[10px] flex items-center gap-1">
            <CloudUpload className="w-3.5 h-3.5" /> {statusAutoSave}
          </span>
          <div className="flex items-center gap-1.5 flex-1 max-w-md">
            <span className="text-slate-400 font-bold whitespace-nowrap">
              Nama File:
            </span>
            <input
              type="text"
              value={namaFileSaatIni}
              onChange={(e) => setNamaFileSaatIni(e.target.value)}
              placeholder="Ketik nama file project..."
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-400 font-black text-amber-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Deretan Tombol Save, Save As, Buka, Export & Import */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => bukaDialogSave("save")}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-md transition"
            title="Simpan perubahan ke file saat ini (Database Server & Lokal)"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>

          <button
            type="button"
            onClick={() => bukaDialogSave("save_as")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 cursor-pointer shadow-md transition"
            title="Simpan sebagai project baru dengan nama berbeda (Save As...)"
          >
            <CopyPlus className="w-3.5 h-3.5" /> Save As...
          </button>

          <button
            type="button"
            onClick={onBukaDrawerRepositori}
            className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FolderOpen className="w-3.5 h-3.5" /> Project Saya (
            {jumlahProjectTersimpan})
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-0.5 hidden sm:block" />

          {/* Tombol Export Simulator + Koding (.hibah.json) */}
          <button
            type="button"
            onClick={handleExportSimulatorJson}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 font-black flex items-center gap-1.5 cursor-pointer"
            title="Download seluruh rangkaian, kabel, widget Blynk & koding ke file .hibah.json"
          >
            <Download className="w-3.5 h-3.5" /> Export (.JSON)
          </button>

          {/* Tombol Export Hanya Kode Firmware (.ino / .py) */}
          <button
            type="button"
            onClick={handleExportKodeProgram}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-black flex items-center gap-1.5 cursor-pointer"
            title="Download file kode program C++ (.ino) & MicroPython"
          >
            <FileCode2 className="w-3.5 h-3.5" /> Export Kode
          </button>

          {/* Input File Tersembunyi & Tombol Import (.JSON) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChangeImport}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/50 font-black flex items-center gap-1.5 cursor-pointer transition"
            title="Buka / Import file .hibah.json dari komputer Anda"
          >
            <Upload className="w-3.5 h-3.5" /> Import (.JSON)
          </button>
        </div>
      </div>

      {/* MODAL DIALOG KETIK NAMA FILE SAAT KLIK SAVE ATAU SAVE AS */}
      {bukaModalSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setBukaModalSave(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300">
                {bukaModalSave === "save_as" ? (
                  <CopyPlus className="w-6 h-6" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-400 text-slate-950">
                  {bukaModalSave === "save_as"
                    ? "Save As New Project"
                    : "Save to Server & Local DB"}
                </span>
                <h4 className="font-black text-base mt-0.5">
                  {bukaModalSave === "save_as"
                    ? "Simpan Sebagai Project Baru (Save As...)"
                    : "Simpan Project Simulator & Koding"}
                </h4>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const bersih =
                  inputNamaModal.trim() || "Project Simulator HibahIlmu";
                setNamaFileSaatIni(bersih);
                onSaveLangsung(bersih, bukaModalSave === "save_as");
                setBukaModalSave(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">
                  Ketik Nama File / Project Anda:
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputNamaModal}
                  onChange={(e) => setInputNamaModal(e.target.value)}
                  placeholder="Contoh: Smart Greenhouse ESP32-C6..."
                  className="w-full p-3 rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 font-black text-amber-300 text-sm focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan ke API
                  Database Server (/api/iot/projects) &amp; Penyimpanan Lokal
                </div>
                <div>
                  • Mencakup {nodesSaatIni.length} Komponen,{" "}
                  {kabelSaatIni.length} Jalur Kabel,{" "}
                  {widgetsBlynkSaatIni.length} Widget Blynk, dan seluruh Tab
                  Kode C++/MicroPython.
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBukaModalSave(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-lg"
                >
                  {bukaModalSave === "save_as"
                    ? "Simpan Sebagai File Baru ✓"
                    : "Simpan Sekarang ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};