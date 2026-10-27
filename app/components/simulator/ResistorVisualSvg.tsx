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
        <text x="70" y="59" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace" fontWeight="bold">
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

  // 1. ESP32 DevKit V1 & NodeMCU
  if (tipe === "esp32" || tipe === "esp8266_nodemcu") {
    const isEsp32 = tipe === "esp32";
    return (
      <svg viewBox="0 0 160 225" className={isIkon ? "w-14 h-14" : "w-full h-full"}>
        <rect x="16" y="8" width="128" height="209" rx="8" fill={isEsp32 ? "#0f172a" : "#1e293b"} stroke="#475569" strokeWidth="2.5" />
        {!isIkon && nyala && (
          <g className="animate-pulse">
            <path d="M 65 6 Q 80 -2, 95 6" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
            <path d="M 58 3 Q 80 -7, 102 3" stroke="#34d399" strokeWidth="1.2" fill="none" />
          </g>
        )}
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

  // 2. STM32 BluePill & Raspberry Pi Pico
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

  // 3. Arduino Uno R3
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

  // ============================================================================
  // 4. SOLENOID DOOR LOCK 12V (ANIMASI TUAS BESI PENGUNCI PINTU MAJU-MUNDUR!)
  // ============================================================================
  if (tipe === "solenoid_lock") {
    const terbuka = nyala; // Saat HIGH/nyala, solenoid menarik tuas besi ke dalam (UNLOCKED)
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && (
          <text
            x="60"
            y="-4"
            textAnchor="middle"
            fill={terbuka ? "#34d399" : "#f87171"}
            fontSize="8"
            fontWeight="900"
          >
            {terbuka ? "🔓 UNLOCKED (Tuas Ditarik)" : "🔒 LOCKED (Pintu Terkunci)"}
          </text>
        )}
        {/* Bodi Logam Kumparan Solenoid */}
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
        {/* Kumparan Tembaga Internal */}
        <rect x="26" y="22" width="44" height="34" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Tuas Lidah Besi Pengunci (Bergerak Maju-Mundur dengan Transisi Mulus) */}
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
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // ============================================================================
  // 5. SENSOR INFRARED (IR) OBSTACLE AVOIDANCE (SINAR LASER IR & OBJEK TANGAN)
  // ============================================================================
  if (tipe === "ir_obstacle") {
    const jarakMm = nilaiSensor ?? 35;
    const terhalang = nyala && jarakMm <= 60;
    const posObjekY = -12 - (jarakMm / 180) * 45;

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && (
          <g>
            {/* Sinar Pancaran IR LED (Merah Putus-putus) & Pantulan Balik */}
            <line
              x1="42"
              y1="8"
              x2="52"
              y2={posObjekY}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="3 2"
              className="animate-pulse"
            />
            {terhalang && (
              <line
                x1="56"
                y1={posObjekY}
                x2="78"
                y2="8"
                stroke="#fde047"
                strokeWidth="2"
                strokeDasharray="3 2"
                className="animate-ping"
              />
            )}
            {/* Objek Tangan / Halangan di Depan Sensor IR */}
            <g transform={`translate(60, ${posObjekY})`}>
              <rect
                x="-36"
                y="-16"
                width="72"
                height="15"
                rx="4"
                fill="#0f172a"
                stroke={terhalang ? "#ef4444" : "#38bdf8"}
                strokeWidth="1.5"
              />
              <text x="0" y="-6" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
                ✋ {terhalang ? `HALANGAN (${jarakMm}mm)` : `Bebas (${jarakMm}mm)`}
              </text>
            </g>
          </g>
        )}
        {/* Dioda IR Transmitter (Hitam/Biru) & Photodiode Receiver */}
        <rect x="34" y="6" width="14" height="14" rx="7" fill="#1e1b4b" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="72" y="6" width="14" height="14" rx="7" fill="#0f172a" stroke="#f87171" strokeWidth="1.5" />
        <rect x="20" y="18" width="80" height="46" rx="5" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
        <circle cx="35" cy="48" r="4" fill="#22c55e" />
        <circle cx="85" cy="48" r="4" fill={terhalang ? "#ef4444" : "#334155"} />
        <text x="60" y="38" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          IR OBSTACLE
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // ============================================================================
  // 6. SENSOR API (FLAME SENSOR KY-026) DENGAN ANIMASI NYALA API BERKOBAR
  // ============================================================================
  if (tipe === "flame_sensor") {
    const intensitasApi = nilaiSensor ?? 85;
    const adaApi = nyala && intensitasApi >= 50;
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && adaApi && (
          <g transform="translate(60, -22)" className="animate-bounce">
            <path
              d="M 0 -16 C 12 -4, 14 8, 0 14 C -14 8, -12 -4, 0 -16 Z"
              fill="#ef4444"
            />
            <path
              d="M 0 -8 C 7 0, 8 8, 0 12 C -8 8, -7 0, 0 -8 Z"
              fill="#facc15"
            />
            <text x="0" y="-20" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="900">
              🔥 API TERDETEKSI ({intensitasApi}%)
            </text>
          </g>
        )}
        <rect x="20" y="18" width="80" height="46" rx="5" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
        <circle cx="60" cy="14" r="8" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
        <text x="60" y="44" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          FLAME SENSOR
        </text>
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // ============================================================================
  // 7. MOTOR DC, KIPAS DC COOLING FAN & POMPA AIR MINI (ANIMASI PUTAR & AIR!)
  // ============================================================================
  if (tipe === "kipas_dc" || tipe === "dc_motor" || tipe === "water_pump") {
    const speedRpm = nilaiSensor ?? 120;
    const aktifBerputar = nyala && speedRpm > 10;

    if (tipe === "water_pump") {
      return (
        <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
          {!isIkon && aktifBerputar && (
            <g className="animate-bounce">
              <circle cx="60" cy="-8" r="4" fill="#38bdf8" />
              <circle cx="48" cy="-16" r="3.5" fill="#0ea5e9" />
              <circle cx="72" cy="-14" r="3.5" fill="#38bdf8" />
              <text x="60" y="-24" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="900">
                💦 POMPA MENYEMBUR ({speedRpm} L/h)
              </text>
            </g>
          )}
          <rect x="22" y="14" width="76" height="50" rx="8" fill="#0284c7" stroke="#7dd3fc" strokeWidth="2.5" />
          <rect x="52" y="2" width="16" height="14" rx="3" fill="#e2e8f0" />
          <text x="60" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
            WATER PUMP
          </text>
          {[30, 60, 90].map((x, idx) => (
            <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
          ))}
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        <rect x="24" y="6" width="72" height="60" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="60" cy="36" r="24" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        {/* Baling-Baling Kipas / Rotor Motor Berputar */}
        <g
          className={aktifBerputar ? "animate-spin" : ""}
          style={{ transformOrigin: "60px 36px", animationDuration: "0.6s" }}
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

  // ============================================================================
  // 8. SENSOR KELEMBAPAN TANAH (SOIL MOISTURE), HUJAN (RAINDROP) & WATER LEVEL
  // ============================================================================
  if (tipe === "soil_moisture" || tipe === "rain_sensor" || tipe === "water_level") {
    const kadarAir = nilaiSensor ?? 70;
    const basah = kadarAir >= 50;
    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-18 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && basah && (
          <g className="animate-bounce">
            <text x="70" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="900">
              💧 {tipe === "soil_moisture" ? `Tanah Lembap (${kadarAir}%)` : `Air Terdeteksi (${kadarAir}%)`}
            </text>
          </g>
        )}
        <rect x="20" y="8" width="100" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        {/* Garis-garis Jejak Konduktif Sensor Air/Tanah */}
        {[35, 52, 70, 88, 105].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="56" stroke="#eab308" strokeWidth="3.5" />
        ))}
        {/* Lapisan Air Biru Naik Turun Sesuai Nilai Sensor */}
        <rect
          x="22"
          y={64 - Math.min(48, (kadarAir / 180) * 48)}
          width="96"
          height={Math.min(48, (kadarAir / 180) * 48)}
          fill="#0ea5e9"
          opacity="0.45"
        />
        {[40, 60, 80, 100].slice(0, tipe === "water_level" ? 3 : 4).map((x, idx) => (
          <line key={idx} x1={x} y1="66" x2={x} y2="88" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // ============================================================================
  // 9. RFID RC522 SMART CARD READER (ANIMASI KARTU TAP)
  // ============================================================================
  if (tipe === "rfid_rc522") {
    return (
      <svg viewBox="0 0 130 100" className={isIkon ? "w-18 h-12" : "w-full h-full overflow-visible"}>
        <rect x="10" y="6" width="110" height="66" rx="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
        {/* Kumparan Antena NFC/RFID */}
        <rect x="20" y="14" width="90" height="44" rx="4" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="65" y="36" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="900">
          RFID RC522
        </text>
        {!isIkon && nyala && (
          <g className="animate-pulse">
            <rect x="72" y="-12" width="48" height="30" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            <text x="96" y="6" textAnchor="middle" fill="#022c22" fontSize="7" fontWeight="900">
              💳 E-KTP TAP
            </text>
          </g>
        )}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={20 + i * 18} y1="72" x2={20 + i * 18} y2="92" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // 10. Sensor Suhu DHT22
  if (tipe === "dht22") {
    const suhu = nilaiSensor ?? 29;
    const isPanas = suhu >= 33;
    const isDingin = suhu <= 20;
    const tinggiAirRaksa = Math.max(6, Math.min(44, ((suhu - 10) / 45) * 44));

    return (
      <svg viewBox="0 0 100 115" className={isIkon ? "w-14 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && isPanas && (
          <g className="animate-bounce">
            <path d="M 28 -4 Q 24 -12, 30 -18" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <path d="M 50 -6 Q 46 -14, 52 -20" stroke="#f97316" strokeWidth="2.5" fill="none" />
            <text x="50" y="-22" textAnchor="middle" fill="#f87171" fontSize="7.5" fontWeight="900">
              🔥 PANAS ({suhu}°C)
            </text>
          </g>
        )}
        {!isIkon && isDingin && (
          <text x="50" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="900">
            ❄️ DINGIN ({suhu}°C)
          </text>
        )}
        <rect x="12" y="6" width="62" height="72" rx="6" fill="#f8fafc" stroke={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#94a3b8"} strokeWidth="2.5" />
        {[18, 29, 40, 51].map((y) => (
          <line key={y} x1="20" y1={y} x2="66" y2={y} stroke="#cbd5e1" strokeWidth="3" />
        ))}
        <rect x="78" y="12" width="10" height="52" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <rect x="80" y={60 - tinggiAirRaksa} width="6" height={tinggiAirRaksa} rx="3" fill={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#22c55e"} />
        <circle cx="83" cy="64" r="6" fill={isPanas ? "#ef4444" : isDingin ? "#38bdf8" : "#22c55e"} />
        <text x="43" y="70" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontWeight="900">
          {suhu}°C | 65%
        </text>
        {[23, 41, 59, 77].map((x, idx) => (
          <line key={idx} x1={x} y1="78" x2={x} y2="108" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 11. Sensor Ultrasonik HC-SR04
  if (tipe === "ultrasonik") {
    const jarakCm = Math.max(2, Math.min(200, nilaiSensor ?? 45));
    const offsetOrangY = -18 - (jarakCm / 200) * 65;
    const dekatSekali = jarakCm <= 35;

    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && (
          <g>
            <polygon
              points={`38,10 102,10 ${118},${offsetOrangY} ${22},${offsetOrangY}`}
              fill={dekatSekali ? "rgba(239,68,68,0.16)" : "rgba(56,189,248,0.14)"}
            />
            <path d="M 45 -4 Q 70 -16, 95 -4" stroke={dekatSekali ? "#ef4444" : "#38bdf8"} strokeWidth="2" fill="none" className="animate-ping" />
            <path d="M 35 -16 Q 70 -32, 105 -16" stroke={dekatSekali ? "#f97316" : "#34d399"} strokeWidth="2" strokeDasharray="4 2" fill="none" className="animate-pulse" />
            <line x1="70" y1="6" x2="70" y2={offsetOrangY + 12} stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 2" />
            <g transform={`translate(70, ${offsetOrangY})`}>
              <rect x="-36" y="-22" width="72" height="15" rx="4" fill="#0f172a" stroke={dekatSekali ? "#ef4444" : "#38bdf8"} strokeWidth="1.5" />
              <text x="0" y="-12" textAnchor="middle" fill="#fde047" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                🚶 Objek: {jarakCm} cm
              </text>
              <circle cx="0" cy="-2" r="5.5" fill={dekatSekali ? "#f87171" : "#38bdf8"} />
              <path d="M -8 12 C -8 5, 8 5, 8 12 Z" fill={dekatSekali ? "#ef4444" : "#0284c7"} />
            </g>
          </g>
        )}
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

  // 12. Sensor Gerak PIR
  if (tipe === "pir_sensor") {
    const posOrang = nilaiSensor ?? 60;
    const terdeteksi = nyala && posOrang >= 30 && posOrang <= 150;
    const offsetXOrang = ((posOrang - 90) / 90) * 42;

    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && (
          <g>
            <polygon
              points="60,18 8,-48 112,-48"
              fill={terdeteksi ? "rgba(239,68,68,0.22)" : "rgba(34,197,94,0.12)"}
              stroke={terdeteksi ? "#ef4444" : "#22c55e"}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <g transform={`translate(${60 + offsetXOrang}, -34)`}>
              {terdeteksi && <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.3" className="animate-ping" />}
              <circle cx="0" cy="-6" r="5.5" fill={terdeteksi ? "#ef4444" : "#94a3b8"} />
              <path d="M -7 8 C -7 1, 7 1, 7 8 Z" fill={terdeteksi ? "#dc2626" : "#64748b"} />
              <rect x="-38" y="-24" width="76" height="13" rx="3" fill="#0f172a" stroke={terdeteksi ? "#ef4444" : "#475569"} />
              <text x="0" y="-15" textAnchor="middle" fill={terdeteksi ? "#fde047" : "#cbd5e1"} fontSize="7" fontWeight="bold">
                {terdeteksi ? "🏃 GERAKAN TERDETEKSI!" : "🚶 Aman (Diluar Zona)"}
              </text>
            </g>
          </g>
        )}
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

  // 13. Sensor Cahaya LDR
  if (tipe === "ldr_sensor") {
    const lux = nilaiSensor ?? 80;
    const terang = lux >= 60;
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && (
          <g transform="translate(60, -18)">
            <circle cx="0" cy="0" r={8 + (lux / 180) * 10} fill="#facc15" opacity={0.25 + (lux / 180) * 0.5} className={terang ? "animate-pulse" : ""} />
            <circle cx="0" cy="0" r="6" fill={terang ? "#fde047" : "#64748b"} />
            <text x="0" y="-12" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
              ☀️ Cahaya: {lux} Lux
            </text>
          </g>
        )}
        <rect x="18" y="10" width="84" height="54" rx="6" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
        <circle cx="60" cy="37" r="18" fill="#fef3c7" stroke="#dc2626" strokeWidth="3" />
        <path d="M 48 31 L 72 31 L 48 37 L 72 37 L 48 43 L 72 43" stroke="#dc2626" strokeWidth="2.5" fill="none" />
        {[30, 60, 90].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="90" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // 14. Layar OLED / LCD 16x2 / MQ-2 Gas
  if (tipe === "oled_display" || tipe === "lcd_16x2" || tipe === "mq2_gas") {
    const isLcd = tipe === "lcd_16x2";
    const isGas = tipe === "mq2_gas";
    const bahayaGas = isGas && (nilaiSensor ?? 50) >= 70;

    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full overflow-visible"}>
        {!isIkon && isGas && (
          <g className="animate-bounce">
            <circle cx="45" cy="-10" r={6 + ((nilaiSensor || 40) / 180) * 8} fill={bahayaGas ? "#ef4444" : "#94a3b8"} opacity="0.45" />
            <circle cx="70" cy="-16" r={8 + ((nilaiSensor || 40) / 180) * 10} fill={bahayaGas ? "#f97316" : "#cbd5e1"} opacity="0.5" />
            <text x="70" y="-28" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="900">
              💨 Gas: {nilaiSensor} ppm
            </text>
          </g>
        )}
        <rect x="10" y="6" width="120" height="62" rx="6" fill={isGas ? "#991b1b" : isLcd ? "#15803d" : "#1e3a8a"} stroke={bahayaGas ? "#ef4444" : "#93c5fd"} strokeWidth="2" />
        <rect x="18" y="14" width="104" height="42" rx="4" fill={isGas ? "#450a0a" : isLcd ? "#84cc16" : "#090d16"} />
        <text x="70" y="33" textAnchor="middle" fill={isLcd ? "#0f172a" : "#38bdf8"} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          {isGas ? "MQ-2 SMOKE/LPG" : isLcd ? "LCD 16x2 I2C" : "OLED 128x64 I2C"}
        </text>
        <text x="70" y="47" textAnchor="middle" fill={isLcd ? "#1e293b" : "#fde047"} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
          {isGas ? `${nilaiSensor} PPM` : `DATA: ${nilaiSensor}`}
        </text>
        {[40, 60, 80, 100].map((x, idx) => (
          <line key={idx} x1={x} y1="68" x2={x} y2="88" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // 15. LED & Buzzer
  if (
    tipe === "led_hijau" ||
    tipe === "led_merah" ||
    tipe === "led_kuning" ||
    tipe === "buzzer"
  ) {
    if (tipe === "buzzer") {
      return (
        <svg viewBox="0 0 86 96" className={isIkon ? "w-12 h-12" : "w-full h-full overflow-visible"}>
          {!isIkon && nyala && (
            <g className="animate-ping">
              <circle cx="43" cy="34" r="34" stroke="#f43f5e" strokeWidth="2" fill="none" />
            </g>
          )}
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
      <svg viewBox="0 0 86 96" className={isIkon ? "w-12 h-12" : "w-full h-full overflow-visible"}>
        {nyala && <circle cx="43" cy="32" r="28" fill={warna} opacity="0.32" className="animate-pulse" />}
        <path d="M 26 52 L 26 32 A 17 17 0 0 1 60 32 L 60 52 Z" fill={nyala ? warna : "#475569"} stroke="#f8fafc" strokeWidth="2" />
        <line x1="31" y1="52" x2="31" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="55" y1="52" x2="55" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
      </svg>
    );
  }

  // 16. Servo, Potensiometer, Transistor
  if (
    tipe === "servo" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    return (
      <svg viewBox="0 0 120 98" className={isIkon ? "w-16 h-12" : "w-full h-full overflow-visible"}>
        <rect x="18" y="10" width="84" height="54" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
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
        ) : (
          <circle cx="60" cy="34" r="16" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
        )}
        <text x="78" y="42" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="900">
          {nilaiSensor}
          {tipe === "servo" ? "°" : ""}
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