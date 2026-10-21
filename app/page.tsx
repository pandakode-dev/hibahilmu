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
  Moon,
  Sun,
  Award,
  Video,
  ClipboardCheck,
  Printer,
  Database,
  BarChart3,
  Clock,
  Type,
  HeartHandshake,
  Rocket,
  Layers3,
  Star,
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

export interface PesanChatMateri {
  id: string;
  pengirimNama: string;
  pengirimRole: string;
  pesan: string;
  waktu: string;
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
  penyumbangNama?: string;
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
  paketJudul: string;
  userId: string;
  userNama: string;
  skor: number;
  jumlahPelanggaran: number;
  waktuSelesai: string;
  statusAkhir: "Selesai Normal" | "Diskualifikasi (Auto-Submit)";
}

export interface TugasItem {
  id: string;
  subJenjangId: string;
  judul: string;
  instruksi: string;
  deadline: string;
  pembuatNama: string;
}

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  siswaId: string;
  siswaNama: string;
  jawabanTeksAtauLink: string;
  waktuKumpul: string;
  nilai?: number;
  feedbackGuru?: string;
}

export interface PresensiItem {
  id: string;
  siswaId: string;
  siswaNama: string;
  materiJudul: string;
  waktuHadir: string;
}

export interface JadwalLiveItem {
  id: string;
  judulSesi: string;
  pengajarNama: string;
  tanggalJam: string;
  meetingUrl: string;
  targetKelas: string;
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
  xp?: number;
  aksesMengajar?: string[];
  minatSubJenjang?: string[];
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
const TEMPLATE_CSV_AKUN = `nama,email,password,role,infoTambahan
Dewi Lestari S.Pd,dewi.csv@hibahilmu.id,123,guru,Instruktur TOEFL & TOEP
Ahmad Fauzi,ahmad.csv@hibahilmu.id,123,siswa,Siswa Kelas 12 MIPA
Siti Nurhaliza,siti.csv@hibahilmu.id,123,siswa,Mahasiswi S1 Informatika`;

const TEMPLATE_CSV_KUIS = `tipe,tanya,opsi_atau_pasangan,kunci,pembahasan,poin,gambarUrl
pilihan_ganda,Ibukota provinsi Riau adalah...,Pekanbaru|Dumai|Padang|Medan,0,Pekanbaru adalah ibukota provinsi Riau,50,
pilihan_jamak,Pilih bilangan prima di bawah ini (Lebih dari 1),2|4|5|9,0|2,Angka 2 dan 5 adalah bilangan prima,60,
benar_salah,Air mendidih pada suhu 100 derajat Celcius di tekanan 1 atm.,Benar|Salah,0,Pada tekanan 1 atm titik didih air adalah 100 C,30,
isian_singkat,Berapakah hasil dari 15 ditambah 25?,,40,15 + 25 = 40,40,
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
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi interaktif yang ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    badge: "bg-rose-100 text-rose-800",
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
    badge: "bg-amber-100 text-amber-900",
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
    badge: "bg-sky-100 text-sky-900",
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
    badge: "bg-purple-100 text-purple-900",
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
    badge: "bg-emerald-100 text-emerald-900",
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
        opsi: [
          "Memilih yang terbaik dari berbagai sumber",
          "Sangat kuno",
          "Bersifat memaksa",
          "Tidak beraturan",
        ],
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
    batasPercobaan: 2,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "tf-1",
        pertanyaan: "The North Pole _____ a latitude of 90 degrees north.",
        rumus: "Subject-Verb Agreement (Singular Subject)",
        opsi: ["has", "is having", "which is having", "it has"],
        jawabanBenar: 0,
        pembahasan: "Subjek tunggal 'The North Pole' menggunakan kata kerja tunggal 'has'.",
      },
    ],
  },
];

const BANK_SOAL_KOLEKTIF_AWAL: SoalTryout[] = [
  {
    id: "bs-1",
    pertanyaan: "ANTONIM dari kata 'SPORADIS' adalah...",
    rumus: "TPA Verbal - Antonim",
    opsi: ["Jarang", "Kerap / Terus-menerus", "Terpisah", "Lambat"],
    jawabanBenar: 1,
    pembahasan: "Sporadis berarti kadang-kadang/jarang, sehingga lawan katanya adalah kerap/terus-menerus.",
    penyumbangNama: "Bapak Budi Santoso, M.Pd",
  },
  {
    id: "bs-2",
    pertanyaan: "Dalam Reinforcement Learning, fungsi yang mengevaluasi seberapa baik suatu state-action pair disebut...",
    rumus: "Artificial Intelligence & Machine Learning",
    opsi: ["Q-Function (Action-Value)", "Loss Function", "Activation ReLU", "Dropout Layer"],
    jawabanBenar: 0,
    pembahasan: "Q-Function menghitung ekspektasi total reward dari suatu state dan action.",
    penyumbangNama: "Admin Panda Kode",
  },
];

const TUGAS_AWAL: TugasItem[] = [
  {
    id: "tgs-1",
    subJenjangId: "sma-11-ipa",
    judul: "Laporan Praktikum Hukum II Newton",
    instruksi: "Tuliskan kesimpulan hubungan antara gaya, massa, dan percepatan beserta link dokumen laporanmu.",
    deadline: "25 Okt 2026, 23:59 WIB",
    pembuatNama: "Bapak Budi Santoso, M.Pd",
  },
  {
    id: "tgs-2",
    subJenjangId: "pt-ti",
    judul: "Analisis Use Case Apache Kafka & Sqoop di Telekomunikasi",
    instruksi: "Kumpulkan ringkasan arsitektur pipeline Big Data beserta referensi IEEE.",
    deadline: "28 Okt 2026, 23:59 WIB",
    pembuatNama: "Admin Panda Kode",
  },
];

const PENGUMPULAN_AWAL: PengumpulanTugas[] = [
  {
    id: "sub-1",
    tugasId: "tgs-1",
    siswaId: "sis-1",
    siswaNama: "Aisyah Putri",
    jawabanTeksAtauLink: "Percepatan berbanding lurus dengan gaya resultan. Link PDF: https://drive.google.com/laporan-aisyah",
    waktuKumpul: "Kemarin, 19:30 WIB",
    nilai: 95,
    feedbackGuru: "Analisis sangat rapi dan tepat!",
  },
];

const JADWAL_LIVE_AWAL: JadwalLiveItem[] = [
  {
    id: "live-1",
    judulSesi: "Klinik Bedah Soal TPA Bappenas & TOEFL Structure",
    pengajarNama: "Bapak Budi Santoso, M.Pd",
    tanggalJam: "Sabtu, 24 Okt 2026 • 19:30 WIB",
    meetingUrl: "https://meet.google.com",
    targetKelas: "SMA & Kuliah",
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
    xp: 950,
    aksesMengajar: ["sma-11-ipa", "pt-ti", "pt-tpa", "pt-toefl"],
    minatSubJenjang: ["pt-ti", "pt-tpa"],
    cv: {
      fotoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: "System Architect & EdTech Founder",
      bioSingkat: "Mengembangkan ekosistem pendidikan terbuka gratis yang terverifikasi.",
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
    xp: 620,
    aksesMengajar: ["sma-10", "sma-11-ipa", "sma-12-ipa", "sd-4", "pt-tpa", "pt-toefl"],
    minatSubJenjang: ["sma-11-ipa"],
    cv: {
      fotoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
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
    xp: 480,
    aksesMengajar: [],
    minatSubJenjang: ["sma-11-ipa", "pt-toefl"],
    cv: {
      fotoUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
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
  {
    id: "sis-2",
    nama: "Reza Pratama",
    email: "reza@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Mahasiswa S1 Teknik Informatika",
    waktuDaftar: "Hari ini, 08:00",
    xp: 390,
    aksesMengajar: [],
    minatSubJenjang: ["pt-ti", "pt-tpa"],
  },
];

const NOTIF_AWAL: NotifikasiItem[] = [
  {
    id: "notif-1",
    targetUserId: "sis-1",
    judul: "Jadwal Tryout TPA & Fisika",
    pesan:
      "Simulasi Tryout menggunakan sistem Fullscreen Anti-Cheat. Dilarang menekan Alt+Tab saat ujian!",
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
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Konsep</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Penjelasan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Poin 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">Detail 1</td>
          </tr>
        </tbody>
      </table><p><br/></p>
    `;
    sisipkanHtml(tabelHtml);
  };

  const tambahKotakInfo = () => {
    const boxHtml = `
      <div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 14px 18px; border-radius: 10px; margin: 12px 0; color: #1e1b4b;">
        <b>Catatan Penting:</b> Tuliskan rangkuman inti di sini...
      </div><p><br/></p>
    `;
    sisipkanHtml(boxHtml);
  };

  return (
    <div className="border border-slate-300 rounded-2xl bg-white text-slate-800 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition">
      <div className="bg-slate-100 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1.5">
        <select
          onChange={(e) => eksekusiCommand("formatBlock", e.target.value)}
          defaultValue="P"
          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 mr-1"
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
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("italic")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Miring"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("underline")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
          title="Garis Bawah"
        >
          <Underline size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("justifyLeft")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyCenter")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyRight")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("insertUnorderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("insertOrderedList")}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("hiliteColor", "#fef08a")}
          className="px-2.5 py-1 bg-yellow-200 rounded-lg text-xs font-bold text-slate-800"
        >
          Stabilo
        </button>
        <button
          type="button"
          onClick={tambahLink}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={tambahGambar}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={tambahTabel}
          className="p-2 hover:bg-white rounded-lg text-slate-700"
        >
          <Table size={16} />
        </button>
        <button
          type="button"
          onClick={tambahKotakInfo}
          className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold flex items-center gap-1"
        >
          <Quote size={14} /> Callout
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="p-5 min-h-[180px] max-h-[360px] overflow-y-auto text-base outline-none prose prose-slate max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
};

// ==========================================
// 3. KOMPONEN UTAMA APLIKASI
// ==========================================
export default function AplikasiHibahIlmu() {
  // FITUR DARK MODE, UKURAN TEKS & EFEK 3D INTERAKTIF
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ukuranTeksBesar, setUkuranTeksBesar] = useState<boolean>(false);
  const [rotasi3D, setRotasi3D] = useState<{ x: number; y: number }>({ x: 8, y: -12 });

  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(STRUKTUR_AWAL);

  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [subJenjangAktif, setSubJenjangAktif] = useState<string>("semua");
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [hanyaMateriDiikuti, setHanyaMateriDiikuti] = useState<boolean>(false);

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [adminModeGuru, setAdminModeGuru] = useState<boolean>(false);
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);
  const [daftarKelompok, setDaftarKelompok] = useState<KelompokBelajar[]>(KELOMPOK_AWAL);

  // State Notifikasi & Kotak Masuk
  const [daftarNotifikasi, setDaftarNotifikasi] = useState<NotifikasiItem[]>(NOTIF_AWAL);
  const [bukaMenuNotif, setBukaMenuNotif] = useState<boolean>(false);

  // FITUR TUGAS, PRESENSI, CHAT MATERI, BANK SOAL KOLEKTIF, JADWAL LIVE
  const [daftarTugas, setDaftarTugas] = useState<TugasItem[]>(TUGAS_AWAL);
  const [daftarPengumpulan, setDaftarPengumpulan] =
    useState<PengumpulanTugas[]>(PENGUMPULAN_AWAL);
  const [daftarPresensi, setDaftarPresensi] = useState<PresensiItem[]>([]);
  const [chatPerMateri, setChatPerMateri] = useState<{
    [materiId: string]: PesanChatMateri[];
  }>({
    "materi-sma-1": [
      {
        id: "ch-1",
        pengirimNama: "Aisyah Putri",
        pengirimRole: "siswa",
        pesan: "Pak Budi, apakah rumus Energi Kinetik selalu menggunakan satuan kecepatan m/s?",
        waktu: "10:15 WIB",
      },
      {
        id: "ch-2",
        pengirimNama: "Bapak Budi Santoso, M.Pd",
        pengirimRole: "guru",
        pesan: "Betul Aisyah! Jika masih km/jam wajib dikonversi ke m/s terlebih dahulu ya.",
        waktu: "10:18 WIB",
      },
    ],
  });
  const [inputChatMateri, setInputChatMateri] = useState<string>("");
  const [bankSoalKolektif, setBankSoalKolektif] =
    useState<SoalTryout[]>(BANK_SOAL_KOLEKTIF_AWAL);
  const [jadwalLive, setJadwalLive] = useState<JadwalLiveItem[]>(JADWAL_LIVE_AWAL);

  // State Form Tugas & Live Session (Guru)
  const [judulTugasBaru, setJudulTugasBaru] = useState("");
  const [instruksiTugasBaru, setInstruksiTugasBaru] = useState("");
  const [deadlineTugasBaru, setDeadlineTugasBaru] = useState("30 Okt 2026, 23:59 WIB");
  const [targetSubTugasBaru, setTargetSubTugasBaru] = useState("sma-11-ipa");
  const [jawabanTugasSiswaInput, setJawabanTugasSiswaInput] = useState<{
    [tugasId: string]: string;
  }>({});
  const [inputNilaiGuru, setInputNilaiGuru] = useState<{ [subId: string]: number }>({});
  const [inputFeedbackGuru, setInputFeedbackGuru] = useState<{ [subId: string]: string }>({});

  const [judulLiveBaru, setJudulLiveBaru] = useState("");
  const [tanggalLiveBaru, setTanggalLiveBaru] = useState("Minggu, 25 Okt 2026 • 19:00 WIB");
  const [urlLiveBaru, setUrlLiveBaru] = useState("https://meet.google.com");
  const [targetLiveBaru, setTargetLiveBaru] = useState("SMA & Kuliah");

  // State Form Sumbang Bank Soal Kolektif
  const [tanyaKolektifBaru, setTanyaKolektifBaru] = useState("");
  const [rumusKolektifBaru, setRumusKolektifBaru] = useState("");
  const [opsiKolektifA, setOpsiKolektifA] = useState("");
  const [opsiKolektifB, setOpsiKolektifB] = useState("");
  const [opsiKolektifC, setOpsiKolektifC] = useState("");
  const [opsiKolektifD, setOpsiKolektifD] = useState("");
  const [kunciKolektifBaru, setKunciKolektifBaru] = useState<number>(0);
  const [bahasKolektifBaru, setBahasKolektifBaru] = useState("");

  // State Siswa & Jawaban Kuis
  const [poinXP, setPoinXP] = useState<number>(480);
  const [materiSelesai, setMateriSelesai] = useState<string[]>(["materi-sma-1"]);
  const [catatanSiswa, setCatatanSiswa] = useState<string>("");
  const [statusSimpanCatatan, setStatusSimpanCatatan] = useState<boolean>(false);

  const [jawabanPilihanSiswa, setJawabanPilihanSiswa] = useState<{ [kuisId: string]: number }>({});
  const [jawabanCocokSiswa, setJawabanCocokSiswa] = useState<{
    [kuisId: string]: { [idxKiri: number]: string };
  }>({});
  const [statusKuisSiswa, setStatusKuisSiswa] = useState<{
    [kuisId: string]: "benar" | "salah" | null;
  }>({});

  // State Tryout Pro (CBT, Anti-Cheat Fullscreen & Alt-Tab Detector)
  const [daftarPaketTryout, setDaftarPaketTryout] = useState<PaketTryout[]>(PAKET_TRYOUT_AWAL);
  const [riwayatTryout, setRiwayatTryout] = useState<RiwayatPercobaanTryout[]>([
    {
      id: "rw-awal-1",
      paketId: "pkt-tpa-1",
      paketJudul: "Simulasi Akbar TPA (Tes Potensi Akademik) Nasional",
      userId: "sis-1",
      userNama: "Aisyah Putri",
      skor: 90,
      jumlahPelanggaran: 0,
      waktuSelesai: "Kemarin",
      statusAkhir: "Selesai Normal",
    },
  ]);
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

  // State Guru Merancang Paket Tryout Baru
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
  const [judulTanyaBaru, setJudulTanyaBaru] = useState<string>("");
  const [jenjangTanyaBaru, setJenjangTanyaBaru] = useState<string>("SMA / SMK");
  const [mapelBaru, setMapelBaru] = useState<string>("Matematika");
  const [tanyaBaru, setTanyaBaru] = useState<string>("");

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

  const [modalImportAkun, setModalImportAkun] = useState<boolean>(false);
  const [teksImportAkun, setTeksImportAkun] = useState<string>("");
  const [notifImport, setNotifImport] = useState<string>("");

  const [modalKategori, setModalKategori] = useState(false);
  const [targetJenjangKategori, setTargetJenjangKategori] = useState("sma");
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

  // State Navigasi Tab Guru & Siswa
  const [guruTabAktif, setGuruTabAktif] = useState<
    "materi" | "tryout_builder" | "tugas_absensi" | "bank_soal" | "kelas" | "cv"
  >("materi");
  const [siswaTabAktif, setSiswaTabAktif] = useState<
    "kelas" | "tugas" | "rapor_sertifikat" | "minat" | "cv"
  >("kelas");

  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [levelMateri, setLevelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [videoMateri, setVideoMateri] = useState("");
  const [lampiranMateri, setLampiranMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [rumusMateri, setRumusMateri] = useState("");
  const [notifGuru, setNotifGuru] = useState(false);

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
  const [teksImportKuis, setTeksImportKuis] = useState("");

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

  // SENSOR ANTI-CHEAT UJIAN (DETEKSI ALT+TAB / BLUR / EXIT FULLSCREEN)
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
      if (document.hidden) catatPelanggaran("pindah tab browser / minimize jendela");
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) {
      interval = setInterval(() => setSisaWaktu((p) => p - 1), 1000);
    } else if (sisaWaktu === 0 && sedangUjian) {
      selesaikanTryoutOtomatis(jumlahPelanggaranUjian, "Selesai Normal");
    }
    return () => clearInterval(interval);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  // PRESENSI OTOMATIS SAAT SISWA MEMBUKA MATERI
  useEffect(() => {
    if (kelasAktif && userLogin) {
      setCatatanSiswa(localStorage.getItem(`catatan_${kelasAktif.id}`) || "");
      setJawabanPilihanSiswa({});
      setJawabanCocokSiswa({});
      setStatusKuisSiswa({});

      const jamHadir = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const presensiBaru: PresensiItem = {
        id: "pres-" + Date.now(),
        siswaId: userLogin.id,
        siswaNama: userLogin.nama,
        materiJudul: kelasAktif.judul,
        waktuHadir: `Hari ini, ${jamHadir} WIB`,
      };
      setDaftarPresensi((prev) => [presensiBaru, ...prev.slice(0, 49)]);
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
      if (userLogin) {
        const updateAkun = daftarAkun.map((a) =>
          a.id === userLogin.id ? { ...a, xp: totalBaru } : a
        );
        setDaftarAkun(updateAkun);
        localStorage.setItem("hibah_daftar_akun", JSON.stringify(updateAkun));
      }
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

  // --- FUNGSI TUGAS & PENILAIAN (ASSIGNMENTS) ---
  const handleGuruBuatTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !judulTugasBaru.trim()) return;
    const tugasBaru: TugasItem = {
      id: "tgs-" + Date.now(),
      subJenjangId: targetSubTugasBaru,
      judul: judulTugasBaru,
      instruksi: instruksiTugasBaru,
      deadline: deadlineTugasBaru,
      pembuatNama: userLogin.nama,
    };
    setDaftarTugas([tugasBaru, ...daftarTugas]);
    setJudulTugasBaru("");
    setInstruksiTugasBaru("");
    alert("Tugas baru berhasil diterbitkan untuk siswa!");
  };

  const handleSiswaKumpulTugas = (tugasId: string) => {
    if (!userLogin) return;
    const isi = (jawabanTugasSiswaInput[tugasId] || "").trim();
    if (!isi) return alert("Masukkan jawaban atau link tugas terlebih dahulu.");
    const kumpulBaru: PengumpulanTugas = {
      id: "sub-" + Date.now(),
      tugasId,
      siswaId: userLogin.id,
      siswaNama: userLogin.nama,
      jawabanTeksAtauLink: isi,
      waktuKumpul: "Baru saja",
    };
    setDaftarPengumpulan([kumpulBaru, ...daftarPengumpulan]);
    setJawabanTugasSiswaInput({ ...jawabanTugasSiswaInput, [tugasId]: "" });
    tambahXP(40);
    alert("Tugas berhasil dikumpulkan! (+40 XP)");
  };

  const handleGuruBeriNilaiTugas = (subId: string, siswaId: string) => {
    const nilaiAngka = inputNilaiGuru[subId] ?? 90;
    const feedback = inputFeedbackGuru[subId] || "Kerja bagus, pertahankan!";
    setDaftarPengumpulan((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, nilai: nilaiAngka, feedbackGuru: feedback } : s
      )
    );
    kirimNotifikasiKeUser(
      [siswaId],
      "Tugas Anda Telah Dinilai!",
      `Guru memberikan nilai ${nilaiAngka}/100. Catatan: "${feedback}"`,
      userLogin?.nama || "Guru"
    );
    alert("Nilai dan ulasan berhasil disimpan serta dikirim ke notifikasi siswa!");
  };

  // --- LIVE CHAT PER MATERI ---
  const handleKirimChatMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasAktif || !userLogin || !inputChatMateri.trim()) return;
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const pesanBaru: PesanChatMateri = {
      id: "chat-" + Date.now(),
      pengirimNama: userLogin.nama,
      pengirimRole: userLogin.role,
      pesan: inputChatMateri,
      waktu: `${jam} WIB`,
    };
    const listLama = chatPerMateri[kelasAktif.id] || [];
    setChatPerMateri({
      ...chatPerMateri,
      [kelasAktif.id]: [...listLama, pesanBaru],
    });
    setInputChatMateri("");
  };

  // --- BANK SOAL KOLEKTIF ---
  const handleSumbangBankSoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !tanyaKolektifBaru.trim()) return;
    const soalBaru: SoalTryout = {
      id: "bs-" + Date.now(),
      pertanyaan: tanyaKolektifBaru,
      rumus: rumusKolektifBaru || "Umum",
      opsi: [opsiKolektifA, opsiKolektifB, opsiKolektifC, opsiKolektifD],
      jawabanBenar: kunciKolektifBaru,
      pembahasan: bahasKolektifBaru || "Disusun oleh kontributor HibahIlmu.",
      penyumbangNama: userLogin.nama,
    };
    setBankSoalKolektif([soalBaru, ...bankSoalKolektif]);
    setTanyaKolektifBaru("");
    setOpsiKolektifA("");
    setOpsiKolektifB("");
    setOpsiKolektifC("");
    setOpsiKolektifD("");
    setBahasKolektifBaru("");
    alert("Soal berhasil ditambahkan ke Bank Soal Kolektif Bersama!");
  };

  // --- JADWAL LIVE SESSION ---
  const handleTambahJadwalLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLogin || !judulLiveBaru.trim()) return;
    const itemBaru: JadwalLiveItem = {
      id: "live-" + Date.now(),
      judulSesi: judulLiveBaru,
      pengajarNama: userLogin.nama,
      tanggalJam: tanggalLiveBaru,
      meetingUrl: urlLiveBaru,
      targetKelas: targetLiveBaru,
    };
    setJadwalLive([itemBaru, ...jadwalLive]);
    setJudulLiveBaru("");
    alert("Jadwal Kelas Live berhasil diterbitkan!");
  };

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
    setNotifSimpanCV(true);
    setTimeout(() => setNotifSimpanCV(false), 3000);
  };

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
      ],
      pembahasan: "",
      poin: 50,
    };
    setDaftarKuisDraft((prev) => [...prev, soalBaru]);
  };

  const hapusSoalDraft = (idDraft: string) => {
    if (daftarKuisDraft.length <= 1) return;
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

        return {
          id: "csv-q-" + Date.now() + "-" + idx,
          tipe: tipeRaw,
          tanya,
          opsi,
          jawabanBenar: parseInt(kunciRaw, 10) || 0,
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
      alert("Gagal memproses CSV!");
    }
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
    alert(`Paket Tryout "${judulTryoutBaru}" berhasil diterbitkan!`);
    setJudulTryoutBaru("");
  };

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
        `Batas percobaan habis! Anda sudah mengikuti ujian ini sebanyak ${jumlahCobaUser} kali.`
      );
      return;
    }

    if (paket.wajibFullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
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
      paketJudul: paketTryoutAktif.judul,
      userId: userLogin.id,
      userNama: userLogin.nama,
      skor: nilaiAkhir,
      jumlahPelanggaran: pelanggaranAkhir,
      waktuSelesai: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      statusAkhir,
    };

    const updateRiwayat = [riwayatBaru, ...riwayatTryout];
    setRiwayatTryout(updateRiwayat);
    localStorage.setItem("hibah_riwayat_tryout", JSON.stringify(updateRiwayat));
    if (benar > 0) tambahXP(benar * 40);
  };

  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun sedang disuspend.");
    setUserLogin(akun);
    setAdminModeGuru(false);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    setMenuAktif("beranda");
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
    setMenuAktif("beranda");
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
      xp: 100,
      aksesMengajar: [],
      minatSubJenjang: minatReg,
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    setPesanSukses("Pendaftaran terkirim! Menunggu verifikasi Admin.");
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  const ubahStatusAkun = (id: string, status: "approved" | "rejected" | "pending") => {
    const update = (daftarAkun || []).map((a) => (a.id === id ? { ...a, status } : a));
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
  };

  const hapusAkun = (id: string) => {
    const update = (daftarAkun || []).filter((a) => a.id !== id);
    setDaftarAkun(update);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(update));
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
        xp: 150,
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
      const baris = teksImportAkun
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);
      const dataBaris =
        baris[0]?.toLowerCase().startsWith("nama,") ? baris.slice(1) : baris;
      const akunBaruMasuk: AkunPengguna[] = dataBaris.map((line, idx) => {
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
          xp: 120,
          aksesMengajar: [],
          minatSubJenjang: ["sma-11-ipa"],
        };
      });

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
    if (!isiPesan) return;

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
    const update = daftarKelompok.map((k) =>
      k.id === kelompokId && !k.siswaIds.includes(siswaId)
        ? { ...k, siswaIds: [...k.siswaIds, siswaId] }
        : k
    );
    setDaftarKelompok(update);
    localStorage.setItem("hibah_kelompok", JSON.stringify(update));
  };

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
    setNotifGuru(true);
    setJudulMateri("");
    setVideoMateri("");
    setLampiranMateri("");
    setRangkumanMateri("");
    setRumusMateri("");
    setTimeout(() => setNotifGuru(false), 3500);
  };

  const renderIkon = (nama: string) => {
    if (nama === "sparkles") return <Sparkles className="w-8 h-8 text-white" />;
    if (nama === "book") return <BookOpen className="w-8 h-8 text-white" />;
    if (nama === "compass") return <Compass className="w-8 h-8 text-white" />;
    if (nama === "school") return <School className="w-8 h-8 text-white" />;
    return <GraduationCap className="w-8 h-8 text-white" />;
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

  const daftarBadgesSiswa = [
    {
      nama: "Pelajar Terverifikasi",
      ket: "Telah mendaftar resmi di HibahIlmu",
      aktif: true,
    },
    {
      nama: "Penjelajah Modul",
      ket: "Menyelesaikan minimal 1 materi pelajaran",
      aktif: materiSelesai.length >= 1,
    },
    {
      nama: "Ksatria CBT",
      ket: "Menyelesaikan ujian Tryout tanpa diskualifikasi",
      aktif: riwayatTryout.some((r) => r.userId === userLogin?.id),
    },
    {
      nama: "Cendekiawan Muda",
      ket: "Mencapai total 500 XP atau lebih",
      aktif: poinXP >= 500,
    },
  ];

  // ==========================================
  // KOMPONEN SHOWCASE 3D INTERAKTIF & AJAKAN HIBAH ILMU
  // ==========================================
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    setRotasi3D({ x: rotateX, y: rotateY });
  };

  const resetMouse3D = () => {
    setRotasi3D({ x: 8, y: -12 });
  };

  const renderHero3DShowcase = () => (
    <div className="space-y-16 mb-16">
      {/* BAGIAN 1: HERO 3D WEB INTERAKTIF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Ekosistem Pendidikan Terbuka • 100% Gratis & Terverifikasi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12]">
            Belajar Tanpa Batas, <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
              Mari Hibahkan Ilmu Untuk Bangsa.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
            Platform LMS kolaboratif mulai dari tingkat <b>TK, SD, SMP, SMA, hingga Perguruan Tinggi, TPA &amp; TOEFL</b>. Setiap pengajar dan pelajar terdaftar secara terverifikasi demi menjaga kualitas serta akuntabilitas ilmu.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                if (!userLogin) {
                  setModeAuth("register");
                  setRoleReg("siswa");
                  setMenuAktif("dashboard");
                } else {
                  const el = document.getElementById("katalog-jenjang");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-600/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-5 h-5" />
              <span>{userLogin ? "Jelajahi Ruang Kelas" : "Mulai Belajar Gratis"}</span>
            </button>

            <button
              onClick={() => {
                if (!userLogin) {
                  setModeAuth("register");
                  setRoleReg("guru");
                  setMenuAktif("dashboard");
                } else {
                  if (userLogin.role === "admin") setAdminModeGuru(true);
                  setGuruTabAktif("materi");
                  setMenuAktif("dashboard");
                }
              }}
              className="px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base shadow-xl shadow-indigo-600/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Ikut Menyumbang Ilmu (Jadi Pengajar)</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-xl">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">5 Jenjang</div>
              <div className="text-sm text-slate-500 font-semibold">TK s.d. Kuliah &amp; TPA</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">Anti-Cheat</div>
              <div className="text-sm text-slate-500 font-semibold">CBT Fullscreen Ujian</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500">100% Gratis</div>
              <div className="text-sm text-slate-500 font-semibold">Wakaf Ilmu Terbuka</div>
            </div>
          </div>
        </div>

        {/* PANGGUNG 3D INTERAKTIF DENGAN LOGO HIBAHILMU.JPG */}
        <div
          className="lg:col-span-5 flex justify-center items-center py-6"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            onMouseMove={handleMouseMove3D}
            onMouseLeave={resetMouse3D}
            animate={{
              rotateX: rotasi3D.x,
              rotateY: rotasi3D.y,
            }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full max-w-md rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white shadow-2xl border border-white/15 cursor-grab active:cursor-grabbing select-none"
          >
            {/* Cahaya Hologram 3D di Latar Kartu */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Elemen Melayang 3D Layer Atas */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(60px)" }}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl mb-6"
            >
              <img
                src="/hibahilmu.jpg"
                alt="Logo HibahIlmu"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80";
                }}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shrink-0"
              />
              <div>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  Official 3D Portal
                </span>
                <h3 className="text-2xl font-black mt-1 tracking-tight">HibahIlmu.id</h3>
                <p className="text-xs text-emerald-200 font-semibold">
                  Gerakan Berbagi Ilmu Pengetahuan
                </p>
              </div>
            </motion.div>

            {/* Layer Tengah 3D */}
            <div
              style={{ transform: "translateZ(40px)" }}
              className="space-y-3 bg-slate-900/70 p-5 rounded-3xl border border-white/10 mb-6"
            >
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers3 className="w-4 h-4 text-amber-400" /> Modul Terverifikasi
                </span>
                <span className="text-emerald-400 font-black">Aktif 24/7</span>
              </div>
              <div className="text-base font-extrabold text-white">
                &ldquo;Sebaik-baik manusia adalah yang paling bermanfaat bagi sesama melalui ilmu yang dibagikan.&rdquo;
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs px-3 py-1 rounded-xl bg-indigo-500/30 border border-indigo-400/30 font-bold">
                  Rich Text Studio
                </span>
                <span className="text-xs px-3 py-1 rounded-xl bg-emerald-500/30 border border-emerald-400/30 font-bold">
                  CBT TPA &amp; TOEFL
                </span>
                <span className="text-xs px-3 py-1 rounded-xl bg-amber-500/30 border border-amber-400/30 font-bold">
                  Sertifikat Resmi
                </span>
              </div>
            </div>

            {/* Layer Lencana 3D Melayang di Bawah */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(50px)" }}
              className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-5 py-3.5 rounded-2xl font-black text-sm shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-slate-950" /> Gerakkan Kursor di Kartu 3D
              </span>
              <span className="text-xs bg-slate-950 text-white px-2.5 py-1 rounded-lg">
                Interaktif
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* BAGIAN 2: BANNER AJAKAN MENYUMBANG ILMU (WAKAF ILMU PENGETAHUAN) */}
      <div className="rounded-[2.5rem] p-8 sm:p-12 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" /> Panggilan Kolaborasi Pengajar &amp; Praktisi
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Punya Catatan Kuliah, Modul Mengajar, atau Bank Soal? Mari Hibahkan Ilmu Anda!
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              Satu modul atau video penjelasan yang Anda bagikan hari ini dapat membantu ribuan pelajar dan mahasiswa di seluruh penjuru Indonesia belajar secara gratis. Nama, gelar, dan profil CV Anda akan tercantum resmi sebagai penanggung jawab karya ilmiah di setiap materi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 font-bold">
                1. Buat Akun Guru / Instruktur
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 font-bold">
                2. Tulis Materi / Upload Soal CSV
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 font-bold">
                3. Nama &amp; CV Tercantum Abadi
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => {
                if (!userLogin) {
                  setModeAuth("register");
                  setRoleReg("guru");
                  setMenuAktif("dashboard");
                } else {
                  if (userLogin.role === "admin") setAdminModeGuru(true);
                  setGuruTabAktif("materi");
                  setMenuAktif("dashboard");
                }
              }}
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl transition text-center cursor-pointer"
            >
              Mulai Menyumbang Materi Sekarang →
            </button>
            <button
              onClick={() => {
                if (!userLogin) {
                  setModeAuth("register");
                  setRoleReg("guru");
                  setMenuAktif("dashboard");
                } else {
                  if (userLogin.role === "admin") setAdminModeGuru(true);
                  setGuruTabAktif("bank_soal");
                  setMenuAktif("dashboard");
                }
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition text-center cursor-pointer"
            >
              Sumbang Butir Soal ke Bank Kolektif
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // SUB-RENDERER: PROFIL & CV BUILDER
  // ==========================================
  const renderProfilDanCV = () => {
    if (!userLogin) return null;
    const cvData = userLogin.cv;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
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
              <h3 className="text-xl font-black text-slate-900">{userLogin.nama}</h3>
              <p className="text-sm font-bold text-indigo-600 mt-0.5">
                {cvHeadline || userLogin.infoTambahan}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {cvBio || "Belum ada deskripsi biodata singkat."}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t space-y-3 text-sm">
              <div>
                <span className="font-bold text-slate-400 uppercase text-xs block">
                  Asal Sekolah / Kampus
                </span>
                <span className="font-bold text-slate-800">
                  {cvSekolah || "-"} ({cvPendidikan || "-"})
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-xs block mb-1.5">
                  Skills &amp; Kemampuan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(cvData?.skills || []).map((sk, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold text-xs"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Edit Foto Profil, Biodata &amp; CV
          </h3>
          {notifSimpanCV && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-bold">
              Profil dan CV berhasil diperbarui!
            </div>
          )}
          <form onSubmit={handleSimpanBiodataCV} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="url"
                value={cvFoto}
                onChange={(e) => setCvFoto(e.target.value)}
                placeholder="URL Foto Profil (https://...)"
                className="w-full p-3.5 border rounded-xl bg-slate-50"
              />
              <input
                type="text"
                value={cvHeadline}
                onChange={(e) => setCvHeadline(e.target.value)}
                placeholder="Headline / Spesialisasi"
                className="w-full p-3.5 border rounded-xl bg-slate-50 font-semibold"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={cvSekolah}
                onChange={(e) => setCvSekolah(e.target.value)}
                placeholder="Asal Sekolah / Universitas"
                className="w-full p-3.5 border rounded-xl bg-slate-50"
              />
              <input
                type="text"
                value={cvPendidikan}
                onChange={(e) => setCvPendidikan(e.target.value)}
                placeholder="Tingkat / Pendidikan Terakhir"
                className="w-full p-3.5 border rounded-xl bg-slate-50"
              />
            </div>
            <textarea
              rows={2}
              value={cvBio}
              onChange={(e) => setCvBio(e.target.value)}
              placeholder="Biodata singkat..."
              className="w-full p-3.5 border rounded-xl bg-slate-50"
            />
            <input
              type="text"
              value={cvSkillsTeks}
              onChange={(e) => setCvSkillsTeks(e.target.value)}
              placeholder="Keahlian / Skills (Pisahkan dengan koma)"
              className="w-full p-3.5 border rounded-xl bg-slate-50 font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-md text-base"
            >
              Simpan Perubahan Biodata &amp; CV
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
      <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-900 font-semibold flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            <b>100% Gratis &amp; Terverifikasi:</b> Wajib registrasi dan masuk agar setiap materi,
            pengumpulan tugas, dan sertifikat dapat dipertanggungjawabkan.
          </span>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setModeAuth("login");
              setPesanError("");
            }}
            className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold transition ${
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
            className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold transition ${
              modeAuth === "register" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            }`}
          >
            Registrasi Akun Gratis
          </button>
        </div>

        {pesanError && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-sm font-bold">
            {pesanError}
          </div>
        )}
        {pesanSukses && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-sm font-bold">
            {pesanSukses}
          </div>
        )}

        {modeAuth === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              required
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              placeholder="Email Terdaftar..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-semibold"
            />
            <input
              type="password"
              required
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              placeholder="Password..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg text-base"
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
                className={`p-4 border-2 rounded-2xl text-left ${
                  roleReg === "siswa" ? "bg-emerald-50 border-emerald-500" : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-base">Siswa / Mahasiswa</div>
                <div className="text-xs text-slate-500">Ikuti kelas &amp; Tryout gratis</div>
              </button>
              <button
                type="button"
                onClick={() => setRoleReg("guru")}
                className={`p-4 border-2 rounded-2xl text-left ${
                  roleReg === "guru" ? "bg-indigo-50 border-indigo-500" : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-base">Guru / Penyumbang Ilmu</div>
                <div className="text-xs text-slate-500">Bagikan modul &amp; buat soal</div>
              </button>
            </div>
            <input
              type="text"
              required
              value={namaReg}
              onChange={(e) => setNamaReg(e.target.value)}
              placeholder="Nama Lengkap Sesuai Identitas..."
              className="w-full p-4 bg-slate-50 border rounded-2xl text-base font-semibold"
            />
            <input
              type="email"
              required
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              placeholder="Email Aktif..."
              className="w-full p-4 bg-slate-50 border rounded-2xl text-base font-semibold"
            />
            <input
              type="password"
              required
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              placeholder="Buat Password..."
              className="w-full p-4 bg-slate-50 border rounded-2xl text-base font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg text-base"
            >
              Daftar Akun Gratis Sekarang
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-3.5 py-1 rounded-full uppercase w-max">
          Simulasi Akses Cepat
        </span>
        <h3 className="text-2xl font-black mt-4 mb-2">Akun Terverifikasi (1-Klik)</h3>
        <p className="text-sm text-slate-300 mb-4">
          Klik salah satu akun di bawah ini untuk langsung mencoba fitur Admin, Guru Penyumbang Ilmu, atau Siswa:
        </p>
        <div className="space-y-3">
          {safeAkunList
            .filter((a) => a.status === "approved")
            .map((a) => (
              <button
                key={a.id}
                onClick={() => loginCepat(a)}
                className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-base text-white flex items-center gap-2">
                    {a.nama}
                    <span className="text-xs uppercase font-black px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-900">
                      {a.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{a.email}</div>
                </div>
                <span className="text-sm font-bold text-amber-300">Masuk →</span>
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // SUB-RENDERER: STUDIO GURU
  // ==========================================
  const renderGuruView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div>
          <span className="bg-white/20 text-xs font-black px-3.5 py-1 rounded-full uppercase">
            {userLogin?.role === "admin"
              ? "Mode Guru (Diakses oleh Super Admin)"
              : "Studio Pengajar & Kontributor Ilmu"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">{userLogin?.nama}</h1>
          <p className="text-indigo-200 text-sm">Penanggung Jawab Materi: {userLogin?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {userLogin?.role === "admin" && (
            <button
              onClick={() => setAdminModeGuru(false)}
              className="bg-amber-400 text-slate-950 text-sm font-black px-5 py-3 rounded-2xl shadow-lg"
            >
              ← Kembali ke Panel Super Admin
            </button>
          )}
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "materi", label: "1. Hibahkan Materi & Kuis", icon: <BookOpen className="w-4 h-4" /> },
          { id: "tryout_builder", label: "2. Buat Tryout & Analisis", icon: <Timer className="w-4 h-4" /> },
          {
            id: "tugas_absensi",
            label: "3. Tugas, Nilai & Absensi",
            icon: <ClipboardCheck className="w-4 h-4" />,
          },
          {
            id: "bank_soal",
            label: `4. Bank Soal Kolektif (${bankSoalKolektif.length})`,
            icon: <Database className="w-4 h-4" />,
          },
          {
            id: "kelas",
            label: `5. Rombel & Jadwal Live (${guruKelompoks.length})`,
            icon: <Users className="w-4 h-4" />,
          },
          { id: "cv", label: "6. Profil & CV", icon: <Briefcase className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setGuruTabAktif(
                tab.id as
                  | "materi"
                  | "tryout_builder"
                  | "tugas_absensi"
                  | "bank_soal"
                  | "kelas"
                  | "cv"
              )
            }
            className={`px-5 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition whitespace-nowrap ${
              guruTabAktif === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {guruTabAktif === "cv" && renderProfilDanCV()}

      {guruTabAktif === "tugas_absensi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-600" /> Buat Tugas &amp; Beri Nilai Siswa
            </h3>
            <form
              onSubmit={handleGuruBuatTugas}
              className="p-5 bg-slate-50 border rounded-2xl space-y-3 text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={judulTugasBaru}
                  onChange={(e) => setJudulTugasBaru(e.target.value)}
                  placeholder="Judul Tugas / Proyek..."
                  className="p-3.5 border rounded-xl bg-white font-bold"
                />
                <select
                  value={targetSubTugasBaru}
                  onChange={(e) => setTargetSubTugasBaru(e.target.value)}
                  className="p-3.5 border rounded-xl bg-white font-bold"
                >
                  {semuaSubJenjangFlat.map((sj) => (
                    <option key={sj.id} value={sj.id}>
                      {sj.namaInduk} - {sj.nama}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={2}
                required
                value={instruksiTugasBaru}
                onChange={(e) => setInstruksiTugasBaru(e.target.value)}
                placeholder="Instruksi pengerjaan tugas..."
                className="w-full p-3.5 border rounded-xl bg-white"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={deadlineTugasBaru}
                  onChange={(e) => setDeadlineTugasBaru(e.target.value)}
                  placeholder="Batas Waktu (Deadline)..."
                  className="flex-1 p-3.5 border rounded-xl bg-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-black"
                >
                  + Terbitkan Tugas
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="font-black text-base">
                Kiriman Jawaban Tugas Siswa ({daftarPengumpulan.length})
              </h4>
              {daftarPengumpulan.map((sub) => {
                const tugasInfo = daftarTugas.find((t) => t.id === sub.tugasId);
                return (
                  <div key={sub.id} className="p-4 border rounded-2xl bg-slate-50 space-y-2 text-sm">
                    <div className="flex justify-between font-bold">
                      <span>
                        {sub.siswaNama} —{" "}
                        <span className="text-indigo-600">{tugasInfo?.judul || "Tugas"}</span>
                      </span>
                      <span className="text-slate-400">{sub.waktuKumpul}</span>
                    </div>
                    <p className="p-3 bg-white border rounded-xl text-slate-700">
                      {sub.jawabanTeksAtauLink}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <input
                        type="number"
                        placeholder="Nilai (0-100)"
                        defaultValue={sub.nilai ?? 90}
                        onChange={(e) =>
                          setInputNilaiGuru({
                            ...inputNilaiGuru,
                            [sub.id]: Number(e.target.value),
                          })
                        }
                        className="w-24 p-2.5 border rounded-xl bg-white font-black text-center"
                      />
                      <input
                        type="text"
                        placeholder="Catatan Feedback Guru..."
                        defaultValue={sub.feedbackGuru || ""}
                        onChange={(e) =>
                          setInputFeedbackGuru({
                            ...inputFeedbackGuru,
                            [sub.id]: e.target.value,
                          })
                        }
                        className="flex-1 p-2.5 border rounded-xl bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleGuruBeriNilaiTugas(sub.id, sub.siswaId)}
                        className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold"
                      >
                        Simpan Nilai
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Rekap Presensi Otomatis Siswa
            </h3>
            <p className="text-sm text-slate-500">
              Kehadiran tercatat otomatis saat siswa membuka modul materi pelajaran.
            </p>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {daftarPresensi.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400 border border-dashed rounded-2xl">
                  Belum ada siswa yang membuka modul pada sesi ini.
                </div>
              ) : (
                daftarPresensi.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-3.5 border rounded-2xl bg-emerald-50/50 flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-black text-slate-900">{pr.siswaNama}</div>
                      <div className="text-slate-600">Membuka: {pr.materiJudul}</div>
                    </div>
                    <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border font-bold text-emerald-700">
                      {pr.waktuHadir}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {guruTabAktif === "bank_soal" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" /> Bank Soal Kolektif (Community Question
              Bank)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Sumbangkan soal terbaik Anda atau kutip soal dari pengajar lain ke dalam rancangan
              Tryout CBT Anda dengan 1 klik.
            </p>
          </div>

          <form
            onSubmit={handleSumbangBankSoal}
            className="p-5 bg-slate-50 border rounded-2xl space-y-3 text-sm"
          >
            <div className="font-black text-base">Sumbang Soal Baru ke Bank Kolektif</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={tanyaKolektifBaru}
                onChange={(e) => setTanyaKolektifBaru(e.target.value)}
                placeholder="Pertanyaan soal..."
                className="sm:col-span-2 p-3.5 border rounded-xl bg-white font-semibold"
              />
              <input
                type="text"
                value={rumusKolektifBaru}
                onChange={(e) => setRumusKolektifBaru(e.target.value)}
                placeholder="Topik / Subtes (Misal: TPA Verbal)"
                className="p-3.5 border rounded-xl bg-white"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                value={opsiKolektifA}
                onChange={(e) => setOpsiKolektifA(e.target.value)}
                placeholder="Opsi A"
                className="p-3 border rounded-xl bg-white"
              />
              <input
                type="text"
                required
                value={opsiKolektifB}
                onChange={(e) => setOpsiKolektifB(e.target.value)}
                placeholder="Opsi B"
                className="p-3 border rounded-xl bg-white"
              />
              <input
                type="text"
                required
                value={opsiKolektifC}
                onChange={(e) => setOpsiKolektifC(e.target.value)}
                placeholder="Opsi C"
                className="p-3 border rounded-xl bg-white"
              />
              <input
                type="text"
                required
                value={opsiKolektifD}
                onChange={(e) => setOpsiKolektifD(e.target.value)}
                placeholder="Opsi D"
                className="p-3 border rounded-xl bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={kunciKolektifBaru}
                onChange={(e) => setKunciKolektifBaru(Number(e.target.value))}
                className="p-3 border rounded-xl bg-emerald-50 font-bold"
              >
                <option value={0}>Kunci: Opsi A</option>
                <option value={1}>Kunci: Opsi B</option>
                <option value={2}>Kunci: Opsi C</option>
                <option value={3}>Kunci: Opsi D</option>
              </select>
              <input
                type="text"
                value={bahasKolektifBaru}
                onChange={(e) => setBahasKolektifBaru(e.target.value)}
                placeholder="Pembahasan singkat..."
                className="flex-1 p-3 border rounded-xl bg-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-black"
              >
                + Sumbangkan Soal
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {bankSoalKolektif.map((bs) => (
              <div
                key={bs.id}
                className="p-4 border rounded-2xl bg-white flex flex-wrap justify-between items-center gap-4 text-sm"
              >
                <div className="space-y-1 max-w-2xl">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {bs.rumus} • Kontributor: {bs.penyumbangNama}
                  </span>
                  <p className="font-bold text-base text-slate-900">{bs.pertanyaan}</p>
                  <div className="text-slate-500">
                    Opsi: {bs.opsi.join(" | ")} (Kunci: {bs.opsi[bs.jawabanBenar]})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSoalTryoutDraft([...soalTryoutDraft, { ...bs, id: "kutip-" + Date.now() }]);
                    alert("Soal berhasil dimasukkan ke draf Perancang Tryout Anda!");
                  }}
                  className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold shrink-0"
                >
                  + Kutip ke Tryout Saya
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {guruTabAktif === "tryout_builder" && (
        <div className="space-y-8">
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" /> Statistik &amp; Analisis Hasil Tryout
              Peserta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {daftarPaketTryout.map((pkt) => {
                const listHasil = riwayatTryout.filter((r) => r.paketId === pkt.id);
                const rataRata =
                  listHasil.length > 0
                    ? Math.round(
                        listHasil.reduce((acc, cur) => acc + cur.skor, 0) / listHasil.length
                      )
                    : 0;
                return (
                  <div key={pkt.id} className="p-4 border rounded-2xl bg-slate-50 space-y-1.5 text-sm">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                      {pkt.kategoriTes}
                    </span>
                    <div className="font-black text-base text-slate-900">{pkt.judul}</div>
                    <div className="text-slate-600">
                      Total Peserta Ujian: <b>{listHasil.length} Orang</b>
                    </div>
                    <div className="text-emerald-700 font-bold">
                      Rata-Rata Skor: {rataRata} / 100
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">
              Perancang Tryout CBT (TPA / TOEP / TOEFL / UTBK)
            </h2>
            <form onSubmit={handleSimpanPaketTryoutBaru} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  value={judulTryoutBaru}
                  onChange={(e) => setJudulTryoutBaru(e.target.value)}
                  placeholder="Nama Paket Ujian / Tryout..."
                  className="p-4 border rounded-xl bg-slate-50 text-sm font-bold"
                />
                <select
                  value={kategoriTesBaru}
                  onChange={(e) => setKategoriTesBaru(e.target.value as KategoriTes)}
                  className="p-4 border rounded-xl bg-indigo-50 text-indigo-950 text-sm font-black"
                >
                  <option value="TPA">TPA (Tes Potensi Akademik)</option>
                  <option value="TOEP">TOEP (Test of English Proficiency)</option>
                  <option value="TOEFL">TOEFL Prediction / ITP</option>
                  <option value="UTBK">UTBK - SNBT Nasional</option>
                  <option value="Akademik">Ujian Sekolah / Akademik</option>
                </select>
                <input
                  type="text"
                  required
                  value={jenjangTryoutBaru}
                  onChange={(e) => setJenjangTryoutBaru(e.target.value)}
                  placeholder="Sasaran Peserta (SMA / Kuliah)"
                  className="p-4 border rounded-xl bg-slate-50 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  required
                  value={alamatTryoutBaru}
                  onChange={(e) => setAlamatTryoutBaru(e.target.value)}
                  placeholder="Alamat / Lokasi Ruangan Ujian..."
                  className="md:col-span-2 p-4 border rounded-xl bg-slate-50 text-sm font-semibold"
                />
                <input
                  type="text"
                  required
                  value={jadwalTryoutBaru}
                  onChange={(e) => setJadwalTryoutBaru(e.target.value)}
                  placeholder="Jadwal Jam Ujian..."
                  className="p-4 border rounded-xl bg-slate-50 text-sm font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    value={durasiTryoutBaru}
                    onChange={(e) => setDurasiTryoutBaru(Number(e.target.value))}
                    title="Durasi Menit"
                    className="p-4 border rounded-xl bg-slate-50 text-sm font-black text-center"
                  />
                  <input
                    type="number"
                    required
                    value={batasCobaTryoutBaru}
                    onChange={(e) => setBatasCobaTryoutBaru(Number(e.target.value))}
                    title="Batas Percobaan"
                    className="p-4 border rounded-xl bg-slate-50 text-sm font-black text-center"
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black">Import Cepat Soal Tryout via CSV</span>
                  <button
                    type="button"
                    onClick={() => setTeksCsvTryout(TEMPLATE_CSV_TRYOUT)}
                    className="text-xs font-bold text-indigo-600 underline"
                  >
                    Muat Contoh CSV TPA &amp; TOEFL
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={teksCsvTryout}
                    onChange={(e) => setTeksCsvTryout(e.target.value)}
                    className="flex-1 p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={muatCsvKeSoalTryoutDraft}
                    className="bg-indigo-600 text-white px-5 rounded-xl text-xs font-bold"
                  >
                    Terapkan CSV
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg text-base"
              >
                Terbitkan Paket Ujian CBT ({soalTryoutDraft.length} Soal)
              </button>
            </form>
          </div>
        </div>
      )}

      {guruTabAktif === "materi" && (
        <div className="bg-white text-slate-800 p-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-5xl">
          <h2 className="text-2xl font-black mb-6 text-slate-900">
            Hibahkan &amp; Publikasikan Materi Baru (Rich Text Editor Pro)
          </h2>
          <form onSubmit={handleGuruBuatMateri} className="space-y-6">
            {notifGuru && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-base text-center border border-emerald-200">
                Terima kasih! Materi &amp; Kuis Anda berhasil diterbitkan untuk pelajar Indonesia!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                required
                value={subJenjangPilih}
                onChange={(e) => setSubJenjangPilih(e.target.value)}
                className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl font-extrabold text-indigo-900 text-sm"
              >
                <option value="" disabled>
                  -- Pilih Tingkat Kelas Tujuan --
                </option>
                {opsiKelasGuru.map((sj) => (
                  <option key={sj.id} value={sj.id}>
                    {sj.namaInduk} - {sj.nama}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={judulMateri}
                onChange={(e) => setJudulMateri(e.target.value)}
                placeholder="Judul Materi..."
                className="p-4 border rounded-xl bg-slate-50 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="url"
                required
                value={videoMateri}
                onChange={(e) => setVideoMateri(e.target.value)}
                placeholder="URL Video YouTube (https://...)"
                className="p-4 border rounded-xl bg-slate-50 text-sm"
              />
              <input
                type="url"
                value={lampiranMateri}
                onChange={(e) => setLampiranMateri(e.target.value)}
                placeholder="Link Lampiran Modul PDF/PPT (Opsional)"
                className="p-4 border rounded-xl bg-slate-50 text-sm"
              />
            </div>

            <RichTextEditorPro value={rangkumanMateri} onChange={setRangkumanMateri} />

            <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-base">
                  Daftar Kuis Materi ({daftarKuisDraft.length} Soal)
                </span>
                <button
                  type="button"
                  onClick={() => setModalImportKuis(true)}
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  Import CSV Soal
                </button>
              </div>
              {daftarKuisDraft.map((soal, indexSoal) => (
                <div key={soal.id} className="p-4 bg-white rounded-xl border space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-black">Soal #{indexSoal + 1}</span>
                    <button
                      type="button"
                      onClick={() => hapusSoalDraft(soal.id)}
                      className="text-rose-600 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={soal.tanya}
                    onChange={(e) => ubahFieldSoalDraft(soal.id, "tanya", e.target.value)}
                    placeholder="Ketik pertanyaan..."
                    className="w-full p-3 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((idxOpsi) => (
                      <input
                        key={idxOpsi}
                        type="text"
                        value={soal.opsi[idxOpsi] || ""}
                        onChange={(e) => ubahOpsiSoalDraft(soal.id, idxOpsi, e.target.value)}
                        placeholder={`Opsi ${String.fromCharCode(65 + idxOpsi)}`}
                        className="p-2.5 border rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => tambahSoalDraftBaru("pilihan_ganda")}
                className="px-4 py-2.5 bg-white border rounded-xl text-xs font-bold"
              >
                + Tambah Soal Baru
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg text-base"
            >
              Terbitkan Materi Terverifikasi Sekarang
            </button>
          </form>
        </div>
      )}

      {guruTabAktif === "kelas" && (
        <div className="space-y-8">
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-600" /> Buat Jadwal Kelas Live (Google Meet / Zoom)
            </h3>
            <form
              onSubmit={handleTambahJadwalLive}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm"
            >
              <input
                type="text"
                required
                value={judulLiveBaru}
                onChange={(e) => setJudulLiveBaru(e.target.value)}
                placeholder="Topik Sesi Live..."
                className="p-3.5 border rounded-xl bg-slate-50 font-bold"
              />
              <input
                type="text"
                required
                value={tanggalLiveBaru}
                onChange={(e) => setTanggalLiveBaru(e.target.value)}
                placeholder="Hari, Tanggal & Jam..."
                className="p-3.5 border rounded-xl bg-slate-50"
              />
              <input
                type="url"
                required
                value={urlLiveBaru}
                onChange={(e) => setUrlLiveBaru(e.target.value)}
                placeholder="Link Meet / Zoom..."
                className="p-3.5 border rounded-xl bg-slate-50"
              />
              <button
                type="submit"
                className="bg-rose-600 text-white font-black rounded-xl py-3.5 px-4"
              >
                + Jadwalkan Live
              </button>
            </form>
          </div>

          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border space-y-6">
            <h2 className="text-xl font-black">Kelola Rombel &amp; Pengumuman Kelas</h2>
            <form
              onSubmit={handleGuruBuatKelompok}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-indigo-50 rounded-2xl"
            >
              <input
                type="text"
                required
                value={namaKelompokBaru}
                onChange={(e) => setNamaKelompokBaru(e.target.value)}
                placeholder="Nama Ruang Kelas Baru..."
                className="p-3.5 rounded-xl border bg-white text-sm font-bold"
              />
              <input
                type="text"
                value={pengumumanBaru}
                onChange={(e) => setPengumumanBaru(e.target.value)}
                placeholder="Pengumuman Awal..."
                className="p-3.5 rounded-xl border bg-white text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-black text-sm"
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
                  <div key={kel.id} className="p-5 border rounded-3xl space-y-3 text-sm">
                    <div className="font-black text-lg text-indigo-950">{kel.namaKelas}</div>
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
                        placeholder="Broadcast pengumuman ke notifikasi murid..."
                        className="flex-1 p-2.5 border rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleKirimPengumumanKelas(kel)}
                        className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold"
                      >
                        Kirim
                      </button>
                    </div>
                    <input
                      type="text"
                      value={kataCari}
                      onChange={(e) =>
                        setSearchSiswaGuru({ ...searchSiswaGuru, [kel.id]: e.target.value })
                      }
                      placeholder="Cari nama/email siswa..."
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                    <div className="max-h-28 overflow-y-auto space-y-1">
                      {hasilCari.map((s) => (
                        <div key={s.id} className="flex justify-between p-2 bg-slate-50 rounded-lg">
                          <span>{s.nama}</span>
                          <button
                            onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)}
                            className="bg-emerald-600 text-white px-2.5 py-1 rounded font-bold text-xs"
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
        </div>
      )}
    </motion.div>
  );

  // ==========================================
  // SUB-RENDERER: ADMIN VIEW
  // ==========================================
  const renderAdminView = () => {
    if (adminModeGuru) return renderGuruView();
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              Super Admin
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2">{userLogin?.nama}</h1>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setAdminModeGuru(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Buka Studio Mode Guru
            </button>
            <button
              onClick={() => setModalImportAkun(true)}
              className="bg-indigo-600 text-white text-sm font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import CSV Akun
            </button>
            <button
              onClick={bukaModalTambahAkun}
              className="bg-emerald-600 text-white text-sm font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Tambah Akun
            </button>
            <button
              onClick={() => {
                setUserLogin(null);
                localStorage.removeItem("hibah_user_aktif");
              }}
              className="bg-rose-600 text-white text-sm font-bold px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "akun", label: `Data Akun (${safeAkunList.length})` },
            { id: "kategori", label: "Kategori & Prodi" },
            { id: "cv", label: "Profil & CV Saya" },
            { id: "log", label: "Log Audit" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setAdminTabAktif(t.id as "akun" | "kategori" | "rombel" | "log" | "cv")
              }
              className={`px-5 py-3 rounded-2xl text-sm font-black ${
                adminTabAktif === t.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {adminTabAktif === "cv" && renderProfilDanCV()}

        {adminTabAktif === "akun" && (
          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
            {safeAkunList.map((akun) => (
              <div
                key={akun.id}
                className="p-4 rounded-2xl border bg-slate-50 flex flex-wrap justify-between items-center gap-4"
              >
                <div>
                  <div className="font-extrabold text-base flex items-center gap-2">
                    {akun.nama}
                    <span className="text-xs uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">
                      {akun.role}
                    </span>
                    <span className="text-xs uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-black">
                      {akun.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">{akun.email}</div>
                </div>
                <div className="flex gap-2">
                  {akun.status !== "approved" && (
                    <button
                      onClick={() => ubahStatusAkun(akun.id, "approved")}
                      className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"
                    >
                      <UserCheck2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => bukaModalEditAkun(akun)}
                    className="p-2.5 bg-blue-100 text-blue-700 rounded-xl"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {akun.role !== "admin" && (
                    <button
                      onClick={() => hapusAkun(akun.id)}
                      className="p-2.5 bg-rose-100 text-rose-700 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {adminTabAktif === "kategori" && (
          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black">Hierarki Jenjang &amp; Prodi</h2>
              <button
                onClick={() => setModalKategori(true)}
                className="bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl font-bold"
              >
                + Tambah Kelas / Prodi
              </button>
            </div>
            {daftarJenjang.map((j) => (
              <div key={j.id} className="p-4 border rounded-2xl bg-slate-50">
                <h3 className="font-black text-sm mb-2 uppercase">{j.nama}</h3>
                <div className="flex flex-wrap gap-2">
                  {j.subJenjang.map((sj) => (
                    <span
                      key={sj.id}
                      className="bg-white text-sm px-3 py-1 rounded-lg border font-bold"
                    >
                      {sj.nama}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {adminTabAktif === "log" && (
          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border space-y-2.5">
            {safeLogList.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border flex justify-between text-sm"
              >
                <span>
                  <b>[{log.rolePelaku.toUpperCase()}] {log.namaPelaku}:</b> {log.aksi}
                </span>
                <span className="font-mono text-slate-400">{log.waktu}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // ==========================================
  // SUB-RENDERER: SISWA VIEW
  // ==========================================
  const renderSiswaView = () => {
    const kelasSaya = daftarKelompok.filter((k) =>
      userLogin ? k.siswaIds.includes(userLogin.id) : false
    );
    const minatSaya = userLogin?.minatSubJenjang || [];
    const kirimanSaya = daftarPengumpulan.filter((s) => s.siswaId === userLogin?.id);
    const tryoutSaya = riwayatTryout.filter((r) => r.userId === userLogin?.id);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
          <div>
            <span className="bg-white/20 text-xs font-black px-3 py-1 rounded-full uppercase">
              Portal Akademik Pelajar
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2">Halo, {userLogin?.nama}!</h1>
            <p className="text-emerald-100 text-sm">
              Total XP: <b>{poinXP} XP</b> • Selesai: <b>{materiSelesai.length} Modul</b>
            </p>
          </div>
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="flex gap-2.5 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "kelas", label: "1. Rombel & Jadwal Live", icon: <School className="w-4 h-4" /> },
            { id: "tugas", label: "2. Tugas & Nilai Guru", icon: <ClipboardCheck className="w-4 h-4" /> },
            {
              id: "rapor_sertifikat",
              label: "3. Rapor Digital & Sertifikat PDF",
              icon: <Award className="w-4 h-4" />,
            },
            {
              id: "minat",
              label: `4. Pilih Kelas Diikuti (${minatSaya.length})`,
              icon: <CheckSquare className="w-4 h-4" />,
            },
            { id: "cv", label: "5. Profil & CV Saya", icon: <Briefcase className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setSiswaTabAktif(
                  t.id as "kelas" | "tugas" | "rapor_sertifikat" | "minat" | "cv"
                )
              }
              className={`px-5 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 whitespace-nowrap ${
                siswaTabAktif === t.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-700 border"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {siswaTabAktif === "cv" && renderProfilDanCV()}

        {siswaTabAktif === "tugas" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h2 className="text-xl font-black">Daftar Tugas Kelas &amp; Penilaian Guru</h2>
            <div className="space-y-4">
              {daftarTugas.map((tgs) => {
                const sudahKumpul = kirimanSaya.find((k) => k.tugasId === tgs.id);
                return (
                  <div key={tgs.id} className="p-5 border rounded-2xl bg-slate-50 space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-base text-slate-900">{tgs.judul}</span>
                      <span className="text-rose-600 font-bold">Deadline: {tgs.deadline}</span>
                    </div>
                    <p className="text-slate-600">{tgs.instruksi}</p>
                    {sudahKumpul ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                        <div className="font-bold text-emerald-900">
                          Status: Sudah Dikumpulkan ({sudahKumpul.waktuKumpul})
                        </div>
                        <div>Jawabanmu: {sudahKumpul.jawabanTeksAtauLink}</div>
                        {sudahKumpul.nilai !== undefined ? (
                          <div className="pt-2 font-black text-indigo-700 text-base">
                            Nilai dari Guru: {sudahKumpul.nilai} / 100 — Feedback: &quot;
                            {sudahKumpul.feedbackGuru}&quot;
                          </div>
                        ) : (
                          <div className="text-amber-700 font-bold">Menunggu penilaian Guru</div>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={jawabanTugasSiswaInput[tgs.id] || ""}
                          onChange={(e) =>
                            setJawabanTugasSiswaInput({
                              ...jawabanTugasSiswaInput,
                              [tgs.id]: e.target.value,
                            })
                          }
                          placeholder="Ketik ringkasan jawaban atau link Google Drive PDF tugasmu..."
                          className="flex-1 p-3.5 bg-white border rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleSiswaKumpulTugas(tgs.id)}
                          className="bg-emerald-600 text-white px-5 py-3.5 rounded-xl font-black"
                        >
                          Kirim Tugas (+40 XP)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {siswaTabAktif === "rapor_sertifikat" && (
          <div className="space-y-8">
            <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Koleksi Lencana Penghargaan (Badges)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {daftarBadgesSiswa.map((b, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border-2 text-sm ${
                      b.aktif
                        ? "border-amber-400 bg-amber-50/60 text-slate-900"
                        : "border-slate-200 bg-slate-100 opacity-50"
                    }`}
                  >
                    <div className="font-black text-base mb-1">
                      {b.aktif ? "🏅 " : "🔒 "} {b.nama}
                    </div>
                    <p className="text-slate-600">{b.ket}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black">Transkrip Rapor Akademik Digital</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-4 border rounded-2xl bg-slate-50 space-y-2">
                  <div className="font-black text-base">Riwayat Nilai Tugas</div>
                  {kirimanSaya.map((k) => (
                    <div key={k.id} className="flex justify-between p-2.5 bg-white rounded-lg border">
                      <span>{daftarTugas.find((t) => t.id === k.tugasId)?.judul}</span>
                      <b className="text-emerald-700">
                        {k.nilai !== undefined ? `${k.nilai}/100` : "Pending"}
                      </b>
                    </div>
                  ))}
                </div>
                <div className="p-4 border rounded-2xl bg-slate-50 space-y-2">
                  <div className="font-black text-base">Riwayat Skor Tryout CBT</div>
                  {tryoutSaya.map((r) => (
                    <div key={r.id} className="flex justify-between p-2.5 bg-white rounded-lg border">
                      <span>{r.paketJudul}</span>
                      <b className="text-indigo-700">{r.skor} / 100</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 text-slate-900 p-10 rounded-[2.5rem] border-4 border-double border-amber-400 shadow-xl text-center space-y-4">
              <img
                src="/hibahilmu.jpg"
                alt="Logo HibahIlmu"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-md border-2 border-emerald-500"
              />
              <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Sertifikat Kompetensi Digital Terverifikasi • HibahIlmu.id
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                SERTIFIKAT PENGHARGAAN BELAJAR
              </h2>
              <p className="text-sm text-slate-600">Diberikan secara resmi kepada:</p>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 underline decoration-amber-400">
                {userLogin?.nama}
              </div>
              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Telah menyelesaikan <b>{materiSelesai.length} Modul Pembelajaran</b> dan meraih
                total keaktifan <b>{poinXP} XP</b> pada platform pendidikan terbuka HibahIlmu.id.
              </p>
              <div className="text-xs font-mono text-slate-500">
                No. Seri Verifikasi: HIBAH-2026-{userLogin?.id.toUpperCase()}
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" /> Cetak / Simpan Sertifikat (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

        {siswaTabAktif === "minat" && (
          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border space-y-4">
            <h2 className="text-xl font-black">Pilih Kelas &amp; Materi yang Ingin Kamu Ikuti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {semuaSubJenjangFlat.map((sj) => {
                const aktif = minatSaya.includes(sj.id);
                return (
                  <label
                    key={sj.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 ${
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
                      <div className="text-xs font-black uppercase text-slate-400">
                        {sj.namaInduk}
                      </div>
                      <div className="text-sm font-extrabold">{sj.nama}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {siswaTabAktif === "kelas" && (
          <div className="space-y-6">
            <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-600" /> Jadwal Kelas Live Tatap Maya (Meet / Zoom)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jadwalLive.map((jl) => (
                  <div
                    key={jl.id}
                    className="p-4 border rounded-2xl bg-rose-50/40 border-rose-200 flex justify-between items-center gap-4 text-sm"
                  >
                    <div>
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        {jl.targetKelas}
                      </span>
                      <div className="font-black text-base text-slate-900 mt-1">{jl.judulSesi}</div>
                      <div className="text-slate-600">
                        Bersama: {jl.pengajarNama} • {jl.tanggalJam}
                      </div>
                    </div>
                    <a
                      href={jl.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-black shrink-0"
                    >
                      Gabung Live
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
              <h2 className="text-xl font-black">Ruang Kelas (Rombel) &amp; Pengumuman Guru</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kelasSaya.map((k) => (
                  <div
                    key={k.id}
                    className="p-5 border rounded-2xl bg-emerald-50/50 border-emerald-200 space-y-2"
                  >
                    <div className="font-black text-emerald-950 text-lg">{k.namaKelas}</div>
                    {k.pengumuman && (
                      <div className="p-3 bg-white border border-emerald-200 rounded-xl text-sm text-slate-700">
                        <b>Pengumuman:</b> {k.pengumuman}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ==========================================
  // RENDER UTAMA DENGAN LOGO HIBAHILMU.JPG & FONT PROPORSIONAL
  // ==========================================
  return (
    <div
      className={`min-h-screen font-sans antialiased relative overflow-x-hidden transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-800"
      } ${ukuranTeksBesar ? "text-lg leading-relaxed" : "text-base leading-normal"}`}
    >
      {/* Latar Belakang Cahaya Lembut */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[34rem] h-[34rem] bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[34rem] h-[34rem] bg-emerald-400/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER NAVBAR DENGAN LOGO HIBAHILMU.JPG */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-xs ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src="/hibahilmu.jpg"
              alt="Logo HibahIlmu"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
              }}
              className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-emerald-500 group-hover:scale-105 transition"
            />
            <div>
              <div className="font-black text-2xl tracking-tight leading-none">HibahIlmu.id</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider mt-1">
                Wakaf &amp; Hibah Ilmu Gratis
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "beranda", label: "Beranda & Kelas" },
              { id: "tryout", label: "Tryout CBT" },
              { id: "leaderboard", label: "Leaderboard XP" },
              { id: "forum", label: "Forum Tanya PR" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-extrabold transition whitespace-nowrap cursor-pointer ${
                  menuAktif === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : darkMode
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 relative">
            <button
              onClick={() => setUkuranTeksBesar(!ukuranTeksBesar)}
              className="p-2.5 rounded-xl border text-sm font-black hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Perbesar Ukuran Font"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Mode Gelap / Terang"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-sm font-black">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>

            {userLogin && (
              <div className="relative">
                <button
                  onClick={() => setBukaMenuNotif(!bukaMenuNotif)}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-700 relative"
                >
                  <Bell className="w-4 h-4" />
                  {jumlahNotifBelumDibaca > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {jumlahNotifBelumDibaca}
                    </span>
                  )}
                </button>

                {bukaMenuNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-3xl shadow-2xl border p-4 z-50">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <span className="font-black text-sm">Kotak Masuk Notifikasi</span>
                      <button
                        onClick={tandaiSemuaNotifDibaca}
                        className="text-xs font-bold text-indigo-600 underline"
                      >
                        Tandai Dibaca
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifikasiUserAktif.map((n) => (
                        <div key={n.id} className="p-3 rounded-xl border text-xs bg-slate-50">
                          <div className="font-black">{n.judul}</div>
                          <p className="text-slate-600 my-0.5">{n.pesan}</p>
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
              className="px-5 py-2.5 rounded-xl text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Masuk / Daftar"}</span>
              {jumlahPending > 0 && (
                <span className="bg-rose-500 text-white text-xs px-1.5 rounded-full">
                  {jumlahPending}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* HALAMAN BERANDA UTAMA: MENAMPILKAN 3D HERO & KATALOG JENJANG */}
        {menuAktif === "beranda" && (
          <div>
            {!jenjangAktif && !kelasAktif && (
              <div>
                {/* PANGGUNG 3D & AJAKAN MENYUMBANG ILMU */}
                {renderHero3DShowcase()}

                {/* KATALOG JENJANG PENDIDIKAN */}
                <div id="katalog-jenjang" className="space-y-8 pt-4">
                  <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                        Kurikulum Terbuka Nasional
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black mt-1">
                        Pilih Jenjang Pendidikan &amp; Ruang Kelas
                      </h2>
                    </div>

                    {userLogin && userLogin.role === "siswa" && (
                      <div className="inline-flex flex-wrap items-center gap-2 bg-white text-slate-800 p-2 rounded-2xl border shadow-xs">
                        <button
                          onClick={() => setHanyaMateriDiikuti(true)}
                          className={`px-4 py-2 rounded-xl text-xs font-black ${
                            hanyaMateriDiikuti ? "bg-emerald-600 text-white" : "text-slate-600"
                          }`}
                        >
                          Kelas yang Saya Ikuti ({(userLogin.minatSubJenjang || []).length})
                        </button>
                        <button
                          onClick={() => setHanyaMateriDiikuti(false)}
                          className={`px-4 py-2 rounded-xl text-xs font-black ${
                            !hanyaMateriDiikuti ? "bg-slate-900 text-white" : "text-slate-600"
                          }`}
                        >
                          Semua Katalog Jenjang
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {daftarJenjang
                      .filter((j) => {
                        if (userLogin?.role === "siswa" && hanyaMateriDiikuti) {
                          const minat = userLogin.minatSubJenjang || [];
                          return j.subJenjang.some((sj) => minat.includes(sj.id));
                        }
                        return true;
                      })
                      .map((jenjang) => (
                        <motion.div
                          key={jenjang.id}
                          whileHover={{ y: -6 }}
                          onClick={() => {
                            if (!userLogin) {
                              setMenuAktif("dashboard");
                            } else {
                              setJenjangAktif(jenjang);
                              setSubJenjangAktif("semua");
                            }
                          }}
                          className="cursor-pointer bg-white text-slate-800 rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-2xl transition flex flex-col justify-between relative overflow-hidden"
                        >
                          <div
                            className={`h-2.5 w-full bg-gradient-to-r ${jenjang.gradien} absolute top-0 left-0`}
                          />
                          <div>
                            <div className="flex justify-between items-start mb-6">
                              <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${jenjang.gradien} flex items-center justify-center shadow-md`}
                              >
                                {renderIkon(jenjang.ikonNama)}
                              </div>
                              <span
                                className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-full ${jenjang.badge}`}
                              >
                                {jenjang.subJenjang.length} Tingkat Kelas
                              </span>
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-slate-900">
                              {jenjang.nama}
                            </h3>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                              {jenjang.deskripsi}
                            </p>
                          </div>
                          <div className="pt-4 border-t flex justify-between items-center text-base font-extrabold text-emerald-600">
                            <span>
                              {userLogin ? "Buka Materi Kelas" : "Login untuk Membuka Kelas"}
                            </span>
                            <span>→</span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {jenjangAktif && !kelasAktif && (
              <div>
                <button
                  onClick={() => setJenjangAktif(null)}
                  className="mb-6 bg-white text-slate-800 px-5 py-3 border rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jenjangAktif.kelas.map((k) => (
                    <div
                      key={k.id}
                      onClick={() => setKelasAktif(k)}
                      className="bg-white text-slate-800 p-7 border-2 rounded-3xl cursor-pointer hover:shadow-xl transition flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <h3 className="text-2xl font-black mb-2 text-slate-900">{k.judul}</h3>
                        <p className="text-base text-slate-600 line-clamp-2 mb-4">
                          {bersihkanTagHtml(k.rangkuman)}
                        </p>
                        <div className="p-3 bg-slate-50 border rounded-xl text-xs text-slate-600">
                          Kontributor Ilmu: <b>{k.pembuatNama}</b> ({k.pembuatEmail})
                        </div>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center text-base font-bold text-indigo-600">
                        <span>Buka Video, Rangkuman &amp; Kuis</span>
                        <span>→</span>
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
                    className="bg-white text-slate-800 px-5 py-3 border rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
                  </button>
                  <button
                    onClick={() => toggleSelesaiMateri(kelasAktif.id)}
                    className="px-6 py-3 rounded-xl text-sm font-black bg-emerald-600 text-white shadow-md"
                  >
                    {materiSelesai.includes(kelasAktif.id)
                      ? "Selesai Dipelajari (+30 XP)"
                      : "Tandai Selesai"}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white text-slate-800 p-8 rounded-3xl border shadow-2xs">
                      <div className="aspect-video bg-slate-900 rounded-2xl mb-6 overflow-hidden">
                        <iframe
                          src={kelasAktif.videoUrl}
                          title={kelasAktif.judul}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black mb-3 text-slate-900">
                        {kelasAktif.judul}
                      </h1>
                      <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
                        <b>Kehadiran Tercatat Otomatis!</b> • Kontributor Materi:{" "}
                        <b>{kelasAktif.pembuatNama}</b>
                      </div>
                      <div
                        className="prose prose-slate max-w-none text-base leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: kelasAktif.rangkuman }}
                      />
                    </div>

                    {/* LIVE CHAT DISKUSI SPESIFIK PER MATERI */}
                    <div className="bg-white text-slate-800 p-6 rounded-3xl border space-y-4">
                      <h3 className="font-black text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-600" /> Ruang Diskusi Materi
                        Ini
                      </h3>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto p-3.5 bg-slate-50 rounded-2xl border">
                        {(chatPerMateri[kelasAktif.id] || []).map((ch) => (
                          <div
                            key={ch.id}
                            className="p-3.5 bg-white rounded-xl border text-sm space-y-1"
                          >
                            <div className="flex justify-between font-bold">
                              <span>
                                {ch.pengirimNama}{" "}
                                <span className="text-xs uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                  {ch.pengirimRole}
                                </span>
                              </span>
                              <span className="text-slate-400 text-xs">{ch.waktu}</span>
                            </div>
                            <p className="text-slate-700">{ch.pesan}</p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleKirimChatMateri} className="flex gap-2">
                        <input
                          type="text"
                          value={inputChatMateri}
                          onChange={(e) => setInputChatMateri(e.target.value)}
                          placeholder="Tanyakan sesuatu tentang bab ini..."
                          className="flex-1 p-3.5 bg-slate-50 border rounded-xl text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold"
                        >
                          Kirim
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white text-slate-800 p-7 rounded-3xl border-2 border-indigo-100 shadow-md">
                      <h3 className="font-black text-lg flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-amber-500" /> Evaluasi Kuis (
                        {kelasAktif.daftarKuis.length} Soal)
                      </h3>
                      <div className="space-y-6">
                        {kelasAktif.daftarKuis.map((kuis, idxKuis) => {
                          const statusJawab = statusKuisSiswa[kuis.id];
                          return (
                            <div
                              key={kuis.id}
                              className="p-5 rounded-2xl bg-slate-50 border space-y-3"
                            >
                              <div className="text-xs font-black uppercase text-indigo-800">
                                Soal #{idxKuis + 1} (+{kuis.poin} XP)
                              </div>
                              <p className="font-bold text-base text-slate-900">{kuis.tanya}</p>
                              {(kuis.tipe === "pilihan_ganda" || kuis.tipe === "benar_salah") && (
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
                                      className={`w-full text-left p-3.5 rounded-xl border-2 font-semibold text-sm ${
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
                              {statusJawab === "benar" && (
                                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 font-bold">
                                  Benar! {kuis.pembahasan}
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

        {/* MENU LAINNYA WAJIB LOGIN */}
        {menuAktif !== "beranda" && !userLogin ? (
          renderAuthView()
        ) : (
          <>
            {menuAktif === "dashboard" && userLogin && (
              <div>
                {userLogin.role === "admin" && renderAdminView()}
                {userLogin.role === "guru" && renderGuruView()}
                {userLogin.role === "siswa" && renderSiswaView()}
              </div>
            )}

            {menuAktif === "leaderboard" && userLogin && (
              <div className="max-w-3xl mx-auto bg-white text-slate-800 rounded-3xl p-8 border shadow-sm space-y-6">
                <div className="text-center space-y-2">
                  <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                  <h2 className="text-2xl font-black">
                    Papan Peringkat Pelajar &amp; Kontributor (Global Leaderboard)
                  </h2>
                </div>
                <div className="space-y-3">
                  {[...safeAkunList]
                    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                    .map((akun, index) => (
                      <div
                        key={akun.id}
                        className={`p-4 rounded-2xl border flex justify-between items-center ${
                          index === 0
                            ? "bg-amber-50 border-amber-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <div>
                            <div className="font-black text-base">{akun.nama}</div>
                            <div className="text-sm text-slate-500">{akun.infoTambahan}</div>
                          </div>
                        </div>
                        <span className="font-black text-base text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
                          {akun.id === userLogin.id ? poinXP : akun.xp || 150} XP
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {menuAktif === "tryout" && userLogin && (
              <div className="max-w-5xl mx-auto">
                {!sedangUjian && !ujianSelesai && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl">
                      <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                        Proctored CBT System
                      </span>
                      <h1 className="text-3xl font-black mt-3 mb-2">
                        Pusat Ujian Tryout, TPA, TOEP &amp; TOEFL
                      </h1>
                      <p className="text-sm text-indigo-200 max-w-xl">
                        Dilengkapi proteksi Fullscreen otomatis dan sensor anti-curang Alt+Tab.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {daftarPaketTryout.map((pkt) => {
                        const percobaanUser = riwayatTryout.filter(
                          (r) => r.paketId === pkt.id && r.userId === userLogin.id
                        ).length;
                        return (
                          <div
                            key={pkt.id}
                            className="bg-white text-slate-800 rounded-3xl p-7 border-2 border-slate-200 shadow-2xs flex flex-col justify-between space-y-5"
                          >
                            <div className="space-y-3">
                              <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                                {pkt.kategoriTes} • {pkt.jenjang}
                              </span>
                              <h3 className="text-2xl font-black text-slate-900">{pkt.judul}</h3>
                              <div className="space-y-1 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border">
                                <div>
                                  Lokasi: <b>{pkt.alamatLokasi}</b>
                                </div>
                                <div>
                                  Jadwal: <b>{pkt.jadwalUjian}</b> ({pkt.durasiMenit} Menit)
                                </div>
                                <div>
                                  Percobaan: <b>{percobaanUser} / {pkt.batasPercobaan}x</b>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => mulaiUjianTryout(pkt)}
                              disabled={percobaanUser >= pkt.batasPercobaan}
                              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${
                                percobaanUser >= pkt.batasPercobaan
                                  ? "bg-slate-200 text-slate-500"
                                  : "bg-indigo-600 text-white"
                              }`}
                            >
                              <Maximize2 className="w-4 h-4" />
                              {percobaanUser >= pkt.batasPercobaan
                                ? "Batas Percobaan Habis"
                                : "Mulai Ujian (Fullscreen Anti-Cheat)"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sedangUjian && paketTryoutAktif && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
                      <span className="text-sm font-bold">{paketTryoutAktif.judul}</span>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg text-xs font-black bg-rose-600">
                          Pelanggaran Alt+Tab: {jumlahPelanggaranUjian} /{" "}
                          {paketTryoutAktif.batasPelanggaran}
                        </span>
                        <span className="font-mono text-lg font-black text-amber-300">
                          {Math.floor(sisaWaktu / 60)}:
                          {(sisaWaktu % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {pesanPeringatanCheat && (
                      <div className="p-4 bg-rose-600 text-white rounded-2xl text-sm font-black flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{pesanPeringatanCheat}</span>
                      </div>
                    )}

                    <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
                      <h3 className="font-extrabold text-xl">
                        #{indeksSoalTryoutAktif + 1}.{" "}
                        {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].pertanyaan}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].opsi.map((ops, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              setJawabanUserTryout((p) => ({
                                ...p,
                                [indeksSoalTryoutAktif]: idx,
                              }))
                            }
                            className={`p-4 rounded-2xl border-2 text-base font-bold text-left ${
                              jawabanUserTryout[indeksSoalTryoutAktif] === idx
                                ? "bg-indigo-50 border-indigo-600 text-indigo-900"
                                : "border-slate-200"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}. {ops}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between pt-4 border-t">
                        <button
                          disabled={indeksSoalTryoutAktif === 0}
                          onClick={() => setIndeksSoalTryoutAktif((i) => Math.max(0, i - 1))}
                          className="px-5 py-3 rounded-xl border font-bold text-sm"
                        >
                          ← Sebelumnya
                        </button>
                        {indeksSoalTryoutAktif < paketTryoutAktif.daftarSoal.length - 1 ? (
                          <button
                            onClick={() => setIndeksSoalTryoutAktif((i) => i + 1)}
                            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
                          >
                            Selanjutnya →
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              selesaikanTryoutOtomatis(jumlahPelanggaranUjian, "Selesai Normal")
                            }
                            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm"
                          >
                            Kumpulkan Ujian
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {ujianSelesai && paketTryoutAktif && (
                  <div className="bg-white text-slate-800 p-10 rounded-3xl border text-center space-y-4">
                    <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
                    <h2 className="text-4xl font-black">Skor Akhir: {skorTryout} / 100</h2>
                    <button
                      onClick={() => {
                        setUjianSelesai(false);
                        setSedangUjian(false);
                        setPaketTryoutAktif(null);
                      }}
                      className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm"
                    >
                      Kembali ke Daftar Paket Tryout
                    </button>
                  </div>
                )}
              </div>
            )}

            {menuAktif === "forum" && userLogin && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white text-slate-800 p-8 border rounded-3xl shadow-sm">
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
                          waktu: "Baru saja",
                          likes: 0,
                          solved: false,
                          jawaban: [],
                        },
                        ...daftarDiskusi,
                      ]);
                      setJudulTanyaBaru("");
                      setTanyaBaru("");
                      tambahXP(20);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      required
                      value={judulTanyaBaru}
                      onChange={(e) => setJudulTanyaBaru(e.target.value)}
                      placeholder="Judul Topik / Soal..."
                      className="w-full p-4 bg-slate-50 border rounded-xl text-sm font-bold"
                    />
                    <textarea
                      rows={3}
                      required
                      value={tanyaBaru}
                      onChange={(e) => setTanyaBaru(e.target.value)}
                      placeholder="Ketik detail pertanyaan PR kamu di sini..."
                      className="w-full p-4 bg-slate-50 border rounded-xl text-base"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm"
                    >
                      Kirim Pertanyaan (+20 XP)
                    </button>
                  </form>
                </div>

                {daftarDiskusi.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white text-slate-800 p-7 border rounded-3xl space-y-3"
                  >
                    <h3 className="font-black text-xl">{d.judul}</h3>
                    <p className="text-base text-slate-700">{d.pertanyaan}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MODAL IMPORT AKUN */}
        {modalImportAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-800 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black">Import Akun Massal (CSV)</h3>
              <button
                type="button"
                onClick={() => setTeksImportAkun(TEMPLATE_CSV_AKUN)}
                className="text-sm font-bold text-indigo-600 underline"
              >
                Muat Contoh CSV Akun
              </button>
              <form onSubmit={handleProsesImportAkun} className="space-y-3">
                <textarea
                  rows={5}
                  required
                  value={teksImportAkun}
                  onChange={(e) => setTeksImportAkun(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    Proses Import
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalImportAkun(false)}
                    className="px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
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
            <div className="bg-white text-slate-800 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black">Import Soal Kuis (CSV Excel)</h3>
              <button
                type="button"
                onClick={() => setTeksImportKuis(TEMPLATE_CSV_KUIS)}
                className="text-sm font-bold text-indigo-600 underline"
              >
                Muat Contoh CSV 5 Tipe Soal
              </button>
              <form onSubmit={handleProsesImportKuis} className="space-y-3">
                <textarea
                  rows={5}
                  required
                  value={teksImportKuis}
                  onChange={(e) => setTeksImportKuis(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    Masukkan ke Materi
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalImportKuis(false)}
                    className="px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
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
            <div className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-black mb-4">Tambah Tingkat Kelas / Prodi</h3>
              <form onSubmit={tambahKategoriBaru} className="space-y-4 text-sm">
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

      {/* FOOTER RESMI DENGAN LOGO HIBAHILMU.JPG */}
      <footer className="border-t py-12 text-center text-sm text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
          <img
            src="/hibahilmu.jpg"
            alt="Logo HibahIlmu"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-emerald-500"
          />
          <div className="font-black text-lg text-slate-800 dark:text-slate-200">
            HibahIlmu.id — Gerakan Wakaf &amp; Hibah Ilmu Pengetahuan Indonesia
          </div>
          <p className="max-w-md text-xs text-slate-500">
            Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • Seluruh materi dan ujian
            100% gratis serta dapat dipertanggungjawabkan secara akademis.
          </p>
        </div>
      </footer>
    </div>
  );
}