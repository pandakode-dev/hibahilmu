// app/components/simulator/pinoutDefinitions.ts

export interface TitikPinFisik {
  idPin: string;
  nomorPin: number;
  nama: string;
  x: number;
  y: number;
  sisi: "kiri" | "kanan" | "atas" | "bawah";
  kategori: "POWER" | "GND" | "GPIO" | "ADC" | "UART" | "I2C" | "SPI" | "PWM" | "PASIF";
  keterangan: string;
}

export interface LayoutFisikKomponen {
  lebar: number;
  tinggi: number;
  fungsiUtama: string;
  pins: TitikPinFisik[];
}

export interface KonfigurasiRentangKomponen {
  punyaSlider: boolean;
  labelParameter: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  satuan: string;
  catatanFisik: string;
}

export function ambilKonfigurasiRentangKomponen(tipe: string): KonfigurasiRentangKomponen {
  switch (tipe) {
    case "dht22":
      return {
        punyaSlider: true,
        labelParameter: "Suhu Lingkungan (DHT22)",
        min: -40,
        max: 80,
        step: 0.5,
        defaultVal: 28.5,
        satuan: "°C",
        catatanFisik: "Rentang asli sensor DHT22/AM2302: -40°C hingga +80°C (4 Kaki: VCC, DATA, NC, GND).",
      };
    case "gps_neo6m":
      return {
        punyaSlider: true,
        labelParameter: "Jumlah Satelit GPS Terkunci & Kecepatan (NEO-6M)",
        min: 0,
        max: 120,
        step: 1,
        defaultVal: 45,
        satuan: "km/h",
        catatanFisik: "Mengirimkan kalimat NMEA ($GPGGA, $GPRMC) melalui pin TXD (9600 bps) berisi koordinat Latitude, Longitude & Kecepatan.",
      };
    case "battery_socket":
      return {
        punyaSlider: true,
        labelParameter: "Tegangan Socket Baterai 2x 18650 Li-Ion",
        min: 3.0,
        max: 12.6,
        step: 0.1,
        defaultVal: 8.4,
        satuan: "Volt",
        catatanFisik: "1x 18650 = 3.7V–4.2V | 2x Seri 18650 = 7.4V–8.4V | 3x Seri = 12.6V. Hubungkan ke VIN atau ke terminal atas Sensor Tegangan!",
      };
    case "voltage_sensor":
      return {
        punyaSlider: true,
        labelParameter: "Tegangan Terukur pada Sensor Tegangan (0–25V DC)",
        min: 0,
        max: 25,
        step: 0.1,
        defaultVal: 8.4,
        satuan: "Volt",
        catatanFisik: "Pembagi tegangan R1=30kΩ & R2=7.5kΩ (Rasio 5:1) sehingga tegangan input hingga 25V aman dibaca oleh ADC 3.3V/5V ESP32.",
      };
    case "ultrasonik":
      return {
        punyaSlider: true,
        labelParameter: "Jarak Objek di Depan Sonar (HC-SR04)",
        min: 2,
        max: 400,
        step: 1,
        defaultVal: 45,
        satuan: "cm",
        catatanFisik: "Rentang ukur gelombang ultrasonik 40 kHz: 2 cm hingga 400 cm (4 meter).",
      };
    case "ldr_sensor":
      return {
        punyaSlider: true,
        labelParameter: "Intensitas Cahaya (LDR Photoresistor)",
        min: 0,
        max: 1000,
        step: 10,
        defaultVal: 450,
        satuan: "Lux",
        catatanFisik: "0 Lux (Gelap Malam) s/d 1000 Lux (Terang Siang).",
      };
    case "mq2_gas":
      return {
        punyaSlider: true,
        labelParameter: "Konsentrasi Gas & Asap LPG (MQ-2)",
        min: 100,
        max: 10000,
        step: 50,
        defaultVal: 350,
        satuan: "ppm",
        catatanFisik: "Rentang deteksi gas LPG/Propana/Asap: 100 ppm s/d 10.000 ppm.",
      };
    case "soil_moisture":
    case "rain_sensor":
    case "water_level":
      return {
        punyaSlider: true,
        labelParameter:
          tipe === "soil_moisture"
            ? "Kelembapan Tanah (Soil Moisture)"
            : tipe === "rain_sensor"
            ? "Intensitas Curah Hujan (Raindrop)"
            : "Tinggi Permukaan Air (Water Level)",
        min: 0,
        max: 100,
        step: 1,
        defaultVal: 65,
        satuan: "%",
        catatanFisik: "0% (Kering Total) hingga 100% (Basah / Terendam Penuh).",
      };
    case "ir_obstacle":
      return {
        punyaSlider: true,
        labelParameter: "Jarak Halangan Infrared (IR Obstacle)",
        min: 2,
        max: 30,
        step: 1,
        defaultVal: 8,
        satuan: "cm",
        catatanFisik: "Jarak deteksi pantulan sinar inframerah efektif: 2 cm s/d 30 cm.",
      };
    case "flame_sensor":
      return {
        punyaSlider: true,
        labelParameter: "Intensitas Radiasi Api (Flame KY-026)",
        min: 0,
        max: 100,
        step: 1,
        defaultVal: 80,
        satuan: "%",
        catatanFisik: "Mendeteksi panjang gelombang cahaya api 760 nm – 1100 nm.",
      };
    case "pir_sensor":
      return {
        punyaSlider: true,
        labelParameter: "Posisi Melintas Orang di Zona PIR",
        min: -60,
        max: 60,
        step: 1,
        defaultVal: 0,
        satuan: "° FOV",
        catatanFisik: "Sudut deteksi lensa Fresnel PIR: -60° (Kiri) s/d +60° (Kanan).",
      };
    case "potensiometer":
      return {
        punyaSlider: true,
        labelParameter: "Putaran Potensiometer (ADC 12-Bit)",
        min: 0,
        max: 4095,
        step: 15,
        defaultVal: 2048,
        satuan: "ADC",
        catatanFisik: "Resolusi ADC ESP32 / ESP32-C6: 0 (0.0V) hingga 4095 (3.3V).",
      };
    case "servo":
      return {
        punyaSlider: true,
        labelParameter: "Sudut Motor Servo Positional (SG90 180°)",
        min: 0,
        max: 180,
        step: 1,
        defaultVal: 90,
        satuan: "°",
        catatanFisik: "Servo standar bergerak menuju sudut target antara 0° hingga 180°.",
      };
    case "servo_360":
      return {
        punyaSlider: true,
        labelParameter: "Kecepatan & Arah Servo 360° (Continuous)",
        min: -100,
        max: 100,
        step: 5,
        defaultVal: 60,
        satuan: "% RPM",
        catatanFisik: "-100% (Putar Kiri/CCW), 0% (Stop), +100% (Putar Kanan/CW).",
      };
    case "kipas_dc":
    case "dc_motor":
      return {
        punyaSlider: true,
        labelParameter: "Duty Cycle PWM Kecepatan Motor (8-Bit)",
        min: 0,
        max: 255,
        step: 5,
        defaultVal: 200,
        satuan: "PWM",
        catatanFisik: "Kendali kecepatan PWM: 0 (Berhenti) hingga 255 (Kecepatan Penuh).",
      };
    case "vcc_dc":
      return {
        punyaSlider: true,
        labelParameter: "Tegangan Catu Daya DC (Power Supply)",
        min: 3,
        max: 24,
        step: 0.5,
        defaultVal: 12,
        satuan: "Volt",
        catatanFisik: "Sumber tegangan DC variabel 3.0V – 24.0V.",
      };
    case "ac_source":
      return {
        punyaSlider: true,
        labelParameter: "Frekuensi Gelombang Sinyal AC",
        min: 10,
        max: 500,
        step: 5,
        defaultVal: 50,
        satuan: "Hz",
        catatanFisik: "Frekuensi sumber arus bolak-balik (Standar PLN = 50 Hz).",
      };
    case "kapasitor":
      return {
        punyaSlider: true,
        labelParameter: "Kapasitansi Kapasitor Elektrolit",
        min: 1,
        max: 1000,
        step: 10,
        defaultVal: 100,
        satuan: "μF",
        catatanFisik: "Kapasitansi penyimpan muatan listrik dalam mikroFarad (μF).",
      };
    case "induktor":
      return {
        punyaSlider: true,
        labelParameter: "Induktansi Kumparan Induktor",
        min: 1,
        max: 500,
        step: 5,
        defaultVal: 25,
        satuan: "mH",
        catatanFisik: "Induktansi kumparan dalam miliHenry (mH).",
      };
    case "solenoid_lock":
    case "water_pump":
    case "relay_1ch":
    case "relay_2ch":
    case "relay_4ch":
    case "led_hijau":
    case "led_merah":
    case "led_kuning":
    case "buzzer":
    case "push_button":
    case "rfid_rc522":
      return {
        punyaSlider: false,
        labelParameter: "Status Aktuator / Sakelar Digital (ON / OFF)",
        min: 0,
        max: 1,
        step: 1,
        defaultVal: 1,
        satuan: "Digital",
        catatanFisik: "Komponen bekerja dengan dua keadaan logika digital: HIGH (ON / Aktif) atau LOW (OFF / Mati).",
      };
    default:
      return {
        punyaSlider: true,
        labelParameter: "Parameter Blok / Komponen",
        min: 0,
        max: 100,
        step: 1,
        defaultVal: 50,
        satuan: "Unit",
        catatanFisik: "Atur nilai parameter kerja komponen.",
      };
  }
}

export function warnaTitikPin(kategori: TitikPinFisik["kategori"]): string {
  switch (kategori) {
    case "POWER":
      return "#ef4444";
    case "GND":
      return "#64748b";
    case "UART":
      return "#22c55e";
    case "I2C":
      return "#a855f7";
    case "PWM":
      return "#facc15";
    case "ADC":
      return "#f97316";
    case "SPI":
      return "#06b6d4";
    default:
      return "#38bdf8";
  }
}

// ============================================================================
// PINOUT FISIK ESP32-C6-DEVKITC-1 (RISC-V WI-FI 6 / ZIGBEE / THREAD - 30 PIN)
// ============================================================================
const ESP32_C6_PINS_KIRI: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "3V3", nama: "3V3 (+3.3V Out)", kategori: "POWER", keterangan: "Sumber daya +3.3V DC untuk sensor & GPS NEO-6M" },
  { idPin: "RST", nama: "RST (EN / Reset)", kategori: "GPIO", keterangan: "Tombol & Pin Reset Chip ESP32-C6" },
  { idPin: "GPIO0", nama: "GPIO0 (ADC1_CH0 / XTAL)", kategori: "ADC", keterangan: "Input Analog ADC (Cocok untuk Pin S Sensor Tegangan!)" },
  { idPin: "GPIO1", nama: "GPIO1 (ADC1_CH1)", kategori: "ADC", keterangan: "Input Analog ADC 12-bit (Sensor LDR / Soil)" },
  { idPin: "GPIO2", nama: "GPIO2 (ADC1_CH2 / FSPI)", kategori: "ADC", keterangan: "Input Analog ADC & Strapping Pin" },
  { idPin: "GPIO3", nama: "GPIO3 (ADC1_CH3)", kategori: "ADC", keterangan: "Input Analog ADC & Digital GPIO" },
  { idPin: "GPIO4", nama: "GPIO4 (ADC1_CH4 / RX1)", kategori: "UART", keterangan: "UART1 RX ← Hubungkan ke Pin TXD Modul GPS NEO-6M!" },
  { idPin: "GPIO5", nama: "GPIO5 (ADC1_CH5 / TX1)", kategori: "UART", keterangan: "UART1 TX → Hubungkan ke Pin RXD Modul GPS NEO-6M!" },
  { idPin: "GPIO6", nama: "GPIO6 (I2C SDA / ADC1_CH6)", kategori: "I2C", keterangan: "Jalur Data I2C (SDA) untuk OLED/LCD" },
  { idPin: "GPIO7", nama: "GPIO7 (I2C SCL / SPI)", kategori: "I2C", keterangan: "Jalur Clock I2C (SCL) untuk OLED/LCD" },
  { idPin: "GPIO10", nama: "GPIO10 (Digital I/O)", kategori: "GPIO", keterangan: "Pin Digital I/O Serbaguna (Trigger Relay IN1)" },
  { idPin: "GPIO11", nama: "GPIO11 (Digital I/O)", kategori: "GPIO", keterangan: "Pin Digital I/O Serbaguna (Trigger Relay IN2)" },
  { idPin: "GPIO12", nama: "GPIO12 (USB_D- /TRIG)", kategori: "GPIO", keterangan: "Pin Digital I/O (Trigger Ultrasonik)" },
  { idPin: "GPIO13", nama: "GPIO13 (USB_D+ / ECHO)", kategori: "GPIO", keterangan: "Pin Digital I/O (Echo Ultrasonik)" },
  { idPin: "GND_L", nama: "GND (Ground Kiri)", kategori: "GND", keterangan: "Referensi Ground 0V" },
];

const ESP32_C6_PINS_KANAN: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "5V", nama: "5V / VBUS (Input Baterai)", kategori: "POWER", keterangan: "Catu daya +5V DC (Hubungkan ke Socket Baterai / Regulator)" },
  { idPin: "GPIO16", nama: "TX0 (GPIO16 / U0TXD)", kategori: "UART", keterangan: "UART0 Transmit bawaan" },
  { idPin: "GPIO17", nama: "RX0 (GPIO17 / U0RXD)", kategori: "UART", keterangan: "UART0 Receive bawaan" },
  { idPin: "GPIO18", nama: "GPIO18 (PWM / Servo)", kategori: "PWM", keterangan: "Output LEDC PWM untuk Motor Servo 180°/360°" },
  { idPin: "GPIO19", nama: "GPIO19 (SPI CLK)", kategori: "SPI", keterangan: "FSPI Clock & Digital I/O" },
  { idPin: "GPIO20", nama: "GPIO20 (SPI MISO)", kategori: "SPI", keterangan: "FSPI MISO & Digital I/O" },
  { idPin: "GPIO21", nama: "GPIO21 (SPI MOSI)", kategori: "SPI", keterangan: "FSPI MOSI & Digital I/O" },
  { idPin: "GPIO22", nama: "GPIO22 (SPI CS / RFID)", kategori: "SPI", keterangan: "FSPI Chip Select untuk RFID RC522" },
  { idPin: "GPIO23", nama: "GPIO23 (DHT22 DATA)", kategori: "GPIO", keterangan: "Pin Digital One-Wire → Hubungkan ke DATA Sensor DHT22!" },
  { idPin: "GPIO15", nama: "GPIO15 (JTAG / PWM)", kategori: "PWM", keterangan: "Pin PWM & Digital I/O" },
  { idPin: "GPIO14", nama: "GPIO14 (Output Buzzer)", kategori: "GPIO", keterangan: "Digital Output untuk Buzzer / LED" },
  { idPin: "GPIO9", nama: "GPIO9 (BOOT Button)", kategori: "GPIO", keterangan: "Tombol Boot & Strapping Pin" },
  { idPin: "GPIO8", nama: "GPIO8 (Built-in RGB LED)", kategori: "PWM", keterangan: "Mengendalikan LED NeoPixel RGB WS2812 bawaan papan ESP32-C6" },
  { idPin: "GND_R1", nama: "GND (Ground Kanan 1)", kategori: "GND", keterangan: "Referensi Ground 0V" },
  { idPin: "GND_R2", nama: "GND (Ground Kanan 2)", kategori: "GND", keterangan: "Referensi Ground 0V" },
];

const ESP32_PINS_KIRI: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "EN", nama: "EN (Reset)", kategori: "GPIO", keterangan: "Enable / Reset Chip ESP32" },
  { idPin: "GPIO36", nama: "VP (GPIO36 / ADC0)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH0" },
  { idPin: "GPIO39", nama: "VN (GPIO39 / ADC3)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH3" },
  { idPin: "GPIO34", nama: "D34 (GPIO34 / ADC6)", kategori: "ADC", keterangan: "Input Analog (Sensor Tegangan / LDR / Soil / MQ2)" },
  { idPin: "GPIO35", nama: "D35 (GPIO35 / ADC7)", kategori: "ADC", keterangan: "Input Analog Sensor" },
  { idPin: "GPIO32", nama: "D32 (GPIO32 / Relay IN1)", kategori: "GPIO", keterangan: "Output Pemicu Modul Relay IN1" },
  { idPin: "GPIO33", nama: "D33 (GPIO33 / Relay IN2)", kategori: "GPIO", keterangan: "Output Pemicu Modul Relay IN2 / Kipas" },
  { idPin: "GPIO25", nama: "D25 (GPIO25 / Relay IN3)", kategori: "GPIO", keterangan: "Output Pemicu Modul Relay IN3 / DAC1" },
  { idPin: "GPIO26", nama: "D26 (GPIO26 / Relay IN4)", kategori: "GPIO", keterangan: "Output Pemicu Modul Relay IN4 / DAC2" },
  { idPin: "GPIO27", nama: "D27 (GPIO27 / PWM)", kategori: "PWM", keterangan: "Digital I/O & Servo / Buzzer" },
  { idPin: "GPIO14", nama: "D14 (GPIO14 / HSPI_CLK)", kategori: "SPI", keterangan: "Digital I/O & PWM" },
  { idPin: "GPIO12", nama: "D12 (GPIO12 / TRIG)", kategori: "GPIO", keterangan: "Trigger Ultrasonik HC-SR04" },
  { idPin: "GPIO13", nama: "D13 (GPIO13 / ECHO)", kategori: "GPIO", keterangan: "Echo Ultrasonik HC-SR04" },
  { idPin: "GND_L", nama: "GND (Ground Kiri)", kategori: "GND", keterangan: "Referensi Ground 0V" },
  { idPin: "VIN", nama: "VIN (Input/Out +5V)", kategori: "POWER", keterangan: "Tegangan +5V DC untuk VCC Modul Relay & Sensor" },
];

const ESP32_PINS_KANAN: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "GPIO23", nama: "D23 (GPIO23 / MOSI)", kategori: "SPI", keterangan: "VSPI MOSI (Ke MOSI RFID RC522)" },
  { idPin: "GPIO22", nama: "D22 (GPIO22 / I2C SCL)", kategori: "I2C", keterangan: "Jalur Clock I2C → Ke SCL OLED/LCD" },
  { idPin: "GPIO1", nama: "TX0 (GPIO1 / UART0 TX)", kategori: "UART", keterangan: "Serial0 Transmit" },
  { idPin: "GPIO3", nama: "RX0 (GPIO3 / UART0 RX)", kategori: "UART", keterangan: "Serial0 Receive" },
  { idPin: "GPIO21", nama: "D21 (GPIO21 / I2C SDA)", kategori: "I2C", keterangan: "Jalur Data I2C → Ke SDA OLED/LCD" },
  { idPin: "GPIO19", nama: "D19 (GPIO19 / MISO)", kategori: "SPI", keterangan: "VSPI MISO (Ke MISO RFID RC522)" },
  { idPin: "GPIO18", nama: "D18 (GPIO18 / SERVO PWM)", kategori: "PWM", keterangan: "Output PWM Motor Servo (180° / 360°)" },
  { idPin: "GPIO5", nama: "D5 (GPIO5 / SS RFID / Relay)", kategori: "SPI", keterangan: "VSPI CS/SDA RFID atau Trigger Relay" },
  { idPin: "GPIO17", nama: "TX2 (GPIO17 / UART2 TX)", kategori: "UART", keterangan: "UART2 TX → Ke RXD GPS NEO-6M atau D0(RX) Arduino" },
  { idPin: "GPIO16", nama: "RX2 (GPIO16 / UART2 RX)", kategori: "UART", keterangan: "UART2 RX ← Dari TXD GPS NEO-6M atau D1(TX) Arduino" },
  { idPin: "GPIO4", nama: "D4 (GPIO4 / PIR / IR)", kategori: "GPIO", keterangan: "Input Sensor PIR / Infrared / Flame" },
  { idPin: "GPIO2", nama: "D2 (GPIO2 / Built-in LED)", kategori: "GPIO", keterangan: "LED Internal & Output Indikator" },
  { idPin: "GPIO15", nama: "D15 (GPIO15 / DHT22 DATA)", kategori: "GPIO", keterangan: "Pin DATA Sensor Suhu DHT22" },
  { idPin: "GND_R", nama: "GND (Ground Kanan)", kategori: "GND", keterangan: "Referensi Ground 0V" },
  { idPin: "3V3", nama: "3V3 (Output +3.3V)", kategori: "POWER", keterangan: "Sumber daya +3.3V DC" },
];

const ARDUINO_PINS_ATAS: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "SCL", nama: "SCL (A5 / I2C Clock)", kategori: "I2C", keterangan: "Clock I2C → Ke SCL LCD/OLED" },
  { idPin: "SDA", nama: "SDA (A4 / I2C Data)", kategori: "I2C", keterangan: "Data I2C → Ke SDA LCD/OLED" },
  { idPin: "AREF", nama: "AREF", kategori: "ADC", keterangan: "Referensi Tegangan Analog" },
  { idPin: "GND_TOP", nama: "GND (Atas)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "D13", nama: "D13 (SCK / LED)", kategori: "SPI", keterangan: "Digital I/O 13 & SPI Clock" },
  { idPin: "D12", nama: "D12 (MISO / ECHO)", kategori: "SPI", keterangan: "Digital I/O 12" },
  { idPin: "D11", nama: "D11 (~PWM / MOSI)", kategori: "PWM", keterangan: "Output PWM Motor/Kipas & SPI MOSI" },
  { idPin: "D10", nama: "D10 (~PWM / SS)", kategori: "PWM", keterangan: "Output PWM & SPI SS" },
  { idPin: "D9", nama: "D9 (~PWM Servo)", kategori: "PWM", keterangan: "Pin PWM Motor Servo 180°/360°" },
  { idPin: "D8", nama: "D8 (TRIG Ultrasonik)", kategori: "GPIO", keterangan: "Digital I/O 8" },
  { idPin: "D7", nama: "D7 (Trigger Relay IN)", kategori: "GPIO", keterangan: "Output Pemicu Modul Relay (Solenoid/Pompa)" },
  { idPin: "D4", nama: "D4 (Sensor IR / Flame)", kategori: "GPIO", keterangan: "Input Digital Sensor IR / Api" },
  { idPin: "D1_TX", nama: "D1 (TX - Transmit)", kategori: "UART", keterangan: "UART TX → Ke RX2 (GPIO16) ESP32" },
  { idPin: "D0_RX", nama: "D0 (RX - Receive)", kategori: "UART", keterangan: "UART RX ← Dari TX2 (GPIO17) ESP32 / TXD GPS" },
];

const ARDUINO_PINS_BAWAH: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "IOREF", nama: "IOREF (5V)", kategori: "POWER", keterangan: "Referensi Tegangan Operasi" },
  { idPin: "RESET", nama: "RESET", kategori: "GPIO", keterangan: "Pin Reset" },
  { idPin: "3V3", nama: "3.3V Out", kategori: "POWER", keterangan: "Catu daya +3.3V DC" },
  { idPin: "5V", nama: "5V Out (VCC Utama)", kategori: "POWER", keterangan: "Catu daya +5V DC" },
  { idPin: "GND_1", nama: "GND (Ground 1)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "GND_2", nama: "GND (Ground 2)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "VIN", nama: "VIN (Input 7-12V)", kategori: "POWER", keterangan: "Input Tegangan dari Socket Baterai 18650" },
  { idPin: "A0", nama: "A0 (ADC Sensor Tegangan/LDR)", kategori: "ADC", keterangan: "ADC 10-bit untuk Pin S Sensor Tegangan / LDR" },
  { idPin: "A1", nama: "A1 (ADC Soil / Rain)", kategori: "ADC", keterangan: "ADC 10-bit untuk Kelembapan Tanah / Hujan" },
  { idPin: "A2", nama: "A2 (ADC Water / MQ2)", kategori: "ADC", keterangan: "ADC 10-bit untuk Tinggi Air / Gas" },
  { idPin: "A3", nama: "A3 (Analog Input 3)", kategori: "ADC", keterangan: "ADC 10-bit" },
  { idPin: "A4", nama: "A4 (SDA)", kategori: "I2C", keterangan: "Jalur I2C SDA" },
  { idPin: "A5", nama: "A5 (SCL)", kategori: "I2C", keterangan: "Jalur I2C SCL" },
  { idPin: "D2", nama: "D2 (INT0 / DHT22)", kategori: "GPIO", keterangan: "Pin DATA DHT22 / Interrupt" },
];

export function ambilLayoutFisikKomponen(tipe: string): LayoutFisikKomponen {
  // 1. ESP32-C6 DevKitC-1 (30 Pin Fisik: 15 Kiri & 15 Kanan)
  if (tipe === "esp32_c6") {
    const pinsKiri: TitikPinFisik[] = ESP32_C6_PINS_KIRI.map((p, i) => ({
      ...p,
      nomorPin: i + 1,
      x: 8,
      y: 26 + i * 13,
      sisi: "kiri",
    }));
    const pinsKanan: TitikPinFisik[] = ESP32_C6_PINS_KANAN.map((p, i) => ({
      ...p,
      nomorPin: 16 + i,
      x: 152,
      y: 26 + i * 13,
      sisi: "kanan",
    }));
    return {
      lebar: 160,
      tinggi: 225,
      fungsiUtama:
        "ESP32-C6-DevKitC-1 (32-bit RISC-V 160MHz dengan Wi-Fi 6 802.11ax, Bluetooth 5 LE, Zigbee & Thread 802.15.4, serta LED RGB WS2812 di GPIO8).",
      pins: [...pinsKiri, ...pinsKanan],
    };
  }

  // 2. ESP32 DevKit V1 & NodeMCU (30 Pin)
  if (tipe === "esp32" || tipe === "esp8266_nodemcu") {
    const pinsKiri: TitikPinFisik[] = ESP32_PINS_KIRI.map((p, i) => ({
      ...p,
      nomorPin: i + 1,
      x: 8,
      y: 26 + i * 13,
      sisi: "kiri",
    }));
    const pinsKanan: TitikPinFisik[] = ESP32_PINS_KANAN.map((p, i) => ({
      ...p,
      nomorPin: 16 + i,
      x: 152,
      y: 26 + i * 13,
      sisi: "kanan",
    }));
    return {
      lebar: 160,
      tinggi: 225,
      fungsiUtama:
        tipe === "esp32"
          ? "ESP32 DevKit V1 (30 Pin: 15 Kiri & 15 Kanan) mendukung WiFi, Blynk, Telegram Bot & Dual-UART."
          : "NodeMCU ESP8266 (30 Pin) WiFi IoT Microcontroller.",
      pins: [...pinsKiri, ...pinsKanan],
    };
  }

  // 3. MODUL GPS NEO-6M U-BLOX (5 PIN KAKI ASLI DI BAWAH: PPS, RXD, TXD, GND, VCC)
  if (tipe === "gps_neo6m") {
    const gpsPins = [
      {
        idPin: "PPS",
        nama: "Pin 1: PPS (Pulse Per Second)",
        kat: "PWM" as const,
        ket: "Output detak sinkronisasi satelit 1Hz (Opsional ke GPIO digital)",
      },
      {
        idPin: "RXD",
        nama: "Pin 2: RXD (Serial Receive GPS)",
        kat: "UART" as const,
        ket: "Hubungkan silang ke Pin TX2 (GPIO17 ESP32 / GPIO5 ESP32-C6)!",
      },
      {
        idPin: "TXD",
        nama: "Pin 3: TXD (Serial Transmit GPS)",
        kat: "UART" as const,
        ket: "Mengirim data koordinat NMEA → Hubungkan ke Pin RX2 (GPIO16 ESP32 / GPIO4 ESP32-C6)!",
      },
      {
        idPin: "GND",
        nama: "Pin 4: GND (Ground 0V)",
        kat: "GND" as const,
        ket: "Hubungkan ke pin GND mikrokontroler",
      },
      {
        idPin: "VCC",
        nama: "Pin 5: VCC (3.3V - 5V DC)",
        kat: "POWER" as const,
        ket: "Hubungkan ke pin 3V3 atau 5V pada ESP32 / ESP32-C6",
      },
    ];
    return {
      lebar: 145,
      tinggi: 115,
      fungsiUtama:
        "Modul Navigasi Satelit GPS u-blox NEO-6M dengan Antena Keramik Patch Aktif & EEPROM (5 Pin Bawah: PPS, RXD, TXD, GND, VCC).",
      pins: gpsPins.map((p, i) => ({
        idPin: p.idPin,
        nomorPin: i + 1,
        nama: p.nama,
        x: 25 + i * 24,
        y: 108,
        sisi: "bawah",
        kategori: p.kat,
        keterangan: p.ket,
      })),
    };
  }

  // 4. SENSOR TEGANGAN DC 0-25V (5 PIN ASLI: 2 TERMINAL SEKRUP ATAS + 3 PIN HEADER BAWAH)
  if (tipe === "voltage_sensor") {
    return {
      lebar: 120,
      tinggi: 112,
      fungsiUtama:
        "Modul Sensor Tegangan DC 0–25V (Voltage Divider R1=30kΩ & R2=7.5kΩ): 2 Terminal Sekrup Biru di Atas (VCC_IN & GND_IN dari Baterai) dan 3 Pin Header di Bawah (S, +, -) menuju ADC Mikrokontroler.",
      pins: [
        // 2 Terminal Sekrup Input Sumber Tegangan di Atas
        {
          idPin: "VCC_IN",
          nomorPin: 1,
          nama: "VCC (Terminal Input Positif 0–25V DC)",
          x: 38,
          y: 10,
          sisi: "atas",
          kategori: "POWER",
          keterangan: "Hubungkan ke Kabel Merah (BAT+) dari Socket Baterai 18650 atau Power Supply yang ingin diukur!",
        },
        {
          idPin: "GND_IN",
          nomorPin: 2,
          nama: "GND (Terminal Input Negatif 0V)",
          x: 82,
          y: 10,
          sisi: "atas",
          kategori: "GND",
          keterangan: "Hubungkan ke Kabel Hitam (BAT-) dari Socket Baterai!",
        },
        // 3 Pin Header Output ke Mikrokontroler di Bawah (S, +, -)
        {
          idPin: "SIG",
          nomorPin: 3,
          nama: "Pin S (Signal Output Analog 0–3.3V/5V)",
          x: 32,
          y: 104,
          sisi: "bawah",
          kategori: "ADC",
          keterangan: "Output pembagi tegangan (Vin / 5) → Hubungkan ke Pin ADC (GPIO34 ESP32 / GPIO0 ESP32-C6 / A0 Arduino)!",
        },
        {
          idPin: "PLUS_NC",
          nomorPin: 4,
          nama: "Pin + (VCC Referensi / Opsional)",
          x: 60,
          y: 104,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Opsional ke 3.3V/5V atau dibiarkan kosong",
        },
        {
          idPin: "MINUS_GND",
          nomorPin: 5,
          nama: "Pin - (GND Output ke MCU)",
          x: 88,
          y: 104,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Wajib dihubungkan ke pin GND pada ESP32 / ESP32-C6 / Arduino!",
        },
      ],
    };
  }

  // 5. SOCKET BATERAI 2x 18650 LI-ION (2 KABEL KELUARAN DI BAWAH: BAT+ MERAH & BAT- HITAM)
  if (tipe === "battery_socket") {
    return {
      lebar: 135,
      tinggi: 105,
      fungsiUtama:
        "Socket Holder Baterai 2x 18650 Li-Ion (7.4V – 8.4V DC) dilengkapi sakelar ON/OFF. Memiliki 2 kabel keluaran di bagian bawah: Kabel Merah (BAT+) dan Kabel Hitam (BAT-).",
      pins: [
        {
          idPin: "BAT_POS",
          nomorPin: 1,
          nama: "BAT+ (Kabel Merah Positif +3.7V..12V)",
          x: 42,
          y: 98,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Hubungkan ke Terminal VCC_IN Sensor Tegangan, Terminal COM Relay, atau Pin VIN/5V Mikrokontroler!",
        },
        {
          idPin: "BAT_NEG",
          nomorPin: 2,
          nama: "BAT- (Kabel Hitam Negatif GND 0V)",
          x: 94,
          y: 98,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Hubungkan ke Terminal GND_IN Sensor Tegangan & Pin GND Mikrokontroler (Common Ground)!",
        },
      ],
    };
  }

  // 6. STM32 BluePill & Raspberry Pi Pico (32 Pin)
  if (tipe === "stm32_bluepill" || tipe === "raspberry_pico") {
    const kiri: TitikPinFisik[] = Array.from({ length: 16 }).map((_, i) => ({
      idPin: i === 0 ? "3V3" : i === 15 ? "GND" : i === 4 ? "TX1_PA9" : i === 5 ? "RX1_PA10" : `GP${i}`,
      nomorPin: i + 1,
      nama:
        i === 0
          ? "3V3 (+3.3V)"
          : i === 15
          ? "GND (0V)"
          : i === 4
          ? "UART TX (PA9 / GP0)"
          : i === 5
          ? "UART RX (PA10 / GP1)"
          : `GPIO #${i + 1}`,
      x: 8,
      y: 22 + i * 12.5,
      sisi: "kiri",
      kategori: i === 0 ? "POWER" : i === 15 ? "GND" : i === 4 || i === 5 ? "UART" : "GPIO",
      keterangan: "Pin Mikrokontroler Sisi Kiri",
    }));
    const kanan: TitikPinFisik[] = Array.from({ length: 16 }).map((_, i) => ({
      idPin: i === 0 ? "5V_VBUS" : i === 15 ? "GND_R" : i === 2 ? "I2C_SCL" : i === 3 ? "I2C_SDA" : `GP${16 + i}`,
      nomorPin: 17 + i,
      nama:
        i === 0
          ? "5V / VBUS"
          : i === 15
          ? "GND (Ground)"
          : i === 2
          ? "I2C SCL"
          : i === 3
          ? "I2C SDA"
          : `GPIO #${17 + i}`,
      x: 142,
      y: 22 + i * 12.5,
      sisi: "kanan",
      kategori: i === 0 ? "POWER" : i === 15 ? "GND" : i === 2 || i === 3 ? "I2C" : "GPIO",
      keterangan: "Pin Mikrokontroler Sisi Kanan",
    }));
    return {
      lebar: 150,
      tinggi: 225,
      fungsiUtama: `${tipe.toUpperCase()} (32 Pin Fisik Kiri & Kanan).`,
      pins: [...kiri, ...kanan],
    };
  }

  // 7. Arduino Uno R3 (28 Pin)
  if (tipe === "arduino_uno") {
    const atas: TitikPinFisik[] = ARDUINO_PINS_ATAS.map((p, i) => ({
      ...p,
      nomorPin: i + 1,
      x: 22 + i * 12,
      y: 8,
      sisi: "atas",
    }));
    const bawah: TitikPinFisik[] = ARDUINO_PINS_BAWAH.map((p, i) => ({
      ...p,
      nomorPin: 15 + i,
      x: 22 + i * 12,
      y: 132,
      sisi: "bawah",
    }));
    return {
      lebar: 195,
      tinggi: 140,
      fungsiUtama: "Arduino Uno R3 ATmega328P (28 Titik Pin: 14 Atas & 14 Bawah).",
      pins: [...atas, ...bawah],
    };
  }

  // 8. Modul Relay 1-Channel (6 Pin)
  if (tipe === "relay_1ch" || tipe === "relay_5v") {
    return {
      lebar: 110,
      tinggi: 115,
      fungsiUtama:
        "Modul Relay 1-Channel 5V Optocoupler (6 Pin Asli): 3 Pin Kontrol di Bawah (VCC, GND, IN) & 3 Terminal Sekrup di Atas (NO, COM, NC).",
      pins: [
        { idPin: "NO", nomorPin: 1, nama: "NO (Normally Open - Beban+)", x: 28, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Kabel (+) Solenoid / Pompa Air" },
        { idPin: "COM", nomorPin: 2, nama: "COM (Common - Sumber Daya)", x: 55, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Sumber +12V / Socket Baterai BAT+" },
        { idPin: "NC", nomorPin: 3, nama: "NC (Normally Closed)", x: 82, y: 10, sisi: "atas", kategori: "PASIF", keterangan: "Terhubung ke COM saat Relay OFF" },
        { idPin: "VCC", nomorPin: 4, nama: "VCC (+5V Modul Relay)", x: 28, y: 106, sisi: "bawah", kategori: "POWER", keterangan: "Ke pin 5V / VIN mikrokontroler" },
        { idPin: "GND", nomorPin: 5, nama: "GND (Ground Relay)", x: 55, y: 106, sisi: "bawah", kategori: "GND", keterangan: "Ke pin GND mikrokontroler" },
        { idPin: "IN1", nomorPin: 6, nama: "IN (Input Pemicu Relay)", x: 82, y: 106, sisi: "bawah", kategori: "GPIO", keterangan: "Ke Pin Digital GPIO (GPIO32 / GPIO10 / D7)" },
      ],
    };
  }

  // 9. Modul Relay 2-Channel (10 Pin)
  if (tipe === "relay_2ch") {
    return {
      lebar: 150,
      tinggi: 120,
      fungsiUtama:
        "Modul Relay 2-Channel 5V Optocoupler (10 Pin Asli): 6 Terminal Sekrup Atas & 4 Pin Kontrol Bawah.",
      pins: [
        { idPin: "NO1", nomorPin: 1, nama: "NO1 (Output Relay 1)", x: 20, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Beban 1 (+)" },
        { idPin: "COM1", nomorPin: 2, nama: "COM1 (Common Relay 1)", x: 42, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Sumber Daya (+)" },
        { idPin: "NC1", nomorPin: 3, nama: "NC1 (Normally Closed 1)", x: 64, y: 10, sisi: "atas", kategori: "PASIF", keterangan: "NC Kanal 1" },
        { idPin: "NO2", nomorPin: 4, nama: "NO2 (Output Relay 2)", x: 88, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Beban 2 (+)" },
        { idPin: "COM2", nomorPin: 5, nama: "COM2 (Common Relay 2)", x: 110, y: 10, sisi: "atas", kategori: "POWER", keterangan: "Ke Sumber Daya (+)" },
        { idPin: "NC2", nomorPin: 6, nama: "NC2 (Normally Closed 2)", x: 132, y: 10, sisi: "atas", kategori: "PASIF", keterangan: "NC Kanal 2" },
        { idPin: "GND", nomorPin: 7, nama: "GND (Ground)", x: 35, y: 112, sisi: "bawah", kategori: "GND", keterangan: "Ke GND Mikrokontroler" },
        { idPin: "IN1", nomorPin: 8, nama: "IN1 (Trigger Relay 1)", x: 62, y: 112, sisi: "bawah", kategori: "GPIO", keterangan: "Ke GPIO32 / GPIO10" },
        { idPin: "IN2", nomorPin: 9, nama: "IN2 (Trigger Relay 2)", x: 89, y: 112, sisi: "bawah", kategori: "GPIO", keterangan: "Ke GPIO33 / GPIO11" },
        { idPin: "VCC", nomorPin: 10, nama: "VCC (+5V)", x: 116, y: 112, sisi: "bawah", kategori: "POWER", keterangan: "Ke 5V / VIN" },
      ],
    };
  }

  // 10. Modul Relay 4-Channel (18 Pin)
  if (tipe === "relay_4ch") {
    const terminalAtas: TitikPinFisik[] = [
      "NO1", "COM1", "NC1", "NO2", "COM2", "NC2", "NO3", "COM3", "NC3", "NO4", "COM4", "NC4",
    ].map((kode, idx) => ({
      idPin: kode,
      nomorPin: idx + 1,
      nama: `${kode} (Terminal Relay #${Math.floor(idx / 3) + 1})`,
      x: 16 + idx * 17,
      y: 10,
      sisi: "atas",
      kategori: kode.startsWith("NC") ? "PASIF" : "POWER",
      keterangan: `Terminal ${kode} Modul Relay 4-Channel`,
    }));

    const headerBawah: TitikPinFisik[] = [
      { id: "GND", ket: "Ground 0V Mikrokontroler", kat: "GND" as const },
      { id: "IN1", ket: "Trigger Kanal Relay 1", kat: "GPIO" as const },
      { id: "IN2", ket: "Trigger Kanal Relay 2", kat: "GPIO" as const },
      { id: "IN3", ket: "Trigger Kanal Relay 3", kat: "GPIO" as const },
      { id: "IN4", ket: "Trigger Kanal Relay 4", kat: "GPIO" as const },
      { id: "VCC", ket: "Catu Daya +5V Modul Relay", kat: "POWER" as const },
    ].map((h, i) => ({
      idPin: h.id,
      nomorPin: 13 + i,
      nama: `${h.id} (Header Kontrol)`,
      x: 45 + i * 26,
      y: 116,
      sisi: "bawah",
      kategori: h.kat,
      keterangan: h.ket,
    }));

    return {
      lebar: 220,
      tinggi: 124,
      fungsiUtama: "Modul Relay 4-Channel 5V Optocoupler (18 Pin Asli).",
      pins: [...terminalAtas, ...headerBawah],
    };
  }

  // 11. Solenoid Door Lock 12V & Pompa Air Mini DC (2 Pin)
  if (tipe === "solenoid_lock" || tipe === "water_pump") {
    const isPump = tipe === "water_pump";
    return {
      lebar: 120,
      tinggi: 98,
      fungsiUtama: isPump
        ? "Pompa Air Mini Submersible DC (2 Kabel Asli: Merah VCC+ & Hitam GND-)."
        : "Solenoid Door Lock 12V DC (2 Kabel Asli: Merah VCC+ & Hitam GND-).",
      pins: [
        {
          idPin: "VCC_POS",
          nomorPin: 1,
          nama: isPump ? "Kabel Merah (+5V/+12V Pompa)" : "Kabel Merah (+12V Solenoid)",
          x: 38,
          y: 90,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Hubungkan ke terminal NO (Normally Open) pada Modul Relay!",
        },
        {
          idPin: "GND_NEG",
          nomorPin: 2,
          nama: isPump ? "Kabel Hitam (GND - Pompa)" : "Kabel Hitam (GND - Solenoid)",
          x: 82,
          y: 90,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Hubungkan ke jalur Ground (GND 0V) atau BAT- Socket Baterai!",
        },
      ],
    };
  }

  // 12. SENSOR SUHU & KELEMBAPAN DHT22 (4 PIN KAKI ASLI DI BAWAH)
  if (tipe === "dht22") {
    const dhtPins = [
      { idPin: "VCC", nama: "Pin 1: VCC (3.3V-5V)", kat: "POWER" as const, ket: "Hubungkan ke pin 3V3 atau 5V pada ESP32 / ESP32-C6" },
      { idPin: "DATA", nama: "Pin 2: DATA / SDA (One-Wire)", kat: "GPIO" as const, ket: "Hubungkan ke GPIO15 (ESP32), GPIO23 (ESP32-C6), atau D2 (Arduino)" },
      { idPin: "NC", nama: "Pin 3: NC (Not Connected)", kat: "PASIF" as const, ket: "Kaki ke-3 kosong sesuai standar fisik DHT22" },
      { idPin: "GND", nama: "Pin 4: GND (Ground 0V)", kat: "GND" as const, ket: "Hubungkan ke pin GND mikrokontroler" },
    ];
    return {
      lebar: 100,
      tinggi: 115,
      fungsiUtama: "Sensor Digital Suhu (-40..80°C) & Kelembapan Udara DHT22 dengan 4 kaki pin menghadap ke bawah.",
      pins: dhtPins.map((p, i) => ({
        idPin: p.idPin,
        nomorPin: i + 1,
        nama: p.nama,
        x: 23 + i * 18,
        y: 108,
        sisi: "bawah",
        kategori: p.kat,
        keterangan: p.ket,
      })),
    };
  }

  // 13. Sensor Ultrasonik HC-SR04 (4 Pin)
  if (tipe === "ultrasonik") {
    const ultraPins = [
      { idPin: "VCC", nama: "Pin 1: VCC (+5V)", kat: "POWER" as const, ket: "Ke 5V / VIN" },
      { idPin: "TRIG", nama: "Pin 2: TRIG (Trigger)", kat: "GPIO" as const, ket: "Ke GPIO12 / D8" },
      { idPin: "ECHO", nama: "Pin 3: ECHO (Pantulan)", kat: "GPIO" as const, ket: "Ke GPIO13 / D9" },
      { idPin: "GND", nama: "Pin 4: GND (Ground)", kat: "GND" as const, ket: "Ke GND (0V)" },
    ];
    return {
      lebar: 140,
      tinggi: 95,
      fungsiUtama: "Sensor Jarak Ultrasonik HC-SR04 (Rentang Asli: 2 cm s/d 400 cm).",
      pins: ultraPins.map((p, i) => ({
        idPin: p.idPin,
        nomorPin: i + 1,
        nama: p.nama,
        x: 43 + i * 18,
        y: 88,
        sisi: "bawah",
        kategori: p.kat,
        keterangan: p.ket,
      })),
    };
  }

  if (
    tipe === "oled_display" ||
    tipe === "lcd_16x2" ||
    tipe === "mq2_gas" ||
    tipe === "soil_moisture" ||
    tipe === "rain_sensor"
  ) {
    const isAnalogSensor =
      tipe === "mq2_gas" || tipe === "soil_moisture" || tipe === "rain_sensor";
    const empatPins = isAnalogSensor
      ? [
          { idPin: "VCC", nama: "Pin 1: VCC (+5V)", kat: "POWER" as const, ket: "Ke 5V / 3V3" },
          { idPin: "GND", nama: "Pin 2: GND (0V)", kat: "GND" as const, ket: "Ke Ground" },
          { idPin: "DO", nama: "Pin 3: DO (Digital Out)", kat: "GPIO" as const, ket: "Output Threshold Digital (HIGH/LOW)" },
          { idPin: "AO", nama: "Pin 4: AO (Analog Out)", kat: "ADC" as const, ket: "Output Analog → Ke GPIO34 / GPIO0 / A0" },
        ]
      : [
          { idPin: "GND", nama: "Pin 1: GND (Ground)", kat: "GND" as const, ket: "Ke GND" },
          { idPin: "VCC", nama: "Pin 2: VCC (+3.3V/+5V)", kat: "POWER" as const, ket: "Ke 3V3 atau 5V" },
          { idPin: "SCL", nama: "Pin 3: SCL (I2C Clock)", kat: "I2C" as const, ket: "Ke GPIO22 / GPIO7 / A5" },
          { idPin: "SDA", nama: "Pin 4: SDA (I2C Data)", kat: "I2C" as const, ket: "Ke GPIO21 / GPIO6 / A4" },
        ];
    return {
      lebar: 140,
      tinggi: 95,
      fungsiUtama: `Modul ${tipe.toUpperCase()} dengan 4 pin terminal di bagian bawah.`,
      pins: empatPins.map((p, i) => ({
        idPin: p.idPin,
        nomorPin: i + 1,
        nama: p.nama,
        x: 40 + i * 20,
        y: 88,
        sisi: "bawah",
        kategori: p.kat,
        keterangan: p.ket,
      })),
    };
  }

  if (
    tipe === "servo" ||
    tipe === "servo_360" ||
    tipe === "kipas_dc" ||
    tipe === "dc_motor" ||
    tipe === "ir_obstacle" ||
    tipe === "flame_sensor" ||
    tipe === "water_level" ||
    tipe === "pir_sensor" ||
    tipe === "ldr_sensor" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    const isServoAtauMotor =
      tipe === "servo" ||
      tipe === "servo_360" ||
      tipe === "kipas_dc" ||
      tipe === "dc_motor";
    return {
      lebar: 120,
      tinggi: 98,
      fungsiUtama: `Komponen ${tipe.toUpperCase()} dengan 3 pin kaki di bagian bawah (VCC, OUT/PWM, GND).`,
      pins: [
        {
          idPin: "VCC",
          nomorPin: 1,
          nama: "Pin 1: VCC (+5V / 3.3V)",
          x: 30,
          y: 90,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Hubungkan ke sumber daya positif (+5V / 3.3V)",
        },
        {
          idPin: "SIG",
          nomorPin: 2,
          nama: isServoAtauMotor
            ? "Pin 2: PWM Sinyal (Kuning/Oranye)"
            : "Pin 2: OUT / Sinyal Sensor",
          x: 60,
          y: 90,
          sisi: "bawah",
          kategori: isServoAtauMotor ? "PWM" : "GPIO",
          keterangan: isServoAtauMotor
            ? "Hubungkan ke Pin PWM (GPIO18 ESP32/ESP32-C6 / D9 Arduino)"
            : "Mengirimkan sinyal deteksi ke GPIO / ADC mikrokontroler",
        },
        {
          idPin: "GND",
          nomorPin: 3,
          nama: "Pin 3: GND (Ground 0V)",
          x: 90,
          y: 90,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Hubungkan ke Ground (0V)",
        },
      ],
    };
  }

  if (tipe === "rfid_rc522") {
    const rfidPins = ["SDA(SS)", "SCK", "MOSI", "MISO", "GND", "3.3V"];
    return {
      lebar: 130,
      tinggi: 100,
      fungsiUtama: "Modul Pembaca Kartu Pintar RFID RC522 (13.56 MHz) dengan 6 pin SPI di bawah.",
      pins: rfidPins.map((p, i) => ({
        idPin: p,
        nomorPin: i + 1,
        nama: `Pin ${i + 1}: ${p}`,
        x: 20 + i * 18,
        y: 92,
        sisi: "bawah",
        kategori: p === "3.3V" ? "POWER" : p === "GND" ? "GND" : "SPI",
        keterangan: `Jalur SPI ${p} RFID RC522`,
      })),
    };
  }

  if (
    tipe === "resistor" ||
    tipe === "kapasitor" ||
    tipe === "induktor" ||
    tipe === "dioda"
  ) {
    return {
      lebar: 140,
      tinggi: 64,
      fungsiUtama: `Komponen ${tipe.toUpperCase()} 2 terminal (Kaki 1 di kiri & Kaki 2 di kanan).`,
      pins: [
        {
          idPin: "PIN_1",
          nomorPin: 1,
          nama: tipe === "dioda" ? "Anoda (+)" : "Terminal 1 (Kaki Kiri)",
          x: 6,
          y: 32,
          sisi: "kiri",
          kategori: "PASIF",
          keterangan: "Sambungkan ke sumber sinyal GPIO atau cabang rangkaian masuk",
        },
        {
          idPin: "PIN_2",
          nomorPin: 2,
          nama: tipe === "dioda" ? "Katoda (-)" : "Terminal 2 (Kaki Kanan)",
          x: 134,
          y: 32,
          sisi: "kanan",
          kategori: "PASIF",
          keterangan: "Sambungkan ke beban LED, kapasitor, atau Ground",
        },
      ],
    };
  }

  if (
    tipe === "led_hijau" ||
    tipe === "led_merah" ||
    tipe === "led_kuning" ||
    tipe === "buzzer"
  ) {
    return {
      lebar: 86,
      tinggi: 96,
      fungsiUtama: "Komponen Indikator 2 Kaki di bagian bawah: Anoda (+) dan Katoda (- / GND).",
      pins: [
        {
          idPin: "ANODA",
          nomorPin: 1,
          nama: "Anoda (+) Kaki Positif",
          x: 31,
          y: 88,
          sisi: "bawah",
          kategori: "GPIO",
          keterangan: "Hubungkan ke Pin GPIO melalui Resistor pembatas arus",
        },
        {
          idPin: "KATODA",
          nomorPin: 2,
          nama: "Katoda (-) Kaki GND",
          x: 55,
          y: 88,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Hubungkan langsung ke jalur GND (0V)",
        },
      ],
    };
  }

  if (tipe === "keypad_4x4") {
    const kpPins = ["R1", "R2", "R3", "R4", "C1", "C2", "C3", "C4"];
    return {
      lebar: 115,
      tinggi: 110,
      fungsiUtama: "Keypad Matriks 4x4 dengan 8 pin di bagian bawah.",
      pins: kpPins.map((p, i) => ({
        idPin: p,
        nomorPin: i + 1,
        nama: `Pin ${i + 1}: ${p}`,
        x: 16 + i * 12,
        y: 103,
        sisi: "bawah",
        kategori: "GPIO",
        keterangan: `Hubungkan ${p} ke pin digital GPIO mikrokontroler`,
      })),
    };
  }

  return {
    lebar: 135,
    tinggi: 82,
    fungsiUtama: `Komponen/Blok ${tipe.toUpperCase()} dengan terminal Input di kiri dan Output di kanan.`,
    pins: [
      {
        idPin: "IN_1",
        nomorPin: 1,
        nama: "Input 1 (IN+)",
        x: 6,
        y: 28,
        sisi: "kiri",
        kategori: "GPIO",
        keterangan: "Menerima sinyal masukan",
      },
      {
        idPin: "IN_2",
        nomorPin: 2,
        nama: "Input 2 (IN- / GND)",
        x: 6,
        y: 54,
        sisi: "kiri",
        kategori: "GND",
        keterangan: "Referensi Ground (0V)",
      },
      {
        idPin: "OUT_1",
        nomorPin: 3,
        nama: "Output Utama (OUT)",
        x: 129,
        y: 41,
        sisi: "kanan",
        kategori: "PWM",
        keterangan: "Mengirimkan sinyal keluaran",
      },
    ],
  };
}