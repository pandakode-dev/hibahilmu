"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Sliders,
  Trash2,
  Cable,
  Volume2,
  VolumeX,
  Zap,
  Hand,
  Gauge,
  Sun,
  Flame,
  CreditCard,
  Radio,
} from "lucide-react";
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

export interface HasilAnalisisKodeRuntime {
  delayMs: number;
  adaKedipHighLow: boolean;
  adaHighSaja: boolean;
  nilaiPwmKode: number | null;
  frekuensiBuzzerHz: number;
  ambangBatasSensor: number | null;
  operatorPerbandingan: "<" | "<=" | ">" | ">=" | "==" | null;
  adaInterruptKode: boolean;
}

export function analisisPerilakuKodeCpp(kode: string): HasilAnalisisKodeRuntime {
  const bersih = (kode || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const matchDelay = bersih.match(/(?:delay|sleep_ms)\s*\(\s*(\d+)\s*\)/);
  const delayMs = matchDelay ? Math.max(80, parseInt(matchDelay[1], 10)) : 800;

  const adaHigh =
    /HIGH|\.value\(\s*1\s*\)/.test(bersih) ||
    /analogWrite|\.duty\s*\(/.test(bersih) ||
    /\.write\s*\(/.test(bersih);
  const adaLow = /LOW|\.value\(\s*0\s*\)/.test(bersih);
  const adaKedipHighLow =
    adaHigh && adaLow && /(?:delay|sleep_ms)\s*\(/.test(bersih);
  const adaHighSaja = adaHigh && !adaKedipHighLow;

  const matchPwm = bersih.match(
    /(?:analogWrite\s*\(\s*\d+\s*,\s*(\d+)\s*\)|\.duty\s*\(\s*(\d+)\s*\))/
  );
  const nilaiPwmKode = matchPwm
    ? Math.min(255, Math.max(0, parseInt(matchPwm[1] || matchPwm[2], 10)))
    : null;

  const matchTone = bersih.match(/tone\s*\(\s*\d+\s*,\s*(\d+)/);
  const frekuensiBuzzerHz = matchTone ? parseInt(matchTone[1], 10) : 880;

  const matchCond = bersih.match(
    /if\s*\(?[^{:\n]*?(<=|>=|<|>|==)\s*(\d+(?:\.\d+)?)/
  );
  const operatorPerbandingan = matchCond ? (matchCond[1] as any) : null;
  const ambangBatasSensor = matchCond ? parseFloat(matchCond[2]) : null;

  const adaInterruptKode =
    /attachInterrupt|IRAM_ATTR|irq\s*\(/.test(bersih);

  return {
    delayMs,
    adaKedipHighLow,
    adaHighSaja,
    nilaiPwmKode,
    frekuensiBuzzerHz,
    ambangBatasSensor,
    operatorPerbandingan,
    adaInterruptKode,
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

  // ==========================================================================
  // STATE INTERAKSI FISIK PENGGUNA (WAJIB DIINTERAKSI DULU BARU AKTUATOR HIDUP!)
  // ==========================================================================
  // 1. Push Button: default false (BELUM DITEKAN -> Aktuator MATI!)
  const [tombolFisikDitekan, setTombolFisikDitekan] = useState<boolean>(false);
  // 2. Potensiometer ADC (0 - 4095): default 0 (BELUM DIPUTAR -> Aktuator MATI!)
  const [adcPotensioPutar, setAdcPotensioPutar] = useState<number>(0);
  // 3. Kelembapan Tanah Soil (0 - 100%): default 75% (Tanah Lembab -> Pompa MATI!)
  const [soilMoisturePersen, setSoilMoisturePersen] = useState<number>(75);

  const infoResistor = hitungGelangResistorModular(fisika.nilaiOhmResistor);
  const perilakuKode = analisisPerilakuKodeCpp(kodeKetikanUser);

  // Deteksi jenis komponen Input/Sensor apa saja yang ada di modul ini
  const teksSemuaSlot = daftarSlotPeriferal
    .map((s) => `${s.idGambarMiniatur} ${s.namaTarget}`.toLowerCase())
    .join(" ");

  const modulPunyaPushButton =
    teksSemuaSlot.includes("button") ||
    teksSemuaSlot.includes("tombol") ||
    teksSemuaSlot.includes("keypad");
  const modulPunyaPotensio =
    teksSemuaSlot.includes("potensiometer") ||
    teksSemuaSlot.includes("potensio");
  const modulPunyaLdr =
    teksSemuaSlot.includes("ldr") || teksSemuaSlot.includes("cahaya");
  const modulPunyaUltrasonik =
    teksSemuaSlot.includes("ultrasonik") || teksSemuaSlot.includes("sr04");
  const modulPunyaRfid =
    teksSemuaSlot.includes("rfid") || teksSemuaSlot.includes("rc522");
  const modulPunyaDhtAtauSoil =
    teksSemuaSlot.includes("dht") ||
    teksSemuaSlot.includes("suhu") ||
    teksSemuaSlot.includes("soil") ||
    teksSemuaSlot.includes("kelembapan");
  const modulPunyaMq2AtauFlame =
    teksSemuaSlot.includes("mq") ||
    teksSemuaSlot.includes("gas") ||
    teksSemuaSlot.includes("flame") ||
    teksSemuaSlot.includes("api");

  const adaKomponenInputInteraktif =
    modulPunyaPushButton ||
    modulPunyaPotensio ||
    modulPunyaLdr ||
    modulPunyaUltrasonik ||
    modulPunyaRfid ||
    modulPunyaDhtAtauSoil ||
    modulPunyaMq2AtauFlame;

  // SAAT SIMULASI BARU SAJA DIMULAI (simulasiAktif berubah jadi true),
  // SET SELURUH SENSOR KE KONDISI NORMAL/IDLE AGAR AKTUATOR TIDAK LANGSUNG MENYALA SENDIRI!
  useEffect(() => {
    if (simulasiAktif) {
      setTombolFisikDitekan(false); // Tombol belum ditekan
      setAdcPotensioPutar(0); // Potensiometer masih di 0
      setSoilMoisturePersen(70); // Tanah masih lembab
      setFisika((prev) => ({
        ...prev,
        luxCahaya: modulPunyaLdr ? 850 : prev.luxCahaya, // Siang terang (850 Lux) -> Lampu jalan OFF
        jarakUltrasonikCm: modulPunyaUltrasonik ? 85 : prev.jarakUltrasonikCm, // Mobil masih jauh (85 cm) -> Palang Servo OFF
        rfidKartuDekat: modulPunyaRfid ? false : prev.rfidKartuDekat, // Kartu belum di-tap -> Solenoid OFF
        suhuCelcius: modulPunyaDhtAtauSoil ? 27.5 : prev.suhuCelcius, // Suhu sejuk (27.5°C) -> Kipas & Pompa OFF
        kadarGasPpm: modulPunyaMq2AtauFlame ? 210 : prev.kadarGasPpm, // Udara bersih (210 PPM) -> Sirine Buzzer OFF
        apiTerdeteksi: modulPunyaMq2AtauFlame ? false : prev.apiTerdeteksi, // Tidak ada api
      }));
    }
  }, [
    simulasiAktif,
    modulPunyaLdr,
    modulPunyaUltrasonik,
    modulPunyaRfid,
    modulPunyaDhtAtauSoil,
    modulPunyaMq2AtauFlame,
    setFisika,
  ]);

  // ==========================================================================
  // EVALUASI APAKAH SYARAT INTERAKSI FISIK SUDAH TERPENUHI OLEH PENGGUNA?
  // ==========================================================================
  let syaratInteraksiTerpenuhi = true;
  let instruksiInteraksiSaatIni = "";

  if (modulPunyaPushButton) {
    syaratInteraksiTerpenuhi = tombolFisikDitekan;
    instruksiInteraksiSaatIni = tombolFisikDitekan
      ? "✅ Tombol Ditekan (LOW) ➔ Aktuator Menyala!"
      : "👆 Klik tombol [TEKAN TOMBOL] pada komponen Push Button di kanvas untuk menyalakan aktuator!";
  } else if (modulPunyaPotensio) {
    // Target putaran potensio: minimal >= 2048 (50% / 1.65V) atau sesuai ambang batas di kode
    const targetAdc = perilakuKode.ambangBatasSensor ?? 1000;
    syaratInteraksiTerpenuhi = adcPotensioPutar >= targetAdc;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `✅ Potensiometer di ${adcPotensioPutar} ADC (Melampaui target >= ${targetAdc}) ➔ Sistem & PWM LED Aktif!`
      : `🎛️ Putar slider Potensiometer di kanvas hingga melewati >= ${targetAdc} ADC (Saat ini: ${adcPotensioPutar} ADC) agar sistem bekerja!`;
  } else if (modulPunyaLdr) {
    const batasGelap = 400;
    syaratInteraksiTerpenuhi = fisika.luxCahaya < batasGelap;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `✅ Kondisi Gelap Malam (${fisika.luxCahaya} Lux) ➔ Relay & Lampu Jalan Menyala!`
      : `☀️ Saat ini Siang Terang (${fisika.luxCahaya} Lux -> Relay OFF). Geser slider Cahaya LDR ke < ${batasGelap} Lux (Malam) agar Relay menyala!`;
  } else if (modulPunyaUltrasonik && modulPunyaRfid) {
    const batasJarak = perilakuKode.ambangBatasSensor ?? 30;
    syaratInteraksiTerpenuhi =
      fisika.jarakUltrasonikCm < batasJarak || fisika.rfidKartuDekat;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `✅ Akses Terdeteksi (Jarak ${fisika.jarakUltrasonikCm}cm / RFID Valid) ➔ Palang Servo & Solenoid Terbuka!`
      : `🚗 Objek masih jauh (${fisika.jarakUltrasonikCm} cm) & Kartu RFID belum di-tap. Dekatkan jarak ke < ${batasJarak} cm atau Klik [TAP KARTU RFID] agar pintu terbuka!`;
  } else if (modulPunyaUltrasonik) {
    const batasJarak = perilakuKode.ambangBatasSensor ?? 30;
    syaratInteraksiTerpenuhi = fisika.jarakUltrasonikCm < batasJarak;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `✅ Kendaraan Dekat (${fisika.jarakUltrasonikCm} cm < ${batasJarak} cm) ➔ Palang Servo Terbuka 90°!`
      : `🚗 Kendaraan masih jauh (${fisika.jarakUltrasonikCm} cm -> Servo 0°). Geser slider Jarak Ultrasonik ke < ${batasJarak} cm agar palang terbuka!`;
  } else if (modulPunyaRfid) {
    syaratInteraksiTerpenuhi = fisika.rfidKartuDekat;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? "✅ Kartu RFID E-KTP Ditempelkan ➔ Solenoid Lock & Servo Terbuka!"
      : "🪪 Klik tombol [TEMPELKAN KARTU RFID] pada komponen RFID di kanvas untuk membuka kunci Solenoid!";
  } else if (modulPunyaMq2AtauFlame) {
    const batasPpm = perilakuKode.ambangBatasSensor ?? 500;
    syaratInteraksiTerpenuhi =
      fisika.kadarGasPpm >= batasPpm || fisika.apiTerdeteksi;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `🚨 BAHAYA TERDETEKSI (Gas ${fisika.kadarGasPpm} PPM / Api Menyala) ➔ Sirine Buzzer & Pompa Sprinkler Aktif!`
      : `🛡️ Kondisi Aman (${fisika.kadarGasPpm} PPM -> Alarm OFF). Naikkan slider Gas MQ-2 ke >= ${batasPpm} PPM atau nyalakan Api untuk memicu Sirine & Pompa!`;
  } else if (modulPunyaDhtAtauSoil && !teksSemuaSlot.includes("npk")) {
    const batasSuhu = perilakuKode.ambangBatasSensor ?? 32;
    syaratInteraksiTerpenuhi =
      fisika.suhuCelcius > batasSuhu || soilMoisturePersen < 40;
    instruksiInteraksiSaatIni = syaratInteraksiTerpenuhi
      ? `🔥 Suhu Panas (${fisika.suhuCelcius}°C > ${batasSuhu}°C) / Tanah Kering ➔ Kipas Exhaust & Pompa Air Menyala!`
      : `🌱 Suhu Rumah Kaca Normal (${fisika.suhuCelcius}°C -> Kipas & Pompa OFF). Naikkan slider Suhu DHT22 ke > ${batasSuhu}°C agar Kipas & Pompa bekerja!`;
  }

  // Hitung besarnya sinyal/intensitas (0.0 s.d. 1.0)
  const pwmDariPotensio = Math.round((adcPotensioPutar / 4095) * 255);
  const pwmAktif = modulPunyaPotensio
    ? pwmDariPotensio
    : perilakuKode.nilaiPwmKode ?? fisika.pwmLedBrightness;

  const faktorHambatan =
    fisika.nilaiOhmResistor <= 220
      ? 1.0
      : fisika.nilaiOhmResistor <= 1000
      ? 0.72
      : 0.42;
  const kekuatanSinyal = syaratInteraksiTerpenuhi
    ? Math.max(0.2, (pwmAktif / 255) * faktorHambatan)
    : 0;

  const adaBuzzerTerpasang = daftarSlotPeriferal.some(
    (s) =>
      slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang &&
      (s.idGambarMiniatur.includes("buzzer") ||
        s.namaTarget.toLowerCase().includes("buzzer"))
  );

  // Timer detak hanya berdetak saat simulasiAktif DAN syaratInteraksiTerpenuhi!
  useEffect(() => {
    if (!simulasiAktif || !syaratInteraksiTerpenuhi) {
      setDetakKodeDinamis(0);
      return;
    }
    const timer = setInterval(() => {
      setDetakKodeDinamis((d) => d + 1);
    }, perilakuKode.delayMs);
    return () => clearInterval(timer);
  }, [simulasiAktif, syaratInteraksiTerpenuhi, perilakuKode.delayMs]);

  // Apakah pada detak ini aktuator sedang menyala (HIGH)?
  const sedangFaseHighKode =
    simulasiAktif &&
    syaratInteraksiTerpenuhi &&
    (perilakuKode.adaKedipHighLow && !adaKomponenInputInteraktif
      ? detakKodeDinamis % 2 === 0
      : true);

  // Synthesizer Suara Buzzer Piezo Nyata (HANYA berbunyi jika syaratInteraksiTerpenuhi === true!)
  useEffect(() => {
    if (
      !simulasiAktif ||
      !syaratInteraksiTerpenuhi ||
      !suaraBuzzerAktif ||
      !adaBuzzerTerpasang ||
      !sedangFaseHighKode
    )
      return;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq =
        perilakuKode.frekuensiBuzzerHz +
        Math.round((fisika.kadarGasPpm - 200) * 0.7);
      osc.type = "square";
      osc.frequency.setValueAtTime(
        Math.max(440, Math.min(2400, freq)),
        ctx.currentTime
      );

      gain.gain.setValueAtTime(
        Math.max(0.02, 0.05 * kekuatanSinyal),
        ctx.currentTime
      );
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.17);
      setTimeout(() => ctx.close().catch(() => {}), 220);
    } catch {
      // Abaikan jika audio diblokir browser
    }
  }, [
    simulasiAktif,
    syaratInteraksiTerpenuhi,
    detakKodeDinamis,
    suaraBuzzerAktif,
    adaBuzzerTerpasang,
    fisika.kadarGasPpm,
    kekuatanSinyal,
    sedangFaseHighKode,
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

  return (
    <div
      ref={kanvasContainerRef}
      className={`bg-[#090d16] rounded-3xl border-2 p-4 sm:p-5 relative overflow-hidden shadow-2xl transition ${
        getarMerahRangkaian
          ? "animate-error-shake border-rose-500 bg-rose-950/20"
          : statusVerifikasi === "gagal_rangkaian"
          ? "border-rose-500"
          : simulasiAktif
          ? syaratInteraksiTerpenuhi
            ? "border-emerald-400 shadow-emerald-950/50"
            : "border-amber-400 shadow-amber-950/40"
          : "border-slate-800"
      }`}
    >
      {/* BARIS STATUS RUNTIME & PANDUAN INTERAKSI FISIK */}
      <div className="mb-3 flex flex-wrap justify-between items-center gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full font-extrabold text-[11px] flex items-center gap-1.5 ${
              !simulasiAktif
                ? "bg-slate-800 text-slate-400"
                : syaratInteraksiTerpenuhi
                ? "bg-emerald-400 text-slate-950 animate-pulse"
                : "bg-amber-400 text-slate-950 animate-bounce"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {!simulasiAktif
              ? "⏹ STANDBY (Komponen Mati — Klik 'Periksa & Jalankan' untuk Memulai)"
              : syaratInteraksiTerpenuhi
              ? `⚡ RUNNING & TRIGGERED (Aktuator Bekerja | Sinyal: ${Math.round(
                  kekuatanSinyal * 100
                )}%)`
              : "⏳ RUNNING — MENUNGGU INTERAKSI SENSOR / TOMBOL DI BAWAH!"}
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

      {/* =================================================================== */}
      {/* PANEL INTERAKSI FISIK REAL-TIME (MUNCUL SAAT MODUL BUTUH INTERAKSI) */}
      {/* Pengguna WAJIB menekan tombol / memutar potensio dulu baru hidup!   */}
      {/* =================================================================== */}
      {simulasiAktif && adaKomponenInputInteraktif && (
        <div
          className={`mb-3 p-3.5 rounded-2xl border-2 transition space-y-2.5 ${
            syaratInteraksiTerpenuhi
              ? "bg-emerald-950/40 border-emerald-500/80"
              : "bg-amber-950/40 border-amber-400"
          }`}
        >
          <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Hand className="w-4 h-4 text-amber-400" />
              PANEL UJI INTERAKSI FISIK PERANGKAT KERAS (SEPERTI ALAT ASLI):
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                syaratInteraksiTerpenuhi
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-amber-400 text-slate-950"
              }`}
            >
              {syaratInteraksiTerpenuhi
                ? "✓ SYARAT TERPENUHI (AKTUATOR HIDUP)"
                : "⚠️ BELUM DIINTERAKSI (AKTUATOR MATI)"}
            </span>
          </div>

          <p className="text-xs text-amber-200 font-semibold">
            {instruksiInteraksiSaatIni}
          </p>

          {/* Kontrol Interaksi Spesifik sesuai Komponen Modul */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {modulPunyaPushButton && (
              <>
                <button
                  type="button"
                  onMouseDown={() => setTombolFisikDitekan(true)}
                  onMouseUp={() => {
                    if (!perilakuKode.adaInterruptKode)
                      setTombolFisikDitekan(false);
                  }}
                  onClick={() => setTombolFisikDitekan((v) => !v)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition transform active:scale-95 ${
                    tombolFisikDitekan
                      ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50"
                      : "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  {tombolFisikDitekan
                    ? "👇 TOMBOL SEDANG DITEKAN (GPIO LOW) — Klik untuk Lepas"
                    : "👆 KLIK / TEKAN PUSH BUTTON SEKARANG!"}
                </button>
              </>
            )}

            {modulPunyaPotensio && (
              <div className="flex-1 min-w-[260px] bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sky-300 flex items-center gap-1">
                    <Gauge className="w-4 h-4" /> Putar Knop Potensiometer 10kΩ:
                  </span>
                  <span className="text-amber-300 font-mono">
                    ADC: {adcPotensioPutar} / 4095 (
                    {((adcPotensioPutar / 4095) * 3.3).toFixed(2)}V | PWM:{" "}
                    {pwmDariPotensio})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4095}
                  step={15}
                  value={adcPotensioPutar}
                  onChange={(e) => setAdcPotensioPutar(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 ADC (0V - Mati)</span>
                  <span className="text-emerald-400 font-bold">
                    Target Aktif: &gt;= {perilakuKode.ambangBatasSensor ?? 1000} ADC
                  </span>
                  <span>4095 ADC (3.3V - Penuh)</span>
                </div>
              </div>
            )}

            {modulPunyaLdr && (
              <div className="flex-1 min-w-[260px] bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    <Sun className="w-4 h-4" /> Intensitas Cahaya Langit (Sensor LDR):
                  </span>
                  <span className="text-emerald-300 font-mono">
                    {fisika.luxCahaya} Lux (
                    {fisika.luxCahaya < 400 ? "🌙 Malam Gelap" : "☀️ Siang Terang"})
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1000}
                  value={fisika.luxCahaya}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      luxCahaya: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setFisika((f) => ({ ...f, luxCahaya: 120 }))}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] cursor-pointer"
                  >
                    🌙 Buat Malam Gelap (120 Lux ➔ Lampu ON)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFisika((f) => ({ ...f, luxCahaya: 850 }))}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                  >
                    ☀️ Buat Siang Terang (850 Lux ➔ Lampu OFF)
                  </button>
                </div>
              </div>
            )}

            {modulPunyaUltrasonik && (
              <div className="flex-1 min-w-[260px] bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sky-300 flex items-center gap-1">
                    <Radio className="w-4 h-4" /> Jarak Kendaraan ke Sensor Ultrasonik:
                  </span>
                  <span className="text-amber-300 font-mono">
                    {fisika.jarakUltrasonikCm} cm (Target Buka: &lt;{" "}
                    {perilakuKode.ambangBatasSensor ?? 30} cm)
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  value={fisika.jarakUltrasonikCm}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      jarakUltrasonikCm: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, jarakUltrasonikCm: 15 }))
                    }
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] cursor-pointer"
                  >
                    🚗 Dekatkan Mobil (15 cm ➔ Palang Buka)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, jarakUltrasonikCm: 85 }))
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                  >
                    🚙 Jauhkan Mobil (85 cm ➔ Palang Tutup)
                  </button>
                </div>
              </div>
            )}

            {modulPunyaRfid && (
              <button
                type="button"
                onClick={() =>
                  setFisika((f) => ({
                    ...f,
                    rfidKartuDekat: !f.rfidKartuDekat,
                  }))
                }
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition ${
                  fisika.rfidKartuDekat
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-sky-600 hover:bg-sky-500 text-white animate-pulse"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {fisika.rfidKartuDekat
                  ? "🪪 KARTU E-KTP DITEMPEL (AKSES VALID) — Klik untuk Jauhkan"
                  : "🪪 KLIK UNTUK TEMPELKAN KARTU RFID KE READER!"}
              </button>
            )}

            {modulPunyaMq2AtauFlame && (
              <div className="flex-1 min-w-[260px] bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-400 flex items-center gap-1">
                    <Flame className="w-4 h-4" /> Kepekatan Gas LPG MQ-2 &amp; Sensor Api:
                  </span>
                  <span className="text-amber-300 font-mono">
                    {fisika.kadarGasPpm} PPM (Ambang Bahaya: &gt;={" "}
                    {perilakuKode.ambangBatasSensor ?? 500} PPM)
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={950}
                  value={fisika.kadarGasPpm}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      kadarGasPpm: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({
                        ...f,
                        kadarGasPpm: 720,
                        apiTerdeteksi: true,
                      }))
                    }
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] cursor-pointer"
                  >
                    🔥 Simulasikan Gas Bocor &amp; Api (720 PPM ➔ Sirine ON!)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({
                        ...f,
                        kadarGasPpm: 200,
                        apiTerdeteksi: false,
                      }))
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                  >
                    🌬️ Normalisasi Udara Bersih (200 PPM ➔ Sirine OFF)
                  </button>
                </div>
              </div>
            )}

            {modulPunyaDhtAtauSoil && !teksSemuaSlot.includes("npk") && (
              <div className="flex-1 min-w-[260px] bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">
                    🌡️ Suhu Udara DHT22 &amp; Kelembapan Tanah:
                  </span>
                  <span className="text-amber-300 font-mono">
                    Suhu: {fisika.suhuCelcius}°C (Target Kipas/Pompa: &gt;{" "}
                    {perilakuKode.ambangBatasSensor ?? 32}°C)
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={50}
                  step={0.5}
                  value={fisika.suhuCelcius}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      suhuCelcius: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, suhuCelcius: 37.5 }))
                    }
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] cursor-pointer"
                  >
                    🔥 Panaskan Rumah Kaca (37.5°C ➔ Kipas &amp; Pompa ON)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, suhuCelcius: 26.5 }))
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                  >
                    ❄️ Dinginkan Ruangan (26.5°C ➔ Kipas &amp; Pompa OFF)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* KANVAS UTAMA */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${lebarKanvas} ${tinggiKanvas}`}
        onMouseMove={handleMouseMoveSvg}
        onClick={() => {
          if (pinAwalDiklik) setPinAwalDiklik(null);
        }}
        className="w-full min-h-[340px] sm:min-h-[430px] select-none"
      >
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

        {/* SLOT KOMPONEN PERIFERAL DENGAN KONTROL KLIK LANGSUNG DI ATAS KOMPONEN! */}
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

          const adalahPushButtonIni =
            idKomp.includes("button") || namaKomp.includes("button");
          const adalahPotensioIni =
            idKomp.includes("potensiometer") ||
            namaKomp.includes("potensiometer");
          const adalahRfidIni =
            idKomp.includes("rfid") || namaKomp.includes("rfid");

          const adalahLed =
            idKomp.includes("led") && !idKomp.includes("oled");
          const adalahBuzzer =
            idKomp.includes("buzzer") || namaKomp.includes("buzzer");
          const adalahAktuatorGerak =
            idKomp.includes("kipas") ||
            idKomp.includes("pompa") ||
            idKomp.includes("servo") ||
            idKomp.includes("solenoid") ||
            idKomp.includes("relay");

          // Aktuator HANYA menyala jika simulasiAktif DAN syaratInteraksiTerpenuhi === true!
          const aktuatorMenyalaSaatIni =
            simulasiAktif &&
            syaratInteraksiTerpenuhi &&
            (perilakuKode.adaKedipHighLow && !adaKomponenInputInteraktif
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
                fill={
                  !simulasiAktif
                    ? "#111827"
                    : aktuatorMenyalaSaatIni
                    ? "#071f1b"
                    : "#171926"
                }
                stroke={
                  !simulasiAktif
                    ? "#475569"
                    : aktuatorMenyalaSaatIni
                    ? "#34d399"
                    : "#f59e0b"
                }
                strokeWidth={2.2}
              />

              {/* Header Status Slot */}
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
                fill={
                  !simulasiAktif
                    ? "#94a3b8"
                    : aktuatorMenyalaSaatIni
                    ? "#34d399"
                    : "#fbbf24"
                }
                fontSize="8.5"
                fontWeight="bold"
              >
                SLOT #{slot.nomorSlot}:{" "}
                {(infoTerpasang.namaKartu || slot.namaTarget).slice(0, 18)}{" "}
                {!simulasiAktif
                  ? "[STANDBY]"
                  : adalahPushButtonIni
                  ? tombolFisikDitekan
                    ? "👇 [DITEKAN / LOW]"
                    : "👆 [KLIK TOMBOL INI!]"
                  : adalahPotensioIni
                  ? `🎛️ [${adcPotensioPutar} ADC]`
                  : adalahLed
                  ? aktuatorMenyalaSaatIni
                    ? `💡 ON (${Math.round(kekuatanSinyal * 100)}%)`
                    : "⚫ OFF (MENUNGGU INPUT)"
                  : adalahBuzzer
                  ? aktuatorMenyalaSaatIni
                    ? `🔊 BEEP!`
                    : "🔇 SILENT (MENUNGGU INPUT)"
                  : aktuatorMenyalaSaatIni
                  ? "⚡ BEKERJA (ON)"
                  : "⏸ DIAM (MENUNGGU INPUT)"}
              </text>

              {/* Efek Pendaran Cahaya LED (HANYA jika aktuatorMenyalaSaatIni === true) */}
              {adalahLed && aktuatorMenyalaSaatIni && (
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

              {/* Gelombang Suara Buzzer (HANYA jika aktuatorMenyalaSaatIni === true) */}
              {adalahBuzzer && aktuatorMenyalaSaatIni && (
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
                </g>
              )}

              {/* Lingkaran Putaran Aktuator (Kipas / Pompa / Servo / Relay) HANYA saat syarat terpenuhi */}
              {adalahAktuatorGerak && aktuatorMenyalaSaatIni && (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={24}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2.2}
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

              {/* Render Ikon Komponen */}
              <g
                onClick={() => {
                  if (adalahPushButtonIni) {
                    setTombolFisikDitekan((v) => !v);
                  } else if (adalahRfidIni) {
                    setFisika((f) => ({
                      ...f,
                      rfidKartuDekat: !f.rfidKartuDekat,
                    }));
                  } else if (adalahPotensioIni) {
                    setAdcPotensioPutar((v) => (v >= 3000 ? 0 : v + 1500));
                  }
                }}
                className={
                  adalahPushButtonIni || adalahRfidIni || adalahPotensioIni
                    ? "cursor-pointer"
                    : ""
                }
                opacity={
                  !simulasiAktif
                    ? 0.55
                    : (adalahLed || adalahBuzzer || adalahAktuatorGerak) &&
                      !aktuatorMenyalaSaatIni
                    ? 0.4
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

              {/* Tombol Interaktif Langsung di Atas Kanvas untuk Push Button / RFID / Potensio */}
              {simulasiAktif && adalahPushButtonIni && (
                <g
                  onClick={() => setTombolFisikDitekan((v) => !v)}
                  className="cursor-pointer"
                >
                  <rect
                    x={iconX - 8}
                    y={slot.boxY + slot.boxH - 22}
                    width={84}
                    height={18}
                    rx={5}
                    fill={tombolFisikDitekan ? "#10b981" : "#e11d48"}
                  />
                  <text
                    x={iconX + 34}
                    y={slot.boxY + slot.boxH - 10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.8"
                    fontWeight="bold"
                  >
                    {tombolFisikDitekan ? "👇 DITEKAN (ON)" : "👆 KLIK TEKAN"}
                  </text>
                </g>
              )}

              {simulasiAktif && adalahPotensioIni && (
                <g
                  onClick={() =>
                    setAdcPotensioPutar((v) => (v >= 3500 ? 0 : v + 1200))
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={iconX - 10}
                    y={slot.boxY + slot.boxH - 22}
                    width={88}
                    height={18}
                    rx={5}
                    fill={syaratInteraksiTerpenuhi ? "#10b981" : "#d97706"}
                  />
                  <text
                    x={iconX + 34}
                    y={slot.boxY + slot.boxH - 10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                  >
                    🎛️ KLIK PUTAR ({Math.round((adcPotensioPutar / 4095) * 100)}%)
                  </text>
                </g>
              )}

              {simulasiAktif && adalahRfidIni && (
                <g
                  onClick={() =>
                    setFisika((f) => ({
                      ...f,
                      rfidKartuDekat: !f.rfidKartuDekat,
                    }))
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={iconX - 10}
                    y={slot.boxY + slot.boxH - 22}
                    width={88}
                    height={18}
                    rx={5}
                    fill={fisika.rfidKartuDekat ? "#10b981" : "#0284c7"}
                  />
                  <text
                    x={iconX + 34}
                    y={slot.boxY + slot.boxH - 10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                  >
                    {fisika.rfidKartuDekat ? "🪪 KARTU DEKAT" : "🪪 TAP KARTU"}
                  </text>
                </g>
              )}

              {/* Masking Gelap Saat LED Belum Menyala */}
              {(!simulasiAktif || !aktuatorMenyalaSaatIni) && adalahLed && (
                <circle
                  cx={centerX}
                  cy={centerY - 6}
                  r={12}
                  fill="#450a0a"
                  opacity={0.78}
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

        {/* KABEL TERPASANG SIKU-SIKU (ALIRAN LISTRIK HANYA MENGALIR SAAT SYARAT INTERAKSI TERPENUHI!) */}
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
              <path
                d={ruteSiku.pathSvg}
                fill="none"
                stroke={adalahValid ? k.warna : "#f43f5e"}
                strokeWidth={4}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={adalahValid ? "none" : "6 4"}
                opacity={simulasiAktif && syaratInteraksiTerpenuhi ? 0.98 : 0.65}
              />

              {simulasiAktif &&
                adalahValid &&
                sedangFaseHighKode &&
                syaratInteraksiTerpenuhi && (
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
                      dur={`${Math.max(
                        0.25,
                        0.85 - kekuatanSinyal * 0.45
                      ).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                )}

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