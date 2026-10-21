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

// --- 1. INTERFACE & STRUKTUR DATA ---
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

// --- 2. DATA AWAL ---
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
        kuis: { tanya: "2 Apel + 1 Apel = ?", opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"], jawabanBenar: 1, pembahasan: "2 + 1 = 3" },
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
      { id: "sd-1", nama: "Kelas 1 SD" }, { id: "sd-2", nama: "Kelas 2 SD" }, { id: "sd-3", nama: "Kelas 3 SD" },
      { id: "sd-4", nama: "Kelas 4 SD" }, { id: "sd-5", nama: "Kelas 5 SD" }, { id: "sd-6", nama: "Kelas 6 SD" },
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
      { id: "smp-7", nama: "Kelas 7 SMP" }, { id: "smp-8", nama: "Kelas 8 SMP" }, { id: "smp-9", nama: "Kelas 9 SMP" },
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
      { id: "sma-10", nama: "Kelas 10 Umum" }, { id: "sma-11-ipa", nama: "Kelas 11 MIPA" }, { id: "sma-11-ips", nama: "Kelas 11 IPS" },
      { id: "sma-12-ipa", nama: "Kelas 12 MIPA" }, { id: "sma-12-ips", nama: "Kelas 12 IPS" },
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
        kuis: { tanya: "Benda 4 kg, kecepatan 3 m/s. Berapa Ek?", opsi: ["6 J", "12 J", "18 J", "36 J"], jawabanBenar: 2, pembahasan: "Ek = ½ · 4 · (3²) = 18 Joule." },
      },
    ],
  },
  {
    id: "kuliah",
    nama: "Kuliah & Karier",
    tagline: "Keahlian Profesional & IT",
    deskripsi: "Pemrograman Web, AI, Bisnis & Desain.",
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
        contohKode: `const [xp, setXp] = useState(0);`,
        kuis: { tanya: "Hook untuk menyimpan data berubah-ubah?", opsi: ["useRouter", "useState", "useEffect", "useMemo"], jawabanBenar: 1, pembahasan: "useState() adalah fondasi utama." },
      },
    ],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  { id: "to-1", jenjang: "SD", pertanyaan: "25 + (12 × 3) - 10 = ...", rumus: "KABATAKU", opsi: ["51", "101", "61", "45"], jawabanBenar: 0, pembahasan: "12×3=36. 25+36-10=51." },
  { id: "to-2", jenjang: "SMP", pertanyaan: "f(x) = 3x - 5. f(4)?", rumus: "Substitusi x=4", opsi: ["5", "7", "12", "17"], jawabanBenar: 1, pembahasan: "3(4)-5=7." },
];

const AKUN_DEFAULT: AkunPengguna[] = [
  { id: "adm-1", nama: "Admin Panda Kode", email: "admin@hibahilmu.id", password: "123", role: "admin", status: "approved", infoTambahan: "Super Admin", waktuDaftar: "Permanen", aksesMengajar: [] },
  { id: "gru-1", nama: "Budi Santoso", email: "guru@hibahilmu.id", password: "123", role: "guru", status: "approved", infoTambahan: "Guru SMA", waktuDaftar: "Kemarin", aksesMengajar: ["sma-11-ipa", "sma-12-ipa"] },
  { id: "sis-1", nama: "Aisyah", email: "siswa@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswi SMA", waktuDaftar: "Kemarin", aksesMengajar: [] },
];

const LOG_AWAL: LogAktivitas[] = [
  { id: "log-1", waktu: "06:30", namaPelaku: "Budi Santoso", rolePelaku: "guru", aksi: "Mengunggah materi", kategori: "materi" },
];

// --- 3. KOMPONEN UTAMA ---
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

  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState(false);
  const [jawabanKuis, setJawabanKuis] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);

  const [sedangUjian, setSedangUjian] = useState(false);
  const [ujianSelesai, setUjianSelesai] = useState(false);
  const [sisaWaktu, setSisaWaktu] = useState(180);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [skorTryout, setSkorTryout] = useState(0);

  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([]);
  const [tanyaBaru, setTanyaBaru] = useState("");
  const [mapelBaru, setMapelBaru] = useState("");
  const [balasanInput, setBalasanInput] = useState<{ [key: string]: string }>({});

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

  const [modalAdminAkun, setModalAdminAkun] = useState(false);
  const [idEditAkun, setIdEditAkun] = useState<string | null>(null);
  const [namaFormAdmin, setNamaFormAdmin] = useState("");
  const [emailFormAdmin, setEmailFormAdmin] = useState("");
  const [passFormAdmin, setPassFormAdmin] = useState("");
  const [roleFormAdmin, setRoleFormAdmin] = useState<"admin" | "guru" | "siswa">("siswa");
  const [statusFormAdmin, setStatusFormAdmin] = useState<"approved" | "pending" | "rejected">("approved");
  const [infoFormAdmin, setInfoFormAdmin] = useState("");
  const [aksesMengajarForm, setAksesMengajarForm] = useState<string[]>([]);

  const [selectedAkunIds, setSelectedAkunIds] = useState<string[]>([]);
  const [modalImportAkun, setModalImportAkun] = useState(false);
  const [teksImportJson, setTeksImportJson] = useState("");
  const [notifImport, setNotifImport] = useState("");

  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

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
  const [kunciKuis, setKunciKuis] = useState(0);
  const [notifGuru, setNotifGuru] = useState(false);

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
      interval = setInterval(() => setSisaWaktu(p => p - 1), 1000);
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

  const catatLog = (namaPelaku: string, rolePelaku: "admin" | "guru" | "siswa", aksi: string, kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem") => {
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const logBaru: LogAktivitas = { id: "log-" + Date.now(), waktu: `${jam} WIB`, namaPelaku, rolePelaku, aksi, kategori };
    setLogAktivitas(prev => {
      const terbaru = [logBaru, ...(prev || [])];
      localStorage.setItem("hibah_log_aktivitas", JSON.stringify(terbaru));
      return terbaru;
    });
  };

  const tambahXP = (tambahan: number) => {
    setPoinXP(prev => {
      const totalBaru = (prev || 0) + tambahan;
      localStorage.setItem("hibah_xp", totalBaru.toString());
      return totalBaru;
    });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const toggleSelesaiMateri = (kelasId: string) => {
    setMateriSelesai(prev => {
      const safePrev = prev || [];
      const sudahAda = safePrev.includes(kelasId);
      let daftarBaru = sudahAda ? safePrev.filter(id => id !== kelasId) : [...safePrev, kelasId];
      if (!sudahAda) {
        tambahXP(30);
        catatLog(userLogin?.nama || "Siswa", userLogin?.role || "siswa", `Selesai modul ${kelasId}`, "belajar");
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun disuspend.");
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Login ke Dashboard`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    const akunDitemukan = (daftarAkun || []).find(a => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin);
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending") return setPesanError("Akun pending.");
    if (akunDitemukan.status === "rejected") return setPesanError("Akun disuspend.");
    setUserLogin(akunDitemukan);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Login ke sistem`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");
    if ((daftarAkun || []).some(a => a.email.toLowerCase() === emailReg.toLowerCase())) return setPesanError("Email sudah terdaftar.");
    
    const akunBaru: AkunPengguna = {
      id: "usr-" + Date.now(), nama: namaReg, email: emailReg, password: passwordReg,
      role: roleReg, status: "pending", infoTambahan: infoReg || "Baru", waktuDaftar: "Baru saja", aksesMengajar: []
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg, `Mendaftar akun`, "akun");
    setPesanSukses("Pendaftaran terkirim!");
    setModeAuth("login");
  };

  const ubahStatusAkun = (id: string, status: "approved" | "rejected" | "pending") => {
    const update = (daftarAkun || []).map(a => a.id === id ? { ...a, status } : a);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Ubah status akun menjadi ${status}`, "akun");
  };

  const hapusAkun = (id: string) => {
    const update = (daftarAkun || []).filter(a => a.id !== id);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Hapus akun`, "akun");
  };

  const hapusAkunSekaligus = () => {
    if (!confirm(`Hapus ${selectedAkunIds.length} akun?`)) return;
    const update = (daftarAkun || []).filter(a => !selectedAkunIds.includes(a.id) || a.role === "admin");
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Bulk delete akun`, "akun");
    setSelectedAkunIds([]);
  };

  // --- FUNGSI YANG SEBELUMNYA HILANG ---
  const togglePilihAkun = (id: string) => {
    setSelectedAkunIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const bukaModalEditAkun = (akun: AkunPengguna) => {
    setIdEditAkun(akun.id);
    setNamaFormAdmin(akun.nama);
    setEmailFormAdmin(akun.email);
    setPassFormAdmin(""); // Sengaja dikosongkan, diisi jika ingin ubah password
    setRoleFormAdmin(akun.role);
    setStatusFormAdmin(akun.status);
    setInfoFormAdmin(akun.infoTambahan);
    setAksesMengajarForm(akun.aksesMengajar || []);
    setModalAdminAkun(true);
  };
  // ------------------------------------

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(teksImportJson);
      const akunBaruMasuk: AkunPengguna[] = parsedData.map((item: any, idx: number) => ({
        id: "import-" + Date.now() + "-" + idx, nama: item.nama || "User", email: item.email || `u${idx}@h.id`,
        password: item.password || "123", role: item.role || "siswa", status: "approved", infoTambahan: "Import", waktuDaftar: "Import"
      }));
      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      setNotifImport(`✅ Sukses import ${akunBaruMasuk.length} akun`);
      setTimeout(() => setModalImportAkun(false), 2000);
    } catch (err) {
      alert("JSON tidak valid!");
    }
  };

  const simpanAkunAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (idEditAkun) {
      const update = (daftarAkun || []).map(a => a.id === idEditAkun ? {
        ...a, nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || a.password,
        role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin, aksesMengajar: aksesMengajarForm
      } : a);
      setDaftarAkun(update);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    } else {
      const akunBaru: AkunPengguna = {
        id: "adm-usr-" + Date.now(), nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || "123",
        role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin, waktuDaftar: "Oleh Admin", aksesMengajar: aksesMengajarForm
      };
      setDaftarAkun([akunBaru, ...(daftarAkun || [])]);
    }
    setModalAdminAkun(false);
  };

  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault();
    const idBaru = `sub-${Date.now()}`;
    const update = daftarJenjang.map(j => j.id === targetJenjangKategori ? { ...j, subJenjang: [...j.subJenjang, { id: idBaru, nama: namaKategoriBaru }] } : j);
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    setModalKategori(false);
    setNamaKategoriBaru("");
  };

  const opsiKelasGuru = (daftarJenjang || []).flatMap(j => 
    j.subJenjang.filter(sj => userLogin?.aksesMengajar?.includes(sj.id)).map(sj => ({ ...sj, namaInduk: j.nama }))
  );

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !subJenjangPilih) return;
    let finalEmbed = videoMateri.includes("watch?v=") ? videoMateri.replace("watch?v=", "embed/") : videoMateri;
    
    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(), subJenjangId: subJenjangPilih, judul: judulMateri, level: levelMateri,
      durasi: "15 Menit", videoUrl: finalEmbed, rangkuman: rangkumanMateri, rumusMatematika: rumusMateri,
      kuis: { tanya: pertanyaanKuis, opsi: [opsiA, opsiB, opsiC, opsiD], jawabanBenar: kunciKuis, pembahasan: "Selesai" }
    };

    const update = daftarJenjang.map(j => j.subJenjang.some(sj => sj.id === subJenjangPilih) ? { ...j, kelas: [modulBaru, ...j.kelas] } : j);
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));
    setNotifGuru(true); setTimeout(() => setNotifGuru(false), 3000);
  };

  const selesaikanTryout = () => {
    let benar = 0;
    BANK_SOAL_TRYOUT.forEach((soal, idx) => { if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++; });
    setSkorTryout(Math.round((benar / BANK_SOAL_TRYOUT.length) * 100));
    setUjianSelesai(true); setSedangUjian(false);
    if (benar > 0) tambahXP(benar * 40);
  };

  const renderIkon = (nama: string) => {
    if (nama === "sparkles") return <Sparkles className="w-6 h-6 text-white"/>;
    if (nama === "book") return <BookOpen className="w-6 h-6 text-white"/>;
    if (nama === "compass") return <Compass className="w-6 h-6 text-white"/>;
    if (nama === "school") return <School className="w-6 h-6 text-white"/>;
    return <GraduationCap className="w-6 h-6 text-white"/>;
  };

  // --- HTML RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <div onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl">🐼</div>
            <div>
              <div className="font-extrabold text-xl text-emerald-900 leading-none">HibahIlmu</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">LMS Open Source</div>
            </div>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto">
            <button onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold ${menuAktif === "beranda" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Ruang Kelas</button>
            <button onClick={() => setMenuAktif("tryout")} className={`px-4 py-2 rounded-xl text-xs font-bold ${menuAktif === "tryout" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Tryout</button>
            <button onClick={() => setMenuAktif("forum")} className={`px-4 py-2 rounded-xl text-xs font-bold ${menuAktif === "forum" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Forum</button>
            <button onClick={() => setMenuAktif("transparansi")} className={`px-4 py-2 rounded-xl text-xs font-bold ${menuAktif === "transparansi" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Donasi</button>
            <button onClick={() => setMenuAktif("dashboard")} className={`px-4 py-2 rounded-xl text-xs font-bold ${menuAktif === "dashboard" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"}`}>
              {userLogin ? `Panel ${userLogin.role}` : "Login"}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ==================== 1. DASHBOARD ==================== */}
        {menuAktif === "dashboard" && (
          <div>
            {!userLogin ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow border">
                <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => setModeAuth("login")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${modeAuth === "login" ? "bg-white shadow" : ""}`}>Masuk</button>
                  <button onClick={() => setModeAuth("register")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${modeAuth === "register" ? "bg-white shadow" : ""}`}>Daftar</button>
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
                      <button type="button" onClick={() => setRoleReg("siswa")} className={`p-2 border rounded-xl text-xs font-bold ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-500" : ""}`}>Siswa</button>
                      <button type="button" onClick={() => setRoleReg("guru")} className={`p-2 border rounded-xl text-xs font-bold ${roleReg === "guru" ? "bg-indigo-50 border-indigo-500" : ""}`}>Guru</button>
                    </div>
                    <input type="text" required value={namaReg} onChange={e => setNamaReg(e.target.value)} placeholder="Nama Lengkap" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="email" required value={emailReg} onChange={e => setEmailReg(e.target.value)} placeholder="Email" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <input type="password" required value={passwordReg} onChange={e => setPasswordReg(e.target.value)} placeholder="Password" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Daftar Akun</button>
                  </form>
                )}
                <div className="mt-8 pt-6 border-t">
                  <div className="text-[10px] font-bold text-slate-400 mb-2">DEMO LOGIN:</div>
                  {daftarAkun.filter(a => a.status === "approved").slice(0, 3).map(a => (
                    <button key={a.id} onClick={() => loginCepat(a)} className="w-full text-left text-xs bg-slate-100 hover:bg-slate-200 py-2 px-3 mb-2 rounded-lg font-bold flex justify-between">
                      <span>{a.nama}</span> <span className="uppercase text-emerald-600">{a.role}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : userLogin.role === "admin" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
                  <div>
                    <h1 className="text-2xl font-black">Panel Admin</h1>
                    <p className="text-slate-400 text-sm">Kelola Akun & Hierarki</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModalImportAkun(true)} className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1"><Upload className="w-4 h-4"/> Import</button>
                    <button onClick={() => { setIdEditAkun(null); setModalAdminAkun(true); }} className="bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1"><UserPlus className="w-4 h-4"/> Tambah</button>
                    <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 px-4 py-2 rounded-xl text-xs font-bold">Keluar</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h2 className="font-black text-lg mb-4 flex justify-between items-center">
                      <span>Manajemen Akun</span>
                      {selectedAkunIds.length > 0 && <button onClick={hapusAkunSekaligus} className="text-xs bg-rose-600 text-white px-2 py-1 rounded">Hapus Terpilih</button>}
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {daftarAkun.map(akun => (
                        <div key={akun.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            {akun.role !== "admin" && <input type="checkbox" checked={selectedAkunIds.includes(akun.id)} onChange={() => togglePilihAkun(akun.id)} />}
                            <div>
                              <div className="font-bold text-sm">{akun.nama} <span className="text-[10px] bg-slate-200 px-1 rounded">{akun.role}</span> <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">{akun.status}</span></div>
                              <div className="text-slate-500">{akun.email}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {akun.status === "pending" && <button onClick={() => ubahStatusAkun(akun.id, "approved")} className="p-1.5 bg-emerald-100 text-emerald-700 rounded"><UserCheck className="w-4 h-4"/></button>}
                            <button onClick={() => bukaModalEditAkun(akun)} className="p-1.5 bg-blue-100 text-blue-700 rounded"><Edit3 className="w-4 h-4"/></button>
                            {akun.role !== "admin" && <button onClick={() => hapusAkun(akun.id)} className="p-1.5 bg-rose-100 text-rose-700 rounded"><Trash2 className="w-4 h-4"/></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-black text-lg">Manajemen Kelas</h2>
                      <button onClick={() => setModalKategori(true)} className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Tambah</button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {daftarJenjang.map(j => (
                        <div key={j.id} className="p-3 border rounded-xl">
                          <h3 className="font-bold text-sm mb-2">{j.nama}</h3>
                          <div className="flex flex-wrap gap-2">
                            {j.subJenjang.map(sj => <span key={sj.id} className="bg-slate-100 text-xs px-2 py-1 rounded border">{sj.nama}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {modalAdminAkun && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                      <h3 className="font-black text-lg mb-4">Edit Akun</h3>
                      <form onSubmit={simpanAkunAdmin} className="space-y-3 text-xs">
                        <input type="text" required value={namaFormAdmin} onChange={e=>setNamaFormAdmin(e.target.value)} placeholder="Nama" className="w-full p-2 border rounded" />
                        <input type="email" required value={emailFormAdmin} onChange={e=>setEmailFormAdmin(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
                        <select value={roleFormAdmin} onChange={e=>setRoleFormAdmin(e.target.value as any)} className="w-full p-2 border rounded font-bold">
                          <option value="siswa">Siswa</option><option value="guru">Guru</option><option value="admin">Admin</option>
                        </select>
                        <select value={statusFormAdmin} onChange={e=>setStatusFormAdmin(e.target.value as any)} className="w-full p-2 border rounded font-bold">
                          <option value="approved">Aktif</option><option value="pending">Pending</option><option value="rejected">Suspend</option>
                        </select>
                        {roleFormAdmin === "guru" && (
                          <div className="p-3 bg-indigo-50 border rounded-xl">
                            <label className="font-bold mb-2 block">Hak Akses Kelas:</label>
                            {daftarJenjang.map(j => (
                              <div key={j.id} className="mb-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase">{j.nama}</div>
                                <div className="grid grid-cols-2 gap-1">
                                  {j.subJenjang.map(sj => (
                                    <label key={sj.id} className="flex gap-1 items-center"><input type="checkbox" checked={aksesMengajarForm.includes(sj.id)} onChange={() => setAksesMengajarForm(p => p.includes(sj.id) ? p.filter(x => x!==sj.id) : [...p, sj.id])}/> {sj.nama}</label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded">Simpan</button>
                          <button type="button" onClick={()=>setModalAdminAkun(false)} className="px-4 py-2 bg-slate-200 rounded font-bold">Batal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {modalImportAkun && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full">
                      <h3 className="font-black mb-2">Import JSON</h3>
                      <textarea rows={6} value={teksImportJson} onChange={e=>setTeksImportJson(e.target.value)} placeholder='[{"nama":"Budi", "email":"budi@a.com"}]' className="w-full p-2 text-xs border rounded font-mono bg-slate-50"></textarea>
                      <div className="flex gap-2 mt-3">
                        <button onClick={handleImportJson} className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold">Import</button>
                        <button onClick={()=>setModalImportAkun(false)} className="px-4 py-2 bg-slate-200 rounded font-bold">Batal</button>
                      </div>
                    </div>
                  </div>
                )}

                {modalKategori && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-xs w-full">
                      <h3 className="font-black mb-3">Tambah Kelas Baru</h3>
                      <form onSubmit={tambahKategoriBaru} className="space-y-3">
                        <select value={targetJenjangKategori} onChange={e=>setTargetJenjangKategori(e.target.value)} className="w-full p-2 border rounded text-sm">
                          {daftarJenjang.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                        </select>
                        <input type="text" required value={namaKategoriBaru} onChange={e=>setNamaKategoriBaru(e.target.value)} placeholder="Nama Kelas..." className="w-full p-2 border rounded text-sm" />
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-2 rounded">Simpan</button>
                          <button type="button" onClick={()=>setModalKategori(false)} className="px-4 py-2 bg-slate-200 font-bold rounded">Batal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : userLogin.role === "guru" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-indigo-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
                  <div><h1 className="text-2xl font-black">Studio Pengajar</h1><p className="text-sm">Akses {opsiKelasGuru.length} kelas.</p></div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold">Keluar</button>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-2xl">
                  {notifGuru && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl mb-4">Materi terbit!</div>}
                  <form onSubmit={handleGuruBuatMateri} className="space-y-3 text-xs">
                    <select required value={subJenjangPilih} onChange={e=>setSubJenjangPilih(e.target.value)} className="w-full p-3 border border-indigo-200 bg-indigo-50 rounded-xl font-bold text-indigo-900">
                      <option value="" disabled>-- Pilih Kelas --</option>
                      {opsiKelasGuru.map(sj => <option key={sj.id} value={sj.id}>{sj.namaInduk} - {sj.nama}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" required value={judulMateri} onChange={e=>setJudulMateri(e.target.value)} placeholder="Judul" className="p-3 border rounded-xl" />
                      <select value={levelMateri} onChange={(e) => setLevelMateri(e.target.value as any)} className="p-3 border rounded-xl font-bold"><option value="Pemula">Pemula</option><option value="Menengah">Menengah</option><option value="Mahir">Mahir</option></select>
                    </div>
                    <input type="url" required value={videoMateri} onChange={e=>setVideoMateri(e.target.value)} placeholder="Link YouTube" className="w-full p-3 border rounded-xl" />
                    <textarea rows={2} required value={rangkumanMateri} onChange={e=>setRangkumanMateri(e.target.value)} placeholder="Rangkuman" className="w-full p-3 border rounded-xl" />
                    <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
                      <div className="font-bold text-slate-700">Kuis:</div>
                      <input type="text" required value={pertanyaanKuis} onChange={e=>setPertanyaanKuis(e.target.value)} placeholder="Pertanyaan..." className="w-full p-2 border rounded" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" required value={opsiA} onChange={e=>setOpsiA(e.target.value)} placeholder="A" className="p-2 border rounded" />
                        <input type="text" required value={opsiB} onChange={e=>setOpsiB(e.target.value)} placeholder="B" className="p-2 border rounded" />
                        <input type="text" required value={opsiC} onChange={e=>setOpsiC(e.target.value)} placeholder="C" className="p-2 border rounded" />
                        <input type="text" required value={opsiD} onChange={e=>setOpsiD(e.target.value)} placeholder="D" className="p-2 border rounded" />
                      </div>
                      <select value={kunciKuis} onChange={e=>setKunciKuis(Number(e.target.value))} className="w-full p-2 border rounded font-bold"><option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option></select>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg">Publikasikan Materi</button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-emerald-700 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg">
                  <div><h1 className="text-2xl font-black">Halo, {userLogin.nama}!</h1><p className="text-sm">Total XP: {poinXP}</p></div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold">Keluar</button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ==================== 2. TRYOUT ==================== */}
        {menuAktif === "tryout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-8 border text-center">
                <Timer className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-4">Simulasi Tryout</h2>
                <button onClick={() => { setJawabanUserTryout({}); setSisaWaktu(180); setUjianSelesai(false); setSedangUjian(true); }} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Mulai Sekarang</button>
              </div>
            )}
            {sedangUjian && (
              <div className="space-y-4">
                <div className="text-right text-rose-600 font-bold font-mono text-xl">{Math.floor(sisaWaktu/60)}:{(sisaWaktu%60).toString().padStart(2,'0')}</div>
                {BANK_SOAL_TRYOUT.map((soal, i) => (
                  <div key={soal.id} className="bg-white p-6 rounded-2xl border">
                    <p className="font-bold mb-3">{soal.pertanyaan}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {soal.opsi.map((ops, idx) => (
                        <button key={idx} onClick={() => setJawabanUserTryout(p => ({...p, [i]: idx}))} className={`p-3 rounded-xl border text-sm font-semibold text-left ${jawabanUserTryout[i] === idx ? "bg-indigo-50 border-indigo-500" : ""}`}>{ops}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={selesaikanTryout} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow">Kumpulkan</button>
              </div>
            )}
            {ujianSelesai && (
              <div className="bg-white p-8 rounded-3xl border text-center">
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-black">Skor: {skorTryout}</h2>
                <button onClick={() => setUjianSelesai(false)} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Kembali</button>
              </div>
            )}
          </motion.div>
        )}

        {/* ==================== 3. FORUM ==================== */}
        {menuAktif === "forum" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 border rounded-3xl">
              <h2 className="font-black text-lg mb-3">Tanya PR</h2>
              <form onSubmit={e => { e.preventDefault(); if(tanyaBaru.trim()) { setDaftarDiskusi([{id: "pr-"+Date.now(), penanya: userLogin?.nama || "Siswa", jenjang: "Umum", mapel: mapelBaru, pertanyaan: tanyaBaru, waktu: "Baru saja", jawaban: []}, ...daftarDiskusi]); setTanyaBaru(""); tambahXP(20); } }}>
                <input type="text" value={mapelBaru} onChange={e=>setMapelBaru(e.target.value)} placeholder="Mapel" className="w-full p-3 border rounded-xl text-sm mb-2" />
                <textarea rows={2} required value={tanyaBaru} onChange={e=>setTanyaBaru(e.target.value)} placeholder="Tanya..." className="w-full p-3 border rounded-xl text-sm mb-2" />
                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Kirim</button>
              </form>
            </div>
            {daftarDiskusi.map(d => (
              <div key={d.id} className="bg-white p-5 border rounded-2xl">
                <div className="font-bold text-sm mb-1">{d.mapel} • {d.penanya}</div>
                <p className="text-sm mb-3">{d.pertanyaan}</p>
                <div className="space-y-2 mb-3 pl-3 border-l-2 border-emerald-200">
                  {d.jawaban.map((j, i) => <div key={i} className="text-xs bg-emerald-50 p-2 rounded"><b>{j.penjawab}:</b> {j.isi}</div>)}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={balasanInput[d.id] || ""} onChange={e => setBalasanInput({...balasanInput, [d.id]: e.target.value})} placeholder="Jawab..." className="flex-1 p-2 border rounded-lg text-xs" />
                  <button onClick={() => { if(balasanInput[d.id]) { setDaftarDiskusi(daftarDiskusi.map(x => x.id === d.id ? {...x, jawaban: [...x.jawaban, {penjawab: userLogin?.nama || "User", isi: balasanInput[d.id]}]} : x)); setBalasanInput({...balasanInput, [d.id]: ""}); tambahXP(30); } }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold">Kirim</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ==================== 4. TRANSPARANSI ==================== */}
        {menuAktif === "transparansi" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-slate-900 text-white p-8 rounded-3xl text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-4"/>
            <h2 className="text-2xl font-black mb-2">Transparansi Dana</h2>
            <p className="text-slate-300 text-sm mb-6">Murni untuk server & operasional gratis.</p>
            <div className="bg-white/10 p-4 rounded-xl text-left">
              <div className="flex justify-between text-xs font-bold text-emerald-300 mb-2"><span>Terkumpul: Rp 850.000</span><span>Target: Rp 1.500.000</span></div>
              <div className="w-full h-3 bg-slate-800 rounded-full"><div className="w-[56%] h-full bg-emerald-400 rounded-full"></div></div>
            </div>
          </motion.div>
        )}

        {/* ==================== 5. BERANDA KELAS ==================== */}
        {menuAktif === "beranda" && (
          <React.Fragment>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-10 pt-4">
                  <h1 className="text-4xl sm:text-5xl font-black mb-4">Satu Platform,<br/><span className="text-emerald-600">Gratis Selamanya.</span></h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarJenjang.map(j => (
                    <motion.div key={j.id} whileHover={{ y: -4 }} onClick={() => { setJenjangAktif(j); setSubJenjangAktif("semua"); }} className="cursor-pointer bg-white p-6 rounded-3xl border shadow-sm">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${j.gradien} flex items-center justify-center mb-4`}>{renderIkon(j.ikonNama)}</div>
                      <h3 className="font-black text-xl mb-2">{j.nama}</h3>
                      <p className="text-sm text-slate-500 mb-4">{j.deskripsi}</p>
                      <div className="text-xs font-bold text-emerald-600">Buka Kelas →</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setJenjangAktif(null)} className="mb-6 bg-white px-4 py-2 border rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Kembali</button>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <button onClick={() => setSubJenjangAktif("semua")} className={`px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap ${subJenjangAktif === "semua" ? "bg-slate-900 text-white" : "bg-white"}`}>Semua</button>
                  {jenjangAktif.subJenjang.map(sj => (
                    <button key={sj.id} onClick={() => setSubJenjangAktif(sj.id)} className={`px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap ${subJenjangAktif === sj.id ? "bg-slate-900 text-white" : "bg-white"}`}>{sj.nama}</button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {jenjangAktif.kelas.filter(k => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif).map(k => (
                    <div key={k.id} onClick={() => setKelasAktif(k)} className="bg-white p-6 border rounded-3xl cursor-pointer hover:shadow-lg transition">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{jenjangAktif.subJenjang.find(s=>s.id === k.subJenjangId)?.nama || "Umum"}</span>
                        {materiSelesai.includes(k.id) && <span className="text-xs font-bold text-emerald-600">✔ Selesai</span>}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{k.judul}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{k.rangkuman}</p>
                      <div className="text-sm font-bold text-indigo-600 flex items-center gap-1"><PlayCircle className="w-4 h-4"/> Mulai Belajar</div>
                    </div>
                  ))}
                  {jenjangAktif.kelas.filter(k => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif).length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-10 border-2 border-dashed rounded-3xl text-slate-400">Belum ada materi.</div>
                  )}
                </div>
              </motion.div>
            )}

            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setKelasAktif(null)} className="bg-white px-4 py-2 border rounded-xl text-sm font-bold flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Kembali</button>
                  <button onClick={() => toggleSelesaiMateri(kelasAktif.id)} className={`px-4 py-2 rounded-xl text-sm font-bold ${materiSelesai.includes(kelasAktif.id) ? "bg-emerald-600 text-white" : "bg-white border"}`}>
                    {materiSelesai.includes(kelasAktif.id) ? "✔ Selesai" : "Tandai Selesai"}
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border">
                      <div className="aspect-video bg-slate-900 rounded-xl mb-4 overflow-hidden"><iframe src={kelasAktif.videoUrl} className="w-full h-full" allowFullScreen></iframe></div>
                      <h1 className="text-2xl font-black mb-2">{kelasAktif.judul}</h1>
                      <p className="text-sm text-slate-700">{kelasAktif.rangkuman}</p>
                      {kelasAktif.rumusMatematika && <div className="mt-4 p-4 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl whitespace-pre-wrap">{kelasAktif.rumusMatematika}</div>}
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100">
                      <h3 className="font-bold mb-4">{kelasAktif.kuis.tanya}</h3>
                      <div className="space-y-2">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button key={idx} onClick={() => { setJawabanKuis(idx); setStatusKuis(idx === kelasAktif.kuis.jawabanBenar ? "benar" : "salah"); if(idx === kelasAktif.kuis.jawabanBenar && statusKuis !== "benar") tambahXP(50); }} className={`w-full text-left p-3 border rounded-xl text-sm font-semibold ${jawabanKuis === idx ? (statusKuis === "benar" ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-rose-50 border-rose-500 text-rose-900") : "hover:bg-slate-50"}`}>{opsi}</button>
                        ))}
                      </div>
                      {statusKuis === "benar" && <div className="mt-3 text-xs font-bold text-emerald-600">🎉 Benar! (+50 XP)</div>}
                      {statusKuis === "salah" && <div className="mt-3 text-xs font-bold text-rose-600">❌ Coba lagi!</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        )}
      </main>
    </div>
  );
}