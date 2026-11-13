"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Code2,
  Copy,
  Eye,
  EyeOff,
  Lightbulb,
  Sparkles,
  Terminal,
  Wrench,
  BookOpen,
} from "lucide-react";
import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";

export interface ItemBarisKodeWajib {
  idBaris: string;
  bagianFungsi: "HEADER / GLOBAL" | "void setup()" | "void loop()";
  kodePersis: string;
  penjelasanMudah: string;
  sudahDiketik: boolean;
}

// Otomatis mengekstrak baris-baris perintah penting dari kodeTargetBenar agar Instruksi & Validasi 100% SAMA PERSIS!
export function ekstrakChecklistBarisKode(
  kodeTarget: string,
  kodeUser: string,
  bersihkanKeHibahIlmu: (t: string) => string
): ItemBarisKodeWajib[] {
  const targetBersih = bersihkanKeHibahIlmu(kodeTarget || "");
  const userTanpaKomen = (kodeUser || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  // Normalisasi tanpa spasi agar spasi ekstra tidak membuat siswa gagal
  const normalisasi = (s: string) => s.replace(/\s+/g, "");
  const userNorm = normalisasi(userTanpaKomen);

  const barisMentah = targetBersih.split("\n");
  const hasil: ItemBarisKodeWajib[] = [];

  let posisiSaatIni: "HEADER / GLOBAL" | "void setup()" | "void loop()" =
    "HEADER / GLOBAL";

  barisMentah.forEach((b, idx) => {
    const trimmed = b.trim();
    if (!trimmed || trimmed.startsWith("//")) return;

    if (/void\s+setup\s*\(\s*\)/.test(trimmed)) {
      posisiSaatIni = "void setup()";
      return;
    }
    if (/void\s+loop\s*\(\s*\)/.test(trimmed)) {
      posisiSaatIni = "void loop()";
      return;
    }
    if (trimmed === "{" || trimmed === "}" || trimmed === "} else {") {
      return;
    }

    // Buat penjelasan bahasa manusia otomatis untuk setiap baris kode
    let arti = "Baris perintah program C++.";
    if (trimmed.startsWith("#include")) {
      arti = "Memanggil pustaka (library) pendukung perangkat keras.";
    } else if (trimmed.startsWith("#define")) {
      arti = "Mendefinisikan konstanta tetap atau identitas token/node.";
    } else if (trimmed.includes("Serial.begin")) {
      arti = "Mengaktifkan komunikasi Serial Monitor pada kecepatan 115200 bps.";
    } else if (trimmed.includes("pinMode") && trimmed.includes("OUTPUT")) {
      arti = "Mengatur kaki pin GPIO sebagai pengeluar tegangan (OUTPUT).";
    } else if (trimmed.includes("pinMode") && trimmed.includes("INPUT")) {
      arti = "Mengatur kaki pin GPIO sebagai pembaca sinyal masuk (INPUT).";
    } else if (trimmed.includes("digitalWrite") && trimmed.includes("HIGH")) {
      arti = "Mengirim listrik 3.3V (HIGH) untuk menyalakan komponen.";
    } else if (trimmed.includes("digitalWrite") && trimmed.includes("LOW")) {
      arti = "Memutus aliran listrik 0V (LOW) untuk mematikan komponen.";
    } else if (trimmed.includes("delay(")) {
      arti = "Memberi jeda waktu tunggu (dalam satuan milidetik).";
    } else if (trimmed.includes("analogRead")) {
      arti = "Membaca nilai sensor analog (skala 0 sampai 4095).";
    } else if (trimmed.includes("digitalRead")) {
      arti = "Membaca status sakelar/tombol digital (HIGH atau LOW).";
    } else if (trimmed.includes("analogWrite")) {
      arti = "Mengirim sinyal PWM (0-255) untuk mengatur terang/kecepatan.";
    } else if (trimmed.includes("attachInterrupt")) {
      arti = "Mendaftarkan interupsi perangkat keras instan pada pin.";
    } else if (trimmed.includes("timerBegin") || trimmed.includes("timerAlarm")) {
      arti = "Mengatur pewaktu Hardware Timer internal ESP32 tanpa delay.";
    } else if (trimmed.includes("WiFi.begin") || trimmed.includes("WiFi.mode")) {
      arti = "Menghubungkan radio ESP32 ke jaringan Wi-Fi HibahIlmu-Guest.";
    } else if (trimmed.includes("server.")) {
      arti = "Menjalankan layanan HTTP Web Server di dalam ESP32.";
    } else if (trimmed.includes("Blynk.")) {
      arti = "Menyinkronkan data dengan aplikasi Cloud Blynk IoT.";
    } else if (trimmed.includes(".attach") || trimmed.includes(".write")) {
      arti = "Mengendalikan sudut putaran lengan Motor Servo.";
    } else if (trimmed.includes("Serial.print") || trimmed.includes("Serial2.")) {
      arti = "Mencetak pesan atau mengirim paket data ke jalur Serial.";
    }

    const barisNorm = normalisasi(trimmed);
    const sudahDiketik = userNorm.includes(barisNorm);

    hasil.push({
      idBaris: `LINE_${idx}`,
      bagianFungsi: posisiSaatIni,
      kodePersis: trimmed,
      penjelasanMudah: arti,
      sudahDiketik,
    });
  });

  return hasil;
}

export const WokwiCodeAssistantPanel: React.FC<{
  materiAktif: ExtendedLessonStepIoT;
  blueprint: BlueprintMultiPinLevel;
  kodeKetikanUser: string;
  setKodeKetikanUser: (kodeBaru: string) => void;
  apakahKabelSudahAda: (p1: string, p2: string) => boolean;
  kabelTerpasangCount: number;
  onBukaPopUpTeori: () => void;
  onGunakanKodeLengkap: () => void;
  bersihkanKeHibahIlmu: (t: string) => string;
}> = ({
  materiAktif,
  blueprint,
  kodeKetikanUser,
  setKodeKetikanUser,
  apakahKabelSudahAda,
  kabelTerpasangCount,
  onBukaPopUpTeori,
  onGunakanKodeLengkap,
  bersihkanKeHibahIlmu,
}) => {
  const [lihatKodeUtuh, setLihatKodeUtuh] = useState<boolean>(false);

  const kodeTargetBersih = bersihkanKeHibahIlmu(materiAktif.kodeTargetBenar);
  const daftarBarisChecklist = ekstrakChecklistBarisKode(
    materiAktif.kodeTargetBenar,
    kodeKetikanUser,
    bersihkanKeHibahIlmu
  );

  const jumlahBarisSelesai = daftarBarisChecklist.filter(
    (b) => b.sudahDiketik
  ).length;
  const totalBarisWajib = daftarBarisChecklist.length;
  const persenKodeSelesai =
    totalBarisWajib > 0
      ? Math.round((jumlahBarisSelesai / totalBarisWajib) * 100)
      : 100;

  // Fungsi untuk menyisipkan 1 baris kode ke tempat yang tepat di editor jika siswa kesulitan mengetik
  const sisipkanSatuBarisKeEditor = (item: ItemBarisKodeWajib) => {
    if (item.sudahDiketik) return;

    let teksBaru = kodeKetikanUser;
    if (item.bagianFungsi === "void setup()") {
      // Masukkan sebelum kurung tutup '}' milik void setup()
      const matchSetup = teksBaru.match(/void\s+setup\s*\(\s*\)\s*\{([\s\S]*?)\}/);
      if (matchSetup) {
        const isiSetupLama = matchSetup[1];
        const isiSetupBaru = `${isiSetupLama.trimEnd()}\n  ${item.kodePersis}\n`;
        teksBaru = teksBaru.replace(
          matchSetup[0],
          `void setup() {\n${isiSetupBaru.trimStart()}}`
        );
      } else {
        teksBaru += `\n${item.kodePersis}`;
      }
    } else if (item.bagianFungsi === "void loop()") {
      // Masukkan ke dalam void loop()
      const idxLoop = teksBaru.lastIndexOf("}");
      if (idxLoop > 0) {
        teksBaru =
          teksBaru.slice(0, idxLoop).trimEnd() +
          `\n  ${item.kodePersis}\n}`;
      } else {
        teksBaru += `\n${item.kodePersis}`;
      }
    } else {
      teksBaru = `${item.kodePersis}\n` + teksBaru;
    }

    setKodeKetikanUser(teksBaru);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 text-sm">
      {/* 1. RINGKASAN TEORI & TOMBOL POP-UP */}
      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" /> 1. Dasar Teori &amp; Aliran Arus Rangkaian:
          </div>
          <button
            type="button"
            onClick={onBukaPopUpTeori}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-400/50 text-indigo-200 hover:bg-indigo-600 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <BookOpen className="w-3 h-3" /> Lihat Skema Gambar
          </button>
        </div>
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
          {blueprint.analogiMudahPaham}
        </p>
      </div>

      {/* 2. CHECKLIST SAMBUNGAN KABEL PIN */}
      <div className="space-y-2">
        <div className="font-bold text-sky-400 text-xs uppercase flex justify-between items-center">
          <span>
            2. Checklist Kaki Pin yang Wajib Disambung ({kabelTerpasangCount}/
            {blueprint.sambunganWajibList.length} Kabel):
          </span>
          {kabelTerpasangCount >= blueprint.sambunganWajibList.length && (
            <span className="text-emerald-400 text-[11px]">
              ✓ Rangkaian Siap!
            </span>
          )}
        </div>

        {blueprint.sambunganWajibList.length === 0 ? (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            ✅ Materi Standalone 1-Board ESP32: Tidak memerlukan kabel luar!
          </div>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {blueprint.sambunganWajibList.map((w) => {
              const sudah = apakahKabelSudahAda(w.pinAsalId, w.pinTujuanId);
              return (
                <div
                  key={w.idSambungan}
                  className={`p-2.5 rounded-xl border font-mono text-xs flex justify-between items-center ${
                    sudah
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-amber-300"
                  }`}
                >
                  <span>
                    {sudah ? "✅" : "🔌"} {w.keteranganJalur}
                  </span>
                  <span className="text-[10px] font-bold shrink-0 ml-2">
                    {sudah ? "TERSAMBUNG" : "BELUM"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. PANDUAN KETIK KODE INTERAKTIF BARIS DEMI BARIS (100% COCOK DENGAN HASIL!) */}
      <div className="space-y-3 pt-1 border-t border-slate-800">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
            <Code2 className="w-4 h-4" /> 3. Panduan Ketik Kode C++ Baris demi Baris ({jumlahBarisSelesai}/{totalBarisWajib} Baris Tepat):
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLihatKodeUtuh(!lihatKodeUtuh)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              {lihatKodeUtuh ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Tutup Kode Utuh
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Intip Kode Utuh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar Kelengkapan Kodingan */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            style={{ width: `${persenKodeSelesai}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          />
        </div>

        {/* Jika tombol Intip Kode Utuh dibuka, tampilkan blok kode lengkap yang bisa disalin 1 klik */}
        {lihatKodeUtuh && (
          <div className="p-3.5 rounded-xl bg-black border-2 border-indigo-500/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-300">
                📄 Kunci Jawaban Kode Utuh Level {materiAktif.level} (sketch.ino):
              </span>
              <button
                type="button"
                onClick={onGunakanKodeLengkap}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Salin ke Editor Kanan ➔
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
              {kodeTargetBersih}
            </pre>
          </div>
        )}

        {/* Daftar Checklist Baris Kode (Otomatis Hijau Saat Diketik Siswa!) */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {daftarBarisChecklist.map((item, idx) => (
            <div
              key={item.idBaris}
              className={`p-3 rounded-xl border transition space-y-1.5 ${
                item.sudahDiketik
                  ? "bg-emerald-950/30 border-emerald-500/60"
                  : "bg-slate-900/90 border-amber-500/40"
              }`}
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      item.sudahDiketik
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-amber-400 text-slate-950"
                    }`}
                  >
                    {item.sudahDiketik ? "✓ SUDAH DIKETIK" : `LANGKAH #${idx + 1}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[10px] font-bold">
                    Di dalam: {item.bagianFungsi}
                  </span>
                </div>

                {!item.sudahDiketik && (
                  <button
                    type="button"
                    onClick={() => sisipkanSatuBarisKeEditor(item)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Sparkles className="w-3 h-3" /> + Sisipkan Baris Ini
                  </button>
                )}
              </div>

              {/* Kotak Kode Persis yang Harus Diketik */}
              <div className="px-3 py-2 rounded-lg bg-black border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 font-bold tracking-wide select-all">
                {item.kodePersis}
              </div>

              <div className="text-[11px] text-slate-300">
                💡 <strong>Fungsi:</strong> {item.penjelasanMudah}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};