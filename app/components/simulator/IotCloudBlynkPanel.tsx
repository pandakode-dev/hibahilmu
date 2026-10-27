"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Smartphone,
  Server,
  Play,
  Square,
  RefreshCw,
} from "lucide-react";
import { AkunPengguna } from "../../types";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";
import {
  WidgetBlynkItem,
  KATALOG_GUDANG_WIDGET_BLYNK,
  VisualWidgetBlynkMini,
} from "./BlynkWidgetSvg";

export interface ExtendedWidgetBlynkItem extends WidgetBlynkItem {
  lebarKolom?: 1 | 2;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

function beriKoordinatDefaultWidget(
  list: WidgetBlynkItem[]
): ExtendedWidgetBlynkItem[] {
  return list.map((w: WidgetBlynkItem, idx: number) => {
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

function buatTokenUnikPerAkunDanProject(
  userLogin: AkunPengguna | null | undefined,
  idAtauNamaProject: string
): string {
  const slugUser = (userLogin?.id || userLogin?.nama || "guest")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const slugProj = idAtauNamaProject
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  let hash = 0;
  const gabung = `${slugUser}_${slugProj}`;
  for (let i = 0; i < gabung.length; i++) {
    hash = (hash << 5) - hash + gabung.charCodeAt(i);
    hash |= 0;
  }
  const kodeHex = Math.abs(hash).toString(16).padStart(6, "0");
  return `hbh_${slugUser}_${slugProj}_${kodeHex}`;
}

export interface IotCloudBlynkProps {
  nodesKanvas: NodeKomponenKanvas[];
  userLogin?: AkunPengguna | null;
  idProjectAktif?: string;
  namaProjectAktif?: string;
  presetWidgets?: WidgetBlynkItem[];
  customWidgetsState?: ExtendedWidgetBlynkItem[];
  onChangeWidgetsState?: (widgetsBaru: ExtendedWidgetBlynkItem[]) => void;
  onUpdateNodeDariCloud: (id: string, perubahan: Partial<NodeKomponenKanvas>) => void;
  onGenerateKodeIotKeEditor?: (kodeBaru: string) => void;
}

export const IotCloudBlynkPanel: React.FC<IotCloudBlynkProps> = ({
  nodesKanvas,
  userLogin,
  idProjectAktif = "proj-default",
  namaProjectAktif = "Smart IoT Project",
  presetWidgets,
  customWidgetsState,
  onChangeWidgetsState,
  onUpdateNodeDariCloud,
  onGenerateKodeIotKeEditor,
}) => {
  const blynkCanvasRef = useRef<HTMLDivElement | null>(null);

  const tokenDefaultUnik = useMemo(
    () => buatTokenUnikPerAkunDanProject(userLogin, idProjectAktif),
    [userLogin, idProjectAktif]
  );

  const [blynkAuthToken, setBlynkAuthToken] = useState<string>(tokenDefaultUnik);
  const [modeBrokerPilih, setModeBrokerPilih] = useState<
    "server_sendiri" | "hivemq_public"
  >("server_sendiri");
  const [brokerKitaRunning, setBrokerKitaRunning] = useState<boolean>(true);
  const [tampilkanHpAndroid, setTampilkanHpAndroid] = useState<boolean>(true);

  useEffect(() => {
    setBlynkAuthToken(tokenDefaultUnik);
  }, [tokenDefaultUnik]);

  const originWebKita =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const hostWebKita =
    typeof window !== "undefined" ? window.location.host : "localhost:3000";

  const [wifiSsid, setWifiSsid] = useState("HibahIlmu_IoT_Lab_5G");
  const [wifiPassword, setWifiPassword] = useState("wakafilmu2026");
  const [statusWifiConnected, setStatusWifiConnected] = useState(true);

  const [telegramBotToken, setTelegramBotToken] = useState(
    "7123456789:AAH_HibahIlmuBot_Token2026"
  );
  const [tokenDisalin, setTokenDisalin] = useState(false);

  const [inputPerintahTelegram, setInputPerintahTelegram] = useState("/unlock_solenoid");
  const [logMqttMessages, setLogMqttMessages] = useState<
    { waktu: string; arah: string; topik: string; payload: string }[]
  >([
    {
      waktu: "10:30:12",
      arah: "BROKER_KITA",
      topik: `hibahilmu/${tokenDefaultUnik}/status`,
      payload: '{"server":"HibahIlmu Broker Active","port":"REST & WS"}',
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

  const daftarWidgetBlynk = useMemo<ExtendedWidgetBlynkItem[]>(
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
  }, [presetWidgets, customWidgetsState]);

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

  const kirimUpdatePinKeServerKita = async (
    virtualPin: string,
    nilaiBaru: number | string,
    sumber: "WEB_SIMULATOR" | "ANDROID_APP" = "WEB_SIMULATOR"
  ) => {
    if (!brokerKitaRunning) return;
    try {
      const res = await fetch("/api/iot/cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: blynkAuthToken,
          pemilikNama: userLogin?.nama || "Tamu",
          namaProject: namaProjectAktif,
          sumber,
          pin: virtualPin,
          value: nilaiBaru,
        }),
      });
      const json = await res.json();
      if (json.ok && json.data?.logPesan) {
        setLogMqttMessages(
          json.data.logPesan.map(
            (l: { waktu: string; sumber: string; topik: string; payload: string }) => ({
              waktu: l.waktu,
              arah: l.sumber,
              topik: l.topik,
              payload: l.payload,
            })
          )
        );
      }
    } catch {}
  };

  useEffect(() => {
    if (!brokerKitaRunning) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/iot/cloud?token=${encodeURIComponent(blynkAuthToken)}`
        );
        const json = await res.json();
        if (json.ok && json.data?.logPesan) {
          setLogMqttMessages(
            json.data.logPesan.map(
              (l: { waktu: string; sumber: string; topik: string; payload: string }) => ({
                waktu: l.waktu,
                arah: l.sumber,
                topik: l.topik,
                payload: l.payload,
              })
            )
          );
        }
      } catch {}
    }, 2200);
    return () => clearInterval(interval);
  }, [brokerKitaRunning, blynkAuthToken]);

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
    const rapi = daftarWidgetBlynk.map(
      (w: ExtendedWidgetBlynkItem, idx: number) => ({
        ...w,
        x: 20 + (idx % 3) * 245,
        y: 20 + Math.floor(idx / 3) * 175,
        w: 230,
        h: 155,
      })
    );
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
          e.clientX -
            rect.left -
            draggingWidgetState.offsetX +
            blynkCanvasRef.current.scrollLeft
        )
      );
      const yBaru = Math.max(
        8,
        e.clientY -
          rect.top -
          draggingWidgetState.offsetY +
          blynkCanvasRef.current.scrollTop
      );
      updateDaftarWidget(
        daftarWidgetBlynk.map((w: ExtendedWidgetBlynkItem) =>
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
        daftarWidgetBlynk.map((w: ExtendedWidgetBlynkItem) =>
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
    const targetAktuator = cariNodeTerkaitWidget("solenoid_lock");
    const buka = cmd.includes("unlock") || cmd.includes("on");
    if (targetAktuator) {
      onUpdateNodeDariCloud(targetAktuator.id, { nyala: buka });
    }
    kirimUpdatePinKeServerKita("V1", buka ? 1 : 0, "ANDROID_APP");
  };

  const handleGenerateKodeLengkapIot = () => {
    const daftarPinCode = daftarWidgetBlynk
      .map(
        (w: ExtendedWidgetBlynkItem) =>
          `  // Sinkronisasi Widget ${w.judul} (${w.virtualPin})\n  kirimPinKeServerHibahIlmu("${w.virtualPin}", ${
            cariNodeTerkaitWidget(w.targetTipeKomponen)?.nilaiSensor ?? 1
          });`
      )
      .join("\n");

    const kodeLengkap = `// ============================================================================
// KODE HARDWARE ESP32 ASLI & SIMULATOR: TERHUBUNG KE SERVER BROKER HIBAHILMU!
// Akun Pemilik : ${userLogin?.nama || "Tamu"}
// Nama Project : ${namaProjectAktif}
// Auth Token   : ${blynkAuthToken}
// ============================================================================
#define HIBAHILMU_AUTH_TOKEN "${blynkAuthToken}"
#define SERVER_API_URL       "${originWebKita}/api/iot/cloud"

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ESP32Servo.h>

const char* WIFI_SSID     = "${wifiSsid}";
const char* WIFI_PASSWORD = "${wifiPassword}";

void kirimPinKeServerHibahIlmu(String pin, float nilai) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_API_URL);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\\"token\\":\\"" + String(HIBAHILMU_AUTH_TOKEN) + "\\",\\"sumber\\":\\"ESP32_HARDWARE\\",\\"pin\\":\\"" + pin + "\\",\\"value\\":" + String(nilai) + "}";
    int httpCode = http.POST(payload);
    http.end();
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("=== MENGHUBUNGKAN ESP32 KE SERVER BROKER HIBAHILMU ===");
  Serial.println("Endpoint Broker : " + String(SERVER_API_URL));
  Serial.println("Token Unik Anda : " + String(HIBAHILMU_AUTH_TOKEN));
}

void loop() {
${daftarPinCode}
  Serial.println("[ESP32 -> HibahIlmu Broker]: Data Virtual Pin terkirim!");
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
      ? "h-[340px]"
      : ukuranKanvasBlynk === "sedang"
      ? "h-[450px]"
      : ukuranKanvasBlynk === "besar"
      ? "h-[580px]"
      : "h-[740px]";

  return (
    <div className="bg-slate-950 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Server className="w-6 h-6 text-emerald-400" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                Self-Hosted IoT Broker &amp; Blynk Cloud Server
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Token Unik Akun: {userLogin?.nama || "Tamu"} • {namaProjectAktif.slice(0, 24)}
              </span>
            </div>
            <h4 className="font-black text-base sm:text-lg text-white mt-1">
              Server MQTT/REST Broker Mandiri HibahIlmu &amp; Remote Aplikasi Android
            </h4>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBrokerKitaRunning(!brokerKitaRunning)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition ${
              brokerKitaRunning
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-rose-600 text-white"
            }`}
          >
            {brokerKitaRunning ? (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Server Broker Kita: RUNNING
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 fill-white" /> Server Broker: STOPPED
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTampilkanHpAndroid(!tampilkanHpAndroid)}
            className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer border ${
              tampilkanHpAndroid
                ? "bg-indigo-600 text-white border-indigo-400"
                : "bg-slate-900 text-slate-300 border-slate-700"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            {tampilkanHpAndroid ? "Sembunyikan HP Android" : "Buka Remote HP Android"}
          </button>

          <button
            type="button"
            onClick={handleGenerateKodeLengkapIot}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Code2 className="w-4 h-4" /> Buat Kode ESP32 Asli (Ke Server Kita)
          </button>
        </div>
      </div>

      {/* GUDANG WIDGET BLYNK & KANVAS BEBAS 2D */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border-2 border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h5 className="font-black text-sm sm:text-base text-amber-300 flex items-center gap-2">
            <Move className="w-4 h-4 text-emerald-400" /> Gudang Widget Blynk (
            {katalogWidgetTersaring.length} Jenis): Tarik (Drag &amp; Drop) ke Kanvas Bawah
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

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-44 overflow-y-auto pr-1">
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
              <div className="h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
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

        {/* GRID UTAMA: KANVAS BEBAS 2D BLYNK (KIRI) + REMOTE SMARTPHONE ANDROID (KANAN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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
            className={`${
              tampilkanHpAndroid ? "lg:col-span-8" : "lg:col-span-12"
            } rounded-3xl bg-[#060c17] border-2 border-dashed border-emerald-500/40 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-all ${kelasTinggiKanvasBlynk}`}
          >
            <div className="relative w-full h-full min-w-[740px] min-h-[420px]">
              {daftarWidgetBlynk.map((w: ExtendedWidgetBlynkItem) => {
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
                              daftarWidgetBlynk.filter(
                                (x: ExtendedWidgetBlynkItem) => x.id !== w.id
                              )
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
                              daftarWidgetBlynk.map((item: ExtendedWidgetBlynkItem) =>
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
                              daftarWidgetBlynk.map((item: ExtendedWidgetBlynkItem) =>
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
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdateNodeDariCloud(nodeTerkait.id, {
                                nilaiSensor: val,
                              });
                              kirimUpdatePinKeServerKita(w.virtualPin, val);
                            }}
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
                              const baru = !statusNyalaAktual;
                              onUpdateNodeDariCloud(nodeTerkait.id, {
                                nyala: baru,
                              });
                              kirimUpdatePinKeServerKita(w.virtualPin, baru ? 1 : 0);
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
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdateNodeDariCloud(nodeTerkait.id, {
                                nilaiSensor: val,
                              });
                              kirimUpdatePinKeServerKita(w.virtualPin, val);
                            }}
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
                    >
                      {w.w ?? 230}×{w.h ?? 155} ↘
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {tampilkanHpAndroid && (
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[310px] rounded-[2.6rem] bg-slate-950 border-[6px] border-slate-800 p-4 shadow-2xl space-y-3.5 relative">
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-xs">
                  <div>
                    <div className="font-black text-emerald-400 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" /> Blynk Android App
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate max-w-[175px]">
                      Token: {blynkAuthToken}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      brokerKitaRunning
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {brokerKitaRunning ? "● ONLINE" : "● OFFLINE"}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-xs">
                  {daftarWidgetBlynk.map((w: ExtendedWidgetBlynkItem) => {
                    const nd = cariNodeTerkaitWidget(w.targetTipeKomponen);
                    const nyala = nd?.nyala ?? true;
                    const val = nd?.nilaiSensor ?? 30;
                    return (
                      <div
                        key={`hp-${w.id}`}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center gap-2"
                      >
                        <div>
                          <span className="text-[9px] font-mono font-black text-amber-300">
                            {w.virtualPin} • {w.tipe.toUpperCase()}
                          </span>
                          <div className="font-bold text-white text-xs">
                            {w.judul}
                          </div>
                        </div>

                        {w.tipe === "switch" || w.tipe === "telegram_bot" ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (!brokerKitaRunning) {
                                alert(
                                  "Server Broker sedang STOPPED! Klik tombol 'Server Broker Kita: RUNNING' terlebih dahulu."
                                );
                                return;
                              }
                              if (nd) {
                                const baru = !nyala;
                                onUpdateNodeDariCloud(nd.id, { nyala: baru });
                                kirimUpdatePinKeServerKita(
                                  w.virtualPin,
                                  baru ? 1 : 0,
                                  "ANDROID_APP"
                                );
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                              nyala
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {nyala ? "ON" : "OFF"}
                          </button>
                        ) : (
                          <span className="font-mono font-black text-sm text-sky-300">
                            {val} {w.satuan}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-[10px] font-mono text-indigo-200 space-y-1">
                  <div className="font-black text-amber-300">
                    🌐 Endpoint API untuk HP Android &amp; ESP32 Fisik Anda:
                  </div>
                  <div className="break-all text-[9.5px] text-emerald-300">
                    {originWebKita}/api/iot/cloud?token={blynkAuthToken}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BARIS KONFIGURASI: PILIH BROKER KITA VS HIVEMQ | TOKEN UNIK | LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-sky-400 uppercase flex items-center gap-1.5">
              <Server className="w-4 h-4" /> 1. Pilih Server MQTT &amp; REST Broker
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black ${
                brokerKitaRunning
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              ● {brokerKitaRunning ? "BROKER RUNNING" : "STOPPED"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModeBrokerPilih("server_sendiri")}
              className={`p-2.5 rounded-xl border text-left font-black text-[11px] cursor-pointer ${
                modeBrokerPilih === "server_sendiri"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              🚀 Broker Web Kita ({hostWebKita})
            </button>
            <button
              type="button"
              onClick={() => setModeBrokerPilih("hivemq_public")}
              className={`p-2.5 rounded-xl border text-left font-black text-[11px] cursor-pointer ${
                modeBrokerPilih === "hivemq_public"
                  ? "bg-amber-500/20 border-amber-400 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              🌐 Public Broker (broker.hivemq.com)
            </button>
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
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4" /> 2. Token Unik Project &amp; Akun Ini
            </span>
            <button
              type="button"
              onClick={() =>
                setBlynkAuthToken(
                  `${tokenDefaultUnik}_${Math.floor(100 + Math.random() * 900)}`
                )
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Acak Baru
            </button>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              TOKEN KHUSUS ({userLogin?.nama || "Tamu"} — {namaProjectAktif.slice(0, 22)}):
            </label>
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
                {tokenDisalin ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed">
            ✓ Token ini otomatis berbeda untuk setiap akun dan setiap project!
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> 3. Live Traffic Broker Kita
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              /api/iot/cloud
            </span>
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
              <Send className="w-3 h-3" /> Kirim
            </button>
          </div>
          <div className="p-2 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] max-h-24 overflow-y-auto space-y-1">
            {logMqttMessages.map((m, idx) => (
              <div key={idx} className="truncate">
                <span className="text-emerald-400">[{m.arah}]</span> {m.topik}:{" "}
                {m.payload}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};