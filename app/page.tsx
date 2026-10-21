"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  LogOut,
  KeyRound,
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
  FileSpreadsheet
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

// ==========================================
// 2. DATA AWAL (DUMMY DATA)
// ==========================================
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
        rangkuman: "Mari belajar menghitung buah-buahan! Angka 1 seperti tiang listrik, angka 2 seperti bebek berenang.",
        rumusMatematika: "2 🍎 + 1 🍎 = 3 🍎 (Tiga Apel Segar)",
        kuis: { tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi sekarang?", opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"], jawabanBenar: 1, pembahasan: "Hebat sekali! 2 apel ditambah 1 apel menjadi 3 apel!" },
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
      { id: "sd-1", nama: "Kelas 1 SD" }, { id: "sd-2", nama: "Kelas 2 SD" }, { id: "sd-3", nama: "Kelas 3 SD" },
      { id: "sd-4", nama: "Kelas 4 SD" }, { id: "sd-5", nama: "Kelas 5 SD" }, { id: "sd-6", nama: "Kelas 6 SD" },
    ],
    kelas: [
      {
        id: "materi-sd-1",
        subJenjangId: "sd-4",
        judul: "Rahasia Perkalian Cepat & Luas Bangun Datar",
        level: "Pemula",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/mvOkMYCygps",
        rangkuman: "Perkalian adalah penjumlahan yang berulang! Digunakan juga untuk menghitung luas persegi panjang dan segitiga.",
        rumusMatematika: "Luas Segitiga = ½ × Alas (a) × Tinggi (t)",
        kuis: { tanya: "Sebuah segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapakah luasnya?", opsi: ["10 cm²", "12 cm²", "24 cm²", "18 cm²"], jawabanBenar: 1, pembahasan: "Tepat! Luas = ½ × 6 × 4 = 12 cm²." },
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
      { id: "smp-7", nama: "Kelas 7 SMP" }, { id: "smp-8", nama: "Kelas 8 SMP" }, { id: "smp-9", nama: "Kelas 9 SMP" },
    ],
    kelas: [
      {
        id: "materi-smp-1",
        subJenjangId: "smp-8",
        judul: "Persamaan Aljabar & Teorema Pythagoras",
        level: "Menengah",
        durasi: "12 Menit",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        rangkuman: "Aljabar menggunakan variabel x atau y untuk mencari angka misterius. Pythagoras membantu mencari sisi miring segitiga siku-siku.",
        rumusMatematika: "Rumus Pythagoras: a² + b² = c²  ⟹  c = √(a² + b²)",
        kuis: { tanya: "Jika segitiga siku-siku memiliki alas a = 3 cm dan tinggi b = 4 cm, berapakah sisi miringnya (c)?", opsi: ["c = 5 cm", "c = 6 cm", "c = 7 cm", "c = 25 cm"], jawabanBenar: 0, pembahasan: "Luar biasa! c = √(3² + 4²) = √25 = 5 cm." },
      },
    ],
  },
  {
    id: "sma",
    nama: "SMA / SMK",
    tagline: "Persiapan Masa Depan",
    deskripsi: "Kalkulus, Fisika mekanika, Kimia, Ekonomi & UTBK.",
    gradien: "from-violet-600 via-purple-600 to-fuchsia-600",
    badge: "bg-purple-100 text-purple-800",
    ikonNama: "school",
    subJenjang: [
      { id: "sma-10", nama: "Kelas 10 Umum" }, { id: "sma-11-ipa", nama: "Kelas 11 MIPA" }, { id: "sma-11-ips", nama: "Kelas 11 IPS" },
      { id: "sma-12-ipa", nama: "Kelas 12 MIPA" }, { id: "sma-12-ips", nama: "Kelas 12 IPS" },
    ],
    kelas: [
      {
        id: "materi-sma-1",
        subJenjangId: "sma-11-ipa",
        judul: "Fisika Mekanika, Hukum Newton & Energi Kinetik",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman: "Gaya berbanding lurus dengan massa dan percepatan benda. Energi kinetik bergantung pada kuadrat kecepatan.",
        rumusMatematika: "Hukum II Newton: ∑F = m · a\nEnergi Kinetik: Ek = ½ · m · v²",
        kuis: { tanya: "Sebuah benda bermassa 4 kg bergerak dengan kecepatan 3 m/s. Berapakah Energi Kinetiknya (Ek)?", opsi: ["6 Joule", "12 Joule", "18 Joule", "36 Joule"], jawabanBenar: 2, pembahasan: "Tepat! Ek = ½ · 4 · (3²) = 2 · 9 = 18 Joule." },
      },
    ],
  },
  {
    id: "kuliah",
    nama: "Kuliah & Karier",
    tagline: "Keahlian Profesional & IT",
    deskripsi: "Pemrograman Web, Artificial Intelligence, Bisnis & Desain.",
    gradien: "from-emerald-500 via-teal-600 to-cyan-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikonNama: "graduation",
    subJenjang: [
      { id: "pt-ti", nama: "S1 Teknik Informatika" }, { id: "pt-si", nama: "S1 Sistem Informasi" }, { id: "pt-dkv", nama: "S1 DKV" },
    ],
    kelas: [
      {
        id: "materi-kuliah-1",
        subJenjangId: "pt-ti",
        judul: "Fullstack Next.js Dasar",
        level: "Mahir",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman: "React menggunakan komponen dan Hook seperti useState.",
        contohKode: `const [xp, setXp] = useState(0);\nreturn <button onClick={() => setXp(xp + 10)}>XP: {xp}</button>;`,
        kuis: { tanya: "Hook untuk menyimpan data berubah-ubah di React?", opsi: ["useRouter()", "useState()", "useEffect()", "useMemo()"], jawabanBenar: 1, pembahasan: "useState() adalah fondasi utama state management di React." },
      },
    ],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  { id: "to-1", jenjang: "SD", pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 × 3) - 10 adalah...", rumus: "KABATAKU", opsi: ["51", "101", "61", "45"], jawabanBenar: 0, pembahasan: "12×3=36. 25+36-10=51." },
  { id: "to-2", jenjang: "SMP", pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?", rumus: "Substitusi x=4", opsi: ["5", "7", "12", "17"], jawabanBenar: 1, pembahasan: "3(4)-5=7." },
];

const AKUN_DEFAULT: AkunPengguna[] = [
  { id: "adm-1", nama: "Admin Panda Kode", email: "admin@hibahilmu.id", password: "123", role: "admin", status: "approved", infoTambahan: "Super Admin HibahIlmu", waktuDaftar: "Permanen", aksesMengajar: [] },
  { id: "gru-1", nama: "Budi Santoso, M.Pd", email: "guru@hibahilmu.id", password: "123", role: "guru", status: "approved", infoTambahan: "Guru Fisika SMA", waktuDaftar: "Kemarin", aksesMengajar: ["sma-11-ipa", "sma-12-ipa"] },
  { id: "sis-1", nama: "Aisyah Putri", email: "siswa@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswi SMA Kelas 11", waktuDaftar: "Kemarin", aksesMengajar: [] },
];

const LOG_AWAL: LogAktivitas[] = [
  { id: "log-1", waktu: "06:30 WIB", namaPelaku: "Budi Santoso, M.Pd", rolePelaku: "guru", aksi: "Mengunggah materi Hukum Newton", kategori: "materi" },
];

const TEMPLATE_JSON_CONTOH = JSON.stringify([
  { nama: "Dewi Lestari", email: "dewi@hibahilmu.id", password: "123", role: "guru", infoTambahan: "Guru Biologi" },
  { nama: "Ahmad Fauzi", email: "ahmad@hibahilmu.id", password: "123", role: "siswa", infoTambahan: "Kelas 12 IPA" }
], null, 2);


// ==========================================
// 3. KOMPONEN UTAMA APLIKASI
// ==========================================
export default function AplikasiHibahIlmu() {
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(STRUKTUR_AWAL);
  
  // State Navigasi Ruang Kelas
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [subJenjangAktif, setSubJenjangAktif] = useState<string>("semua");
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");

  // State Sistem Akun
  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);

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
        { penjawab: "Panda Kode (Mentor)", isi: "Luas selalu pangkat dua (π × r²), keliling tidak ada pangkat (2 × π × r)." },
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
  const [filterLog, setFilterLog] = useState<string>("semua");

  // State Admin Tambah & Edit Akun
  const [modalAdminAkun, setModalAdminAkun] = useState<boolean>(false);
  const [idEditAkun, setIdEditAkun] = useState<string | null>(null);
  const [namaFormAdmin, setNamaFormAdmin] = useState("");
  const [emailFormAdmin, setEmailFormAdmin] = useState("");
  const [passFormAdmin, setPassFormAdmin] = useState("");
  const [roleFormAdmin, setRoleFormAdmin] = useState<"admin" | "guru" | "siswa">("siswa");
  const [statusFormAdmin, setStatusFormAdmin] = useState<"approved" | "pending" | "rejected">("approved");
  const [infoFormAdmin, setInfoFormAdmin] = useState("");
  const [aksesMengajarForm, setAksesMengajarForm] = useState<string[]>([]);

  // State Admin Bulk Delete & Import JSON/CSV
  const [selectedAkunIds, setSelectedAkunIds] = useState<string[]>([]);
  const [modalImportAkun, setModalImportAkun] = useState<boolean>(false);
  const [teksImportJson, setTeksImportJson] = useState<string>("");
  const [notifImport, setNotifImport] = useState<string>("");

  // State Admin Tambah Kategori
  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // State Guru Buat Materi
  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [mapelMateri, setMapelMateri] = useState("");
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

  // --- USE EFFECTS ---
  useEffect(() => {
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    const savedAkunList = localStorage.getItem("hibah_daftar_akun");
    const savedUserAktif = localStorage.getItem("hibah_user_aktif");
    const savedLogs = localStorage.getItem("hibah_log_aktivitas");
    const savedStruktur = localStorage.getItem("hibah_struktur");

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
    if (savedStruktur) setDaftarJenjang(JSON.parse(savedStruktur));
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
      const savedCatatan = localStorage.getItem(`catatan_${kelasAktif.id}`);
      setCatatanSiswa(savedCatatan || "");
      setJawabanKuis(null);
      setStatusKuis(null);
    }
  }, [kelasAktif]);

  // --- LOGGING & XP SYSTEM ---
  const catatLog = (namaPelaku: string, rolePelaku: "admin" | "guru" | "siswa", aksi: string, kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem") => {
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const logBaru: LogAktivitas = { id: "log-" + Date.now(), waktu: `${jam} WIB`, namaPelaku, rolePelaku, aksi, kategori };
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
      let daftarBaru: string[];
      if (sudahAda) {
        daftarBaru = safePrev.filter((id) => id !== kelasId);
      } else {
        daftarBaru = [...safePrev, kelasId];
        tambahXP(30);
        catatLog(userLogin?.nama || "Siswa", userLogin?.role || "siswa", `Menyelesaikan materi pelajaran`, "belajar");
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  // --- AUTHENTICATION ---
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun kamu masih menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun ini sedang disuspend (dibekukan).");
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Berhasil masuk ke Dashboard`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const akunDitemukan = (daftarAkun || []).find((a) => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin);
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending") return setPesanError("⏳ Akun menunggu persetujuan Admin.");
    if (akunDitemukan.status === "rejected") return setPesanError("❌ Akun ini telah disuspend.");
    
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Melakukan Login`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    if ((daftarAkun || []).some((a) => a.email.toLowerCase() === emailReg.toLowerCase())) {
      return setPesanError("Email sudah terdaftar.");
    }
    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg, email: emailReg, password: passwordReg,
      role: roleReg, status: "pending", infoTambahan: infoReg || "Pengguna Baru",
      waktuDaftar: "Baru saja", aksesMengajar: []
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, `Mendaftar akun baru (Menunggu Approval)`, "akun");
    setPesanSukses("✅ Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg(""); setEmailReg(""); setPasswordReg(""); setInfoReg("");
    setModeAuth("login");
  };

  // --- ADMIN FUNCTIONS ---
  const ubahStatusAkun = (id: string, statusBaru: "approved" | "rejected" | "pending") => {
    const target = (daftarAkun || []).find(a => a.id === id);
    if (!target) return;
    const update = (daftarAkun || []).map(a => a.id === id ? { ...a, status: statusBaru } : a);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    let aksiLog = `Mengubah status akun ${target.nama} menjadi ${statusBaru}`;
    if (statusBaru === "rejected") aksiLog = `Men-suspend (membekukan) akun ${target.nama}`;
    if (statusBaru === "approved") aksiLog = `Menyetujui / Mengaktifkan akun ${target.nama}`;
    catatLog(userLogin?.nama || "Admin", "admin", aksiLog, "akun");
  };

  const hapusAkun = (id: string) => {
    const target = (daftarAkun || []).find(a => a.id === id);
    if (!target || target.role === "admin") return;
    const update = (daftarAkun || []).filter(a => a.id !== id);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Menghapus permanen akun ${target.nama}`, "akun");
  };

  const hapusAkunSekaligus = () => {
    if (selectedAkunIds.length === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedAkunIds.length} akun secara permanen?`)) return;
    const update = (daftarAkun || []).filter((a) => !selectedAkunIds.includes(a.id) || a.role === "admin");
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Menghapus massal ${selectedAkunIds.length} akun`, "akun");
    setSelectedAkunIds([]);
  };

  const togglePilihAkun = (id: string) => {
    setSelectedAkunIds((prev) => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const bukaModalEditAkun = (akun: AkunPengguna) => {
    setIdEditAkun(akun.id);
    setNamaFormAdmin(akun.nama); setEmailFormAdmin(akun.email); setPassFormAdmin("");
    setRoleFormAdmin(akun.role); setStatusFormAdmin(akun.status); setInfoFormAdmin(akun.infoTambahan);
    setAksesMengajarForm(akun.aksesMengajar || []);
    setModalAdminAkun(true);
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(teksImportJson);
      if (!Array.isArray(parsedData)) return alert("Format JSON harus berupa Array [...]");

      const akunBaruMasuk: AkunPengguna[] = parsedData.map((item: any, idx: number) => ({
        id: "import-" + Date.now() + "-" + idx,
        nama: item.nama || "Tanpa Nama", email: item.email || `user${idx}@hibahilmu.id`,
        password: item.password || "123", role: item.role === "guru" || item.role === "admin" ? item.role : "siswa",
        status: "approved", infoTambahan: item.infoTambahan || "Diimpor massal", waktuDaftar: "Massal Import", aksesMengajar: []
      }));

      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      catatLog(userLogin?.nama || "Admin", "admin", `Berhasil mengimpor ${akunBaruMasuk.length} akun baru`, "akun");
      
      setNotifImport(`✅ Sukses mengimpor ${akunBaruMasuk.length} akun baru!`);
      setTeksImportJson("");
      setTimeout(() => { setNotifImport(""); setModalImportAkun(false); }, 2500);
    } catch (err) {
      alert("Format JSON tidak valid! Pastikan memakai tanda kutip ganda dan penutup yang benar.");
    }
  };

  const simpanAkunAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (idEditAkun) {
      const update = (daftarAkun || []).map((a) => a.id === idEditAkun ? {
        ...a, nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || a.password,
        role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin,
        aksesMengajar: roleFormAdmin === "guru" ? aksesMengajarForm : []
      } : a);
      setDaftarAkun(update);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
      catatLog(userLogin?.nama || "Admin", "admin", `Mengedit data & hak akses akun: ${namaFormAdmin}`, "akun");
    } else {
      const akunBaru: AkunPengguna = {
        id: "adm-usr-" + Date.now(), nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || "123",
        role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin || "Dibuat Admin", waktuDaftar: "Oleh Admin", aksesMengajar: aksesMengajarForm
      };
      const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
      setDaftarAkun(daftarTerbaru);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
      catatLog(userLogin?.nama || "Admin", "admin", `Membuat akun baru: ${namaFormAdmin}`, "akun");
    }
    setModalAdminAkun(false);
  };

  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategoriBaru.trim()) return;
    const idBaru = `sub-${Date.now()}`;
    const update = daftarJenjang.map(j => j.id === targetJenjangKategori ? { ...j, subJenjang: [...j.subJenjang, { id: idBaru, nama: namaKategoriBaru }] } : j);
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Menambahkan kelas/jurusan baru: ${namaKategoriBaru}`, "sistem");
    setModalKategori(false); setNamaKategoriBaru("");
  };

  // --- GURU FUNCTIONS ---
  const opsiKelasGuru = (daftarJenjang || []).flatMap(j => 
    j.subJenjang.filter(sj => userLogin?.aksesMengajar?.includes(sj.id)).map(sj => ({ ...sj, namaInduk: j.nama }))
  );

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !subJenjangPilih) return;
    let finalEmbed = videoMateri.includes("watch?v=") ? videoMateri.replace("watch?v=", "embed/") : videoMateri;
    
    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(), subJenjangId: subJenjangPilih, judul: `${judulMateri} (Oleh: ${userLogin.nama})`, level: levelMateri,
      durasi: "15 Menit", videoUrl: finalEmbed, rangkuman: rangkumanMateri, rumusMatematika: rumusMateri || undefined,
      kuis: { tanya: pertanyaanKuis, opsi: [opsiA, opsiB, opsiC, opsiD], jawabanBenar: kunciKuis, pembahasan: `Oleh Guru ${userLogin.nama}.` },
    };

    const update = daftarJenjang.map(j => j.subJenjang.some(sj => sj.id === subJenjangPilih) ? { ...j, kelas: [modulBaru, ...j.kelas] } : j);
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    catatLog(userLogin.nama, "guru", `Menerbitkan modul: "${judulMateri}"`, "materi");
    setNotifGuru(true);
    setJudulMateri(""); setVideoMateri(""); setRangkumanMateri(""); setRumusMateri(""); setPertanyaanKuis("");
    setOpsiA(""); setOpsiB(""); setOpsiC(""); setOpsiD("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  const selesaikanTryout = () => {
    let benar = 0;
    BANK_SOAL_TRYOUT.forEach((soal, idx) => { if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++; });
    setSkorTryout(Math.round((benar / BANK_SOAL_TRYOUT.length) * 100));
    setUjianSelesai(true); setSedangUjian(false);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Aurora */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-emerald-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER UTAMA */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">🐼</div>
            <div>
              <div className="font-extrabold text-xl text-slate-900 leading-none">HibahIlmu</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">LMS Open Source</div>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 overflow-x-auto">
            <button onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${menuAktif === "beranda" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Ruang Kelas</button>
            <button onClick={() => setMenuAktif("tryout")} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${menuAktif === "tryout" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Tryout</button>
            <button onClick={() => setMenuAktif("forum")} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${menuAktif === "forum" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Forum PR</button>
            <button onClick={() => setMenuAktif("transparansi")} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${menuAktif === "transparansi" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Donasi</button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>
            <button onClick={() => { setMenuAktif("dashboard"); setJenjangAktif(null); setKelasAktif(null); }} className={`relative px-5 py-2.5 rounded-full text-xs font-extrabold shadow-sm transition flex items-center gap-2 ${userLogin ? (userLogin.role === "admin" ? "bg-slate-900 text-amber-300" : userLogin.role === "guru" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white") : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Daftar / Masuk"}</span>
              {jumlahPending > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{jumlahPending}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* ==========================================
            1. PORTAL DASHBOARD (MULTI-ROLE)
        ========================================== */}
        {menuAktif === "dashboard" && (
          <AnimatePresence mode="wait">
            {!userLogin ? (
              <motion.div key="auth" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Kolom Form Login/Daftar */}
                <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white">
                  <div className="flex gap-2 mb-8 bg-slate-100/80 p-1.5 rounded-2xl">
                    <button onClick={() => { setModeAuth("login"); setPesanError(""); }} className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${modeAuth === "login" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>Masuk Akun</button>
                    <button onClick={() => { setModeAuth("register"); setPesanError(""); }} className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${modeAuth === "register" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>Daftar Baru</button>
                  </div>
                  
                  {pesanError && <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold">{pesanError}</div>}
                  {pesanSukses && <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold">{pesanSukses}</div>}
                  
                  {modeAuth === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div><h2 className="text-3xl font-black text-slate-900">Selamat Datang!</h2><p className="text-slate-500 text-sm mt-1">Masuk ke portal pembelajaran gratis HibahIlmu.</p></div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Email</label>
                        <input type="email" required value={emailLogin} onChange={e => setEmailLogin(e.target.value)} placeholder="Contoh: admin@hibahilmu.id" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Password</label>
                        <input type="password" required value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} placeholder="••••••" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition">Masuk Sekarang</button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div><h2 className="text-3xl font-black text-slate-900">Pendaftaran Akun</h2><p className="text-slate-500 text-sm mt-1">Akun memerlukan validasi dari Admin.</p></div>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setRoleReg("siswa")} className={`p-4 border-2 rounded-2xl text-left transition ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "border-slate-200"}`}><div className="font-extrabold text-sm">🎓 Siswa</div><div className="text-[10px] text-slate-500 mt-1">Belajar Gratis</div></button>
                        <button type="button" onClick={() => setRoleReg("guru")} className={`p-4 border-2 rounded-2xl text-left transition ${roleReg === "guru" ? "bg-indigo-50 border-indigo-500 text-indigo-900" : "border-slate-200"}`}><div className="font-extrabold text-sm">👨‍🏫 Guru Relawan</div><div className="text-[10px] text-slate-500 mt-1">Sumbang Materi</div></button>
                      </div>
                      <input type="text" required value={namaReg} onChange={e => setNamaReg(e.target.value)} placeholder="Nama Lengkap..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <input type="email" required value={emailReg} onChange={e => setEmailReg(e.target.value)} placeholder="Email Aktif..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <input type="password" required value={passwordReg} onChange={e => setPasswordReg(e.target.value)} placeholder="Buat Password..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <input type="text" required value={infoReg} onChange={e => setInfoReg(e.target.value)} placeholder={roleReg === "guru" ? "Mata Pelajaran (contoh: Biologi SMA)" : "Asal Sekolah / Kelas..."} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition">Daftar & Ajukan Akses</button>
                    </form>
                  )}
                </div>

                {/* Kolom Demo 1-Klik */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">⚡ Pengujian Cepat</span>
                    <h3 className="text-2xl font-black mt-4 mb-3">Mode Demo 1-Klik</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-8">Uji fitur multi-dashboard Admin, Guru, dan Siswa tanpa perlu mengetik email & password.</p>
                    <div className="space-y-3">
                      {safeAkunList.filter(a => a.status === "approved").slice(0, 4).map(a => (
                        <button key={a.id} onClick={() => loginCepat(a)} className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between group">
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              {a.nama}
                              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${a.role === 'admin' ? 'bg-amber-500 text-slate-900' : a.role === 'guru' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-slate-900'}`}>{a.role}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">{a.email}</div>
                          </div>
                          <span className="text-xs font-bold text-amber-300 group-hover:translate-x-1 transition">Masuk →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "admin" ? (
              /* ==================== DASHBOARD ADMIN ==================== */
              <motion.div key="admin" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">👑 Panel Super Admin</span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Pusat Kendali HibahIlmu</h1>
                    <p className="text-slate-300 text-sm">Kelola pendaftaran, hak akses guru, hierarki kategori, dan pantau log aktivitas sistem.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    <button onClick={() => setModalImportAkun(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"><Upload className="w-4 h-4"/> Import JSON</button>
                    <button onClick={() => { setIdEditAkun(null); setModalAdminAkun(true); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"><UserPlus className="w-4 h-4"/> Tambah Akun</button>
                    <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"><LogOut className="w-4 h-4"/> Keluar</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Pending</div><div className="text-4xl font-black text-slate-900">{safeAkunList.filter(a => a.status === "pending").length}</div></div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Guru Aktif</div><div className="text-4xl font-black text-slate-900">{safeAkunList.filter(a => a.role === "guru" && a.status === "approved").length}</div></div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Siswa</div><div className="text-4xl font-black text-slate-900">{safeAkunList.filter(a => a.role === "siswa" && a.status === "approved").length}</div></div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Log Server</div><div className="text-4xl font-black text-slate-900">{safeLogList.length}</div></div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  {/* KOLOM KIRI ADMIN (AKUN & JURUSAN) */}
                  <div className="xl:col-span-7 space-y-8">
                    {/* Daftar Akun */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h2 className="text-xl font-black flex items-center gap-2 text-slate-900"><Users className="w-5 h-5 text-indigo-600"/> Manajemen Seluruh Akun</h2>
                        {selectedAkunIds.length > 0 && <button onClick={hapusAkunSekaligus} className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"><Trash2 className="w-4 h-4"/> Hapus {selectedAkunIds.length} Terpilih</button>}
                      </div>
                      <div className="space-y-3 max-h-[40rem] overflow-y-auto pr-2">
                        {safeAkunList.map(akun => (
                          <div key={akun.id} className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${akun.status === 'pending' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-start gap-3">
                              {akun.role !== "admin" && <input type="checkbox" checked={selectedAkunIds.includes(akun.id)} onChange={() => togglePilihAkun(akun.id)} className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer" />}
                              <div>
                                <div className="font-extrabold text-sm flex flex-wrap items-center gap-2 text-slate-900">
                                  {akun.nama}
                                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-black tracking-widest ${akun.role === 'admin' ? 'bg-amber-100 text-amber-900' : akun.role === 'guru' ? 'bg-indigo-100 text-indigo-900' : 'bg-emerald-100 text-emerald-900'}`}>{akun.role}</span>
                                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-black tracking-widest ${akun.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : akun.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{akun.status === 'rejected' ? 'Suspended' : akun.status}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{akun.email} • {akun.infoTambahan}</div>
                                {akun.role === "guru" && (
                                  <div className="text-[10px] font-bold text-indigo-600 mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded border border-indigo-100">
                                    Akses: {akun.aksesMengajar?.length || 0} Kelas
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              {akun.status === "pending" && <button onClick={() => ubahStatusAkun(akun.id, "approved")} title="Setujui Pendaftaran" className="flex-1 sm:flex-none p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition flex justify-center"><UserCheck className="w-4 h-4"/></button>}
                              {akun.status === "approved" && akun.role !== "admin" && <button onClick={() => ubahStatusAkun(akun.id, "rejected")} title="Suspend Akun" className="flex-1 sm:flex-none p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition flex justify-center"><UserX2 className="w-4 h-4"/></button>}
                              {akun.status === "rejected" && <button onClick={() => ubahStatusAkun(akun.id, "approved")} title="Aktifkan Kembali" className="flex-1 sm:flex-none p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition flex justify-center"><UserCheck2 className="w-4 h-4"/></button>}
                              <button onClick={() => bukaModalEditAkun(akun)} title="Edit Akun & RBAC" className="flex-1 sm:flex-none p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition flex justify-center"><Edit3 className="w-4 h-4"/></button>
                              {akun.role !== "admin" && <button onClick={() => hapusAkun(akun.id)} title="Hapus Permanen" className="flex-1 sm:flex-none p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition flex justify-center"><Trash2 className="w-4 h-4"/></button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manajemen Kategori */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h2 className="text-xl font-black flex items-center gap-2 text-slate-900"><Layers className="w-5 h-5 text-amber-500"/> Kategori & Jurusan</h2>
                        <button onClick={() => setModalKategori(true)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition"><PlusCircle className="w-4 h-4"/> Tambah Kategori Baru</button>
                      </div>
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {daftarJenjang.map(j => (
                          <div key={j.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                            <h3 className="font-extrabold text-sm mb-3 text-slate-900 uppercase tracking-widest">{j.nama}</h3>
                            <div className="flex flex-wrap gap-2">
                              {j.subJenjang.map(sj => <span key={sj.id} className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">{sj.nama}</span>)}
                              {j.subJenjang.length === 0 && <span className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg">Belum ada kategori/kelas spesifik.</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* KOLOM KANAN ADMIN (LOG AKTIVITAS) */}
                  <div className="xl:col-span-5">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black flex items-center gap-2 text-slate-900"><Activity className="w-5 h-5 text-emerald-600"/> Audit Log Server</h2>
                      </div>
                      <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6 overflow-x-auto">
                        {["semua", "guru", "siswa", "admin"].map(peran => (
                          <button key={peran} onClick={() => setFilterLog(peran)} className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${filterLog === peran ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{peran}</button>
                        ))}
                      </div>
                      <div className="space-y-3 max-h-[50rem] overflow-y-auto pr-2">
                        {safeLogList.filter(l => filterLog === "semua" || l.rolePelaku === filterLog).map((log) => (
                          <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 transition hover:bg-slate-100">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${log.rolePelaku === 'admin' ? 'bg-amber-100 text-amber-900' : log.rolePelaku === 'guru' ? 'bg-indigo-100 text-indigo-900' : 'bg-emerald-100 text-emerald-900'}`}>{log.rolePelaku}</span>
                                <span className="font-extrabold text-xs text-slate-900">{log.namaPelaku}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">{log.waktu}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{log.aksi}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL ADMIN: EDIT / TAMBAH AKUN & RBAC */}
                <AnimatePresence>
                  {modalAdminAkun && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
                        <h3 className="text-2xl font-black mb-6 text-slate-900">{idEditAkun ? "Edit Data Pengguna" : "Buat Akun Baru (Oleh Admin)"}</h3>
                        <form onSubmit={simpanAkunAdmin} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Nama Lengkap</label><input type="text" required value={namaFormAdmin} onChange={e => setNamaFormAdmin(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Email Akun</label><input type="email" required value={emailFormAdmin} onChange={e => setEmailFormAdmin(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Password {idEditAkun && <span className="normal-case font-normal text-slate-400">(Kosongkan jika tidak diubah)</span>}</label>
                            <input type="password" value={passFormAdmin} onChange={e => setPassFormAdmin(e.target.value)} placeholder="••••••" className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Role / Peran</label>
                              <select value={roleFormAdmin} onChange={e => setRoleFormAdmin(e.target.value as any)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="siswa">🎓 Siswa</option>
                                <option value="guru">👨‍🏫 Guru Relawan</option>
                                <option value="admin">👑 Admin</option>
                              </select>
                            </div>
                            <div>
                              <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Status Akun</label>
                              <select value={statusFormAdmin} onChange={e => setStatusFormAdmin(e.target.value as any)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="approved">✅ Aktif (Approved)</option>
                                <option value="pending">⏳ Pending</option>
                                <option value="rejected">❌ Suspended</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Info Tambahan (Mapel / Instansi)</label>
                            <input type="text" value={infoFormAdmin} onChange={e => setInfoFormAdmin(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>

                          {/* KHUSUS GURU: PANEL SELEKSI HAK AKSES MENGAJAR (RBAC) */}
                          {roleFormAdmin === "guru" && (
                            <div className="mt-6 p-5 border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl shadow-inner">
                              <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-2"><Lock className="w-4 h-4"/> Berikan Akses Mengajar (RBAC):</h4>
                              <div className="max-h-56 overflow-y-auto space-y-5 pr-2">
                                {daftarJenjang.map(j => (
                                  <div key={j.id} className="bg-white p-3 border border-indigo-100 rounded-xl">
                                    <div className="text-[10px] font-black text-slate-400 mb-2.5 uppercase tracking-widest">{j.nama}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {j.subJenjang.map(sj => {
                                        const diizinkan = aksesMengajarForm.includes(sj.id);
                                        return (
                                          <label key={sj.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition select-none ${diizinkan ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}>
                                            <input type="checkbox" className="hidden" checked={diizinkan} onChange={() => setAksesMengajarForm(prev => prev.includes(sj.id) ? prev.filter(x => x !== sj.id) : [...prev, sj.id])} />
                                            <div className="text-xs font-bold leading-tight">{sj.nama}</div>
                                          </label>
                                        )
                                      })}
                                      {j.subJenjang.length === 0 && <div className="col-span-2 text-[10px] italic text-slate-400 py-1">Belum ada kategori spesifik di jenjang ini.</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg transition">💾 Simpan Data Pengguna</button>
                            <button type="button" onClick={() => setModalAdminAkun(false)} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">Batal</button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}

                  {/* Modal Admin: Import JSON */}
                  {modalImportAkun && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-black flex items-center gap-2 text-slate-900"><FileSpreadsheet className="w-6 h-6 text-indigo-600" /> Import Akun Massal (JSON)</h3>
                          <button onClick={() => setModalImportAkun(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition">✕</button>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">Salin dan tempel format *array object* JSON di bawah ini (atau sesuaikan dengan data siswa/guru dari sistem sekolah Anda), lalu klik <b>Proses Import</b>.</p>
                        {notifImport && <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-sm rounded-xl text-center">{notifImport}</div>}
                        <form onSubmit={handleImportJson} className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Editor JSON Data</label>
                              <button type="button" onClick={() => setTeksImportJson(TEMPLATE_JSON_CONTOH)} className="text-[11px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-black hover:bg-indigo-100 transition">Muat Template Contoh</button>
                            </div>
                            <textarea rows={10} required value={teksImportJson} onChange={e => setTeksImportJson(e.target.value)} placeholder={`[\n  {\n    "nama": "Nama Siswa",\n    "email": "email@sekolah.id",\n    "password": "123456",\n    "role": "siswa"\n  }\n]`} className="w-full p-4 font-mono text-sm bg-slate-900 text-emerald-300 rounded-2xl shadow-inner outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>
                          <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition text-sm">🚀 Jalankan Import Data Massal</button>
                            <button type="button" onClick={() => setModalImportAkun(false)} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-sm">Batal</button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}

                  {/* Modal Admin: Tambah Kategori */}
                  {modalKategori && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-black mb-6 text-slate-900">Tambah Kelas / Prodi Baru</h3>
                        <form onSubmit={tambahKategoriBaru} className="space-y-5">
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Jenjang Induk</label>
                            <select value={targetJenjangKategori} onChange={e => setTargetJenjangKategori(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500">
                              {daftarJenjang.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Nama Sub-Kategori</label>
                            <input type="text" required value={namaKategoriBaru} onChange={e => setNamaKategoriBaru(e.target.value)} placeholder="Misal: Kelas 10 IPA 1..." className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl transition shadow-lg">Simpan</button>
                            <button type="button" onClick={() => setModalKategori(false)} className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">Batal</button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : userLogin.role === "guru" ? (
              /* ==================== DASHBOARD GURU ==================== */
              <motion.div key="guru" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 sm:p-10 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-white/20 text-indigo-50 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">👨‍🏫 Dashboard Guru Relawan</span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Selamat Mengajar, {userLogin.nama}!</h1>
                    <p className="text-indigo-200 text-sm">Anda memiliki akses resmi untuk mengajar dan menerbitkan materi di <b>{opsiKelasGuru.length} kelas/jurusan.</b></p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="relative z-10 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition backdrop-blur-md"><LogOut className="w-4 h-4"/> Keluar Akun</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Kolom Kiri: Studio Pembuatan Materi */}
                  <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900"><PlusCircle className="w-7 h-7 text-indigo-600"/> Studio Pembuatan Materi & Kuis</h2>
                    
                    {opsiKelasGuru.length === 0 ? (
                      <div className="p-10 bg-rose-50 border-2 border-dashed border-rose-200 rounded-3xl text-center">
                        <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-rose-400"/>
                        <h3 className="font-black text-xl text-rose-900 mb-2">Akses Mengajar Belum Diberikan</h3>
                        <p className="text-rose-700 text-sm leading-relaxed max-w-md mx-auto">Admin sistem belum menugaskan Anda ke kelas, mata pelajaran, atau jurusan manapun. Silakan hubungi Admin Panda Kode untuk mendapatkan otorisasi (RBAC).</p>
                      </div>
                    ) : (
                      <form onSubmit={handleGuruBuatMateri} className="space-y-6">
                        <AnimatePresence>
                          {notifGuru && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl font-black text-sm text-center shadow-sm">
                              🎉 Alhamdulillah! Materi Anda berhasil diterbitkan dan langsung tampil di ruang kelas siswa!
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl shadow-inner">
                          <label className="font-black mb-3 block text-indigo-900 text-sm flex items-center gap-2">📍 Target Kelas / Jurusan Anda:</label>
                          <select required value={subJenjangPilih} onChange={(e) => setSubJenjangPilih(e.target.value)} className="w-full p-4 bg-white border border-indigo-200 rounded-2xl font-extrabold text-indigo-900 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="" disabled>-- Pilih Kelas yang Ingin Anda Ajar --</option>
                            {opsiKelasGuru.map(sj => (
                              <option key={sj.id} value={sj.id}>{sj.namaInduk} ➔ {sj.nama}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-widest">Judul Bab / Materi</label>
                            <input type="text" required value={judulMateri} onChange={e => setJudulMateri(e.target.value)} placeholder="Contoh: Pengantar Algoritma..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition" />
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-widest">Tingkat Kesulitan</label>
                            <select value={levelMateri} onChange={(e) => setLevelMateri(e.target.value as any)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm font-extrabold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition cursor-pointer">
                              <option value="Pemula">🟢 Pemula (Dasar)</option>
                              <option value="Menengah">🟡 Menengah</option>
                              <option value="Mahir">🔴 Mahir / Olimpiade</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-widest">Link Video YouTube</label>
                          <input type="url" required value={videoMateri} onChange={e => setVideoMateri(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition" />
                        </div>

                        <div>
                          <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-widest">Rangkuman Materi</label>
                          <textarea rows={4} required value={rangkumanMateri} onChange={e => setRangkumanMateri(e.target.value)} placeholder="Ketik ringkasan teks untuk dibaca siswa di sini..." className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition leading-relaxed" />
                        </div>
                        
                        <div>
                          <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">Papan Rumus <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded normal-case tracking-normal">Opsional</span></label>
                          <input type="text" value={rumusMateri} onChange={e => setRumusMateri(e.target.value)} placeholder="Contoh: E = mc²" className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner" />
                        </div>

                        <div className="p-6 border-2 border-slate-100 rounded-[2rem] bg-slate-50/50 space-y-5">
                          <div className="font-black text-base text-slate-900 flex items-center gap-2">📝 Soal Kuis Interaktif Akhir Sesi</div>
                          <div>
                            <label className="font-bold mb-1.5 block text-[11px] text-slate-500 uppercase">Pertanyaan Kuis</label>
                            <input type="text" required value={pertanyaanKuis} onChange={e => setPertanyaanKuis(e.target.value)} placeholder="Tuliskan pertanyaan untuk menguji pemahaman siswa..." className="w-full p-4 border border-slate-200 bg-white rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-[11px] text-slate-500 uppercase">Pilihan Ganda</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="relative"><span className="absolute left-3 top-3.5 text-xs font-black text-slate-400">A.</span><input type="text" required value={opsiA} onChange={e => setOpsiA(e.target.value)} placeholder="Opsi jawaban..." className="w-full p-3.5 pl-8 border border-slate-200 bg-white rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition" /></div>
                              <div className="relative"><span className="absolute left-3 top-3.5 text-xs font-black text-slate-400">B.</span><input type="text" required value={opsiB} onChange={e => setOpsiB(e.target.value)} placeholder="Opsi jawaban..." className="w-full p-3.5 pl-8 border border-slate-200 bg-white rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition" /></div>
                              <div className="relative"><span className="absolute left-3 top-3.5 text-xs font-black text-slate-400">C.</span><input type="text" required value={opsiC} onChange={e => setOpsiC(e.target.value)} placeholder="Opsi jawaban..." className="w-full p-3.5 pl-8 border border-slate-200 bg-white rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition" /></div>
                              <div className="relative"><span className="absolute left-3 top-3.5 text-xs font-black text-slate-400">D.</span><input type="text" required value={opsiD} onChange={e => setOpsiD(e.target.value)} placeholder="Opsi jawaban..." className="w-full p-3.5 pl-8 border border-slate-200 bg-white rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition" /></div>
                            </div>
                          </div>
                          <div>
                            <label className="font-bold mb-1.5 block text-[11px] text-slate-500 uppercase">Pilih Kunci Jawaban Benar</label>
                            <select value={kunciKuis} onChange={e => setKunciKuis(Number(e.target.value))} className="w-full p-4 border border-emerald-200 bg-emerald-50 text-emerald-900 rounded-2xl font-black text-sm outline-none cursor-pointer">
                              <option value={0}>Jawaban Benar adalah Opsi A</option>
                              <option value={1}>Jawaban Benar adalah Opsi B</option>
                              <option value={2}>Jawaban Benar adalah Opsi C</option>
                              <option value={3}>Jawaban Benar adalah Opsi D</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all text-sm sm:text-base">🚀 Publikasikan Materi ke Ruang Kelas Siswa</button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Kolom Kanan: Log Khusus Guru */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <h2 className="text-lg font-black mb-5 flex items-center gap-2 text-slate-900"><Activity className="w-5 h-5 text-indigo-600"/> Riwayat Kontribusi</h2>
                      <div className="space-y-3 max-h-[40rem] overflow-y-auto pr-2">
                        {safeLogList.filter(l => l.namaPelaku === userLogin.nama).length === 0 ? (
                          <div className="text-center text-xs text-slate-400 italic py-4">Belum ada aktivitas tercatat. Mulai buat materi pertamamu!</div>
                        ) : (
                          safeLogList.filter(l => l.namaPelaku === userLogin.nama).map((log) => (
                            <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1.5">
                              <div className="text-xs font-bold text-slate-700 leading-snug">✅ {log.aksi}</div>
                              <span className="font-mono text-[10px] text-slate-400">{log.waktu}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ==================== DASHBOARD SISWA ==================== */
              <motion.div key="siswa" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 sm:p-10 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-white/20 text-emerald-50 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">🎓 Dashboard Rapor Siswa</span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Halo, {userLogin.nama}!</h1>
                    <p className="text-emerald-100 text-sm">Teruslah semangat menuntut ilmu. Pantau pencapaian belajarmu di sini.</p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="relative z-10 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition backdrop-blur-md"><LogOut className="w-4 h-4"/> Keluar Akun</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
                    <div className="p-5 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl shadow-inner"><Flame className="w-10 h-10 fill-amber-500 text-amber-500" /></div>
                    <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Poin Keaktifan</div><div className="text-4xl font-black text-slate-900">{poinXP} <span className="text-lg text-amber-500">XP</span></div></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
                    <div className="p-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl shadow-inner"><CheckCircle2 className="w-10 h-10" /></div>
                    <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modul Diselesaikan</div><div className="text-4xl font-black text-slate-900">{materiSelesai.length} <span className="text-lg text-emerald-600">Bab</span></div></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
                    <div className="p-5 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl shadow-inner"><Sparkles className="w-10 h-10" /></div>
                    <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pangkat Pelajar</div><div className="text-2xl font-black text-purple-700 leading-tight">{poinXP >= 500 ? "🌟 Cendekiawan" : poinXP >= 200 ? "🚀 Penjelajah" : "🌱 Pembelajar"}</div></div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900"><Activity className="w-5 h-5 text-emerald-600"/> Riwayat Aktivitas Belajarmu</h2>
                  <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
                    {safeLogList.filter(l => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa").length === 0 ? (
                      <div className="text-center text-sm text-slate-400 italic py-8 border-2 border-dashed rounded-2xl">Belum ada aktivitas. Buka menu Ruang Kelas untuk mulai belajar!</div>
                    ) : (
                      safeLogList.filter(l => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa").slice(0, 15).map((log) => (
                        <div key={log.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap justify-between items-center gap-3 hover:bg-slate-100 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">✓</div>
                            <span className="text-sm font-semibold text-slate-800">{log.aksi}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 bg-white px-2.5 py-1 border rounded-md">{log.waktu}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ==========================================
            2. MENU TRYOUT UJIAN
        ========================================== */}
        {menuAktif === "tryout" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="rounded-[2rem] p-8 sm:p-10 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl mb-8 flex flex-wrap justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">Simulasi Ujian</span>
                <h1 className="text-3xl sm:text-4xl font-black mt-4">Tryout & Latihan Berwaktu</h1>
              </div>
              {sedangUjian && (
                <div className="bg-slate-900/80 px-6 py-4 rounded-3xl text-center relative z-10 backdrop-blur-md shadow-xl border border-white/10">
                  <div className="text-[10px] text-amber-300 font-black uppercase tracking-widest mb-1">Sisa Waktu</div>
                  <div className={`font-mono text-3xl font-black ${sisaWaktu <= 30 ? "text-rose-400 animate-pulse" : "text-white"}`}>
                    {Math.floor(sisaWaktu / 60)}:{(sisaWaktu % 60).toString().padStart(2, "0")}
                  </div>
                </div>
              )}
            </div>

            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-[2rem] p-12 border border-slate-200 text-center shadow-sm">
                <div className="w-24 h-24 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner"><Timer className="w-12 h-12" /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Mulai Simulasi Tryout?</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">Uji kemampuanmu dengan waktu 3 menit. Setiap jawaban benar bernilai +40 XP. Pastikan koneksi internet stabil.</p>
                <button onClick={() => { setJawabanUserTryout({}); setSisaWaktu(180); setUjianSelesai(false); setSedangUjian(true); }} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3">
                  <Play className="w-5 h-5 fill-white" /> MULAI TRYOUT SEKARANG
                </button>
              </div>
            )}

            {sedangUjian && (
              <div className="space-y-6">
                {BANK_SOAL_TRYOUT.map((soal, idx) => (
                  <div key={soal.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-lg">Soal #{idx + 1}</span>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{soal.jenjang}</span>
                    </div>
                    <h3 className="font-extrabold text-xl text-slate-900 mb-6">{soal.pertanyaan}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {soal.opsi.map((pilihan, opsiIdx) => (
                        <button key={opsiIdx} onClick={() => setJawabanUserTryout((prev) => ({ ...prev, [idx]: opsiIdx }))} className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition ${jawabanUserTryout[idx] === opsiIdx ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                          <span className="inline-block w-6 text-slate-400 font-black">{String.fromCharCode(65 + opsiIdx)}.</span> {pilihan}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={selesaikanTryout} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all text-lg tracking-wide uppercase">Kumpulkan & Selesai Ujian</button>
              </div>
            )}

            {ujianSelesai && (
              <div className="bg-white rounded-[2rem] p-12 border-2 border-emerald-100 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="w-24 h-24 mx-auto bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner"><Trophy className="w-12 h-12" /></div>
                <h2 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2">Ujian Selesai</h2>
                <div className="text-5xl font-black text-slate-900 mb-8">Skor Anda: <span className="text-emerald-600">{skorTryout}</span> / 100</div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => { setUjianSelesai(false); setSedangUjian(false); }} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition shadow-md">Ulangi Tryout</button>
                  <button onClick={() => { setMenuAktif("beranda"); setUjianSelesai(false); setSedangUjian(false); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-4 rounded-2xl transition">Kembali Belajar</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ==========================================
            3. MENU FORUM TANYA PR
        ========================================== */}
        {menuAktif === "forum" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <span className="bg-white/20 text-emerald-50 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">Komunitas</span>
                <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Forum Tanya PR</h1>
                <p className="text-emerald-100 text-sm max-w-lg">Tanyakan kesulitan tugas sekolahmu di sini. Relawan pengajar dan teman-teman lain siap membantu menjawab.</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (!tanyaBaru.trim()) return; setDaftarDiskusi([{ id: "pr-" + Date.now(), penanya: userLogin?.nama || "Pelajar", jenjang: "Umum", mapel: mapelBaru, pertanyaan: tanyaBaru, waktu: "Baru saja", jawaban: [] }, ...daftarDiskusi]); setTanyaBaru(""); tambahXP(20); }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-emerald-600"/> Ajukan Pertanyaan Baru</h3>
              <input type="text" required value={mapelBaru} onChange={(e) => setMapelBaru(e.target.value)} placeholder="Mata Pelajaran (Contoh: Matematika Kelas 10)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition" />
              <textarea rows={3} required value={tanyaBaru} onChange={(e) => setTanyaBaru(e.target.value)} placeholder="Tuliskan soal PR atau materi yang membingungkanmu secara detail..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg transition flex justify-center items-center gap-2"><Send className="w-4 h-4"/> Kirim Pertanyaan ke Forum (+20 XP)</button>
            </form>

            <div className="space-y-5">
              {daftarDiskusi.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center font-black text-indigo-700">{item.penanya.charAt(0)}</div>
                      <div>
                        <div className="font-black text-sm text-slate-900">{item.penanya}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.waktu}</div>
                      </div>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200">{item.mapel}</span>
                  </div>
                  <p className="text-slate-800 font-medium mb-5 leading-relaxed">{item.pertanyaan}</p>
                  
                  {item.jawaban.length > 0 && (
                    <div className="space-y-3 mb-5 pl-4 border-l-4 border-emerald-200">
                      {item.jawaban.map((jwb, i) => (
                        <div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-1.5"><UserCheck2 className="w-3.5 h-3.5"/> Dijawab oleh: {jwb.penjawab}</div>
                          <div className="text-sm text-slate-700 font-medium">{jwb.isi}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <input type="text" value={balasanInput[item.id] || ""} onChange={(e) => setBalasanInput({ ...balasanInput, [item.id]: e.target.value })} placeholder="Ketik balasan untuk membantu menjawab..." className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition" />
                    <button onClick={() => { const isi = balasanInput[item.id]; if (!isi) return; setDaftarDiskusi(daftarDiskusi.map((d) => d.id === item.id ? { ...d, jawaban: [...d.jawaban, { penjawab: userLogin?.nama || "Relawan", isi }] } : d)); setBalasanInput({ ...balasanInput, [item.id]: "" }); tambahXP(35); }} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition">Kirim Balasan</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==========================================
            4. MENU TRANSPARANSI & DONASI
        ========================================== */}
        {menuAktif === "transparansi" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-[2.5rem] p-10 sm:p-16 text-white text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-emerald-500/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm"><ShieldCheck className="w-10 h-10 text-emerald-400" /></div>
                <h1 className="text-4xl sm:text-5xl font-black mb-4">Transparansi Dana Umat</h1>
                <p className="text-slate-300 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
                  HibahIlmu adalah platform Open Source nirlaba. Kami 100% transparan. Seluruh donasi sukarela digunakan murni untuk memperpanjang biaya server (VPS) dan domain <strong>hibahilmu.id</strong> agar pendidikan gratis ini terus menyala.
                </p>
                
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl max-w-lg mx-auto text-left border border-white/20 shadow-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-4 text-center">Status Pendanaan Server Tahun 2026</div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-white">Terkumpul: Rp 850.000</span>
                    <span className="text-slate-400">Target: Rp 1.500.000</span>
                  </div>
                  <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden mb-6 shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: "56%" }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative">
                    </motion.div>
                  </div>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">💖 Donasi via Saweria / GoPay</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            5. MENU UTAMA: BERANDA RUANG KELAS
        ========================================== */}
        {menuAktif === "beranda" && (
          <React.Fragment>
            {/* SUB-MENU A: PILIH JENJANG PENDIDIKAN */}
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-16 pt-6 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 mb-6">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{userLogin ? `Selamat datang kembali, ${userLogin.nama}!` : "Pendidikan Berkualitas untuk Seluruh Anak Bangsa"}</span>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Gratis Selamanya.</span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">Pilih jenjang pendidikanmu, temukan materi interaktif, tonton penjelasan video, dan raih skor tertinggi di kuis. Mulai belajar sekarang!</p>
                  
                  <div className="max-w-2xl mx-auto relative group">
                    <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition" />
                    <input type="text" value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="Cari jenjang atau mata pelajaran (Contoh: SD, Fisika, Matematika)..." className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-lg text-base font-semibold outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {daftarJenjang.filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase())).map((jenjang) => (
                    <motion.div key={jenjang.id} whileHover={{ y: -8 }} onClick={() => { setJenjangAktif(jenjang); setSubJenjangAktif("semua"); }} className="cursor-pointer bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
                      <div className={`h-2.5 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`} />
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                            {renderIkon(jenjang.ikonNama)}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${jenjang.badge}`}>{jenjang.subJenjang.length} Jurusan</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{jenjang.nama}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{jenjang.deskripsi}</p>
                      </div>
                      <div className="pt-5 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <span>Pilih & Buka Ruang Kelas</span><span className="bg-slate-100 group-hover:bg-emerald-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors">→</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SUB-MENU B: DAFTAR KELAS & FILTER JURUSAN */}
            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setJenjangAktif(null)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 mb-8 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>
                
                <div className={`rounded-[2.5rem] p-10 sm:p-14 text-white bg-gradient-to-br ${jenjangAktif.gradien} shadow-2xl mb-10 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-white/20 text-white border border-white/30 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md backdrop-blur-md">{jenjangAktif.tagline}</span>
                    <h1 className="text-4xl sm:text-5xl font-black mt-5 mb-3 leading-tight">{jenjangAktif.nama}</h1>
                    <p className="text-white/90 text-base max-w-xl leading-relaxed">{jenjangAktif.deskripsi}</p>
                  </div>
                </div>

                {/* FILTER SUB-JENJANG / JURUSAN / KELAS */}
                <div className="mb-8 flex flex-wrap gap-2.5 items-center p-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 pr-2 whitespace-nowrap">Filter Kelas:</div>
                  <button onClick={() => setSubJenjangAktif("semua")} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${subJenjangAktif === "semua" ? "bg-slate-900 text-white shadow-md" : "bg-transparent text-slate-600 hover:bg-slate-100"}`}>
                    Semua Materi
                  </button>
                  {jenjangAktif.subJenjang.map(sj => (
                    <button key={sj.id} onClick={() => setSubJenjangAktif(sj.id)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${subJenjangAktif === sj.id ? "bg-slate-900 text-white shadow-md" : "bg-transparent text-slate-600 hover:bg-slate-100"}`}>
                      {sj.nama}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jenjangAktif.kelas
                    .filter(item => subJenjangAktif === "semua" || item.subJenjangId === subJenjangAktif)
                    .map((item) => {
                      const selesai = materiSelesai.includes(item.id);
                      const namaSub = jenjangAktif.subJenjang.find(s => s.id === item.subJenjangId)?.nama || "Umum";
                      return (
                        <div key={item.id} onClick={() => setKelasAktif(item)} className={`bg-white rounded-[2rem] p-8 border-2 shadow-sm hover:shadow-xl cursor-pointer transition flex flex-col justify-between group ${selesai ? "border-emerald-400 bg-emerald-50/20" : "border-slate-100"}`}>
                          <div>
                            <div className="flex justify-between items-center mb-5">
                              <div className="flex gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">📍 {namaSub}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">⚡ {item.level}</span>
                              </div>
                              {selesai && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Selesai</span>}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{item.judul}</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{item.rangkuman}</p>
                          </div>
                          <div className="pt-5 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                            <span className="flex items-center gap-2"><PlayCircle className="w-5 h-5" /> Mulai Belajar & Kuis</span>
                            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-black">+50 XP</span>
                          </div>
                        </div>
                      );
                  })}
                  
                  {jenjangAktif.kelas.filter(item => subJenjangAktif === "semua" || item.subJenjangId === subJenjangAktif).length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 bg-white">
                      <BookMarked className="w-16 h-16 mx-auto mb-4 text-slate-300"/>
                      <p className="font-black text-xl text-slate-600 mb-2">Belum ada materi di kategori ini.</p>
                      <p className="text-sm font-medium">Guru relawan akan segera menerbitkan kurikulum materi ke kelas ini!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-MENU C: HALAMAN MATERI DETAIL & KUIS */}
            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <button onClick={() => setKelasAktif(null)} className="bg-white px-5 py-3 border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
                  </button>
                  <button onClick={() => toggleSelesaiMateri(kelasAktif.id)} className={`px-6 py-3 rounded-2xl text-sm font-black shadow-md transition flex items-center gap-2 border-2 ${materiSelesai.includes(kelasAktif.id) ? "bg-emerald-50 text-emerald-700 border-emerald-500" : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"}`}>
                    {materiSelesai.includes(kelasAktif.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    {materiSelesai.includes(kelasAktif.id) ? "Modul Selesai (+30 XP)" : "Tandai Selesai & Klaim XP"}
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Kolom Kiri: Video & Ringkasan */}
                  <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-6 shadow-inner border border-slate-100">
                        <iframe src={kelasAktif.videoUrl} title={kelasAktif.judul} className="w-full h-full" allowFullScreen />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-md uppercase tracking-widest">{jenjangAktif.nama}</span>
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md uppercase tracking-widest border border-indigo-100">{kelasAktif.level}</span>
                      </div>
                      <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{kelasAktif.judul}</h1>
                      <p className="text-slate-600 text-base mb-6 leading-relaxed font-medium">{kelasAktif.rangkuman}</p>
                      
                      {kelasAktif.rumusMatematika && (
                        <div className="mt-6 p-6 bg-slate-900 text-emerald-300 font-mono text-sm rounded-2xl shadow-inner border border-slate-800">
                          <div className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Papan Rumus / Catatan Penting:</div>
                          <div className="whitespace-pre-wrap text-base leading-relaxed">{kelasAktif.rumusMatematika}</div>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 rounded-[2rem] p-6 sm:p-8 border border-amber-200 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10"><FileEdit className="w-32 h-32 text-amber-900"/></div>
                      <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-900 relative z-10"><FileEdit className="w-5 h-5" /> Buku Catatan Pribadi Siswa</h3>
                      <textarea rows={4} value={catatanSiswa} onChange={(e) => setCatatanSiswa(e.target.value)} placeholder="Ketik rangkuman atau hal penting dari video di sini. Catatan ini akan tersimpan otomatis di perangkatmu..." className="w-full p-4 bg-white border border-amber-200 rounded-2xl text-sm font-medium mb-4 outline-none focus:ring-2 focus:ring-amber-500 shadow-inner relative z-10 leading-relaxed" />
                      <div className="flex items-center gap-4 relative z-10">
                        <button onClick={() => { localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa); setStatusSimpanCatatan(true); setTimeout(() => setStatusSimpanCatatan(false), 2500); }} className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-xl shadow-md transition">
                          Simpan Catatan
                        </button>
                        <AnimatePresence>
                          {statusSimpanCatatan && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs text-emerald-700 font-black flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4"/> Tersimpan Lokal!</motion.span>}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Kolom Kanan: Kuis */}
                  <div className="xl:col-span-1">
                    <div className="bg-white rounded-[2rem] p-8 border-2 border-indigo-100 shadow-lg sticky top-28">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6"><Trophy className="w-6 h-6"/></div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kuis Pemahaman Modul</h3>
                      <p className="font-black text-lg text-slate-900 mb-6 leading-snug">{kelasAktif.kuis.tanya}</p>
                      
                      <div className="space-y-3 mb-6">
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
                            className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 flex items-center gap-3 ${
                              jawabanKuis === idx
                                ? statusKuis === "benar"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"
                                  : "border-rose-500 bg-rose-50 text-rose-900 shadow-md"
                                : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${jawabanKuis === idx ? (statusKuis === "benar" ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800") : "bg-slate-100 text-slate-400"}`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            {opsi}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {statusKuis === "benar" && (
                          <motion.div key="benar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 rounded-2xl text-xs text-emerald-900 font-bold border border-emerald-200 shadow-inner">
                            <div className="flex items-center gap-2 mb-2 text-sm font-black text-emerald-700"><CheckCircle2 className="w-5 h-5"/> Tepat Sekali! (+50 XP)</div>
                            <div className="font-medium leading-relaxed opacity-90">{kelasAktif.kuis.pembahasan}</div>
                          </motion.div>
                        )}
                        {statusKuis === "salah" && (
                          <motion.div key="salah" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 rounded-2xl text-xs text-rose-900 font-bold border border-rose-200 shadow-inner flex items-center gap-2">
                            <UserX className="w-5 h-5 text-rose-600"/> Belum tepat, ayo coba pahami lagi!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-md py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 shadow-lg">🐼</div>
          <p className="font-black text-slate-900 text-lg mb-1">HibahIlmu.id</p>
          <p className="text-xs text-slate-500 font-semibold mb-4">LMS Open Source • Pendidikan Gratis Indonesia</p>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">Dibuat dengan dedikasi tinggi oleh Panda Kode</div>
        </div>
      </footer>
    </div>
  );
}