// app/components/simulator/codeDrivenCircuitEngine.ts
// Mesin Interpreter C++ (.ino) & MicroPython (main.py) Real-Time untuk Seluruh 20 Proyek

import { NodeKomponenKanvas, KabelKoneksiItem } from "./ElectronicAndIotCanvas";
import { TIPE_MCU_LIST } from "./codeTranspilerAndValidator";
import { PresetTutorialProject } from "./tutorialProjectsData";

export interface HasilParsingKodeMcu {
  validAdaSetupLoop: boolean;
  batasLdrLux: number;
  batasSoilPersen: number;
  batasSuhuCelcius: number;
  batasFlamePersen: number;
  batasGasPpm: number;
  batasJarakCm: number;
  batasPotensio: number;
  batasNpk: number;
  batasTeganganVolt: number;
  sudutServoAktif: number;
  paksaHighSemuaOutput: boolean;
  paksaLowSemuaOutput: boolean;
}

export interface InfoPanduanEksekusiProyek {
  kategoriLabel:
    | "1. Dasar & Sensor Lokal"
    | "2. Smart Home & Keamanan IoT"
    | "3. Pertanian, Tambak & Medis"
    | "4. Multi-MCU, Energi & Master AIoT";
  caraKerjaSingkat: string;
  inputYangDiubah: string;
  kondisiPemicuAktif: string;
  responAktuator: string;
  langkahCepatUji: string[];
}

export function analisisLogikaKodeProgram(
  kodeGabungan: string
): HasilParsingKodeMcu {
  const bersih = (kodeGabungan || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const adaCpp =
    /void\s+setup\s*\(/.test(bersih) && /void\s+loop\s*\(/.test(bersih);
  const adaPy = /import\s+machine|from\s+machine|while\s+True/.test(bersih);

  const mLux = bersih.match(/(?:lux|ldr|cahaya)\s*<\s*(\d+)/i);
  const mSoil = bersih.match(
    /(?:soil|tanah|lembab|kualitasAir)\s*<\s*(\d+)/i
  );
  const mSuhu = bersih.match(
    /(?:suhu|temp|dht|suhuTambak)\s*>\s*(\d+(?:\.\d+)?)/i
  );
  const mFlame = bersih.match(/(?:api|flame)\s*>\s*(\d+)/i);
  const mGas = bersih.match(
    /(?:gas|mq2|ppm)\s*>=\s*(\d+)|(?:gas|mq2|ppm)\s*>\s*(\d+)/i
  );
  const mJarak = bersih.match(/(?:jarak|dist|cm|ultrasonik)\s*<\s*(\d+)/i);
  const mPot = bersih.match(/(?:pot|adc|val|beban)\s*>\s*(\d+)/i);
  const mNpk = bersih.match(/(?:kadarNpk|npk)\s*<\s*(\d+)/i);
  const mVolt = bersih.match(
    /(?:adcVolt|volt|batt|tegangan)\s*<\s*(\d+(?:\.\d+)?)/i
  );
  const mServo = bersih.match(/\.write\s*\(\s*(\d+)\s*\)/i);

  const adaKondisi =
    /\bif\s*\(|\?.*:|digitalRead\s*\(|analogRead\s*\(/.test(bersih);
  const adaHigh =
    /digitalWrite\s*\([^,]+,\s*(?:HIGH|1)\s*\)|\.value\s*\(\s*1\s*\)/.test(
      bersih
    );
  const adaLow =
    /digitalWrite\s*\([^,]+,\s*(?:LOW|0)\s*\)|\.value\s*\(\s*0\s*\)/.test(
      bersih
    );

  return {
    validAdaSetupLoop: adaCpp || adaPy,
    batasLdrLux: mLux ? Number(mLux[1]) : 300,
    batasSoilPersen: mSoil ? Number(mSoil[1]) : 45,
    batasSuhuCelcius: mSuhu ? Number(mSuhu[1]) : 30,
    batasFlamePersen: mFlame ? Number(mFlame[1]) : 35,
    batasGasPpm: mGas ? Number(mGas[1] || mGas[2]) : 500,
    batasJarakCm: mJarak ? Number(mJarak[1]) : 30,
    batasPotensio: mPot ? Number(mPot[1]) : 50,
    batasNpk: mNpk ? Number(mNpk[1]) : 50,
    batasTeganganVolt: mVolt ? Number(mVolt[1]) : 11,
    sudutServoAktif: mServo ? Number(mServo[1]) : 90,
    paksaHighSemuaOutput: !adaKondisi && adaHigh,
    paksaLowSemuaOutput: !adaKondisi && !adaHigh && adaLow,
  };
}

export function evaluasiRangkaianBerdasarkanKode(
  nodesMentah: NodeKomponenKanvas[],
  _kabelSaatIni: KabelKoneksiItem[],
  statusRunPerMcu: { [mcuId: string]: boolean },
  errorCompilerPerMcu: { [mcuId: string]: string | null },
  kodePerMcuMap: { [mcuId: string]: string },
  kodeMicroPythonMap: { [mcuId: string]: string },
  bahasaPerMcu: { [mcuId: string]: "cpp" | "micropython" }
): NodeKomponenKanvas[] {
  const mcuRunningIds = Object.keys(statusRunPerMcu).filter(
    (id) => statusRunPerMcu[id] && !errorCompilerPerMcu[id]
  );

  const kodeAktifList = mcuRunningIds.map((id) =>
    bahasaPerMcu[id] === "micropython"
      ? kodeMicroPythonMap[id] || ""
      : kodePerMcuMap[id] || ""
  );
  const gabunganKodeAktif = kodeAktifList.join("\n");
  const parsed = analisisLogikaKodeProgram(gabunganKodeAktif);

  const sistemAktifDanKodeValid =
    mcuRunningIds.length > 0 && parsed.validAdaSetupLoop;

  // Deteksi semua jenis sensor/input yang ada di kanvas
  const sLdr = nodesMentah.find(
    (n) => n.tipe.includes("ldr") || n.label.toLowerCase().includes("ldr")
  );
  const sRfid = nodesMentah.find(
    (n) => n.tipe.includes("rfid") || n.label.toLowerCase().includes("rfid")
  );
  const sSoil = nodesMentah.find(
    (n) =>
      n.tipe.includes("soil") ||
      n.tipe.includes("tanah") ||
      n.label.toLowerCase().includes("tanah") ||
      n.label.toLowerCase().includes("kualitas & ph air")
  );
  const sDht = nodesMentah.find(
    (n) =>
      n.tipe.includes("dht") ||
      n.label.toLowerCase().includes("dht") ||
      n.label.toLowerCase().includes("suhu")
  );
  const sFlame = nodesMentah.find(
    (n) => n.tipe.includes("flame") || n.label.toLowerCase().includes("api")
  );
  const sMq2 = nodesMentah.find(
    (n) =>
      n.tipe.includes("mq2") ||
      n.tipe.includes("gas") ||
      n.label.toLowerCase().includes("mq-2") ||
      n.label.toLowerCase().includes("asap") ||
      n.label.toLowerCase().includes("udara")
  );
  const sPir = nodesMentah.find(
    (n) => n.tipe.includes("pir") || n.label.toLowerCase().includes("pir")
  );
  const sBtn = nodesMentah.find(
    (n) =>
      n.tipe.includes("button") ||
      n.label.toLowerCase().includes("tombol") ||
      n.label.toLowerCase().includes("sakelar")
  );
  const sUltra = nodesMentah.find(
    (n) =>
      n.tipe.includes("ultrasonik") ||
      n.tipe.includes("hc_sr04") ||
      n.label.toLowerCase().includes("ultrasonik") ||
      n.label.toLowerCase().includes("jarak")
  );
  const sPot = nodesMentah.find(
    (n) =>
      n.tipe.includes("potensio") || n.label.toLowerCase().includes("potensio")
  );
  const sNpk = nodesMentah.find(
    (n) => n.tipe.includes("npk") || n.label.toLowerCase().includes("npk")
  );
  const sVolt = nodesMentah.find(
    (n) =>
      n.tipe.includes("tegangan") ||
      n.label.toLowerCase().includes("tegangan")
  );
  const sBat = nodesMentah.find(
    (n) =>
      n.tipe.includes("baterai") || n.label.toLowerCase().includes("baterai")
  );

  // Evaluasi kondisi masing-masing sensor sesuai angka threshold di kodingan
  const syaratGelap =
    sistemAktifDanKodeValid && sLdr
      ? Boolean(sLdr.nyala !== false) &&
        (sLdr.nilaiSensor ?? 500) < parsed.batasLdrLux
      : false;

  const syaratRfid =
    sistemAktifDanKodeValid && sRfid
      ? Boolean(sRfid.nyala) && (sRfid.nilaiSensor ?? 100) > 0
      : false;

  const syaratTanahKering =
    sistemAktifDanKodeValid && sSoil
      ? Boolean(sSoil.nyala !== false) &&
        (sSoil.nilaiSensor ?? 60) < parsed.batasSoilPersen
      : false;

  const syaratSuhuPanas =
    sistemAktifDanKodeValid && sDht
      ? Boolean(sDht.nyala !== false) &&
        (sDht.nilaiSensor ?? 26) > parsed.batasSuhuCelcius
      : false;

  const syaratApi =
    sistemAktifDanKodeValid && sFlame
      ? Boolean(sFlame.nyala) &&
        (sFlame.nilaiSensor ?? 0) > parsed.batasFlamePersen
      : false;

  const syaratGas =
    sistemAktifDanKodeValid && sMq2
      ? Boolean(sMq2.nyala !== false) &&
        (sMq2.nilaiSensor ?? 200) >= parsed.batasGasPpm
      : false;

  const syaratPir =
    sistemAktifDanKodeValid && sPir
      ? Boolean(sPir.nyala) && (sPir.nilaiSensor ?? 100) > 0
      : false;

  const syaratTombol =
    sistemAktifDanKodeValid && sBtn
      ? Boolean(sBtn.nyala) && (sBtn.nilaiSensor ?? 1) > 0
      : false;

  const syaratDekatUltra =
    sistemAktifDanKodeValid && sUltra
      ? Boolean(sUltra.nyala !== false) &&
        (sUltra.nilaiSensor ?? 50) < parsed.batasJarakCm
      : false;

  const syaratPotensio =
    sistemAktifDanKodeValid && sPot
      ? Boolean(sPot.nyala !== false) &&
        (sPot.nilaiSensor ?? 50) > parsed.batasPotensio
      : false;

  const syaratNpkKurang =
    sistemAktifDanKodeValid && sNpk
      ? Boolean(sNpk.nyala !== false) &&
        (sNpk.nilaiSensor ?? 120) < parsed.batasNpk
      : false;

  const nilaiVoltAktual = sVolt
    ? sVolt.nilaiSensor ?? 12
    : sBat
    ? sBat.nilaiSensor ?? 12
    : 12;
  const syaratVoltDrop =
    sistemAktifDanKodeValid && (sVolt || sBat)
      ? nilaiVoltAktual < parsed.batasTeganganVolt
      : false;

  return nodesMentah.map((n) => {
    const tp = (n.tipe || "").toLowerCase();
    const lb = (n.label || "").toLowerCase();

    // Jangan ubah papan MCU atau komponen Sensor/Input/Daya/Pasif itu sendiri
    const adalahSensorAtauInput =
      TIPE_MCU_LIST.includes(n.tipe) ||
      tp.includes("ldr") ||
      tp.includes("rfid") ||
      tp.includes("soil") ||
      tp.includes("tanah") ||
      tp.includes("dht") ||
      tp.includes("flame") ||
      tp.includes("mq2") ||
      tp.includes("pir") ||
      tp.includes("button") ||
      tp.includes("ultrasonik") ||
      tp.includes("hc_sr04") ||
      tp.includes("potensio") ||
      tp.includes("npk") ||
      tp.includes("gps") ||
      tp.includes("baterai") ||
      tp.includes("tegangan") ||
      tp.includes("resistor") ||
      tp.includes("ph") ||
      lb.includes("sensor") ||
      lb.includes("rfid") ||
      lb.includes("kelembapan") ||
      lb.includes("suhu") ||
      lb.includes("tombol") ||
      lb.includes("potensio") ||
      lb.includes("baterai") ||
      lb.includes("gps") ||
      lb.includes("resistor");

    if (adalahSensorAtauInput) {
      return n;
    }

    if (!sistemAktifDanKodeValid || parsed.paksaLowSemuaOutput) {
      return { ...n, nyala: false };
    }

    let nyalaAktuator = false;
    let nilaiAktuator = n.nilaiSensor;

    // 1. Kombinasi Greenhouse / Tambak / HVAC / AIoT (Ada Soil/MQ2 + DHT22)
    if ((sSoil && sDht) || (sMq2 && sDht)) {
      if (tp.includes("pompa") || lb.includes("pompa")) {
        nyalaAktuator = sSoil
          ? syaratTanahKering
          : syaratGas || syaratSuhuPanas;
      } else if (
        tp.includes("kipas") ||
        lb.includes("kipas") ||
        lb.includes("kincir") ||
        lb.includes("blower")
      ) {
        nyalaAktuator = syaratSuhuPanas || syaratGas;
      } else {
        nyalaAktuator = syaratTanahKering || syaratSuhuPanas || syaratGas;
      }
    }
    // 2. Hanya DHT22 (Misal Proyek 16 Cold-Chain Vaksin atau Proyek 5/6/7)
    else if (sDht && !sSoil && !sMq2 && !sFlame) {
      nyalaAktuator = syaratSuhuPanas;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratSuhuPanas ? parsed.sudutServoAktif : 0;
      }
    }
    // 3. Pemadam Kebakaran / Karhutla (Flame / MQ-2)
    else if (sFlame || sMq2) {
      nyalaAktuator = syaratApi || syaratGas;
    }
    // 4. Lampu Jalan LDR
    else if (sLdr) {
      nyalaAktuator = syaratGelap;
    }
    // 5. Smart Door Lock RFID / GPS Tracker RFID
    else if (sRfid) {
      nyalaAktuator = syaratRfid;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratRfid ? parsed.sudutServoAktif : 0;
      }
    }
    // 6. Radar Parkir & Palang Tol Ultrasonik
    else if (sUltra && sPir) { nyalaAktuator = syaratDekatUltra || syaratPir; } else if (sUltra) {
      nyalaAktuator = syaratDekatUltra;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratDekatUltra ? parsed.sudutServoAktif : 0;
      }
    }
    // 7. Keamanan Anti-Maling PIR
    else if (sPir) {
      nyalaAktuator = syaratPir;
    }
    // 8. Sakelar Push Button
    else if (sBtn) {
      nyalaAktuator = syaratTombol;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratTombol ? parsed.sudutServoAktif : 0;
      }
    }
    // 9. Potensiometer PWM / Smart Grid Overload
    else if (sPot) {
      nyalaAktuator = syaratPotensio;
      if (tp.includes("servo") || lb.includes("servo")) {
        nilaiAktuator = syaratPotensio ? parsed.sudutServoAktif : 0;
      }
    }
    // 10. Nutrisi Tanah NPK RS485
    else if (sNpk) {
      nyalaAktuator = syaratNpkKurang;
    }
    // 11. BMS Baterai 18650 & Sensor Tegangan DC
    else if (sVolt || sBat) {
      nyalaAktuator = syaratVoltDrop;
    }
    // 12. Proyek Tanpa Sensor Khusus (tetap menyala jika MCU RUN)
    else {
      nyalaAktuator = true;
    }

    return {
      ...n,
      nyala: nyalaAktuator,
      nilaiSensor: nilaiAktuator,
    };
  });
}

// Menghasilkan Panduan Lengkap Cara Kerja & Langkah Menguji untuk Setiap Proyek (1 s.d. 20)
export function ambilPanduanLengkapProyek(
  proj: PresetTutorialProject
): InfoPanduanEksekusiProyek {
  const id = (proj.id || "").toLowerCase();
  const judul = (proj.judul || "").toLowerCase();

  if (id === "proj-1" || judul.includes("lampu jalan")) {
    return {
      kategoriLabel: "1. Dasar & Sensor Lokal",
      caraKerjaSingkat:
        "ESP32 membaca intensitas cahaya matahari dari Sensor LDR (GPIO 34). Saat siang hari (>= 300 Lux) lampu mati untuk hemat energi, dan saat malam (< 300 Lux) Relay menyalakan Lampu Jalan.",
      inputYangDiubah: "Sensor LDR (Lux)",
      kondisiPemicuAktif: "Nilai Cahaya LDR < 300 Lux (Gelap Malam)",
      responAktuator: "Relay 1-Channel ON ➔ Lampu Jalan Menyala Hijau",
      langkahCepatUji: [
        "Klik tombol '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' di kanan untuk membuat LDR menjadi Gelap (150 Lux) dan melihat Lampu Jalan menyala!",
        "Atau klik komponen 'Sensor LDR (Lux)' di kanvas, lalu geser slider di Inspector kanan ke bawah 300 Lux.",
      ],
    };
  }

  if (id === "proj-2" || judul.includes("smart door lock")) {
    return {
      kategoriLabel: "2. Smart Home & Keamanan IoT",
      caraKerjaSingkat:
        "Memvalidasi kartu akses pada RFID Reader RC522 (GPIO 5). Saat kartu ditempelkan (STATUS: ON), ESP32 mengaktifkan Relay Solenoid 12V (GPIO 32) dan memutar Servo (GPIO 18) ke 90°.",
      inputYangDiubah: "RFID RC522 Tap",
      kondisiPemicuAktif: "Status RFID = ON / Kartu Valid Ditempel",
      responAktuator: "Relay ON ➔ Solenoid 12V UNLOCKED & Servo Membuka 90°",
      langkahCepatUji: [
        "Klik tombol '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' di kanan untuk men-tap kartu RFID secara instan!",
        "Atau klik 'RFID RC522 Tap' di kanvas lalu tekan tombol 'STATUS: ON / HIGH' di Inspector kanan.",
      ],
    };
  }

  if (id === "proj-3" || judul.includes("greenhouse")) {
    return {
      kategoriLabel: "3. Pertanian, Tambak & Medis",
      caraKerjaSingkat:
        "Sistem irigasi & pendingin independen: Pompa Air menyala jika Kelembapan Tanah kering (< 45%), sedangkan Kipas DC menyala jika Suhu DHT22 panas (> 30°C).",
      inputYangDiubah: "Kelembapan Tanah (%) & Suhu DHT22 (°C)",
      kondisiPemicuAktif: "Tanah < 45% (Pompa ON) ATAU Suhu > 30°C (Kipas ON)",
      responAktuator:
        "Relay 2-Ch Aktif ➔ Pompa Menyembur Air & Kipas DC Berputar",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk membuat tanah kering (25%) & suhu panas (36°C) sehingga Pompa dan Kipas menyala bersamaan!",
        "Klik '🔄 Reset Kondisi Aman (Mati)' untuk mengembalikan tanah lembab (75%) & suhu sejuk (24°C).",
      ],
    };
  }

  if (id === "proj-4" || judul.includes("pemadam kebakaran")) {
    return {
      kategoriLabel: "2. Smart Home & Keamanan IoT",
      caraKerjaSingkat:
        "Mendeteksi bahaya ganda di ruangan: jika Sensor Api Flame mendeteksi titik api (> 35%) ATAU Sensor Gas MQ-2 mendeteksi kebocoran LPG (>= 500 ppm), Pompa Sprinkler dan Sirine Buzzer langsung aktif!",
      inputYangDiubah: "Sensor Api Flame (%) & Sensor Gas MQ-2 (ppm)",
      kondisiPemicuAktif: "Api Flame > 35% ATAU Gas MQ-2 >= 500 ppm",
      responAktuator: "Relay Pemadam ON ➔ Pompa Sprinkler Menyembur & Sirine Bunyi",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk memicu kebocoran gas (850 ppm) & titik api!",
        "Klik '🔄 Reset Kondisi Aman (Mati)' untuk memadamkan api & menghentikan sirine.",
      ],
    };
  }

  if (id === "proj-5" || judul.includes("dual-esp32")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "ESP32 #1 membaca Suhu DHT22 lalu mengirimkannya via kabel silang UART (TX2->RX2) ke ESP32 #2 Gateway. Saat suhu > 30°C, Gateway menyalakan LED Alert.",
      inputYangDiubah: "Suhu DHT22 Node #1 (°C)",
      kondisiPemicuAktif: "Suhu DHT22 > 30°C",
      responAktuator: "Paket UART Terkirim ➔ LED Alert di ESP32 #2 Menyala",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menaikkan suhu Node #1 ke 36°C dan menyalakan LED Gateway #2!",
      ],
    };
  }

  if (id === "proj-6" || judul.includes("otomasi pabrik")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "ESP32 Master memantau suhu/beban mesin industri dan menginstruksikan Arduino Uno Slave untuk mengaktifkan Modul Relay 4-Channel serta memutar Motor Servo Konveyor.",
      inputYangDiubah: "Sensor Suhu / Input Master",
      kondisiPemicuAktif: "Suhu Mesin > 30°C (Mode Operasi Aktif)",
      responAktuator: "Relay 4-Ch Industri ON & Servo Konveyor 360° Berputar",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk mengaktifkan ke-4 kontaktor Relay dan Konveyor Pabrik!",
      ],
    };
  }

  if (id === "proj-7" || judul.includes("3 mikrokontroler")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "Arsitektur klaster 3 mikrokontroler: Chip #1 membaca sensor hulu, Chip #2 memproses data tengah, dan Chip #3 (Arduino Uno) mengeksekusi aktuator hilir saat melewati batas.",
      inputYangDiubah: "Sensor Hulu pada ESP32 #1",
      kondisiPemicuAktif: "Nilai Sensor Melewati Batas Threshold (> 30)",
      responAktuator: "Klaster 3-MCU Sinkron ➔ Aktuator Hilir Menyala",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menguji aliran pemicu dari Chip #1 hingga Chip #3!",
      ],
    };
  }

  if (id.includes("p8") || judul.includes("push button")) {
    return {
      kategoriLabel: "1. Dasar & Sensor Lokal",
      caraKerjaSingkat:
        "Saat Tombol Tekan (Push Button) di GPIO 4 ditekan (ON/HIGH), ESP32 mengalirkan tegangan 3.3V melewati Resistor 220Ω untuk menyalakan LED Merah di GPIO 2.",
      inputYangDiubah: "Tombol Tekan (Input)",
      kondisiPemicuAktif: "Status Tombol = DITEKAN (ON / HIGH)",
      responAktuator: "LED Merah 5mm Menyala Terang",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menekan Push Button dan menyalakan LED Merah!",
      ],
    };
  }

  if (id.includes("p9") || judul.includes("lengan robot")) {
    return {
      kategoriLabel: "1. Dasar & Sensor Lokal",
      caraKerjaSingkat:
        "Memutar knop Potensiometer pada pin ADC GPIO 34. Ketika putaran melewati 50%, ESP32 menggerakkan Servo Lengan Robot ke sudut 120° dan menyalakan LED PWM.",
      inputYangDiubah: "Potensio Knop Putar (%)",
      kondisiPemicuAktif: "Putaran Potensiometer > 50%",
      responAktuator: "Servo Berputar ke 120° & LED Hijau PWM Menyala",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk memutar Potensiometer ke 80% dan menggerakkan Servo!",
      ],
    };
  }

  if (id.includes("p10") || judul.includes("parkir")) {
    return {
      kategoriLabel: "1. Dasar & Sensor Lokal",
      caraKerjaSingkat:
        "Sensor Ultrasonik HC-SR04 memancarkan gelombang pantul untuk mengukur jarak mobil. Saat jarak mobil < 30 cm, Palang Pintu Tol Servo membuka 90° dan Buzzer berbunyi.",
      inputYangDiubah: "Sensor Ultrasonik (cm)",
      kondisiPemicuAktif: "Jarak Kendaraan < 30 cm (Dekat)",
      responAktuator: "Palang Pintu Tol Terbuka 90° & Buzzer Parkir Bunyi",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk mendekatkan jarak mobil ke 15 cm agar palang tol terbuka!",
      ],
    };
  }

  if (id.includes("p11") || judul.includes("anti-maling")) {
    return {
      kategoriLabel: "2. Smart Home & Keamanan IoT",
      caraKerjaSingkat:
        "Sensor PIR mendeteksi radiasi inframerah tubuh manusia di ruangan. Begitu gerakan terdeteksi (ON), Relay menyalakan Lampu Sorot dan Sirine Anti-Maling berbunyi.",
      inputYangDiubah: "Sensor Gerak PIR",
      kondisiPemicuAktif: "Gerakan Terdeteksi (Status PIR = ON)",
      responAktuator: "Relay Lampu Sorot ON & Sirine Anti-Maling Berbunyi",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk mensimulasikan gerakan penyusup di depan Sensor PIR!",
      ],
    };
  }

  if (id.includes("p12") || judul.includes("npk")) {
    return {
      kategoriLabel: "3. Pertanian, Tambak & Medis",
      caraKerjaSingkat:
        "Sensor NPK 3-Garpu mengukur kadar hara tanah via RS485. Jika nutrisi Nitrogen turun di bawah 100 mg/kg, Relay otomatis menyalakan Pompa Injeksi Pupuk Cair.",
      inputYangDiubah: "Sensor Pupuk NPK (mg/kg)",
      kondisiPemicuAktif: "Kadar NPK Tanah < 100 mg/kg (Kurang Subur)",
      responAktuator: "Relay Dosis ON ➔ Pompa Injeksi Pupuk Menyembur",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menurunkan NPK ke 65 mg/kg dan menyalakan Pompa Pupuk!",
      ],
    };
  }

  if (id.includes("p13") || judul.includes("18650")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "Memantau voltase paket Baterai Li-Ion 18650 melalui Sensor Tegangan DC (GPIO 35). Saat tegangan baterai drop (< 11V), Relay Charger Surya otomatis aktif mengisi daya.",
      inputYangDiubah: "Sensor Tegangan DC / Baterai 18650 (V)",
      kondisiPemicuAktif: "Tegangan Baterai < 11 V (Low Battery)",
      responAktuator: "Relay Charger Surya ON ➔ LED Indikator Charging Menyala",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk mensimulasikan baterai drop (9.5V) agar Charger Surya aktif!",
      ],
    };
  }

  if (id.includes("p14") || judul.includes("gps")) {
    return {
      kategoriLabel: "2. Smart Home & Keamanan IoT",
      caraKerjaSingkat:
        "Modul GPS NEO-6M mengunci koordinat satelit kendaraan sementara RFID RC522 menjadi kunci kontak pintar. Saat RFID di-tap, Relay Starter Mesin dan indikator menyala.",
      inputYangDiubah: "RFID Kunci Kontak",
      kondisiPemicuAktif: "Kartu RFID Pengemudi Ditempel (ON)",
      responAktuator: "Relay Starter Mesin ON & Koordinat GPS Terkirim ke Peta",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menempelkan RFID Kunci Kontak dan menyalakan mesin!",
      ],
    };
  }

  if (id.includes("p15") || judul.includes("tambak")) {
    return {
      kategoriLabel: "3. Pertanian, Tambak & Medis",
      caraKerjaSingkat:
        "Mengontrol ekosistem tambak udang: jika indeks kualitas/pH air turun (< 45%) Pompa Sirkulasi menyala, dan jika Suhu Air > 30°C Kincir Air Oksigen berputar.",
      inputYangDiubah: "Sensor Kualitas Air (%) & Suhu Air Tambak (°C)",
      kondisiPemicuAktif: "Kualitas Air < 45% ATAU Suhu Tambak > 30°C",
      responAktuator: "Relay 2-Ch ON ➔ Pompa Sirkulasi & Kincir Air Aktif",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menguji nyala Pompa Sirkulasi dan Kincir Oksigen Tambak!",
      ],
    };
  }

  if (id.includes("p16") || judul.includes("vaksin")) {
    return {
      kategoriLabel: "3. Pertanian, Tambak & Medis",
      caraKerjaSingkat:
        "Menjaga suhu ruang penyimpanan vaksin medis. Jika suhu naik melewati batas aman (> 30°C), Relay Pendingin Peltier menyalakan Kipas Kompresor dan Alarm Medis.",
      inputYangDiubah: "Suhu Ruang Vaksin (°C)",
      kondisiPemicuAktif: "Suhu Ruang Vaksin > 30°C",
      responAktuator: "Relay Peltier ON ➔ Kipas Kompresor & Alarm Vaksin Aktif",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menaikkan suhu ruang vaksin dan memicu pendingin darurat!",
      ],
    };
  }

  if (id.includes("p17") || judul.includes("gardu") || judul.includes("pln")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "Memantau persentase beban pemakaian listrik gedung. Jika beban melewati 50% kuota daya, ESP32 mengaktifkan Relay 4-Channel Distribusi dan Alarm Overload.",
      inputYangDiubah: "Potensio Beban Daya (%)",
      kondisiPemicuAktif: "Beban Pemakaian Listrik > 50%",
      responAktuator: "Relay 4-Ch Distribusi ON & Alarm Overload Berbunyi",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menaikkan beban listrik ke 80% dan memicu proteksi PLN!",
      ],
    };
  }

  if (id.includes("p18") || judul.includes("isolasi")) {
    return {
      kategoriLabel: "3. Pertanian, Tambak & Medis",
      caraKerjaSingkat:
        "Menjaga sterilitas udara ruang isolasi rumah sakit: jika partikel/gas udara >= 500 ppm atau suhu > 30°C, Kipas HEPA Exhaust dan Pompa Disinfektan bekerja otomatis.",
      inputYangDiubah: "Sensor Kualitas Udara (ppm) & Suhu Ruang (°C)",
      kondisiPemicuAktif: "Udara >= 500 ppm ATAU Suhu > 30°C",
      responAktuator: "Relay 2-Ch ON ➔ Kipas HEPA & Pompa Disinfektan Menyala",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk menguji sterilisasi ruang isolasi otomatis!",
      ],
    };
  }

  if (id.includes("p19") || judul.includes("gambut") || judul.includes("hutan")) {
    return {
      kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
      caraKerjaSingkat:
        "Stasiun pemantau kebakaran hutan gambut dengan GPS NEO-6M: saat Sensor Api (> 35%) atau Asap Gambut (>= 500 ppm) terdeteksi, Pompa Pembasah Kanal otomatis menyembur.",
      inputYangDiubah: "Sensor Api Hutan & Sensor Asap Gambut (ppm)",
      kondisiPemicuAktif: "Titik Api > 35% ATAU Asap Gambut >= 500 ppm",
      responAktuator: "Relay Sekat Kanal ON ➔ Pompa Pembasah Gambut Menyembur",
      langkahCepatUji: [
        "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk memicu simulasi hotspot gambut dan menyalakan pompa kanal!",
      ],
    };
  }

  return {
    kategoriLabel: "4. Multi-MCU, Energi & Master AIoT",
    caraKerjaSingkat:
      "Arsitektur Puncak AIoT Smart Factory: menggabungkan 2 ESP32, sensor Suhu Mesin DHT22 & Emisi Gas MQ-2 dengan inferensi TinyML untuk menyalakan Relay 4-Ch, Pompa Coolant, dan Blower.",
    inputYangDiubah: "Suhu Mesin Utama (°C) & Sensor Emisi Gas (ppm)",
    kondisiPemicuAktif: "Suhu Mesin > 30°C ATAU Emisi Gas >= 500 ppm",
    responAktuator: "Relay 4-Ch AI ON ➔ Pompa Coolant & Blower Pendingin Aktif",
    langkahCepatUji: [
      "Klik '⚡ Simulasikan Kondisi Aktif (Uji Nyala)' untuk memicu anomali panas/gas mesin dan melihat Pompa Coolant + Blower bekerja!",
    ],
  };
}