"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  ShieldAlert,
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
  FileSpreadsheet,
  Send,
  HelpCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  FolderArchive,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Table,
  FileText,
  Megaphone,
  Check,
  XCircle,
  Bell,
  Briefcase,
  ThumbsUp,
  Flag,
  Globe,
  Maximize2,
  AlertTriangle,
  MapPin,
  Calendar,
  Eye,
  Repeat,
} from "lucide-react";
import confetti from "canvas-confetti";

// ==========================================
// 1. INTERFACE & STRUKTUR DATA LENGKAP
// ==========================================
export type TipeSoal =
  | "pilihan_ganda"
  | "pilihan_jamak"
  | "benar_salah"
  | "isian_singkat"
  | "mencocokkan";

export interface PasanganCocok {
  kiri: string;
  kanan: string;
}

export interface KuisItem {
  id: string;
  tipe: TipeSoal;
  tanya: string;
  gambarSoalUrl?: string;
  opsi: string[];
  jawabanBenar: number;
  jawabanJamak?: number[];
  jawabanTeks?: string;
  pasangan?: PasanganCocok[];
  pembahasan: string;
  poin: number;
}

export interface SubJenjang {
  id: string;
  nama: string;
}

export interface KelasItem {
  id: string;
  subJenjangId: string;
  judul: string;
  pembuatId: string;
  pembuatNama: string;
  pembuatEmail: string;
  tanggalUpload: string;
  level: "Pemula" | "Menengah" | "Mahir";
  durasi: string;
  videoUrl: string;
  lampiranUrl?: string;
  rangkuman: string;
  rumusMatematika?: string;
  daftarKuis: KuisItem[];
}

export interface JenjangItem {
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

export type KategoriTes = "TPA" | "TOEP" | "TOEFL" | "UTBK" | "Akademik";

export interface SoalTryout {
  id: string;
  pertanyaan: string;
  gambarUrl?: string;
  rumus?: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

export interface PaketTryout {
  id: string;
  judul: string;
  kategoriTes: KategoriTes;
  jenjang: string;
  pembuatId: string;
  pembuatNama: string;
  alamatLokasi: string;
  jadwalUjian: string;
  durasiMenit: number;
  batasPercobaan: number;
  batasPelanggaran: number;
  wajibFullscreen: boolean;
  daftarSoal: SoalTryout[];
}

export interface RiwayatPercobaanTryout {
  id: string;
  paketId: string;
  userId: string;
  userNama: string;
  skor: number;
  jumlahPelanggaran: number;
  waktuSelesai: string;
  status Akhir: "Selesai Normal" | "Diskualifikasi (Auto-Submit)";
}

export interface JawabanDiskusi {
  id: string;
  penjawab: string;
  rolePenjawab: string;
  isi: string;
  waktu: string;
  upvotes: number;
  isBestAnswer?: boolean;
}

export interface DiskusiPR {
  id: string;
  penanya: string;
  jenjang: string;
  mapel: string;
  judul: string;
  pertanyaan: string;
  gambarUrl?: string;
  waktu: string;
  likes: number;
  solved: boolean;
  jawaban: JawabanDiskusi[];
}

export interface BiodataCV {
  fotoUrl: string;
  headline: string;
  bioSingkat: string;
  asalSekolahKampus: string;
  pendidikanTerakhir: string;
  skills: string[];
  pengalaman: string[];
  prestasi: string[];
  portfolioUrl: string;
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
  minatSubJenjang?: string[]; // Kelas/SubJenjang yang diikuti siswa
  cv?: BiodataCV;
}

export interface NotifikasiItem {
  id: string;
  targetUserId: string;
  judul: string;
  pesan: string;
  pengirim: string;
  namaKelas?: string;
  waktu: string;
  dibaca: boolean;
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
  pengumuman?: string;
  guruId: string;
  siswaIds: string[];
}

function bersihkanTagHtml(teksHtml: string): string {
  if (!teksHtml) return "";
  return teksHtml
    .split("<")
    .map((bagian, idx) => (idx === 0 ? bagian : bagian.substring(bagian.indexOf(">") + 1)))
    .join(" ");
}

// ==========================================
// 2. DATA AWAL & CONTOH TEMPLATE CSV / JSON
// ==========================================
const TEMPLATE_JSON_AKUN = JSON.stringify(
  [
    {
      nama: "Dewi Lestari, S.Pd",
      email: "dewi@hibahilmu.id",
      password: "123",
      role: "guru",
      infoTambahan: "Guru Bahasa Inggris & TOEFL",
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

const TEMPLATE_CSV_AKUN = `nama,email,password,role,infoTambahan
Dewi Lestari S.Pd,dewi.csv@hibahilmu.id,123,guru,Instruktur TOEFL & TOEP
Ahmad Fauzi,ahmad.csv@hibahilmu.id,123,siswa,Siswa Kelas 12 MIPA
Siti Nurhaliza,siti.csv@hibahilmu.id,123,siswa,Mahasiswi S1 Informatika`;

const TEMPLATE_CSV_KUIS = `tipe,tanya,opsi_atau_pasangan,kunci,pembahasan,poin,gambarUrl
pilihan_ganda,Ibukota provinsi Riau adalah...,Pekanbaru|Dumai|Padang|Medan,0,Pekanbaru adalah ibukota provinsi Riau,50,
pilihan_jamak,Pilih bilangan prima di bawah ini (Lebih dari 1),2|4|5|9,0|2,Angka 2 dan 5 adalah bilangan prima,60,
benar_salah,Air mendidih pada suhu 100 derajat Celcius di tekanan 1 atm.,Benar|Salah,0,Pada tekanan 1 atm titik didih air adalah 100 C,30,
isian_singkat,Berapakah hasil dari 15 ditambah 25?,,40,15 + 15 = 40,40,
mencocokkan,Cocokkan negara dengan ibukotanya!,Indonesia:Jakarta|Jepang:Tokyo|Mesir:Kairo,0,Pasangan ibukota negara,70,`;

const TEMPLATE_CSV_TRYOUT = `pertanyaan,opsi_dipisah_garis_tegak,indeks_kunci,pembahasan,rumus_atau_petunjuk
Sinonim dari kata KONVENSI adalah...,Kesepakatan|Pertentangan|Perubahan|Perdebatan,0,Konvensi berarti permufakatan atau kesepakatan.,TPA Verbal
Jika 2x + 5 = 19 maka nilai x adalah...,5|6|7|8,2,2x = 14 sehingga x = 7.,TPA Numerik
Choose the correct form: She ___ to campus every day.,go|goes|going|gone,1,Subjek tunggal She menggunakan kata kerja +es (goes).,TOEFL Structure`;

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
        pembuatId: "gru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "20 Okt 2026",
        level: "Pemula",
        durasi: "5 Menit",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA",
        rangkuman:
          "<h2>Belajar Berhitung Buah</h2><p>Mari belajar menghitung buah-buahan! Angka <b>1</b> seperti tiang listrik, angka <b>2</b> seperti bebek berenang.</p>",
        rumusMatematika: "2 Apel + 1 Apel = 3 Apel Segar",
        daftarKuis: [
          {
            id: "q-tk-1",
            tipe: "pilihan_ganda",
            tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi?",
            opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"],
            jawabanBenar: 1,
            pembahasan: "Hebat sekali! 2 apel ditambah 1 apel menjadi 3 apel!",
            poin: 50,
          },
        ],
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
        pembuatId: "gru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "19 Okt 2026",
        level: "Pemula",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/mvOkMYCygps",
        rangkuman:
          "<h3>Konsep Dasar Perkalian</h3><p><b>Perkalian</b> adalah penjumlahan yang berulang! Digunakan juga untuk menghitung luas persegi panjang dan segitiga.</p>",
        rumusMatematika: "Luas Segitiga = 1/2 x Alas (a) x Tinggi (t)",
        daftarKuis: [
          {
            id: "q-sd-1",
            tipe: "pilihan_ganda",
            tanya: "Sebuah segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapakah luasnya?",
            opsi: ["10 cm2", "12 cm2", "24 cm2", "18 cm2"],
            jawabanBenar: 1,
            pembahasan: "Tepat! Luas = 1/2 x 6 x 4 = 12 cm2.",
            poin: 50,
          },
        ],
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
    kelas: [],
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
        pembuatId: "gru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "21 Okt 2026",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        lampiranUrl: "https://drive.google.com",
        rangkuman:
          "<h3>Hukum Gerak Newton</h3><p>Gaya berbanding lurus dengan massa dan percepatan benda. <b>Energi kinetik</b> bergantung pada kuadrat kecepatan benda tersebut.</p>",
        rumusMatematika: "Hukum II Newton: F = m . a\nEnergi Kinetik: Ek = 1/2 . m . v^2",
        daftarKuis: [
          {
            id: "q-sma-1",
            tipe: "pilihan_ganda",
            tanya: "Sebuah benda bermassa 4 kg bergerak dengan kecepatan 3 m/s. Berapakah Energi Kinetiknya (Ek)?",
            opsi: ["6 Joule", "12 Joule", "18 Joule", "36 Joule"],
            jawabanBenar: 2,
            pembahasan: "Tepat! Ek = 1/2 . 4 . (3^2) = 2 . 9 = 18 Joule.",
            poin: 50,
          },
          {
            id: "q-sma-2",
            tipe: "mencocokkan",
            tanya: "Pasangkan Hukum Newton dan konsep fisika berikut dengan rumusnya!",
            opsi: [],
            jawabanBenar: 0,
            pasangan: [
              { kiri: "Hukum II Newton", kanan: "F = m . a" },
              { kiri: "Momentum Linier", kanan: "p = m . v" },
              { kiri: "Energi Potensial", kanan: "Ep = m . g . h" },
            ],
            pembahasan: "Gaya = m.a, Momentum = m.v, Energi Potensial = m.g.h.",
            poin: 75,
          },
        ],
      },
    ],
  },
  {
    id: "kuliah",
    nama: "Kuliah & Karier (TPA / TOEFL / IT)",
    tagline: "Keahlian Profesional, Bahasa & Akademik",
    deskripsi: "Pemrograman Web, AI, Big Data, Persiapan TPA Pascasarjana, TOEP & TOEFL.",
    gradien: "from-emerald-500 via-teal-600 to-cyan-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikonNama: "graduation",
    subJenjang: [
      { id: "pt-ti", nama: "S1 Teknik Informatika" },
      { id: "pt-si", nama: "S1 Sistem Informasi" },
      { id: "pt-tpa", nama: "Persiapan TPA Bappenas / Pascasarjana" },
      { id: "pt-toefl", nama: "Persiapan TOEFL ITP & TOEP" },
    ],
    kelas: [
      {
        id: "materi-kuliah-1",
        subJenjangId: "pt-ti",
        judul: "Arsitektur Big Data: Apache Kafka, Flume & Sqoop",
        pembuatId: "adm-1",
        pembuatNama: "Admin Panda Kode",
        pembuatEmail: "admin@hibahilmu.id",
        tanggalUpload: "21 Okt 2026",
        level: "Mahir",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman:
          "<p>Dalam ekosistem <b>Big Data</b> telekomunikasi, <b>Apache Kafka</b> berfungsi sebagai message broker real-time, <b>Apache Flume</b> untuk pengumpulan log, dan <b>Apache Sqoop</b> untuk transfer data RDBMS ke HDFS.</p>",
        daftarKuis: [
          {
            id: "q-pt-1",
            tipe: "pilihan_ganda",
            tanya: "Manakah komponen Apache yang khusus dirancang untuk mentransfer data antara database relasional (RDBMS) dan Hadoop HDFS?",
            opsi: ["Apache Kafka", "Apache Flume", "Apache Sqoop", "Apache Spark"],
            jawabanBenar: 2,
            pembahasan: "Sqoop (SQL-to-Hadoop) dirancang untuk transfer data RDBMS ke HDFS.",
            poin: 60,
          },
        ],
      },
    ],
  },
];

const PAKET_TRYOUT_AWAL: PaketTryout[] = [
  {
    id: "pkt-tpa-1",
    judul: "Simulasi Akbar TPA (Tes Potensi Akademik) Nasional",
    kategoriTes: "TPA",
    jenjang: "Kuliah & Umum",
    pembuatId: "gru-1",
    pembuatNama: "Bapak Budi Santoso, M.Pd",
    alamatLokasi: "Gedung CBT Center Lt. 2 Pekanbaru / Online Proctoring",
    jadwalUjian: "2026-10-25 09:00 WIB",
    durasiMenit: 15,
    batasPercobaan: 2,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "tpa-1",
        pertanyaan: "SINONIM: Kata 'EKLEKTIK' memiliki arti yang paling dekat dengan...",
        rumus: "Subtes Kemampuan Verbal TPA",
        opsi: ["Memilih yang terbaik dari berbagai sumber", "Sangat kuno", "Bersifat memaksa", "Tidak beraturan"],
        jawabanBenar: 0,
        pembahasan: "Eklektik berarti bersifat memilih yang terbaik dari berbagai sumber atau metode.",
      },
      {
        id: "tpa-2",
        pertanyaan: "DERET ANGKA: 3, 6, 12, 24, 48, ... Berapakah angka selanjutnya?",
        rumus: "Pola rasio dikali 2 (x2)",
        opsi: ["72", "84", "96", "108"],
        jawabanBenar: 2,
        pembahasan: "Setiap suku dikalikan 2. Maka 48 x 2 = 96.",
      },
      {
        id: "tpa-3",
        pertanyaan: "SILOGISME: Semua mahasiswa wajib memiliki kartu perpustakaan. Sebagian mahasiswa menyukai diskusi ilmiah. Kesimpulannya adalah...",
        opsi: [
          "Sebagian mahasiswa yang menyukai diskusi ilmiah wajib memiliki kartu perpustakaan.",
          "Semua yang memiliki kartu perpustakaan menyukai diskusi.",
          "Mahasiswa yang tidak suka diskusi tidak punya kartu.",
          "Tidak dapat ditarik kesimpulan.",
        ],
        jawabanBenar: 0,
        pembahasan: "Karena semua mahasiswa wajib punya kartu, maka sebagian mahasiswa yang suka diskusi pasti wajib punya kartu.",
      },
    ],
  },
  {
    id: "pkt-toefl-1",
    judul: "Diagnostic Test TOEFL ITP & TOEP (Structure & Written Expression)",
    kategoriTes: "TOEFL",
    jenjang: "SMA & Kuliah",
    pembuatId: "adm-1",
    pembuatNama: "Admin Panda Kode",
    alamatLokasi: "Laboratorium Bahasa Terpadu R.104 / Online Fullscreen",
    jadwalUjian: "2026-10-28 13:30 WIB",
    durasiMenit: 10,
    batasPercobaan: 1,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "tf-1",
        pertanyaan: "The North Pole _____ a latitude of 90 degrees north.",
        rumus: "Subject-Verb Agreement (Singular Subject)",
        opsi: ["has", "is having", "which is having", "it has"],
        jawabanBenar: 0,
        pembahasan: "Kalimat membutuhkan kata kerja tunggal (has) untuk subjek tunggal 'The North Pole'.",
      },
      {
        id: "tf-2",
        pertanyaan: "_____ heated by solar energy have special collectors on the roofs to trap sunlight.",
        rumus: "Reduced Adjective Clause (Passive)",
        opsi: ["A home is", "Homes are", "A home", "Homes"],
        jawabanBenar: 3,
        pembahasan: "Kata kerja utamanya adalah 'have' (jamak), sehingga butuh subjek jamak 'Homes' diikuti participle 'heated'.",
      },
    ],
  },
  {
    id: "pkt-utbk-1",
    judul: "Tryout UTBK SNBT Penalaran Matematika & Fisika",
    kategoriTes: "UTBK",
    jenjang: "SMA / SMK",
    pembuatId: "gru-1",
    pembuatNama: "Bapak Budi Santoso, M.Pd",
    alamatLokasi: "Aula Utama SMAN 1 / Online CBT",
    jadwalUjian: "2026-11-02 08:00 WIB",
    durasiMenit: 15,
    batasPercobaan: 3,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "ut-1",
        pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?",
        rumus: "Substitusikan x = 4 ke dalam fungsi f(x)",
        opsi: ["5", "7", "12", "17"],
        jawabanBenar: 1,
        pembahasan: "f(4) = 3(4) - 5 = 12 - 5 = 7.",
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
    infoTambahan: "Founder & Super Admin HibahIlmu",
    waktuDaftar: "Permanen",
    aksesMengajar: ["sma-11-ipa", "pt-ti", "pt-tpa", "pt-toefl"],
    minatSubJenjang: ["pt-ti", "pt-tpa"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: "System Architect & EdTech Founder",
      bioSingkat: "Mengembangkan ekosistem pendidikan terbuka gratis yang terverifikasi dan akuntabel.",
      asalSekolahKampus: "Program Pascasarjana MTTK",
      pendidikanTerakhir: "Magister Teknik",
      skills: ["Next.js", "TypeScript", "Big Data", "Reinforcement Learning"],
      pengalaman: ["Lead Developer HibahIlmu (2025 - Sekarang)"],
      prestasi: ["Inovator Pendidikan Digital Terbaik 2026"],
      portfolioUrl: "https://hibahilmu.id",
    },
  },
  {
    id: "gru-1",
    nama: "Bapak Budi Santoso, M.Pd",
    email: "guru@hibahilmu.id",
    password: "123",
    role: "guru",
    status: "approved",
    infoTambahan: "Guru Matematika, Fisika & Instruktur TPA",
    waktuDaftar: "Kemarin, 09:00",
    aksesMengajar: ["sma-10", "sma-11-ipa", "sma-12-ipa", "sd-4", "pt-tpa", "pt-toefl"],
    minatSubJenjang: ["sma-11-ipa"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      headline: "Pendidik Fisika & Instruktur TPA/UTBK",
      bioSingkat: "Berpengalaman 10 tahun mengajar Fisika Mekanika dan menyusun modul TPA.",
      asalSekolahKampus: "SMAN 1 Nusantara",
      pendidikanTerakhir: "S2 Pendidikan Fisika (M.Pd)",
      skills: ["Fisika Mekanika", "TPA Numerik", "Kurikulum Merdeka"],
      pengalaman: ["Guru Fisika SMAN 1 (2016 - Sekarang)"],
      prestasi: ["Guru Berprestasi Tingkat Nasional 2024"],
      portfolioUrl: "https://linkedin.com",
    },
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
    minatSubJenjang: ["sma-11-ipa", "pt-toefl"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      headline: "Siswi Kelas 11 MIPA & Penggemar Sains",
      bioSingkat: "Fokus mengikuti kelas 11 MIPA dan persiapan TOEFL.",
      asalSekolahKampus: "SMAN 2 Harapan Bangsa",
      pendidikanTerakhir: "SMA Kelas 11 MIPA",
      skills: ["Matematika", "Fisika Dasar", "English TOEFL"],
      pengalaman: ["Ketua Klub Sains Sekolah (2025 - Sekarang)"],
      prestasi: ["Juara 1 Kuis Sains Kabupaten 2025"],
      portfolioUrl: "https://github.com",
    },
  },
];

const NOTIF_AWAL: NotifikasiItem[] = [
  {
    id: "notif-1",
    targetUserId: "sis-1",
    judul: "Jadwal Tryout TPA & Fisika",
    pesan: "Simulasi Tryout menggunakan sistem Fullscreen Anti-Cheat. Dilarang menekan Alt+Tab saat ujian!",
    pengirim: "Bapak Budi Santoso, M.Pd",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    waktu: "Hari ini, 09:00",
    dibaca: false,
  },
];

const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "08:30 WIB",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mengunggah modul materi baru pada jenjang SMA (Terverifikasi)",
    kategori: "materi",
  },
];

const KELOMPOK_AWAL: KelompokBelajar[] = [
  {
    id: "rombel-1",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    pengumuman: "Jangan lupa kerjakan Tryout CBT dengan mode Fullscreen!",
    guruId: "gru-1",
    siswaIds: ["sis-1"],
  },
];

// ==========================================
// KOMPONEN RICH TEXT EDITOR PRO
// ==========================================
const RichTextEditorPro = ({
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

  const eksekusiCommand = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const sisipkanHtml = (html: string) => {
    document.execCommand("insertHTML", false, html);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const tambahLink = () => {
    const url = prompt("Masukkan URL Hyperlink (contoh: https://hibahilmu.id):");
    if (url) eksekusiCommand("createLink", url);
  };

  const tambahGambar = () => {
    const url = prompt("Masukkan URL Gambar (https://...):");
    if (url) {
      sisipkanHtml(
        `<img src="${url}" alt="Gambar Materi" style="max-width:100%; border-radius: 12px; margin: 10px 0;" /><p><br/></p>`
      );
    }
  };

  const tambahTabel = () => {
    const tabelHtml = `
      <table style="width:100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Konsep</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Penjelasan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Poin 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Detail 1</td>
          </tr>
        </tbody>
      </table><p><br/></p>
    `;
    sisipkanHtml(tabelHtml);
  };

  const tambahKotakInfo = () => {
    const boxHtml = `
      <div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 12px 16px; border-radius: 8px; margin: 12px 0; color: #1e1b4b;">
        <b>Catatan Penting:</b> Tuliskan rangkuman inti di sini...
      </div><p><br/></p>
    `;
    sisipkanHtml(boxHtml);
  };

  return (
    <div className="border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <div className="bg-slate-100 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
        <select
          onChange={(e) => eksekusiCommand("formatBlock", e.target.value)}
          defaultValue="P"
          className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 mr-1"
        >
          <option value="P">Paragraf</option>
          <option value="H2">Heading Utama (H2)</option>
          <option value="H3">Sub-Heading (H3)</option>
          <option value="PRE">Blok Kode</option>
        </select>

        <button
          type="button"
          onClick={() => eksekusiCommand("bold")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Tebal"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("italic")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Miring"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("underline")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Garis Bawah"
        >
          <Underline size={15} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("justifyLeft")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Rata Kiri"
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyCenter")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Rata Tengah"
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyRight")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Rata Kanan"
        >
          <AlignRight size={15} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("insertUnorderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("insertOrderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Numbering List"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("hiliteColor", "#fef08a")}
          className="px-2 py-1 bg-yellow-200 rounded-lg text-xs font-bold text-slate-800"
        >
          Stabilo
        </button>
        <button
          type="button"
          onClick={tambahLink}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Sisipkan Link"
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          onClick={tambahGambar}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Sisipkan Gambar via Link"
        >
          <ImageIcon size={15} />
        </button>
        <button
          type="button"
          onClick={tambahTabel}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Sisipkan Tabel"
        >
          <Table size={15} />
        </button>
        <button
          type="button"
          onClick={tambahKotakInfo}
          className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold flex items-center gap-1"
        >
          <Quote size={13} /> Callout
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="p-4 min-h-[160px] max-h-[340px] overflow-y-auto text-sm outline-none prose prose-slate max-w-none"
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
  const [hanyaMateriDiikuti, setHanyaMateriDiikuti] = useState<boolean>(true);

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [adminModeGuru, setAdminModeGuru] = useState<boolean>(false); // Sakelar Admin buka Mode Guru
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);
  const [daftarKelompok, setDaftarKelompok] = useState<KelompokBelajar[]>(KELOMPOK_AWAL);

  // State Notifikasi & Kotak Masuk
  const [daftarNotifikasi, setDaftarNotifikasi] = useState<NotifikasiItem[]>(NOTIF_AWAL);
  const [bukaMenuNotif, setBukaMenuNotif] = useState<boolean>(false);

  // State Siswa & Jawaban 5 Tipe Kuis
  const [poinXP, setPoinXP] = useState<number>(150);
  const [materiSelesai, setMateriSelesai] = useState<string[]>([]);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState<boolean>(false);

  const [jawabanPilihanSiswa, setJawabanPilihanSiswa] = useState<{ [kuisId: string]: number }>({});
  const [jawabanJamakSiswa, setJawabanJamakSiswa] = useState<{ [kuisId: string]: number[] }>({});
  const [jawabanTeksSiswa, setJawabanTeksSiswa] = useState<{ [kuisId: string]: string }>({});
  const [jawabanCocokSiswa, setJawabanCocokSiswa] = useState<{
    [kuisId: string]: { [idxKiri: number]: string };
  }>({});
  const [statusKuisSiswa, setStatusKuisSiswa] = useState<{
    [kuisId: string]: "benar" | "salah" | null;
  }>({});

  // State Tryout Pro (CBT, Anti-Cheat Fullscreen & Alt-Tab Detector)
  const [daftarPaketTryout, setDaftarPaketTryout] = useState<PaketTryout[]>(PAKET_TRYOUT_AWAL);
  const [riwayatTryout, setRiwayatTryout] = useState<RiwayatPercobaanTryout[]>([]);
  const [filterKategoriTryout, setFilterKategoriTryout] = useState<string>("Semua");
  const [paketTryoutAktif, setPaketTryoutAktif] = useState<PaketTryout | null>(null);

  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(300);
  const [indeksSoalTryoutAktif, setIndeksSoalTryoutAktif] = useState<number>(0);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [raguRaguTryout, setRaguRaguTryout] = useState<number[]>([]);
  const [skorTryout, setSkorTryout] = useState<number>(0);
  const [jumlahPelanggaranUjian, setJumlahPelanggaranUjian] = useState<number>(0);
  const [pesanPeringatanCheat, setPesanPeringatanCheat] = useState<string>("");

  // State Guru Merancang Paket Tryout Baru (TPA, TOEP, TOEFL, UTBK)
  const [judulTryoutBaru, setJudulTryoutBaru] = useState("");
  const [kategoriTesBaru, setKategoriTesBaru] = useState<KategoriTes>("TPA");
  const [jenjangTryoutBaru, setJenjangTryoutBaru] = useState("Kuliah & Umum");
  const [alamatTryoutBaru, setAlamatTryoutBaru] = useState(
    "Gedung CBT Center R.101 / Online Fullscreen Proctoring"
  );
  const [jadwalTryoutBaru, setJadwalTryoutBaru] = useState("2026-11-10 09:00 WIB");
  const [durasiTryoutBaru, setDurasiTryoutBaru] = useState<number>(30);
  const [batasCobaTryoutBaru, setBatasCobaTryoutBaru] = useState<number>(2);
  const [soalTryoutDraft, setSoalTryoutDraft] = useState<SoalTryout[]>([
    {
      id: "td-1",
      pertanyaan: "",
      rumus: "",
      opsi: ["", "", "", ""],
      jawabanBenar: 0,
      pembahasan: "",
    },
  ]);
  const [teksCsvTryout, setTeksCsvTryout] = useState("");

  // State Forum PR & Diskusi Pro
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([
    {
      id: "pr-1",
      penanya: "Aisyah Putri",
      jenjang: "SMA / SMK",
      mapel: "Fisika",
      judul: "Cara membedakan Hukum I dan Hukum II Newton",
      pertanyaan:
        "Halo Pak Budi dan teman-teman, bagaimana cara cepat menentukan kapan kita memakai Sigma F = 0 dan Sigma F = m.a pada soal katrol?",
      waktu: "1 jam lalu",
      likes: 5,
      solved: true,
      jawaban: [
        {
          id: "jwb-1",
          penjawab: "Bapak Budi Santoso, M.Pd",
          rolePenjawab: "guru",
          isi: "Jika sistem katrol diam atau bergerak dengan kecepatan tetap (konstan), gunakan Sigma F = 0. Jika sistem bergerak dipercepat, gunakan Sigma F = m . a.",
          waktu: "45 menit lalu",
          upvotes: 4,
          isBestAnswer: true,
        },
      ],
    },
  ]);
  const [filterMapelForum, setFilterMapelForum] = useState<string>("Semua");
  const [cariForum, setCariForum] = useState<string>("");
  const [judulTanyaBaru, setJudulTanyaBaru] = useState<string>("");
  const [jenjangTanyaBaru, setJenjangTanyaBaru] = useState<string>("SMA / SMK");
  const [mapelBaru, setMapelBaru] = useState<string>("Matematika");
  const [tanyaBaru, setTanyaBaru] = useState<string>("");
  const [gambarTanyaBaru, setGambarTanyaBaru] = useState<string>("");
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
  const [minatReg, setMinatReg] = useState<string[]>(["sma-11-ipa"]);

  // State Admin
  const [adminTabAktif, setAdminTabAktif] = useState<
    "akun" | "kategori" | "rombel" | "log" | "cv"
  >("akun");
  const [modalAdminAkun, setModalAdminAkun] = useState<boolean>(false);
  const [idEditAkun, setIdEditAkun] = useState<string | null>(null);
  const [namaFormAdmin, setNamaFormAdmin] = useState("");
  const [emailFormAdmin, setEmailFormAdmin] = useState("");
  const [passFormAdmin, setPassFormAdmin] = useState("");
  const [roleFormAdmin, setRoleFormAdmin] = useState<"admin" | "guru" | "siswa">("siswa");
  const [statusFormAdmin, setStatusFormAdmin] = useState<"approved" | "pending" | "rejected">(
    "approved"
  );
  const [infoFormAdmin, setInfoFormAdmin] = useState("");
  const [aksesMengajarForm, setAksesMengajarForm] = useState<string[]>([]);
  const [filterLog, setFilterLog] = useState<string>("semua");

  const [selectedAkunIds, setSelectedAkunIds] = useState<string[]>([]);
  const [modalImportAkun, setModalImportAkun] = useState<boolean>(false);
  const [modeImportAkunFormat, setModeImportAkunFormat] = useState<"csv" | "json">("csv");
  const [teksImportAkun, setTeksImportAkun] = useState<string>("");
  const [notifImport, setNotifImport] = useState<string>("");

  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // State Admin Rombel
  const [namaKelompokAdmin, setNamaKelompokAdmin] = useState("");
  const [guruKelompokAdmin, setGuruKelompokAdmin] = useState("");
  const [searchSiswaAdmin, setSearchSiswaAdmin] = useState<{ [key: string]: string }>({});

  // State Guru Buat Materi, Tryout & Multi-Soal Kuis
  const [guruTabAktif, setGuruTabAktif] = useState<"materi" | "tryout_builder" | "kelas" | "cv">(
    "materi"
  );
  const [siswaTabAktif, setSiswaTabAktif] = useState<"kelas" | "minat" | "cv">("kelas");

  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [levelMateri, setLevelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [videoMateri, setVideoMateri] = useState("");
  const [lampiranMateri, setLampiranMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [rumusMateri, setRumusMateri] = useState("");
  const [notifGuru, setNotifGuru] = useState(false);

  // State Builder Daftar Kuis di Studio Guru
  const [daftarKuisDraft, setDaftarKuisDraft] = useState<KuisItem[]>([
    {
      id: "draft-1",
      tipe: "pilihan_ganda",
      tanya: "",
      gambarSoalUrl: "",
      opsi: ["", "", "", ""],
      jawabanBenar: 0,
      jawabanJamak: [0, 1],
      jawabanTeks: "",
      pasangan: [
        { kiri: "", kanan: "" },
        { kiri: "", kanan: "" },
      ],
      pembahasan: "",
      poin: 50,
    },
  ]);
  const [modalImportKuis, setModalImportKuis] = useState(false);
  const [modeImportKuisFormat, setModeImportKuisFormat] = useState<"csv" | "json">("csv");
  const [teksImportKuis, setTeksImportKuis] = useState("");

  // State Guru Kelola Kelas & Kirim Pengumuman ke Murid
  const [namaKelompokBaru, setNamaKelompokBaru] = useState("");
  const [pengumumanBaru, setPengumumanBaru] = useState("");
  const [inputPengumumanKelas, setInputPengumumanKelas] = useState<{ [kelId: string]: string }>({});
  const [searchSiswaGuru, setSearchSiswaGuru] = useState<{ [key: string]: string }>({});

  // State Edit Biodata & CV User
  const [cvFoto, setCvFoto] = useState("");
  const [cvHeadline, setCvHeadline] = useState("");
  const [cvBio, setCvBio] = useState("");
  const [cvSekolah, setCvSekolah] = useState("");
  const [cvPendidikan, setCvPendidikan] = useState("");
  const [cvSkillsTeks, setCvSkillsTeks] = useState("");
  const [cvPengalamanTeks, setCvPengalamanTeks] = useState("");
  const [cvPrestasiTeks, setCvPrestasiTeks] = useState("");
  const [cvPortfolio, setCvPortfolio] = useState("");
  const [notifSimpanCV, setNotifSimpanCV] = useState(false);

  useEffect(() => {
    const savedXP = localStorage.getItem("hibah_xp");
    const savedSelesai = localStorage.getItem("hibah_selesai");
    const savedAkunList = localStorage.getItem("hibah_daftar_akun");
    const savedUserAktif = localStorage.getItem("hibah_user_aktif");
    const savedLogs = localStorage.getItem("hibah_log_aktivitas");
    const savedStruktur = localStorage.getItem("hibah_struktur");
    const savedKelompok = localStorage.getItem("hibah_kelompok");
    const savedNotif = localStorage.getItem("hibah_notifikasi");
    const savedPaketTo = localStorage.getItem("hibah_paket_tryout");
    const savedRiwayatTo = localStorage.getItem("hibah_riwayat_tryout");

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
    if (savedStruktur) setDaftarJenjang(JSON.parse(savedStruktur));
    if (savedKelompok) setDaftarKelompok(JSON.parse(savedKelompok));
    if (savedNotif) setDaftarNotifikasi(JSON.parse(savedNotif));
    if (savedPaketTo) setDaftarPaketTryout(JSON.parse(savedPaketTo));
    if (savedRiwayatTo) setRiwayatTryout(JSON.parse(savedRiwayatTo));
  }, []);

  useEffect(() => {
    if (userLogin) {
      const dataCv = userLogin.cv || {
        fotoUrl: "",
        headline: userLogin.infoTambahan || "",
        bioSingkat: "",
        asalSekolahKampus: "",
        pendidikanTerakhir: "",
        skills: [],
        pengalaman: [],
        prestasi: [],
        portfolioUrl: "",
      };
      setCvFoto(dataCv.fotoUrl);
      setCvHeadline(dataCv.headline);
      setCvBio(dataCv.bioSingkat);
      setCvSekolah(dataCv.asalSekolahKampus);
      setCvPendidikan(dataCv.pendidikanTerakhir);
      setCvSkillsTeks((dataCv.skills || []).join(", "));
      setCvPengalamanTeks((dataCv.pengalaman || []).join("\n"));
      setCvPrestasiTeks((dataCv.prestasi || []).join("\n"));
      setCvPortfolio(dataCv.portfolioUrl);
    }
  }, [userLogin]);

  // ==========================================
  // SENSOR ANTI-CHEAT UJIAN (DETEKSI ALT+TAB / BLUR / EXIT FULLSCREEN)
  // ==========================================
  useEffect(() => {
    if (!sedangUjian || !paketTryoutAktif) return;

    const catatPelanggaran = (alasan: string) => {
      setJumlahPelanggaranUjian((prev) => {
        const totalBaru = prev + 1;
        const batas = paketTryoutAktif.batasPelanggaran || 3;
        setPesanPeringatanCheat(
          `PERINGATAN PELANGGARAN (${totalBaru}/${batas}): Terdeteksi ${alasan}! Jangan keluar dari layar ujian.`
        );
        if (totalBaru >= batas) {
          selesaikanTryoutOtomatis(totalBaru, "Diskualifikasi (Auto-Submit)");
        }
        return totalBaru;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        catatPelanggaran("pindah tab browser / minimize jendela");
      }
    };

    const handleWindowBlur = () => {
      catatPelanggaran("menekan Alt+Tab / berpindah aplikasi");
    };

    const handleFullscreenChange = () => {
      if (paketTryoutAktif.wajibFullscreen && !document.fullscreenElement) {
        catatPelanggaran("keluar dari mode layar penuh (Fullscreen)");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [sedangUjian, paketTryoutAktif, jawabanUserTryout]);

  // Timer Hitung Mundur Tryout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) {
      interval = setInterval(() => setSisaWaktu((p) => p - 1), 1000);
    } else if (sisaWaktu === 0 && sedangUjian) {
      selesaikanTryoutOtomatis(jumlahPelanggaranUjian, "Selesai Normal");
    }
    return () => clearInterval(interval);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  useEffect(() => {
    if (kelasAktif) {
      setCatatanSiswa(localStorage.getItem(`catatan_${kelasAktif.id}`) || "");
      setJawabanPilihanSiswa({});
      setJawabanJamakSiswa({});
      setJawabanTeksSiswa({});
      setJawabanCocokSiswa({});
      setStatusKuisSiswa({});
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

  const kirimNotifikasiKeUser = (
    targetIds: string[],
    judul: string,
    pesan: string,
    pengirim: string,
    namaKelas?: string
  ) => {
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const itemBaruList: NotifikasiItem[] = targetIds.map((uid, idx) => ({
      id: "notif-" + Date.now() + "-" + idx,
      targetUserId: uid,
      judul,
      pesan,
      pengirim,
      namaKelas,
      waktu: `${jam} WIB`,
      dibaca: false,
    }));
    setDaftarNotifikasi((prev) => {
      const gabungan = [...itemBaruList, ...(prev || [])];
      localStorage.setItem("hibah_notifikasi", JSON.stringify(gabungan));
      return gabungan;
    });
  };

  const tandaiSemuaNotifDibaca = () => {
    if (!userLogin) return;
    const update = daftarNotifikasi.map((n) =>
      n.targetUserId === userLogin.id || n.targetUserId === "ALL" ? { ...n, dibaca: true } : n
    );
    setDaftarNotifikasi(update);
    localStorage.setItem("hibah_notifikasi", JSON.stringify(update));
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

  // --- FUNGSI PILIH MINAT KELAS SISWA ---
  const toggleMinatSubJenjangSiswa = (subId: string) => {
    if (!userLogin) return;
    const minatSaatIni = userLogin.minatSubJenjang || [];
    const minatBaru = minatSaatIni.includes(subId)
      ? minatSaatIni.filter((id) => id !== subId)
      : [...minatSaatIni, subId];

    const userUpdate: AkunPengguna = { ...userLogin, minatSubJenjang: minatBaru };
    const daftarUpdate = daftarAkun.map((a) => (a.id === userLogin.id ? userUpdate : a));
    setDaftarAkun(daftarUpdate);
    setUserLogin(userUpdate);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarUpdate));
    localStorage.setItem("hibah_user_aktif", JSON.stringify(userUpdate));
  };

  // --- FUNGSI SIMPAN PROFIL & CV ---
  const handleSimpanBiodataCV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin) return;

    const cvBaru: BiodataCV = {
      fotoUrl: cvFoto,
      headline: cvHeadline,
      bioSingkat: cvBio,
      asalSekolahKampus: cvSekolah,
      pendidikanTerakhir: cvPendidikan,
      skills: cvSkillsTeks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      pengalaman: cvPengalamanTeks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      prestasi: cvPrestasiTeks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      portfolioUrl: cvPortfolio,
    };

    const userUpdate: AkunPengguna = {
      ...userLogin,
      infoTambahan: cvHeadline || userLogin.infoTambahan,
      cv: cvBaru,
    };

    const daftarUpdate = daftarAkun.map((a) => (a.id === userLogin.id ? userUpdate : a));
    setDaftarAkun(daftarUpdate);
    setUserLogin(userUpdate);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarUpdate));
    localStorage.setItem("hibah_user_aktif", JSON.stringify(userUpdate));
    catatLog(userLogin.nama, userLogin.role, "Memperbarui Profil & CV Portofolio", "akun");
    setNotifSimpanCV(true);
    setTimeout(() => setNotifSimpanCV(false), 3000);
  };

  // --- FUNGSI MULTI-TIPE KUIS UNTUK GURU ---
  const tambahSoalDraftBaru = (tipePilih: TipeSoal) => {
    const soalBaru: KuisItem = {
      id: "draft-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      tipe: tipePilih,
      tanya: "",
      gambarSoalUrl: "",
      opsi:
        tipePilih === "pilihan_ganda" || tipePilih === "pilihan_jamak"
          ? ["", "", "", ""]
          : tipePilih === "benar_salah"
          ? ["Benar", "Salah"]
          : [],
      jawabanBenar: 0,
      jawabanJamak: [0, 1],
      jawabanTeks: "",
      pasangan: [
        { kiri: "", kanan: "" },
        { kiri: "", kanan: "" },
        { kiri: "", kanan: "" },
      ],
      pembahasan: "",
      poin: 50,
    };
    setDaftarKuisDraft((prev) => [...prev, soalBaru]);
  };

  const hapusSoalDraft = (idDraft: string) => {
    if (daftarKuisDraft.length <= 1) {
      alert("Minimal harus ada 1 soal kuis pada materi ini.");
      return;
    }
    setDaftarKuisDraft((prev) => prev.filter((q) => q.id !== idDraft));
  };

  const ubahFieldSoalDraft = (idDraft: string, field: keyof KuisItem, nilai: unknown) => {
    setDaftarKuisDraft((prev) =>
      prev.map((q) => (q.id === idDraft ? { ...q, [field]: nilai } : q))
    );
  };

  const ubahOpsiSoalDraft = (idDraft: string, indeksOpsi: number, teksBaru: string) => {
    setDaftarKuisDraft((prev) =>
      prev.map((q) => {
        if (q.id !== idDraft) return q;
        const opsiBaru = [...q.opsi];
        opsiBaru[indeksOpsi] = teksBaru;
        return { ...q, opsi: opsiBaru };
      })
    );
  };

  const toggleKunciJamakDraft = (idDraft: string, indeksOpsi: number) => {
    setDaftarKuisDraft((prev) =>
      prev.map((q) => {
        if (q.id !== idDraft) return q;
        const saatIni = q.jawabanJamak || [];
        const baru = saatIni.includes(indeksOpsi)
          ? saatIni.filter((i) => i !== indeksOpsi)
          : [...saatIni, indeksOpsi];
        return { ...q, jawabanJamak: baru };
      })
    );
  };

  const ubahPasanganCocokDraft = (
    idDraft: string,
    indeksPasangan: number,
    sisi: "kiri" | "kanan",
    nilai: string
  ) => {
    setDaftarKuisDraft((prev) =>
      prev.map((q) => {
        if (q.id !== idDraft) return q;
        const listPasangan = [...(q.pasangan || [])];
        listPasangan[indeksPasangan] = {
          ...listPasangan[indeksPasangan],
          [sisi]: nilai,
        };
        return { ...q, pasangan: listPasangan };
      })
    );
  };

  const tambahBarisPasanganDraft = (idDraft: string) => {
    setDaftarKuisDraft((prev) =>
      prev.map((q) =>
        q.id === idDraft
          ? { ...q, pasangan: [...(q.pasangan || []), { kiri: "", kanan: "" }] }
          : q
      )
    );
  };

  const handleProsesImportKuis = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baris = teksImportKuis
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);
      const dataBaris =
        baris[0]?.toLowerCase().startsWith("tipe,") ? baris.slice(1) : baris;

      const soalDariCsv: KuisItem[] = dataBaris.map((line, idx) => {
        const kol = line.split(",").map((s) => s.trim());
        const tipeRaw = (kol[0] || "pilihan_ganda") as TipeSoal;
        const tanya = kol[1] || `Pertanyaan #${idx + 1}`;
        const opsiRaw = kol[2] || "";
        const kunciRaw = kol[3] || "0";
        const pembahasan = kol[4] || "Pembahasan soal.";
        const poin = parseInt(kol[5] || "50", 10) || 50;
        const gambarSoalUrl = kol[6] || "";

        const pasangan: PasanganCocok[] =
          tipeRaw === "mencocokkan"
            ? opsiRaw.split("|").map((p) => {
                const [kiri, kanan] = p.split(":");
                return { kiri: kiri || "Kiri", kanan: kanan || "Kanan" };
              })
            : [];

        const opsi =
          tipeRaw === "benar_salah"
            ? ["Benar", "Salah"]
            : tipeRaw === "mencocokkan" || tipeRaw === "isian_singkat"
            ? []
            : opsiRaw.split("|");

        const jawabanJamak =
          tipeRaw === "pilihan_jamak"
            ? kunciRaw.split("|").map((n) => parseInt(n, 10) || 0)
            : [0];

        return {
          id: "csv-q-" + Date.now() + "-" + idx,
          tipe: tipeRaw,
          tanya,
          gambarSoalUrl,
          opsi,
          jawabanBenar: parseInt(kunciRaw, 10) || 0,
          jawabanJamak,
          jawabanTeks: tipeRaw === "isian_singkat" ? kunciRaw : "",
          pasangan,
          pembahasan,
          poin,
        };
      });

      setDaftarKuisDraft(soalDariCsv);
      setModalImportKuis(false);
      setTeksImportKuis("");
    } catch {
      alert("Gagal memproses CSV! Pastikan format sesuai contoh.");
    }
  };

  // --- FUNGSI GURU MERANCANG PAKET TRYOUT CBT (TPA / TOEP / TOEFL / UTBK) ---
  const tambahSoalTryoutDraft = () => {
    setSoalTryoutDraft((prev) => [
      ...prev,
      {
        id: "td-" + Date.now() + "-" + prev.length,
        pertanyaan: "",
        rumus: "",
        opsi: ["", "", "", ""],
        jawabanBenar: 0,
        pembahasan: "",
      },
    ]);
  };

  const muatCsvKeSoalTryoutDraft = () => {
    if (!teksCsvTryout.trim()) return alert("Tempelkan teks CSV soal terlebih dahulu.");
    const baris = teksCsvTryout
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    const dataBaris = baris[0]?.toLowerCase().startsWith("pertanyaan,")
      ? baris.slice(1)
      : baris;

    const hasil: SoalTryout[] = dataBaris.map((line, idx) => {
      const kol = line.split(",").map((s) => s.trim());
      return {
        id: "to-csv-" + Date.now() + "-" + idx,
        pertanyaan: kol[0] || `Soal #${idx + 1}`,
        opsi: (kol[1] || "A|B|C|D").split("|"),
        jawabanBenar: parseInt(kol[2] || "0", 10) || 0,
        pembahasan: kol[3] || "Pembahasan.",
        rumus: kol[4] || "",
      };
    });
    setSoalTryoutDraft(hasil);
    setTeksCsvTryout("");
    alert(`Berhasil memuat ${hasil.length} soal ke dalam rancangan Tryout!`);
  };

  const handleSimpanPaketTryoutBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin) return;

    const paketBaru: PaketTryout = {
      id: "pkt-" + Date.now(),
      judul: judulTryoutBaru,
      kategoriTes: kategoriTesBaru,
      jenjang: jenjangTryoutBaru,
      pembuatId: userLogin.id,
      pembuatNama: userLogin.nama,
      alamatLokasi: alamatTryoutBaru,
      jadwalUjian: jadwalTryoutBaru,
      durasiMenit: durasiTryoutBaru || 15,
      batasPercobaan: batasCobaTryoutBaru || 1,
      batasPelanggaran: 3,
      wajibFullscreen: true,
      daftarSoal: soalTryoutDraft.map((s, idx) => ({
        ...s,
        pertanyaan: s.pertanyaan || `Pertanyaan #${idx + 1}`,
      })),
    };

    const gabungan = [paketBaru, ...daftarPaketTryout];
    setDaftarPaketTryout(gabungan);
    localStorage.setItem("hibah_paket_tryout", JSON.stringify(gabungan));

    catatLog(
      userLogin.nama,
      userLogin.role,
      `Merancang Paket Ujian ${kategoriTesBaru}: "${judulTryoutBaru}" (Lokasi: ${alamatTryoutBaru})`,
      "materi"
    );
    alert(`Paket Tryout "${judulTryoutBaru}" berhasil diterbitkan dengan proteksi Fullscreen!`);
    setJudulTryoutBaru("");
  };

  // --- FUNGSI MULAI & SELESAIKAN TRYOUT DENGAN ANTI-CHEAT ---
  const mulaiUjianTryout = (paket: PaketTryout) => {
    if (!userLogin) {
      setMenuAktif("dashboard");
      return;
    }
    const jumlahCobaUser = riwayatTryout.filter(
      (r) => r.paketId === paket.id && r.userId === userLogin.id
    ).length;

    if (jumlahCobaUser >= paket.batasPercobaan) {
      alert(
        `Batas percobaan habis! Anda sudah mengikuti ujian ini sebanyak ${jumlahCobaUser} kali (Maksimal: ${paket.batasPercobaan}x).`
      );
      return;
    }

    if (paket.wajibFullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback jika browser memblokir
      });
    }

    setPaketTryoutAktif(paket);
    setJawabanUserTryout({});
    setRaguRaguTryout([]);
    setIndeksSoalTryoutAktif(0);
    setJumlahPelanggaranUjian(0);
    setPesanPeringatanCheat("");
    setSisaWaktu(paket.durasiMenit * 60);
    setUjianSelesai(false);
    setSedangUjian(true);

    catatLog(
      userLogin.nama,
      userLogin.role,
      `Memulai Ujian CBT [${paket.kategoriTes}]: ${paket.judul}`,
      "belajar"
    );
  };

  const selesaikanTryoutOtomatis = (
    pelanggaranAkhir: number,
    statusAkhir: "Selesai Normal" | "Diskualifikasi (Auto-Submit)"
  ) => {
    if (!paketTryoutAktif || !userLogin) return;

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    let benar = 0;
    paketTryoutAktif.daftarSoal.forEach((soal, idx) => {
      if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++;
    });
    const totalSoal = paketTryoutAktif.daftarSoal.length || 1;
    const nilaiAkhir = Math.round((benar / totalSoal) * 100);

    setSkorTryout(nilaiAkhir);
    setUjianSelesai(true);
    setSedangUjian(false);

    const riwayatBaru: RiwayatPercobaanTryout = {
      id: "rw-" + Date.now(),
      paketId: paketTryoutAktif.id,
      userId: userLogin.id,
      userNama: userLogin.nama,
      skor: nilaiAkhir,
      jumlahPelanggaran: pelanggaranAkhir,
      waktuSelesai: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      "status Akhir": statusAkhir,
    };

    const updateRiwayat = [riwayatBaru, ...riwayatTryout];
    setRiwayatTryout(updateRiwayat);
    localStorage.setItem("hibah_riwayat_tryout", JSON.stringify(updateRiwayat));

    catatLog(
      userLogin.nama,
      userLogin.role,
      `Menyelesaikan Ujian ${paketTryoutAktif.judul} — Skor: ${nilaiAkhir} (${statusAkhir}, Pelanggaran: ${pelanggaranAkhir}x)`,
      "belajar"
    );

    if (benar > 0) tambahXP(benar * 40);
  };

  // --- FUNGSI AUTENTIKASI ---
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun sedang disuspend.");
    setUserLogin(akun);
    setAdminModeGuru(false);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, "Berhasil masuk ke sistem (Terverifikasi)", "akun");
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
    setAdminModeGuru(false);
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
      infoTambahan: infoReg || "Pengguna Terdaftar",
      waktuDaftar: "Baru saja",
      aksesMengajar: [],
      minatSubJenjang: minatReg,
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, "Mendaftar akun (Pending)", "akun");
    setPesanSukses("Pendaftaran terkirim! Menunggu verifikasi Admin demi akuntabilitas.");
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
        minatSubJenjang: ["sma-11-ipa"],
      };
      const gabungan = [akunBaru, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
    }
    setModalAdminAkun(false);
  };

  const handleProsesImportAkun = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let akunBaruMasuk: AkunPengguna[] = [];
      if (modeImportAkunFormat === "json") {
        const parsedData = JSON.parse(teksImportAkun);
        if (!Array.isArray(parsedData)) return alert("Format JSON harus berupa Array [...]");
        akunBaruMasuk = parsedData.map((item: Partial<AkunPengguna>, idx: number) => ({
          id: "import-" + Date.now() + "-" + idx,
          nama: item.nama || "Tanpa Nama",
          email: item.email || `user${idx}@hibahilmu.id`,
          password: item.password || "123",
          role: item.role === "guru" || item.role === "admin" ? item.role : "siswa",
          status: "approved",
          infoTambahan: item.infoTambahan || "Diimpor massal",
          waktuDaftar: "Import JSON",
          aksesMengajar: [],
          minatSubJenjang: ["sma-11-ipa"],
        }));
      } else {
        const baris = teksImportAkun
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean);
        const dataBaris =
          baris[0]?.toLowerCase().startsWith("nama,") ? baris.slice(1) : baris;
        akunBaruMasuk = dataBaris.map((line, idx) => {
          const kol = line.split(",").map((s) => s.trim());
          const roleRaw = kol[3]?.toLowerCase();
          return {
            id: "csv-usr-" + Date.now() + "-" + idx,
            nama: kol[0] || "Pengguna CSV",
            email: kol[1] || `csv${idx}@hibahilmu.id`,
            password: kol[2] || "123",
            role: roleRaw === "guru" || roleRaw === "admin" ? roleRaw : "siswa",
            status: "approved",
            infoTambahan: kol[4] || "Import CSV/Excel",
            waktuDaftar: "Import CSV",
            aksesMengajar: [],
            minatSubJenjang: ["sma-11-ipa"],
          };
        });
      }

      const gabungan = [...akunBaruMasuk, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      setNotifImport(`Berhasil mengimpor ${akunBaruMasuk.length} akun pengguna!`);
      setTimeout(() => {
        setNotifImport("");
        setModalImportAkun(false);
        setTeksImportAkun("");
      }, 2000);
    } catch {
      alert("Format tidak valid!");
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
    setModalKategori(false);
    setNamaKategoriBaru("");
  };

  // --- FUNGSI ROMBEL & PENGUMUMAN KELAS ---
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
    setNamaKelompokAdmin("");
    setGuruKelompokAdmin("");
  };

  const handleGuruBuatKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !namaKelompokBaru.trim()) return;
    const kelompokBaru: KelompokBelajar = {
      id: "kelompok-" + Date.now(),
      namaKelas: namaKelompokBaru,
      pengumuman: pengumumanBaru || "Selamat datang di ruang kelas!",
      guruId: userLogin.id,
      siswaIds: [],
    };
    const update = [...daftarKelompok, kelompokBaru];
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
    setNamaKelompokBaru("");
    setPengumumanBaru("");
  };

  const handleKirimPengumumanKelas = (kel: KelompokBelajar) => {
    const isiPesan = (inputPengumumanKelas[kel.id] || "").trim();
    if (!isiPesan) return alert("Ketik isi pengumuman terlebih dahulu.");

    const update = daftarKelompok.map((k) =>
      k.id === kel.id ? { ...k, pengumuman: isiPesan } : k
    );
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));

    if (kel.siswaIds.length > 0) {
      kirimNotifikasiKeUser(
        kel.siswaIds,
        `Pengumuman Kelas: ${kel.namaKelas}`,
        isiPesan,
        userLogin?.nama || "Guru Kelas",
        kel.namaKelas
      );
    }
    setInputPengumumanKelas({ ...inputPengumumanKelas, [kel.id]: "" });
    alert(`Pengumuman dikirim ke kotak notifikasi ${kel.siswaIds.length} murid!`);
  };

  const handleTambahSiswaKeKelompok = (kelompokId: string, siswaId: string) => {
    const targetKel = daftarKelompok.find((k) => k.id === kelompokId);
    const update = daftarKelompok.map((k) =>
      k.id === kelompokId && !k.siswaIds.includes(siswaId)
        ? { ...k, siswaIds: [...k.siswaIds, siswaId] }
        : k
    );
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));

    if (targetKel) {
      kirimNotifikasiKeUser(
        [siswaId],
        `Undangan Kelas: ${targetKel.namaKelas}`,
        `Kamu telah dimasukkan ke dalam ruang kelas "${targetKel.namaKelas}".`,
        userLogin?.nama || "Pengajar",
        targetKel.namaKelas
      );
    }
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

  // --- FUNGSI GURU / ADMIN BUAT MATERI TERVERIFIKASI ---
  // Jika Admin sedang mengaktifkan Mode Guru, Admin punya akses ke semua kelas
  const opsiKelasGuru = (daftarJenjang || []).flatMap((j) =>
    j.subJenjang
      .filter((sj) =>
        userLogin?.role === "admin" ? true : userLogin?.aksesMengajar?.includes(sj.id)
      )
      .map((sj) => ({ ...sj, namaInduk: j.nama }))
  );

  const handleGuruBuatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !subJenjangPilih) return;
    const finalEmbed = videoMateri.includes("watch?v=")
      ? videoMateri.replace("watch?v=", "embed/")
      : videoMateri;

    const kuisBersih: KuisItem[] = daftarKuisDraft.map((q, idx) => ({
      ...q,
      id: "kuis-" + Date.now() + "-" + idx,
      tanya: q.tanya || `Pertanyaan Evaluasi #${idx + 1}`,
      pembahasan: q.pembahasan || `Disusun oleh ${userLogin.nama}.`,
    }));

    const modulBaru: KelasItem = {
      id: "mdl-" + Date.now(),
      subJenjangId: subJenjangPilih,
      judul: judulMateri,
      pembuatId: userLogin.id,
      pembuatNama: userLogin.nama,
      pembuatEmail: userLogin.email,
      tanggalUpload: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      level: levelMateri,
      durasi: "15 Menit",
      videoUrl: finalEmbed,
      lampiranUrl: lampiranMateri || undefined,
      rangkuman: rangkumanMateri || "<p>Materi pembelajaran.</p>",
      rumusMatematika: rumusMateri || undefined,
      daftarKuis: kuisBersih,
    };

    const update = daftarJenjang.map((j) =>
      j.subJenjang.some((sj) => sj.id === subJenjangPilih)
        ? { ...j, kelas: [modulBaru, ...j.kelas] }
        : j
    );
    setDaftarJenjang(update);
    localStorage.setItem("hibah_struktur", JSON.stringify(update));

    catatLog(
      userLogin.nama,
      userLogin.role,
      `Mengunggah materi terverifikasi "${judulMateri}" (${userLogin.email})`,
      "materi"
    );
    setNotifGuru(true);
    setJudulMateri("");
    setVideoMateri("");
    setLampiranMateri("");
    setRangkumanMateri("");
    setRumusMateri("");
    setTimeout(() => setNotifGuru(false), 3500);
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
  const guruKelompoks = daftarKelompok.filter((k) =>
    userLogin?.role === "admin" ? true : k.guruId === userLogin?.id
  );
  const daftarSiswaApproved = safeAkunList.filter(
    (a) => a.role === "siswa" && a.status === "approved"
  );

  const semuaSubJenjangFlat = daftarJenjang.flatMap((j) =>
    j.subJenjang.map((sj) => ({ ...sj, namaInduk: j.nama }))
  );

  const notifikasiUserAktif = daftarNotifikasi.filter((n) =>
    userLogin ? n.targetUserId === userLogin.id || n.targetUserId === "ALL" : false
  );
  const jumlahNotifBelumDibaca = notifikasiUserAktif.filter((n) => !n.dibaca).length;

  // ==========================================
  // SUB-RENDERER: PROFIL & CV BUILDER
  // ==========================================
  const renderProfilDanCV = () => {
    if (!userLogin) return null;
    const cvData = userLogin.cv;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-emerald-600 to-teal-600" />
          <div className="px-6 pb-6 -mt-12">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-slate-200 overflow-hidden flex items-center justify-center text-3xl font-black text-slate-600">
              {cvFoto ? (
                <img src={cvFoto} alt={userLogin.nama} className="w-full h-full object-cover" />
              ) : (
                userLogin.nama.charAt(0)
              )}
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{userLogin.nama}</h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {userLogin.role}
                </span>
              </div>
              <p className="text-xs font-bold text-indigo-600 mt-0.5">
                {cvHeadline || userLogin.infoTambahan}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {cvBio || "Belum ada deskripsi biodata singkat."}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">
                  Asal Sekolah / Kampus
                </span>
                <span className="font-bold text-slate-800">
                  {cvSekolah || "-"} ({cvPendidikan || "-"})
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1.5">
                  Skills & Kemampuan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(cvData?.skills || []).length > 0 ? (
                    cvData?.skills.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold text-[11px]"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Belum ditambahkan</span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                  Pengalaman & Organisasi
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {(cvData?.pengalaman || []).map((exp, i) => (
                    <li key={i}>{exp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                  Prestasi & Sertifikasi
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {(cvData?.prestasi || []).map((pr, i) => (
                    <li key={i}>{pr}</li>
                  ))}
                </ul>
              </div>

              {cvPortfolio && (
                <div className="pt-2">
                  <a
                    href={cvPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 font-bold hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> Buka Tautan Portofolio
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Edit Foto Profil, Biodata & CV
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Identitas yang lengkap memastikan seluruh kontribusi materi dan ujian dapat
            dipertanggungjawabkan.
          </p>

          {notifSimpanCV && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold">
              Profil dan CV berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleSimpanBiodataCV} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  URL Foto Profil (Link Gambar)
                </label>
                <input
                  type="url"
                  value={cvFoto}
                  onChange={(e) => setCvFoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Headline / Spesialisasi
                </label>
                <input
                  type="text"
                  value={cvHeadline}
                  onChange={(e) => setCvHeadline(e.target.value)}
                  placeholder="Contoh: Mahasiswa S1 Informatika / Guru Fisika"
                  className="w-full p-3 border rounded-xl bg-slate-50 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Asal Sekolah / Universitas
                </label>
                <input
                  type="text"
                  value={cvSekolah}
                  onChange={(e) => setCvSekolah(e.target.value)}
                  placeholder="Contoh: SMAN 1 Pekanbaru / Universitas..."
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Tingkat / Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  value={cvPendidikan}
                  onChange={(e) => setCvPendidikan(e.target.value)}
                  placeholder="Contoh: Kelas 12 MIPA / S1 Teknik Informatika"
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Biodata Singkat</label>
              <textarea
                rows={2}
                value={cvBio}
                onChange={(e) => setCvBio(e.target.value)}
                placeholder="Ceritakan minat, tujuan belajar, atau pengalaman mengajar Anda..."
                className="w-full p-3 border rounded-xl bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Keahlian / Skills (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={cvSkillsTeks}
                onChange={(e) => setCvSkillsTeks(e.target.value)}
                placeholder="Matematika, Fisika, React, Next.js, TOEFL"
                className="w-full p-3 border rounded-xl bg-slate-50 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Pengalaman / Organisasi (1 baris = 1 poin)
                </label>
                <textarea
                  rows={3}
                  value={cvPengalamanTeks}
                  onChange={(e) => setCvPengalamanTeks(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Prestasi / Sertifikasi (1 baris = 1 poin)
                </label>
                <textarea
                  rows={3}
                  value={cvPrestasiTeks}
                  onChange={(e) => setCvPrestasiTeks(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Link Portofolio / GitHub / LinkedIn
              </label>
              <input
                type="url"
                value={cvPortfolio}
                onChange={(e) => setCvPortfolio(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full p-3 border rounded-xl bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl shadow-md"
            >
              Simpan Perubahan Biodata & CV
            </button>
          </form>
        </div>
      </div>
    );
  };

  // ==========================================
  // SUB-RENDERER: GERBANG REGISTRASI & LOGIN
  // ==========================================
  const renderAuthView = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <b>100% Gratis & Terverifikasi:</b> Seluruh pengguna wajib registrasi dan masuk agar
            setiap materi, diskusi, dan hasil ujian dapat dipertanggungjawabkan.
          </span>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
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
            Registrasi Akun Gratis
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
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Email Terdaftar
              </label>
              <input
                type="email"
                required
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Contoh: admin@hibahilmu.id"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
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
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg"
            >
              Masuk Sekarang
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleReg("siswa")}
                className={`p-3.5 border-2 rounded-2xl text-left transition ${
                  roleReg === "siswa"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Siswa / Mahasiswa</div>
                <div className="text-[10px] text-slate-500">Pilih kelas yang ingin diikuti</div>
              </button>
              <button
                type="button"
                onClick={() => setRoleReg("guru")}
                className={`p-3.5 border-2 rounded-2xl text-left transition ${
                  roleReg === "guru"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Guru / Instruktur</div>
                <div className="text-[10px] text-slate-500">Upload materi & buat Tryout</div>
              </button>
            </div>
            <input
              type="text"
              required
              value={namaReg}
              onChange={(e) => setNamaReg(e.target.value)}
              placeholder="Nama Lengkap Sesuai Identitas..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="email"
              required
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              placeholder="Email Aktif..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="password"
              required
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              placeholder="Buat Password..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="text"
              required
              value={infoReg}
              onChange={(e) => setInfoReg(e.target.value)}
              placeholder={
                roleReg === "guru" ? "Bidang Keahlian & Asal Instansi..." : "Asal Sekolah / Kampus..."
              }
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />

            {roleReg === "siswa" && (
              <div className="p-4 bg-slate-50 border rounded-2xl">
                <label className="block text-xs font-black text-slate-700 mb-2">
                  Pilih Kelas / Materi yang Ingin Kamu Ikuti:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                  {semuaSubJenjangFlat.map((sj) => (
                    <label
                      key={sj.id}
                      className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={minatReg.includes(sj.id)}
                        onChange={() =>
                          setMinatReg((prev) =>
                            prev.includes(sj.id)
                              ? prev.filter((x) => x !== sj.id)
                              : [...prev, sj.id]
                          )
                        }
                      />
                      <span>{sj.nama}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg"
            >
              Daftar Akun Gratis Sekarang
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max">
          Simulasi Akses Cepat
        </span>
        <h3 className="text-2xl font-black mt-4 mb-2">Akun Terverifikasi (1-Klik)</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Pilih salah satu akun terverifikasi di bawah ini untuk langsung menguji fitur Admin (Mode
          Guru), Guru (Pembuat Tryout TPA/TOEFL), atau Siswa.
        </p>
        <div className="space-y-3">
          {safeAkunList
            .filter((a) => a.status === "approved")
            .map((a) => (
              <button
                key={a.id}
                onClick={() => loginCepat(a)}
                className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center font-black">
                    {a.cv?.fotoUrl ? (
                      <img src={a.cv.fotoUrl} alt={a.nama} className="w-full h-full object-cover" />
                    ) : (
                      a.nama.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {a.nama}
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-500 text-slate-900">
                        {a.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.email}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300">Masuk →</span>
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-RENDERER: STUDIO GURU (JUGA BISA DIAKSES ADMIN)
  // ==========================================
  const renderGuruView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-white/50 overflow-hidden bg-indigo-800 flex items-center justify-center text-2xl font-black">
            {userLogin?.cv?.fotoUrl ? (
              <img
                src={userLogin.cv.fotoUrl}
                alt={userLogin.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              userLogin?.nama.charAt(0)
            )}
          </div>
          <div>
            <span className="bg-white/20 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
              {userLogin?.role === "admin"
                ? "Mode Guru (Diakses oleh Super Admin)"
                : "Studio Pengajar Terverifikasi"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{userLogin?.nama}</h1>
            <p className="text-indigo-200 text-xs">
              Email Penanggung Jawab: <b>{userLogin?.email}</b>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {userLogin?.role === "admin" && (
            <button
              onClick={() => setAdminModeGuru(false)}
              className="bg-amber-400 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl shadow-lg"
            >
              ← Kembali ke Panel Super Admin
            </button>
          )}
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
      </div>

      <div className="flex gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setGuruTabAktif("materi")}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "materi"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <BookOpen className="w-4 h-4" /> 1. Upload Materi & Kuis
        </button>
        <button
          onClick={() => setGuruTabAktif("tryout_builder")}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "tryout_builder"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Timer className="w-4 h-4" /> 2. Rancang Tryout / TPA / TOEP / TOEFL
        </button>
        <button
          onClick={() => setGuruTabAktif("kelas")}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "kelas"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Users className="w-4 h-4" /> 3. Kelola Rombel & Pengumuman ({guruKelompoks.length})
        </button>
        <button
          onClick={() => setGuruTabAktif("cv")}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "cv"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Briefcase className="w-4 h-4" /> 4. Profil & CV Saya
        </button>
      </div>

      {guruTabAktif === "cv" && renderProfilDanCV()}

      {/* TAB 2 GURU: PERANCANG TRYOUT MANDIRI (TPA, TOEP, TOEFL, UTBK) */}
      {guruTabAktif === "tryout_builder" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Perancang Tryout CBT & Tes Standar (TPA / TOEP / TOEFL / UTBK)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Atur nama ujian, alamat/lokasi pelaksanaan, jadwal jam ujian, batas percobaan, dan
              proteksi layar penuh (Anti-Cheat Alt+Tab).
            </p>
          </div>

          <form onSubmit={handleSimpanPaketTryoutBaru} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nama Paket Ujian / Tryout
                </label>
                <input
                  type="text"
                  required
                  value={judulTryoutBaru}
                  onChange={(e) => setJudulTryoutBaru(e.target.value)}
                  placeholder="Contoh: Simulasi TOEFL ITP Batch 3..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Kategori Tes (TPA / TOEP / TOEFL / UTBK)
                </label>
                <select
                  value={kategoriTesBaru}
                  onChange={(e) => setKategoriTesBaru(e.target.value as KategoriTes)}
                  className="w-full p-3.5 border rounded-xl bg-indigo-50 text-indigo-950 text-xs font-black"
                >
                  <option value="TPA">TPA (Tes Potensi Akademik)</option>
                  <option value="TOEP">TOEP (Test of English Proficiency)</option>
                  <option value="TOEFL">TOEFL Prediction / ITP</option>
                  <option value="UTBK">UTBK - SNBT Nasional</option>
                  <option value="Akademik">Ujian Sekolah / Akademik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Sasaran Jenjang Peserta
                </label>
                <input
                  type="text"
                  required
                  value={jenjangTryoutBaru}
                  onChange={(e) => setJenjangTryoutBaru(e.target.value)}
                  placeholder="SMA / Kuliah / Umum"
                  className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Alamat / Lokasi Ruangan Ujian
                </label>
                <input
                  type="text"
                  required
                  value={alamatTryoutBaru}
                  onChange={(e) => setAlamatTryoutBaru(e.target.value)}
                  placeholder="Contoh: Lab Komputer Lt.3 Pekanbaru / Online"
                  className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Jadwal Tanggal & Jam Ujian
                </label>
                <input
                  type="text"
                  required
                  value={jadwalTryoutBaru}
                  onChange={(e) => setJadwalTryoutBaru(e.target.value)}
                  placeholder="2026-11-15 08:00 WIB"
                  className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    required
                    value={durasiTryoutBaru}
                    onChange={(e) => setDurasiTryoutBaru(Number(e.target.value))}
                    className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-black text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Maks. Coba
                  </label>
                  <input
                    type="number"
                    required
                    value={batasCobaTryoutBaru}
                    onChange={(e) => setBatasCobaTryoutBaru(Number(e.target.value))}
                    className="w-full p-3.5 border rounded-xl bg-slate-50 text-xs font-black text-center"
                  />
                </div>
              </div>
            </div>

            {/* Import Cepat CSV untuk Soal Tryout */}
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-black text-slate-800">
                  Import Cepat Soal Tryout via CSV / Excel (Opsional)
                </span>
                <button
                  type="button"
                  onClick={() => setTeksCsvTryout(TEMPLATE_CSV_TRYOUT)}
                  className="text-xs font-bold text-indigo-600 underline"
                >
                  Muat Contoh CSV TPA & TOEFL
                </button>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={3}
                  value={teksCsvTryout}
                  onChange={(e) => setTeksCsvTryout(e.target.value)}
                  placeholder="pertanyaan,opsiA|opsiB|opsiC|opsiD,indeks_kunci,pembahasan,subtes"
                  className="flex-1 p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={muatCsvKeSoalTryoutDraft}
                  className="bg-indigo-600 text-white px-4 rounded-xl text-xs font-bold"
                >
                  Terapkan CSV
                </button>
              </div>
            </div>

            {/* Daftar Butir Soal Tryout */}
            <div className="space-y-4">
              <div className="font-black text-sm">
                Butir Soal Ujian ({soalTryoutDraft.length} Soal)
              </div>
              {soalTryoutDraft.map((st, idx) => (
                <div key={st.id} className="p-4 border rounded-2xl bg-slate-50/70 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black bg-slate-900 text-white px-3 py-1 rounded-lg">
                      Nomor #{idx + 1}
                    </span>
                    {soalTryoutDraft.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSoalTryoutDraft(soalTryoutDraft.filter((x) => x.id !== st.id))
                        }
                        className="text-rose-600 font-bold"
                      >
                        Hapus Soal
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={st.pertanyaan}
                      onChange={(e) =>
                        setSoalTryoutDraft(
                          soalTryoutDraft.map((x) =>
                            x.id === st.id ? { ...x, pertanyaan: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Ketik pertanyaan ujian..."
                      className="sm:col-span-2 p-3 border rounded-xl bg-white font-semibold"
                    />
                    <input
                      type="text"
                      value={st.rumus || ""}
                      onChange={(e) =>
                        setSoalTryoutDraft(
                          soalTryoutDraft.map((x) =>
                            x.id === st.id ? { ...x, rumus: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Subtes / Petunjuk (Misal: TOEFL Structure)"
                      className="p-3 border rounded-xl bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((iOpsi) => (
                      <input
                        key={iOpsi}
                        type="text"
                        required
                        value={st.opsi[iOpsi] || ""}
                        onChange={(e) => {
                          const opsiBaru = [...st.opsi];
                          opsiBaru[iOpsi] = e.target.value;
                          setSoalTryoutDraft(
                            soalTryoutDraft.map((x) =>
                              x.id === st.id ? { ...x, opsi: opsiBaru } : x
                            )
                          );
                        }}
                        placeholder={`Opsi ${String.fromCharCode(65 + iOpsi)}`}
                        className="p-2.5 border rounded-xl bg-white"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={st.jawabanBenar}
                      onChange={(e) =>
                        setSoalTryoutDraft(
                          soalTryoutDraft.map((x) =>
                            x.id === st.id ? { ...x, jawabanBenar: Number(e.target.value) } : x
                          )
                        )
                      }
                      className="p-2.5 border rounded-xl bg-emerald-50 font-bold text-emerald-900"
                    >
                      <option value={0}>Kunci Jawaban: Opsi A</option>
                      <option value={1}>Kunci Jawaban: Opsi B</option>
                      <option value={2}>Kunci Jawaban: Opsi C</option>
                      <option value={3}>Kunci Jawaban: Opsi D</option>
                    </select>
                    <input
                      type="text"
                      value={st.pembahasan}
                      onChange={(e) =>
                        setSoalTryoutDraft(
                          soalTryoutDraft.map((x) =>
                            x.id === st.id ? { ...x, pembahasan: e.target.value } : x
                          )
                        )
                      }
                      placeholder="Pembahasan jawaban..."
                      className="p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={tambahSoalTryoutDraft}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold"
              >
                + Tambah Nomor Soal Baru
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg text-sm"
            >
              Terbitkan Paket Ujian CBT (Dilengkapi Proteksi Anti-Cheat Fullscreen)
            </button>
          </form>
        </div>
      )}

      {guruTabAktif === "materi" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-5xl">
          <h2 className="text-2xl font-black mb-6 text-slate-900">
            Publikasi Materi Rich Text & Bank Kuis Multi-Tipe
          </h2>
          {opsiKelasGuru.length === 0 ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-rose-400" />
              <p className="text-rose-800 font-bold">
                Admin belum menugaskan kelas/tingkat untuk akun Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGuruBuatMateri} className="space-y-6">
              {notifGuru && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-sm text-center border border-emerald-200">
                  Materi & Kuis berhasil diterbitkan dengan identitas terverifikasi Anda!
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
                    placeholder="Contoh: Hukum Newton & Aplikasi..."
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
                    <option value="Mahir">Mahir / Olimpiade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="font-bold mb-1 block text-xs text-slate-500">
                    Link Lampiran Modul PDF/PPT (Opsional)
                  </label>
                  <input
                    type="url"
                    value={lampiranMateri}
                    onChange={(e) => setLampiranMateri(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full p-3.5 border rounded-xl bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold mb-1.5 flex justify-between text-xs text-slate-500">
                  <span>Artikel / Rangkuman Materi (Format Lengkap & Gambar Link)</span>
                  <span className="text-indigo-600 font-black">Rich Text Editor Pro</span>
                </label>
                <RichTextEditorPro value={rangkumanMateri} onChange={setRangkumanMateri} />
              </div>

              {/* BUILDER 5 TIPE SOAL KUIS */}
              <div className="p-6 border-2 border-indigo-100 rounded-3xl bg-slate-50 space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      Bank Kuis Multi-Tipe ({daftarKuisDraft.length} Soal)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalImportKuis(true)}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Import Soal via CSV / Excel
                  </button>
                </div>

                <div className="space-y-4">
                  {daftarKuisDraft.map((soal, indexSoal) => (
                    <div
                      key={soal.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-lg">
                            Soal #{indexSoal + 1}
                          </span>
                          <select
                            value={soal.tipe}
                            onChange={(e) => {
                              const tipeBaru = e.target.value as TipeSoal;
                              ubahFieldSoalDraft(soal.id, "tipe", tipeBaru);
                            }}
                            className="p-2 border rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-900"
                          >
                            <option value="pilihan_ganda">1. Pilihan Ganda (1 Benar)</option>
                            <option value="pilihan_jamak">
                              2. Pilihan Kompleks (Benar Lebih dari 1)
                            </option>
                            <option value="mencocokkan">3. Mencocokkan Pasangan</option>
                            <option value="benar_salah">4. Benar / Salah</option>
                            <option value="isian_singkat">5. Isian Singkat</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => hapusSoalDraft(soal.id)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          value={soal.tanya}
                          onChange={(e) => ubahFieldSoalDraft(soal.id, "tanya", e.target.value)}
                          placeholder={`Ketik pertanyaan nomor ${indexSoal + 1}...`}
                          className="sm:col-span-2 p-3.5 border rounded-xl bg-slate-50 text-sm font-semibold"
                        />
                        <input
                          type="url"
                          value={soal.gambarSoalUrl || ""}
                          onChange={(e) =>
                            ubahFieldSoalDraft(soal.id, "gambarSoalUrl", e.target.value)
                          }
                          placeholder="URL Gambar Soal (Opsional)..."
                          className="p-3.5 border rounded-xl bg-slate-50 text-xs"
                        />
                      </div>

                      {soal.tipe === "pilihan_ganda" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((idxOpsi) => (
                              <input
                                key={idxOpsi}
                                type="text"
                                required
                                value={soal.opsi[idxOpsi] || ""}
                                onChange={(e) =>
                                  ubahOpsiSoalDraft(soal.id, idxOpsi, e.target.value)
                                }
                                placeholder={`Opsi ${String.fromCharCode(65 + idxOpsi)}`}
                                className="p-3 border rounded-xl text-xs font-semibold"
                              />
                            ))}
                          </div>
                          <select
                            value={soal.jawabanBenar}
                            onChange={(e) =>
                              ubahFieldSoalDraft(soal.id, "jawabanBenar", Number(e.target.value))
                            }
                            className="w-full p-3 border bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs"
                          >
                            <option value={0}>Kunci Jawaban: Opsi A</option>
                            <option value={1}>Kunci Jawaban: Opsi B</option>
                            <option value={2}>Kunci Jawaban: Opsi C</option>
                            <option value={3}>Kunci Jawaban: Opsi D</option>
                          </select>
                        </div>
                      )}

                      {soal.tipe === "pilihan_jamak" && (
                        <div className="grid grid-cols-2 gap-3">
                          {[0, 1, 2, 3].map((idxOpsi) => {
                            const terpilih = (soal.jawabanJamak || []).includes(idxOpsi);
                            return (
                              <div
                                key={idxOpsi}
                                className="flex items-center gap-2 p-2.5 border rounded-xl"
                              >
                                <input
                                  type="checkbox"
                                  checked={terpilih}
                                  onChange={() => toggleKunciJamakDraft(soal.id, idxOpsi)}
                                />
                                <input
                                  type="text"
                                  required
                                  value={soal.opsi[idxOpsi] || ""}
                                  onChange={(e) =>
                                    ubahOpsiSoalDraft(soal.id, idxOpsi, e.target.value)
                                  }
                                  placeholder={`Opsi ${String.fromCharCode(65 + idxOpsi)}`}
                                  className="flex-1 text-xs font-semibold outline-none"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {soal.tipe === "mencocokkan" && (
                        <div className="space-y-2">
                          {(soal.pasangan || []).map((pas, idxP) => (
                            <div key={idxP} className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                required
                                value={pas.kiri}
                                onChange={(e) =>
                                  ubahPasanganCocokDraft(soal.id, idxP, "kiri", e.target.value)
                                }
                                placeholder={`Pernyataan Kiri #${idxP + 1}`}
                                className="p-2.5 bg-white border rounded-xl text-xs"
                              />
                              <input
                                type="text"
                                required
                                value={pas.kanan}
                                onChange={(e) =>
                                  ubahPasanganCocokDraft(soal.id, idxP, "kanan", e.target.value)
                                }
                                placeholder={`Pasangan Benar #${idxP + 1}`}
                                className="p-2.5 bg-emerald-50 border rounded-xl text-xs font-bold"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => tambahBarisPasanganDraft(soal.id)}
                            className="text-xs font-bold text-indigo-600"
                          >
                            + Tambah Baris Pasangan
                          </button>
                        </div>
                      )}

                      {soal.tipe === "benar_salah" && (
                        <select
                          value={soal.jawabanBenar}
                          onChange={(e) =>
                            ubahFieldSoalDraft(soal.id, "jawabanBenar", Number(e.target.value))
                          }
                          className="w-full p-3 border bg-emerald-50 rounded-xl font-bold text-xs"
                        >
                          <option value={0}>Kunci: BENAR</option>
                          <option value={1}>Kunci: SALAH</option>
                        </select>
                      )}

                      {soal.tipe === "isian_singkat" && (
                        <input
                          type="text"
                          required
                          value={soal.jawabanTeks || ""}
                          onChange={(e) =>
                            ubahFieldSoalDraft(soal.id, "jawabanTeks", e.target.value)
                          }
                          placeholder="Kunci Jawaban Singkat..."
                          className="w-full p-3 border bg-emerald-50 rounded-xl text-xs font-bold"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => tambahSoalDraftBaru("pilihan_ganda")}
                    className="px-3.5 py-2 bg-white border rounded-xl text-xs font-bold"
                  >
                    + Pilihan Ganda
                  </button>
                  <button
                    type="button"
                    onClick={() => tambahSoalDraftBaru("pilihan_jamak")}
                    className="px-3.5 py-2 bg-white border rounded-xl text-xs font-bold text-indigo-700"
                  >
                    + Pilihan Jamak (&gt;1 Benar)
                  </button>
                  <button
                    type="button"
                    onClick={() => tambahSoalDraftBaru("mencocokkan")}
                    className="px-3.5 py-2 bg-white border rounded-xl text-xs font-bold text-emerald-700"
                  >
                    + Soal Mencocokkan
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl shadow-lg"
              >
                Terbitkan Materi Terverifikasi Sekarang
              </button>
            </form>
          )}
        </div>
      )}

      {guruTabAktif === "kelas" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900">
            Kelola Kelas & Broadcast Pengumuman ke Murid
          </h2>
          <form
            onSubmit={handleGuruBuatKelompok}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl"
          >
            <input
              type="text"
              required
              value={namaKelompokBaru}
              onChange={(e) => setNamaKelompokBaru(e.target.value)}
              placeholder="Nama Ruang Kelas Baru..."
              className="p-3.5 rounded-xl border bg-white text-sm font-semibold"
            />
            <input
              type="text"
              value={pengumumanBaru}
              onChange={(e) => setPengumumanBaru(e.target.value)}
              placeholder="Pengumuman Awal Kelas..."
              className="p-3.5 rounded-xl border bg-white text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black text-sm"
            >
              + Buat Kelas Baru
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
                <div key={kel.id} className="p-6 border rounded-3xl bg-white shadow-2xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg text-indigo-950">{kel.namaKelas}</h3>
                      <span className="text-xs font-bold text-slate-500">
                        {kel.siswaIds.length} Murid Terdaftar
                      </span>
                    </div>
                    <button
                      onClick={() => handleHapusKelompok(kel.id)}
                      className="text-xs text-rose-600 font-bold"
                    >
                      Hapus Kelas
                    </button>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="text-[11px] font-black text-amber-900">
                      Pengumuman: <span className="font-normal">{kel.pengumuman || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputPengumumanKelas[kel.id] || ""}
                        onChange={(e) =>
                          setInputPengumumanKelas({
                            ...inputPengumumanKelas,
                            [kel.id]: e.target.value,
                          })
                        }
                        placeholder="Ketik pengumuman ke murid..."
                        className="flex-1 p-2 bg-white border rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleKirimPengumumanKelas(kel)}
                        className="bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={kataCari}
                    onChange={(e) =>
                      setSearchSiswaGuru({ ...searchSiswaGuru, [kel.id]: e.target.value })
                    }
                    placeholder="Cari nama/email siswa untuk ditambahkan..."
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
                  />

                  <div className="max-h-28 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-xl border">
                    {hasilCari.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center p-2 bg-white rounded-lg border text-xs"
                      >
                        <span>
                          <b>{s.nama}</b> ({s.email})
                        </span>
                        <button
                          onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                        >
                          + Tambah
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );

  // ==========================================
  // SUB-RENDERER: ADMIN VIEW (DENGAN SAKELAR MODE GURU)
  // ==========================================
  const renderAdminView = () => {
    if (adminModeGuru) {
      return renderGuruView();
    }
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-amber-400 overflow-hidden bg-slate-800 flex items-center justify-center text-2xl font-black">
              {userLogin?.cv?.fotoUrl ? (
                <img
                  src={userLogin.cv.fotoUrl}
                  alt={userLogin.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                userLogin?.nama.charAt(0)
              )}
            </div>
            <div>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                Super Admin
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">{userLogin?.nama}</h1>
              <p className="text-slate-300 text-xs">
                Otoritas Penuh & Pengawasan Konten Terverifikasi
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setAdminModeGuru(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Buka Studio Mode Guru
            </button>
            <button
              onClick={() => setModalImportAkun(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import CSV / JSON
            </button>
            <button
              onClick={bukaModalTambahAkun}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Tambah Akun
            </button>
            <button
              onClick={() => {
                setUserLogin(null);
                localStorage.removeItem("hibah_user_aktif");
              }}
              className="bg-rose-600 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            {
              id: "akun",
              label: `Data Akun (${safeAkunList.length})`,
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "rombel",
              label: `Kelola Rombel (${daftarKelompok.length})`,
              icon: <FolderArchive className="w-4 h-4" />,
            },
            { id: "kategori", label: "Kategori & Prodi", icon: <Layers className="w-4 h-4" /> },
            { id: "cv", label: "Profil & CV Saya", icon: <Briefcase className="w-4 h-4" /> },
            { id: "log", label: "Audit Pertanggungjawaban", icon: <Activity className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setAdminTabAktif(t.id as "akun" | "kategori" | "rombel" | "log" | "cv")
              }
              className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
                adminTabAktif === t.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {adminTabAktif === "cv" && renderProfilDanCV()}

        {adminTabAktif === "akun" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Manajemen Akun Terdaftar</h2>
              {selectedAkunIds.length > 0 && (
                <button
                  onClick={hapusAkunSekaligus}
                  className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Hapus {selectedAkunIds.length} Terpilih
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-[36rem] overflow-y-auto">
              {safeAkunList.map((akun) => (
                <div
                  key={akun.id}
                  className="p-4 rounded-2xl border bg-slate-50 flex flex-wrap justify-between items-center gap-4"
                >
                  <div className="flex items-start gap-3">
                    {akun.role !== "admin" && (
                      <input
                        type="checkbox"
                        checked={selectedAkunIds.includes(akun.id)}
                        onChange={() => togglePilihAkun(akun.id)}
                        className="mt-1 w-4 h-4"
                      />
                    )}
                    <div>
                      <div className="font-extrabold text-sm flex items-center gap-2">
                        {akun.nama}
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">
                          {akun.role}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-black">
                          {akun.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {akun.email} • {akun.infoTambahan}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {akun.status !== "approved" ? (
                      <button
                        onClick={() => ubahStatusAkun(akun.id, "approved")}
                        className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"
                      >
                        <UserCheck2 className="w-4 h-4" />
                      </button>
                    ) : (
                      akun.role !== "admin" && (
                        <button
                          onClick={() => ubahStatusAkun(akun.id, "rejected")}
                          className="p-2 bg-amber-100 text-amber-700 rounded-xl"
                        >
                          <UserX2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                    <button
                      onClick={() => bukaModalEditAkun(akun)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {akun.role !== "admin" && (
                      <button
                        onClick={() => hapusAkun(akun.id)}
                        className="p-2 bg-rose-100 text-rose-700 rounded-xl"
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
            <h2 className="text-xl font-black">Manajemen Rombel & Penempatan Mahasiswa/Siswa</h2>
            <form
              onSubmit={handleAdminBuatKelompok}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 bg-slate-50 border rounded-2xl"
            >
              <input
                type="text"
                required
                value={namaKelompokAdmin}
                onChange={(e) => setNamaKelompokAdmin(e.target.value)}
                placeholder="Nama Rombel Baru..."
                className="p-3 border rounded-xl text-xs font-bold bg-white"
              />
              <select
                required
                value={guruKelompokAdmin}
                onChange={(e) => setGuruKelompokAdmin(e.target.value)}
                className="p-3 border rounded-xl text-xs font-bold bg-white"
              >
                <option value="" disabled>
                  -- Pilih Pengajar --
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
                className="bg-indigo-600 text-white font-black py-3 rounded-xl text-xs"
              >
                + Buat Rombel
              </button>
            </form>
          </div>
        )}

        {adminTabAktif === "kategori" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Hierarki Jenjang & Prodi</h2>
              <button
                onClick={() => setModalKategori(true)}
                className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold"
              >
                + Tambah Kelas / Prodi
              </button>
            </div>
            <div className="space-y-4">
              {daftarJenjang.map((j) => (
                <div key={j.id} className="p-4 border rounded-2xl bg-slate-50">
                  <h3 className="font-black text-xs mb-2 uppercase">{j.nama}</h3>
                  <div className="flex flex-wrap gap-2">
                    {j.subJenjang.map((sj) => (
                      <span
                        key={sj.id}
                        className="bg-white text-xs px-3 py-1 rounded-lg border font-bold"
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
            <h2 className="text-xl font-black mb-4">
              Log Audit Pertanggungjawaban Pengguna & Materi
            </h2>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {safeLogList.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border flex justify-between text-xs"
                >
                  <span>
                    <b>
                      [{log.rolePelaku.toUpperCase()}] {log.namaPelaku}:
                    </b>{" "}
                    {log.aksi}
                  </span>
                  <span className="font-mono text-slate-400">{log.waktu}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ==========================================
  // SUB-RENDERER: SISWA VIEW (PILIH MATERI YANG DIIKUTI)
  // ==========================================
  const renderSiswaView = () => {
    const kelasSaya = daftarKelompok.filter((k) =>
      userLogin ? k.siswaIds.includes(userLogin.id) : false
    );
    const minatSaya = userLogin?.minatSubJenjang || [];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-white/50 overflow-hidden bg-emerald-800 flex items-center justify-center text-2xl font-black">
              {userLogin?.cv?.fotoUrl ? (
                <img
                  src={userLogin.cv.fotoUrl}
                  alt={userLogin.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                userLogin?.nama.charAt(0)
              )}
            </div>
            <div>
              <span className="bg-white/20 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                Akun Pelajar Terverifikasi
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Halo, {userLogin?.nama}!</h1>
              <p className="text-emerald-100 text-xs">
                Mengikuti <b>{minatSaya.length} Tingkat Kelas</b> • Total XP: <b>{poinXP} XP</b>
              </p>
            </div>
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

        <div className="flex gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setSiswaTabAktif("kelas")}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 ${
              siswaTabAktif === "kelas"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 border"
            }`}
          >
            <School className="w-4 h-4" /> Rombel & Pengumuman ({kelasSaya.length})
          </button>
          <button
            onClick={() => setSiswaTabAktif("minat")}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 ${
              siswaTabAktif === "minat"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 border"
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Pilih Kelas/Materi yang Diikuti ({minatSaya.length})
          </button>
          <button
            onClick={() => setSiswaTabAktif("cv")}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 ${
              siswaTabAktif === "cv"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 border"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Profil & CV Saya
          </button>
        </div>

        {siswaTabAktif === "cv" && renderProfilDanCV()}

        {siswaTabAktif === "minat" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900">
              Sesuaikan Kelas & Materi yang Ingin Kamu Ikuti
            </h2>
            <p className="text-xs text-slate-500">
              Centang tingkat kelas atau persiapan tes (seperti TPA / TOEFL) di bawah ini agar
              beranda Ruang Kelas hanya menampilkan materi yang relevan untukmu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {semuaSubJenjangFlat.map((sj) => {
                const aktif = minatSaya.includes(sj.id);
                return (
                  <label
                    key={sj.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                      aktif ? "border-emerald-500 bg-emerald-50/60" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={aktif}
                      onChange={() => toggleMinatSubJenjangSiswa(sj.id)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-400">
                        {sj.namaInduk}
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">{sj.nama}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {siswaTabAktif === "kelas" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-4">Ruang Kelas (Rombel) & Pengumuman Guru</h2>
            {kelasSaya.length === 0 ? (
              <p className="text-sm text-slate-500">
                Anda belum dimasukkan ke dalam rombel khusus oleh Guru/Admin.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kelasSaya.map((k) => (
                  <div
                    key={k.id}
                    className="p-5 border rounded-2xl bg-emerald-50/50 border-emerald-200 space-y-2"
                  >
                    <div className="font-black text-emerald-950 text-base">{k.namaKelas}</div>
                    <div className="text-xs text-slate-600">
                      Pengajar:{" "}
                      <b>{safeAkunList.find((a) => a.id === k.guruId)?.nama || "Guru"}</b>
                    </div>
                    {k.pengumuman && (
                      <div className="p-3 bg-white border border-emerald-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <b>Pengumuman:</b> {k.pengumuman}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
                Gratis & Terverifikasi
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "beranda", label: "Ruang Kelas" },
              { id: "tryout", label: "Tryout CBT (TPA / TOEFL)" },
              { id: "forum", label: "Forum Tanya PR" },
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

          <div className="flex items-center gap-2.5 relative">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>

            {userLogin && (
              <div className="relative">
                <button
                  onClick={() => setBukaMenuNotif(!bukaMenuNotif)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition"
                >
                  <Bell className="w-4 h-4" />
                  {jumlahNotifBelumDibaca > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {jumlahNotifBelumDibaca}
                    </span>
                  )}
                </button>

                {bukaMenuNotif && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50">
                    <div className="flex justify-between items-center border-b pb-2.5 mb-3">
                      <span className="font-black text-sm">Kotak Masuk Notifikasi</span>
                      <button
                        onClick={tandaiSemuaNotifDibaca}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Tandai Dibaca
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {notifikasiUserAktif.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-2xl border text-xs ${
                            n.dibaca ? "bg-slate-50" : "bg-indigo-50/70 border-indigo-200"
                          }`}
                        >
                          <div className="flex justify-between font-black">
                            <span>{n.judul}</span>
                            <span className="text-[10px] text-slate-400">{n.waktu}</span>
                          </div>
                          <p className="text-slate-700 my-1">{n.pesan}</p>
                          <div className="text-[10px] font-bold text-indigo-600">
                            Dari: {n.pengirim}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className="relative px-4 py-2 rounded-full text-xs font-extrabold shadow-sm bg-emerald-600 text-white flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Wajib Masuk / Daftar"}</span>
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
        {/* GERBANG WAJIB REGISTRASI JIKA BELUM LOGIN */}
        {!userLogin ? (
          renderAuthView()
        ) : (
          <>
            {menuAktif === "dashboard" && (
              <div>
                {userLogin.role === "admin" && renderAdminView()}
                {userLogin.role === "guru" && renderGuruView()}
                {userLogin.role === "siswa" && renderSiswaView()}
              </div>
            )}

            {/* MENU TRYOUT CBT PRO (TPA, TOEP, TOEFL, UTBK & FULLSCREEN ANTI-CHEAT) */}
            {menuAktif === "tryout" && (
              <div className="max-w-5xl mx-auto">
                {!sedangUjian && !ujianSelesai && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl flex flex-wrap justify-between items-center gap-6">
                      <div>
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                          Proctored CBT System
                        </span>
                        <h1 className="text-3xl font-black mt-3 mb-2">
                          Pusat Ujian Tryout, TPA, TOEP & TOEFL
                        </h1>
                        <p className="text-xs text-indigo-200 max-w-xl">
                          Dilengkapi proteksi <b>Layar Penuh (Fullscreen)</b> otomatis dan sensor
                          anti-curang (mendeteksi <b>Alt+Tab</b> atau pindah jendela). Maksimal 3x
                          pelanggaran sebelum diskualifikasi otomatis.
                        </p>
                      </div>
                      {(userLogin.role === "guru" || userLogin.role === "admin") && (
                        <button
                          onClick={() => {
                            if (userLogin.role === "admin") setAdminModeGuru(true);
                            setGuruTabAktif("tryout_builder");
                            setMenuAktif("dashboard");
                          }}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs shadow-lg"
                        >
                          + Rancang Paket Tes Baru (Guru)
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["Semua", "TPA", "TOEP", "TOEFL", "UTBK", "Akademik"].map((kat) => (
                        <button
                          key={kat}
                          onClick={() => setFilterKategoriTryout(kat)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black border transition ${
                            filterKategoriTryout === kat
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white text-slate-700"
                          }`}
                        >
                          {kat === "Semua" ? "Semua Kategori Tes" : `Tes ${kat}`}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {daftarPaketTryout
                        .filter(
                          (p) =>
                            filterKategoriTryout === "Semua" ||
                            p.kategoriTes === filterKategoriTryout
                        )
                        .map((pkt) => {
                          const percobaanUser = riwayatTryout.filter(
                            (r) => r.paketId === pkt.id && r.userId === userLogin.id
                          ).length;
                          return (
                            <div
                              key={pkt.id}
                              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs flex flex-col justify-between space-y-5"
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                                    Kategori: {pkt.kategoriTes} • {pkt.jenjang}
                                  </span>
                                  <span className="text-xs font-bold text-slate-500">
                                    {pkt.daftarSoal.length} Butir Soal
                                  </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900">{pkt.judul}</h3>

                                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>
                                      Penguji: <b>{pkt.pembuatNama}</b>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span>
                                      Lokasi/Alamat: <b>{pkt.alamatLokasi}</b>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>
                                      Jadwal Ujian: <b>{pkt.jadwalUjian}</b>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Repeat className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>
                                      Batas Percobaan:{" "}
                                      <b>
                                        {percobaanUser} / {pkt.batasPercobaan} kali
                                      </b>{" "}
                                      • Durasi: <b>{pkt.durasiMenit} Menit</b>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => mulaiUjianTryout(pkt)}
                                disabled={percobaanUser >= pkt.batasPercobaan}
                                className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition ${
                                  percobaanUser >= pkt.batasPercobaan
                                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                              >
                                <Maximize2 className="w-4 h-4" />
                                {percobaanUser >= pkt.batasPercobaan
                                  ? "Batas Percobaan Habis"
                                  : "Mulai Ujian (Mode Fullscreen Anti-Cheat)"}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* SAAT UJIAN BERLANGSUNG (PROCTORED FULLSCREEN) */}
                {sedangUjian && paketTryoutAktif && (
                  <div className="space-y-4">
                    {/* Banner Status Keamanan Anti-Cheat */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-2.5 text-xs">
                        <Eye className="w-5 h-5 text-emerald-400" />
                        <span>
                          <b>Proctoring Aktif:</b> {paketTryoutAktif.judul} ({paketTryoutAktif.alamatLokasi})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-black ${
                            jumlahPelanggaranUjian > 0
                              ? "bg-rose-600 text-white"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          Pelanggaran Alt+Tab: {jumlahPelanggaranUjian} /{" "}
                          {paketTryoutAktif.batasPelanggaran}
                        </span>
                        <span className="font-mono text-lg font-black bg-white/10 px-3 py-1 rounded-lg text-amber-300">
                          {Math.floor(sisaWaktu / 60)}:
                          {(sisaWaktu % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {pesanPeringatanCheat && (
                      <div className="p-4 bg-rose-600 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>{pesanPeringatanCheat}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-3">
                          <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                            Soal #{indeksSoalTryoutAktif + 1} dari{" "}
                            {paketTryoutAktif.daftarSoal.length}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Kategori: {paketTryoutAktif.kategoriTes}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-lg text-slate-900">
                          {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].pertanyaan}
                        </h3>

                        {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].rumus && (
                          <div className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl">
                            Subtes / Petunjuk:{" "}
                            {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].rumus}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-3">
                          {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].opsi.map(
                            (ops, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  setJawabanUserTryout((p) => ({
                                    ...p,
                                    [indeksSoalTryoutAktif]: idx,
                                  }))
                                }
                                className={`p-4 rounded-2xl border-2 text-sm font-bold text-left transition ${
                                  jawabanUserTryout[indeksSoalTryoutAktif] === idx
                                    ? "bg-indigo-50 border-indigo-600 text-indigo-900"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}. {ops}
                              </button>
                            )
                          )}
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t">
                          <button
                            disabled={indeksSoalTryoutAktif === 0}
                            onClick={() => setIndeksSoalTryoutAktif((i) => Math.max(0, i - 1))}
                            className="px-5 py-2.5 rounded-xl border font-bold text-xs disabled:opacity-40"
                          >
                            ← Sebelumnya
                          </button>

                          <button
                            onClick={() =>
                              setRaguRaguTryout((prev) =>
                                prev.includes(indeksSoalTryoutAktif)
                                  ? prev.filter((x) => x !== indeksSoalTryoutAktif)
                                  : [...prev, indeksSoalTryoutAktif]
                              )
                            }
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                              raguRaguTryout.includes(indeksSoalTryoutAktif)
                                ? "bg-amber-400 text-slate-950"
                                : "bg-amber-50 text-amber-800 border"
                            }`}
                          >
                            <Flag className="w-4 h-4" /> Ragu-Ragu
                          </button>

                          {indeksSoalTryoutAktif < paketTryoutAktif.daftarSoal.length - 1 ? (
                            <button
                              onClick={() =>
                                setIndeksSoalTryoutAktif((i) =>
                                  Math.min(paketTryoutAktif.daftarSoal.length - 1, i + 1)
                                )
                              }
                              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                            >
                              Selanjutnya →
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                selesaikanTryoutOtomatis(jumlahPelanggaranUjian, "Selesai Normal")
                              }
                              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs"
                            >
                              Kumpulkan Ujian
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-white p-6 rounded-3xl border shadow-sm h-max space-y-4">
                        <h4 className="font-black text-sm">Navigasi Nomor Soal</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {paketTryoutAktif.daftarSoal.map((s, idx) => {
                            const sudahDijawab = jawabanUserTryout[idx] !== undefined;
                            const isRagu = raguRaguTryout.includes(idx);
                            return (
                              <button
                                key={s.id}
                                onClick={() => setIndeksSoalTryoutAktif(idx)}
                                className={`p-3 rounded-xl font-black text-xs border-2 ${
                                  indeksSoalTryoutAktif === idx
                                    ? "border-slate-900"
                                    : "border-transparent"
                                } ${
                                  isRagu
                                    ? "bg-amber-400 text-slate-950"
                                    : sudahDijawab
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() =>
                            selesaikanTryoutOtomatis(jumlahPelanggaranUjian, "Selesai Normal")
                          }
                          className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-xs shadow-md"
                        >
                          Selesai & Kumpulkan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {ujianSelesai && paketTryoutAktif && (
                  <div className="space-y-6">
                    <div className="bg-white p-10 rounded-3xl border text-center shadow-lg space-y-3">
                      <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
                      <h2 className="text-4xl font-black">Skor Akhir: {skorTryout} / 100</h2>
                      <p className="text-xs font-bold text-slate-500">
                        Total Pelanggaran Terdeteksi: {jumlahPelanggaranUjian} kali
                      </p>
                      <button
                        onClick={() => {
                          setUjianSelesai(false);
                          setSedangUjian(false);
                          setPaketTryoutAktif(null);
                        }}
                        className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs"
                      >
                        Kembali ke Daftar Paket Tryout
                      </button>
                    </div>

                    <div className="space-y-4">
                      {paketTryoutAktif.daftarSoal.map((soal, idx) => {
                        const jwbUser = jawabanUserTryout[idx];
                        const isBenar = jwbUser === soal.jawabanBenar;
                        return (
                          <div key={soal.id} className="bg-white p-6 rounded-3xl border space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black">Soal #{idx + 1}</span>
                              <span
                                className={`text-xs font-black px-3 py-1 rounded-full ${
                                  isBenar
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {isBenar ? "Benar" : "Salah"}
                              </span>
                            </div>
                            <p className="font-bold text-sm">{soal.pertanyaan}</p>
                            <div className="text-xs text-slate-600">
                              Kunci Jawaban: <b>{soal.opsi[soal.jawabanBenar]}</b>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border">
                              <b>Pembahasan:</b> {soal.pembahasan}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MENU FORUM DISKUSI & TANYA PR */}
            {menuAktif === "forum" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-8 border rounded-3xl shadow-sm">
                  <h2 className="font-black text-2xl mb-4 flex items-center gap-2">
                    <HelpCircle className="text-emerald-600" /> Forum Diskusi Terverifikasi
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!tanyaBaru.trim()) return;
                      setDaftarDiskusi([
                        {
                          id: "pr-" + Date.now(),
                          penanya: `${userLogin.nama} (${userLogin.email})`,
                          jenjang: jenjangTanyaBaru,
                          mapel: mapelBaru,
                          judul: judulTanyaBaru || "Pertanyaan Diskusi",
                          pertanyaan: tanyaBaru,
                          gambarUrl: gambarTanyaBaru || undefined,
                          waktu: "Baru saja",
                          likes: 0,
                          solved: false,
                          jawaban: [],
                        },
                        ...daftarDiskusi,
                      ]);
                      setJudulTanyaBaru("");
                      setTanyaBaru("");
                      setGambarTanyaBaru("");
                      tambahXP(20);
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={judulTanyaBaru}
                        onChange={(e) => setJudulTanyaBaru(e.target.value)}
                        placeholder="Judul Topik / Soal..."
                        className="p-3.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      />
                      <select
                        value={jenjangTanyaBaru}
                        onChange={(e) => setJenjangTanyaBaru(e.target.value)}
                        className="p-3.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      >
                        <option value="SD / MI">SD / MI</option>
                        <option value="SMP / MTs">SMP / MTs</option>
                        <option value="SMA / SMK">SMA / SMK</option>
                        <option value="Kuliah & TPA/TOEFL">Kuliah & TPA/TOEFL</option>
                      </select>
                      <input
                        type="text"
                        required
                        value={mapelBaru}
                        onChange={(e) => setMapelBaru(e.target.value)}
                        placeholder="Mata Pelajaran..."
                        className="p-3.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <textarea
                      rows={3}
                      required
                      value={tanyaBaru}
                      onChange={(e) => setTanyaBaru(e.target.value)}
                      placeholder="Ketik detail pertanyaan PR kamu di sini..."
                      className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
                    </button>
                  </form>
                </div>

                {daftarDiskusi.map((d) => (
                  <div key={d.id} className="bg-white p-6 border rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                          {d.jenjang} • {d.mapel}
                        </span>
                        <h3 className="font-black text-lg mt-1">{d.judul}</h3>
                        <div className="text-xs text-slate-400">
                          Oleh: <b>{d.penanya}</b> • {d.waktu}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setDaftarDiskusi(
                            daftarDiskusi.map((x) =>
                              x.id === d.id ? { ...x, likes: x.likes + 1 } : x
                            )
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> {d.likes}
                      </button>
                    </div>
                    <p className="text-sm text-slate-700">{d.pertanyaan}</p>
                    <div className="space-y-2 pl-4 border-l-2 border-emerald-300">
                      {d.jawaban.map((j) => (
                        <div key={j.id} className="p-3 rounded-2xl text-xs bg-slate-50 border">
                          <b>{j.penjawab}:</b> {j.isi}
                        </div>
                      ))}
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
                  Seluruh akses belajar dan ujian 100% gratis. Donasi sukarela digunakan murni untuk
                  perpanjangan server & domain hibahilmu.id.
                </p>
              </div>
            )}

            {/* BERANDA RUANG KELAS (DENGAN FILTER MATERI SESUAI MINAT SISWA & INFO PENGUPLOAD) */}
            {menuAktif === "beranda" && (
              <div>
                {!jenjangAktif && !kelasAktif && (
                  <div className="space-y-10">
                    <div className="text-center max-w-4xl mx-auto pt-2">
                      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-4 leading-tight">
                        Satu Platform Sejuta Ilmu, <br />
                        <span className="text-emerald-600">
                          Gratis & Dipertanggungjawabkan.
                        </span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mb-6">
                        Login sebagai: <b>{userLogin.nama}</b> ({userLogin.role.toUpperCase()})
                      </p>

                      {userLogin.role === "siswa" && (
                        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-2xl border shadow-2xs mb-6">
                          <button
                            onClick={() => setHanyaMateriDiikuti(true)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                              hanyaMateriDiikuti
                                ? "bg-emerald-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            Hanya Materi Kelas yang Saya Ikuti (
                            {(userLogin.minatSubJenjang || []).length})
                          </button>
                          <button
                            onClick={() => setHanyaMateriDiikuti(false)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                              !hanyaMateriDiikuti
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            Tampilkan Semua Katalog Jenjang
                          </button>
                          <button
                            onClick={() => {
                              setSiswaTabAktif("minat");
                              setMenuAktif("dashboard");
                            }}
                            className="px-3 py-2 text-xs font-bold text-indigo-600 underline"
                          >
                            + Ubah Pilihan Kelas
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {daftarJenjang
                        .filter((j) => {
                          if (userLogin.role === "siswa" && hanyaMateriDiikuti) {
                            const minat = userLogin.minatSubJenjang || [];
                            return j.subJenjang.some((sj) => minat.includes(sj.id));
                          }
                          return true;
                        })
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
                              <span>Buka Materi Kelas</span>
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
                      className="mb-6 bg-white px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Kembali ke Jenjang
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
                        Semua Tingkat yang Sesuai
                      </button>
                      {jenjangAktif.subJenjang
                        .filter((sj) => {
                          if (userLogin.role === "siswa" && hanyaMateriDiikuti) {
                            return (userLogin.minatSubJenjang || []).includes(sj.id);
                          }
                          return true;
                        })
                        .map((sj) => (
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
                        .filter((k) => {
                          const cocokSub =
                            subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif;
                          if (userLogin.role === "siswa" && hanyaMateriDiikuti) {
                            return (
                              cocokSub &&
                              (userLogin.minatSubJenjang || []).includes(k.subJenjangId)
                            );
                          }
                          return cocokSub;
                        })
                        .map((k) => (
                          <div
                            key={k.id}
                            onClick={() => setKelasAktif(k)}
                            className="bg-white p-6 border-2 rounded-3xl cursor-pointer hover:shadow-lg transition flex flex-col justify-between space-y-4"
                          >
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg">
                                  {jenjangAktif.subJenjang.find((s) => s.id === k.subJenjangId)
                                    ?.nama || "Umum"}
                                </span>
                                {materiSelesai.includes(k.id) && (
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                    Selesai
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold mb-2">{k.judul}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                {bersihkanTagHtml(k.rangkuman)}
                              </p>
                              {/* Badge Pertanggungjawaban Pengupload */}
                              <div className="p-2.5 bg-slate-50 border rounded-xl text-[11px] text-slate-600">
                                Diunggah oleh: <b>{k.pembuatNama}</b> ({k.pembuatEmail}) •{" "}
                                {k.tanggalUpload}
                              </div>
                            </div>
                            <div className="pt-3 border-t flex justify-between items-center text-sm font-bold text-indigo-600">
                              <span className="flex items-center gap-1.5">
                                <PlayCircle className="w-5 h-5" /> Buka Materi & Kuis
                              </span>
                              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                                +XP
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
                        {materiSelesai.includes(kelasAktif.id)
                          ? "Selesai (+30 XP)"
                          : "Tandai Selesai"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border shadow-2xs">
                          <div className="aspect-video bg-slate-900 rounded-2xl mb-6 overflow-hidden">
                            <iframe
                              src={kelasAktif.videoUrl}
                              title={kelasAktif.judul}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                          <h1 className="text-2xl font-black mb-2">{kelasAktif.judul}</h1>
                          <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                            <b>Penanggung Jawab Materi:</b> {kelasAktif.pembuatNama} (
                            {kelasAktif.pembuatEmail}) • Diunggah: {kelasAktif.tanggalUpload}
                          </div>

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
                      </div>

                      {/* PANEL EVALUASI 5 TIPE SOAL KUIS */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-md">
                          <h3 className="font-black text-base flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-amber-500" /> Evaluasi Kuis (
                            {kelasAktif.daftarKuis.length} Soal)
                          </h3>

                          <div className="space-y-6">
                            {kelasAktif.daftarKuis.map((kuis, idxKuis) => {
                              const statusJawab = statusKuisSiswa[kuis.id];
                              return (
                                <div
                                  key={kuis.id}
                                  className="p-4 rounded-2xl bg-slate-50 border space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                                      Soal #{idxKuis + 1} • {kuis.tipe.replace("_", " ")}
                                    </span>
                                    <span className="text-[11px] font-bold text-amber-700">
                                      +{kuis.poin} XP
                                    </span>
                                  </div>

                                  <p className="font-bold text-sm text-slate-900">{kuis.tanya}</p>

                                  {(kuis.tipe === "pilihan_ganda" ||
                                    kuis.tipe === "benar_salah") && (
                                    <div className="space-y-2">
                                      {kuis.opsi.map((opsi, idxOpsi) => (
                                        <button
                                          key={idxOpsi}
                                          onClick={() => {
                                            setJawabanPilihanSiswa({
                                              ...jawabanPilihanSiswa,
                                              [kuis.id]: idxOpsi,
                                            });
                                            if (idxOpsi === kuis.jawabanBenar) {
                                              if (statusKuisSiswa[kuis.id] !== "benar") {
                                                tambahXP(kuis.poin);
                                              }
                                              setStatusKuisSiswa({
                                                ...statusKuisSiswa,
                                                [kuis.id]: "benar",
                                              });
                                            } else {
                                              setStatusKuisSiswa({
                                                ...statusKuisSiswa,
                                                [kuis.id]: "salah",
                                              });
                                            }
                                          }}
                                          className={`w-full text-left p-3 rounded-xl border-2 font-semibold text-xs ${
                                            jawabanPilihanSiswa[kuis.id] === idxOpsi
                                              ? statusJawab === "benar"
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-rose-500 bg-rose-50"
                                              : "bg-white border-slate-200"
                                          }`}
                                        >
                                          {opsi}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {kuis.tipe === "mencocokkan" && (
                                    <div className="space-y-2">
                                      {(kuis.pasangan || []).map((pas, idxP) => {
                                        const mapPilihan = jawabanCocokSiswa[kuis.id] || {};
                                        return (
                                          <div
                                            key={idxP}
                                            className="grid grid-cols-2 gap-2 items-center bg-white p-2 rounded-xl border"
                                          >
                                            <span className="text-xs font-bold">{pas.kiri}</span>
                                            <select
                                              value={mapPilihan[idxP] || ""}
                                              onChange={(e) =>
                                                setJawabanCocokSiswa({
                                                  ...jawabanCocokSiswa,
                                                  [kuis.id]: {
                                                    ...mapPilihan,
                                                    [idxP]: e.target.value,
                                                  },
                                                })
                                              }
                                              className="p-2 border rounded-lg text-xs font-bold bg-slate-50"
                                            >
                                              <option value="">-- Pilih --</option>
                                              {(kuis.pasangan || []).map((pOpsi, iOpsi) => (
                                                <option key={iOpsi} value={pOpsi.kanan}>
                                                  {pOpsi.kanan}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        );
                                      })}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const mapPilihan = jawabanCocokSiswa[kuis.id] || {};
                                          const semuaBenar = (kuis.pasangan || []).every(
                                            (pas, idxP) => mapPilihan[idxP] === pas.kanan
                                          );
                                          if (semuaBenar) {
                                            if (statusKuisSiswa[kuis.id] !== "benar") {
                                              tambahXP(kuis.poin);
                                            }
                                            setStatusKuisSiswa({
                                              ...statusKuisSiswa,
                                              [kuis.id]: "benar",
                                            });
                                          } else {
                                            setStatusKuisSiswa({
                                              ...statusKuisSiswa,
                                              [kuis.id]: "salah",
                                            });
                                          }
                                        }}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold"
                                      >
                                        Periksa Pasangan
                                      </button>
                                    </div>
                                  )}

                                  {statusJawab === "benar" && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold">
                                      Benar! {kuis.pembahasan}
                                    </div>
                                  )}
                                  {statusJawab === "salah" && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold">
                                      Belum tepat, coba lagi!
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* MODAL ADMIN: TAMBAH / EDIT AKUN */}
        {modalAdminAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-black mb-4">
                {idEditAkun ? "Edit Akun & Hak Akses" : "Buat Akun Baru"}
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
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={roleFormAdmin}
                    onChange={(e) =>
                      setRoleFormAdmin(e.target.value as "admin" | "guru" | "siswa")
                    }
                    className="p-3 border rounded-xl font-bold"
                  >
                    <option value="siswa">Siswa / Mahasiswa</option>
                    <option value="guru">Guru / Instruktur</option>
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
                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl"
                  >
                    Simpan
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

        {/* MODAL IMPORT AKUN */}
        {modalImportAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black">Import Akun Massal (CSV / JSON)</h3>
              <button
                type="button"
                onClick={() => setTeksImportAkun(TEMPLATE_CSV_AKUN)}
                className="text-xs font-bold text-indigo-600 underline"
              >
                Muat Contoh CSV Akun
              </button>
              <form onSubmit={handleProsesImportAkun} className="space-y-3">
                <textarea
                  rows={6}
                  required
                  value={teksImportAkun}
                  onChange={(e) => setTeksImportAkun(e.target.value)}
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

        {/* MODAL IMPORT KUIS */}
        {modalImportKuis && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black">Import Soal Kuis (CSV Excel)</h3>
              <button
                type="button"
                onClick={() => setTeksImportKuis(TEMPLATE_CSV_KUIS)}
                className="text-xs font-bold text-indigo-600 underline"
              >
                Muat Contoh CSV 5 Tipe Soal
              </button>
              <form onSubmit={handleProsesImportKuis} className="space-y-3">
                <textarea
                  rows={6}
                  required
                  value={teksImportKuis}
                  onChange={(e) => setTeksImportKuis(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs"
                  >
                    Masukkan ke Materi
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalImportKuis(false)}
                    className="px-5 py-3 bg-slate-100 rounded-xl font-bold text-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH KATEGORI */}
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
                  placeholder="Contoh: Persiapan TOEP / S1 Teknik..."
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
        Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • HibahIlmu.id (100% Gratis &
        Terverifikasi)
      </footer>
    </div>
  );
}