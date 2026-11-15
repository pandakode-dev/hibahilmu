// app/components/simulator/tutorialProjectsPart2Advanced.ts
import { PresetTutorialProject } from "./tutorialProjectsData";

export const TUTORIAL_PROJECTS_PART2_8_TO_14: PresetTutorialProject[] = [
  // ==========================================================================
  // PROYEK 8: PUSH BUTTON + RESISTOR 220 OHM + LED MERAH
  // ==========================================================================
  {
    id: "wokwi-p8-pushbutton-led",
    judul: "Sakelar Tombol Taktil & Lampu Darurat (Push Button + Resistor 220Ω + LED Merah)",
    level: "Proyek 8 • Sangat Dasar (Simple)",
    kategoriProyek: "Dasar",
    deskripsiSingkat:
      "Tekan Tombol Tekan (Push Button) di GPIO 4 (STATUS: ON) untuk mengalirkan arus melewati Resistor 220Ω dan menyalakan LED Merah di GPIO 2.",
    langkahWiring: [
      "1. Klik tombol '⚡ Simulasikan Kondisi Aktif' di atas kanvas atau klik 'Tombol Tekan' lalu ubah ke STATUS: ON di Inspector kanan.",
      "2. Saat tombol aktif (HIGH), ESP32 mengeluarkan tegangan di GPIO 2 melewati Resistor 220Ω dan LED Merah menyala!",
    ],
    nodes: [
      { id: "p8-esp", tipe: "esp32", label: "ESP32 Dasar", x: 30, y: 50, nyala: true },
      { id: "p8-btn", tipe: "push_button", label: "Tombol Tekan (Input)", x: 235, y: 55, nilaiSensor: 1, nyala: false },
      { id: "p8-res", tipe: "resistor", label: "Resistor 220Ω", x: 405, y: 120, nilaiResistor: 220, nyala: true },
      { id: "p8-led", tipe: "led_merah", label: "LED Merah 5mm", x: 575, y: 60, nyala: false },
    ],
    kabel: [
      {
        id: "p8-k1",
        dariId: "p8-btn",
        pinAsal: "SIG",
        keId: "p8-esp",
        pinTujuan: "GPIO4",
        warna: "#38bdf8",
        titikSiku: [{ x: 280, y: 185 }, { x: 195, y: 198 }],
      },
      {
        id: "p8-k2",
        dariId: "p8-esp",
        pinAsal: "GPIO2",
        keId: "p8-res",
        pinTujuan: "PIN_1",
        warna: "#22c55e",
        titikSiku: [{ x: 195, y: 260 }, { x: 390, y: 260 }],
      },
      {
        id: "p8-k3",
        dariId: "p8-res",
        pinAsal: "PIN_2",
        keId: "p8-led",
        pinTujuan: "ANODA",
        warna: "#ef4444",
        titikSiku: [{ x: 530, y: 165 }, { x: 606, y: 180 }],
      },
    ],
    kodePerMcu: {
      "p8-esp": `// [PROYEK 8 - SANGAT DASAR] PUSH BUTTON (GPIO 4) -> LED MERAH (GPIO 2)
#include <Arduino.h>
#define PIN_TOMBOL 4
#define PIN_LED 2

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TOMBOL, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  int tombolDitekan = digitalRead(PIN_TOMBOL);
  if (tombolDitekan == HIGH) {
    digitalWrite(PIN_LED, HIGH);
    Serial.println("[TOMBOL DITEKAN] LED Merah MENYALA!");
  } else {
    digitalWrite(PIN_LED, LOW);
    Serial.println("[TOMBOL DILEPAS] LED Merah PADAM");
  }
  delay(300);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p8-esp": `from machine import Pin\nimport time\nbtn = Pin(4, Pin.IN)\nled = Pin(2, Pin.OUT)\nwhile True:\n  led.value(btn.value())\n  time.sleep_ms(300)`,
    },
    blynkWidgets: [] as any,
  },

  // ==========================================================================
  // PROYEK 9: POTENSIOMETER ADC + SERVO SG90 + LED HIJAU PWM
  // ==========================================================================
  {
    id: "wokwi-p9-potensio-pwm-servo",
    judul: "Kendali Sudut Lengan Robot & Dimmer (Potensiometer ADC + Servo SG90 + LED PWM)",
    level: "Proyek 9 • Dasar Analog & PWM",
    kategoriProyek: "Dasar",
    deskripsiSingkat:
      "Putar knop Potensiometer di GPIO 34 melewati nilai tengah (> 50%) untuk memutar lengan Motor Servo SG90 (GPIO 18) ke 120° dan menyalakan LED Hijau.",
    langkahWiring: [
      "1. Klik 'Potensio Knop Putar' di kanvas lalu geser slider di Inspector kanan ke atas 50% (atau klik '⚡ Simulasikan Kondisi Aktif').",
      "2. Saat nilai Potensiometer > 50%, Servo berputar ke sudut 120° dan LED Indikator PWM menyala hijau!",
    ],
    nodes: [
      { id: "p9-esp", tipe: "esp32", label: "ESP32 PWM Controller", x: 30, y: 50, nyala: true },
      { id: "p9-pot", tipe: "potensiometer", label: "Potensio Knop Putar", x: 235, y: 55, nilaiSensor: 25, nyala: true },
      { id: "p9-srv", tipe: "servo", label: "Servo Lengan Robot", x: 420, y: 55, nilaiSensor: 0, nyala: false },
      { id: "p9-led", tipe: "led_hijau", label: "LED Indikator PWM", x: 580, y: 60, nyala: false },
    ],
    kabel: [
      {
        id: "p9-k1",
        dariId: "p9-pot",
        pinAsal: "SIG",
        keId: "p9-esp",
        pinTujuan: "GPIO34",
        warna: "#f97316",
        titikSiku: [{ x: 295, y: 185 }, { x: 15, y: 185 }],
      },
      {
        id: "p9-k2",
        dariId: "p9-esp",
        pinAsal: "GPIO18",
        keId: "p9-srv",
        pinTujuan: "SIG",
        warna: "#facc15",
        titikSiku: [{ x: 200, y: 162 }, { x: 480, y: 185 }],
      },
      {
        id: "p9-k3",
        dariId: "p9-esp",
        pinAsal: "GPIO2",
        keId: "p9-led",
        pinTujuan: "ANODA",
        warna: "#22c55e",
        titikSiku: [{ x: 200, y: 280 }, { x: 611, y: 180 }],
      },
    ],
    kodePerMcu: {
      "p9-esp": `// [PROYEK 9] POTENSIOMETER ADC (GPIO 34) -> SERVO (GPIO 18) & LED PWM (GPIO 2)
#include <Arduino.h>
#include <ESP32Servo.h>

Servo robotServo;
void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(2, OUTPUT);
  robotServo.attach(18);
}

void loop() {
  int pot = analogRead(34); // Geser Potensiometer > 50 di Inspector!
  if (pot > 50) {
    robotServo.write(120);
    digitalWrite(2, HIGH);
    Serial.println("[PWM AKTIF] Potensio > 50% -> Servo 120 Derajat & LED ON!");
  } else {
    robotServo.write(0);
    digitalWrite(2, LOW);
  }
  delay(300);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p9-esp": `from machine import Pin, ADC, PWM\nimport time\npot = ADC(Pin(34))\nled = Pin(2, Pin.OUT)\nwhile True:\n  led.value(1 if pot.read() > 50 else 0)\n  time.sleep_ms(300)`,
    },
    blynkWidgets: [] as any,
  },

  // ==========================================================================
  // PROYEK 10: ULTRASONIK HC-SR04 (TRIG GPIO12, ECHO GPIO13) + SERVO + BUZZER
  // ==========================================================================
  {
    id: "wokwi-p10-ultrasonik-parkir-palang",
    judul: "Radar Parkir Mobil & Palang Pintu Tol Otomatis (Ultrasonik HC-SR04 + Buzzer + Servo)",
    level: "Proyek 10 • Sensor Jarak & Otomasi",
    kategoriProyek: "Dasar",
    deskripsiSingkat:
      "Sensor Ultrasonik HC-SR04 terhubung ke TRIG (GPIO 12) & ECHO (GPIO 13). Ketika jarak kendaraan < 30 cm, Palang Pintu Tol Servo membuka 90° dan Buzzer berbunyi.",
    langkahWiring: [
      "1. Klik 'Sensor Ultrasonik (cm)' di kanvas lalu geser slider jarak di Inspector kanan ke bawah 30 cm (misal 15 cm), atau klik '⚡ Simulasikan Kondisi Aktif'.",
      "2. Begitu jarak < 30 cm, Palang Pintu Tol berputar ke 90° dan Buzzer Radar Parkir berbunyi!",
    ],
    nodes: [
      { id: "p10-esp", tipe: "esp32", label: "ESP32 Gate Controller", x: 30, y: 50, nyala: true },
      { id: "p10-ult", tipe: "ultrasonik", label: "Sensor Ultrasonik (cm)", x: 225, y: 45, nilaiSensor: 65, nyala: true },
      { id: "p10-srv", tipe: "servo", label: "Palang Pintu Tol", x: 420, y: 45, nilaiSensor: 0, nyala: false },
      { id: "p10-buz", tipe: "buzzer", label: "Buzzer Radar Parkir", x: 575, y: 65, nyala: false },
    ],
    kabel: [
      {
        id: "p10-k1",
        dariId: "p10-ult",
        pinAsal: "TRIG",
        keId: "p10-esp",
        pinTujuan: "GPIO12",
        warna: "#38bdf8",
        titikSiku: [{ x: 265, y: 185 }, { x: 15, y: 205 }],
      },
      {
        id: "p10-k2",
        dariId: "p10-ult",
        pinAsal: "ECHO",
        keId: "p10-esp",
        pinTujuan: "GPIO13",
        warna: "#22c55e",
        titikSiku: [{ x: 290, y: 200 }, { x: 15, y: 220 }],
      },
      {
        id: "p10-k3",
        dariId: "p10-esp",
        pinAsal: "GPIO18",
        keId: "p10-srv",
        pinTujuan: "SIG",
        warna: "#facc15",
        titikSiku: [{ x: 200, y: 162 }, { x: 480, y: 175 }],
      },
      {
        id: "p10-k4",
        dariId: "p10-esp",
        pinAsal: "GPIO27",
        keId: "p10-buz",
        pinTujuan: "ANODA",
        warna: "#ef4444",
        titikSiku: [{ x: 15, y: 295 }, { x: 606, y: 295 }],
      },
    ],
    kodePerMcu: {
      "p10-esp": `// [PROYEK 10] RADAR PARKIR & PALANG TOL (JARAK < 30 CM -> SERVO 90 & BUZZER)
#include <Arduino.h>
#include <ESP32Servo.h>

#define PIN_TRIG 12
#define PIN_ECHO 13
#define PIN_SERVO 18
#define PIN_BUZZER 27

Servo palangTol;
void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  palangTol.attach(PIN_SERVO);
}

void loop() {
  int jarak = analogRead(PIN_ECHO); // Geser jarak < 30 cm di Inspector agar palang membuka!
  if (jarak < 30) {
    palangTol.write(90);
    digitalWrite(PIN_BUZZER, HIGH);
    Serial.println("[MOBIL DEKAT < 30cm] Palang Tol Terbuka 90 Derajat & Buzzer ON!");
  } else {
    palangTol.write(0);
    digitalWrite(PIN_BUZZER, LOW);
  }
  delay(400);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p10-esp": `from machine import Pin\nimport time\nbuz = Pin(27, Pin.OUT)\nwhile True:\n  time.sleep_ms(400)`,
    },
    blynkWidgets: [] as any,
  },

  // ==========================================================================
  // PROYEK 11: KEAMANAN RUMAH PIR_SENSOR (GPIO 4) + RELAY_1CH + BUZZER + LAMPU
  // ==========================================================================
  {
    id: "wokwi-p11-keamanan-pir-antimaling",
    judul: "Sistem Keamanan Rumah Anti-Maling (Sensor Gerak PIR + Relay Sorot + Sirine + WA Alert)",
    level: "Proyek 11 • Smart Home Security",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Mendeteksi gerakan manusia menggunakan Sensor Gerak PIR (GPIO 4). Saat ada gerakan (STATUS: ON), Relay Lampu Sorot (GPIO 32) dan Sirine (GPIO 27) langsung menyala.",
    langkahWiring: [
      "1. Klik 'Sensor Gerak PIR' di kanvas lalu aktifkan tombol 'STATUS: ON / HIGH' di Inspector kanan (atau klik '⚡ Simulasikan Kondisi Aktif').",
      "2. Saat PIR mendeteksi gerakan, Relay Lampu Sorot dan Sirine Anti-Maling langsung menyala!",
    ],
    nodes: [
      { id: "p11-esp", tipe: "esp32", label: "ESP32 Security Hub", x: 30, y: 50, nyala: true },
      { id: "p11-pir", tipe: "pir_sensor", label: "Sensor Gerak PIR", x: 230, y: 50, nilaiSensor: 100, nyala: false },
      { id: "p11-rel", tipe: "relay_1ch", label: "Relay Lampu Sorot", x: 405, y: 125, nyala: false },
      { id: "p11-buz", tipe: "buzzer", label: "Sirine Anti-Maling", x: 575, y: 60, nyala: false },
    ],
    kabel: [
      {
        id: "p11-k1",
        dariId: "p11-pir",
        pinAsal: "SIG",
        keId: "p11-esp",
        pinTujuan: "GPIO4",
        warna: "#a855f7",
        titikSiku: [{ x: 285, y: 175 }, { x: 195, y: 198 }],
      },
      {
        id: "p11-k2",
        dariId: "p11-esp",
        pinAsal: "GPIO32",
        keId: "p11-rel",
        pinTujuan: "IN1",
        warna: "#22c55e",
        titikSiku: [{ x: 15, y: 275 }, { x: 487, y: 275 }],
      },
      {
        id: "p11-k3",
        dariId: "p11-esp",
        pinAsal: "GPIO27",
        keId: "p11-buz",
        pinTujuan: "ANODA",
        warna: "#ef4444",
        titikSiku: [{ x: 15, y: 305 }, { x: 606, y: 185 }],
      },
    ],
    kodePerMcu: {
      "p11-esp": `// [PROYEK 11] ALARM ANTI-MALING SENSOR GERAK PIR (GPIO 4 -> RELAY 32 & SIRINE 27)
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  pinMode(4, INPUT);
  pinMode(32, OUTPUT);
  pinMode(27, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int adaGerakan = digitalRead(4);
  if (adaGerakan == HIGH) {
    digitalWrite(32, HIGH);
    digitalWrite(27, HIGH);
    Serial.println("🚨 [INTRUDER ALERT] Gerakan PIR Terdeteksi -> Sirine & Lampu Sorot ON!");
  } else {
    digitalWrite(32, LOW);
    digitalWrite(27, LOW);
  }
  delay(500);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p11-esp": `from machine import Pin\nimport time\npir = Pin(4, Pin.IN)\nrel = Pin(32, Pin.OUT)\nwhile True:\n  rel.value(pir.value())\n  time.sleep_ms(500)`,
    },
    blynkWidgets: [
      { id: "w-p11-1", tipe: "alarm_notif", kategoriWidget: "Telegram & Notifikasi", judul: "Status Keamanan Rumah", virtualPin: "V2", satuan: "ALARM", warna: "rose", targetTipeKomponen: "pir_sensor" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 12: SENSOR PUPUK NPK TANAH + RELAY 1-CH + WATER_PUMP
  // ==========================================================================
  {
    id: "wokwi-p12-npk-tanah-dosis-pupuk",
    judul: "Stasiun Nutrisi Tanah Presisi & Pompa Pupuk Otomatis (Sensor NPK RS485 + Relay + Pompa)",
    level: "Proyek 12 • Smart Agriculture NPK",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Membaca kadar hara Nitrogen-Fosfor-Kalium dari Sensor Pupuk NPK. Saat kadar nutrisi tanah kurang (< 50 mg/kg), Relay menyalakan Pompa Injeksi Pupuk Cair.",
    langkahWiring: [
      "1. Klik 'Sensor Pupuk NPK' di kanvas lalu geser slider ke bawah 50 mg/kg (misal 20 mg/kg), atau klik '⚡ Simulasikan Kondisi Aktif'.",
      "2. Saat NPK < 50 mg/kg, Relay Dosis Pupuk aktif (ON) dan Pompa Injeksi Pupuk menyemburkan pupuk cair!",
    ],
    nodes: [
      { id: "p12-esp", tipe: "esp32", label: "ESP32 Agri Node", x: 30, y: 50, nyala: true },
      { id: "p12-npk", tipe: "sensor_npk", label: "Sensor Pupuk NPK", x: 230, y: 45, nilaiSensor: 85, nyala: true },
      { id: "p12-rel", tipe: "relay_1ch", label: "Relay Dosis Pupuk", x: 405, y: 130, nyala: false },
      { id: "p12-pmp", tipe: "water_pump", label: "Pompa Injeksi Pupuk", x: 570, y: 45, nyala: false },
    ],
    kabel: [
      {
        id: "p12-k1",
        dariId: "p12-npk",
        pinAsal: "AO",
        keId: "p12-esp",
        pinTujuan: "GPIO16",
        warna: "#f97316",
        titikSiku: [{ x: 290, y: 175 }, { x: 195, y: 185 }],
      },
      {
        id: "p12-k2",
        dariId: "p12-esp",
        pinAsal: "GPIO32",
        keId: "p12-rel",
        pinTujuan: "IN1",
        warna: "#22c55e",
        titikSiku: [{ x: 15, y: 275 }, { x: 487, y: 275 }],
      },
      {
        id: "p12-k3",
        dariId: "p12-rel",
        pinAsal: "NO",
        keId: "p12-pmp",
        pinTujuan: "VCC_POS",
        warna: "#38bdf8",
        titikSiku: [{ x: 433, y: 115 }, { x: 608, y: 165 }],
      },
    ],
    kodePerMcu: {
      "p12-esp": `// [PROYEK 12] SENSOR PUPUK NPK RS485 -> POMPA INJEKSI PUPUK OTOMATIS
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);
  pinMode(32, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int kadarNpk = analogRead(16); // Turunkan nilai NPK < 50 di Inspector agar pompa menyala!
  if (kadarNpk < 50) {
    digitalWrite(32, HIGH);
    Serial.println("[NUTRISI KURANG < 50 mg/kg] Relay & Pompa Injeksi Pupuk ON!");
  } else {
    digitalWrite(32, LOW);
    Serial.println("[NUTRISI CUKUP >= 50 mg/kg] Tanah Subur -> Pompa OFF");
  }
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p12-esp": `from machine import Pin\nimport time\nrel = Pin(32, Pin.OUT)\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p12-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Kadar Hara NPK (mg/kg)", virtualPin: "V1", satuan: "mg/kg", warna: "emerald", targetTipeKomponen: "sensor_npk" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 13: BMS BATERAI 18650 (battery_socket + voltage_sensor) + RELAY + LED
  // ==========================================================================
  {
    id: "wokwi-p13-baterai-18650-solar-bms",
    judul: "Manajemen Baterai Li-Ion 18650 & Proteksi Tegangan Rendah (Socket 18650 + Sensor Volt + Relay Charger)",
    level: "Proyek 13 • Power & BMS IoT",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Memantau voltase Socket Baterai 18650 menggunakan Sensor Tegangan DC (GPIO 34). Saat voltase turun (< 11V), Relay Charger Surya otomatis menyala mengisi ulang baterai.",
    langkahWiring: [
      "1. Klik 'Sensor Tegangan DC' di kanvas lalu geser slider tegangan di Inspector kanan ke bawah 11V (misal 8V), atau klik '⚡ Simulasikan Kondisi Aktif'.",
      "2. Saat tegangan < 11V, Relay Charger Surya dan LED Indikator Charging langsung menyala!",
    ],
    nodes: [
      { id: "p13-esp", tipe: "esp32", label: "ESP32 BMS Monitor", x: 25, y: 50, nyala: true },
      { id: "p13-bat", tipe: "battery_socket", label: "Socket Baterai 18650", x: 220, y: 35, nilaiSensor: 12, nyala: true },
      { id: "p13-vlt", tipe: "voltage_sensor", label: "Sensor Tegangan DC", x: 220, y: 185, nilaiSensor: 14, nyala: true },
      { id: "p13-rel", tipe: "relay_1ch", label: "Relay Charger Surya", x: 410, y: 125, nyala: false },
      { id: "p13-led", tipe: "led_hijau", label: "Indikator Charging", x: 580, y: 65, nyala: false },
    ],
    kabel: [
      {
        id: "p13-k1",
        dariId: "p13-bat",
        pinAsal: "BAT_POS",
        keId: "p13-vlt",
        pinTujuan: "VCC_IN",
        warna: "#ef4444",
        titikSiku: [{ x: 250, y: 160 }, { x: 250, y: 180 }],
      },
      {
        id: "p13-k2",
        dariId: "p13-vlt",
        pinAsal: "SIG",
        keId: "p13-esp",
        pinTujuan: "GPIO34",
        warna: "#38bdf8",
        titikSiku: [{ x: 300, y: 295 }, { x: 15, y: 155 }],
      },
      {
        id: "p13-k3",
        dariId: "p13-esp",
        pinAsal: "GPIO32",
        keId: "p13-rel",
        pinTujuan: "IN1",
        warna: "#22c55e",
        titikSiku: [{ x: 15, y: 280 }, { x: 492, y: 280 }],
      },
      {
        id: "p13-k4",
        dariId: "p13-rel",
        pinAsal: "NO",
        keId: "p13-led",
        pinTujuan: "ANODA",
        warna: "#facc15",
        titikSiku: [{ x: 438, y: 110 }, { x: 611, y: 185 }],
      },
    ],
    kodePerMcu: {
      "p13-esp": `// [PROYEK 13] BATTERY MANAGEMENT SYSTEM (TEGANGAN < 11V -> RELAY CHARGER ON)
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(32, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int adcVolt = analogRead(34); // Turunkan tegangan < 11V di Inspector agar Charger ON!
  if (adcVolt < 11) {
    digitalWrite(32, HIGH);
    Serial.println("[LOW BATTERY < 11V] Relay Charger Surya AKTIF Mengisi Daya!");
  } else {
    digitalWrite(32, LOW);
    Serial.println("[BATTERY FULL >= 11V] Charger Cut-Off Aman.");
  }
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p13-esp": `from machine import Pin, ADC\nimport time\nadc = ADC(Pin(34))\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p13-1", tipe: "gauge", kategoriWidget: "Monitor & Grafik", judul: "Tegangan Baterai 18650 (V)", virtualPin: "V1", satuan: "V", warna: "sky", targetTipeKomponen: "voltage_sensor" },
    ] as any,
  },

  // ==========================================================================
  // PROYEK 14: PELACAK KENDARAAN GPS NEO-6M (TXD->GPIO16) + RFID + RELAY + BUZZER
  // ==========================================================================
  {
    id: "wokwi-p14-gps-geofencing-tracker",
    judul: "Pelacak Aset Kendaraan & Kunci Kontak Pintar (GPS NEO-6M + RFID RC522 + Relay Starter + Buzzer)",
    level: "Proyek 14 • Fleet & Asset Tracking",
    kategoriProyek: "IoT & Cloud",
    deskripsiSingkat:
      "Menggabungkan Modul Satelit GPS u-blox NEO-6M (Pin TXD -> GPIO 16) dan Kunci Kontak RFID RC522 (Pin SDA(SS) -> GPIO 5). Saat RFID di-tap, Relay Starter dan Buzzer aktif.",
    langkahWiring: [
      "1. Klik 'RFID Kunci Kontak' di kanvas lalu tekan tombol 'STATUS: ON / HIGH' di Inspector kanan (atau klik '⚡ Simulasikan Kondisi Aktif').",
      "2. Saat kartu RFID pengemudi terdeteksi, Relay Starter Mesin dan Buzzer Konfirmasi menyala serta mengirim koordinat GPS!",
    ],
    nodes: [
      { id: "p14-esp", tipe: "esp32", label: "ESP32 GPS Tracker", x: 25, y: 50, nyala: true },
      { id: "p14-gps", tipe: "gps_neo6m", label: "Modul Satelit GPS", x: 225, y: 35, nilaiSensor: 8, nyala: true },
      { id: "p14-rfd", tipe: "rfid_rc522", label: "RFID Kunci Kontak", x: 225, y: 185, nilaiSensor: 100, nyala: false },
      { id: "p14-rel", tipe: "relay_1ch", label: "Relay Starter Mesin", x: 410, y: 125, nyala: false },
      { id: "p14-buz", tipe: "buzzer", label: "Buzzer Kontak & GPS", x: 575, y: 65, nyala: false },
    ],
    kabel: [
      {
        id: "p14-k1",
        dariId: "p14-gps",
        pinAsal: "TXD",
        keId: "p14-esp",
        pinTujuan: "GPIO16",
        warna: "#22c55e",
        titikSiku: [{ x: 270, y: 160 }, { x: 195, y: 185 }],
      },
      {
        id: "p14-k2",
        dariId: "p14-rfd",
        pinAsal: "SDA(SS)",
        keId: "p14-esp",
        pinTujuan: "GPIO5",
        warna: "#38bdf8",
        titikSiku: [{ x: 250, y: 300 }, { x: 195, y: 170 }],
      },
      {
        id: "p14-k3",
        dariId: "p14-esp",
        pinAsal: "GPIO32",
        keId: "p14-rel",
        pinTujuan: "IN1",
        warna: "#f97316",
        titikSiku: [{ x: 15, y: 280 }, { x: 492, y: 280 }],
      },
      {
        id: "p14-k4",
        dariId: "p14-esp",
        pinAsal: "GPIO27",
        keId: "p14-buz",
        pinTujuan: "ANODA",
        warna: "#ef4444",
        titikSiku: [{ x: 15, y: 310 }, { x: 606, y: 190 }],
      },
    ],
    kodePerMcu: {
      "p14-esp": `// [PROYEK 14] PELACAK KENDARAAN GPS NEO-6M & KUNCI KONTAK RFID
#include <Arduino.h>
#include <WiFi.h>
#include <TinyGPSPlus.h>

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);
  pinMode(5, INPUT);
  pinMode(32, OUTPUT);
  pinMode(27, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int kunciRfid = digitalRead(5); // Tap Kartu RFID agar Starter Mesin menyala!
  digitalWrite(32, kunciRfid ? HIGH : LOW);
  digitalWrite(27, kunciRfid ? HIGH : LOW);
  Serial.println("[GPS TRACKER] Lat: 1.6667, Lon: 101.4500 | Satelit: 8 Locked");
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p14-esp": `from machine import Pin, UART\nimport time\ngps = UART(2, 9600)\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p14-1", tipe: "gauge", kategoriWidget: "Lanjutan & Peta", judul: "Jumlah Satelit GPS Terkunci", virtualPin: "V4", satuan: "Sat", warna: "emerald", targetTipeKomponen: "gps_neo6m" },
    ] as any,
  },
];