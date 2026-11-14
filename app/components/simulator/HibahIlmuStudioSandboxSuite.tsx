"use client";

import React, { useState } from "react";
import {
  Activity,
  Award,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  FileDown,
  Flame,
  Gauge,
  Layers,
  Play,
  Radio,
  Send,
  Smartphone,
  Sparkles,
  Terminal,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import {
  analisisKodeStudioLengkap,
  StudioCodeDrivenStatusBar,
} from "./wokwiStudioCodeDrivenEngine";
import {
  hitungPembacaanMultimeter,
  hitungProfilDayaBaterai18650,
  HasilAnalisisKerusakanFisik,
} from "./wokwiLabInstrumentsEngine";
import { WokwiInstrumentsAndPlotterPanel } from "./WokwiInstrumentsAndPlotterPanel";
import { WokwiStage2AdvancedLabSuite } from "./WokwiStage2AdvancedLabSuite";
import { HibahIlmuTab1Stage1UniqueSuite } from "./HibahIlmuTab1Stage1UniqueSuite";
import { HibahIlmuTab1Stage2UniqueSuite } from "./HibahIlmuTab1Stage2UniqueSuite";
import { ParameterFisikaInteraktif } from "./wokwiHardwareVisuals";
import { unduhLaporanPraktikumDocx } from "./wokwiDocxReportGenerator";

export interface LogPaketMqttStudio {
  id: string;
  waktu: string;
  arah: "PUBLISH (ESP32 ➔ BROKER)" | "SUBSCRIBE (DASHBOARD ➔ ESP32)";
  topik: string;
  payloadJson: string;
  qos: 0 | 1 | 2;
}

const SNIPPET_KREASI_STUDIO: {
  id: string;
  label: string;
  kategori: "Wi-Fi & Cloud" | "MQTT Broker" | "Blynk IoT" | "Sensor & AI";
  potonganKodeCpp: string;
}[] = [
  {
    id: "wifi_hibahilmu",
    label: "+ Koneksi Wi-Fi HibahIlmu-Guest",
    kategori: "Wi-Fi & Cloud",
    potonganKodeCpp: `// --- KONEKSI WI-FI HIBAHILMU-GUEST ---
#include <WiFi.h>
const char* ssid = "HibahIlmu-Guest";
const char* password = "";

void hubungkanWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\n[WIFI OK] IP Address: " + WiFi.localIP().toString());
}`,
  },
  {
    id: "mqtt_pubsub",
    label: "+ Template MQTT Publish & Subscribe JSON",
    kategori: "MQTT Broker",
    potonganKodeCpp: `// --- KONFIGURASI BROKER MQTT HIBAHILMU ---
#include <PubSubClient.h>
WiFiClient espClient;
PubSubClient client(espClient);

void kirimTelemetriMqtt(float suhu, int gasPpm, int cahayaLux) {
  client.setServer("broker.hibahilmu.id", 1883);
  String payload = "{\\"suhu\\":" + String(suhu, 1) + ",\\"gas\\":" + String(gasPpm) + ",\\"lux\\":" + String(cahayaLux) + "}";
  client.publish("hibahilmu/iot/telemetri", payload.c_str());
  client.subscribe("hibahilmu/iot/aktuator/kontrol");
}`,
  },
  {
    id: "blynk_vpin",
    label: "+ Template Blynk Virtual Pin (V0–V3)",
    kategori: "Blynk IoT",
    potonganKodeCpp: `// --- SINKRONISASI DASHBOARD BLYNK IOT CLOUD ---
#define BLYNK_TEMPLATE_ID "TMPL_HIBAHILMU_PRO"
#define BLYNK_AUTH_TOKEN "Token_Blynk_Studio_Kreasi"
#include <BlynkSimpleEsp32.h>

BLYNK_WRITE(V0) {
  int sakelarDashboard = param.asInt();
  digitalWrite(26, sakelarDashboard ? HIGH : LOW);
}

void kirimDataKeBlynk(float suhu, int kelembapan, float voltBaterai) {
  Blynk.virtualWrite(V1, suhu);
  Blynk.virtualWrite(V2, kelembapan);
  Blynk.virtualWrite(V3, voltBaterai);
  Blynk.run();
}`,
  },
  {
    id: "tinyml_anomaly",
    label: "+ Inferensi TinyML Edge AI & Telegram Alert",
    kategori: "Sensor & AI",
    potonganKodeCpp: `// --- DETEKSI ANOMALI TINYML EDGE AI & TELEGRAM WEBHOOK ---
void evaluasiTinyMlEdgeAi(float suhu, int ppmGas) {
  float skorAnomali = (suhu * 0.45) + (ppmGas * 0.06);
  if (skorAnomali > 40.0) {
    digitalWrite(19, HIGH); // Nyalakan Buzzer Sirine
    digitalWrite(25, HIGH); // Nyalakan Pompa Sprinkler
    Serial.println("[TELEGRAM BOT] ALERT KRITIS! Skor AI: " + String(skorAnomali));
  }
}`,
  },
];

export const HibahIlmuStudioSandboxSuite: React.FC<{
  kodeStudioAktif: string;
  onUpdateKodeStudio: (kodeBaru: string) => void;
  onPindahKeAkademi?: () => void;
}> = ({ kodeStudioAktif, onUpdateKodeStudio, onPindahKeAkademi }) => {
  const [bukaPanelLabStudio, setBukaPanelLabStudio] = useState<boolean>(true);
  const [simulasiStudioRunning, setSimulasiStudioRunning] =
    useState<boolean>(true);
  const [pinProbeMerah, setPinProbeMerah] = useState<string>("ESP_GPIO26");
  const [ memicuKorsletingUji, setMemicuKorsletingUji] =
    useState<boolean>(false);
  const [sedangCetakDocx, setSedangCetakDocx] = useState<boolean>(false);

  // State Parameter Fisika Live untuk Studio Kanvas Tab 1
  const [fisikaStudio, setFisikaStudio] = useState<ParameterFisikaInteraktif>({
    pwmLedBrightness: 220,
    nilaiOhmResistor: 220,
    luxCahaya: 240,
    suhuCelcius: 33.5,
    jarakUltrasonikCm: 28,
    pirAdaOrang: true,
    rfidKartuDekat: true,
    kadarGasPpm: 540,
    apiTerdeteksi: false,
    rpmKipas: 1350,
    debitPompaAir: true,
    sudutServo: 90,
  });

  // State Live MQTT Broker Traffic & Virtual Pin Tester di Tab 1
  const [topikMqttUji, setTopikMqttUji] = useState<string>(
    "hibahilmu/iot/telemetri"
  );
  const [payloadMqttUji, setPayloadMqttUji] = useState<string>(
    '{"node":"ESP32_Studio","suhu":33.5,"gas_ppm":540,"relay":"ON"}'
  );
  const [logMqttList, setLogMqttList] = useState<LogPaketMqttStudio[]>([
    {
      id: "mqtt-1",
      waktu: "08:15:10",
      arah: "PUBLISH (ESP32 ➔ BROKER)",
      topik: "hibahilmu/iot/telemetri",
      payloadJson: '{"suhu":33.5,"gas":540,"lux":240,"status":"ONLINE"}',
      qos: 1,
    },
    {
      id: "mqtt-2",
      waktu: "08:15:14",
      arah: "SUBSCRIBE (DASHBOARD ➔ ESP32)",
      topik: "hibahilmu/iot/aktuator/kontrol",
      payloadJson: '{"pin":26,"relay_1":1,"servo_deg":90}',
      qos: 1,
    },
  ]);

  const statusKode = analisisKodeStudioLengkap(kodeStudioAktif);

  const kerusakanFisik: HasilAnalisisKerusakanFisik = {
    terjadiKorsletingDaya: memicuKorsletingUji,
    ledPutusTanpaResistor: fisikaStudio.nilaiOhmResistor < 50,
    slotKomponenGosong: memicuKorsletingUji ? [1, 2] : [],
    pesanBahayaFisik: memicuKorsletingUji
      ? "💥 SIMULASI KORSLETING STUDIO: Jalur 3V3 bertemu langsung dengan GND! Arus melonjak ke 1850 mA!"
      : "🔥 OVERCURRENT LED: Nilai Resistor di bawah 50Ω membuat arus melampaui batas aman 20 mA!",
    arusPuncakMa: memicuKorsletingUji ? 1850 : 12.5,
  };

  const bacaanMultimeter = hitungPembacaanMultimeter(
    pinProbeMerah,
    "ESP_GND",
    fisikaStudio,
    kodeStudioAktif,
    simulasiStudioRunning && !memicuKorsletingUji,
    true
  );

  const profilBaterai = hitungProfilDayaBaterai18650(
    kodeStudioAktif,
    Math.max(3, statusKode.pinOutputTerprogram.length + 2),
    simulasiStudioRunning
  );

  const kirimPaketMqttLive = (
    arah: "PUBLISH (ESP32 ➔ BROKER)" | "SUBSCRIBE (DASHBOARD ➔ ESP32)"
  ) => {
    const jam = new Date().toTimeString().slice(0, 8);
    const paketBaru: LogPaketMqttStudio = {
      id: `pkt-${Date.now()}`,
      waktu: jam,
      arah,
      topik: topikMqttUji,
      payloadJson: payloadMqttUji,
      qos: 1,
    };
    setLogMqttList((prev) => [paketBaru, ...prev.slice(0, 7)]);
  };

  const handleUnduhLaporanStudioDocx = async () => {
    setSedangCetakDocx(true);
    try {
      await unduhLaporanPraktikumDocx({
        materi: {
          level: 99,
          badgeLevel: "PROYEK KREASI STUDIO MANDIRI",
          judulMateri:
            "Proyek Kreasi Bebas Studio Kanvas HibahIlmu IoT, MQTT & Blynk Cloud",
          tujuanBelajar:
            "Merancang arsitektur perangkat keras multi-sensor, memprogram logika C++/MicroPython, dan mengintegrasikan telemetri MQTT serta Dashboard Blynk Cloud secara mandiri.",
          komponenDimasukkan: [],
          penjelasanTeoriSingkat:
            "Integrasi penuh antara mikrokontroler ESP32, jaringan Wi-Fi HibahIlmu-Guest, protokol publish/subscribe MQTT, dan visualisasi Virtual Pin pada Dashboard Cloud.",
          instruksiKetik: [],
          kodeTemplateAwal: kodeStudioAktif,
          kodeTargetBenar: kodeStudioAktif,
          kataKunciWajibAda: [],
          penjelasanBarisKode: [],
          simulasiOutputJikaBenar: "",
          tantanganModifikasi: "",
          xpReward: 300,
        },
        blueprint: {
          analogiMudahPaham:
            "Rangkaian kreasi mandiri di Studio Kanvas menghubungkan sensor input, aktuator output, broker MQTT, dan widget dashboard secara real-time.",
          ringkasanCaraKerja: "Proyek Kreasi Studio Kanvas HibahIlmu IoT",
          tinggiKanvasSvg: 320,
          slotPeriferalList: [],
          sambunganWajibList: statusKode.pinOutputTerprogram.map((p, idx) => ({
            idSambungan: `ST_${idx}`,
            pinAsalId: `ESP_GPIO${p}`,
            labelPinAsal: `GPIO ${p}`,
            pinTujuanId: `PERIF_${p}`,
            labelPinTujuan: `Perangkat Aktuator / Sensor #${idx + 1}`,
            warnaKabel: "#10b981",
            keteranganJalur: `Jalur Aktif Studio: GPIO ${p} terhubung ke modul periferal`,
          })),
        },
        bahasa: "cpp",
        modeBelajar: "Studio Kreasi Mandiri (MQTT & Cloud)",
        kodeProgram: kodeStudioAktif,
        outputSerial: logMqttList
          .map(
            (l) => `[${l.waktu}] [${l.arah}] Topik: ${l.topik} -> ${l.payloadJson}`
          )
          .join("\n"),
        multimeter: bacaanMultimeter,
        profilBaterai,
        hasilTestbench: [
          {
            nomorSkenario: 1,
            namaSkenario: "Validasi Pin GPIO & Sintaks Kode",
            kondisiInput: `${statusKode.pinOutputTerprogram.length} Pin Output & ${statusKode.pinAnalogDibaca.length} Pin Input`,
            responDiharapkan: statusKode.validSintaksDasar
              ? "Kompilasi Berhasil (0 Error)"
              : "Perlu Perbaikan Sintaks",
            lulus: statusKode.validSintaksDasar,
          },
          {
            nomorSkenario: 2,
            namaSkenario: "Konektivitas Wi-Fi HibahIlmu-Guest",
            kondisiInput: `SSID: ${statusKode.ssidTertulis || "Belum Diprogram"}`,
            responDiharapkan: "Terhubung ke Access Point",
            lulus: statusKode.wifiTerprogram,
          },
          {
            nomorSkenario: 3,
            namaSkenario: "Integrasi Telemetri MQTT / Blynk Cloud",
            kondisiInput: `${logMqttList.length} Paket MQTT & ${statusKode.blynkVirtualWrites.length} Virtual Pin`,
            responDiharapkan: "Data Tampil di Dashboard",
            lulus: statusKode.mqttTerprogram || statusKode.blynkTerprogram,
          },
        ],
      });
    } finally {
      setSedangCetakDocx(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. BAR STATUS SINKRONISASI KODINGAN -> RANGKAIAN -> MQTT & BLYNK */}
      <StudioCodeDrivenStatusBar
        statusKode={statusKode}
        sedangRunning={simulasiStudioRunning}
      />

      {/* 2. PANEL KONTROL KREASI BEBAS STUDIO KANVAS (TAB 1) */}
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                🛠️ WORKBENCH KREASI BEBAS (TAB 1 STUDIO KANVAS)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-200 font-bold text-[10px]">
                Terhubung ke Broker MQTT, Dashboard Blynk, Multimeter &amp; Laporan .DOCX
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Pusat Kontrol Eksperimen Mandiri, Generator Kode MQTT/Blynk &amp; Instrumen Lab Studio
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulasiStudioRunning(!simulasiStudioRunning)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg ${
                simulasiStudioRunning
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {simulasiStudioRunning
                ? "⚡ Mesin Studio: RUNNING"
                : "⏹ Mesin Studio: PAUSED"}
            </button>

            <button
              type="button"
              disabled={sedangCetakDocx}
              onClick={handleUnduhLaporanStudioDocx}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              {sedangCetakDocx
                ? "Mencetak .DOCX..."
                : "📄 Unduh Dokumentasi Proyek Studio (.docx)"}
            </button>

            <button
              type="button"
              onClick={() => setBukaPanelLabStudio(!bukaPanelLabStudio)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs cursor-pointer"
            >
              {bukaPanelLabStudio
                ? "Sembunyikan Instrumen Lab ▲"
                : "Tampilkan Instrumen Lab & MQTT ▼"}
            </button>
          </div>
        </div>

        {bukaPanelLabStudio && (
          <div className="space-y-4">
            {/* BARIS A: GENERATOR SNIPPET CEPAT & PENGUJI BROKER MQTT LIVE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Kolom Kiri: Injektor Snippet Kode C++ Siap Pakai untuk Kreasi */}
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  1. Suntikkan Blok Kode Cepat ke Editor Studio:
                </div>
                <p className="text-slate-400 text-[11px]">
                  Klik tombol di bawah untuk menambahkan fungsi Wi-Fi{" "}
                  <code className="text-sky-300">HibahIlmu-Guest</code>,{" "}
                  <code className="text-purple-300">MQTT Publish</code>, atau{" "}
                  <code className="text-teal-300">Blynk Virtual Pin</code> ke dalam program Studio Anda:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {SNIPPET_KREASI_STUDIO.map((snip) => (
                    <button
                      key={snip.id}
                      type="button"
                      onClick={() =>
                        onUpdateKodeStudio(
                          `${kodeStudioAktif.trimEnd()}\n\n${snip.potonganKodeCpp}\n`
                        )
                      }
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-400 text-left transition cursor-pointer space-y-0.5"
                    >
                      <div className="text-[10px] font-black text-indigo-400 uppercase">
                        {snip.kategori}
                      </div>
                      <div className="font-bold text-white text-[11px]">
                        {snip.label}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMemicuKorsletingUji(!memicuKorsletingUji)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer border ${
                      memicuKorsletingUji
                        ? "bg-rose-600 text-white border-white"
                        : "bg-slate-900 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {memicuKorsletingUji
                      ? "Matikan Simulasi Korsleting"
                      : "⚡ Uji Efek Korsleting (3V3 ↔ GND)"}
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Live MQTT Broker Console & Topic Inspector */}
              <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-purple-500/40 space-y-2.5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="font-extrabold text-purple-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    2. Live MQTT Broker Inspector (wss://broker.hibahilmu.id:8083):
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono text-[10px]">
                    QoS 1 • Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={topikMqttUji}
                    onChange={(e) => setTopikMqttUji(e.target.value)}
                    placeholder="Topik MQTT (misal: hibahilmu/iot/sensor)"
                    className="sm:col-span-5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sky-300 text-[11px]"
                  />
                  <input
                    type="text"
                    value={payloadMqttUji}
                    onChange={(e) => setPayloadMqttUji(e.target.value)}
                    placeholder='Payload JSON (misal: {"suhu":34.2})'
                    className="sm:col-span-7 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-emerald-300 text-[11px]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      kirimPaketMqttLive("PUBLISH (ESP32 ➔ BROKER)")
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Publish dari ESP32 ke Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      kirimPaketMqttLive("SUBSCRIBE (DASHBOARD ➔ ESP32)")
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cloud className="w-3 h-3" /> Kirim Perintah dari Dashboard ke ESP32
                  </button>
                </div>

                {/* Log Lalu Lintas Paket MQTT */}
                <div className="bg-black p-2.5 rounded-xl border border-slate-800 max-h-28 overflow-y-auto space-y-1 font-mono text-[10.5px]">
                  {logMqttList.map((pkt) => (
                    <div
                      key={pkt.id}
                      className="flex flex-wrap justify-between gap-2 border-b border-slate-900 pb-1"
                    >
                      <span
                        className={
                          pkt.arah.startsWith("PUBLISH")
                            ? "text-purple-300 font-bold"
                            : "text-teal-300 font-bold"
                        }
                      >
                        [{pkt.waktu}] {pkt.arah} • {pkt.topik}
                      </span>
                      <span className="text-emerald-300">{pkt.payloadJson}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BARIS B: MULTIMETER DIGITAL, OSILOSKOP PWM, SERIAL PLOTTER & KALKULATOR BATERAI 18650 */}
            <WokwiInstrumentsAndPlotterPanel
              kerusakanFisik={kerusakanFisik}
              multimeter={bacaanMultimeter}
              pinProbeMerah={pinProbeMerah}
              setPinProbeMerah={setPinProbeMerah}
              profilBaterai={profilBaterai}
              fisika={fisikaStudio}
              simulasiAktif={simulasiStudioRunning}
              onSisipkanDeepSleep={() =>
                onUpdateKodeStudio(
                  `${kodeStudioAktif.trimEnd()}\n// Mode Hemat Energi Deep Sleep Node:\nesp_deep_sleep_start();\n`
                )
              }
              onPerbaikiKorsleting={() => {
                setMemicuKorsletingUji(false);
                setFisikaStudio((f) => ({ ...f, nilaiOhmResistor: 220 }));
              }}
            />

            {/* BARIS C: CHAOS MESH 10-NODE, SMARTPHONE TELEGRAM/WA WEBHOOK & TINYML EDGE AI */}
            <WokwiStage2AdvancedLabSuite
              levelAktif={1}
              judulMateri="Proyek Kreasi Mandiri Studio Kanvas HibahIlmu IoT"
              fisika={fisikaStudio}
              setFisika={setFisikaStudio}
              simulasiAktif={simulasiStudioRunning}
              kodeKetikanUser={kodeStudioAktif}
              onSisipkanKodeChaosAtauAi={(tambahan) =>
                onUpdateKodeStudio(`${kodeStudioAktif.trimEnd()}\n${tambahan}`)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};