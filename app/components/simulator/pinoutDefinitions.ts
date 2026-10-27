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

const ESP32_PINS_KIRI: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "EN", nama: "EN (Reset)", kategori: "GPIO", keterangan: "Enable / Reset Chip ESP32" },
  { idPin: "GPIO36", nama: "VP (GPIO36 / ADC0)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH0" },
  { idPin: "GPIO39", nama: "VN (GPIO39 / ADC3)", kategori: "ADC", keterangan: "Input Only & Analog ADC1_CH3" },
  { idPin: "GPIO34", nama: "D34 (GPIO34 / ADC6)", kategori: "ADC", keterangan: "Input Analog (LDR / Soil / Rain / MQ2)" },
  { idPin: "GPIO35", nama: "D35 (GPIO35 / ADC7)", kategori: "ADC", keterangan: "Input Analog Sensor" },
  { idPin: "GPIO32", nama: "D32 (GPIO32 / PWM)", kategori: "PWM", keterangan: "Digital I/O & Relay / Solenoid Trigger" },
  { idPin: "GPIO33", nama: "D33 (GPIO33 / PWM)", kategori: "PWM", keterangan: "Digital I/O & Motor / Kipas PWM" },
  { idPin: "GPIO25", nama: "D25 (GPIO25 / DAC1)", kategori: "ADC", keterangan: "Digital I/O & Analog Output DAC1" },
  { idPin: "GPIO26", nama: "D26 (GPIO26 / DAC2)", kategori: "ADC", keterangan: "Digital I/O & Analog Output DAC2" },
  { idPin: "GPIO27", nama: "D27 (GPIO27 / PWM)", kategori: "GPIO", keterangan: "Digital I/O & Pompa Air / Buzzer" },
  { idPin: "GPIO14", nama: "D14 (GPIO14 / HSPI_CLK)", kategori: "SPI", keterangan: "Digital I/O & PWM" },
  { idPin: "GPIO12", nama: "D12 (GPIO12 / TRIG)", kategori: "GPIO", keterangan: "Trigger Ultrasonik HC-SR04" },
  { idPin: "GPIO13", nama: "D13 (GPIO13 / ECHO)", kategori: "GPIO", keterangan: "Echo Ultrasonik HC-SR04" },
  { idPin: "GND_L", nama: "GND (Ground Kiri)", kategori: "GND", keterangan: "Referensi Ground 0V" },
  { idPin: "VIN", nama: "VIN (Input/Out 5V)", kategori: "POWER", keterangan: "Tegangan +5V DC untuk modul aktuator/sensor" },
];

const ESP32_PINS_KANAN: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "GPIO23", nama: "D23 (GPIO23 / MOSI)", kategori: "SPI", keterangan: "VSPI MOSI (Ke MOSI RFID RC522)" },
  { idPin: "GPIO22", nama: "D22 (GPIO22 / I2C SCL)", kategori: "I2C", keterangan: "Jalur Clock I2C → Ke SCL OLED/LCD" },
  { idPin: "GPIO1", nama: "TX0 (GPIO1 / UART0 TX)", kategori: "UART", keterangan: "Serial0 Transmit" },
  { idPin: "GPIO3", nama: "RX0 (GPIO3 / UART0 RX)", kategori: "UART", keterangan: "Serial0 Receive" },
  { idPin: "GPIO21", nama: "D21 (GPIO21 / I2C SDA)", kategori: "I2C", keterangan: "Jalur Data I2C → Ke SDA OLED/LCD" },
  { idPin: "GPIO19", nama: "D19 (GPIO19 / MISO)", kategori: "SPI", keterangan: "VSPI MISO (Ke MISO RFID RC522)" },
  { idPin: "GPIO18", nama: "D18 (GPIO18 / SERVO PWM)", kategori: "PWM", keterangan: "VSPI SCK / Output PWM Motor Servo SG90" },
  { idPin: "GPIO5", nama: "D5 (GPIO5 / SS RFID)", kategori: "SPI", keterangan: "VSPI CS/SDA RFID atau Output Relay/Solenoid" },
  { idPin: "GPIO17", nama: "TX2 (GPIO17 / UART2 TX)", kategori: "UART", keterangan: "UART2 Transmit → Ke D0(RX) Arduino Uno" },
  { idPin: "GPIO16", nama: "RX2 (GPIO16 / UART2 RX)", kategori: "UART", keterangan: "UART2 Receive ← Dari D1(TX) Arduino Uno" },
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
  { idPin: "D9", nama: "D9 (~PWM Servo)", kategori: "PWM", keterangan: "Pin PWM Motor Servo SG90" },
  { idPin: "D8", nama: "D8 (TRIG Ultrasonik)", kategori: "GPIO", keterangan: "Digital I/O 8" },
  { idPin: "D7", nama: "D7 (Solenoid / Relay)", kategori: "GPIO", keterangan: "Output Pemicu Solenoid Door Lock / Pompa" },
  { idPin: "D4", nama: "D4 (Sensor IR / Flame)", kategori: "GPIO", keterangan: "Input Digital Sensor IR / Api" },
  { idPin: "D1_TX", nama: "D1 (TX - Transmit)", kategori: "UART", keterangan: "UART TX → Ke RX2 (GPIO16) ESP32" },
  { idPin: "D0_RX", nama: "D0 (RX - Receive)", kategori: "UART", keterangan: "UART RX ← Dari TX2 (GPIO17) ESP32" },
];

const ARDUINO_PINS_BAWAH: Omit<TitikPinFisik, "x" | "y" | "sisi" | "nomorPin">[] = [
  { idPin: "IOREF", nama: "IOREF (5V)", kategori: "POWER", keterangan: "Referensi Tegangan Operasi" },
  { idPin: "RESET", nama: "RESET", kategori: "GPIO", keterangan: "Pin Reset" },
  { idPin: "3V3", nama: "3.3V Out", kategori: "POWER", keterangan: "Catu daya +3.3V DC" },
  { idPin: "5V", nama: "5V Out (VCC Utama)", kategori: "POWER", keterangan: "Catu daya +5V DC" },
  { idPin: "GND_1", nama: "GND (Ground 1)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "GND_2", nama: "GND (Ground 2)", kategori: "GND", keterangan: "Ground 0V" },
  { idPin: "VIN", nama: "VIN (Input 7-12V)", kategori: "POWER", keterangan: "Tegangan 12V untuk Solenoid / Motor DC" },
  { idPin: "A0", nama: "A0 (ADC LDR / Pot)", kategori: "ADC", keterangan: "ADC 10-bit untuk LDR / Potensiometer" },
  { idPin: "A1", nama: "A1 (ADC Soil / Rain)", kategori: "ADC", keterangan: "ADC 10-bit untuk Kelembapan Tanah / Hujan" },
  { idPin: "A2", nama: "A2 (ADC Water / MQ2)", kategori: "ADC", keterangan: "ADC 10-bit untuk Tinggi Air / Gas" },
  { idPin: "A3", nama: "A3 (Analog Input 3)", kategori: "ADC", keterangan: "ADC 10-bit" },
  { idPin: "A4", nama: "A4 (SDA)", kategori: "I2C", keterangan: "Jalur I2C SDA" },
  { idPin: "A5", nama: "A5 (SCL)", kategori: "I2C", keterangan: "Jalur I2C SCL" },
  { idPin: "D2", nama: "D2 (INT0 / DHT22)", kategori: "GPIO", keterangan: "Pin DATA DHT22 / Interrupt" },
];

export function ambilLayoutFisikKomponen(tipe: string): LayoutFisikKomponen {
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
          ? "ESP32 DevKit V1 (30 Pin Fisik: 15 Kiri & 15 Kanan) mendukung WiFi, Blynk, Telegram Bot & Dual-UART."
          : "NodeMCU ESP8266 (30 Pin Fisik) WiFi IoT Microcontroller.",
      pins: [...pinsKiri, ...pinsKanan],
    };
  }

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

  if (tipe === "dht22") {
    const dhtPins = [
      { idPin: "VCC", nama: "Pin 1: VCC (3.3V-5V)", kat: "POWER" as const, ket: "Catu daya positif sensor" },
      { idPin: "DATA", nama: "Pin 2: DATA (SDA)", kat: "GPIO" as const, ket: "Ke GPIO15 ESP32 atau D2 Arduino" },
      { idPin: "NC", nama: "Pin 3: NC (Kosong)", kat: "PASIF" as const, ket: "Tidak digunakan" },
      { idPin: "GND", nama: "Pin 4: GND (Ground)", kat: "GND" as const, ket: "Ke GND (0V)" },
    ];
    return {
      lebar: 100,
      tinggi: 115,
      fungsiUtama: "Sensor Suhu & Kelembapan DHT22 dengan 4 kaki pin di bagian bawah.",
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
      fungsiUtama: "Sensor Jarak Ultrasonik HC-SR04 dengan animasi gelombang sonar & target orang.",
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

  // Sensor 4 Pin Bawah: OLED, LCD, MQ-2 Gas, Soil Moisture, Raindrop
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
          { idPin: "AO", nama: "Pin 4: AO (Analog Out)", kat: "ADC" as const, ket: "Output Analog → Ke GPIO34 / A0 / A1" },
        ]
      : [
          { idPin: "GND", nama: "Pin 1: GND (Ground)", kat: "GND" as const, ket: "Ke GND" },
          { idPin: "VCC", nama: "Pin 2: VCC (+3.3V/+5V)", kat: "POWER" as const, ket: "Ke 3V3 atau 5V" },
          { idPin: "SCL", nama: "Pin 3: SCL (I2C Clock)", kat: "I2C" as const, ket: "Ke GPIO22 / A5" },
          { idPin: "SDA", nama: "Pin 4: SDA (I2C Data)", kat: "I2C" as const, ket: "Ke GPIO21 / A4" },
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

  // Aktuator & Sensor 3 Pin Bawah: Solenoid Door Lock, Motor DC, Kipas DC, Pompa Air, IR Obstacle, Flame Sensor, Water Level, Servo, PIR, LDR
  if (
    tipe === "solenoid_lock" ||
    tipe === "water_pump" ||
    tipe === "kipas_dc" ||
    tipe === "dc_motor" ||
    tipe === "ir_obstacle" ||
    tipe === "flame_sensor" ||
    tipe === "water_level" ||
    tipe === "servo" ||
    tipe === "pir_sensor" ||
    tipe === "ldr_sensor" ||
    tipe === "potensiometer" ||
    tipe === "transistor_npn"
  ) {
    const isAktuatorBeban =
      tipe === "solenoid_lock" ||
      tipe === "water_pump" ||
      tipe === "kipas_dc" ||
      tipe === "dc_motor";
    return {
      lebar: 120,
      tinggi: 98,
      fungsiUtama: isAktuatorBeban
        ? `Aktuator ${tipe.toUpperCase()} dengan 3 pin (VCC 12V/5V, Pin Trigger/PWM Sinyal, dan GND).`
        : `Sensor/Komponen ${tipe.toUpperCase()} dengan 3 pin kaki di bagian bawah (VCC, OUT/SIG, GND).`,
      pins: [
        {
          idPin: "VCC",
          nomorPin: 1,
          nama: isAktuatorBeban ? "Pin 1: VCC (+12V / +5V)" : "Pin 1: VCC (+5V / 3.3V)",
          x: 30,
          y: 90,
          sisi: "bawah",
          kategori: "POWER",
          keterangan: "Hubungkan ke sumber daya positif (VIN / 5V / 12V)",
        },
        {
          idPin: "SIG",
          nomorPin: 2,
          nama: isAktuatorBeban
            ? "Pin 2: IN / PWM Trigger"
            : "Pin 2: OUT / Sinyal Sensor",
          x: 60,
          y: 90,
          sisi: "bawah",
          kategori: isAktuatorBeban ? "PWM" : "GPIO",
          keterangan: isAktuatorBeban
            ? "Hubungkan ke GPIO / Relay untuk mengaktifkan aktuator"
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

  // RFID RC522 (6 Pin SPI di Bawah)
  if (tipe === "rfid_rc522") {
    const rfidPins = ["SDA(SS)", "SCK", "MOSI", "MISO", "GND", "3.3V"];
    return {
      lebar: 130,
      tinggi: 100,
      fungsiUtama: "Modul Pembaca Kartu Pintar RFID RC522 (13.56 MHz) dengan antarmuka SPI.",
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