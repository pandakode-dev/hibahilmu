// app/components/simulator/wokwiCurriculumData.ts

export interface Esp32MeshNodeData {
  nodeId: number;
  namaBlok: string;
  peran: "Sensor Node" | "Relay Router Node" | "Internet Gateway (Node 10)";
  aktif: boolean;
  suhuUdara: number;
  npkNitrogen: number;
  npkFosfor: number;
  npkKalium: number;
  teganganVolt: number;
  bateraiPersen: number;
  gpsLat: number;
  gpsLng: number;
  rssiDbm: number;
  nextHopNodeId: number;
}

export interface LessonStepIoT {
  level: number;
  badgeLevel: string;
  judulMateri: string;
  tujuanBelajar: string;
  komponenDimasukkan: {
    namaKomponen: string;
    pasangKePin: string;
    fungsiSingkat: string;
  }[];
  penjelasanTeoriSingkat: string;
  instruksiKetik: string[];
  kodeTemplateAwal: string;
  kodeTargetBenar: string;
  kataKunciWajibAda: string[];
  penjelasanBarisKode: {
    potonganKode: string;
    artiPenjelasan: string;
  }[];
  simulasiOutputJikaBenar: string;
  tantanganModifikasi: string;
  xpReward: number;
}

export const INITIAL_10_NODES_DATA: Esp32MeshNodeData[] = [
  {
    nodeId: 1,
    namaBlok: "Blok A1 (Hulu Barat)",
    peran: "Sensor Node",
    aktif: true,
    suhuUdara: 28.4,
    npkNitrogen: 145,
    npkFosfor: 62,
    npkKalium: 190,
    teganganVolt: 4.12,
    bateraiPersen: 94,
    gpsLat: 1.66812,
    gpsLng: 101.4451,
    rssiDbm: -52,
    nextHopNodeId: 2,
  },
  {
    nodeId: 2,
    namaBlok: "Blok A2 (Sektor Utara)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 29.1,
    npkNitrogen: 132,
    npkFosfor: 58,
    npkKalium: 175,
    teganganVolt: 4.05,
    bateraiPersen: 88,
    gpsLat: 1.66845,
    gpsLng: 101.4456,
    rssiDbm: -55,
    nextHopNodeId: 3,
  },
  {
    nodeId: 3,
    namaBlok: "Blok A3 (Lahan Tengah 1)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 30.2,
    npkNitrogen: 95,
    npkFosfor: 41,
    npkKalium: 130,
    teganganVolt: 3.92,
    bateraiPersen: 76,
    gpsLat: 1.6688,
    gpsLng: 101.44615,
    rssiDbm: -58,
    nextHopNodeId: 4,
  },
  {
    nodeId: 4,
    namaBlok: "Blok B1 (Lahan Tengah 2)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 31.0,
    npkNitrogen: 82,
    npkFosfor: 38,
    npkKalium: 118,
    teganganVolt: 3.85,
    bateraiPersen: 68,
    gpsLat: 1.66915,
    gpsLng: 101.4467,
    rssiDbm: -60,
    nextHopNodeId: 5,
  },
  {
    nodeId: 5,
    namaBlok: "Blok B2 (Lembah Irigasi)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 27.9,
    npkNitrogen: 168,
    npkFosfor: 74,
    npkKalium: 215,
    teganganVolt: 3.98,
    bateraiPersen: 81,
    gpsLat: 1.6695,
    gpsLng: 101.4472,
    rssiDbm: -54,
    nextHopNodeId: 6,
  },
  {
    nodeId: 6,
    namaBlok: "Blok B3 (Bukit Timur 1)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 32.6,
    npkNitrogen: 74,
    npkFosfor: 33,
    npkKalium: 105,
    teganganVolt: 3.76,
    bateraiPersen: 58,
    gpsLat: 1.66985,
    gpsLng: 101.44775,
    rssiDbm: -63,
    nextHopNodeId: 7,
  },
  {
    nodeId: 7,
    namaBlok: "Blok C1 (Bukit Timur 2)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 30.8,
    npkNitrogen: 120,
    npkFosfor: 52,
    npkKalium: 164,
    teganganVolt: 3.89,
    bateraiPersen: 72,
    gpsLat: 1.6702,
    gpsLng: 101.4483,
    rssiDbm: -59,
    nextHopNodeId: 8,
  },
  {
    nodeId: 8,
    namaBlok: "Blok C2 (Zona Rumah Kaca)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 28.7,
    npkNitrogen: 185,
    npkFosfor: 80,
    npkKalium: 230,
    teganganVolt: 4.15,
    bateraiPersen: 96,
    gpsLat: 1.67055,
    gpsLng: 101.44885,
    rssiDbm: -49,
    nextHopNodeId: 9,
  },
  {
    nodeId: 9,
    namaBlok: "Blok C3 (Pos Pantau Hilir)",
    peran: "Relay Router Node",
    aktif: true,
    suhuUdara: 29.5,
    npkNitrogen: 140,
    npkFosfor: 60,
    npkKalium: 188,
    teganganVolt: 4.01,
    bateraiPersen: 84,
    gpsLat: 1.6709,
    gpsLng: 101.4494,
    rssiDbm: -46,
    nextHopNodeId: 10,
  },
  {
    nodeId: 10,
    namaBlok: "GATEWAY UTAMA (Stasiun Internet)",
    peran: "Internet Gateway (Node 10)",
    aktif: true,
    suhuUdara: 27.5,
    npkNitrogen: 155,
    npkFosfor: 68,
    npkKalium: 202,
    teganganVolt: 4.19,
    bateraiPersen: 99,
    gpsLat: 1.67125,
    gpsLng: 101.45,
    rssiDbm: -38,
    nextHopNodeId: 0,
  },
];

// ============================================================================
// KURIKULUM 8 LEVEL BELAJAR IOT DARI DASAR (IKUTI & KETIK PROGRAM)
// ============================================================================
export const KURIKULUM_8_LEVEL_IOT: LessonStepIoT[] = [
  {
    level: 1,
    badgeLevel: "LEVEL 1 • PALING DASAR",
    judulMateri: "Menyalakan & Mengedipkan Lampu LED Pertama (Hello World IoT)",
    tujuanBelajar:
      "Memahami fungsi setup(), loop(), pinMode(), dan digitalWrite() untuk menyalakan lampu LED di pin GPIO 2 ESP32.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Board ESP32 DevKit V1",
        pasangKePin: "Meja Utama Breadboard",
        fungsiSingkat: "Otak mikrokontroler yang menjalankan program C++.",
      },
      {
        namaKomponen: "1x Lampu LED Merah + Resistor 220Ω",
        pasangKePin: "Kaki Positif (Anoda) ke Pin GPIO 2, Kaki Negatif (Katoda) ke GND",
        fungsiSingkat: "Komponen output cahaya yang akan berkedip setiap 1 detik.",
      },
    ],
    penjelasanTeoriSingkat:
      "Setiap program Arduino/ESP32 wajib memiliki 2 bagian utama: void setup() yang dijalankan 1 kali saat alat baru menyala, dan void loop() yang dijalankan berulang-ulang selamanya. Perintah HIGH artinya mengalirkan listrik 3.3V (LED Menyala), sedangkan LOW artinya mematikan listrik 0V (LED Padam).",
    instruksiKetik: [
      "Di dalam kurung void setup(), ketik perintah: pinMode(2, OUTPUT); untuk memberi tahu ESP32 bahwa pin nomor 2 dipakai sebagai keluaran listrik.",
      "Di dalam kurung void loop(), ketik perintah: digitalWrite(2, HIGH); untuk menyalakan LED.",
      "Tambahkan perintah: delay(1000); untuk menahan nyala selama 1000 milidetik (1 detik), lalu matikan dengan digitalWrite(2, LOW);",
    ],
    kodeTemplateAwal: `// LEVEL 1: Lengkapi bagian yang kosong di bawah ini!
void setup() {
  Serial.begin(115200);
  // 1. Ketik pinMode(2, OUTPUT); di baris bawah ini:
  
}

void loop() {
  // 2. Ketik digitalWrite(2, HIGH); lalu delay(1000); dan digitalWrite(2, LOW);
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  Serial.println("LED Menyala!");
  delay(1000);
  digitalWrite(2, LOW);
  Serial.println("LED Padam!");
  delay(1000);
}`,
    kataKunciWajibAda: ["pinMode", "OUTPUT", "digitalWrite", "HIGH", "LOW", "delay"],
    penjelasanBarisKode: [
      {
        potonganKode: "pinMode(2, OUTPUT);",
        artiPenjelasan: "Mengatur kaki GPIO 2 sebagai pintu keluar arus listrik.",
      },
      {
        potonganKode: "digitalWrite(2, HIGH);",
        artiPenjelasan: "Mengeluarkan tegangan 3.3 Volt di pin 2 sehingga LED menyala.",
      },
      {
        potonganKode: "delay(1000);",
        artiPenjelasan: "Menunggu selama 1.000 milidetik (1 detik) sebelum lanjut ke baris bawahnya.",
      },
    ],
    simulasiOutputJikaBenar: `[00:01.0] LED Menyala! (Pin GPIO 2 = 3.3V HIGH)\n[00:02.0] LED Padam! (Pin GPIO 2 = 0V LOW)\n[00:03.0] LED Menyala! (Pin GPIO 2 = 3.3V HIGH)\n✅ SELAMAT! Rangkaian LED pertamamu berhasil berkedip sempurna!`,
    tantanganModifikasi:
      "Coba ganti angka delay(1000) menjadi delay(200) agar lampu LED berkedip 5 kali lebih cepat seperti lampu sirine!",
    xpReward: 50,
  },
  {
    level: 2,
    badgeLevel: "LEVEL 2 • SENSOR ANALOG (PROYEK 1)",
    judulMateri: "Membaca Sensor Cahaya LDR & Menyalakan Lampu Jalan Otomatis",
    tujuanBelajar:
      "Menggunakan analogRead() untuk membaca sensor cahaya matahari (LDR) di pin GPIO 34 dan menyalakan Relay otomatis saat malam.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Modul Sensor Cahaya LDR",
        pasangKePin: "Pin AO ke GPIO 34, VCC ke 3V3, GND ke GND",
        fungsiSingkat: "Mengukur terang/gelapnya cahaya ruangan (0 - 4095).",
      },
      {
        namaKomponen: "1x Modul Relay 1-Channel 5V",
        pasangKePin: "Pin IN ke GPIO 26, VCC ke 5V, GND ke GND",
        fungsiSingkat: "Sakelar otomatis penyala lampu jalan.",
      },
    ],
    penjelasanTeoriSingkat:
      "Berbeda dengan tombol biasa yang hanya tahu ON/OFF, sensor cahaya LDR menghasilkan nilai angka bertingkat dari 0 sampai 4095 (disebut sinyal Analog/ADC). Kita memakai perintah analogRead(34) untuk membaca angkanya, lalu memakai logika if (lux < 300) untuk menyalakan Relay saat hari mulai gelap.",
    instruksiKetik: [
      "Di dalam void loop(), baca nilai sensor dengan mengetik: int adc = analogRead(34);",
      "Ubah skala ADC menjadi Lux (0-1000) dengan mengetik: int lux = map(adc, 0, 4095, 0, 1000);",
      "Buat logika otomatis: jika lux < 300 maka digitalWrite(26, HIGH); selain itu LOW.",
    ],
    kodeTemplateAwal: `// LEVEL 2: Program Lampu Jalan Otomatis LDR + Relay
void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(26, OUTPUT);
}

void loop() {
  // Ketik pembacaan analogRead(34), fungsi map(), dan logika digitalWrite(26, ...) di bawah:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(26, OUTPUT);
}

void loop() {
  int adc = analogRead(34);
  int lux = map(adc, 0, 4095, 0, 1000);
  if (lux < 300) {
    digitalWrite(26, HIGH);
  } else {
    digitalWrite(26, LOW);
  }
  Serial.println(lux);
  delay(1000);
}`,
    kataKunciWajibAda: ["analogRead", "34", "map", "digitalWrite", "26"],
    penjelasanBarisKode: [
      {
        potonganKode: "int adc = analogRead(34);",
        artiPenjelasan: "Membaca tegangan cahaya dari pin analog GPIO 34 (nilainya 0 s.d. 4095).",
      },
      {
        potonganKode: "int lux = map(adc, 0, 4095, 0, 1000);",
        artiPenjelasan: "Mengubah rentang angka 0-4095 menjadi skala satuan cahaya 0-1000 Lux.",
      },
      {
        potonganKode: "if (lux < 300) { digitalWrite(26, HIGH); }",
        artiPenjelasan: "Jika cahaya kurang dari 300 Lux (malam/mendung), nyalakan Relay di pin 26!",
      },
    ],
    simulasiOutputJikaBenar: `[SIANG] ADC: 3100 -> Cahaya: 756 Lux -> Relay Pin 26: LOW (Lampu Jalan Mati)\n[SORE]  ADC: 950  -> Cahaya: 231 Lux (< 300) -> Relay Pin 26: HIGH (Lampu Jalan MENYALA 💡)\n✅ MANTAP! Proyek 1 (Lampu Jalan Otomatis LDR) berhasil kamu program!`,
    tantanganModifikasi:
      "Ganti angka 300 pada if (lux < 300) menjadi 500 jika ingin lampu jalan menyala lebih cepat saat sore mendung.",
    xpReward: 60,
  },
  {
    level: 3,
    badgeLevel: "LEVEL 3 • AKTUATOR MEKANIK (PROYEK 2)",
    judulMateri: "Menggerakkan Palang Pintu Servo & Kunci Solenoid RFID",
    tujuanBelajar:
      "Menggunakan library <ESP32Servo.h> untuk memutar palang pintu ke sudut 90 derajat dan membuka kunci Solenoid 12V.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Motor Servo SG90",
        pasangKePin: "Kabel PWM (Oranye) ke GPIO 13, Merah ke 5V, Coklat ke GND",
        fungsiSingkat: "Lengan mekanik yang bisa berputar presisi dari 0° sampai 180°.",
      },
      {
        namaKomponen: "1x Solenoid Door Lock 12V + Relay",
        pasangKePin: "Pin IN Relay ke GPIO 27",
        fungsiSingkat: "Kunci slot besi elektrik pengaman pintu laboratorium.",
      },
    ],
    penjelasanTeoriSingkat:
      "Untuk menggerakkan motor Servo di ESP32, kita wajib memanggil pustaka #include <ESP32Servo.h>, membuat objek Servo pintu;, menghubungkannya ke pin dengan pintu.attach(13);, lalu memerintahkan sudut putarnya dengan pintu.write(90);.",
    instruksiKetik: [
      "Pastikan baris paling atas memuat #include <ESP32Servo.h> dan deklarasi objek Servo pintu;",
      "Di dalam void setup(), hubungkan servo ke pin 13 dengan mengetik: pintu.attach(13);",
      "Di dalam void loop(), buka kunci solenoid dengan digitalWrite(27, HIGH); lalu putar servo ke 90 derajat dengan pintu.write(90);",
    ],
    kodeTemplateAwal: `#include <ESP32Servo.h>
Servo pintu;

void setup() {
  Serial.begin(115200);
  pinMode(27, OUTPUT);
  // 1. Hubungkan servo ke pin 13 dengan pintu.attach(13);
  
}

void loop() {
  // 2. Aktifkan solenoid pin 27 (HIGH) dan putar servo pintu.write(90);
  
}`,
    kodeTargetBenar: `#include <ESP32Servo.h>
Servo pintu;

void setup() {
  Serial.begin(115200);
  pinMode(27, OUTPUT);
  pintu.attach(13);
}

void loop() {
  digitalWrite(27, HIGH);
  pintu.write(90);
  Serial.println("Akses RFID Valid: Pintu Terbuka 90 Derajat!");
  delay(2000);
}`,
    kataKunciWajibAda: ["ESP32Servo.h", "attach", "13", "write", "90", "digitalWrite"],
    penjelasanBarisKode: [
      {
        potonganKode: "#include <ESP32Servo.h>",
        artiPenjelasan: "Memanggil library pengatur sinyal PWM khusus motor servo ESP32.",
      },
      {
        potonganKode: "pintu.attach(13);",
        artiPenjelasan: "Mendaftarkan pin GPIO 13 sebagai jalur kontrol motor servo.",
      },
      {
        potonganKode: "pintu.write(90);",
        artiPenjelasan: "Memutar lengan motor servo tepat ke sudut 90 derajat (palang terbuka).",
      },
    ],
    simulasiOutputJikaBenar: `[RFID] Kartu E-KTP Terdeteksi -> Solenoid Pin 27: UNLOCKED 🔓\n[SERVO] Motor Servo GPIO 13 berputar ke sudut 90° (Palang Terbuka)\n✅ LUAR BIASA! Proyek 2 (Smart Door Lock) berhasil diselesaikan!`,
    tantanganModifikasi:
      "Tambahkan pintu.write(0); setelah delay(2000); agar palang pintu menutup kembali secara otomatis setelah 2 detik!",
    xpReward: 70,
  },
  {
    level: 4,
    badgeLevel: "LEVEL 4 • SMART GREENHOUSE (PROYEK 3)",
    judulMateri: "Otomasi Suhu DHT22 & Kelembaban Tanah untuk Kipas & Pompa Irigasi",
    tujuanBelajar:
      "Membaca suhu udara dari sensor DHT22 (GPIO 15) dan kelembaban tanah (GPIO 35) untuk menyalakan Kipas & Pompa Air.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Sensor Suhu & Lembab DHT22",
        pasangKePin: "Pin DATA ke GPIO 15, VCC ke 3V3, GND ke GND",
        fungsiSingkat: "Membaca suhu udara (°C) dan kelembaban relatif (%).",
      },
      {
        namaKomponen: "1x Probe Soil Moisture + Relay 2-Ch",
        pasangKePin: "Soil AO ke GPIO 35 | Relay Pompa ke GPIO 25 | Relay Kipas ke GPIO 33",
        fungsiSingkat: "Menyiram tanaman saat tanah kering & menyalakan kipas saat panas.",
      },
    ],
    penjelasanTeoriSingkat:
      "Dalam Smart Greenhouse, ada 2 aturan otomatis: (1) Jika suhu > 32.0 derajat Celcius, maka Kipas Pendingin (GPIO 33) harus menyala. (2) Jika kelembaban tanah < 40%, maka Pompa Air (GPIO 25) harus menyala.",
    instruksiKetik: [
      "Di dalam void setup(), atur pin Pompa (25) dan pin Kipas (33) sebagai OUTPUT.",
      "Di dalam void loop(), periksa jika suhu > 32 maka digitalWrite(33, HIGH);",
      "Periksa juga jika tanah < 40 maka digitalWrite(25, HIGH);",
    ],
    kodeTemplateAwal: `// LEVEL 4: Otomasi Kipas & Pompa Air Smart Greenhouse
void setup() {
  Serial.begin(115200);
  // 1. Set pinMode 25 (Pompa) dan 33 (Kipas) sebagai OUTPUT:
  
}

void loop() {
  float suhu = 34.5; // Simulasi pembacaan DHT22
  int tanah = 30;    // Simulasi tanah kering 30%
  // 2. Ketik if (suhu > 32) nyalakan pin 33, dan if (tanah < 40) nyalakan pin 25:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(25, OUTPUT);
  pinMode(33, OUTPUT);
}

void loop() {
  float suhu = 34.5;
  int tanah = 30;
  if (suhu > 32) {
    digitalWrite(33, HIGH);
  }
  if (tanah < 40) {
    digitalWrite(25, HIGH);
  }
  Serial.println("Greenhouse Aktif: Kipas & Pompa Menyala!");
  delay(1500);
}`,
    kataKunciWajibAda: ["pinMode", "25", "33", "suhu", "tanah", "digitalWrite"],
    penjelasanBarisKode: [
      {
        potonganKode: "if (suhu > 32) { digitalWrite(33, HIGH); }",
        artiPenjelasan: "Menyalakan kipas exhaust di pin 33 ketika suhu rumah kaca melampaui 32°C.",
      },
      {
        potonganKode: "if (tanah < 40) { digitalWrite(25, HIGH); }",
        artiPenjelasan: "Menyalakan pompa irigasi di pin 25 ketika kadar air tanah turun di bawah 40%.",
      },
    ],
    simulasiOutputJikaBenar: `[SENSOR] Suhu Udara: 34.5°C (> 32°C) -> Kipas Exhaust Pin 33: ON 🌀\n[SENSOR] Lembab Tanah: 30% (< 40%) -> Pompa Air Pin 25: ON 💦\n✅ KEREN! Proyek 3 (Smart Greenhouse) berhasil kamu kuasai!`,
    tantanganModifikasi:
      "Tambahkan blok else pada masing-masing if untuk mematikan kipas dan pompa (LOW) ketika suhu sudah sejuk dan tanah sudah basah.",
    xpReward: 75,
  },
  {
    level: 5,
    badgeLevel: "LEVEL 5 • PROTEKSI BAHAYA (PROYEK 4)",
    judulMateri: "Detektor Kebocoran Gas LPG (MQ-2) & Alarm Pemadam Api",
    tujuanBelajar:
      "Membaca kadar gas berbahaya (PPM) dari sensor MQ-2 di GPIO 32 dan membunyikan Buzzer serta Pompa Pemadam.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Sensor Gas & Asap MQ-2",
        pasangKePin: "Pin AO ke GPIO 32, VCC ke 5V, GND ke GND",
        fungsiSingkat: "Mendeteksi konsentrasi gas LPG, metana, dan asap kebakaran.",
      },
      {
        namaKomponen: "1x Buzzer Alarm + Relay Sprinkler",
        pasangKePin: "Buzzer ke GPIO 19 | Relay Pompa Pemadam ke GPIO 25",
        fungsiSingkat: "Membunyikan sirine bahaya & menyemprotkan air pemadam.",
      },
    ],
    penjelasanTeoriSingkat:
      "Sensor MQ-2 mendeteksi kepekatan gas dalam satuan PPM (Parts Per Million). Udara normal berada di bawah 300 PPM. Jika kadar gas >= 500 PPM, maka terjadi kebocoran gas yang wajib segera memicu alarm Buzzer (GPIO 19) dan Pompa Pemadam (GPIO 25).",
    instruksiKetik: [
      "Baca nilai sensor gas di pin 32 dengan analogRead(32);",
      "Jika nilai ppm >= 500, aktifkan alarm dan pompa dengan digitalWrite(19, HIGH); dan digitalWrite(25, HIGH);",
    ],
    kodeTemplateAwal: `// LEVEL 5: Sistem Proteksi Gas Bocor MQ-2 & Pemadam Api
void setup() {
  Serial.begin(115200);
  pinMode(32, INPUT);
  pinMode(19, OUTPUT);
  pinMode(25, OUTPUT);
}

void loop() {
  int adcGas = analogRead(32);
  int ppm = map(adcGas, 0, 4095, 100, 1000);
  // Ketik logika if (ppm >= 500) untuk menyalakan pin 19 dan pin 25:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(32, INPUT);
  pinMode(19, OUTPUT);
  pinMode(25, OUTPUT);
}

void loop() {
  int adcGas = analogRead(32);
  int ppm = map(adcGas, 0, 4095, 100, 1000);
  if (ppm >= 500) {
    digitalWrite(19, HIGH);
    digitalWrite(25, HIGH);
  }
  Serial.println(ppm);
  delay(1000);
}`,
    kataKunciWajibAda: ["analogRead", "32", "ppm", "500", "digitalWrite", "19", "25"],
    penjelasanBarisKode: [
      {
        potonganKode: "int ppm = map(adcGas, 0, 4095, 100, 1000);",
        artiPenjelasan: "Mengonversi nilai tegangan sensor MQ-2 menjadi satuan konsentrasi gas (100 - 1000 PPM).",
      },
      {
        potonganKode: "if (ppm >= 500) { digitalWrite(19, HIGH); ... }",
        artiPenjelasan: "Saat kadar gas menyentuh 500 PPM, sirine pin 19 dan pompa pin 25 langsung aktif.",
      },
    ],
    simulasiOutputJikaBenar: `[MQ-2] Konsentrasi Gas: 680 PPM (>= 500 PPM BAHAYA!)\n[ALARM] Sirine Buzzer Pin 19: BEEP! 🚨 | Sprinkler Pemadam Pin 25: MENYEMPROT AIR 💦\n✅ HEBAT! Proyek 4 (Sistem Pemadam & Gas) tuntas!`,
    tantanganModifikasi:
      "Ubah batas 500 menjadi 350 agar kipas pembuangan gas menyala lebih dini sebelum gas menumpuk di ruangan.",
    xpReward: 80,
  },
  {
    level: 6,
    badgeLevel: "LEVEL 6 • KOMUNIKASI 2 CHIP (PROYEK 5 & 6)",
    judulMateri: "Komunikasi Serial UART Antar-Mikrokontroler (ESP32 #1 ➔ ESP32 #2)",
    tujuanBelajar:
      "Mengirimkan paket teks JSON dari ESP32 #1 ke ESP32 #2 melalui jalur kabel Serial2 (Pin RX2 GPIO 16 & TX2 GPIO 17).",
    komponenDimasukkan: [
      {
        namaKomponen: "2x Board ESP32 (Node #1 Sensor & Node #2 Gateway)",
        pasangKePin: "Pin TX2 (GPIO 17) ESP32 #1 disambung silang ke Pin RX2 (GPIO 16) ESP32 #2",
        fungsiSingkat: "Jembatan pengiriman data antar dua otak mikrokontroler.",
      },
    ],
    penjelasanTeoriSingkat:
      "Ketika satu mikrokontroler sibuk membaca banyak sensor di lapangan, ia dapat mengirimkan hasilnya ke mikrokontroler kedua lewat port komunikasi Serial2. Ingat hukum wajib komunikasi UART: kabel TX (Transmit/Kirim) dari chip pertama harus dipasang menyilang ke pin RX (Receive/Terima) di chip kedua!",
    instruksiKetik: [
      "Di dalam void setup(), aktifkan port komunikasi kedua dengan mengetik: Serial2.begin(115200, SERIAL_8N1, 16, 17);",
      "Di dalam void loop(), kirimkan paket data dengan mengetik: Serial2.println(\"DATA_SENSOR_OK\");",
    ],
    kodeTemplateAwal: `// LEVEL 6: Pengiriman Paket Data Antar-ESP32 via UART Serial2
void setup() {
  Serial.begin(115200);
  // 1. Aktifkan Serial2 pada pin RX=16 dan TX=17:
  
}

void loop() {
  // 2. Kirimkan pesan lewat Serial2.println(...):
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, 16, 17);
}

void loop() {
  Serial2.println("DATA_SENSOR_OK");
  Serial.println("[TX ESP32 #1 -> ESP32 #2] Paket Terkirim!");
  delay(1500);
}`,
    kataKunciWajibAda: ["Serial2.begin", "16", "17", "Serial2.println"],
    penjelasanBarisKode: [
      {
        potonganKode: "Serial2.begin(115200, SERIAL_8N1, 16, 17);",
        artiPenjelasan: "Membuka jalur komunikasi perangkat keras UART2 dengan kecepatan 115200 baud di pin 16 (RX) dan 17 (TX).",
      },
      {
        potonganKode: "Serial2.println(\"DATA_SENSOR_OK\");",
        artiPenjelasan: "Menembakkan untaian karakter data melalui kabel TX2 menuju chip penerima.",
      },
    ],
    simulasiOutputJikaBenar: `[ESP32 #1 TX2 (Pin 17)] ➔ Mengirim frame: "DATA_SENSOR_OK"\n[ESP32 #2 RX2 (Pin 16)] ➔ Paket Diterima Utuh! Ditampilkan ke Layar OLED.\n✅ MANTAP! Kamu sudah paham komunikasi Multi-MCU (Proyek 5, 6 & 7)!`,
    tantanganModifikasi:
      "Ganti isi teks yang dikirim menjadi format JSON seperti: Serial2.println(\"{\\\"suhu\\\":29.5}\");",
    xpReward: 90,
  },
  {
    level: 7,
    badgeLevel: "LEVEL 7 • SENSOR PERTANIAN PRESISI (PRA-PROYEK 8)",
    judulMateri: "Membaca Sensor Pupuk NPK, Tegangan Baterai Li-Ion & Koordinat GPS",
    tujuanBelajar:
      "Mengemas data Suhu, Nitrogen-Fosfor-Kalium (NPK), Tegangan Baterai (Volt & %), dan Latitude/Longitude GPS ke dalam struct C++.",
    komponenDimasukkan: [
      {
        namaKomponen: "1x Sensor Nutrisi Tanah NPK RS485",
        pasangKePin: "Pin RO/DI ke UART RS485 ESP32",
        fungsiSingkat: "Mengukur kadar pupuk Nitrogen (N), Fosfor (P), dan Kalium (K) dalam mg/kg.",
      },
      {
        namaKomponen: "1x Modul GPS NEO-6M + Sensor Tegangan Baterai",
        pasangKePin: "GPS ke Pin 4 & 5 | Pembagi Tegangan Baterai 18650 ke Pin ADC GPIO 35",
        fungsiSingkat: "Melacak posisi koordinat node di kebun & sisa daya baterai.",
      },
    ],
    penjelasanTeoriSingkat:
      "Sebelum mengirim data melintasi 10 node, setiap node harus mengemas 5 jenis data sensornya (Suhu, NPK, Tegangan Volt, % Baterai, dan GPS Lat/Lng) ke dalam sebuah paket struktur data (struct) agar hemat memori dan bisa dikirim sekali tembak menggunakan protokol nirkabel ESP-NOW.",
    instruksiKetik: [
      "Di dalam fungsi loop(), isi nilai variabel struktur: paket.suhu = 28.5; dan paket.npk_N = 145;",
      "Isi tegangan baterai: paket.volt = 4.12; serta koordinat GPS: paket.lat = 1.6681;",
      "Cetak hasilnya ke Serial Monitor dengan Serial.println(paket.npk_N);",
    ],
    kodeTemplateAwal: `struct PaketSensorNode {
  float suhu;
  int npk_N;
  float volt;
  double lat;
};
PaketSensorNode paket;

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Isi nilai paket.suhu, paket.npk_N, paket.volt, dan paket.lat lalu cetak ke Serial:
  
}`,
    kodeTargetBenar: `struct PaketSensorNode {
  float suhu;
  int npk_N;
  float volt;
  double lat;
};
PaketSensorNode paket;

void setup() {
  Serial.begin(115200);
}

void loop() {
  paket.suhu = 28.5;
  paket.npk_N = 145;
  paket.volt = 4.12;
  paket.lat = 1.6681;
  Serial.println(paket.npk_N);
  delay(1000);
}`,
    kataKunciWajibAda: ["paket.suhu", "paket.npk_N", "paket.volt", "paket.lat", "Serial.println"],
    penjelasanBarisKode: [
      {
        potonganKode: "struct PaketSensorNode { ... };",
        artiPenjelasan: "Membungkus banyak variabel sensor berbeda menjadi satu kotak paket data yang rapi.",
      },
      {
        potonganKode: "paket.volt = 4.12;",
        artiPenjelasan: "Menyimpan tegangan baterai Li-Ion 18650 (4.12V setara ~92% kapasitas penuh).",
      },
    ],
    simulasiOutputJikaBenar: `[NODE SENSOR] Suhu: 28.5°C | Pupuk N: 145 mg/kg | Baterai: 4.12V (92%) | GPS Lat: 1.66810\n✅ SIAP TEMPUR! Sekarang kamu siap menggabungkan 10 Node di Level 8 (Master)!`,
    tantanganModifikasi:
      "Tambahkan variabel int npk_P; dan int npk_K; ke dalam struct PaketSensorNode untuk melengkapi ketiga unsur hara pupuk!",
    xpReward: 100,
  },
  {
    level: 8,
    badgeLevel: "LEVEL 8 • MASTER PROJECT (PROYEK 8 — 10 NODE MULTI-HOP)",
    judulMateri: "Memprogram Rute Estafet Multi-Hop 10-Node ESP32 Menuju Gateway Internet",
    tujuanBelajar:
      "Membuat logika estafet (Next-Hop Forwarding) dari Node 1 ➔ Node 2 ➔ ... ➔ Node 10 dan mengunggah data ke Dashboard Internet.",
    komponenDimasukkan: [
      {
        namaKomponen: "10x Node ESP32 Lengkap (Suhu, NPK, GPS, Baterai & Sensor Tegangan)",
        pasangKePin: "Node 1..9 = Relay Mesh ESP-NOW | Node 10 = Edge Gateway Wi-Fi Internet",
        fungsiSingkat: "Mengirim data secara berantai dari pelosok kebun hingga tampil di Dashboard Web.",
      },
    ],
    penjelasanTeoriSingkat:
      "Inti dari jaringan Multi-Hop 10 Node sangatlah elegan: jika nomor node kita kurang dari 10 (MY_NODE_ID < 10), maka setiap kali kita menerima paket dari node sebelumnya, kita menambah jumlah lompatan (hopCount++) lalu meneruskannya ke node berikutnya (targetNextHop = MY_NODE_ID + 1) menggunakan esp_now_send(). Ketika paket tiba di Node 10 (MY_NODE_ID == 10), Node 10 mengunggah seluruh paket tersebut ke Internet!",
    instruksiKetik: [
      "Di dalam void setup(), aktifkan WiFi dan ESP-NOW dengan mengetik: WiFi.mode(WIFI_STA); dan esp_now_init();",
      "Di dalam void loop(), tentukan node tujuan lompatan berikutnya: int targetNextHop = MY_NODE_ID + 1;",
      "Kirimkan paket estafet dengan mengetik: esp_now_send(NULL, (uint8_t *)&paket, sizeof(paket));",
    ],
    kodeTemplateAwal: `#include <WiFi.h>
#include <esp_now.h>
#define MY_NODE_ID 1

struct PaketMesh10Node {
  int originNode;
  int targetNextHop;
  int hopCount;
  float suhu;
  int npk_N;
  float volt;
  double lat;
  double lng;
};
PaketMesh10Node paket;

void setup() {
  Serial.begin(115200);
  // 1. Ketik WiFi.mode(WIFI_STA); dan esp_now_init(); di bawah ini:
  
}

void loop() {
  paket.originNode = MY_NODE_ID;
  // 2. Ketik int targetNextHop = MY_NODE_ID + 1; lalu kirim dengan esp_now_send(...):
  
}`,
    kodeTargetBenar: `#include <WiFi.h>
#include <esp_now.h>
#define MY_NODE_ID 1

struct PaketMesh10Node {
  int originNode;
  int targetNextHop;
  int hopCount;
  float suhu;
  int npk_N;
  float volt;
  double lat;
  double lng;
};
PaketMesh10Node paket;

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
}

void loop() {
  paket.originNode = MY_NODE_ID;
  int targetNextHop = MY_NODE_ID + 1;
  paket.targetNextHop = targetNextHop;
  esp_now_send(NULL, (uint8_t *)&paket, sizeof(paket));
  Serial.println("Paket Multi-Hop Dikirim ke Node Berikutnya!");
  delay(2000);
}`,
    kataKunciWajibAda: [
      "WiFi.mode",
      "WIFI_STA",
      "esp_now_init",
      "MY_NODE_ID + 1",
      "esp_now_send",
    ],
    penjelasanBarisKode: [
      {
        potonganKode: "WiFi.mode(WIFI_STA); esp_now_init();",
        artiPenjelasan: "Mengaktifkan radio frekuensi 2.4 GHz pada ESP32 dalam mode komunikasi langsung antar-node tanpa router (ESP-NOW).",
      },
      {
        potonganKode: "int targetNextHop = MY_NODE_ID + 1;",
        artiPenjelasan: "Rumus estafet Multi-Hop: Node 1 mengirim ke Node 2, Node 2 ke Node 3, ..., hingga Node 9 mengirim ke Node 10.",
      },
      {
        potonganKode: "esp_now_send(NULL, (uint8_t *)&paket, sizeof(paket));",
        artiPenjelasan: "Memancarkan bungkusan data (Suhu, NPK, Baterai, Tegangan & GPS) ke udara menuju node tetangga berikutnya.",
      },
    ],
    simulasiOutputJikaBenar: `[HOP #1] Node #1 ➔ Node #2 (Suhu:28.4°C | NPK:145-62-190 | Batt:4.12V 94% | GPS:1.6681,101.4451)\n[HOP #2..#9] Paket diteruskan berantai melewati Node 2 ➔ 3 ➔ 4 ➔ 5 ➔ 6 ➔ 7 ➔ 8 ➔ 9...\n[GATEWAY NODE #10] 🌐 Paket Diterima! Mengunggah JSON ke Dashboard Web Cloud: HTTP 200 OK!\n🏆 SELAMAT! Kamu telah menamatkan seluruh 8 Level Akademi IoT HibahIlmu!`,
    tantanganModifikasi:
      "Klik tab '🛰️ 2. Simulator 10-Node Multi-Hop & Dashboard Web' di atas untuk menguji langsung animasi ke-10 node ini!",
    xpReward: 150,
  },
];