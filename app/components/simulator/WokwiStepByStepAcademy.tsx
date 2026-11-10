"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Play,
  Sparkles,
  Code2,
  AlertCircle,
  RotateCcw,
  Award,
  Lightbulb,
  Lock,
  HelpCircle,
  Eye,
  Target,
  Cable,
  Trash2,
  PackageOpen,
  MousePointerClick,
} from "lucide-react";
import {
  KURIKULUM_15_LEVEL_IOT,
  LessonStepIoT,
} from "./wokwiCurriculumData";
import {
  SPESIFIKASI_HARDWARE_15_LEVEL,
  DAFTAR_GUDANG_KOMPONEN_WOKWI,
  GambarPeriferalWokwiAsli,
  TitikPinFisik,
  ItemGudangKomponen,
} from "./wokwiHardwareVisuals";

export interface KabelTersambung {
  dariPinEsp32: string;
  kePinPeriferal: string;
  warna: string;
}

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const [modeBelajar, setModeBelajar] = useState<
    "tutorial_berkedip" | "latihan_mandiri"
  >("tutorial_berkedip");

  const materiAktif: LessonStepIoT = KURIKULUM_15_LEVEL_IOT[indeksLevel];
  const spekHardware =
    SPESIFIKASI_HARDWARE_15_LEVEL[materiAktif.level] ||
    SPESIFIKASI_HARDWARE_15_LEVEL[1];

  // State Drag & Drop dari Gudang Komponen ke Kotak Bayangan Kanvas
  const [esp32SudahDitaruh, setEsp32SudahDitaruh] = useState<boolean>(false);
  const [periferalSudahDitaruh, setPeriferalSudahDitaruh] =
    useState<boolean>(false);
  const [itemSedangDiDrag, setItemSedangDiDrag] =
    useState<ItemGudangKomponen | null>(null);
  const [pesanGudang, setPesanGudang] = useState<string>("");

  // State Klik 2 Titik Kaki Pin & Kabel Hidup Mengikuti Kursor Mouse
  const [kabelTerpasangList, setKabelTerpasangList] = useState<
    KabelTersambung[]
  >([]);
  const [pinAwalDiklik, setPinAwalDiklik] = useState<TitikPinFisik | null>(
    null
  );
  const [posisiKursorSvg, setPosisiKursorSvg] = useState<{
    x: number;
    y: number;
  }>({ x: 280, y: 120 });

  // State Clue Bertahap
  const [jumlahClueDibuka, setJumlahClueDibuka] = useState<number>(0);
  const [intipBayanganSementara, setIntipBayanganSementara] =
    useState<boolean>(false);

  // State Editor Kodingan C++
  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    KURIKULUM_15_LEVEL_IOT[0].kodeTemplateAwal
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// 1. Tarik (Drag) ESP32 & Komponen dari Gudang Komponen ke kotak bayangan di kanvas.\n// 2. Klik kaki pin ke-1 lalu klik kaki pin ke-2 untuk menyambung kabel.\n// 3. Ketik kode C++ dan jalankan!"
  );

  const [detakSimulasi, setDetakSimulasi] = useState<number>(0);
  const [nilaiSensorUji, setNilaiSensorUji] = useState<number>(210);

  useEffect(() => {
    if (statusVerifikasi !== "lulus") return;
    const timer = setInterval(() => {
      setDetakSimulasi((d) => d + 1);
    }, 650);
    return () => clearInterval(timer);
  }, [statusVerifikasi]);

  const pindahKeLevel = (
    idxBaru: number,
    modeTarget: "tutorial_berkedip" | "latihan_mandiri" = modeBelajar
  ) => {
    const target = KURIKULUM_15_LEVEL_IOT[idxBaru];
    if (!target) return;
    setIndeksLevel(idxBaru);
    setModeBelajar(modeTarget);
    setEsp32SudahDitaruh(false);
    setPeriferalSudahDitaruh(false);
    setItemSedangDiDrag(null);
    setPesanGudang("");
    setKabelTerpasangList([]);
    setPinAwalDiklik(null);
    setJumlahClueDibuka(0);
    setIntipBayanganSementara(false);
    setKodeKetikanUser(target.kodeTemplateAwal);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Level ${target.level}: ${target.judulMateri}\n// Tarik komponen dari Gudang Komponen ke kotak bayangan di kanvas!`
    );
  };

  // Cari sambungan kabel wajib mana yang saat ini BELUM dipasang oleh siswa
  const sambunganWajibBelumTerpasang = spekHardware.sambunganWajib.filter(
    (wajib) =>
      !kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      )
  );

  const langkahTutorialSaatIni:
    | "taruh_esp32"
    | "taruh_periferal"
    | "tarik_kabel"
    | "ketik_kode" = !esp32SudahDitaruh
    ? "taruh_esp32"
    : !periferalSudahDitaruh
    ? "taruh_periferal"
    : sambunganWajibBelumTerpasang.length > 0
    ? "tarik_kabel"
    : "ketik_kode";

  const sambunganBerkedipTarget = sambunganWajibBelumTerpasang[0] || null;
  const tampilkanBayanganPanduan =
    modeBelajar === "tutorial_berkedip" || intipBayanganSementara;

  // ==========================================================================
  // 1. HANDLER DRAG & DROP DARI GUDANG KOMPONEN KE ZONA BAYANGAN KANVAS
  // ==========================================================================
  const handleDropKeZonaBayangan = (zonaTarget: "zona_esp32" | "zona_periferal") => {
    if (!itemSedangDiDrag) return;

    if (zonaTarget === "zona_esp32") {
      if (itemSedangDiDrag.tipeCocok === "esp32_board") {
        setEsp32SudahDitaruh(true);
        setPesanGudang(
          "✅ Mantap! Papan ESP32 DevKit V1 berhasil dipasang ke meja breadboard!"
        );
      } else {
        setPesanGudang(
          `❌ Salah Tempat! Kotak kiri khusus untuk 'ESP32 DevKit V1', bukan '${itemSedangDiDrag.namaTampil}'.`
        );
      }
    } else if (zonaTarget === "zona_periferal") {
      if (itemSedangDiDrag.tipeCocok === spekHardware.tipeVisualPeriferal) {
        setPeriferalSudahDitaruh(true);
        setPesanGudang(
          `✅ Tepat Sekali! Komponen '${itemSedangDiDrag.namaTampil}' berhasil dipasang ke kanvas!`
        );
      } else {
        setPesanGudang(
          `❌ Komponen Tidak Sesuai Modul! Level ${materiAktif.level} membutuhkan '${spekHardware.namaPeriferal}', bukan '${itemSedangDiDrag.namaTampil}'.`
        );
      }
    }
    setItemSedangDiDrag(null);
  };

  // Mendukung klik kartu di Gudang Komponen (bagi pengguna HP/layar sentuh) untuk memilih lalu klik kotak bayangan
  const handleKlikKartuGudang = (item: ItemGudangKomponen) => {
    setItemSedangDiDrag(item);
    if (item.tipeCocok === "esp32_board") {
      setPesanGudang(
        `👉 '${item.namaTampil}' dipilih! Sekarang tarik atau KLIK kotak bayangan kiri di dalam kanvas untuk menaruhnya.`
      );
    } else {
      setPesanGudang(
        `👉 '${item.namaTampil}' dipilih! Sekarang tarik atau KLIK kotak bayangan kanan di dalam kanvas untuk menaruhnya.`
      );
    }
  };

  // ==========================================================================
  // 2. HANDLER KLIK 2 TITIK KAKI PIN SECARA BERURUTAN + KABEL IKUT MOUSE
  // ==========================================================================
  const handleMouseMoveSvg = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pinAwalDiklik || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 580 / rect.width;
    const scaleY = 250 / rect.height;
    setPosisiKursorSvg({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  const handleKlikTitikPinFisik = (
    e: React.MouseEvent,
    pinDiklik: TitikPinFisik
  ) => {
    e.stopPropagation();

    if (!esp32SudahDitaruh || !periferalSudahDitaruh) {
      setPesanGudang(
        "⚠️ Tarik dan pasang dulu ESP32 serta Komponen dari Gudang Komponen ke kanvas sebelum menyambung kaki pin!"
      );
      return;
    }

    // KLIK TITIK KE-1: Mulai menarik ujung kabel dari kaki pin ini
    if (!pinAwalDiklik) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 [${pinDiklik.labelPin}] terpegang! Sekarang arahkan kabel dan KLIK titik kaki pin ke-2 pada komponen pasangan!`
      );
      return;
    }

    // Jika mengklik titik yang sama persis, batalkan pegangan kabel
    if (pinAwalDiklik.idPin === pinDiklik.idPin) {
      setPinAwalDiklik(null);
      setPesanGudang("Tarikan kabel dibatalkan.");
      return;
    }

    // Jika mengklik pin di komponen yang sama (misal ESP32 ke ESP32), pindahkan titik awal ke pin baru tersebut
    if (pinAwalDiklik.posisiKomponen === pinDiklik.posisiKomponen) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 dipindahkan ke [${pinDiklik.labelPin}]. Sekarang klik titik kaki pin pada komponen seberangnya!`
      );
      return;
    }

    // KLIK TITIK KE-2 BERBEDA KOMPONEN: Resmi pasang kabel antara Titik 1 dan Titik 2!
    const idEsp =
      pinAwalDiklik.posisiKomponen === "esp32"
        ? pinAwalDiklik.idPin
        : pinDiklik.idPin;
    const idPerif =
      pinAwalDiklik.posisiKomponen === "periferal"
        ? pinAwalDiklik.idPin
        : pinDiklik.idPin;

    const cocokWajib = spekHardware.sambunganWajib.find(
      (w) => w.dariPinEsp32 === idEsp && w.kePinPeriferal === idPerif
    );
    const warnaKabelBaru = cocokWajib?.warnaKabel || pinAwalDiklik.warnaPin;

    setKabelTerpasangList((prev) => {
      const bersih = prev.filter(
        (k) => !(k.dariPinEsp32 === idEsp && k.kePinPeriferal === idPerif)
      );
      return [
        ...bersih,
        { dariPinEsp32: idEsp, kePinPeriferal: idPerif, warna: warnaKabelBaru },
      ];
    });

    setPinAwalDiklik(null);
    setStatusVerifikasi("belum");
    setPesanGudang(
      cocokWajib
        ? `✅ Kabel berhasil disambung: ${cocokWajib.keteranganJalur}!`
        : `⚠️ Kabel terpasang dari ${pinAwalDiklik.labelPin} ke ${pinDiklik.labelPin}.`
    );
  };

  // ==========================================================================
  // 3. MESIN VALIDASI KETAT: KOMPONEN + KABEL PIN + SINTAKS KODE C++
  // ==========================================================================
  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];

    if (!esp32SudahDitaruh) {
      errors.push(
        "[KOMPONEN BELUM DITARUH] Tarik 'ESP32 DevKit V1' dari Gudang Komponen ke kotak bayangan kiri di kanvas!"
      );
    }
    if (!periferalSudahDitaruh) {
      errors.push(
        `[KOMPONEN BELUM DITARUH] Tarik '${spekHardware.namaPeriferal}' dari Gudang Komponen ke kotak bayangan kanan di kanvas!`
      );
    }

    for (const wajib of spekHardware.sambunganWajib) {
      const sudahAda = kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      );
      if (!sudahAda) {
        errors.push(`[KABEL BELUM TERSAMBUNG] ${wajib.keteranganJalur}.`);
      }
    }

    for (const terpasang of kabelTerpasangList) {
      const valid = spekHardware.sambunganWajib.some(
        (w) =>
          w.dariPinEsp32 === terpasang.dariPinEsp32 &&
          w.kePinPeriferal === terpasang.kePinPeriferal
      );
      if (!valid) {
        const namaEsp =
          spekHardware.pinEsp32Tersedia.find(
            (p) => p.idPin === terpasang.dariPinEsp32
          )?.labelPin || terpasang.dariPinEsp32;
        const namaPerif =
          spekHardware.pinPeriferalTersedia.find(
            (p) => p.idPin === terpasang.kePinPeriferal
          )?.labelPin || terpasang.kePinPeriferal;
        errors.push(
          `[SALAH SAMBUNG PIN] Kabel dari "${namaEsp}" ke "${namaPerif}" salah alamat! Hapus kabel tersebut.`
        );
      }
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        "❌ SIMULASI GAGAL MENYALA: Komponen belum ditaruh atau sambungan kaki pin belum lengkap!"
      );
      setOutputSerialSimulasi(
        `[HARDWARE & WIRING ERROR — RANGKAIAN TIDAK MENYALA]\n--------------------------------------------------\n${errors
          .map((e, i) => `${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    if (!/void\s+setup\s*\(\s*\)/.test(kodeBersih)) {
      errors.push("Fungsi utama 'void setup()' hilang atau salah ketik.");
    }
    if (!/void\s+loop\s*\(\s*\)/.test(kodeBersih)) {
      errors.push("Fungsi utama 'void loop()' hilang atau salah ketik.");
    }

    const kurungBuka = (kodeBersih.match(/\{/g) || []).length;
    const kurungTutup = (kodeBersih.match(/\}/g) || []).length;
    if (kurungBuka === 0 || kurungBuka !== kurungTutup) {
      errors.push(
        `Kurung kurawal tidak seimbang: ada ${kurungBuka} '{' tetapi ada ${kurungTutup} '}'.`
      );
    }

    const kurangKw = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeBersih.includes(kw)
    );
    if (kurangKw.length > 0) {
      errors.push(
        `Perintah C++ yang wajib diketik namun belum ada: ${kurangKw
          .map((k) => `"${k}"`)
          .join(", ")}.`
      );
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPesanFeedback(
        `❌ KOMPILASI KODE GAGAL (${errors.length} Kesalahan): Rangkaian fisik sudah benar, tetapi kode C++ Anda masih belum lengkap!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR]\n--------------------------------------------------\n${errors
          .map((e, i) => `${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPesanFeedback(
      `🎉 SEMPURNA! Komponen, sambungan 2 titik pin, dan kodingan C++ Level ${materiAktif.level} Anda 100% BENAR (+${materiAktif.xpReward} XP)!`
    );
    setOutputSerialSimulasi(materiAktif.simulasiOutputJikaBenar);

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  const simulasiAktif = statusVerifikasi === "lulus";
  const sudahLulusLevelIni =
    statusVerifikasi === "lulus" || levelSelesaiSet.has(materiAktif.level);

  const pinEspBerkedipObj = sambunganBerkedipTarget
    ? spekHardware.pinEsp32Tersedia.find(
        (p) => p.idPin === sambunganBerkedipTarget.dariPinEsp32
      )
    : null;
  const pinPerifBerkedipObj = sambunganBerkedipTarget
    ? spekHardware.pinPeriferalTersedia.find(
        (p) => p.idPin === sambunganBerkedipTarget.kePinPeriferal
      )
    : null;

  return (
    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-5">
      {/* HEADER 15 LEVEL + MODE TUTORIAL VS LATIHAN */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
              🎓 LABORATORIUM RAKIT KOMPONEN &amp; TARIK PIN WOKWI (15 LEVEL)
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-[10px]">
              Selesai: {levelSelesaiSet.size} / {KURIKULUM_15_LEVEL_IOT.length} Level
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            Level {materiAktif.level}: {materiAktif.judulMateri}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setModeBelajar("tutorial_berkedip");
              setIntipBayanganSementara(false);
            }}
            className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition ${
              modeBelajar === "tutorial_berkedip"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" /> 1. Mode Tutorial (Ada Bayangan Berkedip)
          </button>

          <button
            type="button"
            onClick={() => {
              setModeBelajar("latihan_mandiri");
              setIntipBayanganSementara(false);
            }}
            className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition ${
              modeBelajar === "latihan_mandiri"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Target className="w-4 h-4" /> 2. Mode Latihan Mandiri (+ Clue)
          </button>
        </div>
      </div>

      {/* DERETAN TOMBOL LEVEL 1 S.D. 15 */}
      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        {KURIKULUM_15_LEVEL_IOT.map((item, idx) => {
          const sedangDibuka = idx === indeksLevel;
          const lulus = levelSelesaiSet.has(item.level);
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => pindahKeLevel(idx)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-1 border ${
                sedangDibuka
                  ? "bg-amber-400 text-slate-950 border-white scale-105 shadow-md"
                  : lulus
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {lulus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              <span>Lv.{item.level}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* LACI GUDANG KOMPONEN ELEKTRONIK (DRAG DARI SINI KE KANVAS!)         */}
      {/* =================================================================== */}
      <div className="bg-slate-950 p-4 rounded-3xl border-2 border-indigo-500/50 space-y-3 shadow-inner">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-black uppercase text-amber-300">
              Gudang Komponen Elektronik (Tarik / Drag Komponen yang Diminta Modul ke Dalam Kanvas di Bawah):
            </span>
          </div>

          <div className="flex items-center gap-2">
            {modeBelajar === "latihan_mandiri" && (
              <button
                type="button"
                onClick={() => {
                  setJumlahClueDibuka((c) =>
                    Math.min(spekHardware.daftarClueLatihan.length, c + 1)
                  );
                  if (jumlahClueDibuka >= 1) setIntipBayanganSementara(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" /> 💡 Butuh Clue? (
                {jumlahClueDibuka}/{spekHardware.daftarClueLatihan.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setEsp32SudahDitaruh(false);
                setPeriferalSudahDitaruh(false);
                setKabelTerpasangList([]);
                setPinAwalDiklik(null);
                setStatusVerifikasi("belum");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              Bersihkan Kanvas
            </button>
          </div>
        </div>

        {/* Kartu-Kartu Komponen di Dalam Gudang yang Bisa Di-Drag */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1">
          {DAFTAR_GUDANG_KOMPONEN_WOKWI.map((item) => {
            const adalahKomponenTargetLevelIni =
              (item.tipeCocok === "esp32_board" && !esp32SudahDitaruh) ||
              (item.tipeCocok === spekHardware.tipeVisualPeriferal &&
                !periferalSudahDitaruh);

            const sudahTerpasangDiKanvas =
              (item.tipeCocok === "esp32_board" && esp32SudahDitaruh) ||
              (item.tipeCocok === spekHardware.tipeVisualPeriferal &&
                periferalSudahDitaruh);

            const sedangTerpilihDrag =
              itemSedangDiDrag?.idItem === item.idItem;

            return (
              <div
                key={item.idItem}
                draggable={!sudahTerpasangDiKanvas}
                onDragStart={() => {
                  setItemSedangDiDrag(item);
                  setPesanGudang(
                    `📦 Menarik '${item.namaTampil}'... Jatuhkan (Drop) ke kotak bayangan yang sesuai di kanvas bawah!`
                  );
                }}
                onClick={() => {
                  if (!sudahTerpasangDiKanvas) handleKlikKartuGudang(item);
                }}
                className={`min-w-[155px] p-3 rounded-2xl border-2 select-none transition flex flex-col justify-between gap-1.5 ${
                  sudahTerpasangDiKanvas
                    ? "bg-emerald-950/40 border-emerald-600/40 opacity-50 cursor-default"
                    : sedangTerpilihDrag
                    ? "bg-amber-400 text-slate-950 border-white scale-105 cursor-grabbing shadow-xl"
                    : tampilkanBayanganPanduan && adalahKomponenTargetLevelIni
                    ? "bg-slate-900 border-amber-400 ring-2 ring-amber-400/50 animate-pulse cursor-grab hover:scale-105"
                    : "bg-slate-900 border-slate-800 hover:border-slate-600 cursor-grab"
                }`}
              >
                <div className="flex justify-between items-center gap-1">
                  <span
                    style={{
                      backgroundColor: sedangTerpilihDrag
                        ? "#0f172a"
                        : item.warnaAksen,
                    }}
                    className="px-2 py-0.5 rounded text-[9px] font-black text-slate-950 uppercase"
                  >
                    {item.kategori}
                  </span>
                  {sudahTerpasangDiKanvas ? (
                    <span className="text-[10px] font-black text-emerald-400">
                      ✓ Di Kanvas
                    </span>
                  ) : (
                    <span className="text-[9.5px] font-bold text-amber-300">
                      ✋ Drag ke Kanvas
                    </span>
                  )}
                </div>

                <div
                  className={`font-black text-xs leading-snug ${
                    sedangTerpilihDrag ? "text-slate-950" : "text-white"
                  }`}
                >
                  {item.namaTampil}
                </div>
              </div>
            );
          })}
        </div>

        {/* Baris Status Interaksi Gudang & Tarikan Kaki Pin */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <MousePointerClick className="w-4 h-4 shrink-0" />
            <span>
              {pesanGudang ||
                (langkahTutorialSaatIni === "taruh_esp32"
                  ? "Langkah 1: Tarik (Drag) kartu 'ESP32 DevKit V1' dari Gudang di atas ke kotak bayangan kuning di sebelah kiri kanvas!"
                  : langkahTutorialSaatIni === "taruh_periferal"
                  ? `Langkah 2: Tarik (Drag) kartu '${spekHardware.namaPeriferal}' dari Gudang di atas ke kotak bayangan biru di sebelah kanan kanvas!`
                  : pinAwalDiklik
                  ? `🔌 Ujung ke-1 [${pinAwalDiklik.labelPin}] sudah diklik! Sekarang KLIK bulatan kaki pin tujuan di komponen seberangnya!`
                  : sambunganBerkedipTarget
                  ? `Langkah 3 (Klik 2 Kaki Pin): ${sambunganBerkedipTarget.keteranganJalur}!`
                  : "✅ Semua Komponen & Kabel Pin Sudah Terpasang! Silakan ketik kode C++ di bawah.")}
            </span>
          </div>

          {pinAwalDiklik && (
            <button
              type="button"
              onClick={() => setPinAwalDiklik(null)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-[10px] cursor-pointer"
            >
              Batalkan Pegangan Kabel (ESC)
            </button>
          )}
        </div>
      </div>

      {/* KOTAK CLUE JIKA DIBUKA */}
      {jumlahClueDibuka > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-400 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-black text-amber-300 uppercase">
              🕵️ Clue Bantuan ({jumlahClueDibuka}/
              {spekHardware.daftarClueLatihan.length}):
            </span>
            <button
              type="button"
              onClick={() => setIntipBayanganSementara(!intipBayanganSementara)}
              className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
            >
              {intipBayanganSementara
                ? "Sembunyikan Bayangan"
                : "👁️ Tampilkan Bayangan Berkedip"}
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-100">
            {spekHardware.daftarClueLatihan
              .slice(0, jumlahClueDibuka)
              .map((c, i) => (
                <li key={i}>{c}</li>
              ))}
          </ul>
        </div>
      )}

      {/* =================================================================== */}
      {/* MEJA KANVAS BREADBOARD WOKWI (DROP ZONE KOMPONEN & KLIK 2 KAKI PIN) */}
      {/* =================================================================== */}
      <div className="bg-[#090d16] rounded-3xl border-2 border-slate-800 p-3 relative overflow-hidden shadow-2xl">
        {/* Banner Petunjuk Rapi di Dalam Kanvas (Tidak Terpotong) */}
        {esp32SudahDitaruh &&
          periferalSudahDitaruh &&
          sambunganBerkedipTarget &&
          tampilkanBayanganPanduan && (
            <div className="mb-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs text-center shadow">
              👆 {sambunganBerkedipTarget.keteranganJalur} (Klik Titik ke-1 lalu Klik Titik ke-2)
            </div>
          )}

        <svg
          ref={svgRef}
          viewBox="0 0 580 250"
          onMouseMove={handleMouseMoveSvg}
          onClick={() => {
            if (pinAwalDiklik) setPinAwalDiklik(null);
          }}
          className="w-full h-64 sm:h-76 select-none"
        >
          {/* Grid Titik Breadboard */}
          {Array.from({ length: 21 }).map((_, gx) =>
            Array.from({ length: 9 }).map((__, gy) => (
              <circle
                key={`${gx}-${gy}`}
                cx={18 + gx * 27}
                cy={18 + gy * 27}
                r={1.6}
                fill="#1e293b"
              />
            ))
          )}

          {/* =============================================================== */}
          {/* ZONA DROP 1 (KIRI): KOTAK BAYANGAN ESP32 ATAU BOARD ESP32 ASLI  */}
          {/* =============================================================== */}
          {!esp32SudahDitaruh ? (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeZonaBayangan("zona_esp32");
              }}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeZonaBayangan("zona_esp32");
                else
                  setPesanGudang(
                    "👆 Tarik (Drag) kartu 'ESP32 DevKit V1' dari Gudang Komponen di atas ke kotak bayangan kuning ini!"
                  );
              }}
              className="cursor-pointer"
            >
              <rect
                x={42}
                y={28}
                width={136}
                height={198}
                rx={14}
                fill="rgba(250, 204, 21, 0.08)"
                stroke="#facc15"
                strokeWidth={2.5}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={110}
                y={112}
                textAnchor="middle"
                fill="#facc15"
                fontSize="10.5"
                fontWeight="bold"
              >
                📦 DROP DI SINI:
              </text>
              <text
                x={110}
                y={130}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >
                ESP32 DevKit V1
              </text>
              <text
                x={110}
                y={148}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8.5"
              >
                (Tarik dari Gudang Komponen)
              </text>
            </g>
          ) : (
            <g>
              {/* PCB ESP32 DevKit V1 dengan Ruang Label Pin yang Jelas & Kontras */}
              <rect
                x={50}
                y={28}
                width={120}
                height={198}
                rx={10}
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth={2}
              />
              {/* Shield Wi-Fi ESP-WROOM-32 diletakkan di tengah agar tidak menabrak teks pin kiri/kanan */}
              <rect
                x={74}
                y={38}
                width={72}
                height={52}
                rx={5}
                fill="#cbd5e1"
                stroke="#475569"
              />
              <text
                x={110}
                y={62}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="8.5"
                fontWeight="bold"
              >
                ESP-WROOM-32
              </text>
              <text
                x={110}
                y={76}
                textAnchor="middle"
                fill="#334155"
                fontSize="7.5"
                fontWeight="bold"
              >
                Wi-Fi + BLE
              </text>

              {/* Port Micro-USB */}
              <rect x={92} y={214} width={36} height={14} rx={3} fill="#94a3b8" />
              <circle
                cx={96}
                cy={196}
                r={4}
                fill={simulasiAktif ? "#22c55e" : "#ef4444"}
              />
              <circle
                cx={124}
                cy={196}
                r={4}
                fill={
                  simulasiAktif && detakSimulasi % 2 === 0
                    ? "#38bdf8"
                    : "#334155"
                }
              />

              {/* Titik Kaki Pin ESP32 (Wajib Diklik sebagai Titik 1 atau Titik 2) */}
              {spekHardware.pinEsp32Tersedia.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  pinEspBerkedipObj?.idPin === pin.idPin;
                const isKanan = pin.x > 110;

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {harusBerkedip && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={13}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="6;15;6"
                          dur="0.85s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* Badge Latar Teks Pin agar Sangat Jelas Terbaca */}
                    <rect
                      x={isKanan ? pin.x - 54 : pin.x + 9}
                      y={pin.y - 7}
                      width={45}
                      height={14}
                      rx={3}
                      fill={harusBerkedip ? "#facc15" : "#0f172a"}
                      opacity={0.92}
                    />
                    <text
                      x={isKanan ? pin.x - 31 : pin.x + 31}
                      y={pin.y + 3}
                      textAnchor="middle"
                      fill={harusBerkedip ? "#0f172a" : "#f8fafc"}
                      fontSize="7.5"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang ? 8.5 : 6}
                      fill={
                        sedangDipegang
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#facc15"
                          : pin.warnaPin
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* =============================================================== */}
          {/* ZONA DROP 2 (KANAN): KOTAK BAYANGAN ATAU KOMPONEN PERIFERAL     */}
          {/* =============================================================== */}
          {!periferalSudahDitaruh ? (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeZonaBayangan("zona_periferal");
              }}
              onClick={() => {
                if (itemSedangDiDrag)
                  handleDropKeZonaBayangan("zona_periferal");
                else
                  setPesanGudang(
                    `👆 Tarik (Drag) kartu '${spekHardware.namaPeriferal}' dari Gudang Komponen di atas ke kotak bayangan biru ini!`
                  );
              }}
              className="cursor-pointer"
            >
              <rect
                x={345}
                y={42}
                width={195}
                height={165}
                rx={16}
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={442}
                y={108}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="10.5"
                fontWeight="bold"
              >
                📦 DROP KOMPONEN DI SINI:
              </text>
              <text
                x={442}
                y={128}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >
                {spekHardware.namaPeriferal}
              </text>
              <text
                x={442}
                y={148}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8.5"
              >
                (Tarik dari Gudang Komponen)
              </text>
            </g>
          ) : (
            <g>
              <GambarPeriferalWokwiAsli
                tipe={spekHardware.tipeVisualPeriferal}
                simulasiHidup={simulasiAktif}
                detak={detakSimulasi}
                nilaiSensorUji={nilaiSensorUji}
              />

              {/* Titik Kaki Pin pada Komponen Periferal */}
              {spekHardware.pinPeriferalTersedia.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  pinPerifBerkedipObj?.idPin === pin.idPin;

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {harusBerkedip && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={14}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="6;15;6"
                          dur="0.85s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <rect
                      x={pin.x - 68}
                      y={pin.y - 22}
                      width={66}
                      height={14}
                      rx={3}
                      fill={harusBerkedip ? "#facc15" : "#0f172a"}
                      opacity={0.92}
                    />
                    <text
                      x={pin.x - 35}
                      y={pin.y - 12}
                      textAnchor="middle"
                      fill={harusBerkedip ? "#0f172a" : "#f8fafc"}
                      fontSize="7.8"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang ? 8.5 : 6.5}
                      fill={
                        sedangDipegang
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#facc15"
                          : pin.warnaPin
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* =============================================================== */}
          {/* GARIS BAYANGAN PANDUAN (TIDAK BISA DIKLIK AGAR WAJIB KLIK 2 PIN)*/}
          {/* =============================================================== */}
          {esp32SudahDitaruh &&
            periferalSudahDitaruh &&
            tampilkanBayanganPanduan &&
            pinEspBerkedipObj &&
            pinPerifBerkedipObj && (
              <path
                pointerEvents="none"
                d={`M ${pinEspBerkedipObj.x} ${pinEspBerkedipObj.y} C ${
                  (pinEspBerkedipObj.x + pinPerifBerkedipObj.x) / 2
                } ${pinEspBerkedipObj.y - 25}, ${
                  (pinEspBerkedipObj.x + pinPerifBerkedipObj.x) / 2
                } ${pinPerifBerkedipObj.y + 25}, ${pinPerifBerkedipObj.x} ${
                  pinPerifBerkedipObj.y
                }`}
                fill="none"
                stroke="#facc15"
                strokeWidth={3.5}
                strokeDasharray="7 6"
                opacity={0.75}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="26"
                  to="0"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}

          {/* =============================================================== */}
          {/* KABEL HIDUP YANG SEDANG MENGIKUTI KURSOR MOUSE SAAT TITIK 1 DIKLIK */}
          {/* =============================================================== */}
          {pinAwalDiklik && (
            <path
              pointerEvents="none"
              d={`M ${pinAwalDiklik.x} ${pinAwalDiklik.y} Q ${
                (pinAwalDiklik.x + posisiKursorSvg.x) / 2
              } ${Math.min(pinAwalDiklik.y, posisiKursorSvg.y) - 20}, ${
                posisiKursorSvg.x
              } ${posisiKursorSvg.y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={4}
              strokeDasharray="4 3"
            />
          )}

          {/* =============================================================== */}
          {/* KABEL JUMPER YANG SUDAH RESMI TERSAMBUNG ANTARA 2 KAKI PIN      */}
          {/* =============================================================== */}
          {kabelTerpasangList.map((k, idx) => {
            const p1 = spekHardware.pinEsp32Tersedia.find(
              (p) => p.idPin === k.dariPinEsp32
            );
            const p2 = spekHardware.pinPeriferalTersedia.find(
              (p) => p.idPin === k.kePinPeriferal
            );
            if (!p1 || !p2) return null;
            const midX = (p1.x + p2.x) / 2;
            return (
              <g key={idx} pointerEvents="none">
                <path
                  d={`M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={k.warna}
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
                {simulasiAktif && (
                  <circle
                    cx={
                      detakSimulasi % 2 === 0
                        ? p1.x + (p2.x - p1.x) * 0.35
                        : p1.x + (p2.x - p1.x) * 0.75
                    }
                    cy={
                      detakSimulasi % 2 === 0
                        ? p1.y + (p2.y - p1.y) * 0.35
                        : p1.y + (p2.y - p1.y) * 0.75
                    }
                    r={4.5}
                    fill="#fef08a"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Daftar Kabel Terpasang di Bawah Kanvas */}
        <div className="mt-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-sky-400 flex items-center gap-1">
              <Cable className="w-4 h-4" /> Kabel Terpasang ({kabelTerpasangList.length}/
              {spekHardware.sambunganWajib.length}):
            </span>
            {kabelTerpasangList.length === 0 ? (
              <span className="text-slate-400">
                Klik titik kaki pin ke-1 lalu klik titik kaki pin ke-2 untuk menyambung kabel!
              </span>
            ) : (
              kabelTerpasangList.map((k, i) => {
                const l1 =
                  spekHardware.pinEsp32Tersedia.find(
                    (p) => p.idPin === k.dariPinEsp32
                  )?.labelPin || k.dariPinEsp32;
                const l2 =
                  spekHardware.pinPeriferalTersedia.find(
                    (p) => p.idPin === k.kePinPeriferal
                  )?.labelPin || k.kePinPeriferal;
                return (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5"
                  >
                    <span>
                      {l1} ➔ {l2}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setKabelTerpasangList((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-rose-400 hover:text-rose-200 font-black cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                );
              })
            )}
          </div>

          {kabelTerpasangList.length > 0 && (
            <button
              type="button"
              onClick={() => setKabelTerpasangList([])}
              className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Lepas Semua Kabel
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN BAWAH: INSTRUKSI MODUL (KIRI) & EDITOR KODE C++ (KANAN)      */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                {materiAktif.badgeLevel}
              </span>
              <span className="font-black text-emerald-400">
                Reward: +{materiAktif.xpReward} XP
              </span>
            </div>

            <p className="text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
              <strong className="text-amber-300">🎯 Tujuan Praktikum:</strong>{" "}
              {materiAktif.tujuanBelajar}
            </p>

            <div className="space-y-1.5">
              <div className="font-black uppercase text-sky-400">
                1. Komponen &amp; Kaki Pin yang Harus Dihubungkan:
              </div>
              {spekHardware.sambunganWajib.map((w, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[11px]"
                >
                  🔌 Jalur #{i + 1}: {w.keteranganJalur}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 2. Instruksi Ketik Kodingan C++:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-white bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40 font-medium leading-relaxed">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            {(modeBelajar === "tutorial_berkedip" || jumlahClueDibuka >= 2) && (
              <div className="space-y-1.5 pt-1">
                <div className="font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Kamus Penjelasan Baris Kode:
                </div>
                {materiAktif.penjelasanBarisKode.map((b, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <code className="text-emerald-400 font-mono font-bold block">
                      {b.potonganKode}
                    </code>
                    <span className="text-slate-300 text-[11px]">
                      ➔ {b.artiPenjelasan}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="font-mono font-black text-amber-300">
                ✍️ Editor C++ — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setKodeKetikanUser(materiAktif.kodeTargetBenar);
                    setPesanGudang(
                      "Contoh kode C++ sudah diisi. Pastikan Anda sudah menarik komponen dari Gudang dan mengklik ke-2 kaki pin di kanvas!"
                    );
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Isi Contoh Kode C++
                </button>
                <button
                  type="button"
                  onClick={() => pindahKeLevel(indeksLevel, modeBelajar)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={kodeKetikanUser}
              onChange={(e) => {
                setKodeKetikanUser(e.target.value);
                if (simulasiAktif) setStatusVerifikasi("belum");
              }}
              spellCheck={false}
              className="w-full p-4 bg-black text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none"
            />

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={periksaRangkaianDanJalankanProgram}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa Rangkaian &amp; Jalankan Program
              </button>

              {indeksLevel < KURIKULUM_15_LEVEL_IOT.length - 1 ? (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() => pindahKeLevel(indeksLevel + 1)}
                  className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl animate-bounce"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {sudahLulusLevelIni ? (
                    <>
                      <span>2. Lanjut ke Level {materiAktif.level + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci (Wajib Benar Dulu)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() => {
                    if (onBukaSimulator10Node) onBukaSimulator10Node();
                  }}
                  className={`py-3 px-4 rounded-xl font-black text-xs ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-1" /> Buka Simulator 10-Node ➔
                </button>
              )}
            </div>
          </div>

          {statusVerifikasi !== "belum" && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-2 ${
                simulasiAktif
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-200"
                  : "bg-rose-950/95 border-rose-500 text-rose-200"
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {simulasiAktif ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{pesanFeedback}</span>
                </div>

                {!simulasiAktif && (
                  <button
                    type="button"
                    onClick={() => {
                      setJumlahClueDibuka((c) =>
                        Math.min(spekHardware.daftarClueLatihan.length, c + 1)
                      );
                      setIntipBayanganSementara(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer shrink-0"
                  >
                    💡 Buka Clue &amp; Bayangan
                  </button>
                )}
              </div>

              {daftarErrorDetail.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-300 bg-black/40 p-3 rounded-xl border border-rose-500/40">
                  {daftarErrorDetail.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="text-[11px] font-black text-amber-400">
              📟 Serial Monitor &amp; Compiler Output (115200 baud):
            </div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputSerialSimulasi}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};