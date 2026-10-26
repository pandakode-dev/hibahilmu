"use client";

import React, { useState, useRef } from "react";
import {
  Edit3,
  Trash2,
  Sprout,
  Droplets,
  Coins,
  Sparkles,
  Users,
  Download,
} from "lucide-react";
import { AkunPengguna } from "../../types";

interface ImmersiveGardenProps {
  userLogin: AkunPengguna | null;
  poinXP: number;
  materiSelesai: string[];
  tambahXP: (xp: number) => void;
}

export const ImmersiveGardenSection: React.FC<ImmersiveGardenProps> = ({
  userLogin,
  poinXP,
  materiSelesai,
  tambahXP,
}) => {
  // ============================================================================
  // 1. STATE PAPAN TULIS KOLABORATIF (REAL-TIME WHITEBOARD CANVAS STUDY ROOM)
  // ============================================================================
  const whiteboardRef = useRef<HTMLCanvasElement | null>(null);
  const [sedangMenggambar, setSedangMenggambar] = useState(false);
  const [warnaSpidol, setWarnaSpidol] = useState("#4f46e5");
  const [ukuranSpidol, setUkuranSpidol] = useState(3);
  const [catatanPapanTulis, setCatatanPapanTulis] = useState(
    "Rumus Energi Kinetik: Ek = 1/2 * m * v^2 | Subnet Mask /26 = 255.255.255.192 (62 Host)"
  );

  // ============================================================================
  // 2. STATE KOIN WAKAF & KOLEKSI TANAMAN POHON ILMU (VIRTUAL GARDEN)
  // ============================================================================
  const [koinWakaf, setKoinWakaf] = useState<number>(120 + materiSelesai.length * 40);
  const [tetesAirIlmu, setTetesAirIlmu] = useState<number>(5);
  const [levelPohonIlmu, setLevelPohonIlmu] = useState<number>(3);
  const [progresSiram, setProgresSiram] = useState<number>(60);

  const daftarTahapPohon = [
    { level: 1, nama: "Benih Rasa Ingin Tahu", ikon: "🌱", deskripsi: "Awal mula perjalanan menuntut ilmu." },
    { level: 2, nama: "Tunas Ketekunan Belajar", ikon: "🌿", deskripsi: "Tumbuh kuat lewat latihan kuis rutin." },
    { level: 3, nama: "Pohon Rindang Pengetahuan", ikon: "🌳", deskripsi: "Siap memberi keteduhan dan manfaat bagi sesama." },
    { level: 4, nama: "Pohon Emas Wakaf Abadi", ikon: "🌲✨", deskripsi: "Puncak kontribusi ilmu yang terus mengalir pahalanya." },
  ];

  const mulaiCoret = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setSedangMenggambar(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const gerakCoret = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!sedangMenggambar) return;
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = warnaSpidol;
    ctx.lineWidth = ukuranSpidol;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const bersihkanWhiteboard = () => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const unduhGambarWhiteboard = () => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "Whiteboard_StudyRoom_HibahIlmu.png";
    a.click();
  };

  const handleSiramPohonIlmu = () => {
    if (tetesAirIlmu <= 0) {
      alert("Tetes Air Ilmu habis! Tukarkan Koin Wakaf Anda untuk menambah Tetes Air.");
      return;
    }
    setTetesAirIlmu((prev) => prev - 1);
    const baru = progresSiram + 40;
    if (baru >= 100) {
      setLevelPohonIlmu((prev) => Math.min(4, prev + 1));
      setProgresSiram(20);
      tambahXP(50);
      alert("🌳 Selamat! Pohon Ilmu Anda naik level dan memberikan bonus +50 XP!");
    } else {
      setProgresSiram(baru);
      tambahXP(15);
    }
  };

  const infoPohonSaatIni =
    daftarTahapPohon.find((p) => p.level === levelPohonIlmu) || daftarTahapPohon[2];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1. VIRTUAL STUDY ROOM DENGAN PAPAN TULIS KOLABORATIF (WHITEBOARD CANVAS) */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                Collaborative Study Room Whiteboard
              </span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" /> Papan Tulis Digital Bersama
                (Real-time Canvas)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Users className="w-4 h-4" /> Aktif Bersama Study Room
            </span>
          </div>

          {/* Toolbar Spidol Warna & Ketebalan */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-600">Warna Spidol:</span>
              {[
                { label: "Biru", hex: "#4f46e5" },
                { label: "Hijau", hex: "#059669" },
                { label: "Merah", hex: "#e11d48" },
                { label: "Hitam", hex: "#0f172a" },
              ].map((w) => (
                <button
                  key={w.hex}
                  type="button"
                  onClick={() => setWarnaSpidol(w.hex)}
                  style={{ backgroundColor: w.hex }}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    warnaSpidol === w.hex ? "ring-2 ring-offset-2 ring-indigo-600" : ""
                  }`}
                  title={w.label}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ukuranSpidol}
                onChange={(e) => setUkuranSpidol(Number(e.target.value))}
                className="p-1.5 border rounded-lg bg-white font-bold"
              >
                <option value={2}>Tipis (2px)</option>
                <option value={4}>Sedang (4px)</option>
                <option value={7}>Tebal (7px)</option>
              </select>

              <button
                type="button"
                onClick={unduhGambarWhiteboard}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Simpan PNG
              </button>

              <button
                type="button"
                onClick={bersihkanWhiteboard}
                className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-black flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Papan
              </button>
            </div>
          </div>

          {/* Kanvas Papan Tulis */}
          <div className="border-2 border-dashed border-indigo-200 rounded-2xl overflow-hidden bg-slate-50">
            <canvas
              ref={whiteboardRef}
              width={640}
              height={300}
              onMouseDown={mulaiCoret}
              onMouseMove={gerakCoret}
              onMouseUp={() => setSedangMenggambar(false)}
              onMouseLeave={() => setSedangMenggambar(false)}
              className="w-full h-72 bg-white cursor-crosshair"
            />
          </div>

          <input
            type="text"
            value={catatanPapanTulis}
            onChange={(e) => setCatatanPapanTulis(e.target.value)}
            placeholder="Catatan rumus bersama di bawah papan tulis..."
            className="w-full p-3 border rounded-xl bg-slate-50 text-xs font-bold text-indigo-950"
          />
        </div>

        {/* 2. SISTEM KOIN WAKAF & KEBUN POHON ILMU VIRTUAL (VIRTUAL KNOWLEDGE GARDEN) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5" /> Virtual Knowledge Garden
              </span>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-xl flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {koinWakaf} Koin Wakaf
                </span>
                <span className="bg-sky-400/20 border border-sky-400/40 text-sky-300 px-3 py-1 rounded-xl flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> {tetesAirIlmu} Air
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-black pt-1">
              Kebun &ldquo;Pohon Ilmu&rdquo; {userLogin?.nama || "Pelajar"}
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Setiap modul yang Anda selesaikan menghasilkan Koin Wakaf &amp; Tetes Air untuk
              merawat Pohon Ilmu hingga berbuah manfaat!
            </p>
          </div>

          {/* Visualisasi Pohon Ilmu */}
          <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md text-center space-y-3">
            <div className="text-6xl py-2">{infoPohonSaatIni.ikon}</div>
            <div className="text-xs font-black uppercase text-amber-300">
              Level {infoPohonSaatIni.level} / 4
            </div>
            <h4 className="text-xl font-black">{infoPohonSaatIni.nama}</h4>
            <p className="text-xs text-emerald-100">{infoPohonSaatIni.deskripsi}</p>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-emerald-200">
                <span>Pertumbuhan Menuju Level Berikutnya:</span>
                <span>{progresSiram}%</span>
              </div>
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progresSiram}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <button
              type="button"
              onClick={handleSiramPohonIlmu}
              className="py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Droplets className="w-4 h-4" /> Siram Pohon (-1 Air, +15 XP)
            </button>

            <button
              type="button"
              onClick={() => {
                if (koinWakaf < 30) {
                  alert("Koin Wakaf belum cukup (Butuh 30 Koin). Selesaikan kuis/modul untuk menambah koin!");
                  return;
                }
                setKoinWakaf((prev) => prev - 30);
                setTetesAirIlmu((prev) => prev + 3);
              }}
              className="py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Tukar 30 Koin → +3 Air
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};