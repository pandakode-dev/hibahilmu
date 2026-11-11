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
  Search,
  Filter,
  Move,
  MousePointerClick,
} from "lucide-react";
import {
  KURIKULUM_15_LEVEL_IOT,
  LessonStepIoT,
} from "./wokwiCurriculumData";
import {
  SPESIFIKASI_HARDWARE_15_LEVEL,
  GUDANG_KOMPONEN_48_MASTER,
  MiniaturSvgGudang48,
  GambarPeriferalWokwiAsli,
  TitikPinFisik,
  ItemGudang48Master,
  KategoriFilterGudang48,
} from "./wokwiHardwareVisuals";

export interface KabelTersambung {
  dariPinEsp32: string;
  kePinPeriferal: string;
  warna: string;
}

const DAFTAR_TAB_FILTER_GUDANG: KategoriFilterGudang48[] = [
  "Semua",
  "Microcontroller",
  "Baterai & Daya",
  "Sensor (25)",
  "Modul Relay",
  "Aktuator & Motor",
  "Pasif & Input",
];

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const kanvasContainerRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const [modeBelajar, setModeBelajar] = useState<
    "tutorial_berkedip" | "latihan_mandiri"
  >("tutorial_berkedip");

  const [filterKategoriGudang, setFilterKategoriGudang] =
    useState<KategoriFilterGudang48>("Semua");
  const [kataCariGudang, setKataCariGudang] = useState<string>("");

  const materiAktif: LessonStepIoT = KURIKULUM_15_LEVEL_IOT[indeksLevel];
  const spekHardware =
    SPESIFIKASI_HARDWARE_15_LEVEL[materiAktif.level] ||
    SPESIFIKASI_HARDWARE_15_LEVEL[1];

  const [esp32SudahDitaruh, setEsp32SudahDitaruh] = useState<boolean>(false);
  const [periferalSudahDitaruh, setPeriferalSudahDitaruh] =
    useState<boolean>(false);
  const [itemSedangDiDrag, setItemSedangDiDrag] =
    useState<ItemGudang48Master | null>(null);
  const [pesanGudang, setPesanGudang] = useState<string>("");

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

  // STATE GETARAN MERAH (RED SHAKE) & PENUNJUK LOKASI SALAH SPESIFIK
  const [getarMerahRangkaian, setGetarMerahRangkaian] =
    useState<boolean>(false);
  const [getarMerahKodingan, setGetarMerahKodingan] = useState<boolean>(false);
  const [pinYangSalahAtauKurangIds, setPinYangSalahAtauKurangIds] = useState<
    string[]
  >([]);
  const [barisKodeSalahList, setBarisKodeSalahList] = useState<
    { nomorBaris: number; pesanBaris: string }[]
  >([]);

  const [jumlahClueDibuka, setJumlahClueDibuka] = useState<number>(0);
  const [intipBayanganSementara, setIntipBayanganSementara] =
    useState<boolean>(false);

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    KURIKULUM_15_LEVEL_IOT[0].kodeTemplateAwal
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// 1. Tarik (Drag) ESP32 & Komponen dari GUDANG KOMPONEN (48 ITEM) ke kotak bayangan di kanvas.\n// 2. Klik kaki pin ke-1 lalu klik kaki pin ke-2 untuk menyambung kabel.\n// 3. Ketik kode C++ dan jalankan!"
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

  const picuGetaranMerahRangkaian = () => {
    setGetarMerahRangkaian(false);
    setTimeout(() => setGetarMerahRangkaian(true), 20);
    setTimeout(() => setGetarMerahRangkaian(false), 900);
    kanvasContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const picuGetaranMerahKodingan = () => {
    setGetarMerahKodingan(false);
    setTimeout(() => setGetarMerahKodingan(true), 20);
    setTimeout(() => setGetarMerahKodingan(false), 900);
    editorContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

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
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setJumlahClueDibuka(0);
    setIntipBayanganSementara(false);
    setKodeKetikanUser(target.kodeTemplateAwal);
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      `// Level ${target.level}: ${target.judulMateri}\n// Cari & tarik komponen dari GUDANG KOMPONEN (48 ITEM) ke kotak bayangan di kanvas!`
    );
  };

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

  const daftarGudangTerfilter = GUDANG_KOMPONEN_48_MASTER.filter((item) => {
    const cocokKategori =
      filterKategoriGudang === "Semua" ||
      item.kategoriFilter === filterKategoriGudang;
    const kw = kataCariGudang.trim().toLowerCase();
    const cocokKata =
      !kw ||
      item.nama.toLowerCase().includes(kw) ||
      item.badgeAtas.toLowerCase().includes(kw);
    return cocokKategori && cocokKata;
  });

  // ==========================================================================
  // 1. HANDLER DRAG & DROP DARI GUDANG 48 ITEM KE KANVAS
  // ==========================================================================
  const handleDropKeZonaBayangan = (
    zonaTarget: "zona_esp32" | "zona_periferal"
  ) => {
    if (!itemSedangDiDrag) return;

    if (zonaTarget === "zona_esp32") {
      if (itemSedangDiDrag.cocokUntukDropZone === "esp32_board") {
        setEsp32SudahDitaruh(true);
        setPinYangSalahAtauKurangIds([]);
        setPesanGudang(
          `✅ Mantap! '${itemSedangDiDrag.nama}' berhasil ditarik dari Gudang 48 Item ke meja breadboard!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          `❌ SALAH KOMPONEN! Kotak kiri khusus untuk 'ESP32 DevKit V1', bukan '${itemSedangDiDrag.nama}'.`
        );
      }
    } else if (zonaTarget === "zona_periferal") {
      const cocokTipe =
        itemSedangDiDrag.cocokUntukDropZone ===
          spekHardware.tipeVisualPeriferal ||
        itemSedangDiDrag.levelTerkait.includes(materiAktif.level);

      if (cocokTipe && itemSedangDiDrag.cocokUntukDropZone !== "esp32_board") {
        setPeriferalSudahDitaruh(true);
        setPinYangSalahAtauKurangIds([]);
        setPesanGudang(
          `✅ Tepat Sekali! Komponen '${itemSedangDiDrag.nama}' berhasil dipasang ke kanvas!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          `❌ SALAH KOMPONEN! Level ${materiAktif.level} membutuhkan '${spekHardware.namaPeriferal}', bukan '${itemSedangDiDrag.nama}'.`
        );
      }
    }
    setItemSedangDiDrag(null);
  };

  const handleKlikKartuGudang = (item: ItemGudang48Master) => {
    setItemSedangDiDrag(item);
    if (item.cocokUntukDropZone === "esp32_board") {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Sekarang tarik atau KLIK kotak bayangan kuning di sebelah kiri kanvas.`
      );
    } else {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Sekarang tarik atau KLIK kotak bayangan biru di sebelah kanan kanvas.`
      );
    }
  };

  // ==========================================================================
  // 2. HANDLER KLIK 2 TITIK KAKI PIN SECARA BERURUTAN
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
      picuGetaranMerahRangkaian();
      setPesanGudang(
        "⚠️ Tarik dan pasang dulu ESP32 serta Komponen dari Gudang Komponen (48 Item) ke kanvas sebelum menyambung kaki pin!"
      );
      return;
    }

    if (!pinAwalDiklik) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 [${pinDiklik.labelPin}] terpegang! Sekarang arahkan kabel dan KLIK titik kaki pin ke-2 pada komponen pasangan!`
      );
      return;
    }

    if (pinAwalDiklik.idPin === pinDiklik.idPin) {
      setPinAwalDiklik(null);
      setPesanGudang("Tarikan kabel dibatalkan.");
      return;
    }

    if (pinAwalDiklik.posisiKomponen === pinDiklik.posisiKomponen) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Titik ke-1 dipindahkan ke [${pinDiklik.labelPin}]. Sekarang klik titik kaki pin pada komponen seberangnya!`
      );
      return;
    }

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
    const warnaKabelBaru = cocokWajib?.warnaKabel || "#ef4444";

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
    setPinYangSalahAtauKurangIds([]);
    setStatusVerifikasi("belum");

    if (!cocokWajib) {
      picuGetaranMerahRangkaian();
      setPinYangSalahAtauKurangIds([idEsp, idPerif]);
      setPesanGudang(
        `❌ SALAH PIN! Sambungan dari ${pinAwalDiklik.labelPin} ke ${pinDiklik.labelPin} tidak sesuai instruksi modul!`
      );
    } else {
      setPesanGudang(
        `✅ Kabel Tepat: ${cocokWajib.keteranganJalur}!`
      );
    }
  };

  // ==========================================================================
  // 3. MESIN VALIDASI KETAT DENGAN GETARAN MERAH & PENUNJUK TITIK/BARIS SALAH
  // ==========================================================================
  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];
    const pinBermasalah: string[] = [];
    const barisBermasalah: { nomorBaris: number; pesanBaris: string }[] = [];

    // A. CEK RANGKAIAN FISIK & PIN KABEL
    if (!esp32SudahDitaruh) {
      errors.push(
        "[LOKASI SALAH: KOTAK KIRI KANVAS] Papan 'ESP32 DevKit V1' belum ditarik dari Gudang Komponen ke kotak bayangan kiri!"
      );
    }
    if (!periferalSudahDitaruh) {
      errors.push(
        `[LOKASI SALAH: KOTAK KANAN KANVAS] Komponen '${spekHardware.namaPeriferal}' belum ditarik dari Gudang Komponen ke kotak bayangan kanan!`
      );
    }

    for (const wajib of spekHardware.sambunganWajib) {
      const sudahAda = kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      );
      if (!sudahAda) {
        errors.push(`[PIN BELUM TERSAMBUNG] ${wajib.keteranganJalur}.`);
        pinBermasalah.push(wajib.dariPinEsp32, wajib.kePinPeriferal);
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
          `[KABEL SALAH ALAMAT] Kabel dari kaki "${namaEsp}" ke "${namaPerif}" salah! Klik tanda ✕ untuk melepasnya.`
        );
        pinBermasalah.push(terpasang.dariPinEsp32, terpasang.kePinPeriferal);
      }
    }

    // JIKA ADA SALAH DI RANGKAIAN -> GETARKAN KANVAS MERAH & SOROT PIN YANG SALAH!
    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds(pinBermasalah);
      setBarisKodeSalahList([]);
      picuGetaranMerahRangkaian();
      setPesanFeedback(
        `🚨 RANGKAIAN SALAH (${errors.length} Titik Masalah): Perhatikan bagian kanvas yang bergetar merah dan lingkaran merah berkedip pada kaki pin di atas!`
      );
      setOutputSerialSimulasi(
        `[HARDWARE WIRING CHECK FAILED]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    // B. CEK KODINGAN C++ BESERTA NOMOR BARIS YANG SALAH
    const barisArray = kodeKetikanUser.split("\n");
    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    // Periksa baris demi baris jika ada perintah yang lupa titik koma (;)
    barisArray.forEach((isiBaris, idx) => {
      const nomor = idx + 1;
      const tanpaKomen = isiBaris.replace(/\/\/.*$/, "").trim();
      if (!tanpaKomen) return;
      const adalahBarisPerintah =
        /^(pinMode|digitalWrite|analogRead|delay|Serial\.|pintu\.|int\s+|float\s+|double\s+|WiFi\.|esp_now_)/.test(
          tanpaKomen
        );
      if (adalahBarisPerintah && !tanpaKomen.endsWith(";")) {
        const msg = `Baris ke-${nomor}: Kurang tanda titik koma (;) di akhir perintah "${tanpaKomen}"`;
        errors.push(msg);
        barisBermasalah.push({ nomorBaris: nomor, pesanBaris: msg });
      }
    });

    if (!/void\s+setup\s*\(\s*\)/.test(kodeBersih)) {
      const msg = "Baris ke-1: Fungsi utama 'void setup()' hilang atau terhapus!";
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: 1, pesanBaris: msg });
    }
    if (!/void\s+loop\s*\(\s*\)/.test(kodeBersih)) {
      const msg = `Baris ke-${barisArray.length}: Fungsi utama 'void loop()' hilang atau terhapus!`;
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: barisArray.length, pesanBaris: msg });
    }

    const kurangKw = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeBersih.includes(kw)
    );
    if (kurangKw.length > 0) {
      // Cari baris komentar petunjuk tempat seharusnya kode diketik
      const idxKomentarPetunjuk = barisArray.findIndex((b) =>
        b.includes("//")
      );
      const targetBaris =
        idxKomentarPetunjuk >= 0 ? idxKomentarPetunjuk + 2 : 4;
      const msg = `Sekitar Baris ke-${targetBaris}: Anda belum mengetik perintah wajib: ${kurangKw
        .map((k) => `"${k}"`)
        .join(", ")}`;
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: targetBaris, pesanBaris: msg });
    }

    // JIKA ADA SALAH DI KODINGAN -> GETARKAN EDITOR KODE MERAH & TUNJUK BARISNYA!
    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds([]);
      setBarisKodeSalahList(barisBermasalah);
      picuGetaranMerahKodingan();
      setPesanFeedback(
        `🚨 KODINGAN C++ MASIH SALAH (${errors.length} Error): Rangkaian kabel sudah benar, tetapi perhatikan kotak Editor Kode yang bergetar merah dan nomor baris yang ditandai di bawah!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR — LOKASI BARIS DITEMUKAN]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    // C. SEMUA BENAR!
    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setPesanFeedback(
      `🎉 100% BENAR! Rangkaian komponen, tarikan 2 kaki pin, dan kodingan C++ Level ${materiAktif.level} berhasil dijalankan (+${materiAktif.xpReward} XP)!`
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

  const daftarBarisEditor = kodeKetikanUser.split("\n");

  return (
    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/60 shadow-2xl space-y-5">
      {/* ANIMASI CSS KEYFRAMES GETARAN MERAH (RED ERROR SHAKE) */}
      <style>{`
        @keyframes errorShakeRed {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-10px); }
          30%, 60%, 90% { transform: translateX(10px); }
        }
        .animate-error-shake {
          animation: errorShakeRed 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          box-shadow: 0 0 35px rgba(244, 63, 94, 0.85) !important;
          border-color: #f43f5e !important;
        }
      `}</style>

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
      {/* GUDANG KOMPONEN (48 ITEM) PERSIS DATABASE STUDIO WOKWI UTAMA        */}
      {/* =================================================================== */}
      <div className="bg-[#0b101e] p-5 rounded-3xl border-2 border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-amber-400">
              GUDANG KOMPONEN ({GUDANG_KOMPONEN_48_MASTER.length} ITEM):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64 sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari NPK, Pompa, RFID, Keypad, PIR,"
                value={kataCariGudang}
                onChange={(e) => setKataCariGudang(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

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
                <HelpCircle className="w-3.5 h-3.5" /> 💡 Clue ({jumlahClueDibuka}/
                {spekHardware.daftarClueLatihan.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setEsp32SudahDitaruh(false);
                setPeriferalSudahDitaruh(false);
                setKabelTerpasangList([]);
                setPinAwalDiklik(null);
                setPinYangSalahAtauKurangIds([]);
                setStatusVerifikasi("belum");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              Bersihkan Kanvas
            </button>
          </div>
        </div>

        {/* Baris Tab Filter Kategori Gudang 48 Item */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-400 mr-1" />
          {DAFTAR_TAB_FILTER_GUDANG.map((kat) => {
            const aktif = filterKategoriGudang === kat;
            return (
              <button
                key={kat}
                type="button"
                onClick={() => setFilterKategoriGudang(kat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  aktif
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {kat}
              </button>
            );
          })}
        </div>

        {/* Grid 10 Kolom Kartu Gudang Komponen (48 Item) Persis Screenshot Studio Wokwi */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-56 overflow-y-auto pr-1 pt-1">
          {daftarGudangTerfilter.map((item) => {
            const dibutuhkanEsp32 =
              item.cocokUntukDropZone === "esp32_board" && !esp32SudahDitaruh;
            const dibutuhkanPeriferal =
              item.cocokUntukDropZone !== "esp32_board" &&
              (item.cocokUntukDropZone === spekHardware.tipeVisualPeriferal ||
                item.levelTerkait.includes(materiAktif.level)) &&
              !periferalSudahDitaruh;

            const harusDisorotBerkedip =
              tampilkanBayanganPanduan &&
              (dibutuhkanEsp32 || (esp32SudahDitaruh && dibutuhkanPeriferal));

            const sedangTerpilihDrag = itemSedangDiDrag?.id === item.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => {
                  setItemSedangDiDrag(item);
                  setPesanGudang(
                    `📦 Menarik '${item.nama}' (${item.jumlahPinLabel})... Jatuhkan (Drop) ke kotak bayangan di kanvas bawah!`
                  );
                }}
                onClick={() => handleKlikKartuGudang(item)}
                className={`p-2.5 rounded-2xl border-2 select-none transition flex flex-col justify-between gap-1.5 cursor-grab active:cursor-grabbing ${
                  sedangTerpilihDrag
                    ? "bg-amber-400/20 border-amber-300 scale-105 shadow-xl"
                    : harusDisorotBerkedip
                    ? "bg-[#111827] border-amber-400 ring-2 ring-amber-400/60 animate-pulse"
                    : "bg-[#111827] border-slate-800 hover:border-indigo-500/60"
                }`}
              >
                <div className="flex justify-between items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded-md">
                  <span className="text-[8px] font-black uppercase text-indigo-400 truncate">
                    {item.badgeAtas}
                  </span>
                  <span className="text-[8px] font-black uppercase text-amber-400 shrink-0">
                    {item.jumlahPinLabel}
                  </span>
                </div>

                <div className="py-0.5">
                  <MiniaturSvgGudang48 idItem={item.id} />
                </div>

                <div className="text-[10px] font-bold text-white leading-tight truncate text-center">
                  {item.nama}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MEJA KANVAS BREADBOARD WOKWI (BERGETAR MERAH JIKA RANGKAIAN SALAH!) */}
      {/* =================================================================== */}
      <div
        ref={kanvasContainerRef}
        className={`bg-[#090d16] rounded-3xl border-2 p-3 relative overflow-hidden shadow-2xl transition ${
          getarMerahRangkaian
            ? "animate-error-shake border-rose-500 bg-rose-950/20"
            : statusVerifikasi === "gagal_rangkaian"
            ? "border-rose-500"
            : simulasiAktif
            ? "border-emerald-400"
            : "border-slate-800"
        }`}
      >
        {/* Banner Lokasi Kesalahan Rangkaian di Atas Kanvas */}
        {statusVerifikasi === "gagal_rangkaian" && (
          <div className="mb-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-between gap-2 animate-pulse">
            <span>
              🚨 KESALAHAN DI MEJA RANGKAIAN INI: {daftarErrorDetail[0]}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/30 text-[10px]">
              Lihat Lingkaran Merah Berkedip di Bawah 👇
            </span>
          </div>
        )}

        {esp32SudahDitaruh &&
          periferalSudahDitaruh &&
          sambunganBerkedipTarget &&
          tampilkanBayanganPanduan &&
          statusVerifikasi !== "gagal_rangkaian" && (
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

          {/* ZONA DROP 1 (KIRI): KOTAK BAYANGAN ESP32 ATAU BOARD ESP32 ASLI */}
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
                    "👆 Tarik (Drag) kartu 'ESP32 DevKit V1 (30P)' dari Gudang Komponen di atas ke kotak bayangan kiri ini!"
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
                fill={
                  statusVerifikasi === "gagal_rangkaian"
                    ? "rgba(244, 63, 94, 0.22)"
                    : "rgba(250, 204, 21, 0.08)"
                }
                stroke={
                  statusVerifikasi === "gagal_rangkaian" ? "#f43f5e" : "#facc15"
                }
                strokeWidth={3}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={110}
                y={108}
                textAnchor="middle"
                fill={
                  statusVerifikasi === "gagal_rangkaian" ? "#fda4af" : "#facc15"
                }
                fontSize="10.5"
                fontWeight="bold"
              >
                {statusVerifikasi === "gagal_rangkaian"
                  ? "❌ BELUM DITARUH!"
                  : "📦 DROP DI SINI:"}
              </text>
              <text
                x={110}
                y={128}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >
                ESP32 DevKit V1
              </text>
            </g>
          ) : (
            <g>
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

              <rect x={92} y={214} width={36} height={14} rx={3} fill="#94a3b8" />

              {spekHardware.pinEsp32Tersedia.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  pinEspBerkedipObj?.idPin === pin.idPin;
                const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                  pin.idPin
                );
                const isKanan = pin.x > 110;

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {/* LINGKARAN BIDIK MERAH BERKEDIP JIKA PIN INI SALAH / BELUM DISAMBUNG */}
                    {adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={16}
                        fill="rgba(244, 63, 94, 0.35)"
                        stroke="#f43f5e"
                        strokeWidth={3.5}
                      >
                        <animate
                          attributeName="r"
                          values="7;18;7"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {harusBerkedip && !adalahPinSalah && (
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

                    <rect
                      x={isKanan ? pin.x - 54 : pin.x + 9}
                      y={pin.y - 7}
                      width={45}
                      height={14}
                      rx={3}
                      fill={
                        adalahPinSalah
                          ? "#e11d48"
                          : harusBerkedip
                          ? "#facc15"
                          : "#0f172a"
                      }
                      opacity={0.95}
                    />
                    <text
                      x={isKanan ? pin.x - 31 : pin.x + 31}
                      y={pin.y + 3}
                      textAnchor="middle"
                      fill={
                        adalahPinSalah
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#0f172a"
                          : "#f8fafc"
                      }
                      fontSize="7.5"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang || adalahPinSalah ? 8.5 : 6}
                      fill={
                        adalahPinSalah
                          ? "#f43f5e"
                          : sedangDipegang
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

          {/* ZONA DROP 2 (KANAN): KOTAK BAYANGAN ATAU KOMPONEN PERIFERAL */}
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
                    `👆 Tarik (Drag) kartu '${spekHardware.namaPeriferal}' dari Gudang Komponen di atas ke kotak bayangan kanan ini!`
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
                fill={
                  statusVerifikasi === "gagal_rangkaian"
                    ? "rgba(244, 63, 94, 0.22)"
                    : "rgba(56, 189, 248, 0.08)"
                }
                stroke={
                  statusVerifikasi === "gagal_rangkaian" ? "#f43f5e" : "#38bdf8"
                }
                strokeWidth={3}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={442}
                y={108}
                textAnchor="middle"
                fill={
                  statusVerifikasi === "gagal_rangkaian" ? "#fda4af" : "#38bdf8"
                }
                fontSize="10.5"
                fontWeight="bold"
              >
                {statusVerifikasi === "gagal_rangkaian"
                  ? "❌ KOMPONEN BELUM DITARUH!"
                  : "📦 DROP KOMPONEN DI SINI:"}
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
            </g>
          ) : (
            <g>
              <GambarPeriferalWokwiAsli
                tipe={spekHardware.tipeVisualPeriferal}
                simulasiHidup={simulasiAktif}
                detak={detakSimulasi}
                nilaiSensorUji={nilaiSensorUji}
              />

              {spekHardware.pinPeriferalTersedia.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  pinPerifBerkedipObj?.idPin === pin.idPin;
                const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                  pin.idPin
                );

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={16}
                        fill="rgba(244, 63, 94, 0.35)"
                        stroke="#f43f5e"
                        strokeWidth={3.5}
                      >
                        <animate
                          attributeName="r"
                          values="7;18;7"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {harusBerkedip && !adalahPinSalah && (
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
                      fill={
                        adalahPinSalah
                          ? "#e11d48"
                          : harusBerkedip
                          ? "#facc15"
                          : "#0f172a"
                      }
                      opacity={0.95}
                    />
                    <text
                      x={pin.x - 35}
                      y={pin.y - 12}
                      textAnchor="middle"
                      fill={
                        adalahPinSalah
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#0f172a"
                          : "#f8fafc"
                      }
                      fontSize="7.8"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang || adalahPinSalah ? 8.5 : 6.5}
                      fill={
                        adalahPinSalah
                          ? "#f43f5e"
                          : sedangDipegang
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

          {/* GARIS BAYANGAN PANDUAN */}
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

          {/* KABEL HIDUP MENGIKUTI MOUSE */}
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

          {/* KABEL JUMPER YANG SUDAH TERSAMBUNG */}
          {kabelTerpasangList.map((k, idx) => {
            const p1 = spekHardware.pinEsp32Tersedia.find(
              (p) => p.idPin === k.dariPinEsp32
            );
            const p2 = spekHardware.pinPeriferalTersedia.find(
              (p) => p.idPin === k.kePinPeriferal
            );
            if (!p1 || !p2) return null;
            const midX = (p1.x + p2.x) / 2;
            const adalahKabelValid = spekHardware.sambunganWajib.some(
              (w) =>
                w.dariPinEsp32 === k.dariPinEsp32 &&
                w.kePinPeriferal === k.kePinPeriferal
            );

            return (
              <g key={idx} pointerEvents="none">
                <path
                  d={`M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={adalahKabelValid ? k.warna : "#f43f5e"}
                  strokeWidth={4.5}
                  strokeDasharray={adalahKabelValid ? "none" : "6 4"}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        <div className="mt-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-sky-400 flex items-center gap-1">
              <Cable className="w-4 h-4" /> Kabel Terpasang ({kabelTerpasangList.length}/
              {spekHardware.sambunganWajib.length}):
            </span>
            {kabelTerpasangList.map((k, i) => {
              const l1 =
                spekHardware.pinEsp32Tersedia.find(
                  (p) => p.idPin === k.dariPinEsp32
                )?.labelPin || k.dariPinEsp32;
              const l2 =
                spekHardware.pinPeriferalTersedia.find(
                  (p) => p.idPin === k.kePinPeriferal
                )?.labelPin || k.kePinPeriferal;
              const valid = spekHardware.sambunganWajib.some(
                (w) =>
                  w.dariPinEsp32 === k.dariPinEsp32 &&
                  w.kePinPeriferal === k.kePinPeriferal
              );
              return (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 ${
                    valid
                      ? "bg-slate-950 border-emerald-500/50 text-emerald-300"
                      : "bg-rose-950 border-rose-500 text-rose-200 animate-pulse"
                  }`}
                >
                  <span>
                    {valid ? "✓" : "❌ SALAH:"} {l1} ➔ {l2}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setKabelTerpasangList((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                    className="text-rose-400 hover:text-white font-black cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN BAWAH: INSTRUKSI (KIRI) & EDITOR KODE BERGETAR MERAH (KANAN) */}
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
                1. Kaki Pin yang Harus Diklik &amp; Dihubungkan:
              </div>
              {spekHardware.sambunganWajib.map((w, i) => {
                const sudah = kabelTerpasangList.some(
                  (k) =>
                    k.dariPinEsp32 === w.dariPinEsp32 &&
                    k.kePinPeriferal === w.kePinPeriferal
                );
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border font-mono text-[11px] flex justify-between items-center ${
                      sudah
                        ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                        : statusVerifikasi === "gagal_rangkaian"
                        ? "bg-rose-950/60 border-rose-500 text-rose-200"
                        : "bg-slate-900 border-slate-800 text-amber-300"
                    }`}
                  >
                    <span>
                      {sudah ? "✅" : "🔌"} Jalur #{i + 1}: {w.keteranganJalur}
                    </span>
                    <span className="text-[10px] font-black">
                      {sudah ? "TERSAMBUNG" : "BELUM"}
                    </span>
                  </div>
                );
              })}
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
          </div>
        </div>

        {/* KOLOM KANAN: EDITOR KODE DENGAN PENUNJUK BARIS MERAH & GETARAN SAAT SALAH */}
        <div ref={editorContainerRef} className="lg:col-span-6 space-y-4">
          <div
            className={`bg-slate-950 rounded-2xl border-2 overflow-hidden shadow-xl transition ${
              getarMerahKodingan
                ? "animate-error-shake border-rose-500"
                : statusVerifikasi === "gagal_kode"
                ? "border-rose-500"
                : simulasiAktif
                ? "border-emerald-400"
                : "border-slate-800"
            }`}
          >
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="font-mono font-black text-amber-300">
                ✍️ Editor C++ — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setKodeKetikanUser(materiAktif.kodeTargetBenar);
                    setBarisKodeSalahList([]);
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

            {/* Banner Merah Penunjuk Baris Kode yang Salah */}
            {barisKodeSalahList.length > 0 && (
              <div className="bg-rose-950 border-b border-rose-500 px-4 py-2.5 text-xs space-y-1">
                <div className="font-black text-rose-300 uppercase">
                  🚨 LOKASI KESALAHAN KODINGAN C++ DITEMUKAN:
                </div>
                {barisKodeSalahList.map((b, i) => (
                  <div key={i} className="text-white font-mono text-[11px]">
                    👉 <strong>Baris #{b.nomorBaris}:</strong> {b.pesanBaris}
                  </div>
                ))}
              </div>
            )}

            {/* Editor dengan Kolom Nomor Baris di Sisi Kiri (Menyala Merah pada Baris yang Error!) */}
            <div className="grid grid-cols-12 bg-black font-mono text-xs sm:text-sm">
              <div className="col-span-1 py-4 bg-slate-950 border-r border-slate-800 text-right pr-2 select-none space-y-[2px]">
                {daftarBarisEditor.map((_, idx) => {
                  const noBaris = idx + 1;
                  const barisIniError = barisKodeSalahList.some(
                    (b) => b.nomorBaris === noBaris
                  );
                  return (
                    <div
                      key={noBaris}
                      className={`leading-relaxed px-1 rounded ${
                        barisIniError
                          ? "bg-rose-600 text-white font-black animate-pulse"
                          : "text-slate-600"
                      }`}
                    >
                      {noBaris}
                    </div>
                  );
                })}
              </div>
              <textarea
                rows={Math.max(11, daftarBarisEditor.length)}
                value={kodeKetikanUser}
                onChange={(e) => {
                  setKodeKetikanUser(e.target.value);
                  setBarisKodeSalahList([]);
                  if (simulasiAktif) setStatusVerifikasi("belum");
                }}
                spellCheck={false}
                className="col-span-11 p-4 bg-black text-emerald-300 font-mono leading-relaxed focus:outline-none resize-y"
              />
            </div>

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
                      <span>Terkunci</span>
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