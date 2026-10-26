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
    pengali = -1; // Gelang emas (x0.1)
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
  ukuran?: "kecil" | "besar";
}

export const ResistorVisualSvg: React.FC<ResistorSvgProps> = ({
  nilaiOhm,
  ukuran = "besar",
}) => {
  const info = hitungGelangWarnaResistor(nilaiOhm);

  return (
    <div className="inline-flex flex-col items-center select-none">
      <svg
        viewBox="0 0 220 70"
        className={ukuran === "besar" ? "w-48 h-16" : "w-32 h-11"}
      >
        {/* Kawat Kaki Kiri & Kanan */}
        <line x1="5" y1="35" x2="45" y2="35" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        <line x1="175" y1="35" x2="215" y2="35" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

        {/* Bodi Keramik Resistor Axial */}
        <path
          d="M 45 18 Q 55 12, 70 18 L 150 18 Q 165 12, 175 18 L 175 52 Q 165 58, 150 52 L 70 52 Q 55 58, 45 52 Z"
          fill="#f3e5ab"
          stroke="#b45309"
          strokeWidth="2.5"
        />

        {/* Gelang 1 (Digit Pertama) */}
        <rect x="65" y="16" width="12" height="38" fill={info.gelang1.hex} rx="2" />
        {/* Gelang 2 (Digit Kedua) */}
        <rect x="88" y="18" width="11" height="34" fill={info.gelang2.hex} rx="2" />
        {/* Gelang 3 (Pengali / Multiplier) */}
        <rect x="112" y="18" width="11" height="34" fill={info.gelangPengali.hex} rx="2" />
        {/* Gelang 4 (Toleransi Emas ±5%) */}
        <rect x="145" y="16" width="10" height="38" fill={info.gelangToleransi.hex} rx="2" />

        {/* Efek Kilau 3D Halus pada Bodi Resistor */}
        <line x1="55" y1="23" x2="165" y2="23" stroke="#ffffff" strokeWidth="2" opacity="0.55" />
      </svg>

      <div className="flex flex-wrap justify-center gap-1 text-[10px] font-mono font-bold text-slate-300 mt-0.5">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
          {info.labelSingkat}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
          [{info.gelang1.nama} • {info.gelang2.nama} • {info.gelangPengali.nama} • Emas]
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// VISUALISASI SVG REALISTIS KOMPONEN WOKWI, EWB, DAN SIMULINK
// ============================================================================
export const VisualKomponenRealistis: React.FC<{
  tipe: string;
  nilaiResistor?: number;
  nyala?: boolean;
  nilaiSensor?: number;
}> = ({ tipe, nilaiResistor = 1000, nyala = true, nilaiSensor = 28 }) => {
  if (tipe === "resistor") {
    return <ResistorVisualSvg nilaiOhm={nilaiResistor} ukuran="kecil" />;
  }

  if (tipe === "esp32") {
    return (
      <svg viewBox="0 0 150 96" className="w-36 h-24">
        {/* PCB Hitam ESP32 DevKit V1 */}
        <rect x="8" y="6" width="134" height="84" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
        {/* Pelindung Logam RF ESP-WROOM-32 */}
        <rect x="42" y="16" width="66" height="46" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        <text x="75" y="38" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
          ESP-WROOM-32
        </text>
        <text x="75" y="50" textAnchor="middle" fill="#334155" fontSize="6" fontWeight="bold">
          Wi-Fi + BT SoC
        </text>
        {/* Antena PCB Meander */}
        <path d="M 108 22 L 130 22 L 130 32 L 116 32 L 116 42 L 130 42 L 130 52 L 108 52" stroke="#eab308" strokeWidth="2" fill="none" />
        {/* Port Micro-USB Kiri */}
        <rect x="2" y="34" width="14" height="28" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        {/* Pin Header Atas & Bawah */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <circle cx={22 + i * 9} cy="11" r="2.2" fill="#facc15" />
            <circle cx={22 + i * 9} cy="85" r="2.2" fill="#facc15" />
          </g>
        ))}
        {/* Lampu Indikator Power & Built-in LED */}
        <circle cx="28" cy="70" r="3.5" fill="#ef4444" />
        <circle cx="42" cy="70" r="3.5" fill={nyala ? "#38bdf8" : "#1e293b"} />
      </svg>
    );
  }

  if (tipe === "arduino_uno") {
    return (
      <svg viewBox="0 0 150 96" className="w-36 h-24">
        <rect x="8" y="6" width="134" height="84" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
        <rect x="4" y="20" width="18" height="24" rx="2" fill="#cbd5e1" />
        <rect x="4" y="58" width="16" height="20" rx="2" fill="#0f172a" />
        <rect x="52" y="48" width="64" height="20" rx="2" fill="#1e293b" />
        <text x="84" y="61" textAnchor="middle" fill="#e2e8f0" fontSize="7" fontWeight="bold">
          ATMEGA328P
        </text>
        <text x="80" y="30" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
          ARDUINO UNO
        </text>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={36 + i * 9} y="8" width="5" height="6" fill="#0f172a" />
        ))}
      </svg>
    );
  }

  if (tipe === "dht22") {
    return (
      <svg viewBox="0 0 90 95" className="w-24 h-24">
        {/* Bodi Putih Berjaring Sensor DHT22 */}
        <rect x="18" y="8" width="54" height="58" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
        {[20, 30, 40, 50].map((y) => (
          <line key={y} x1="26" y1={y} x2="64" y2={y} stroke="#cbd5e1" strokeWidth="3" />
        ))}
        <text x="45" y="62" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="900">
          DHT22 ({nilaiSensor}°C)
        </text>
        {/* 4 Kaki Pin Sensor */}
        {[26, 38, 50, 62].map((x, idx) => (
          <line key={idx} x1={x} y1="66" x2={x} y2="90" stroke="#eab308" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  if (tipe === "ultrasonik") {
    return (
      <svg viewBox="0 0 130 75" className="w-32 h-20">
        <rect x="8" y="8" width="114" height="50" rx="6" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
        {/* 2 Tabung Transduser Ultrasonik */}
        <circle cx="36" cy="33" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="36" cy="33" r="10" fill="#334155" />
        <circle cx="94" cy="33" r="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
        <circle cx="94" cy="33" r="10" fill="#334155" />
        <text x="65" y="20" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
          HC-SR04
        </text>
        <text x="65" y="52" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
          {nilaiSensor} cm
        </text>
      </svg>
    );
  }

  if (tipe === "led_merah" || tipe === "led_hijau") {
    const adalahHijau = tipe === "led_hijau";
    const warnaUtama = adalahHijau ? "#22c55e" : "#ef4444";
    return (
      <svg viewBox="0 0 70 85" className="w-18 h-20">
        {nyala && (
          <circle
            cx="35"
            cy="28"
            r="24"
            fill={warnaUtama}
            opacity="0.35"
          />
        )}
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
      <svg viewBox="0 0 110 80" className="w-28 h-20">
        <rect x="20" y="22" width="70" height="44" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <circle cx="42" cy="44" r="14" fill="#38bdf8" />
        {/* Lengan Horn Servo Berputar sesuai Sudut */}
        <g transform={`rotate(${nilaiSensor - 90}, 42, 44)`}>
          <rect x="38" y="10" width="8" height="36" rx="4" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" />
        </g>
        <text x="72" y="48" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">
          {nilaiSensor}°
        </text>
      </svg>
    );
  }

  if (tipe === "vcc_dc") {
    return (
      <svg viewBox="0 0 90 70" className="w-24 h-18">
        <circle cx="45" cy="35" r="24" fill="#0f172a" stroke="#facc15" strokeWidth="3" />
        <line x1="33" y1="28" x2="57" y2="28" stroke="#facc15" strokeWidth="3" />
        <line x1="39" y1="40" x2="51" y2="40" stroke="#38bdf8" strokeWidth="3" />
        <text x="45" y="21" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">
          +{nilaiSensor}V DC
        </text>
      </svg>
    );
  }

  if (tipe === "kapasitor") {
    return (
      <svg viewBox="0 0 90 70" className="w-24 h-18">
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

  if (tipe === "gerbang_logika") {
    return (
      <svg viewBox="0 0 110 70" className="w-28 h-18">
        <path
          d="M 25 14 L 58 14 A 22 21 0 0 1 58 56 L 25 56 Z"
          fill="#312e81"
          stroke="#818cf8"
          strokeWidth="3"
        />
        <line x1="6" y1="25" x2="25" y2="25" stroke="#94a3b8" strokeWidth="3" />
        <line x1="6" y1="45" x2="25" y2="45" stroke="#94a3b8" strokeWidth="3" />
        <line x1="80" y1="35" x2="104" y2="35" stroke={nyala ? "#34d399" : "#94a3b8"} strokeWidth="4" />
        <text x="48" y="39" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
          IC GATE
        </text>
      </svg>
    );
  }

  // Default untuk Blok MATLAB Simulink (Sine Wave, PID Controller, Transfer Function, Scope)
  return (
    <svg viewBox="0 0 130 68" className="w-32 h-16">
      <rect x="8" y="8" width="114" height="52" rx="8" fill="#1e293b" stroke="#f97316" strokeWidth="2.5" />
      <polygon points="4,28 12,34 4,40" fill="#facc15" />
      <polygon points="122,28 130,34 122,40" fill="#34d399" />
      <text x="65" y="31" textAnchor="middle" fill="#fdba74" fontSize="8" fontWeight="bold">
        SIMULINK BLOCK
      </text>
      <text x="65" y="45" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
        {tipe.toUpperCase()}
      </text>
    </svg>
  );
};