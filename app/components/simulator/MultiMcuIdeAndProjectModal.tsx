"use client";

import React from "react";
import {
  CheckCircle2,
  FolderOpen,
  Save,
  Trash2,
  Code2,
  ArrowLeftRight,
  Copy,
  Play,
  Square,
  PackagePlus,
  AlertTriangle,
  Terminal,
  Sparkles,
  X,
} from "lucide-react";
import { NodeKomponenKanvas, ProjectTersimpanAkun } from "./ElectronicAndIotCanvas";
import { PUSTAKA_RESMI_IOT } from "./codeTranspilerAndValidator";

// ============================================================================
// 1. KOMPONEN POP-UP MODAL ELEGAN SAAT SIMPAN / BUKA PROJECT AKUN
// ============================================================================
export interface InfoPopupNotifProject {
  judul: string;
  namaProject: string;
  namaAkun: string;
  jumlahKomponen: number;
  jumlahKabel: number;
  jumlahWidgetBlynk: number;
}

export const ProjectSavedPopupModal: React.FC<{
  info: InfoPopupNotifProject | null;
  onClose: () => void;
  onBukaRepositori: () => void;
}> = ({ info, onClose, onBukaRepositori }) => {
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white max-w-md w-full rounded-[2rem] border-2 border-emerald-400 p-7 shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
        </div>

        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1 bg-emerald-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
            <Sparkles className="w-3 h-3" /> Cloud Account Sync Berhasil
          </span>
          <h3 className="text-xl font-black text-white">{info.judul}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Project <b className="text-amber-300">&ldquo;{info.namaProject}&rdquo;</b> berhasil
            disimpan ke akun <b className="text-emerald-300">{info.namaAkun}</b>! Anda dapat
            membukanya kembali kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-center font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Komponen</div>
            <div className="text-sm font-black text-emerald-400">
              {info.jumlahKomponen} Item
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Jalur Kabel</div>
            <div className="text-sm font-black text-sky-400">
              {info.jumlahKabel} Kabel
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Blynk IoT</div>
            <div className="text-sm font-black text-amber-300">
              {info.jumlahWidgetBlynk} Widget
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onBukaRepositori();
            }}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-amber-300" /> Lihat Daftar Project
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
          >
            Lanjutkan Simulasi ✓
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. DRAWER REPOSITORI PROJECT TERSIMPAN PER AKUN
// ============================================================================
export const AccountProjectRepositoryDrawer: React.FC<{
  buka: boolean;
  namaPemilikAktif: string;
  idPemilikAktif: string;
  namaProjectInput: string;
  setNamaProjectInput: (v: string) => void;
  daftarProjectTersimpan: ProjectTersimpanAkun[];
  onSimpanProject: (e: React.FormEvent) => void;
  onMuatProject: (prj: ProjectTersimpanAkun) => void;
  onHapusProject: (idPrj: string) => void;
}> = ({
  buka,
  namaPemilikAktif,
  idPemilikAktif,
  namaProjectInput,
  setNamaProjectInput,
  daftarProjectTersimpan,
  onSimpanProject,
  onMuatProject,
  onHapusProject,
}) => {
  if (!buka) return null;

  return (
    <div className="bg-slate-950 p-5 rounded-3xl border-2 border-amber-400 space-y-4 text-xs shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
            Private Account Cloud Storage
          </span>
          <h4 className="font-black text-base text-white mt-1">
            Repositori Project Tersimpan Milik Akun: {namaPemilikAktif} (ID: {idPemilikAktif})
          </h4>
        </div>
        <span className="text-slate-400">
          Tersimpan otomatis beserta koordinat komponen, kabel siku, kode C++/MicroPython &amp;
          posisi bebas widget Blynk.
        </span>
      </div>

      <form onSubmit={onSimpanProject} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          required
          value={namaProjectInput}
          onChange={(e) => setNamaProjectInput(e.target.value)}
          placeholder="Ketik nama project yang ingin disimpan..."
          className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
        >
          <Save className="w-4 h-4" /> Simpan Project ke Akun {namaPemilikAktif}
        </button>
      </form>

      {daftarProjectTersimpan.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {daftarProjectTersimpan.map((prj) => (
            <div
              key={prj.idProject}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="font-black text-sm text-amber-300">{prj.namaProject}</span>
                  <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded text-emerald-400">
                    {prj.nodes.length} Item • {prj.kabel.length} Kabel
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Disimpan: {prj.waktuSimpan} oleh <b>{prj.pemilikNama}</b>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onMuatProject(prj)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] cursor-pointer"
                >
                  📂 Buka Project Ini
                </button>
                <button
                  type="button"
                  onClick={() => onHapusProject(prj.idProject)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
          Belum ada project yang disimpan pada akun <b>{namaPemilikAktif}</b>.
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. STUDIO PEMROGRAMAN MULTI-MIKROKONTROLER (C++ ⇄ MICROPYTHON)
// ============================================================================
export const MultiMcuIdeSection: React.FC<{
  daftarMcuDiKanvas: NodeKomponenKanvas[];
  mcuTabAktifObj: NodeKomponenKanvas | undefined;
  setIdTabMcuAktif: (id: string) => void;
  statusRunPerMcu: { [id: string]: boolean };
  errorCompilerPerMcu: { [id: string]: string | null };
  bahasaTabAktif: "cpp" | "micropython";
  kodeTabAktif: string;
  onUbahKodeTabAktif: (kodeBaru: string) => void;
  onKonversiBahasaOtomatis: (target: "cpp" | "micropython") => void;
  onSisipkanLibrary: (header: string) => void;
  onJalankanSatuMcu: (mcuId: string, jalan: boolean) => void;
  logSerialMultiMcu: string[];
  jumlahKomponenAktif: number;
  totalKomponen: number;
}> = ({
  daftarMcuDiKanvas,
  mcuTabAktifObj,
  setIdTabMcuAktif,
  statusRunPerMcu,
  errorCompilerPerMcu,
  bahasaTabAktif,
  kodeTabAktif,
  onUbahKodeTabAktif,
  onKonversiBahasaOtomatis,
  onSisipkanLibrary,
  onJalankanSatuMcu,
  logSerialMultiMcu,
  jumlahKomponenAktif,
  totalKomponen,
}) => {
  if (daftarMcuDiKanvas.length === 0) return null;

  return (
    <div className="bg-slate-950 rounded-3xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl">
      <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Code2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-black uppercase text-slate-400 mr-1">
            Tab Program MCU ({daftarMcuDiKanvas.length} Board):
          </span>
          {daftarMcuDiKanvas.map((mcu, idx) => {
            const tabDipilih = mcuTabAktifObj?.id === mcu.id;
            const sedangRun = !!statusRunPerMcu[mcu.id] && !errorCompilerPerMcu[mcu.id];
            const adaErr = !!errorCompilerPerMcu[mcu.id];
            return (
              <button
                key={mcu.id}
                type="button"
                onClick={() => setIdTabMcuAktif(mcu.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                  tabDipilih
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-indigo-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    adaErr
                      ? "bg-rose-500 animate-ping"
                      : sedangRun
                      ? "bg-emerald-400 animate-ping"
                      : "bg-slate-600"
                  }`}
                />
                <span>
                  Tab #{idx + 1}: {mcu.label}
                </span>
              </button>
            );
          })}
        </div>

        {mcuTabAktifObj && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => onKonversiBahasaOtomatis("cpp")}
                className={`px-3 py-1 rounded-lg font-black cursor-pointer transition ${
                  bahasaTabAktif === "cpp"
                    ? "bg-sky-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                C++ Arduino (.ino)
              </button>
              <button
                type="button"
                onClick={() => onKonversiBahasaOtomatis("micropython")}
                className={`px-3 py-1 rounded-lg font-black cursor-pointer transition ${
                  bahasaTabAktif === "micropython"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🐍 MicroPython (main.py)
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onKonversiBahasaOtomatis(
                  bahasaTabAktif === "cpp" ? "micropython" : "cpp"
                )
              }
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/40 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Ubah ke{" "}
              {bahasaTabAktif === "cpp" ? "MicroPython" : "C++"}
            </button>

            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(kodeTabAktif)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Salin
            </button>

            <button
              type="button"
              onClick={() =>
                onJalankanSatuMcu(
                  mcuTabAktifObj.id,
                  !(statusRunPerMcu[mcuTabAktifObj.id] && !errorCompilerPerMcu[mcuTabAktifObj.id])
                )
              }
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer ${
                statusRunPerMcu[mcuTabAktifObj.id] &&
                !errorCompilerPerMcu[mcuTabAktifObj.id]
                  ? "bg-amber-400 text-slate-950"
                  : "bg-emerald-500 text-slate-950"
              }`}
            >
              {statusRunPerMcu[mcuTabAktifObj.id] &&
              !errorCompilerPerMcu[mcuTabAktifObj.id] ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-slate-950" /> Stop {mcuTabAktifObj.label}
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> Compile &amp; Run{" "}
                  {mcuTabAktifObj.label}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-900/60 px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-black text-amber-300 flex items-center gap-1">
          <PackagePlus className="w-3.5 h-3.5" /> Sisipkan Library Resmi (
          {bahasaTabAktif === "micropython" ? "MicroPython import" : "C++ #include"}):
        </span>
        {PUSTAKA_RESMI_IOT.map((lib, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() =>
              onSisipkanLibrary(
                bahasaTabAktif === "micropython" ? lib.microPythonImport : lib.cppHeader
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-400 font-mono text-emerald-300 cursor-pointer"
          >
            +{" "}
            {bahasaTabAktif === "micropython"
              ? lib.microPythonImport.split("\n")[0]
              : lib.cppHeader.split("\n")[0]}
          </button>
        ))}
      </div>

      {mcuTabAktifObj && errorCompilerPerMcu[mcuTabAktifObj.id] && (
        <div className="bg-rose-950/90 border-b border-rose-500 px-5 py-3 flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center gap-2 font-mono font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorCompilerPerMcu[mcuTabAktifObj.id]}</span>
          </div>
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-rose-600 text-white shrink-0">
            Board Dihentikan
          </span>
        </div>
      )}

      {mcuTabAktifObj && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 border-r border-slate-800">
            <textarea
              rows={12}
              value={kodeTabAktif}
              onChange={(e) => onUbahKodeTabAktif(e.target.value)}
              spellCheck={false}
              className="w-full p-5 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y"
            />
          </div>
          <div className="lg:col-span-4 p-4 bg-black/70 flex flex-col justify-between space-y-3 font-mono text-xs">
            <div className="space-y-2">
              <div className="text-[11px] font-black text-amber-300 uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" /> Compiler &amp; Multi-MCU Serial
                Monitor
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto text-[11px] text-slate-300">
                {logSerialMultiMcu.map((lg, i) => (
                  <div
                    key={i}
                    className={`leading-snug border-b border-slate-900 pb-1 ${
                      lg.includes("❌") ? "text-rose-400 font-bold" : ""
                    }`}
                  >
                    {lg}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Komponen Aktif Terhubung:{" "}
              <b className="text-emerald-400">
                {jumlahKomponenAktif} dari {totalKomponen} Komponen
              </b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};