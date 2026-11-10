"use client";

import React from "react";

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
  tipeVisualThumb:
    | "esp32"
    | "arduino_uno"
    | "esp8266"
    | "stm32"
    | "raspberry_pico"
    | "baterai_18650"
    | "solar_panel"
    | "ina219"
    | "power_supply"
    | "step_down"
    | "ldr"
    | "dht22"
    | "soil_moisture"
    | "npk_tanah"
    | "ultrasonik"
    | "pir_motion"
    | "mq2_gas"
    | "mq135_co2"
    | "flame_api"
    | "rfid_rc522"
    | "gps_neo6m"
    | "ph_air"
    | "tds_air"
    | "turbidity_air"
    | "do_oksigen"
    | "suhu_air"
    | "water_flow"
    | "water_level"
    | "detak_jantung"
    | "suhu_tubuh"
    | "ina_arus"
    | "bmp280"
    | "mpu6050"
    | "rain_hujan"
    | "sound_suara"
    | "relay_1ch"
    | "relay_2ch"
    | "relay_4ch"
    | "ssr_relay"
    | "servo_180"
    | "servo_360"
    | "pompa_air"
    | "kipas_dc"
    | "solenoid_lock"
    | "motor_dc"
    | "oled_i2c"
    | "lcd_16x2"
    | "buzzer_piezo"
    | "keypad_4x4"
    | "led_hijau"
    | "led_merah"
    | "resistor_220"
    | "potensiometer"
    | "push_button";
  cocokUntukDropZone: "esp32_board" | TipePeriferalWokwi | "universal_part";
  levelTerkait: number[];
}

// ============================================================================
// KATALOG 48 KOMPONEN ASLI (URUTAN & VISUAL IDENTIK DENGAN STUDIO WOKWI UTAMA)
// ============================================================================
export const GUDANG_KOMPONEN_48_MASTER: ItemGudang48Master[] = [
  // 1-5: MICROCONTROLLER
  { id: "mcu_esp32", nama: "ESP32 DevKit V1 (Wi-Fi/BLE)", badgeAtas: "MCU", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", tipeVisualThumb: "esp32", cocokUntukDropZone: "esp32_board", levelTerkait: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  { id: "mcu_esp32_node2", nama: "ESP32 #2 (UART / Mesh Node)", badgeAtas: "MCU", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", tipeVisualThumb: "esp32", cocokUntukDropZone: "dual_esp32_uart", levelTerkait: [7, 14, 15] },
  { id: "mcu_uno", nama: "Arduino Uno R3 (ATmega328P)", badgeAtas: "MCU", jumlahPinLabel: "28P", kategoriFilter: "Microcontroller", tipeVisualThumb: "arduino_uno", cocokUntukDropZone: "triple_mcu", levelTerkait: [8, 9] },
  { id: "mcu_nodemcu", nama: "NodeMCU ESP8266 Wi-Fi", badgeAtas: "MCU", jumlahPinLabel: "22P", kategoriFilter: "Microcontroller", tipeVisualThumb: "esp8266", cocokUntukDropZone: "esp_now_radio", levelTerkait: [14] },
  { id: "mcu_gateway10", nama: "ESP32 Gateway Node #10", badgeAtas: "MCU", jumlahPinLabel: "30P", kategoriFilter: "Microcontroller", tipeVisualThumb: "stm32", cocokUntukDropZone: "mesh_10_node", levelTerkait: [15] },

  // 6-10: BATERAI & DAYA
  { id: "pwr_batt18650", nama: "Baterai Li-Ion 18650 (3.7V-4.2V)", badgeAtas: "DAYA", jumlahPinLabel: "2P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "baterai_18650", cocokUntukDropZone: "baterai_18650", levelTerkait: [12, 15] },
  { id: "pwr_ina219", nama: "Sensor Tegangan & Arus INA219", badgeAtas: "DAYA", jumlahPinLabel: "4P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "ina219", cocokUntukDropZone: "baterai_18650", levelTerkait: [12] },
  { id: "pwr_solar", nama: "Panel Surya Mini 6V 2W", badgeAtas: "DAYA", jumlahPinLabel: "2P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "solar_panel", cocokUntukDropZone: "baterai_18650", levelTerkait: [12] },
  { id: "pwr_psu12v", nama: "Adaptor Power Supply 12V DC", badgeAtas: "DAYA", jumlahPinLabel: "2P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "power_supply", cocokUntukDropZone: "universal_part", levelTerkait: [4, 8] },
  { id: "pwr_buck", nama: "Step-Down Buck LM2596 (5V)", badgeAtas: "DAYA", jumlahPinLabel: "4P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "step_down", cocokUntukDropZone: "universal_part", levelTerkait: [12] },

  // 11-20: SENSOR & AKTUATOR POPULER
  { id: "sen_mq2", nama: "Sensor Gas MQ-2 (LPG/Asap)", badgeAtas: "GAS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "mq2_gas", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "sen_rfid", nama: "RFID Card Reader RC522", badgeAtas: "AKSES", jumlahPinLabel: "7P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "rfid_rc522", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "akt_solenoid", nama: "Solenoid Lock 12V DC", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "solenoid_lock", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "akt_pompa", nama: "Pompa Air Mini DC", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "pompa_air", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 6] },
  { id: "akt_servo180", nama: "Servo SG90 180°", badgeAtas: "AKTUATOR", jumlahPinLabel: "3P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "servo_180", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "akt_servo360", nama: "Servo MG996R 360°", badgeAtas: "AKTUATOR", jumlahPinLabel: "3P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "servo_360", cocokUntukDropZone: "relay_4ch_plc", levelTerkait: [8] },
  { id: "akt_kipas", nama: "Kipas DC (PWM) Exhaust", badgeAtas: "AKTUATOR", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "kipas_dc", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "dsp_oled", nama: "Layar OLED I2C 0.96\"", badgeAtas: "LAYAR", jumlahPinLabel: "4P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "oled_i2c", cocokUntukDropZone: "dual_esp32_uart", levelTerkait: [7] },
  { id: "dsp_lcd", nama: "LCD 16x2 I2C (4p)", badgeAtas: "LAYAR", jumlahPinLabel: "4P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "lcd_16x2", cocokUntukDropZone: "dual_esp32_uart", levelTerkait: [7] },
  { id: "akt_buzzer", nama: "Buzzer Piezo (2p)", badgeAtas: "AUDIO", jumlahPinLabel: "2P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "buzzer_piezo", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },

  // 21-30: PASIF, TANAH & AIR (SESUAI GAMBAR SCREENSHOT)
  { id: "pas_keypad", nama: "Keypad Matriks 4x4", badgeAtas: "PASIF", jumlahPinLabel: "8P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "keypad_4x4", cocokUntukDropZone: "push_button", levelTerkait: [2] },
  { id: "pas_led_hijau", nama: "LED Hijau 5mm", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "led_hijau", cocokUntukDropZone: "led_merah", levelTerkait: [1] },
  { id: "pas_led_merah", nama: "LED Merah 5mm", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "led_merah", cocokUntukDropZone: "led_merah", levelTerkait: [1, 2] },
  { id: "pas_resistor", nama: "Resistor Gelang 220Ω", badgeAtas: "PASIF", jumlahPinLabel: "2P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "resistor_220", cocokUntukDropZone: "led_merah", levelTerkait: [1] },
  { id: "pas_potensio", nama: "Potensiometer 10kΩ", badgeAtas: "PASIF", jumlahPinLabel: "3P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "potensiometer", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "sen_npk", nama: "Sensor Pupuk NPK RS485", badgeAtas: "TANAH", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "npk_tanah", cocokUntukDropZone: "npk_rs485", levelTerkait: [10, 13, 15] },
  { id: "sen_ph", nama: "Sensor pH Air (0-14)", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "ph_air", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sen_tds", nama: "Sensor TDS Meter Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "tds_air", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sen_turbidity", nama: "Sensor Turbidity Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "turbidity_air", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },
  { id: "sen_do", nama: "Sensor DO Oksigen Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "do_oksigen", cocokUntukDropZone: "npk_rs485", levelTerkait: [10] },

  // 31-48: SENSOR LANJUTAN, RELAY & AKTUATOR
  { id: "sen_flow", nama: "Sensor Debit Water Flow", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "water_flow", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sen_level", nama: "Sensor Level Tinggi Air", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "water_level", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sen_ds18b20", nama: "Sensor Suhu Air DS18B20", badgeAtas: "AIR", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "suhu_air", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 15] },
  { id: "sen_heart", nama: "Sensor Detak Jantung SpO2", badgeAtas: "MEDIS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "detak_jantung", cocokUntukDropZone: "struct_ram", levelTerkait: [13] },
  { id: "sen_mq135", nama: "Sensor Udara MQ-135 (CO2)", badgeAtas: "GAS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "mq135_co2", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "sen_flame", nama: "Sensor Gas CO / Flame Api", badgeAtas: "GAS", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "flame_api", cocokUntukDropZone: "mq2_alarm", levelTerkait: [6] },
  { id: "sen_pz004t", nama: "Sensor Daya Listrik PZEM", badgeAtas: "DAYA", jumlahPinLabel: "3P", kategoriFilter: "Baterai & Daya", tipeVisualThumb: "ina_arus", cocokUntukDropZone: "baterai_18650", levelTerkait: [12] },
  { id: "akt_motor_dc", nama: "Motor DC Geared Konveyor", badgeAtas: "AKTUATOR", jumlahPinLabel: "3P", kategoriFilter: "Aktuator & Motor", tipeVisualThumb: "motor_dc", cocokUntukDropZone: "relay_4ch_plc", levelTerkait: [8] },
  { id: "pas_button", nama: "Push Button Tactile Switch", badgeAtas: "PASIF", jumlahPinLabel: "4P", kategoriFilter: "Pasif & Input", tipeVisualThumb: "push_button", cocokUntukDropZone: "push_button", levelTerkait: [2] },
  { id: "sen_ldr", nama: "Sensor Cahaya LDR Modul", badgeAtas: "CAHAYA", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "ldr", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "sen_dht22", nama: "Sensor Suhu & Lembab DHT22", badgeAtas: "SUHU", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "dht22", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5, 13, 15] },
  { id: "sen_soil", nama: "Sensor Kelembaban Tanah", badgeAtas: "TANAH", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "soil_moisture", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "sen_gps", nama: "Modul GPS Satelit NEO-6M", badgeAtas: "SATELIT", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "gps_neo6m", cocokUntukDropZone: "gps_neo6m", levelTerkait: [11, 15] },
  { id: "sen_ultrasonik", nama: "Sensor Jarak HC-SR04", badgeAtas: "JARAK", jumlahPinLabel: "4P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "ultrasonik", cocokUntukDropZone: "servo_solenoid", levelTerkait: [4] },
  { id: "sen_pir", nama: "Sensor Gerak PIR HC-SR501", badgeAtas: "GERAK", jumlahPinLabel: "3P", kategoriFilter: "Sensor (25)", tipeVisualThumb: "pir_motion", cocokUntukDropZone: "ldr_relay", levelTerkait: [3] },
  { id: "rel_1ch", nama: "Modul Relay 1-Ch 5V Opto", badgeAtas: "RELAY", jumlahPinLabel: "3P", kategoriFilter: "Modul Relay", tipeVisualThumb: "relay_1ch", cocokUntukDropZone: "ldr_relay", levelTerkait: [3, 6] },
  { id: "rel_2ch", nama: "Modul Relay 2-Ch (5V)", badgeAtas: "RELAY", jumlahPinLabel: "4P", kategoriFilter: "Modul Relay", tipeVisualThumb: "relay_2ch", cocokUntukDropZone: "dht22_greenhouse", levelTerkait: [5] },
  { id: "rel_4ch", nama: "Modul Relay 4-Ch PLC", badgeAtas: "RELAY", jumlahPinLabel: "6P", kategoriFilter: "Modul Relay", tipeVisualThumb: "relay_4ch", cocokUntukDropZone: "relay_4ch_plc", levelTerkait: [8] },
];

// ============================================================================
// RENDERER IKON MINIATUR SVG LENGKAP UNTUK SELURUH 48 ITEM (TANPA FALLBACK!)
// ============================================================================
export const MiniaturSvgGudang48: React.FC<{
  tipe: ItemGudang48Master["tipeVisualThumb"];
}> = ({ tipe }) => {
  switch (tipe) {
    case "esp32":
    case "esp8266":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={4} width={36} height={42} rx={4} fill="#0f172a" stroke="#475569" strokeWidth={1.5} />
          <rect x={18} y={8} width={24} height={16} rx={2} fill="#cbd5e1" />
          <text x={30} y={18} textAnchor="middle" fill="#0f172a" fontSize="5" fontWeight="bold">ESP32</text>
          {[10, 16, 22, 28, 34, 40].map((y) => (
            <g key={y}>
              <circle cx={14} cy={y} r={1.3} fill="#facc15" />
              <circle cx={46} cy={y} r={1.3} fill="#facc15" />
            </g>
          ))}
          <rect x={25} y={42} width={10} height={5} rx={1} fill="#94a3b8" />
        </svg>
      );

    case "arduino_uno":
    case "stm32":
    case "raspberry_pico":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={8} y={8} width={44} height={34} rx={4} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
          <rect x={6} y={13} width={7} height={9} rx={1} fill="#cbd5e1" />
          <rect x={22} y={22} width={18} height={8} rx={1} fill="#0f172a" />
          <text x={31} y={18} textAnchor="middle" fill="#ffffff" fontSize="5.5" fontWeight="bold">UNO R3</text>
        </svg>
      );

    case "baterai_18650":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={24} y={5} width={12} height={4} rx={1} fill="#facc15" />
          <rect x={16} y={9} width={28} height={35} rx={5} fill="#059669" stroke="#34d399" strokeWidth={1.5} />
          <path d="M 31 15 L 25 26 L 30 26 L 28 36 L 35 24 L 30 24 Z" fill="#fde047" />
          <text x={30} y={41} textAnchor="middle" fill="#ffffff" fontSize="5.5" fontWeight="bold">3.7V Li-Ion</text>
        </svg>
      );

    case "solar_panel":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={8} width={40} height={32} rx={3} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={1.5} />
          <line x1={23} y1={8} x2={23} y2={40} stroke="#38bdf8" strokeWidth={1} />
          <line x1={37} y1={8} x2={37} y2={40} stroke="#38bdf8" strokeWidth={1} />
          <line x1={10} y1={19} x2={50} y2={19} stroke="#38bdf8" strokeWidth={1} />
          <line x1={10} y1={30} x2={50} y2={30} stroke="#38bdf8" strokeWidth={1} />
          <circle cx={48} cy={10} r={5} fill="#facc15" />
        </svg>
      );

    case "ina219":
    case "ina_arus":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={10} width={28} height={28} rx={3} fill="#065f46" stroke="#34d399" strokeWidth={1.5} />
          <rect x={15} y={15} width={18} height={10} rx={1.5} fill="#0f172a" />
          <circle cx={46} cy={24} r={8} fill="none" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 2" />
          <text x={24} y={34} textAnchor="middle" fill="#fde047" fontSize="5.5" fontWeight="bold">400V 100A</text>
        </svg>
      );

    case "power_supply":
    case "step_down":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={10} width={40} height={30} rx={4} fill="#1e293b" stroke="#f59e0b" strokeWidth={1.5} />
          <circle cx={22} cy={25} r={7} fill="#b45309" stroke="#fde047" strokeWidth={1.2} />
          <rect x={34} y={16} width={11} height={18} rx={2} fill="#0284c7" />
          <text x={30} y={46} textAnchor="middle" fill="#facc15" fontSize="5.5" fontWeight="bold">DC BUCK</text>
        </svg>
      );

    case "keypad_4x4":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={4} width={36} height={42} rx={4} fill="#1e293b" stroke="#64748b" strokeWidth={1.5} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={16 + c * 7.5}
                y={8 + r * 8.5}
                width={5.5}
                height={6}
                rx={1}
                fill={c === 3 ? "#ef4444" : r === 3 && c !== 1 ? "#f59e0b" : "#0284c7"}
              />
            ))
          )}
        </svg>
      );

    case "led_hijau":
    case "led_merah": {
      const warna = tipe === "led_hijau" ? "#22c55e" : "#ef4444";
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <line x1={26} y1={28} x2={26} y2={46} stroke="#94a3b8" strokeWidth={2} />
          <line x1={34} y1={28} x2={34} y2={43} stroke="#94a3b8" strokeWidth={2} />
          <path d="M 20 28 L 20 16 A 10 10 0 0 1 40 16 L 40 28 Z" fill={warna} stroke="#ffffff" strokeWidth={1.2} />
        </svg>
      );
    }

    case "resistor_220":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <line x1={6} y1={25} x2={54} y2={25} stroke="#94a3b8" strokeWidth={2.5} />
          <rect x={16} y={18} width={28} height={14} rx={4} fill="#d97706" stroke="#fde047" strokeWidth={1} />
          <line x1={22} y1={18} x2={22} y2={32} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={28} y1={18} x2={28} y2={32} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={34} y1={18} x2={34} y2={32} stroke="#78350f" strokeWidth={2.5} />
          <text x={30} y={42} textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="bold">220 Ω</text>
        </svg>
      );

    case "potensiometer":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={14} y={8} width={32} height={26} rx={4} fill="#1e3a8a" stroke="#facc15" strokeWidth={1.2} />
          <circle cx={30} cy={21} r={8} fill="#0f172a" stroke="#38bdf8" strokeWidth={1.5} />
          <line x1={30} y1={21} x2={36} y2={16} stroke="#facc15" strokeWidth={2} />
          <line x1={22} y1={34} x2={22} y2={45} stroke="#facc15" strokeWidth={2} />
          <line x1={30} y1={34} x2={30} y2={45} stroke="#facc15" strokeWidth={2} />
          <line x1={38} y1={34} x2={38} y2={45} stroke="#facc15" strokeWidth={2} />
        </svg>
      );

    case "push_button":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={15} y={10} width={30} height={30} rx={5} fill="#334155" stroke="#94a3b8" strokeWidth={1.5} />
          <circle cx={20} cy={15} r={2} fill="#cbd5e1" />
          <circle cx={40} cy={15} r={2} fill="#cbd5e1" />
          <circle cx={20} cy={35} r={2} fill="#cbd5e1" />
          <circle cx={40} cy={35} r={2} fill="#cbd5e1" />
          <circle cx={30} cy={25} r={9} fill="#ef4444" stroke="#ffffff" strokeWidth={1.2} />
        </svg>
      );

    case "npk_tanah":
    case "soil_moisture":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={8} width={22} height={16} rx={3} fill="#78350f" stroke="#facc15" strokeWidth={1.2} />
          <line x1={17} y1={24} x2={17} y2={43} stroke="#cbd5e1" strokeWidth={2.5} />
          <line x1={23} y1={24} x2={23} y2={43} stroke="#cbd5e1" strokeWidth={2.5} />
          <line x1={29} y1={24} x2={29} y2={43} stroke="#cbd5e1" strokeWidth={2.5} />
          <rect x={36} y={10} width={14} height={28} rx={2} fill="#0f172a" stroke="#34d399" strokeWidth={1} />
          <text x={43} y={20} textAnchor="middle" fill="#34d399" fontSize="5" fontWeight="bold">N P K</text>
          <text x={43} y={29} textAnchor="middle" fill="#facc15" fontSize="5" fontWeight="bold">RS485</text>
        </svg>
      );

    case "ph_air":
    case "tds_air":
    case "turbidity_air":
    case "do_oksigen":
    case "suhu_air":
    case "water_flow":
    case "water_level": {
      const warnaKotak =
        tipe === "ph_air"
          ? "#2563eb"
          : tipe === "tds_air"
          ? "#1e293b"
          : tipe === "do_oksigen"
          ? "#7c3aed"
          : "#059669";
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={14} width={20} height={24} rx={3} fill={warnaKotak} stroke="#60a5fa" strokeWidth={1.2} />
          <rect x={34} y={12} width={16} height={26} rx={3} fill="#065f46" stroke="#34d399" strokeWidth={1.2} />
          <path d="M 30 24 L 34 24" stroke="#facc15" strokeWidth={2} />
          <line x1={42} y1={7} x2={42} y2={36} stroke="#38bdf8" strokeWidth={3} />
          <text x={20} y={29} textAnchor="middle" fill="#fde047" fontSize="5.5" fontWeight="bold">PROBE</text>
        </svg>
      );
    }

    case "detak_jantung":
    case "suhu_tubuh":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={12} width={36} height={26} rx={4} fill="#881337" stroke="#fb7185" strokeWidth={1.5} />
          <polyline points="16,26 24,26 27,17 32,33 35,24 44,24" fill="none" stroke="#ffffff" strokeWidth={1.8} />
        </svg>
      );

    case "mq2_gas":
    case "mq135_co2":
    case "flame_api":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={10} width={36} height={30} rx={4} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={1.2} />
          <circle cx={30} cy={23} r={10} fill="#94a3b8" stroke="#e2e8f0" strokeWidth={1.5} />
          <circle cx={30} cy={23} r={6} fill="#475569" />
          <text x={30} y={38} textAnchor="middle" fill="#fde047" fontSize="5" fontWeight="bold">GAS PPM</text>
        </svg>
      );

    case "ldr":
    case "sound_suara":
    case "rain_hujan":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={12} width={36} height={26} rx={4} fill="#1e3a8a" stroke="#38bdf8" strokeWidth={1.5} />
          <circle cx={38} cy={25} r={8} fill="#fde047" stroke="#ca8a04" strokeWidth={1.5} />
          <path d="M 33 23 Q 38 19 43 23 Q 38 28 33 28" fill="none" stroke="#b45309" strokeWidth={1.5} />
          <rect x={16} y={20} width={10} height={10} rx={1} fill="#0284c7" />
        </svg>
      );

    case "dht22":
    case "bmp280":
    case "mpu6050":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={16} y={6} width={28} height={30} rx={4} fill="#f8fafc" stroke="#0284c7" strokeWidth={1.5} />
          <line x1={20} y1={13} x2={40} y2={13} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={20} y1={19} x2={40} y2={19} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={20} y1={25} x2={40} y2={25} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={24} y1={36} x2={24} y2={46} stroke="#facc15" strokeWidth={2} />
          <line x1={30} y1={36} x2={30} y2={46} stroke="#facc15" strokeWidth={2} />
          <line x1={36} y1={36} x2={36} y2={46} stroke="#facc15" strokeWidth={2} />
        </svg>
      );

    case "gps_neo6m":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={8} width={36} height={34} rx={4} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={1.5} />
          <rect x={18} y={13} width={24} height={20} rx={3} fill="#d97706" stroke="#fde047" strokeWidth={1.2} />
          <circle cx={30} cy={23} r={3.5} fill="#fef08a" />
          <text x={30} y={40} textAnchor="middle" fill="#34d399" fontSize="5" fontWeight="bold">GPS NEO</text>
        </svg>
      );

    case "rfid_rc522":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={8} width={40} height={34} rx={4} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1.5} />
          <rect x={16} y={13} width={28} height={18} rx={2} fill="none" stroke="#fde047" strokeWidth={1.2} />
          <circle cx={30} cy={22} r={5} fill="none" stroke="#fde047" strokeWidth={1.2} />
          <text x={30} y={39} textAnchor="middle" fill="#ffffff" fontSize="5.5" fontWeight="bold">RFID</text>
        </svg>
      );

    case "ultrasonik":
    case "pir_motion":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={8} y={12} width={44} height={26} rx={4} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
          <circle cx={20} cy={25} r={8} fill="#cbd5e1" stroke="#475569" strokeWidth={1.5} />
          <circle cx={40} cy={25} r={8} fill="#cbd5e1" stroke="#475569" strokeWidth={1.5} />
        </svg>
      );

    case "relay_1ch":
    case "relay_2ch":
    case "relay_4ch":
    case "ssr_relay":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={8} width={40} height={34} rx={4} fill="#b91c1c" stroke="#f87171" strokeWidth={1.5} />
          <rect x={15} y={13} width={14} height={24} rx={2} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1} />
          <rect x={32} y={13} width={14} height={24} rx={2} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={1} />
        </svg>
      );

    case "servo_180":
    case "servo_360":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={14} y={16} width={26} height={22} rx={3} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
          <circle cx={34} cy={27} r={5} fill="#f8fafc" />
          <line x1={34} y1={27} x2={50} y2={15} stroke="#facc15" strokeWidth={4} strokeLinecap="round" />
        </svg>
      );

    case "pompa_air":
    case "motor_dc":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={16} y={12} width={28} height={26} rx={5} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
          <circle cx={30} cy={25} r={7} fill="#e2e8f0" stroke="#0f172a" strokeWidth={1.5} />
          <rect x={26} y={6} width={8} height={6} rx={1} fill="#38bdf8" />
        </svg>
      );

    case "kipas_dc":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={14} y={9} width={32} height={32} rx={5} fill="#1e293b" stroke="#64748b" strokeWidth={1.5} />
          <circle cx={30} cy={25} r={12} fill="#0f172a" stroke="#38bdf8" strokeWidth={1} />
          <circle cx={30} cy={25} r={4} fill="#38bdf8" />
        </svg>
      );

    case "solenoid_lock":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={12} y={14} width={28} height={22} rx={3} fill="#64748b" stroke="#cbd5e1" strokeWidth={1.5} />
          <rect x={40} y={20} width={12} height={10} rx={2} fill="#facc15" />
        </svg>
      );

    case "oled_i2c":
    case "lcd_16x2":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <rect x={10} y={10} width={40} height={30} rx={4} fill="#1e3a8a" stroke="#38bdf8" strokeWidth={1.5} />
          <rect x={14} y={15} width={32} height={20} rx={2} fill="#0f172a" />
          <text x={30} y={28} textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">OLED I2C</text>
        </svg>
      );

    case "buzzer_piezo":
      return (
        <svg viewBox="0 0 60 50" className="w-14 h-11 mx-auto">
          <circle cx={30} cy={25} r={15} fill="#0f172a" stroke="#94a3b8" strokeWidth={1.5} />
          <circle cx={30} cy={25} r={5} fill="#cbd5e1" />
        </svg>
      );
  }
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
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "LED_ANODA",
        warnaKabel: "#ef4444",
        keteranganJalur: "Klik kaki [GPIO 2] di ESP32 lalu klik kaki [Anoda (+)] di LED",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "LED_KATODA",
        warnaKabel: "#64748b",
        keteranganJalur: "Klik kaki [GND] di ESP32 lalu klik kaki [Katoda (-)] di LED",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Gudang 48 Item): Tarik 'ESP32 DevKit V1' ke kotak kiri, dan tarik 'LED Merah 5mm' (atau Resistor 220Ω) ke kotak kanan.",
      "Clue 2 (Klik 2 Titik Pin): Klik bulatan 'GPIO 2' lalu klik bulatan 'Anoda (+)'. Selanjutnya klik bulatan 'GND' lalu klik bulatan 'Katoda (-)'.",
      "Clue 3 (Kode C++): Ketik pinMode(2, OUTPUT); di setup(), dan digitalWrite(2, HIGH); delay(1000); digitalWrite(2, LOW); delay(1000); di loop().",
    ],
  },
  2: {
    level: 2,
    tipeVisualPeriferal: "push_button",
    namaPeriferal: "Push Button Tactile Switch",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BTN_SIG", labelPin: "Pin Sakelar (SIG)", x: 365, y: 100, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "BTN_GND", labelPin: "Pin GND Tombol", x: 365, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "BTN_SIG",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Klik kaki [GPIO 4] di ESP32 lalu klik kaki [Pin Sakelar (SIG)]",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "BTN_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Klik kaki [GND] di ESP32 lalu klik kaki [Pin GND Tombol]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Pilih tab 'Pasif & Input' di Gudang 48 Komponen, lalu tarik 'Push Button Tactile Switch' ke kanvas.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> klik 'Pin Sakelar (SIG)', lalu klik 'GND' -> klik 'Pin GND Tombol'.",
      "Clue 3 (Kode): Gunakan int tombol = digitalRead(4); dan if (tombol == LOW) digitalWrite(2, HIGH);",
    ],
  },
  3: {
    level: 3,
    tipeVisualPeriferal: "ldr_relay",
    namaPeriferal: "Sensor Cahaya LDR + Modul Relay 5V",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "LDR_AO", labelPin: "LDR Pin AO", x: 355, y: 82, warnaPin: "#22c55e", posisiKomponen: "periferal" },
      { idPin: "RELAY_IN", labelPin: "Relay Pin IN", x: 355, y: 168, warnaPin: "#eab308", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO34",
        kePinPeriferal: "LDR_AO",
        warnaKabel: "#22c55e",
        keteranganJalur: "Klik kaki [GPIO 34] di ESP32 lalu klik kaki [LDR Pin AO]",
      },
      {
        dariPinEsp32: "ESP_GPIO26",
        kePinPeriferal: "RELAY_IN",
        warnaKabel: "#eab308",
        keteranganJalur: "Klik kaki [GPIO 26] di ESP32 lalu klik kaki [Relay Pin IN]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Cahaya LDR' atau 'Modul Relay 1-Ch' dari Gudang 48 Komponen ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 34' -> klik 'LDR Pin AO', lalu klik 'GPIO 26' -> klik 'Relay Pin IN'.",
      "Clue 3 (Kode): Baca cahaya dengan int adc = analogRead(34); lalu if (adc < 1000) digitalWrite(26, HIGH);",
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
      {
        dariPinEsp32: "ESP_GPIO13",
        kePinPeriferal: "SERVO_PWM",
        warnaKabel: "#a855f7",
        keteranganJalur: "Klik kaki [GPIO 13] di ESP32 lalu klik kaki [Servo PWM]",
      },
      {
        dariPinEsp32: "ESP_GPIO27",
        kePinPeriferal: "SOLENOID_IN",
        warnaKabel: "#14b8a6",
        keteranganJalur: "Klik kaki [GPIO 27] di ESP32 lalu klik kaki [Solenoid IN]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Servo SG90 180°' atau 'Solenoid Lock 12V' dari Gudang 48 Komponen.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> klik 'Servo PWM', lalu klik 'GPIO 27' -> klik 'Solenoid IN'.",
      "Clue 3 (Kode): Ketik pintu.attach(13); di setup(), dan digitalWrite(27, HIGH); pintu.write(90); di loop().",
    ],
  },
  5: {
    level: 5,
    tipeVisualPeriferal: "dht22_greenhouse",
    namaPeriferal: "Sensor Suhu DHT22 + Kipas & Pompa",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "DHT_DATA", labelPin: "DHT22 Data", x: 355, y: 70, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "FAN_IN", labelPin: "Kipas IN", x: 355, y: 135, warnaPin: "#8b5cf6", posisiKomponen: "periferal" },
      { idPin: "PUMP_IN", labelPin: "Pompa IN", x: 355, y: 185, warnaPin: "#3b82f6", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO15",
        kePinPeriferal: "DHT_DATA",
        warnaKabel: "#10b981",
        keteranganJalur: "Klik kaki [GPIO 15] lalu klik kaki [DHT22 Data]",
      },
      {
        dariPinEsp32: "ESP_GPIO33",
        kePinPeriferal: "FAN_IN",
        warnaKabel: "#8b5cf6",
        keteranganJalur: "Klik kaki [GPIO 33] lalu klik kaki [Kipas IN]",
      },
      {
        dariPinEsp32: "ESP_GPIO25",
        kePinPeriferal: "PUMP_IN",
        warnaKabel: "#3b82f6",
        keteranganJalur: "Klik kaki [GPIO 25] lalu klik kaki [Pompa IN]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Suhu & Lembab DHT22' atau 'Pompa Air Mini' dari Gudang 48 Komponen.",
      "Clue 2 (Kabel): Hubungkan 3 pasang titik: GPIO 15 -> DHT22 Data, GPIO 33 -> Kipas IN, dan GPIO 25 -> Pompa IN.",
      "Clue 3 (Kode): if (suhu > 32.0) digitalWrite(33, HIGH);",
    ],
  },
  6: {
    level: 6,
    tipeVisualPeriferal: "mq2_alarm",
    namaPeriferal: "Sensor Gas MQ-2 + Buzzer Piezo",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MQ2_AO", labelPin: "MQ-2 AO", x: 355, y: 85, warnaPin: "#f43f5e", posisiKomponen: "periferal" },
      { idPin: "BUZZER_POS", labelPin: "Buzzer (+)", x: 355, y: 165, warnaPin: "#ec4899", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO32",
        kePinPeriferal: "MQ2_AO",
        warnaKabel: "#f43f5e",
        keteranganJalur: "Klik kaki [GPIO 32] lalu klik kaki [MQ-2 AO]",
      },
      {
        dariPinEsp32: "ESP_GPIO19",
        kePinPeriferal: "BUZZER_POS",
        warnaKabel: "#ec4899",
        keteranganJalur: "Klik kaki [GPIO 19] lalu klik kaki [Buzzer (+)]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Sensor Gas MQ-2' dari Gudang 48 Komponen.",
      "Clue 2 (Kabel): Klik 'GPIO 32' -> klik 'MQ-2 AO', lalu klik 'GPIO 19' -> klik 'Buzzer (+)'.",
      "Clue 3 (Kode): Baca analogRead(32) dan jika ppm >= 500 nyalakan pin 19 dan 25.",
    ],
  },
  7: {
    level: 7,
    tipeVisualPeriferal: "dual_esp32_uart",
    namaPeriferal: "ESP32 #2 (UART / Mesh Node)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MCU2_RX16", labelPin: "ESP32#2 RX2(16)", x: 355, y: 95, warnaPin: "#f97316", posisiKomponen: "periferal" },
      { idPin: "MCU2_TX17", labelPin: "ESP32#2 TX2(17)", x: 355, y: 155, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "MCU2_RX16",
        warnaKabel: "#f97316",
        keteranganJalur: "Klik kaki [TX2 (17)] di ESP32 kiri lalu klik kaki [ESP32#2 RX2(16)] di kanan",
      },
      {
        dariPinEsp32: "ESP_GPIO16",
        kePinPeriferal: "MCU2_TX17",
        warnaKabel: "#06b6d4",
        keteranganJalur: "Klik kaki [RX2 (16)] di ESP32 kiri lalu klik kaki [ESP32#2 TX2(17)] di kanan",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'ESP32 #2 (UART / Mesh Node)' ke kotak kanan.",
      "Clue 2 (Kabel Silang): Klik 'TX2 (17)' -> klik 'ESP32#2 RX2(16)', lalu klik 'RX2 (16)' -> klik 'ESP32#2 TX2(17)'.",
      "Clue 3 (Kode): Serial2.begin(115200, SERIAL_8N1, 16, 17); dan Serial2.println(\"DATA_OK\");",
    ],
  },
  8: {
    level: 8,
    tipeVisualPeriferal: "relay_4ch_plc",
    namaPeriferal: "Modul Relay 4-Ch PLC",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "REL4_IN1", labelPin: "Relay IN1", x: 355, y: 90, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "REL4_GND", labelPin: "Relay GND", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "REL4_IN1",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Klik kaki [GPIO 4] lalu klik kaki [Relay IN1]",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "REL4_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Klik kaki [GND] lalu klik kaki [Relay GND]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Modul Relay 4-Ch PLC' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> klik 'Relay IN1', lalu klik 'GND' -> klik 'Relay GND'.",
    ],
  },
  9: {
    level: 9,
    tipeVisualPeriferal: "triple_mcu",
    namaPeriferal: "Arduino Uno R3 (ATmega328P)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BUS_SYNC", labelPin: "Bus Klaster", x: 355, y: 120, warnaPin: "#10b981", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO15",
        kePinPeriferal: "BUS_SYNC",
        warnaKabel: "#10b981",
        keteranganJalur: "Klik kaki [GPIO 15] lalu klik kaki [Bus Klaster]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Arduino Uno R3' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 15' -> klik 'Bus Klaster'.",
    ],
  },
  10: {
    level: 10,
    tipeVisualPeriferal: "npk_rs485",
    namaPeriferal: "Sensor Pupuk NPK RS485",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "NPK_RO", labelPin: "RS485 RO", x: 355, y: 95, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
      { idPin: "NPK_DI", labelPin: "RS485 DI", x: 355, y: 155, warnaPin: "#f97316", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO16",
        kePinPeriferal: "NPK_RO",
        warnaKabel: "#06b6d4",
        keteranganJalur: "Klik kaki [RX2 (16)] lalu klik kaki [RS485 RO]",
      },
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "NPK_DI",
        warnaKabel: "#f97316",
        keteranganJalur: "Klik kaki [TX2 (17)] lalu klik kaki [RS485 DI]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Ketik 'NPK' di kotak pencarian Gudang 48 Komponen, lalu tarik 'Sensor Pupuk NPK RS485' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'RX2 (16)' -> klik 'RS485 RO', lalu klik 'TX2 (17)' -> klik 'RS485 DI'.",
    ],
  },
  11: {
    level: 11,
    tipeVisualPeriferal: "gps_neo6m",
    namaPeriferal: "Modul GPS Satelit NEO-6M",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "GPS_TX", labelPin: "GPS TX", x: 355, y: 95, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "GPS_VCC", labelPin: "GPS VCC", x: 355, y: 155, warnaPin: "#ef4444", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "GPS_TX",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Klik kaki [GPIO 4] lalu klik kaki [GPS TX]",
      },
      {
        dariPinEsp32: "ESP_3V3",
        kePinPeriferal: "GPS_VCC",
        warnaKabel: "#ef4444",
        keteranganJalur: "Klik kaki [3V3] lalu klik kaki [GPS VCC]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'Modul GPS Satelit NEO-6M' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> klik 'GPS TX', lalu klik '3V3' -> klik 'GPS VCC'.",
    ],
  },
  12: {
    level: 12,
    tipeVisualPeriferal: "baterai_18650",
    namaPeriferal: "Baterai Li-Ion 18650 + INA219",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BATT_ADC", labelPin: "Volt Out", x: 355, y: 95, warnaPin: "#f59e0b", posisiKomponen: "periferal" },
      { idPin: "BATT_GND", labelPin: "Baterai (-)", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO35",
        kePinPeriferal: "BATT_ADC",
        warnaKabel: "#f59e0b",
        keteranganJalur: "Klik kaki [GPIO 35] lalu klik kaki [Volt Out]",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "BATT_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Klik kaki [GND] lalu klik kaki [Baterai (-)]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Pilih kategori 'Baterai & Daya', lalu tarik 'Baterai Li-Ion 18650' atau 'Sensor INA219' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 35' -> klik 'Volt Out', lalu klik 'GND' -> klik 'Baterai (-)'.",
    ],
  },
  13: {
    level: 13,
    tipeVisualPeriferal: "struct_ram",
    namaPeriferal: "Sensor Multi-Parameter (Struct C++)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "RAM_BUS", labelPin: "Bus Struct", x: 355, y: 120, warnaPin: "#a855f7", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO13",
        kePinPeriferal: "RAM_BUS",
        warnaKabel: "#a855f7",
        keteranganJalur: "Klik kaki [GPIO 13] lalu klik kaki [Bus Struct]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik sensor pendukung dari Gudang 48 Komponen ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> klik 'Bus Struct'.",
    ],
  },
  14: {
    level: 14,
    tipeVisualPeriferal: "esp_now_radio",
    namaPeriferal: "NodeMCU ESP8266 / ESP-NOW Peer",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "ANT_RF", labelPin: "Antena RF", x: 355, y: 120, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "ANT_RF",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Klik kaki [GPIO 2] lalu klik kaki [Antena RF]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'NodeMCU ESP8266 Wi-Fi' atau 'ESP32 #2' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 2' -> klik 'Antena RF'.",
    ],
  },
  15: {
    level: 15,
    tipeVisualPeriferal: "mesh_10_node",
    namaPeriferal: "ESP32 Gateway Node #10",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MESH_HOP", labelPin: "Next-Hop (N+1)", x: 355, y: 95, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "GATEWAY_CLOUD", labelPin: "Cloud Uplink", x: 355, y: 155, warnaPin: "#facc15", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "MESH_HOP",
        warnaKabel: "#10b981",
        keteranganJalur: "Klik kaki [TX2 (17)] lalu klik kaki [Next-Hop (N+1)]",
      },
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "GATEWAY_CLOUD",
        warnaKabel: "#facc15",
        keteranganJalur: "Klik kaki [GPIO 2] lalu klik kaki [Cloud Uplink]",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Komponen): Tarik 'ESP32 Gateway Node #10' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'TX2 (17)' -> klik 'Next-Hop (N+1)', lalu klik 'GPIO 2' -> klik 'Cloud Uplink'.",
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
          <line x1={387} y1={99} x2={387} y2={111} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={394} y1={99} x2={394} y2={111} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={401} y1={99} x2={401} y2={111} stroke="#78350f" strokeWidth={2.5} />
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
          <circle cx={445} cy={112} r={5} fill={nyala ? "#fef08a" : "#fca5a5"} opacity={0.7} />
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
          <circle cx={417} cy={94} r={4} fill="#cbd5e1" />
          <circle cx={469} cy={94} r={4} fill="#cbd5e1" />
          <circle cx={417} cy={156} r={4} fill="#cbd5e1" />
          <circle cx={469} cy={156} r={4} fill="#cbd5e1" />
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
          <rect x={390} y={52} width={115} height={56} rx={8} fill="#1e3a8a" stroke="#38bdf8" strokeWidth={2} />
          <circle cx={478} cy={80} r={16} fill="#fde047" stroke="#ca8a04" strokeWidth={2} />
          <text x={425} y={76} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            LDR SENSOR
          </text>
          <text x={425} y={92} textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">
            {nilaiSensorUji} Lux
          </text>

          <line x1={355} y1={168} x2={390} y2={168} stroke="#94a3b8" strokeWidth={3.5} />
          <rect x={390} y={135} width={85} height={60} rx={8} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={2} />
          <text x={432} y={162} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            RELAY 5V
          </text>
          <text x={432} y={178} textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
            {malamNyala ? "CLICK: ON" : "OFF"}
          </text>

          {malamNyala && <circle cx={505} cy={165} r={28} fill="rgba(250, 204, 21, 0.35)" />}
          <circle
            cx={505}
            cy={165}
            r={16}
            fill={malamNyala ? "#facc15" : "#475569"}
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>
      );
    }

    case "servo_solenoid": {
      const buka = simulasiHidup && detak % 2 === 0;
      return (
        <g>
          <line x1={355} y1={82} x2={395} y2={82} stroke="#a855f7" strokeWidth={3.5} />
          <rect x={395} y={55} width={78} height={48} rx={8} fill="#0284c7" stroke="#38bdf8" strokeWidth={2} />
          <text x={434} y={82} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            SG90 SERVO
          </text>
          <circle cx={460} cy={79} r={10} fill="#f8fafc" />
          <line
            x1={460}
            y1={79}
            x2={buka ? 460 : 515}
            y2={buka ? 24 : 79}
            stroke="#facc15"
            strokeWidth={7}
            strokeLinecap="round"
          />

          <line x1={355} y1={168} x2={395} y2={168} stroke="#14b8a6" strokeWidth={3.5} />
          <rect x={395} y={140} width={82} height={50} rx={6} fill="#475569" stroke="#cbd5e1" strokeWidth={2} />
          <rect
            x={477}
            y={155}
            width={buka ? 12 : 34}
            height={20}
            rx={4}
            fill={buka ? "#10b981" : "#ef4444"}
          />
          <text x={436} y={169} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            {buka ? "🔓 UNLOCKED" : "🔒 SOLENOID"}
          </text>
        </g>
      );
    }

    case "dht22_greenhouse": {
      return (
        <g>
          <line x1={355} y1={70} x2={395} y2={70} stroke="#10b981" strokeWidth={3} />
          <rect x={395} y={42} width={65} height={52} rx={6} fill="#f8fafc" stroke="#0284c7" strokeWidth={2} />
          <text x={427} y={64} textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="bold">
            DHT22
          </text>
          <text x={427} y={80} textAnchor="middle" fill="#e11d48" fontSize="9.5" fontWeight="bold">
            34.0°C
          </text>

          <line x1={355} y1={135} x2={395} y2={135} stroke="#8b5cf6" strokeWidth={3} />
          <line x1={355} y1={185} x2={395} y2={185} stroke="#3b82f6" strokeWidth={3} />
          <circle cx={430} cy={140} r={22} fill="#1e293b" stroke="#38bdf8" strokeWidth={2} />
          <text x={430} y={144} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
            {simulasiHidup ? (detak % 2 === 0 ? "🌀 FAN" : "✨ FAN") : "FAN OFF"}
          </text>

          <rect x={465} y={120} width={52} height={70} rx={8} fill="#0369a1" stroke="#38bdf8" strokeWidth={2} />
          <text x={491} y={158} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            {simulasiHidup ? "💦 PUMP" : "PUMP"}
          </text>
        </g>
      );
    }

    case "mq2_alarm": {
      const bahaya = simulasiHidup;
      return (
        <g>
          <line x1={355} y1={85} x2={395} y2={85} stroke="#f43f5e" strokeWidth={3.5} />
          <rect x={395} y={50} width={105} height={68} rx={8} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={2} />
          <circle cx={447} cy={78} r={18} fill="#94a3b8" stroke="#f8fafc" strokeWidth={2} />
          <circle cx={447} cy={78} r={11} fill="#334155" />
          <text x={447} y={110} textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">
            MQ-2 GAS (650 PPM)
          </text>

          <line x1={355} y1={165} x2={395} y2={165} stroke="#ec4899" strokeWidth={3.5} />
          <circle
            cx={447}
            cy={165}
            r={26}
            fill={bahaya && detak % 2 === 0 ? "#e11d48" : "#0f172a"}
            stroke="#f43f5e"
            strokeWidth={2.5}
          />
          <circle cx={447} cy={165} r={8} fill="#cbd5e1" />
          <text x={447} y={202} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            {bahaya ? "🚨 ALARM BEEP!" : "PIEZO BUZZER"}
          </text>
        </g>
      );
    }

    case "dual_esp32_uart":
    case "esp_now_radio":
    case "mesh_10_node": {
      return (
        <g>
          <line x1={355} y1={95} x2={395} y2={95} stroke="#f97316" strokeWidth={3.5} />
          <line x1={355} y1={155} x2={395} y2={155} stroke="#06b6d4" strokeWidth={3.5} />
          <rect x={395} y={40} width={115} height={170} rx={10} fill="#0f172a" stroke="#38bdf8" strokeWidth={2} />
          <rect x={415} y={54} width={75} height={50} rx={5} fill="#cbd5e1" />
          <text x={452} y={78} textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            ESP32 NODE #2
          </text>
          <text x={452} y={92} textAnchor="middle" fill="#334155" fontSize="7.5" fontWeight="bold">
            GATEWAY / MESH
          </text>
          <rect x={410} y={118} width={85} height={48} rx={6} fill="#020617" stroke="#0284c7" />
          <text x={452} y={138} textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold">
            OLED TELEMETRY
          </text>
          <text x={452} y={154} textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
            {simulasiHidup ? "RX: DATA_OK ✓" : "WAITING RX..."}
          </text>
        </g>
      );
    }

    case "relay_4ch_plc":
    case "triple_mcu": {
      return (
        <g>
          <line x1={355} y1={90} x2={395} y2={90} stroke="#38bdf8" strokeWidth={3.5} />
          <line x1={355} y1={155} x2={395} y2={155} stroke="#64748b" strokeWidth={3.5} />
          <rect x={395} y={48} width={125} height={150} rx={10} fill="#991b1b" stroke="#f87171" strokeWidth={2} />
          {[0, 1, 2, 3].map((idx) => {
            const aktifRel = simulasiHidup && detak % 4 === idx;
            return (
              <g key={idx}>
                <rect
                  x={405 + idx * 28}
                  y={68}
                  width={23}
                  height={85}
                  rx={4}
                  fill={aktifRel ? "#2563eb" : "#1e3a8a"}
                  stroke="#93c5fd"
                />
                <circle
                  cx={416 + idx * 28}
                  cy={168}
                  r={4.5}
                  fill={aktifRel ? "#22c55e" : "#450a0a"}
                />
              </g>
            );
          })}
          <text x={457} y={190} textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">
            4-CH PLC RELAY MODULE
          </text>
        </g>
      );
    }

    case "npk_rs485": {
      return (
        <g>
          <line x1={355} y1={95} x2={390} y2={95} stroke="#06b6d4" strokeWidth={3} />
          <line x1={355} y1={155} x2={390} y2={155} stroke="#f97316" strokeWidth={3} />
          <rect x={390} y={68} width={75} height={110} rx={8} fill="#0f172a" stroke="#facc15" strokeWidth={2.5} />
          <rect x={465} y={82} width={45} height={8} rx={3} fill="#cbd5e1" />
          <rect x={465} y={118} width={45} height={8} rx={3} fill="#cbd5e1" />
          <rect x={465} y={154} width={45} height={8} rx={3} fill="#cbd5e1" />
          <text x={427} y={110} textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">
            NPK PROBE
          </text>
          <text x={427} y={128} textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
            N:145 P:62
          </text>
          <text x={427} y={144} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
            K:190 mg/kg
          </text>
        </g>
      );
    }

    case "gps_neo6m": {
      return (
        <g>
          <line x1={355} y1={95} x2={395} y2={95} stroke="#38bdf8" strokeWidth={3} />
          <line x1={355} y1={155} x2={395} y2={155} stroke="#ef4444" strokeWidth={3} />
          <rect x={395} y={62} width={110} height={120} rx={10} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={2} />
          <rect x={412} y={76} width={76} height={58} rx={6} fill="#d97706" stroke="#fde047" strokeWidth={2} />
          <circle cx={450} cy={105} r={8} fill="#fef08a" />
          <text x={450} y={152} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
            u-blox NEO-6M
          </text>
          <text x={450} y={168} textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold">
            {simulasiHidup ? "🛰️ 1.6681, 101.4451" : "Mencari Satelit..."}
          </text>
        </g>
      );
    }

    case "baterai_18650":
    case "struct_ram": {
      return (
        <g>
          <line x1={355} y1={95} x2={395} y2={95} stroke="#f59e0b" strokeWidth={3} />
          <line x1={355} y1={155} x2={395} y2={155} stroke="#64748b" strokeWidth={3} />
          <rect x={395} y={62} width={105} height={120} rx={12} fill="#065f46" stroke="#34d399" strokeWidth={2.5} />
          <rect x={428} y={52} width={38} height={10} rx={3} fill="#facc15" />
          <text x={447} y={108} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
            Li-Ion 18650
          </text>
          <text x={447} y={130} textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">
            4.12 V (94%)
          </text>
          <text x={447} y={152} textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
            INA219 Sensor
          </text>
        </g>
      );
    }
  }
};