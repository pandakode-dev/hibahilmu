// app/components/simulator/simulatorData.ts

export type KategoriSimulatorId =
  | "python"
  | "c_cpp"
  | "nextjs"
  | "matlab"
  | "wokwi"
  | "ewb";

export interface LibrarySimulatorItem {
  id: string;
  nama: string;
  versi: string;
  perintahImport: string;
  deskripsi: string;
  terpasangDefault: boolean;
}

export interface ModulSimulatorItem {
  id: string;
  kategoriId: KategoriSimulatorId;
  judulModul: string;
  level: "Pemula" | "Menengah" | "Mahir";
  durasi: string;
  pengajar: string;
  ringkasanTeori: string;
  langkahPraktikum: string[];
  kodeAwal: string;
  outputEkspektasi: string;
  tantanganLatihan: string;
  xpReward: number;
  dataPlotAwal?: number[]; // Khusus MATLAB / Python Matplotlib
}

export interface SpesifikasiEngineSimulator {
  id: KategoriSimulatorId;
  nama: string;
  tagline: string;
  versiEngine: string;
  warnaGradien: string;
  badgeWarna: string;
  ekstensiFile: string;
  perintahJalankan: string;
  daftarLibrary: LibrarySimulatorItem[];
}

export const DAFTAR_ENGINE_SIMULATOR: SpesifikasiEngineSimulator[] = [
  {
    id: "python",
    nama: "Python 3.12 & Data Science",
    tagline: "AI, Machine Learning, Big Data & Algoritma",
    versiEngine: "Python 3.12.4 (Pyodide / SciPy Stack)",
    warnaGradien: "from-sky-600 to-indigo-700",
    badgeWarna: "bg-sky-100 text-sky-900 border-sky-300",
    ekstensiFile: "main.py",
    perintahJalankan: "python3 main.py",
    daftarLibrary: [
      {
        id: "py-numpy",
        nama: "NumPy",
        versi: "2.1.0",
        perintahImport: "import numpy as np",
        deskripsi: "Komputasi matriks, aljabar linear, dan array multidimensi.",
        terpasangDefault: true,
      },
      {
        id: "py-pandas",
        nama: "Pandas",
        versi: "2.2.2",
        perintahImport: "import pandas as pd",
        deskripsi: "Manipulasi dataset tabel, analisis deret waktu, dan Big Data.",
        terpasangDefault: true,
      },
      {
        id: "py-matplotlib",
        nama: "Matplotlib",
        versi: "3.9.0",
        perintahImport: "import matplotlib.pyplot as plt",
        deskripsi: "Visualisasi grafik 2D, plot sinyal, dan distribusi statistik.",
        terpasangDefault: true,
      },
      {
        id: "py-rl",
        nama: "Gymnasium / RL",
        versi: "1.0.0",
        perintahImport: "import gymnasium as gym",
        deskripsi: "Simulasi lingkungan Reinforcement Learning & Q-Learning.",
        terpasangDefault: true,
      },
    ],
  },
  {
    id: "c_cpp",
    nama: "Bahasa C / C++ (GCC)",
    tagline: "Pemrograman Sistem, Pointer, Struktur Data & Embedded",
    versiEngine: "GCC 13.2.0 (ISO C17 / C++20)",
    warnaGradien: "from-blue-700 to-slate-900",
    badgeWarna: "bg-blue-100 text-blue-900 border-blue-300",
    ekstensiFile: "program.c",
    perintahJalankan: "gcc program.c -o program && ./program",
    daftarLibrary: [
      {
        id: "c-stdio",
        nama: "stdio.h",
        versi: "glibc 2.39",
        perintahImport: "#include <stdio.h>",
        deskripsi: "Standar input/output (printf, scanf, fopen).",
        terpasangDefault: true,
      },
      {
        id: "c-stdlib",
        nama: "stdlib.h",
        versi: "glibc 2.39",
        perintahImport: "#include <stdlib.h>",
        deskripsi: "Alokasi memori dinamis (malloc, free) dan utilitas umum.",
        terpasangDefault: true,
      },
      {
        id: "c-math",
        nama: "math.h",
        versi: "glibc 2.39",
        perintahImport: "#include <math.h>",
        deskripsi: "Fungsi trigonometri, logaritma, dan pangkat matematika.",
        terpasangDefault: true,
      },
    ],
  },
  {
    id: "nextjs",
    nama: "Next.js 16, React & TypeScript",
    tagline: "Full-Stack Web App, Tailwind CSS & Component Preview",
    versiEngine: "Next.js 16.4 (Turbopack) + React 19",
    warnaGradien: "from-slate-900 via-indigo-950 to-emerald-900",
    badgeWarna: "bg-slate-200 text-slate-900 border-slate-400",
    ekstensiFile: "page.tsx",
    perintahJalankan: "npm run dev (Live Component Preview)",
    daftarLibrary: [
      {
        id: "nx-lucide",
        nama: "lucide-react",
        versi: "0.460.0",
        perintahImport: 'import { Sparkles } from "lucide-react";',
        deskripsi: "Koleksi ikon vektor modern untuk antarmuka React.",
        terpasangDefault: true,
      },
      {
        id: "nx-framer",
        nama: "framer-motion",
        versi: "11.11.0",
        perintahImport: 'import { motion } from "framer-motion";',
        deskripsi: "Animasi mikro dan transisi interaktif komponen UI.",
        terpasangDefault: true,
      },
      {
        id: "nx-tailwind",
        nama: "Tailwind CSS",
        versi: "4.0.0",
        perintahImport: "// Utility-first CSS aktif otomatis",
        deskripsi: "Styling responsif instan dengan kelas utilitas.",
        terpasangDefault: true,
      },
    ],
  },
  {
    id: "matlab",
    nama: "MATLAB & Simulink Lab",
    tagline: "Komputasi Numerik, Pengolahan Sinyal (DSP) & Sistem Kontrol",
    versiEngine: "MATLAB R2026a / GNU Octave Scientific Engine",
    warnaGradien: "from-orange-600 to-rose-700",
    badgeWarna: "bg-orange-100 text-orange-950 border-orange-300",
    ekstensiFile: "simulasi_dsp.m",
    perintahJalankan: "matlab -batch simulasi_dsp",
    daftarLibrary: [
      {
        id: "mt-signal",
        nama: "Signal Processing Toolbox",
        versi: "2026.1",
        perintahImport: "pkg load signal;",
        deskripsi: "Analisis FFT, desain filter FIR/IIR, dan modulasi sinyal.",
        terpasangDefault: true,
      },
      {
        id: "mt-control",
        nama: "Control System Toolbox",
        versi: "2026.1",
        perintahImport: "pkg load control;",
        deskripsi: "Fungsi alih (Transfer Function), kendali PID, dan Bode Plot.",
        terpasangDefault: true,
      },
    ],
  },
  {
    id: "wokwi",
    nama: "Wokwi IoT & Microcontroller",
    tagline: "Simulator ESP32, Arduino Uno, Sensor DHT22, Servo & WiFi",
    versiEngine: "Wokwi AVR/Xtensa ESP32 Virtual Board",
    warnaGradien: "from-emerald-600 to-teal-800",
    badgeWarna: "bg-emerald-100 text-emerald-950 border-emerald-300",
    ekstensiFile: "sketch.ino",
    perintahJalankan: "wokwi-cli compile && simulate",
    daftarLibrary: [
      {
        id: "wk-wifi",
        nama: "WiFi.h (ESP32)",
        versi: "3.0.4",
        perintahImport: "#include <WiFi.h>",
        deskripsi: "Konektivitas jaringan WiFi dan pengiriman telemetri MQTT/HTTP.",
        terpasangDefault: true,
      },
      {
        id: "wk-dht",
        nama: "DHT sensor library",
        versi: "1.4.6",
        perintahImport: "#include <DHT.h>",
        deskripsi: "Pembacaan sensor suhu dan kelembapan udara digital DHT22/DHT11.",
        terpasangDefault: true,
      },
      {
        id: "wk-servo",
        nama: "ESP32Servo",
        versi: "3.0.5",
        perintahImport: "#include <ESP32Servo.h>",
        deskripsi: "Pengendalian sudut aktuator motor servo PWM.",
        terpasangDefault: true,
      },
    ],
  },
  {
    id: "ewb",
    nama: "EWB (Electronics Workbench) & Digital Logic",
    tagline: "Rangkaian Listrik RLC, Osiloskop, Hukum Ohm & Gerbang Logika",
    versiEngine: "SPICE 3f5 & Digital Logic Gate Simulator",
    warnaGradien: "from-purple-700 to-indigo-900",
    badgeWarna: "bg-purple-100 text-purple-950 border-purple-300",
    ekstensiFile: "rangkaian.cir",
    perintahJalankan: "ngspice -b rangkaian.cir",
    daftarLibrary: [
      {
        id: "ewb-74xx",
        nama: "Seri IC TTL 74LSxx",
        versi: "Standar IEEE",
        perintahImport: ".include 74ls_logic.lib",
        deskripsi: "IC Gerbang Logika Digital (7408 AND, 7432 OR, 7400 NAND, 7486 XOR).",
        terpasangDefault: true,
      },
      {
        id: "ewb-opamp",
        nama: "Analog Op-Amp LM741 & RLC",
        versi: "SPICE Model",
        perintahImport: ".model LM741 OPAMP",
        deskripsi: "Komponen penguat operasional, resistor, kapasitor, dan induktor.",
        terpasangDefault: true,
      },
    ],
  },
];

export const MODUL_PEMBELAJARAN_SIMULATOR_AWAL: ModulSimulatorItem[] = [
  // 1. PYTHON
  {
    id: "sim-py-1",
    kategoriId: "python",
    judulModul: "Modul 1: Algoritma Q-Learning (Reinforcement Learning) & Analisis NumPy",
    level: "Menengah",
    durasi: "25 Menit",
    pengajar: "Bapak Budi Santoso, M.Pd & Tim AI",
    ringkasanTeori:
      "Python merupakan bahasa utama dalam kecerdasan buatan dan Big Data. Pada modul ini, Anda akan mensimulasikan pembaruan tabel Q-Value Q(s,a) menggunakan persamaan Bellman serta menghitung statistik matriks dengan NumPy.",
    langkahPraktikum: [
      "Perhatikan inisialisasi parameter Learning Rate (alpha = 0.1) dan Discount Factor (gamma = 0.9).",
      "Klik tombol 'Jalankan Kode (Run)' untuk mengeksekusi perhitungan pembaruan Q-Value.",
      "Ubah nilai reward r menjadi 100 dan amati perubahan nilai Q(s,a) pada terminal output.",
    ],
    kodeAwal: `import numpy as np

# Parameter Q-Learning (Reinforcement Learning)
alpha = 0.1   # Learning Rate
gamma = 0.9   # Discount Factor
q_sa = 50.0   # Nilai Q(s,a) saat ini
reward = 85.0 # Reward instan (r)
max_q_next = 90.0

# Persamaan Pembaruan Bellman
q_baru = q_sa + alpha * (reward + gamma * max_q_next - q_sa)

print("=== HASIL SIMULASI PYTHON & Q-LEARNING ===")
print(f"Nilai Q(s,a) Sebelumnya : {q_sa}")
print(f"Reward Instan (r)       : {reward}")
print(f"Nilai Q(s,a) Terbaru    : {q_baru:.2f}")
print("Status Agen             : Konvergen Optimal!")`,
    outputEkspektasi: `=== HASIL SIMULASI PYTHON & Q-LEARNING ===
Nilai Q(s,a) Sebelumnya : 50.0
Reward Instan (r)       : 85.0
Nilai Q(s,a) Terbaru    : 61.60
Status Agen             : Konvergen Optimal!`,
    tantanganLatihan:
      "Tambahkan perhitungan rata-rata array reward [80, 85, 90, 95] menggunakan fungsi np.mean()!",
    xpReward: 50,
    dataPlotAwal: [50, 58, 66, 74, 82, 88, 93, 96],
  },

  // 2. BAHASA C / C++
  {
    id: "sim-c-1",
    kategoriId: "c_cpp",
    judulModul: "Modul 1: Struktur Data Pointer, Array & PerhitunganChecksum Paket Jaringan",
    level: "Pemula",
    durasi: "20 Menit",
    pengajar: "Dr. Hendra Wijaya, M.T.",
    ringkasanTeori:
      "Bahasa C memberikan kendali langsung terhadap memori melalui pointer dan sangat krusial dalam pemrograman jaringan (socket programming) serta sistem tertanam (embedded systems).",
    langkahPraktikum: [
      "Amati deklarasi array byte paket data dan pointer dalam fungsi main().",
      "Jalankan kompilator GCC untuk melihat hasil penjumlahan byte dan alamat memori.",
      "Tambahkan 1 elemen baru pada array paket[] dan periksa hasil akhirnya.",
    ],
    kodeAwal: `#include <stdio.h>

int main() {
    int paket_data[4] = {192, 168, 1, 254};
    int total_byte = 0;

    printf("=== SIMULATOR GCC BAHASA C (NETWORK PACKET) ===\\n");
    for (int i = 0; i < 4; i++) {
        total_byte += paket_data[i];
        printf("Oktet IP ke-%d : %d (Alamat Memori: 0x7ffe0%d)\\n", i + 1, paket_data[i], i * 4);
    }

    printf("Total Checksum Sederhana : %d\\n", total_byte);
    return 0;
}`,
    outputEkspektasi: `=== SIMULATOR GCC BAHASA C (NETWORK PACKET) ===
Oktet IP ke-1 : 192 (Alamat Memori: 0x7ffe00)
Oktet IP ke-2 : 168 (Alamat Memori: 0x7ffe04)
Oktet IP ke-3 : 1 (Alamat Memori: 0x7ffe08)
Oktet IP ke-4 : 254 (Alamat Memori: 0x7ffe012)
Total Checksum Sederhana : 615`,
    tantanganLatihan:
      "Modifikasi perulangan di atas untuk menampilkan nilai maksimum dari array paket_data!",
    xpReward: 45,
  },

  // 3. NEXT.JS & TYPESCRIPT
  {
    id: "sim-nx-1",
    kategoriId: "nextjs",
    judulModul: "Modul 1: Arsitektur Komponen Interaktif Next.js, React Hooks & Tailwind CSS",
    level: "Menengah",
    durasi: "30 Menit",
    pengajar: "Admin Panda Kode",
    ringkasanTeori:
      "Next.js dengan App Router dan TypeScript memungkinkan pembuatan antarmuka web yang cepat, modular, dan aman terhadap tipe data (type-safe). Di simulator ini Anda dapat mengedit komponen dan melihat hasil render UI secara langsung.",
    langkahPraktikum: [
      "Perhatikan penggunaan React Hook useState untuk mengelola state penghitung belajar.",
      "Klik 'Jalankan Kode (Run)' untuk me-render Live Preview Komponen Next.js di bawah.",
      "Ubah teks judul atau kelas warna Tailwind di dalam kode lalu jalankan kembali.",
    ],
    kodeAwal: `"use client";
import React, { useState } from "react";

export default function KartuProgresBelajar() {
  const [modulTuntas, setModulTuntas] = useState(3);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
      <span className="text-xs font-black uppercase bg-black/20 px-3 py-1 rounded-full">
        Next.js 16 Live Preview
      </span>
      <h3 className="text-2xl font-black mt-2">Kartu Wakaf Ilmu Interaktif</h3>
      <p className="text-sm opacity-90">Modul diselesaikan: {modulTuntas} Modul</p>
    </div>
  );
}`,
    outputEkspektasi: `✓ [Turbopack] Compiled /app/page.tsx in 18ms
✓ TypeScript check passed (0 errors)
✓ Live Component Preview rendered successfully!`,
    tantanganLatihan:
      "Tambahkan tombol reset progres atau ubah skema gradien warna menjadi indigo-purple!",
    xpReward: 55,
  },

  // 4. MATLAB & SIMULINK
  {
    id: "sim-mt-1",
    kategoriId: "matlab",
    judulModul: "Modul 1: Analisis Sinyal Sinusoidal, Modulasi & Plot Grafik MATLAB",
    level: "Menengah",
    durasi: "25 Menit",
    pengajar: "Bapak Budi Santoso, M.Pd",
    ringkasanTeori:
      "MATLAB sangat andal untuk komputasi matriks, pengolahan sinyal digital (DSP), sistem telekomunikasi, dan kendali otomatis. Simulator ini mengeksekusi skrip vektor dan memvisualisasikan plot grafik secara interaktif.",
    langkahPraktikum: [
      "Amati persamaan gelombang sinus y = A * sin(2 * pi * f * t) pada editor skrip .m.",
      "Jalankan skrip untuk menampilkan nilai matriks di Command Window serta Grafik Plot gelombang.",
      "Eksperimenlah dengan mengubah nilai amplitudo atau frekuensi di dalam skrip.",
    ],
    kodeAwal: `% SIMULASI PENGOLAHAN SINYAL DIGITAL (DSP) - MATLAB
fs = 1000;              % Frekuensi Sampling (Hz)
t = 0:0.001:0.02;       % Vektor Waktu (Detik)
f = 50;                 % Frekuensi Sinyal Utama (50 Hz)
Amplitudo = 12;         % Amplitudo Tegangan (Volt)

y = Amplitudo * sin(2 * pi * f * t);
daya_rata = (Amplitudo^2) / 2;

disp('=== COMMAND WINDOW MATLAB R2026a ===');
fprintf('Frekuensi Sinyal  : %d Hz\\n', f);
fprintf('Amplitudo Puncak  : %d Volt\\n', Amplitudo);
fprintf('Daya Rata-Rata    : %.2f Watt\\n', daya_rata);
plot(t, y); grid on;`,
    outputEkspektasi: `=== COMMAND WINDOW MATLAB R2026a ===
Frekuensi Sinyal  : 50 Hz
Amplitudo Puncak  : 12 Volt
Daya Rata-Rata    : 72.00 Watt
>> Grafik Plot 2D (t vs y) berhasil dirender pada jendela Figure 1.`,
    tantanganLatihan:
      "Hitung nilai tegangan efektif (V_rms = Amplitudo / sqrt(2)) dan tampilkan menggunakan fprintf!",
    xpReward: 50,
    dataPlotAwal: [15, 45, 78, 95, 78, 45, 15, 5, 15, 45, 78, 95],
  },

  // 5. WOKWI (ESP32 & ARDUINO IOT)
  {
    id: "sim-wk-1",
    kategoriId: "wokwi",
    judulModul: "Modul 1: Simulator Wokwi ESP32 — Sensor Suhu DHT22, Kontrol LED & Telemetri WiFi",
    level: "Pemula",
    durasi: "30 Menit",
    pengajar: "Tim Lab IoT & Embedded HibahIlmu",
    ringkasanTeori:
      "Wokwi memungkinkan Anda merakit dan memprogram mikrokontroler ESP32 atau Arduino Uno secara virtual tanpa takut komponen terbakar. Anda dapat menguji logika pin GPIO, membaca sensor DHT22/Ultrasonik, dan memantau Serial Monitor secara real-time.",
    langkahPraktikum: [
      "Perhatikan konfigurasi pin LED (GPIO 2, 4, 5) dan pembacaan sensor DHT22 (GPIO 15) pada kode sketch.ino.",
      "Gunakan panel Papan Virtual Wokwi di bawah untuk menggeser slider suhu DHT22 dan jarak ultrasonik.",
      "Klik 'Jalankan Kode (Run)' untuk menyalakan indikator LED pada board ESP32 dan membaca log Serial Monitor.",
    ],
    kodeAwal: `#include <WiFi.h>
#include <DHT.h>

#define PIN_LED_HIJAU 2
#define PIN_LED_MERAH 4
#define PIN_DHT 15

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED_HIJAU, OUTPUT);
  pinMode(PIN_LED_MERAH, OUTPUT);
  Serial.println("=== WOKWI ESP32 IOT TELEMETRY READY ===");
}

void loop() {
  // Jika suhu > 32 C, nyalakan alarm LED Merah
  digitalWrite(PIN_LED_HIJAU, HIGH);
  Serial.println("[ESP32 Serial]: Membaca sensor DHT22 & mengirim paket MQTT...");
  delay(1000);
}`,
    outputEkspektasi: `=== WOKWI ESP32 IOT TELEMETRY READY ===
[WiFi]: Connected to SSID "HibahIlmu-Lab-5G" (IP: 192.168.1.108)
[ESP32 Serial]: Membaca sensor DHT22 & mengirim paket MQTT...
[GPIO Status]: PIN 2 (LED Hijau) = HIGH | Sensor Aktif`,
    tantanganLatihan:
      "Atur slider suhu pada papan virtual Wokwi di atas 35°C dan uji respons indikator alarm LED Merah!",
    xpReward: 60,
  },

  // 6. EWB (ELECTRONICS WORKBENCH & DIGITAL LOGIC)
  {
    id: "sim-ewb-1",
    kategoriId: "ewb",
    judulModul: "Modul 1: Simulator EWB — Hukum Ohm, Pembagi Tegangan, Osiloskop & Gerbang Logika",
    level: "Pemula",
    durasi: "25 Menit",
    pengajar: "Bapak Budi Santoso, M.Pd",
    ringkasanTeori:
      "Electronics Workbench (EWB / Multisim) digunakan untuk merancang dan mengukur rangkaian elektronika analog maupun gerbang logika digital. Anda dapat menggunakan Multimeter Digital, Osiloskop 2-Channel, dan penguji tabel kebenaran IC Logika.",
    langkahPraktikum: [
      "Atur nilai Tegangan Sumber (Vcc), Resistor R1, dan Resistor R2 pada meja kerja EWB interaktif di bawah.",
      "Amati perubahan Arus Total (mA), Tegangan Keluaran (Vout), serta gelombang pada layar Osiloskop.",
      "Uji sakelar Input A (0/1) dan Input B (0/1) pada simulator Gerbang Logika Digital (AND, OR, NAND, XOR).",
    ],
    kodeAwal: `* SPICE NETLIST - ELECTRONICS WORKBENCH (EWB)
* Rangkaian Pembagi Tegangan & Filter RC
VCC 1 0 DC 12V AC 5V SIN(0 12 50)
R1  1 2 1000
R2  2 0 2000
C1  2 0 10uF

.tran 0.1ms 20ms
.print tran V(1) V(2) I(R1)
.end`,
    outputEkspektasi: `=== SPICE / EWB CIRCUIT ANALYSIS COMPLETE ===
Tegangan Sumber (Vcc)   : 12.00 V
Hambatan Total (R1+R2)  : 3000 Ohm (3.0 kOhm)
Arus Rangkaian (I)      : 4.00 mA
Tegangan Node Vout (R2) : 8.00 V
Status Osiloskop        : Sinyal Terkunci (Triggered 50 Hz)`,
    tantanganLatihan:
      "Ubah nilai R1 dan R2 pada panel interaktif EWB hingga menghasilkan tegangan keluaran Vout tepat 6.00 Volt!",
    xpReward: 55,
  },
];