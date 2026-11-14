"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Sparkles,
  X,
} from "lucide-react";

export interface ItemKatalogFiturSimulator {
  id: string;
  kategori:
    | "Dasar & Perakitan"
    | "Bahasa & Latihan"
    | "Instrumen Lab Virtual"
    | "AIoT, Mesh & Laporan";
  badge: string;
  judulFitur: string;
  deskripsiLengkap: string;
  caraPakaiSingkat: string[];
  kataKunciTargetDom: string[]; // Digunakan untuk melompat & menyorot langsung elemen tersebut!
  warnaaksen: string;
}

export interface LangkahSpotlightCoachmark {
  langkah: number;
  badgeArea: string;
  judul: string;
  isi: string;
  tipsPraktis: string;
  kataKunciElemenDom: string[]; // Pencarian cerdas elemen di layar untuk diberi efek berkedip!
}

// ============================================================================
// 1. REGISTRI KATALOG FITUR LENGKAP (DENGAN TOMBOL "SOROT LOKASINYA DI LAYAR")
// ============================================================================
export const KATALOG_FITUR_HIBAHILMU_IOT: ItemKatalogFiturSimulator[] = [
  {
    id: "studio_sandbox_mqtt_blynk",
    kategori: "AIoT, Mesh & Laporan",
    badge: "FITUR STUDIO TAB 1",
    judulFitur:
      "Workbench Kreasi Bebas (Tab 1): Live MQTT Broker, Blynk Cloud & Denah Ruangan",
    deskripsiLengkap:
      "Gunakan Tab 1 (Studio Kanvas HibahIlmu IoT Simulator) untuk berkreasi bebas merakit proyek sendiri lengkap dengan Denah Ruangan Fisik, Konsol Broker MQTT (Publish/Subscribe JSON), Widget Blynk Virtual Pin, Multimeter, dan Ekspor Dokumentasi Proyek (.docx).",
    caraPakaiSingkat: [
      "Buka Tab '1. Studio Kanvas HibahIlmu IoT Simulator' di bagian kiri atas.",
      "Gunakan tombol '+ Suntikkan Blok Kode Cepat' untuk memasukkan template Wi-Fi HibahIlmu-Guest, MQTT Publish, atau Blynk Virtual Pin.",
      "Uji pengiriman payload JSON secara langsung pada panel '2. Live MQTT Broker Inspector' dan unduh dokumentasi proyek (.docx).",
    ],
    kataKunciTargetDom: [
      "WORKBENCH KREASI BEBAS",
      "Live MQTT Broker Inspector",
      "7 TUTORIAL & CONTOH RANGKAIAN",
    ],
    warnaaksen: "border-emerald-400 bg-emerald-950/30",
  },
  {
    id: "multi_slot_ortho",
    kategori: "Dasar & Perakitan",
    badge: "FITUR INTI #1",
    judulFitur: "Kanvas Multi-Slot (1–10 Komponen) & Kabel Siku-Siku 90°",
    deskripsiLengkap:
      "Merakit perangkat keras seperti di meja praktikum nyata. Mendukung 1 hingga 10 komponen sekaligus dengan 2 kaki pin fisik per komponen (Hukum Kirchhoff Loop Tertutup) dan jalur kabel siku-siku 90° (Manhattan PCB Routing) bebas tumpang-tindih.",
    caraPakaiSingkat: [
      "Tarik (Drag) komponen yang berkedip dari Gudang 48 Perangkat ke kotak Slot #1 s.d. Slot #N di kanvas.",
      "Klik titik kaki pin ke-1 lalu klik titik kaki pin ke-2 untuk memasang kabel siku-siku.",
      "Jika salah pasang 1 kabel, cukup klik tombol bulat '✕' di tengah garis kabel tersebut tanpa menghapus kabel lain.",
    ],
    kataKunciTargetDom: [
      "Slot #1: ESP32 DevKit V1",
      "Kabel Siku-Siku Terpasang",
      "GUDANG KOMPONEN (48 ITEM)",
    ],
    warnaaksen: "border-emerald-500/60 bg-emerald-950/20",
  },
  {
    id: "interaksi_fisik_nyata",
    kategori: "Dasar & Perakitan",
    badge: "FITUR INTI #2",
    judulFitur: "Simulasi Interaksi Fisik Sensor & Sakelar (Event-Driven)",
    deskripsiLengkap:
      "Aktuator (LED, Buzzer, Relay, Servo, Solenoid, Kipas, Pompa) tidak menyala sendiri secara palsu, melainkan menunggu interaksi fisik dari Anda setelah program dijalankan.",
    caraPakaiSingkat: [
      "Klik tombol hijau '1. Periksa Semua Kaki & Jalankan' terlebih dahulu.",
      "Tekan tombol '👆 KLIK TEKAN' pada Push Button, putar slider Potensiometer melewati ambang ADC, atau gelapkan slider Cahaya LDR agar aktuator bereaksi.",
    ],
    kataKunciTargetDom: [
      "Pengatur Parameter Fisika & Kekuatan Sinyal Live",
      "PANEL UJI INTERAKSI FISIK PERANGKAT KERAS",
    ],
    warnaaksen: "border-amber-500/60 bg-amber-950/20",
  },
  {
    id: "dual_language_cpp_py",
    kategori: "Bahasa & Latihan",
    badge: "FITUR INTI #3",
    judulFitur:
      "Dukungan Ganda: Bahasa C++ Arduino (sketch.ino) & MicroPython (main.py)",
    deskripsiLengkap:
      "Pelajari pemrograman sistem tertanam dalam dua bahasa industri sekaligus. Dilengkapi Asisten Checklist Baris Kode Real-Time dan tombol '+ Sisipkan Baris Ini' bagi pemula yang kesulitan mengetik sintaks.",
    caraPakaiSingkat: [
      "Gunakan tombol switcher '⚡ C++ Arduino' atau '🐍 MicroPython' di bagian kanan atas.",
      "Perhatikan kotak checklist di sebelah kiri editor yang berubah menjadi hijau (✓ SUDAH TEPAT) setiap kali baris kode diketik dengan benar.",
    ],
    kataKunciTargetDom: [
      "C++ Arduino (sketch.ino)",
      "Panduan Ketik",
      "Editor C++",
    ],
    warnaaksen: "border-sky-500/60 bg-sky-950/20",
  },
  {
    id: "mode_latihan_mandiri",
    kategori: "Bahasa & Latihan",
    badge: "FITUR INTI #4",
    judulFitur:
      "Mode Ujian Latihan Mandiri (Rotasi Pin GPIO Baru & Studi Kasus)",
    deskripsiLengkap:
      "Menguji pemahaman nyata tanpa bantuan garis berkedip. Sistem otomatis memindahkan kewajiban sambungan ke nomor Pin GPIO baru disertai narasi masalah lapangan dan 3 Clue bertahap.",
    caraPakaiSingkat: [
      "Klik tombol merah muda '🎯 Latihan Mandiri (Pin Baru!)' di header atas.",
      "Baca daftar perubahan nomor pin pada kotak studi kasus di kiri bawah, lalu rakit dan modifikasi kode sesuai pin baru tersebut.",
    ],
    kataKunciTargetDom: [
      "Latihan Mandiri (Pin Baru!)",
      "Mode Terpandu",
    ],
    warnaaksen: "border-rose-500/60 bg-rose-950/20",
  },
  {
    id: "korsleting_multimeter_osiloskop",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #5",
    judulFitur:
      "Detektor Korsleting/Komponen Gosong, Multimeter Digital & Osiloskop PWM",
    deskripsiLengkap:
      "Mendeteksi hubung-singkat (3V3 langsung ke GND) dan arus lebih pada LED tanpa resistor. Dilengkapi Multimeter Digital (Volt, mA, Ohm) serta layar Osiloskop untuk melihat gelombang kotak PWM Duty Cycle secara live.",
    caraPakaiSingkat: [
      "Buka panel '🔬 Instrumen Laboratorium Virtual' tepat di bawah kanvas.",
      "Pilih kaki pin yang ingin diukur pada dropdown 'Probe Merah (+)' untuk membaca tegangan dan melihat bentuk gelombang PWM.",
    ],
    kataKunciTargetDom: [
      "Instrumen Laboratorium Virtual",
      "1. Multimeter & Osiloskop PWM",
    ],
    warnaaksen: "border-indigo-500/60 bg-indigo-950/20",
  },
  {
    id: "serial_plotter_power_profiler",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #6",
    judulFitur:
      "Live Serial Plotter Multi-Variabel & Kalkulator Baterai 18650 (Deep Sleep)",
    deskripsiLengkap:
      "Menampilkan grafik pergerakan nilai Suhu, Gas PPM, Cahaya Lux, dan PWM secara real-time, serta menghitung konsumsi arus (mA) dan estimasi masa pakai baterai Li-Ion 18650 (2500 mAh) saat aktif vs mode Deep Sleep.",
    caraPakaiSingkat: [
      "Klik tab '2. Live Serial Plotter' lalu geser slider sensor untuk melihat kurva grafik bergerak.",
      "Klik tab '3. Kalkulator Baterai 18650' lalu klik '+ Sisipkan Kode Deep Sleep' untuk menghemat 99% daya baterai.",
    ],
    kataKunciTargetDom: [
      "2. Live Serial Plotter (Grafik)",
      "3. Kalkulator Baterai 18650",
    ],
    warnaaksen: "border-teal-500/60 bg-teal-950/20",
  },
  {
    id: "debugger_testbench_grader",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #7",
    judulFitur:
      "Step-by-Step Code Debugger (Lompatan ISR) & Automated 3-Scenario Testbench",
    deskripsiLengkap:
      "Menyorot baris kode yang sedang dieksekusi CPU secara perlahan (termasuk melompat ke fungsi IRAM_ATTR saat Interrupt ditekan) dan menguji kelayakan rangkaian secara otomatis dalam 3 skenario beruntun.",
    caraPakaiSingkat: [
      "Klik '🐢 Jalankan Step-by-Step Debugger' untuk melihat sorotan kuning baris demi baris di editor.",
      "Klik '🧪 Uji Otomatis 3 Skenario (Grader)' untuk memvalidasi kondisi Aktif, Idle, dan Keamanan Arus sekaligus.",
    ],
    kataKunciTargetDom: [
      "Jalankan Step-by-Step Debugger",
      "Uji Otomatis 3 Skenario",
    ],
    warnaaksen: "border-amber-400/60 bg-amber-950/20",
  },
  {
    id: "chaos_webhook_tinyml_docx",
    kategori: "AIoT, Mesh & Laporan",
    badge: "FITUR AIoT #8–#10",
    judulFitur:
      "Chaos 10-Node Self-Healing Mesh, Smartphone Webhook, TinyML AI & Ekspor .DOCX",
    deskripsiLengkap:
      "Simulasikan gangguan cuaca badai & node mati pada jaringan 10-Node ESP-NOW, terima notifikasi darurat di layar HP virtual (Telegram/WhatsApp), jalankan inferensi TinyML Edge AI di ESP32, dan unduh Laporan Resmi Praktikum berformat Microsoft Word (.docx).",
    caraPakaiSingkat: [
      "Buka panel '🚀 Fitur Lanjutan Tahap 2' di bagian bawah untuk mematikan node mesh, mengirim chat ke HP virtual, atau menguji skor TinyML AI.",
      "Klik tombol biru '📄 Unduh Laporan Praktikum (.docx)' untuk mencetak laporan lengkap siap kumpul.",
    ],
    kataKunciTargetDom: [
      "Fitur Lanjutan Tahap 2: Chaos Mesh Injection",
      "1. Chaos & Self-Healing Mesh",
    ],
    warnaaksen: "border-purple-500/60 bg-purple-950/20",
  },
];

// ============================================================================
// 2. DAFTAR LANGKAH TUR SPOTLIGHT KONTEKSTUAL (TAB 1 STUDIO & TAB 2 AKADEMI)
// ============================================================================
const TUR_SPOTLIGHT_TAB_1_STUDIO: LangkahSpotlightCoachmark[] = [
  {
    langkah: 1,
    badgeArea: "AREA 1 • MONITOR SINKRONISASI KODE & CLOUD",
    judul: "1. Status Sinkronisasi Kode C++ ➔ Rangkaian ➔ MQTT & Blynk",
    isi: "Kotak yang sedang berkedip ini memantau apakah Pin GPIO, Wi-Fi HibahIlmu-Guest, Broker MQTT, dan Virtual Pin Blynk sudah dideklarasikan dengan benar di dalam kodingan Anda.",
    tipsPraktis:
      "Pastikan keempat indikator di kotak ini menyala hijau/biru agar rangkaian dan dashboard bekerja sinkron!",
    kataKunciElemenDom: [
      "MESIN SINKRONISASI KODINGAN C++",
      "1. Pin GPIO di Kodingan:",
    ],
  },
  {
    langkah: 2,
    badgeArea: "AREA 2 • INJEKTOR KODE & LIVE MQTT BROKER",
    judul: "2. Suntikkan Snippet Cepat & Uji Lalu Lintas Paket MQTT",
    isi: "Di area ini Anda bisa langsung menyuntikkan blok kode Wi-Fi, MQTT Publish, atau Blynk Virtual Pin dengan 1 klik, sekaligus menguji pengiriman payload JSON secara real-time di Live MQTT Broker Inspector!",
    tipsPraktis:
      "Klik tombol 'Publish dari ESP32 ke Dashboard' atau 'Uji Efek Korsleting' untuk melihat simulasi langsung.",
    kataKunciElemenDom: [
      "1. Suntikkan Blok Kode Cepat ke Editor Studio:",
      "2. Live MQTT Broker Inspector",
    ],
  },
  {
    langkah: 3,
    badgeArea: "AREA 3 • ALAT UKUR LAB VIRTUAL STUDIO",
    judul: "3. Multimeter Digital, Osiloskop PWM, Serial Plotter & Baterai 18650",
    isi: "Saat merakit proyek kreasi bebas, gunakan panel ini untuk mengukur voltase & arus (mA), memantau gelombang PWM di Osiloskop, melihat grafik multi-sensor di Serial Plotter, dan menghitung masa pakai baterai 18650.",
    tipsPraktis:
      "Pilih pin yang ingin diukur pada dropdown 'Probe Merah (+)' atau klik tab '2. Live Serial Plotter'.",
    kataKunciElemenDom: [
      "Instrumen Laboratorium Virtual",
      "1. Multimeter & Osiloskop PWM",
    ],
  },
  {
    langkah: 4,
    badgeArea: "AREA 4 • CHAOS MESH, WEBHOOK HP & TINYML AI",
    judul: "4. Uji Ketahanan 10-Node Mesh, Notifikasi HP & TinyML Edge AI",
    isi: "Di kotak ini Anda dapat mematikan node secara paksa untuk menguji Self-Healing Mesh, mengirim alert darurat ke layar Smartphone Telegram/WhatsApp virtual, dan menjalankan klasifikasi TinyML Edge AI.",
    tipsPraktis:
      "Klik tombol '📄 Unduh Dokumentasi Proyek Studio (.docx)' di atas untuk mencetak laporan Word otomatis!",
    kataKunciElemenDom: [
      "Fitur Lanjutan Tahap 2: Chaos Mesh Injection",
      "1. Chaos & Self-Healing Mesh",
    ],
  },
  {
    langkah: 5,
    badgeArea: "AREA 5 • TEMPLATE PROYEK & DENAH RUANGAN",
    judul: "5. Muat 7 Proyek Jadi & Denah Ruangan Fisik (Packet Tracer Mode)",
    isi: "Anda bisa memuat 7 contoh proyek industri siap pakai (Smart Door Lock, Greenhouse, Pemadam Api, hingga Triple-MCU) dan mengatur penempatan sensor di dalam Denah Ruangan Gedung!",
    tipsPraktis:
      "Klik salah satu kartu 'Muat Template Ini' untuk langsung memuat rangkaian beserta kode lengkapnya.",
    kataKunciElemenDom: [
      "7 TUTORIAL & CONTOH RANGKAIAN PROJECT JADI",
      "PHYSICAL PACKET TRACER MODE",
    ],
  },
  {
    langkah: 6,
    badgeArea: "AREA 6 • GUDANG 48 KOMPONEN STUDIO",
    judul: "6. Gudang 48 Komponen (Tarik Bebas ke Meja Kanvas Studio)",
    isi: "Kotak Gudang Komponen yang sedang berkedip ini berisi 48 perangkat (ESP32, Arduino Uno, STM32, Sensor NPK, GPS, Relay, Pompa, Servo). Tarik (Drag) komponen apa saja ke meja kanvas di bawahnya!",
    tipsPraktis:
      "Gunakan tab kategori atau kotak pencarian untuk menemukan sensor yang Anda butuhkan dengan cepat.",
    kataKunciElemenDom: [
      "GUDANG KOMPONEN (48 ITEM)",
      "Cari NPK, Pompa, RFID",
    ],
  },
];

const TUR_SPOTLIGHT_TAB_2_AKADEMI: LangkahSpotlightCoachmark[] = [
  {
    langkah: 1,
    badgeArea: "AREA 1 • BAHASA PEMROGRAMAN & MODE LATIHAN",
    judul: "1. Pilih Bahasa (C++ / MicroPython) & Mode Terpandu vs Latihan Mandiri",
    isi: "Pada header yang sedang disorot ini, Anda bebas berganti antara bahasa ⚡ C++ Arduino (sketch.ino) dan 🐍 MicroPython (main.py). Gunakan '👁️ Mode Terpandu' untuk belajar dengan bantuan berkedip, atau klik '🎯 Latihan Mandiri (Pin Baru!)' untuk ujian studi kasus dengan alokasi Pin GPIO baru!",
    tipsPraktis:
      "Di bawahnya Anda juga bisa memilih Bab 1 s.d. Bab 5 serta Level 1 s.d. Level 15/20.",
    kataKunciElemenDom: [
      "Akademi IoT HibahIlmu (C++ & MicroPython)",
      "Latihan Mandiri (Pin Baru!)",
    ],
  },
  {
    langkah: 2,
    badgeArea: "AREA 2 • GUDANG 48 KOMPONEN BERKEDIP",
    judul: "2. Tarik Komponen yang Berkedip dari Gudang ke Slot Kanvas",
    isi: "Perhatikan kotak Gudang Komponen yang sedang disorot ini! Pada Mode Terpandu, kartu komponen yang wajib Anda ambil akan menyala berkedip kuning. Tarik (Drag) atau klik kartu tersebut lalu masukkan ke Slot #1 s.d. Slot #N di kanvas bawah.",
    tipsPraktis:
      "Setiap slot hanya menerima komponen yang sesuai dengan instruksi modul agar perakitan akurat.",
    kataKunciElemenDom: [
      "Gudang Komponen (Tarik Komponen yang Berkedip",
      "Gudang Komponen — Mode Latihan Mandiri",
    ],
  },
  {
    langkah: 3,
    badgeArea: "AREA 3 • KANVAS MULTI-SLOT, KABEL SIKU & INTERAKSI FISIK",
    judul: "3. Pasang Kabel Siku-Siku 90° & Tekan Tombol / Sensor Secara Fisik",
    isi: "Di meja kanvas ini, klik titik kaki pin ke-1 lalu klik titik kaki ke-2 untuk menyambung kabel siku-siku. Saat simulasi dijalankan (RUNNING), aktuator TIDAK langsung menyala sendiri—Anda wajib menekan tombol Push Button atau menggeser slider Potensio/LDR/Suhu di kanvas agar aktuator bekerja!",
    tipsPraktis:
      "Jika salah menyambung 1 kabel, cukup klik bulatan '✕' di tengah kabel tersebut untuk menghapus 1 kabel itu saja.",
    kataKunciElemenDom: [
      "Slot #1: ESP32 DevKit V1",
      "Kabel Siku-Siku Terpasang",
    ],
  },
  {
    langkah: 4,
    badgeArea: "AREA 4 • MULTIMETER, OSILOSKOP PWM & SERIAL PLOTTER",
    judul: "4. Ukur Tegangan/Arus, Pantau Osiloskop PWM & Umur Baterai 18650",
    isi: "Panel instrumen laboratorium ini mendeteksi korsleting (3V3 ke GND) atau LED putus tanpa resistor. Anda dapat menempelkan Probe Multimeter ke pin mana pun, melihat grafik gelombang PWM di Osiloskop, grafik Serial Plotter, hingga menguji penghematan baterai Deep Sleep.",
    tipsPraktis:
      "Di bawah panel ini juga tersedia tombol '🐢 Step-by-Step Debugger', '🧪 Uji 3 Skenario', dan '📄 Unduh Laporan (.docx)'.",
    kataKunciElemenDom: [
      "Instrumen Laboratorium Virtual",
      "1. Multimeter & Osiloskop PWM",
    ],
  },
  {
    langkah: 5,
    badgeArea: "AREA 5 • ASISTEN KODE BARIS DEMI BARIS & EDITOR",
    judul: "5. Checklist Kode Real-Time, '+ Sisipkan Baris' & Eksekusi Program",
    isi: "Panel kiri menampilkan daftar baris kode yang 100% sinkron dengan pemeriksa (otomatis berubah hijau saat Anda mengetiknya, atau klik '+ Sisipkan Baris Ini' jika kesulitan). Setelah lengkap, klik tombol hijau '1. Periksa Semua Kaki & Jalankan' di bawah editor kanan!",
    tipsPraktis:
      "Jika bingung, Anda juga bisa mengklik tombol '👁️ Intip Kode Utuh' atau '✨ Bantuan Rakit & Kode'.",
    kataKunciElemenDom: [
      "Editor C++ — Level",
      "Editor MicroPython — Level",
      "1. Periksa Semua Kaki & Jalankan",
    ],
  },
];

// ============================================================================
// FUNGSI PENCARI ELEMEN DOM CERDAS (MENCARI CONTAINER KOTAK TERDEKAT DI LAYAR)
// ============================================================================
function cariElemenTargetDiLayar(kataKunciList: string[]): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const kandidatTags = Array.from(
    document.querySelectorAll("div, section, h2, h3, h4, span, button")
  ) as HTMLElement[];

  for (const kw of kataKunciList) {
    const kwLower = kw.toLowerCase();
    for (const el of kandidatTags) {
      // Abaikan elemen di dalam modal/overlay tur itu sendiri
      if (el.closest("[data-tour-overlay='true']")) continue;

      const teksLangsung = (el.textContent || "").trim().toLowerCase();
      if (teksLangsung.includes(kwLower) && teksLangsung.length < 600) {
        // Cari container kartu/kotak pembungkus terdekat yang memiliki border/background rapi
        const cardContainer =
          (el.closest(
            ".rounded-3xl, .rounded-2xl"
          ) as HTMLElement | null) || el;
        const rect = cardContainer.getBoundingClientRect();
        if (rect.width > 120 && rect.height > 40 && rect.height < 950) {
          return cardContainer;
        }
      }
    }
  }
  return null;
}

export const HibahIlmuIotGuideBannerAndModal: React.FC = () => {
  const [bukaModalPanduan, setBukaModalPanduan] = useState<boolean>(false);
  const [bukaTurSpotlight, setBukaTurSpotlight] = useState<boolean>(false);
  const [modeTabTur, setModeTabTur] = useState<"tab1_studio" | "tab2_akademi">(
    "tab2_akademi"
  );
  const [indeksTur, setIndeksTur] = useState<number>(0);
  const [filterKategori, setFilterKategori] = useState<string>("Semua");

  // Koordinat kotak elemen yang sedang disorot di layar (Spotlight Box)
  const [kotakSorot, setKotakSorot] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const daftarLangkahAktif =
    modeTabTur === "tab1_studio"
      ? TUR_SPOTLIGHT_TAB_1_STUDIO
      : TUR_SPOTLIGHT_TAB_2_AKADEMI;

  const langkahSaatIni =
    daftarLangkahAktif[indeksTur] || daftarLangkahAktif[0];

  // Deteksi apakah user sedang di Tab 1 (Studio) atau Tab 2 (Akademi) lalu mulai tur
  const mulaiTurKontekstual = (
    paksaMode?: "tab1_studio" | "tab2_akademi"
  ) => {
    if (paksaMode) {
      setModeTabTur(paksaMode);
    } else if (typeof document !== "undefined") {
      const adaAkademiDiLayar = Boolean(
        cariElemenTargetDiLayar([
          "Akademi IoT HibahIlmu",
          "1. Periksa Semua Kaki & Jalankan",
        ])
      );
      setModeTabTur(adaAkademiDiLayar ? "tab2_akademi" : "tab1_studio");
    }
    setIndeksTur(0);
    setBukaTurSpotlight(true);
  };

  // Fungsi untuk menggulir layar ke elemen target dan menghitung kotak sorotan berkedip
  const sinkronkanSorotanElemen = useCallback(
    (lakukanScroll: boolean) => {
      if (!bukaTurSpotlight || !langkahSaatIni) return;
      const el = cariElemenTargetDiLayar(langkahSaatIni.kataKunciElemenDom);
      if (!el) {
        setKotakSorot(null);
        return;
      }

      if (lakukanScroll) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const hitungUlangRect = () => {
        const r = el.getBoundingClientRect();
        const pad = 8;
        setKotakSorot({
          top: Math.max(8, r.top - pad),
          left: Math.max(8, r.left - pad),
          width: Math.min(window.innerWidth - 16, r.width + pad * 2),
          height: Math.min(window.innerHeight - 16, r.height + pad * 2),
        });
      };

      hitungUlangRect();
      const t1 = setTimeout(hitungUlangRect, 350);
      const t2 = setTimeout(hitungUlangRect, 650);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    [bukaTurSpotlight, langkahSaatIni]
  );

  useEffect(() => {
    if (!bukaTurSpotlight) return;
    sinkronkanSorotanElemen(true);

    const onUpdatePosisi = () => sinkronkanSorotanElemen(false);
    window.addEventListener("scroll", onUpdatePosisi, { passive: true });
    window.addEventListener("resize", onUpdatePosisi);
    return () => {
      window.removeEventListener("scroll", onUpdatePosisi);
      window.removeEventListener("resize", onUpdatePosisi);
    };
  }, [bukaTurSpotlight, indeksTur, modeTabTur, sinkronkanSorotanElemen]);

  // Fungsi untuk langsung menyorot lokasi fitur tertentu dari Katalog Fitur
  const sorotFiturDariKatalog = (kataKunciDom: string[]) => {
    setBukaModalPanduan(false);
    setTimeout(() => {
      const el = cariElemenTargetDiLayar(kataKunciDom);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add(
          "ring-4",
          "ring-amber-400",
          "animate-pulse",
          "transition-all"
        );
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-amber-400", "animate-pulse");
        }, 4500);
      }
    }, 200);
  };

  const daftarFiturTampil = KATALOG_FITUR_HIBAHILMU_IOT.filter(
    (f) => filterKategori === "Semua" || f.kategori === filterKategori
  );

  // Hitung posisi Popover Coachmark agar muncul tepat di dekat kotak yang disorot (di bawah atau di atasnya)
  let popoverTop = 120;
  let popoverLeft = 24;
  let panahDiAtas = true;

  if (typeof window !== "undefined" && kotakSorot) {
    const tinggiPopoverEstimasi = 245;
    const ruangDiBawah =
      window.innerHeight - (kotakSorot.top + kotakSorot.height);

    if (ruangDiBawah >= tinggiPopoverEstimasi + 20) {
      // Taruh tepat di bawah kotak yang berkedip
      popoverTop = kotakSorot.top + kotakSorot.height + 16;
      panahDiAtas = true;
    } else if (kotakSorot.top >= tinggiPopoverEstimasi + 20) {
      // Taruh tepat di atas kotak yang berkedip
      popoverTop = Math.max(16, kotakSorot.top - tinggiPopoverEstimasi - 14);
      panahDiAtas = false;
    } else {
      // Jika kotak sangat besar (misal seluruh kanvas), taruh di pojok kanan atas/bawah area tersebut
      popoverTop = Math.max(20, Math.min(window.innerHeight - 270, kotakSorot.top + 24));
      panahDiAtas = true;
    }

    popoverLeft = Math.max(
      16,
      Math.min(
        window.innerWidth - 440,
        kotakSorot.left + Math.min(60, kotakSorot.width / 6)
      )
    );
  }

  return (
    <>
      {/* =================================================================== */}
      {/* BANNER HIGHLIGHT BERKEDIP KHUSUS PEMULA DI ATAS SIMULATOR           */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-black animate-bounce shrink-0 shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase animate-pulse">
                ✨ PANDUAN INTERAKTIF HIBAHILMU IOT SIMULATOR (TAB 1 &amp; TAB 2)
              </span>
              <span className="text-xs font-bold text-emerald-300">
                Sorotan Langsung ke Komponen • Multi-Pin Realistis • C++ &amp; MicroPython
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Bingung Mulai dari Mana? Jalankan Tur Sorotan Area (Spotlight Coachmark)!
            </h3>
            <p className="text-xs text-slate-300">
              Kotak panduan akan muncul tepat di samping area yang dijelaskan dan membuat komponen/fitur tersebut berkedip secara langsung!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => mulaiTurKontekstual()}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl ring-4 ring-amber-400/30 animate-pulse"
          >
            <Crosshair className="w-4 h-4" /> 🎯 Mulai Tur Sorotan Area (Tab Ini)
          </button>

          <button
            type="button"
            onClick={() => setBukaModalPanduan(true)}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <BookOpen className="w-4 h-4" /> 📖 Katalog Fitur &amp; Cari Lokasi
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* OVERLAY 1: SPOTLIGHT COACHMARK KEKINIAN (MENGOTAKKAN AREA & POPUP   */}
      {/*            MUNCUL TEPAT DI SEKITAR DAERAH YANG SEDANG BERKEDIP!)    */}
      {/* =================================================================== */}
      {bukaTurSpotlight && (
        <div
          data-tour-overlay="true"
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Kotak Sorotan Berlubang (Cutout Spotlight) + Bingkai Berkedip pada Area Target */}
          {kotakSorot ? (
            <div
              style={{
                position: "fixed",
                top: kotakSorot.top,
                left: kotakSorot.left,
                width: kotakSorot.width,
                height: kotakSorot.height,
                boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.78)",
              }}
              className="rounded-3xl border-4 border-amber-400 ring-8 ring-emerald-400/40 animate-pulse transition-all duration-300 pointer-events-none"
            >
              {/* Badge Penunjuk di Sudut Kiri Atas Kotak yang Sedang Disorot */}
              <div className="absolute -top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 👇 AREA INI YANG SEDANG DIJELASKAN ({langkahSaatIni.badgeArea})
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-slate-950/75" />
          )}

          {/* Kartu Popover Kekinian di Sekitar Daerah yang Disorot */}
          <div
            style={{
              position: "fixed",
              top: popoverTop,
              left: popoverLeft,
            }}
            className="w-[92vw] max-w-[425px] bg-slate-900/95 backdrop-blur-md border-2 border-emerald-400 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-3.5 pointer-events-auto transition-all duration-300"
          >
            {/* Segitiga Panah Penunjuk ke Area yang Disorot */}
            {kotakSorot && (
              <div
                className={`w-4 h-4 bg-slate-900 border-emerald-400 transform rotate-45 absolute left-10 ${
                  panahDiAtas
                    ? "-top-2.5 border-l-2 border-t-2"
                    : "-bottom-2.5 border-r-2 border-b-2"
                }`}
              />
            )}

            {/* Baris Pilih Tab Tur (Tab 1 Studio vs Tab 2 Akademi) & Tombol Tutup */}
            <div className="flex justify-between items-center gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setModeTabTur("tab1_studio");
                    setIndeksTur(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                    modeTabTur === "tab1_studio"
                      ? "bg-emerald-400 text-slate-950 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🛠️ Tur Tab 1 (Studio)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModeTabTur("tab2_akademi");
                    setIndeksTur(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                    modeTabTur === "tab2_akademi"
                      ? "bg-amber-400 text-slate-950 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🎓 Tur Tab 2 (Akademi)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBukaTurSpotlight(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Konten Penjelasan Langkah Saat Ini */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black text-amber-300">
                <span>{langkahSaatIni.badgeArea}</span>
                <span>
                  LANGKAH {indeksTur + 1} / {daftarLangkahAktif.length}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {langkahSaatIni.judul}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {langkahSaatIni.isi}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-[11px] text-emerald-300">
                💡 <strong>Tips Praktis:</strong> {langkahSaatIni.tipsPraktis}
              </div>
            </div>

            {/* Navigasi Langkah Tur */}
            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                disabled={indeksTur === 0}
                onClick={() => setIndeksTur((i) => Math.max(0, i - 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>

              <div className="flex gap-1.5">
                {daftarLangkahAktif.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndeksTur(i)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      i === indeksTur
                        ? "w-6 bg-amber-400"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              {indeksTur < daftarLangkahAktif.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setIndeksTur((i) => i + 1)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
                >
                  Lanjut Sorot <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBukaTurSpotlight(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Selesai!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: KATALOG FITUR LENGKAP + TOMBOL "SOROT AREA INI DI LAYAR"   */}
      {/* =================================================================== */}
      {bukaModalPanduan && (
        <div
          data-tour-overlay="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                    KATALOG INTERAKTIF HIBAHILMU IOT SIMULATOR
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                    Klik &quot;Sorot Area Ini di Layar&quot; untuk Melompat ke Fiturnya!
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Katalog Lengkap Fitur Simulator (Tab 1 Studio &amp; Tab 2 Akademi)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setBukaModalPanduan(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {[
                "Semua",
                "Dasar & Perakitan",
                "Bahasa & Latihan",
                "Instrumen Lab Virtual",
                "AIoT, Mesh & Laporan",
              ].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setFilterKategori(kat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    filterKategori === kat
                      ? "bg-emerald-400 text-slate-950 shadow"
                      : "bg-slate-950 text-slate-300 border border-slate-800"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {daftarFiturTampil.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 ${item.warnaaksen} space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-bold text-sky-300">
                        {item.kategori}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">
                      {item.judulFitur}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.deskripsiLengkap}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-xs">
                      <div className="font-bold text-amber-300">
                        👉 Cara Mencobanya:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-200 text-[11px]">
                        {item.caraPakaiSingkat.map((langkah, idx) => (
                          <li key={idx}>{langkah}</li>
                        ))}
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        sorotFiturDariKatalog(item.kataKunciTargetDom)
                      }
                      className="w-full py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/50 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <Crosshair className="w-3.5 h-3.5" /> 🎯 Sorot &amp; Kedipkan Area Fitur Ini di Layar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};