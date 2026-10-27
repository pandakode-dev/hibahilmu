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
  { nama: "Hijau (SDA/Output)", hex: "#22c55e" },
  { nama: "Kuning (PWM/Clock)", hex: "#facc15" },
  { nama: "Ungu (SCL/Trigger)", hex: "#a855f7" },
  { nama: "Oranye (Simulink)", hex: "#f97316" },
];

const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: ItemPaletGudang[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit V1", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno R3", kategori: "Microcontroller" },
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
      tipe: "servo",
      label: "Motor Servo SG90",
      kategori: "Aktuator & Layar",
      defaultSensor: 90,
    },
    { tipe: "buzzer", label: "Buzzer Piezo Alarm", kategori: "Aktuator & Layar" },
    { tipe: "relay_5v", label: "Modul Relay 5V IoT", kategori: "Aktuator & Layar" },
    { tipe: "led_hijau", label: "LED Hijau 5mm", kategori: "Pasif & Tombol" },
    { tipe: "led_merah", label: "LED Merah 5mm", kategori: "Pasif & Tombol" },
    { tipe: "led_kuning", label: "LED Kuning 5mm", kategori: "Pasif & Tombol" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif & Tombol",
      defaultResistor: 220,
    },
    {
      tipe: "potensiometer",
      label: "Potensiometer Analog",
      kategori: "Pasif & Tombol",
      defaultSensor: 50,
    },
    { tipe: "push_button", label: "Sakelar Push Button", kategori: "Pasif & Tombol" },
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

const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: [
    { id: "wk-1", tipe: "esp32", label: "ESP32 Utama", x: 30, y: 55, nyala: true },
    {
      id: "wk-2",
      tipe: "resistor",
      label: "R1 Pembatas Arus",
      x: 235,
      y: 45,
      nilaiResistor: 330,
    },
    { id: "wk-3", tipe: "led_hijau", label: "LED Status", x: 425, y: 40, nyala: true },
    {
      id: "wk-4",
      tipe: "dht22",
      label: "DHT22 Suhu",
      x: 245,
      y: 185,
      nilaiSensor: 31,
    },
    {
      id: "wk-5",
      tipe: "servo",
      label: "Servo Pintu",
      x: 420,
      y: 190,
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
      x: 210,
      y: 45,
      nilaiResistor: 1000,
    },
    {
      id: "ewb-3",
      tipe: "resistor",
      label: "Resistor R2 (Beban)",
      x: 210,
      y: 185,
      nilaiResistor: 2200,
    },
    {
      id: "ewb-4",
      tipe: "osiloskop",
      label: "Osiloskop Tektronix",
      x: 420,
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
      x: 200,
      y: 115,
      nilaiSensor: 5,
    },
    {
      id: "sim-3",
      tipe: "Transfer Fcn",
      label: "Plant Motor DC",
      x: 375,
      y: 115,
      nilaiSensor: 1,
    },
    {
      id: "sim-4",
      tipe: "Scope Plot",
      label: "Output Scope y(t)",
      x: 535,
      y: 115,
    },
  ],
};

const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: [
    {
      id: "w-1",
      dariId: "wk-1",
      pinAsal: "GPIO2 (LED)",
      keId: "wk-2",
      pinTujuan: "Pin 1 (Kaki Kiri)",
      warna: "#38bdf8",
    },
    {
      id: "w-2",
      dariId: "wk-2",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "wk-3",
      pinTujuan: "Anoda (+)",
      warna: "#22c55e",
    },
    {
      id: "w-3",
      dariId: "wk-1",
      pinAsal: "GPIO15 (DHT)",
      keId: "wk-4",
      pinTujuan: "2: DATA (SDA)",
      warna: "#facc15",
    },
    {
      id: "w-4",
      dariId: "wk-1",
      pinAsal: "GPIO18 (PWM)",
      keId: "wk-5",
      pinTujuan: "PWM (Kuning/Oranye)",
      warna: "#a855f7",
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
    },
    {
      id: "e-2",
      dariId: "ewb-2",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "ewb-3",
      pinTujuan: "Pin 1 (Kaki Kiri)",
      warna: "#38bdf8",
    },
    {
      id: "e-3",
      dariId: "ewb-2",
      pinAsal: "Pin 2 (Kaki Kanan)",
      keId: "ewb-4",
      pinTujuan: "Channel 1 (CH1)",
      warna: "#22c55e",
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
    },
    {
      id: "m-2",
      dariId: "sim-2",
      pinAsal: "Out1 (u)",
      keId: "sim-3",
      pinTujuan: "In1",
      warna: "#38bdf8",
    },
    {
      id: "m-3",
      dariId: "sim-3",
      pinAsal: "Out1 (y)",
      keId: "sim-4",
      pinTujuan: "Scope In",
      warna: "#22c55e",
    },
  ],
};

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

  // State Menu Tarik Garis / Edit Kabel & Warna Garis
  const [warnaKabelAktif, setWarnaKabelAktif] = useState<string>("#38bdf8");
  const [modePasangKabelDariId, setModePasangKabelDariId] = useState<string | null>(null);
  const [pinAsalPilih, setPinAsalPilih] = useState<string>("GPIO2 (LED)");
  const [idTujuanManual, setIdTujuanManual] = useState<string>(
    KOMPONEN_AWAL_PER_MODE[mode][1]?.id || ""
  );
  const [pinTujuanPilih, setPinTujuanPilih] = useState<string>("Pin 1 (Kaki Kiri)");

  // Toggle Panel IoT Cloud & Blynk
  const [bukaDashboardIot, setBukaDashboardIot] = useState<boolean>(true);

  useEffect(() => {
    setKategoriPaletAktif("Semua");
    setCariKomponen("");
    const listAwal = KOMPONEN_AWAL_PER_MODE[mode];
    setIdKomponenTerpilih(listAwal[0]?.id || null);
    setIdTujuanManual(listAwal[1]?.id || "");
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
      ? "h-[320px]"
      : ukuranKanvas === "sedang"
      ? "h-[460px]"
      : ukuranKanvas === "besar"
      ? "h-[620px]"
      : "h-[780px]";

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

  const handleMouseMoveKanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sedangGeserId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xBaru = Math.max(
      10,
      Math.min(
        rect.width / skalaZoom - 130,
        (e.clientX - rect.left) / skalaZoom - 60
      )
    );
    const yBaru = Math.max(
      10,
      Math.min(
        rect.height / skalaZoom - 90,
        (e.clientY - rect.top) / skalaZoom - 40
      )
    );

    setDaftarNode({
      ...daftarNode,
      [mode]: nodesSaatIni.map((n) =>
        n.id === sedangGeserId ? { ...n, x: xBaru, y: yBaru } : n
      ),
    });
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
    const baru: KabelKoneksiItem = {
      id: "kbl-" + Date.now(),
      dariId,
      pinAsal: pinDari,
      keId,
      pinTujuan: pinKe,
      warna,
    };
    setDaftarKabel({
      ...daftarKabel,
      [mode]: [...kabelSaatIni, baru],
    });
  };

  const ubahWarnaKabel = (kabelId: string, warnaBaru: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.map((k) =>
        k.id === kabelId ? { ...k, warna: warnaBaru } : k
      ),
    });
  };

  const hapusKabel = (kabelId: string) => {
    setDaftarKabel({
      ...daftarKabel,
      [mode]: kabelSaatIni.filter((k) => k.id !== kabelId),
    });
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
                Interactive Drag &amp; Drop Schematic Studio + Wire &amp; Pinout Manager
              </span>
              <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
                {mode === "wokwi"
                  ? "Wokwi IoT Breadboard Studio (ESP32, Sensor, Pinout & Blynk/MQTT Cloud)"
                  : mode === "ewb"
                  ? "EWB (Electronics Workbench) — Rangkaian RLC, Resistor 4-Gelang & Pinout IC"
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
                placeholder="Cari nama komponen..."
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

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto pr-1">
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

                  <div className="font-bold text-[11px] text-white group-hover:text-emerald-300 leading-tight line-clamp-1">
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

        {/* ====================================================================
            MENU STUDIO TARIK GARIS, WARNA KABEL & ARAH PIN TUJUAN
           ==================================================================== */}
        <div className="bg-slate-950/95 p-4 rounded-3xl border border-indigo-500/30 space-y-3 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Cable className="w-4 h-4 text-sky-400" />
              <span className="font-black uppercase text-sky-300">
                Menu Tarik Garis Kabel, Pilih Warna Garis &amp; Arah Pin Komponen
              </span>
            </div>

            {/* Pilihan Warna Garis Kabel */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                Warna Garis Kabel:
              </span>
              {PILIHAN_WARNA_KABEL.map((w) => (
                <button
                  key={w.hex}
                  type="button"
                  onClick={() => setWarnaKabelAktif(w.hex)}
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

          {/* Form Arahkan Garis dari Komponen & Pin Asal -> Komponen & Pin Tujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-1">
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                1. Komponen Asal:
              </label>
              <select
                value={komponenTerpilih?.id || ""}
                onChange={(e) => {
                  const idBaru = e.target.value;
                  setIdKomponenTerpilih(idBaru);
                  const nd = nodesSaatIni.find((n) => n.id === idBaru);
                  if (nd) {
                    setPinAsalPilih(ambilInfoPinKomponen(nd.tipe).daftarPin[0] || "Pin 1");
                  }
                }}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
              >
                {nodesSaatIni.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Pin Asal:
              </label>
              <select
                value={pinAsalPilih}
                onChange={(e) => setPinAsalPilih(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-amber-300"
              >
                {(infoPinTerpilih?.daftarPin || ["Pin 1"]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                2. Arahkan ke Komponen Tujuan:
              </label>
              <select
                value={nodeTujuanManualObj?.id || ""}
                onChange={(e) => {
                  const idKe = e.target.value;
                  setIdTujuanManual(idKe);
                  const nd = nodesSaatIni.find((n) => n.id === idKe);
                  if (nd) {
                    setPinTujuanPilih(ambilInfoPinKomponen(nd.tipe).daftarPin[0] || "Pin 1");
                  }
                }}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-emerald-300"
              >
                {nodesSaatIni
                  .filter((n) => n.id !== komponenTerpilih?.id)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Pin Tujuan:
              </label>
              <select
                value={pinTujuanPilih}
                onChange={(e) => setPinTujuanPilih(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sky-300"
              >
                {(infoPinTujuanObj?.daftarPin || ["Pin 1"]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
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
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
              >
                + Tarik Garis Kabel
              </button>
            </div>
          </div>

          {modePasangKabelDariId && (
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400 text-xs font-black text-indigo-200 text-center animate-pulse">
              🔌 Klik komponen tujuan di dalam kanvas untuk menyambungkan garis kabel berwarna{" "}
              <span style={{ color: warnaKabelAktif }}>{warnaKabelAktif}</span>!
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
            onMouseUp={() => setSedangGeserId(null)}
            onMouseLeave={() => setSedangGeserId(null)}
            className={`${
              ukuranKanvas === "penuh" ? "lg:col-span-12" : "lg:col-span-8"
            } ${tinggiKanvasPx} rounded-3xl bg-[#070d19] border-2 border-dashed border-slate-700 relative overflow-auto select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-all duration-200`}
          >
            <div
              style={{
                transform: `scale(${skalaZoom})`,
                transformOrigin: "top left",
                width: `${100 / skalaZoom}%`,
                height: `${100 / skalaZoom}%`,
              }}
              className="relative w-full h-full min-w-[680px] min-h-[320px]"
            >
              {/* Layer Garis Kabel Penghubung Antar Komponen Beserta Label Pin */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {kabelSaatIni.map((kbl, idxKbl) => {
                  const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  if (!asal || !tujuan) return null;
                  const offset = (idxKbl % 3) * 6 - 6;
                  const x1 = asal.x + 65;
                  const y1 = asal.y + 42 + offset;
                  const x2 = tujuan.x + 65;
                  const y2 = tujuan.y + 42 + offset;
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2;

                  return (
                    <g key={kbl.id}>
                      <path
                        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                        stroke={kbl.warna}
                        strokeWidth="3.5"
                        fill="none"
                        strokeDasharray={mode === "matlab" ? "6 3" : undefined}
                      />
                      <circle cx={x1} cy={y1} r="5" fill={kbl.warna} />
                      <circle cx={x2} cy={y2} r="5" fill={kbl.warna} />
                      <rect
                        x={midX - 58}
                        y={midY - 10}
                        width="116"
                        height="16"
                        rx="4"
                        fill="#0f172a"
                        stroke={kbl.warna}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x={midX}
                        y={midY + 1}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="7.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {kbl.pinAsal.slice(0, 8)} → {kbl.pinTujuan.slice(0, 8)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Daftar Komponen di Atas Kanvas */}
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
                      if (modePasangKabelDariId && modePasangKabelDariId !== node.id) {
                        const asalNode = nodesSaatIni.find(
                          (x) => x.id === modePasangKabelDariId
                        );
                        const pAsal = asalNode
                          ? ambilInfoPinKomponen(asalNode.tipe).daftarPin[0]
                          : "Pin 1";
                        const pTujuan = specPin.daftarPin[0] || "Pin 1";
                        tambahKabelKoneksi(
                          modePasangKabelDariId,
                          pAsal,
                          node.id,
                          pTujuan,
                          warnaKabelAktif
                        );
                        setModePasangKabelDariId(null);
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
                      <span className="text-[10px] font-black text-amber-300 truncate max-w-[105px]">
                        {node.label}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModePasangKabelDariId(node.id);
                        }}
                        className="px-1.5 py-0.5 rounded bg-indigo-600/40 hover:bg-indigo-600 text-[9px] font-mono font-bold text-indigo-200 cursor-pointer"
                        title="Klik untuk menarik garis kabel dari komponen ini"
                      >
                        🔌 {specPin.jumlahPin}p
                      </button>
                    </div>

                    <VisualKomponenRealistis
                      tipe={node.tipe}
                      nilaiResistor={node.nilaiResistor}
                      nyala={node.nyala}
                      nilaiSensor={node.nilaiSensor}
                      ukuran="kanvas"
                    />
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-400 pointer-events-none bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800">
              <span>
                💡 Klik komponen untuk melihat penjelasan Pinout di kanan, atau klik [🔌 Pin] untuk
                menarik garis.
              </span>
              <div className="flex items-center gap-3 pointer-events-auto">
                <span>
                  Komponen: <b className="text-emerald-400">{nodesSaatIni.length}</b> | Garis Kabel:{" "}
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
            } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[620px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Inspector, Pinout &amp; Edit Kabel
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

            {/* DAFTAR KABEL TERPASANG (BISA EDIT WARNA GARIS & HAPUS KABEL) */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="font-black text-sky-300 uppercase text-[11px] flex items-center justify-between">
                <span>🔌 Daftar Garis Kabel ({kabelSaatIni.length})</span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {kabelSaatIni.map((kbl) => {
                  const nAsal = nodesSaatIni.find((n) => n.id === kbl.dariId);
                  const nTujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
                  return (
                    <div
                      key={kbl.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white truncate">
                          {nAsal?.label || "Node"} → {nTujuan?.label || "Node"}
                        </span>
                        <button
                          type="button"
                          onClick={() => hapusKabel(kbl.id)}
                          className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        [{kbl.pinAsal}] ➔ [{kbl.pinTujuan}]
                      </div>
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="text-[9px] text-slate-500 mr-1">Warna:</span>
                        {PILIHAN_WARNA_KABEL.map((w) => (
                          <button
                            key={w.hex}
                            type="button"
                            onClick={() => ubahWarnaKabel(kbl.id, w.hex)}
                            style={{ backgroundColor: w.hex }}
                            className={`w-3.5 h-3.5 rounded-full cursor-pointer ${
                              kbl.warna === w.hex ? "ring-2 ring-white" : "opacity-60"
                            }`}
                            title={`Ubah ke ${w.nama}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan Multimeter */}
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

      {/* PANEL DASHBOARD IOT CLOUD: BLYNK AUTH TOKEN, MQTT BROKER, WIFI SSID & LOCAL WEB */}
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