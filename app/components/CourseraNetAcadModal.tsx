"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Layers,
  PlayCircle,
  ClipboardCheck,
  Send,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { KelasItem, BabModulItem, TugasItem, PengumpulanTugas, AkunPengguna } from "../types";

interface CourseraNetAcadModalProps {
  modul: KelasItem;
  userLogin: AkunPengguna;
  skorTertinggiSebelumnya: number;
  daftarTugasGlobal: TugasItem[];
  daftarPengumpulan: PengumpulanTugas[];
  onKumpulTugasModul: (tugasId: string, jawabanTeks: string) => void;
  onTutup: () => void;
  onSimpanSkorModul: (modulId: string, skorBaru: number, lulusKkm: boolean) => void;
}

export const CourseraNetAcadModal: React.FC<CourseraNetAcadModalProps> = ({
  modul,
  userLogin,
  skorTertinggiSebelumnya,
  daftarTugasGlobal,
  daftarPengumpulan,
  onKumpulTugasModul,
  onTutup,
  onSimpanSkorModul,
}) => {
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
            kontenHtml: `<div style="background:#eef2ff;border-left:4px solid #4f46e5;padding:14px;border-radius:10px;"><b>💡 Pendalaman Modul NetAcad/Coursera:</b> Pastikan Anda memahami seluruh konsep pada Bab 1 sebelum melanjutkan ke Evaluasi Kuis Akhir Modul.</div>`,
          },
        ];

  // Gabungkan tugas dari properti modul dan tugas global yang sesuai dengan modul/subJenjang ini
  const tugasModulIni: TugasItem[] = [
    ...(modul.daftarTugasModul || []),
    ...daftarTugasGlobal.filter(
      (t) =>
        (t.modulId === modul.id || t.subJenjangId === modul.subJenjangId) &&
        !(modul.daftarTugasModul || []).some((m) => m.id === t.id)
    ),
  ];

  // Mode tampilan: 'bab' | 'kuis' | 'tugas'
  const [modeKonten, setModeKonten] = useState<"bab" | "kuis" | "tugas">("bab");
  const [indeksBabAktif, setIndeksBabAktif] = useState<number>(0);
  const [babSelesaiDibaca, setBabSelesaiDibaca] = useState<string[]>([daftarBab[0]?.id || "bab-1"]);

  // State Kuis Akhir
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

  // State Input Jawaban Tugas di dalam Pop-up
  const [inputTugasPopup, setInputTugasPopup] = useState<{ [tugasId: string]: string }>({});

  const kkmModul = modul.syaratSkorMinimal || 75;
  const babSaatIni = daftarBab[indeksBabAktif];

  const tandaiBabSelesaiDanLanjut = () => {
    if (babSaatIni && !babSelesaiDibaca.includes(babSaatIni.id)) {
      setBabSelesaiDibaca([...babSelesaiDibaca, babSaatIni.id]);
    }
    if (indeksBabAktif < daftarBab.length - 1) {
      setIndeksBabAktif(indeksBabAktif + 1);
    } else {
      setModeKonten("kuis");
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
        {/* HEADER ATAS */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Coursera / NetAcad Player
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
              onClick={() => {
                handleUlangiKuisSaja();
                setIndeksBabAktif(0);
                setModeKonten("bab");
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi dari Bab 1
            </button>
            <button
              onClick={onTutup}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY 2 KOLOM */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Sidebar Kiri: Daftar Bab, Kuis Akhir, & Tugas Modul */}
          <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-5 overflow-y-auto space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
              Kurikulum Bab &amp; Tugas Modul
            </div>

            {daftarBab.map((bab, idx) => {
              const aktif = modeKonten === "bab" && indeksBabAktif === idx;
              const selesai = babSelesaiDibaca.includes(bab.id);
              return (
                <button
                  key={bab.id}
                  onClick={() => {
                    setModeKonten("bab");
                    setIndeksBabAktif(idx);
                  }}
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

            {/* Tombol Tab Kuis Akhir */}
            <button
              onClick={() => setModeKonten("kuis")}
              className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 cursor-pointer ${
                modeKonten === "kuis"
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

            {/* Tombol Tab Tugas Proyek Modul */}
            <button
              onClick={() => setModeKonten("tugas")}
              className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 cursor-pointer ${
                modeKonten === "tugas"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-emerald-50/70 border-emerald-300 text-slate-900 hover:bg-emerald-100"
              }`}
            >
              <ClipboardCheck
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  modeKonten === "tugas" ? "text-white" : "text-emerald-700"
                }`}
              />
              <div>
                <div className="text-[11px] font-black uppercase">Praktik &amp; Penugasan</div>
                <div className="font-black text-sm mt-0.5">
                  Tugas Kelas Modul Ini ({tugasModulIni.length} Tugas)
                </div>
              </div>
            </button>
          </div>

          {/* Konten Utama Kanan */}
          <div className="lg:col-span-8 p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* MODE 1: BACA BAB */}
            {modeKonten === "bab" && babSaatIni && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-4">
                  <div>
                    <span className="text-xs font-black uppercase text-indigo-600">
                      Bab {indeksBabAktif + 1} dari {daftarBab.length}
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
                  className="prose prose-slate max-w-none leading-relaxed text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
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

                <div className="pt-6 border-t flex justify-between items-center">
                  <button
                    disabled={indeksBabAktif === 0}
                    onClick={() => setIndeksBabAktif((prev) => Math.max(0, prev - 1))}
                    className="px-5 py-3 rounded-xl border font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Bab Sebelumnya
                  </button>

                  <button
                    onClick={tandaiBabSelesaiDanLanjut}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>
                      {indeksBabAktif === daftarBab.length - 1
                        ? "Selesai Baca & Lanjut ke Kuis Akhir"
                        : "Tandai Selesai & Lanjut Bab Berikutnya"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: UJIAN AKHIR MODUL */}
            {modeKonten === "kuis" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      Evaluasi Kelulusan Modul Bersyarat
                    </span>
                    <h3 className="text-xl font-black mt-2">Kuis Akhir: {modul.judul}</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Capai nilai minimal <b>{kkmModul}/100</b> untuk menyelesaikan modul ini dan
                      membuka kunci modul lanjutan.
                    </p>
                  </div>
                </div>

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
                        {tugasModulIni.length > 0 && (
                          <button
                            onClick={() => setModeKonten("tugas")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-black cursor-pointer"
                          >
                            Lanjut ke Tugas Modul →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

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
                    onClick={() => setModeKonten("bab")}
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

            {/* MODE 3: PENGUMPULAN TUGAS PROYEK MODUL */}
            {modeKonten === "tugas" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white space-y-2">
                  <span className="bg-white/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Tugas Kelas &amp; Praktik Mandiri
                  </span>
                  <h3 className="text-xl font-black">Penugasan Modul: {modul.judul}</h3>
                  <p className="text-xs text-emerald-100">
                    Kumpulkan jawaban esai atau tautan proyek Anda untuk dinilai oleh pengajar
                    menggunakan AI Rubric Scoring.
                  </p>
                </div>

                {tugasModulIni.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border text-sm text-slate-500 font-bold">
                    Belum ada tugas khusus yang dilampirkan pada modul ini.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tugasModulIni.map((tgs) => {
                      const kirimanUser = daftarPengumpulan.find(
                        (p) => p.tugasId === tgs.id && p.siswaId === userLogin.id
                      );
                      return (
                        <div
                          key={tgs.id}
                          className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4 text-sm"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <h4 className="font-black text-lg text-slate-900">{tgs.judul}</h4>
                              <p className="text-xs text-slate-500">
                                Pengajar: <b>{tgs.pembuatNama}</b> • Tenggat: <b>{tgs.deadline}</b>
                              </p>
                            </div>
                            {kirimanUser && (
                              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                                ✓ Sudah Dikumpulkan
                              </span>
                            )}
                          </div>

                          <div className="p-4 bg-white rounded-xl border text-slate-700 leading-relaxed">
                            {tgs.instruksi}
                          </div>

                          {kirimanUser ? (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                              <div className="font-black text-emerald-950">
                                Jawaban Terkirim ({kirimanUser.waktuKumpul}):
                              </div>
                              <p className="text-slate-700">{kirimanUser.jawabanTeksAtauLink}</p>
                              <div className="pt-1 font-black text-indigo-900">
                                Status Nilai:{" "}
                                {kirimanUser.nilai !== undefined
                                  ? `${kirimanUser.nilai}/100 — ${kirimanUser.feedbackGuru || "Dinilai"}`
                                  : "Menunggu Penilaian Guru / AI Rubric"}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <textarea
                                rows={3}
                                value={inputTugasPopup[tgs.id] || ""}
                                onChange={(e) =>
                                  setInputTugasPopup({
                                    ...inputTugasPopup,
                                    [tgs.id]: e.target.value,
                                  })
                                }
                                placeholder="Tuliskan uraian jawaban tugas atau tempel link Google Drive / GitHub proyek Anda di sini..."
                                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const isi = (inputTugasPopup[tgs.id] || "").trim();
                                  if (!isi) return;
                                  onKumpulTugasModul(tgs.id, isi);
                                  setInputTugasPopup({ ...inputTugasPopup, [tgs.id]: "" });
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer"
                              >
                                <Send className="w-4 h-4" /> Kirim Jawaban Tugas (+40 XP)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};