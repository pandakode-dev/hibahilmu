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

export interface SpesifikasiHardwareLevel {
  level: number;
  tipeVisualPeriferal:
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

// Daftar Pin Fisik di Papan ESP32 DevKit V1 (Koordinat SVG Presisi)
export const PIN_FISIK_ESP32_STANDAR: TitikPinFisik[] = [
  { idPin: "ESP_3V3", labelPin: "3V3", x: 170, y: 52, warnaPin: "#ef4444", posisiKomponen: "esp32" },
  { idPin: "ESP_GND", labelPin: "GND", x: 170, y: 74, warnaPin: "#64748b", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO2", labelPin: "GPIO 2", x: 170, y: 96, warnaPin: "#facc15", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO4", labelPin: "GPIO 4", x: 170, y: 118, warnaPin: "#38bdf8", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO13", labelPin: "GPIO 13", x: 170, y: 140, warnaPin: "#a855f7", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO15", labelPin: "GPIO 15", x: 170, y: 162, warnaPin: "#10b981", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO16", labelPin: "RX2 (16)", x: 170, y: 184, warnaPin: "#06b6d4", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO17", labelPin: "TX2 (17)", x: 170, y: 206, warnaPin: "#f97316", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO19", labelPin: "GPIO 19", x: 42, y: 74, warnaPin: "#ec4899", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO25", labelPin: "GPIO 25", x: 42, y: 96, warnaPin: "#3b82f6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO26", labelPin: "GPIO 26", x: 42, y: 118, warnaPin: "#eab308", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO27", labelPin: "GPIO 27", x: 42, y: 140, warnaPin: "#14b8a6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO32", labelPin: "GPIO 32", x: 42, y: 162, warnaPin: "#f43f5e", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO33", labelPin: "GPIO 33", x: 42, y: 184, warnaPin: "#8b5cf6", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO34", labelPin: "GPIO 34", x: 42, y: 206, warnaPin: "#22c55e", posisiKomponen: "esp32" },
  { idPin: "ESP_GPIO35", labelPin: "GPIO 35", x: 42, y: 52, warnaPin: "#f59e0b", posisiKomponen: "esp32" },
];

export const SPESIFIKASI_HARDWARE_15_LEVEL: Record<number, SpesifikasiHardwareLevel> = {
  1: {
    level: 1,
    tipeVisualPeriferal: "led_merah",
    namaPeriferal: "Lampu LED Merah 5mm + Resistor 220Ω",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "LED_ANODA", labelPin: "Anoda (+)", x: 355, y: 105, warnaPin: "#ef4444", posisiKomponen: "periferal" },
      { idPin: "LED_KATODA", labelPin: "Katoda (-)", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "LED_ANODA",
        warnaKabel: "#ef4444",
        keteranganJalur: "Hubungkan Pin GPIO 2 ESP32 ke Kaki Positif Anoda (+) LED",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "LED_KATODA",
        warnaKabel: "#64748b",
        keteranganJalur: "Hubungkan Pin GND ESP32 ke Kaki Negatif Katoda (-) LED",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Rangkaian): Tarik ESP32 dan Lampu LED ke kotak bayangan di kanvas, lalu klik titik 'GPIO 2' di ESP32 menuju 'Anoda (+)' di LED, serta 'GND' menuju 'Katoda (-)'.",
      "Clue 2 (Kodingan Setup): Pastikan di dalam void setup() Anda mengetik: pinMode(2, OUTPUT);",
      "Clue 3 (Kodingan Loop): Di dalam void loop(), ketik digitalWrite(2, HIGH); delay(1000); digitalWrite(2, LOW); delay(1000);",
    ],
  },
  2: {
    level: 2,
    tipeVisualPeriferal: "push_button",
    namaPeriferal: "Sakelar Push Button Tactile + LED",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BTN_SIG", labelPin: "Pin Sakelar (SIG)", x: 355, y: 100, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "BTN_GND", labelPin: "Pin GND Tombol", x: 355, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "BTN_SIG",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Hubungkan Pin GPIO 4 ESP32 ke Kaki Sinyal Push Button",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "BTN_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Hubungkan Pin GND ESP32 ke Kaki GND Push Button",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan pin 'GPIO 4' ke 'Pin Sakelar (SIG)' dan 'GND' ke 'Pin GND Tombol'.",
      "Clue 2 (Kode): Gunakan int tombol = digitalRead(4); di dalam void loop().",
      "Clue 3 (Logika): Jika (tombol == LOW) maka nyalakan LED dengan digitalWrite(2, HIGH);",
    ],
  },
  3: {
    level: 3,
    tipeVisualPeriferal: "ldr_relay",
    namaPeriferal: "Sensor Cahaya LDR + Modul Relay Lampu Jalan",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "LDR_AO", labelPin: "LDR Pin AO (Analog)", x: 345, y: 82, warnaPin: "#22c55e", posisiKomponen: "periferal" },
      { idPin: "RELAY_IN", labelPin: "Relay Pin IN", x: 345, y: 168, warnaPin: "#eab308", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO34",
        kePinPeriferal: "LDR_AO",
        warnaKabel: "#22c55e",
        keteranganJalur: "Hubungkan Pin ADC GPIO 34 ESP32 ke Pin AO Sensor LDR",
      },
      {
        dariPinEsp32: "ESP_GPIO26",
        kePinPeriferal: "RELAY_IN",
        warnaKabel: "#eab308",
        keteranganJalur: "Hubungkan Pin GPIO 26 ESP32 ke Pin IN Modul Relay",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Tarik kabel dari 'GPIO 34' ke 'LDR Pin AO' dan dari 'GPIO 26' ke 'Relay Pin IN'.",
      "Clue 2 (Kode): Baca cahaya dengan int adc = analogRead(34);",
      "Clue 3 (Logika): Ketik if (adc < 1000) { digitalWrite(26, HIGH); } else { digitalWrite(26, LOW); }",
    ],
  },
  4: {
    level: 4,
    tipeVisualPeriferal: "servo_solenoid",
    namaPeriferal: "Motor Servo SG90 (Palang) + Solenoid Lock 12V",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "SERVO_PWM", labelPin: "Servo PWM (Oranye)", x: 345, y: 82, warnaPin: "#a855f7", posisiKomponen: "periferal" },
      { idPin: "SOLENOID_IN", labelPin: "Relay Solenoid IN", x: 345, y: 168, warnaPin: "#14b8a6", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO13",
        kePinPeriferal: "SERVO_PWM",
        warnaKabel: "#a855f7",
        keteranganJalur: "Hubungkan Pin GPIO 13 ESP32 ke Kabel PWM Motor Servo SG90",
      },
      {
        dariPinEsp32: "ESP_GPIO27",
        kePinPeriferal: "SOLENOID_IN",
        warnaKabel: "#14b8a6",
        keteranganJalur: "Hubungkan Pin GPIO 27 ESP32 ke Pin IN Relay Solenoid Door Lock",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Sambungkan 'GPIO 13' ke 'Servo PWM (Oranye)' dan 'GPIO 27' ke 'Relay Solenoid IN'.",
      "Clue 2 (Setup): Ketik pintu.attach(13); di dalam void setup().",
      "Clue 3 (Loop): Ketik digitalWrite(27, HIGH); dan pintu.write(90); di dalam void loop().",
    ],
  },
  5: {
    level: 5,
    tipeVisualPeriferal: "dht22_greenhouse",
    namaPeriferal: "Sensor Suhu DHT22 + Kipas & Pompa Irigasi",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "DHT_DATA", labelPin: "DHT22 Pin SDA/Data", x: 345, y: 70, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "FAN_IN", labelPin: "Kipas Pin IN", x: 345, y: 135, warnaPin: "#8b5cf6", posisiKomponen: "periferal" },
      { idPin: "PUMP_IN", labelPin: "Pompa Air Pin IN", x: 345, y: 185, warnaPin: "#3b82f6", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO15",
        kePinPeriferal: "DHT_DATA",
        warnaKabel: "#10b981",
        keteranganJalur: "Hubungkan GPIO 15 ke Pin Data Sensor DHT22",
      },
      {
        dariPinEsp32: "ESP_GPIO33",
        kePinPeriferal: "FAN_IN",
        warnaKabel: "#8b5cf6",
        keteranganJalur: "Hubungkan GPIO 33 ke Relay Kipas Pendingin",
      },
      {
        dariPinEsp32: "ESP_GPIO25",
        kePinPeriferal: "PUMP_IN",
        warnaKabel: "#3b82f6",
        keteranganJalur: "Hubungkan GPIO 25 ke Relay Pompa Air",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Ada 3 kabel! GPIO 15 -> DHT22 Data, GPIO 33 -> Kipas Pin IN, dan GPIO 25 -> Pompa Air Pin IN.",
      "Clue 2 (Kode): Set pinMode(25, OUTPUT); dan pinMode(33, OUTPUT); pada void setup().",
      "Clue 3 (Logika): Ketik if (suhu > 32.0) { digitalWrite(33, HIGH); }",
    ],
  },
  6: {
    level: 6,
    tipeVisualPeriferal: "mq2_alarm",
    namaPeriferal: "Sensor Gas LPG MQ-2 + Buzzer Sirine Darurat",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MQ2_AO", labelPin: "MQ-2 Pin AO (Gas)", x: 345, y: 85, warnaPin: "#f43f5e", posisiKomponen: "periferal" },
      { idPin: "BUZZER_POS", labelPin: "Buzzer Positif (+)", x: 345, y: 165, warnaPin: "#ec4899", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO32",
        kePinPeriferal: "MQ2_AO",
        warnaKabel: "#f43f5e",
        keteranganJalur: "Hubungkan GPIO 32 ke Pin AO Sensor Gas MQ-2",
      },
      {
        dariPinEsp32: "ESP_GPIO19",
        kePinPeriferal: "BUZZER_POS",
        warnaKabel: "#ec4899",
        keteranganJalur: "Hubungkan GPIO 19 ke Kaki Positif Buzzer Alarm",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 32' ke 'MQ-2 Pin AO' dan 'GPIO 19' ke 'Buzzer Positif (+)'.",
      "Clue 2 (Kode): Baca sensor gas dengan analogRead(32) lalu petakan ke variabel ppm.",
      "Clue 3 (Logika): Jika (ppm >= 500) nyalakan digitalWrite(19, HIGH); dan digitalWrite(25, HIGH);",
    ],
  },
  7: {
    level: 7,
    tipeVisualPeriferal: "dual_esp32_uart",
    namaPeriferal: "Board ESP32 #2 (Gateway Receiver UART)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MCU2_RX16", labelPin: "ESP32 #2 RX2 (Pin 16)", x: 345, y: 95, warnaPin: "#f97316", posisiKomponen: "periferal" },
      { idPin: "MCU2_TX17", labelPin: "ESP32 #2 TX2 (Pin 17)", x: 345, y: 155, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "MCU2_RX16",
        warnaKabel: "#f97316",
        keteranganJalur: "Kabel Silang UART: TX2 (17) ESP32 #1 ke RX2 (16) ESP32 #2",
      },
      {
        dariPinEsp32: "ESP_GPIO16",
        kePinPeriferal: "MCU2_TX17",
        warnaKabel: "#06b6d4",
        keteranganJalur: "Kabel Silang UART: RX2 (16) ESP32 #1 ke TX2 (17) ESP32 #2",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Hukum Silang UART): Jangan pasang TX ke TX! Hubungkan 'TX2 (17)' milik ESP32 kiri ke 'ESP32 #2 RX2 (Pin 16)' di kanan, dan 'RX2 (16)' kiri ke 'ESP32 #2 TX2 (Pin 17)' kanan.",
      "Clue 2 (Setup): Ketik Serial2.begin(115200, SERIAL_8N1, 16, 17);",
      "Clue 3 (Loop): Ketik Serial2.println(\"DATA_OK\");",
    ],
  },
  8: {
    level: 8,
    tipeVisualPeriferal: "relay_4ch_plc",
    namaPeriferal: "Modul Relay 4-Channel Otomasi Pabrik",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "REL4_IN1", labelPin: "Relay IN1 (Conveyor)", x: 345, y: 90, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "REL4_GND", labelPin: "Relay GND Bus", x: 345, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "REL4_IN1",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Hubungkan GPIO 4 ke Pin IN1 Modul Relay 4-Channel",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "REL4_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Hubungkan GND ke Bus GND Modul Relay 4-Channel",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 4' ke 'Relay IN1' dan 'GND' ke 'Relay GND Bus'.",
      "Clue 2 (Kode): Gunakan perulangan for(int i=0; i<4; i++) untuk mengatur pinMode dan digitalWrite.",
    ],
  },
  9: {
    level: 9,
    tipeVisualPeriferal: "triple_mcu",
    namaPeriferal: "Klaster 3 Mikrokontroler (ESP32 + Uno Slave)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BUS_SYNC", labelPin: "Bus Sinkronisasi Klaster", x: 345, y: 120, warnaPin: "#10b981", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO15",
        kePinPeriferal: "BUS_SYNC",
        warnaKabel: "#10b981",
        keteranganJalur: "Hubungkan GPIO 15 ke Bus Sinkronisasi Klaster 3 MCU",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 15' ke 'Bus Sinkronisasi Klaster'.",
      "Clue 2 (Kode): Pastikan variabel CLUSTER_ID = 101 dicetak melalui Serial.println.",
    ],
  },
  10: {
    level: 10,
    tipeVisualPeriferal: "npk_rs485",
    namaPeriferal: "Sensor Pupuk Tanah NPK 3-Garpu (Modbus RS485)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "NPK_RO", labelPin: "RS485 Pin RO (Receiver)", x: 345, y: 95, warnaPin: "#06b6d4", posisiKomponen: "periferal" },
      { idPin: "NPK_DI", labelPin: "RS485 Pin DI (Driver)", x: 345, y: 155, warnaPin: "#f97316", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO16",
        kePinPeriferal: "NPK_RO",
        warnaKabel: "#06b6d4",
        keteranganJalur: "Hubungkan RX2 (16) ESP32 ke Pin RO Modul RS485 Sensor NPK",
      },
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "NPK_DI",
        warnaKabel: "#f97316",
        keteranganJalur: "Hubungkan TX2 (17) ESP32 ke Pin DI Modul RS485 Sensor NPK",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'RX2 (16)' ke 'RS485 Pin RO' dan 'TX2 (17)' ke 'RS485 Pin DI'.",
      "Clue 2 (Kode): Deklarasikan variabel nitrogen, fosfor, dan kalium lalu cetak menggunakan Serial.printf.",
    ],
  },
  11: {
    level: 11,
    tipeVisualPeriferal: "gps_neo6m",
    namaPeriferal: "Modul Satelit GPS u-blox NEO-6M + Antena Keramik",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "GPS_TX", labelPin: "GPS Pin TX", x: 345, y: 95, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
      { idPin: "GPS_VCC", labelPin: "GPS Pin VCC (3.3V)", x: 345, y: 155, warnaPin: "#ef4444", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO4",
        kePinPeriferal: "GPS_TX",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Hubungkan GPIO 4 ESP32 ke Pin TX Modul GPS NEO-6M",
      },
      {
        dariPinEsp32: "ESP_3V3",
        kePinPeriferal: "GPS_VCC",
        warnaKabel: "#ef4444",
        keteranganJalur: "Hubungkan Pin 3V3 ESP32 ke Pin VCC Modul GPS NEO-6M",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 4' ke 'GPS Pin TX' dan '3V3' ke 'GPS Pin VCC (3.3V)'.",
      "Clue 2 (Kode): Deklarasikan double lat dan double lng lalu cetak dengan Serial.printf.",
    ],
  },
  12: {
    level: 12,
    tipeVisualPeriferal: "baterai_18650",
    namaPeriferal: "Baterai Li-Ion 18650 + Sensor Tegangan INA219",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "BATT_ADC", labelPin: "Pin Sensor Voltase (V_OUT)", x: 345, y: 95, warnaPin: "#f59e0b", posisiKomponen: "periferal" },
      { idPin: "BATT_GND", labelPin: "Kutub Negatif (-) Baterai", x: 345, y: 155, warnaPin: "#64748b", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO35",
        kePinPeriferal: "BATT_ADC",
        warnaKabel: "#f59e0b",
        keteranganJalur: "Hubungkan Pin ADC GPIO 35 ke Output Sensor Tegangan Baterai",
      },
      {
        dariPinEsp32: "ESP_GND",
        kePinPeriferal: "BATT_GND",
        warnaKabel: "#64748b",
        keteranganJalur: "Hubungkan Pin GND ESP32 ke Kutub Negatif (-) Baterai",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 35' (di kiri atas ESP32) ke 'Pin Sensor Voltase (V_OUT)' dan 'GND' ke 'Kutub Negatif (-) Baterai'.",
      "Clue 2 (Kode): Gunakan analogRead(35) dan konversikan ke variabel float volt.",
    ],
  },
  13: {
    level: 13,
    tipeVisualPeriferal: "struct_ram",
    namaPeriferal: "Unit Memori Paket Data Multi-Sensor (Struct C++)",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "RAM_BUS", labelPin: "Jalur Bus Data Struct", x: 345, y: 120, warnaPin: "#a855f7", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO13",
        kePinPeriferal: "RAM_BUS",
        warnaKabel: "#a855f7",
        keteranganJalur: "Hubungkan GPIO 13 ke Jalur Bus Data Struct",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 13' ke 'Jalur Bus Data Struct'.",
      "Clue 2 (Kode): Isi dataKu.suhu = 29.2; dan dataKu.npk = 150; lalu cetak dengan Serial.printf.",
    ],
  },
  14: {
    level: 14,
    tipeVisualPeriferal: "esp_now_radio",
    namaPeriferal: "Transceiver Antena 2.4 GHz ESP-NOW Peer-to-Peer",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "ANT_RF", labelPin: "Port Antena 2.4 GHz ESP-NOW", x: 345, y: 120, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "ANT_RF",
        warnaKabel: "#38bdf8",
        keteranganJalur: "Hubungkan Indikator Transmisi GPIO 2 ke Port Antena ESP-NOW",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'GPIO 2' ke 'Port Antena 2.4 GHz ESP-NOW'.",
      "Clue 2 (Kode): Ketik WiFi.mode(WIFI_STA); dan if (esp_now_init() == ESP_OK) di dalam void setup().",
    ],
  },
  15: {
    level: 15,
    tipeVisualPeriferal: "mesh_10_node",
    namaPeriferal: "Jaringan Estafet 10-Node Multi-Hop ➔ Gateway Internet",
    pinEsp32Tersedia: PIN_FISIK_ESP32_STANDAR,
    pinPeriferalTersedia: [
      { idPin: "MESH_HOP", labelPin: "Jalur Estafet Next-Hop (N+1)", x: 345, y: 95, warnaPin: "#10b981", posisiKomponen: "periferal" },
      { idPin: "GATEWAY_CLOUD", labelPin: "Uplink Node 10 Internet Cloud", x: 345, y: 155, warnaPin: "#facc15", posisiKomponen: "periferal" },
    ],
    sambunganWajib: [
      {
        dariPinEsp32: "ESP_GPIO17",
        kePinPeriferal: "MESH_HOP",
        warnaKabel: "#10b981",
        keteranganJalur: "Hubungkan TX2 (17) ke Jalur Estafet Next-Hop (Node + 1)",
      },
      {
        dariPinEsp32: "ESP_GPIO2",
        kePinPeriferal: "GATEWAY_CLOUD",
        warnaKabel: "#facc15",
        keteranganJalur: "Hubungkan GPIO 2 ke Uplink Node 10 Internet Cloud",
      },
    ],
    daftarClueLatihan: [
      "Clue 1 (Kabel): Hubungkan 'TX2 (17)' ke 'Jalur Estafet Next-Hop' dan 'GPIO 2' ke 'Uplink Node 10 Internet Cloud'.",
      "Clue 2 (Kode): Ketik int nextHop = MY_NODE_ID + 1; dan cetak rute pengirimannya menggunakan Serial.printf.",
    ],
  },
};

// ============================================================================
// KOMPONEN PENGGAMBAR PERANGKAT KERAS ASLI WOKWI DI DALAM SVG
// ============================================================================
export const GambarPeriferalWokwiAsli: React.FC<{
  tipe: SpesifikasiHardwareLevel["tipeVisualPeriferal"];
  simulasiHidup: boolean;
  detak: number;
  nilaiSensorUji: number;
}> = ({ tipe, simulasiHidup, detak, nilaiSensorUji }) => {
  switch (tipe) {
    case "led_merah": {
      const nyala = simulasiHidup && detak % 2 === 0;
      return (
        <g>
          {/* Kaki Logam Anoda (Bengkok) & Katoda (Lurus) + Resistor 220 Ohm */}
          <line x1={355} y1={105} x2={415} y2={105} stroke="#94a3b8" strokeWidth={4} />
          <line x1={355} y1={155} x2={415} y2={135} stroke="#94a3b8" strokeWidth={4} />
          {/* Badan Resistor Coklat Gelang Warna */}
          <rect x={370} y={99} width={32} height={12} rx={4} fill="#d97706" stroke="#78350f" />
          <line x1={377} y1={99} x2={377} y2={111} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={384} y1={99} x2={384} y2={111} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={391} y1={99} x2={391} y2={111} stroke="#78350f" strokeWidth={2.5} />
          {/* Efek Pendaran Cahaya (Glow) saat Menyala */}
          {nyala && (
            <>
              <circle cx={435} cy={118} r={46} fill="rgba(239, 68, 68, 0.28)" />
              <circle cx={435} cy={118} r={32} fill="rgba(250, 204, 21, 0.35)" />
            </>
          )}
          {/* Kubah Kaca Bohlam LED 5mm Asli */}
          <path
            d="M 415 98 L 440 98 A 20 20 0 0 1 440 138 L 415 138 Z"
            fill={nyala ? "#ef4444" : "#7f1d1d"}
            stroke={nyala ? "#fef08a" : "#991b1b"}
            strokeWidth={2.5}
          />
          <circle cx={435} cy={112} r={5} fill={nyala ? "#fef08a" : "#fca5a5"} opacity={0.7} />
          <text x={432} y={162} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
            {nyala ? "💡 LED ON (3.3V)" : "LED 5mm (220Ω)"}
          </text>
        </g>
      );
    }

    case "push_button": {
      const ditekan = simulasiHidup && detak % 2 === 0;
      return (
        <g>
          <line x1={355} y1={100} x2={400} y2={100} stroke="#94a3b8" strokeWidth={4} />
          <line x1={355} y1={155} x2={400} y2={155} stroke="#94a3b8" strokeWidth={4} />
          <rect x={395} y={82} width={76} height={86} rx={10} fill="#334155" stroke="#94a3b8" strokeWidth={2.5} />
          <circle cx={407} cy={94} r={4} fill="#cbd5e1" />
          <circle cx={459} cy={94} r={4} fill="#cbd5e1" />
          <circle cx={407} cy={156} r={4} fill="#cbd5e1" />
          <circle cx={459} cy={156} r={4} fill="#cbd5e1" />
          <circle
            cx={433}
            cy={125}
            r={ditekan ? 19 : 23}
            fill={ditekan ? "#22c55e" : "#ef4444"}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text x={433} y={184} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
            {ditekan ? "👇 TOMBOL DITEKAN" : "PUSH BUTTON"}
          </text>
        </g>
      );
    }

    case "ldr_relay": {
      const malamNyala = simulasiHidup && nilaiSensorUji < 300;
      return (
        <g>
          {/* Modul Sensor LDR Biru di Atas */}
          <line x1={345} y1={82} x2={380} y2={82} stroke="#94a3b8" strokeWidth={3.5} />
          <rect x={380} y={52} width={115} height={56} rx={8} fill="#1e3a8a" stroke="#38bdf8" strokeWidth={2} />
          <circle cx={468} cy={80} r={16} fill="#fde047" stroke="#ca8a04" strokeWidth={2} />
          <path d="M 458 76 Q 468 70 478 76 Q 468 84 458 84" fill="none" stroke="#b45309" strokeWidth={2} />
          <text x={415} y={76} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            LDR SENSOR
          </text>
          <text x={415} y={92} textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">
            {nilaiSensorUji} Lux
          </text>

          {/* Modul Relay 5V + Bohlam Jalan di Bawah */}
          <line x1={345} y1={168} x2={380} y2={168} stroke="#94a3b8" strokeWidth={3.5} />
          <rect x={380} y={135} width={85} height={60} rx={8} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={2} />
          <text x={422} y={162} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            RELAY 5V
          </text>
          <text x={422} y={178} textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
            {malamNyala ? "CLICK: ON" : "OFF"}
          </text>

          {malamNyala && <circle cx={495} cy={165} r={28} fill="rgba(250, 204, 21, 0.35)" />}
          <circle
            cx={495}
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
          {/* Motor Servo SG90 Biru + Lengan Putar */}
          <line x1={345} y1={82} x2={385} y2={82} stroke="#a855f7" strokeWidth={3.5} />
          <rect x={385} y={55} width={78} height={48} rx={8} fill="#0284c7" stroke="#38bdf8" strokeWidth={2} />
          <text x={424} y={82} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            SG90 SERVO
          </text>
          <circle cx={450} cy={79} r={10} fill="#f8fafc" />
          <line
            x1={450}
            y1={79}
            x2={buka ? 450 : 505}
            y2={buka ? 24 : 79}
            stroke="#facc15"
            strokeWidth={7}
            strokeLinecap="round"
          />

          {/* Solenoid Door Lock 12V Besi + Batang Plunger */}
          <line x1={345} y1={168} x2={385} y2={168} stroke="#14b8a6" strokeWidth={3.5} />
          <rect x={385} y={140} width={82} height={50} rx={6} fill="#475569" stroke="#cbd5e1" strokeWidth={2} />
          <rect
            x={467}
            y={155}
            width={buka ? 12 : 34}
            height={20}
            rx={4}
            fill={buka ? "#10b981" : "#ef4444"}
          />
          <text x={426} y={169} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            {buka ? "🔓 UNLOCKED" : "🔒 SOLENOID"}
          </text>
        </g>
      );
    }

    case "dht22_greenhouse": {
      return (
        <g>
          {/* Sensor DHT22 Putih Berjaring */}
          <line x1={345} y1={70} x2={385} y2={70} stroke="#10b981" strokeWidth={3} />
          <rect x={385} y={42} width={65} height={52} rx={6} fill="#f8fafc" stroke="#0284c7" strokeWidth={2} />
          <text x={417} y={64} textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="bold">
            DHT22
          </text>
          <text x={417} y={80} textAnchor="middle" fill="#e11d48" fontSize="9.5" fontWeight="bold">
            34.0°C
          </text>

          {/* Kipas Pendingin & Pompa Air */}
          <line x1={345} y1={135} x2={385} y2={135} stroke="#8b5cf6" strokeWidth={3} />
          <line x1={345} y1={185} x2={385} y2={185} stroke="#3b82f6" strokeWidth={3} />
          <circle cx={420} cy={140} r={22} fill="#1e293b" stroke="#38bdf8" strokeWidth={2} />
          <text x={420} y={144} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
            {simulasiHidup ? (detak % 2 === 0 ? "🌀 FAN" : "✨ FAN") : "FAN OFF"}
          </text>

          <rect x={455} y={120} width={52} height={70} rx={8} fill="#0369a1" stroke="#38bdf8" strokeWidth={2} />
          <text x={481} y={158} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
            {simulasiHidup ? "💦 PUMP" : "PUMP"}
          </text>
        </g>
      );
    }

    case "npk_rs485": {
      return (
        <g>
          <line x1={345} y1={95} x2={380} y2={95} stroke="#06b6d4" strokeWidth={3} />
          <line x1={345} y1={155} x2={380} y2={155} stroke="#f97316" strokeWidth={3} />
          {/* Badan Hitam Probe NPK + 3 Garpu Besi Stainless */}
          <rect x={380} y={68} width={75} height={110} rx={8} fill="#0f172a" stroke="#facc15" strokeWidth={2.5} />
          <rect x={455} y={82} width={45} height={8} rx={3} fill="#cbd5e1" />
          <rect x={455} y={118} width={45} height={8} rx={3} fill="#cbd5e1" />
          <rect x={455} y={154} width={45} height={8} rx={3} fill="#cbd5e1" />
          <text x={417} y={110} textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">
            NPK PROBE
          </text>
          <text x={417} y={128} textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
            N:145 P:62
          </text>
          <text x={417} y={144} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
            K:190 mg/kg
          </text>
        </g>
      );
    }

    case "gps_neo6m": {
      return (
        <g>
          <line x1={345} y1={95} x2={385} y2={95} stroke="#38bdf8" strokeWidth={3} />
          <line x1={345} y1={155} x2={385} y2={155} stroke="#ef4444" strokeWidth={3} />
          {/* PCB Biru GPS NEO-6M + Antena Patch Keramik Emas */}
          <rect x={385} y={62} width={110} height={120} rx={10} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={2} />
          <rect x={402} y={76} width={76} height={58} rx={6} fill="#d97706" stroke="#fde047" strokeWidth={2} />
          <circle cx={440} cy={105} r={8} fill="#fef08a" />
          <text x={440} y={152} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
            u-blox NEO-6M
          </text>
          <text x={440} y={168} textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold">
            {simulasiHidup ? "🛰️ 1.6681, 101.4451" : "Mencari Satelit..."}
          </text>
        </g>
      );
    }

    case "baterai_18650": {
      return (
        <g>
          <line x1={345} y1={95} x2={385} y2={95} stroke="#f59e0b" strokeWidth={3} />
          <line x1={345} y1={155} x2={385} y2={155} stroke="#64748b" strokeWidth={3} />
          <rect x={385} y={62} width={105} height={120} rx={12} fill="#065f46" stroke="#34d399" strokeWidth={2.5} />
          <rect x={418} y={52} width={38} height={10} rx={3} fill="#facc15" />
          <text x={437} y={108} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
            Li-Ion 18650
          </text>
          <text x={437} y={130} textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">
            4.12 V (94%)
          </text>
          <text x={437} y={152} textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
            INA219 Sensor
          </text>
        </g>
      );
    }

    default: {
      return (
        <g>
          <rect
            x={375}
            y={58}
            width={125}
            height={128}
            rx={12}
            fill={simulasiHidup ? "#065f46" : "#1e293b"}
            stroke={simulasiHidup ? "#34d399" : "#38bdf8"}
            strokeWidth={2.5}
          />
          <text x={437} y={105} textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            MODUL HARDWARE
          </text>
          <text x={437} y={125} textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">
            {tipe.toUpperCase()}
          </text>
          <text x={437} y={148} textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
            {simulasiHidup ? "⚡ ONLINE & AKTIF" : "STANDBY"}
          </text>
        </g>
      );
    }
  }
};