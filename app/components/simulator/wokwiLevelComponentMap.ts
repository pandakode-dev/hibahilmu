// app/components/simulator/wokwiLevelComponentMap.ts
import { ExtendedLessonStepIoT } from "./wokwiAcademyBlueprints";

export interface SpesifikasiKomponenSlotEksplisit {
  namaTampilSlot2: string;
  fungsiSlot2: string;
  idGambarSlot2: string; // ID murni untuk MiniaturSvgGudang48 (tanpa kata "esp32" kecuali memang board ESP32)
  idGudangValidSlot2: string[];
  kataKunciValidSlot2: string[];
  pin1Slot2Label: string;
  pin2Slot2Label: string;
  pinEspKeSlot2Pin1: { id: string; label: string; warna: string };
  pinEspKeSlot2Pin2: { id: string; label: string; warna: string };

  namaTampilSlot3: string;
  fungsiSlot3: string;
  idGambarSlot3: string;
  idGudangValidSlot3: string[];
  kataKunciValidSlot3: string[];
  pin1Slot3Label: string;
  pin2Slot3Label: string;
  pinEspKeSlot3Pin1: { id: string; label: string; warna: string };
  pinEspKeSlot3Pin2: { id: string; label: string; warna: string };

  analogiMudah: string;
}

// ============================================================================
// DATABASE PEMETAAN KOMPONEN & GAMBAR ASLI SESUAI PERINTAH MODUL (100% AKURAT)
// ============================================================================
export function cariSpesifikasiKomponenSesuaiModul(
  materi: ExtendedLessonStepIoT
): SpesifikasiKomponenSlotEksplisit {
  const judul = (materi.judulMateri || "").toLowerCase();
  const kode = (materi.kodeTargetBenar || "").toLowerCase();

  // 1. MODUL LDR & LAMPU JALAN OTOMATIS (PROYEK 1 / LEVEL 3)
  if (judul.includes("ldr") || judul.includes("lampu jalan")) {
    return {
      namaTampilSlot2: "Sensor Cahaya LDR (Photoresistor)",
      fungsiSlot2: "Membaca intensitas cahaya matahari (Lux) ke pin ADC GPIO 34.",
      idGambarSlot2: "sensor_ldr",
      idGudangValidSlot2: ["sensor_ldr", "sen_ldr"],
      kataKunciValidSlot2: ["sensor cahaya", "ldr"],
      pin1Slot2Label: "1. Pin AO LDR (Sinyal)",
      pin2Slot2Label: "2. Pin VCC LDR (3.3V)",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#22c55e" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Modul Relay 1-Channel 5V + Lampu",
      fungsiSlot3: "Sakelar magnetik penyala lampu jalan otomatis di GPIO 26.",
      idGambarSlot3: "relay_1ch",
      idGudangValidSlot3: ["relay_1ch", "rel_1ch"],
      kataKunciValidSlot3: ["relay 1", "relay_1ch"],
      pin1Slot3Label: "1. Pin IN Relay (Kontrol)",
      pin2Slot3Label: "2. Pin GND Relay",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO26", label: "GPIO 26", warna: "#eab308" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Sensor Cahaya LDR di Slot #2 bertugas mengukur terang/gelapnya langit melalui kaki GPIO 34. Saat malam tiba (nilai ADC < 1000), ESP32 mengirim perintah HIGH melalui kaki GPIO 26 ke Modul Relay 1-Ch di Slot #3 untuk menyalakan lampu jalan!",
    };
  }

  // 2. MODUL SERVO & SOLENOID DOOR LOCK (PROYEK 2 / LEVEL 4)
  if (judul.includes("servo") && judul.includes("solenoid")) {
    return {
      namaTampilSlot2: "Motor Servo SG90 180° (Palang Pintu)",
      fungsiSlot2: "Memutar palang pintu ke sudut 90° lewat sinyal PWM GPIO 13.",
      idGambarSlot2: "servo_sg90",
      idGudangValidSlot2: ["servo_sg90", "akt_servo180"],
      kataKunciValidSlot2: ["servo sg90", "servo 180"],
      pin1Slot2Label: "1. Kabel PWM Servo",
      pin2Slot2Label: "2. Kabel VCC Servo",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO13", label: "GPIO 13", warna: "#a855f7" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Solenoid Door Lock 12V + Relay",
      fungsiSlot3: "Menarik slot kunci besi pintu saat GPIO 27 bernilai HIGH.",
      idGambarSlot3: "solenoid_lock",
      idGudangValidSlot3: ["solenoid_lock", "akt_solenoid", "rfid_rc522"],
      kataKunciValidSlot3: ["solenoid", "door lock"],
      pin1Slot3Label: "1. Pin IN Solenoid",
      pin2Slot3Label: "2. Pin GND Solenoid",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO27", label: "GPIO 27", warna: "#14b8a6" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Saat akses pintu dibuka, ESP32 melakukan 2 aksi mekanik sekaligus: (1) Mengirim sinyal ke GPIO 27 untuk menarik kunci besi Solenoid Door Lock di Slot #3, dan (2) Mengirim sudut putar pintu.write(90) ke GPIO 13 untuk memutar lengan Motor Servo SG90 di Slot #2!",
    };
  }

  // 3. MODUL ULTRASONIK HC-SR04 + SERVO SG90
  if (judul.includes("ultrasonik")) {
    return {
      namaTampilSlot2: "Sensor Jarak Ultrasonik HC-SR04",
      fungsiSlot2: "Memantulkan gelombang sonar untuk mendeteksi jarak objek (cm).",
      idGambarSlot2: "ultrasonik_hcsr04",
      idGudangValidSlot2: ["ultrasonik_hcsr04", "sen_ultrasonik"],
      kataKunciValidSlot2: ["ultrasonik", "sr04"],
      pin1Slot2Label: "1. Pin Echo/Trig Sonar",
      pin2Slot2Label: "2. Pin VCC Sonar",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO27", label: "GPIO 27", warna: "#38bdf8" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Motor Servo SG90 180° (Palang)",
      fungsiSlot3: "Mengangkat palang parkir ke sudut 90° melalui GPIO 13.",
      idGambarSlot3: "servo_sg90",
      idGudangValidSlot3: ["servo_sg90", "akt_servo180"],
      kataKunciValidSlot3: ["servo sg90"],
      pin1Slot3Label: "1. Kabel PWM Servo",
      pin2Slot3Label: "2. Kabel GND Servo",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO13", label: "GPIO 13", warna: "#facc15" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Sensor Ultrasonik HC-SR04 di Slot #2 memancarkan gelombang suara untuk mengukur jarak kendaraan. Jika jarak < 30 cm, ESP32 memerintahkan Motor Servo SG90 di Slot #3 untuk membuka palang 90 derajat!",
    };
  }

  // 4. MODUL RFID RC522 + SOLENOID LOCK 12V
  if (judul.includes("rfid")) {
    return {
      namaTampilSlot2: "RFID Card Reader RC522 (13.56MHz)",
      fungsiSlot2: "Memindai chip kartu E-KTP yang didekatkan ke antena reader.",
      idGambarSlot2: "rfid_rc522",
      idGudangValidSlot2: ["rfid_rc522", "sen_rfid"],
      kataKunciValidSlot2: ["rfid", "rc522"],
      pin1Slot2Label: "1. Pin SDA/Data RFID",
      pin2Slot2Label: "2. Pin VCC 3.3V RFID",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO13", label: "GPIO 13", warna: "#38bdf8" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Solenoid Door Lock 12V",
      fungsiSlot3: "Membuka kunci besi pintu laboratorium melalui GPIO 27.",
      idGambarSlot3: "solenoid_lock",
      idGudangValidSlot3: ["solenoid_lock", "akt_solenoid"],
      kataKunciValidSlot3: ["solenoid"],
      pin1Slot3Label: "1. Pin IN Solenoid",
      pin2Slot3Label: "2. Pin GND Solenoid",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO27", label: "GPIO 27", warna: "#10b981" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Kartu akses dipindai oleh RFID Reader RC522 di Slot #2. Jika kartu valid, ESP32 memberi tegangan HIGH pada GPIO 27 untuk menarik kunci besi Solenoid Door Lock di Slot #3!",
    };
  }

  // 5. MODUL SMART GREENHOUSE: SENSOR SUHU DHT22 + KIPAS & POMPA AIR (PROYEK 3 / LEVEL 5)
  if (judul.includes("dht22") || judul.includes("greenhouse")) {
    return {
      namaTampilSlot2: "Sensor Suhu & Lembab DHT22",
      fungsiSlot2: "Membaca suhu udara (°C) & kelembaban rumah kaca di GPIO 15.",
      idGambarSlot2: "sensor_suhu_dht",
      idGudangValidSlot2: ["sensor_suhu_dht", "sen_dht22", "kelembapan_tanah", "sen_soil"],
      kataKunciValidSlot2: ["dht22", "sensor suhu"],
      pin1Slot2Label: "1. Pin Data DHT22",
      pin2Slot2Label: "2. Pin VCC DHT22 (3.3V)",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Kipas DC Exhaust & Pompa Air Mini",
      fungsiSlot3: "Mendinginkan ruangan (GPIO 33) & menyiram tanaman (GPIO 25).",
      idGambarSlot3: "kipas_dc",
      idGudangValidSlot3: ["kipas_dc", "akt_kipas", "pompa_air", "akt_pompa", "relay_2ch", "rel_2ch"],
      kataKunciValidSlot3: ["kipas", "pompa", "relay 2"],
      pin1Slot3Label: "1. Pin Kipas (GPIO 33)",
      pin2Slot3Label: "2. Pin Pompa / GND (25)",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO33", label: "GPIO 33", warna: "#8b5cf6" },
      pinEspKeSlot3Pin2: { id: "ESP_GPIO25", label: "GPIO 25", warna: "#3b82f6" },

      analogiMudah:
        "Sensor Suhu DHT22 di Slot #2 terus memantau suhu udara melalui kaki GPIO 15. Begitu suhu > 32°C, ESP32 langsung menyalakan Kipas DC (GPIO 33) dan Pompa Air Irigasi (GPIO 25) di Slot #3!",
    };
  }

  // 6. MODUL DETEKTOR GAS LPG MQ-2 & SPRINKLER PEMADAM (PROYEK 4 / LEVEL 6)
  if (judul.includes("mq-2") || judul.includes("gas") || judul.includes("kebakaran") || judul.includes("sprinkler")) {
    return {
      namaTampilSlot2: "Sensor Gas & Asap MQ-2 (LPG/Metana)",
      fungsiSlot2: "Mendeteksi kepekatan asap & kebocoran gas (PPM) di pin ADC GPIO 32.",
      idGambarSlot2: "sensor_mq2",
      idGudangValidSlot2: ["sensor_mq2", "sen_mq2", "sensor_flame", "sen_flame", "sensor_mq135"],
      kataKunciValidSlot2: ["mq-2", "sensor gas", "flame"],
      pin1Slot2Label: "1. Pin AO Gas MQ-2",
      pin2Slot2Label: "2. Pin VCC MQ-2 (3.3V)",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO32", label: "GPIO 32", warna: "#f43f5e" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Buzzer Sirine & Pompa Sprinkler",
      fungsiSlot3: "Membunyikan alarm bahaya (GPIO 19) & menyemprotkan air (GPIO 25).",
      idGambarSlot3: "buzzer_piezo",
      idGudangValidSlot3: ["buzzer_piezo", "akt_buzzer", "pompa_air", "akt_pompa", "relay_1ch"],
      kataKunciValidSlot3: ["buzzer", "pompa", "relay"],
      pin1Slot3Label: "1. Pin Buzzer (GPIO 19)",
      pin2Slot3Label: "2. Pin Pompa (GPIO 25)",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO19", label: "GPIO 19", warna: "#ec4899" },
      pinEspKeSlot3Pin2: { id: "ESP_GPIO25", label: "GPIO 25", warna: "#3b82f6" },

      analogiMudah:
        "Sensor Gas MQ-2 di Slot #2 mencium kepekatan gas bocor melalui kaki analog GPIO 32. Jika kadar gas >= 500 PPM, ESP32 langsung membunyikan Buzzer Sirine (GPIO 19) dan menyalakan Pompa Sprinkler Pemadam (GPIO 25) di Slot #3!",
    };
  }

  // 7. MODUL DUAL-ESP32 TELEMETRY BRIDGE UART (PROYEK 5 / LEVEL 7)
  if (judul.includes("uart") || judul.includes("dual-esp32") || judul.includes("telemetry bridge")) {
    return {
      namaTampilSlot2: "Board ESP32 #2 / NodeMCU (Gateway RX/TX)",
      fungsiSlot2: "Menerima paket data serial melalui jalur kabel silang UART2 (Pin 16 & 17).",
      idGambarSlot2: "nodemcu_esp8266",
      idGudangValidSlot2: ["esp32_devkit", "nodemcu_esp8266", "esp32_c6", "mcu_esp32_node2", "mcu_esp32"],
      kataKunciValidSlot2: ["esp32", "nodemcu"],
      pin1Slot2Label: "1. Pin RX2 Penerima (16)",
      pin2Slot2Label: "2. Pin TX2 Pengirim (17)",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },
      pinEspKeSlot2Pin2: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#06b6d4" },

      namaTampilSlot3: "Layar OLED I2C 128x64 (Monitor Data)",
      fungsiSlot3: "Menampilkan teks paket telemetri yang diterima oleh Gateway.",
      idGambarSlot3: "layar_oled",
      idGudangValidSlot3: ["layar_oled", "dsp_oled", "lcd_16x2", "dsp_lcd"],
      kataKunciValidSlot3: ["oled", "lcd"],
      pin1Slot3Label: "1. Pin VCC OLED (3.3V)",
      pin2Slot3Label: "2. Pin GND OLED",
      pinEspKeSlot3Pin1: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Dua mikrokontroler saling mengobrol lewat kabel Serial2 secara menyilang: kaki TX2 (17) milik ESP32 #1 di kiri masuk ke kaki RX2 (16) milik ESP32 #2 di Slot #2, lalu pesan yang diterima ditampilkan ke Layar OLED I2C di Slot #3!",
    };
  }

  // 8. MODUL PLC OTOMASI PABRIK: ARDUINO UNO SLAVE + RELAY 4-CH (PROYEK 6 / LEVEL 8)
  if (judul.includes("relay 4-ch") || judul.includes("plc") || judul.includes("pabrik") || judul.includes("uno slave")) {
    return {
      namaTampilSlot2: "Arduino Uno R3 (Slave Controller)",
      fungsiSlot2: "Menerima instruksi dari ESP32 Master untuk menggerakkan mesin pabrik.",
      idGambarSlot2: "arduino_uno",
      idGudangValidSlot2: ["arduino_uno", "mcu_uno", "stm32_bluepill"],
      kataKunciValidSlot2: ["arduino uno", "uno"],
      pin1Slot2Label: "1. Pin Bus Serial Uno",
      pin2Slot2Label: "2. Pin VCC 5V Uno",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#38bdf8" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Modul Relay 4-Channel Industri PLC",
      fungsiSlot3: "Sakelar 4 jalur mesin konveyor pabrik (Pin 4, 5, 6, 7).",
      idGambarSlot3: "relay_4ch",
      idGudangValidSlot3: ["relay_4ch", "rel_4ch", "servo_mg996r"],
      kataKunciValidSlot3: ["relay 4", "relay_4ch"],
      pin1Slot3Label: "1. Pin IN1..IN4 Relay",
      pin2Slot3Label: "2. Pin GND Bus Relay",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#facc15" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Dalam lini pabrik industri, ESP32 Master bekerja sama dengan Arduino Uno R3 (Slot #2) untuk menyalakan 4 sakelar kontaktor pada Modul Relay 4-Channel (Slot #3) secara berurutan menggunakan perulangan for!",
    };
  }

  // 9. MODUL TRIPLE MCU SYSTEM (PROYEK 7 / LEVEL 9)
  if (judul.includes("triple") || judul.includes("3 chip") || judul.includes("3 mikrokontroler")) {
    return {
      namaTampilSlot2: "STM32 BluePill / ESP32 Sub-Node #2",
      fungsiSlot2: "Node pemroses tengah dalam klaster 3 mikrokontroler.",
      idGambarSlot2: "stm32_bluepill",
      idGudangValidSlot2: ["stm32_bluepill", "rpi_pico", "nodemcu_esp8266", "esp32_devkit"],
      kataKunciValidSlot2: ["stm32", "pico", "nodemcu", "esp32"],
      pin1Slot2Label: "1. Pin Sync Klaster",
      pin2Slot2Label: "2. Pin VCC 3.3V",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Arduino Uno R3 #3 (Actuator Slave)",
      fungsiSlot3: "Mikrokontroler ke-3 eksekutor beban aktuator klaster.",
      idGambarSlot3: "arduino_uno",
      idGudangValidSlot3: ["arduino_uno", "mcu_uno", "relay_4ch"],
      kataKunciValidSlot3: ["arduino", "uno", "relay"],
      pin1Slot3Label: "1. Pin Bus Klaster #3",
      pin2Slot3Label: "2. Pin Ground Bersama",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Arsitektur Triple-MCU menghubungkan 3 otak mikrokontroler sekaligus (ESP32 #1 + STM32/ESP32 #2 di Slot #2 + Arduino Uno #3 di Slot #3) dalam satu ID Klaster yang sinkron!",
    };
  }

  // 10. MODUL SENSOR PUPUK NPK TANAH RS485 (LEVEL 10 / 18)
  if (judul.includes("npk") && !judul.includes("10-node")) {
    return {
      namaTampilSlot2: "Sensor Pupuk NPK Tanah 3-Garpu (RS485)",
      fungsiSlot2: "Mengukur unsur hara Nitrogen (N), Fosfor (P), dan Kalium (K) dalam mg/kg.",
      idGambarSlot2: "sensor_npk",
      idGudangValidSlot2: ["sensor_npk", "sen_npk", "kelembapan_tanah"],
      kataKunciValidSlot2: ["npk", "pupuk"],
      pin1Slot2Label: "1. Pin RO Modbus NPK",
      pin2Slot2Label: "2. Pin DI Modbus NPK",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#06b6d4" },
      pinEspKeSlot2Pin2: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },

      namaTampilSlot3: "Layar OLED I2C / Modul GPS Kebun",
      fungsiSlot3: "Menampilkan kadar N-P-K tanah dan status kesuburan lahan.",
      idGambarSlot3: judul.includes("gps") ? "gps_neo6m" : "layar_oled",
      idGudangValidSlot3: ["layar_oled", "dsp_oled", "gps_neo6m", "sen_gps", "lcd_16x2"],
      kataKunciValidSlot3: ["oled", "gps", "lcd"],
      pin1Slot3Label: "1. Pin Data Display/GPS",
      pin2Slot3Label: "2. Pin GND Display/GPS",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#38bdf8" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Tiga garpu besi pada Sensor Pupuk NPK di Slot #2 ditancapkan ke tanah untuk membaca kadar Nitrogen, Fosfor, dan Kalium via jalur RS485 (Pin 16 & 17), lalu hasilnya ditampilkan ke modul di Slot #3!",
    };
  }

  // 11. MODUL GPS KOORDINAT KEBUN NEO-6M (LEVEL 11)
  if (judul.includes("gps")) {
    return {
      namaTampilSlot2: "Modul Satelit GPS u-blox NEO-6M",
      fungsiSlot2: "Mengunci titik koordinat Latitude & Longitude dari satelit.",
      idGambarSlot2: "gps_neo6m",
      idGudangValidSlot2: ["gps_neo6m", "sen_gps"],
      kataKunciValidSlot2: ["gps", "neo-6m"],
      pin1Slot2Label: "1. Pin TX GPS NEO-6M",
      pin2Slot2Label: "2. Pin VCC GPS (3.3V)",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#38bdf8" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "Layar OLED I2C (Peta Koordinat)",
      fungsiSlot3: "Menampilkan angka lintang (Lat) & bujur (Lng) kebun.",
      idGambarSlot3: "layar_oled",
      idGudangValidSlot3: ["layar_oled", "dsp_oled", "lcd_16x2", "sensor_npk"],
      kataKunciValidSlot3: ["oled", "lcd", "npk"],
      pin1Slot3Label: "1. Pin SDA OLED",
      pin2Slot3Label: "2. Pin GND OLED",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Antena keramik emas pada Modul GPS NEO-6M di Slot #2 menangkap sinyal satelit dan mengirimkan koordinat Latitude & Longitude ke GPIO 4 ESP32!",
    };
  }

  // 12. MODUL MONITORING BATERAI 18650 & SENSOR TEGANGAN (LEVEL 12 / 19)
  if (judul.includes("baterai") || judul.includes("tegangan")) {
    return {
      namaTampilSlot2: "Socket Baterai Li-Ion 18650 (3.7V–4.2V)",
      fungsiSlot2: "Menyuplai daya mandiri untuk node sensor di perkebunan.",
      idGambarSlot2: "socket_baterai",
      idGudangValidSlot2: ["socket_baterai", "pwr_batt18650"],
      kataKunciValidSlot2: ["baterai", "18650"],
      pin1Slot2Label: "1. Kutub Positif (+) Batt",
      pin2Slot2Label: "2. Kutub Negatif (-) Batt",
      pinEspKeSlot2Pin1: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
      pinEspKeSlot2Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      namaTampilSlot3: "Sensor Tegangan 0–25V / INA219",
      fungsiSlot3: "Mengukur voltase baterai melalui pin ADC GPIO 35.",
      idGambarSlot3: "sensor_tegangan",
      idGudangValidSlot3: ["sensor_tegangan", "pwr_ina219", "sensor_pzem"],
      kataKunciValidSlot3: ["tegangan", "ina219", "pzem"],
      pin1Slot3Label: "1. Pin Sinyal V_OUT",
      pin2Slot3Label: "2. Pin GND Sensor",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO35", label: "GPIO 35", warna: "#f59e0b" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Baterai Li-Ion 18650 di Slot #2 diukur tegangannya oleh Sensor Tegangan 0-25V di Slot #3 melalui kaki ADC GPIO 35 sehingga kita tahu sisa kapasitas baterai dalam Volt dan Persen (%)!",
    };
  }

  // 13. MODUL POTENSIOMETER 10K + PWM LED DIMMER
  if (judul.includes("potensiometer")) {
    return {
      namaTampilSlot2: "Potensiometer Putar 10kΩ (Input ADC)",
      fungsiSlot2: "Mengirim tegangan variabel (0–4095) ke kaki ADC GPIO 34.",
      idGambarSlot2: "potensiometer",
      idGudangValidSlot2: ["potensiometer", "pas_potensio"],
      kataKunciValidSlot2: ["potensiometer"],
      pin1Slot2Label: "1. Pin Tengah (SIG)",
      pin2Slot2Label: "2. Pin VCC Potensio",
      pinEspKeSlot2Pin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#22c55e" },
      pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

      namaTampilSlot3: "LED Merah 5mm (Output PWM Dimmer)",
      fungsiSlot3: "Menyala meredup & menerang halus sesuai nilai PWM (0–255) di GPIO 2.",
      idGambarSlot3: "led_merah",
      idGudangValidSlot3: ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau"],
      kataKunciValidSlot3: ["led merah", "led hijau"],
      pin1Slot3Label: "1. Anoda LED (+)",
      pin2Slot3Label: "2. Katoda LED (GND)",
      pinEspKeSlot3Pin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#facc15" },
      pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

      analogiMudah:
        "Putaran knop Potensiometer 10kΩ di Slot #2 dibaca oleh kaki analog GPIO 34 (0-4095), lalu diubah menjadi sinyal PWM (0-255) ke GPIO 2 untuk mengatur redup-terangnya Lampu LED di Slot #3!",
    };
  }

  // 14. MODUL STRUCT / ESP-NOW / MASTER 10-NODE MULTI-HOP MESH (PROYEK 8 / LEVEL 13, 14, 15, 20)
  return {
    namaTampilSlot2: "Sensor Pupuk NPK & Suhu Kebun",
    fungsiSlot2: "Menghasilkan paket struct data (Suhu, NPK, Baterai, GPS).",
    idGambarSlot2: "sensor_npk",
    idGudangValidSlot2: ["sensor_npk", "sen_npk", "sensor_suhu_dht", "gps_neo6m"],
    kataKunciValidSlot2: ["npk", "dht", "gps"],
    pin1Slot2Label: "1. Pin Data Sensor",
    pin2Slot2Label: "2. Pin VCC Sensor",
    pinEspKeSlot2Pin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
    pinEspKeSlot2Pin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },

    namaTampilSlot3: "NodeMCU / ESP32 Gateway Node #10",
    fungsiSlot3: "Menerima estafet paket ESP-NOW (Hop N+1) & upload ke Cloud Web.",
    idGambarSlot3: "nodemcu_esp8266",
    idGudangValidSlot3: ["nodemcu_esp8266", "esp32_devkit", "esp32_c6", "mcu_gateway10", "layar_oled"],
    kataKunciValidSlot3: ["nodemcu", "esp32", "gateway", "oled"],
    pin1Slot3Label: "1. Jalur Next-Hop (N+1)",
    pin2Slot3Label: "2. Jalur GND Gateway",
    pinEspKeSlot3Pin1: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#facc15" },
    pinEspKeSlot3Pin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },

    analogiMudah:
      "Data dari Sensor Kebun (Suhu, Pupuk NPK, Baterai, & GPS) di Slot #2 dikemas ke dalam struct C++, lalu dikirimkan secara estafet berantai (Multi-Hop Node 1 ➔ ... ➔ Node 10) menuju Gateway Internet di Slot #3!",
  };
}