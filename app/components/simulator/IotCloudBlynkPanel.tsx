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
  PlusCircle,
  Trash2,
  Move,
  BarChart3,
  Terminal,
  Bell,
} from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";

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
      "Mikrokontroler Dual-Core 32-bit WiFi + BLE (30 Pin: 15 Kiri & 15 Kanan).",
    panduanKoneksi: [
      {
        namaPin: "TX2 (GPIO17) & RX2 (GPIO16)",
        fungsiDanTujuan:
          "Komunikasi Serial Antar-MCU → Hubungkan silang TX2 ke D0(RX) Arduino & RX2 ke D1(TX) Arduino.",
      },
      {
        namaPin: "GPIO15 & GPIO18",
        fungsiDanTujuan: "GPIO15 ke DATA DHT22 | GPIO18 ke PWM Motor Servo SG90.",
      },
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
        {
          namaPin: "VCC & GND",
          fungsiDanTujuan: "Hubungkan ke sumber tegangan positif dan Ground (0V).",
        },
      ],
    }
  );
}

// ============================================================================
// TIPE DATA WIDGET BLYNK DRAG-AND-DROP BUILDER
// ============================================================================
export type TipeWidgetBlynk =
  | "gauge"
  | "switch"
  | "slider"
  | "superchart"
  | "led_status"
  | "lcd_terminal"
  | "alarm_notif";

export interface WidgetBlynkItem {
  id: string;
  tipe: TipeWidgetBlynk;
  judul: string;
  virtualPin: string; // V0, V1, V2, V3, V4, V5, dst.
  satuan: string;
  warna: "emerald" | "amber" | "sky" | "indigo" | "rose";
  targetTipeKomponen: string; // dht22, ultrasonik, led_hijau, servo, pir_sensor, mq2_gas
}

const KATALOG_GUDANG_WIDGET_BLYNK: Omit<WidgetBlynkItem, "id">[] = [
  {
    tipe: "gauge",
    judul: "Gauge Suhu DHT22",
    virtualPin: "V0",
    satuan: "°C",
    warna: "amber",
    targetTipeKomponen: "dht22",
  },
  {
    tipe: "gauge",
    judul: "Radar Jarak Ultrasonik",
    virtualPin: "V1",
    satuan: "cm",
    warna: "sky",
    targetTipeKomponen: "ultrasonik",
  },
  {
    tipe: "switch",
    judul: "Sakelar IoT LED / Relay",
    virtualPin: "V2",
    satuan: "BOOL",
    warna: "emerald",
    targetTipeKomponen: "led_hijau",
  },
  {
    tipe: "slider",
    judul: "Slider Sudut Servo SG90",
    virtualPin: "V3",
    satuan: "°",
    warna: "indigo",
    targetTipeKomponen: "servo",
  },
  {
    tipe: "superchart",
    judul: "SuperChart Live Telemetry",
    virtualPin: "V4",
    satuan: "Grafik",
    warna: "emerald",
    targetTipeKomponen: "dht22",
  },
  {
    tipe: "led_status",
    judul: "Indikator Sensor PIR",
    virtualPin: "V5",
    satuan: "MOTION",
    warna: "rose",
    targetTipeKomponen: "pir_sensor",
  },
  {
    tipe: "lcd_terminal",
    judul: "Blynk LCD 16x2 Serial",
    virtualPin: "V6",
    satuan: "TEXT",
    warna: "sky",
    targetTipeKomponen: "oled_display",
  },
  {
    tipe: "alarm_notif",
    judul: "Detektor Gas & Asap MQ-2",
    virtualPin: "V7",
    satuan: "ppm",
    warna: "rose",
    targetTipeKomponen: "mq2_gas",
  },
];

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

  // STATE KANVAS DRAG-AND-DROP DASHBOARD BLYNK
  const [daftarWidgetBlynk, setDaftarWidgetBlynk] = useState<WidgetBlynkItem[]>([
    {
      id: "bw-1",
      tipe: "gauge",
      judul: "Gauge Suhu DHT22",
      virtualPin: "V0",
      satuan: "°C",
      warna: "amber",
      targetTipeKomponen: "dht22",
    },
    {
      id: "bw-2",
      tipe: "gauge",
      judul: "Radar Jarak Ultrasonik",
      virtualPin: "V1",
      satuan: "cm",
      warna: "sky",
      targetTipeKomponen: "ultrasonik",
    },
    {
      id: "bw-3",
      tipe: "switch",
      judul: "Sakelar IoT LED / Relay",
      virtualPin: "V2",
      satuan: "BOOL",
      warna: "emerald",
      targetTipeKomponen: "led_hijau",
    },
    {
      id: "bw-4",
      tipe: "slider",
      judul: "Slider Sudut Servo SG90",
      virtualPin: "V3",
      satuan: "°",
      warna: "indigo",
      targetTipeKomponen: "servo",
    },
    {
      id: "bw-5",
      tipe: "superchart",
      judul: "SuperChart Live Telemetry",
      virtualPin: "V4",
      satuan: "Grafik",
      warna: "emerald",
      targetTipeKomponen: "dht22",
    },
  ]);
  const [indeksDragWidget, setIndeksDragWidget] = useState<number | null>(null);
  const [idWidgetDiedit, setIdWidgetDiedit] = useState<string | null>(null);

  const daftarMcuDiKanvas = nodesKanvas.filter((n) =>
    ["esp32", "arduino_uno", "esp8266_nodemcu", "stm32_bluepill", "raspberry_pico"].includes(
      n.tipe
    )
  );
  const [pesanUartTxRx, setPesanUartTxRx] = useState(
    "DATA_SENSOR:SUHU=31.5;JARAK=42;STATUS=OK"
  );

  const cariNodeTerkaitWidget = (targetTipe: string) => {
    if (targetTipe === "led_hijau") {
      return (
        nodesKanvas.find(
          (n) =>
            n.tipe === "led_hijau" ||
            n.tipe === "led_merah" ||
            n.tipe === "led_kuning" ||
            n.tipe === "buzzer"
        ) || nodesKanvas[0]
      );
    }
    return nodesKanvas.find((n) => n.tipe === targetTipe) || nodesKanvas[0];
  };

  const tambahWidgetKeBlynk = (item: Omit<WidgetBlynkItem, "id">) => {
    const baru: WidgetBlynkItem = {
      ...item,
      id: "bw-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      virtualPin: `V${daftarWidgetBlynk.length}`,
    };
    setDaftarWidgetBlynk([...daftarWidgetBlynk, baru]);
  };

  const handleDropWidgetBaruAtauUrutkan = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex?: number
  ) => {
    e.preventDefault();
    const rawBaru = e.dataTransfer.getData("application/blynk-new-widget");
    if (rawBaru) {
      try {
        const item = JSON.parse(rawBaru);
        tambahWidgetKeBlynk(item);
      } catch {}
      return;
    }

    if (
      indeksDragWidget !== null &&
      targetIndex !== undefined &&
      indeksDragWidget !== targetIndex
    ) {
      const salinan = [...daftarWidgetBlynk];
      const [dipindah] = salinan.splice(indeksDragWidget, 1);
      salinan.splice(targetIndex, 0, dipindah);
      setDaftarWidgetBlynk(salinan);
      setIndeksDragWidget(null);
    }
  };

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
    const nodeLed = cariNodeTerkaitWidget("led_hijau");
    if (nodeLed) {
      if (
        payloadMqttInput.toUpperCase().includes("OFF") ||
        payloadMqttInput.includes(":0")
      ) {
        onUpdateNodeDariCloud(nodeLed.id, { nyala: false });
      } else if (
        payloadMqttInput.toUpperCase().includes("ON") ||
        payloadMqttInput.includes(":1")
      ) {
        onUpdateNodeDariCloud(nodeLed.id, { nyala: true });
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
    const daftarPinCode = daftarWidgetBlynk
      .map(
        (w) =>
          `  // Widget ${w.judul} (${w.virtualPin})\n  Blynk.virtualWrite(${w.virtualPin}, analogRead(34));`
      )
      .join("\n");

    const kodeLengkap = `// ============================================================================
// KODE OTOMATIS ESP32: DUAL-MCU UART + WIFI + BLYNK DRAG & DROP + MQTT BROKER
// ============================================================================
#define BLYNK_TEMPLATE_ID   "${blynkTemplateId}"
#define BLYNK_TEMPLATE_NAME "${blynkTemplateName}"
#define BLYNK_AUTH_TOKEN    "${blynkAuthToken}"

#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>

#define RXD2 16 // Terhubung ke Pin D1 (TX) Arduino Uno
#define TXD2 17 // Terhubung ke Pin D0 (RX) Arduino Uno

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPassword}";
const char* MQTT_BROKER   = "${mqttBrokerUrl}";

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("WiFi Terhubung ke IP: http://${ipLocalWeb}:${portLocalWeb}");
}

void loop() {
${daftarPinCode}
  Serial2.println("${pesanUartTxRx}");
  delay(2000);
}`;
    if (onGenerateKodeIotKeEditor) {
      onGenerateKodeIotKeEditor(kodeLengkap);
      alert(
        "✓ Kode C++ ESP32 (Semua Widget Virtual Pin Blynk + Dual-MCU UART + MQTT) berhasil dimasukkan ke Code Editor!"
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
              Drag &amp; Drop Blynk IoT Studio • Dual-MCU UART • MQTT Broker
            </span>
            <h4 className="font-black text-base sm:text-lg text-white mt-0.5">
              Pusat Konektivitas IoT &amp; Kanvas Drag-and-Drop Dashboard Blynk (Virtual Pins V0–V10)
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateKodeLengkapIot}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Code2 className="w-4 h-4" /> Buat Kode C++ (Sesuai Widget Blynk Anda)
        </button>
      </div>

      {/* ======================================================================
          BAGIAN BARU: BLYNK IOT DRAG & DROP DASHBOARD STUDIO
         ====================================================================== */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border-2 border-emerald-500/30 space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Blynk.Console &amp; Mobile App Widget Builder
            </span>
            <h5 className="font-black text-sm sm:text-base text-white mt-1 flex items-center gap-2">
              <Move className="w-4 h-4 text-emerald-400" /> Gudang Widget Blynk: Tarik (Drag &amp;
              Drop) atau Klik untuk Menambahkan ke Dashboard IoT
            </h5>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Widget Aktif: <b className="text-emerald-400">{daftarWidgetBlynk.length} Widget</b>
          </span>
        </div>

        {/* PALET GUDANG WIDGET BLYNK (DRAGGABLE) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {KATALOG_GUDANG_WIDGET_BLYNK.map((wItem, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/blynk-new-widget",
                  JSON.stringify(wItem)
                );
              }}
              onClick={() => tambahWidgetKeBlynk(wItem)}
              className="p-3 rounded-2xl bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1.5 transition group"
              title="Tarik (Drag) ke Kanvas Blynk di bawah atau Klik untuk menambahkan"
            >
              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                + {wItem.tipe.toUpperCase()}
              </span>
              <div className="font-bold text-xs text-white group-hover:text-amber-300 leading-snug">
                {wItem.judul}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-black">
                <PlusCircle className="w-3 h-3" /> Drag / Klik
              </span>
            </div>
          ))}
        </div>

        {/* KANVAS GRID DRAG-AND-DROP WIDGET BLYNK */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDropWidgetBaruAtauUrutkan(e)}
          className="p-5 rounded-3xl bg-[#060c17] border-2 border-dashed border-emerald-500/40 min-h-[220px] space-y-4"
        >
          <div className="flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-400">
            <span>
              📱 KANVAS DASHBOARD BLYNK LIVE (Geser kartu widget untuk mengubah urutan, atau ubah
              nilai untuk menggerakkan sensor di kanvas Wokwi!)
            </span>
            <span className="text-emerald-400">● Sinkronisasi 2-Arah Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {daftarWidgetBlynk.map((w, wIdx) => {
              const nodeTerkait = cariNodeTerkaitWidget(w.targetTipeKomponen);
              const nilaiAktual = nodeTerkait?.nilaiSensor ?? 30;
              const statusNyalaAktual = nodeTerkait?.nyala ?? true;
              const sedangEdit = idWidgetDiedit === w.id;

              return (
                <div
                  key={w.id}
                  draggable
                  onDragStart={() => setIndeksDragWidget(wIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDropWidgetBaruAtauUrutkan(e, wIdx);
                  }}
                  className={`p-4 rounded-2xl bg-slate-900/95 border-2 transition cursor-move flex flex-col justify-between space-y-3 ${
                    w.warna === "emerald"
                      ? "border-emerald-500/40 hover:border-emerald-400"
                      : w.warna === "amber"
                      ? "border-amber-500/40 hover:border-amber-400"
                      : w.warna === "sky"
                      ? "border-sky-500/40 hover:border-sky-400"
                      : w.warna === "rose"
                      ? "border-rose-500/40 hover:border-rose-400"
                      : "border-indigo-500/40 hover:border-indigo-400"
                  }`}
                >
                  {/* Header Kartu Widget Blynk */}
                  <div className="flex justify-between items-center gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-black text-[10px]">
                        {w.virtualPin}
                      </span>
                      <span className="font-black text-xs text-white truncate max-w-[125px]">
                        {w.judul}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setIdWidgetDiedit(sedangEdit ? null : w.id)
                        }
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                        title="Konfigurasi Virtual Pin & Target Sensor"
                      >
                        ⚙️
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDaftarWidgetBlynk(
                            daftarWidgetBlynk.filter((x) => x.id !== w.id)
                          )
                        }
                        className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white cursor-pointer"
                        title="Hapus Widget"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Panel Edit Cepat Virtual Pin & Target Sensor */}
                  {sedangEdit && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                      <input
                        type="text"
                        value={w.judul}
                        onChange={(e) =>
                          setDaftarWidgetBlynk(
                            daftarWidgetBlynk.map((item) =>
                              item.id === w.id
                                ? { ...item, judul: e.target.value }
                                : item
                            )
                          )
                        }
                        className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <select
                          value={w.virtualPin}
                          onChange={(e) =>
                            setDaftarWidgetBlynk(
                              daftarWidgetBlynk.map((item) =>
                                item.id === w.id
                                  ? { ...item, virtualPin: e.target.value }
                                  : item
                              )
                            )
                          }
                          className="p-1.5 rounded bg-slate-900 border border-slate-700 font-mono text-amber-300"
                        >
                          {["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"].map(
                            (vp) => (
                              <option key={vp} value={vp}>
                                Pin {vp}
                              </option>
                            )
                          )}
                        </select>
                        <select
                          value={w.targetTipeKomponen}
                          onChange={(e) =>
                            setDaftarWidgetBlynk(
                              daftarWidgetBlynk.map((item) =>
                                item.id === w.id
                                  ? {
                                      ...item,
                                      targetTipeKomponen: e.target.value,
                                    }
                                  : item
                              )
                            )
                          }
                          className="p-1.5 rounded bg-slate-900 border border-slate-700 text-emerald-300"
                        >
                          <option value="dht22">Sensor Suhu DHT22</option>
                          <option value="ultrasonik">Ultrasonik HC-SR04</option>
                          <option value="pir_sensor">Sensor Gerak PIR</option>
                          <option value="ldr_sensor">Sensor Cahaya LDR</option>
                          <option value="mq2_gas">Sensor Gas MQ-2</option>
                          <option value="servo">Motor Servo SG90</option>
                          <option value="led_hijau">LED / Buzzer / Relay</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ISI VISUAL WIDGET BERDASARKAN TIPENYA */}
                  {w.tipe === "gauge" && (
                    <div className="text-center space-y-2 py-1">
                      <div className="relative w-28 h-16 mx-auto overflow-hidden">
                        <svg viewBox="0 0 100 55" className="w-full h-full">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            stroke="#1e293b"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            stroke={w.warna === "amber" ? "#facc15" : "#38bdf8"}
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray="126"
                            strokeDashoffset={
                              126 - Math.min(1, nilaiAktual / 150) * 126
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-x-0 bottom-0 text-lg font-black text-white">
                          {nilaiAktual} {w.satuan}
                        </div>
                      </div>
                      {nodeTerkait && (
                        <input
                          type="range"
                          min={2}
                          max={150}
                          value={nilaiAktual}
                          onChange={(e) =>
                            onUpdateNodeDariCloud(nodeTerkait.id, {
                              nilaiSensor: Number(e.target.value),
                            })
                          }
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      )}
                    </div>
                  )}

                  {w.tipe === "switch" && (
                    <div className="space-y-2 text-center py-2">
                      <div className="text-[11px] text-slate-400">
                        Target: <b className="text-white">{nodeTerkait?.label}</b>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (nodeTerkait) {
                            onUpdateNodeDariCloud(nodeTerkait.id, {
                              nyala: !statusNyalaAktual,
                            });
                          }
                        }}
                        className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          statusNyalaAktual
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {statusNyalaAktual ? "STATE: HIGH (ON)" : "STATE: LOW (OFF)"}
                      </button>
                    </div>
                  )}

                  {w.tipe === "slider" && (
                    <div className="space-y-2 py-1 text-center">
                      <div className="text-2xl font-black text-indigo-300">
                        {nilaiAktual}
                        {w.satuan}
                      </div>
                      {nodeTerkait && (
                        <input
                          type="range"
                          min={0}
                          max={180}
                          value={nilaiAktual}
                          onChange={(e) =>
                            onUpdateNodeDariCloud(nodeTerkait.id, {
                              nilaiSensor: Number(e.target.value),
                            })
                          }
                          className="w-full accent-indigo-400 cursor-pointer"
                        />
                      )}
                      <div className="text-[10px] font-mono text-slate-400">
                        Geser untuk memutar {nodeTerkait?.label}
                      </div>
                    </div>
                  )}

                  {w.tipe === "superchart" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" /> Live Stream
                        </span>
                        <span>Val: {nilaiAktual}</span>
                      </div>
                      <div className="h-16 bg-slate-950 rounded-xl p-2 flex items-end gap-1 border border-slate-800">
                        {[0.6, 0.75, 0.5, 0.85, 0.7, 0.9, 1.0].map((faktor, i) => {
                          const tinggi = Math.min(
                            100,
                            Math.max(15, Math.round((nilaiAktual / 100) * faktor * 100))
                          );
                          return (
                            <div
                              key={i}
                              style={{ height: `${tinggi}%` }}
                              className="flex-1 rounded-t bg-gradient-to-t from-emerald-600 to-sky-400 transition-all"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(w.tipe === "led_status" || w.tipe === "alarm_notif") && (
                    <div className="flex flex-col items-center justify-center py-2 gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          statusNyalaAktual
                            ? "bg-rose-500 shadow-[0_0_20px_#f43f5e] animate-pulse"
                            : "bg-slate-800"
                        }`}
                      >
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-black text-amber-300">
                        {statusNyalaAktual
                          ? `⚡ TERDETEKSI (${nilaiAktual})`
                          : "STANDBY AMAN"}
                      </span>
                    </div>
                  )}

                  {w.tipe === "lcd_terminal" && (
                    <div className="p-2.5 rounded-xl bg-[#84cc16] text-slate-950 font-mono text-[11px] font-black space-y-0.5 shadow-inner">
                      <div className="flex items-center gap-1">
                        <Terminal className="w-3 h-3" /> BLYNK LCD 16x2
                      </div>
                      <div>
                        {nodeTerkait?.label.slice(0, 10)}: {nilaiAktual}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PANEL SIMULASI KOMUNIKASI SERIAL 2 MIKROKONTROLER (UART TX <-> RX BRIDGE) */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-black text-indigo-300 uppercase flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-amber-400" /> Komunikasi Serial Antar
            Mikrokontroler (UART Cross-Over: TX ➔ RX &amp; RX ⬅ TX)
          </div>
          <p className="text-slate-300">
            Mikrokontroler aktif:{" "}
            <b className="text-emerald-300">
              {daftarMcuDiKanvas.map((m) => m.label).join(" ↔ ")}
            </b>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          <input
            type="text"
            value={pesanUartTxRx}
            onChange={(e) => setPesanUartTxRx(e.target.value)}
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

      {/* BARIS KONFIGURASI: WIFI & LOCAL WEB SERVER | BLYNK TOKEN | MQTT BROKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-sky-400 uppercase flex items-center gap-1.5">
              <Wifi className="w-4 h-4" /> 1. WiFi SSID &amp; Local Web Server
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
              ● {statusWifiConnected ? "CONNECTED" : "OFFLINE"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="WiFi SSID"
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
            />
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Password"
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-amber-300"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/30 font-mono text-[11px] text-sky-300 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> http://{ipLocalWeb}:{portLocalWeb}/status
            </span>
            <button
              type="button"
              onClick={() => setStatusWifiConnected(!statusWifiConnected)}
              className="text-[10px] underline text-slate-400 cursor-pointer"
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4" /> 2. Blynk Cloud &amp; Auth Token
            </span>
            <button
              type="button"
              onClick={generateTokenBlynkBaru}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Token Baru
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={blynkTemplateId}
              onChange={(e) => setBlynkTemplateId(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
            />
            <input
              type="text"
              value={blynkTemplateName}
              onChange={(e) => setBlynkTemplateName(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
            />
          </div>

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
              className="px-3 rounded-xl bg-emerald-500 text-slate-950 font-black cursor-pointer"
            >
              {tokenDisalin ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> 3. MQTT Broker &amp; Pub/Sub Log
            </span>
            <span className="text-[10px] font-mono text-amber-300">{mqttBrokerUrl}</span>
          </div>

          <form onSubmit={handleKirimPaketMqtt} className="flex gap-1.5">
            <input
              type="text"
              value={payloadMqttInput}
              onChange={(e) => setPayloadMqttInput(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-white"
            />
            <button
              type="submit"
              className="px-3 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Pub
            </button>
          </form>

          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] max-h-20 overflow-y-auto space-y-1">
            {logMqttMessages.map((m, idx) => (
              <div key={idx} className="truncate">
                <span className="text-emerald-400">[{m.arah}]</span> {m.topik}: {m.payload}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};