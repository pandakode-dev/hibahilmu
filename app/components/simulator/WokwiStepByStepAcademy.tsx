"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Play,
  Sparkles,
  Code2,
  RotateCcw,
  Award,
  Lock,
  Eye,
  Target,
  Search,
  Filter,
  Move,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { KURIKULUM_15_LEVEL_IOT } from "./wokwiCurriculumData";
import {
  GUDANG_KOMPONEN_48_MASTER,
  MiniaturSvgGudang48,
  TitikPinFisik,
  ItemGudang48Master,
  KategoriFilterGudang48,
  ParameterFisikaInteraktif,
} from "./wokwiHardwareVisuals";
import {
  KategoriKesulitanAcademy,
  ExtendedLessonStepIoT,
  ambilBlueprintMultiPinRealistis,
  apakahKartuGudangValidUntukSlot,
  dapatkanBabDariLevel,
  hitungGelangResistorModular,
} from "./wokwiAcademyBlueprints";
import { WokwiTheoryModal } from "./WokwiTheoryModal";
import {
  WokwiMultiSlotCanvas,
  KabelMultiPinTersambung,
} from "./WokwiMultiSlotCanvas";

const DAFTAR_BAB_SILABUS: {
  id: KategoriKesulitanAcademy;
  label: string;
  rentang: string;
  warna: string;
}[] = [
  { id: "Semua", label: "📚 Semua Modul", rentang: "Semua Level", warna: "bg-indigo-600 text-white" },
  {
    id: "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)",
    label: "🌱 Bab 1: Dasar 1-ESP32",
    rentang: "Lv. 1–3",
    warna: "bg-sky-600 text-white",
  },
  {
    id: "Bab 2: Output LED Tunggal & Lampu Lalu Lintas",
    label: "💡 Bab 2: Output & Lalu Lintas",
    rentang: "Lv. 4–6",
    warna: "bg-emerald-600 text-white",
  },
  {
    id: "Bab 3: Digital/Analog Input & External Interrupt",
    label: "⚡ Bab 3: Input & Interrupt",
    rentang: "Lv. 7–9",
    warna: "bg-amber-400 text-slate-950",
  },
  {
    id: "Bab 4: Sensor, Aktuator & Otomasi Cerdas",
    label: "🔥 Bab 4: Sensor & Otomasi",
    rentang: "Lv. 10–12",
    warna: "bg-rose-600 text-white",
  },
  {
    id: "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh",
    label: "🏆 Bab 5: NPK, GPS & 10-Node Mesh",
    rentang: "Lv. 13+",
    warna: "bg-purple-600 text-white",
  },
];

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
  const kanvasContainerRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [kategoriLevelAktif, setKategoriLevelAktif] =
    useState<KategoriKesulitanAcademy>("Semua");
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  const [tampilModalTeori, setTampilModalTeori] = useState<boolean>(true);
  const [modeBelajar, setModeBelajar] = useState<
    "tutorial_berkedip" | "latihan_mandiri"
  >("tutorial_berkedip");

  const [filterKategoriGudang, setFilterKategoriGudang] =
    useState<KategoriFilterGudang48>("Semua");
  const [kataCariGudang, setKataCariGudang] = useState<string>("");

  const daftarKurikulumExtended =
    KURIKULUM_15_LEVEL_IOT as ExtendedLessonStepIoT[];
  const materiAktif: ExtendedLessonStepIoT =
    daftarKurikulumExtended[indeksLevel] || daftarKurikulumExtended[0];

  const blueprintLevelIni = ambilBlueprintMultiPinRealistis(materiAktif);
  const daftarSlotPeriferal = blueprintLevelIni.slotPeriferalList;
  const semuaSambunganWajibLevelIni = blueprintLevelIni.sambunganWajibList;
  const totalKomponenWajib = 1 + daftarSlotPeriferal.length;

  const bersihkanKeHibahIlmu = (teks: string) =>
    (teks || "").replace(/Wokwi-GUEST/g, "HibahIlmu-Guest");

  const [slot1Esp32Terpasang, setSlot1Esp32Terpasang] =
    useState<boolean>(false);
  const [slotPeriferalTerpasangMap, setSlotPeriferalTerpasangMap] = useState<
    Record<number, { terpasang: boolean; namaKartu: string; idKartu: string }>
  >({});

  const [itemSedangDiDrag, setItemSedangDiDrag] =
    useState<ItemGudang48Master | null>(null);
  const [pesanGudang, setPesanGudang] = useState<string>("");

  const [kabelTerpasangList, setKabelTerpasangList] = useState<
    KabelMultiPinTersambung[]
  >([]);
  const [pinAwalDiklik, setPinAwalDiklik] = useState<TitikPinFisik | null>(
    null
  );
  const [posisiKursorSvg, setPosisiKursorSvg] = useState<{
    x: number;
    y: number;
  }>({ x: 280, y: 120 });

  const [fisika, setFisika] = useState<ParameterFisikaInteraktif>({
    pwmLedBrightness: 255,
    nilaiOhmResistor: 220,
    luxCahaya: 180,
    suhuCelcius: 36.5,
    jarakUltrasonikCm: 25,
    pirAdaOrang: true,
    rfidKartuDekat: true,
    kadarGasPpm: 680,
    apiTerdeteksi: true,
    rpmKipas: 1200,
    debitPompaAir: true,
    sudutServo: 90,
  });

  const [getarMerahRangkaian, setGetarMerahRangkaian] =
    useState<boolean>(false);
  const [getarMerahKodingan, setGetarMerahKodingan] = useState<boolean>(false);
  const [pinYangSalahAtauKurangIds, setPinYangSalahAtauKurangIds] = useState<
    string[]
  >([]);
  const [barisKodeSalahList, setBarisKodeSalahList] = useState<
    { nomorBaris: number; pesanBaris: string }[]
  >([]);

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    bersihkanKeHibahIlmu(daftarKurikulumExtended[0].kodeTemplateAwal)
  );
  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// Rakit setiap komponen satu per satu ke slotnya di kanvas, sambungkan SEMUA kaki pinnya, lalu jalankan program!"
  );

  const [detakSimulasi, setDetakSimulasi] = useState<number>(0);

  useEffect(() => {
    if (statusVerifikasi !== "lulus") return;
    const timer = setInterval(() => {
      setDetakSimulasi((d) => d + 1);
    }, 550);
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
    modeTarget: "tutorial_berkedip" | "latihan_mandiri" = modeBelajar,
    bukaPopUpTeori: boolean = true
  ) => {
    const target = daftarKurikulumExtended[idxBaru];
    if (!target) return;
    const bp = ambilBlueprintMultiPinRealistis(target);

    setIndeksLevel(idxBaru);
    setModeBelajar(modeTarget);
    setTampilModalTeori(bukaPopUpTeori);
    setSlot1Esp32Terpasang(false);
    setSlotPeriferalTerpasangMap({});
    setItemSedangDiDrag(null);
    setPesanGudang("");
    setKabelTerpasangList([]);
    setPinAwalDiklik(null);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setKodeKetikanUser(bersihkanKeHibahIlmu(target.kodeTemplateAwal));
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setOutputSerialSimulasi(
      `// Level ${target.level}: Wajib menarik ${
        1 + bp.slotPeriferalList.length
      } komponen secara bertahap dan menyambungkan seluruh ${
        bp.sambunganWajibList.length
      } kaki pinnya!`
    );
  };

  const jumlahPeriferalSudahTerpasang = daftarSlotPeriferal.filter(
    (s) => slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
  ).length;
  const jumlahKomponenTerpasangSaatIni =
    (slot1Esp32Terpasang ? 1 : 0) + jumlahPeriferalSudahTerpasang;

  const semuaKomponenSudahDitaruh =
    slot1Esp32Terpasang &&
    daftarSlotPeriferal.every(
      (s) => slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
    );

  const slotPeriferalKosongBerikutnya =
    daftarSlotPeriferal.find(
      (s) => !slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
    ) || null;

  const apakahKabelSudahAda = (wPin1: string, wPin2: string) =>
    kabelTerpasangList.some(
      (k) =>
        (k.pinAsalId === wPin1 && k.pinTujuanId === wPin2) ||
        (k.pinAsalId === wPin2 && k.pinTujuanId === wPin1)
    );

  const sambunganWajibBelumTerpasang = semuaSambunganWajibLevelIni.filter(
    (w) => !apakahKabelSudahAda(w.pinAsalId, w.pinTujuanId)
  );

  const sambunganBerkedipTarget = sambunganWajibBelumTerpasang[0] || null;
  const tampilkanBayanganPanduan = modeBelajar === "tutorial_berkedip";

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

  // VALIDASI KETAT SAAT DROP KOMPONEN (OLED TIDAK AKAN BISA MASUK KE SLOT LED!)
  const handleDropKeSlotTertentu = (nomorSlotTarget: number) => {
    if (!itemSedangDiDrag) return;

    if (nomorSlotTarget === 1) {
      if (itemSedangDiDrag.cocokUntukDropZone === "esp32_board") {
        setSlot1Esp32Terpasang(true);
        setPinYangSalahAtauKurangIds([]);
        const nextSlot = daftarSlotPeriferal[0];
        setPesanGudang(
          nextSlot
            ? `✅ Slot #1 ('${itemSedangDiDrag.nama}') terpasang! Sekarang tarik '${nextSlot.namaTarget}' ke Slot #2!`
            : `✅ '${itemSedangDiDrag.nama}' terpasang di Slot #1!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          `❌ Ditolak! Slot #1 khusus untuk 'ESP32 DevKit V1', bukan '${itemSedangDiDrag.nama}'.`
        );
      }
      setItemSedangDiDrag(null);
      return;
    }

    const defSlot = daftarSlotPeriferal.find(
      (s) => s.nomorSlot === nomorSlotTarget
    );
    if (!defSlot) return;

    const apakahCocok = apakahKartuGudangValidUntukSlot(
      itemSedangDiDrag,
      defSlot
    );

    if (apakahCocok) {
      setSlotPeriferalTerpasangMap((prev) => ({
        ...prev,
        [nomorSlotTarget]: {
          terpasang: true,
          namaKartu: itemSedangDiDrag.nama,
          idKartu: itemSedangDiDrag.id,
        },
      }));
      setPinYangSalahAtauKurangIds([]);

      const sisaKosong = daftarSlotPeriferal.filter(
        (s) =>
          s.nomorSlot !== nomorSlotTarget &&
          !slotPeriferalTerpasangMap[s.nomorSlot]?.terpasang
      );
      if (sisaKosong.length > 0) {
        setPesanGudang(
          `✅ Slot #${nomorSlotTarget} ('${itemSedangDiDrag.nama}') terpasang! Lanjut tarik '${sisaKosong[0].namaTarget}' ke Slot #${sisaKosong[0].nomorSlot}!`
        );
      } else {
        setPesanGudang(
          `🎉 Seluruh ${totalKomponenWajib} Komponen terpasang! Sekarang hubungkan SEMUA kaki pin (${semuaSambunganWajibLevelIni.length} kabel)!`
        );
      }
    } else {
      picuGetaranMerahRangkaian();
      setPesanGudang(
        `❌ Komponen Ditolak! Slot #${nomorSlotTarget} hanya menerima '${defSlot.namaTarget}', tidak bisa diisi dengan '${itemSedangDiDrag.nama}'!`
      );
    }
    setItemSedangDiDrag(null);
  };

  const handleKlikTitikPinFisik = (
    e: React.MouseEvent,
    pinDiklik: TitikPinFisik
  ) => {
    e.stopPropagation();

    if (!semuaKomponenSudahDitaruh) {
      picuGetaranMerahRangkaian();
      setPesanGudang(
        `⚠️ Tarik dulu seluruh ${totalKomponenWajib} komponen ke kanvas sebelum menyambung kaki pin!`
      );
      return;
    }

    if (!pinAwalDiklik) {
      setPinAwalDiklik(pinDiklik);
      setPosisiKursorSvg({ x: pinDiklik.x, y: pinDiklik.y });
      setPesanGudang(
        `🔌 Kaki 1 [${pinDiklik.labelPin}] terpegang! Sekarang arahkan kabel dan KLIK kaki pasangannya!`
      );
      return;
    }

    if (pinAwalDiklik.idPin === pinDiklik.idPin) {
      setPinAwalDiklik(null);
      return;
    }

    const cocokWajib = semuaSambunganWajibLevelIni.find(
      (w) =>
        (w.pinAsalId === pinAwalDiklik.idPin &&
          w.pinTujuanId === pinDiklik.idPin) ||
        (w.pinAsalId === pinDiklik.idPin &&
          w.pinTujuanId === pinAwalDiklik.idPin)
    );

    const warnaBaru = cocokWajib?.warnaKabel || "#ef4444";

    setKabelTerpasangList((prev) => [
      ...prev.filter(
        (k) =>
          !(
            (k.pinAsalId === pinAwalDiklik.idPin &&
              k.pinTujuanId === pinDiklik.idPin) ||
            (k.pinAsalId === pinDiklik.idPin &&
              k.pinTujuanId === pinAwalDiklik.idPin)
          )
      ),
      {
        pinAsalId: pinAwalDiklik.idPin,
        pinTujuanId: pinDiklik.idPin,
        warna: warnaBaru,
      },
    ]);

    setPinAwalDiklik(null);
    setPinYangSalahAtauKurangIds([]);
    setStatusVerifikasi("belum");

    if (!cocokWajib) {
      picuGetaranMerahRangkaian();
      setPinYangSalahAtauKurangIds([pinAwalDiklik.idPin, pinDiklik.idPin]);
      setPesanGudang(
        `❌ Salah Sambung Kaki! Kabel dari [${pinAwalDiklik.labelPin}] ke [${pinDiklik.labelPin}] salah. Klik tanda ✕ pada kabel merah tersebut untuk menghapusnya!`
      );
    } else {
      setPesanGudang(`✅ Tersambung: ${cocokWajib.keteranganJalur}!`);
    }
  };

  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];
    const pinBermasalah: string[] = [];
    const barisBermasalah: { nomorBaris: number; pesanBaris: string }[] = [];

    if (!slot1Esp32Terpasang) {
      errors.push("[SLOT #1 KOSONG] Tarik 'ESP32 DevKit V1' ke Slot #1!");
    }
    for (const slot of daftarSlotPeriferal) {
      if (!slotPeriferalTerpasangMap[slot.nomorSlot]?.terpasang) {
        errors.push(
          `[SLOT #${slot.nomorSlot} KOSONG] Tarik '${slot.namaTarget}' ke Slot #${slot.nomorSlot}!`
        );
      }
    }

    for (const wajib of semuaSambunganWajibLevelIni) {
      if (!apakahKabelSudahAda(wajib.pinAsalId, wajib.pinTujuanId)) {
        errors.push(`[KAKI PIN BELUM DISAMBUNG] ${wajib.keteranganJalur}`);
        pinBermasalah.push(wajib.pinAsalId, wajib.pinTujuanId);
      }
    }

    // Cek jika ada kabel merah (salah pasang) yang belum dihapus
    for (const terpasang of kabelTerpasangList) {
      const valid = semuaSambunganWajibLevelIni.some(
        (w) =>
          (w.pinAsalId === terpasang.pinAsalId &&
            w.pinTujuanId === terpasang.pinTujuanId) ||
          (w.pinAsalId === terpasang.pinTujuanId &&
            w.pinTujuanId === terpasang.pinAsalId)
      );
      if (!valid) {
        errors.push(
          `[ADA KABEL SALAH] Hapus dulu kabel yang salah (garis merah putus-putus) dengan mengklik tombol ✕ pada kabel tersebut!`
        );
        pinBermasalah.push(terpasang.pinAsalId, terpasang.pinTujuanId);
      }
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds(pinBermasalah);
      setBarisKodeSalahList([]);
      picuGetaranMerahRangkaian();
      setOutputSerialSimulasi(
        `[HARDWARE MULTI-PIN WIRING ERROR]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    const kurangKw = materiAktif.kataKunciWajibAda.filter(
      (kw) => !kodeBersih.includes(kw)
    );
    if (kurangKw.length > 0) {
      const msg = `Perintah wajib yang belum diketik: ${kurangKw
        .map((k) => `"${k}"`)
        .join(", ")}`;
      errors.push(msg);
      barisBermasalah.push({ nomorBaris: 4, pesanBaris: msg });
    }

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setBarisKodeSalahList(barisBermasalah);
      picuGetaranMerahKodingan();
      return;
    }

    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setOutputSerialSimulasi(
      bersihkanKeHibahIlmu(materiAktif.simulasiOutputJikaBenar)
    );

    if (!levelSelesaiSet.has(materiAktif.level)) {
      setLevelSelesaiSet((prev) => new Set(prev).add(materiAktif.level));
      if (onTambahXp) onTambahXp(materiAktif.xpReward);
    }
  };

  const simulasiAktif = statusVerifikasi === "lulus";
  const sudahLulusLevelIni =
    statusVerifikasi === "lulus" || levelSelesaiSet.has(materiAktif.level);
  const daftarBarisEditor = kodeKetikanUser.split("\n");
  const infoResistor = hitungGelangResistorModular(fisika.nilaiOhmResistor);

  const daftarLevelSesuaiKategori = daftarKurikulumExtended
    .map((item, originalIdx) => ({ item, originalIdx }))
    .filter(
      ({ item }) =>
        kategoriLevelAktif === "Semua" ||
        dapatkanBabDariLevel(item) === kategoriLevelAktif
    );

  return (
    <div className="bg-slate-900 text-slate-100 p-5 sm:p-7 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 font-sans">
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

      <WokwiTheoryModal
        tampil={tampilModalTeori}
        onTutup={() => setTampilModalTeori(false)}
        materiAktif={materiAktif}
        blueprint={blueprintLevelIni}
        totalKomponenWajib={totalKomponenWajib}
        bersihkanKeHibahIlmu={bersihkanKeHibahIlmu}
      />

      {/* HEADER NAVIGASI */}
      <div className="space-y-4 border-b border-slate-800 pb-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs">
                🎓 Akademi IoT HibahIlmu (Multi-Pin Realistis)
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 font-semibold text-xs">
                Komponen: {jumlahKomponenTerpasangSaatIni}/{totalKomponenWajib}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-semibold text-xs">
                Kabel Kaki Pin: {kabelTerpasangList.length}/
                {semuaSambunganWajibLevelIni.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Level {materiAktif.level}: {materiAktif.judulMateri}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTampilModalTeori(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4" /> 📖 Buka Pop-Up Skema Gambar
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setModeBelajar("tutorial_berkedip")}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  modeBelajar === "tutorial_berkedip"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Mode Terpandu
              </button>
              <button
                type="button"
                onClick={() => setModeBelajar("latihan_mandiri")}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  modeBelajar === "latihan_mandiri"
                    ? "bg-rose-600 text-white"
                    : "text-slate-300"
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Latihan Mandiri
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DAFTAR_BAB_SILABUS.map((bab) => {
            const aktif = kategoriLevelAktif === bab.id;
            return (
              <button
                key={bab.id}
                type="button"
                onClick={() => {
                  setKategoriLevelAktif(bab.id);
                  const pertama = daftarKurikulumExtended.findIndex(
                    (x) =>
                      bab.id === "Semua" ||
                      dapatkanBabDariLevel(x) === bab.id
                  );
                  if (pertama >= 0) pindahKeLevel(pertama);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-2 border ${
                  aktif
                    ? `${bab.warna} border-white/80 shadow-md`
                    : "bg-slate-950 text-slate-300 border-slate-800"
                }`}
              >
                <span>{bab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          {daftarLevelSesuaiKategori.map(({ item, originalIdx }) => {
            const sedangDibuka = originalIdx === indeksLevel;
            const lulus = levelSelesaiSet.has(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => pindahKeLevel(originalIdx, modeBelajar, true)}
                className={`px-3.5 py-2 rounded-xl text-xs cursor-pointer transition flex items-center gap-1.5 border ${
                  sedangDibuka
                    ? "bg-amber-400 text-slate-950 font-extrabold border-white shadow-md"
                    : lulus
                    ? "bg-emerald-600 text-white font-bold border-emerald-400"
                    : "bg-slate-900 text-slate-200 border-slate-800"
                }`}
              >
                {lulus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                <span>Level {item.level}:</span>
                <span className="max-w-[155px] truncate">
                  {item.judulMateri.split("(")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LACI GUDANG 48 KOMPONEN (SOROT HANYA KOMPONEN YANG VALID!) */}
      <div className="bg-[#0b101e] p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">
              Gudang Komponen (Tarik Komponen yang Berkedip ke Slot #1 s.d. Slot #{totalKomponenWajib}):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari ESP32, LED, Resistor, NPK..."
                value={kataCariGudang}
                onChange={(e) => setKataCariGudang(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => pindahKeLevel(indeksLevel, modeBelajar, false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Bersihkan Kanvas
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400 mr-1" />
          {DAFTAR_TAB_FILTER_GUDANG.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setFilterKategoriGudang(kat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                filterKategoriGudang === kat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-300 border border-slate-800"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-52 overflow-y-auto pr-1 pt-1">
          {daftarGudangTerfilter.map((item) => {
            const sorotSlot1 =
              !slot1Esp32Terpasang &&
              item.cocokUntukDropZone === "esp32_board";
            const sorotSlotLain =
              slot1Esp32Terpasang &&
              slotPeriferalKosongBerikutnya !== null &&
              apakahKartuGudangValidUntukSlot(
                item,
                slotPeriferalKosongBerikutnya
              );

            const berkedip =
              tampilkanBayanganPanduan && (sorotSlot1 || sorotSlotLain);

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => setItemSedangDiDrag(item)}
                onClick={() => setItemSedangDiDrag(item)}
                className={`p-2.5 rounded-2xl border-2 select-none transition flex flex-col justify-between gap-1.5 cursor-grab ${
                  itemSedangDiDrag?.id === item.id
                    ? "bg-amber-400/20 border-amber-300 scale-105"
                    : berkedip
                    ? "bg-[#111827] border-amber-400 ring-2 ring-amber-400/60 animate-pulse"
                    : "bg-[#111827] border-slate-800"
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-indigo-300 truncate">
                    {item.badgeAtas}
                  </span>
                  <span className="text-amber-400">{item.jumlahPinLabel}</span>
                </div>
                <MiniaturSvgGudang48
                  idItem={item.id}
                  namaItem={item.nama}
                  nilaiOhmResistor={fisika.nilaiOhmResistor}
                />
                <div className="text-[11px] font-semibold text-slate-100 truncate text-center">
                  {item.id === "resistor_gelang"
                    ? `Resistor ${infoResistor.labelFormatted}`
                    : item.nama}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KANVAS MULTI-SLOT & MULTI-PIN */}
      <WokwiMultiSlotCanvas
        kanvasContainerRef={kanvasContainerRef}
        getarMerahRangkaian={getarMerahRangkaian}
        statusVerifikasi={statusVerifikasi}
        simulasiAktif={simulasiAktif}
        detakSimulasi={detakSimulasi}
        slot1Esp32Terpasang={slot1Esp32Terpasang}
        setSlot1Esp32Terpasang={setSlot1Esp32Terpasang}
        daftarSlotPeriferal={daftarSlotPeriferal}
        slotPeriferalTerpasangMap={slotPeriferalTerpasangMap}
        handleDropKeSlotTertentu={handleDropKeSlotTertentu}
        itemSedangDiDrag={itemSedangDiDrag}
        pesanGudang={pesanGudang}
        setPesanGudang={setPesanGudang}
        totalKomponenWajib={totalKomponenWajib}
        slotPeriferalKosongBerikutnya={slotPeriferalKosongBerikutnya}
        sambunganBerkedipTarget={sambunganBerkedipTarget}
        semuaSambunganWajibLevelIni={semuaSambunganWajibLevelIni}
        kabelTerpasangList={kabelTerpasangList}
        setKabelTerpasangList={setKabelTerpasangList}
        pinAwalDiklik={pinAwalDiklik}
        setPinAwalDiklik={setPinAwalDiklik}
        posisiKursorSvg={posisiKursorSvg}
        setPosisiKursorSvg={setPosisiKursorSvg}
        handleKlikTitikPinFisik={handleKlikTitikPinFisik}
        tampilkanBayanganPanduan={tampilkanBayanganPanduan}
        semuaKomponenSudahDitaruh={semuaKomponenSudahDitaruh}
        pinYangSalahAtauKurangIds={pinYangSalahAtauKurangIds}
        fisika={fisika}
        setFisika={setFisika}
        kodeKetikanUser={kodeKetikanUser}
      />

      {/* PANEL BAWAH: INSTRUKSI PERMANEN DI KIRI & EDITOR KODE DI KANAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
              <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> 1. Dasar Teori &amp; Aliran Arus Rangkaian Tertutup:
              </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {blueprintLevelIni.analogiMudahPaham}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sky-400 text-xs uppercase">
                2. Checklist Semua Kaki Pin yang Wajib Disambung ({kabelTerpasangList.length}/
                {semuaSambunganWajibLevelIni.length} Kabel):
              </div>
              {semuaSambunganWajibLevelIni.map((w) => {
                const sudah = apakahKabelSudahAda(w.pinAsalId, w.pinTujuanId);
                return (
                  <div
                    key={w.idSambungan}
                    className={`p-2.5 rounded-xl border font-mono text-xs flex justify-between items-center ${
                      sudah
                        ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-amber-300"
                    }`}
                  >
                    <span>
                      {sudah ? "✅" : "🔌"} {w.keteranganJalur}
                    </span>
                    <span className="text-[10px] font-bold">
                      {sudah ? "TERSAMBUNG" : "BELUM"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-1">
              <div className="font-bold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 3. Langkah Ketik Program C++:
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-100 bg-emerald-950/25 p-4 rounded-xl border border-emerald-500/30 text-xs sm:text-sm leading-relaxed">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i}>{bersihkanKeHibahIlmu(inst)}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* EDITOR KODE C++ */}
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
              <span className="font-mono font-bold text-amber-300">
                ✍️ Editor C++ — Level {materiAktif.level} (sketch.ino)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlot1Esp32Terpasang(true);
                    const mapPenuh: Record<
                      number,
                      { terpasang: boolean; namaKartu: string; idKartu: string }
                    > = {};
                    daftarSlotPeriferal.forEach((s) => {
                      mapPenuh[s.nomorSlot] = {
                        terpasang: true,
                        namaKartu: s.namaTarget,
                        idKartu: s.idGambarMiniatur,
                      };
                    });
                    setSlotPeriferalTerpasangMap(mapPenuh);
                    setKabelTerpasangList(
                      semuaSambunganWajibLevelIni.map((w) => ({
                        pinAsalId: w.pinAsalId,
                        pinTujuanId: w.pinTujuanId,
                        warna: w.warnaKabel,
                      }))
                    );
                    setKodeKetikanUser(
                      bersihkanKeHibahIlmu(materiAktif.kodeTargetBenar)
                    );
                    setBarisKodeSalahList([]);
                    setPinYangSalahAtauKurangIds([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Bantuan Rakit Semua Kaki &amp; Kode
                </button>
                <button
                  type="button"
                  onClick={() => pindahKeLevel(indeksLevel, modeBelajar, false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 bg-black font-mono text-xs sm:text-sm">
              <div className="col-span-1 py-4 bg-slate-950 border-r border-slate-800 text-right pr-2 select-none space-y-[2px]">
                {daftarBarisEditor.map((_, idx) => (
                  <div key={idx + 1} className="leading-relaxed px-1 text-slate-500">
                    {idx + 1}
                  </div>
                ))}
              </div>
              <textarea
                rows={Math.max(11, daftarBarisEditor.length)}
                value={kodeKetikanUser}
                onChange={(e) => setKodeKetikanUser(e.target.value)}
                spellCheck={false}
                className="col-span-11 p-4 bg-black text-emerald-300 font-mono leading-relaxed focus:outline-none resize-y"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={periksaRangkaianDanJalankanProgram}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa Semua Kaki &amp; Jalankan
              </button>

              {indeksLevel < daftarKurikulumExtended.length - 1 ? (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() =>
                    pindahKeLevel(indeksLevel + 1, modeBelajar, true)
                  }
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 ${
                    sudahLulusLevelIni
                      ? "bg-amber-400 text-slate-950 cursor-pointer shadow-xl"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {sudahLulusLevelIni ? (
                    <>
                      <span>2. Lanjut Level {materiAktif.level + 1}</span>
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
                  onClick={() => onBukaSimulator10Node && onBukaSimulator10Node()}
                  className="py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                >
                  <Award className="w-4 h-4 inline mr-1" /> Buka Simulator 10-Node ➔
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="text-amber-400 font-bold">
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