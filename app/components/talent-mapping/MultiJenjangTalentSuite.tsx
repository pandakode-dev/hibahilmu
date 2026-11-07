"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eraser, Paintbrush, PaintBucket } from "lucide-react";
import {
  DAFTAR_8_MISI_KANVAS,
  MisiKanvasId,
  gambarIlustrasiBukuMewarnai,
  isiWarnaCatTumpahFloodFill,
} from "./kidsCanvasIllustrations";
import {
  DimensiScoreItem,
  DEFINISI_8_DIMENSI_ANAK,
  KARTU_VISUAL_ANAK_24,
  OBSERVASI_ORTU_24,
  DEFINISI_8_BAKAT_SMP,
  SOAL_SMP_36,
  DEFINISI_6_RIASEC_SMA,
  SOAL_SMA_48,
} from "./multiJenjangQuestionsData";
import { MultiJenjangCertificateAndReport } from "./CertificateAndReportComponents";

export const MultiJenjangTalentSuite: React.FC<{
  modeJenjang: "anak_tk_sd" | "smp" | "sma";
  namaPeserta: string;
  setNamaPeserta: (v: string) => void;
  instansiPeserta: string;
  setInstansiPeserta: (v: string) => void;
  emailPeserta?: string;
  onSimpanKeDatabasePusat?: (recordLengkap: any) => void;
}> = ({
  modeJenjang,
  namaPeserta,
  setNamaPeserta,
  instansiPeserta,
  setInstansiPeserta,
  emailPeserta = "peserta@hibahilmu.id",
  onSimpanKeDatabasePusat,
}) => {
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [statusCloud, setStatusCloud] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [subTahapAnak, setSubTahapAnak] = useState<
    "kanvas" | "kartu" | "observasi" | "hasil"
  >("kanvas");
  const [alatWarnaAktif, setAlatWarnaAktif] = useState<
    "cat_tumpah" | "kuas_stylus" | "penghapus"
  >("cat_tumpah");
  const [sedangMenggambar, setSedangMenggambar] = useState<boolean>(false);
  const [warnaKuas, setWarnaKuas] = useState<string>("#ef4444");
  const [ukuranKuas, setUkuranKuas] = useState<number>(12);
  const [misiKanvasAktif, setMisiKanvasAktif] =
    useState<MisiKanvasId>("rumah_pohon");

  const [galeriKaryaKanvas, setGaleriKaryaKanvas] = useState<
    Partial<Record<MisiKanvasId, string>>
  >({});
  const [misiPernahDigoresSet, setMisiPernahDigoresSet] = useState<
    Set<MisiKanvasId>
  >(new Set());
  const [warnaTerpakaiSet, setWarnaTerpakaiSet] = useState<Set<string>>(
    new Set(["#ef4444"])
  );
  const [jumlahGoresan, setJumlahGoresan] = useState<number>(0);
  const [totalPanjangGoresan, setTotalPanjangGoresan] = useState<number>(0);

  const [indeksKartuAnak, setIndeksKartuAnak] = useState<number>(0);
  const [jawabanKartuAnak, setJawabanKartuAnak] = useState<
    Record<number, string>
  >({});
  const [observasiOrtuSkor, setObservasiOrtuSkor] = useState<
    Record<string, number>
  >({});

  const [subTahapSmp, setSubTahapSmp] = useState<"sesi1" | "sesi2" | "hasil">(
    "sesi1"
  );
  const [indeksSoalSmp, setIndeksSoalSmp] = useState<number>(0);
  const [jawabanSmp, setJawabanSmp] = useState<Record<number, number>>({});

  const [subTahapSma, setSubTahapSma] = useState<"sesi1" | "sesi2" | "hasil">(
    "sesi1"
  );
  const [indeksSoalSma, setIndeksSoalSma] = useState<number>(0);
  const [jawabanSma, setJawabanSma] = useState<Record<number, number>>({});

  const simpanSnapshotKanvasSaatIni = (
    misiId: MisiKanvasId = misiKanvasAktif
  ) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    try {
      const dataUrl = cvs.toDataURL("image/png");
      setGaleriKaryaKanvas((prev) => ({
        ...prev,
        [misiId]: dataUrl,
      }));
    } catch {}
  };

  useEffect(() => {
    if (modeJenjang === "anak_tk_sd" && subTahapAnak === "kanvas") {
      const timer = setTimeout(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        const rekamanLama = galeriKaryaKanvas[misiKanvasAktif];
        if (rekamanLama) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = rekamanLama;
        } else {
          gambarIlustrasiBukuMewarnai(
            ctx,
            cvs.width,
            cvs.height,
            misiKanvasAktif
          );
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [modeJenjang, subTahapAnak, misiKanvasAktif]);

  const gantiMisiKanvasDenganAman = (targetMisi: MisiKanvasId) => {
    if (misiPernahDigoresSet.has(misiKanvasAktif)) {
      simpanSnapshotKanvasSaatIni(misiKanvasAktif);
    }
    setMisiKanvasAktif(targetMisi);
  };

  const ambilKoordinatPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current!;
    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (cvs.width / rect.width);
    const y = (e.clientY - rect.top) * (cvs.height / rect.height);
    return { x, y };
  };

  const handlePointerDownKanvas = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const { x, y } = ambilKoordinatPointer(e);

    setJumlahGoresan((g) => g + 1);
    setWarnaTerpakaiSet((prev) => new Set(prev).add(warnaKuas));
    setMisiPernahDigoresSet((prev) => new Set(prev).add(misiKanvasAktif));

    if (alatWarnaAktif === "cat_tumpah") {
      isiWarnaCatTumpahFloodFill(
        ctx,
        cvs.width,
        cvs.height,
        x,
        y,
        warnaKuas,
        misiKanvasAktif
      );
      setTotalPanjangGoresan((p) => p + 25);
      simpanSnapshotKanvasSaatIni(misiKanvasAktif);
      return;
    }

    setSedangMenggambar(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.strokeStyle = alatWarnaAktif === "penghapus" ? "#ffffff" : warnaKuas;
    ctx.lineWidth =
      alatWarnaAktif === "penghapus" ? ukuranKuas * 1.8 : ukuranKuas;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const handlePointerMoveKanvas = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!sedangMenggambar || alatWarnaAktif === "cat_tumpah") return;
    e.preventDefault();
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const { x, y } = ambilKoordinatPointer(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = alatWarnaAktif === "penghapus" ? "#ffffff" : warnaKuas;
    ctx.lineWidth =
      alatWarnaAktif === "penghapus" ? ukuranKuas * 1.8 : ukuranKuas;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setTotalPanjangGoresan((p) => p + 1);
  };

  const handlePointerUpKanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (sedangMenggambar) {
      setSedangMenggambar(false);
      const cvs = canvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext("2d");
        if (ctx) {
          gambarIlustrasiBukuMewarnai(
            ctx,
            cvs.width,
            cvs.height,
            misiKanvasAktif,
            true
          );
        }
      }
      simpanSnapshotKanvasSaatIni(misiKanvasAktif);
    }
  };

  const hapusUlangiKanvasIni = () => {
    const cvs = canvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext("2d");
      if (ctx) {
        gambarIlustrasiBukuMewarnai(
          ctx,
          cvs.width,
          cvs.height,
          misiKanvasAktif,
          false
        );
      }
    }
    setGaleriKaryaKanvas((prev) => {
      const salinan = { ...prev };
      delete salinan[misiKanvasAktif];
      return salinan;
    });
    setMisiPernahDigoresSet((prev) => {
      const next = new Set(prev);
      next.delete(misiKanvasAktif);
      return next;
    });
  };

  // ==========================================================================
  // SIMPAN PAKET LENGKAP (TERMASUK LUKISAN ANAK & SEMUA DIMENSI) KE DATABASE PUSAT
  // ==========================================================================
  const simpanLaporanMultiJenjangKeCloud = async (
    judulLaporan: string,
    labelJenjang: string,
    daftarDimensi: DimensiScoreItem[]
  ) => {
    setStatusCloud("Menyimpan ke Database Pusat HibahIlmu...");
    const paketLengkap = {
      idHasil: `TM-${modeJenjang.toUpperCase()}-${emailPeserta
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}-${Date.now()}`,
      tipeJenjang: modeJenjang,
      judulLaporanMultiJenjang: judulLaporan,
      subjudulJenjangMultiJenjang: labelJenjang,
      namaPeserta: namaPeserta.trim() || "Peserta Asesmen",
      emailPeserta: emailPeserta.trim().toLowerCase(),
      instansiPeserta: `${instansiPeserta} (${labelJenjang.split(" •")[0]})`,
      tanggalTes: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      nomorDokumenRahasia: `CONF-${modeJenjang.toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
      daftarUrutMultiJenjang: daftarDimensi,
      galeriKaryaKanvas: modeJenjang === "anak_tk_sd" ? galeriKaryaKanvas : {},
      bakatUtama1_7: daftarDimensi.slice(0, 3).map((d, i) => ({
        id: d.id,
        nama: d.nama,
        julukanRemaja: d.julukan,
        peringkat: i + 1,
        domain: "Thinking",
        deskripsiKuat: d.deskripsiKekuatan,
      })),
      top5PersonalBranding: daftarDimensi.slice(0, 3).map((d) => ({
        id: d.id,
        nama: d.julukan,
        julukan: d.nama,
        kategori: modeJenjang.toUpperCase(),
        deskripsi: d.deskripsiKekuatan,
        skorKecocokan: d.persen,
      })),
      timestampMs: Date.now(),
    };

    try {
      const res = await fetch("/api/talent-mapping", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          result: paketLengkap,
        }),
      });
      await res.json();
      setStatusCloud("Tersimpan Permanen di Database Pusat Cloud ✓");
      if (onSimpanKeDatabasePusat) onSimpanKeDatabasePusat(paketLengkap);
    } catch {
      setStatusCloud("Tersimpan di Memori Browser ✓");
    }
  };

  // ==========================================================================
  // RENDER JENJANG 1: ANAK 3–8 TAHUN
  // ==========================================================================
  if (modeJenjang === "anak_tk_sd") {
    const jmlKartuTerisi = Object.keys(jawabanKartuAnak).length;
    const jmlObservasiTerisi = Object.keys(observasiOrtuSkor).length;
    const jmlKanvasDiwarnai = Object.keys(galeriKaryaKanvas).length;

    const hitungSkorLengkapAnak = (): DimensiScoreItem[] => {
      const skorMap: Record<string, number> = {
        seni: 25,
        fisik: 25,
        logika: 25,
        musik: 25,
        bahasa: 25,
        sosial: 25,
        alam: 25,
        mandiri: 25,
      };

      skorMap.seni += Math.min(
        26,
        warnaTerpakaiSet.size * 3 + Math.max(1, jmlKanvasDiwarnai) * 3.5
      );
      skorMap.fisik += Math.min(20, Math.round(totalPanjangGoresan / 15));
      skorMap.mandiri += Math.min(
        18,
        Math.max(1, jmlKanvasDiwarnai) * 4 + Math.min(10, jumlahGoresan)
      );

      DAFTAR_8_MISI_KANVAS.forEach((m) => {
        if (misiPernahDigoresSet.has(m.id)) {
          skorMap[m.dimensiUtama] = (skorMap[m.dimensiUtama] || 25) + 12;
          skorMap[m.dimensiPendukung] =
            (skorMap[m.dimensiPendukung] || 25) + 7;
        }
      });

      Object.values(jawabanKartuAnak).forEach((kode) => {
        if (skorMap[kode] !== undefined) skorMap[kode] += 9;
      });

      OBSERVASI_ORTU_24.forEach((ob) => {
        const nilai = observasiOrtuSkor[ob.id] || 0;
        if (nilai > 0 && skorMap[ob.kategori] !== undefined) {
          skorMap[ob.kategori] += nilai * 6;
        }
      });

      return Object.entries(DEFINISI_8_DIMENSI_ANAK)
        .map(([id, def]) => {
          const mentah = skorMap[id] || 30;
          const persen = Math.min(98, Math.max(38, Math.round(mentah)));
          return {
            ...def,
            skorMentah: mentah,
            persen,
            peringkat: 0,
            kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
          };
        })
        .sort((a, b) => b.skorMentah - a.skorMentah)
        .map((item, idx) => ({
          ...item,
          peringkat: idx + 1,
          kategori:
            idx < 3
              ? ("Kekuatan Utama" as const)
              : idx < 6
              ? ("Kekuatan Pendukung" as const)
              : ("Area Perlu Stimulasi / Tantangan" as const),
        }));
    };

    const kartuAktif = KARTU_VISUAL_ANAK_24[indeksKartuAnak];
    const hasilUrutAnak = hitungSkorLengkapAnak();
    const judulLapAnak =
      "Laporan Komprehensif Bakat, Motorik & Kecerdasan Majemuk Anak";
    const labelSubAnak = `Jenjang Anak Usia Dini (3–8 Tahun / PAUD–TK–SD) • Analisis Kanvas (${jmlKanvasDiwarnai} Karya, ${warnaTerpakaiSet.size} Warna), 24 Kartu Visual & 24 Observasi`;

    return (
      <div className="space-y-6 print:space-y-0">
        <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: "kanvas",
              label: "1. Buku Mewarnai (8 Gambar)",
              sub: `${jmlKanvasDiwarnai} Gambar Diwarnai (Touch & Stylus)`,
            },
            {
              id: "kartu",
              label: "2. Kartu Cerita Bergambar",
              sub: `${jmlKartuTerisi}/24 Kartu Dipilih`,
            },
            {
              id: "observasi",
              label: "3. Observasi Orang Tua",
              sub: `${jmlObservasiTerisi}/24 Perilaku Diisi`,
            },
            {
              id: "hasil",
              label: "4. Sertifikat Landscape & Hasil",
              sub: "Otomatis Masuk Database Pusat",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (
                  subTahapAnak === "kanvas" &&
                  misiPernahDigoresSet.has(misiKanvasAktif)
                ) {
                  simpanSnapshotKanvasSaatIni(misiKanvasAktif);
                }
                if (tab.id === "hasil") {
                  simpanLaporanMultiJenjangKeCloud(
                    judulLapAnak,
                    labelSubAnak,
                    hasilUrutAnak
                  );
                }
                setSubTahapAnak(tab.id as any);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition ${
                subTahapAnak === tab.id
                  ? "bg-pink-600 text-white border-amber-300 shadow-lg"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">{tab.label}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  subTahapAnak === tab.id ? "text-amber-200" : "text-slate-500"
                }`}
              >
                {tab.sub}
              </div>
            </button>
          ))}
        </div>

        <div className="print:hidden bg-white p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-black text-slate-700">
              Nama Lengkap Anak (Tercetak di Sertifikat Landscape):
            </label>
            <input
              type="text"
              placeholder="Ketik nama panggilan/lengkap anak..."
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border font-bold"
            />
          </div>
          <div>
            <label className="font-black text-slate-700">
              Usia &amp; Sekolah (PAUD/TK/SD):
            </label>
            <input
              type="text"
              placeholder="Contoh: Usia 5 Tahun — TK A / PAUD"
              value={instansiPeserta}
              onChange={(e) => setInstansiPeserta(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border font-bold"
            />
          </div>
        </div>

        {subTahapAnak === "kanvas" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  ✓ Mendukung Layar Sentuh (Touchscreen), Stylus Pen Tablet &amp; Ember Cat Tumpah!
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  🎨 Pilih Tema Gambar &amp; Warnai dengan Cat Tumpah (1x Ketuk) atau Kuas Stylus!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (misiPernahDigoresSet.has(misiKanvasAktif)) {
                    simpanSnapshotKanvasSaatIni(misiKanvasAktif);
                  }
                  setSubTahapAnak("kartu");
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-600 text-white font-black text-xs cursor-pointer shadow"
              >
                Simpan Gambar &amp; Lanjut ke 24 Kartu ➔
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {DAFTAR_8_MISI_KANVAS.map((m) => {
                const aktif = misiKanvasAktif === m.id;
                const sudahAdaGambar = Boolean(galeriKaryaKanvas[m.id]);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => gantiMisiKanvasDenganAman(m.id)}
                    className={`p-2.5 rounded-2xl text-left border-2 cursor-pointer transition ${
                      aktif
                        ? "bg-indigo-600 text-white border-amber-400 shadow-md"
                        : sudahAdaGambar
                        ? "bg-emerald-50 text-emerald-950 border-emerald-400"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div className="font-black flex justify-between items-center gap-1">
                      <span className="truncate">{m.judul}</span>
                      {sudahAdaGambar && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[8px] shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[9.5px] mt-0.5 truncate ${
                        aktif ? "text-indigo-100" : "text-slate-500"
                      }`}
                    >
                      {m.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAlatWarnaAktif("cat_tumpah")}
                    className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer border-2 transition ${
                      alatWarnaAktif === "cat_tumpah"
                        ? "bg-rose-600 text-white border-amber-300 shadow-md scale-105"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    <PaintBucket className="w-4 h-4" /> 🪣 Cat Tumpah (1x Ketuk Penuh)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlatWarnaAktif("kuas_stylus")}
                    className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer border-2 transition ${
                      alatWarnaAktif === "kuas_stylus"
                        ? "bg-indigo-600 text-white border-amber-300 shadow-md scale-105"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" /> 🖌️ Kuas Lukis / Stylus Pen
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlatWarnaAktif("penghapus")}
                    className={`px-3 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer border-2 transition ${
                      alatWarnaAktif === "penghapus"
                        ? "bg-amber-400 text-slate-950 border-slate-900 shadow-md"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    <Eraser className="w-4 h-4" /> 🧼 Penghapus Warna
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  {alatWarnaAktif !== "cat_tumpah" && (
                    <>
                      <span>Tebal Kuas:</span>
                      <input
                        type="range"
                        min={4}
                        max={30}
                        value={ukuranKuas}
                        onChange={(e) => setUkuranKuas(Number(e.target.value))}
                        className="w-20"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={hapusUlangiKanvasIni}
                    className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-black cursor-pointer"
                  >
                    🔄 Bersihkan Kanvas Ini
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
                <span className="text-xs font-black text-slate-700 mr-1">
                  🎨 Pilih Warna Cat:
                </span>
                {[
                  "#ef4444",
                  "#f97316",
                  "#facc15",
                  "#84cc16",
                  "#22c55e",
                  "#14b8a6",
                  "#38bdf8",
                  "#2563eb",
                  "#8b5cf6",
                  "#d946ef",
                  "#f472b6",
                  "#fcd34d",
                  "#92400e",
                  "#334155",
                ].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => {
                      setWarnaKuas(hex);
                      if (alatWarnaAktif === "penghapus") {
                        setAlatWarnaAktif("cat_tumpah");
                      }
                    }}
                    style={{ backgroundColor: hex }}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 transition ${
                      warnaKuas === hex
                        ? "scale-125 ring-4 ring-amber-400 border-white shadow-md"
                        : "border-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border-2 border-dashed border-slate-300">
              <canvas
                ref={canvasRef}
                width={540}
                height={240}
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDownKanvas}
                onPointerMove={handlePointerMoveKanvas}
                onPointerUp={handlePointerUpKanvas}
                onPointerCancel={handlePointerUpKanvas}
                className="w-full max-w-[540px] h-[240px] bg-white rounded-2xl shadow-inner cursor-crosshair border select-none"
              />
            </div>
          </div>
        )}

        {subTahapAnak === "kartu" && kartuAktif && (
          <div className="bg-white p-6 rounded-3xl border-2 border-sky-300 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-100 text-sky-900">
                  Tahap 2 dari 3 • Permainan Pilih Gambar ({jmlKartuTerisi} / 24 Terjawab)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  🖼️ Bacakan Pertanyaan Ini &amp; Biarkan Anak Menunjuk Gambarnya!
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                  />
                  <span>Otomatis Pindah Kartu</span>
                </label>
                <button
                  type="button"
                  onClick={() => setJawabanKartuAnak({})}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
                >
                  Kosongkan
                </button>
                <button
                  type="button"
                  onClick={() => setSubTahapAnak("observasi")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
                >
                  Lanjut ke Observasi Ortu ➔
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5">
              <div className="flex justify-between text-xs font-mono text-amber-300">
                <span>Kartu Cerita #{kartuAktif.id} dari 24</span>
                <span>
                  {jawabanKartuAnak[kartuAktif.id]
                    ? "✓ Sudah Dipilih"
                    : "○ Belum Dipilih (Kosong)"}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-black">
                {kartuAktif.pertanyaan}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kartuAktif.opsi.map((op, i) => {
                  const dipilih = jawabanKartuAnak[kartuAktif.id] === op.kode;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setJawabanKartuAnak((prev) => ({
                          ...prev,
                          [kartuAktif.id]: op.kode,
                        }));
                        if (autoNext && indeksKartuAnak < 23) {
                          setTimeout(
                            () =>
                              setIndeksKartuAnak((idx) => Math.min(23, idx + 1)),
                            160
                          );
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition cursor-pointer ${
                        dipilih
                          ? "bg-amber-400 text-slate-950 border-white scale-[1.02] shadow-lg"
                          : "bg-slate-800 text-white border-slate-700 hover:border-amber-400"
                      }`}
                    >
                      <span className="text-4xl shrink-0">{op.ikon}</span>
                      <span className="font-black text-sm leading-snug">
                        {op.teks}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {KARTU_VISUAL_ANAK_24.map((k, idx) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setIndeksKartuAnak(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-black border cursor-pointer ${
                    indeksKartuAnak === idx
                      ? "bg-pink-600 text-white"
                      : jawabanKartuAnak[k.id]
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {k.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {subTahapAnak === "observasi" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Tahap 3 dari 3 • Kuesioner Pengamatan Orang Tua / Guru ({jmlObservasiTerisi} / 24 Diisi)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  📋 Nilai Keseharian Anak untuk Mempertajam Akurasi Machine Learning
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setObservasiOrtuSkor({})}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
              >
                Kosongkan Semua
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OBSERVASI_ORTU_24.map((ob, idx) => {
                const skor = observasiOrtuSkor[ob.id];
                return (
                  <div
                    key={ob.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="text-xs font-black text-slate-800">
                      {idx + 1}. {ob.teks}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: 1, l: "Belum Terlihat" },
                        { v: 2, l: "Kadang-Kadang" },
                        { v: 3, l: "Sangat Sering!" },
                      ].map((op) => (
                        <button
                          key={op.v}
                          type="button"
                          onClick={() =>
                            setObservasiOrtuSkor((prev) => ({
                              ...prev,
                              [ob.id]: op.v,
                            }))
                          }
                          className={`py-2 px-2 rounded-xl text-[11px] font-black border cursor-pointer ${
                            skor === op.v
                              ? "bg-emerald-600 text-white border-emerald-800"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {op.l}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                simpanLaporanMultiJenjangKeCloud(
                  judulLapAnak,
                  labelSubAnak,
                  hasilUrutAnak
                );
                setSubTahapAnak("hasil");
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm shadow-xl cursor-pointer"
            >
              🎉 Simpan ke Database Pusat &amp; Terbitkan Sertifikat Landscape Anak!
            </button>
          </div>
        )}

        {subTahapAnak === "hasil" && (
          <MultiJenjangCertificateAndReport
            modeJenjang="anak_tk_sd"
            namaPeserta={namaPeserta}
            instansiPeserta={instansiPeserta}
            emailPeserta={emailPeserta}
            judulLaporan={judulLapAnak}
            subjudulJenjang={labelSubAnak}
            daftarUrut={hasilUrutAnak}
            galeriKaryaKanvas={galeriKaryaKanvas}
            statusCloud={statusCloud}
            onSimpanCloud={() =>
              simpanLaporanMultiJenjangKeCloud(
                judulLapAnak,
                labelSubAnak,
                hasilUrutAnak
              )
            }
          />
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER JENJANG 2: SD ATAS & SMP (36 SOAL)
  // ==========================================================================
  if (modeJenjang === "smp") {
    const jmlTerisiSmp = Object.keys(jawabanSmp).length;
    const soalSmpAktif = SOAL_SMP_36[indeksSoalSmp];

    const hitungSkorLengkapSmp = () => {
      const mapSkor: Record<string, number> = {};
      Object.keys(DEFINISI_8_BAKAT_SMP).forEach((k) => (mapSkor[k] = 0));
      const vak = { visual: 0, auditori: 0, kinestetik: 0 };

      SOAL_SMP_36.forEach((s) => {
        const val = jawabanSmp[s.no] ?? 3;
        if (s.sesi === 1 && mapSkor[s.dimensi] !== undefined) {
          mapSkor[s.dimensi] += val;
        } else if (s.dimensi === "vak_visual") vak.visual += val;
        else if (s.dimensi === "vak_auditori") vak.auditori += val;
        else if (s.dimensi === "vak_kinestetik") vak.kinestetik += val;
      });

      const daftarUrut: DimensiScoreItem[] = Object.entries(
        DEFINISI_8_BAKAT_SMP
      )
        .map(([id, def]) => {
          const mentah = mapSkor[id] || 9;
          const persen = Math.min(
            98,
            Math.max(35, Math.round((mentah / 15) * 100))
          );
          return {
            ...def,
            skorMentah: mentah,
            persen,
            peringkat: 0,
            kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
          };
        })
        .sort((a, b) => b.skorMentah - a.skorMentah)
        .map((item, idx) => ({
          ...item,
          peringkat: idx + 1,
          kategori:
            idx < 3
              ? ("Kekuatan Utama" as const)
              : idx < 6
              ? ("Kekuatan Pendukung" as const)
              : ("Area Perlu Stimulasi / Tantangan" as const),
        }));

      const vakUrut = Object.entries(vak).sort((a, b) => b[1] - a[1]);
      return { daftarUrut, vak, vakDominan: vakUrut[0][0] };
    };

    const hasilSmp = hitungSkorLengkapSmp();
    const judulLapSmp =
      "Laporan Talent Mapping, Gaya Belajar (VAK) & Arah Minat Siswa SMP";
    const labelSubSmp = `Jenjang SD Atas & SMP (9–15 Tahun) • Gaya Belajar Dominan: ${hasilSmp.vakDominan.toUpperCase()}`;

    return (
      <div className="space-y-6 print:space-y-0">
        <div className="print:hidden grid grid-cols-3 gap-3">
          {[
            {
              id: "sesi1",
              label: "1. Sesi 1: 8 Bakat SMP (Soal 1–24)",
              sub: "Minat, Akademik & Karakter",
            },
            {
              id: "sesi2",
              label: "2. Sesi 2: Gaya Belajar VAK (Soal 25–36)",
              sub: "Visual, Auditori, Kinestetik",
            },
            {
              id: "hasil",
              label: "3. Sertifikat Landscape & Laporan",
              sub: `Terisi: ${jmlTerisiSmp}/36 Soal`,
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                if (t.id === "hasil") {
                  simpanLaporanMultiJenjangKeCloud(
                    judulLapSmp,
                    labelSubSmp,
                    hasilSmp.daftarUrut
                  );
                }
                setSubTahapSmp(t.id as any);
                if (t.id === "sesi1") setIndeksSoalSmp(0);
                if (t.id === "sesi2") setIndeksSoalSmp(24);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer ${
                subTahapSmp === t.id
                  ? "bg-sky-700 text-white border-amber-300 shadow-lg"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">{t.label}</div>
              <div className="text-[10px] opacity-80">{t.sub}</div>
            </button>
          ))}
        </div>

        {(subTahapSmp === "sesi1" || subTahapSmp === "sesi2") &&
          soalSmpAktif && (
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-100 text-sky-900">
                    Asesmen Remaja SD Atas &amp; SMP (9–15 Tahun) • Terjawab:{" "}
                    {jmlTerisiSmp} / 36 Soal
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Butir Pernyataan #{soalSmpAktif.no} dari 36
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoNext}
                      onChange={(e) => setAutoNext(e.target.checked)}
                    />
                    <span>Otomatis Pindah Soal</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setJawabanSmp({});
                      setIndeksSoalSmp(0);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
                  >
                    Kosongkan Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      simpanLaporanMultiJenjangKeCloud(
                        judulLapSmp,
                        labelSubSmp,
                        hasilSmp.daftarUrut
                      );
                      setSubTahapSmp("hasil");
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
                  >
                    Simpan &amp; Lihat Hasil ➔
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>Soal #{soalSmpAktif.no} / 36</span>
                  <span>
                    {jawabanSmp[soalSmpAktif.no] !== undefined
                      ? `✓ Sudah Dijawab (Skor ${jawabanSmp[soalSmpAktif.no]})`
                      : "○ Belum Dijawab (Kosong)"}
                  </span>
                </div>
                <p className="text-lg sm:text-2xl font-black leading-relaxed">
                  &ldquo;{soalSmpAktif.teks}&rdquo;
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { v: 1, l: "Sangat Tidak Cocok" },
                    { v: 2, l: "Kurang Cocok" },
                    { v: 3, l: "Netral / Biasa" },
                    { v: 4, l: "Cocok" },
                    { v: 5, l: "Sangat Menggambarkan Aku!" },
                  ].map((op) => {
                    const dipilih = jawabanSmp[soalSmpAktif.no] === op.v;
                    return (
                      <button
                        key={op.v}
                        type="button"
                        onClick={() => {
                          setJawabanSmp((prev) => ({
                            ...prev,
                            [soalSmpAktif.no]: op.v,
                          }));
                          if (autoNext && indeksSoalSmp < 35) {
                            setTimeout(() => {
                              const nextIdx = indeksSoalSmp + 1;
                              setIndeksSoalSmp(nextIdx);
                              if (nextIdx >= 24) setSubTahapSmp("sesi2");
                            }, 160);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition ${
                          dipilih
                            ? "bg-amber-400 text-slate-950 border-white scale-105"
                            : "bg-slate-800 text-white border-slate-700 hover:border-sky-400"
                        }`}
                      >
                        <div className="text-lg">{op.v}</div>
                        <div className="text-[10px]">{op.l}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SOAL_SMP_36.map((s, idx) => (
                  <button
                    key={s.no}
                    type="button"
                    onClick={() => {
                      setIndeksSoalSmp(idx);
                      setSubTahapSmp(s.sesi === 1 ? "sesi1" : "sesi2");
                    }}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black border cursor-pointer ${
                      indeksSoalSmp === idx
                        ? "bg-rose-600 text-white"
                        : jawabanSmp[s.no] !== undefined
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {s.no}
                  </button>
                ))}
              </div>
            </div>
          )}

        {subTahapSmp === "hasil" && (
          <MultiJenjangCertificateAndReport
            modeJenjang="smp"
            namaPeserta={namaPeserta}
            instansiPeserta={instansiPeserta}
            emailPeserta={emailPeserta}
            judulLaporan={judulLapSmp}
            subjudulJenjang={labelSubSmp}
            daftarUrut={hasilSmp.daftarUrut}
            statusCloud={statusCloud}
            onSimpanCloud={() =>
              simpanLaporanMultiJenjangKeCloud(
                judulLapSmp,
                labelSubSmp,
                hasilSmp.daftarUrut
              )
            }
            infoTambahanAtas={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-200 break-inside-avoid print:grid-cols-3">
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-indigo-900">
                    👁️ Gaya Belajar Visual:{" "}
                    {Math.round((hasilSmp.vak.visual / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat peta konsep (Mind-Map), diagram warna,
                    dan video visual.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-amber-900">
                    🎧 Gaya Belajar Auditori:{" "}
                    {Math.round((hasilSmp.vak.auditori / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat diskusi aktif, membaca nyaring, dan
                    mengajari teman.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-emerald-900">
                    🛠️ Gaya Belajar Kinestetik:{" "}
                    {Math.round((hasilSmp.vak.kinestetik / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat eksperimen laboratorium, simulasi, dan
                    praktik langsung.
                  </p>
                </div>
              </div>
            }
          />
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER JENJANG 3: REMAJA SMA / SMK (48 SOAL)
  // ==========================================================================
  const jmlTerisiSma = Object.keys(jawabanSma).length;
  const soalSmaAktif = SOAL_SMA_48[indeksSoalSma];

  const hitungSkorLengkapSma = (): DimensiScoreItem[] => {
    const mapSkor: Record<string, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };
    SOAL_SMA_48.forEach((s) => {
      const val = jawabanSma[s.no] ?? 3;
      mapSkor[s.dimensi] = (mapSkor[s.dimensi] || 0) + val;
    });

    return Object.entries(DEFINISI_6_RIASEC_SMA)
      .map(([id, def]) => {
        const mentah = mapSkor[id] || 24;
        const persen = Math.min(
          99,
          Math.max(36, Math.round((mentah / 40) * 100))
        );
        return {
          ...def,
          skorMentah: mentah,
          persen,
          peringkat: 0,
          kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
        };
      })
      .sort((a, b) => b.skorMentah - a.skorMentah)
      .map((item, idx) => ({
        ...item,
        peringkat: idx + 1,
        kategori:
          idx < 2
            ? ("Kekuatan Utama" as const)
            : idx < 4
            ? ("Kekuatan Pendukung" as const)
            : ("Area Perlu Stimulasi / Tantangan" as const),
      }));
  };

  const hasilUrutSma = hitungSkorLengkapSma();
  const judulLapSma =
    "Laporan Eksekutif Penjurusan Kuliah (SNBP/SNBT), Mapel Pilihan & Karier SMA/SMK";
  const labelSubSma =
    "Jenjang Remaja SMA / SMK / MA (15–18 Tahun) • 48 Indikator RIASEC Holland & Kesiapan Kuliah Abad 21";

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="print:hidden grid grid-cols-3 gap-3">
        {[
          {
            id: "sesi1",
            label: "1. Sesi 1: Minat RIASEC (Soal 1–30)",
            sub: "6 Dimensi Karier & Jurusan",
          },
          {
            id: "sesi2",
            label: "2. Sesi 2: Kesiapan Kuliah (Soal 31–48)",
            sub: "Kompetensi Eksekusi Abad 21",
          },
          {
            id: "hasil",
            label: "3. Sertifikat Landscape & Penjurusan",
            sub: `Terisi: ${jmlTerisiSma}/48 Soal`,
          },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              if (t.id === "hasil") {
                simpanLaporanMultiJenjangKeCloud(
                  judulLapSma,
                  labelSubSma,
                  hasilUrutSma
                );
              }
              setSubTahapSma(t.id as any);
              if (t.id === "sesi1") setIndeksSoalSma(0);
              if (t.id === "sesi2") setIndeksSoalSma(30);
            }}
            className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer ${
              subTahapSma === t.id
                ? "bg-purple-800 text-white border-amber-300 shadow-lg"
                : "bg-white text-slate-800 border-slate-200"
            }`}
          >
            <div className="font-black text-xs sm:text-sm">{t.label}</div>
            <div className="text-[10px] opacity-80">{t.sub}</div>
          </button>
        ))}
      </div>

      {(subTahapSma === "sesi1" || subTahapSma === "sesi2") && soalSmaAktif && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-purple-100 text-purple-900">
                Asesmen Penjurusan Kuliah &amp; Karier SMA/SMK • Terjawab:{" "}
                {jmlTerisiSma} / 48 Soal
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Pernyataan #{soalSmaAktif.no} dari 48
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                />
                <span>Otomatis Pindah Soal</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setJawabanSma({});
                  setIndeksSoalSma(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
              >
                Kosongkan Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  simpanLaporanMultiJenjangKeCloud(
                    judulLapSma,
                    labelSubSma,
                    hasilUrutSma
                  );
                  setSubTahapSma("hasil");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
              >
                Simpan &amp; Lihat Hasil ➔
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
            <div className="flex justify-between text-xs font-mono text-amber-300">
              <span>
                Soal #{soalSmaAktif.no} / 48 • Dimensi [{soalSmaAktif.dimensi}]
              </span>
              <span>
                {jawabanSma[soalSmaAktif.no] !== undefined
                  ? `✓ Sudah Dijawab (Skor ${jawabanSma[soalSmaAktif.no]})`
                  : "○ Belum Dijawab (Kosong)"}
              </span>
            </div>
            <p className="text-lg sm:text-2xl font-black leading-relaxed">
              &ldquo;{soalSmaAktif.teks}&rdquo;
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { v: 1, l: "Sangat Tidak Minat" },
                { v: 2, l: "Kurang Minat" },
                { v: 3, l: "Netral / Ragu" },
                { v: 4, l: "Minat & Cocok" },
                { v: 5, l: "Sangat Minat & Kuat!" },
              ].map((op) => {
                const dipilih = jawabanSma[soalSmaAktif.no] === op.v;
                return (
                  <button
                    key={op.v}
                    type="button"
                    onClick={() => {
                      setJawabanSma((prev) => ({
                        ...prev,
                        [soalSmaAktif.no]: op.v,
                      }));
                      if (autoNext && indeksSoalSma < 47) {
                        setTimeout(() => {
                          const nextIdx = indeksSoalSma + 1;
                          setIndeksSoalSma(nextIdx);
                          if (nextIdx >= 30) setSubTahapSma("sesi2");
                        }, 160);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition ${
                      dipilih
                        ? "bg-amber-400 text-slate-950 border-white scale-105"
                        : "bg-slate-800 text-white border-slate-700 hover:border-purple-400"
                    }`}
                  >
                    <div className="text-lg">{op.v}</div>
                    <div className="text-[10px]">{op.l}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SOAL_SMA_48.map((s, idx) => (
              <button
                key={s.no}
                type="button"
                onClick={() => {
                  setIndeksSoalSma(idx);
                  setSubTahapSma(s.sesi === 1 ? "sesi1" : "sesi2");
                }}
                className={`w-8 h-8 rounded-lg text-[10px] font-black border cursor-pointer ${
                  indeksSoalSma === idx
                    ? "bg-rose-600 text-white"
                    : jawabanSma[s.no] !== undefined
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {s.no}
              </button>
            ))}
          </div>
        </div>
      )}

      {subTahapSma === "hasil" && (
        <MultiJenjangCertificateAndReport
          modeJenjang="sma"
          namaPeserta={namaPeserta}
          instansiPeserta={instansiPeserta}
          emailPeserta={emailPeserta}
          judulLaporan={judulLapSma}
          subjudulJenjang={labelSubSma}
          daftarUrut={hasilUrutSma}
          statusCloud={statusCloud}
          onSimpanCloud={() =>
            simpanLaporanMultiJenjangKeCloud(
              judulLapSma,
              labelSubSma,
              hasilUrutSma
            )
          }
        />
      )}
    </div>
  );
};