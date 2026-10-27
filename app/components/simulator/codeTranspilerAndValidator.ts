// app/components/simulator/codeTranspilerAndValidator.ts

import { NodeKomponenKanvas, KabelKoneksiItem } from "./ElectronicAndIotCanvas";
import { TitikPinFisik, ambilLayoutFisikKomponen } from "./pinoutDefinitions";

export interface TitikSikuKabel {
  x: number;
  y: number;
}

export interface ItemPaletGudang {
  tipe: string;
  label: string;
  kategori: string;
  defaultResistor?: number;
  defaultSensor?: number;
}

export const TIPE_MCU_LIST = [
  "esp32",
  "arduino_uno",
  "esp8266_nodemcu",
  "stm32_bluepill",
  "raspberry_pico",
];

export const PILIHAN_WARNA_KABEL = [
  { nama: "Merah (VCC/+)", hex: "#ef4444" },
  { nama: "Hitam/Abu (GND/-)", hex: "#94a3b8" },
  { nama: "Biru (Data/GPIO)", hex: "#38bdf8" },
  { nama: "Hijau (TX/SDA)", hex: "#22c55e" },
  { nama: "Kuning (RX/PWM)", hex: "#facc15" },
  { nama: "Ungu (SCL/Trig)", hex: "#a855f7" },
  { nama: "Oranye (Relay OUT)", hex: "#f97316" },
];

export const PUSTAKA_RESMI_IOT: {
  label: string;
  cppHeader: string;
  microPythonImport: string;
  wajibUntukTipe: string[];
}[] = [
  {
    label: "DHT Sensor Library (DHT22/11)",
    cppHeader: "#include <DHT.h>",
    microPythonImport: "import dht",
    wajibUntukTipe: ["dht22"],
  },
  {
    label: "ESP32Servo / Servo PWM",
    cppHeader: "#include <ESP32Servo.h>",
    microPythonImport: "from machine import PWM",
    wajibUntukTipe: ["servo", "servo_360"],
  },
  {
    label: "SPI & MFRC522 RFID Reader",
    cppHeader: "#include <SPI.h>\n#include <MFRC522.h>",
    microPythonImport: "from machine import SPI\nimport mfrc522",
    wajibUntukTipe: ["rfid_rc522"],
  },
  {
    label: "Wire & OLED/LCD I2C Display",
    cppHeader: "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>",
    microPythonImport: "from machine import I2C\nimport ssd1306",
    wajibUntukTipe: ["oled_display", "lcd_16x2"],
  },
  {
    label: "WiFi & Blynk / Telegram IoT",
    cppHeader: "#include <WiFi.h>\n#include <UniversalTelegramBot.h>",
    microPythonImport: "import network\nimport urequests",
    wajibUntukTipe: [],
  },
  {
    label: "Machine GPIO, ADC & UART",
    cppHeader: "#include <Arduino.h>",
    microPythonImport: "from machine import Pin, ADC, UART\nimport time",
    wajibUntukTipe: [],
  },
];

export const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: ItemPaletGudang[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit (30 Pin)", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno (28 Pin)", kategori: "Microcontroller" },
    { tipe: "esp8266_nodemcu", label: "NodeMCU ESP8266 (30p)", kategori: "Microcontroller" },
    { tipe: "stm32_bluepill", label: "STM32 BluePill (32p)", kategori: "Microcontroller" },
    { tipe: "raspberry_pico", label: "Raspberry Pi Pico (32p)", kategori: "Microcontroller" },
    { tipe: "relay_1ch", label: "Relay 1-Channel (6p)", kategori: "Modul Relay" },
    { tipe: "relay_2ch", label: "Relay 2-Channel (10p)", kategori: "Modul Relay" },
    { tipe: "relay_4ch", label: "Relay 4-Channel (18p)", kategori: "Modul Relay" },
    { tipe: "ultrasonik", label: "Ultrasonik HC-SR04 (2-400cm)", kategori: "Sensor IoT", defaultSensor: 45 },
    { tipe: "pir_sensor", label: "Sensor Gerak PIR (-60..60°)", kategori: "Sensor IoT", defaultSensor: 0 },
    { tipe: "ir_obstacle", label: "Sensor Infrared IR (2-30cm)", kategori: "Sensor IoT", defaultSensor: 8 },
    { tipe: "ldr_sensor", label: "Sensor Cahaya LDR (0-1000Lx)", kategori: "Sensor IoT", defaultSensor: 450 },
    { tipe: "flame_sensor", label: "Sensor Api Flame (0-100%)", kategori: "Sensor IoT", defaultSensor: 80 },
    { tipe: "dht22", label: "Sensor Suhu DHT22 (-40..80°C)", kategori: "Sensor IoT", defaultSensor: 28.5 },
    { tipe: "soil_moisture", label: "Kelembapan Tanah (0-100%)", kategori: "Sensor IoT", defaultSensor: 65 },
    { tipe: "rain_sensor", label: "Sensor Hujan Rain (0-100%)", kategori: "Sensor IoT", defaultSensor: 70 },
    { tipe: "mq2_gas", label: "Sensor Gas MQ-2 (100-10000ppm)", kategori: "Sensor IoT", defaultSensor: 350 },
    { tipe: "rfid_rc522", label: "RFID Card Reader (6p)", kategori: "Sensor IoT" },
    { tipe: "solenoid_lock", label: "Solenoid Lock 12V (2p ON/OFF)", kategori: "Aktuator & Motor" },
    { tipe: "water_pump", label: "Pompa Air Mini (2p ke Relay)", kategori: "Aktuator & Motor" },
    { tipe: "servo", label: "Servo SG90 180° (Positional)", kategori: "Aktuator & Motor", defaultSensor: 90 },
    { tipe: "servo_360", label: "Servo MG996R 360° (Continuous)", kategori: "Aktuator & Motor", defaultSensor: 60 },
    { tipe: "kipas_dc", label: "Kipas DC (PWM 0-255)", kategori: "Aktuator & Motor", defaultSensor: 200 },
    { tipe: "oled_display", label: "Layar OLED I2C (4p)", kategori: "Aktuator & Motor", defaultSensor: 100 },
    { tipe: "lcd_16x2", label: "LCD 16x2 I2C (4p)", kategori: "Aktuator & Motor", defaultSensor: 25 },
    { tipe: "buzzer", label: "Buzzer Piezo (ON/OFF)", kategori: "Aktuator & Motor" },
    { tipe: "keypad_4x4", label: "Keypad Matriks 4x4 (8p)", kategori: "Pasif & Input" },
    { tipe: "led_hijau", label: "LED Hijau 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "led_merah", label: "LED Merah 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "resistor", label: "Resistor Gelang Warna", kategori: "Pasif & Input", defaultResistor: 220 },
    { tipe: "potensiometer", label: "Potensiometer (ADC 0-4095)", kategori: "Pasif & Input", defaultSensor: 2048 },
  ],
  ewb: [
    { tipe: "vcc_dc", label: "Sumber Tegangan DC", kategori: "Power & Ground", defaultSensor: 12 },
    { tipe: "ac_source", label: "Generator Sinyal AC", kategori: "Power & Ground", defaultSensor: 50 },
    { tipe: "gnd", label: "Ground (GND 0V)", kategori: "Power & Ground" },
    { tipe: "resistor", label: "Resistor 4-Gelang", kategori: "Komponen RLC", defaultResistor: 1000 },
    { tipe: "kapasitor", label: "Kapasitor Elektrolit", kategori: "Komponen RLC", defaultSensor: 100 },
    { tipe: "induktor", label: "Induktor Kumparan", kategori: "Komponen RLC", defaultSensor: 25 },
    { tipe: "dioda", label: "Dioda Penyearah 1N4007", kategori: "Semikonduktor & IC" },
    { tipe: "transistor_npn", label: "Transistor NPN 2N2222", kategori: "Semikonduktor & IC" },
    { tipe: "gerbang_logika", label: "Gerbang AND (7408)", kategori: "Gerbang Logika & Alat" },
    { tipe: "osiloskop", label: "Osiloskop 2-Channel", kategori: "Gerbang Logika & Alat" },
  ],
  matlab: [
    { tipe: "Sine Wave", label: "Sine Wave Generator", kategori: "Sources", defaultSensor: 50 },
    { tipe: "PID Controller", label: "PID Controller", kategori: "Continuous", defaultSensor: 2 },
    { tipe: "Transfer Fcn", label: "Transfer Fcn G(s)", kategori: "Continuous", defaultSensor: 1 },
    { tipe: "Scope Plot", label: "Simulink Scope Viewer", kategori: "Sinks" },
  ],
};

export function konversiCppKeMicroPython(kodeCpp: string, labelBoard: string): string {
  const imports = new Set<string>(["from machine import Pin"]);
  const inisialisasi: string[] = [];
  const barisLoop: string[] = [];

  if (kodeCpp.includes("analogRead")) imports.add("from machine import ADC");
  if (kodeCpp.includes("Servo") || kodeCpp.includes("analogWrite")) imports.add("from machine import PWM");
  if (kodeCpp.includes("Serial2")) imports.add("from machine import UART");
  if (kodeCpp.includes("DHT.h") || kodeCpp.includes("dht.")) imports.add("import dht");
  if (kodeCpp.includes("MFRC522") || kodeCpp.includes("SPI.h")) {
    imports.add("from machine import SPI");
    imports.add("import mfrc522");
  }
  if (kodeCpp.includes("Wire.h") || kodeCpp.includes("LiquidCrystal_I2C")) {
    imports.add("from machine import I2C");
    imports.add("import ssd1306");
  }
  if (kodeCpp.includes("WiFi.h")) imports.add("import network");
  imports.add("import time");

  const defineMap: { [nama: string]: string } = {};
  for (const brs of kodeCpp.split("\n")) {
    const mDef = brs.match(/#define\s+([A-Za-z0-9_]+)\s+([0-9]+)/);
    if (mDef) {
      defineMap[mDef[1]] = mDef[2];
      inisialisasi.push(`${mDef[1]} = ${mDef[2]}`);
    }
    const mPinMode = brs.match(/pinMode\(\s*([A-Za-z0-9_]+)\s*,\s*(OUTPUT|INPUT)/);
    if (mPinMode) {
      const arah = mPinMode[2] === "OUTPUT" ? "Pin.OUT" : "Pin.IN";
      inisialisasi.push(`pin_${mPinMode[1].toLowerCase()} = Pin(${mPinMode[1]}, ${arah})`);
    }
    if (brs.includes("Serial2.begin")) inisialisasi.push("uart2 = UART(2, baudrate=9600, tx=17, rx=16)");
    if (brs.includes("dht.begin")) inisialisasi.push(`sensor_dht = dht.DHT22(Pin(${defineMap["PIN_DHT"] || "15"}))`);
    const mServoAttach = brs.match(/([A-Za-z0-9_]+)\.attach\(\s*([A-Za-z0-9_]+)\s*\)/);
    if (mServoAttach) inisialisasi.push(`servo_pwm = PWM(Pin(${mServoAttach[2]}), freq=50)`);

    const mDigWrite = brs.match(/digitalWrite\(\s*([A-Za-z0-9_]+)\s*,\s*([^)]+)\)/);
    if (mDigWrite) {
      const valPy = mDigWrite[2].includes("HIGH") || mDigWrite[2].trim() === "1" ? "1" : "0";
      barisLoop.push(`    pin_${mDigWrite[1].toLowerCase()}.value(${valPy})`);
    }
    const mServoWrite = brs.match(/\.write\(\s*([0-9]+)\s*\)/);
    if (mServoWrite && !brs.includes("Serial")) {
      const sudut = Number(mServoWrite[1]);
      barisLoop.push(`    servo_pwm.duty(${Math.round(40 + (sudut / 180) * 75)}) # Sudut ${sudut} deg`);
    }
    const mSerialPrint = brs.match(/Serial\.println\((.+)\);/);
    if (mSerialPrint && !brs.includes("setup")) {
      barisLoop.push(`    print(${mSerialPrint[1].replace(/String\(([^)]+)\)/g, "str($1)")})`);
    }
    const mDelay = brs.match(/delay\(\s*([0-9]+)\s*\)/);
    if (mDelay) {
      barisLoop.push(`    time.sleep(${(Number(mDelay[1]) / 1000).toFixed(1).replace(".0", "")})`);
    }
  }

  if (barisLoop.length === 0) {
    barisLoop.push(`    print("[${labelBoard} MicroPython]: Loop aktif...")\n    time.sleep(1)`);
  }

  return `# [MICROPYTHON AUTO-CONVERTED DARI C++] - ${labelBoard.toUpperCase()}
${Array.from(imports).join("\n")}

${inisialisasi.length > 0 ? inisialisasi.join("\n") : "led_builtin = Pin(2, Pin.OUT)"}

print("=== [${labelBoard} MicroPython] READY & RUNNING ===")

while True:
${barisLoop.join("\n")}`;
}

export function konversiMicroPythonKeCpp(kodePy: string, labelBoard: string): string {
  const headers = new Set<string>(["#include <Arduino.h>"]);
  const deklarasiGlobal: string[] = [];
  const isiSetup: string[] = ["  Serial.begin(115200);"];
  const isiLoop: string[] = [];

  if (kodePy.includes("import network")) headers.add("#include <WiFi.h>");
  if (kodePy.includes("import dht")) {
    headers.add("#include <DHT.h>");
    deklarasiGlobal.push("#define PIN_DHT 15\nDHT dht(PIN_DHT, DHT22);");
    isiSetup.push("  dht.begin();");
  }
  if (kodePy.includes("PWM")) {
    headers.add("#include <ESP32Servo.h>");
    deklarasiGlobal.push("Servo myServo;");
    isiSetup.push("  myServo.attach(18);");
  }
  if (kodePy.includes("SPI") || kodePy.includes("mfrc522")) {
    headers.add("#include <SPI.h>\n#include <MFRC522.h>");
  }
  if (kodePy.includes("I2C") || kodePy.includes("ssd1306")) headers.add("#include <Wire.h>");

  for (const b of kodePy.split("\n")) {
    const mPinOut = b.match(/([A-Za-z0-9_]+)\s*=\s*Pin\(\s*([0-9]+)\s*,\s*Pin\.(OUT|IN)\s*\)/);
    if (mPinOut) {
      deklarasiGlobal.push(`#define PIN_${mPinOut[1].toUpperCase()} ${mPinOut[2]}`);
      isiSetup.push(`  pinMode(PIN_${mPinOut[1].toUpperCase()}, ${mPinOut[3] === "OUT" ? "OUTPUT" : "INPUT"});`);
    }
    const mVal = b.match(/([A-Za-z0-9_]+)\.value\(\s*([01])\s*\)/);
    if (mVal) {
      isiLoop.push(`  digitalWrite(PIN_${mVal[1].toUpperCase()}, ${mVal[2] === "1" ? "HIGH" : "LOW"});`);
    }
    const mSleep = b.match(/time\.sleep\(\s*([0-9.]+)\s*\)/);
    if (mSleep) isiLoop.push(`  delay(${Math.round(Number(mSleep[1]) * 1000)});`);
  }

  isiSetup.push(`  Serial.println("=== [${labelBoard} C++] READY & RUNNING ===");`);
  if (isiLoop.length === 0) isiLoop.push("  delay(1000);");

  return `// [C++ ARDUINO AUTO-CONVERTED DARI MICROPYTHON] - ${labelBoard.toUpperCase()}
${Array.from(headers).join("\n")}

${deklarasiGlobal.join("\n")}

void setup() {
${isiSetup.join("\n")}
}

void loop() {
${isiLoop.join("\n")}
}`;
}

export function validasiLibraryMcuKetat(
  mcuNode: NodeKomponenKanvas | undefined,
  bahasa: "cpp" | "micropython",
  kode: string,
  nodesSaatIni: NodeKomponenKanvas[],
  kabelSaatIni: KabelKoneksiItem[]
): string | null {
  if (!mcuNode) return null;
  const idTetangga = kabelSaatIni
    .filter((k) => k.dariId === mcuNode.id || k.keId === mcuNode.id)
    .map((k) => (k.dariId === mcuNode.id ? k.keId : k.dariId));
  const komponenTerhubung = nodesSaatIni.filter((n) => idTetangga.includes(n.id));

  if (bahasa === "cpp") {
    if (!kode.includes("setup(") || !kode.includes("loop(")) {
      return `Compile Error pada ${mcuNode.label} (C++): Fungsi wajib 'void setup()' atau 'void loop()' tidak ditemukan!`;
    }
    for (const comp of komponenTerhubung) {
      if (comp.tipe === "dht22" && !kode.includes("#include <DHT.h>") && !kode.includes('#include "DHT.h"')) {
        return `Compile Error pada ${mcuNode.label}: Sensor '${comp.label}' terhubung, tetapi '#include <DHT.h>' belum ditulis!`;
      }
      if ((comp.tipe === "servo" || comp.tipe === "servo_360") && !kode.includes("#include <ESP32Servo.h>") && !kode.includes("#include <Servo.h>")) {
        return `Compile Error pada ${mcuNode.label}: Motor '${comp.label}' membutuhkan '#include <ESP32Servo.h>' atau '#include <Servo.h>'!`;
      }
      if (comp.tipe === "rfid_rc522" && (!kode.includes("#include <SPI.h>") || !kode.includes("#include <MFRC522.h>"))) {
        return `Compile Error pada ${mcuNode.label}: Modul '${comp.label}' membutuhkan '#include <SPI.h>' dan '#include <MFRC522.h>'!`;
      }
      if ((comp.tipe === "oled_display" || comp.tipe === "lcd_16x2") && !kode.includes("#include <Wire.h>")) {
        return `Compile Error pada ${mcuNode.label}: Layar I2C '${comp.label}' membutuhkan '#include <Wire.h>'!`;
      }
    }
  } else {
    if (!kode.includes("import machine") && !kode.includes("from machine import")) {
      return `MicroPython ImportError pada ${mcuNode.label}: Modul wajib 'from machine import Pin' belum ditulis!`;
    }
    for (const comp of komponenTerhubung) {
      if (comp.tipe === "dht22" && !kode.includes("import dht")) {
        return `MicroPython ImportError pada ${mcuNode.label}: Sensor '${comp.label}' terhubung, tetapi 'import dht' belum ditulis!`;
      }
      if ((comp.tipe === "servo" || comp.tipe === "servo_360") && !kode.includes("PWM")) {
        return `MicroPython NameError pada ${mcuNode.label}: Motor '${comp.label}' membutuhkan 'from machine import PWM'!`;
      }
      if (comp.tipe === "rfid_rc522" && !kode.includes("SPI")) {
        return `MicroPython ImportError pada ${mcuNode.label}: Modul RFID '${comp.label}' membutuhkan 'from machine import SPI'!`;
      }
    }
  }
  return null;
}

export function cariKoordinatPinAbsolut(
  node: NodeKomponenKanvas,
  idAtauNamaPin: string
): { x: number; y: number; pinObj: TitikPinFisik } {
  const layout = ambilLayoutFisikKomponen(node.tipe);
  const found =
    layout.pins.find((p) => p.idPin === idAtauNamaPin || p.nama === idAtauNamaPin) ||
    layout.pins[0];
  return {
    x: node.x + found.x,
    y: node.y + found.y + 18,
    pinObj: found,
  };
}

export function bangunJalurSikuWokwi(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  titikSiku?: TitikSikuKabel[]
): { d: string; daftarHandle: TitikSikuKabel[]; titikTengah: TitikSikuKabel } {
  const handles: TitikSikuKabel[] =
    titikSiku && titikSiku.length > 0
      ? titikSiku
      : [
          { x: Math.round((x1 + x2) / 2), y: y1 },
          { x: Math.round((x1 + x2) / 2), y: y2 },
        ];

  const semuaTitik: TitikSikuKabel[] = [{ x: x1, y: y1 }];
  for (let i = 0; i < handles.length; i++) {
    const prev = semuaTitik[semuaTitik.length - 1];
    const curr = handles[i];
    if (prev.x !== curr.x && prev.y !== curr.y) {
      semuaTitik.push({ x: curr.x, y: prev.y });
    }
    semuaTitik.push({ x: curr.x, y: curr.y });
  }
  const last = semuaTitik[semuaTitik.length - 1];
  if (last.x !== x2 && last.y !== y2) {
    semuaTitik.push({ x: x2, y: last.y });
  }
  semuaTitik.push({ x: x2, y: y2 });

  const d = semuaTitik
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
    .join(" ");

  const tengah =
    handles[Math.floor(handles.length / 2)] || {
      x: Math.round((x1 + x2) / 2),
      y: Math.round((y1 + y2) / 2),
    };

  return { d, daftarHandle: handles, titikTengah: tengah };
}