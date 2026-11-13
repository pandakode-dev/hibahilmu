"use client";

import React from "react";
import { Sparkles, Lightbulb, Check, X } from "lucide-react";
import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";
import { MiniaturSvgGudang48 } from "./wokwiHardwareVisuals";

// ============================================================================
// FULL DIAGRAM GAMBAR SKEMA RANGKAIAN BERANIMASI DI POP-UP (TANPA TEKS OVERFLOW!)
// ============================================================================
export const AnimasiVisualDasarTeoriModal: React.FC<{
  blueprint: BlueprintMultiPinLevel;
  totalKomponen: number;
}> = ({ blueprint, totalKomponen }) => {
  const slot2 = blueprint.slotPeriferalList[0];
  const slot3 = blueprint.slotPeriferalList[1];
  const adaSeriSlot2KeSlot3 = blueprint.sambunganWajibList.some(
    (w) => !w.pinAsalId.startsWith("ESP_") && !w.pinTujuanId.startsWith("ESP_")
  );

  return (
    <svg
      viewBox="0 0 560 195"
      className="w-full h-48 sm:h-52 bg-[#070b14] rounded-2xl border-2 border-slate-800 shadow-inner select-none"
    >
      {/* Grid Titik Breadboard Halus */}
      {Array.from({ length: 19 }).map((_, gx) =>
        Array.from({ length: 7 }).map((__, gy) => (
          <circle
            key={`${gx}-${gy}`}
            cx={20 + gx * 28}
            cy={20 + gy * 28}
            r={1.3}
            fill="#1e293b"
          />
        ))
      )}

      {/* GAMBAR 1: PAPAN ESP32 DI SEBELAH KIRI */}
      <g>
        <rect
          x={28}
          y={20}
          width={118}
          height={155}
          rx={12}
          fill="#1e293b"
          stroke="#facc15"
          strokeWidth={2}
        />
        <rect
          x={46}
          y={30}
          width={82}
          height={44}
          rx={5}
          fill="#cbd5e1"
          stroke="#475569"
        />
        <text
          x={87}
          y={50}
          textAnchor="middle"
          fill="#0f172a"
          fontSize="8.5"
          fontWeight="bold"
        >
          ESP-WROOM-32
        </text>
        <text
          x={87}
          y={64}
          textAnchor="middle"
          fill="#334155"
          fontSize="7"
          fontWeight="bold"
        >
          SLOT #1 (MCU)
        </text>

        {/* Titik Pin Aktif di Kanan ESP32 */}
        <circle cx={146} cy={58} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} />
        <text x={135} y={61} textAnchor="end" fill="#fca5a5" fontSize="8" fontWeight="bold">
          {blueprint.sambunganWajibList[0]?.labelPinAsal || "GPIO 2"}
        </text>

        <circle cx={146} cy={98} r={6} fill="#38bdf8" stroke="#ffffff" strokeWidth={1.5} />
        <text x={135} y={101} textAnchor="end" fill="#7dd3fc" fontSize="8" fontWeight="bold">
          {blueprint.sambunganWajibList[2]?.labelPinAsal || "3V3 / GPIO"}
        </text>

        <circle cx={146} cy={142} r={6} fill="#64748b" stroke="#ffffff" strokeWidth={1.5} />
        <text x={135} y={145} textAnchor="end" fill="#cbd5e1" fontSize="8" fontWeight="bold">
          GND
        </text>
      </g>

      {/* JIKA MODE STANDALONE 1-ESP32 */}
      {totalKomponen === 1 ? (
        <g>
          <rect
            x={235}
            y={38}
            width={285}
            height={118}
            rx={14}
            fill="#064e3b"
            stroke="#34d399"
            strokeWidth={2}
          />
          <circle cx={377} cy={80} r={18} fill="#38bdf8">
            <animate
              attributeName="r"
              values="12;22;12"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={377}
            y={122}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="bold"
          >
            MODE STANDALONE 1-BOARD ESP32
          </text>
          <text
            x={377}
            y={140}
            textAnchor="middle"
            fill="#a7f3d0"
            fontSize="8.5"
          >
            LED Internal GPIO 2 &amp; Wi-Fi Sudah Tertanam di Papan
          </text>
        </g>
      ) : (
        <>
          {/* GAMBAR 2: KOMPONEN SLOT #2 DI KANAN ATAS */}
          {slot2 && (
            <g>
              <rect
                x={320}
                y={16}
                width={215}
                height={76}
                rx={12}
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth={2}
              />
              {/* 2 Titik Kaki Pin Slot #2 */}
              <circle cx={320} cy={38} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} />
              <circle cx={320} cy={70} r={6} fill="#38bdf8" stroke="#ffffff" strokeWidth={1.5} />

              <svg x={332} y={22} width={60} height={60} viewBox="0 0 64 56">
                <MiniaturSvgGudang48
                  idItem={slot2.idGambarMiniatur}
                  namaItem={slot2.namaTarget}
                />
              </svg>
              <text x={400} y={46} fill="#38bdf8" fontSize="8.5" fontWeight="bold">
                SLOT #2 (2 KAKI PIN):
              </text>
              <text x={400} y={62} fill="#ffffff" fontSize="9.2" fontWeight="bold">
                {slot2.namaTarget.split("(")[0].slice(0, 22)}
              </text>
            </g>
          )}

          {/* GAMBAR 3: KOMPONEN SLOT #3 DI KANAN BAWAH */}
          {slot3 && (
            <g>
              <rect
                x={320}
                y={104}
                width={215}
                height={76}
                rx={12}
                fill="#0f172a"
                stroke="#a855f7"
                strokeWidth={2}
              />
              {/* 2 Titik Kaki Pin Slot #3 */}
              <circle cx={320} cy={126} r={6} fill="#facc15" stroke="#ffffff" strokeWidth={1.5} />
              <circle cx={320} cy={158} r={6} fill="#64748b" stroke="#ffffff" strokeWidth={1.5} />

              <svg x={332} y={110} width={60} height={60} viewBox="0 0 64 56">
                <MiniaturSvgGudang48
                  idItem={slot3.idGambarMiniatur}
                  namaItem={slot3.namaTarget}
                />
              </svg>
              <text x={400} y={134} fill="#c084fc" fontSize="8.5" fontWeight="bold">
                SLOT #3 (2 KAKI PIN):
              </text>
              <text x={400} y={150} fill="#ffffff" fontSize="9.2" fontWeight="bold">
                {slot3.namaTarget.split("(")[0].slice(0, 22)}
              </text>
            </g>
          )}

          {/* ANIMASI GARIS KABEL VISUAL & PARTIKEL ARUS LISTRIK MENGALIR */}
          {/* Kabel 1: ESP32 Atas -> Kaki 1 Slot #2 */}
          <path
            d="M 146 58 C 225 58, 240 38, 320 38"
            fill="none"
            stroke="#ef4444"
            strokeWidth={3.5}
          />
          <circle cx={230} cy={48} r={4.5} fill="#fef08a">
            <animate
              attributeName="cx"
              values="146;320"
              dur="1.1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="58;38"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </circle>

          {adaSeriSlot2KeSlot3 ? (
            <>
              {/* Kabel 2 (Seri): Kaki 2 Slot #2 -> Kaki 1 Slot #3 */}
              <path
                d="M 320 70 C 265 70, 265 126, 320 126"
                fill="none"
                stroke="#facc15"
                strokeWidth={3.5}
              />
              <circle cx={280} cy={98} r={4.5} fill="#fef08a">
                <animate
                  attributeName="cy"
                  values="70;126"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
              <rect x={208} y={88} width={68} height={18} rx={4} fill="#facc15" />
              <text x={242} y={100} textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                SERI 2 KAKI
              </text>
            </>
          ) : (
            <>
              {/* Kabel Paralel ke ESP32 Tengah */}
              <path
                d="M 146 98 C 225 98, 240 70, 320 70"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={3}
              />
              <path
                d="M 146 98 C 225 98, 240 126, 320 126"
                fill="none"
                stroke="#facc15"
                strokeWidth={3}
              />
            </>
          )}

          {/* Kabel 3 (Ground): Kaki 2 Slot #3 -> GND ESP32 */}
          <path
            d="M 320 158 C 240 158, 225 142, 146 142"
            fill="none"
            stroke="#64748b"
            strokeWidth={3.5}
          />
          <circle cx={230} cy={150} r={4} fill="#38bdf8">
            <animate
              attributeName="cx"
              values="320;146"
              dur="1.1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="158;142"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </circle>
        </>
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

        {/* FULL GAMBAR VISUAL SKEMA RANGKAIAN BERANIMASI (TIDAK ADA TULISAN KELUAR KOTAK!) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Gambar Animasi Skema Sambungan Rangkaian:
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
            🛠️ Komponen yang Wajib Kamu Tarik ke Kanvas:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/50">
              <div className="font-bold text-amber-300">Slot #1: ESP32 DevKit V1</div>
              <div className="text-slate-400 text-[11px]">
                Papan mikrokontroler utama di sebelah kiri.
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