// app/components/simulator/wokwiPracticeChallenges.ts
import {
  BlueprintMultiPinLevel,
  AturanSambunganKabelReal,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";

export interface SkenarioLatihanMandiri {
  judulKasus: string;
  narasiKasusLapangan: string;
  daftarPerubahanPin: string[];
  cluesBertahap: string[];
  blueprintLatihan: BlueprintMultiPinLevel;
  kodeTemplateLatihanCpp: string;
  kodeTargetLatihanCpp: string;
}

// Peta rotasi pin GPIO alternatif untuk Mode Latihan Mandiri
// Agar siswa tidak sekadar menghafal pin dari Mode Terpandu!
const PETA_PIN_ALTERNATIF_LATIHAN: Record<
  string,
  { idBaru: string; labelBaru: string; noPinLama: number; noPinBaru: number }
> = {
  ESP_GPIO2: {
    idBaru: "ESP_GPIO15",
    labelBaru: "GPIO 15",
    noPinLama: 2,
    noPinBaru: 15,
  },
  ESP_GPIO15: {
    idBaru: "ESP_GPIO4",
    labelBaru: "GPIO 4",
    noPinLama: 15,
    noPinBaru: 4,
  },
  ESP_GPIO4: {
    idBaru: "ESP_GPIO13",
    labelBaru: "GPIO 13",
    noPinLama: 4,
    noPinBaru: 13,
  },
  ESP_GPIO13: {
    idBaru: "ESP_GPIO25",
    labelBaru: "GPIO 25",
    noPinLama: 13,
    noPinBaru: 25,
  },
  ESP_GPIO26: {
    idBaru: "ESP_GPIO27",
    labelBaru: "GPIO 27",
    noPinLama: 26,
    noPinBaru: 27,
  },
  ESP_GPIO27: {
    idBaru: "ESP_GPIO26",
    labelBaru: "GPIO 26",
    noPinLama: 27,
    noPinBaru: 26,
  },
  ESP_GPIO34: {
    idBaru: "ESP_GPIO35",
    labelBaru: "GPIO 35",
    noPinLama: 34,
    noPinBaru: 35,
  },
  ESP_GPIO35: {
    idBaru: "ESP_GPIO34",
    labelBaru: "GPIO 34",
    noPinLama: 35,
    noPinBaru: 34,
  },
  ESP_GPIO32: {
    idBaru: "ESP_GPIO34",
    labelBaru: "GPIO 34",
    noPinLama: 32,
    noPinBaru: 34,
  },
  ESP_GPIO33: {
    idBaru: "ESP_GPIO26",
    labelBaru: "GPIO 26",
    noPinLama: 33,
    noPinBaru: 26,
  },
  ESP_GPIO19: {
    idBaru: "ESP_GPIO27",
    labelBaru: "GPIO 27",
    noPinLama: 19,
    noPinBaru: 27,
  },
  ESP_GPIO25: {
    idBaru: "ESP_GPIO33",
    labelBaru: "GPIO 33",
    noPinLama: 25,
    noPinBaru: 33,
  },
};

function gantiNomorPinDiKodeCpp(
  kodeAsli: string,
  pasanganTukar: { noPinLama: number; noPinBaru: number }[]
): string {
  let hasil = kodeAsli;
  // Gunakan placeholder sementara agar pertukaran 2 <-> 15 tidak saling menimpa
  pasanganTukar.forEach((p, idx) => {
    const regex = new RegExp(
      `(\\b(?:pinMode|digitalWrite|digitalRead|analogRead|analogWrite|digitalPinToInterrupt|attach)\\s*\\(\\s*)${p.noPinLama}\\b`,
      "g"
    );
    hasil = hasil.replace(regex, `$1__PIN_TEMP_${idx}__`);
  });

  pasanganTukar.forEach((p, idx) => {
    hasil = hasil.replace(
      new RegExp(`__PIN_TEMP_${idx}__`, "g"),
      String(p.noPinBaru)
    );
  });

  // Ubah juga nilai delay(1000) menjadi delay(500) atau delay(300) untuk tantangan latihan
  hasil = hasil.replace(/delay\s*\(\s*1000\s*\)/g, "delay(500)");
  return hasil;
}

export function buatSkenarioLatihanMandiri(
  materi: ExtendedLessonStepIoT,
  blueprintTerpandu: BlueprintMultiPinLevel
): SkenarioLatihanMandiri {
  const daftarPerubahanPin: string[] = [];
  const pasanganTukarPin: { noPinLama: number; noPinBaru: number }[] = [];

  // Rombak sambungan wajib dengan memindahkan pin GPIO ke pin alternatif!
  const sambunganLatihanBaru: AturanSambunganKabelReal[] =
    blueprintTerpandu.sambunganWajibList.map((w) => {
      const altAsal = PETA_PIN_ALTERNATIF_LATIHAN[w.pinAsalId];
      if (altAsal) {
        daftarPerubahanPin.push(
          `Jalur ke [${w.labelPinTujuan}] dipindahkan dari ${w.labelPinAsal} ➔ menjadi wajib ke [${altAsal.labelBaru}]`
        );
        if (
          !pasanganTukarPin.some((x) => x.noPinLama === altAsal.noPinLama)
        ) {
          pasanganTukarPin.push({
            noPinLama: altAsal.noPinLama,
            noPinBaru: altAsal.noPinBaru,
          });
        }
        return {
          ...w,
          pinAsalId: altAsal.idBaru,
          labelPinAsal: altAsal.labelBaru,
          keteranganJalur: w.keteranganJalur.replace(
            `[${w.labelPinAsal}]`,
            `[${altAsal.labelBaru}]`
          ),
        };
      }
      return w;
    });

  // Jika level standalone (tidak ada kabel luar), tetap ubah pin internal dari GPIO 2 ke GPIO 15 atau ubah delay
  if (sambunganLatihanBaru.length === 0) {
    pasanganTukarPin.push({ noPinLama: 2, noPinBaru: 15 });
    daftarPerubahanPin.push(
      "Ubah pin output di dalam program dari Pin 2 menjadi Pin 15, dan percepat jeda waktu menjadi 500 ms!"
    );
  } else {
    daftarPerubahanPin.push(
      "Jika terdapat perintah delay(1000) di kode, ubah menjadi delay(500) agar respons sistem 2x lebih cepat!"
    );
  }

  const kodeTargetLatihanCpp = gantiNomorPinDiKodeCpp(
    materi.kodeTargetBenar,
    pasanganTukarPin
  );

  const kodeTemplateLatihanCpp = `// 🎯 UJIAN LATIHAN MANDIRI — LEVEL ${materi.level} (TANPA PANDUAN BERKEDIP)
// Baca Skenario Masalah di Panel Kiri: Perhatikan perubahan nomor Pin GPIO!

void setup() {
  Serial.begin(115200);
  // 1. Konfigurasikan pin sesuai skenario latihan mandiri:
  
}

void loop() {
  // 2. Tuliskan logika utama sesuai pin baru pada skenario latihan:
  
}`;

  const judulKasus = `Studi Kasus Lapangan Level ${materi.level}: Konfigurasi Ulang Jalur Pin & Kecepatan`;
  const narasiKasusLapangan =
    sambunganLatihanBaru.length === 0
      ? `Di lapangan, jalur standar GPIO 2 sedang dipakai oleh modul lain. Sebagai teknisi IoT, kamu ditugaskan memprogram ulang papan ESP32 pada Level ${materi.level} ini secara mandiri tanpa panduan berkedip dengan memindahkan pin ke GPIO 15 dan mempercepat siklusnya menjadi 500 ms!`
      : `Pada instalasi nyata di lapangan untuk "${materi.judulMateri}", beberapa jalur pin GPIO standar pada papan ESP32 mengalami gangguan interferensi sehingga kamu TIDAK BOLEH memakai pin yang sama dengan Mode Terpandu! Rakit kembali seluruh ${
          1 + blueprintTerpandu.slotPeriferalList.length
        } komponen tanpa bantuan garis berkedip dan pindahkan kabel serta kodingannya mengikuti daftar perubahan pin di bawah ini:`;

  const cluesBertahap: string[] = [
    `Clue #1 (Komponen): Pastikan seluruh ${
      1 + blueprintTerpandu.slotPeriferalList.length
    } kotak slot di kanvas sudah terisi oleh komponen yang tepat dari Gudang.`,
    `Clue #2 (Pin Baru): ${
      daftarPerubahanPin[0] ||
      "Periksa kembali daftar perubahan pin pada kotak Skenario Latihan Mandiri."
    }`,
    `Clue #3 (Kodingan): Pastikan nomor pin di dalam pinMode(...), digitalWrite(...), atau analogRead(...) sudah diganti ke nomor pin baru dan memakai delay(500);`,
  ];

  return {
    judulKasus,
    narasiKasusLapangan,
    daftarPerubahanPin,
    cluesBertahap,
    blueprintLatihan: {
      ...blueprintTerpandu,
      analogiMudahPaham: narasiKasusLapangan,
      sambunganWajibList: sambunganLatihanBaru,
    },
    kodeTemplateLatihanCpp,
    kodeTargetLatihanCpp,
  };
}