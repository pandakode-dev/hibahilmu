// app/components/simulator/ExtendedSensorsAndAnimations.tsx
"use client";

import React from "react";

export interface ItemPaletTambahan {
  tipe: string;
  label: string;
  kategori: string;
  defaultResistor?: number;
  defaultSensor?: number;
}

export const TAMBAHAN_PALET_SENSOR_LENGKAP: ItemPaletTambahan[] = [
  {
    tipe: "sensor_ph",
    label: "Sensor pH Air (E-201C)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 7,
  },
  {
    tipe: "sensor_tds",
    label: "Sensor TDS Meter (PPM)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 180,
  },
  {
    tipe: "sensor_turbidity",
    label: "Sensor Turbidity (NTU)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 12,
  },
  {
    tipe: "sensor_do",
    label: "Sensor DO (Oksigen Air)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 8,
  },
  {
    tipe: "sensor_bod",
    label: "Sensor BOD (Limbah Bio)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 18,
  },
  {
    tipe: "sensor_cod",
    label: "Sensor COD (Limbah Kimia)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 42,
  },
  {
    tipe: "ds18b20_air",
    label: "Suhu Air DS18B20 (°C)",
    kategori: "Sensor Air & Lingkungan",
    defaultSensor: 28,
  },
  {
    tipe: "max30100_heart",
    label: "MAX30100 Detak Jantung",
    kategori: "Sensor Medis & Bio",
    defaultSensor: 80,
  },
  {
    tipe: "mq135_udara",
    label: "Sensor Gas MQ-135 (CO2)",
    kategori: "Sensor Gas & Udara",
    defaultSensor: 260,
  },
  {
    tipe: "mq131_ozon",
    label: "Sensor Ozon O3 (MQ-131)",
    kategori: "Sensor Gas & Udara",
    defaultSensor: 55,
  },
  {
    tipe: "pzem004t_ac",
    label: "PZEM-004T Daya Listrik AC",
    kategori: "Sensor Daya & Listrik",
    defaultSensor: 450,
  },
];

export function apakahSensorTambahanBaru(tipe: string): boolean {
  return TAMBAHAN_PALET_SENSOR_LENGKAP.some((s) => s.tipe === tipe);
}

// ============================================================================
// KOMPONEN VISUAL KARTU CHIP UNTUK 11 SENSOR BARU DI PALET & KANVAS
// ============================================================================
export function VisualChipSensorTambahan({
  tipe,
  nilaiSensor = 25,
  nyala = true,
  ukuran = "kanvas",
}: {
  tipe: string;
  nilaiSensor?: number;
  nyala?: boolean;
  ukuran?: "ikon" | "kanvas";
}) {
  const isIkon = ukuran === "ikon";
  const clsBox = isIkon
    ? "w-14 h-9 rounded-md border flex flex-col items-center justify-center p-0.5 text-[7px] font-black"
    : "w-full h-full rounded-b-xl border flex flex-col items-center justify-between p-2 text-white shadow-inner";

  if (tipe === "sensor_ph") {
    const ph = Math.min(14, Math.max(0, nilaiSensor));
    const warnaPh =
      ph < 5.5 ? "#ef4444" : ph < 6.5 ? "#f59e0b" : ph <= 8.5 ? "#10b981" : "#8b5cf6";
    return (
      <div className={clsBox} style={{ backgroundColor: "#0f172a", borderColor: warnaPh }}>
        <div className="text-[8px] font-black text-sky-300">pH METER E-201C</div>
        <div className="flex items-center gap-2 my-0.5">
          <div className="w-5 h-7 rounded-b-md border border-slate-500 bg-slate-950 flex items-end overflow-hidden">
            <div
              style={{ height: `${Math.max(20, (ph / 14) * 100)}%`, backgroundColor: warnaPh }}
              className="w-full transition-all duration-300"
            />
          </div>
          {!isIkon && (
            <div className="text-right">
              <div className="text-xs font-black text-white">{ph} pH</div>
              <div className="text-[8px] font-black" style={{ color: warnaPh }}>
                {ph < 6.5 ? "ASAM" : ph <= 8.5 ? "NETRAL" : "BASA/ALKALI"}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (tipe === "sensor_tds") {
    const jmlPartikel = Math.min(10, Math.max(2, Math.floor(nilaiSensor / 90)));
    return (
      <div className={`${clsBox} bg-sky-950 border-sky-400`}>
        <div className="text-[8px] font-black text-sky-200">TDS CONDUCTIVITY</div>
        {!isIkon && (
          <div className="flex gap-1 flex-wrap justify-center my-0.5">
            {Array.from({ length: jmlPartikel }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"
                style={{ animationDuration: `${800 + i * 110}ms` }}
              />
            ))}
          </div>
        )}
        <div className="text-[10px] font-black text-amber-300">{nilaiSensor} PPM</div>
      </div>
    );
  }

  if (tipe === "max30100_heart") {
    const durasiDetak = Math.max(280, Math.floor(60000 / Math.max(40, nilaiSensor)));
    return (
      <div className={`${clsBox} bg-rose-950 border-rose-500`}>
        <div className="text-[8px] font-black text-rose-200">MAX30100 PULSE</div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-white text-xs ${
              nyala ? "animate-ping" : ""
            }`}
            style={{ animationDuration: `${durasiDetak}ms` }}
          >
            ♥
          </span>
          {!isIkon && (
            <div className="text-right">
              <div className="text-xs font-black text-white">{nilaiSensor} BPM</div>
              <div className="text-[8px] text-emerald-300 font-bold">SpO2: 98%</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (tipe === "ds18b20_air") {
    const warnaAir =
      nilaiSensor >= 50 ? "#f43f5e" : nilaiSensor <= 10 ? "#38bdf8" : "#10b981";
    return (
      <div className={`${clsBox} bg-slate-900 border-sky-400`}>
        <div className="text-[8px] font-black text-sky-300">DS18B20 WATER TEMP</div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-8 rounded-full border border-slate-600 bg-slate-950 p-0.5 flex items-end">
            <div
              style={{
                height: `${Math.min(100, Math.max(15, ((nilaiSensor + 10) / 110) * 100))}%`,
                backgroundColor: warnaAir,
              }}
              className="w-full rounded-full transition-all"
            />
          </div>
          {!isIkon && (
            <div className="text-xs font-black text-amber-300">{nilaiSensor} °C</div>
          )}
        </div>
      </div>
    );
  }

  if (
    tipe === "sensor_turbidity" ||
    tipe === "sensor_do" ||
    tipe === "sensor_bod" ||
    tipe === "sensor_cod"
  ) {
    const mapInfo: Record<string, { judul: string; unit: string; warna: string }> = {
      sensor_turbidity: { judul: "TURBIDITY AIR", unit: "NTU", warna: "#d97706" },
      sensor_do: { judul: "DISSOLVED O2", unit: "mg/L", warna: "#38bdf8" },
      sensor_bod: { judul: "BOD LIMBAH", unit: "mg/L", warna: "#10b981" },
      sensor_cod: { judul: "COD KIMIA", unit: "mg/L", warna: "#a855f7" },
    };
    const inf = mapInfo[tipe];
    return (
      <div
        className={`${clsBox} relative overflow-hidden`}
        style={{ backgroundColor: "#0f172a", borderColor: inf.warna }}
      >
        <div
          style={{
            backgroundColor: inf.warna,
            opacity: Math.min(0.75, Math.max(0.15, nilaiSensor / 100)),
          }}
          className="absolute inset-0 animate-pulse"
        />
        <div className="relative z-10 text-[8px] font-black text-white">{inf.judul}</div>
        <div className="relative z-10 text-[10px] font-black text-amber-300">
          {nilaiSensor} {inf.unit}
        </div>
      </div>
    );
  }

  if (tipe === "mq135_udara" || tipe === "mq131_ozon") {
    const isOzon = tipe === "mq131_ozon";
    return (
      <div className={`${clsBox} bg-indigo-950 border-indigo-400`}>
        <div className="text-[8px] font-black text-indigo-200">
          {isOzon ? "OZON O3 MQ-131" : "GAS MQ-135 AIR"}
        </div>
        <div className="text-[10px] font-black text-amber-300">
          {nilaiSensor} {isOzon ? "PPB" : "PPM"}
        </div>
      </div>
    );
  }

  if (tipe === "pzem004t_ac") {
    return (
      <div className={`${clsBox} bg-amber-950 border-amber-400`}>
        <div className="text-[8px] font-black text-amber-300">PZEM-004T 220VAC</div>
        <div className="text-[10px] font-black text-white">⚡ {nilaiSensor} W</div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// OVERLAY ANIMASI INTERAKTIF DI SAMPING/ATAS KOMPONEN PADA KANVAS SAAT PARAMETER DIGESER
// ============================================================================
export function ExtendedSensorLiveOverlay({
  tipe,
  nilaiSensor = 28,
  nyala = true,
}: {
  tipe: string;
  nilaiSensor?: number;
  nyala?: boolean;
}) {
  const t = tipe.toLowerCase();

  // 1. ANIMASI ORANG BERJALAN PADA SENSOR ULTRASONIK & SENSOR GERAK PIR
  if (
    t.includes("ultrason") ||
    t.includes("sr04") ||
    t.includes("pir") ||
    t.includes("sr501") ||
    t.includes("ir_obstacle")
  ) {
    const jarakCm = Math.max(2, Math.min(400, nilaiSensor));
    const offsetPx = Math.min(92, Math.max(10, (jarakCm / 220) * 85));
    const langkahGenap = Math.floor(jarakCm) % 2 === 0;
    const dekatTerdeteksi = jarakCm <= 120 && nyala;

    return (
      <div className="absolute -right-[108px] top-1/2 -translate-y-1/2 w-[105px] h-[84px] pointer-events-none z-30">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 110 86">
          {/* Kerucut Radar / Pancaran Inframerah PIR */}
          <polygon
            points={`0,43 ${offsetPx + 16},8 ${offsetPx + 16},78`}
            fill={
              dekatTerdeteksi
                ? "rgba(244, 63, 94, 0.24)"
                : "rgba(56, 189, 248, 0.15)"
            }
          />
          {/* Gelombang Sinyal Ultrasonik */}
          <path
            d="M 6 30 Q 15 43 6 56 M 15 23 Q 26 43 15 63"
            fill="none"
            stroke={dekatTerdeteksi ? "#fb7185" : "#38bdf8"}
            strokeWidth="2.2"
            className={nyala ? "animate-pulse" : ""}
          />

          {/* Siluet Orang Berjalan yang Berpindah Posisi Sesuai Nilai Parameter */}
          <g transform={`translate(${offsetPx}, 18)`}>
            <rect
              x="-16"
              y="-15"
              width="40"
              height="12"
              rx="4"
              fill="#0f172a"
              stroke={dekatTerdeteksi ? "#f43f5e" : "#38bdf8"}
              strokeWidth="1.2"
            />
            <text
              x="4"
              y="-6.5"
              fill={dekatTerdeteksi ? "#fda4af" : "#7dd3fc"}
              fontSize="7.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              {jarakCm} cm
            </text>

            {/* Kepala */}
            <circle
              cx="4"
              cy="4"
              r="5.5"
              fill={dekatTerdeteksi ? "#fb7185" : "#38bdf8"}
            />
            {/* Badan */}
            <line
              x1="4"
              y1="10"
              x2="4"
              y2="29"
              stroke={dekatTerdeteksi ? "#fb7185" : "#38bdf8"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Tangan Mengayun Saat Parameter Digeser */}
            <line
              x1="4"
              y1="14"
              x2={langkahGenap ? "-6" : "14"}
              y2="24"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="14"
              x2={langkahGenap ? "14" : "-6"}
              y2="24"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Kaki Melangkah Berjalan */}
            <line
              x1="4"
              y1="29"
              x2={langkahGenap ? "-5" : "13"}
              y2="46"
              stroke={dekatTerdeteksi ? "#fda4af" : "#7dd3fc"}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="29"
              x2={langkahGenap ? "13" : "-5"}
              y2="46"
              stroke={dekatTerdeteksi ? "#e11d48" : "#0284c7"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. ANIMASI TETESAN AIR HUJAN / KELEMBAPAN TANAH
  if (t.includes("soil") || t.includes("tanah") || t.includes("hujan") || t.includes("rain")) {
    return (
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-30 bg-slate-950/90 border border-sky-500/50 px-2 py-1 rounded-xl">
        <div className="flex gap-1">
          <span className="w-1.5 h-3 rounded-full bg-sky-400 animate-bounce" />
          <span
            className="w-1.5 h-3 rounded-full bg-sky-300 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
        </div>
        <span className="text-[8px] font-black text-sky-300 mt-0.5">{nilaiSensor}%</span>
      </div>
    );
  }

  // 3. ANIMASI MATAHARI / CAHAYA LDR & API FLAME SENSOR
  if (t.includes("ldr") || t.includes("cahaya") || t.includes("flame") || t.includes("api")) {
    const isFlame = t.includes("flame") || t.includes("api");
    return (
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-30">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg animate-pulse ${
            isFlame
              ? "bg-orange-500 text-white shadow-orange-500/60"
              : "bg-amber-400 text-slate-950 shadow-amber-400/60"
          }`}
        >
          {isFlame ? "🔥" : "☀️"}
        </div>
      </div>
    );
  }

  // 4. ANIMASI KEPULAN ASAP GAS MQ-2 / MQ-135 / OZON O3
  if (t.includes("mq") || t.includes("gas") || t.includes("ozon")) {
    return (
      <div className="absolute -top-8 right-1 flex gap-1 pointer-events-none z-30">
        <span className="w-3 h-3 rounded-full bg-slate-400/60 animate-ping" />
        <span className="w-3.5 h-3.5 rounded-full bg-rose-400/60 animate-bounce" />
      </div>
    );
  }

  return null;
}