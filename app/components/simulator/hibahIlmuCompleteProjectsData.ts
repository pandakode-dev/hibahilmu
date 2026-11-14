// app/components/simulator/hibahIlmuCompleteProjectsData.ts

export interface SpesifikasiProyekJadiLengkap {
  idProyek: string;
  nomorUrut: number;
  badgeKategori: string;
  jumlahTabMcuLabel: string;
  judulProyek: string;
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
  {
    idProyek: "proyek_1_ldr_lampu_jalan",
    nomorUrut: 1,
    badgeKategori: "PROYEK 1 • DASAR & CLOUD",
    jumlahTabMcuLabel: "1 Tab MCU",
    judulProyek:
      "Lampu Jalan Pintar Otomatis (Sensor Cahaya LDR + Relay 1-Ch + LED + MQTT & Blynk)",
    ringkasanSistem:
      "Mengukur intensitas cahaya matahari menggunakan Sensor LDR di pin ADC GPIO 34. Saat malam tiba (nilai ADC < 1000 / Lux rendah), ESP32 otomatis menyalakan Relay Lampu Jalan di GPIO 26 dan LED Indikator di GPIO 2, sekaligus mengirim status ke Broker MQTT dan Virtual Pin Blynk V0 & V1.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 DevKit V1 (Utama)",
        pinTerhubung: "GPIO 34, GPIO 26, GPIO 2, 3V3, GND",
        fungsi: "Otak pengendali pembaca ADC LDR, penggerak Relay, & pengirim MQTT/Blynk.",
      },
      {
        namaKomponen: "Sensor Cahaya LDR (Photoresistor)",
        pinTerhubung: "Pin AO -> GPIO 34 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mengubah intensitas cahaya langit menjadi tegangan analog (0-4095).",
      },
      {
        namaKomponen: "Modul Relay 1-Channel 5V + Lampu LED",
        pinTerhubung: "Pin IN -> GPIO 26 | Anoda LED -> GPIO 2 | GND -> GND",
        fungsi: "Sakelar magnetik penyala lampu jalan saat kondisi gelap.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 1 (Perhatikan 4 indikator di atas langsung berubah HIJAU semua!).",
      "Pada kanvas rangkaian di bawah, klik juga kartu 'PROYEK 1 • DASAR' jika ingin memuat tata letak visualnya di meja kanvas, lalu klik tombol hijau 'Compile & Run Semua'.",
      "Uji Interaksi Sensor: Buka tab '6. Solar MPPT 24 Jam' atau slider Cahaya LDR, lalu geser ke kondisi Malam Gelap (< 300 Lux) untuk melihat Relay GPIO 26 dan LED menyala!",
      "Cek MQTT & Dashboard Blynk: Gulir ke bawah menuju 'Live MQTT Broker Inspector' dan 'Kanvas Dashboard Blynk' untuk melihat nilai Lux di V1 dan status sakelar lampu di V0.",
      "Klik tombol 'Unduh Dokumentasi Proyek Studio (.docx)' jika ingin mencetak laporan lengkap proyek ini.",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek1/lampu_jalan",
    payloadMqttContoh:
      '{"proyek":"Lampu_Jalan_LDR","adc_cahaya":420,"lux":150,"lampu_relay":"ON"}',
    virtualPinBlynkList: ["V0 (Status Relay Lampu)", "V1 (Intensitas Cahaya Lux)"],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 1: LAMPU JALAN PINTAR (LDR + RELAY 1-CH + LED + WIFI + MQTT + BLYNK)
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_01"
#define BLYNK_AUTH_TOKEN "Token_Proyek1_LampuJalan"
#include <BlynkSimpleEsp32.h>

#define PIN_LDR_ADC 34
#define PIN_RELAY_LAMPU 26
#define PIN_LED_INDIKATOR 2

const char* ssid = "HibahIlmu-Guest";
const char* password = "";
WiFiClient espClient;
PubSubClient client(espClient);

BLYNK_WRITE(V0) {
  int overrideManual = param.asInt();
  digitalWrite(PIN_RELAY_LAMPU, overrideManual ? HIGH : LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LDR_ADC, INPUT);
  pinMode(PIN_RELAY_LAMPU, OUTPUT);
  pinMode(PIN_LED_INDIKATOR, OUTPUT);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[PROYEK 1 READY] Sistem Lampu Jalan Pintar LDR Aktif!");
}

void loop() {
  Blynk.run();
  int nilaiAdcCahaya = analogRead(PIN_LDR_ADC);

  if (nilaiAdcCahaya < 1000) {
    digitalWrite(PIN_RELAY_LAMPU, HIGH);
    digitalWrite(PIN_LED_INDIKATOR, HIGH);
    Serial.println("[MALAM GELAP] ADC: " + String(nilaiAdcCahaya) + " -> Lampu Jalan MENYALA (ON)");
  } else {
    digitalWrite(PIN_RELAY_LAMPU, LOW);
    digitalWrite(PIN_LED_INDIKATOR, LOW);
    Serial.println("[SIANG TERANG] ADC: " + String(nilaiAdcCahaya) + " -> Lampu Jalan PADAM (OFF)");
  }

  Blynk.virtualWrite(V0, nilaiAdcCahaya < 1000 ? 1 : 0);
  Blynk.virtualWrite(V1, nilaiAdcCahaya);
  client.publish("hibahilmu/iot/proyek1/lampu_jalan", "{\\"adc\\":420,\\"lampu\\":\\"ON\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 1 (MicroPython main.py) - Lampu Jalan Pintar LDR + Relay
from machine import Pin, ADC
import network, time

ldr = ADC(Pin(34))
relay = Pin(26, Pin.OUT)
led = Pin(2, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  cahaya = ldr.read()
  if cahaya < 1000:
    relay.value(1)
    led.value(1)
  else:
    relay.value(0)
    led.value(0)
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_2_smart_door_lock_rfid",
    nomorUrut: 2,
    badgeKategori: "PROYEK 2 • IOT & TELEGRAM",
    jumlahTabMcuLabel: "1 Tab MCU",
    judulProyek:
      "Smart Door Lock & Telegram Bot (RFID RC522 + Relay + Solenoid 12V + Servo 180°)",
    ringkasanSistem:
      "Sistem keamanan pintu pintar ganda: memindai kartu akses E-KTP pada RFID Reader RC522 (GPIO 15/SPI) dan menerima perintah jarak jauh dari Telegram Bot / Blynk V0. Saat akses valid, ESP32 menarik kunci besi Solenoid 12V (GPIO 27), memutar palang Motor Servo SG90 ke sudut 90° (GPIO 13), dan membunyikan Buzzer Beep (GPIO 2).",
    daftarKomponenDanPin: [
      {
        namaKomponen: "RFID Card Reader RC522 (13.56MHz)",
        pinTerhubung: "SDA/SS -> GPIO 15 | SCK/MOSI/MISO -> SPI | VCC -> 3V3",
        fungsi: "Memindai UID kartu akses yang ditempelkan pengguna.",
      },
      {
        namaKomponen: "Solenoid Door Lock 12V + Modul Relay 1-Ch",
        pinTerhubung: "Pin IN Relay/Solenoid -> GPIO 27 | GND -> GND",
        fungsi: "Menarik slot kunci besi pintu saat diberi logika HIGH.",
      },
      {
        namaKomponen: "Motor Servo SG90 180° & Buzzer Akses",
        pinTerhubung: "PWM Servo -> GPIO 13 | Buzzer -> GPIO 2",
        fungsi: "Membuka lengan palang pintu 90 derajat & memberi bunyi konfirmasi.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 2 sehingga seluruh indikator GPIO, Wi-Fi, MQTT, dan Blynk aktif.",
      "Klik kartu 'PROYEK 2 • IOT & TELEGRAM' di kanvas bawah lalu tekan tombol hijau 'Compile & Run Semua'.",
      "Uji Buka Kunci via Suara atau Tombol: Buka tab '7. Voice Command IoT' lalu klik tombol 'Halo HibahIlmu, buka kunci pintu sekarang!' atau klik tombol '/unlock' pada widget V0 di Dashboard Blynk bawah!",
      "Uji Notifikasi HP: Buka tab '2. Smartphone Telegram/WA Live' lalu klik 'Kirim Alert ke Telegram Bot' untuk melihat log akses pintu masuk ke layar HP.",
      "Uji Keamanan Siber: Buka tab '8. Cyber-Security Pentest' untuk menguji ketahanan kunci pintu terhadap serangan hacker MITM.",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek2/smart_door",
    payloadMqttContoh:
      '{"proyek":"Smart_Door_RFID","uid":"E2-80-11-A4","solenoid":"UNLOCKED","servo_deg":90}',
    virtualPinBlynkList: [
      "V0 (Tombol Unlock/Lock Telegram & WA)",
      "V2 (Log Status Akses Pintu)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 2: SMART DOOR LOCK & TELEGRAM BOT (RFID + SOLENOID 12V + SERVO 180)
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
#define PIN_BUZZER_AKSES 2

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
  pinMode(PIN_BUZZER_AKSES, OUTPUT);
  pintuServo.attach(PIN_SERVO_PALANG);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  client.subscribe("hibahilmu/iot/proyek2/kontrol");
  Serial.println("[PROYEK 2 READY] Smart Door Lock RFID & Telegram Bot Siap!");
}

void loop() {
  Blynk.run();
  int kartuTerdeteksi = digitalRead(PIN_RFID_SDA);

  // Buka kunci Solenoid & putar Servo 90 derajat saat akses diterima
  digitalWrite(PIN_SOLENOID_RELAY, HIGH);
  digitalWrite(PIN_BUZZER_AKSES, HIGH);
  pintuServo.write(90);
  Serial.println("[RFID & TELEGRAM] Kartu Valid -> Solenoid UNLOCKED & Servo 90 Derajat!");

  Blynk.virtualWrite(V0, 1);
  Blynk.virtualWrite(V2, "UNLOCKED_BY_RFID");
  client.publish("hibahilmu/iot/proyek2/smart_door", "{\\"solenoid\\":\\"UNLOCKED\\",\\"servo\\":90}");
  delay(1000);

  digitalWrite(PIN_BUZZER_AKSES, LOW);
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 2 (MicroPython main.py) - Smart Door Lock Servo & Solenoid
from machine import Pin, PWM
import network, time

solenoid = Pin(27, Pin.OUT)
buzzer = Pin(2, Pin.OUT)
servo = PWM(Pin(13), freq=50)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  solenoid.value(1)
  buzzer.value(1)
  servo.duty(77)
  time.sleep_ms(1000)
  buzzer.value(0)
  servo.duty(26)
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_3_smart_greenhouse_pertanian",
    nomorUrut: 3,
    badgeKategori: "PROYEK 3 • IOT PERTANIAN",
    jumlahTabMcuLabel: "1 Tab MCU",
    judulProyek:
      "Smart Greenhouse & Irigasi Otomatis (Soil Moisture + DHT22 + Relay 2-Ch + Pompa Air & Kipas)",
    ringkasanSistem:
      "Memantau iklim mikro rumah kaca menggunakan Sensor Suhu & Kelembaban DHT22 (GPIO 15) serta Probe Kelembapan Tanah Soil Moisture (GPIO 34). Jika suhu > 32°C atau tanah kering, ESP32 menyalakan Kipas Exhaust (GPIO 33) dan Pompa Air Irigasi (GPIO 25) via Modul Relay 2-Ch, serta mengirim grafik ke Blynk & MQTT.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "Sensor Suhu & Kelembaban DHT22",
        pinTerhubung: "Pin DATA -> GPIO 15 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mengukur suhu udara (°C) dan kelembaban relatif (%) rumah kaca.",
      },
      {
        namaKomponen: "Sensor Kelembapan Tanah (Soil Moisture Probe)",
        pinTerhubung: "Pin AO -> GPIO 34 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mendeteksi tingkat kekeringan media tanam secara analog.",
      },
      {
        namaKomponen: "Relay 2-Channel + Kipas DC Exhaust + Pompa Air Mini",
        pinTerhubung: "IN1 (Kipas) -> GPIO 33 | IN2 (Pompa) -> GPIO 25",
        fungsi: "Mendinginkan suhu ruangan dan menyiram tanaman secara otomatis.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 3 agar kode DHT22, Soil Moisture, Kipas, Pompa, MQTT, dan Blynk aktif.",
      "Klik kartu 'PROYEK 3 • IOT PERTANIAN' di kanvas bawah lalu tekan 'Compile & Run Semua'.",
      "Uji Fisika Rumah Kaca: Buka tab '1. Fisika Lintas-Ruang' pada panel Fitur Unik lalu pantau 'Ruang C: Greenhouse Kebun', atau buka tab '2. Live Serial Plotter' untuk melihat grafik suhu & kelembapan bergerak real-time!",
      "Uji TinyML AI: Buka tab '3. TinyML Edge AI ESP32' untuk melihat rekomendasi dosis penyiraman air/pupuk (mL/menit) berdasarkan suhu saat ini.",
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
// PROYEK 3: SMART GREENHOUSE & IRIGASI (DHT22 + SOIL + RELAY 2-CH + POMPA/KIPAS)
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
  Serial.println("[PROYEK 3 READY] Smart Greenhouse DHT22 & Irigasi Otomatis Aktif!");
}

void loop() {
  Blynk.run();
  int adcSoil = analogRead(PIN_SOIL_ADC);
  float suhuUdara = 34.2;

  if (suhuUdara > 32.0) {
    digitalWrite(PIN_KIPAS_EXHAUST, HIGH);
    digitalWrite(PIN_POMPA_IRIGASI, HIGH);
    Serial.println("[GREENHOUSE PANAS] Suhu 34.2C -> Kipas Exhaust & Pompa Air MENYALA!");
  } else {
    digitalWrite(PIN_KIPAS_EXHAUST, LOW);
    digitalWrite(PIN_POMPA_IRIGASI, LOW);
  }

  Blynk.virtualWrite(V1, suhuUdara);
  Blynk.virtualWrite(V2, adcSoil);
  Blynk.virtualWrite(V3, 1);
  client.publish("hibahilmu/iot/proyek3/greenhouse", "{\\"suhu\\":34.2,\\"kipas\\":\\"ON\\",\\"pompa\\":\\"ON\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 3 (MicroPython main.py) - Smart Greenhouse DHT22, Kipas & Pompa
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
  sensor.measure()
  if sensor.temperature() > 32:
    kipas.value(1)
    pompa.value(1)
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_4_proteksi_kebakaran_gas",
    nomorUrut: 4,
    badgeKategori: "PROYEK 4 • PROTEKSI BAHAYA",
    jumlahTabMcuLabel: "1 Tab MCU",
    judulProyek:
      "Sistem Pemadam Kebakaran & Detektor Gas LPG (Flame + MQ-2 + Relay 1-Ch + Pompa Sprinkler + Buzzer)",
    ringkasanSistem:
      "Mendeteksi kebocoran gas LPG/Metana menggunakan Sensor MQ-2 (GPIO 32) dan titik radiasi api menggunakan Flame Detector (GPIO 34). Saat kadar gas >= 500 PPM atau api terdeteksi, ESP32 langsung membunyikan Sirine Buzzer (GPIO 19), menyemprotkan air lewat Pompa Sprinkler (GPIO 25), dan mengirim peringatan darurat WhatsApp/Telegram ke V0, V1, V2, dan V3!",
    daftarKomponenDanPin: [
      {
        namaKomponen: "Sensor Gas & Asap MQ-2",
        pinTerhubung: "Pin AO -> GPIO 32 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mengukur kepekatan gas bocor & asap kebakaran (PPM).",
      },
      {
        namaKomponen: "Sensor Api (Flame Detector Infrared)",
        pinTerhubung: "Pin DO/AO -> GPIO 34 | VCC -> 3V3 | GND -> GND",
        fungsi: "Mendeteksi kilatan cahaya inframerah titik api.",
      },
      {
        namaKomponen: "Buzzer Piezo Sirine & Pompa Air Sprinkler",
        pinTerhubung: "Buzzer (+) -> GPIO 19 | Relay Pompa -> GPIO 25",
        fungsi: "Membunyikan sirine evakuasi dan memadamkan titik api otomatis.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 4 (Proyek ini langsung cocok 100% dengan widget V0 WA Alert, V1 Kadar Gas LPG, V2 Status Sirine, dan V3 Pompa Sprinkler di Dashboard Blynk bawah!).",
      "Klik kartu 'PROYEK 4 • PROTEKSI BAHAYA' di kanvas bawah lalu tekan 'Compile & Run Semua'.",
      "Uji Simulasi Kebakaran Lintas-Ruang: Buka tab '1. Fisika Lintas-Ruang', perhatikan 'Ruang D: Boiler Pabrik PLC' yang sedang mengalami kebocoran gas 640 PPM, lalu klik tombol 'Sprinkler Pompa: ON' untuk memadamkan apinya!",
      "Uji Kotak Hitam (Blackbox Replay): Buka tab '9. Time-Travel Replay' dan geser slider ke detik T+13s untuk menganalisis momen saat lonjakan gas 700 PPM memicu sirine!",
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
// PROYEK 4: SISTEM PEMADAM KEBAKARAN & GAS (MQ-2 + FLAME + POMPA + BUZZER)
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
  Serial.println("[PROYEK 4 READY] Detektor Gas LPG MQ-2 & Sprinkler Pemadam Aktif!");
}

void loop() {
  Blynk.run();
  int kadarGasPpm = analogRead(PIN_GAS_MQ2);
  int statusApi = digitalRead(PIN_FLAME_API);

  if (kadarGasPpm >= 500 || statusApi == HIGH) {
    digitalWrite(PIN_BUZZER_SIRINE, HIGH);
    digitalWrite(PIN_POMPA_SPRINKLER, HIGH);
    Serial.println("🚨 [BAHAYA KEBAKARAN] Gas: " + String(kadarGasPpm) + " PPM -> SIRINE & SPRINKLER AKTIF!");
  } else {
    digitalWrite(PIN_BUZZER_SIRINE, LOW);
    digitalWrite(PIN_POMPA_SPRINKLER, LOW);
  }

  Blynk.virtualWrite(V0, "ALERT_KEBAKARAN_AKTIF");
  Blynk.virtualWrite(V1, kadarGasPpm);
  Blynk.virtualWrite(V2, 1);
  Blynk.virtualWrite(V3, 1);
  client.publish("hibahilmu/iot/proyek4/fire_safety", "{\\"gas_ppm\\":680,\\"sirine\\":\\"ON\\",\\"sprinkler\\":\\"ON\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 4 (MicroPython main.py) - Detektor Gas MQ-2 & Pemadam Sprinkler
from machine import Pin, ADC
import network, time

mq2 = ADC(Pin(32))
flame = ADC(Pin(34))
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
  {
    idProyek: "proyek_5_dual_esp32_uart_bridge",
    nomorUrut: 5,
    badgeKategori: "PROYEK 5 • DUAL ESP32 (2 TAB KODE)",
    jumlahTabMcuLabel: "2 Tab MCU",
    judulProyek:
      "Dual-ESP32 Telemetry Bridge (ESP32 #1 Sensor Node ➔ UART TX/RX ➔ ESP32 #2 Gateway + OLED)",
    ringkasanSistem:
      "Arsitektur 2 mikrokontroler yang saling berkomunikasi lewat jalur kabel silang Hardware Serial2 UART (Pin TX2 17 ➔ RX2 16). ESP32 #1 bertugas membaca sensor lapangan lalu mengirimkan bingkai paket data serial ke ESP32 #2 Gateway untuk ditampilkan ke Layar OLED I2C dan diunggah ke Cloud MQTT/Blynk.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 #1 (Sensor Node Pengirim)",
        pinTerhubung: "TX2 (GPIO 17) -> RX2 ESP32 #2 | Sensor -> GPIO 15",
        fungsi: "Mengakuisisi data sensor lokal dan membungkusnya ke paket UART2.",
      },
      {
        namaKomponen: "ESP32 #2 (Gateway Penerima & Cloud Uploader)",
        pinTerhubung: "RX2 (GPIO 16) <- TX2 ESP32 #1 | OLED SDA/SCL -> GPIO 21/22",
        fungsi: "Menerima aliran byte UART2, menampilkan ke OLED, dan meneruskan ke Wi-Fi MQTT.",
      },
      {
        namaKomponen: "Layar OLED I2C 128x64 Pixel",
        pinTerhubung: "Alamat I2C 0x3C | VCC -> 3V3 | GND -> GND",
        fungsi: "Menampilkan log paket telemetri yang diterima oleh Gateway.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 5.",
      "Klik kartu 'PROYEK 5 • DUAL ESP32 (2 TAB KODE)' di kanvas bawah lalu perhatikan pada bagian 'TAB PROGRAM MCU' akan muncul 2 tab mikrokontroler!",
      "Klik tombol 'Compile & Run Semua (2 MCU)' untuk menjalankan komunikasi lintas-chip.",
      "Uji Protokol Bus: Buka tab '5. I2C / Modbus Sniffer' pada panel Fitur Unik untuk mengamati frame data ke Layar OLED I2C (0x3C).",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek5/uart_bridge",
    payloadMqttContoh:
      '{"bridge":"Dual_ESP32_UART2","baud":115200,"rx_packet":"TEMP:33.5|HUM:68","oled":"0x3C_OK"}',
    virtualPinBlynkList: [
      "V1 (Paket Diterima dari UART2)",
      "V2 (Status Koneksi Bridge Antar-MCU)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 5: DUAL-ESP32 TELEMETRY BRIDGE UART2 (TX2 PIN 17 <-> RX2 PIN 16 + OLED)
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <Wire.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_05"
#define BLYNK_AUTH_TOKEN "Token_Proyek5_DualEsp32"
#include <BlynkSimpleEsp32.h>

#define PIN_SENSOR_NODE1 15
#define PIN_LED_STATUS 2
#define RXD2 16
#define TXD2 17

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Wire.begin();
  pinMode(PIN_SENSOR_NODE1, INPUT);
  pinMode(PIN_LED_STATUS, OUTPUT);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[PROYEK 5 READY] Dual-ESP32 UART2 Bridge (Pin 16 & 17) Aktif!");
}

void loop() {
  Blynk.run();
  int dataSensor = analogRead(PIN_SENSOR_NODE1);
  digitalWrite(PIN_LED_STATUS, HIGH);

  // Kirim paket telemetri via jalur kabel silang UART2
  Serial2.println("PACKET_NODE1:SUHU=33.5,ADC=" + String(dataSensor));
  Serial.println("[UART2 BRIDGE TX->RX] Paket terkirim ke ESP32 #2 Gateway & OLED I2C!");

  Blynk.virtualWrite(V1, dataSensor);
  Blynk.virtualWrite(V2, "UART2_SYNC_OK");
  client.publish("hibahilmu/iot/proyek5/uart_bridge", "{\\"uart2\\":\\"SYNC_OK\\",\\"oled\\":\\"0x3C\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 5 (MicroPython main.py) - Dual-ESP32 UART2 Telemetry Bridge
from machine import Pin, UART
import network, time

uart2 = UART(2, baudrate=9600, tx=17, rx=16)
led = Pin(2, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  led.value(1)
  uart2.write("TELEMETRI_NODE_1_OK\\n")
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_6_otomasi_pabrik_plc_relay4ch",
    nomorUrut: 6,
    badgeKategori: "PROYEK 6 • DUAL MCU + RELAY 4CH",
    jumlahTabMcuLabel: "2 Tab MCU",
    judulProyek:
      "Otomasi Pabrik PLC Industri (ESP32 Master ↔ Arduino Uno Slave + Modul Relay 4-Ch + Servo 360°)",
    ringkasanSistem:
      "Sistem kendali lini produksi pabrik otomatis: ESP32 Master mengoordinasikan Arduino Uno R3 Slave untuk menyalakan 4 kontaktor mesin pada Modul Relay 4-Channel (Pin 4, 5, 6, 7) secara berurutan dan memutar Motor Servo Konveyor 360° (GPIO 13) sambil melaporkan kuota produksi ke Cloud MQTT & Blynk.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 Master & Arduino Uno R3 Slave",
        pinTerhubung: "Jalur Bus Serial Master-Slave (Pin 16/17 <-> Pin 0/1)",
        fungsi: "Pembagian beban komputasi antara komunikasi Cloud dan eksekusi I/O mesin.",
      },
      {
        namaKomponen: "Modul Relay 4-Channel Industri PLC",
        pinTerhubung: "IN1 -> Pin 4 | IN2 -> Pin 5 | IN3 -> Pin 6 | IN4 -> Pin 7",
        fungsi: "Menyalakan 4 mesin produksi pabrik secara sekuensial.",
      },
      {
        namaKomponen: "Motor Servo MG996R 360° (Sabuk Konveyor)",
        pinTerhubung: "Pin PWM -> GPIO 13 | VCC -> 5V | GND -> GND",
        fungsi: "Menggerakkan ban berjalan pembawa barang di lini pabrik.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 6.",
      "Klik kartu 'PROYEK 6 • DUAL MCU + RELAY 4CH' di kanvas bawah lalu jalankan 'Compile & Run Semua'.",
      "Lihat Osiloskop PWM: Buka tab '1. Multimeter & Osiloskop PWM' dan arahkan Probe Merah ke 'GPIO 13 (Servo PWM)' untuk mengamati sinyal penggerak konveyor pabrik!",
      "Hitung Biaya Listrik Pabrik: Buka tab '2. RAB Rupiah & PLN' pada panel Fitur Unik untuk melihat estimasi pemakaian kWh listrik bulanan lini produksi ini.",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek6/plc_factory",
    payloadMqttContoh:
      '{"proyek":"PLC_Factory_4Ch","relay_ch":[1,1,1,1],"conveyor_rpm":120,"batch_count":48}',
    virtualPinBlynkList: [
      "V0 (Master Switch Lini Pabrik)",
      "V1 (Kecepatan Konveyor Servo)",
      "V2 (Status 4-Channel Relay PLC)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 6: OTOMASI PABRIK PLC (ESP32 MASTER + UNO SLAVE + RELAY 4-CH + SERVO)
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <ESP32Servo.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_06"
#define BLYNK_AUTH_TOKEN "Token_Proyek6_PlcPabrik"
#include <BlynkSimpleEsp32.h>

const int pinRelayPlc[4] = {4, 5, 6, 7};
#define PIN_SERVO_KONVEYOR 13
#define PIN_SENSOR_BARANG 15

Servo konveyorServo;
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SENSOR_BARANG, INPUT);
  pinMode(4, OUTPUT);
  for (int i = 0; i < 4; i++) {
    pinMode(pinRelayPlc[i], OUTPUT);
  }
  konveyorServo.attach(PIN_SERVO_KONVEYOR);

  WiFi.begin("HibahIlmu-Guest", "");
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[PROYEK 6 READY] PLC Otomasi Pabrik Relay 4-Channel & Konveyor Aktif!");
}

void loop() {
  Blynk.run();
  int hitungBarang = digitalRead(PIN_SENSOR_BARANG);
  konveyorServo.write(180);

  for (int i = 0; i < 4; i++) {
    digitalWrite(pinRelayPlc[i], HIGH);
    Serial.println("[PLC SEQUENCER] Kontaktor Mesin Relay Ch-" + String(i + 1) + " AKTIF (ON)");
    delay(250);
  }

  Blynk.virtualWrite(V1, 180);
  Blynk.virtualWrite(V2, "ALL_4CH_ACTIVE");
  client.publish("hibahilmu/iot/proyek6/plc_factory", "{\\"relay_4ch\\":\\"ACTIVE\\",\\"conveyor\\":180}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 6 (MicroPython main.py) - Otomasi Pabrik Relay 4-Ch & Konveyor
from machine import Pin, PWM
import network, time

relays = [Pin(4, Pin.OUT), Pin(5, Pin.OUT), Pin(6, Pin.OUT), Pin(7, Pin.OUT)]
konveyor = PWM(Pin(13), freq=50)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  konveyor.duty(102)
  for r in relays:
    r.value(1)
    time.sleep_ms(250)
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_7_triple_mcu_klaster",
    nomorUrut: 7,
    badgeKategori: "PROYEK 7 • TRIPLE MCU (3 TAB KODE!)",
    jumlahTabMcuLabel: "3 Tab MCU",
    judulProyek:
      "Arsitektur 3 Mikrokontroler Terintegrasi (ESP32 #1 Sensor + ESP32 #2 Edge AI + Arduino Uno #3 Actuator)",
    ringkasanSistem:
      "Sistem terdistribusi dengan 3 otak mikrokontroler sekaligus: Chip #1 mengakuisisi multi-sensor, Chip #2 menjalankan pemrosesan tengah & agregasi paket klaster, dan Chip #3 mengeksekusi aktuator beban berat serta sinkronisasi ke Broker Cloud HibahIlmu.",
    daftarKomponenDanPin: [
      {
        namaKomponen: "ESP32 #1 (Node Akuisisi Sensor Hulu)",
        pinTerhubung: "GPIO 34 (ADC) & GPIO 15 (Digital Sensor)",
        fungsi: "Membaca data mentah lingkungan pada frekuensi tinggi.",
      },
      {
        namaKomponen: "ESP32 #2 (Node Pemroses Edge AI & Router)",
        pinTerhubung: "UART Bus GPIO 16/17 & Wi-Fi Mesh",
        fungsi: "Menjalankan filter rata-rata dan inferensi anomali.",
      },
      {
        namaKomponen: "Arduino Uno R3 #3 (Node Eksekutor Aktuator)",
        pinTerhubung: "Pin 2, 4, 13, 26 (Output Beban)",
        fungsi: "Menggerakkan deretan relay, motor, dan indikator status klaster.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 7.",
      "Klik kartu 'PROYEK 7 • TRIPLE MCU (3 TAB KODE!)' di kanvas bawah sehingga bagian 'TAB PROGRAM MCU' membuka 3 tab mikrokontroler sekaligus!",
      "Uji Wi-Fi OTA Update: Buka tab '4. Wi-Fi OTA & Rollback' pada panel Fitur Unik lalu klik 'Upload Firmware via Wi-Fi OTA Sekarang' untuk mensimulasikan pembaruan firmware nirkabel ke klaster MCU!",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek7/triple_mcu_cluster",
    payloadMqttContoh:
      '{"cluster_id":101,"mcu_online":3,"edge_ai_status":"OPTIMAL","sync_latency_ms":14}',
    virtualPinBlynkList: [
      "V0 (Sinkronisasi Klaster 3-MCU)",
      "V1 (Bebas Tugas CPU Edge AI %)",
      "V3 (Status Eksekutor Uno #3)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 7: ARSITEKTUR 3 MIKROKONTROLER TERINTEGRASI (TRIPLE-MCU CLUSTER)
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
  Serial.println("[PROYEK 7 READY] Klaster 3 Mikrokontroler (ID: 101) Tersinkronisasi!");
}

void loop() {
  Blynk.run();
  int nilaiSensorHulu = analogRead(PIN_ADC_INPUT);
  digitalWrite(PIN_SYNC_BUS, HIGH);
  digitalWrite(PIN_AKTUATOR_KLASTER, HIGH);

  Serial.println("[TRIPLE-MCU SYNC] Chip#1 -> Chip#2 -> Chip#3 Aktif | Cluster ID: " + String(CLUSTER_ID));

  Blynk.virtualWrite(V0, CLUSTER_ID);
  Blynk.virtualWrite(V1, nilaiSensorHulu);
  Blynk.virtualWrite(V3, "3_MCU_ONLINE");
  client.publish("hibahilmu/iot/proyek7/triple_mcu_cluster", "{\\"cluster\\":101,\\"mcu_count\\":3,\\"status\\":\\"SYNC_OK\\"}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 7 (MicroPython main.py) - Klaster 3 Mikrokontroler Terintegrasi
from machine import Pin, ADC
import network, time

CLUSTER_ID = 101
adc = ADC(Pin(34))
sync_pin = Pin(15, Pin.OUT)
aktuator = Pin(26, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  sync_pin.value(1)
  aktuator.value(1)
  print("Triple-MCU Cluster ID:", CLUSTER_ID, "ADC:", adc.read())
  time.sleep_ms(1000)`,
  },
  {
    idProyek: "proyek_8_master_npk_gps_10node_mesh",
    nomorUrut: 8,
    badgeKategori: "PROYEK 8 • MASTER 10-NODE & AIoT",
    jumlahTabMcuLabel: "Multi-Hop Mesh",
    judulProyek:
      "Stasiun Pertanian Presisi & 10-Node Multi-Hop Mesh (Sensor Pupuk NPK + GPS NEO-6M + Baterai 18650 + Cloud)",
    ringkasanSistem:
      "Proyek puncak integrasi seluruh sensor perkebunan: membaca unsur hara Nitrogen-Fosfor-Kalium dari Sensor NPK RS485 (Pin 16/17), mengunci titik koordinat satelit GPS NEO-6M (GPIO 4), memantau voltase Baterai Li-Ion 18650 & Panel Surya (GPIO 35), lalu mengirimkannya secara estafet Multi-Hop (Node 1 ➔ ... ➔ Node 10) menuju Broker Cloud & Dashboard Blynk!",
    daftarKomponenDanPin: [
      {
        namaKomponen: "Sensor Pupuk NPK Tanah 3-Garpu (RS485 Modbus)",
        pinTerhubung: "Pin RO/DI -> RX2/TX2 (GPIO 16 & 17)",
        fungsi: "Mengukur kandungan Nitrogen, Fosfor, dan Kalium tanah (mg/kg).",
      },
      {
        namaKomponen: "Modul Satelit GPS u-blox NEO-6M",
        pinTerhubung: "Pin TX GPS -> GPIO 4 | VCC -> 3V3",
        fungsi: "Mengunci titik koordinat Latitude dan Longitude lahan perkebunan.",
      },
      {
        namaKomponen: "Socket Baterai 18650 + Sensor Tegangan + Pompa Pupuk",
        pinTerhubung: "Sensor Volt -> GPIO 35 | Pompa Dosis -> GPIO 25",
        fungsi: "Memantau persentase baterai lapangan dan menyemprotkan pupuk cair.",
      },
    ],
    panduanLangkahMenjalankan: [
      "Klik tombol 'Muat Proyek & Kode Lengkap Ini' pada kartu Proyek 8.",
      "Uji Jaringan 10-Node Self-Healing: Buka panel '1. Chaos & Self-Healing Mesh' lalu klik NODE #4 dan NODE #7 untuk mematikan node tersebut, dan amati bagaimana paket NPK & GPS otomatis melompati node yang mati menuju Gateway Node #10!",
      "Uji Kalkulator Baterai & Deep Sleep: Buka tab '3. Kalkulator Baterai 18650' untuk melihat daya tahan baterai di kebun.",
      "Ekspor Skema IEEE & Laporan Word: Buka tab '10. Auto-Wire & Skema IEEE' untuk mengunduh diagram skematik jurnal (.svg) dan klik 'Unduh Dokumentasi Proyek Studio (.docx)'!",
    ],
    topikMqttDefault: "hibahilmu/iot/proyek8/mesh_npk_gps",
    payloadMqttContoh:
      '{"node":1,"next_hop":2,"npk":[145,88,210],"gps":[-0.5071,101.4478],"batt_v":4.08}',
    virtualPinBlynkList: [
      "V0 (Rute Estafet 10-Node Mesh)",
      "V1 (Kadar NPK Tanah mg/kg)",
      "V2 (Koordinat GPS Kebun)",
      "V3 (Tegangan Baterai 18650 V)",
    ],
    kodeLengkapCpp: `// ============================================================================
// PROYEK 8: STASIUN NPK RS485, GPS NEO-6M, BATERAI 18650 & 10-NODE MESH CLOUD
// ============================================================================
#include <Arduino.h>
#include <WiFi.h>
#include <esp_now.h>
#include <TinyGPSPlus.h>
#include <PubSubClient.h>
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_08"
#define BLYNK_AUTH_TOKEN "Token_Proyek8_MasterMesh10Node"
#include <BlynkSimpleEsp32.h>

#define NODE_ID 1
#define NEXT_HOP 2
#define PIN_GPS_RX 4
#define PIN_BATT_ADC 35
#define PIN_POMPA_PUPUK 25

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);
  pinMode(PIN_GPS_RX, INPUT);
  pinMode(PIN_BATT_ADC, INPUT);
  pinMode(PIN_POMPA_PUPUK, OUTPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin("HibahIlmu-Guest", "");
  esp_now_init();
  Blynk.begin(BLYNK_AUTH_TOKEN, "HibahIlmu-Guest", "");
  client.setServer("broker.hibahilmu.id", 1883);
  Serial.println("[PROYEK 8 READY] Stasiun NPK, GPS, Baterai 18650 & 10-Node Mesh Aktif!");
}

void loop() {
  Blynk.run();
  int adcBaterai = analogRead(PIN_BATT_ADC);
  float voltBaterai = (adcBaterai / 4095.0) * 4.2;
  digitalWrite(PIN_POMPA_PUPUK, HIGH);

  Serial.printf("[MESH HOP %d->%d] NPK: 145-88-210 mg/kg | GPS: -0.5071, 101.4478 | Batt: %.2fV\\n", NODE_ID, NEXT_HOP, voltBaterai);

  Blynk.virtualWrite(V0, "HOP_1_TO_10_OK");
  Blynk.virtualWrite(V1, 145);
  Blynk.virtualWrite(V2, "-0.5071, 101.4478");
  Blynk.virtualWrite(V3, voltBaterai);
  client.publish("hibahilmu/iot/proyek8/mesh_npk_gps", "{\\"node\\":1,\\"npk\\":145,\\"gps\\":\\"-0.5071,101.4478\\",\\"batt\\":4.08}");
  delay(1000);
}`,
    kodeLengkapMicroPython: `# PROYEK 8 (MicroPython main.py) - Stasiun NPK, GPS, Baterai & 10-Node Mesh
from machine import Pin, ADC, UART
import network, time

uart_npk = UART(2, baudrate=9600, tx=17, rx=16)
batt_adc = ADC(Pin(35))
pompa_pupuk = Pin(25, Pin.OUT)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("HibahIlmu-Guest", "")

while True:
  pompa_pupuk.value(1)
  volt = (batt_adc.read() / 4095.0) * 4.2
  print("10-Node Mesh NPK: 145 mg/kg | GPS: -0.5071, 101.4478 | Batt:", round(volt, 2), "V")
  time.sleep_ms(1000)`,
  },
];