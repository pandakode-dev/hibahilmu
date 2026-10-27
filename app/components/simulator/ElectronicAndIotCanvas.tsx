"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Trash2,
  RotateCcw,
  Sliders,
  Move,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  Cable,
  Info,
  Wifi,
  CornerDownRight,
  BookOpen,
  Power,
  Sparkles,
} from "lucide-react";
import {
  VisualKomponenRealistis,
  ResistorVisualSvg,
  hitungGelangWarnaResistor,
} from "./ResistorVisualSvg";
import {
  ambilLayoutFisikKomponen,
  ambilKonfigurasiRentangKomponen,
  warnaTitikPin,
  TitikPinFisik,
} from "./pinoutDefinitions";
import { IotCloudBlynkPanel } from "./IotCloudBlynkPanel";

export interface TitikSikuKabel {
  x: number;
  y: number;
}

export interface NodeKomponenKanvas {
  id: string;
  tipe: string;
  label: string;
  x: number;
  y: number;
  nilaiResistor?: number;
  nilaiSensor?: number;
  nyala?: boolean;
}

export interface KabelKoneksiItem {
  id: string;
  dariId: string;
  pinAsal: string;
  keId: string;
  pinTujuan: string;
  warna: string;
  titikSiku?: TitikSikuKabel[];
}

interface CanvasProps {
  mode: "wokwi" | "ewb" | "matlab";
  onUpdateKodeDariCloud?: (kodeBaru: string) => void;
}

interface ItemPaletGudang {
  tipe: string;
  label: string;
  kategori: string;
  defaultResistor?: number;
  defaultSensor?: number;
}

const PILIHAN_WARNA_KABEL = [
  { nama: "Merah (VCC/+)", hex: "#ef4444" },
  { nama: "Hitam/Abu (GND/-)", hex: "#94a3b8" },
  { nama: "Biru (Data/GPIO)", hex: "#38bdf8" },
  { nama: "Hijau (TX/SDA)", hex: "#22c55e" },
  { nama: "Kuning (RX/PWM)", hex: "#facc15" },
  { nama: "Ungu (SCL/Trig)", hex: "#a855f7" },
  { nama: "Oranye (Relay OUT)", hex: "#f97316" },
];

// ============================================================================
// KATALOG GUDANG KOMPONEN LENGKAP (DENGAN RELAY 1CH, 2CH, 4CH & SERVO 180/360)
// ============================================================================
const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: ItemPaletGudang[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit (30 Pin)", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno (28 Pin)", kategori: "Microcontroller" },
    { tipe: "esp8266_nodemcu", label: "NodeMCU ESP8266 (30p)", kategori: "Microcontroller" },
    { tipe: "stm32_bluepill", label: "STM32 BluePill (32p)", kategori: "Microcontroller" },
    { tipe: "raspberry_pico", label: "Raspberry Pi Pico (32p)", kategori: "Microcontroller" },
    // Kategori Modul Relay 1CH, 2CH, 4CH
    { tipe: "relay_1ch", label: "Relay 1-Channel (6p)", kategori: "Modul Relay" },
    { tipe: "relay_2ch", label: "Relay 2-Channel (10p)", kategori: "Modul Relay" },
    { tipe: "relay_4ch", label: "Relay 4-Channel (18p)", kategori: "Modul Relay" },
    // Kategori Sensor IoT Realistis
    {
      tipe: "ultrasonik",
      label: "Ultrasonik HC-SR04 (2-400cm)",
      kategori: "Sensor IoT",
      defaultSensor: 45,
    },
    {
      tipe: "pir_sensor",
      label: "Sensor Gerak PIR (-60..60°)",
      kategori: "Sensor IoT",
      defaultSensor: 0,
    },
    {
      tipe: "ir_obstacle",
      label: "Sensor Infrared IR (2-30cm)",
      kategori: "Sensor IoT",
      defaultSensor: 8,
    },
    {
      tipe: "ldr_sensor",
      label: "Sensor Cahaya LDR (0-1000Lx)",
      kategori: "Sensor IoT",
      defaultSensor: 450,
    },
    {
      tipe: "flame_sensor",
      label: "Sensor Api Flame (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 80,
    },
    {
      tipe: "dht22",
      label: "Sensor Suhu DHT22 (-40..80°C)",
      kategori: "Sensor IoT",
      defaultSensor: 28.5,
    },
    {
      tipe: "soil_moisture",
      label: "Kelembapan Tanah (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 65,
    },
    {
      tipe: "rain_sensor",
      label: "Sensor Hujan Rain (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 70,
    },
    {
      tipe: "mq2_gas",
      label: "Sensor Gas MQ-2 (100-10000ppm)",
      kategori: "Sensor IoT",
      defaultSensor: 350,
    },
    { tipe: "rfid_rc522", label: "RFID Card Reader (6p)", kategori: "Sensor IoT" },
    // Kategori Aktuator & Motor (Solenoid 2-Pin, Pompa 2-Pin, Servo 180 & Servo 360)
    {
      tipe: "solenoid_lock",
      label: "Solenoid Lock 12V (2p ON/OFF)",
      kategori: "Aktuator & Motor",
    },
    {
      tipe: "water_pump",
      label: "Pompa Air Mini (2p ke Relay)",
      kategori: "Aktuator & Motor",
    },
    {
      tipe: "servo",
      label: "Servo SG90 180° (Positional)",
      kategori: "Aktuator & Motor",
      defaultSensor: 90,
    },
    {
      tipe: "servo_360",
      label: "Servo MG996R 360° (Continuous)",
      kategori: "Aktuator & Motor",
      defaultSensor: 60,
    },
    {
      tipe: "kipas_dc",
      label: "Kipas DC (PWM 0-255)",
      kategori: "Aktuator & Motor",
      defaultSensor: 200,
    },
    {
      tipe: "oled_display",
      label: "Layar OLED I2C (4p)",
      kategori: "Aktuator & Motor",
      defaultSensor: 100,
    },
    {
      tipe: "lcd_16x2",
      label: "LCD 16x2 I2C (4p)",
      kategori: "Aktuator & Motor",
      defaultSensor: 25,
    },
    { tipe: "buzzer", label: "Buzzer Piezo (ON/OFF)", kategori: "Aktuator & Motor" },
    { tipe: "keypad_4x4", label: "Keypad Matriks 4x4 (8p)", kategori: "Pasif & Input" },
    { tipe: "led_hijau", label: "LED Hijau 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "led_merah", label: "LED Merah 5mm (2p)", kategori: "Pasif & Input" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif & Input",
      defaultResistor: 220,
    },
    {
      tipe: "potensiometer",
      label: "Potensiometer (ADC 0-4095)",
      kategori: "Pasif & Input",
      defaultSensor: 2048,
    },
  ],
  ewb: [
    {
      tipe: "vcc_dc",
      label: "Sumber Tegangan DC",
      kategori: "Power & Ground",
      defaultSensor: 12,
    },
    {
      tipe: "ac_source",
      label: "Generator Sinyal AC",
      kategori: "Power & Ground",
      defaultSensor: 50,
    },
    { tipe: "gnd", label: "Ground (GND 0V)", kategori: "Power & Ground" },
    {
      tipe: "resistor",
      label: "Resistor 4-Gelang",
      kategori: "Komponen RLC",
      defaultResistor: 1000,
    },
    {
      tipe: "kapasitor",
      label: "Kapasitor Elektrolit",
      kategori: "Komponen RLC",
      defaultSensor: 100,
    },
    {
      tipe: "induktor",
      label: "Induktor Kumparan",
      kategori: "Komponen RLC",
      defaultSensor: 25,
    },
    { tipe: "dioda", label: "Dioda Penyearah 1N4007", kategori: "Semikonduktor & IC" },
    {
      tipe: "transistor_npn",
      label: "Transistor NPN 2N2222",
      kategori: "Semikonduktor & IC",
    },
    {
      tipe: "gerbang_logika",
      label: "Gerbang AND (7408)",
      kategori: "Gerbang Logika & Alat",
    },
    {
      tipe: "osiloskop",
      label: "Osiloskop 2-Channel",
      kategori: "Gerbang Logika & Alat",
    },
  ],
  matlab: [
    {
      tipe: "Sine Wave",
      label: "Sine Wave Generator",
      kategori: "Sources",
      defaultSensor: 50,
    },
    {
      tipe: "PID Controller",
      label: "PID Controller",
      kategori: "Continuous",
      defaultSensor: 2,
    },
    {
      tipe: "Transfer Fcn",
      label: "Transfer Fcn G(s)",
      kategori: "Continuous",
      defaultSensor: 1,
    },
    { tipe: "Scope Plot", label: "Simulink Scope Viewer", kategori: "Sinks" },
  ],
};

// ============================================================================
// 4 PRESET TUTORIAL & CONTOH PROJECT BERTINGKAT (SEDERHANA S/D KOMPLEKS)
// ============================================================================
export interface PresetTutorialProject {
  id: string;
  level: string;
  judul: string;
  deskripsiSingkat: string;
  langkahWiring: string[];
  kodeProgram: string;
  nodes: NodeKomponenKanvas[];
  kabel: KabelKoneksiItem[];
}

export const DAFTAR_TUTORIAL_PROJECT_WOKWI: PresetTutorialProject[] = [
  {
    id: "proj-1",
    level: "Level 1: Dasar",
    judul: "Lampu Taman Otomatis (Sensor Cahaya LDR + Relay 1-Ch + LED)",
    deskripsiSingkat:
      "Membaca intensitas cahaya matahari (0–1000 Lux) dari sensor LDR pada pin ADC GPIO34. Saat gelap (< 300 Lux), ESP32 memicu pin IN Modul Relay 1-Channel untuk menyalakan lampu.",
    langkahWiring: [
      "Hubungkan Pin AO (Analog Out) Sensor LDR ke Pin D34 (ADC) di sisi kiri ESP32.",
      "Hubungkan Pin GPIO32 ESP32 ke Pin IN (Input Pemicu) di bagian bawah Modul Relay 1-Channel.",
      "Hubungkan Terminal NO (Normally Open) di atas Modul Relay ke Anoda (+) Lampu LED.",
    ],
    kodeProgram: `// PROJECT LEVEL 1: LAMPU OTOMATIS SENSOR CAHAYA LDR + RELAY 1-CHANNEL
#define PIN_LDR_ADC   34
#define PIN_RELAY_IN  32

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY_IN, OUTPUT);
}

void loop() {
  int nilaiLux = analogRead(PIN_LDR_ADC); // 0 - 1000 Lux
  if (nilaiLux < 300) {
    digitalWrite(PIN_RELAY_IN, HIGH); // Malam Hari -> Relay ON -> Lampu Menyala
    Serial.println("Kondisi Gelap (" + String(nilaiLux) + " Lux) -> Relay ON");
  } else {
    digitalWrite(PIN_RELAY_IN, LOW);  // Siang Hari -> Relay OFF
  }
  delay(1000);
}`,
    nodes: [
      { id: "p1-esp", tipe: "esp32", label: "ESP32 Controller", x: 30, y: 50, nyala: true },
      { id: "p1-ldr", tipe: "ldr_sensor", label: "Sensor LDR (Lux)", x: 245, y: 60, nilaiSensor: 180, nyala: true },
      { id: "p1-rel", tipe: "relay_1ch", label: "Relay 1-Channel", x: 420, y: 120, nyala: true },
      { id: "p1-led", tipe: "led_hijau", label: "Lampu Taman", x: 585, y: 65, nyala: true },
    ],
    kabel: [
      { id: "k1-1", dariId: "p1-ldr", pinAsal: "SIG", keId: "p1-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 305, y: 195 }, { x: 15, y: 195 }] },
      { id: "k1-2", dariId: "p1-esp", pinAsal: "GPIO32", keId: "p1-rel", pinTujuan: "IN1", warna: "#38bdf8", titikSiku: [{ x: 15, y: 270 }, { x: 502, y: 270 }] },
      { id: "k1-3", dariId: "p1-rel", pinAsal: "NO", keId: "p1-led", pinTujuan: "ANODA", warna: "#ef4444", titikSiku: [{ x: 448, y: 35 }, { x: 616, y: 185 }] },
    ],
  },
  {
    id: "proj-2",
    level: "Level 2: Menengah",
    judul: "Smart Door Lock (RFID RC522 + Relay 1-Ch + Solenoid 12V + Servo 180°)",
    deskripsiSingkat:
      "Karena Solenoid Door Lock membutuhkan tegangan 12V DC dan hanya bekerja ON/OFF, mikrokontroler tidak boleh mencatunya langsung melainkan wajib melalui kontak sakelar NO & COM pada Modul Relay 1-Channel!",
    langkahWiring: [
      "Hubungkan RFID RC522 (SDA/SS) ke Pin GPIO5 di sisi kanan ESP32.",
      "Hubungkan Pin GPIO32 ESP32 ke Pin IN (bawah) Modul Relay 1-Channel.",
      "Hubungkan Terminal NO (atas) Modul Relay 1-Channel ke Kabel Merah (+12V) Solenoid Door Lock.",
      "Hubungkan Pin GPIO18 (PWM) ESP32 ke Pin Sinyal Motor Servo SG90 (0°–180°) sebagai palang pintu.",
    ],
    kodeProgram: `// PROJECT LEVEL 2: SMART DOOR LOCK RFID + RELAY 1-CH + SOLENOID 12V + SERVO 180
#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>

#define PIN_RELAY_SOLENOID 32
#define PIN_SERVO_180      18

Servo palangPintu;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY_SOLENOID, OUTPUT);
  palangPintu.attach(PIN_SERVO_180);
}

void loop() {
  // Saat E-KTP Terverifikasi: Aktifkan Relay -> Solenoid Menarik Tuas (UNLOCK) & Buka Servo 90 derajat
  digitalWrite(PIN_RELAY_SOLENOID, HIGH);
  palangPintu.write(90);
  Serial.println("Akses Diterima -> Relay ON -> Solenoid UNLOCKED & Servo 90 deg");
  delay(3000);
}`,
    nodes: [
      { id: "p2-esp", tipe: "esp32", label: "ESP32 Master", x: 25, y: 55, nyala: true },
      { id: "p2-rfid", tipe: "rfid_rc522", label: "RFID RC522 Tap", x: 230, y: 45, nyala: true },
      { id: "p2-rel1", tipe: "relay_1ch", label: "Relay 1-Ch Pengaman", x: 395, y: 145, nyala: true },
      { id: "p2-sol", tipe: "solenoid_lock", label: "Solenoid Lock 12V", x: 560, y: 45, nyala: true },
      { id: "p2-srv", tipe: "servo", label: "Servo SG90 (0-180°)", x: 560, y: 195, nilaiSensor: 90, nyala: true },
    ],
    kabel: [
      { id: "k2-1", dariId: "p2-rfid", pinAsal: "SDA(SS)", keId: "p2-esp", pinTujuan: "GPIO5", warna: "#06b6d4", titikSiku: [{ x: 250, y: 175 }, { x: 200, y: 175 }] },
      { id: "k2-2", dariId: "p2-esp", pinAsal: "GPIO32", keId: "p2-rel1", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 15, y: 295 }, { x: 477, y: 295 }] },
      { id: "k2-3", dariId: "p2-rel1", pinAsal: "NO", keId: "p2-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 423, y: 125 }, { x: 598, y: 175 }] },
      { id: "k2-4", dariId: "p2-esp", pinAsal: "GPIO18", keId: "p2-srv", pinTujuan: "SIG", warna: "#facc15", titikSiku: [{ x: 205, y: 162 }, { x: 620, y: 315 }] },
    ],
  },
  {
    id: "proj-3",
    level: "Level 3: Lanjutan",
    judul: "Smart Greenhouse (Soil Moisture + DHT22 + Relay 2-Channel + Pompa Air Mini & Kipas)",
    deskripsiSingkat:
      "Menggunakan Modul Relay 2-Channel (10 Pin): Kanal 1 (NO1) menyalakan Pompa Air Mini 2-Kabel saat tanah kering (< 40%), sedangkan Kanal 2 (NO2) menyalakan Kipas Pendingin saat suhu DHT22 panas (> 33°C).",
    langkahWiring: [
      "Hubungkan Pin AO Sensor Kelembapan Tanah ke GPIO34 ESP32 & DATA DHT22 ke GPIO15 ESP32.",
      "Hubungkan GPIO32 & GPIO33 ESP32 ke Pin IN1 & IN2 di bagian bawah Modul Relay 2-Channel.",
      "Hubungkan Terminal NO1 (atas Relay 2-Ch) ke Kabel Merah (+) Pompa Air Mini 2-Pin.",
      "Hubungkan Terminal NO2 (atas Relay 2-Ch) ke Pin VCC Kipas Pendingin DC.",
    ],
    kodeProgram: `// PROJECT LEVEL 3: SMART GREENHOUSE (SOIL + DHT22 + RELAY 2-CH + POMPA AIR & KIPAS)
#define PIN_SOIL_ADC  34
#define PIN_DHT       15
#define RELAY_POMPA   32 // IN1 Relay 2-Channel -> Pompa Air Mini
#define RELAY_KIPAS   33 // IN2 Relay 2-Channel -> Kipas Pendingin

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_POMPA, OUTPUT);
  pinMode(RELAY_KIPAS, OUTPUT);
}

void loop() {
  digitalWrite(RELAY_POMPA, HIGH); // Tanah kering -> Nyalakan Pompa Air via NO1
  digitalWrite(RELAY_KIPAS, HIGH); // Suhu > 33 C  -> Nyalakan Kipas via NO2
  Serial.println("[Greenhouse]: Pompa Air = ON | Kipas Pendingin = ON");
  delay(2000);
}`,
    nodes: [
      { id: "p3-esp", tipe: "esp32", label: "ESP32 Greenhouse", x: 20, y: 55, nyala: true },
      { id: "p3-soil", tipe: "soil_moisture", label: "Kelembapan Tanah", x: 215, y: 40, nilaiSensor: 65, nyala: true },
      { id: "p3-dht", tipe: "dht22", label: "Suhu DHT22 (°C)", x: 225, y: 185, nilaiSensor: 35, nyala: true },
      { id: "p3-rel2", tipe: "relay_2ch", label: "Relay 2-Channel", x: 385, y: 135, nyala: true },
      { id: "p3-pump", tipe: "water_pump", label: "Pompa Air Mini (2p)", x: 575, y: 40, nyala: true },
      { id: "p3-fan", tipe: "kipas_dc", label: "Kipas DC Greenhouse", x: 575, y: 195, nilaiSensor: 220, nyala: true },
    ],
    kabel: [
      { id: "k3-1", dariId: "p3-soil", pinAsal: "AO", keId: "p3-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 160 }, { x: 12, y: 160 }] },
      { id: "k3-2", dariId: "p3-dht", pinAsal: "DATA", keId: "p3-esp", pinTujuan: "GPIO15", warna: "#a855f7", titikSiku: [{ x: 266, y: 320 }, { x: 190, y: 224 }] },
      { id: "k3-3", dariId: "p3-esp", pinAsal: "GPIO32", keId: "p3-rel2", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 290 }, { x: 447, y: 290 }] },
      { id: "k3-4", dariId: "p3-esp", pinAsal: "GPIO33", keId: "p3-rel2", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 12, y: 305 }, { x: 474, y: 305 }] },
      { id: "k3-5", dariId: "p3-rel2", pinAsal: "NO1", keId: "p3-pump", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 405, y: 115 }, { x: 613, y: 165 }] },
      { id: "k3-6", dariId: "p3-rel2", pinAsal: "NO2", keId: "p3-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 473, y: 115 }, { x: 605, y: 315 }] },
    ],
  },
  {
    id: "proj-4",
    level: "Level 4: Kompleks (Dual-MCU + Relay 4-Ch)",
    judul: "Otomasi Industri (ESP32 ↔ Arduino UART + Relay 4-Ch + Solenoid + Pompa + Servo 360°)",
    deskripsiSingkat:
      "Arsitektur lengkap menggunakan 2 Mikrokontroler (ESP32 Master & Arduino Uno Slave via TX/RX), Modul Relay 4-Channel (18 Pin) untuk mengendalikan Solenoid 12V & Pompa Air, serta Motor Servo 360° Continuous sebagai penggerak konveyor.",
    langkahWiring: [
      "Hubungkan silang TX2 (GPIO17) ESP32 ke D0 (RX) Arduino Uno untuk komunikasi Dual-MCU.",
      "Hubungkan GPIO32, GPIO33, GPIO25, GPIO26 ESP32 ke IN1, IN2, IN3, IN4 pada Modul Relay 4-Channel.",
      "Hubungkan NO1 Relay 4-Ch ke Solenoid 12V (+) dan NO2 Relay 4-Ch ke Pompa Air Mini (+).",
      "Hubungkan D9 (PWM) Arduino Uno ke Pin Sinyal Motor Servo 360° Continuous Rotation.",
    ],
    kodeProgram: `// PROJECT LEVEL 4: DUAL-MCU INDUSTRI (ESP32 + ARDUINO + RELAY 4-CH + SERVO 360)
#define RELAY_CH1_SOLENOID 32
#define RELAY_CH2_POMPA    33
#define RELAY_CH3_ALARM    25
#define RELAY_CH4_CADANGAN 26

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // UART Bridge ke Arduino Uno
  pinMode(RELAY_CH1_SOLENOID, OUTPUT);
  pinMode(RELAY_CH2_POMPA, OUTPUT);
}

void loop() {
  digitalWrite(RELAY_CH1_SOLENOID, HIGH);
  digitalWrite(RELAY_CH2_POMPA, HIGH);
  Serial2.println("CMD:SERVO_360_SPEED=80;SONAR=CHECK");
  delay(2000);
}`,
    nodes: [
      { id: "p4-esp", tipe: "esp32", label: "ESP32 Master (WiFi)", x: 15, y: 45, nyala: true },
      { id: "p4-rel4", tipe: "relay_4ch", label: "Modul Relay 4-Channel (18p)", x: 205, y: 150, nyala: true },
      { id: "p4-sol", tipe: "solenoid_lock", label: "Solenoid Lock 12V", x: 205, y: 20, nyala: true },
      { id: "p4-pump", tipe: "water_pump", label: "Pompa Air Mini (2p)", x: 355, y: 20, nyala: true },
      { id: "p4-uno", tipe: "arduino_uno", label: "Arduino Slave (UART)", x: 475, y: 185, nyala: true },
      { id: "p4-s360", tipe: "servo_360", label: "Servo 360° Konveyor", x: 530, y: 25, nilaiSensor: 75, nyala: true },
    ],
    kabel: [
      { id: "k4-1", dariId: "p4-esp", pinAsal: "GPIO32", keId: "p4-rel4", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 10, y: 300 }, { x: 276, y: 300 }] },
      { id: "k4-2", dariId: "p4-esp", pinAsal: "GPIO33", keId: "p4-rel4", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 10, y: 312 }, { x: 302, y: 312 }] },
      { id: "k4-3", dariId: "p4-rel4", pinAsal: "NO1", keId: "p4-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 221, y: 135 }] },
      { id: "k4-4", dariId: "p4-rel4", pinAsal: "NO2", keId: "p4-pump", pinTujuan: "VCC_POS", warna: "#f97316", titikSiku: [{ x: 272, y: 135 }, { x: 393, y: 135 }] },
      { id: "k4-5", dariId: "p4-esp", pinAsal: "GPIO17", keId: "p4-uno", pinTujuan: "D0_RX", warna: "#facc15", titikSiku: [{ x: 190, y: 325 }, { x: 653, y: 175 }] },
      { id: "k4-6", dariId: "p4-uno", pinAsal: "D9", keId: "p4-s360", pinTujuan: "SIG", warna: "#a855f7", titikSiku: [{ x: 593, y: 155 }] },
    ],
  },
];

const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: DAFTAR_TUTORIAL_PROJECT_WOKWI[1].nodes, // Default membuka Project Level 2 (RFID + Relay 1Ch + Solenoid 12V + Servo 180)
  ewb: [
    { id: "ewb-1", tipe: "vcc_dc", label: "Sumber DC 12V", x: 35, y: 90, nilaiSensor: 12 },
    { id: "ewb-2", tipe: "resistor", label: "Resistor R1", x: 230, y: 55, nilaiResistor: 1000 },
    { id: "ewb-3", tipe: "resistor", label: "Resistor R2", x: 230, y: 175, nilaiResistor: 2200 },
    { id: "ewb-4", tipe: "osiloskop", label: "Osiloskop CH1", x: 450, y: 100, nyala: true },
  ],
  matlab: [
    { id: "sim-1", tipe: "Sine Wave", label: "Input r(t)", x: 30, y: 110, nilaiSensor: 10 },
    { id: "sim-2", tipe: "PID Controller", label: "PID", x: 215, y: 110, nilaiSensor: 5 },
    { id: "sim-3", tipe: "Transfer Fcn", label: "Plant G(s)", x: 400, y: 110, nilaiSensor: 1 },
    { id: "sim-4", tipe: "Scope Plot", label: "Scope y(t)", x: 575, y: 110 },
  ],
};

const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: DAFTAR_TUTORIAL_PROJECT_WOKWI[1].kabel,
  ewb: [
    { id: "e-1", dariId: "ewb-1", pinAsal: "OUT_1", keId: "ewb-2", pinTujuan: "PIN_1", warna: "#ef4444", titikSiku: [{ x: 195, y: 105 }] },
    { id: "e-2", dariId: "ewb-2", pinAsal: "PIN_2", keId: "ewb-3", pinTujuan: "PIN_1", warna: "#38bdf8", titikSiku: [{ x: 395, y: 105 }, { x: 395, y: 225 }] },
    { id: "e-3", dariId: "ewb-2", pinAsal: "PIN_2", keId: "ewb-4", pinTujuan: "IN_1", warna: "#22c55e", titikSiku: [{ x: 420, y: 145 }] },
  ],
  matlab: [
    { id: "m-1", dariId: "sim-1", pinAsal: "OUT_1", keId: "sim-2", pinTujuan: "IN_1", warna: "#f97316" },
    { id: "m-2", dariId: "sim-2", pinAsal: "OUT_1", keId: "sim-3", pinTujuan: "IN_1", warna: "#38bdf8" },
    { id: "m-3", dariId: "sim-3", pinAsal: "OUT_1", keId: "sim-4", pinTujuan: "IN_1", warna: "#22c55e" },
  ],
};

function cariKoordinatPinAbsolut(
  node: NodeKomponenKanvas,
  idAtauNamaPin: string
): { x: number; y: number; pinObj: TitikPinFisik } {
  const layout = ambilLayoutFisikKomponen(node.tipe);
  const found =
    layout.pins.find(
      (p) => p.idPin === idAtauNamaPin || p.nama === idAtauNamaPin
    ) || layout.pins[0];
  return {
    x: node.x + found.x,
    y: node.y + found.y + 18,
    pinObj: found,
  };
}

function bangunJalurSikuWokwi(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  titikSiku?: TitikSikuKabel[]
): { d: string; daftarHandle: TitikSikuKabel[]; titikTengah: TitikSikuKabel } {
  const handles: TitikSikuKabel[] =
    titikSiku && titikSiku.length > 0
      ? titikSiku
      : [
          { x: Math.round((x1 + x2) / 2), y: y1 },
          { x: Math.round((x1 + x2) / 2), y: y2 },
        ];

  const semuaTitik: TitikSikuKabel[] = [{ x: x1, y: y1 }];
  for (let i = 0; i < handles.length; i++) {
    const prev = semuaTitik[semuaTitik.length - 1];
    const curr = handles[i];
    if (prev.x !== curr.x && prev.y !== curr.y) {
      semuaTitik.push({ x: curr.x, y: prev.y });
    }
    semuaTitik.push({ x: curr.x, y: curr.y });
  }
  const last = semuaTitik[semuaTitik.length - 1];
  if (last.x !== x2 && last.y !== y2) {
    semuaTitik.push({ x: x2, y: last.y });
  }
  semuaTitik.push({ x: x2, y: y2 });

  const d = semuaTitik
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
    .join(" ");

  const tengah =
    handles[Math.floor(handles.length / 2)] || {
      x: Math.round((x1 + x2) / 2),
      y: Math.round((y1 + y2) / 2),
    };

  return { d, daftarHandle: handles, titikTengah: tengah };
}

export const ElectronicAndIotCanvas: React.FC<CanvasProps> = ({
  mode,
  onUpdateKodeDariCloud,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [daftarNode, setDaftarNode] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
  }>(KOMPONEN_AWAL_PER_MODE);

  const [daftarKabel, setDaftarKabel] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
  }>(KABEL_AWAL_PER_MODE);

  // State Pilihan Tutorial Project Bertingkat
  const [projectAktif, setProjectAktif] = useState<PresetTutorialProject>(
    DAFTAR_TUTORIAL_PROJECT_WOKWI[1]
  );

  const [kategoriPaletAktif, setKategoriPaletAktif] = useState<string>("Semua");
  const [cariKomponen, setCariKomponen] = useState<string>("");

  const [ukuranKanvas, setUkuranKanvas] = useState<"kecil" | "sedang" | "besar" | "penuh">(
    "besar"
  );
  const [skalaZoom, setSkalaZoom] = useState<number>(1);

  const [idKomponenTerpilih, setIdKomponenTerpilih] = useState<string | null>(
    KOMPONEN_AWAL_PER_MODE[mode][0]?.id || null
  );
  const [sedangGeserId, setSedangGeserId] = useState<string | null>(null);

  const [hoveredPinInfo, setHoveredPinInfo] = useState<{
    nodeLabel: string;
    pin: TitikPinFisik;
    absX: number;
    absY: number;
  } | null>(null);

  const [idKabelTerpilih, setIdKabelTerpilih] = useState<string | null>(null);
  const [sedangGeserSiku, setSedangGeserSiku] = useState<{
    kabelId: string;
    indeksTitik: number;
  } | null>(null);

  const [warnaKabelAktif, setWarnaKabelAktif] = useState<string>("#22c55e");
  const [sedangTarikKabelDariPin, setSedangTarikKabelDariPin] = useState<{
    nodeId: string;
    nodeLabel: string;
    pin: TitikPinFisik;
    xAsal: number;
    yAsal: number;
  } | null>(null);
  const [posisiKursorKanvas, setPosisiKursorKanvas] = useState<TitikSikuKabel>({
    x: 200,
    y: 150,
  });

  const [bukaDashboardIot, setBukaDashboardIot] = useState<boolean>(true);

  useEffect(() => {
    setKategoriPaletAktif("Semua");
    setCariKomponen("");
    const listAwal = daftarNode[mode];
    setIdKomponenTerpilih(listAwal[0]?.id || null);
    setIdKabelTerpilih(null);
    setSedangTarikKabelDariPin(null);
  }, [mode]);

  const muatPresetTutorialProject = (proj: PresetTutorialProject) => {
    setProjectAktif(proj);
    setDaftarNode({
      ...daftarNode,
      wokwi: proj.nodes,
    });
    setDaftarKabel({
      ...daftarKabel,
      wokwi: proj.kabel,
    });
    setIdKomponenTerpilih(proj.nodes[0]?.id || null);
    if (onUpdateKodeDariCloud) {
      onUpdateKodeDariCloud(proj.kodeProgram);
    }
  };

  const paletModeIni = PALET_KOMPONEN[mode] || [];
  const daftarKategoriUnik = [
    "Semua",
    ...Array.from(new Set(paletModeIni.map((item) => item.kategori))),
  ];

  const komponenPaletTersaring = paletModeIni.filter((item) => {
    const cocokKategori =
      kategoriPaletAktif === "Semua" || item.kategori === kategoriPaletAktif;
    const cocokKata =
      item.label.toLowerCase().includes(cariKomponen.toLowerCase()) ||
      item.kategori.toLowerCase().includes(cariKomponen.toLowerCase());
    return cocokKategori && cocokKata;
  });

  const nodesSaatIni = daftarNode[mode] || [];
  const kabelSaatIni = daftarKabel[mode] || [];
  const komponenTerpilih =
    nodesSaatIni.find((n) => n.id === idKomponenTerpilih) || nodesSaatIni[0] || null;
  const layoutTerpilih = komponenTerpilih
    ? ambilLayoutFisikKomponen(komponenTerpilih.tipe)
    : null;
  const rentangTerpilih = komponenTerpilih
    ? ambilKonfigurasiRentangKomponen(komponenTerpilih.tipe)
    : null;
  const kabelTerpilihObj =
    kabelSaatIni.find((k) => k.id === idKabelTerpilih) || null;

  const tinggiKanvasPx =
    ukuranKanvas === "kecil"
      ? "h-[380px]"
      : ukuranKanvas === "sedang"
      ? "h-[500px]"
      : ukuranKanvas === "besar"
      ? "h-[620px]"
      : "h-[800px]";

  const tambahKomponenKeKanvas = (
    tipe: string,
    label: string,
    xPos = 150,
    yPos = 100,
    defaultResistor?: number,
    defaultSensor?: number
  ) => {
    const specRentang = ambilKonfigurasiRentangKomponen(tipe);
    const baru: NodeKomponenKanvas = {
      id: `${mode}-node-${Date.now()}`,
      tipe,
      label: `${label.split(" (")[0]} #${nodesSaatIni.length + 1}`,
      x: Math.max(15, Math.min(580, xPos)),
      y: Math.max(35, Math.min(380, yPos)),
      nilaiResistor: defaultResistor ?? (tipe === "resistor" ? 1000 : undefined),
      nilaiSensor: defaultSensor ?? specRentang.defaultVal,
      nyala: true,
    };
    setDaftarNode({
      ...daftarNode,
      [mode]: [...nodesSaatIni, baru],
    });
    setIdKomponenTerpilih(baru.id);
  };

  const handleDropDariPalet = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/hibahilmu-component");
    if (!raw || !containerRef.current) return;
    try {
      const parsed = JSON.parse(raw);
      const rect = containerRef.current.getBoundingClientRect();
      const xDrop = (e.clientX - rect.left) / skalaZoom - 55;
      const yDrop = (e.clientY - rect.top) / skalaZoom - 35;
      tambahKomponenKeKanvas(
        parsed.tipe,
        parsed.label,
        xDrop,
        yDrop,
        parsed.defaultResistor,
        parsed.defaultSensor
      );
    } catch {}
  };

  const handleMouseMoveKanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = Math.round((e.clientX - rect.left) / skalaZoom);
    const mouseY = Math.round((e.clientY - rect.top) / skalaZoom);

    if (sedangTarikKabelDariPin) {
      setPosisiKursorKanvas({ x: mouseX, y: mouseY });
    }

    if (sedangGeserSiku) {
      setDaftarKabel({
        ...daftarKabel,
        [mode]: kabelSaatIni.map((kbl) => {
          if (kbl.id !== sedangGeserSiku.kabelId) return kbl;
          const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
          const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
          if (!asal || !tujuan) return kbl;
          const p1 = cariKoordinatPinAbsolut(asal, kbl.pinAsal);
          const p2 = cariKoordinatPinAbsolut(tujuan, kbl.pinTujuan);
          const listSikuLama =
            kbl.titikSiku && kbl.titikSiku.length > 0
              ? [...kbl.titikSiku]
              : [
                  { x: Math.round((p1.x + p2.x) / 2), y: p1.y },
                  { x: Math.round((p1.x + p2.x) / 2), y: p2.y },
                ];
          listSikuLama[sedangGeserSiku.indeksTitik] = {
            x: Math.max(10, mouseX),
            y: Math.max(10, mouseY),
          };
          return { ...kbl, titikSiku: listSikuLama };
        }),
      });
      return;
    }

    if (sedangGeserId) {
      const xBaru = Math.max(10, mouseX - 65);
      const yBaru = Math.max(20, mouseY - 40);
      setDaftarNode({
        ...daftarNode,
        [mode]: nodesSaatIni.map((n) =>
          n.id === sedangGeserId ? { ...n, x: xBaru, y: yBaru } : n
        ),
      });
    }
  };

  const updatePropertiKomponen = (
    id: string,
    perubahan: Partial<NodeKomponenKanvas>
  ) => {
    setDaftarNode({
      ...daftarNode,
      [mode]: nodesSaatIni.map((n) => (n.id === id ? { ...n, ...perubahan } : n)),
    });
  };

  const tambahKabelKoneksi = (
    dariId: string,
    pinDariId: string,
    keId: string,
    pinKeId: string,
    warna: string
  ) => {
    if (!dariId || !keId || (dariId === keId && pinDariId === pinKeId)) return;
    const asal = nodesSaatIni.find((n) => n.id === dariId);
    const tujuan = nodesSaatIni.find((n) => n.id === keId);
    if (!asal || !tujuan) return;

    const p1 = cariKoordinatPinAbsolut(asal, pinDariId);
    const p2 = cariKoordinatPinAbsolut(tujuan, pinKeId);
    const midX = Math.round((p1.x + p2.x) / 2);

    const baru: KabelKoneksiItem = {
      id: "kbl-" + Date.now(),
      dariId,
      pinAsal: pinDariId,
      keId,
      pinTujuan: pinKeId,
      warna,
      titikSiku: [
        { x: midX, y: p1.y },
        { x: midX, y: p2.y },
      ],
    };
    setDaftarKabel({
      ...daftarKabel,
      [mode]: [...kabelSaatIni, baru],
    });
    setIdKabelTerpilih(baru.id);
  };

  const ubahWarnaKabel = (kabelId: string, warnaBaru: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.map((k) =>
        k.id === kabelId ? { ...k, warna: warnaBaru } : k
      ),
    });
  };

  const tambahTitikSikuPadaKabel = (kabelId: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.map((k) => {
        if (k.id !== kabelId) return k;
        const sikuSaatIni = k.titikSiku || [{ x: 260, y: 150 }];
        const terakhir = sikuSaatIni[sikuSaatIni.length - 1] || { x: 260, y: 150 };
        return {
          ...k,
          titikSiku: [...sikuSaatIni, { x: terakhir.x + 35, y: terakhir.y + 30 }],
        };
      }),
    });
  };

  const hapusKabel = (kabelId: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.filter((k) => k.id !== kabelId),
    });
    if (idKabelTerpilih === kabelId) setIdKabelTerpilih(null);
  };

  const semuaResistorKanvas = nodesSaatIni.filter((n) => n.tipe === "resistor");
  const totalOhmKanvas = semuaResistorKanvas.reduce(
    (acc, r) => acc + (r.nilaiResistor || 1000),
    0
  );
  const sumberVcc =
    nodesSaatIni.find((n) => n.tipe === "vcc_dc")?.nilaiSensor || 12;
  const arusRangkaianMa =
    totalOhmKanvas > 0 ? (sumberVcc / totalOhmKanvas) * 1000 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-indigo-500/40 space-y-6 shadow-2xl">
        {/* HEADER BAR MEJA KERJA */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            {mode === "wokwi" ? (
              <Cpu className="w-6 h-6 text-emerald-400" />
            ) : mode === "ewb" ? (
              <Zap className="w-6 h-6 text-amber-400" />
            ) : (
              <Activity className="w-6 h-6 text-orange-400" />
            )}
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                Real-World Sensor Ranges • Relay 1CH/2CH/4CH • Servo 180° &amp; 360°
              </span>
              <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
                {mode === "wokwi"
                  ? "Wokwi IoT Studio — Parameter Sensor Asli, Relay Multi-Channel, Solenoid/Pompa & Tutorial Proyek"
                  : mode === "ewb"
                  ? "EWB (Electronics Workbench) — Rangkaian RLC, Resistor 4-Gelang & Pin Fisik"
                  : "MATLAB Simulink — Diagram Blok Sistem Kendali PID"}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {mode === "wokwi" && (
              <button
                type="button"
                onClick={() => setBukaDashboardIot(!bukaDashboardIot)}
                className={`px-3 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer ${
                  bukaDashboardIot
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-emerald-300"
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                {bukaDashboardIot ? "Tutup IoT Cloud/Blynk" : "Buka Dashboard IoT & Blynk"}
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2">
                Ukuran Kanvas:
              </span>
              {(
                [
                  { id: "kecil", label: "Kecil" },
                  { id: "sedang", label: "Sedang" },
                  { id: "besar", label: "Besar" },
                  { id: "penuh", label: "Penuh" },
                ] as const
              ).map((uk) => (
                <button
                  key={uk.id}
                  type="button"
                  onClick={() => setUkuranKanvas(uk.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-black text-[11px] cursor-pointer transition ${
                    ukuranKanvas === uk.id
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {uk.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSkalaZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-bold px-1.5 text-amber-300">
                {Math.round(skalaZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setSkalaZoom((z) => Math.min(1.35, +(z + 0.15).toFixed(2)))
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================================
            PANEL TUTORIAL & CONTOH PROJECT JADI (SEDERHANA S/D KOMPLEKS)
           ==================================================================== */}
        {mode === "wokwi" && (
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-950 to-emerald-950/90 p-5 rounded-3xl border border-indigo-500/40 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span className="font-black text-xs sm:text-sm uppercase text-amber-300">
                  Tutorial &amp; Contoh Rangkaian Project Jadi (Klik untuk Memuat Rangkaian +
                  Kabel + Kode C++ Otomatis):
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300">
                Aktif: {projectAktif.level}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DAFTAR_TUTORIAL_PROJECT_WOKWI.map((proj) => {
                const dipilih = projectAktif.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => muatPresetTutorialProject(proj)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                      dipilih
                        ? "bg-indigo-600/30 border-amber-400 text-white shadow-lg"
                        : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                        {proj.level}
                      </span>
                      <div className="font-black text-xs text-white mt-1.5 leading-snug">
                        {proj.judul}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Muat Rangkaian &amp; Kode
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail Panduan Langkah Wiring Proyek Aktif */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
              <div className="lg:col-span-5 space-y-1">
                <div className="font-black text-amber-300">{projectAktif.judul}</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {projectAktif.deskripsiSingkat}
                </p>
              </div>
              <div className="lg:col-span-7 space-y-1">
                <div className="font-black text-emerald-300 uppercase text-[10px]">
                  📋 Panduan Langkah Penyambungan Pin (Wiring Tutorial):
                </div>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-slate-200 font-medium">
                  {projectAktif.langkahWiring.map((lw, i) => (
                    <li key={i}>{lw}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* GUDANG KOMPONEN BERKATEGORI + PREVIEW GAMBAR MINI */}
        <div className="bg-slate-950/90 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Move className="w-4 h-4 text-amber-400" />
              <span className="font-black uppercase text-amber-300">
                Gudang Komponen ({komponenPaletTersaring.length} Item): Tarik (Drag &amp; Drop) atau
                Klik untuk Menaruh ke Meja Rangkaian
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cariKomponen}
                onChange={(e) => setCariKomponen(e.target.value)}
                placeholder="Cari Relay 4CH, Solenoid, Servo 360..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0 mr-1" />
            {daftarKategoriUnik.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setKategoriPaletAktif(kat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                  kategoriPaletAktif === kat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {komponenPaletTersaring.map((item, idx) => {
              const layoutInfo = ambilLayoutFisikKomponen(item.tipe);
              return (
                <div
                  key={`${item.tipe}-${idx}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/hibahilmu-component",
                      JSON.stringify(item)
                    );
                  }}
                  onClick={() =>
                    tambahKomponenKeKanvas(
                      item.tipe,
                      item.label,
                      80 + (idx % 6) * 65,
                      70 + Math.floor(idx / 6) * 60,
                      item.defaultResistor,
                      item.defaultSensor
                    )
                  }
                  className="p-2 rounded-2xl bg-slate-900 hover:bg-indigo-950/90 border border-slate-800 hover:border-emerald-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1 transition group"
                >
                  <div className="w-full flex justify-between items-center text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300">
                    <span className="truncate">{item.kategori.split(" ")[0]}</span>
                    <span className="text-amber-300 shrink-0">{layoutInfo.pins.length}p</span>
                  </div>

                  <div className="h-11 flex items-center justify-center py-0.5 group-hover:scale-105 transition-transform">
                    <VisualKomponenRealistis
                      tipe={item.tipe}
                      nilaiResistor={item.defaultResistor || 220}
                      nilaiSensor={item.defaultSensor || 25}
                      nyala={true}
                      ukuran="ikon"
                    />
                  </div>

                  <div className="font-bold text-[10px] text-white group-hover:text-emerald-300 leading-tight line-clamp-1">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BAR PILIH WARNA KABEL & INDIKATOR PIN YANG SEDANG DIDEKATI (HOVER) */}
        <div className="bg-slate-950/95 p-3.5 rounded-3xl border border-indigo-500/30 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-emerald-400 shrink-0" />
            {hoveredPinInfo ? (
              <div className="font-mono text-xs bg-slate-900 border border-amber-400/60 px-3 py-1 rounded-xl text-white">
                📍 <b>{hoveredPinInfo.nodeLabel}</b> ➔{" "}
                <span className="text-amber-300 font-black">
                  Pin #{hoveredPinInfo.pin.nomorPin}: {hoveredPinInfo.pin.nama}
                </span>{" "}
                <span className="text-slate-300">({hoveredPinInfo.pin.keterangan})</span>
              </div>
            ) : (
              <span className="font-bold text-slate-300">
                Dekatkan kursor ke titik pin pada komponen (Relay NO/COM/NC, ESP32, Solenoid, Pompa)
                untuk melihat fungsi pin, lalu klik titik tersebut untuk menarik kabel!
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              Warna Kabel:
            </span>
            {PILIHAN_WARNA_KABEL.map((w) => (
              <button
                key={w.hex}
                type="button"
                onClick={() => {
                  setWarnaKabelAktif(w.hex);
                  if (idKabelTerpilih) ubahWarnaKabel(idKabelTerpilih, w.hex);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border cursor-pointer ${
                  warnaKabelAktif === w.hex
                    ? "bg-white text-slate-950 border-white"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                <span
                  style={{ backgroundColor: w.hex }}
                  className="w-2.5 h-2.5 rounded-full inline-block"
                />
                <span>{w.nama.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================================
            AREA UTAMA: KANVAS DRAG & DROP (8 KOLOM) + INSPEKTOR REALISTIS (4 KOLOM)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KANVAS DRAG-AND-DROP INTERAKTIF */}
          <div
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropDariPalet}
            onMouseMove={handleMouseMoveKanvas}
            onMouseUp={() => {
              setSedangGeserId(null);
              setSedangGeserSiku(null);
            }}
            onMouseLeave={() => {
              setSedangGeserId(null);
              setSedangGeserSiku(null);
            }}
            onClick={() => {
              setIdKabelTerpilih(null);
              if (sedangTarikKabelDariPin) setSedangTarikKabelDariPin(null);
            }}
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-8"
            } ${tinggiKanvasPx} rounded-3xl bg-[#070d19] border-2 border-dashed border-slate-700 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px]`}
          >
            {/* FLOATING POP-UP TOOLBAR SAAT KABEL DIKLIK */}
            {kabelTerpilihObj && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="sticky top-3 left-3 z-40 inline-flex flex-wrap items-center gap-2 bg-slate-900/95 border-2 border-amber-400 px-3.5 py-2 rounded-2xl shadow-2xl text-xs ml-3 mt-3"
              >
                <span className="font-black text-amber-300 flex items-center gap-1">
                  <CornerDownRight className="w-3.5 h-3.5" /> Kabel [{kabelTerpilihObj.pinAsal} ➔{" "}
                  {kabelTerpilihObj.pinTujuan}]:
                </span>
                <div className="flex items-center gap-1">
                  {PILIHAN_WARNA_KABEL.map((w) => (
                    <button
                      key={w.hex}
                      type="button"
                      onClick={() => ubahWarnaKabel(kabelTerpilihObj.id, w.hex)}
                      style={{ backgroundColor: w.hex }}
                      className={`w-5 h-5 rounded-full cursor-pointer ${
                        kabelTerpilihObj.warna === w.hex
                          ? "ring-2 ring-white scale-115"
                          : "opacity-75 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => tambahTitikSikuPadaKabel(kabelTerpilihObj.id)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] cursor-pointer"
                >
                  + Tambah Titik Siku
                </button>
                <button
                  type="button"
                  onClick={() => hapusKabel(kabelTerpilihObj.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] cursor-pointer"
                >
                  ✕ Hapus Kabel
                </button>
              </div>
            )}

            <div
              style={{
                transform: `scale(${skalaZoom})`,
                transformOrigin: "top left",
                width: `${100 / skalaZoom}%`,
                height: `${100 / skalaZoom}%`,
              }}
              className="relative w-full h-full min-w-[760px] min-h-[440px]"
            >
              {/* LAYER SVG GARIS KABEL SIKU ORTHOGONAL */}
              <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                {kabelSaatIni.map((kbl) => {
                  const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  if (!asal || !tujuan) return null;

                  const koorAsal = cariKoordinatPinAbsolut(asal, kbl.pinAsal);
                  const koorTujuan = cariKoordinatPinAbsolut(tujuan, kbl.pinTujuan);

                  const { d, daftarHandle } = bangunJalurSikuWokwi(
                    koorAsal.x,
                    koorAsal.y,
                    koorTujuan.x,
                    koorTujuan.y,
                    kbl.titikSiku
                  );
                  const apakahTerpilih = idKabelTerpilih === kbl.id;

                  return (
                    <g key={kbl.id} className="pointer-events-auto">
                      <path
                        d={d}
                        stroke="transparent"
                        strokeWidth="16"
                        fill="none"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />
                      <path
                        d={d}
                        stroke={kbl.warna}
                        strokeWidth={apakahTerpilih ? "4.5" : "3"}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />
                      <circle cx={koorAsal.x} cy={koorAsal.y} r="4" fill={kbl.warna} />
                      <circle cx={koorTujuan.x} cy={koorTujuan.y} r="4" fill={kbl.warna} />

                      {apakahTerpilih &&
                        daftarHandle.map((pt, hIdx) => (
                          <circle
                            key={hIdx}
                            cx={pt.x}
                            cy={pt.y}
                            r="7.5"
                            fill="#facc15"
                            stroke="#0f172a"
                            strokeWidth="2.5"
                            className="cursor-grab active:cursor-grabbing"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setSedangGeserSiku({
                                kabelId: kbl.id,
                                indeksTitik: hIdx,
                              });
                            }}
                          />
                        ))}
                    </g>
                  );
                })}

                {sedangTarikKabelDariPin && (
                  <path
                    d={
                      bangunJalurSikuWokwi(
                        sedangTarikKabelDariPin.xAsal,
                        sedangTarikKabelDariPin.yAsal,
                        posisiKursorKanvas.x,
                        posisiKursorKanvas.y
                      ).d
                    }
                    stroke={warnaKabelAktif}
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                )}
              </svg>

              {/* TOOLTIP MELAYANG SAAT KURSOR MENDEKATI TITIK PIN FISIK */}
              {hoveredPinInfo && (
                <div
                  style={{
                    left: `${Math.min(520, Math.max(10, hoveredPinInfo.absX - 60))}px`,
                    top: `${Math.max(8, hoveredPinInfo.absY - 52)}px`,
                  }}
                  className="absolute z-50 pointer-events-none bg-slate-950/95 border-2 border-amber-400 text-white px-3 py-1.5 rounded-xl shadow-2xl text-[11px] font-mono whitespace-nowrap"
                >
                  <div className="font-black text-amber-300">
                    ● {hoveredPinInfo.pin.nama} (Pin #{hoveredPinInfo.pin.nomorPin})
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {hoveredPinInfo.pin.keterangan}
                  </div>
                </div>
              )}

              {/* RENDER SETIAP KOMPONEN BESERTA TITIK-TITIK PIN FISIKNYA */}
              {nodesSaatIni.map((node) => {
                const aktif = komponenTerpilih?.id === node.id;
                const layout = ambilLayoutFisikKomponen(node.tipe);

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${layout.lebar}px`,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIdKomponenTerpilih(node.id);
                      setSedangGeserId(node.id);
                    }}
                    className={`absolute rounded-2xl cursor-move transition-shadow ${
                      aktif ? "ring-2 ring-emerald-400/80 z-10" : "z-10"
                    }`}
                  >
                    <div className="h-[18px] px-2 flex justify-between items-center bg-slate-900/90 rounded-t-xl border-x border-t border-slate-700 text-[9.5px] font-black text-amber-300 truncate">
                      <span className="truncate">{node.label}</span>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0 ml-1">
                        {layout.pins.length}p
                      </span>
                    </div>

                    <div
                      style={{
                        width: `${layout.lebar}px`,
                        height: `${layout.tinggi}px`,
                      }}
                      className="relative bg-slate-950/40 rounded-b-xl"
                    >
                      <VisualKomponenRealistis
                        tipe={node.tipe}
                        nilaiResistor={node.nilaiResistor}
                        nyala={node.nyala}
                        nilaiSensor={node.nilaiSensor}
                        ukuran="kanvas"
                      />

                      {layout.pins.map((pin) => {
                        const sedangAsal =
                          sedangTarikKabelDariPin?.nodeId === node.id &&
                          sedangTarikKabelDariPin?.pin.idPin === pin.idPin;
                        const warnaDot = warnaTitikPin(pin.kategori);

                        return (
                          <button
                            key={pin.idPin}
                            type="button"
                            style={{
                              left: `${pin.x - 5}px`,
                              top: `${pin.y - 5}px`,
                              backgroundColor: sedangAsal ? "#ffffff" : warnaDot,
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseEnter={() =>
                              setHoveredPinInfo({
                                nodeLabel: node.label,
                                pin,
                                absX: node.x + pin.x,
                                absY: node.y + pin.y + 18,
                              })
                            }
                            onMouseLeave={() => setHoveredPinInfo(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              const absX = node.x + pin.x;
                              const absY = node.y + pin.y + 18;

                              if (!sedangTarikKabelDariPin) {
                                if (pin.kategori === "POWER") setWarnaKabelAktif("#ef4444");
                                else if (pin.kategori === "GND") setWarnaKabelAktif("#94a3b8");
                                else if (pin.kategori === "UART") setWarnaKabelAktif("#22c55e");

                                setSedangTarikKabelDariPin({
                                  nodeId: node.id,
                                  nodeLabel: node.label,
                                  pin,
                                  xAsal: absX,
                                  yAsal: absY,
                                });
                                setPosisiKursorKanvas({ x: absX, y: absY });
                              } else {
                                tambahKabelKoneksi(
                                  sedangTarikKabelDariPin.nodeId,
                                  sedangTarikKabelDariPin.pin.idPin,
                                  node.id,
                                  pin.idPin,
                                  warnaKabelAktif
                                );
                                setSedangTarikKabelDariPin(null);
                              }
                            }}
                            className={`absolute w-[10px] h-[10px] rounded-full border border-slate-950 cursor-crosshair transition-transform hover:scale-175 hover:ring-2 hover:ring-white z-30 ${
                              sedangAsal ? "scale-175 ring-2 ring-amber-300 animate-ping" : ""
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL SAMPING KANAN (4 KOLOM): INSPEKTOR REALISTIS & TABEL PINOUT */}
          <div
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-4"
            } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[620px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Inspector Parameter Realistis
              </span>
              {komponenTerpilih && (
                <button
                  type="button"
                  onClick={() => {
                    setDaftarNode({
                      ...daftarNode,
                      [mode]: nodesSaatIni.filter((n) => n.id !== komponenTerpilih.id),
                    });
                    setIdKomponenTerpilih(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              )}
            </div>

            {komponenTerpilih && layoutTerpilih && rentangTerpilih && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Nama Komponen Terpilih:
                  </label>
                  <input
                    type="text"
                    value={komponenTerpilih.label}
                    onChange={(e) =>
                      updatePropertiKomponen(komponenTerpilih.id, {
                        label: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                  />
                </div>

                {/* JIKA RESISTOR: EDITOR OHM & GELANG WARNA */}
                {komponenTerpilih.tipe === "resistor" ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                    <div className="font-black text-amber-300 uppercase text-[11px]">
                      🎨 Nilai Hambatan &amp; Gelang Warna
                    </div>
                    <div className="flex justify-center">
                      <ResistorVisualSvg
                        nilaiOhm={komponenTerpilih.nilaiResistor || 1000}
                        ukuran="besar"
                      />
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={10000000}
                      value={komponenTerpilih.nilaiResistor || 1000}
                      onChange={(e) =>
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nilaiResistor: Math.max(1, Number(e.target.value)),
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono font-black text-amber-300"
                    />
                    <div className="grid grid-cols-3 gap-1">
                      {[220, 330, 1000, 2200, 4700, 10000].map((ohm) => (
                        <button
                          key={ohm}
                          type="button"
                          onClick={() =>
                            updatePropertiKomponen(komponenTerpilih.id, {
                              nilaiResistor: ohm,
                            })
                          }
                          className="py-1 px-2 rounded bg-slate-950 border border-slate-800 hover:border-amber-400 font-mono text-[10px] font-bold text-slate-300 cursor-pointer"
                        >
                          {hitungGelangWarnaResistor(ohm).labelSingkat}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
                    <div className="text-[11px] font-black text-emerald-300 uppercase">
                      ⚙️ {rentangTerpilih.labelParameter}
                    </div>

                    {/* HANYA TAMPILKAN SLIDER JIKA KOMPONEN MEMILIKI RENTANG FISIK (BUKAN ON/OFF MURNI) */}
                    {rentangTerpilih.punyaSlider ? (
                      <>
                        <div className="flex justify-between items-center font-mono text-xs">
                          <span className="text-slate-400">
                            Min: {rentangTerpilih.min} {rentangTerpilih.satuan}
                          </span>
                          <span className="text-base font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-amber-400/40">
                            {komponenTerpilih.nilaiSensor ?? rentangTerpilih.defaultVal}{" "}
                            {rentangTerpilih.satuan}
                          </span>
                          <span className="text-slate-400">
                            Max: {rentangTerpilih.max} {rentangTerpilih.satuan}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={rentangTerpilih.min}
                          max={rentangTerpilih.max}
                          step={rentangTerpilih.step}
                          value={komponenTerpilih.nilaiSensor ?? rentangTerpilih.defaultVal}
                          onChange={(e) =>
                            updatePropertiKomponen(komponenTerpilih.id, {
                              nilaiSensor: Number(e.target.value),
                            })
                          }
                          className="w-full accent-emerald-400 cursor-pointer"
                        />
                      </>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-semibold">
                        ⚡ Komponen ini bekerja secara Digital Sakelar <b>ON / OFF</b> (Tidak
                        menggunakan rentang sudut 0–180). Gunakan tombol sakelar di bawah atau
                        hubungkan ke Modul Relay!
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {rentangTerpilih.catatanFisik}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        const statusBaru = !komponenTerpilih.nyala;
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nyala: statusBaru,
                        });
                        // Jika yang di-toggle adalah Modul Relay, otomatis sinkronkan Solenoid/Pompa yang terhubung ke Relay tersebut!
                        if (komponenTerpilih.tipe.startsWith("relay_")) {
                          const idTerhubung = kabelSaatIni
                            .filter(
                              (k) =>
                                k.dariId === komponenTerpilih.id ||
                                k.keId === komponenTerpilih.id
                            )
                            .map((k) =>
                              k.dariId === komponenTerpilih.id ? k.keId : k.dariId
                            );
                          setDaftarNode({
                            ...daftarNode,
                            [mode]: nodesSaatIni.map((nd) =>
                              nd.id === komponenTerpilih.id ||
                              (idTerhubung.includes(nd.id) &&
                                (nd.tipe === "solenoid_lock" ||
                                  nd.tipe === "water_pump" ||
                                  nd.tipe === "kipas_dc" ||
                                  nd.tipe.startsWith("led_")))
                                ? { ...nd, nyala: statusBaru }
                                : nd
                            ),
                          });
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl font-black flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        komponenTerpilih.nyala
                          ? "bg-emerald-500 text-slate-950 shadow-lg"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {komponenTerpilih.nyala
                        ? "STATUS: ON / HIGH (AKTIF)"
                        : "STATUS: OFF / LOW (MATI)"}
                    </button>
                  </div>
                )}

                {/* TABEL REFERENSI PINOUT TERPISAH */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-300 uppercase text-[11px] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Daftar &amp; Keterangan Pin (
                      {layoutTerpilih.pins.length} Titik)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {layoutTerpilih.fungsiUtama}
                  </p>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 pt-1">
                    {layoutTerpilih.pins.map((p) => (
                      <div
                        key={p.idPin}
                        onClick={() => {
                          const absX = komponenTerpilih.x + p.x;
                          const absY = komponenTerpilih.y + p.y + 18;
                          setSedangTarikKabelDariPin({
                            nodeId: komponenTerpilih.id,
                            nodeLabel: komponenTerpilih.label,
                            pin: p,
                            xAsal: absX,
                            yAsal: absY,
                          });
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer space-y-0.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-amber-300 flex items-center gap-1.5">
                            <span
                              style={{ backgroundColor: warnaTitikPin(p.kategori) }}
                              className="w-2.5 h-2.5 rounded-full inline-block"
                            />
                            #{p.nomorPin} {p.nama}
                          </span>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                            {p.sisi}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 pl-4">
                          {p.keterangan}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-[10px] font-black uppercase text-indigo-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multimeter Rangkaian
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Hambatan:</span>
                <b className="text-amber-300">{totalOhmKanvas} Ω</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arus Mengalir:</span>
                <b className="text-sky-300">{arusRangkaianMa.toFixed(2)} mA</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DASHBOARD IOT CLOUD: DRAG & DROP BLYNK STUDIO, DUAL-MCU UART, MQTT & WIFI */}
      {mode === "wokwi" && bukaDashboardIot && (
        <IotCloudBlynkPanel
          nodesKanvas={nodesSaatIni}
          onUpdateNodeDariCloud={(id, perubahan) =>
            updatePropertiKomponen(id, perubahan)
          }
          onGenerateKodeIotKeEditor={onUpdateKodeDariCloud}
        />
      )}
    </div>
  );
};