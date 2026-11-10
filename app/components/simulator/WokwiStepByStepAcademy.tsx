"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Sparkles,
  Cpu,
  Code2,
  AlertCircle,
  RotateCcw,
  Award,
  Lightbulb,
  Lock,
  Wrench,
  Zap,
} from "lucide-react";
import {
  KURIKULUM_8_LEVEL_IOT,
  LessonStepIoT,
} from "./wokwiCurriculumData";

// ============================================================================
// KONFIGURASI TUGAS PEMASANGAN KABEL PIN PER LEVEL (WAJIB BENAR AGAR BERHASIL!)
// ============================================================================
interface KonfigurasiWiringLevel {
  labelKomponen1: string;
  opsiPin1: string[];
  pinBenar1: string;
  labelKomponen2?: string;
  opsiPin2?: string[];
  pinBenar2?: string;
}

const ATURAN_WIRING_PER_LEVEL: Record<number, KonfigurasiWiringLevel> = {
  1: {
    labelKomponen1: "Kaki Positif (Anoda) Lampu LED Merah",
    opsiPin1: ["Pilih Pin ESP32...", "GPIO 2", "GPIO 15", "GPIO 34 (Input Only)", "GND"],
    pinBenar1: "GPIO 2",
  },
  2: {
    labelKomponen1: "Pin AO (Output Analog) Sensor Cahaya LDR",
    opsiPin1: ["Pilih Pin ESP32...", "GPIO 2", "GPIO 34", "GPIO 5", "GND"],
    pinBenar1: "GPIO 34",
    labelKomponen2: "Pin IN Modul Relay Lampu Jalan",
    opsiPin2: ["Pilih Pin ESP32...", "GPIO 26", "GPIO 34", "3V3", "GND"],
    pinBenar2: "GPIO 26",
  },
  3: {
    labelKomponen1: "Kabel Sinyal PWM Motor Servo SG90",
    opsiPin1: ["Pilih Pin ESP32...", "GPIO 13", "GPIO 34", "GND"],
    pinBenar1: "GPIO 13",
    labelKomponen2: "Pin IN Relay Kunci Solenoid 12V",
    opsiPin2: ["Pilih Pin ESP32...", "GPIO 27", "GPIO 13", "GND"],
    pinBenar2: "GPIO 27",
  },
  4: {
    labelKomponen1: "Pin Relay Pompa Air Irigasi",
    opsiPin1: ["Pilih Pin ESP32...", "GPIO 25", "GPIO 35", "GND"],
    pinBenar1: "GPIO 25",
    labelKomponen2: "Pin Relay Kipas Pendingin Greenhouse",
    opsiPin2: ["Pilih Pin ESP32...", "GPIO 33", "GPIO 15", "GND"],
    pinBenar2: "GPIO 33",
  },
  5: {
    labelKomponen1: "Pin AO Sensor Gas & Asap MQ-2",
    opsiPin1: ["Pilih Pin ESP32...", "GPIO 32", "GPIO 2", "GND"],
    pinBenar1: "GPIO 32",
    labelKomponen2: "Pin Sirine Buzzer & Pompa Pemadam",
    opsiPin2: ["Pilih Pin ESP32...", "GPIO 19 & GPIO 25", "GPIO 32", "GND"],
    pinBenar2: "GPIO 19 & GPIO 25",
  },
  6: {
    labelKomponen1: "Jalur Kabel Komunikasi UART2 Antar-ESP32",
    opsiPin1: [
      "Pilih Sambungan Kabel...",
      "TX2 (GPIO 17) ➔ RX2 (GPIO 16) Menyilang",
      "TX2 (GPIO 17) ➔ TX2 (GPIO 17) Sejajar (Salah)",
      "GND ➔ VCC",
    ],
    pinBenar1: "TX2 (GPIO 17) ➔ RX2 (GPIO 16) Menyilang",
  },
  7: {
    labelKomponen1: "Kabel Sensor Pupuk NPK RS485 & Baterai Li-Ion",
    opsiPin1: [
      "Pilih Sambungan Pin...",
      "NPK RS485 + ADC Baterai GPIO 35",
      "Pin Reset EN",
      "Tanpa Kabel Sensor",
    ],
    pinBenar1: "NPK RS485 + ADC Baterai GPIO 35",
    labelKomponen2: "Modul Satelit GPS NEO-6M",
    opsiPin2: ["Pilih Pin GPS...", "UART GPS (Pin 4 & 5)", "Pin GND Saja"],
    pinBenar2: "UART GPS (Pin 4 & 5)",
  },
  8: {
    labelKomponen1: "Mode Radio Transceiver Node 1 s.d. Node 9",
    opsiPin1: [
      "Pilih Mode Jaringan...",
      "WIFI_STA + ESP-NOW Multi-Hop Mesh",
      "Bluetooth Classic",
      "Radio Mati (OFF)",
    ],
    pinBenar1: "WIFI_STA + ESP-NOW Multi-Hop Mesh",
    labelKomponen2: "Peran Node #10 (Ujung Jaringan)",
    opsiPin2: [
      "Pilih Peran Node 10...",
      "Edge Gateway Wi-Fi Pengirim ke Dashboard Web",
      "Node Tidur (Deep Sleep)",
    ],
    pinBenar2: "Edge Gateway Wi-Fi Pengirim ke Dashboard Web",
  },
};

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const materiAktif: LessonStepIoT = KURIKULUM_8_LEVEL_IOT[indeksLevel];
  const aturanWiring = ATURAN_WIRING_PER_LEVEL[materiAktif.level];

  // State Pemasangan Kabel Pin oleh Siswa (Awalnya sudah diset benar untuk kemudahan, tapi bisa salah jika diubah/diuji)
  const [pinTerpilih1, setPinTerpilih1] = useState<string>(
    ATURAN_WIRING_PER_LEVEL[1].pinBenar1
  );
  const [pinTerpilih2, setPinTerpilih2] = useState<string>(
    ATURAN_WIRING_PER_LEVEL[1].pinBenar2 || ""
  );

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    KURIKULUM_8_LEVEL_IOT[0].kodeTemplateAwal
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// 1. Pastikan kabel komponen di atas terpasang ke Pin yang benar.\n// 2. Ketik program C++ sesuai instruksi, lalu klik 'Periksa Rangkaian & Jalankan Program'."
  );

  // State detak animasi visual rangkaian (HANYA bergerak jika statusVerifikasi === "lulus"!)
  const [detakSimulasi, setDetakSimulasi] = useState<number>(0);
  const [nilaiUjiSensorKanvas, setNilaiUjiSensorKanvas] = useState<number>(220);

  useEffect(() => {
    if (statusVerifikasi !== "lulus") return;
    const timer = setInterval(() => {
      setDetakSimulasi((d) => d + 1);
    }, 700);
    return () => clearInterval(timer);
  }, [statusVerifikasi]);

  const pindahKeLevel = (idxBaru: number) => {
    const target = KURIKULUM_8_LEVEL_IOT[idxBaru];
    if (!target) return;
    const wiringBaru = ATURAN_WIRING_PER_LEVEL[target.level];
    setIndeksLevel(idxBaru);
    setPinTerpilih1(wiringBaru.pinBenar1);
    setPinTerpilih2(wiringBaru.pinBenar2 || "");
    setKodeKetikanUser(target.kodeTemplateAwal);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Siap mengerjakan ${target.badgeLevel}: ${target.judulMateri}\n// Lengkapi kode di atas lalu klik 'Periksa Rangkaian & Jalankan Program'!`
    );
  };

  // ==========================================================================
  // MESIN VALIDASI KETAT: CEK RANGKAIAN KABEL + CEK SINTAKS & LOGIKA KODE C++
  // ==========================================================================
  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];

    // 1. VALIDASI PEMASANGAN KABEL RANGKAIAN (HARDWARE WIRING CHECK)
    if (pinTerpilih1 !== aturanWiring.pinBenar1) {
      errors.push(
        `[SALAH KABEL RANGKAIAN] ${aturanWiring.labelKomponen1} masih dipasang ke "${pinTerpilih1}". Seharusnya dipasang ke "${aturanWiring.pinBenar1}"!`
      );
    }
    if (
      aturanWiring.labelKomponen2 &&
      aturanWiring.pinBenar2 &&
      pinTerpilih2 !== aturanWiring.pinBenar2
    ) {
      errors.push(
        `[SALAH KABEL RANGKAIAN] ${aturanWiring.labelKomponen2} masih dipasang ke "${pinTerpilih2}". Seharusnya dipasang ke "${aturanWiring.pinBenar2}"!`
      );
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        "❌ SIMULASI GAGAL DIJALANKAN: Sambungan kabel pin pada rangkaian di atas masih salah! Perbaiki pilihan Pin terlebih dahulu."
      );
      setOutputSerialSimulasi(
        `[HARDWARE WIRING ERROR]\n${errors.join(
          "\n"
        )}\n👉 Rangkaian tidak dapat menyala karena pin salah sambung!`
      );
      return;
    }

    // 2. HAPUS KOMENTAR DARI KODE USER AGAR KOMENTAR TEMPLATE TIDAK DIANGGAP JAWABAN!
    const kodeTanpaKomentar = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    // 3. CEK STRUKTUR WAJIB C++ (setup, loop, kurung kurawal, titik koma)
    if (!/void\s+setup\s*\(\s*\)/.test(kodeTanpaKomentar)) {
      errors.push(
        "Fungsi utama 'void setup()' hilang atau salah ketik. Setiap program ESP32 wajib memiliki void setup()."
      );
    }
    if (!/void\s+loop\s*\(\s*\)/.test(kodeTanpaKomentar)) {
      errors.push(
        "Fungsi utama 'void loop()' hilang atau salah ketik. Setiap program ESP32 wajib memiliki void loop()."
      );
    }

    const jumlahKurungBuka = (kodeTanpaKomentar.match(/\{/g) || []).length;
    const jumlahKurungTutup = (kodeTanpaKomentar.match(/\}/g) || []).length;
    if (jumlahKurungBuka === 0 || jumlahKurungBuka !== jumlahKurungTutup) {
      errors.push(
        `Jumlah kurung kurawal tidak seimbang: ada ${jumlahKurungBuka} kurung buka '{' tetapi ada ${jumlahKurungTutup} kurung tutup '}'.`
      );
    }

    // 4. CEK KATA KUNCI PERINTAH WAJIB DI DALAM KODE BERSIH (BUKAN DI KOMENTAR!)
    const kataKurang = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeTanpaKomentar.includes(kw)
    );
    if (kataKurang.length > 0) {
      errors.push(
        `Perintah program wajib yang belum Anda ketik: ${kataKurang
          .map((k) => `"${k}"`)
          .join(", ")}.`
      );
    }

    // 5. CEK ATURAN SPESIFIK PER LEVEL (NOMOR PIN & TITIK KOMA)
    if (materiAktif.level === 1) {
      if (!/pinMode\s*\(\s*2\s*,\s*OUTPUT\s*\)\s*;/.test(kodeTanpaKomentar)) {
        errors.push(
          "Anda belum mengetik 'pinMode(2, OUTPUT);' lengkap dengan titik koma (;) di dalam void setup()."
        );
      }
      if (!/digitalWrite\s*\(\s*2\s*,\s*HIGH\s*\)\s*;/.test(kodeTanpaKomentar)) {
        errors.push(
          "Anda belum mengetik 'digitalWrite(2, HIGH);' lengkap dengan titik koma (;) untuk menyalakan LED."
        );
      }
      if (!/digitalWrite\s*\(\s*2\s*,\s*LOW\s*\)\s*;/.test(kodeTanpaKomentar)) {
        errors.push(
          "Anda belum mengetik 'digitalWrite(2, LOW);' lengkap dengan titik koma (;) untuk mematikan LED."
        );
      }
    } else if (materiAktif.level === 2) {
      if (!/analogRead\s*\(\s*34\s*\)/.test(kodeTanpaKomentar)) {
        errors.push(
          "Sensor LDR terpasang di GPIO 34, tetapi Anda belum mengetik 'analogRead(34)'."
        );
      }
      if (!/digitalWrite\s*\(\s*26\s*,/.test(kodeTanpaKomentar)) {
        errors.push(
          "Relay Lampu Jalan terpasang di GPIO 26, tetapi Anda belum mengetik 'digitalWrite(26, ...)'."
        );
      }
    } else if (materiAktif.level === 3) {
      if (!/\.attach\s*\(\s*13\s*\)\s*;/.test(kodeTanpaKomentar)) {
        errors.push(
          "Motor Servo terpasang di GPIO 13, tetapi Anda belum mengetik 'pintu.attach(13);' di dalam setup()."
        );
      }
      if (!/\.write\s*\(\s*\d+\s*\)\s*;/.test(kodeTanpaKomentar)) {
        errors.push(
          "Anda belum mengetik perintah putar servo 'pintu.write(90);' di dalam loop()."
        );
      }
    }

    // JIKA ADA ERROR KODE, HENTIKAN SIMULASI & JANGAN LULUSKAN!
    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        `❌ KOMPILASI GAGAL (${errors.length} Kesalahan Ditemukan): Rangkaian tidak berjalan karena kode program Anda masih salah/belum lengkap!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR — SIMULASI DIHENTIKAN]\n--------------------------------------------------\n${errors
          .map((e, i) => `${i + 1}. ${e}`)
          .join(
            "\n"
          )}\n--------------------------------------------------\n💡 Perbaiki ketikan kode Anda di atas lalu klik 'Periksa Rangkaian & Jalankan Program' kembali!`
      );
      return;
    }

    // JIKA 100% BENAR (KABEL BENAR + KODE BENAR) -> JALANKAN SIMULASI ANIMASI RANGKAIAN!
    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPesanFeedback(
      `✅ SIMULASI BERHASIL! Sambungan rangkaian dan kode program Level ${materiAktif.level} Anda 100% Tepat (+${materiAktif.xpReward} XP)! Lihat animasi rangkaian yang menyala di atas!`
    );
    setOutputSerialSimulasi(materiAktif.simulasiOutputJikaBenar);

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  const isiOtomatisKodeBenar = () => {
    setPinTerpilih1(aturanWiring.pinBenar1);
    setPinTerpilih2(aturanWiring.pinBenar2 || "");
    setKodeKetikanUser(materiAktif.kodeTargetBenar);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback(
      "Kabel pin dan contoh kode yang benar telah dipasang. Sekarang klik tombol hijau 'Periksa Rangkaian & Jalankan Program' untuk menyalakan simulasi!"
    );
  };

  const simulasiSedangHidup = statusVerifikasi === "lulus";
  const levelSudahLulus =
    statusVerifikasi === "lulus" || levelSelesaiSet.has(materiAktif.level);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-6">
      {/* HEADER KURIKULUM BERTAHAP */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
            🎓 LABORATORIUM PRAKTIKUM RANGKAIAN &amp; KODING BERTAHAP (VALIDASI KETAT)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            Pasang Pin Rangkaian ➔ Ketik Kodingan C++ ➔ Uji Simulasi Rangkaian Nyata!
          </h2>
          <p className="text-xs text-slate-300">
            Jika sambungan pin atau kode program salah, <strong>rangkaian tidak akan menyala</strong> dan materi berikutnya tetap terkunci. Progres Lulus:{" "}
            <strong className="text-amber-300">
              {levelSelesaiSet.size} / {KURIKULUM_8_LEVEL_IOT.length} Level
            </strong>
          </p>
        </div>

        {/* Deretan Nomor Level 1 s.d. 8 */}
        <div className="flex flex-wrap gap-1.5">
          {KURIKULUM_8_LEVEL_IOT.map((item, idx) => {
            const sedangDibuka = idx === indeksLevel;
            const sudahLulus = levelSelesaiSet.has(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => pindahKeLevel(idx)}
                className={`px-3 py-2 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-1 border ${
                  sedangDibuka
                    ? "bg-amber-400 text-slate-950 border-white scale-105 shadow-lg"
                    : sudahLulus
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                }`}
              >
                {sudahLulus ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
                <span>Lv.{item.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN ATAS: SIMULATOR RANGKAIAN VISUAL & PEMASANGAN KABEL PIN      */}
      {/* =================================================================== */}
      <div
        className={`p-5 rounded-3xl border-2 transition space-y-4 ${
          statusVerifikasi === "lulus"
            ? "bg-slate-950 border-emerald-400 shadow-lg"
            : statusVerifikasi === "gagal_rangkaian" ||
              statusVerifikasi === "gagal_kode"
            ? "bg-rose-950/30 border-rose-500"
            : "bg-slate-950 border-slate-800"
        }`}
      >
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-black text-[10px] uppercase ${
                simulasiSedangHidup
                  ? "bg-emerald-400 text-slate-950 animate-pulse"
                  : statusVerifikasi === "belum"
                  ? "bg-slate-800 text-slate-300"
                  : "bg-rose-600 text-white"
              }`}
            >
              {simulasiSedangHidup
                ? "▶ SIMULASI RANGKAIAN HIDUP (RUNNING)"
                : statusVerifikasi === "belum"
                ? "⏹ RANGKAIAN STANDBY (MENUNGGU KODE BENAR)"
                : "❌ SIMULASI GAGAL / ERROR (RANGKAIAN MATI)"}
            </span>
            <span className="font-black text-sm text-amber-300">
              Meja Rangkaian Level {materiAktif.level}: {materiAktif.judulMateri}
            </span>
          </div>

          {/* Slider Uji Sensor Interaktif Saat Rangkaian Sudah Berhasil Menyala */}
          {simulasiSedangHidup && materiAktif.level in { 2: 1, 4: 1, 5: 1 } && (
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs">
              <span className="font-bold text-emerald-300">
                🎚️ Uji Ubah Nilai Sensor:
              </span>
              <input
                type="range"
                min={50}
                max={800}
                value={nilaiUjiSensorKanvas}
                onChange={(e) =>
                  setNilaiUjiSensorKanvas(Number(e.target.value))
                }
                className="w-28"
              />
              <span className="font-mono font-black text-amber-300">
                {nilaiUjiSensorKanvas}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* KANVAS SVG RANGKAIAN INTERAKTIF PER LEVEL */}
          <div className="lg:col-span-7 bg-[#0b1120] rounded-2xl border-2 border-slate-800 p-3 relative overflow-hidden">
            <svg viewBox="0 0 520 210" className="w-full h-48 sm:h-52">
              {/* Grid Titik Breadboard */}
              {Array.from({ length: 18 }).map((_, gx) =>
                Array.from({ length: 7 }).map((__, gy) => (
                  <circle
                    key={`${gx}-${gy}`}
                    cx={20 + gx * 28}
                    cy={20 + gy * 28}
                    r={1.5}
                    fill="#1e293b"
                  />
                ))
              )}

              {/* BOARD ESP32 UTAMA DI KIRI */}
              <g>
                <rect
                  x={28}
                  y={28}
                  width={130}
                  height={154}
                  rx={12}
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth={2}
                />
                <rect
                  x={46}
                  y={42}
                  width={94}
                  height={52}
                  rx={6}
                  fill="#94a3b8"
                />
                <text
                  x={93}
                  y={72}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="bold"
                >
                  ESP32-WROOM
                </text>
                <text
                  x={93}
                  y={115}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Level {materiAktif.level} MCU
                </text>
                {/* LED Power & Status ESP32 */}
                <circle
                  cx={65}
                  cy={155}
                  r={5}
                  fill={simulasiSedangHidup ? "#22c55e" : "#ef4444"}
                />
                <circle
                  cx={120}
                  cy={155}
                  r={5}
                  fill={
                    simulasiSedangHidup && detakSimulasi % 2 === 0
                      ? "#38bdf8"
                      : "#334155"
                  }
                />
              </g>

              {/* KABEL PENGHUBUNG (HIJAU/KUNING JIKA BENAR, MERAH PUTUS-PUTUS JIKA SALAH) */}
              <path
                d="M 158 75 C 220 75, 230 65, 290 65"
                fill="none"
                stroke={
                  pinTerpilih1 === aturanWiring.pinBenar1
                    ? simulasiSedangHidup
                      ? "#facc15"
                      : "#10b981"
                    : "#ef4444"
                }
                strokeWidth={4}
                strokeDasharray={
                  pinTerpilih1 === aturanWiring.pinBenar1 ? "none" : "6 4"
                }
              />
              <path
                d="M 158 135 C 220 135, 230 145, 290 145"
                fill="none"
                stroke={
                  !aturanWiring.pinBenar2 ||
                  pinTerpilih2 === aturanWiring.pinBenar2
                    ? simulasiSedangHidup
                      ? "#38bdf8"
                      : "#6366f1"
                    : "#ef4444"
                }
                strokeWidth={4}
                strokeDasharray={
                  !aturanWiring.pinBenar2 ||
                  pinTerpilih2 === aturanWiring.pinBenar2
                    ? "none"
                    : "6 4"
                }
              />

              {/* KOMPONEN SPESIFIK SESUAI LEVEL 1 S.D. 8 DI SEBELAH KANAN */}
              {materiAktif.level === 1 && (
                <g>
                  {/* Efek Cahaya Glow LED saat Lulus & Berkedip */}
                  {simulasiSedangHidup && detakSimulasi % 2 === 0 && (
                    <circle
                      cx={360}
                      cy={95}
                      r={48}
                      fill="rgba(250, 204, 21, 0.28)"
                    />
                  )}
                  <circle
                    cx={360}
                    cy={95}
                    r={28}
                    fill={
                      simulasiSedangHidup && detakSimulasi % 2 === 0
                        ? "#ef4444"
                        : "#450a0a"
                    }
                    stroke="#fca5a5"
                    strokeWidth={2}
                  />
                  <text
                    x={360}
                    y={150}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {simulasiSedangHidup
                      ? detakSimulasi % 2 === 0
                        ? "💡 LED MENYALA (HIGH)"
                        : "⚫ LED PADAM (LOW)"
                      : "🔒 LED MATI (BELUM LULUS)"}
                  </text>
                </g>
              )}

              {materiAktif.level === 2 && (
                <g>
                  <rect
                    x={290}
                    y={35}
                    width={95}
                    height={55}
                    rx={8}
                    fill="#1e3a8a"
                    stroke="#38bdf8"
                  />
                  <text
                    x={337}
                    y={60}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    LDR GPIO 34
                  </text>
                  <text
                    x={337}
                    y={76}
                    textAnchor="middle"
                    fill="#facc15"
                    fontSize="10"
                  >
                    {nilaiUjiSensorKanvas} Lux
                  </text>

                  <rect
                    x={290}
                    y={115}
                    width={95}
                    height={55}
                    rx={8}
                    fill="#1d4ed8"
                  />
                  <text
                    x={337}
                    y={145}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    RELAY GPIO 26
                  </text>

                  <circle
                    cx={445}
                    cy={105}
                    r={30}
                    fill={
                      simulasiSedangHidup && nilaiUjiSensorKanvas < 300
                        ? "#facc15"
                        : "#334155"
                    }
                  />
                  <text
                    x={445}
                    y={155}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {simulasiSedangHidup && nilaiUjiSensorKanvas < 300
                      ? "💡 LAMPU ON"
                      : "LAMPU OFF"}
                  </text>
                </g>
              )}

              {materiAktif.level === 3 && (
                <g>
                  <rect
                    x={295}
                    y={45}
                    width={90}
                    height={50}
                    rx={8}
                    fill="#1d4ed8"
                  />
                  <text
                    x={340}
                    y={75}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    SERVO GPIO 13
                  </text>
                  {/* Palang Pintu Berputar 90 Derajat Jika Lulus */}
                  <line
                    x1={385}
                    y1={70}
                    x2={simulasiSedangHidup && detakSimulasi % 2 === 0 ? 385 : 465}
                    y2={simulasiSedangHidup && detakSimulasi % 2 === 0 ? 15 : 70}
                    stroke="#facc15"
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                  <rect
                    x={295}
                    y={120}
                    width={110}
                    height={45}
                    rx={8}
                    fill={simulasiSedangHidup ? "#059669" : "#475569"}
                  />
                  <text
                    x={350}
                    y={147}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {simulasiSedangHidup
                      ? "🔓 SOLENOID UNLOCK"
                      : "🔒 SOLENOID LOCKED"}
                  </text>
                </g>
              )}

              {materiAktif.level >= 4 && (
                <g>
                  <rect
                    x={290}
                    y={35}
                    width={195}
                    height={60}
                    rx={10}
                    fill="#0f172a"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <text
                    x={387}
                    y={62}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {materiAktif.komponenDimasukkan[0]?.namaKomponen.slice(
                      0,
                      28
                    )}
                  </text>
                  <text
                    x={387}
                    y={80}
                    textAnchor="middle"
                    fill="#facc15"
                    fontSize="10"
                  >
                    {simulasiSedangHidup
                      ? "⚡ AKTIF MENGIRIM DATA TELEMETRI"
                      : "⏸ MENUNGGU PROGRAM BENAR"}
                  </text>

                  <rect
                    x={290}
                    y={115}
                    width={195}
                    height={60}
                    rx={10}
                    fill={simulasiSedangHidup ? "#065f46" : "#1e293b"}
                    stroke="#38bdf8"
                    strokeWidth={2}
                  />
                  <text
                    x={387}
                    y={148}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {simulasiSedangHidup
                      ? "✅ AKTUATOR / MESH BERJALAN!"
                      : "🔒 AKTUATOR BELUM AKTIF"}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* PANEL KANAN ATAS: CEK SAMBUNGAN KABEL PIN (WAJIB BENAR) */}
          <div className="lg:col-span-5 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
              <Wrench className="w-4 h-4" /> Konfigurasi Kabel Pin Rangkaian (Wajib Tepat):
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Jika kamu memilih pin yang salah di bawah ini, maka saat program dijalankan rangkaian akan <strong>Error / Gagal Menyala</strong>!
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-sky-300 block mb-1">
                  1. {aturanWiring.labelKomponen1}:
                </label>
                <select
                  value={pinTerpilih1}
                  onChange={(e) => {
                    setPinTerpilih1(e.target.value);
                    setStatusVerifikasi("belum");
                  }}
                  className={`w-full p-2.5 rounded-xl font-mono font-bold border-2 bg-slate-950 text-white ${
                    pinTerpilih1 === aturanWiring.pinBenar1
                      ? "border-emerald-500/70"
                      : "border-rose-500"
                  }`}
                >
                  {aturanWiring.opsiPin1.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {aturanWiring.labelKomponen2 && aturanWiring.opsiPin2 && (
                <div>
                  <label className="font-bold text-indigo-300 block mb-1">
                    2. {aturanWiring.labelKomponen2}:
                  </label>
                  <select
                    value={pinTerpilih2}
                    onChange={(e) => {
                      setPinTerpilih2(e.target.value);
                      setStatusVerifikasi("belum");
                    }}
                    className={`w-full p-2.5 rounded-xl font-mono font-bold border-2 bg-slate-950 text-white ${
                      pinTerpilih2 === aturanWiring.pinBenar2
                        ? "border-emerald-500/70"
                        : "border-rose-500"
                    }`}
                  >
                    {aturanWiring.opsiPin2.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN BAWAH: INSTRUKSI MATERI (KIRI) & EDITOR KETIK KODE (KANAN)   */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: PANDUAN MATERI & INSTRUKSI KETIK */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                {materiAktif.badgeLevel}
              </span>
              <span className="text-xs font-black text-emerald-400">
                Hadiah Lulus: +{materiAktif.xpReward} XP
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              {materiAktif.judulMateri}
            </h3>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Tugas Ketik Program (Wajib Diketik agar Simulasi Berhasil):
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {materiAktif.penjelasanTeoriSingkat}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-white bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i} className="leading-relaxed font-medium">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Penjelasan Baris Kode:
              </div>
              <div className="space-y-1.5">
                {materiAktif.penjelasanBarisKode.map((baris, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <code className="text-emerald-400 font-bold font-mono block">
                      {baris.potonganKode}
                    </code>
                    <span className="text-slate-300 text-[11px]">
                      ➔ {baris.artiPenjelasan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: EDITOR KODE + VALIDATOR KETAT + TOMBOL LANJUT YANG TERKUNCI JIKA BELUM LULUS */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
              <span className="font-mono text-xs font-black text-amber-300">
                ✍️ Ketik Kode C++ Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isiOtomatisKodeBenar}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Bantuan Isi Kode Benar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKodeKetikanUser(materiAktif.kodeTemplateAwal);
                    setStatusVerifikasi("belum");
                    setDaftarErrorDetail([]);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={kodeKetikanUser}
              onChange={(e) => {
                setKodeKetikanUser(e.target.value);
                if (statusVerifikasi === "lulus") setStatusVerifikasi("belum");
              }}
              spellCheck={false}
              className="w-full p-4 bg-black text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none"
            />

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={periksaRangkaianDanJalankanProgram}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa Rangkaian &amp; Jalankan Program
              </button>

              {indeksLevel < KURIKULUM_8_LEVEL_IOT.length - 1 ? (
                <button
                  type="button"
                  disabled={!levelSudahLulus}
                  onClick={() => pindahKeLevel(indeksLevel + 1)}
                  className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition ${
                    levelSudahLulus
                      ? "bg-amber-400 text-slate-950 shadow-xl cursor-pointer hover:bg-amber-300"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {levelSudahLulus ? (
                    <>
                      <span>2. Lanjut ke Level {materiAktif.level + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci (Selesaikan Program Dulu)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!levelSudahLulus}
                  onClick={() => {
                    if (onBukaSimulator10Node) onBukaSimulator10Node();
                  }}
                  className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 ${
                    levelSudahLulus
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Award className="w-4 h-4" /> Buka Simulator 10-Node ➔
                </button>
              )}
            </div>
          </div>

          {/* KOTAK PESAN ERROR DETAIL JIKA SALAH KABEL ATAU SALAH KODE */}
          {statusVerifikasi !== "belum" && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-2 ${
                statusVerifikasi === "lulus"
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-200"
                  : "bg-rose-950/95 border-rose-500 text-rose-200"
              }`}
            >
              <div className="flex items-start gap-2">
                {statusVerifikasi === "lulus" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{pesanFeedback}</span>
              </div>

              {daftarErrorDetail.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-300 bg-black/40 p-3 rounded-xl border border-rose-500/40">
                  {daftarErrorDetail.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TERMINAL SERIAL MONITOR */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-black text-amber-400 font-mono">
              📟 Output Compiler &amp; Serial Monitor (115200 baud):
            </div>
            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputSerialSimulasi}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};