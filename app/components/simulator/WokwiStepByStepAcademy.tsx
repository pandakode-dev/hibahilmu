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
  HelpCircle,
  Eye,
  Target,
  Search,
  Filter,
  Move,
  Sliders,
  BookOpen,
  X,
  Cpu,
  Check,
} from "lucide-react";
import {
  KURIKULUM_15_LEVEL_IOT,
  LessonStepIoT as BaseLessonStepIoT,
} from "./wokwiCurriculumData";
import {
  SPESIFIKASI_HARDWARE_15_LEVEL,
  GUDANG_KOMPONEN_48_MASTER,
  MiniaturSvgGudang48,
  GambarPeriferalWokwiAsli,
  TitikPinFisik,
  ItemGudang48Master,
  KategoriFilterGudang48,
  ParameterFisikaInteraktif,
} from "./wokwiHardwareVisuals";

// Deklarasi lokal mandiri agar 100% aman dari error missing export / property TypeScript
export type KategoriKesulitanAcademy =
  | "Semua"
  | "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)"
  | "Bab 2: Output LED Tunggal & Lampu Lalu Lintas"
  | "Bab 3: Digital/Analog Input & External Interrupt"
  | "Bab 4: Sensor, Aktuator & Otomasi Cerdas"
  | "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";

export type ExtendedLessonStepIoT = BaseLessonStepIoT & {
  jumlahSlotAktif?: 1 | 2 | 3;
  kategoriKesulitan?: string;
};

export interface KabelTersambung {
  dariPinEsp32: string;
  kePinPeriferal: string;
  warna: string;
}

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

const PILIHAN_OHM_RESISTOR = [100, 220, 330, 470, 1000, 4700, 10000];

// Helper otomatis penentu Bab & Jumlah Slot jika data kurikulum belum memilikinya
function dapatkanBabDariLevel(item: ExtendedLessonStepIoT): string {
  if (item.kategoriKesulitan) return item.kategoriKesulitan;
  if (item.level <= 3)
    return "Bab 1: Standalone 1-ESP32 (Blink, Timer, Wi-Fi, WebServer, Blynk)";
  if (item.level <= 6) return "Bab 2: Output LED Tunggal & Lampu Lalu Lintas";
  if (item.level <= 9)
    return "Bab 3: Digital/Analog Input & External Interrupt";
  if (item.level <= 12) return "Bab 4: Sensor, Aktuator & Otomasi Cerdas";
  return "Bab 5: Multi-MCU, NPK, GPS & 10-Node Mesh";
}

function dapatkanJumlahSlotDariLevel(
  item: ExtendedLessonStepIoT,
  sambunganWajibLength: number
): 1 | 2 | 3 {
  if (item.jumlahSlotAktif) return item.jumlahSlotAktif;
  if (sambunganWajibLength === 0) return 1;
  if (item.komponenDimasukkan && item.komponenDimasukkan.length === 2) return 2;
  return 3;
}

function hitungGelangResistorLokal(ohm: number) {
  const petaWarna: Record<number, string> = {
    0: "#000000",
    1: "#78350f",
    2: "#ef4444",
    3: "#f97316",
    4: "#facc15",
    5: "#22c55e",
    6: "#2563eb",
    7: "#9333ea",
    8: "#64748b",
    9: "#ffffff",
  };
  const namaWarna: Record<number, string> = {
    0: "Hitam",
    1: "Coklat",
    2: "Merah",
    3: "Oranye",
    4: "Kuning",
    5: "Hijau",
    6: "Biru",
    7: "Ungu",
    8: "Abu-abu",
    9: "Putih",
  };
  const bersih = Math.max(10, Math.round(ohm));
  const str = String(bersih);
  const d1 = parseInt(str[0] || "2", 10);
  const d2 = parseInt(str[1] || "2", 10);
  const jmlNol = Math.max(0, str.length - 2);
  const labelFormatted =
    bersih >= 1000
      ? `${(bersih / 1000).toFixed(bersih % 1000 === 0 ? 0 : 1)} kΩ`
      : `${bersih} Ω`;
  return {
    warna1: petaWarna[d1] || "#ef4444",
    warna2: petaWarna[d2] || "#ef4444",
    warnaMultiplier: petaWarna[Math.min(9, jmlNol)] || "#78350f",
    warnaToleransi: "#eab308",
    teksGelang: `${namaWarna[d1]} - ${namaWarna[d2]} - ${namaWarna[Math.min(9, jmlNol)]} - Emas`,
    labelFormatted,
  };
}

// ============================================================================
// KOMPONEN ANIMASI SVG DASAR TEORI DI DALAM POP-UP MODAL (MENGAJARKAN KONSEP!)
// ============================================================================
const AnimasiVisualDasarTeoriModal: React.FC<{ level: number }> = ({ level }) => {
  if (level >= 3 && level <= 5) {
    return (
      <svg viewBox="0 0 520 175" className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800">
        <rect x={28} y={32} width={105} height={110} rx={12} fill="#1e293b" stroke="#38bdf8" strokeWidth={2} />
        <rect x={44} y={44} width={72} height={44} rx={5} fill="#cbd5e1" />
        <text x={80} y={69} textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="bold">ESP32 Wi-Fi</text>
        <text x={80} y={115} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">Client / Server</text>

        {[0, 1, 2].map((i) => (
          <circle key={i} cx={175 + i * 75} cy={87} r={10} fill="none" stroke="#38bdf8" strokeWidth={2.5}>
            <animate attributeName="r" values="6;28;6" dur="1.6s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.1;1" dur="1.6s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <path d="M 140 87 L 365 87" stroke="#facc15" strokeWidth={3} strokeDasharray="8 6">
          <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.7s" repeatCount="indefinite" />
        </path>
        <rect x={182} y={22} width={156} height={26} rx={8} fill="#0284c7" />
        <text x={260} y={39} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
          📡 SSID: &quot;HibahIlmu-Guest&quot;
        </text>

        <rect x={375} y={32} width={118} height={110} rx={14} fill="#064e3b" stroke="#34d399" strokeWidth={2} />
        <text x={434} y={68} textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
          🌐 HibahIlmu Cloud
        </text>
        <text x={434} y={92} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          IP: 192.168.1.105
        </text>
        <text x={434} y={116} textAnchor="middle" fill="#a7f3d0" fontSize="8.5">
          Komunikasi 2 Arah Aktif
        </text>
      </svg>
    );
  }

  if (level === 2 || level === 6 || level === 10) {
    return (
      <svg viewBox="0 0 520 175" className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800">
        <rect x={25} y={28} width={200} height={50} rx={10} fill="#1e293b" stroke="#64748b" strokeWidth={2} />
        <text x={125} y={50} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
          1. void loop() Berjalan Normal
        </text>
        <text x={125} y={66} textAnchor="middle" fill="#94a3b8" fontSize="8.5">
          CPU mengeksekusi baris demi baris
        </text>

        <path d="M 225 53 L 285 88" stroke="#facc15" strokeWidth={3.5} strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
        </path>
        <rect x={165} y={102} width={185} height={54} rx={12} fill="#881337" stroke="#fb7185" strokeWidth={2.5}>
          <animate attributeName="opacity" values="0.75;1;0.75" dur="0.8s" repeatCount="indefinite" />
        </rect>
        <text x={257} y={125} textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
          ⚡ HARDWARE INTERRUPT TRIGGER!
        </text>
        <text x={257} y={142} textAnchor="middle" fill="#ffffff" fontSize="8.8">
          Langsung lompat ke IRAM_ATTR ISR (2 µs)
        </text>

        <rect x={375} y={38} width={120} height={95} rx={12} fill="#065f46" stroke="#34d399" strokeWidth={2} />
        <circle cx={435} cy={72} r={14} fill="#facc15">
          <animate attributeName="r" values="10;18;10" dur="0.6s" repeatCount="indefinite" />
        </circle>
        <text x={435} y={112} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          Respons Instan!
        </text>
        <text x={435} y={125} textAnchor="middle" fill="#a7f3d0" fontSize="8">
          Tanpa Terhalang delay()
        </text>
      </svg>
    );
  }

  if (level >= 13) {
    return (
      <svg viewBox="0 0 520 175" className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800">
        {[
          { x: 30, label: "Node Kebun #1", sub: "Suhu, NPK, GPS, Batt", warna: "#0284c7" },
          { x: 200, label: "Relay Node #2..#9", sub: "Estafet Hop (N+1)", warna: "#7c3aed" },
          { x: 370, label: "Gateway Node #10", sub: "Upload Cloud Web", warna: "#059669" },
        ].map((n, idx) => (
          <g key={idx}>
            <rect x={n.x} y={42} width={120} height={90} rx={12} fill={n.warna} stroke="#ffffff" strokeWidth={1.8} />
            <text x={n.x + 60} y={82} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              {n.label}
            </text>
            <text x={n.x + 60} y={102} textAnchor="middle" fill="#fef08a" fontSize="8.5" fontWeight="bold">
              {n.sub}
            </text>
          </g>
        ))}
        <path d="M 150 87 L 200 87 M 320 87 L 370 87" stroke="#facc15" strokeWidth={4} strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.6s" repeatCount="indefinite" />
        </path>
        <circle cx={175} cy={87} r={6} fill="#fde047">
          <animate attributeName="cx" values="150;200;150" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={345} cy={87} r={6} fill="#fde047">
          <animate attributeName="cx" values="320;370;320" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 175" className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800">
      <rect x={24} y={38} width={130} height={98} rx={12} fill="#1e293b" stroke="#38bdf8" strokeWidth={2} />
      <text x={89} y={72} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
        1. INPUT / SENSOR
      </text>
      <text x={89} y={92} textAnchor="middle" fill="#ffffff" fontSize="9">
        {level === 1 ? "Program setup() & loop()" : "Baca Pin Digital / ADC"}
      </text>
      <text x={89} y={112} textAnchor="middle" fill="#94a3b8" fontSize="8">
        Sinyal Tegangan 0V – 3.3V
      </text>

      <path d="M 154 87 L 198 87" stroke="#38bdf8" strokeWidth={3.5} strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.6s" repeatCount="indefinite" />
      </path>

      <rect x={198} y={28} width={125} height={118} rx={14} fill="#0f172a" stroke="#facc15" strokeWidth={2.5} />
      <text x={260} y={66} textAnchor="middle" fill="#facc15" fontSize="10.5" fontWeight="bold">
        2. OTAK ESP32
      </text>
      <text x={260} y={88} textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
        Logika C++ (if / PWM)
      </text>
      <text x={260} y={110} textAnchor="middle" fill="#34d399" fontSize="8.5">
        Memutuskan HIGH / LOW
      </text>

      <path d="M 323 87 L 366 87" stroke="#facc15" strokeWidth={3.5} strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.6s" repeatCount="indefinite" />
      </path>

      <rect x={366} y={38} width={130} height={98} rx={12} fill="#064e3b" stroke="#34d399" strokeWidth={2} />
      <circle cx={431} cy={68} r={13} fill="#ef4444">
        <animate attributeName="r" values="9;16;9" dur="0.9s" repeatCount="indefinite" />
      </circle>
      <text x={431} y={102} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
        3. AKTUATOR / LED
      </text>
      <text x={431} y={120} textAnchor="middle" fill="#fde047" fontSize="8.5">
        Arus Mengalir ➔ Menyala!
      </text>
    </svg>
  );
};

export const WokwiStepByStepAcademy: React.FC<{
  onTambahXp?: (xp: number) => void;
  onBukaSimulator10Node?: () => void;
}> = ({ onTambahXp, onBukaSimulator10Node }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const kanvasContainerRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [kategoriLevelAktif, setKategoriLevelAktif] =
    useState<KategoriKesulitanAcademy>("Semua");
  const [indeksLevel, setIndeksLevel] = useState<number>(0);
  const [levelSelesaiSet, setLevelSelesaiSet] = useState<Set<number>>(
    new Set()
  );

  // POP-UP MODAL DASAR TEORI BERANIMASI
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
  const spekHardware =
    SPESIFIKASI_HARDWARE_15_LEVEL[materiAktif.level] ||
    SPESIFIKASI_HARDWARE_15_LEVEL[1];

  const jmlSlot = dapatkanJumlahSlotDariLevel(
    materiAktif,
    spekHardware.sambunganWajib.length
  );

  const bersihkanKeHibahIlmu = (teks: string) =>
    (teks || "").replace(/Wokwi-GUEST/g, "HibahIlmu-Guest");

  const [slot1Esp32Terpasang, setSlot1Esp32Terpasang] =
    useState<boolean>(false);
  const [slot2SensorTerpasang, setSlot2SensorTerpasang] =
    useState<boolean>(false);
  const [slot3AktuatorTerpasang, setSlot3AktuatorTerpasang] =
    useState<boolean>(false);

  const [namaKomponenSlot2, setNamaKomponenSlot2] = useState<string>("");
  const [namaKomponenSlot3, setNamaKomponenSlot3] = useState<string>("");
  const [blynkVirtualV0, setBlynkVirtualV0] = useState<boolean>(true);

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

  const [jumlahClueDibuka, setJumlahClueDibuka] = useState<number>(0);
  const [intipBayanganSementara, setIntipBayanganSementara] =
    useState<boolean>(false);

  const [kodeKetikanUser, setKodeKetikanUser] = useState<string>(
    bersihkanKeHibahIlmu(daftarKurikulumExtended[0].kodeTemplateAwal)
  );

  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus"
  >("belum");
  const [daftarErrorDetail, setDaftarErrorDetail] = useState<string[]>([]);
  const [pesanFeedback, setPesanFeedback] = useState<string>("");
  const [outputSerialSimulasi, setOutputSerialSimulasi] = useState<string>(
    "// Baca Pop-Up Dasar Teori, lalu tarik ESP32 ke kanvas dan ketik program C++!"
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
    const spekTarget =
      SPESIFIKASI_HARDWARE_15_LEVEL[target.level] ||
      SPESIFIKASI_HARDWARE_15_LEVEL[1];
    const slotTargetCount = dapatkanJumlahSlotDariLevel(
      target,
      spekTarget.sambunganWajib.length
    );

    setIndeksLevel(idxBaru);
    setModeBelajar(modeTarget);
    setTampilModalTeori(bukaPopUpTeori);
    setSlot1Esp32Terpasang(false);
    setSlot2SensorTerpasang(false);
    setSlot3AktuatorTerpasang(false);
    setNamaKomponenSlot2("");
    setNamaKomponenSlot3("");
    setItemSedangDiDrag(null);
    setPesanGudang("");
    setKabelTerpasangList([]);
    setPinAwalDiklik(null);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setJumlahClueDibuka(0);
    setIntipBayanganSementara(false);
    setKodeKetikanUser(bersihkanKeHibahIlmu(target.kodeTemplateAwal));
    setStatusVerifikasi("belum");
    setDaftarErrorDetail([]);
    setPesanFeedback("");
    setOutputSerialSimulasi(
      slotTargetCount === 1
        ? `// Level ${target.level} (Hanya 1 ESP32 Saja): Tarik 1 papan ESP32 ke kanvas (Tanpa kabel luar!) lalu ketik kodingannya.`
        : `// Level ${target.level}: Tarik ${slotTargetCount} komponen yang diminta ke slot kanvas, hubungkan kaki pin, lalu jalankan!`
    );
  };

  const semuaKomponenSudahDitaruh =
    jmlSlot === 1
      ? slot1Esp32Terpasang
      : jmlSlot === 2
      ? slot1Esp32Terpasang && slot2SensorTerpasang
      : slot1Esp32Terpasang && slot2SensorTerpasang && slot3AktuatorTerpasang;

  const sambunganWajibBelumTerpasang = spekHardware.sambunganWajib.filter(
    (wajib) =>
      !kabelTerpasangList.some(
        (k) =>
          k.dariPinEsp32 === wajib.dariPinEsp32 &&
          k.kePinPeriferal === wajib.kePinPeriferal
      )
  );

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

  const handleDropKeSlotKanvas = (
    slotTarget: "slot1_esp32" | "slot2_sensor" | "slot3_aktuator"
  ) => {
    if (!itemSedangDiDrag) return;

    if (slotTarget === "slot1_esp32") {
      if (itemSedangDiDrag.cocokUntukDropZone === "esp32_board") {
        setSlot1Esp32Terpasang(true);
        setPinYangSalahAtauKurangIds([]);
        setPesanGudang(
          jmlSlot === 1
            ? `✅ '${itemSedangDiDrag.nama}' terpasang! Karena Level ${materiAktif.level} hanya memakai 1 ESP32 saja, langsung ketik kodingan C++ di bawah!`
            : `✅ Slot 1 Terisi: '${itemSedangDiDrag.nama}' terpasang! Sekarang tarik komponen berikutnya ke Slot 2!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          `❌ Salah Slot! Slot 1 khusus untuk Mikrokontroler 'ESP32 DevKit V1', bukan '${itemSedangDiDrag.nama}'.`
        );
      }
    } else if (slotTarget === "slot2_sensor") {
      if (itemSedangDiDrag.cocokUntukDropZone !== "esp32_board") {
        setSlot2SensorTerpasang(true);
        setNamaKomponenSlot2(itemSedangDiDrag.nama);
        setPinYangSalahAtauKurangIds([]);
        setPesanGudang(
          jmlSlot === 2
            ? `✅ Komponen '${itemSedangDiDrag.nama}' terpasang! Sekarang klik 2 titik kaki pin yang berkedip untuk menyambung kabel!`
            : `✅ Slot 2 Terisi: '${itemSedangDiDrag.nama}' terpasang! Sekarang tarik komponen ke-3 ke Slot 3 di bawahnya!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          "❌ Slot 2 adalah tempat komponen periferal, bukan ESP32 utama!"
        );
      }
    } else if (slotTarget === "slot3_aktuator") {
      if (itemSedangDiDrag.cocokUntukDropZone !== "esp32_board") {
        setSlot3AktuatorTerpasang(true);
        setNamaKomponenSlot3(itemSedangDiDrag.nama);
        setPinYangSalahAtauKurangIds([]);
        setPesanGudang(
          `✅ Ketiga Komponen Lengkap Terpasang! Sekarang klik ke-2 titik kaki pin yang berkedip untuk menarik kabel jumper!`
        );
      } else {
        picuGetaranMerahRangkaian();
        setPesanGudang(
          "❌ Slot 3 adalah tempat komponen periferal kedua, bukan ESP32 utama!"
        );
      }
    }
    setItemSedangDiDrag(null);
  };

  const handleKlikKartuGudang = (item: ItemGudang48Master) => {
    setItemSedangDiDrag(item);
    if (item.cocokUntukDropZone === "esp32_board") {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Klik atau Drop ke [Slot 1: Papan ESP32] di kanvas.`
      );
    } else if (!slot2SensorTerpasang) {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Klik atau Drop ke [Slot 2] di sebelah kanan kanvas.`
      );
    } else {
      setPesanGudang(
        `👉 '${item.nama}' dipilih! Klik atau Drop ke [Slot 3] di kanan bawah kanvas.`
      );
    }
  };

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

    if (jmlSlot === 1) {
      setPesanGudang(
        `💡 Level ${materiAktif.level} hanya menggunakan 1 papan ESP32 saja, jadi tidak perlu memasang kabel keluar!`
      );
      return;
    }

    if (!semuaKomponenSudahDitaruh) {
      picuGetaranMerahRangkaian();
      setPesanGudang(
        `⚠️ Pasang dulu seluruh komponen (${jmlSlot} Slot) ke kanvas sebelum menyambung kaki pin!`
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
        `❌ Salah Pin! Sambungan dari ${pinAwalDiklik.labelPin} ke ${pinDiklik.labelPin} tidak sesuai instruksi modul.`
      );
    } else {
      setPesanGudang(`✅ Kabel Tepat: ${cocokWajib.keteranganJalur}!`);
    }
  };

  const periksaRangkaianDanJalankanProgram = () => {
    const errors: string[] = [];
    const pinBermasalah: string[] = [];
    const barisBermasalah: { nomorBaris: number; pesanBaris: string }[] = [];

    if (!slot1Esp32Terpasang) {
      errors.push(
        "[SLOT 1 KOSONG] Tarik papan 'ESP32 DevKit V1' dari Gudang Komponen ke kotak Slot 1 di kanvas!"
      );
    }
    if (jmlSlot >= 2 && !slot2SensorTerpasang) {
      errors.push(
        `[SLOT 2 KOSONG] Tarik komponen '${
          materiAktif.komponenDimasukkan[1]?.namaKomponen || "Komponen Kedua"
        }' dari Gudang Komponen ke Slot 2!`
      );
    }
    if (jmlSlot >= 3 && !slot3AktuatorTerpasang) {
      errors.push(
        `[SLOT 3 KOSONG] Tarik komponen '${
          materiAktif.komponenDimasukkan[2]?.namaKomponen || "Komponen Ketiga"
        }' dari Gudang Komponen ke Slot 3!`
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

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_rangkaian");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds(pinBermasalah);
      setBarisKodeSalahList([]);
      picuGetaranMerahRangkaian();
      setPesanFeedback(
        `🚨 Rangkaian Belum Tepat (${errors.length} Masalah): Perhatikan bagian kanvas yang bergetar merah di atas!`
      );
      setOutputSerialSimulasi(
        `[HARDWARE CHECK FAILED]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    const barisArray = kodeKetikanUser.split("\n");
    const kodeBersih = kodeKetikanUser
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    barisArray.forEach((isiBaris, idx) => {
      const nomor = idx + 1;
      const tanpaKomen = isiBaris.replace(/\/\/.*$/, "").trim();
      if (!tanpaKomen) return;
      const adalahBarisPerintah =
        /^(pinMode|digitalWrite|analogRead|analogWrite|attachInterrupt|timerBegin|timerAttachInterrupt|timerAlarm|delay|Serial\.|pintu\.|int\s+|float\s+|double\s+|WiFi\.|server\.|Blynk\.|esp_now_)/.test(
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

    if (errors.length > 0) {
      setStatusVerifikasi("gagal_kode");
      setDaftarErrorDetail(errors);
      setPinYangSalahAtauKurangIds([]);
      setBarisKodeSalahList(barisBermasalah);
      picuGetaranMerahKodingan();
      setPesanFeedback(
        `🚨 Kodingan C++ Masih Salah (${errors.length} Error): Perhatikan kotak Editor Kode yang bergetar merah dan nomor baris yang ditandai merah!`
      );
      setOutputSerialSimulasi(
        `[ESP32 GCC COMPILER ERROR — LOKASI BARIS DITEMUKAN]\n--------------------------------------------------\n${errors
          .map((e, i) => `❌ ${i + 1}. ${e}`)
          .join("\n")}`
      );
      return;
    }

    setStatusVerifikasi("lulus");
    setDaftarErrorDetail([]);
    setPinYangSalahAtauKurangIds([]);
    setBarisKodeSalahList([]);
    setPesanFeedback(
      `🎉 100% Sempurna! Praktikum Level ${materiAktif.level} (${materiAktif.judulMateri}) berhasil dijalankan (+${materiAktif.xpReward} XP)!`
    );
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
  const infoResistor = hitungGelangResistorLokal(fisika.nilaiOhmResistor);

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

      {/* =================================================================== */}
      {/* POP-UP MODAL DASAR TEORI BERANIMASI DI TENGAH LAYAR                 */}
      {/* =================================================================== */}
      {tampilModalTeori && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-400/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs">
                    MODUL LEVEL {materiAktif.level} DARI {daftarKurikulumExtended.length}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 font-semibold text-xs">
                    +{materiAktif.xpReward} XP
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
                  {materiAktif.judulMateri}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTampilModalTeori(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Animasi Cara Kerja Sistem di Modul Ini:
              </div>
              <AnimasiVisualDasarTeoriModal level={materiAktif.level} />
            </div>

            <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="text-sm font-bold text-emerald-400">
                📖 Dasar Teori &amp; Konsep Utama:
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {bersihkanKeHibahIlmu(materiAktif.penjelasanTeoriSingkat)}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-xs text-amber-300/90 font-medium">
                <strong>🎯 Target Praktikum:</strong>{" "}
                {bersihkanKeHibahIlmu(materiAktif.tujuanBelajar)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-sky-300">
                🧰 Perangkat yang Akan Kamu Gunakan ({jmlSlot} Slot):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {materiAktif.komponenDimasukkan.map((k, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5"
                  >
                    <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-white">{k.namaKomponen}</div>
                      <div className="text-slate-400">{k.pasangKePin}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setTampilModalTeori(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl transition"
              >
                <Check className="w-5 h-5 stroke-[2.5]" /> Saya Paham! Mulai Rakit &amp; Koding Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SILABUS */}
      <div className="space-y-4 border-b border-slate-800 pb-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs">
                🎓 Akademi Aplikasi IoT HibahIlmu ({daftarKurikulumExtended.length} Level)
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 font-semibold text-xs">
                {jmlSlot === 1
                  ? "⚡ Standalone 1-ESP32 (Tanpa Kabel Luar)"
                  : jmlSlot === 2
                  ? "🔌 2-Slot (ESP32 + 1 Komponen)"
                  : "🛠️ 3-Slot (Multi-Komponen)"}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-semibold text-xs">
                Progres: {levelSelesaiSet.size} / {daftarKurikulumExtended.length} Selesai
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
              <BookOpen className="w-4 h-4" /> 📖 Buka Animasi Dasar Teori
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setModeBelajar("tutorial_berkedip");
                  setIntipBayanganSementara(false);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
                  modeBelajar === "tutorial_berkedip"
                    ? "bg-amber-400 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Mode Terpandu
              </button>

              <button
                type="button"
                onClick={() => {
                  setModeBelajar("latihan_mandiri");
                  setIntipBayanganSementara(false);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
                  modeBelajar === "latihan_mandiri"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-300 hover:text-white"
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
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                }`}
              >
                <span>{bab.label}</span>
                <span className="px-2 py-0.5 rounded-md bg-black/25 text-[11px]">
                  {bab.rentang}
                </span>
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
                    ? "bg-amber-400 text-slate-950 font-extrabold border-white shadow-md scale-[1.02]"
                    : lulus
                    ? "bg-emerald-600 text-white font-bold border-emerald-400"
                    : "bg-slate-900 text-slate-200 font-medium border-slate-800 hover:border-slate-600"
                }`}
              >
                {lulus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                <span>Level {item.level}:</span>
                <span className="max-w-[165px] truncate">
                  {item.judulMateri.split("(")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GUDANG KOMPONEN (48 ITEM) */}
      <div className="bg-[#0b101e] p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">
              Gudang Komponen ({GUDANG_KOMPONEN_48_MASTER.length} Perangkat Beranimasi):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari ESP32, LED, NPK, Pompa, RFID..."
                value={kataCariGudang}
                onChange={(e) => setKataCariGudang(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> Butuh Clue ({jumlahClueDibuka}/
                {spekHardware.daftarClueLatihan.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSlot1Esp32Terpasang(false);
                setSlot2SensorTerpasang(false);
                setSlot3AktuatorTerpasang(false);
                setKabelTerpasangList([]);
                setPinAwalDiklik(null);
                setPinYangSalahAtauKurangIds([]);
                setStatusVerifikasi("belum");
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Bersihkan Kanvas
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400 mr-1" />
          {DAFTAR_TAB_FILTER_GUDANG.map((kat) => {
            const aktif = filterKategoriGudang === kat;
            return (
              <button
                key={kat}
                type="button"
                onClick={() => setFilterKategoriGudang(kat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  aktif
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {kat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-56 overflow-y-auto pr-1 pt-1">
          {daftarGudangTerfilter.map((item) => {
            const dibutuhkanEsp32 =
              item.cocokUntukDropZone === "esp32_board" && !slot1Esp32Terpasang;
            const dibutuhkanPeriferal =
              jmlSlot >= 2 &&
              item.cocokUntukDropZone !== "esp32_board" &&
              (item.cocokUntukDropZone === spekHardware.tipeVisualPeriferal ||
                item.levelTerkait.includes(materiAktif.level)) &&
              (!slot2SensorTerpasang ||
                (jmlSlot === 3 && !slot3AktuatorTerpasang));

            const harusDisorotBerkedip =
              tampilkanBayanganPanduan &&
              (dibutuhkanEsp32 ||
                (slot1Esp32Terpasang && dibutuhkanPeriferal));

            const sedangTerpilihDrag = itemSedangDiDrag?.id === item.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => {
                  setItemSedangDiDrag(item);
                  setPesanGudang(
                    `📦 Menarik '${item.nama}'... Jatuhkan ke Slot yang berkedip di meja kanvas bawah!`
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
                <div className="flex justify-between items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-md">
                  <span className="text-[9px] font-bold text-indigo-300 truncate">
                    {item.badgeAtas}
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 shrink-0">
                    {item.jumlahPinLabel}
                  </span>
                </div>

                <div className="py-0.5">
                  <MiniaturSvgGudang48
                    idItem={item.id}
                    namaItem={item.nama}
                    nilaiOhmResistor={fisika.nilaiOhmResistor}
                  />
                </div>

                <div className="text-[11px] font-semibold text-slate-100 leading-tight truncate text-center">
                  {item.id === "resistor_gelang"
                    ? `Resistor ${infoResistor.labelFormatted}`
                    : item.nama}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MEJA KANVAS ADAPTIF */}
      <div
        ref={kanvasContainerRef}
        className={`bg-[#090d16] rounded-3xl border-2 p-4 relative overflow-hidden shadow-2xl transition ${
          getarMerahRangkaian
            ? "animate-error-shake border-rose-500 bg-rose-950/20"
            : statusVerifikasi === "gagal_rangkaian"
            ? "border-rose-500"
            : simulasiAktif
            ? "border-emerald-400"
            : "border-slate-800"
        }`}
      >
        <div
          className={`mb-3 grid grid-cols-1 ${
            jmlSlot === 1
              ? "sm:grid-cols-1"
              : jmlSlot === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-3"
          } gap-2.5 text-xs`}
        >
          <div
            onClick={() => {
              if (itemSedangDiDrag) handleDropKeSlotKanvas("slot1_esp32");
            }}
            className={`px-3.5 py-2.5 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
              slot1Esp32Terpasang
                ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                : "bg-amber-950/40 border-amber-400 text-amber-200 animate-pulse"
            }`}
          >
            <span>1. {materiAktif.komponenDimasukkan[0]?.namaKomponen}</span>
            <span>
              {slot1Esp32Terpasang
                ? "✓ ESP32 Terpasang"
                : "📦 Tarik ESP32 ke Slot 1"}
            </span>
          </div>

          {jmlSlot >= 2 && (
            <div
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotKanvas("slot2_sensor");
              }}
              className={`px-3.5 py-2.5 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
                slot2SensorTerpasang
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-sky-950/40 border-sky-400 text-sky-200 animate-pulse"
              }`}
            >
              <span className="truncate">
                2.{" "}
                {namaKomponenSlot2 ||
                  materiAktif.komponenDimasukkan[1]?.namaKomponen}
              </span>
              <span className="shrink-0 ml-1">
                {slot2SensorTerpasang ? "✓ Terpasang" : "📦 Tarik ke Slot 2"}
              </span>
            </div>
          )}

          {jmlSlot >= 3 && (
            <div
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotKanvas("slot3_aktuator");
              }}
              className={`px-3.5 py-2.5 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
                slot3AktuatorTerpasang
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-purple-950/40 border-purple-400 text-purple-200 animate-pulse"
              }`}
            >
              <span className="truncate">
                3.{" "}
                {namaKomponenSlot3 ||
                  materiAktif.komponenDimasukkan[2]?.namaKomponen ||
                  "Komponen Output / Aktuator"}
              </span>
              <span className="shrink-0 ml-1">
                {slot3AktuatorTerpasang ? "✓ Terpasang" : "📦 Tarik ke Slot 3"}
              </span>
            </div>
          )}
        </div>

        {statusVerifikasi === "gagal_rangkaian" && (
          <div className="mb-3 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-between gap-2 animate-pulse">
            <span>🚨 Letak Kesalahan Rangkaian: {daftarErrorDetail[0]}</span>
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

          {/* SLOT 1 (KIRI): PAPAN MIKROKONTROLER ESP32 */}
          {!slot1Esp32Terpasang ? (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeSlotKanvas("slot1_esp32");
              }}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotKanvas("slot1_esp32");
                else setSlot1Esp32Terpasang(true);
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
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={110}
                y={108}
                textAnchor="middle"
                fill="#facc15"
                fontSize="10"
                fontWeight="bold"
              >
                📦 SLOT 1 (MCU):
              </text>
              <text
                x={110}
                y={126}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10.5"
                fontWeight="bold"
              >
                ESP32 DevKit V1
              </text>
              <text
                x={110}
                y={144}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8.5"
              >
                (Tarik dari Gudang / Klik)
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

              <circle cx={92} cy={196} r={4} fill="#ef4444" />
              {(simulasiAktif || jmlSlot === 1) &&
                detakSimulasi % 2 === 0 &&
                blynkVirtualV0 && (
                  <circle
                    cx={126}
                    cy={196}
                    r={18}
                    fill="rgba(56, 189, 248, 0.45)"
                  >
                    <animate
                      attributeName="r"
                      values="10;22;10"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              <circle
                cx={126}
                cy={196}
                r={5.5}
                fill={
                  (simulasiAktif || jmlSlot === 1) &&
                  detakSimulasi % 2 === 0 &&
                  blynkVirtualV0
                    ? "#38bdf8"
                    : "#1e3a8a"
                }
                stroke="#ffffff"
                strokeWidth={1.2}
              />
              <rect
                x={92}
                y={214}
                width={36}
                height={14}
                rx={3}
                fill="#94a3b8"
              />

              {spekHardware.pinEsp32Tersedia.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  semuaKomponenSudahDitaruh &&
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

          {/* VISUAL STANDALONE 1-ESP32 HIBAHILMU-GUEST */}
          {jmlSlot === 1 && slot1Esp32Terpasang && (
            <g>
              <path
                d="M 135 196 C 210 196, 230 125, 295 125"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="5 4"
              />
              <rect
                x={295}
                y={32}
                width={255}
                height={186}
                rx={16}
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth={2.5}
              />
              <text
                x={422}
                y={58}
                textAnchor="middle"
                fill="#facc15"
                fontSize="10.5"
                fontWeight="bold"
              >
                📡 STANDALONE ESP32 — HIBAHILMU-GUEST
              </text>
              <circle
                cx={422}
                cy={115}
                r={28}
                fill={
                  simulasiAktif && detakSimulasi % 2 === 0
                    ? "#38bdf8"
                    : "#1e3a8a"
                }
                stroke="#ffffff"
                strokeWidth={2.5}
              />
              <text
                x={422}
                y={165}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                {simulasiAktif
                  ? detakSimulasi % 2 === 0
                    ? "💡 LED Internal GPIO 2: HIGH (3.3V)"
                    : "⚫ LED Internal GPIO 2: LOW (0V)"
                  : "Ketik Kode & Klik Jalankan Program!"}
              </text>
            </g>
          )}

          {/* SLOT 2 & SLOT 3 */}
          {jmlSlot >= 2 && !slot2SensorTerpasang && (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeSlotKanvas("slot2_sensor");
              }}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotKanvas("slot2_sensor");
                else setSlot2SensorTerpasang(true);
              }}
              className="cursor-pointer"
            >
              <rect
                x={345}
                y={jmlSlot === 2 ? 42 : 24}
                width={205}
                height={jmlSlot === 2 ? 165 : 92}
                rx={14}
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="7 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={447}
                y={jmlSlot === 2 ? 108 : 62}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="9.5"
                fontWeight="bold"
              >
                📦 SLOT 2 (KOMPONEN EKSTERNAL):
              </text>
              <text
                x={447}
                y={jmlSlot === 2 ? 128 : 80}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9.5"
                fontWeight="bold"
              >
                {materiAktif.komponenDimasukkan[1]?.namaKomponen.replace(
                  "Slot 2: ",
                  ""
                )}
              </text>
            </g>
          )}

          {jmlSlot >= 3 && !slot3AktuatorTerpasang && (
            <g
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropKeSlotKanvas("slot3_aktuator");
              }}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotKanvas("slot3_aktuator");
                else setSlot3AktuatorTerpasang(true);
              }}
              className="cursor-pointer"
            >
              <rect
                x={345}
                y={130}
                width={205}
                height={95}
                rx={14}
                fill="rgba(168, 85, 247, 0.08)"
                stroke="#a855f7"
                strokeWidth={2.5}
                strokeDasharray="7 5"
              >
                <animate
                  attributeName="opacity"
                  values="0.35;1;0.35"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={447}
                y={168}
                textAnchor="middle"
                fill="#c084fc"
                fontSize="9.5"
                fontWeight="bold"
              >
                📦 SLOT 3 (KOMPONEN KEDUA):
              </text>
              <text
                x={447}
                y={186}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9.5"
                fontWeight="bold"
              >
                {(
                  materiAktif.komponenDimasukkan[2]?.namaKomponen ||
                  "Komponen Kedua"
                ).replace("Slot 3: ", "")}
              </text>
            </g>
          )}

          {jmlSlot >= 2 &&
            slot2SensorTerpasang &&
            (jmlSlot === 2 || slot3AktuatorTerpasang) && (
              <g>
                <GambarPeriferalWokwiAsli
                  tipe={spekHardware.tipeVisualPeriferal}
                  simulasiHidup={simulasiAktif || semuaKomponenSudahDitaruh}
                  detak={detakSimulasi}
                  nilaiSensorUji={fisika.luxCahaya}
                  fisika={fisika}
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

          {semuaKomponenSudahDitaruh &&
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

        {/* PANEL SIMULATOR FISIKA */}
        <div className="mt-3 bg-slate-900/95 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Pengatur Parameter Fisika &amp; Animasi Komponen Live:
            </span>
            <span className="font-mono text-amber-300">
              Resistor: <strong>{infoResistor.labelFormatted}</strong> ({infoResistor.teksGelang})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">💡 Terang/Redup LED (PWM):</span>
                <span className="text-amber-300">
                  {Math.round((fisika.pwmLedBrightness / 255) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={255}
                value={fisika.pwmLedBrightness}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    pwmLedBrightness: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">🎨 Nilai &amp; Gelang Resistor:</span>
                <span className="text-emerald-400">
                  {infoResistor.labelFormatted}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {PILIHAN_OHM_RESISTOR.map((nilai) => (
                  <button
                    key={nilai}
                    type="button"
                    onClick={() =>
                      setFisika((f) => ({ ...f, nilaiOhmResistor: nilai }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      fisika.nilaiOhmResistor === nilai
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {nilai >= 1000 ? `${nilai / 1000}kΩ` : `${nilai}Ω`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">🔥 Suhu Panas &amp; Asap PPM:</span>
                <span className="text-rose-400">
                  {fisika.suhuCelcius}°C | {fisika.kadarGasPpm} PPM
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={20}
                  max={55}
                  value={fisika.suhuCelcius}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      suhuCelcius: Number(e.target.value),
                    }))
                  }
                  className="w-1/2"
                />
                <input
                  type="range"
                  min={150}
                  max={950}
                  value={fisika.kadarGasPpm}
                  onChange={(e) =>
                    setFisika((f) => ({
                      ...f,
                      kadarGasPpm: Number(e.target.value),
                    }))
                  }
                  className="w-1/2"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">📡 Jarak Objek Ultrasonik:</span>
                <span className="text-sky-400">{fisika.jarakUltrasonikCm} cm</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                value={fisika.jarakUltrasonikCm}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    jarakUltrasonikCm: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setFisika((f) => ({
                      ...f,
                      rfidKartuDekat: !f.rfidKartuDekat,
                    }))
                  }
                  className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    fisika.rfidKartuDekat
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  🪪 {fisika.rfidKartuDekat ? "RFID: Dekat" : "RFID: Jauh"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFisika((f) => ({ ...f, pirAdaOrang: !f.pirAdaOrang }))
                  }
                  className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    fisika.pirAdaOrang
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  🚶 {fisika.pirAdaOrang ? "PIR: Orang" : "PIR: Sepi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INSTRUKSI & EDITOR KODE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs">
                {materiAktif.badgeLevel}
              </span>
              <button
                type="button"
                onClick={() => setTampilModalTeori(true)}
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Lihat Animasi Teori
              </button>
            </div>

            <p className="text-slate-200 bg-slate-900 p-4 rounded-xl border border-slate-800 leading-relaxed">
              <strong className="text-amber-300">🎯 Tujuan Praktikum:</strong>{" "}
              {bersihkanKeHibahIlmu(materiAktif.tujuanBelajar)}
            </p>

            <div className="space-y-2">
              <div className="font-bold text-sky-400 text-xs uppercase tracking-wider">
                1. Sambungan Kabel Pin yang Diminta:
              </div>
              {spekHardware.sambunganWajib.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  ✅ Materi Standalone 1-Board ESP32: Tidak memerlukan tarikan kabel keluar!
                </div>
              ) : (
                spekHardware.sambunganWajib.map((w, i) => {
                  const sudah = kabelTerpasangList.some(
                    (k) =>
                      k.dariPinEsp32 === w.dariPinEsp32 &&
                      k.kePinPeriferal === w.kePinPeriferal
                  );
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border font-mono text-xs flex justify-between items-center ${
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
                      <span className="text-[10px] font-bold">
                        {sudah ? "TERSAMBUNG" : "BELUM"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-2 pt-1">
              <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 2. Langkah-Langkah Ketik Program C++:
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-100 bg-emerald-950/25 p-4 rounded-xl border border-emerald-500/30 text-xs sm:text-sm leading-relaxed">
                {materiAktif.instruksiKetik.map((inst, i) => (
                  <li key={i}>{bersihkanKeHibahIlmu(inst)}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

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
                    setSlot2SensorTerpasang(true);
                    setSlot3AktuatorTerpasang(true);
                    setKabelTerpasangList(
                      spekHardware.sambunganWajib.map((w) => ({
                        dariPinEsp32: w.dariPinEsp32,
                        kePinPeriferal: w.kePinPeriferal,
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
                  <Sparkles className="w-3.5 h-3.5" /> Isi Contoh Kode &amp; Rangkaian
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

            {barisKodeSalahList.length > 0 && (
              <div className="bg-rose-950 border-b border-rose-500 px-4 py-3 text-xs space-y-1">
                <div className="font-bold text-rose-300">
                  🚨 Lokasi Kesalahan Kodingan C++ Ditemukan:
                </div>
                {barisKodeSalahList.map((b, i) => (
                  <div key={i} className="text-white font-mono">
                    👉 <strong>Baris #{b.nomorBaris}:</strong> {b.pesanBaris}
                  </div>
                ))}
              </div>
            )}

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
                          ? "bg-rose-600 text-white font-bold animate-pulse"
                          : "text-slate-500"
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
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> 1. Periksa &amp; Jalankan Program
              </button>

              {indeksLevel < daftarKurikulumExtended.length - 1 ? (
                <button
                  type="button"
                  disabled={!sudahLulusLevelIni}
                  onClick={() =>
                    pindahKeLevel(indeksLevel + 1, modeBelajar, true)
                  }
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition ${
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
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs ${
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