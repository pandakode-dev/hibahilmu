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
  Award,
  ThumbsUp,
  Flag,
  UserCheck,
  Globe,
  Sparkle,
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
  opsi: string[]; // Untuk PG, PG Kompleks, Benar/Salah
  jawabanBenar: number; // Untuk PG & Benar/Salah
  jawabanJamak?: number[]; // Indeks-indeks benar untuk pilihan_jamak
  jawabanTeks?: string; // Untuk isian_singkat
  pasangan?: PasanganCocok[]; // Untuk tipe mencocokkan
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

export interface SoalTryout {
  id: string;
  jenjang: string;
  mapel: string;
  pertanyaan: string;
  gambarUrl?: string;
  rumus?: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
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
  cv?: BiodataCV;
}

export interface NotifikasiItem {
  id: string;
  targetUserId: string; // ID user penerima atau "ALL"
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
      infoTambahan: "Guru Biologi SMA",
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
Dewi Lestari S.Pd,dewi.csv@hibahilmu.id,123,guru,Guru Biologi SMA
Ahmad Fauzi,ahmad.csv@hibahilmu.id,123,siswa,Siswa Kelas 12 MIPA
Siti Nurhaliza,siti.csv@hibahilmu.id,123,siswa,Mahasiswi S1 Informatika`;

const TEMPLATE_JSON_KUIS = JSON.stringify(
  [
    {
      tipe: "pilihan_ganda",
      tanya: "Satuan Internasional (SI) untuk besaran Gaya adalah...",
      gambarSoalUrl: "",
      opsi: ["Joule", "Newton", "Watt", "Pascal"],
      jawabanBenar: 1,
      pembahasan: "Gaya diukur dalam satuan Newton (N).",
      poin: 50,
    },
    {
      tipe: "pilihan_jamak",
      tanya: "Manakah di bawah ini yang termasuk besaran pokok? (Pilih lebih dari 1)",
      opsi: ["Panjang", "Kecepatan", "Massa", "Gaya"],
      jawabanBenar: 0,
      jawabanJamak: [0, 2],
      pembahasan: "Panjang dan Massa adalah besaran pokok, sedangkan Kecepatan dan Gaya adalah besaran turunan.",
      poin: 60,
    },
    {
      tipe: "mencocokkan",
      tanya: "Cocokkan besaran fisika berikut dengan satuannya yang tepat!",
      opsi: [],
      jawabanBenar: 0,
      pasangan: [
        { kiri: "Arus Listrik", kanan: "Ampere" },
        { kiri: "Suhu", kanan: "Kelvin" },
        { kiri: "Energi", kanan: "Joule" },
      ],
      pembahasan: "Arus = Ampere, Suhu = Kelvin, Energi = Joule.",
      poin: 70,
    },
  ],
  null,
  2
);

const TEMPLATE_CSV_KUIS = `tipe,tanya,opsi_atau_pasangan,kunci,pembahasan,poin,gambarUrl
pilihan_ganda,Ibukota provinsi Riau adalah...,Pekanbaru|Dumai|Padang|Medan,0,Pekanbaru adalah ibukota provinsi Riau,50,
pilihan_jamak,Pilih bilangan prima di bawah ini (Lebih dari 1),2|4|5|9,0|2,Angka 2 dan 5 adalah bilangan prima,60,
benar_salah,Air mendidih pada suhu 100 derajat Celcius di tekanan 1 atm.,Benar|Salah,0,Pada tekanan 1 atm titik didih air adalah 100 C,30,
isian_singkat,Berapakah hasil dari 15 ditambah 25?,,40,15 + 25 = 40,40,
mencocokkan,Cocokkan negara dengan ibukotanya!,Indonesia:Jakarta|Jepang:Tokyo|Mesir:Kairo,0,Pasangan ibukota negara di dunia,70,`;

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
          {
            id: "q-tk-2",
            tipe: "mencocokkan",
            tanya: "Cocokkan warna buah berikut dengan benar!",
            opsi: [],
            jawabanBenar: 0,
            pasangan: [
              { kiri: "Pisang Matang", kanan: "Kuning" },
              { kiri: "Apel Manis", kanan: "Merah" },
              { kiri: "Daun Segar", kanan: "Hijau" },
            ],
            pembahasan: "Pisang berwarna kuning, apel merah, dan daun hijau.",
            poin: 60,
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
          {
            id: "q-sd-2",
            tipe: "pilihan_jamak",
            tanya: "Manakah bangun datar yang memiliki 4 sisi? (Pilih lebih dari 1 jawaban benar)",
            opsi: ["Persegi", "Segitiga", "Trapesium", "Lingkaran"],
            jawabanBenar: 0,
            jawabanJamak: [0, 2],
            pembahasan: "Persegi dan Trapesium sama-sama memiliki 4 sisi.",
            poin: 60,
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
    nama: "Kuliah & Karier",
    tagline: "Keahlian Profesional & IT",
    deskripsi: "Pemrograman Web (Panda Kode), Artificial Intelligence, Big Data & Desain.",
    gradien: "from-emerald-500 via-teal-600 to-cyan-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikonNama: "graduation",
    subJenjang: [
      { id: "pt-ti", nama: "S1 Teknik Informatika" },
      { id: "pt-si", nama: "S1 Sistem Informasi" },
      { id: "pt-dkv", nama: "S1 Desain Komunikasi Visual" },
      { id: "pt-manajemen", nama: "S1 Manajemen Bisnis" },
    ],
    kelas: [],
  },
];

const BANK_SOAL_TRYOUT: SoalTryout[] = [
  {
    id: "to-1",
    jenjang: "SD / MI",
    mapel: "Matematika Dasar",
    pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 x 3) - 10 adalah...",
    rumus: "Ingat KABATAKU: Kerjakan tanda kurung dan perkalian dulu!",
    opsi: ["51", "101", "61", "45"],
    jawabanBenar: 0,
    pembahasan: "12 x 3 = 36. Lalu 25 + 36 - 10 = 51.",
  },
  {
    id: "to-2",
    jenjang: "SMP / MTs",
    mapel: "Aljabar",
    pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?",
    rumus: "Substitusikan x = 4 ke dalam fungsi f(x)",
    opsi: ["5", "7", "12", "17"],
    jawabanBenar: 1,
    pembahasan: "f(4) = 3(4) - 5 = 12 - 5 = 7.",
  },
  {
    id: "to-3",
    jenjang: "SMA / SMK",
    mapel: "Fisika Mekanika",
    pertanyaan: "Mobil bermassa 1000 kg dipercepat dengan percepatan 2 m/s2. Besar gaya mesinnya adalah...",
    rumus: "F = m x a",
    opsi: ["500 N", "1000 N", "2000 N", "4000 N"],
    jawabanBenar: 2,
    pembahasan: "F = 1000 kg x 2 m/s2 = 2000 Newton.",
  },
  {
    id: "to-4",
    jenjang: "Kuliah & IT",
    mapel: "Rekayasa Perangkat Lunak",
    pertanyaan: "Perintah Git untuk mengunggah commit lokal ke branch remote di GitHub adalah...",
    opsi: ["git pull", "git push", "git checkout", "git status"],
    jawabanBenar: 1,
    pembahasan: "git push mengirimkan commit lokal ke repositori remote.",
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
    aksesMengajar: [],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: "System Architect & EdTech Founder",
      bioSingkat: "Mengembangkan ekosistem pendidikan terbuka gratis untuk pelajar dan mahasiswa Indonesia.",
      asalSekolahKampus: "Institut Teknologi & Sains",
      pendidikanTerakhir: "S2 Ilmu Komputer",
      skills: ["Next.js", "TypeScript", "Big Data", "Reinforcement Learning"],
      pengalaman: ["Lead Developer HibahIlmu (2025 - Sekarang)", "Software Engineer (2023 - 2025)"],
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
    infoTambahan: "Guru Matematika & Fisika SMA",
    waktuDaftar: "Kemarin, 09:00",
    aksesMengajar: ["sma-10", "sma-11-ipa", "sma-12-ipa", "sd-4"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      headline: "Pendidik Fisika & Pembina Olimpiade Sains",
      bioSingkat: "Berpengalaman 10 tahun mengajar Fisika Mekanika dan membimbing siswa menuju OSN.",
      asalSekolahKampus: "SMAN 1 Nusantara / Universitas Pendidikan",
      pendidikanTerakhir: "S2 Pendidikan Fisika (M.Pd)",
      skills: ["Fisika Mekanika", "Kalkulus", "Kurikulum Merdeka", "STEM Coaching"],
      pengalaman: ["Guru Fisika SMAN 1 (2016 - Sekarang)", "Mentor Relawan HibahIlmu (2026)"],
      prestasi: ["Guru Berprestasi Tingkat Nasional 2024", "Pembina Medali Emas OSN Fisika"],
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
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      headline: "Siswi Kelas 11 MIPA & Penggemar Sains",
      bioSingkat: "Suka belajar Fisika, Matematika, dan pemrograman dasar untuk persiapan masuk teknik.",
      asalSekolahKampus: "SMAN 2 Harapan Bangsa",
      pendidikanTerakhir: "SMA Kelas 11 MIPA",
      skills: ["Matematika", "Fisika Dasar", "Python Dasar", "Public Speaking"],
      pengalaman: ["Ketua Klub Sains Sekolah (2025 - Sekarang)", "Panitia Olimpiade Sekolah"],
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
    waktuDaftar: "Hari ini, 08:15",
    aksesMengajar: [],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      headline: "Mahasiswa S1 Teknik Informatika",
      bioSingkat: "Fokus mendalami Fullstack Web Development dan AI.",
      asalSekolahKampus: "Universitas Teknologi",
      pendidikanTerakhir: "S1 Teknik Informatika (Semester 5)",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      pengalaman: ["Asisten Laboratorium Pemrograman (2025 - Sekarang)"],
      prestasi: ["Finalis Hackathon Nasional 2025"],
      portfolioUrl: "https://github.com",
    },
  },
];

const NOTIF_AWAL: NotifikasiItem[] = [
  {
    id: "notif-1",
    targetUserId: "sis-1",
    judul: "Pengumuman Kelas Fisika 11 MIPA A",
    pesan: "Jangan lupa kerjakan kuis Hukum Newton & Mencocokkan Rumus sebelum hari Jumat ya!",
    pengirim: "Bapak Budi Santoso, M.Pd",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    waktu: "Hari ini, 09:00",
    dibaca: false,
  },
  {
    id: "notif-2",
    targetUserId: "gru-1",
    judul: "Aktivitas Murid di Kelas",
    pesan: "Aisyah Putri telah bergabung dan menyelesaikan latihan modul Fisika Mekanika.",
    pengirim: "Sistem HibahIlmu",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    waktu: "Kemarin",
    dibaca: false,
  },
];

const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "08:30 WIB",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mengunggah modul materi baru pada jenjang SMA",
    kategori: "materi",
  },
];

const KELOMPOK_AWAL: KelompokBelajar[] = [
  {
    id: "rombel-1",
    namaKelas: "Kelas Intensif Fisika 11 MIPA A",
    pengumuman: "Jangan lupa kerjakan kuis Hukum Newton sebelum hari Jumat ya!",
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
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Poin 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Penjelasan 1</td>
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
          title="Stabilo Kuning"
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
        className="p-4 min-h-[180px] max-h-[360px] overflow-y-auto text-sm outline-none prose prose-slate max-w-none"
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

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
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

  // State Tryout Pro (CBT)
  const [filterJenjangTryout, setFilterJenjangTryout] = useState<string>("Semua");
  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(300);
  const [indeksSoalTryoutAktif, setIndeksSoalTryoutAktif] = useState<number>(0);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [raguRaguTryout, setRaguRaguTryout] = useState<number[]>([]);
  const [skorTryout, setSkorTryout] = useState<number>(0);

  // State Forum PR & Diskusi Pro
  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>([
    {
      id: "pr-1",
      penanya: "Rizky (SMP)",
      jenjang: "SMP / MTs",
      mapel: "Matematika",
      judul: "Cara membedakan rumus Luas & Keliling Lingkaran",
      pertanyaan:
        "Halo kak, saya sering tertukar antara rumus luas lingkaran dan keliling lingkaran saat mengerjakan soal cerita. Ada tips menghafalnya?",
      waktu: "1 jam lalu",
      likes: 5,
      solved: true,
      jawaban: [
        {
          id: "jwb-1",
          penjawab: "Bapak Budi Santoso, M.Pd",
          rolePenjawab: "guru",
          isi: "Ingat saja: Luas itu satuannya persegi (pangkat 2), jadi rumusnya pasti yang ada pangkat duanya yaitu pi x r^2. Kalau keliling tidak pakai pangkat, yaitu 2 x pi x r.",
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

  // State Guru Buat Materi & Multi-Soal Kuis
  const [guruTabAktif, setGuruTabAktif] = useState<"materi" | "kelas" | "cv">("materi");
  const [siswaTabAktif, setSiswaTabAktif] = useState<"kelas" | "cv">("kelas");

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

    if (savedXP) setPoinXP(parseInt(savedXP, 10));
    if (savedSelesai) setMateriSelesai(JSON.parse(savedSelesai));
    if (savedAkunList) setDaftarAkun(JSON.parse(savedAkunList));
    if (savedUserAktif) setUserLogin(JSON.parse(savedUserAktif));
    if (savedLogs) setLogAktivitas(JSON.parse(savedLogs));
    if (savedStruktur) setDaftarJenjang(JSON.parse(savedStruktur));
    if (savedKelompok) setDaftarKelompok(JSON.parse(savedKelompok));
    if (savedNotif) setDaftarNotifikasi(JSON.parse(savedNotif));
  }, []);

  // Sinkronisasi form CV saat userLogin berubah
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

  // IMPORT SOAL KUIS VIA CSV (EXCEL) ATAU JSON
  const handleProsesImportKuis = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modeImportKuisFormat === "json") {
        const parsed = JSON.parse(teksImportKuis);
        if (!Array.isArray(parsed)) return alert("Format JSON harus berupa Array [...]");
        const soalTerimpor: KuisItem[] = parsed.map((item: Partial<KuisItem>, idx: number) => ({
          id: "imp-q-" + Date.now() + "-" + idx,
          tipe: item.tipe || "pilihan_ganda",
          tanya: item.tanya || `Soal #${idx + 1}`,
          gambarSoalUrl: item.gambarSoalUrl || "",
          opsi: item.opsi || ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
          jawabanBenar: typeof item.jawabanBenar === "number" ? item.jawabanBenar : 0,
          jawabanJamak: item.jawabanJamak || [0, 1],
          jawabanTeks: item.jawabanTeks || "",
          pasangan: item.pasangan || [
            { kiri: "Item A", kanan: "Pasangan A" },
            { kiri: "Item B", kanan: "Pasangan B" },
          ],
          pembahasan: item.pembahasan || "Disusun oleh Guru.",
          poin: typeof item.poin === "number" ? item.poin : 50,
        }));
        setDaftarKuisDraft(soalTerimpor);
        setModalImportKuis(false);
        setTeksImportKuis("");
      } else {
        // Parse CSV Format: tipe,tanya,opsi_atau_pasangan,kunci,pembahasan,poin,gambarUrl
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
      }
    } catch {
      alert("Gagal memproses data! Pastikan format CSV atau JSON sudah sesuai contoh.");
    }
  };

  // --- FUNGSI AUTENTIKASI ---
  const loginCepat = (akun: AkunPengguna) => {
    setPesanError("");
    if (akun.status === "pending") return setPesanError("Akun menunggu persetujuan Admin.");
    if (akun.status === "rejected") return setPesanError("Akun sedang disuspend.");
    setUserLogin(akun);
    localStorage.setItem("hibah_user_aktif", JSON.stringify(akun));
    catatLog(akun.nama, akun.role, "Berhasil masuk ke Dashboard", "akun");
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
      infoTambahan: infoReg || "Pengguna Baru",
      waktuDaftar: "Baru saja",
      aksesMengajar: [],
    };
    const daftarTerbaru = [akunBaru, ...(daftarAkun || [])];
    setDaftarAkun(daftarTerbaru);
    localStorage.setItem("hibah_daftar_akun", JSON.stringify(daftarTerbaru));
    catatLog(namaReg, roleReg === "admin" ? "admin" : roleReg, "Mendaftar akun (Pending)", "akun");
    setPesanSukses("Pendaftaran terkirim! Menunggu persetujuan Admin.");
    setNamaReg("");
    setEmailReg("");
    setPasswordReg("");
    setInfoReg("");
    setModeAuth("login");
  };

  // --- FUNGSI ADMIN (AKUN & IMPORT CSV/JSON) ---
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
    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Hapus massal ${selectedAkunIds.length} akun`,
      "akun"
    );
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
      catatLog(userLogin?.nama || "Admin", "admin", `Mengedit akun ${namaFormAdmin}`, "akun");
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
      };
      const gabungan = [akunBaru, ...(daftarAkun || [])];
      setDaftarAkun(gabungan);
      localStorage.setItem("hibah_daftar_akun", JSON.stringify(gabungan));
      catatLog(userLogin?.nama || "Admin", "admin", `Membuat akun baru ${namaFormAdmin}`, "akun");
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
        }));
      } else {
        // Parse CSV Format: nama,email,password,role,infoTambahan
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
      alert("Format tidak valid! Periksa kembali pemisah koma CSV atau kurung JSON.");
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
    catatLog(
      userLogin?.nama || "Admin",
      "admin",
      `Menambah kategori/kelas: ${namaKategoriBaru}`,
      "sistem"
    );
    setModalKategori(false);
    setNamaKategoriBaru("");
  };

  // --- FUNGSI ROMBEL & PENGUMUMAN KELAS KE NOTIFIKASI MURID ---
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
    kirimNotifikasiKeUser(
      [guruKelompokAdmin],
      "Penugasan Rombel Baru",
      `Admin telah menugaskan Anda sebagai pengajar di kelas "${namaKelompokAdmin}".`,
      "Admin HibahIlmu",
      namaKelompokAdmin
    );
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
    catatLog(userLogin.nama, "guru", `Membuat Ruang Kelas: ${namaKelompokBaru}`, "sistem");
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
    alert(
      `Pengumuman berhasil diperbarui dan dikirim ke kotak notifikasi ${kel.siswaIds.length} murid di kelas ini!`
    );
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
        `Kamu telah dimasukkan ke dalam ruang kelas "${targetKel.namaKelas}".${
          targetKel.pengumuman ? ` Pengumuman: ${targetKel.pengumuman}` : ""
        }`,
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

  // --- FUNGSI GURU BUAT MATERI ---
  const opsiKelasGuru = (daftarJenjang || []).flatMap((j) =>
    j.subJenjang
      .filter((sj) => userLogin?.aksesMengajar?.includes(sj.id))
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
      judul: `${judulMateri} (Oleh: ${userLogin.nama})`,
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

    // Kirim notifikasi ke semua murid di rombel milik guru ini
    const semuaMuridGuru = Array.from(
      new Set(
        daftarKelompok
          .filter((k) => k.guruId === userLogin.id)
          .flatMap((k) => k.siswaIds)
      )
    );
    if (semuaMuridGuru.length > 0) {
      kirimNotifikasiKeUser(
        semuaMuridGuru,
        "Materi & Kuis Baru Diterbitkan!",
        `${userLogin.nama} baru saja menerbitkan modul "${judulMateri}" lengkap dengan ${kuisBersih.length} soal latihan.`,
        userLogin.nama
      );
    }

    catatLog(
      userLogin.nama,
      "guru",
      `Menerbitkan materi "${judulMateri}" dengan ${kuisBersih.length} soal kuis`,
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

  // --- FUNGSI TRYOUT CBT PRO ---
  const soalTryoutTersaring = BANK_SOAL_TRYOUT.filter(
    (s) => filterJenjangTryout === "Semua" || s.jenjang === filterJenjangTryout
  );

  const selesaikanTryout = () => {
    let benar = 0;
    soalTryoutTersaring.forEach((soal, idx) => {
      if (jawabanUserTryout[idx] === soal.jawabanBenar) benar++;
    });
    const totalSoal = soalTryoutTersaring.length || 1;
    setSkorTryout(Math.round((benar / totalSoal) * 100));
    setUjianSelesai(true);
    setSedangUjian(false);
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
  const guruKelompoks = daftarKelompok.filter((k) => k.guruId === userLogin?.id);
  const daftarSiswaApproved = safeAkunList.filter(
    (a) => a.role === "siswa" && a.status === "approved"
  );

  const notifikasiUserAktif = daftarNotifikasi.filter((n) =>
    userLogin ? n.targetUserId === userLogin.id || n.targetUserId === "ALL" : false
  );
  const jumlahNotifBelumDibaca = notifikasiUserAktif.filter((n) => !n.dibaca).length;

  // ==========================================
  // SUB-RENDERER: PROFIL & CV BUILDER (SEMUA ROLE)
  // ==========================================
  const renderProfilDanCV = () => {
    if (!userLogin) return null;
    const cvData = userLogin.cv;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pratinjau Kartu CV Profesional */}
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
                  Institusi / Asal Sekolah / Kampus
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
                    <Globe className="w-3.5 h-3.5" /> Buka Tautan Portofolio / LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Edit Biodata & CV */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Edit Foto Profil, Biodata & CV
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Lengkapi portofolio akademik, keahlian, dan riwayat pengalaman Anda.
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
                placeholder="Matematika, Fisika, React, Next.js, Public Speaking"
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
                  placeholder={"Ketua OSIS (2025)\nAsisten Lab Komputer (2026)"}
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
                  placeholder={"Juara 1 Olimpiade Sains\nSertifikasi Web Developer"}
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
  // SUB-RENDERER: AUTH, ADMIN, GURU, SISWA
  // ==========================================
  const renderAuthView = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
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
            Daftar Baru
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
              <h2 className="text-3xl font-black text-slate-900">Selamat Datang!</h2>
              <p className="text-slate-500 text-sm mt-1">
                Masuk ke portal pembelajaran gratis HibahIlmu.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Email
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
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Pendaftaran Akun</h2>
              <p className="text-slate-500 text-sm mt-1">Akun memerlukan validasi dari Admin.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleReg("siswa")}
                className={`p-4 border-2 rounded-2xl text-left transition ${
                  roleReg === "siswa"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Siswa / Mahasiswa</div>
                <div className="text-[10px] text-slate-500 mt-1">Akses Belajar Gratis</div>
              </button>
              <button
                type="button"
                onClick={() => setRoleReg("guru")}
                className={`p-4 border-2 rounded-2xl text-left transition ${
                  roleReg === "guru"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                    : "border-slate-200"
                }`}
              >
                <div className="font-extrabold text-sm">Guru Relawan</div>
                <div className="text-[10px] text-slate-500 mt-1">Kontribusi Materi</div>
              </button>
            </div>
            <input
              type="text"
              required
              value={namaReg}
              onChange={(e) => setNamaReg(e.target.value)}
              placeholder="Nama Lengkap..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="email"
              required
              value={emailReg}
              onChange={(e) => setEmailReg(e.target.value)}
              placeholder="Email Aktif..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="password"
              required
              value={passwordReg}
              onChange={(e) => setPasswordReg(e.target.value)}
              placeholder="Buat Password..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <input
              type="text"
              required
              value={infoReg}
              onChange={(e) => setInfoReg(e.target.value)}
              placeholder={
                roleReg === "guru" ? "Mata Pelajaran Spesialis..." : "Sekolah / Kampus..."
              }
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg"
            >
              Daftar & Ajukan Akses
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max">
          Pengujian Cepat
        </span>
        <h3 className="text-2xl font-black mt-4 mb-2">Mode Demo 1-Klik</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Uji fitur multi-dashboard Admin, Guru, dan Siswa secara instan.
        </p>
        <div className="space-y-3">
          {safeAkunList
            .filter((a) => a.status === "approved")
            .slice(0, 4)
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

  const renderAdminView = () => (
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
            <p className="text-slate-300 text-xs">{userLogin?.cv?.headline || "Pusat Kendali"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalImportAkun(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-4 h-4" /> Import CSV / Excel / JSON
          </button>
          <button
            onClick={bukaModalTambahAkun}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <UserPlus className="w-4 h-4" /> Tambah Akun
          </button>
          <button
            onClick={() => {
              setUserLogin(null);
              localStorage.removeItem("hibah_user_aktif");
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      {/* Tab Navigasi Admin */}
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
          { id: "log", label: "Audit Log", icon: <Activity className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setAdminTabAktif(t.id as "akun" | "kategori" | "rombel" | "log" | "cv")
            }
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
              adminTabAktif === t.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {adminTabAktif === "cv" && renderProfilDanCV()}

      {adminTabAktif === "akun" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-900">Manajemen Seluruh Akun & RBAC</h2>
            {selectedAkunIds.length > 0 && (
              <button
                onClick={hapusAkunSekaligus}
                className="bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Hapus {selectedAkunIds.length} Akun Terpilih
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-[38rem] overflow-y-auto pr-2">
            {safeAkunList.map((akun) => (
              <div
                key={akun.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-3">
                  {akun.role !== "admin" && (
                    <input
                      type="checkbox"
                      checked={selectedAkunIds.includes(akun.id)}
                      onChange={() => togglePilihAkun(akun.id)}
                      className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  )}
                  <div>
                    <div className="font-extrabold text-sm flex flex-wrap items-center gap-2 text-slate-900">
                      {akun.nama}
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black">
                        {akun.role}
                      </span>
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded font-black ${
                          akun.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : akun.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {akun.status === "rejected" ? "Suspended" : akun.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {akun.email} • {akun.infoTambahan}
                    </div>
                    {akun.cv?.skills && akun.cv.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {akun.cv.skills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border px-2 py-0.5 rounded font-semibold text-slate-600"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {akun.status !== "approved" ? (
                    <button
                      onClick={() => ubahStatusAkun(akun.id, "approved")}
                      className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"
                    >
                      <UserCheck2 className="w-4 h-4" />
                    </button>
                  ) : (
                    akun.role !== "admin" && (
                      <button
                        onClick={() => ubahStatusAkun(akun.id, "rejected")}
                        className="p-2.5 bg-amber-100 text-amber-700 rounded-xl"
                      >
                        <UserX2 className="w-4 h-4" />
                      </button>
                    )
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
        </div>
      )}

      {adminTabAktif === "rombel" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900">
            Manajemen Rombel & Penempatan Mahasiswa/Siswa
          </h2>
          <form
            onSubmit={handleAdminBuatKelompok}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 bg-slate-50 border border-slate-200 rounded-2xl"
          >
            <input
              type="text"
              required
              value={namaKelompokAdmin}
              onChange={(e) => setNamaKelompokAdmin(e.target.value)}
              placeholder="Nama Kelas / Rombel Baru..."
              className="p-3.5 border rounded-xl text-sm font-semibold bg-white"
            />
            <select
              required
              value={guruKelompokAdmin}
              onChange={(e) => setGuruKelompokAdmin(e.target.value)}
              className="p-3.5 border rounded-xl text-sm font-bold bg-white"
            >
              <option value="" disabled>
                -- Pilih Pengajar Kelas --
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
              className="bg-indigo-600 text-white font-black py-3.5 px-6 rounded-xl text-sm"
            >
              + Buat Rombel Kelas
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daftarKelompok.map((kel) => {
              const kataCari = searchSiswaAdmin[kel.id] || "";
              const hasilCariSiswa = daftarSiswaApproved.filter(
                (s) =>
                  !kel.siswaIds.includes(s.id) &&
                  (s.nama.toLowerCase().includes(kataCari.toLowerCase()) ||
                    s.email.toLowerCase().includes(kataCari.toLowerCase()))
              );
              return (
                <div
                  key={kel.id}
                  className="p-6 border border-slate-200 rounded-3xl bg-white shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-black text-lg text-indigo-950">{kel.namaKelas}</h3>
                    <button
                      onClick={() => handleHapusKelompok(kel.id)}
                      className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg"
                    >
                      Hapus Kelas
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mb-4">
                    Pengajar:{" "}
                    <b>{safeAkunList.find((a) => a.id === kel.guruId)?.nama || "Guru"}</b> •{" "}
                    Terdaftar: <b>{kel.siswaIds.length} Siswa</b>
                  </div>

                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={kataCari}
                      onChange={(e) =>
                        setSearchSiswaAdmin({ ...searchSiswaAdmin, [kel.id]: e.target.value })
                      }
                      placeholder="Cari nama/email siswa untuk dimasukkan..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="max-h-32 overflow-y-auto space-y-1.5 mb-4 border p-2 rounded-xl bg-slate-50">
                    {hasilCariSiswa.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center bg-white p-2 rounded-lg border text-xs"
                      >
                        <span>
                          <b>{s.nama}</b> ({s.email})
                        </span>
                        <button
                          onClick={() => handleTambahSiswaKeKelompok(kel.id, s.id)}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                        >
                          + Masukkan
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {kel.siswaIds.map((sId) => {
                      const s = safeAkunList.find((x) => x.id === sId);
                      if (!s) return null;
                      return (
                        <div
                          key={sId}
                          className="flex justify-between items-center bg-indigo-50/70 border border-indigo-100 p-2 rounded-xl text-xs"
                        >
                          <span className="font-bold">{s.nama}</span>
                          <button
                            onClick={() => handleHapusSiswaDariKelompok(kel.id, s.id)}
                            className="text-rose-600 font-bold"
                          >
                            Keluarkan
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {adminTabAktif === "kategori" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900">Hierarki Jenjang & Prodi</h2>
            <button
              onClick={() => setModalKategori(true)}
              className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Kelas / Prodi
            </button>
          </div>
          <div className="space-y-4">
            {daftarJenjang.map((j) => (
              <div key={j.id} className="p-5 border rounded-2xl bg-slate-50">
                <h3 className="font-black text-sm mb-3 uppercase">{j.nama}</h3>
                <div className="flex flex-wrap gap-2">
                  {j.subJenjang.map((sj) => (
                    <span
                      key={sj.id}
                      className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg border font-bold"
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">Log Aktivitas Sistem</h2>
            <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl">
              {["semua", "guru", "siswa", "admin"].map((peran) => (
                <button
                  key={peran}
                  onClick={() => setFilterLog(peran)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${
                    filterLog === peran ? "bg-white text-slate-900" : "text-slate-500"
                  }`}
                >
                  {peran}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {safeLogList
              .filter((l) => filterLog === "semua" || l.rolePelaku === filterLog)
              .map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border flex justify-between text-xs">
                  <span>
                    <b>[{log.rolePelaku.toUpperCase()}] {log.namaPelaku}:</b> {log.aksi}
                  </span>
                  <span className="font-mono text-slate-400">{log.waktu}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );

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
              Studio Pengajar Pro
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{userLogin?.nama}</h1>
            <p className="text-indigo-200 text-xs">
              {userLogin?.cv?.headline || userLogin?.infoTambahan}
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
          onClick={() => setGuruTabAktif("materi")}
          className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "materi"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Studio Materi & 5 Tipe Kuis
        </button>
        <button
          onClick={() => setGuruTabAktif("kelas")}
          className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "kelas"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Users className="w-4 h-4" /> Kelola Rombel & Kirim Pengumuman ({guruKelompoks.length})
        </button>
        <button
          onClick={() => setGuruTabAktif("cv")}
          className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap ${
            guruTabAktif === "cv"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 border"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Profil & CV Saya
        </button>
      </div>

      {guruTabAktif === "cv" && renderProfilDanCV()}

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
                  Materi & Kuis berhasil diterbitkan serta dikirim ke notifikasi murid!
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

              {/* BUILDER 5 TIPE SOAL KUIS & IMPORT CSV/JSON */}
              <div className="p-6 border-2 border-indigo-100 rounded-3xl bg-slate-50 space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      Bank Kuis Multi-Tipe ({daftarKuisDraft.length} Soal)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mendukung Pilihan Ganda, Jawaban Lebih dari 1, Mencocokkan, Benar/Salah, Isian
                      & Gambar Soal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalImportKuis(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Import Soal via CSV / Excel / JSON
                  </button>
                </div>

                <div className="space-y-4">
                  {daftarKuisDraft.map((soal, indexSoal) => (
                    <div
                      key={soal.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4"
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
                              if (tipeBaru === "benar_salah") {
                                ubahFieldSoalDraft(soal.id, "opsi", ["Benar", "Salah"]);
                                ubahFieldSoalDraft(soal.id, "jawabanBenar", 0);
                              } else if (
                                tipeBaru === "pilihan_ganda" ||
                                tipeBaru === "pilihan_jamak"
                              ) {
                                ubahFieldSoalDraft(soal.id, "opsi", ["", "", "", ""]);
                              }
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

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Poin XP:</span>
                          <input
                            type="number"
                            value={soal.poin}
                            onChange={(e) =>
                              ubahFieldSoalDraft(soal.id, "poin", Number(e.target.value) || 50)
                            }
                            className="w-20 p-1.5 border rounded-lg text-xs font-bold text-center"
                          />
                          <button
                            type="button"
                            onClick={() => hapusSoalDraft(soal.id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

                      {soal.gambarSoalUrl && (
                        <div className="p-2 border rounded-xl bg-slate-50 inline-block">
                          <img
                            src={soal.gambarSoalUrl}
                            alt="Preview Soal"
                            className="max-h-32 rounded-lg"
                          />
                        </div>
                      )}

                      {/* TIPE 1: PILIHAN GANDA BIASA */}
                      {soal.tipe === "pilihan_ganda" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <option value={0}>Kunci Jawaban Benar: Opsi A</option>
                            <option value={1}>Kunci Jawaban Benar: Opsi B</option>
                            <option value={2}>Kunci Jawaban Benar: Opsi C</option>
                            <option value={3}>Kunci Jawaban Benar: Opsi D</option>
                          </select>
                        </div>
                      )}

                      {/* TIPE 2: PILIHAN JAMAK (LEBIH DARI 1 JAWABAN BENAR) */}
                      {soal.tipe === "pilihan_jamak" && (
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-indigo-700">
                            Centang kotak di samping opsi yang merupakan jawaban benar (bisa lebih
                            dari 1):
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((idxOpsi) => {
                              const terpilih = (soal.jawabanJamak || []).includes(idxOpsi);
                              return (
                                <div
                                  key={idxOpsi}
                                  className={`flex items-center gap-2 p-2.5 border-2 rounded-xl ${
                                    terpilih ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={terpilih}
                                    onChange={() => toggleKunciJamakDraft(soal.id, idxOpsi)}
                                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    required
                                    value={soal.opsi[idxOpsi] || ""}
                                    onChange={(e) =>
                                      ubahOpsiSoalDraft(soal.id, idxOpsi, e.target.value)
                                    }
                                    placeholder={`Opsi ${String.fromCharCode(65 + idxOpsi)}`}
                                    className="flex-1 bg-transparent text-xs font-semibold outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TIPE 3: MENCOCOKKAN PASANGAN */}
                      {soal.tipe === "mencocokkan" && (
                        <div className="space-y-2.5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                          <div className="text-xs font-bold text-indigo-900">
                            Masukkan pasangan Pernyataan Kiri dan Jawaban Kanan yang sesuai:
                          </div>
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
                                className="p-2.5 bg-white border rounded-xl text-xs font-semibold"
                              />
                              <input
                                type="text"
                                required
                                value={pas.kanan}
                                onChange={(e) =>
                                  ubahPasanganCocokDraft(soal.id, idxP, "kanan", e.target.value)
                                }
                                placeholder={`Pasangan Benar #${idxP + 1}`}
                                className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => tambahBarisPasanganDraft(soal.id)}
                            className="text-xs font-bold text-indigo-600 hover:underline pt-1"
                          >
                            + Tambah Baris Pasangan
                          </button>
                        </div>
                      )}

                      {/* TIPE 4: BENAR / SALAH */}
                      {soal.tipe === "benar_salah" && (
                        <select
                          value={soal.jawabanBenar}
                          onChange={(e) =>
                            ubahFieldSoalDraft(soal.id, "jawabanBenar", Number(e.target.value))
                          }
                          className="w-full p-3 border bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs"
                        >
                          <option value={0}>Kunci Jawaban: BENAR</option>
                          <option value={1}>Kunci Jawaban: SALAH</option>
                        </select>
                      )}

                      {/* TIPE 5: ISIAN SINGKAT */}
                      {soal.tipe === "isian_singkat" && (
                        <input
                          type="text"
                          required
                          value={soal.jawabanTeks || ""}
                          onChange={(e) =>
                            ubahFieldSoalDraft(soal.id, "jawabanTeks", e.target.value)
                          }
                          placeholder="Kunci Jawaban Teks Singkat..."
                          className="w-full p-3 border border-emerald-300 bg-emerald-50/50 rounded-xl text-xs font-bold"
                        />
                      )}

                      <input
                        type="text"
                        value={soal.pembahasan}
                        onChange={(e) => ubahFieldSoalDraft(soal.id, "pembahasan", e.target.value)}
                        placeholder="Penjelasan / pembahasan jawaban..."
                        className="w-full p-3 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
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
                  <button
                    type="button"
                    onClick={() => tambahSoalDraftBaru("benar_salah")}
                    className="px-3.5 py-2 bg-white border rounded-xl text-xs font-bold"
                  >
                    + Benar / Salah
                  </button>
                  <button
                    type="button"
                    onClick={() => tambahSoalDraftBaru("isian_singkat")}
                    className="px-3.5 py-2 bg-white border rounded-xl text-xs font-bold"
                  >
                    + Isian Singkat
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl shadow-lg"
              >
                Terbitkan Materi & Seluruh Kuis Sekarang
              </button>
            </form>
          )}
        </div>
      )}

      {guruTabAktif === "kelas" && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900">
            Kelola Kelas & Kirim Pengumuman ke Notifikasi Murid
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

                  {/* Kirim Pengumuman Kelas yang Masuk ke Notifikasi Murid */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="text-[11px] font-black text-amber-900 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-amber-600" /> Pengumuman Aktif:{" "}
                      <span className="font-normal">{kel.pengumuman || "Belum ada"}</span>
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
                        placeholder="Ketik pengumuman baru untuk dikirim ke murid..."
                        className="flex-1 p-2 bg-white border rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleKirimPengumumanKelas(kel)}
                        className="bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold"
                      >
                        Broadcast
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={kataCari}
                      onChange={(e) =>
                        setSearchSiswaGuru({ ...searchSiswaGuru, [kel.id]: e.target.value })
                      }
                      placeholder="Cari nama atau email siswa untuk ditambahkan..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border">
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

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {kel.siswaIds.map((sId) => {
                      const sw = safeAkunList.find((a) => a.id === sId);
                      if (!sw) return null;
                      return (
                        <div
                          key={sId}
                          className="flex justify-between items-center p-2 bg-slate-50 border rounded-xl text-xs"
                        >
                          <span className="font-bold">
                            {sw.nama} <span className="font-normal text-slate-400">({sw.email})</span>
                          </span>
                          <button
                            onClick={() => handleHapusSiswaDariKelompok(kel.id, sId)}
                            className="text-rose-500"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderSiswaView = () => {
    const kelasSaya = daftarKelompok.filter((k) =>
      userLogin ? k.siswaIds.includes(userLogin.id) : false
    );
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
                Rapor & Portofolio Pelajar
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Halo, {userLogin?.nama}!</h1>
              <p className="text-emerald-100 text-xs">
                Total XP: <b>{poinXP} XP</b> • Modul Selesai: <b>{materiSelesai.length} Modul</b>
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

        <div className="flex gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setSiswaTabAktif("kelas")}
            className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 ${
              siswaTabAktif === "kelas"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 border"
            }`}
          >
            <School className="w-4 h-4" /> Ruang Kelas & Pengumuman Guru ({kelasSaya.length})
          </button>
          <button
            onClick={() => setSiswaTabAktif("cv")}
            className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 ${
              siswaTabAktif === "cv"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 border"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Profil, Biodata & CV Saya
          </button>
        </div>

        {siswaTabAktif === "cv" ? (
          renderProfilDanCV()
        ) : (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-4">Ruang Kelas (Rombel) & Pesan Pengumuman Guru</h2>
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

      {/* HEADER DENGAN MENU LONCENG NOTIFIKASI */}
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
                LMS Open Source
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "beranda", label: "Ruang Kelas" },
              { id: "tryout", label: "Tryout CBT" },
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

            {/* TOMBOL LONCENG NOTIFIKASI */}
            {userLogin && (
              <div className="relative">
                <button
                  onClick={() => setBukaMenuNotif(!bukaMenuNotif)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition"
                  title="Kotak Masuk Notifikasi"
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
                      <span className="font-black text-sm">Kotak Masuk & Pengumuman</span>
                      <button
                        onClick={tandaiSemuaNotifDibaca}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Tandai Dibaca
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {notifikasiUserAktif.length === 0 ? (
                        <div className="text-center text-xs text-slate-400 py-6">
                          Belum ada pesan notifikasi.
                        </div>
                      ) : (
                        notifikasiUserAktif.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-2xl border text-xs ${
                              n.dibaca
                                ? "bg-slate-50 border-slate-200"
                                : "bg-indigo-50/70 border-indigo-200"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-black text-slate-900">{n.judul}</span>
                              <span className="text-[10px] text-slate-400">{n.waktu}</span>
                            </div>
                            <p className="text-slate-700 mb-1">{n.pesan}</p>
                            <div className="text-[10px] font-bold text-indigo-600">
                              Oleh: {n.pengirim}
                            </div>
                          </div>
                        ))
                      )}
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
              <span>{userLogin ? `Panel ${userLogin.role}` : "Daftar / Masuk"}</span>
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
        {menuAktif === "dashboard" && (
          <div>
            {!userLogin && renderAuthView()}
            {userLogin && userLogin.role === "admin" && renderAdminView()}
            {userLogin && userLogin.role === "guru" && renderGuruView()}
            {userLogin && userLogin.role === "siswa" && renderSiswaView()}
          </div>
        )}

        {/* MENU TRYOUT CBT PRO */}
        {menuAktif === "tryout" && (
          <div className="max-w-5xl mx-auto">
            {!sedangUjian && !ujianSelesai && (
              <div className="bg-white rounded-3xl p-10 border text-center shadow-sm space-y-6">
                <Timer className="w-16 h-16 text-indigo-600 mx-auto" />
                <div>
                  <h2 className="text-3xl font-black mb-2">Simulasi Tryout CBT Pro</h2>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Dilengkapi navigasi nomor soal, penanda ragu-ragu (flag), timer otomatis, dan
                    pembahasan lengkap pasca-ujian.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {["Semua", "SD / MI", "SMP / MTs", "SMA / SMK", "Kuliah & IT"].map((j) => (
                    <button
                      key={j}
                      onClick={() => setFilterJenjangTryout(j)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                        filterJenjangTryout === j
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setJawabanUserTryout({});
                    setRaguRaguTryout([]);
                    setIndeksSoalTryoutAktif(0);
                    setSisaWaktu(300);
                    setUjianSelesai(false);
                    setSedangUjian(true);
                  }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2 shadow-lg"
                >
                  <Play className="w-5 h-5" /> Mulai Paket Tryout ({soalTryoutTersaring.length} Soal)
                </button>
              </div>
            )}

            {sedangUjian && soalTryoutTersaring.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Area Soal Aktif */}
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                        Soal #{indeksSoalTryoutAktif + 1} dari {soalTryoutTersaring.length}
                      </span>
                      <span className="ml-2 text-xs font-bold text-slate-500">
                        {soalTryoutTersaring[indeksSoalTryoutAktif].mapel}
                      </span>
                    </div>
                    <div className="font-mono text-xl font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-xl">
                      {Math.floor(sisaWaktu / 60)}:
                      {(sisaWaktu % 60).toString().padStart(2, "0")}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900">
                    {soalTryoutTersaring[indeksSoalTryoutAktif].pertanyaan}
                  </h3>

                  {soalTryoutTersaring[indeksSoalTryoutAktif].rumus && (
                    <div className="p-3.5 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl">
                      Petunjuk: {soalTryoutTersaring[indeksSoalTryoutAktif].rumus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {soalTryoutTersaring[indeksSoalTryoutAktif].opsi.map((ops, idx) => (
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
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t">
                    <button
                      disabled={indeksSoalTryoutAktif === 0}
                      onClick={() => setIndeksSoalTryoutAktif((i) => Math.max(0, i - 1))}
                      className="px-5 py-2.5 rounded-xl border font-bold text-xs disabled:opacity-40"
                    >
                      ← Soal Sebelumnya
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
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      <Flag className="w-4 h-4" /> Ragu-Ragu
                    </button>

                    {indeksSoalTryoutAktif < soalTryoutTersaring.length - 1 ? (
                      <button
                        onClick={() =>
                          setIndeksSoalTryoutAktif((i) =>
                            Math.min(soalTryoutTersaring.length - 1, i + 1)
                          )
                        }
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                      >
                        Soal Selanjutnya →
                      </button>
                    ) : (
                      <button
                        onClick={selesaikanTryout}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs"
                      >
                        Kumpulkan Ujian
                      </button>
                    )}
                  </div>
                </div>

                {/* Panel Navigasi Nomor Soal */}
                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border shadow-sm h-max space-y-4">
                  <h4 className="font-black text-sm">Navigasi Nomor Soal</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {soalTryoutTersaring.map((s, idx) => {
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
                    onClick={selesaikanTryout}
                    className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-xs shadow-md"
                  >
                    Selesai & Lihat Pembahasan
                  </button>
                </div>
              </div>
            )}

            {ujianSelesai && (
              <div className="space-y-6">
                <div className="bg-white p-10 rounded-3xl border text-center shadow-lg">
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                  <h2 className="text-4xl font-black mb-2">Skor Akhir: {skorTryout} / 100</h2>
                  <p className="text-xs text-slate-500 mb-6">
                    Pelajari pembahasan lengkap setiap soal di bawah ini.
                  </p>
                  <button
                    onClick={() => {
                      setUjianSelesai(false);
                      setSedangUjian(false);
                    }}
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs"
                  >
                    Kembali ke Menu Tryout
                  </button>
                </div>

                {/* Review Pembahasan Soal */}
                <div className="space-y-4">
                  {soalTryoutTersaring.map((soal, idx) => {
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
                            {isBenar ? "Jawaban Benar" : "Jawaban Kurang Tepat"}
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

        {/* MENU FORUM DISKUSI & TANYA PR LENGKAP */}
        {menuAktif === "forum" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 border rounded-3xl shadow-sm">
              <h2 className="font-black text-2xl mb-4 flex items-center gap-2">
                <HelpCircle className="text-emerald-600" /> Forum Diskusi & Tanya PR Interaktif
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tanyaBaru.trim()) return;
                  setDaftarDiskusi([
                    {
                      id: "pr-" + Date.now(),
                      penanya: userLogin?.nama || "Pelajar",
                      jenjang: jenjangTanyaBaru,
                      mapel: mapelBaru,
                      judul: judulTanyaBaru || "Pertanyaan Tugas Sekolah",
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
                    <option value="Kuliah">Kuliah & IT</option>
                  </select>
                  <input
                    type="text"
                    required
                    value={mapelBaru}
                    onChange={(e) => setMapelBaru(e.target.value)}
                    placeholder="Mata Pelajaran (Matematika, Fisika...)"
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
                <div className="flex flex-wrap gap-3">
                  <input
                    type="url"
                    value={gambarTanyaBaru}
                    onChange={(e) => setGambarTanyaBaru(e.target.value)}
                    placeholder="Link Gambar Foto Soal PR (Opsional - https://...)"
                    className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
                  </button>
                </div>
              </form>
            </div>

            {/* Filter & Pencarian Diskusi */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-2 overflow-x-auto">
                {["Semua", "Matematika", "Fisika", "Biologi", "Informatika"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMapelForum(m)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                      filterMapelForum === m ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={cariForum}
                onChange={(e) => setCariForum(e.target.value)}
                placeholder="Cari diskusi..."
                className="p-2.5 bg-white border rounded-xl text-xs font-semibold"
              />
            </div>

            {daftarDiskusi
              .filter(
                (d) =>
                  (filterMapelForum === "Semua" ||
                    d.mapel.toLowerCase().includes(filterMapelForum.toLowerCase())) &&
                  (d.judul.toLowerCase().includes(cariForum.toLowerCase()) ||
                    d.pertanyaan.toLowerCase().includes(cariForum.toLowerCase()))
              )
              .map((d) => (
                <div key={d.id} className="bg-white p-6 border rounded-3xl shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                          {d.jenjang} • {d.mapel}
                        </span>
                        {d.solved && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Terjawab (Solved)
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg mt-1">{d.judul}</h3>
                      <div className="text-xs text-slate-400">
                        Ditanyakan oleh <b>{d.penanya}</b> • {d.waktu}
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
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> {d.likes}
                    </button>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">{d.pertanyaan}</p>
                  {d.gambarUrl && (
                    <img
                      src={d.gambarUrl}
                      alt="Lampiran PR"
                      className="max-h-60 rounded-2xl border"
                    />
                  )}

                  <div className="space-y-2.5 pl-4 border-l-2 border-emerald-300">
                    {d.jawaban.map((j) => (
                      <div
                        key={j.id}
                        className={`p-3.5 rounded-2xl text-xs border ${
                          j.isBestAnswer
                            ? "bg-emerald-50 border-emerald-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-slate-900">
                            {j.penjawab}{" "}
                            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white border ml-1">
                              {j.rolePenjawab}
                            </span>
                            {j.isBestAnswer && (
                              <span className="ml-2 text-emerald-700 font-black">
                                ★ Jawaban Terbaik
                              </span>
                            )}
                          </span>
                          {(userLogin?.role === "guru" || userLogin?.role === "admin") &&
                            !j.isBestAnswer && (
                              <button
                                onClick={() =>
                                  setDaftarDiskusi(
                                    daftarDiskusi.map((disk) =>
                                      disk.id === d.id
                                        ? {
                                            ...disk,
                                            solved: true,
                                            jawaban: disk.jawaban.map((jw) =>
                                              jw.id === j.id ? { ...jw, isBestAnswer: true } : jw
                                            ),
                                          }
                                        : disk
                                    )
                                  )
                                }
                                className="text-[10px] font-bold text-emerald-700 hover:underline"
                              >
                                Tandai Jawaban Terbaik
                              </button>
                            )}
                        </div>
                        <p className="text-slate-700">{j.isi}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={balasanInput[d.id] || ""}
                      onChange={(e) =>
                        setBalasanInput({ ...balasanInput, [d.id]: e.target.value })
                      }
                      placeholder="Bantu berikan penjelasan jawaban..."
                      className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs"
                    />
                    <button
                      onClick={() => {
                        const isi = balasanInput[d.id];
                        if (!isi) return;
                        setDaftarDiskusi(
                          daftarDiskusi.map((x) =>
                            x.id === d.id
                              ? {
                                  ...x,
                                  jawaban: [
                                    ...x.jawaban,
                                    {
                                      id: "jwb-" + Date.now(),
                                      penjawab: userLogin?.nama || "Relawan",
                                      rolePenjawab: userLogin?.role || "siswa",
                                      isi,
                                      waktu: "Baru saja",
                                      upvotes: 0,
                                    },
                                  ],
                                }
                              : x
                          )
                        );
                        setBalasanInput({ ...balasanInput, [d.id]: "" });
                        tambahXP(30);
                      }}
                      className="bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold"
                    >
                      Jawab (+30 XP)
                    </button>
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
              Donasi sukarela digunakan 100% untuk biaya server VPS & domain hibahilmu.id agar
              tetap gratis selamanya.
            </p>
            <div className="bg-white/10 p-6 rounded-2xl text-left">
              <div className="flex justify-between text-xs font-bold text-emerald-300 mb-2">
                <span>Terkumpul: Rp 850.000</span>
                <span>Target: Rp 1.500.000</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[56%] h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* BERANDA RUANG KELAS & PENGERJAAN 5 TIPE KUIS */}
        {menuAktif === "beranda" && (
          <div>
            {!jenjangAktif && !kelasAktif && (
              <div>
                <div className="text-center max-w-4xl mx-auto mb-14 pt-4">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 leading-tight">
                    Satu Platform Sejuta Ilmu, <br />
                    <span className="text-emerald-600">100% Gratis Selamanya.</span>
                  </h1>
                  <div className="max-w-xl mx-auto relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={kataKunci}
                      onChange={(e) => setKataKunci(e.target.value)}
                      placeholder="Cari jenjang pendidikan (TK, SD, SMP, SMA, Kuliah)..."
                      className="w-full pl-14 pr-5 py-4 bg-white border rounded-2xl shadow-md text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {daftarJenjang
                    .filter((j) => j.nama.toLowerCase().includes(kataKunci.toLowerCase()))
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
                          <span>Pilih Kelas</span>
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
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Jenjang
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
                    Semua Tingkat
                  </button>
                  {jenjangAktif.subJenjang.map((sj) => (
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
                    .filter(
                      (k) => subJenjangAktif === "semua" || k.subJenjangId === subJenjangAktif
                    )
                    .map((k) => (
                      <div
                        key={k.id}
                        onClick={() => setKelasAktif(k)}
                        className="bg-white p-6 border-2 rounded-3xl cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg">
                              {jenjangAktif.subJenjang.find((s) => s.id === k.subJenjangId)?.nama ||
                                "Umum"}
                            </span>
                            {materiSelesai.includes(k.id) && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                Selesai
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{k.judul}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {bersihkanTagHtml(k.rangkuman)}
                          </p>
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center text-sm font-bold text-indigo-600">
                          <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-5 h-5" /> Mulai Belajar ({k.daftarKuis.length}{" "}
                            Soal Kuis)
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
                    {materiSelesai.includes(kelasAktif.id) ? "Selesai (+30 XP)" : "Tandai Selesai"}
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
                      <h1 className="text-2xl font-black mb-4">{kelasAktif.judul}</h1>
                      {kelasAktif.lampiranUrl && (
                        <a
                          href={kelasAktif.lampiranUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200"
                        >
                          <FileText className="w-4 h-4" /> Unduh / Buka Lampiran Modul
                        </a>
                      )}
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

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <FileEdit className="w-5 h-5 text-amber-700" /> Catatan Pribadi Siswa
                      </h3>
                      <textarea
                        rows={3}
                        value={catatanSiswa}
                        onChange={(e) => setCatatanSiswa(e.target.value)}
                        placeholder="Tulis catatan belajarmu di sini..."
                        className="w-full p-3.5 bg-white border border-amber-200 rounded-xl text-sm mb-3"
                      />
                      <button
                        onClick={() => {
                          localStorage.setItem(`catatan_${kelasAktif.id}`, catatanSiswa);
                          setStatusSimpanCatatan(true);
                          setTimeout(() => setStatusSimpanCatatan(false), 2000);
                        }}
                        className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
                      >
                        Simpan Catatan
                      </button>
                      {statusSimpanCatatan && (
                        <span className="ml-3 text-xs font-bold text-emerald-700">Tersimpan!</span>
                      )}
                    </div>
                  </div>

                  {/* PANEL EVALUASI 5 TIPE SOAL KUIS */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-md">
                      <h3 className="font-black text-base flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-amber-500" /> Evaluasi Kuis Interaktif (
                        {kelasAktif.daftarKuis.length} Soal)
                      </h3>

                      <div className="space-y-6">
                        {kelasAktif.daftarKuis.map((kuis, idxKuis) => {
                          const statusJawab = statusKuisSiswa[kuis.id];
                          return (
                            <div
                              key={kuis.id}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
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

                              {kuis.gambarSoalUrl && (
                                <img
                                  src={kuis.gambarSoalUrl}
                                  alt="Gambar Soal"
                                  className="max-h-44 rounded-xl border my-2"
                                />
                              )}

                              {/* 1. PILIHAN GANDA & BENAR/SALAH */}
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
                                      className={`w-full text-left p-3 rounded-xl border-2 font-semibold text-xs transition ${
                                        jawabanPilihanSiswa[kuis.id] === idxOpsi
                                          ? statusJawab === "benar"
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                            : "border-rose-500 bg-rose-50 text-rose-900"
                                          : "bg-white border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      {opsi}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* 2. PILIHAN JAMAK (LEBIH DARI 1 JAWABAN BENAR) */}
                              {kuis.tipe === "pilihan_jamak" && (
                                <div className="space-y-2">
                                  <div className="text-[11px] text-indigo-700 font-bold">
                                    Pilih semua jawaban yang benar lalu klik Periksa:
                                  </div>
                                  {kuis.opsi.map((opsi, idxOpsi) => {
                                    const listPilih = jawabanJamakSiswa[kuis.id] || [];
                                    const dicentang = listPilih.includes(idxOpsi);
                                    return (
                                      <label
                                        key={idxOpsi}
                                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-xs font-semibold cursor-pointer ${
                                          dicentang
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "bg-white border-slate-200"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={dicentang}
                                          onChange={() => {
                                            const baru = dicentang
                                              ? listPilih.filter((i) => i !== idxOpsi)
                                              : [...listPilih, idxOpsi];
                                            setJawabanJamakSiswa({
                                              ...jawabanJamakSiswa,
                                              [kuis.id]: baru,
                                            });
                                          }}
                                          className="w-4 h-4 accent-indigo-600"
                                        />
                                        <span>{opsi}</span>
                                      </label>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const dipilih = [...(jawabanJamakSiswa[kuis.id] || [])].sort();
                                      const kunci = [...(kuis.jawabanJamak || [])].sort();
                                      const cocok =
                                        dipilih.length === kunci.length &&
                                        dipilih.every((v, i) => v === kunci[i]);
                                      if (cocok) {
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
                                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold"
                                  >
                                    Periksa Pilihan Jamak
                                  </button>
                                </div>
                              )}

                              {/* 3. MENCOCOKKAN PASANGAN */}
                              {kuis.tipe === "mencocokkan" && (
                                <div className="space-y-2.5">
                                  {(kuis.pasangan || []).map((pas, idxP) => {
                                    const mapPilihan = jawabanCocokSiswa[kuis.id] || {};
                                    return (
                                      <div
                                        key={idxP}
                                        className="grid grid-cols-2 gap-2 items-center bg-white p-2.5 rounded-xl border"
                                      >
                                        <span className="text-xs font-bold text-slate-800">
                                          {pas.kiri}
                                        </span>
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
                                          <option value="">-- Pilih Pasangan --</option>
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
                                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold"
                                  >
                                    Periksa Pasangan
                                  </button>
                                </div>
                              )}

                              {/* 4. ISIAN SINGKAT */}
                              {kuis.tipe === "isian_singkat" && (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={jawabanTeksSiswa[kuis.id] || ""}
                                    onChange={(e) =>
                                      setJawabanTeksSiswa({
                                        ...jawabanTeksSiswa,
                                        [kuis.id]: e.target.value,
                                      })
                                    }
                                    placeholder="Ketik jawaban singkat..."
                                    className="flex-1 p-2.5 bg-white border rounded-xl text-xs font-bold"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const inputUser = (jawabanTeksSiswa[kuis.id] || "")
                                        .trim()
                                        .toLowerCase();
                                      const kunci = (kuis.jawabanTeks || "").trim().toLowerCase();
                                      if (inputUser && inputUser === kunci) {
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
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                                  >
                                    Cek
                                  </button>
                                </div>
                              )}

                              {statusJawab === "benar" && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-start gap-1.5">
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>Benar! {kuis.pembahasan}</span>
                                </div>
                              )}
                              {statusJawab === "salah" && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-1.5">
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>Belum tepat, silakan coba lagi!</span>
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

        {/* MODAL ADMIN: TAMBAH / EDIT AKUN & RBAC */}
        {modalAdminAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-black mb-4">
                {idEditAkun ? "Edit Akun & Penugasan" : "Buat Akun Baru"}
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
                <input
                  type="password"
                  value={passFormAdmin}
                  onChange={(e) => setPassFormAdmin(e.target.value)}
                  placeholder="Password (kosongkan jika tidak diubah)"
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
                    <option value="guru">Guru Relawan</option>
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
                <input
                  type="text"
                  value={infoFormAdmin}
                  onChange={(e) => setInfoFormAdmin(e.target.value)}
                  placeholder="Info Tambahan (Kelas / Mapel)"
                  className="w-full p-3 border rounded-xl"
                />

                {roleFormAdmin === "guru" && (
                  <div className="p-4 border-2 border-indigo-100 bg-indigo-50/50 rounded-2xl">
                    <div className="font-black text-indigo-950 mb-3 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> Pilih Hak Akses Kelas/Prodi Guru:
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-3">
                      {daftarJenjang.map((j) => (
                        <div key={j.id} className="bg-white p-3 rounded-xl border">
                          <div className="font-bold text-[10px] uppercase text-slate-400 mb-2">
                            {j.nama}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {j.subJenjang.map((sj) => (
                              <label
                                key={sj.id}
                                className="flex items-center gap-2 text-xs font-bold cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={aksesMengajarForm.includes(sj.id)}
                                  onChange={() =>
                                    setAksesMengajarForm((prev) =>
                                      prev.includes(sj.id)
                                        ? prev.filter((x) => x !== sj.id)
                                        : [...prev, sj.id]
                                    )
                                  }
                                />
                                {sj.nama}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl"
                  >
                    Simpan Akun
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

        {/* MODAL IMPORT AKUN MASSAL (CSV / EXCEL & JSON) */}
        {modalImportAkun && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" /> Import Akun Massal (CSV
                Excel / JSON)
              </h3>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setModeImportAkunFormat("csv")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                    modeImportAkunFormat === "csv" ? "bg-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Format CSV / Excel
                </button>
                <button
                  type="button"
                  onClick={() => setModeImportAkunFormat("json")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                    modeImportAkunFormat === "json" ? "bg-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Format JSON
                </button>
              </div>

              {notifImport && (
                <div className="p-3 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl">
                  {notifImport}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setTeksImportAkun(
                    modeImportAkunFormat === "csv" ? TEMPLATE_CSV_AKUN : TEMPLATE_JSON_AKUN
                  )
                }
                className="text-xs font-bold text-indigo-600 underline"
              >
                Muat Contoh Template {modeImportAkunFormat.toUpperCase()}
              </button>

              <form onSubmit={handleProsesImportAkun} className="space-y-3">
                <textarea
                  rows={7}
                  required
                  value={teksImportAkun}
                  onChange={(e) => setTeksImportAkun(e.target.value)}
                  placeholder={
                    modeImportAkunFormat === "csv"
                      ? "nama,email,password,role,infoTambahan"
                      : "[ { ... } ]"
                  }
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs"
                  >
                    Proses Import Akun
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

        {/* MODAL IMPORT SOAL KUIS (CSV / EXCEL & JSON) */}
        {modalImportKuis && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" /> Import Bank Soal Kuis (CSV
                Excel / JSON)
              </h3>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setModeImportKuisFormat("csv")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                    modeImportKuisFormat === "csv" ? "bg-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Format CSV / Excel
                </button>
                <button
                  type="button"
                  onClick={() => setModeImportKuisFormat("json")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                    modeImportKuisFormat === "json" ? "bg-white shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Format JSON
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTeksImportKuis(
                    modeImportKuisFormat === "csv" ? TEMPLATE_CSV_KUIS : TEMPLATE_JSON_KUIS
                  )
                }
                className="text-xs font-bold text-indigo-600 underline"
              >
                Muat Contoh Template 5 Tipe Soal ({modeImportKuisFormat.toUpperCase()})
              </button>

              <form onSubmit={handleProsesImportKuis} className="space-y-3">
                <textarea
                  rows={8}
                  required
                  value={teksImportKuis}
                  onChange={(e) => setTeksImportKuis(e.target.value)}
                  placeholder="Tempelkan baris CSV atau JSON soal di sini..."
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-xl"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs"
                  >
                    Masukkan ke Daftar Kuis Materi
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

        {/* MODAL TAMBAH KATEGORI / PRODI */}
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
                  placeholder="Contoh: S1 Teknik Elektro / Kelas 12 Bahasa"
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
        Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • HibahIlmu.id
      </footer>
    </div>
  );
}