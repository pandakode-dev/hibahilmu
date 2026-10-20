"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Sparkles,
  School,
  Compass,
  Code,
  PlayCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Trophy,
  Search,
  Flame,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

// 1. KAMUS TIPE DATA UNTUK TYPESCRIPT (Mencegah Error saat Build di Vercel)
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
  durasi: string;
  videoUrl: string;
  rangkuman: string;
  kuis: KuisItem;
}

interface JenjangItem {
  id: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  gradien: string;
  bgLembut: string;
  teksWarna: string;
  badge: string;
  ikon: React.ReactNode;
  kelas: KelasItem[];
}

// 2. DATA KURIKULUM CONTOH (TK SAMPAI KULIAH)
const DATA_JENJANG: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    bgLembut: "bg-rose-50/80 border-rose-200/80",
    teksWarna: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    ikon: <Sparkles className="w-7 h-7 text-white" />,
    kelas: [
      {
        id: "tk-1",
        judul: "Mengenal Angka & Berhitung Ceria 1-10",
        kategori: "Berhitung Dasar",
        durasi: "5 Menit",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
        rangkuman:
          "Mari belajar menghitung buah-buahan di sekitar kita! Angka 1 bentuknya seperti tiang listrik, angka 2 seperti bebek berenang, dan angka 3 seperti burung terbang di langit.",
        kuis: {
          tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi sekarang?",
          opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"],
          jawabanBenar: 1,
          pembahasan: "Hebat sekali! 2 apel ditambah 1 apel menjadi 3 apel yang segar!",
        },
      },
      {
        id: "tk-2",
        judul: "Petualangan Huruf Vokal (A, I, U, E, O)",
        kategori: "Membaca Permulaan",
        durasi: "6 Menit",
        videoUrl: "https://www.youtube.com/embed/bGetqbqDVaA",
        rangkuman:
          "Huruf vokal adalah huruf hidup yang membuat kata bisa dibaca. A untuk Ayam, I untuk Ikan, U untuk Udang, E untuk Elang, dan O untuk Obat!",
        kuis: {
          tanya: "Hewan 'IKAN' diawali oleh huruf apa ya?",
          opsi: ["Huruf A", "Huruf I", "Huruf U", "Huruf O"],
          jawabanBenar: 1,
          pembahasan: "Pintar! I-K-A-N diawali dengan huruf I.",
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
    bgLembut: "bg-amber-50/80 border-amber-200/80",
    teksWarna: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    ikon: <BookOpen className="w-7 h-7 text-white" />,
    kelas: [
      {
        id: "sd-1",
        judul: "Rahasia Perkalian Cepat & Pecahan",
        kategori: "Matematika SD",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/mvOkMYCygps",
        rangkuman:
          "Perkalian sebenarnya adalah penjumlahan yang berulang! Misalnya 4 x 3 artinya angka 3 dijumlahkan sebanyak 4 kali (3 + 3 + 3 + 3 = 12).",
        kuis: {
          tanya: "Hasil dari 6 dikali 4 sama dengan...",
          opsi: ["20", "22", "24", "28"],
          jawabanBenar: 2,
          pembahasan: "Tepat! 6 x 4 = 24 (6 + 6 + 6 + 6 = 24).",
        },
      },
      {
        id: "sd-2",
        judul: "Mengapa Langit Berwarna Biru & Proses Hujan",
        kategori: "Sains / IPA",
        durasi: "8 Menit",
        videoUrl: "https://www.youtube.com/embed/yT22Kk2_8h4",
        rangkuman:
          "Air laut menguap karena panas matahari (Evaporasi), berkumpul menjadi awan (Kondensasi), lalu turun kembali menjadi titik-titik hujan (Presipitasi).",
        kuis: {
          tanya: "Proses menguapnya air laut karena panas sinar matahari disebut...",
          opsi: ["Evaporasi", "Fotosintesis", "Reboisasi", "Imigrasi"],
          jawabanBenar: 0,
          pembahasan: "Benar! Evaporasi adalah proses penguapan air akibat suhu panas.",
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
    bgLembut: "bg-sky-50/80 border-sky-200/80",
    teksWarna: "text-blue-600",
    badge: "bg-sky-100 text-sky-800",
    ikon: <Compass className="w-7 h-7 text-white" />,
    kelas: [
      {
        id: "smp-1",
        judul: "Konsep Dasar Aljabar (Variabel x dan y)",
        kategori: "Matematika SMP",
        durasi: "12 Menit",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        rangkuman:
          "Aljabar menggunakan huruf (seperti x atau y) untuk mewakili angka yang belum kita ketahui nilainya. Jika x + 5 = 12, maka kita tinggal mengurangi 12 dengan 5 untuk menemukan nilai x.",
        kuis: {
          tanya: "Jika diketahui persamaan 2x + 4 = 14, berapakah nilai x?",
          opsi: ["x = 3", "x = 5", "x = 7", "x = 9"],
          jawabanBenar: 1,
          pembahasan: "Luar biasa! 2x = 14 - 4 -> 2x = 10 -> maka x = 10 dibagi 2 yaitu 5.",
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
    bgLembut: "bg-purple-50/80 border-purple-200/80",
    teksWarna: "text-purple-600",
    badge: "bg-purple-100 text-purple-800",
    ikon: <School className="w-7 h-7 text-white" />,
    kelas: [
      {
        id: "sma-1",
        judul: "Penalaran Kuantitatif & Logika UTBK SNBT",
        kategori: "Persiapan Kuliah",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman:
          "Kunci menaklukkan soal UTBK bukanlah menghafal ratusan rumus rumit, melainkan memahami pola logika deduktif dan manajemen waktu pengerjaan di bawah 1 menit per soal.",
        kuis: {
          tanya: "Semua mahasiswa rajin membaca. Sebagian yang rajin membaca memakai kacamata. Kesimpulan yang paling tepat adalah...",
          opsi: [
            "Semua mahasiswa memakai kacamata",
            "Sebagian mahasiswa mungkin memakai kacamata",
            "Yang memakai kacamata pasti bukan mahasiswa",
            "Semua jawaban salah",
          ],
          jawabanBenar: 1,
          pembahasan: "Tepat! Dalam silogisme logika, irisan sebagian menghasilkan kesimpulan partikular yang mungkin beririsan.",
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
    bgLembut: "bg-emerald-50/80 border-emerald-200/80",
    teksWarna: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikon: <GraduationCap className="w-7 h-7 text-white" />,
    kelas: [
      {
        id: "kuliah-1",
        judul: "Belajar Next.js & React dari Nol (Bersama Panda Kode)",
        kategori: "Teknik Informatika",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman:
          "React menggunakan konsep Component dan State. Dengan menggunakan Hook seperti useState, halaman web dapat memperbarui data secara instan tanpa perlu memuat ulang (reload) browser.",
        kuis: {
          tanya: "Hook apa yang digunakan di React/Next.js untuk menyimpan data yang bisa berubah-ubah di dalam komponen?",
          opsi: ["useRouter()", "useState()", "useDatabase()", "useStyle()"],
          jawabanBenar: 1,
          pembahasan: "Mantap! useState() adalah fondasi utama untuk membuat aplikasi web yang interaktif.",
        },
      },
    ],
  },
];

export default function AplikasiHibahIlmu() {
  // State yang sudah diberi Tipe Data TypeScript dengan benar
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [jawabanTerpilih, setJawabanTerpilih] = useState<number | null>(null);
  const [statusKuis, setStatusKuis] = useState<"benar" | "salah" | null>(null);
  const [poinPahalaBelajar, setPoinPahalaBelajar] = useState<number>(120);
  const [kataKunci, setKataKunci] = useState<string>("");

  const lemparkanKonfeti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const cekJawabanKuis = (indeksOpsi: number) => {
    if (!kelasAktif) return;
    setJawabanTerpilih(indeksOpsi);
    if (indeksOpsi === kelasAktif.kuis.jawabanBenar) {
      setStatusKuis("benar");
      setPoinPahalaBelajar((prev) => prev + 50);
      lemparkanKonfeti();
    } else {
      setStatusKuis("salah");
    }
  };

  const bukaKelas = (jenjang: JenjangItem, kelas: KelasItem) => {
    setJenjangAktif(jenjang);
    setKelasAktif(kelas);
    setJawabanTerpilih(null);
    setStatusKuis(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Latar Belakang Cahaya Aurora Warna-Warni yang Lembut & Elegan */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-emerald-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 bg-pink-300/25 rounded-full blur-3xl" />
      </div>

      {/* Navigasi Glassmorphism Atas */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div
            onClick={() => {
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              🐼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  HibahIlmu
                </span>
                <span className="text-[11px] uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  Gratis
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Karya Amal Jariyah oleh Panda Kode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Indikator Poin Semangat Belajar */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-3.5 py-1.5 rounded-full text-sm font-bold shadow-2xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{poinPahalaBelajar} XP</span>
            </div>

            <a
              href="#donasi"
              className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full shadow-md shadow-rose-500/20 hover:opacity-95 transition"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Donasi Sukarela</span>
            </a>
          </div>
        </div>
      </header>

      {/* Konten Dinamis Berdasarkan Navigasi Pengguna */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {/* TAMPILAN 1: BERANDA UTAMA */}
          {!jenjangAktif && !kelasAktif && (
            <motion.div
              key="beranda"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Banner */}
              <div className="text-center max-w-4xl mx-auto mb-14 pt-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 bg-white/90 border border-slate-200/90 shadow-xs px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pendidikan Berkualitas untuk Seluruh Anak Bangsa</span>
                </motion.div>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight">
                  Satu Platform Sejuta Ilmu,{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    100% Gratis Selamanya.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Dari mengenal huruf di bangku <strong>TK</strong>, menaklukkan ujian <strong>SD-SMA</strong>, hingga menguasai pemrograman di bangku <strong>Kuliah</strong>. Pilih jenjangmu dan mulai belajar dengan animasi interaktif sekarang!
                </p>

                {/* Kotak Pencarian Materi */}
                <div className="max-w-xl mx-auto relative mb-10">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    placeholder="Cari pelajaran (contoh: Matematika, Next.js, Berhitung)..."
                    className="w-full pl-12 pr-4 py-4 bg-white/95 border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base transition"
                  />
                </div>

                {/* Statistik Kepercayaan */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                  <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl">
                    <div className="font-black text-xl sm:text-2xl text-emerald-600">5 Jenjang</div>
                    <div className="text-xs text-slate-500">TK hingga Kuliah</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl">
                    <div className="font-black text-xl sm:text-2xl text-indigo-600">Rp 0</div>
                    <div className="text-xs text-slate-500">Tanpa Biaya Langganan</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl">
                    <div className="font-black text-xl sm:text-2xl text-rose-500">Interaktif</div>
                    <div className="text-xs text-slate-500">Video & Kuis Berhadiah</div>
                  </div>
                </div>
              </div>

              {/* Kartu Jenjang Warna-Warni Elegan */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Pilih Ruang Belajarmu
                  </h2>
                  <p className="text-sm text-slate-500">
                    Klik salah satu kartu di bawah untuk membuka materi & kuis interaktif
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DATA_JENJANG.map((jenjang, idx) => (
                  <motion.div
                    key={jenjang.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setJenjangAktif(jenjang)}
                    className="group cursor-pointer bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Pita Warna Atas */}
                    <div
                      className={`h-2 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-5 mt-2">
                        <div
                          className={`p-3.5 rounded-2xl bg-gradient-to-br ${jenjang.gradien} shadow-lg`}
                        >
                          {jenjang.ikon}
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${jenjang.badge}`}
                        >
                          {jenjang.kelas.length} Modul Tersedia
                        </span>
                      </div>

                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {jenjang.tagline}
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                        {jenjang.nama}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {jenjang.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-sm font-bold ${jenjang.teksWarna}`}>
                        Masuk Kelas Sekarang
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${jenjang.gradien} text-white group-hover:translate-x-1 transition`}
                      >
                        →
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAMPILAN 2: DAFTAR MATA PELAJARAN DI DALAM JENJANG */}
          {jenjangAktif && !kelasAktif && (
            <motion.div
              key="daftar-kelas"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <button
                onClick={() => setJenjangAktif(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs mb-6 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
              </button>

              {/* Header Jenjang */}
              <div
                className={`rounded-3xl p-8 text-white bg-gradient-to-r ${jenjangAktif.gradien} shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
              >
                <div>
                  <span className="bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {jenjangAktif.tagline}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-2">
                    Ruang Belajar {jenjangAktif.nama}
                  </h1>
                  <p className="text-white/90 max-w-2xl text-sm sm:text-base">
                    {jenjangAktif.deskripsi} Pilih materi di bawah untuk mulai menonton penjelasan dan mengerjakan latihan kuis.
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[140px]">
                  <Trophy className="w-8 h-8 mx-auto mb-1 text-amber-300" />
                  <div className="text-xs text-white/80">Hadiah per Modul</div>
                  <div className="font-black text-xl">+50 XP</div>
                </div>
              </div>

              {/* Daftar Modul Pelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jenjangAktif.kelas.map((item: KelasItem) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    onClick={() => bukaKelas(jenjangAktif, item)}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjangAktif.badge}`}>
                          {item.kategori}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ⏱️ {item.durasi}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-5">
                        {item.rangkuman}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <PlayCircle className="w-5 h-5" /> Mulai Belajar & Kuis
                      </span>
                      <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                        +50 XP
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAMPILAN 3: RUANG TONTON VIDEO MATERI & KUIS INTERAKTIF */}
          {kelasAktif && jenjangAktif && (
            <motion.div
              key="ruang-belajar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setKelasAktif(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs mb-6 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi {jenjangAktif.nama}
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Video & Rangkuman Materi */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-5 shadow-inner">
                      <iframe
                        src={kelasAktif.videoUrl}
                        title={kelasAktif.judul}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${jenjangAktif.badge}`}>
                      {kelasAktif.kategori}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-4">
                      {kelasAktif.judul}
                    </h1>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                      <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Rangkuman Penting:
                      </h4>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                        {kelasAktif.rangkuman}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Kuis Interaktif Berhadiah */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        <Award className="w-4 h-4" /> Tantangan Kuis
                      </span>
                      <span className="text-xs font-bold text-amber-600">+50 XP</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-5 leading-snug">
                      {kelasAktif.kuis.tanya}
                    </h3>

                    <div className="space-y-3 mb-6">
                      {kelasAktif.kuis.opsi.map((teksOpsi: string, idx: number) => {
                        const dipilih = jawabanTerpilih === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => cekJawabanKuis(idx)}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 font-semibold text-sm transition flex items-center justify-between ${
                              dipilih
                                ? statusKuis === "benar"
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                  : "border-rose-500 bg-rose-50 text-rose-900"
                                : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700"
                            }`}
                          >
                            <span>{teksOpsi}</span>
                            {dipilih && statusKuis === "benar" && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                            {dipilih && statusKuis === "salah" && (
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Umpan Balik Jawaban */}
                    {statusKuis === "benar" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm"
                      >
                        <div className="font-extrabold mb-1">🎉 Jawabanmu Benar! (+50 XP)</div>
                        <p>{kelasAktif.kuis.pembahasan}</p>
                      </motion.div>
                    )}

                    {statusKuis === "salah" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm"
                      >
                        <div className="font-extrabold mb-1">Belum Tepat, Ayo Coba Lagi! 💪</div>
                        <p>Baca kembali rangkuman materi di samping dan pilih jawaban lainnya ya.</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kotak Amal Jariyah & Donasi Sukarela */}
        <div
          id="donasi"
          className="mt-20 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full mb-4">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> Gerakan Sosial Tanpa Syarat
            </span>
            <h3 className="text-2xl sm:text-4xl font-black mb-4">
              Murni Pengabdian & Amal Jariyah
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Seluruh video, modul rangkuman, dan kuis di <strong>HibahIlmu</strong> dibuat agar tidak ada lagi anak Indonesia yang tertinggal pelajaran karena kendala biaya. Jika kamu ingin ikut bergotong-royong menjaga server & membeli domain <strong>hibahilmu.id</strong>, kamu bisa berdonasi sukarela.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  alert(
                    "Terima kasih orang baik! Nantinya tombol ini bisa kita sambungkan langsung ke link Saweria / Trakteer / QRIS milik Panda Kode."
                  )
                }
                className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold px-7 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition text-sm sm:text-base"
              >
                ☕ Dukung via QRIS / Saweria (Sukarela)
              </button>
              <a
                href="https://github.com/pandakode-dev/hibahilmu"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl transition text-sm sm:text-base flex items-center gap-2"
              >
                <Code className="w-5 h-5" /> Kontribusi Materi di GitHub
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-8 text-center text-xs sm:text-sm text-slate-500 mt-16">
        <p className="font-semibold text-slate-700">
          Dibangun dengan cinta oleh 🐼 <strong>Panda Kode</strong> • HibahIlmu.id
        </p>
        <p className="mt-1">
          Bebas diakses siapa saja, kapan saja, tanpa batas biaya.
        </p>
      </footer>
    </div>
  );
}