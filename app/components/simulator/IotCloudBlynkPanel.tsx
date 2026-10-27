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
  ArrowLeftRight,
} from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";

// ============================================================================
// DATABASE SPESIFIKASI PINOUT & PENJELASAN KOMPONEN LENGKAP (TERMASUK DUAL MCU TX/RX)
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
    daftarPin: [
      "TX0 (GPIO1)",
      "RX0 (GPIO3)",
      "TX2 (GPIO17)",
      "RX2 (GPIO16)",
      "GPIO2 (LED)",
      "GPIO4",
      "GPIO15 (DHT)",
      "GPIO18 (PWM)",
      "GPIO21 (SDA)",
      "GPIO22 (SCL)",
      "3V3",
      "GND",
    ],
    fungsiSingkat:
      "Mikrokontroler Dual-Core 32-bit WiFi + BLE. Mendukung 3 port Hardware Serial (UART) untuk komunikasi TX/RX dengan Arduino atau STM32.",
    panduanKoneksi: [
      {
        namaPin: "TX2 (GPIO17) & RX2 (GPIO16)",
        fungsiDanTujuan:
          "Komunikasi Serial Antar-MCU → Hubungkan silang TX2 ESP32 ke RX (D0) Arduino, dan RX2 ESP32 ke TX (D1) Arduino.",
      },
      {
        namaPin: "3V3 / VIN & GND",
        fungsiDanTujuan:
          "Wajib satukan jalur GND (Common Ground) saat menghubungkan 2 mikrokontroler berbeda.",
      },
      {
        namaPin: "GPIO21 (SDA) & GPIO22 (SCL)",
        fungsiDanTujuan: "Bus I2C → Hubungkan ke layar OLED SSD1306 atau LCD 16x2.",
      },
    ],
  },
  arduino_uno: {
    jumlahPin: 28,
    daftarPin: [
      "D0 (RX)",
      "D1 (TX)",
      "D2",
      "D3 (PWM)",
      "D8",
      "D9 (Servo)",
      "D10 (SS)",
      "D13 (LED)",
      "A0 (ADC)",
      "A4 (SDA)",
      "A5 (SCL)",
      "5V",
      "GND",
    ],
    fungsiSingkat:
      "Board ATmega328P standar. Dapat menjadi Slave/Sensor Node yang mengirim data ke ESP32 melalui jalur UART D1(TX) ↔ RX2 ESP32.",
    panduanKoneksi: [
      {
        namaPin: "D1 (TX) → RX Mikrokontroler Lain",
        fungsiDanTujuan:
          "Mengirimkan paket data serial (Serial.println) menuju pin RX pada ESP32/STM32.",
      },
      {
        namaPin: "D0 (RX) ← TX Mikrokontroler Lain",
        fungsiDanTujuan:
          "Menerima perintah serial (Serial.readString) dari pin TX pada ESP32/STM32.",
      },
      {
        namaPin: "GND (Common Ground)",
        fungsiDanTujuan: "Wajib disambungkan ke pin GND mikrokontroler pasangan.",
      },
    ],
  },
  esp8266_nodemcu: {
    jumlahPin: 30,
    daftarPin: ["TX (GPIO1)", "RX (GPIO3)", "D1 (SCL)", "D2 (SDA)", "D4 (LED)", "D5", "D6", "D7", "A0", "3V3", "GND"],
    fungsiSingkat: "Modul WiFi SoC ESP8266 untuk node telemetri IoT ringan dan komunikasi serial.",
    panduanKoneksi: [
      { namaPin: "TX & RX", fungsiDanTujuan: "Hubungkan silang (Cross-over: TX → RX, RX → TX) ke mikrokontroler kedua." },
      { namaPin: "D1 (SCL) & D2 (SDA)", fungsiDanTujuan: "Jalur komunikasi I2C untuk sensor dan layar OLED." },
    ],
  },
  stm32_bluepill: {
    jumlahPin: 40,
    daftarPin: ["PA9 (TX1)", "PA10 (RX1)", "PB6 (SCL)", "PB7 (SDA)", "PA0 (ADC)", "PC13 (LED)", "3.3V", "GND"],
    fungsiSingkat: "Mikrokontroler ARM Cortex-M3 72MHz berkecepatan tinggi dengan 3 port USART.",
    panduanKoneksi: [
      { namaPin: "PA9 (TX1) & PA10 (RX1)", fungsiDanTujuan: "Port UART1 utama untuk komunikasi dengan ESP32 atau PC." },
      { namaPin: "PB6 & PB7", fungsiDanTujuan: "Port komunikasi I2C1." },
    ],
  },
  raspberry_pico: {
    jumlahPin: 40,
    daftarPin: ["GP0 (UART0 TX)", "GP1 (UART0 RX)", "GP4 (SDA)", "GP5 (SCL)", "GP15 (PWM)", "GP25 (LED)", "3V3", "GND"],
    fungsiSingkat: "Mikrokontroler Dual ARM Cortex-M0+ RP2040 dengan dukungan MicroPython & C/C++.",
    panduanKoneksi: [
      { namaPin: "GP0 (TX) & GP1 (RX)", fungsiDanTujuan: "Komunikasi serial UART0 kecepatan tinggi antar board." },
    ],
  },
  resistor: {
    jumlahPin: 2,
    daftarPin: ["Pin 1 (Kaki Kiri)", "Pin 2 (Kaki Kanan)"],
    fungsiSingkat: "Komponen pasif penghambat arus listrik dan pembagi tegangan sesuai 4 gelang warna.",
    panduanKoneksi: [
      { namaPin: "Pin 1 (Kaki Kiri)", fungsiDanTujuan: "Hubungkan ke sumber sinyal GPIO atau VCC." },
      { namaPin: "Pin 2 (Kaki Kanan)", fungsiDanTujuan: "Hubungkan secara seri ke Anoda LED atau beban." },
    ],
  },
  led_hijau: {
    jumlahPin: 2,
    daftarPin: ["Anoda (+)", "Katoda (- / GND)"],
    fungsiSingkat: "Dioda pemancar cahaya indikator status logika HIGH (Nyala).",
    panduanKoneksi: [
      { namaPin: "Anoda (+)", fungsiDanTujuan: "Hubungkan ke Pin GPIO melalui Resistor 220Ω - 330Ω." },
      { namaPin: "Katoda (-)", fungsiDanTujuan: "Hubungkan ke jalur GND (0V)." },
    ],
  },
  led_merah: {
    jumlahPin: 2,
    daftarPin: ["Anoda (+)", "Katoda (- / GND)"],
    fungsiSingkat: "LED indikator peringatan/alarm.",
    panduanKoneksi: [
      { namaPin: "Anoda (+)", fungsiDanTujuan: "Hubungkan ke output GPIO melalui resistor." },
      { namaPin: "Katoda (-)", fungsiDanTujuan: "Hubungkan ke GND." },
    ],
  },
  dht22: {
    jumlahPin: 4,
    daftarPin: ["1: VCC (3.3V-5V)", "2: DATA (SDA)", "3: NC", "4: GND"],
    fungsiSingkat: "Sensor digital presisi tinggi pengukur suhu (°C) dan kelembapan (%RH).",
    panduanKoneksi: [
      { namaPin: "Pin 1 (VCC) & Pin 4 (GND)", fungsiDanTujuan: "Catudaya 3.3V/5V dan Ground." },
      { namaPin: "Pin 2 (DATA)", fungsiDanTujuan: "Hubungkan ke GPIO15 (ESP32) atau D2 (Arduino)." },
    ],
  },
  ultrasonik: {
    jumlahPin: 4,
    daftarPin: ["VCC (5V)", "TRIG (Trigger)", "ECHO (Receive)", "GND"],
    fungsiSingkat: "Sensor pengukur jarak benda (2 cm – 400 cm) berbasis gelombang ultrasonik.",
    panduanKoneksi: [
      { namaPin: "TRIG & ECHO", fungsiDanTujuan: "Hubungkan TRIG ke GPIO12/D8 dan ECHO ke GPIO13/D9." },
    ],
  },
  servo: {
    jumlahPin: 3,
    daftarPin: ["PWM (Kuning)", "VCC 5V (Merah)", "GND (Cokelat)"],
    fungsiSingkat: "Motor aktuator presisi sudut 0°–180° dengan kendali pulsa PWM.",
    panduanKoneksi: [
      { namaPin: "PWM", fungsiDanTujuan: "Hubungkan ke pin PWM (GPIO18 ESP32 / D9 Arduino)." },
    ],
  },
};

export function ambilInfoPinKomponen(tipe: string): InfoPinoutKomponen {
  return (
    SPESIFIKASI_PIN_KOMPONEN[tipe] || {
      jumlahPin: 4,
      daftarPin: ["VCC (+)", "IN / DATA", "OUT / PWM", "GND (-)"],
      fungsiSingkat: "Komponen modul fungsional dalam simulasi rangkaian elektronika & IoT.",
      panduanKoneksi: [
        { namaPin: "VCC & GND", fungsiDanTujuan: "Hubungkan ke sumber tegangan positif dan Ground (0V)." },
        { namaPin: "IN / OUT", fungsiDanTujuan: "Hubungkan ke pin GPIO mikrokontroler atau instrumen ukur." },
      ],
    }
  );
}

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
  const [wifiSsid, setWifiSsid] = useState("HibahIlmu_IoT_Lab_5G");
  const [wifiPassword, setWifiPassword] = useState("wakafilmu2026");
  const [ipLocalWeb, setIpLocalWeb] = useState("192.168.1.108");
  const [portLocalWeb, setPortLocalWeb] = useState("80");
  const [statusWifiConnected, setStatusWifiConnected] = useState(true);

  const [blynkTemplateId, setBlynkTemplateId] = useState("TMPL6HibahIlmu2026");
  const [blynkTemplateName, setBlynkTemplateName] = useState("SmartLabESP32");
  const [blynkAuthToken, setBlynkAuthToken] = useState(
    "blynk_live_998877665544332211_hibahilmu_token"
  );
  const [tokenDisalin, setTokenDisalin] = useState(false);

  const [mqttBrokerUrl, setMqttBrokerUrl] = useState("broker.hivemq.com");
  const [mqttPort, setMqttPort] = useState("1883");
  const [mqttUser, setMqttUser] = useState("hibahilmu_iot");
  const [mqttTopicPub, setMqttTopicPub] = useState("hibahilmu/esp32/telemetry");
  const [mqttTopicSub, setMqttTopicSub] = useState("hibahilmu/esp32/control");
  const [payloadMqttInput, setPayloadMqttInput] = useState(
    '{"cmd":"UART_TX","target":"ARDUINO_UNO","led":1}'
  );
  const [logMqttMessages, setLogMqttMessages] = useState<
    { waktu: string; arah: "PUB" | "SUB" | "UART"; topik: string; payload: string }[]
  >([
    {
      waktu: "10:30:12",
      arah: "UART",
      topik: "Arduino(TX) ➔ ESP32(RX2)",
      payload: '{"sensor_node":"UNO_1","suhu":31.0,"jarak_cm":45}',
    },
    {
      waktu: "10:31:05",
      arah: "PUB",
      topik: "hibahilmu/esp32/telemetry",
      payload: '{"blynk_pin":"V0","suhu":31.0,"wifi":"CONNECTED"}',
    },
  ]);

  // Deteksi jumlah mikrokontroler di kanvas untuk fitur Dual-MCU UART Bridge
  const daftarMcuDiKanvas = nodesKanvas.filter((n) =>
    ["esp32", "arduino_uno", "esp8266_nodemcu", "stm32_bluepill", "raspberry_pico"].includes(
      n.tipe
    )
  );
  const pesanUartInputDefault = "DATA_SENSOR:SUHU=31.5;JARAK=42;STATUS=OK";
  const [pesanUartTxRx, setPesanUartTxRx] = useState(pesanUartInputDefault);

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
    const acak =
      Math.random().toString(36).substring(2, 14) +
      Math.random().toString(36).substring(2, 10);
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
    if (nodeLedHijau) {
      if (
        payloadMqttInput.toUpperCase().includes("OFF") ||
        payloadMqttInput.includes(":0")
      ) {
        onUpdateNodeDariCloud(nodeLedHijau.id, { nyala: false });
      } else if (
        payloadMqttInput.toUpperCase().includes("ON") ||
        payloadMqttInput.includes(":1")
      ) {
        onUpdateNodeDariCloud(nodeLedHijau.id, { nyala: true });
      }
    }
  };

  const handleSimulasiKirimUartAntarMcu = () => {
    const jam = new Date().toLocaleTimeString("id-ID");
    const mcu1 = daftarMcuDiKanvas[0]?.label || "MCU #1 (TX)";
    const mcu2 = daftarMcuDiKanvas[1]?.label || "MCU #2 (RX)";
    setLogMqttMessages([
      {
        waktu: jam,
        arah: "UART",
        topik: `${mcu1} [TX] ➔ ${mcu2} [RX]`,
        payload: pesanUartTxRx,
      },
      ...logMqttMessages,
    ]);
  };

  const handleGenerateKodeLengkapIot = () => {
    const kodeLengkap = `// ============================================================================
// KODE DUAL-MCU (UART TX/RX) + WIFI + BLYNK CLOUD TOKEN + MQTT BROKER ESP32
// ============================================================================
#define BLYNK_TEMPLATE_ID   "${blynkTemplateId}"
#define BLYNK_TEMPLATE_NAME "${blynkTemplateName}"
#define BLYNK_AUTH_TOKEN    "${blynkAuthToken}"

#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>

#define RXD2 16 // Terhubung ke Pin TX (D1) Mikrokontroler Kedua (Arduino/STM32)
#define TXD2 17 // Terhubung ke Pin RX (D0) Mikrokontroler Kedua (Arduino/STM32)

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPassword}";
const char* MQTT_BROKER   = "${mqttBrokerUrl}";

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2); // Inisialisasi UART Antar-MCU
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("WiFi Terhubung ke IP: http://${ipLocalWeb}:${portLocalWeb}");
  Serial.println("UART Bridge Aktif antara: ${daftarMcuDiKanvas.map((m) => m.label).join(" <-> ")}");
}

void loop() {
  if (Serial2.available()) {
    String dataDariArduino = Serial2.readStringUntil('\\n');
    Serial.println("[UART RX2 Diterima]: " + dataDariArduino);
  }
  Serial2.println("${pesanUartTxRx}");
  delay(2000);
}`;
    if (onGenerateKodeIotKeEditor) {
      onGenerateKodeIotKeEditor(kodeLengkap);
      alert(
        "✓ Kode Dual-MCU UART (TX/RX) + WiFi + Blynk Token + MQTT berhasil dimasukkan ke Code Editor!"
      );
    } else {
      navigator.clipboard?.writeText(kodeLengkap);
      alert("✓ Kode C++ berhasil disalin ke Clipboard!");
    }
  };

  return (
    <div className="bg-slate-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              Dual-MCU UART Bridge, MQTT Broker &amp; Blynk Cloud Studio
            </span>
            <h4 className="font-black text-base sm:text-lg text-white mt-0.5">
              Pusat Konektivitas IoT: Komunikasi 2 Mikrokontroler (TX/RX), WiFi, MQTT &amp; Blynk
              Token
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateKodeLengkapIot}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Code2 className="w-4 h-4" /> Buat Kode C++ (Dual-MCU TX/RX + Blynk + MQTT)
        </button>
      </div>

      {/* PANEL SIMULASI KOMUNIKASI SERIAL 2 MIKROKONTROLER (UART TX <-> RX BRIDGE) */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-black text-indigo-300 uppercase flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-amber-400" /> Komunikasi Serial Antar
            Mikrokontroler (UART Cross-Over: TX ➔ RX &amp; RX ⬅ TX)
          </div>
          <p className="text-slate-300">
            Mikrokontroler terdeteksi di kanvas:{" "}
            <b className="text-emerald-300">
              {daftarMcuDiKanvas.length > 0
                ? daftarMcuDiKanvas.map((m) => m.label).join(" ↔ ")
                : "Tambahkan ESP32 & Arduino Uno dari Gudang Komponen"}
            </b>
            {" "}({daftarMcuDiKanvas.length} MCU Aktif).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          <input
            type="text"
            value={pesanUartTxRx}
            onChange={(e) => setPesanUartTxRx(e.target.value)}
            placeholder="Ketik paket serial UART (TX -> RX)..."
            className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-amber-300 text-xs"
          />
          <button
            type="button"
            onClick={handleSimulasiKirimUartAntarMcu}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer shrink-0"
          >
            Kirim Paket TX ➔ RX
          </button>
        </div>
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
              {`{"mcu_count":${daftarMcuDiKanvas.length},"ip":"${ipLocalWeb}","suhu":${suhuAktual},"led":${
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
              BLYNK_AUTH_TOKEN:
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
            ✓ Token aktif! Widget Virtual Pin (V0–V4) terhubung langsung ke sensor &amp; aktuator di
            meja rangkaian.
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

      {/* BARIS 2: BLYNK IOT VIRTUAL PIN DASHBOARD & LIVE LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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

        {/* Log Lalu Lintas Paket MQTT & UART TX/RX Real-time (4 Kolom) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-black/70 border border-slate-800 space-y-1.5 font-mono text-[11px] max-h-36 overflow-y-auto">
          <div className="text-[10px] font-black text-amber-400 uppercase">
            📡 Live UART (TX/RX) &amp; MQTT Traffic Log:
          </div>
          {logMqttMessages.map((m, idx) => (
            <div key={idx} className="text-slate-300 leading-snug">
              <span className="text-slate-500">[{m.waktu}]</span>{" "}
              <span
                className={
                  m.arah === "UART"
                    ? "text-purple-400 font-bold"
                    : m.arah === "PUB"
                    ? "text-emerald-400 font-bold"
                    : "text-amber-300 font-bold"
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