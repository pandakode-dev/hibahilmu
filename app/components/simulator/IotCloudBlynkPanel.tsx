"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Wifi,
  Radio,
  Globe,
  Key,
  Copy,
  CheckCircle2,
  Send,
  Power,
  Code2,
  Cpu,
  PlusCircle,
  Trash2,
  Move,
  BarChart3,
  Filter,
  LayoutGrid,
} from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";
import {
  WidgetBlynkItem,
  KATALOG_GUDANG_WIDGET_BLYNK,
  VisualWidgetBlynkMini,
} from "./BlynkWidgetSvg";

export interface ExtendedWidgetBlynkItem extends WidgetBlynkItem {
  lebarKolom?: 1 | 2;
  x?: number; // Koordinat X bebas di dalam kanvas Blynk (px)
  y?: number; // Koordinat Y bebas di dalam kanvas Blynk (px)
  w?: number; // Lebar bebas widget (px)
  h?: number; // Tinggi bebas widget (px)
}

function beriKoordinatDefaultWidget(
  list: WidgetBlynkItem[]
): ExtendedWidgetBlynkItem[] {
  return list.map((w, idx) => {
    const ext = w as ExtendedWidgetBlynkItem;
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    return {
      ...w,
      x: ext.x ?? 20 + col * 245,
      y: ext.y ?? 20 + row * 175,
      w: ext.w ?? 230,
      h: ext.h ?? 155,
    };
  });
}

interface IotCloudBlynkProps {
  nodesKanvas: NodeKomponenKanvas[];
  presetWidgets?: WidgetBlynkItem[];
  customWidgetsState?: ExtendedWidgetBlynkItem[];
  onChangeWidgetsState?: (widgetsBaru: ExtendedWidgetBlynkItem[]) => void;
  onUpdateNodeDariCloud: (id: string, perubahan: Partial<NodeKomponenKanvas>) => void;
  onGenerateKodeIotKeEditor?: (kodeBaru: string) => void;
}

export const IotCloudBlynkPanel: React.FC<IotCloudBlynkProps> = ({
  nodesKanvas,
  presetWidgets,
  customWidgetsState,
  onChangeWidgetsState,
  onUpdateNodeDariCloud,
  onGenerateKodeIotKeEditor,
}) => {
  const blynkCanvasRef = useRef<HTMLDivElement | null>(null);

  const [wifiSsid, setWifiSsid] = useState("HibahIlmu_IoT_Lab_5G");
  const [wifiPassword, setWifiPassword] = useState("wakafilmu2026");
  const [ipLocalWeb] = useState("192.168.1.108");
  const [portLocalWeb] = useState("80");
  const [statusWifiConnected, setStatusWifiConnected] = useState(true);

  const [blynkTemplateId] = useState("TMPL6HibahIlmu2026");
  const [blynkTemplateName] = useState("SmartLabESP32");
  const [blynkAuthToken, setBlynkAuthToken] = useState(
    "blynk_live_998877665544332211_hibahilmu_token"
  );
  const [telegramBotToken, setTelegramBotToken] = useState(
    "7123456789:AAH_HibahIlmuBot_Token2026"
  );
  const [tokenDisalin, setTokenDisalin] = useState(false);

  const [mqttBrokerUrl] = useState("broker.hivemq.com");
  const [inputPerintahTelegram, setInputPerintahTelegram] = useState("/unlock_solenoid");
  const [logMqttMessages, setLogMqttMessages] = useState<
    { waktu: string; arah: "PUB" | "SUB" | "UART" | "TELE"; topik: string; payload: string }[]
  >([
    {
      waktu: "10:30:12",
      arah: "TELE",
      topik: "@HibahIlmu_IoT_Bot",
      payload: "/status ➔ Suhu: 34°C | Pintu Solenoid: UNLOCKED | Ultrasonik: 28cm",
    },
    {
      waktu: "10:31:05",
      arah: "UART",
      topik: "MCU #1 (TX) ➔ MCU #2 (RX)",
      payload: '{"blynk_pin":"V1","solenoid":"UNLOCK"}',
    },
  ]);

  const [ukuranKanvasBlynk, setUkuranKanvasBlynk] = useState<
    "kecil" | "sedang" | "besar" | "penuh"
  >("sedang");

  const [kategoriWidgetAktif, setKategoriWidgetAktif] = useState<string>("Semua");
  const [daftarWidgetInternal, setDaftarWidgetInternal] = useState<
    ExtendedWidgetBlynkItem[]
  >(() =>
    beriKoordinatDefaultWidget(
      presetWidgets && presetWidgets.length > 0
        ? presetWidgets
        : KATALOG_GUDANG_WIDGET_BLYNK.slice(0, 4).map((w, i) => ({
            ...w,
            id: `bw-init-${i}`,
          }))
    )
  );

  const daftarWidgetBlynk = useMemo(
    () => beriKoordinatDefaultWidget(customWidgetsState || daftarWidgetInternal),
    [customWidgetsState, daftarWidgetInternal]
  );

  const updateDaftarWidget = (baru: ExtendedWidgetBlynkItem[]) => {
    setDaftarWidgetInternal(baru);
    if (onChangeWidgetsState) {
      onChangeWidgetsState(baru);
    }
  };

  useEffect(() => {
    if (presetWidgets && presetWidgets.length > 0 && !customWidgetsState) {
      setDaftarWidgetInternal(beriKoordinatDefaultWidget(presetWidgets));
    }
  }, [presetWidgets]);

  // State Drag Bebas 2D (X, Y) & Resize Bebas (W, H) di dalam Kanvas Blynk
  const [draggingWidgetState, setDraggingWidgetState] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [resizingWidgetState, setResizingWidgetState] = useState<{
    id: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const [idWidgetDiedit, setIdWidgetDiedit] = useState<string | null>(null);

  const cariNodeTerkaitWidget = (targetTipe: string) => {
    const persis = nodesKanvas.find((n) => n.tipe === targetTipe);
    if (persis) return persis;
    if (targetTipe === "solenoid_lock" || targetTipe === "led_hijau") {
      return (
        nodesKanvas.find(
          (n) =>
            n.tipe === "solenoid_lock" ||
            n.tipe === "water_pump" ||
            n.tipe.startsWith("relay_") ||
            n.tipe.startsWith("led_")
        ) || nodesKanvas[0]
      );
    }
    return nodesKanvas[0];
  };

  const tambahWidgetKeBlynk = (
    item: Omit<WidgetBlynkItem, "id">,
    xDrop?: number,
    yDrop?: number
  ) => {
    const idx = daftarWidgetBlynk.length;
    const defaultX = 20 + (idx % 3) * 245;
    const defaultY = 20 + Math.floor(idx / 3) * 175;
    const baru: ExtendedWidgetBlynkItem = {
      ...item,
      id: "bw-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      virtualPin: `V${idx}`,
      x: xDrop !== undefined ? Math.max(10, xDrop) : defaultX,
      y: yDrop !== undefined ? Math.max(10, yDrop) : defaultY,
      w: item.tipe === "superchart" ? 280 : 230,
      h: 155,
    };
    updateDaftarWidget([...daftarWidgetBlynk, baru]);
  };

  const rapikanPosisiGridOtomatis = () => {
    const rapi = daftarWidgetBlynk.map((w, idx) => ({
      ...w,
      x: 20 + (idx % 3) * 245,
      y: 20 + Math.floor(idx / 3) * 175,
      w: 230,
      h: 155,
    }));
    updateDaftarWidget(rapi);
  };

  const handleMouseMoveBlynkCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!blynkCanvasRef.current) return;
    const rect = blynkCanvasRef.current.getBoundingClientRect();

    if (draggingWidgetState) {
      const xBaru = Math.max(
        8,
        Math.min(
          rect.width - 180,
          e.clientX - rect.left - draggingWidgetState.offsetX + blynkCanvasRef.current.scrollLeft
        )
      );
      const yBaru = Math.max(
        8,
        e.clientY - rect.top - draggingWidgetState.offsetY + blynkCanvasRef.current.scrollTop
      );
      updateDaftarWidget(
        daftarWidgetBlynk.map((w) =>
          w.id === draggingWidgetState.id
            ? { ...w, x: Math.round(xBaru), y: Math.round(yBaru) }
            : w
        )
      );
      return;
    }

    if (resizingWidgetState) {
      const deltaX = e.clientX - resizingWidgetState.startX;
      const deltaY = e.clientY - resizingWidgetState.startY;
      const wBaru = Math.max(185, Math.min(520, resizingWidgetState.startW + deltaX));
      const hBaru = Math.max(135, Math.min(360, resizingWidgetState.startH + deltaY));
      updateDaftarWidget(
        daftarWidgetBlynk.map((w) =>
          w.id === resizingWidgetState.id
            ? { ...w, w: Math.round(wBaru), h: Math.round(hBaru) }
            : w
        )
      );
    }
  };

  const handleDropDariGudangKeKanvasBlynk = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const rawBaru = e.dataTransfer.getData("application/blynk-new-widget");
    if (!rawBaru || !blynkCanvasRef.current) return;
    try {
      const item = JSON.parse(rawBaru);
      const rect = blynkCanvasRef.current.getBoundingClientRect();
      const xDrop =
        e.clientX - rect.left - 110 + blynkCanvasRef.current.scrollLeft;
      const yDrop =
        e.clientY - rect.top - 60 + blynkCanvasRef.current.scrollTop;
      tambahWidgetKeBlynk(item, xDrop, yDrop);
    } catch {}
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
#include <DHT.h>
#include <ESP32Servo.h>
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

  const kelasTinggiKanvasBlynk =
    ukuranKanvasBlynk === "kecil"
      ? "h-[320px]"
      : ukuranKanvasBlynk === "sedang"
      ? "h-[430px]"
      : ukuranKanvasBlynk === "besar"
      ? "h-[560px]"
      : "h-[720px]";

  return (
    <div className="bg-slate-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              Free-Roam 2D Drag &amp; Resize Blynk Canvas • Telegram Bot Bridge
            </span>
            <h4 className="font-black text-base sm:text-lg text-white mt-0.5">
              Pusat Konektivitas IoT &amp; Kanvas Bebas 2D Dashboard Blynk (Geser Bebas X,Y &amp;
              Ubah Ukuran Widget)
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

      {/* GUDANG WIDGET BLYNK & TELEGRAM */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border-2 border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h5 className="font-black text-sm sm:text-base text-amber-300 flex items-center gap-2">
            <Move className="w-4 h-4 text-emerald-400" /> Gudang Widget Blynk (
            {katalogWidgetTersaring.length} Jenis): Tarik (Drag &amp; Drop) ke Posisi Mana Saja di
            Kanvas Bawah
          </h5>

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

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-48 overflow-y-auto pr-1">
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

        {/* BAR PENGATUR UKURAN KANVAS BLYNK & TOMBOL RAPIKAN OTOMATIS */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-emerald-400 uppercase text-[11px]">
              📐 Ukuran Kanvas Dashboard Blynk:
            </span>
            {(
              [
                { id: "kecil", label: "Kecil" },
                { id: "sedang", label: "Sedang" },
                { id: "besar", label: "Besar" },
                { id: "penuh", label: "Layar Penuh" },
              ] as const
            ).map((uk) => (
              <button
                key={uk.id}
                type="button"
                onClick={() => setUkuranKanvasBlynk(uk.id)}
                className={`px-2.5 py-1 rounded-lg font-black text-[11px] cursor-pointer ${
                  ukuranKanvasBlynk === uk.id
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                {uk.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={rapikanPosisiGridOtomatis}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Rapikan Posisi Widget Otomatis
          </button>
        </div>

        {/* ====================================================================
            KANVAS BEBAS 2D (FREE-ROAM X,Y & RESIZABLE W,H) DASHBOARD BLYNK
           ==================================================================== */}
        <div
          ref={blynkCanvasRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropDariGudangKeKanvasBlynk}
          onMouseMove={handleMouseMoveBlynkCanvas}
          onMouseUp={() => {
            setDraggingWidgetState(null);
            setResizingWidgetState(null);
          }}
          onMouseLeave={() => {
            setDraggingWidgetState(null);
            setResizingWidgetState(null);
          }}
          className={`rounded-3xl bg-[#060c17] border-2 border-dashed border-emerald-500/40 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-all ${kelasTinggiKanvasBlynk}`}
        >
          <div className="relative w-full h-full min-w-[760px] min-h-[420px]">
            {daftarWidgetBlynk.map((w) => {
              const nodeTerkait = cariNodeTerkaitWidget(w.targetTipeKomponen);
              const nilaiAktual = nodeTerkait?.nilaiSensor ?? 30;
              const statusNyalaAktual = nodeTerkait?.nyala ?? true;
              const sedangEdit = idWidgetDiedit === w.id;
              const sedangDigeser = draggingWidgetState?.id === w.id;

              return (
                <div
                  key={w.id}
                  style={{
                    left: `${w.x ?? 20}px`,
                    top: `${w.y ?? 20}px`,
                    width: `${w.w ?? 230}px`,
                    minHeight: `${w.h ?? 155}px`,
                  }}
                  className={`absolute p-3.5 rounded-2xl bg-slate-900/95 border-2 flex flex-col justify-between space-y-2 shadow-xl transition-shadow ${
                    sedangDigeser
                      ? "border-amber-400 shadow-[0_0_25px_rgba(250,204,21,0.4)] z-30"
                      : "border-slate-800 hover:border-emerald-400 z-10"
                  }`}
                >
                  {/* HEADER WIDGET: KLIK & TAHAN DI SINI UNTUK MENGGESER BEBAS (X, Y) */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (!blynkCanvasRef.current) return;
                      const rect = blynkCanvasRef.current.getBoundingClientRect();
                      setDraggingWidgetState({
                        id: w.id,
                        offsetX:
                          e.clientX -
                          rect.left -
                          (w.x ?? 20) +
                          blynkCanvasRef.current.scrollLeft,
                        offsetY:
                          e.clientY -
                          rect.top -
                          (w.y ?? 20) +
                          blynkCanvasRef.current.scrollTop,
                      });
                    }}
                    className="flex justify-between items-center gap-1.5 border-b border-slate-800 pb-2 cursor-move"
                    title="Klik & tahan di sini untuk memindahkan posisi widget secara bebas!"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Move className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-black text-[10px] shrink-0">
                        {w.virtualPin}
                      </span>
                      <span className="font-black text-xs text-white truncate">
                        {w.judul}
                      </span>
                    </div>

                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 shrink-0"
                    >
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
                          updateDaftarWidget(
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
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                      <input
                        type="text"
                        value={w.judul}
                        onChange={(e) =>
                          updateDaftarWidget(
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
                          updateDaftarWidget(
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
                        <option value="water_pump">Pompa Air Mini</option>
                        <option value="relay_1ch">Modul Relay 1/2/4 Ch</option>
                        <option value="servo">Servo 180° Positional</option>
                        <option value="servo_360">Servo 360° Continuous</option>
                        <option value="kipas_dc">Kipas DC / Motor DC</option>
                        <option value="dht22">Sensor Suhu DHT22</option>
                        <option value="ultrasonik">Ultrasonik HC-SR04</option>
                        <option value="pir_sensor">Sensor Gerak PIR</option>
                        <option value="ldr_sensor">Sensor Cahaya LDR</option>
                        <option value="mq2_gas">Sensor Gas MQ-2</option>
                      </select>
                    </div>
                  )}

                  {w.tipe === "gauge" && (
                    <div className="text-center space-y-1.5 py-1">
                      <div className="text-2xl font-black text-amber-300">
                        {nilaiAktual} {w.satuan}
                      </div>
                      {nodeTerkait && (
                        <input
                          type="range"
                          min={0}
                          max={400}
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
                    <div className="space-y-1.5 text-center py-1">
                      <div className="text-[10px] text-slate-400 truncate">
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
                        className={`w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          statusNyalaAktual
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {statusNyalaAktual ? "ON / HIGH (AKTIF)" : "OFF / LOW (MATI)"}
                      </button>
                    </div>
                  )}

                  {(w.tipe === "telegram_bot" || w.tipe === "whatsapp_bot") && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-1.5 rounded-xl bg-sky-950/60 border border-sky-500/30 font-mono text-sky-200 truncate">
                        🤖 {w.tipe === "telegram_bot" ? "@HibahIlmu_IoT_Bot" : "WA Alert Gateway"}
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
                    <div className="space-y-1.5 py-1 text-center">
                      <div className="text-xl font-black text-indigo-300">
                        {nilaiAktual} {w.satuan}
                      </div>
                      {nodeTerkait && (
                        <input
                          type="range"
                          min={-100}
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
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-300">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" /> Live Stream
                        </span>
                        <span>{nilaiAktual}</span>
                      </div>
                      <div className="h-14 bg-slate-950 rounded-xl p-2 flex items-end gap-1 border border-slate-800">
                        {[0.6, 0.8, 0.5, 0.9, 0.7, 1.0, 0.85, 0.95].map((f, i) => (
                          <div
                            key={i}
                            style={{
                              height: `${Math.min(100, Math.max(20, Math.round((nilaiAktual / 100) * f * 100)))}%`,
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
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                      <div className="text-xs font-black text-amber-300 truncate">
                        {nodeTerkait?.label}: {nilaiAktual}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Status: {statusNyalaAktual ? "ONLINE" : "STANDBY"}
                      </div>
                    </div>
                  )}

                  {/* PEGANGAN SUDUT KANAN BAWAH UNTUK UBAH UKURAN BEBAS (RESIZE HANDLE) */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizingWidgetState({
                        id: w.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        startW: w.w ?? 230,
                        startH: w.h ?? 155,
                      });
                    }}
                    className="self-end text-[9px] font-mono text-slate-500 hover:text-amber-300 cursor-nwse-resize select-none pt-0.5"
                    title="Tarik sudut ini untuk memperbesar / memperkecil ukuran widget"
                  >
                    {w.w ?? 230}×{w.h ?? 155} ↘
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-2 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 mx-3 pointer-events-none">
            <span>
              💡 Klik &amp; tahan judul atas widget untuk memindahkannya secara bebas (X,Y), atau
              tarik pojok kanan bawah [↘] untuk mengubah ukuran!
            </span>
            <span className="text-emerald-400">
              {daftarWidgetBlynk.length} Widget Aktif
            </span>
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
          <span className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
            <Key className="w-4 h-4" /> 2. Blynk Auth &amp; Telegram Bot Token
          </span>
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
            <label className="text-[10px] text-slate-400 block mb-0.5">TELEGRAM_BOT_TOKEN:</label>
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