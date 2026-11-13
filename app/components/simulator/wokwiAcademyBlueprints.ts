// app/components/simulator/wokwiAcademyBlueprints.ts
import { TitikPinFisik } from "./wokwiHardwareVisuals";
import { LessonStepIoT } from "./wokwiCurriculumData";
import { cariSpesifikasiMultiItemSesuaiModul } from "./wokwiLevelComponentMap";

export type KategoriKesulitanAcademy =
  | "Semua"
  | "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)"
  | "Bab 2: Output LED Tunggal & Lampu Lalu Lintas"
  | "Bab 3: Digital/Analog Input & External Interrupt"
  | "Bab 4: Sensor, Aktuator & Otomasi Cerdas"
  | "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";

export type ExtendedLessonStepIoT = LessonStepIoT & {
  jumlahSlotAktif?: number;
  kategoriKesulitan?: string;
};

export interface AturanSambunganKabelReal {
  idSambungan: string;
  pinAsalId: string;
  labelPinAsal: string;
  pinTujuanId: string;
  labelPinTujuan: string;
  warnaKabel: string;
  keteranganJalur: string;
}

export interface DefinisiSlotPeriferalMultiPin {
  nomorSlot: number;
  namaTarget: string;
  fungsiSingkat: string;
  daftarIdGudangValid: string[];
  kataKunciCocokGudang: string[];
  idGambarMiniatur: string;
  boxX: number;
  boxY: number;
  boxW: number;
  boxH: number;
  daftarPinKomponenIni: TitikPinFisik[];
}

export interface BlueprintMultiPinLevel {
  analogiMudahPaham: string;
  ringkasanCaraKerja: string;
  tinggiKanvasSvg: number;
  slotPeriferalList: DefinisiSlotPeriferalMultiPin[];
  sambunganWajibList: AturanSambunganKabelReal[];
}

export function hitungGelangResistorModular(ohm: number) {
  const petaWarna: Record<number, string> = {
    0: "#000000",
    1: "#78350f",
    2: "#ef4444",
    3: "#f97316",
    4: "#facc15",
    5: "#22c55e",
    6: "#2563eb",
    7: "#9333ea",
    8: "#64748b",
    9: "#ffffff",
  };
  const namaWarna: Record<number, string> = {
    0: "Hitam",
    1: "Coklat",
    2: "Merah",
    3: "Oranye",
    4: "Kuning",
    5: "Hijau",
    6: "Biru",
    7: "Ungu",
    8: "Abu-abu",
    9: "Putih",
  };
  const bersih = Math.max(10, Math.round(ohm));
  const str = String(bersih);
  const d1 = parseInt(str[0] || "2", 10);
  const d2 = parseInt(str[1] || "2", 10);
  const jmlNol = Math.max(0, str.length - 2);
  const labelFormatted =
    bersih >= 1000
      ? `${(bersih / 1000).toFixed(bersih % 1000 === 0 ? 0 : 1)} kΩ`
      : `${bersih} Ω`;
  return {
    warna1: petaWarna[d1] || "#ef4444",
    warna2: petaWarna[d2] || "#ef4444",
    warnaMultiplier: petaWarna[Math.min(9, jmlNol)] || "#78350f",
    warnaToleransi: "#eab308",
    teksGelang: `${namaWarna[d1]} - ${namaWarna[d2]} - ${
      namaWarna[Math.min(9, jmlNol)]
    } - Emas`,
    labelFormatted,
  };
}

export function dapatkanBabDariLevel(item: ExtendedLessonStepIoT): string {
  if (item.kategoriKesulitan) return item.kategoriKesulitan;
  if (item.level <= 3)
    return "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)";
  if (item.level <= 6) return "Bab 2: Output LED Tunggal & Lampu Lalu Lintas";
  if (item.level <= 9)
    return "Bab 3: Digital/Analog Input & External Interrupt";
  if (item.level <= 12) return "Bab 4: Sensor, Aktuator & Otomasi Cerdas";
  return "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";
}

export function apakahKartuGudangValidUntukSlot(
  item: { id: string; nama: string; cocokUntukDropZone?: string },
  slot: DefinisiSlotPeriferalMultiPin
): boolean {
  const idLower = item.id.toLowerCase();
  const namaLower = item.nama.toLowerCase();

  if (slot.daftarIdGudangValid.includes(idLower)) {
    return true;
  }

  const slotMintaLed = slot.daftarIdGudangValid.some((id) =>
    id.startsWith("led_")
  );
  if (
    slotMintaLed &&
    (idLower.includes("oled") ||
      namaLower.includes("oled") ||
      idLower.includes("lcd") ||
      namaLower.includes("lcd"))
  ) {
    return false;
  }

  return slot.kataKunciCocokGudang.some((kw) =>
    namaLower.includes(kw.toLowerCase())
  );
}

// ============================================================================
// GENERATOR TATA LETAK KANVAS LEBAR (920PX) BEBAS TABRAKAN TEKS
// ============================================================================
export function ambilBlueprintMultiPinRealistis(
  materi: ExtendedLessonStepIoT
): BlueprintMultiPinLevel {
  const judul = (materi.judulMateri || "").toLowerCase();

  // 1. STANDALONE 1-BOARD ESP32 (Tanpa Komponen Luar)
  if (
    judul.includes("internal") ||
    judul.includes("tanpa komponen") ||
    judul.includes("web server") ||
    judul.includes("blynk") ||
    (judul.includes("wi-fi") && !judul.includes("mesh")) ||
    (judul.includes("timer") && !judul.includes("dht"))
  ) {
    return {
      analogiMudahPaham:
        "Di level ini kita memprogram fitur yang sudah tertanam di dalam papan ESP32 itu sendiri (LED Biru On-Board di GPIO 2, Timer Kristal 80MHz, dan Radio Wi-Fi HibahIlmu-Guest). Jadi kamu cukup menaruh 1 papan ESP32 tanpa kabel luar!",
      ringkasanCaraKerja:
        "Tarik 1 papan ESP32 DevKit V1 ke Slot #1 di kanvas, lalu ketik kode C++ di sebelah kanan.",
      tinggiKanvasSvg: 300,
      slotPeriferalList: [],
      sambunganWajibList: [],
    };
  }

  // 2. RANGKAIAN SERI REALISTIS: 3 ITEM (ESP32 + LED 5MM + RESISTOR 220Ω)
  if (
    judul.includes("1 komponen output") ||
    judul.includes("1 led") ||
    judul.includes("mengedipkan lampu led") ||
    judul.includes("pulse width modulation") ||
    (judul.includes("led") &&
      !judul.includes("lalu lintas") &&
      !judul.includes("button") &&
      !judul.includes("tombol") &&
      !judul.includes("potensiometer"))
  ) {
    return {
      analogiMudahPaham:
        "Agar rangkaian listrik benar-benar hidup seperti aslinya, semua kaki komponen wajib tersambung membentuk lingkaran tertutup (Loop)! Arus 3.3V keluar dari [GPIO 2 ESP32] ➔ masuk ke [1. Anoda LED (+)] ➔ keluar dari [2. Katoda LED (-)] ➔ masuk ke [1. Kaki 1 Resistor] ➔ lalu keluar dari [2. Kaki 2 Resistor] kembali ke [GND ESP32]!",
      ringkasanCaraKerja:
        "Tarik 3 Item Komponen (ESP32, LED Merah 5mm, dan Resistor 220Ω) lalu sambungkan ke-3 kabel serinya!",
      tinggiKanvasSvg: 300,
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "LED Merah 5mm",
          fungsiSingkat: "Anoda (+) untuk arus masuk dan Katoda (-) menuju Resistor.",
          daftarIdGudangValid: ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau"],
          kataKunciCocokGudang: ["led merah", "led hijau"],
          idGambarMiniatur: "led_merah",
          boxX: 390,
          boxY: 28,
          boxW: 360,
          boxH: 108,
          daftarPinKomponenIni: [
            { idPin: "LED_ANODA", labelPin: "1. Anoda LED (+)", x: 390, y: 58, warnaPin: "#ef4444", posisiKomponen: "periferal" },
            { idPin: "LED_KATODA", labelPin: "2. Katoda LED (-)", x: 390, y: 104, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Resistor Gelang 220Ω",
          fungsiSingkat: "Kaki 1 menerima dari Katoda LED, Kaki 2 kembali ke GND ESP32.",
          daftarIdGudangValid: ["resistor_gelang", "pas_resistor", "resistor_220"],
          kataKunciCocokGudang: ["resistor"],
          idGambarMiniatur: "resistor_gelang",
          boxX: 390,
          boxY: 158,
          boxW: 360,
          boxH: 108,
          daftarPinKomponenIni: [
            { idPin: "RES_KAKI_1", labelPin: "1. Resistor In", x: 390, y: 188, warnaPin: "#f59e0b", posisiKomponen: "periferal" },
            { idPin: "RES_KAKI_2", labelPin: "2. Resistor GND", x: 390, y: 234, warnaPin: "#64748b", posisiKomponen: "periferal" },
          ],
        },
      ],
      sambunganWajibList: [
        {
          idSambungan: "WIRE_1_GPIO2_ANODA",
          pinAsalId: "ESP_GPIO2",
          labelPinAsal: "GPIO 2",
          pinTujuanId: "LED_ANODA",
          labelPinTujuan: "1. Anoda LED (+)",
          warnaKabel: "#ef4444",
          keteranganJalur: "Kabel 1: Klik [GPIO 2] di ESP32 ➔ Klik [1. Anoda LED (+)] di Slot #2",
        },
        {
          idSambungan: "WIRE_2_KATODA_RES1",
          pinAsalId: "LED_KATODA",
          labelPinAsal: "2. Katoda LED (-)",
          pinTujuanId: "RES_KAKI_1",
          labelPinTujuan: "1. Resistor In",
          warnaKabel: "#facc15",
          keteranganJalur: "Kabel 2 (Seri): Klik [2. Katoda LED (-)] di Slot #2 ➔ Klik [1. Resistor In] di Slot #3",
        },
        {
          idSambungan: "WIRE_3_RES2_GND",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "RES_KAKI_2",
          labelPinTujuan: "2. Resistor GND",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 3 (Ground): Klik [2. Resistor GND] di Slot #3 ➔ Klik [GND] di ESP32",
        },
      ],
    };
  }

  // 3. PUSH BUTTON + LED + RESISTOR + BUZZER (VARIASI 5 ITEM KOMPONEN LEGA & RAPI!)
  if (judul.includes("button") || judul.includes("tombol") || judul.includes("interrupt")) {
    const daftar5: DefinisiSlotPeriferalMultiPin[] = [
      {
        nomorSlot: 2,
        namaTarget: "Push Button Switch",
        fungsiSingkat: "Sakelar pemicu sinyal LOW ke GPIO 4.",
        daftarIdGudangValid: ["push_button_sw", "pas_button", "keypad_4x4"],
        kataKunciCocokGudang: ["push button", "tombol"],
        idGambarMiniatur: "push_button_sw",
        boxX: 310,
        boxY: 26,
        boxW: 275,
        boxH: 110,
        daftarPinKomponenIni: [
          { idPin: "B5_SIG", labelPin: "1. Tombol SIG", x: 310, y: 58, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
          { idPin: "B5_GND", labelPin: "2. Tombol GND", x: 310, y: 104, warnaPin: "#64748b", posisiKomponen: "periferal" },
        ],
      },
      {
        nomorSlot: 3,
        namaTarget: "LED Merah 5mm",
        fungsiSingkat: "Menyala saat tombol ditekan (GPIO 2).",
        daftarIdGudangValid: ["led_merah", "led_hijau", "pas_led_merah"],
        kataKunciCocokGudang: ["led merah", "led hijau"],
        idGambarMiniatur: "led_merah",
        boxX: 620,
        boxY: 26,
        boxW: 275,
        boxH: 110,
        daftarPinKomponenIni: [
          { idPin: "B5_LED_A", labelPin: "1. Anoda LED (+)", x: 620, y: 58, warnaPin: "#ef4444", posisiKomponen: "periferal" },
          { idPin: "B5_LED_K", labelPin: "2. Katoda LED (-)", x: 620, y: 104, warnaPin: "#facc15", posisiKomponen: "periferal" },
        ],
      },
      {
        nomorSlot: 4,
        namaTarget: "Resistor Gelang 220Ω",
        fungsiSingkat: "Penahan arus dari Katoda LED ke GND.",
        daftarIdGudangValid: ["resistor_gelang", "pas_resistor"],
        kataKunciCocokGudang: ["resistor"],
        idGambarMiniatur: "resistor_gelang",
        boxX: 310,
        boxY: 160,
        boxW: 275,
        boxH: 110,
        daftarPinKomponenIni: [
          { idPin: "B5_RES_1", labelPin: "1. Resistor In", x: 310, y: 192, warnaPin: "#facc15", posisiKomponen: "periferal" },
          { idPin: "B5_RES_2", labelPin: "2. Resistor GND", x: 310, y: 238, warnaPin: "#64748b", posisiKomponen: "periferal" },
        ],
      },
      {
        nomorSlot: 5,
        namaTarget: "Buzzer Piezo (2p)",
        fungsiSingkat: "Berbunyi bersama LED saat tombol aktif.",
        daftarIdGudangValid: ["buzzer_piezo", "akt_buzzer"],
        kataKunciCocokGudang: ["buzzer"],
        idGambarMiniatur: "buzzer_piezo",
        boxX: 620,
        boxY: 160,
        boxW: 275,
        boxH: 110,
        daftarPinKomponenIni: [
          { idPin: "B5_BUZ_P", labelPin: "1. Buzzer (+)", x: 620, y: 192, warnaPin: "#ec4899", posisiKomponen: "periferal" },
          { idPin: "B5_BUZ_N", labelPin: "2. Buzzer (-)", x: 620, y: 238, warnaPin: "#64748b", posisiKomponen: "periferal" },
        ],
      },
    ];

    return {
      analogiMudahPaham:
        "Dalam rangkaian 5 Item Komponen ini, kamu merakit sistem tombol darurat lengkap: (1) ESP32, (2) Push Button Switch, (3) Lampu LED Indikator, (4) Resistor 220Ω, dan (5) Buzzer Alarm!",
      ringkasanCaraKerja:
        "Tarik kelima komponen satu per satu ke Slot #1 s.d. Slot #5, lalu sambungkan semua kaki pinnya!",
      tinggiKanvasSvg: 300,
      slotPeriferalList: daftar5,
      sambunganWajibList: [
        { idSambungan: "B5_W1", pinAsalId: "ESP_GPIO4", labelPinAsal: "GPIO 4", pinTujuanId: "B5_SIG", labelPinTujuan: "1. Tombol SIG", warnaKabel: "#38bdf8", keteranganJalur: "Kabel 1: Klik [GPIO 4] ➔ Klik [1. Tombol SIG] (Slot #2)" },
        { idSambungan: "B5_W2", pinAsalId: "ESP_GND", labelPinAsal: "GND", pinTujuanId: "B5_GND", labelPinTujuan: "2. Tombol GND", warnaKabel: "#64748b", keteranganJalur: "Kabel 2: Klik [GND] ➔ Klik [2. Tombol GND] (Slot #2)" },
        { idSambungan: "B5_W3", pinAsalId: "ESP_GPIO2", labelPinAsal: "GPIO 2", pinTujuanId: "B5_LED_A", labelPinTujuan: "1. Anoda LED (+)", warnaKabel: "#ef4444", keteranganJalur: "Kabel 3: Klik [GPIO 2] ➔ Klik [1. Anoda LED (+)] (Slot #3)" },
        { idSambungan: "B5_W4", pinAsalId: "B5_LED_K", labelPinAsal: "2. Katoda LED (-)", pinTujuanId: "B5_RES_1", labelPinTujuan: "1. Resistor In", warnaKabel: "#facc15", keteranganJalur: "Kabel 4 (Seri): Klik [2. Katoda LED (-)] (Slot #3) ➔ Klik [1. Resistor In] (Slot #4)" },
        { idSambungan: "B5_W5", pinAsalId: "ESP_GND", labelPinAsal: "GND", pinTujuanId: "B5_RES_2", labelPinTujuan: "2. Resistor GND", warnaKabel: "#64748b", keteranganJalur: "Kabel 5: Klik [GND] ➔ Klik [2. Resistor GND] (Slot #4)" },
        { idSambungan: "B5_W6", pinAsalId: "ESP_GPIO19", labelPinAsal: "GPIO 19", pinTujuanId: "B5_BUZ_P", labelPinTujuan: "1. Buzzer (+)", warnaKabel: "#ec4899", keteranganJalur: "Kabel 6: Klik [GPIO 19] ➔ Klik [1. Buzzer (+)] (Slot #5)" },
        { idSambungan: "B5_W7", pinAsalId: "ESP_GND", labelPinAsal: "GND", pinTujuanId: "B5_BUZ_N", labelPinTujuan: "2. Buzzer (-)", warnaKabel: "#64748b", keteranganJalur: "Kabel 7: Klik [GND] ➔ Klik [2. Buzzer (-)] (Slot #5)" },
      ],
    };
  }

  // ==========================================================================
  // 4. LAYOUT OTOMATIS PADA KANVAS LEBAR 920PX UNTUK VARIASI 3, 5, 7, 10 ITEM
  // ==========================================================================
  const spekMulti = cariSpesifikasiMultiItemSesuaiModul(materi);
  const items = spekMulti.daftarPeriferal;
  const jmlPerif = items.length;

  // Gunakan maksimal 2 kolom yang lebar di sebelah kanan ESP32 agar tidak pernah sempit!
  const jmlKolom = jmlPerif <= 2 ? 1 : 2;
  const jmlBaris = Math.ceil(jmlPerif / jmlKolom);

  const boxW = jmlKolom === 1 ? 360 : 280;
  const boxH = 106;
  const gapX = 32;
  const gapY = 20;
  const startX = jmlKolom === 1 ? 390 : 305;
  const startY = 24;

  const tinggiKanvasSvg = Math.max(
    300,
    startY * 2 + jmlBaris * boxH + (jmlBaris - 1) * gapY
  );

  const slotPeriferalList: DefinisiSlotPeriferalMultiPin[] = [];
  const sambunganWajibList: AturanSambunganKabelReal[] = [];

  items.forEach((it, idx) => {
    const nomorSlot = idx + 2;
    const col = idx % jmlKolom;
    const row = Math.floor(idx / jmlKolom);

    const bx = startX + col * (boxW + gapX);
    const by = startY + row * (boxH + gapY);

    const pin1Id = `SLOT${nomorSlot}_PIN1`;
    const pin2Id = `SLOT${nomorSlot}_PIN2`;

    const pin1Y = by + 32;
    const pin2Y = by + 78;

    slotPeriferalList.push({
      nomorSlot,
      namaTarget: it.namaTampil,
      fungsiSingkat: it.fungsiSingkat,
      daftarIdGudangValid: it.idGudangValid,
      kataKunciCocokGudang: it.kataKunciValid,
      idGambarMiniatur: it.idGambar,
      boxX: bx,
      boxY: by,
      boxW,
      boxH,
      daftarPinKomponenIni: [
        {
          idPin: pin1Id,
          labelPin: it.pin1Label,
          x: bx,
          y: pin1Y,
          warnaPin: it.pinEspKePin1.warna,
          posisiKomponen: "periferal",
        },
        {
          idPin: pin2Id,
          labelPin: it.pin2Label,
          x: bx,
          y: pin2Y,
          warnaPin: it.pinEspKePin2.warna,
          posisiKomponen: "periferal",
        },
      ],
    });

    sambunganWajibList.push({
      idSambungan: `W_${nomorSlot}_1`,
      pinAsalId: it.pinEspKePin1.id,
      labelPinAsal: it.pinEspKePin1.label,
      pinTujuanId: pin1Id,
      labelPinTujuan: `${it.pin1Label} (Slot #${nomorSlot})`,
      warnaKabel: it.pinEspKePin1.warna,
      keteranganJalur: `Kabel ${idx * 2 + 1}: Klik [${it.pinEspKePin1.label}] di ESP32 ➔ Klik [${it.pin1Label}] di Slot #${nomorSlot}`,
    });

    sambunganWajibList.push({
      idSambungan: `W_${nomorSlot}_2`,
      pinAsalId: it.pinEspKePin2.id,
      labelPinAsal: it.pinEspKePin2.label,
      pinTujuanId: pin2Id,
      labelPinTujuan: `${it.pin2Label} (Slot #${nomorSlot})`,
      warnaKabel: it.pinEspKePin2.warna,
      keteranganJalur: `Kabel ${idx * 2 + 2}: Klik [${it.pinEspKePin2.label}] di ESP32 ➔ Klik [${it.pin2Label}] di Slot #${nomorSlot}`,
    });
  });

  return {
    analogiMudahPaham: spekMulti.analogiMudah,
    ringkasanCaraKerja: `Proyek ini menggunakan total ${
      1 + jmlPerif
    } Item Komponen (Slot #1 s.d. Slot #${
      1 + jmlPerif
    }) dan ${sambunganWajibList.length} sambungan kaki pin!`,
    tinggiKanvasSvg,
    slotPeriferalList,
    sambunganWajibList,
  };
}