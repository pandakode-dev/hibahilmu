// app/components/simulator/ExtendedSensorsAndAnimations.tsx
"use client";

import React, { useState } from "react";

export interface ItemPaletTambahan {
  tipe: string;
  label: string;
  kategori: string;
  subKategoriSensor?: string;
  defaultResistor?: number;
  defaultSensor?: number;
}

export const DAFTAR_SUB_KATEGORI_SENSOR = [
  "Semua Sensor",
  "Gerak & Jarak",
  "Air & Lingkungan",
  "Tanah & Pertanian",
  "Gas & Udara",
  "Cahaya, Api & Suhu",
  "Medis & Biometrik",
  "Daya & Listrik AC",
] as const;

export const TAMBAHAN_PALET_SENSOR_LENGKAP: ItemPaletTambahan[] = [
  {
    tipe: "sensor_npk",
    label: "Sensor Pupuk NPK Tanah",
    kategori: "Sensor",
    subKategoriSensor: "Tanah & Pertanian",
    defaultSensor: 145,
  },
  {
    tipe: "soil_moisture",
    label: "Sensor Kelembapan Tanah",
    kategori: "Sensor",
    subKategoriSensor: "Tanah & Pertanian",
    defaultSensor: 62,
  },
  {
    tipe: "sensor_ph",
    label: "Sensor pH Air (E-201C)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 7,
  },
  {
    tipe: "sensor_tds",
    label: "Sensor TDS Meter (PPM)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 185,
  },
  {
    tipe: "sensor_turbidity",
    label: "Sensor Turbidity (NTU)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 15,
  },
  {
    tipe: "sensor_do",
    label: "Sensor DO (Oksigen Air)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 8,
  },
  {
    tipe: "sensor_bod",
    label: "Sensor BOD (Biological O2)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 18,
  },
  {
    tipe: "sensor_cod",
    label: "Sensor COD (Chemical O2)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 42,
  },
  {
    tipe: "ds18b20_air",
    label: "Suhu Air DS18B20 (°C)",
    kategori: "Sensor",
    subKategoriSensor: "Air & Lingkungan",
    defaultSensor: 28,
  },
  {
    tipe: "max30100_heart",
    label: "MAX30100 Detak Jantung",
    kategori: "Sensor",
    subKategoriSensor: "Medis & Biometrik",
    defaultSensor: 82,
  },
  {
    tipe: "mq135_udara",
    label: "Sensor Gas MQ-135 (CO2/NH3)",
    kategori: "Sensor",
    subKategoriSensor: "Gas & Udara",
    defaultSensor: 260,
  },
  {
    tipe: "mq131_ozon",
    label: "Sensor Ozon O3 (MQ-131)",
    kategori: "Sensor",
    subKategoriSensor: "Gas & Udara",
    defaultSensor: 55,
  },
  {
    tipe: "pzem004t_ac",
    label: "PZEM-004T Wattmeter AC",
    kategori: "Sensor",
    subKategoriSensor: "Daya & Listrik AC",
    defaultSensor: 450,
  },
  {
    tipe: "pompa_air_mini",
    label: "Pompa Air Mini DC 5V",
    kategori: "Aktuator & Relay",
    defaultSensor: 100,
  },
  {
    tipe: "rfid_rc522",
    label: "RFID Reader RC522 + Tag",
    kategori: "Modul & Komunikasi",
    defaultSensor: 1,
  },
  {
    tipe: "keypad_4x4",
    label: "Keypad Matriks 4x4",
    kategori: "Layar & Input",
    defaultSensor: 5,
  },
];

// Klasifikasi Sub-Kategori otomatis untuk sensor lama maupun baru
export function tentukanSubKategoriSensor(tipe: string, label: string): string | null {
  const t = `${tipe} ${label}`.toLowerCase();
  if (
    t.includes("npk") ||
    t.includes("pupuk") ||
    t.includes("soil") ||
    t.includes("tanah") ||
    t.includes("kelembapan tanah")
  ) {
    return "Tanah & Pertanian";
  }
  if (
    t.includes("pir") ||
    t.includes("sr501") ||
    t.includes("ultrason") ||
    t.includes("sr04") ||
    t.includes("obstacle") ||
    t.includes("infrared") ||
    t.includes("gps") ||
    t.includes("mpu6050")
  ) {
    return "Gerak & Jarak";
  }
  if (
    t.includes("ph") ||
    t.includes("tds") ||
    t.includes("turbidity") ||
    t.includes("sensor_do") ||
    t.includes("oksigen") ||
    t.includes("bod") ||
    t.includes("cod") ||
    t.includes("ds18b20") ||
    t.includes("hujan") ||
    t.includes("rain") ||
    t.includes("water")
  ) {
    return "Air & Lingkungan";
  }
  if (t.includes("mq") || t.includes("gas") || t.includes("asap") || t.includes("ozon")) {
    return "Gas & Udara";
  }
  if (
    t.includes("ldr") ||
    t.includes("cahaya") ||
    t.includes("flame") ||
    t.includes("api") ||
    t.includes("dht") ||
    t.includes("suhu") ||
    t.includes("bmp")
  ) {
    return "Cahaya, Api & Suhu";
  }
  if (
    t.includes("max3010") ||
    t.includes("heart") ||
    t.includes("jantung") ||
    t.includes("pulse")
  ) {
    return "Medis & Biometrik";
  }
  if (
    t.includes("pzem") ||
    t.includes("ina219") ||
    t.includes("acs712") ||
    t.includes("tegangan")
  ) {
    return "Daya & Listrik AC";
  }
  return null;
}

// Mengecek apakah komponen menggunakan renderer visual kustom interaktif kita
export function apakahKomponenVisualKustom(tipe: string): boolean {
  const t = tipe.toLowerCase();
  if (TAMBAHAN_PALET_SENSOR_LENGKAP.some((s) => s.tipe === tipe)) return true;
  if (
    t.includes("pompa") ||
    t.includes("pump") ||
    t.includes("rfid") ||
    t.includes("rc522") ||
    t.includes("keypad") ||
    t.includes("npk") ||
    t.includes("soil") ||
    t.includes("tanah")
  ) {
    return true;
  }
  return false;
}

export function apakahSensorTambahanBaru(tipe: string): boolean {
  return apakahKomponenVisualKustom(tipe);
}

// ============================================================================
// KOMPONEN VISUAL REALISTIS + INTERAKTIF LANGSUNG DI KANVAS (KLIK POMPA, RFID, KEYPAD, NPK, SOIL)
// ============================================================================
export function VisualChipSensorTambahan({
  tipe,
  nilaiSensor = 25,
  nyala = true,
  ukuran = "kanvas",
  onInteraksiKomponen,
}: {
  tipe: string;
  nilaiSensor?: number;
  nyala?: boolean;
  ukuran?: "ikon" | "kanvas";
  onInteraksiKomponen?: (perubahan: { nyala?: boolean; nilaiSensor?: number }) => void;
}) {
  const isIkon = ukuran === "ikon";
  const t = tipe.toLowerCase();

  // State khusus untuk teks digit/huruf yang ditekan pada Keypad 4x4
  const [layarKeypad, setLayarKeypad] = useState<string>("5");
  const [tombolAktifKeypad, setTombolAktifKeypad] = useState<string | null>(null);

  // ==========================================================================
  // 1. KEYPAD MATRIKS 4x4 INTERAKTIF (Bisa Ditekan Langsung Angka & Hurufnya)
  // ==========================================================================
  if (t.includes("keypad")) {
    const daftarTombol = [
      "1", "2", "3", "A",
      "4", "5", "6", "B",
      "7", "8", "9", "C",
      "*", "0", "#", "D",
    ];

    if (isIkon) {
      return (
        <div className="w-12 h-11 bg-slate-900 border border-slate-600 rounded-md p-1 grid grid-cols-4 gap-0.5">
          {daftarTombol.map((btn) => (
            <div
              key={btn}
              className={`rounded-[2px] text-[5px] font-black flex items-center justify-center text-white ${
                ["A", "B", "C", "D"].includes(btn)
                  ? "bg-rose-600"
                  : ["*", "#"].includes(btn)
                  ? "bg-amber-600"
                  : "bg-sky-600"
              }`}
            >
              {btn}
            </div>
          ))}
        </div>
      );
    }

    const tekanTombol = (karakter: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setTombolAktifKeypad(karakter);
      setLayarKeypad((prev) => {
        if (karakter === "*") return ""; // Tombol * untuk Clear
        const gabung = (prev + karakter).slice(-6);
        return gabung;
      });
      const kodeNumerik =
        !isNaN(Number(karakter))
          ? Number(karakter)
          : karakter.charCodeAt(0);
      onInteraksiKomponen?.({ nyala: true, nilaiSensor: kodeNumerik });
      setTimeout(() => setTombolAktifKeypad(null), 180);
    };

    return (
      <div className="w-full h-full bg-slate-900 border-2 border-slate-600 rounded-b-xl p-1.5 flex flex-col justify-between select-none shadow-inner">
        {/* Layar Mini Digital Keypad (Menampilkan Angka/Huruf yang Ditekan) */}
        <div className="bg-emerald-950 border border-emerald-500/70 rounded-md px-2 py-0.5 flex justify-between items-center">
          <span className="text-[7px] font-mono text-emerald-400 uppercase">KEY:</span>
          <span className="text-[10px] font-mono font-black text-emerald-200 tracking-widest">
            {layarKeypad || "_"}
          </span>
        </div>

        {/* Grid 4x4 Tombol Fisik Keypad Membran */}
        <div className="grid grid-cols-4 gap-1 my-0.5 flex-1 items-center">
          {daftarTombol.map((k) => {
            const adalahHuruf = ["A", "B", "C", "D"].includes(k);
            const adalahSimbol = ["*", "#"].includes(k);
            const sedangDitekan = tombolAktifKeypad === k;

            return (
              <button
                key={k}
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => tekanTombol(k, e)}
                className={`h-full min-h-[15px] rounded text-[8.5px] font-black text-white shadow transition-transform cursor-pointer flex items-center justify-center border ${
                  sedangDitekan
                    ? "scale-90 ring-2 ring-yellow-300 bg-emerald-500 text-slate-950"
                    : adalahHuruf
                    ? "bg-rose-600 hover:bg-rose-500 border-rose-400"
                    : adalahSimbol
                    ? "bg-amber-600 hover:bg-amber-500 border-amber-400"
                    : "bg-sky-600 hover:bg-sky-500 border-sky-400"
                }`}
              >
                {k}
              </button>
            );
          })}
        </div>

        <div className="text-[6.5px] text-center font-bold text-slate-400 leading-none">
          Klik angka/huruf (* = Hapus)
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 2. POMPA AIR MINI DC (Saat Ditekan Jadi ON & Air Menyembur-nyembur)
  // ==========================================================================
  if (t.includes("pompa") || t.includes("pump")) {
    const pompaHidup = Boolean(nyala) && (nilaiSensor ?? 100) > 0;

    return (
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (!isIkon) {
            onInteraksiKomponen?.({
              nyala: !pompaHidup,
              nilaiSensor: !pompaHidup ? Math.max(80, nilaiSensor || 100) : 0,
            });
          }
        }}
        title="Klik Pompa untuk ON / OFF Semburan Air"
        className="w-full h-full flex items-center justify-center p-1 cursor-pointer relative overflow-visible"
      >
        {/* SEMBURAN AIR MANCUR MENYEMBUR KE ATAS SAAT POMPA ON */}
        {!isIkon && pompaHidup && (
          <div className="absolute -top-[58px] left-1/2 -translate-x-1/2 w-[110px] h-[62px] pointer-events-none z-40">
            <svg viewBox="0 0 110 65" className="w-full h-full overflow-visible">
              {/* Pancaran Jet Air Tengah & Samping */}
              <path
                d="M 55 62 Q 55 20 55 6"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <path
                d="M 55 60 Q 42 22 22 14"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3.5"
                strokeDasharray="5 3"
                className="animate-bounce"
              />
              <path
                d="M 55 60 Q 68 22 88 14"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3.5"
                strokeDasharray="5 3"
                className="animate-bounce"
              />
              <path
                d="M 55 60 Q 32 34 10 32"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 55 60 Q 78 34 100 32"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Butiran Air Menyembur (Droplets) */}
              <circle cx="55" cy="6" r="4" fill="#7dd3fc" className="animate-ping" />
              <circle cx="22" cy="14" r="3.5" fill="#38bdf8" className="animate-ping" />
              <circle cx="88" cy="14" r="3.5" fill="#38bdf8" className="animate-ping" />
              <circle cx="36" cy="10" r="3" fill="#bae6fd" className="animate-bounce" />
              <circle cx="74" cy="10" r="3" fill="#bae6fd" className="animate-bounce" />
              <rect
                x="24"
                y="-8"
                width="62"
                height="12"
                rx="4"
                fill="#0284c7"
              />
              <text
                x="55"
                y="0"
                fill="#ffffff"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
              >
                💦 MENYEMBUR!
              </text>
            </svg>
          </div>
        )}

        <svg viewBox="0 0 115 84" className={isIkon ? "w-12 h-10" : "w-full h-full"}>
          {/* Pipa Outlet Atas Tempat Air Keluar */}
          <rect
            x="48"
            y="2"
            width="14"
            height="18"
            rx="3"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {pompaHidup && (
            <circle cx="55" cy="5" r="4" fill="#38bdf8" className="animate-ping" />
          )}

          {/* Bodi Tabung Motor Pompa Submersible Putih-Krem & Biru */}
          <rect
            x="22"
            y="18"
            width="66"
            height="48"
            rx="10"
            fill={pompaHidup ? "#0284c7" : "#334155"}
            stroke={pompaHidup ? "#38bdf8" : "#64748b"}
            strokeWidth="2"
          />
          {/* Pipa Inlet Samping Kanan */}
          <rect
            x="86"
            y="34"
            width="18"
            height="12"
            rx="3"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Baling-Baling Impeller Turbin di Tengah Pompa */}
          <circle
            cx="55"
            cy="42"
            r="16"
            fill="#0f172a"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          <g
            className={pompaHidup ? "animate-spin" : ""}
            style={{ transformOrigin: "55px 42px", animationDuration: "450ms" }}
          >
            <line x1="55" y1="28" x2="55" y2="56" stroke="#38bdf8" strokeWidth="3.5" />
            <line x1="41" y1="42" x2="69" y2="42" stroke="#38bdf8" strokeWidth="3.5" />
            <circle cx="55" cy="42" r="4.5" fill="#fde047" />
          </g>

          {/* Status Klik ON / OFF */}
          <rect
            x="16"
            y="68"
            width="78"
            height="13"
            rx="4"
            fill={pompaHidup ? "#10b981" : "#1e293b"}
          />
          <text
            x="55"
            y="77"
            fill={pompaHidup ? "#022c22" : "#94a3b8"}
            fontSize="7.5"
            fontWeight="bold"
            textAnchor="middle"
          >
            {pompaHidup ? "POMPA ON (KLIK=OFF)" : "POMPA OFF (KLIK=ON)"}
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 3. RFID READER RC522 REALISTIS + ANIMASI KARTU TAG SAAT DETEKSI / DIKLIK
  // ==========================================================================
  if (t.includes("rfid") || t.includes("rc522")) {
    const kartuTerdeteksi = Boolean(nyala) && (nilaiSensor ?? 1) > 0;

    return (
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (!isIkon) {
            onInteraksiKomponen?.({
              nyala: !kartuTerdeteksi,
              nilaiSensor: !kartuTerdeteksi ? 1 : 0,
            });
          }
        }}
        title="Klik Modul RFID untuk Tap / Lepas Kartu Tag"
        className="w-full h-full flex items-center justify-center p-1 cursor-pointer relative overflow-visible"
      >
        <svg viewBox="0 0 120 86" className={isIkon ? "w-13 h-10" : "w-full h-full overflow-visible"}>
          {/* PCB Biru Tua Khas Modul RFID-RC522 */}
          <rect
            x="8"
            y="6"
            width="78"
            height="72"
            rx="6"
            fill="#172554"
            stroke={kartuTerdeteksi ? "#34d399" : "#3b82f6"}
            strokeWidth="2"
          />

          {/* Jalur Antena Melingkar (Spiral Copper Trace) Perak/Putih Khas RC522 */}
          <rect
            x="14"
            y="11"
            width="66"
            height="42"
            rx="5"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.4"
          />
          <rect
            x="18"
            y="15"
            width="58"
            height="34"
            rx="4"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.1"
          />
          <rect
            x="22"
            y="19"
            width="50"
            height="26"
            rx="3"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Chip IC MFRC522 Hitam di Tengah + Kristal Osilator Perak */}
          <rect
            x="39"
            y="25"
            width="16"
            height="14"
            rx="2"
            fill="#090d16"
            stroke="#64748b"
            strokeWidth="1"
          />
          <rect
            x="37"
            y="43"
            width="20"
            height="6"
            rx="3"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Gelombang Induksi Elektromagnetik saat Kartu Ditempel (Tagging) */}
          {kartuTerdeteksi && (
            <circle
              cx="47"
              cy="32"
              r="22"
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#10b981"
              strokeWidth="2"
              className="animate-ping"
            />
          )}

          {/* ANIMASI KARTU RFID PUTIH + GANTUNGAN KEYFOB BIRU */}
          <g
            style={{
              transform: kartuTerdeteksi
                ? "translate(-22px, -6px) rotate(-6deg)"
                : "translate(6px, 8px) rotate(8deg)",
              transition: "all 0.35s ease",
            }}
          >
            <rect
              x="64"
              y="16"
              width="50"
              height="32"
              rx="4"
              fill="#f8fafc"
              stroke={kartuTerdeteksi ? "#10b981" : "#64748b"}
              strokeWidth="2"
            />
            {/* Chip Kuning Emas & Simbol Wireless di Kartu */}
            <rect x="70" y="24" width="9" height="7" rx="1.5" fill="#facc15" />
            <text x="95" y="29" fill="#0f172a" fontSize="6" fontWeight="bold" textAnchor="middle">
              RFID TAG
            </text>
            <text x="90" y="40" fill="#0284c7" fontSize="5.5" fontWeight="bold" textAnchor="middle">
              {kartuTerdeteksi ? "✓ UID OK" : "TAP CARD"}
            </text>
          </g>

          <text
            x="47"
            y="71"
            fill={kartuTerdeteksi ? "#34d399" : "#93c5fd"}
            fontSize="7.5"
            fontWeight="bold"
            textAnchor="middle"
          >
            {kartuTerdeteksi ? "TAG TERDETEKSI!" : "RC522 (KLIK=TAP)"}
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 4. SENSOR PUPUK NPK TANAH (3-Probe Logam + Bar N-P-K & Animasi Ion Pupuk)
  // ==========================================================================
  if (t.includes("npk") || t.includes("pupuk")) {
    const nilaiN = Math.round(nilaiSensor);
    const nilaiP = Math.round(nilaiSensor * 0.65);
    const nilaiK = Math.round(nilaiSensor * 0.85);

    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 122 86" className={isIkon ? "w-13 h-10" : "w-full h-full"}>
          {/* Cross-section Lapisan Tanah Pertanian Cokelat Subur di Bawah */}
          <rect
            x="8"
            y="42"
            width="106"
            height="38"
            rx="6"
            fill="#451a03"
            stroke="#78350f"
            strokeWidth="1.5"
          />
          {/* Bodi Kepala Sensor NPK Hitam Industri (IP68) */}
          <rect
            x="14"
            y="8"
            width="52"
            height="22"
            rx="4"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.8"
          />
          <text x="40" y="21" fill="#fde047" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            NPK SENSOR
          </text>

          {/* 3 Garpu Probe Baja Stainless Menancap ke Tanah */}
          <rect x="22" y="30" width="4.5" height="38" rx="2" fill="#e2e8f0" />
          <rect x="38" y="30" width="4.5" height="38" rx="2" fill="#e2e8f0" />
          <rect x="54" y="30" width="4.5" height="38" rx="2" fill="#e2e8f0" />

          {/* Animasi Ion Hara Pupuk N (Hijau), P (Biru), K (Kuning) di Sekitar Probe */}
          {nyala && (
            <>
              <circle cx="30" cy="55" r="3" fill="#4ade80" className="animate-ping" />
              <circle cx="48" cy="60" r="3" fill="#38bdf8" className="animate-bounce" />
              <circle cx="62" cy="52" r="3" fill="#facc15" className="animate-pulse" />
            </>
          )}

          {/* Panel Bar Indikator Kadar N - P - K di Kanan */}
          <rect
            x="70"
            y="10"
            width="44"
            height="64"
            rx="4"
            fill="#090d16"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="75" y="23" fill="#4ade80" fontSize="7" fontWeight="bold">
            N: {nilaiN}
          </text>
          <text x="75" y="39" fill="#38bdf8" fontSize="7" fontWeight="bold">
            P: {nilaiP}
          </text>
          <text x="75" y="55" fill="#facc15" fontSize="7" fontWeight="bold">
            K: {nilaiK}
          </text>
          <text x="92" y="68" fill="#94a3b8" fontSize="6" fontWeight="bold" textAnchor="middle">
            mg/kg
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 5. SENSOR KELEMBAPAN TANAH (Garpu Emas YL-69 + Animasi Tanah Basah & Air)
  // ==========================================================================
  if (t.includes("soil") || t.includes("tanah")) {
    const persen = Math.max(0, Math.min(100, nilaiSensor));
    const warnaTanah =
      persen < 30 ? "#78350f" : persen < 65 ? "#451a03" : "#0c4a6e";

    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 120 86" className={isIkon ? "w-13 h-10" : "w-full h-full"}>
          {/* Pot Tanah & Air */}
          <rect
            x="10"
            y="40"
            width="100"
            height="40"
            rx="6"
            fill={warnaTanah}
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          {/* Lapisan Air Biru yang Naik Sesuai Persentase Kelembapan */}
          <rect
            x="12"
            y={78 - Math.round((persen / 100) * 34)}
            width="96"
            height={Math.max(4, Math.round((persen / 100) * 34))}
            rx="4"
            fill="#0284c7"
            opacity="0.55"
          />

          {/* Kepala PCB Merah/Biru Garpu Sensor YL-69 */}
          <rect
            x="24"
            y="8"
            width="46"
            height="20"
            rx="3"
            fill="#dc2626"
            stroke="#fca5a5"
            strokeWidth="1.5"
          />
          {/* 2 Kaki Garpu Konduktor Emas Menancap ke Tanah */}
          <rect
            x="30"
            y="28"
            width="9"
            height="42"
            rx="2"
            fill="#eab308"
            stroke="#fef08a"
            strokeWidth="1"
          />
          <rect
            x="55"
            y="28"
            width="9"
            height="42"
            rx="2"
            fill="#eab308"
            stroke="#fef08a"
            strokeWidth="1"
          />

          {/* Tetesan Air Jatuh & Nilai % */}
          {nyala && persen > 20 && (
            <>
              <circle cx="84" cy="24" r="3" fill="#38bdf8" className="animate-bounce" />
              <circle cx="96" cy="32" r="2.5" fill="#7dd3fc" className="animate-ping" />
            </>
          )}
          <text x="88" y="62" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
            {persen}%
          </text>
          <text x="88" y="72" fill="#7dd3fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">
            {persen < 35 ? "KERING" : "LEMBAP"}
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 6. SENSOR GAS MQ-135 & MQ-131 OZON
  // ==========================================================================
  if (tipe === "mq135_udara" || tipe === "mq131_ozon") {
    const isOzon = tipe === "mq131_ozon";
    const bahaya = nilaiSensor > (isOzon ? 120 : 400);
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 110 82" className={isIkon ? "w-12 h-10" : "w-full h-full"}>
          <rect
            x="8"
            y="8"
            width="94"
            height="64"
            rx="7"
            fill={isOzon ? "#312e81" : "#1e3a8a"}
            stroke={bahaya ? "#f43f5e" : "#60a5fa"}
            strokeWidth="2"
          />
          <circle cx="15" cy="15" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="95" cy="15" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="15" cy="65" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="95" cy="65" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />

          <circle
            cx="55"
            cy="38"
            r="23"
            fill="#475569"
            stroke="#e2e8f0"
            strokeWidth="2.5"
          />
          <circle
            cx="55"
            cy="38"
            r="17"
            fill="#94a3b8"
            stroke="#1e293b"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <line x1="40" y1="33" x2="70" y2="33" stroke="#334155" strokeWidth="1" />
          <line x1="38" y1="38" x2="72" y2="38" stroke="#334155" strokeWidth="1" />
          <line x1="40" y1="43" x2="70" y2="43" stroke="#334155" strokeWidth="1" />
          <line x1="50" y1="22" x2="50" y2="54" stroke="#334155" strokeWidth="1" />
          <line x1="55" y1="21" x2="55" y2="55" stroke="#334155" strokeWidth="1" />
          <line x1="60" y1="22" x2="60" y2="54" stroke="#334155" strokeWidth="1" />

          <circle cx="24" cy="48" r="3.5" fill={nyala ? "#22c55e" : "#334155"} />
          <circle cx="86" cy="48" r="3.5" fill={bahaya ? "#ef4444" : "#334155"} />
          <text x="55" y="68" fill="#fde047" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {isOzon ? `O3: ${nilaiSensor} ppb` : `MQ135: ${nilaiSensor} ppm`}
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 7. PZEM-004T WATTMETER AC
  // ==========================================================================
  if (tipe === "pzem004t_ac") {
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 120 82" className={isIkon ? "w-13 h-10" : "w-full h-full"}>
          <rect
            x="6"
            y="8"
            width="74"
            height="64"
            rx="5"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="2"
          />
          <rect x="10" y="22" width="14" height="36" rx="2" fill="#22c55e" stroke="#052e16" strokeWidth="1" />
          <circle cx="17" cy="29" r="2.5" fill="#cbd5e1" />
          <circle cx="17" cy="37" r="2.5" fill="#cbd5e1" />
          <circle cx="17" cy="45" r="2.5" fill="#cbd5e1" />
          <circle cx="17" cy="53" r="2.5" fill="#cbd5e1" />

          <rect x="30" y="18" width="22" height="14" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <text x="41" y="27" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="middle">
            PZEM-V3
          </text>
          <rect x="56" y="20" width="10" height="12" fill="#f8fafc" />
          <rect x="56" y="36" width="10" height="12" fill="#f8fafc" />

          <path d="M 24 46 Q 82 55 88 45" fill="none" stroke="#ef4444" strokeWidth="2" />
          <path d="M 24 52 Q 82 62 92 48" fill="none" stroke="#475569" strokeWidth="2" />

          <circle cx="98" cy="36" r="16" fill="none" stroke="#0284c7" strokeWidth="7" />
          <circle
            cx="98"
            cy="36"
            r="16"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeDasharray="6 3"
          />
          {nyala && nilaiSensor > 0 && (
            <text x="98" y="40" fontSize="12" textAnchor="middle" className="animate-pulse">
              ⚡
            </text>
          )}
          <text x="43" y="65" fill="#fde047" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {nilaiSensor}W • 220V
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 8. MAX30100 DETAK JANTUNG & SPO2
  // ==========================================================================
  if (tipe === "max30100_heart") {
    const durasiDetak = Math.max(260, Math.floor(60000 / Math.max(40, nilaiSensor)));
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 115 82" className={isIkon ? "w-12 h-10" : "w-full h-full"}>
          <rect
            x="10"
            y="8"
            width="95"
            height="64"
            rx="8"
            fill="#4c0519"
            stroke="#f43f5e"
            strokeWidth="2"
          />
          <circle cx="18" cy="16" r="3" fill="#0f172a" stroke="#fda4af" strokeWidth="1" />
          <circle cx="97" cy="16" r="3" fill="#0f172a" stroke="#fda4af" strokeWidth="1" />

          <rect
            x="38"
            y="20"
            width="38"
            height="26"
            rx="4"
            fill="#090d16"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <rect x="43" y="25" width="11" height="16" rx="2" fill="#1e293b" />
          <circle
            cx="65"
            cy="33"
            r="6"
            fill="#ef4444"
            className={nyala ? "animate-ping" : ""}
            style={{ animationDuration: `${durasiDetak}ms` }}
          />
          <circle cx="65" cy="33" r="4" fill="#fca5a5" />

          <polyline
            points="18,56 34,56 39,48 44,64 49,44 54,60 60,56 96,56"
            fill="none"
            stroke="#fb7185"
            strokeWidth="2"
          />
          <text x="57" y="69" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            ♥ {nilaiSensor} BPM (98%)
          </text>
        </svg>
      </div>
    );
  }

  // ==========================================================================
  // 9. KELOMPOK SENSOR AIR & LINGKUNGAN (pH, TDS, Turbidity, DO, BOD, COD, DS18B20)
  // ==========================================================================
  const configAir: Record<
    string,
    { judul: string; unit: string; warnaAir: string; warnaBoard: string }
  > = {
    sensor_ph: {
      judul: "pH E-201C",
      unit: "pH",
      warnaAir:
        nilaiSensor < 5.5
          ? "#ef4444"
          : nilaiSensor < 6.5
          ? "#f59e0b"
          : nilaiSensor <= 8.5
          ? "#10b981"
          : "#8b5cf6",
      warnaBoard: "#1e3a8a",
    },
    sensor_tds: {
      judul: "TDS METER",
      unit: "ppm",
      warnaAir: "#0284c7",
      warnaBoard: "#0f172a",
    },
    sensor_turbidity: {
      judul: "TURBIDITY",
      unit: "NTU",
      warnaAir: nilaiSensor > 35 ? "#78350f" : nilaiSensor > 15 ? "#b45309" : "#38bdf8",
      warnaBoard: "#1e293b",
    },
    sensor_do: {
      judul: "OKSIGEN DO",
      unit: "mg/L",
      warnaAir: "#0ea5e9",
      warnaBoard: "#0c4a6e",
    },
    sensor_bod: {
      judul: "LIMBAH BOD",
      unit: "mg/L",
      warnaAir: "#059669",
      warnaBoard: "#064e3b",
    },
    sensor_cod: {
      judul: "KIMIA COD",
      unit: "mg/L",
      warnaAir: "#9333ea",
      warnaBoard: "#3b0764",
    },
    ds18b20_air: {
      judul: "DS18B20",
      unit: "°C",
      warnaAir: nilaiSensor >= 50 ? "#e11d48" : nilaiSensor <= 10 ? "#38bdf8" : "#0284c7",
      warnaBoard: "#1e293b",
    },
  };

  const infoAir = configAir[tipe] || configAir.sensor_ph;

  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <svg viewBox="0 0 122 82" className={isIkon ? "w-13 h-10" : "w-full h-full"}>
        <rect
          x="6"
          y="12"
          width="54"
          height="58"
          rx="5"
          fill={infoAir.warnaBoard}
          stroke="#64748b"
          strokeWidth="1.8"
        />
        <rect x="12" y="18" width="12" height="12" rx="2" fill="#2563eb" stroke="#93c5fd" strokeWidth="1" />
        <circle cx="18" cy="24" r="3" fill="#e2e8f0" />
        <rect x="28" y="8" width="14" height="8" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

        <path d="M 35 8 Q 65 -4 88 14" fill="none" stroke="#334155" strokeWidth="3" />

        <rect
          x="70"
          y="20"
          width="42"
          height="50"
          rx="4"
          fill="#090d16"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <rect
          x="72"
          y="32"
          width="38"
          height="36"
          rx="2"
          fill={infoAir.warnaAir}
          opacity="0.85"
        />
        <rect x="85" y="12" width="7" height="44" rx="3" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
        <circle cx="88.5" cy="56" r="4" fill="#38bdf8" />

        {nyala && (
          <>
            <circle cx="79" cy="58" r="2.2" fill="#ffffff" className="animate-ping" />
            <circle cx="99" cy="50" r="2.5" fill="#fde047" className="animate-bounce" />
            <circle cx="84" cy="44" r="1.8" fill="#ffffff" className="animate-pulse" />
          </>
        )}

        <text x="33" y="46" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          {infoAir.judul}
        </text>
        <text x="33" y="61" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
          {nilaiSensor} {infoAir.unit}
        </text>
      </svg>
    </div>
  );
}

// ============================================================================
// OVERLAY ANIMASI FISIK INTERAKTIF DI SEKITAR KOMPONEN KANVAS SAAT PARAMETER DIGESER
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

  // 1. SENSOR GERAK PIR (HC-SR501): ORANG BERJALAN DI BAGIAN ATAS KUBAH PUTIH PIR
  if (t.includes("pir") || t.includes("sr501")) {
    const posLangkah = Math.max(0, Math.min(300, nilaiSensor));
    const geserX = ((posLangkah % 120) / 120) * 58 + 12;
    const langkahGenap = Math.floor(posLangkah) % 2 === 0;
    const terdeteksi = nyala && posLangkah > 0 && posLangkah <= 220;

    return (
      <div className="absolute -top-[78px] left-1/2 -translate-x-1/2 w-[124px] h-[78px] pointer-events-none z-40">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 78">
          <polygon
            points="60,76 8,6 112,6"
            fill={
              terdeteksi
                ? "rgba(244, 63, 94, 0.25)"
                : "rgba(16, 185, 129, 0.14)"
            }
            stroke={terdeteksi ? "#fb7185" : "#34d399"}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <path
            d="M 42 64 Q 60 50 78 64 M 30 50 Q 60 32 90 50"
            fill="none"
            stroke={terdeteksi ? "#f43f5e" : "#38bdf8"}
            strokeWidth="1.8"
            className={nyala ? "animate-pulse" : ""}
          />
          <g transform={`translate(${geserX}, 12)`}>
            <rect
              x="-16"
              y="-13"
              width="42"
              height="11"
              rx="4"
              fill="#0f172a"
              stroke={terdeteksi ? "#f43f5e" : "#10b981"}
              strokeWidth="1"
            />
            <text
              x="5"
              y="-5"
              fill={terdeteksi ? "#fda4af" : "#6ee7b7"}
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
            >
              {terdeteksi ? `GERAK ${posLangkah}cm` : "AMAN"}
            </text>
            <circle cx="5" cy="4" r="5" fill={terdeteksi ? "#fb7185" : "#38bdf8"} />
            <line
              x1="5"
              y1="9"
              x2="5"
              y2="25"
              stroke={terdeteksi ? "#fb7185" : "#38bdf8"}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="13"
              x2={langkahGenap ? "-4" : "14"}
              y2="21"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="13"
              x2={langkahGenap ? "14" : "-4"}
              y2="21"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="25"
              x2={langkahGenap ? "-3" : "13"}
              y2="39"
              stroke={terdeteksi ? "#fda4af" : "#7dd3fc"}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="25"
              x2={langkahGenap ? "13" : "-3"}
              y2="39"
              stroke={terdeteksi ? "#e11d48" : "#0284c7"}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. SENSOR ULTRASONIK HC-SR04 & IR OBSTACLE: ORANG BERJALAN MENDEKAT/MENJAUH
  if (t.includes("ultrason") || t.includes("sr04") || t.includes("obstacle")) {
    const jarakCm = Math.max(2, Math.min(400, nilaiSensor));
    const offsetPx = Math.min(92, Math.max(10, (jarakCm / 220) * 85));
    const langkahGenap = Math.floor(jarakCm) % 2 === 0;
    const dekatTerdeteksi = jarakCm <= 120 && nyala;

    return (
      <div className="absolute -right-[108px] top-1/2 -translate-y-1/2 w-[105px] h-[84px] pointer-events-none z-30">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 110 86">
          <polygon
            points={`0,43 ${offsetPx + 16},8 ${offsetPx + 16},78`}
            fill={
              dekatTerdeteksi
                ? "rgba(244, 63, 94, 0.24)"
                : "rgba(56, 189, 248, 0.15)"
            }
          />
          <path
            d="M 6 30 Q 15 43 6 56 M 15 23 Q 26 43 15 63"
            fill="none"
            stroke={dekatTerdeteksi ? "#fb7185" : "#38bdf8"}
            strokeWidth="2.2"
            className={nyala ? "animate-pulse" : ""}
          />
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
            <circle cx="4" cy="4" r="5.5" fill={dekatTerdeteksi ? "#fb7185" : "#38bdf8"} />
            <line
              x1="4"
              y1="10"
              x2="4"
              y2="29"
              stroke={dekatTerdeteksi ? "#fb7185" : "#38bdf8"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
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

  // 3. SENSOR API (FLAME KY-026): ANIMASI API MEMBARA BERLAPIS
  if (t.includes("flame") || t.includes("api")) {
    const intensitas = Math.max(0, Math.min(100, nilaiSensor));
    const skalaApi = 0.55 + (intensitas / 100) * 0.85;

    return (
      <div className="absolute -top-[68px] left-1/2 -translate-x-1/2 w-[90px] h-[68px] pointer-events-none z-40 flex flex-col items-center justify-end">
        <svg
          viewBox="0 0 80 70"
          className="w-full h-full overflow-visible"
          style={{
            transform: `scale(${skalaApi})`,
            transformOrigin: "bottom center",
          }}
        >
          <circle
            cx="40"
            cy="42"
            r="26"
            fill="rgba(249, 115, 22, 0.28)"
            className="animate-pulse"
          />
          <path
            d="M 40 6 C 58 24, 66 42, 54 58 C 46 66, 34 66, 26 58 C 14 42, 22 24, 40 6 Z"
            fill="#ea580c"
            className="animate-bounce"
            style={{ animationDuration: "650ms" }}
          />
          <path
            d="M 40 18 C 52 32, 56 44, 48 56 C 43 62, 37 62, 32 56 C 24 44, 28 32, 40 18 Z"
            fill="#f59e0b"
          />
          <path
            d="M 40 30 C 46 40, 48 48, 44 55 C 41 59, 39 59, 36 55 C 32 48, 34 40, 40 30 Z"
            fill="#fef08a"
            className="animate-ping"
            style={{ animationDuration: "900ms" }}
          />
          <circle cx="26" cy="20" r="2" fill="#fde047" className="animate-ping" />
          <circle cx="55" cy="16" r="2.5" fill="#fb923c" className="animate-bounce" />
        </svg>
      </div>
    );
  }

  // 4. SENSOR CAHAYA (LDR): TRANSISI CAHAYA REDUP <-> TERANG BENDERANG
  if (t.includes("ldr") || t.includes("cahaya") || t.includes("light")) {
    const lux = Math.max(0, Math.min(1000, nilaiSensor));
    const rasioTerang = lux / 1000;

    return (
      <div className="absolute -top-[68px] left-1/2 -translate-x-1/2 w-[110px] h-[66px] pointer-events-none z-40 flex items-center justify-center">
        <div
          style={{
            backgroundColor:
              rasioTerang < 0.25
                ? "rgba(15, 23, 42, 0.92)"
                : rasioTerang < 0.6
                ? "rgba(120, 53, 15, 0.75)"
                : "rgba(254, 240, 138, 0.85)",
            boxShadow:
              rasioTerang > 0.3
                ? `0 0 ${Math.round(rasioTerang * 38)}px ${Math.round(
                    rasioTerang * 16
                  )}px rgba(250, 204, 21, ${0.25 + rasioTerang * 0.55})`
                : "none",
          }}
          className="px-3 py-1.5 rounded-2xl border border-amber-400/60 flex items-center gap-2 transition-all duration-300"
        >
          {rasioTerang < 0.22 ? (
            <span className="text-base">🌙</span>
          ) : (
            <div
              style={{
                transform: `scale(${0.75 + rasioTerang * 0.55})`,
                opacity: 0.4 + rasioTerang * 0.6,
              }}
              className="w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-300 flex items-center justify-center text-xs transition-all"
            >
              ☀️
            </div>
          )}
          <div className="leading-tight">
            <div
              className={`text-[9px] font-black ${
                rasioTerang > 0.55 ? "text-slate-950" : "text-amber-300"
              }`}
            >
              {lux} Lux
            </div>
            <div
              className={`text-[7px] font-bold ${
                rasioTerang > 0.55 ? "text-slate-800" : "text-slate-300"
              }`}
            >
              {rasioTerang < 0.22
                ? "GELAP"
                : rasioTerang < 0.6
                ? "REDUP"
                : "TERANG"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. ANIMASI HUJAN
  if (t.includes("hujan") || t.includes("rain")) {
    return (
      <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 bg-slate-950/90 border border-sky-500/60 px-2.5 py-1 rounded-xl">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-3 rounded-full bg-sky-400 animate-bounce" />
          <span
            className="w-1.5 h-3 rounded-full bg-sky-300 animate-bounce"
            style={{ animationDelay: "140ms" }}
          />
          <span
            className="w-1.5 h-3 rounded-full bg-sky-400 animate-bounce"
            style={{ animationDelay: "280ms" }}
          />
        </div>
        <span className="text-[8px] font-black text-sky-300 mt-0.5">
          🌧️ {nilaiSensor}%
        </span>
      </div>
    );
  }

  // 6. ANIMASI KEPULAN ASAP GAS MQ-2 / MQ-135 / OZON O3
  if (t.includes("mq") || t.includes("gas") || t.includes("ozon")) {
    const pekat = nilaiSensor > 300;
    return (
      <div className="absolute -top-[46px] left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none z-30">
        <span
          className={`w-4 h-4 rounded-full ${
            pekat ? "bg-rose-500/60" : "bg-slate-400/50"
          } animate-ping`}
        />
        <span
          className={`w-5 h-5 rounded-full ${
            pekat ? "bg-orange-500/60" : "bg-slate-300/50"
          } animate-bounce`}
        />
        <span
          className={`w-3.5 h-3.5 rounded-full ${
            pekat ? "bg-rose-400/60" : "bg-slate-400/50"
          } animate-ping`}
        />
      </div>
    );
  }

  return null;
}