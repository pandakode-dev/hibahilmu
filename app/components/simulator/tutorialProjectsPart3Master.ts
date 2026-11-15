// app/components/simulator/tutorialProjectsPart3Master.ts
import { PresetTutorialProject } from "./tutorialProjectsData";

export const TUTORIAL_PROJECTS_PART3_15_TO_20: PresetTutorialProject[] = [
  {
    id: "wokwi-p15-tambak-udang-ph-kualitas-air",
    judul: "Otomasi Kualitas Air Tambak Udang & Aerator Pintar (Sensor pH Air + Suhu DHT22 + Relay 2-Ch + Pompa & Kipas Kincir)",
    level: "Proyek 15 • Smart Aquaculture",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p15-esp", tipe: "esp32", label: "ESP32 Tambak Controller", x: 35, y: 75, nyala: true },
      { id: "p15-soil", tipe: "kelembapan_tanah", label: "Sensor Kualitas & pH Air (%)", x: 220, y: 45, nilaiSensor: 75, nyala: true },
      { id: "p15-dht", tipe: "dht22", label: "Suhu Air Tambak (°C)", x: 220, y: 195, nilaiSensor: 27, nyala: true },
      { id: "p15-rel", tipe: "relay_2ch", label: "Relay 2-Ch Aerator", x: 400, y: 125, nyala: false },
      { id: "p15-pmp", tipe: "pompa_air", label: "Pompa Sirkulasi Tambak", x: 575, y: 45, nyala: false },
      { id: "p15-fan", tipe: "kipas_dc", label: "Kincir Air Oksigen", x: 575, y: 190, nyala: false },
    ],
    kabel: [
      { id: "p15-k1", dariId: "p15-soil", pinAsal: "AO", keId: "p15-esp", pinTujuan: "GPIO34", warna: "sky", titikSiku: [{ x: 195, y: 110 }] },
      { id: "p15-k2", dariId: "p15-dht", pinAsal: "DATA", keId: "p15-esp", pinTujuan: "GPIO15", warna: "#a855f7", titikSiku: [{ x: 195, y: 220 }] },
      { id: "p15-k3", dariId: "p15-esp", pinAsal: "GPIO32", keId: "p15-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 185 }] },
      { id: "p15-k4", dariId: "p15-esp", pinAsal: "GPIO33", keId: "p15-rel", pinTujuan: "IN2", warna: "#f97316", titikSiku: [{ x: 365, y: 205 }] },
      { id: "p15-k5", dariId: "p15-rel", pinAsal: "NO1", keId: "p15-pmp", pinTujuan: "VCC_POS", warna: "rose", titikSiku: [{ x: 540, y: 95 }] },
      { id: "p15-k6", dariId: "p15-rel", pinAsal: "NO2", keId: "p15-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 540, y: 215 }] },
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
      { id: "w-p15-1", tipe: "gauge", judul: "Indeks Kualitas Air Tambak", vPin: "V1", targetNodeId: "p15-soil", warna: "sky" },
    ] as any,
  },

  {
    id: "wokwi-p16-cold-chain-vaksin-medis",
    judul: "Monitoring Cold-Chain Penyimpanan Vaksin Rumah Sakit (DHT22 Presisi + Kipas Pendingin Peltier + Buzzer + Telegram)",
    level: "Proyek 16 • Medical Cold-Chain IoT",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p16-esp", tipe: "esp32", label: "ESP32 Medical Logger", x: 35, y: 75, nyala: true },
      { id: "p16-dht", tipe: "dht22", label: "Suhu Ruang Vaksin (°C)", x: 225, y: 65, nilaiSensor: 22, nyala: true },
      { id: "p16-rel", tipe: "relay_1ch", label: "Relay Pendingin Peltier", x: 405, y: 130, nyala: false },
      { id: "p16-fan", tipe: "kipas_dc", label: "Kipas Kompresor Medis", x: 575, y: 55, nyala: false },
      { id: "p16-buz", tipe: "buzzer", label: "Alarm Suhu Vaksin", x: 575, y: 195, nyala: false },
    ],
    kabel: [
      { id: "p16-k1", dariId: "p16-dht", pinAsal: "DATA", keId: "p16-esp", pinTujuan: "GPIO15", warna: "sky", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p16-k2", dariId: "p16-esp", pinAsal: "GPIO32", keId: "p16-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 185 }] },
      { id: "p16-k3", dariId: "p16-rel", pinAsal: "NO", keId: "p16-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 535, y: 105 }] },
      { id: "p16-k4", dariId: "p16-esp", pinAsal: "GPIO27", keId: "p16-buz", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 535, y: 215 }] },
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
      { id: "w-p16-1", tipe: "gauge", judul: "Suhu Cold-Chain Vaksin (°C)", vPin: "V1", targetNodeId: "p16-dht", warna: "sky" },
    ] as any,
  },

  {
    id: "wokwi-p17-smart-grid-pln-proteksi-beban",
    judul: "Gardu Listrik Pintar & Pemutus Beban Lebih Otomatis (Sensor Tegangan/Arus + Potensio Beban + Relay 4-Ch + Buzzer)",
    level: "Proyek 17 • Smart Energy & PLN Grid",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p17-esp", tipe: "esp32", label: "ESP32 Smart Meter PLN", x: 35, y: 75, nyala: true },
      { id: "p17-pot", tipe: "potensiometer", label: "Potensio Beban Daya (%)", x: 225, y: 65, nilaiSensor: 35, nyala: true },
      { id: "p17-rel4", tipe: "relay_4ch", label: "Relay 4-Ch Distribusi", x: 405, y: 65, nyala: false },
      { id: "p17-buz", tipe: "buzzer", label: "Alarm Overload Daya", x: 580, y: 90, nyala: false },
    ],
    kabel: [
      { id: "p17-k1", dariId: "p17-pot", pinAsal: "SIG", keId: "p17-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p17-k2", dariId: "p17-esp", pinAsal: "GPIO32", keId: "p17-rel4", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 185 }] },
      { id: "p17-k3", dariId: "p17-esp", pinAsal: "GPIO27", keId: "p17-buz", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 540, y: 205 }] },
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
  int pot = analogRead(34); // Naikkan beban > 50% di Inspector untuk menguji overload!
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
      { id: "w-p17-1", tipe: "gauge", judul: "Persentase Beban Listrik (%)", vPin: "V1", targetNodeId: "p17-pot", warna: "amber" },
    ] as any,
  },

  {
    id: "wokwi-p18-smart-hospital-ventilasi-gas",
    judul: "Sistem Ventilasi Tekanan Negatif Ruang Isolasi RS (Sensor Gas/Udara MQ-2 + Suhu DHT22 + Kipas Exhaust + Pompa Disinfektan)",
    level: "Proyek 18 • Smart Hospital HVAC",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p18-esp", tipe: "esp32", label: "ESP32 HVAC Controller", x: 35, y: 75, nyala: true },
      { id: "p18-mq2", tipe: "mq2", label: "Sensor Kualitas Udara (ppm)", x: 220, y: 50, nilaiSensor: 220, nyala: true },
      { id: "p18-dht", tipe: "dht22", label: "Suhu Ruang Isolasi (°C)", x: 220, y: 195, nilaiSensor: 25, nyala: true },
      { id: "p18-rel", tipe: "relay_2ch", label: "Relay 2-Ch Sterilisasi", x: 405, y: 125, nyala: false },
      { id: "p18-fan", tipe: "kipas_dc", label: "Kipas HEPA Exhaust", x: 575, y: 50, nyala: false },
      { id: "p18-pmp", tipe: "pompa_air", label: "Pompa Disinfektan", x: 575, y: 195, nyala: false },
    ],
    kabel: [
      { id: "p18-k1", dariId: "p18-mq2", pinAsal: "AO", keId: "p18-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 195, y: 110 }] },
      { id: "p18-k2", dariId: "p18-dht", pinAsal: "DATA", keId: "p18-esp", pinTujuan: "GPIO15", warna: "sky", titikSiku: [{ x: 195, y: 220 }] },
      { id: "p18-k3", dariId: "p18-esp", pinAsal: "GPIO32", keId: "p18-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 185 }] },
      { id: "p18-k4", dariId: "p18-rel", pinAsal: "NO1", keId: "p18-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 535, y: 95 }] },
      { id: "p18-k5", dariId: "p18-rel", pinAsal: "NO2", keId: "p18-pmp", pinTujuan: "VCC_POS", warna: "rose", titikSiku: [{ x: 535, y: 215 }] },
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
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int gas = analogRead(34);
  int suhu = analogRead(15);
  digitalWrite(32, (gas >= 500 || suhu > 30) ? HIGH : LOW);
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p18-esp": `from machine import Pin\nimport time\nwhile True:\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p18-1", tipe: "gauge", judul: "Partikel Udara Ruang RS (ppm)", vPin: "V1", targetNodeId: "p18-mq2", warna: "emerald" },
    ] as any,
  },

  {
    id: "wokwi-p19-stasiun-hutan-10node-mesh",
    judul: "Deteksi Dini Kebakaran Hutan Gambut Riau & 10-Node Mesh (Flame + MQ-2 + NPK + GPS + Baterai 18650 + Pompa)",
    level: "Proyek 19 • Master 10-Node Forestry",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p19-esp", tipe: "esp32", label: "ESP32 Karhutla Node #1", x: 30, y: 65, nyala: true },
      { id: "p19-flm", tipe: "flame", label: "Sensor Api Hutan", x: 215, y: 45, nilaiSensor: 0, nyala: false },
      { id: "p19-mq2", tipe: "mq2", label: "Sensor Asap Gambut", x: 215, y: 195, nilaiSensor: 190, nyala: true },
      { id: "p19-gps", tipe: "gps_neo6m", label: "GPS Titik Hotspot", x: 390, y: 45, nilaiSensor: 9, nyala: true },
      { id: "p19-rel", tipe: "relay_1ch", label: "Relay Sekat Kanal", x: 390, y: 190, nyala: false },
      { id: "p19-pmp", tipe: "pompa_air", label: "Pompa Pembasah Gambut", x: 570, y: 120, nyala: false },
    ],
    kabel: [
      { id: "p19-k1", dariId: "p19-flm", pinAsal: "SIG", keId: "p19-esp", pinTujuan: "GPIO4", warna: "rose", titikSiku: [{ x: 185, y: 110 }] },
      { id: "p19-k2", dariId: "p19-mq2", pinAsal: "AO", keId: "p19-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 185, y: 215 }] },
      { id: "p19-k3", dariId: "p19-gps", pinAsal: "SIG", keId: "p19-esp", pinTujuan: "GPIO16", warna: "sky", titikSiku: [{ x: 350, y: 95 }] },
      { id: "p19-k4", dariId: "p19-esp", pinAsal: "GPIO32", keId: "p19-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 350, y: 215 }] },
      { id: "p19-k5", dariId: "p19-rel", pinAsal: "NO", keId: "p19-pmp", pinTujuan: "VCC_POS", warna: "#facc15", titikSiku: [{ x: 530, y: 180 }] },
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
      { id: "w-p19-1", tipe: "gauge", judul: "Kepekatan Asap Karhutla (ppm)", vPin: "V1", targetNodeId: "p19-mq2", warna: "rose" },
      { id: "w-p19-2", tipe: "gauge", judul: "Titik Koordinat Hotspot Riau", vPin: "V4", targetNodeId: "p19-gps", warna: "emerald" },
    ] as any,
  },

  {
    id: "wokwi-p20-master-aiot-smart-factory-complete",
    judul: "Master AIoT Smart Factory & TinyML Predictive Maintenance (Dual-ESP32 + DHT22 + MQ-2 + Relay 4-Ch + Servo + Pompa + Cloud)",
    level: "Proyek 20 • Puncak Master AIoT",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p20-esp1", tipe: "esp32", label: "ESP32 #1 TinyML Edge AI", x: 30, y: 60, nyala: true },
      { id: "p20-dht", tipe: "dht22", label: "Suhu Mesin Utama (°C)", x: 215, y: 45, nilaiSensor: 28, nyala: true },
      { id: "p20-mq2", tipe: "mq2", label: "Sensor Emisi Gas (ppm)", x: 215, y: 195, nilaiSensor: 240, nyala: true },
      { id: "p20-esp2", tipe: "esp32", label: "ESP32 #2 Cloud Gateway", x: 390, y: 50, nyala: true },
      { id: "p20-rel4", tipe: "relay_4ch", label: "Relay 4-Ch Proteksi AI", x: 390, y: 195, nyala: false },
      { id: "p20-pmp", tipe: "pompa_air", label: "Pompa Coolant Mesin", x: 575, y: 60, nyala: false },
      { id: "p20-fan", tipe: "kipas_dc", label: "Blower Pendingin AI", x: 575, y: 195, nyala: false },
    ],
    kabel: [
      { id: "p20-k1", dariId: "p20-dht", pinAsal: "DATA", keId: "p20-esp1", pinTujuan: "GPIO15", warna: "sky", titikSiku: [{ x: 185, y: 110 }] },
      { id: "p20-k2", dariId: "p20-mq2", pinAsal: "AO", keId: "p20-esp1", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 185, y: 215 }] },
      { id: "p20-k3", dariId: "p20-esp1", pinAsal: "GPIO17", keId: "p20-esp2", pinTujuan: "GPIO16", warna: "#22c55e", titikSiku: [{ x: 350, y: 120 }] },
      { id: "p20-k4", dariId: "p20-esp2", pinAsal: "GPIO32", keId: "p20-rel4", pinTujuan: "IN1", warna: "#a855f7", titikSiku: [{ x: 355, y: 220 }] },
      { id: "p20-k5", dariId: "p20-rel4", pinAsal: "NO1", keId: "p20-pmp", pinTujuan: "VCC_POS", warna: "rose", titikSiku: [{ x: 535, y: 110 }] },
      { id: "p20-k6", dariId: "p20-rel4", pinAsal: "NO2", keId: "p20-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 535, y: 220 }] },
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
  int suhu = analogRead(15); // Naikkan suhu > 30°C atau gas >= 500 ppm di Inspector!
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
  int suhu = 32;
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
      { id: "w-p20-1", tipe: "gauge", judul: "Suhu Mesin Utama (°C)", vPin: "V1", targetNodeId: "p20-dht", warna: "rose" },
      { id: "w-p20-2", tipe: "gauge", judul: "Emisi Gas Pabrik (ppm)", vPin: "V2", targetNodeId: "p20-mq2", warna: "amber" },
      { id: "w-p20-3", tipe: "switch", judul: "Override Pompa Coolant AI", vPin: "V3", targetNodeId: "p20-pmp", warna: "emerald" },
    ] as any,
  },
];