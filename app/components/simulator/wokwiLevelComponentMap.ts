// app/components/simulator/wokwiLevelComponentMap.ts
import { ExtendedLessonStepIoT } from "./wokwiAcademyBlueprints";

export interface ItemPeriferalDinamis {
  namaTampil: string;
  fungsiSingkat: string;
  idGambar: string;
  idGudangValid: string[];
  kataKunciValid: string[];
  pin1Label: string;
  pin2Label: string;
  pinEspKePin1: { id: string; label: string; warna: string };
  pinEspKePin2: { id: string; label: string; warna: string };
}

export interface KonfigurasiMultiItemLevel {
  analogiMudah: string;
  daftarPeriferal: ItemPeriferalDinamis[]; // Bisa berisi 0, 2, 4, 6, atau 9 periferal (+1 ESP32 = 1, 3, 5, 7, 10 Item!)
}

export function cariSpesifikasiMultiItemSesuaiModul(
  materi: ExtendedLessonStepIoT
): KonfigurasiMultiItemLevel {
  const judul = (materi.judulMateri || "").toLowerCase();

  // ==========================================================================
  // VARIASI 10 ITEM KOMPONEN (1 ESP32 + 9 PERIFERAL LENGKAP!)
  // Untuk Proyek Master 10-Node Multi-Hop Mesh / Stasiun Pertanian Presisi Lengkap
  // ==========================================================================
  if (
    judul.includes("10-node") ||
    judul.includes("multi-hop") ||
    judul.includes("master") ||
    materi.level === 20
  ) {
    return {
      analogiMudah:
        "Inilah proyek puncak dengan 10 Item Komponen sekaligus! Satu papan ESP32 Utama (Slot #1) membaca 5 sensor perkebunan (NPK, GPS, DHT22, Soil, pH Air), dipasok oleh 2 sistem daya (Baterai 18650 & Sensor Tegangan), menampilkan status ke Layar OLED, lalu menembakkan paket estafet ke Node Gateway Internet!",
      daftarPeriferal: [
        {
          namaTampil: "Sensor Pupuk NPK RS485",
          fungsiSingkat: "Mengukur kadar Nitrogen, Fosfor, Kalium tanah.",
          idGambar: "sensor_npk",
          idGudangValid: ["sensor_npk", "sen_npk"],
          kataKunciValid: ["npk", "pupuk"],
          pin1Label: "1. NPK Pin RO",
          pin2Label: "2. NPK Pin GND",
          pinEspKePin1: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#10b981" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Modul Satelit GPS NEO-6M",
          fungsiSingkat: "Mengunci koordinat Latitude & Longitude blok kebun.",
          idGambar: "gps_neo6m",
          idGudangValid: ["gps_neo6m", "sen_gps"],
          kataKunciValid: ["gps", "neo-6m"],
          pin1Label: "1. GPS Pin TX",
          pin2Label: "2. GPS VCC 3.3V",
          pinEspKePin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#38bdf8" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Sensor Suhu & Lembab DHT22",
          fungsiSingkat: "Memantau suhu udara mikro perkebunan.",
          idGambar: "sensor_suhu_dht",
          idGudangValid: ["sensor_suhu_dht", "sen_dht22"],
          kataKunciValid: ["dht22", "sensor suhu"],
          pin1Label: "1. DHT22 Data",
          pin2Label: "2. DHT22 VCC",
          pinEspKePin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#22c55e" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Kelembapan Tanah Soil Probe",
          fungsiSingkat: "Mendeteksi persentase kadar air tanah.",
          idGambar: "kelembapan_tanah",
          idGudangValid: ["kelembapan_tanah", "sen_soil"],
          kataKunciValid: ["kelembapan", "soil"],
          pin1Label: "1. Soil Pin AO",
          pin2Label: "2. Soil Pin GND",
          pinEspKePin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#eab308" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Sensor pH Air (Asam/Basa)",
          fungsiSingkat: "Memeriksa tingkat keasaman air irigasi (pH 0-14).",
          idGambar: "sensor_ph",
          idGudangValid: ["sensor_ph", "sen_ph", "sensor_tds", "sen_tds"],
          kataKunciValid: ["ph air", "tds"],
          pin1Label: "1. pH Probe AO",
          pin2Label: "2. pH Probe GND",
          pinEspKePin1: { id: "ESP_GPIO32", label: "GPIO 32", warna: "#06b6d4" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Socket Baterai Li-Ion 18650",
          fungsiSingkat: "Sumber energi DC mandiri untuk node lapangan.",
          idGambar: "socket_baterai",
          idGudangValid: ["socket_baterai", "pwr_batt18650"],
          kataKunciValid: ["baterai", "18650"],
          pin1Label: "1. Kutub (+) Batt",
          pin2Label: "2. Kutub (-) Batt",
          pinEspKePin1: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Sensor Tegangan 0-25V (INA219)",
          fungsiSingkat: "Mengukur sisa voltase baterai di pin ADC 35.",
          idGambar: "sensor_tegangan",
          idGudangValid: ["sensor_tegangan", "pwr_ina219", "sensor_pzem"],
          kataKunciValid: ["tegangan", "ina219"],
          pin1Label: "1. Pin Volt Out",
          pin2Label: "2. Pin GND Volt",
          pinEspKePin1: { id: "ESP_GPIO35", label: "GPIO 35", warna: "#f59e0b" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Layar OLED I2C 128x64",
          fungsiSingkat: "Menampilkan ringkasan paket telemetri lokal.",
          idGambar: "layar_oled",
          idGudangValid: ["layar_oled", "dsp_oled", "lcd_16x2"],
          kataKunciValid: ["oled", "lcd"],
          pin1Label: "1. OLED Pin SDA",
          pin2Label: "2. OLED Pin GND",
          pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#a855f7" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "NodeMCU / ESP32 Gateway #10",
          fungsiSingkat: "Penerima estafet Multi-Hop & pengunggah ke Cloud Web.",
          idGambar: "nodemcu_esp8266",
          idGudangValid: ["nodemcu_esp8266", "esp32_devkit", "esp32_c6", "mcu_gateway10"],
          kataKunciValid: ["nodemcu", "esp32", "gateway"],
          pin1Label: "1. Next-Hop (N+1)",
          pin2Label: "2. Gateway GND",
          pinEspKePin1: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // ==========================================================================
  // VARIASI 7 ITEM KOMPONEN (1 ESP32 + 6 PERIFERAL!)
  // A. Smart Greenhouse Lengkap (DHT22 + Soil + Hujan + Kipas + Pompa + OLED)
  // ==========================================================================
  if (judul.includes("greenhouse") || judul.includes("dht22")) {
    return {
      analogiMudah:
        "Pada proyek Smart Greenhouse Lengkap ini kamu merakit 7 Item Komponen sekaligus! Ada 1 ESP32 sebagai otak, 3 sensor lingkungan (DHT22, Kelembapan Tanah, Sensor Hujan), 2 aktuator iklim (Kipas DC & Pompa Air), serta 1 Layar OLED pemantau!",
      daftarPeriferal: [
        {
          namaTampil: "Sensor Suhu & Lembab DHT22",
          fungsiSingkat: "Membaca suhu udara rumah kaca di GPIO 15.",
          idGambar: "sensor_suhu_dht",
          idGudangValid: ["sensor_suhu_dht", "sen_dht22"],
          kataKunciValid: ["dht22", "sensor suhu"],
          pin1Label: "1. DHT22 Data",
          pin2Label: "2. DHT22 VCC",
          pinEspKePin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Kelembapan Tanah Soil Probe",
          fungsiSingkat: "Mendeteksi kekeringan tanah di GPIO 34.",
          idGambar: "kelembapan_tanah",
          idGudangValid: ["kelembapan_tanah", "sen_soil"],
          kataKunciValid: ["kelembapan", "soil"],
          pin1Label: "1. Soil Pin AO",
          pin2Label: "2. Soil Pin GND",
          pinEspKePin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#eab308" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Sensor Hujan Raindrop",
          fungsiSingkat: "Mendeteksi tetesan air hujan di atap greenhouse.",
          idGambar: "sensor_hujan",
          idGudangValid: ["sensor_hujan", "sen_rain"],
          kataKunciValid: ["hujan", "rain"],
          pin1Label: "1. Rain Pin DO",
          pin2Label: "2. Rain Pin GND",
          pinEspKePin1: { id: "ESP_GPIO35", label: "GPIO 35", warna: "#38bdf8" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Kipas DC (PWM) Exhaust",
          fungsiSingkat: "Membuang hawa panas saat suhu > 32°C (GPIO 33).",
          idGambar: "kipas_dc",
          idGudangValid: ["kipas_dc", "akt_kipas"],
          kataKunciValid: ["kipas", "fan"],
          pin1Label: "1. Pin Kipas (33)",
          pin2Label: "2. GND Kipas",
          pinEspKePin1: { id: "ESP_GPIO33", label: "GPIO 33", warna: "#8b5cf6" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Pompa Air Mini 5V Irigasi",
          fungsiSingkat: "Menyiram tanaman otomatis lewat GPIO 25.",
          idGambar: "pompa_air",
          idGudangValid: ["pompa_air", "akt_pompa", "relay_2ch", "rel_2ch"],
          kataKunciValid: ["pompa", "relay 2"],
          pin1Label: "1. Pin Pompa (25)",
          pin2Label: "2. GND Pompa",
          pinEspKePin1: { id: "ESP_GPIO25", label: "GPIO 25", warna: "#3b82f6" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Layar OLED I2C Monitor",
          fungsiSingkat: "Menampilkan angka suhu & status penyiraman.",
          idGambar: "layar_oled",
          idGudangValid: ["layar_oled", "dsp_oled", "lcd_16x2"],
          kataKunciValid: ["oled", "lcd"],
          pin1Label: "1. OLED Pin SDA",
          pin2Label: "2. OLED Pin GND",
          pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#f97316" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // B. Otomasi Pabrik PLC 7 Item (ESP32 + Uno Slave + Relay 4-Ch + Servo 360 + Sensor IR + Buzzer + OLED)
  if (judul.includes("relay 4-ch") || judul.includes("plc") || judul.includes("pabrik")) {
    return {
      analogiMudah:
        "Lini produksi pabrik modern ini terdiri dari 7 Item Komponen: ESP32 Master mengoordinasikan Arduino Uno Slave, Modul Relay 4-Channel, Motor Servo Konveyor 360°, Sensor Infrared pendeteksi barang, Buzzer sirine pabrik, dan Layar OLED!",
      daftarPeriferal: [
        {
          namaTampil: "Arduino Uno R3 (Slave PLC)",
          fungsiSingkat: "Koprosesor pengendali I/O mesin industri.",
          idGambar: "arduino_uno",
          idGudangValid: ["arduino_uno", "mcu_uno"],
          kataKunciValid: ["arduino", "uno"],
          pin1Label: "1. Uno RX Serial",
          pin2Label: "2. Uno VCC 5V",
          pinEspKePin1: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#38bdf8" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Modul Relay 4-Channel PLC",
          fungsiSingkat: "Sakelar 4 kontaktor mesin tegangan tinggi.",
          idGambar: "relay_4ch",
          idGudangValid: ["relay_4ch", "rel_4ch"],
          kataKunciValid: ["relay 4", "relay_4ch"],
          pin1Label: "1. Relay IN1 (Pin 4)",
          pin2Label: "2. Relay GND",
          pinEspKePin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#facc15" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Servo MG996R 360° (Konveyor)",
          fungsiSingkat: "Penggerak sabuk ban berjalan pabrik.",
          idGambar: "servo_mg996r",
          idGudangValid: ["servo_mg996r", "akt_servo360", "akt_motor_dc", "servo_sg90"],
          kataKunciValid: ["servo", "motor"],
          pin1Label: "1. PWM Konveyor",
          pin2Label: "2. GND Konveyor",
          pinEspKePin1: { id: "ESP_GPIO13", label: "GPIO 13", warna: "#a855f7" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Sensor Infrared Obstacle",
          fungsiSingkat: "Menghitung jumlah kotak barang yang lewat di konveyor.",
          idGambar: "sensor_ir",
          idGudangValid: ["sensor_ir", "ultrasonik_hcsr04", "sensor_pir"],
          kataKunciValid: ["infrared", "obstacle", "ultrasonik"],
          pin1Label: "1. IR Pin OUT",
          pin2Label: "2. IR Pin GND",
          pinEspKePin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#10b981" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Buzzer Piezo Alarm Pabrik",
          fungsiSingkat: "Berbunyi saat target produksi tercapai.",
          idGambar: "buzzer_piezo",
          idGudangValid: ["buzzer_piezo", "akt_buzzer"],
          kataKunciValid: ["buzzer"],
          pin1Label: "1. Buzzer (+)",
          pin2Label: "2. Buzzer (-)",
          pinEspKePin1: { id: "ESP_GPIO19", label: "GPIO 19", warna: "#ec4899" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "LCD 16x2 / OLED Counter",
          fungsiSingkat: "Menampilkan status ke-4 relay dan jumlah produksi.",
          idGambar: "lcd_16x2",
          idGudangValid: ["lcd_16x2", "dsp_lcd", "layar_oled", "dsp_oled"],
          kataKunciValid: ["lcd", "oled"],
          pin1Label: "1. Display SDA",
          pin2Label: "2. Display GND",
          pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#06b6d4" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // ==========================================================================
  // VARIASI 5 ITEM KOMPONEN (1 ESP32 + 4 PERIFERAL!)
  // A. Lampu Lalu Lintas Lengkap (ESP32 + LED Merah + LED Hijau + LED Kuning + Resistor)
  // ==========================================================================
  if (judul.includes("lalu lintas")) {
    return {
      analogiMudah:
        "Tiang lampu lalu lintas jalan raya memiliki 5 Item Komponen: 1 ESP32 sebagai pengatur waktu, 3 Lampu LED terpisah (Merah untuk Berhenti, Kuning untuk Hati-hati, Hijau untuk Jalan), serta Resistor pembatas arus menuju Ground!",
      daftarPeriferal: [
        {
          namaTampil: "LED Merah 5mm (Lampu STOP)",
          fungsiSingkat: "Menyala pada fase berhenti (GPIO 2).",
          idGambar: "led_merah",
          idGudangValid: ["led_merah", "pas_led_merah"],
          kataKunciValid: ["led merah"],
          pin1Label: "1. Anoda Merah (+)",
          pin2Label: "2. Katoda Merah (-)",
          pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#ef4444" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "LED Hijau 5mm (Lampu JALAN)",
          fungsiSingkat: "Menyala pada fase jalan (GPIO 15).",
          idGambar: "led_hijau",
          idGudangValid: ["led_hijau", "pas_led_hijau"],
          kataKunciValid: ["led hijau"],
          pin1Label: "1. Anoda Hijau (+)",
          pin2Label: "2. Katoda Hijau (-)",
          pinEspKePin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#22c55e" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "LED Indikator Kuning / Kedua",
          fungsiSingkat: "Menyala pada fase transisi hati-hati (GPIO 4).",
          idGambar: "led_merah",
          idGudangValid: ["led_merah", "led_hijau", "pas_led_merah", "pas_led_hijau"],
          kataKunciValid: ["led"],
          pin1Label: "1. Anoda Transisi (+)",
          pin2Label: "2. Katoda Transisi (-)",
          pinEspKePin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#facc15" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Resistor Gelang 220Ω (Pengaman)",
          fungsiSingkat: "Melindungi deretan LED dari arus berlebih.",
          idGambar: "resistor_gelang",
          idGudangValid: ["resistor_gelang", "pas_resistor"],
          kataKunciValid: ["resistor"],
          pin1Label: "1. Kaki 1 Resistor",
          pin2Label: "2. Kaki 2 GND",
          pinEspKePin1: { id: "ESP_3V3", label: "3V3", warna: "#f97316" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // B. Proteksi Bahaya Kebakaran & Gas 5 Item (ESP32 + MQ-2 + Flame Api + Buzzer + Pompa Sprinkler)
  if (judul.includes("mq-2") || judul.includes("gas") || judul.includes("kebakaran") || judul.includes("sprinkler")) {
    return {
      analogiMudah:
        "Sistem keselamatan gedung ini menggabungkan 5 Item Komponen: ESP32 membaca Sensor Gas MQ-2 (Slot #2) dan Sensor Api Flame (Slot #3). Saat terjadi bahaya, ESP32 langsung mengaktifkan Sirine Buzzer (Slot #4) dan Pompa Air Sprinkler (Slot #5)!",
      daftarPeriferal: [
        {
          namaTampil: "Sensor Gas & Asap MQ-2",
          fungsiSingkat: "Mendeteksi kebocoran gas LPG (PPM) di GPIO 32.",
          idGambar: "sensor_mq2",
          idGudangValid: ["sensor_mq2", "sen_mq2", "sensor_mq135"],
          kataKunciValid: ["mq-2", "sensor gas"],
          pin1Label: "1. MQ-2 Pin AO",
          pin2Label: "2. MQ-2 Pin VCC",
          pinEspKePin1: { id: "ESP_GPIO32", label: "GPIO 32", warna: "#f43f5e" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Sensor Api Flame Detector",
          fungsiSingkat: "Mendeteksi radiasi inframerah titik api di GPIO 34.",
          idGambar: "sensor_flame",
          idGudangValid: ["sensor_flame", "sen_flame"],
          kataKunciValid: ["flame", "api"],
          pin1Label: "1. Flame Pin DO",
          pin2Label: "2. Flame Pin GND",
          pinEspKePin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#f97316" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Buzzer Piezo Sirine Darurat",
          fungsiSingkat: "Membunyikan alarm evakuasi gedung di GPIO 19.",
          idGambar: "buzzer_piezo",
          idGudangValid: ["buzzer_piezo", "akt_buzzer"],
          kataKunciValid: ["buzzer"],
          pin1Label: "1. Buzzer Positif (+)",
          pin2Label: "2. Buzzer GND (-)",
          pinEspKePin1: { id: "ESP_GPIO19", label: "GPIO 19", warna: "#ec4899" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Pompa Air Mini Sprinkler",
          fungsiSingkat: "Menyemprotkan air pemadam otomatis di GPIO 25.",
          idGambar: "pompa_air",
          idGudangValid: ["pompa_air", "akt_pompa", "relay_1ch", "rel_1ch"],
          kataKunciValid: ["pompa", "relay"],
          pin1Label: "1. Pin Pompa (25)",
          pin2Label: "2. GND Pompa",
          pinEspKePin1: { id: "ESP_GPIO25", label: "GPIO 25", warna: "#3b82f6" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // C. Smart Door Lock & Palang Pintu 5 Item (ESP32 + RFID RC522 + Servo SG90 + Solenoid 12V + Buzzer)
  if (judul.includes("servo") || judul.includes("solenoid") || judul.includes("rfid") || judul.includes("ultrasonik")) {
    return {
      analogiMudah:
        "Gerbang keamanan pintar ini menggunakan 5 Item Komponen: ESP32 membaca kartu RFID RC522 / Ultrasonik (Slot #2), memutar Palang Motor Servo SG90 (Slot #3), menarik Kunci Besi Solenoid 12V (Slot #4), dan membunyikan Buzzer konfirmasi (Slot #5)!",
      daftarPeriferal: [
        {
          namaTampil: judul.includes("ultrasonik")
            ? "Sensor Ultrasonik HC-SR04"
            : "RFID Card Reader RC522",
          fungsiSingkat: "Mendeteksi kartu akses / jarak kendaraan masuk.",
          idGambar: judul.includes("ultrasonik") ? "ultrasonik_hcsr04" : "rfid_rc522",
          idGudangValid: ["rfid_rc522", "sen_rfid", "ultrasonik_hcsr04", "sen_ultrasonik"],
          kataKunciValid: ["rfid", "ultrasonik"],
          pin1Label: "1. Pin Sinyal Reader",
          pin2Label: "2. Pin VCC 3.3V",
          pinEspKePin1: { id: "ESP_GPIO15", label: "GPIO 15", warna: "#38bdf8" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Motor Servo SG90 180° (Palang)",
          fungsiSingkat: "Memutar lengan palang pintu 90° lewat GPIO 13.",
          idGambar: "servo_sg90",
          idGudangValid: ["servo_sg90", "akt_servo180"],
          kataKunciValid: ["servo"],
          pin1Label: "1. Kabel PWM Servo",
          pin2Label: "2. Kabel GND Servo",
          pinEspKePin1: { id: "ESP_GPIO13", label: "GPIO 13", warna: "#a855f7" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Solenoid Door Lock 12V",
          fungsiSingkat: "Membuka slot kunci besi pintu di GPIO 27.",
          idGambar: "solenoid_lock",
          idGudangValid: ["solenoid_lock", "akt_solenoid", "relay_1ch"],
          kataKunciValid: ["solenoid", "relay"],
          pin1Label: "1. Pin IN Solenoid",
          pin2Label: "2. Pin GND Solenoid",
          pinEspKePin1: { id: "ESP_GPIO27", label: "GPIO 27", warna: "#14b8a6" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Buzzer Piezo Beep Akses",
          fungsiSingkat: "Memberi bunyi beep saat pintu terbuka.",
          idGambar: "buzzer_piezo",
          idGudangValid: ["buzzer_piezo", "akt_buzzer", "led_hijau"],
          kataKunciValid: ["buzzer", "led hijau"],
          pin1Label: "1. Buzzer (+)",
          pin2Label: "2. Buzzer (-)",
          pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#facc15" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // D. Pertukaran Data Multi-MCU / NPK + GPS + Baterai 5 Item
  if (judul.includes("npk") || judul.includes("gps") || judul.includes("baterai") || judul.includes("tegangan") || judul.includes("triple") || judul.includes("struct")) {
    return {
      analogiMudah:
        "Node pertanian presisi ini merakit 5 Item Komponen sekaligus: ESP32 membaca Sensor Pupuk NPK RS485 (Slot #2), mengunci lokasi Satelit GPS NEO-6M (Slot #3), memantau Socket Baterai 18650 (Slot #4), dan mengukur voltase lewat Sensor Tegangan (Slot #5)!",
      daftarPeriferal: [
        {
          namaTampil: "Sensor Pupuk NPK RS485",
          fungsiSingkat: "Membaca unsur hara N-P-K tanah (mg/kg).",
          idGambar: "sensor_npk",
          idGudangValid: ["sensor_npk", "sen_npk"],
          kataKunciValid: ["npk", "pupuk"],
          pin1Label: "1. NPK Pin RO (16)",
          pin2Label: "2. NPK Pin DI (17)",
          pinEspKePin1: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#10b981" },
          pinEspKePin2: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },
        },
        {
          namaTampil: "Modul Satelit GPS NEO-6M",
          fungsiSingkat: "Melacak posisi Latitude & Longitude kebun.",
          idGambar: "gps_neo6m",
          idGudangValid: ["gps_neo6m", "sen_gps"],
          kataKunciValid: ["gps", "neo"],
          pin1Label: "1. GPS Pin TX (4)",
          pin2Label: "2. GPS Pin VCC",
          pinEspKePin1: { id: "ESP_GPIO4", label: "GPIO 4", warna: "#38bdf8" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Socket Baterai Li-Ion 18650",
          fungsiSingkat: "Menyuplai daya DC node di lapangan.",
          idGambar: "socket_baterai",
          idGudangValid: ["socket_baterai", "pwr_batt18650"],
          kataKunciValid: ["baterai", "18650"],
          pin1Label: "1. Baterai Positif (+)",
          pin2Label: "2. Baterai Negatif (-)",
          pinEspKePin1: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
        {
          namaTampil: "Sensor Tegangan 0-25V (INA219)",
          fungsiSingkat: "Mengukur tegangan baterai di pin ADC GPIO 35.",
          idGambar: "sensor_tegangan",
          idGudangValid: ["sensor_tegangan", "pwr_ina219", "sensor_pzem", "layar_oled"],
          kataKunciValid: ["tegangan", "ina219", "pzem", "oled"],
          pin1Label: "1. Pin Volt Out (35)",
          pin2Label: "2. Pin GND Sensor",
          pinEspKePin1: { id: "ESP_GPIO35", label: "GPIO 35", warna: "#f59e0b" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  // ==========================================================================
  // VARIASI 3 ITEM KOMPONEN (1 ESP32 + 2 PERIFERAL)
  // Untuk LDR + Relay, Dual-ESP32 UART + OLED, Potensio + LED
  // ==========================================================================
  if (judul.includes("ldr") || judul.includes("cahaya")) {
    return {
      analogiMudah:
        "Rangkaian 3 Item Komponen: Sensor Cahaya LDR (Slot #2) mengukur gelapnya malam di GPIO 34, lalu ESP32 menyalakan Modul Relay 1-Ch (Slot #3) di GPIO 26!",
      daftarPeriferal: [
        {
          namaTampil: "Sensor Cahaya LDR (Photoresistor)",
          fungsiSingkat: "Membaca intensitas cahaya ke GPIO 34.",
          idGambar: "sensor_ldr",
          idGudangValid: ["sensor_ldr", "sen_ldr"],
          kataKunciValid: ["ldr", "cahaya"],
          pin1Label: "1. Pin AO LDR",
          pin2Label: "2. Pin VCC LDR",
          pinEspKePin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#22c55e" },
          pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
        },
        {
          namaTampil: "Modul Relay 1-Channel 5V",
          fungsiSingkat: "Sakelar otomatis lampu jalan di GPIO 26.",
          idGambar: "relay_1ch",
          idGudangValid: ["relay_1ch", "rel_1ch"],
          kataKunciValid: ["relay 1", "relay_1ch"],
          pin1Label: "1. Pin IN Relay",
          pin2Label: "2. Pin GND Relay",
          pinEspKePin1: { id: "ESP_GPIO26", label: "GPIO 26", warna: "#eab308" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  if (judul.includes("uart") || judul.includes("dual-esp32") || judul.includes("esp-now")) {
    return {
      analogiMudah:
        "Komunikasi 3 Item Komponen: ESP32 #1 mengirim paket data ke ESP32 #2 / NodeMCU (Slot #2) lalu menampilkannya ke Layar OLED I2C (Slot #3)!",
      daftarPeriferal: [
        {
          namaTampil: "Board ESP32 #2 / NodeMCU Receiver",
          fungsiSingkat: "Menerima paket komunikasi dari ESP32 #1.",
          idGambar: "nodemcu_esp8266",
          idGudangValid: ["nodemcu_esp8266", "esp32_devkit", "esp32_c6", "mcu_esp32_node2"],
          kataKunciValid: ["nodemcu", "esp32"],
          pin1Label: "1. Pin RX2 Penerima",
          pin2Label: "2. Pin TX2 Pengirim",
          pinEspKePin1: { id: "ESP_GPIO17", label: "TX2 (17)", warna: "#f97316" },
          pinEspKePin2: { id: "ESP_GPIO16", label: "RX2 (16)", warna: "#06b6d4" },
        },
        {
          namaTampil: "Layar OLED I2C 128x64",
          fungsiSingkat: "Menampilkan pesan yang diterima.",
          idGambar: "layar_oled",
          idGudangValid: ["layar_oled", "dsp_oled", "lcd_16x2"],
          kataKunciValid: ["oled", "lcd"],
          pin1Label: "1. Pin VCC OLED",
          pin2Label: "2. Pin GND OLED",
          pinEspKePin1: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
          pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
        },
      ],
    };
  }

  return {
    analogiMudah:
      "Putaran knop Potensiometer 10kΩ di Slot #2 dibaca oleh pin ADC GPIO 34, lalu mengatur kecerahan PWM Lampu LED di Slot #3!",
    daftarPeriferal: [
      {
        namaTampil: "Potensiometer Putar 10kΩ",
        fungsiSingkat: "Mengirim nilai tegangan analog (0-4095) ke GPIO 34.",
        idGambar: "potensiometer",
        idGudangValid: ["potensiometer", "pas_potensio"],
        kataKunciValid: ["potensiometer"],
        pin1Label: "1. Pin Tengah (SIG)",
        pin2Label: "2. Pin VCC Potensio",
        pinEspKePin1: { id: "ESP_GPIO34", label: "GPIO 34", warna: "#22c55e" },
        pinEspKePin2: { id: "ESP_3V3", label: "3V3", warna: "#ef4444" },
      },
      {
        namaTampil: "LED Merah 5mm (Output PWM)",
        fungsiSingkat: "Menyala redup-terang sesuai nilai PWM di GPIO 2.",
        idGambar: "led_merah",
        idGudangValid: ["led_merah", "led_hijau", "pas_led_merah"],
        kataKunciValid: ["led merah", "led hijau"],
        pin1Label: "1. Anoda LED (+)",
        pin2Label: "2. Katoda LED (-)",
        pinEspKePin1: { id: "ESP_GPIO2", label: "GPIO 2", warna: "#facc15" },
        pinEspKePin2: { id: "ESP_GND", label: "GND", warna: "#64748b" },
      },
    ],
  };
}