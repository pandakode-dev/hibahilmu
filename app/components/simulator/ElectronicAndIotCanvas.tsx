"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Trash2,
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
  Footprints,
  Thermometer,
} from "lucide-react";
import {
  VisualKomponenRealistis,
  ResistorVisualSvg,
  hitungGelangWarnaResistor,
} from "./ResistorVisualSvg";
import {
  ambilLayoutFisikKomponen,
  warnaTitikPin,
  TitikPinFisik,
} from "./pinoutDefinitions";
import { IotCloudBlynkPanel } from "./IotCloudBlynkPanel";

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
  titikSiku?: TitikSikuKabel[];
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

const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: ItemPaletGudang[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit (30 Pin)", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno (28 Pin)", kategori: "Microcontroller" },
    { tipe: "esp8266_nodemcu", label: "NodeMCU ESP8266 (30p)", kategori: "Microcontroller" },
    { tipe: "stm32_bluepill", label: "STM32 BluePill (32p)", kategori: "Microcontroller" },
    { tipe: "raspberry_pico", label: "Raspberry Pi Pico (32p)", kategori: "Microcontroller" },
    {
      tipe: "ultrasonik",
      label: "Ultrasonik HC-SR04 (4p)",
      kategori: "Sensor IoT",
      defaultSensor: 45,
    },
    { tipe: "pir_sensor", label: "Sensor Gerak PIR (3p)", kategori: "Sensor IoT", defaultSensor: 85 },
    {
      tipe: "dht22",
      label: "Sensor Suhu DHT22 (4p)",
      kategori: "Sensor IoT",
      defaultSensor: 34,
    },
    {
      tipe: "mq2_gas",
      label: "Sensor Gas MQ-2 (4p)",
      kategori: "Sensor IoT",
      defaultSensor: 95,
    },
    {
      tipe: "ldr_sensor",
      label: "Sensor Cahaya LDR (3p)",
      kategori: "Sensor IoT",
      defaultSensor: 120,
    },
    {
      tipe: "oled_display",
      label: "Layar OLED I2C (4p)",
      kategori: "Aktuator & Layar",
      defaultSensor: 100,
    },
    {
      tipe: "lcd_16x2",
      label: "LCD 16x2 I2C (4p)",
      kategori: "Aktuator & Layar",
      defaultSensor: 25,
    },
    {
      tipe: "servo",
      label: "Motor Servo SG90 (3p)",
      kategori: "Aktuator & Layar",
      defaultSensor: 90,
    },
    { tipe: "buzzer", label: "Buzzer Piezo (2p)", kategori: "Aktuator & Layar" },
    { tipe: "keypad_4x4", label: "Keypad Matriks 4x4 (8p)", kategori: "Pasif & Input" },
    { tipe: "led_hijau", label: "LED Hijau 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "led_merah", label: "LED Merah 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "led_kuning", label: "LED Kuning 5mm (2p)", kategori: "Pasif & Input" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif & Input",
      defaultResistor: 220,
    },
    {
      tipe: "potensiometer",
      label: "Potensiometer (3p)",
      kategori: "Pasif & Input",
      defaultSensor: 50,
    },
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
    { tipe: "dioda", label: "Dioda Penyearah 1N4007", kategori: "Semikonduktor & IC" },
    {
      tipe: "transistor_npn",
      label: "Transistor NPN 2N2222",
      kategori: "Semikonduktor & IC",
    },
    {
      tipe: "gerbang_logika",
      label: "Gerbang AND (7408)",
      kategori: "Gerbang Logika & Alat",
    },
    {
      tipe: "osiloskop",
      label: "Osiloskop 2-Channel",
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
    { tipe: "Scope Plot", label: "Simulink Scope Viewer", kategori: "Sinks" },
  ],
};

// Rangkaian Awal Wokwi Lengkap dengan Ultrasonik (Orang Mendekat), PIR (Orang Melintas), DHT22 & Dual MCU
const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: [
    { id: "wk-1", tipe: "esp32", label: "ESP32 Master (30p)", x: 25, y: 65, nyala: true },
    {
      id: "wk-2",
      tipe: "ultrasonik",
      label: "Ultrasonik HC-SR04",
      x: 235,
      y: 95,
      nilaiSensor: 40,
      nyala: true,
    },
    {
      id: "wk-3",
      tipe: "pir_sensor",
      label: "Sensor Gerak PIR",
      x: 410,
      y: 95,
      nilaiSensor: 85,
      nyala: true,
    },
    {
      id: "wk-4",
      tipe: "dht22",
      label: "Sensor Suhu DHT22",
      x: 560,
      y: 75,
      nilaiSensor: 35,
      nyala: true,
    },
    {
      id: "wk-5",
      tipe: "resistor",
      label: "R1 (330 Ω)",
      x: 235,
      y: 250,
      nilaiResistor: 330,
    },
    { id: "wk-6", tipe: "led_hijau", label: "LED Alarm", x: 420, y: 230, nyala: true },
    {
      id: "wk-7",
      tipe: "arduino_uno",
      label: "Arduino Uno Slave",
      x: 535,
      y: 230,
      nyala: true,
    },
  ],
  ewb: [
    { id: "ewb-1", tipe: "vcc_dc", label: "Sumber DC 12V", x: 35, y: 90, nilaiSensor: 12 },
    {
      id: "ewb-2",
      tipe: "resistor",
      label: "Resistor R1",
      x: 230,
      y: 55,
      nilaiResistor: 1000,
    },
    {
      id: "ewb-3",
      tipe: "resistor",
      label: "Resistor R2",
      x: 230,
      y: 175,
      nilaiResistor: 2200,
    },
    { id: "ewb-4", tipe: "osiloskop", label: "Osiloskop CH1", x: 450, y: 100, nyala: true },
  ],
  matlab: [
    { id: "sim-1", tipe: "Sine Wave", label: "Input r(t)", x: 30, y: 110, nilaiSensor: 10 },
    { id: "sim-2", tipe: "PID Controller", label: "PID", x: 215, y: 110, nilaiSensor: 5 },
    { id: "sim-3", tipe: "Transfer Fcn", label: "Plant G(s)", x: 400, y: 110, nilaiSensor: 1 },
    { id: "sim-4", tipe: "Scope Plot", label: "Scope y(t)", x: 575, y: 110 },
  ],
};

const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: [
    {
      id: "w-ultra-trig",
      dariId: "wk-1",
      pinAsal: "GPIO12",
      keId: "wk-2",
      pinTujuan: "TRIG",
      warna: "#38bdf8",
      titikSiku: [{ x: 15, y: 200 }, { x: 296, y: 215 }],
    },
    {
      id: "w-pir-out",
      dariId: "wk-3",
      pinAsal: "SIG",
      keId: "wk-1",
      pinTujuan: "GPIO4",
      warna: "#ef4444",
      titikSiku: [{ x: 467, y: 215 }, { x: 205, y: 198 }],
    },
    {
      id: "w-dht-data",
      dariId: "wk-1",
      pinAsal: "GPIO15",
      keId: "wk-4",
      pinTujuan: "DATA",
      warna: "#a855f7",
      titikSiku: [{ x: 215, y: 224 }, { x: 601, y: 215 }],
    },
    {
      id: "w-led-1",
      dariId: "wk-1",
      pinAsal: "GPIO2",
      keId: "wk-5",
      pinTujuan: "PIN_1",
      warna: "#22c55e",
      titikSiku: [{ x: 205, y: 295 }],
    },
    {
      id: "w-led-2",
      dariId: "wk-5",
      pinAsal: "PIN_2",
      keId: "wk-6",
      pinTujuan: "ANODA",
      warna: "#facc15",
      titikSiku: [{ x: 400, y: 335 }],
    },
    {
      id: "w-uart-txrx",
      dariId: "wk-1",
      pinAsal: "GPIO17",
      keId: "wk-7",
      pinTujuan: "D0_RX",
      warna: "#f97316",
      titikSiku: [{ x: 215, y: 185 }, { x: 713, y: 225 }],
    },
  ],
  ewb: [
    {
      id: "e-1",
      dariId: "ewb-1",
      pinAsal: "OUT_1",
      keId: "ewb-2",
      pinTujuan: "PIN_1",
      warna: "#ef4444",
      titikSiku: [{ x: 195, y: 105 }],
    },
    {
      id: "e-2",
      dariId: "ewb-2",
      pinAsal: "PIN_2",
      keId: "ewb-3",
      pinTujuan: "PIN_1",
      warna: "#38bdf8",
      titikSiku: [{ x: 395, y: 105 }, { x: 395, y: 225 }],
    },
    {
      id: "e-3",
      dariId: "ewb-2",
      pinAsal: "PIN_2",
      keId: "ewb-4",
      pinTujuan: "IN_1",
      warna: "#22c55e",
      titikSiku: [{ x: 420, y: 145 }],
    },
  ],
  matlab: [
    {
      id: "m-1",
      dariId: "sim-1",
      pinAsal: "OUT_1",
      keId: "sim-2",
      pinTujuan: "IN_1",
      warna: "#f97316",
    },
    {
      id: "m-2",
      dariId: "sim-2",
      pinAsal: "OUT_1",
      keId: "sim-3",
      pinTujuan: "IN_1",
      warna: "#38bdf8",
    },
    {
      id: "m-3",
      dariId: "sim-3",
      pinAsal: "OUT_1",
      keId: "sim-4",
      pinTujuan: "IN_1",
      warna: "#22c55e",
    },
  ],
};

function cariKoordinatPinAbsolut(
  node: NodeKomponenKanvas,
  idAtauNamaPin: string
): { x: number; y: number; pinObj: TitikPinFisik } {
  const layout = ambilLayoutFisikKomponen(node.tipe);
  const found =
    layout.pins.find(
      (p) => p.idPin === idAtauNamaPin || p.nama === idAtauNamaPin
    ) || layout.pins[0];
  return {
    x: node.x + found.x,
    y: node.y + found.y + 18,
    pinObj: found,
  };
}

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
    "besar"
  );
  const [skalaZoom, setSkalaZoom] = useState<number>(1);

  const [idKomponenTerpilih, setIdKomponenTerpilih] = useState<string | null>(
    KOMPONEN_AWAL_PER_MODE[mode][0]?.id || null
  );
  const [sedangGeserId, setSedangGeserId] = useState<string | null>(null);

  const [hoveredPinInfo, setHoveredPinInfo] = useState<{
    nodeLabel: string;
    pin: TitikPinFisik;
    absX: number;
    absY: number;
  } | null>(null);

  const [idKabelTerpilih, setIdKabelTerpilih] = useState<string | null>(null);
  const [sedangGeserSiku, setSedangGeserSiku] = useState<{
    kabelId: string;
    indeksTitik: number;
  } | null>(null);

  const [warnaKabelAktif, setWarnaKabelAktif] = useState<string>("#22c55e");
  const [sedangTarikKabelDariPin, setSedangTarikKabelDariPin] = useState<{
    nodeId: string;
    nodeLabel: string;
    pin: TitikPinFisik;
    xAsal: number;
    yAsal: number;
  } | null>(null);
  const [posisiKursorKanvas, setPosisiKursorKanvas] = useState<TitikSikuKabel>({
    x: 200,
    y: 150,
  });

  const [bukaDashboardIot, setBukaDashboardIot] = useState<boolean>(true);

  useEffect(() => {
    setKategoriPaletAktif("Semua");
    setCariKomponen("");
    const listAwal = KOMPONEN_AWAL_PER_MODE[mode];
    setIdKomponenTerpilih(listAwal[0]?.id || null);
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
  const layoutTerpilih = komponenTerpilih
    ? ambilLayoutFisikKomponen(komponenTerpilih.tipe)
    : null;
  const kabelTerpilihObj =
    kabelSaatIni.find((k) => k.id === idKabelTerpilih) || null;

  // Deteksi Sensor Fisik di Kanvas untuk Panel Kontrol Animasi Langsung
  const nodeUltrasonik = nodesSaatIni.find((n) => n.tipe === "ultrasonik");
  const nodePir = nodesSaatIni.find((n) => n.tipe === "pir_sensor");
  const nodeDht = nodesSaatIni.find((n) => n.tipe === "dht22");

  const tinggiKanvasPx =
    ukuranKanvas === "kecil"
      ? "h-[380px]"
      : ukuranKanvas === "sedang"
      ? "h-[500px]"
      : ukuranKanvas === "besar"
      ? "h-[620px]"
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
      label: `${label.split(" (")[0]} #${nodesSaatIni.length + 1}`,
      x: Math.max(15, Math.min(580, xPos)),
      y: Math.max(45, Math.min(380, yPos)),
      nilaiResistor: defaultResistor ?? (tipe === "resistor" ? 1000 : undefined),
      nilaiSensor: defaultSensor ?? 35,
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
          if (!asal || !tujuan) return kbl;
          const p1 = cariKoordinatPinAbsolut(asal, kbl.pinAsal);
          const p2 = cariKoordinatPinAbsolut(tujuan, kbl.pinTujuan);
          const listSikuLama =
            kbl.titikSiku && kbl.titikSiku.length > 0
              ? [...kbl.titikSiku]
              : [
                  { x: Math.round((p1.x + p2.x) / 2), y: p1.y },
                  { x: Math.round((p1.x + p2.x) / 2), y: p2.y },
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
      const xBaru = Math.max(10, mouseX - 65);
      const yBaru = Math.max(25, mouseY - 40);
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
    pinDariId: string,
    keId: string,
    pinKeId: string,
    warna: string
  ) => {
    if (!dariId || !keId || (dariId === keId && pinDariId === pinKeId)) return;
    const asal = nodesSaatIni.find((n) => n.id === dariId);
    const tujuan = nodesSaatIni.find((n) => n.id === keId);
    if (!asal || !tujuan) return;

    const p1 = cariKoordinatPinAbsolut(asal, pinDariId);
    const p2 = cariKoordinatPinAbsolut(tujuan, pinKeId);
    const midX = Math.round((p1.x + p2.x) / 2);

    const baru: KabelKoneksiItem = {
      id: "kbl-" + Date.now(),
      dariId,
      pinAsal: pinDariId,
      keId,
      pinTujuan: pinKeId,
      warna,
      titikSiku: [
        { x: midX, y: p1.y },
        { x: midX, y: p2.y },
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
        const sikuSaatIni = k.titikSiku || [{ x: 260, y: 150 }];
        const terakhir = sikuSaatIni[sikuSaatIni.length - 1] || { x: 260, y: 150 };
        return {
          ...k,
          titikSiku: [...sikuSaatIni, { x: terakhir.x + 35, y: terakhir.y + 30 }],
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
        {/* HEADER BAR MEJA KERJA */}
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
                Real-Time Sensor Physics &amp; Exact Pin-Pad Engine
              </span>
              <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
                {mode === "wokwi"
                  ? "Wokwi IoT Studio — Animasi Gelombang Ultrasonik, Sensor Gerak PIR, Suhu DHT22 & 30-Pin ESP32"
                  : mode === "ewb"
                  ? "EWB (Electronics Workbench) — Rangkaian RLC, Resistor 4-Gelang & Pin Fisik"
                  : "MATLAB Simulink — Diagram Blok Sistem Kendali PID"}
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
                Gudang Komponen ({komponenPaletTersaring.length} Item): Tarik (Drag &amp; Drop) atau
                Klik untuk Menaruh ke Meja Rangkaian
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cariKomponen}
                onChange={(e) => setCariKomponen(e.target.value)}
                placeholder="Cari ESP32, Ultrasonik, PIR, DHT22..."
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

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {komponenPaletTersaring.map((item, idx) => {
              const layoutInfo = ambilLayoutFisikKomponen(item.tipe);
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
                  className="p-2 rounded-2xl bg-slate-900 hover:bg-indigo-950/90 border border-slate-800 hover:border-emerald-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1 transition group"
                >
                  <div className="w-full flex justify-between items-center text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300">
                    <span className="truncate">{item.kategori.split(" ")[0]}</span>
                    <span className="text-amber-300 shrink-0">{layoutInfo.pins.length}p</span>
                  </div>

                  <div className="h-11 flex items-center justify-center py-0.5 group-hover:scale-105 transition-transform">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            PANEL SIMULASI LINGKUNGAN FISIK INTERAKTIF (ORANG MENDEKAT ULTRASONIK, PIR & SUHU)
           ==================================================================== */}
        {mode === "wokwi" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-3xl text-xs">
            {nodeUltrasonik && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center font-black text-sky-300">
                  <span className="flex items-center gap-1.5">
                    🚶 Dekatkan Orang ke Ultrasonik:
                  </span>
                  <span className="text-amber-300 font-mono">
                    {nodeUltrasonik.nilaiSensor ?? 40} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={180}
                  value={nodeUltrasonik.nilaiSensor ?? 40}
                  onChange={(e) =>
                    updatePropertiKomponen(nodeUltrasonik.id, {
                      nilaiSensor: Number(e.target.value),
                    })
                  }
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  Geser ke kiri (&lt;35 cm) untuk melihat objek mendekat &amp; gelombang sonar merah!
                </div>
              </div>
            )}

            {nodePir && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center font-black text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5" /> Gerakkan Orang di Depan PIR:
                  </span>
                  <span className="text-rose-400 font-mono">
                    {(nodePir.nilaiSensor ?? 85) >= 30 && (nodePir.nilaiSensor ?? 85) <= 150
                      ? "TERDETEKSI!"
                      : "AMAN"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={180}
                  value={nodePir.nilaiSensor ?? 85}
                  onChange={(e) =>
                    updatePropertiKomponen(nodePir.id, {
                      nilaiSensor: Number(e.target.value),
                    })
                  }
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  Geser posisi orang melintasi kerucut inframerah PIR di kanvas!
                </div>
              </div>
            )}

            {nodeDht && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center font-black text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5" /> Panaskan / Dinginkan Suhu DHT22:
                  </span>
                  <span className="font-mono">{nodeDht.nilaiSensor ?? 35}°C</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={nodeDht.nilaiSensor ?? 35}
                  onChange={(e) =>
                    updatePropertiKomponen(nodeDht.id, {
                      nilaiSensor: Number(e.target.value),
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  &gt;=33°C memunculkan uap panas 🔥, &lt;=20°C memunculkan kristal es ❄️!
                </div>
              </div>
            )}
          </div>
        )}

        {/* BAR PILIH WARNA KABEL & INDIKATOR PIN YANG SEDANG DIDEKATI (HOVER) */}
        <div className="bg-slate-950/95 p-3.5 rounded-3xl border border-indigo-500/30 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-emerald-400 shrink-0" />
            {hoveredPinInfo ? (
              <div className="font-mono text-xs bg-slate-900 border border-amber-400/60 px-3 py-1 rounded-xl text-white">
                📍 <b>{hoveredPinInfo.nodeLabel}</b> ➔{" "}
                <span className="text-amber-300 font-black">
                  Pin #{hoveredPinInfo.pin.nomorPin}: {hoveredPinInfo.pin.nama}
                </span>{" "}
                <span className="text-slate-300">({hoveredPinInfo.pin.keterangan})</span>
              </div>
            ) : (
              <span className="font-bold text-slate-300">
                Dekatkan kursor ke titik bulat pada kaki komponen di kanvas untuk melihat nama pin
                (VCC/GND/TX/RX/GPIO), lalu klik titik tersebut untuk menarik kabel!
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              Warna Kabel:
            </span>
            {PILIHAN_WARNA_KABEL.map((w) => (
              <button
                key={w.hex}
                type="button"
                onClick={() => {
                  setWarnaKabelAktif(w.hex);
                  if (idKabelTerpilih) ubahWarnaKabel(idKabelTerpilih, w.hex);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border cursor-pointer ${
                  warnaKabelAktif === w.hex
                    ? "bg-white text-slate-950 border-white"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                <span
                  style={{ backgroundColor: w.hex }}
                  className="w-2.5 h-2.5 rounded-full inline-block"
                />
                <span>{w.nama.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================================
            AREA UTAMA: KANVAS DRAG & DROP (8 KOLOM) + INSPEKTOR & TABEL PIN (4 KOLOM)
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
              if (sedangTarikKabelDariPin) setSedangTarikKabelDariPin(null);
            }}
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-8"
            } ${tinggiKanvasPx} rounded-3xl bg-[#070d19] border-2 border-dashed border-slate-700 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px]`}
          >
            {/* FLOATING POP-UP TOOLBAR SAAT KABEL DIKLIK */}
            {kabelTerpilihObj && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="sticky top-3 left-3 z-40 inline-flex flex-wrap items-center gap-2 bg-slate-900/95 border-2 border-amber-400 px-3.5 py-2 rounded-2xl shadow-2xl text-xs ml-3 mt-3"
              >
                <span className="font-black text-amber-300 flex items-center gap-1">
                  <CornerDownRight className="w-3.5 h-3.5" /> Kabel [{kabelTerpilihObj.pinAsal} ➔{" "}
                  {kabelTerpilihObj.pinTujuan}]:
                </span>
                <div className="flex items-center gap-1">
                  {PILIHAN_WARNA_KABEL.map((w) => (
                    <button
                      key={w.hex}
                      type="button"
                      onClick={() => ubahWarnaKabel(kabelTerpilihObj.id, w.hex)}
                      style={{ backgroundColor: w.hex }}
                      className={`w-5 h-5 rounded-full cursor-pointer ${
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
              className="relative w-full h-full min-w-[760px] min-h-[440px]"
            >
              {/* LAYER SVG GARIS KABEL SIKU ORTHOGONAL TEPAT DARI TITIK PIN KE TITIK PIN */}
              <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                {kabelSaatIni.map((kbl) => {
                  const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  if (!asal || !tujuan) return null;

                  const koorAsal = cariKoordinatPinAbsolut(asal, kbl.pinAsal);
                  const koorTujuan = cariKoordinatPinAbsolut(tujuan, kbl.pinTujuan);

                  const { d, daftarHandle } = bangunJalurSikuWokwi(
                    koorAsal.x,
                    koorAsal.y,
                    koorTujuan.x,
                    koorTujuan.y,
                    kbl.titikSiku
                  );
                  const apakahTerpilih = idKabelTerpilih === kbl.id;

                  return (
                    <g key={kbl.id} className="pointer-events-auto">
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
                      <path
                        d={d}
                        stroke={kbl.warna}
                        strokeWidth={apakahTerpilih ? "4.5" : "3"}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />
                      <circle cx={koorAsal.x} cy={koorAsal.y} r="4" fill={kbl.warna} />
                      <circle cx={koorTujuan.x} cy={koorTujuan.y} r="4" fill={kbl.warna} />

                      {/* TITIK SIKU KUNING YANG BISA DIGESER SAAT KABEL DITEKAN */}
                      {apakahTerpilih &&
                        daftarHandle.map((pt, hIdx) => (
                          <circle
                            key={hIdx}
                            cx={pt.x}
                            cy={pt.y}
                            r="7.5"
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
                        ))}
                    </g>
                  );
                })}

                {/* GARIS PRATINJAU SIKU SAAT MENARIK KABEL DARI TITIK PIN */}
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
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                )}
              </svg>

              {/* TOOLTIP MELAYANG SAAT KURSOR MENDEKATI TITIK PIN FISIK */}
              {hoveredPinInfo && (
                <div
                  style={{
                    left: `${Math.min(520, Math.max(10, hoveredPinInfo.absX - 60))}px`,
                    top: `${Math.max(8, hoveredPinInfo.absY - 52)}px`,
                  }}
                  className="absolute z-50 pointer-events-none bg-slate-950/95 border-2 border-amber-400 text-white px-3 py-1.5 rounded-xl shadow-2xl text-[11px] font-mono whitespace-nowrap"
                >
                  <div className="font-black text-amber-300">
                    ● {hoveredPinInfo.pin.nama} (Pin #{hoveredPinInfo.pin.nomorPin})
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {hoveredPinInfo.pin.keterangan}
                  </div>
                </div>
              )}

              {/* RENDER SETIAP KOMPONEN BESERTA TITIK-TITIK PIN FISIKNYA */}
              {nodesSaatIni.map((node) => {
                const aktif = komponenTerpilih?.id === node.id;
                const layout = ambilLayoutFisikKomponen(node.tipe);

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${layout.lebar}px`,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIdKomponenTerpilih(node.id);
                      setSedangGeserId(node.id);
                    }}
                    className={`absolute rounded-2xl cursor-move transition-shadow ${
                      aktif ? "ring-2 ring-emerald-400/80 z-10" : "z-10"
                    }`}
                  >
                    <div className="h-[18px] px-2 flex justify-between items-center bg-slate-900/90 rounded-t-xl border-x border-t border-slate-700 text-[9.5px] font-black text-amber-300 truncate">
                      <span className="truncate">{node.label}</span>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0 ml-1">
                        {layout.pins.length}p
                      </span>
                    </div>

                    <div
                      style={{
                        width: `${layout.lebar}px`,
                        height: `${layout.tinggi}px`,
                      }}
                      className="relative bg-slate-950/40 rounded-b-xl"
                    >
                      <VisualKomponenRealistis
                        tipe={node.tipe}
                        nilaiResistor={node.nilaiResistor}
                        nyala={node.nyala}
                        nilaiSensor={node.nilaiSensor}
                        ukuran="kanvas"
                      />

                      {layout.pins.map((pin) => {
                        const sedangAsal =
                          sedangTarikKabelDariPin?.nodeId === node.id &&
                          sedangTarikKabelDariPin?.pin.idPin === pin.idPin;
                        const warnaDot = warnaTitikPin(pin.kategori);

                        return (
                          <button
                            key={pin.idPin}
                            type="button"
                            style={{
                              left: `${pin.x - 5}px`,
                              top: `${pin.y - 5}px`,
                              backgroundColor: sedangAsal ? "#ffffff" : warnaDot,
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseEnter={() =>
                              setHoveredPinInfo({
                                nodeLabel: node.label,
                                pin,
                                absX: node.x + pin.x,
                                absY: node.y + pin.y + 18,
                              })
                            }
                            onMouseLeave={() => setHoveredPinInfo(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              const absX = node.x + pin.x;
                              const absY = node.y + pin.y + 18;

                              if (!sedangTarikKabelDariPin) {
                                if (pin.kategori === "POWER") setWarnaKabelAktif("#ef4444");
                                else if (pin.kategori === "GND") setWarnaKabelAktif("#94a3b8");
                                else if (pin.kategori === "UART") setWarnaKabelAktif("#22c55e");

                                setSedangTarikKabelDariPin({
                                  nodeId: node.id,
                                  nodeLabel: node.label,
                                  pin,
                                  xAsal: absX,
                                  yAsal: absY,
                                });
                                setPosisiKursorKanvas({ x: absX, y: absY });
                              } else {
                                tambahKabelKoneksi(
                                  sedangTarikKabelDariPin.nodeId,
                                  sedangTarikKabelDariPin.pin.idPin,
                                  node.id,
                                  pin.idPin,
                                  warnaKabelAktif
                                );
                                setSedangTarikKabelDariPin(null);
                              }
                            }}
                            className={`absolute w-[10px] h-[10px] rounded-full border border-slate-950 cursor-crosshair transition-transform hover:scale-175 hover:ring-2 hover:ring-white z-30 ${
                              sedangAsal ? "scale-175 ring-2 ring-amber-300 animate-ping" : ""
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL SAMPING KANAN (4 KOLOM): INSPEKTOR KOMPONEN & TABEL REFERENSI PINOUT TERPISAH */}
          <div
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-4"
            } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[620px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Inspector &amp; Tabel Pinout Lengkap
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

            {komponenTerpilih && layoutTerpilih && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Nama Komponen Terpilih:
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
                      <span>
                        {komponenTerpilih.tipe === "ultrasonik"
                          ? "Jarak Objek / Orang di Depan Sensor:"
                          : komponenTerpilih.tipe === "pir_sensor"
                          ? "Posisi Orang Melintas di Depan PIR:"
                          : komponenTerpilih.tipe === "dht22"
                          ? "Suhu Lingkungan Sensor DHT22:"
                          : "Nilai Sensor / Sudut / Tegangan:"}
                      </span>
                      <span className="text-amber-300 font-mono">
                        {komponenTerpilih.nilaiSensor ?? 28}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={180}
                      value={komponenTerpilih.nilaiSensor ?? 28}
                      onChange={(e) =>
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nilaiSensor: Number(e.target.value),
                        })
                      }
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nyala: !komponenTerpilih.nyala,
                        })
                      }
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer"
                    >
                      Status Aktif: {komponenTerpilih.nyala ? "HIGH (MENYALA)" : "LOW (MATI)"}
                    </button>
                  </div>
                )}

                {/* TABEL REFERENSI PINOUT TERPISAH */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-300 uppercase text-[11px] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Daftar &amp; Keterangan Pin (
                      {layoutTerpilih.pins.length} Titik)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {layoutTerpilih.fungsiUtama}
                  </p>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 pt-1">
                    {layoutTerpilih.pins.map((p) => (
                      <div
                        key={p.idPin}
                        onClick={() => {
                          const absX = komponenTerpilih.x + p.x;
                          const absY = komponenTerpilih.y + p.y + 18;
                          setSedangTarikKabelDariPin({
                            nodeId: komponenTerpilih.id,
                            nodeLabel: komponenTerpilih.label,
                            pin: p,
                            xAsal: absX,
                            yAsal: absY,
                          });
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer space-y-0.5"
                        title="Klik baris ini untuk mulai menarik kabel dari pin ini"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-amber-300 flex items-center gap-1.5">
                            <span
                              style={{ backgroundColor: warnaTitikPin(p.kategori) }}
                              className="w-2.5 h-2.5 rounded-full inline-block"
                            />
                            #{p.nomorPin} {p.nama}
                          </span>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                            Sisi {p.sisi}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 pl-4">
                          {p.keterangan}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-[10px] font-black uppercase text-indigo-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multimeter Rangkaian
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

      {/* PANEL DASHBOARD IOT CLOUD: DRAG & DROP BLYNK STUDIO, DUAL-MCU UART, MQTT & WIFI */}
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