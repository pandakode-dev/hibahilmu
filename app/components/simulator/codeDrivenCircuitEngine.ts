// app/components/simulator/codeDrivenCircuitEngine.ts
// Mesin Interpreter C++ (.ino) & MicroPython (main.py) Real-Time untuk Kanvas Rangkaian

import { NodeKomponenKanvas, KabelKoneksiItem } from "./ElectronicAndIotCanvas";
import { TIPE_MCU_LIST } from "./codeTranspilerAndValidator";

export interface HasilParsingKodeMcu {
  validAdaSetupLoop: boolean;
  batasLdrLux: number;
  batasSoilPersen: number;
  batasSuhuCelcius: number;
  batasFlamePersen: number;
  batasGasPpm: number;
  batasJarakCm: number;
  batasPotensio: number;
  batasTeganganVolt: number;
  sudutServoAktif: number;
  paksaHighSemuaOutput: boolean;
  paksaLowSemuaOutput: boolean;
}

// Mem-parsing angka threshold dan instruksi langsung dari teks kode yang diketik user!
export function analisisLogikaKodeProgram(kodeGabungan: string): HasilParsingKodeMcu {
  const bersih = (kodeGabungan || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const adaCpp = /void\s+setup\s*\(/.test(bersih) && /void\s+loop\s*\(/.test(bersih);
  const adaPy = /import\s+machine|from\s+machine|while\s+True/.test(bersih);

  // Deteksi angka threshold yang diketik pengguna di dalam kode (misal: lux < 300, suhu > 30, gas >= 500, jarak < 25)
  const mLux = bersih.match(/(?:lux|ldr|cahaya)\s*<\s*(\d+)/i);
  const mSoil = bersih.match(/(?:soil|tanah|lembab)\s*<\s*(\d+)/i);
  const mSuhu = bersih.match(/(?:suhu|temp|dht)\s*>\s*(\d+(?:\.\d+)?)/i);
  const mFlame = bersih.match(/(?:api|flame)\s*>\s*(\d+)/i);
  const mGas = bersih.match(/(?:gas|mq2|ppm)\s*>=\s*(\d+)|(?:gas|mq2|ppm)\s*>\s*(\d+)/i);
  const mJarak = bersih.match(/(?:jarak|dist|cm|ultrasonik)\s*<\s*(\d+)/i);
  const mPot = bersih.match(/(?:pot|adc|val)\s*>\s*(\d+)/i);
  const mVolt = bersih.match(/(?:volt|batt|tegangan)\s*<\s*(\d+(?:\.\d+)?)/i);
  const mServo = bersih.match(/\.write\s*\(\s*(\d+)\s*\)/i);

  // Cek apakah kode user hanya menyalakan/mematikan digitalWrite tanpa kondisi if/ternary
  const adaKondisiIfAtauTernary = /\bif\s*\(|\?.*:/.test(bersih);
  const adaDigitalWriteHigh = /digitalWrite\s*\([^,]+,\s*(?:HIGH|1)\s*\)|\.value\s*\(\s*1\s*\)/.test(bersih);
  const adaDigitalWriteLow = /digitalWrite\s*\([^,]+,\s*(?:LOW|0)\s*\)|\.value\s*\(\s*0\s*\)/.test(bersih);

  return {
    validAdaSetupLoop: adaCpp || adaPy,
    batasLdrLux: mLux ? Number(mLux[1]) : 300,
    batasSoilPersen: mSoil ? Number(mSoil[1]) : 45,
    batasSuhuCelcius: mSuhu ? Number(mSuhu[1]) : 30,
    batasFlamePersen: mFlame ? Number(mFlame[1]) : 35,
    batasGasPpm: mGas ? Number(mGas[1] || mGas[2]) : 500,
    batasJarakCm: mJarak ? Number(mJarak[1]) : 30,
    batasPotensio: mPot ? Number(mPot[1]) : 50,
    batasTeganganVolt: mVolt ? Number(mVolt[1]) : 11.5,
    sudutServoAktif: mServo ? Number(mServo[1]) : 90,
    paksaHighSemuaOutput: !adaKondisiIfAtauTernary && adaDigitalWriteHigh,
    paksaLowSemuaOutput: !adaKondisiIfAtauTernary && !adaDigitalWriteHigh && adaDigitalWriteLow,
  };
}

// Mengevaluasi status nyala/mati setiap komponen di kanvas berdasarkan:
// 1. Apakah MCU sedang RUN dan kode memiliki setup()/loop() yang valid
// 2. Angka threshold yang tertulis di dalam kode C++ / MicroPython
// 3. Nilai sensor aktual yang diatur pengguna di kanvas / Inspector
export function evaluasiRangkaianBerdasarkanKode(
  nodesMentah: NodeKomponenKanvas[],
  kabelSaatIni: KabelKoneksiItem[],
  statusRunPerMcu: { [mcuId: string]: boolean },
  errorCompilerPerMcu: { [mcuId: string]: string | null },
  kodePerMcuMap: { [mcuId: string]: string },
  kodeMicroPythonMap: { [mcuId: string]: string },
  bahasaPerMcu: { [mcuId: string]: "cpp" | "micropython" }
): NodeKomponenKanvas[] {
  const mcuRunningIds = Object.keys(statusRunPerMcu).filter(
    (id) => statusRunPerMcu[id] && !errorCompilerPerMcu[id]
  );

  // Kumpulkan kode dari semua MCU yang sedang berstatus RUN
  const kodeAktifList = mcuRunningIds.map((id) =>
    bahasaPerMcu[id] === "micropython"
      ? kodeMicroPythonMap[id] || ""
      : kodePerMcuMap[id] || ""
  );
  const gabunganKodeAktif = kodeAktifList.join("\n");
  const parsed = analisisLogikaKodeProgram(gabunganKodeAktif);

  const sistemAktifDanKodeValid =
    mcuRunningIds.length > 0 && parsed.validAdaSetupLoop;

  // Identifikasi sensor/input yang ada di kanvas
  const sLdr = nodesMentah.find((n) => n.tipe.includes("ldr") || n.label.toLowerCase().includes("ldr"));
  const sRfid = nodesMentah.find((n) => n.tipe.includes("rfid") || n.label.toLowerCase().includes("rfid"));
  const sSoil = nodesMentah.find((n) => n.tipe.includes("soil") || n.tipe.includes("tanah") || n.label.toLowerCase().includes("tanah"));
  const sDht = nodesMentah.find((n) => n.tipe.includes("dht") || n.label.toLowerCase().includes("dht") || n.label.toLowerCase().includes("suhu"));
  const sFlame = nodesMentah.find((n) => n.tipe.includes("flame") || n.label.toLowerCase().includes("api"));
  const sMq2 = nodesMentah.find((n) => n.tipe.includes("mq2") || n.tipe.includes("gas") || n.label.toLowerCase().includes("mq-2"));
  const sPir = nodesMentah.find((n) => n.tipe.includes("pir") || n.label.toLowerCase().includes("pir"));
  const sBtn = nodesMentah.find((n) => n.tipe.includes("button") || n.label.toLowerCase().includes("tombol") || n.label.toLowerCase().includes("sakelar"));
  const sUltra = nodesMentah.find((n) => n.tipe.includes("ultrasonik") || n.tipe.includes("hc_sr04") || n.label.toLowerCase().includes("ultrasonik") || n.label.toLowerCase().includes("jarak"));
  const sPot = nodesMentah.find((n) => n.tipe.includes("potensio") || n.label.toLowerCase().includes("potensio"));
  const sNpk = nodesMentah.find((n) => n.tipe.includes("npk") || n.label.toLowerCase().includes("npk"));
  const sPh = nodesMentah.find((n) => n.tipe.includes("ph") || n.label.toLowerCase().includes("ph"));

  // Evaluasi masing-masing syarat sensor sesuai angka threshold di kodingan user!
  const syaratGelap = sistemAktifDanKodeValid && sLdr
    ? Boolean(sLdr.nyala !== false) && (sLdr.nilaiSensor ?? 500) < parsed.batasLdrLux
    : false;
  const syaratRfid = sistemAktifDanKodeValid && sRfid
    ? Boolean(sRfid.nyala) && (sRfid.nilaiSensor ?? 100) > 0
    : false;
  const syaratTanahKering = sistemAktifDanKodeValid && sSoil
    ? Boolean(sSoil.nyala !== false) && (sSoil.nilaiSensor ?? 60) < parsed.batasSoilPersen
    : false;
  const syaratSuhuPanas = sistemAktifDanKodeValid && sDht
    ? Boolean(sDht.nyala !== false) && (sDht.nilaiSensor ?? 26) > parsed.batasSuhuCelcius
    : false;
  const syaratApi = sistemAktifDanKodeValid && sFlame
    ? Boolean(sFlame.nyala) && (sFlame.nilaiSensor ?? 0) > parsed.batasFlamePersen
    : false;
  const syaratGas = sistemAktifDanKodeValid && sMq2
    ? Boolean(sMq2.nyala !== false) && (sMq2.nilaiSensor ?? 200) >= parsed.batasGasPpm
    : false;
  const syaratPir = sistemAktifDanKodeValid && sPir
    ? Boolean(sPir.nyala) && (sPir.nilaiSensor ?? 100) > 0
    : false;
  const syaratTombol = sistemAktifDanKodeValid && sBtn
    ? Boolean(sBtn.nyala)
    : false;
  const syaratDekatUltra = sistemAktifDanKodeValid && sUltra
    ? Boolean(sUltra.nyala !== false) && (sUltra.nilaiSensor ?? 50) < parsed.batasJarakCm
    : false;
  const syaratPotensio = sistemAktifDanKodeValid && sPot
    ? Boolean(sPot.nyala !== false) && (sPot.nilaiSensor ?? 50) > parsed.batasPotensio
    : false;
  const syaratNpkKurang = sistemAktifDanKodeValid && sNpk
    ? Boolean(sNpk.nyala !== false) && (sNpk.nilaiSensor ?? 120) < 100
    : false;
  const syaratPhAnomali = sistemAktifDanKodeValid && sPh
    ? Boolean(sPh.nyala !== false) && ((sPh.nilaiSensor ?? 7) < 6.0 || (sPh.nilaiSensor ?? 7) > 8.5)
    : false;

  const adaSensorDiKanvas = Boolean(
    sLdr || sRfid || sSoil || sDht || sFlame || sMq2 || sPir || sBtn || sUltra || sPot || sNpk || sPh
  );

  return nodesMentah.map((n) => {
    const tp = (n.tipe || "").toLowerCase();
    const lb = (n.label || "").toLowerCase();

    // Jangan ubah papan MCU atau komponen Sensor/Input/Daya itu sendiri
    const adalahSensorAtauInput =
      TIPE_MCU_LIST.includes(n.tipe) ||
      tp.includes("ldr") || tp.includes("rfid") || tp.includes("soil") ||
      tp.includes("tanah") || tp.includes("dht") || tp.includes("flame") ||
      tp.includes("mq2") || tp.includes("pir") || tp.includes("button") ||
      tp.includes("ultrasonik") || tp.includes("hc_sr04") || tp.includes("potensio") ||
      tp.includes("npk") || tp.includes("gps") || tp.includes("baterai") ||
      tp.includes("tegangan") || tp.includes("resistor") || tp.includes("ph") ||
      lb.includes("sensor") || lb.includes("rfid") || lb.includes("kelembapan") ||
      lb.includes("suhu") || lb.includes("tombol") || lb.includes("potensio") ||
      lb.includes("baterai") || lb.includes("gps");

    if (adalahSensorAtauInput) {
      return n;
    }

    if (!sistemAktifDanKodeValid || parsed.paksaLowSemuaOutput) {
      return { ...n, nyala: false };
    }

    if (!adaSensorDiKanvas && parsed.paksaHighSemuaOutput) {
      return { ...n, nyala: true };
    }

    // Evaluasi aktuator berdasarkan sensor pemicunya di rangkaian
    let nyalaAktuator = false;
    let nilaiAktuator = n.nilaiSensor;

    if (sSoil || sDht) {
      if (tp.includes("pompa") || lb.includes("pompa")) {
        nyalaAktuator = syaratTanahKering || syaratApi || syaratNpkKurang;
      } else if (tp.includes("kipas") || lb.includes("kipas")) {
        nyalaAktuator = syaratSuhuPanas || syaratGas;
      } else {
        nyalaAktuator = syaratTanahKering || syaratSuhuPanas || syaratApi || syaratGas;
      }
    } else if (sFlame || sMq2) {
      nyalaAktuator = syaratApi || syaratGas;
    } else if (sLdr) {
      nyalaAktuator = syaratGelap;
    } else if (sRfid) {
      nyalaAktuator = syaratRfid;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratRfid ? parsed.sudutServoAktif : 0;
      }
    } else if (sUltra) {
      nyalaAktuator = syaratDekatUltra;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratDekatUltra ? parsed.sudutServoAktif : 0;
      }
    } else if (sPir) {
      nyalaAktuator = syaratPir;
    } else if (sBtn) {
      nyalaAktuator = syaratTombol;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratTombol ? parsed.sudutServoAktif : 0;
      }
    } else if (sPot) {
      nyalaAktuator = syaratPotensio;
    } else if (sNpk) {
      nyalaAktuator = syaratNpkKurang;
    } else if (sPh) {
      nyalaAktuator = syaratPhAnomali;
    } else {
      // Proyek murni output tanpa sensor (misal LED Blink / Relay Sequencer)
      nyalaAktuator = parsed.paksaHighSemuaOutput || Boolean(n.nyala);
    }

    return {
      ...n,
      nyala: nyalaAktuator,
      nilaiSensor: nilaiAktuator,
    };
  });
}