"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Trash2,
  Sliders,
  Move,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  Cable,
  Info,
  Wifi,
  CornerDownRight,
  BookOpen,
  Power,
  Sparkles,
  Play,
  Square,
  Code2,
  Terminal,
  Copy,
} from "lucide-react";
import {
  VisualKomponenRealistis,
  ResistorVisualSvg,
  hitungGelangWarnaResistor,
} from "./ResistorVisualSvg";
import {
  ambilLayoutFisikKomponen,
  ambilKonfigurasiRentangKomponen,
  warnaTitikPin,
  TitikPinFisik,
} from "./pinoutDefinitions";
import {
  DAFTAR_TUTORIAL_PROJECT_WOKWI,
  PresetTutorialProject,
} from "./tutorialProjectsData";
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

const TIPE_MCU_LIST = [
  "esp32",
  "arduino_uno",
  "esp8266_nodemcu",
  "stm32_bluepill",
  "raspberry_pico",
];

const PILIHAN_WARNA_KABEL = [
  { nama: "Merah (VCC/+)", hex: "#ef4444" },
  { nama: "Hitam/Abu (GND/-)", hex: "#94a3b8" },
  { nama: "Biru (Data/GPIO)", hex: "#38bdf8" },
  { nama: "Hijau (TX/SDA)", hex: "#22c55e" },
  { nama: "Kuning (RX/PWM)", hex: "#facc15" },
  { nama: "Ungu (SCL/Trig)", hex: "#a855f7" },
  { nama: "Oranye (Relay OUT)", hex: "#f97316" },
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
    { tipe: "relay_1ch", label: "Relay 1-Channel (6p)", kategori: "Modul Relay" },
    { tipe: "relay_2ch", label: "Relay 2-Channel (10p)", kategori: "Modul Relay" },
    { tipe: "relay_4ch", label: "Relay 4-Channel (18p)", kategori: "Modul Relay" },
    {
      tipe: "ultrasonik",
      label: "Ultrasonik HC-SR04 (2-400cm)",
      kategori: "Sensor IoT",
      defaultSensor: 45,
    },
    {
      tipe: "pir_sensor",
      label: "Sensor Gerak PIR (-60..60°)",
      kategori: "Sensor IoT",
      defaultSensor: 0,
    },
    {
      tipe: "ir_obstacle",
      label: "Sensor Infrared IR (2-30cm)",
      kategori: "Sensor IoT",
      defaultSensor: 8,
    },
    {
      tipe: "ldr_sensor",
      label: "Sensor Cahaya LDR (0-1000Lx)",
      kategori: "Sensor IoT",
      defaultSensor: 450,
    },
    {
      tipe: "flame_sensor",
      label: "Sensor Api Flame (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 80,
    },
    {
      tipe: "dht22",
      label: "Sensor Suhu DHT22 (-40..80°C)",
      kategori: "Sensor IoT",
      defaultSensor: 28.5,
    },
    {
      tipe: "soil_moisture",
      label: "Kelembapan Tanah (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 65,
    },
    {
      tipe: "rain_sensor",
      label: "Sensor Hujan Rain (0-100%)",
      kategori: "Sensor IoT",
      defaultSensor: 70,
    },
    {
      tipe: "mq2_gas",
      label: "Sensor Gas MQ-2 (100-10000ppm)",
      kategori: "Sensor IoT",
      defaultSensor: 350,
    },
    { tipe: "rfid_rc522", label: "RFID Card Reader (6p)", kategori: "Sensor IoT" },
    {
      tipe: "solenoid_lock",
      label: "Solenoid Lock 12V (2p ON/OFF)",
      kategori: "Aktuator & Motor",
    },
    {
      tipe: "water_pump",
      label: "Pompa Air Mini (2p ke Relay)",
      kategori: "Aktuator & Motor",
    },
    {
      tipe: "servo",
      label: "Servo SG90 180° (Positional)",
      kategori: "Aktuator & Motor",
      defaultSensor: 90,
    },
    {
      tipe: "servo_360",
      label: "Servo MG996R 360° (Continuous)",
      kategori: "Aktuator & Motor",
      defaultSensor: 60,
    },
    {
      tipe: "kipas_dc",
      label: "Kipas DC (PWM 0-255)",
      kategori: "Aktuator & Motor",
      defaultSensor: 200,
    },
    {
      tipe: "oled_display",
      label: "Layar OLED I2C (4p)",
      kategori: "Aktuator & Motor",
      defaultSensor: 100,
    },
    {
      tipe: "lcd_16x2",
      label: "LCD 16x2 I2C (4p)",
      kategori: "Aktuator & Motor",
      defaultSensor: 25,
    },
    { tipe: "buzzer", label: "Buzzer Piezo (ON/OFF)", kategori: "Aktuator & Motor" },
    { tipe: "keypad_4x4", label: "Keypad Matriks 4x4 (8p)", kategori: "Pasif & Input" },
    { tipe: "led_hijau", label: "LED Hijau 5mm (2p)", kategori: "Pasif & Input" },
    { tipe: "led_merah", label: "LED Merah 5mm (2p)", kategori: "Pasif & Input" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif & Input",
      defaultResistor: 220,
    },
    {
      tipe: "potensiometer",
      label: "Potensiometer (ADC 0-4095)",
      kategori: "Pasif & Input",
      defaultSensor: 2048,
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
      defaultSensor: 100,
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

// Default memakai Proyek 5 (Dual-ESP32 Telemetry Bridge dengan 2 Tab Kode!)
const DEFAULT_PROJECT = DAFTAR_TUTORIAL_PROJECT_WOKWI[4];

const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: DEFAULT_PROJECT.nodes,
  ewb: [
    { id: "ewb-1", tipe: "vcc_dc", label: "Sumber DC 12V", x: 35, y: 90, nilaiSensor: 12, nyala: true },
    { id: "ewb-2", tipe: "resistor", label: "Resistor R1", x: 230, y: 55, nilaiResistor: 1000, nyala: true },
    { id: "ewb-3", tipe: "resistor", label: "Resistor R2", x: 230, y: 175, nilaiResistor: 2200, nyala: true },
    { id: "ewb-4", tipe: "osiloskop", label: "Osiloskop CH1", x: 450, y: 100, nyala: true },
  ],
  matlab: [
    { id: "sim-1", tipe: "Sine Wave", label: "Input r(t)", x: 30, y: 110, nilaiSensor: 10, nyala: true },
    { id: "sim-2", tipe: "PID Controller", label: "PID", x: 215, y: 110, nilaiSensor: 5, nyala: true },
    { id: "sim-3", tipe: "Transfer Fcn", label: "Plant G(s)", x: 400, y: 110, nilaiSensor: 1, nyala: true },
    { id: "sim-4", tipe: "Scope Plot", label: "Scope y(t)", x: 575, y: 110, nyala: true },
  ],
};

const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: DEFAULT_PROJECT.kabel,
  ewb: [
    { id: "e-1", dariId: "ewb-1", pinAsal: "OUT_1", keId: "ewb-2", pinTujuan: "PIN_1", warna: "#ef4444", titikSiku: [{ x: 195, y: 105 }] },
    { id: "e-2", dariId: "ewb-2", pinAsal: "PIN_2", keId: "ewb-3", pinTujuan: "PIN_1", warna: "#38bdf8", titikSiku: [{ x: 395, y: 105 }, { x: 395, y: 225 }] },
    { id: "e-3", dariId: "ewb-2", pinAsal: "PIN_2", keId: "ewb-4", pinTujuan: "IN_1", warna: "#22c55e", titikSiku: [{ x: 420, y: 145 }] },
  ],
  matlab: [
    { id: "m-1", dariId: "sim-1", pinAsal: "OUT_1", keId: "sim-2", pinTujuan: "IN_1", warna: "#f97316" },
    { id: "m-2", dariId: "sim-2", pinAsal: "OUT_1", keId: "sim-3", pinTujuan: "IN_1", warna: "#38bdf8" },
    { id: "m-3", dariId: "sim-3", pinAsal: "OUT_1", keId: "sim-4", pinTujuan: "IN_1", warna: "#22c55e" },
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

  const [projectAktif, setProjectAktif] = useState<PresetTutorialProject>(
    DEFAULT_PROJECT
  );

  // ============================================================================
  // STATE MULTI-MCU IDE: KODE PER MIKROKONTROLER & STATUS RUNNING PER BOARD
  // ============================================================================
  const [kodePerMcuMap, setKodePerMcuMap] = useState<{ [mcuId: string]: string }>(
    DEFAULT_PROJECT.kodePerMcu
  );
  const [statusRunPerMcu, setStatusRunPerMcu] = useState<{
    [mcuId: string]: boolean;
  }>({
    "p5-esp1": true,
    "p5-esp2": true,
  });
  const [idTabMcuAktif, setIdTabMcuAktif] = useState<string>("p5-esp1");
  const [logSerialMultiMcu, setLogSerialMultiMcu] = useState<string[]>([
    "[10:30:01] 🚀 Semua Mikrokontroler (ESP32 #1 & ESP32 #2) Berjalan (RUNNING)...",
    "[10:30:02] [ESP32 #1 -> UART TX2]: Mengirim paket 'NODE1:JARAK=28cm;PIR=DETECTED'",
    "[10:30:02] [ESP32 #2 <- UART RX2]: Diterima -> Memicu Relay & Buka Solenoid 12V!",
  ]);

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

  const nodesSaatIni = daftarNode[mode] || [];
  const kabelSaatIni = daftarKabel[mode] || [];

  // Daftar semua Mikrokontroler yang ada di Kanvas saat ini
  const daftarMcuDiKanvas = useMemo(
    () => nodesSaatIni.filter((n) => TIPE_MCU_LIST.includes(n.tipe)),
    [nodesSaatIni]
  );

  // Pastikan tab MCU aktif selalu valid
  useEffect(() => {
    if (
      daftarMcuDiKanvas.length > 0 &&
      !daftarMcuDiKanvas.some((m) => m.id === idTabMcuAktif)
    ) {
      setIdTabMcuAktif(daftarMcuDiKanvas[0].id);
    }
  }, [daftarMcuDiKanvas, idTabMcuAktif]);

  // ============================================================================
  // MESIN VALIDASI TOPOLOGI RANGKAIAN AKTIF (BFS GRAPH TRAVERSAL)
  // Komponen HANYA aktif/menyala jika terhubung melalui kabel ke MCU yang sedang RUNNING!
  // ============================================================================
  const setIdKomponenTerhubungKeMcuRunning = useMemo(() => {
    if (mode !== "wokwi") {
      // Pada mode EWB / MATLAB, komponen yang punya setidaknya 1 kabel dianggap terhubung
      const terhubung = new Set<string>();
      kabelSaatIni.forEach((k) => {
        terhubung.add(k.dariId);
        terhubung.add(k.keId);
      });
      return terhubung;
    }

    const aktifSet = new Set<string>();
    const antrean: string[] = [];

    // Masukkan semua MCU yang sedang berstatus RUNNING sebagai sumber daya/sinyal awal
    daftarMcuDiKanvas.forEach((mcu) => {
      if (statusRunPerMcu[mcu.id]) {
        aktifSet.add(mcu.id);
        antrean.push(mcu.id);
      }
    });

    // Telusuri seluruh jalur kabel (termasuk melewati Resistor atau Modul Relay menuju Solenoid/Pompa)
    while (antrean.length > 0) {
      const currId = antrean.shift()!;
      const currNode = nodesSaatIni.find((n) => n.id === currId);

      // Jika komponen perantara adalah Relay yang dimatikan manual (nyala === false), jangan teruskan arus ke beban!
      if (
        currNode &&
        currNode.tipe.startsWith("relay_") &&
        currNode.nyala === false
      ) {
        continue;
      }

      kabelSaatIni.forEach((kbl) => {
        let tetanggaId: string | null = null;
        if (kbl.dariId === currId) tetanggaId = kbl.keId;
        else if (kbl.keId === currId) tetanggaId = kbl.dariId;

        if (tetanggaId && !aktifSet.has(tetanggaId)) {
          aktifSet.add(tetanggaId);
          antrean.push(tetanggaId);
        }
      });
    }

    return aktifSet;
  }, [mode, nodesSaatIni, kabelSaatIni, daftarMcuDiKanvas, statusRunPerMcu]);

  const muatPresetTutorialProject = (proj: PresetTutorialProject) => {
    setProjectAktif(proj);
    setDaftarNode({
      ...daftarNode,
      wokwi: proj.nodes,
    });
    setDaftarKabel({
      ...daftarKabel,
      wokwi: proj.kabel,
    });
    setKodePerMcuMap(proj.kodePerMcu);

    const runMapBaru: { [id: string]: boolean } = {};
    const mcuNodes = proj.nodes.filter((n) => TIPE_MCU_LIST.includes(n.tipe));
    mcuNodes.forEach((m) => {
      runMapBaru[m.id] = true;
    });
    setStatusRunPerMcu(runMapBaru);
    if (mcuNodes[0]) {
      setIdTabMcuAktif(mcuNodes[0].id);
      if (onUpdateKodeDariCloud && proj.kodePerMcu[mcuNodes[0].id]) {
        onUpdateKodeDariCloud(proj.kodePerMcu[mcuNodes[0].id]);
      }
    }
    setIdKomponenTerpilih(proj.nodes[0]?.id || null);

    const jam = new Date().toLocaleTimeString("id-ID");
    setLogSerialMultiMcu([
      `[${jam}] 📂 Memuat "${proj.judul}" (${mcuNodes.length} Mikrokontroler & ${proj.kabel.length} Kabel Aktif).`,
      `[${jam}] ✅ Semua Mikrokontroler dijalankan otomatis!`,
    ]);
  };

  const jalankanSatuMcu = (mcuId: string, jalan: boolean) => {
    const mcuObj = daftarMcuDiKanvas.find((m) => m.id === mcuId);
    setStatusRunPerMcu((prev) => ({ ...prev, [mcuId]: jalan }));
    const jam = new Date().toLocaleTimeString("id-ID");
    setLogSerialMultiMcu((prev) => [
      `[${jam}] ${jalan ? "▶️ RUNNING" : "⏹️ STOPPED"}: ${
        mcuObj?.label || mcuId
      } ${
        jalan
          ? "mengeksekusi firmware & mengaktifkan komponen yang terhubung."
          : "dihentikan (komponen pada board ini menjadi OFF)."
      }`,
      ...prev,
    ]);
  };

  const jalankanSemuaMcuSerentak = (jalanSemua: boolean) => {
    const mapBaru: { [id: string]: boolean } = {};
    daftarMcuDiKanvas.forEach((m) => {
      mapBaru[m.id] = jalanSemua;
    });
    setStatusRunPerMcu(mapBaru);
    const jam = new Date().toLocaleTimeString("id-ID");
    setLogSerialMultiMcu((prev) => [
      `[${jam}] ${
        jalanSemua
          ? `🚀 RUN ALL (${daftarMcuDiKanvas.length} Mikrokontroler berjalan serentak!)`
          : "⏹️ STOP ALL (Seluruh mikrokontroler dihentikan)."
      }`,
      ...prev,
    ]);
  };

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

  const komponenTerpilih =
    nodesSaatIni.find((n) => n.id === idKomponenTerpilih) || nodesSaatIni[0] || null;
  const layoutTerpilih = komponenTerpilih
    ? ambilLayoutFisikKomponen(komponenTerpilih.tipe)
    : null;
  const rentangTerpilih = komponenTerpilih
    ? ambilKonfigurasiRentangKomponen(komponenTerpilih.tipe)
    : null;
  const kabelTerpilihObj =
    kabelSaatIni.find((k) => k.id === idKabelTerpilih) || null;

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
    const specRentang = ambilKonfigurasiRentangKomponen(tipe);
    const urutan = nodesSaatIni.filter((n) => n.tipe === tipe).length + 1;
    const idBaru = `${mode}-node-${Date.now()}`;
    const namaLabel = `${label.split(" (")[0]} #${urutan}`;

    const baru: NodeKomponenKanvas = {
      id: idBaru,
      tipe,
      label: namaLabel,
      x: Math.max(15, Math.min(580, xPos)),
      y: Math.max(35, Math.min(380, yPos)),
      nilaiResistor: defaultResistor ?? (tipe === "resistor" ? 1000 : undefined),
      nilaiSensor: defaultSensor ?? specRentang.defaultVal,
      nyala: true,
    };

    setDaftarNode({
      ...daftarNode,
      [mode]: [...nodesSaatIni, baru],
    });
    setIdKomponenTerpilih(baru.id);

    // Jika yang ditambahkan adalah Mikrokontroler baru (ESP32 ke-2, ke-3, atau Arduino), otomatis buatkan Tab Kode Baru!
    if (TIPE_MCU_LIST.includes(tipe)) {
      const templateKodeMcuBaru = `// ============================================================================
// KODE PROGRAM UNTUK ${namaLabel.toUpperCase()}
// ============================================================================
void setup() {
  Serial.begin(115200);
  Serial.println("=== [${namaLabel}] READY & RUNNING ===");
}

void loop() {
  // Hubungkan sensor/aktuator ke pin board ini lalu klik Run!
  delay(1000);
}`;
      setKodePerMcuMap((prev) => ({ ...prev, [idBaru]: templateKodeMcuBaru }));
      setStatusRunPerMcu((prev) => ({ ...prev, [idBaru]: true }));
      setIdTabMcuAktif(idBaru);
    }
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
      const yBaru = Math.max(20, mouseY - 40);
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

  const mcuTabAktifObj =
    daftarMcuDiKanvas.find((m) => m.id === idTabMcuAktif) || daftarMcuDiKanvas[0];

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
                Multi-MCU IDE ({daftarMcuDiKanvas.length} Board Aktif) • Active Circuit Validation
              </span>
              <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
                {mode === "wokwi"
                  ? "Wokwi IoT Studio — Multi-Tab ESP32/Arduino, Validasi Kabel Aktif & 7 Tutorial Proyek Lengkap"
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
          </div>
        </div>

        {/* ====================================================================
            PANEL 7 TUTORIAL & CONTOH RANGKAIAN PROJECT JADI + SYNC BLYNK WIDGETS
           ==================================================================== */}
        {mode === "wokwi" && (
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-950 to-emerald-950/90 p-5 rounded-3xl border border-indigo-500/40 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span className="font-black text-xs sm:text-sm uppercase text-amber-300">
                  7 Tutorial &amp; Contoh Rangkaian Project Jadi (Otomatis Memuat Rangkaian +
                  Multi-Tab Kode MCU + Widget Dashboard Blynk):
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300">
                Aktif: {projectAktif.level}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {DAFTAR_TUTORIAL_PROJECT_WOKWI.map((proj) => {
                const dipilih = projectAktif.id === proj.id;
                const jmlMcuProj = proj.nodes.filter((n) =>
                  TIPE_MCU_LIST.includes(n.tipe)
                ).length;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => muatPresetTutorialProject(proj)}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                      dipilih
                        ? "bg-indigo-600/35 border-amber-400 text-white shadow-lg"
                        : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                          {proj.level}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {jmlMcuProj} Tab MCU
                        </span>
                      </div>
                      <div className="font-black text-xs text-white mt-1.5 leading-snug">
                        {proj.judul}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Muat Project &amp; Blynk ({proj.blynkWidgets.length} Widget)
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
              <div className="lg:col-span-5 space-y-1">
                <div className="font-black text-amber-300">{projectAktif.judul}</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {projectAktif.deskripsiSingkat}
                </p>
              </div>
              <div className="lg:col-span-7 space-y-1">
                <div className="font-black text-emerald-300 uppercase text-[10px]">
                  📋 Langkah Penyambungan Pin (Komponen yang Tidak Terhubung Kabel Tidak Akan Aktif!):
                </div>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-slate-200 font-medium">
                  {projectAktif.langkahWiring.map((lw, i) => (
                    <li key={i}>{lw}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* GUDANG KOMPONEN BERKATEGORI + PREVIEW GAMBAR MINI */}
        <div className="bg-slate-950/90 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Move className="w-4 h-4 text-amber-400" />
              <span className="font-black uppercase text-amber-300">
                Gudang Komponen ({komponenPaletTersaring.length} Item — Tambah ESP32/Arduino Baru
                Otomatis Membuka Tab Program Baru!):
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cariKomponen}
                onChange={(e) => setCariKomponen(e.target.value)}
                placeholder="Cari ESP32, Relay 4CH, Solenoid..."
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

        {/* BAR PILIH WARNA KABEL & KONTROL RUN SEMUA / RUN PER MIKROKONTROLER */}
        <div className="bg-slate-950/95 p-3.5 rounded-3xl border border-indigo-500/30 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => jalankanSemuaMcuSerentak(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Run Semua ({daftarMcuDiKanvas.length} MCU)
            </button>
            <button
              type="button"
              onClick={() => jalankanSemuaMcuSerentak(false)}
              className="px-3 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" /> Stop Semua
            </button>

            {/* Tombol Run/Stop Individual per Mikrokontroler */}
            {daftarMcuDiKanvas.map((mcu) => {
              const sedangRun = !!statusRunPerMcu[mcu.id];
              return (
                <button
                  key={mcu.id}
                  type="button"
                  onClick={() => jalankanSatuMcu(mcu.id, !sedangRun)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-black flex items-center gap-1.5 border cursor-pointer transition ${
                    sedangRun
                      ? "bg-emerald-950/90 border-emerald-400 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                  title="Klik untuk Run atau Stop mikrokontroler ini saja"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sedangRun ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                    }`}
                  />
                  <span>{mcu.label}: {sedangRun ? "RUNNING" : "STOPPED"}</span>
                </button>
              );
            })}
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
            AREA UTAMA: KANVAS DRAG & DROP (8 KOLOM) + INSPEKTOR REALISTIS (4 KOLOM)
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
              className="relative w-full h-full min-w-[760px] min-h-[460px]"
            >
              {/* LAYER SVG GARIS KABEL SIKU ORTHOGONAL */}
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
                  const kabelDialiriArus =
                    setIdKomponenTerhubungKeMcuRunning.has(asal.id) &&
                    setIdKomponenTerhubungKeMcuRunning.has(tujuan.id);

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
                        opacity={kabelDialiriArus ? 1 : 0.35}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdKabelTerpilih(kbl.id);
                        }}
                      />
                      <circle cx={koorAsal.x} cy={koorAsal.y} r="4" fill={kbl.warna} />
                      <circle cx={koorTujuan.x} cy={koorTujuan.y} r="4" fill={kbl.warna} />

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

              {/* RENDER SETIAP KOMPONEN (DENGAN STATUS VALIDASI TERHUBUNG KE RANGKAIAN AKTIF) */}
              {nodesSaatIni.map((node) => {
                const aktifDipilih = komponenTerpilih?.id === node.id;
                const layout = ambilLayoutFisikKomponen(node.tipe);
                const adalahMcu = TIPE_MCU_LIST.includes(node.tipe);

                // Komponen dinyatakan menyala/aktif HANYA jika terhubung ke MCU yang sedang RUNNING
                const terhubungKeRangkaianAktif =
                  setIdKomponenTerhubungKeMcuRunning.has(node.id);
                const statusNyalaEfektif =
                  Boolean(node.nyala) && terhubungKeRangkaianAktif;

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
                      if (adalahMcu) setIdTabMcuAktif(node.id);
                      setSedangGeserId(node.id);
                    }}
                    className={`absolute rounded-2xl cursor-move transition-all ${
                      aktifDipilih ? "ring-2 ring-emerald-400 z-10" : "z-10"
                    } ${!terhubungKeRangkaianAktif ? "opacity-60 grayscale-[40%]" : ""}`}
                  >
                    <div className="h-[18px] px-2 flex justify-between items-center bg-slate-900/95 rounded-t-xl border-x border-t border-slate-700 text-[9px] font-black truncate">
                      <span className="truncate text-amber-300">{node.label}</span>
                      <span
                        className={`text-[7.5px] font-mono px-1 rounded shrink-0 ml-1 ${
                          terhubungKeRangkaianAktif
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/30 text-rose-300"
                        }`}
                      >
                        {adalahMcu
                          ? statusRunPerMcu[node.id]
                            ? "● RUN"
                            : "⏹ STOP"
                          : terhubungKeRangkaianAktif
                          ? "⚡ WIRED"
                          : "⚠️ UNWIRED"}
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
                        nyala={statusNyalaEfektif}
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

          {/* PANEL SAMPING KANAN (4 KOLOM): INSPEKTOR REALISTIS & TABEL PINOUT */}
          <div
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-4"
            } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[620px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Inspector Parameter Realistis
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

            {komponenTerpilih && layoutTerpilih && rentangTerpilih && (
              <div className="space-y-4 text-xs">
                {/* Status Validasi Rangkaian Komponen Terpilih */}
                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between ${
                    setIdKomponenTerhubungKeMcuRunning.has(komponenTerpilih.id)
                      ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/60 border-rose-500/50 text-rose-300"
                  }`}
                >
                  <span>
                    {setIdKomponenTerhubungKeMcuRunning.has(komponenTerpilih.id)
                      ? "⚡ Terhubung ke Mikrokontroler RUNNING (Aktif)"
                      : "⚠️ Tidak Terhubung Kabel / MCU Sedang STOP (Komponen Padam)"}
                  </span>
                </div>

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
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
                    <div className="text-[11px] font-black text-emerald-300 uppercase">
                      ⚙️ {rentangTerpilih.labelParameter}
                    </div>

                    {rentangTerpilih.punyaSlider ? (
                      <>
                        <div className="flex justify-between items-center font-mono text-xs">
                          <span className="text-slate-400">
                            Min: {rentangTerpilih.min} {rentangTerpilih.satuan}
                          </span>
                          <span className="text-base font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-amber-400/40">
                            {komponenTerpilih.nilaiSensor ?? rentangTerpilih.defaultVal}{" "}
                            {rentangTerpilih.satuan}
                          </span>
                          <span className="text-slate-400">
                            Max: {rentangTerpilih.max} {rentangTerpilih.satuan}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={rentangTerpilih.min}
                          max={rentangTerpilih.max}
                          step={rentangTerpilih.step}
                          value={komponenTerpilih.nilaiSensor ?? rentangTerpilih.defaultVal}
                          onChange={(e) =>
                            updatePropertiKomponen(komponenTerpilih.id, {
                              nilaiSensor: Number(e.target.value),
                            })
                          }
                          className="w-full accent-emerald-400 cursor-pointer"
                        />
                      </>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-semibold">
                        ⚡ Komponen Digital Sakelar <b>ON / OFF</b>.
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {rentangTerpilih.catatanFisik}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        const statusBaru = !komponenTerpilih.nyala;
                        updatePropertiKomponen(komponenTerpilih.id, {
                          nyala: statusBaru,
                        });
                      }}
                      className={`w-full py-2.5 rounded-xl font-black flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        komponenTerpilih.nyala
                          ? "bg-emerald-500 text-slate-950 shadow-lg"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {komponenTerpilih.nyala
                        ? "STATUS: ON / HIGH (AKTIF)"
                        : "STATUS: OFF / LOW (MATI)"}
                    </button>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5">
                  <span className="font-black text-indigo-300 uppercase text-[11px] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Daftar &amp; Keterangan Pin (
                    {layoutTerpilih.pins.length} Titik)
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
                            {p.sisi}
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
          </div>
        </div>

        {/* ====================================================================
            STUDIO PEMROGRAMAN MULTI-MIKROKONTROLER (1 TAB PER ESP32/ARDUINO!)
           ==================================================================== */}
        {mode === "wokwi" && daftarMcuDiKanvas.length > 0 && (
          <div className="bg-slate-950 rounded-3xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl">
            {/* Bar Tab untuk Setiap Mikrokontroler di Kanvas (2 ESP32 = 2 Tab, 3 MCU = 3 Tab) */}
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <Code2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-black uppercase text-slate-400 mr-1">
                  Tab Program MCU ({daftarMcuDiKanvas.length} Board):
                </span>
                {daftarMcuDiKanvas.map((mcu, idx) => {
                  const tabDipilih = mcuTabAktifObj?.id === mcu.id;
                  const sedangRun = !!statusRunPerMcu[mcu.id];
                  return (
                    <button
                      key={mcu.id}
                      type="button"
                      onClick={() => setIdTabMcuAktif(mcu.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                        tabDipilih
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-indigo-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sedangRun ? "bg-emerald-400 animate-ping" : "bg-rose-500"
                        }`}
                      />
                      <span>
                        Tab #{idx + 1}: {mcu.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tombol Run Board Ini Saja vs Run Semua Board */}
              {mcuTabAktifObj && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        kodePerMcuMap[mcuTabAktifObj.id] || ""
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      jalankanSatuMcu(
                        mcuTabAktifObj.id,
                        !statusRunPerMcu[mcuTabAktifObj.id]
                      )
                    }
                    className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer ${
                      statusRunPerMcu[mcuTabAktifObj.id]
                        ? "bg-amber-400 text-slate-950"
                        : "bg-emerald-500 text-slate-950"
                    }`}
                  >
                    {statusRunPerMcu[mcuTabAktifObj.id] ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-slate-950" /> Stop{" "}
                        {mcuTabAktifObj.label} Saja
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-slate-950" /> Run{" "}
                        {mcuTabAktifObj.label} Saja
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => jalankanSemuaMcuSerentak(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" /> Run Semua (
                    {daftarMcuDiKanvas.length} MCU)
                  </button>
                </div>
              )}
            </div>

            {/* Editor Kode per Tab MCU & Serial Monitor Gabungan */}
            {mcuTabAktifObj && (
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8 border-r border-slate-800">
                  <textarea
                    rows={11}
                    value={
                      kodePerMcuMap[mcuTabAktifObj.id] ||
                      `// Program C++ untuk ${mcuTabAktifObj.label}\nvoid setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setKodePerMcuMap({
                        ...kodePerMcuMap,
                        [mcuTabAktifObj.id]: val,
                      });
                      if (onUpdateKodeDariCloud) onUpdateKodeDariCloud(val);
                    }}
                    spellCheck={false}
                    className="w-full p-5 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y"
                  />
                </div>
                <div className="lg:col-span-4 p-4 bg-black/70 flex flex-col justify-between space-y-3 font-mono text-xs">
                  <div className="space-y-2">
                    <div className="text-[11px] font-black text-amber-300 uppercase flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" /> Multi-MCU Serial Monitor &amp;
                      Active Bus Log
                    </div>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto text-[11px] text-slate-300">
                      {logSerialMultiMcu.map((lg, i) => (
                        <div key={i} className="leading-snug border-b border-slate-900 pb-1">
                          {lg}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Komponen Aktif Terhubung:{" "}
                    <b className="text-emerald-400">
                      {setIdKomponenTerhubungKeMcuRunning.size} dari {nodesSaatIni.length} Komponen
                    </b>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PANEL DASHBOARD IOT CLOUD: DRAG & DROP BLYNK STUDIO (OTOMATIS MEMUAT WIDGET DARI TUTORIAL PROJECT!) */}
      {mode === "wokwi" && bukaDashboardIot && (
        <IotCloudBlynkPanel
          nodesKanvas={nodesSaatIni}
          presetWidgets={projectAktif.blynkWidgets}
          onUpdateNodeDariCloud={(id, perubahan) =>
            updatePropertiKomponen(id, perubahan)
          }
          onGenerateKodeIotKeEditor={(kodeBaru) => {
            if (mcuTabAktifObj) {
              setKodePerMcuMap((prev) => ({
                ...prev,
                [mcuTabAktifObj.id]: kodeBaru,
              }));
            }
            if (onUpdateKodeDariCloud) onUpdateKodeDariCloud(kodeBaru);
          }}
        />
      )}
    </div>
  );
};