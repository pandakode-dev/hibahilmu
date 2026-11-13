"use client";

import React, { useState } from "react";
import {
  Code2,
  Copy,
  Eye,
  EyeOff,
  Lightbulb,
  Sparkles,
  BookOpen,
  Target,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";
import { SkenarioLatihanMandiri } from "./wokwiPracticeChallenges";

export interface ItemBarisKodeWajib {
  idBaris: string;
  bagianFungsi: string;
  kodePersis: string;
  penjelasanMudah: string;
  sudahDiketik: boolean;
}

export function ekstrakChecklistBarisKode(
  kodeTarget: string,
  kodeUser: string,
  bersihkanKeHibahIlmu: (t: string) => string,
  bahasa: "cpp" | "micropython" = "cpp"
): ItemBarisKodeWajib[] {
  const targetBersih = bersihkanKeHibahIlmu(kodeTarget || "");
  const userTanpaKomen =
    bahasa === "micropython"
      ? (kodeUser || "").replace(/#.*$/gm, "")
      : (kodeUser || "")
          .replace(/\/\/.*$/gm, "")
          .replace(/\/\*[\s\S]*?\*\//g, "");

  const normalisasi = (s: string) => s.replace(/\s+/g, "");
  const userNorm = normalisasi(userTanpaKomen);

  const barisMentah = targetBersih.split("\n");
  const hasil: ItemBarisKodeWajib[] = [];

  let posisiSaatIni =
    bahasa === "micropython" ? "BAGIAN ATAS (SETUP)" : "HEADER / GLOBAL";

  barisMentah.forEach((b, idx) => {
    const trimmed = b.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) return;

    if (bahasa === "cpp") {
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
    } else {
      if (/^while\s+True\s*:/.test(trimmed)) {
        posisiSaatIni = "while True: (Loop Utama)";
        return;
      }
      if (trimmed === "else:") return;
    }

    let arti =
      bahasa === "micropython"
        ? "Perintah eksekusi MicroPython ESP32."
        : "Baris perintah program C++.";

    if (trimmed.startsWith("from ") || trimmed.startsWith("import ") || trimmed.startsWith("#include")) {
      arti = "Memanggil modul/pustaka perangkat keras yang dibutuhkan.";
    } else if (trimmed.includes("Pin.OUT") || trimmed.includes("OUTPUT")) {
      arti = "Mengatur kaki pin GPIO sebagai keluaran tegangan (OUTPUT).";
    } else if (trimmed.includes("Pin.IN") || trimmed.includes("INPUT")) {
      arti = "Mengatur kaki pin GPIO sebagai pembaca sinyal masuk (INPUT).";
    } else if (trimmed.includes(".value(1)") || trimmed.includes("HIGH")) {
      arti = "Mengirim logika HIGH (3.3V) untuk menyalakan perangkat.";
    } else if (trimmed.includes(".value(0)") || trimmed.includes("LOW")) {
      arti = "Mengirim logika LOW (0V) untuk mematikan perangkat.";
    } else if (trimmed.includes("sleep") || trimmed.includes("delay(")) {
      arti = "Memberi jeda waktu tunggu (milidetik) sebelum perintah berikutnya.";
    } else if (trimmed.includes("ADC(") || trimmed.includes(".read()") || trimmed.includes("analogRead")) {
      arti = "Membaca nilai tegangan analog dari sensor (0 - 4095).";
    } else if (trimmed.includes("PWM(") || trimmed.includes(".duty(") || trimmed.includes("analogWrite")) {
      arti = "Mengatur sinyal modulasi lebar pulsa (PWM) ke aktuator/LED.";
    } else if (trimmed.includes("WLAN") || trimmed.includes("WiFi")) {
      arti = "Menghubungkan radio Wi-Fi ESP32 ke hotspot HibahIlmu-Guest.";
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
  modeBelajar: "tutorial_berkedip" | "latihan_mandiri";
  bahasaAktif: "cpp" | "micropython";
  skenarioLatihan: SkenarioLatihanMandiri;
  kodeTargetAktif: string;
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
  modeBelajar,
  bahasaAktif,
  skenarioLatihan,
  kodeTargetAktif,
  kodeKetikanUser,
  setKodeKetikanUser,
  apakahKabelSudahAda,
  kabelTerpasangCount,
  onBukaPopUpTeori,
  onGunakanKodeLengkap,
  bersihkanKeHibahIlmu,
}) => {
  const [lihatKodeUtuh, setLihatKodeUtuh] = useState<boolean>(false);
  const [jumlahClueLatihanDibuka, setJumlahClueLatihanDibuka] =
    useState<number>(0);

  const isLatihan = modeBelajar === "latihan_mandiri";
  const kodeTargetBersih = bersihkanKeHibahIlmu(kodeTargetAktif);
  const daftarBarisChecklist = ekstrakChecklistBarisKode(
    kodeTargetAktif,
    kodeKetikanUser,
    bersihkanKeHibahIlmu,
    bahasaAktif
  );

  const jumlahBarisSelesai = daftarBarisChecklist.filter(
    (b) => b.sudahDiketik
  ).length;
  const totalBarisWajib = daftarBarisChecklist.length;
  const persenKodeSelesai =
    totalBarisWajib > 0
      ? Math.round((jumlahBarisSelesai / totalBarisWajib) * 100)
      : 100;

  const sisipkanSatuBarisKeEditor = (item: ItemBarisKodeWajib) => {
    if (item.sudahDiketik) return;
    let teksBaru = kodeKetikanUser;

    if (bahasaAktif === "micropython") {
      if (item.bagianFungsi.includes("while True")) {
        if (!/while\s+True\s*:/.test(teksBaru)) {
          teksBaru = `${teksBaru.trimEnd()}\n\nwhile True:\n  ${item.kodePersis}\n`;
        } else {
          teksBaru = `${teksBaru.trimEnd()}\n  ${item.kodePersis}\n`;
        }
      } else {
        const idxWhile = teksBaru.indexOf("while True:");
        if (idxWhile >= 0) {
          teksBaru =
            teksBaru.slice(0, idxWhile).trimEnd() +
            `\n${item.kodePersis}\n\n` +
            teksBaru.slice(idxWhile);
        } else {
          teksBaru = `${teksBaru.trimEnd()}\n${item.kodePersis}\n`;
        }
      }
      setKodeKetikanUser(teksBaru);
      return;
    }

    if (item.bagianFungsi === "void setup()") {
      const matchSetup = teksBaru.match(
        /void\s+setup\s*\(\s*\)\s*\{([\s\S]*?)\}/
      );
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
      const idxLoop = teksBaru.lastIndexOf("}");
      if (idxLoop > 0) {
        teksBaru =
          teksBaru.slice(0, idxLoop).trimEnd() + `\n  ${item.kodePersis}\n}`;
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
      {/* ================================================================= */}
      {/* JIKA MODE LATIHAN MANDIRI AKTIF -> TAMPILKAN NARASI STUDI KASUS!  */}
      {/* ================================================================= */}
      {isLatihan ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/35 border-2 border-rose-500/80 space-y-3 shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> MODE UJIAN LATIHAN MANDIRI (TANPA PANDUAN BERKEDIP)
            </span>
            <button
              type="button"
              onClick={() =>
                setJumlahClueLatihanDibuka((c) =>
                  Math.min(skenarioLatihan.cluesBertahap.length, c + 1)
                )
              }
              className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Buka Clue ({jumlahClueLatihanDibuka}/
              {skenarioLatihan.cluesBertahap.length})
            </button>
          </div>

          <h4 className="font-extrabold text-white text-base">
            📋 {skenarioLatihan.judulKasus}
          </h4>
          <p className="text-rose-100/90 text-xs sm:text-sm leading-relaxed">
            {skenarioLatihan.narasiKasusLapangan}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-500/40 space-y-1.5">
            <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Spesifikasi Pin Baru yang Wajib Kamu Gunakan di Latihan Ini:
            </div>
            <ul className="list-disc list-inside text-xs text-white font-mono space-y-1">
              {skenarioLatihan.daftarPerubahanPin.map((perubahan, idx) => (
                <li key={idx} className="text-emerald-300">
                  {perubahan}
                </li>
              ))}
            </ul>
          </div>

          {jumlahClueLatihanDibuka > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-400/50 space-y-1 text-xs">
              <div className="font-bold text-amber-300">
                💡 Petunjuk Bantuan (Clue):
              </div>
              {skenarioLatihan.cluesBertahap
                .slice(0, jumlahClueLatihanDibuka)
                .map((c, idx) => (
                  <div key={idx} className="text-amber-100">
                    • {c}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        /* JIKA MODE TERPANDU -> TAMPILKAN DASAR TEORI STANDAR */
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
      )}

      {/* 2. CHECKLIST SAMBUNGAN KABEL PIN */}
      <div className="space-y-2">
        <div className="font-bold text-sky-400 text-xs uppercase flex justify-between items-center">
          <span>
            2. Target Sambungan Kabel Pin ({kabelTerpasangCount}/
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
                    {sudah ? "✅" : "🔌"}{" "}
                    {isLatihan
                      ? `Hubungkan kaki [${w.labelPinTujuan}] ke pin [${w.labelPinAsal}]`
                      : w.keteranganJalur}
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

      {/* 3. PANDUAN / CHECKLIST KETIK KODE (MENDUKUNG C++ & MICROPYTHON) */}
      <div className="space-y-3 pt-1 border-t border-slate-800">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
            <Code2 className="w-4 h-4" /> 3.{" "}
            {isLatihan
              ? `Target Logika ${
                  bahasaAktif === "micropython" ? "MicroPython" : "C++"
                } Latihan Mandiri`
              : `Panduan Ketik ${
                  bahasaAktif === "micropython"
                    ? "MicroPython (main.py)"
                    : "C++ (sketch.ino)"
                }`}{" "}
            ({jumlahBarisSelesai}/{totalBarisWajib} Tepat):
          </div>

          {!isLatihan && (
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
          )}
        </div>

        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            style={{ width: `${persenKodeSelesai}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          />
        </div>

        {!isLatihan && lihatKodeUtuh && (
          <div className="p-3.5 rounded-xl bg-black border-2 border-indigo-500/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-300">
                📄 Kunci Jawaban Kode Utuh (
                {bahasaAktif === "micropython" ? "main.py" : "sketch.ino"}):
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
                    {item.sudahDiketik
                      ? "✓ SUDAH TEPAT"
                      : `TARGET #${idx + 1}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[10px] font-bold">
                    {item.bagianFungsi}
                  </span>
                </div>

                {/* Tombol + Sisipkan hanya muncul di Mode Terpandu (atau jika Clue ke-3 sudah dibuka di Latihan) */}
                {!item.sudahDiketik &&
                  (!isLatihan || jumlahClueLatihanDibuka >= 3) && (
                    <button
                      type="button"
                      onClick={() => sisipkanSatuBarisKeEditor(item)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Sparkles className="w-3 h-3" /> + Sisipkan Baris Ini
                    </button>
                  )}
              </div>

              {/* Di Mode Latihan Mandiri, sembunyikan sintaks persis kecuali sudah diketik atau Clue dibuka */}
              {!isLatihan ||
              item.sudahDiketik ||
              jumlahClueLatihanDibuka >= 2 ? (
                <div className="px-3 py-2 rounded-lg bg-black border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 font-bold tracking-wide select-all">
                  {item.kodePersis}
                </div>
              ) : (
                <div className="px-3 py-2 rounded-lg bg-slate-950 border border-dashed border-rose-500/40 font-mono text-xs text-rose-300">
                  🔒 [Ketik sendiri perintah di dalam {item.bagianFungsi} sesuai pin baru latihan, atau klik &quot;Buka Clue&quot; di atas]
                </div>
              )}

              <div className="text-[11px] text-slate-300">
                💡 <strong>Misi Baris Ini:</strong> {item.penjelasanMudah}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};