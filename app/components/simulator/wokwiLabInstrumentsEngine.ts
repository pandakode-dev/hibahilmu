// app/components/simulator/wokwiLabInstrumentsEngine.ts
import {
  DefinisiSlotPeriferalMultiPin,
  AturanSambunganKabelReal,
} from "./wokwiAcademyBlueprints";
import { KabelMultiPinTersambung } from "./WokwiMultiSlotCanvas";
import { ParameterFisikaInteraktif } from "./wokwiHardwareVisuals";

export interface HasilAnalisisKerusakanFisik {
  terjadiKorsletingDaya: boolean; // 3V3 langsung terhubung ke GND!
  ledPutusTanpaResistor: boolean; // LED terhubung ke GPIO & GND tanpa melewati Resistor (atau Ohm < 50)!
  slotKomponenGosong: number[]; // Nomor slot yang mengeluarkan asap & gosong
  pesanBahayaFisik: string;
  arusPuncakMa: number;
}

export interface HasilUkurMultimeter {
  pinProbeMerah: string;
  pinProbeHitam: string;
  teganganTerukurVolt: number;
  arusTerukurMa: number;
  hambatanTerukurOhm: number;
  frekuensiPwmHz: number;
  dutyCyclePersen: number;
}

export interface ProfilKonsumsiDayaBaterai {
  kapasitasBateraiMah: number;
  arusMcuMa: number;
  arusWifiMa: number;
  arusPeriferalMa: number;
  totalArusMa: number;
  modeDeepSleepAktif: boolean;
  estimasiTahanJam: number;
  estimasiTahanHari: number;
  statusEfisiensi: "SANGAT BOROS" | "NORMAL (AKTIF)" | "ULTRA HEMAT (DEEP SLEEP)";
}

// ============================================================================
// 1. DETEKTOR KORSLETING (SHORT-CIRCUIT) & KOMPONEN GOSONG (BURNOUT)
// ============================================================================
export function periksaKerusakanFisikRangkaian(
  kabelTerpasang: KabelMultiPinTersambung[],
  daftarSlot: DefinisiSlotPeriferalMultiPin[],
  slotTerpasangMap: Record<
    number,
    { terpasang: boolean; namaKartu: string; idKartu: string }
  >,
  fisika: ParameterFisikaInteraktif,
  simulasiRunning: boolean
): HasilAnalisisKerusakanFisik {
  const slotKomponenGosong: number[] = [];
  let terjadiKorsletingDaya = false;
  let ledPutusTanpaResistor = false;
  let pesanBahayaFisik = "";
  let arusPuncakMa = 12.5;

  // Cek 1: Apakah ada kabel yang menghubungkan langsung ESP_3V3 ke ESP_GND?
  const adaShort3v3KeGnd = kabelTerpasang.some(
    (k) =>
      (k.pinAsalId === "ESP_3V3" && k.pinTujuanId === "ESP_GND") ||
      (k.pinAsalId === "ESP_GND" && k.pinTujuanId === "ESP_3V3")
  );

  if (adaShort3v3KeGnd) {
    terjadiKorsletingDaya = true;
    slotKomponenGosong.push(1); // Slot #1 ESP32 Regulator AMS1117 terbakar!
    arusPuncakMa = 1850.0;
    pesanBahayaFisik =
      "💥 KORSLETING FATAL (SHORT-CIRCUIT)! Kamu menghubungkan pin [3V3] langsung ke [GND] tanpa beban! Arus melonjak ke 1.85 Ampere dan membakar regulator daya ESP32!";
  }

  // Cek 2: Apakah ada LED yang dipasang langsung ke GND tanpa melewati Resistor (pada modul yang mewajibkan Resistor)?
  const slotResistor = daftarSlot.find(
    (s) =>
      s.idGambarMiniatur.includes("resistor") ||
      s.namaTarget.toLowerCase().includes("resistor")
  );
  const slotLedList = daftarSlot.filter(
    (s) =>
      (s.idGambarMiniatur.includes("led") &&
        !s.idGambarMiniatur.includes("oled")) ||
      s.namaTarget.toLowerCase().includes("led ")
  );

  if (slotLedList.length > 0) {
    for (const sLed of slotLedList) {
      const pinKatodaId = sLed.daftarPinKomponenIni[1]?.idPin;
      // Cek apakah katoda LED langsung ditarik ke ESP_GND padahal ada slot resistor di modul ini
      const katodaLangsungKeGnd = kabelTerpasang.some(
        (k) =>
          (k.pinAsalId === pinKatodaId && k.pinTujuanId === "ESP_GND") ||
          (k.pinAsalId === "ESP_GND" && k.pinTujuanId === pinKatodaId)
      );

      if (slotResistor && katodaLangsungKeGnd) {
        ledPutusTanpaResistor = true;
        if (!slotKomponenGosong.includes(sLed.nomorSlot)) {
          slotKomponenGosong.push(sLed.nomorSlot);
        }
        arusPuncakMa = 145.0; // Melebihi batas 20mA LED 5mm!
        pesanBahayaFisik = `🔥 LED SLOT #${sLed.nomorSlot} PUTUS / GOSONG! Kaki Katoda LED (-) disambung langsung ke [GND] tanpa melewati Resistor 220Ω! Arus 145 mA (> batas 20 mA) menghanguskan filamen LED!`;
      } else if (simulasiRunning && fisika.nilaiOhmResistor < 50) {
        ledPutusTanpaResistor = true;
        if (!slotKomponenGosong.includes(sLed.nomorSlot)) {
          slotKomponenGosong.push(sLed.nomorSlot);
        }
        arusPuncakMa = 85.0;
        pesanBahayaFisik = `🔥 OVERCURRENT! Nilai Resistor terlalu kecil (${fisika.nilaiOhmResistor}Ω), menyebabkan arus berlebih yang membakar LED di Slot #${sLed.nomorSlot}!`;
      }
    }
  }

  return {
    terjadiKorsletingDaya,
    ledPutusTanpaResistor,
    slotKomponenGosong,
    pesanBahayaFisik,
    arusPuncakMa,
  };
}

// ============================================================================
// 2. MESIN SIMULASI MULTIMETER DIGITAL & OSILOSKOP PWM LIVE
// ============================================================================
export function hitungPembacaanMultimeter(
  pinProbeMerah: string,
  pinProbeHitam: string,
  fisika: ParameterFisikaInteraktif,
  kodeUser: string,
  simulasiRunning: boolean,
  sedangFaseHigh: boolean
): HasilUkurMultimeter {
  if (!simulasiRunning || pinProbeMerah === pinProbeHitam) {
    return {
      pinProbeMerah,
      pinProbeHitam,
      teganganTerukurVolt: 0.0,
      arusTerukurMa: 0.0,
      hambatanTerukurOhm: fisika.nilaiOhmResistor,
      frekuensiPwmHz: 0,
      dutyCyclePersen: 0,
    };
  }

  const adaPwmKode = /analogWrite|\.duty\s*\(/.test(kodeUser);
  const dutyCyclePersen = adaPwmKode
    ? Math.round((fisika.pwmLedBrightness / 255) * 100)
    : sedangFaseHigh
    ? 100
    : 0;

  let volt = 0.0;
  if (pinProbeMerah === "ESP_3V3") {
    volt = 3.3;
  } else if (pinProbeMerah === "ESP_GPIO34" || pinProbeMerah === "ESP_GPIO35") {
    // Tegangan ADC dari sensor cahaya / baterai
    volt = Number(((1000 - Math.min(1000, fisika.luxCahaya)) / 1000 * 3.3).toFixed(2));
  } else if (pinProbeMerah === "ESP_GPIO32") {
    volt = Number(((fisika.kadarGasPpm / 1000) * 3.3).toFixed(2));
  } else if (pinProbeMerah.startsWith("ESP_GPIO")) {
    volt = sedangFaseHigh ? Number(((dutyCyclePersen / 100) * 3.3).toFixed(2)) : 0.0;
  } else {
    // Probe di kaki komponen periferal (setelah drop tegangan LED ~1.8V)
    volt = sedangFaseHigh ? Number(Math.max(0, (dutyCyclePersen / 100) * 3.3 - 1.8).toFixed(2)) : 0.0;
  }

  // Hukum Ohm: I = (V - V_led) / R
  const vEfektif = Math.max(0, volt - 1.8);
  const arusMa =
    volt > 0
      ? Number(((vEfektif / Math.max(10, fisika.nilaiOhmResistor)) * 1000).toFixed(2))
      : 0.0;

  return {
    pinProbeMerah,
    pinProbeHitam,
    teganganTerukurVolt: volt,
    arusTerukurMa: Math.max(volt > 0 ? 1.2 : 0, arusMa),
    hambatanTerukurOhm: fisika.nilaiOhmResistor,
    frekuensiPwmHz: adaPwmKode ? 1000 : sedangFaseHigh ? 1 : 0,
    dutyCyclePersen,
  };
}

// ============================================================================
// 3. KALKULATOR MASA PAKAI BATERAI 18650 (POWER PROFILER & DEEP SLEEP)
// ============================================================================
export function hitungProfilDayaBaterai18650(
  kodeUser: string,
  jumlahKomponenTerpasang: number,
  simulasiRunning: boolean
): ProfilKonsumsiDayaBaterai {
  const kapasitasBateraiMah = 2500; // Standar 1x Sel Li-Ion 18650 (2500 mAh)
  const bersih = (kodeUser || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/#.*$/gm, "");

  const modeDeepSleepAktif =
    /esp_deep_sleep_start|deep_sleep|deepsleep/i.test(bersih);
  const wifiAktif =
    /WiFi\.begin|WLAN|esp_now_init|Blynk\.begin/i.test(bersih);

  if (!simulasiRunning) {
    return {
      kapasitasBateraiMah,
      arusMcuMa: 0,
      arusWifiMa: 0,
      arusPeriferalMa: 0,
      totalArusMa: 0,
      modeDeepSleepAktif: false,
      estimasiTahanJam: 0,
      estimasiTahanHari: 0,
      statusEfisiensi: "NORMAL (AKTIF)",
    };
  }

  if (modeDeepSleepAktif) {
    // Saat Deep Sleep aktif, konsumsi rata-rata turun drastis ke ~0.45 mA!
    const totalSleepMa = 0.45;
    const jam = Math.round(kapasitasBateraiMah / totalSleepMa);
    return {
      kapasitasBateraiMah,
      arusMcuMa: 0.02,
      arusWifiMa: 0.35,
      arusPeriferalMa: 0.08,
      totalArusMa: totalSleepMa,
      modeDeepSleepAktif: true,
      estimasiTahanJam: jam,
      estimasiTahanHari: Math.round(jam / 24),
      statusEfisiensi: "ULTRA HEMAT (DEEP SLEEP)",
    };
  }

  const arusMcuMa = 42.0; // Xtensa Dual-Core 240MHz aktif
  const arusWifiMa = wifiAktif ? 135.0 : 0.0; // Radio TX/RX 2.4GHz
  const arusPeriferalMa = Math.max(0, (jumlahKomponenTerpasang - 1) * 14.5);
  const totalArusMa = Number(
    (arusMcuMa + arusWifiMa + arusPeriferalMa).toFixed(1)
  );

  const estimasiTahanJam = Number(
    (kapasitasBateraiMah / Math.max(1, totalArusMa)).toFixed(1)
  );
  const estimasiTahanHari = Number((estimasiTahanJam / 24).toFixed(1));

  return {
    kapasitasBateraiMah,
    arusMcuMa,
    arusWifiMa,
    arusPeriferalMa,
    totalArusMa,
    modeDeepSleepAktif: false,
    estimasiTahanJam,
    estimasiTahanHari,
    statusEfisiensi: wifiAktif ? "SANGAT BOROS" : "NORMAL (AKTIF)",
  };
}