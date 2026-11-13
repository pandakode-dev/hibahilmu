"use client";

import React, { useState, useEffect } from "react";
import {
  Bug,
  CheckCircle2,
  FileDown,
  FastForward,
  Play,
  Pause,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface HasilUjiSkenarioTestbench {
  nomorSkenario: number;
  namaSkenario: string;
  kondisiInput: string;
  responDiharapkan: string;
  lulus: boolean;
}

export const WokwiDebuggerAndTestbenchPanel: React.FC<{
  kodeKetikanUser: string;
  simulasiAktif: boolean;
  barisSedangDieksekusi: number | null;
  setBarisSedangDieksekusi: React.Dispatch<React.SetStateAction<number | null>>;
  onUnduhLaporanDocx: () => void;
  sedangMengunduhDocx: boolean;
  onJalankanTestbench3Skenario: () => void;
  hasilTestbench: HasilUjiSkenarioTestbench[];
}> = ({
  kodeKetikanUser,
  simulasiAktif,
  barisSedangDieksekusi,
  setBarisSedangDieksekusi,
  onUnduhLaporanDocx,
  sedangMengunduhDocx,
  onJalankanTestbench3Skenario,
  hasilTestbench,
}) => {
  const [modeDebuggerLambat, setModeDebuggerLambat] = useState<boolean>(false);
  const barisKodeList = (kodeKetikanUser || "").split("\n");

  // Mesin Step-by-Step Debugger: Menyorot baris kode yang sedang dieksekusi CPU secara berurutan
  useEffect(() => {
    if (!modeDebuggerLambat) {
      setBarisSedangDieksekusi(null);
      return;
    }

    const barisAktifIndices = barisKodeList
      .map((isi, idx) => ({ isi: isi.trim(), nomor: idx + 1 }))
      .filter(
        (b) =>
          b.isi.length > 0 &&
          !b.isi.startsWith("//") &&
          !b.isi.startsWith("#") &&
          b.isi !== "{" &&
          b.isi !== "}"
      );

    if (barisAktifIndices.length === 0) return;

    let pointer = 0;
    const timer = setInterval(() => {
      const target = barisAktifIndices[pointer % barisAktifIndices.length];
      setBarisSedangDieksekusi(target.nomor);
      pointer++;
    }, 850);

    return () => clearInterval(timer);
  }, [modeDebuggerLambat, kodeKetikanUser, setBarisSedangDieksekusi]);

  // Fungsi simulasi lompatan langsung ke baris Interrupt Service Routine (IRAM_ATTR)
  const picuLompatanInterruptIsr = () => {
    const idxIsr = barisKodeList.findIndex(
      (b) => b.includes("IRAM_ATTR") || b.includes("isr") || b.includes("onTimer")
    );
    if (idxIsr >= 0) {
      setModeDebuggerLambat(true);
      setBarisSedangDieksekusi(idxIsr + 1);
    } else {
      setModeDebuggerLambat(true);
      setBarisSedangDieksekusi(1);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* Kontrol Step-by-Step Debugger */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModeDebuggerLambat(!modeDebuggerLambat)}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer transition ${
              modeDebuggerLambat
                ? "bg-amber-400 text-slate-950 shadow-lg"
                : "bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40"
            }`}
          >
            {modeDebuggerLambat ? (
              <>
                <Pause className="w-3.5 h-3.5" /> 🐢 Stop Debugger (Sedang di Baris #{barisSedangDieksekusi || 1})
              </>
            ) : (
              <>
                <Bug className="w-3.5 h-3.5" /> 🐢 Jalankan Step-by-Step Debugger
              </>
            )}
          </button>

          <button
            type="button"
            onClick={picuLompatanInterruptIsr}
            className="px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> ⚡ Uji Lompatan Interrupt ISR
          </button>
        </div>

        {/* Tombol Testbench 3 Skenario & Unduh Laporan DOCX */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onJalankanTestbench3Skenario}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <ShieldCheck className="w-4 h-4" /> 🧪 Uji Otomatis 3 Skenario (Grader)
          </button>

          <button
            type="button"
            disabled={sedangMengunduhDocx}
            onClick={onUnduhLaporanDocx}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <FileDown className="w-4 h-4" />
            {sedangMengunduhDocx
              ? "Mencetak .DOCX..."
              : "📄 Unduh Laporan Praktikum (.docx)"}
          </button>
        </div>
      </div>

      {/* Hasil Automated Testbench 3 Skenario Beruntun */}
      {hasilTestbench.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-teal-500/50 space-y-2">
          <div className="font-extrabold text-teal-300 flex items-center justify-between">
            <span>🧪 HASIL AUTOMATED TESTBENCH GRADER (3 SKENARIO UJI BERUNTUN):</span>
            <span className="text-emerald-400">
              Lulus: {hasilTestbench.filter((x) => x.lulus).length} /{" "}
              {hasilTestbench.length} Skenario
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {hasilTestbench.map((t) => (
              <div
                key={t.nomorSkenario}
                className={`p-2.5 rounded-lg border font-mono text-[11px] space-y-1 ${
                  t.lulus
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>
                    {t.lulus ? "✅" : "❌"} Skenario #{t.nomorSkenario}: {t.namaSkenario}
                  </span>
                </div>
                <div className="text-slate-300 text-[10px]">
                  Input: {t.kondisiInput}
                </div>
                <div className="text-amber-300 text-[10px]">
                  Output: {t.responDiharapkan}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};