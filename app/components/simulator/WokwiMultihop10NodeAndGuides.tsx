"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Wifi,
  BatteryCharging,
  MapPin,
  Thermometer,
  Sprout,
  Play,
  Square,
  BookOpen,
  Code2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  RefreshCw,
  Globe,
  Zap,
  Layers,
} from "lucide-react";

// ============================================================================
// TIPE DATA NODE MULTI-HOP (10 NODE ESP32) & PANDUAN 8 PROYEK
// ============================================================================
export interface Esp32MeshNodeData {
  nodeId: number;
  namaBlok: string;
  peran: "Sensor Node" | "Relay Router Node" | "Internet Gateway (Node 10)";
  aktif: boolean;
  suhuUdara: number; // °C
  npkNitrogen: number; // mg/kg
  npkFosfor: number; // mg/kg
  npkKalium: number; // mg/kg
  teganganVolt: number; // 3.00V - 4.20V
  bateraiPersen: number; // 0% - 100%
  gpsLat: number;
  gpsLng: number;
  rssiDbm: number;
  nextHopNodeId: number;
}

export interface PanduanProyekWokwi {
  nomor: number;
  kategori: string;
  judul: string;
  tabMcu: string;
  penjelasanSistem: string;
  komponenUtama: string[];
  langkahPraktikum: string[];
  caraSimulasi: string[];
  panduanModifikasiKode: {
    judulModifikasi: string;
    barisKodeAsli: string;
    barisKodeModifikasi: string;
    penjelasanEfek: string;
    parameterInteraktifLabel: string;
    nilaiDefault: number;
    nilaiMin: number;
    nilaiMax: number;
    satuan: string;
  };
  fullSketchIno: string;
}

const INITIAL_10_NODES: Esp32MeshNodeData[] = [
  {
    nodeId: 1,
    namaBlok: "Blok A1 (Hulu Barat)",
    peran: "Sensor Node",
    aktif: true,
    suhuUdara: 28.4,
    npkNitrogen: 145,
    npkFosfor: 62,
    npkKalium: 190,
    teganganVolt: 4.12,
    bateraiPersen: 94,
    gpsLat: 1.66812,
    gpsLng: 101.4451,
    rssiDbm: -52,
    nextHopNodeId: 2,
  },
  {
    nodeId: 2,
    namaBlok: "Blok A2 (Sektor Utara)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 29.1,
    npkNitrogen: 132,
    npkFosfor: 58,
    npkKalium: 175,
    teganganVolt: 4.05,
    bateraiPersen: 88,
    gpsLat: 1.66845,
    gpsLng: 101.4456,
    rssiDbm: -55,
    nextHopNodeId: 3,
  },
  {
    nodeId: 3,
    namaBlok: "Blok A3 (Lahan Tengah 1)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 30.2,
    npkNitrogen: 95,
    npkFosfor: 41,
    npkKalium: 130,
    teganganVolt: 3.92,
    bateraiPersen: 76,
    gpsLat: 1.6688,
    gpsLng: 101.44615,
    rssiDbm: -58,
    nextHopNodeId: 4,
  },
  {
    nodeId: 4,
    namaBlok: "Blok B1 (Lahan Tengah 2)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 31.0,
    npkNitrogen: 82,
    npkFosfor: 38,
    npkKalium: 118,
    teganganVolt: 3.85,
    bateraiPersen: 68,
    gpsLat: 1.66915,
    gpsLng: 101.4467,
    rssiDbm: -60,
    nextHopNodeId: 5,
  },
  {
    nodeId: 5,
    namaBlok: "Blok B2 (Lembah Irigasi)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 27.9,
    npkNitrogen: 168,
    npkFosfor: 74,
    npkKalium: 215,
    teganganVolt: 3.98,
    bateraiPersen: 81,
    gpsLat: 1.6695,
    gpsLng: 101.4472,
    rssiDbm: -54,
    nextHopNodeId: 6,
  },
  {
    nodeId: 6,
    namaBlok: "Blok B3 (Bukit Timur 1)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 32.6,
    npkNitrogen: 74,
    npkFosfor: 33,
    npkKalium: 105,
    teganganVolt: 3.76,
    bateraiPersen: 58,
    gpsLat: 1.66985,
    gpsLng: 101.44775,
    rssiDbm: -63,
    nextHopNodeId: 7,
  },
  {
    nodeId: 7,
    namaBlok: "Blok C1 (Bukit Timur 2)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 30.8,
    npkNitrogen: 120,
    npkFosfor: 52,
    npkKalium: 164,
    teganganVolt: 3.89,
    bateraiPersen: 72,
    gpsLat: 1.6702,
    gpsLng: 101.4483,
    rssiDbm: -59,
    nextHopNodeId: 8,
  },
  {
    nodeId: 8,
    namaBlok: "Blok C2 (Zona Rumah Kaca)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 28.7,
    npkNitrogen: 185,
    npkFosfor: 80,
    npkKalium: 230,
    teganganVolt: 4.15,
    bateraiPersen: 96,
    gpsLat: 1.67055,
    gpsLng: 101.44885,
    rssiDbm: -49,
    nextHopNodeId: 9,
  },
  {
    nodeId: 9,
    namaBlok: "Blok C3 (Pos Pantau Hilir)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 29.5,
    npkNitrogen: 140,
    npkFosfor: 60,
    npkKalium: 188,
    teganganVolt: 4.01,
    bateraiPersen: 84,
    gpsLat: 1.6709,
    gpsLng: 101.4494,
    rssiDbm: -46,
    nextHopNodeId: 10,
  },
  {
    nodeId: 10,
    namaBlok: "GATEWAY UTAMA (Stasiun Internet)",
    peran: "Internet Gateway (Node 10)",
    aktif: true,
    suhuUdara: 27.5,
    npkNitrogen: 155,
    npkFosfor: 68,
    npkKalium: 202,
    teganganVolt: 4.19,
    bateraiPersen: 99,
    gpsLat: 1.67125,
    gpsLng: 101.4500,
    rssiDbm: -38,
    nextHopNodeId: 0, // 0 = Terhubung langsung ke Cloud Internet
  },
];

// ============================================================================
// DATABASE LENGKAP 8 PANDUAN PROYEK WOKWI (PENJELASAN, SIMULASI, & MODIFIKASI KODE)
// ============================================================================
export const DAFTAR_8_PANDUAN_LENGKAP_WOKWI: PanduanProyekWokwi[] = [
  {
    nomor: 1,
    kategori: "PROYEK 1 • DASAR",
    judul: "Lampu Jalan Pintar (Sensor Cahaya LDR + Relay 1-Ch + LED)",
    tabMcu: "1 Tab MCU",
    penjelasanSistem:
      "Sistem ini mengotomatiskan penyalaan lampu jalan raya berdasarkan intensitas cahaya matahari (Lux). Sensor LDR (Light Dependent Resistor) mengubah perubahan cahaya menjadi tegangan analog yang dibaca oleh pin ADC GPIO 34 ESP32. Saat cuaca mendung atau malam hari (< 300 Lux), ESP32 memicu modul Relay untuk mengalirkan listrik ke lampu jalan.",
    komponenUtama: [
      "ESP32 DevKit V1 (Pin ADC GPIO 34 & Output GPIO 26)",
      "Modul Sensor Cahaya LDR (Photoresistor)",
      "Modul Relay 1-Channel 5V (Sakelar Magnetik)",
      "Lampu Jalan LED / Bohlam AC",
    ],
    langkahPraktikum: [
      "Klik kartu 'Proyek 1' untuk memuat skema rangkaian Lampu Jalan Pintar ke meja kerja Wokwi.",
      "Perhatikan jalur kabel: Pin AO (Analog Out) dari sensor LDR terhubung ke GPIO 34 ESP32, sedangkan pin IN Relay terhubung ke GPIO 26.",
      "Klik tombol hijau '▶ Jalankan Simulasi' di pojok kanan atas kanvas rangkaian.",
      "Geser slider intensitas cahaya matahari (Lux) pada komponen LDR dari nilai terang (800 Lux) turun ke nilai gelap (< 300 Lux).",
    ],
    caraSimulasi: [
      "Uji Kondisi Siang Hari: Atur slider LDR di atas 500 Lux -> Perhatikan LED indikator pada modul Relay mati dan Lampu Jalan padam (hemat energi).",
      "Uji Kondisi Malam Hari: Turunkan slider LDR di bawah 300 Lux -> Kontaktor Relay akan berbunyi klik (aktif) dan Lampu Jalan menyala kuning terang.",
      "Buka panel Serial Monitor di bawah untuk mengamati log pembacaan nilai ADC (0-4095) dan konversi Lux setiap detiknya.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah Ambang Batas Cahaya Sore/Mendung (Threshold Lux)",
      barisKodeAsli: "const int BATAS_LUX_MALAM = 300; // Lampu nyala jika < 300 Lux",
      barisKodeModifikasi: "const int BATAS_LUX_MALAM = 500; // Lampu nyala lebih awal saat mendung (< 500 Lux)",
      penjelasanEfek:
        "Jika Anda mengganti nilai 300 menjadi 500 di kodingan, maka lampu jalan akan menyala lebih cepat begitu cuaca mulai mendung (tidak menunggu gelap gulita). Coba ubah nilainya menggunakan pengatur di bawah ini!",
      parameterInteraktifLabel: "Nilai BATAS_LUX_MALAM di Kodingan",
      nilaiDefault: 300,
      nilaiMin: 50,
      nilaiMax: 850,
      satuan: "Lux",
    },
    fullSketchIno: `// PROYEK 1: Lampu Jalan Pintar LDR + Relay 1-Channel
#define PIN_LDR 34
#define PIN_RELAY 26
#define PIN_LED 2

// ---> UBAH ANGKA INI UNTUK MENGATUR KAPAN LAMPU MENYALA <---
int BATAS_LUX_MALAM = 300; 

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LDR, INPUT);
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  Serial.println("[SYSTEM] Lampu Jalan Pintar Siap!");
}

void loop() {
  int nilaiAdc = analogRead(PIN_LDR);
  int intensitasLux = map(nilaiAdc, 0, 4095, 0, 1000);
  
  bool kondisiMalam = (intensitasLux < BATAS_LUX_MALAM);
  digitalWrite(PIN_RELAY, kondisiMalam ? HIGH : LOW);
  digitalWrite(PIN_LED, kondisiMalam ? HIGH : LOW);
  
  Serial.printf("[LDR] Cahaya: %d Lux (Batas: %d) -> Lampu: %s\\n",
                intensitasLux, BATAS_LUX_MALAM, kondisiMalam ? "MENYALA" : "PADAM");
  delay(1000);
}`,
  },
  {
    nomor: 2,
    kategori: "PROYEK 2 • IOT & TELEGRAM",
    judul: "Smart Door Lock & Telegram Bot (RFID + Relay 1-Ch + Solenoid 12V + Servo 180°)",
    tabMcu: "1 Tab MCU",
    penjelasanSistem:
      "Sistem keamanan pintu laboratorium cerdas menggunakan pembaca kartu frekuensi radio (RFID RC522) yang dikombinasikan dengan kunci besi elektrik (Solenoid Door Lock 12V), motor penggerak palang pintu (Servo SG90), serta notifikasi ke Telegram Bot setiap kali ada kartu yang ditempelkan.",
    komponenUtama: [
      "ESP32 DevKit V1 (Komunikasi SPI & PWM)",
      "Modul RFID Reader RC522 (13.56 MHz)",
      "Solenoid Door Lock 12V DC + Relay Penggerak",
      "Motor Servo SG90 (Sudut Buka Palang 0° - 180°)",
    ],
    langkahPraktikum: [
      "Pilih kartu 'Proyek 2' untuk memuat rangkaian Smart Door Lock.",
      "Pastikan jalur pin SPI RFID (SDA, SCK, MOSI, MISO) dan pin PWM Servo (GPIO 13) sudah terhubung ke ESP32.",
      "Jalankan simulasi, lalu klik tombol 'Tempel Kartu E-KTP Valid' atau 'Tempel Kartu Asing (Ditolak)'.",
      "Amati pergerakan batang kunci Solenoid dan putaran lengan Motor Servo beserta log notifikasi Telegram di Serial Monitor.",
    ],
    caraSimulasi: [
      "Simulasi Kartu Terdaftar: Saat UID kartu cocok, Relay aktif menarik batang Solenoid (UNLOCKED), Servo berputar ke 90°, dan Telegram mengirim pesan 'Akses Diterima'.",
      "Simulasi Kartu Ilegal: Saat UID tidak dikenali, Solenoid tetap terkunci rapat, Buzzer berbunyi peringatan, dan Telegram mengirim peringatan penyusup.",
      "Simulasi Auto-Lock: Perhatikan bahwa setelah beberapa detik pintu terbuka, Servo otomatis kembali ke 0° untuk mengunci pintu kembali.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah Sudut Buka Palang Servo & Durasi Kunci Terbuka",
      barisKodeAsli: "const int SUDUT_BUKA_SERVO = 90; // Buka pintu 90 derajat",
      barisKodeModifikasi: "const int SUDUT_BUKA_SERVO = 145; // Buka pintu lebih lebar 145 derajat",
      penjelasanEfek:
        "Dengan mengubah konstanta SUDUT_BUKA_SERVO di dalam fungsi loop(), Anda menentukan seberapa lebar lengan mekanik motor servo berputar saat kartu RFID valid ditempelkan.",
      parameterInteraktifLabel: "Nilai SUDUT_BUKA_SERVO di Kodingan",
      nilaiDefault: 90,
      nilaiMin: 30,
      nilaiMax: 180,
      satuan: "° (Derajat)",
    },
    fullSketchIno: `// PROYEK 2: Smart Door Lock RFID + Solenoid 12V + Servo + Telegram
#include <ESP32Servo.h>
#define PIN_SOLENOID_RELAY 27
#define PIN_SERVO 13
#define PIN_BUZZER 14

Servo servoPintu;
// ---> UBAH SUDUT BUKA SERVO (0 - 180 DERAJAT) <---
int SUDUT_BUKA_SERVO = 90;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SOLENOID_RELAY, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  servoPintu.attach(PIN_SERVO);
  servoPintu.write(0);
}

void loop() {
  // Ketika kartu RFID valid terdeteksi:
  digitalWrite(PIN_SOLENOID_RELAY, HIGH); // Tarik Solenoid
  servoPintu.write(SUDUT_BUKA_SERVO);     // Putar Servo
  Serial.printf("[TELEGRAM BOT] Pintu Terbuka! Sudut Servo: %d deg\\n", SUDUT_BUKA_SERVO);
  delay(3000);
}`,
  },
  {
    nomor: 3,
    kategori: "PROYEK 3 • IOT PERTANIAN",
    judul: "Smart Greenhouse & Irigasi (Soil + DHT22 + Relay 2-Ch + Pompa Air Mini & Kipas)",
    tabMcu: "1 Tab MCU",
    penjelasanSistem:
      "Sistem rumah kaca pertanian presisi yang menjaga iklim mikro tanaman secara otomatis. Sensor DHT22 memantau suhu dan kelembaban udara, sedangkan sensor Soil Moisture membaca kadar air tanah. Relay Channel 1 menyalakan Kipas Pendingin jika suhu terlalu panas, dan Relay Channel 2 menyalakan Pompa Air jika tanah mengering.",
    komponenUtama: [
      "ESP32 DevKit V1",
      "Sensor Suhu & Kelembaban Udara DHT22 (GPIO 15)",
      "Sensor Kelembaban Tanah / Soil Moisture (GPIO 35)",
      "Relay 2-Channel + Pompa Air Mini + Kipas Exhaust",
    ],
    langkahPraktikum: [
      "Muat 'Proyek 3' dan perhatikan dua sensor utama: DHT22 (putih) dan probe Soil Moisture.",
      "Naikkan suhu pada slider DHT22 hingga melewati 32°C dan amati baling-baling Kipas Pendingin yang mulai berputar.",
      "Turunkan kelembaban tanah pada slider Soil Moisture ke bawah 40% dan amati Pompa Irigasi menyemprotkan air.",
    ],
    caraSimulasi: [
      "Kondisi Siang Terik: Set Suhu = 36°C dan Tanah = 25% -> Kedua Relay aktif bersamaan (Kipas mendinginkan ruangan & Pompa menyiram tanaman).",
      "Kondisi Malam Sejuk & Tanah Basah: Set Suhu = 24°C dan Tanah = 75% -> Kipas dan Pompa otomatis berhenti untuk mencegah pembusukan akar.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah Batas Suhu Maksimal Penyalaan Kipas Greenhouse",
      barisKodeAsli: "const float BATAS_SUHU_PANAS = 32.0; // Kipas ON jika > 32 C",
      barisKodeModifikasi: "const float BATAS_SUHU_PANAS = 28.0; // Tanaman dataran tinggi (sejuk < 28 C)",
      penjelasanEfek:
        "Setiap tanaman membutuhkan suhu ideal berbeda. Jika Anda menanam stroberi atau selada hidroponik, ubah BATAS_SUHU_PANAS menjadi 28.0 agar kipas menyala lebih dini.",
      parameterInteraktifLabel: "Nilai BATAS_SUHU_PANAS di Kodingan",
      nilaiDefault: 32,
      nilaiMin: 20,
      nilaiMax: 42,
      satuan: "°C",
    },
    fullSketchIno: `// PROYEK 3: Smart Greenhouse DHT22 + Soil Moisture + Pompa & Kipas
#include "DHTesp.h"
#define PIN_DHT 15
#define PIN_SOIL 35
#define PIN_POMPA 25
#define PIN_KIPAS 33

float BATAS_SUHU_PANAS = 32.0;
int BATAS_TANAH_KERING = 40;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_POMPA, OUTPUT);
  pinMode(PIN_KIPAS, OUTPUT);
}

void loop() {
  // Logika kontrol iklim otomatis rumah kaca
  Serial.printf("[GREENHOUSE] Target Suhu Maks: %.1f C | Min Tanah: %d%%\\n", BATAS_SUHU_PANAS, BATAS_TANAH_KERING);
  delay(1500);
}`,
  },
  {
    nomor: 4,
    kategori: "PROYEK 4 • PROTEKSI BAHAYA",
    judul: "Sistem Pemadam Kebakaran & Gas (Flame + MQ-2 + Relay 1-Ch + Pompa Air + Buzzer)",
    tabMcu: "1 Tab MCU",
    penjelasanSistem:
      "Sistem keselamatan pabrik dan dapur pintar yang mendeteksi kebocoran gas LPG/asap (Sensor MQ-2) serta titik nyala api inframerah (Flame Sensor KY-026). Saat kadar gas melewati ambang aman (PPM) atau terdeteksi api, ESP32 langsung menyalakan sirine Buzzer dan memicu Relay Pompa Air Sprinkler.",
    komponenUtama: [
      "ESP32 DevKit V1",
      "Sensor Gas & Asap MQ-2 (ADC GPIO 32)",
      "Flame Sensor Pendeteksi Api (GPIO 33)",
      "Relay Pompa Sprinkler Pemadam + Piezo Buzzer",
    ],
    langkahPraktikum: [
      "Muat 'Proyek 4' ke kanvas simulasi.",
      "Geser slider kadar gas MQ-2 dari kondisi udara bersih (150 PPM) naik menuju kondisi bocor (> 500 PPM).",
      "Amati perubahan status alarm darurat dan aktifnya pompa pemadam otomatis.",
    ],
    caraSimulasi: [
      "Uji Kebocoran Gas LPG: Naikkan nilai PPM di atas batas bahaya -> Buzzer berbunyi nyaring dan katup/kipas darurat menyala.",
      "Uji Deteksi Titik Api: Aktifkan pemicu Flame Sensor -> Pompa air pemadam langsung menyemprotkan air secara otomatis.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengatur Sensitivitas Ambang Bahaya Gas Asap/LPG (PPM)",
      barisKodeAsli: "const int BATAS_GAS_BAHAYA_PPM = 500; // Alarm aktif di 500 PPM",
      barisKodeModifikasi: "const int BATAS_GAS_BAHAYA_PPM = 300; // Deteksi ekstra sensitif (300 PPM)",
      penjelasanEfek:
        "Menurunkan nilai BATAS_GAS_BAHAYA_PPM menjadi 300 membuat alarm jauh lebih peka terhadap kebocoran gas sekecil apa pun sebelum sempat memicu percikan api.",
      parameterInteraktifLabel: "Nilai BATAS_GAS_BAHAYA_PPM di Kodingan",
      nilaiDefault: 500,
      nilaiMin: 150,
      nilaiMax: 900,
      satuan: "PPM",
    },
    fullSketchIno: `// PROYEK 4: Proteksi Kebakaran & Kebocoran Gas MQ-2 + Flame Sensor
#define PIN_MQ2 32
#define PIN_FLAME 33
#define PIN_RELAY_POMPA 25
#define PIN_BUZZER 19

int BATAS_GAS_BAHAYA_PPM = 500;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY_POMPA, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
}

void loop() {
  int kadarGasPpm = map(analogRead(PIN_MQ2), 0, 4095, 100, 1000);
  bool bahaya = (kadarGasPpm >= BATAS_GAS_BAHAYA_PPM);
  digitalWrite(PIN_RELAY_POMPA, bahaya ? HIGH : LOW);
  Serial.printf("[SAFETY] Gas: %d PPM (Batas: %d) -> Alarm: %s\\n", kadarGasPpm, BATAS_GAS_BAHAYA_PPM, bahaya ? "AKTIF!" : "AMAN");
  delay(1000);
}`,
  },
  {
    nomor: 5,
    kategori: "PROYEK 5 • DUAL ESP32 (2 TAB KODE)",
    judul: "Dual-ESP32 Telemetry Bridge (ESP32 #1 Sensor Node ➔ UART TX/RX ➔ ESP32 #2 Gateway)",
    tabMcu: "2 Tab MCU",
    penjelasanSistem:
      "Arsitektur komunikasi dua mikrokontroler ESP32 terpisah. ESP32 #1 bertugas khusus membaca sensor di lapangan lalu mengirimkan bingkai data berformat JSON melalui jalur komunikasi serial perangkat keras (UART2 TX/RX silang) atau ESP-NOW ke ESP32 #2 yang bertugas sebagai Gateway pengirim ke server.",
    komponenUtama: [
      "ESP32 #1 (Transmitter / Akuisisi Sensor Lapangan)",
      "ESP32 #2 (Receiver / Edge Gateway Cloud)",
      "Jalur Kabel Silang UART (TX2 GPIO 17 ➔ RX2 GPIO 16)",
      "Layar OLED SSD1306 I2C Pemantau Paket",
    ],
    langkahPraktikum: [
      "Muat 'Proyek 5' dan perhatikan terdapat 2 unit papan ESP32 yang terhubung melalui kabel komunikasi TX/RX.",
      "Buka tab kode untuk melihat perbedaan program pengirim (`Serial2.println(jsonPayload)`) pada ESP32 #1 dan pembaca (`Serial2.readStringUntil('\\n')`) pada ESP32 #2.",
      "Ubah nilai sensor pada ESP32 #1 dan lihat bagaimana nilainya langsung muncul di layar OLED milik ESP32 #2.",
    ],
    caraSimulasi: [
      "Pengiriman Paket JSON: Amati animasi pulsa data mengalir dari pin TX ESP32 #1 menuju pin RX ESP32 #2.",
      "Sinkronisasi Multi-Tab: Ganti tab kode antara MCU #1 dan MCU #2 untuk mempelajari cara memisahkan beban kerja mikrokontroler.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah Kecepatan Pengiriman Paket Antar-ESP32 (Interval ms)",
      barisKodeAsli: "const int INTERVAL_KIRIM_MS = 2000; // Kirim tiap 2 detik",
      barisKodeModifikasi: "const int INTERVAL_KIRIM_MS = 500;  // Real-time cepat tiap 0.5 detik",
      penjelasanEfek:
        "Memperkecil nilai INTERVAL_KIRIM_MS membuat pembaruan data dari ESP32 #1 ke ESP32 #2 berlangsung jauh lebih cepat dan responsif.",
      parameterInteraktifLabel: "Nilai INTERVAL_KIRIM_MS di Kodingan",
      nilaiDefault: 2000,
      nilaiMin: 250,
      nilaiMax: 5000,
      satuan: "ms",
    },
    fullSketchIno: `// PROYEK 5: Dual-ESP32 UART / ESP-NOW Telemetry Bridge
#define RXD2 16
#define TXD2 17
int INTERVAL_KIRIM_MS = 2000;

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, RXD2, TXD2);
}

void loop() {
  String paketJson = "{\\"node\\":1,\\"suhu\\":29.5,\\"status\\":\\"OK\\"}";
  Serial2.println(paketJson);
  Serial.println("[TX ESP32 #1 -> #2] " + paketJson);
  delay(INTERVAL_KIRIM_MS);
}`,
  },
  {
    nomor: 6,
    kategori: "PROYEK 6 • DUAL MCU + RELAY 4CH",
    judul: "Otomasi Pabrik (ESP32 Master ↔ Arduino Uno Slave + Relay 4-Ch + Servo 360°)",
    tabMcu: "2 Tab MCU",
    penjelasanSistem:
      "Menggabungkan keunggulan konektivitas Wi-Fi ESP32 (Master) dengan ketangguhan pin 5V milik Arduino Uno (Slave) untuk mengendalikan 4 jalur mesin pabrik sekaligus (Modul Relay 4-Channel) beserta motor konveyor (Servo Continuous 360°).",
    komponenUtama: [
      "ESP32 Master Controller (Wi-Fi & HMI Command)",
      "Arduino Uno R3 Slave Controller (5V Logic I/O)",
      "Modul Relay 4-Channel (Mesin Press, Konveyor, Pendingin, Sirine)",
      "Motor Servo 360° Penggerak Lini Produksi",
    ],
    langkahPraktikum: [
      "Muat 'Proyek 6' untuk menampilkan papan ESP32 yang bersanding dengan Arduino Uno R3 dan modul Relay 4-Channel.",
      "Klik sakelar perintah pada panel kontrol untuk mengaktifkan Relay 1, Relay 2, Relay 3, atau Relay 4 secara individual maupun otomatis.",
    ],
    caraSimulasi: [
      "Mode Lini Produksi Penuh: Aktifkan ke-4 channel relay dan perhatikan keempat LED indikator merah pada modul Relay menyala berurutan.",
      "Pengaturan Kecepatan Konveyor: Ubah sinyal PWM pada motor servo untuk mengatur kecepatan putaran ban berjalan pabrik.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengatur Kecepatan Putar Konveyor Pabrik (PWM Servo)",
      barisKodeAsli: "const int SPEED_KONVEYOR_RPM = 60; // Kecepatan standar",
      barisKodeModifikasi: "const int SPEED_KONVEYOR_RPM = 120; // Kecepatan produksi tinggi",
      penjelasanEfek:
        "Mengubah nilai SPEED_KONVEYOR_RPM akan mengatur lebar pulsa PWM yang dikirim Arduino Uno ke motor penggerak konveyor.",
      parameterInteraktifLabel: "Nilai SPEED_KONVEYOR_RPM di Kodingan",
      nilaiDefault: 60,
      nilaiMin: 10,
      nilaiMax: 180,
      satuan: "RPM",
    },
    fullSketchIno: `// PROYEK 6: Otomasi Pabrik ESP32 Master + Arduino Uno Slave + Relay 4-Ch
const int RELAY_PINS[4] = {4, 5, 6, 7};
int SPEED_KONVEYOR_RPM = 60;

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 4; i++) pinMode(RELAY_PINS[i], OUTPUT);
}

void loop() {
  Serial.printf("[FACTORY PLC] 4-Ch Relay Active | Conveyor Speed: %d RPM\\n", SPEED_KONVEYOR_RPM);
  delay(1000);
}`,
  },
  {
    nomor: 7,
    kategori: "PROYEK 7 • TRIPLE MCU (3 TAB KODE!)",
    judul: "Arsitektur 3 Mikrokontroler (ESP32 #1 + ESP32 #2 + Arduino Uno #3 Terintegrasi)",
    tabMcu: "3 Tab MCU",
    penjelasanSistem:
      "Simulasi sistem terdistribusi tingkat lanjut yang melibatkan 3 papan mikrokontroler sekaligus: ESP32 #1 sebagai pembaca sensor lingkungan, Arduino Uno #3 sebagai pengendali aktuator tegangan tinggi, dan ESP32 #2 sebagai koordinator pusat yang menyatukan data keduanya ke Cloud.",
    komponenUtama: [
      "ESP32 #1 (Node Sensor Lingkungan)",
      "ESP32 #2 (Central Coordinator & Cloud Sync)",
      "Arduino Uno #3 (Hardware Actuator Driver)",
      "Bus Komunikasi Multi-Node Terintegrasi",
    ],
    langkahPraktikum: [
      "Muat 'Proyek 7' yang menampilkan 3 papan mikrokontroler sekaligus di atas kanvas.",
      "Gunakan 3 tab kode editor (MCU #1, MCU #2, MCU #3) untuk mengamati pembagian tugas masing-masing chip.",
    ],
    caraSimulasi: [
      "Uji Sinkronisasi 3 Chip: Ubah input pada ESP32 #1, amati pemrosesan logika pada ESP32 #2, dan lihat eksekusi mekanik pada Arduino Uno #3.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah ID Jaringan Klaster (Network PAN ID)",
      barisKodeAsli: "const int CLUSTER_NETWORK_ID = 101; // Klaster Lab A",
      barisKodeModifikasi: "const int CLUSTER_NETWORK_ID = 205; // Klaster Lab B",
      penjelasanEfek:
        "Ketiga mikrokontroler hanya akan saling menerima paket jika memiliki CLUSTER_NETWORK_ID yang sama pada header paket datanya.",
      parameterInteraktifLabel: "Nilai CLUSTER_NETWORK_ID di Kodingan",
      nilaiDefault: 101,
      nilaiMin: 100,
      nilaiMax: 999,
      satuan: "ID",
    },
    fullSketchIno: `// PROYEK 7: Arsitektur Triple-MCU Terintegrasi (ESP32 #1 + ESP32 #2 + Uno #3)
int CLUSTER_NETWORK_ID = 101;

void setup() {
  Serial.begin(115200);
  Serial.printf("[TRIPLE-MCU] Cluster ID #%d Initialized!\\n", CLUSTER_NETWORK_ID);
}

void loop() {
  Serial.println("[SYNC] Node #1 -> Coordinator #2 -> Actuator Uno #3 OK");
  delay(1200);
}`,
  },
  {
    nomor: 8,
    kategori: "PROYEK 8 • 10-NODE MULTI-HOP MESH & CLOUD",
    judul: "Smart Farming 10-Node Multi-Hop ESP32 (Suhu, Pupuk NPK, GPS, Baterai & Tegangan ➔ Node 10 Internet)",
    tabMcu: "10 Node Mesh",
    penjelasanSistem:
      "Jaringan Sensor Nirkabel (Wireless Sensor Network) skala perkebunan luas menggunakan 10 unit ESP32 yang disusun secara estafet (Multi-Hop Mesh: Node 1 ➔ Node 2 ➔ ... ➔ Node 10). Setiap node dipasang di blok kebun berbeda dengan titik koordinat GPS masing-masing, membaca suhu udara/tanah, kadar pupuk NPK (Nitrogen, Fosfor, Kalium), serta memantau tegangan baterai Li-Ion (Volt & %). Karena Node 1 sampai Node 9 berada jauh di tengah kebun tanpa sinyal Wi-Fi/Internet, paket data dikirim melompat dari satu node ke node berikutnya hingga mencapai Node 10 (Edge Gateway) yang terhubung ke Internet untuk ditampilkan secara live di Dashboard Web.",
    komponenUtama: [
      "10x Papan Mikrokontroler ESP32 (Protokol ESP-NOW / LoRa Multi-Hop Mesh)",
      "10x Sensor Nutrisi Tanah Pupuk NPK RS485 (Nitrogen, Fosfor, Kalium mg/kg)",
      "10x Sensor Suhu DS18B20/DHT22 + Modul GPS Satelit NEO-6M (Lat/Lng)",
      "10x Baterai Li-Ion 18650 (3.0V-4.2V) + Sensor Tegangan INA219",
      "Node 10 sebagai Edge Gateway Wi-Fi/4G Pengirim JSON ke Dashboard Web",
    ],
    langkahPraktikum: [
      "Klik tab '🛰️ Simulator 10-Node Multi-Hop (NPK, Suhu, GPS, Baterai)' di bawah ini.",
      "Klik tombol '▶ Jalankan Estafet Multi-Hop (Node 1 ➔ 10)' atau klik '⚡ Kirim Paket Uji dari Node Terpilih' untuk melihat bola paket data melompat secara berurutan dari Node 1 hingga Node 10 lalu diunggah ke Cloud Dashboard.",
      "Klik salah satu lingkaran Node (misal Node 3 atau Node 6) pada peta topologi, lalu ubah nilai Suhu, Pupuk N-P-K, Tegangan Baterai (Volt), atau koordinat GPS-nya menggunakan slider di Panel Kalibrasi Node.",
      "Uji Fitur Self-Healing Mesh: Coba matikan salah satu node di tengah (misal matikan sakelar Node 4 atau turunkan tegangannya di bawah 3.20V), lalu amati bagaimana paket dari Node 3 otomatis melompati Node 4 langsung menuju Node 5 agar pengiriman ke Node 10 tidak terputus!",
    ],
    caraSimulasi: [
      "Simulasi Estafet Normal (Hop-by-Hop): Paket dari Node 1 membawa payload {id, temp, N, P, K, volt, batt, lat, lng}, diteruskan oleh Node 2, 3, 4, 5, 6, 7, 8, 9 dengan penambahan daftar hop_path hingga diterima Node 10 dan dikirim via HTTP POST ke Dashboard Web.",
      "Simulasi Kurang Pupuk NPK: Turunkan kadar Nitrogen (< 100 mg/kg) pada salah satu node -> Tabel Dashboard Web akan langsung memberikan lencana peringatan 'PERLU PEMUPUKAN NPK!'.",
      "Simulasi Baterai Kritis & Putus Jalur: Turunkan tegangan baterai sebuah node ke < 3.30V -> Status node berubah menjadi 'LOW BATT / OFFLINE' dan rute mesh otomatis mencari jalur lompatan cadangan.",
    ],
    panduanModifikasiKode: {
      judulModifikasi: "Mengubah Batas Minimum Pupuk Nitrogen (N) & Tegangan Kritis Baterai",
      barisKodeAsli: "const int BATAS_MIN_NITROGEN = 100; // Peringatan pupuk jika N < 100 mg/kg",
      barisKodeModifikasi: "const int BATAS_MIN_NITROGEN = 140; // Standar pupuk vegetatif tinggi (140 mg/kg)",
      penjelasanEfek:
        "Jika Anda menaikkan BATAS_MIN_NITROGEN di kodingan menjadi 140 mg/kg, maka Dashboard Web dan Node 10 akan langsung menandai blok kebun yang kadar Nitrogennya di bawah 140 mg/kg agar segera diberi pupuk Urea/NPK.",
      parameterInteraktifLabel: "Nilai BATAS_MIN_NITROGEN di Kodingan",
      nilaiDefault: 100,
      nilaiMin: 50,
      nilaiMax: 200,
      satuan: "mg/kg",
    },
    fullSketchIno: `// ============================================================================
// PROYEK 8: 10-NODE MULTI-HOP ESP32 MESH (SUHU, PUPUK NPK, GPS & BATERAI)
// Node 1..9 = Sensor + Relay Router (ESP-NOW) | Node 10 = Internet Gateway
// ============================================================================
#include <WiFi.h>
#include <esp_now.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>

// ---> UBAH NOMOR NODE INI (1 S.D. 10) SAAT UPLOAD KE MASING-MASING ESP32 <---
#define MY_NODE_ID 1          // Ganti 1..9 untuk Node Kebun, dan 10 untuk Gateway Internet
#define TOTAL_NODES 10

// ---> PARAMETER KALIBRASI YANG BISA DIMODIFIKASI <---
int BATAS_MIN_NITROGEN = 100; // mg/kg (Batas peringatan kurang pupuk N)
float BATAS_BATERAI_KRITIS = 3.35; // Volt (Batas baterai lemah Li-Ion 18650)

// Struktur Paket Data Multi-Hop (Dikirim Berantai Node 1 -> ... -> Node 10)
typedef struct struct_paket_mesh {
  uint8_t originNodeId;       // Node asal pengirim data (1..10)
  uint8_t senderHopId;        // Node terakhir yang meneruskan paket
  uint8_t targetNextHopId;    // Node tujuan lompatan berikutnya
  uint8_t hopCount;           // Jumlah lompatan (Hop) yang sudah dilalui
  float suhuUdara;            // Sensor Suhu (°C)
  uint16_t npk_N;             // Pupuk Nitrogen (mg/kg)
  uint16_t npk_P;             // Pupuk Fosfor (mg/kg)
  uint16_t npk_K;             // Pupuk Kalium (mg/kg)
  float teganganVolt;         // Sensor Tegangan Baterai (3.0V - 4.2V)
  uint8_t bateraiPersen;      // Kapasitas Baterai (0% - 100%)
  double gpsLat;              // Koordinat Latitude GPS NEO-6M
  double gpsLng;              // Koordinat Longitude GPS NEO-6M
} struct_paket_mesh;

struct_paket_mesh paketDataKu;

// Fungsi Membaca Sensor Tegangan & Konversi ke Persentase Baterai 18650
void bacaSensorBateraiDanTegangan() {
  int adcBatt = analogRead(35); // Pin ADC Pembagi Tegangan / INA219
  float volt = 3.10 + (adcBatt / 4095.0) * 1.10; // Skala 3.10V - 4.20V
  int persen = constrain((int)((volt - 3.20) / (4.20 - 3.20) * 100.0), 0, 100);
  paketDataKu.teganganVolt = volt;
  paketDataKu.bateraiPersen = persen;
}

// Callback Saat Menerima Paket dari Node Sebelumnya (Estafet Multi-Hop)
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  struct_paket_mesh paketMasuk;
  memcpy(&paketMasuk, incomingData, sizeof(paketMasuk));

  if (paketMasuk.targetNextHopId == MY_NODE_ID) {
    paketMasuk.hopCount += 1;
    paketMasuk.senderHopId = MY_NODE_ID;

    if (MY_NODE_ID < 10) {
      // Node 2..9: Teruskan (Forward) paket ke Node berikutnya menuju Node 10!
      paketMasuk.targetNextHopId = MY_NODE_ID + 1;
      esp_now_send(NULL, (uint8_t *) &paketMasuk, sizeof(paketMasuk));
      Serial.printf("[MESH HOP] Meneruskan paket dari Node #%d ke Node #%d (Hop ke-%d)\\n",
                    paketMasuk.originNodeId, paketMasuk.targetNextHopId, paketMasuk.hopCount);
    } else {
      // NODE 10 (INTERNET GATEWAY): Unggah seluruh data ke Cloud Dashboard Web!
      Serial.printf("[GATEWAY NODE 10 -> INTERNET] Data Node #%d Tiba! Suhu:%.1fC | NPK:%d-%d-%d | Batt:%.2fV (%d%%) | GPS:%.5f,%.5f (Hops:%d)\\n",
                    paketMasuk.originNodeId, paketMasuk.suhuUdara,
                    paketMasuk.npk_N, paketMasuk.npk_P, paketMasuk.npk_K,
                    paketMasuk.teganganVolt, paketMasuk.bateraiPersen,
                    paketMasuk.gpsLat, paketMasuk.gpsLng, paketMasuk.hopCount);
    }
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(esp_now_recv_cb_t(OnDataRecv));
  Serial.printf("[INIT] ESP32 Multi-Hop Node #%d Aktif!\\n", MY_NODE_ID);
}

void loop() {
  bacaSensorBateraiDanTegangan();
  paketDataKu.originNodeId = MY_NODE_ID;
  paketDataKu.senderHopId = MY_NODE_ID;
  paketDataKu.targetNextHopId = (MY_NODE_ID < 10) ? (MY_NODE_ID + 1) : 10;
  paketDataKu.hopCount = 0;

  // Kirim paket ke node tetangga berikutnya
  esp_now_send(NULL, (uint8_t *) &paketDataKu, sizeof(paketDataKu));
  delay(3000);
}`,
  },
];

export const WokwiMultihop10NodeAndGuides: React.FC<{
  onTambahXp?: (xp: number) => void;
}> = ({ onTambahXp }) => {
  const [tabUtama, setTabUtama] = useState<"multihop_10" | "panduan_8_proyek">(
    "multihop_10"
  );

  // State Simulasi 10-Node Multi-Hop
  const [nodes, setNodes] = useState<Esp32MeshNodeData[]>(INITIAL_10_NODES);
  const [nodeTerpilihId, setNodeTerpilihId] = useState<number>(1);
  const [simulasiMeshBerjalan, setSimulasiMeshBerjalan] =
    useState<boolean>(true);

  // State Animasi Estafet Paket (Node Asal -> Hop Saat Ini -> Node 10 -> Cloud)
  const [nodeAsalPaket, setNodeAsalPaket] = useState<number>(1);
  const [nodeHopAktif, setNodeHopAktif] = useState<number>(1);
  const [jejakHopSaatIni, setJejakHopSaatIni] = useState<number[]>([1]);
  const [totalPaketTerkirimCloud, setTotalPaketTerkirimCloud] =
    useState<number>(142);
  const [logMeshGateway, setLogMeshGateway] = useState<string[]>([
    "[GATEWAY NODE #10] Terhubung ke Wi-Fi & Broker Cloud https://hibahilmu.my.id/api/iot/cloud",
    "[MESH ROUTING] Topologi 10-Node ESP-NOW Aktif (Node 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> Node 10 Internet)",
    "[CLOUD DASHBOARD] Menerima telemetri lengkap Suhu, NPK, Tegangan, Baterai & GPS dari 10 titik kebun.",
  ]);

  // State Panduan 8 Proyek & Eksperimen Modifikasi Kodingan
  const [proyekPanduanAktif, setProyekPanduanAktif] =
    useState<PanduanProyekWokwi>(DAFTAR_8_PANDUAN_LENGKAP_WOKWI[7]); // Default buka Proyek 8
  const [nilaiParameterModifikasi, setNilaiParameterModifikasi] =
    useState<number>(100);
  const [statusSalinKode, setStatusSalinKode] = useState<string>("");

  const nodeTerpilih =
    nodes.find((n) => n.nodeId === nodeTerpilihId) || nodes[0];

  // Cari node aktif berikutnya untuk fitur Self-Healing Mesh (melompati node yang mati/baterai habis)
  const cariNodeAktifBerikutnya = (
    dariNodeId: number,
    daftarNode: Esp32MeshNodeData[]
  ): number => {
    for (let kandidat = dariNodeId + 1; kandidat <= 10; kandidat++) {
      const target = daftarNode.find((n) => n.nodeId === kandidat);
      if (target && target.aktif && target.teganganVolt >= 3.25) {
        return kandidat;
      }
    }
    return 10; // Langsung ke Gateway Node 10 jika darurat
  };

  // Engine Animasi Perjalanan Paket Multi-Hop (Node -> Node -> Node 10 -> Internet)
  useEffect(() => {
    if (!simulasiMeshBerjalan) return;

    const timer = setInterval(() => {
      setNodeHopAktif((prevHop) => {
        if (prevHop >= 10) {
          // Paket sudah sampai di Node 10 (Gateway Internet)!
          const asalObj =
            nodes.find((n) => n.nodeId === nodeAsalPaket) || nodes[0];
          const waktu = new Date().toLocaleTimeString("id-ID", {
            hour12: false,
          });
          const ruteTeks = jejakHopSaatIni.map((id) => `N${id}`).join(" ➔ ");

          const barisLogBaru = `[${waktu}] 🌐 NODE #10 UPLOAD CLOUD | Asal: Node #${asalObj.nodeId} (${asalObj.namaBlok}) | Rute: ${ruteTeks} | Suhu: ${asalObj.suhuUdara.toFixed(1)}°C | NPK: ${asalObj.npkNitrogen}-${asalObj.npkFosfor}-${asalObj.npkKalium} mg/kg | Batt: ${asalObj.teganganVolt.toFixed(2)}V (${asalObj.bateraiPersen}%) | GPS: ${asalObj.gpsLat.toFixed(5)}, ${asalObj.gpsLng.toFixed(5)}`;

          setLogMeshGateway((prevLogs) => [
            barisLogBaru,
            ...prevLogs.slice(0, 14),
          ]);
          setTotalPaketTerkirimCloud((c) => c + 1);

          // Pilih node asal berikutnya secara bergiliran (1 s.d. 9)
          const nextOrigin = (nodeAsalPaket % 9) + 1;
          const nodeOriginValid = nodes.find(
            (n) =>
              n.nodeId === nextOrigin && n.aktif && n.teganganVolt >= 3.25
          )
            ? nextOrigin
            : 1;

          setNodeAsalPaket(nodeOriginValid);
          setJejakHopSaatIni([nodeOriginValid]);
          return nodeOriginValid;
        } else {
          // Lompat ke node aktif berikutnya (Multi-Hop)
          const nextHop = cariNodeAktifBerikutnya(prevHop, nodes);
          setJejakHopSaatIni((prevJejak) =>
            prevJejak.includes(nextHop) ? prevJejak : [...prevJejak, nextHop]
          );
          return nextHop;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, [simulasiMeshBerjalan, nodes, nodeAsalPaket, jejakHopSaatIni]);

  // Fungsi mengubah data sensor pada node tertentu secara live
  const updateSensorNode = (
    nodeId: number,
    perubahan: Partial<Esp32MeshNodeData>
  ) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.nodeId !== nodeId) return n;
        const updated = { ...n, ...perubahan };
        if (perubahan.teganganVolt !== undefined) {
          updated.bateraiPersen = Math.min(
            100,
            Math.max(
              0,
              Math.round(((perubahan.teganganVolt - 3.2) / (4.2 - 3.2)) * 100)
            )
          );
        }
        return updated;
      })
    );
  };

  // Fungsi memicu pengiriman paket instan dari node yang sedang dipilih
  const kirimPaketUjiDariNodeIni = (idAsal: number) => {
    setNodeAsalPaket(idAsal);
    setNodeHopAktif(idAsal);
    setJejakHopSaatIni([idAsal]);
    setSimulasiMeshBerjalan(true);
    if (onTambahXp) onTambahXp(15);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* =================================================================== */}
      {/* HEADER NAVIGASI MODUL EKSTENSI WOKWI (PROYEK 8 & PANDUAN 8 PROYEK)  */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                🚀 FITUR BARU STUDIO WOKWI HIBAHILMU
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-[10px]">
                PROYEK 8 (10-NODE MULTI-HOP MESH) + PANDUAN PRAKTIKUM &amp; BEDAH KODE 8 PROYEK
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Pusat Simulasi Jaringan 10-Node ESP32 Multi-Hop &amp; Modul Panduan Eksperimen Lengkap
            </h2>
            <p className="text-xs text-slate-300">
              Mensimulasikan pengiriman estafet sensor <strong>Suhu, Pupuk NPK, Tegangan, Baterai &amp; Koordinat GPS</strong> dari <strong>Node 1 ➔ ... ➔ Node 10 (Gateway Internet)</strong> sekaligus panduan langkah demi langkah dan cara memodifikasi kodingan C++ untuk semua proyek.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTabUtama("multihop_10")}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition ${
                tabUtama === "multihop_10"
                  ? "bg-amber-400 text-slate-950 shadow-lg scale-[1.02]"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <Globe className="w-4 h-4" /> 1. Proyek 8: Simulator 10-Node Multi-Hop &amp; Dashboard Web
            </button>

            <button
              type="button"
              onClick={() => setTabUtama("panduan_8_proyek")}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition ${
                tabUtama === "panduan_8_proyek"
                  ? "bg-emerald-500 text-slate-950 shadow-lg scale-[1.02]"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <BookOpen className="w-4 h-4" /> 2. Panduan Lengkap, Cara Simulasi &amp; Modifikasi Kode (Semua 8 Proyek)
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: SIMULATOR PROYEK 8 — 10-NODE MULTI-HOP ESP32 & DASHBOARD WEB */}
      {/* =================================================================== */}
      {tabUtama === "multihop_10" && (
        <div className="space-y-6">
          {/* BARIS KONTROL SIMULASI ESTAFET MULTI-HOP */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border-2 border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  PROYEK 8 • WIRELESS SENSOR NETWORK (ESP-NOW / LORA MULTI-HOP MESH)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-300 mt-1">
                  Topologi Estafet 10-Node ESP32 (Node 1 ➔ Node 2 ➔ ... ➔ Node 10 Internet Gateway)
                </h3>
                <p className="text-xs text-slate-300">
                  Klik salah satu Node di bawah untuk mengubah nilai <strong>Suhu, Pupuk NPK, Tegangan Baterai, atau GPS</strong>, lalu amati paket datanya melompat hingga ke <strong>Node 10</strong> dan tampil di <strong>Dashboard Web</strong>!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSimulasiMeshBerjalan(!simulasiMeshBerjalan)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow ${
                    simulasiMeshBerjalan
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {simulasiMeshBerjalan ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" /> RUNNING (Hentikan Estafet)
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> JALANKAN ESTAFET MULTI-HOP
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNodes(INITIAL_10_NODES);
                    setJejakHopSaatIni([1]);
                    setNodeAsalPaket(1);
                    setNodeHopAktif(1);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset 10 Node
                </button>
              </div>
            </div>

            {/* BANNER STATUS PERJALANAN PAKET DATA SAAT INI */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black">
                  📡 PAKET SEDANG MELOMPAT:
                </span>
                <span className="font-bold text-white">
                  Asal Paket: <strong className="text-emerald-400">Node #{nodeAsalPaket}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-bold text-white">
                  Posisi Hop Sekarang:{" "}
                  <strong className="text-amber-300">
                    {nodeHopAktif === 10
                      ? "Node #10 (Mengunggah ke Cloud Internet 🌐)"
                      : `Node #${nodeHopAktif}`}
                  </strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-[11px] text-sky-300">
                  Jejak Hop: {jejakHopSaatIni.map((id) => `Node ${id}`).join(" ➔ ")}{" "}
                  {nodeHopAktif === 10 ? "➔ ☁️ INTERNET DASHBOARD" : ""}
                </span>
              </div>

              <div className="text-xs font-black text-emerald-400">
                Total Paket Tiba di Cloud: {totalPaketTerkirimCloud} Paket
              </div>
            </div>

            {/* VISUALISASI INTERAKTIF 10 NODE MULTI-HOP (2 BARIS X 5 NODE + JALUR LOMPATAN) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {nodes.map((node) => {
                const sedangegangPaket = nodeHopAktif === node.nodeId;
                const pernahDilalui = jejakHopSaatIni.includes(node.nodeId);
                const sedangDiedit = nodeTerpilihId === node.nodeId;
                const bateraiKritis = node.teganganVolt < 3.35 || !node.aktif;
                const pupukKurang =
                  node.npkNitrogen < nilaiParameterModifikasi;

                return (
                  <div
                    key={node.nodeId}
                    onClick={() => setNodeTerpilihId(node.nodeId)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between gap-2 ${
                      sedangegangPaket
                        ? "bg-gradient-to-br from-emerald-900/80 to-teal-950 border-amber-400 ring-4 ring-amber-400/30 scale-[1.03]"
                        : sedangDiedit
                        ? "bg-slate-900 border-sky-400 shadow-lg"
                        : bateraiKritis
                        ? "bg-rose-950/40 border-rose-600/70 opacity-75"
                        : pernahDilalui
                        ? "bg-slate-950 border-emerald-500/70"
                        : "bg-slate-950 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    {/* Header Kartu Node */}
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              node.nodeId === 10
                                ? "bg-amber-400 text-slate-950"
                                : sedangegangPaket
                                ? "bg-emerald-400 text-slate-950"
                                : "bg-slate-800 text-white"
                            }`}
                          >
                            {node.nodeId === 10
                              ? "🌐 NODE 10 (GATEWAY)"
                              : `NODE #${node.nodeId}`}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">
                          {node.namaBlok}
                        </div>
                      </div>

                      {sedangegangPaket && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] animate-pulse">
                          📦 TX HOP
                        </span>
                      )}
                    </div>

                    {/* Ringkasan 4 Sensor di Dalam Node */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-1 text-rose-300 font-bold">
                        <Thermometer className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{node.suhuUdara.toFixed(1)}°C</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 font-bold ${
                          bateraiKritis ? "text-rose-400" : "text-emerald-300"
                        }`}
                      >
                        <BatteryCharging className="w-3 h-3 shrink-0" />
                        <span>
                          {node.teganganVolt.toFixed(2)}V ({node.bateraiPersen}%)
                        </span>
                      </div>

                      <div
                        className={`col-span-2 flex items-center gap-1 font-bold ${
                          pupukKurang ? "text-amber-300" : "text-sky-300"
                        }`}
                      >
                        <Sprout className="w-3 h-3 shrink-0" />
                        <span>
                          NPK: {node.npkNitrogen}-{node.npkFosfor}-
                          {node.npkKalium}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center gap-1 text-slate-400 font-mono text-[9px] truncate">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>
                          {node.gpsLat.toFixed(4)}, {node.gpsLng.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {/* Footer Status Hop */}
                    <div className="flex justify-between items-center text-[9.5px] font-bold pt-1 border-t border-slate-800">
                      <span
                        className={
                          bateraiKritis ? "text-rose-400" : "text-emerald-400"
                        }
                      >
                        {bateraiKritis
                          ? "⚠️ OFFLINE (DILEWATI)"
                          : node.nodeId === 10
                          ? "☁️ UPLOAD KE INTERNET"
                          : `➔ Hop ke Node #${cariNodeAktifBerikutnya(
                              node.nodeId,
                              nodes
                            )}`}
                      </span>
                      <span className="text-slate-500">{node.rssiDbm} dBm</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PANEL KALIBRASI & INJEKSI SENSOR PER NODE + PETA KOORDINAT GPS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              {/* Kiri: Editor Sensor untuk Node Terpilih */}
              <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border-2 border-sky-500/50 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500 text-slate-950">
                      🎛️ PANEL KALIBRASI SENSOR NODE #{nodeTerpilih.nodeId}
                    </span>
                    <h4 className="text-base font-black text-white mt-1">
                      Node #{nodeTerpilih.nodeId} — {nodeTerpilih.namaBlok} (
                      {nodeTerpilih.peran})
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateSensorNode(nodeTerpilih.nodeId, {
                          aktif: !nodeTerpilih.aktif,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        nodeTerpilih.aktif
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {nodeTerpilih.aktif
                        ? "✓ Daya Node: ON"
                        : "✕ Daya Node: MATI (Uji Self-Healing)"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        kirimPaketUjiDariNodeIni(nodeTerpilih.nodeId)
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      ⚡ Kirim Paket dari Node #{nodeTerpilih.nodeId}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Slider Suhu */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">
                        🌡️ Sensor Suhu Tanah/Udara:
                      </span>
                      <span className="text-rose-400 font-black">
                        {nodeTerpilih.suhuUdara.toFixed(1)} °C
                      </span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={45}
                      step={0.1}
                      value={nodeTerpilih.suhuUdara}
                      onChange={(e) =>
                        updateSensorNode(nodeTerpilih.nodeId, {
                          suhuUdara: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Slider Tegangan Baterai */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">
                        🔋 Tegangan Baterai Li-Ion:
                      </span>
                      <span
                        className={`font-black ${
                          nodeTerpilih.teganganVolt < 3.35
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {nodeTerpilih.teganganVolt.toFixed(2)} V (
                        {nodeTerpilih.bateraiPersen}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3.0}
                      max={4.2}
                      step={0.02}
                      value={nodeTerpilih.teganganVolt}
                      onChange={(e) =>
                        updateSensorNode(nodeTerpilih.nodeId, {
                          teganganVolt: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Slider Pupuk Nitrogen (N) */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">
                        🌱 Pupuk Nitrogen (N):
                      </span>
                      <span className="text-sky-400 font-black">
                        {nodeTerpilih.npkNitrogen} mg/kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={300}
                      value={nodeTerpilih.npkNitrogen}
                      onChange={(e) =>
                        updateSensorNode(nodeTerpilih.nodeId, {
                          npkNitrogen: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Slider Pupuk Fosfor (P) & Kalium (K) */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">
                        🌿 Pupuk Fosfor (P) &amp; Kalium (K):
                      </span>
                      <span className="text-amber-300 font-black">
                        P:{nodeTerpilih.npkFosfor} | K:{nodeTerpilih.npkKalium}{" "}
                        mg/kg
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min={10}
                        max={150}
                        value={nodeTerpilih.npkFosfor}
                        onChange={(e) =>
                          updateSensorNode(nodeTerpilih.nodeId, {
                            npkFosfor: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-1/2"
                      />
                      <input
                        type="range"
                        min={50}
                        max={300}
                        value={nodeTerpilih.npkKalium}
                        onChange={(e) =>
                          updateSensorNode(nodeTerpilih.nodeId, {
                            npkKalium: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-1/2"
                      />
                    </div>
                  </div>

                  {/* Input Koordinat GPS Latitude & Longitude */}
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-purple-300 block">
                        📍 GPS Latitude (NEO-6M):
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={nodeTerpilih.gpsLat}
                        onChange={(e) =>
                          updateSensorNode(nodeTerpilih.nodeId, {
                            gpsLat: parseFloat(e.target.value) || 1.668,
                          })
                        }
                        className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-purple-300 block">
                        📍 GPS Longitude (NEO-6M):
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={nodeTerpilih.gpsLng}
                        onChange={(e) =>
                          updateSensorNode(nodeTerpilih.nodeId, {
                            gpsLng: parseFloat(e.target.value) || 101.445,
                          })
                        }
                        className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kanan: Peta Radar GPS Kebun & Log Gateway Node 10 */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-black uppercase text-emerald-400 flex items-center justify-between">
                    <span>🗺️ Peta Sebaran GPS 10 Node &amp; Rute Multi-Hop</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Dumai / Riau Agri-Polygon
                    </span>
                  </div>

                  {/* SVG Visualisasi Rute Hop dari Node 1 -> 10 */}
                  <div className="mt-2 bg-slate-900 rounded-2xl border border-slate-800 p-2">
                    <svg viewBox="0 0 360 155" className="w-full h-36">
                      {/* Garis Grid Peta */}
                      {[30, 75, 120].map((y) => (
                        <line
                          key={y}
                          x1={0}
                          y1={y}
                          x2={360}
                          y2={y}
                          stroke="#1e293b"
                          strokeDasharray="3 3"
                        />
                      ))}

                      {/* Garis Penghubung Rute Multi-Hop */}
                      {nodes.map((n, idx) => {
                        if (idx === nodes.length - 1) return null;
                        const x1 = 28 + (idx % 5) * 72;
                        const y1 = idx < 5 ? 42 : 112;
                        const nextId = cariNodeAktifBerikutnya(n.nodeId, nodes);
                        const nextIdx = nextId - 1;
                        const x2 = 28 + (nextIdx % 5) * 72;
                        const y2 = nextIdx < 5 ? 42 : 112;
                        const aktifJalur =
                          jejakHopSaatIni.includes(n.nodeId) &&
                          jejakHopSaatIni.includes(nextId);

                        return (
                          <line
                            key={n.nodeId}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={aktifJalur ? "#facc15" : "#334155"}
                            strokeWidth={aktifJalur ? 3 : 1.5}
                          />
                        );
                      })}

                      {/* Titik Koordinat 10 Node */}
                      {nodes.map((n, idx) => {
                        const cx = 28 + (idx % 5) * 72;
                        const cy = idx < 5 ? 42 : 112;
                        const isHop = nodeHopAktif === n.nodeId;
                        const mati = !n.aktif || n.teganganVolt < 3.25;
                        return (
                          <g
                            key={n.nodeId}
                            onClick={() => setNodeTerpilihId(n.nodeId)}
                            className="cursor-pointer"
                          >
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHop ? 15 : 11}
                              fill={
                                mati
                                  ? "#e11d48"
                                  : n.nodeId === 10
                                  ? "#facc15"
                                  : isHop
                                  ? "#10b981"
                                  : "#0284c7"
                              }
                              stroke="#ffffff"
                              strokeWidth={
                                nodeTerpilihId === n.nodeId ? 2.5 : 1
                              }
                            />
                            <text
                              x={cx}
                              y={cy + 3.5}
                              textAnchor="middle"
                              fill={n.nodeId === 10 ? "#0f172a" : "#ffffff"}
                              fontSize="9"
                              fontWeight="bold"
                            >
                              N{n.nodeId}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Terminal Log Node 10 Internet Gateway */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-black text-amber-300">
                    📟 Live Serial &amp; HTTP Cloud Log pada Node #10 (Gateway):
                  </div>
                  <div className="bg-black/90 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 space-y-1 max-h-32 overflow-y-auto">
                    {logMeshGateway.map((l, i) => (
                      <div key={i} className="leading-snug">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* DASHBOARD WEB MONITORING REAL-TIME KE-10 NODE (TABEL LENGKAP)   */}
          {/* =============================================================== */}
          <div className="bg-white text-slate-900 p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  🌐 DASHBOARD WEB CLOUD REAL-TIME (DITERIMA DARI NODE 10 GATEWAY)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Tabel Telemetri 10-Node ESP32: Suhu, Pupuk NPK, Baterai, Tegangan &amp; Titik GPS
                </h3>
              </div>
              <div className="text-xs font-bold text-slate-600">
                Batas Minimum Nitrogen (Kode C++):{" "}
                <strong className="text-rose-600">
                  {nilaiParameterModifikasi} mg/kg
                </strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 rounded-tl-xl">Node ID</th>
                    <th className="p-3">Lokasi Blok Kebun</th>
                    <th className="p-3">Rute Estafet (Next Hop)</th>
                    <th className="p-3">Suhu (°C)</th>
                    <th className="p-3">Pupuk NPK (mg/kg)</th>
                    <th className="p-3">Tegangan &amp; Baterai</th>
                    <th className="p-3">Koordinat GPS (Lat, Lng)</th>
                    <th className="p-3 rounded-tr-xl">Status Rekomendasi AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold">
                  {nodes.map((n) => {
                    const battLemah = n.teganganVolt < 3.35 || !n.aktif;
                    const kurangPupuk =
                      n.npkNitrogen < nilaiParameterModifikasi;
                    return (
                      <tr
                        key={n.nodeId}
                        onClick={() => setNodeTerpilihId(n.nodeId)}
                        className={`cursor-pointer transition ${
                          nodeHopAktif === n.nodeId
                            ? "bg-emerald-50 font-black"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-black text-[11px] ${
                              n.nodeId === 10
                                ? "bg-amber-400 text-slate-950"
                                : "bg-slate-900 text-white"
                            }`}
                          >
                            Node #{n.nodeId}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800">{n.namaBlok}</td>
                        <td className="p-3 font-mono text-[11px] text-indigo-700">
                          {n.nodeId === 10
                            ? "☁️ Direct HTTP POST ke Web"
                            : `Node #${n.nodeId} ➔ Node #${cariNodeAktifBerikutnya(
                                n.nodeId,
                                nodes
                              )} ➔ ... ➔ #10`}
                        </td>
                        <td className="p-3 text-rose-700 font-black">
                          {n.suhuUdara.toFixed(1)} °C
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-mono">
                            N:{n.npkNitrogen} | P:{n.npkFosfor} | K:
                            {n.npkKalium}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black ${
                              battLemah
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-900"
                            }`}
                          >
                            ⚡ {n.teganganVolt.toFixed(2)}V ({n.bateraiPersen}%)
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">
                          {n.gpsLat.toFixed(5)}, {n.gpsLng.toFixed(5)}
                        </td>
                        <td className="p-3">
                          {battLemah ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black">
                              🔋 GANTI BATERAI / OFFLINE
                            </span>
                          ) : kurangPupuk ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                              ⚠️ TAMBAH PUPUK NPK (N &lt;{" "}
                              {nilaiParameterModifikasi})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                              ✓ NUTRISI &amp; DAYA OPTIMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: PANDUAN LENGKAP, SIMULASI & MODIFIKASI KODE SEMUA 8 PROYEK   */}
      {/* =================================================================== */}
      {tabUtama === "panduan_8_proyek" && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/50 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              📚 MODUL PRAKTIKUM INTERAKTIF (PROYEK 1 S.D. PROYEK 8)
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Pilih Proyek untuk Melihat Penjelasan, Langkah Simulasi, &amp; Cara Modifikasi Kodingannya
            </h3>
          </div>

          {/* Daftar Tombol Pilihan 8 Proyek */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DAFTAR_8_PANDUAN_LENGKAP_WOKWI.map((p) => {
              const aktif = proyekPanduanAktif.nomor === p.nomor;
              return (
                <button
                  key={p.nomor}
                  type="button"
                  onClick={() => {
                    setProyekPanduanAktif(p);
                    setNilaiParameterModifikasi(
                      p.panduanModifikasiKode.nilaiDefault
                    );
                  }}
                  className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition flex flex-col justify-between gap-2 ${
                    aktif
                      ? "bg-gradient-to-br from-emerald-900 to-slate-900 border-amber-400 shadow-lg scale-[1.02]"
                      : "bg-slate-950 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9.5px]">
                        {p.kategori}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {p.tabMcu}
                      </span>
                    </div>
                    <div className="font-black text-xs text-white mt-2 leading-snug">
                      {p.judul}
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold pt-1 border-t border-slate-800">
                    📖 Buka Penjelasan &amp; Bedah Kode ➔
                  </div>
                </button>
              );
            })}
          </div>

          {/* Isi Detail Panduan Proyek Terpilih */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                  {proyekPanduanAktif.kategori}
                </span>
                <h4 className="text-xl font-black text-white mt-2">
                  {proyekPanduanAktif.judul}
                </h4>
              </div>
              {proyekPanduanAktif.nomor === 8 && (
                <button
                  type="button"
                  onClick={() => setTabUtama("multihop_10")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                >
                  🚀 Buka Simulator 10-Node Sekarang
                </button>
              )}
            </div>

            {/* 1. Penjelasan Sistem & Komponen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-black uppercase text-amber-300">
                  1. 📖 Penjelasan Cara Kerja Rangkaian &amp; Arsitektur:
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {proyekPanduanAktif.penjelasanSistem}
                </p>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-black uppercase text-emerald-400">
                  🔩 Daftar Komponen Perangkat Keras:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {proyekPanduanAktif.komponenUtama.map((k, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Harus Ngapain Saja (Langkah Praktikum) & 3. Cara Mensimulasikan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5">
                <div className="text-xs font-black uppercase text-indigo-300">
                  2. 🛠️ Harus Ngapain Saja? (Langkah-Langkah Praktikum):
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-200 leading-relaxed">
                  {proyekPanduanAktif.langkahPraktikum.map((l, i) => (
                    <li key={i} className="font-medium">
                      {l}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5">
                <div className="text-xs font-black uppercase text-emerald-300">
                  3. ▶️ Bagaimana Cara Mensimulasikan &amp; Mengujinya?:
                </div>
                <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
                  {proyekPanduanAktif.caraSimulasi.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Jika Perlu Ganti Kodingannya Lalu Gimana? (Simulator Modifikasi Kode Live) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400/60 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                    4. 💻 EKSPERIMEN GANTI KODINGAN C++ (APA YANG BERUBAH?)
                  </span>
                  <h5 className="text-base font-black text-white mt-1">
                    {proyekPanduanAktif.panduanModifikasiKode.judulModifikasi}
                  </h5>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50">
                  <div className="text-[10px] font-bold text-rose-300 mb-1">
                    ❌ Baris Kode Standar (Sebelum Diganti):
                  </div>
                  <code className="text-white">
                    {proyekPanduanAktif.panduanModifikasiKode.barisKodeAsli}
                  </code>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50">
                  <div className="text-[10px] font-bold text-emerald-300 mb-1">
                    ✅ Baris Kode Hasil Modifikasimu Sekarang:
                  </div>
                  <code className="text-amber-300 font-bold">
                    {proyekPanduanAktif.panduanModifikasiKode.barisKodeModifikasi.replace(
                      /\d+(\.\d+)?/,
                      String(nilaiParameterModifikasi)
                    )}
                  </code>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>💡 Dampak Perubahan Kodingan:</strong>{" "}
                {proyekPanduanAktif.panduanModifikasiKode.penjelasanEfek}
              </p>

              {/* Slider Interaktif Pengubah Angka di Kodingan */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-amber-300">
                    🎚️ Uji Ganti{" "}
                    {
                      proyekPanduanAktif.panduanModifikasiKode
                        .parameterInteraktifLabel
                    }
                    :
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950">
                    {nilaiParameterModifikasi}{" "}
                    {proyekPanduanAktif.panduanModifikasiKode.satuan}
                  </span>
                </div>
                <input
                  type="range"
                  min={proyekPanduanAktif.panduanModifikasiKode.nilaiMin}
                  max={proyekPanduanAktif.panduanModifikasiKode.nilaiMax}
                  value={nilaiParameterModifikasi}
                  onChange={(e) =>
                    setNilaiParameterModifikasi(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Kode Lengkap sketch.ino yang Siap Disalin */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    📄 Kode Lengkap C++ (sketch.ino) — Siap Dipaste ke Editor Wokwi:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        proyekPanduanAktif.fullSketchIno
                      );
                      setStatusSalinKode("Kode C++ berhasil disalin! ✓");
                      setTimeout(() => setStatusSalinKode(""), 2500);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />{" "}
                    {statusSalinKode || "Salin Kode C++ Ini"}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-black/95 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {proyekPanduanAktif.fullSketchIno}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};