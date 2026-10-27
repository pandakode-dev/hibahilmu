"use client";

import React, { useState } from "react";
import {
  Building2,
  PlusCircle,
  Trash2,
  Move,
  Eye,
  EyeOff,
  LayoutTemplate,
} from "lucide-react";

export interface ZonaRuanganFisik {
  id: string;
  namaRuangan: string;
  ikon: string;
  kategori: "Server & NOC" | "Smart Home" | "Greenhouse & Outdoor" | "Industri & Gudang";
  x: number;
  y: number;
  w: number;
  h: number;
  warnaTema: "indigo" | "emerald" | "amber" | "sky" | "rose";
}

export const DAFTAR_RUANGAN_FISIK_AWAL: ZonaRuanganFisik[] = [
  {
    id: "room-a",
    namaRuangan: "Ruang A: Server & NOC Room",
    ikon: "🖥️",
    kategori: "Server & NOC",
    x: 10,
    y: 15,
    w: 365,
    h: 410,
    warnaTema: "indigo",
  },
  {
    id: "room-b",
    namaRuangan: "Ruang B: Smart Home / Ruang Tamu",
    ikon: "🏠",
    kategori: "Smart Home",
    x: 385,
    y: 15,
    w: 365,
    h: 410,
    warnaTema: "emerald",
  },
];

export const PRESET_DENAH_GEDUNG: {
  id: string;
  label: string;
  ruangan: ZonaRuanganFisik[];
}[] = [
  {
    id: "denah-2-ruang",
    label: "🏢 Denah 2 Ruang (Ruang A Server ↔ Ruang B Smart Home)",
    ruangan: DAFTAR_RUANGAN_FISIK_AWAL,
  },
  {
    id: "denah-4-zona",
    label: "🏘️ Denah 4 Zona Lengkap (Server + Rumah + Taman + Pabrik)",
    ruangan: [
      {
        id: "r4-1",
        namaRuangan: "Ruang A: Server & Gateway Room",
        ikon: "🖥️",
        kategori: "Server & NOC",
        x: 10,
        y: 12,
        w: 360,
        h: 215,
        warnaTema: "indigo",
      },
      {
        id: "r4-2",
        namaRuangan: "Ruang B: Smart Home & Door Lock",
        ikon: "🏠",
        kategori: "Smart Home",
        x: 380,
        y: 12,
        w: 360,
        h: 215,
        warnaTema: "emerald",
      },
      {
        id: "r4-3",
        namaRuangan: "Ruang C: Outdoor & Greenhouse",
        ikon: "🌱",
        kategori: "Greenhouse & Outdoor",
        x: 10,
        y: 238,
        w: 360,
        h: 215,
        warnaTema: "amber",
      },
      {
        id: "r4-4",
        namaRuangan: "Ruang D: Gudang & Konveyor Industri",
        ikon: "🏭",
        kategori: "Industri & Gudang",
        x: 380,
        y: 238,
        w: 360,
        h: 215,
        warnaTema: "sky",
      },
    ],
  },
];

// Fungsi mendeteksi di ruangan mana sebuah komponen berada berdasarkan koordinat (x, y)
export function cariRuanganTempatKomponen(
  nodeX: number,
  nodeY: number,
  daftarRuangan: ZonaRuanganFisik[],
  tampilkanRuangan: boolean
): ZonaRuanganFisik | null {
  if (!tampilkanRuangan) return null;
  const centerX = nodeX + 60;
  const centerY = nodeY + 50;
  return (
    daftarRuangan.find(
      (r) =>
        centerX >= r.x &&
        centerX <= r.x + r.w &&
        centerY >= r.y &&
        centerY <= r.y + r.h
    ) || null
  );
}

const GAYA_WARNA_RUANGAN: {
  [key in ZonaRuanganFisik["warnaTema"]]: {
    bg: string;
    border: string;
    headerBg: string;
    text: string;
  };
} = {
  indigo: {
    bg: "bg-indigo-950/20",
    border: "border-indigo-500/45",
    headerBg: "bg-indigo-950/90 text-indigo-200 border-indigo-500/40",
    text: "text-indigo-300",
  },
  emerald: {
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/45",
    headerBg: "bg-emerald-950/90 text-emerald-200 border-emerald-500/40",
    text: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-950/20",
    border: "border-amber-500/45",
    headerBg: "bg-amber-950/90 text-amber-200 border-amber-500/40",
    text: "text-amber-300",
  },
  sky: {
    bg: "bg-sky-950/20",
    border: "border-sky-500/45",
    headerBg: "bg-sky-950/90 text-sky-200 border-sky-500/40",
    text: "text-sky-300",
  },
  rose: {
    bg: "bg-rose-950/20",
    border: "border-rose-500/45",
    headerBg: "bg-rose-950/90 text-rose-200 border-rose-500/40",
    text: "text-rose-300",
  },
};

export const PhysicalRoomsToolbar: React.FC<{
  tampilkanRuangan: boolean;
  setTampilkanRuangan: (v: boolean) => void;
  daftarRuangan: ZonaRuanganFisik[];
  setDaftarRuangan: (r: ZonaRuanganFisik[]) => void;
}> = ({
  tampilkanRuangan,
  setTampilkanRuangan,
  daftarRuangan,
  setDaftarRuangan,
}) => {
  const [namaRuangBaru, setNamaRuangBaru] = useState("");
  const [ikonBaru, setIkonBaru] = useState("🏠");
  const [warnaBaru, setWarnaBaru] =
    useState<ZonaRuanganFisik["warnaTema"]>("sky");

  const tambahRuanganBaru = (e: React.FormEvent) => {
    e.preventDefault();
    const nama =
      namaRuangBaru.trim() ||
      `Ruang ${String.fromCharCode(65 + daftarRuangan.length)}: Lab IoT`;
    const baru: ZonaRuanganFisik = {
      id: "room-" + Date.now(),
      namaRuangan: nama,
      ikon: ikonBaru,
      kategori: "Smart Home",
      x: 30 + (daftarRuangan.length % 2) * 340,
      y: 30 + Math.floor(daftarRuangan.length / 2) * 180,
      w: 320,
      h: 220,
      warnaTema: warnaBaru,
    };
    setDaftarRuangan([...daftarRuangan, baru]);
    setNamaRuangBaru("");
    setTampilkanRuangan(true);
  };

  return (
    <div className="bg-slate-950/95 p-4 rounded-3xl border border-emerald-500/30 space-y-3 text-xs">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span className="font-black uppercase text-emerald-300">
            Physical Packet Tracer Mode — Denah Ruangan &amp; Gedung (
            {daftarRuangan.length} Ruangan Aktif)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_DENAH_GEDUNG.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setDaftarRuangan(preset.ruangan);
                setTampilkanRuangan(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-400 text-[11px] font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <LayoutTemplate className="w-3 h-3 text-amber-300" />
              {preset.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setTampilkanRuangan(!tampilkanRuangan)}
            className={`px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer ${
              tampilkanRuangan
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {tampilkanRuangan ? (
              <>
                <Eye className="w-3.5 h-3.5" /> Denah Ruangan: TAMPIL
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Denah Ruangan: SEMBUNYI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Tambah Ruangan Baru */}
      <form
        onSubmit={tambahRuanganBaru}
        className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900"
      >
        <select
          value={ikonBaru}
          onChange={(e) => setIkonBaru(e.target.value)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
        >
          <option value="🖥️">🖥️ Server Room</option>
          <option value="🏠">🏠 Smart Home</option>
          <option value="🌱">🌱 Greenhouse / Taman</option>
          <option value="🏭">🏭 Gudang / Pabrik</option>
          <option value="🔬">🔬 Lab Riset IoT</option>
          <option value="🚗">🚗 Garasi Pintar</option>
        </select>

        <input
          type="text"
          value={namaRuangBaru}
          onChange={(e) => setNamaRuangBaru(e.target.value)}
          placeholder="Nama Ruangan Baru (Misal: Ruang C: Garasi / Taman)..."
          className="flex-1 min-w-[200px] p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
        />

        <select
          value={warnaBaru}
          onChange={(e) =>
            setWarnaBaru(e.target.value as ZonaRuanganFisik["warnaTema"])
          }
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold"
        >
          <option value="indigo">Tema Biru Indigo</option>
          <option value="emerald">Tema Hijau Emerald</option>
          <option value="amber">Tema Kuning Amber</option>
          <option value="sky">Tema Biru Langit</option>
          <option value="rose">Tema Merah Rose</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" /> + Tambah Ruangan
        </button>
      </form>
    </div>
  );
};

export const PhysicalRoomsCanvasOverlay: React.FC<{
  tampilkanRuangan: boolean;
  daftarRuangan: ZonaRuanganFisik[];
  onMulaiGeserRuangan: (id: string, e: React.MouseEvent) => void;
  onMulaiResizeRuangan: (id: string, e: React.MouseEvent) => void;
  onHapusRuangan: (id: string) => void;
  onUbahNamaRuangan: (id: string, namaBaru: string) => void;
}> = ({
  tampilkanRuangan,
  daftarRuangan,
  onMulaiGeserRuangan,
  onMulaiResizeRuangan,
  onHapusRuangan,
}) => {
  if (!tampilkanRuangan) return null;

  return (
    <>
      {daftarRuangan.map((r) => {
        const gaya = GAYA_WARNA_RUANGAN[r.warnaTema] || GAYA_WARNA_RUANGAN.indigo;
        return (
          <div
            key={r.id}
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: `${r.w}px`,
              height: `${r.h}px`,
            }}
            className={`absolute rounded-3xl border-2 border-dashed ${gaya.bg} ${gaya.border} z-0 flex flex-col justify-between select-none transition-colors`}
          >
            {/* Header Bar Ruangan (Klik & Tahan untuk Menggeser Posisi Ruangan) */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                onMulaiGeserRuangan(r.id, e);
              }}
              className={`px-3.5 py-1.5 rounded-t-3xl border-b ${gaya.headerBg} flex justify-between items-center cursor-move`}
              title="Klik & tahan header ini untuk menggeser posisi ruangan fisik"
            >
              <div className="flex items-center gap-1.5 font-black text-xs truncate">
                <Move className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>{r.ikon}</span>
                <span className="truncate">{r.namaRuangan}</span>
              </div>

              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onHapusRuangan(r.id);
                }}
                className="p-1 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 cursor-pointer"
                title="Hapus Ruangan Ini"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Footer Ruangan + Handle Resize Sudut Kanan Bawah */}
            <div className="px-3 py-1 flex justify-between items-center text-[9.5px] font-mono opacity-75">
              <span className={gaya.text}>
                Taruh MCU / Sensor di dalam zona ini
              </span>
              <span
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onMulaiResizeRuangan(r.id, e);
                }}
                className="cursor-nwse-resize font-black text-amber-300 hover:underline px-1"
                title="Tarik pojok ini untuk memperbesar / memperkecil ukuran ruangan"
              >
                {r.w}×{r.h}px ↘
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};