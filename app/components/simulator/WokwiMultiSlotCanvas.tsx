"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sliders, Trash2, Cable, Volume2, VolumeX, Zap } from "lucide-react";
import {
  PIN_FISIK_ESP32_STANDAR,
  MiniaturSvgGudang48,
  TitikPinFisik,
  ParameterFisikaInteraktif,
} from "./wokwiHardwareVisuals";
import {
  DefinisiSlotPeriferalMultiPin,
  AturanSambunganKabelReal,
  hitungGelangResistorModular,
} from "./wokwiAcademyBlueprints";

export interface KabelMultiPinTersambung {
  pinAsalId: string;
  pinTujuanId: string;
  warna: string;
}

// Hasil pembacaan isi kodingan C++ siswa secara real-time!
export interface HasilAnalisisKodeRuntime {
  delayMs: number;
  adaKedipHighLow: boolean;
  adaHighSaja: boolean;
  nilaiPwmKode: number | null; // Jika ada analogWrite(pin, val)
  frekuensiBuzzerHz: number; // Dari tone() atau nilai PPM/ADC
  ambangBatasSensor: number | null; // Dari if (adc < ...) atau if (ppm >= ...)
}

export function analisisPerilakuKodeCpp(kode: string): HasilAnalisisKodeRuntime {
  const bersih = (kode || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  // 1. Baca nilai delay(...) di dalam kode siswa
  const matchDelay = bersih.match(/delay\s*\(\s*(\d+)\s*\)/);
  const delayMs = matchDelay ? Math.max(80, parseInt(matchDelay[1], 10)) : 800;

  // 2. Cek apakah kode menyalakan HIGH dan mematikan LOW (berkedip) atau hanya HIGH terus
  const adaHigh = /HIGH/.test(bersih) || /analogWrite/.test(bersih) || /write\s*\(/.test(bersih);
  const adaLow = /LOW/.test(bersih);
  const adaKedipHighLow = adaHigh && adaLow && /delay\s*\(/.test(bersih);
  const adaHighSaja = adaHigh && !adaKedipHighLow;

  // 3. Cek nilai analogWrite(pin, nilai) di kode
  const matchPwm = bersih.match(/analogWrite\s*\(\s*\d+\s*,\s*(\d+)\s*\)/);
  const nilaiPwmKode = matchPwm
    ? Math.min(255, Math.max(0, parseInt(matchPwm[1], 10)))
    : null;

  // 4. Cek frekuensi tone(pin, freq) jika ada
  const matchTone = bersih.match(/tone\s*\(\s*\d+\s*,\s*(\d+)/);
  const frekuensiBuzzerHz = matchTone ? parseInt(matchTone[1], 10) : 880;

  // 5. Cek ambang batas if (misal if (ppm >= 500) atau if (adc < 1000))
  const matchThreshold = bersih.match(/if\s*\([^)]*?[<>]=?\s*(\d+)/);
  const ambangBatasSensor = matchThreshold
    ? parseInt(matchThreshold[1], 10)
    : null;

  return {
    delayMs,
    adaKedipHighLow,
    adaHighSaja,
    nilaiPwmKode,
    frekuensiBuzzerHz,
    ambangBatasSensor,
  };
}

const PILIHAN_OHM_RESISTOR = [100, 220, 330, 470, 1000, 4700, 10000];

const PIN_ESP32_KANVAS_LEBAR: TitikPinFisik[] = PIN_FISIK_ESP32_STANDAR.map(
  (p) => ({
    ...p,
    x: p.x < 100 ? 48 : 204,
    y: p.y + 18,
  })
);

function buatJalurKabelSikuSiku(
  p1: TitikPinFisik,
  p2: TitikPinFisik,
  indeksJalur: number
): { pathSvg: string; midX: number; midY: number } {
  const aIsLeft = p1.x <= p2.x;
  const A = aIsLeft ? p1 : p2;
  const B = aIsLeft ? p2 : p1;
  const offset = ((indeksJalur % 7) - 3) * 7;

  if (A.posisiKomponen === "periferal" && B.posisiKomponen === "periferal") {
    if (Math.abs(A.x - B.x) < 15) {
      const xSaluran = A.x - 36 + offset;
      const midY = (A.y + B.y) / 2;
      return {
        pathSvg: `M ${A.x} ${A.y} L ${xSaluran} ${A.y} L ${xSaluran} ${B.y} L ${B.x} ${B.y}`,
        midX: xSaluran,
        midY,
      };
    } else {
      const yLorongTengah = 154 + offset;
      const xKiriA = A.x - 24;
      const xKiriB = B.x - 24;
      const midX = (xKiriA + xKiriB) / 2;
      return {
        pathSvg: `M ${A.x} ${A.y} L ${xKiriA} ${A.y} L ${xKiriA} ${yLorongTengah} L ${xKiriB} ${yLorongTengah} L ${xKiriB} ${B.y} L ${B.x} ${B.y}`,
        midX,
        midY: yLorongTengah,
      };
    }
  }

  if (A.x <= 55) {
    const xLuarKiri = 18 + (indeksJalur % 3) * 5;
    const yBawahEsp = 282 + (indeksJalur % 3) * 6;
    if (B.x < 500) {
      const xKoridor1 = 265 + offset;
      return {
        pathSvg: `M ${A.x} ${A.y} L ${xLuarKiri} ${A.y} L ${xLuarKiri} ${yBawahEsp} L ${xKoridor1} ${yBawahEsp} L ${xKoridor1} ${B.y} L ${B.x} ${B.y}`,
        midX: xKoridor1,
        midY: (yBawahEsp + B.y) / 2,
      };
    } else {
      const xKoridorAntarKolom = B.x - 32 + offset;
      return {
        pathSvg: `M ${A.x} ${A.y} L ${xLuarKiri} ${A.y} L ${xLuarKiri} ${yBawahEsp} L ${xKoridorAntarKolom} ${yBawahEsp} L ${xKoridorAntarKolom} ${B.y} L ${B.x} ${B.y}`,
        midX: xKoridorAntarKolom,
        midY: (yBawahEsp + B.y) / 2,
      };
    }
  }

  if (B.x >= 550) {
    const xKoridor1 = 258 + offset;
    const yLorongTengah = 154 + offset;
    const xKoridor2 = B.x - 28 + offset;
    return {
      pathSvg: `M ${A.x} ${A.y} L ${xKoridor1} ${A.y} L ${xKoridor1} ${yLorongTengah} L ${xKoridor2} ${yLorongTengah} L ${xKoridor2} ${B.y} L ${B.x} ${B.y}`,
      midX: (xKoridor1 + xKoridor2) / 2,
      midY: yLorongTengah,
    };
  }

  const xTengah = Math.round((A.x + B.x) / 2) + offset;
  const midY = (A.y + B.y) / 2;
  return {
    pathSvg: `M ${A.x} ${A.y} L ${xTengah} ${A.y} L ${xTengah} ${B.y} L ${B.x} ${B.y}`,
    midX: xTengah,
    midY,
  };
}

export const WokwiMultiSlotCanvas: React.FC<{
  kanvasContainerRef: React.RefObject<HTMLDivElement | null>;
  getarMerahRangkaian: boolean;
  statusVerifikasi: "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus";
  simulasiAktif: boolean;
  detakSimulasi: number;
  slot1Esp32Terpasang: boolean;
  setSlot1Esp32Terpasang: (v: boolean) => void;
  daftarSlotPeriferal: DefinisiSlotPeriferalMultiPin[];
  slotPeriferalTerpasangMap: Record<
    number,
    { terpasang: boolean; namaKartu: string; idKartu: string }
  >;
  handleDropKeSlotTertentu: (nomorSlot: number) => void;
  itemSedangDiDrag: any;
  pesanGudang: string;
  setPesanGudang: (msg: string) => void;
  totalKomponenWajib: number;
  slotPeriferalKosongBerikutnya: DefinisiSlotPeriferalMultiPin | null;
  sambunganBerkedipTarget: AturanSambunganKabelReal | null;
  semuaSambunganWajibLevelIni: AturanSambunganKabelReal[];
  kabelTerpasangList: KabelMultiPinTersambung[];
  setKabelTerpasangList: React.Dispatch<
    React.SetStateAction<KabelMultiPinTersambung[]>
  >;
  pinAwalDiklik: TitikPinFisik | null;
  setPinAwalDiklik: (p: TitikPinFisik | null) => void;
  posisiKursorSvg: { x: number; y: number };
  setPosisiKursorSvg: (pos: { x: number; y: number }) => void;
  handleKlikTitikPinFisik: (e: React.MouseEvent, pin: TitikPinFisik) => void;
  tampilkanBayanganPanduan: boolean;
  semuaKomponenSudahDitaruh: boolean;
  pinYangSalahAtauKurangIds: string[];
  fisika: ParameterFisikaInteraktif;
  setFisika: React.Dispatch<React.SetStateAction<ParameterFisikaInteraktif>>;
  kodeKetikanUser?: string;
}> = ({
  kanvasContainerRef,
  getarMerahRangkaian,
  statusVerifikasi,
  simulasiAktif,
  detakSimulasi,
  slot1Esp32Terpasang,
  setSlot1Esp32Terpasang,
  daftarSlotPeriferal,
  slotPeriferalTerpasangMap,
  handleDropKeSlotTertentu,
  itemSedangDiDrag,
  pesanGudang,
  setPesanGudang,
  totalKomponenWajib,
  slotPeriferalKosongBerikutnya,
  sambunganBerkedipTarget,
  semuaSambunganWajibLevelIni,
  kabelTerpasangList,
  setKabelTerpasangList,
  pinAwalDiklik,
  setPinAwalDiklik,
  posisiKursorSvg,
  setPosisiKursorSvg,
  handleKlikTitikPinFisik,
  tampilkanBayanganPanduan,
  semuaKomponenSudahDitaruh,
  pinYangSalahAtauKurangIds,
  fisika,
  setFisika,
  kodeKetikanUser = "",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [suaraBuzzerAktif, setSuaraBuzzerAktif] = useState<boolean>(true);
  const [detakKodeDinamis, setDetakKodeDinamis] = useState<number>(0);

  const infoResistor = hitungGelangResistorModular(fisika.nilaiOhmResistor);
  const perilakuKode = analisisPerilakuKodeCpp(kodeKetikanUser);

  // Hitung besarnya sinyal/intensitas (0.15 s.d. 1.0) dari kodingan PWM + Resistor + Slider Fisika
  const pwmAktif = perilakuKode.nilaiPwmKode ?? fisika.pwmLedBrightness;
  const faktorHambatan =
    fisika.nilaiOhmResistor <= 220
      ? 1.0
      : fisika.nilaiOhmResistor <= 1000
      ? 0.72
      : 0.42;
  const kekuatanSinyal = Math.max(0.18, (pwmAktif / 255) * faktorHambatan);

  // Cek apakah ada komponen Buzzer di rangkaian yang sedang aktif
  const adaBuzzerTerpasang = daftarSlotPeriferal.some(
    (s) =>
      slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang &&
      (s.idGambarMiniatur.includes("buzzer") ||
        s.namaTarget.toLowerCase().includes("buzzer"))
  );

  // Timer detak yang kecepatannya mengikuti nilai delay(...) di dalam kodingan C++ siswa!
  useEffect(() => {
    if (!simulasiAktif) {
      setDetakKodeDinamis(0);
      return;
    }
    const timer = setInterval(() => {
      setDetakKodeDinamis((d) => d + 1);
    }, perilakuKode.delayMs);
    return () => clearInterval(timer);
  }, [simulasiAktif, perilakuKode.delayMs]);

  // Synthesizer Suara Buzzer Piezo Nyata (Web Audio API) saat Running & Buzzer Menyala!
  useEffect(() => {
    if (!simulasiAktif || !suaraBuzzerAktif || !adaBuzzerTerpasang) return;
    const faseHidup = perilakuKode.adaKedipHighLow
      ? detakKodeDinamis % 2 === 0
      : true;
    if (!faseHidup) return;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Frekuensi nada buzzer tergantung besarnya sinyal PPM Gas / PWM
      const freq =
        perilakuKode.frekuensiBuzzerHz +
        Math.round((fisika.kadarGasPpm - 300) * 0.6);
      osc.type = "square";
      osc.frequency.setValueAtTime(Math.max(440, Math.min(2200, freq)), ctx.currentTime);

      gain.gain.setValueAtTime(0.04 * kekuatanSinyal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.17);
      setTimeout(() => ctx.close().catch(() => {}), 220);
    } catch {
      // Abaikan jika browser memblokir autoplay audio sebelum klik
    }
  }, [
    simulasiAktif,
    detakKodeDinamis,
    suaraBuzzerAktif,
    adaBuzzerTerpasang,
    fisika.kadarGasPpm,
    kekuatanSinyal,
    perilakuKode.adaKedipHighLow,
    perilakuKode.frekuensiBuzzerHz,
  ]);

  const lebarKanvas = 940;
  const tinggiKanvas = Math.max(
    315,
    daftarSlotPeriferal.reduce((m, s) => Math.max(m, s.boxY + s.boxH + 34), 315)
  );

  const semuaTitikPinPeta: Record<string, TitikPinFisik> = {};
  PIN_ESP32_KANVAS_LEBAR.forEach((p) => {
    semuaTitikPinPeta[p.idPin] = p;
  });
  daftarSlotPeriferal.forEach((slot) => {
    slot.daftarPinKomponenIni.forEach((p) => {
      semuaTitikPinPeta[p.idPin] = p;
    });
  });

  const hapusSatuKabelTertentu = (indexKabel: number) => {
    const kabelDihapus = kabelTerpasangList[indexKabel];
    const l1 =
      semuaTitikPinPeta[kabelDihapus?.pinAsalId]?.labelPin ||
      kabelDihapus?.pinAsalId;
    const l2 =
      semuaTitikPinPeta[kabelDihapus?.pinTujuanId]?.labelPin ||
      kabelDihapus?.pinTujuanId;

    setKabelTerpasangList((prev) =>
      prev.filter((_, idx) => idx !== indexKabel)
    );
    setPesanGudang(`🗑️ 1 Kabel (${l1} ↔ ${l2}) berhasil dilepas!`);
  };

  const handleMouseMoveSvg = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pinAwalDiklik || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = lebarKanvas / rect.width;
    const scaleY = tinggiKanvas / rect.height;
    setPosisiKursorSvg({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  const pinAsalBerkedipObj = sambunganBerkedipTarget
    ? semuaTitikPinPeta[sambunganBerkedipTarget.pinAsalId]
    : null;
  const pinTujuanBerkedipObj = sambunganBerkedipTarget
    ? semuaTitikPinPeta[sambunganBerkedipTarget.pinTujuanId]
    : null;

  const jalurPanduanSiku =
    pinAsalBerkedipObj && pinTujuanBerkedipObj
      ? buatJalurKabelSikuSiku(
          pinAsalBerkedipObj,
          pinTujuanBerkedipObj,
          kabelTerpasangList.length
        )
      : null;

  // Apakah pada detak ini komponen output sedang dalam siklus HIGH (Menyala)?
  // HANYA menyala jika simulasiAktif === true (Tombol Periksa & Jalankan sudah diklik dan lulus)!
  const sedangFaseHighKode =
    simulasiAktif &&
    (perilakuKode.adaKedipHighLow ? detakKodeDinamis % 2 === 0 : true);

  return (
    <div
      ref={kanvasContainerRef}
      className={`bg-[#090d16] rounded-3xl border-2 p-4 sm:p-5 relative overflow-hidden shadow-2xl transition ${
        getarMerahRangkaian
          ? "animate-error-shake border-rose-500 bg-rose-950/20"
          : statusVerifikasi === "gagal_rangkaian"
          ? "border-rose-500"
          : simulasiAktif
          ? "border-emerald-400 shadow-emerald-950/50"
          : "border-slate-800"
      }`}
    >
      {/* Baris Status Eksekusi Runtime & Tombol Mute Suara Buzzer */}
      <div className="mb-3 flex flex-wrap justify-between items-center gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full font-extrabold text-[11px] flex items-center gap-1.5 ${
              simulasiAktif
                ? "bg-emerald-400 text-slate-950 animate-pulse"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {simulasiAktif
              ? `⚡ RUNNING LIVE (Delay Kode: ${perilakuKode.delayMs} ms | Sinyal: ${Math.round(
                  kekuatanSinyal * 100
                )}%)`
              : "⏹ STANDBY (Komponen Mati — Klik 'Periksa & Jalankan' untuk Menyalakan)"}
          </span>
        </div>

        {adaBuzzerTerpasang && (
          <button
            type="button"
            onClick={() => setSuaraBuzzerAktif(!suaraBuzzerAktif)}
            className={`px-3 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border ${
              suaraBuzzerAktif
                ? "bg-pink-950/80 border-pink-500 text-pink-200"
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            {suaraBuzzerAktif ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-pink-400" /> 🔊 Suara Buzzer: ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" /> 🔇 Suara Buzzer: MUTE
              </>
            )}
          </button>
        )}
      </div>

      {/* Baris Indikator Slot */}
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div
          onClick={() => {
            if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
          }}
          className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
            slot1Esp32Terpasang
              ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
              : "bg-amber-950/40 border-amber-400 text-amber-200 animate-pulse"
          }`}
        >
          <span className="truncate">Slot #1: ESP32 DevKit V1</span>
          <span className="shrink-0 ml-1">
            {slot1Esp32Terpasang ? "✓ Terpasang" : "📦 Tarik ke Sini"}
          </span>
        </div>

        {daftarSlotPeriferal.map((slot) => {
          const sudah = slotPeriferalTerpasangMap[slot.nomorSlot]?.terpasang;
          return (
            <div
              key={slot.nomorSlot}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotTertentu(slot.nomorSlot);
              }}
              className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
                sudah
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-sky-950/40 border-sky-400 text-sky-200 animate-pulse"
              }`}
            >
              <span className="truncate">
                Slot #{slot.nomorSlot}: {slot.namaTarget}
              </span>
              <span className="shrink-0 ml-1">
                {sudah ? "✓ Terpasang" : "📦 Tarik ke Sini"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Banner Panduan Langkah */}
      <div className="mb-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-300 flex flex-wrap justify-between items-center gap-2">
        <span>
          {pesanGudang ||
            (!slot1Esp32Terpasang
              ? `👉 Langkah 1/${totalKomponenWajib}: Tarik 'ESP32 DevKit V1' dari Gudang ke kotak [Slot #1] di sebelah kiri!`
              : slotPeriferalKosongBerikutnya
              ? `👉 Langkah Berikutnya: Tarik '${slotPeriferalKosongBerikutnya.namaTarget}' dari Gudang ke kotak [Slot #${slotPeriferalKosongBerikutnya.nomorSlot}] di sebelah kanan!`
              : sambunganBerkedipTarget
              ? `🔌 Hubungkan Semua Kaki Pin (${kabelTerpasangList.length}/${semuaSambunganWajibLevelIni.length}): ${sambunganBerkedipTarget.keteranganJalur}`
              : simulasiAktif
              ? `🎉 SIMULASI RUNNING! Komponen menyala & bergerak mengikuti kodingan C++ kamu!`
              : `✅ Seluruh Komponen & Kaki Pin Terhubung! Sekarang klik tombol hijau '1. Periksa Semua Kaki & Jalankan' di bawah agar komponen menyala!`)}
        </span>
      </div>

      {/* KANVAS UTAMA DENGAN JALUR KABEL SIKU-SIKU & EFEK VISUAL BERBASIS KODE */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${lebarKanvas} ${tinggiKanvas}`}
        onMouseMove={handleMouseMoveSvg}
        onClick={() => {
          if (pinAwalDiklik) setPinAwalDiklik(null);
        }}
        className="w-full min-h-[340px] sm:min-h-[430px] select-none"
      >
        {/* Grid Titik Breadboard */}
        {Array.from({ length: 33 }).map((_, gx) =>
          Array.from({ length: Math.ceil(tinggiKanvas / 28) }).map((__, gy) => (
            <circle
              key={`${gx}-${gy}`}
              cx={20 + gx * 28}
              cy={20 + gy * 28}
              r={1.6}
              fill="#1e293b"
            />
          ))
        )}

        {/* SLOT #1: PAPAN ESP32 */}
        {!slot1Esp32Terpasang ? (
          <g
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDropKeSlotTertentu(1);
            }}
            onClick={() => {
              if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
              else setSlot1Esp32Terpasang(true);
            }}
            className="cursor-pointer"
          >
            <rect
              x={44}
              y={20}
              width={164}
              height={236}
              rx={16}
              fill="rgba(250, 204, 21, 0.08)"
              stroke="#facc15"
              strokeWidth={2.5}
              strokeDasharray="8 5"
            >
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </rect>
            <text
              x={126}
              y={122}
              textAnchor="middle"
              fill="#facc15"
              fontSize="11.5"
              fontWeight="bold"
            >
              📦 SLOT #1 (MCU):
            </text>
            <text
              x={126}
              y={142}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              ESP32 DevKit V1
            </text>
          </g>
        ) : (
          <g>
            <rect
              x={48}
              y={20}
              width={156}
              height={236}
              rx={12}
              fill="#1e293b"
              stroke={simulasiAktif ? "#34d399" : "#64748b"}
              strokeWidth={2.2}
            />
            <rect
              x={76}
              y={27}
              width={100}
              height={32}
              rx={5}
              fill="#cbd5e1"
              stroke="#475569"
            />
            <text
              x={126}
              y={47}
              textAnchor="middle"
              fill="#0f172a"
              fontSize="9.5"
              fontWeight="bold"
            >
              ESP-WROOM-32
            </text>

            {/* LED Power & LED Biru GPIO 2 (HANYA menyala saat simulasiAktif === true!) */}
            <circle
              cx={108}
              cy={234}
              r={4}
              fill={simulasiAktif ? "#ef4444" : "#450a0a"}
            />
            {sedangFaseHighKode && (
              <circle
                cx={144}
                cy={234}
                r={12 * kekuatanSinyal + 6}
                fill="rgba(56, 189, 248, 0.45)"
              />
            )}
            <circle
              cx={144}
              cy={234}
              r={5.5}
              fill={sedangFaseHighKode ? "#38bdf8" : "#0f172a"}
              stroke="#64748b"
              strokeWidth={1.2}
            />
            <rect
              x={106}
              y={244}
              width={40}
              height={14}
              rx={3}
              fill="#94a3b8"
            />

            {PIN_ESP32_KANVAS_LEBAR.map((pin) => {
              const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
              const harusBerkedip =
                tampilkanBayanganPanduan &&
                semuaKomponenSudahDitaruh &&
                (sambunganBerkedipTarget?.pinAsalId === pin.idPin ||
                  sambunganBerkedipTarget?.pinTujuanId === pin.idPin);
              const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                pin.idPin
              );
              const isKanan = pin.x > 126;

              return (
                <g
                  key={pin.idPin}
                  onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                  className="cursor-pointer"
                >
                  {adalahPinSalah && (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={15}
                      fill="rgba(244, 63, 94, 0.35)"
                      stroke="#f43f5e"
                      strokeWidth={3}
                    >
                      <animate
                        attributeName="r"
                        values="7;17;7"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {harusBerkedip && !adalahPinSalah && (
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
                        values="7;16;7"
                        dur="0.85s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <rect
                    x={isKanan ? pin.x - 62 : pin.x + 11}
                    y={pin.y - 8}
                    width={51}
                    height={16}
                    rx={4}
                    fill={
                      adalahPinSalah
                        ? "#e11d48"
                        : harusBerkedip
                        ? "#facc15"
                        : "#0f172a"
                    }
                    opacity={0.96}
                  />
                  <text
                    x={isKanan ? pin.x - 36.5 : pin.x + 36.5}
                    y={pin.y + 3}
                    textAnchor="middle"
                    fill={
                      adalahPinSalah
                        ? "#ffffff"
                        : harusBerkedip
                        ? "#0f172a"
                        : "#f8fafc"
                    }
                    fontSize="8.2"
                    fontWeight="bold"
                  >
                    {pin.labelPin}
                  </text>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={sedangDipegang || adalahPinSalah ? 9 : 6.5}
                    fill={
                      adalahPinSalah
                        ? "#f43f5e"
                        : sedangDipegang
                        ? "#ffffff"
                        : harusBerkedip
                        ? "#facc15"
                        : pin.warnaPin
                    }
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* =============================================================== */}
        {/* SLOT KOMPONEN PERIFERAL (DIAM SAAT STANDBY, AKTIF SAAT RUNNING) */}
        {/* =============================================================== */}
        {daftarSlotPeriferal.map((slot, idxSlot) => {
          const infoTerpasang = slotPeriferalTerpasangMap[slot.nomorSlot];
          const sudahTerpasang = Boolean(infoTerpasang?.terpasang);

          if (!sudahTerpasang) {
            return (
              <g
                key={slot.nomorSlot}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropKeSlotTertentu(slot.nomorSlot);
                }}
                onClick={() => {
                  if (itemSedangDiDrag)
                    handleDropKeSlotTertentu(slot.nomorSlot);
                  else
                    setPesanGudang(
                      `👆 Tarik (Drag) kartu '${slot.namaTarget}' dari Gudang Komponen di atas ke kotak Slot #${slot.nomorSlot} ini!`
                    );
                }}
                className="cursor-pointer"
              >
                <rect
                  x={slot.boxX}
                  y={slot.boxY}
                  width={slot.boxW}
                  height={slot.boxH}
                  rx={14}
                  fill="rgba(56, 189, 248, 0.07)"
                  stroke={
                    slotPeriferalKosongBerikutnya?.nomorSlot === slot.nomorSlot
                      ? "#facc15"
                      : "#38bdf8"
                  }
                  strokeWidth={2.2}
                  strokeDasharray="7 5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </rect>
                <text
                  x={slot.boxX + slot.boxW / 2}
                  y={slot.boxY + slot.boxH / 2 - 6}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  📦 SLOT #{slot.nomorSlot} (BELUM DITARIK):
                </text>
                <text
                  x={slot.boxX + slot.boxW / 2}
                  y={slot.boxY + slot.boxH / 2 + 13}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  {slot.namaTarget}
                </text>
              </g>
            );
          }

          const idKomp = (
            infoTerpasang.idKartu || slot.idGambarMiniatur
          ).toLowerCase();
          const namaKomp = (
            infoTerpasang.namaKartu || slot.namaTarget
          ).toLowerCase();

          const adalahLed =
            idKomp.includes("led") && !idKomp.includes("oled");
          const adalahBuzzer =
            idKomp.includes("buzzer") || namaKomp.includes("buzzer");
          const adalahKipasAtauPompa =
            idKomp.includes("kipas") ||
            idKomp.includes("pompa") ||
            idKomp.includes("servo");

          // Untuk lampu lalu lintas (>1 LED), buat bergantian Merah vs Hijau saat Running
          const ledMenyalaSaatIni =
            simulasiAktif &&
            (perilakuKode.adaKedipHighLow
              ? idxSlot % 2 === 0
                ? detakKodeDinamis % 2 === 0
                : detakKodeDinamis % 2 === 1
              : true);

          const iconX = slot.boxX + slot.boxW - 84;
          const iconY = slot.boxY + 32;
          const centerX = iconX + 36;
          const centerY = iconY + 33;

          return (
            <g key={slot.nomorSlot}>
              <rect
                x={slot.boxX}
                y={slot.boxY}
                width={slot.boxW}
                height={slot.boxH}
                rx={14}
                fill={simulasiAktif ? "#071f1b" : "#111827"}
                stroke={
                  simulasiAktif
                    ? ledMenyalaSaatIni
                      ? "#34d399"
                      : "#0d9488"
                    : "#475569"
                }
                strokeWidth={2.2}
              />

              {/* Header Status Slot: Menampilkan OFF saat belum Running, dan ON + Nilai Sinyal saat Running! */}
              <rect
                x={slot.boxX + 12}
                y={slot.boxY + 8}
                width={slot.boxW - 24}
                height={20}
                rx={5}
                fill="#090d16"
              />
              <text
                x={slot.boxX + 20}
                y={slot.boxY + 21}
                fill={simulasiAktif ? "#34d399" : "#94a3b8"}
                fontSize="8.8"
                fontWeight="bold"
              >
                SLOT #{slot.nomorSlot}:{" "}
                {(infoTerpasang.namaKartu || slot.namaTarget).slice(0, 20)}{" "}
                {simulasiAktif
                  ? adalahLed
                    ? ledMenyalaSaatIni
                      ? `💡 ON (${Math.round(kekuatanSinyal * 100)}%)`
                      : "⚫ OFF (LOW)"
                    : adalahBuzzer
                    ? ledMenyalaSaatIni
                      ? `🔊 BEEP! (${perilakuKode.frekuensiBuzzerHz}Hz)`
                      : "🔇 SILENT"
                    : "⚡ ACTIVE"
                  : "[STANDBY / OFF]"}
              </text>

              {/* ========================================================= */}
              {/* EFEK VISUAL AKTIF SAAT RUNNING (TERGANTUNG KODINGAN!)     */}
              {/* ========================================================= */}
              {/* 1. Pendaran Cahaya (Glow Halo) LED sesuai PWM & Resistor */}
              {adalahLed && ledMenyalaSaatIni && (
                <>
                  <circle
                    cx={centerX}
                    cy={centerY - 4}
                    r={16 + kekuatanSinyal * 26}
                    fill={
                      idKomp.includes("hijau")
                        ? `rgba(34, 197, 94, ${(0.45 * kekuatanSinyal).toFixed(2)})`
                        : `rgba(239, 68, 68, ${(0.48 * kekuatanSinyal).toFixed(2)})`
                    }
                  />
                  <circle
                    cx={centerX}
                    cy={centerY - 4}
                    r={8 + kekuatanSinyal * 12}
                    fill="rgba(254, 240, 138, 0.65)"
                  />
                </>
              )}

              {/* 2. Gelombang Sinyal Suara Buzzer sesuai besarnya Sinyal / PPM */}
              {adalahBuzzer && ledMenyalaSaatIni && (
                <g>
                  {[1, 2, 3].map((ring) => (
                    <circle
                      key={ring}
                      cx={centerX - 4}
                      cy={centerY}
                      r={10 + ring * (8 * kekuatanSinyal)}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={2.2}
                    >
                      <animate
                        attributeName="r"
                        values={`10;${18 + ring * 14};10`}
                        dur="0.45s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.95;0.05;0.95"
                        dur="0.45s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                  <text
                    x={centerX}
                    y={slot.boxY + slot.boxH - 6}
                    textAnchor="middle"
                    fill="#fda4af"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    🔊 BEEP {perilakuKode.frekuensiBuzzerHz}Hz!
                  </text>
                </g>
              )}

              {/* 3. Indikator Putaran / Aliran Aktuator */}
              {adalahKipasAtauPompa && simulasiAktif && (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={24}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${centerX} ${centerY}`}
                    to={`360 ${centerX} ${centerY}`}
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Render Ikon Komponen: Redup/Diam jika belum Running, Terang jika Running! */}
              <g
                opacity={
                  !simulasiAktif
                    ? 0.55
                    : adalahLed && !ledMenyalaSaatIni
                    ? 0.35
                    : 1
                }
              >
                <svg
                  x={iconX}
                  y={iconY}
                  width={72}
                  height={66}
                  viewBox="0 0 64 56"
                >
                  <MiniaturSvgGudang48
                    idItem={infoTerpasang.idKartu || slot.idGambarMiniatur}
                    namaItem=""
                    nilaiOhmResistor={fisika.nilaiOhmResistor}
                  />
                </svg>
              </g>

              {/* Masking Penghenti Animasi Bawaan Saat Belum Running (Agar Tidak Kedap-Kedip Sebelum Running!) */}
              {!simulasiAktif && adalahLed && (
                <circle
                  cx={centerX}
                  cy={centerY - 6}
                  r={12}
                  fill="#450a0a"
                  opacity={0.75}
                  pointerEvents="none"
                />
              )}

              {/* Titik Kaki Pin pada Komponen Ini */}
              {slot.daftarPinKomponenIni.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  semuaKomponenSudahDitaruh &&
                  (sambunganBerkedipTarget?.pinAsalId === pin.idPin ||
                    sambunganBerkedipTarget?.pinTujuanId === pin.idPin);
                const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                  pin.idPin
                );

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={pin.x}
                      y1={pin.y}
                      x2={pin.x + 14}
                      y2={pin.y}
                      stroke="#94a3b8"
                      strokeWidth={3}
                    />

                    <rect
                      x={pin.x + 14}
                      y={pin.y - 10}
                      width={132}
                      height={20}
                      rx={5}
                      fill={
                        adalahPinSalah
                          ? "#e11d48"
                          : harusBerkedip
                          ? "#facc15"
                          : "#0f172a"
                      }
                      stroke={harusBerkedip ? "#ffffff" : "#334155"}
                      strokeWidth={1.2}
                    />
                    <text
                      x={pin.x + 80}
                      y={pin.y + 3.5}
                      textAnchor="middle"
                      fill={
                        adalahPinSalah
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#0f172a"
                          : "#f8fafc"
                      }
                      fontSize="8.8"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>

                    {adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={16}
                        fill="rgba(244, 63, 94, 0.35)"
                        stroke="#f43f5e"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="8;18;8"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {harusBerkedip && !adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={15}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="7;16;7"
                          dur="0.85s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang || adalahPinSalah ? 9 : 7}
                      fill={
                        adalahPinSalah
                          ? "#f43f5e"
                          : sedangDipegang
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#facc15"
                          : pin.warnaPin
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* GARIS BAYANGAN PANDUAN SIKU-SIKU */}
        {semuaKomponenSudahDitaruh &&
          tampilkanBayanganPanduan &&
          jalurPanduanSiku && (
            <path
              pointerEvents="none"
              d={jalurPanduanSiku.pathSvg}
              fill="none"
              stroke="#facc15"
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="8 6"
              opacity={0.85}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="28"
                to="0"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
          )}

        {/* KABEL SIKU-SIKU SAAT MENGIKUTI KURSOR MOUSE */}
        {pinAwalDiklik && (
          <path
            pointerEvents="none"
            d={`M ${pinAwalDiklik.x} ${pinAwalDiklik.y} L ${
              (pinAwalDiklik.x + posisiKursorSvg.x) / 2
            } ${pinAwalDiklik.y} L ${
              (pinAwalDiklik.x + posisiKursorSvg.x) / 2
            } ${posisiKursorSvg.y} L ${posisiKursorSvg.x} ${posisiKursorSvg.y}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={4}
            strokeLinejoin="round"
            strokeDasharray="5 4"
          />
        )}

        {/* KABEL TERPASANG SIKU-SIKU + ANIMASI ALIRAN SINYAL LISTRIK SAAT RUNNING! */}
        {kabelTerpasangList.map((k, idx) => {
          const p1 = semuaTitikPinPeta[k.pinAsalId];
          const p2 = semuaTitikPinPeta[k.pinTujuanId];
          if (!p1 || !p2) return null;

          const adalahValid = semuaSambunganWajibLevelIni.some(
            (w) =>
              (w.pinAsalId === k.pinAsalId &&
                w.pinTujuanId === k.pinTujuanId) ||
              (w.pinAsalId === k.pinTujuanId &&
                w.pinTujuanId === k.pinAsalId)
          );

          const ruteSiku = buatJalurKabelSikuSiku(p1, p2, idx);

          return (
            <g
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                hapusSatuKabelTertentu(idx);
              }}
              className="cursor-pointer"
            >
              <path
                d={ruteSiku.pathSvg}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                strokeLinejoin="round"
              />
              {/* Kabel dasar */}
              <path
                d={ruteSiku.pathSvg}
                fill="none"
                stroke={adalahValid ? k.warna : "#f43f5e"}
                strokeWidth={4}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={adalahValid ? "none" : "6 4"}
                opacity={simulasiAktif ? 0.95 : 0.75}
              />

              {/* Pulsa Sinyal Listrik Mengalir di Sepanjang Kabel Siku-Siku Saat Running! */}
              {simulasiAktif && adalahValid && sedangFaseHighKode && (
                <path
                  d={ruteSiku.pathSvg}
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth={2.5 + kekuatanSinyal * 2.5}
                  strokeLinejoin="round"
                  strokeDasharray="10 18"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="56"
                    to="0"
                    dur={`${Math.max(0.25, 0.85 - kekuatanSinyal * 0.45).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </path>
              )}

              {/* Tombol Hapus 1 Kabel */}
              <circle
                cx={ruteSiku.midX}
                cy={ruteSiku.midY}
                r={8.5}
                fill={adalahValid ? "#0f172a" : "#e11d48"}
                stroke={adalahValid ? k.warna : "#ffffff"}
                strokeWidth={1.8}
              />
              <text
                x={ruteSiku.midX}
                y={ruteSiku.midY + 3}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
              >
                ✕
              </text>
            </g>
          );
        })}
      </svg>

      {/* BARIS CHIP DAFTAR KABEL INDIVIDUAL */}
      <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sky-400 flex items-center gap-1">
            <Cable className="w-4 h-4" /> Kabel Siku-Siku Terpasang (Klik ✕ untuk hapus 1 kabel saja):
          </span>

          {kabelTerpasangList.length === 0 ? (
            <span className="text-slate-400 italic">
              Belum ada kabel. Klik titik kaki ke-1 lalu klik titik kaki ke-2 di kanvas!
            </span>
          ) : (
            kabelTerpasangList.map((k, idx) => {
              const label1 =
                semuaTitikPinPeta[k.pinAsalId]?.labelPin || k.pinAsalId;
              const label2 =
                semuaTitikPinPeta[k.pinTujuanId]?.labelPin || k.pinTujuanId;
              const adalahValid = semuaSambunganWajibLevelIni.some(
                (w) =>
                  (w.pinAsalId === k.pinAsalId &&
                    w.pinTujuanId === k.pinTujuanId) ||
                  (w.pinAsalId === k.pinTujuanId &&
                    w.pinTujuanId === k.pinAsalId)
              );

              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 ${
                    adalahValid
                      ? "bg-slate-950 border-emerald-500/50 text-emerald-300"
                      : "bg-rose-950 border-rose-500 text-rose-200 animate-pulse"
                  }`}
                >
                  <span>
                    {adalahValid ? "✓" : "❌ SALAH:"} {label1} ↔ {label2}
                  </span>
                  <button
                    type="button"
                    onClick={() => hapusSatuKabelTertentu(idx)}
                    className="px-1.5 py-0.5 rounded bg-rose-600/80 hover:bg-rose-500 text-white font-black cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              );
            })
          )}
        </div>

        {kabelTerpasangList.length > 1 && (
          <button
            type="button"
            onClick={() => setKabelTerpasangList([])}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3 h-3" /> Hapus Semua
          </button>
        )}
      </div>

      {/* PANEL SIMULATOR FISIKA */}
      <div className="mt-3 bg-slate-900/95 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" /> Pengatur Parameter Fisika &amp; Kekuatan Sinyal Live:
          </span>
          <span className="font-mono text-amber-300">
            Resistor: <strong>{infoResistor.labelFormatted}</strong> ({infoResistor.teksGelang})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">💡 Besar Sinyal / PWM LED:</span>
              <span className="text-amber-300">
                {Math.round(kekuatanSinyal * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={255}
              value={fisika.pwmLedBrightness}
              onChange={(e) =>
                setFisika((f) => ({
                  ...f,
                  pwmLedBrightness: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">🎨 Nilai &amp; Gelang Resistor:</span>
              <span className="text-emerald-400">
                {infoResistor.labelFormatted}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PILIHAN_OHM_RESISTOR.map((nilai) => (
                <button
                  key={nilai}
                  type="button"
                  onClick={() =>
                    setFisika((f) => ({ ...f, nilaiOhmResistor: nilai }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    fisika.nilaiOhmResistor === nilai
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {nilai >= 1000 ? `${nilai / 1000}kΩ` : `${nilai}Ω`}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">🔥 Suhu &amp; Sinyal Gas/Buzzer:</span>
              <span className="text-rose-400">
                {fisika.suhuCelcius}°C | {fisika.kadarGasPpm} PPM
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min={20}
                max={55}
                value={fisika.suhuCelcius}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    suhuCelcius: Number(e.target.value),
                  }))
                }
                className="w-1/2"
              />
              <input
                type="range"
                min={150}
                max={950}
                value={fisika.kadarGasPpm}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    kadarGasPpm: Number(e.target.value),
                  }))
                }
                className="w-1/2"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">📡 Jarak Objek Ultrasonik:</span>
              <span className="text-sky-400">{fisika.jarakUltrasonikCm} cm</span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              value={fisika.jarakUltrasonikCm}
              onChange={(e) =>
                setFisika((f) => ({
                  ...f,
                  jarakUltrasonikCm: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};