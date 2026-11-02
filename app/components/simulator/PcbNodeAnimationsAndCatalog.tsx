"use client";

import React from "react";

export interface PinDef {
  id: string;
  label: string;
  sisi: "KIRI" | "KANAN" | "BAWAH";
  fungsi: string;
}

export interface KomponenKatalogItem {
  tipe: string;
  nama: string;
  kategori: "MCU" | "SENSOR" | "AKTUATOR" | "MODUL";
  badgePin: string;
  satuan: string;
  minVal: number;
  maxVal: number;
  defaultVal: number;
  lebar: number;
  tinggi: number;
  pins: PinDef[];
}

export const KATALOG_KOMPONEN_PCB: KomponenKatalogItem[] = [
  {
    tipe: "ESP32_DEVKIT",
    nama: "ESP32 DevKit V1 (30-Pin)",
    kategori: "MCU",
    badgePin: "30P",
    satuan: "MHz",
    minVal: 80,
    maxVal: 240,
    defaultVal: 240,
    lebar: 155,
    tinggi: 240,
    pins: [
      { id: "EN", label: "EN", sisi: "KIRI", fungsi: "Enable / Reset Chip ESP32" },
      { id: "VP", label: "VP", sisi: "KIRI", fungsi: "GPIO36 / ADC1_CH0 Input" },
      { id: "VN", label: "VN", sisi: "KIRI", fungsi: "GPIO39 / ADC1_CH3 Input" },
      { id: "34", label: "34", sisi: "KIRI", fungsi: "GPIO34 / ADC1_CH6 Input" },
      { id: "35", label: "35", sisi: "KIRI", fungsi: "GPIO35 / ADC1_CH7 Input" },
      { id: "32", label: "32", sisi: "KIRI", fungsi: "GPIO32 / ADC1_CH4 / Touch9" },
      { id: "33", label: "33", sisi: "KIRI", fungsi: "GPIO33 / ADC1_CH5 / Touch8" },
      { id: "25", label: "25", sisi: "KIRI", fungsi: "GPIO25 / DAC1 / ADC2" },
      { id: "26", label: "26", sisi: "KIRI", fungsi: "GPIO26 / DAC2 / ADC2" },
      { id: "27", label: "27", sisi: "KIRI", fungsi: "GPIO27 / ADC2 / Touch7" },
      { id: "14", label: "14", sisi: "KIRI", fungsi: "GPIO14 / HSPI_CLK" },
      { id: "12", label: "12", sisi: "KIRI", fungsi: "GPIO12 / HSPI_MISO" },
      { id: "13", label: "13", sisi: "KIRI", fungsi: "GPIO13 / HSPI_MOSI" },
      { id: "GND1", label: "GND", sisi: "KIRI", fungsi: "Ground (0V)" },
      { id: "VIN", label: "VIN", sisi: "KIRI", fungsi: "Input Tegangan 5V USB/Ext" },
      { id: "23", label: "23", sisi: "KANAN", fungsi: "GPIO23 / VSPI_MOSI" },
      { id: "22", label: "22", sisi: "KANAN", fungsi: "GPIO22 / I2C SCL" },
      { id: "TX0", label: "TX0", sisi: "KANAN", fungsi: "GPIO1 / UART0 TX" },
      { id: "RX0", label: "RX0", sisi: "KANAN", fungsi: "GPIO3 / UART0 RX" },
      { id: "21", label: "21", sisi: "KANAN", fungsi: "GPIO21 / I2C SDA" },
      { id: "19", label: "19", sisi: "KANAN", fungsi: "GPIO19 / VSPI_MISO" },
      { id: "18", label: "18", sisi: "KANAN", fungsi: "GPIO18 / VSPI_CLK" },
      { id: "D5", label: "D5", sisi: "KANAN", fungsi: "GPIO5 / VSPI_CS0" },
      { id: "TX2", label: "TX2", sisi: "KANAN", fungsi: "GPIO17 / UART2 TX" },
      { id: "RX2", label: "RX2", sisi: "KANAN", fungsi: "GPIO16 / UART2 RX" },
      { id: "D4", label: "D4", sisi: "KANAN", fungsi: "GPIO4 / ADC2 / Touch0" },
      { id: "D2", label: "D2", sisi: "KANAN", fungsi: "GPIO2 / Onboard LED" },
      { id: "15", label: "15", sisi: "KANAN", fungsi: "GPIO15 / ADC2 / Touch3" },
      { id: "GND2", label: "GND", sisi: "KANAN", fungsi: "Ground (0V)" },
      { id: "3V3", label: "3V3", sisi: "KANAN", fungsi: "Output Tegangan 3.3V" },
    ],
  },
  {
    tipe: "ULTRASONIK_HCSR04",
    nama: "Ultrasonik HC-SR04",
    kategori: "SENSOR",
    badgePin: "4P",
    satuan: "cm",
    minVal: 2,
    maxVal: 400,
    defaultVal: 28,
    lebar: 125,
    tinggi: 90,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: " Daya 5V" },
      { id: "TRIG", label: "TRIG", sisi: "BAWAH", fungsi: "Trigger Pulse Input" },
      { id: "ECHO", label: "ECHO", sisi: "BAWAH", fungsi: "Echo Pulse Output" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "PIR_HCSR501",
    nama: "Sensor Gerak PIR",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "cm",
    minVal: 0,
    maxVal: 300,
    defaultVal: 45,
    lebar: 115,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "OUT", label: "OUT", sisi: "BAWAH", fungsi: "Digital Motion Output" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_PH_AIR",
    nama: "Sensor pH Air (E-201C)",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "pH",
    minVal: 0,
    maxVal: 14,
    defaultVal: 7,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "PO", label: "PO", sisi: "BAWAH", fungsi: "Analog pH Output" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_TDS",
    nama: "Sensor TDS Meter Air",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "ppm",
    minVal: 0,
    maxVal: 1000,
    defaultVal: 185,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 3.3V - 5V" },
      { id: "AOUT", label: "AO", sisi: "BAWAH", fungsi: "Analog TDS Signal" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "MAX30100_HEART",
    nama: "MAX30100 Heart & SpO2",
    kategori: "SENSOR",
    badgePin: "4P",
    satuan: "BPM",
    minVal: 40,
    maxVal: 180,
    defaultVal: 82,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VIN", label: "VIN", sisi: "BAWAH", fungsi: "Daya 3.3V/5V" },
      { id: "SCL", label: "SCL", sisi: "BAWAH", fungsi: "I2C Clock" },
      { id: "SDA", label: "SDA", sisi: "BAWAH", fungsi: "I2C Data" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "DS18B20_SUHU_AIR",
    nama: "Suhu Air DS18B20 Waterproof",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "°C",
    minVal: -10,
    maxVal: 100,
    defaultVal: 29,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 3.3V/5V" },
      { id: "DQ", label: "DQ", sisi: "BAWAH", fungsi: "1-Wire Data" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_TURBIDITY",
    nama: "Sensor Turbidity (Kekeruhan)",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "NTU",
    minVal: 0,
    maxVal: 100,
    defaultVal: 12,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "AO", sisi: "BAWAH", fungsi: "Output Kekeruhan" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_DO_OKSIGEN",
    nama: "Sensor DO (Oksigen Terlarut)",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "mg/L",
    minVal: 0,
    maxVal: 20,
    defaultVal: 8,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "DO", sisi: "BAWAH", fungsi: "Dissolved Oxygen Out" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_BOD",
    nama: "Sensor BOD (Biochemical O2)",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "mg/L",
    minVal: 0,
    maxVal: 150,
    defaultVal: 18,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "BOD", sisi: "BAWAH", fungsi: "Analog BOD Out" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_COD",
    nama: "Sensor COD (Chemical O2)",
    kategori: "SENSOR",
    badgePin: "3P",
    satuan: "mg/L",
    minVal: 0,
    maxVal: 300,
    defaultVal: 42,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "COD", sisi: "BAWAH", fungsi: "Analog COD Out" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_MQ135",
    nama: "Sensor Gas MQ-135 (CO2/NH3)",
    kategori: "SENSOR",
    badgePin: "4P",
    satuan: "PPM",
    minVal: 50,
    maxVal: 1000,
    defaultVal: 320,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "AO", sisi: "BAWAH", fungsi: "Analog PPM Out" },
      { id: "DOUT", label: "DO", sisi: "BAWAH", fungsi: "Digital Threshold" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_OZON_O3",
    nama: "Sensor Ozon O3 (MQ-131)",
    kategori: "SENSOR",
    badgePin: "4P",
    satuan: "PPB",
    minVal: 0,
    maxVal: 500,
    defaultVal: 65,
    lebar: 125,
    tinggi: 95,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "AOUT", label: "AO", sisi: "BAWAH", fungsi: "Analog O3 Out" },
      { id: "DOUT", label: "DO", sisi: "BAWAH", fungsi: "Digital Alarm" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SENSOR_PZEM004T",
    nama: "PZEM-004T Watt/Energi AC",
    kategori: "SENSOR",
    badgePin: "4P",
    satuan: "Watt",
    minVal: 0,
    maxVal: 2200,
    defaultVal: 450,
    lebar: 130,
    tinggi: 95,
    pins: [
      { id: "5V", label: "5V", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "RX", label: "RX", sisi: "BAWAH", fungsi: "UART RX" },
      { id: "TX", label: "TX", sisi: "BAWAH", fungsi: "UART TX" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "RELAY_1CH",
    nama: "Relay Aktuator 1CH 5V",
    kategori: "AKTUATOR",
    badgePin: "3P",
    satuan: "State",
    minVal: 0,
    maxVal: 1,
    defaultVal: 1,
    lebar: 115,
    tinggi: 100,
    pins: [
      { id: "VCC", label: "VCC", sisi: "BAWAH", fungsi: "Daya 5V" },
      { id: "IN", label: "IN", sisi: "BAWAH", fungsi: "Trigger Relay" },
      { id: "GND", label: "GND", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
  {
    tipe: "SOLENOID_LOCK",
    nama: "Solenoid Gerbang 12V",
    kategori: "AKTUATOR",
    badgePin: "2P",
    satuan: "Lock",
    minVal: 0,
    maxVal: 1,
    defaultVal: 1,
    lebar: 115,
    tinggi: 95,
    pins: [
      { id: "12V", label: "12V+", sisi: "BAWAH", fungsi: "Tegangan Aktuator" },
      { id: "GND", label: "GND-", sisi: "BAWAH", fungsi: "Ground" },
    ],
  },
];

// ============================================================================
// KOMPONEN VISUAL & ANIMASI SPESIFIK TIAP SENSOR DI ATAS KANVAS PCB
// ============================================================================
export function RenderVisualDanAnimasiKomponen({
  tipe,
  nilai,
  aktifHigh,
  sedangRun,
}: {
  tipe: string;
  nilai: number;
  aktifHigh: boolean;
  sedangRun: boolean;
}) {
  // 1. ULTRASONIK HC-SR04 & PIR HC-SR501 -> ANIMASI ORANG BERJALAN MENDEKAT/MENJAUH
  if (tipe === "ULTRASONIK_HCSR04" || tipe === "PIR_HCSR501") {
    const jarakPx = Math.min(82, Math.max(8, (nilai / 250) * 75));
    const langkahGenap = Math.floor(nilai) % 2 === 0;
    const terdeteksi = nilai < 120 && aktifHigh;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Visual Chip Sensor */}
        {tipe === "ULTRASONIK_HCSR04" ? (
          <div className="w-24 h-12 bg-sky-600 rounded-lg border border-sky-300 flex flex-col items-center justify-center shadow-inner">
            <div className="text-[7px] font-black text-white leading-none mb-0.5">
              HC-SR04 SONAR
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-400" />
              <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-400" />
            </div>
            <div className="text-[9px] font-black text-amber-300 leading-none mt-0.5">
              {nilai} cm
            </div>
          </div>
        ) : (
          <div className="w-24 h-12 bg-emerald-950 rounded-lg border border-emerald-500 flex flex-col items-center justify-center">
            <div
              className={`w-10 h-5 rounded-t-full border transition ${
                terdeteksi
                  ? "bg-rose-500 border-white shadow-lg shadow-rose-500/60"
                  : "bg-rose-700/80 border-rose-400"
              }`}
            />
            <div className="text-[8px] font-black text-emerald-300 mt-0.5">
              PIR HC-SR501 ({nilai}cm)
            </div>
          </div>
        )}

        {/* OVERLAY ANIMASI ORANG BERJALAN & GELOMBANG RADAR SAAT PARAMETER DIGESER / RUN */}
        <div className="absolute -right-24 top-0 w-24 h-20 pointer-events-none flex items-center">
          {/* Gelombang Pancaran Sensor */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 80">
            <polygon
              points={`0,40 ${jarakPx + 15},10 ${jarakPx + 15},70`}
              fill={
                terdeteksi
                  ? "rgba(244, 63, 94, 0.22)"
                  : "rgba(56, 189, 248, 0.14)"
              }
            />
            <path
              d={`M 8 28 Q 16 40 8 52 M 18 22 Q 28 40 18 58`}
              fill="none"
              stroke={terdeteksi ? "#fb7185" : "#38bdf8"}
              strokeWidth="2"
              className={sedangRun ? "animate-ping" : ""}
            />

            {/* Karakter Orang Berjalan yang Bergerak Sesuai Slider Parameter */}
            <g transform={`translate(${jarakPx}, 18)`}>
              {/* Label Jarak di atas kepala */}
              <rect x="-14" y="-14" width="36" height="11" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="4" y="-6" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle">
                {nilai}cm
              </text>
              {/* Kepala Orang */}
              <circle
                cx="4"
                cy="4"
                r="5.5"
                fill={terdeteksi ? "#fb7185" : "#38bdf8"}
              />
              {/* Badan */}
              <line
                x1="4"
                y1="10"
                x2="4"
                y2="28"
                stroke={terdeteksi ? "#fb7185" : "#38bdf8"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Ayunan Tangan */}
              <line
                x1="4"
                y1="14"
                x2={langkahGenap ? "-5" : "13"}
                y2="23"
                stroke="#f8fafc"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="14"
                x2={langkahGenap ? "13" : "-5"}
                y2="23"
                stroke="#94a3b8"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {/* Ayunan Kaki Berjalan */}
              <line
                x1="4"
                y1="28"
                x2={langkahGenap ? "-4" : "12"}
                y2="43"
                stroke={terdeteksi ? "#fda4af" : "#7dd3fc"}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="28"
                x2={langkahGenap ? "12" : "-4"}
                y2="43"
                stroke={terdeteksi ? "#f43f5e" : "#0284c7"}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // 2. SENSOR pH AIR -> ANIMASI TABUNG REAKSI BERUBAH WARNA ASAM-BASA + GELEMBUNG
  if (tipe === "SENSOR_PH_AIR") {
    const warnaPh =
      nilai < 5
        ? "#ef4444" // Asam Kuat (Merah)
        : nilai < 6.5
        ? "#f59e0b" // Asam Lemah (Kuning/Oranye)
        : nilai <= 8.5
        ? "#10b981" // Netral (Hijau)
        : "#8b5cf6"; // Basa / Alkali (Ungu)

    return (
      <div className="w-24 h-12 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-around px-2">
        <div className="relative w-7 h-10 rounded-b-lg border border-slate-500 overflow-hidden flex items-end bg-slate-950">
          <div
            style={{
              height: `${Math.max(25, (nilai / 14) * 100)}%`,
              backgroundColor: warnaPh,
            }}
            className="w-full transition-all duration-300"
          />
          <span className="absolute inset-x-0 bottom-1 text-[7px] font-black text-white text-center drop-shadow">
            pH
          </span>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-black text-white">{nilai} pH</div>
          <div className="text-[7px] font-bold" style={{ color: warnaPh }}>
            {nilai < 6.5 ? "ASAM" : nilai <= 8.5 ? "NETRAL" : "BASA"}
          </div>
        </div>
      </div>
    );
  }

  // 3. SENSOR TDS -> ANIMASI PARTIKEL MINERAL PADAT TERLARUT DI AIR
  if (tipe === "SENSOR_TDS") {
    const jumlahPartikel = Math.min(12, Math.max(2, Math.floor(nilai / 80)));
    return (
      <div className="w-24 h-12 bg-sky-950 rounded-lg border border-sky-500/60 p-1.5 flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-center z-10">
          <span className="text-[7px] font-black text-sky-300">TDS METER</span>
          <span className="text-[9px] font-black text-amber-300">{nilai} ppm</span>
        </div>
        <div className="flex flex-wrap gap-1 items-center justify-center z-10 py-0.5">
          {Array.from({ length: jumlahPartikel }).map((_, idx) => (
            <span
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"
              style={{ animationDuration: `${900 + idx * 120}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // 4. MAX30100 HEART RATE -> ANIMASI DETAK JANTUNG & GELOMBANG EKG
  if (tipe === "MAX30100_HEART") {
    return (
      <div className="w-24 h-12 bg-rose-950/90 rounded-lg border border-rose-500 p-1.5 flex items-center justify-between">
        <div
          className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-black animate-ping"
          style={{ animationDuration: `${Math.max(300, Math.floor(60000 / Math.max(40, nilai)))}ms` }}
        >
          ♥
        </div>
        <div className="text-right">
          <div className="text-[11px] font-black text-white leading-none">{nilai}</div>
          <div className="text-[7px] font-black text-rose-300">BPM / SpO2</div>
        </div>
      </div>
    );
  }

  // 5. SUHU AIR DS18B20 -> ANIMASI TERMOMETER AIR MENDIDIH / BEKU
  if (tipe === "DS18B20_SUHU_AIR") {
    const warnaSuhu = nilai >= 50 ? "#f43f5e" : nilai <= 10 ? "#38bdf8" : "#10b981";
    return (
      <div className="w-24 h-12 bg-slate-900 rounded-lg border border-slate-700 p-1.5 flex items-center justify-between">
        <div className="w-4 h-9 bg-slate-950 rounded-full border border-slate-600 p-0.5 flex items-end">
          <div
            style={{
              height: `${Math.min(100, Math.max(15, ((nilai + 10) / 110) * 100))}%`,
              backgroundColor: warnaSuhu,
            }}
            className="w-full rounded-full transition-all"
          />
        </div>
        <div className="text-right">
          <div className="text-[11px] font-black text-white">{nilai}°C</div>
          <div className="text-[7px] font-bold text-sky-300">
            {nilai >= 60 ? "UAP PANAS" : nilai <= 5 ? "BEKU" : "AIR NORMAL"}
          </div>
        </div>
      </div>
    );
  }

  // 6. TURBIDITY / DO / BOD / COD -> ANIMASI KEKERUHAN, OKSIGEN & REAKSI KIMIA AIR
  if (
    tipe === "SENSOR_TURBIDITY" ||
    tipe === "SENSOR_DO_OKSIGEN" ||
    tipe === "SENSOR_BOD" ||
    tipe === "SENSOR_COD"
  ) {
    const labelMap: Record<string, { judul: string; unit: string; warna: string }> = {
      SENSOR_TURBIDITY: { judul: "TURBIDITY", unit: "NTU", warna: "#d97706" },
      SENSOR_DO_OKSIGEN: { judul: "OKSIGEN DO", unit: "mg/L", warna: "#38bdf8" },
      SENSOR_BOD: { judul: "LIMBAH BOD", unit: "mg/L", warna: "#10b981" },
      SENSOR_COD: { judul: "KIMIA COD", unit: "mg/L", warna: "#a855f7" },
    };
    const info = labelMap[tipe];

    return (
      <div
        className="w-24 h-12 rounded-lg border p-1.5 flex flex-col justify-between relative overflow-hidden"
        style={{
          backgroundColor: "#0f172a",
          borderColor: info.warna,
        }}
      >
        <div
          style={{
            opacity: Math.min(0.85, Math.max(0.15, nilai / 100)),
            backgroundColor: info.warna,
          }}
          className="absolute inset-0 transition-opacity animate-pulse"
        />
        <div className="relative z-10 flex justify-between items-center">
          <span className="text-[7px] font-black text-white">{info.judul}</span>
          <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
        </div>
        <div className="relative z-10 text-[10px] font-black text-white text-right">
          {nilai} {info.unit}
        </div>
      </div>
    );
  }

  // 7. SENSOR GAS MQ-135 & OZON O3 -> ANIMASI KEPULAN ASAP & MOLEKUL O3
  if (tipe === "SENSOR_MQ135" || tipe === "SENSOR_OZON_O3") {
    const bahaya = nilai > 250;
    return (
      <div
        className={`w-24 h-12 rounded-lg border p-1.5 flex flex-col justify-between relative overflow-hidden ${
          bahaya
            ? "bg-rose-950/90 border-rose-400"
            : "bg-indigo-950/90 border-indigo-400"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-[7px] font-black text-white">
            {tipe === "SENSOR_OZON_O3" ? "OZON O3" : "GAS MQ-135"}
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              bahaya ? "bg-rose-400 animate-ping" : "bg-emerald-400"
            }`}
          />
        </div>
        <div className="text-[10px] font-black text-amber-300 text-right">
          {nilai} {tipe === "SENSOR_OZON_O3" ? "PPB" : "PPM"}
        </div>
      </div>
    );
  }

  // 8. SENSOR LISTRIK PZEM-004T -> ANIMASI ARUS LISTRIK AC & WATT
  if (tipe === "SENSOR_PZEM004T") {
    return (
      <div className="w-28 h-12 bg-amber-950/90 rounded-lg border border-amber-400 p-1.5 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-[7px] font-black text-amber-300">PZEM-004T AC</span>
          <span className="text-[7px] font-black px-1 rounded bg-amber-400 text-slate-950 animate-pulse">
            220V
          </span>
        </div>
        <div className="text-[10px] font-black text-white text-right">
          ⚡ {nilai} Watt
        </div>
      </div>
    );
  }

  // 9. RELAY & SOLENOID -> ANIMASI KONTAK SAKLAR / KUNCI GERBANG
  if (tipe === "RELAY_1CH" || tipe === "SOLENOID_LOCK") {
    const nyala = nilai > 0 && aktifHigh;
    return (
      <div
        className={`w-24 h-12 rounded-lg border p-1.5 flex flex-col items-center justify-center ${
          nyala
            ? "bg-emerald-950/90 border-emerald-400"
            : "bg-slate-900 border-slate-700"
        }`}
      >
        <div className="text-[8px] font-black text-white">
          {tipe === "SOLENOID_LOCK"
            ? nyala
              ? "🔓 UNLOCKED"
              : "🔒 LOCKED"
            : nyala
            ? "⚡ CH1: NO (ON)"
            : "CH1: NC (OFF)"}
        </div>
        <div className="text-[7px] text-emerald-300 mt-0.5">
          {nyala ? "12V/5V Aktif" : "Standby"}
        </div>
      </div>
    );
  }

  return null;
}