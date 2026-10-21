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
} from "lucide-react";
import confetti from "canvas-confetti";

// --- INTERFACE & STRUKTUR DATA ---
interface KuisItem {
  tanya: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

interface KelasItem {
  id: string;
  judul: string;
  kategori: string;
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
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  namaPelaku: string;
  rolePelaku: "admin" | "guru" | "siswa";
  aksi: string;
  kategori: "belajar" | "materi" | "akun" | "komunitas";
}

// --- DATA KURIKULUM AWAL ---
const DATA_JENJANG_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    badge: "bg-rose-100 text-rose-700",
    ikonNama: "sparkles",
    kelas: [
      {
        id: "tk-1",
        judul: "Mengenal Angka & Berhitung Ceria 1-10",
        kategori: "Berhitung Dasar",
        level: "Pemula",
        durasi: "5 Menit",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
        rangkuman: "Mari belajar menghitung buah-buahan! Angka 1 seperti tiang listrik, angka 2 seperti bebek berenang.",
        rumusMatematika: "2 🍎 + 1 🍎 = 3 🍎 (Tiga Apel Segar)",
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
    kelas: [
      {
        id: "sd-1",
        judul: "Rahasia Perkalian Cepat & Luas Bangun Datar",
        kategori: "Matematika SD",
        level: "Pemula",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/mvOkMYCygps",
        rangkuman: "Perkalian adalah penjumlahan yang berulang! Digunakan juga untuk menghitung luas persegi panjang dan segitiga.",
        rumusMatematika: "Luas Segitiga = ½ × Alas (a) × Tinggi (t)",
        kuis: {
          tanya: "Sebuah segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapakah luasnya?",
          opsi: ["10 cm²", "12 cm²", "24 cm²", "18 cm²"],
          jawabanBenar: 1,
          pembahasan: "Tepat! Luas = ½ × 6 × 4 = 12 cm².",
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
    kelas: [
      {
        id: "smp-1",
        judul: "Persamaan Aljabar & Teorema Pythagoras",
        kategori: "Matematika SMP",
        level: "Menengah",
        durasi: "12 Menit",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        rangkuman: "Aljabar menggunakan variabel x atau y untuk mencari angka misterius. Pythagoras membantu mencari sisi miring segitiga siku-siku.",
        rumusMatematika: "Rumus Pythagoras: a² + b² = c²  ⟹  c = √(a² + b²)",
        kuis: {
          tanya: "Jika segitiga siku-siku memiliki alas a = 3 cm dan tinggi b = 4 cm, berapakah sisi miringnya (c)?",
          opsi: ["c = 5 cm", "c = 6 cm", "c = 7 cm", "c = 25 cm"],
          jawabanBenar: 0,
          pembahasan: "Luar biasa! c = √(3² + 4²) = √25 = 5 cm.",
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
    kelas: [
      {
        id: "sma-1",
        judul: "Fisika Mekanika, Hukum Newton & Energi Kinetik",
        kategori: "Fisika SMA",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman: "Gaya berbanding lurus dengan massa dan percepatan benda. Energi kinetik bergantung pada kuadrat kecepatan.",
        rumusMatematika: "Hukum II Newton: ∑F = m · a\nEnergi Kinetik: Ek = ½ · m · v²",
        kuis: {
          tanya: "Sebuah benda bermassa 4 kg bergerak dengan kecepatan 3 m/s. Berapakah Energi Kinetiknya (Ek)?",
          opsi: ["6 Joule", "12 Joule", "18 Joule", "36 Joule"],
          jawabanBenar: 2,
          pembahasan: "Tepat! Ek = ½ · 4 · (3²) = 2 · 9 = 18 Joule.",
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
    kelas: [
      {
        id: "kuliah-1",
        judul: "Fullstack Next.js & React (Panda Kode)",
        kategori: "Teknik Informatika",
        level: "Mahir",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman: "React menggunakan komponen dan Hook seperti useState untuk memperbarui data layar secara instan.",
        contohKode: `// Contoh Kode React Hook oleh Panda Kode
import { useState } from "react";
export default function App() {
  const [xp, setXp] = useState(0);
  return <button onClick={() => setXp(xp + 10)}>XP: {xp}</button>;
}`,
        kuis: {
          tanya: "Hook apa yang digunakan di React/Next.js untuk menyimpan data yang bisa berubah-ubah di dalam komponen?",
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
    pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 × 3) - 10 adalah...",
    rumus: "Ingat KABATAKU: Kerjakan tanda kurung dan perkalian dulu!",
    opsi: ["51", "101", "61", "45"],
    jawabanBenar: 0,
    pembahasan: "12 × 3 = 36. Lalu 25 + 36 - 10 = 51.",
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
    pertanyaan: "Perintah Git untuk mengirim (upload) commit lokal ke GitHub adalah...",
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
  },
  {
    id: "sis-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswi Kelas 11 SMA",
    waktuDaftar: "Kemarin, 14:20",
  },
];

const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "06:30 WIB",
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

// --- 3. KOMPONEN UTAMA APLIKASI ---
export default function AplikasiHibahIlmu() {
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(DATA_JENJANG_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");

  // State Auth & Dashboard Multi-Role
  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);

  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);

  // State Ruang Kelas (Catatan & Kuis)
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

  // State Auth Manual / Register
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

  // State Guru Buat Materi
  const [jenjangPilih, setJenjangPilih] = useState("sd");
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

  useEffect(() => {
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    const savedAkunList = localStorage.getItem("hibah_daftar_akun");
    const savedUserAktif = localStorage.getItem("hibah_user_aktif");
    const savedLogs = localStorage.getItem("hibah_log_aktivitas");

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
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

  const catatLog = (
    namaPelaku: string,
    rolePelaku: "admin" | "guru" | "siswa",
    aksi: string,
    kategori: "belajar" | "materi" | "akun" | "komunitas"
  ) => {
    const jam = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const logBaru: LogAktivitas = {
      id: "log-" + Date.now(),
      waktu: `${jam} WIB`,
      namaPelaku,
      rolePelaku,
      aksi,
      kategori,
    };
    setLogAktivitas((prev) => {
      const safePrev = prev || [];
      const terbaru = [logBaru, ...safePrev];
      localStorage.setItem("hibah_log_aktivitas", JSON.stringify(terbaru));
      return terbaru;
    });
  };

  const lemparkanKonfeti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const tambahXP = (tambahan: number) => {
    setPoinXP((prev) => {
      const totalBaru = (prev || 0) + tambahan;
      localStorage.setItem("hibah_xp", totalBaru.toString());
      return totalBaru;
    });
    lemparkanKonfeti();
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
        catatLog(
          userLogin?.nama || "Siswa",
          userLogin?.role || "siswa",
          `Menandai selesai modul pelajaran (ID: ${kelasId})`,
          "belajar"
        );
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") {
      setPesanError("Akun kamu masih menunggu persetujuan Admin.");
      return;
    }
    if (akun.status === "rejected") {
      setPesanError("Akun ini sedang disuspend (dibekukan). Hubungi Admin.");
      return;
    }
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Berhasil masuk ke Dashboard ${akun.role.toUpperCase()}`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const safeAkunList = daftarAkun || [];
    const akunDitemukan = safeAkunList.find(
      (a) => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin
    );

    if (!akunDitemukan) {
      setPesanError("Email atau Password salah.");
      return;
    }
    if (akunDitemukan.status === "pending") {
      setPesanError("⏳ Akun menunggu persetujuan Admin.");
      return;
    }
    if (akunDitemukan.status === "rejected") {
      setPesanError("❌ Akun ini telah disuspend (dibekukan oleh Admin).");
      return;
    }
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Login ke sistem`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const safeAkunList = daftarAkun || [];
    const sudahAda = safeAkunList.some((a) => a.email.toLowerCase() === emailReg.toLowerCase());
    if (sudahAda) {
      setPesanError("Email sudah terdaftar.");
      return;
    }

    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(),
      nama: namaReg,
      email: emailReg,
      password: passwordReg,
      role: roleReg,
      status: "pending",
      infoTambahan: infoReg || (roleReg === "guru" ? "Relawan" : "Siswa"),
      waktuDaftar: "Baru saja",
    };

    const daftarTerbaru = [akunBaru, ...safeAkunList];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, `Mendaftar akun baru (Menunggu Approval)`, "akun");
    setPesanSukses("✅ Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  const ubahStatusAkun = (idTarget: string, statusBaru: "approved" | "rejected" | "pending") => {
    const safeAkunList = daftarAkun || [];
    const target = safeAkunList.find((a) => a.id === idTarget);
    if (!target) return;

    const daftarTerbaru = safeAkunList.map((akun) =>
      akun.id === idTarget ? { ...akun, status: statusBaru } : akun
    );
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    
    let aksiLog = `Mengubah status akun ${target.nama} menjadi ${statusBaru}`;
    if (statusBaru === "rejected") aksiLog = `Men-suspend (membekukan) akun ${target.nama}`;
    if (statusBaru === "approved") aksiLog = `Menyetujui / Mengaktifkan kembali akun ${target.nama}`;

    catatLog(userLogin?.nama || "Admin", "admin", aksiLog, "akun");
  };

  const hapusAkun = (idTarget: string) => {
    const safeAkunList = daftarAkun || [];
    const target = safeAkunList.find((a) => a.id === idTarget);
    if (!target || target.role === "admin") return;

    const daftarTerbaru = safeAkunList.filter((a) => a.id !== idTarget);
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(userLogin?.nama || "Admin", "admin", `Menghapus permanen akun ${target.nama}`, "akun");
  };

  // Fungsionalitas Admin: Simpan Tambah / Edit Akun
  const handleSimpanAkunAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const safeAkunList = daftarAkun || [];

    if (idEditAkun) {
      // Edit Akun Yang Ada
      const daftarTerbaru = safeAkunList.map((a) =>
        a.id === idEditAkun
          ? {
              ...a,
              nama: namaFormAdmin,
              email: emailFormAdmin,
              password: passFormAdmin || a.password,
              role: roleFormAdmin,
              status: statusFormAdmin,
              infoTambahan: infoFormAdmin,
            }
          : a
      );
      setDaftarAkun(daftarTerbaru);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
      catatLog(userLogin?.nama || "Admin", "admin", `Mengedit data akun: ${namaFormAdmin} (${roleFormAdmin})`, "akun");
    } else {
      // Tambah Akun Baru Oleh Admin
      const akunBaru: AkunPengguna = {
        id: "adm-usr-" + Date.now(),
        nama: namaFormAdmin,
        email: emailFormAdmin,
        password: passFormAdmin || "123",
        role: roleFormAdmin,
        status: statusFormAdmin,
        infoTambahan: infoFormAdmin || "Dibuat oleh Admin",
        waktuDaftar: "Oleh Admin",
      };
      const daftarTerbaru = [akunBaru, ...safeAkunList];
      setDaftarAkun(daftarTerbaru);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
      catatLog(userLogin?.nama || "Admin", "admin", `Membuat akun baru: ${namaFormAdmin} sebagai ${roleFormAdmin.toUpperCase()}`, "akun");
    }

    setModalAdminAkun(false);
    setIdEditAkun(null);
    setNamaFormAdmin("");
    setEmailFormAdmin("");
    setPassFormAdmin("");
    setInfoFormAdmin("");
  };

  const bukaModalTambahAkun = () => {
    setIdEditAkun(null);
    setNamaFormAdmin("");
    setEmailFormAdmin("");
    setPassFormAdmin("");
    setRoleFormAdmin("siswa");
    setStatusFormAdmin("approved");
    setInfoFormAdmin("");
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
    setModalAdminAkun(true);
  };

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin) return;

    let finalEmbed = videoMateri;
    if (videoMateri.includes("watch?v=")) finalEmbed = videoMateri.replace("watch?v=", "embed/");

    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(),
      judul: `${judulMateri} (Oleh: ${userLogin.nama})`,
      kategori: mapelMateri || userLogin.infoTambahan,
      level: levelMateri,
      durasi: "12 Menit",
      videoUrl: finalEmbed,
      rangkuman: rangkumanMateri,
      rumusMatematika: rumusMateri || undefined,
      kuis: {
        tanya: pertanyaanKuis || `Kesimpulan materi ${judulMateri}?`,
        opsi: [opsiA || "Paham", opsiB || "Kurang", opsiC || "Lanjut", opsiD || "Review"],
        jawabanBenar: kunciKuis,
        pembahasan: `Disusun oleh Guru ${userLogin.nama}.`,
      },
    };

    setDaftarJenjang((prev) =>
      (prev || []).map((j) => (j.id === jenjangPilih ? { ...j, kelas: [modulBaru, ...j.kelas] } : j))
    );
    catatLog(userLogin.nama, "guru", `Menerbitkan modul: "${judulMateri}"`, "materi");
    setNotifGuru(true);
    setJudulMateri("");
    setMapelMateri("");
    setVideoMateri("");
    setRangkumanMateri("");
    setRumusMateri("");
    setPertanyaanKuis("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  const selesaikanTryout = () => {
    let benar = 0;
    BANK_SOAL_TRYOUT.forEach((soal, idx) => {
      if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++;
    });
    const nilai = Math.round((benar / BANK_SOAL_TRYOUT.length) * 100);
    setSkorTryout(nilai);
    setUjianSelesai(true);
    setSedangUjian(false);
    if (benar > 0) tambahXP(benar * 40);
  };

  const renderIkonJenjang = (nama: string) => {
    switch (nama) {
      case "sparkles":
        return <Sparkles className="w-7 h-7 text-white" />;
      case "book":
        return <BookOpen className="w-7 h-7 text-white" />;
      case "compass":
        return <Compass className="w-7 h-7 text-white" />;
      case "school":
        return <School className="w-7 h-7 text-white" />;
      default:
        return <GraduationCap className="w-7 h-7 text-white" />;
    }
  };

  const safeAkunList = daftarAkun || [];
  const safeLogList = logAktivitas || [];
  const jumlahPending = safeAkunList.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
      </div>

      {/* HEADER ATAS */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              🐼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-800">
                  HibahIlmu
                </span>
                <span className="text-[10px] uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Pengabdian Masyarakat</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {[
              { id: "beranda", label: "Ruang Kelas", ikon: <BookOpen className="w-4 h-4" /> },
              { id: "tryout", label: "Tryout Ujian", ikon: <Timer className="w-4 h-4" /> },
              { id: "forum", label: "Tanya PR", ikon: <MessageSquare className="w-4 h-4" /> },
              { id: "transparansi", label: "Donasi Umat", ikon: <ShieldCheck className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  menuAktif === tab.id ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.ikon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{poinXP} XP</span>
            </div>

            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className={`relative flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-full shadow-sm transition ${
                userLogin
                  ? userLogin.role === "admin"
                    ? "bg-slate-900 text-amber-300"
                    : userLogin.role === "guru"
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{userLogin ? `Dashboard ${userLogin.role.toUpperCase()}` : "Daftar / Masuk"}</span>
              {jumlahPending > 0 && (
                <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {jumlahPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ==================== DASHBOARD & AUTH ==================== */}
        {menuAktif === "dashboard" && (
          <div>
            {!userLogin ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border shadow-lg">
                  <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
                    <button onClick={() => { setModeAuth("login"); setPesanError(""); }} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${modeAuth === "login" ? "bg-white shadow-xs" : "text-slate-500"}`}>Masuk</button>
                    <button onClick={() => { setModeAuth("register"); setPesanError(""); }} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${modeAuth === "register" ? "bg-white shadow-xs" : "text-slate-500"}`}>Daftar</button>
                  </div>
                  {pesanError && <div className="mb-4 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">{pesanError}</div>}
                  {pesanSukses && <div className="mb-4 p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold">{pesanSukses}</div>}

                  {modeAuth === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <input type="email" required value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} placeholder="Email..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <input type="password" required value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} placeholder="Password..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm">Masuk</button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick={() => setRoleReg("siswa")} className={`p-2 border rounded-xl font-bold text-xs ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-600" : ""}`}>Siswa</button>
                        <button type="button" onClick={() => setRoleReg("guru")} className={`p-2 border rounded-xl font-bold text-xs ${roleReg === "guru" ? "bg-indigo-50 border-indigo-600" : ""}`}>Guru</button>
                        <button type="button" onClick={() => setRoleReg("admin")} className={`p-2 border rounded-xl font-bold text-xs ${roleReg === "admin" ? "bg-amber-50 border-amber-600" : ""}`}>Admin</button>
                      </div>
                      <input type="text" required value={namaReg} onChange={(e) => setNamaReg(e.target.value)} placeholder="Nama Lengkap..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <input type="email" required value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder="Email..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <input type="password" required value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} placeholder="Password..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <input type="text" required value={infoReg} onChange={(e) => setInfoReg(e.target.value)} placeholder={roleReg === "guru" ? "Mata Pelajaran..." : "Sekolah / Info..."} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm">Daftar Akun</button>
                    </form>
                  )}
                </div>

                <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-md">Demo 1-Klik</span>
                    <h3 className="text-lg font-black mt-2 mb-4">Masuk Cepat:</h3>
                    <div className="space-y-2">
                      {safeAkunList.filter((a) => a.status === "approved").map((akun) => (
                        <button key={akun.id} onClick={() => loginCepat(akun)} className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex justify-between items-center text-xs">
                          <span>{akun.nama} ({akun.role})</span>
                          <span className="text-amber-300 font-bold">Masuk →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "admin" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-wrap justify-between items-center gap-4 shadow-lg">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">👑 Super Admin</span>
                    <h1 className="text-2xl font-black mt-2">Pusat Kendali Akun HibahIlmu</h1>
                    <p className="text-xs text-slate-300">Kelola pendaftaran, edit data, suspend, dan tambah akun baru.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={bukaModalTambahAkun} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <UserPlus className="w-4 h-4" /> Tambah Akun Baru
                    </button>
                    <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </div>

                {/* MODAL ADMIN TAMBAH / EDIT AKUN */}
                {modalAdminAkun && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
                      <h3 className="text-xl font-black mb-4">{idEditAkun ? "Edit Data Akun Pengguna" : "Buat Akun Baru (Oleh Admin)"}</h3>
                      <form onSubmit={handleSimpanAkunAdmin} className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold block mb-1">Nama Lengkap</label>
                          <input type="text" required value={namaFormAdmin} onChange={(e) => setNamaFormAdmin(e.target.value)} placeholder="Nama..." className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Email</label>
                          <input type="email" required value={emailFormAdmin} onChange={(e) => setEmailFormAdmin(e.target.value)} placeholder="Email..." className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Password {idEditAkun && "(Kosongkan jika tidak diubah)"}</label>
                          <input type="password" value={passFormAdmin} onChange={(e) => setPassFormAdmin(e.target.value)} placeholder="Password..." className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold block mb-1">Peran (Role)</label>
                            <select value={roleFormAdmin} onChange={(e) => setRoleFormAdmin(e.target.value as any)} className="w-full p-2.5 border rounded-xl font-bold">
                              <option value="siswa">Siswa</option>
                              <option value="guru">Guru Relawan</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-bold block mb-1">Status Akun</label>
                            <select value={statusFormAdmin} onChange={(e) => setStatusFormAdmin(e.target.value as any)} className="w-full p-2.5 border rounded-xl font-bold">
                              <option value="approved">Approved (Aktif)</option>
                              <option value="pending">Pending</option>
                              <option value="rejected">Suspended (Dibekukan)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="font-bold block mb-1">Info Tambahan (Mapel / Sekolah)</label>
                          <input type="text" value={infoFormAdmin} onChange={(e) => setInfoFormAdmin(e.target.value)} placeholder="Info..." className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs">Simpan Akun</button>
                          <button type="button" onClick={() => setModalAdminAkun(false)} className="px-4 py-2.5 bg-slate-100 rounded-xl font-bold">Batal</button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* TABEL MANAJEMEN AKUN LENGKAP (EDIT, SUSPEND, HAPUS) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                    <h2 className="text-base font-black flex items-center justify-between">
                      <span>Kelola Seluruh Akun ({safeAkunList.length})</span>
                    </h2>
                    <div className="space-y-2.5 max-h-[30rem] overflow-y-auto pr-1">
                      {safeAkunList.map((akun) => (
                        <div key={akun.id} className="p-3.5 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <div className="font-extrabold text-sm flex items-center gap-1.5">
                              {akun.nama}
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${akun.role === "admin" ? "bg-amber-100 text-amber-900" : akun.role === "guru" ? "bg-indigo-100 text-indigo-900" : "bg-emerald-100 text-emerald-900"}`}>{akun.role}</span>
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${akun.status === "approved" ? "bg-emerald-100 text-emerald-700" : akun.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{akun.status === "rejected" ? "Suspended" : akun.status}</span>
                            </div>
                            <div className="text-slate-500 mt-0.5">{akun.email} • {akun.infoTambahan}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Tombol Suspend / Aktifkan Kembali */}
                            {akun.status === "approved" ? (
                              <button onClick={() => ubahStatusAkun(akun.id, "rejected")} title="Suspend Akun" className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl">
                                <UserX2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button onClick={() => ubahStatusAkun(akun.id, "approved")} title="Setujui / Aktifkan" className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl">
                                <UserCheck2 className="w-4 h-4" />
                              </button>
                            )}
                            {/* Tombol Edit Akun */}
                            <button onClick={() => bukaModalEditAkun(akun)} title="Edit Akun" className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {/* Tombol Hapus Akun */}
                            {akun.role !== "admin" && (
                              <button onClick={() => hapusAkun(akun.id)} title="Hapus Permanen" className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LOG AKTIVITAS */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border shadow-sm">
                    <h2 className="text-base font-black mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> Log Aktivitas Real-Time</h2>
                    <div className="space-y-2 max-h-[30rem] overflow-y-auto text-xs pr-1">
                      {safeLogList.map((l) => (
                        <div key={l.id} className="p-2.5 bg-slate-50 border rounded-xl flex justify-between gap-2">
                          <span><b>[{l.rolePelaku}] {l.namaPelaku}:</b> {l.aksi}</span>
                          <span className="font-mono text-slate-400 shrink-0">{l.waktu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "guru" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-indigo-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">👨‍🏫 Dashboard Guru</span>
                    <h1 className="text-2xl font-black mt-2">Selamat Mengajar, {userLogin.nama}!</h1>
                    <p className="text-xs text-indigo-200">Terbitkan modul materi dan kuis interaktif.</p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">Keluar</button>
                </div>

                <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-2xl">
                  <h2 className="text-lg font-black mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-indigo-600" /> Studio Guru</h2>
                  {notifGuru && <div className="mb-4 p-3 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl">Materi berhasil diterbitkan!</div>}
                  <form onSubmit={handleGuruBuatMateri} className="space-y-3 text-xs">
                    <select value={jenjangPilih} onChange={(e) => setJenjangPilih(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-semibold">
                      {(daftarJenjang || []).map((j) => <option key={j.id} value={j.id}>{j.nama}</option>)}
                    </select>
                    <input type="text" required value={judulMateri} onChange={(e) => setJudulMateri(e.target.value)} placeholder="Judul Materi..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="text" required value={mapelMateri} onChange={(e) => setMapelMateri(e.target.value)} placeholder="Mata Pelajaran..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="text" required value={videoMateri} onChange={(e) => setVideoMateri(e.target.value)} placeholder="Link YouTube..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <textarea rows={2} required value={rangkumanMateri} onChange={(e) => setRangkumanMateri(e.target.value)} placeholder="Rangkuman..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm">Terbitkan Materi</button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-emerald-700 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase">🎓 Dashboard Siswa</span>
                    <h1 className="text-2xl font-black mt-2">Semangat Belajar, {userLogin.nama}!</h1>
                    <p className="text-xs text-emerald-100">Total XP: {poinXP} XP • Selesai: {materiSelesai.length} modul</p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">Keluar</button>
                </div>

                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <h2 className="text-base font-black mb-3">Riwayat Aktivitasmu</h2>
                  <div className="space-y-2 text-xs">
                    {safeLogList
                      .filter((l) => l.namaPelaku === userLogin.nama || l.rolePelaku === "siswa")
                      .map((log) => (
                        <div key={log.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between">
                          <span>✅ {log.aksi}</span>
                          <span className="font-mono text-slate-400">{log.waktu}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* 2. TRYOUT UJIAN */}
        {menuAktif === "tryout" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl mb-8 flex justify-between items-center">
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Simulasi Ujian</span>
                <h1 className="text-3xl font-black mt-2">Tryout & Latihan Berwaktu</h1>
              </div>
              {sedangUjian && (
                <div className="bg-slate-900/80 px-5 py-3 rounded-2xl text-center">
                  <div className="text-xs text-amber-300 font-bold">Waktu</div>
                  <div className="font-mono text-2xl font-black text-white">
                    {Math.floor(sisaWaktu / 60)}:{sisaWaktu % 60 < 10 ? "0" : ""}{sisaWaktu % 60}
                  </div>
                </div>
              )}
            </div>

            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-8 border text-center shadow-sm">
                <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-extrabold mb-2">Mulai Simulasi Tryout?</h2>
                <button onClick={() => { setJawabanUserTryout({}); setSisaWaktu(180); setUjianSelesai(false); setSedangUjian(true); }} className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg inline-flex items-center gap-2">
                  <Play className="w-5 h-5 fill-white" /> Mulai Sekarang
                </button>
              </div>
            )}

            {sedangUjian && (
              <div className="space-y-6">
                {BANK_SOAL_TRYOUT.map((soal, idx) => (
                  <div key={soal.id} className="bg-white rounded-3xl p-6 border">
                    <h3 className="font-bold text-lg mb-3">{soal.pertanyaan}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {soal.opsi.map((pilihan, opsiIdx) => (
                        <button key={opsiIdx} onClick={() => setJawabanUserTryout((prev) => ({ ...prev, [idx]: opsiIdx }))} className={`p-3.5 rounded-2xl border-2 text-left font-semibold text-sm ${jawabanUserTryout[idx] === opsiIdx ? "border-indigo-600 bg-indigo-50" : "border-slate-200"}`}>
                          {pilihan}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={selesaikanTryout} className="w-full bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg">Kumpulkan Jawaban</button>
              </div>
            )}

            {ujianSelesai && (
              <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center shadow-md">
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                <div className="text-3xl font-black mb-2">Skor Anda: {skorTryout} / 100</div>
                <button onClick={() => { setUjianSelesai(false); setSedangUjian(false); }} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl mt-4">Ulangi Tryout</button>
              </div>
            )}
          </motion.div>
        )}

        {/* 3. FORUM TANYA PR */}
        {menuAktif === "forum" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-black mb-2">Forum Tanya PR</h1>
              <p className="text-emerald-50 text-sm">Tanyakan tugas sekolahmu di sini.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (!tanyaBaru.trim()) return; setDaftarDiskusi([{ id: "pr-" + Date.now(), penanya: userLogin?.nama || "Pelajar", jenjang: "Umum", mapel: mapelBaru, pertanyaan: tanyaBaru, waktu: "Baru saja", jawaban: [] }, ...daftarDiskusi]); setTanyaBaru(""); tambahXP(20); }} className="bg-white rounded-3xl p-6 border space-y-3">
              <input type="text" value={mapelBaru} onChange={(e) => setMapelBaru(e.target.value)} placeholder="Mapel..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <textarea rows={3} required value={tanyaBaru} onChange={(e) => setTanyaBaru(e.target.value)} placeholder="Tuliskan soal PR..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Kirim Pertanyaan (+20 XP)</button>
            </form>

            <div className="space-y-4">
              {daftarDiskusi.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border">
                  <div className="font-bold text-sm mb-2">{item.mapel} • {item.penanya}</div>
                  <p className="text-sm mb-3">{item.pertanyaan}</p>
                  <div className="space-y-2 pl-4 border-l-2 border-emerald-200 mb-3">
                    {item.jawaban.map((jwb, i) => (
                      <div key={i} className="bg-emerald-50 p-3 rounded-xl text-xs"><b>{jwb.penjawab}:</b> {jwb.isi}</div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={balasanInput[item.id] || ""} onChange={(e) => setBalasanInput({ ...balasanInput, [item.id]: e.target.value })} placeholder="Bantu jawab..." className="flex-1 px-3 py-2 bg-slate-50 border rounded-xl text-xs" />
                    <button onClick={() => { const isi = balasanInput[item.id]; if (!isi) return; setDaftarDiskusi(daftarDiskusi.map((d) => d.id === item.id ? { ...d, jawaban: [...d.jawaban, { penjawab: userLogin?.nama || "Relawan", isi }] } : d)); setBalasanInput({ ...balasanInput, [item.id]: "" }); tambahXP(35); }} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Jawab</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. DONASI & TRANSPARANSI */}
        {menuAktif === "transparansi" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 text-white text-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h1 className="text-3xl font-black mb-2">Transparansi Dana Umat</h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">Donasi sukarela digunakan untuk server dan domain <strong>hibahilmu.id</strong>.</p>
              <div className="bg-white/10 p-5 rounded-2xl max-w-md mx-auto text-left">
                <div className="flex justify-between text-xs font-bold mb-1 text-emerald-300">
                  <span>Terkumpul: Rp 850.000</span>
                  <span>Target: Rp 1.500.000</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[56%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5. RUANG KELAS UTAMA */}
        {menuAktif === "beranda" && (
          <>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12 pt-2">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="text-emerald-600">100% Gratis Selamanya.</span>
                  </h1>
                  <p className="text-slate-600 mb-8">Pilih jenjang pendidikanmu dan mulai belajar interaktif sekarang!</p>
                  <div className="max-w-xl mx-auto relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kataKunci}
                      onChange={(e) => setKataKunci(e.target.value)}
                      placeholder="Cari pelajaran..."
                      className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl shadow-md text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarJenjang
                    .filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase()))
                    .map((jenjang, idx) => (
                      <motion.div
                        key={jenjang.id}
                        whileHover={{ y: -6 }}
                        onClick={() => setJenjangAktif(jenjang)}
                        className="cursor-pointer bg-white rounded-3xl p-6 border shadow-xs hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`} />
                        <div>
                          <div className="flex justify-between mb-5 mt-2">
                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md`}>
                              {renderIkonJenjang(jenjang.ikonNama)}
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}>
                              {jenjang.kelas.length} Modul
                            </span>
                          </div>
                          <h3 className="text-2xl font-extrabold mb-2">{jenjang.nama}</h3>
                          <p className="text-slate-600 text-sm">{jenjang.deskripsi}</p>
                        </div>
                        <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span>Buka Kelas</span>
                          <span>→</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <button
                  onClick={() => setJenjangAktif(null)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border mb-6 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>
                <div className={`rounded-3xl p-8 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8`}>
                  <h1 className="text-3xl font-black mb-2">{jenjangAktif.nama}</h1>
                  <p className="text-white/90 text-sm">{jenjangAktif.deskripsi}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas.map((item) => {
                    const selesai = materiSelesai.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setKelasAktif(item)}
                        className={`bg-white rounded-3xl p-6 border-2 shadow-xs hover:shadow-lg cursor-pointer transition flex flex-col justify-between ${
                          selesai ? "border-emerald-400" : "border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">⚡ {item.level}</span>
                            {selesai && <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">✔ Selesai</span>}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{item.judul}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">{item.rangkuman}</p>
                        </div>
                        <div className="pt-4 border-t mt-4 flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span className="flex items-center gap-1.5"><PlayCircle className="w-5 h-5" /> Mulai Belajar</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">+50 XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={() => setKelasAktif(null)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border mb-6 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
                </button>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => toggleSelesaiMateri(kelasAktif.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm ${
                      materiSelesai.includes(kelasAktif.id) ? "bg-emerald-600 text-white" : "bg-white border-2 border-slate-300 text-slate-700"
                    }`}
                  >
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
                      <p className="text-slate-700 text-sm mb-4">{kelasAktif.rangkuman}</p>
                      {kelasAktif.rumusMatematika && (
                        <div className="bg-slate-900 text-amber-300 font-mono text-sm p-4 rounded-xl mb-4 whitespace-pre-wrap">
                          {kelasAktif.rumusMatematika}
                        </div>
                      )}
                      {kelasAktif.contohKode && (
                        <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl overflow-x-auto">
                          <pre>{kelasAktif.contohKode}</pre>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200">
                      <h3 className="font-bold mb-2 flex items-center gap-2"><FileEdit className="w-5 h-5 text-amber-600" /> Buku Catatan Pribadi</h3>
                      <textarea
                        rows={3}
                        value={catatanSiswa}
                        onChange={(e) => setCatatanSiswa(e.target.value)}
                        placeholder="Tulis catatanmu di sini..."
                        className="w-full p-3 bg-white border border-amber-300 rounded-xl text-sm mb-3"
                      />
                      <button onClick={() => { localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa); setStatusSimpanCatatan(true); setTimeout(() => setStatusSimpanCatatan(false), 2000); }} className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">
                        Simpan Catatan
                      </button>
                      {statusSimpanCatatan && <span className="ml-3 text-xs text-emerald-700 font-bold">✔ Tersimpan!</span>}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md sticky top-24">
                      <h3 className="font-bold text-base mb-4">{kelasAktif.kuis.tanya}</h3>
                      <div className="space-y-3 mb-4">
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
                            className={`w-full text-left p-3 rounded-xl border-2 font-semibold text-xs transition ${
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
                      {statusKuis === "benar" && <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-bold">🎉 Benar! (+50 XP)</div>}
                      {statusKuis === "salah" && <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-900 font-bold">Belum tepat, coba lagi!</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <footer className="border-t bg-white/70 py-6 text-center text-xs text-slate-500 mt-16">
        Dibangun dengan cinta oleh 🐼 <strong>Panda Kode</strong> • HibahIlmu.id
      </footer>
    </div>
  );
}