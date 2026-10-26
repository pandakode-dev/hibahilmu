"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Sprout,
  Droplets,
  Coins,
  Sparkles,
  Users,
  Download,
  Eraser,
  Grid,
  Sun,
  Award,
  PlusCircle,
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
  const [modeAlatGambar, setModeAlatGambar] = useState<"spidol" | "stabilo" | "penghapus">(
    "spidol"
  );
  const [warnaSpidol, setWarnaSpidol] = useState("#4f46e5");
  const [ukuranSpidol, setUkuranSpidol] = useState(3);
  const [tampilkanGrid, setTampilkanGrid] = useState(true);
  const [teksLabelCanvas, setTeksLabelCanvas] = useState("");
  const [daftarStickyNotes, setDaftarStickyNotes] = useState([
    {
      id: "st-1",
      penulis: "Aisyah Putri",
      isi: "Rumus Energi Kinetik: Ek = ½ · m · v² | Gaya Normal N = m · g · cos(θ)",
      warna: "bg-amber-100 border-amber-300 text-amber-950",
    },
    {
      id: "st-2",
      penulis: "Dimas Anggara",
      isi: "Subnetting /26 → 255.255.255.192 (4 Subnet, 62 Host Valid per Subnet)",
      warna: "bg-indigo-100 border-indigo-300 text-indigo-950",
    },
  ]);

  // ============================================================================
  // 2. STATE KOIN WAKAF & KEBUN POHON ILMU VIRTUAL (VIRTUAL KNOWLEDGE GARDEN)
  // ============================================================================
  const [koinWakaf, setKoinWakaf] = useState<number>(150 + materiSelesai.length * 40);
  const [tetesAirIlmu, setTetesAirIlmu] = useState<number>(6);
  const [pupukCahaya, setPupukCahaya] = useState<number>(2);
  const [levelPohonIlmu, setLevelPohonIlmu] = useState<number>(3);
  const [progresSiram, setProgresSiram] = useState<number>(65);
  const [koleksiTanaman, setKoleksiTanaman] = useState([
    { id: "tn-1", nama: "Pohon Jati Mekanika Fisika", ikon: "🌳", status: "Berbuah XP" },
    { id: "tn-2", nama: "Bonsai Jaringan Cisco & OSI", ikon: "🪴", status: "Tumbuh Subur" },
    { id: "tn-3", nama: "Bunga Lotus AI & Big Data", ikon: "🪷", status: "Mekar Penuh" },
  ]);
  const [logKebun, setLogKebun] = useState<string[]>([
    "🌱 Pohon Ilmu menerima +40 Koin Wakaf dari penyelesaian modul.",
    "💧 Disiram oleh " + (userLogin?.nama || "Pelajar") + " (+15 XP).",
  ]);

  const daftarTahapPohon = [
    {
      level: 1,
      nama: "Benih Rasa Ingin Tahu",
      ikon: "🌱",
      deskripsi: "Awal mula perjalanan menuntut ilmu pengetahuan.",
    },
    {
      level: 2,
      nama: "Tunas Ketekunan Belajar",
      ikon: "🌿",
      deskripsi: "Tumbuh kokoh melalui latihan kuis dan catatan rutin.",
    },
    {
      level: 3,
      nama: "Pohon Rindang Pengetahuan",
      ikon: "🌳",
      deskripsi: "Siap memberi keteduhan dan manfaat bagi sesama pelajar.",
    },
    {
      level: 4,
      nama: "Pohon Emas Wakaf Abadi",
      ikon: "🌲✨",
      deskripsi: "Puncak kontribusi ilmu yang terus mengalirkan pahala kebaikan.",
    },
  ];

  // Gambar teks rumus contoh saat pertama kali kanvas dimuat
  useEffect(() => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("📐 Papan Tulis Bersama Study Room — Coret Rumus / Topologi di Sini!", 20, 32);
  }, []);

  const mulaiCoret = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setSedangMenggambar(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const gerakCoret = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!sedangMenggambar) return;
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    if (modeAlatGambar === "penghapus") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 22;
      ctx.globalAlpha = 1.0;
    } else if (modeAlatGambar === "stabilo") {
      ctx.strokeStyle = warnaSpidol;
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.25;
    } else {
      ctx.strokeStyle = warnaSpidol;
      ctx.lineWidth = ukuranSpidol;
      ctx.globalAlpha = 1.0;
    }
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const tambahTeksKeCanvas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksLabelCanvas.trim()) return;
    const canvas = whiteboardRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.globalAlpha = 1.0;
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = warnaSpidol;
      const yPos = 70 + Math.floor(Math.random() * 180);
      ctx.fillText(teksLabelCanvas, 30, yPos);
    }
    setDaftarStickyNotes([
      {
        id: "st-" + Date.now(),
        penulis: userLogin?.nama || "Anggota Study Room",
        isi: teksLabelCanvas,
        warna: "bg-emerald-100 border-emerald-300 text-emerald-950",
      },
      ...daftarStickyNotes,
    ]);
    setTeksLabelCanvas("");
    tambahXP(15);
  };

  const bersihkanWhiteboard = () => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.globalAlpha = 1.0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
    const tambahan = 35;
    const baru = progresSiram + tambahan;
    if (baru >= 100) {
      setLevelPohonIlmu((prev) => Math.min(4, prev + 1));
      setProgresSiram(20);
      tambahXP(60);
      setLogKebun((prev) => [
        `🎉 Pohon Ilmu naik level! Bonus +60 XP berhasil dipanen.`,
        ...prev,
      ]);
    } else {
      setProgresSiram(baru);
      tambahXP(15);
      setLogKebun((prev) => [
        `💧 Menyiram Pohon Ilmu (+${tambahan}% pertumbuhan & +15 XP).`,
        ...prev,
      ]);
    }
  };

  const handleBeriPupukCahaya = () => {
    if (pupukCahaya <= 0) {
      alert("Pupuk Cahaya habis! Anda dapat menukarkan 40 Koin Wakaf untuk membeli bibit/pupuk.");
      return;
    }
    setPupukCahaya((prev) => prev - 1);
    setLevelPohonIlmu((prev) => Math.min(4, prev + 1));
    setProgresSiram(50);
    tambahXP(50);
    setLogKebun((prev) => [
      `☀️ Pupuk Cahaya digunakan! Pohon tumbuh pesat (+50 XP).`,
      ...prev,
    ]);
  };

  const infoPohonSaatIni =
    daftarTahapPohon.find((p) => p.level === levelPohonIlmu) || daftarTahapPohon[2];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================================
            1. VIRTUAL STUDY ROOM DENGAN PAPAN TULIS KOLABORATIF (7 KOLOM)
           ====================================================================== */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-7 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                Real-Time Collaborative Canvas
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-indigo-600" /> Papan Tulis Digital Study Room
                (Whiteboard)
              </h3>
            </div>
            <span className="text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 4 Siswa Tersambung di Kanvas
            </span>
          </div>

          {/* Toolbar Alat Gambar, Warna & Grid */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "spidol", label: "✏️ Spidol" },
                { id: "stabilo", label: "🖍️ Stabilo" },
                { id: "penghapus", label: "🧽 Penghapus" },
              ].map((alat) => (
                <button
                  key={alat.id}
                  type="button"
                  onClick={() =>
                    setModeAlatGambar(alat.id as "spidol" | "stabilo" | "penghapus")
                  }
                  className={`px-3 py-1.5 rounded-xl font-black cursor-pointer ${
                    modeAlatGambar === alat.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-slate-700"
                  }`}
                >
                  {alat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {[
                { label: "Indigo", hex: "#4f46e5" },
                { label: "Emerald", hex: "#059669" },
                { label: "Rose", hex: "#e11d48" },
                { label: "Amber", hex: "#d97706" },
                { label: "Slate", hex: "#0f172a" },
              ].map((w) => (
                <button
                  key={w.hex}
                  type="button"
                  onClick={() => {
                    setWarnaSpidol(w.hex);
                    if (modeAlatGambar === "penghapus") setModeAlatGambar("spidol");
                  }}
                  style={{ backgroundColor: w.hex }}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    warnaSpidol === w.hex ? "ring-2 ring-offset-2 ring-indigo-600" : ""
                  }`}
                  title={w.label}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTampilkanGrid(!tampilkanGrid)}
                className={`p-2 rounded-xl border font-bold cursor-pointer ${
                  tampilkanGrid ? "bg-indigo-50 border-indigo-300 text-indigo-800" : "bg-white"
                }`}
                title="Tampilkan Grid Kotak Matematika"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={unduhGambarWhiteboard}
                className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-black flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PNG
              </button>
              <button
                type="button"
                onClick={bersihkanWhiteboard}
                className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 font-black flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan
              </button>
            </div>
          </div>

          {/* Kanvas Papan Tulis */}
          <div
            className={`border-2 border-indigo-200 rounded-2xl overflow-hidden relative ${
              tampilkanGrid
                ? "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] bg-white"
                : "bg-white"
            }`}
          >
            <canvas
              ref={whiteboardRef}
              width={680}
              height={320}
              onMouseDown={mulaiCoret}
              onMouseMove={gerakCoret}
              onMouseUp={() => setSedangMenggambar(false)}
              onMouseLeave={() => setSedangMenggambar(false)}
              className="w-full h-72 cursor-crosshair"
            />
          </div>

          {/* Form Tempel Rumus / Sticky Note ke Papan Tulis */}
          <form onSubmit={tambahTeksKeCanvas} className="flex gap-2">
            <input
              type="text"
              value={teksLabelCanvas}
              onChange={(e) => setTeksLabelCanvas(e.target.value)}
              placeholder="Ketik rumus atau catatan singkat untuk ditempel ke Papan Tulis (+15 XP)..."
              className="flex-1 p-3 border rounded-xl bg-slate-50 text-xs font-bold"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Tempel ke Papan
            </button>
          </form>

          {/* Sticky Notes Kolaboratif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {daftarStickyNotes.map((st) => (
              <div
                key={st.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${st.warna}`}
              >
                <div className="font-black text-[11px] uppercase opacity-75">
                  📌 Catatan {st.penulis}:
                </div>
                <div className="font-bold">{st.isi}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================================
            2. SISTEM KOIN WAKAF & KEBUN POHON ILMU VIRTUAL (5 KOLOM)
           ====================================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5" /> Virtual Knowledge Garden
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-black">
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {koinWakaf} Koin
                </span>
                <span className="bg-sky-400/20 border border-sky-400/40 text-sky-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> {tetesAirIlmu} Air
                </span>
                <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" /> {pupukCahaya} Cahaya
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-black">
              Taman &ldquo;Pohon Ilmu&rdquo; {userLogin?.nama || "Pelajar"}
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Rawat pohon pengetahuan Anda menggunakan Tetes Air &amp; Koin Wakaf dari hasil
              menyelesaikan modul dan latihan kuis!
            </p>
          </div>

          {/* Visualisasi Pohon Ilmu Utama */}
          <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md text-center space-y-3">
            <div className="text-6xl py-2 animate-bounce">{infoPohonSaatIni.ikon}</div>
            <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
              <Award className="w-3 h-3" /> Tahap Pertumbuhan {infoPohonSaatIni.level} / 4
            </div>
            <h4 className="text-xl font-black">{infoPohonSaatIni.nama}</h4>
            <p className="text-xs text-emerald-100">{infoPohonSaatIni.deskripsi}</p>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-emerald-200">
                <span>Nutrisi Menuju Level Berikutnya:</span>
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

          {/* Tombol Aksi Merawat Pohon & Toko Koin Wakaf */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={handleSiramPohonIlmu}
              className="py-3 px-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              <Droplets className="w-4 h-4" /> Siram (-1 Air)
            </button>

            <button
              type="button"
              onClick={handleBeriPupukCahaya}
              className="py-3 px-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              <Sun className="w-4 h-4" /> Pupuk Cahaya
            </button>

            <button
              type="button"
              onClick={() => {
                if (koinWakaf < 30) {
                  alert("Koin Wakaf belum cukup (Butuh 30 Koin).");
                  return;
                }
                setKoinWakaf((prev) => prev - 30);
                setTetesAirIlmu((prev) => prev + 3);
                setPupukCahaya((prev) => prev + 1);
                setLogKebun((prev) => [
                  "🪙 Menukar 30 Koin Wakaf menjadi +3 Tetes Air & +1 Pupuk Cahaya.",
                  ...prev,
                ]);
              }}
              className="py-3 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" /> Tukar 30 Koin
            </button>
          </div>

          {/* Koleksi Tanaman Ilmu & Log Aktivitas Kebun */}
          <div className="space-y-3 pt-2 border-t border-white/15 text-xs">
            <div className="font-black text-emerald-300 uppercase text-[11px]">
              Koleksi Tanaman di Kebun Anda ({koleksiTanaman.length}):
            </div>
            <div className="grid grid-cols-1 gap-2">
              {koleksiTanaman.map((tn) => (
                <div
                  key={tn.id}
                  className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center"
                >
                  <span className="font-bold">
                    {tn.ikon} {tn.nama}
                  </span>
                  <span className="text-[10px] font-black bg-emerald-400 text-slate-950 px-2 py-0.5 rounded">
                    {tn.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 max-h-24 overflow-y-auto text-[11px] text-emerald-200 pt-1">
              {logKebun.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};