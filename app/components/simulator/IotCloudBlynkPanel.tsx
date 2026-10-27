"use client";

import React, { useState } from "react";
import {
  Wifi,
  Radio,
  Globe,
  Key,
  Copy,
  CheckCircle2,
  Send,
  Sliders,
  Power,
  Gauge,
  RefreshCw,
  Code2,
  Cpu,
} from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";

// ============================================================================
// DATABASE SPESIFIKASI PINOUT & PENJELASAN KOMPONEN LENGKAP
// ============================================================================
export interface InfoPinoutKomponen {
  jumlahPin: number;
  daftarPin: string[];
  fungsiSingkat: string;
  panduanKoneksi: { namaPin: string; fungsiDanTujuan: string }[];
}

export const SPESIFIKASI_PIN_KOMPONEN: { [tipe: string]: InfoPinoutKomponen } = {
  esp32: {
    jumlahPin: 30,
    daftarPin: ["3V3", "VIN (5V)", "GND", "GPIO2 (LED)", "GPIO4", "GPIO5", "GPIO12", "GPIO13", "GPIO15 (DHT)", "GPIO18 (PWM)", "GPIO21 (SDA)", "GPIO22 (SCL)"],
    fungsiSingkat: "Mikrokontroler Dual-Core 32-bit dengan WiFi 802.11 b/g/n & Bluetooth BLE untuk pusat kendali IoT.",
    panduanKoneksi: [
      { namaPin: "3V3 / VIN (5V)", fungsiDanTujuan: "Sumber daya positif (+) → Hubungkan ke pin VCC sensor/modul." },
      { namaPin: "GND", fungsiDanTujuan: "Ground (0V) → Wajib terhubung ke semua pin GND komponen." },
      { namaPin: "GPIO 2 / 4 / 5", fungsiDanTujuan: "Digital I/O → Hubungkan ke Anoda LED (melalui resistor) atau Relay IN." },
      { namaPin: "GPIO 15", fungsiDanTujuan: "One-Wire Data → Hubungkan ke pin DATA Sensor Suhu DHT22." },
      { namaPin: "GPIO 18", fungsiDanTujuan: "Output PWM → Hubungkan ke kabel sinyal Motor Servo SG90." },
      { namaPin: "GPIO 21 (SDA) & 22 (SCL)", fungsiDanTujuan: "Komunikasi I2C → Hubungkan ke layar OLED SSD1306 atau LCD 16x2." },
    ],
  },
  arduino_uno: {
    jumlahPin: 28,
    daftarPin: ["5V", "3.3V", "GND", "D2", "D3 (PWM)", "D4", "D8", "D9 (Servo)", "D13 (LED)", "A0 (Analog)", "A4 (SDA)", "A5 (SCL)"],
    fungsiSingkat: "Papan mikrokontroler berbasis ATmega328P standar pembelajaran elektronika & robotika.",
    panduanKoneksi: [
      { namaPin: "5V & GND", fungsiDanTujuan: "Daya utama 5 Volt DC dan referensi Ground rangkaian." },
      { namaPin: "D2 - D13", fungsiDanTujuan: "Pin digital Input/Output untuk LED, Push Button, Sensor PIR, dan Ultrasonik." },
      { namaPin: "A0 - A5", fungsiDanTujuan: "Pin ADC 10-bit untuk membaca sensor analog (LDR, Potensiometer)." },
    ],
  },
  resistor: {
    jumlahPin: 2,
    daftarPin: ["Pin 1 (Kaki Kiri)", "Pin 2 (Kaki Kanan)"],
    fungsiSingkat: "Komponen pasif penghambat arus listrik dan pembagi tegangan sesuai kode gelang warna.",
    panduanKoneksi: [
      { namaPin: "Pin 1 (Kaki Kiri)", fungsiDanTujuan: "Hubungkan ke sumber sinyal GPIO (misal GPIO2 ESP32) atau VCC." },
      { namaPin: "Pin 2 (Kaki Kanan)", fungsiDanTujuan: "Hubungkan secara seri ke kaki Anoda (+) LED atau beban berikutnya." },
    ],
  },
  led_hijau: {
    jumlahPin: 2,
    daftarPin: ["Anoda (+)", "Katoda (- / GND)"],
    fungsiSingkat: "Dioda pemancar cahaya indikator status logika HIGH (Nyala) dan LOW (Mati).",
    panduanKoneksi: [
      { namaPin: "Anoda (+) Kaki Panjang", fungsiDanTujuan: "Hubungkan ke Pin GPIO mikrokontroler melalui Resistor 220Ω - 330Ω." },
      { namaPin: "Katoda (-) Kaki Pendek", fungsiDanTujuan: "Hubungkan langsung ke jalur GND (0V)." },
    ],
  },
  led_merah: {
    jumlahPin: 2,
    daftarPin: ["Anoda (+)", "Katoda (- / GND)"],
    fungsiSingkat: "LED indikator peringatan/alarm (menyala saat tegangan maju ~2.0V diberikan).",
    panduanKoneksi: [
      { namaPin: "Anoda (+)", fungsiDanTujuan: "Hubungkan ke output GPIO melalui resistor pembatas arus." },
      { namaPin: "Katoda (-)", fungsiDanTujuan: "Hubungkan ke pin GND (Ground)." },
    ],
  },
  led_kuning: {
    jumlahPin: 2,
    daftarPin: ["Anoda (+)", "Katoda (- / GND)"],
    fungsiSingkat: "LED indikator status siaga atau transisi sinyal.",
    panduanKoneksi: [
      { namaPin: "Anoda (+)", fungsiDanTujuan: "Hubungkan ke output GPIO melalui resistor 220Ω." },
      { namaPin: "Katoda (-)", fungsiDanTujuan: "Hubungkan ke pin GND." },
    ],
  },
  dht22: {
    jumlahPin: 4,
    daftarPin: ["1: VCC (3.3V-5V)", "2: DATA (SDA)", "3: NC", "4: GND"],
    fungsiSingkat: "Sensor digital presisi tinggi untuk mengukur suhu (°C) dan kelembapan udara relatif (%RH).",
    panduanKoneksi: [
      { namaPin: "Pin 1 (VCC)", fungsiDanTujuan: "Hubungkan ke pin 3V3 atau 5V pada ESP32/Arduino." },
      { namaPin: "Pin 2 (DATA)", fungsiDanTujuan: "Hubungkan ke pin digital (misal GPIO15 ESP32 atau D2 Arduino)." },
      { namaPin: "Pin 4 (GND)", fungsiDanTujuan: "Hubungkan ke pin GND mikrokontroler." },
    ],
  },
  ultrasonik: {
    jumlahPin: 4,
    daftarPin: ["VCC (5V)", "TRIG (Trigger)", "ECHO (Receive)", "GND"],
    fungsiSingkat: "Sensor pengukur jarak benda (2 cm – 400 cm) menggunakan pantulan gelombang suara ultrasonik 40 kHz.",
    panduanKoneksi: [
      { namaPin: "VCC & GND", fungsiDanTujuan: "Hubungkan VCC ke 5V dan GND ke Ground." },
      { namaPin: "TRIG", fungsiDanTujuan: "Pin pemicu gelombang → Hubungkan ke GPIO12 / D8." },
      { namaPin: "ECHO", fungsiDanTujuan: "Pin penerima pantulan → Hubungkan ke GPIO13 / D9." },
    ],
  },
  servo: {
    jumlahPin: 3,
    daftarPin: ["PWM (Kuning/Oranye)", "VCC 5V (Merah)", "GND (Cokelat/Hitam)"],
    fungsiSingkat: "Motor aktuator presisi yang dapat diatur sudut putarannya dari 0° hingga 180° menggunakan sinyal PWM.",
    panduanKoneksi: [
      { namaPin: "PWM (Oranye/Kuning)", fungsiDanTujuan: "Hubungkan ke pin PWM mikrokontroler (GPIO18 ESP32 / D9 Arduino)." },
      { namaPin: "VCC (Merah)", fungsiDanTujuan: "Hubungkan ke sumber tegangan +5V DC." },
      { namaPin: "GND (Cokelat)", fungsiDanTujuan: "Hubungkan ke GND (0V)." },
    ],
  },
  oled_display: {
    jumlahPin: 4,
    daftarPin: ["GND", "VCC (3.3V/5V)", "SCL (Clock)", "SDA (Data)"],
    fungsiSingkat: "Layar grafis OLED 128x64 piksel berantarmuka I2C hemat pin untuk menampilkan telemetri.",
    panduanKoneksi: [
      { namaPin: "GND & VCC", fungsiDanTujuan: "Hubungkan ke GND dan 3.3V/5V." },
      { namaPin: "SCL", fungsiDanTujuan: "Hubungkan ke GPIO22 (ESP32) atau A5 (Arduino)." },
      { namaPin: "SDA", fungsiDanTujuan: "Hubungkan ke GPIO21 (ESP32) atau A4 (Arduino)." },
    ],
  },
  lcd_16x2: {
    jumlahPin: 4,
    daftarPin: ["GND", "VCC (5V)", "SDA", "SCL"],
    fungsiSingkat: "Layar karakter 16 kolom x 2 baris dengan modul backpack I2C.",
    panduanKoneksi: [
      { namaPin: "GND & VCC", fungsiDanTujuan: "Hubungkan ke GND dan 5V." },
      { namaPin: "SDA & SCL", fungsiDanTujuan: "Hubungkan ke jalur komunikasi I2C (GPIO21/22)." },
    ],
  },
  pir_sensor: {
    jumlahPin: 3,
    daftarPin: ["VCC (5V)", "OUT (Digital)", "GND"],
    fungsiSingkat: "Sensor pendeteksi gerakan manusia/objek berbasis radiasi inframerah pasif.",
    panduanKoneksi: [
      { namaPin: "VCC & GND", fungsiDanTujuan: "Hubungkan ke 5V dan GND." },
      { namaPin: "OUT", fungsiDanTujuan: "Bernilai HIGH saat ada gerakan → Hubungkan ke pin Digital Input GPIO." },
    ],
  },
  ldr_sensor: {
    jumlahPin: 3,
    daftarPin: ["VCC", "GND", "AO (Analog Out)"],
    fungsiSingkat: "Sensor intensitas cahaya (fisiologis nilai resistansi turun saat cahaya terang).",
    panduanKoneksi: [
      { namaPin: "AO (Analog Out)", fungsiDanTujuan: "Hubungkan ke pin ADC (GPIO34 ESP32 atau A0 Arduino)." },
    ],
  },
  potensiometer: {
    jumlahPin: 3,
    daftarPin: ["Pin 1 (VCC)", "Wiper (Output Analog)", "Pin 3 (GND)"],
    fungsiSingkat: "Resistor variabel putar untuk mengatur tegangan input analog secara kontinu.",
    panduanKoneksi: [
      { namaPin: "Wiper (Pin Tengah)", fungsiDanTujuan: "Hubungkan ke pin Analog Input (ADC) mikrokontroler." },
    ],
  },
  push_button: {
    jumlahPin: 4,
    daftarPin: ["Terminal 1A", "Terminal 1B", "Terminal 2A", "Terminal 2B"],
    fungsiSingkat: "Sakelar tekan sesaat (momentary tactile switch) untuk input logika pengguna.",
    panduanKoneksi: [
      { namaPin: "Terminal 1A → GPIO", fungsiDanTujuan: "Hubungkan ke pin input digital (aktifkan INPUT_PULLUP)." },
      { namaPin: "Terminal 2A → GND", fungsiDanTujuan: "Hubungkan ke Ground sehingga saat ditekan bernilai LOW." },
    ],
  },
  buzzer: {
    jumlahPin: 2,
    daftarPin: ["Positif (+ / PWM)", "Negatif (- / GND)"],
    fungsiSingkat: "Komponen pembunyikan nada/alarm audio piezoelektrik.",
    panduanKoneksi: [
      { namaPin: "Positif (+)", fungsiDanTujuan: "Hubungkan ke pin digital/PWM untuk membunyikan frekuensi nada." },
      { namaPin: "Negatif (-)", fungsiDanTujuan: "Hubungkan ke GND." },
    ],
  },
  relay_5v: {
    jumlahPin: 6,
    daftarPin: ["VCC (5V)", "GND", "IN (Trigger)", "COM (Common)", "NO (Normally Open)", "NC"],
    fungsiSingkat: "Sakelar elektromagnetik untuk mengendalikan beban tegangan tinggi (pompa/lampu AC) dari mikrokontroler.",
    panduanKoneksi: [
      { namaPin: "IN (Trigger)", fungsiDanTujuan: "Hubungkan ke GPIO output untuk memicu kontak sakelar Relay." },
      { namaPin: "COM & NO", fungsiDanTujuan: "Jalur sakelar beban eksternal yang menyambung saat Relay aktif." },
    ],
  },
  vcc_dc: {
    jumlahPin: 2,
    daftarPin: ["Terminal Positif (+V)", "Terminal Negatif (0V)"],
    fungsiSingkat: "Sumber tegangan searah (DC Power Supply) untuk mencatu rangkaian elektronika EWB.",
    panduanKoneksi: [
      { namaPin: "Terminal +V", fungsiDanTujuan: "Hubungkan ke cabang input resistor/komponen aktif." },
      { namaPin: "Terminal 0V", fungsiDanTujuan: "Hubungkan ke titik referensi Ground (GND)." },
    ],
  },
  gnd: {
    jumlahPin: 1,
    daftarPin: ["Node GND (0V)"],
    fungsiSingkat: "Titik referensi potensial nol Volt (0V) wajib bagi analisis SPICE/EWB.",
    panduanKoneksi: [
      { namaPin: "Node GND", fungsiDanTujuan: "Sambungkan ke seluruh kaki negatif komponen rangkaian." },
    ],
  },
  gerbang_logika: {
    jumlahPin: 5,
    daftarPin: ["Input A (Pin 1)", "Input B (Pin 2)", "Output Y (Pin 3)", "VCC (Pin 14)", "GND (Pin 7)"],
    fungsiSingkat: "IC Gerbang Logika Digital TTL 74LSxx untuk operasi aljabar Boolean.",
    panduanKoneksi: [
      { namaPin: "Input A & B", fungsiDanTujuan: "Menerima level logika 0 (0V) atau 1 (+5V)." },
      { namaPin: "Output Y", fungsiDanTujuan: "Keluaran hasil operasi logika menuju LED indikator." },
    ],
  },
};

export function ambilInfoPinKomponen(tipe: string): InfoPinoutKomponen {
  return (
    SPESIFIKASI_PIN_KOMPONEN[tipe] || {
      jumlahPin: 2,
      daftarPin: ["Pin Input (IN)", "Pin Output (OUT)"],
      fungsiSingkat: "Komponen modul fungsional dalam blok simulasi rangkaian.",
      panduanKoneksi: [
        { namaPin: "Pin Input (IN)", fungsiDanTujuan: "Menerima sinyal masukan dari blok/komponen sebelumnya." },
        { namaPin: "Pin Output (OUT)", fungsiDanTujuan: "Mengirimkan sinyal keluaran menuju blok/instrumen ukur berikutnya." },
      ],
    }
  );
}

// ============================================================================
// KOMPONEN DASHBOARD IOT: BLYNK CLOUD TOKEN, MQTT BROKER, WIFI SSID & LOCAL WEB
// ============================================================================
interface IotCloudBlynkProps {
  nodesKanvas: NodeKomponenKanvas[];
  onUpdateNodeDariCloud: (id: string, perubahan: Partial<NodeKomponenKanvas>) => void;
  onGenerateKodeIotKeEditor?: (kodeBaru: string) => void;
}

export const IotCloudBlynkPanel: React.FC<IotCloudBlynkProps> = ({
  nodesKanvas,
  onUpdateNodeDariCloud,
  onGenerateKodeIotKeEditor,
}) => {
  // 1. State Konfigurasi WiFi & Local Web Server ESP32
  const [wifiSsid, setWifiSsid] = useState("HibahIlmu_IoT_Lab_5G");
  const [wifiPassword, setWifiPassword] = useState("wakafilmu2026");
  const [ipLocalWeb, setIpLocalWeb] = useState("192.168.1.108");
  const [portLocalWeb, setPortLocalWeb] = useState("80");
  const [statusWifiConnected, setStatusWifiConnected] = useState(true);

  // 2. State Konfigurasi Blynk Cloud & Auth Token
  const [blynkTemplateId, setBlynkTemplateId] = useState("TMPL6HibahIlmu2026");
  const [blynkTemplateName, setBlynkTemplateName] = useState("SmartLabESP32");
  const [blynkAuthToken, setBlynkAuthToken] = useState(
    "blynk_live_998877665544332211_hibahilmu_token"
  );
  const [tokenDisalin, setTokenDisalin] = useState(false);

  // 3. State Konfigurasi MQTT Broker & Live Pub/Sub Console
  const [mqttBrokerUrl, setMqttBrokerUrl] = useState("broker.hivemq.com");
  const [mqttPort, setMqttPort] = useState("1883");
  const [mqttUser, setMqttUser] = useState("hibahilmu_iot");
  const [mqttTopicPub, setMqttTopicPub] = useState("hibahilmu/esp32/telemetry");
  const [mqttTopicSub, setMqttTopicSub] = useState("hibahilmu/esp32/control");
  const [payloadMqttInput, setPayloadMqttInput] = useState(
    '{"cmd":"SET_LED","pin":2,"state":"ON"}'
  );
  const [logMqttMessages, setLogMqttMessages] = useState<
    { waktu: string; arah: "PUB" | "SUB"; topik: string; payload: string }[]
  >([
    {
      waktu: "10:30:12",
      arah: "PUB",
      topik: "hibahilmu/esp32/telemetry",
      payload: '{"suhu":31.0,"kelembapan":65,"jarak_cm":45,"status":"ONLINE"}',
    },
    {
      waktu: "10:31:05",
      arah: "SUB",
      topik: "hibahilmu/esp32/control",
      payload: '{"blynk_pin":"V2","led_hijau":1}',
    },
  ]);

  // Ambil nilai sensor & aktuator langsung dari komponen yang ada di Kanvas Wokwi
  const nodeDht = nodesKanvas.find((n) => n.tipe === "dht22");
  const nodeUltrasonik = nodesKanvas.find((n) => n.tipe === "ultrasonik");
  const nodeLedHijau = nodesKanvas.find(
    (n) => n.tipe === "led_hijau" || n.tipe === "led_merah" || n.tipe === "relay_5v"
  );
  const nodeServo = nodesKanvas.find((n) => n.tipe === "servo");

  const suhuAktual = nodeDht?.nilaiSensor ?? 31;
  const jarakAktual = nodeUltrasonik?.nilaiSensor ?? 45;
  const statusAktuatorNyala = nodeLedHijau?.nyala ?? true;
  const sudutServoAktual = nodeServo?.nilaiSensor ?? 90;

  const generateTokenBlynkBaru = () => {
    const acak = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 10);
    setBlynkAuthToken(`blynk_live_${acak}_id`);
  };

  const handleKirimPaketMqtt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payloadMqttInput.trim()) return;
    const jam = new Date().toLocaleTimeString("id-ID");
    setLogMqttMessages([
      {
        waktu: jam,
        arah: "SUB",
        topik: mqttTopicSub,
        payload: payloadMqttInput,
      },
      ...logMqttMessages,
    ]);
    // Jika payload mengandung ON/OFF, sinkronkan ke LED di kanvas
    if (nodeLedHijau) {
      if (payloadMqttInput.toUpperCase().includes("OFF") || payloadMqttInput.includes(":0")) {
        onUpdateNodeDariCloud(nodeLedHijau.id, { nyala: false });
      } else if (payloadMqttInput.toUpperCase().includes("ON") || payloadMqttInput.includes(":1")) {
        onUpdateNodeDariCloud(nodeLedHijau.id, { nyala: true });
      }
    }
  };

  const handleGenerateKodeLengkapIot = () => {
    const kodeLengkap = `// ============================================================================
// KODE OTOMATIS ESP32: WIFI + BLYNK CLOUD TOKEN + MQTT BROKER + LOCAL WEB SERVER
// ============================================================================
#define BLYNK_TEMPLATE_ID   "${blynkTemplateId}"
#define BLYNK_TEMPLATE_NAME "${blynkTemplateName}"
#define BLYNK_AUTH_TOKEN    "${blynkAuthToken}"

#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPassword}";
const char* MQTT_BROKER   = "${mqttBrokerUrl}";
const int   MQTT_PORT     = ${mqttPort};
const char* TOPIC_PUB     = "${mqttTopicPub}";
const char* TOPIC_SUB     = "${mqttTopicSub}";

WebServer server(${portLocalWeb});

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Menghubungkan ke WiFi: " + String(WIFI_SSID));
  Serial.println("Local Web Server Aktif di: http://${ipLocalWeb}:${portLocalWeb}");
  Serial.println("Blynk Token Terhubung: " + String(BLYNK_AUTH_TOKEN));
}

void loop() {
  // Kirim Virtual Pin V0 (Suhu: ${suhuAktual} C) & V1 (Jarak: ${jarakAktual} cm)
  Serial.println("[MQTT PUB -> " + String(TOPIC_PUB) + "]: Suhu=${suhuAktual}C, Servo=${sudutServoAktual}deg");
  delay(2000);
}`;
    if (onGenerateKodeIotKeEditor) {
      onGenerateKodeIotKeEditor(kodeLengkap);
      alert("✓ Kode C++ ESP32 (WiFi + Blynk Token + MQTT + Local Web Server) berhasil dimasukkan ke Code Editor!");
    } else {
      navigator.clipboard?.writeText(kodeLengkap);
      alert("✓ Kode C++ ESP32 berhasil disalin ke Clipboard!");
    }
  };

  return (
    <div className="bg-slate-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              IoT Connectivity, MQTT Broker &amp; Blynk Cloud Studio
            </span>
            <h4 className="font-black text-base sm:text-lg text-white mt-0.5">
              Pusat Konektivitas IoT: WiFi SSID, Local Web Server, MQTT Broker &amp; Blynk Virtual
              Pin Dashboard
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateKodeLengkapIot}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Code2 className="w-4 h-4" /> Buat Kode Sketch C++ (WiFi + Blynk + MQTT)
        </button>
      </div>

      {/* BARIS 1: WIFI & LOCAL WEB SERVER | BLYNK CLOUD AUTH TOKEN | MQTT BROKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
        {/* Panel 1: WiFi Station & Local Web Server ESP32 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-sky-400 uppercase flex items-center gap-1.5">
              <Wifi className="w-4 h-4" /> 1. WiFi SSID &amp; Local Web Server
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black ${
                statusWifiConnected
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {statusWifiConnected ? "● CONNECTED" : "● DISCONNECTED"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                WiFi SSID (Jaringan):
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                WiFi Password (WPA2):
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-amber-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                IP Local Web Server ESP32:
              </label>
              <input
                type="text"
                value={ipLocalWeb}
                onChange={(e) => setIpLocalWeb(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-emerald-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                Port HTTP:
              </label>
              <input
                type="text"
                value={portLocalWeb}
                onChange={(e) => setPortLocalWeb(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-sky-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> http://{ipLocalWeb}:{portLocalWeb}/status
              </span>
              <button
                type="button"
                onClick={() => setStatusWifiConnected(!statusWifiConnected)}
                className="text-[10px] underline text-slate-400 hover:text-white cursor-pointer"
              >
                Reconnect
              </button>
            </div>
            <div className="text-[10px] font-mono text-slate-300 bg-slate-900 p-2 rounded-lg">
              {`{"device":"ESP32","ip":"${ipLocalWeb}","suhu":${suhuAktual},"led":${
                statusAktuatorNyala ? '"ON"' : '"OFF"'
              }}`}
            </div>
          </div>
        </div>

        {/* Panel 2: Blynk Cloud Auth Token & Template Configuration */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4" /> 2. Blynk Cloud &amp; Auth Token
            </span>
            <button
              type="button"
              onClick={generateTokenBlynkBaru}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              title="Buat Token Baru"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                BLYNK_TEMPLATE_ID:
              </label>
              <input
                type="text"
                value={blynkTemplateId}
                onChange={(e) => setBlynkTemplateId(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                BLYNK_TEMPLATE_NAME:
              </label>
              <input
                type="text"
                value={blynkTemplateName}
                onChange={(e) => setBlynkTemplateName(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              BLYNK_AUTH_TOKEN (Digunakan untuk Autentikasi Perangkat):
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={blynkAuthToken}
                onChange={(e) => setBlynkAuthToken(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-emerald-300 text-[11px]"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(blynkAuthToken);
                  setTokenDisalin(true);
                  setTimeout(() => setTokenDisalin(false), 2000);
                }}
                className="px-3 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center gap-1 cursor-pointer shrink-0"
              >
                {tokenDisalin ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200">
            ✓ Token aktif! Seluruh perubahan widget Virtual Pin (V0 s/d V4) di bawah otomatis
            tersinkronisasi dengan komponen di meja kanvas.
          </div>
        </div>

        {/* Panel 3: MQTT Broker & Live Topic Publish/Subscribe */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> 3. MQTT Broker &amp; Pub/Sub Topic
            </span>
            <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
              Port {mqttPort}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                Host MQTT Broker:
              </label>
              <input
                type="text"
                value={mqttBrokerUrl}
                onChange={(e) => setMqttBrokerUrl(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                Username:
              </label>
              <input
                type="text"
                value={mqttUser}
                onChange={(e) => setMqttUser(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                Topic Publish:
              </label>
              <input
                type="text"
                value={mqttTopicPub}
                onChange={(e) => setMqttTopicPub(e.target.value)}
                className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-[10px] text-emerald-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">
                Topic Subscribe:
              </label>
              <input
                type="text"
                value={mqttTopicSub}
                onChange={(e) => setMqttTopicSub(e.target.value)}
                className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-[10px] text-amber-300"
              />
            </div>
          </div>

          <form onSubmit={handleKirimPaketMqtt} className="flex gap-1.5">
            <input
              type="text"
              value={payloadMqttInput}
              onChange={(e) => setPayloadMqttInput(e.target.value)}
              placeholder="JSON Payload..."
              className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-white"
            />
            <button
              type="submit"
              className="px-3 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Pub
            </button>
          </form>
        </div>
      </div>

      {/* BARIS 2: BLYNK IOT VIRTUAL PIN DASHBOARD (WIDGETS V0, V1, V2, V4) & MQTT TRAFFIC LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Widget Blynk Virtual Pins (8 Kolom) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* V0: Gauge Suhu DHT22 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>VIRTUAL PIN V0</span>
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{suhuAktual}°C</div>
            <div className="text-[11px] font-bold text-slate-300">Suhu DHT22</div>
            {nodeDht && (
              <input
                type="range"
                min={15}
                max={50}
                value={suhuAktual}
                onChange={(e) =>
                  onUpdateNodeDariCloud(nodeDht.id, {
                    nilaiSensor: Number(e.target.value),
                  })
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            )}
          </div>

          {/* V1: Gauge Jarak Ultrasonik */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>VIRTUAL PIN V1</span>
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-300">{jarakAktual} cm</div>
            <div className="text-[11px] font-bold text-slate-300">Jarak Ultrasonik</div>
            {nodeUltrasonik && (
              <input
                type="range"
                min={2}
                max={400}
                value={jarakAktual}
                onChange={(e) =>
                  onUpdateNodeDariCloud(nodeUltrasonik.id, {
                    nilaiSensor: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-400 cursor-pointer"
              />
            )}
          </div>

          {/* V2: Sakelar Tombol Blynk (Kendali LED / Relay di Kanvas) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>VIRTUAL PIN V2</span>
              <Power className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              {nodeLedHijau?.label || "Sakelar LED / Relay"}
            </div>
            <button
              type="button"
              onClick={() => {
                if (nodeLedHijau) {
                  onUpdateNodeDariCloud(nodeLedHijau.id, {
                    nyala: !statusAktuatorNyala,
                  });
                }
              }}
              className={`w-full py-2.5 rounded-xl font-black text-xs cursor-pointer transition ${
                statusAktuatorNyala
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {statusAktuatorNyala ? "ON (HIGH = 1)" : "OFF (LOW = 0)"}
            </button>
          </div>

          {/* V4: Slider Kendali Sudut Servo */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>VIRTUAL PIN V4</span>
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{sudutServoAktual}°</div>
            <div className="text-[11px] font-bold text-slate-300">Sudut Servo SG90</div>
            {nodeServo && (
              <input
                type="range"
                min={0}
                max={180}
                value={sudutServoAktual}
                onChange={(e) =>
                  onUpdateNodeDariCloud(nodeServo.id, {
                    nilaiSensor: Number(e.target.value),
                  })
                }
                className="w-full accent-indigo-400 cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Log Lalu Lintas Paket MQTT Real-time (4 Kolom) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-black/70 border border-slate-800 space-y-1.5 font-mono text-[11px] max-h-36 overflow-y-auto">
          <div className="text-[10px] font-black text-amber-400 uppercase">
            📡 Live MQTT Broker Traffic Log:
          </div>
          {logMqttMessages.map((m, idx) => (
            <div key={idx} className="text-slate-300 leading-snug">
              <span className="text-slate-500">[{m.waktu}]</span>{" "}
              <span
                className={
                  m.arah === "PUB" ? "text-emerald-400 font-bold" : "text-amber-300 font-bold"
                }
              >
                {m.arah}
              </span>{" "}
              <span className="text-sky-300">{m.topik}:</span> {m.payload}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};