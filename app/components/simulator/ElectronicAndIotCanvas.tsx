"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Trash2,
  PlusCircle,
  RotateCcw,
  Sliders,
  Move,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  Cable,
  Info,
  Wifi,
  CornerDownRight,
} from "lucide-react";
import {
  VisualKomponenRealistis,
  ResistorVisualSvg,
  hitungGelangWarnaResistor,
} from "./ResistorVisualSvg";
import {
  ambilInfoPinKomponen,
  IotCloudBlynkPanel,
} from "./IotCloudBlynkPanel";

export interface TitikSikuKabel {
  x: number;
  y: number;
}

export interface NodeKomponenKanvas {
  id: string;
  tipe: string;
  label: string;
  x: number;
  y: number;
  nilaiResistor?: number;
  nilaiSensor?: number;
  nyala?: boolean;
}

export interface KabelKoneksiItem {
  id: string;
  dariId: string;
  pinAsal: string;
  keId: string;
  pinTujuan: string;
  warna: string;
  titikSiku?: TitikSikuKabel[]; // Array koordinat siku kabel yang bisa ditarik-tarik seperti Wokwi
}

interface CanvasProps {
  mode: "wokwi" | "ewb" | "matlab";
  onUpdateKodeDariCloud?: (kodeBaru: string) => void;
}

interface ItemPaletGudang {
  tipe: string;
  label: string;
  kategori: string;
  defaultResistor?: number;
  defaultSensor?: number;
}

const PILIHAN_WARNA_KABEL = [
  { nama: "Merah (VCC/+)", hex: "#ef4444" },
  { nama: "Hitam/Abu (GND/-)", hex: "#94a3b8" },
  { nama: "Biru (Data/GPIO)", hex: "#38bdf8" },
  { nama: "Hijau (TX/SDA)", hex: "#22c55e" },
  { nama: "Kuning (RX/PWM)", hex: "#facc15" },
  { nama: "Ungu (SCL/Trig)", hex: "#a855f7" },
  { nama: "Oranye (Sinyal)", hex: "#f97316" },
];

// Gudang Komponen Diperbanyak (Termasuk 5 Jenis Mikrokontroler untuk Dual/Multi-MCU TX-RX)
const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: ItemPaletGudang[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit V1 (WiFi)", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno R3", kategori: "Microcontroller" },
    { tipe: "esp8266_nodemcu", label: "NodeMCU ESP8266", kategori: "Microcontroller" },
    { tipe: "stm32_bluepill", label: "STM32 BluePill ARM", kategori: "Microcontroller" },
    { tipe: "raspberry_pico", label: "Raspberry Pi Pico", kategori: "Microcontroller" },
    { tipe: "breadboard", label: "Breadboard Mini", kategori: "Microcontroller" },
    {
      tipe: "dht22",
      label: "Sensor Suhu DHT22",
      kategori: "Sensor IoT",
      defaultSensor: 29,
    },
    {
      tipe: "ultrasonik",
      label: "Ultrasonik HC-SR04",
      kategori: "Sensor IoT",
      defaultSensor: 45,
    },
    {
      tipe: "mq2_gas",
      label: "Sensor Gas & Asap MQ-2",
      kategori: "Sensor IoT",
      defaultSensor: 320,
    },
    { tipe: "pir_sensor", label: "Sensor Gerak PIR", kategori: "Sensor IoT" },
    {
      tipe: "ldr_sensor",
      label: "Sensor Cahaya LDR",
      kategori: "Sensor IoT",
      defaultSensor: 500,
    },
    {
      tipe: "oled_display",
      label: "Layar OLED I2C",
      kategori: "Aktuator & Layar",
      defaultSensor: 100,
    },
    {
      tipe: "lcd_16x2",
      label: "LCD 16x2 I2C",
      kategori: "Aktuator & Layar",
      defaultSensor: 25,
    },
    {
      tipe: "neopixel_ring",
      label: "NeoPixel RGB Ring",
      kategori: "Aktuator & Layar",
    },
    {
      tipe: "seven_segment",
      label: "7-Segment Display",
      kategori: "Aktuator & Layar",
      defaultSensor: 8,
    },
    {
      tipe: "servo",
      label: "Motor Servo SG90",
      kategori: "Aktuator & Layar",
      defaultSensor: 90,
    },
    {
      tipe: "stepper_motor",
      label: "Stepper Motor NEMA17",
      kategori: "Aktuator & Layar",
      defaultSensor: 45,
    },
    {
      tipe: "l298n_driver",
      label: "Driver Motor L298N",
      kategori: "Aktuator & Layar",
    },
    { tipe: "buzzer", label: "Buzzer Piezo Alarm", kategori: "Aktuator & Layar" },
    { tipe: "relay_5v", label: "Modul Relay 5V IoT", kategori: "Aktuator & Layar" },
    { tipe: "keypad_4x4", label: "Keypad Matriks 4x4", kategori: "Pasif & Input" },
    { tipe: "led_hijau", label: "LED Hijau 5mm", kategori: "Pasif & Input" },
    { tipe: "led_merah", label: "LED Merah 5mm", kategori: "Pasif & Input" },
    { tipe: "led_kuning", label: "LED Kuning 5mm", kategori: "Pasif & Input" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif & Input",
      defaultResistor: 220,
    },
    {
      tipe: "potensiometer",
      label: "Potensiometer Analog",
      kategori: "Pasif & Input",
      defaultSensor: 50,
    },
    { tipe: "push_button", label: "Sakelar Push Button", kategori: "Pasif & Input" },
  ],
  ewb: [
    {
      tipe: "vcc_dc",
      label: "Sumber Tegangan DC",
      kategori: "Power & Ground",
      defaultSensor: 12,
    },
    {
      tipe: "ac_source",
      label: "Generator Sinyal AC",
      kategori: "Power & Ground",
      defaultSensor: 50,
    },
    {
      tipe: "trafo_stepdown",
      label: "Transformator CT 12V",
      kategori: "Power & Ground",
      defaultSensor: 12,
    },
    { tipe: "gnd", label: "Ground (GND 0V)", kategori: "Power & Ground" },
    {
      tipe: "resistor",
      label: "Resistor 4-Gelang",
      kategori: "Komponen RLC",
      defaultResistor: 1000,
    },
    {
      tipe: "kapasitor",
      label: "Kapasitor Elektrolit",
      kategori: "Komponen RLC",
      defaultSensor: 10,
    },
    {
      tipe: "induktor",
      label: "Induktor Kumparan",
      kategori: "Komponen RLC",
      defaultSensor: 25,
    },
    {
      tipe: "potensiometer",
      label: "Resistor Variabel (Pot)",
      kategori: "Komponen RLC",
      defaultSensor: 50,
    },
    { tipe: "dioda", label: "Dioda Penyearah 1N4007", kategori: "Semikonduktor & IC" },
    {
      tipe: "transistor_npn",
      label: "Transistor NPN 2N2222",
      kategori: "Semikonduktor & IC",
    },
    { tipe: "opamp_741", label: "Op-Amp Analog LM741", kategori: "Semikonduktor & IC" },
    { tipe: "ic_ne555", label: "IC Timer NE555P", kategori: "Semikonduktor & IC" },
    {
      tipe: "gerbang_logika",
      label: "Gerbang AND (7408)",
      kategori: "Gerbang Logika & Alat",
    },
    { tipe: "ic_or", label: "Gerbang OR (7432)", kategori: "Gerbang Logika & Alat" },
    { tipe: "ic_xor", label: "Gerbang XOR (7486)", kategori: "Gerbang Logika & Alat" },
    {
      tipe: "multimeter",
      label: "Multimeter Digital",
      kategori: "Gerbang Logika & Alat",
      defaultSensor: 12,
    },
    {
      tipe: "osiloskop",
      label: "Osiloskop 2-Channel",
      kategori: "Gerbang Logika & Alat",
    },
    {
      tipe: "func_generator",
      label: "Function Generator",
      kategori: "Gerbang Logika & Alat",
      defaultSensor: 100,
    },
    {
      tipe: "led_hijau",
      label: "Lampu Indikator Uji",
      kategori: "Gerbang Logika & Alat",
    },
  ],
  matlab: [
    {
      tipe: "Sine Wave",
      label: "Sine Wave Generator",
      kategori: "Sources",
      defaultSensor: 50,
    },
    {
      tipe: "Step Input",
      label: "Step Reference u(t)",
      kategori: "Sources",
      defaultSensor: 1,
    },
    {
      tipe: "PID Controller",
      label: "PID Controller",
      kategori: "Continuous",
      defaultSensor: 2,
    },
    {
      tipe: "Transfer Fcn",
      label: "Transfer Fcn G(s)",
      kategori: "Continuous",
      defaultSensor: 1,
    },
    { tipe: "Integrator", label: "Integrator (1/s)", kategori: "Continuous" },
    { tipe: "Derivative", label: "Derivative (du/dt)", kategori: "Continuous" },
    { tipe: "Gain K", label: "Gain Amplifier (K)", kategori: "Math & Logic" },
    { tipe: "Sum (+ / -)", label: "Sum Junction (+/-)", kategori: "Math & Logic" },
    { tipe: "Mux Signal", label: "Signal Multiplexer", kategori: "Math & Logic" },
    { tipe: "Scope Plot", label: "Simulink Scope Viewer", kategori: "Sinks" },
    { tipe: "To Workspace", label: "Export to Workspace", kategori: "Sinks" },
  ],
};

// Rangkaian Default Wokwi Langsung Menampilkan 2 Mikrokontroler (ESP32 + Arduino Uno Terhubung TX/RX)
const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: [
    { id: "wk-1", tipe: "esp32", label: "MCU #1: ESP32 Master", x: 25, y: 40, nyala: true },
    {
      id: "wk-2",
      tipe: "arduino_uno",
      label: "MCU #2: Arduino Uno Slave",
      x: 25,
      y: 235,
      nyala: true,
    },
    {
      id: "wk-3",
      tipe: "resistor",
      label: "R1 Pembatas Arus",
      x: 270,
      y: 35,
      nilaiResistor: 330,
    },
    { id: "wk-4", tipe: "led_hijau", label: "LED Indikator", x: 465, y: 30, nyala: true },
    {
      id: "wk-5",
      tipe: "dht22",
      label: "DHT22 Suhu",
      x: 285,
      y: 195,
      nilaiSensor: 31,
    },
    {
      id: "wk-6",
      tipe: "servo",
      label: "Servo Pintu",
      x: 455,
      y: 205,
      nilaiSensor: 90,
    },
  ],
  ewb: [
    {
      id: "ewb-1",
      tipe: "vcc_dc",
      label: "Sumber Vcc 12V",
      x: 30,
      y: 80,
      nilaiSensor: 12,
    },
    {
      id: "ewb-2",
      tipe: "resistor",
      label: "Resistor R1 (Atas)",
      x: 220,
      y: 45,
      nilaiResistor: 1000,
    },
    {
      id: "ewb-3",
      tipe: "resistor",
      label: "Resistor R2 (Beban)",
      x: 220,
      y: 195,
      nilaiResistor: 2200,
    },
    {
      id: "ewb-4",
      tipe: "osiloskop",
      label: "Osiloskop Tektronix",
      x: 440,
      y: 110,
      nyala: true,
    },
  ],
  matlab: [
    {
      id: "sim-1",
      tipe: "Sine Wave",
      label: "Input Referensi r(t)",
      x: 25,
      y: 115,
      nilaiSensor: 10,
    },
    {
      id: "sim-2",
      tipe: "PID Controller",
      label: "Blok Kendali PID",
      x: 205,
      y: 115,
      nilaiSensor: 5,
    },
    {
      id: "sim-3",
      tipe: "Transfer Fcn",
      label: "Plant Motor DC",
      x: 385,
      y: 115,
      nilaiSensor: 1,
    },
    {
      id: "sim-4",
      tipe: "Scope Plot",
      label: "Output Scope y(t)",
      x: 545,
      y: 115,
    },
  ],
};

// Kabel Default Menggunakan Jalur Siku Orthogonal (titikSiku) yang Bisa Ditarik-Tarik
const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: [
    {
      id: "w-txrx-1",
      dariId: "wk-1",
      pinAsal: "TX2 (GPIO17)",
      keId: "wk-2",
      pinTujuan: "D0 (RX)",
      warna: "#22c55e",
      titikSiku: [
        { x: 200, y: 95 },
        { x: 200, y: 270 },
      ],
    },
    {
      id: "w-txrx-2",
      dariId: "wk-2",
      pinAsal: "D1 (TX)",
      keId: "wk-1",
      pinTujuan: "RX2 (GPIO16)",
      warna: "#facc15",
      titikSiku: [
        { x: 220, y: 295 },
        { x: 220, y: 115 },
      ],
    },
    {
      id: "w-1",
      dariId: "wk-1",
      pinAsal: "GPIO2 (LED)",
      keId: "wk-3",
      pinTujuan: "Pin 1 (Kaki Kiri)",
      warna: "#38bdf8",
      titikSiku: [{ x: 245, y: 75 }],
    },
    {
      id: "w-2",
      dariId: "wk-3",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "wk-4",
      pinTujuan: "Anoda (+)",
      warna: "#ef4444",
      titikSiku: [{ x: 430, y: 75 }],
    },
    {
      id: "w-3",
      dariId: "wk-2",
      pinAsal: "D2",
      keId: "wk-5",
      pinTujuan: "2: DATA (SDA)",
      warna: "#a855f7",
      titikSiku: [{ x: 255, y: 260 }],
    },
  ],
  ewb: [
    {
      id: "e-1",
      dariId: "ewb-1",
      pinAsal: "Terminal Positif (+V)",
      keId: "ewb-2",
      pinTujuan: "Pin 1 (Kaki Kiri)",
      warna: "#ef4444",
      titikSiku: [{ x: 180, y: 95 }],
    },
    {
      id: "e-2",
      dariId: "ewb-2",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "ewb-3",
      pinTujuan: "Pin 1 (Kaki Kiri)",
      warna: "#38bdf8",
      titikSiku: [{ x: 375, y: 95 }, { x: 375, y: 225 }],
    },
    {
      id: "e-3",
      dariId: "ewb-2",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "ewb-4",
      pinTujuan: "Channel 1 (CH1)",
      warna: "#22c55e",
      titikSiku: [{ x: 410, y: 150 }],
    },
  ],
  matlab: [
    {
      id: "m-1",
      dariId: "sim-1",
      pinAsal: "Out1",
      keId: "sim-2",
      pinTujuan: "In1 (Error)",
      warna: "#f97316",
      titikSiku: [{ x: 185, y: 160 }],
    },
    {
      id: "m-2",
      dariId: "sim-2",
      pinAsal: "Out1 (u)",
      keId: "sim-3",
      pinTujuan: "In1",
      warna: "#38bdf8",
      titikSiku: [{ x: 365, y: 160 }],
    },
    {
      id: "m-3",
      dariId: "sim-3",
      pinAsal: "Out1 (y)",
      keId: "sim-4",
      pinTujuan: "Scope In",
      warna: "#22c55e",
      titikSiku: [{ x: 525, y: 160 }],
    },
  ],
};

// Fungsi Pembantu: Membangun Path SVG Orthogonal Siku-Siku (90 Derajat) ala Wokwi
function bangunJalurSikuWokwi(
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
    // Buat patahan siku 90 derajat antara titik sebelumnya dan handle saat ini
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

export const ElectronicAndIotCanvas: React.FC<CanvasProps> = ({
  mode,
  onUpdateKodeDariCloud,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [daftarNode, setDaftarNode] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
  }>(KOMPONEN_AWAL_PER_MODE);

  const [daftarKabel, setDaftarKabel] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
  }>(KABEL_AWAL_PER_MODE);

  const [kategoriPaletAktif, setKategoriPaletAktif] = useState<string>("Semua");
  const [cariKomponen, setCariKomponen] = useState<string>("");

  const [ukuranKanvas, setUkuranKanvas] = useState<"kecil" | "sedang" | "besar" | "penuh">(
    "sedang"
  );
  const [skalaZoom, setSkalaZoom] = useState<number>(1);

  const [idKomponenTerpilih, setIdKomponenTerpilih] = useState<string | null>(
    KOMPONEN_AWAL_PER_MODE[mode][0]?.id || null
  );
  const [sedangGeserId, setSedangGeserId] = useState<string | null>(null);

  // State Interaktif Kabel: Klik Kabel untuk Munculkan Siku & Ganti Warna Langsung
  const [idKabelTerpilih, setIdKabelTerpilih] = useState<string | null>(null);
  const [sedangGeserSiku, setSedangGeserSiku] = useState<{
    kabelId: string;
    indeksTitik: number;
  } | null>(null);

  // State Tarik Kabel Langsung dari Pin Komponen ke Komponen Lain
  const [warnaKabelAktif, setWarnaKabelAktif] = useState<string>("#22c55e");
  const [sedangTarikKabelDariPin, setSedangTarikKabelDariPin] = useState<{
    nodeId: string;
    namaPin: string;
    xAsal: number;
    yAsal: number;
  } | null>(null);
  const [posisiKursorKanvas, setPosisiKursorKanvas] = useState<TitikSikuKabel>({
    x: 200,
    y: 150,
  });

  // State Form Manual Tarik Garis
  const [pinAsalPilih, setPinAsalPilih] = useState<string>("TX2 (GPIO17)");
  const [idTujuanManual, setIdTujuanManual] = useState<string>(
    KOMPONEN_AWAL_PER_MODE[mode][1]?.id || ""
  );
  const [pinTujuanPilih, setPinTujuanPilih] = useState<string>("D0 (RX)");

  const [bukaDashboardIot, setBukaDashboardIot] = useState<boolean>(true);

  useEffect(() => {
    setKategoriPaletAktif("Semua");
    setCariKomponen("");
    const listAwal = KOMPONEN_AWAL_PER_MODE[mode];
    setIdKomponenTerpilih(listAwal[0]?.id || null);
    setIdTujuanManual(listAwal[1]?.id || "");
    setIdKabelTerpilih(null);
    setSedangTarikKabelDariPin(null);
  }, [mode]);

  const paletModeIni = PALET_KOMPONEN[mode] || [];
  const daftarKategoriUnik = [
    "Semua",
    ...Array.from(new Set(paletModeIni.map((item) => item.kategori))),
  ];

  const komponenPaletTersaring = paletModeIni.filter((item) => {
    const cocokKategori =
      kategoriPaletAktif === "Semua" || item.kategori === kategoriPaletAktif;
    const cocokKata =
      item.label.toLowerCase().includes(cariKomponen.toLowerCase()) ||
      item.kategori.toLowerCase().includes(cariKomponen.toLowerCase());
    return cocokKategori && cocokKata;
  });

  const nodesSaatIni = daftarNode[mode] || [];
  const kabelSaatIni = daftarKabel[mode] || [];
  const komponenTerpilih =
    nodesSaatIni.find((n) => n.id === idKomponenTerpilih) || nodesSaatIni[0] || null;
  const kabelTerpilihObj =
    kabelSaatIni.find((k) => k.id === idKabelTerpilih) || null;

  const infoPinTerpilih = komponenTerpilih
    ? ambilInfoPinKomponen(komponenTerpilih.tipe)
    : null;

  const nodeTujuanManualObj =
    nodesSaatIni.find((n) => n.id === idTujuanManual) || nodesSaatIni[1] || null;
  const infoPinTujuanObj = nodeTujuanManualObj
    ? ambilInfoPinKomponen(nodeTujuanManualObj.tipe)
    : null;

  const tinggiKanvasPx =
    ukuranKanvas === "kecil"
      ? "h-[350px]"
      : ukuranKanvas === "sedang"
      ? "h-[480px]"
      : ukuranKanvas === "besar"
      ? "h-[640px]"
      : "h-[800px]";

  const tambahKomponenKeKanvas = (
    tipe: string,
    label: string,
    xPos = 150,
    yPos = 100,
    defaultResistor?: number,
    defaultSensor?: number
  ) => {
    const baru: NodeKomponenKanvas = {
      id: `${mode}-node-${Date.now()}`,
      tipe,
      label: `${label} #${nodesSaatIni.length + 1}`,
      x: Math.max(15, Math.min(600, xPos)),
      y: Math.max(15, Math.min(480, yPos)),
      nilaiResistor: defaultResistor ?? (tipe === "resistor" ? 1000 : undefined),
      nilaiSensor: defaultSensor ?? 25,
      nyala: true,
    };
    setDaftarNode({
      ...daftarNode,
      [mode]: [...nodesSaatIni, baru],
    });
    setIdKomponenTerpilih(baru.id);
  };

  const handleDropDariPalet = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/hibahilmu-component");
    if (!raw || !containerRef.current) return;
    try {
      const parsed = JSON.parse(raw);
      const rect = containerRef.current.getBoundingClientRect();
      const xDrop = (e.clientX - rect.left) / skalaZoom - 55;
      const yDrop = (e.clientY - rect.top) / skalaZoom - 35;
      tambahKomponenKeKanvas(
        parsed.tipe,
        parsed.label,
        xDrop,
        yDrop,
        parsed.defaultResistor,
        parsed.defaultSensor
      );
    } catch {}
  };

  // Fungsi Mouse Move Utama di Kanvas: Geser Komponen, Geser Titik Siku Kabel, atau Preview Tarik Kabel
  const handleMouseMoveKanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = Math.round((e.clientX - rect.left) / skalaZoom);
    const mouseY = Math.round((e.clientY - rect.top) / skalaZoom);

    if (sedangTarikKabelDariPin) {
      setPosisiKursorKanvas({ x: mouseX, y: mouseY });
    }

    if (sedangGeserSiku) {
      setDaftarKabel({
        ...daftarKabel,
        [mode]: kabelSaatIni.map((kbl) => {
          if (kbl.id !== sedangGeserSiku.kabelId) return kbl;
          const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
          const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
          const x1 = (asal?.x || 0) + 70;
          const y1 = (asal?.y || 0) + 50;
          const x2 = (tujuan?.x || 0) + 70;
          const y2 = (tujuan?.y || 0) + 50;
          const listSikuLama =
            kbl.titikSiku && kbl.titikSiku.length > 0
              ? [...kbl.titikSiku]
              : [
                  { x: Math.round((x1 + x2) / 2), y: y1 },
                  { x: Math.round((x1 + x2) / 2), y: y2 },
                ];
          listSikuLama[sedangGeserSiku.indeksTitik] = {
            x: Math.max(10, mouseX),
            y: Math.max(10, mouseY),
          };
          return { ...kbl, titikSiku: listSikuLama };
        }),
      });
      return;
    }

    if (sedangGeserId) {
      const xBaru = Math.max(
        10,
        Math.min(rect.width / skalaZoom - 130, mouseX - 60)
      );
      const yBaru = Math.max(
        10,
        Math.min(rect.height / skalaZoom - 90, mouseY - 40)
      );
      setDaftarNode({
        ...daftarNode,
        [mode]: nodesSaatIni.map((n) =>
          n.id === sedangGeserId ? { ...n, x: xBaru, y: yBaru } : n
        ),
      });
    }
  };

  const updatePropertiKomponen = (
    id: string,
    perubahan: Partial<NodeKomponenKanvas>
  ) => {
    setDaftarNode({
      ...daftarNode,
      [mode]: nodesSaatIni.map((n) => (n.id === id ? { ...n, ...perubahan } : n)),
    });
  };

  const tambahKabelKoneksi = (
    dariId: string,
    pinDari: string,
    keId: string,
    pinKe: string,
    warna: string
  ) => {
    if (!dariId || !keId || dariId === keId) return;
    const asal = nodesSaatIni.find((n) => n.id === dariId);
    const tujuan = nodesSaatIni.find((n) => n.id === keId);
    const midX = Math.round(((asal?.x || 100) + (tujuan?.x || 300)) / 2) + 60;
    const yAsal = (asal?.y || 100) + 50;
    const yTujuan = (tujuan?.y || 200) + 50;

    const baru: KabelKoneksiItem = {
      id: "kbl-" + Date.now(),
      dariId,
      pinAsal: pinDari,
      keId,
      pinTujuan: pinKe,
      warna,
      titikSiku: [
        { x: midX, y: yAsal },
        { x: midX, y: yTujuan },
      ],
    };
    setDaftarKabel({
      ...daftarKabel,
      [mode]: [...kabelSaatIni, baru],
    });
    setIdKabelTerpilih(baru.id);
  };

  const ubahWarnaKabel = (kabelId: string, warnaBaru: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.map((k) =>
        k.id === kabelId ? { ...k, warna: warnaBaru } : k
      ),
    });
  };

  const tambahTitikSikuPadaKabel = (kabelId: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.map((k) => {
        if (k.id !== kabelId) return k;
        const sikuSaatIni = k.titikSiku || [{ x: 250, y: 150 }];
        const terakhir = sikuSaatIni[sikuSaatIni.length - 1] || { x: 250, y: 150 };
        return {
          ...k,
          titikSiku: [...sikuSaatIni, { x: terakhir.x + 35, y: terakhir.y + 35 }],
        };
      }),
    });
  };

  const hapusKabel = (kabelId: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.filter((k) => k.id !== kabelId),
    });
    if (idKabelTerpilih === kabelId) setIdKabelTerpilih(null);
  };

  const semuaResistorKanvas = nodesSaatIni.filter((n) => n.tipe === "resistor");
  const totalOhmKanvas = semuaResistorKanvas.reduce(
    (acc, r) => acc + (r.nilaiResistor || 1000),
    0
  );
  const sumberVcc =
    nodesSaatIni.find((n) => n.tipe === "vcc_dc")?.nilaiSensor || 12;
  const arusRangkaianMa =
    totalOhmKanvas > 0 ? (sumberVcc / totalOhmKanvas) * 1000 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-indigo-500/40 space-y-6 shadow-2xl">
        {/* HEADER BAR MEJA KERJA & KONTROL UKURAN KANVAS */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            {mode === "wokwi" ? (
              <Cpu className="w-6 h-6 text-emerald-400" />
            ) : mode === "ewb" ? (
              <Zap className="w-6 h-6 text-amber-400" />
            ) : (
              <Activity className="w-6 h-6 text-orange-400" />
            )}
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                Wokwi-Style Orthogonal Wire Editor • Dual-MCU TX/RX Ready
              </span>
              <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
                {mode === "wokwi"
                  ? "Wokwi IoT Studio (Tarik Kabel Langsung dari Pin, Edit Siku Kabel & Dual-MCU TX/RX)"
                  : mode === "ewb"
                  ? "EWB (Electronics Workbench) — Rangkaian RLC, Resistor 4-Gelang & Kabel Siku"
                  : "MATLAB Simulink — Diagram Blok Sistem Kendali PID & Pengolahan Sinyal"}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {mode === "wokwi" && (
              <button
                type="button"
                onClick={() => setBukaDashboardIot(!bukaDashboardIot)}
                className={`px-3 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer ${
                  bukaDashboardIot
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-emerald-300"
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                {bukaDashboardIot ? "Tutup IoT Cloud/Blynk" : "Buka Dashboard IoT & Blynk"}
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2">
                Ukuran Kanvas:
              </span>
              {(
                [
                  { id: "kecil", label: "Kecil" },
                  { id: "sedang", label: "Sedang" },
                  { id: "besar", label: "Besar" },
                  { id: "penuh", label: "Penuh" },
                ] as const
              ).map((uk) => (
                <button
                  key={uk.id}
                  type="button"
                  onClick={() => setUkuranKanvas(uk.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-black text-[11px] cursor-pointer transition ${
                    ukuranKanvas === uk.id
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {uk.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSkalaZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-bold px-1.5 text-amber-300">
                {Math.round(skalaZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setSkalaZoom((z) => Math.min(1.35, +(z + 0.15).toFixed(2)))
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setDaftarNode({
                  ...daftarNode,
                  [mode]: KOMPONEN_AWAL_PER_MODE[mode],
                });
                setDaftarKabel({
                  ...daftarKabel,
                  [mode]: KABEL_AWAL_PER_MODE[mode],
                });
                setSkalaZoom(1);
                setIdKabelTerpilih(null);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* GUDANG KOMPONEN BERKATEGORI + PREVIEW GAMBAR MINI */}
        <div className="bg-slate-950/90 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Move className="w-4 h-4 text-amber-400" />
              <span className="font-black uppercase text-amber-300">
                Gudang Komponen ({komponenPaletTersaring.length} Item — Bisa Pasang 2+
                Mikrokontroler untuk UART TX/RX):
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cariKomponen}
                onChange={(e) => setCariKomponen(e.target.value)}
                placeholder="Cari ESP32, Arduino, STM32, Sensor..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0 mr-1" />
            {daftarKategoriUnik.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setKategoriPaletAktif(kat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                  kategoriPaletAktif === kat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {komponenPaletTersaring.map((item, idx) => {
              const infoPinMini = ambilInfoPinKomponen(item.tipe);
              return (
                <div
                  key={`${item.tipe}-${idx}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/hibahilmu-component",
                      JSON.stringify(item)
                    );
                  }}
                  onClick={() =>
                    tambahKomponenKeKanvas(
                      item.tipe,
                      item.label,
                      80 + (idx % 6) * 65,
                      70 + Math.floor(idx / 6) * 60,
                      item.defaultResistor,
                      item.defaultSensor
                    )
                  }
                  className="p-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-950/90 border border-slate-800 hover:border-emerald-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1 transition group shadow-xs"
                  title={`${item.label} (${infoPinMini.jumlahPin} Pin) — ${infoPinMini.fungsiSingkat}`}
                >
                  <div className="w-full flex justify-between items-center text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300">
                    <span className="truncate">{item.kategori}</span>
                    <span className="text-amber-300 shrink-0">{infoPinMini.jumlahPin}p</span>
                  </div>

                  <div className="h-12 flex items-center justify-center py-0.5 group-hover:scale-105 transition-transform">
                    <VisualKomponenRealistis
                      tipe={item.tipe}
                      nilaiResistor={item.defaultResistor || 220}
                      nilaiSensor={item.defaultSensor || 25}
                      nyala={true}
                      ukuran="ikon"
                    />
                  </div>

                  <div className="font-bold text-[10px] text-white group-hover:text-emerald-300 leading-tight line-clamp-1">
                    {item.label}
                  </div>

                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 font-black">
                    <PlusCircle className="w-2.5 h-2.5" /> Tarik / Klik
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BAR TARIK GARIS CEPAT & PILIH WARNA KABEL DEFAULT */}
        <div className="bg-slate-950/95 p-4 rounded-3xl border border-indigo-500/30 space-y-3 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Cable className="w-4 h-4 text-sky-400" />
              <span className="font-black uppercase text-sky-300">
                Cara Cepat Tarik Kabel: Klik Badge Pin di Bawah Komponen Kanvas ➔ Arahkan ke Pin
                Komponen Tujuan!
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                Warna Kabel Baru:
              </span>
              {PILIHAN_WARNA_KABEL.map((w) => (
                <button
                  key={w.hex}
                  type="button"
                  onClick={() => {
                    setWarnaKabelAktif(w.hex);
                    if (idKabelTerpilih) ubahWarnaKabel(idKabelTerpilih, w.hex);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 border cursor-pointer ${
                    warnaKabelAktif === w.hex
                      ? "bg-white text-slate-950 border-white shadow-sm"
                      : "bg-slate-900 text-slate-300 border-slate-800"
                  }`}
                >
                  <span
                    style={{ backgroundColor: w.hex }}
                    className="w-3 h-3 rounded-full inline-block"
                  />
                  <span>{w.nama}</span>
                </button>
              ))}
            </div>
          </div>

          {sedangTarikKabelDariPin && (
            <div className="p-2.5 rounded-xl bg-emerald-600/30 border border-emerald-400 text-xs font-black text-emerald-200 flex justify-between items-center animate-pulse">
              <span>
                🔌 Sedang menarik kabel dari Pin [{sedangTarikKabelDariPin.namaPin}]... Klik salah
                satu Pin atau Komponen tujuan di kanvas!
              </span>
              <button
                type="button"
                onClick={() => setSedangTarikKabelDariPin(null)}
                className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-[10px] cursor-pointer"
              >
                Batalkan (ESC)
              </button>
            </div>
          )}
        </div>

        {/* ====================================================================
            AREA UTAMA: KANVAS DRAG & DROP (8 KOLOM) + INSPEKTOR & PINOUT (4 KOLOM)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KANVAS DRAG-AND-DROP INTERAKTIF */}
          <div
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropDariPalet}
            onMouseMove={handleMouseMoveKanvas}
            onMouseUp={() => {
              setSedangGeserId(null);
              setSedangGeserSiku(null);
            }}
            onMouseLeave={() => {
              setSedangGeserId(null);
              setSedangGeserSiku(null);
            }}
            onClick={() => {
              setIdKabelTerpilih(null);
            }}
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-8"
            } ${tinggiKanvasPx} rounded-3xl bg-[#070d19] border-2 border-dashed border-slate-700 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-all duration-200`}
          >
            {/* FLOATING POP-UP TOOLBAR SAAT KABEL DIKLIK (GANTI WARNA LANGSUNG & TAMBAH SIKU) */}
            {kabelTerpilihObj && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="sticky top-3 left-3 z-30 inline-flex flex-wrap items-center gap-2 bg-slate-900/95 border-2 border-amber-400 px-3.5 py-2 rounded-2xl shadow-2xl text-xs ml-3 mt-3"
              >
                <span className="font-black text-amber-300 flex items-center gap-1">
                  <CornerDownRight className="w-3.5 h-3.5" /> Edit Kabel [{kabelTerpilihObj.pinAsal}{" "}
                  ➔ {kabelTerpilihObj.pinTujuan}]:
                </span>
                <div className="flex items-center gap-1">
                  {PILIHAN_WARNA_KABEL.map((w) => (
                    <button
                      key={w.hex}
                      type="button"
                      onClick={() => ubahWarnaKabel(kabelTerpilihObj.id, w.hex)}
                      style={{ backgroundColor: w.hex }}
                      className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                        kabelTerpilihObj.warna === w.hex
                          ? "ring-2 ring-white scale-115"
                          : "opacity-75 hover:opacity-100"
                      }`}
                      title={`Ganti warna ke ${w.nama}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => tambahTitikSikuPadaKabel(kabelTerpilihObj.id)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] cursor-pointer"
                >
                  + Tambah Titik Siku
                </button>
                <button
                  type="button"
                  onClick={() => hapusKabel(kabelTerpilihObj.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] cursor-pointer"
                >
                  ✕ Hapus Kabel
                </button>
              </div>
            )}

            <div
              style={{
                transform: `scale(${skalaZoom})`,
                transformOrigin: "top left",
                width: `${100 / skalaZoom}%`,
                height: `${100 / skalaZoom}%`,
              }}
              className="relative w-full h-full min-w-[700px] min-h-[360px]"
            >
              {/* LAYER SVG GARIS KABEL SIKU ORTHOGONAL ALA WOKWI + HANDLE SIKU DRAGGABLE */}
              <svg className="absolute inset-0 w-full h-full">
                {kabelSaatIni.map((kbl, idxKbl) => {
                  const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  if (!asal || !tujuan) return null;

                  const offset = (idxKbl % 3) * 8 - 8;
                  const x1 = asal.x + 70;
                  const y1 = asal.y + 52 + offset;
                  const x2 = tujuan.x + 70;
                  const y2 = tujuan.y + 52 + offset;

                  const { d, daftarHandle, titikTengah } = bangunJalurSikuWokwi(
                    x1,
                    y1,
                    x2,
                    y2,
                    kbl.titikSiku
                  );
                  const apakahTerpilih = idKabelTerpilih === kbl.id;

                  return (
                    <g key={kbl.id}>
                      {/* Garis Bayangan Lebar Transparan agar Kabel Mudah Diklik */}
                      <path
                        d={d}
                        stroke="transparent"
                        strokeWidth="16"
                        fill="none"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />

                      {/* Garis Kabel Siku Utama */}
                      <path
                        d={d}
                        stroke={kbl.warna}
                        strokeWidth={apakahTerpilih ? "5" : "3.5"}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={mode === "matlab" ? "6 3" : undefined}
                        className="cursor-pointer transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />

                      <circle cx={x1} cy={y1} r="5" fill={kbl.warna} />
                      <circle cx={x2} cy={y2} r="5" fill={kbl.warna} />

                      {/* Label Pin pada Tengah Kabel */}
                      <g
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      >
                        <rect
                          x={titikTengah.x - 58}
                          y={titikTengah.y - 10}
                          width="116"
                          height="16"
                          rx="4"
                          fill="#0f172a"
                          stroke={apakahTerpilih ? "#facc15" : kbl.warna}
                          strokeWidth={apakahTerpilih ? "2" : "1"}
                        />
                        <text
                          x={titikTengah.x}
                          y={titikTengah.y + 1}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="7.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {kbl.pinAsal.slice(0, 8)} ➔ {kbl.pinTujuan.slice(0, 8)}
                        </text>
                      </g>

                      {/* TITIK PEGANGAN SIKU (DRAGGABLE WAYPOINT HANDLES) SAAT KABEL DITEKAN */}
                      {apakahTerpilih &&
                        daftarHandle.map((pt, hIdx) => (
                          <g key={hIdx}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="8"
                              fill="#facc15"
                              stroke="#0f172a"
                              strokeWidth="2.5"
                              className="cursor-grab active:cursor-grabbing"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setSedangGeserSiku({
                                  kabelId: kbl.id,
                                  indeksTitik: hIdx,
                                });
                              }}
                            />
                          </g>
                        ))}
                    </g>
                  );
                })}

                {/* GARIS PRATINJAU SIKU REAL-TIME SAAT MENARIK KABEL DARI PIN */}
                {sedangTarikKabelDariPin && (
                  <path
                    d={
                      bangunJalurSikuWokwi(
                        sedangTarikKabelDariPin.xAsal,
                        sedangTarikKabelDariPin.yAsal,
                        posisiKursorKanvas.x,
                        posisiKursorKanvas.y
                      ).d
                    }
                    stroke={warnaKabelAktif}
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    fill="none"
                    className="pointer-events-none"
                  />
                )}
              </svg>

              {/* DAFTAR KOMPONEN DI ATAS KANVAS BESERTA DERETAN TERMINAL PIN INTERAKTIF */}
              {nodesSaatIni.map((node) => {
                const aktif = komponenTerpilih?.id === node.id;
                const specPin = ambilInfoPinKomponen(node.tipe);
                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIdKomponenTerpilih(node.id);
                      // Jika sedang menarik kabel dan mengklik bodi komponen tujuan
                      if (
                        sedangTarikKabelDariPin &&
                        sedangTarikKabelDariPin.nodeId !== node.id
                      ) {
                        const pinTujuanDefault = specPin.daftarPin[0] || "Pin 1";
                        tambahKabelKoneksi(
                          sedangTarikKabelDariPin.nodeId,
                          sedangTarikKabelDariPin.namaPin,
                          node.id,
                          pinTujuanDefault,
                          warnaKabelAktif
                        );
                        setSedangTarikKabelDariPin(null);
                      } else {
                        setSedangGeserId(node.id);
                      }
                    }}
                    className={`absolute p-2.5 rounded-2xl cursor-move transition-shadow ${
                      aktif
                        ? "bg-slate-900/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] z-20"
                        : "bg-slate-900/85 border border-slate-700 hover:border-indigo-400 z-10"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-amber-300 truncate max-w-[115px]">
                        {node.label}
                      </span>
                      <span className="text-[8px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {specPin.jumlahPin} Pin
                      </span>
                    </div>

                    <VisualKomponenRealistis
                      tipe={node.tipe}
                      nilaiResistor={node.nilaiResistor}
                      nyala={node.nyala}
                      nilaiSensor={node.nilaiSensor}
                      ukuran="kanvas"
                    />

                    {/* DERETAN TERMINAL PIN YANG BISA DIKLIK LANGSUNG UNTUK TARIK KABEL */}
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-slate-800 max-w-[155px]">
                      {specPin.daftarPin.slice(0, 6).map((namaPin) => {
                        const sedangAktifDariPinIni =
                          sedangTarikKabelDariPin?.nodeId === node.id &&
                          sedangTarikKabelDariPin?.namaPin === namaPin;
                        return (
                          <button
                            key={namaPin}
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!sedangTarikKabelDariPin) {
                                setSedangTarikKabelDariPin({
                                  nodeId: node.id,
                                  namaPin,
                                  xAsal: node.x + 70,
                                  yAsal: node.y + 55,
                                });
                              } else if (sedangTarikKabelDariPin.nodeId !== node.id) {
                                tambahKabelKoneksi(
                                  sedangTarikKabelDariPin.nodeId,
                                  sedangTarikKabelDariPin.namaPin,
                                  node.id,
                                  namaPin,
                                  warnaKabelAktif
                                );
                                setSedangTarikKabelDariPin(null);
                              } else {
                                setSedangTarikKabelDariPin(null);
                              }
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold cursor-crosshair transition ${
                              sedangAktifDariPinIni
                                ? "bg-amber-400 text-slate-950 animate-bounce"
                                : sedangTarikKabelDariPin
                                ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400 hover:bg-emerald-400 hover:text-slate-950"
                                : "bg-slate-800 hover:bg-indigo-600 text-slate-200"
                            }`}
                            title={`Klik untuk tarik atau sambung kabel ke pin ${namaPin}`}
                          >
                            ● {namaPin.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-400 pointer-events-none bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800">
              <span>
                💡 Klik tombol pin [● TX2 / ● D0] pada komponen untuk menarik kabel, atau klik
                garis kabel untuk menggeser titik siku kuning!
              </span>
              <div className="flex items-center gap-3 pointer-events-auto">
                <span>
                  Komponen: <b className="text-emerald-400">{nodesSaatIni.length}</b> | Kabel:{" "}
                  <b className="text-sky-400">{kabelSaatIni.length}</b>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setUkuranKanvas(ukuranKanvas === "penuh" ? "sedang" : "penuh")
                  }
                  className="text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {ukuranKanvas === "penuh" ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" /> Perkecil
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" /> Perluas
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* PANEL KANAN (4 KOLOM): INSPEKTOR, PENJELASAN PINOUT & DAFTAR KABEL AKTIF */}
          <div
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-4"
            } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[640px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Inspector, Pinout &amp; Edit Siku Kabel
              </span>
              {komponenTerpilih && (
                <button
                  type="button"
                  onClick={() => {
                    setDaftarNode({
                      ...daftarNode,
                      [mode]: nodesSaatIni.filter((n) => n.id !== komponenTerpilih.id),
                    });
                    setIdKomponenTerpilih(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              )}
            </div>

            {komponenTerpilih && infoPinTerpilih && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Nama Label Komponen:
                  </label>
                  <input
                    type="text"
                    value={komponenTerpilih.label}
                    onChange={(e) =>
                      updatePropertiKomponen(komponenTerpilih.id, {
                        label: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                  />
                </div>

                {/* PENJELASAN DETAIL PINOUT & PANDUAN KONEKSI KOMPONEN */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-300 uppercase text-[11px] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Datasheet &amp; Penjelasan Pin
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-amber-300 font-mono font-black text-[10px]">
                      Total: {infoPinTerpilih.jumlahPin} Pin
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {infoPinTerpilih.fungsiSingkat}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-black uppercase text-emerald-300">
                      Panduan Pin Ini Disambungkan ke Mana:
                    </div>
                    {infoPinTerpilih.panduanKoneksi.map((pk, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]"
                      >
                        <span className="font-mono font-black text-amber-300">
                          • {pk.namaPin}:
                        </span>{" "}
                        <span className="text-slate-300">{pk.fungsiDanTujuan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JIKA RESISTOR: EDITOR OHM & GELANG WARNA */}
                {komponenTerpilih.tipe === "resistor" ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                    <div className="font-black text-amber-300 uppercase text-[11px]">
                      🎨 Nilai Hambatan &amp; Gelang Warna
                    </div>
                    <div className="flex justify-center">
                      <ResistorVisualSvg
                        nilaiOhm={komponenTerpilih.nilaiResistor || 1000}
                        ukuran="besar"
                      />
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={10000000}
                      value={komponenTerpilih.nilaiResistor || 1000}
                      onChange={(e) =>
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nilaiResistor: Math.max(1, Number(e.target.value)),
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono font-black text-amber-300"
                    />
                    <div className="grid grid-cols-3 gap-1">
                      {[220, 330, 1000, 2200, 4700, 10000].map((ohm) => (
                        <button
                          key={ohm}
                          type="button"
                          onClick={() =>
                            updatePropertiKomponen(komponenTerpilih.id, {
                              nilaiResistor: ohm,
                            })
                          }
                          className="py-1 px-2 rounded bg-slate-950 border border-slate-800 hover:border-amber-400 font-mono text-[10px] font-bold text-slate-300 cursor-pointer"
                        >
                          {hitungGelangWarnaResistor(ohm).labelSingkat}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between font-bold">
                      <span>Nilai Sensor / Tegangan:</span>
                      <span className="text-amber-300 font-mono">
                        {komponenTerpilih.nilaiSensor ?? 28}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      value={komponenTerpilih.nilaiSensor ?? 28}
                      onChange={(e) =>
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nilaiSensor: Number(e.target.value),
                        })
                      }
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* FORM SAMBUNG PIN MANUAL & DAFTAR KABEL AKTIF */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="font-black text-sky-300 uppercase text-[11px] flex items-center justify-between">
                <span>🔌 Daftar Garis Kabel ({kabelSaatIni.length})</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-800 text-[11px]">
                <select
                  value={pinAsalPilih}
                  onChange={(e) => setPinAsalPilih(e.target.value)}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-amber-300"
                >
                  {(infoPinTerpilih?.daftarPin || ["Pin 1"]).map((p) => (
                    <option key={p} value={p}>
                      Dari: {p}
                    </option>
                  ))}
                </select>
                <select
                  value={nodeTujuanManualObj?.id || ""}
                  onChange={(e) => setIdTujuanManual(e.target.value)}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 font-bold text-emerald-300"
                >
                  {nodesSaatIni
                    .filter((n) => n.id !== komponenTerpilih?.id)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        Ke: {n.label}
                      </option>
                    ))}
                </select>
                <select
                  value={pinTujuanPilih}
                  onChange={(e) => setPinTujuanPilih(e.target.value)}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sky-300"
                >
                  {(infoPinTujuanObj?.daftarPin || ["Pin 1"]).map((p) => (
                    <option key={p} value={p}>
                      Pin: {p}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (komponenTerpilih && nodeTujuanManualObj) {
                      tambahKabelKoneksi(
                        komponenTerpilih.id,
                        pinAsalPilih,
                        nodeTujuanManualObj.id,
                        pinTujuanPilih,
                        warnaKabelAktif
                      );
                    }
                  }}
                  className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black cursor-pointer"
                >
                  + Sambung Pin
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {kabelSaatIni.map((kbl) => {
                  const nAsal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const nTujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  const dipilih = idKabelTerpilih === kbl.id;
                  return (
                    <div
                      key={kbl.id}
                      onClick={() => setIdKabelTerpilih(kbl.id)}
                      className={`p-2.5 rounded-xl border space-y-1.5 text-[11px] cursor-pointer ${
                        dipilih
                          ? "bg-indigo-950/60 border-amber-400"
                          : "bg-slate-950 border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white truncate">
                          {nAsal?.label || "Node"} ➔ {nTujuan?.label || "Node"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            hapusKabel(kbl.id);
                          }}
                          className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        [{kbl.pinAsal}] ➔ [{kbl.pinTujuan}]
                      </div>
                      <div className="flex items-center gap-1 pt-0.5">
                        {PILIHAN_WARNA_KABEL.map((w) => (
                          <button
                            key={w.hex}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              ubahWarnaKabel(kbl.id, w.hex);
                            }}
                            style={{ backgroundColor: w.hex }}
                            className={`w-3.5 h-3.5 rounded-full cursor-pointer ${
                              kbl.warna === w.hex ? "ring-2 ring-white" : "opacity-60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-[10px] font-black uppercase text-indigo-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multimeter Otomatis
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Hambatan:</span>
                <b className="text-amber-300">{totalOhmKanvas} Ω</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arus Mengalir:</span>
                <b className="text-sky-300">{arusRangkaianMa.toFixed(2)} mA</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DASHBOARD IOT CLOUD: DUAL-MCU UART BRIDGE, BLYNK TOKEN, MQTT & WIFI */}
      {mode === "wokwi" && bukaDashboardIot && (
        <IotCloudBlynkPanel
          nodesKanvas={nodesSaatIni}
          onUpdateNodeDariCloud={(id, perubahan) =>
            updatePropertiKomponen(id, perubahan)
          }
          onGenerateKodeIotKeEditor={onUpdateKodeDariCloud}
        />
      )}
    </div>
  );
};