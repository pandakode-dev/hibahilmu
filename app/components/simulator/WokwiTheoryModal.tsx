"use client";

import React from "react";
import { Sparkles, Lightbulb, Check, X } from "lucide-react";
import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";
import { MiniaturSvgGudang48 } from "./wokwiHardwareVisuals";

export const AnimasiVisualDasarTeoriModal: React.FC<{
  blueprint: BlueprintMultiPinLevel;
  totalKomponen: number;
}> = ({ blueprint, totalKomponen }) => {
  const slots = blueprint.slotPeriferalList;

  return (
    <svg
      viewBox="0 0 580 215"
      className="w-full h-52 sm:h-56 bg-[#070b14] rounded-2xl border-2 border-slate-800 shadow-inner select-none"
    >
      {/* Grid Breadboard */}
      {Array.from({ length: 20 }).map((_, gx) =>
        Array.from({ length: 8 }).map((__, gy) => (
          <circle
            key={`${gx}-${gy}`}
            cx={18 + gx * 28}
            cy={18 + gy * 26}
            r={1.3}
            fill="#1e293b"
          />
        ))
      )}

      {/* PAPAN ESP32 DI KIRI (LABEL PIN RAPI DI BAWAH CHIP WROOM) */}
      <g>
        <rect
          x={20}
          y={18}
          width={118}
          height={178}
          rx={12}
          fill="#1e293b"
          stroke="#facc15"
          strokeWidth={2}
        />
        <rect
          x={34}
          y={26}
          width={90}
          height={38}
          rx={5}
          fill="#cbd5e1"
          stroke="#475569"
        />
        <text
          x={79}
          y={43}
          textAnchor="middle"
          fill="#0f172a"
          fontSize="8.2"
          fontWeight="bold"
        >
          ESP-WROOM-32
        </text>
        <text
          x={79}
          y={56}
          textAnchor="middle"
          fill="#334155"
          fontSize="7"
          fontWeight="bold"
        >
          SLOT #1 (MCU)
        </text>

        {/* 4 Titik Bus Pin Utama di Bawah WROOM */}
        {[
          { y: 84, label: "GPIO IN", warna: "#38bdf8" },
          { y: 114, label: "GPIO OUT", warna: "#22c55e" },
          { y: 144, label: "3V3 VCC", warna: "#ef4444" },
          { y: 174, label: "GND BUS", warna: "#64748b" },
        ].map((p, idx) => (
          <g key={idx}>
            <rect x={68} y={p.y - 7} width={60} height={14} rx={3} fill="#0f172a" />
            <text
              x={98}
              y={p.y + 2.5}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="7.2"
              fontWeight="bold"
            >
              {p.label}
            </text>
            <circle
              cx={138}
              cy={p.y}
              r={5.5}
              fill={p.warna}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          </g>
        ))}
      </g>

      {totalKomponen === 1 ? (
        <g>
          <rect
            x={220}
            y={42}
            width={320}
            height={130}
            rx={14}
            fill="#064e3b"
            stroke="#34d399"
            strokeWidth={2}
          />
          <circle cx={380} cy={88} r={18} fill="#38bdf8">
            <animate
              attributeName="r"
              values="12;22;12"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={380}
            y={132}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="bold"
          >
            MODE STANDALONE 1-BOARD ESP32
          </text>
          <text
            x={380}
            y={150}
            textAnchor="middle"
            fill="#a7f3d0"
            fontSize="8.5"
          >
            LED Internal GPIO 2 &amp; Wi-Fi Sudah Tertanam di Papan
          </text>
        </g>
      ) : (
        /* GRID DINAMIS UNTUK 2, 4, 6, ATAU 9 KOMPONEN PERIFERAL (TOTAL 3, 5, 7, 10 ITEM!) */
        slots.map((s, idx) => {
          const cols = slots.length <= 2 ? 1 : slots.length <= 6 ? 2 : 3;
          const rows = Math.ceil(slots.length / cols);
          const col = idx % cols;
          const row = Math.floor(idx / cols);

          const w = cols === 1 ? 260 : cols === 2 ? 175 : 118;
          const h = rows === 1 ? 80 : rows === 2 ? 84 : 56;
          const gx = 205 + col * (w + 10);
          const gy = 16 + row * (h + 10);

          const targetEspY = 84 + (idx % 4) * 30;
          const warnaGaris =
            s.daftarPinKomponenIni[0]?.warnaPin || "#38bdf8";

          return (
            <g key={s.nomorSlot}>
              {/* Garis Kabel Beranimasi dari ESP32 ke Slot Ini */}
              <path
                d={`M 138 ${targetEspY} L ${165 + (idx % 4) * 7} ${targetEspY} L ${165 + (idx % 4) * 7} ${gy + h / 2} L ${gx} ${gy + h / 2}`}
                fill="none"
                stroke={warnaGaris}
                strokeWidth={2.5}
                opacity={0.85}
              />
              <circle cx={(138 + gx) / 2} cy={(targetEspY + gy + h / 2) / 2} r={3.5} fill="#fef08a">
                <animate
                  attributeName="cx"
                  values={`138;${gx}`}
                  dur={`${1 + (idx % 3) * 0.25}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${targetEspY};${gy + h / 2}`}
                  dur={`${1 + (idx % 3) * 0.25}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Kotak Komponen Slot #N */}
              <rect
                x={gx}
                y={gy}
                width={w}
                height={h}
                rx={9}
                fill="#0f172a"
                stroke={warnaGaris}
                strokeWidth={1.8}
              />
              <circle
                cx={gx}
                cy={gy + h * 0.33}
                r={4.5}
                fill={warnaGaris}
                stroke="#ffffff"
              />
              <circle
                cx={gx}
                cy={gy + h * 0.72}
                r={4.5}
                fill="#64748b"
                stroke="#ffffff"
              />

              <svg
                x={gx + 8}
                y={gy + 4}
                width={cols === 3 ? 36 : 48}
                height={h - 8}
                viewBox="0 0 64 56"
              >
                <MiniaturSvgGudang48
                  idItem={s.idGambarMiniatur}
                  namaItem=""
                />
              </svg>

              <text
                x={gx + (cols === 3 ? 46 : 60)}
                y={gy + h / 2 - 3}
                fill="#fde047"
                fontSize={cols === 3 ? "7" : "8"}
                fontWeight="bold"
              >
                SLOT #{s.nomorSlot} (2 PIN):
              </text>
              <text
                x={gx + (cols === 3 ? 46 : 60)}
                y={gy + h / 2 + 10}
                fill="#ffffff"
                fontSize={cols === 3 ? "7.2" : "8.5"}
                fontWeight="bold"
              >
                {s.namaTarget
                  .split("(")[0]
                  .trim()
                  .slice(0, cols === 3 ? 12 : 18)}
              </text>
            </g>
          );
        })
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
      <div className="bg-slate-900 border-2 border-emerald-400/90 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
        <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs">
                PANDUAN AWAL • LEVEL {materiAktif.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">
                🔥 {totalKomponenWajib} Item Komponen &amp;{" "}
                {blueprint.sambunganWajibList.length} Kabel Wajib
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
            <Sparkles className="w-4 h-4" /> Gambar Animasi Skema Rangkaian (
            {totalKomponenWajib} Item Komponen):
          </div>
          <AnimasiVisualDasarTeoriModal
            blueprint={blueprint}
            totalKomponen={totalKomponenWajib}
          />
        </div>

        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-3 text-sm leading-relaxed">
          <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Pahami Cara Kerjanya dengan Mudah:
          </div>
          <p className="text-slate-200">{blueprint.analogiMudahPaham}</p>
          <p className="text-slate-300 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
            <strong className="text-sky-300">📖 Dasar Teori Teknis:</strong>{" "}
            {bersihkanKeHibahIlmu(materiAktif.penjelasanTeoriSingkat)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-sky-300 uppercase">
            🛠️ Daftar {totalKomponenWajib} Item Komponen yang Wajib Kamu Tarik Satu per Satu:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-400/50">
              <div className="font-bold text-amber-300">
                Slot #1: ESP32 DevKit V1
              </div>
              <div className="text-slate-400 text-[11px]">
                Papan mikrokontroler utama di sebelah kiri.
              </div>
            </div>
            {blueprint.slotPeriferalList.map((s) => (
              <div
                key={s.nomorSlot}
                className="p-2.5 rounded-xl bg-slate-950 border border-sky-400/40"
              >
                <div className="font-bold text-sky-300">
                  Slot #{s.nomorSlot}: {s.namaTarget}
                </div>
                <div className="text-slate-300 text-[11px]">
                  {s.fungsiSingkat}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs text-slate-400">
            💡 Saat pop-up ditutup, daftar seluruh {totalKomponenWajib} komponen tetap ada di sebelah kiri layar.
          </span>
          <button
            type="button"
            onClick={onTutup}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Check className="w-5 h-5 stroke-[2.5]" /> Mulai Rakit{" "}
            {totalKomponenWajib} Komponen Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};