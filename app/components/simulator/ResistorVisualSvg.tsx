"use client";

import React from "react";

// Peta Standar Internasional Warna Gelang Resistor (IEC 60062)
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
        <rect
          x="30"
          y="16"
          width="80"
          height="32"
          rx="8"
          fill="#f3e5ab"
          stroke="#b45309"
          strokeWidth="2"
        />
        <rect x="42" y="16" width="8" height="32" fill={info.gelang1.hex} />
        <rect x="56" y="16" width="8" height="32" fill={info.gelang2.hex} />
        <rect x="70" y="16" width="8" height="32" fill={info.gelangPengali.hex} />
        <rect x="92" y="16" width="7" height="32" fill={info.gelangToleransi.hex} />
        <text
          x="70"
          y="59"
          textAnchor="middle"
          fill="#fde047"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
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

  // ESP32 DevKit V1 & NodeMCU (Orientasi Vertikal: 15 Pin di Kiri, 15 Pin di Kanan)
  if (tipe === "esp32" || tipe === "esp8266_nodemcu") {
    const isEsp32 = tipe === "esp32";
    return (
      <svg
        viewBox="0 0 160 225"
        className={isIkon ? "w-14 h-14" : "w-full h-full"}
      >
        {/* Papan PCB Vertikal */}
        <rect
          x="16"
          y="8"
          width="128"
          height="209"
          rx="8"
          fill={isEsp32 ? "#0f172a" : "#1e293b"}
          stroke="#475569"
          strokeWidth="2.5"
        />
        {/* Antena PCB Atas */}
        <rect x="44" y="12" width="72" height="18" rx="3" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
        {/* Kaleng Pelindung RF ESP-WROOM-32 */}
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

        {/* Chip Silikon CP2102 USB-to-UART */}
        <rect x="64" y="132" width="32" height="28" rx="3" fill="#020617" stroke="#475569" />
        <text x="80" y="149" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
          CP2102
        </text>

        {/* Tombol EN & BOOT + Port Micro USB di Bawah */}
        <rect x="38" y="182" width="18" height="12" rx="2" fill="#cbd5e1" />
        <text x="47" y="179" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">
          EN
        </text>
        <rect x="104" y="182" width="18" height="12" rx="2" fill="#cbd5e1" />
        <text x="113" y="179" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">
          BOOT
        </text>
        <rect x="62" y="202" width="36" height="15" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

        {/* LED Power Merah & LED GPIO2 Biru */}
        <circle cx="52" cy="122" r="4" fill="#ef4444" />
        <circle cx="108" cy="122" r="4" fill={nyala ? "#38bdf8" : "#334155"} />

        {/* Label Ringkas Pin Kiri & Kanan pada Silksreen PCB */}
        {[
          "EN", "VP", "VN", "34", "35", "32", "33", "25", "26", "27", "14", "12", "13", "GND", "VIN"
        ].map((lbl, idx) => (
          <text
            key={`l-${idx}`}
            x="22"
            y={29 + idx * 13}
            fill="#cbd5e1"
            fontSize="6.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {lbl}
          </text>
        ))}
        {[
          "23", "22", "TX0", "RX0", "21", "19", "18", "D5", "TX2", "RX2", "D4", "D2", "15", "GND", "3V3"
        ].map((lbl, idx) => (
          <text
            key={`r-${idx}`}
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
        ))}
      </svg>
    );
  }

  // STM32 BluePill & Raspberry Pi Pico (Vertikal: 16 Pin Kiri, 16 Pin Kanan)
  if (tipe === "stm32_bluepill" || tipe === "raspberry_pico") {
    const isPico = tipe === "raspberry_pico";
    return (
      <svg
        viewBox="0 0 150 225"
        className={isIkon ? "w-14 h-14" : "w-full h-full"}
      >
        <rect
          x="16"
          y="8"
          width="118"
          height="209"
          rx="8"
          fill={isPico ? "#15803d" : "#1d4ed8"}
          stroke="#93c5fd"
          strokeWidth="2"
        />
        <rect x="45" y="75" width="60" height="60" rx="5" fill="#0f172a" stroke="#475569" />
        <text x="75" y="103" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="900">
          {isPico ? "RP2040" : "STM32F103"}
        </text>
        <text x="75" y="116" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
          ARM CORTEX
        </text>
        <rect x="57" y="6" width="36" height="14" rx="2" fill="#cbd5e1" />
      </svg>
    );
  }

  // Arduino Uno R3 (14 Pin di Header Atas, 14 Pin di Header Bawah)
  if (tipe === "arduino_uno") {
    return (
      <svg
        viewBox="0 0 195 140"
        className={isIkon ? "w-20 h-12" : "w-full h-full"}
      >
        <rect
          x="10"
          y="14"
          width="175"
          height="112"
          rx="8"
          fill="#0284c7"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />
        {/* Port USB & Jack DC */}
        <rect x="2" y="30" width="20" height="28" rx="3" fill="#cbd5e1" stroke="#475569" />
        <rect x="2" y="82" width="22" height="24" rx="3" fill="#0f172a" />
        {/* IC ATmega328P DIP */}
        <rect x="68" y="72" width="92" height="26" rx="3" fill="#0f172a" stroke="#475569" />
        <text x="114" y="88" textAnchor="middle" fill="#f8fafc" fontSize="8" fontFamily="monospace" fontWeight="bold">
          ATMEGA328P-PU
        </text>
        <text x="105" y="48" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
          ARDUINO UNO R3
        </text>
        <text x="105" y="62" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
          ATas: D13..D0(RX/TX) | Bawah: 5V, GND, A0..A5
        </text>
      </svg>
    );
  }

  // Sensor DHT22 (4 Kaki Menghadap ke Bawah)
  if (tipe === "dht22") {
    return (
      <svg viewBox="0 0 100 115" className={isIkon ? "w-14 h-12" : "w-full h-full"}>
        <rect x="14" y="6" width="72" height="72" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
        {[20, 32, 44, 56].map((y) => (
          <line key={y} x1="24" y1={y} x2="76" y2={y} stroke="#cbd5e1" strokeWidth="3.5" />
        ))}
        <text x="50" y="70" textAnchor="middle" fill="#0284c7" fontSize="9.5" fontWeight="900">
          DHT22 ({nilaiSensor}°C)
        </text>
        {/* 4 Kaki Pin Lurus ke Titik Bawah (x = 23, 41, 59, 77) */}
        {[23, 41, 59, 77].map((x, idx) => (
          <g key={idx}>
            <line x1={x} y1="78" x2={x} y2="108" stroke="#eab308" strokeWidth="3.5" />
            <text x={x} y="92" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
              {idx === 0 ? "VCC" : idx === 1 ? "DAT" : idx === 2 ? "NC" : "GND"}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // Sensor Ultrasonik HC-SR04 (4 Kaki Menghadap ke Bawah)
  if (tipe === "ultrasonik") {
    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full"}>
        <rect x="8" y="6" width="124" height="58" rx="6" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
        <circle cx="38" cy="35" r="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="38" cy="35" r="11" fill="#334155" />
        <circle cx="102" cy="35" r="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="102" cy="35" r="11" fill="#334155" />
        <text x="70" y="22" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
          HC-SR04
        </text>
        <text x="70" y="55" textAnchor="middle" fill="#fde047" fontSize="8.5" fontWeight="bold">
          {nilaiSensor} cm
        </text>
        {[43, 61, 79, 97].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="88" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // Layar OLED / LCD 16x2 / MQ-2 Gas (4 Pin di Bawah)
  if (tipe === "oled_display" || tipe === "lcd_16x2" || tipe === "mq2_gas") {
    const isLcd = tipe === "lcd_16x2";
    const isGas = tipe === "mq2_gas";
    return (
      <svg viewBox="0 0 140 95" className={isIkon ? "w-20 h-12" : "w-full h-full"}>
        <rect
          x="10"
          y="6"
          width="120"
          height="62"
          rx="6"
          fill={isGas ? "#991b1b" : isLcd ? "#15803d" : "#1e3a8a"}
          stroke="#93c5fd"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="14"
          width="104"
          height="42"
          rx="4"
          fill={isGas ? "#450a0a" : isLcd ? "#84cc16" : "#090d16"}
        />
        <text
          x="70"
          y="33"
          textAnchor="middle"
          fill={isLcd ? "#0f172a" : "#38bdf8"}
          fontSize="8.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {isGas ? "MQ-2 GAS SENSOR" : isLcd ? "LCD 16x2 I2C" : "OLED 128x64 I2C"}
        </text>
        <text
          x="70"
          y="47"
          textAnchor="middle"
          fill={isLcd ? "#1e293b" : "#fde047"}
          fontSize="8.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          VAL: {nilaiSensor}
        </text>
        {[40, 60, 80, 100].map((x, idx) => (
          <line key={idx} x1={x} y1="68" x2={x} y2="88" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  // LED Merah / Hijau / Kuning & Buzzer (2 Kaki di Bawah: x=31 & x=55)
  if (
    tipe === "led_hijau" ||
    tipe === "led_merah" ||
    tipe === "led_kuning" ||
    tipe === "buzzer"
  ) {
    const warna =
      tipe === "led_hijau"
        ? "#22c55e"
        : tipe === "led_kuning"
        ? "#eab308"
        : "#ef4444";
    return (
      <svg viewBox="0 0 86 96" className={isIkon ? "w-12 h-12" : "w-full h-full"}>
        {nyala && <circle cx="43" cy="34" r="26" fill={warna} opacity="0.35" />}
        <path
          d="M 26 52 L 26 32 A 17 17 0 0 1 60 32 L 60 52 Z"
          fill={nyala ? warna : "#475569"}
          stroke="#f8fafc"
          strokeWidth="2"
        />
        <line x1="31" y1="52" x2="31" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
        <line x1="55" y1="52" x2="55" y2="88" stroke="#94a3b8" strokeWidth="3.5" />
        <text x="23" y="76" fill="#fde047" fontSize="8" fontWeight="bold">
          +
        </text>
        <text x="60" y="76" fill="#94a3b8" fontSize="8" fontWeight="bold">
          -
        </text>
      </svg>
    );
  }

  // Servo, PIR, LDR, Potensiometer, Transistor (3 Kaki di Bawah: x=30, 57, 84)
  if (
    tipe === "servo" ||
    tipe === "pir_sensor" ||
    tipe === "ldr_sensor" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    return (
      <svg viewBox="0 0 115 95" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="16" y="10" width="83" height="54" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        {tipe === "servo" ? (
          <g transform={`rotate(${nilaiSensor - 90}, 45, 37)`}>
            <circle cx="45" cy="37" r="13" fill="#0284c7" />
            <rect x="41" y="10" width="8" height="32" rx="4" fill="#f8fafc" />
          </g>
        ) : (
          <circle cx="57" cy="34" r="16" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
        )}
        <text x="72" y="42" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="900">
          {nilaiSensor}
        </text>
        {[30, 57, 84].map((x, idx) => (
          <line key={idx} x1={x} y1="64" x2={x} y2="88" stroke="#eab308" strokeWidth="3.5" />
        ))}
      </svg>
    );
  }

  // Kapasitor, Induktor, Dioda (2 Kaki Kiri & Kanan: x=6 & x=134, y=32)
  if (tipe === "kapasitor" || tipe === "induktor" || tipe === "dioda") {
    return (
      <svg viewBox="0 0 140 64" className={isIkon ? "w-16 h-10" : "w-full h-full"}>
        <line x1="6" y1="32" x2="52" y2="32" stroke="#94a3b8" strokeWidth="4" />
        <line x1="88" y1="32" x2="134" y2="32" stroke="#94a3b8" strokeWidth="4" />
        {tipe === "kapasitor" ? (
          <>
            <line x1="58" y1="12" x2="58" y2="52" stroke="#38bdf8" strokeWidth="6" />
            <line x1="82" y1="12" x2="82" y2="52" stroke="#38bdf8" strokeWidth="6" />
          </>
        ) : tipe === "dioda" ? (
          <>
            <polygon points="52,14 52,50 86,32" fill="#e11d48" stroke="#fda4af" strokeWidth="2" />
            <line x1="86" y1="14" x2="86" y2="50" stroke="#ffffff" strokeWidth="4" />
          </>
        ) : (
          <path
            d="M 48 32 Q 56 10, 64 32 Q 72 10, 80 32 Q 88 10, 96 32"
            stroke="#f59e0b"
            strokeWidth="4"
            fill="none"
          />
        )}
      </svg>
    );
  }

  // Keypad 4x4 (8 Pin di Bawah)
  if (tipe === "keypad_4x4") {
    return (
      <svg viewBox="0 0 115 110" className={isIkon ? "w-16 h-12" : "w-full h-full"}>
        <rect x="12" y="6" width="91" height="78" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        {["1", "2", "3", "A", "4", "5", "6", "B", "7", "8", "9", "C", "*", "0", "#", "D"].map((k, idx) => {
          const r = Math.floor(idx / 4);
          const c = idx % 4;
          return (
            <rect
              key={k}
              x={22 + c * 19}
              y={13 + r * 17}
              width="14"
              height="13"
              rx="2"
              fill={c === 3 ? "#dc2626" : "#2563eb"}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={16 + i * 12} y1="84" x2={16 + i * 12} y2="103" stroke="#eab308" strokeWidth="2.5" />
        ))}
      </svg>
    );
  }

  // Default Komponen EWB / Gerbang Logika / Blok Simulink (Input Kiri & Output Kanan)
  return (
    <svg viewBox="0 0 135 82" className={isIkon ? "w-18 h-12" : "w-full h-full"}>
      <rect
        x="14"
        y="8"
        width="107"
        height="66"
        rx="8"
        fill="#0f172a"
        stroke="#818cf8"
        strokeWidth="2.5"
      />
      <text x="67" y="36" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">
        {tipe.toUpperCase()}
      </text>
      <text x="67" y="54" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="900">
        {nilaiSensor}
      </text>
    </svg>
  );
};