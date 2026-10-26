"use client";

import React, { useState, useRef } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Trash2,
  PlusCircle,
  Cable,
  RotateCcw,
  Sliders,
  Move,
  CheckCircle2,
} from "lucide-react";
import {
  VisualKomponenRealistis,
  ResistorVisualSvg,
  hitungGelangWarnaResistor,
} from "./ResistorVisualSvg";

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
  keId: string;
  warna: string;
}

interface CanvasProps {
  mode: "wokwi" | "ewb" | "matlab";
}

// Katalog Gudang Komponen yang Disediakan untuk Drag-and-Drop
const PALET_KOMPONEN: {
  [key in "wokwi" | "ewb" | "matlab"]: {
    tipe: string;
    label: string;
    kategori: string;
    defaultResistor?: number;
    defaultSensor?: number;
  }[];
} = {
  wokwi: [
    { tipe: "esp32", label: "ESP32 DevKit V1", kategori: "Microcontroller" },
    { tipe: "arduino_uno", label: "Arduino Uno R3", kategori: "Microcontroller" },
    {
      tipe: "resistor",
      label: "Resistor Gelang Warna",
      kategori: "Pasif",
      defaultResistor: 220,
    },
    { tipe: "led_hijau", label: "LED Hijau 5mm", kategori: "Aktuator" },
    { tipe: "led_merah", label: "LED Merah (Alarm)", kategori: "Aktuator" },
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
      tipe: "servo",
      label: "Motor Servo SG90",
      kategori: "Aktuator",
      defaultSensor: 90,
    },
  ],
  ewb: [
    {
      tipe: "vcc_dc",
      label: "Sumber Tegangan DC",
      kategori: "Power Supply",
      defaultSensor: 12,
    },
    {
      tipe: "resistor",
      label: "Resistor (4-Band Color)",
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
      tipe: "gerbang_logika",
      label: "IC Gerbang Logika 74LS",
      kategori: "Digital Logic",
    },
    {
      tipe: "led_hijau",
      label: "Lampu Uji Indikator",
      kategori: "Indikator",
    },
  ],
  matlab: [
    {
      tipe: "Sine Wave",
      label: "Sine Wave Source",
      kategori: "Sources",
      defaultSensor: 50,
    },
    {
      tipe: "PID Controller",
      label: "PID Controller (Kp,Ki,Kd)",
      kategori: "Continuous",
      defaultSensor: 2,
    },
    {
      tipe: "Transfer Fcn",
      label: "Transfer Function 1/(s+1)",
      kategori: "Plant Model",
      defaultSensor: 1,
    },
    {
      tipe: "Scope Plot",
      label: "Simulink Scope Viewer",
      kategori: "Sinks",
    },
  ],
};

const KOMPONEN_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
} = {
  wokwi: [
    { id: "wk-1", tipe: "esp32", label: "ESP32 Utama", x: 35, y: 55, nyala: true },
    {
      id: "wk-2",
      tipe: "resistor",
      label: "R1 Pembatas Arus",
      x: 245,
      y: 45,
      nilaiResistor: 330,
    },
    { id: "wk-3", tipe: "led_hijau", label: "LED Status", x: 435, y: 40, nyala: true },
    {
      id: "wk-4",
      tipe: "dht22",
      label: "DHT22 Suhu",
      x: 255,
      y: 175,
      nilaiSensor: 31,
    },
    {
      id: "wk-5",
      tipe: "servo",
      label: "Servo Pintu",
      x: 430,
      y: 180,
      nilaiSensor: 90,
    },
  ],
  ewb: [
    {
      id: "ewb-1",
      tipe: "vcc_dc",
      label: "Sumber Vcc 12V",
      x: 35,
      y: 80,
      nilaiSensor: 12,
    },
    {
      id: "ewb-2",
      tipe: "resistor",
      label: "Resistor R1 (Atas)",
      x: 215,
      y: 45,
      nilaiResistor: 1000,
    },
    {
      id: "ewb-3",
      tipe: "resistor",
      label: "Resistor R2 (Beban)",
      x: 215,
      y: 175,
      nilaiResistor: 2200,
    },
    {
      id: "ewb-4",
      tipe: "gerbang_logika",
      label: "IC 74LS08 (AND)",
      x: 430,
      y: 110,
      nyala: true,
    },
  ],
  matlab: [
    {
      id: "sim-1",
      tipe: "Sine Wave",
      label: "Input Referensi r(t)",
      x: 30,
      y: 105,
      nilaiSensor: 10,
    },
    {
      id: "sim-2",
      tipe: "PID Controller",
      label: " Blok Kendali PID",
      x: 205,
      y: 105,
      nilaiSensor: 5,
    },
    {
      id: "sim-3",
      tipe: "Transfer Fcn",
      label: "Plant Motor DC",
      x: 380,
      y: 105,
      nilaiSensor: 1,
    },
    {
      id: "sim-4",
      tipe: "Scope Plot",
      label: "Output Scope y(t)",
      x: 540,
      y: 105,
    },
  ],
};

const KABEL_AWAL_PER_MODE: {
  [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
} = {
  wokwi: [
    { id: "w-1", dariId: "wk-1", keId: "wk-2", warna: "#38bdf8" },
    { id: "w-2", dariId: "wk-2", keId: "wk-3", warna: "#22c55e" },
    { id: "w-3", dariId: "wk-1", keId: "wk-4", warna: "#facc15" },
    { id: "w-4", dariId: "wk-1", keId: "wk-5", warna: "#a855f7" },
  ],
  ewb: [
    { id: "e-1", dariId: "ewb-1", keId: "ewb-2", warna: "#ef4444" },
    { id: "e-2", dariId: "ewb-2", keId: "ewb-3", warna: "#38bdf8" },
    { id: "e-3", dariId: "ewb-2", keId: "ewb-4", warna: "#22c55e" },
  ],
  matlab: [
    { id: "m-1", dariId: "sim-1", keId: "sim-2", warna: "#f97316" },
    { id: "m-2", dariId: "sim-2", keId: "sim-3", warna: "#38bdf8" },
    { id: "m-3", dariId: "sim-3", keId: "sim-4", warna: "#22c55e" },
  ],
};

export const ElectronicAndIotCanvas: React.FC<CanvasProps> = ({ mode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [daftarNode, setDaftarNode] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: NodeKomponenKanvas[];
  }>(KOMPONEN_AWAL_PER_MODE);

  const [daftarKabel, setDaftarKabel] = useState<{
    [key in "wokwi" | "ewb" | "matlab"]: KabelKoneksiItem[];
  }>(KABEL_AWAL_PER_MODE);

  const [idKomponenTerpilih, setIdKomponenTerpilih] = useState<string | null>(
    KOMPONEN_AWAL_PER_MODE[mode][1]?.id || null
  );
  const [sedangGeserId, setSedangGeserId] = useState<string | null>(null);
  const [modePasangKabelDariId, setModePasangKabelDariId] = useState<string | null>(null);

  const nodesSaatIni = daftarNode[mode] || [];
  const kabelSaatIni = daftarKabel[mode] || [];
  const komponenTerpilih =
    nodesSaatIni.find((n) => n.id === idKomponenTerpilih) ||
    nodesSaatIni.find((n) => n.tipe === "resistor") ||
    nodesSaatIni[0] ||
    null;

  // Fungsi Tambah Komponen via Drag-and-Drop dari Palet ke Kanvas
  const tambahKomponenKeKanvas = (
    tipe: string,
    label: string,
    xPos = 140,
    yPos = 90,
    defaultResistor?: number,
    defaultSensor?: number
  ) => {
    const baru: NodeKomponenKanvas = {
      id: `${mode}-node-${Date.now()}`,
      tipe,
      label: `${label} #${nodesSaatIni.length + 1}`,
      x: Math.max(15, Math.min(540, xPos)),
      y: Math.max(15, Math.min(220, yPos)),
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
      const xDrop = e.clientX - rect.left - 55;
      const yDrop = e.clientY - rect.top - 35;
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

  // Fungsi Geser Posisi Komponen di dalam Kanvas
  const handleMouseMoveKanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sedangGeserId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xBaru = Math.max(10, Math.min(rect.width - 135, e.clientX - rect.left - 60));
    const yBaru = Math.max(10, Math.min(rect.height - 95, e.clientY - rect.top - 40));

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

  // Hitung Analisis Rangkaian Otomatis (Hukum Ohm untuk resistor yang ada di kanvas)
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
    <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-indigo-500/40 space-y-6 shadow-2xl">
      {/* HEADER BAR MEJA KERJA DRAG & DROP */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
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
              Interactive Drag &amp; Drop Schematic Studio
            </span>
            <h3 className="font-black text-base sm:text-lg text-white mt-0.5">
              {mode === "wokwi"
                ? "Wokwi IoT Breadboard Studio (ESP32, Arduino, Sensor & Resistor Gelang Warna)"
                : mode === "ewb"
                ? "EWB (Electronics Workbench) — Rangkaian RLC, Resistor 4-Gelang & Gerbang Logika"
                : "MATLAB Simulink — Diagram Blok Sistem Kendali PID & Pengolahan Sinyal"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Rangkaian Default
          </button>
        </div>
      </div>

      {/* PALET GUDANG KOMPONEN (DRAG & DROP KE KANVAS DI BAWAH) */}
      <div className="space-y-2">
        <div className="flex flex-wrap justify-between items-center text-xs">
          <span className="font-black uppercase text-amber-300 flex items-center gap-1.5">
            <Move className="w-4 h-4" /> Gudang Komponen: Tarik (Drag &amp; Drop) atau Klik untuk
            Menaruh ke Meja Rangkaian
          </span>
          {modePasangKabelDariId && (
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full font-black animate-pulse">
              🔌 Pilih komponen tujuan di kanvas untuk menyambungkan kabel...
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {PALET_KOMPONEN[mode].map((item, idx) => (
            <div
              key={idx}
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
                  100 + idx * 45,
                  80,
                  item.defaultResistor,
                  item.defaultSensor
                )
              }
              className="p-3 rounded-2xl bg-slate-950 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-400 cursor-grab active:cursor-grabbing flex flex-col items-center justify-between text-center gap-1.5 transition group"
              title="Tarik (Drag) ke kanvas atau Klik langsung untuk menambahkan"
            >
              <span className="text-[9px] font-black uppercase text-indigo-300">
                {item.kategori}
              </span>
              <div className="font-bold text-xs text-white group-hover:text-emerald-300 leading-tight">
                {item.label}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold">
                <PlusCircle className="w-3 h-3" /> Drag / Klik
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AREA UTAMA: KANVAS DRAG & DROP (8 KOLOM) + INSPEKTOR RESISTOR & MULTIMETER (4 KOLOM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KANVAS DRAG-AND-DROP INTERAKTIF */}
        <div
          ref={containerRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropDariPalet}
          onMouseMove={handleMouseMoveKanvas}
          onMouseUp={() => setSedangGeserId(null)}
          onMouseLeave={() => setSedangGeserId(null)}
          className="lg:col-span-8 h-[350px] rounded-3xl bg-[#070d19] border-2 border-dashed border-slate-700 relative overflow-hidden select-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px]"
        >
          {/* Layer Garis Kabel Penghubung Antar Komponen (SVG Wires) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {kabelSaatIni.map((kbl) => {
              const asal = nodesSaatIni.find((n) => n.id === kbl.dariId);
              const tujuan = nodesSaatIni.find((n) => n.id === kbl.keId);
              if (!asal || !tujuan) return null;
              const x1 = asal.x + 65;
              const y1 = asal.y + 42;
              const x2 = tujuan.x + 65;
              const y2 = tujuan.y + 42;
              const midX = (x1 + x2) / 2;

              return (
                <g key={kbl.id}>
                  <path
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    stroke={kbl.warna}
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray={mode === "matlab" ? "6 3" : undefined}
                  />
                  <circle cx={x1} cy={y1} r="4.5" fill={kbl.warna} />
                  <circle cx={x2} cy={y2} r="4.5" fill={kbl.warna} />
                </g>
              );
            })}
          </svg>

          {/* Daftar Komponen di Atas Kanvas yang Bisa Digeser (Draggable Nodes) */}
          {nodesSaatIni.map((node) => {
            const aktif = komponenTerpilih?.id === node.id;
            return (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIdKomponenTerpilih(node.id);
                  if (modePasangKabelDariId && modePasangKabelDariId !== node.id) {
                    setDaftarKabel({
                      ...daftarKabel,
                      [mode]: [
                        ...kabelSaatIni,
                        {
                          id: "kbl-" + Date.now(),
                          dariId: modePasangKabelDariId,
                          keId: node.id,
                          warna: "#34d399",
                        },
                      ],
                    });
                    setModePasangKabelDariId(null);
                  } else {
                    setSedangGeserId(node.id);
                  }
                }}
                className={`absolute p-2.5 rounded-2xl cursor-move transition-shadow ${
                  aktif
                    ? "bg-slate-900/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] z-20"
                    : "bg-slate-900/80 border border-slate-700 hover:border-indigo-400 z-10"
                }`}
              >
                <div className="flex justify-between items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-amber-300 truncate max-w-[110px]">
                    {node.label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModePasangKabelDariId(node.id);
                    }}
                    className="px-1.5 py-0.5 rounded bg-indigo-600/40 hover:bg-indigo-600 text-[9px] font-mono font-bold text-indigo-200 cursor-pointer"
                    title="Sambungkan kabel dari komponen ini"
                  >
                    🔌 Pin
                  </button>
                </div>

                <VisualKomponenRealistis
                  tipe={node.tipe}
                  nilaiResistor={node.nilaiResistor}
                  nyala={node.nyala}
                  nilaiSensor={node.nilaiSensor}
                />
              </div>
            );
          })}

          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-400 pointer-events-none">
            <span>
              💡 Tip: Klik &amp; tahan komponen untuk menggeser posisi, atau klik tombol [🔌 Pin]
              untuk menarik kabel.
            </span>
            <span>
              Komponen Aktif: {nodesSaatIni.length} | Kabel: {kabelSaatIni.length}
            </span>
          </div>
        </div>

        {/* PANEL KANAN (4 KOLOM): INSPEKTOR PROPERTI & KALKULATOR GELANG WARNA RESISTOR OTOMATIS */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Inspector &amp; Pengaturan Komponen
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

          {komponenTerpilih ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Nama Label Komponen Terpilih:
                </label>
                <input
                  type="text"
                  value={komponenTerpilih.label}
                  onChange={(e) =>
                    updatePropertiKomponen(komponenTerpilih.id, {
                      label: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                />
              </div>

              {/* JIKA KOMPONEN ADALAH RESISTOR -> TAMPILKAN EDITOR NILAI OHM & GELANG WARNA REAL-TIME */}
              {komponenTerpilih.tipe === "resistor" && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                  <div className="font-black text-amber-300 uppercase text-[11px]">
                    🎨 Kalkulator &amp; Visual Gelang Warna Resistor Otomatis
                  </div>

                  <div className="flex justify-center py-1">
                    <ResistorVisualSvg
                      nilaiOhm={komponenTerpilih.nilaiResistor || 1000}
                      ukuran="besar"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Ubah Nilai Hambatan (Ω):</span>
                      <span className="text-emerald-400 font-mono">
                        {komponenTerpilih.nilaiResistor || 1000} Ω
                      </span>
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
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono font-black text-amber-300"
                    />
                  </div>

                  {/* Preset Cepat Nilai Resistor Standar */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold">
                      Klik Nilai Standar (Amati Perubahan Gelang Warna):
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[220, 330, 470, 1000, 2200, 4700, 10000, 47000, 100000].map(
                        (ohm) => (
                          <button
                            key={ohm}
                            type="button"
                            onClick={() =>
                              updatePropertiKomponen(komponenTerpilih.id, {
                                nilaiResistor: ohm,
                              })
                            }
                            className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border cursor-pointer ${
                              komponenTerpilih.nilaiResistor === ohm
                                ? "bg-amber-400 text-slate-950 border-amber-400"
                                : "bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-400"
                            }`}
                          >
                            {hitungGelangWarnaResistor(ohm).labelSingkat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* JIKA KOMPONEN SENSOR / SERVO / SUMBER TEGANGAN */}
              {komponenTerpilih.tipe !== "resistor" && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>Parameter Nilai / Sensor:</span>
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

                  <button
                    type="button"
                    onClick={() =>
                      updatePropertiKomponen(komponenTerpilih.id, {
                        nyala: !komponenTerpilih.nyala,
                      })
                    }
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black cursor-pointer"
                  >
                    Status Logika / LED: {komponenTerpilih.nyala ? "HIGH (ON)" : "LOW (OFF)"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Klik salah satu komponen di kanvas untuk mengatur nilai Ohm atau sensornya.
            </div>
          )}

          {/* Ringkasan Pengukuran Multimeter Real-Time */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-[10px] font-black uppercase text-indigo-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pengukuran Rangkaian
              Otomatis
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Hambatan (ΣR):</span>
              <b className="text-amber-300">{totalOhmKanvas} Ω</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tegangan Sumber (Vcc):</span>
              <b className="text-emerald-400">{sumberVcc} V</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Arus Mengalir (I):</span>
              <b className="text-sky-300">{arusRangkaianMa.toFixed(2)} mA</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};