"use client";

import React from "react";
import { Sparkles, Lightbulb, Check, X } from "lucide-react";
import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";

export const AnimasiVisualDasarTeoriModal: React.FC<{
  blueprint: BlueprintMultiPinLevel;
  totalKomponen: number;
}> = ({ blueprint, totalKomponen }) => {
  return (
    <svg
      viewBox="0 0 540 160"
      className="w-full h-36 sm:h-40 bg-slate-950 rounded-2xl border border-slate-800"
    >
      <rect
        x={18}
        y={22}
        width={130}
        height={115}
        rx={12}
        fill="#0f172a"
        stroke="#facc15"
        strokeWidth={2.5}
      />
      <text
        x={83}
        y={52}
        textAnchor="middle"
        fill="#facc15"
        fontSize="9.5"
        fontWeight="bold"
      >
        SLOT #1 (OTAK MCU)
      </text>
      <text
        x={83}
        y={74}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="10"
        fontWeight="bold"
      >
        ESP32 DevKit V1
      </text>
      <text
        x={83}
        y={96}
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="8"
      >
        Pin GPIO + 3V3 + GND
      </text>

      <path
        d="M 148 80 L 205 80"
        stroke="#38bdf8"
        strokeWidth={3.5}
        strokeDasharray="6 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="20"
          to="0"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>

      <rect
        x={205}
        y={14}
        width={318}
        height={132}
        rx={12}
        fill="#064e3b"
        stroke="#34d399"
        strokeWidth={2}
      />
      <text
        x={364}
        y={34}
        textAnchor="middle"
        fill="#fde047"
        fontSize="9.5"
        fontWeight="bold"
      >
        {totalKomponen === 1
          ? "⚡ MODE 1 KOMPONEN (HANYA PAPAN ESP32 SAJA)"
          : `🔌 SEMUA KAKI KOMPONEN WAJIB DISAMBUNG (${blueprint.sambunganWajibList.length} KABEL):`}
      </text>

      {blueprint.sambunganWajibList.length === 0 ? (
        <text
          x={364}
          y={84}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="bold"
        >
          LED &amp; Wi-Fi sudah ada di dalam ESP32 (Tanpa Kabel Luar)
        </text>
      ) : (
        blueprint.sambunganWajibList.slice(0, 4).map((w, idx) => (
          <g key={w.idSambungan}>
            <rect
              x={218}
              y={42 + idx * 24}
              width={292}
              height={20}
              rx={4}
              fill="#022c22"
              stroke="#10b981"
            />
            <text
              x={226}
              y={55 + idx * 24}
              fill="#a7f3d0"
              fontSize="8"
              fontWeight="bold"
            >
              {w.keteranganJalur}
            </text>
          </g>
        ))
      )}
    </svg>
  );
};

export const WokwiTheoryModal: React.FC<{
  tampil: boolean;
  onTutup: () => void;
  materiAktif: ExtendedLessonStepIoT;
  blueprint: BlueprintMultiPinLevel;
  totalKomponenWajib: number;
  bersihkanKeHibahIlmu: (t: string) => string;
}> = ({
  tampil,
  onTutup,
  materiAktif,
  blueprint,
  totalKomponenWajib,
  bersihkanKeHibahIlmu,
}) => {
  if (!tampil) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-400/90 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
        <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs">
                PANDUAN AWAL • LEVEL {materiAktif.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold text-xs">
                {totalKomponenWajib} Komponen &amp; {blueprint.sambunganWajibList.length} Kabel Wajib
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {materiAktif.judulMateri}
            </h3>
          </div>

          <button
            type="button"
            onClick={onTutup}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skema Sambungan Semua Kaki Komponen:
          </div>
          <AnimasiVisualDasarTeoriModal
            blueprint={blueprint}
            totalKomponen={totalKomponenWajib}
          />
        </div>

        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-3 text-sm leading-relaxed">
          <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Pahami dengan Bahasa Sederhana:
          </div>
          <p className="text-slate-200">{blueprint.analogiMudahPaham}</p>
          <p className="text-slate-300 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
            <strong className="text-sky-300">📖 Dasar Teori Teknis:</strong>{" "}
            {bersihkanKeHibahIlmu(materiAktif.penjelasanTeoriSingkat)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-sky-300 uppercase">
            🛠️ Komponen &amp; Kaki Pin yang Harus Kamu Hubungkan:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/50">
              <div className="font-bold text-amber-300">Slot #1: ESP32 DevKit V1</div>
              <div className="text-slate-400">
                Tarik dari Gudang Komponen ke kotak sebelah kiri.
              </div>
            </div>
            {blueprint.slotPeriferalList.map((s) => (
              <div
                key={s.nomorSlot}
                className="p-3 rounded-xl bg-slate-950 border border-sky-400/50"
              >
                <div className="font-bold text-sky-300">
                  Slot #{s.nomorSlot}: {s.namaTarget}
                </div>
                <div className="text-slate-300 text-[11px]">{s.fungsiSingkat}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs text-slate-400">
            💡 Saat pop-up ini ditutup, petunjuk lengkap tetap tampil di sebelah kiri layar.
          </span>
          <button
            type="button"
            onClick={onTutup}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Check className="w-5 h-5 stroke-[2.5]" /> Mulai Rakit &amp; Hubungkan Semua Kaki Pin
          </button>
        </div>
      </div>
    </div>
  );
};