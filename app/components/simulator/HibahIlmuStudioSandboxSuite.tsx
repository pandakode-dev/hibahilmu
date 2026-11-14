"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  BookOpen,
  Box,
  BrainCircuit,
  Cloud,
  CloudOff,
  Code2,
  Cpu,
  FileDown,
  Filter,
  Flame,
  Gauge,
  Layers,
  ListChecks,
  Play,
  Radio,
  Send,
  Sparkles,
  Sun,
  Terminal,
  Wifi,
  WifiOff,
  Wrench,
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
  KategoriProyekStudio,
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

type LaciAlatBantuAktif =
  | "TUTUP_SEMUA"
  | "PANDUAN_PROYEK"
  | "MQTT_DAN_SNIPPET"
  | "MULTIMETER_PLOTTER"
  | "REKAYASA_GEDUNG_RAB"
  | "SOLAR_VOICE_PENTEST"
  | "CHAOS_TINYML";

const DAFTAR_KATEGORI_PROYEK: {
  id: KategoriProyekStudio;
  label: string;
  deskripsiSingkat: string;
}[] = [
  {
    id: "Semua",
    label: "📚 Semua Proyek (7)",
    deskripsiSingkat: "Tampilkan seluruh proyek IoT, Non-IoT, dan Multi-MCU",
  },
  {
    id: "1. Proyek IoT Cloud (MQTT & Blynk Aktif)",
    label: "🌐 Proyek IoT Cloud, MQTT & Blynk",
    deskripsiSingkat: "Otomatis menyalakan Rangkaian + Server MQTT + Dashboard Blynk",
  },
  {
    id: "2. Proyek Non-IoT (Offline / Lokal Tanpa Internet)",
    label: "🔌 Proyek Non-IoT (Offline Lokal)",
    deskripsiSingkat: "Fokus rangkaian lokal, otomatis mematikan MQTT & Dashboard Blynk",
  },
  {
    id: "3. Proyek Multi-MCU (2-3 Board Serial/PLC)",
    label: "🔗 Proyek Multi-MCU (2–3 Chip)",
    deskripsiSingkat: "Komunikasi UART & klaster banyak mikrokontroler",
  },
];

export const HibahIlmuStudioSandboxSuite: React.FC<{
  kodeStudioAktif: string;
  onUpdateKodeStudio: (kodeBaru: string) => void;
  onPindahKeAkademi?: () => void;
}> = ({ kodeStudioAktif, onUpdateKodeStudio }) => {
  const [kategoriFilter, setKategoriFilter] =
    useState<KategoriProyekStudio>("Semua");
  const [proyekTerpilih, setProyekTerpilih] =
    useState<SpesifikasiProyekJadiLengkap>(DAFTAR_8_PROYEK_JADI_LENGKAP[0]);

  // Mode IoT Cloud Aktif/Mati (Otomatis menyesuaikan kategori proyek yang dipilih, atau bisa di-toggle manual!)
  const [iotCloudMqttBlynkAktif, setIotCloudMqttBlynkAktif] = useState<boolean>(
    DAFTAR_8_PROYEK_JADI_LENGKAP[0].pakaiIotCloudMqttBlynk
  );

  // Laci Alat Bantu: Default TUTUP_SEMUA agar halaman pendek, rapi, dan tidak bikin pusing!
  const [laciAktif, setLaciAktif] =
    useState<LaciAlatBantuAktif>("PANDUAN_PROYEK");

  const [simulasiStudioRunning, setSimulasiStudioRunning] =
    useState<boolean>(true);
  const [pinProbeMerah, setPinProbeMerah] = useState<string>("ESP_GPIO34");
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
    DAFTAR_8_PROYEK_JADI_LENGKAP[0].topikMqttDefault
  );
  const [payloadMqttUji, setPayloadMqttUji] = useState<string>(
    DAFTAR_8_PROYEK_JADI_LENGKAP[0].payloadMqttContoh
  );
  const [logMqttList, setLogMqttList] = useState<LogPaketMqttStudio[]>([
    {
      id: "mqtt-1",
      waktu: "09:40:10",
      arah: "PUBLISH (ESP32 -> BROKER)",
      topik: "hibahilmu/iot/telemetri",
      payloadJson: '{"status":"ONLINE","suhu":34.5,"gas":680}',
      qos: 1,
    },
  ]);

  // ==========================================================================
  // SINKRONISASI VISUAL OTOMATIS KE KANVAS BAWAH (ElectronicAndIotCanvas):
  // 1. Sembunyikan galeri duplikat "7 TUTORIAL & CONTOH RANGKAIAN" di bawah agar tidak dobel!
  // 2. Sembunyikan atau Tampilkan panel "Server MQTT/REST Broker Mandiri & Blynk" sesuai mode IoT / Non-IoT!
  // 3. Klik otomatis template rangkaian di kanvas bawah saat user memilih proyek di atas!
  // ==========================================================================
  const sinkronkanDomKanvasDanCloudBawah = useCallback(
    (aktifkanPanelIotCloud: boolean, kataKunciTemplateKanvas?: string) => {
      if (typeof document === "undefined") return;

      const semuaDiv = Array.from(
        document.querySelectorAll("div, section")
      ) as HTMLElement[];

      for (const el of semuaDiv) {
        const teks = (el.textContent || "").trim();

        // A. Jika ada kataKunciTemplateKanvas, cari kartu template asli di ElectronicAndIotCanvas lalu klik otomatis
        //    agar gambar rangkaian di meja kanvas langsung berubah sesuai proyek yang dipilih!
        if (
          kataKunciTemplateKanvas &&
          teks.includes("7 TUTORIAL & CONTOH RANGKAIAN PROJECT JADI") &&
          teks.length < 2500
        ) {
          const kartuList = Array.from(
            el.querySelectorAll("div, button")
          ) as HTMLElement[];
          const kartuCocok = kartuList.find(
            (k) =>
              (k.textContent || "").includes(kataKunciTemplateKanvas) &&
              (k.textContent || "").includes("Muat Template Ini") &&
              (k.textContent || "").length < 300
          );
          if (kartuCocok) {
            kartuCocok.click();
          }
          // Sembunyikan kontainer galeri duplikat tersebut agar di layar hanya ada 1 Pemilih Proyek Terpadu!
          const boxDuplikat = el.closest(".rounded-3xl, .rounded-2xl") as HTMLElement | null;
          if (boxDuplikat && !boxDuplikat.hasAttribute("data-unified-gallery")) {
            boxDuplikat.style.display = "none";
          }
        }

        // B. Tampilkan atau Sembunyikan Panel Besar "Server MQTT/REST Broker Mandiri & Gudang Widget Blynk"
        //    sesuai apakah proyek yang dipilih adalah IoT Cloud atau Non-IoT Offline!
        if (
          teks.startsWith("SELF-HOSTED IOT BROKER & BLYNK CLOUD SERVER") ||
          (teks.includes("Server MQTT/REST Broker Mandiri HibahIlmu") &&
            teks.includes("Gudang Widget Blynk (16 Jenis)") &&
            teks.length < 6000)
        ) {
          const containerBlynk =
            (el.closest(".rounded-3xl") as HTMLElement | null) || el;
          if (containerBlynk) {
            containerBlynk.style.display = aktifkanPanelIotCloud
              ? ""
              : "none";
          }
        }
      }
    },
    []
  );

  // Pastikan kode awal valid dan sinkron saat pertama kali dibuka
  useEffect(() => {
    const adaSetup = /void\s+setup\s*\(\s*\)/.test(kodeStudioAktif || "");
    if (!adaSetup) {
      onUpdateKodeStudio(proyekTerpilih.kodeLengkapCpp);
    }
    const t = setTimeout(() => {
      sinkronkanDomKanvasDanCloudBawah(
        iotCloudMqttBlynkAktif,
        proyekTerpilih.kataKunciCocokKanvas
      );
    }, 250);
    return () => clearTimeout(t);
  }, []);

  // Fungsi utama saat pengguna memilih salah satu proyek dari kategori mana pun
  const pilihProyekTerpadu = (
    prj: SpesifikasiProyekJadiLengkap,
    bahasa: "cpp" | "micropython" = "cpp"
  ) => {
    setProyekTerpilih(prj);
    setIotCloudMqttBlynkAktif(prj.pakaiIotCloudMqttBlynk);
    setTopikMqttUji(prj.topikMqttDefault);
    setPayloadMqttUji(prj.payloadMqttContoh);

    // 1. Picu perubahan rangkaian visual pada meja kanvas di bawah
    sinkronkanDomKanvasDanCloudBawah(
      prj.pakaiIotCloudMqttBlynk,
      prj.kataKunciCocokKanvas
    );

    // 2. Timpa kode dengan kode lengkap proyek (tunggu 80ms agar tidak tertimpa balik oleh default kanvas)
    setTimeout(() => {
      onUpdateKodeStudio(
        bahasa === "micropython"
          ? prj.kodeLengkapMicroPython
          : prj.kodeLengkapCpp
      );
    }, 80);
  };

  // Fungsi saat pengguna menekan sakelar manual "Mode IoT Cloud & MQTT: ON / OFF"
  const toggleManualModeIotCloud = () => {
    const statusBaru = !iotCloudMqttBlynkAktif;
    setIotCloudMqttBlynkAktif(statusBaru);
    sinkronkanDomKanvasDanCloudBawah(statusBaru);

    if (statusBaru && !/WiFi\.begin/.test(kodeStudioAktif)) {
      // Jika pengguna mengaktifkan IoT secara manual pada proyek Non-IoT, suntikkan stack Wi-Fi + MQTT + Blynk otomatis!
      const kodeUpgradeIot = `${kodeStudioAktif.trimEnd()}

// --- MODUL TAMBAHAN IOT CLOUD (WIFI + MQTT + BLYNK DIAKTIFKAN) ---
#include <WiFi.h>
#include <PubSubClient.h>
#include <BlynkSimpleEsp32.h>
// WiFi.begin("HibahIlmu-Guest", "");
// client.publish("hibahilmu/iot/telemetri", "{\\"status\\":\\"ONLINE\\"}");
// Blynk.virtualWrite(V0, 1);
`;
      onUpdateKodeStudio(kodeUpgradeIot);
    }
  };

  const daftarProyekTampil = DAFTAR_8_PROYEK_JADI_LENGKAP.filter(
    (p) => kategoriFilter === "Semua" || p.kategoriProyek === kategoriFilter
  );

  const kodeEfektif = /void\s+setup\s*\(\s*\)/.test(kodeStudioAktif || "")
    ? kodeStudioAktif
    : proyekTerpilih.kodeLengkapCpp;

  const statusKode = analisisKodeStudioLengkap(kodeEfektif);

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
    kodeEfektif,
    simulasiStudioRunning && !memicuKorsletingUji,
    true
  );

  const profilBaterai = hitungProfilDayaBaterai18650(
    kodeEfektif,
    Math.max(3, statusKode.pinOutputTerprogram.length + 2),
    simulasiStudioRunning
  );

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
          kodeTemplateAwal: kodeEfektif,
          kodeTargetBenar: kodeEfektif,
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
              keteranganJalur: `${k.namaKomponen}: ${k.pinTerhubung}`,
            })
          ),
        },
        bahasa: "cpp",
        modeBelajar: iotCloudMqttBlynkAktif
          ? "Mode IoT Cloud (MQTT & Blynk Aktif)"
          : "Mode Non-IoT (Offline Lokal)",
        kodeProgram: kodeEfektif,
        outputSerial: logMqttList
          .map(
            (l) =>
              `[${l.waktu}] [${l.arah}] Topik: ${l.topik} -> ${l.payloadJson}`
          )
          .join("\n"),
        multimeter: bacaanMultimeter,
        profilBaterai,
        hasilTestbench: [],
      });
    } finally {
      setSedangCetakDocx(false);
    }
  };

  return (
    <div data-unified-gallery="true" className="space-y-3">
      {/* =================================================================== */}
      {/* 1. PUSAT PEMILIH PROYEK TERPADU BERBASIS KATEGORI (SATU PINTU!)     */}
      {/*    Mengubah Rangkaian Kanvas + Kode + Otomatis ON/OFF IoT Cloud!    */}
      {/* =================================================================== */}
      <div className="bg-slate-950 border-2 border-emerald-500/70 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-2xl text-xs">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                🎛️ PUSAT PROYEK TERPADU &amp; PENGATUR MODE IOT / NON-IOT
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                  iotCloudMqttBlynkAktif
                    ? "bg-sky-500/20 border-sky-400 text-sky-300"
                    : "bg-amber-500/20 border-amber-400 text-amber-300"
                }`}
              >
                {iotCloudMqttBlynkAktif
                  ? "🌐 Mode Saat Ini: IOT CLOUD AKTIF (Rangkaian + MQTT + Dashboard Blynk Tampil)"
                  : "🔌 Mode Saat Ini: NON-IOT OFFLINE (Fokus Rangkaian Lokal — MQTT & Blynk Disembunyikan)"}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Pilih Kategori Proyek di Bawah (Otomatis Mengubah Rangkaian di Kanvas + Kode + Menyesuaikan Panel IoT):
            </h3>
          </div>

          {/* SAKELAR FLEKSIBEL: AKTIFKAN / NONAKTIFKAN IOT CLOUD & DASHBOARD BLYNK KAPAN SAJA */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleManualModeIotCloud}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-lg border-2 ${
                iotCloudMqttBlynkAktif
                  ? "bg-sky-500 hover:bg-sky-400 text-slate-950 border-white"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              {iotCloudMqttBlynkAktif ? (
                <>
                  <Cloud className="w-4 h-4" /> 🌐 Dashboard IoT &amp; MQTT: AKTIF (Klik untuk Matikan)
                </>
              ) : (
                <>
                  <CloudOff className="w-4 h-4 text-rose-400" /> 🔌 Dashboard IoT &amp; MQTT: NONAKTIF (Klik untuk Aktifkan)
                </>
              )}
            </button>

            <button
              type="button"
              disabled={sedangCetakDocx}
              onClick={handleUnduhLaporanStudioDocx}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              {sedangCetakDocx ? "Mencetak..." : "📄 Unduh Laporan (.docx)"}
            </button>
          </div>
        </div>

        {/* Baris Tab Filter Kategori Proyek */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400 mr-1" />
          {DAFTAR_KATEGORI_PROYEK.map((kat) => {
            const aktif = kategoriFilter === kat.id;
            return (
              <button
                key={kat.id}
                type="button"
                onClick={() => setKategoriFilter(kat.id)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition border ${
                  aktif
                    ? "bg-amber-400 text-slate-950 border-white font-black shadow"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600"
                }`}
              >
                {kat.label}
              </button>
            );
          })}
        </div>

        {/* Daftar Kartu Proyek Sesuai Kategori (Langsung Mengubah Rangkaian Visual di Kanvas!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {daftarProyekTampil.map((prj) => {
            const sedangDipilih = prj.idProyek === proyekTerpilih.idProyek;
            return (
              <div
                key={prj.idProyek}
                onClick={() => pilihProyekTerpadu(prj, "cpp")}
                className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-2 ${
                  sedangDipilih
                    ? "bg-emerald-950/60 border-emerald-400 shadow-lg"
                    : "bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-amber-400/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center gap-1">
                    <span
                      className={`px-2 py-0.5 rounded font-black text-[9px] ${
                        prj.pakaiIotCloudMqttBlynk
                          ? "bg-sky-400 text-slate-950"
                          : "bg-amber-400 text-slate-950"
                      }`}
                    >
                      {prj.badgeKategori}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-400">
                      {prj.jumlahTabMcuLabel}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-xs leading-snug">
                    {prj.judulProyek}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                  <span
                    className={`font-extrabold flex items-center gap-1 ${
                      sedangDipilih ? "text-emerald-300" : "text-sky-400"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {sedangDipilih
                      ? "✓ Rangkaian & Kode Aktif"
                      : "Muat Rangkaian & Kode"}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {prj.pakaiIotCloudMqttBlynk ? "🌐 IoT ON" : "🔌 Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* BAR DOCK ALAT BANTU RINGKAS (HANYA MEMBUKA 1 LACI SAAT DIKLIK!)   */}
        {/* Menjaga halaman tetap pendek, tidak menumpuk, dan anti-pusing!    */}
        {/* ================================================================= */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              🧰 Buka Alat Bantu Lab (Opsional):
            </span>

            {[
              {
                id: "PANDUAN_PROYEK" as LaciAlatBantuAktif,
                label: "📖 Panduan & Pinout Proyek Ini",
              },
              ...(iotCloudMqttBlynkAktif
                ? [
                    {
                      id: "MQTT_DAN_SNIPPET" as LaciAlatBantuAktif,
                      label: "📡 Inspector MQTT & Snippet Cloud",
                    },
                  ]
                : []),
              {
                id: "MULTIMETER_PLOTTER" as LaciAlatBantuAktif,
                label: "🔬 Multimeter, Osiloskop & Plotter",
              },
              {
                id: "REKAYASA_GEDUNG_RAB" as LaciAlatBantuAktif,
                label: "🏢 Fisika Ruangan, RAB PLN & 3D",
              },
              {
                id: "SOLAR_VOICE_PENTEST" as LaciAlatBantuAktif,
                label: "☀️ Solar 24h, Voice AI & Skema IEEE",
              },
              {
                id: "CHAOS_TINYML" as LaciAlatBantuAktif,
                label: "🧠 Chaos 10-Node & TinyML AI",
              },
            ].map((tab) => {
              const terbuka = laciAktif === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setLaciAktif(terbuka ? "TUTUP_SEMUA" : tab.id)
                  }
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition border ${
                    terbuka
                      ? "bg-emerald-400 text-slate-950 border-white font-black shadow"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  {tab.label} {terbuka ? "▲" : "▼"}
                </button>
              );
            })}
          </div>

          {laciAktif !== "TUTUP_SEMUA" && (
            <button
              type="button"
              onClick={() => setLaciAktif("TUTUP_SEMUA")}
              className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-[10.5px] font-bold cursor-pointer"
            >
              ✕ Tutup Laci Alat Bantu
            </button>
          )}
        </div>

        {/* ================================================================= */}
        {/* ISI LACI YANG SEDANG DIBUKA (HANYA 1 LACI TAMPIL PADA SATU WAKTU) */}
        {/* ================================================================= */}
        {laciAktif === "PANDUAN_PROYEK" && (
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-emerald-400 font-black">
                  📖 PANDUAN SINGKAT MENJALANKAN PROYEK #{proyekTerpilih.nomorUrut}:{" "}
                  {proyekTerpilih.judulProyek}
                </span>
                <p className="text-slate-300 text-[11.5px] mt-0.5">
                  {proyekTerpilih.ringkasanSistem}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => pilihProyekTerpadu(proyekTerpilih, "cpp")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-[11px] cursor-pointer"
                >
                  ⚡ Muat Kode C++ (.ino)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    pilihProyekTerpadu(proyekTerpilih, "micropython")
                  }
                  className="px-3 py-1.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-[11px] cursor-pointer"
                >
                  🐍 Muat MicroPython (main.py)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5 space-y-1.5">
                <div className="font-bold text-sky-300">
                  🔌 Komponen &amp; Kaki Pin di Kanvas Bawah:
                </div>
                {proyekTerpilih.daftarKomponenDanPin.map((k, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="font-bold text-white">
                      {i + 1}. {k.namaKomponen}
                    </div>
                    <div className="font-mono text-[10.5px] text-amber-300">
                      {k.pinTerhubung}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 space-y-1.5">
                <div className="font-bold text-emerald-400">
                  🚀 Langkah Menjalankan &amp; Menguji di Kanvas Bawah:
                </div>
                {proyekTerpilih.panduanLangkahMenjalankan.map((step, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-slate-200"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[9.5px] shrink-0">
                      #{i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {laciAktif === "MQTT_DAN_SNIPPET" && iotCloudMqttBlynkAktif && (
          <div className="space-y-3 pt-1">
            <StudioCodeDrivenStatusBar
              statusKode={statusKode}
              sedangRunning={simulasiStudioRunning}
            />
          </div>
        )}

        {laciAktif === "MULTIMETER_PLOTTER" && (
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
                `${kodeEfektif.trimEnd()}\nesp_deep_sleep_start();\n`
              )
            }
            onPerbaikiKorsleting={() => {
              setMemicuKorsletingUji(false);
              setFisikaStudio((f) => ({ ...f, nilaiOhmResistor: 220 }));
            }}
          />
        )}

        {laciAktif === "REKAYASA_GEDUNG_RAB" && (
          <HibahIlmuTab1Stage1UniqueSuite
            kodeStudioAktif={kodeEfektif}
            onUpdateKodeStudio={onUpdateKodeStudio}
          />
        )}

        {laciAktif === "SOLAR_VOICE_PENTEST" && (
          <HibahIlmuTab1Stage2UniqueSuite
            kodeStudioAktif={kodeEfektif}
            onUpdateKodeStudio={onUpdateKodeStudio}
            fisikaStudio={fisikaStudio}
            setFisikaStudio={setFisikaStudio}
            onKirimPerintahKeBroker={(topik, payload) => {
              setTopikMqttUji(topik);
              setPayloadMqttUji(payload);
            }}
          />
        )}

        {laciAktif === "CHAOS_TINYML" && (
          <WokwiStage2AdvancedLabSuite
            levelAktif={proyekTerpilih.nomorUrut}
            judulMateri={proyekTerpilih.judulProyek}
            fisika={fisikaStudio}
            setFisika={setFisikaStudio}
            simulasiAktif={simulasiStudioRunning}
            kodeKetikanUser={kodeEfektif}
            onSisipkanKodeChaosAtauAi={(tambahan) =>
              onUpdateKodeStudio(`${kodeEfektif.trimEnd()}\n${tambahan}`)
            }
          />
        )}
      </div>
    </div>
  );
};