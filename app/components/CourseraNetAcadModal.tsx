"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  BookOpen,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Layers,
  PlayCircle,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { KelasItem, BabModulItem } from "../types";

interface CourseraNetAcadModalProps {
  modul: KelasItem;
  skorTertinggiSebelumnya: number;
  onTutup: () => void;
  onSimpanSkorModul: (modulId: string, skorBaru: number, lulusKkm: boolean) => void;
}

export const CourseraNetAcadModal: React.FC<CourseraNetAcadModalProps> = ({
  modul,
  skorTertinggiSebelumnya,
  onTutup,
  onSimpanSkorModul,
}) => {
  // Jika modul belum punya daftarBab khusus, buat bab otomatis dari rangkuman utama
  const daftarBab: BabModulItem[] =
    modul.daftarBab && modul.daftarBab.length > 0
      ? modul.daftarBab
      : [
          {
            id: "bab-1",
            judulBab: "Bab 1: Pengantar & Konsep Utama",
            durasiBab: "10 Menit",
            videoUrl: modul.videoUrl,
            kontenHtml: modul.rangkuman,
            rumusMatematika: modul.rumusMatematika,
          },
          {
            id: "bab-2",
            judulBab: "Bab 2: Studi Kasus & Pendalaman Materi",
            durasiBab: "10 Menit",
            kontenHtml: `<div style="background:#eef2ff;border-left:4px solid #4f46e5;padding:14px;border-radius:10px;"><b>💡 Pendalaman Modul NetAcad/Coursera:</b> Pastikan Anda memahami seluruh konsep pada Bab 1 sebelum melanjutkan ke Evaluasi Kuis Akhir Modul. Anda dapat mengulang modul dan kuis ini kapan saja.</div><p class="mt-3">Pelajari rumus dan rangkuman dengan saksama untuk mencapai nilai kelulusan minimal (Passing Grade).</p>`,
          },
        ];

  const [indeksTabAktif, setIndeksTabAktif] = useState<number>(0); // 0..daftarBab.length - 1 adalah Bab, daftarBab.length adalah Kuis Akhir
  const [babSelesaiDibaca, setBabSelesaiDibaca] = useState<string[]>([daftarBab[0]?.id || "bab-1"]);

  // State Pengerjaan Kuis Akhir di dalam Pop-up
  const [jawabanPG, setJawabanPG] = useState<{ [kuisId: string]: number }>({});
  const [jawabanJamak, setJawabanJamak] = useState<{ [kuisId: string]: number[] }>({});
  const [jawabanIsian, setJawabanIsian] = useState<{ [kuisId: string]: string }>({});
  const [jawabanCocok, setJawabanCocok] = useState<{
    [kuisId: string]: { [idxKiri: number]: string };
  }>({});
  const [hasilSubmitKuis, setHasilSubmitKuis] = useState<{
    sudahSubmit: boolean;
    skor: number;
    benar: number;
    totalSoal: number;
    lulus: boolean;
  } | null>(null);

  const kkmModul = modul.syaratSkorMinimal || 75;
  const sedangDiTabKuis = indeksTabAktif === daftarBab.length;
  const babSaatIni = daftarBab[indeksTabAktif];

  const tandaiBabSelesaiDanLanjut = () => {
    if (babSaatIni && !babSelesaiDibaca.includes(babSaatIni.id)) {
      setBabSelesaiDibaca([...babSelesaiDibaca, babSaatIni.id]);
    }
    if (indeksTabAktif < daftarBab.length) {
      setIndeksTabAktif(indeksTabAktif + 1);
    }
  };

  const hitungDanKumpulkanKuis = () => {
    const kuisList = modul.daftarKuis || [];
    if (kuisList.length === 0) {
      onSimpanSkorModul(modul.id, 100, true);
      setHasilSubmitKuis({
        sudahSubmit: true,
        skor: 100,
        benar: 1,
        totalSoal: 1,
        lulus: true,
      });
      return;
    }

    let jumlahBenar = 0;
    kuisList.forEach((k) => {
      if (k.tipe === "pilihan_ganda" || k.tipe === "benar_salah") {
        if (jawabanPG[k.id] === (k.jawabanBenar ?? 0)) jumlahBenar++;
      } else if (k.tipe === "pilihan_jamak") {
        const kunci = [...(k.jawabanJamak || [0, 1])].sort().join(",");
        const user = [...(jawabanJamak[k.id] || [])].sort().join(",");
        if (user === kunci) jumlahBenar++;
      } else if (k.tipe === "isian_singkat") {
        const inp = (jawabanIsian[k.id] || "").trim().toLowerCase();
        const knc = (k.jawabanTeks || "").trim().toLowerCase();
        if (inp && (!knc || inp === knc || knc.includes(inp) || inp.includes(knc))) {
          jumlahBenar++;
        }
      } else if (k.tipe === "mencocokkan") {
        const pasList =
          k.pasangan && k.pasangan.length > 0
            ? k.pasangan
            : [
                { kiri: "Pernyataan 1", kanan: "Pasangan A" },
                { kiri: "Pernyataan 2", kanan: "Pasangan B" },
              ];
        const cocokSemua = pasList.every(
          (p, idx) => (jawabanCocok[k.id]?.[idx] || "").trim() === p.kanan.trim()
        );
        if (cocokSemua) jumlahBenar++;
      }
    });

    const skorAkhir = Math.round((jumlahBenar / kuisList.length) * 100);
    const lulus = skorAkhir >= kkmModul;

    setHasilSubmitKuis({
      sudahSubmit: true,
      skor: skorAkhir,
      benar: jumlahBenar,
      totalSoal: kuisList.length,
      lulus,
    });

    onSimpanSkorModul(modul.id, skorAkhir, lulus);
  };

  const handleUlangiModulDariAwal = () => {
    setJawabanPG({});
    setJawabanJamak({});
    setJawabanIsian({});
    setJawabanCocok({});
    setHasilSubmitKuis(null);
    setIndeksTabAktif(0);
  };

  const handleUlangiKuisSaja = () => {
    setJawabanPG({});
    setJawabanJamak({});
    setJawabanIsian({});
    setJawabanCocok({});
    setHasilSubmitKuis(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white text-slate-800 w-full max-w-6xl rounded-[2rem] shadow-2xl border-2 border-indigo-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER ATAS ALA COURSERA / CISCO NETACAD */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Interactive Course Player
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  Syarat Lulus Minimal (KKM): <b className="text-amber-300">{kkmModul}/100</b>
                </span>
                {skorTertinggiSebelumnya > 0 && (
                  <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-emerald-300 font-bold">
                    Skor Terbaik Anda: {skorTertinggiSebelumnya}/100
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-0.5 line-clamp-1">{modul.judul}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUlangiModulDariAwal}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Ulangi baca modul dari Bab 1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi Modul
            </button>
            <button
              onClick={onTutup}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              title="Tutup Jendela Modul"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY 2 KOLOM: SIDEBAR BAB KIRI & KONTEN UTAMA KANAN */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Sidebar Kiri: Daftar Bab Berurutan + Evaluasi Akhir */}
          <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-5 overflow-y-auto space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
              Kurikulum Bab ({daftarBab.length} Bab &amp; 1 Evaluasi)
            </div>

            {daftarBab.map((bab, idx) => {
              const aktif = indeksTabAktif === idx;
              const selesai = babSelesaiDibaca.includes(bab.id);
              return (
                <button
                  key={bab.id}
                  onClick={() => setIndeksTabAktif(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                    aktif
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : selesai
                      ? "bg-emerald-50/70 border-emerald-200 text-slate-800 hover:bg-emerald-50"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {selesai ? (
                      <CheckCircle2
                        className={`w-5 h-5 ${aktif ? "text-emerald-300" : "text-emerald-600"}`}
                      />
                    ) : (
                      <PlayCircle
                        className={`w-5 h-5 ${aktif ? "text-white" : "text-slate-400"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-black uppercase opacity-80">
                      Bab {idx + 1} • {bab.durasiBab}
                    </div>
                    <div className="font-bold text-sm leading-snug mt-0.5">{bab.judulBab}</div>
                  </div>
                </button>
              );
            })}

            {/* Tab Evaluasi Kuis Akhir Penentu Kelulusan */}
            <button
              onClick={() => setIndeksTabAktif(daftarBab.length)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 cursor-pointer ${
                sedangDiTabKuis
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
                  : "bg-amber-50/70 border-amber-300 text-slate-900 hover:bg-amber-100"
              }`}
            >
              <Trophy className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <div className="text-[11px] font-black uppercase">
                  Syarat Lulus: Minimal Skor {kkmModul}
                </div>
                <div className="font-black text-sm mt-0.5">
                  Ujian Akhir Modul ({modul.daftarKuis.length} Soal)
                </div>
              </div>
            </button>
          </div>

          {/* Konten Utama Kanan */}
          <div className="lg:col-span-8 p-6 sm:p-8 overflow-y-auto space-y-6">
            {!sedangDiTabKuis && babSaatIni ? (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-4">
                  <div>
                    <span className="text-xs font-black uppercase text-indigo-600">
                      Bab {indeksTabAktif + 1} dari {daftarBab.length}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      {babSaatIni.judulBab}
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                    ⏱️ Estimasi: {babSaatIni.durasiBab}
                  </span>
                </div>

                {babSaatIni.videoUrl && (
                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-md">
                    <iframe
                      src={babSaatIni.videoUrl}
                      title={babSaatIni.judulBab}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}

                <div
                  className="prose prose-slate max-w-none leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: babSaatIni.kontenHtml }}
                />

                {babSaatIni.rumusMatematika && (
                  <div className="p-5 bg-indigo-950 text-white rounded-2xl overflow-x-auto">
                    <div className="text-xs font-bold text-indigo-300 mb-2">
                      Rumus Penting Bab Ini:
                    </div>
                    <BlockMath math={babSaatIni.rumusMatematika} />
                  </div>
                )}

                {/* Navigasi Bawah Antar Bab */}
                <div className="pt-6 border-t flex justify-between items-center">
                  <button
                    disabled={indeksTabAktif === 0}
                    onClick={() => setIndeksTabAktif((prev) => Math.max(0, prev - 1))}
                    className="px-5 py-3 rounded-xl border font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Bab Sebelumnya
                  </button>

                  <button
                    onClick={tandaiBabSelesaiDanLanjut}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>
                      {indeksTabAktif === daftarBab.length - 1
                        ? "Selesai Baca & Lanjut ke Kuis Akhir"
                        : "Tandai Selesai & Lanjut Bab Berikutnya"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* TAMPILAN UJIAN AKHIR MODUL & TOMBOL RETAKE */
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      Evaluasi Kelulusan Modul Bersyarat
                    </span>
                    <h3 className="text-xl font-black mt-2">
                      Kuis Akhir: {modul.judul}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Capai nilai minimal <b>{kkmModul}/100</b> untuk menyelesaikan modul ini dan
                      membuka kunci modul lanjutan. Anda bebas mengulang kuis sampai lulus!
                    </p>
                  </div>
                </div>

                {/* Hasil Evaluasi Setelah Submit */}
                {hasilSubmitKuis && (
                  <div
                    className={`p-6 rounded-3xl border-2 space-y-4 ${
                      hasilSubmitKuis.lulus
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : "bg-rose-50 border-rose-500 text-rose-950"
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        {hasilSubmitKuis.lulus ? (
                          <Award className="w-12 h-12 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-12 h-12 text-rose-600 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-black uppercase">
                            {hasilSubmitKuis.lulus
                              ? "🎉 SELAMAT! ANDA LULUS SYARAT MODUL INI"
                              : "⚠️ BELUM MENCAPAI BATAS NILAI KELULUSAN (KKM)"}
                          </div>
                          <div className="text-2xl font-black mt-0.5">
                            Skor Anda: {hasilSubmitKuis.skor}/100{" "}
                            <span className="text-sm font-bold">
                              (Benar {hasilSubmitKuis.benar} dari {hasilSubmitKuis.totalSoal} Soal •
                              Syarat Minimal: {kkmModul})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleUlangiKuisSaja}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" /> Ulangi Kuis (Retake)
                        </button>
                        {hasilSubmitKuis.lulus && (
                          <button
                            onClick={onTutup}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-black cursor-pointer"
                          >
                            Selesai &amp; Buka Modul Berikutnya →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Daftar Soal Kuis */}
                <div className="space-y-5">
                  {modul.daftarKuis.map((kuis, idx) => {
                    const pasList =
                      kuis.pasangan && kuis.pasangan.length > 0
                        ? kuis.pasangan
                        : [
                            { kiri: "Pernyataan 1", kanan: "Pasangan A" },
                            { kiri: "Pernyataan 2", kanan: "Pasangan B" },
                          ];
                    const opsiKananUrut = [...pasList]
                      .map((p) => p.kanan)
                      .sort((a, b) => a.localeCompare(b));

                    return (
                      <div
                        key={kuis.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <div className="flex justify-between items-center text-xs font-black text-indigo-900">
                          <span>
                            Soal #{idx + 1} ({kuis.tipe.replace("_", " ").toUpperCase()})
                          </span>
                          <span>+{kuis.poin} XP</span>
                        </div>
                        <p className="font-bold text-base text-slate-900">{kuis.tanya}</p>

                        {(kuis.tipe === "pilihan_ganda" || kuis.tipe === "benar_salah") && (
                          <div className="space-y-2">
                            {(kuis.tipe === "benar_salah" ? ["Benar", "Salah"] : kuis.opsi).map(
                              (op, oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setJawabanPG({ ...jawabanPG, [kuis.id]: oIdx })}
                                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm font-semibold cursor-pointer ${
                                    jawabanPG[kuis.id] === oIdx
                                      ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  {op}
                                </button>
                              )
                            )}
                          </div>
                        )}

                        {kuis.tipe === "pilihan_jamak" && (
                          <div className="space-y-2">
                            {kuis.opsi.map((op, oIdx) => {
                              const dipilih = (jawabanJamak[kuis.id] || []).includes(oIdx);
                              return (
                                <label
                                  key={oIdx}
                                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-semibold cursor-pointer ${
                                    dipilih
                                      ? "border-indigo-600 bg-indigo-50"
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={dipilih}
                                    onChange={() => {
                                      const lama = jawabanJamak[kuis.id] || [];
                                      const baru = dipilih
                                        ? lama.filter((x) => x !== oIdx)
                                        : [...lama, oIdx];
                                      setJawabanJamak({ ...jawabanJamak, [kuis.id]: baru });
                                    }}
                                  />
                                  <span>{op}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {kuis.tipe === "isian_singkat" && (
                          <input
                            type="text"
                            value={jawabanIsian[kuis.id] || ""}
                            onChange={(e) =>
                              setJawabanIsian({ ...jawabanIsian, [kuis.id]: e.target.value })
                            }
                            placeholder="Ketik jawaban singkat Anda..."
                            className="w-full p-3.5 bg-white border rounded-xl text-sm font-bold"
                          />
                        )}

                        {kuis.tipe === "mencocokkan" && (
                          <div className="space-y-2.5">
                            {pasList.map((pas, pIdx) => (
                              <div
                                key={pIdx}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center bg-white p-3 rounded-xl border"
                              >
                                <span className="text-xs font-bold">{pas.kiri}</span>
                                <select
                                  value={jawabanCocok[kuis.id]?.[pIdx] || ""}
                                  onChange={(e) =>
                                    setJawabanCocok({
                                      ...jawabanCocok,
                                      [kuis.id]: {
                                        ...(jawabanCocok[kuis.id] || {}),
                                        [pIdx]: e.target.value,
                                      },
                                    })
                                  }
                                  className="p-2 border rounded-lg text-xs font-bold bg-slate-50"
                                >
                                  <option value="">-- Pilih Pasangan --</option>
                                  {opsiKananUrut.map((kn, kIdx) => (
                                    <option key={kIdx} value={kn}>
                                      {kn}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}

                        {hasilSubmitKuis && (
                          <div className="p-3 bg-white rounded-xl border text-xs text-slate-600">
                            <b>Pembahasan:</b> {kuis.pembahasan}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setIndeksTabAktif(daftarBab.length - 1)}
                    className="px-5 py-3 rounded-xl border font-bold text-xs cursor-pointer"
                  >
                    ← Kembali ke Materi Bab
                  </button>
                  <button
                    onClick={hitungDanKumpulkanKuis}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-black text-sm shadow-lg cursor-pointer"
                  >
                    Kumpulkan &amp; Hitung Skor Kelulusan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};