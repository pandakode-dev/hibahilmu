"use client";

import React from "react";

const WARNA_GELANG_RESISTOR: {
  [angka: number]: { nama: string; hex: string };
} = {
  0: { nama: "Hitam", hex: "#0f172a" },
  1: { nama: "Cokelat", hex: "#78350f" },
  2: { nama: "Merah", hex: "#dc2626" },
  3: { nama: "Oranye", hex: "#ea580c" },
  4: { nama: "Kuning", hex: "#facc15" },
  5: { nama: "Hijau", hex: "#16a34a" },
  6: { nama: "Biru", hex: "#2563eb" },
  7: { nama: "Ungu", hex: "#9333ea" },
  8: { nama: "Abu-abu", hex: "#64748b" },
  9: { nama: "Putih", hex: "#f8fafc" },
};

const WARNA_PENGALI: { [eksponen: number]: { nama: string; hex: string } } = {
  [-2]: { nama: "Perak (0.01x)", hex: "#cbd5e1" },
  [-1]: { nama: "Emas (0.1x)", hex: "#eab308" },
  0: { nama: "Hitam (1x)", hex: "#0f172a" },
  1: { nama: "Cokelat (10x)", hex: "#78350f" },
  2: { nama: "Merah (100x)", hex: "#dc2626" },
  3: { nama: "Oranye (1kΩ)", hex: "#ea580c" },
  4: { nama: "Kuning (10kΩ)", hex: "#facc15" },
  5: { nama: "Hijau (100kΩ)", hex: "#16a34a" },
  6: { nama: "Biru (1MΩ)", hex: "#2563eb" },
};

export function hitungGelangWarnaResistor(nilaiOhm: number) {
  const bersih = Math.max(1, Math.round(nilaiOhm));
  const teks = bersih.toString();

  let digit1 = 1;
  let digit2 = 0;
  let pengali = 0;

  if (bersih < 10) {
    digit1 = bersih;
    digit2 = 0;
    pengali = -1;
  } else {
    digit1 = parseInt(teks[0], 10) || 1;
    digit2 = parseInt(teks[1], 10) || 0;
    pengali = Math.max(0, Math.min(6, teks.length - 2));
  }

  const gelang1 = WARNA_GELANG_RESISTOR[digit1] || WARNA_GELANG_RESISTOR[1];
  const gelang2 = WARNA_GELANG_RESISTOR[digit2] || WARNA_GELANG_RESISTOR[0];
  const gelangPengali = WARNA_PENGALI[pengali] || WARNA_PENGALI[2];
  const gelangToleransi = { nama: "Emas (±5%)", hex: "#eab308" };

  return {
    gelang1,
    gelang2,
    gelangPengali,
    gelangToleransi,
    labelSingkat:
      bersih >= 1000000
        ? `${(bersih / 1000000).toFixed(1)} MΩ`
        : bersih >= 1000
        ? `${(bersih / 1000).toFixed(1)} kΩ`
        : `${bersih} Ω`,
  };
}

// Helper untuk menghasilkan teks telemetri di atas komponen tanpa menabrak header
export function ambilTeksTelemetriKomponen(
  tipe: string,
  nilaiSensor = 28,
  nyala = true
): string | null {
  if (!nyala && ["solenoid_lock", "water_pump", "battery_socket"].includes(tipe)) {
    return tipe === "solenoid_lock"
      ? "🔒 LOCKED (OFF)"
      : tipe === "water_pump"
      ? "⏹ POMPA MATI"
      : "🔋 SWITCH OFF (0V)";
  }
  switch (tipe) {
    case "esp32_c6":
      return nyala ? "📡 Wi-Fi 6 • Zigbee • Thread" : null;
    case "gps_neo6m": {
      const lat = (-0.5071 + nilaiSensor * 0.0001).toFixed(4);
      const lon = (101.4478 + nilaiSensor * 0.0001).toFixed(4);
      return `🛰️ ${lat}, ${lon} (${nilaiSensor} km/h)`;
    }
    case "battery_socket": {
      const persen = Math.max(5, Math.min(100, Math.round(((nilaiSensor - 3.0) / 9.6) * 100)));
      return `🔋 OUT: ${nilaiSensor}V DC (${persen}%)`;
    }
    case "voltage_sensor": {
      const vOut = (nilaiSensor / 5).toFixed(2);
      return `⚡ Vin: ${nilaiSensor}V ➔ Pin S: ${vOut}V`;
    }
    case "dht22":
      return nilaiSensor >= 33
        ? `🔥 PANAS (${nilaiSensor}°C)`
        : nilaiSensor <= 18
        ? `❄️ DINGIN (${nilaiSensor}°C)`
        : `🌡️ Suhu: ${nilaiSensor}°C | Lembap: 65%`;
    case "solenoid_lock":
      return "🔓 UNLOCKED (12V Aktif)";
    case "water_pump":
      return "💦 POMPA MENYEMBUR (ON)";
    case "ldr_sensor":
      return `☀️ Cahaya: ${nilaiSensor} Lux`;
    case "mq2_gas":
      return `💨 Gas LPG: ${nilaiSensor} ppm`;
    case "flame_sensor":
      return nilaiSensor >= 50 ? `🔥 API TERDETEKSI (${nilaiSensor}%)` : `Aman (${nilaiSensor}%)`;
    case "soil_moisture":
      return `💧 Kelembapan Tanah: ${nilaiSensor}%`;
    case "rain_sensor":
      return `🌧️ Curah Hujan: ${nilaiSensor}%`;
    default:
      return null;
  }
}

interface ResistorSvgProps {
  nilaiOhm: number;
  ukuran?: "ikon" | "kecil" | "besar";
}

export const ResistorVisualSvg: React.FC<ResistorSvgProps> = ({
  nilaiOhm,
  ukuran = "besar",
}) => {
  const info = hitungGelangWarnaResistor(nilaiOhm);

  const kelasUkuran =
    ukuran === "besar"
      ? "w-48 h-16"
      : ukuran === "kecil"
      ? "w-full h-full"
      : "w-20 h-8";

  return (
    <div className="inline-flex flex-col items-center justify-center w-full h-full select-none">
      <svg viewBox="0 0 140 64" className={kelasUkuran}>
        <line x1="6" y1="32" x2="32" y2="32" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
        <line x1="108" y1="32" x2="134" y2="32" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
        <rect x="30" y="16" width="80" height="32" rx="8" fill="#f3e5ab" stroke="#b45309" strokeWidth="2" />
        <rect x="42" y="16" width="8" height="32" fill={info.gelang1.hex} />
        <rect x="56" y="16" width="8" height="32" fill={info.gelang2.hex} />
        <rect x="70" y="16" width="8" height="32" fill={info.gelangPengali.hex} />
        <rect x="92" y="16" width="7" height="32" fill={info.gelangToleransi.hex} />
        <text x="70" y="59" textAnchor="middle" fill="#eab308" fontSize="9.5" fontFamily="monospace" fontWeight="900">
          {info.labelSingkat}
        </text>
      </svg>
    </div>
  );
};

export const VisualKomponenRealistis: React.FC<{
  tipe: string;
  nilaiResistor?: number;
  nyala?: boolean;
  nilaiSensor?: number;
  ukuran?: "ikon" | "kanvas";
}> = ({
  tipe,
  nilaiResistor = 1000,
  nyala = true,
  nilaiSensor = 28,
  ukuran = "kanvas",
}) => {
  const isIkon = ukuran === "ikon";

  if (tipe === "resistor") {
    return (
      <ResistorVisualSvg
        nilaiOhm={nilaiResistor}
        ukuran={isIkon ? "ikon" : "kecil"}
      />
    );
  }

  // 1. ESP32-C6-DEVKITC-1
  if (tipe === "esp32_c6") {
    return (
      <svg viewBox="0 0 160 225" className={isIkon ? "w-14 h-14" : "w-full h-full"}>
        <rect
          x="16"
          y="8"
          width="128"
          height="209"
          rx="8"
          fill="#042f2e"
          stroke="#14b8a6"
          strokeWidth="2.5"
        />
        <rect x="44" y="12" width="72" height="18" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="38" y="34" width="84" height="72" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
        <text x="80" y="62" textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="900">
          ESP32-C6-WROOM-1
        </text>
        <text x="80" y="76" textAnchor="middle" fill="#0f766e" fontSize="7" fontWeight="900">
          RISC-V 160MHz SoC
        </text>
        <text x="80" y="90" textAnchor="middle" fill="#334155" fontSize="6.5" fontWeight="bold">
          Wi-Fi 6 + BLE 5 + 802.15.4
        </text>

        {nyala && (
          <circle cx="80" cy="126" r="12" fill="#a855f7" opacity="0.4" className="animate-ping" />
        )}
        <rect x="73" y="119" width="14" height="14" rx="3" fill="#f8fafc" stroke="#9333ea" strokeWidth="1.5" />
        <circle cx="80" cy="126" r="4.5" fill={nyala ? "#ec4899" : "#475569"} />
        <text x="80" y="144" textAnchor="middle" fill="#f0abfc" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
          RGB GPIO8
        </text>

        <rect x="38" y="176" width="18" height="12" rx="2" fill="#cbd5e1" />
        <text x="47" y="173" textAnchor="middle" fill="#99f6e4" fontSize="5.5" fontWeight="bold">
          RST
        </text>
        <rect x="104" y="176" width="18" height="12" rx="2" fill="#cbd5e1" />
        <text x="113" y="173" textAnchor="middle" fill="#99f6e4" fontSize="5.5" fontWeight="bold">
          BOOT
        </text>

        <rect x="44" y="201" width="30" height="15" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
        <rect x="86" y="201" width="30" height="15" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
        <text x="59" y="198" textAnchor="middle" fill="#cbd5e1" fontSize="5" fontFamily="monospace">
          USB-C
        </text>
        <text x="101" y="198" textAnchor="middle" fill="#cbd5e1" fontSize="5" fontFamily="monospace">
          UART-C
        </text>

        {["3V3", "RST", "G0", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G10", "G11", "G12", "G13", "GND"].map(
          (lbl, idx) => (
            <text
              key={`c6l-${idx}`}
              x="22"
              y={29 + idx * 13}
              fill="#ccfbf1"
              fontSize="6.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {lbl}
            </text>
          )
        )}
        {["5V", "TX0", "RX0", "G18", "G19", "G20", "G21", "G22", "G23", "G15", "G14", "G9", "G8", "GND", "GND"].map(
          (lbl, idx) => (
            <text
              key={`c6r-${idx}`}
              x="138"
              y={29 + idx * 13}
              textAnchor="end"
              fill="#fde047"
              fontSize="6.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {lbl}
            </text>
          )
        )}
      </svg>
    );
  }

  // 2. MODUL GPS NEO-6M U-BLOX
  if (tipe === "gps_neo6m") {
    return (
      <svg viewBox="0 0 145 115" className={isIkon ? "w-18 h-14" : "w-full h-full"}>
        <rect
          x="10"
          y="6"
          width="125"
          height="78"
          rx="6"
          fill="#1e3a8a"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <rect x="18" y="16" width="48" height="38" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
        <text x="42" y="32" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="900">
          u-blox
        </text>
        <text x="42" y="43" textAnchor="middle" fill="#1d4ed8" fontSize="7" fontWeight="900">
          NEO-6M-0
        </text>

        <rect
          x="74"
          y="14"
          width="52"
          height="48"
          rx="5"
          fill="#d6d3d1"
          stroke="#b45309"
          strokeWidth="2.5"
        />
        <rect x="81" y="21" width="38" height="34" rx="3" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1.5" />
        <circle cx="100" cy="38" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <path d="M 66 26 Q 72 10, 82 22" stroke="#1e293b" strokeWidth="2.5" fill="none" />

        {nyala && <circle cx="28" cy="66" r="7" fill="#22c55e" opacity="0.4" className="animate-ping" />}
        <circle cx="28" cy="66" r="3.5" fill={nyala ? "#22c55e" : "#334155"} />
        <text x="50" y="69" fill="#93c5fd" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          PPS FIX
        </text>

        {["PPS", "RXD", "TXD", "GND", "VCC"].map((lbl, idx) => {
          const xPos = 25 + idx * 24;
          return (
            <g key={lbl}>
              <line x1={xPos} y1="84" x2={xPos} y2="108" stroke="#eab308" strokeWidth="3.5" />
              <text
                x={xPos}
                y="79"
                textAnchor="middle"
                fill="#fde047"
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {lbl}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // 3. SOCKET HOLDER BATERAI 2x 18650 LI-ION
  if (tipe === "battery_socket") {
    const voltase = nilaiSensor ?? 8.4;
    const persenBaterai = Math.max(5, Math.min(100, Math.round(((voltase - 3.0) / 9.6) * 100)));

    return (
      <svg viewBox="0 0 135 105" className={isIkon ? "w-18 h-14" : "w-full h-full"}>
        <rect
          x="10"
          y="6"
          width="115"
          height="68"
          rx="8"
          fill="#0f172a"
          stroke={nyala ? "#f59e0b" : "#475569"}
          strokeWidth="2.5"
        />
        <rect x="18" y="13" width="94" height="22" rx="5" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="112" y="18" width="5" height="12" rx="1.5" fill="#eab308" />
        <rect
          x="21"
          y="16"
          width={Math.max(8, (persenBaterai / 100) * 86)}
          height="16"
          rx="3"
          fill="#22c55e"
          opacity="0.55"
        />
        <text x="65" y="27" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900">
          LI-ION 18650 • {(voltase / 2).toFixed(1)}V
        </text>

        <rect x="23" y="41" width="94" height="22" rx="5" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="18" y="46" width="5" height="12" rx="1.5" fill="#eab308" />
        <rect
          x="26"
          y="44"
          width={Math.max(8, (persenBaterai / 100) * 86)}
          height="16"
          rx="3"
          fill="#22c55e"
          opacity="0.55"
        />
        <text x="70" y="55" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="900">
          TOTAL: {voltase}V DC
        </text>

        <line x1="42" y1="74" x2="42" y2="98" stroke="#ef4444" strokeWidth="4.5" />
        <line x1="94" y1="74" x2="94" y2="98" stroke="#64748b" strokeWidth="4.5" />
        <text x="26" y="90" fill="#ef4444" fontSize="7.5" fontFamily="monospace" fontWeight="900">
          BAT+
        </text>
        <text x="106" y="90" fill="#64748b" fontSize="7.5" fontFamily="monospace" fontWeight="900">
          BAT-
        </text>
      </svg>
    );
  }

  // 4. SENSOR TEGANGAN DC 0-25V
  if (tipe === "voltage_sensor") {
    return (
      <svg viewBox="0 0 120 112" className={isIkon ? "w-16 h-14" : "w-full h-full"}>
        <rect
          x="14"
          y="10"
          width="92"
          height="78"
          rx="6"
          fill="#1d4ed8"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <rect x="26" y="12" width="68" height="22" rx="3" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
        <circle cx="38" cy="23" r="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
        <line x1="34" y1="23" x2="42" y2="23" stroke="#0f172a" strokeWidth="2" />
        <circle cx="82" cy="23" r="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
        <line x1="78" y1="23" x2="86" y2="23" stroke="#0f172a" strokeWidth="2" />
        <text x="38" y="42" textAnchor="middle" fill="#fde047" fontSize="6.5" fontWeight="900">
          VCC(+)
        </text>
        <text x="82" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="6.5" fontWeight="900">
          GND(-)
        </text>

        <rect x="28" y="48" width="26" height="12" rx="2" fill="#0f172a" stroke="#94a3b8" />
        <text x="41" y="57" textAnchor="middle" fill="#38bdf8" fontSize="6" fontFamily="monospace" fontWeight="bold">
          303 (30k)
        </text>
        <rect x="66" y="48" width="26" height="12" rx="2" fill="#0f172a" stroke="#94a3b8" />
        <text x="79" y="57" textAnchor="middle" fill="#34d399" fontSize="6" fontFamily="monospace" fontWeight="bold">
          752 (7.5k)
        </text>

        <text x="60" y="72" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900">
          VOLTAGE 0-25V
        </text>

        {[
          { lbl: "S", x: 32 },
          { lbl: "+", x: 60 },
          { lbl: "-", x: 88 },
        ].map((p) => (
          <g key={p.lbl}>
            <line x1={p.x} y1="88" x2={p.x} y2="104" stroke="#eab308" strokeWidth="3.5" />
            <text
              x={p.x}
              y="84"
              textAnchor="middle"
              fill="#fde047"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="900"
            >
              {p.lbl}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // 5. ESP32 DevKit V1 & NodeMCU
  if (tipe === "esp32" || tipe === "esp8266_nodemcu") {
    const isEsp32 = tipe === "esp32";
    return (
      <svg viewBox="0 0 160 225" className={isIkon ? "w-14 h-14" : "w-full h-full"}>
        <rect x="16" y="8" width="128" height="209" rx="8" fill={isEsp32 ? "#0f172a" : "#1e293b"} stroke="#475569" strokeWidth="2.5" />
        <rect x="44" y="12" width="72" height="18" rx="3" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
        <rect x="38" y="34" width="84" height="72" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        <text x="80" y="66" textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="900">
          {isEsp32 ? "ESP-WROOM-32" : "ESP8266EX MOD"}
        </text>
        <text x="80" y="80" textAnchor="middle" fill="#334155" fontSize="7.5" fontWeight="bold">
          30-PIN DEVKIT V1
        </text>
        <text x="80" y="94" textAnchor="middle" fill="#0284c7" fontSize="7" fontWeight="bold">
          Wi-Fi + Dual UART
        </text>
        <rect x="64" y="132" width="32" height="28" rx="3" fill="#020617" stroke="#475569" />
        <text x="80" y="149" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
          CP2102
        </text>
        <rect x="38" y="182" width="18" height="12" rx="2" fill="#cbd5e1" />
        <rect x="104" y="182" width="18" height="12" rx="2" fill="#cbd5e1" />
        <rect x="62" y="202" width="36" height="15" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="52" cy="122" r="4" fill="#ef4444" />
        {nyala && <circle cx="108" cy="122" r="9" fill="#38bdf8" opacity="0.35" className="animate-ping" />}
        <circle cx="108" cy="122" r="4" fill={nyala ? "#38bdf8" : "#334155"} />
        {["EN", "VP", "VN", "34", "35", "32", "33", "25", "26", "27", "14", "12", "13", "GND", "VIN"].map((lbl, idx) => (
          <text key={`l-${idx}`} x="22" y={29 + idx * 13} fill="#cbd5e1" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
            {lbl}
          </text>
        ))}
        {["23", "22", "TX0", "RX0", "21", "19", "18", "D5", "TX2", "RX2", "D4", "D2", "15", "GND", "3V3"].map((lbl, idx) => (
          <text key={`r-${idx}`} x="138" y={29 + idx * 13} textAnchor="end" fill="#fde047" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
            {lbl}
          </text>
        ))}
      </svg>
    );
  }

  // 6. STM32 BluePill & Raspberry Pi Pico
  if (tipe === "stm32_bluepill" || tipe === "raspberry_pico") {
    const isPico = tipe === "raspberry_pico";
    return (
      <svg viewBox="0 0 150 225" className={isIkon ? "w-14 h-14" : "w-full h-full"}>
        <rect x="16" y="8" width="118" height="209" rx="8" fill={isPico ? "#15803d" : "#1d4ed8"} stroke="#93c5fd" strokeWidth="2" />
        <rect x="45" y="75" width="60" height="60" rx="5" fill="#0f172a" stroke="#475569" />
        <text x="75" y="103" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="900">
          {isPico ? "RP2040" : "STM32F103"}
        </text>
        <text x="75" y="116" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
          ARM CORTEX
        </text>
        <rect x="57" y="6" width="36" height="14" rx="2" fill="#cbd5e1" />
        {nyala && <circle cx="75" cy="42" r="5" fill="#4ade80" className="animate-pulse" />}
      </svg>
    );
  }

  // 7. Arduino Uno R3
  if (tipe === "arduino_uno") {
    return (
      <svg viewBox="0 0 195 140" className={isIkon ? "w-20 h-12" : "w-full h-full"}>
        <rect x="10" y="14" width="175" height="112" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
        <rect x="2" y="30" width="20" height="28" rx="3" fill="#cbd5e1" stroke="#475569" />
        <rect x="2" y="82" width="22" height="24" rx="3" fill="#0f172a" />
        <rect x="68" y="72" width="92" height="26" rx="3" fill="#0f172a" stroke="#475569" />
        <text x="114" y="88" textAnchor="middle" fill="#f8fafc" fontSize="8" fontFamily="monospace" fontWeight="bold">
          ATMEGA328P-PU
        </text>
        <text x="105" y="45" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="900">
          ARDUINO UNO R3
        </text>
        <text x="105" y="58" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
          Atas: D13..D0(RX/TX) | Bawah: 5V, GND, A0..A5
        </text>
        <circle cx="42" cy="45" r="3" fill="#22c55e" />
        <circle cx="42" cy="56" r="3" fill={nyala ? "#facc15" : "#334155"} className={nyala ? "animate-ping" : ""} />
        <circle cx="52" cy="56" r="3" fill={nyala ? "#f97316" : "#334155"} className={nyala ? "animate-pulse" : ""} />
      </svg>
    );
  }

  // 8. Modul Relay 1-Ch, 2-Ch, dan 4-Ch
  if (tipe === "relay_1ch" || tipe === "relay_5v" || tipe === "relay_2ch" || tipe === "relay_4ch") {
    const jmlCh = tipe === "relay_4ch" ? 4 : tipe === "relay_2ch" ? 2 : 1;
    const lebarSvg = jmlCh === 4 ? 220 : jmlCh === 2 ? 150 : 110;
    const tinggiSvg = jmlCh === 4 ? 124 : jmlCh === 2 ? 120 : 115;

    return (
      <svg
        viewBox={`0 0 ${lebarSvg} ${tinggiSvg}`}
        className={isIkon ? "w-20 h-12" : "w-full h-full"}
      >
        <rect
          x="8"
          y="10"
          width={lebarSvg - 16}
          height={tinggiSvg - 20}
          rx="6"
          fill="#7f1d1d"
          stroke={nyala ? "#34d399" : "#f87171"}
          strokeWidth="2"
        />
        {Array.from({ length: jmlCh }).map((_, chIdx) => {
          const offsetX =
            jmlCh === 1
              ? 18
              : jmlCh === 2
              ? 14 + chIdx * 66
              : 12 + chIdx * 50;
          const lebarKotak = jmlCh === 4 ? 42 : jmlCh === 2 ? 56 : 74;

          return (
            <g key={chIdx}>
              <rect
                x={offsetX + 2}
                y="12"
                width={lebarKotak - 4}
                height="16"
                rx="2"
                fill="#16a34a"
                stroke="#86efac"
                strokeWidth="1"
              />
              <rect
                x={offsetX}
                y="32"
                width={lebarKotak}
                height="48"
                rx="4"
                fill="#1d4ed8"
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              <circle cx={offsetX + lebarKotak / 2} cy="66" r="3" fill="#facc15" />
              <line
                x1={offsetX + lebarKotak / 2}
                y1="66"
                x2={
                  nyala
                    ? offsetX + lebarKotak / 2 - 10
                    : offsetX + lebarKotak / 2 + 10
                }
                y2="46"
                stroke={nyala ? "#4ade80" : "#94a3b8"}
                strokeWidth="2.5"
              />
              <text
                x={offsetX + lebarKotak / 2}
                y="43"
                textAnchor="middle"
                fill="#ffffff"
                fontSize={jmlCh === 4 ? "6.5" : "7.5"}
                fontWeight="900"
              >
                CH{chIdx + 1}: {nyala ? "NO (ON)" : "NC (OFF)"}
              </text>
              <circle
                cx={offsetX + lebarKotak / 2}
                cy="88"
                r="3.5"
                fill={nyala ? "#ef4444" : "#334155"}
              />
            </g>
          );
        })}
        <text
          x={lebarSvg / 2}
          y={tinggiSvg - 15}
          textAnchor="middle"
          fill="#fde047"
          fontSize="7"
          fontFamily="monospace"
          fontWeight="bold"
        >
          RELAY {jmlCh}CH 5V OPTO
        </text>
      </svg>
    );
  }

  // 9. Solenoid Door Lock 12V
  if (tipe === "solenoid_lock") {
    const terbuka = nyala;
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect
          x="18"
          y="14"
          width="66"
          height="50"
          rx="6"
          fill="#334155"
          stroke={terbuka ? "#34d399" : "#94a3b8"}
          strokeWidth="2.5"
        />
        <rect x="26" y="22" width="44" height="34" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
        <g
          style={{
            transform: terbuka ? "translateX(-16px)" : "translateX(0px)",
            transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <polygon
            points="84,24 114,24 114,48 84,54"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="2"
          />
        </g>
        <text x="48" y="42" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="900">
          SOLENOID 12V
        </text>
        <line x1="38" y1="64" x2="38" y2="90" stroke="#ef4444" strokeWidth="4" />
        <line x1="82" y1="64" x2="82" y2="90" stroke="#64748b" strokeWidth="4" />
        <text x="27" y="82" fill="#ef4444" fontSize="7" fontWeight="bold">
          12V+
        </text>
        <text x="92" y="82" fill="#64748b" fontSize="7" fontWeight="bold">
          GND-
        </text>
      </svg>
    );
  }

  // 10. Pompa Air Mini
  if (tipe === "water_pump") {
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect
          x="22"
          y="14"
          width="76"
          height="50"
          rx="8"
          fill="#0284c7"
          stroke={nyala ? "#34d399" : "#7dd3fc"}
          strokeWidth="2.5"
        />
        <rect x="52" y="2" width="16" height="14" rx="3" fill="#e2e8f0" />
        <text x="60" y="38" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          MINI WATER PUMP
        </text>
        <text x="60" y="50" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
          {nyala ? "STATUS: ON (AKTIF)" : "STATUS: OFF (MATI)"}
        </text>
        <line x1="38" y1="64" x2="38" y2="90" stroke="#ef4444" strokeWidth="4" />
        <line x1="82" y1="64" x2="82" y2="90" stroke="#64748b" strokeWidth="4" />
        <text x="27" y="82" fill="#ef4444" fontSize="7" fontWeight="bold">
          VCC+
        </text>
        <text x="92" y="82" fill="#64748b" fontSize="7" fontWeight="bold">
          GND-
        </text>
      </svg>
    );
  }

  // 11. Sensor Infrared (IR) Obstacle Avoidance
  if (tipe === "ir_obstacle") {
    const jarakCm = nilaiSensor ?? 8;
    const terhalang = nyala && jarakCm <= 15;
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="34" y="6" width="14" height="14" rx="7" fill="#1e1b4b" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="72" y="6" width="14" height="14" rx="7" fill="#0f172a" stroke="#f87171" strokeWidth="1.5" />
        <rect x="20" y="18" width="80" height="46" rx="5" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
        <circle cx="35" cy="48" r="4" fill="#22c55e" />
        <circle cx="85" cy="48" r="4" fill={terhalang ? "#ef4444" : "#334155"} />
        <text x="60" y="38" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          IR OBSTACLE ({jarakCm}cm)
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 12. Sensor Api (Flame Sensor KY-026)
  if (tipe === "flame_sensor") {
    const intensitasApi = nilaiSensor ?? 80;
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="20" y="18" width="80" height="46" rx="5" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
        <circle cx="60" cy="14" r="8" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
        <text x="60" y="44" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          FLAME ({intensitasApi}%)
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 13. Kipas DC & Motor DC
  if (tipe === "kipas_dc" || tipe === "dc_motor") {
    const pwmVal = nilaiSensor ?? 200;
    const aktifBerputar = nyala && pwmVal > 10;

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="24" y="6" width="72" height="60" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="60" cy="36" r="24" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <g
          className={aktifBerputar ? "animate-spin" : ""}
          style={{
            transformOrigin: "60px 36px",
            animationDuration: `${Math.max(0.2, 1.5 - (pwmVal / 255) * 1.2)}s`,
          }}
        >
          <ellipse cx="60" cy="20" rx="6" ry="12" fill="#38bdf8" />
          <ellipse cx="60" cy="52" rx="6" ry="12" fill="#38bdf8" />
          <ellipse cx="44" cy="36" rx="12" ry="6" fill="#0284c7" />
          <ellipse cx="76" cy="36" rx="12" ry="6" fill="#0284c7" />
          <circle cx="60" cy="36" r="6" fill="#facc15" />
        </g>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="66" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 14. Soil Moisture, Raindrop & Water Level
  if (tipe === "soil_moisture" || tipe === "rain_sensor" || tipe === "water_level") {
    const kadarAir = Math.max(0, Math.min(100, nilaiSensor ?? 65));
    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-18 h-12" : "w-full h-full"}>
        <rect x="20" y="8" width="100" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        {[35, 52, 70, 88, 105].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="56" stroke="#eab308" strokeWidth="3.5" />
        ))}
        <rect
          x="22"
          y={64 - (kadarAir / 100) * 48}
          width="96"
          height={(kadarAir / 100) * 48}
          fill="#0ea5e9"
          opacity="0.45"
        />
        {[40, 60, 80, 100].slice(0, tipe === "water_level" ? 3 : 4).map((x, idx) => (
          <line key={idx} x1={x} y1="66" x2={x} y2="88" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 15. RFID RC522
  if (tipe === "rfid_rc522") {
    return (
      <svg viewBox="0 0 130 100" className={isIkon ? "w-18 h-12" : "w-full h-full"}>
        <rect x="10" y="6" width="110" height="66" rx="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
        <rect x="20" y="14" width="90" height="44" rx="4" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="65" y="36" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="900">
          RFID RC522
        </text>
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={20 + i * 18} y1="72" x2={20 + i * 18} y2="92" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // 16. Sensor Suhu DHT22 (4 Pin Kaki Asli di Bawah)
  if (tipe === "dht22") {
    const suhu = nilaiSensor ?? 28.5;
    const isPanas = suhu >= 33;
    const isDingin = suhu <= 18;
    const tinggiAirRaksa = Math.max(4, Math.min(44, ((suhu + 40) / 120) * 44));

    return (
      <svg viewBox="0 0 100 115" className={isIkon ? "w-14 h-12" : "w-full h-full"}>
        <rect x="12" y="6" width="62" height="72" rx="6" fill="#f8fafc" stroke={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#94a3b8"} strokeWidth="2.5" />
        {[18, 29, 40, 51].map((y) => (
          <line key={y} x1="20" y1={y} x2="66" y2={y} stroke="#cbd5e1" strokeWidth="3" />
        ))}
        <rect x="78" y="12" width="10" height="52" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <rect x="80" y={60 - tinggiAirRaksa} width="6" height={tinggiAirRaksa} rx="3" fill={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#22c55e"} />
        <circle cx="83" cy="64" r="6" fill={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#22c55e"} />
        <text x="43" y="70" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontWeight="900">
          {suhu}°C
        </text>
        {[23, 41, 59, 77].map((x, idx) => (
          <g key={idx}>
            <line x1={x} y1="78" x2={x} y2="108" stroke="#eab308" strokeWidth="3.5" />
            <text x={x} y="92" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="bold">
              {idx === 0 ? "VCC" : idx === 1 ? "DAT" : idx === 2 ? "NC" : "GND"}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // 17. Sensor Ultrasonik HC-SR04
  if (tipe === "ultrasonik") {
    const jarakCm = Math.max(2, Math.min(400, nilaiSensor ?? 45));
    const dekatSekali = jarakCm <= 40;

    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full"}>
        <rect x="8" y="6" width="124" height="58" rx="6" fill="#1d4ed8" stroke={dekatSekali && !isIkon ? "#ef4444" : "#60a5fa"} strokeWidth="2.5" />
        <circle cx="38" cy="35" r="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="38" cy="35" r="11" fill="#334155" />
        <circle cx="102" cy="35" r="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="102" cy="35" r="11" fill="#334155" />
        <text x="70" y="21" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900">
          HC-SR04 SONAR
        </text>
        <text x="70" y="56" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="900">
          {jarakCm} cm
        </text>
        {[43, 61, 79, 97].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="88" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 18. Sensor Gerak PIR
  if (tipe === "pir_sensor") {
    const sudutOrang = nilaiSensor ?? 0;
    const terdeteksi = nyala && sudutOrang >= -35 && sudutOrang <= 35;

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="18" y="28" width="84" height="36" rx="5" fill="#15803d" stroke={terdeteksi ? "#ef4444" : "#4ade80"} strokeWidth="2.5" />
        <path d="M 35 28 A 25 22 0 0 1 85 28 Z" fill={terdeteksi ? "#ef4444" : "#f8fafc"} stroke="#cbd5e1" strokeWidth="2" />
        <text x="60" y="50" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          PIR HC-SR501
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 19. Sensor Cahaya LDR
  if (tipe === "ldr_sensor") {
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="18" y="10" width="84" height="54" rx="6" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
        <circle cx="60" cy="37" r="18" fill="#fef3c7" stroke="#dc2626" strokeWidth="3" />
        <path d="M 48 31 L 72 31 L 48 37 L 72 37 L 48 43 L 72 43" stroke="#dc2626" strokeWidth="2.5" fill="none" />
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 20. Layar OLED / LCD 16x2 / MQ-2 Gas
  if (tipe === "oled_display" || tipe === "lcd_16x2" || tipe === "mq2_gas") {
    const isLcd = tipe === "lcd_16x2";
    const isGas = tipe === "mq2_gas";
    const bahayaGas = isGas && (nilaiSensor ?? 350) >= 1000;

    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full"}>
        <rect x="10" y="6" width="120" height="62" rx="6" fill={isGas ? "#991b1b" : isLcd ? "#15803d" : "#1e3a8a"} stroke={bahayaGas ? "#ef4444" : "#93c5fd"} strokeWidth="2" />
        <rect x="18" y="14" width="104" height="42" rx="4" fill={isGas ? "#450a0a" : isLcd ? "#84cc16" : "#090d16"} />
        <text x="70" y="33" textAnchor="middle" fill={isLcd ? "#0f172a" : "#38bdf8"} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          {isGas ? "MQ-2 SMOKE/LPG" : isLcd ? "LCD 16x2 I2C" : "OLED 128x64 I2C"}
        </text>
        <text x="70" y="47" textAnchor="middle" fill={isLcd ? "#1e293b" : "#fde047"} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          {isGas ? `${nilaiSensor} PPM` : `DATA: ${nilaiSensor}`}
        </text>
        {[40, 60, 80, 100].map((x, idx) => (
          <line key={idx} x1={x} y1="68" x2={x} y2="88" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 21. LED & Buzzer
  if (
    tipe === "led_hijau" ||
    tipe === "led_merah" ||
    tipe === "led_kuning" ||
    tipe === "buzzer"
  ) {
    if (tipe === "buzzer") {
      return (
        <svg viewBox="0 0 86 96" className={isIkon ? "w-12 h-12" : "w-full h-full"}>
          <circle cx="43" cy="34" r="24" fill="#0f172a" stroke={nyala ? "#f43f5e" : "#64748b"} strokeWidth="3" />
          <circle cx="43" cy="34" r="8" fill="#cbd5e1" />
          <line x1="31" y1="58" x2="31" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
          <line x1="55" y1="58" x2="55" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
        </svg>
      );
    }

    const warna =
      tipe === "led_hijau"
        ? "#22c55e"
        : tipe === "led_kuning"
        ? "#eab308"
        : "#ef4444";
    return (
      <svg viewBox="0 0 86 96" className={isIkon ? "w-12 h-12" : "w-full h-full"}>
        {nyala && <circle cx="43" cy="32" r="28" fill={warna} opacity="0.32" className="animate-pulse" />}
        <path d="M 26 52 L 26 32 A 17 17 0 0 1 60 32 L 60 52 Z" fill={nyala ? warna : "#475569"} stroke="#f8fafc" strokeWidth="2" />
        <line x1="31" y1="52" x2="31" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="55" y1="52" x2="55" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
      </svg>
    );
  }

  // 22. Motor Servo 180°, Motor Servo 360° & Potensiometer
  if (
    tipe === "servo" ||
    tipe === "servo_360" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    const isServo360 = tipe === "servo_360";
    const berputar360 = isServo360 && nyala && (nilaiSensor ?? 60) !== 0;

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect
          x="18"
          y="10"
          width="84"
          height="54"
          rx="6"
          fill="#1e293b"
          stroke={isServo360 ? "#f59e0b" : "#38bdf8"}
          strokeWidth="2"
        />
        {tipe === "servo" ? (
          <g
            style={{
              transform: `rotate(${(nilaiSensor ?? 90) - 90}deg)`,
              transformOrigin: "45px 37px",
              transition: "transform 0.25s ease-out",
            }}
          >
            <circle cx="45" cy="37" r="13" fill="#0284c7" />
            <rect x="41" y="6" width="8" height="34" rx="4" fill="#f8fafc" stroke="#0284c7" />
          </g>
        ) : isServo360 ? (
          <g
            className={berputar360 ? "animate-spin" : ""}
            style={{
              transformOrigin: "45px 37px",
              animationDuration: `${Math.max(0.35, 1.6 - (Math.abs(nilaiSensor || 50) / 100) * 1.1)}s`,
              animationDirection: (nilaiSensor ?? 60) < 0 ? "reverse" : "normal",
            }}
          >
            <circle cx="45" cy="37" r="14" fill="#d97706" />
            <rect x="41" y="14" width="8" height="46" rx="4" fill="#f8fafc" />
            <rect x="22" y="33" width="46" height="8" rx="4" fill="#f8fafc" />
          </g>
        ) : (
          <g
            style={{
              transform: `rotate(${((nilaiSensor ?? 2048) / 4095) * 270 - 135}deg)`,
              transformOrigin: "57px 34px",
              transition: "transform 0.2s ease-out",
            }}
          >
            <circle cx="57" cy="34" r="16" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
            <line x1="57" y1="34" x2="57" y2="20" stroke="#38bdf8" strokeWidth="3" />
          </g>
        )}
        <text x="80" y="36" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="900">
          {tipe === "servo" ? "SG90 180°" : isServo360 ? "360° CONT" : "ADC"}
        </text>
        <text x="80" y="48" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          {nilaiSensor}
          {tipe === "servo" ? "°" : isServo360 ? "%" : ""}
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 135 82" className={isIkon ? "w-18 h-12" : "w-full h-full"}>
      <rect x="14" y="8" width="107" height="66" rx="8" fill="#0f172a" stroke="#818cf8" strokeWidth="2.5" />
      <text x="67" y="36" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">
        {tipe.toUpperCase()}
      </text>
      <text x="67" y="54" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="900">
        {nilaiSensor}
      </text>
    </svg>
  );
};