"use client";

import React, { useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  FileDown,
  Flame,
  Gauge,
  HelpCircle,
  Layers,
  LineChart,
  Play,
  Radio,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  Wrench,
  X,
  Zap,
} from "lucide-react";

export interface ItemKatalogFiturSimulator {
  id: string;
  kategori: "Dasar & Perakitan" | "Bahasa & Latihan" | "Instrumen Lab Virtual" | "AIoT, Mesh & Laporan";
  badge: string;
  judulFitur: string;
  deskripsiLengkap: string;
  caraPakaiSingkat: string[];
  warnaaksen: string;
}

// ============================================================================
// REGISTRI PUSAT PANDUAN FITUR HIBAHILMU IOT SIMULATOR
// (Wajib diperbarui setiap kali ada penambahan fitur baru!)
// ============================================================================
export const KATALOG_FITUR_HIBAHILMU_IOT: ItemKatalogFiturSimulator[] = [
  {
    id: "studio_sandbox_mqtt_blynk",
    kategori: "AIoT, Mesh & Laporan",
    badge: "FITUR STUDIO TAB 1",
    judulFitur: "Workbench Kreasi Bebas (Tab 1): Live MQTT Broker, Blynk Cloud & Denah Ruangan",
    deskripsiLengkap:
      "Setelah lulus dari Tab 2 (Akademi), gunakan Tab 1 (Studio Kanvas HibahIlmu IoT Simulator) untuk berkreasi bebas merakit proyek sendiri lengkap dengan Denah Ruangan Fisik, Konsol Broker MQTT (Publish/Subscribe JSON), Widget Blynk Virtual Pin, Multimeter, dan Ekspor Dokumentasi Proyek (.docx).",
    caraPakaiSingkat: [
      "Buka Tab '1. Studio Kanvas HibahIlmu IoT Simulator' di bagian kiri atas.",
      "Gunakan tombol '+ Suntikkan Blok Kode Cepat' untuk memasukkan template Wi-Fi HibahIlmu-Guest, MQTT Publish, atau Blynk Virtual Pin.",
      "Uji pengiriman payload JSON secara langsung pada panel '2. Live MQTT Broker Inspector' dan unduh dokumentasi proyek (.docx).",
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
    warnaaksen: "border-amber-500/60 bg-amber-950/20",
  },
  {
    id: "dual_language_cpp_py",
    kategori: "Bahasa & Latihan",
    badge: "FITUR INTI #3",
    judulFitur: "Dukungan Ganda: Bahasa C++ Arduino (sketch.ino) & MicroPython (main.py)",
    deskripsiLengkap:
      "Pelajari pemrograman sistem tertanam dalam dua bahasa industri sekaligus. Dilengkapi Asisten Checklist Baris Kode Real-Time dan tombol '+ Sisipkan Baris Ini' bagi pemula yang kesulitan mengetik sintaks.",
    caraPakaiSingkat: [
      "Gunakan tombol switcher '⚡ C++ Arduino' atau '🐍 MicroPython' di bagian kanan atas.",
      "Perhatikan kotak checklist di sebelah kiri editor yang berubah menjadi hijau (✓ SUDAH TEPAT) setiap kali baris kode diketik dengan benar.",
    ],
    warnaaksen: "border-sky-500/60 bg-sky-950/20",
  },
  {
    id: "mode_latihan_mandiri",
    kategori: "Bahasa & Latihan",
    badge: "FITUR INTI #4",
    judulFitur: "Mode Ujian Latihan Mandiri (Rotasi Pin GPIO Baru & Studi Kasus)",
    deskripsiLengkap:
      "Menguji pemahaman nyata tanpa bantuan garis berkedip. Sistem otomatis memindahkan kewajiban sambungan ke nomor Pin GPIO baru disertai narasi masalah lapangan dan 3 Clue bertahap.",
    caraPakaiSingkat: [
      "Klik tombol merah muda '🎯 Latihan Mandiri (Pin Baru!)' di header atas.",
      "Baca daftar perubahan nomor pin pada kotak studi kasus di kiri bawah, lalu rakit dan modifikasi kode sesuai pin baru tersebut.",
    ],
    warnaaksen: "border-rose-500/60 bg-rose-950/20",
  },
  {
    id: "korsleting_multimeter_osiloskop",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #5",
    judulFitur: "Detektor Korsleting/Komponen Gosong, Multimeter Digital & Osiloskop PWM",
    deskripsiLengkap:
      "Mendeteksi hubung-singkat (3V3 langsung ke GND) dan arus lebih pada LED tanpa resistor. Dilengkapi Multimeter Digital (Volt, mA, Ohm) serta layar Osiloskop untuk melihat gelombang kotak PWM Duty Cycle secara live.",
    caraPakaiSingkat: [
      "Buka panel '🔬 Instrumen Laboratorium Virtual' tepat di bawah kanvas.",
      "Pilih kaki pin yang ingin diukur pada dropdown 'Probe Merah (+)' untuk membaca tegangan dan melihat bentuk gelombang PWM.",
    ],
    warnaaksen: "border-indigo-500/60 bg-indigo-950/20",
  },
  {
    id: "serial_plotter_power_profiler",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #6",
    judulFitur: "Live Serial Plotter Multi-Variabel & Kalkulator Baterai 18650 (Deep Sleep)",
    deskripsiLengkap:
      "Menampilkan grafik pergerakan nilai Suhu, Gas PPM, Cahaya Lux, dan PWM secara real-time, serta menghitung konsumsi arus (mA) dan estimasi masa pakai baterai Li-Ion 18650 (2500 mAh) saat aktif vs mode Deep Sleep.",
    caraPakaiSingkat: [
      "Klik tab '2. Live Serial Plotter' lalu geser slider sensor untuk melihat kurva grafik bergerak.",
      "Klik tab '3. Kalkulator Baterai 18650' lalu klik '+ Sisipkan Kode Deep Sleep' untuk menghemat 99% daya baterai.",
    ],
    warnaaksen: "border-teal-500/60 bg-teal-950/20",
  },
  {
    id: "debugger_testbench_grader",
    kategori: "Instrumen Lab Virtual",
    badge: "FITUR LAB #7",
    judulFitur: "Step-by-Step Code Debugger (Lompatan ISR) & Automated 3-Scenario Testbench",
    deskripsiLengkap:
      "Menyorot baris kode yang sedang dieksekusi CPU secara perlahan (termasuk melompat ke fungsi IRAM_ATTR saat Interrupt ditekan) dan menguji kelayakan rangkaian secara otomatis dalam 3 skenario beruntun.",
    caraPakaiSingkat: [
      "Klik '🐢 Jalankan Step-by-Step Debugger' untuk melihat sorotan kuning baris demi baris di editor.",
      "Klik '🧪 Uji Otomatis 3 Skenario (Grader)' untuk memvalidasi kondisi Aktif, Idle, dan Keamanan Arus sekaligus.",
    ],
    warnaaksen: "border-amber-400/60 bg-amber-950/20",
  },
  {
    id: "chaos_webhook_tinyml_docx",
    kategori: "AIoT, Mesh & Laporan",
    badge: "FITUR AIoT #8–#10",
    judulFitur: "Chaos 10-Node Self-Healing Mesh, Smartphone Webhook, TinyML AI & Ekspor .DOCX",
    deskripsiLengkap:
      "Simulasikan gangguan cuaca badai & node mati pada jaringan 10-Node ESP-NOW, terima notifikasi darurat di layar HP virtual (Telegram/WhatsApp), jalankan inferensi TinyML Edge AI di ESP32, dan unduh Laporan Resmi Praktikum berformat Microsoft Word (.docx).",
    caraPakaiSingkat: [
      "Buka panel '🚀 Fitur Lanjutan Tahap 2' di bagian bawah untuk mematikan node mesh, mengirim chat ke HP virtual, atau menguji skor TinyML AI.",
      "Klik tombol biru '📄 Unduh Laporan Praktikum (.docx)' untuk mencetak laporan lengkap siap kumpul.",
    ],
    warnaaksen: "border-purple-500/60 bg-purple-950/20",
  },
];

const LANGKAH_TUR_PEMULA = [
  {
    langkah: 1,
    judul: "Langkah 1: Pilih Bahasa (C++ / MicroPython) & Mode Belajar",
    isi: "Di bagian atas halaman, Anda bebas memilih bahasa C++ Arduino (sketch.ino) atau MicroPython (main.py). Untuk pemula, gunakan '👁️ Mode Terpandu' agar komponen dan pin yang harus dipasang menyala berkedip kuning. Jika sudah mahir, klik '🎯 Latihan Mandiri' untuk mencoba soal dengan Pin GPIO baru!",
  },
  {
    langkah: 2,
    judul: "Langkah 2: Tarik Komponen Satu per Satu dari Gudang 48 Perangkat",
    isi: "Perhatikan kartu komponen yang berkedip kuning di Gudang Komponen. Tarik (Drag) atau klik komponen tersebut lalu jatuhkan ke kotak Slot #1 (ESP32 di kiri) hingga Slot #2..#10 di kanvas bawah.",
  },
  {
    langkah: 3,
    judul: "Langkah 3: Hubungkan Semua Kaki Pin dengan Kabel Siku-Siku",
    isi: "Setiap komponen memiliki 2 titik kaki pin nyata. Klik titik kaki ke-1 yang berkedip, lalu klik titik kaki ke-2 pasangannya. Jika salah memasang 1 kabel, cukup klik tanda '✕' di tengah kabel tersebut untuk menghapus 1 kabel itu saja.",
  },
  {
    langkah: 4,
    judul: "Langkah 4: Ketik Kode dengan Asisten Baris & Jalankan Simulasi",
    isi: "Lihat panel kiri bawah untuk melihat baris kode yang wajib diketik (atau klik '+ Sisipkan Baris Ini'). Setelah lengkap, klik tombol hijau '1. Periksa Semua Kaki & Jalankan', lalu tekan tombol/putar sensor di kanvas agar aktuator bekerja!",
  },
  {
    langkah: 5,
    judul: "Langkah 5: Gunakan Multimeter, Serial Plotter, AIoT & Unduh Laporan .DOCX",
    isi: "Setelah simulasi berjalan, amati tegangan di Multimeter, gelombang PWM di Osiloskop, grafik di Serial Plotter, notifikasi HP Telegram/WhatsApp, hingga mengunduh Laporan Praktikum (.docx) otomatis!",
  },
];

export const HibahIlmuIotGuideBannerAndModal: React.FC = () => {
  const [bukaModalPanduan, setBukaModalPanduan] = useState<boolean>(false);
  const [bukaTurLangkah, setBukaTurLangkah] = useState<boolean>(false);
  const [indeksTur, setIndeksTur] = useState<number>(0);
  const [filterKategori, setFilterKategori] = useState<string>("Semua");

  const daftarFiturTampil = KATALOG_FITUR_HIBAHILMU_IOT.filter(
    (f) => filterKategori === "Semua" || f.kategori === filterKategori
  );

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
                ✨ BARU PERTAMA KALI MENGGUNAKAN HIBAHILMU IOT SIMULATOR?
              </span>
              <span className="text-xs font-bold text-emerald-300">
                100% Orisinal • Multi-Pin Realistis • C++ &amp; MicroPython • Virtual Lab
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Pusat Panduan Lengkap &amp; Tur Interaktif HibahIlmu IoT Simulator
            </h3>
            <p className="text-xs text-slate-300">
              Pelajari cara merakit multi-komponen, memasang kabel siku-siku, menguji sensor interaktif, memakai Multimeter/Osiloskop, hingga mengunduh Laporan Word (.docx)!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setIndeksTur(0);
              setBukaTurLangkah(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl ring-4 ring-amber-400/30 animate-pulse"
          >
            <Sparkles className="w-4 h-4" /> 🚀 Mulai Tur Panduan Pemula (5 Langkah)
          </button>

          <button
            type="button"
            onClick={() => setBukaModalPanduan(true)}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <BookOpen className="w-4 h-4" /> 📖 Buka Katalog Semua Fitur Simulator
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: TUR SOROTAN 5 LANGKAH CEPAT UNTUK PEMULA                   */}
      {/* =================================================================== */}
      {bukaTurLangkah && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                TUR PEMULA HIBAHILMU IOT • LANGKAH {indeksTur + 1} DARI{" "}
                {LANGKAH_TUR_PEMULA.length}
              </span>
              <button
                type="button"
                onClick={() => setBukaTurLangkah(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                {LANGKAH_TUR_PEMULA[indeksTur].judul}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {LANGKAH_TUR_PEMULA[indeksTur].isi}
              </p>
            </div>

            {/* Indikator Titik Langkah */}
            <div className="flex justify-center gap-2">
              {LANGKAH_TUR_PEMULA.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i === indeksTur
                      ? "w-8 bg-amber-400"
                      : "w-2.5 bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                disabled={indeksTur === 0}
                onClick={() => setIndeksTur((i) => Math.max(0, i - 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>

              {indeksTur < LANGKAH_TUR_PEMULA.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setIndeksTur((i) => i + 1)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
                >
                  Langkah Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBukaTurLangkah(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Selesai! Mulai Praktikum
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: HALAMAN ENSIKLOPEDIA & PANDUAN LENGKAP SEMUA FITUR         */}
      {/* =================================================================== */}
      {bukaModalPanduan && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                    BUKU PANDUAN RESMI PENGGUNA
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                    Total {KATALOG_FITUR_HIBAHILMU_IOT.length} Kelompok Fitur Utama
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Panduan Lengkap Fitur HibahIlmu IoT Simulator &amp; Virtual Lab
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

            {/* Filter Kategori Fitur */}
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

            {/* Daftar Lengkap Fitur & Cara Menggunakannya */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {daftarFiturTampil.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 ${item.warnaaksen} space-y-2.5 flex flex-col justify-between`}
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
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-400">
                📌 Panduan ini otomatis diperbarui setiap kali fitur baru ditambahkan ke HibahIlmu IoT Simulator.
              </span>
              <button
                type="button"
                onClick={() => setBukaModalPanduan(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
              >
                Tutup Panduan &amp; Mulai Mencoba
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};