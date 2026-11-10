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
  Zap,
  HelpCircle,
  Eye,
  Target,
  Cable,
  Trash2,
} from "lucide-react";
import {
  KURIKULUM_15_LEVEL_IOT,
  LessonStepIoT,
} from "./wokwiCurriculumData";
import {
  SPESIFIKASI_HARDWARE_15_LEVEL,
  GambarPeriferalWokwiAsli,
  TitikPinFisik,
} from "./wokwiHardwareVisuals";

export interface KabelTersambung {
  dariPinEsp32: string;
  kePinPeriferal: string;
  warna: string;
}

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  // PILIHAN MODE BELAJAR:
  // "tutorial_berkedip" = Ada bayangan komponen & kedap-kedip jalur kabel yang harus ditarik
  // "latihan_mandiri"   = Tanpa bayangan (hanya instruksi soal + tombol Clue bertahap jika butuh)
  const [modeBelajar, setModeBelajar] = useState<
    "tutorial_berkedip" | "latihan_mandiri"
  >("tutorial_berkedip");

  const materiAktif: LessonStepIoT = KURIKULUM_15_LEVEL_IOT[indeksLevel];
  const spekHardware =
    SPESIFIKASI_HARDWARE_15_LEVEL[materiAktif.level] ||
    SPESIFIKASI_HARDWARE_15_LEVEL[1];

  // State Perakitan Komponen ke Kotak Bayangan di Breadboard
  const [esp32SudahDitaruh, setEsp32SudahDitaruh] = useState<boolean>(false);
  const [periferalSudahDitaruh, setPeriferalSudahDitaruh] =
    useState<boolean>(false);

  // State Tarik Kabel Antar-Pin (Interactive Wire Connection)
  const [kabelTerpasangList, setKabelTerpasangList] = useState<
    KabelTersambung[]
  >([]);
  const [pinSedangDitarik, setPinSedangDitarik] =
    useState<TitikPinFisik | null>(null);

  // State Clue Bertahap (Khusus Mode Latihan Mandiri)
  const [jumlahClueDibuka, setJumlahClueDibuka] = useState<number>(0);
  const [intipBayanganSementara, setIntipBayanganSementara] =
    useState<boolean>(false);

  // State Editor Kodingan C++
  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    KURIKULUM_15_LEVEL_IOT[0].kodeTemplateAwal
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// Ikuti panduan berkedip di kanvas atas untuk menaruh ESP32, menaruh Sensor/LED, dan menarik kabel ke kaki pin yang diminta!"
  );

  const [detakSimulasi, setDetakSimulasi] = useState<number>(0);
  const [nilaiSensorUji, setNilaiSensorUji] = useState<number>(210);

  useEffect(() => {
    if (statusVerifikasi !== "lulus") return;
    const timer = setInterval(() => {
      setDetakSimulasi((d) => d + 1);
    }, 650);
    return () => clearInterval(timer);
  }, [statusVerifikasi]);

  // Reset atau pindah ke level tertentu
  const pindahKeLevel = (
    idxBaru: number,
    modeTarget: "tutorial_berkedip" | "latihan_mandiri" = modeBelajar
  ) => {
    const target = KURIKULUM_15_LEVEL_IOT[idxBaru];
    if (!target) return;
    setIndeksLevel(idxBaru);
    setModeBelajar(modeTarget);
    setEsp32SudahDitaruh(false);
    setPeriferalSudahDitaruh(false);
    setKabelTerpasangList([]);
    setPinSedangDitarik(null);
    setJumlahClueDibuka(0);
    setIntipBayanganSementara(false);
    setKodeKetikanUser(target.kodeTemplateAwal);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Level ${target.level}: ${target.judulMateri}\n// Langkah 1: Tarik/Klik ESP32 & Komponen ke kanvas.\n// Langkah 2: Tarik kabel antar-kaki pin.\n// Langkah 3: Ketik kode C++ dan jalankan!`
    );
  };

  // Cari sambungan kabel wajib mana yang saat ini BELUM dipasang oleh siswa (untuk panduan kedap-kedip)
  const sambunganWajibBelumTerpasang = spekHardware.sambunganWajib.filter(
    (wajib) =>
      !kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      )
  );

  const langkahTutorialSaatIni:
    | "taruh_esp32"
    | "taruh_periferal"
    | "tarik_kabel"
    | "ketik_kode" = !esp32SudahDitaruh
    ? "taruh_esp32"
    : !periferalSudahDitaruh
    ? "taruh_periferal"
    : sambunganWajibBelumTerpasang.length > 0
    ? "tarik_kabel"
    : "ketik_kode";

  const sambunganBerkedipTarget = sambunganWajibBelumTerpasang[0] || null;
  const tampilkanBayanganPanduan =
    modeBelajar === "tutorial_berkedip" || intipBayanganSementara;

  // ==========================================================================
  // FUNGSI INTERAKTIF KLIK / TARIK KAKI PIN UNTUK MENYAMBUNG KABEL JUMPER
  // ==========================================================================
  const handleKlikTitikPin = (pinDiklik: TitikPinFisik) => {
    if (!esp32SudahDitaruh || !periferalSudahDitaruh) {
      setPesanFeedback(
        "⚠️ Taruh dulu papan ESP32 dan Komponen Sensor/Aktuator ke meja breadboard sebelum menarik kabel!"
      );
      return;
    }

    // Jika belum ada pin awal yang dipilih, jadikan pin ini sebagai ujung awal kabel
    if (!pinSedangDitarik) {
      setPinSedangDitarik(pinDiklik);
      return;
    }

    // Jika mengklik pin yang sama, batalkan tarikan
    if (pinSedangDitarik.idPin === pinDiklik.idPin) {
      setPinSedangDitarik(null);
      return;
    }

    // Pastikan menyambung antara ESP32 <-> Periferal
    let idEsp = "";
    let idPerif = "";
    if (
      pinSedangDitarik.posisiKomponen === "esp32" &&
      pinDiklik.posisiKomponen === "periferal"
    ) {
      idEsp = pinSedangDitarik.idPin;
      idPerif = pinDiklik.idPin;
    } else if (
      pinSedangDitarik.posisiKomponen === "periferal" &&
      pinDiklik.posisiKomponen === "esp32"
    ) {
      idEsp = pinDiklik.idPin;
      idPerif = pinSedangDitarik.idPin;
    } else {
      setPinSedangDitarik(pinDiklik);
      return;
    }

    // Cari warna kabel yang sesuai
    const cocokWajib = spekHardware.sambunganWajib.find(
      (w) => w.dariPinEsp32 === idEsp && w.kePinPeriferal === idPerif
    );
    const warnaKabelBaru = cocokWajib?.warnaKabel || pinSedangDitarik.warnaPin;

    setKabelTerpasangList((prev) => {
      const tanpaDuplikat = prev.filter(
        (k) => !(k.dariPinEsp32 === idEsp && k.kePinPeriferal === idPerif)
      );
      return [
        ...tanpaDuplikat,
        { dariPinEsp32: idEsp, kePinPeriferal: idPerif, warna: warnaKabelBaru },
      ];
    });
    setPinSedangDitarik(null);
    setStatusVerifikasi("belum");
  };

  // Shortcut pasang otomatis 1 langkah berikutnya (memudahkan di layar HP/Tablet)
  const lakukanLangkahTutorialBerikutnya = () => {
    if (!esp32SudahDitaruh) {
      setEsp32SudahDitaruh(true);
      return;
    }
    if (!periferalSudahDitaruh) {
      setPeriferalSudahDitaruh(true);
      return;
    }
    if (sambunganBerkedipTarget) {
      setKabelTerpasangList((prev) => [
        ...prev,
        {
          dariPinEsp32: sambunganBerkedipTarget.dariPinEsp32,
          kePinPeriferal: sambunganBerkedipTarget.kePinPeriferal,
          warna: sambunganBerkedipTarget.warnaKabel,
        },
      ]);
      return;
    }
  };

  // ==========================================================================
  // MESIN VALIDASI KETAT: KOMPONEN + KABEL PIN + SINTAKS KODE C++
  // ==========================================================================
  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];

    // 1. Cek apakah ESP32 dan Komponen sudah ditarik ke Breadboard
    if (!esp32SudahDitaruh) {
      errors.push(
        "[KOMPONEN BELUM DITARUH] Anda belum menarik/memasang papan ESP32 DevKit V1 ke meja rangkaian!"
      );
    }
    if (!periferalSudahDitaruh) {
      errors.push(
        `[KOMPONEN BELUM DITARUH] Anda belum menarik/memasang komponen "${spekHardware.namaPeriferal}" ke meja rangkaian!`
      );
    }

    // 2. Cek apakah semua kabel wajib sudah ditarik ke pin yang benar
    for (const wajib of spekHardware.sambunganWajib) {
      const sudahAda = kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      );
      if (!sudahAda) {
        errors.push(`[KABEL BELUM TERSAMBUNG] ${wajib.keteranganJalur}.`);
      }
    }

    // Cek apakah ada kabel salah pasang yang tidak diminta modul
    for (const terpasang of kabelTerpasangList) {
      const valid = spekHardware.sambunganWajib.some(
        (w) =>
          w.dariPinEsp32 === terpasang.dariPinEsp32 &&
          w.kePinPeriferal === terpasang.kePinPeriferal
      );
      if (!valid) {
        const namaEsp =
          spekHardware.pinEsp32Tersedia.find(
            (p) => p.idPin === terpasang.dariPinEsp32
          )?.labelPin || terpasang.dariPinEsp32;
        const namaPerif =
          spekHardware.pinPeriferalTersedia.find(
            (p) => p.idPin === terpasang.kePinPeriferal
          )?.labelPin || terpasang.kePinPeriferal;
        errors.push(
          `[SALAH SAMBUNG KABEL] Kabel dari "${namaEsp}" ke "${namaPerif}" tidak sesuai dengan instruksi modul! Hapus kabel yang salah.`
        );
      }
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        "❌ SIMULASI GAGAL MENYALA: Rangkaian fisik atau tarikan kabel Anda belum tepat! Klik tombol '💡 Butuh Clue?' jika Anda kesulitan."
      );
      setOutputSerialSimulasi(
        `[HARDWARE & WIRING ERROR — SIMULASI TIDAK BERHASIL]\n--------------------------------------------------\n${errors
          .map((e, i) => `${i + 1}. ${e}`)
          .join(
            "\n"
          )}\n--------------------------------------------------\n👉 Perbaiki komponen/kabel di kanvas atas atau buka Clue!`
      );
      return;
    }

    // 3. Validasi Kodingan C++ (Hapus komentar dulu agar komentar template tidak dianggap kode)
    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    if (!/void\s+setup\s*\(\s*\)/.test(kodeBersih)) {
      errors.push("Fungsi utama 'void setup()' hilang atau salah ketik.");
    }
    if (!/void\s+loop\s*\(\s*\)/.test(kodeBersih)) {
      errors.push("Fungsi utama 'void loop()' hilang atau salah ketik.");
    }

    const kurungBuka = (kodeBersih.match(/\{/g) || []).length;
    const kurungTutup = (kodeBersih.match(/\}/g) || []).length;
    if (kurungBuka === 0 || kurungBuka !== kurungTutup) {
      errors.push(
        `Kurung kurawal tidak seimbang: ada ${kurungBuka} '{' tetapi ada ${kurungTutup} '}'.`
      );
    }

    const kurangKw = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeBersih.includes(kw)
    );
    if (kurangKw.length > 0) {
      errors.push(
        `Perintah C++ yang wajib diketik namun belum ada: ${kurangKw
          .map((k) => `"${k}"`)
          .join(", ")}.`
      );
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        `❌ KOMPILASI KODE GAGAL (${errors.length} Kesalahan): Kabel rangkaian sudah benar, tetapi kodingan C++ Anda masih belum tepat!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR — SIMULASI DIHENTIKAN]\n--------------------------------------------------\n${errors
          .map((e, i) => `${i + 1}. ${e}`)
          .join(
            "\n"
          )}\n--------------------------------------------------\n💡 Klik tombol '💡 Buka Clue Petunjuk' jika Anda butuh bantuan!`
      );
      return;
    }

    // 4. SEMUA BENAR (KOMPONEN + KABEL + KODE) -> SIMULASI MENYALA & BUKA LEVEL BERIKUTNYA!
    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPesanFeedback(
      `🎉 LUAR BIASA! Perakitan komponen, tarikan kabel pin, dan kodingan C++ Level ${materiAktif.level} Anda 100% BENAR (+${materiAktif.xpReward} XP)! Sekarang Anda bisa lanjut ke Level berikutnya!`
    );
    setOutputSerialSimulasi(materiAktif.simulasiOutputJikaBenar);

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  // Fungsi Bantuan Otomatis (Memasang Komponen + Kabel + Kode)
  const pasangSemuaOtomatis = () => {
    setEsp32SudahDitaruh(true);
    setPeriferalSudahDitaruh(true);
    setKabelTerpasangList(
      spekHardware.sambunganWajib.map((w) => ({
        dariPinEsp32: w.dariPinEsp32,
        kePinPeriferal: w.kePinPeriferal,
        warna: w.warnaKabel,
      }))
    );
    setKodeKetikanUser(materiAktif.kodeTargetBenar);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback(
      "✨ Seluruh komponen, kabel pin, dan kode C++ yang benar telah dipasang! Klik tombol hijau '1. Periksa Rangkaian & Jalankan Program' untuk menyalakan simulasi."
    );
  };

  const simulasiAktif = statusVerifikasi === "lulus";
  const sudahLulusLevelIni =
    statusVerifikasi === "lulus" || levelSelesaiSet.has(materiAktif.level);

  // Koordinat pin yang sedang berkedip di mode tutorial
  const pinEspBerkedipObj = sambunganBerkedipTarget
    ? spekHardware.pinEsp32Tersedia.find(
        (p) => p.idPin === sambunganBerkedipTarget.dariPinEsp32
      )
    : null;
  const pinPerifBerkedipObj = sambunganBerkedipTarget
    ? spekHardware.pinPeriferalTersedia.find(
        (p) => p.idPin === sambunganBerkedipTarget.kePinPeriferal
      )
    : null;

  return (
    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-6">
      {/* =================================================================== */}
      {/* HEADER 15 LEVEL + PEMILIH MODE TUTORIAL BERKEDIP VS LATIHAN MANDIRI */}
      {/* =================================================================== */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
              🎓 AKADEMI WOKWI INTERAKTIF (15 LEVEL DARI DASAR)
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-[10px]">
              Tuntas: {levelSelesaiSet.size} / {KURIKULUM_15_LEVEL_IOT.length} Level
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            Level {materiAktif.level}: {materiAktif.judulMateri}
          </h2>
        </div>

        {/* SAKELAR 2 MODE: MODE TUTORIAL (ADA BAYANGAN BERKEDIP) VS MODE LATIHAN (TANPA BAYANGAN + CLUE) */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setModeBelajar("tutorial_berkedip");
              setIntipBayanganSementara(false);
            }}
            className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition ${
              modeBelajar === "tutorial_berkedip"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" /> 1. Mode Tutorial (Ada Bayangan &amp; Kedap-Kedip)
          </button>

          <button
            type="button"
            onClick={() => {
              setModeBelajar("latihan_mandiri");
              setIntipBayanganSementara(false);
            }}
            className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition ${
              modeBelajar === "latihan_mandiri"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Target className="w-4 h-4" /> 2. Mode Latihan Mandiri (Uji Tanpa Bayangan + Clue)
          </button>
        </div>
      </div>

      {/* DERETAN NAVIGASI 15 LEVEL */}
      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        {KURIKULUM_15_LEVEL_IOT.map((item, idx) => {
          const sedangDibuka = idx === indeksLevel;
          const lulus = levelSelesaiSet.has(item.level);
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => pindahKeLevel(idx)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-1 border ${
                sedangDibuka
                  ? "bg-amber-400 text-slate-950 border-white scale-105 shadow-md"
                  : lulus
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {lulus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              <span>Lv.{item.level}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* BANNER INSTRUKSI BERKEDIP DINAMIS (MENUNTUN APA YANG HARUS DIKLIK)  */}
      {/* =================================================================== */}
      <div
        className={`p-4 rounded-2xl border-2 flex flex-wrap justify-between items-center gap-3 ${
          tampilkanBayanganPanduan
            ? "bg-amber-950/40 border-amber-400 text-amber-100"
            : "bg-indigo-950/50 border-indigo-400 text-indigo-100"
        }`}
      >
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs animate-pulse shrink-0">
            {modeBelajar === "tutorial_berkedip"
              ? "💡 PANDUAN BERKEDIP:"
              : "🎯 INSTRUKSI LATIHAN:"}
          </span>
          <span>
            {langkahTutorialSaatIni === "taruh_esp32" &&
              "Langkah 1: Klik/Tarik komponen [1. Board ESP32 DevKit V1] dari Toolbox di bawah ke kotak bayangan berkedip di sebelah kiri kanvas!"}
            {langkahTutorialSaatIni === "taruh_periferal" &&
              `Langkah 2: Sekarang Klik/Tarik komponen [2. ${spekHardware.namaPeriferal}] ke kotak bayangan berkedip di sebelah kanan kanvas!`}
            {langkahTutorialSaatIni === "tarik_kabel" &&
              sambunganBerkedipTarget &&
              (tampilkanBayanganPanduan
                ? `Langkah 3 (Tarik Kabel): Klik titik pin berkedip [${
                    pinEspBerkedipObj?.labelPin
                  }] di ESP32 lalu klik titik berkedip [${
                    pinPerifBerkedipObj?.labelPin
                  }] (${sambunganBerkedipTarget.keteranganJalur})!`
                : `Langkah 3 (Latihan): Sambungkan ${spekHardware.sambunganWajib.length} jalur kabel dari pin ESP32 ke kaki komponen sesuai petunjuk soal di bawah!`)}
            {langkahTutorialSaatIni === "ketik_kode" &&
              "✅ Rangkaian & Kabel Lengkap! Sekarang ketik kode program C++ di bawah lalu klik 'Periksa Rangkaian & Jalankan Program'!"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {langkahTutorialSaatIni !== "ketik_kode" &&
            tampilkanBayanganPanduan && (
              <button
                type="button"
                onClick={lakukanLangkahTutorialBerikutnya}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow animate-bounce"
              >
                ⚡ Pasang Langkah Ini Otomatis
              </button>
            )}

          {modeBelajar === "latihan_mandiri" && (
            <button
              type="button"
              onClick={() => {
                setJumlahClueDibuka((c) =>
                  Math.min(spekHardware.daftarClueLatihan.length, c + 1)
                );
                if (jumlahClueDibuka >= 1) {
                  setIntipBayanganSementara(true);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <HelpCircle className="w-4 h-4" /> 💡 Butuh Clue? (
              {jumlahClueDibuka}/{spekHardware.daftarClueLatihan.length})
            </button>
          )}
        </div>
      </div>

      {/* KOTAK DAFTAR CLUE BERTAHAP (MUNCUL JIKA SISWA KLIK TOMBOL BUTUH CLUE) */}
      {jumlahClueDibuka > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-400 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-300 uppercase">
              🕵️ Petunjuk / Clue Bantuan yang Dibuka ({jumlahClueDibuka} dari{" "}
              {spekHardware.daftarClueLatihan.length}):
            </span>
            <button
              type="button"
              onClick={() =>
                setIntipBayanganSementara(!intipBayanganSementara)
              }
              className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
            >
              {intipBayanganSementara
                ? "Sembunyikan Bayangan Kabel"
                : "👁️ Tampilkan Bayangan Berkedip di Kanvas"}
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-amber-100 font-medium">
            {spekHardware.daftarClueLatihan
              .slice(0, jumlahClueDibuka)
              .map((clue, idx) => (
                <li key={idx}>{clue}</li>
              ))}
          </ul>
        </div>
      )}

      {/* =================================================================== */}
      {/* TOOLBOX KOMPONEN & KANVAS RANGKAIAN WOKWI DENGAN BAYANGAN BERKEDIP  */}
      {/* =================================================================== */}
      <div className="bg-slate-950 p-5 rounded-3xl border-2 border-slate-800 space-y-4">
        {/* Baris Toolbox Komponen yang Harus Ditarik ke Kanvas */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-400 mr-1">
              🧰 Toolbox Komponen:
            </span>

            {/* Tombol Tarik ESP32 */}
            <button
              type="button"
              draggable
              onDragEnd={() => setEsp32SudahDitaruh(true)}
              onClick={() => setEsp32SudahDitaruh(true)}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer border-2 transition ${
                esp32SudahDitaruh
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                  : "bg-amber-400 text-slate-950 border-white animate-pulse shadow-lg scale-105"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>
                {esp32SudahDitaruh
                  ? "✓ 1. ESP32 DevKit V1 (Terpasang)"
                  : "+ 1. Tarik ESP32 DevKit V1 ke Kanvas"}
              </span>
            </button>

            {/* Tombol Tarik Komponen Periferal Asli */}
            <button
              type="button"
              draggable
              onDragEnd={() => setPeriferalSudahDitaruh(true)}
              onClick={() => setPeriferalSudahDitaruh(true)}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer border-2 transition ${
                periferalSudahDitaruh
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                  : esp32SudahDitaruh
                  ? "bg-amber-400 text-slate-950 border-white animate-pulse shadow-lg scale-105"
                  : "bg-slate-900 text-slate-300 border-slate-700"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {periferalSudahDitaruh
                  ? `✓ 2. ${spekHardware.namaPeriferal} (Terpasang)`
                  : `+ 2. Tarik ${spekHardware.namaPeriferal}`}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {kabelTerpasangList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setKabelTerpasangList([]);
                  setStatusVerifikasi("belum");
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Lepas Semua Kabel (
                {kabelTerpasangList.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setEsp32SudahDitaruh(false);
                setPeriferalSudahDitaruh(false);
                setKabelTerpasangList([]);
                setStatusVerifikasi("belum");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Ulangi Rangkaian
            </button>
          </div>
        </div>

        {/* KANVAS UTAMA SVG WOKWI (560 x 240) DENGAN BAYANGAN GHOST & TITIK PIN INTERAKTIF */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (!esp32SudahDitaruh) setEsp32SudahDitaruh(true);
            else if (!periferalSudahDitaruh) setPeriferalSudahDitaruh(true);
          }}
          className="bg-[#090d16] rounded-2xl border-2 border-slate-800 p-3 relative overflow-hidden"
        >
          <svg viewBox="0 0 560 240" className="w-full h-60 sm:h-72 select-none">
            {/* Lubang-lubang Breadboard */}
            {Array.from({ length: 20 }).map((_, gx) =>
              Array.from({ length: 8 }).map((__, gy) => (
                <circle
                  key={`${gx}-${gy}`}
                  cx={18 + gx * 27}
                  cy={18 + gy * 27}
                  r={1.6}
                  fill="#1e293b"
                />
              ))
            )}

            {/* ============================================================= */}
            {/* 1. AREA KIRI: BAYANGAN GHOST ESP32 ATAU BOARD ESP32 ASLI      */}
            {/* ============================================================= */}
            {!esp32SudahDitaruh ? (
              <g
                onClick={() => setEsp32SudahDitaruh(true)}
                className="cursor-pointer"
              >
                <rect
                  x={45}
                  y={25}
                  width={122}
                  height={195}
                  rx={14}
                  fill="rgba(250, 204, 21, 0.08)"
                  stroke="#facc15"
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.35;1;0.35"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </rect>
                <text
                  x={106}
                  y={112}
                  textAnchor="middle"
                  fill="#facc15"
                  fontSize="11"
                  fontWeight="bold"
                >
                  + KLIK / TARIK
                </text>
                <text
                  x={106}
                  y={130}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                >
                  ESP32 KE SINI
                </text>
                <text
                  x={106}
                  y={148}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                >
                  (Bayangan Papan MCU)
                </text>
              </g>
            ) : (
              <g>
                {/* Papan PCB Hitam ESP32 DevKit V1 Asli */}
                <rect
                  x={52}
                  y={25}
                  width={108}
                  height={195}
                  rx={10}
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth={2}
                />
                {/* Kaleng Modul Wi-Fi ESP-WROOM-32 Perak */}
                <rect
                  x={66}
                  y={38}
                  width={80}
                  height={62}
                  rx={6}
                  fill="#cbd5e1"
                  stroke="#475569"
                />
                <text
                  x={106}
                  y={66}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  ESP-WROOM-32
                </text>
                <text
                  x={106}
                  y={82}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="8"
                  fontWeight="bold"
                >
                  Wi-Fi + BLE SoC
                </text>

                {/* Port Konektor Micro-USB di Bawah */}
                <rect
                  x={86}
                  y={208}
                  width={40}
                  height={16}
                  rx={3}
                  fill="#94a3b8"
                />
                {/* Tombol EN & BOOT + LED Power */}
                <rect x={64} y={195} width={14} height={10} rx={2} fill="#0f172a" />
                <rect x={134} y={195} width={14} height={10} rx={2} fill="#0f172a" />
                <circle
                  cx={92}
                  cy={182}
                  r={4}
                  fill={simulasiAktif ? "#22c55e" : "#ef4444"}
                />
                <circle
                  cx={120}
                  cy={182}
                  r={4}
                  fill={
                    simulasiAktif && detakSimulasi % 2 === 0
                      ? "#38bdf8"
                      : "#334155"
                  }
                />

                {/* Titik-Titik Kaki Pin Emas ESP32 yang Bisa Diklik untuk Tarik Kabel */}
                {spekHardware.pinEsp32Tersedia.map((pin) => {
                  const sedangDipilih = pinSedangDitarik?.idPin === pin.idPin;
                  const harusBerkedip =
                    tampilkanBayanganPanduan &&
                    pinEspBerkedipObj?.idPin === pin.idPin;

                  return (
                    <g
                      key={pin.idPin}
                      onClick={() => handleKlikTitikPin(pin)}
                      className="cursor-pointer"
                    >
                      {harusBerkedip && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={13}
                          fill="none"
                          stroke="#facc15"
                          strokeWidth={3}
                        >
                          <animate
                            attributeName="r"
                            values="6;15;6"
                            dur="0.9s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={sedangDipilih ? 8 : 5.5}
                        fill={
                          sedangDipilih || harusBerkedip
                            ? "#facc15"
                            : pin.warnaPin
                        }
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={pin.x > 100 ? pin.x - 10 : pin.x + 10}
                        y={pin.y + 3}
                        textAnchor={pin.x > 100 ? "end" : "start"}
                        fill={harusBerkedip ? "#fde047" : "#e2e8f0"}
                        fontSize="7.8"
                        fontWeight="bold"
                      >
                        {pin.labelPin}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ============================================================= */}
            {/* 2. AREA KANAN: BAYANGAN GHOST KOMPONEN ATAU PERANGKAT ASLI    */}
            {/* ============================================================= */}
            {!periferalSudahDitaruh ? (
              <g
                onClick={() => setPeriferalSudahDitaruh(true)}
                className="cursor-pointer"
              >
                <rect
                  x={335}
                  y={42}
                  width={185}
                  height={155}
                  rx={16}
                  fill="rgba(56, 189, 248, 0.08)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.35;1;0.35"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </rect>
                <text
                  x={427}
                  y={108}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  + KLIK / TARIK KOMPONEN:
                </text>
                <text
                  x={427}
                  y={126}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {spekHardware.namaPeriferal.slice(0, 28)}
                </text>
                <text
                  x={427}
                  y={144}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                >
                  (Bayangan Tempat Sensor/Aktuator)
                </text>
              </g>
            ) : (
              <g>
                {/* Gambar Perangkat Keras Asli Wokwi */}
                <GambarPeriferalWokwiAsli
                  tipe={spekHardware.tipeVisualPeriferal}
                  simulasiHidup={simulasiAktif}
                  detak={detakSimulasi}
                  nilaiSensorUji={nilaiSensorUji}
                />

                {/* Titik Pin pada Komponen Periferal */}
                {spekHardware.pinPeriferalTersedia.map((pin) => {
                  const sedangDipilih = pinSedangDitarik?.idPin === pin.idPin;
                  const harusBerkedip =
                    tampilkanBayanganPanduan &&
                    pinPerifBerkedipObj?.idPin === pin.idPin;

                  return (
                    <g
                      key={pin.idPin}
                      onClick={() => handleKlikTitikPin(pin)}
                      className="cursor-pointer"
                    >
                      {harusBerkedip && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={14}
                          fill="none"
                          stroke="#facc15"
                          strokeWidth={3}
                        >
                          <animate
                            attributeName="r"
                            values="6;15;6"
                            dur="0.9s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={sedangDipilih ? 8.5 : 6}
                        fill={
                          sedangDipilih || harusBerkedip
                            ? "#facc15"
                            : pin.warnaPin
                        }
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={pin.x - 10}
                        y={pin.y - 9}
                        textAnchor="end"
                        fill={harusBerkedip ? "#fde047" : "#f8fafc"}
                        fontSize="8.5"
                        fontWeight="bold"
                      >
                        {pin.labelPin}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ============================================================= */}
            {/* 3. GARIS BAYANGAN KABEL BERKEDIP (GHOST WIRE GUIDE)           */}
            {/* ============================================================= */}
            {esp32SudahDitaruh &&
              periferalSudahDitaruh &&
              tampilkanBayanganPanduan &&
              pinEspBerkedipObj &&
              pinPerifBerkedipObj && (
                <g
                  onClick={lakukanLangkahTutorialBerikutnya}
                  className="cursor-pointer"
                >
                  <path
                    d={`M ${pinEspBerkedipObj.x} ${pinEspBerkedipObj.y} C ${
                      (pinEspBerkedipObj.x + pinPerifBerkedipObj.x) / 2
                    } ${pinEspBerkedipObj.y - 25}, ${
                      (pinEspBerkedipObj.x + pinPerifBerkedipObj.x) / 2
                    } ${pinPerifBerkedipObj.y + 25}, ${
                      pinPerifBerkedipObj.x
                    } ${pinPerifBerkedipObj.y}`}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth={4}
                    strokeDasharray="7 5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="24"
                      to="0"
                      dur="0.7s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <rect
                    x={195}
                    y={12}
                    width={175}
                    height={22}
                    rx={6}
                    fill="#facc15"
                  />
                  <text
                    x={282}
                    y={26}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    👆 KLIK PIN BERKEDIP UNTUK HUBUNGKAN KABEL
                  </text>
                </g>
              )}

            {/* ============================================================= */}
            {/* 4. KABEL JUMPER YANG SUDAH DITARIK OLEH SISWA                 */}
            {/* ============================================================= */}
            {kabelTerpasangList.map((k, idx) => {
              const p1 = spekHardware.pinEsp32Tersedia.find(
                (p) => p.idPin === k.dariPinEsp32
              );
              const p2 = spekHardware.pinPeriferalTersedia.find(
                (p) => p.idPin === k.kePinPeriferal
              );
              if (!p1 || !p2) return null;
              const midX = (p1.x + p2.x) / 2;
              return (
                <g key={idx}>
                  <path
                    d={`M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={k.warna}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                  />
                  {simulasiAktif && (
                    <circle
                      cx={
                        detakSimulasi % 2 === 0
                          ? p1.x + (p2.x - p1.x) * 0.35
                          : p1.x + (p2.x - p1.x) * 0.75
                      }
                      cy={
                        detakSimulasi % 2 === 0
                          ? p1.y + (p2.y - p1.y) * 0.35
                          : p1.y + (p2.y - p1.y) * 0.75
                      }
                      r={4.5}
                      fill="#fef08a"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel Cepat Pasang Kabel Manual (Untuk Mempermudah Pengguna Mouse maupun Layar Sentuh) */}
        <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-sky-400 flex items-center gap-1">
              <Cable className="w-4 h-4" /> Daftar Sambungan Kabel di Kanvas:
            </span>
            {kabelTerpasangList.length === 0 ? (
              <span className="text-slate-400 italic">
                Belum ada kabel terpasang. Klik titik pin pada ESP32 lalu klik titik pin pada komponen di kanvas!
              </span>
            ) : (
              kabelTerpasangList.map((k, i) => {
                const l1 =
                  spekHardware.pinEsp32Tersedia.find(
                    (p) => p.idPin === k.dariPinEsp32
                  )?.labelPin || k.dariPinEsp32;
                const l2 =
                  spekHardware.pinPeriferalTersedia.find(
                    (p) => p.idPin === k.kePinPeriferal
                  )?.labelPin || k.kePinPeriferal;
                return (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5"
                  >
                    <span>
                      {l1} ➔ {l2}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setKabelTerpasangList((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-rose-400 hover:text-rose-200 font-black cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                );
              })
            )}
          </div>

          {materiAktif.level === 3 && simulasiAktif && (
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold">☀️ Uji Cahaya LDR:</span>
              <input
                type="range"
                min={50}
                max={900}
                value={nilaiSensorUji}
                onChange={(e) => setNilaiSensorUji(Number(e.target.value))}
                className="w-28"
              />
              <span className="font-mono font-black">{nilaiSensorUji} Lux</span>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN BAWAH: INSTRUKSI MODUL (KIRI) & EDITOR KODE C++ (KANAN)      */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: INSTRUKSI KOMPONEN & PANDUAN BARIS KODE */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                {materiAktif.badgeLevel}
              </span>
              <span className="font-black text-emerald-400">
                Hadiah Lulus: +{materiAktif.xpReward} XP
              </span>
            </div>

            <p className="text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
              <strong className="text-amber-300">🎯 Misi Pembelajaran:</strong>{" "}
              {materiAktif.tujuanBelajar}
            </p>

            {/* Daftar Komponen & Pin yang Diminta */}
            <div className="space-y-1.5">
              <div className="font-black uppercase text-sky-400">
                1. Komponen &amp; Sambungan Kabel yang Diminta:
              </div>
              {materiAktif.komponenDimasukkan.map((k, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5"
                >
                  <div className="font-black text-white">🔌 {k.namaKomponen}</div>
                  <div className="text-amber-300 font-mono text-[11px]">
                    Jalur Pin: {k.pasangKePin}
                  </div>
                </div>
              ))}
            </div>

            {/* Instruksi Ketik Program */}
            <div className="space-y-1.5 pt-1">
              <div className="font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 2. Instruksi Ketik Kodingan C++:
              </div>
              <p className="text-slate-300 leading-relaxed">
                {materiAktif.penjelasanTeoriSingkat}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-white bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 font-medium leading-relaxed">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Kamus Penjelasan Baris Kode (Disembunyikan di Mode Latihan Mandiri kecuali Clue dibuka) */}
            {(modeBelajar === "tutorial_berkedip" || jumlahClueDibuka >= 2) && (
              <div className="space-y-1.5 pt-1">
                <div className="font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Arti Setiap Baris Perintah:
                </div>
                {materiAktif.penjelasanBarisKode.map((b, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <code className="text-emerald-400 font-mono font-bold block">
                      {b.potonganKode}
                    </code>
                    <span className="text-slate-300 text-[11px]">
                      ➔ {b.artiPenjelasan}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: EDITOR KODE C++ + TOMBOL VALIDASI + TOMBOL LANJUT LEVEL */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="font-mono font-black text-amber-300">
                ✍️ Editor C++ — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={pasangSemuaOtomatis}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Pasang Rangkaian &amp; Kode Contoh
                </button>
                <button
                  type="button"
                  onClick={() => pindahKeLevel(indeksLevel, modeBelajar)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={kodeKetikanUser}
              onChange={(e) => {
                setKodeKetikanUser(e.target.value);
                if (simulasiAktif) setStatusVerifikasi("belum");
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

              {indeksLevel < KURIKULUM_15_LEVEL_IOT.length - 1 ? (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() => pindahKeLevel(indeksLevel + 1)}
                  className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl animate-bounce"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {sudahLulusLevelIni ? (
                    <>
                      <span>2. Lanjut ke Level {materiAktif.level + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci (Harus Benar Dulu)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() => {
                    if (onBukaSimulator10Node) onBukaSimulator10Node();
                  }}
                  className={`py-3 px-4 rounded-xl font-black text-xs ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-1" /> Buka Simulator 10-Node ➔
                </button>
              )}
            </div>
          </div>

          {/* KOTAK VALIDASI BERHASIL / GAGAL + TOMBOL CLUE LANGSUNG SAAT SALAH */}
          {statusVerifikasi !== "belum" && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-2.5 ${
                simulasiAktif
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-200"
                  : "bg-rose-950/95 border-rose-500 text-rose-200"
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {simulasiAktif ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{pesanFeedback}</span>
                </div>

                {!simulasiAktif && (
                  <button
                    type="button"
                    onClick={() => {
                      setJumlahClueDibuka((c) =>
                        Math.min(spekHardware.daftarClueLatihan.length, c + 1)
                      );
                      setIntipBayanganSementara(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer shrink-0"
                  >
                    💡 Tampilkan Clue &amp; Bayangan Kabel
                  </button>
                )}
              </div>

              {daftarErrorDetail.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-300 bg-black/40 p-3 rounded-xl border border-rose-500/40">
                  {daftarErrorDetail.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}

              {simulasiAktif && modeBelajar === "tutorial_berkedip" && (
                <div className="pt-1 flex items-center justify-between border-t border-emerald-800">
                  <span className="text-amber-300">
                    🎯 Sudah paham tutorial ini? Coba uji dirimu tanpa bayangan:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      pindahKeLevel(indeksLevel, "latihan_mandiri")
                    }
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-[11px] cursor-pointer"
                  >
                    Coba Mode Latihan Mandiri di Level Ini ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SERIAL MONITOR */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="text-[11px] font-black text-amber-400">
              📟 Serial Monitor &amp; Compiler Output (115200 baud):
            </div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputSerialSimulasi}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};