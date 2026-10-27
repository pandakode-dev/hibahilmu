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
      ? "w-32 h-11"
      : "w-20 h-8";

  return (
    <div className="inline-flex flex-col items-center select-none">
      <svg viewBox="0 0 220 70" className={kelasUkuran}>
        <line
          x1="5"
          y1="35"
          x2="45"
          y2="35"
          stroke="#94a3b8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="175"
          y1="35"
          x2="215"
          y2="35"
          stroke="#94a3b8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 45 18 Q 55 12, 70 18 L 150 18 Q 165 12, 175 18 L 175 52 Q 165 58, 150 52 L 70 52 Q 55 58, 45 52 Z"
          fill="#f3e5ab"
          stroke="#b45309"
          strokeWidth="2.5"
        />
        <rect x="65" y="16" width="12" height="38" fill={info.gelang1.hex} rx="2" />
        <rect x="88" y="18" width="11" height="34" fill={info.gelang2.hex} rx="2" />
        <rect x="112" y="18" width="11" height="34" fill={info.gelangPengali.hex} rx="2" />
        <rect x="145" y="16" width="10" height="38" fill={info.gelangToleransi.hex} rx="2" />
        <line
          x1="55"
          y1="23"
          x2="165"
          y2="23"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.55"
        />
      </svg>

      {ukuran !== "ikon" && (
        <div className="flex flex-wrap justify-center gap-1 text-[10px] font-mono font-bold text-slate-300 mt-0.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
            {info.labelSingkat}
          </span>
          {ukuran === "besar" && (
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
              [{info.gelang1.nama} • {info.gelang2.nama} • {info.gelangPengali.nama} • Emas]
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// VISUALISASI SVG REALISTIS SELURUH KOMPONEN WOKWI, EWB, DAN SIMULINK
// ============================================================================
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

  if (tipe === "esp32") {
    return (
      <svg viewBox="0 0 150 96" className={isIkon ? "w-20 h-12" : "w-36 h-24"}>
        <rect
          x="8"
          y="6"
          width="134"
          height="84"
          rx="8"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="2.5"
        />
        <rect
          x="42"
          y="16"
          width="66"
          height="46"
          rx="4"
          fill="#cbd5e1"
          stroke="#64748b"
          strokeWidth="2"
        />
        <text x="75" y="36" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
          ESP-WROOM-32
        </text>
        <text x="75" y="48" textAnchor="middle" fill="#0284c7" fontSize="6.5" fontWeight="bold">
          TX0(1) • RX0(3) • WiFi
        </text>
        <path
          d="M 108 22 L 130 22 L 130 32 L 116 32 L 116 42 L 130 42 L 130 52 L 108 52"
          stroke="#eab308"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="2"
          y="34"
          width="14"
          height="28"
          rx="3"
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="1.5"
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <circle cx={22 + i * 9} cy="11" r="2.2" fill="#facc15" />
            <circle cx={22 + i * 9} cy="85" r="2.2" fill="#facc15" />
          </g>
        ))}
        <circle cx="28" cy="70" r="3.5" fill="#ef4444" />
        <circle cx="42" cy="70" r="3.5" fill={nyala ? "#38bdf8" : "#1e293b"} />
      </svg>
    );
  }

  if (tipe === "arduino_uno") {
    return (
      <svg viewBox="0 0 150 96" className={isIkon ? "w-20 h-12" : "w-36 h-24"}>
        <rect
          x="8"
          y="6"
          width="134"
          height="84"
          rx="8"
          fill="#0284c7"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />
        <rect x="4" y="20" width="18" height="24" rx="2" fill="#cbd5e1" />
        <rect x="4" y="58" width="16" height="20" rx="2" fill="#0f172a" />
        <rect x="52" y="48" width="64" height="20" rx="2" fill="#1e293b" />
        <text x="84" y="61" textAnchor="middle" fill="#e2e8f0" fontSize="7" fontWeight="bold">
          ATMEGA328P
        </text>
        <text x="80" y="28" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900">
          ARDUINO UNO R3
        </text>
        <text x="80" y="40" textAnchor="middle" fill="#fde047" fontSize="6.5" fontWeight="bold">
          D0(RX) • D1(TX) • PWM
        </text>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={36 + i * 9} y="8" width="5" height="6" fill="#0f172a" />
        ))}
      </svg>
    );
  }

  if (tipe === "esp8266_nodemcu" || tipe === "stm32_bluepill" || tipe === "raspberry_pico") {
    const warnaPcb =
      tipe === "raspberry_pico"
        ? "#15803d"
        : tipe === "stm32_bluepill"
        ? "#1d4ed8"
        : "#1e293b";
    const labelBoard =
      tipe === "raspberry_pico"
        ? "RPi PICO RP2040"
        : tipe === "stm32_bluepill"
        ? "STM32F103C8T6"
        : "NODEMCU ESP8266";
    return (
      <svg viewBox="0 0 145 90" className={isIkon ? "w-20 h-12" : "w-36 h-22"}>
        <rect
          x="8"
          y="8"
          width="129"
          height="74"
          rx="7"
          fill={warnaPcb}
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <rect x="48" y="24" width="48" height="36" rx="4" fill="#0f172a" stroke="#475569" />
        <text x="72" y="42" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900">
          {labelBoard}
        </text>
        <text x="72" y="53" textAnchor="middle" fill="#fde047" fontSize="6.5" fontWeight="bold">
          UART TX/RX • I2C • SPI
        </text>
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <circle cx={20 + i * 10} cy="13" r="2" fill="#facc15" />
            <circle cx={20 + i * 10} cy="77" r="2" fill="#facc15" />
          </g>
        ))}
      </svg>
    );
  }

  if (tipe === "breadboard") {
    return (
      <svg viewBox="0 0 150 86" className={isIkon ? "w-20 h-12" : "w-36 h-22"}>
        <rect
          x="6"
          y="6"
          width="138"
          height="74"
          rx="6"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2.5"
        />
        <line x1="12" y1="14" x2="138" y2="14" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="12" y1="72" x2="138" y2="72" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="10" y="40" width="130" height="6" fill="#e2e8f0" />
        {Array.from({ length: 11 }).map((_, col) => (
          <g key={col}>
            <circle cx={20 + col * 11} cy="24" r="2" fill="#334155" />
            <circle cx={20 + col * 11} cy="33" r="2" fill="#334155" />
            <circle cx={20 + col * 11} cy="53" r="2" fill="#334155" />
            <circle cx={20 + col * 11} cy="62" r="2" fill="#334155" />
          </g>
        ))}
      </svg>
    );
  }

  if (tipe === "dht22") {
    return (
      <svg viewBox="0 0 90 95" className={isIkon ? "w-14 h-12" : "w-24 h-24"}>
        <rect
          x="18"
          y="8"
          width="54"
          height="58"
          rx="6"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="2.5"
        />
        {[20, 30, 40, 50].map((y) => (
          <line key={y} x1="26" y1={y} x2="64" y2={y} stroke="#cbd5e1" strokeWidth="3" />
        ))}
        <text x="45" y="62" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="900">
          DHT22 {!isIkon && `(${nilaiSensor}°C)`}
        </text>
        {[26, 38, 50, 62].map((x, idx) => (
          <line key={idx} x1={x} y1="66" x2={x} y2="90" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  if (tipe === "ultrasonik") {
    return (
      <svg viewBox="0 0 130 75" className={isIkon ? "w-20 h-12" : "w-32 h-20"}>
        <rect
          x="8"
          y="8"
          width="114"
          height="50"
          rx="6"
          fill="#1d4ed8"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <circle cx="36" cy="33" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="36" cy="33" r="10" fill="#334155" />
        <circle cx="94" cy="33" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="94" cy="33" r="10" fill="#334155" />
        <text x="65" y="20" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
          HC-SR04
        </text>
        {!isIkon && (
          <text x="65" y="52" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
            {nilaiSensor} cm
          </text>
        )}
      </svg>
    );
  }

  if (tipe === "mq2_gas" || tipe === "pir_sensor" || tipe === "ldr_sensor") {
    if (tipe === "mq2_gas") {
      return (
        <svg viewBox="0 0 95 80" className={isIkon ? "w-16 h-12" : "w-24 h-20"}>
          <rect x="16" y="14" width="62" height="50" rx="6" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
          <circle cx="47" cy="36" r="16" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
          <text x="47" y="39" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="900">
            MQ-2 GAS
          </text>
          <text x="47" y="61" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
            {nilaiSensor} ppm
          </text>
        </svg>
      );
    }
    if (tipe === "pir_sensor") {
      return (
        <svg viewBox="0 0 100 80" className={isIkon ? "w-16 h-12" : "w-26 h-20"}>
          <rect x="15" y="36" width="70" height="32" rx="4" fill="#15803d" stroke="#4ade80" strokeWidth="2" />
          <path d="M 25 36 A 25 24 0 0 1 75 36 Z" fill={nyala ? "#fef08a" : "#e2e8f0"} stroke="#94a3b8" strokeWidth="2" />
          <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
            PIR MOTION
          </text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 90 75" className={isIkon ? "w-16 h-12" : "w-24 h-18"}>
        <circle cx="45" cy="34" r="20" fill="#fef3c7" stroke="#dc2626" strokeWidth="3" />
        <path d="M 32 28 L 58 28 L 32 34 L 58 34 L 32 40 L 58 40" stroke="#dc2626" strokeWidth="2.5" fill="none" />
        <text x="45" y="66" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
          LDR {nilaiSensor} lx
        </text>
      </svg>
    );
  }

  if (tipe === "keypad_4x4" || tipe === "neopixel_ring" || tipe === "seven_segment") {
    if (tipe === "keypad_4x4") {
      return (
        <svg viewBox="0 0 100 95" className={isIkon ? "w-16 h-12" : "w-26 h-24"}>
          <rect x="14" y="8" width="72" height="76" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          {["1", "2", "3", "A", "4", "5", "6", "B", "7", "8", "9", "C", "*", "0", "#", "D"].map((k, idx) => {
            const r = Math.floor(idx / 4);
            const c = idx % 4;
            return (
              <g key={k}>
                <rect
                  x={20 + c * 15}
                  y={14 + r * 16}
                  width="12"
                  height="12"
                  rx="2"
                  fill={c === 3 ? "#dc2626" : "#2563eb"}
                />
                <text
                  x={26 + c * 15}
                  y={23 + r * 16}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {k}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }
    if (tipe === "neopixel_ring") {
      return (
        <svg viewBox="0 0 95 85" className={isIkon ? "w-16 h-12" : "w-24 h-22"}>
          <circle cx="47" cy="42" r="32" fill="#0f172a" stroke="#334155" strokeWidth="6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 47 + Math.cos(rad) * 24;
            const cy = 42 + Math.sin(rad) * 24;
            const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];
            return <circle key={deg} cx={cx} cy={cy} r="4.5" fill={nyala ? colors[i] : "#475569"} />;
          })}
          <text x="47" y="45" textAnchor="middle" fill="#f8fafc" fontSize="7" fontWeight="bold">
            WS2812
          </text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 85 85" className={isIkon ? "w-14 h-12" : "w-22 h-22"}>
        <rect x="16" y="8" width="52" height="68" rx="5" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <text x="42" y="56" textAnchor="middle" fill={nyala ? "#ef4444" : "#334155"} fontSize="42" fontFamily="monospace" fontWeight="900">
          {nilaiSensor % 10}
        </text>
      </svg>
    );
  }

  if (tipe === "stepper_motor" || tipe === "l298n_driver") {
    const isDriver = tipe === "l298n_driver";
    return (
      <svg viewBox="0 0 110 80" className={isIkon ? "w-18 h-12" : "w-28 h-20"}>
        {isDriver ? (
          <>
            <rect x="12" y="10" width="86" height="60" rx="6" fill="#b91c1c" stroke="#fca5a5" strokeWidth="2" />
            <rect x="38" y="18" width="34" height="24" fill="#0f172a" />
            <text x="55" y="34" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
              L298N
            </text>
            <text x="55" y="58" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
              DUAL H-BRIDGE
            </text>
          </>
        ) : (
          <>
            <rect x="22" y="12" width="66" height="56" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="55" cy="40" r="18" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <line
              x1="55"
              y1="40"
              x2="55"
              y2="24"
              stroke="#38bdf8"
              strokeWidth="4"
              transform={`rotate(${nilaiSensor * 2}, 55, 40)`}
            />
            <text x="55" y="64" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
              NEMA17 ({nilaiSensor}°)
            </text>
          </>
        )}
      </svg>
    );
  }

  if (tipe === "potensiometer") {
    return (
      <svg viewBox="0 0 95 80" className={isIkon ? "w-16 h-12" : "w-24 h-20"}>
        <circle cx="47" cy="36" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="47" cy="36" r="12" fill="#cbd5e1" />
        <line
          x1="47"
          y1="36"
          x2="47"
          y2="20"
          stroke="#0f172a"
          strokeWidth="3.5"
          transform={`rotate(${(nilaiSensor || 50) * 1.5 - 90}, 47, 36)`}
        />
        <text x="47" y="72" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
          POT {nilaiSensor}%
        </text>
      </svg>
    );
  }

  if (tipe === "push_button") {
    return (
      <svg viewBox="0 0 85 75" className={isIkon ? "w-14 h-12" : "w-22 h-18"}>
        <rect
          x="18"
          y="14"
          width="48"
          height="46"
          rx="6"
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <circle
          cx="42"
          cy="37"
          r="14"
          fill={nyala ? "#ef4444" : "#334155"}
          stroke="#0f172a"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (tipe === "oled_display" || tipe === "lcd_16x2") {
    const isOled = tipe === "oled_display";
    return (
      <svg viewBox="0 0 135 80" className={isIkon ? "w-20 h-12" : "w-34 h-20"}>
        <rect
          x="8"
          y="8"
          width="119"
          height="64"
          rx="6"
          fill={isOled ? "#1e3a8a" : "#15803d"}
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <rect
          x="16"
          y="18"
          width="103"
          height="44"
          rx="3"
          fill={isOled ? "#090d16" : "#84cc16"}
        />
        <text
          x="67"
          y="37"
          textAnchor="middle"
          fill={isOled ? "#38bdf8" : "#0f172a"}
          fontSize="8"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {isOled ? "OLED 128x64 I2C" : "LCD 16x2 READY"}
        </text>
        <text
          x="67"
          y="51"
          textAnchor="middle"
          fill={isOled ? "#34d399" : "#1e293b"}
          fontSize="8"
          fontFamily="monospace"
          fontWeight="bold"
        >
          VAL: {nilaiSensor}
        </text>
      </svg>
    );
  }

  if (tipe === "buzzer" || tipe === "relay_5v") {
    const isBuzzer = tipe === "buzzer";
    return (
      <svg viewBox="0 0 95 75" className={isIkon ? "w-16 h-12" : "w-24 h-18"}>
        {isBuzzer ? (
          <>
            <circle
              cx="47"
              cy="36"
              r="24"
              fill="#0f172a"
              stroke={nyala ? "#f43f5e" : "#64748b"}
              strokeWidth="3"
            />
            <circle cx="47" cy="36" r="7" fill="#cbd5e1" />
            <text x="47" y="69" textAnchor="middle" fill="#fda4af" fontSize="8" fontWeight="bold">
              BUZZER
            </text>
          </>
        ) : (
          <>
            <rect
              x="14"
              y="14"
              width="66"
              height="46"
              rx="5"
              fill="#2563eb"
              stroke="#93c5fd"
              strokeWidth="2"
            />
            <text x="47" y="36" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
              RELAY 5V DC
            </text>
            <text x="47" y="49" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="bold">
              {nyala ? "NO: CLOSED" : "NO: OPEN"}
            </text>
          </>
        )}
      </svg>
    );
  }

  if (tipe === "led_merah" || tipe === "led_hijau" || tipe === "led_kuning") {
    const warnaUtama =
      tipe === "led_hijau"
        ? "#22c55e"
        : tipe === "led_kuning"
        ? "#eab308"
        : "#ef4444";
    return (
      <svg viewBox="0 0 70 85" className={isIkon ? "w-12 h-12" : "w-18 h-20"}>
        {nyala && <circle cx="35" cy="28" r="24" fill={warnaUtama} opacity="0.35" />}
        <path
          d="M 20 42 L 20 26 A 15 15 0 0 1 50 26 L 50 42 Z"
          fill={nyala ? warnaUtama : "#475569"}
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <rect x="17" y="42" width="36" height="6" rx="2" fill={nyala ? warnaUtama : "#334155"} />
        <line x1="27" y1="48" x2="27" y2="78" stroke="#94a3b8" strokeWidth="3" />
        <line x1="43" y1="48" x2="43" y2="72" stroke="#94a3b8" strokeWidth="3" />
      </svg>
    );
  }

  if (tipe === "servo") {
    return (
      <svg viewBox="0 0 110 80" className={isIkon ? "w-18 h-12" : "w-28 h-20"}>
        <rect
          x="20"
          y="22"
          width="70"
          height="44"
          rx="5"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        <circle cx="42" cy="44" r="14" fill="#38bdf8" />
        <g transform={`rotate(${nilaiSensor - 90}, 42, 44)`}>
          <rect
            x="38"
            y="10"
            width="8"
            height="36"
            rx="4"
            fill="#f8fafc"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
        </g>
        <text x="72" y="48" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">
          {nilaiSensor}°
        </text>
      </svg>
    );
  }

  if (tipe === "vcc_dc" || tipe === "ac_source" || tipe === "gnd") {
    if (tipe === "gnd") {
      return (
        <svg viewBox="0 0 80 70" className={isIkon ? "w-14 h-12" : "w-20 h-16"}>
          <line x1="40" y1="10" x2="40" y2="34" stroke="#38bdf8" strokeWidth="4" />
          <line x1="18" y1="34" x2="62" y2="34" stroke="#38bdf8" strokeWidth="4" />
          <line x1="26" y1="44" x2="54" y2="44" stroke="#38bdf8" strokeWidth="4" />
          <line x1="33" y1="54" x2="47" y2="54" stroke="#38bdf8" strokeWidth="4" />
          <text x="40" y="67" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
            GND (0V)
          </text>
        </svg>
      );
    }
    const isAc = tipe === "ac_source";
    return (
      <svg viewBox="0 0 90 70" className={isIkon ? "w-16 h-12" : "w-24 h-18"}>
        <circle
          cx="45"
          cy="35"
          r="24"
          fill="#0f172a"
          stroke={isAc ? "#38bdf8" : "#facc15"}
          strokeWidth="3"
        />
        {isAc ? (
          <path
            d="M 30 35 Q 37 22, 45 35 T 60 35"
            stroke="#38bdf8"
            strokeWidth="3"
            fill="none"
          />
        ) : (
          <>
            <line x1="33" y1="28" x2="57" y2="28" stroke="#facc15" strokeWidth="3" />
            <line x1="39" y1="40" x2="51" y2="40" stroke="#38bdf8" strokeWidth="3" />
          </>
        )}
        <text x="45" y="21" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
          {isAc ? `${nilaiSensor}Hz AC` : `+${nilaiSensor}V DC`}
        </text>
      </svg>
    );
  }

  if (tipe === "kapasitor" || tipe === "induktor" || tipe === "dioda" || tipe === "trafo_stepdown") {
    if (tipe === "trafo_stepdown") {
      return (
        <svg viewBox="0 0 110 75" className={isIkon ? "w-18 h-12" : "w-26 h-18"}>
          <path d="M 30 14 Q 42 20, 30 28 Q 42 35, 30 42 Q 42 50, 30 58" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <line x1="52" y1="12" x2="52" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="58" y1="12" x2="58" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
          <path d="M 80 14 Q 68 20, 80 28 Q 68 35, 80 42 Q 68 50, 80 58" stroke="#38bdf8" strokeWidth="3" fill="none" />
          <text x="55" y="70" textAnchor="middle" fill="#fde047" fontSize="7.5" fontWeight="bold">
            TRAFO CT 12V
          </text>
        </svg>
      );
    }
    if (tipe === "induktor") {
      return (
        <svg viewBox="0 0 110 70" className={isIkon ? "w-18 h-12" : "w-26 h-18"}>
          <path
            d="M 10 38 L 24 38 Q 32 16, 40 38 Q 48 16, 56 38 Q 64 16, 72 38 Q 80 16, 88 38 L 100 38"
            stroke="#f59e0b"
            strokeWidth="3.5"
            fill="none"
          />
          <text x="55" y="60" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold">
            L: {nilaiSensor} mH
          </text>
        </svg>
      );
    }
    if (tipe === "dioda") {
      return (
        <svg viewBox="0 0 100 70" className={isIkon ? "w-16 h-12" : "w-24 h-18"}>
          <line x1="12" y1="35" x2="88" y2="35" stroke="#94a3b8" strokeWidth="3.5" />
          <polygon points="36,18 36,52 64,35" fill="#e11d48" stroke="#fda4af" strokeWidth="2" />
          <line x1="65" y1="18" x2="65" y2="52" stroke="#f8fafc" strokeWidth="4" />
          <text x="50" y="64" textAnchor="middle" fill="#fda4af" fontSize="8" fontWeight="bold">
            1N4007
          </text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 90 70" className={isIkon ? "w-16 h-12" : "w-24 h-18"}>
        <line x1="10" y1="35" x2="38" y2="35" stroke="#94a3b8" strokeWidth="4" />
        <line x1="38" y1="15" x2="38" y2="55" stroke="#38bdf8" strokeWidth="5" />
        <line x1="52" y1="15" x2="52" y2="55" stroke="#38bdf8" strokeWidth="5" />
        <line x1="52" y1="35" x2="80" y2="35" stroke="#94a3b8" strokeWidth="4" />
        <text x="45" y="66" textAnchor="middle" fill="#bae6fd" fontSize="9" fontWeight="bold">
          {nilaiSensor} μF
        </text>
      </svg>
    );
  }

  if (tipe === "transistor_npn" || tipe === "opamp_741" || tipe === "ic_ne555") {
    if (tipe === "ic_ne555") {
      return (
        <svg viewBox="0 0 105 75" className={isIkon ? "w-18 h-12" : "w-26 h-18"}>
          <rect x="22" y="12" width="60" height="50" rx="4" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <text x="52" y="36" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="900">
            NE555P
          </text>
          <text x="52" y="48" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold">
            TIMER PWM IC
          </text>
        </svg>
      );
    }
    const isOpamp = tipe === "opamp_741";
    return (
      <svg viewBox="0 0 105 75" className={isIkon ? "w-18 h-12" : "w-26 h-18"}>
        {isOpamp ? (
          <>
            <polygon
              points="24,12 24,62 82,37"
              fill="#1e1b4b"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            <text x="44" y="40" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold">
              LM741
            </text>
          </>
        ) : (
          <>
            <circle cx="52" cy="37" r="22" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
            <line x1="44" y1="22" x2="44" y2="52" stroke="#34d399" strokeWidth="3.5" />
            <line x1="22" y1="37" x2="44" y2="37" stroke="#94a3b8" strokeWidth="3" />
            <line x1="44" y1="30" x2="64" y2="18" stroke="#94a3b8" strokeWidth="3" />
            <line x1="44" y1="44" x2="64" y2="56" stroke="#94a3b8" strokeWidth="3" />
            <text x="52" y="69" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">
              NPN 2N2222
            </text>
          </>
        )}
      </svg>
    );
  }

  if (
    tipe === "gerbang_logika" ||
    tipe === "ic_or" ||
    tipe === "ic_xor" ||
    tipe === "multimeter" ||
    tipe === "osiloskop" ||
    tipe === "func_generator"
  ) {
    if (tipe === "multimeter" || tipe === "osiloskop" || tipe === "func_generator") {
      const isOsc = tipe === "osiloskop";
      const isFgen = tipe === "func_generator";
      return (
        <svg viewBox="0 0 115 75" className={isIkon ? "w-18 h-12" : "w-28 h-18"}>
          <rect
            x="10"
            y="8"
            width="95"
            height="58"
            rx="7"
            fill="#0f172a"
            stroke={isOsc ? "#22c55e" : isFgen ? "#38bdf8" : "#eab308"}
            strokeWidth="2.5"
          />
          {isOsc || isFgen ? (
            <path
              d="M 20 38 Q 34 15, 48 38 T 76 38 T 96 38"
              stroke={isOsc ? "#4ade80" : "#38bdf8"}
              strokeWidth="2.5"
              fill="none"
            />
          ) : (
            <text
              x="57"
              y="42"
              textAnchor="middle"
              fill="#fde047"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {nilaiSensor}.0 V
            </text>
          )}
          <text x="57" y="21" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">
            {isOsc ? "OSCILLOSCOPE" : isFgen ? "FUNC GEN (Hz)" : "MULTIMETER"}
          </text>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 110 70" className={isIkon ? "w-18 h-12" : "w-28 h-18"}>
        <path
          d="M 25 14 L 58 14 A 22 21 0 0 1 58 56 L 25 56 Z"
          fill="#312e81"
          stroke="#818cf8"
          strokeWidth="3"
        />
        <line x1="6" y1="25" x2="25" y2="25" stroke="#94a3b8" strokeWidth="3" />
        <line x1="6" y1="45" x2="25" y2="45" stroke="#94a3b8" strokeWidth="3" />
        <line
          x1="80"
          y1="35"
          x2="104"
          y2="35"
          stroke={nyala ? "#34d399" : "#94a3b8"}
          strokeWidth="4"
        />
        <text x="48" y="39" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
          {tipe === "ic_or" ? "OR 7432" : tipe === "ic_xor" ? "XOR 7486" : "AND 7408"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 130 68" className={isIkon ? "w-20 h-12" : "w-32 h-16"}>
      <rect
        x="8"
        y="8"
        width="114"
        height="52"
        rx="8"
        fill="#1e293b"
        stroke="#f97316"
        strokeWidth="2.5"
      />
      <polygon points="4,28 12,34 4,40" fill="#facc15" />
      <polygon points="122,28 130,34 122,40" fill="#34d399" />
      <text x="65" y="29" textAnchor="middle" fill="#fdba74" fontSize="7" fontWeight="bold">
        SIMULINK BLOCK
      </text>
      <text x="65" y="45" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
        {tipe.toUpperCase()}
      </text>
    </svg>
  );
};