"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, GraduationCap, Sparkles, School, Compass, PlayCircle, ArrowLeft,
  Trophy, Search, Flame, CheckCircle2, Timer, MessageSquare, ShieldCheck,
  LayoutDashboard, CheckSquare, Square, FileEdit, Award, ShieldAlert,
  UserCheck, UserX, Users, Activity, PlusCircle, Clock, LogOut, KeyRound,
  UserPlus, Trash2, Edit3, UserX2, UserCheck2, Upload, Layers, Lock, Play,
  BookMarked, FileSpreadsheet, Send, HelpCircle, XCircle, Bold, Italic, 
  Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon
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

// ==========================================
// 2. DATA AWAL (DUMMY DATA)
// ==========================================
const TEMPLATE_JSON_CONTOH = JSON.stringify([
  { nama: "Dewi Lestari", email: "dewi@hibahilmu.id", password: "123", role: "guru", infoTambahan: "Guru Biologi" },
  { nama: "Ahmad Fauzi", email: "ahmad@hibahilmu.id", password: "123", role: "siswa", infoTambahan: "Kelas 12 IPA" }
], null, 2);

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
        rangkuman: "<p>Mari belajar menghitung buah-buahan! Angka 1 seperti tiang listrik, angka 2 seperti bebek berenang.</p>",
        rumusMatematika: "2 🍎 + 1 🍎 = 3 🍎 (Tiga Apel Segar)",
        kuis: { tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi sekarang?", opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"], jawabanBenar: 1, pembahasan: "Hebat sekali! 2 + 1 = 3 apel." },
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
        rangkuman: "<p><b>Perkalian</b> adalah penjumlahan yang berulang! Digunakan juga untuk menghitung luas persegi panjang dan segitiga.</p>",
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
        judul: "Fisika Mekanika, Hukum Newton & Energi Kinetik",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman: "<p>Gaya berbanding lurus dengan massa dan percepatan benda. <i>Energi kinetik</i> bergantung pada kuadrat kecepatan.</p>",
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
    kelas: [],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  { id: "to-1", jenjang: "SD", pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 × 3) - 10 adalah...", rumus: "KABATAKU", opsi: ["51", "101", "61", "45"], jawabanBenar: 0, pembahasan: "12×3=36. 25+36-10=51." },
  { id: "to-2", jenjang: "SMP", pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?", rumus: "Substitusi x=4", opsi: ["5", "7", "12", "17"], jawabanBenar: 1, pembahasan: "3(4)-5=7." },
];

const AKUN_DEFAULT: AkunPengguna[] = [
  { id: "adm-1", nama: "Admin Panda Kode", email: "admin@hibahilmu.id", password: "123", role: "admin", status: "approved", infoTambahan: "Super Admin", waktuDaftar: "Permanen", aksesMengajar: [] },
  { id: "gru-1", nama: "Budi Santoso, M.Pd", email: "guru@hibahilmu.id", password: "123", role: "guru", status: "approved", infoTambahan: "Guru Fisika SMA", waktuDaftar: "Kemarin", aksesMengajar: ["sma-11-ipa"] },
  { id: "sis-1", nama: "Aisyah Putri", email: "siswa@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswi SMA", waktuDaftar: "Kemarin", aksesMengajar: [] },
  { id: "sis-2", nama: "Reza Rahadian", email: "reza@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswa SMA", waktuDaftar: "Hari ini", aksesMengajar: [] },
];

// ==========================================
// KOMPONEN RICH TEXT EDITOR
// ==========================================
const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state if cleared externally
  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  const formatText = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
  };

  const addLink = () => {
    const url = prompt("Masukkan URL Link:");
    if (url) formatText("createLink", url);
  };

  const addImage = () => {
    const url = prompt("Masukkan URL Gambar (https://...):");
    if (url) formatText("insertImage", url);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <div className="bg-slate-100 border-b border-slate-200 p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => formatText('bold')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Tebal"><Bold size={16}/></button>
        <button type="button" onClick={() => formatText('italic')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Miring"><Italic size={16}/></button>
        <button type="button" onClick={() => formatText('underline')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Garis Bawah"><Underline size={16}/></button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={() => formatText('insertUnorderedList')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Daftar Titik"><List size={16}/></button>
        <button type="button" onClick={() => formatText('insertOrderedList')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Daftar Angka"><ListOrdered size={16}/></button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={addLink} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Sisipkan Link"><LinkIcon size={16}/></button>
        <button type="button" onClick={addImage} className="p-2 hover:bg-white rounded-lg text-slate-700 transition" title="Sisipkan Gambar"><ImageIcon size={16}/></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="p-4 min-h-[150px] max-h-[300px] overflow-y-auto text-sm outline-none prose prose-sm max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
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
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>([]);
  const [daftarKelompok, setDaftarKelompok] = useState<KelompokBelajar[]>([]);

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
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([{ id: "pr-1", penanya: "Rizky (SMP)", jenjang: "SMP", mapel: "Matematika", pertanyaan: "Bagaimana cara cepat membedakan rumus Luas dan Keliling Lingkaran?", waktu: "1 jam lalu", jawaban: [{ penjawab: "Panda Kode", isi: "Luas selalu pangkat dua (π × r²), keliling tidak ada pangkat (2 × π × r)." }] }]);
  const [tanyaBaru, setTanyaBaru] = useState<string>("");
  const [mapelBaru, setMapelBaru] = useState<string>("Matematika");
  const [balasanInput, setBalasanInput] = useState<{ [key: string]: string }>({});

  // State Auth
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

  // State Guru Menu & Materi
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

  // State Guru Kelola Kelas
  const [namaKelompokBaru, setNamaKelompokBaru] = useState("");
  const [kelompokAktifGuru, setKelompokAktifGuru] = useState<string | null>(null); 
  const [pilihSiswaMasuk, setPilihSiswaMasuk] = useState("");

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
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) interval = setInterval(() => setSisaWaktu(p => p - 1), 1000);
    else if (sisaWaktu === 0 && sedangUjian) selesaikanTryout();
    return () => clearInterval(interval);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  useEffect(() => {
    if (kelasAktif) {
      setCatatanSiswa(localStorage.getItem(`catatan_${kelasAktif.id}`) || "");
      setJawabanKuis(null); setStatusKuis(null);
    }
  }, [kelasAktif]);

  // Logging & XP
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
        catatLog(userLogin?.nama || "Siswa", userLogin?.role || "siswa", `Menyelesaikan materi`, "belajar");
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  // Autentikasi
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun disuspend.");
    setUserLogin(akun); localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Login ke Dashboard`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setPesanError("");
    const akunDitemukan = (daftarAkun || []).find(a => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin);
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending") return setPesanError("⏳ Akun pending.");
    if (akunDitemukan.status === "rejected") return setPesanError("❌ Akun disuspend.");
    setUserLogin(akunDitemukan); localStorage.setItem("hibah_user_aktif", JSON.stringify(akunDitemukan));
    catatLog(akunDitemukan.nama, akunDitemukan.role, `Melakukan Login`, "akun");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); setPesanError("");
    if ((daftarAkun || []).some(a => a.email.toLowerCase() === emailReg.toLowerCase())) return setPesanError("Email sudah terdaftar.");
    const akunBaru: AkunPengguna = { id: "usr-" + Date.now(), nama: namaReg, email: emailReg, password: passwordReg, role: roleReg, status: "pending", infoTambahan: infoReg || "Baru", waktuDaftar: "Baru saja", aksesMengajar: [] };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru); localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, `Mendaftar akun (Pending)`, "akun");
    setPesanSukses("✅ Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg(""); setEmailReg(""); setPasswordReg(""); setInfoReg(""); setModeAuth("login");
  };

  // Fungsi Admin
  const ubahStatusAkun = (id: string, status: "approved" | "rejected" | "pending") => {
    const update = (daftarAkun || []).map(a => a.id === id ? { ...a, status } : a);
    setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Ubah status akun menjadi ${status}`, "akun");
  };

  const hapusAkun = (id: string) => {
    const update = (daftarAkun || []).filter(a => a.id !== id);
    setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Hapus akun`, "akun");
  };

  const hapusAkunSekaligus = () => {
    if (!confirm(`Hapus ${selectedAkunIds.length} akun secara permanen?`)) return;
    const update = (daftarAkun || []).filter((a) => !selectedAkunIds.includes(a.id) || a.role === "admin");
    setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Hapus massal ${selectedAkunIds.length} akun`, "akun");
    setSelectedAkunIds([]);
  };

  const togglePilihAkun = (id: string) => setSelectedAkunIds((prev) => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  const bukaModalEditAkun = (akun: AkunPengguna) => {
    setIdEditAkun(akun.id); setNamaFormAdmin(akun.nama); setEmailFormAdmin(akun.email); setPassFormAdmin("");
    setRoleFormAdmin(akun.role); setStatusFormAdmin(akun.status); setInfoFormAdmin(akun.infoTambahan);
    setAksesMengajarForm(akun.aksesMengajar || []); setModalAdminAkun(true);
  };

  const simpanAkunAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (idEditAkun) {
      const update = (daftarAkun || []).map(a => a.id === idEditAkun ? { ...a, nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || a.password, role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin, aksesMengajar: roleFormAdmin === "guru" ? aksesMengajarForm : [] } : a);
      setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    } else {
      const akunBaru: AkunPengguna = { id: "adm-usr-" + Date.now(), nama: namaFormAdmin, email: emailFormAdmin, password: passFormAdmin || "123", role: roleFormAdmin, status: statusFormAdmin, infoTambahan: infoFormAdmin || "Dibuat Admin", waktuDaftar: "Oleh Admin", aksesMengajar: aksesMengajarForm };
      setDaftarAkun([akunBaru, ...(daftarAkun || [])]); localStorage.setItem("hibah_daftar_akun", JSON.stringify([akunBaru, ...(daftarAkun || [])]));
    }
    setModalAdminAkun(false);
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(teksImportJson);
      const akunBaruMasuk: AkunPengguna[] = parsedData.map((item: any, idx: number) => ({ id: "import-" + Date.now() + "-" + idx, nama: item.nama || "User", email: item.email || `u${idx}@h.id`, password: item.password || "123", role: item.role === "guru" || item.role === "admin" ? item.role : "siswa", status: "approved", infoTambahan: item.infoTambahan || "Diimpor massal", waktuDaftar: "Import", aksesMengajar: [] }));
      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan); localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      setNotifImport(`✅ Sukses import ${akunBaruMasuk.length} akun`);
      setTimeout(() => setModalImportAkun(false), 2000);
    } catch { alert("Format JSON tidak valid!"); }
  };

  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault(); if (!namaKategoriBaru.trim()) return;
    const update = daftarJenjang.map(j => j.id === targetJenjangKategori ? { ...j, subJenjang: [...j.subJenjang, { id: `sub-${Date.now()}`, nama: namaKategoriBaru }] } : j);
    setDaftarJenjang(update); localStorage.setItem("hibah_struktur", JSON.stringify(update));
    setModalKategori(false); setNamaKategoriBaru("");
  };

  // Fungsi Guru
  const opsiKelasGuru = (daftarJenjang || []).flatMap(j => j.subJenjang.filter(sj => userLogin?.aksesMengajar?.includes(sj.id)).map(sj => ({ ...sj, namaInduk: j.nama })));

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault(); if (!userLogin || !subJenjangPilih) return;
    let finalEmbed = videoMateri.includes("watch?v=") ? videoMateri.replace("watch?v=", "embed/") : videoMateri;
    const modulBaru: KelasItem = { id: "mdl-" + Date.now(), subJenjangId: subJenjangPilih, judul: `${judulMateri} (Oleh: ${userLogin.nama})`, level: levelMateri, durasi: "15 Menit", videoUrl: finalEmbed, rangkuman: rangkumanMateri, rumusMatematika: rumusMateri || undefined, kuis: { tanya: pertanyaanKuis, opsi: [opsiA, opsiB, opsiC, opsiD], jawabanBenar: kunciKuis, pembahasan: `Oleh Guru ${userLogin.nama}.` } };
    const update = daftarJenjang.map(j => j.subJenjang.some(sj => sj.id === subJenjangPilih) ? { ...j, kelas: [modulBaru, ...j.kelas] } : j);
    setDaftarJenjang(update); localStorage.setItem("hibah_struktur", JSON.stringify(update));
    setNotifGuru(true); setJudulMateri(""); setVideoMateri(""); setRangkumanMateri(""); setRumusMateri(""); setPertanyaanKuis(""); setOpsiA(""); setOpsiB(""); setOpsiC(""); setOpsiD("");
    setTimeout(() => setNotifGuru(false), 3000);
  };

  const handleBuatKelompok = (e: React.FormEvent) => {
    e.preventDefault(); if(!userLogin || !namaKelompokBaru.trim()) return;
    const kelompokBaru: KelompokBelajar = { id: "kelompok-" + Date.now(), namaKelas: namaKelompokBaru, guruId: userLogin.id, siswaIds: [] };
    const update = [...daftarKelompok, kelompokBaru];
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    setNamaKelompokBaru("");
  };

  const handleTambahSiswaKeKelompok = (e: React.FormEvent) => {
    e.preventDefault(); if(!pilihSiswaMasuk || !kelompokAktifGuru) return;
    const update = daftarKelompok.map(k => k.id === kelompokAktifGuru && !k.siswaIds.includes(pilihSiswaMasuk) ? { ...k, siswaIds: [...k.siswaIds, pilihSiswaMasuk] } : k);
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    setPilihSiswaMasuk("");
  };

  const handleHapusSiswaDariKelompok = (kelompokId: string, siswaId: string) => {
    const update = daftarKelompok.map(k => k.id === kelompokId ? { ...k, siswaIds: k.siswaIds.filter(id => id !== siswaId) } : k);
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  const selesaikanTryout = () => {
    let benar = 0; BANK_SOAL_TRYOUT.forEach((soal, idx) => { if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++; });
    setSkorTryout(Math.round((benar / BANK_SOAL_TRYOUT.length) * 100));
    setUjianSelesai(true); setSedangUjian(false);
    if (benar > 0) tambahXP(benar * 40);
  };

  const renderIkon = (nama: string) => {
    if (nama === "sparkles") return <Sparkles className="w-6 h-6 text-white" />;
    if (nama === "book") return <BookOpen className="w-6 h-6 text-white" />;
    if (nama === "compass") return <Compass className="w-6 h-6 text-white" />;
    if (nama === "school") return <School className="w-6 h-6 text-white" />;
    return <GraduationCap className="w-6 h-6 text-white" />;
  };

  const safeAkunList = daftarAkun || [];
  const safeLogList = logAktivitas || [];
  const guruKelompoks = daftarKelompok.filter(k => k.guruId === userLogin?.id);
  const daftarSiswaApproved = safeAkunList.filter(a => a.role === "siswa" && a.status === "approved");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans relative overflow-x-hidden">
      {/* Background Aurora */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-emerald-300/25 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md">🐼</div>
            <div>
              <div className="font-extrabold text-xl text-slate-900 leading-none">HibahIlmu</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">LMS Open Source</div>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button onClick={() => { setMenuAktif("beranda"); setJenjangAktif(null); setKelasAktif(null); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${menuAktif === "beranda" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Ruang Kelas</button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> <span>{poinXP} XP</span>
            </div>
            <button onClick={() => { setMenuAktif("dashboard"); setJenjangAktif(null); setKelasAktif(null); }} className={`relative px-5 py-2.5 rounded-full text-xs font-extrabold shadow-sm transition flex items-center gap-2 ${userLogin ? (userLogin.role === "admin" ? "bg-slate-900 text-amber-300" : userLogin.role === "guru" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white") : "bg-emerald-600 text-white"}`}>
              <LayoutDashboard className="w-4 h-4" /> <span>{userLogin ? `Panel ${userLogin.role}` : "Daftar / Masuk"}</span>
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
                <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white">
                  <div className="flex gap-2 mb-8 bg-slate-100/80 p-1.5 rounded-2xl">
                    <button onClick={() => { setModeAuth("login"); setPesanError(""); }} className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${modeAuth === "login" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>Masuk Akun</button>
                    <button onClick={() => { setModeAuth("register"); setPesanError(""); }} className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition ${modeAuth === "register" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>Daftar Baru</button>
                  </div>
                  {pesanError && <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold">{pesanError}</div>}
                  {pesanSukses && <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold">{pesanSukses}</div>}
                  {modeAuth === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div><h2 className="text-3xl font-black text-slate-900">Selamat Datang!</h2></div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Email</label>
                        <input type="email" required value={emailLogin} onChange={e => setEmailLogin(e.target.value)} placeholder="Contoh: admin@hibahilmu.id" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Password</label>
                        <input type="password" required value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} placeholder="••••••" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg transition">Masuk Sekarang</button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div><h2 className="text-3xl font-black text-slate-900">Pendaftaran Akun</h2></div>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setRoleReg("siswa")} className={`p-4 border-2 rounded-2xl text-left transition ${roleReg === "siswa" ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "border-slate-200"}`}><div className="font-extrabold text-sm">🎓 Siswa</div></button>
                        <button type="button" onClick={() => setRoleReg("guru")} className={`p-4 border-2 rounded-2xl text-left transition ${roleReg === "guru" ? "bg-indigo-50 border-indigo-500 text-indigo-900" : "border-slate-200"}`}><div className="font-extrabold text-sm">👨‍🏫 Guru Relawan</div></button>
                      </div>
                      <input type="text" required value={namaReg} onChange={e => setNamaReg(e.target.value)} placeholder="Nama Lengkap..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <input type="email" required value={emailReg} onChange={e => setEmailReg(e.target.value)} placeholder="Email Aktif..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <input type="password" required value={passwordReg} onChange={e => setPasswordReg(e.target.value)} placeholder="Buat Password..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                      <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg transition">Daftar & Ajukan Akses</button>
                    </form>
                  )}
                </div>
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase w-max mb-4">⚡ Demo 1-Klik</span>
                  <div className="space-y-3">
                    {safeAkunList.filter(a => a.status === "approved").slice(0, 4).map(a => (
                      <button key={a.id} onClick={() => loginCepat(a)} className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between group border border-white/10">
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">{a.nama} <span className="text-[9px] uppercase bg-indigo-500 px-2 py-0.5 rounded ml-2">{a.role}</span></div>
                          <div className="text-[11px] text-slate-400 mt-1">{a.email}</div>
                        </div>
                        <span className="text-xs font-bold text-amber-300 group-hover:translate-x-1 transition">Masuk →</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "admin" ? (
              /* --- ADMIN DASHBOARD --- */
              <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-slate-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg mb-8">
                  <div><h1 className="text-3xl font-black">Panel Super Admin</h1></div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-rose-600 px-5 py-2 rounded-xl text-sm font-bold">Keluar</button>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-black mb-6 flex justify-between">
                    <span>Manajemen Pengguna</span>
                    <div className="flex gap-2">
                       <button onClick={() => setModalImportAkun(true)} className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1"><Upload className="w-4 h-4"/> Import JSON</button>
                       <button onClick={() => { setIdEditAkun(null); setModalAdminAkun(true); }} className="bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1"><UserPlus className="w-4 h-4"/> Tambah</button>
                    </div>
                  </h2>
                  <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
                    {safeAkunList.map(akun => (
                      <div key={akun.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          {akun.role !== "admin" && <input type="checkbox" checked={selectedAkunIds.includes(akun.id)} onChange={() => togglePilihAkun(akun.id)} className="w-4 h-4 accent-indigo-600"/>}
                          <div>
                            <div className="font-bold text-sm">{akun.nama} <span className="uppercase text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded ml-2">{akun.role}</span><span className="uppercase text-[10px] bg-emerald-100 text-emerald-700 px-2 rounded ml-1">{akun.status}</span></div>
                            <div className="text-xs text-slate-500 mt-1">{akun.email}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => bukaModalEditAkun(akun)} className="p-2 bg-blue-100 text-blue-700 rounded-xl"><Edit3 className="w-4 h-4"/></button>
                           {akun.role !== "admin" && <button onClick={() => hapusAkun(akun.id)} className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Trash2 className="w-4 h-4"/></button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : userLogin.role === "guru" ? (
              /* --- GURU DASHBOARD --- */
              <motion.div key="guru" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 sm:p-10 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="bg-white/20 text-indigo-50 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">👨‍🏫 Studio Guru</span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Selamat Mengajar, {userLogin.nama}!</h1>
                    <p className="text-indigo-200 text-sm">Otorisasi mengajar: <b>{opsiKelasGuru.length} kelas/jurusan.</b></p>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="relative z-10 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-3 rounded-2xl transition"><LogOut className="w-4 h-4 inline mr-2"/> Keluar</button>
                </div>

                {/* TAB GURU: MATERI vs KELAS SISWA */}
                <div className="flex gap-4 border-b border-slate-200 pb-2">
                  <button onClick={() => setGuruTabAktif("materi")} className={`px-6 py-3 rounded-t-2xl font-black text-sm transition-all ${guruTabAktif === "materi" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-slate-50"}`}><BookOpen className="w-4 h-4 inline mr-2"/> Buat Materi Baru</button>
                  <button onClick={() => setGuruTabAktif("kelas")} className={`px-6 py-3 rounded-t-2xl font-black text-sm transition-all ${guruTabAktif === "kelas" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-slate-50"}`}><Users className="w-4 h-4 inline mr-2"/> Kelola Ruang Kelas (Siswa)</button>
                </div>

                {guruTabAktif === "materi" && (
                  <div className="bg-white p-8 rounded-[2rem] rounded-tl-none border border-slate-200 shadow-sm max-w-4xl">
                    <h2 className="text-2xl font-black mb-6 text-slate-900">Form Publikasi Materi & Kuis</h2>
                    {opsiKelasGuru.length === 0 ? (
                      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-rose-400"/>
                        <p className="text-rose-700 font-bold">Admin belum memberikan akses kelas untuk Anda.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleGuruBuatMateri} className="space-y-6">
                        <AnimatePresence>{notifGuru && <motion.div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-sm text-center border border-emerald-200">🎉 Materi berhasil diterbitkan!</motion.div>}</AnimatePresence>
                        
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                          <label className="font-black mb-2 block text-indigo-900 text-sm">📍 Target Kelas:</label>
                          <select required value={subJenjangPilih} onChange={(e) => setSubJenjangPilih(e.target.value)} className="w-full p-4 bg-white border border-indigo-200 rounded-xl font-extrabold text-indigo-900">
                            <option value="" disabled>-- Pilih Kelas --</option>
                            {opsiKelasGuru.map(sj => <option key={sj.id} value={sj.id}>{sj.namaInduk} ➔ {sj.nama}</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div><label className="font-bold mb-1.5 block text-xs text-slate-500">Judul Bab</label><input type="text" required value={judulMateri} onChange={e => setJudulMateri(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50" /></div>
                          <div><label className="font-bold mb-1.5 block text-xs text-slate-500">Tingkat Kesulitan</label><select value={levelMateri} onChange={(e) => setLevelMateri(e.target.value as any)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold"><option value="Pemula">Pemula</option><option value="Menengah">Menengah</option><option value="Mahir">Mahir</option></select></div>
                        </div>

                        <div><label className="font-bold mb-1.5 block text-xs text-slate-500">Link Video YouTube</label><input type="url" required value={videoMateri} onChange={e => setVideoMateri(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50" /></div>

                        {/* RICH TEXT EDITOR (Pengganti Textarea) */}
                        <div>
                          <label className="font-bold mb-1.5 block text-xs text-slate-500 flex justify-between">
                            <span>Rangkuman Materi (Bisa diformat)</span>
                            <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded">NEW! Rich Text</span>
                          </label>
                          <RichTextEditor value={rangkumanMateri} onChange={setRangkumanMateri} />
                        </div>
                        
                        <div className="p-6 border-2 border-slate-100 rounded-[2rem] bg-slate-50/50 space-y-5">
                          <div className="font-black text-base">📝 Kuis Singkat</div>
                          <input type="text" required value={pertanyaanKuis} onChange={e => setPertanyaanKuis(e.target.value)} placeholder="Pertanyaan kuis..." className="w-full p-4 border bg-white rounded-xl" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" required value={opsiA} onChange={e => setOpsiA(e.target.value)} placeholder="Opsi A" className="p-3.5 border bg-white rounded-xl" />
                            <input type="text" required value={opsiB} onChange={e => setOpsiB(e.target.value)} placeholder="Opsi B" className="p-3.5 border bg-white rounded-xl" />
                            <input type="text" required value={opsiC} onChange={e => setOpsiC(e.target.value)} placeholder="Opsi C" className="p-3.5 border bg-white rounded-xl" />
                            <input type="text" required value={opsiD} onChange={e => setOpsiD(e.target.value)} placeholder="Opsi D" className="p-3.5 border bg-white rounded-xl" />
                          </div>
                          <select value={kunciKuis} onChange={e => setKunciKuis(Number(e.target.value))} className="w-full p-4 border border-emerald-200 bg-emerald-50 font-bold rounded-xl"><option value={0}>Opsi A Benar</option><option value={1}>Opsi B Benar</option><option value={2}>Opsi C Benar</option><option value={3}>Opsi D Benar</option></select>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg">Publikasikan Materi</button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB GURU: KELOLA RUANG KELAS & SISWA */}
                {guruTabAktif === "kelas" && (
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-5xl space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black text-slate-900">Manajemen Ruang Kelas</h2>
                    </div>

                    <form onSubmit={handleBuatKelompok} className="flex gap-3 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <input type="text" required value={namaKelompokBaru} onChange={e=>setNamaKelompokBaru(e.target.value)} placeholder="Nama Kelas Baru (Contoh: Fisika 11 IPA 1)" className="flex-1 p-3 rounded-xl border outline-none font-semibold text-sm"/>
                      <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md">Buat Kelas</button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {guruKelompoks.length === 0 ? (
                        <div className="col-span-2 text-center py-10 text-slate-400 italic border-2 border-dashed rounded-3xl">Anda belum membuat Ruang Kelas satupun.</div>
                      ) : (
                        guruKelompoks.map(kel => (
                          <div key={kel.id} className="p-6 border border-slate-200 rounded-3xl shadow-sm bg-white hover:shadow-md transition">
                            <h3 className="font-black text-lg mb-2 text-indigo-900">{kel.namaKelas}</h3>
                            <div className="text-xs font-bold text-slate-500 mb-4 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">Jumlah Siswa: {kel.siswaIds.length} Anak</div>
                            
                            <form onSubmit={e => { e.preventDefault(); setKelompokAktifGuru(kel.id); handleTambahSiswaKeKelompok(e); }} className="flex gap-2 mb-4">
                              <select required value={kelompokAktifGuru === kel.id ? pilihSiswaMasuk : ""} onChange={e => { setKelompokAktifGuru(kel.id); setPilihSiswaMasuk(e.target.value); }} className="flex-1 p-2 text-xs border rounded-lg bg-slate-50 font-semibold">
                                <option value="" disabled>-- Masukkan Siswa --</option>
                                {daftarSiswaApproved.filter(s => !kel.siswaIds.includes(s.id)).map(s => (
                                  <option key={s.id} value={s.id}>{s.nama} ({s.email})</option>
                                ))}
                              </select>
                              <button type="submit" className="bg-emerald-600 text-white p-2 rounded-lg font-bold text-xs"><PlusCircle className="w-4 h-4"/></button>
                            </form>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {kel.siswaIds.map(sId => {
                                const sw = daftarAkun.find(a => a.id === sId);
                                if(!sw) return null;
                                return (
                                  <div key={sId} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-xl text-xs">
                                    <div className="font-bold flex items-center gap-2"><div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex justify-center items-center font-black">{sw.nama.charAt(0)}</div>{sw.nama}</div>
                                    <button onClick={() => handleHapusSiswaDariKelompok(kel.id, sId)} className="text-rose-400 hover:text-rose-600"><UserX className="w-4 h-4"/></button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* --- SISWA DASHBOARD --- */
              <motion.div key="siswa" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 sm:p-10 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="bg-white/20 text-emerald-50 border border-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">🎓 Dashboard Rapor Siswa</span>
                    <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Halo, {userLogin.nama}!</h1>
                  </div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="relative z-10 bg-white/15 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition"><LogOut className="w-4 h-4"/> Keluar</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex items-center gap-5">
                    <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl"><Flame className="w-10 h-10 fill-amber-500" /></div>
                    <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Poin</div><div className="text-4xl font-black text-slate-900">{poinXP}</div></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex items-center gap-5">
                    <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 className="w-10 h-10" /></div>
                    <div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modul Selesai</div><div className="text-4xl font-black text-slate-900">{materiSelesai.length}</div></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ==========================================
            5. BERANDA (MENAMPILKAN RICH TEXT MATERI)
        ========================================== */}
        {menuAktif === "beranda" && (
          <React.Fragment>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-16 pt-6">
                  <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">Satu Platform Sejuta Ilmu, <br /><span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Gratis Selamanya.</span></h1>
                  <div className="max-w-2xl mx-auto relative group">
                    <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition" />
                    <input type="text" value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="Cari jenjang atau mata pelajaran..." className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-lg text-base font-semibold outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {daftarJenjang.filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase())).map((jenjang) => (
                    <motion.div key={jenjang.id} whileHover={{ y: -8 }} onClick={() => { setJenjangAktif(jenjang); setSubJenjangAktif("semua"); }} className="cursor-pointer bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between">
                      <div className={`h-2.5 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`} />
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md flex items-center justify-center`}>{renderIkon(jenjang.ikonNama)}</div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${jenjang.badge}`}>{jenjang.subJenjang.length} Jurusan</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">{jenjang.nama}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{jenjang.deskripsi}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setJenjangAktif(null)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 mb-8 shadow-sm hover:bg-slate-50 transition">
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <div className={`rounded-[2.5rem] p-10 sm:p-14 text-white bg-gradient-to-br ${jenjangAktif.gradien} shadow-2xl mb-10`}>
                  <h1 className="text-4xl sm:text-5xl font-black mt-5 mb-3 leading-tight">{jenjangAktif.nama}</h1>
                </div>

                <div className="mb-8 flex flex-wrap gap-2.5 items-center p-2 bg-white rounded-2xl border shadow-sm">
                  <button onClick={() => setSubJenjangAktif("semua")} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${subJenjangAktif === "semua" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}>Semua Materi</button>
                  {jenjangAktif.subJenjang.map(sj => (
                    <button key={sj.id} onClick={() => setSubJenjangAktif(sj.id)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${subJenjangAktif === sj.id ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}>{sj.nama}</button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jenjangAktif.kelas.filter(item => subJenjangAktif === "semua" || item.subJenjangId === subJenjangAktif).map((item) => {
                      const selesai = materiSelesai.includes(item.id);
                      return (
                        <div key={item.id} onClick={() => setKelasAktif(item)} className="bg-white rounded-[2rem] p-8 border-2 shadow-sm hover:shadow-xl cursor-pointer transition">
                          <div className="flex justify-between items-center mb-5">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">⚡ {item.level}</span>
                            {selesai && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 border px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Selesai</span>}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.judul}</h3>
                          <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: item.rangkuman.replace(/<[^>]+>/g, ' ') }}></p>
                        </div>
                      );
                  })}
                </div>
              </motion.div>
            )}

            {/* HALAMAN BACA MATERI DENGAN RICH TEXT */}
            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setKelasAktif(null)} className="bg-white px-5 py-3 border rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm"><ArrowLeft className="w-4 h-4" /> Kembali</button>
                  <button onClick={() => toggleSelesaiMateri(kelasAktif.id)} className={`px-6 py-3 rounded-2xl text-sm font-black shadow-md transition flex items-center gap-2 border-2 ${materiSelesai.includes(kelasAktif.id) ? "bg-emerald-50 text-emerald-700 border-emerald-500" : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"}`}>
                    {materiSelesai.includes(kelasAktif.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />} Tandai Selesai
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-200 shadow-sm">
                      <div className="aspect-video w-full rounded-2xl bg-slate-900 mb-8 overflow-hidden">
                        <iframe src={kelasAktif.videoUrl} title={kelasAktif.judul} className="w-full h-full" allowFullScreen />
                      </div>
                      <h1 className="text-3xl font-black text-slate-900 mb-6">{kelasAktif.judul}</h1>
                      
                      {/* INI KUNCI RENDER HTML RICH TEXT */}
                      <div className="prose prose-slate max-w-none mb-8" dangerouslySetInnerHTML={{ __html: kelasAktif.rangkuman || "" }}></div>
                      
                      {kelasAktif.rumusMatematika && (
                        <div className="p-6 bg-slate-900 text-emerald-300 font-mono text-sm rounded-2xl shadow-inner border border-slate-800">
                          <div className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Papan Rumus:</div>
                          <div className="whitespace-pre-wrap text-base">{kelasAktif.rumusMatematika}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="xl:col-span-1">
                    <div className="bg-white rounded-[2rem] p-8 border-2 border-indigo-100 shadow-lg sticky top-28">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6"><Trophy className="w-6 h-6"/></div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kuis Pemahaman Modul</h3>
                      <p className="font-black text-lg text-slate-900 mb-6 leading-snug">{kelasAktif.kuis.tanya}</p>
                      
                      <div className="space-y-3 mb-6">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button key={idx} onClick={() => { setJawabanKuis(idx); if (idx === kelasAktif.kuis.jawabanBenar) { if (statusKuis !== "benar") tambahXP(50); setStatusKuis("benar"); } else { setStatusKuis("salah"); } }} className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 flex items-center gap-3 ${jawabanKuis === idx ? statusKuis === "benar" ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md" : "border-rose-500 bg-rose-50 text-rose-900 shadow-md" : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700"}`}>
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${jawabanKuis === idx ? (statusKuis === "benar" ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800") : "bg-slate-100 text-slate-400"}`}>{String.fromCharCode(65 + idx)}</span>
                            {opsi}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {statusKuis === "benar" && <motion.div key="benar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 rounded-2xl text-xs text-emerald-900 font-bold border border-emerald-200 shadow-inner"><div className="flex items-center gap-2 mb-2 text-sm font-black text-emerald-700"><CheckCircle2 className="w-5 h-5"/> Tepat Sekali! (+50 XP)</div><div className="font-medium leading-relaxed opacity-90">{kelasAktif.kuis.pembahasan}</div></motion.div>}
                        {statusKuis === "salah" && <motion.div key="salah" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 rounded-2xl text-xs text-rose-900 font-bold border border-rose-200 shadow-inner flex items-center gap-2">Belum tepat, ayo coba pahami lagi!</motion.div>}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        )}

        {/* ==========================================
            TAMBAHAN (Modal Admin Edit/Import dll yang ada di atas)
        ========================================== */}
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

          {modalImportAkun && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black flex items-center gap-2 text-slate-900"><FileSpreadsheet className="w-6 h-6 text-indigo-600" /> Import Akun Massal (JSON)</h3>
                </div>
                {notifImport && <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-sm rounded-xl text-center">{notifImport}</div>}
                <form onSubmit={handleImportJson} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Editor JSON Data</label>
                      <button type="button" onClick={() => setTeksImportJson(TEMPLATE_JSON_CONTOH)} className="text-[11px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-black hover:bg-indigo-100 transition">Muat Template Contoh</button>
                    </div>
                    <textarea rows={10} required value={teksImportJson} onChange={e => setTeksImportJson(e.target.value)} placeholder={`[\n  {\n    "nama": "Nama Siswa",\n    "email": "email@sekolah.id"\n  }\n]`} className="w-full p-4 font-mono text-sm bg-slate-900 text-emerald-300 rounded-2xl shadow-inner outline-none" />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition text-sm">🚀 Jalankan Import Data Massal</button>
                    <button type="button" onClick={() => setModalImportAkun(false)} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-sm">Batal</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {modalKategori && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
                <h3 className="text-xl font-black mb-6 text-slate-900">Tambah Kelas / Prodi Baru</h3>
                <form onSubmit={tambahKategoriBaru} className="space-y-5">
                  <div>
                    <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Jenjang Induk</label>
                    <select value={targetJenjangKategori} onChange={e => setTargetJenjangKategori(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-extrabold text-slate-900 outline-none">
                      {daftarJenjang.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">Nama Sub-Kategori</label>
                    <input type="text" required value={namaKategoriBaru} onChange={e => setNamaKategoriBaru(e.target.value)} placeholder="Misal: Kelas 10 IPA 1..." className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold outline-none" />
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

      </main>

      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-md py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 shadow-lg">🐼</div>
          <p className="font-black text-slate-900 text-lg mb-1">HibahIlmu.id</p>
          <p className="text-xs text-slate-500 font-semibold mb-4">LMS Open Source • Pendidikan Gratis Indonesia</p>
        </div>
      </footer>
    </div>
  );
}