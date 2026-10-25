"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Send,
  ShieldAlert,
  Edit3,
  Trash2,
  Lock,
  Keyboard,
  XCircle,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { PaketTryout } from "../types";

interface CbtUjianProps {
  paket: PaketTryout;
  userNama: string;
  onSelesaiUjian: (
    skor: number,
    totalPelanggaran: number,
    statusAkhir: "Selesai Normal" | "Diskualifikasi (Auto-Submit)"
  ) => void;
  onBatal: () => void;
}

export const CbtUjianLanjutanModal: React.FC<CbtUjianProps> = ({
  paket,
  userNama,
  onSelesaiUjian,
  onBatal,
}) => {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawaban, setJawaban] = useState<{ [key: number]: number }>({});
  const [sisaDetik, setSisaDetik] = useState((paket.durasiMenit || 15) * 60);
  const [pelanggaran, setPelanggaran] = useState(0);
  const [pesanPeringatan, setPesanPeringatan] = useState("");

  // State Corat-Coret (Scratchpad Canvas)
  const [bukaCoratCoret, setBukaCoratCoret] = useState(Boolean(paket.pakaiCoratCoret ?? true));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const bolehMundur = paket.bolehMundur ?? false;
  const izinkanKeyboard = paket.izinkanKeyboard ?? false;
  const pakaiCoratCoret = paket.pakaiCoratCoret ?? true;
  const maxBatasPelanggaran = paket.batasPelanggaran || 3;

  const hitungDanKumpul = (diskualifikasi: boolean, jmlPelanggaranAkhir = pelanggaran) => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (diskualifikasi) {
      onSelesaiUjian(0, jmlPelanggaranAkhir, "Diskualifikasi (Auto-Submit)");
      return;
    }
    let benar = 0;
    paket.daftarSoal.forEach((soal, idx) => {
      if (jawaban[idx] === soal.jawabanBenar) benar++;
    });
    const nilaiAkhir = Math.round((benar / (paket.daftarSoal.length || 1)) * 100);
    onSelesaiUjian(nilaiAkhir, jmlPelanggaranAkhir, "Selesai Normal");
  };

  // Sensor Pindah Tab / Keluar Jendela / Klik Kanan
  useEffect(() => {
    const catatPelanggaran = (alasan: string) => {
      setPelanggaran((prev) => {
        const next = prev + 1;
        setPesanPeringatan(
          `⚠️ PELANGGARAN (${next}/${maxBatasPelanggaran}): Terdeteksi ${alasan}!`
        );
        if (next >= maxBatasPelanggaran) {
          hitungDanKumpul(true, next);
        }
        return next;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) catatPelanggaran("pindah tab atau minimize browser");
    };
    const handleBlur = () => catatPelanggaran("keluar dari jendela ujian (Alt+Tab)");
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      catatPelanggaran("mencoba klik kanan");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [maxBatasPelanggaran, jawaban]);

  // Sensor Blokir Keyboard
  useEffect(() => {
    if (!izinkanKeyboard) {
      const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        setPelanggaran((prev) => {
          const next = prev + 1;
          setPesanPeringatan(
            `⚠️ PELANGGARAN (${next}/${maxBatasPelanggaran}): Menekan tombol keyboard (${e.key}) saat dikunci!`
          );
          if (next >= maxBatasPelanggaran) {
            hitungDanKumpul(true, next);
          }
          return next;
        });
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [izinkanKeyboard, maxBatasPelanggaran, jawaban]);

  // Timer Hitung Mundur
  useEffect(() => {
    const timer = setInterval(() => {
      setSisaDetik((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          hitungDanKumpul(false, pelanggaran);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pelanggaran, jawaban]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const formatWaktu = (detik: number) => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const soalAktif = paket.daftarSoal[indeksSoal];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 select-none overflow-y-auto">
      {/* Header Atas CBT */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase bg-indigo-600 text-white px-3 py-0.5 rounded-full">
              {paket.tipeUjian || "Pilihan Ganda"}
            </span>
            <span className="text-[11px] font-bold bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {bolehMundur ? "Bisa Mundur Soal" : "Tidak Bisa Mundur (One-Way)"}
            </span>
            <span className="text-[11px] font-bold bg-slate-800 text-rose-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              {izinkanKeyboard ? "Keyboard Aktif" : "Keyboard Diblokir"}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black mt-1.5">{paket.judul}</h2>
          <p className="text-xs text-slate-400">
            Peserta: <b>{userNama}</b> • Pelanggaran:{" "}
            <b className="text-rose-400">
              {pelanggaran}/{maxBatasPelanggaran}
            </b>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pakaiCoratCoret && (
            <button
              type="button"
              onClick={() => setBukaCoratCoret(!bukaCoratCoret)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              {bukaCoratCoret ? "Tutup Corat-Coret" : "Buka Kertas Corat-Coret"}
            </button>
          )}

          <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 px-4 py-2.5 rounded-xl flex items-center gap-2 font-mono font-black text-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatWaktu(sisaDetik)}</span>
          </div>

          <button
            type="button"
            onClick={onBatal}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
            title="Batalkan / Keluar"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {pesanPeringatan && (
        <div className="mt-4 p-4 bg-rose-600 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{pesanPeringatan}</span>
        </div>
      )}

      {/* Body Soal & Kertas Corat-Coret */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 flex-1">
        <div
          className={`${
            bukaCoratCoret && pakaiCoratCoret ? "lg:col-span-7" : "lg:col-span-12"
          } flex flex-col justify-between space-y-5`}
        >
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="flex justify-between items-center text-xs font-black text-slate-400">
              <span>
                SOAL NOMOR {indeksSoal + 1} DARI {paket.daftarSoal.length}
              </span>
              <div className="flex gap-1.5">
                {paket.daftarSoal.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!bolehMundur && idx < indeksSoal}
                    onClick={() => {
                      if (bolehMundur || idx >= indeksSoal) setIndeksSoal(idx);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-black ${
                      indeksSoal === idx
                        ? "bg-indigo-600 text-white"
                        : jawaban[idx] !== undefined
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    } ${!bolehMundur && idx < indeksSoal ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-lg sm:text-xl font-bold leading-relaxed">
              {soalAktif?.pertanyaan}
            </p>

            {soalAktif?.rumus && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
                <BlockMath math={soalAktif.rumus} />
              </div>
            )}

            <div className="space-y-3 pt-2">
              {soalAktif?.opsi.map((teksOpsi: string, oIdx: number) => {
                const dipilih = jawaban[indeksSoal] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => setJawaban({ ...jawaban, [indeksSoal]: oIdx })}
                    className={`w-full text-left p-4 rounded-2xl border-2 font-semibold text-sm sm:text-base transition cursor-pointer flex items-center gap-3 ${
                      dipilih
                        ? "border-emerald-500 bg-emerald-500/20 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{teksOpsi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <button
              type="button"
              disabled={!bolehMundur || indeksSoal === 0}
              onClick={() => setIndeksSoal((prev) => Math.max(0, prev - 1))}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black disabled:opacity-30 cursor-pointer"
            >
              ← Sebelumnya {!bolehMundur && "(Dikunci)"}
            </button>

            {indeksSoal < paket.daftarSoal.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndeksSoal((prev) => prev + 1)}
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black cursor-pointer"
              >
                Soal Selanjutnya →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => hitungDanKumpul(false, pelanggaran)}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" /> Kumpulkan Ujian Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Kanvas Corat-Coret Samping */}
        {bukaCoratCoret && pakaiCoratCoret && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-sky-400">
                ✏️ Kertas Buram / Corat-Coret Hitungan
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bersihkan
              </button>
            </div>
            <div className="flex-1 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl overflow-hidden min-h-[340px]">
              <canvas
                ref={canvasRef}
                width={460}
                height={420}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};