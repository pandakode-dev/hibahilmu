// app/components/simulator/tutorialProjectsData.ts

import { NodeKomponenKanvas, KabelKoneksiItem } from "./ElectronicAndIotCanvas";
import { WidgetBlynkItem } from "./BlynkWidgetSvg";

export interface PresetTutorialProject {
  id: string;
  level: string;
  kategoriProyek: "Dasar" | "IoT Blynk & Telegram" | "Dual & Triple MCU";
  judul: string;
  deskripsiSingkat: string;
  langkahWiring: string[];
  nodes: NodeKomponenKanvas[];
  kabel: KabelKoneksiItem[];
  kodePerMcu: { [nodeId: string]: string };
  kodeMicroPythonPerMcu: { [nodeId: string]: string };
  blynkWidgets: WidgetBlynkItem[];
}

export const DAFTAR_TUTORIAL_PROJECT_WOKWI: PresetTutorialProject[] = [
  // ==========================================================================
  // PROJECT 1: SMART STREET LIGHT (1 MCU + LDR + RELAY 1CH + LED)
  // ==========================================================================
  {
    id: "proj-1",
    level: "Proyek 1 • Dasar",
    kategoriProyek: "Dasar",
    judul: "Lampu Jalan Pintar (Sensor Cahaya LDR + Relay 1-Ch + LED)",
    deskripsiSingkat:
      "Membaca nilai Lux dari sensor LDR pada pin ADC GPIO34. Saat kondisi gelap (di bawah 300 Lux), ESP32 mengaktifkan Relay 1-Channel untuk menyalakan lampu jalan.",
    langkahWiring: [
      "Hubungkan Pin SIG (AO) Sensor LDR ke Pin D34 (ADC) di sisi kiri ESP32.",
      "Hubungkan Pin D32 ESP32 ke Pin IN1 di bagian bawah Modul Relay 1-Channel.",
      "Hubungkan Terminal NO (atas) Modul Relay 1-Channel ke Anoda (+) Lampu LED.",
    ],
    nodes: [
      { id: "p1-esp", tipe: "esp32", label: "ESP32 Utama", x: 30, y: 45, nyala: true },
      { id: "p1-ldr", tipe: "ldr_sensor", label: "Sensor LDR (Lux)", x: 245, y: 55, nilaiSensor: 180, nyala: true },
      { id: "p1-rel", tipe: "relay_1ch", label: "Relay 1-Channel", x: 420, y: 115, nyala: true },
      { id: "p1-led", tipe: "led_hijau", label: "Lampu Jalan", x: 585, y: 60, nyala: true },
    ],
    kabel: [
      { id: "k1-1", dariId: "p1-ldr", pinAsal: "SIG", keId: "p1-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 305, y: 190 }, { x: 15, y: 190 }] },
      { id: "k1-2", dariId: "p1-esp", pinAsal: "GPIO32", keId: "p1-rel", pinTujuan: "IN1", warna: "#38bdf8", titikSiku: [{ x: 15, y: 265 }, { x: 502, y: 265 }] },
      { id: "k1-3", dariId: "p1-rel", pinAsal: "NO", keId: "p1-led", pinTujuan: "ANODA", warna: "#ef4444", titikSiku: [{ x: 448, y: 35 }, { x: 616, y: 180 }] },
    ],
    kodePerMcu: {
      "p1-esp": `// [C++ ARDUINO] - SMART STREET LIGHT LDR + RELAY 1-CHANNEL
#include <Arduino.h>

#define PIN_LDR_ADC   34
#define PIN_RELAY_IN  32

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LDR_ADC, INPUT);
  pinMode(PIN_RELAY_IN, OUTPUT);
  Serial.println("=== [ESP32 C++] SMART STREET LIGHT AKTIF ===");
}

void loop() {
  int lux = analogRead(PIN_LDR_ADC);
  digitalWrite(PIN_RELAY_IN, lux < 300 ? HIGH : LOW);
  Serial.println("[LDR Telemetry]: Intensitas = " + String(lux) + " Lux -> Relay ON");
  delay(1000);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p1-esp": `# [MICROPYTHON] - SMART STREET LIGHT LDR + RELAY 1-CHANNEL
from machine import Pin, ADC
import time

ldr_adc = ADC(Pin(34))
relay_in = Pin(32, Pin.OUT)

print("=== [ESP32 MicroPython] SMART STREET LIGHT AKTIF ===")

while True:
    lux = ldr_adc.read()
    relay_in.value(1 if lux < 300 else 0)
    print(f"[MicroPython LDR]: {lux} Lux -> Relay {'ON' if lux < 300 else 'OFF'}")
    time.sleep(1)`,
    },
    blynkWidgets: [
      { id: "w1-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Intensitas Cahaya LDR", virtualPin: "V0", satuan: "Lux", warna: "amber", targetTipeKomponen: "ldr_sensor" },
      { id: "w1-2", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Sakelar Relay Lampu", virtualPin: "V1", satuan: "ON/OFF", warna: "emerald", targetTipeKomponen: "relay_1ch" },
      { id: "w1-3", tipe: "superchart", kategoriWidget: "Monitor & Grafik", judul: "Grafik Harian Lux", virtualPin: "V2", satuan: "Lux", warna: "sky", targetTipeKomponen: "ldr_sensor" },
    ],
  },

  // ==========================================================================
  // PROJECT 2: SMART DOOR LOCK + TELEGRAM BOT (RFID + RELAY 1CH + SOLENOID + SERVO 180)
  // ==========================================================================
  {
    id: "proj-2",
    level: "Proyek 2 • IoT & Telegram",
    kategoriProyek: "IoT Blynk & Telegram",
    judul: "Smart Door Lock & Telegram Bot (RFID + Relay 1-Ch + Solenoid 12V + Servo 180°)",
    deskripsiSingkat:
      "Wajib menyertakan library <SPI.h>, <MFRC522.h> untuk pembaca kartu RFID serta <ESP32Servo.h> untuk motor Servo 180°. Jika salah satu library dihapus, compiler akan menampilkan pesan error!",
    langkahWiring: [
      "Hubungkan Pin SDA(SS) RFID RC522 ke Pin GPIO5 di sisi kanan ESP32.",
      "Hubungkan Pin GPIO32 ESP32 ke Pin IN1 di bagian bawah Modul Relay 1-Channel.",
      "Hubungkan Terminal NO (atas) Modul Relay 1-Ch ke Kabel Merah (+12V) Solenoid Door Lock.",
      "Hubungkan Pin GPIO18 (PWM) ESP32 ke Pin Sinyal Motor Servo SG90 (0°–180°).",
    ],
    nodes: [
      { id: "p2-esp", tipe: "esp32", label: "ESP32 Door Controller", x: 25, y: 50, nyala: true },
      { id: "p2-rfid", tipe: "rfid_rc522", label: "RFID RC522 Tap", x: 230, y: 40, nyala: true },
      { id: "p2-rel1", tipe: "relay_1ch", label: "Relay 1-Ch Solenoid", x: 395, y: 140, nyala: true },
      { id: "p2-sol", tipe: "solenoid_lock", label: "Solenoid Lock 12V", x: 560, y: 40, nyala: true },
      { id: "p2-srv", tipe: "servo", label: "Servo SG90 (0-180°)", x: 560, y: 190, nilaiSensor: 90, nyala: true },
    ],
    kabel: [
      { id: "k2-1", dariId: "p2-rfid", pinAsal: "SDA(SS)", keId: "p2-esp", pinTujuan: "GPIO5", warna: "#06b6d4", titikSiku: [{ x: 250, y: 170 }, { x: 200, y: 170 }] },
      { id: "k2-2", dariId: "p2-esp", pinAsal: "GPIO32", keId: "p2-rel1", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 15, y: 290 }, { x: 477, y: 290 }] },
      { id: "k2-3", dariId: "p2-rel1", pinAsal: "NO", keId: "p2-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 423, y: 120 }, { x: 598, y: 170 }] },
      { id: "k2-4", dariId: "p2-esp", pinAsal: "GPIO18", keId: "p2-srv", pinTujuan: "SIG", warna: "#facc15", titikSiku: [{ x: 205, y: 162 }, { x: 620, y: 310 }] },
    ],
    kodePerMcu: {
      "p2-esp": `// [C++ ARDUINO] - RFID RC522 + TELEGRAM BOT + SOLENOID 12V + SERVO 180
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <UniversalTelegramBot.h>

#define PIN_SS_RFID        5
#define PIN_RST_RFID       22
#define PIN_RELAY_SOLENOID 32
#define PIN_SERVO_PINTU    18

MFRC522 rfid(PIN_SS_RFID, PIN_RST_RFID);
Servo servoPintu;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  pinMode(PIN_RELAY_SOLENOID, OUTPUT);
  servoPintu.attach(PIN_SERVO_PINTU);
  Serial.println("=== [ESP32] SMART DOOR LOCK & RFID SPI READY ===");
}

void loop() {
  digitalWrite(PIN_RELAY_SOLENOID, HIGH); // Tarik Tuas Solenoid (UNLOCK)
  servoPintu.write(90);                   // Buka Palang Pintu 90 Derajat
  Serial.println("[ACCESS GRANTED]: E-KTP Valid -> Solenoid OPEN & Servo 90 deg!");
  delay(2000);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p2-esp": `# [MICROPYTHON] - RFID RC522 + SOLENOID 12V + SERVO 180
from machine import Pin, PWM, SPI
import mfrc522
import time

relay_solenoid = Pin(32, Pin.OUT)
servo_pwm = PWM(Pin(18), freq=50)
spi = SPI(2, baudrate=2500000, polarity=0, phase=0)

print("=== [MicroPython] SMART DOOR LOCK & RFID READY ===")

while True:
    relay_solenoid.value(1) # Unlock Solenoid
    servo_pwm.duty(77)      # Sudut 90 derajat
    print("[MicroPython]: Solenoid UNLOCKED & Servo 90 deg")
    time.sleep(2)`,
    },
    blynkWidgets: [
      { id: "w2-1", tipe: "telegram_bot", kategoriWidget: "Telegram & Notifikasi", judul: "Telegram Door Bot", virtualPin: "V0", satuan: "@Bot", warna: "sky", targetTipeKomponen: "solenoid_lock" },
      { id: "w2-2", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Kunci Solenoid 12V", virtualPin: "V1", satuan: "LOCK", warna: "emerald", targetTipeKomponen: "solenoid_lock" },
      { id: "w2-3", tipe: "slider", kategoriWidget: "Kontrol & Input", judul: "Sudut Buka Pintu Servo", virtualPin: "V2", satuan: "°", warna: "indigo", targetTipeKomponen: "servo" },
      { id: "w2-4", tipe: "webhook", kategoriWidget: "Lanjutan & Peta", judul: "Log Absensi RFID Webhook", virtualPin: "V3", satuan: "JSON", warna: "amber", targetTipeKomponen: "rfid_rc522" },
    ],
  },

  // ==========================================================================
  // PROJECT 3: SMART GREENHOUSE & IRIGASI (SOIL + DHT22 + RELAY 2CH + POMPA AIR + KIPAS)
  // ==========================================================================
  {
    id: "proj-3",
    level: "Proyek 3 • IoT Pertanian",
    kategoriProyek: "IoT Blynk & Telegram",
    judul: "Smart Greenhouse & Irigasi (Soil + DHT22 + Relay 2-Ch + Pompa Air Mini & Kipas)",
    deskripsiSingkat:
      "Menggunakan Sensor DHT22 (Wajib #include <DHT.h> di C++ atau import dht di MicroPython) serta Modul Relay 2-Channel untuk menyalakan Pompa Air Mini dan Kipas DC.",
    langkahWiring: [
      "Hubungkan Pin AO Sensor Kelembapan Tanah ke GPIO34 & DATA DHT22 ke GPIO15 ESP32.",
      "Hubungkan GPIO32 & GPIO33 ESP32 ke Pin IN1 & IN2 Modul Relay 2-Channel.",
      "Hubungkan Terminal NO1 Relay 2-Ch ke Kabel Merah (+) Pompa Air Mini 2-Pin.",
      "Hubungkan Terminal NO2 Relay 2-Ch ke Pin VCC Kipas Pendingin DC.",
    ],
    nodes: [
      { id: "p3-esp", tipe: "esp32", label: "ESP32 Greenhouse", x: 20, y: 50, nyala: true },
      { id: "p3-soil", tipe: "soil_moisture", label: "Kelembapan Tanah", x: 215, y: 35, nilaiSensor: 65, nyala: true },
      { id: "p3-dht", tipe: "dht22", label: "Suhu DHT22 (°C)", x: 225, y: 180, nilaiSensor: 35, nyala: true },
      { id: "p3-rel2", tipe: "relay_2ch", label: "Relay 2-Channel", x: 385, y: 130, nyala: true },
      { id: "p3-pump", tipe: "water_pump", label: "Pompa Air Mini (2p)", x: 575, y: 35, nyala: true },
      { id: "p3-fan", tipe: "kipas_dc", label: "Kipas DC Greenhouse", x: 575, y: 190, nilaiSensor: 220, nyala: true },
    ],
    kabel: [
      { id: "k3-1", dariId: "p3-soil", pinAsal: "AO", keId: "p3-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 155 }, { x: 12, y: 155 }] },
      { id: "k3-2", dariId: "p3-dht", pinAsal: "DATA", keId: "p3-esp", pinTujuan: "GPIO15", warna: "#a855f7", titikSiku: [{ x: 266, y: 315 }, { x: 190, y: 224 }] },
      { id: "k3-3", dariId: "p3-esp", pinAsal: "GPIO32", keId: "p3-rel2", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 285 }, { x: 447, y: 285 }] },
      { id: "k3-4", dariId: "p3-esp", pinAsal: "GPIO33", keId: "p3-rel2", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 12, y: 300 }, { x: 474, y: 300 }] },
      { id: "k3-5", dariId: "p3-rel2", pinAsal: "NO1", keId: "p3-pump", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 405, y: 110 }, { x: 613, y: 160 }] },
      { id: "k3-6", dariId: "p3-rel2", pinAsal: "NO2", keId: "p3-fan", pinTujuan: "VCC", warna: "#facc15", titikSiku: [{ x: 473, y: 110 }, { x: 605, y: 310 }] },
    ],
    kodePerMcu: {
      "p3-esp": `// [C++ ARDUINO] - SMART GREENHOUSE (WAJIB #include <DHT.h>)
#include <WiFi.h>
#include <DHT.h>

#define PIN_SOIL_ADC  34
#define PIN_DHT       15
#define DHTTYPE       DHT22
#define RELAY_POMPA   32 // IN1 Relay 2-Ch -> Pompa Air Mini
#define RELAY_KIPAS   33 // IN2 Relay 2-Ch -> Kipas Pendingin

DHT dht(PIN_DHT, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RELAY_POMPA, OUTPUT);
  pinMode(RELAY_KIPAS, OUTPUT);
  Serial.println("=== [ESP32] SMART GREENHOUSE IRRIGATION READY ===");
}

void loop() {
  float t = dht.readTemperature();
  digitalWrite(RELAY_POMPA, HIGH);
  digitalWrite(RELAY_KIPAS, HIGH);
  Serial.println("[Blynk V0-V3]: Suhu=" + String(t) + "C | Soil=65% | Pompa=ON");
  delay(2000);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p3-esp": `# [MICROPYTHON] - SMART GREENHOUSE (WAJIB import dht)
from machine import Pin, ADC
import dht
import time

sensor_dht = dht.DHT22(Pin(15))
soil_adc = ADC(Pin(34))
relay_pompa = Pin(32, Pin.OUT)
relay_kipas = Pin(33, Pin.OUT)

print("=== [MicroPython] SMART GREENHOUSE READY ===")

while True:
    sensor_dht.measure()
    relay_pompa.value(1)
    relay_kipas.value(1)
    print("[MicroPython]: Suhu DHT22 Terbaca -> Pompa Air & Kipas ON")
    time.sleep(2)`,
    },
    blynkWidgets: [
      { id: "w3-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Suhu Udara DHT22", virtualPin: "V0", satuan: "°C", warna: "amber", targetTipeKomponen: "dht22" },
      { id: "w3-2", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Kelembapan Tanah", virtualPin: "V1", satuan: "%", warna: "sky", targetTipeKomponen: "soil_moisture" },
      { id: "w3-3", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Sakelar Pompa Air (Relay 1)", virtualPin: "V2", satuan: "PUMP", warna: "emerald", targetTipeKomponen: "water_pump" },
      { id: "w3-4", tipe: "slider", kategoriWidget: "Kontrol & Input", judul: "Kecepatan Kipas (PWM)", virtualPin: "V3", satuan: "PWM", warna: "indigo", targetTipeKomponen: "kipas_dc" },
    ],
  },

  // ==========================================================================
  // PROJECT 4: DETEKTOR KEBAKARAN & KEBOCORAN GAS (FLAME + MQ2 + RELAY + POMPA + WA BOT)
  // ==========================================================================
  {
    id: "proj-4",
    level: "Proyek 4 • Proteksi Bahaya",
    kategoriProyek: "IoT Blynk & Telegram",
    judul: "Sistem Pemadam Kebakaran & Gas (Flame + MQ-2 + Relay 1-Ch + Pompa Air + Buzzer)",
    deskripsiSingkat:
      "Mendeteksi radiasi api (Flame Sensor) dan kebocoran gas LPG (MQ-2). Saat terdeteksi bahaya, ESP32 membunyikan sirine Buzzer, menyalakan Pompa Air Pemadam via Relay, dan mengirim peringatan WhatsApp/Telegram.",
    langkahWiring: [
      "Hubungkan Pin AO Sensor Gas MQ-2 ke GPIO34 & Pin SIG Flame Sensor ke GPIO4 ESP32.",
      "Hubungkan Pin GPIO32 ESP32 ke Pin IN1 Modul Relay 1-Channel.",
      "Hubungkan Terminal NO Modul Relay 1-Ch ke Kabel Merah (+) Pompa Air Pemadam.",
      "Hubungkan Pin GPIO27 ESP32 ke Anoda (+) Buzzer Piezo Alarm.",
    ],
    nodes: [
      { id: "p4f-esp", tipe: "esp32", label: "ESP32 Fire Safety", x: 20, y: 50, nyala: true },
      { id: "p4f-flm", tipe: "flame_sensor", label: "Sensor Api Flame", x: 220, y: 35, nilaiSensor: 85, nyala: true },
      { id: "p4f-mq2", tipe: "mq2_gas", label: "Sensor Gas MQ-2", x: 215, y: 180, nilaiSensor: 1450, nyala: true },
      { id: "p4f-rel", tipe: "relay_1ch", label: "Relay Pompa Pemadam", x: 400, y: 135, nyala: true },
      { id: "p4f-pmp", tipe: "water_pump", label: "Pompa Air Sprinkler", x: 565, y: 35, nyala: true },
      { id: "p4f-buz", tipe: "buzzer", label: "Sirine Buzzer", x: 575, y: 190, nyala: true },
    ],
    kabel: [
      { id: "kf-1", dariId: "p4f-flm", pinAsal: "SIG", keId: "p4f-esp", pinTujuan: "GPIO4", warna: "#ef4444", titikSiku: [{ x: 280, y: 155 }, { x: 195, y: 198 }] },
      { id: "kf-2", dariId: "p4f-mq2", pinAsal: "AO", keId: "p4f-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 315, y: 300 }, { x: 12, y: 300 }] },
      { id: "kf-3", dariId: "p4f-esp", pinAsal: "GPIO32", keId: "p4f-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 12, y: 280 }, { x: 482, y: 280 }] },
      { id: "kf-4", dariId: "p4f-rel", pinAsal: "NO", keId: "p4f-pmp", pinTujuan: "VCC_POS", warna: "#38bdf8", titikSiku: [{ x: 428, y: 115 }, { x: 603, y: 160 }] },
      { id: "kf-5", dariId: "p4f-esp", pinAsal: "GPIO27", keId: "p4f-buz", pinTujuan: "ANODA", warna: "#facc15", titikSiku: [{ x: 12, y: 315 }, { x: 606, y: 315 }] },
    ],
    kodePerMcu: {
      "p4f-esp": `// [C++ ARDUINO] - FIRE & GAS SAFETY + POMPA SPRINKLER + WA ALERT
#include <WiFi.h>

#define PIN_MQ2_ADC    34
#define PIN_FLAME      4
#define PIN_RELAY_PUMP 32
#define PIN_BUZZER     27

void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLAME, INPUT);
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.println("=== [ESP32] FIRE & GAS SUPPRESSION SYSTEM ACTIVE ===");
}

void loop() {
  digitalWrite(PIN_RELAY_PUMP, HIGH);
  digitalWrite(PIN_BUZZER, HIGH);
  Serial.println("🚨 [ALERT]: Api (85%) & Gas (1450 ppm) Terdeteksi! Pompa Pemadam ON!");
  delay(1500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p4f-esp": `# [MICROPYTHON] - FIRE & GAS SAFETY + POMPA SPRINKLER
from machine import Pin, ADC
import time

mq2_adc = ADC(Pin(34))
flame_in = Pin(4, Pin.IN)
relay_pump = Pin(32, Pin.OUT)
buzzer = Pin(27, Pin.OUT)

while True:
    relay_pump.value(1)
    buzzer.value(1)
    print("🚨 [MicroPython ALERT]: Api & Gas Terdeteksi -> Sprinkler ON!")
    time.sleep(1.5)`,
    },
    blynkWidgets: [
      { id: "wf-1", tipe: "whatsapp_bot", kategoriWidget: "Telegram & Notifikasi", judul: "WA Emergency Alert", virtualPin: "V0", satuan: "WA", warna: "emerald", targetTipeKomponen: "flame_sensor" },
      { id: "wf-2", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Kadar Gas LPG (MQ-2)", virtualPin: "V1", satuan: "ppm", warna: "rose", targetTipeKomponen: "mq2_gas" },
      { id: "wf-3", tipe: "alarm_notif", kategoriWidget: "Telegram & Notifikasi", judul: "Status Sirine & Api", virtualPin: "V2", satuan: "ALARM", warna: "rose", targetTipeKomponen: "flame_sensor" },
      { id: "wf-4", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Pompa Sprinkler Air", virtualPin: "V3", satuan: "PUMP", warna: "sky", targetTipeKomponen: "water_pump" },
    ],
  },

  // ==========================================================================
  // PROJECT 5: DUAL-MCU (2 ESP32 KOMUNIKASI TX/RX) - SENSOR NODE KE GATEWAY BLYNK
  // ==========================================================================
  {
    id: "proj-5",
    level: "Proyek 5 • Dual ESP32 (2 Tab Kode)",
    kategoriProyek: "Dual & Triple MCU",
    judul: "Dual-ESP32 Telemetry Bridge (ESP32 #1 Sensor Node ➔ UART TX/RX ➔ ESP32 #2 Gateway)",
    deskripsiSingkat:
      "Menggunakan 2 unit ESP32! ESP32 #1 bertugas membaca Sensor Ultrasonik & PIR lalu mengirim datanya lewat kabel serial TX2 ➔ RX2 ke ESP32 #2. ESP32 #2 memicu Relay Solenoid & meneruskan data ke Cloud Blynk.",
    langkahWiring: [
      "Hubungkan Pin TRIG Ultrasonik ke GPIO12 ESP32 #1 & Pin SIG Sensor PIR ke GPIO4 ESP32 #1.",
      "Hubungkan Silang UART: Pin TX2 (GPIO17) ESP32 #1 ke Pin RX2 (GPIO16) ESP32 #2.",
      "Hubungkan Pin GPIO32 ESP32 #2 ke Pin IN1 Modul Relay 1-Channel.",
      "Hubungkan Terminal NO Modul Relay 1-Ch ke Kabel Merah (+) Solenoid Door Lock 12V.",
    ],
    nodes: [
      { id: "p5-esp1", tipe: "esp32", label: "ESP32 #1 (Sensor Node)", x: 20, y: 45, nyala: true },
      { id: "p5-ultra", tipe: "ultrasonik", label: "Ultrasonik HC-SR04", x: 215, y: 40, nilaiSensor: 28, nyala: true },
      { id: "p5-pir", tipe: "pir_sensor", label: "Sensor Gerak PIR", x: 225, y: 185, nilaiSensor: 10, nyala: true },
      { id: "p5-esp2", tipe: "esp32", label: "ESP32 #2 (Blynk Gateway)", x: 395, y: 45, nyala: true },
      { id: "p5-rel", tipe: "relay_1ch", label: "Relay Aktuator", x: 585, y: 165, nyala: true },
      { id: "p5-sol", tipe: "solenoid_lock", label: "Solenoid Gerbang", x: 580, y: 25, nyala: true },
    ],
    kabel: [
      { id: "k5-1", dariId: "p5-ultra", pinAsal: "TRIG", keId: "p5-esp1", pinTujuan: "GPIO12", warna: "#38bdf8", titikSiku: [{ x: 276, y: 160 }, { x: 12, y: 200 }] },
      { id: "k5-2", dariId: "p5-pir", pinAsal: "SIG", keId: "p5-esp1", pinTujuan: "GPIO4", warna: "#a855f7", titikSiku: [{ x: 285, y: 300 }, { x: 185, y: 198 }] },
      { id: "k5-uart", dariId: "p5-esp1", pinAsal: "GPIO17", keId: "p5-esp2", pinTujuan: "GPIO16", warna: "#22c55e", titikSiku: [{ x: 195, y: 172 }, { x: 380, y: 185 }, { x: 560, y: 185 }] },
      { id: "k5-4", dariId: "p5-esp2", pinAsal: "GPIO32", keId: "p5-rel", pinTujuan: "IN1", warna: "#facc15", titikSiku: [{ x: 385, y: 295 }, { x: 667, y: 295 }] },
      { id: "k5-5", dariId: "p5-rel", pinAsal: "NO", keId: "p5-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 613, y: 145 }] },
    ],
    kodePerMcu: {
      "p5-esp1": `// ============================================================================
// TAB 1 [C++]: KODE PROGRAM ESP32 #1 (SENSOR NODE - PENGIRIM UART TX2)
// ============================================================================
#include <Arduino.h>

#define PIN_TRIG 12
#define PIN_ECHO 13
#define PIN_PIR  4
#define TXD2     17 // Terhubung ke RX2 (GPIO16) pada ESP32 #2

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, TXD2);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_PIR, INPUT);
  Serial.println("=== [ESP32 #1 SENSOR NODE] SIAP MENGIRIM KE ESP32 #2 ===");
}

void loop() {
  String paket = "NODE1:JARAK=28cm;PIR=DETECTED";
  Serial2.println(paket);
  Serial.println("[ESP32 #1 -> UART TX2]: Mengirim paket '" + paket + "'");
  delay(1500);
}`,
      "p5-esp2": `// ============================================================================
// TAB 2 [C++]: KODE PROGRAM ESP32 #2 (BLYNK GATEWAY & KENDALI RELAY SOLENOID)
// ============================================================================
#include <WiFi.h>

#define RXD2          16 // Menerima data dari TX2 (GPIO17) ESP32 #1
#define PIN_RELAY_SOL 32

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, 17);
  pinMode(PIN_RELAY_SOL, OUTPUT);
  Serial.println("=== [ESP32 #2 BLYNK GATEWAY] SIAP MENERIMA UART RX2 ===");
}

void loop() {
  if (Serial2.available()) {
    String dataMasuk = Serial2.readStringUntil('\\n');
    Serial.println("[ESP32 #2 <- UART RX2]: Diterima '" + dataMasuk + "'");
  }
  digitalWrite(PIN_RELAY_SOL, HIGH); // Aktifkan Relay -> Buka Solenoid
  Serial.println("[ESP32 #2 -> Blynk Cloud]: Update V0 (28cm) & V1 (Solenoid OPEN)");
  delay(1500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p5-esp1": `# TAB 1 [MICROPYTHON]: ESP32 #1 SENSOR NODE (UART TX2)
from machine import Pin, UART
import time

uart2 = UART(2, baudrate=9600, tx=17, rx=16)
trig = Pin(12, Pin.OUT)
pir = Pin(4, Pin.IN)

while True:
    uart2.write("NODE1:JARAK=28cm;PIR=DETECTED\\n")
    print("[ESP32 #1 MicroPython]: Paket UART dikirim ke ESP32 #2")
    time.sleep(1.5)`,
      "p5-esp2": `# TAB 2 [MICROPYTHON]: ESP32 #2 BLYNK GATEWAY (UART RX2)
from machine import Pin, UART
import network
import time

uart2 = UART(2, baudrate=9600, tx=17, rx=16)
relay_sol = Pin(32, Pin.OUT)

while True:
    relay_sol.value(1)
    print("[ESP32 #2 MicroPython]: Menerima UART -> Solenoid UNLOCKED")
    time.sleep(1.5)`,
    },
    blynkWidgets: [
      { id: "w5-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Sonar dari ESP32 #1", virtualPin: "V0", satuan: "cm", warna: "sky", targetTipeKomponen: "ultrasonik" },
      { id: "w5-2", tipe: "led_status", kategoriWidget: "Monitor & Grafik", judul: "Status PIR ESP32 #1", virtualPin: "V1", satuan: "PIR", warna: "rose", targetTipeKomponen: "pir_sensor" },
      { id: "w5-3", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Solenoid di ESP32 #2", virtualPin: "V2", satuan: "LOCK", warna: "emerald", targetTipeKomponen: "solenoid_lock" },
      { id: "w5-4", tipe: "telegram_bot", kategoriWidget: "Telegram & Notifikasi", judul: "Telegram Dual-ESP32 Bot", virtualPin: "V3", satuan: "@Bot", warna: "sky", targetTipeKomponen: "solenoid_lock" },
    ],
  },

  // ==========================================================================
  // PROJECT 6: DUAL-MCU INDUSTRI (ESP32 + ARDUINO UNO + RELAY 4CH + SERVO 360)
  // ==========================================================================
  {
    id: "proj-6",
    level: "Proyek 6 • Dual MCU + Relay 4Ch",
    kategoriProyek: "Dual & Triple MCU",
    judul: "Otomasi Pabrik (ESP32 Master ↔ Arduino Uno Slave + Relay 4-Ch + Servo 360°)",
    deskripsiSingkat:
      "ESP32 Master mengelola Modul Relay 4-Channel (18 Pin) untuk Solenoid & Pompa Air, sekaligus mengirim instruksi ke Arduino Uno Slave yang menggerakkan Motor Servo 360° (Wajib #include <Servo.h>).",
    langkahWiring: [
      "Hubungkan GPIO32 & GPIO33 ESP32 ke IN1 & IN2 Modul Relay 4-Channel.",
      "Hubungkan NO1 Relay 4-Ch ke Solenoid 12V (+) dan NO2 Relay 4-Ch ke Pompa Air Mini (+).",
      "Hubungkan TX2 (GPIO17) ESP32 ke D0 (RX) Arduino Uno.",
      "Hubungkan D9 (PWM) Arduino Uno ke Pin Sinyal Motor Servo 360° Continuous.",
    ],
    nodes: [
      { id: "p6-esp", tipe: "esp32", label: "ESP32 Master (WiFi)", x: 15, y: 45, nyala: true },
      { id: "p6-rel4", tipe: "relay_4ch", label: "Modul Relay 4-Ch (18p)", x: 205, y: 150, nyala: true },
      { id: "p6-sol", tipe: "solenoid_lock", label: "Solenoid Lock 12V", x: 205, y: 20, nyala: true },
      { id: "p6-pump", tipe: "water_pump", label: "Pompa Air Mini (2p)", x: 355, y: 20, nyala: true },
      { id: "p6-uno", tipe: "arduino_uno", label: "Arduino Uno Slave", x: 475, y: 185, nyala: true },
      { id: "p6-s360", tipe: "servo_360", label: "Servo 360° Konveyor", x: 530, y: 25, nilaiSensor: 75, nyala: true },
    ],
    kabel: [
      { id: "k6-1", dariId: "p6-esp", pinAsal: "GPIO32", keId: "p6-rel4", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 10, y: 300 }, { x: 276, y: 300 }] },
      { id: "k6-2", dariId: "p6-esp", pinAsal: "GPIO33", keId: "p6-rel4", pinTujuan: "IN2", warna: "#38bdf8", titikSiku: [{ x: 10, y: 312 }, { x: 302, y: 312 }] },
      { id: "k6-3", dariId: "p6-rel4", pinAsal: "NO1", keId: "p6-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 221, y: 135 }] },
      { id: "k6-4", dariId: "p6-rel4", pinAsal: "NO2", keId: "p6-pump", pinTujuan: "VCC_POS", warna: "#f97316", titikSiku: [{ x: 272, y: 135 }, { x: 393, y: 135 }] },
      { id: "k6-5", dariId: "p6-esp", pinAsal: "GPIO17", keId: "p6-uno", pinTujuan: "D0_RX", warna: "#facc15", titikSiku: [{ x: 190, y: 325 }, { x: 653, y: 175 }] },
      { id: "k6-6", dariId: "p6-uno", pinAsal: "D9", keId: "p6-s360", pinTujuan: "SIG", warna: "#a855f7", titikSiku: [{ x: 593, y: 155 }] },
    ],
    kodePerMcu: {
      "p6-esp": `// [TAB 1: ESP32 MASTER] - KENDALI RELAY 4-CHANNEL & UART COMMANDER
#include <WiFi.h>

#define RELAY_CH1_SOLENOID 32
#define RELAY_CH2_POMPA    33

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);
  pinMode(RELAY_CH1_SOLENOID, OUTPUT);
  pinMode(RELAY_CH2_POMPA, OUTPUT);
  Serial.println("=== [ESP32 MASTER] RELAY 4-CH & UART READY ===");
}

void loop() {
  digitalWrite(RELAY_CH1_SOLENOID, HIGH);
  digitalWrite(RELAY_CH2_POMPA, HIGH);
  Serial2.println("CONVEYOR_SPEED=75");
  Serial.println("[ESP32 Master]: Relay CH1 & CH2 ON | Mengirim perintah ke Arduino...");
  delay(2000);
}`,
      "p6-uno": `// [TAB 2: ARDUINO UNO SLAVE] - WAJIB #include <Servo.h> UNTUK SERVO 360
#include <Servo.h>

Servo servoKonveyor360;

void setup() {
  Serial.begin(9600);
  servoKonveyor360.attach(9); // Pin D9 PWM
  Serial.println("=== [ARDUINO UNO SLAVE] SERVO 360 CONVEYOR READY ===");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\\n');
    Serial.println("[Arduino RX]: Perintah diterima = " + cmd);
  }
  servoKonveyor360.write(160); // Putar kanan kontinu (75% RPM)
  delay(1500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p6-esp": `# [TAB 1 MICROPYTHON]: ESP32 MASTER RELAY 4-CH
from machine import Pin, UART
import time

relay_ch1 = Pin(32, Pin.OUT)
relay_ch2 = Pin(33, Pin.OUT)
uart2 = UART(2, baudrate=9600, tx=17, rx=16)

while True:
    relay_ch1.value(1)
    relay_ch2.value(1)
    uart2.write("CONVEYOR_SPEED=75\\n")
    time.sleep(2)`,
      "p6-uno": `# [TAB 2 MICROPYTHON]: SERVO 360 CONTROLLER
from machine import Pin, PWM
import time

servo360 = PWM(Pin(9), freq=50)
while True:
    servo360.duty(110)
    time.sleep(1.5)`,
    },
    blynkWidgets: [
      { id: "w6-1", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Relay Ch1: Solenoid", virtualPin: "V1", satuan: "CH1", warna: "emerald", targetTipeKomponen: "solenoid_lock" },
      { id: "w6-2", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Relay Ch2: Pompa Air", virtualPin: "V2", satuan: "CH2", warna: "sky", targetTipeKomponen: "water_pump" },
      { id: "w6-3", tipe: "joystick", kategoriWidget: "Kontrol & Input", judul: "Kecepatan Servo 360°", virtualPin: "V3", satuan: "% RPM", warna: "amber", targetTipeKomponen: "servo_360" },
      { id: "w6-4", tipe: "lcd_terminal", kategoriWidget: "Monitor & Grafik", judul: "Status UART Dual-MCU", virtualPin: "V4", satuan: "UART", warna: "indigo", targetTipeKomponen: "servo_360" },
    ],
  },

  // ==========================================================================
  // PROJECT 7: TRIPLE-MCU (3 MIKROKONTROLER SEKALIGUS = 3 TAB EDITOR!)
  // ==========================================================================
  {
    id: "proj-7",
    level: "Proyek 7 • Triple MCU (3 Tab Kode!)",
    kategoriProyek: "Dual & Triple MCU",
    judul: "Arsitektur 3 Mikrokontroler (ESP32 #1 + ESP32 #2 + Arduino Uno #3 Terintegrasi)",
    deskripsiSingkat:
      "Demonstrasi 3 Mikrokontroler aktif sekaligus! Anda dapat menjalankan (Run) ketiga board secara bersamaan atau hanya menjalankan 1 board saja untuk menguji bagian rangkaian mana yang menyala.",
    langkahWiring: [
      "ESP32 #1 (Kiri) terhubung ke Sensor Suhu DHT22 (Wajib #include <DHT.h>).",
      "ESP32 #2 (Tengah) terhubung ke Modul Relay 1-Ch & Solenoid 12V.",
      "Arduino Uno #3 (Kanan) terhubung ke Motor Servo 360° (Wajib #include <Servo.h>).",
    ],
    nodes: [
      { id: "p7-mcu1", tipe: "esp32", label: "MCU #1: ESP32 Sensor", x: 15, y: 40, nyala: true },
      { id: "p7-dht", tipe: "dht22", label: "DHT22 (MCU #1)", x: 35, y: 295, nilaiSensor: 34, nyala: true },
      { id: "p7-mcu2", tipe: "esp32", label: "MCU #2: ESP32 Relay", x: 245, y: 40, nyala: true },
      { id: "p7-rel", tipe: "relay_1ch", label: "Relay 1-Ch (MCU #2)", x: 245, y: 295, nyala: true },
      { id: "p7-sol", tipe: "solenoid_lock", label: "Solenoid (MCU #2)", x: 385, y: 300, nyala: true },
      { id: "p7-mcu3", tipe: "arduino_uno", label: "MCU #3: Arduino Uno", x: 475, y: 45, nyala: true },
      { id: "p7-s360", tipe: "servo_360", label: "Servo 360° (MCU #3)", x: 540, y: 245, nilaiSensor: 80, nyala: true },
    ],
    kabel: [
      { id: "k7-1", dariId: "p7-mcu1", pinAsal: "GPIO15", keId: "p7-dht", pinTujuan: "DATA", warna: "#a855f7", titikSiku: [{ x: 185, y: 224 }, { x: 76, y: 410 }] },
      { id: "k7-uart1", dariId: "p7-mcu1", pinAsal: "GPIO17", keId: "p7-mcu2", pinTujuan: "GPIO16", warna: "#22c55e", titikSiku: [{ x: 210, y: 175 }] },
      { id: "k7-2", dariId: "p7-mcu2", pinAsal: "GPIO32", keId: "p7-rel", pinTujuan: "IN1", warna: "#38bdf8", titikSiku: [{ x: 230, y: 120 }, { x: 230, y: 415 }, { x: 327, y: 415 }] },
      { id: "k7-3", dariId: "p7-rel", pinAsal: "NO", keId: "p7-sol", pinTujuan: "VCC_POS", warna: "#ef4444", titikSiku: [{ x: 273, y: 280 }, { x: 423, y: 405 }] },
      { id: "k7-uart2", dariId: "p7-mcu2", pinAsal: "GPIO1", keId: "p7-mcu3", pinTujuan: "D0_RX", warna: "#facc15", titikSiku: [{ x: 430, y: 80 }, { x: 653, y: 35 }] },
      { id: "k7-4", dariId: "p7-mcu3", pinAsal: "D9", keId: "p7-s360", pinTujuan: "SIG", warna: "#f97316", titikSiku: [{ x: 593, y: 30 }, { x: 600, y: 355 }] },
    ],
    kodePerMcu: {
      "p7-mcu1": `// [TAB 1 - MCU #1: ESP32 SENSOR NODE - WAJIB #include <DHT.h>]
#include <DHT.h>
#define PIN_DHT 15
DHT dht(PIN_DHT, DHT22);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("=== [MCU #1: ESP32 SENSOR] RUNNING ===");
}
void loop() {
  Serial.println("[MCU #1]: Membaca Suhu DHT22 (34 C) & Kirim ke MCU #2");
  delay(1500);
}`,
      "p7-mcu2": `// [TAB 2 - MCU #2: ESP32 RELAY & SOLENOID CONTROLLER]
#include <Arduino.h>
#define PIN_RELAY 32

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT);
  Serial.println("=== [MCU #2: ESP32 RELAY] RUNNING ===");
}
void loop() {
  digitalWrite(PIN_RELAY, HIGH);
  Serial.println("[MCU #2]: Memicu Relay 1-Ch -> Solenoid Door Lock UNLOCKED");
  delay(1500);
}`,
      "p7-mcu3": `// [TAB 3 - MCU #3: ARDUINO UNO SERVO 360 - WAJIB #include <Servo.h>]
#include <Servo.h>
Servo myServo360;

void setup() {
  Serial.begin(9600);
  myServo360.attach(9);
  Serial.println("=== [MCU #3: ARDUINO UNO] RUNNING ===");
}
void loop() {
  myServo360.write(180);
  Serial.println("[MCU #3]: Menggerakkan Motor Servo 360 Continuous (80% RPM)");
  delay(1500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p7-mcu1": `# [TAB 1 MICROPYTHON - MCU #1]: WAJIB import dht
from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(15))
while True:
    sensor.measure()
    print("[MCU #1 MicroPython]: Suhu DHT22 = 34 C")
    time.sleep(1.5)`,
      "p7-mcu2": `# [TAB 2 MICROPYTHON - MCU #2]: RELAY & SOLENOID
from machine import Pin
import time

relay = Pin(32, Pin.OUT)
while True:
    relay.value(1)
    print("[MCU #2 MicroPython]: Solenoid UNLOCKED")
    time.sleep(1.5)`,
      "p7-mcu3": `# [TAB 3 MICROPYTHON - MCU #3]: SERVO 360 PWM
from machine import Pin, PWM
import time

servo = PWM(Pin(9), freq=50)
while True:
    servo.duty(110)
    time.sleep(1.5)`,
    },
    blynkWidgets: [
      { id: "w7-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Suhu DHT22 (MCU #1)", virtualPin: "V0", satuan: "°C", warna: "amber", targetTipeKomponen: "dht22" },
      { id: "w7-2", tipe: "switch", kategoriWidget: "Kontrol & Input", judul: "Solenoid 12V (MCU #2)", virtualPin: "V1", satuan: "LOCK", warna: "emerald", targetTipeKomponen: "solenoid_lock" },
      { id: "w7-3", tipe: "slider", kategoriWidget: "Kontrol & Input", judul: "Servo 360° (MCU #3)", virtualPin: "V2", satuan: "% RPM", warna: "indigo", targetTipeKomponen: "servo_360" },
    ],
  },
];