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
  Power,
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
  Filter,
} from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";
import {
  WidgetBlynkItem,
  KATALOG_GUDANG_WIDGET_BLYNK,
  VisualWidgetBlynkMini,
} from "./BlynkWidgetSvg";

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
  const [ipLocalWeb] = useState("192.168.1.108");
  const [portLocalWeb] = useState("80");
  const [statusWifiConnected, setStatusWifiConnected] = useState(true);

  const [blynkTemplateId, setBlynkTemplateId] = useState("TMPL6HibahIlmu2026");
  const [blynkTemplateName, setBlynkTemplateName] = useState("SmartLabESP32");
  const [blynkAuthToken, setBlynkAuthToken] = useState(
    "blynk_live_998877665544332211_hibahilmu_token"
  );
  const [telegramBotToken, setTelegramBotToken] = useState(
    "7123456789:AAH_HibahIlmuBot_Token2026"
  );
  const [tokenDisalin, setTokenDisalin] = useState(false);

  const [mqttBrokerUrl, setMqttBrokerUrl] = useState("broker.hivemq.com");
  const [mqttTopicSub] = useState("hibahilmu/esp32/control");
  const [payloadMqttInput, setPayloadMqttInput] = useState(
    '{"cmd":"/unlock_pintu","target":"SOLENOID","state":1}'
  );
  const [logMqttMessages, setLogMqttMessages] = useState<
    { waktu: string; arah: "PUB" | "SUB" | "UART" | "TELE"; topik: string; payload: string }[]
  >([
    {
      waktu: "10:30:12",
      arah: "TELE",
      topik: "@HibahIlmu_IoT_Bot",
      payload: "/status ➔ Suhu: 34°C | Pintu Solenoid: UNLOCKED | Ultrasonik: 40cm",
    },
    {
      waktu: "10:31:05",
      arah: "UART",
      topik: "ESP32(TX2) ➔ Arduino(RX)",
      payload: '{"blynk_pin":"V1","solenoid":"UNLOCK"}',
    },
  ]);

  const [kategoriWidgetAktif, setKategoriWidgetAktif] = useState<string>("Semua");
  const [inputPerintahTelegram, setInputPerintahTelegram] = useState("/unlock_solenoid");

  const [daftarWidgetBlynk, setDaftarWidgetBlynk] = useState<WidgetBlynkItem[]>([
    {
      id: "bw-1",
      tipe: "gauge",
      kategoriWidget: "Monitor & Grafik",
      judul: "Gauge Suhu DHT22",
      virtualPin: "V0",
      satuan: "°C",
      warna: "amber",
      targetTipeKomponen: "dht22",
    },
    {
      id: "bw-2",
      tipe: "switch",
      kategoriWidget: "Kontrol & Input",
      judul: "Kunci Pintu Solenoid 12V",
      virtualPin: "V1",
      satuan: "LOCK",
      warna: "emerald",
      targetTipeKomponen: "solenoid_lock",
    },
    {
      id: "bw-3",
      tipe: "telegram_bot",
      kategoriWidget: "Telegram & Notifikasi",
      judul: "Telegram Bot Controller",
      virtualPin: "V4",
      satuan: "@Bot",
      warna: "sky",
      targetTipeKomponen: "solenoid_lock",
    },
    {
      id: "bw-4",
      tipe: "superchart",
      kategoriWidget: "Monitor & Grafik",
      judul: "Grafik Sonar Ultrasonik",
      virtualPin: "V3",
      satuan: "cm",
      warna: "emerald",
      targetTipeKomponen: "ultrasonik",
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
    "CMD:SOLENOID=UNLOCK;FAN=150;IR=DETECTED"
  );

  const cariNodeTerkaitWidget = (targetTipe: string) => {
    const persis = nodesKanvas.find((n) => n.tipe === targetTipe);
    if (persis) return persis;
    if (targetTipe === "solenoid_lock" || targetTipe === "led_hijau") {
      return (
        nodesKanvas.find(
          (n) =>
            n.tipe === "solenoid_lock" ||
            n.tipe === "led_hijau" ||
            n.tipe === "kipas_dc" ||
            n.tipe === "water_pump"
        ) || nodesKanvas[0]
      );
    }
    return nodesKanvas[0];
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

  const kirimPerintahTelegramBot = (cmd: string) => {
    const jam = new Date().toLocaleTimeString("id-ID");
    const targetAktuator = cariNodeTerkaitWidget("solenoid_lock");
    if (targetAktuator) {
      const buka = cmd.includes("unlock") || cmd.includes("on");
      onUpdateNodeDariCloud(targetAktuator.id, { nyala: buka });
    }
    setLogMqttMessages([
      {
        waktu: jam,
        arah: "TELE",
        topik: "@HibahIlmu_IoT_Bot",
        payload: `Perintah "${cmd}" dieksekusi ➔ Status Aktuator diperbarui!`,
      },
      ...logMqttMessages,
    ]);
  };

  const handleGenerateKodeLengkapIot = () => {
    const daftarPinCode = daftarWidgetBlynk
      .map(
        (w) =>
          `  // Widget ${w.judul} (${w.virtualPin} - ${w.tipe})\n  Blynk.virtualWrite(${w.virtualPin}, ${
            cariNodeTerkaitWidget(w.targetTipeKomponen)?.nilaiSensor ?? 1
          });`
      )
      .join("\n");

    const kodeLengkap = `// ============================================================================
// KODE OTOMATIS ESP32: BLYNK + TELEGRAM BOT + DUAL-MCU UART + MQTT BROKER
// ============================================================================
#define BLYNK_TEMPLATE_ID   "${blynkTemplateId}"
#define BLYNK_TEMPLATE_NAME "${blynkTemplateName}"
#define BLYNK_AUTH_TOKEN    "${blynkAuthToken}"
#define BOT_TELEGRAM_TOKEN  "${telegramBotToken}"

#include <WiFi.h>
#include <UniversalTelegramBot.h>
#include <PubSubClient.h>

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPassword}";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Terhubung ke Blynk Cloud & Telegram Bot @HibahIlmu_IoT_Bot");
}

void loop() {
${daftarPinCode}
  delay(2000);
}`;
    if (onGenerateKodeIotKeEditor) {
      onGenerateKodeIotKeEditor(kodeLengkap);
      alert(
        "✓ Kode C++ ESP32 (Blynk + Telegram Bot Token + Dual-MCU UART + MQTT) berhasil dimasukkan ke Code Editor!"
      );
    }
  };

  const kategoriUnikWidget = [
    "Semua",
    "Kontrol & Input",
    "Monitor & Grafik",
    "Telegram & Notifikasi",
    "Lanjutan & Peta",
  ];

  const katalogWidgetTersaring = KATALOG_GUDANG_WIDGET_BLYNK.filter(
    (w) => kategoriWidgetAktif === "Semua" || w.kategoriWidget === kategoriWidgetAktif
  );

  return (
    <div className="bg-slate-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              16-Widget Blynk Studio • Telegram Bot Bridge • Dual-MCU UART
            </span>
            <h4 className="font-black text-base sm:text-lg text-white mt-0.5">
              Pusat Konektivitas IoT, Telegram Bot &amp; Kanvas Drag-and-Drop Dashboard Blynk
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateKodeLengkapIot}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Code2 className="w-4 h-4" /> Buat Kode C++ (Blynk + Telegram Bot + MQTT)
        </button>
      </div>

      {/* ======================================================================
          GUDANG WIDGET BLYNK & TELEGRAM DENGAN GAMBAR MINI BERANIMASI
         ====================================================================== */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border-2 border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h5 className="font-black text-sm sm:text-base text-amber-300 flex items-center gap-2">
              <Move className="w-4 h-4 text-emerald-400" /> Gudang Widget Blynk ({katalogWidgetTersaring.length} Jenis): Tarik (Drag &amp; Drop) atau Klik untuk Menambahkan ke Dashboard IoT
            </h5>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {kategoriUnikWidget.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setKategoriWidgetAktif(kat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-black whitespace-nowrap cursor-pointer ${
                  kategoriWidgetAktif === kat
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID GUDANG WIDGET DENGAN GAMBAR MINIATUR BERANIMASI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-52 overflow-y-auto pr-1">
          {katalogWidgetTersaring.map((wItem, idx) => (
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
              className="p-2.5 rounded-2xl bg-slate-950 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1 transition group"
            >
              <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300">
                {wItem.kategoriWidget.split(" ")[0]}
              </span>

              {/* Gambar Miniatur Widget Beranimasi */}
              <div className="h-11 flex items-center justify-center group-hover:scale-105 transition-transform">
                <VisualWidgetBlynkMini tipe={wItem.tipe} />
              </div>

              <div className="font-bold text-[10px] text-white group-hover:text-amber-300 leading-tight line-clamp-1">
                {wItem.judul}
              </div>

              <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 font-black">
                <PlusCircle className="w-2.5 h-2.5" /> Tarik / Klik
              </span>
            </div>
          ))}
        </div>

        {/* KANVAS GRID DRAG-AND-DROP WIDGET BLYNK LIVE */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDropWidgetBaruAtauUrutkan(e)}
          className="p-5 rounded-3xl bg-[#060c17] border-2 border-dashed border-emerald-500/40 min-h-[230px] space-y-4"
        >
          <div className="flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-400">
            <span>
              📱 KANVAS DASHBOARD BLYNK &amp; TELEGRAM LIVE (Tarik widget di atas ke sini, atau klik
              tombol di dalam widget untuk menggerakkan Solenoid/Kipas/Sensor di kanvas Wokwi!)
            </span>
            <span className="text-emerald-400">● {daftarWidgetBlynk.length} Widget Terpasang</span>
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
                  className="p-4 rounded-2xl bg-slate-900/95 border-2 border-slate-800 hover:border-emerald-400 transition cursor-move flex flex-col justify-between space-y-3"
                >
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
                        onClick={() => setIdWidgetDiedit(sedangEdit ? null : w.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
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
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {sedangEdit && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                      <input
                        type="text"
                        value={w.judul}
                        onChange={(e) =>
                          setDaftarWidgetBlynk(
                            daftarWidgetBlynk.map((item) =>
                              item.id === w.id ? { ...item, judul: e.target.value } : item
                            )
                          )
                        }
                        className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                      />
                      <select
                        value={w.targetTipeKomponen}
                        onChange={(e) =>
                          setDaftarWidgetBlynk(
                            daftarWidgetBlynk.map((item) =>
                              item.id === w.id
                                ? { ...item, targetTipeKomponen: e.target.value }
                                : item
                            )
                          )
                        }
                        className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-emerald-300"
                      >
                        <option value="solenoid_lock">Solenoid Door Lock 12V</option>
                        <option value="kipas_dc">Kipas DC / Motor DC</option>
                        <option value="water_pump">Pompa Air Mini</option>
                        <option value="ir_obstacle">Sensor Infrared (IR)</option>
                        <option value="flame_sensor">Sensor Api (Flame)</option>
                        <option value="soil_moisture">Kelembapan Tanah (Soil)</option>
                        <option value="dht22">Sensor Suhu DHT22</option>
                        <option value="ultrasonik">Ultrasonik HC-SR04</option>
                        <option value="pir_sensor">Sensor Gerak PIR</option>
                        <option value="servo">Motor Servo SG90</option>
                      </select>
                    </div>
                  )}

                  {/* RENDER INTERAKTIF PER TIPE WIDGET */}
                  {w.tipe === "gauge" && (
                    <div className="text-center space-y-2 py-1">
                      <div className="text-2xl font-black text-amber-300">
                        {nilaiAktual} {w.satuan}
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
                    <div className="space-y-2 text-center py-1">
                      <div className="text-[10px] text-slate-400">
                        Aktuator: <b className="text-white">{nodeTerkait?.label}</b>
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
                        className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          statusNyalaAktual
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {statusNyalaAktual ? "AKTIF / UNLOCKED (1)" : "MATI / LOCKED (0)"}
                      </button>
                    </div>
                  )}

                  {(w.tipe === "telegram_bot" || w.tipe === "whatsapp_bot") && (
                    <div className="space-y-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-500/30 font-mono text-sky-200">
                        🤖 {w.tipe === "telegram_bot" ? "@HibahIlmu_IoT_Bot" : "WA Gateway Alert"}:
                        Siap menerima perintah!
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => kirimPerintahTelegramBot("/unlock_solenoid")}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-[10px] cursor-pointer"
                        >
                          /unlock
                        </button>
                        <button
                          type="button"
                          onClick={() => kirimPerintahTelegramBot("/lock_solenoid")}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-black text-[10px] cursor-pointer"
                        >
                          /lock
                        </button>
                      </div>
                    </div>
                  )}

                  {(w.tipe === "slider" ||
                    w.tipe === "joystick" ||
                    w.tipe === "step_control") && (
                    <div className="space-y-2 py-1 text-center">
                      <div className="text-xl font-black text-indigo-300">
                        {nilaiAktual} {w.satuan}
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
                    </div>
                  )}

                  {w.tipe === "superchart" && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-300">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" /> Live Telemetry
                        </span>
                        <span>{nilaiAktual}</span>
                      </div>
                      <div className="h-14 bg-slate-950 rounded-xl p-2 flex items-end gap-1 border border-slate-800">
                        {[0.6, 0.8, 0.5, 0.9, 0.7, 1.0].map((f, i) => (
                          <div
                            key={i}
                            style={{
                              height: `${Math.min(100, Math.max(20, Math.round(nilaiAktual * f)))}%`,
                            }}
                            className="flex-1 rounded-t bg-gradient-to-t from-emerald-600 to-sky-400"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {![
                    "gauge",
                    "switch",
                    "telegram_bot",
                    "whatsapp_bot",
                    "slider",
                    "joystick",
                    "step_control",
                    "superchart",
                  ].includes(w.tipe) && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                      <div className="text-xs font-black text-amber-300">
                        {nodeTerkait?.label}: {nilaiAktual}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Status: {statusNyalaAktual ? "ONLINE / TRIGGERED" : "STANDBY"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BARIS KONFIGURASI: WIFI | BLYNK & TELEGRAM TOKEN | MQTT BROKER */}
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
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white"
            />
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
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

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4" /> 2. Blynk Auth &amp; Telegram Bot Token
            </span>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">BLYNK_AUTH_TOKEN:</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={blynkAuthToken}
                onChange={(e) => setBlynkAuthToken(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-emerald-300 text-[10px]"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(blynkAuthToken);
                  setTokenDisalin(true);
                  setTimeout(() => setTokenDisalin(false), 2000);
                }}
                className="px-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black cursor-pointer"
              >
                {tokenDisalin ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">TELEGRAM_BOT_TOKEN (@BotFather):</label>
            <input
              type="text"
              value={telegramBotToken}
              onChange={(e) => setTelegramBotToken(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-950 border border-sky-500/40 font-mono text-sky-300 text-[10px]"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> 3. MQTT Broker &amp; Telegram Log
            </span>
            <span className="text-[10px] font-mono text-amber-300">{mqttBrokerUrl}</span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputPerintahTelegram}
              onChange={(e) => setInputPerintahTelegram(e.target.value)}
              placeholder="/unlock_solenoid"
              className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-white"
            />
            <button
              type="button"
              onClick={() => kirimPerintahTelegramBot(inputPerintahTelegram)}
              className="px-3 rounded-xl bg-sky-500 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Bot
            </button>
          </div>
          <div className="p-2 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] max-h-20 overflow-y-auto space-y-1">
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