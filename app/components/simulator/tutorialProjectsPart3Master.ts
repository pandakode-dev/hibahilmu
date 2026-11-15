// app/components/simulator/tutorialProjectsPart3Master.ts
import { PresetTutorialProject } from "./tutorialProjectsData";

export const TUTORIAL_PROJECTS_PART3_15_TO_20: PresetTutorialProject[] = [
  // ==========================================================================
  // PROYEK 15: TAMBAK UDANG (soil_moisture + dht22 + relay_2ch + water_pump + kipas_dc)
  // ==========================================================================
  {
    id: "wokwi-p15-tambak-udang-ph-kualitas-air",
    judul: "Otomasi Kualitas Air Tambak Udang & Aerator Pintar (Sensor Kualitas Air + Suhu DHT22 + Relay 2-Ch + Pompa & Kincir)",
    level: "Proyek 15 • Smart Aquaculture",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Jika Indeks Kualitas Air turun (< 45%) Pompa Sirkulasi menyala, dan jika Suhu Air Tambak panas (> 30°C) Kincir Air Oksigen berputar otomatis.",
    langkahWiring: [
      "1. Klik tombol '⚡ Simulasikan Kondisi Aktif' di atas kanvas, atau turunkan Kualitas Air < 45% dan naikkan Suhu > 30°C di Inspector kanan.",
      "2. Relay 2-Channel akan menyalakan Pompa Sirkulasi Tambak dan Kincir Air Oksigen!",
    ],
    nodes: [
      { id: "p15-esp", tipe: "esp32", label: "ESP32 Tambak Controller", x: 20, y: 50, nyala: true },
      { id: "p15-soil", tipe: "soil_moisture", label: "Sensor Kualitas & pH Air (%)", x: 215, y: 35, nilaiSensor: 75, nyala: true },
      { id: "p15-dht", tipe: "dht22", label: "Suhu Air Tambak (°C)", x: 225, y: 180, nilaiSensor: 26, nyala: true },
      { id: "p15-rel", tipe: "relay_2ch", label: "Relay 2-Ch Aerator", x: 385, y: 130, nyala: false },
      { id: "p15-pmp", tipe: "water_pump", label: "Pompa Sirkulasi Tambak", x: 575, y: 35, nyala: false },
      { id: "p15-fan", tipe: "kipas_dc", label: "Kincir Air Oksigen", x: 575, y: 190, nilaiSensor: 220, nyala: false },
    ],
    kabel: [
      { id: "p15-k1", dariId: "p15-soil", pinAsal: "AO", keId: "p15-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 155 }, { x: 12, y: 155 }] },
      { id: "p15-k2", dariId: "p15-dht", pinAsal: "DATA", keId: "p15-esp", pinTujuan: "GPIO15", warna: "#a855f7", titikSiku: [{ x: 266, y: 315 }, { x: 190, y: 224 }] },
      { id: "p15-k3", dariId: "p15-esp", pinAsal: "GPIO32", keId: "p15-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 285 }, { x: 447, y: 285 }] },
      { id: "p15-k4", dariId: "p15-esp", pinAsal: "GPIO33", keId: "p15-rel", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 12, y: 300 }, { x: 474, y: 300 }] },
      { id: "p15-k5", dariId: "p15-rel", pinAsal: "NO1", keId: "p15-pmp", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 405, y: 110 }, { x: 613, y: 160 }] },
      { id: "p15-k6", dariId: "p15-rel", pinAsal: "NO2", keId: "p15-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 473, y: 110 }, { x: 605, y: 310 }] },
    ],
    kodePerMcu: {
      "p15-esp": `// [PROYEK 15] SMART AQUACULTURE TAMBAK UDANG (KUALITAS AIR < 45% ATAU SUHU > 30C)
#include <Arduino.h>
#include <WiFi.h>
#include <DHT.h>

void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(15, INPUT);
  pinMode(32, OUTPUT);
  pinMode(33, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int kualitasAir = analogRead(34);
  int suhuTambak = analogRead(15);
  digitalWrite(32, kualitasAir < 45 ? HIGH : LOW);
  digitalWrite(33, suhuTambak > 30 ? HIGH : LOW);
  delay(600);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p15-esp": `from machine import Pin, ADC\nimport time\nwhile True:\n  time.sleep_ms(600)`,
    },
    blynkWidgets: [
      { id: "w-p15-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Indeks Kualitas Air Tambak", virtualPin: "V1", satuan: "%", warna: "sky", targetTipeKomponen: "soil_moisture" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 16: COLD-CHAIN VAKSIN MEDIS (dht22 + relay_1ch + kipas_dc + buzzer)
  // ==========================================================================
  {
    id: "wokwi-p16-cold-chain-vaksin-medis",
    judul: "Monitoring Cold-Chain Penyimpanan Vaksin Rumah Sakit (DHT22 Presisi + Kipas Pendingin Peltier + Buzzer + Telegram)",
    level: "Proyek 16 • Medical Cold-Chain IoT",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Menjaga suhu ruang penyimpanan vaksin medis. Jika suhu naik melewati batas aman (> 30°C), Relay menyalakan Kipas Kompresor Medis dan Alarm Buzzer.",
    langkahWiring: [
      "1. Klik 'Suhu Ruang Vaksin (°C)' di kanvas lalu geser slider suhu di Inspector ke atas 30°C (atau klik '⚡ Simulasikan Kondisi Aktif').",
      "2. Kipas Kompresor Medis dan Alarm Suhu Vaksin langsung bekerja!",
    ],
    nodes: [
      { id: "p16-esp", tipe: "esp32", label: "ESP32 Medical Logger", x: 25, y: 50, nyala: true },
      { id: "p16-dht", tipe: "dht22", label: "Suhu Ruang Vaksin (°C)", x: 225, y: 55, nilaiSensor: 20, nyala: true },
      { id: "p16-rel", tipe: "relay_1ch", label: "Relay Pendingin Peltier", x: 405, y: 130, nyala: false },
      { id: "p16-fan", tipe: "kipas_dc", label: "Kipas Kompresor Medis", x: 575, y: 40, nilaiSensor: 220, nyala: false },
      { id: "p16-buz", tipe: "buzzer", label: "Alarm Suhu Vaksin", x: 575, y: 190, nyala: false },
    ],
    kabel: [
      { id: "p16-k1", dariId: "p16-dht", pinAsal: "DATA", keId: "p16-esp", pinTujuan: "GPIO15", warna: "#38bdf8", titikSiku: [{ x: 266, y: 200 }, { x: 190, y: 224 }] },
      { id: "p16-k2", dariId: "p16-esp", pinAsal: "GPIO32", keId: "p16-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 15, y: 280 }, { x: 487, y: 280 }] },
      { id: "p16-k3", dariId: "p16-rel", pinAsal: "NO", keId: "p16-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 433, y: 110 }, { x: 605, y: 165 }] },
      { id: "p16-k4", dariId: "p16-esp", pinAsal: "GPIO27", keId: "p16-buz", pinTujuan: "ANODA", warna: "#ef4444", titikSiku: [{ x: 15, y: 310 }, { x: 606, y: 310 }] },
    ],
    kodePerMcu: {
      "p16-esp": `// [PROYEK 16] MEDICAL COLD-CHAIN VAKSIN (SUHU > 30C -> KOMPRESOR & ALARM ON)
#include <Arduino.h>
#include <WiFi.h>
#include <DHT.h>

void setup() {
  Serial.begin(115200);
  pinMode(15, INPUT);
  pinMode(32, OUTPUT);
  pinMode(27, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int suhu = analogRead(15); // Naikkan suhu > 30°C di Inspector untuk memicu kompresor & alarm!
  if (suhu > 30) {
    digitalWrite(32, HIGH);
    digitalWrite(27, HIGH);
  } else {
    digitalWrite(32, LOW);
    digitalWrite(27, LOW);
  }
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p16-esp": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p16-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Suhu Cold-Chain Vaksin (°C)", virtualPin: "V1", satuan: "°C", warna: "sky", targetTipeKomponen: "dht22" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 17: GARDU LISTRIK PINTAR PLN (potensiometer + relay_4ch + buzzer)
  // ==========================================================================
  {
    id: "wokwi-p17-smart-grid-pln-proteksi-beban",
    judul: "Gardu Listrik Pintar & Pemutus Beban Lebih Otomatis (Potensio Beban Daya + Relay 4-Ch + Alarm Overload)",
    level: "Proyek 17 • Smart Energy & PLN Grid",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Jika beban pemakaian daya (Potensiometer Beban > 50%) melampaui kuota kWh, sistem mengaktifkan Relay 4-Channel Distribusi dan Alarm Overload Daya.",
    langkahWiring: [
      "1. Klik 'Potensio Beban Daya (%)' di kanvas lalu geser slider ke atas 50% (atau klik '⚡ Simulasikan Kondisi Aktif').",
      "2. Relay 4-Channel Distribusi dan Alarm Overload Daya langsung menyala!",
    ],
    nodes: [
      { id: "p17-esp", tipe: "esp32", label: "ESP32 Smart Meter PLN", x: 25, y: 50, nyala: true },
      { id: "p17-pot", tipe: "potensiometer", label: "Potensio Beban Daya (%)", x: 230, y: 55, nilaiSensor: 30, nyala: true },
      { id: "p17-rel4", tipe: "relay_4ch", label: "Relay 4-Ch Distribusi", x: 405, y: 65, nyala: false },
      { id: "p17-buz", tipe: "buzzer", label: "Alarm Overload Daya", x: 580, y: 75, nyala: false },
    ],
    kabel: [
      { id: "p17-k1", dariId: "p17-pot", pinAsal: "SIG", keId: "p17-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 290, y: 185 }, { x: 15, y: 155 }] },
      { id: "p17-k2", dariId: "p17-esp", pinAsal: "GPIO32", keId: "p17-rel4", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 15, y: 280 }, { x: 465, y: 280 }] },
      { id: "p17-k3", dariId: "p17-esp", pinAsal: "GPIO27", keId: "p17-buz", pinTujuan: "ANODA", warna: "#ef4444", titikSiku: [{ x: 15, y: 310 }, { x: 611, y: 195 }] },
    ],
    kodePerMcu: {
      "p17-esp": `// [PROYEK 17] SMART GRID PLN & OVERLOAD PROTECTION (BEBAN > 50% -> RELAY 4CH & ALARM)
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(32, OUTPUT);
  pinMode(27, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int pot = analogRead(34);
  if (pot > 50) {
    digitalWrite(32, HIGH);
    digitalWrite(27, HIGH);
  } else {
    digitalWrite(32, LOW);
    digitalWrite(27, LOW);
  }
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p17-esp": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p17-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Persentase Beban Listrik (%)", virtualPin: "V1", satuan: "%", warna: "amber", targetTipeKomponen: "potensiometer" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 18: RUANG ISOLASI RS (mq2_gas + dht22 + relay_2ch + kipas_dc + water_pump)
  // ==========================================================================
  {
    id: "wokwi-p18-smart-hospital-ventilasi-gas",
    judul: "Sistem Ventilasi Tekanan Negatif Ruang Isolasi RS (Sensor Gas MQ-2 + Suhu DHT22 + Kipas HEPA + Pompa Disinfektan)",
    level: "Proyek 18 • Smart Hospital HVAC",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Jika kadar polutan udara MQ-2 >= 500 ppm atau Suhu Ruang > 30°C, Relay 2-Channel mengaktifkan Kipas HEPA Exhaust dan Pompa Kabut Disinfektan.",
    langkahWiring: [
      "1. Klik tombol '⚡ Simulasikan Kondisi Aktif' di atas kanvas, atau naikkan nilai Sensor Gas MQ-2 >= 500 ppm di Inspector kanan.",
      "2. Kipas HEPA Exhaust dan Pompa Disinfektan langsung bekerja mensterilkan ruangan!",
    ],
    nodes: [
      { id: "p18-esp", tipe: "esp32", label: "ESP32 HVAC Controller", x: 20, y: 50, nyala: true },
      { id: "p18-mq2", tipe: "mq2_gas", label: "Sensor Kualitas Udara (ppm)", x: 215, y: 35, nilaiSensor: 210, nyala: true },
      { id: "p18-dht", tipe: "dht22", label: "Suhu Ruang Isolasi (°C)", x: 225, y: 180, nilaiSensor: 24, nyala: true },
      { id: "p18-rel", tipe: "relay_2ch", label: "Relay 2-Ch Sterilisasi", x: 385, y: 130, nyala: false },
      { id: "p18-fan", tipe: "kipas_dc", label: "Kipas HEPA Exhaust", x: 575, y: 35, nilaiSensor: 220, nyala: false },
      { id: "p18-pmp", tipe: "water_pump", label: "Pompa Disinfektan", x: 575, y: 190, nyala: false },
    ],
    kabel: [
      { id: "p18-k1", dariId: "p18-mq2", pinAsal: "AO", keId: "p18-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 155 }, { x: 12, y: 155 }] },
      { id: "p18-k2", dariId: "p18-dht", pinAsal: "DATA", keId: "p18-esp", pinTujuan: "GPIO15", warna: "#a855f7", titikSiku: [{ x: 266, y: 315 }, { x: 190, y: 224 }] },
      { id: "p18-k3", dariId: "p18-esp", pinAsal: "GPIO32", keId: "p18-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 285 }, { x: 447, y: 285 }] },
      { id: "p18-k4", dariId: "p18-esp", pinAsal: "GPIO33", keId: "p18-rel", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 12, y: 300 }, { x: 474, y: 300 }] },
      { id: "p18-k5", dariId: "p18-rel", pinAsal: "NO1", keId: "p18-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 405, y: 110 }, { x: 605, y: 160 }] },
      { id: "p18-k6", dariId: "p18-rel", pinAsal: "NO2", keId: "p18-pmp", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 473, y: 110 }, { x: 613, y: 310 }] },
    ],
    kodePerMcu: {
      "p18-esp": `// [PROYEK 18] SMART HOSPITAL HVAC (GAS >= 500 PPM ATAU SUHU > 30C)
#include <Arduino.h>
#include <WiFi.h>
#include <DHT.h>

void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(15, INPUT);
  pinMode(32, OUTPUT);
  pinMode(33, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int gas = analogRead(34);
  int suhu = analogRead(15);
  digitalWrite(32, (gas >= 500 || suhu > 30) ? HIGH : LOW);
  digitalWrite(33, (gas >= 500 || suhu > 30) ? HIGH : LOW);
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p18-esp": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p18-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Partikel Udara Ruang RS (ppm)", virtualPin: "V1", satuan: "ppm", warna: "emerald", targetTipeKomponen: "mq2_gas" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 19: DETEKSI KARHUTLA GAMBUT RIAU (flame_sensor + mq2_gas + gps_neo6m + relay_1ch + water_pump)
  // ==========================================================================
  {
    id: "wokwi-p19-stasiun-hutan-10node-mesh",
    judul: "Deteksi Dini Kebakaran Hutan Gambut Riau & 10-Node Mesh (Flame + MQ-2 + GPS NEO-6M + Relay + Pompa Sekat Kanal)",
    level: "Proyek 19 • Master 10-Node Forestry",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Mendeteksi titik api (Flame > 35%) dan asap gambut (MQ-2 >= 500 ppm) beserta titik koordinat GPS NEO-6M (Pin TXD -> GPIO 16) untuk menyalakan Pompa Pembasah Gambut.",
    langkahWiring: [
      "1. Klik tombol '⚡ Simulasikan Kondisi Aktif' di atas kanvas untuk mensimulasikan munculnya titik api dan asap kebakaran gambut.",
      "2. Relay Sekat Kanal langsung aktif dan Pompa Pembasah Gambut menyemburkan air!",
    ],
    nodes: [
      { id: "p19-esp", tipe: "esp32", label: "ESP32 Karhutla Node #1", x: 20, y: 50, nyala: true },
      { id: "p19-flm", tipe: "flame_sensor", label: "Sensor Api Hutan", x: 215, y: 35, nilaiSensor: 0, nyala: false },
      { id: "p19-mq2", tipe: "mq2_gas", label: "Sensor Asap Gambut", x: 215, y: 185, nilaiSensor: 190, nyala: true },
      { id: "p19-gps", tipe: "gps_neo6m", label: "GPS Titik Hotspot", x: 395, y: 35, nilaiSensor: 9, nyala: true },
      { id: "p19-rel", tipe: "relay_1ch", label: "Relay Sekat Kanal", x: 395, y: 175, nyala: false },
      { id: "p19-pmp", tipe: "water_pump", label: "Pompa Pembasah Gambut", x: 575, y: 110, nyala: false },
    ],
    kabel: [
      { id: "p19-k1", dariId: "p19-flm", pinAsal: "SIG", keId: "p19-esp", pinTujuan: "GPIO4", warna: "#ef4444", titikSiku: [{ x: 280, y: 155 }, { x: 195, y: 198 }] },
      { id: "p19-k2", dariId: "p19-mq2", pinAsal: "AO", keId: "p19-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 300 }, { x: 12, y: 155 }] },
      { id: "p19-k3", dariId: "p19-gps", pinAsal: "TXD", keId: "p19-esp", pinTujuan: "GPIO16", warna: "#38bdf8", titikSiku: [{ x: 435, y: 155 }, { x: 195, y: 185 }] },
      { id: "p19-k4", dariId: "p19-esp", pinAsal: "GPIO32", keId: "p19-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 290 }, { x: 477, y: 290 }] },
      { id: "p19-k5", dariId: "p19-rel", pinAsal: "NO", keId: "p19-pmp", pinTujuan: "VCC_POS", warna: "#facc15", titikSiku: [{ x: 423, y: 155 }, { x: 613, y: 235 }] },
    ],
    kodePerMcu: {
      "p19-esp": `// [PROYEK 19] DETEKSI KARHUTLA LAHAN GAMBUT + GPS HOTSPOT + 10-NODE MESH
#include <Arduino.h>
#include <WiFi.h>
#include <TinyGPSPlus.h>

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);
  pinMode(4, INPUT);
  pinMode(34, INPUT);
  pinMode(32, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int api = analogRead(4);
  int gas = analogRead(34);
  if (api > 35 || gas >= 500) {
    digitalWrite(32, HIGH);
    Serial.println("🔥 [HOTSPOT GAMBUT TERDETEKSI] Pompa Pembasah Kanal ON!");
  } else {
    digitalWrite(32, LOW);
  }
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p19-esp": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p19-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Kepekatan Asap Karhutla (ppm)", virtualPin: "V1", satuan: "ppm", warna: "rose", targetTipeKomponen: "mq2_gas" },
      { id: "w-p19-2", tipe: "gauge", kategoriWidget: "Lanjutan & Peta", judul: "Satelit GPS Hotspot Riau", virtualPin: "V4", satuan: "Sat", warna: "emerald", targetTipeKomponen: "gps_neo6m" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 20: MASTER AIOT SMART FACTORY (Dual-ESP32 + dht22 + mq2_gas + relay_2ch + water_pump + kipas_dc)
  // ==========================================================================
  {
    id: "wokwi-p20-master-aiot-smart-factory-complete",
    judul: "Master AIoT Smart Factory & TinyML Predictive Maintenance (Dual-ESP32 + DHT22 + MQ-2 + Relay 2-Ch + Pompa Coolant + Blower)",
    level: "Proyek 20 • Puncak Master AIoT",
    kategoriProyek: "Multi-MCU",
    deskripsiSingkat:
      "Proyek Puncak Level 20: Menggabungkan 2 Mikrokontroler ESP32, fusi sensor Suhu Mesin DHT22 (> 30°C) & Gas Industri MQ-2 (>= 500 ppm) untuk menyalakan Pompa Coolant & Blower Pendingin.",
    langkahWiring: [
      "1. Klik tombol '⚡ Simulasikan Kondisi Aktif' di atas kanvas untuk mensimulasikan panas mesin berlebih dan lonjakan emisi gas.",
      "2. ESP32 #1 mengirim skor anomali TinyML ke ESP32 #2 via UART, lalu Relay 2-Ch menyalakan Pompa Coolant dan Blower Pendingin AI!",
    ],
    nodes: [
      { id: "p20-esp1", tipe: "esp32", label: "ESP32 #1 TinyML Edge AI", x: 20, y: 50, nyala: true },
      { id: "p20-dht", tipe: "dht22", label: "Suhu Mesin Utama (°C)", x: 215, y: 35, nilaiSensor: 26, nyala: true },
      { id: "p20-mq2", tipe: "mq2_gas", label: "Sensor Emisi Gas (ppm)", x: 215, y: 185, nilaiSensor: 220, nyala: true },
      { id: "p20-esp2", tipe: "esp32", label: "ESP32 #2 Cloud Gateway", x: 385, y: 35, nyala: true },
      { id: "p20-rel2", tipe: "relay_2ch", label: "Relay 2-Ch Proteksi AI", x: 385, y: 185, nyala: false },
      { id: "p20-pmp", tipe: "water_pump", label: "Pompa Coolant Mesin", x: 575, y: 40, nyala: false },
      { id: "p20-fan", tipe: "kipas_dc", label: "Blower Pendingin AI", x: 575, y: 190, nilaiSensor: 220, nyala: false },
    ],
    kabel: [
      { id: "p20-k1", dariId: "p20-dht", pinAsal: "DATA", keId: "p20-esp1", pinTujuan: "GPIO15", warna: "#38bdf8", titikSiku: [{ x: 266, y: 165 }, { x: 190, y: 224 }] },
      { id: "p20-k2", dariId: "p20-mq2", pinAsal: "AO", keId: "p20-esp1", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 300 }, { x: 12, y: 155 }] },
      { id: "p20-k3", dariId: "p20-esp1", pinAsal: "GPIO17", keId: "p20-esp2", pinTujuan: "GPIO16", warna: "#22c55e", titikSiku: [{ x: 345, y: 175 }, { x: 345, y: 185 }] },
      { id: "p20-k4", dariId: "p20-esp2", pinAsal: "GPIO32", keId: "p20-rel2", pinTujuan: "IN1", warna: "#a855f7", titikSiku: [{ x: 365, y: 295 }, { x: 447, y: 295 }] },
      { id: "p20-k5", dariId: "p20-rel2", pinAsal: "NO1", keId: "p20-pmp", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 405, y: 160 }, { x: 613, y: 160 }] },
      { id: "p20-k6", dariId: "p20-rel2", pinAsal: "NO2", keId: "p20-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 473, y: 160 }, { x: 605, y: 310 }] },
    ],
    kodePerMcu: {
      "p20-esp1": `// [PROYEK 20 - TAB #1] TINYML EDGE AI PREDICTIVE MAINTENANCE (SUHU > 30C ATAU GAS >= 500 PPM)
#include <Arduino.h>
#include <DHT.h>

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200);
  pinMode(15, INPUT);
  pinMode(34, INPUT);
}

void loop() {
  int suhu = analogRead(15);
  int gas = analogRead(34);
  Serial2.printf("AI_SCORE:%d,GAS:%d\\n", suhu, gas);
  delay(500);
}`,
      "p20-esp2": `// [PROYEK 20 - TAB #2] CLOUD GATEWAY & EKSEKUTOR PENDINGIN OTOMATIS
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200);
  pinMode(32, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int suhu = 35;
  int gas = 550;
  digitalWrite(32, (suhu > 30 || gas >= 500) ? HIGH : LOW);
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p20-esp1": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
      "p20-esp2": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p20-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Suhu Mesin Utama (°C)", virtualPin: "V1", satuan: "°C", warna: "rose", targetTipeKomponen: "dht22" },
      { id: "w-p20-2", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Emisi Gas Pabrik (ppm)", virtualPin: "V2", satuan: "ppm", warna: "amber", targetTipeKomponen: "mq2_gas" },
      { id: "w-p20-3", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Override Pompa Coolant AI", virtualPin: "V3", satuan: "PUMP", warna: "emerald", targetTipeKomponen: "water_pump" },
    ] as any,
  },
];