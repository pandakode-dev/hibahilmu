// app/components/simulator/pinoutDefinitions.ts

export interface TitikPinFisik {
  idPin: string;
  nomorPin: number;
  nama: string;
  x: number; // Koordinat X relatif terhadap komponen (px)
  y: number; // Koordinat Y relatif terhadap komponen (px)
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

// Helper warna titik pin berdasarkan fungsinya
export function warnaTitikPin(kategori: TitikPinFisik["kategori"]): string {
  switch (kategori) {
    case "POWER":
      return "#ef4444"; // Merah (VCC / 5V / 3V3)
    case "GND":
      return "#64748b"; // Abu-Hitam (GND)
    case "UART":
      return "#22c55e"; // Hijau (TX / RX)
    case "I2C":
      return "#a855f7"; // Ungu (SDA / SCL)
    case "PWM":
      return "#facc15"; // Kuning (PWM)
    case "ADC":
      return "#f97316"; // Oranye (Analog)
    default:
      return "#38bdf8"; // Biru (GPIO / Pasif)
  }
}

// 15 Pin Sisi Kiri ESP32 DevKit V1 (30-Pin Version)
const ESP32_PINS_KIRI: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "EN", nama: "EN (Reset)", kategori: "GPIO", keterangan: "Enable / Reset Chip ESP32" },
  { idPin: "GPIO36", nama: "VP (GPIO36 / ADC0)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH0" },
  { idPin: "GPIO39", nama: "VN (GPIO39 / ADC3)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH3" },
  { idPin: "GPIO34", nama: "D34 (GPIO34 / ADC6)", kategori: "ADC", keterangan: "Input Only & Sensor Analog (LDR/MQ2)" },
  { idPin: "GPIO35", nama: "D35 (GPIO35 / ADC7)", kategori: "ADC", keterangan: "Input Only & Sensor Analog" },
  { idPin: "GPIO32", nama: "D32 (GPIO32 / PWM)", kategori: "PWM", keterangan: "Digital I/O, Touch9 & ADC1_CH4" },
  { idPin: "GPIO33", nama: "D33 (GPIO33 / PWM)", kategori: "PWM", keterangan: "Digital I/O, Touch8 & ADC1_CH5" },
  { idPin: "GPIO25", nama: "D25 (GPIO25 / DAC1)", kategori: "ADC", keterangan: "Digital I/O & Analog Output DAC1" },
  { idPin: "GPIO26", nama: "D26 (GPIO26 / DAC2)", kategori: "ADC", keterangan: "Digital I/O & Analog Output DAC2" },
  { idPin: "GPIO27", nama: "D27 (GPIO27 / PWM)", kategori: "GPIO", keterangan: "Digital I/O & Touch7" },
  { idPin: "GPIO14", nama: "D14 (GPIO14 / HSPI_CLK)", kategori: "SPI", keterangan: "Digital I/O & PWM" },
  { idPin: "GPIO12", nama: "D12 (GPIO12 / TRIG)", kategori: "GPIO", keterangan: "Digital I/O (Cocok untuk Trigger Ultrasonik)" },
  { idPin: "GPIO13", nama: "D13 (GPIO13 / ECHO)", kategori: "GPIO", keterangan: "Digital I/O (Cocok untuk Echo Ultrasonik)" },
  { idPin: "GND_L", nama: "GND (Ground Kiri)", kategori: "GND", keterangan: "Referensi Ground 0V (Satukan dengan GND beban)" },
  { idPin: "VIN", nama: "VIN (Input/Out 5V)", kategori: "POWER", keterangan: "Tegangan +5V DC untuk modul 5V (Relay/Servo/HC-SR04)" },
];

// 15 Pin Sisi Kanan ESP32 DevKit V1 (Total 30 Pin)
const ESP32_PINS_KANAN: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "GPIO23", nama: "D23 (GPIO23 / MOSI)", kategori: "SPI", keterangan: "VSPI MOSI & Digital I/O" },
  { idPin: "GPIO22", nama: "D22 (GPIO22 / I2C SCL)", kategori: "I2C", keterangan: "Jalur Clock I2C → Hubungkan ke SCL OLED/LCD" },
  { idPin: "GPIO1", nama: "TX0 (GPIO1 / UART0 TX)", kategori: "UART", keterangan: "Serial0 Transmit → Ke RX USB/MCU" },
  { idPin: "GPIO3", nama: "RX0 (GPIO3 / UART0 RX)", kategori: "UART", keterangan: "Serial0 Receive ← Dari TX USB/MCU" },
  { idPin: "GPIO21", nama: "D21 (GPIO21 / I2C SDA)", kategori: "I2C", keterangan: "Jalur Data I2C → Hubungkan ke SDA OLED/LCD" },
  { idPin: "GPIO19", nama: "D19 (GPIO19 / MISO)", kategori: "SPI", keterangan: "VSPI MISO & Digital I/O" },
  { idPin: "GPIO18", nama: "D18 (GPIO18 / SERVO PWM)", kategori: "PWM", keterangan: "VSPI SCK & Output PWM Motor Servo SG90" },
  { idPin: "GPIO5", nama: "D5 (GPIO5 / CS)", kategori: "GPIO", keterangan: "VSPI CS & Output LED/Relay" },
  { idPin: "GPIO17", nama: "TX2 (GPIO17 / UART2 TX)", kategori: "UART", keterangan: "UART2 Transmit → Hubungkan silang ke D0(RX) Arduino Uno!" },
  { idPin: "GPIO16", nama: "RX2 (GPIO16 / UART2 RX)", kategori: "UART", keterangan: "UART2 Receive ← Hubungkan silang dari D1(TX) Arduino Uno!" },
  { idPin: "GPIO4", nama: "D4 (GPIO4 / LED Alarm)", kategori: "GPIO", keterangan: "Digital I/O, ADC & Touch0" },
  { idPin: "GPIO2", nama: "D2 (GPIO2 / Built-in LED)", kategori: "GPIO", keterangan: "Terhubung ke LED Biru internal & Output Digital" },
  { idPin: "GPIO15", nama: "D15 (GPIO15 / DHT22 DATA)", kategori: "GPIO", keterangan: "Digital I/O → Hubungkan ke Pin DATA Sensor DHT22" },
  { idPin: "GND_R", nama: "GND (Ground Kanan)", kategori: "GND", keterangan: "Referensi Ground 0V" },
  { idPin: "3V3", nama: "3V3 (Output +3.3V)", kategori: "POWER", keterangan: "Sumber daya +3.3V DC untuk sensor (DHT22/OLED)" },
];

// 14 Pin Atas Arduino Uno R3
const ARDUINO_PINS_ATAS: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "SCL", nama: "SCL (A5 / I2C Clock)", kategori: "I2C", keterangan: "Clock I2C → Ke SCL LCD/OLED" },
  { idPin: "SDA", nama: "SDA (A4 / I2C Data)", kategori: "I2C", keterangan: "Data I2C → Ke SDA LCD/OLED" },
  { idPin: "AREF", nama: "AREF", kategori: "ADC", keterangan: "Referensi Tegangan Analog" },
  { idPin: "GND_TOP", nama: "GND (Atas)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "D13", nama: "D13 (SCK / LED_BUILTIN)", kategori: "SPI", keterangan: "Digital I/O 13 & LED Bawaan" },
  { idPin: "D12", nama: "D12 (MISO / ECHO)", kategori: "SPI", keterangan: "Digital I/O 12" },
  { idPin: "D11", nama: "D11 (~PWM / MOSI)", kategori: "PWM", keterangan: "Output PWM & SPI MOSI" },
  { idPin: "D10", nama: "D10 (~PWM / SS)", kategori: "PWM", keterangan: "Output PWM & SPI SS" },
  { idPin: "D9", nama: "D9 (~PWM Servo)", kategori: "PWM", keterangan: "Pin PWM ideal untuk Motor Servo SG90" },
  { idPin: "D8", nama: "D8 (TRIG Ultrasonik)", kategori: "GPIO", keterangan: "Digital I/O 8" },
  { idPin: "D7", nama: "D7 (Digital)", kategori: "GPIO", keterangan: "Digital I/O 7" },
  { idPin: "D4", nama: "D4 (Digital)", kategori: "GPIO", keterangan: "Digital I/O 4" },
  { idPin: "D1_TX", nama: "D1 (TX - Transmit)", kategori: "UART", keterangan: "UART TX → Hubungkan silang ke RX2 (GPIO16) ESP32!" },
  { idPin: "D0_RX", nama: "D0 (RX - Receive)", kategori: "UART", keterangan: "UART RX ← Hubungkan silang dari TX2 (GPIO17) ESP32!" },
];

// 14 Pin Bawah Arduino Uno R3 (Total 28 Pin)
const ARDUINO_PINS_BAWAH: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "IOREF", nama: "IOREF (5V)", kategori: "POWER", keterangan: "Referensi Tegangan Operasi Board" },
  { idPin: "RESET", nama: "RESET", kategori: "GPIO", keterangan: "Pin Reset Mikrokontroler" },
  { idPin: "3V3", nama: "3.3V Out", kategori: "POWER", keterangan: "Catu daya +3.3V DC (Maks 50mA)" },
  { idPin: "5V", nama: "5V Out (VCC Utama)", kategori: "POWER", keterangan: "Catu daya +5V DC untuk sensor & aktuator" },
  { idPin: "GND_1", nama: "GND (Ground 1)", kategori: "GND", keterangan: "Ground 0V (Satukan dengan GND ESP32)" },
  { idPin: "GND_2", nama: "GND (Ground 2)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "VIN", nama: "VIN (Input 7-12V)", kategori: "POWER", keterangan: "Input catu daya eksternal" },
  { idPin: "A0", nama: "A0 (Analog Input 0)", kategori: "ADC", keterangan: "ADC 10-bit untuk Potensiometer/LDR" },
  { idPin: "A1", nama: "A1 (Analog Input 1)", kategori: "ADC", keterangan: "ADC 10-bit untuk Sensor Gas MQ-2" },
  { idPin: "A2", nama: "A2 (Analog Input 2)", kategori: "ADC", keterangan: "ADC 10-bit" },
  { idPin: "A3", nama: "A3 (Analog Input 3)", kategori: "ADC", keterangan: "ADC 10-bit" },
  { idPin: "A4", nama: "A4 (Analog / SDA)", kategori: "I2C", keterangan: "ADC4 atau Jalur I2C SDA" },
  { idPin: "A5", nama: "A5 (Analog / SCL)", kategori: "I2C", keterangan: "ADC5 atau Jalur I2C SCL" },
  { idPin: "D2", nama: "D2 (INT0 / DHT22)", kategori: "GPIO", keterangan: "Interrupt Eksternal & Pin DATA DHT22" },
];

export function ambilLayoutFisikKomponen(tipe: string): LayoutFisikKomponen {
  // 1. ESP32 (30 Titik Pin: 15 di Kiri, 15 di Kanan)
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
          ? "ESP32 DevKit V1 (30 Pin Fisik: 15 Kiri & 15 Kanan) dengan WiFi, BLE, Dual-UART TX/RX & I2C."
          : "NodeMCU ESP8266 (30 Pin Fisik: 15 Kiri & 15 Kanan) WiFi IoT SoC.",
      pins: [...pinsKiri, ...pinsKanan],
    };
  }

  // 2. STM32 BluePill / Raspberry Pi Pico (32 Titik Pin: 16 Kiri, 16 Kanan)
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
          : `GPIO / Pin Kiri #${i + 1}`,
      x: 8,
      y: 22 + i * 12.5,
      sisi: "kiri",
      kategori: i === 0 ? "POWER" : i === 15 ? "GND" : i === 4 || i === 5 ? "UART" : "GPIO",
      keterangan:
        i === 4 || i === 5
          ? "Pin Komunikasi Serial UART Antar-Mikrokontroler (TX ↔ RX)"
          : "Pin I/O Digital & Periferal Mikrokontroler",
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
          ? "I2C SCL (Clock)"
          : i === 3
          ? "I2C SDA (Data)"
          : `GPIO / Pin Kanan #${17 + i}`,
      x: 142,
      y: 22 + i * 12.5,
      sisi: "kanan",
      kategori: i === 0 ? "POWER" : i === 15 ? "GND" : i === 2 || i === 3 ? "I2C" : "GPIO",
      keterangan: "Pin Ekspansi Kanan Mikrokontroler",
    }));
    return {
      lebar: 150,
      tinggi: 225,
      fungsiUtama: `${tipe.toUpperCase()} (32 Pin Fisik Kiri & Kanan) mendukung komunikasi UART TX/RX, I2C, SPI, dan ADC.`,
      pins: [...kiri, ...kanan],
    };
  }

  // 3. Arduino Uno R3 (28 Titik Pin: 14 di Header Atas, 14 di Header Bawah)
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
      fungsiUtama:
        "Arduino Uno R3 ATmega328P (28 Titik Pin: 14 Header Digital/UART di Atas & 14 Header Power/Analog di Bawah).",
      pins: [...atas, ...bawah],
    };
  }

  // 4. Sensor DHT22 (4 Pin Kaki di Bawah)
  if (tipe === "dht22") {
    const dhtPins = [
      { idPin: "VCC", nama: "Pin 1: VCC (3.3V - 5V)", kat: "POWER" as const, ket: "Hubungkan ke 3V3 atau 5V mikrokontroler" },
      { idPin: "DATA", nama: "Pin 2: DATA (SDA)", kat: "GPIO" as const, ket: "Hubungkan ke GPIO15 (ESP32) atau D2 (Arduino)" },
      { idPin: "NC", nama: "Pin 3: NC (Kosong)", kat: "PASIF" as const, ket: "Not Connected (Biarkan kosong)" },
      { idPin: "GND", nama: "Pin 4: GND (Ground)", kat: "GND" as const, ket: "Hubungkan ke pin GND mikrokontroler" },
    ];
    return {
      lebar: 100,
      tinggi: 115,
      fungsiUtama: "Sensor Suhu & Kelembapan DHT22 dengan 4 kaki pin menghadap ke bawah.",
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

  // 5. Sensor Ultrasonik HC-SR04 (4 Pin Kaki di Bawah)
  if (tipe === "ultrasonik") {
    const ultraPins = [
      { idPin: "VCC", nama: "Pin 1: VCC (+5V)", kat: "POWER" as const, ket: "Hubungkan ke pin 5V / VIN" },
      { idPin: "TRIG", nama: "Pin 2: TRIG (Trigger)", kat: "GPIO" as const, ket: "Input Pemicu → Hubungkan ke GPIO12 / D8" },
      { idPin: "ECHO", nama: "Pin 3: ECHO (Pantulan)", kat: "GPIO" as const, ket: "Output Pantulan → Hubungkan ke GPIO13 / D9" },
      { idPin: "GND", nama: "Pin 4: GND (Ground)", kat: "GND" as const, ket: "Hubungkan ke pin GND (0V)" },
    ];
    return {
      lebar: 140,
      tinggi: 95,
      fungsiUtama: "Sensor Jarak Ultrasonik HC-SR04 dengan 4 pin kaki di bagian bawah tengah.",
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

  // 6. Layar OLED I2C / LCD 16x2 I2C / Sensor Gas MQ-2 (4 Pin di Bawah)
  if (tipe === "oled_display" || tipe === "lcd_16x2" || tipe === "mq2_gas") {
    const i2cPins = [
      { idPin: "GND", nama: "Pin 1: GND (Ground)", kat: "GND" as const, ket: "Hubungkan ke GND mikrokontroler" },
      { idPin: "VCC", nama: "Pin 2: VCC (+3.3V / +5V)", kat: "POWER" as const, ket: "Hubungkan ke 3V3 atau 5V" },
      { idPin: "SCL", nama: "Pin 3: SCL / DOUT", kat: "I2C" as const, ket: "Hubungkan ke GPIO22 (ESP32) atau A5 (Arduino)" },
      { idPin: "SDA", nama: "Pin 4: SDA / AOUT", kat: "I2C" as const, ket: "Hubungkan ke GPIO21 (ESP32) atau A4 (Arduino)" },
    ];
    return {
      lebar: 140,
      tinggi: 95,
      fungsiUtama: `Modul ${tipe.toUpperCase()} dengan 4 pin antarmuka di sisi bawah.`,
      pins: i2cPins.map((p, i) => ({
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

  // 7. Resistor / Kapasitor / Induktor / Dioda (2 Pin di Ujung Kiri & Kanan)
  if (
    tipe === "resistor" ||
    tipe === "kapasitor" ||
    tipe === "induktor" ||
    tipe === "dioda"
  ) {
    return {
      lebar: 140,
      tinggi: 64,
      fungsiUtama: `Komponen ${tipe.toUpperCase()} 2 terminal (Kaki 1 di ujung kiri & Kaki 2 di ujung kanan).`,
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

  // 8. LED Merah / Hijau / Kuning & Buzzer (2 Pin Kaki di Bawah: Anoda & Katoda)
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
          keterangan: "Hubungkan ke Pin GPIO melalui Resistor pembatas arus (220Ω - 330Ω)",
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

  // 9. Motor Servo SG90, Sensor PIR, LDR, Potensiometer, Transistor NPN (3 Pin Kaki di Bawah)
  if (
    tipe === "servo" ||
    tipe === "pir_sensor" ||
    tipe === "ldr_sensor" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    const namaTengah =
      tipe === "servo"
        ? "PWM Sinyal (Oranye)"
        : tipe === "transistor_npn"
        ? "Basis (B)"
        : "OUT / Wiper (Sinyal)";
    return {
      lebar: 115,
      tinggi: 95,
      fungsiUtama: `Komponen ${tipe.toUpperCase()} dengan 3 kaki terminal di bagian bawah.`,
      pins: [
        {
          idPin: "VCC",
          nomorPin: 1,
          nama: tipe === "transistor_npn" ? "Kolektor (C)" : "Pin 1: VCC (+5V)",
          x: 30,
          y: 88,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Hubungkan ke sumber tegangan positif (+5V / 3.3V)",
        },
        {
          idPin: "SIG",
          nomorPin: 2,
          nama: `Pin 2: ${namaTengah}`,
          x: 57,
          y: 88,
          sisi: "bawah",
          kategori: "PWM",
          keterangan: "Hubungkan ke Pin PWM / ADC / GPIO mikrokontroler",
        },
        {
          idPin: "GND",
          nomorPin: 3,
          nama: tipe === "transistor_npn" ? "Emitor (E / GND)" : "Pin 3: GND (0V)",
          x: 84,
          y: 88,
          sisi: "bawah",
          kategori: "GND",
          keterangan: "Hubungkan ke Ground (0V)",
        },
      ],
    };
  }

  // 10.Keypad 4x4 (8 Pin di Bawah: R1-R4 & C1-C4)
  if (tipe === "keypad_4x4") {
    const kpPins = ["R1", "R2", "R3", "R4", "C1", "C2", "C3", "C4"];
    return {
      lebar: 115,
      tinggi: 110,
      fungsiUtama: "Keypad Matriks 4x4 dengan 8 pin di bagian bawah (4 Baris R1–R4 & 4 Kolom C1–C4).",
      pins: kpPins.map((p, i) => ({
        idPin: p,
        nomorPin: i + 1,
        nama: `Pin ${i + 1}: ${p} (${i < 4 ? "Baris" : "Kolom"})`,
        x: 16 + i * 12,
        y: 103,
        sisi: "bawah",
        kategori: "GPIO",
        keterangan: `Hubungkan ${p} ke pin digital GPIO mikrokontroler`,
      })),
    };
  }

  // Default untuk Blok EWB / IC / MATLAB Simulink (Pin Input di Kiri, Output di Kanan, VCC/GND)
  return {
    lebar: 135,
    tinggi: 82,
    fungsiUtama: `Komponen/Blok ${tipe.toUpperCase()} dengan terminal Input di sisi kiri dan Output di sisi kanan.`,
    pins: [
      {
        idPin: "IN_1",
        nomorPin: 1,
        nama: "Input 1 (IN+ / Sinyal Masuk)",
        x: 6,
        y: 28,
        sisi: "kiri",
        kategori: "GPIO",
        keterangan: "Menerima sinyal masukan dari komponen/blok sebelumnya",
      },
      {
        idPin: "IN_2",
        nomorPin: 2,
        nama: "Input 2 (IN- / GND / Ref)",
        x: 6,
        y: 54,
        sisi: "kiri",
        kategori: "GND",
        keterangan: "Terminal masukan kedua atau referensi Ground (0V)",
      },
      {
        idPin: "OUT_1",
        nomorPin: 3,
        nama: "Output Utama (OUT / Y)",
        x: 129,
        y: 41,
        sisi: "kanan",
        kategori: "PWM",
        keterangan: "Mengirimkan sinyal keluaran menuju komponen/blok berikutnya",
      },
    ],
  };
}