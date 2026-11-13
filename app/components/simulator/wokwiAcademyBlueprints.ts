// app/components/simulator/wokwiAcademyBlueprints.ts
import { TitikPinFisik } from "./wokwiHardwareVisuals";
import { LessonStepIoT } from "./wokwiCurriculumData";
import { cariSpesifikasiKomponenSesuaiModul } from "./wokwiLevelComponentMap";

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

  // 1. Cek daftar ID eksak yang diizinkan untuk slot ini
  if (slot.daftarIdGudangValid.includes(idLower)) {
    return true;
  }

  // 2. Proteksi ketat: jangan izinkan OLED/LCD masuk ke slot LED!
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

  // 3. Cek kecocokan kata kunci spesifik
  return slot.kataKunciCocokGudang.some((kw) =>
    namaLower.includes(kw.toLowerCase())
  );
}

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
      slotPeriferalList: [],
      sambunganWajibList: [],
    };
  }

  // 2. RANGKAIAN SERI REALISTIS: LED 5MM (2 KAKI) + RESISTOR 220Ω (2 KAKI)
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
        "Hanya komponen LED 5mm yang boleh masuk ke Slot #2, dan hanya Resistor 220Ω yang boleh masuk ke Slot #3. Sambungkan ketiga kabel serinya!",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "LED Merah 5mm (2 Kaki: Anoda & Katoda)",
          fungsiSingkat: "Memiliki 2 kaki: Anoda (+) untuk arus masuk dan Katoda (-) menuju Resistor.",
          daftarIdGudangValid: ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau"],
          kataKunciCocokGudang: ["led merah", "led hijau"],
          idGambarMiniatur: "led_merah",
          boxX: 335,
          boxY: 22,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "LED_ANODA", labelPin: "1. Anoda LED (+)", x: 345, y: 48, warnaPin: "#ef4444", posisiKomponen: "periferal" },
            { idPin: "LED_KATODA", labelPin: "2. Katoda LED (-)", x: 345, y: 90, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "Resistor Gelang 220Ω (2 Kaki: In & Out)",
          fungsiSingkat: "Memiliki 2 kaki: Kaki 1 menerima dari Katoda LED, Kaki 2 kembali ke GND ESP32.",
          daftarIdGudangValid: ["resistor_gelang", "pas_resistor", "resistor_220"],
          kataKunciCocokGudang: ["resistor"],
          idGambarMiniatur: "resistor_gelang",
          boxX: 335,
          boxY: 132,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "RES_KAKI_1", labelPin: "1. Kaki 1 Resistor (In)", x: 345, y: 158, warnaPin: "#f59e0b", posisiKomponen: "periferal" },
            { idPin: "RES_KAKI_2", labelPin: "2. Kaki 2 Resistor (GND)", x: 345, y: 200, warnaPin: "#64748b", posisiKomponen: "periferal" },
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
          labelPinTujuan: "1. Kaki 1 Resistor (In)",
          warnaKabel: "#facc15",
          keteranganJalur: "Kabel 2 (Seri): Klik [2. Katoda LED (-)] di Slot #2 ➔ Klik [1. Kaki 1 Resistor (In)] di Slot #3",
        },
        {
          idSambungan: "WIRE_3_RES2_GND",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "RES_KAKI_2",
          labelPinTujuan: "2. Kaki 2 Resistor (GND)",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 3 (Ground): Klik [2. Kaki 2 Resistor (GND)] di Slot #3 ➔ Klik [GND] di ESP32",
        },
      ],
    };
  }

  // 3. LAMPU LALU LINTAS MULTI-LED
  if (judul.includes("lalu lintas") || (judul.includes("merah") && judul.includes("hijau"))) {
    return {
      analogiMudahPaham:
        "Pada Lampu Lalu Lintas ini terdapat 2 lampu LED (Merah di Slot #2 & Hijau di Slot #3), dan masing-masing LED memiliki 2 kaki (Anoda + dan Katoda -). Keempat kakinya wajib dihubungkan ke GPIO 2, GPIO 15, dan GND!",
      ringkasanCaraKerja:
        "Tarik ESP32 ke Slot #1, LED Merah 5mm ke Slot #2, dan LED Hijau 5mm ke Slot #3, lalu pasang ke-4 kabelnya!",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "LED Merah 5mm (2 Kaki: Anoda & Katoda)",
          fungsiSingkat: "Kaki Anoda (+) ke GPIO 2, Kaki Katoda (-) ke GND.",
          daftarIdGudangValid: ["led_merah", "pas_led_merah"],
          kataKunciCocokGudang: ["led merah"],
          idGambarMiniatur: "led_merah",
          boxX: 335,
          boxY: 22,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "TL_MERAH_POS", labelPin: "1. Anoda Merah (+)", x: 345, y: 48, warnaPin: "#ef4444", posisiKomponen: "periferal" },
            { idPin: "TL_MERAH_NEG", labelPin: "2. Katoda Merah (-)", x: 345, y: 90, warnaPin: "#64748b", posisiKomponen: "periferal" },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "LED Hijau 5mm (2 Kaki: Anoda & Katoda)",
          fungsiSingkat: "Kaki Anoda (+) ke GPIO 15, Kaki Katoda (-) ke GND.",
          daftarIdGudangValid: ["led_hijau", "pas_led_hijau"],
          kataKunciCocokGudang: ["led hijau"],
          idGambarMiniatur: "led_hijau",
          boxX: 335,
          boxY: 132,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "TL_HIJAU_POS", labelPin: "1. Anoda Hijau (+)", x: 345, y: 158, warnaPin: "#22c55e", posisiKomponen: "periferal" },
            { idPin: "TL_HIJAU_NEG", labelPin: "2. Katoda Hijau (-)", x: 345, y: 200, warnaPin: "#64748b", posisiKomponen: "periferal" },
          ],
        },
      ],
      sambunganWajibList: [
        {
          idSambungan: "TL_W1",
          pinAsalId: "ESP_GPIO2",
          labelPinAsal: "GPIO 2",
          pinTujuanId: "TL_MERAH_POS",
          labelPinTujuan: "1. Anoda Merah (+)",
          warnaKabel: "#ef4444",
          keteranganJalur: "Kabel 1: Klik [GPIO 2] di ESP32 ➔ Klik [1. Anoda Merah (+)] di Slot #2",
        },
        {
          idSambungan: "TL_W2",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "TL_MERAH_NEG",
          labelPinTujuan: "2. Katoda Merah (-)",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 2: Klik [GND] di ESP32 ➔ Klik [2. Katoda Merah (-)] di Slot #2",
        },
        {
          idSambungan: "TL_W3",
          pinAsalId: "ESP_GPIO15",
          labelPinAsal: "GPIO 15",
          pinTujuanId: "TL_HIJAU_POS",
          labelPinTujuan: "1. Anoda Hijau (+)",
          warnaKabel: "#22c55e",
          keteranganJalur: "Kabel 3: Klik [GPIO 15] di ESP32 ➔ Klik [1. Anoda Hijau (+)] di Slot #3",
        },
        {
          idSambungan: "TL_W4",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "TL_HIJAU_NEG",
          labelPinTujuan: "2. Katoda Hijau (-)",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 4: Klik [GND] di ESP32 ➔ Klik [2. Katoda Hijau (-)] di Slot #3",
        },
      ],
    };
  }

  // 4. PUSH BUTTON (2 KAKI) + LED/BUZZER (2 KAKI)
  if (judul.includes("button") || judul.includes("tombol") || judul.includes("interrupt")) {
    return {
      analogiMudahPaham:
        "Tombol Push Button di Slot #2 memiliki 2 kaki: Kaki 1 (SIG) ke GPIO 4 dan Kaki 2 ke GND. Sedangkan Lampu LED / Buzzer di Slot #3 memiliki 2 kaki: Kaki Positif (+) ke GPIO 2 dan Kaki Negatif (-) ke GND!",
      ringkasanCaraKerja:
        "Tarik ESP32 ke Slot #1, Push Button Switch ke Slot #2, dan LED Merah / Buzzer ke Slot #3, lalu sambungkan keempat kakinya!",
      slotPeriferalList: [
        {
          nomorSlot: 2,
          namaTarget: "Push Button Switch (2 Kaki: SIG & GND)",
          fungsiSingkat: "Kedua kakinya wajib terhubung ke GPIO 4 dan GND.",
          daftarIdGudangValid: ["push_button_sw", "pas_button", "keypad_4x4", "pas_keypad"],
          kataKunciCocokGudang: ["push button", "tombol", "keypad"],
          idGambarMiniatur: "push_button_sw",
          boxX: 335,
          boxY: 22,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "BTN_KAKI_SIG", labelPin: "1. Kaki Tombol (SIG)", x: 345, y: 48, warnaPin: "#38bdf8", posisiKomponen: "periferal" },
            { idPin: "BTN_KAKI_GND", labelPin: "2. Kaki Tombol (GND)", x: 345, y: 90, warnaPin: "#64748b", posisiKomponen: "periferal" },
          ],
        },
        {
          nomorSlot: 3,
          namaTarget: "LED Merah 5mm / Buzzer (2 Kaki: + dan -)",
          fungsiSingkat: "Kaki Positif (+) ke GPIO 2 dan Kaki Negatif (-) ke GND.",
          daftarIdGudangValid: ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau", "buzzer_piezo", "akt_buzzer"],
          kataKunciCocokGudang: ["led merah", "led hijau", "buzzer"],
          idGambarMiniatur: "led_merah",
          boxX: 335,
          boxY: 132,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            { idPin: "OUT_KAKI_POS", labelPin: "1. Kaki Positif (+)", x: 345, y: 158, warnaPin: "#ef4444", posisiKomponen: "periferal" },
            { idPin: "OUT_KAKI_NEG", labelPin: "2. Kaki Negatif (GND)", x: 345, y: 200, warnaPin: "#64748b", posisiKomponen: "periferal" },
          ],
        },
      ],
      sambunganWajibList: [
        {
          idSambungan: "BTN_W1",
          pinAsalId: "ESP_GPIO4",
          labelPinAsal: "GPIO 4",
          pinTujuanId: "BTN_KAKI_SIG",
          labelPinTujuan: "1. Kaki Tombol (SIG)",
          warnaKabel: "#38bdf8",
          keteranganJalur: "Kabel 1: Klik [GPIO 4] di ESP32 ➔ Klik [1. Kaki Tombol (SIG)] di Slot #2",
        },
        {
          idSambungan: "BTN_W2",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "BTN_KAKI_GND",
          labelPinTujuan: "2. Kaki Tombol (GND)",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 2: Klik [GND] di ESP32 ➔ Klik [2. Kaki Tombol (GND)] di Slot #2",
        },
        {
          idSambungan: "BTN_W3",
          pinAsalId: "ESP_GPIO2",
          labelPinAsal: "GPIO 2",
          pinTujuanId: "OUT_KAKI_POS",
          labelPinTujuan: "1. Kaki Positif (+)",
          warnaKabel: "#ef4444",
          keteranganJalur: "Kabel 3: Klik [GPIO 2] di ESP32 ➔ Klik [1. Kaki Positif (+)] di Slot #3",
        },
        {
          idSambungan: "BTN_W4",
          pinAsalId: "ESP_GND",
          labelPinAsal: "GND",
          pinTujuanId: "OUT_KAKI_NEG",
          labelPinTujuan: "2. Kaki Negatif (GND)",
          warnaKabel: "#64748b",
          keteranganJalur: "Kabel 4: Klik [GND] di ESP32 ➔ Klik [2. Kaki Negatif (GND)] di Slot #3",
        },
      ],
    };
  }

  // 5. AMBIL PEMETAAN EKSPLISIT AKURAT DARI wokwiLevelComponentMap.ts
  const spek = cariSpesifikasiKomponenSesuaiModul(materi);

  return {
    analogiMudahPaham: spek.analogiMudah,
    ringkasanCaraKerja: `Tarik ESP32 ke Slot #1, '${spek.namaTampilSlot2}' ke Slot #2, dan '${spek.namaTampilSlot3}' ke Slot #3, lalu hubungkan keempat kakinya!`,
    slotPeriferalList: [
      {
        nomorSlot: 2,
        namaTarget: spek.namaTampilSlot2,
        fungsiSingkat: spek.fungsiSlot2,
        daftarIdGudangValid: spek.idGudangValidSlot2,
        kataKunciCocokGudang: spek.kataKunciValidSlot2,
        idGambarMiniatur: spek.idGambarSlot2,
        boxX: 335,
        boxY: 22,
        boxW: 225,
        boxH: 92,
        daftarPinKomponenIni: [
          {
            idPin: "MOD2_PIN_1",
            labelPin: spek.pin1Slot2Label,
            x: 345,
            y: 48,
            warnaPin: spek.pinEspKeSlot2Pin1.warna,
            posisiKomponen: "periferal",
          },
          {
            idPin: "MOD2_PIN_2",
            labelPin: spek.pin2Slot2Label,
            x: 345,
            y: 90,
            warnaPin: spek.pinEspKeSlot2Pin2.warna,
            posisiKomponen: "periferal",
          },
        ],
      },
      {
        nomorSlot: 3,
        namaTarget: spek.namaTampilSlot3,
        fungsiSingkat: spek.fungsiSlot3,
        daftarIdGudangValid: spek.idGudangValidSlot3,
        kataKunciCocokGudang: spek.kataKunciValidSlot3,
        idGambarMiniatur: spek.idGambarSlot3,
        boxX: 335,
        boxY: 132,
        boxW: 225,
        boxH: 92,
        daftarPinKomponenIni: [
          {
            idPin: "MOD3_PIN_1",
            labelPin: spek.pin1Slot3Label,
            x: 345,
            y: 158,
            warnaPin: spek.pinEspKeSlot3Pin1.warna,
            posisiKomponen: "periferal",
          },
          {
            idPin: "MOD3_PIN_2",
            labelPin: spek.pin2Slot3Label,
            x: 345,
            y: 200,
            warnaPin: spek.pinEspKeSlot3Pin2.warna,
            posisiKomponen: "periferal",
          },
        ],
      },
    ],
    sambunganWajibList: [
      {
        idSambungan: "M_W1",
        pinAsalId: spek.pinEspKeSlot2Pin1.id,
        labelPinAsal: spek.pinEspKeSlot2Pin1.label,
        pinTujuanId: "MOD2_PIN_1",
        labelPinTujuan: `${spek.pin1Slot2Label} (Slot #2)`,
        warnaKabel: spek.pinEspKeSlot2Pin1.warna,
        keteranganJalur: `Kabel 1: Klik [${spek.pinEspKeSlot2Pin1.label}] di ESP32 ➔ Klik [${spek.pin1Slot2Label}] di Slot #2`,
      },
      {
        idSambungan: "M_W2",
        pinAsalId: spek.pinEspKeSlot2Pin2.id,
        labelPinAsal: spek.pinEspKeSlot2Pin2.label,
        pinTujuanId: "MOD2_PIN_2",
        labelPinTujuan: `${spek.pin2Slot2Label} (Slot #2)`,
        warnaKabel: spek.pinEspKeSlot2Pin2.warna,
        keteranganJalur: `Kabel 2: Klik [${spek.pinEspKeSlot2Pin2.label}] di ESP32 ➔ Klik [${spek.pin2Slot2Label}] di Slot #2`,
      },
      {
        idSambungan: "M_W3",
        pinAsalId: spek.pinEspKeSlot3Pin1.id,
        labelPinAsal: spek.pinEspKeSlot3Pin1.label,
        pinTujuanId: "MOD3_PIN_1",
        labelPinTujuan: `${spek.pin1Slot3Label} (Slot #3)`,
        warnaKabel: spek.pinEspKeSlot3Pin1.warna,
        keteranganJalur: `Kabel 3: Klik [${spek.pinEspKeSlot3Pin1.label}] di ESP32 ➔ Klik [${spek.pin1Slot3Label}] di Slot #3`,
      },
      {
        idSambungan: "M_W4",
        pinAsalId: spek.pinEspKeSlot3Pin2.id,
        labelPinAsal: spek.pinEspKeSlot3Pin2.label,
        pinTujuanId: "MOD3_PIN_2",
        labelPinTujuan: `${spek.pin2Slot3Label} (Slot #3)`,
        warnaKabel: spek.pinEspKeSlot3Pin2.warna,
        keteranganJalur: `Kabel 4: Klik [${spek.pinEspKeSlot3Pin2.label}] di ESP32 ➔ Klik [${spek.pin2Slot3Label}] di Slot #3`,
      },
    ],
  };
}