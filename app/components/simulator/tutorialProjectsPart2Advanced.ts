// app/components/simulator/tutorialProjectsPart2Advanced.ts
import { PresetTutorialProject } from "./tutorialProjectsData";

export const TUTORIAL_PROJECTS_PART2_8_TO_14: PresetTutorialProject[] = [
  {
    id: "wokwi-p8-pushbutton-led",
    judul: "Sakelar Tombol Taktil & Lampu Darurat (Push Button + Resistor 220Ω + LED Merah)",
    level: "Proyek 8 • Sangat Dasar (Simple)",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p8-esp", tipe: "esp32", label: "ESP32 Dasar", x: 35, y: 75, nyala: true },
      { id: "p8-btn", tipe: "push_button", label: "Tombol Tekan (Input)", x: 230, y: 65, nilaiSensor: 0, nyala: false },
      { id: "p8-res", tipe: "resistor", label: "Resistor 220Ω", x: 410, y: 95, nilaiResistor: 220, nyala: true },
      { id: "p8-led", tipe: "led_merah", label: "LED Merah 5mm", x: 560, y: 75, nyala: false },
    ],
    kabel: [
      { id: "p8-k1", dariId: "p8-btn", pinAsal: "SIG", keId: "p8-esp", pinTujuan: "GPIO4", warna: "sky", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p8-k2", dariId: "p8-esp", pinAsal: "GPIO2", keId: "p8-res", pinTujuan: "PIN_1", warna: "#22c55e", titikSiku: [{ x: 350, y: 205 }] },
      { id: "p8-k3", dariId: "p8-res", pinAsal: "PIN_2", keId: "p8-led", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 520, y: 120 }] },
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
  }
  delay(200);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p8-esp": `from machine import Pin\nimport time\nbtn = Pin(4, Pin.IN)\nled = Pin(2, Pin.OUT)\nwhile True:\n  led.value(btn.value())\n  time.sleep_ms(200)`,
    },
    blynkWidgets: [] as any,
  },

  {
    id: "wokwi-p9-potensio-pwm-servo",
    judul: "Kendali Sudut Lengan Robot & Dimmer (Potensiometer ADC + Servo SG90 + LED PWM)",
    level: "Proyek 9 • Dasar Analog & PWM",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p9-esp", tipe: "esp32", label: "ESP32 PWM Controller", x: 35, y: 75, nyala: true },
      { id: "p9-pot", tipe: "potensiometer", label: "Potensio Knop Putar", x: 230, y: 65, nilaiSensor: 30, nyala: true },
      { id: "p9-srv", tipe: "servo", label: "Servo Lengan Robot", x: 430, y: 65, nilaiSensor: 0, nyala: false },
      { id: "p9-led", tipe: "led_hijau", label: "LED Indikator PWM", x: 585, y: 80, nyala: false },
    ],
    kabel: [
      { id: "p9-k1", dariId: "p9-pot", pinAsal: "SIG", keId: "p9-esp", pinTujuan: "GPIO34", warna: "#f97316", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p9-k2", dariId: "p9-esp", pinAsal: "GPIO18", keId: "p9-srv", pinTujuan: "SIG", warna: "#facc15", titikSiku: [{ x: 375, y: 185 }] },
      { id: "p9-k3", dariId: "p9-esp", pinAsal: "GPIO2", keId: "p9-led", pinTujuan: "ANODA", warna: "#22c55e", titikSiku: [{ x: 530, y: 210 }] },
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
  int pot = analogRead(34);
  if (pot > 50) {
    robotServo.write(120);
    digitalWrite(2, HIGH);
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

  {
    id: "wokwi-p10-ultrasonik-parkir-palang",
    judul: "Radar Parkir Mobil & Palang Pintu Tol Otomatis (Ultrasonik HC-SR04 + Buzzer + Servo)",
    level: "Proyek 10 • Sensor Jarak & Otomasi",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p10-esp", tipe: "esp32", label: "ESP32 Gate Controller", x: 35, y: 75, nyala: true },
      { id: "p10-ult", tipe: "ultrasonik", label: "Sensor Ultrasonik (cm)", x: 225, y: 60, nilaiSensor: 85, nyala: true },
      { id: "p10-srv", tipe: "servo", label: "Palang Pintu Tol", x: 430, y: 60, nilaiSensor: 0, nyala: false },
      { id: "p10-buz", tipe: "buzzer", label: "Buzzer Radar Parkir", x: 585, y: 80, nyala: false },
    ],
    kabel: [
      { id: "p10-k1", dariId: "p10-ult", pinAsal: "ECHO", keId: "p10-esp", pinTujuan: "GPIO4", warna: "sky", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p10-k2", dariId: "p10-esp", pinAsal: "GPIO18", keId: "p10-srv", pinTujuan: "SIG", warna: "#facc15", titikSiku: [{ x: 380, y: 185 }] },
      { id: "p10-k3", dariId: "p10-esp", pinAsal: "GPIO27", keId: "p10-buz", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 540, y: 205 }] },
    ],
    kodePerMcu: {
      "p10-esp": `// [PROYEK 10] RADAR PARKIR & PALANG TOL (JARAK < 30 CM -> SERVO 90 & BUZZER)
#include <Arduino.h>
#include <ESP32Servo.h>

Servo palangTol;
void setup() {
  Serial.begin(115200);
  pinMode(4, INPUT);
  pinMode(27, OUTPUT);
  palangTol.attach(18);
}

void loop() {
  int jarak = analogRead(4); // Turunkan jarak < 30 cm di Inspector agar palang membuka!
  if (jarak < 30) {
    palangTol.write(90);
    digitalWrite(27, HIGH);
    Serial.println("[MOBIL DEKAT < 30cm] Palang Tol Terbuka & Buzzer Aktif!");
  } else {
    palangTol.write(0);
    digitalWrite(27, LOW);
  }
  delay(400);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p10-esp": `from machine import Pin\nimport time\nbuz = Pin(27, Pin.OUT)\nwhile True:\n  time.sleep_ms(400)`,
    },
    blynkWidgets: [] as any,
  },

  {
    id: "wokwi-p11-keamanan-pir-antimaling",
    judul: "Sistem Keamanan Rumah Anti-Maling (Sensor Gerak PIR + Relay Sorot + Sirine + WA Alert)",
    level: "Proyek 11 • Smart Home Security",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p11-esp", tipe: "esp32", label: "ESP32 Security Hub", x: 35, y: 75, nyala: true },
      { id: "p11-pir", tipe: "pir", label: "Sensor Gerak PIR", x: 225, y: 65, nilaiSensor: 0, nyala: false },
      { id: "p11-rel", tipe: "relay_1ch", label: "Relay Lampu Sorot", x: 405, y: 125, nyala: false },
      { id: "p11-buz", tipe: "buzzer", label: "Sirine Anti-Maling", x: 575, y: 75, nyala: false },
    ],
    kabel: [
      { id: "p11-k1", dariId: "p11-pir", pinAsal: "SIG", keId: "p11-esp", pinTujuan: "GPIO4", warna: "#a855f7", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p11-k2", dariId: "p11-esp", pinAsal: "GPIO32", keId: "p11-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 185 }] },
      { id: "p11-k3", dariId: "p11-esp", pinAsal: "GPIO27", keId: "p11-buz", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 535, y: 205 }] },
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
  int adaGerakan = digitalRead(4); // Aktifkan Sensor PIR di Inspector untuk menguji alarm!
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
      { id: "w-p11-1", tipe: "alarm_notif", judul: "Status Keamanan Rumah", vPin: "V2", targetNodeId: "p11-buz", warna: "rose" },
    ] as any,
  },

  {
    id: "wokwi-p12-npk-tanah-dosis-pupuk",
    judul: "Stasiun Nutrisi Tanah Presisi & Pompa Pupuk Otomatis (Sensor NPK RS485 + Relay + Pompa)",
    level: "Proyek 12 • Smart Agriculture NPK",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p12-esp", tipe: "esp32", label: "ESP32 Agri Node", x: 35, y: 75, nyala: true },
      { id: "p12-npk", tipe: "sensor_npk", label: "Sensor Pupuk NPK", x: 230, y: 60, nilaiSensor: 145, nyala: true },
      { id: "p12-rel", tipe: "relay_1ch", label: "Relay Dosis Pupuk", x: 405, y: 130, nyala: false },
      { id: "p12-pmp", tipe: "pompa_air", label: "Pompa Injeksi Pupuk", x: 575, y: 60, nyala: false },
    ],
    kabel: [
      { id: "p12-k1", dariId: "p12-npk", pinAsal: "SIG", keId: "p12-esp", pinTujuan: "GPIO16", warna: "#f97316", titikSiku: [{ x: 195, y: 155 }] },
      { id: "p12-k2", dariId: "p12-esp", pinAsal: "GPIO32", keId: "p12-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 365, y: 190 }] },
      { id: "p12-k3", dariId: "p12-rel", pinAsal: "NO", keId: "p12-pmp", pinTujuan: "VCC_POS", warna: "sky", titikSiku: [{ x: 535, y: 120 }] },
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
  int kadarNpk = analogRead(16); // Turunkan nilai NPK < 100 mg/kg di Inspector agar pompa menyala!
  if (kadarNpk < 100) {
    digitalWrite(32, HIGH);
    Serial.println("[NUTRISI KURANG < 100 mg/kg] Pompa Injeksi Pupuk Cair ON!");
  } else {
    digitalWrite(32, LOW);
    Serial.println("[NUTRISI CUKUP] Tanah Subur -> Pompa Pupuk OFF");
  }
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p12-esp": `from machine import Pin\nimport time\nrel = Pin(32, Pin.OUT)\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p12-1", tipe: "gauge", judul: "Kadar Nitrogen NPK (mg/kg)", vPin: "V1", targetNodeId: "p12-npk", warna: "emerald" },
    ] as any,
  },

  {
    id: "wokwi-p13-baterai-18650-solar-bms",
    judul: "Manajemen Baterai Li-Ion 18650 & Proteksi Tegangan Rendah (Socket 18650 + Sensor Volt + Relay Cut-Off)",
    level: "Proyek 13 • Power & BMS IoT",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p13-esp", tipe: "esp32", label: "ESP32 BMS Monitor", x: 35, y: 75, nyala: true },
      { id: "p13-bat", tipe: "baterai_18650", label: "Socket Baterai 18650", x: 220, y: 45, nilaiSensor: 12, nyala: true },
      { id: "p13-vlt", tipe: "sensor_tegangan", label: "Sensor Tegangan DC", x: 220, y: 195, nilaiSensor: 12, nyala: true },
      { id: "p13-rel", tipe: "relay_1ch", label: "Relay Charger Surya", x: 420, y: 120, nyala: false },
      { id: "p13-led", tipe: "led_hijau", label: "Indikator Charging", x: 580, y: 80, nyala: false },
    ],
    kabel: [
      { id: "p13-k1", dariId: "p13-bat", pinAsal: "VCC", keId: "p13-vlt", pinTujuan: "VCC", warna: "rose", titikSiku: [{ x: 195, y: 130 }] },
      { id: "p13-k2", dariId: "p13-vlt", pinAsal: "SIG", keId: "p13-esp", pinTujuan: "GPIO35", warna: "sky", titikSiku: [{ x: 195, y: 215 }] },
      { id: "p13-k3", dariId: "p13-esp", pinAsal: "GPIO32", keId: "p13-rel", pinTujuan: "IN1", warna: "#22c55e", titikSiku: [{ x: 375, y: 185 }] },
      { id: "p13-k4", dariId: "p13-rel", pinAsal: "NO", keId: "p13-led", pinTujuan: "ANODA", warna: "#facc15", titikSiku: [{ x: 540, y: 120 }] },
    ],
    kodePerMcu: {
      "p13-esp": `// [PROYEK 13] BATTERY MANAGEMENT SYSTEM (BMS 18650 & CHARGER CUT-OFF)
#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  pinMode(35, INPUT);
  pinMode(32, OUTPUT);
  WiFi.begin("HibahIlmu-Guest", "");
}

void loop() {
  int adcVolt = analogRead(35);
  digitalWrite(32, adcVolt < 11 ? HIGH : LOW);
  Serial.println("[BMS 18650] Monitoring Tegangan Sel Li-Ion...");
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p13-esp": `from machine import Pin, ADC\nimport time\nadc = ADC(Pin(35))\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p13-1", tipe: "gauge", judul: "Tegangan Baterai 18650 (V)", vPin: "V1", targetNodeId: "p13-vlt", warna: "sky" },
    ] as any,
  },

  {
    id: "wokwi-p14-gps-geofencing-tracker",
    judul: "Pelacak Aset Kendaraan & Alarm Geofencing Satelit (GPS NEO-6M + RFID + Sirine Buzzer)",
    level: "Proyek 14 • Fleet & Asset Tracking",
    kategoriProyek: "IoT & Otomasi",
    deskripsiSingkat: "Simulasi rangkaian interaktif berjalan murni sesuai logika koding C++ & MicroPython.",
    langkahWiring: ["1. Klik Muat Template Ini", "2. Klik Compile & Run Semua", "3. Ubah nilai sensor di Inspector kanan untuk menguji aktuator"],
    nodes: [
      { id: "p14-esp", tipe: "esp32", label: "ESP32 GPS Tracker", x: 35, y: 75, nyala: true },
      { id: "p14-gps", tipe: "gps_neo6m", label: "Modul Satelit GPS", x: 225, y: 50, nilaiSensor: 8, nyala: true },
      { id: "p14-rfd", tipe: "rfid_rc522", label: "RFID Kunci Kontak", x: 225, y: 195, nilaiSensor: 100, nyala: false },
      { id: "p14-rel", tipe: "relay_1ch", label: "Relay Starter Mesin", x: 425, y: 120, nyala: false },
      { id: "p14-buz", tipe: "buzzer", label: "Alarm Anti-Curanmor", x: 580, y: 80, nyala: false },
    ],
    kabel: [
      { id: "p14-k1", dariId: "p14-gps", pinAsal: "SIG", keId: "p14-esp", pinTujuan: "GPIO16", warna: "#22c55e", titikSiku: [{ x: 195, y: 120 }] },
      { id: "p14-k2", dariId: "p14-rfd", pinAsal: "SDA(SS)", keId: "p14-esp", pinTujuan: "GPIO5", warna: "sky", titikSiku: [{ x: 195, y: 220 }] },
      { id: "p14-k3", dariId: "p14-esp", pinAsal: "GPIO32", keId: "p14-rel", pinTujuan: "IN1", warna: "#f97316", titikSiku: [{ x: 380, y: 185 }] },
      { id: "p14-k4", dariId: "p14-esp", pinAsal: "GPIO27", keId: "p14-buz", pinTujuan: "ANODA", warna: "rose", titikSiku: [{ x: 540, y: 205 }] },
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
  Serial.println("[GPS TRACKER] Lat: -0.5071, Lon: 101.4478 | Satelit: 8 Locked");
  delay(800);
}`,
    },
    kodeMicroPythonPerMcu: {
      "p14-esp": `from machine import Pin, UART\nimport time\ngps = UART(2, 9600)\nwhile True:\n  time.sleep_ms(800)`,
    },
    blynkWidgets: [
      { id: "w-p14-1", tipe: "gauge", judul: "Peta Lokasi GPS Kendaraan", vPin: "V4", targetNodeId: "p14-gps", warna: "emerald" },
    ] as any,
  },
];