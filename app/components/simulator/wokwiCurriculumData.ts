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
// KURIKULUM 15 LEVEL BELAJAR IOT DARI DASAR SAMPAI MAHIR
// ============================================================================
export const KURIKULUM_15_LEVEL_IOT: LessonStepIoT[] = [
  {
    level: 1,
    badgeLevel: "LEVEL 1 • DASAR RANGKAIAN",
    judulMateri: "Menyalakan & Mengedipkan Lampu LED (Digital Output)",
    tujuanBelajar:
      "Memahami struktur setup() dan loop(), serta cara memasang kabel dari pin GPIO 2 ESP32 ke kaki LED.",
    komponenDimasukkan: [
      {
        namaKomponen: "ESP32 DevKit V1",
        pasangKePin: "Breadboard Utama",
        fungsiSingkat: "Mikrokontroler pusat.",
      },
      {
        namaKomponen: "Lampu LED Merah + Resistor",
        pasangKePin: "Tarik kabel dari GPIO 2 ke Anoda LED",
        fungsiSingkat: "Indikator visual kedip.",
      },
    ],
    penjelasanTeoriSingkat:
      "Perintah pinMode(2, OUTPUT) menyiapkan pin 2 sebagai sumber arus, dan digitalWrite(2, HIGH) mengalirkan listrik 3.3V.",
    instruksiKetik: [
      "Tarik kabel dari GPIO 2 ESP32 ke pin Anoda LED pada modul.",
      "Ketik pinMode(2, OUTPUT); di dalam void setup().",
      "Ketik digitalWrite(2, HIGH); dan delay(1000); di dalam void loop().",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  // Ketik pinMode(2, OUTPUT); di sini:
  
}

void loop() {
  // Ketik digitalWrite(2, HIGH); dan delay(1000); di sini:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(1000);
  digitalWrite(2, LOW);
  delay(1000);
}`,
    kataKunciWajibAda: ["pinMode", "2", "OUTPUT", "digitalWrite", "HIGH", "LOW", "delay"],
    penjelasanBarisKode: [
      { potonganKode: "pinMode(2, OUTPUT);", artiPenjelasan: "Mengatur pin 2 sebagai pengeluar arus." },
      { potonganKode: "digitalWrite(2, HIGH);", artiPenjelasan: "Menyalakan lampu LED." },
    ],
    simulasiOutputJikaBenar: `[OK] LED Berkedip Normal di GPIO 2 (3.3V / 0V)\n✅ Level 1 Selesai!`,
    tantanganModifikasi: "Ubah delay menjadi 200 ms.",
    xpReward: 40,
  },
  {
    level: 2,
    badgeLevel: "LEVEL 2 • INPUT TOMBOL",
    judulMateri: "Membaca Tombol Push Button (Digital Input)",
    tujuanBelajar:
      "Membaca status tombol tekan di pin GPIO 4 untuk menyalakan LED secara interaktif.",
    komponenDimasukkan: [
      { namaKomponen: "Push Button Switch", pasangKePin: "Tarik kabel dari GPIO 4 ke Tombol", fungsiSingkat: "Mendeteksi sentuhan fisik." },
      { namaKomponen: "Lampu LED Indikator", pasangKePin: "Hubungkan ke GPIO 2", fungsiSingkat: "Menyala saat tombol ditekan." },
    ],
    penjelasanTeoriSingkat: "digitalRead(4) membaca apakah tombol sedang ditekan (HIGH) atau dilepas (LOW).",
    instruksiKetik: [
      "Tarik kabel dari GPIO 4 ESP32 ke modul Tombol.",
      "Ketik pinMode(4, INPUT_PULLUP); di setup().",
      "Ketik int tombol = digitalRead(4); di loop().",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  pinMode(4, INPUT_PULLUP);
  pinMode(2, OUTPUT);
}

void loop() {
  // Ketik int tombol = digitalRead(4); dan if (tombol == LOW) ...
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(4, INPUT_PULLUP);
  pinMode(2, OUTPUT);
}

void loop() {
  int tombol = digitalRead(4);
  if (tombol == LOW) {
    digitalWrite(2, HIGH);
  } else {
    digitalWrite(2, LOW);
  }
}`,
    kataKunciWajibAda: ["digitalRead", "4", "INPUT_PULLUP", "digitalWrite", "LOW"],
    penjelasanBarisKode: [
      { potonganKode: "digitalRead(4);", artiPenjelasan: "Membaca status logika sakelar di pin 4." },
    ],
    simulasiOutputJikaBenar: `[INFO] Tombol Ditekan -> LED Menyala Terang!\n✅ Level 2 Selesai!`,
    tantanganModifikasi: "Balik logika tombol agar LED menyala saat dilepas.",
    xpReward: 50,
  },
  {
    level: 3,
    badgeLevel: "LEVEL 3 • SENSOR CAHAYA",
    judulMateri: "Sensor Cahaya LDR & Lampu Jalan Otomatis (Proyek 1)",
    tujuanBelajar: "Membaca nilai analog LDR di pin 34 dan mengontrol Relay 26.",
    komponenDimasukkan: [
      { namaKomponen: "Sensor LDR", pasangKePin: "Tarik kabel AO LDR ke GPIO 34", fungsiSingkat: "Mendeteksi terang/gelap." },
      { namaKomponen: "Modul Relay 1-Ch", pasangKePin: "Tarik kabel IN Relay ke GPIO 26", fungsiSingkat: "Sakelar lampu AC." },
    ],
    penjelasanTeoriSingkat: "analogRead(34) menghasilkan nilai 0-4095. Jika gelap (<300), nyalakan relay pin 26.",
    instruksiKetik: [
      "Tarik kabel sensor LDR ke pin GPIO 34.",
      "Ketik int adc = analogRead(34); di loop().",
      "Ketik if (adc < 1000) digitalWrite(26, HIGH);",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(26, OUTPUT);
}

void loop() {
  // Ketik analogRead(34) dan logika Relay pin 26:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(34, INPUT);
  pinMode(26, OUTPUT);
}

void loop() {
  int adc = analogRead(34);
  if (adc < 1000) {
    digitalWrite(26, HIGH);
  } else {
    digitalWrite(26, LOW);
  }
  delay(1000);
}`,
    kataKunciWajibAda: ["analogRead", "34", "digitalWrite", "26", "HIGH"],
    penjelasanBarisKode: [{ potonganKode: "analogRead(34);", artiPenjelasan: "Membaca intensitas cahaya." }],
    simulasiOutputJikaBenar: `[LDR] Nilai ADC: 850 (< 1000) -> Relay Lampu ON 💡\n✅ Level 3 Selesai!`,
    tantanganModifikasi: "Ubah batas ambang pembacaan LDR.",
    xpReward: 60,
  },
  {
    level: 4,
    badgeLevel: "LEVEL 4 • MOTOR SERVO",
    judulMateri: "Penggerak Palang Pintu Servo & Solenoid (Proyek 2)",
    tujuanBelajar: "Menggunakan library <ESP32Servo.h> di pin 13 untuk buka tutup pintu.",
    komponenDimasukkan: [
      { namaKomponen: "Motor Servo SG90", pasangKePin: "Tarik kabel PWM Servo ke GPIO 13", fungsiSingkat: "Memutar palang 0-180°." },
      { namaKomponen: "Solenoid Door Lock", pasangKePin: "Tarik kabel Relay Solenoid ke GPIO 27", fungsiSingkat: "Kunci besi pintu." },
    ],
    penjelasanTeoriSingkat: "pintu.attach(13) mendaftarkan pin servo, lalu pintu.write(90) memutarnya.",
    instruksiKetik: [
      "Tarik kabel PWM Servo ke GPIO 13 ESP32.",
      "Ketik pintu.attach(13); di setup().",
      "Ketik pintu.write(90); di loop().",
    ],
    kodeTemplateAwal: `#include <ESP32Servo.h>
Servo pintu;

void setup() {
  Serial.begin(115200);
  pinMode(27, OUTPUT);
  // Ketik pintu.attach(13); di sini:
  
}

void loop() {
  // Ketik pintu.write(90); dan digitalWrite(27, HIGH); di sini:
  
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
  delay(2000);
  pintu.write(0);
  digitalWrite(27, LOW);
  delay(2000);
}`,
    kataKunciWajibAda: ["ESP32Servo.h", "attach", "13", "write", "90", "digitalWrite", "27"],
    penjelasanBarisKode: [{ potonganKode: "pintu.write(90);", artiPenjelasan: "Membuka palang pintu 90°." }],
    simulasiOutputJikaBenar: `[SERVO] GPIO 13 Berputar 90° | Solenoid UNLOCKED 🔓\n✅ Level 4 Selesai!`,
    tantanganModifikasi: "Ubah sudut putar servo menjadi 180 derajat.",
    xpReward: 65,
  },
  {
    level: 5,
    badgeLevel: "LEVEL 5 • SENSOR SUHU & KELEMBABAN",
    judulMateri: "Smart Greenhouse: Sensor DHT22, Kipas & Pompa (Proyek 3)",
    tujuanBelajar: "Membaca sensor DHT22 di pin 15 dan mengontrol kipas serta pompa.",
    komponenDimasukkan: [
      { namaKomponen: "Sensor DHT22", pasangKePin: "Tarik kabel Data DHT22 ke GPIO 15", fungsiSingkat: "Membaca suhu & kelembaban." },
      { namaKomponen: "Relay Pompa & Kipas", pasangKePin: "Pompa ke GPIO 25, Kipas ke GPIO 33", fungsiSingkat: "Otomasi pertanian." },
    ],
    penjelasanTeoriSingkat: "Jika suhu > 32°C, nyalakan kipas di pin 33. Jika tanah kering, nyalakan pompa di pin 25.",
    instruksiKetik: [
      "Tarik kabel DHT22 ke GPIO 15 ESP32.",
      "Ketik pinMode(25, OUTPUT); dan pinMode(33, OUTPUT); di setup().",
      "Ketik logika if (suhu > 32) digitalWrite(33, HIGH);",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  pinMode(25, OUTPUT);
  pinMode(33, OUTPUT);
}

void loop() {
  float suhu = 34.0;
  // Ketik logika if (suhu > 32) nyalakan pin 33:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(25, OUTPUT);
  pinMode(33, OUTPUT);
}

void loop() {
  float suhu = 34.0;
  if (suhu > 32.0) {
    digitalWrite(33, HIGH);
  } else {
    digitalWrite(33, LOW);
  }
  delay(1500);
}`,
    kataKunciWajibAda: ["pinMode", "25", "33", "suhu", "digitalWrite", "HIGH"],
    penjelasanBarisKode: [{ potonganKode: "if(suhu > 32)", artiPenjelasan: "Memicu pendingin ruangan." }],
    simulasiOutputJikaBenar: `[DHT22] Suhu 34.0°C -> Kipas Pin 33 Menyala 🌀\n✅ Level 5 Selesai!`,
    tantanganModifikasi: "Tambahkan logika kelembaban tanah untuk pompa air.",
    xpReward: 70,
  },
  {
    level: 6,
    badgeLevel: "LEVEL 6 • SENSOR GAS & KEBAKARAN",
    judulMateri: "Detektor Gas LPG MQ-2 & Sprinkler Pemadam (Proyek 4)",
    tujuanBelajar: "Membaca sensor MQ-2 di pin 32 dan membunyikan alarm sirine.",
    komponenDimasukkan: [
      { namaKomponen: "Sensor MQ-2", pasangKePin: "Tarik kabel AO MQ-2 ke GPIO 32", fungsiSingkat: "Deteksi asap & gas." },
      { namaKomponen: "Buzzer & Relay Pompa", pasangKePin: "Buzzer ke GPIO 19, Pompa ke GPIO 25", fungsiSingkat: "Alarm darurat." },
    ],
    penjelasanTeoriSingkat: "Jika konsentrasi gas >= 500 PPM, aktifkan buzzer pin 19 dan pompa pin 25.",
    instruksiKetik: [
      "Tarik kabel sensor MQ-2 ke GPIO 32 ESP32.",
      "Ketik int ppm = analogRead(32); di loop().",
      "Ketik if (ppm >= 500) digitalWrite(19, HIGH);",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  pinMode(32, INPUT);
  pinMode(19, OUTPUT);
  pinMode(25, OUTPUT);
}

void loop() {
  // Ketik analogRead(32) dan logika buzzer pin 19:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(32, INPUT);
  pinMode(19, OUTPUT);
  pinMode(25, OUTPUT);
}

void loop() {
  int adc = analogRead(32);
  int ppm = map(adc, 0, 4095, 100, 1000);
  if (ppm >= 500) {
    digitalWrite(19, HIGH);
    digitalWrite(25, HIGH);
  } else {
    digitalWrite(19, LOW);
    digitalWrite(25, LOW);
  }
  delay(1000);
}`,
    kataKunciWajibAda: ["analogRead", "32", "ppm", "digitalWrite", "19", "25"],
    penjelasanBarisKode: [{ potonganKode: "if (ppm >= 500)", artiPenjelasan: "Ambang batas bahaya gas." }],
    simulasiOutputJikaBenar: `[MQ-2] Gas 650 PPM -> Buzzer Pin 19 Berbunyi BEEP! 🚨\n✅ Level 6 Selesai!`,
    tantanganModifikasi: "Ubah batas PPM menjadi 300.",
    xpReward: 75,
  },
  {
    level: 7,
    badgeLevel: "LEVEL 7 • KOMUNIKASI UART 2 CHIP",
    judulMateri: "Dual-ESP32 Telemetry Bridge UART (Proyek 5)",
    tujuanBelajar: "Mengirimkan data serial dari ESP32 #1 ke ESP32 #2 via pin 16 & 17.",
    komponenDimasukkan: [
      { namaKomponen: "Dua Board ESP32", pasangKePin: "Tarik kabel TX2 (17) ke RX2 (16) menyilang", fungsiSingkat: "Jembatan data antar MCU." },
    ],
    penjelasanTeoriSingkat: "Serial2.begin(115200, SERIAL_8N1, 16, 17) membuka komunikasi hardware serial.",
    instruksiKetik: [
      "Tarik kabel silang TX2 ke RX2 antar ESP32.",
      "Ketik Serial2.begin(115200, SERIAL_8N1, 16, 17); di setup().",
      "Ketik Serial2.println(\"DATA_OK\"); di loop().",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  // Ketik Serial2.begin di sini:
  
}

void loop() {
  // Ketik Serial2.println("DATA_OK"); di sini:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, 16, 17);
}

void loop() {
  Serial2.println("DATA_OK");
  delay(1000);
}`,
    kataKunciWajibAda: ["Serial2.begin", "16", "17", "Serial2.println"],
    penjelasanBarisKode: [{ potonganKode: "Serial2.begin(...)", artiPenjelasan: "Mengaktifkan UART2." }],
    simulasiOutputJikaBenar: `[UART] ESP32 #1 TX ➔ ESP32 #2 RX Berhasil Terkirim!\n✅ Level 7 Selesai!`,
    tantanganModifikasi: "Kirim data suhu JSON.",
    xpReward: 80,
  },
  {
    level: 8,
    badgeLevel: "LEVEL 8 • PLC OTOMASI PABRIK",
    judulMateri: "ESP32 Master & Arduino Uno Slave Relay 4-Ch (Proyek 6)",
    tujuanBelajar: "Mengendalikan 4 channel relay pabrik dari mikrokontroler.",
    komponenDimasukkan: [
      { namaKomponen: "ESP32 Master + Arduino Uno", pasangKePin: "Tarik kabel I2C / Serial ke Uno", fungsiSingkat: "Kontrol mesin industri." },
      { namaKomponen: "Modul Relay 4-Ch", pasangKePin: "Hubungkan ke Pin 4, 5, 6, 7", fungsiSingkat: "Penggerak konveyor." },
    ],
    penjelasanTeoriSingkat: "Menggunakan array pin untuk menyalakan 4 jalur mesin secara bergantian.",
    instruksiKetik: [
      "Tarik kabel kontrol ke Modul Relay 4-Channel.",
      "Definisikan pin relay int pins[] = {4, 5, 6, 7};",
      "Gunakan perulangan for untuk mengaktifkannya.",
    ],
    kodeTemplateAwal: `int pins[4] = {4, 5, 6, 7};
void setup() {
  Serial.begin(115200);
  // Ketik perulangan pinMode untuk 4 pin di sini:
  
}

void loop() {
  // Ketik perintah menyalakan relay:
  
}`,
    kodeTargetBenar: `int pins[4] = {4, 5, 6, 7};
void setup() {
  Serial.begin(115200);
  for(int i=0; i<4; i++) {
    pinMode(pins[i], OUTPUT);
  }
}

void loop() {
  for(int i=0; i<4; i++) {
    digitalWrite(pins[i], HIGH);
    delay(500);
    digitalWrite(pins[i], LOW);
  }
}`,
    kataKunciWajibAda: ["pins", "pinMode", "OUTPUT", "digitalWrite", "HIGH", "LOW"],
    penjelasanBarisKode: [{ potonganKode: "for(int i=0; i<4; i++)", artiPenjelasan: "Looping 4 relay pabrik." }],
    simulasiOutputJikaBenar: `[PLC] Relay 4-Channel Aktif Berurutan (Conveyor & Press OK)\n✅ Level 8 Selesai!`,
    tantanganModifikasi: "Ubah jeda delay menjadi 200ms.",
    xpReward: 85,
  },
  {
    level: 9,
    badgeLevel: "LEVEL 9 • TRIPLE MCU SYSTEM",
    judulMateri: "Arsitektur 3 Chip Terintegrasi (Proyek 7)",
    tujuanBelajar: "Menghubungkan ESP32 #1, ESP32 #2, dan Arduino Uno #3 dalam 1 jaringan.",
    komponenDimasukkan: [
      { namaKomponen: "3x Mikrokontroler", pasangKePin: "Tarik bus komunikasi multi-node", fungsiSingkat: "Sistem terdistribusi." },
    ],
    penjelasanTeoriSingkat: "Mengatur Cluster ID agar 3 chip saling mengenali paket data satu sama lain.",
    instruksiKetik: [
      "Tarik kabel bus komunikasi antar 3 board.",
      "Ketik int CLUSTER_ID = 101;",
      "Ketik perintah sinkronisasi Serial.",
    ],
    kodeTemplateAwal: `int CLUSTER_ID = 101;
void setup() {
  Serial.begin(115200);
  // Ketik inisialisasi cluster:
  
}

void loop() {
  // Ketik Serial.println("Triple MCU OK");:
  
}`,
    kodeTargetBenar: `int CLUSTER_ID = 101;
void setup() {
  Serial.begin(115200);
  Serial.println("Triple MCU Sinkron!");
}

void loop() {
  Serial.println("Cluster ID 101 Active");
  delay(1000);
}`,
    kataKunciWajibAda: ["CLUSTER_ID", "101", "Serial.println", "delay"],
    penjelasanBarisKode: [{ potonganKode: "int CLUSTER_ID = 101;", artiPenjelasan: "ID jaringan klaster." }],
    simulasiOutputJikaBenar: `[TRIPLE-MCU] Sinkronisasi 3 Chip Berhasil!\n✅ Level 9 Selesai!`,
    tantanganModifikasi: "Ubah ID Klaster menjadi 202.",
    xpReward: 90,
  },
  {
    level: 10,
    badgeLevel: "LEVEL 10 • SENSOR PERTANIAN NPK",
    judulMateri: "Membaca Sensor Pupuk NPK Tanah RS485",
    tujuanBelajar: "Mengambil data unsur hara Nitrogen, Fosfor, dan Kalium dari tanah.",
    komponenDimasukkan: [
      { namaKomponen: "Sensor NPK RS485", pasangKePin: "Tarik kabel sensor ke pin UART", fungsiSingkat: "Mengukur unsur hara tanah." },
    ],
    penjelasanTeoriSingkat: "Membaca nilai mg/kg kandungan NPK untuk rekomendasi pemupukan presisi.",
    instruksiKetik: [
      "Tarik kabel sensor NPK ke modul mikrokontroler.",
      "Ketik int nitrogen = 145;",
      "Ketik Serial.println(nitrogen);",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
}

void loop() {
  // Ketik variabel nitrogen dan cetak ke Serial:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
}

void loop() {
  int nitrogen = 145;
  int fosfor = 62;
  int kalium = 190;
  Serial.printf("NPK -> N:%d P:%d K:%d\\n", nitrogen, fosfor, kalium);
  delay(1500);
}`,
    kataKunciWajibAda: ["nitrogen", "fosfor", "kalium", "Serial.printf"],
    penjelasanBarisKode: [{ potonganKode: "int nitrogen = 145;", artiPenjelasan: "Kadar N tanah." }],
    simulasiOutputJikaBenar: `[NPK] N:145 | P:62 | K:190 mg/kg (Tanah Subur)\n✅ Level 10 Selesai!`,
    tantanganModifikasi: "Ubah nilai nitrogen menjadi 80 (kurang subur).",
    xpReward: 95,
  },
  {
    level: 11,
    badgeLevel: "LEVEL 11 • GPS KOORDINAT KEBUN",
    judulMateri: "Melacak Posisi Latitude & Longitude (GPS NEO-6M)",
    tujuanBelajar: "Membaca data satelit GPS untuk pemetaan blok lahan pertanian.",
    komponenDimasukkan: [
      { namaKomponen: "Modul GPS NEO-6M", pasangKePin: "Tarik kabel GPS TX/RX ke Pin 4 & 5", fungsiSingkat: "Mendapatkan titik koordinat bumi." },
    ],
    penjelasanTeoriSingkat: "Menggunakan library TinyGPS++ untuk membaca posisi lintang dan bujur.",
    instruksiKetik: [
      "Tarik kabel GPS ke pin 4 dan 5.",
      "Ketik double lat = 1.6681;",
      "Ketik double lng = 101.4451;",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
}

void loop() {
  // Ketik variabel lat dan lng GPS:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
}

void loop() {
  double lat = 1.66812;
  double lng = 101.44510;
  Serial.printf("GPS Posisi -> Lat: %.5f, Lng: %.5f\\n", lat, lng);
  delay(2000);
}`,
    kataKunciWajibAda: ["lat", "lng", "Serial.printf"],
    penjelasanBarisKode: [{ potonganKode: "double lat = 1.66812;", artiPenjelasan: "Koordinat lintang GPS." }],
    simulasiOutputJikaBenar: `[GPS] Satelit Terkunci! Posisi: 1.66812, 101.44510\n✅ Level 11 Selesai!`,
    tantanganModifikasi: "Ubah koordinat GPS sesuai lokasi kota Anda.",
    xpReward: 100,
  },
  {
    level: 12,
    badgeLevel: "LEVEL 12 • MONITORING BATERAI",
    judulMateri: "Sensor Tegangan Baterai Li-Ion 18650 (Volt & %)",
    tujuanBelajar: "Membaca tegangan baterai di pin ADC 35 untuk estimasi sisa daya.",
    komponenDimasukkan: [
      { namaKomponen: "Sensor Pembagi Tegangan", pasangKePin: "Tarik kabel ke Pin ADC GPIO 35", fungsiSingkat: "Mengukur Voltase 3.0V - 4.2V." },
    ],
    penjelasanTeoriSingkat: "Membaca pin ADC dan mengonversinya menjadi persentase sisa baterai.",
    instruksiKetik: [
      "Tarik kabel pembagi tegangan ke pin ADC 35.",
      "Ketik int adcBatt = analogRead(35);",
      "Ketik float volt = 3.10 + (adcBatt / 4095.0) * 1.10;",
    ],
    kodeTemplateAwal: `void setup() {
  Serial.begin(115200);
  pinMode(35, INPUT);
}

void loop() {
  // Ketik analogRead(35) dan rumus tegangan baterai:
  
}`,
    kodeTargetBenar: `void setup() {
  Serial.begin(115200);
  pinMode(35, INPUT);
}

void loop() {
  int adc = analogRead(35);
  float volt = 3.10 + (adc / 4095.0) * 1.10;
  Serial.printf("Baterai -> Voltage: %.2f V\\n", volt);
  delay(1500);
}`,
    kataKunciWajibAda: ["analogRead", "35", "volt", "Serial.printf"],
    penjelasanBarisKode: [{ potonganKode: "float volt = ...;", artiPenjelasan: "Konversi ADC ke Volt." }],
    simulasiOutputJikaBenar: `[POWER] Tegangan Baterai: 4.12 V (94% Kapasitas)\n✅ Level 12 Selesai!`,
    tantanganModifikasi: "Tambahkan peringatan jika volt < 3.3V.",
    xpReward: 110,
  },
  {
    level: 13,
    badgeLevel: "LEVEL 13 • STRUCT DATA SENSOR",
    judulMateri: "Pengemasan Paket Data Multi-Sensor ke dalam Struct C++",
    tujuanBelajar: "Menggabungkan Suhu, NPK, GPS, dan Baterai ke dalam 1 struktur data.",
    komponenDimasukkan: [
      { namaKomponen: "Sistem Paket IoT", pasangKePin: "Memori Mikrokontroler", fungsiSingkat: "Menyusun format bingkai data." },
    ],
    penjelasanTeoriSingkat: "Struct C++ memudahkan pengiriman banyak variabel sensor sekaligus.",
    instruksiKetik: [
      "Buat struct PaketKebun dengan float suhu; dan int npk;",
      "Buat objek paket dan isi nilainya.",
    ],
    kodeTemplateAwal: `struct PaketKebun {
  float suhu;
  int npk;
};
PaketKebun dataKu;

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Isi dataKu.suhu dan dataKu.npk lalu cetak:
  
}`,
    kodeTargetBenar: `struct PaketKebun {
  float suhu;
  int npk;
};
PaketKebun dataKu;

void setup() {
  Serial.begin(115200);
}

void loop() {
  dataKu.suhu = 29.2;
  dataKu.npk = 150;
  Serial.printf("Struct Data -> Suhu: %.1f | NPK: %d\\n", dataKu.suhu, dataKu.npk);
  delay(1000);
}`,
    kataKunciWajibAda: ["struct", "PaketKebun", "dataKu", "Serial.printf"],
    penjelasanBarisKode: [{ potonganKode: "struct PaketKebun { ... };", artiPenjelasan: "Wadah variabel custom." }],
    simulasiOutputJikaBenar: `[STRUCT] Paket Terkemas Rapi (Suhu: 29.2 | NPK: 150)\n✅ Level 13 Selesai!`,
    tantanganModifikasi: "Tambahkan variabel tegangan baterai ke dalam struct.",
    xpReward: 120,
  },
  {
    level: 14,
    badgeLevel: "LEVEL 14 • PROTOKOL ESP-NOW WIRELESS",
    judulMateri: "Komunikasi Tanpa Router Wi-Fi dengan ESP-NOW",
    tujuanBelajar: "Memancarkan paket data langsung antar-ESP32 menggunakan protokol ESP-NOW.",
    komponenDimasukkan: [
      { namaKomponen: "Dua Board ESP32", pasangKePin: "Radio 2.4 GHz Bawaan ESP32", fungsiSingkat: "Kirim data tanpa router." },
    ],
    penjelasanTeoriSingkat: "ESP-NOW adalah protokol nirkabel super cepat buatan Espressif untuk kirim data peer-to-peer.",
    instruksiKetik: [
      "Aktifkan mode WiFi: WiFi.mode(WIFI_STA);",
      "Inisialisasi ESP-NOW dengan esp_now_init();",
    ],
    kodeTemplateAwal: `#include <WiFi.h>
#include <esp_now.h>

void setup() {
  Serial.begin(115200);
  // Ketik WiFi.mode(WIFI_STA); dan esp_now_init(); di sini:
  
}

void loop() {
  Serial.println("Mengirim paket ESP-NOW...");
  delay(2000);
}`,
    kodeTargetBenar: `#include <WiFi.h>
#include <esp_now.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  if (esp_now_init() == ESP_OK) {
    Serial.println("ESP-NOW Berhasil Diinisialisasi!");
  }
}

void loop() {
  Serial.println("Mengirim paket ESP-NOW...");
  delay(2000);
}`,
    kataKunciWajibAda: ["WiFi.mode", "WIFI_STA", "esp_now_init", "ESP_OK"],
    penjelasanBarisKode: [{ potonganKode: "esp_now_init();", artiPenjelasan: "Menyalakan protokol ESP-NOW." }],
    simulasiOutputJikaBenar: `[ESP-NOW] Radio 2.4GHz Peer-to-Peer Aktif Tanpa Wi-Fi Router!\n✅ Level 14 Selesai!`,
    tantanganModifikasi: "Daftarkan fungsi callback penerima data (OnDataRecv).",
    xpReward: 130,
  },
  {
    level: 15,
    badgeLevel: "LEVEL 15 • MASTER 10-NODE MESH",
    judulMateri: "Estafet Multi-Hop 10-Node ESP32 Menuju Gateway Internet (Proyek 8)",
    tujuanBelajar: "Menyusun jaringan estafet 10 node (Node 1 ➔ 10) dan mengunggah ke Cloud Web.",
    komponenDimasukkan: [
      { namaKomponen: "10x Node ESP32 Kebun", pasangKePin: "Node 1..9 Estafet | Node 10 Gateway", fungsiSingkat: "Jaringan wireless perkebunan luas." },
    ],
    penjelasanTeoriSingkat: "Meneruskan paket secara berantai (Next-Hop Forwarding) hingga tiba di Gateway Node 10.",
    instruksiKetik: [
      "Tentukan ID node: #define MY_NODE_ID 1",
      "Teruskan paket ke node berikutnya: int nextHop = MY_NODE_ID + 1;",
      "Kirim dengan esp_now_send().",
    ],
    kodeTemplateAwal: `#include <WiFi.h>
#include <esp_now.h>
#define MY_NODE_ID 1

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
}

void loop() {
  // Ketik logika estafet nextHop = MY_NODE_ID + 1 dan esp_now_send(...):
  
}`,
    kodeTargetBenar: `#include <WiFi.h>
#include <esp_now.h>
#define MY_NODE_ID 1

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
}

void loop() {
  int nextHop = MY_NODE_ID + 1;
  Serial.printf("Node #%d meneruskan paket ke Node #%d\\n", MY_NODE_ID, nextHop);
  delay(2000);
}`,
    kataKunciWajibAda: ["MY_NODE_ID", "nextHop", "MY_NODE_ID + 1", "Serial.printf"],
    penjelasanBarisKode: [{ potonganKode: "int nextHop = MY_NODE_ID + 1;", artiPenjelasan: "Rumus lompatan estafet." }],
    simulasiOutputJikaBenar: `[MESH 10-NODE] Estafet Berjalan Sempurna dari Node 1 hingga Node 10 (Gateway Internet) 🌐\n🏆 SELAMAT! Anda telah menamatkan seluruh 15 Level Akademi IoT HibahIlmu!`,
    tantanganModifikasi: "Buka menu 'Simulator 10-Node Multi-Hop' di atas untuk menguji visualisasinya!",
    xpReward: 200,
  },
];