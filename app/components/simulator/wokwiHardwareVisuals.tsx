"use client";

import React from "react";
import * as WokwiMainCanvas from "./ElectronicAndIotCanvas";

export interface TitikPinFisik {
  idPin: string;
  labelPin: string;
  x: number;
  y: number;
  warnaPin: string;
  posisiKomponen: "esp32" | "periferal";
}

export type TipePeriferalWokwi =
  | "led_merah"
  | "push_button"
  | "ldr_relay"
  | "servo_solenoid"
  | "dht22_greenhouse"
  | "mq2_alarm"
  | "dual_esp32_uart"
  | "relay_4ch_plc"
  | "triple_mcu"
  | "npk_rs485"
  | "gps_neo6m"
  | "baterai_18650"
  | "struct_ram"
  | "esp_now_radio"
  | "mesh_10_node";

export type KategoriFilterGudang48 =
  | "Semua"
  | "Microcontroller"
  | "Baterai & Daya"
  | "Sensor (25)"
  | "Modul Relay"
  | "Aktuator & Motor"
  | "Pasif & Input"
  | "Aktuator & Relay";

export interface ItemGudang48Master {
  id: string;
  nama: string;
  badgeAtas: string;
  jumlahPinLabel: string;
  kategoriFilter: KategoriFilterGudang48;
  cocokUntukDropZone: "esp32_board" | TipePeriferalWokwi | "universal_part";
  levelTerkait: number[];
  rawSourceItem?: any;
}

// ============================================================================
// DAFTAR 48 ITEM MASTER (URUTAN & NAMA SAMA PERSIS DENGAN STUDIO WOKWI UTAMA)
// ============================================================================
const FALLBACK_48_ITEMS_IDENTIK: ItemGudang48Master[] = [
  // BARIS 1 (1 - 10):
  { id: "esp32_c6", nama: "ESP32-C6 DevKit", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "esp32_board", levelTerkait: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  { id: "esp32_devkit", nama: "ESP32 DevKit V1", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "esp32_board", levelTerkait: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  { id: "arduino_uno", nama: "Arduino Uno (28P)", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "28P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "triple_mcu", levelTerkait: [8, 9] },
  { id: "nodemcu_esp8266", nama: "NodeMCU ESP8266", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "esp_now_radio", levelTerkait: [7, 14, 15] },
  { id: "stm32_bluepill", nama: "STM32 BluePill", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "32P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "triple_mcu", levelTerkait: [9] },
  { id: "rpi_pico", nama: "Raspberry Pi Pico", badgeAtas: "MICROCONTROLLER", jumlahPinLabel: "32P", kategoriFilter: "Microcontroller", cocokUntukDropZone: "triple_mcu", levelTerkait: [9] },
  { id: "socket_baterai", nama: "Socket Baterai 18650", badgeAtas: "BATERAI", jumlahPinLabel: "2P", kategoriFilter: "Baterai & Daya", cocokUntukDropZone: "baterai_18650", levelTerkait: [12, 15] },
  { id: "sensor_tegangan", nama: "Sensor Tegangan 0-25V", badgeAtas: "DAYA", jumlahPinLabel: "5P", kategoriFilter: "Baterai & Daya", cocokUntukDropZone: "baterai_18650", levelTerkait: [12, 15] },
  { id: "relay_1ch", nama: "Relay 1-Channel 5V", badgeAtas: "MODUL", jumlahPinLabel: "6P", kategoriFilter: "Modul Relay", cocokUntukDropZone: "ldr_relay", levelTerkait: [3, 4, 6] },
  { id: "relay_2ch", nama: "Relay 2-Channel 5V", badgeAtas: "MODUL", jumlahPinLabel: "10P", kategoriFilter: "Modul Relay", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },

  // BARIS 2 (11 - 20):
  { id: "relay_4ch", nama: "Relay 4-Channel PLC", badgeAtas: "MODUL", jumlahPinLabel: "18P", kategoriFilter: "Modul Relay", cocokUntukDropZone: "relay_4ch_plc", levelTerkait: [8] },
  { id: "gps_neo6m", nama: "GPS NEO-6M u-blox", badgeAtas: "GERAK", jumlahPinLabel: "5P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "gps_neo6m", levelTerkait: [11, 15] },
  { id: "sensor_suhu_dht", nama: "Sensor Suhu DHT22", badgeAtas: "CAHAYA,", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 13, 15] },
  { id: "ultrasonik_hcsr04", nama: "Ultrasonik HC-SR04", badgeAtas: "GERAK", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "sensor_pir", nama: "Sensor Gerak PIR", badgeAtas: "GERAK", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "sensor_ir", nama: "Sensor Infrared Obstacle", badgeAtas: "GERAK", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "sensor_ldr", nama: "Sensor Cahaya LDR", badgeAtas: "CAHAYA,", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "sensor_flame", nama: "Sensor Api Flame", badgeAtas: "CAHAYA,", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "kelembapan_tanah", nama: "Kelembapan Tanah Soil", badgeAtas: "TANAH", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sensor_hujan", nama: "Sensor Hujan Raindrop", badgeAtas: "AIR", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },

  // BARIS 3 (21 - 30):
  { id: "sensor_mq2", nama: "Sensor Gas MQ-2", badgeAtas: "GAS", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "rfid_rc522", nama: "RFID Card Reader RC522", badgeAtas: "AKSES", jumlahPinLabel: "8P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "solenoid_lock", nama: "Solenoid Lock 12V", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "pompa_air", nama: "Pompa Air Mini 5V", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 6] },
  { id: "servo_sg90", nama: "Servo SG90 180°", badgeAtas: "AKTUATOR", jumlahPinLabel: "3P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "servo_mg996r", nama: "Servo MG996R 360°", badgeAtas: "AKTUATOR", jumlahPinLabel: "3P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "relay_4ch_plc", levelTerkait: [8] },
  { id: "kipas_dc", nama: "Kipas DC (PWM)", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "layar_oled", nama: "Layar OLED I2C", badgeAtas: "LAYAR", jumlahPinLabel: "4P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "dual_esp32_uart", levelTerkait: [7, 13] },
  { id: "lcd_16x2", nama: "LCD 16x2 I2C (4p)", badgeAtas: "LAYAR", jumlahPinLabel: "4P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "dual_esp32_uart", levelTerkait: [7] },
  { id: "buzzer_piezo", nama: "Buzzer Piezo (2p)", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },

  // BARIS 4 (31 - 40):
  { id: "keypad_4x4", nama: "Keypad Matriks 4x4", badgeAtas: "PASIF", jumlahPinLabel: "8P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "push_button", levelTerkait: [2] },
  { id: "led_hijau", nama: "LED Hijau 5mm", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "led_merah", levelTerkait: [1, 2] },
  { id: "led_merah", nama: "LED Merah 5mm", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "led_merah", levelTerkait: [1, 2] },
  { id: "resistor_gelang", nama: "Resistor Gelang 220Ω", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "led_merah", levelTerkait: [1] },
  { id: "potensiometer", nama: "Potensiometer 10kΩ", badgeAtas: "PASIF", jumlahPinLabel: "3P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "sensor_npk", nama: "Sensor Pupuk NPK", badgeAtas: "TANAH", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "npk_rs485", levelTerkait: [10, 13, 15] },
  { id: "sensor_ph", nama: "Sensor pH Air (0-14)", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sensor_tds", nama: "Sensor TDS Meter", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sensor_turbidity", nama: "Sensor Turbidity", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sensor_do", nama: "Sensor DO Oksigen", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },

  // BARIS 5 (41 - 48):
  { id: "sensor_flow", nama: "Sensor Debit Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sensor_water_lvl", nama: "Sensor Level Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sensor_ds18b20", nama: "Sensor Suhu Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 15] },
  { id: "sensor_heart", nama: "Sensor Detak Jantung", badgeAtas: "MEDIS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "struct_ram", levelTerkait: [13] },
  { id: "sensor_mq135", nama: "Sensor Udara MQ-135", badgeAtas: "GAS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "sensor_co", nama: "Sensor Gas CO", badgeAtas: "GAS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "sensor_pzem", nama: "Sensor Daya PZEM", badgeAtas: "DAYA", jumlahPinLabel: "3P", kategoriFilter: "Baterai & Daya", cocokUntukDropZone: "baterai_18650", levelTerkait: [12] },
  { id: "push_button_sw", nama: "Push Button Switch", badgeAtas: "PASIF", jumlahPinLabel: "4P", kategoriFilter: "Pasif & Input", cocokUntukDropZone: "push_button", levelTerkait: [2] },
];

export function ambilGudangKomponen48Terpadu(): ItemGudang48Master[] {
  const anyCanvas = WokwiMainCanvas as any;
  const sumberEksternal =
    anyCanvas.GUDANG_KOMPONEN ||
    anyCanvas.DAFTAR_KOMPONEN ||
    anyCanvas.KATALOG_KOMPONEN ||
    anyCanvas.WOKWI_COMPONENTS;

  if (Array.isArray(sumberEksternal) && sumberEksternal.length >= 20) {
    return sumberEksternal.map((raw: any, idx: number) => {
      const pasangan =
        FALLBACK_48_ITEMS_IDENTIK[idx] || FALLBACK_48_ITEMS_IDENTIK[0];
      return {
        ...pasangan,
        // Tetap gunakan ID standar atau gabungan agar pencocokan gambar SVG 100% akurat!
        id: pasangan.id,
        nama: raw.nama || raw.label || pasangan.nama,
        badgeAtas: (raw.kategori || pasangan.badgeAtas).toUpperCase(),
        jumlahPinLabel: raw.pins
          ? `${raw.pins.length}P`
          : raw.jumlahPinLabel || pasangan.jumlahPinLabel,
        rawSourceItem: raw,
      };
    });
  }
  return FALLBACK_48_ITEMS_IDENTIK;
}

export const GUDANG_KOMPONEN_48_MASTER: ItemGudang48Master[] =
  ambilGudangKomponen48Terpadu();

// ============================================================================
// PENGGAMBAR IKON MINIATUR SVG 48 KOMPONEN LENGKAP (DETEKSI ID & NAMA CERDAS)
// ============================================================================
export const MiniaturSvgGudang48: React.FC<{
  idItem: string;
  namaItem?: string;
}> = ({ idItem, namaItem = "" }) => {
  const key = `${idItem} ${namaItem}`.toLowerCase();

  // 1. ESP32 / NodeMCU
  if (key.includes("esp32") || key.includes("nodemcu") || key.includes("esp8266")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={18} y={3} width={28} height={50} rx={3} fill="#111827" stroke="#374151" strokeWidth={1.5} />
        <rect x={22} y={6} width={20} height={16} rx={1.5} fill="#d1d5db" stroke="#9ca3af" />
        <rect x={24} y={26} width={16} height={14} rx={1.5} fill="#030712" />
        {[8, 13, 18, 23, 28, 33, 38, 43, 48].map((y) => (
          <g key={y}>
            <circle cx={19.5} cy={y} r={1.2} fill="#facc15" />
            <circle cx={44.5} cy={y} r={1.2} fill="#22c55e" />
          </g>
        ))}
        <rect x={27} y={49} width={10} height={5} rx={1} fill="#9ca3af" />
      </svg>
    );
  }

  // 2. Arduino Uno
  if (key.includes("uno") || key.includes("arduino")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={8} width={48} height={40} rx={4} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
        <rect x={5} y={14} width={8} height={10} rx={1} fill="#d1d5db" />
        <rect x={6} y={34} width={9} height={8} rx={1} fill="#111827" />
        <rect x={24} y={32} width={22} height={8} rx={1} fill="#1e293b" />
        <text x={32} y={22} textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">ARDUINO UNO R3</text>
      </svg>
    );
  }

  // 3. STM32 BluePill
  if (key.includes("stm32") || key.includes("bluepill")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={20} y={4} width={24} height={48} rx={3} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
        <rect x={26} y={20} width={12} height={12} rx={1.5} fill="#0f172a" />
        <circle cx={32} cy={12} r={2} fill="#facc15" />
      </svg>
    );
  }

  // 4. Raspberry Pi Pico
  if (key.includes("pico") || key.includes("raspberry")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={20} y={4} width={24} height={48} rx={3} fill="#15803d" stroke="#4ade80" strokeWidth={1.5} />
        <rect x={26} y={20} width={12} height={12} rx={1.5} fill="#0f172a" />
        <circle cx={32} cy={12} r={2} fill="#f8fafc" />
      </svg>
    );
  }

  // 5. Socket Baterai 18650
  if (key.includes("baterai") || key.includes("18650")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={10} width={48} height={34} rx={5} fill="#1e293b" stroke="#f59e0b" strokeWidth={1.5} />
        <rect x={13} y={14} width={38} height={11} rx={3} fill="#2563eb" />
        <rect x={13} y={28} width={38} height={11} rx={3} fill="#2563eb" />
        <text x={32} y={21} textAnchor="middle" fill="#fef08a" fontSize="4.8" fontWeight="bold">LI-ION 18650 4.2V</text>
        <text x={32} y={35} textAnchor="middle" fill="#ffffff" fontSize="4.8" fontWeight="bold">TOTAL: 8.4V DC</text>
      </svg>
    );
  }

  // 6. Sensor Tegangan 0-25V
  if (key.includes("tegangan") || key.includes("voltage")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={8} width={40} height={36} rx={4} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
        <rect x={16} y={13} width={14} height={10} rx={1.5} fill="#0284c7" stroke="#bae6fd" />
        <rect x={34} y={13} width={14} height={10} rx={1.5} fill="#0284c7" stroke="#bae6fd" />
        <text x={32} y={36} textAnchor="middle" fill="#fde047" fontSize="4.8" fontWeight="bold">VOLTAGE 0-25V</text>
        <line x1={26} y1={44} x2={26} y2={52} stroke="#facc15" strokeWidth={2} />
        <line x1={32} y1={44} x2={32} y2={52} stroke="#facc15" strokeWidth={2} />
        <line x1={38} y1={44} x2={38} y2={52} stroke="#facc15" strokeWidth={2} />
      </svg>
    );
  }

  // 7. Relay 1, 2, 4 Channel
  if (key.includes("relay 4") || key.includes("relay_4ch")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={4} y={10} width={56} height={36} rx={4} fill="#991b1b" stroke="#f87171" strokeWidth={1.5} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={8 + i * 12.5} y={17} width={10.5} height={20} rx={1.5} fill="#2563eb" stroke="#93c5fd" />
        ))}
        <rect x={8} y={10} width={48} height={4} fill="#16a34a" />
      </svg>
    );
  }
  if (key.includes("relay 2") || key.includes("relay_2ch")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={8} width={48} height={40} rx={4} fill="#991b1b" stroke="#f87171" strokeWidth={1.5} />
        <rect x={12} y={15} width={18} height={22} rx={2} fill="#2563eb" stroke="#93c5fd" />
        <rect x={34} y={15} width={18} height={22} rx={2} fill="#2563eb" stroke="#93c5fd" />
        <rect x={14} y={8} width={36} height={5} fill="#16a34a" />
      </svg>
    );
  }
  if (key.includes("relay")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={14} y={8} width={36} height={40} rx={4} fill="#991b1b" stroke="#f87171" strokeWidth={1.5} />
        <rect x={19} y={14} width={26} height={22} rx={2} fill="#2563eb" stroke="#93c5fd" />
        <rect x={24} y={8} width={16} height={5} fill="#16a34a" />
      </svg>
    );
  }

  // 8. GPS NEO-6M
  if (key.includes("gps") || key.includes("neo")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={10} width={48} height={36} rx={4} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
        <rect x={32} y={15} width={20} height={20} rx={3} fill="#d97706" stroke="#fef08a" strokeWidth={1.5} />
        <circle cx={42} cy={25} r={4} fill="#9ca3af" />
        <rect x={12} y={16} width={16} height={12} rx={1.5} fill="#f8fafc" />
        <text x={20} y={24} textAnchor="middle" fill="#0f172a" fontSize="4.5" fontWeight="bold">u-blox</text>
      </svg>
    );
  }

  // 9. Sensor Suhu DHT22
  if (key.includes("dht") || (key.includes("suhu") && !key.includes("air"))) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={18} y={6} width={26} height={34} rx={4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
        <line x1={22} y1={13} x2={40} y2={13} stroke="#94a3b8" strokeWidth={1.5} />
        <line x1={22} y1={19} x2={40} y2={19} stroke="#94a3b8" strokeWidth={1.5} />
        <text x={31} y={32} textAnchor="middle" fill="#0284c7" fontSize="5.5" fontWeight="bold">26.5°C</text>
        <circle cx={48} cy={32} r={4} fill="#22c55e" />
        <line x1={48} y1={16} x2={48} y2={32} stroke="#22c55e" strokeWidth={3} strokeLinecap="round" />
      </svg>
    );
  }

  // 10. Ultrasonik HC-SR04
  if (key.includes("ultrasonik") || key.includes("sr04")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={6} y={12} width={52} height={28} rx={4} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
        <circle cx={20} cy={26} r={9} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
        <circle cx={44} cy={26} r={9} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
        <circle cx={20} cy={26} r={4} fill="#334155" />
        <circle cx={44} cy={26} r={4} fill="#334155" />
      </svg>
    );
  }

  // 11. Sensor PIR
  if (key.includes("pir")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <path d="M 20 24 A 12 12 0 0 1 44 24 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth={1.5} />
        <rect x={14} y={24} width={36} height={16} rx={3} fill="#15803d" stroke="#4ade80" strokeWidth={1.5} />
        <text x={32} y={34} textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">PIR HC-SR501</text>
      </svg>
    );
  }

  // 12. Sensor Infrared Obstacle
  if (key.includes("infrared") || key.includes("obstacle") || key.includes("sensor_ir")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <circle cx={24} cy={14} r={4} fill="#0f172a" stroke="#ef4444" strokeWidth={1.5} />
        <circle cx={40} cy={14} r={4} fill="#38bdf8" stroke="#bae6fd" strokeWidth={1.5} />
        <rect x={14} y={20} width={36} height={18} rx={3} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
        <text x={32} y={31} textAnchor="middle" fill="#ffffff" fontSize="4.8" fontWeight="bold">IR OBSTACLE</text>
      </svg>
    );
  }

  // 13. Sensor Cahaya LDR
  if (key.includes("ldr") || key.includes("cahaya")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={14} y={12} width={36} height={26} rx={4} fill="#111827" stroke="#facc15" strokeWidth={1.5} />
        <circle cx={32} cy={25} r={8} fill="#ef4444" stroke="#fde047" strokeWidth={1.5} />
        <path d="M 27 23 L 37 23 M 27 27 L 37 27" stroke="#fef08a" strokeWidth={1.5} />
      </svg>
    );
  }

  // 14. Sensor Api Flame
  if (key.includes("flame") || key.includes("api")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <circle cx={32} cy={11} r={4} fill="#78350f" stroke="#facc15" strokeWidth={1.5} />
        <rect x={14} y={16} width={36} height={22} rx={4} fill="#991b1b" stroke="#f87171" strokeWidth={1.5} />
        <text x={32} y={29} textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">FLAME (80%)</text>
      </svg>
    );
  }

  // 15. Kelembapan Tanah Soil
  if (key.includes("kelembapan") || key.includes("soil")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={24} width={40} height={18} rx={4} fill="#0369a1" stroke="#38bdf8" strokeWidth={1.5} />
        <rect x={20} y={10} width={14} height={6} rx={1.5} fill="#ef4444" />
        <line x1={23} y1={16} x2={23} y2={36} stroke="#facc15" strokeWidth={3.5} />
        <line x1={31} y1={16} x2={31} y2={36} stroke="#facc15" strokeWidth={3.5} />
      </svg>
    );
  }

  // 16. Sensor Hujan Raindrop
  if (key.includes("hujan") || key.includes("rain")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={12} width={40} height={26} rx={4} fill="#0369a1" stroke="#facc15" strokeWidth={1.5} />
        {[18, 24, 30, 36, 42, 46].map((x) => (
          <line key={x} x1={x} y1={15} x2={x} y2={35} stroke="#fde047" strokeWidth={1.8} />
        ))}
      </svg>
    );
  }

  // 17. Sensor Gas MQ-2 / MQ-135 / CO
  if (key.includes("mq") || key.includes("gas") || key.includes("udara")) {
    const warnaPcb = key.includes("135") ? "#1d4ed8" : key.includes("co") ? "#4338ca" : "#1e3a8a";
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={10} width={40} height={32} rx={4} fill={warnaPcb} stroke="#60a5fa" strokeWidth={1.5} />
        <circle cx={32} cy={23} r={10} fill="#94a3b8" stroke="#f8fafc" strokeWidth={1.5} />
        <circle cx={32} cy={23} r={6} fill="#334155" />
        <text x={32} y={39} textAnchor="middle" fill="#fde047" fontSize="4.8" fontWeight="bold">
          {key.includes("135") ? "MQ135 280ppm" : key.includes("co") ? "CO 45ppm" : "MQ-2 LPG"}
        </text>
      </svg>
    );
  }

  // 18. RFID RC522
  if (key.includes("rfid") || key.includes("rc522")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={10} y={8} width={44} height={36} rx={4} fill="#1e3a8a" stroke="#38bdf8" strokeWidth={1.5} />
        <rect x={16} y={13} width={32} height={20} rx={2} fill="none" stroke="#fde047" strokeWidth={1.2} />
        <circle cx={32} cy={23} r={6} fill="none" stroke="#fde047" strokeWidth={1.2} />
        <text x={32} y={40} textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">RFID RC522</text>
      </svg>
    );
  }

  // 19. Solenoid Door Lock 12V
  if (key.includes("solenoid")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={10} y={14} width={32} height={24} rx={3} fill="#475569" stroke="#cbd5e1" strokeWidth={1.5} />
        <rect x={42} y={20} width={14} height={12} rx={2} fill="#facc15" stroke="#ca8a04" strokeWidth={1.2} />
        <circle cx={20} cy={26} r={3} fill="#0f172a" />
        <circle cx={32} cy={26} r={3} fill="#0f172a" />
      </svg>
    );
  }

  // 20. Pompa Air Mini & Motor DC
  if (key.includes("pompa") || key.includes("motor dc")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={16} y={14} width={32} height={26} rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
        <circle cx={32} cy={27} r={8} fill="#e2e8f0" stroke="#0f172a" strokeWidth={1.5} />
        <circle cx={32} cy={27} r={3} fill="#0284c7" />
        <rect x={28} y={7} width={8} height={7} rx={1.5} fill="#38bdf8" />
        <text x={32} y={47} textAnchor="middle" fill="#34d399" fontSize="5" fontWeight="bold">PUMP / MOTOR</text>
      </svg>
    );
  }

  // 21. Servo SG90 180 & Servo MG996R 360
  if (key.includes("servo")) {
    const is360 = key.includes("360") || key.includes("mg996");
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={16} width={30} height={24} rx={3} fill={is360 ? "#1e293b" : "#0284c7"} stroke="#38bdf8" strokeWidth={1.5} />
        <circle cx={34} cy={28} r={6} fill="#f8fafc" />
        <line x1={34} y1={28} x2={52} y2={14} stroke="#facc15" strokeWidth={4.5} strokeLinecap="round" />
        <text x={27} y={37} textAnchor="middle" fill="#ffffff" fontSize="4.8" fontWeight="bold">
          {is360 ? "MG996R 360°" : "SG90 180°"}
        </text>
      </svg>
    );
  }

  // 22. Kipas DC (PWM)
  if (key.includes("kipas") || key.includes("fan")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={14} y={8} width={36} height={36} rx={6} fill="#1e293b" stroke="#64748b" strokeWidth={1.5} />
        <circle cx={32} cy={26} r={14} fill="#0f172a" stroke="#38bdf8" strokeWidth={1.2} />
        <path d="M 32 14 L 36 24 L 28 24 Z M 32 38 L 36 28 L 28 28 Z M 20 26 L 30 22 L 30 30 Z M 44 26 L 34 22 L 34 30 Z" fill="#38bdf8" />
        <circle cx={32} cy={26} r={3.5} fill="#facc15" />
      </svg>
    );
  }

  // 23. Layar OLED I2C & LCD 16x2
  if (key.includes("oled") || key.includes("lcd") || key.includes("layar")) {
    const isLcd = key.includes("lcd") || key.includes("16x2");
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={10} width={48} height={32} rx={4} fill={isLcd ? "#15803d" : "#1e3a8a"} stroke={isLcd ? "#4ade80" : "#38bdf8"} strokeWidth={1.5} />
        <rect x={12} y={15} width={40} height={22} rx={2} fill={isLcd ? "#a3e635" : "#090d16"} />
        <text x={32} y={28} textAnchor="middle" fill={isLcd ? "#0f172a" : "#38bdf8"} fontSize="5.8" fontWeight="bold">
          {isLcd ? "LCD 16x2 I2C" : "OLED 128x64"}
        </text>
      </svg>
    );
  }

  // 24. Buzzer Piezo
  if (key.includes("buzzer")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <circle cx={32} cy={26} r={16} fill="#111827" stroke="#94a3b8" strokeWidth={2} />
        <circle cx={32} cy={26} r={6} fill="#e2e8f0" />
        <path d="M 50 18 Q 56 26 50 34" fill="none" stroke="#f43f5e" strokeWidth={2} />
      </svg>
    );
  }

  // 25. Keypad Matriks 4x4 (Persis Gambar Screenshot!)
  if (key.includes("keypad")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={12} y={4} width={40} height={46} rx={4} fill="#1e293b" stroke="#64748b" strokeWidth={1.5} />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={16 + c * 8.2}
              y={8 + r * 9.5}
              width={6.5}
              height={7}
              rx={1.2}
              fill={c === 3 ? "#ef4444" : r === 3 && c !== 1 ? "#f59e0b" : "#0284c7"}
            />
          ))
        )}
      </svg>
    );
  }

  // 26. LED Hijau 5mm & LED Merah 5mm (Persis Gambar Screenshot!)
  if (key.includes("led")) {
    const isHijau = key.includes("hijau") || key.includes("green");
    const warna = isHijau ? "#22c55e" : "#ef4444";
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <line x1={28} y1={30} x2={28} y2={50} stroke="#94a3b8" strokeWidth={2.5} />
        <line x1={36} y1={30} x2={36} y2={46} stroke="#94a3b8" strokeWidth={2.5} />
        <path d="M 21 30 L 21 17 A 11 11 0 0 1 43 17 L 43 30 Z" fill={warna} stroke="#ffffff" strokeWidth={1.5} />
      </svg>
    );
  }

  // 27. Resistor Gelang 220 Ohm (Persis Gambar Screenshot!)
  if (key.includes("resistor")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <line x1={6} y1={26} x2={58} y2={26} stroke="#94a3b8" strokeWidth={2.5} />
        <rect x={16} y={19} width={32} height={14} rx={4} fill="#d97706" stroke="#fde047" strokeWidth={1.2} />
        <line x1={23} y1={19} x2={23} y2={33} stroke="#ef4444" strokeWidth={2.8} />
        <line x1={30} y1={19} x2={30} y2={33} stroke="#ef4444" strokeWidth={2.8} />
        <line x1={37} y1={19} x2={37} y2={33} stroke="#78350f" strokeWidth={2.8} />
        <text x={32} y={44} textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="bold">220 Ω</text>
      </svg>
    );
  }

  // 28. Potensiometer 10k (Persis Gambar Screenshot!)
  if (key.includes("potensiometer") || key.includes("potensio")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={14} y={8} width={36} height={28} rx={4} fill="#1e3a8a" stroke="#facc15" strokeWidth={1.5} />
        <circle cx={32} cy={22} r={9} fill="#0f172a" stroke="#38bdf8" strokeWidth={1.5} />
        <line x1={32} y1={22} x2={39} y2={16} stroke="#facc15" strokeWidth={2.2} />
        <line x1={23} y1={36} x2={23} y2={49} stroke="#facc15" strokeWidth={2.2} />
        <line x1={32} y1={36} x2={32} y2={49} stroke="#facc15" strokeWidth={2.2} />
        <line x1={41} y1={36} x2={41} y2={49} stroke="#facc15" strokeWidth={2.2} />
      </svg>
    );
  }

  // 29. Sensor Pupuk NPK Tanah (Persis Gambar Screenshot!)
  if (key.includes("npk") || key.includes("pupuk")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={10} y={12} width={24} height={16} rx={3} fill="#78350f" stroke="#facc15" strokeWidth={1.2} />
        <line x1={15} y1={28} x2={15} y2={46} stroke="#cbd5e1" strokeWidth={2.5} />
        <line x1={22} y1={28} x2={22} y2={46} stroke="#cbd5e1" strokeWidth={2.5} />
        <line x1={29} y1={28} x2={29} y2={46} stroke="#cbd5e1" strokeWidth={2.5} />
        <rect x={37} y={10} width={17} height={32} rx={2.5} fill="#0f172a" stroke="#34d399" strokeWidth={1.2} />
        <text x={45.5} y={20} textAnchor="middle" fill="#34d399" fontSize="5" fontWeight="bold">N:145</text>
        <text x={45.5} y={28} textAnchor="middle" fill="#facc15" fontSize="5" fontWeight="bold">P:62</text>
        <text x={45.5} y={36} textAnchor="middle" fill="#38bdf8" fontSize="5" fontWeight="bold">K:190</text>
      </svg>
    );
  }

  // 30. Sensor Air (pH, TDS, Turbidity, DO, Debit, Level, Suhu Air - Persis Gambar Screenshot!)
  if (
    key.includes("ph") ||
    key.includes("tds") ||
    key.includes("turbid") ||
    key.includes("do ") ||
    key.includes("oksigen") ||
    key.includes("debit") ||
    key.includes("flow") ||
    key.includes("level") ||
    key.includes("ds18b20") ||
    key.includes("air")
  ) {
    const warnaKiri = key.includes("ph")
      ? "#2563eb"
      : key.includes("do") || key.includes("oksigen")
      ? "#7c3aed"
      : key.includes("debit") || key.includes("flow")
      ? "#059669"
      : "#1e293b";
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={8} y={14} width={22} height={26} rx={3} fill={warnaKiri} stroke="#60a5fa" strokeWidth={1.5} />
        <rect x={36} y={12} width={18} height={28} rx={3} fill="#065f46" stroke="#34d399" strokeWidth={1.5} />
        <line x1={30} y1={26} x2={36} y2={26} stroke="#facc15" strokeWidth={2} />
        <line x1={45} y1={7} x2={45} y2={38} stroke="#38bdf8" strokeWidth={3.5} />
        <text x={19} y={30} textAnchor="middle" fill="#fde047" fontSize="5" fontWeight="bold">
          {key.includes("ph") ? "7.0 pH" : key.includes("tds") ? "320ppm" : "WATER"}
        </text>
      </svg>
    );
  }

  // 31. Sensor Detak Jantung Medis (Persis Gambar Screenshot!)
  if (key.includes("jantung") || key.includes("heart") || key.includes("medis")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={10} y={12} width={44} height={30} rx={4} fill="#881337" stroke="#fb7185" strokeWidth={1.5} />
        <polyline points="14,28 24,28 28,16 33,36 37,25 50,25" fill="none" stroke="#ffffff" strokeWidth={2} />
        <text x={32} y={39} textAnchor="middle" fill="#fecdd3" fontSize="4.5" fontWeight="bold">82 BPM (98%)</text>
      </svg>
    );
  }

  // 32. Sensor Daya PZEM (Persis Gambar Screenshot!)
  if (key.includes("pzem") || key.includes("daya")) {
    return (
      <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
        <rect x={10} y={12} width={30} height={28} rx={3} fill="#065f46" stroke="#34d399" strokeWidth={1.5} />
        <rect x={15} y={17} width={20} height={10} rx={1.5} fill="#0f172a" />
        <circle cx={48} cy={26} r={8} fill="none" stroke="#38bdf8" strokeWidth={2.2} strokeDasharray="3 2" />
        <text x={25} y={36} textAnchor="middle" fill="#fde047" fontSize="4.8" fontWeight="bold">480W 220V</text>
      </svg>
    );
  }

  // 33. Push Button Tactile Switch (4P)
  return (
    <svg viewBox="0 0 64 56" className="w-14 h-12 mx-auto">
      <rect x={16} y={10} width={32} height={32} rx={5} fill="#334155" stroke="#94a3b8" strokeWidth={1.5} />
      <circle cx={21} cy={15} r={2} fill="#cbd5e1" />
      <circle cx={43} cy={15} r={2} fill="#cbd5e1" />
      <circle cx={21} cy={37} r={2} fill="#cbd5e1" />
      <circle cx={43} cy={37} r={2} fill="#cbd5e1" />
      <circle cx={32} cy={26} r={9} fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} />
    </svg>
  );
};

export interface SpesifikasiHardwareLevel {
  level: number;
  tipeVisualPeriferal: TipePeriferalWokwi;
  namaPeriferal: string;
  pinEsp32Tersedia: TitikPinFisik[];
  pinPeriferalTersedia: TitikPinFisik[];
  sambunganWajib: {
    dariPinEsp32: string;
    kePinPeriferal: string;
    warnaKabel: string;
    keteranganJalur: string;
  }[];
  daftarClueLatihan: string[];
}

export const PIN_FISIK_ESP32_STANDAR: TitikPinFisik[] = [
  { idPin: "ESP_3V3", labelPin: "3V3", x: 178, y: 56, warnaPin: "#ef4444", posisiKomponen: "esp32" },
  { idPin: "ESP_GND", labelPin: "GND", x: 178, y: 78, warnaPin: "#64748b", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO2", labelPin: "GPIO 2", x: 178, y: 100, warnaPin: "#facc15", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO4", labelPin: "GPIO 4", x: 178, y: 122, warnaPin: "#38bdf8", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO13", labelPin: "GPIO 13", x: 178, y: 144, warnaPin: "#a855f7", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO15", labelPin: "GPIO 15", x: 178, y: 166, warnaPin: "#10b981", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO16", labelPin: "RX2 (16)", x: 178, y: 188, warnaPin: "#06b6d4", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO17", labelPin: "TX2 (17)", x: 178, y: 210, warnaPin: "#f97316", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO35", labelPin: "GPIO 35", x: 42, y: 56, warnaPin: "#f59e0b", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO19", labelPin: "GPIO 19", x: 42, y: 78, warnaPin: "#ec4899", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO25", labelPin: "GPIO 25", x: 42, y: 100, warnaPin: "#3b82f6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO26", labelPin: "GPIO 26", x: 42, y: 122, warnaPin: "#eab308", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO27", labelPin: "GPIO 27", x: 42, y: 144, warnaPin: "#14b8a6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO32", labelPin: "GPIO 32", x: 42, y: 166, warnaPin: "#f43f5e", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO33", labelPin: "GPIO 33", x: 42, y: 188, warnaPin: "#8b5cf6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO34", labelPin: "GPIO 34", x: 42, y: 210, warnaPin: "#22c55e", posisiKomponen: "esp32" },
];

export const SPESIFIKASI_HARDWARE_15_LEVEL: Record<number, SpesifikasiHardwareLevel> = {
  1: {
    level: 1,
    tipeVisualPeriferal: "led_merah",
    namaPeriferal: "LED Merah 5mm + Resistor 220Ω",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "LED_ANODA", labelPin: "Anoda (+)", x: 365, y: 105, warnaPin: "#ef4444", posisiKomponen: "periferal" },
      { idPin: "LED_KATODA", labelPin: "Katoda (-)", x: 365, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO2", kePinPeriferal: "LED_ANODA", warnaKabel: "#ef4444", keteranganJalur: "Klik kaki [GPIO 2] di ESP32 lalu klik kaki [Anoda (+)] di LED" },
      { dariPinEsp32: "ESP_GND", kePinPeriferal: "LED_KATODA", warnaKabel: "#64748b", keteranganJalur: "Klik kaki [GND] di ESP32 lalu klik kaki [Katoda (-)] di LED" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Gudang 48 Item): Tarik 'ESP32 DevKit V1' ke kotak kiri, dan tarik 'LED Merah 5mm' ke kotak kanan.",
      "Clue 2 (Klik 2 Titik Pin): Klik bulatan 'GPIO 2' -> 'Anoda (+)', lalu klik 'GND' -> 'Katoda (-)'.",
      "Clue 3 (Kode C++): Ketik pinMode(2, OUTPUT); di setup(), dan digitalWrite(2, HIGH); delay(1000); digitalWrite(2, LOW); delay(1000); di loop().",
    ],
  },
  2: {
    level: 2,
    tipeVisualPeriferal: "push_button",
    namaPeriferal: "Push Button Switch",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BTN_SIG", labelPin: "Pin Sakelar (SIG)", x: 365, y: 100, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "BTN_GND", labelPin: "Pin GND Tombol", x: 365, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO4", kePinPeriferal: "BTN_SIG", warnaKabel: "#38bdf8", keteranganJalur: "Klik kaki [GPIO 4] di ESP32 lalu klik kaki [Pin Sakelar (SIG)]" },
      { dariPinEsp32: "ESP_GND", kePinPeriferal: "BTN_GND", warnaKabel: "#64748b", keteranganJalur: "Klik kaki [GND] di ESP32 lalu klik kaki [Pin GND Tombol]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Pilih tab 'Pasif & Input' lalu tarik 'Push Button Switch' ke kanvas.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> 'Pin Sakelar (SIG)', lalu klik 'GND' -> 'Pin GND Tombol'.",
      "Clue 3 (Kode): int tombol = digitalRead(4); if (tombol == LOW) digitalWrite(2, HIGH);",
    ],
  },
  3: {
    level: 3,
    tipeVisualPeriferal: "ldr_relay",
    namaPeriferal: "Sensor Cahaya LDR + Relay 1-Channel",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "LDR_AO", labelPin: "LDR Pin AO", x: 355, y: 82, warnaPin: "#22c55e", posisiKomponen: "periferal" },
      { idPin: "RELAY_IN", labelPin: "Relay Pin IN", x: 355, y: 168, warnaPin: "#eab308", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO34", kePinPeriferal: "LDR_AO", warnaKabel: "#22c55e", keteranganJalur: "Klik kaki [GPIO 34] di ESP32 lalu klik kaki [LDR Pin AO]" },
      { dariPinEsp32: "ESP_GPIO26", kePinPeriferal: "RELAY_IN", warnaKabel: "#eab308", keteranganJalur: "Klik kaki [GPIO 26] di ESP32 lalu klik kaki [Relay Pin IN]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Cahaya LDR' atau 'Relay 1-Channel 5V' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 34' -> 'LDR Pin AO', lalu klik 'GPIO 26' -> 'Relay Pin IN'.",
      "Clue 3 (Kode): int adc = analogRead(34); if (adc < 1000) digitalWrite(26, HIGH);",
    ],
  },
  4: {
    level: 4,
    tipeVisualPeriferal: "servo_solenoid",
    namaPeriferal: "Servo SG90 180° + Solenoid Lock 12V",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "SERVO_PWM", labelPin: "Servo PWM", x: 355, y: 82, warnaPin: "#a855f7", posisiKomponen: "periferal" },
      { idPin: "SOLENOID_IN", labelPin: "Solenoid IN", x: 355, y: 168, warnaPin: "#14b8a6", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO13", kePinPeriferal: "SERVO_PWM", warnaKabel: "#a855f7", keteranganJalur: "Klik kaki [GPIO 13] di ESP32 lalu klik kaki [Servo PWM]" },
      { dariPinEsp32: "ESP_GPIO27", kePinPeriferal: "SOLENOID_IN", warnaKabel: "#14b8a6", keteranganJalur: "Klik kaki [GPIO 27] di ESP32 lalu klik kaki [Solenoid IN]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Servo SG90 180°' atau 'Solenoid Lock 12V' dari Gudang 48 Item.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> 'Servo PWM', lalu klik 'GPIO 27' -> 'Solenoid IN'.",
      "Clue 3 (Kode): pintu.attach(13); di setup(), dan digitalWrite(27, HIGH); pintu.write(90); di loop().",
    ],
  },
  5: {
    level: 5,
    tipeVisualPeriferal: "dht22_greenhouse",
    namaPeriferal: "Sensor Suhu DHT22 + Relay 2-Channel",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "DHT_DATA", labelPin: "DHT22 Data", x: 355, y: 70, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "FAN_IN", labelPin: "Kipas IN", x: 355, y: 135, warnaPin: "#8b5cf6", posisiKomponen: "periferal" },
      { idPin: "PUMP_IN", labelPin: "Pompa IN", x: 355, y: 185, warnaPin: "#3b82f6", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO15", kePinPeriferal: "DHT_DATA", warnaKabel: "#10b981", keteranganJalur: "Klik kaki [GPIO 15] lalu klik kaki [DHT22 Data]" },
      { dariPinEsp32: "ESP_GPIO33", kePinPeriferal: "FAN_IN", warnaKabel: "#8b5cf6", keteranganJalur: "Klik kaki [GPIO 33] lalu klik kaki [Kipas IN]" },
      { dariPinEsp32: "ESP_GPIO25", kePinPeriferal: "PUMP_IN", warnaKabel: "#3b82f6", keteranganJalur: "Klik kaki [GPIO 25] lalu klik kaki [Pompa IN]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Suhu DHT22' atau 'Relay 2-Channel' ke kotak kanan.",
      "Clue 2 (Kabel): GPIO 15 -> DHT22 Data, GPIO 33 -> Kipas IN, dan GPIO 25 -> Pompa IN.",
    ],
  },
  6: {
    level: 6,
    tipeVisualPeriferal: "mq2_alarm",
    namaPeriferal: "Sensor Gas MQ-2 + Sensor Api Flame",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MQ2_AO", labelPin: "MQ-2 AO", x: 355, y: 85, warnaPin: "#f43f5e", posisiKomponen: "periferal" },
      { idPin: "BUZZER_POS", labelPin: "Buzzer (+)", x: 355, y: 165, warnaPin: "#ec4899", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO32", kePinPeriferal: "MQ2_AO", warnaKabel: "#f43f5e", keteranganJalur: "Klik kaki [GPIO 32] lalu klik kaki [MQ-2 AO]" },
      { dariPinEsp32: "ESP_GPIO19", kePinPeriferal: "BUZZER_POS", warnaKabel: "#ec4899", keteranganJalur: "Klik kaki [GPIO 19] lalu klik kaki [Buzzer (+)]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Gas MQ-2' atau 'Sensor Api Flame' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 32' -> 'MQ-2 AO', lalu klik 'GPIO 19' -> 'Buzzer (+)'.",
    ],
  },
  7: {
    level: 7,
    tipeVisualPeriferal: "dual_esp32_uart",
    namaPeriferal: "NodeMCU / ESP32 #2 UART",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MCU2_RX16", labelPin: "ESP32#2 RX2(16)", x: 355, y: 95, warnaPin: "#f97316", posisiKomponen: "periferal" },
      { idPin: "MCU2_TX17", labelPin: "ESP32#2 TX2(17)", x: 355, y: 155, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO17", kePinPeriferal: "MCU2_RX16", warnaKabel: "#f97316", keteranganJalur: "Klik kaki [TX2 (17)] di ESP32 kiri lalu klik kaki [ESP32#2 RX2(16)] di kanan" },
      { dariPinEsp32: "ESP_GPIO16", kePinPeriferal: "MCU2_TX17", warnaKabel: "#06b6d4", keteranganJalur: "Klik kaki [RX2 (16)] di ESP32 kiri lalu klik kaki [ESP32#2 TX2(17)] di kanan" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'NodeMCU ESP8266' atau 'Layar OLED I2C' ke kotak kanan.",
      "Clue 2 (Kabel Silang): Klik 'TX2 (17)' -> 'ESP32#2 RX2(16)', lalu 'RX2 (16)' -> 'ESP32#2 TX2(17)'.",
    ],
  },
  8: {
    level: 8,
    tipeVisualPeriferal: "relay_4ch_plc",
    namaPeriferal: "Relay 4-Channel PLC",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "REL4_IN1", labelPin: "Relay IN1", x: 355, y: 90, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "REL4_GND", labelPin: "Relay GND", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO4", kePinPeriferal: "REL4_IN1", warnaKabel: "#38bdf8", keteranganJalur: "Klik kaki [GPIO 4] lalu klik kaki [Relay IN1]" },
      { dariPinEsp32: "ESP_GND", kePinPeriferal: "REL4_GND", warnaKabel: "#64748b", keteranganJalur: "Klik kaki [GND] lalu klik kaki [Relay GND]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Relay 4-Channel PLC' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> 'Relay IN1', lalu 'GND' -> 'Relay GND'.",
    ],
  },
  9: {
    level: 9,
    tipeVisualPeriferal: "triple_mcu",
    namaPeriferal: "Arduino Uno (28P) / STM32",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BUS_SYNC", labelPin: "Bus Klaster", x: 355, y: 120, warnaPin: "#10b981", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO15", kePinPeriferal: "BUS_SYNC", warnaKabel: "#10b981", keteranganJalur: "Klik kaki [GPIO 15] lalu klik kaki [Bus Klaster]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Arduino Uno (28P)' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 15' -> 'Bus Klaster'.",
    ],
  },
  10: {
    level: 10,
    tipeVisualPeriferal: "npk_rs485",
    namaPeriferal: "Sensor Pupuk NPK",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "NPK_RO", labelPin: "RS485 RO", x: 355, y: 95, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
      { idPin: "NPK_DI", labelPin: "RS485 DI", x: 355, y: 155, warnaPin: "#f97316", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO16", kePinPeriferal: "NPK_RO", warnaKabel: "#06b6d4", keteranganJalur: "Klik kaki [RX2 (16)] lalu klik kaki [RS485 RO]" },
      { dariPinEsp32: "ESP_GPIO17", kePinPeriferal: "NPK_DI", warnaKabel: "#f97316", keteranganJalur: "Klik kaki [TX2 (17)] lalu klik kaki [RS485 DI]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Pupuk NPK' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'RX2 (16)' -> 'RS485 RO', lalu 'TX2 (17)' -> 'RS485 DI'.",
    ],
  },
  11: {
    level: 11,
    tipeVisualPeriferal: "gps_neo6m",
    namaPeriferal: "GPS NEO-6M u-blox",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "GPS_TX", labelPin: "GPS TX", x: 355, y: 95, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "GPS_VCC", labelPin: "GPS VCC", x: 355, y: 155, warnaPin: "#ef4444", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO4", kePinPeriferal: "GPS_TX", warnaKabel: "#38bdf8", keteranganJalur: "Klik kaki [GPIO 4] lalu klik kaki [GPS TX]" },
      { dariPinEsp32: "ESP_3V3", kePinPeriferal: "GPS_VCC", warnaKabel: "#ef4444", keteranganJalur: "Klik kaki [3V3] lalu klik kaki [GPS VCC]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'GPS NEO-6M u-blox' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> 'GPS TX', lalu '3V3' -> 'GPS VCC'.",
    ],
  },
  12: {
    level: 12,
    tipeVisualPeriferal: "baterai_18650",
    namaPeriferal: "Socket Baterai 18650 + Sensor Tegangan 0-25V",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BATT_ADC", labelPin: "Volt Out", x: 355, y: 95, warnaPin: "#f59e0b", posisiKomponen: "periferal" },
      { idPin: "BATT_GND", labelPin: "Baterai (-)", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO35", kePinPeriferal: "BATT_ADC", warnaKabel: "#f59e0b", keteranganJalur: "Klik kaki [GPIO 35] lalu klik kaki [Volt Out]" },
      { dariPinEsp32: "ESP_GND", kePinPeriferal: "BATT_GND", warnaKabel: "#64748b", keteranganJalur: "Klik kaki [GND] lalu klik kaki [Baterai (-)]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Socket Baterai 18650' atau 'Sensor Tegangan 0-25V' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 35' -> 'Volt Out', lalu 'GND' -> 'Baterai (-)'.",
    ],
  },
  13: {
    level: 13,
    tipeVisualPeriferal: "struct_ram",
    namaPeriferal: "Layar OLED I2C / Paket Struct",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "RAM_BUS", labelPin: "Bus Struct", x: 355, y: 120, warnaPin: "#a855f7", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO13", kePinPeriferal: "RAM_BUS", warnaKabel: "#a855f7", keteranganJalur: "Klik kaki [GPIO 13] lalu klik kaki [Bus Struct]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik sensor atau 'Layar OLED I2C' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> 'Bus Struct'.",
    ],
  },
  14: {
    level: 14,
    tipeVisualPeriferal: "esp_now_radio",
    namaPeriferal: "NodeMCU ESP8266 (ESP-NOW Peer)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "ANT_RF", labelPin: "Antena RF", x: 355, y: 120, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO2", kePinPeriferal: "ANT_RF", warnaKabel: "#38bdf8", keteranganJalur: "Klik kaki [GPIO 2] lalu klik kaki [Antena RF]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'NodeMCU ESP8266' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 2' -> 'Antena RF'.",
    ],
  },
  15: {
    level: 15,
    tipeVisualPeriferal: "mesh_10_node",
    namaPeriferal: "Node #10 Internet Gateway",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MESH_HOP", labelPin: "Next-Hop (N+1)", x: 355, y: 95, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "GATEWAY_CLOUD", labelPin: "Cloud Uplink", x: 355, y: 155, warnaPin: "#facc15", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      { dariPinEsp32: "ESP_GPIO17", kePinPeriferal: "MESH_HOP", warnaKabel: "#10b981", keteranganJalur: "Klik kaki [TX2 (17)] lalu klik kaki [Next-Hop (N+1)]" },
      { dariPinEsp32: "ESP_GPIO2", kePinPeriferal: "GATEWAY_CLOUD", warnaKabel: "#facc15", keteranganJalur: "Klik kaki [GPIO 2] lalu klik kaki [Cloud Uplink]" },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'NodeMCU ESP8266' atau 'ESP32' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'TX2 (17)' -> 'Next-Hop (N+1)', lalu 'GPIO 2' -> 'Cloud Uplink'.",
    ],
  },
};

export const GambarPeriferalWokwiAsli: React.FC<{
  tipe: TipePeriferalWokwi;
  simulasiHidup: boolean;
  detak: number;
  nilaiSensorUji: number;
}> = ({ tipe, simulasiHidup, detak, nilaiSensorUji }) => {
  switch (tipe) {
    case "led_merah": {
      const nyala = simulasiHidup && detak % 2 === 0;
      return (
        <g>
          <line x1={365} y1={105} x2={425} y2={105} stroke="#94a3b8" strokeWidth={4} />
          <line x1={365} y1={155} x2={425} y2={135} stroke="#94a3b8" strokeWidth={4} />
          <rect x={380} y={99} width={32} height={12} rx={4} fill="#d97706" stroke="#78350f" />
          {nyala && (
            <>
              <circle cx={445} cy={118} r={46} fill="rgba(239, 68, 68, 0.28)" />
              <circle cx={445} cy={118} r={32} fill="rgba(250, 204, 21, 0.35)" />
            </>
          )}
          <path
            d="M 425 98 L 450 98 A 20 20 0 0 1 450 138 L 425 138 Z"
            fill={nyala ? "#ef4444" : "#7f1d1d"}
            stroke={nyala ? "#fef08a" : "#991b1b"}
            strokeWidth={2.5}
          />
          <text x={442} y={162} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
            {nyala ? "💡 LED ON (3.3V)" : "LED 5mm (220Ω)"}
          </text>
        </g>
      );
    }

    case "push_button": {
      const ditekan = simulasiHidup && detak % 2 === 0;
      return (
        <g>
          <line x1={365} y1={100} x2={410} y2={100} stroke="#94a3b8" strokeWidth={4} />
          <line x1={365} y1={155} x2={410} y2={155} stroke="#94a3b8" strokeWidth={4} />
          <rect x={405} y={82} width={76} height={86} rx={10} fill="#334155" stroke="#94a3b8" strokeWidth={2.5} />
          <circle
            cx={443}
            cy={125}
            r={ditekan ? 19 : 23}
            fill={ditekan ? "#22c55e" : "#ef4444"}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text x={443} y={184} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
            {ditekan ? "👇 TOMBOL DITEKAN" : "PUSH BUTTON"}
          </text>
        </g>
      );
    }

    case "ldr_relay": {
      const malamNyala = simulasiHidup && nilaiSensorUji < 300;
      return (
        <g>
          <line x1={355} y1={82} x2={390} y2={82} stroke="#94a3b8" strokeWidth={3.5} />
          <rect x={390} y={52} width={115} height={56} rx={8} fill="#111827" stroke="#facc15" strokeWidth={2} />
          <circle cx={478} cy={80} r={14} fill="#ef4444" stroke="#fde047" strokeWidth={2} />
          <text x={425} y={76} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">LDR SENSOR</text>
          <text x={425} y={92} textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">{nilaiSensorUji} Lux</text>

          <line x1={355} y1={168} x2={390} y2={168} stroke="#94a3b8" strokeWidth={3.5} />
          <rect x={390} y={135} width={85} height={60} rx={8} fill="#991b1b" stroke="#f87171" strokeWidth={2} />
          <rect x={400} y={145} width={65} height={38} rx={4} fill="#2563eb" />
          <text x={432} y={168} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">RELAY 1-CH</text>
          <circle cx={505} cy={165} r={16} fill={malamNyala ? "#facc15" : "#475569"} stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    }

    default: {
      return (
        <g>
          <line x1={355} y1={95} x2={395} y2={95} stroke="#38bdf8" strokeWidth={3.5} />
          <line x1={355} y1={155} x2={395} y2={155} stroke="#f97316" strokeWidth={3.5} />
          <rect
            x={390}
            y={58}
            width={125}
            height={128}
            rx={12}
            fill={simulasiHidup ? "#065f46" : "#1e293b"}
            stroke={simulasiHidup ? "#34d399" : "#38bdf8"}
            strokeWidth={2.5}
          />
          <text x={452} y={105} textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            MODUL HARDWARE
          </text>
          <text x={452} y={125} textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">
            {tipe.toUpperCase()}
          </text>
          <text x={452} y={148} textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
            {simulasiHidup ? "⚡ ONLINE & AKTIF" : "STANDBY"}
          </text>
        </g>
      );
    }
  }
};