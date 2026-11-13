// app/components/simulator/wokwiAcademyBlueprints.ts
import { TitikPinFisik } from "./wokwiHardwareVisuals";
import { LessonStepIoT } from "./wokwiCurriculumData";

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
  // ID Eksak dari Gudang 48 Komponen yang diizinkan masuk ke slot ini (Mencegah OLED masuk ke LED!)
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

// Fungsi pencocokan ketat agar komponen seperti OLED ("o-led") TIDAK BISA masuk ke slot LED!
export function apakahKartuGudangValidUntukSlot(
  item: { id: string; nama: string; cocokUntukDropZone?: string },
  slot: DefinisiSlotPeriferalMultiPin
): boolean {
  if (item.cocokUntukDropZone === "esp32_board") return false;
  const idLower = item.id.toLowerCase();
  const namaLower = item.nama.toLowerCase();

  // 1. Cek daftar ID eksak terlebih dahulu
  if (slot.daftarIdGudangValid.includes(idLower)) {
    return true;
  }

  // 2. Proteksi khusus: jika slot meminta LED, tolak keras OLED / LCD!
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

  // 3. Cek kata kunci dengan batas kata (word boundary)
  return slot.kataKunciCocokGudang.some((kw) => {
    const regex = new RegExp(`(^|\\s|_|-)${kw.toLowerCase()}($|\\s|_|-|5mm)`, "i");
    return regex.test(idLower) || regex.test(namaLower);
  });
}

// ============================================================================
// GENERATOR BLUEPRINT MULTI-PIN REALISTIS (VALIDASI KOMPONEN KETAT & 2 KAKI)
// ============================================================================
export function ambilBlueprintMultiPinRealistis(
  materi: ExtendedLessonStepIoT
): BlueprintMultiPinLevel {
  const judul = (materi.judulMateri || "").toLowerCase();
  const kode = (materi.kodeTargetBenar || "").toLowerCase();

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
    judul.includes("pwm") ||
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
          kataKunciCocokGudang: ["led merah", "led hijau", "led_merah", "led_hijau"],
          idGambarMiniatur: "led_merah",
          boxX: 335,
          boxY: 22,
          boxW: 225,
          boxH: 92,
          daftarPinKomponenIni: [
            {
              idPin: "LED_ANODA",
              labelPin: "1. Anoda LED (+)",
              x: 345,
              y: 48,
              warnaPin: "#ef4444",
              posisiKomponen: "periferal",
            },
            {
              idPin: "LED_KATODA",
              labelPin: "2. Katoda LED (-)",
              x: 345,
              y: 90,
              warnaPin: "#38bdf8",
              posisiKomponen: "periferal",
            },
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
            {
              idPin: "RES_KAKI_1",
              labelPin: "1. Kaki 1 Resistor (In)",
              x: 345,
              y: 158,
              warnaPin: "#f59e0b",
              posisiKomponen: "periferal",
            },
            {
              idPin: "RES_KAKI_2",
              labelPin: "2. Kaki 2 Resistor (GND)",
              x: 345,
              y: 200,
              warnaPin: "#64748b",
              posisiKomponen: "periferal",
            },
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

  // 3. LAMPU LALU LINTAS MULTI-LED (LED MERAH 2 KAKI + LED HIJAU 2 KAKI)
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
          kataKunciCocokGudang: ["led merah", "led_merah"],
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
          kataKunciCocokGudang: ["led hijau", "led_hijau"],
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

  // 5. SENSOR & AKTUATOR SPESIFIK LEVEL (VALIDASI ID KETAT SESUAI TUTORIAL!)
  const pinSensorGpio = kode.includes("34")
    ? { id: "ESP_GPIO34", label: "GPIO 34" }
    : kode.includes("32")
    ? { id: "ESP_GPIO32", label: "GPIO 32" }
    : kode.includes("35")
    ? { id: "ESP_GPIO35", label: "GPIO 35" }
    : kode.includes("15")
    ? { id: "ESP_GPIO15", label: "GPIO 15" }
    : kode.includes("16")
    ? { id: "ESP_GPIO16", label: "RX2 (16)" }
    : { id: "ESP_GPIO4", label: "GPIO 4" };

  const pinAktuatorGpio = kode.includes("26")
    ? { id: "ESP_GPIO26", label: "GPIO 26" }
    : kode.includes("27")
    ? { id: "ESP_GPIO27", label: "GPIO 27" }
    : kode.includes("33")
    ? { id: "ESP_GPIO33", label: "GPIO 33" }
    : kode.includes("19")
    ? { id: "ESP_GPIO19", label: "GPIO 19" }
    : kode.includes("13")
    ? { id: "ESP_GPIO13", label: "GPIO 13" }
    : kode.includes("17")
    ? { id: "ESP_GPIO17", label: "TX2 (17)" }
    : { id: "ESP_GPIO2", label: "GPIO 2" };

  const namaKomp2 =
    materi.komponenDimasukkan[1]?.namaKomponen.replace(/^Slot \d+:\s*/i, "") ||
    "Sensor Modul (Slot #2)";
  const namaKomp3 =
    materi.komponenDimasukkan[2]?.namaKomponen.replace(/^Slot \d+:\s*/i, "") ||
    "Aktuator Modul (Slot #3)";

  // Tentukan ID Gudang yang valid secara spesifik berdasarkan topik modul
  const idValidSlot2 = judul.includes("potensiometer")
    ? ["potensiometer", "pas_potensio"]
    : judul.includes("ldr") || judul.includes("cahaya")
    ? ["sensor_ldr", "sen_ldr", "sensor_pir", "sen_pir"]
    : judul.includes("ultrasonik")
    ? ["ultrasonik_hcsr04", "sen_ultrasonik"]
    : judul.includes("rfid")
    ? ["rfid_rc522", "sen_rfid"]
    : judul.includes("dht") || judul.includes("greenhouse")
    ? ["sensor_suhu_dht", "sen_dht22", "kelembapan_tanah", "sen_soil"]
    : judul.includes("mq") || judul.includes("gas") || judul.includes("kebakaran")
    ? ["sensor_mq2", "sen_mq2", "sensor_flame", "sen_flame", "sensor_mq135", "sen_mq135"]
    : judul.includes("npk")
    ? ["sensor_npk", "sen_npk"]
    : judul.includes("baterai")
    ? ["socket_baterai", "pwr_batt18650"]
    : ["nodemcu_esp8266", "mcu_esp32_node2", "sensor_npk", "gps_neo6m"];

  const idValidSlot3 = judul.includes("potensiometer")
    ? ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau"]
    : judul.includes("ldr")
    ? ["relay_1ch", "rel_1ch", "relay_2ch"]
    : judul.includes("ultrasonik") || judul.includes("servo")
    ? ["servo_sg90", "akt_servo180", "solenoid_lock", "akt_solenoid"]
    : judul.includes("rfid") || judul.includes("solenoid")
    ? ["solenoid_lock", "akt_solenoid", "servo_sg90", "akt_servo180"]
    : judul.includes("dht") || judul.includes("greenhouse")
    ? ["kipas_dc", "akt_kipas", "pompa_air", "akt_pompa", "relay_2ch", "rel_2ch"]
    : judul.includes("mq") || judul.includes("gas") || judul.includes("kebakaran")
    ? ["buzzer_piezo", "akt_buzzer", "pompa_air", "akt_pompa", "relay_1ch"]
    : judul.includes("npk") || judul.includes("gps")
    ? ["gps_neo6m", "sen_gps"]
    : judul.includes("baterai") || judul.includes("tegangan")
    ? ["sensor_tegangan", "pwr_ina219", "sensor_pzem"]
    : ["layar_oled", "dsp_oled", "lcd_16x2", "relay_4ch", "nodemcu_esp8266", "mcu_gateway10"];

  return {
    analogiMudahPaham:
      "Pada perangkat sensor dan aktuator dunia nyata, setiap komponen wajib memiliki sambungan Kaki Sinyal/Data ke GPIO DAN Kaki Daya/Ground (3V3/GND) agar arusnya mengalir membentuk rangkaian tertutup!",
    ringkasanCaraKerja:
      "Tarik komponen yang diminta modul ke Slot #1, Slot #2, dan Slot #3, lalu hubungkan ke-2 kaki pada setiap komponen (total 4 kabel)!",
    slotPeriferalList: [
      {
        nomorSlot: 2,
        namaTarget: `${namaKomp2} (2 Kaki)`,
        fungsiSingkat: `Kaki 1 (Sinyal) ke ${pinSensorGpio.label} & Kaki 2 (Daya) ke 3V3.`,
        daftarIdGudangValid: idValidSlot2,
        kataKunciCocokGudang: idValidSlot2,
        idGambarMiniatur: idValidSlot2[0] || "sensor_ldr",
        boxX: 335,
        boxY: 22,
        boxW: 225,
        boxH: 92,
        daftarPinKomponenIni: [
          {
            idPin: "MOD2_PIN_SIG",
            labelPin: `1. Pin Data/SIG`,
            x: 345,
            y: 48,
            warnaPin: "#22c55e",
            posisiKomponen: "periferal",
          },
          {
            idPin: "MOD2_PIN_VCC",
            labelPin: `2. Pin VCC (3.3V)`,
            x: 345,
            y: 90,
            warnaPin: "#ef4444",
            posisiKomponen: "periferal",
          },
        ],
      },
      {
        nomorSlot: 3,
        namaTarget: `${namaKomp3} (2 Kaki)`,
        fungsiSingkat: `Kaki 1 (Kontrol) ke ${pinAktuatorGpio.label} & Kaki 2 ke GND.`,
        daftarIdGudangValid: idValidSlot3,
        kataKunciCocokGudang: idValidSlot3,
        idGambarMiniatur: idValidSlot3[0] || "relay_1ch",
        boxX: 335,
        boxY: 132,
        boxW: 225,
        boxH: 92,
        daftarPinKomponenIni: [
          {
            idPin: "MOD3_PIN_IN",
            labelPin: `1. Pin Kontrol IN`,
            x: 345,
            y: 158,
            warnaPin: "#facc15",
            posisiKomponen: "periferal",
          },
          {
            idPin: "MOD3_PIN_GND",
            labelPin: `2. Pin Ground (GND)`,
            x: 345,
            y: 200,
            warnaPin: "#64748b",
            posisiKomponen: "periferal",
          },
        ],
      },
    ],
    sambunganWajibList: [
      {
        idSambungan: "M_W1",
        pinAsalId: pinSensorGpio.id,
        labelPinAsal: pinSensorGpio.label,
        pinTujuanId: "MOD2_PIN_SIG",
        labelPinTujuan: "1. Pin Data/SIG (Slot #2)",
        warnaKabel: "#22c55e",
        keteranganJalur: `Kabel 1: Klik [${pinSensorGpio.label}] di ESP32 ➔ Klik [1. Pin Data/SIG] di Slot #2`,
      },
      {
        idSambungan: "M_W2",
        pinAsalId: "ESP_3V3",
        labelPinAsal: "3V3",
        pinTujuanId: "MOD2_PIN_VCC",
        labelPinTujuan: "2. Pin VCC (3.3V) (Slot #2)",
        warnaKabel: "#ef4444",
        keteranganJalur: "Kabel 2: Klik [3V3] di ESP32 ➔ Klik [2. Pin VCC (3.3V)] di Slot #2",
      },
      {
        idSambungan: "M_W3",
        pinAsalId: pinAktuatorGpio.id,
        labelPinAsal: pinAktuatorGpio.label,
        pinTujuanId: "MOD3_PIN_IN",
        labelPinTujuan: "1. Pin Kontrol IN (Slot #3)",
        warnaKabel: "#facc15",
        keteranganJalur: `Kabel 3: Klik [${pinAktuatorGpio.label}] di ESP32 ➔ Klik [1. Pin Kontrol IN] di Slot #3`,
      },
      {
        idSambungan: "M_W4",
        pinAsalId: "ESP_GND",
        labelPinAsal: "GND",
        pinTujuanId: "MOD3_PIN_GND",
        labelPinTujuan: "2. Pin Ground (GND) (Slot #3)",
        warnaKabel: "#64748b",
        keteranganJalur: "Kabel 4: Klik [GND] di ESP32 ➔ Klik [2. Pin Ground (GND)] di Slot #3",
      },
    ],
  };
}