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
  Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, FolderArchive
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
  rangkuman: string; // Mendukung format HTML (Rich Text)
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
  aksesMengajar?: string[]; // RBAC Guru
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  namaPelaku: string;
  rolePelaku: "admin" | "guru" | "siswa";
  aksi: string;
  kategori: "belajar" | "materi" | "akun" | "komunitas" | "sistem";
}

// STRUKTUR BARU: KELOMPOK BELAJAR (Rombel mirip Moodle)
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
    id: "sma",
    nama: "SMA / SMK",
    tagline: "Persiapan Masa Depan",
    deskripsi: "Kalkulus, Fisika mekanika, Kimia, Ekonomi & UTBK.",
    gradien: "from-violet-600 via-purple-600 to-fuchsia-600",
    badge: "bg-purple-100 text-purple-800",
    ikonNama: "school",
    subJenjang: [
      { id: "sma-10", nama: "Kelas 10 Umum" }, { id: "sma-11-ipa", nama: "Kelas 11 MIPA" }, { id: "sma-11-ips", nama: "Kelas 11 IPS" },
    ],
    kelas: [],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  { id: "to-1", jenjang: "SD", pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 × 3) - 10 adalah...", rumus: "KABATAKU", opsi: ["51", "101", "61", "45"], jawabanBenar: 0, pembahasan: "12×3=36. 25+36-10=51." },
];

const AKUN_DEFAULT: AkunPengguna[] = [
  { id: "adm-1", nama: "Admin Panda Kode", email: "admin@hibahilmu.id", password: "123", role: "admin", status: "approved", infoTambahan: "Super Admin", waktuDaftar: "Permanen", aksesMengajar: [] },
  { id: "gru-1", nama: "Budi Santoso, M.Pd", email: "guru@hibahilmu.id", password: "123", role: "guru", status: "approved", infoTambahan: "Guru Fisika SMA", waktuDaftar: "Kemarin", aksesMengajar: ["sma-11-ipa", "sma-12-ipa"] },
  { id: "sis-1", nama: "Aisyah Putri", email: "siswa@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswi SMA Kelas 11", waktuDaftar: "Kemarin", aksesMengajar: [] },
  { id: "sis-2", nama: "Reza Rahadian", email: "reza@hibahilmu.id", password: "123", role: "siswa", status: "approved", infoTambahan: "Siswa SMA", waktuDaftar: "Hari ini", aksesMengajar: [] },
];

// ==========================================
// KOMPONEN RICH TEXT EDITOR
// ==========================================
const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

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
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([{ id: "pr-1", penanya: "Rizky", jenjang: "SMP", mapel: "Matematika", pertanyaan: "Cara bedain rumus Luas & Keliling?", waktu: "1 jam lalu", jawaban: [] }]);
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
  
  const [selectedAkunIds, setSelectedAkunIds] = useState<string[]>([]);
  const [modalImportAkun, setModalImportAkun] = useState<boolean>(false);
  const [teksImportJson, setTeksImportJson] = useState<string>("");
  const [notifImport, setNotifImport] = useState<string>("");
  
  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // Admin Rombel Management
  const [namaKelompokAdmin, setNamaKelompokAdmin] = useState("");
  const [guruKelompokAdmin, setGuruKelompokAdmin] = useState("");
  const [searchSiswaAdmin, setSearchSiswaAdmin] = useState("");

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
  const [searchSiswaGuru, setSearchSiswaGuru] = useState("");

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
        catatLog(userLogin?.nama || "Siswa", userLogin?.role || "siswa", `Menyelesaikan materi pelajaran`, "belajar");
      }
      localStorage.setItem("hibah_selesai", JSON.stringify(daftarBaru));
      return daftarBaru;
    });
  };

  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun kamu masih menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun ini sedang disuspend (dibekukan).");
    setUserLogin(akun); localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, `Berhasil masuk ke Dashboard`, "akun");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setPesanError("");
    const akunDitemukan = (daftarAkun || []).find(a => a.email.toLowerCase() === emailLogin.toLowerCase() && a.password === passwordLogin);
    if (!akunDitemukan) return setPesanError("Email atau Password salah.");
    if (akunDitemukan.status === "pending") return setPesanError("⏳ Akun menunggu persetujuan Admin.");
    if (akunDitemukan.status === "rejected") return setPesanError("❌ Akun ini telah disuspend.");
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

  // ADMIN FUNCTIONS
  const ubahStatusAkun = (id: string, status: "approved" | "rejected" | "pending") => {
    const update = (daftarAkun || []).map(a => a.id === id ? { ...a, status } : a);
    setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Ubah status akun menjadi ${status}`, "akun");
  };

  const hapusAkun = (id: string) => {
    const update = (daftarAkun || []).filter(a => a.id !== id);
    setDaftarAkun(update); localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
    catatLog(userLogin?.nama || "Admin", "admin", `Menghapus akun permanen`, "akun");
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
      if (!Array.isArray(parsedData)) return alert("Format JSON harus berupa Array [...]");
      const akunBaruMasuk: AkunPengguna[] = parsedData.map((item: any, idx: number) => ({ id: "import-" + Date.now() + "-" + idx, nama: item.nama || "User", email: item.email || `u${idx}@h.id`, password: item.password || "123", role: item.role === "guru" || item.role === "admin" ? item.role : "siswa", status: "approved", infoTambahan: item.infoTambahan || "Diimpor massal", waktuDaftar: "Import", aksesMengajar: [] }));
      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan); localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      setNotifImport(`✅ Sukses import ${akunBaruMasuk.length} akun`);
      setTimeout(() => { setNotifImport(""); setModalImportAkun(false); }, 2000);
    } catch { alert("Format JSON tidak valid!"); }
  };

  const tambahKategoriBaru = (e: React.FormEvent) => {
    e.preventDefault(); if (!namaKategoriBaru.trim()) return;
    const update = daftarJenjang.map(j => j.id === targetJenjangKategori ? { ...j, subJenjang: [...j.subJenjang, { id: `sub-${Date.now()}`, nama: namaKategoriBaru }] } : j);
    setDaftarJenjang(update); localStorage.setItem("hibah_struktur", JSON.stringify(update));
    setModalKategori(false); setNamaKategoriBaru("");
  };

  const handleAdminBuatKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if(!namaKelompokAdmin.trim() || !guruKelompokAdmin) return;
    const kelompokBaru: KelompokBelajar = { id: "kelompok-" + Date.now(), namaKelas: namaKelompokAdmin, guruId: guruKelompokAdmin, siswaIds: [] };
    const update = [...daftarKelompok, kelompokBaru];
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    setNamaKelompokAdmin(""); setGuruKelompokAdmin("");
  };

  // FUNGSI GLOBAL ROMBEL & GURU
  const handleTambahSiswaKeKelompok = (kelompokId: string, siswaId: string) => {
    const update = daftarKelompok.map(k => k.id === kelompokId && !k.siswaIds.includes(siswaId) ? { ...k, siswaIds: [...k.siswaIds, siswaId] } : k);
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  const handleHapusSiswaDariKelompok = (kelompokId: string, siswaId: string) => {
    const update = daftarKelompok.map(k => k.id === kelompokId ? { ...k, siswaIds: k.siswaIds.filter(id => id !== siswaId) } : k);
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

  const handleHapusKelompok = (kelompokId: string) => {
    if(!confirm("Yakin ingin menghapus ruang kelas ini beserta data siswanya?")) return;
    const update = daftarKelompok.filter(k => k.id !== kelompokId);
    setDaftarKelompok(update); localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    catatLog(userLogin?.nama || "Sistem", userLogin?.role || "guru", "Menghapus Ruang Kelas", "sistem");
  };

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

  const selesaikanTryout = () => {
    let benar = 0; BANK_SOAL_TRYOUT.forEach((soal, idx) => { if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++; });
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

  const safeAkunList = daftarAkun || [];
  const safeLogList = logAktivitas || [];
  const guruKelompoks = daftarKelompok.filter(k => k.guruId === userLogin?.id);
  const daftarSiswaApproved = safeAkunList.filter(a => a.role === "siswa" && a.status === "approved");

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

                <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                  <button onClick={() => setAdminTabAktif("akun")} className={`px-4 py-2 rounded-t-xl text-xs font-bold transition ${adminTabAktif === "akun" ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>Data Pengguna</button>
                  <button onClick={() => setAdminTabAktif("kategori")} className={`px-4 py-2 rounded-t-xl text-xs font-bold transition ${adminTabAktif === "kategori" ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>Struktur Jenjang</button>
                  <button onClick={() => setAdminTabAktif("rombel")} className={`px-4 py-2 rounded-t-xl text-xs font-bold transition ${adminTabAktif === "rombel" ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>Manajemen Rombel</button>
                  <button onClick={() => setAdminTabAktif("log")} className={`px-4 py-2 rounded-t-xl text-xs font-bold transition ${adminTabAktif === "log" ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>Log Aktivitas</button>
                </div>

                {adminTabAktif === "akun" && (
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-black text-lg">Manajemen Akun</h2>
                      {selectedAkunIds.length > 0 && <button onClick={hapusAkunSekaligus} className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg font-bold flex gap-1"><Trash2 className="w-3.5 h-3.5"/> Hapus Terpilih</button>}
                    </div>
                    <div className="space-y-3 max-h-[30rem] overflow-y-auto">
                      {safeAkunList.map(akun => (
                        <div key={akun.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            {akun.role !== "admin" && <input type="checkbox" checked={selectedAkunIds.includes(akun.id)} onChange={() => togglePilihAkun(akun.id)} className="w-4 h-4 accent-indigo-600"/>}
                            <div>
                              <div className="font-bold text-sm">{akun.nama} <span className="uppercase text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded ml-2">{akun.role}</span><span className="uppercase text-[10px] bg-emerald-100 text-emerald-700 px-2 rounded ml-1">{akun.status}</span></div>
                              <div className="text-xs text-slate-500 mt-1">{akun.email}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {akun.status === "pending" && <button onClick={() => ubahStatusAkun(akun.id, "approved")} className="p-1.5 bg-emerald-100 text-emerald-700 rounded"><UserCheck className="w-4 h-4"/></button>}
                            <button onClick={() => bukaModalEditAkun(akun)} className="p-1.5 bg-blue-100 text-blue-700 rounded"><Edit3 className="w-4 h-4"/></button>
                            {akun.role !== "admin" && <button onClick={() => hapusAkun(akun.id)} className="p-1.5 bg-rose-100 text-rose-700 rounded"><Trash2 className="w-4 h-4"/></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTabAktif === "kategori" && (
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-black text-lg">Manajemen Tingkat / Jurusan</h2>
                      <button onClick={() => setModalKategori(true)} className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex gap-1"><PlusCircle className="w-3.5 h-3.5"/> Tambah Tingkat</button>
                    </div>
                    <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                      {daftarJenjang.map(j => (
                        <div key={j.id} className="p-4 border rounded-2xl bg-slate-50">
                          <h3 className="font-bold mb-2 uppercase text-slate-700">{j.nama}</h3>
                          <div className="flex flex-wrap gap-2">
                            {j.subJenjang.map(sj => <span key={sj.id} className="bg-white text-xs px-3 py-1.5 rounded-lg border font-semibold">{sj.nama}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTabAktif === "rombel" && (
                  <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-6">
                    <h2 className="font-black text-lg">Kelola Semua Ruang Kelas (Rombel)</h2>
                    <form onSubmit={handleAdminBuatKelompok} className="flex gap-2 p-4 bg-slate-50 border rounded-xl">
                      <input type="text" required value={namaKelompokAdmin} onChange={e=>setNamaKelompokAdmin(e.target.value)} placeholder="Nama Rombel" className="p-2 border rounded-lg text-sm flex-1"/>
                      <select required value={guruKelompokAdmin} onChange={e=>setGuruKelompokAdmin(e.target.value)} className="p-2 border rounded-lg text-sm flex-1">
                        <option value="" disabled>Pilih Guru</option>
                        {safeAkunList.filter(a => a.role === "guru").map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                      </select>
                      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Buat Rombel</button>
                    </form>
                    
                    <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                      {daftarKelompok.length === 0 && <div className="text-center py-6 text-sm text-slate-400 border-2 border-dashed rounded-xl">Belum ada rombel.</div>}
                      {daftarKelompok.map(kel => (
                        <div key={kel.id} className="p-4 border rounded-xl bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-indigo-900">{kel.namaKelas}</h3>
                            <button onClick={() => handleHapusKelompok(kel.id)} className="text-rose-500 bg-rose-50 px-2 py-1 rounded text-xs font-bold">Hapus Rombel</button>
                          </div>
                          <div className="text-xs text-slate-500 mb-3">Guru: <b>{safeAkunList.find(a=>a.id === kel.guruId)?.nama}</b> • Siswa: {kel.siswaIds.length} anak</div>
                          
                          <div className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
                              <input type="text" value={searchSiswaAdmin} onChange={e=>setSearchSiswaAdmin(e.target.value)} placeholder="Cari Siswa untuk dimasukkan..." className="w-full pl-7 pr-2 py-1.5 text-xs border rounded-lg" />
                            </div>
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {daftarSiswaApproved.filter(s => !kel.siswaIds.includes(s.id) && (s.nama.toLowerCase().includes(searchSiswaAdmin.toLowerCase()) || s.email.toLowerCase().includes(searchSiswaAdmin.toLowerCase()))).slice(0, 10).map(s => (
                              <div key={s.id} className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                                <span>{s.nama} ({s.email})</span>
                                <button onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)} className="bg-emerald-600 text-white px-2 py-1 rounded">Tambah</button>
                              </div>
                            ))}
                            {kel.siswaIds.map(sId => {
                              const s = safeAkunList.find(x => x.id === sId);
                              if(!s) return null;
                              return (
                                <div key={sId} className="flex justify-between items-center bg-indigo-50 p-2 rounded text-xs border border-indigo-100">
                                  <span><CheckCircle2 className="w-3 h-3 inline text-emerald-600 mr-1"/>{s.nama}</span>
                                  <button onClick={() => handleHapusSiswaDariKelompok(kel.id, s.id)} className="text-rose-500 font-bold hover:underline">Hapus</button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTabAktif === "log" && (
                  <div className="bg-white p-6 rounded-3xl border shadow-sm h-full">
                    <h2 className="text-xl font-black mb-4">Audit Log</h2>
                    <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
                      {logAktivitas.map(log => (
                        <div key={log.id} className="p-3 bg-slate-50 border rounded-xl flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase bg-slate-200 px-2 py-0.5 rounded">{log.rolePelaku} - {log.namaPelaku}</span>
                            <span className="font-mono text-[10px] text-slate-400">{log.waktu}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{log.aksi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Admin: Tambah/Edit Akun */}
                {modalAdminAkun && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                      <h3 className="font-black text-xl mb-4">{idEditAkun ? "Edit Akun" : "Tambah Akun"}</h3>
                      <form onSubmit={simpanAkunAdmin} className="space-y-3 text-sm">
                        <input type="text" required value={namaFormAdmin} onChange={e=>setNamaFormAdmin(e.target.value)} placeholder="Nama Lengkap" className="w-full p-3 border rounded-xl bg-slate-50" />
                        <input type="email" required value={emailFormAdmin} onChange={e=>setEmailFormAdmin(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-xl bg-slate-50" />
                        <input type="password" value={passFormAdmin} onChange={e=>setPassFormAdmin(e.target.value)} placeholder={`Password ${idEditAkun ? '(Kosongkan jika tidak diubah)' : ''}`} className="w-full p-3 border rounded-xl bg-slate-50" />
                        <div className="flex gap-3">
                          <select value={roleFormAdmin} onChange={e=>setRoleFormAdmin(e.target.value as any)} className="w-full p-3 border rounded-xl font-bold"><option value="siswa">Siswa</option><option value="guru">Guru Relawan</option><option value="admin">Admin</option></select>
                          <select value={statusFormAdmin} onChange={e=>setStatusFormAdmin(e.target.value as any)} className="w-full p-3 border rounded-xl font-bold"><option value="approved">Aktif</option><option value="pending">Pending</option><option value="rejected">Suspend</option></select>
                        </div>
                        {roleFormAdmin === "guru" && (
                          <div className="p-4 bg-indigo-50 border rounded-xl">
                            <label className="font-bold mb-2 block">Hak Mengajar (RBAC):</label>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                              {daftarJenjang.map(j => (
                                <div key={j.id} className="text-xs">
                                  <div className="font-bold text-slate-500 mb-1">{j.nama}</div>
                                  <div className="flex flex-wrap gap-2">
                                    {j.subJenjang.map(sj => (
                                      <label key={sj.id} className="flex gap-1 items-center bg-white px-2 py-1 rounded border"><input type="checkbox" checked={aksesMengajarForm.includes(sj.id)} onChange={() => setAksesMengajarForm(p => p.includes(sj.id) ? p.filter(x=>x!==sj.id) : [...p, sj.id])}/> {sj.nama}</label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl">Simpan</button>
                          <button type="button" onClick={()=>setModalAdminAkun(false)} className="px-5 py-3 bg-slate-200 rounded-xl font-bold">Batal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {modalImportAkun && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-6 max-w-lg w-full">
                      <h3 className="font-black text-xl mb-4">Import Akun (JSON)</h3>
                      <button type="button" onClick={() => setTeksImportJson(TEMPLATE_JSON_CONTOH)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-bold mb-2">Lihat Contoh Format</button>
                      <textarea rows={8} value={teksImportJson} onChange={e=>setTeksImportJson(e.target.value)} placeholder={`[\n  { "nama": "Rina", "email": "rina@sekolah.id" }\n]`} className="w-full p-4 text-xs border rounded-xl font-mono bg-slate-900 text-emerald-300"></textarea>
                      <div className="flex gap-2 mt-4">
                        <button onClick={handleImportJson} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Jalankan Import</button>
                        <button onClick={()=>setModalImportAkun(false)} className="px-5 py-3 bg-slate-200 rounded-xl font-bold">Batal</button>
                      </div>
                    </div>
                  </div>
                )}

                {modalKategori && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full">
                      <h3 className="font-black text-xl mb-4">Tambah Kategori Baru</h3>
                      <form onSubmit={tambahKategoriBaru} className="space-y-4">
                        <select value={targetJenjangKategori} onChange={e=>setTargetJenjangKategori(e.target.value)} className="w-full p-3 border rounded-xl text-sm font-bold">
                          {daftarJenjang.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                        </select>
                        <input type="text" required value={namaKategoriBaru} onChange={e=>setNamaKategoriBaru(e.target.value)} placeholder="Nama Sub-Kategori..." className="w-full p-3 border rounded-xl text-sm" />
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl">Simpan</button>
                          <button type="button" onClick={()=>setModalKategori(false)} className="px-5 py-3 bg-slate-200 font-bold rounded-xl">Batal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : userLogin.role === "guru" ? (
              /* --- GURU DASHBOARD --- */
              <motion.div key="guru" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-indigo-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                  <div><h1 className="text-2xl font-black">Studio Pengajar</h1><p className="text-sm">Akses {opsiKelasGuru.length} kelas.</p></div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-5 py-2.5 rounded-xl text-xs font-bold">Keluar</button>
                </div>
                
                <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                  <button onClick={() => setGuruTabAktif("materi")} className={`px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${guruTabAktif === "materi" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500"}`}><BookOpen className="w-4 h-4 inline mr-2"/> Publikasi Materi</button>
                  <button onClick={() => setGuruTabAktif("kelas")} className={`px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${guruTabAktif === "kelas" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500"}`}><FolderArchive className="w-4 h-4 inline mr-2"/> Kelola Kelas (Moodle Style)</button>
                </div>

                {guruTabAktif === "materi" && (
                  <div className="bg-white p-6 rounded-3xl rounded-tl-none border shadow-sm max-w-4xl">
                    {notifGuru && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl mb-4 border border-emerald-200">🎉 Materi berhasil diterbitkan!</div>}
                    <form onSubmit={handleGuruBuatMateri} className="space-y-4">
                      <select required value={subJenjangPilih} onChange={e=>setSubJenjangPilih(e.target.value)} className="w-full p-4 border border-indigo-200 bg-indigo-50 rounded-xl font-bold text-indigo-900 text-sm outline-none">
                        <option value="" disabled>-- Pilih Kelas Tujuan --</option>
                        {opsiKelasGuru.map(sj => <option key={sj.id} value={sj.id}>{sj.namaInduk} - {sj.nama}</option>)}
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" required value={judulMateri} onChange={e=>setJudulMateri(e.target.value)} placeholder="Judul Materi..." className="p-4 border rounded-xl text-sm" />
                        <select value={levelMateri} onChange={(e) => setLevelMateri(e.target.value as any)} className="p-4 border rounded-xl font-bold text-sm"><option value="Pemula">Pemula</option><option value="Menengah">Menengah</option><option value="Mahir">Mahir</option></select>
                      </div>
                      <input type="url" required value={videoMateri} onChange={e=>setVideoMateri(e.target.value)} placeholder="Link YouTube" className="w-full p-4 border rounded-xl text-sm" />
                      
                      {/* RICH TEXT EDITOR */}
                      <div>
                        <label className="font-bold text-xs text-slate-500 mb-2 block">Rangkuman / Artikel Materi (Format Rich Text)</label>
                        <RichTextEditor value={rangkumanMateri} onChange={setRangkumanMateri} />
                      </div>

                      <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
                        <div className="font-bold text-sm">Pembuatan Kuis</div>
                        <input type="text" required value={pertanyaanKuis} onChange={e=>setPertanyaanKuis(e.target.value)} placeholder="Pertanyaan..." className="w-full p-3 border bg-white rounded-xl text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" required value={opsiA} onChange={e=>setOpsiA(e.target.value)} placeholder="Opsi A" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiB} onChange={e=>setOpsiB(e.target.value)} placeholder="Opsi B" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiC} onChange={e=>setOpsiC(e.target.value)} placeholder="Opsi C" className="p-3 border bg-white rounded-xl text-sm" />
                          <input type="text" required value={opsiD} onChange={e=>setOpsiD(e.target.value)} placeholder="Opsi D" className="p-3 border bg-white rounded-xl text-sm" />
                        </div>
                        <select value={kunciKuis} onChange={e=>setKunciKuis(Number(e.target.value))} className="w-full p-3 border bg-emerald-50 rounded-xl font-bold text-sm"><option value={0}>A Benar</option><option value={1}>B Benar</option><option value={2}>C Benar</option><option value={3}>D Benar</option></select>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition">🚀 Terbitkan Materi</button>
                    </form>
                  </div>
                )}

                {guruTabAktif === "kelas" && (
                  <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-5xl space-y-6">
                    <h2 className="text-xl font-black mb-4">Manajemen Kelas (Pendaftaran Siswa)</h2>
                    <form onSubmit={handleBuatKelompok} className="flex gap-2 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <input type="text" required value={namaKelompokBaru} onChange={e=>setNamaKelompokBaru(e.target.value)} placeholder="Nama Kelas Baru (Contoh: Fisika Kelas 10A)" className="flex-1 p-3 rounded-lg border text-sm font-semibold"/>
                      <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-sm">Buat</button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {guruKelompoks.length === 0 && <div className="col-span-2 text-center py-8 text-slate-400 border-2 border-dashed rounded-2xl text-sm">Anda belum membuat kelas.</div>}
                      {guruKelompoks.map(kel => (
                        <div key={kel.id} className="p-5 border rounded-2xl shadow-sm bg-white relative">
                          <button onClick={() => handleHapusKelompok(kel.id)} className="absolute top-4 right-4 text-rose-500 text-xs font-bold hover:underline">Hapus Kelas</button>
                          <h3 className="font-black text-lg mb-2">{kel.namaKelas}</h3>
                          <div className="text-[10px] font-bold text-slate-500 mb-4 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">Siswa: {kel.siswaIds.length} Anak</div>
                          
                          <div className="mb-4 space-y-2">
                            <div className="relative">
                              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                              <input type="text" value={kelompokAktifGuru === kel.id ? searchSiswaGuru : ""} onChange={e => { setKelompokAktifGuru(kel.id); setSearchSiswaGuru(e.target.value); }} placeholder="Cari by Nama/Email lalu Tambah..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                            
                            {/* SEARCH RESULTS DROPDOWN (ONLY SHOW IF SEARCHING IN THIS GROUP) */}
                            {kelompokAktifGuru === kel.id && searchSiswaGuru.trim() !== "" && (
                              <div className="max-h-32 overflow-y-auto border rounded-lg bg-white shadow-lg absolute z-20 w-[calc(100%-2.5rem)]">
                                {daftarSiswaApproved.filter(s => !kel.siswaIds.includes(s.id) && (s.nama.toLowerCase().includes(searchSiswaGuru.toLowerCase()) || s.email.toLowerCase().includes(searchSiswaGuru.toLowerCase()))).map(s => (
                                  <div key={s.id} className="flex justify-between items-center p-2 border-b hover:bg-slate-50 text-xs">
                                    <span className="font-semibold">{s.nama} <span className="text-slate-400 font-normal">({s.email})</span></span>
                                    <button onClick={() => { handleTambahSiswaKeKelompok(kel.id, s.id); setSearchSiswaGuru(""); }} className="bg-emerald-600 text-white px-2 py-1 rounded font-bold">Tambah</button>
                                  </div>
                                ))}
                                {daftarSiswaApproved.filter(s => !kel.siswaIds.includes(s.id) && (s.nama.toLowerCase().includes(searchSiswaGuru.toLowerCase()) || s.email.toLowerCase().includes(searchSiswaGuru.toLowerCase()))).length === 0 && (
                                  <div className="p-3 text-xs text-slate-400 text-center">Siswa tidak ditemukan atau sudah ada di kelas ini.</div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {kel.siswaIds.map(sId => {
                              const sw = daftarAkun.find(a => a.id === sId);
                              if(!sw) return null;
                              return (
                                <div key={sId} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                                  <div className="font-bold">{sw.nama}</div>
                                  <button onClick={() => handleHapusSiswaDariKelompok(kel.id, sId)} className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"><UserX className="w-3.5 h-3.5"/></button>
                                </div>
                              )
                            })}
                            {kel.siswaIds.length === 0 && <div className="text-xs text-slate-400 italic text-center py-2">Belum ada siswa di kelas ini.</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* --- SISWA DASHBOARD --- */
              <motion.div key="siswa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-emerald-700 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
                  <div><h1 className="text-2xl font-black">Halo, {userLogin.nama}!</h1><p className="text-sm">Total XP: {poinXP}</p></div>
                  <button onClick={() => { setUserLogin(null); localStorage.removeItem("hibah_user_aktif"); }} className="bg-white/20 px-5 py-2.5 rounded-xl text-xs font-bold">Keluar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ==================== 2. TRYOUT ==================== */}
        {menuAktif === "tryout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-10 border text-center shadow-sm">
                <Timer className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-4">Simulasi Tryout</h2>
                <button onClick={() => { setJawabanUserTryout({}); setSisaWaktu(180); setUjianSelesai(false); setSedangUjian(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition">Mulai Sekarang</button>
              </div>
            )}
            {sedangUjian && (
              <div className="space-y-6">
                <div className="text-right text-rose-600 font-bold font-mono text-2xl bg-white p-4 rounded-xl border inline-block ml-auto">{Math.floor(sisaWaktu/60)}:{(sisaWaktu%60).toString().padStart(2,'0')}</div>
                {BANK_SOAL_TRYOUT.map((soal, i) => (
                  <div key={soal.id} className="bg-white p-8 rounded-3xl border shadow-sm">
                    <h3 className="font-extrabold text-xl mb-6">{soal.pertanyaan}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {soal.opsi.map((ops, idx) => (
                        <button key={idx} onClick={() => setJawabanUserTryout(p => ({...p, [i]: idx}))} className={`p-4 rounded-xl border-2 text-sm font-semibold text-left transition ${jawabanUserTryout[i] === idx ? "bg-indigo-50 border-indigo-600 text-indigo-900" : "hover:bg-slate-50 border-slate-200"}`}>{ops}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={selesaikanTryout} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-lg">Kumpulkan Ujian</button>
              </div>
            )}
            {ujianSelesai && (
              <div className="bg-white p-12 rounded-3xl border text-center shadow-lg">
                <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4"/>
                <h2 className="text-4xl font-black mb-6">Skor Akhir: {skorTryout}</h2>
                <button onClick={() => { setUjianSelesai(false); setSedangUjian(false); }} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold">Ulangi Tryout</button>
              </div>
            )}
          </motion.div>
        )}

        {/* ==================== 3. FORUM ==================== */}
        {menuAktif === "forum" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 border rounded-3xl shadow-sm">
              <h2 className="font-black text-2xl mb-6 flex items-center gap-2"><HelpCircle className="text-emerald-600"/> Tanya PR</h2>
              <form onSubmit={e => { e.preventDefault(); if(tanyaBaru.trim()) { setDaftarDiskusi([{id: "pr-"+Date.now(), penanya: userLogin?.nama || "Siswa", jenjang: "Umum", mapel: mapelBaru, pertanyaan: tanyaBaru, waktu: "Baru saja", jawaban: []}, ...daftarDiskusi]); setTanyaBaru(""); tambahXP(20); } }}>
                <input type="text" required value={mapelBaru} onChange={e=>setMapelBaru(e.target.value)} placeholder="Mata Pelajaran..." className="w-full p-4 bg-slate-50 border rounded-2xl text-sm mb-3 outline-none focus:border-emerald-500" />
                <textarea rows={3} required value={tanyaBaru} onChange={e=>setTanyaBaru(e.target.value)} placeholder="Ketik kesulitan atau pertanyaanmu di sini..." className="w-full p-4 bg-slate-50 border rounded-2xl text-sm mb-4 outline-none focus:border-emerald-500" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-md flex items-center gap-2"><Send className="w-4 h-4"/> Kirim Pertanyaan (+20 XP)</button>
              </form>
            </div>
            {daftarDiskusi.map(d => (
              <div key={d.id} className="bg-white p-8 border rounded-3xl shadow-sm">
                <div className="font-bold text-sm mb-2">{d.mapel} • <span className="text-slate-500">{d.penanya}</span></div>
                <p className="text-base font-medium mb-5">{d.pertanyaan}</p>
                <div className="space-y-3 mb-6 pl-4 border-l-4 border-emerald-200">
                  {d.jawaban.map((j, i) => <div key={i} className="text-sm bg-emerald-50 border border-emerald-100 p-4 rounded-2xl"><b>{j.penjawab}:</b> {j.isi}</div>)}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={balasanInput[d.id] || ""} onChange={e => setBalasanInput({...balasanInput, [d.id]: e.target.value})} placeholder="Bantu jawab..." className="flex-1 p-4 bg-slate-50 border rounded-2xl text-sm outline-none focus:border-emerald-500" />
                  <button onClick={() => { if(balasanInput[d.id]) { setDaftarDiskusi(daftarDiskusi.map(x => x.id === d.id ? {...x, jawaban: [...x.jawaban, {penjawab: userLogin?.nama || "Relawan", isi: balasanInput[d.id]}]} : x)); setBalasanInput({...balasanInput, [d.id]: ""}); tambahXP(30); } }} className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-sm font-bold shadow">Kirim</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ==================== 4. TRANSPARANSI ==================== */}
        {menuAktif === "transparansi" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto bg-slate-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6"/>
            <h2 className="text-4xl font-black mb-4">Transparansi Dana</h2>
            <p className="text-slate-300 text-base mb-10 leading-relaxed max-w-lg mx-auto">Donasi sukarela digunakan 100% untuk perpanjangan server VPS agar HibahIlmu selalu bisa diakses gratis oleh pelajar di seluruh Indonesia.</p>
            <div className="bg-white/10 p-6 rounded-3xl text-left border border-white/20">
              <div className="flex justify-between text-sm font-bold text-emerald-300 mb-3"><span>Terkumpul: Rp 850.000</span><span>Target: Rp 1.500.000</span></div>
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden"><div className="w-[56%] h-full bg-emerald-400 rounded-full"></div></div>
            </div>
          </motion.div>
        )}

        {/* ==================== 5. BERANDA KELAS (RUANG BELAJAR) ==================== */}
        {menuAktif === "beranda" && (
          <React.Fragment>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-16 pt-8">
                  <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight text-slate-900">Satu Platform,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Gratis Selamanya.</span></h1>
                  <div className="max-w-2xl mx-auto relative shadow-xl rounded-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                    <input type="text" value={kataKunci} onChange={e=>setKataKunci(e.target.value)} placeholder="Cari Jenjang atau Pelajaran..." className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-full font-bold text-base outline-none focus:ring-4 focus:ring-emerald-500/20" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {daftarJenjang.filter(j => j.nama.toLowerCase().includes(kataKunci.toLowerCase())).map(j => (
                    <motion.div key={j.id} whileHover={{ y: -8 }} onClick={() => { setJenjangAktif(j); setSubJenjangAktif("semua"); }} className="cursor-pointer bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-2xl transition relative overflow-hidden">
                      <div className={`h-2.5 w-full bg-gradient-to-r ${j.gradien} absolute top-0 left-0`} />
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${j.gradien} flex items-center justify-center mb-6 shadow-md`}>{renderIkon(j.ikonNama)}</div>
                      <h3 className="font-black text-2xl mb-3 text-slate-900">{j.nama}</h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{j.deskripsi}</p>
                      <div className="text-sm font-black text-emerald-600 flex items-center justify-between">Buka Kelas <span className="bg-emerald-50 p-2 rounded-full">→</span></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setJenjangAktif(null)} className="mb-8 bg-white px-5 py-3 border rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50"><ArrowLeft className="w-4 h-4"/> Kembali</button>
                <div className={`rounded-[2rem] p-12 text-white bg-gradient-to-br ${jenjangAktif.gradien} shadow-2xl mb-10`}>
                  <h1 className="text-4xl sm:text-5xl font-black mb-3">{jenjangAktif.nama}</h1>
                  <p className="text-lg opacity-90">{jenjangAktif.deskripsi}</p>
                </div>
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                  <button onClick={() => setSubJenjangAktif("semua")} className={`px-6 py-3 border rounded-xl text-sm font-bold whitespace-nowrap transition ${subJenjangAktif === "semua" ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}>Semua Kelas</button>
                  {jenjangAktif.subJenjang.map(sj => (
                    <button key={sj.id} onClick={() => setSubJenjangAktif(sj.id)} className={`px-6 py-3 border rounded-xl text-sm font-bold whitespace-nowrap transition ${subJenjangAktif === sj.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}>{sj.nama}</button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jenjangAktif.kelas.filter(k => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif).map(k => (
                    <div key={k.id} onClick={() => setKelasAktif(k)} className={`bg-white p-8 border-2 rounded-[2rem] cursor-pointer hover:shadow-xl transition ${materiSelesai.includes(k.id) ? "border-emerald-400 bg-emerald-50/30" : "border-slate-100"}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">{jenjangAktif.subJenjang.find(s=>s.id === k.subJenjangId)?.nama || "Umum"}</span>
                        {materiSelesai.includes(k.id) && <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Selesai</span>}
                      </div>
                      <h3 className="font-black text-xl mb-3">{k.judul}</h3>
                      <p className="text-sm text-slate-500 mb-6 line-clamp-2" dangerouslySetInnerHTML={{ __html: k.rangkuman }}></p>
                      <div className="text-sm font-bold text-indigo-600 flex items-center gap-2 pt-4 border-t"><PlayCircle className="w-5 h-5"/> Buka Materi</div>
                    </div>
                  ))}
                  {jenjangAktif.kelas.filter(k => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif).length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-16 border-2 border-dashed rounded-[2rem] text-slate-400 bg-white">
                      <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                      <p className="font-bold text-lg">Belum ada materi di sini.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* HALAMAN BACA MATERI (RICH TEXT VIEW) */}
            {kelasAktif && jenjangAktif && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setKelasAktif(null)} className="bg-white px-5 py-3 border rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm"><ArrowLeft className="w-4 h-4"/> Kembali</button>
                  <button onClick={() => toggleSelesaiMateri(kelasAktif.id)} className={`px-6 py-3 rounded-2xl text-sm font-black border-2 shadow-md transition flex items-center gap-2 ${materiSelesai.includes(kelasAktif.id) ? "bg-emerald-50 text-emerald-700 border-emerald-500" : "bg-slate-900 text-white border-slate-900"}`}>
                    {materiSelesai.includes(kelasAktif.id) ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>} Tandai Selesai
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                      <div className="aspect-video bg-slate-900 rounded-2xl mb-8 overflow-hidden"><iframe src={kelasAktif.videoUrl} className="w-full h-full" allowFullScreen></iframe></div>
                      <h1 className="text-3xl font-black mb-6 text-slate-900">{kelasAktif.judul}</h1>
                      
                      {/* RENDER HTML RICH TEXT DARI GURU */}
                      <div className="prose prose-slate prose-img:rounded-2xl max-w-none mb-8" dangerouslySetInnerHTML={{ __html: kelasAktif.rangkuman }}></div>
                      
                      {kelasAktif.rumusMatematika && <div className="mt-8 p-6 bg-slate-900 text-emerald-300 font-mono text-sm rounded-2xl shadow-inner"><div className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Papan Rumus:</div>{kelasAktif.rumusMatematika}</div>}
                    </div>

                    <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-200 shadow-sm relative overflow-hidden">
                       <FileEdit className="w-40 h-40 absolute -right-6 -bottom-6 text-amber-900 opacity-5"/>
                       <h3 className="font-black text-xl mb-4 text-amber-900 relative z-10 flex items-center gap-2"><FileEdit className="w-6 h-6"/> Catatan Pribadi Siswa</h3>
                       <textarea rows={5} value={catatanSiswa} onChange={(e) => setCatatanSiswa(e.target.value)} placeholder="Ketik rangkuman belajar kamu di sini..." className="w-full p-5 bg-white border border-amber-200 rounded-2xl text-sm font-medium mb-4 outline-none focus:ring-2 focus:ring-amber-500 shadow-inner relative z-10" />
                       <button onClick={() => { localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa); setStatusSimpanCatatan(true); setTimeout(() => setStatusSimpanCatatan(false), 2000); }} className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-4 rounded-xl relative z-10 transition">Simpan Catatan</button>
                       <AnimatePresence>{statusSimpanCatatan && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-4 text-emerald-700 font-bold bg-emerald-100 px-3 py-2 rounded-lg relative z-10">Tersimpan!</motion.span>}</AnimatePresence>
                    </div>
                  </div>

                  <div className="xl:col-span-1">
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-lg sticky top-28">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6"><Trophy className="w-7 h-7"/></div>
                      <h3 className="font-black text-lg text-slate-900 mb-6">{kelasAktif.kuis.tanya}</h3>
                      <div className="space-y-3">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button key={idx} onClick={() => { setJawabanKuis(idx); if (idx === kelasAktif.kuis.jawabanBenar) { if (statusKuis !== "benar") tambahXP(50); setStatusKuis("benar"); } else setStatusKuis("salah"); }} className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all ${jawabanKuis === idx ? (statusKuis === "benar" ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-rose-50 border-rose-500 text-rose-900") : "hover:bg-slate-50 border-slate-200 text-slate-700"}`}>
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-black ${jawabanKuis === idx ? (statusKuis === "benar" ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900") : "bg-slate-100"}`}>{String.fromCharCode(65 + idx)}</span> {opsi}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence mode="wait">
                        {statusKuis === "benar" && <motion.div key="benar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold shadow-inner"><div className="flex items-center gap-2 mb-2 text-emerald-700 font-black text-sm"><CheckCircle2 className="w-5 h-5"/> Benar! (+50 XP)</div>{kelasAktif.kuis.pembahasan}</motion.div>}
                        {statusKuis === "salah" && <motion.div key="salah" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 font-bold shadow-inner flex items-center gap-2"><XCircle className="w-5 h-5 text-rose-600"/> Belum tepat, coba lagi ya!</motion.div>}
                      </AnimatePresence>
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