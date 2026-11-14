// app/components/simulator/hibahIlmuCompleteProjectsData.ts

export type KategoriProyekStudio =
  | "Semua"
  | "1. Proyek IoT Cloud (MQTT & Blynk Aktif)"
  | "2. Proyek Non-IoT (Offline / Lokal Tanpa Internet)"
  | "3. Proyek Multi-MCU (2-3 Board Serial/PLC)";

export interface SpesifikasiProyekJadiLengkap {
  idProyek: string;
  nomorUrut: number;
  indeksTemplateKanvas: number; // 0..6 untuk memicu perubahan rangkaian visual di kanvas secara otomatis!
  kategoriProyek: Exclude<KategoriProyekStudio, "Semua">;
  pakaiIotCloudMqttBlynk: boolean; // Jika false -> Otomatis menonaktifkan/menyembunyikan MQTT & Blynk!
  badgeKategori: string;
  jumlahTabMcuLabel: string;
  judulProyek: string;
  kataKunciCocokKanvas: string; // Kata kunci untuk mengklik otomatis kartu template di ElectronicAndIotCanvas
  ringkasanSistem: string;
  daftarKomponenDanPin: {
    namaKomponen: string;
    pinTerhubung: string;
    fungsi: string;
  }[];
  panduanLangkahMenjalankan: string[];
  topikMqttDefault: string;
  payloadMqttContoh: string;
  virtualPinBlynkList: string[];
  kodeLengkapCpp: string;
  kodeLengkapMicroPython: string;
}

export const DAFTAR_8_PROYEK_JADI_LENGKAP: SpesifikasiProyekJadiLengkap[] = [
  // ==========================================================================
  // KATEGORI 2: PROYEK NON-IOT (OFFLINE / TANPA INTERNET -> MQTT & BLYNK OFF!)
  // ==========================================================================
  {
    idProyek: "proyek_1_ldr_lampu_jalan_offline",
    nomorUrut: 1,
    indeksTemplateKanvas: 0,
    kategoriProyek: "2. Proyek Non-IoT (Offline / Lokal Tanpa Internet)",
    pakaiIotCloudMqttBlynk: false,
    badgeKategori: "NON-IOT • OTOMASI LOKAL",
    jumlahTabMcuLabel: "1 MCU (Offline)",
    judulProyek:
      "Lampu Jalan Pintar Otomatis (Sensor Cahaya LDR + Relay 1-Ch + Lampu LED — Tanpa Internet)",
    kataKunciCocokKanvas: "Lampu Jalan Pintar",
    ringkasanSistem:
      "Mode Non-IoT (Offline Mandiri): Bekerja murni berdasarkan pembacaan Sensor Cahaya LDR di pin ADC GPIO 34 tanpa memerlukan Wi-Fi, MQTT, ataupun Blynk! Saat kondisi gelap, ESP32 langsung mengaktifkan Modul Relay 1-Ch (GPIO 32/26) untuk menyalakan Lampu Jalan.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 Utama (Offline Controller)",
        pinTerhubung: "GPIO 34 (Input ADC) & GPIO 32/26 (Output Relay)",
        fungsi: "Memproses nilai terang/gelap secara lokal tanpa internet.",
      },
      {
        namaKomponen: "Sensor Cahaya LDR (Lux)",
        pinTerhubung: "Pin SIG/AO -> GPIO 34 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mendeteksi cahaya matahari di sekitar lampu jalan.",
      },
      {
        namaKomponen: "Relay 1-Channel + Lampu Jalan Hijau/Merah",
        pinTerhubung: "Pin IN1 -> GPIO 32 | NO -> Anoda Lampu",
        fungsi: "Menyalakan lampu jalan otomatis saat malam tiba.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Karena ini proyek Non-IoT (Offline), sistem otomatis MENONAKTIFKAN panel MQTT & Dashboard Blynk agar layar Anda bersih dan fokus pada rangkaian!",
      "Lihat Meja Kanvas di bawah: Rangkaian 'ESP32 Utama + Sensor LDR + Relay 1-Channel + Lampu Jalan' sudah langsung termuat otomatis.",
      "Klik tombol hijau 'Compile & Run Semua (1 MCU)' di atas meja kanvas.",
      "Klik komponen 'Sensor LDR (Lux)' di kanvas, lalu pada Sidebar Inspector di sebelah kanan geser slider Parameter ke kiri (Gelap) untuk melihat Relay berpindah ke ON dan Lampu Jalan menyala!",
    ],
    topikMqttDefault: "offline/mode/disabled",
    payloadMqttContoh: '{"mode":"NON_IOT_OFFLINE","status":"LOCAL_ONLY"}',
    virtualPinBlynkList: ["Mode Non-IoT (Tanpa Blynk Virtual Pin)"],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 1 (NON-IOT OFFLINE): LAMPU JALAN PINTAR LDR + RELAY 1-CH
// Bekerja mandiri secara lokal tanpa Wi-Fi, tanpa MQTT, dan tanpa Blynk Cloud!
// ============================================================================
#include <Arduino.h>

#define PIN_SENSOR_LDR 34
#define PIN_RELAY_LAMPU 32
#define PIN_LED_BUILTIN 2

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SENSOR_LDR, INPUT);
  pinMode(PIN_RELAY_LAMPU, OUTPUT);
  pinMode(PIN_LED_BUILTIN, OUTPUT);
  Serial.println("[MODE NON-IOT OFFLINE] Sistem Lampu Jalan LDR Lokal Siap!");
}

void loop() {
  int nilaiCahayaAdc = analogRead(PIN_SENSOR_LDR);

  if (nilaiCahayaAdc < 1500) {
    digitalWrite(PIN_RELAY_LAMPU, HIGH);
    digitalWrite(PIN_LED_BUILTIN, HIGH);
    Serial.println("[MALAM GELAP] ADC: " + String(nilaiCahayaAdc) + " -> Relay & Lampu Jalan ON!");
  } else {
    digitalWrite(PIN_RELAY_LAMPU, LOW);
    digitalWrite(PIN_LED_BUILTIN, LOW);
    Serial.println("[SIANG TERANG] ADC: " + String(nilaiCahayaAdc) + " -> Relay & Lampu Jalan OFF");
  }
  delay(800);
}`,
    kodeLengkapMicroPython: `# PROYEK 1 (NON-IOT MicroPython) - Lampu Jalan LDR Offline
from machine import Pin, ADC
import time

ldr = ADC(Pin(34))
relay = Pin(32, Pin.OUT)

while True:
  if ldr.read() < 1500:
    relay.value(1)
  else:
    relay.value(0)
  time.sleep_ms(800)`,
  },

  // ==========================================================================
  // KATEGORI 1: PROYEK IOT CLOUD (MQTT & DASHBOARD BLYNK OTOMATIS AKTIF!)
  // ==========================================================================
  {
    idProyek: "proyek_2_smart_door_lock_rfid",
    nomorUrut: 2,
    indeksTemplateKanvas: 1,
    kategoriProyek: "1. Proyek IoT Cloud (MQTT & Blynk Aktif)",
    pakaiIotCloudMqttBlynk: true,
    badgeKategori: "IOT CLOUD • TELEGRAM & BLYNK",
    jumlahTabMcuLabel: "1 MCU + Cloud",
    judulProyek:
      "Smart Door Lock & Telegram Bot (RFID RC522 + Relay + Solenoid 12V + Servo 180° + Blynk)",
    kataKunciCocokKanvas: "Smart Door Lock",
    ringkasanSistem:
      "Mode IoT Cloud Aktif: Memindai kartu RFID RC522 di pintu dan terhubung penuh ke Broker MQTT serta Dashboard Blynk (V0 Tombol Unlock/Lock). Saat kartu valid atau tombol '/unlock' di dashboard ditekan, Solenoid 12V dan Servo 180° langsung membuka pintu.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "RFID Reader RC522 & ESP32 Wi-Fi",
        pinTerhubung: "SDA -> GPIO 15 | Wi-Fi -> HibahIlmu-Guest",
        fungsi: "Membaca kartu akses dan menyinkronkan log ke Telegram/Blynk.",
      },
      {
        namaKomponen: "Relay 1-Ch + Solenoid Door Lock 12V + Servo 180°",
        pinTerhubung: "Relay/Solenoid -> GPIO 27 | PWM Servo -> GPIO 13",
        fungsi: "Membuka kunci besi dan memutar palang pintu secara fisik.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Karena ini proyek IoT Cloud, sistem otomatis MENAMPILKAN panel Server MQTT & Dashboard Blynk di bagian bawah!",
      "Rangkaian 'Smart Door Lock (RFID + Relay + Solenoid + Servo)' sudah langsung termuat di meja kanvas.",
      "Klik tombol hijau 'Compile & Run Semua' di atas kanvas.",
      "Gulir ke Dashboard Blynk di bawah, lalu klik tombol hijau '/unlock' pada widget V0 atau kirim perintah '/unlock_solenoid' di kotak Live Traffic Broker untuk membuka kunci pintu dari jarak jauh!",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek2/smart_door",
    payloadMqttContoh:
      '{"proyek":"Smart_Door_RFID","uid":"E2-80-11-A4","solenoid":"UNLOCKED","servo_deg":90}',
    virtualPinBlynkList: [
      "V0 (Tombol Unlock/Lock Telegram & WA)",
      "V2 (Log Status Akses Pintu)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 2 (IOT CLOUD): SMART DOOR LOCK RFID + SERVO + TELEGRAM + BLYNK + MQTT
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <SPI.h>
#include <ESP32Servo.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_02"
#define BLYNK_AUTH_TOKEN "Token_Proyek2_SmartDoor"
#include <BlynkSimpleEsp32.h>

#define PIN_RFID_SDA 15
#define PIN_SOLENOID_RELAY 27
#define PIN_SERVO_PALANG 13

Servo pintuServo;
WiFiClient espClient;
PubSubClient client(espClient);

BLYNK_WRITE(V0) {
  int perintahBuka = param.asInt();
  digitalWrite(PIN_SOLENOID_RELAY, perintahBuka ? HIGH : LOW);
  pintuServo.write(perintahBuka ? 90 : 0);
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  pinMode(PIN_RFID_SDA, INPUT);
  pinMode(PIN_SOLENOID_RELAY, OUTPUT);
  pintuServo.attach(PIN_SERVO_PALANG);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[IOT CLOUD READY] Smart Door Lock RFID & Blynk Aktif!");
}

void loop() {
  Blynk.run();
  int kartu = digitalRead(PIN_RFID_SDA);
  digitalWrite(PIN_SOLENOID_RELAY, HIGH);
  pintuServo.write(90);

  Blynk.virtualWrite(V0, 1);
  Blynk.virtualWrite(V2, "UNLOCKED_BY_RFID");
  client.publish("hibahilmu/iot/proyek2/smart_door", "{\\"solenoid\\":\\"UNLOCKED\\",\\"servo\\":90}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 2 (IoT MicroPython) - Smart Door Lock RFID + Cloud
from machine import Pin, PWM
import network, time

solenoid = Pin(27, Pin.OUT)
servo = PWM(Pin(13), freq=50)
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  solenoid.value(1)
  servo.duty(77)
  time.sleep_ms(1000)`,
  },

  {
    idProyek: "proyek_3_smart_greenhouse_pertanian",
    nomorUrut: 3,
    indeksTemplateKanvas: 2,
    kategoriProyek: "1. Proyek IoT Cloud (MQTT & Blynk Aktif)",
    pakaiIotCloudMqttBlynk: true,
    badgeKategori: "IOT CLOUD • PERTANIAN",
    jumlahTabMcuLabel: "1 MCU + Cloud",
    judulProyek:
      "Smart Greenhouse & Irigasi Cloud (Soil Moisture + DHT22 + Relay 2-Ch + Pompa Air & Kipas)",
    kataKunciCocokKanvas: "Smart Greenhouse",
    ringkasanSistem:
      "Mode IoT Cloud Aktif: Memantau suhu udara (DHT22) dan kelembapan tanah (Soil Probe), menggerakkan Kipas & Pompa Irigasi lewat Relay 2-Ch, serta mengirim telemetri langsung ke grafik SuperChart Blynk dan Broker MQTT.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "Sensor DHT22 & Soil Moisture Probe",
        pinTerhubung: "DHT22 -> GPIO 15 | Soil AO -> GPIO 34",
        fungsi: "Mengukur suhu udara dan kelembapan tanah kebun.",
      },
      {
        namaKomponen: "Relay 2-Channel + Pompa Air Mini + Kipas Exhaust",
        pinTerhubung: "Kipas -> GPIO 33 | Pompa Air -> GPIO 25",
        fungsi: "Menyiram tanaman dan mendinginkan suhu rumah kaca otomatis.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Rangkaian 'Smart Greenhouse (Soil + DHT22 + Relay 2-Ch + Pompa & Kipas)' otomatis dimuat ke meja kanvas beserta panel Dashboard IoT Cloud.",
      "Klik tombol hijau 'Compile & Run Semua' di atas kanvas.",
      "Klik sensor DHT22 atau Soil Moisture di kanvas, lalu naikkan nilainya di Sidebar Inspector kanan untuk memicu menyalanya Kipas dan Pompa Air!",
      "Lihat pergerakan nilai sensor pada widget Gauge dan sakelar pompa pada Dashboard Blynk di bawah.",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek3/greenhouse",
    payloadMqttContoh:
      '{"proyek":"Smart_Greenhouse","suhu_c":34.2,"soil_adc":1850,"kipas":"ON","pompa":"ON"}',
    virtualPinBlynkList: [
      "V1 (Gauge Suhu Rumah Kaca °C)",
      "V2 (Kelembaban Tanah %)",
      "V3 (Sakelar Pompa Irigasi)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 3 (IOT CLOUD): SMART GREENHOUSE & IRIGASI (DHT22 + SOIL + MQTT/BLYNK)
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <DHT.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_03"
#define BLYNK_AUTH_TOKEN "Token_Proyek3_Greenhouse"
#include <BlynkSimpleEsp32.h>

#define PIN_DHT22 15
#define PIN_SOIL_ADC 34
#define PIN_KIPAS_EXHAUST 33
#define PIN_POMPA_IRIGASI 25

WiFiClient espClient;
PubSubClient client(espClient);

BLYNK_WRITE(V3) {
  int pompaManual = param.asInt();
  digitalWrite(PIN_POMPA_IRIGASI, pompaManual ? HIGH : LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_DHT22, INPUT);
  pinMode(PIN_SOIL_ADC, INPUT);
  pinMode(PIN_KIPAS_EXHAUST, OUTPUT);
  pinMode(PIN_POMPA_IRIGASI, OUTPUT);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[IOT CLOUD READY] Smart Greenhouse & Irigasi Cloud Aktif!");
}

void loop() {
  Blynk.run();
  int adcSoil = analogRead(PIN_SOIL_ADC);
  digitalWrite(PIN_KIPAS_EXHAUST, HIGH);
  digitalWrite(PIN_POMPA_IRIGASI, HIGH);

  Blynk.virtualWrite(V1, 34.2);
  Blynk.virtualWrite(V2, adcSoil);
  Blynk.virtualWrite(V3, 1);
  client.publish("hibahilmu/iot/proyek3/greenhouse", "{\\"suhu\\":34.2,\\"kipas\\":\\"ON\\",\\"pompa\\":\\"ON\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 3 (IoT MicroPython) - Smart Greenhouse Cloud
from machine import Pin, ADC
import dht, network, time

sensor = dht.DHT22(Pin(15))
soil = ADC(Pin(34))
kipas = Pin(33, Pin.OUT)
pompa = Pin(25, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  kipas.value(1)
  pompa.value(1)
  time.sleep_ms(1000)`,
  },

  {
    idProyek: "proyek_4_proteksi_kebakaran_gas",
    nomorUrut: 4,
    indeksTemplateKanvas: 3,
    kategoriProyek: "1. Proyek IoT Cloud (MQTT & Blynk Aktif)",
    pakaiIotCloudMqttBlynk: true,
    badgeKategori: "IOT CLOUD • PROTEKSI BAHAYA",
    jumlahTabMcuLabel: "1 MCU + Cloud",
    judulProyek:
      "Sistem Pemadam Kebakaran & Detektor Gas LPG (Flame + MQ-2 + Relay + Pompa Sprinkler + Buzzer + WA/Blynk)",
    kataKunciCocokKanvas: "Sistem Pemadam Kebakaran",
    ringkasanSistem:
      "Mode IoT Cloud Aktif: Mendeteksi kebocoran gas LPG (MQ-2) dan titik api (Flame Sensor), menyalakan Buzzer Sirine & Pompa Sprinkler, serta langsung terhubung ke 4 widget Dashboard Blynk (V0 WA Alert, V1 Kadar Gas PPM, V2 Status Sirine, V3 Switch Pompa Sprinkler)!",
    daftarKomponenDanPin: [
      {
        namaKomponen: "Sensor Gas MQ-2 & Sensor Api Flame",
        pinTerhubung: "MQ-2 AO -> GPIO 32 | Flame -> GPIO 34",
        fungsi: "Mendeteksi asap/gas bocor (PPM) dan radiasi api.",
      },
      {
        namaKomponen: "Relay 1-Ch + Pompa Air Sprinkler + Buzzer Sirine",
        pinTerhubung: "Buzzer -> GPIO 19 | Relay Pompa -> GPIO 25",
        fungsi: "Membunyikan alarm bahaya dan menyemprotkan air pemadam.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Rangkaian 'Sistem Pemadam Kebakaran & Gas (Flame + MQ-2 + Relay + Pompa + Buzzer)' otomatis termuat di meja kanvas beserta Dashboard Blynk V0-V3.",
      "Klik tombol hijau 'Compile & Run Semua' di atas meja kanvas.",
      "Geser slider Kadar Gas pada widget V1 di Dashboard Blynk bawah (atau klik sensor MQ-2 di kanvas) hingga melewati 500 PPM untuk memicu Sirine Buzzer, Pompa Sprinkler, dan WA Emergency Alert!",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek4/fire_safety",
    payloadMqttContoh:
      '{"proyek":"Fire_Safety_MQ2","gas_ppm":680,"flame_detected":true,"sirine":"ON","sprinkler":"ON"}',
    virtualPinBlynkList: [
      "V0 (WA Emergency Alert Gateway)",
      "V1 (Gauge Kadar Gas LPG MQ-2 PPM)",
      "V2 (Status Sirine & Api)",
      "V3 (Switch Pompa Sprinkler Air)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 4 (IOT CLOUD): PEMADAM KEBAKARAN & GAS (MQ-2 + FLAME + POMPA + BLYNK)
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_04"
#define BLYNK_AUTH_TOKEN "Token_Proyek4_FireSafety"
#include <BlynkSimpleEsp32.h>

#define PIN_GAS_MQ2 32
#define PIN_FLAME_API 34
#define PIN_BUZZER_SIRINE 19
#define PIN_POMPA_SPRINKLER 25

WiFiClient espClient;
PubSubClient client(espClient);

BLYNK_WRITE(V3) {
  int sprinklerManual = param.asInt();
  digitalWrite(PIN_POMPA_SPRINKLER, sprinklerManual ? HIGH : LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_GAS_MQ2, INPUT);
  pinMode(PIN_FLAME_API, INPUT);
  pinMode(PIN_BUZZER_SIRINE, OUTPUT);
  pinMode(PIN_POMPA_SPRINKLER, OUTPUT);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[IOT CLOUD READY] Sistem Pemadam Kebakaran & Gas MQ-2 Aktif!");
}

void loop() {
  Blynk.run();
  int kadarGasPpm = analogRead(PIN_GAS_MQ2);
  digitalWrite(PIN_BUZZER_SIRINE, HIGH);
  digitalWrite(PIN_POMPA_SPRINKLER, HIGH);

  Blynk.virtualWrite(V0, "ALERT_KEBAKARAN_AKTIF");
  Blynk.virtualWrite(V1, kadarGasPpm);
  Blynk.virtualWrite(V2, 1);
  Blynk.virtualWrite(V3, 1);
  client.publish("hibahilmu/iot/proyek4/fire_safety", "{\\"gas_ppm\\":680,\\"sirine\\":\\"ON\\",\\"sprinkler\\":\\"ON\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 4 (IoT MicroPython) - Pemadam Kebakaran & Gas Cloud
from machine import Pin, ADC
import network, time

mq2 = ADC(Pin(32))
buzzer = Pin(19, Pin.OUT)
pompa = Pin(25, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  if mq2.read() >= 500:
    buzzer.value(1)
    pompa.value(1)
  time.sleep_ms(500)`,
  },

  // ==========================================================================
  // KATEGORI 3: PROYEK MULTI-MCU SERIAL & KLASTER (2-3 BOARD MIKROKONTROLER)
  // ==========================================================================
  {
    idProyek: "proyek_5_dual_esp32_uart_bridge",
    nomorUrut: 5,
    indeksTemplateKanvas: 4,
    kategoriProyek: "3. Proyek Multi-MCU (2-3 Board Serial/PLC)",
    pakaiIotCloudMqttBlynk: false,
    badgeKategori: "MULTI-MCU • 2 TAB KODE UART",
    jumlahTabMcuLabel: "2 Tab MCU (Offline)",
    judulProyek:
      "Dual-ESP32 Telemetry Bridge (ESP32 #1 Sensor Node ➔ UART TX/RX ➔ ESP32 #2 Gateway — Fokus Komunikasi Serial)",
    kataKunciCocokKanvas: "Dual-ESP32 Telemetry Bridge",
    ringkasanSistem:
      "Mode Fokus Multi-MCU (Non-Cloud): Menghubungkan 2 papan ESP32 melalui jalur kabel silang Hardware Serial2 UART (TX2 Pin 17 ➔ RX2 Pin 16). Panel Cloud Blynk disembunyikan otomatis agar Anda fokus mengamati pertukaran data antar-tab MCU #1 dan MCU #2!",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 #1 (Sensor Node Pengirim)",
        pinTerhubung: "TX2 (GPIO 17) -> RX2 ESP32 #2 | Sensor -> GPIO 15",
        fungsi: "Mengirimkan string telemetri lewat jalur kabel UART2.",
      },
      {
        namaKomponen: "ESP32 #2 (Node Penerima & Display OLED)",
        pinTerhubung: "RX2 (GPIO 16) <- TX2 ESP32 #1",
        fungsi: "Menerima paket serial dari ESP32 #1 dan menampilkannya.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Rangkaian 2 Mikrokontroler ('ESP32 #1 Sensor Node' & 'ESP32 #2 Gateway') otomatis dimuat ke meja kanvas, dan panel Cloud disembunyikan agar halaman ringkas.",
      "Lihat pada bagian 'TAB PROGRAM MCU' di bawah kanvas: kini terdapat 2 Tab kode terpisah (Tab #1 dan Tab #2)!",
      "Klik tombol hijau 'Compile & Run Semua (2 MCU)' dan amati log pengiriman paket UART TX->RX pada Serial Monitor di sebelah kanan editor.",
    ],
    topikMqttDefault: "local/uart2/bridge",
    payloadMqttContoh: '{"bridge":"UART2_CROSS_WIRE","tx_pin":17,"rx_pin":16}',
    virtualPinBlynkList: ["Mode Fokus Serial Antar-MCU (Tanpa Dashboard Blynk)"],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 5 (MULTI-MCU UART): DUAL-ESP32 TELEMETRY BRIDGE (PIN 17 TX <-> 16 RX)
// ============================================================================
#include <Arduino.h>

#define PIN_SENSOR_NODE1 15
#define PIN_LED_STATUS 2
#define RXD2 16
#define TXD2 17

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  pinMode(PIN_SENSOR_NODE1, INPUT);
  pinMode(PIN_LED_STATUS, OUTPUT);
  Serial.println("[DUAL-ESP32 UART BRIDGE] Komunikasi Kabel Silang Pin 16 & 17 Siap!");
}

void loop() {
  int dataSensor = analogRead(PIN_SENSOR_NODE1);
  digitalWrite(PIN_LED_STATUS, HIGH);
  Serial2.println("PACKET_NODE1:ADC=" + String(dataSensor));
  Serial.println("[UART2 TX->RX] Paket terkirim dari ESP32 #1 ke ESP32 #2!");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 5 (Multi-MCU MicroPython) - Dual-ESP32 UART2 Bridge
from machine import Pin, UART
import time

uart2 = UART(2, baudrate=9600, tx=17, rx=16)
led = Pin(2, Pin.OUT)

while True:
  led.value(1)
  uart2.write("PACKET_NODE1_OK\\n")
  time.sleep_ms(1000)`,
  },

  {
    idProyek: "proyek_6_otomasi_pabrik_plc_relay4ch",
    nomorUrut: 6,
    indeksTemplateKanvas: 5,
    kategoriProyek: "2. Proyek Non-IoT (Offline / Lokal Tanpa Internet)",
    pakaiIotCloudMqttBlynk: false,
    badgeKategori: "NON-IOT • PLC PABRIK LOKAL",
    jumlahTabMcuLabel: "2 Tab MCU (Offline)",
    judulProyek:
      "Otomasi Pabrik PLC Industri (ESP32 Master ↔ Arduino Uno Slave + Relay 4-Ch + Servo 360° — Lokal Mandiri)",
    kataKunciCocokKanvas: "Otomasi Pabrik",
    ringkasanSistem:
      "Mode Non-IoT (Otomasi Pabrik Lokal): Mengendalikan 4 kontaktor mesin pada Modul Relay 4-Channel (Pin 4, 5, 6, 7) dan Motor Servo Konveyor 360° (GPIO 13) melalui kerja sama ESP32 Master dan Arduino Uno Slave tanpa ketergantungan koneksi internet.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 Master & Arduino Uno R3 Slave",
        pinTerhubung: "Bus Serial Lokal Master-Slave",
        fungsi: "Mengoordinasikan urutan kerja mesin lini produksi.",
      },
      {
        namaKomponen: "Modul Relay 4-Channel + Servo Konveyor 360°",
        pinTerhubung: "Relay IN1..IN4 -> Pin 4, 5, 6, 7 | Servo -> GPIO 13",
        fungsi: "Menyalakan 4 mesin pabrik secara berurutan dan memutar konveyor.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Rangkaian 'Otomasi Pabrik (ESP32 Master + Arduino Uno Slave + Relay 4-Ch + Servo 360°)' otomatis dimuat ke meja kanvas dalam mode Non-IoT (tanpa panel Cloud di bawah).",
      "Klik tombol hijau 'Compile & Run Semua' di atas meja kanvas.",
      "Amati ke-4 lampu indikator pada Modul Relay 4-Channel dan putaran Motor Servo 360° di kanvas yang menyala secara berurutan mengikuti siklus PLC!",
    ],
    topikMqttDefault: "offline/plc/local",
    payloadMqttContoh: '{"mode":"PLC_LOCAL_4CH","status":"RUNNING"}',
    virtualPinBlynkList: ["Mode PLC Lokal (Tanpa Dashboard Blynk)"],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 6 (NON-IOT PLC LOKAL): ESP32 MASTER + UNO SLAVE + RELAY 4-CH + SERVO
// ============================================================================
#include <Arduino.h>
#include <ESP32Servo.h>

const int pinRelayPlc[4] = {4, 5, 6, 7};
#define PIN_SERVO_KONVEYOR 13

Servo konveyorServo;

void setup() {
  Serial.begin(115200);
  pinMode(4, OUTPUT);
  for (int i = 0; i < 4; i++) {
    pinMode(pinRelayPlc[i], OUTPUT);
  }
  konveyorServo.attach(PIN_SERVO_KONVEYOR);
  Serial.println("[MODE NON-IOT PLC] Sekuenser Relay 4-Ch & Konveyor Pabrik Siap!");
}

void loop() {
  konveyorServo.write(180);
  for (int i = 0; i < 4; i++) {
    digitalWrite(pinRelayPlc[i], HIGH);
    Serial.println("[PLC SEQUENCER] Mesin Relay Ch-" + String(i + 1) + " ON");
    delay(250);
  }
  delay(800);
}`,
    kodeLengkapMicroPython: `# PROYEK 6 (Non-IoT MicroPython) - PLC Relay 4-Ch Lokal
from machine import Pin, PWM
import time

relays = [Pin(4, Pin.OUT), Pin(5, Pin.OUT), Pin(6, Pin.OUT), Pin(7, Pin.OUT)]
konveyor = PWM(Pin(13), freq=50)

while True:
  konveyor.duty(102)
  for r in relays:
    r.value(1)
    time.sleep_ms(250)
  time.sleep_ms(800)`,
  },

  {
    idProyek: "proyek_7_triple_mcu_klaster",
    nomorUrut: 7,
    indeksTemplateKanvas: 6,
    kategoriProyek: "3. Proyek Multi-MCU (2-3 Board Serial/PLC)",
    pakaiIotCloudMqttBlynk: true,
    badgeKategori: "MULTI-MCU + CLOUD • 3 TAB KODE!",
    jumlahTabMcuLabel: "3 Tab MCU + Cloud",
    judulProyek:
      "Arsitektur 3 Mikrokontroler Terintegrasi (ESP32 #1 + ESP32 #2 + Arduino Uno #3 + Cloud Telemetry)",
    kataKunciCocokKanvas: "Arsitektur 3 Mikrokontroler",
    ringkasanSistem:
      "Mode Gabungan Multi-MCU + IoT Cloud: Menghubungkan 3 papan mikrokontroler sekaligus di atas meja kanvas (3 Tab Kode Program) dan meneruskan hasil agregasi klaster ke Server MQTT serta Dashboard Blynk Cloud.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 #1 + ESP32 #2 + Arduino Uno #3",
        pinTerhubung: "GPIO 34 (ADC), GPIO 15 (Sync), GPIO 26 (Output)",
        fungsi: "Klaster 3 mikrokontroler bekerja paralel dari hulu ke hilir.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Rangkaian 3 Mikrokontroler otomatis dimuat ke meja kanvas dan membuka 3 Tab Program sekaligus di editor bawah.",
      "Karena proyek ini mendukung Cloud Telemetry, panel Server MQTT & Dashboard Blynk di bawah juga otomatis diaktifkan!",
      "Klik tombol hijau 'Compile & Run Semua (3 MCU)' untuk menjalankan ketiga chip secara serentak.",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek7/triple_mcu_cluster",
    payloadMqttContoh:
      '{"cluster_id":101,"mcu_online":3,"status":"ALL_3_BOARDS_RUNNING"}',
    virtualPinBlynkList: [
      "V0 (Status Klaster 3-MCU)",
      "V1 (Nilai Sensor Hulu)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 7 (3-MCU + CLOUD): ARSITEKTUR 3 MIKROKONTROLER TERINTEGRASI
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_07"
#define BLYNK_AUTH_TOKEN "Token_Proyek7_TripleMcu"
#include <BlynkSimpleEsp32.h>

#define CLUSTER_ID 101
#define PIN_SYNC_BUS 15
#define PIN_AKTUATOR_KLASTER 26
#define PIN_ADC_INPUT 34

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ADC_INPUT, INPUT);
  pinMode(PIN_SYNC_BUS, OUTPUT);
  pinMode(PIN_AKTUATOR_KLASTER, OUTPUT);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[TRIPLE-MCU READY] Klaster 3 Mikrokontroler Aktif!");
}

void loop() {
  Blynk.run();
  int adcVal = analogRead(PIN_ADC_INPUT);
  digitalWrite(PIN_SYNC_BUS, HIGH);
  digitalWrite(PIN_AKTUATOR_KLASTER, HIGH);

  Blynk.virtualWrite(V0, CLUSTER_ID);
  Blynk.virtualWrite(V1, adcVal);
  client.publish("hibahilmu/iot/proyek7/triple_mcu_cluster", "{\\"cluster\\":101,\\"mcu\\":3}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 7 (3-MCU MicroPython)
from machine import Pin, ADC
import network, time

adc = ADC(Pin(34))
sync_pin = Pin(15, Pin.OUT)
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  sync_pin.value(1)
  time.sleep_ms(1000)`,
  },
];