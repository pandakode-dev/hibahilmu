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

export interface ItemGudangKomponen {
  idItem: string;
  namaTampil: string;
  kategori: "MCU" | "Output" | "Sensor" | "Komunikasi";
  tipeCocok: "esp32_board" | TipePeriferalWokwi;
  warnaAksen: string;
}

// Daftar Lengkap Isi Gudang Komponen Elektronik (Untuk Di-Drag ke Kanvas)
export const DAFTAR_GUDANG_KOMPONEN_WOKWI: ItemGudangKomponen[] = [
  {
    idItem: "gudang_esp32",
    namaTampil: "ESP32 DevKit V1 (30-Pin)",
    kategori: "MCU",
    tipeCocok: "esp32_board",
    warnaAksen: "#facc15",
  },
  {
    idItem: "gudang_led",
    namaTampil: "LED Merah 5mm + 220Ω",
    kategori: "Output",
    tipeCocok: "led_merah",
    warnaAksen: "#ef4444",
  },
  {
    idItem: "gudang_btn",
    namaTampil: "Push Button Switch",
    kategori: "Sensor",
    tipeCocok: "push_button",
    warnaAksen: "#38bdf8",
  },
  {
    idItem: "gudang_ldr",
    namaTampil: "Sensor LDR + Relay 5V",
    kategori: "Sensor",
    tipeCocok: "ldr_relay",
    warnaAksen: "#22c55e",
  },
  {
    idItem: "gudang_servo",
    namaTampil: "Servo SG90 + Solenoid",
    kategori: "Output",
    tipeCocok: "servo_solenoid",
    warnaAksen: "#a855f7",
  },
  {
    idItem: "gudang_dht22",
    namaTampil: "DHT22 + Kipas & Pompa",
    kategori: "Sensor",
    tipeCocok: "dht22_greenhouse",
    warnaAksen: "#10b981",
  },
  {
    idItem: "gudang_mq2",
    namaTampil: "Sensor Gas MQ-2 + Buzzer",
    kategori: "Sensor",
    tipeCocok: "mq2_alarm",
    warnaAksen: "#f43f5e",
  },
  {
    idItem: "gudang_uart",
    namaTampil: "ESP32 #2 (UART Receiver)",
    kategori: "Komunikasi",
    tipeCocok: "dual_esp32_uart",
    warnaAksen: "#f97316",
  },
  {
    idItem: "gudang_relay4",
    namaTampil: "Modul Relay 4-Ch PLC",
    kategori: "Output",
    tipeCocok: "relay_4ch_plc",
    warnaAksen: "#06b6d4",
  },
  {
    idItem: "gudang_triple",
    namaTampil: "Klaster 3 MCU Slave",
    kategori: "Komunikasi",
    tipeCocok: "triple_mcu",
    warnaAksen: "#14b8a6",
  },
  {
    idItem: "gudang_npk",
    namaTampil: "Probe Pupuk NPK RS485",
    kategori: "Sensor",
    tipeCocok: "npk_rs485",
    warnaAksen: "#eab308",
  },
  {
    idItem: "gudang_gps",
    namaTampil: "GPS Satelit NEO-6M",
    kategori: "Sensor",
    tipeCocok: "gps_neo6m",
    warnaAksen: "#3b82f6",
  },
  {
    idItem: "gudang_batt",
    namaTampil: "Baterai 18650 + INA219",
    kategori: "Sensor",
    tipeCocok: "baterai_18650",
    warnaAksen: "#10b981",
  },
  {
    idItem: "gudang_struct",
    namaTampil: "Bus Memori Struct C++",
    kategori: "Komunikasi",
    tipeCocok: "struct_ram",
    warnaAksen: "#a855f7",
  },
  {
    idItem: "gudang_espnow",
    namaTampil: "Antena 2.4GHz ESP-NOW",
    kategori: "Komunikasi",
    tipeCocok: "esp_now_radio",
    warnaAksen: "#38bdf8",
  },
  {
    idItem: "gudang_mesh10",
    namaTampil: "Gateway 10-Node Mesh",
    kategori: "Komunikasi",
    tipeCocok: "mesh_10_node",
    warnaAksen: "#facc15",
  },
];

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

// Koordinat Pin Fisik ESP32 DevKit V1 (Kiri x=42, Kanan x=178)
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
    namaPeriferal: "LED Merah 5mm + 220Ω",
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
      "Clue 1 (Gudang Komponen): Tarik 'ESP32 DevKit V1' ke kotak kiri, dan tarik 'LED Merah 5mm + 220Ω' ke kotak kanan.",
      "Clue 2 (Klik 2 Titik Pin): Klik bulatan 'GPIO 2' lalu klik bulatan 'Anoda (+)'. Selanjutnya klik bulatan 'GND' lalu klik bulatan 'Katoda (-)'.",
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
      "Clue 1 (Komponen): Tarik 'ESP32 DevKit V1' dan 'Push Button Switch' dari Gudang Komponen ke kanvas.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> klik 'Pin Sakelar (SIG)', lalu klik 'GND' -> klik 'Pin GND Tombol'.",
      "Clue 3 (Kode): Gunakan int tombol = digitalRead(4); dan if (tombol == LOW) digitalWrite(2, HIGH);",
    ],
  },
  3: {
    level: 3,
    tipeVisualPeriferal: "ldr_relay",
    namaPeriferal: "Sensor LDR + Relay 5V",
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
      "Clue 1 (Komponen): Tarik 'Sensor LDR + Relay 5V' dari Gudang Komponen ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 34' -> klik 'LDR Pin AO', lalu klik 'GPIO 26' -> klik 'Relay Pin IN'.",
      "Clue 3 (Kode): Baca cahaya dengan int adc = analogRead(34); lalu if (adc < 1000) digitalWrite(26, HIGH);",
    ],
  },
  4: {
    level: 4,
    tipeVisualPeriferal: "servo_solenoid",
    namaPeriferal: "Servo SG90 + Solenoid",
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
      "Clue 1 (Komponen): Tarik 'Servo SG90 + Solenoid' dari Gudang Komponen ke kanvas.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> klik 'Servo PWM', lalu klik 'GPIO 27' -> klik 'Solenoid IN'.",
      "Clue 3 (Kode): Ketik pintu.attach(13); di setup(), dan digitalWrite(27, HIGH); pintu.write(90); di loop().",
    ],
  },
  5: {
    level: 5,
    tipeVisualPeriferal: "dht22_greenhouse",
    namaPeriferal: "DHT22 + Kipas & Pompa",
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
      "Clue 1 (Komponen): Tarik 'DHT22 + Kipas & Pompa' dari Gudang Komponen.",
      "Clue 2 (Kabel): Hubungkan 3 pasang titik: GPIO 15 -> DHT22 Data, GPIO 33 -> Kipas IN, dan GPIO 25 -> Pompa IN.",
      "Clue 3 (Kode): if (suhu > 32.0) digitalWrite(33, HIGH);",
    ],
  },
  6: {
    level: 6,
    tipeVisualPeriferal: "mq2_alarm",
    namaPeriferal: "Sensor Gas MQ-2 + Buzzer",
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
      "Clue 1 (Komponen): Tarik 'Sensor Gas MQ-2 + Buzzer' dari Gudang Komponen.",
      "Clue 2 (Kabel): Klik 'GPIO 32' -> klik 'MQ-2 AO', lalu klik 'GPIO 19' -> klik 'Buzzer (+)'.",
      "Clue 3 (Kode): Baca analogRead(32) dan jika ppm >= 500 nyalakan pin 19 dan 25.",
    ],
  },
  7: {
    level: 7,
    tipeVisualPeriferal: "dual_esp32_uart",
    namaPeriferal: "ESP32 #2 (UART Receiver)",
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
      "Clue 1 (Komponen): Tarik 'ESP32 #2 (UART Receiver)' ke kotak kanan.",
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
    namaPeriferal: "Klaster 3 MCU Slave",
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
      "Clue 1 (Komponen): Tarik 'Klaster 3 MCU Slave' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 15' -> klik 'Bus Klaster'.",
    ],
  },
  10: {
    level: 10,
    tipeVisualPeriferal: "npk_rs485",
    namaPeriferal: "Probe Pupuk NPK RS485",
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
      "Clue 1 (Komponen): Tarik 'Probe Pupuk NPK RS485' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'RX2 (16)' -> klik 'RS485 RO', lalu klik 'TX2 (17)' -> klik 'RS485 DI'.",
    ],
  },
  11: {
    level: 11,
    tipeVisualPeriferal: "gps_neo6m",
    namaPeriferal: "GPS Satelit NEO-6M",
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
      "Clue 1 (Komponen): Tarik 'GPS Satelit NEO-6M' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 4' -> klik 'GPS TX', lalu klik '3V3' -> klik 'GPS VCC'.",
    ],
  },
  12: {
    level: 12,
    tipeVisualPeriferal: "baterai_18650",
    namaPeriferal: "Baterai 18650 + INA219",
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
      "Clue 1 (Komponen): Tarik 'Baterai 18650 + INA219' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 35' -> klik 'Volt Out', lalu klik 'GND' -> klik 'Baterai (-)'.",
    ],
  },
  13: {
    level: 13,
    tipeVisualPeriferal: "struct_ram",
    namaPeriferal: "Bus Memori Struct C++",
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
      "Clue 1 (Komponen): Tarik 'Bus Memori Struct C++' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 13' -> klik 'Bus Struct'.",
    ],
  },
  14: {
    level: 14,
    tipeVisualPeriferal: "esp_now_radio",
    namaPeriferal: "Antena 2.4GHz ESP-NOW",
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
      "Clue 1 (Komponen): Tarik 'Antena 2.4GHz ESP-NOW' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'GPIO 2' -> klik 'Antena RF'.",
    ],
  },
  15: {
    level: 15,
    tipeVisualPeriferal: "mesh_10_node",
    namaPeriferal: "Gateway 10-Node Mesh",
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
      "Clue 1 (Komponen): Tarik 'Gateway 10-Node Mesh' ke kotak kanan.",
      "Clue 2 (Kabel): Klik 'TX2 (17)' -> klik 'Next-Hop (N+1)', lalu klik 'GPIO 2' -> klik 'Cloud Uplink'.",
    ],
  },
};

// ============================================================================
// KOMPONEN PENGGAMBAR PERANGKAT KERAS ASLI WOKWI DI DALAM SVG
// ============================================================================
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

    case "baterai_18650": {
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

    default: {
      return (
        <g>
          <rect
            x={385}
            y={58}
            width={125}
            height={128}
            rx={12}
            fill={simulasiHidup ? "#065f46" : "#1e293b"}
            stroke={simulasiHidup ? "#34d399" : "#38bdf8"}
            strokeWidth={2.5}
          />
          <text x={447} y={105} textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            MODUL HARDWARE
          </text>
          <text x={447} y={125} textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">
            {tipe.toUpperCase()}
          </text>
          <text x={447} y={148} textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
            {simulasiHidup ? "⚡ ONLINE & AKTIF" : "STANDBY"}
          </text>
        </g>
      );
    }
  }
};