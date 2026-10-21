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
  Send,
  HelpCircle,
  Play,
  Edit3,
  UserX2,
  UserCheck2,
  Upload,
  Layers,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

// --- 1. INTERFACE & STRUKTUR DATA BARU ---
interface KuisItem {
  tanya: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

// SubJenjang merepresentasikan Kelas / Jurusan / Prodi
export interface SubJenjang {
  id: string;
  nama: string;
}

interface KelasItem {
  id: string;
  subJenjangId: string; // Relasi ke ID SubJenjang (Kelas spesifik)
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

export interface AkunPengguna {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: "admin" | "guru" | "siswa";
  status: "pending" | "approved" | "rejected";
  infoTambahan: string;
  waktuDaftar: string;
  aksesMengajar?: string[]; // Array berisi ID SubJenjang yang boleh diajar oleh Guru
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  namaPelaku: string;
  rolePelaku: "admin" | "guru" | "siswa";
  aksi: string;
  kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem";
}

// --- 2. DATA STRUKTUR PENDIDIKAN AWAL LENGKAP ---
const STRUKTUR_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti.",
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
        judul: "Mengenal Angka 1-10",
        level: "Pemula",
        durasi: "5 Menit",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
        rangkuman: "Belajar menghitung buah-buahan ceria.",
        kuis: {
          tanya: "2 Apel + 1 Apel = ?",
          opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"],
          jawabanBenar: 1,
          pembahasan: "2 + 1 = 3",
        },
      },
    ],
  },
  {
    id: "sd",
    nama: "SD / MI",
    tagline: "Fondasi Logika & Sains",
    deskripsi: "Matematika dasar, eksperimen sains, dan Bahasa Indonesia.",
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
    kelas: [],
  },
  {
    id: "smp",
    nama: "SMP / MTs",
    tagline: "Eksplorasi & Penalaran",
    deskripsi: "Aljabar, Fisika terapan, Biologi sel, dan IPS Terpadu.",
    gradien: "from-cyan-500 via-blue-500 to-indigo-600",
    badge: "bg-sky-100 text-sky-800",
    ikonNama: "compass",
    subJenjang: [
      { id: "smp-7", nama: "Kelas 7 SMP" },
      { id: "smp-8", nama: "Kelas 8 SMP" },
      { id: "smp-9", nama: "Kelas 9 SMP" },
    ],
    kelas: [],
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
      { id: "sma-10", nama: "Kelas 10 Umum" },
      { id: "sma-11-ipa", nama: "Kelas 11 MIPA" },
      { id: "sma-11-ips", nama: "Kelas 11 IPS" },
      { id: "sma-12-ipa", nama: "Kelas 12 MIPA" },
      { id: "sma-12-ips", nama: "Kelas 12 IPS" },
    ],
    kelas: [
      {
        id: "materi-sma-1",
        subJenjangId: "sma-11-ipa",
        judul: "Hukum Newton & Energi Kinetik",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman: "Gaya berbanding lurus dengan massa dan percepatan benda.",
        rumusMatematika: "Ek = ½ · m · v²",
        kuis: {
          tanya: "Benda 4 kg, kecepatan 3 m/s. Berapa Ek?",
          opsi: ["6 J", "12 J", "18 J", "36 J"],
          jawabanBenar: 2,
          pembahasan: "Ek = ½ · 4 · (3²) = 18 Joule.",
        },
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
      { id: "pt-ti", nama: "S1 Teknik Informatika" },
      { id: "pt-si", nama: "S1 Sistem Informasi" },
      { id: "pt-dkv", nama: "S1 Desain Komunikasi Visual" },
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
        contohKode: `const [xp, setXp] = useState(0);`,
        kuis: {
          tanya: "Hook untuk menyimpan data berubah-ubah di React?",
          opsi: ["useRouter()", "useState()", "useEffect()", "useMemo()"],
          jawabanBenar: 1,
          pembahasan: "useState() adalah fondasi utama state management.",
        },
      },
    ],
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
    infoTambahan: "Super Admin HibahIlmu",
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
    infoTambahan: "Guru Fisika SMA",
    waktuDaftar: "Kemarin",
    aksesMengajar: ["sma-11-ipa", "sma-12-ipa"], // Budi hanya bisa mengajar SMA IPA
  },
  {
    id: "sis-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswi SMA Kelas 11",
    waktuDaftar: "Kemarin",
  },
];

// --- 3. KOMPONEN UTAMA ---
export default function AplikasiHibahIlmu() {
  // State Utama
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(STRUKTUR_AWAL);
  
  // State Navigasi Ruang Kelas
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [subJenjangAktif, setSubJenjangAktif] = useState<string>("semua"); // Filter kelas
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");

  // State Sistem Akun
  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>([]);

  // State Siswa
  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [jawabanKuis, setJawabanKuis] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);

  // State Auth Form
  const [modeAuth, setModeAuth] = useState<"login" | "register">("login");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  
  // State Form Register
  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru">("siswa");
  const [infoReg, setInfoReg] = useState("");

  // State Admin (Edit Akun & RBAC)
  const [modalAdminAkun, setModalAdminAkun] = useState<boolean>(false);
  const [idEditAkun, setIdEditAkun] = useState<string | null>(null);
  const [namaFormAdmin, setNamaFormAdmin] = useState("");
  const [emailFormAdmin, setEmailFormAdmin] = useState("");
  const [passFormAdmin, setPassFormAdmin] = useState("");
  const [roleFormAdmin, setRoleFormAdmin] = useState<"admin" | "guru" | "siswa">("siswa");
  const [statusFormAdmin, setStatusFormAdmin] = useState<"approved" | "pending" | "rejected">("approved");
  const [infoFormAdmin, setInfoFormAdmin] = useState("");
  const [aksesMengajarForm, setAksesMengajarForm] = useState<string[]>([]); // Untuk RBAC Guru

  // State Admin (Tambah Kategori/Jurusan Baru)
  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // State Guru Buat Materi
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

  // Load Data Lokal
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

  // Pencatat Log
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

  // Autentikasi
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const akunDitemukan = (daftarAkun || []).find((a) => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin);
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending") return setPesanError("⏳ Akun menunggu persetujuan Admin.");
    if (akunDitemukan.status === "rejected") return setPesanError("❌ Akun disuspend.");
    
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Login berhasil`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    if ((daftarAkun || []).some((a) => a.email.toLowerCase() === emailReg.toLowerCase())) {
      return setPesanError("Email sudah terdaftar.");
    }
    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg, email: emailReg, password: passwordReg, role: roleReg,
      status: "pending", infoTambahan: infoReg || "Pengguna Baru",
      waktuDaftar: "Baru saja", aksesMengajar: []
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg, `Mendaftar akun (Pending)`, "akun");
    setPesanSukses("✅ Pendaftaran terkirim! Menunggu Admin.");
    setModeAuth("login");
  };

  // ADMIN: Manajemen Akun & Hak Akses Guru
  const ubahStatusAkun = (id: string, status: "approved" | "rejected") => {
    const target = daftarAkun.find(a => a.id === id);
    if (!target) return;
    const update = daftarAkun.map(a => a.id === id ? { ...a, status } : a);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `${status === "approved" ? "Menyetujui" : "Membekukan"} akun ${target.nama}`, "akun");
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
      const update = daftarAkun.map((a) => a.id === idEditAkun ? {
        ...a, nama: namaFormAdmin, email: emailFormAdmin,
        password: passFormAdmin || a.password, role: roleFormAdmin,
        status: statusFormAdmin, infoTambahan: infoFormAdmin,
        aksesMengajar: roleFormAdmin === "guru" ? aksesMengajarForm : []
      } : a);
      setDaftarAkun(update);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
      catatLog(userLogin?.nama || "Admin", "admin", `Memperbarui data dan hak akses akun ${namaFormAdmin}`, "akun");
    }
    setModalAdminAkun(false);
  };

  // ADMIN: Buat Kategori/Prodi Baru
  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategoriBaru.trim()) return;
    
    const idBaru = `sub-${Date.now()}`;
    const jenjangUpdate = daftarJenjang.map(j => {
      if(j.id === targetJenjangKategori) {
        return { ...j, subJenjang: [...j.subJenjang, { id: idBaru, nama: namaKategoriBaru }] };
      }
      return j;
    });

    setDaftarJenjang(jenjangUpdate);
    localStorage.setItem("hibah_struktur", JSON.stringify(jenjangUpdate));
    catatLog(userLogin?.nama || "Admin", "admin", `Menambahkan kategori kelas/jurusan baru: ${namaKategoriBaru}`, "sistem");
    setNamaKategoriBaru("");
    setModalKategori(false);
  };

  // GURU: Ambil daftar kelas yang DIIZINKAN (berdasarkan aksesMengajar)
  const opsiKelasGuru = (daftarJenjang || []).flatMap(j => 
    j.subJenjang
      .filter(sj => userLogin?.aksesMengajar?.includes(sj.id))
      .map(sj => ({ ...sj, namaInduk: j.nama }))
  );

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !subJenjangPilih) return;

    let finalEmbed = videoMateri;
    if (videoMateri.includes("watch?v=")) finalEmbed = videoMateri.replace("watch?v=", "embed/");

    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(),
      subJenjangId: subJenjangPilih,
      judul: `${judulMateri} (Oleh: ${userLogin.nama})`,
      level: levelMateri,
      durasi: "15 Menit",
      videoUrl: finalEmbed,
      rangkuman: rangkumanMateri,
      rumusMatematika: rumusMateri || undefined,
      kuis: {
        tanya: pertanyaanKuis,
        opsi: [opsiA, opsiB, opsiC, opsiD],
        jawabanBenar: kunciKuis,
        pembahasan: `Disusun oleh Guru ${userLogin.nama}.`,
      },
    };

    const targetJenjang = daftarJenjang.find(j => j.subJenjang.some(sj => sj.id === subJenjangPilih));
    if(!targetJenjang) return;

    const jenjangUpdate = daftarJenjang.map(j => j.id === targetJenjang.id ? { ...j, kelas: [modulBaru, ...j.kelas] } : j);
    setDaftarJenjang(jenjangUpdate);
    localStorage.setItem("hibah_struktur", JSON.stringify(jenjangUpdate));
    
    catatLog(userLogin.nama, "guru", `Menerbitkan materi: "${judulMateri}"`, "materi");
    setNotifGuru(true);
    setJudulMateri(""); setVideoMateri(""); setRangkumanMateri(""); setRumusMateri(""); setPertanyaanKuis(""); setOpsiA(""); setOpsiB(""); setOpsiC(""); setOpsiD("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  const renderIkon = (ikonNama: string) => {
    if (ikonNama === "sparkles") return <Sparkles className="w-7 h-7 text-white" />;
    if (ikonNama === "book") return <BookOpen className="w-7 h-7 text-white" />;
    if (ikonNama === "compass") return <Compass className="w-7 h-7 text-white" />;
    if (ikonNama === "school") return <School className="w-7 h-7 text-white" />;
    return <GraduationCap className="w-7 h-7 text-white" />;
  };

  // --- RENDER UI APLIKASI ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <div onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md">🐼</div>
            <div>
              <div className="font-extrabold text-xl text-emerald-900 leading-none">HibahIlmu</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">LMS Open Source</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            <button onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${menuAktif === "beranda" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Ruang Kelas</button>
            <button onClick={() => setMenuAktif("dashboard")} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${menuAktif === "dashboard" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {userLogin ? `Panel ${userLogin.role.toUpperCase()}` : "Daftar / Masuk"}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ==================== PANEL DASHBOARD MULTI-ROLE ==================== */}
        {menuAktif === "dashboard" && (
          <AnimatePresence mode="wait">
            {!userLogin ? (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border">
                <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => setModeAuth("login")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${modeAuth === "login" ? "bg-white shadow" : "text-slate-500"}`}>Masuk</button>
                  <button onClick={() => setModeAuth("register")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${modeAuth === "register" ? "bg-white shadow" : "text-slate-500"}`}>Daftar Baru</button>
                </div>
                {pesanError && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-bold">{pesanError}</div>}
                {pesanSukses && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-bold">{pesanSukses}</div>}
                
                {modeAuth === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" required value={emailLogin} onChange={e => setEmailLogin(e.target.value)} placeholder="Email..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="password" required value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} placeholder="Password..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">Masuk</button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setRoleReg("siswa")} className={`p-2 border rounded-xl text-xs font-bold ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-500" : ""}`}>🎓 Siswa</button>
                      <button type="button" onClick={() => setRoleReg("guru")} className={`p-2 border rounded-xl text-xs font-bold ${roleReg === "guru" ? "bg-indigo-50 border-indigo-500" : ""}`}>👨‍🏫 Guru Relawan</button>
                    </div>
                    <input type="text" required value={namaReg} onChange={e => setNamaReg(e.target.value)} placeholder="Nama Lengkap" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="email" required value={emailReg} onChange={e => setEmailReg(e.target.value)} placeholder="Email" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="password" required value={passwordReg} onChange={e => setPasswordReg(e.target.value)} placeholder="Password" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Daftar Akun</button>
                  </form>
                )}
                <div className="mt-8 pt-6 border-t text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demo Login 1-Klik</span>
                  <div className="mt-3 flex flex-col gap-2">
                    {daftarAkun.filter(a => a.status === "approved").slice(0, 3).map(a => (
                      <button key={a.id} onClick={() => loginCepat(a)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold flex justify-between px-4">
                        <span>{a.nama}</span> <span className="uppercase text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{a.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "admin" ? (
              /* --- PANEL SUPER ADMIN --- */
              <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <h1 className="text-3xl font-black">Panel Super Admin</h1>
                    <p className="text-slate-400 mt-1">Sistem Manajemen Akun & Hierarki Kurikulum</p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 px-5 py-2.5 rounded-xl font-bold text-sm">Keluar</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* MODUL: MANAJEMEN AKUN & RBAC */}
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h2 className="font-black text-lg mb-4 flex items-center gap-2"><Users className="text-indigo-600 w-5 h-5"/> Manajemen Akun & Hak Akses</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {daftarAkun.map(akun => (
                        <div key={akun.id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
                          <div>
                            <div className="font-bold text-sm flex items-center gap-2">
                              {akun.nama} 
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${akun.role === 'guru' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{akun.role}</span>
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${akun.status === 'pending' ? 'bg-amber-100 text-amber-700' : akun.status === 'approved' ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>{akun.status}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{akun.email} • {akun.role === 'guru' && <span className="text-indigo-600 font-semibold">{akun.aksesMengajar?.length || 0} Kelas Ditugaskan</span>}</div>
                          </div>
                          <div className="flex gap-1">
                            {akun.status === "pending" && <button onClick={() => ubahStatusAkun(akun.id, "approved")} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><UserCheck className="w-4 h-4"/></button>}
                            <button onClick={() => bukaModalEditAkun(akun)} className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Edit3 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODUL: MANAJEMEN KATEGORI & JURUSAN */}
                  <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-black text-lg flex items-center gap-2"><Layers className="text-amber-500 w-5 h-5"/> Manajemen Kategori / Prodi</h2>
                      <button onClick={() => setModalKategori(true)} className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5"/> Tambah Tingkat</button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {daftarJenjang.map(j => (
                        <div key={j.id} className="p-4 border rounded-2xl">
                          <h3 className="font-bold text-sm mb-2">{j.nama}</h3>
                          <div className="flex flex-wrap gap-2">
                            {j.subJenjang.map(sj => (
                              <span key={sj.id} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border font-medium">{sj.nama}</span>
                            ))}
                            {j.subJenjang.length === 0 && <span className="text-xs text-slate-400 italic">Belum ada kategori/kelas spesifik.</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Admin: Edit Hak Akses & Akun */}
                <AnimatePresence>
                  {modalAdminAkun && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-black mb-4">Edit Data & Penugasan Pengajar</h3>
                        <form onSubmit={simpanAkunAdmin} className="space-y-4 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="font-bold mb-1 block text-xs text-slate-500">Nama</label><input type="text" required value={namaFormAdmin} onChange={e => setNamaFormAdmin(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" /></div>
                            <div><label className="font-bold mb-1 block text-xs text-slate-500">Email</label><input type="email" required value={emailFormAdmin} onChange={e => setEmailFormAdmin(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-bold mb-1 block text-xs text-slate-500">Ubah Status</label>
                              <select value={statusFormAdmin} onChange={e => setStatusFormAdmin(e.target.value as any)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold">
                                <option value="approved">Aktif (Approved)</option>
                                <option value="pending">Menunggu (Pending)</option>
                                <option value="rejected">Suspend (Bekukan)</option>
                              </select>
                            </div>
                            <div>
                              <label className="font-bold mb-1 block text-xs text-slate-500">Role Sistem</label>
                              <select value={roleFormAdmin} onChange={e => setRoleFormAdmin(e.target.value as any)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold">
                                <option value="siswa">Siswa</option>
                                <option value="guru">Guru Relawan</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </div>

                          {/* KHUSUS GURU: PANEL SELEKSI HAK AKSES MENGAJAR (RBAC) */}
                          {roleFormAdmin === "guru" && (
                            <div className="mt-6 p-5 border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl">
                              <h4 className="font-black text-indigo-900 mb-3 flex items-center gap-2"><Lock className="w-4 h-4"/> Berikan Akses Mengajar Kelas/Prodi:</h4>
                              <div className="max-h-48 overflow-y-auto space-y-4 pr-2">
                                {daftarJenjang.map(j => (
                                  <div key={j.id}>
                                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">{j.nama}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {j.subJenjang.map(sj => {
                                        const diizinkan = aksesMengajarForm.includes(sj.id);
                                        return (
                                          <label key={sj.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${diizinkan ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                                            <input type="checkbox" className="hidden" checked={diizinkan} onChange={() => setAksesMengajarForm(prev => prev.includes(sj.id) ? prev.filter(x => x !== sj.id) : [...prev, sj.id])} />
                                            <div className="text-xs font-bold">{sj.nama}</div>
                                          </label>
                                        )
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl">Simpan Perubahan</button>
                            <button type="button" onClick={() => setModalAdminAkun(false)} className="px-5 py-3 bg-slate-200 rounded-xl font-bold">Batal</button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}

                  {/* Modal Admin: Tambah Kategori / Prodi */}
                  {modalKategori && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-black mb-4">Tambah Sub-Kategori Baru</h3>
                        <form onSubmit={tambahKategoriBaru} className="space-y-4 text-sm">
                          <div>
                            <label className="font-bold mb-1 block text-xs text-slate-500">Pilih Jenjang Induk</label>
                            <select value={targetJenjangKategori} onChange={e => setTargetJenjangKategori(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 font-bold">
                              {daftarJenjang.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="font-bold mb-1 block text-xs text-slate-500">Nama Kelas / Jurusan / Prodi</label>
                            <input type="text" required value={namaKategoriBaru} onChange={e => setNamaKategoriBaru(e.target.value)} placeholder="Misal: Kelas 10 IPA 1, S1 Kedokteran..." className="w-full p-3 border rounded-xl bg-slate-50" />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl">Tambah</button>
                            <button type="button" onClick={() => setModalKategori(false)} className="px-4 py-3 bg-slate-200 rounded-xl font-bold">Batal</button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : userLogin.role === "guru" ? (
              /* --- PANEL GURU RELAWAN --- */
              <motion.div key="guru" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-indigo-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <h1 className="text-3xl font-black">Studio Pengajar: {userLogin.nama}</h1>
                    <p className="text-indigo-200 mt-1">Anda memiliki akses mengajar di <b>{opsiKelasGuru.length} kelas/jurusan spesifik.</b></p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-5 py-2.5 rounded-xl font-bold text-sm">Keluar</button>
                </div>

                <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-3xl mx-auto">
                  <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Upload className="text-indigo-600"/> Terbitkan Materi Baru</h2>
                  
                  {opsiKelasGuru.length === 0 ? (
                    <div className="p-6 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-center">
                      <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-rose-400"/>
                      <h3 className="font-bold text-lg">Akses Mengajar Belum Diberikan</h3>
                      <p className="text-sm mt-1">Admin belum menugaskan Anda ke kelas/jurusan manapun. Silakan hubungi Admin Panda Kode.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleGuruBuatMateri} className="space-y-4">
                      {notifGuru && <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-sm text-center">🎉 Materi sukses diterbitkan dan langsung tampil di ruang kelas siswa!</div>}
                      
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <label className="font-bold mb-2 block text-indigo-900 text-sm">📍 Target Kelas / Jurusan Anda:</label>
                        <select required value={subJenjangPilih} onChange={(e) => setSubJenjangPilih(e.target.value)} className="w-full p-3 bg-white border border-indigo-200 rounded-xl font-bold text-indigo-900 outline-none focus:ring-2 ring-indigo-500">
                          <option value="" disabled>-- Pilih Kelas yang Anda Ajar --</option>
                          {opsiKelasGuru.map(sj => (
                            <option key={sj.id} value={sj.id}>{sj.namaInduk} - {sj.nama}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold mb-1 block text-xs text-slate-500">Judul Materi</label>
                          <input type="text" required value={judulMateri} onChange={e => setJudulMateri(e.target.value)} placeholder="Judul bab..." className="w-full p-3 border rounded-xl bg-slate-50" />
                        </div>
                        <div>
                          <label className="font-bold mb-1 block text-xs text-slate-500">Tingkat Kesulitan</label>
                          <select value={levelMateri} onChange={(e) => setLevelMateri(e.target.value as any)} className="w-full p-3 border rounded-xl bg-slate-50 font-bold">
                            <option value="Pemula">Pemula (Dasar)</option>
                            <option value="Menengah">Menengah</option>
                            <option value="Mahir">Mahir / Olimpiade</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold mb-1 block text-xs text-slate-500">Link YouTube Materi</label>
                        <input type="url" required value={videoMateri} onChange={e => setVideoMateri(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full p-3 border rounded-xl bg-slate-50" />
                      </div>

                      <div>
                        <label className="font-bold mb-1 block text-xs text-slate-500">Rangkuman / Deskripsi</label>
                        <textarea rows={3} required value={rangkumanMateri} onChange={e => setRangkumanMateri(e.target.value)} placeholder="Ketik ringkasan materi di sini..." className="w-full p-3 border rounded-xl bg-slate-50" />
                      </div>

                      <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
                        <div className="font-black text-sm text-slate-800">📝 Soal Kuis Pemahaman</div>
                        <input type="text" required value={pertanyaanKuis} onChange={e => setPertanyaanKuis(e.target.value)} placeholder="Pertanyaan kuis..." className="w-full p-3 border bg-white rounded-xl text-sm font-semibold" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" required value={opsiA} onChange={e => setOpsiA(e.target.value)} placeholder="Opsi A" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiB} onChange={e => setOpsiB(e.target.value)} placeholder="Opsi B" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiC} onChange={e => setOpsiC(e.target.value)} placeholder="Opsi C" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiD} onChange={e => setOpsiD(e.target.value)} placeholder="Opsi D" className="p-3 border bg-white rounded-xl text-sm" />
                        </div>
                        <div>
                          <label className="font-bold mb-1 block text-xs text-slate-500">Kunci Jawaban yang Benar</label>
                          <select value={kunciKuis} onChange={e => setKunciKuis(Number(e.target.value))} className="w-full p-3 border bg-white rounded-xl font-bold">
                            <option value={0}>Opsi A</option>
                            <option value={1}>Opsi B</option>
                            <option value={2}>Opsi C</option>
                            <option value={3}>Opsi D</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition">🚀 Publikasikan ke Kelas Siswa</button>
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              /* --- PANEL SISWA --- */
              <motion.div key="siswa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-emerald-700 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <h1 className="text-3xl font-black">Halo, {userLogin.nama}!</h1>
                    <p className="text-emerald-100 mt-1">Teruslah semangat menuntut ilmu. Jelajahi menu Ruang Kelas untuk mulai belajar.</p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-5 py-2.5 rounded-xl font-bold text-sm">Keluar</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-5">
                    <div className="p-5 bg-amber-100 text-amber-600 rounded-2xl"><Flame className="w-10 h-10 fill-amber-500" /></div>
                    <div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Poin</div><div className="text-4xl font-black text-slate-900">{poinXP} XP</div></div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-5">
                    <div className="p-5 bg-emerald-100 text-emerald-600 rounded-2xl"><CheckCircle2 className="w-10 h-10" /></div>
                    <div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Materi Selesai</div><div className="text-4xl font-black text-slate-900">{materiSelesai.length} Modul</div></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ==================== RUANG KELAS UTAMA (SISTEM FILTER BARU) ==================== */}
        {menuAktif === "beranda" && (
          <>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12 pt-2">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="text-emerald-600">100% Gratis Selamanya.</span>
                  </h1>
                  <p className="text-slate-600 mb-8">Pilih jenjang pendidikanmu dan cari kelas impianmu sekarang!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarJenjang.map((jenjang) => (
                    <motion.div key={jenjang.id} whileHover={{ y: -6 }} onClick={() => { setJenjangAktif(jenjang); setSubJenjangAktif("semua"); }} className="cursor-pointer bg-white rounded-3xl p-6 border shadow-xs hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden">
                      <div className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`} />
                      <div>
                        <div className="flex justify-between mb-5 mt-2">
                          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md`}>
                            {renderIkon(jenjang.ikonNama)}
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}>{jenjang.subJenjang.length} Tingkat Kelas</span>
                        </div>
                        <h3 className="text-2xl font-extrabold mb-2">{jenjang.nama}</h3>
                        <p className="text-slate-600 text-sm">{jenjang.deskripsi}</p>
                      </div>
                      <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                        <span>Pilih & Buka Kelas</span><span>→</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setJenjangAktif(null)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2.5 rounded-xl border mb-6 shadow-sm hover:bg-slate-50 transition">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>
                
                <div className={`rounded-3xl p-8 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8`}>
                  <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{jenjangAktif.tagline}</span>
                  <h1 className="text-3xl font-black mt-3 mb-2">{jenjangAktif.nama}</h1>
                  <p className="text-white/90">{jenjangAktif.deskripsi}</p>
                </div>

                {/* FILTER SUB-JENJANG / JURUSAN / KELAS */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <button onClick={() => setSubJenjangAktif("semua")} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${subJenjangAktif === "semua" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                    Semua Materi
                  </button>
                  {jenjangAktif.subJenjang.map(sj => (
                    <button key={sj.id} onClick={() => setSubJenjangAktif(sj.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${subJenjangAktif === sj.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                      {sj.nama}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas
                    .filter(item => subJenjangAktif === "semua" || item.subJenjangId === subJenjangAktif)
                    .map((item) => {
                      const selesai = materiSelesai.includes(item.id);
                      const namaSub = jenjangAktif.subJenjang.find(s => s.id === item.subJenjangId)?.nama || "Umum";
                      return (
                        <div key={item.id} onClick={() => setKelasAktif(item)} className={`bg-white rounded-3xl p-6 border-2 shadow-xs hover:shadow-lg cursor-pointer transition flex flex-col justify-between ${selesai ? "border-emerald-400" : "border-slate-200"}`}>
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">📍 {namaSub}</span>
                              {selesai && <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">✔ Selesai</span>}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.judul}</h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{item.rangkuman}</p>
                          </div>
                          <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                            <span className="flex items-center gap-1.5"><PlayCircle className="w-5 h-5" /> Buka Video & Kuis</span>
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">+50 XP</span>
                          </div>
                        </div>
                      );
                  })}
                  
                  {jenjangAktif.kelas.filter(item => subJenjangAktif === "semua" || item.subJenjangId === subJenjangAktif).length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed rounded-3xl text-slate-400">
                      <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                      <p className="font-bold text-lg">Belum ada materi di kategori ini.</p>
                      <p className="text-sm">Guru relawan akan segera menambahkan materi ke kelas ini!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* HALAMAN MATERI DETAIL */}
            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setKelasAktif(null)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border mb-6 shadow-sm">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
                </button>
                <div className="flex justify-end mb-4">
                  <button onClick={() => toggleSelesaiMateri(kelasAktif.id)} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition ${materiSelesai.includes(kelasAktif.id) ? "bg-emerald-600 text-white" : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                    {materiSelesai.includes(kelasAktif.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    {materiSelesai.includes(kelasAktif.id) ? "Materi Selesai (+30 XP)" : "Tandai Selesai"}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border shadow-sm">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-4">
                        <iframe src={kelasAktif.videoUrl} title={kelasAktif.judul} className="w-full h-full" allowFullScreen />
                      </div>
                      <h1 className="text-2xl font-extrabold mb-3">{kelasAktif.judul}</h1>
                      <p className="text-slate-700 text-sm mb-4 leading-relaxed">{kelasAktif.rangkuman}</p>
                      {kelasAktif.rumusMatematika && (
                        <div className="bg-slate-900 text-amber-300 font-mono text-sm p-5 rounded-2xl mb-4 whitespace-pre-wrap">
                          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Rumus Penting:</div>
                          {kelasAktif.rumusMatematika}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md">
                      <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500"/> Kuis Pemahaman</h3>
                      <p className="font-bold text-sm mb-4 leading-snug">{kelasAktif.kuis.tanya}</p>
                      <div className="space-y-3 mb-4">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button key={idx} onClick={() => { setJawabanKuis(idx); if (idx === kelasAktif.kuis.jawabanBenar) { if (statusKuis !== "benar") tambahXP(50); setStatusKuis("benar"); } else { setStatusKuis("salah"); } }} className={`w-full text-left p-3.5 rounded-xl border-2 font-semibold text-sm transition ${jawabanKuis === idx ? statusKuis === "benar" ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-500 bg-rose-50 text-rose-900" : "border-slate-200 hover:bg-slate-50"}`}>
                            {opsi}
                          </button>
                        ))}
                      </div>
                      {statusKuis === "benar" && <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-bold border border-emerald-200">🎉 Tepat Sekali! (+50 XP)<br/><span className="font-normal mt-1 block">{kelasAktif.kuis.pembahasan}</span></div>}
                      {statusKuis === "salah" && <div className="p-4 bg-rose-50 rounded-xl text-xs text-rose-900 font-bold border border-rose-200">❌ Belum tepat, coba lagi ya!</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}