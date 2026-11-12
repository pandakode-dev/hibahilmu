"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Play,
  Sparkles,
  Code2,
  RotateCcw,
  Award,
  Lock,
  HelpCircle,
  Eye,
  Target,
  Search,
  Filter,
  Move,
  Sliders,
  BookOpen,
  X,
  Cpu,
  Check,
  Lightbulb,
  Cable,
  Trash2,
} from "lucide-react";
import {
  KURIKULUM_15_LEVEL_IOT,
  LessonStepIoT as BaseLessonStepIoT,
} from "./wokwiCurriculumData";
import {
  GUDANG_KOMPONEN_48_MASTER,
  MiniaturSvgGudang48,
  PIN_FISIK_ESP32_STANDAR,
  TitikPinFisik,
  ItemGudang48Master,
  KategoriFilterGudang48,
  ParameterFisikaInteraktif,
} from "./wokwiHardwareVisuals";

export type KategoriKesulitanAcademy =
  | "Semua"
  | "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)"
  | "Bab 2: Output LED Tunggal & Lampu Lalu Lintas"
  | "Bab 3: Digital/Analog Input & External Interrupt"
  | "Bab 4: Sensor, Aktuator & Otomasi Cerdas"
  | "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";

export type ExtendedLessonStepIoT = BaseLessonStepIoT & {
  jumlahSlotAktif?: number;
  kategoriKesulitan?: string;
};

export interface KabelTersambung {
  dariPinEsp32: string;
  kePinPeriferal: string;
  warna: string;
}

// ============================================================================
// DEFINISI SLOT KOMPONEN INDEPENDEN & KAKI PINNYA MASING-MASING (REAL STEP-BY-STEP)
// Setiap slot komponen periferal memiliki kotak, gambar, dan titik pinnya sendiri!
// ============================================================================
export interface DefinisiSlotPeriferalMandiri {
  nomorSlot: number; // 2, 3, atau 4 (Slot 1 selalu ESP32 di kiri)
  namaTarget: string;
  fungsiSingkat: string;
  kataKunciCocokGudang: string[]; // Kata kunci untuk mencocokkan kartu dari Gudang 48 Item
  idGambarMiniatur: string;
  boxX: number;
  boxY: number;
  boxW: number;
  boxH: number;
  daftarPinSlotIni: (TitikPinFisik & {
    targetPinEsp32: string;
    labelPinEsp32: string;
    warnaKabel: string;
    keteranganSambung: string;
  })[];
}

export interface BlueprintMultiKomponenLevel {
  analogiMudahPaham: string;
  ringkasanCaraKerja: string;
  slotPeriferalList: DefinisiSlotPeriferalMandiri[];
}

// GENERATOR BLUEPRINT MULTI-KOMPONEN (MENDUKUNG 1 SAMPAI 4 KOMPONEN TERPISAH!)
function ambilBlueprintMultiKomponen(
  materi: ExtendedLessonStepIoT
): BlueprintMultiKomponenLevel {
  const judul = (materi.judulMateri || "").toLowerCase();
  const kode = (materi.kodeTargetBenar || "").toLowerCase();

  // 1. KHUSUS MATERI STANDALONE 1-BOARD ESP32 (Tanpa Komponen Luar)
  if (
    judul.includes("internal") ||
    judul.includes("tanpa komponen") ||
    judul.includes("web server") ||
    judul.includes("blynk") ||
    (judul.includes("wi-fi") && !judul.includes("mesh")) ||
    (judul.includes("timer") && !judul.includes("dht"))
  ) {
    return {
      analogiMudahPaham:
        "Bayangkan papan ESP32 ini seperti smartphone mini. Di dalamnya sudah ada lampu LED kecil (di kaki GPIO 2), jam pengatur waktu (Timer), dan antena Wi-Fi. Jadi kita bisa langsung memprogramnya tanpa perlu memasang kabel luar!",
      ringkasanCaraKerja:
        "Kamu cukup menarik 1 papan ESP32 DevKit V1 ke Slot #1 di kanvas, lalu ketik program C++ di editor untuk mengendalikan fitur bawaan di dalam chip ESP32.",
      slotPeriferalList: [],
    };
  }

  // 2. LAMPU LALU LINTAS / MULTI-LED + RESISTOR (4 KOMPONEN: ESP32 + LED MERAH + LED HIJAU + RESISTOR)
  if (judul.includes("lalu lintas") || (judul.includes("merah") && judul.includes("hijau"))) {
    return {
      analogiMudahPaham:
        "Persis seperti lampu merah di perempatan jalan raya: tidak boleh lampu Merah dan lampu Hijau menyala bersamaan! Saat GPIO 2 mengirim listrik ke LED Merah (Berhenti), GPIO 15 harus mematikan LED Hijau, begitu pula sebaliknya.",
      ringkasanCaraKerja:
        "Di modul ini kita menggunakan 4 komponen terpisah yang harus kamu tarik satu per satu dari Gudang Komponen: (1) ESP32, (2) LED Merah, (3) LED Hijau, dan (4) Resistor 220Ω.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "LED Merah 5mm (Lampu STOP)",
          fungsiSingkat: "Menyala saat logika GPIO 2 bernilai HIGH.",
          kataKunciCocokGudang: ["led merah", "led_merah", "led"],
          idGambarMiniatur: "led_merah",
          boxX: 330,
          boxY: 16,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_LED_M",
              labelPin: "Anoda Merah (+)",
              x: 345,
              y: 50,
              warnaPin: "#ef4444",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO2",
              labelPinEsp32: "GPIO 2",
              warnaKabel: "#ef4444",
              keteranganSambung: "Klik [GPIO 2] di ESP32 ➔ Klik [Anoda Merah (+)] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "LED Hijau 5mm (Lampu JALAN)",
          fungsiSingkat: "Menyala saat logika GPIO 15 bernilai HIGH.",
          kataKunciCocokGudang: ["led hijau", "led_hijau", "led"],
          idGambarMiniatur: "led_hijau",
          boxX: 330,
          boxY: 92,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_LED_H",
              labelPin: "Anoda Hijau (+)",
              x: 345,
              y: 126,
              warnaPin: "#22c55e",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO15",
              labelPinEsp32: "GPIO 15",
              warnaKabel: "#22c55e",
              keteranganSambung: "Klik [GPIO 15] di ESP32 ➔ Klik [Anoda Hijau (+)] di Slot 3",
            },
          ],
        },
        {
          nomorSlot: 4,
          namaTarget: "Resistor Gelang 220Ω (Ground)",
          fungsiSingkat: "Membatasi arus LED agar tidak putus menuju GND.",
          kataKunciCocokGudang: ["resistor", "220", "led"],
          idGambarMiniatur: "resistor_gelang",
          boxX: 330,
          boxY: 168,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT4_RES_GND",
              labelPin: "Kaki Resistor (GND)",
              x: 345,
              y: 202,
              warnaPin: "#64748b",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GND",
              labelPinEsp32: "GND",
              warnaKabel: "#64748b",
              keteranganSambung: "Klik [GND] di ESP32 ➔ Klik [Kaki Resistor (GND)] di Slot 4",
            },
          ],
        },
      ],
    };
  }

  // 3. SMART GREENHOUSE (4 KOMPONEN TERPISAH: ESP32 + SENSOR DHT22 + KIPAS DC + POMPA AIR)
  if (judul.includes("greenhouse") || judul.includes("dht22")) {
    return {
      analogiMudahPaham:
        "Bayangkan kamu punya rumah kaca tanaman otomatis: Sensor DHT22 bertugas sebagai 'indra peraba suhu'. Kalau udara kepanasan (> 32°C), ESP32 menyuruh Kipas DC berputar. Kalau tanahnya kering, ESP32 menyuruh Pompa Air menyiram tanaman!",
      ringkasanCaraKerja:
        "Modul ini memakai 4 perangkat berbeda yang wajib kamu tarik satu per satu ke kanvas: (1) ESP32, (2) Sensor Suhu DHT22, (3) Kipas DC Exhaust, dan (4) Pompa Air Mini / Relay.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Sensor Suhu & Lembab DHT22",
          fungsiSingkat: "Membaca suhu udara (°C) dan mengirimnya ke GPIO 15.",
          kataKunciCocokGudang: ["dht", "suhu", "soil", "kelembapan"],
          idGambarMiniatur: "sensor_suhu_dht",
          boxX: 330,
          boxY: 16,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_DHT_DATA",
              labelPin: "DHT22 Pin Data",
              x: 345,
              y: 50,
              warnaPin: "#10b981",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO15",
              labelPinEsp32: "GPIO 15",
              warnaKabel: "#10b981",
              keteranganSambung: "Klik [GPIO 15] di ESP32 ➔ Klik [DHT22 Pin Data] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Kipas DC (PWM) Pendingin",
          fungsiSingkat: "Memutar baling-baling saat GPIO 33 bernilai HIGH.",
          kataKunciCocokGudang: ["kipas", "fan", "relay"],
          idGambarMiniatur: "kipas_dc",
          boxX: 330,
          boxY: 92,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_FAN_IN",
              labelPin: "Pin Kontrol Kipas",
              x: 345,
              y: 126,
              warnaPin: "#8b5cf6",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO33",
              labelPinEsp32: "GPIO 33",
              warnaKabel: "#8b5cf6",
              keteranganSambung: "Klik [GPIO 33] di ESP32 ➔ Klik [Pin Kontrol Kipas] di Slot 3",
            },
          ],
        },
        {
          nomorSlot: 4,
          namaTarget: "Pompa Air Mini 5V + Relay",
          fungsiSingkat: "Menyemprotkan air irigasi saat GPIO 25 bernilai HIGH.",
          kataKunciCocokGudang: ["pompa", "relay", "air"],
          idGambarMiniatur: "pompa_air",
          boxX: 330,
          boxY: 168,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT4_PUMP_IN",
              labelPin: "Pin Relay Pompa",
              x: 345,
              y: 202,
              warnaPin: "#3b82f6",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO25",
              labelPinEsp32: "GPIO 25",
              warnaKabel: "#3b82f6",
              keteranganSambung: "Klik [GPIO 25] di ESP32 ➔ Klik [Pin Relay Pompa] di Slot 4",
            },
          ],
        },
      ],
    };
  }

  // 4. PROTEKSI KEBAKARAN & GAS (4 KOMPONEN: ESP32 + SENSOR GAS MQ-2 + BUZZER SIRINE + POMPA SPRINKLER)
  if (judul.includes("mq-2") || judul.includes("gas") || judul.includes("kebakaran")) {
    return {
      analogiMudahPaham:
        "Seperti sistem alarm kebakaran di mal: Sensor MQ-2 mencium bau gas bocor atau asap (PPM). Begitu kepekatan asap berbahaya (>= 500 PPM), ESP32 langsung membunyikan Sirine Buzzer (GPIO 19) dan menyalakan Pompa Air Pemadam (GPIO 25)!",
      ringkasanCaraKerja:
        "Tarik 4 komponen secara bertahap ke kanvas: (1) ESP32, (2) Sensor Gas MQ-2, (3) Buzzer Piezo Sirine, dan (4) Pompa Air / Relay Pemadam.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Sensor Gas & Asap MQ-2",
          fungsiSingkat: "Mendeteksi kadar gas PPM melalui kaki analog GPIO 32.",
          kataKunciCocokGudang: ["mq-2", "mq2", "gas", "flame", "api"],
          idGambarMiniatur: "sensor_mq2",
          boxX: 330,
          boxY: 16,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_MQ2_AO",
              labelPin: "MQ-2 Pin AO",
              x: 345,
              y: 50,
              warnaPin: "#f43f5e",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO32",
              labelPinEsp32: "GPIO 32",
              warnaKabel: "#f43f5e",
              keteranganSambung: "Klik [GPIO 32] di ESP32 ➔ Klik [MQ-2 Pin AO] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Buzzer Piezo Sirine Darurat",
          fungsiSingkat: "Berbunyi nyaring saat GPIO 19 bernilai HIGH.",
          kataKunciCocokGudang: ["buzzer", "piezo", "sirine"],
          idGambarMiniatur: "buzzer_piezo",
          boxX: 330,
          boxY: 92,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_BUZ_POS",
              labelPin: "Buzzer Positif (+)",
              x: 345,
              y: 126,
              warnaPin: "#ec4899",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO19",
              labelPinEsp32: "GPIO 19",
              warnaKabel: "#ec4899",
              keteranganSambung: "Klik [GPIO 19] di ESP32 ➔ Klik [Buzzer Positif (+)] di Slot 3",
            },
          ],
        },
        {
          nomorSlot: 4,
          namaTarget: "Pompa Sprinkler Pemadam",
          fungsiSingkat: "Menyemprotkan air pemadam saat GPIO 25 bernilai HIGH.",
          kataKunciCocokGudang: ["pompa", "relay", "flame"],
          idGambarMiniatur: "pompa_air",
          boxX: 330,
          boxY: 168,
          boxW: 225,
          boxH: 68,
          daftarPinSlotIni: [
            {
              idPin: "SLOT4_SPRINKLER",
              labelPin: "Pin Pompa Pemadam",
              x: 345,
              y: 202,
              warnaPin: "#3b82f6",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO25",
              labelPinEsp32: "GPIO 25",
              warnaKabel: "#3b82f6",
              keteranganSambung: "Klik [GPIO 25] di ESP32 ➔ Klik [Pin Pompa Pemadam] di Slot 4",
            },
          ],
        },
      ],
    };
  }

  // 5. PUSH BUTTON + LED / EXTERNAL INTERRUPT (3 KOMPONEN: ESP32 + PUSH BUTTON + LED/BUZZER)
  if (judul.includes("button") || judul.includes("tombol") || judul.includes("interrupt")) {
    return {
      analogiMudahPaham:
        "Bayangkan sakelar bel rumah: Tombol Push Button dipasang di kaki GPIO 4 sebagai 'Penerima Perintah Tangan', sedangkan Lampu LED dipasang di kaki GPIO 2 sebagai 'Penerima Hasil'. Saat tombol ditekan, ESP32 langsung menyalakan lampu!",
      ringkasanCaraKerja:
        "Tarik 3 komponen berbeda secara berurutan ke kanvas: (1) ESP32 ke Slot 1, (2) Push Button Switch ke Slot 2, dan (3) LED Merah / Buzzer ke Slot 3.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Push Button Switch (Input)",
          fungsiSingkat: "Mengirim sinyal LOW ke GPIO 4 saat tombol ditekan.",
          kataKunciCocokGudang: ["button", "tombol", "keypad"],
          idGambarMiniatur: "push_button_sw",
          boxX: 330,
          boxY: 28,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_BTN_SIG",
              labelPin: "Kaki Tombol (SIG)",
              x: 345,
              y: 72,
              warnaPin: "#38bdf8",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO4",
              labelPinEsp32: "GPIO 4",
              warnaKabel: "#38bdf8",
              keteranganSambung: "Klik [GPIO 4] di ESP32 ➔ Klik [Kaki Tombol (SIG)] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "LED Merah 5mm / Buzzer (Output)",
          fungsiSingkat: "Menyala seketika saat GPIO 2 bernilai HIGH.",
          kataKunciCocokGudang: ["led", "buzzer", "resistor"],
          idGambarMiniatur: "led_merah",
          boxX: 330,
          boxY: 134,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_LED_OUT",
              labelPin: "Anoda LED (+)",
              x: 345,
              y: 178,
              warnaPin: "#ef4444",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO2",
              labelPinEsp32: "GPIO 2",
              warnaKabel: "#ef4444",
              keteranganSambung: "Klik [GPIO 2] di ESP32 ➔ Klik [Anoda LED (+)] di Slot 3",
            },
          ],
        },
      ],
    };
  }

  // 6. SENSOR CAHAYA LDR + RELAY LAMPU JALAN (3 KOMPONEN: ESP32 + SENSOR LDR + MODUL RELAY)
  if (judul.includes("ldr") || judul.includes("cahaya")) {
    return {
      analogiMudahPaham:
        "Cara kerja lampu jalan pintar di jalan tol: Sensor Cahaya LDR berperan sebagai 'Mata' yang melihat apakah langit sudah gelap. Jika gelap, ESP32 menyuruh Modul Relay ('Sakelar Otomatis') untuk menyalakan lampu jalan!",
      ringkasanCaraKerja:
        "Tarik 3 perangkat terpisah dari Gudang Komponen: (1) ESP32 ke Slot 1, (2) Sensor Cahaya LDR ke Slot 2, dan (3) Modul Relay 1-Channel 5V ke Slot 3.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Sensor Cahaya LDR",
          fungsiSingkat: "Mengirim nilai terang/gelap cahaya ke pin ADC GPIO 34.",
          kataKunciCocokGudang: ["ldr", "cahaya", "pir", "potensiometer"],
          idGambarMiniatur: "sensor_ldr",
          boxX: 330,
          boxY: 28,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_LDR_AO",
              labelPin: "LDR Pin AO",
              x: 345,
              y: 72,
              warnaPin: "#22c55e",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO34",
              labelPinEsp32: "GPIO 34",
              warnaKabel: "#22c55e",
              keteranganSambung: "Klik [GPIO 34] di ESP32 ➔ Klik [LDR Pin AO] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Relay 1-Channel 5V (Sakelar Lampu)",
          fungsiSingkat: "Menyalakan lampu jalan saat GPIO 26 bernilai HIGH.",
          kataKunciCocokGudang: ["relay", "led", "lampu"],
          idGambarMiniatur: "relay_1ch",
          boxX: 330,
          boxY: 134,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_RELAY_IN",
              labelPin: "Relay Pin IN",
              x: 345,
              y: 178,
              warnaPin: "#eab308",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO26",
              labelPinEsp32: "GPIO 26",
              warnaKabel: "#eab308",
              keteranganSambung: "Klik [GPIO 26] di ESP32 ➔ Klik [Relay Pin IN] di Slot 3",
            },
          ],
        },
      ],
    };
  }

  // 7. SERVO SG90 + SOLENOID / RFID / ULTRASONIK (3 KOMPONEN TERPISAH)
  if (judul.includes("servo") || judul.includes("solenoid") || judul.includes("rfid") || judul.includes("ultrasonik")) {
    return {
      analogiMudahPaham:
        "Bayangkan gerbang tol atau pintu akses kartu hotel: Sensor di Slot 2 memeriksa kartu RFID / jarak mobil, lalu Aktuator Mekanik di Slot 3 (Motor Servo & Solenoid Lock) bergerak membuka palang pintu!",
      ringkasanCaraKerja:
        "Tarik 3 perangkat satu per satu: (1) ESP32 ke Slot 1, (2) Motor Servo SG90 180° ke Slot 2, dan (3) Solenoid Door Lock / Sensor ke Slot 3.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Servo SG90 180° (Penggerak Palang)",
          fungsiSingkat: "Berputar ke sudut 90° melalui sinyal PWM dari GPIO 13.",
          kataKunciCocokGudang: ["servo", "rfid", "ultrasonik"],
          idGambarMiniatur: "servo_sg90",
          boxX: 330,
          boxY: 28,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_SERVO_PWM",
              labelPin: "Servo Kabel PWM",
              x: 345,
              y: 72,
              warnaPin: "#a855f7",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO13",
              labelPinEsp32: "GPIO 13",
              warnaKabel: "#a855f7",
              keteranganSambung: "Klik [GPIO 13] di ESP32 ➔ Klik [Servo Kabel PWM] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Solenoid Lock 12V / Sensor",
          fungsiSingkat: "Terhubung ke jalur kontrol GPIO 27 pada ESP32.",
          kataKunciCocokGudang: ["solenoid", "relay", "ultrasonik", "rfid"],
          idGambarMiniatur: "solenoid_lock",
          boxX: 330,
          boxY: 134,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_SOLENOID_IN",
              labelPin: "Pin Solenoid / Sonar",
              x: 345,
              y: 178,
              warnaPin: "#14b8a6",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO27",
              labelPinEsp32: "GPIO 27",
              warnaKabel: "#14b8a6",
              keteranganSambung: "Klik [GPIO 27] di ESP32 ➔ Klik [Pin Solenoid / Sonar] di Slot 3",
            },
          ],
        },
      ],
    };
  }

  // 8. SENSOR PUPUK NPK + GPS NEO-6M (3 KOMPONEN: ESP32 + SENSOR NPK + MODUL GPS)
  if (judul.includes("npk") || judul.includes("gps") || judul.includes("multi-hop") || judul.includes("10-node")) {
    return {
      analogiMudahPaham:
        "Di perkebunan kelapa sawit atau pertanian luas, kita tidak cukup hanya tahu tanahnya kurang pupuk (Sensor NPK), tapi juga wajib tahu di titik koordinat mana pohon itu berada (Modul Satelit GPS) sebelum dikirim ke Node 10 Internet!",
      ringkasanCaraKerja:
        "Tarik 3 perangkat utama ke kanvas: (1) ESP32 ke Slot 1, (2) Sensor Pupuk NPK RS485 ke Slot 2, dan (3) Modul GPS Satelit NEO-6M / Gateway ke Slot 3.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Sensor Pupuk NPK RS485",
          fungsiSingkat: "Mengirim data Nitrogen, Fosfor, Kalium lewat pin UART (16/17).",
          kataKunciCocokGudang: ["npk", "pupuk", "tanah", "ph", "tds", "esp32"],
          idGambarMiniatur: "sensor_npk",
          boxX: 330,
          boxY: 28,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_NPK_TX",
              labelPin: "Pin Data NPK / Hop",
              x: 345,
              y: 72,
              warnaPin: "#10b981",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO17",
              labelPinEsp32: "TX2 (17)",
              warnaKabel: "#10b981",
              keteranganSambung: "Klik [TX2 (17)] di ESP32 ➔ Klik [Pin Data NPK / Hop] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Modul Satelit GPS NEO-6M / Cloud",
          fungsiSingkat: "Mengirim titik koordinat Latitude & Longitude kebun.",
          kataKunciCocokGudang: ["gps", "neo", "nodemcu", "esp32", "oled"],
          idGambarMiniatur: "gps_neo6m",
          boxX: 330,
          boxY: 134,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_GPS_PIN",
              labelPin: "Pin GPS / Cloud",
              x: 345,
              y: 178,
              warnaPin: "#38bdf8",
              posisiKomponen: "periferal",
              targetPinEsp32: kode.includes("16") ? "ESP_GPIO16" : "ESP_GPIO4",
              labelPinEsp32: kode.includes("16") ? "RX2 (16)" : "GPIO 4",
              warnaKabel: "#38bdf8",
              keteranganSambung: `Klik [${kode.includes("16") ? "RX2 (16)" : "GPIO 4"}] di ESP32 ➔ Klik [Pin GPS / Cloud] di Slot 3`,
            },
          ],
        },
      ],
    };
  }

  // 9. BATERAI 18650 + SENSOR TEGANGAN (3 KOMPONEN: ESP32 + SOCKET BATERAI + SENSOR TEGANGAN)
  if (judul.includes("baterai") || judul.includes("tegangan")) {
    return {
      analogiMudahPaham:
        "Agar alat IoT di kebun bisa menyala tanpa colokan listrik PLN, kita memakai Baterai Li-Ion 18650 (Slot 2) dan memasang Sensor Tegangan (Slot 3) ke kaki ADC GPIO 35 untuk memantau sisa persentase baterainya!",
      ringkasanCaraKerja:
        "Tarik 3 perangkat secara berurutan: (1) ESP32 ke Slot 1, (2) Socket Baterai 18650 ke Slot 2, dan (3) Sensor Tegangan 0-25V ke Slot 3.",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Socket Baterai Li-Ion 18650",
          fungsiSingkat: "Menyuplai daya DC 3.7V–4.2V dan terhubung ke jalur GND.",
          kataKunciCocokGudang: ["baterai", "18650", "daya"],
          idGambarMiniatur: "socket_baterai",
          boxX: 330,
          boxY: 28,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT2_BATT_GND",
              labelPin: "Kutub Baterai (-)",
              x: 345,
              y: 72,
              warnaPin: "#64748b",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GND",
              labelPinEsp32: "GND",
              warnaKabel: "#64748b",
              keteranganSambung: "Klik [GND] di ESP32 ➔ Klik [Kutub Baterai (-)] di Slot 2",
            },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Sensor Tegangan 0-25V (INA219)",
          fungsiSingkat: "Mengirim nilai voltase baterai ke pin ADC GPIO 35.",
          kataKunciCocokGudang: ["tegangan", "pzem", "daya", "baterai"],
          idGambarMiniatur: "sensor_tegangan",
          boxX: 330,
          boxY: 134,
          boxW: 225,
          boxH: 88,
          daftarPinSlotIni: [
            {
              idPin: "SLOT3_VOLT_OUT",
              labelPin: "Pin Voltase (V_OUT)",
              x: 345,
              y: 178,
              warnaPin: "#f59e0b",
              posisiKomponen: "periferal",
              targetPinEsp32: "ESP_GPIO35",
              labelPinEsp32: "GPIO 35",
              warnaKabel: "#f59e0b",
              keteranganSambung: "Klik [GPIO 35] di ESP32 ➔ Klik [Pin Voltase (V_OUT)] di Slot 3",
            },
          ],
        },
      ],
    };
  }

  // 10. DEFAULT: RANGKAIAN DASAR (3 KOMPONEN: ESP32 + LED MERAH 5MM + RESISTOR 220 OHM)
  return {
    analogiMudahPaham:
      "Ibarat menyalakan lampu senter: Papan ESP32 mengeluarkan tegangan 3.3 Volt dari kaki GPIO 2 menuju lampu LED Merah (Slot 2), lalu arusnya ditahan sedikit oleh Resistor 220Ω (Slot 3) menuju GND agar lampu LED tidak putus karena kelebihan arus!",
    ringkasanCaraKerja:
      "Tarik 3 komponen satu per satu dari Gudang Komponen: (1) ESP32 DevKit V1 ke Slot 1, (2) Lampu LED Merah 5mm ke Slot 2, dan (3) Resistor Gelang 220Ω ke Slot 3.",
    slotPeriferalList: [
      {
        nomorSlot: 2,
        namaTarget: "Lampu LED Merah 5mm",
        fungsiSingkat: "Komponen pemancar cahaya saat menerima tegangan dari GPIO 2.",
        kataKunciCocokGudang: ["led", "merah", "hijau"],
        idGambarMiniatur: "led_merah",
        boxX: 330,
        boxY: 28,
        boxW: 225,
        boxH: 88,
        daftarPinSlotIni: [
          {
            idPin: "SLOT2_LED_ANODA",
            labelPin: "Kaki Anoda LED (+)",
            x: 345,
            y: 72,
            warnaPin: "#ef4444",
            posisiKomponen: "periferal",
            targetPinEsp32: "ESP_GPIO2",
            labelPinEsp32: "GPIO 2",
            warnaKabel: "#ef4444",
            keteranganSambung: "Klik [GPIO 2] di ESP32 ➔ Klik [Kaki Anoda LED (+)] di Slot 2",
          },
        ],
      },
      {
        nomorSlot: 3,
        namaTarget: "Resistor Gelang 220Ω (Penahan Arus)",
        fungsiSingkat: "Menghubungkan jalur balik negatif LED menuju pin GND ESP32.",
        kataKunciCocokGudang: ["resistor", "220", "potensiometer", "led"],
        idGambarMiniatur: "resistor_gelang",
        boxX: 330,
        boxY: 134,
        boxW: 225,
        boxH: 88,
        daftarPinSlotIni: [
          {
            idPin: "SLOT3_RES_GND",
            labelPin: "Kaki Resistor (GND)",
            x: 345,
            y: 178,
            warnaPin: "#64748b",
            posisiKomponen: "periferal",
            targetPinEsp32: "ESP_GND",
            labelPinEsp32: "GND",
            warnaKabel: "#64748b",
            keteranganSambung: "Klik [GND] di ESP32 ➔ Klik [Kaki Resistor (GND)] di Slot 3",
          },
        ],
      },
    ],
  };
}

const DAFTAR_BAB_SILABUS: {
  id: KategoriKesulitanAcademy;
  label: string;
  rentang: string;
  warna: string;
}[] = [
  { id: "Semua", label: "📚 Semua Modul", rentang: "Semua Level", warna: "bg-indigo-600 text-white" },
  {
    id: "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)",
    label: "🌱 Bab 1: Dasar 1-ESP32",
    rentang: "Lv. 1–3",
    warna: "bg-sky-600 text-white",
  },
  {
    id: "Bab 2: Output LED Tunggal & Lampu Lalu Lintas",
    label: "💡 Bab 2: Output & Lalu Lintas",
    rentang: "Lv. 4–6",
    warna: "bg-emerald-600 text-white",
  },
  {
    id: "Bab 3: Digital/Analog Input & External Interrupt",
    label: "⚡ Bab 3: Input & Interrupt",
    rentang: "Lv. 7–9",
    warna: "bg-amber-400 text-slate-950",
  },
  {
    id: "Bab 4: Sensor, Aktuator & Otomasi Cerdas",
    label: "🔥 Bab 4: Sensor & Otomasi",
    rentang: "Lv. 10–12",
    warna: "bg-rose-600 text-white",
  },
  {
    id: "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh",
    label: "🏆 Bab 5: NPK, GPS & 10-Node Mesh",
    rentang: "Lv. 13+",
    warna: "bg-purple-600 text-white",
  },
];

const DAFTAR_TAB_FILTER_GUDANG: KategoriFilterGudang48[] = [
  "Semua",
  "Microcontroller",
  "Baterai & Daya",
  "Sensor (25)",
  "Modul Relay",
  "Aktuator & Motor",
  "Pasif & Input",
];

const PILIHAN_OHM_RESISTOR = [100, 220, 330, 470, 1000, 4700, 10000];

function dapatkanBabDariLevel(item: ExtendedLessonStepIoT): string {
  if (item.kategoriKesulitan) return item.kategoriKesulitan;
  if (item.level <= 3)
    return "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)";
  if (item.level <= 6) return "Bab 2: Output LED Tunggal & Lampu Lalu Lintas";
  if (item.level <= 9)
    return "Bab 3: Digital/Analog Input & External Interrupt";
  if (item.level <= 12) return "Bab 4: Sensor, Aktuator & Otomasi Cerdas";
  return "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";
}

function hitungGelangResistorLokal(ohm: number) {
  const petaWarna: Record<number, string> = {
    0: "#000000",
    1: "#78350f",
    2: "#ef4444",
    3: "#f97316",
    4: "#facc15",
    5: "#22c55e",
    6: "#2563eb",
    7: "#9333ea",
    8: "#64748b",
    9: "#ffffff",
  };
  const namaWarna: Record<number, string> = {
    0: "Hitam",
    1: "Coklat",
    2: "Merah",
    3: "Oranye",
    4: "Kuning",
    5: "Hijau",
    6: "Biru",
    7: "Ungu",
    8: "Abu-abu",
    9: "Putih",
  };
  const bersih = Math.max(10, Math.round(ohm));
  const str = String(bersih);
  const d1 = parseInt(str[0] || "2", 10);
  const d2 = parseInt(str[1] || "2", 10);
  const jmlNol = Math.max(0, str.length - 2);
  const labelFormatted =
    bersih >= 1000
      ? `${(bersih / 1000).toFixed(bersih % 1000 === 0 ? 0 : 1)} kΩ`
      : `${bersih} Ω`;
  return {
    warna1: petaWarna[d1] || "#ef4444",
    warna2: petaWarna[d2] || "#ef4444",
    warnaMultiplier: petaWarna[Math.min(9, jmlNol)] || "#78350f",
    warnaToleransi: "#eab308",
    teksGelang: `${namaWarna[d1]} - ${namaWarna[d2]} - ${namaWarna[Math.min(9, jmlNol)]} - Emas`,
    labelFormatted,
  };
}

// ============================================================================
// DIAGRAM ANIMASI VISUAL KONSEP DASAR TEORI (DIPAKAI DI POP-UP & DI PANEL KIRI)
// ============================================================================
const AnimasiVisualDasarTeoriModal: React.FC<{
  blueprint: BlueprintMultiKomponenLevel;
  totalKomponen: number;
}> = ({ blueprint, totalKomponen }) => {
  return (
    <svg
      viewBox="0 0 540 155"
      className="w-full h-36 sm:h-40 bg-slate-950 rounded-2xl border border-slate-800"
    >
      {/* Kotak 1: Papan ESP32 */}
      <rect
        x={20}
        y={25}
        width={135}
        height={105}
        rx={12}
        fill="#0f172a"
        stroke="#facc15"
        strokeWidth={2.5}
      />
      <text
        x={87}
        y={55}
        textAnchor="middle"
        fill="#facc15"
        fontSize="10"
        fontWeight="bold"
      >
        SLOT #1 (OTAK MCU)
      </text>
      <text
        x={87}
        y={76}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="10.5"
        fontWeight="bold"
      >
        ESP32 DevKit V1
      </text>
      <text
        x={87}
        y={96}
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="8.5"
      >
        Mengatur Pin GPIO &amp; Kode C++
      </text>

      {/* Garis Aliran Kabel Beranimasi */}
      <path
        d="M 155 78 L 215 78"
        stroke="#38bdf8"
        strokeWidth={3.5}
        strokeDasharray="6 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="20"
          to="0"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx={185} cy={78} r={5} fill="#fde047">
        <animate
          attributeName="cx"
          values="158;212;158"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Kotak Kanan: Daftar Slot Komponen yang Harus Ditarik Bertahap */}
      <rect
        x={215}
        y={16}
        width={305}
        height={122}
        rx={12}
        fill="#064e3b"
        stroke="#34d399"
        strokeWidth={2}
      />
      <text
        x={367}
        y={38}
        textAnchor="middle"
        fill="#fde047"
        fontSize="10"
        fontWeight="bold"
      >
        {totalKomponen === 1
          ? "⚡ MODE 1 KOMPONEN (HANYA PAPAN ESP32 SAJA)"
          : `🛠️ RAKIT BERTAHAP ${totalKomponen} KOMPONEN TERPISAH:`}
      </text>

      {blueprint.slotPeriferalList.length === 0 ? (
        <text
          x={367}
          y={82}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="bold"
        >
          LED &amp; Wi-Fi sudah ada di dalam ESP32 (Tanpa Kabel Luar)
        </text>
      ) : (
        blueprint.slotPeriferalList.map((s, idx) => (
          <g key={s.nomorSlot}>
            <rect
              x={230}
              y={48 + idx * 27}
              width={275}
              height={22}
              rx={5}
              fill="#022c22"
              stroke="#10b981"
            />
            <text
              x={240}
              y={63 + idx * 27}
              fill="#a7f3d0"
              fontSize="8.8"
              fontWeight="bold"
            >
              Slot #{s.nomorSlot}: {s.namaTarget} ➔ ({s.daftarPinSlotIni[0]?.labelPinEsp32})
            </text>
          </g>
        ))
      )}
    </svg>
  );
};

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const kanvasContainerRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [kategoriLevelAktif, setKategoriLevelAktif] =
    useState<KategoriKesulitanAcademy>("Semua");
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const [tampilModalTeori, setTampilModalTeori] = useState<boolean>(true);

  const [modeBelajar, setModeBelajar] = useState<
    "tutorial_berkedip" | "latihan_mandiri"
  >("tutorial_berkedip");

  const [filterKategoriGudang, setFilterKategoriGudang] =
    useState<KategoriFilterGudang48>("Semua");
  const [kataCariGudang, setKataCariGudang] = useState<string>("");

  const daftarKurikulumExtended =
    KURIKULUM_15_LEVEL_IOT as ExtendedLessonStepIoT[];
  const materiAktif: ExtendedLessonStepIoT =
    daftarKurikulumExtended[indeksLevel] || daftarKurikulumExtended[0];

  // Ambil Blueprint Multi-Komponen Independen (Bisa 1, 3, atau 4 Komponen Terpisah!)
  const blueprintLevelIni = ambilBlueprintMultiKomponen(materiAktif);
  const daftarSlotPeriferal = blueprintLevelIni.slotPeriferalList;
  const totalKomponenWajib = 1 + daftarSlotPeriferal.length; // 1 (ESP32) + N Periferal

  // Kumpulkan semua sambungan kabel wajib dari seluruh slot periferal
  const semuaSambunganWajibLevelIni = daftarSlotPeriferal.flatMap((slot) =>
    slot.daftarPinSlotIni.map((p) => ({
      nomorSlot: slot.nomorSlot,
      idPinPeriferal: p.idPin,
      labelPinPeriferal: p.labelPin,
      dariPinEsp32: p.targetPinEsp32,
      labelPinEsp32: p.labelPinEsp32,
      warnaKabel: p.warnaKabel,
      keteranganJalur: p.keteranganSambung,
      x: p.x,
      y: p.y,
    }))
  );

  const bersihkanKeHibahIlmu = (teks: string) =>
    (teks || "").replace(/Wokwi-GUEST/g, "HibahIlmu-Guest");

  // ==========================================================================
  // STATE PERAKITAN BERTAHAP PER SLOT (SETIAP SLOT INDEPENDEN!)
  // ==========================================================================
  const [slot1Esp32Terpasang, setSlot1Esp32Terpasang] =
    useState<boolean>(false);
  // Menyimpan status terpasang masing-masing slot periferal (Slot 2, Slot 3, Slot 4) secara terpisah!
  const [slotPeriferalTerpasangMap, setSlotPeriferalTerpasangMap] = useState<
    Record<number, { terpasang: boolean; namaKartu: string; idKartu: string }>
  >({});

  const [blynkVirtualV0, setBlynkVirtualV0] = useState<boolean>(true);
  const [itemSedangDiDrag, setItemSedangDiDrag] =
    useState<ItemGudang48Master | null>(null);
  const [pesanGudang, setPesanGudang] = useState<string>("");

  const [kabelTerpasangList, setKabelTerpasangList] = useState<
    KabelTersambung[]
  >([]);
  const [pinAwalDiklik, setPinAwalDiklik] = useState<TitikPinFisik | null>(
    null
  );
  const [posisiKursorSvg, setPosisiKursorSvg] = useState<{
    x: number;
    y: number;
  }>({ x: 280, y: 120 });

  const [fisika, setFisika] = useState<ParameterFisikaInteraktif>({
    pwmLedBrightness: 255,
    nilaiOhmResistor: 220,
    luxCahaya: 180,
    suhuCelcius: 36.5,
    jarakUltrasonikCm: 25,
    pirAdaOrang: true,
    rfidKartuDekat: true,
    kadarGasPpm: 680,
    apiTerdeteksi: true,
    rpmKipas: 1200,
    debitPompaAir: true,
    sudutServo: 90,
  });

  const [getarMerahRangkaian, setGetarMerahRangkaian] =
    useState<boolean>(false);
  const [getarMerahKodingan, setGetarMerahKodingan] = useState<boolean>(false);
  const [pinYangSalahAtauKurangIds, setPinYangSalahAtauKurangIds] = useState<
    string[]
  >([]);
  const [barisKodeSalahList, setBarisKodeSalahList] = useState<
    { nomorBaris: number; pesanBaris: string }[]
  >([]);

  const [jumlahClueDibuka, setJumlahClueDibuka] = useState<number>(0);
  const [intipBayanganSementara, setIntipBayanganSementara] =
    useState<boolean>(false);

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    bersihkanKeHibahIlmu(daftarKurikulumExtended[0].kodeTemplateAwal)
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// Rakit setiap komponen satu per satu ke slotnya di kanvas, sambungkan kaki pinnya, lalu jalankan program!"
  );

  const [detakSimulasi, setDetakSimulasi] = useState<number>(0);

  useEffect(() => {
    if (statusVerifikasi !== "lulus") return;
    const timer = setInterval(() => {
      setDetakSimulasi((d) => d + 1);
    }, 550);
    return () => clearInterval(timer);
  }, [statusVerifikasi]);

  const picuGetaranMerahRangkaian = () => {
    setGetarMerahRangkaian(false);
    setTimeout(() => setGetarMerahRangkaian(true), 20);
    setTimeout(() => setGetarMerahRangkaian(false), 900);
    kanvasContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const picuGetaranMerahKodingan = () => {
    setGetarMerahKodingan(false);
    setTimeout(() => setGetarMerahKodingan(true), 20);
    setTimeout(() => setGetarMerahKodingan(false), 900);
    editorContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const pindahKeLevel = (
    idxBaru: number,
    modeTarget: "tutorial_berkedip" | "latihan_mandiri" = modeBelajar,
    bukaPopUpTeori: boolean = true
  ) => {
    const target = daftarKurikulumExtended[idxBaru];
    if (!target) return;
    const bp = ambilBlueprintMultiKomponen(target);

    setIndeksLevel(idxBaru);
    setModeBelajar(modeTarget);
    setTampilModalTeori(bukaPopUpTeori);
    setSlot1Esp32Terpasang(false);
    setSlotPeriferalTerpasangMap({});
    setItemSedangDiDrag(null);
    setPesanGudang("");
    setKabelTerpasangList([]);
    setPinAwalDiklik(null);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setJumlahClueDibuka(0);
    setIntipBayanganSementara(false);
    setKodeKetikanUser(bersihkanKeHibahIlmu(target.kodeTemplateAwal));
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Level ${target.level}: Wajib menarik ${
        1 + bp.slotPeriferalList.length
      } komponen secara bertahap ke kanvas, lalu menyambungkan ${
        bp.slotPeriferalList.length
      } jalur kabelnya!`
    );
  };

  // Hitung berapa slot yang sudah dipasang oleh pengguna saat ini
  const jumlahPeriferalSudahTerpasang = daftarSlotPeriferal.filter(
    (s) => slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
  ).length;
  const jumlahKomponenTerpasangSaatIni =
    (slot1Esp32Terpasang ? 1 : 0) + jumlahPeriferalSudahTerpasang;

  const semuaKomponenSudahDitaruh =
    slot1Esp32Terpasang &&
    daftarSlotPeriferal.every(
      (s) => slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
    );

  // Cari slot periferal pertama yang masih kosong (untuk panduan berkedip bertahap)
  const slotPeriferalKosongBerikutnya =
    daftarSlotPeriferal.find(
      (s) => !slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
    ) || null;

  // Cari sambungan kabel wajib yang slotnya SUDAH terpasang tetapi kabelnya BELUM ditarik
  const sambunganWajibBelumTerpasang = semuaSambunganWajibLevelIni.filter(
    (wajib) =>
      !kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.idPinPeriferal
      )
  );

  const sambunganBerkedipTarget = sambunganWajibBelumTerpasang[0] || null;
  const tampilkanBayanganPanduan =
    modeBelajar === "tutorial_berkedip" || intipBayanganSementara;

  const daftarGudangTerfilter = GUDANG_KOMPONEN_48_MASTER.filter((item) => {
    const cocokKategori =
      filterKategoriGudang === "Semua" ||
      item.kategoriFilter === filterKategoriGudang;
    const kw = kataCariGudang.trim().toLowerCase();
    const cocokKata =
      !kw ||
      item.nama.toLowerCase().includes(kw) ||
      item.badgeAtas.toLowerCase().includes(kw);
    return cocokKategori && cocokKata;
  });

  // ==========================================================================
  // HANDLER DRAG & DROP SATU PER SATU KE MASING-MASING SLOT INDEPENDEN
  // ==========================================================================
  const handleDropKeSlotTertentu = (nomorSlotTarget: number) => {
    if (!itemSedangDiDrag) return;

    // SLOT 1: WAJIB PAPAN MIKROKONTROLER ESP32
    if (nomorSlotTarget === 1) {
      if (itemSedangDiDrag.cocokUntukDropZone === "esp32_board") {
        setSlot1Esp32Terpasang(true);
        setPinYangSalahAtauKurangIds([]);
        const nextSlot = daftarSlotPeriferal[0];
        setPesanGudang(
          nextSlot
            ? `✅ Komponen 1/${totalKomponenWajib} ('${itemSedangDiDrag.nama}') terpasang di Slot #1! Sekarang tarik '${nextSlot.namaTarget}' dari Gudang ke Slot #2!`
            : `✅ '${itemSedangDiDrag.nama}' terpasang di Slot #1! Silakan ketik kode C++ di bawah.`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          `❌ Salah Komponen! Slot #1 (Kiri) khusus untuk papan 'ESP32 DevKit V1', bukan '${itemSedangDiDrag.nama}'.`
        );
      }
      setItemSedangDiDrag(null);
      return;
    }

    // SLOT 2, 3, ATAU 4: PERIKSA APAKAH KOMPONEN COCOK DENGAN SLOT TERSEBUT
    const defSlot = daftarSlotPeriferal.find(
      (s) => s.nomorSlot === nomorSlotTarget
    );
    if (!defSlot) return;

    const teksKartu = `${itemSedangDiDrag.id} ${itemSedangDiDrag.nama} ${itemSedangDiDrag.badgeAtas}`.toLowerCase();
    const apakahCocokSlotIni =
      itemSedangDiDrag.cocokUntukDropZone !== "esp32_board" &&
      (defSlot.kataKunciCocokGudang.some((kw) => teksKartu.includes(kw)) ||
        itemSedangDiDrag.levelTerkait.includes(materiAktif.level));

    if (apakahCocokSlotIni) {
      // HANYA ISI SLOT INI SAJA (TIDAK MENGISI SLOT LAIN SECARA OTOMATIS!)
      setSlotPeriferalTerpasangMap((prev) => ({
        ...prev,
        [nomorSlotTarget]: {
          terpasang: true,
          namaKartu: itemSedangDiDrag.nama,
          idKartu: itemSedangDiDrag.id,
        },
      }));
      setPinYangSalahAtauKurangIds([]);

      const sisaSlotKosong = daftarSlotPeriferal.filter(
        (s) =>
          s.nomorSlot !== nomorSlotTarget &&
          !slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
      );

      if (sisaSlotKosong.length > 0) {
        setPesanGudang(
          `✅ Slot #${nomorSlotTarget} ('${itemSedangDiDrag.nama}') berhasil dipasang! Masih ada ${sisaSlotKosong.length} komponen lagi: sekarang tarik '${sisaSlotKosong[0].namaTarget}' ke Slot #${sisaSlotKosong[0].nomorSlot}!`
        );
      } else if (!slot1Esp32Terpasang) {
        setPesanGudang(
          `✅ Slot #${nomorSlotTarget} terpasang! Jangan lupa tarik 'ESP32 DevKit V1' ke Slot #1 (Kiri)!`
        );
      } else {
        setPesanGudang(
          `🎉 Seluruh ${totalKomponenWajib} Komponen berhasil dirakit! Sekarang klik titik kaki pin yang berkedip untuk memasang ${semuaSambunganWajibLevelIni.length} jalur kabel!`
        );
      }
    } else {
      picuGetaranMerahRangkaian();
      setPesanGudang(
        `❌ Belum Tepat! Slot #${nomorSlotTarget} membutuhkan '${defSlot.namaTarget}', sedangkan kamu menarik '${itemSedangDiDrag.nama}'.`
      );
    }

    setItemSedangDiDrag(null);
  };

  const handleKlikKartuGudang = (item: ItemGudang48Master) => {
    setItemSedangDiDrag(item);
    if (item.cocokUntukDropZone === "esp32_board") {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Sekarang Drop atau KLIK kotak [Slot #1: ESP32 DevKit V1] di sebelah kiri kanvas.`
      );
    } else {
      const slotTarget =
        slotPeriferalKosongBerikutnya || daftarSlotPeriferal[0];
      setPesanGudang(
        slotTarget
          ? `👉 '${item.nama}' dipilih! Sekarang Drop atau KLIK kotak [Slot #${slotTarget.nomorSlot}: ${slotTarget.namaTarget}] di sebelah kanan kanvas.`
          : `👉 '${item.nama}' dipilih! Klik slot tujuan di kanvas.`
      );
    }
  };

  // ==========================================================================
  // HANDLER KLIK 2 TITIK KAKI PIN SECARA BERURUTAN
  // ==========================================================================
  const handleMouseMoveSvg = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pinAwalDiklik || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 580 / rect.width;
    const scaleY = 250 / rect.height;
    setPosisiKursorSvg({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  const handleKlikTitikPinFisik = (
    e: React.MouseEvent,
    pinDiklik: TitikPinFisik
  ) => {
    e.stopPropagation();

    if (daftarSlotPeriferal.length === 0) {
      setPesanGudang(
        `💡 Level ${materiAktif.level} hanya menggunakan 1 papan ESP32 saja, tidak perlu menarik kabel keluar!`
      );
      return;
    }

    if (!semuaKomponenSudahDitaruh) {
      picuGetaranMerahRangkaian();
      setPesanGudang(
        `⚠️ Kamu baru memasang ${jumlahKomponenTerpasangSaatIni} dari ${totalKomponenWajib} komponen! Tarik dulu semua komponen ke Slot #1 s.d. Slot #${totalKomponenWajib} sebelum menyambung kabel!`
      );
      return;
    }

    if (!pinAwalDiklik) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 [${pinDiklik.labelPin}] terpegang! Sekarang arahkan kabel dan KLIK titik kaki pin ke-2 pada komponen pasangannya!`
      );
      return;
    }

    if (pinAwalDiklik.idPin === pinDiklik.idPin) {
      setPinAwalDiklik(null);
      setPesanGudang("Tarikan kabel dibatalkan.");
      return;
    }

    if (pinAwalDiklik.posisiKomponen === pinDiklik.posisiKomponen) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 dipindahkan ke [${pinDiklik.labelPin}]. Sekarang klik titik kaki pin pada komponen seberangnya!`
      );
      return;
    }

    const idEsp =
      pinAwalDiklik.posisiKomponen === "esp32"
        ? pinAwalDiklik.idPin
        : pinDiklik.idPin;
    const idPerif =
      pinAwalDiklik.posisiKomponen === "periferal"
        ? pinAwalDiklik.idPin
        : pinDiklik.idPin;

    const cocokWajib = semuaSambunganWajibLevelIni.find(
      (w) => w.dariPinEsp32 === idEsp && w.idPinPeriferal === idPerif
    );
    const warnaKabelBaru = cocokWajib?.warnaKabel || "#ef4444";

    setKabelTerpasangList((prev) => {
      const bersih = prev.filter(
        (k) => !(k.dariPinEsp32 === idEsp && k.kePinPeriferal === idPerif)
      );
      return [
        ...bersih,
        { dariPinEsp32: idEsp, kePinPeriferal: idPerif, warna: warnaKabelBaru },
      ];
    });

    setPinAwalDiklik(null);
    setPinYangSalahAtauKurangIds([]);
    setStatusVerifikasi("belum");

    if (!cocokWajib) {
      picuGetaranMerahRangkaian();
      setPinYangSalahAtauKurangIds([idEsp, idPerif]);
      setPesanGudang(
        `❌ Salah Alamat Pin! Sambungan dari ${pinAwalDiklik.labelPin} ke ${pinDiklik.labelPin} tidak sesuai petunjuk. Lepas kabel merah tersebut!`
      );
    } else {
      setPesanGudang(`✅ Kabel Tersambung: ${cocokWajib.keteranganJalur}!`);
    }
  };

  // ==========================================================================
  // MESIN VALIDASI KETAT: CEK SETIAP SLOT SATU PER SATU + KABEL + KODE C++
  // ==========================================================================
  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];
    const pinBermasalah: string[] = [];
    const barisBermasalah: { nomorBaris: number; pesanBaris: string }[] = [];

    if (!slot1Esp32Terpasang) {
      errors.push(
        "[SLOT #1 KOSONG] Kamu belum menarik 'ESP32 DevKit V1' ke kotak Slot #1 (Kiri)!"
      );
    }

    for (const slot of daftarSlotPeriferal) {
      if (!slotPeriferalTerpasangMap[slot.nomorSlot]?.terpasang) {
        errors.push(
          `[SLOT #${slot.nomorSlot} KOSONG] Kamu belum menarik '${slot.namaTarget}' dari Gudang Komponen ke kotak Slot #${slot.nomorSlot} (Kanan)!`
        );
      }
    }

    for (const wajib of semuaSambunganWajibLevelIni) {
      const sudahAda = kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.idPinPeriferal
      );
      if (!sudahAda) {
        errors.push(
          `[KABEL SLOT #${wajib.nomorSlot} BELUM DISAMBUNG] ${wajib.keteranganJalur}.`
        );
        pinBermasalah.push(wajib.dariPinEsp32, wajib.idPinPeriferal);
      }
    }

    for (const terpasang of kabelTerpasangList) {
      const valid = semuaSambunganWajibLevelIni.some(
        (w) =>
          w.dariPinEsp32 === terpasang.dariPinEsp32 &&
          w.idPinPeriferal === terpasang.kePinPeriferal
      );
      if (!valid) {
        errors.push(
          `[KABEL SALAH PASANG] Ada kabel merah putus-putus yang salah sambung! Klik tanda ✕ untuk melepasnya.`
        );
        pinBermasalah.push(terpasang.dariPinEsp32, terpasang.kePinPeriferal);
      }
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds(pinBermasalah);
      setBarisKodeSalahList([]);
      picuGetaranMerahRangkaian();
      setPesanFeedback(
        `🚨 Rangkaian Belum Lengkap (${errors.length} Masalah): Pastikan seluruh ${totalKomponenWajib} komponen sudah ditarik satu per satu dan semua kaki pin sudah dihubungkan!`
      );
      setOutputSerialSimulasi(
        `[HARDWARE & WIRING CHECK FAILED]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    const barisArray = kodeKetikanUser.split("\n");
    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    barisArray.forEach((isiBaris, idx) => {
      const nomor = idx + 1;
      const tanpaKomen = isiBaris.replace(/\/\/.*$/, "").trim();
      if (!tanpaKomen) return;
      const adalahBarisPerintah =
        /^(pinMode|digitalWrite|analogRead|analogWrite|attachInterrupt|timerBegin|timerAttachInterrupt|timerAlarm|delay|Serial\.|pintu\.|int\s+|float\s+|double\s+|WiFi\.|server\.|Blynk\.|esp_now_)/.test(
          tanpaKomen
        );
      if (adalahBarisPerintah && !tanpaKomen.endsWith(";")) {
        const msg = `Baris ke-${nomor}: Kurang tanda titik koma (;) di akhir perintah "${tanpaKomen}"`;
        errors.push(msg);
        barisBermasalah.push({ nomorBaris: nomor, pesanBaris: msg });
      }
    });

    if (!/void\s+setup\s*\(\s*\)/.test(kodeBersih)) {
      const msg = "Baris ke-1: Fungsi utama 'void setup()' hilang atau terhapus!";
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: 1, pesanBaris: msg });
    }
    if (!/void\s+loop\s*\(\s*\)/.test(kodeBersih)) {
      const msg = `Baris ke-${barisArray.length}: Fungsi utama 'void loop()' hilang atau terhapus!`;
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: barisArray.length, pesanBaris: msg });
    }

    const kurangKw = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeBersih.includes(kw)
    );
    if (kurangKw.length > 0) {
      const idxKomentarPetunjuk = barisArray.findIndex((b) =>
        b.includes("//")
      );
      const targetBaris =
        idxKomentarPetunjuk >= 0 ? idxKomentarPetunjuk + 2 : 4;
      const msg = `Sekitar Baris ke-${targetBaris}: Kamu belum mengetik perintah wajib: ${kurangKw
        .map((k) => `"${k}"`)
        .join(", ")}`;
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: targetBaris, pesanBaris: msg });
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds([]);
      setBarisKodeSalahList(barisBermasalah);
      picuGetaranMerahKodingan();
      setPesanFeedback(
        `🚨 Kodingan C++ Masih Salah (${errors.length} Error): Rangkaian ${totalKomponenWajib} komponenmu sudah benar, tetapi perhatikan baris merah di Editor Kode!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setPesanFeedback(
      `🎉 100% SEMPURNA! Seluruh ${totalKomponenWajib} komponen, sambungan kabel, dan kodingan C++ Level ${materiAktif.level} berhasil dijalankan (+${materiAktif.xpReward} XP)!`
    );
    setOutputSerialSimulasi(
      bersihkanKeHibahIlmu(materiAktif.simulasiOutputJikaBenar)
    );

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  const simulasiAktif = statusVerifikasi === "lulus";
  const sudahLulusLevelIni =
    statusVerifikasi === "lulus" || levelSelesaiSet.has(materiAktif.level);

  const pinEspBerkedipObj = sambunganBerkedipTarget
    ? PIN_FISIK_ESP32_STANDAR.find(
        (p) => p.idPin === sambunganBerkedipTarget.dariPinEsp32
      )
    : null;

  const daftarBarisEditor = kodeKetikanUser.split("\n");
  const infoResistor = hitungGelangResistorLokal(fisika.nilaiOhmResistor);

  const daftarLevelSesuaiKategori = daftarKurikulumExtended
    .map((item, originalIdx) => ({ item, originalIdx }))
    .filter(
      ({ item }) =>
        kategoriLevelAktif === "Semua" ||
        dapatkanBabDariLevel(item) === kategoriLevelAktif
    );

  return (
    <div className="bg-slate-900 text-slate-100 p-5 sm:p-7 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 font-sans">
      <style>{`
        @keyframes errorShakeRed {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-10px); }
          30%, 60%, 90% { transform: translateX(10px); }
        }
        .animate-error-shake {
          animation: errorShakeRed 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          box-shadow: 0 0 35px rgba(244, 63, 94, 0.85) !important;
          border-color: #f43f5e !important;
        }
      `}</style>

      {/* =================================================================== */}
      {/* POP-UP MODAL DASAR TEORI BERANIMASI (BAHASA MUDAH DIMENGERTI)       */}
      {/* Ketika di-close, seluruh isinya tetap tampil permanen di Panel Kiri */}
      {/* =================================================================== */}
      {tampilModalTeori && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-400/90 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs">
                    PANDUAN AWAL • LEVEL {materiAktif.level}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold text-xs">
                    Wajib Merakit {totalKomponenWajib} Komponen Bertahap
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  {materiAktif.judulMateri}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTampilModalTeori(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagram Animasi Visual */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Gambaran Animasi Rangkaian yang Akan Kamu Buat:
              </div>
              <AnimasiVisualDasarTeoriModal
                blueprint={blueprintLevelIni}
                totalKomponen={totalKomponenWajib}
              />
            </div>

            {/* Analogi Bahasa Sehari-hari yang Sangat Mudah Dimengerti */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-3 text-sm leading-relaxed">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Pahami dengan Bahasa Sederhana (Analogi):
              </div>
              <p className="text-slate-200">{blueprintLevelIni.analogiMudahPaham}</p>
              <p className="text-slate-300 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong className="text-sky-300">📖 Dasar Teori Teknis:</strong>{" "}
                {bersihkanKeHibahIlmu(materiAktif.penjelasanTeoriSingkat)}
              </p>
            </div>

            {/* Urutan Langkah Pengerjaan Step-by-Step */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-sky-300 uppercase">
                🛠️ Apa Saja yang Harus Kamu Lakukan Sebentar Lagi? ({totalKomponenWajib} Komponen):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/50 flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                    Slot #1
                  </span>
                  <div>
                    <div className="font-bold text-white">ESP32 DevKit V1 (30P)</div>
                    <div className="text-slate-400">
                      Tarik dari Gudang ke kotak kiri kanvas.
                    </div>
                  </div>
                </div>

                {daftarSlotPeriferal.map((s) => (
                  <div
                    key={s.nomorSlot}
                    className="p-3 rounded-xl bg-slate-950 border border-sky-400/50 flex items-start gap-2.5"
                  >
                    <span className="px-2 py-0.5 rounded bg-sky-400 text-slate-950 font-black">
                      Slot #{s.nomorSlot}
                    </span>
                    <div>
                      <div className="font-bold text-white">{s.namaTarget}</div>
                      <div className="text-amber-300 font-mono text-[11px]">
                        {s.daftarPinSlotIni[0]?.keteranganSambung}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
              <span className="text-xs text-slate-400">
                💡 Tenang! Saat pop-up ini ditutup, semua panduan ini tetap ada di sebelah kiri layar.
              </span>
              <button
                type="button"
                onClick={() => setTampilModalTeori(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Check className="w-5 h-5 stroke-[2.5]" /> Siap Mengerti! Mulai Merakit ({totalKomponenWajib} Komponen)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SILABUS */}
      <div className="space-y-4 border-b border-slate-800 pb-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs">
                🎓 Akademi IoT HibahIlmu ({daftarKurikulumExtended.length} Level)
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 font-semibold text-xs">
                Rakit Bertahap: {jumlahKomponenTerpasangSaatIni} / {totalKomponenWajib} Komponen Terpasang
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-semibold text-xs">
                Kabel: {kabelTerpasangList.length} / {semuaSambunganWajibLevelIni.length} Tersambung
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Level {materiAktif.level}: {materiAktif.judulMateri}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTampilModalTeori(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4" /> 📖 Buka Pop-Up Teori &amp; Animasi
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setModeBelajar("tutorial_berkedip");
                  setIntipBayanganSementara(false);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
                  modeBelajar === "tutorial_berkedip"
                    ? "bg-amber-400 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Mode Terpandu
              </button>

              <button
                type="button"
                onClick={() => {
                  setModeBelajar("latihan_mandiri");
                  setIntipBayanganSementara(false);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
                  modeBelajar === "latihan_mandiri"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Latihan Mandiri
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DAFTAR_BAB_SILABUS.map((bab) => {
            const aktif = kategoriLevelAktif === bab.id;
            return (
              <button
                key={bab.id}
                type="button"
                onClick={() => {
                  setKategoriLevelAktif(bab.id);
                  const pertama = daftarKurikulumExtended.findIndex(
                    (x) =>
                      bab.id === "Semua" ||
                      dapatkanBabDariLevel(x) === bab.id
                  );
                  if (pertama >= 0) pindahKeLevel(pertama);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-2 border ${
                  aktif
                    ? `${bab.warna} border-white/80 shadow-md`
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                }`}
              >
                <span>{bab.label}</span>
                <span className="px-2 py-0.5 rounded-md bg-black/25 text-[11px]">
                  {bab.rentang}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          {daftarLevelSesuaiKategori.map(({ item, originalIdx }) => {
            const sedangDibuka = originalIdx === indeksLevel;
            const lulus = levelSelesaiSet.has(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => pindahKeLevel(originalIdx, modeBelajar, true)}
                className={`px-3.5 py-2 rounded-xl text-xs cursor-pointer transition flex items-center gap-1.5 border ${
                  sedangDibuka
                    ? "bg-amber-400 text-slate-950 font-extrabold border-white shadow-md scale-[1.02]"
                    : lulus
                    ? "bg-emerald-600 text-white font-bold border-emerald-400"
                    : "bg-slate-900 text-slate-200 font-medium border-slate-800 hover:border-slate-600"
                }`}
              >
                {lulus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                <span>Level {item.level}:</span>
                <span className="max-w-[165px] truncate">
                  {item.judulMateri.split("(")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GUDANG KOMPONEN (48 ITEM) */}
      <div className="bg-[#0b101e] p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">
              Gudang Komponen (Tarik Satu per Satu ke Slot #1 s.d. Slot #{totalKomponenWajib} di Bawah):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari ESP32, LED, Resistor, NPK, Pompa..."
                value={kataCariGudang}
                onChange={(e) => setKataCariGudang(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSlot1Esp32Terpasang(false);
                setSlotPeriferalTerpasangMap({});
                setKabelTerpasangList([]);
                setPinAwalDiklik(null);
                setPinYangSalahAtauKurangIds([]);
                setStatusVerifikasi("belum");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Bersihkan Kanvas
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400 mr-1" />
          {DAFTAR_TAB_FILTER_GUDANG.map((kat) => {
            const aktif = filterKategoriGudang === kat;
            return (
              <button
                key={kat}
                type="button"
                onClick={() => setFilterKategoriGudang(kat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  aktif
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {kat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-56 overflow-y-auto pr-1 pt-1">
          {daftarGudangTerfilter.map((item) => {
            const teksItem = `${item.id} ${item.nama}`.toLowerCase();
            const sorotUntukSlot1 =
              !slot1Esp32Terpasang &&
              item.cocokUntukDropZone === "esp32_board";
            const sorotUntukSlotBerikutnya =
              slot1Esp32Terpasang &&
              slotPeriferalKosongBerikutnya &&
              slotPeriferalKosongBerikutnya.kataKunciCocokGudang.some((kw) =>
                teksItem.includes(kw)
              );

            const harusDisorotBerkedip =
              tampilkanBayanganPanduan &&
              (sorotUntukSlot1 || sorotUntukSlotBerikutnya);

            const sedangTerpilihDrag = itemSedangDiDrag?.id === item.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => {
                  setItemSedangDiDrag(item);
                  setPesanGudang(
                    `📦 Menarik '${item.nama}'... Jatuhkan tepat ke kotak Slot yang sesuai di kanvas bawah!`
                  );
                }}
                onClick={() => handleKlikKartuGudang(item)}
                className={`p-2.5 rounded-2xl border-2 select-none transition flex flex-col justify-between gap-1.5 cursor-grab active:cursor-grabbing ${
                  sedangTerpilihDrag
                    ? "bg-amber-400/20 border-amber-300 scale-105 shadow-xl"
                    : harusDisorotBerkedip
                    ? "bg-[#111827] border-amber-400 ring-2 ring-amber-400/60 animate-pulse"
                    : "bg-[#111827] border-slate-800 hover:border-indigo-500/60"
                }`}
              >
                <div className="flex justify-between items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-md">
                  <span className="text-[9px] font-bold text-indigo-300 truncate">
                    {item.badgeAtas}
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 shrink-0">
                    {item.jumlahPinLabel}
                  </span>
                </div>

                <div className="py-0.5">
                  <MiniaturSvgGudang48
                    idItem={item.id}
                    namaItem={item.nama}
                    nilaiOhmResistor={fisika.nilaiOhmResistor}
                  />
                </div>

                <div className="text-[11px] font-semibold text-slate-100 leading-tight truncate text-center">
                  {item.id === "resistor_gelang"
                    ? `Resistor ${infoResistor.labelFormatted}`
                    : item.nama}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MEJA KANVAS MULTI-SLOT BERTAHAP (TIAP SLOT DITAMPILKAN MANDIRI!)    */}
      {/* =================================================================== */}
      <div
        ref={kanvasContainerRef}
        className={`bg-[#090d16] rounded-3xl border-2 p-4 relative overflow-hidden shadow-2xl transition ${
          getarMerahRangkaian
            ? "animate-error-shake border-rose-500 bg-rose-950/20"
            : statusVerifikasi === "gagal_rangkaian"
            ? "border-rose-500"
            : simulasiAktif
            ? "border-emerald-400"
            : "border-slate-800"
        }`}
      >
        {/* Baris Indikator Semua Slot (1, 2, 3, atau 4 Slot Sesuai Modul!) */}
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {/* Indikator Slot #1: Selalu ESP32 */}
          <div
            onClick={() => {
              if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
            }}
            className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
              slot1Esp32Terpasang
                ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                : "bg-amber-950/40 border-amber-400 text-amber-200 animate-pulse"
            }`}
          >
            <span className="truncate">Slot #1: ESP32 DevKit V1</span>
            <span className="shrink-0 ml-1">
              {slot1Esp32Terpasang ? "✓ Terpasang" : "📦 Tarik ke Sini"}
            </span>
          </div>

          {/* Indikator Slot #2, #3, #4 secara Independen */}
          {daftarSlotPeriferal.map((slot) => {
            const sudah = slotPeriferalTerpasangMap[slot.nomorSlot]?.terpasang;
            return (
              <div
                key={slot.nomorSlot}
                onClick={() => {
                  if (itemSedangDiDrag)
                    handleDropKeSlotTertentu(slot.nomorSlot);
                }}
                className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
                  sudah
                    ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                    : "bg-sky-950/40 border-sky-400 text-sky-200 animate-pulse"
                }`}
              >
                <span className="truncate">
                  Slot #{slot.nomorSlot}: {slot.namaTarget}
                </span>
                <span className="shrink-0 ml-1">
                  {sudah ? "✓ Terpasang" : "📦 Tarik ke Sini"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Banner Panduan Langkah Saat Ini */}
        <div className="mb-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-300 flex justify-between items-center">
          <span>
            {pesanGudang ||
              (!slot1Esp32Terpasang
                ? `👉 Langkah 1/${totalKomponenWajib}: Tarik 'ESP32 DevKit V1' dari Gudang ke kotak [Slot #1] di sebelah kiri!`
                : slotPeriferalKosongBerikutnya
                ? `👉 Langkah Berikutnya: Tarik '${slotPeriferalKosongBerikutnya.namaTarget}' dari Gudang ke kotak [Slot #${slotPeriferalKosongBerikutnya.nomorSlot}] di sebelah kanan!`
                : sambunganBerkedipTarget
                ? `🔌 Sekarang Pasang Kabel: ${sambunganBerkedipTarget.keteranganJalur}!`
                : `✅ Seluruh ${totalKomponenWajib} Komponen & ${semuaSambunganWajibLevelIni.length} Kabel Lengkap! Ketik kode C++ di bawah.`)}
          </span>
          {kabelTerpasangList.length > 0 && (
            <button
              type="button"
              onClick={() => setKabelTerpasangList([])}
              className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3 h-3" /> Lepas Kabel
            </button>
          )}
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 580 250"
          onMouseMove={handleMouseMoveSvg}
          onClick={() => {
            if (pinAwalDiklik) setPinAwalDiklik(null);
          }}
          className="w-full h-64 sm:h-76 select-none"
        >
          {Array.from({ length: 21 }).map((_, gx) =>
            Array.from({ length: 9 }).map((__, gy) => (
              <circle
                key={`${gx}-${gy}`}
                cx={18 + gx * 27}
                cy={18 + gy * 27}
                r={1.6}
                fill="#1e293b"
              />
            ))
          )}

          {/* =============================================================== */}
          {/* SLOT #1 (KIRI): PAPAN MIKROKONTROLER ESP32                      */}
          {/* =============================================================== */}
          {!slot1Esp32Terpasang ? (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeSlotTertentu(1);
              }}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
                else setSlot1Esp32Terpasang(true);
              }}
              className="cursor-pointer"
            >
              <rect
                x={42}
                y={24}
                width={136}
                height={204}
                rx={14}
                fill="rgba(250, 204, 21, 0.08)"
                stroke="#facc15"
                strokeWidth={2.5}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={110}
                y={108}
                textAnchor="middle"
                fill="#facc15"
                fontSize="10"
                fontWeight="bold"
              >
                📦 SLOT #1 (MCU):
              </text>
              <text
                x={110}
                y={126}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10.5"
                fontWeight="bold"
              >
                ESP32 DevKit V1
              </text>
              <text
                x={110}
                y={144}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8.5"
              >
                (Drop ESP32 ke Sini)
              </text>
            </g>
          ) : (
            <g>
              <rect
                x={50}
                y={24}
                width={120}
                height={204}
                rx={10}
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth={2}
              />
              <rect
                x={74}
                y={34}
                width={72}
                height={50}
                rx={5}
                fill="#cbd5e1"
                stroke="#475569"
              />
              <text
                x={110}
                y={58}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="8.5"
                fontWeight="bold"
              >
                ESP-WROOM-32
              </text>

              <circle cx={92} cy={196} r={4} fill="#ef4444" />
              <circle
                cx={126}
                cy={196}
                r={5.5}
                fill={
                  (simulasiAktif || daftarSlotPeriferal.length === 0) &&
                  detakSimulasi % 2 === 0 &&
                  blynkVirtualV0
                    ? "#38bdf8"
                    : "#1e3a8a"
                }
                stroke="#ffffff"
                strokeWidth={1.2}
              />
              <rect
                x={92}
                y={214}
                width={36}
                height={14}
                rx={3}
                fill="#94a3b8"
              />

              {PIN_FISIK_ESP32_STANDAR.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  semuaKomponenSudahDitaruh &&
                  pinEspBerkedipObj?.idPin === pin.idPin;
                const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                  pin.idPin
                );
                const isKanan = pin.x > 110;

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={15}
                        fill="rgba(244, 63, 94, 0.35)"
                        stroke="#f43f5e"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="7;17;7"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {harusBerkedip && !adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={13}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="6;15;6"
                          dur="0.85s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <rect
                      x={isKanan ? pin.x - 54 : pin.x + 9}
                      y={pin.y - 7}
                      width={45}
                      height={14}
                      rx={3}
                      fill={
                        adalahPinSalah
                          ? "#e11d48"
                          : harusBerkedip
                          ? "#facc15"
                          : "#0f172a"
                      }
                      opacity={0.95}
                    />
                    <text
                      x={isKanan ? pin.x - 31 : pin.x + 31}
                      y={pin.y + 3}
                      textAnchor="middle"
                      fill={
                        adalahPinSalah
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#0f172a"
                          : "#f8fafc"
                      }
                      fontSize="7.5"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang || adalahPinSalah ? 8.5 : 6}
                      fill={
                        adalahPinSalah
                          ? "#f43f5e"
                          : sedangDipegang
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#facc15"
                          : pin.warnaPin
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* VISUAL KHUSUS STANDALONE 1-ESP32 */}
          {daftarSlotPeriferal.length === 0 && slot1Esp32Terpasang && (
            <g>
              <path
                d="M 135 196 C 210 196, 230 125, 295 125"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="5 4"
              />
              <rect
                x={295}
                y={32}
                width={255}
                height={186}
                rx={16}
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth={2.5}
              />
              <text
                x={422}
                y={58}
                textAnchor="middle"
                fill="#facc15"
                fontSize="10.5"
                fontWeight="bold"
              >
                📡 STANDALONE ESP32 — HIBAHILMU-GUEST
              </text>
              <circle
                cx={422}
                cy={115}
                r={28}
                fill={
                  simulasiAktif && detakSimulasi % 2 === 0
                    ? "#38bdf8"
                    : "#1e3a8a"
                }
                stroke="#ffffff"
                strokeWidth={2.5}
              />
              <text
                x={422}
                y={165}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                {simulasiAktif
                  ? detakSimulasi % 2 === 0
                    ? "💡 LED Internal GPIO 2: HIGH (3.3V)"
                    : "⚫ LED Internal GPIO 2: LOW (0V)"
                  : "Ketik Kode & Klik Jalankan Program!"}
              </text>
            </g>
          )}

          {/* =============================================================== */}
          {/* RENDER TIAP SLOT PERIFERAL SECARA MANDIRI (SLOT #2, #3, #4)     */}
          {/* HANYA SLOT YANG SUDAH DITARIK YANG MUNCUL GAMBAR & PINNYA!      */}
          {/* =============================================================== */}
          {daftarSlotPeriferal.map((slot) => {
            const infoTerpasang = slotPeriferalTerpasangMap[slot.nomorSlot];
            const sudahTerpasang = Boolean(infoTerpasang?.terpasang);

            if (!sudahTerpasang) {
              // Tampilkan Kotak Bayangan Kosong untuk Slot Ini
              return (
                <g
                  key={slot.nomorSlot}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropKeSlotTertentu(slot.nomorSlot);
                  }}
                  onClick={() => {
                    if (itemSedangDiDrag)
                      handleDropKeSlotTertentu(slot.nomorSlot);
                    else
                      setPesanGudang(
                        `👆 Tarik (Drag) kartu '${slot.namaTarget}' dari Gudang Komponen di atas ke kotak Slot #${slot.nomorSlot} ini!`
                      );
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={slot.boxX}
                    y={slot.boxY}
                    width={slot.boxW}
                    height={slot.boxH}
                    rx={12}
                    fill="rgba(56, 189, 248, 0.07)"
                    stroke={
                      slotPeriferalKosongBerikutnya?.nomorSlot ===
                      slot.nomorSlot
                        ? "#facc15"
                        : "#38bdf8"
                    }
                    strokeWidth={2}
                    strokeDasharray="7 5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;1;0.4"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <text
                    x={slot.boxX + slot.boxW / 2}
                    y={slot.boxY + slot.boxH / 2 - 6}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    📦 SLOT #{slot.nomorSlot} (BELUM DITARIK):
                  </text>
                  <text
                    x={slot.boxX + slot.boxW / 2}
                    y={slot.boxY + slot.boxH / 2 + 11}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    {slot.namaTarget}
                  </text>
                </g>
              );
            }

            // Jika Slot Ini SUDAH Ditarik -> Gambar Komponen Spesifik Slot Ini + Titik Kaki Pinnya!
            return (
              <g key={slot.nomorSlot}>
                <rect
                  x={slot.boxX}
                  y={slot.boxY}
                  width={slot.boxW}
                  height={slot.boxH}
                  rx={12}
                  fill={simulasiAktif ? "#064e3b" : "#111827"}
                  stroke={simulasiAktif ? "#34d399" : "#475569"}
                  strokeWidth={2}
                />

                {/* Render Ikon SVG Komponen yang Ditarik di Dalam Kotak Slot */}
                <svg
                  x={slot.boxX + 18}
                  y={slot.boxY + 6}
                  width={68}
                  height={slot.boxH - 12}
                  viewBox="0 0 64 56"
                >
                  <MiniaturSvgGudang48
                    idItem={infoTerpasang.idKartu || slot.idGambarMiniatur}
                    namaItem={infoTerpasang.namaKartu || slot.namaTarget}
                    nilaiOhmResistor={fisika.nilaiOhmResistor}
                  />
                </svg>

                {/* Nama & Status Komponen di Slot Ini */}
                <text
                  x={slot.boxX + 92}
                  y={slot.boxY + slot.boxH / 2 - 4}
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {infoTerpasang.namaKartu || slot.namaTarget}
                </text>
                <text
                  x={slot.boxX + 92}
                  y={slot.boxY + slot.boxH / 2 + 12}
                  fill={simulasiAktif ? "#fde047" : "#34d399"}
                  fontSize="8.5"
                  fontWeight="bold"
                >
                  {simulasiAktif
                    ? "⚡ AKTIF BERJALAN!"
                    : `✓ Slot #${slot.nomorSlot} Siap Disambung`}
                </text>

                {/* Titik Kaki Pin Milik Slot Ini */}
                {slot.daftarPinSlotIni.map((pin) => {
                  const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                  const harusBerkedip =
                    tampilkanBayanganPanduan &&
                    semuaKomponenSudahDitaruh &&
                    sambunganBerkedipTarget?.idPinPeriferal === pin.idPin;
                  const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                    pin.idPin
                  );

                  return (
                    <g
                      key={pin.idPin}
                      onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                      className="cursor-pointer"
                    >
                      {adalahPinSalah && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={15}
                          fill="rgba(244, 63, 94, 0.35)"
                          stroke="#f43f5e"
                          strokeWidth={3}
                        >
                          <animate
                            attributeName="r"
                            values="7;17;7"
                            dur="0.6s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      {harusBerkedip && !adalahPinSalah && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={14}
                          fill="none"
                          stroke="#facc15"
                          strokeWidth={3}
                        >
                          <animate
                            attributeName="r"
                            values="6;15;6"
                            dur="0.85s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <rect
                        x={pin.x - 82}
                        y={pin.y - 8}
                        width={74}
                        height={15}
                        rx={3}
                        fill={
                          adalahPinSalah
                            ? "#e11d48"
                            : harusBerkedip
                            ? "#facc15"
                            : "#0f172a"
                        }
                        stroke="#334155"
                        opacity={0.95}
                      />
                      <text
                        x={pin.x - 45}
                        y={pin.y + 2.5}
                        textAnchor="middle"
                        fill={
                          adalahPinSalah
                            ? "#ffffff"
                            : harusBerkedip
                            ? "#0f172a"
                            : "#f8fafc"
                        }
                        fontSize="7.5"
                        fontWeight="bold"
                      >
                        {pin.labelPin}
                      </text>
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={sedangDipegang || adalahPinSalah ? 8.5 : 6.5}
                        fill={
                          adalahPinSalah
                            ? "#f43f5e"
                            : sedangDipegang
                            ? "#ffffff"
                            : harusBerkedip
                            ? "#facc15"
                            : pin.warnaPin
                        }
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* GARIS BAYANGAN PANDUAN TARIK KABEL */}
          {semuaKomponenSudahDitaruh &&
            tampilkanBayanganPanduan &&
            pinEspBerkedipObj &&
            sambunganBerkedipTarget && (
              <path
                pointerEvents="none"
                d={`M ${pinEspBerkedipObj.x} ${pinEspBerkedipObj.y} C ${
                  (pinEspBerkedipObj.x + sambunganBerkedipTarget.x) / 2
                } ${pinEspBerkedipObj.y - 20}, ${
                  (pinEspBerkedipObj.x + sambunganBerkedipTarget.x) / 2
                } ${sambunganBerkedipTarget.y + 20}, ${
                  sambunganBerkedipTarget.x
                } ${sambunganBerkedipTarget.y}`}
                fill="none"
                stroke="#facc15"
                strokeWidth={3.5}
                strokeDasharray="7 6"
                opacity={0.8}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="26"
                  to="0"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}

          {/* KABEL MENGIKUTI KURSOR MOUSE SAAT TITIK 1 DIKLIK */}
          {pinAwalDiklik && (
            <path
              pointerEvents="none"
              d={`M ${pinAwalDiklik.x} ${pinAwalDiklik.y} Q ${
                (pinAwalDiklik.x + posisiKursorSvg.x) / 2
              } ${Math.min(pinAwalDiklik.y, posisiKursorSvg.y) - 20}, ${
                posisiKursorSvg.x
              } ${posisiKursorSvg.y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={4}
              strokeDasharray="4 3"
            />
          )}

          {/* KABEL JUMPER YANG SUDAH TERSAMBUNG */}
          {kabelTerpasangList.map((k, idx) => {
            const p1 = PIN_FISIK_ESP32_STANDAR.find(
              (p) => p.idPin === k.dariPinEsp32
            );
            const p2 = semuaSambunganWajibLevelIni.find(
              (p) => p.idPinPeriferal === k.kePinPeriferal
            );
            if (!p1 || !p2) return null;
            const midX = (p1.x + p2.x) / 2;
            const adalahKabelValid =
              p2.dariPinEsp32 === k.dariPinEsp32 &&
              p2.idPinPeriferal === k.kePinPeriferal;

            return (
              <g key={idx} pointerEvents="none">
                <path
                  d={`M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={adalahKabelValid ? k.warna : "#f43f5e"}
                  strokeWidth={4.5}
                  strokeDasharray={adalahKabelValid ? "none" : "6 4"}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* PANEL SIMULATOR FISIKA */}
        <div className="mt-3 bg-slate-900/95 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Pengatur Parameter Fisika &amp; Animasi Komponen Live:
            </span>
            <span className="font-mono text-amber-300">
              Resistor: <strong>{infoResistor.labelFormatted}</strong> ({infoResistor.teksGelang})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">💡 Terang/Redup LED (PWM):</span>
                <span className="text-amber-300">
                  {Math.round((fisika.pwmLedBrightness / 255) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={255}
                value={fisika.pwmLedBrightness}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    pwmLedBrightness: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">🎨 Nilai &amp; Gelang Resistor:</span>
                <span className="text-emerald-400">
                  {infoResistor.labelFormatted}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {PILIHAN_OHM_RESISTOR.map((nilai) => (
                  <button
                    key={nilai}
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, nilaiOhmResistor: nilai }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      fisika.nilaiOhmResistor === nilai
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {nilai >= 1000 ? `${nilai / 1000}kΩ` : `${nilai}Ω`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">🔥 Suhu Panas &amp; Asap PPM:</span>
                <span className="text-rose-400">
                  {fisika.suhuCelcius}°C | {fisika.kadarGasPpm} PPM
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={20}
                  max={55}
                  value={fisika.suhuCelcius}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      suhuCelcius: Number(e.target.value),
                    }))
                  }
                  className="w-1/2"
                />
                <input
                  type="range"
                  min={150}
                  max={950}
                  value={fisika.kadarGasPpm}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      kadarGasPpm: Number(e.target.value),
                    }))
                  }
                  className="w-1/2"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">📡 Jarak Objek Ultrasonik:</span>
                <span className="text-sky-400">{fisika.jarakUltrasonikCm} cm</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                value={fisika.jarakUltrasonikCm}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    jarakUltrasonikCm: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN BAWAH: PANEL KIRI (DASAR TEORI + CHECKLIST SLOT + INSTRUKSI) */}
      {/* Tetap tampil lengkap walaupun Pop-Up Modal sudah di-close!          */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-xs">
                {materiAktif.badgeLevel}
              </span>
              <button
                type="button"
                onClick={() => setTampilModalTeori(true)}
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Perbesar Pop-Up Teori
              </button>
            </div>

            {/* 1. Dasar Teori & Analogi Permanen di Sebelah Kiri */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
              <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> 1. Penjelasan Dasar Teori &amp; Analogi Mudah:
              </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {blueprintLevelIni.analogiMudahPaham}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed pt-1 border-t border-slate-800">
                {bersihkanKeHibahIlmu(materiAktif.penjelasanTeoriSingkat)}
              </p>
            </div>

            {/* 2. Checklist Komponen yang Wajib Ditarik Bertahap */}
            <div className="space-y-2">
              <div className="font-bold text-amber-300 text-xs uppercase">
                2. Checklist Merakit {totalKomponenWajib} Komponen (Tarik Satu per Satu):
              </div>
              <div className="space-y-1.5 text-xs">
                <div
                  className={`p-2.5 rounded-xl border flex justify-between items-center ${
                    slot1Esp32Terpasang
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  <span>
                    {slot1Esp32Terpasang ? "✅" : "⬜"} <strong>Slot #1:</strong>{" "}
                    ESP32 DevKit V1 (30P)
                  </span>
                  <span className="font-bold text-[10px]">
                    {slot1Esp32Terpasang ? "SUDAH DITARIK" : "BELUM DITARIK"}
                  </span>
                </div>

                {daftarSlotPeriferal.map((s) => {
                  const sudah =
                    slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang;
                  return (
                    <div
                      key={s.nomorSlot}
                      className={`p-2.5 rounded-xl border flex justify-between items-center ${
                        sudah
                          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      <span>
                        {sudah ? "✅" : "⬜"} <strong>Slot #{s.nomorSlot}:</strong>{" "}
                        {s.namaTarget}
                      </span>
                      <span className="font-bold text-[10px]">
                        {sudah ? "SUDAH DITARIK" : "BELUM DITARIK"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Checklist Sambungan Kabel Pin */}
            <div className="space-y-2">
              <div className="font-bold text-sky-400 text-xs uppercase">
                3. Checklist Sambungan Kabel Pin ({kabelTerpasangList.length}/
                {semuaSambunganWajibLevelIni.length}):
              </div>
              {semuaSambunganWajibLevelIni.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  ✅ Materi Standalone 1-Board ESP32: Tidak memerlukan kabel luar!
                </div>
              ) : (
                semuaSambunganWajibLevelIni.map((w, i) => {
                  const sudah = kabelTerpasangList.some(
                    (k) =>
                      k.dariPinEsp32 === w.dariPinEsp32 &&
                      k.kePinPeriferal === w.idPinPeriferal
                  );
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border font-mono text-xs flex justify-between items-center ${
                        sudah
                          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-amber-300"
                      }`}
                    >
                      <span>
                        {sudah ? "✅" : "🔌"} {w.keteranganJalur}
                      </span>
                      <span className="text-[10px] font-bold">
                        {sudah ? "TERSAMBUNG" : "BELUM"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* 4. Instruksi Ketik Program C++ */}
            <div className="space-y-2 pt-1">
              <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 4. Instruksi Ketik Program C++ di Sebelah Kanan:
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-100 bg-emerald-950/25 p-4 rounded-xl border border-emerald-500/30 text-xs sm:text-sm leading-relaxed">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i}>{bersihkanKeHibahIlmu(inst)}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: EDITOR KODE C++ */}
        <div ref={editorContainerRef} className="lg:col-span-6 space-y-4">
          <div
            className={`bg-slate-950 rounded-2xl border-2 overflow-hidden shadow-xl transition ${
              getarMerahKodingan
                ? "animate-error-shake border-rose-500"
                : statusVerifikasi === "gagal_kode"
                ? "border-rose-500"
                : simulasiAktif
                ? "border-emerald-400"
                : "border-slate-800"
            }`}
          >
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="font-mono font-bold text-amber-300">
                ✍️ Editor C++ — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlot1Esp32Terpasang(true);
                    const mapPenuh: Record<
                      number,
                      { terpasang: boolean; namaKartu: string; idKartu: string }
                    > = {};
                    daftarSlotPeriferal.forEach((s) => {
                      mapPenuh[s.nomorSlot] = {
                        terpasang: true,
                        namaKartu: s.namaTarget,
                        idKartu: s.idGambarMiniatur,
                      };
                    });
                    setSlotPeriferalTerpasangMap(mapPenuh);
                    setKabelTerpasangList(
                      semuaSambunganWajibLevelIni.map((w) => ({
                        dariPinEsp32: w.dariPinEsp32,
                        kePinPeriferal: w.idPinPeriferal,
                        warna: w.warnaKabel,
                      }))
                    );
                    setKodeKetikanUser(
                      bersihkanKeHibahIlmu(materiAktif.kodeTargetBenar)
                    );
                    setBarisKodeSalahList([]);
                    setPinYangSalahAtauKurangIds([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Bantuan Rakit &amp; Isi Kode
                </button>
                <button
                  type="button"
                  onClick={() => pindahKeLevel(indeksLevel, modeBelajar, false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {barisKodeSalahList.length > 0 && (
              <div className="bg-rose-950 border-b border-rose-500 px-4 py-3 text-xs space-y-1">
                <div className="font-bold text-rose-300">
                  🚨 Lokasi Kesalahan Kodingan C++ Ditemukan:
                </div>
                {barisKodeSalahList.map((b, i) => (
                  <div key={i} className="text-white font-mono">
                    👉 <strong>Baris #{b.nomorBaris}:</strong> {b.pesanBaris}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-12 bg-black font-mono text-xs sm:text-sm">
              <div className="col-span-1 py-4 bg-slate-950 border-r border-slate-800 text-right pr-2 select-none space-y-[2px]">
                {daftarBarisEditor.map((_, idx) => {
                  const noBaris = idx + 1;
                  const barisIniError = barisKodeSalahList.some(
                    (b) => b.nomorBaris === noBaris
                  );
                  return (
                    <div
                      key={noBaris}
                      className={`leading-relaxed px-1 rounded ${
                        barisIniError
                          ? "bg-rose-600 text-white font-bold animate-pulse"
                          : "text-slate-500"
                      }`}
                    >
                      {noBaris}
                    </div>
                  );
                })}
              </div>
              <textarea
                rows={Math.max(11, daftarBarisEditor.length)}
                value={kodeKetikanUser}
                onChange={(e) => {
                  setKodeKetikanUser(e.target.value);
                  setBarisKodeSalahList([]);
                  if (simulasiAktif) setStatusVerifikasi("belum");
                }}
                spellCheck={false}
                className="col-span-11 p-4 bg-black text-emerald-300 font-mono leading-relaxed focus:outline-none resize-y"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={periksaRangkaianDanJalankanProgram}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa {totalKomponenWajib} Komponen &amp; Jalankan
              </button>

              {indeksLevel < daftarKurikulumExtended.length - 1 ? (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() =>
                    pindahKeLevel(indeksLevel + 1, modeBelajar, true)
                  }
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl animate-bounce"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {sudahLulusLevelIni ? (
                    <>
                      <span>2. Lanjut ke Level {materiAktif.level + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() => {
                    if (onBukaSimulator10Node) onBukaSimulator10Node();
                  }}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-1" /> Buka Simulator 10-Node ➔
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="text-amber-400 font-bold">
              📟 Serial Monitor &amp; Compiler Output (115200 baud):
            </div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputSerialSimulasi}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};