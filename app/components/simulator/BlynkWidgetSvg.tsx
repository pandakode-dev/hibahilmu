"use client";

import React from "react";

export type TipeWidgetBlynk =
  | "gauge"
  | "switch"
  | "slider"
  | "superchart"
  | "telegram_bot"
  | "whatsapp_bot"
  | "joystick"
  | "zergba"
  | "step_control"
  | "gps_map"
  | "webhook"
  | "timer_schedule"
  | "email_alert"
  | "led_status"
  | "lcd_terminal"
  | "alarm_notif";

export interface WidgetBlynkItem {
  id: string;
  tipe: TipeWidgetBlynk;
  kategoriWidget: "Kontrol & Input" | "Monitor & Grafik" | "Telegram & Notifikasi" | "Lanjutan & Peta";
  judul: string;
  virtualPin: string;
  satuan: string;
  warna: "emerald" | "amber" | "sky" | "indigo" | "rose";
  targetTipeKomponen: string;
}

export const KATALOG_GUDANG_WIDGET_BLYNK: Omit<WidgetBlynkItem, "id">[] = [
  {
    tipe: "gauge",
    kategoriWidget: "Monitor & Grafik",
    judul: "Gauge Meter Analog",
    virtualPin: "V0",
    satuan: "°C",
    warna: "amber",
    targetTipeKomponen: "dht22",
  },
  {
    tipe: "switch",
    kategoriWidget: "Kontrol & Input",
    judul: "Sakelar Switch ON/OFF",
    virtualPin: "V1",
    satuan: "BOOL",
    warna: "emerald",
    targetTipeKomponen: "solenoid_lock",
  },
  {
    tipe: "slider",
    kategoriWidget: "Kontrol & Input",
    judul: "Slider PWM / Servo",
    virtualPin: "V2",
    satuan: "°",
    warna: "indigo",
    targetTipeKomponen: "servo",
  },
  {
    tipe: "superchart",
    kategoriWidget: "Monitor & Grafik",
    judul: "SuperChart Grafik Live",
    virtualPin: "V3",
    satuan: "Grafik",
    warna: "emerald",
    targetTipeKomponen: "ultrasonik",
  },
  {
    tipe: "telegram_bot",
    kategoriWidget: "Telegram & Notifikasi",
    judul: "Telegram Bot Command",
    virtualPin: "V4",
    satuan: "@Bot",
    warna: "sky",
    targetTipeKomponen: "solenoid_lock",
  },
  {
    tipe: "whatsapp_bot",
    kategoriWidget: "Telegram & Notifikasi",
    judul: "WhatsApp Gateway Alert",
    virtualPin: "V5",
    satuan: "WA",
    warna: "emerald",
    targetTipeKomponen: "flame_sensor",
  },
  {
    tipe: "joystick",
    kategoriWidget: "Kontrol & Input",
    judul: "Joystick 2-Axis Motor",
    virtualPin: "V6",
    satuan: "X,Y",
    warna: "indigo",
    targetTipeKomponen: "kipas_dc",
  },
  {
    tipe: "zergba",
    kategoriWidget: "Kontrol & Input",
    judul: "zeRGBa Color Picker",
    virtualPin: "V7",
    satuan: "RGB",
    warna: "rose",
    targetTipeKomponen: "led_hijau",
  },
  {
    tipe: "step_control",
    kategoriWidget: "Kontrol & Input",
    judul: "Step Counter (+/-)",
    virtualPin: "V8",
    satuan: "Step",
    warna: "amber",
    targetTipeKomponen: "water_pump",
  },
  {
    tipe: "gps_map",
    kategoriWidget: "Lanjutan & Peta",
    judul: "GPS Map Tracker",
    virtualPin: "V9",
    satuan: "Lat/Lon",
    warna: "emerald",
    targetTipeKomponen: "esp32",
  },
  {
    tipe: "webhook",
    kategoriWidget: "Lanjutan & Peta",
    judul: "Webhook REST API",
    virtualPin: "V10",
    satuan: "JSON",
    warna: "sky",
    targetTipeKomponen: "rfid_rc522",
  },
  {
    tipe: "timer_schedule",
    kategoriWidget: "Kontrol & Input",
    judul: "Eventor Timer Jadwal",
    virtualPin: "V11",
    satuan: " Jam",
    warna: "amber",
    targetTipeKomponen: "water_pump",
  },
  {
    tipe: "email_alert",
    kategoriWidget: "Telegram & Notifikasi",
    judul: "Email SMTP Notifier",
    virtualPin: "V12",
    satuan: "Mail",
    warna: "indigo",
    targetTipeKomponen: "mq2_gas",
  },
  {
    tipe: "led_status",
    kategoriWidget: "Monitor & Grafik",
    judul: "LED Status Motion PIR",
    virtualPin: "V13",
    satuan: "PIR",
    warna: "rose",
    targetTipeKomponen: "pir_sensor",
  },
  {
    tipe: "lcd_terminal",
    kategoriWidget: "Monitor & Grafik",
    judul: "Blynk LCD 16x2",
    virtualPin: "V14",
    satuan: "LCD",
    warna: "emerald",
    targetTipeKomponen: "ir_obstacle",
  },
  {
    tipe: "alarm_notif",
    kategoriWidget: "Telegram & Notifikasi",
    judul: "Push Alarm Siren",
    virtualPin: "V15",
    satuan: "SIREN",
    warna: "rose",
    targetTipeKomponen: "flame_sensor",
  },
];

// Komponen Gambar Preview SVG Mini Beranimasi untuk Gudang Widget Blynk
export const VisualWidgetBlynkMini: React.FC<{ tipe: TipeWidgetBlynk }> = ({ tipe }) => {
  if (tipe === "gauge") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <path d="M 12 42 A 28 28 0 0 1 68 42" stroke="#334155" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 12 42 A 28 28 0 0 1 56 20" stroke="#facc15" strokeWidth="7" fill="none" strokeLinecap="round" className="animate-pulse" />
        <text x="40" y="42" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
          34°C
        </text>
      </svg>
    );
  }

  if (tipe === "switch") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <rect x="14" y="12" width="52" height="24" rx="12" fill="#10b981" />
        <circle cx="52" cy="24" r="9" fill="#ffffff" className="animate-pulse" />
        <text x="28" y="27" fill="#022c22" fontSize="8" fontWeight="900">
          ON
        </text>
      </svg>
    );
  }

  if (tipe === "slider" || tipe === "step_control") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <line x1="10" y1="28" x2="70" y2="28" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <line x1="10" y1="28" x2="50" y2="28" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="28" r="7" fill="#facc15" />
        <text x="40" y="15" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold">
          PWM 90°
        </text>
      </svg>
    );
  }

  if (tipe === "superchart") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <polyline
          points="8,38 22,24 36,30 50,14 64,20 74,8"
          stroke="#34d399"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
        />
        <line x1="8" y1="42" x2="74" y2="42" stroke="#475569" strokeWidth="1.5" />
      </svg>
    );
  }

  if (tipe === "telegram_bot") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <circle cx="40" cy="24" r="18" fill="#0284c7" className="animate-pulse" />
        <polygon points="29,24 50,15 45,34 38,27 34,30" fill="#ffffff" />
      </svg>
    );
  }

  if (tipe === "whatsapp_bot") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <circle cx="40" cy="24" r="18" fill="#16a34a" className="animate-pulse" />
        <path d="M 32 18 Q 30 26, 42 32 L 47 29" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (tipe === "joystick") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <circle cx="40" cy="24" r="18" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
        <circle cx="44" cy="20" r="7" fill="#38bdf8" className="animate-bounce" />
      </svg>
    );
  }

  if (tipe === "zergba") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <circle cx="30" cy="24" r="11" fill="#ef4444" opacity="0.85" />
        <circle cx="44" cy="18" r="11" fill="#22c55e" opacity="0.85" />
        <circle cx="44" cy="30" r="11" fill="#3b82f6" opacity="0.85" />
      </svg>
    );
  }

  if (tipe === "gps_map") {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10">
        <rect x="12" y="8" width="56" height="32" rx="5" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
        <circle cx="40" cy="22" r="5" fill="#ef4444" className="animate-ping" />
        <circle cx="40" cy="22" r="4" fill="#fde047" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 48" className="w-16 h-10">
      <rect x="12" y="10" width="56" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
      <text x="40" y="28" textAnchor="middle" fill="#fde047" fontSize="8.5" fontFamily="monospace" fontWeight="900">
        {tipe.slice(0, 7).toUpperCase()}
      </text>
    </svg>
  );
};