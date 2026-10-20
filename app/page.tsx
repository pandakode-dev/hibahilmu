"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Sparkles,
  School,
  Compass,
  PlayCircle,
  ArrowLeft,
  Trophy,
  Search,
  Flame,
  PlusCircle,
  CheckCircle,
  User,
  Timer,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Calculator,
  Terminal,
  FileEdit,
  Save,
  Square,
  CheckSquare,
  Send,
  HelpCircle,
  RotateCcw,
  Play,
  Award,
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
  ikon: React.ReactNode;
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

// --- DATA KURIKULUM AWAL ---
const DATA_JENJANG_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    badge: "bg-rose-100 text-rose-700",
    ikon: <Sparkles className="w-7 h-7 text-white" />,
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
    ikon: <BookOpen className="w-7 h-7 text-white" />,
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
    ikon: <Compass className="w-7 h-7 text-white" />,
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
    ikon: <School className="w-7 h-7 text-white" />,
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
    ikon: <GraduationCap className="w-7 h-7 text-white" />,
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

export default function AplikasiHibahIlmu() {
  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(DATA_JENJANG_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [kataKunci, setKataKunci] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("Semua");

  // Profil Siswa & XP
  const [namaSiswa, setNamaSiswa] = useState<string>("");
  const [bukaModalProfil, setBukaModalProfil] = useState<boolean>(false);
  const [inputNamaProfil, setInputNamaProfil] = useState<string>("");
  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);

  // Kuis & Catatan di Ruang Kelas
  const [jawabanKuis, setJawabanKuis] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState<boolean>(false);

  // Tryout State
  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(180);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [skorTryout, setSkorTryout] = useState<number>(0);

  // Forum Tanya PR State
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

  // Sumbang Materi State
  const [targetJenjang, setTargetJenjang] = useState<string>("sd");
  const [judulMateri, setJudulMateri] = useState<string>("");
  const [kategoriMateri, setKategoriMateri] = useState<string>("");
  const [urlMateri, setUrlMateri] = useState<string>("");
  const [rangkumanMateri, setRangkumanMateri] = useState<string>("");
  const [berhasilSumbang, setBerhasilSumbang] = useState<boolean>(false);

  useEffect(() => {
    const savedNama = localStorage.getItem("hibah_nama");
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    if (savedNama) setNamaSiswa(savedNama);
    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
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

  const lemparkanKonfeti = () => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  const tambahXP = (jumlah: number) => {
    setPoinXP((prev) => {
      const baru = prev + jumlah;
      localStorage.setItem("hibah_xp", baru.toString());
      return baru;
    });
    lemparkanKonfeti();
  };

  const toggleSelesai = (id: string) => {
    setMateriSelesai((prev) => {
      const ada = prev.includes(id);
      const baru = ada ? prev.filter((item) => item !== id) : [...prev, id];
      if (!ada) tambahXP(30);
      localStorage.setItem("hibah_selesai", JSON.stringify(baru));
      return baru;
    });
  };

  const simpanCatatanPribadi = () => {
    if (!kelasAktif) return;
    localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa);
    setStatusSimpanCatatan(true);
    setTimeout(() => setStatusSimpanCatatan(false), 2500);
  };

  const cekJawabKuis = (idx: number) => {
    if (!kelasAktif) return;
    setJawabanKuis(idx);
    if (idx === kelasAktif.kuis.jawabanBenar) {
      if (statusKuis !== "benar") tambahXP(50);
      setStatusKuis("benar");
    } else {
      setStatusKuis("salah");
    }
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

  const handleSumbangMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulMateri || !urlMateri) return;
    let embedUrl = urlMateri;
    if (urlMateri.includes("watch?v=")) embedUrl = urlMateri.replace("watch?v=", "embed/");

    const modulBaru: KelasItem = {
      id: "sumbang-" + Date.now(),
      judul: judulMateri,
      kategori: kategoriMateri || "Umum",
      level: "Pemula",
      durasi: "10 Menit",
      videoUrl: embedUrl,
      rangkuman: rangkumanMateri || "Materi sumbangan relawan.",
      kuis: {
        tanya: `Pahamkah kamu dengan materi ${judulMateri}?`,
        opsi: ["Paham", "Kurang paham"],
        jawabanBenar: 0,
        pembahasan: "Terima kasih telah belajar!",
      },
    };

    setDaftarJenjang((prev) =>
      prev.map((j) => (j.id === targetJenjang ? { ...j, kelas: [modulBaru, ...j.kelas] } : j))
    );
    tambahXP(100);
    setBerhasilSumbang(true);
    setTimeout(() => {
      setBerhasilSumbang(false);
      setMenuAktif("beranda");
      setJudulMateri("");
      setUrlMateri("");
      setRangkumanMateri("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Aurora Latar Belakang */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
      </div>

      {/* HEADER UTAMA */}
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
              { id: "transparansi", label: "Donasi", ikon: <ShieldCheck className="w-4 h-4" /> },
              { id: "sumbang", label: "Sumbang", ikon: <PlusCircle className="w-4 h-4" /> },
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
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{poinXP} XP</span>
            </div>
            <button
              onClick={() => {
                setInputNamaProfil(namaSiswa);
                setBukaModalProfil(true);
              }}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white px-3.5 py-2 rounded-full shadow-xs hover:opacity-95 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>{namaSiswa ? namaSiswa.split(" ")[0] : "Masuk"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL PROFIL */}
      <AnimatePresence>
        {bukaModalProfil && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-1">Profil Pelajar</h3>
              <p className="text-xs text-slate-500 mb-5">XP dan riwayat belajarmu tersimpan otomatis di perangkatmu.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!inputNamaProfil.trim()) return;
                  setNamaSiswa(inputNamaProfil);
                  localStorage.setItem("hibah_nama", inputNamaProfil);
                  setBukaModalProfil(false);
                  lemparkanKonfeti();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  value={inputNamaProfil}
                  onChange={(e) => setInputNamaProfil(e.target.value)}
                  placeholder="Masukkan namamu..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <div className="bg-slate-50 p-4 rounded-2xl flex justify-around text-center">
                  <div>
                    <div className="text-xs text-slate-500">Poin XP</div>
                    <div className="font-black text-lg text-amber-600">{poinXP} XP</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Selesai</div>
                    <div className="font-black text-lg text-emerald-600">{materiSelesai.length} Modul</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm">
                    Simpan
                  </button>
                  {namaSiswa && (
                    <button
                      type="button"
                      onClick={() => {
                        setNamaSiswa("");
                        localStorage.removeItem("hibah_nama");
                        setBukaModalProfil(false);
                      }}
                      className="px-4 py-3 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm"
                    >
                      Reset
                    </button>
                  )}
                  <button type="button" onClick={() => setBukaModalProfil(false)} className="px-4 py-3 bg-slate-100 rounded-xl text-sm font-bold">
                    Tutup
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* TAB TRYOUT */}
        {menuAktif === "tryout" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl mb-8 flex justify-between items-center">
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Simulasi Ujian</span>
                <h1 className="text-3xl font-black mt-2">Tryout & Latihan Berwaktu</h1>
                <p className="text-white/90 text-sm mt-1">Uji kemampuanmu dan raih poin XP tambahan!</p>
              </div>
              {sedangUjian && (
                <div className="bg-slate-900/80 px-5 py-3 rounded-2xl text-center">
                  <div className="text-xs text-amber-300 font-bold">Waktu Tersisa</div>
                  <div className="font-mono text-2xl font-black text-white">
                    {Math.floor(sisaWaktu / 60)}:{sisaWaktu % 60 < 10 ? "0" : ""}{sisaWaktu % 60}
                  </div>
                </div>
              )}
            </div>

            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
                <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-extrabold mb-2">Mulai Simulasi Ujian?</h2>
                <p className="text-slate-600 text-sm mb-6">Waktu pengerjaan 3 menit. Setiap jawaban benar bernilai +40 XP.</p>
                <button
                  onClick={() => {
                    setJawabanUserTryout({});
                    setSisaWaktu(180);
                    setUjianSelesai(false);
                    setSedangUjian(true);
                  }}
                  className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg inline-flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" /> Mulai Sekarang
                </button>
              </div>
            )}

            {sedangUjian && (
              <div className="space-y-6">
                {BANK_SOAL_TRYOUT.map((soal, idx) => (
                  <div key={soal.id} className="bg-white rounded-3xl p-6 border border-slate-200">
                    <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                      Soal #{idx + 1}
                    </span>
                    <h3 className="font-bold text-lg mt-2 mb-3">{soal.pertanyaan}</h3>
                    {soal.rumus && <div className="bg-slate-900 text-amber-300 font-mono text-xs p-3 rounded-xl mb-3">💡 {soal.rumus}</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {soal.opsi.map((pilihan, opsiIdx) => (
                        <button
                          key={opsiIdx}
                          onClick={() => setJawabanUserTryout((prev) => ({ ...prev, [idx]: opsiIdx }))}
                          className={`p-3.5 rounded-2xl border-2 text-left font-semibold text-sm transition ${
                            jawabanUserTryout[idx] === opsiIdx ? "border-indigo-600 bg-indigo-50 text-indigo-950" : "border-slate-200"
                          }`}
                        >
                          {pilihan}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={selesaikanTryout} className="w-full bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg">
                  Kumpulkan Jawaban
                </button>
              </div>
            )}

            {ujianSelesai && (
              <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center shadow-md">
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                <div className="text-3xl font-black mb-2">Skor Anda: {skorTryout} / 100</div>
                <button
                  onClick={() => {
                    setUjianSelesai(false);
                    setSedangUjian(false);
                  }}
                  className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl mt-4"
                >
                  Ulangi Tryout
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB FORUM PR */}
        {menuAktif === "forum" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-black mb-2">Forum Tanya PR & Diskusi</h1>
              <p className="text-emerald-50 text-sm">Tanyakan kesulitan tugasmu, relawan dan teman akan membantu!</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!tanyaBaru.trim()) return;
                setDaftarDiskusi([
                  {
                    id: "pr-" + Date.now(),
                    penanya: namaSiswa || "Pelajar",
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
              className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3"
            >
              <h3 className="font-bold flex items-center gap-2"><HelpCircle className="w-5 h-5 text-emerald-600" /> Ajukan Pertanyaan</h3>
              <input
                type="text"
                value={mapelBaru}
                onChange={(e) => setMapelBaru(e.target.value)}
                placeholder="Mata Pelajaran..."
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
              />
              <textarea
                rows={3}
                required
                value={tanyaBaru}
                onChange={(e) => setTanyaBaru(e.target.value)}
                placeholder="Tuliskan soal PRmu di sini..."
                className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                Kirim Pertanyaan (+20 XP)
              </button>
            </form>

            <div className="space-y-4">
              {daftarDiskusi.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200">
                  <div className="flex justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">{item.mapel} • {item.penanya}</span>
                    <span className="text-xs text-slate-400">{item.waktu}</span>
                  </div>
                  <p className="font-medium mb-3">{item.pertanyaan}</p>
                  <div className="space-y-2 pl-4 border-l-2 border-emerald-200 mb-3">
                    {item.jawaban.map((jwb, i) => (
                      <div key={i} className="bg-emerald-50 p-3 rounded-xl text-xs">
                        <span className="font-bold text-emerald-800">{jwb.penjawab}: </span>
                        <span>{jwb.isi}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={balasanInput[item.id] || ""}
                      onChange={(e) => setBalasanInput({ ...balasanInput, [item.id]: e.target.value })}
                      placeholder="Bantu jawab..."
                      className="flex-1 px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                    <button
                      onClick={() => {
                        const isi = balasanInput[item.id];
                        if (!isi) return;
                        setDaftarDiskusi(
                          daftarDiskusi.map((d) => (d.id === item.id ? { ...d, jawaban: [...d.jawaban, { penjawab: namaSiswa || "Relawan", isi }] } : d))
                        );
                        setBalasanInput({ ...balasanInput, [item.id]: "" });
                        tambahXP(35);
                      }}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Jawab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB DONASI / TRANSPARANSI */}
        {menuAktif === "transparansi" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 text-white text-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h1 className="text-3xl font-black mb-2">Transparansi Dana & Donasi Umat</h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
                Seluruh donasi sukarela digunakan murni untuk operasional server dan pembelian domain <strong>hibahilmu.id</strong>.
              </p>
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

        {/* TAB SUMBANG MATERI */}
        {menuAktif === "sumbang" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg border">
            <h2 className="text-2xl font-black mb-2">Sumbang Materi Pelajaran</h2>
            <p className="text-slate-600 text-sm mb-6">Bagikan video penjelasan dan dapatkan +100 XP!</p>
            {berhasilSumbang ? (
              <div className="bg-emerald-50 p-6 rounded-2xl text-center text-emerald-900 font-bold">Materi Berhasil Ditambahkan!</div>
            ) : (
              <form onSubmit={handleSumbangMateri} className="space-y-4">
                <select
                  value={targetJenjang}
                  onChange={(e) => setTargetJenjang(e.target.value)}
                  className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                >
                  {daftarJenjang.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={judulMateri}
                  onChange={(e) => setJudulMateri(e.target.value)}
                  placeholder="Judul Materi..."
                  className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                />
                <input
                  type="text"
                  required
                  value={urlMateri}
                  onChange={(e) => setUrlMateri(e.target.value)}
                  placeholder="Link YouTube (https://www.youtube.com/watch?v=...)"
                  className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                />
                <textarea
                  rows={3}
                  value={rangkumanMateri}
                  onChange={(e) => setRangkumanMateri(e.target.value)}
                  placeholder="Rangkuman materi..."
                  className="w-full p-3 bg-slate-50 border rounded-xl text-sm"
                />
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md">
                  Publikasikan (+100 XP)
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* TAB RUANG KELAS UTAMA */}
        {menuAktif === "beranda" && (
          <>
            {!jenjangAktif && !kelasAktif && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center max-w-4xl mx-auto mb-12">
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
                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-md`}>{jenjang.ikon}</div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}>{jenjang.kelas.length} Modul</span>
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
                    onClick={() => toggleSelesai(kelasAktif.id)}
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

                    {/* Catatan Pribadi */}
                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200">
                      <h3 className="font-bold mb-2 flex items-center gap-2"><FileEdit className="w-5 h-5 text-amber-600" /> Buku Catatan Pribadi</h3>
                      <textarea
                        rows={3}
                        value={catatanSiswa}
                        onChange={(e) => setCatatanSiswa(e.target.value)}
                        placeholder="Tulis catatanmu di sini..."
                        className="w-full p-3 bg-white border border-amber-300 rounded-xl text-sm mb-3"
                      />
                      <button onClick={simpanCatatanPribadi} className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">
                        Simpan Catatan
                      </button>
                      {statusSimpanCatatan && <span className="ml-3 text-xs text-emerald-700 font-bold">✔ Tersimpan!</span>}
                    </div>
                  </div>

                  {/* Kuis */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md sticky top-24">
                      <h3 className="font-bold text-base mb-4">{kelasAktif.kuis.tanya}</h3>
                      <div className="space-y-3 mb-4">
                        {kelasAktif.kuis.opsi.map((opsi, idx) => (
                          <button
                            key={idx}
                            onClick={() => cekJawabKuis(idx)}
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