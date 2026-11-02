"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Copy,
  Trash2,
  CloudUpload,
  FolderOpen,
  Plus,
  Power,
  Cpu,
} from "lucide-react";
import { AkunPengguna } from "../../types";
import {
  KATALOG_KOMPONEN_PCB,
  KomponenKatalogItem,
  RenderVisualDanAnimasiKomponen,
} from "./PcbNodeAnimationsAndCatalog";

interface Props {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

interface PcbRoom {
  id: string;
  nama: string;
  tema: "indigo" | "emerald";
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PcbNode {
  id: string;
  tipe: string;
  nama: string;
  roomId: string;
  x: number;
  y: number;
  nilai: number;
  minVal: number;
  maxVal: number;
  satuan: string;
  aktifHigh: boolean;
}

interface PcbWire {
  id: string;
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
  warna: string;
}

const PILIHAN_WARNA_KABEL = [
  { label: "Merah", hex: "#ef4444" },
  { label: "Hitam/Abu", hex: "#64748b" },
  { label: "Biru", hex: "#38bdf8" },
  { label: "Hijau", hex: "#10b981" },
  { label: "Kuning", hex: "#facc15" },
  { label: "Ungu", hex: "#a855f7" },
  { label: "Oranye", hex: "#f97316" },
];

export function SimulatorPemrogramanView({ userLogin, tambahXP }: Props) {
  const [sedangRun, setSedangRun] = useState<boolean>(true);
  const [warnaKabelAktif, setWarnaKabelAktif] = useState<string>("#10b981");
  const [namaProject, setNamaProject] = useState<string>(
    "Smart NOC & Water Quality Monitoring"
  );
  const [projectIdAktif, setProjectIdAktif] = useState<string>("prj-default-1");
  const [daftarProjectCloud, setDaftarProjectCloud] = useState<any[]>([]);
  const [bukaModalCloud, setBukaModalCloud] = useState<boolean>(false);
  const [statusSimpanCloud, setStatusSimpanCloud] = useState<string>("");

  // State Ruangan Fisik (Ruang A & Ruang B seperti di screenshot)
  const [rooms, setRooms] = useState<PcbRoom[]>([
    {
      id: "room-a",
      nama: "Ruang A: Server & NOC Room",
      tema: "indigo",
      x: 16,
      y: 16,
      width: 390,
      height: 430,
    },
    {
      id: "room-b",
      nama: "Ruang B: Smart Home & Lab Air",
      tema: "emerald",
      x: 424,
      y: 16,
      width: 390,
      height: 430,
    },
  ]);

  // State Komponen di atas Kanvas PCB
  const [nodes, setNodes] = useState<PcbNode[]>([
    {
      id: "mcu-1",
      tipe: "ESP32_DEVKIT",
      nama: "ESP32 #1 (Sensor Node)",
      roomId: "room-a",
      x: 34,
      y: 62,
      nilai: 240,
      minVal: 80,
      maxVal: 240,
      satuan: "MHz",
      aktifHigh: true,
    },
    {
      id: "sens-sonar",
      tipe: "ULTRASONIK_HCSR04",
      nama: "Ultrasonik HC-SR04",
      roomId: "room-a",
      x: 215,
      y: 68,
      nilai: 28,
      minVal: 2,
      maxVal: 400,
      satuan: "cm",
      aktifHigh: true,
    },
    {
      id: "sens-pir",
      tipe: "PIR_HCSR501",
      nama: "Sensor Gerak PIR",
      roomId: "room-a",
      x: 215,
      y: 225,
      nilai: 45,
      minVal: 0,
      maxVal: 300,
      satuan: "cm",
      aktifHigh: true,
    },
    {
      id: "mcu-2",
      tipe: "ESP32_DEVKIT",
      nama: "ESP32 #2 (Blynk Gateway)",
      roomId: "room-b",
      x: 442,
      y: 62,
      nilai: 240,
      minVal: 80,
      maxVal: 240,
      satuan: "MHz",
      aktifHigh: true,
    },
    {
      id: "akt-solenoid",
      tipe: "SOLENOID_LOCK",
      nama: "Solenoid Gerbang",
      roomId: "room-b",
      x: 635,
      y: 68,
      nilai: 1,
      minVal: 0,
      maxVal: 1,
      satuan: "Lock",
      aktifHigh: true,
    },
    {
      id: "akt-relay",
      tipe: "RELAY_1CH",
      nama: "Relay Aktuator",
      roomId: "room-b",
      x: 635,
      y: 225,
      nilai: 1,
      minVal: 0,
      maxVal: 1,
      satuan: "State",
      aktifHigh: true,
    },
  ]);

  const [wires, setWires] = useState<PcbWire[]>([
    {
      id: "w-1",
      fromNodeId: "mcu-1",
      fromPinId: "23",
      toNodeId: "sens-sonar",
      toPinId: "TRIG",
      warna: "#10b981",
    },
    {
      id: "w-2",
      fromNodeId: "mcu-1",
      fromPinId: "22",
      toNodeId: "sens-pir",
      toPinId: "OUT",
      warna: "#38bdf8",
    },
    {
      id: "w-3",
      fromNodeId: "mcu-2",
      fromPinId: "23",
      toNodeId: "akt-relay",
      toPinId: "IN",
      warna: "#facc15",
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>("sens-sonar");
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pinAwalKabel, setPinAwalKabel] = useState<{
    nodeId: string;
    pinId: string;
  } | null>(null);

  const selectedNode =
    nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  const katalogSelected = KATALOG_KOMPONEN_PCB.find(
    (k) => k.tipe === selectedNode?.tipe
  );

  // =========================================================================
  // MUAT PROJECT DARI SERVER CLOUD AGAR BISA DIBUKA DI PC MANA SAJA
  // =========================================================================
  const muatDaftarProjectDariServer = async () => {
    try {
      const emailParam = userLogin?.email || "public";
      const res = await fetch(
        `/api/iot/projects?email=${encodeURIComponent(emailParam)}`
      );
      const json = await res.json();
      if (json.ok && Array.isArray(json.projects)) {
        setDaftarProjectCloud(json.projects);
        // Jika ada project tersimpan milik user ini, otomatis muat yang terbaru
        if (json.projects.length > 0 && projectIdAktif === "prj-default-1") {
          const terbaru = json.projects[0];
          if (Array.isArray(terbaru.nodes) && terbaru.nodes.length > 0) {
            setProjectIdAktif(terbaru.id);
            setNamaProject(terbaru.namaProject);
            setNodes(terbaru.nodes);
            if (Array.isArray(terbaru.rooms) && terbaru.rooms.length > 0) {
              setRooms(terbaru.rooms);
            }
            if (Array.isArray(terbaru.wires)) {
              setWires(terbaru.wires);
            }
          }
        }
      }
    } catch {
      // Fallback localStorage jika sedang offline
    }
  };

  useEffect(() => {
    muatDaftarProjectDariServer();
  }, [userLogin]);

  const simpanProjectKeCloudServer = async () => {
    setStatusSimpanCloud("Menyimpan ke Cloud...");
    try {
      const payload = {
        action: "save",
        id:
          projectIdAktif === "prj-default-1"
            ? `prj-${userLogin?.id || "guest"}-${Date.now()}`
            : projectIdAktif,
        ownerEmail: userLogin?.email || "public",
        ownerName: userLogin?.nama || "Maker HibahIlmu",
        namaProject,
        rooms,
        nodes,
        wires,
      };

      // Simpan cadangan di localStorage
      localStorage.setItem("hibahilmu_last_pcb_project", JSON.stringify(payload));

      // Simpan permanen ke Server Cloud agar dibuka di PC lain tetap ada!
      const res = await fetch("/api/iot/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        setProjectIdAktif(json.project.id);
        setDaftarProjectCloud(json.projects || []);
        setStatusSimpanCloud("Tersimpan di Cloud Server!");
        tambahXP(25);
        setTimeout(() => setStatusSimpanCloud(""), 3500);
      }
    } catch {
      setStatusSimpanCloud("Tersimpan di Lokal Browser");
    }
  };

  // Tambah Komponen dari Katalog Atas ke Kanvas
  const tambahKomponenKeKanvas = (item: KomponenKatalogItem) => {
    const idBaru = `node-${Date.now()}`;
    const nodeBaru: PcbNode = {
      id: idBaru,
      tipe: item.tipe,
      nama: item.nama,
      roomId: selectedNode?.roomId || "room-a",
      x: 195 + (nodes.length % 3) * 35,
      y: 120 + (nodes.length % 4) * 35,
      nilai: item.defaultVal,
      minVal: item.minVal,
      maxVal: item.maxVal,
      satuan: item.satuan,
      aktifHigh: true,
    };
    setNodes((prev) => [...prev, nodeBaru]);
    setSelectedNodeId(idBaru);
  };

  const duplikatKomponenTerpilih = () => {
    if (!selectedNode) return;
    const idBaru = `node-${Date.now()}`;
    const salinan: PcbNode = {
      ...selectedNode,
      id: idBaru,
      nama: `${selectedNode.nama} (Copy)`,
      x: selectedNode.x + 30,
      y: selectedNode.y + 30,
    };
    setNodes((prev) => [...prev, salinan]);
    setSelectedNodeId(idBaru);
  };

  const hapusKomponenTerpilih = () => {
    if (!selectedNode) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id));
    setWires((prev) =>
      prev.filter(
        (w) => w.fromNodeId !== selectedNode.id && w.toNodeId !== selectedNode.id
      )
    );
  };

  return (
    <div className="space-y-4 select-none">
      {/* =================================================================== */}
      {/* 1. BARIS SIMPAN & BUKA PROJECT LINTAS PC / PERANGKAT (CLOUD SYNC)    */}
      {/* =================================================================== */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-3.5 flex flex-wrap justify-between items-center gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={namaProject}
              onChange={(e) => setNamaProject(e.target.value)}
              className="bg-transparent font-black text-sm sm:text-base text-white border-b border-transparent focus:border-emerald-500 focus:outline-none"
            />
            <div className="text-[11px] text-slate-400">
              Akun Cloud:{" "}
              <strong className="text-emerald-400">
                {userLogin ? `${userLogin.nama} (${userLogin.email})` : "Mode Tamu (Login agar tersinkron ke PC lain)"}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusSimpanCloud && (
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700">
              ✓ {statusSimpanCloud}
            </span>
          )}
          <button
            type="button"
            onClick={simpanProjectKeCloudServer}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <CloudUpload className="w-4 h-4" /> Simpan Project ke Cloud
          </button>
          <button
            type="button"
            onClick={() => {
              muatDaftarProjectDariServer();
              setBukaModalCloud(!bukaModalCloud);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FolderOpen className="w-4 h-4" /> Buka Project ({daftarProjectCloud.length})
          </button>
        </div>
      </div>

      {/* MODAL DAFTAR PROJECT TERSIMPAN DI CLOUD SERVER */}
      {bukaModalCloud && (
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-2xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-indigo-300">
              Daftar Project Tersimpan di Server Cloud (Bisa Dibuka di PC Mana Saja)
            </span>
            <button
              type="button"
              onClick={() => setBukaModalCloud(false)}
              className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Tutup ✕
            </button>
          </div>
          {daftarProjectCloud.length === 0 ? (
            <div className="text-xs text-slate-400 py-2">
              Belum ada project di Cloud. Klik tombol &ldquo;Simpan Project ke Cloud&rdquo; untuk menyimpan rangkaian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {daftarProjectCloud.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setProjectIdAktif(p.id);
                    setNamaProject(p.namaProject);
                    if (Array.isArray(p.rooms)) setRooms(p.rooms);
                    if (Array.isArray(p.nodes)) setNodes(p.nodes);
                    if (Array.isArray(p.wires)) setWires(p.wires);
                    setBukaModalCloud(false);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-pointer transition space-y-1"
                >
                  <div className="font-black text-xs text-emerald-400">
                    {p.namaProject}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Oleh: {p.ownerName} • {p.nodes?.length || 0} Komponen
                  </div>
                  <div className="text-[9px] text-slate-500">{p.updatedAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. BARIS KATALOG KOMPONEN (TERMASUK TDS, pH, HEART, DO, BOD, COD, O3) */}
      {/* =================================================================== */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-4">
        <div className="text-[11px] font-black text-slate-400 uppercase mb-2.5 flex justify-between items-center">
          <span>
            Klik Komponen Sensor / Aktuator untuk Menambahkan ke Kanvas (Lengkap dengan Animasi Interaktif):
          </span>
          <span className="text-emerald-400">
            {KATALOG_KOMPONEN_PCB.length} Komponen Tersedia → Geser ke Kanan
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {KATALOG_KOMPONEN_PCB.map((item) => (
            <div
              key={item.tipe}
              onClick={() => tambahKomponenKeKanvas(item)}
              className="shrink-0 w-36 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-2xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.kategori}
                </span>
                <span className="text-[9px] font-black text-amber-400">
                  {item.badgePin}
                </span>
              </div>

              <div className="flex justify-center py-1 pointer-events-none scale-90">
                <RenderVisualDanAnimasiKomponen
                  tipe={item.tipe}
                  nilai={item.defaultVal}
                  aktifHigh={true}
                  sedangRun={false}
                />
              </div>

              <div className="text-[11px] font-black text-slate-200 group-hover:text-emerald-400 truncate text-center">
                + {item.nama}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. TOOLBAR COMPILE & RUN, DUPLIKAT, DAN PILIHAN WARNA KABEL          */}
      {/* =================================================================== */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSedangRun(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
              sedangRun
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                : "bg-emerald-950 text-emerald-300 border border-emerald-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              Compile &amp; Run Semua (
              {nodes.filter((n) => n.tipe === "ESP32_DEVKIT").length} MCU)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSedangRun(false)}
            className="px-4 py-2.5 rounded-2xl text-xs font-black bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" /> Stop Semua
          </button>

          {selectedNode && (
            <button
              type="button"
              onClick={duplikatKomponenTerpilih}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Copy className="w-3.5 h-3.5" /> Duplikat &ldquo;{selectedNode.nama}&rdquo;
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">Warna Kabel:</span>
          {PILIHAN_WARNA_KABEL.map((w) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWarnaKabelAktif(w.hex)}
              className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 cursor-pointer border transition ${
                warnaKabelAktif === w.hex
                  ? "bg-white text-slate-950 border-white"
                  : "bg-slate-900 text-slate-300 border-slate-800"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: w.hex }}
              />
              <span>{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. AREA UTAMA: KANVAS PCB KIRI + PANEL INSPECTOR KANAN              */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* KANVAS PCB INTERAKTIF (8 KOLOM) */}
        <div
          onMouseMove={(e) => {
            if (!draggingNodeId) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const nx = Math.max(10, e.clientX - rect.left - dragOffset.x);
            const ny = Math.max(10, e.clientY - rect.top - dragOffset.y);
            setNodes((prev) =>
              prev.map((n) =>
                n.id === draggingNodeId
                  ? {
                      ...n,
                      x: nx,
                      y: ny,
                      roomId: nx > 410 ? "room-b" : "room-a",
                    }
                  : n
              )
            );
          }}
          onMouseUp={() => setDraggingNodeId(null)}
          className="lg:col-span-8 relative h-[520px] bg-[#070B14] border-2 border-slate-800 rounded-3xl overflow-auto shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(#1e293b 1.25px, transparent 1.25px)",
            backgroundSize: "18px 18px",
          }}
        >
          {/* ZONA RUANGAN FISIK (Ruang A & Ruang B) */}
          {rooms.map((rm) => (
            <div
              key={rm.id}
              style={{
                left: rm.x,
                top: rm.y,
                width: rm.width,
                height: rm.height,
              }}
              className={`absolute rounded-3xl border-2 border-dashed p-3 pointer-events-none ${
                rm.tema === "indigo"
                  ? "border-indigo-500/40 bg-indigo-950/10"
                  : "border-emerald-500/40 bg-emerald-950/10"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl ${
                    rm.tema === "indigo"
                      ? "bg-indigo-950/90 text-indigo-300 border border-indigo-700/50"
                      : "bg-emerald-950/90 text-emerald-300 border border-emerald-700/50"
                  }`}
                >
                  {rm.nama}
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-bold text-slate-500">
                <span>Taruh MCU / Sensor di dalam zona ini</span>
                <span className="text-amber-400">
                  {rm.width}×{rm.height}px
                </span>
              </div>
            </div>
          ))}

          {/* GARIS KABEL ANTAR KOMPONEN */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {wires.map((w) => {
              const fromNode = nodes.find((n) => n.id === w.fromNodeId);
              const toNode = nodes.find((n) => n.id === w.toNodeId);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + 115;
              const y1 = fromNode.y + 85;
              const x2 = toNode.x + 45;
              const y2 = toNode.y + 85;
              const midX = (x1 + x2) / 2;
              return (
                <path
                  key={w.id}
                  d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
                  fill="none"
                  stroke={w.warna}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* RENDER SEMUA NODE KOMPONEN & ANIMASI INTERAKTIFNYA */}
          {nodes.map((nd) => {
            const dipilih = nd.id === selectedNodeId;
            const infoKat = KATALOG_KOMPONEN_PCB.find((k) => k.tipe === nd.tipe);

            return (
              <div
                key={nd.id}
                style={{ left: nd.x, top: nd.y }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(nd.id);
                  const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                  if (rect) {
                    setDraggingNodeId(nd.id);
                    setDragOffset({
                      x: e.clientX - rect.left - nd.x,
                      y: e.clientY - rect.top - nd.y,
                    });
                  }
                }}
                className={`absolute z-20 rounded-2xl border-2 transition-shadow cursor-grab active:cursor-grabbing ${
                  dipilih
                    ? "border-emerald-400 shadow-xl shadow-emerald-500/20"
                    : "border-slate-700/90"
                } bg-[#0F172A]/95 p-2.5`}
              >
                {/* Header Nama Node & Badge WIRED / RUN */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black text-amber-300 truncate max-w-[120px]">
                    {nd.nama}
                  </span>
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      sedangRun && nd.aktifHigh
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {sedangRun && nd.aktifHigh ? "● RUN / WIRED" : "STANDBY"}
                  </span>
                </div>

                {/* JIKA ESP32 30-PIN: TAMPILKAN BOARD LENGKAP */}
                {nd.tipe === "ESP32_DEVKIT" ? (
                  <div className="w-36 bg-slate-900 border border-slate-700 rounded-xl p-2 text-center space-y-1.5">
                    <div className="w-20 h-14 mx-auto bg-slate-200 text-slate-900 rounded-md flex flex-col items-center justify-center p-1">
                      <div className="text-[8px] font-black">ESP-WROOM-32</div>
                      <div className="text-[6px] font-bold text-slate-600">
                        30-PIN DEVKIT V1
                      </div>
                      <div className="text-[6px] font-black px-1.5 py-0.5 bg-sky-200 text-sky-900 rounded mt-0.5">
                        WI-FI + DUAL UART
                      </div>
                    </div>
                    <div className="text-[8px] font-mono text-emerald-400">
                      CP2102 • {nd.nilai} MHz
                    </div>
                  </div>
                ) : (
                  /* JIKA SENSOR / AKTUATOR: TAMPILKAN KOMPONEN + ANIMASI FISIKNYA */
                  <RenderVisualDanAnimasiKomponen
                    tipe={nd.tipe}
                    nilai={nd.nilai}
                    aktifHigh={nd.aktifHigh}
                    sedangRun={sedangRun}
                  />
                )}

                {/* Baris Titik Pin di Bawah Komponen (Klik untuk Tarik Kabel) */}
                {infoKat && (
                  <div className="flex justify-around items-center gap-1 mt-2 pt-1 border-t border-slate-800">
                    {infoKat.pins.slice(0, 6).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!pinAwalKabel) {
                            setPinAwalKabel({ nodeId: nd.id, pinId: p.id });
                          } else if (pinAwalKabel.nodeId !== nd.id) {
                            setWires((prev) => [
                              ...prev,
                              {
                                id: `wire-${Date.now()}`,
                                fromNodeId: pinAwalKabel.nodeId,
                                fromPinId: pinAwalKabel.pinId,
                                toNodeId: nd.id,
                                toPinId: p.id,
                                warna: warnaKabelAktif,
                              },
                            ]);
                            setPinAwalKabel(null);
                          }
                        }}
                        title={`${p.label}: ${p.fungsi}`}
                        className="px-1 py-0.5 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-[7px] font-black text-slate-300 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PANEL KANAN: INSPECTOR & PARAMETER BLOK / KOMPONEN (4 KOLOM) */}
        <div className="lg:col-span-4 bg-[#0B1120] border-2 border-slate-800 rounded-3xl p-5 text-white space-y-5 shadow-2xl">
          {selectedNode ? (
            <>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  🎛️ INSPECTOR &amp; LOKASI RUANGAN
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={duplikatKomponenTerpilih}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Duplikat
                  </button>
                  <button
                    type="button"
                    onClick={hapusKomponenTerpilih}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-800 text-rose-300 border border-rose-800 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>

              {/* Lokasi Fisik Ruangan */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/40 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Lokasi Fisik:</span>
                <span className="font-black text-indigo-300">
                  {rooms.find((r) => r.id === selectedNode.roomId)?.nama ||
                    "Ruang A: Server & NOC Room"}
                </span>
              </div>

              {/* Nama Komponen Terpilih */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">
                  Nama Komponen Terpilih:
                </label>
                <input
                  type="text"
                  value={selectedNode.nama}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id ? { ...n, nama: val } : n
                      )
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-black text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* SLIDER PARAMETER BLOK / KOMPONEN (PENGGERAK ANIMASI SENSOR) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
                <div className="text-[11px] font-black text-emerald-400 uppercase">
                  ⚙️ PARAMETER BLOK / KOMPONEN (ANIMASI LIVE)
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">
                    Min: {selectedNode.minVal} {selectedNode.satuan}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-black text-sm">
                    {selectedNode.nilai} {selectedNode.satuan}
                  </span>
                  <span className="text-slate-400 font-bold">
                    Max: {selectedNode.maxVal} {selectedNode.satuan}
                  </span>
                </div>

                <input
                  type="range"
                  min={selectedNode.minVal}
                  max={selectedNode.maxVal}
                  step={selectedNode.tipe === "SENSOR_PH_AIR" ? 0.5 : 1}
                  value={selectedNode.nilai}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id ? { ...n, nilai: val } : n
                      )
                    );
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />

                <p className="text-[11px] text-slate-400">
                  Geser slider di atas untuk melihat perubahan animasi fisik langsung pada komponen{" "}
                  <strong className="text-white">{selectedNode.nama}</strong> di kanvas.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, aktifHigh: !n.aktifHigh }
                          : n
                      )
                    )
                  }
                  className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                    selectedNode.aktifHigh
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>
                    STATUS: {selectedNode.aktifHigh ? "ON / HIGH (AKTIF)" : "OFF / LOW"}
                  </span>
                </button>
              </div>

              {/* DAFTAR & KETERANGAN PIN */}
              {katalogSelected && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 max-h-52 overflow-y-auto">
                  <div className="text-[11px] font-black text-sky-400 uppercase">
                    ℹ️ DAFTAR &amp; KETERANGAN PIN ({katalogSelected.pins.length} TITIK)
                  </div>
                  {katalogSelected.pins.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-black text-amber-400">
                          #{idx + 1} {p.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{p.fungsi}</div>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {p.sisi}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-400">
              Klik salah satu komponen di kanvas untuk mengatur parameter dan melihat animasinya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}