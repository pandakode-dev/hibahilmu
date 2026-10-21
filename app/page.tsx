"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  School,
  Compass,
  PlayCircle,
  ArrowLeft,
  Trophy,
  Search,
  Flame,
  CheckCircle2,
  Timer,
  MessageSquare,
  ShieldCheck,
  LayoutDashboard,
  CheckSquare,
  Square,
  FileEdit,
  Award,
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
  Activity,
  PlusCircle,
  LogOut,
  UserPlus,
  Trash2,
  Edit3,
  UserX2,
  UserCheck2,
  Upload,
  Layers,
  Lock,
  Play,
  BookMarked,
  FileSpreadsheet,
  Send,
  HelpCircle,
  XCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  FolderArchive,
} from "lucide-react";
import confetti from "canvas-confetti";

// ==========================================
// 1. INTERFACE & STRUKTUR DATA
// ==========================================
interface KuisItem {
  tanya: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

export interface SubJenjang {
  id: string;
  nama: string;
}

interface KelasItem {
  id: string;
  subJenjangId: string;
  judul: string;
  level: "Pemula" | "Menengah" | "Mahir";
  durasi: string;
  videoUrl: string;
  rangkuman: string;
  rumusMatematika?: string;
  contohKode?: string;
  kuis: KuisItem;
}

interface JenjangItem {
  id: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  gradien: string;
  badge: string;
  ikonNama: string;
  subJenjang: SubJenjang[];
  kelas: KelasItem[];
}

interface SoalTryout {
  id: string;
  jenjang: string;
  pertanyaan: string;
  rumus?: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

interface DiskusiPR {
  id: string;
  penanya: string;
  jenjang: string;
  mapel: string;
  pertanyaan: string;
  waktu: string;
  jawaban: { penjawab: string; isi: string }[];
}

export interface AkunPengguna {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: "admin" | "guru" | "siswa";
  status: "pending" | "approved" | "rejected";
  infoTambahan: string;
  waktuDaftar: string;
  aksesMengajar?: string[];
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  namaPelaku: string;
  rolePelaku: "admin" | "guru" | "siswa";
  aksi: string;
  kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem";
}

export interface KelompokBelajar {
  id: string;
  namaKelas: string;
  guruId: string;
  siswaIds: string[];
}

// Fungsi bantu yang aman tanpa memicu error Regex di dalam JSX
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ");
}

// ==========================================
// 2. DATA AWAL LENGKAP
// ==========================================
const TEMPLATE_JSON_CONTOH = JSON.stringify(
  [
    {
      nama: "Dewi Lestari, S.Pd",
      email: "dewi@hibahilmu.id",
      password: "123",
      role: "guru",
      infoTambahan: "Guru Biologi SMA",
    },
    {
      nama: "Ahmad Fauzi",
      email: "ahmad@hibahilmu.id",
      password: "123",
      role: "siswa",
      infoTambahan: "Kelas 12 MIPA",
    },
  ],
  null,
  2
);

const STRUKTUR_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    badge: "bg-rose-100 text-rose-700",
    ikonNama: "sparkles",
    subJenjang: [
      { id: "tk-playgroup", nama: "Playgroup" },
      { id: "tk-a", nama: "TK Kelas A" },
      { id: "tk-b", nama: "TK Kelas B" },
    ],
    kelas: [
      {
        id: "materi-tk-1",
        subJenjangId: "tk-a",
        judul: "Mengenal Angka & Berhitung Ceria 1-10",
        level: "Pemula",
        durasi: "5 Menit",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
        rangkuman:
          "<p>Mari belajar menghitung buah-buahan! Angka <b>1</b> seperti tiang listrik, angka <b>2</b> seperti bebek berenang.</p>",
        rumusMatematika: "2 Apel + 1 Apel = 3 Apel Segar",
        kuis: {
          tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi sekarang?",
          opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"],
          jawabanBenar: 1,
          pembahasan: "Hebat sekali! 2 apel ditambah 1 apel menjadi 3 apel!",
        },
      },
    ],
  },
  {
    id: "sd",
    nama: "SD / MI",
    tagline: "Fondasi Logika & Sains",
    deskripsi: "Matematika dasar, eksperimen sains seru, Bahasa Indonesia & kisah inspiratif.",
    gradien: "from-amber-500 via-orange-500 to-red-500",
    badge: "bg-amber-100 text-amber-800",
    ikonNama: "book",
    subJenjang: [
      { id: "sd-1", nama: "Kelas 1 SD" },
      { id: "sd-2", nama: "Kelas 2 SD" },
      { id: "sd-3", nama: "Kelas 3 SD" },
      { id: "sd-4", nama: "Kelas 4 SD" },
      { id: "sd-5", nama: "Kelas 5 SD" },
      { id: "sd-6", nama: "Kelas 6 SD" },
    ],
    kelas: [
      {
        id: "materi-sd-1",
        subJenjangId: "sd-4",
        judul: "Rahasia Perkalian Cepat & Luas Bangun Datar",
        level: "Pemula",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/mvOkMYCygps",
        rangkuman:
          "<p><b>Perkalian</b> adalah penjumlahan yang berulang! Digunakan juga untuk menghitung luas persegi panjang dan segitiga.</p><ul><li>Luas Persegi = Sisi x Sisi</li><li>Luas Segitiga = 1/2 x Alas x Tinggi</li></ul>",
        rumusMatematika: "Luas Segitiga = 1/2 x Alas (a) x Tinggi (t)",
        kuis: {
          tanya: "Sebuah segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapakah luasnya?",
          opsi: ["10 cm2", "12 cm2", "24 cm2", "18 cm2"],
          jawabanBenar: 1,
          pembahasan: "Tepat! Luas = 1/2 x 6 x 4 = 12 cm2.",
        },
      },
    ],
  },
  {
    id: "smp",
    nama: "SMP / MTs",
    tagline: "Eksplorasi & Penalaran",
    deskripsi: "Aljabar, Fisika terapan, Biologi sel, Bahasa Inggris, dan IPS Terpadu.",
    gradien: "from-cyan-500 via-blue-500 to-indigo-600",
    badge: "bg-sky-100 text-sky-800",
    ikonNama: "compass",
    subJenjang: [
      { id: "smp-7", nama: "Kelas 7 SMP" },
      { id: "smp-8", nama: "Kelas 8 SMP" },
      { id: "smp-9", nama: "Kelas 9 SMP" },
    ],
    kelas: [
      {
        id: "materi-smp-1",
        subJenjangId: "smp-8",
        judul: "Persamaan Aljabar & Teorema Pythagoras",
        level: "Menengah",
        durasi: "12 Menit",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        rangkuman:
          "<p>Aljabar menggunakan variabel <i>x</i> atau <i>y</i> untuk mencari angka misterius. Pythagoras membantu mencari sisi miring segitiga siku-siku.</p>",
        rumusMatematika: "Rumus Pythagoras: a^2 + b^2 = c^2",
        kuis: {
          tanya: "Jika segitiga siku-siku memiliki alas a = 3 cm dan tinggi b = 4 cm, berapakah sisi miringnya (c)?",
          opsi: ["c = 5 cm", "c = 6 cm", "c = 7 cm", "c = 25 cm"],
          jawabanBenar: 0,
          pembahasan: "Luar biasa! Akar dari (9 + 16) = Akar 25 = 5 cm.",
        },
      },
    ],
  },
  {
    id: "sma",
    nama: "SMA / SMK",
    tagline: "Persiapan Masa Depan",
    deskripsi: "Kalkulus, Fisika mekanika, Kimia, Ekonomi, dan persiapan lolos PTN impian.",
    gradien: "from-violet-600 via-purple-600 to-fuchsia-600",
    badge: "bg-purple-100 text-purple-800",
    ikonNama: "school",
    subJenjang: [
      { id: "sma-10", nama: "Kelas 10 Umum" },
      { id: "sma-11-ipa", nama: "Kelas 11 MIPA" },
      { id: "sma-11-ips", nama: "Kelas 11 IPS" },
      { id: "sma-12-ipa", nama: "Kelas 12 MIPA" },
      { id: "sma-12-ips", nama: "Kelas 12 IPS" },
      { id: "sma-bahasa", nama: "Jurusan Bahasa" },
    ],
    kelas: [
      {
        id: "materi-sma-1",
        subJenjangId: "sma-11-ipa",
        judul: "Fisika Mekanika, Hukum Newton & Energi Kinetik",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman:
          "<p>Gaya berbanding lurus dengan massa dan percepatan benda. <b>Energi kinetik</b> bergantung pada kuadrat kecepatan benda tersebut.</p>",
        rumusMatematika: "Hukum II Newton: F = m . a\nEnergi Kinetik: Ek = 1/2 . m . v^2",
        kuis: {
          tanya: "Sebuah benda bermassa 4 kg bergerak dengan kecepatan 3 m/s. Berapakah Energi Kinetiknya (Ek)?",
          opsi: ["6 Joule", "12 Joule", "18 Joule", "36 Joule"],
          jawabanBenar: 2,
          pembahasan: "Tepat! Ek = 1/2 . 4 . (3^2) = 2 . 9 = 18 Joule.",
        },
      },
    ],
  },
  {
    id: "kuliah",
    nama: "Kuliah & Karier",
    tagline: "Keahlian Profesional & IT",
    deskripsi: "Pemrograman Web (Panda Kode), Artificial Intelligence, Bisnis & Desain.",
    gradien: "from-emerald-500 via-teal-600 to-cyan-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikonNama: "graduation",
    subJenjang: [
      { id: "pt-ti", nama: "S1 Teknik Informatika" },
      { id: "pt-si", nama: "S1 Sistem Informasi" },
      { id: "pt-dkv", nama: "S1 Desain Komunikasi Visual" },
      { id: "pt-manajemen", nama: "S1 Manajemen Bisnis" },
    ],
    kelas: [
      {
        id: "materi-kuliah-1",
        subJenjangId: "pt-ti",
        judul: "Fullstack Next.js & React (Panda Kode)",
        level: "Mahir",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman:
          "<p>React menggunakan komponen dan Hook seperti <b>useState</b> untuk memperbarui data layar secara instan.</p>",
        contohKode: "const [xp, setXp] = useState(0);",
        kuis: {
          tanya: "Hook apa yang digunakan di React/Next.js untuk menyimpan state lokal?",
          opsi: ["useRouter()", "useState()", "useDatabase()", "useStyle()"],
          jawabanBenar: 1,
          pembahasan: "Mantap! useState() adalah fondasi utama membuat aplikasi interaktif.",
        },
      },
    ],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  {
    id: "to-1",
    jenjang: "SD / MI",
    pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 x 3) - 10 adalah...",
    rumus: "Ingat KABATAKU: Kerjakan tanda kurung dan perkalian dulu!",
    opsi: ["51", "101", "61", "45"],
    jawabanBenar: 0,
    pembahasan: "12 x 3 = 36. Lalu 25 + 36 - 10 = 51.",
  },
  {
    id: "to-2",
    jenjang: "SMP / MTs",
    pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?",
    rumus: "Substitusikan x = 4 ke dalam fungsi f(x)",
    opsi: ["5", "7", "12", "17"],
    jawabanBenar: 1,
    pembahasan: "f(4) = 3(4) - 5 = 12 - 5 = 7.",
  },
  {
    id: "to-3",
    jenjang: "Kuliah IT",
    pertanyaan: "Perintah Git untuk mengirim commit lokal ke repository GitHub adalah...",
    opsi: ["git pull", "git push", "git init", "git clone"],
    jawabanBenar: 1,
    pembahasan: "git push digunakan untuk mengunggah perubahan ke repositori GitHub.",
  },
];

const AKUN_DEFAULT: AkunPengguna[] = [
  {
    id: "adm-1",
    nama: "Admin Panda Kode",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "approved",
    infoTambahan: "Founder & Super Admin HibahIlmu",
    waktuDaftar: "Permanen",
    aksesMengajar: [],
  },
  {
    id: "gru-1",
    nama: "Bapak Budi Santoso, M.Pd",
    email: "guru@hibahilmu.id",
    password: "123",
    role: "guru",
    status: "approved",
    infoTambahan: "Guru Matematika & Fisika SMA",
    waktuDaftar: "Kemarin, 09:00",
    aksesMengajar: ["sma-10", "sma-11-ipa", "sma-12-ipa"],
  },
  {
    id: "sis-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswi Kelas 11 MIPA",
    waktuDaftar: "Kemarin, 14:20",
    aksesMengajar: [],
  },
  {
    id: "sis-2",
    nama: "Reza Pratama",
    email: "reza@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Mahasiswa S1 Teknik Informatika",
    waktuDaftar: "Hari ini, 08:15",
    aksesMengajar: [],
  },
];

const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "08:30 WIB",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mengunggah modul materi baru pada jenjang SMA",
    kategori: "materi",
  },
  {
    id: "log-2",
    waktu: "Kemarin",
    namaPelaku: "Aisyah Putri",
    rolePelaku: "siswa",
    aksi: "Menyelesaikan modul kuis interaktif (+50 XP)",
    kategori: "belajar",
  },
];

const KELOMPOK_AWAL: KelompokBelajar[] = [
  {
    id: "rombel-1",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    guruId: "gru-1",
    siswaIds: ["sis-1"],
  },
];

// ==========================================
// KOMPONEN RICH TEXT EDITOR
// ==========================================
const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  const formatText = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const addLink = () => {
    const url = prompt("Masukkan URL Link (contoh: https://hibahilmu.id):");
    if (url) formatText("createLink", url);
  };

  const addImage = () => {
    const url = prompt("Masukkan URL Gambar (https://...):");
    if (url) formatText("insertImage", url);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <div className="bg-slate-100 border-b border-slate-200 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Tebal (Bold)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Miring (Italic)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatText("underline")}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Garis Bawah (Underline)"
        >
          <Underline size={16} />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto" />
        <button
          type="button"
          onClick={() => formatText("insertUnorderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatText("insertOrderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto" />
        <button
          type="button"
          onClick={addLink}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Sisipkan Hyperlink"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 hover:bg-white rounded-lg text-slate-700 transition"
          title="Sisipkan Gambar via URL"
        >
          <ImageIcon size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="p-4 min-h-[160px] max-h-[320px] overflow-y-auto text-sm outline-none prose prose-sm max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
};

// ==========================================
// 3. KOMPONEN UTAMA APLIKASI
// ==========================================
export default function AplikasiHibahIlmu() {
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(STRUKTUR_AWAL);

  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [subJenjangAktif, setSubJenjangAktif] = useState<string>("semua");
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);
  const [daftarKelompok, setDaftarKelompok] = useState<KelompokBelajar[]>(KELOMPOK_AWAL);

  // State Siswa
  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState<boolean>(false);
  const [jawabanKuis, setJawabanKuis] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);

  // State Tryout
  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(180);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [skorTryout, setSkorTryout] = useState<number>(0);

  // State Forum PR
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([
    {
      id: "pr-1",
      penanya: "Rizky (SMP)",
      jenjang: "SMP",
      mapel: "Matematika",
      pertanyaan: "Bagaimana cara cepat membedakan rumus Luas dan Keliling Lingkaran?",
      waktu: "1 jam lalu",
      jawaban: [
        {
          penjawab: "Panda Kode (Mentor)",
          isi: "Luas selalu pangkat dua (pi x r^2), keliling tidak ada pangkat (2 x pi x r).",
        },
      ],
    },
  ]);
  const [tanyaBaru, setTanyaBaru] = useState<string>("");
  const [mapelBaru, setMapelBaru] = useState<string>("Matematika");
  const [balasanInput, setBalasanInput] = useState<{ [key: string]: string }>({});

  // State Auth Form
  const [modeAuth, setModeAuth] = useState<"login" | "register">("login");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru" | "admin">("siswa");
  const [infoReg, setInfoReg] = useState("");

  // State Admin
  const [adminTabAktif, setAdminTabAktif] = useState<"akun" | "kategori" | "rombel" | "log">("akun");
  const [modalAdminAkun, setModalAdminAkun] = useState<boolean>(false);
  const [idEditAkun, setIdEditAkun] = useState<string | null>(null);
  const [namaFormAdmin, setNamaFormAdmin] = useState("");
  const [emailFormAdmin, setEmailFormAdmin] = useState("");
  const [passFormAdmin, setPassFormAdmin] = useState("");
  const [roleFormAdmin, setRoleFormAdmin] = useState<"admin" | "guru" | "siswa">("siswa");
  const [statusFormAdmin, setStatusFormAdmin] = useState<"approved" | "pending" | "rejected">("approved");
  const [infoFormAdmin, setInfoFormAdmin] = useState("");
  const [aksesMengajarForm, setAksesMengajarForm] = useState<string[]>([]);
  const [filterLog, setFilterLog] = useState<string>("semua");

  const [selectedAkunIds, setSelectedAkunIds] = useState<string[]>([]);
  const [modalImportAkun, setModalImportAkun] = useState<boolean>(false);
  const [teksImportJson, setTeksImportJson] = useState<string>("");
  const [notifImport, setNotifImport] = useState<string>("");

  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // State Admin Rombel
  const [namaKelompokAdmin, setNamaKelompokAdmin] = useState("");
  const [guruKelompokAdmin, setGuruKelompokAdmin] = useState("");
  const [searchSiswaAdmin, setSearchSiswaAdmin] = useState<{ [key: string]: string }>({});

  // State Guru
  const [guruTabAktif, setGuruTabAktif] = useState<"materi" | "kelas">("materi");
  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [levelMateri, setLevelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [videoMateri, setVideoMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [rumusMateri, setRumusMateri] = useState("");
  const [pertanyaanKuis, setPertanyaanKuis] = useState("");
  const [opsiA, setOpsiA] = useState("");
  const [opsiB, setOpsiB] = useState("");
  const [opsiC, setOpsiC] = useState("");
  const [opsiD, setOpsiD] = useState("");
  const [kunciKuis, setKunciKuis] = useState<number>(0);
  const [notifGuru, setNotifGuru] = useState(false);

  const [namaKelompokBaru, setNamaKelompokBaru] = useState("");
  const [searchSiswaGuru, setSearchSiswaGuru] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    const savedAkunList = localStorage.getItem("hibah_daftar_akun");
    const savedUserAktif = localStorage.getItem("hibah_user_aktif");
    const savedLogs = localStorage.getItem("hibah_log_aktivitas");
    const savedStruktur = localStorage.getItem("hibah_struktur");
    const savedKelompok = localStorage.getItem("hibah_kelompok");

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
    if (savedStruktur) setDaftarJenjang(JSON.parse(savedStruktur));
    if (savedKelompok) setDaftarKelompok(JSON.parse(savedKelompok));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) {
      interval = setInterval(() => setSisaWaktu((p) => p - 1), 1000);
    } else if (sisaWaktu === 0 && sedangUjian) {
      selesaikanTryout();
    }
    return () => clearInterval(interval);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  useEffect(() => {
    if (kelasAktif) {
      setCatatanSiswa(localStorage.getItem(`catatan_${kelasAktif.id}`) || "");
      setJawabanKuis(null);
      setStatusKuis(null);
    }
  }, [kelasAktif]);

  const catatLog = (
    namaPelaku: string,
    rolePelaku: "admin" | "guru" | "siswa",
    aksi: string,
    kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem"
  ) => {
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const logBaru: LogAktivitas = {
      id: "log-" + Date.now(),
      waktu: `${jam} WIB`,
      namaPelaku,
      rolePelaku,
      aksi,
      kategori,
    };
    setLogAktivitas((prev) => {
      const terbaru = [logBaru, ...(prev || [])];
      localStorage.setItem("hibah_log_aktivitas", JSON.stringify(terbaru));
      return terbaru;
    });
  };

  const tambahXP = (tambahan: number) => {
    setPoinXP((prev) => {
      const totalBaru = (prev || 0) + tambahan;
      localStorage.setItem("hibah_xp", totalBaru.toString());
      return totalBaru;
    });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const toggleSelesaiMateri = (kelasId: string) => {
    setMateriSelesai((prev) => {
      const safePrev = prev || [];
      const sudahAda = safePrev.includes(kelasId);
      const daftarBaru = sudahAda
        ? safePrev.filter((id) => id !== kelasId)
        : [...safePrev, kelasId];
      if (!sudahAda) {
        tambahXP(30);
        catatLog(
          userLogin?.nama || "Siswa",
          userLogin?.role || "siswa",
          "Menyelesaikan materi pelajaran",
          "belajar"
        );
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  // --- FUNGSI AUTENTIKASI ---
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun sedang disuspend.");
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, "Berhasil masuk ke Dashboard", "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const akunDitemukan = (daftarAkun || []).find(
      (a) => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin
    );
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending")
      return setPesanError("Akun menunggu persetujuan Admin.");
    if (akunDitemukan.status === "rejected")
      return setPesanError("Akun ini telah disuspend oleh Admin.");
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, "Melakukan Login", "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    if ((daftarAkun || []).some((a) => a.email.toLowerCase() === emailReg.toLowerCase())) {
      return setPesanError("Email sudah terdaftar.");
    }
    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg,
      email: emailReg,
      password: passwordReg,
      role: roleReg,
      status: "pending",
      infoTambahan: infoReg || "Pengguna Baru",
      waktuDaftar: "Baru saja",
      aksesMengajar: [],
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, "Mendaftar akun (Pending)", "akun");
    setPesanSukses("Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  // --- FUNGSI ADMIN ---
  const ubahStatusAkun = (id: string, status: "approved" | "rejected" | "pending") => {
    const update = (daftarAkun || []).map((a) => (a.id === id ? { ...a, status } : a));
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Mengubah status akun menjadi ${status}`, "akun");
  };

  const hapusAkun = (id: string) => {
    const update = (daftarAkun || []).filter((a) => a.id !== id);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", "Menghapus akun permanen", "akun");
  };

  const hapusAkunSekaligus = () => {
    if (selectedAkunIds.length === 0) return;
    if (!confirm(`Hapus ${selectedAkunIds.length} akun terpilih secara permanen?`)) return;
    const update = (daftarAkun || []).filter(
      (a) => !selectedAkunIds.includes(a.id) || a.role === "admin"
    );
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Hapus massal ${selectedAkunIds.length} akun`,
      "akun"
    );
    setSelectedAkunIds([]);
  };

  const togglePilihAkun = (id: string) => {
    setSelectedAkunIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const bukaModalTambahAkun = () => {
    setIdEditAkun(null);
    setNamaFormAdmin("");
    setEmailFormAdmin("");
    setPassFormAdmin("");
    setRoleFormAdmin("siswa");
    setStatusFormAdmin("approved");
    setInfoFormAdmin("");
    setAksesMengajarForm([]);
    setModalAdminAkun(true);
  };

  const bukaModalEditAkun = (akun: AkunPengguna) => {
    setIdEditAkun(akun.id);
    setNamaFormAdmin(akun.nama);
    setEmailFormAdmin(akun.email);
    setPassFormAdmin("");
    setRoleFormAdmin(akun.role);
    setStatusFormAdmin(akun.status);
    setInfoFormAdmin(akun.infoTambahan);
    setAksesMengajarForm(akun.aksesMengajar || []);
    setModalAdminAkun(true);
  };

  const simpanAkunAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (idEditAkun) {
      const update = (daftarAkun || []).map((a) =>
        a.id === idEditAkun
          ? {
              ...a,
              nama: namaFormAdmin,
              email: emailFormAdmin,
              password: passFormAdmin || a.password,
              role: roleFormAdmin,
              status: statusFormAdmin,
              infoTambahan: infoFormAdmin,
              aksesMengajar: roleFormAdmin === "guru" ? aksesMengajarForm : [],
            }
          : a
      );
      setDaftarAkun(update);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
      catatLog(userLogin?.nama || "Admin", "admin", `Mengedit akun ${namaFormAdmin}`, "akun");
    } else {
      const akunBaru: AkunPengguna = {
        id: "adm-usr-" + Date.now(),
        nama: namaFormAdmin,
        email: emailFormAdmin,
        password: passFormAdmin || "123",
        role: roleFormAdmin,
        status: statusFormAdmin,
        infoTambahan: infoFormAdmin || "Dibuat Admin",
        waktuDaftar: "Oleh Admin",
        aksesMengajar: roleFormAdmin === "guru" ? aksesMengajarForm : [],
      };
      const gabungan = [akunBaru, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      catatLog(userLogin?.nama || "Admin", "admin", `Membuat akun baru ${namaFormAdmin}`, "akun");
    }
    setModalAdminAkun(false);
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(teksImportJson);
      if (!Array.isArray(parsedData)) return alert("Format JSON harus berupa Array [...]");
      const akunBaruMasuk: AkunPengguna[] = parsedData.map(
        (item: Partial<AkunPengguna>, idx: number) => ({
          id: "import-" + Date.now() + "-" + idx,
          nama: item.nama || "Tanpa Nama",
          email: item.email || `user${idx}@hibahilmu.id`,
          password: item.password || "123",
          role: item.role === "guru" || item.role === "admin" ? item.role : "siswa",
          status: "approved",
          infoTambahan: item.infoTambahan || "Diimpor massal",
          waktuDaftar: "Massal Import",
          aksesMengajar: [],
        })
      );
      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      setNotifImport(`Sukses mengimpor ${akunBaruMasuk.length} akun!`);
      setTimeout(() => {
        setNotifImport("");
        setModalImportAkun(false);
      }, 2000);
    } catch {
      alert("Format JSON tidak valid! Pastikan tanda kutip dan kurung benar.");
    }
  };

  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategoriBaru.trim()) return;
    const update = daftarJenjang.map((j) =>
      j.id === targetJenjangKategori
        ? { ...j, subJenjang: [...j.subJenjang, { id: `sub-${Date.now()}`, nama: namaKategoriBaru }] }
        : j
    );
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Menambah kategori/kelas: ${namaKategoriBaru}`,
      "sistem"
    );
    setModalKategori(false);
    setNamaKategoriBaru("");
  };

  // --- FUNGSI ROMBEL / KELOMPOK BELAJAR (ADMIN & GURU) ---
  const handleAdminBuatKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelompokAdmin.trim() || !guruKelompokAdmin) return;
    const kelompokBaru: KelompokBelajar = {
      id: "kelompok-" + Date.now(),
      namaKelas: namaKelompokAdmin,
      guruId: guruKelompokAdmin,
      siswaIds: [],
    };
    const update = [...daftarKelompok, kelompokBaru];
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Membuat Rombel: ${namaKelompokAdmin}`,
      "sistem"
    );
    setNamaKelompokAdmin("");
    setGuruKelompokAdmin("");
  };

  const handleGuruBuatKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !namaKelompokBaru.trim()) return;
    const kelompokBaru: KelompokBelajar = {
      id: "kelompok-" + Date.now(),
      namaKelas: namaKelompokBaru,
      guruId: userLogin.id,
      siswaIds: [],
    };
    const update = [...daftarKelompok, kelompokBaru];
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    catatLog(userLogin.nama, "guru", `Membuat Ruang Kelas: ${namaKelompokBaru}`, "sistem");
    setNamaKelompokBaru("");
  };

  const handleTambahSiswaKeKelompok = (kelompokId: string, siswaId: string) => {
    const update = daftarKelompok.map((k) =>
      k.id === kelompokId && !k.siswaIds.includes(siswaId)
        ? { ...k, siswaIds: [...k.siswaIds, siswaId] }
        : k
    );
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  const handleHapusSiswaDariKelompok = (kelompokId: string, siswaId: string) => {
    const update = daftarKelompok.map((k) =>
      k.id === kelompokId ? { ...k, siswaIds: k.siswaIds.filter((id) => id !== siswaId) } : k
    );
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  const handleHapusKelompok = (kelompokId: string) => {
    if (!confirm("Yakin ingin menghapus ruang kelas ini?")) return;
    const update = daftarKelompok.filter((k) => k.id !== kelompokId);
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  // --- FUNGSI GURU BUAT MATERI ---
  const opsiKelasGuru = (daftarJenjang || []).flatMap((j) =>
    j.subJenjang
      .filter((sj) => userLogin?.aksesMengajar?.includes(sj.id))
      .map((sj) => ({ ...sj, namaInduk: j.nama }))
  );

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !subJenjangPilih) return;
    const finalEmbed = videoMateri.includes("watch?v=")
      ? videoMateri.replace("watch?v=", "embed/")
      : videoMateri;
    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(),
      subJenjangId: subJenjangPilih,
      judul: `${judulMateri} (Oleh: ${userLogin.nama})`,
      level: levelMateri,
      durasi: "15 Menit",
      videoUrl: finalEmbed,
      rangkuman: rangkumanMateri || "<p>Materi pembelajaran.</p>",
      rumusMatematika: rumusMateri || undefined,
      kuis: {
        tanya: pertanyaanKuis,
        opsi: [opsiA, opsiB, opsiC, opsiD],
        jawabanBenar: kunciKuis,
        pembahasan: `Disusun oleh Guru ${userLogin.nama}.`,
      },
    };
    const update = daftarJenjang.map((j) =>
      j.subJenjang.some((sj) => sj.id === subJenjangPilih)
        ? { ...j, kelas: [modulBaru, ...j.kelas] }
        : j
    );
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    catatLog(userLogin.nama, "guru", `Menerbitkan materi: ${judulMateri}`, "materi");
    setNotifGuru(true);
    setJudulMateri("");
    setVideoMateri("");
    setRangkumanMateri("");
    setRumusMateri("");
    setPertanyaanKuis("");
    setOpsiA("");
    setOpsiB("");
    setOpsiC("");
    setOpsiD("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  const selesaikanTryout = () => {
    let benar = 0;
    BANK_SOAL_TRYOUT.forEach((soal, idx) => {
      if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++;
    });
    setSkorTryout(Math.round((benar / BANK_SOAL_TRYOUT.length) * 100));
    setUjianSelesai(true);
    setSedangUjian(false);
    if (benar > 0) tambahXP(benar * 40);
  };

  const renderIkon = (nama: string) => {
    if (nama === "sparkles") return <Sparkles className="w-7 h-7 text-white" />;
    if (nama === "book") return <BookOpen className="w-7 h-7 text-white" />;
    if (nama === "compass") return <Compass className="w-7 h-7 text-white" />;
    if (nama === "school") return <School className="w-7 h-7 text-white" />;
    return <GraduationCap className="w-7 h-7 text-white" />;
  };

  const safeAkunList = daftarAkun || [];
  const safeLogList = logAktivitas || [];
  const jumlahPending = safeAkunList.filter((a) => a.status === "pending").length;
  const guruKelompoks = daftarKelompok.filter((k) => k.guruId === userLogin?.id);
  const daftarSiswaApproved = safeAkunList.filter(
    (a) => a.role === "siswa" && a.status === "approved"
  );

  // ==========================================
  // SUB-RENDERERS UNTUK MENCEGAH JSX BERSARANG
  // ==========================================
  const renderAuthView = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setModeAuth("login");
              setPesanError("");
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${
              modeAuth === "login" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => {
              setModeAuth("register");
              setPesanError("");
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${
              modeAuth === "register" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {pesanError && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold">
            {pesanError}
          </div>
        )}
        {pesanSukses && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold">
            {pesanSukses}
          </div>
        )}

        {modeAuth === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Selamat Datang!</h2>
              <p className="text-slate-500 text-sm mt-1">
                Masuk ke portal pembelajaran gratis HibahIlmu.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Contoh: admin@hibahilmu.id"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                placeholder="••••••"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              Masuk Sekarang
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Pendaftaran Akun</h2>
              <p className="text-slate-500 text-sm mt-1">Akun memerlukan validasi dari Admin.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleReg("siswa")}
                className={`p-4 border-2 rounded-2xl text-left transition ${
                  roleReg === "siswa"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Siswa / Mahasiswa</div>
                <div className="text-[10px] text-slate-500 mt-1">Akses Belajar Gratis</div>
              </button>
              <button
                type="button"
                onClick={() => setRoleReg("guru")}
                className={`p-4 border-2 rounded-2xl text-left transition ${
                  roleReg === "guru"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Guru Relawan</div>
                <div className="text-[10px] text-slate-500 mt-1">Kontribusi Materi</div>
              </button>
            </div>
            <input
              type="text"
              required
              value={namaReg}
              onChange={(e) => setNamaReg(e.target.value)}
              placeholder="Nama Lengkap..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="email"
              required
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              placeholder="Email Aktif..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="password"
              required
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              placeholder="Buat Password..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="text"
              required
              value={infoReg}
              onChange={(e) => setInfoReg(e.target.value)}
              placeholder={
                roleReg === "guru" ? "Mata Pelajaran Spesialis..." : "Sekolah / Kampus..."
              }
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              Daftar & Ajukan Akses
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max">
          Pengujian Cepat
        </span>
        <h3 className="text-2xl font-black mt-4 mb-2">Mode Demo 1-Klik</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Uji fitur multi-dashboard Admin, Guru, dan Siswa secara instan tanpa mengetik password.
        </p>
        <div className="space-y-3">
          {safeAkunList
            .filter((a) => a.status === "approved")
            .slice(0, 4)
            .map((a) => (
              <button
                key={a.id}
                onClick={() => loginCepat(a)}
                className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    {a.nama}
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-500 text-slate-900">
                      {a.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{a.email}</div>
                </div>
                <span className="text-xs font-bold text-amber-300 group-hover:translate-x-1 transition">
                  Masuk →
                </span>
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAdminView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div>
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
            Super Admin
          </span>
          <h1 className="text-3xl font-black mt-3 mb-1">Pusat Kendali HibahIlmu</h1>
          <p className="text-slate-300 text-sm">
            Kelola akun, penugasan kelas guru, rombel mahasiswa/siswa, dan hierarki kurikulum.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalImportAkun(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"
          >
            <Upload className="w-4 h-4" /> Import JSON
          </button>
          <button
            onClick={bukaModalTambahAkun}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"
          >
            <UserPlus className="w-4 h-4" /> Tambah Akun
          </button>
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      {/* Tab Navigasi Admin */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "akun", label: `Data Akun (${safeAkunList.length})`, icon: <Users className="w-4 h-4" /> },
          { id: "rombel", label: `Kelola Rombel / Kelas (${daftarKelompok.length})`, icon: <FolderArchive className="w-4 h-4" /> },
          { id: "kategori", label: "Kategori & Prodi", icon: <Layers className="w-4 h-4" /> },
          { id: "log", label: "Audit Log Server", icon: <Activity className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setAdminTabAktif(t.id as "akun" | "kategori" | "rombel" | "log")}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
              adminTabAktif === t.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {adminTabAktif === "akun" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-900">Manajemen Seluruh Akun & RBAC</h2>
            {selectedAkunIds.length > 0 && (
              <button
                onClick={hapusAkunSekaligus}
                className="bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> Hapus {selectedAkunIds.length} Akun Terpilih
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-[38rem] overflow-y-auto pr-2">
            {safeAkunList.map((akun) => (
              <div
                key={akun.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-3">
                  {akun.role !== "admin" && (
                    <input
                      type="checkbox"
                      checked={selectedAkunIds.includes(akun.id)}
                      onChange={() => togglePilihAkun(akun.id)}
                      className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  )}
                  <div>
                    <div className="font-extrabold text-sm flex flex-wrap items-center gap-2 text-slate-900">
                      {akun.nama}
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">
                        {akun.role}
                      </span>
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded font-black ${
                          akun.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : akun.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {akun.status === "rejected" ? "Suspended" : akun.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {akun.email} • {akun.infoTambahan}
                    </div>
                    {akun.role === "guru" && (
                      <div className="text-[10px] font-bold text-indigo-600 mt-1">
                        Hak Akses Mengajar: {akun.aksesMengajar?.length || 0} Kelas/Prodi
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {akun.status !== "approved" ? (
                    <button
                      onClick={() => ubahStatusAkun(akun.id, "approved")}
                      title="Setujui / Aktifkan"
                      className="p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl"
                    >
                      <UserCheck2 className="w-4 h-4" />
                    </button>
                  ) : (
                    akun.role !== "admin" && (
                      <button
                        onClick={() => ubahStatusAkun(akun.id, "rejected")}
                        title="Suspend Akun"
                        className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl"
                      >
                        <UserX2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                  <button
                    onClick={() => bukaModalEditAkun(akun)}
                    title="Edit Akun & Akses"
                    className="p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {akun.role !== "admin" && (
                    <button
                      onClick={() => hapusAkun(akun.id)}
                      title="Hapus Permanen"
                      className="p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTabAktif === "rombel" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Manajemen Rombongan Belajar (Masukkan Siswa/Mahasiswa ke Kelas)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Admin dapat membuat ruang kelas dan memasukkan mahasiswa/siswa ke kelas tertentu.
            </p>
          </div>
          <form
            onSubmit={handleAdminBuatKelompok}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 bg-slate-50 border border-slate-200 rounded-2xl"
          >
            <input
              type="text"
              required
              value={namaKelompokAdmin}
              onChange={(e) => setNamaKelompokAdmin(e.target.value)}
              placeholder="Nama Kelas / Rombel Baru..."
              className="p-3.5 border rounded-xl text-sm font-semibold bg-white"
            />
            <select
              required
              value={guruKelompokAdmin}
              onChange={(e) => setGuruKelompokAdmin(e.target.value)}
              className="p-3.5 border rounded-xl text-sm font-bold bg-white"
            >
              <option value="" disabled>
                -- Pilih Pengajar Kelas --
              </option>
              {safeAkunList
                .filter((a) => a.role === "guru")
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-6 rounded-xl text-sm shadow"
            >
              + Buat Rombel Kelas
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daftarKelompok.map((kel) => {
              const kataCari = searchSiswaAdmin[kel.id] || "";
              const hasilCariSiswa = daftarSiswaApproved.filter(
                (s) =>
                  !kel.siswaIds.includes(s.id) &&
                  (s.nama.toLowerCase().includes(kataCari.toLowerCase()) ||
                    s.email.toLowerCase().includes(kataCari.toLowerCase()))
              );
              return (
                <div
                  key={kel.id}
                  className="p-6 border border-slate-200 rounded-3xl bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-black text-lg text-indigo-950">{kel.namaKelas}</h3>
                      <button
                        onClick={() => handleHapusKelompok(kel.id)}
                        className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg"
                      >
                        Hapus Kelas
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 mb-4">
                      Pengajar: <b>{safeAkunList.find((a) => a.id === kel.guruId)?.nama || "Guru"}</b> •{" "}
                      Terdaftar: <b>{kel.siswaIds.length} Siswa</b>
                    </div>

                    <div className="relative mb-3">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={kataCari}
                        onChange={(e) =>
                          setSearchSiswaAdmin({ ...searchSiswaAdmin, [kel.id]: e.target.value })
                        }
                        placeholder="Cari nama atau email siswa untuk dimasukkan..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 mb-4 border p-2 rounded-xl bg-slate-50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-1">
                        Klik Tambah untuk memasukkan ke kelas:
                      </div>
                      {hasilCariSiswa.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center bg-white p-2 rounded-lg border text-xs"
                        >
                          <div>
                            <div className="font-bold">{s.nama}</div>
                            <div className="text-[10px] text-slate-400">{s.email}</div>
                          </div>
                          <button
                            onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                          >
                            + Masukkan
                          </button>
                        </div>
                      ))}
                      {hasilCariSiswa.length === 0 && (
                        <div className="text-center text-xs text-slate-400 py-2">
                          Tidak ada siswa ditemukan.
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Anggota Kelas Saat Ini:
                      </div>
                      {kel.siswaIds.map((sId) => {
                        const s = safeAkunList.find((x) => x.id === sId);
                        if (!s) return null;
                        return (
                          <div
                            key={sId}
                            className="flex justify-between items-center bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl text-xs"
                          >
                            <span className="font-bold text-indigo-950">
                              {s.nama} <span className="font-normal text-slate-500">({s.email})</span>
                            </span>
                            <button
                              onClick={() => handleHapusSiswaDariKelompok(kel.id, s.id)}
                              className="text-rose-600 font-bold hover:underline"
                            >
                              Keluarkan
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {adminTabAktif === "kategori" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900">
              Hierarki Jenjang, Kelas & Program Studi
            </h2>
            <button
              onClick={() => setModalKategori(true)}
              className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Kelas / Prodi Baru
            </button>
          </div>
          <div className="space-y-4">
            {daftarJenjang.map((j) => (
              <div key={j.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                <h3 className="font-black text-sm mb-3 uppercase text-slate-800">{j.nama}</h3>
                <div className="flex flex-wrap gap-2">
                  {j.subJenjang.map((sj) => (
                    <span
                      key={sj.id}
                      className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg border font-bold shadow-2xs"
                    >
                      {sj.nama}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTabAktif === "log" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-900">Log Aktivitas Real-Time</h2>
            <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl">
              {["semua", "guru", "siswa", "admin"].map((peran) => (
                <button
                  key={peran}
                  onClick={() => setFilterLog(peran)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${
                    filterLog === peran ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  {peran}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 max-h-[36rem] overflow-y-auto">
            {safeLogList
              .filter((l) => filterLog === "semua" || l.rolePelaku === filterLog)
              .map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border flex justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-slate-200 px-2 py-0.5 rounded mr-2">
                      {log.rolePelaku}
                    </span>
                    <b className="text-xs">{log.namaPelaku}:</b>{" "}
                    <span className="text-xs text-slate-600">{log.aksi}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.waktu}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderGuruView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div>
          <span className="bg-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Studio Pengajar
          </span>
          <h1 className="text-3xl font-black mt-3 mb-1">Selamat Mengajar, {userLogin?.nama}!</h1>
          <p className="text-indigo-200 text-sm">
            Anda memiliki otorisasi mengajar pada <b>{opsiKelasGuru.length} tingkat kelas/prodi</b>.
          </p>
        </div>
        <button
          onClick={() => {
            setUserLogin(null);
            localStorage.removeItem("hibah_user_aktif");
          }}
          className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setGuruTabAktif("materi")}
          className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition ${
            guruTabAktif === "materi"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Publikasi Materi (Rich Text)
        </button>
        <button
          onClick={() => setGuruTabAktif("kelas")}
          className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition ${
            guruTabAktif === "kelas"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Users className="w-4 h-4" /> Kelola Kelas & Cari Siswa ({guruKelompoks.length})
        </button>
      </div>

      {guruTabAktif === "materi" ? (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-4xl">
          <h2 className="text-2xl font-black mb-6 text-slate-900">
            Studio Pembuatan Materi Berformat & Kuis
          </h2>
          {opsiKelasGuru.length === 0 ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-rose-400" />
              <p className="text-rose-800 font-bold">
                Admin belum menugaskan kelas/tingkat untuk akun Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGuruBuatMateri} className="space-y-5">
              {notifGuru && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-sm text-center border border-emerald-200">
                  Materi berhasil diterbitkan ke ruang kelas!
                </div>
              )}
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <label className="font-black mb-2 block text-indigo-900 text-xs uppercase">
                  Pilih Target Kelas / Prodi Anda:
                </label>
                <select
                  required
                  value={subJenjangPilih}
                  onChange={(e) => setSubJenjangPilih(e.target.value)}
                  className="w-full p-3.5 bg-white border border-indigo-200 rounded-xl font-extrabold text-indigo-900 text-sm"
                >
                  <option value="" disabled>
                    -- Pilih Tingkat Kelas --
                  </option>
                  {opsiKelasGuru.map((sj) => (
                    <option key={sj.id} value={sj.id}>
                      {sj.namaInduk} - {sj.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold mb-1 block text-xs text-slate-500">Judul Materi</label>
                  <input
                    type="text"
                    required
                    value={judulMateri}
                    onChange={(e) => setJudulMateri(e.target.value)}
                    placeholder="Contoh: Hukum Newton..."
                    className="w-full p-3.5 border rounded-xl bg-slate-50 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold mb-1 block text-xs text-slate-500">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={levelMateri}
                    onChange={(e) =>
                      setLevelMateri(e.target.value as "Pemula" | "Menengah" | "Mahir")
                    }
                    className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold text-sm"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold mb-1 block text-xs text-slate-500">
                  URL Video YouTube
                </label>
                <input
                  type="url"
                  required
                  value={videoMateri}
                  onChange={(e) => setVideoMateri(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="font-bold mb-1.5 flex justify-between text-xs text-slate-500">
                  <span>Isi / Rangkuman Materi (Format Paragraf, Bullet, Numbering, Link, Image)</span>
                  <span className="text-indigo-600 font-bold">Rich Text Editor</span>
                </label>
                <RichTextEditor value={rangkumanMateri} onChange={setRangkumanMateri} />
              </div>

              <div>
                <label className="font-bold mb-1 block text-xs text-slate-500">
                  Rumus Penting (Opsional)
                </label>
                <input
                  type="text"
                  value={rumusMateri}
                  onChange={(e) => setRumusMateri(e.target.value)}
                  placeholder="Contoh: Ek = 1/2 m v^2"
                  className="w-full p-3.5 border rounded-xl bg-slate-900 text-emerald-300 font-mono text-sm"
                />
              </div>

              <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
                <div className="font-black text-sm">Kuis Evaluasi Siswa</div>
                <input
                  type="text"
                  required
                  value={pertanyaanKuis}
                  onChange={(e) => setPertanyaanKuis(e.target.value)}
                  placeholder="Pertanyaan kuis..."
                  className="w-full p-3.5 border bg-white rounded-xl text-sm font-semibold"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={opsiA}
                    onChange={(e) => setOpsiA(e.target.value)}
                    placeholder="Opsi A"
                    className="p-3 border bg-white rounded-xl text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={opsiB}
                    onChange={(e) => setOpsiB(e.target.value)}
                    placeholder="Opsi B"
                    className="p-3 border bg-white rounded-xl text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={opsiC}
                    onChange={(e) => setOpsiC(e.target.value)}
                    placeholder="Opsi C"
                    className="p-3 border bg-white rounded-xl text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={opsiD}
                    onChange={(e) => setOpsiD(e.target.value)}
                    placeholder="Opsi D"
                    className="p-3 border bg-white rounded-xl text-sm"
                  />
                </div>
                <select
                  value={kunciKuis}
                  onChange={(e) => setKunciKuis(Number(e.target.value))}
                  className="w-full p-3.5 border bg-emerald-50 text-emerald-900 rounded-xl font-black text-sm"
                >
                  <option value={0}>Kunci Jawaban: Opsi A</option>
                  <option value={1}>Kunci Jawaban: Opsi B</option>
                  <option value={2}>Kunci Jawaban: Opsi C</option>
                  <option value={3}>Kunci Jawaban: Opsi D</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg"
              >
                Terbitkan Materi Sekarang
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900">
            Kelola Kelas Anda & Cari Siswa (Nama / Email)
          </h2>
          <form
            onSubmit={handleGuruBuatKelompok}
            className="flex flex-wrap sm:flex-nowrap gap-3 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl"
          >
            <input
              type="text"
              required
              value={namaKelompokBaru}
              onChange={(e) => setNamaKelompokBaru(e.target.value)}
              placeholder="Nama Ruang Kelas Baru (Contoh: Fisika 11 MIPA 1)..."
              className="flex-1 p-3.5 rounded-xl border bg-white text-sm font-semibold"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black text-sm"
            >
              + Buat Kelas
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guruKelompoks.map((kel) => {
              const kataCari = searchSiswaGuru[kel.id] || "";
              const hasilCari = daftarSiswaApproved.filter(
                (s) =>
                  !kel.siswaIds.includes(s.id) &&
                  (s.nama.toLowerCase().includes(kataCari.toLowerCase()) ||
                    s.email.toLowerCase().includes(kataCari.toLowerCase()))
              );
              return (
                <div key={kel.id} className="p-6 border rounded-3xl bg-white shadow-2xs">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-lg text-indigo-950">{kel.namaKelas}</h3>
                    <button
                      onClick={() => handleHapusKelompok(kel.id)}
                      className="text-xs text-rose-600 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="text-xs font-bold text-slate-500 mb-4">
                    Total Anggota: {kel.siswaIds.length} Siswa
                  </div>

                  {/* Pencarian Siswa by Nama atau Email */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={kataCari}
                      onChange={(e) =>
                        setSearchSiswaGuru({ ...searchSiswaGuru, [kel.id]: e.target.value })
                      }
                      placeholder="Ketik nama atau email siswa untuk ditambahkan..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 mb-4 p-2 bg-slate-50 rounded-xl border">
                    {hasilCari.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center p-2 bg-white rounded-lg border text-xs"
                      >
                        <div>
                          <div className="font-bold">{s.nama}</div>
                          <div className="text-[10px] text-slate-400">{s.email}</div>
                        </div>
                        <button
                          onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                        >
                          + Tambah
                        </button>
                      </div>
                    ))}
                    {hasilCari.length === 0 && (
                      <div className="text-center text-xs text-slate-400 py-2">
                        Siswa tidak ditemukan / sudah masuk kelas.
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Daftar Siswa di Kelas Ini:
                    </div>
                    {kel.siswaIds.map((sId) => {
                      const sw = safeAkunList.find((a) => a.id === sId);
                      if (!sw) return null;
                      return (
                        <div
                          key={sId}
                          className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-xl text-xs"
                        >
                          <span className="font-bold">
                            {sw.nama} <span className="font-normal text-slate-400">({sw.email})</span>
                          </span>
                          <button
                            onClick={() => handleHapusSiswaDariKelompok(kel.id, sId)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderSiswaView = () => {
    const kelasSaya = daftarKelompok.filter((k) =>
      userLogin ? k.siswaIds.includes(userLogin.id) : false
    );
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
          <div>
            <span className="bg-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              Rapor Pelajar
            </span>
            <h1 className="text-3xl font-black mt-3 mb-1">Halo, {userLogin?.nama}!</h1>
            <p className="text-emerald-100 text-sm">
              Total XP: <b>{poinXP} XP</b> • Modul Selesai: <b>{materiSelesai.length} Modul</b>
            </p>
          </div>
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black mb-4">Ruang Kelas (Rombel) Anda</h2>
          {kelasSaya.length === 0 ? (
            <p className="text-sm text-slate-500">
              Anda belum dimasukkan ke dalam rombel khusus oleh Guru/Admin.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kelasSaya.map((k) => (
                <div key={k.id} className="p-4 border rounded-2xl bg-emerald-50/50 border-emerald-200">
                  <div className="font-black text-emerald-950">{k.namaKelas}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    Pengajar: {safeAkunList.find((a) => a.id === k.guruId)?.nama || "Guru"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // ==========================================
  // RENDER UTAMA
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-emerald-300/25 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">
              🐼
            </div>
            <div>
              <div className="font-extrabold text-xl text-slate-900 leading-none">HibahIlmu</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                LMS Open Source
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "beranda", label: "Ruang Kelas" },
              { id: "tryout", label: "Tryout Ujian" },
              { id: "forum", label: "Forum PR" },
              { id: "transparansi", label: "Donasi" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  menuAktif === tab.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>
            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className="relative px-5 py-2.5 rounded-full text-xs font-extrabold shadow-sm bg-emerald-600 text-white flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Daftar / Masuk"}</span>
              {jumlahPending > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full">
                  {jumlahPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {menuAktif === "dashboard" && (
          <div>
            {!userLogin && renderAuthView()}
            {userLogin && userLogin.role === "admin" && renderAdminView()}
            {userLogin && userLogin.role === "guru" && renderGuruView()}
            {userLogin && userLogin.role === "siswa" && renderSiswaView()}
          </div>
        )}

        {menuAktif === "tryout" && (
          <div className="max-w-3xl mx-auto">
            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-10 border text-center shadow-sm">
                <Timer className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-4">Simulasi Tryout Berwaktu</h2>
                <button
                  onClick={() => {
                    setJawabanUserTryout({});
                    setSisaWaktu(180);
                    setUjianSelesai(false);
                    setSedangUjian(true);
                  }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2"
                >
                  <Play className="w-5 h-5" /> Mulai Sekarang
                </button>
              </div>
            )}
            {sedangUjian && (
              <div className="space-y-6">
                <div className="text-right font-mono text-2xl font-black text-rose-600">
                  Sisa Waktu: {Math.floor(sisaWaktu / 60)}:
                  {(sisaWaktu % 60).toString().padStart(2, "0")}
                </div>
                {BANK_SOAL_TRYOUT.map((soal, i) => (
                  <div key={soal.id} className="bg-white p-8 rounded-3xl border shadow-sm">
                    <h3 className="font-extrabold text-lg mb-4">{soal.pertanyaan}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {soal.opsi.map((ops, idx) => (
                        <button
                          key={idx}
                          onClick={() => setJawabanUserTryout((p) => ({ ...p, [i]: idx }))}
                          className={`p-4 rounded-xl border-2 text-sm font-bold text-left ${
                            jawabanUserTryout[i] === idx
                              ? "bg-indigo-50 border-indigo-600 text-indigo-900"
                              : "border-slate-200"
                          }`}
                        >
                          {ops}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={selesaikanTryout}
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg"
                >
                  Kumpulkan Jawaban
                </button>
              </div>
            )}
            {ujianSelesai && (
              <div className="bg-white p-12 rounded-3xl border text-center shadow-lg">
                <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4" />
                <h2 className="text-4xl font-black mb-6">Skor Akhir: {skorTryout} / 100</h2>
                <button
                  onClick={() => {
                    setUjianSelesai(false);
                    setSedangUjian(false);
                  }}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold"
                >
                  Ulangi Tryout
                </button>
              </div>
            )}
          </div>
        )}

        {menuAktif === "forum" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 border rounded-3xl shadow-sm">
              <h2 className="font-black text-2xl mb-4 flex items-center gap-2">
                <HelpCircle className="text-emerald-600" /> Forum Diskusi & Tanya PR
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tanyaBaru.trim()) return;
                  setDaftarDiskusi([
                    {
                      id: "pr-" + Date.now(),
                      penanya: userLogin?.nama || "Pelajar",
                      jenjang: "Umum",
                      mapel: mapelBaru,
                      pertanyaan: tanyaBaru,
                      waktu: "Baru saja",
                      jawaban: [],
                    },
                    ...daftarDiskusi,
                  ]);
                  setTanyaBaru("");
                  tambahXP(20);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  value={mapelBaru}
                  onChange={(e) => setMapelBaru(e.target.value)}
                  placeholder="Mata Pelajaran..."
                  className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm"
                />
                <textarea
                  rows={3}
                  required
                  value={tanyaBaru}
                  onChange={(e) => setTanyaBaru(e.target.value)}
                  placeholder="Ketik pertanyaan PR kamu di sini..."
                  className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
                </button>
              </form>
            </div>

            {daftarDiskusi.map((d) => (
              <div key={d.id} className="bg-white p-6 border rounded-3xl shadow-sm">
                <div className="font-bold text-sm mb-2">
                  {d.mapel} • <span className="text-slate-500">{d.penanya}</span>
                </div>
                <p className="text-sm mb-4">{d.pertanyaan}</p>
                <div className="space-y-2 mb-4 pl-4 border-l-2 border-emerald-300">
                  {d.jawaban.map((j, i) => (
                    <div key={i} className="text-xs bg-emerald-50 p-3 rounded-xl">
                      <b>{j.penjawab}:</b> {j.isi}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={balasanInput[d.id] || ""}
                    onChange={(e) =>
                      setBalasanInput({ ...balasanInput, [d.id]: e.target.value })
                    }
                    placeholder="Bantu jawab..."
                    className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs"
                  />
                  <button
                    onClick={() => {
                      const isi = balasanInput[d.id];
                      if (!isi) return;
                      setDaftarDiskusi(
                        daftarDiskusi.map((x) =>
                          x.id === d.id
                            ? {
                                ...x,
                                jawaban: [
                                  ...x.jawaban,
                                  { penjawab: userLogin?.nama || "Relawan", isi },
                                ],
                              }
                            : x
                        )
                      );
                      setBalasanInput({ ...balasanInput, [d.id]: "" });
                      tambahXP(30);
                    }}
                    className="bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold"
                  >
                    Jawab
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {menuAktif === "transparansi" && (
          <div className="max-w-3xl mx-auto bg-slate-900 text-white p-12 rounded-[2.5rem] text-center shadow-2xl">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-3">Transparansi Dana Umat</h2>
            <p className="text-slate-300 text-sm mb-8 max-w-lg mx-auto">
              Donasi sukarela digunakan 100% untuk biaya server VPS & domain hibahilmu.id agar
              tetap gratis selamanya.
            </p>
            <div className="bg-white/10 p-6 rounded-2xl text-left">
              <div className="flex justify-between text-xs font-bold text-emerald-300 mb-2">
                <span>Terkumpul: Rp 850.000</span>
                <span>Target: Rp 1.500.000</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[56%] h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {menuAktif === "beranda" && (
          <div>
            {!jenjangAktif && !kelasAktif && (
              <div>
                <div className="text-center max-w-4xl mx-auto mb-14 pt-4">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="text-emerald-600">100% Gratis Selamanya.</span>
                  </h1>
                  <div className="max-w-xl mx-auto relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kataKunci}
                      onChange={(e) => setKataKunci(e.target.value)}
                      placeholder="Cari jenjang pendidikan (TK, SD, SMP, SMA, Kuliah)..."
                      className="w-full pl-14 pr-5 py-4 bg-white border rounded-2xl shadow-md text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {daftarJenjang
                    .filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase()))
                    .map((jenjang) => (
                      <div
                        key={jenjang.id}
                        onClick={() => {
                          setJenjangAktif(jenjang);
                          setSubJenjangAktif("semua");
                        }}
                        className="cursor-pointer bg-white rounded-3xl p-8 border shadow-2xs hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden"
                      >
                        <div
                          className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`}
                        />
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${jenjang.gradien} flex items-center justify-center shadow-md`}
                            >
                              {renderIkon(jenjang.ikonNama)}
                            </div>
                            <span
                              className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${jenjang.badge}`}
                            >
                              {jenjang.subJenjang.length} Tingkat
                            </span>
                          </div>
                          <h3 className="text-2xl font-black mb-2">{jenjang.nama}</h3>
                          <p className="text-slate-500 text-sm mb-6">{jenjang.deskripsi}</p>
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span>Pilih Kelas</span>
                          <span>→</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {jenjangAktif && !kelasAktif && (
              <div>
                <button
                  onClick={() => setJenjangAktif(null)}
                  className="mb-6 bg-white px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>
                <div
                  className={`rounded-3xl p-10 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8`}
                >
                  <h1 className="text-3xl sm:text-4xl font-black mb-2">{jenjangAktif.nama}</h1>
                  <p className="text-white/90 text-sm">{jenjangAktif.deskripsi}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    onClick={() => setSubJenjangAktif("semua")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                      subJenjangAktif === "semua" ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                  >
                    Semua Tingkat
                  </button>
                  {jenjangAktif.subJenjang.map((sj) => (
                    <button
                      key={sj.id}
                      onClick={() => setSubJenjangAktif(sj.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                        subJenjangAktif === sj.id ? "bg-slate-900 text-white" : "bg-white"
                      }`}
                    >
                      {sj.nama}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas
                    .filter(
                      (k) => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif
                    )
                    .map((k) => (
                      <div
                        key={k.id}
                        onClick={() => setKelasAktif(k)}
                        className="bg-white p-6 border-2 rounded-3xl cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg">
                              {jenjangAktif.subJenjang.find((s) => s.id === k.subJenjangId)?.nama ||
                                "Umum"}
                            </span>
                            {materiSelesai.includes(k.id) && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                Selesai
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{k.judul}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {stripHtml(k.rangkuman)}
                          </p>
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center text-sm font-bold text-indigo-600">
                          <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-5 h-5" /> Mulai Belajar
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                            +50 XP
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {kelasAktif && jenjangAktif && (
              <div>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <button
                    onClick={() => setKelasAktif(null)}
                    className="bg-white px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
                  </button>
                  <button
                    onClick={() => toggleSelesaiMateri(kelasAktif.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                      materiSelesai.includes(kelasAktif.id)
                        ? "bg-emerald-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {materiSelesai.includes(kelasAktif.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    {materiSelesai.includes(kelasAktif.id) ? "Selesai (+30 XP)" : "Tandai Selesai"}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border shadow-2xs">
                      <div className="aspect-video bg-slate-900 rounded-2xl mb-6 overflow-hidden">
                        <iframe
                          src={kelasAktif.videoUrl}
                          title={kelasAktif.judul}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <h1 className="text-2xl font-black mb-4">{kelasAktif.judul}</h1>
                      <div
                        className="prose prose-slate max-w-none text-sm leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: kelasAktif.rangkuman }}
                      />
                      {kelasAktif.rumusMatematika && (
                        <div className="p-5 bg-slate-900 text-amber-300 font-mono text-sm rounded-2xl whitespace-pre-wrap">
                          {kelasAktif.rumusMatematika}
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <FileEdit className="w-5 h-5 text-amber-700" /> Catatan Pribadi Siswa
                      </h3>
                      <textarea
                        rows={3}
                        value={catatanSiswa}
                        onChange={(e) => setCatatanSiswa(e.target.value)}
                        placeholder="Tulis catatan belajarmu di sini..."
                        className="w-full p-3.5 bg-white border border-amber-200 rounded-xl text-sm mb-3"
                      />
                      <button
                        onClick={() => {
                          localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa);
                          setStatusSimpanCatatan(true);
                          setTimeout(() => setStatusSimpanCatatan(false), 2000);
                        }}
                        className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                      >
                        Simpan Catatan
                      </button>
                      {statusSimpanCatatan && (
                        <span className="ml-3 text-xs font-bold text-emerald-700">Tersimpan!</span>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-md sticky top-24">
                      <h3 className="font-black text-base mb-4">{kelasAktif.kuis.tanya}</h3>
                      <div className="space-y-2.5">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setJawabanKuis(idx);
                              if (idx === kelasAktif.kuis.jawabanBenar) {
                                if (statusKuis !== "benar") tambahXP(50);
                                setStatusKuis("benar");
                              } else {
                                setStatusKuis("salah");
                              }
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border-2 font-semibold text-xs ${
                              jawabanKuis === idx
                                ? statusKuis === "benar"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                  : "border-rose-500 bg-rose-50 text-rose-900"
                                : "border-slate-200"
                            }`}
                          >
                            {opsi}
                          </button>
                        ))}
                      </div>
                      {statusKuis === "benar" && (
                        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold">
                          Benar! (+50 XP) — {kelasAktif.kuis.pembahasan}
                        </div>
                      )}
                      {statusKuis === "salah" && (
                        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold">
                          Belum tepat, silakan coba lagi!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL ADMIN: TAMBAH / EDIT AKUN & RBAC */}
        {modalAdminAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-black mb-4">
                {idEditAkun ? "Edit Akun & Penugasan" : "Buat Akun Baru"}
              </h3>
              <form onSubmit={simpanAkunAdmin} className="space-y-4 text-xs">
                <input
                  type="text"
                  required
                  value={namaFormAdmin}
                  onChange={(e) => setNamaFormAdmin(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full p-3 border rounded-xl"
                />
                <input
                  type="email"
                  required
                  value={emailFormAdmin}
                  onChange={(e) => setEmailFormAdmin(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 border rounded-xl"
                />
                <input
                  type="password"
                  value={passFormAdmin}
                  onChange={(e) => setPassFormAdmin(e.target.value)}
                  placeholder="Password (kosongkan jika tidak diubah)"
                  className="w-full p-3 border rounded-xl"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={roleFormAdmin}
                    onChange={(e) =>
                      setRoleFormAdmin(e.target.value as "admin" | "guru" | "siswa")
                    }
                    className="p-3 border rounded-xl font-bold"
                  >
                    <option value="siswa">Siswa / Mahasiswa</option>
                    <option value="guru">Guru Relawan</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    value={statusFormAdmin}
                    onChange={(e) =>
                      setStatusFormAdmin(e.target.value as "approved" | "pending" | "rejected")
                    }
                    className="p-3 border rounded-xl font-bold"
                  >
                    <option value="approved">Approved (Aktif)</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Suspended</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={infoFormAdmin}
                  onChange={(e) => setInfoFormAdmin(e.target.value)}
                  placeholder="Info Tambahan (Kelas / Mapel)"
                  className="w-full p-3 border rounded-xl"
                />

                {roleFormAdmin === "guru" && (
                  <div className="p-4 border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl">
                    <div className="font-black text-indigo-950 mb-3 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> Pilih Hak Akses Kelas/Prodi Guru:
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-3">
                      {daftarJenjang.map((j) => (
                        <div key={j.id} className="bg-white p-3 rounded-xl border">
                          <div className="font-bold text-[10px] uppercase text-slate-400 mb-2">
                            {j.nama}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {j.subJenjang.map((sj) => (
                              <label
                                key={sj.id}
                                className="flex items-center gap-2 text-xs font-bold cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={aksesMengajarForm.includes(sj.id)}
                                  onChange={() =>
                                    setAksesMengajarForm((prev) =>
                                      prev.includes(sj.id)
                                        ? prev.filter((x) => x !== sj.id)
                                        : [...prev, sj.id]
                                    )
                                  }
                                />
                                {sj.nama}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl"
                  >
                    Simpan Akun
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalAdminAkun(false)}
                    className="px-5 py-3 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL IMPORT JSON */}
        {modalImportAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" /> Import Akun Massal (JSON)
              </h3>
              {notifImport && (
                <div className="p-3 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl">
                  {notifImport}
                </div>
              )}
              <button
                type="button"
                onClick={() => setTeksImportJson(TEMPLATE_JSON_CONTOH)}
                className="text-xs font-bold text-indigo-600 underline"
              >
                Muat Contoh Template JSON
              </button>
              <form onSubmit={handleImportJson} className="space-y-3">
                <textarea
                  rows={8}
                  required
                  value={teksImportJson}
                  onChange={(e) => setTeksImportJson(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs"
                  >
                    Proses Import
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalImportAkun(false)}
                    className="px-5 py-3 bg-slate-100 rounded-xl font-bold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH KATEGORI / PRODI */}
        {modalKategori && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-black mb-4">Tambah Tingkat Kelas / Prodi</h3>
              <form onSubmit={tambahKategoriBaru} className="space-y-4 text-xs">
                <select
                  value={targetJenjangKategori}
                  onChange={(e) => setTargetJenjangKategori(e.target.value)}
                  className="w-full p-3 border rounded-xl font-bold"
                >
                  {daftarJenjang.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nama}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={namaKategoriBaru}
                  onChange={(e) => setNamaKategoriBaru(e.target.value)}
                  placeholder="Contoh: S1 Teknik Elektro / Kelas 12 Bahasa"
                  className="w-full p-3 border rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalKategori(false)}
                    className="px-4 py-3 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t bg-white py-8 text-center text-xs text-slate-500 mt-16">
        Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • HibahIlmu.id
      </footer>
    </div>
  );
}