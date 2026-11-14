"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  FileDown,
  Flame,
  Layers,
  ListChecks,
  Play,
  Radio,
  Send,
  Sparkles,
  Terminal,
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
import {
  DAFTAR_8_PROYEK_JADI_LENGKAP,
  SpesifikasiProyekJadiLengkap,
} from "./hibahIlmuCompleteProjectsData";

export interface LogPaketMqttStudio {
  id: string;
  waktu: string;
  arah: "PUBLISH (ESP32 -> BROKER)" | "SUBSCRIBE (DASHBOARD -> ESP32)";
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
    label: "+ Template Blynk Virtual Pin (V0-V3)",
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
    digitalWrite(19, HIGH);
    digitalWrite(25, HIGH);
    Serial.println("[TELEGRAM BOT] ALERT KRITIS! Skor AI: " + String(skorAnomali));
  }
}`,
  },
];

export const HibahIlmuStudioSandboxSuite: React.FC<{
  kodeStudioAktif: string;
  onUpdateKodeStudio: (kodeBaru: string) => void;
  onPindahKeAkademi?: () => void;
}> = ({ kodeStudioAktif, onUpdateKodeStudio }) => {
  const [proyekTerpilih, setProyekTerpilih] =
    useState<SpesifikasiProyekJadiLengkap>(DAFTAR_8_PROYEK_JADI_LENGKAP[3]); // Default Proyek 4 (Pemadam Kebakaran & Gas) sesuai file aktif user!
  const [tampilkanPanduanProyek, setTampilkanPanduanProyek] =
    useState<boolean>(true);
  const [bukaPanelLabStudio, setBukaPanelLabStudio] = useState<boolean>(true);
  const [simulasiStudioRunning, setSimulasiStudioRunning] =
    useState<boolean>(true);
  const [pinProbeMerah, setPinProbeMerah] = useState<string>("ESP_GPIO25");
  const [memicuKorsletingUji, setMemicuKorsletingUji] =
    useState<boolean>(false);
  const [sedangCetakDocx, setSedangCetakDocx] = useState<boolean>(false);

  const [fisikaStudio, setFisikaStudio] = useState<ParameterFisikaInteraktif>({
    pwmLedBrightness: 220,
    nilaiOhmResistor: 220,
    luxCahaya: 240,
    suhuCelcius: 34.5,
    jarakUltrasonikCm: 25,
    pirAdaOrang: true,
    rfidKartuDekat: true,
    kadarGasPpm: 680,
    apiTerdeteksi: true,
    rpmKipas: 1450,
    debitPompaAir: true,
    sudutServo: 90,
  });

  const [topikMqttUji, setTopikMqttUji] = useState<string>(
    DAFTAR_8_PROYEK_JADI_LENGKAP[3].topikMqttDefault
  );
  const [payloadMqttUji, setPayloadMqttUji] = useState<string>(
    DAFTAR_8_PROYEK_JADI_LENGKAP[3].payloadMqttContoh
  );
  const [logMqttList, setLogMqttList] = useState<LogPaketMqttStudio[]>([
    {
      id: "mqtt-1",
      waktu: "09:40:10",
      arah: "PUBLISH (ESP32 -> BROKER)",
      topik: DAFTAR_8_PROYEK_JADI_LENGKAP[3].topikMqttDefault,
      payloadJson: DAFTAR_8_PROYEK_JADI_LENGKAP[3].payloadMqttContoh,
      qos: 1,
    },
    {
      id: "mqtt-2",
      waktu: "09:40:14",
      arah: "SUBSCRIBE (DASHBOARD -> ESP32)",
      topik: "hibahilmu/iot/aktuator/kontrol",
      payloadJson: '{"vpin":"V3","sprinkler_pump":"ON","servo_deg":90}',
      qos: 1,
    },
  ]);

  // OTOMATIS ISI KODE LENGKAP JIKA kodeStudioAktif BELUM MEMILIKI void setup()
  // Ini menghilangkan pesan merah "Compile Error: Fungsi utama 'void setup()' tidak ditemukan" secara otomatis!
  useEffect(() => {
    const adaSetup = /void\s+setup\s*\(\s*\)/.test(kodeStudioAktif || "");
    if (!adaSetup) {
      onUpdateKodeStudio(DAFTAR_8_PROYEK_JADI_LENGKAP[3].kodeLengkapCpp);
    }
  }, [kodeStudioAktif, onUpdateKodeStudio]);

  // Fungsi saat pengguna memilih salah satu dari 8 Proyek Jadi Lengkap
  const pilihDanMuatProyekLengkap = (
    proyek: SpesifikasiProyekJadiLengkap,
    bahasa: "cpp" | "micropython" = "cpp"
  ) => {
    setProyekTerpilih(proyek);
    setTampilkanPanduanProyek(true);
    setTopikMqttUji(proyek.topikMqttDefault);
    setPayloadMqttUji(proyek.payloadMqttContoh);

    onUpdateKodeStudio(
      bahasa === "micropython"
        ? proyek.kodeLengkapMicroPython
        : proyek.kodeLengkapCpp
    );

    const jam = new Date().toTimeString().slice(0, 8);
    setLogMqttList((prev) => [
      {
        id: `load-${Date.now()}`,
        waktu: jam,
        arah: "PUBLISH (ESP32 -> BROKER)",
        topik: proyek.topikMqttDefault,
        payloadJson: proyek.payloadMqttContoh,
        qos: 1,
      },
      ...prev.slice(0, 6),
    ]);
  };

  const statusKode = analisisKodeStudioLengkap(
    /void\s+setup\s*\(\s*\)/.test(kodeStudioAktif || "")
      ? kodeStudioAktif
      : proyekTerpilih.kodeLengkapCpp
  );

  const kerusakanFisik: HasilAnalisisKerusakanFisik = {
    terjadiKorsletingDaya: memicuKorsletingUji,
    ledPutusTanpaResistor: fisikaStudio.nilaiOhmResistor < 50,
    slotKomponenGosong: memicuKorsletingUji ? [1, 2] : [],
    pesanBahayaFisik: memicuKorsletingUji
      ? "SIMULASI KORSLETING STUDIO: Jalur 3V3 bertemu langsung dengan GND! Arus melonjak ke 1850 mA!"
      : "OVERCURRENT LED: Nilai Resistor di bawah 50 Ohm membuat arus melampaui batas aman 20 mA!",
    arusPuncakMa: memicuKorsletingUji ? 1850 : 12.5,
  };

  const bacaanMultimeter = hitungPembacaanMultimeter(
    pinProbeMerah,
    "ESP_GND",
    fisikaStudio,
    kodeStudioAktif || proyekTerpilih.kodeLengkapCpp,
    simulasiStudioRunning && !memicuKorsletingUji,
    true
  );

  const profilBaterai = hitungProfilDayaBaterai18650(
    kodeStudioAktif || proyekTerpilih.kodeLengkapCpp,
    Math.max(3, statusKode.pinOutputTerprogram.length + 2),
    simulasiStudioRunning
  );

  const kirimPaketMqttLive = (
    arah: "PUBLISH (ESP32 -> BROKER)" | "SUBSCRIBE (DASHBOARD -> ESP32)"
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
          level: proyekTerpilih.nomorUrut,
          badgeLevel: proyekTerpilih.badgeKategori,
          judulMateri: proyekTerpilih.judulProyek,
          tujuanBelajar: proyekTerpilih.ringkasanSistem,
          komponenDimasukkan: [],
          penjelasanTeoriSingkat: proyekTerpilih.ringkasanSistem,
          instruksiKetik: proyekTerpilih.panduanLangkahMenjalankan,
          kodeTemplateAwal: proyekTerpilih.kodeLengkapCpp,
          kodeTargetBenar: proyekTerpilih.kodeLengkapCpp,
          kataKunciWajibAda: [],
          penjelasanBarisKode: [],
          simulasiOutputJikaBenar: "",
          tantanganModifikasi: "",
          xpReward: 300,
        },
        blueprint: {
          analogiMudahPaham: proyekTerpilih.ringkasanSistem,
          ringkasanCaraKerja: proyekTerpilih.judulProyek,
          tinggiKanvasSvg: 320,
          slotPeriferalList: [],
          sambunganWajibList: proyekTerpilih.daftarKomponenDanPin.map(
            (k, idx) => ({
              idSambungan: `PRJ_${idx}`,
              pinAsalId: k.pinTerhubung,
              labelPinAsal: k.pinTerhubung,
              pinTujuanId: k.namaKomponen,
              labelPinTujuan: k.namaKomponen,
              warnaKabel: "#10b981",
              keteranganJalur: `${k.namaKomponen}: ${k.pinTerhubung} (${k.fungsi})`,
            })
          ),
        },
        bahasa: "cpp",
        modeBelajar: `Studio Proyek #${proyekTerpilih.nomorUrut} (Full-Stack MQTT & Blynk)`,
        kodeProgram: kodeStudioAktif || proyekTerpilih.kodeLengkapCpp,
        outputSerial: logMqttList
          .map(
            (l) =>
              `[${l.waktu}] [${l.arah}] Topik: ${l.topik} -> ${l.payloadJson}`
          )
          .join("\n"),
        multimeter: bacaanMultimeter,
        profilBaterai,
        hasilTestbench: [
          {
            nomorSkenario: 1,
            namaSkenario: "Validasi Pin GPIO & Sintaks Kode",
            kondisiInput: `${statusKode.pinOutputTerprogram.length} Pin Output & ${statusKode.pinAnalogDibaca.length} Pin Input`,
            responDiharapkan: "Kompilasi Berhasil (0 Error)",
            lulus: statusKode.validSintaksDasar,
          },
          {
            nomorSkenario: 2,
            namaSkenario: "Konektivitas Wi-Fi HibahIlmu-Guest",
            kondisiInput: `SSID: ${statusKode.ssidTertulis || "HibahIlmu-Guest"}`,
            responDiharapkan: "Terhubung ke Access Point",
            lulus: statusKode.wifiTerprogram,
          },
          {
            nomorSkenario: 3,
            namaSkenario: "Integrasi Telemetri MQTT & Blynk Cloud",
            kondisiInput: `Topik: ${proyekTerpilih.topikMqttDefault}`,
            responDiharapkan: "Data Tampil di Dashboard V0-V3",
            lulus: statusKode.mqttTerprogram && statusKode.blynkTerprogram,
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

      {/* =================================================================== */}
      {/* 2. PUSAT 8 PROYEK JADI FULL-STACK + PANDUAN CARA MENJALANKAN LENGKAP */}
      {/* =================================================================== */}
      <div className="bg-slate-950 border-2 border-amber-400/70 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                📚 8 TUTORIAL &amp; PROYEK JADI FULL-STACK (SIAP JALAN + PANDUAN LENGKAP)
              </span>
              <span className="text-emerald-300 font-bold text-[11px]">
                ✓ Otomatis Menyalakan 4 Indikator (GPIO + Wi-Fi + MQTT + Blynk) &amp; Membuka Panduan Langkah!
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Pilih Proyek di Bawah untuk Memuat Kode Lengkap (C++ / MicroPython), Tabel Pinout &amp; Panduan Cara Menjalankannya:
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setTampilkanPanduanProyek(!tampilkanPanduanProyek)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold cursor-pointer"
          >
            {tampilkanPanduanProyek
              ? "Sembunyikan Detail Panduan Proyek ▲"
              : "Tampilkan Detail Panduan Proyek ▼"}
          </button>
        </div>

        {/* Grid 8 Kartu Proyek Jadi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DAFTAR_8_PROYEK_JADI_LENGKAP.map((prj) => {
            const sedangAktif = prj.idProyek === proyekTerpilih.idProyek;
            return (
              <div
                key={prj.idProyek}
                onClick={() => pilihDanMuatProyekLengkap(prj, "cpp")}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                  sedangAktif
                    ? "bg-emerald-950/50 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                    : "bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-amber-400/60"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9.5px]">
                      {prj.badgeKategori}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-400/40 text-teal-300 font-bold text-[9.5px]">
                      {prj.jumlahTabMcuLabel}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-xs leading-snug">
                    {prj.judulProyek}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span
                    className={`font-extrabold text-[10.5px] flex items-center gap-1 ${
                      sedangAktif ? "text-emerald-300" : "text-sky-400"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {sedangAktif
                      ? "✓ Proyek & Panduan Aktif"
                      : "Muat Proyek & Panduan Ini"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PANEL PANDUAN LENGKAP MENJALANKAN PROYEK YANG SEDANG DIPILIH */}
        {tampilkanPanduanProyek && (
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px]">
                    📖 PANDUAN LENGKAP PROYEK #{proyekTerpilih.nomorUrut} AKTIF
                  </span>
                  <span className="font-mono text-[11px] text-amber-300">
                    Topik MQTT: {proyekTerpilih.topikMqttDefault}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  {proyekTerpilih.judulProyek}
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {proyekTerpilih.ringkasanSistem}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    pilihDanMuatProyekLengkap(proyekTerpilih, "cpp")
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Code2 className="w-4 h-4" /> Gunakan Kode C++ Lengkap (.ino)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    pilihDanMuatProyekLengkap(proyekTerpilih, "micropython")
                  }
                  className="px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Terminal className="w-4 h-4" /> Gunakan Kode MicroPython (main.py)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Kolom Kiri: Tabel Komponen & Sambungan Pinout Proyek Ini */}
              <div className="lg:col-span-5 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="font-extrabold text-sky-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> 1. Daftar Komponen &amp; Kaki Pin Proyek Ini:
                </div>
                <div className="space-y-2">
                  {proyekTerpilih.daftarKomponenDanPin.map((komp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5"
                    >
                      <div className="font-bold text-white">
                        {idx + 1}. {komp.namaKomponen}
                      </div>
                      <div className="font-mono text-[10.5px] text-amber-300">
                        🔌 Pin: {komp.pinTerhubung}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {komp.fungsi}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-500/40 text-[11px] text-teal-200">
                  <strong>📱 Widget Blynk Terhubung:</strong>{" "}
                  {proyekTerpilih.virtualPinBlynkList.join(" • ")}
                </div>
              </div>

              {/* Kolom Kanan: 5 Langkah Cara Menjalankan & Menguji Proyek Ini */}
              <div className="lg:col-span-7 bg-slate-950 p-3.5 rounded-xl border border-emerald-500/40 space-y-2.5">
                <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4" /> 2. Panduan Langkah-demi-Langkah Cara Menjalankan &amp; Menguji Proyek #{proyekTerpilih.nomorUrut}:
                </div>
                <ol className="space-y-2">
                  {proyekTerpilih.panduanLangkahMenjalankan.map(
                    (langkah, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-slate-200 leading-relaxed"
                      >
                        <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[10px] shrink-0 mt-0.5">
                          LANGKAH {idx + 1}
                        </span>
                        <span>{langkah}</span>
                      </li>
                    )
                  )}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PANEL KONTROL KREASI BEBAS STUDIO KANVAS (TAB 1) */}
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                🛠️ WORKBENCH KREASI BEBAS (TAB 1 STUDIO KANVAS)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-200 font-bold text-[10px]">
                Proyek Aktif: #{proyekTerpilih.nomorUrut} — {proyekTerpilih.judulProyek.split("(")[0]}
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
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  1. Suntikkan Blok Kode Cepat ke Editor Studio:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {SNIPPET_KREASI_STUDIO.map((snip) => (
                    <button
                      key={snip.id}
                      type="button"
                      onClick={() =>
                        onUpdateKodeStudio(
                          `${(
                            kodeStudioAktif || proyekTerpilih.kodeLengkapCpp
                          ).trimEnd()}\n\n${snip.potonganKodeCpp}\n`
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
                      : "⚡ Uji Efek Korsleting (3V3 <-> GND)"}
                  </button>
                </div>
              </div>

              {/* Live MQTT Broker Console */}
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
                    className="sm:col-span-5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sky-300 text-[11px]"
                  />
                  <input
                    type="text"
                    value={payloadMqttUji}
                    onChange={(e) => setPayloadMqttUji(e.target.value)}
                    className="sm:col-span-7 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-emerald-300 text-[11px]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      kirimPaketMqttLive("PUBLISH (ESP32 -> BROKER)")
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Publish dari ESP32 ke Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      kirimPaketMqttLive("SUBSCRIBE (DASHBOARD -> ESP32)")
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cloud className="w-3 h-3" /> Kirim Perintah dari Dashboard ke ESP32
                  </button>
                </div>

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

            {/* BARIS B: MULTIMETER, OSILOSKOP PWM, SERIAL PLOTTER & KALKULATOR BATERAI */}
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
                  `${(
                    kodeStudioAktif || proyekTerpilih.kodeLengkapCpp
                  ).trimEnd()}\n// Mode Hemat Energi Deep Sleep Node:\nesp_deep_sleep_start();\n`
                )
              }
              onPerbaikiKorsleting={() => {
                setMemicuKorsletingUji(false);
                setFisikaStudio((f) => ({ ...f, nilaiOhmResistor: 220 }));
              }}
            />

            {/* BARIS C: CHAOS MESH 10-NODE, SMARTPHONE TELEGRAM/WA WEBHOOK & TINYML EDGE AI */}
            <WokwiStage2AdvancedLabSuite
              levelAktif={proyekTerpilih.nomorUrut}
              judulMateri={proyekTerpilih.judulProyek}
              fisika={fisikaStudio}
              setFisika={setFisikaStudio}
              simulasiAktif={simulasiStudioRunning}
              kodeKetikanUser={kodeStudioAktif || proyekTerpilih.kodeLengkapCpp}
              onSisipkanKodeChaosAtauAi={(tambahan) =>
                onUpdateKodeStudio(
                  `${(
                    kodeStudioAktif || proyekTerpilih.kodeLengkapCpp
                  ).trimEnd()}\n${tambahan}`
                )
              }
            />

            {/* BARIS D: 5 FITUR UNIK TAB 1 TAHAP 1 */}
            <HibahIlmuTab1Stage1UniqueSuite
              kodeStudioAktif={kodeStudioAktif || proyekTerpilih.kodeLengkapCpp}
              onUpdateKodeStudio={onUpdateKodeStudio}
            />

            {/* BARIS E: 5 FITUR UNIK TAB 1 TAHAP 2 */}
            <HibahIlmuTab1Stage2UniqueSuite
              kodeStudioAktif={kodeStudioAktif || proyekTerpilih.kodeLengkapCpp}
              onUpdateKodeStudio={onUpdateKodeStudio}
              fisikaStudio={fisikaStudio}
              setFisikaStudio={setFisikaStudio}
              onKirimPerintahKeBroker={(topik, payload) => {
                setTopikMqttUji(topik);
                setPayloadMqttUji(payload);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};